// CRUMB AI Studio. Intentionally disabled until owner sets OPENAI_API_KEY
// and AI_STUDIO_ENABLED=true in Vercel Production. No cost incurred otherwise.
import { randomBytes, createHash } from 'node:crypto';
import { getAddress, verifyMessage } from 'ethers';

export const maxDuration = 120;

const MODEL = 'gpt-image-1-mini', MONTH_CAP=100, DAY_CAP=10;
const PREFIX='crumb:ai:v1:';
const respond=(obj,status=200)=>Response.json(obj,{status,headers:{
  'Cache-Control':'no-store','X-Content-Type-Options':'nosniff'
}});
function redisURL(){return process.env.KV_REST_API_URL||process.env.UPSTASH_REDIS_REST_URL;}
function redisToken(){return process.env.KV_REST_API_TOKEN||process.env.UPSTASH_REDIS_REST_TOKEN;}
function enabled(){return process.env.AI_STUDIO_ENABLED==='true'&&
  !!process.env.OPENAI_API_KEY&&!!process.env.TURNSTILE_SECRET_KEY&&
  !!process.env.TURNSTILE_SITE_KEY&&!!redisURL()&&!!redisToken();}
async function redis(command){
  const r=await fetch(redisURL(),{method:'POST',headers:{
    Authorization:'Bearer '+redisToken(),'Content-Type':'application/json'},
    body:JSON.stringify(command),signal:AbortSignal.timeout(7000),cache:'no-store'});
  if(!r.ok)throw Error('storage_unavailable');
  const value=await r.json();if(value.error)throw Error('storage_error');return value.result;
}
function walletAddress(raw){
  if(typeof raw!=='string'||!/^0x[0-9a-fA-F]{40}$/.test(raw))throw Error('bad_wallet');
  return getAddress(raw).toLowerCase();
}
const nLimit=(name,fallback,max)=>Math.min(max,Math.max(1,Number.parseInt(process.env[name]||String(fallback),10)||fallback));
function challengeText(wallet,nonce,host){
  return 'CRUMB AI STUDIO\nWebsite: '+host+'\nWallet: '+wallet+
    '\nAction: Request one free AI image, subject to available quota.'+
    '\nThis is a message signature, NOT a blockchain transaction.'+
    '\nNonce: '+nonce;
}
const RESERVE_SCRIPT=[
  "if redis.call('GET',KEYS[1])~=ARGV[1] then return -3 end",
  "redis.call('DEL',KEYS[1])",
  "if redis.call('EXISTS',KEYS[2])==1 then return -1 end",
  "if tonumber(redis.call('GET',KEYS[3]) or '0')>=tonumber(ARGV[2]) then return -2 end",
  "if tonumber(redis.call('GET',KEYS[4]) or '0')>=tonumber(ARGV[3]) then return -2 end",
  "if tonumber(redis.call('GET',KEYS[5]) or '0')>=2 then return -4 end",
  "redis.call('SET',KEYS[2],'1','EX',172800)",
  "redis.call('INCR',KEYS[3]);redis.call('EXPIRE',KEYS[3],3456000)",
  "redis.call('INCR',KEYS[4]);redis.call('EXPIRE',KEYS[4],172800)",
  "redis.call('INCR',KEYS[5]);redis.call('EXPIRE',KEYS[5],172800)",
  "return 1"
].join('\n');
async function rateLimit(req){
  const ip=(req.headers.get('x-vercel-forwarded-for')||req.headers.get('x-forwarded-for')||'unknown')
    .split(',')[0].trim().slice(0,100);
  const ipHash=createHash('sha256').update(ip+'|'+redisToken()).digest('hex').slice(0,32);
  const minute=Math.floor(Date.now()/60000);
  const key=PREFIX+'challenge:'+minute+':'+ipHash;
  const value=Number(await redis(['INCR',key]));
  if(value===1)await redis(['EXPIRE',key,130]);
  return {ok:value<=5,ip,ipHash};
}
async function verifyCaptcha(token,host,ip){
  if(typeof token!=='string'||token.length<10||token.length>2048)return false;
  const data=new URLSearchParams({secret:process.env.TURNSTILE_SECRET_KEY,response:token});
  if(ip!=='unknown')data.set('remoteip',ip);
  const r=await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify',{
    method:'POST',body:data,signal:AbortSignal.timeout(7000)});
  if(!r.ok)return false;
  const result=await r.json();
  return result.success===true&&result.hostname?.toLowerCase()===host.toLowerCase();
}
function promptFor(raw,format){
  const hint={
    square:'Square social media art, 1:1 composition.',
    banner:'Cinematic wide banner, 3:2 composition with a clear focal point.',
    sticker:'Sticker design with transparent-looking plain backdrop, full visible character, bold contour.',
  }[format];
  return [
    'Make one original, polished, friendly, 3D CGI social-media image of CRUMB.',
    'Use the provided attached image as the ONLY character identity reference. Preserve CRUMB\'s exact',
    'green face, muscular proportions, head shape, eyes, and recognizable design. Do not substitute a different alien.',
    'CRUMB is an original, genderless fictional character; no nudity details or anatomy.',
    hint,'Keep the character visible and well-framed. No cryptocurrencies, price claims or invented endorsements.',
    'User creative direction: '+raw
  ].join(' ');
}
async function imageEdit(prompt,size,referenceImage){
  const base64=referenceImage.slice('data:image/png;base64,'.length);
  if(!/^[A-Za-z0-9+/]+={0,2}$/.test(base64)||base64.length>1700000)throw Error('invalid_reference');
  const imageBytes=Buffer.from(base64,'base64');
  if(imageBytes.length<2000||imageBytes.length>1250000||
    imageBytes.subarray(0,8).toString('hex')!=='89504e470d0a1a0a')throw Error('invalid_reference');
  const data=new FormData();
  data.append('model',MODEL);
  data.append('prompt',prompt);
  data.append('image',new Blob([imageBytes],{type:'image/png'}),'crumb.png');
  data.append('n','1');data.append('size',size);data.append('quality','low');
  data.append('output_format','webp');data.append('output_compression','80');
  if(size==='1024x1024'&&prompt.includes('Sticker design'))data.append('background','transparent');
  data.append('moderation','auto');
  const r=await fetch('https://api.openai.com/v1/images/edits',{
    method:'POST',headers:{Authorization:'Bearer '+process.env.OPENAI_API_KEY},
    body:data,signal:AbortSignal.timeout(95000)});
  const out=await r.json().catch(()=>null);
  if(!r.ok||!out?.data?.[0]?.b64_json)throw Error('provider_unavailable');
  return out.data[0].b64_json;
}
async function handle(req){
  if(req.method==='GET')return respond({ready:enabled(),model:'budget',maxMonthlyImages:MONTH_CAP,quotaPolicy:'1 per wallet per UTC day, 2 per IP per UTC day, 10 total per UTC day; monthly cap 100',siteKey:enabled()?process.env.TURNSTILE_SITE_KEY:null});
  if(req.method!=='POST')return respond({error:'method_not_allowed'},405);
  if(!enabled())return respond({ready:false,error:'not_enabled'},503);
  const url=new URL(req.url);
  if(req.headers.get('origin')!==url.origin)return respond({error:'invalid_origin'},403);
  if(!String(req.headers.get('content-type')||'').startsWith('application/json'))return respond({error:'invalid_type'},415);
  if(Number(req.headers.get('content-length')||0)>1900000)return respond({error:'too_large'},413);
  let data;
  try{data=await req.json();}catch{return respond({error:'invalid_json'},400);}
  if(!data||typeof data!=='object')return respond({error:'invalid_request'},400);
  let wallet;try{wallet=walletAddress(data.wallet)}catch{return respond({error:'invalid_wallet'},400);}
  try{
    if(data.action==='challenge'){
      const {ok}=await rateLimit(req);
      if(!ok)return respond({error:'rate_limited'},429);
      const nonce=randomBytes(24).toString('hex');
      const key=PREFIX+'nonce:'+nonce;
      const state=await redis(['SET',key,wallet+'|'+url.host,'EX',300,'NX']);
      if(state!=='OK')throw Error('nonce_failed');
      return respond({nonce,message:challengeText(wallet,nonce,url.host)});
    }
    if(data.action!=='generate')return respond({error:'invalid_action'},400);
    if(typeof data.prompt!=='string'||data.prompt.trim().length<5||data.prompt.length>320||
      /[\x00-\x08\x0B\x0C\x0E-\x1F]/.test(data.prompt))
      return respond({error:'invalid_prompt'},400);
    const format=data.format;
    if(!['square','banner','sticker'].includes(format))return respond({error:'invalid_format'},400);
    if(typeof data.nonce!=='string'||!/^[a-f0-9]{48}$/.test(data.nonce)||
      typeof data.signature!=='string'||data.signature.length>250)
      return respond({error:'invalid_signature'},400);
    let signed;
    try{signed=verifyMessage(challengeText(wallet,data.nonce,url.host),data.signature).toLowerCase();}
    catch{return respond({error:'invalid_signature'},400);}
    if(signed!==wallet)return respond({error:'wrong_wallet'},403);
    const ip=(req.headers.get('x-vercel-forwarded-for')||req.headers.get('x-forwarded-for')||'unknown').split(',')[0].trim().slice(0,100);
    if(!await verifyCaptcha(data.turnstile,url.hostname,ip))return respond({error:'captcha_failed'},403);
    if(typeof data.referenceImage!=='string'||!data.referenceImage.startsWith('data:image/png;base64,')||
      data.referenceImage.length>1700050)return respond({error:'invalid_reference'},400);
    // Quota is reserved before the paid provider request; provider failures do not
    // automatically refund. This is conservative and limits abuse/spending.
    const utc=new Date().toISOString(),day=utc.slice(0,10),month=utc.slice(0,7);
    const hash=createHash('sha256').update(ip+'|'+redisToken()).digest('hex').slice(0,32);
    const claim=Number(await redis(['EVAL',RESERVE_SCRIPT,'5',
      PREFIX+'nonce:'+data.nonce,
      PREFIX+'wallet:'+day+':'+wallet,
      PREFIX+'month:'+month,
      PREFIX+'day:'+day,
      PREFIX+'ip:'+day+':'+hash,
      wallet+'|'+url.host,MONTH_CAP,DAY_CAP]));
    if(claim===-1)return respond({error:'wallet_daily_limit'},429);
    if(claim===-2)return respond({error:'studio_budget_limit'},429);
    if(claim===-4)return respond({error:'ip_daily_limit'},429);
    if(claim!==1)return respond({error:'expired_challenge'},409);
    const size=format==='banner'?'1536x1024':'1024x1024';
    const base64=await imageEdit(promptFor(data.prompt.trim(),format),size,data.referenceImage);
    return respond({success:true,image:'data:image/webp;base64,'+base64,format});
  }catch{return respond({error:'temporarily_unavailable'},503);}
}
export default async function handler(req,res){
  const host=String(req.headers.host||'');
  if(!/^[a-zA-Z0-9.:-]+$/.test(host))return res.status(400).json({error:'invalid_host'});
  const headers=new Headers();
  for(const [k,v] of Object.entries(req.headers))if(v!==undefined)
    headers.set(k,Array.isArray(v)?v.join(','):String(v));
  const input=new Request('https://'+host+(req.url||'/api/ai-image'),{
    method:req.method,headers,...(req.method==='POST'?{body:JSON.stringify(req.body||{})}:{})});
  const out=await handle(input);
  res.status(out.status);
  for(const [key,val] of out.headers)if(key!=='content-length')res.setHeader(key,val);
  return res.send(await out.text());
}
