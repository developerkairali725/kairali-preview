/** Recapture and package locale bodies without rebinding an old archive to new source.
 * Preparation: normal route/catalog/runtime generators, localhost dev server, zero missing translations.
 * node tools/package-locale-prerenders.mjs --capture --base http://127.0.0.1:3218 --evidence /ssd/path --channel chrome
 * node tools/package-locale-prerenders.mjs --package --evidence /ssd/path --archive ahv-locale-prerenders-20261007.tar.gz
 * Capture batches contain at most 25 routes; no remote upload or publication occurs.
 */
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import {fileURLToPath} from 'node:url';
import {spawnSync} from 'node:child_process';

const SITE=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const arg=(name,fallback)=>{const i=process.argv.indexOf('--'+name);return i<0?fallback:process.argv[i+1];};
const read=file=>JSON.parse(fs.readFileSync(path.join(SITE,file),'utf8'));
const sha=bytes=>crypto.createHash('sha256').update(bytes).digest('hex');
const fileHash=file=>sha(fs.readFileSync(path.join(SITE,file)));
const specPath='english-candidate/locale-prerenders-release.json';
const old=read(specPath);
const locales=Object.keys(read('l10n/locales.json')).filter(loc=>loc!=='en');
const localePaths=read('l10n/routes.json').routes;
const redirects=read('english-candidate/redirect-map.json').redirects;
const manifest=read('english-candidate/route-manifest.json').routes;
const evidence=path.resolve(arg('evidence',path.join(SITE,'l10n/release-evidence')));
fs.mkdirSync(evidence,{recursive:true});
const receiptFile=path.join(evidence,'capture-receipt.json');
const snapshotName=route=>(route==='/'?'index':route.replace(/^\/+|\/+$/g,'').replace(/[^a-z0-9._-]+/gi,'_'))+'.html.gz';
const expected=Object.fromEntries(locales.map(loc=>[loc,manifest.filter(r=>localePaths[r.path]?.[loc]&&!Object.hasOwn(redirects,r.path)).map(r=>r.path)]));
function walk(dir){return fs.readdirSync(path.join(SITE,dir),{withFileTypes:true}).flatMap(e=>e.isDirectory()?walk(dir+'/'+e.name):[dir+'/'+e.name]);}
function sourceRows(){
 const excluded=new Set(old.interactionOnlySources||[]);
 const names=new Set([...old.sources.map(r=>r.file),'english-candidate/route-manifest.json','l10n/routes.json',...walk('l10n/generated'),...walk('public/ahv/l10n')]);
 return [...names].filter(file=>!excluded.has(file)&&(/\.json$|\.js$|\.dc\.html$/.test(file))).sort().map(file=>({file,sha256:fileHash(file)}));
}
function renderInputRows(){
 const roots=['app','english-candidate','public/design','public/ahv/views','public/ahv/assets','tools/l10n','l10n/source','l10n/overrides','l10n/output'];
 const names=new Set(roots.flatMap(dir=>fs.existsSync(path.join(SITE,dir))?walk(dir):[]));
 for(const file of ['tools/prerender-english.mjs','tools/build-review-chrome.mjs','tools/build-runtime-bundles.mjs'])if(fs.existsSync(path.join(SITE,file)))names.add(file);
 return [...names].filter(file=>/\.(?:json|js|mjs|ts|tsx|css)$/.test(file)).sort().map(file=>({file,sha256:fileHash(file)}));
}
function signature(){return sha(JSON.stringify({sources:sourceRows(),renderInputs:renderInputRows()}));}
function verifyTranslations(){
 const gaps=locales.map(locale=>{const report=read(`l10n/generated/${locale}.json`);return {locale,missingUnits:report.missingUnits,sample:report.missingSample};}).filter(r=>r.missingUnits!==0);
 fs.writeFileSync(path.join(evidence,'translation-gaps.json'),JSON.stringify(gaps,null,2)+'\n');
 if(gaps.length)throw Error('Untranslated/new source units remain; see translation-gaps.json. Capture is blocked.');
}
function command(args){const r=spawnSync(process.execPath,args,{cwd:SITE,stdio:'inherit',env:process.env});if(r.status!==0)throw Error(`Command failed (${r.status}): ${args.join(' ')}`);}
const sources=sourceRows();
const changes=sources.filter(row=>old.sources.find(s=>s.file===row.file)?.sha256!==row.sha256);
fs.writeFileSync(path.join(evidence,'source-drift.json'),JSON.stringify({at:new Date().toISOString(),sources:sources.length,changed:changes,routes:Object.fromEntries(Object.entries(expected).map(([loc,rs])=>[loc,rs.length]))},null,2)+'\n');
if(process.argv.includes('--capture')){
 verifyTranslations();
 const base=arg('base',null);if(!base||!['localhost','127.0.0.1'].includes(new URL(base).hostname))throw Error('Capture requires an explicit localhost base');
 const sourceSignature=signature();
 let receipt={startedAt:new Date().toISOString(),sourceSignature,renderInputs:renderInputRows(),base,batchSize:25,locales:{},complete:false};
 if(process.argv.includes('--resume')&&fs.existsSync(receiptFile)){
  receipt=JSON.parse(fs.readFileSync(receiptFile,'utf8'));
  if(receipt.sourceSignature!==sourceSignature||receipt.base!==base)throw Error('Cannot resume capture after source/base changed');
 }
 const persist=()=>fs.writeFileSync(receiptFile,JSON.stringify(receipt,null,2)+'\n');
 persist();
 for(const loc of locales){
  const state=receipt.locales[loc]||{routes:expected[loc],completed:[],batches:[]};
  if(JSON.stringify(state.routes)!==JSON.stringify(expected[loc]))throw Error('Route set changed: '+loc);
  receipt.locales[loc]=state;
  for(let start=0;start<state.routes.length;start+=25){
   const routes=state.routes.slice(start,start+25);
   if(routes.every(route=>state.completed.includes(route)))continue;
   if(signature()!==sourceSignature)throw Error('Source changed during capture; retain evidence and restart after source freeze');
   const args=['tools/prerender-english.mjs','--base',base,'--locale',loc,'--only',routes.join(','),'--concurrency',arg('concurrency','3'),'--block-external','--require-live-runtime'];
   const channel=arg('channel',null);if(channel)args.push('--channel',channel);
   command(args);
   const index=read(`l10n/prerender/${loc}/index.json`);
   const snapshots=routes.map(route=>{
    const found=index.routes.find(r=>r.path===route);
    if(!found?.ok||!found.liveRuntimeVerified)throw Error('Missing current-runtime capture receipt: '+loc+' '+route);
    const file=`l10n/prerender/${loc}/${snapshotName(route)}`;
    return {route,file,sha256:fileHash(file)};
   });
   state.completed.push(...routes.filter(route=>!state.completed.includes(route)));
   state.batches.push({completedAt:new Date().toISOString(),snapshots});persist();
   console.log(`LOCALE CAPTURE ${loc}: ${state.completed.length}/${state.routes.length}`);
  }
 }
 if(signature()!==sourceSignature)throw Error('Source changed at capture completion');
 receipt.complete=true;receipt.finishedAt=new Date().toISOString();persist();
}
if(process.argv.includes('--package')){
 verifyTranslations();
 const receipt=JSON.parse(fs.readFileSync(receiptFile,'utf8'));
 if(!receipt.complete||receipt.sourceSignature!==signature())throw Error('Complete capture proof for exact current source is required');
 const files=[];
 for(const loc of locales){
  const state=receipt.locales[loc];
  if(!state||JSON.stringify(state.routes)!==JSON.stringify(expected[loc])||state.completed.length!==expected[loc].length)throw Error('Incomplete locale '+loc);
  const captured=new Map(state.batches.flatMap(b=>b.snapshots).map(row=>[row.route,row]));
  for(const route of expected[loc]){
   const row=captured.get(route),file=`l10n/prerender/${loc}/${snapshotName(route)}`;
   if(!row||row.file!==file||row.sha256!==fileHash(file))throw Error('Snapshot changed after capture: '+file);
   files.push({file,sha256:row.sha256,bytes:fs.statSync(path.join(SITE,file)).size});
  }
  const file=`l10n/prerender/${loc}/index.json`,index=read(file);
  const kept=index.routes.filter(r=>expected[loc].includes(r.path));
  if(kept.length!==expected[loc].length||kept.some(r=>!r.ok||!r.liveRuntimeVerified))throw Error('Invalid locale index: '+loc);
  // Retired redirects are omitted from the released index and archive, not overwritten with target pages.
  const clean={...index,count:kept.length,failures:0,routes:kept};
  fs.writeFileSync(path.join(SITE,file),JSON.stringify(clean,null,1)+'\n');
  files.push({file,sha256:fileHash(file),bytes:fs.statSync(path.join(SITE,file)).size});
 }
 const archive=arg('archive',null);if(!archive||!/^ahv-locale-prerenders-[a-z0-9-]+\.tar\.gz$/.test(archive))throw Error('Provide a versioned locale archive filename');
 const destination=path.join(SITE,'english-candidate',archive);
 if(fs.existsSync(destination))throw Error('Refusing to overwrite existing release archive');
 const members=path.join(evidence,'archive-members.txt');fs.writeFileSync(members,files.map(r=>r.file).join('\n')+'\n');
 const tar=spawnSync('tar',['-czf',destination,'-T',members],{cwd:SITE,stdio:'inherit',env:{...process.env,COPYFILE_DISABLE:'1'}});if(tar.status!==0)throw Error('Archive packaging failed');
 const spec={...old,asset:archive,archive,sha256:sha(fs.readFileSync(destination)),bytes:fs.statSync(destination).size,capturedSource:'All included locale bodies recaptured from exact current translated runtime in <=25-route batches; capture receipts bind each gzip to serving source hashes. No remote upload/publication performed by this tool.',captured:new Date().toISOString(),sources:sourceRows(),files};
 fs.writeFileSync(path.join(evidence,'previous-release-spec.json'),JSON.stringify(old,null,2)+'\n');
 fs.writeFileSync(path.join(SITE,specPath),JSON.stringify(spec,null,2)+'\n');
 command(['tools/l10n/prerender-manifest.mjs']);
 command(['tools/restore-locale-prerenders.mjs']);
 fs.writeFileSync(path.join(evidence,'packaging-result.json'),JSON.stringify({archive:destination,sha256:spec.sha256,bytes:spec.bytes,files:files.length,sources:spec.sources.length,remoteUpload:false},null,2)+'\n');
 console.log(JSON.stringify({archive,sha256:spec.sha256,files:files.length,remoteUpload:false}));
}
