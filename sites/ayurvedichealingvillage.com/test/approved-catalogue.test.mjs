import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
const read=p=>JSON.parse(fs.readFileSync(p,'utf8'));
const index=read('public/ahv/search-index.json');
const future=['/yoga-meditation-program/','/new-to-yoga-teacher-training/'];
const finder=(slug,side='desktop')=>{
 const view=read(`public/ahv/views/ahv-page-${slug}-${side}.json`);
 const context={window:{},DCLogic:class{setState(s){Object.assign(this.state,s)}}};
 vm.runInNewContext(view.logic+';globalThis.Instance=Component;',context);
 return { view, instance:new context.Instance() };
};
test('35 priced entries retain distinct 27 Ayurveda, 3 yoga and 5 course identities',()=>{
 const priced=index.programmes.filter(p=>p.from);
 assert.equal(priced.length,35);
 assert.equal(priced.filter(p=>p.cats.includes('T')).length,27);
 assert.equal(priced.filter(p=>p.cats.includes('Y')).length,3);
 assert.equal(priced.filter(p=>p.course).length,5);
 assert.equal(index.programmes.filter(p=>p.availability==='enquiry_only').length,1);
 for(const path of ['/ayurveda-training-programme/','/yoga-meditation-training/'])assert.ok(!index.programmes.some(p=>p.route===path),'hub counted as product '+path);
});
test('Coming Soon entries are discoverable without prices, duration or enrolment',()=>{
 const ctx={};vm.runInNewContext(fs.readFileSync('public/design/search.js','utf8'),ctx);const engine=ctx.AHVSearch.createEngine(index);
 for(const path of future){const p=index.programmes.find(p=>p.route===path);assert.ok(p);assert.equal(p.availability,'coming_soon');assert.equal(p.from,null);assert.equal(p.nights,null);assert.equal(p.validFrom,null);assert.equal(p.bookable,false);assert.match(p.name,/Coming Soon/);assert.equal(engine.priceAvailable(p),false);assert.equal(engine.priceLine(p,'INR'),'Coming Soon');}
 for(const [q,path] of [['personal yoga practice',future[0]],['yoga teacher training',future[1]]])assert.ok(engine.query(q,{scope:'programmes'}).programmes.some(p=>p.route===path),q);
});
for(const side of ['desktop','mobile'])test(`${side}: finder availability, currency and duration filters preserve unknown states`,()=>{
 const {view,instance}=finder('all-programs',side);
 assert.equal(instance.renderVals().list.length,38);
 instance.state.availability='coming_soon';let output=instance.renderVals();assert.equal(output.list.length,2);assert.ok(output.list.every(p=>!p.canEnquire&&p.action==='View details'));
 assert.ok(view.template.includes('value="{{ p.canEnquire }}"'));
 instance.state.dur='7';assert.equal(instance.renderVals().list.length,0);
 instance.state.dur='';instance.state.availability='current';assert.equal(instance.renderVals().list.length,35);
 instance.state.availability='enquiry_only';assert.equal(instance.renderVals().list.length,1);
 instance.state.availability='';instance.state.cur='USD';assert.ok(instance.renderVals().list.some(p=>p.meta.includes('$')));
 const ayurveda=finder('ayurvedic-treatments',side).instance;assert.equal(ayurveda.renderVals().list.length,27);ayurveda.state.cat='Y';assert.equal(ayurveda.renderVals().list.length,0);
 assert.equal(finder('yoga-meditation-programs',side).instance.renderVals().list.length,4);
});
test('two forthcoming route payloads and hub carry no reused product prices or booking claims',()=>{
 for(const slug of ['yoga-meditation-program','new-to-yoga-teacher-training','yoga-meditation-training'])for(const side of ['desktop','mobile']){
  const view=read(`public/ahv/views/ahv-page-${slug}-${side}.json`);assert.doesNotMatch(view.logic,/villaData|₹|\$\d|€\d/);assert.doesNotMatch(view.template,/Certified Yoga|enrol now|book now/i);
  if(slug!=='yoga-meditation-training'){assert.match(view.template,/Coming Soon/);assert.match(view.template,/Enrolment is not currently open/);}
 }
});
test('retained yoga package has its own seven-night tariff and working currency changes',()=>{
 for(const side of ['desktop','mobile']){const {view,instance}=finder('yoga-and-meditation-package',side);assert.match(view.template,/Minimum Duration is 7 Nights/);assert.doesNotMatch(view.template,/quotation for Vaiyaktika/);const vals=instance.renderVals();assert.equal(vals.villas[0].single,'₹21,490');vals.currencies[1].pick();assert.equal(instance.renderVals().villas[0].single,'$307');vals.currencies[2].pick();assert.equal(instance.renderVals().villas[0].single,'€269');}
});
test('all twelve translated catalogues retain explicit Coming Soon and the exact numeric hero minimum',()=>{
 const copy=read('english-candidate/catalogue-locales.json');const codes=['hi','de','fr','es','it','pt','nl','ru','ar','zh-Hans','ja','ko'];
 for(const unit of copy.units){assert.deepEqual(Object.keys(unit.translations).sort(),[...codes].sort());for(const loc of codes)assert.ok(unit.translations[loc].trim(),loc+' '+unit.source);if(unit.source.startsWith('A physician-guided'))for(const text of Object.values(unit.translations))assert.match(text,/14/);}
});
test('approved survivors and personal practice stay live while merged sources redirect',()=>{
 const map=read('english-candidate/redirect-map.json').redirects;
 for(const path of [...future,'/revitalizing-and-strengthening/','/yoga-therapy-individual/'])assert.ok(!map[path],path);
 assert.equal(map['/revitalizing-and-strengthening-treatment-for-cancer-patients/'].to,'/revitalizing-and-strengthening/');
 assert.equal(map['/yoga-retreats/'].to,'/yoga-therapy-individual/');
});
test('training overview links to the five approved courses without becoming a sixth product',()=>{
 const ctx={window:{}};vm.runInNewContext(fs.readFileSync('public/ahv/assets/collection-family-data.js','utf8'),ctx);
 const route=ctx.window.AHV_COLLECTION_FAMILY.routes.find(r=>r.path==='/training/');
 const courses=route.components.find(c=>c.ptr==='/approved-ayurveda-courses').blocks.find(b=>b.kind==='list').items;
 assert.equal(courses.length,5);assert.deepEqual(Array.from(courses,x=>x.tree[0].attrs.href).sort(),index.programmes.filter(p=>p.course).map(p=>p.route).sort());
});
const hubCardLinks=template=>{const main=template.slice(template.indexOf('<main'),template.indexOf('</main>'));
 return main.split('<section class="catalogue-card">').slice(1).map(card=>Array.from(card.matchAll(/<a[^>]*href="([^"]+)"[^>]*>([^<]*)<\/a>/g),m=>({href:m[1],text:m[2].replaceAll('&amp;','&')})));};
const hubViolations=template=>{
 const cards=hubCardLinks(template),problems=[];const byRoute=new Map(index.programmes.map(p=>[p.route,p]));
 const training=cards.find(c=>c.some(l=>l.href==='/ayurveda-training-programme/'));if(!training)return['training card or its View Ayurveda courses link missing'];
 const direct=training.filter(l=>l.href!=='/ayurveda-training-programme/');
 const approved=index.programmes.filter(p=>p.course);
 if(JSON.stringify(direct.map(l=>l.href))!==JSON.stringify(approved.map(p=>p.route)))problems.push('training links '+direct.map(l=>l.href).join(','));
 for(const l of direct)if(byRoute.get(l.href)?.name!==l.text)problems.push('label is not the approved identity for '+l.href);
 const products=cards.flat().map(l=>l.href).filter(h=>byRoute.has(h));
 const expected=index.programmes.filter(p=>(p.from&&p.cats.includes('Y'))||p.availability==='enquiry_only'||p.availability==='coming_soon'||p.course).map(p=>p.route);
 if(JSON.stringify([...products].sort())!==JSON.stringify([...expected].sort()))problems.push('hub product links '+products.join(','));
 for(const h of cards.flat().map(l=>l.href))if(!byRoute.has(h)&&!['/yoga-meditation-programs/','/ayurveda-training-programme/'].includes(h))problems.push('unexpected destination '+h);
 return problems;
};
for(const side of ['desktop','mobile'])test(`${side}: Yoga & Training hub links the five approved courses directly, keeps the course hub and every prior destination`,()=>{
 const {template}=read(`public/ahv/views/ahv-page-yoga-meditation-training-${side}.json`);
 assert.deepEqual(hubViolations(template),[]);
 const approved=index.programmes.filter(p=>p.course);
 const wrong=template.replace(`href="${approved[2].route}"`,'href="/intensive-ayurveda-training-program/"');
 assert.notEqual(wrong,template);assert.ok(hubViolations(wrong).length>0,'wrong course route must be rejected');
 const missing=template.replace(/<li><a href="\/one-day-ayurveda-workshop-program-kerala\/">[^<]*<\/a><\/li>/,'');
 assert.notEqual(missing,template);assert.ok(hubViolations(missing).length>0,'missing course link must be rejected');
});
