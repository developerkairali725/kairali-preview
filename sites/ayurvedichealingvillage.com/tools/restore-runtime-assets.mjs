import fs from 'node:fs';
import path from 'node:path';
import os from 'node:os';
import crypto from 'node:crypto';
import { fileURLToPath } from 'node:url';
import { execFileSync } from 'node:child_process';
import { downloadReleaseAsset } from './download-release-asset.mjs';
const site=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const spec=JSON.parse(fs.readFileSync(path.join(site,process.argv.includes('--documents') ? 'english-candidate/document-assets-release.json' : process.argv.includes('--gallery') ? 'english-candidate/gallery-assets-release.json' : 'english-candidate/runtime-assets-release.json'),'utf8'));
const hash=p=>crypto.createHash('sha256').update(fs.readFileSync(p)).digest('hex');
for(const f of spec.files){
 if(!(f.file.startsWith(process.argv.includes('--documents') ? 'public/documents/' : 'public/ahv/'))||f.file.split('/').includes('..'))throw Error('Invalid asset path');
 const dest=path.join(site,f.file);
 if(fs.existsSync(dest)&&hash(dest)!==f.sha256)throw Error('Refusing to overwrite modified asset: '+f.file);
}
if(spec.files.every(f=>fs.existsSync(path.join(site,f.file)))){
 console.log(`Verified ${spec.files.length} existing runtime assets.`);
 process.exit(0);
}
const temp=fs.mkdtempSync(path.join(os.tmpdir(),'ahv-assets-'));
try{
 await downloadReleaseAsset(spec,temp);
 const archive=path.join(temp,spec.asset);
 if(hash(archive)!==spec.sha256)throw Error('Runtime asset archive hash mismatch');
 const names=execFileSync('tar',['-tzf',archive],{encoding:'utf8'}).trim().split('\n');
 const allowed=new Set(spec.files.map(f=>f.file));
 if(names.length!==allowed.size||names.some(n=>!allowed.has(n)))throw Error('Unexpected archive member');
 const unpack=path.join(temp,'unpack');fs.mkdirSync(unpack);
 execFileSync('tar',['-xzf',archive,'-C',unpack]);
 for(let i=0;i<spec.files.length;i+=25){
  for(const f of spec.files.slice(i,i+25)){
   const src=path.join(unpack,f.file);
   if(!fs.lstatSync(src).isFile()||hash(src)!==f.sha256)throw Error('Asset integrity mismatch: '+f.file);
  }
 }
 for(let i=0;i<spec.files.length;i+=25){
  for(const f of spec.files.slice(i,i+25)){
   const dest=path.join(site,f.file);
   if(!fs.existsSync(dest)){fs.mkdirSync(path.dirname(dest),{recursive:true});fs.copyFileSync(path.join(unpack,f.file),dest);}
  }
 }
 console.log(`Restored and verified ${spec.files.length} runtime assets.`);
}finally{fs.rmSync(temp,{recursive:true,force:true});}
