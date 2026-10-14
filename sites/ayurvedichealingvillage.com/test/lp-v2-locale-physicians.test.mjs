import monsoonCompatibility from './fixtures/staff-monsoon-config-compatibility.json' with {type:'json'};
import staffRosterIntegration from './fixtures/staff-roster-experience-integration.json' with {type:'json'};
import staffExperienceDelta from './fixtures/staff-experience-approved-delta.json' with {type:'json'};
import experienceCopy from '../english-candidate/staff-experience-copy.json' with {type:'json'};
import {test} from 'node:test';
import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
import fs from 'node:fs';
import {productionCampaign,PRODUCTION_SLUGS} from '../campaign-v2/production/load.ts';
import {DOCTORS,CURRENT_ROSTER} from '../campaign-v2/data/doctors.ts';
import {UI} from '../campaign-v2/production/ui.ts';
import fixture from './fixtures/locale-physicians-20261014.json' with {type:'json'};
const byLocale={de:'lp-behandlung-kerala',ru:'lp-treatment-kerala-ru'};
const languages={de:{Malayalam:'Malayalam',English:'Englisch',Hindi:'Hindi',Tamil:'Tamil'},ru:{Malayalam:'малаялам',English:'английском',Hindi:'хинди',Tamil:'тамильском'}};
const titles={de:'Ihre Ayurveda-Ärzte',ru:'Ваши аюрведические врачи'};
const originalTitles={de:'Ihr Ayurveda-Arzt',ru:'Ваш аюрведический врач'};
const sha=x=>createHash('sha256').update(x).digest('hex');
// AHV train D03: reverse only the exact fixture copy edits in a loaded config before the hash pins (a pathway step is
// mirrored into admission.steps, so one source edit can appear twice; the config hash pin below is the exactness check).
const d03Fixture=JSON.parse(fs.readFileSync(new URL('./fixtures/d03-copy-corrections-20261014.json',import.meta.url),'utf8'));
function reverseD03(slug,c){
 const entry=d03Fixture.files['campaign-v2/production/pages/'+slug+'.ts'];if(!entry)return c;
 for(const {before,after} of [...entry.replacements].reverse()){
  let hits=0;const walk=o=>{for(const k of Object.keys(o)){const v=o[k];if(typeof v==='string'&&v.includes(after)){hits+=v.split(after).length-1;o[k]=v.replace(after,before);}else if(v&&typeof v==='object')walk(v);}};
  walk(c);assert.ok(hits>=1&&hits<=2,slug+': exact D03 copy correction');
 }
 return c;
}
for(const [locale,slug] of Object.entries(byLocale))test(`${locale}: five complete approved cards, actual individual languages, existing portraits and no inferred experience`,()=>{
 const c=productionCampaign(slug);
 assert.deepEqual(c.doctors.map(d=>d.id),[...CURRENT_ROSTER]);assert.equal(c.page.doctors.heading,titles[locale]);
 for(const doc of c.doctors){
  assert.deepEqual(doc,DOCTORS[doc.id]);assert.equal(doc.photo.consent,'confirmed');assert.equal(doc.yearsInPractice,undefined);
  const facts=UI[locale].doctorFacts[doc.id];assert(facts?.role&&facts.tenure,doc.id);
  const profile={'deepu-john':'dr-deepu-john','rahul-r':'dr-rahul-r','akhila-oommen':'dr-akhila-oommen','adhina-ub':'dr-adhina-u-b','aashitha-ps':'dr-aashitha-p-s'}[doc.id];
  assert.equal(facts.tenure,experienceCopy.locales[locale].find(r=>r.profile===profile).experience,doc.id+' retains approved dated lower bound');
  assert.deepEqual(facts.languages,doc.languages.map(l=>languages[locale][l]),doc.id);
  assert(!facts.languages.some(l=>/Deutsch|Russisch|немец|русск/i.test(l)),doc.id);
  assert(UI[locale].doctors.speaks(facts.languages));
 }
 assert.equal(UI[locale].doctorFacts['adhina-ub'].role,locale==='de'?'Stationsärztin (RMO)':'Дежурный врач');
});
test('all24 configs preserve original bytes after exact approved experience facts and DE/RU roster/heading normalization',()=>{
 assert.equal(PRODUCTION_SLUGS.length,24);assert.equal(Object.keys(fixture.configSHA256).length,24);
 for(const slug of PRODUCTION_SLUGS){
  const c=reverseD03(slug,JSON.parse(JSON.stringify(productionCampaign(slug))));const locale=Object.keys(byLocale).find(l=>byLocale[l]===slug);
  if(locale){c.doctors=c.doctors.filter(d=>d.id==='deepu-john');c.page.doctors.heading=originalTitles[locale];}
  for(const doctor of c.doctors){const delta=staffExperienceDelta.sourceDelta['campaign-v2/data/doctors.ts'].find(d=>JSON.parse(d.new.trim().slice(8,-1))===doctor.tenure);assert(delta,doctor.id);doctor.tenure=JSON.parse(delta.old.trim().slice(8,-1));}
  if(slug===monsoonCompatibility.slug){
   assert.equal(sha(fs.readFileSync(new URL('./fixtures/monsoon-2027-approved-delta.json',import.meta.url))),monsoonCompatibility.sourceDeltaFixtureSHA256);
   for(const {path,before,after} of monsoonCompatibility.changes){
    let obj=c;for(const key of path.slice(0,-1))obj=obj[key];const key=path.at(-1);
    assert.deepEqual(obj[key],after,'Exact accepted Monsoon field: '+path.join('.'));
    obj[key]=JSON.parse(JSON.stringify(before));
   }
  }
  assert.equal(sha(JSON.stringify(c)),fixture.configSHA256[slug],slug);
 }
});
test('exact approved source corrections reverse to original bytes, preserving prior facts/copy/style fixtures',()=>{
 for(const [p,entry] of Object.entries(fixture.files)){
  let value=fs.readFileSync(new URL('../'+p,import.meta.url),'utf8');
  const combined=staffRosterIntegration.files[p];
  if(combined){assert.equal(sha(value),combined.afterSHA256,p);for(const{before,after}of combined.replacements){assert.equal(value.split(after).length-1,1,p);value=value.replace(after,before);}assert.equal(sha(value),combined.beforeSHA256,p);}
  for(const delta of staffExperienceDelta.sourceDelta[p]||[]){assert.equal(value.split(delta.new).length-1,1,p);value=value.replace(delta.new,delta.old);}
  assert.equal(sha(value),entry.afterSHA256,p);
  for(const {before,after}of entry.replacements){assert.equal(value.split(after).length-1,1,p);value=value.replace(after,before);}
  assert.equal(sha(value),entry.beforeSHA256,p);
 }
});
