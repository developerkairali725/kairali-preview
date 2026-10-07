import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import {spawn,spawnSync} from 'node:child_process';
import {selectCaptureLocales,takeLocaleLocks,takeEvidenceLock} from '../tools/locale-capture-coordination.mjs';
import {fileURLToPath} from 'node:url';

const site=fileURLToPath(new URL('../',import.meta.url));
function fixture(){
 const root=fs.mkdtempSync(path.join(site,'.ahv-locale-capture-test-'));
 const put=(file,value)=>{const dest=path.join(root,file);fs.mkdirSync(path.dirname(dest),{recursive:true});fs.writeFileSync(dest,typeof value==='string'?value:JSON.stringify(value));};
 for(const file of ['tools/package-locale-prerenders.mjs','tools/capture-validator-transition.mjs','tools/locale-capture-coordination.mjs','tools/capture-page-guard.mjs','tools/capture-failure-diagnostics.mjs','tools/capture-locales-parallel.mjs','tools/restore-locale-prerenders.mjs','tools/download-release-asset.mjs','tools/verify-interaction-only-source.mjs','tools/l10n/prerender-manifest.mjs','tools/l10n/sources-lite.mjs']){const dest=path.join(root,file);fs.mkdirSync(path.dirname(dest),{recursive:true});fs.copyFileSync(path.join(site,file),dest);}
 put('english-candidate/locale-prerenders-release.json',{archive:'ahv-locale-prerenders-before.tar.gz',asset:'ahv-locale-prerenders-before.tar.gz',repository:'fixture',tag:'fixture',sources:[],files:[],interactionOnlySources:[]});
 put('app/(english)/_families/native-pages.tsx','const NATIVE = new Set(["/search/"]);');
 put('english-candidate/route-manifest.json',{routes:Array.from({length:26},(_,i)=>({path:i?`/route-${i}/`:'/'})).concat([{path:'/search/'}])});
 put('english-candidate/redirect-map.json',{redirects:{}});
 put('l10n/locales.json',{en:{prefix:''},de:{prefix:'de'}});
 put('l10n/routes.json',{routes:{'/search/':{de:'/de/search/'},...Object.fromEntries(Array.from({length:26},(_,i)=>[i?`/route-${i}/`:'/',{de:i?`/de/route-${i}/`:'/de/'}]))}});
 put('l10n/generated/de.json',{missingUnits:0,missingSample:[]});
 put('l10n/source/units.json',{sourceSetHash:'fixture'});
 put('public/ahv/l10n/de/views/view.json',{template:'current translated body'});
 put('tools/prerender-english.mjs',`
  import fs from 'node:fs';import path from 'node:path';import {gzipSync} from 'node:zlib';
  const arg=n=>process.argv[process.argv.indexOf('--'+n)+1];
  if(!process.argv.includes('--require-live-runtime')||!process.argv.includes('--block-external'))throw Error('Safe capture flags missing');
  const paths=arg('only').split(',');if(paths.length>25)throw Error('Batch exceeds25');
  const base='l10n/prerender/'+arg('locale');fs.mkdirSync(base,{recursive:true});const ip=base+'/index.json';
  const index=fs.existsSync(ip)?JSON.parse(fs.readFileSync(ip)): {routes:[]};
  for(const p of paths){const file=(p==='/'?'index':p.replace(/^\\/+|\\/+$/g,'').replace(/[^a-z0-9._-]+/gi,'_'))+'.html';fs.writeFileSync(base+'/'+file+'.gz',gzipSync('<main>'+p+'</main>'));const proof={errors:[],heading:'Fixture heading',bodyChars:250,requiredForm:true,requiredContent:true,forbiddenContent:false};const row={path:p,file,ok:true,liveRuntimeVerified:true,contentProof:proof,liveContentProof:proof};index.routes=index.routes.filter(r=>r.path!==p);index.routes.push(row);}
  fs.writeFileSync(ip,JSON.stringify(index));
 `);
 const run=(...args)=>spawnSync(process.execPath,['tools/package-locale-prerenders.mjs','--evidence',path.join(root,'evidence'),...args],{cwd:root,encoding:'utf8'});
 return {root,put,run,cleanup:()=>fs.rmSync(root,{recursive:true,force:true})};
}
test('packager requires exact-source complete live capture, enforces25-route batches and preserves restore guard',()=>{
 const x=fixture();try{
  let r=x.run('--package','--archive','ahv-locale-prerenders-fixture.tar.gz');assert.notEqual(r.status,0,'No receipt cannot package');
  r=x.run('--capture','--base','http://127.0.0.1:3218');assert.equal(r.status,0,r.stderr);
  const receipt=JSON.parse(fs.readFileSync(path.join(x.root,'evidence/capture-receipt.json')));assert.equal(receipt.complete,true);assert.deepEqual(receipt.locales.de.batches.map(b=>b.snapshots.length),[25,1]);
  const receiptFile=path.join(x.root,'evidence/capture-receipt.json'),originalReceipt=fs.readFileSync(receiptFile);
  fs.writeFileSync(receiptFile,JSON.stringify({...receipt,invalidatedAt:new Date().toISOString()}));
  r=x.run('--package','--archive','ahv-locale-prerenders-fixture.tar.gz');assert.notEqual(r.status,0);assert.match(r.stderr,/exact current source/);
  fs.writeFileSync(receiptFile,originalReceipt);
  const diagnosticsFile=path.join(x.root,'tools/capture-failure-diagnostics.mjs'),diagnosticsBytes=fs.readFileSync(diagnosticsFile);
  fs.appendFileSync(diagnosticsFile,'\n// diagnostic input drift\n');
  r=x.run('--package','--archive','ahv-locale-prerenders-fixture.tar.gz');assert.notEqual(r.status,0);assert.match(r.stderr,/exact current source/);
  fs.writeFileSync(diagnosticsFile,diagnosticsBytes);
  x.put('public/ahv/l10n/de/views/view.json',{template:'changed after capture'});
  r=x.run('--package','--archive','ahv-locale-prerenders-fixture.tar.gz');assert.notEqual(r.status,0);assert.match(r.stderr,/exact current source/);
  r=x.run('--capture','--resume','--base','http://127.0.0.1:3218');assert.notEqual(r.status,0);assert.match(r.stderr,/source\/base changed/);
  x.put('public/ahv/l10n/de/views/view.json',{template:'current translated body'});
  x.put('l10n/prerender/de/index.html.gz','tampered snapshot');
  r=x.run('--package','--archive','ahv-locale-prerenders-fixture.tar.gz');assert.notEqual(r.status,0);assert.match(r.stderr,/Snapshot changed after capture/);
  r=x.run('--capture','--base','http://127.0.0.1:3218');assert.equal(r.status,0,r.stderr);
  r=x.run('--package','--archive','ahv-locale-prerenders-fixture.tar.gz');assert.equal(r.status,0,r.stderr);assert.match(r.stdout,/Verified 27 locale snapshot files/);
  const spec=JSON.parse(fs.readFileSync(path.join(x.root,'english-candidate/locale-prerenders-release.json')));assert.equal(spec.files.length,27);assert.ok(spec.sources.some(row=>row.file.endsWith('/view.json')));
 }finally{x.cleanup();}
});
test('new untranslated source blocks capture before any snapshot mutation',()=>{
 const x=fixture();try{x.put('l10n/generated/de.json',{missingUnits:1,missingSample:['New source']});const r=x.run('--capture','--base','http://127.0.0.1:3218');assert.notEqual(r.status,0);assert.match(r.stderr,/Untranslated\/new source units remain/);assert.equal(fs.existsSync(path.join(x.root,'l10n/prerender')),false);}finally{x.cleanup();}
});

test('only live-runtime timeouts retry sequentially once and retain both attempts',()=>{
 const x=fixture();try{
  const file=path.join(x.root,'tools/prerender-english.mjs');
  let mock=fs.readFileSync(file,'utf8');
  mock=mock.replace('fs.writeFileSync(ip,JSON.stringify(index));',`if(paths.includes('/route-2/')&&!fs.existsSync('.first-timeout')){fs.writeFileSync('.first-timeout','1');Object.assign(index.routes.find(r=>r.path==='/route-2/'),{ok:false,error:'TimeoutError: page.waitForFunction: Timeout 45000ms exceeded.'});process.exitCode=1;}fs.writeFileSync(ip,JSON.stringify(index));`);
  fs.writeFileSync(file,mock);
  let r=x.run('--capture','--base','http://127.0.0.1:3218','--concurrency','3');assert.equal(r.status,0,r.stderr);
  const receipt=JSON.parse(fs.readFileSync(path.join(x.root,'evidence/capture-receipt.json')));
  assert.equal(receipt.complete,true);const attempts=receipt.locales.de.attempts;
  assert.equal(attempts[0].failed[0].path,'/route-2/');assert.equal(attempts[0].status,1);
  assert.deepEqual(attempts[1].routes,['/route-2/']);assert.equal(attempts[1].concurrency,1);assert.equal(attempts[1].retry,true);assert.equal(attempts[1].status,0);
  fs.rmSync(path.join(x.root,'.first-timeout'));
  fs.writeFileSync(file,mock.replace("&&!fs.existsSync('.first-timeout')",''));
  r=x.run('--capture','--base','http://127.0.0.1:3218');assert.notEqual(r.status,0);assert.match(r.stderr,/Sequential strict capture retry failed/);
 }finally{x.cleanup();}
});

test('locale and evidence locks reject overlapping writers and partial capture stays incomplete',()=>{
 const x=fixture();try{
  assert.throws(()=>selectCaptureLocales('de,de',['de']),/unique subset/);
  assert.throws(()=>selectCaptureLocales('de,,fr',['de','fr']),/unique subset/);
  assert.throws(()=>selectCaptureLocales('zh',['zh-Hans']),/unique subset/);
  const release=takeLocaleLocks(x.root,['de']);
  let r=x.run('--capture','--base','http://127.0.0.1:3218');assert.notEqual(r.status,0);assert.match(r.stderr,/writer lock/);
  release();
  const releaseEvidence=takeEvidenceLock(path.join(x.root,'evidence'));
  r=x.run('--capture','--base','http://127.0.0.1:3218');assert.notEqual(r.status,0);assert.match(r.stderr,/writer lock/);
  releaseEvidence();
  r=x.run('--capture','--base','http://127.0.0.1:3218','--locales','de','--max-batches','1');assert.equal(r.status,0,r.stderr);
  let receipt=JSON.parse(fs.readFileSync(path.join(x.root,'evidence/capture-receipt.json')));
  assert.equal(receipt.complete,false);assert.equal(receipt.locales.de.completed.length,25);
  r=x.run('--package','--archive','ahv-locale-prerenders-fixture.tar.gz');assert.notEqual(r.status,0);
  r=x.run('--capture','--resume','--base','http://127.0.0.1:3218','--locales','de');assert.equal(r.status,0,r.stderr);
  receipt=JSON.parse(fs.readFileSync(path.join(x.root,'evidence/capture-receipt.json')));
  assert.equal(receipt.complete,true);assert.equal(receipt.locales.de.completed.length,26);
 }finally{x.cleanup();}
});

test('disjoint parallel workers merge only complete exact-source nonduplicated content proofs',async()=>{
 const x=fixture();try{
  x.put('l10n/locales.json',{en:{prefix:''},de:{prefix:'de'},fr:{prefix:'fr'}});
  const table=JSON.parse(fs.readFileSync(path.join(x.root,'l10n/routes.json')));
  for(const row of Object.values(table.routes))row.fr=row.de.replace('/de/','/fr/');
  x.put('l10n/routes.json',table);
  x.put('l10n/generated/fr.json',{missingUnits:0,missingSample:[]});
  x.put('public/ahv/l10n/fr/views/view.json',{template:'current translated body'});
  const dirs=['one','two'].map(name=>path.join(x.root,name));
  const worker=(locale,evidence)=>new Promise(resolve=>{
   const child=spawn(process.execPath,['tools/package-locale-prerenders.mjs','--capture','--base','http://127.0.0.1:3218','--locales',locale,'--evidence',evidence],{cwd:x.root});
   let stderr='';child.stderr.on('data',value=>{stderr+=value;});child.on('exit',status=>resolve({status,stderr}));
  });
  const results=await Promise.all([worker('de',dirs[0]),worker('fr',dirs[1])]);for(const r of results)assert.equal(r.status,0,r.stderr);
  let r=x.run('--merge-captures',dirs.join(','));assert.equal(r.status,0,r.stderr);
  const merged=JSON.parse(fs.readFileSync(path.join(x.root,'evidence/capture-receipt.json')));
  assert.equal(merged.complete,true);assert.deepEqual(Object.keys(merged.locales).sort(),['de','fr']);
  const mergedFile=path.join(x.root,'evidence/capture-receipt.json'),mergedBytes=fs.readFileSync(mergedFile);
  for(const workers of [[],[merged.workers[0]],[merged.workers[0],merged.workers[0]]]){
   fs.writeFileSync(mergedFile,JSON.stringify({...merged,workers}));
   const rejected=x.run('--package','--archive','ahv-locale-prerenders-forged.tar.gz');assert.notEqual(rejected.status,0);assert.match(rejected.stderr,/worker lineage|worker locale|locale coverage/i);
  }
  fs.writeFileSync(mergedFile,mergedBytes);
  r=x.run('--merge-captures',[dirs[0],dirs[0]].join(','));assert.notEqual(r.status,0);assert.match(r.stderr,/duplicate worker locale/);
  const file=path.join(dirs[0],'capture-receipt.json'),original=fs.readFileSync(file),receipt=JSON.parse(original);
  fs.writeFileSync(file,JSON.stringify({...receipt,base:''}));
  r=x.run('--merge-captures',dirs.join(','));assert.notEqual(r.status,0);assert.match(r.stderr,/Invalid capture base/);
  fs.writeFileSync(file,original);
  fs.writeFileSync(file,JSON.stringify({...receipt,workers:[{file:'nonexistent',sha256:'forged'}]}));
  r=x.run('--merge-captures',dirs.join(','));assert.notEqual(r.status,0);assert.match(r.stderr,/Nested worker lineage/);
  fs.writeFileSync(file,original);
  receipt.locales.de.completed.push(receipt.locales.de.completed[0]);fs.writeFileSync(file,JSON.stringify(receipt));
  r=x.run('--merge-captures',dirs.join(','));assert.notEqual(r.status,0);assert.match(r.stderr,/coverage/);
  fs.writeFileSync(file,original);
  const indexPath=path.join(x.root,'l10n/prerender/de/index.json'),index=JSON.parse(fs.readFileSync(indexPath));
  delete index.routes[0].contentProof.bodyChars;fs.writeFileSync(indexPath,JSON.stringify(index));
  r=x.run('--merge-captures',dirs.join(','));assert.notEqual(r.status,0);assert.match(r.stderr,/Malformed capture content proof/);
 }finally{x.cleanup();}
});

test('parallel coordinator preserves benchmark work and merges after exact-source resume',()=>{
 const x=fixture();try{
  x.put('l10n/locales.json',{en:{prefix:''},de:{prefix:'de'},fr:{prefix:'fr'}});
  const table=JSON.parse(fs.readFileSync(path.join(x.root,'l10n/routes.json')));
  for(const row of Object.values(table.routes))row.fr=row.de.replace('/de/','/fr/');
  x.put('l10n/routes.json',table);x.put('l10n/generated/fr.json',{missingUnits:0,missingSample:[]});
  x.put('public/ahv/l10n/fr/views/view.json',{template:'current translated body'});
  const evidence=path.join(x.root,'parallel'),args=['tools/capture-locales-parallel.mjs','--evidence',evidence,'--base','http://127.0.0.1:3218','--concurrency','4','--priority-locales','fr,de'];
  let r=spawnSync(process.execPath,[...args,'--max-batches','1'],{cwd:x.root,encoding:'utf8'});assert.equal(r.status,0,r.stderr);
  for(const worker of ['worker-1','worker-2']){
   const receipt=JSON.parse(fs.readFileSync(path.join(evidence,worker,'capture-receipt.json')));
   assert.deepEqual(receipt.targetLocales,worker==='worker-1'?['fr']:['de']);
   assert.equal(receipt.complete,false);assert.equal(Object.values(receipt.locales)[0].completed.length,25);
  }
  r=spawnSync(process.execPath,[...args,'--resume'],{cwd:x.root,encoding:'utf8'});assert.equal(r.status,0,r.stderr);
  const receipt=JSON.parse(fs.readFileSync(path.join(evidence,'merged/capture-receipt.json')));
  assert.equal(receipt.complete,true);assert.equal(receipt.locales.de.completed.length,26);assert.equal(receipt.locales.fr.completed.length,26);
 }finally{x.cleanup();}
});

test('parallel setup failures drain started workers before releasing evidence ownership',()=>{
 const x=fixture();try{
  x.put('l10n/locales.json',{en:{prefix:''},de:{prefix:'de'},fr:{prefix:'fr'}});
  const table=JSON.parse(fs.readFileSync(path.join(x.root,'l10n/routes.json')));
  for(const row of Object.values(table.routes))row.fr=row.de.replace('/de/','/fr/');
  x.put('l10n/routes.json',table);x.put('l10n/generated/fr.json',{missingUnits:0,missingSample:[]});
  x.put('public/ahv/l10n/fr/views/view.json',{template:'current translated body'});
  const evidence=path.join(x.root,'parallel');fs.mkdirSync(evidence);
  fs.writeFileSync(path.join(evidence,'worker-2'),'A file blocks worker directory setup');
  const args=['tools/capture-locales-parallel.mjs','--evidence',evidence,'--base','http://127.0.0.1:3218'];
  let r=spawnSync(process.execPath,args,{cwd:x.root,encoding:'utf8'});assert.notEqual(r.status,0);
  const reportName=fs.readdirSync(evidence).find(file=>file.startsWith('parallel-run-'));
  assert.ok(reportName,'setup failure still writes an adjudicated report after draining the sibling');
  const report=JSON.parse(fs.readFileSync(path.join(evidence,reportName)));
  assert.equal(report.results.length,2);assert.equal(report.stopping,true);
  assert.equal(report.results[0].code,0);assert.equal(report.results[1].code,1);
  assert.equal(fs.existsSync(path.join(evidence,'.capture-evidence-writer-lock.json')),false);
  assert.equal(fs.existsSync(path.join(x.root,'l10n/prerender/.capture-locks/de.json')),false);
  x.put('l10n/locales.json','{malformed');
  r=spawnSync(process.execPath,args,{cwd:x.root,encoding:'utf8'});assert.notEqual(r.status,0);
  assert.equal(fs.existsSync(path.join(evidence,'.capture-evidence-writer-lock.json')),false);
 }finally{x.cleanup();}
});

test('bounded priority routes are captured first without changing authoritative route inventory or recapturing completed bodies',()=>{
 const x=fixture();try{
  const evidence=path.join(x.root,'evidence');
  const r=spawnSync(process.execPath,['tools/package-locale-prerenders.mjs','--capture','--evidence',evidence,'--base','http://127.0.0.1:3218'],{cwd:x.root,encoding:'utf8',env:{...process.env,AHV_CAPTURE_PRIORITY_LOCALE:'de',AHV_CAPTURE_PRIORITY_ROUTES:'/route-25/'}});
  assert.equal(r.status,0,r.stderr);const receipt=JSON.parse(fs.readFileSync(path.join(evidence,'capture-receipt.json')));
  assert.deepEqual(receipt.locales.de.batches.map(batch=>batch.snapshots.length),[1,25]);
  assert.equal(receipt.locales.de.batches[0].snapshots[0].route,'/route-25/');assert.equal(receipt.locales.de.routes[0],'/');
  assert.equal(new Set(receipt.locales.de.completed).size,26);
 }finally{x.cleanup();}
});
