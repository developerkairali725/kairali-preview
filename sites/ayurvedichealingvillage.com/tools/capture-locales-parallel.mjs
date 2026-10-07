/** Two disjoint locale workers on one normal localhost server.
 * Benchmark: --concurrency 2 --max-batches 1, then --resume --concurrency 3 --max-batches 1.
 * Continue the measured setting with --resume and no max-batches. Never start a second Next server.
 */
import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {spawn} from 'node:child_process';
import {takeEvidenceLock,validateCaptureBase} from './locale-capture-coordination.mjs';
const SITE=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const arg=(name,fallback)=>{const i=process.argv.indexOf('--'+name);return i<0?fallback:process.argv[i+1];};
const evidence=path.resolve(arg('evidence','l10n/parallel-capture-evidence'));
const base=arg('base',null),concurrency=Number(arg('concurrency','2')),maxBatches=Number(arg('max-batches','0'));
validateCaptureBase(base);
if(![2,3].includes(concurrency)||!Number.isInteger(maxBatches)||maxBatches<0)throw Error('Use two workers with 2 or 3 pages each and an optional nonnegative batch limit');
fs.mkdirSync(evidence,{recursive:true});
const locales=Object.keys(JSON.parse(fs.readFileSync(path.join(SITE,'l10n/locales.json')))).filter(loc=>loc!=='en');
if(locales.length<2)throw Error('Parallel capture requires at least two configured locales');
const groups=[locales.filter((_,i)=>i%2===0),locales.filter((_,i)=>i%2===1)];
const runId=new Date().toISOString().replace(/[:.]/g,'-'),workers=groups.map((assigned,i)=>({assigned,directory:path.join(evidence,'worker-'+(i+1)),stop:path.join(evidence,'stop-'+runId+'-'+(i+1))}));
let stopping=false;const stopErrors=[];
const stopAfterBatch=()=>{stopping=true;for(const worker of workers){try{fs.writeFileSync(worker.stop,'Finish current batch and stop.\n');}catch(error){stopErrors.push(String(error));}}};
const release=takeEvidenceLock(evidence);
try{
 process.on('SIGTERM',stopAfterBatch);process.on('SIGINT',stopAfterBatch);
 const results=await Promise.all(workers.map(worker=>new Promise(resolve=>{
  const startedAt=new Date().toISOString(),logfile=path.join(worker.directory,'capture-'+runId+'.log');
  let fd=null,closed=false;const close=()=>{if(fd!==null&&!closed){closed=true;fs.closeSync(fd);}};
  const failed=error=>{close();stopAfterBatch();resolve({assigned:worker.assigned,directory:worker.directory,logfile,startedAt,finishedAt:new Date().toISOString(),code:1,error:String(error)});};
  try{
  fs.mkdirSync(worker.directory,{recursive:true});fd=fs.openSync(logfile,'a');
  const args=['tools/package-locale-prerenders.mjs','--capture','--base',base,'--evidence',worker.directory,'--locales',worker.assigned.join(','),'--concurrency',String(concurrency),'--stop-after-batch-file',worker.stop];
  if(maxBatches)args.push('--max-batches',String(maxBatches));
  if(process.argv.includes('--resume'))args.push('--resume');
  if(arg('channel',null))args.push('--channel',arg('channel'));
  const child=spawn(process.execPath,args,{cwd:SITE,stdio:['ignore',fd,fd],env:process.env});
  child.on('error',failed);
  child.on('exit',(code,signal)=>{close();if(code!==0)stopAfterBatch();resolve({assigned:worker.assigned,directory:worker.directory,logfile,startedAt,finishedAt:new Date().toISOString(),code,signal});});
  }catch(error){failed(error);}
 })));
 const receipts=results.map(row=>{const file=path.join(row.directory,'capture-receipt.json');return fs.existsSync(file)?JSON.parse(fs.readFileSync(file)):null;});
 const signatures=[...new Set(receipts.map(row=>row?.sourceSignature))];
 const report={runId,base,workers:2,pagesPerWorker:concurrency,totalPageConcurrency:2*concurrency,maxBatchesPerWorker:maxBatches,stopping,stopErrors,results,sourceSignatures:signatures,complete:receipts.every(row=>row?.complete)};
 fs.writeFileSync(path.join(evidence,'parallel-run-'+runId+'.json'),JSON.stringify(report,null,2)+'\n');
 console.log(JSON.stringify(report,null,2));
 if(results.some(row=>row.code!==0)||signatures.length!==1||!signatures[0])process.exitCode=1;
 else if(report.complete){
  const args=['tools/package-locale-prerenders.mjs','--merge-captures',workers.map(worker=>worker.directory).join(','),'--evidence',path.join(evidence,'merged')];
  const result=await new Promise((resolve,reject)=>{const child=spawn(process.execPath,args,{cwd:SITE,stdio:'inherit',env:process.env});child.on('error',reject);child.on('exit',resolve);});
  if(result!==0)process.exitCode=1;
 }
}finally{process.removeListener('SIGTERM',stopAfterBatch);process.removeListener('SIGINT',stopAfterBatch);release();}
