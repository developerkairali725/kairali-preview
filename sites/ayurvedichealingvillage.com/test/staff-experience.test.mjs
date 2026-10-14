import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
import copy from '../english-candidate/staff-experience-copy.json' with {type:'json'};
import {staffExperienceCopyFor, applyStaffExperienceHtml, applyStaffExperienceDom} from '../app/(english)/_families/staff-experience.mjs';
import {applyReviewSnapshot, reviewCopyFor} from '../app/(english)/_families/content-review.mjs';
import {STATIC_BOOT} from '../app/(english)/_families/static-design-boot.mjs';
import {DOCTORS} from '../campaign-v2/data/doctors.ts';
import {UI} from '../campaign-v2/production/ui.ts';
const expected={'dr-adhina-u-b':1,'dr-aashitha-p-s':9,'dr-akhila-oommen':9,'dr-rahul-r':3,'dr-deepu-john':15,'r-sivadas':16,'anju-s':7};
const split=s=>s.split(/\[\[TAG_[12]\]\]/);
const esc=s=>s.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
const card=s=>'<div class="profile-meta">'+split(s).map(esc).join('<br data-preserved="yes">')+'</div>';
const inverse=rules=>rules.map(r=>({...r,old:r.new,new:r.old}));
const read=p=>fs.readFileSync(new URL('../'+p,import.meta.url),'utf8');

test('only seven reconciled, dated lower bounds; clinical nine excludes the broader eleven; no exact-total fields',()=>{
 assert.equal(copy.asOf,'2026-09-25');assert.equal(Object.keys(copy.locales).length,13);
 for(const [locale,rules] of Object.entries(copy.locales)){
  assert.deepEqual(Object.fromEntries(rules.map(r=>[r.profile,r.minimumYears])),expected,locale);
  for(const r of rules){const before=split(r.old),after=split(r.new);assert.equal(before.length,3);assert.equal(after.length,3);assert.equal(before[0],after[0]);assert.equal(before[2],after[2]);assert(after[1].includes(r.experience));assert(r.experience.includes('2026'));assert.equal(r.kind,'staff-experience');}
 }
 const en=copy.locales.en;assert.equal(en.find(r=>r.profile==='dr-aashitha-p-s').experience,'9+ years of documented clinical Ayurveda experience (as of September 2026)');
 assert.equal(en.find(r=>r.profile==='dr-deepu-john').experience,'15+ years of documented professional Ayurveda experience (as of September 2026)');
 assert.equal(staffExperienceCopyFor('/online-consultation/').length,0);assert.equal(staffExperienceCopyFor('/','unknown').length,0);
});
for(const [locale,rules] of Object.entries(copy.locales)) test(`${locale}: seven exact card identities, serialized SSR/runtime parity, preserved roles/languages and idempotence`,()=>{
 const html=rules.map(r=>card(r.old)).join('\n');const wanted=rules.map(r=>card(r.new)).join('\n');
 const htmlFn=vm.runInNewContext('('+applyStaffExperienceHtml.toString()+')');assert.equal(htmlFn(html,rules),wanted);assert.equal(htmlFn(wanted,rules),wanted);assert.equal(htmlFn(wanted,inverse(rules)),html);
 const nodes=rules.map(r=>{const parts=split(r.old);const el={nodeType:1,tagName:'DIV',closest:()=>null,querySelectorAll:()=>[],childNodes:[{nodeType:3,nodeValue:parts[0]},{nodeType:1,nodeName:'BR'},{nodeType:3,nodeValue:parts[1]},{nodeType:1,nodeName:'BR'},{nodeType:3,nodeValue:parts[2]}]};el.childNodes.forEach(n=>n.parentElement=el);return el;});
 const domFn=vm.runInNewContext('('+applyStaffExperienceDom.toString()+')');const root={nodeType:1,tagName:'MAIN',querySelectorAll:()=>nodes};domFn(root,rules);domFn(root,rules);
 nodes.forEach((n,i)=>{assert.equal(n.childNodes[0].nodeValue,split(rules[i].old)[0]);assert.equal(n.childNodes[2].nodeValue,split(rules[i].new)[1]);assert.equal(n.childNodes[4].nodeValue,split(rules[i].old)[2]);});
 // Same joining year is insufficient: Adhina and Aashitha remain distinguished by the complete card.
 assert.equal(reviewCopyFor('/',locale).filter(r=>r.kind==='staff-experience').length,7);
});
for(const path of ['english-candidate/prerender/index.html','public/ahv/static/index.html']) test(`${path}: actual approved homepage changes exactly seven metadata lines and restores byte-for-byte`,()=>{
 const before=read(path),rules=staffExperienceCopyFor('/'),after=applyStaffExperienceHtml(before,rules);
 for(const r of rules)assert.equal(after.split(esc(r.experience)).length-1,1,r.profile);
 assert.equal(applyStaffExperienceHtml(after,inverse(rules)),before);
 const reviewed=applyReviewSnapshot(before,'/','en');for(const r of rules)assert(reviewed.includes(esc(r.experience)),r.profile);
});
test('unrelated same-year copy, forms, scripts, partial or differently qualified profiles are unchanged',()=>{
 const rules=staffExperienceCopyFor('/'),sample=card(rules[0].old);
 for(const html of ['<p>At Kairali since 2026</p>','<form>'+sample+'</form>','<script>'+sample+'</script>',sample.replace('Resident Medical Officer','Other role'),sample.replace('Speaks English, Malayalam','Speaks Hindi'),sample.replace('<br data-preserved="yes">','<strong>'),'<div>1+ year</div>'])assert.equal(applyStaffExperienceHtml(html,rules),html);
 const el={nodeType:1,tagName:'DIV',querySelectorAll:()=>[],closest:()=>({}),childNodes:[]};assert.doesNotThrow(()=>applyStaffExperienceDom(el,rules));
});
test('actual serialized desktop loader receives the same seven rules before inserting markup',async()=>{
 const start=STATIC_BOOT.indexOf('  if (window.matchMedia("(min-width:"'),end=STATIC_BOOT.indexOf('\n  if (cfg.staticHome) {',start);assert(start>=0&&end>start);
 const host={innerHTML:'mobile',setAttribute(){}};const rules=reviewCopyFor('/','en');const cfg={staticHome:{},breakpoint:700,staticDesktopPath:'/ahv/static/index.html',contentReviewCopy:rules};const before=read('public/ahv/static/index.html');
 await vm.runInNewContext(`(async function(){${STATIC_BOOT.slice(start,end)}})()`,{host,cfg,window:{matchMedia:()=>({matches:true})},fetch:async()=>({ok:true,text:async()=>before})});
 for(const r of staffExperienceCopyFor('/'))assert(host.innerHTML.includes(esc(r.experience)),r.profile);
});
test('five campaign facts and DE/RU Deepu overrides use the same dated supported bounds; no automated yearsInPractice',()=>{
 const ids={'adhina-ub':'dr-adhina-u-b','aashitha-ps':'dr-aashitha-p-s','akhila-oommen':'dr-akhila-oommen','rahul-r':'dr-rahul-r','deepu-john':'dr-deepu-john'};
 for(const [id,profile] of Object.entries(ids)){assert.equal(DOCTORS[id].tenure,copy.locales.en.find(r=>r.profile===profile).experience);assert.equal(DOCTORS[id].yearsInPractice,undefined);}
 for(const locale of ['de','ru'])assert.equal(UI[locale].doctorFacts['deepu-john'].tenure,copy.locales[locale].find(r=>r.profile==='dr-deepu-john').experience);
});
