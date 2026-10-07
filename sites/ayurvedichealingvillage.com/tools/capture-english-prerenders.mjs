/** Regenerate current English DesignView bodies in <=25-route batches.
 * Start serve-capture.mjs with explicit local development capture environment first.
 * NODE_ENV=development AHV_CAPTURE_RUNTIME=1 AHV_CAPTURE_ORIGIN=http://127.0.0.1:3218 node tools/capture-english-prerenders.mjs --evidence /ssd/path --channel chrome
 */
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import {fileURLToPath} from 'node:url';
import {spawnSync} from 'node:child_process';
import {captureRuntimeEnabled} from '../app/(english)/_families/capture-runtime.mjs';
if(!captureRuntimeEnabled())throw Error('English static-source capture requires the explicit local capture server.');
const SITE=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const arg=(key,fallback)=>{const i=process.argv.indexOf('--'+key);return i<0?fallback:process.argv[i+1];};
const read=file=>JSON.parse(fs.readFileSync(path.join(SITE,file),'utf8'));
const sha=bytes=>crypto.createHash('sha256').update(bytes).digest('hex');
const hash=file=>sha(fs.readFileSync(path.join(SITE,file)));
const base=process.env.AHV_CAPTURE_ORIGIN;
const evidence=path.resolve(arg('evidence',path.join(SITE,'english-candidate/capture-evidence')));fs.mkdirSync(evidence,{recursive:true});
const nativeSource=fs.readFileSync(path.join(SITE,'app/(english)/_families/native-pages.tsx'),'utf8');
const match=nativeSource.match(/const NATIVE = new Set\((\[[^\]]+\])\);/);if(!match)throw Error('Cannot derive native route inventory');
const native=new Set(JSON.parse(match[1])),redirects=read('english-candidate/redirect-map.json').redirects;
const campaigns=new Set(read('campaign-v110/routes.json')),retained=new Set(read('campaign-v110/retained-original-routes.json'));
const routes=read('english-candidate/route-manifest.json').routes.filter(r=>!native.has(r.path)&&!Object.hasOwn(redirects,r.path)&&(!campaigns.has(r.path)||retained.has(r.path))).map(r=>r.path);
function walk(dir){return fs.readdirSync(path.join(SITE,dir),{withFileTypes:true}).flatMap(e=>e.isDirectory()?walk(dir+'/'+e.name):[dir+'/'+e.name]);}
function signature(){const roots=['app','public/design','public/ahv/views','public/ahv/assets','english-candidate','tools/l10n','l10n/source','l10n/overrides'];return sha(JSON.stringify(roots.flatMap(walk).concat(['tools/prerender-english.mjs','tools/capture-page-guard.mjs','tools/capture-english-prerenders.mjs']).filter(file=>!file.startsWith('app/api/')&&/\.(?:js|mjs|ts|tsx|json|css)$/.test(file)&&!file.startsWith('english-candidate/prerender/')&&!file.startsWith('english-candidate/capture-evidence/')).sort().map(file=>({file,sha256:hash(file)}))));}
const sourceSignature=signature(),receiptFile=path.join(evidence,'english-capture-receipt.json');
let receipt={startedAt:new Date().toISOString(),base,sourceSignature,routes,batches:[],complete:false};
if(process.argv.includes('--resume')&&fs.existsSync(receiptFile)){receipt=JSON.parse(fs.readFileSync(receiptFile,'utf8'));if(receipt.sourceSignature!==sourceSignature||JSON.stringify(receipt.routes)!==JSON.stringify(routes))throw Error('English capture source or route set changed');}
const verifyRecordedFiles=()=>{for(const batch of receipt.batches)for(const row of batch.files)if(hash(row.file)!==row.sha256)throw Error('English snapshot changed after capture: '+row.file);};
verifyRecordedFiles();
const save=()=>fs.writeFileSync(receiptFile,JSON.stringify(receipt,null,2)+'\n');
save();
for(const [variant,selected,out,width]of [['mobile',routes,'english-candidate/prerender','390'],['desktop',['/','/contact-us/','/panchakarma-therapy/'],'public/ahv/static','1440']]){
 for(let start=0;start<selected.length;start+=25){
  const batch=selected.slice(start,start+25);
  if(receipt.batches.some(row=>row.variant===variant&&JSON.stringify(row.routes)===JSON.stringify(batch)))continue;
  if(signature()!==sourceSignature)throw Error('English capture source changed; wait for final source freeze');
  const args=['tools/prerender-english.mjs','--base',base,'--only',batch.join(','),'--out',out,'--width',width,'--height','900','--concurrency',arg('concurrency','3'),'--require-live-runtime','--block-external'];
  if(arg('channel',null))args.push('--channel',arg('channel',null));
  const proc=spawnSync(process.execPath,args,{cwd:SITE,stdio:'inherit',env:process.env});if(proc.status!==0)throw Error('English capture batch failed');
  const index=read(out+'/index.json');
  const files=batch.map(route=>{const row=index.routes.find(r=>r.path===route);if(!row?.ok||!row.liveRuntimeVerified)throw Error('Current runtime not verified for '+route);const file=out+'/'+row.file;return {file,sha256:hash(file)};});
  receipt.batches.push({variant,routes:batch,files,completedAt:new Date().toISOString()});save();
  console.log(`ENGLISH ${variant}: ${Math.min(start+25,selected.length)}/${selected.length}`);
 }
}
if(signature()!==sourceSignature)throw Error('English capture source changed before completion');
verifyRecordedFiles();
receipt.complete=true;receipt.finishedAt=new Date().toISOString();save();
console.log('English source snapshots complete; stop capture server and verify normal static rendering before release.');
