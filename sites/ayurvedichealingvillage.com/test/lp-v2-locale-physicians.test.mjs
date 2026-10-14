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
for(const [locale,slug] of Object.entries(byLocale))test(`${locale}: five complete approved cards, actual individual languages, existing portraits and no inferred experience`,()=>{
 const c=productionCampaign(slug);
 assert.deepEqual(c.doctors.map(d=>d.id),[...CURRENT_ROSTER]);assert.equal(c.page.doctors.heading,titles[locale]);
 for(const doc of c.doctors){
  assert.deepEqual(doc,DOCTORS[doc.id]);assert.equal(doc.photo.consent,'confirmed');assert.equal(doc.yearsInPractice,undefined);
  const facts=UI[locale].doctorFacts[doc.id];assert(facts?.role&&facts.tenure,doc.id);
  assert.deepEqual(facts.languages,doc.languages.map(l=>languages[locale][l]),doc.id);
  assert(!facts.languages.some(l=>/Deutsch|Russisch|немец|русск/i.test(l)),doc.id);
  assert(UI[locale].doctors.speaks(facts.languages));
 }
 assert.equal(UI[locale].doctorFacts['adhina-ub'].role,locale==='de'?'Stationsärztin (RMO)':'Дежурный врач');
});
test('all22 English configs exactly preserved, only roster and doctor heading change in DE/RU configs',()=>{
 assert.equal(PRODUCTION_SLUGS.length,24);assert.equal(Object.keys(fixture.configSHA256).length,24);
 for(const slug of PRODUCTION_SLUGS){
  const c=JSON.parse(JSON.stringify(productionCampaign(slug)));const locale=Object.keys(byLocale).find(l=>byLocale[l]===slug);
  if(locale){c.doctors=c.doctors.filter(d=>d.id==='deepu-john');c.page.doctors.heading=originalTitles[locale];}
  assert.equal(sha(JSON.stringify(c)),fixture.configSHA256[slug],slug);
 }
});
test('exact approved source corrections reverse to original bytes, preserving prior facts/copy/style fixtures',()=>{
 for(const [p,entry] of Object.entries(fixture.files)){
  let value=fs.readFileSync(new URL('../'+p,import.meta.url),'utf8');assert.equal(sha(value),entry.afterSHA256,p);
  for(const {before,after}of entry.replacements){assert.equal(value.split(after).length-1,1,p);value=value.replace(after,before);}
  assert.equal(sha(value),entry.beforeSHA256,p);
 }
});
