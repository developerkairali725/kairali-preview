import {test} from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {productionCampaign, PRODUCTION_SLUGS} from '../campaign-v2/production/load.ts';
import {productionCss} from '../scripts/build-production-css.mjs';
const read=p=>fs.readFileSync(new URL('../'+p,import.meta.url),'utf8');
const css=read('campaign-v2/production/production.css');
const D=['south-india-cities','brand','lp-south-india','lp-brand','lp-panchakarma'];
const block=css.slice(css.indexOf('/* Owner feedback, 14 Oct: size desktop D consultation cards'));
test('desktop-only production D card sizing covers the four observed routes and existing fifth sibling',()=>{
 assert.equal(PRODUCTION_SLUGS.length,24);
 assert.deepEqual(PRODUCTION_SLUGS.filter(s=>productionCampaign(s).defaultVariant==='D'),D);
 for(const slug of D){
  const c=productionCampaign(slug);
  assert.equal(c.production,true,slug);assert.equal(c.consultBar,false,slug);
  assert.ok(c.cta.primary,slug);assert.ok(c.cta.secondary,slug);
 }
 assert.match(block,/^\/\*[^]*?\*\/\n@media \(min-width: 768px\) \{\n/);
 const selectors=[...block.matchAll(/([^{}]+)\{([^{}]*)\}/g)].map(m=>[m[1].trim(),m[2].trim()]);
 assert.deepEqual(selectors,[['.lp-prod[data-variant="D"] .lp-hero__form','align-self: start;'],['.lp-prod[data-variant="D"] .lp-consult--card','height: auto;']]);
 assert.doesNotMatch(block,/!important|min-height|max-height|display:|grid-row:|padding:|background:|color:|position:/);
});
test('existing row-span and kit height remain; production sizing supersedes both without changing mobile or other variants',()=>{
 const kit=read('campaign-v2/sections/sections.css');
 assert.match(kit,/\[data-variant="D"\] \.lp-hero__form\{grid-column:2;grid-row:1\/3\}/);
 assert.match(kit,/\[data-variant="D"\] \.lp-consult\{height:100%;/);
 const generated=read('campaign-v2/production/document.css');
 assert.equal(generated,productionCss());
 assert.ok(generated.indexOf(block)>generated.indexOf('[data-variant="D"] .lp-consult{height:100%;'));
 // Both selectors require the production D ancestor; 19 other production routes and every kit preview are excluded.
 assert.equal(PRODUCTION_SLUGS.filter(s=>productionCampaign(s).defaultVariant!=='D').length,19);
 assert.ok(block.includes('.lp-prod[data-variant="D"] .lp-hero__form'));
});
test('existing same-page primary consultation and Ask Anything channels remain in the compact card',()=>{
 const card=read('campaign-v2/production/ConsultCard.tsx');
 assert.match(card,/href="#enquiry" data-track="cta_click" data-track-cta="consult" data-track-position="hero"/);
 assert.match(card,/<AskAnythingButton className="lp-btn lp-btn--line lp-consult__ask" label=\{c.cta.secondary\}/);
 assert.doesNotMatch(card,/<form\b|<input\b/);
});
