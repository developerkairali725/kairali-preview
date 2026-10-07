import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
import crypto from 'node:crypto';
const read = file => JSON.parse(fs.readFileSync(file, 'utf8'));
const manifest = read('english-candidate/route-manifest.json').routes;
const routes = read('l10n/routes.json');
const merged = {'/revitalizing-and-strengthening-treatment-for-cancer-patients/':'/revitalizing-and-strengthening/','/yoga-retreats/':'/yoga-therapy-individual/'};
const view = (slug, side) => read(`public/ahv/views/ahv-page-${slug}-${side}.json`);
const ctx = {window:{}};
vm.runInNewContext(fs.readFileSync('public/ahv/assets/all-programs-data.js','utf8'),ctx);
const catalogue = ctx.window.AHV_FINDER.programmes;

test('two approved sources and all twelve supported locale copies have one-hop 301 destinations', () => {
 const map = read('english-candidate/redirect-map.json');
 assert.equal(map.statusCode,301);
 for (const [src,dst] of Object.entries(merged)) {
  assert.equal(map.redirects[src].to,dst);assert.ok(!map.redirects[dst]);
  assert.equal(routes.routes[src],undefined);
  for(const [loc,target] of Object.entries(routes.routes[dst])) {
   if(loc==='en')continue;
   const prefix=loc==='zh-Hans'?'zh':loc;
   const source='/'+prefix+src;
   assert.equal(routes.redirects[source]?.to,target,source);
   assert.ok(!routes.redirects[target],target);
  }
  assert.equal(manifest.find(r=>r.path===dst).metadata.canonical,'https://ayurvedichealingvillage.com'+dst);
  assert.ok(manifest.find(r=>r.path===src).sitemapExclude);
 }
 for(const [source,r] of Object.entries(routes.redirects))assert.ok(!routes.redirects[r.to],source+' has a chain');
});
test('one bespoke individual-yoga service sits beside exactly 35 unchanged priced products', () => {
 assert.equal(catalogue.filter(p=>p.from?.INR!=null).length,35);
 const bespoke=catalogue.filter(p=>p.availability==='enquiry_only');assert.equal(bespoke.length,1);
 assert.equal(bespoke[0].route,'/yoga-therapy-individual/');assert.equal(bespoke[0].minimumNights,null);
 assert.ok(Object.values(bespoke[0].from).every(v=>v===null));assert.equal(bespoke[0].bookable,false);
 assert.ok(!catalogue.some(p=>p.route==='/yoga-retreats/'));
 const row=manifest.find(r=>r.path==='/yoga-therapy-individual/');
 assert.equal(row.desktopView,'ahv-page-yoga-retreats-desktop');assert.equal(row.dataset,null);
 const search=read('public/ahv/search-index.json');assert.ok(search.programmes.some(p=>p.route===row.path));
 assert.ok(!search.pages.some(p=>Object.hasOwn(merged,p.route||p.path)));
});
for(const side of ['desktop','mobile'])test(`${side} survivors retain programme content, safeguards and enquiry actions`,()=>{
 const cancer=view('supportive-care-cancer',side),yoga=view('yoga-retreats',side);
 assert.match(cancer.template,/those recently diagnosed/);assert.match(cancer.template,/never instead of/);
 assert.match(cancer.template,/Mindful Breathing/);assert.match(cancer.template,/optional factory visit/);
 assert.match(cancer.template,/Private yoga or meditation sessions/);assert.match(cancer.template,/What follow-up is included/);
 assert.match(cancer.logic,/title: 'Agriculture Class'/);assert.doesNotMatch(cancer.template+cancer.logic,/\bVaman\b/);
 assert.match(yoga.template,/Vaiyaktika Yoga Sādhanā/);assert.match(yoga.template,/Watch yoga film/);
 assert.match(yoga.template,/Prakriti/);assert.match(yoga.template,/continue at home/);assert.match(yoga.template,/discussed separately after assessment/);
 assert.match(yoga.template,/How is personalised yoga matched to my ability/);assert.match(yoga.template,/programme=treatment/);
 assert.match(yoga.template,/<meta name="robots" content="index, follow">/);
 assert.doesNotMatch(yoga.template,/href="https:\/\/ayurvedichealingvillage.com\/yoga-retreats\//);
 assert.doesNotMatch(yoga.template+yoga.logic,/villaData|Minimum Duration|₹[0-9]|€[0-9]|\$[0-9]/);
});
test('approved Dhoompanam object illustration replaces the heading-only placeholder with its exact 720px asset',()=>{
 const data={window:{}};vm.runInNewContext(fs.readFileSync('public/ahv/assets/seven-informational-data.js','utf8'),data);
 const d=Object.values(data.window)[0];const route=d.routes.find(r=>r.path==='/ayurveda-treatment/');
 const card=route.components.flatMap(c=>c.blocks||[]).find(b=>b.ptr==='/owner-approved-illustration/dhoompanam');
 assert.equal(card.kind,'card');assert.equal(card.assetReview,undefined);
 const img=card.blocks.find(b=>b.kind==='image');assert.equal(img.width,720);assert.equal(img.height,720);
 assert.equal(img.src,'/ahv/assets/img/therapy-illustrations/dhoompanam-65d1de03c6c2.webp');
 assert.equal(crypto.createHash('sha256').update(fs.readFileSync('public/ahv/assets/img/therapy-illustrations/dhoompanam.webp')).digest('hex'),'4baa332680c5ea2a724d693d2e83637f8bbef474bdfa39a423324bf33678d11d');
 assert.equal(crypto.createHash('sha256').update(fs.readFileSync('public'+img.src)).digest('hex'),'65d1de03c6c20241e877ce4245d3bfeeca0fb17783dec7c2208aa40998e7e6fc');
 assert.match(img.alt,/three brown cloth-wrapped Dhumavati sticks/);
 assert.equal(card.blocks.find(b=>b.kind==='caption').tree[0].v,'Dhoompanam — Illustration');
});
test('the survivor retains all approved FAQ answers and matching structured data in both source layouts',()=>{
 const expected=read('english-candidate/approved-programme-faqs-20260925.json').routes.find(r=>r.route==='/yoga-therapy-individual/').faqs;
 const decode=s=>s.replace(/&amp;/g,'&').replace(/&#x27;/g,"'").replace(/&quot;/g,'"').replace(/&lt;/g,'<').replace(/&gt;/g,'>');
 for(const side of ['desktop','mobile']) {
  const html=view('yoga-retreats',side).template;
  const section=html.match(/<section\b[^>]*id="faqs"[^>]*>([\s\S]*?)<\/section>/)[1];
  const actual=[...section.matchAll(/<summary[^>]*>(.*?)<\/summary><p[^>]*>(.*?)<\/p>/g)].map(m=>({q:decode(m[1]),a:decode(m[2])}));
  assert.deepEqual(actual,expected);
  const schemas=[...html.matchAll(/<script[^>]*type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/g)].flatMap(m=>{const d=JSON.parse(m[1]);return d['@graph']||[d]});
  assert.deepEqual(schemas.find(s=>s['@type']==='FAQPage').mainEntity.map(s=>({q:s.name,a:s.acceptedAnswer.text})),expected);
 }
});
test('all twelve localized source payloads carry the translated merge copy, canonical and illustration alt',()=>{
 const copy=read('english-candidate/release-visible-locales.json').units;
 const prose=copy.filter(u=>/^(Our trained yoga instructors|Discuss your experience, health goals|Any Ayurvedic treatments, dietary|Ask reception about the organic|Illustration of three brown)/.test(u.source));
 assert.equal(prose.length,5);
 for(const loc of routes.locales.filter(l=>l!=='en')) {
  const prefix=loc==='zh-Hans'?'zh':loc;
  const yoga=read(`public/ahv/l10n/${prefix}/views/ahv-page-yoga-retreats-mobile.json`).template;
  const cancer=read(`public/ahv/l10n/${prefix}/views/ahv-page-supportive-care-cancer-mobile.json`).template;
  const data=fs.readFileSync(`public/ahv/l10n/${prefix}/assets/seven-informational-data.js`,'utf8');
  assert.ok(data.includes('/ahv/assets/img/therapy-illustrations/dhoompanam-65d1de03c6c2.webp'),loc+' fingerprinted artwork URL');
  assert.ok(!data.includes('/ahv/assets/img/therapy-illustrations/dhoompanam.webp'),loc+' stale artwork URL');
  for(const u of prose) {
   assert.ok(u.translations[loc]&&u.translations[loc]!==u.source);
   const payload=u.source.startsWith('Ask reception')?cancer:u.source.startsWith('Illustration')?data:yoga;
   assert.ok(payload.includes(u.translations[loc]),loc+' '+u.source);
   assert.ok(!payload.includes(u.source),loc+' English fallback');
  }
  assert.ok(yoga.includes('https://ayurvedichealingvillage.com'+routes.routes['/yoga-therapy-individual/'][loc]));
  assert.equal(read(`l10n/generated/${loc}.json`).missingUnits,0);
 }
});
