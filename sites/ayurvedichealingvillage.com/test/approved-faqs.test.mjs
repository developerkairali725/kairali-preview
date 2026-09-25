import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
const rows = JSON.parse(fs.readFileSync('english-candidate/approved-programme-faqs-20260925.json')).routes;
const routes = JSON.parse(fs.readFileSync('english-candidate/routes.json')).routes;
const views = Object.fromEntries(fs.readdirSync('public/ahv/views').filter(f=>f.endsWith('.json')).map(f=>{const v=JSON.parse(fs.readFileSync('public/ahv/views/'+f));return [v.file,v];}));
const decode = s => s.replace(/&amp;/g,'&').replace(/&#x27;/g,"'").replace(/&quot;/g,'"').replace(/&lt;/g,'<').replace(/&gt;/g,'>');
for (let offset=0;offset<rows.length;offset+=25) test(`approved FAQ visible copy and schema agree, routes ${offset+1}–${Math.min(offset+25,rows.length)}`,()=>{
 for (const row of rows.slice(offset,offset+25)) {
  const route=routes.find(r=>r.path===row.route);
  const surfaces=[...route.views.map(f=>views[f].template),fs.readFileSync('english-candidate/prerender/'+row.route.slice(1,-1)+'.html','utf8')];
  for (const html of surfaces) {
   const sections=[...html.matchAll(/<section\b[^>]*id="faqs"[^>]*>([\s\S]*?)<\/section>/g)];
   assert.equal(sections.length,1,row.route);
   const visible=[...sections[0][1].matchAll(/<summary[^>]*>(.*?)<\/summary><p[^>]*>(.*?)<\/p>/g)].map(m=>({q:decode(m[1]),a:decode(m[2])}));
   assert.deepEqual(visible,row.faqs,row.route);
   const schemas=[...html.matchAll(/<script[^>]*type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/g)].map(m=>{try{return JSON.parse(m[1]);}catch{return {};}}).filter(s=>s['@type']==='FAQPage');
   assert.equal(schemas.length,1,row.route);
   assert.deepEqual(schemas[0].mainEntity.map(s=>({q:s.name,a:s.acceptedAnswer.text})),row.faqs,row.route);
   assert.ok(visible.some(f=>f.a.includes('four remote follow-up consultations')&&f.a.includes('dates are not fixed')),row.route);
  }
 }
});
test('general FAQ no longer advertises fixed follow-up dates or available new-patient consultations',()=>{
 for (const side of ['desktop','mobile']) {
  const html=JSON.parse(fs.readFileSync(`public/ahv/views/ahv-page-faqs-and-downloads-${side}.json`)).template;
  const answer=id=>html.match(new RegExp('<details[^>]*id="'+id+'"[^>]*>[\\s\\S]*?</details>'))[0];
  assert.match(answer('q-41'),/four remote follow-up consultations/);
  assert.doesNotMatch(answer('q-41'),/1, 3 and 6 months/);
  assert.match(answer('q-45'),/coming soon/);
  assert.match(answer('q-35'),/additional cost/);
 }
});
