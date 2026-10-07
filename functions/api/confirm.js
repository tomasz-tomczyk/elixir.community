import {reply,plunk,verify,setup,sameOrigin,configured} from '../../server/signup.js';
export async function onRequestPost({request,env}) {
 if(!sameOrigin(request)) return reply('Please confirm from elixir.community.',403);
 if(!configured(env)) return reply('Confirmation is temporarily unavailable.',503);
 try {
  const raw=await request.text(); if(raw.length>4096) return reply('Invalid link.',400);
  const payload=await verify(JSON.parse(raw).token,env.CONFIRM_TOKEN_SECRET);
  if(!payload) return reply('This link is invalid or expired. Please subscribe again for a new link.',400);
  await setup(env.SIGNUP_DB);
  const row=await env.SIGNUP_DB.prepare('SELECT nonce,confirmed FROM signup_requests WHERE email=?').bind(payload.email).first();
  if(!row||row.nonce!==payload.nonce||row.confirmed) return reply('This link has already been used or replaced. Please subscribe again if needed.',400);
  const found=await plunk(env,'/contacts?search='+encodeURIComponent(payload.email)+'&limit=100');
  const contact=found.data?.find(c=>c.email.toLowerCase()===payload.email);
  if(!contact) return reply('We could not find this signup. Please subscribe again.',400);
  await plunk(env,'/contacts/'+encodeURIComponent(contact.id),'PATCH',{subscribed:true,data:{newsletter_confirmed_at:new Date().toISOString(),consent_source:'elixir.community/confirm',consent_version:'2026-10-07'}});
  await env.SIGNUP_DB.prepare('UPDATE signup_requests SET confirmed=1 WHERE email=? AND nonce=?').bind(payload.email,payload.nonce).run();
  return reply('Your subscription is confirmed. Thanks for joining Elixir Community.');
 } catch {return reply('Confirmation could not be completed. Please try again later.',503);}
}
export function onRequestGet() {return reply('Open the confirmation page and press Confirm subscription.',405);}
