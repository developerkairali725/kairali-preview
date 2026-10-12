import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {TRANSITION_SCHEMA,APPROVED_VALIDATOR_DELTA,digest,inputChanges,validateTransitionInputs,certifiedRows,validateRetainedProof,validateReceiptLineage,checkedJson,assertRetainedBody,assertRendererUnchanged,loadValidatorTransition} from '../tools/capture-validator-transition.mjs';
const clone=x=>JSON.parse(JSON.stringify(x));
const hash=n=>digest(n);
const proof={errors:[],heading:'Complete page',bodyChars:500,requiredForm:true,requiredContent:true,forbiddenContent:false};
const snapshot={route:'/page/',file:'l10n/prerender/de/page.html.gz',sha256:hash('body')};
const original={startedAt:'earlier',sourceSignature:hash('old'),renderInputs:[{file:'app/page.tsx',sha256:hash('page')}],base:'http://127.0.0.1:3218',batchSize:25,targetLocales:['de'],locales:{de:{routes:['/page/','/next/'],completed:['/page/'],batches:[{snapshots:[snapshot]}],attempts:[{status:0,routes:['/page/']}]}}};
function inputs(){
 const sources=[{file:'l10n/generated/de.json',sha256:hash('data')}];
 const beforeRenderInputs=[{file:'app/page.tsx',sha256:hash('renderer')},...Object.entries(APPROVED_VALIDATOR_DELTA).map(([file,value])=>({file,sha256:value[0]})),{file:'tools/package-locale-prerenders.mjs',sha256:hash('old-contract')}].sort((a,b)=>a.file.localeCompare(b.file));
 const afterRenderInputs=beforeRenderInputs.map(row=>({...row,sha256:APPROVED_VALIDATOR_DELTA[row.file]?.[1]|| (row.file==='tools/package-locale-prerenders.mjs'?hash('new-contract'):row.sha256)})).concat([{file:'tools/capture-validator-transition.mjs',sha256:hash('transition-module')}]).sort((a,b)=>a.file.localeCompare(b.file));
 const originalSourceSignature=digest(JSON.stringify({sources,renderInputs:beforeRenderInputs}));
 const validationSourceSignature=digest(JSON.stringify({sources,renderInputs:afterRenderInputs}));
 const english={rows:beforeRenderInputs,sourceSignature:digest(JSON.stringify(beforeRenderInputs))};
 const manifest={schema:TRANSITION_SCHEMA,frozenCommit:'5cbe5cd80ad1dd5ca2a3a5124e7ba5e1f842e5ed',sources,beforeRenderInputs,afterRenderInputs,originalSourceSignature,validationSourceSignature,english,changes:inputChanges(beforeRenderInputs,afterRenderInputs)};
 return {manifest,current:{sources,renderInputs:afterRenderInputs,sourceSignature:validationSourceSignature}};
}
test('transition recomputes both complete source signatures and permits only the reviewed validator/contract delta',()=>{
 const {manifest,current}=inputs();assert.doesNotThrow(()=>validateTransitionInputs(manifest,current));
 for(const field of ['originalSourceSignature','validationSourceSignature']){const bad=clone(manifest);bad[field]=hash('forged');assert.throws(()=>validateTransitionInputs(bad,current),/recomputed/);}
 const bad=clone(current);bad.sources[0].sha256=hash('changed translation');assert.throws(()=>validateTransitionInputs(manifest,bad),/inventory differs/);
});
test('renderer, unlisted tool, deleted input and forged reviewed-validator changes fail closed',()=>{
 for(const file of ['app/page.tsx','tools/unreviewed.mjs','tools/capture-page-guard.mjs']){
  const {manifest}=inputs();const row=manifest.afterRenderInputs.find(row=>row.file===file);if(row)row.sha256=hash('different');else manifest.afterRenderInputs.push({file,sha256:hash('unknown')});
  manifest.afterRenderInputs.sort((a,b)=>a.file.localeCompare(b.file));manifest.changes=inputChanges(manifest.beforeRenderInputs,manifest.afterRenderInputs);
  manifest.validationSourceSignature=digest(JSON.stringify({sources:manifest.sources,renderInputs:manifest.afterRenderInputs}));
  assert.throws(()=>validateTransitionInputs(manifest,{sources:manifest.sources,renderInputs:manifest.afterRenderInputs,sourceSignature:manifest.validationSourceSignature}),/non-validator|reviewed patch/);
 }
 const {manifest,current}=inputs();const bad=clone(current);bad.renderInputs.pop();assert.throws(()=>validateTransitionInputs(manifest,bad),/inventory differs/);
});
test('renderer callsite accepts only the exact locale argument insertion, not extraction/readiness changes',()=>{
 const before='EXTRACT unchanged; captureContentRequirements(route.path, enquiryRecords.find(row => row.path === route.path)); timeout=45000;';
 const after=before.replace('=== route.path))','=== route.path), LOCALE)');
 assert.doesNotThrow(()=>assertRendererUnchanged(before,after));
 assert.throws(()=>assertRendererUnchanged(before,after.replace('45000','1')),/renderer\/extraction changed/);
 assert.throws(()=>assertRendererUnchanged(before,after.replace('EXTRACT unchanged','EXTRACT modified')),/renderer\/extraction changed/);
});
test('only original certified batches count; duplicate or missing completion coverage is rejected',()=>{
 assert.equal(certifiedRows(original).length,1);
 for(const alter of [r=>r.locales.de.completed.push('/next/'),r=>r.locales.de.batches.push(clone(r.locales.de.batches[0])),r=>r.locales.de.routes.splice(0,1)]){
  const bad=clone(original);alter(bad);assert.throws(()=>certifiedRows(bad),/coverage/);
 }
});
test('retained body revalidation requires both unchanged original proofs, unique-runtime proof and current proof',()=>{
 const certified={...snapshot,locale:'de',variant:'mobile'};
 const index={path:'/page/',ok:true,liveRuntimeVerified:true,liveContentProof:proof,contentProof:proof};
 const row={...certified,indexRowSha256:digest(JSON.stringify(index)),liveContentProof:proof,contentProof:proof,revalidatedContentProof:proof};
 assert.doesNotThrow(()=>validateRetainedProof(certified,row,index));
 for(const key of ['liveContentProof','contentProof','revalidatedContentProof']){const bad=clone(row);delete bad[key];assert.throws(()=>validateRetainedProof(certified,bad,index));}
 for(const alter of [r=>r.liveContentProof.heading='forged',r=>r.revalidatedContentProof.errors=['component error'],r=>r.revalidatedContentProof.bodyChars=10,r=>r.revalidatedContentProof.requiredForm=false,r=>r.sha256=hash('tampered')]){const bad=clone(row);alter(bad);assert.throws(()=>validateRetainedProof(certified,bad,index));}
 assert.throws(()=>validateRetainedProof(certified,row,{...index,liveRuntimeVerified:false}),/runtime index/);
});
test('original receipt signatures, inputs, batches and attempts stay unchanged; new batches need actual current epoch',()=>{
 const current=hash('current'),working=clone(original);
 working.locales.de.completed.push('/next/');working.locales.de.batches.push({captureSourceSignature:current,snapshots:[{route:'/next/',file:'l10n/prerender/de/next.html.gz',sha256:hash('next')}]});working.locales.de.attempts.push({captureSourceSignature:current,routes:['/next/'],status:0});
 assert.doesNotThrow(()=>validateReceiptLineage(working,original,current));
 for(const alter of [r=>r.sourceSignature=current,r=>r.renderInputs[0].sha256=current,r=>r.locales.de.batches[0].snapshots[0].sha256=current,r=>r.locales.de.attempts[0].status=1,r=>delete r.locales.de.batches[1].captureSourceSignature,r=>r.locales.de.batches[1].captureSourceSignature=hash('forged'),r=>delete r.locales.de.attempts[1].captureSourceSignature]){const bad=clone(working);alter(bad);assert.throws(()=>validateReceiptLineage(bad,original,current));}
});
test('immutable original/evidence hashes and independently supplied manifest digest reject forgery and body tampering',()=>{
 const site=fileURLToPath(new URL('../',import.meta.url)),directory=fs.mkdtempSync(path.join(site,'.validator-transition-test-'));
 try{
  const file=path.join(directory,'proof.json');fs.writeFileSync(file,'{}');const expected=digest('{}');
  assert.deepEqual(checkedJson({file,sha256:expected}),{});assertRetainedBody(file,expected);
  assert.throws(()=>checkedJson({file,sha256:hash('wrong')}),/evidence hash mismatch/);
  assert.throws(()=>loadValidatorTransition({site,file,sha256:hash('forged'),current:{}}),/evidence hash mismatch/);
  fs.writeFileSync(file,'{"tampered":true}');assert.throws(()=>assertRetainedBody(file,expected),/snapshot body changed/);assert.throws(()=>checkedJson({file,sha256:expected}),/evidence hash mismatch/);
 }finally{fs.rmSync(directory,{recursive:true,force:true});}
});
