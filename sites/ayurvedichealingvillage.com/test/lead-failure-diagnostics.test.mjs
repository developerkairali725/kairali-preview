import assert from 'node:assert/strict';
import test from 'node:test';
import { deliverLeadToSheet, uploadApplicationFileToDrive, leadFailureDiagnostic } from '../lib/lead-sheet-bridge.ts';
test('Sheet failure diagnostics use fixed categories and preserve transport', async (t) => {
const originalFetch = globalThis.fetch, originalTimeout = globalThis.setTimeout;
const urlKey='AHV_LEAD_SHEET_WEBHOOK_URL',secretKey='AHV_LEAD_SHEET_WEBHOOK_SECRET';
const oldUrl=process.env[urlKey],oldSecret=process.env[secretKey];
process.env[urlKey]='https://script.google.com/macros/s/fixture/exec';process.env[secretKey]='SYNTHETIC_SECRET';
const privateMarker='SYNTHETIC_PRIVATE_PAYLOAD';
let sends=0;
async function run(name, fn){await t.test(name,fn);}
async function failure(reason, fetcher){globalThis.fetch=fetcher;let caught;try{await deliverLeadToSheet('contact',{message:privateMarker},'SYNTHETIC_TOKEN');}catch(e){caught=e;}assert.ok(caught);const record=leadFailureDiagnostic('sheet',caught);assert.deepEqual(record,{event:'ahv_lead_failure',stage:'sheet',reason});assert.ok(!JSON.stringify([record,String(caught)]).includes(privateMarker));}
try {
 await run('success preserves authenticated single POST and redirect contract',async()=>{
  globalThis.fetch=async(url,opts)=>{sends++;assert.equal(url,process.env[urlKey]);assert.equal(opts.redirect,'follow');assert.equal(opts.cache,'no-store');assert.equal(opts.method,'POST');const body=JSON.parse(opts.body);assert.equal(body.secret,'SYNTHETIC_SECRET');assert.equal(body.submissionToken,'SYNTHETIC_TOKEN');assert.equal(body.row.message,privateMarker);return new Response('{"result":"success"}');};
  await deliverLeadToSheet('contact',{message:privateMarker},'SYNTHETIC_TOKEN');assert.equal(sends,1);
 });
 await run('receiver JSON error classified without provider text',()=>failure('RECEIVER_REJECTED',async()=>new Response(JSON.stringify({result:'error',message:privateMarker}))));
 await run('HTTP 403 category only',()=>failure('HTTP_4XX',async()=>new Response(privateMarker,{status:403})));
 await run('HTTP 503 category only',()=>failure('HTTP_5XX',async()=>new Response(privateMarker,{status:503})));
 await run('unexpected HTTP status',()=>failure('HTTP_OTHER',async()=>new Response(null,{status:302})));
 await run('invalid JSON category only',()=>failure('INVALID_JSON',async()=>new Response(privateMarker)));
 await run('null JSON invalid reply',()=>failure('INVALID_REPLY',async()=>new Response('null')));
 await run('array JSON invalid reply',()=>failure('INVALID_REPLY',async()=>new Response('[]')));
 await run('missing acknowledgement stays failure',()=>failure('RECEIVER_REJECTED',async()=>new Response('{}')));
 await run('network error discards error message',()=>failure('TRANSPORT',async()=>{throw new Error(privateMarker);}));
 await run('response stream failure distinct from JSON',()=>failure('BODY_READ',async()=>({ok:true,status:200,text:async()=>{throw new Error(privateMarker);}})));
 await run('timeout classified without changing 15000ms limit',async()=>{
  globalThis.setTimeout=(callback,ms)=>{assert.equal(ms,15000);queueMicrotask(callback);return originalTimeout(()=>{},1);};
  try{await failure('TIMEOUT',async(_url,opts)=>new Promise((_resolve,reject)=>opts.signal.addEventListener('abort',()=>reject(new Error(privateMarker)),{once:true})));}finally{globalThis.setTimeout=originalTimeout;}
 });
 await run('missing configuration never fetches',async()=>{delete process.env[secretKey];try{await failure('CONFIG',async()=>{throw new Error('FETCH MUST NOT RUN');});}finally{process.env[secretKey]='SYNTHETIC_SECRET';}});
 await run('forged arbitrary errors never serialized',async()=>{assert.deepEqual(leadFailureDiagnostic('sheet',{reason:privateMarker,message:privateMarker}),{event:'ahv_lead_failure',stage:'sheet',reason:'UNKNOWN'});assert.deepEqual(leadFailureDiagnostic('store',new Error(privateMarker)),{event:'ahv_lead_failure',stage:'store',reason:'STORE_UNCONFIRMED'});});
 await run('shared upload reply contract preserved',async()=>{globalThis.fetch=async()=>new Response('{"result":"success","fileUrl":"https://example.test/file","fileId":"fixture"}');assert.deepEqual(await uploadApplicationFileToDrive({submissionToken:'fixture',purpose:'resume',originalName:'fixture.pdf',mimeType:'application/pdf',base64:'Zml4dHVyZQ==',sha256:'fixture'}),{fileUrl:'https://example.test/file',fileId:'fixture'});});
}finally{globalThis.fetch=originalFetch;globalThis.setTimeout=originalTimeout;for(const [key,val]of[[urlKey,oldUrl],[secretKey,oldSecret]])if(val===undefined)delete process.env[key];else process.env[key]=val;}
});
