import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
const read=p=>fs.readFileSync(new URL('../'+p,import.meta.url),'utf8');
const routes=JSON.parse(read('campaign-v110/routes.json'));
test('supplier route inventory remains complete and German page has a German document',()=>{
 assert.equal(routes.length,28);assert.equal(new Set(routes).size,28);
 for(const r of routes.filter(r=>!JSON.parse(read("campaign-v110/retained-original-routes.json")).includes(r))){const group=r==='/lp/behandlung-in-kerala/'?'(campaign-de)':r.startsWith('/lp/')?'(lp)':'(campaign)';assert.ok(fs.existsSync(new URL('../app/'+group+r.replace(/\/$/,'')+'/page.tsx',import.meta.url)),r);}
 assert.match(read('app/(campaign-de)/layout.tsx'),/lang="de"/);
});
test('supplier form mount uses the existing endpoint and no duplicate consent or chat',()=>{
 assert.match(read('campaign-v110/components/EnquiryForm.tsx'),/CampaignEnquiryForm/);
 assert.doesNotMatch(read('campaign-v110/components/PageShell.tsx'),/<CookieConsent|<ChatWidgetSlot/);
 assert.match(read('campaign-v110/CampaignDocument.tsx'),/<ConsentScripts \/>/);
 assert.match(read('campaign-v110/CampaignDocument.tsx'),/<ChatbaseLoader \/>/);
 assert.match(read('app/(lp)/_components/campaign-enquiry-form.tsx'),/'gclid'/);
 assert.match(read('campaign-v110/SharedConsent.tsx'),/CONSENT_RUNTIME/);
});
test('all three supplied offers retain approved bands and binding confirmed quotes',()=>{
 for(const slug of ['defence-and-paramilitary','olympics-and-paralympics-offer','senior-citizen-offer']){
  const s=read(`campaign-v110/pages/offers/${slug}/staging.html`);
  for(const t of ['10% for 3–13 nights','15% for 14–20 nights','20% for 21 nights or more','Stays of 1–2 nights','before tax','discounts are not added together','agreed offer is honoured'])assert.ok(s.includes(t),slug+' '+t);
  assert.doesNotMatch(s,/Rates and inclusions are subject to change|first-time guests only|priority check-in/);
 }
});
