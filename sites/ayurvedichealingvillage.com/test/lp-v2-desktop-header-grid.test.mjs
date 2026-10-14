import {test} from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {createHash} from 'node:crypto';
import {productionCss} from '../scripts/build-production-css.mjs';
import {PRODUCTION_SLUGS,productionCampaign} from '../campaign-v2/production/load.ts';
const read=p=>fs.readFileSync(new URL('../'+p,import.meta.url),'utf8');
const f=JSON.parse(read('test/fixtures/desktop-header-approved-delta.json'));
const hash=s=>createHash('sha256').update(s).digest('hex');
// A later approved delta (test/fixtures/whatsapp-prefill-delta.json) is reversed exactly before the byte check.
const wa=JSON.parse(read('test/fixtures/whatsapp-prefill-delta.json')).edits;
const beforeLater=(p,t)=>[...(wa[p]||[])].reverse().reduce((x,e)=>{assert.equal(x.split(e.to).length-1,1,p+' approved WhatsApp delta occurs once');return x.replace(e.to,e.from);},t);
const D=['south-india-cities','brand','lp-south-india','lp-brand','lp-panchakarma'];
test('only the exact approved unpinned desktop header rule changes either stylesheet',()=>{
 for(const [p,expected] of Object.entries(f.baseline)){
  const current=read(p);assert.equal(current.split(f.delta).length-1,1,p);
  assert.equal(hash(current.replace(f.delta,'')),expected,p+' entire prior stylesheet retained');
 }
 assert.equal(read('campaign-v2/production/document.css'),productionCss());
 assert.equal(f.delta,'\n/* Owner feedback, 14 Oct: align the unpinned desktop D header with its existing content grid. */\n@media (min-width: 768px) {\n  .lp-prod[data-variant="D"] .lp-header:not([data-stuck]) { max-width: 1440px; margin-inline: auto; }\n}\n');
});
test('real five D routes use the existing centered 1440px grid; other nineteen and pinned/mobile states excluded',()=>{
 assert.equal(PRODUCTION_SLUGS.length,24);
 assert.deepEqual(PRODUCTION_SLUGS.filter(s=>productionCampaign(s).defaultVariant==='D'),D);
 assert.equal(PRODUCTION_SLUGS.filter(s=>productionCampaign(s).defaultVariant!=='D').length,19);
 const kit=read('campaign-v2/sections/sections.css');
 assert.match(kit,/\[data-variant="D"\] \.lp-hero\{[^}]*max-width:1440px;[^}]*margin-inline:auto/);
 const selector=f.delta.match(/\n  ([^{]+) \{/)[1];
 assert.equal(selector,'.lp-prod[data-variant="D"] .lp-header:not([data-stuck])');
 assert.match(f.delta,/@media \(min-width: 768px\)/);
 assert.doesNotMatch(f.delta,/!important|height:|padding:|position:|display:|background:|color:|\.lp-hero__form|\.lp-consult/);
});
test('original card tests, header markup, mobile styles, contact actions and route bindings are byte-preserved',()=>{
 for(const [p,expected] of Object.entries(f.unchanged))assert.equal(hash(beforeLater(p,read(p))),expected,p);
 const css=read('campaign-v2/production/production.css');
 assert(css.indexOf(f.delta)<css.indexOf('/* Owner feedback, 14 Oct: size desktop D consultation cards'));
});
