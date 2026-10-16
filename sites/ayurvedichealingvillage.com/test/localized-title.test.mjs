import test from 'node:test';import assert from 'node:assert/strict';import fs from 'node:fs';import vm from 'node:vm';
import { reviewedTitleFor, restoreReviewedHead, reviewedCatalogueTitle } from '../app/(english)/_families/localized-title.mjs';
const locales=['hi','de','fr','es','it','pt','nl','ru','ar','zh-Hans','ja','ko'];
test('Only the reviewed programme and training routes in twelve registered locales reuse their accepted catalogue titles',()=>{
 for(const locale of locales){const meta=JSON.parse(fs.readFileSync(new URL('../l10n/generated/'+locale+'.json',import.meta.url))).meta;for(const path of ["/panchakarma-therapy/", "/post-pregnancy-health-programme/", "/preventive-and-regenerative-treatment/", "/ananda-lahari-yoga-and-ayurveda-retreat/", "/archive-yoga-retreat/", "/ashtanga-yoga-and-ayurveda-retreat/", "/all-programs/", "/ayurveda-training-programme/", "/ayurvedic-treatment-packages.html", "/panchkarma-treatment.html", "/weight-loss-programme/", "/digestive-wellness-gut-health-yoga-therapy/", "/holistic-treatment-for-rejuvenation-and-detoxification/", "/treatment-for-bronchial-diseases/", "/treatment-for-hypertension/", "/treatment-for-paralysis/", "/treatment-for-skin-diseases/", "/personalized-customized-healing-program/", "/advanced-ayurveda-lifestyle-consultant-and-therapist-training-program-kerala-aalct-hv/", "/intensive-ayurveda-training-program-learn-practice-ayurveda/", "/level-one-advance-ayurveda-training-program-for-wellness-professionals-kerala-aatp-1-hv/", "/new-to-yoga-teacher-training/", "/one-day-ayurveda-workshop-program-kerala/", "/three-day-short-term-ayurveda-certificate-program-tap-hv/"]){const title=reviewedCatalogueTitle(path,meta[path]);assert.equal(reviewedTitleFor(path,locale,title),title);assert.equal(reviewedTitleFor(path,'en',title),path === '/archive-yoga-retreat/' ? title : undefined);}}
 for(const path of ['/how-to-reach/','/contact-us/','/lp/treatment-packages/'])assert.equal(reviewedTitleFor(path,'de','Title'),undefined);
 for(const value of [undefined,null,'', '  '])assert.equal(reviewedTitleFor('/panchkarma-treatment.html','de',value),undefined);
 assert.equal(reviewedTitleFor('/panchkarma-treatment.html','xx','Title'),undefined);
});
function fixture(initial){let value=initial,writes=0,node=initial===null?null:{get textContent(){return value},set textContent(v){value=v;writes++}};const doc={head:{querySelector(s){assert.equal(s,'title');return node},appendChild(n){node=n}},createElement(t){assert.equal(t,'title');return{get textContent(){return value},set textContent(v){value=v;writes++}}}};return{doc,text:()=>value,writes:()=>writes};}
test('Runtime corrects an English overwrite once and remains quiet on later head passes',()=>{
 const run=vm.runInNewContext('('+restoreReviewedHead.toString()+')');const f=fixture('English title');assert.equal(run(f.doc,'Ayurveda-Behandlungsprogramme in Kerala | Kairali'),true);for(let i=0;i<25;i++)assert.equal(run(f.doc,'Ayurveda-Behandlungsprogramme in Kerala | Kairali'),false);assert.equal(f.writes(),1);assert.equal(f.text(),'Ayurveda-Behandlungsprogramme in Kerala | Kairali');
});
test('Missing title is restored; unconfigured pages are untouched',()=>{const f=fixture(null);assert.equal(restoreReviewedHead(f.doc,'Reviewed title'),true);assert.equal(f.text(),'Reviewed title');assert.equal(f.writes(),1);assert.equal(restoreReviewedHead(f.doc,undefined),false);assert.equal(f.writes(),1)});

test('The same scoped head repair restores the accepted canonical once without touching other metadata',()=>{
 let title='Reviewed title',href='https://ayurvedichealingvillage.com/ayurvedic-treatment-packages.html',writes=0;
 const node={get textContent(){return title},set textContent(v){title=v;writes++}};
 const link={getAttribute(k){assert.equal(k,'href');return href},setAttribute(k,v){assert.equal(k,'href');href=v;writes++}};
 const doc={head:{querySelector(s){if(s==='title')return node;if(s==='link[rel="canonical"]')return link;throw Error('Unexpected metadata access '+s)}}};
 const canonical='https://ayurvedichealingvillage.com/hi/ayurvedic-treatment-packages.html';
 const run=vm.runInNewContext('('+restoreReviewedHead.toString()+')');assert.equal(run(doc,title,canonical),true);assert.equal(href,canonical);for(let i=0;i<25;i++)assert.equal(run(doc,title,canonical),false);assert.equal(writes,1);
 assert.equal(run(doc,undefined,'https://example.org/'),false);assert.equal(writes,1);
});


test('Canonical-only repair preserves the already translated title and remains quiet after one correction',()=>{
 let href='https://ayurvedichealingvillage.com/karkidaka-chikitsha-or-monsoon-wellness.html',writes=0;
 const canonical='https://ayurvedichealingvillage.com/de/karkidaka-chikitsha-or-monsoon-wellness.html';
 const link={getAttribute(k){assert.equal(k,'href');return href},setAttribute(k,v){assert.equal(k,'href');href=v;writes++}};
 const doc={head:{querySelector(s){assert.equal(s,'link[rel="canonical"]','Canonical-only mode must not access or change the title');return link}}};
 const run=vm.runInNewContext('('+restoreReviewedHead.toString()+')');
 assert.equal(run(doc,undefined,canonical),true);assert.equal(href,canonical);
 for(let i=0;i<25;i++)assert.equal(run(doc,undefined,canonical),false);
 assert.equal(writes,1);assert.equal(run(doc,undefined,'https://example.org/'),false);
});

test('Archive reuses approved localized OG title only when its title is absent',()=>{
 assert.equal(reviewedCatalogueTitle('/archive-yoga-retreat/',{title:null,ogTitle:'Vergangene Retreats & Veranstaltungen'}),'Vergangene Retreats & Veranstaltungen');
 assert.equal(reviewedCatalogueTitle('/archive-yoga-retreat/',{title:'Explicit',ogTitle:'Other'}),'Explicit');
 assert.equal(reviewedCatalogueTitle('/unreviewed/',{title:null,ogTitle:'Other'}),undefined);
});
test("Mindfulness keeps accepted translated titles without changing English", () => { assert.equal(reviewedTitleFor("/mindfulness-retreat/", "de", "Achtsamkeits-Retreat"), "Achtsamkeits-Retreat"); assert.equal(reviewedTitleFor("/mindfulness-retreat/", "en", "Mindfulness Retreat"), undefined); });

test('Panchakarma keeps its existing English and translated titles; other English routes stay untouched',()=>{
 for(const locale of ['en',...locales])assert.equal(reviewedTitleFor('/panchakarma/',locale,'Approved title'),'Approved title');
 assert.equal(reviewedTitleFor('/panchakarma-therapy/','en','Title'),undefined);
});
test('Panchakarma description guard repairs one overwrite and then remains idle',()=>{
 let value='Old dataset description',writes=0;
 const node={getAttribute:k=>value,setAttribute(k,v){assert.equal(k,'content');value=v;writes++;}};
 const doc={head:{querySelector(s){assert.equal(s,'meta[name="description"]');return node;}}};
 const run=vm.runInNewContext('('+restoreReviewedHead.toString()+')');assert.equal(run(doc,undefined,undefined,'Approved source description'),true);
 for(let i=0;i<25;i++)assert.equal(run(doc,undefined,undefined,'Approved source description'),false);
 assert.equal(writes,1);assert.equal(value,'Approved source description');assert.equal(run(doc),false);
});

test('Approved social description repairs both share tags without repeated writes',()=>{
 const values={'meta[property="og:description"]':'Old OG','meta[name="twitter:description"]':'Old Twitter'};let writes=0;
 const doc={head:{querySelector(selector){assert(selector in values);return {getAttribute:()=>values[selector],setAttribute(k,v){assert.equal(k,'content');values[selector]=v;writes++;}}}}};
 const run=vm.runInNewContext('('+restoreReviewedHead.toString()+')');assert.equal(run(doc,undefined,undefined,undefined,'Approved social description'),true);assert.equal(writes,2);
 for(let i=0;i<25;i++)assert.equal(run(doc,undefined,undefined,undefined,'Approved social description'),false);assert.equal(writes,2);
});

test("Archive keeps its accepted English server title after runtime writes",()=>{assert.equal(reviewedTitleFor("/archive-yoga-retreat/","en","Past Retreats & Events | Kairali Healing Village"),"Past Retreats & Events | Kairali Healing Village");});

test("Eleven clinical pages retain accepted locale titles without changing English or body content",()=>{
 const paths=["/treatment-for-arthritis-and-spondylitis/", "/treatment-for-cervical-spondylosis/", "/treatment-for-chronic-back-pain/", "/treatment-for-diabetes/", "/treatment-for-facial-paralysis/", "/treatment-for-nervous-disability/", "/treatment-for-psoriasis/", "/treatment-for-sinusitis-and-migraine/", "/treatment-for-slip-disc/", "/treatment-for-spondylitis/", "/treatment-to-remove-stress-and-strain/"];
 for(const locale of locales){const meta=JSON.parse(fs.readFileSync(new URL("../l10n/generated/"+locale+".json",import.meta.url))).meta;for(const path of paths){const title=meta[path]?.title;assert.equal(typeof title,"string",locale+path);assert(title.trim());assert.equal(reviewedTitleFor(path,locale,title),title);assert.equal(reviewedTitleFor(path,"en",title),undefined);}}
});

test("five retained programme titles use only their accepted locale value",()=>{for(const route of ["/beauty-care-and-eye-care/", "/de-addiction-and-rehabilitation-from-alcohol-drugs-tobacco/", "/immunity-enhancement-executive-health-assessment-therapy/", "/revitalizing-and-strengthening/", "/womens-hormonal-balance-endocrine-therapy/"]){for(const locale of ["hi","de","fr","es","it","pt","nl","ru","ar","zh-Hans","ja","ko"]){assert.equal(reviewedTitleFor(route,locale,"Accepted title"),"Accepted title");}assert.equal(reviewedTitleFor(route,"en","English"),undefined);assert.equal(reviewedTitleFor(route.slice(0,-1),"de","Title"),undefined);}});

test("wellness and yoga hubs retain accepted locale titles",()=>{for(const route of ["/wellness-programs/", "/yoga-meditation-programs/"])for(const locale of ["hi","de","fr","es","it","pt","nl","ru","ar","zh-Hans","ja","ko"]){assert.equal(reviewedTitleFor(route,locale,"Accepted hub title"),"Accepted hub title");assert.equal(reviewedTitleFor(route,"en","English"),undefined);}});

test("N08 batch 4 routes keep their served locale titles after the English helmet write",()=>{
 const routes=["/","/about-us/","/yoga-and-meditation-package/","/yoga-based-stress-energy-reset-program/","/yoga-meditation-program/","/yoga-meditation-training/","/ayurvedic-new-year-yala-2018/","/ayuryoga/","/back-to-roots/","/lakshya-yoga/"];
 for(const locale of locales){const meta=JSON.parse(fs.readFileSync(new URL("../l10n/generated/"+locale+".json",import.meta.url))).meta;for(const route of routes){const title=meta[route]?.title;assert.equal(typeof title,"string",route+" "+locale);assert.ok(title.trim(),route+" "+locale);assert.equal(reviewedTitleFor(route,locale,reviewedCatalogueTitle(route,meta[route])),title);}}
 for(const route of routes.filter(r=>r!=="/yoga-and-meditation-package/"))assert.equal(reviewedTitleFor(route,"en","English"),undefined);
 const manifest=JSON.parse(fs.readFileSync(new URL("../english-candidate/route-manifest.json",import.meta.url)));const pkg=manifest.routes.find(r=>r.path==="/yoga-and-meditation-package/");
 assert.equal(pkg.metadata.title,"Yoga and Meditation Package | Kairali Healing Village");
 assert.equal(reviewedTitleFor("/yoga-and-meditation-package/","en",pkg.metadata.title),pkg.metadata.title);
 assert.equal(reviewedTitleFor("/yoga-meditation-program/","en","Yoga Training for Personal Practice — Coming Soon | Kairali"),undefined);
});
