// CRUMB community mission: ONE approved click per MetaMask address.
// Pre-launch accounting only: NO cryptocurrency is minted, transferred, or burned here.
import { randomBytes, createHash } from 'node:crypto';
import { getAddress, verifyMessage } from 'ethers';

const GOAL=100000, REDUCTION=9990000, SUPPLY=1000000000000;
const COUNT='crumb:mission:v1:count', MEMBERS='crumb:mission:v1:members';
function response(data,status=200){
  return Response.json(data,{status,headers:{'Cache-Control':'no-store','X-Content-Type-Options':'nosniff'}});
}
function configured(){return !!(process.env.UPSTASH_REDIS_REST_URL?.startsWith('https://') &&
  process.env.UPSTASH_REDIS_REST_TOKEN && process.env.TURNSTILE_SITE_KEY && process.env.TURNSTILE_SECRET_KEY);}
async function redis(cmd){
  const r=await fetch(process.env.UPSTASH_REDIS_REST_URL,{
    method:'POST',headers:{'Authorization':'Bearer '+process.env.UPSTASH_REDIS_REST_TOKEN,
      'Content-Type':'application/json'},body:JSON.stringify(cmd),
    signal:AbortSignal.timeout(6500),cache:'no-store'
  });
  if(!r.ok)throw Error('redis_offline');
  const data=await r.json();if(data.error)throw Error('redis_error');return data.result;
}
function address(value){
  if(typeof value!=='string'||value.length!==42)throw Error('bad_wallet');
  return getAddress(value).toLowerCase();
}
function count(value){
  const n=Number(value??0);if(!Number.isSafeInteger(n)||n<0||n>GOAL)throw Error('bad_counter');
  return n;
}
function fullResponse(n,siteKey){return {ready:true,goal:GOAL,count:n,perWallet:REDUCTION,
  plannedInitialSupply:SUPPLY,plannedCancelled:n*REDUCTION,
  plannedRemaining:SUPPLY-n*REDUCTION,siteKey};}
function message(wallet,nonce,host){
  return 'CRUMB PRE-LAUNCH MISSION\nWebsite: '+host+'\nWallet: '+wallet+
    '\nAction: I authorize exactly one free participation.\nPlanned supply reduction: 9,990,000 CRUMB.'+
    '\nNo existing token is being burned and no funds are requested.\nNonce: '+nonce;
}
async function rateLimit(request,action){
  const ip=(request.headers.get('x-vercel-forwarded-for')||
    request.headers.get('x-forwarded-for')||'unknown').split(',')[0].trim().slice(0,100);
  const hash=createHash('sha256').update(ip+'|'+process.env.UPSTASH_REDIS_REST_TOKEN.slice(-32))
    .digest('hex').slice(0,26);
  const k='crumb:mission:v1:rl:'+action+':'+Math.floor(Date.now()/60000)+':'+hash;
  const n=Number(await redis(['INCR',k]));
  if(n===1)await redis(['EXPIRE',k,120]);
  return {ok:n<=(action==='nonce'?8:12),ip};
}
async function verifyTurnstile(token,hostname,ip){
  if(typeof token!=='string'||token.length<10||token.length>2048)return false;
  const params=new URLSearchParams({secret:process.env.TURNSTILE_SECRET_KEY,response:token});
  if(ip&&ip!=='unknown')params.set('remoteip',ip);
  const r=await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify',{
    method:'POST',body:params,signal:AbortSignal.timeout(6500)});
  if(!r.ok)return false;
  const data=await r.json();
  return data.success===true && data.hostname?.toLowerCase()===hostname.toLowerCase();
}
// Atomic: nonce must exist, wallet must be unused, goal must have room; then count increments once.
const JOIN_SCRIPT=[
  "local saved=redis.call('GET',KEYS[1])",
  "if saved~=ARGV[1] then return {-2,tonumber(redis.call('GET',KEYS[3]) or '0')} end",
  "redis.call('DEL',KEYS[1])",
  "local n=tonumber(redis.call('GET',KEYS[3]) or '0')",
  "if redis.call('SISMEMBER',KEYS[2],ARGV[2])==1 then return {0,n} end",
  "if n>=100000 then return {-1,n} end",
  "redis.call('SADD',KEYS[2],ARGV[2])",
  "local total=redis.call('INCR',KEYS[3])",
  "return {1,total}"
].join('\n');

export default {
  async fetch(request){
    if(!['GET','POST'].includes(request.method))return response({error:'method_not_allowed'},405);
    if(!configured())return response({ready:false,error:'setup_required'},503);
    try{
      const url=new URL(request.url);
      if(request.method==='GET'){
        const n=count(await redis(['GET',COUNT]));
        const info=fullResponse(n,process.env.TURNSTILE_SITE_KEY);
        const wallet=url.searchParams.get('wallet');
        if(wallet)info.participated=Number(await redis(['SISMEMBER',MEMBERS,address(wallet)]))===1;
        return response(info);
      }
      if(request.headers.get('origin')!==url.origin)return response({error:'invalid_origin'},403);
      if(Number(request.headers.get('content-length')||0)>6000)return response({error:'too_large'},413);
      const body=await request.json().catch(()=>null);
      if(!body||typeof body!=='object')return response({error:'invalid_body'},400);
      const wallet=address(body.wallet);
      const action=body.action;
      if(action!=='nonce'&&action!=='participate')return response({error:'invalid_action'},400);
      const limit=await rateLimit(request,action);
      if(!limit.ok)return response({error:'rate_limited'},429);
      if(action==='nonce'){
        const already=Number(await redis(['SISMEMBER',MEMBERS,wallet]))===1;
        if(already)return response({error:'already_participated'},409);
        const n=count(await redis(['GET',COUNT]));
        if(n>=GOAL)return response({error:'mission_complete'},409);
        const nonce=randomBytes(24).toString('hex');
        const key='crumb:mission:v1:nonce:'+nonce;
        const saved=await redis(['SET',key,wallet+'|'+url.host,'EX',300,'NX']);
        if(saved!=='OK')throw Error('nonce_failed');
        return response({nonce,message:message(wallet,nonce,url.host)});
      }
      if(typeof body.nonce!=='string'||!/^[a-f0-9]{48}$/.test(body.nonce)||
        typeof body.signature!=='string'||body.signature.length>250)return response({error:'invalid_signature'},400);
      let verified;
      try {verified=verifyMessage(message(wallet,body.nonce,url.host),body.signature).toLowerCase();}
      catch {return response({error:'invalid_signature'},400);}
      if(verified!==wallet)return response({error:'wallet_mismatch'},403);
      const ok=await verifyTurnstile(body.turnstile,url.hostname,limit.ip);
      if(!ok)return response({error:'captcha_failed'},403);
      const nonceKey='crumb:mission:v1:nonce:'+body.nonce;
      const raw=await redis(['EVAL',JOIN_SCRIPT,'3',nonceKey,MEMBERS,COUNT,
        wallet+'|'+url.host,wallet]);
      if(!Array.isArray(raw)||raw.length!==2)throw Error('invalid_database_answer');
      const state=Number(raw[0]),n=count(raw[1]);
      if(state===0)return response({error:'already_participated',...fullResponse(n)},409);
      if(state===-1)return response({error:'mission_complete',...fullResponse(n)},409);
      if(state!==1)return response({error:'nonce_expired'},409);
      return response({success:true,participated:true,...fullResponse(n)});
    }catch(err){
      if(err.message==='bad_wallet')return response({error:'invalid_wallet'},400);
      return response({ready:false,error:'temporarily_unavailable'},503);
    }
  }
};
