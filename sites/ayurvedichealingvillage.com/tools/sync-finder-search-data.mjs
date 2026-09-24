#!/usr/bin/env node
// Refresh only embedded search data, preserving every design and film section.
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
const site=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const check=process.argv.includes('--check');
const index=JSON.parse(fs.readFileSync(path.join(site,'public/ahv/search-index.json')));
const rows=new Map(index.programmes.map(p=>[p.route,p]));
let changed=0;
for(const route of ['all-programs','ayurvedic-treatments','wellness-programs','treatment-programs','training-programs','yoga-meditation-programs']) for(const side of ['desktop','mobile']) {
 const file=path.join(site,`public/ahv/views/ahv-page-${route}-${side}.json`);
 const text=fs.readFileSync(file,'utf8'), view=JSON.parse(text);
 const m=view.logic.match(/const DATASET = (.*);/);
 if(!m) throw new Error(`Missing dataset: ${file}`);
 const data=JSON.parse(m[1]);
 if(data.length!==rows.size) throw new Error('Finder programme set changed: review card mapping before release');
 for(const d of data){
  const p=rows.get(d.r); if(!p) throw new Error(`Unknown finder route ${d.r}`);
  Object.assign(d,{t:p.name,s:p.sanskrit||'',c:p.cats,n:p.nights,from:p.from,vt:p.validTo,vf:p.validFrom,ps:p.priceState,basis:p.basis});
 }
 const logic=view.logic.replace(m[0],()=>`const DATASET = ${JSON.stringify(data)};`);
 if(logic!==view.logic){
  changed++;
  if(!check){view.logic=logic;fs.writeFileSync(file,JSON.stringify(view,null,text.startsWith('{\n')?1:undefined)+'\n');}
 }
}
if(check && changed) throw new Error(`${changed} finder payloads have stale search data`);
console.log(`finder search data: ${changed} ${check?'stale':'updated'} of 12 payloads`);
