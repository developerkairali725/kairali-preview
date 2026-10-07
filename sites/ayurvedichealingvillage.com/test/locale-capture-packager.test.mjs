import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import {spawnSync} from 'node:child_process';
import {fileURLToPath} from 'node:url';

const site=fileURLToPath(new URL('../',import.meta.url));
function fixture(){
 const root=fs.mkdtempSync(path.join(site,'.ahv-locale-capture-test-'));
 const put=(file,value)=>{const dest=path.join(root,file);fs.mkdirSync(path.dirname(dest),{recursive:true});fs.writeFileSync(dest,typeof value==='string'?value:JSON.stringify(value));};
 for(const file of ['tools/package-locale-prerenders.mjs','tools/restore-locale-prerenders.mjs','tools/download-release-asset.mjs','tools/verify-interaction-only-source.mjs','tools/l10n/prerender-manifest.mjs','tools/l10n/sources-lite.mjs']){const dest=path.join(root,file);fs.mkdirSync(path.dirname(dest),{recursive:true});fs.copyFileSync(path.join(site,file),dest);}
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
  for(const p of paths){const file=(p==='/'?'index':p.replace(/^\\/+|\\/+$/g,'').replace(/[^a-z0-9._-]+/gi,'_'))+'.html';fs.writeFileSync(base+'/'+file+'.gz',gzipSync('<main>'+p+'</main>'));const row={path:p,file,ok:true,liveRuntimeVerified:true};index.routes=index.routes.filter(r=>r.path!==p);index.routes.push(row);}
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
