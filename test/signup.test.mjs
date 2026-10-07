import {test} from 'node:test';
import assert from 'node:assert/strict';
import {sign,verify} from '../server/signup.js';
import {onRequestGet as subscribeGet,onRequestPost as subscribePost} from '../functions/api/subscribe.js';
import {onRequestGet as confirmGet,onRequestPost as confirmPost} from '../functions/api/confirm.js';
const secret='test-only-secret';
const payload={purpose:'newsletter-confirm',email:'test@example.com',nonce:'random',exp:Math.floor(Date.now()/1000)+3600};
test('valid signed purpose-bound token verifies',async()=>assert.deepEqual(await verify(await sign(payload,secret),secret),payload));
test('tampered signature is rejected',async()=>assert.equal(await verify((await sign(payload,secret))+'x',secret),null));
test('wrong purpose, secret and expired token are rejected',async()=>{
 assert.equal(await verify(await sign({...payload,purpose:'reset'},secret),secret),null);
 assert.equal(await verify(await sign(payload,secret),'wrong'),null);
 assert.equal(await verify(await sign({...payload,exp:1},secret),secret),null);
});
test('scanner GET cannot subscribe or confirm',()=>{assert.equal(subscribeGet().status,405);assert.equal(confirmGet().status,405)});
test('cross-origin POST cannot subscribe or confirm',async()=>{
 const request=new Request('https://elixir.community/api/subscribe',{method:'POST',headers:{Origin:'https://evil.invalid'}});
 assert.equal((await subscribePost({request,env:{}})).status,403);
 assert.equal((await confirmPost({request,env:{}})).status,403);
});
test('missing bindings fail closed',async()=>{
 const request=new Request('https://elixir.community/api/subscribe',{method:'POST',headers:{Origin:'https://elixir.community'}});
 assert.equal((await subscribePost({request,env:{}})).status,503);
});
test('signup safely creates via transactional send, then upserts without subscription flag',async()=>{
 const original=globalThis.fetch,calls=[];
 const db={prepare(sql){return {bind(...args){return this},async run(){return {meta:{changes:1}}}}}};
 globalThis.fetch=async(url,opts)=>{
  calls.push({url,body:opts?.body?JSON.parse(opts.body):null});
  if(url.includes('siteverify'))return Response.json({success:true,hostname:'elixir.community',action:'subscribe'});
  if(url.endsWith('/v1/send')) return Response.json({success:true,data:{emails:[]}});
  return Response.json({id:'contact-1'});
 };
 try {
  const env={PLUNK_SECRET_KEY:'test',TURNSTILE_SECRET_KEY:'test',CONFIRM_TOKEN_SECRET:'test',SIGNUP_DB:db};
  const request=new Request('https://elixir.community/api/subscribe',{method:'POST',headers:{Origin:'https://elixir.community'},body:JSON.stringify({email:'TEST@example.com',token:'valid-token'})});
  assert.equal((await subscribePost({request,env})).status,200);
  assert.deepEqual(calls.map(c=>new URL(c.url).pathname),['/turnstile/v0/siteverify','/v1/send','/contacts']);
  assert.equal(calls[1].body.to,'test@example.com');
  assert.equal(Object.hasOwn(calls[1].body,'subscribed'),false);
  assert.equal(Object.hasOwn(calls[2].body,'subscribed'),false);
 } finally {globalThis.fetch=original}
});
test('atomic cooldown prevents contact changes and repeated send',async()=>{
 const original=globalThis.fetch;let calls=0;
 globalThis.fetch=async()=>{calls++;return Response.json({success:true,hostname:'elixir.community',action:'subscribe'})};
 const db={prepare(){return {bind(){return this},async run(){return {meta:{changes:0}}}}}};
 try {
  const request=new Request('https://elixir.community/api/subscribe',{method:'POST',headers:{Origin:'https://elixir.community'},body:JSON.stringify({email:'test@example.com',token:'valid-token'})});
  assert.equal((await subscribePost({request,env:{PLUNK_SECRET_KEY:'test',TURNSTILE_SECRET_KEY:'test',CONFIRM_TOKEN_SECRET:'test',SIGNUP_DB:db}})).status,429);
  assert.equal(calls,1);
 }finally{globalThis.fetch=original}
});
test('explicit confirmation matches exact contact and sets consent',async()=>{
 const original=globalThis.fetch,calls=[];
 globalThis.fetch=async(url,opts)=>{
  calls.push({url,body:opts?.body?JSON.parse(opts.body):null});
  if(url.includes('?search='))return Response.json({data:[{id:'wrong',email:'prefix-test@example.com'},{id:'exact',email:'test@example.com'}]});
  return Response.json({id:'exact',subscribed:true});
 };
 const db={prepare(){return {bind(){return this},async run(){return {meta:{changes:1}}},async first(){return {nonce:payload.nonce,confirmed:0}}}}};
 try{
  const token=await sign(payload,secret);
  const request=new Request('https://elixir.community/api/confirm',{method:'POST',headers:{Origin:'https://elixir.community'},body:JSON.stringify({token})});
  assert.equal((await confirmPost({request,env:{PLUNK_SECRET_KEY:'test',TURNSTILE_SECRET_KEY:'test',CONFIRM_TOKEN_SECRET:secret,SIGNUP_DB:db}})).status,200);
  assert.equal(new URL(calls[1].url).pathname,'/contacts/exact');assert.equal(calls[1].body.subscribed,true);
 }finally{globalThis.fetch=original}
});
