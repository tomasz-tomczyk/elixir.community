import {ORIGIN,reply,plunk,sign,sameOrigin,EMAIL,configured} from '../../server/signup.js';
export async function onRequestPost({request,env}) {
 if(!sameOrigin(request)) return reply('Please subscribe from elixir.community.',403);
 if(!configured(env)) return reply('Signup is not ready yet. Please try again later.',503);
 try {
  if(Number(request.headers.get('Content-Length')||0)>8192) return reply('Request too large.',413);
  const raw=await request.text(); if(raw.length>8192) return reply('Request too large.',413);
  let data; try { data=JSON.parse(raw); } catch { return reply('Invalid request.',400); }
  if(!data||typeof data!=='object'||Array.isArray(data)) return reply('Invalid request.',400); const email=String(data.email||'').trim().toLowerCase();
  if(email.length>254||!EMAIL.test(email)) return reply('Please enter a valid email address.',400);
  if(typeof data.token!=='string'||!data.token||data.token.length>2048) return reply('Please complete the security check.',400);
  const check=await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({secret:env.TURNSTILE_SECRET_KEY,response:data.token,remoteip:request.headers.get('CF-Connecting-IP')}),signal:AbortSignal.timeout(10000)}).then(r=>r.json());
  if(!check.success||check.hostname!=='elixir.community'||check.action!=='subscribe') return reply('The security check expired. Please try again.',400);
  const now=Math.floor(Date.now()/1000),requestId=crypto.randomUUID();
  const token=await sign({purpose:'newsletter-confirm',email,iat:now,exp:now+86400},env.CONFIRM_TOKEN_SECRET);
  // /v1/send defaults NEW contacts to unsubscribed and preserves existing state
  // when subscribed is omitted. POST /contacts instead defaults new contacts true.
  const url=ORIGIN+'/confirm#'+token;
  try {
   await plunk(env,'/v1/send','POST',{to:email,from:{name:'Elixir Community',email:'hello@elixir.community'},reply:'hello@elixir.community',subject:'Confirm your Elixir Community subscription',body:`<p>You asked to receive the Elixir Community newsletter.</p><p><a href="${url}">Confirm your subscription</a></p><p>The link expires in 24 hours. You will need to press the confirmation button on the page. If this wasn't you, ignore this email. You won't be subscribed.</p>`},'confirm-'+requestId);
   // The transactional send creates the new contact safely first.
   await plunk(env,'/contacts','POST',{email,data:{signup_source:'elixir.community',confirmation_requested_at:new Date().toISOString()}});
  } catch {
   // No local state: avoid automatically retrying an uncertain email send.
   return reply('We could not finish sending your confirmation. Please check your inbox before trying again.',503);
  }
  return reply('Check your inbox for a confirmation link. You are not signed up until you confirm.');
 } catch {return reply('Signup could not be completed. Please try again later.',503);}
}
export function onRequestGet() {return reply('Use the signup form.',405);}
