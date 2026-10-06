/** Reproducible translated crawlable bodies; snapshots are generated from this release's own runtime. */
import fs from 'node:fs';
import path from 'node:path';
import os from 'node:os';
import crypto from 'node:crypto';
import { fileURLToPath } from 'node:url';
import { execFileSync } from 'node:child_process';
import { downloadReleaseAsset } from './download-release-asset.mjs';
import { verifyInteractionOnlySource } from './verify-interaction-only-source.mjs';
const site=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const spec=JSON.parse(fs.readFileSync(path.join(site,'english-candidate/locale-prerenders-release.json'),'utf8'));
const hash=p=>crypto.createHash('sha256').update(fs.readFileSync(p)).digest('hex');
// Bind the captured bodies to the translated serving payloads. Changed content
// requires a new capture/archive; never silently restore old translated copy.
for (const f of spec.sources) {
 if (!/^(public\/ahv\/l10n\/|l10n\/generated\/|english-candidate\/route-manifest\.json$|l10n\/routes\.json$)/.test(f.file) || f.file.split('/').includes('..')) throw Error('Invalid snapshot source path');
 if (!fs.existsSync(path.join(site,f.file)) || hash(path.join(site,f.file)) !== f.sha256) throw Error('Locale snapshot source changed; recapture required: '+f.file);
}
// Form listeners are validated as inert before interaction instead of treating
// a changed submit payload as changed translated crawlable content.
for(const file of spec.interactionOnlySources || []) {
 if(!/^public\/ahv\/l10n\/(hi|de|fr|es|it|pt|nl|ru|ar|zh|ja|ko)\/design\/(landing-page|opd)-form-submit\.js$/.test(file)) throw Error('Invalid interaction-only source path');
 verifyInteractionOnlySource(fs.readFileSync(path.join(site,file),'utf8'),file);
}
if(!/^[a-z0-9-]+\.tar\.gz$/.test(spec.archive) || spec.asset !== spec.archive) throw Error('Invalid locale snapshot archive name');
const temporary=fs.mkdtempSync(path.join(os.tmpdir(),'ahv-locale-release-'));
let archive=path.join(site,'english-candidate',spec.archive);
if(!fs.existsSync(archive)){await downloadReleaseAsset(spec,temporary);archive=path.join(temporary,spec.archive);}
if(hash(archive)!==spec.sha256)throw Error('Locale snapshot archive integrity mismatch');
const allowed=new Set(spec.files.map(f=>f.file));
for(const f of spec.files){
 if(!/^l10n\/prerender\/(hi|de|fr|es|it|pt|nl|ru|ar|zh-Hans|ja|ko)\/[a-zA-Z0-9._-]+\.(html\.gz|json)$/.test(f.file))throw Error('Invalid snapshot path');
 const dest=path.join(site,f.file);
 if(fs.existsSync(dest)&&hash(dest)!==f.sha256)throw Error('Refusing to overwrite changed locale snapshot: '+f.file);
}
const names=execFileSync('tar',['-tzf',archive],{encoding:'utf8'}).trim().split('\n');
if(names.length!==allowed.size||names.some(n=>!allowed.has(n)))throw Error('Unexpected locale snapshot archive member');
if(spec.files.every(f=>fs.existsSync(path.join(site,f.file)))){fs.rmSync(temporary,{recursive:true,force:true});console.log('Verified '+spec.files.length+' locale snapshot files.');process.exit(0);}
const tmp=fs.mkdtempSync(path.join(os.tmpdir(),'ahv-locale-snapshots-'));
try{
 execFileSync('tar',['-xzf',archive,'-C',tmp]);
 for(let start=0;start<spec.files.length;start+=25){for(const f of spec.files.slice(start,start+25)){
  const source=path.join(tmp,f.file);
  if(!fs.lstatSync(source).isFile()||hash(source)!==f.sha256)throw Error('Locale snapshot file integrity mismatch: '+f.file);
 }}
 for(let start=0;start<spec.files.length;start+=25){for(const f of spec.files.slice(start,start+25)){
  const dest=path.join(site,f.file);if(!fs.existsSync(dest)){fs.mkdirSync(path.dirname(dest),{recursive:true});fs.copyFileSync(path.join(tmp,f.file),dest);}
 }}
 console.log('Restored and verified '+spec.files.length+' locale snapshot files.');
}finally{fs.rmSync(tmp,{recursive:true,force:true});fs.rmSync(temporary,{recursive:true,force:true});}
