import { test } from 'node:test';
import assert from 'node:assert/strict';
import { EUROPE_PROMPT_COUNTRIES, promptForCountry, regionPresentation, regionResponse } from '../lib/consent-region.mjs';
import { EXPIRY_DAYS, REFUSAL_DAYS, STORAGE_KEY, REFUSAL_KEY, readSavedChoice, readRefusals, recordRefusals, hasRefusal, automaticPrompt, tracePrompt } from '../public/consent/policy.mjs';
const env = { VERCEL:'1', VERCEL_URL:'ahv-preview.vercel.app' };
const headers = (country='DE') => new Headers({host:env.VERCEL_URL,'x-forwarded-host':env.VERCEL_URL,'x-vercel-id':'bom1::test','x-vercel-ip-country':country});
const store = () => {const values=new Map();return {getItem:key=>values.get(key)||null,setItem:(key,value)=>values.set(key,value),removeItem:key=>values.delete(key)};};
for (let start=0;start<EUROPE_PROMPT_COUNTRIES.length;start+=24) test(`EEA/UK/CH automatic prompt batch ${start/24+1}`,()=>{
  for(const country of EUROPE_PROMPT_COUNTRIES.slice(start,start+24)) assert.equal(promptForCountry(country),'automatic',country);
});
test('other recognized jurisdictions use passive presentation, never implied permission',()=>{
  for(const country of ['US','CA','BR','IN','CN','JP','KR','SG','AU','NZ','ZA','TR','AE','SA']) assert.equal(promptForCountry(country),'passive',country);
  assert.equal(promptForCountry('BT'),'passive');
  for(const country of [null,undefined,'','XX','T1','de',' DE','DE,US','UK','EU']) assert.equal(promptForCountry(country),'automatic');
});
test('only direct current Vercel deployment can reduce prompt; custom origin and forged headers fail strict',()=>{
  assert.equal(regionPresentation(headers('BT'),env).prompt,'passive');
  assert.equal(regionPresentation(headers('BT'),{}).prompt,'automatic');
  for(const name of ['cf-ray','cf-ipcountry','cf-connecting-ip','true-client-ip','forwarded','via']) {const h=headers('BT');h.set(name,'spoofed');assert.equal(regionPresentation(h,env).prompt,'automatic',name);}
  for(const host of ['ayurvedichealingvillage.com','www.ayurvedichealingvillage.com','evil.vercel.app','ahv-preview.vercel.app.evil.com','127.0.0.1']) {const h=headers('BT');h.set('host',host);h.set('x-forwarded-host',host);assert.equal(regionPresentation(h,env).prompt,'automatic',host);}
  for(const name of ['x-forwarded-host','x-vercel-id','x-vercel-ip-country']) {const h=headers('BT');h.delete(name);assert.equal(regionPresentation(h,env).prompt,'automatic',name);}
});
test('each regional request is independent, uncached, and exposes neither country nor identifiers',async()=>{
  for(const country of ['BT','DE','BT','US']) {
    const response=regionResponse(headers(country),env);
    for(const key of ['cache-control','cdn-cache-control','vercel-cdn-cache-control']) assert.match(response.headers.get(key),/no-store/);
    assert.equal(response.headers.has('set-cookie'),false);
    assert.deepEqual(await response.json(),{version:1,prompt:['BT','US'].includes(country)?'passive':'automatic'});
  }
});
test('client fetch omits cookies/referrer, cannot cache, and validates response',async()=>{
  const response=()=>Response.json({version:1,prompt:'passive'});
  assert.equal(await automaticPrompt(async(url,options)=>{assert.equal(url,'/api/consent-region/');assert.equal(options.cache,'no-store');assert.equal(options.credentials,'omit');assert.equal(options.referrerPolicy,'no-referrer');assert.equal(options.redirect,'error');return response();}),false);
  for(const value of [{version:2,prompt:'passive'},{prompt:'passive'},{version:1,prompt:'unknown'},null]) assert.equal(await automaticPrompt(async()=>Response.json(value)),true);
  assert.equal(await automaticPrompt(async()=>new Response('html')),true);
  assert.equal(await automaticPrompt(async()=>new Response('',{status:503})),true);
  assert.equal(await automaticPrompt(async()=>{throw Error('offline')}),true);
});
test('timeout covers stalled fetch and stalled response body',async()=>{
  for(const fetcher of [()=>new Promise(()=>{}),async()=>({ok:true,headers:new Headers({'content-type':'application/json'}),json:()=>new Promise(()=>{})})]) assert.equal(await automaticPrompt(fetcher,10),true);
});
test('stored grants require bounded real timestamps, expiry, categories, and supported revision',()=>{
  const storage=store(),now=Date.now(),last=now-1000;
  const valid={categories:['necessary','analytics'],revision:2,consentId:'test',consentTimestamp:new Date(last).toISOString(),lastConsentTimestamp:new Date(last).toISOString(),expirationTime:last+EXPIRY_DAYS*86400000};
  storage.setItem(STORAGE_KEY,JSON.stringify(valid));assert.ok(readSavedChoice(storage,now));
  for(const change of [{revision:3},{consentTimestamp:'invalid'},{lastConsentTimestamp:new Date(now+1000).toISOString()},{expirationTime:last+1000*86400000},{expirationTime:1},{categories:['unknown']},{consentId:null}]) {storage.setItem(STORAGE_KEY,JSON.stringify({...valid,...change}));assert.equal(readSavedChoice(storage,now),null);}
});
test('refusals survive grant renewal without granting, extending on visits, or resisting explicit user change',()=>{
  const storage=store(),now=Date.now(),at=now-183*86400000;
  recordRefusals(storage,['analytics'],at);let record=readRefusals(storage,now);
  assert.equal(record.advertising,at);assert.equal(record.analytics,undefined);assert.equal(hasRefusal(record),true);
  recordRefusals(storage,['analytics'],now);assert.equal(readRefusals(storage,now).advertising,at);
  recordRefusals(storage,['analytics','advertising'],now,{explicit:true});assert.equal(hasRefusal(readRefusals(storage,now)),false);
});
test('refusal cooldown lasts at least twelve months, expires without a grant, and rejects malformed timestamps',()=>{
  const storage=store(),now=Date.now(),at=now-365*86400000;
  recordRefusals(storage,[],at);assert.equal(hasRefusal(readRefusals(storage,now)),true);
  assert.equal(hasRefusal(readRefusals(storage,at+REFUSAL_DAYS*86400000)),false);
  for(const record of [{version:2,advertising:now},{version:1,advertising:now+1},{version:1,advertising:'today'}]) {storage.setItem(REFUSAL_KEY,JSON.stringify(record));assert.equal(hasRefusal(readRefusals(storage,now)),false);}
});
test('GPC can remove advertising but cannot revoke valid analytics or grant any permission',()=>{
  const storage=store(),at=Date.now();
  recordRefusals(storage,['analytics'],at,{gpc:true});assert.deepEqual(readRefusals(storage,at),{version:1,advertising:at});
  recordRefusals(storage,['analytics','advertising'],at,{explicit:true,gpc:true});assert.equal(readRefusals(storage,at).advertising,at);
});
test('blocked storage fails safely',()=>{
  const storage={getItem(){throw Error('blocked')},setItem(){throw Error('blocked')}};
  assert.equal(readSavedChoice(storage),null);assert.equal(hasRefusal(readRefusals(storage)),false);
  assert.equal(hasRefusal(recordRefusals(storage,[])),true);
});
const publicOrigin='https://ayurvedichealingvillage.com';
const trace=(country='IN',now=Date.now())=>`h=ayurvedichealingvillage.com\nloc=${country}\nts=${now/1000}\nip=ignored-fixture\n`;
test('Cloudflare trace consumes only known country, matching host and fresh timestamp',()=>{
  const now=Date.now();
  assert.equal(tracePrompt(trace('IN',now),publicOrigin,now),false);
  for(const country of ['DE','GB','CH','XX','US,IN','in','']) assert.equal(tracePrompt(trace(country,now),publicOrigin,now),true,country);
  for(const text of [trace('IN',now)+'loc=US\n',trace('IN',now)+'h=ayurvedichealingvillage.com\n',trace('IN',now)+'ts=123\n',trace('IN',now-60001),trace('IN',now+10001),trace('IN',now).replace('h=ayurvedichealingvillage.com','h=evil.test'),trace('IN',now).replace(/ts=.+/,'ts=invalid'),'x'.repeat(4097)]) assert.equal(tracePrompt(text,publicOrigin,now),true);
  assert.equal(tracePrompt(trace('IN',now),'https://evil.test',now),true);
});
test('Cloudflare adapter rejects cache reuse, redirects, host mismatch, errors and oversized bodies',async()=>{
  const response=(text=trace(),extra={})=>{
    const value=new Response(text,{headers:{'content-type':'text/plain',...extra}});
    Object.defineProperty(value,'url',{value:publicOrigin+'/cdn-cgi/trace'});return value;
  };
  assert.equal(await automaticPrompt(async(url,options)=>{assert.equal(url,publicOrigin+'/cdn-cgi/trace');assert.equal(options.credentials,'omit');assert.equal(options.referrerPolicy,'no-referrer');assert.equal(options.cache,'no-store');assert.equal(options.redirect,'error');return response();},1500,publicOrigin),false);
  for(const extra of [{'age':'1'},{'age':'bad'},{'cf-cache-status':'HIT'},{'cf-cache-status':'STALE'},{'content-type':'text/html'},{'content-length':'4097'}]) assert.equal(await automaticPrompt(async()=>response(trace(),extra),1500,publicOrigin),true);
  assert.equal(await automaticPrompt(async()=>response('x'.repeat(4097)),1500,publicOrigin),true);
  assert.equal(await automaticPrompt(async()=>new Response(trace(),{headers:{'content-type':'text/plain'}}),1500,publicOrigin),true);
  assert.equal(await automaticPrompt(async()=>{const r=response();Object.defineProperty(r,'redirected',{value:true});return r;},1500,publicOrigin),true);
  assert.equal(await automaticPrompt(()=>new Promise(()=>{}),10,publicOrigin),true);
});
test('successive regional traces cannot share state between visitors or origins',async()=>{
  for(const country of ['IN','DE','US','CH']) {
    const fetcher=async()=>{const r=new Response(trace(country),{headers:{'content-type':'text/plain'}});Object.defineProperty(r,'url',{value:publicOrigin+'/cdn-cgi/trace'});return r;};
    assert.equal(await automaticPrompt(fetcher,1500,publicOrigin),['DE','CH'].includes(country));
  }
});
