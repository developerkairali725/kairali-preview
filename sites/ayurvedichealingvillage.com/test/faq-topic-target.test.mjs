import { repairFaqTopicTargets } from '../app/(english)/_families/faq-topic-targets.mjs';
import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
for (const side of ['desktop', 'mobile']) {
 const view=JSON.parse(fs.readFileSync(`public/ahv/views/ahv-page-faqs-and-downloads-${side}.json`,'utf8'));
 const logic=repairFaqTopicTargets(view.logic,view.id);
 const helper=logic.slice(logic.indexOf('const railTarget ='),logic.indexOf('const esc ='));
 test(`${side}: repair is scoped and idempotent`,()=>{assert.notEqual(logic,view.logic);assert.equal(repairFaqTopicTargets(logic,view.id),logic);assert.equal(repairFaqTopicTargets(view.logic,'other-view'),view.logic);});
 const target={id:'topic-why-choose-kairali'}, special={id:'topic:a?b'};
 for(const prefix of ['', '/de']) test(`${side}: topic links resolve safely on ${prefix || 'English'} FAQ routes`,()=>{
  const location=new URL(`https://ayurvedichealingvillage.com${prefix}/faqs-downloads/`);
  const ctx={URL,decodeURIComponent,location,qa:()=>[target,special]};
  vm.runInNewContext(helper+'globalThis.resolve=railTarget',ctx);
  for(const href of ['#topic-why-choose-kairali',location.pathname+'#topic-why-choose-kairali',location.href+'#topic-why-choose-kairali'])assert.equal(ctx.resolve(href),target);
  assert.equal(ctx.resolve('#topic%3Aa%3Fb'),special);
  for(const href of ['https://other.example/#topic-why-choose-kairali','/other/#topic-why-choose-kairali','#%zz','#missing',''])assert.equal(ctx.resolve(href),null);
 });
}
