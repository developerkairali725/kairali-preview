import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
const site=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const spec=JSON.parse(fs.readFileSync(path.join(site,'english-candidate/gallery-assets-release.json'),'utf8'));
const missing=[];
for(let i=0;i<spec.files.length;i+=25) {
  for(const {file} of spec.files.slice(i,i+25)) {
    if(!file.startsWith('public/ahv/assets/img/') || file.split('/').includes('..')) throw Error('Invalid selected image path');
    const p=path.join(site,file);
    if(!fs.existsSync(p) || !fs.statSync(p).isFile() || fs.statSync(p).size===0) missing.push(file);
  }
}
if(missing.length) {
  console.error(`Missing ${missing.length} selected image files. Run pnpm assets:restore from this site before building. Existing replacements are never overwritten.`);
  console.error(missing.slice(0,25).join('\n'));
  process.exitCode=1;
} else console.log(`Selected image package complete: ${spec.files.length} files.`);
