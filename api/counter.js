// CRUMB global counter — server-side Redis REST storage only.
// Configure UPSTASH_REDIS_REST_URL and UPSTASH_REDIS_REST_TOKEN in Vercel production.
// Never send credentials to the browser. No demo or fictional totals.
const COUNTER_KEY = 'crumb:community:taps:v1';
const LIMIT_PER_MINUTE = 180;

function json(body, status = 200) {
  return Response.json(body, {status,headers:{
    'Cache-Control':'no-store, max-age=0',
    'X-Content-Type-Options':'nosniff',
    'Access-Control-Allow-Origin':'none'
  }});
}

async function callRedis(command, url, token) {
  const response = await fetch(url, {
    method:'POST',
    headers:{'Authorization':'Bearer '+token,'Content-Type':'application/json'},
    body:JSON.stringify(command),
    cache:'no-store',
    signal:AbortSignal.timeout(6000)
  });
  if (!response.ok) throw new Error('Counter backend unavailable');
  const payload = await response.json();
  if (payload.error) throw new Error('Counter backend rejected request');
  return payload.result;
}

function validTotal(value) {
  const n = Number(value ?? 0);
  if (!Number.isSafeInteger(n) || n < 0) throw new Error('Invalid counter value');
  return n;
}

export default {
  async fetch(request) {
    if (request.method !== 'GET' && request.method !== 'POST') {
      return json({error:'method_not_allowed'},405);
    }
    const url = process.env.UPSTASH_REDIS_REST_URL || process.env.KV_REST_API_URL;
    const token = process.env.UPSTASH_REDIS_REST_TOKEN || process.env.KV_REST_API_TOKEN;
    if (!url || !token || !/^https:\/\//.test(url)) {
      return json({ready:false,error:'counter_not_configured'},503);
    }
    try {
      if (request.method === 'GET') {
        const value = await callRedis(['GET',COUNTER_KEY],url,token);
        return json({ready:true,total:validTotal(value)});
      }
      // Only same-origin browser posts; IP-based rate limiting is additional,
      // not a guarantee against sophisticated bots or distributed attacks.
      const origin = request.headers.get('origin');
      if (origin && origin !== new URL(request.url).origin) return json({error:'forbidden_origin'},403);
      const length = Number(request.headers.get('content-length') || '0');
      if (!Number.isFinite(length) || length > 256) return json({error:'request_too_large'},413);
      const rawIP = request.headers.get('x-vercel-forwarded-for')
        || request.headers.get('x-forwarded-for')
        || 'unknown';
      const ip = rawIP.split(',')[0].trim().slice(0,100);
      const data = new TextEncoder().encode(ip+'|'+token.slice(-24));
      const digest = await crypto.subtle.digest('SHA-256',data);
      const fingerprint = Array.from(new Uint8Array(digest), b=>b.toString(16).padStart(2,'0')).join('').slice(0,24);
      const bucket = Math.floor(Date.now()/60000);
      const rateKey = 'crumb:rate:'+bucket+':'+fingerprint;
      const used = validTotal(await callRedis(['INCR',rateKey],url,token));
      if (used === 1) await callRedis(['EXPIRE',rateKey,120],url,token);
      if (used > LIMIT_PER_MINUTE) return json({error:'rate_limited'},429);
      const total = validTotal(await callRedis(['INCR',COUNTER_KEY],url,token));
      return json({ready:true,total});
    } catch {
      return json({ready:false,error:'counter_temporarily_unavailable'},503);
    }
  }
};
