import {test} from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {createHash} from 'node:crypto';
import {productionCss} from '../scripts/build-production-css.mjs';
import {PRODUCTION_SLUGS,productionCampaign} from '../campaign-v2/production/load.ts';
import {reverseTrainASource} from './fixtures/train-a-20261014.mjs';
import {reverseTrainBSource} from './fixtures/train-b-20261015.mjs';
// Train F (15 Oct 2026) sits on top of Train B: its exact photograph picks are reversed first (fixtures/train-f-20261015.mjs).
import {reverseTrainFSource} from './fixtures/train-f-20261015.mjs';
const read=p=>fs.readFileSync(new URL('../'+p,import.meta.url),'utf8');
const f=JSON.parse(read('test/fixtures/desktop-header-approved-delta.json'));
const hash=s=>createHash('sha256').update(s).digest('hex');
// A later approved delta (test/fixtures/whatsapp-prefill-delta.json) is reversed exactly before the byte check.
const wa=JSON.parse(read('test/fixtures/whatsapp-prefill-delta.json')).edits;
const beforeLater=(p,t)=>[...(wa[p]||[])].reverse().reduce((x,e)=>{assert.equal(x.split(e.to).length-1,1,p+' approved WhatsApp delta occurs once');return x.replace(e.to,e.from);},t);
// The approved shared legal-links row (PR429, test/fixtures/form-legal-links-delta.json, commit 739af8049) appended its
// exact cssAddition to both stylesheets after this fixture's baseline; it is removed exactly once before the byte checks.
const legal=JSON.parse(read('test/fixtures/form-legal-links-delta.json'));
const LEGAL_CSS=['campaign-v2/production/document.css','campaign-v2/sections/sections.css'];
const beforeLegal=(p,t)=>{if(!LEGAL_CSS.includes(p))return t;assert.equal(t.split(legal.cssAddition).length-1,1,p+' approved legal-links CSS occurs once');return t.replace(legal.cssAddition,'');};
// Newest first: every Train A candidate delta (composed, exact), batch 7's WhatsApp delta, then the legal-links CSS.
// Train B (15 Oct): the composed Train B reversal runs first (fixtures/train-b-20261015.mjs; C02/C03 header Call prefix).
const prior=(p)=>beforeLegal(p,beforeLater(p,reverseTrainASource(p,reverseTrainBSource(p,reverseTrainFSource(p,read(p))))));
const D=['south-india-cities','brand','lp-south-india','lp-brand','lp-panchakarma'];
test('only the exact approved unpinned desktop header rule changes either stylesheet',()=>{
 for(const [p,expected] of Object.entries(f.baseline)){
  // Train A (batch 6 AHV-WB.530 Russian phone hero-CTA, ...) and the legal-links CSS are removed exactly first.
  const current=prior(p);assert.equal(current.split(f.delta).length-1,1,p);
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
 for(const [p,expected] of Object.entries(f.unchanged))assert.equal(hash(prior(p)),expected,p);
 const css=read('campaign-v2/production/production.css');
 assert(css.indexOf(f.delta)<css.indexOf('/* Owner feedback, 14 Oct: size desktop D consultation cards'));
});
