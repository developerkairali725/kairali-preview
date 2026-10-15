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
import {reverseTrainAConfig,reverseTrainASource} from './fixtures/train-a-20261014.mjs';
import {reverseTrainBConfig,reverseTrainBSource} from './fixtures/train-b-20261015.mjs';
// Train F (15 Oct 2026) sits on top of Train B: its exact photograph picks are reversed first (fixtures/train-f-20261015.mjs).
import {reverseTrainFConfig as reverseTrainFConfigOnly,reverseTrainFSource as reverseTrainFSourceOnly} from './fixtures/train-f-20261015.mjs';
import {reverseTrainHConfig,reverseTrainHSource} from './fixtures/train-h-20261015.mjs';
// Train H (15 Oct 2026) composes on Train F (fixtures/train-h-20261015.mjs): its delta is reversed first.
const reverseTrainFSource=(p,s)=>reverseTrainFSourceOnly(p,reverseTrainHSource(p,s));
const reverseTrainFConfig=(slug,c)=>reverseTrainFConfigOnly(slug,reverseTrainHConfig(slug,c));
// Train G rework (15 Oct 2026) sits on top of Train F: its exact RU phone placeholder is reversed first (fixtures/train-g-rework-20261015.mjs).
import {reverseTrainGConfig} from './fixtures/train-g-rework-20261015.mjs';
import {reverseThirdGuestFilmsConfig} from './fixtures/pr429-integration-config.mjs';
const byLocale={de:'lp-behandlung-kerala',ru:'lp-treatment-kerala-ru'};
const languages={de:{Malayalam:'Malayalam',English:'Englisch',Hindi:'Hindi',Tamil:'Tamil'},ru:{Malayalam:'малаялам',English:'английском',Hindi:'хинди',Tamil:'тамильском'}};
const titles={de:'Ihre Ayurveda-Ärzte',ru:'Ваши аюрведические врачи'};
const originalTitles={de:'Ihr Ayurveda-Arzt',ru:'Ваш аюрведический врач'};
const sha=x=>createHash('sha256').update(x).digest('hex');
// Owner decisions, 14 Oct 2026 (AHV-WB.042.change, AHV-WB.299.change): their exact config reversal (weight Stories band,
// Panchakarma 14–28 night range) is composed with the other Train A candidates in fixtures/train-a-20261014.mjs.
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
  // PR429 also appended the approved third guest film to three campaigns after these pins; reverse it exactly too.
  // Train B (15 Oct): every merged Train B candidate's exact config change is reversed first (fixtures/train-b-20261015.mjs).
  const c=reverseThirdGuestFilmsConfig(slug,reverseTrainAConfig(slug,reverseTrainBConfig(slug,reverseTrainFConfig(slug,reverseTrainGConfig(slug,JSON.parse(JSON.stringify(productionCampaign(slug))))))));const locale=Object.keys(byLocale).find(l=>byLocale[l]===slug);
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
  // Train A (14 Oct 2026) and Train B (15 Oct 2026): reverse exactly every merged candidate's recorded source delta first.
  let value=reverseTrainASource(p,reverseTrainBSource(p,reverseTrainFSource(p,fs.readFileSync(new URL('../'+p,import.meta.url),'utf8'))));
  const combined=staffRosterIntegration.files[p];
  if(combined){assert.equal(sha(value),combined.afterSHA256,p);for(const{before,after}of combined.replacements){assert.equal(value.split(after).length-1,1,p);value=value.replace(after,before);}assert.equal(sha(value),combined.beforeSHA256,p);}
  for(const delta of staffExperienceDelta.sourceDelta[p]||[]){assert.equal(value.split(delta.new).length-1,1,p);value=value.replace(delta.new,delta.old);}
  assert.equal(sha(value),entry.afterSHA256,p);
  for(const {before,after}of entry.replacements){assert.equal(value.split(after).length-1,1,p);value=value.replace(after,before);}
  assert.equal(sha(value),entry.beforeSHA256,p);
 }
});
