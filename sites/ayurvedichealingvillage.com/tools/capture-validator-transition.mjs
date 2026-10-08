/** A narrowly reviewed validator-only transition. Original capture receipts and
 * signatures remain unchanged; this attests validation under a new tool version.
 * The manifest digest is an explicit, independently reviewed input, never inferred
 * from a receipt. No rendering input is generally excluded from source signatures.
 */
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import {assertCapturePage} from './capture-page-guard.mjs';

export const TRANSITION_SCHEMA = 'ahv-validator-only-transition/v1';
export const APPROVED_VALIDATOR_DELTA = Object.freeze({
 'tools/capture-page-guard.mjs': ['9705d4113b00a2470e69f11c1a0d91d9c8b853b25cdedf4c82f04f16685ad95f','291435bab248ce4ad5f19631e1c8dbc5f611581561fcd800c41a8f6e260ee8f4'],
 'tools/prerender-english.mjs': ['310a7ae1afe94bba03da4777dcd499a783439a6c07eaaecad0d965dcb04cd656','37d12ae49048bc927f4af1c7c0bea3f125bba12bd381a9b3cc2d57657ad0a559'],
});
const CONTRACT_FILES = new Set(['tools/package-locale-prerenders.mjs','tools/capture-validator-transition.mjs']);
export const digest = value => crypto.createHash('sha256').update(value).digest('hex');
const equal = (a,b) => JSON.stringify(a) === JSON.stringify(b);
const fail = message => { throw Error('Validator transition: '+message); };
const readJson = file => JSON.parse(fs.readFileSync(file,'utf8'));
const hashFile = file => digest(fs.readFileSync(file));
function rowsMap(rows) {
 if(!Array.isArray(rows)||rows.some(row=>!row||typeof row.file!=='string'||!/^[a-f0-9]{64}$/.test(row.sha256)))fail('invalid input inventory');
 const map=new Map(rows.map(row=>[row.file,row.sha256]));
 if(map.size!==rows.length||!equal(rows.map(row=>row.file),[...map.keys()].sort()))fail('duplicate or unsorted input inventory');
 return map;
}
export function inputChanges(before,after) {
 const a=rowsMap(before),b=rowsMap(after);
 return [...new Set([...a.keys(),...b.keys()])].sort().filter(file=>a.get(file)!==b.get(file)).map(file=>({file,before:a.get(file)||null,after:b.get(file)||null}));
}
export function validateTransitionInputs(manifest,current) {
 if(manifest?.schema!==TRANSITION_SCHEMA||manifest.frozenCommit!=='5cbe5cd80ad1dd5ca2a3a5124e7ba5e1f842e5ed')fail('unrecognized transition');
 rowsMap(manifest.sources); rowsMap(manifest.beforeRenderInputs); rowsMap(manifest.afterRenderInputs);
 if(!equal(manifest.sources,current.sources)||!equal(manifest.afterRenderInputs,current.renderInputs))fail('current rendering/source inventory differs from reviewed transition');
 const beforeSignature=digest(JSON.stringify({sources:manifest.sources,renderInputs:manifest.beforeRenderInputs}));
 const afterSignature=digest(JSON.stringify({sources:current.sources,renderInputs:current.renderInputs}));
 if(manifest.originalSourceSignature!==beforeSignature||manifest.validationSourceSignature!==afterSignature||current.sourceSignature!==afterSignature)fail('source signature cannot be recomputed');
 const changes=inputChanges(manifest.beforeRenderInputs,manifest.afterRenderInputs);
 if(!equal(changes,manifest.changes))fail('declared input delta differs');
 for(const change of changes) {
  const approved=APPROVED_VALIDATOR_DELTA[change.file];
  if(approved) { if(change.before!==approved[0]||change.after!==approved[1])fail('validator change differs from reviewed patch'); }
  else if(!CONTRACT_FILES.has(change.file)||!change.after)fail('non-validator rendering/tool input changed: '+change.file);
 }
 for(const file of Object.keys(APPROVED_VALIDATOR_DELTA))if(!changes.some(row=>row.file===file))fail('reviewed validator delta missing');
 if(!changes.some(row=>row.file==='tools/capture-validator-transition.mjs'&&row.before===null))fail('transition implementation must be an explicitly hashed new input');
 if(!manifest.english||digest(JSON.stringify(manifest.english.rows))!==manifest.english.sourceSignature)fail('original English source signature cannot be recomputed');
 return {beforeSignature,afterSignature,changes};
}
export function checkedJson(reference) {
 if(!reference||!path.isAbsolute(reference.file)||!/^[a-f0-9]{64}$/.test(reference.sha256)||hashFile(reference.file)!==reference.sha256)fail('immutable evidence hash mismatch');
 return readJson(reference.file);
}
export function certifiedRows(receipt) {
 const rows=[];
 if(receipt.locales) {
  for(const [locale,state] of Object.entries(receipt.locales)) {
   const captured=state.batches.flatMap(batch=>{if(!batch.snapshots.length||batch.snapshots.length>25)fail('invalid original batch');return batch.snapshots;});
   if(captured.some(row=>!state.routes.includes(row.route))||new Set(captured.map(row=>row.route)).size!==captured.length||!equal(captured.map(row=>row.route),state.completed))fail('original completed coverage differs from certified batches');
   for(const row of captured)rows.push({...row,locale,variant:'mobile'});
  }
 } else {
  if(receipt.complete!==true)fail('original English capture is incomplete');
  for(const batch of receipt.batches) {
   if(!batch.routes.length||batch.routes.length>25||batch.routes.length!==batch.files.length)fail('invalid original English batch');
   for(let i=0;i<batch.files.length;i++)rows.push({...batch.files[i],route:batch.routes[i],locale:'en',variant:batch.variant});
  }
 }
 if(new Set(rows.map(row=>row.file)).size!==rows.length)fail('duplicate certified snapshot');
 return rows;
}
export function validateRetainedProof(certified,row,indexRow) {
 if(!row||row.file!==certified.file||row.sha256!==certified.sha256||row.route!==certified.route||row.locale!==certified.locale||row.variant!==certified.variant)fail('missing or different retained-body revalidation');
 if(!indexRow||indexRow.path!==row.route||!indexRow.ok||!indexRow.liveRuntimeVerified||digest(JSON.stringify(indexRow))!==row.indexRowSha256)fail('original unique runtime index proof missing or changed');
 if(!equal(indexRow.liveContentProof,row.liveContentProof)||!equal(indexRow.contentProof,row.contentProof))fail('original body/runtime proof changed');
 assertCapturePage(row.liveContentProof,row.route);
 assertCapturePage(row.contentProof,row.route);
 assertCapturePage(row.revalidatedContentProof,row.route);
}
/** Retained metadata stays literal. Only appended attempts, completed routes and
 * batches may grow; each appended batch explicitly records its actual epoch. */
export function validateReceiptLineage(receipt,original,currentSignature) {
 for(const key of ['startedAt','sourceSignature','renderInputs','base','batchSize','targetLocales'])if(!equal(receipt[key],original[key]))fail('original receipt field changed: '+key);
 for(const [locale,before]of Object.entries(original.locales)) {
  const now=receipt.locales?.[locale];
  if(!now||!equal(now.routes,before.routes))fail('original route inventory changed');
  for(const key of ['completed','batches','attempts'])if(!equal((now[key]||[]).slice(0,(before[key]||[]).length),before[key]||[]))fail('original certified lineage changed: '+key);
 }
 for(const [locale,state]of Object.entries(receipt.locales)) {
  if(!receipt.targetLocales.includes(locale))fail('unexpected worker locale');
  const originalBatchCount=original.locales[locale]?.batches.length||0;
  for(const batch of state.batches.slice(originalBatchCount))if(batch.captureSourceSignature!==currentSignature)fail('fresh batch lacks current capture source signature');
  for(const attempt of (state.attempts||[]).slice(original.locales[locale]?.attempts?.length||0))if(attempt.captureSourceSignature!==currentSignature)fail('fresh attempt lacks current capture source signature');
  certifiedRows({locales:{[locale]:state}});
 }
}
export function assertRetainedBody(file,expectedHash) {
 if(hashFile(file)!==expectedHash)fail('retained snapshot body changed');
}
export function assertRendererUnchanged(before,after) {
 const needle='captureContentRequirements(route.path, enquiryRecords.find(row => row.path === route.path))';
 if(before.split(needle).length!==2||before.replace(needle,'captureContentRequirements(route.path, enquiryRecords.find(row => row.path === route.path), LOCALE)')!==after)fail('renderer/extraction changed beyond locale argument');
}
export function loadValidatorTransition({site,file,sha256,current}) {
 if(!file||!/^[a-f0-9]{64}$/.test(sha256||''))fail('explicit reviewed manifest path and digest required');
 const reference={file:path.resolve(file),sha256},manifest=checkedJson(reference);
 validateTransitionInputs(manifest,current);
 // EXTRACT, readiness checks, timing, writing and all other capture statements
 // must be byte-identical. The sole call-site edit supplies the locale to guards.
 const before=fs.readFileSync(manifest.rendererBefore.file,'utf8');
 if(hashFile(manifest.rendererBefore.file)!==manifest.rendererBefore.sha256||manifest.rendererBefore.sha256!==APPROVED_VALIDATOR_DELTA['tools/prerender-english.mjs'][0])fail('original renderer evidence changed');
 assertRendererUnchanged(before,fs.readFileSync(path.join(site,'tools/prerender-english.mjs'),'utf8'));
 for(const row of manifest.english.rows) {
  const currentHash=hashFile(path.resolve(site,row.file)),approved=APPROVED_VALIDATOR_DELTA[row.file];
  if(currentHash!==row.sha256&&(!approved||row.sha256!==approved[0]||currentHash!==approved[1]))fail('English serving input changed: '+row.file);
 }
 const certificate=checkedJson(manifest.certificate);
 if(certificate.complete!==true||certificate.failure||certificate.version!==1||certificate.guardSha256!==APPROVED_VALIDATOR_DELTA['tools/capture-page-guard.mjs'][1]||!certificate.completedAt)fail('retained body validation version mismatch');
 if(!equal(certificate.originalReceipts,manifest.originalReceipts))fail('original receipt references differ');
 const originals=new Map(),expected=[];
 for(const ref of manifest.originalReceipts) {
  const receipt=checkedJson(ref);
  if(receipt.invalidatedAt)fail('invalidated original receipt');
  if(receipt.locales) {
   if(receipt.sourceSignature!==manifest.originalSourceSignature||!equal(receipt.renderInputs,manifest.beforeRenderInputs))fail('original worker source inputs differ');
  } else if(receipt.sourceSignature!==manifest.english.sourceSignature)fail('original English signature differs');
  originals.set(ref.sha256,{receipt,reference:ref});expected.push(...certifiedRows(receipt).map(row=>({...row,originalReceipt:ref.file}))); 
 }
 if(new Set(expected.map(row=>row.file)).size!==expected.length||certificate.rows.length!==expected.length)fail('retained certificate coverage mismatch');
 const certRows=new Map(certificate.rows.map(row=>[row.file,row]));
 if(certRows.size!==certificate.rows.length)fail('duplicate retained validation');
 const indexes=new Map();
 for(let start=0;start<expected.length;start+=25)for(const captured of expected.slice(start,start+25)) {
  const row=certRows.get(captured.file);
  if(!row)fail('retained body revalidation missing');
  assertRetainedBody(path.join(site,captured.file),captured.sha256);
  const expectedIndex=path.posix.dirname(captured.file)+'/index.json';
  if(row.originalReceipt!==captured.originalReceipt||row.indexFile!==expectedIndex)fail('retained row belongs to a different original receipt/index');
  const key=row.indexSource+'|'+row.indexSha256;
  if(!indexes.has(key))indexes.set(key,checkedJson({file:row.indexSource,sha256:row.indexSha256}));
  const matches=indexes.get(key).routes.filter(record=>record.path===captured.route);
  if(matches.length!==1)fail('original runtime index is not unique');
  validateRetainedProof(captured,row,matches[0]);
  const currentMatches=readJson(path.join(site,expectedIndex)).routes.filter(record=>record.path===captured.route);
  if(currentMatches.length!==1||!equal(currentMatches[0],matches[0]))fail('retained current runtime index proof changed');
 }
 return {
  reference,manifest,originals,
  validateReceipt(receipt) {
   if(!equal(receipt.validatorTransition?.manifest,reference)||receipt.currentValidationSourceSignature!==current.sourceSignature)fail('working receipt transition binding changed');
   const original=originals.get(receipt.validatorTransition.originalReceiptSha256);
   if(!original?.receipt.locales)fail('working receipt has no immutable original worker');
   validateReceiptLineage(receipt,original.receipt,current.sourceSignature);
   return original;
  },
  attach(receipt) {
   const raw=digest(JSON.stringify(receipt));
   const original=[...originals.values()].find(entry=>entry.receipt.locales&&digest(JSON.stringify(entry.receipt))===raw);
   if(!original)fail('working receipt is not an immutable original');
   return {...receipt,currentValidationSourceSignature:current.sourceSignature,validatorTransition:{schema:TRANSITION_SCHEMA,manifest:reference,originalReceiptSha256:original.reference.sha256}};
  }
 };
}
