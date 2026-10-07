import {test} from 'node:test';
import assert from 'node:assert/strict';
import {sign,verify} from '../server/signup.js';
import {onRequestGet as subscribeGet,onRequestPost as subscribePost} from '../functions/api/subscribe.js';
import {onRequestGet as confirmGet,onRequestPost as confirmPost} from '../functions/api/confirm.js';
const secret='test-only-secret',now=Math.floor(Date.now()/1000);
const payload={purpose:'newsletter-confirm',email:'test@example.com',iat:now,exp:now+86400};
const env={PLUNK_SECRET_KEY:'test',TURNSTILE_SECRET_KEY:'test',CONFIRM_TOKEN_SECRET:secret};
const request=(path,data,origin='https://elixir.community')=>new Request('https://elixir.community/api/'+path,{method:'POST',headers:{Origin:origin},body:JSON.stringify(data)});
test('valid signed 24h purpose-bound token verifies without a nonce',async()=>assert.deepEqual(await verify(await sign(payload,secret),secret),payload));
test('tampered payload, signature and wrong secret are rejected',async()=>{
 const token=await sign(payload,secret);
 assert.equal(await verify(token+'x',secret),null);
 const changed=Buffer.from(JSON.stringify({...payload,email:'attacker@example.com'})).toString('base64url');
 assert.equal(await verify(changed+'.'+token.split('.')[1],secret),null);
 assert.equal(await verify(token,'wrong'),null);
});
test('expired, boundary, future, malformed and wrong-purpose tokens are rejected',async()=>{
 for(const p of [{...payload,purpose:'reset'},{...payload,iat:1,exp:86401},{...payload,iat:now-86400,exp:now},{...payload,iat:now+3600,exp:now+90000},{...payload,exp:now+172800},{...payload,email:'invalid'},{...payload,email:'TEST@example.com'},{...payload,iat:undefined}]) assert.equal(await verify(await sign(p,secret),secret),null);
 assert.equal(await verify('invalid',secret),null);
});
test('scanner GET cannot subscribe or confirm',()=>{assert.equal(subscribeGet().status,405);assert.equal(confirmGet().status,405)});
test('cross-origin POST cannot subscribe or confirm',async()=>{
 assert.equal((await subscribePost({request:request('subscribe',{},'https://evil.invalid'),env})).status,403);
 assert.equal((await confirmPost({request:request('confirm',{},'https://evil.invalid'),env})).status,403);
});
test('missing secrets fail closed; D1 is not required',async()=>assert.equal((await subscribePost({request:request('subscribe',{}),env:{}})).status,503));
test('signup safely sends then upserts without altering subscription state',async()=>{
 const original=globalThis.fetch,calls=[];
 globalThis.fetch=async(url,opts)=>{
  calls.push({url,body:opts?.body?JSON.parse(opts.body):null});
  if(url.includes('siteverify'))return Response.json({success:true,hostname:'elixir.community',action:'subscribe'});
  return Response.json({id:'contact-1'});
 };
 try {
  assert.equal((await subscribePost({request:request('subscribe',{email:'TEST@example.com',token:'valid-token'}),env})).status,200);
  assert.deepEqual(calls.map(c=>new URL(c.url).pathname),['/turnstile/v0/siteverify','/v1/send','/contacts']);
  assert.equal(calls[1].body.to,'test@example.com');
  assert.equal(Object.hasOwn(calls[1].body,'subscribed'),false);
  assert.equal(Object.hasOwn(calls[2].body,'subscribed'),false);
  const token=calls[1].body.body.match(/\/confirm#([^"<]+)/)[1];
  const p=await verify(token,secret);assert.equal(p.email,'test@example.com');assert.equal(p.exp-p.iat,86400);assert.equal(Object.hasOwn(p,'nonce'),false);
 }finally{globalThis.fetch=original}
});
test('invalid Turnstile action, hostname or response prevents all email/contact effects',async()=>{
 const original=globalThis.fetch;let calls=0;
 try {
  for(const result of [{success:false},{success:true,hostname:'evil.invalid',action:'subscribe'},{success:true,hostname:'elixir.community',action:'wrong'}]) {
   calls=0;globalThis.fetch=async()=>{calls++;return Response.json(result)};
   assert.equal((await subscribePost({request:request('subscribe',{email:'test@example.com',token:'used-token'}),env})).status,400);assert.equal(calls,1);
  }
 }finally{globalThis.fetch=original}
});
test('explicit confirmation matches exact contact and records consent in Plunk only',async()=>{
 const original=globalThis.fetch,calls=[];
 globalThis.fetch=async(url,opts)=>{
  calls.push({url,body:opts?.body?JSON.parse(opts.body):null});
  if(url.includes('?search='))return Response.json({data:[{id:'wrong',email:'prefix-test@example.com'},{id:'exact',email:'test@example.com',subscribed:false}]});
  return Response.json({id:'exact',subscribed:true});
 };
 try{
  assert.equal((await confirmPost({request:request('confirm',{token:await sign(payload,secret)}),env})).status,200);
  assert.equal(new URL(calls[1].url).pathname,'/contacts/exact');assert.equal(calls[1].body.subscribed,true);
  assert.equal(calls[1].body.data.consent_source,'elixir.community/confirm');
 }finally{globalThis.fetch=original}
});
test('reusable valid token returns success for subscribed contact without rewriting consent',async()=>{
 const original=globalThis.fetch;let calls=0;
 globalThis.fetch=async()=>{calls++;return Response.json({data:[{id:'exact',email:'test@example.com',subscribed:true}]})};
 try{assert.equal((await confirmPost({request:request('confirm',{token:await sign(payload,secret)}),env})).status,200);assert.equal(calls,1)}finally{globalThis.fetch=original}
});
test('expired/tampered confirmation and invalid signup input make no external calls',async()=>{
 const original=globalThis.fetch;let calls=0;globalThis.fetch=async()=>{calls++;throw new Error('unexpected')};
 try {
  for(const token of [await sign({...payload,iat:1,exp:86401},secret),(await sign(payload,secret))+'x']) assert.equal((await confirmPost({request:request('confirm',{token}),env})).status,400);
  for(const data of [null,[],{email:'bad',token:'x'},{email:'test@example.com'},{email:'test@example.com',token:42}]) assert.equal((await subscribePost({request:request('subscribe',data),env})).status,400);
  assert.equal(calls,0);
 }finally{globalThis.fetch=original}
});
test('deleted contact cannot be recreated or subscribed by a confirmation link',async()=>{
 const original=globalThis.fetch;let calls=0;globalThis.fetch=async()=>{calls++;return Response.json({data:[]})};
 try{assert.equal((await confirmPost({request:request('confirm',{token:await sign(payload,secret)}),env})).status,400);assert.equal(calls,1)}finally{globalThis.fetch=original}
});
