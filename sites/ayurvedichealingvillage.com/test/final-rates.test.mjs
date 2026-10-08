import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
const json=p=>JSON.parse(fs.readFileSync(p,'utf8'));
const index=json('public/ahv/search-index.json');
test('programme totals reconcile to the published villa tariff and minimum nights in every currency',()=>{
 for(const family of ['ayurveda','yoga']){
  const source=json(`english-candidate/final-rates/${family}.json`);
  for(const group of source.groups)for(const programme of group.programmes){
   const p=index.programmes.find(p=>p.route===new URL(programme.url).pathname);assert.ok(p,programme.url);
   assert.equal(p.nights,programme.min_nights);assert.equal(p.validFrom,source.editions.INR.validity.from);assert.equal(p.validTo,source.editions.INR.validity.to);
   for(const currency of ['INR','USD','EUR'])assert.equal(p.from[currency],source.editions[currency].tables[group.id].deluxe[0]*programme.min_nights,p.route+' '+currency);
  }
 }
});
test('training remains per-night pricing, with the correct course durations and effective dates',()=>{
 const source=json('english-candidate/final-rates/training.json');
 for(const course of source.courses){const p=index.programmes.find(p=>p.route===new URL(course.url).pathname);assert.equal(p.basis,'night');assert.equal(p.nights,course.days);assert.equal(p.validFrom,'2026-10-01');assert.equal(p.validTo,'2027-09-30');assert.equal(p.from.INR,18410);}
 assert.ok(!index.programmes.some(p=>p.route==='/ayurveda-training-programme/'), 'the five-course hub is not a sixth priced course');
});
test('current, future and expired tariffs retain their date boundaries',()=>{
 const engineAt=date=>{const c={Date:class extends Date{constructor(...args){super(...(args.length?args:[date]));}}};vm.runInNewContext(fs.readFileSync('public/design/search.js','utf8'),c);return c.AHVSearch.createEngine(index);};
 const yoga=index.programmes.find(p=>p.route==='/yoga-and-meditation-package/');const ayurveda=index.programmes.find(p=>p.route==='/panchakarma-therapy/');
 assert.equal(engineAt('2026-09-30T12:00:00Z').priceAvailable(yoga),false);
 assert.equal(engineAt('2026-10-01T12:00:00Z').priceAvailable(yoga),true);
 assert.equal(engineAt('2026-09-30T12:00:00Z').priceAvailable(ayurveda),true);
 assert.equal(engineAt('2027-09-30T12:00:00Z').priceAvailable(ayurveda),true);
 assert.equal(engineAt('2027-10-01T12:00:00Z').priceAvailable(ayurveda),false);
});
test('published payment and cancellation policy matches the approved boundary wording',()=>{
 const c={window:{}};vm.runInNewContext(fs.readFileSync('public/ahv/assets/policy-family-data.js','utf8'),c);
 const r=c.window.AHV_POLICY.routes.find(r=>r.path==='/cancellation-and-refund-policy/');const text=r.blocks.map(b=>b.text).join(' ');
 assert.match(text,/40% deposit/);assert.match(text,/no later than 30 days before admission/);
 assert.match(text,/More than 30 days before admission: full refund/);
 assert.match(text,/15 to 30 days before admission: 50% of the amount paid is refunded, less applicable transaction fees and taxes/);
 assert.doesNotMatch(text,/100% payment|Full payment must be made at the time of booking/);
});
