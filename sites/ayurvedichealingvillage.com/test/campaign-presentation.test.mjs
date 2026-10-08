import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
import {createRequire} from 'node:module';
import ts from 'typescript';
import {htmlToDOM,Element} from 'html-react-parser';
const require=createRequire(import.meta.url);
const filename=new URL('../campaign-v110/components/campaign-presentation.ts',import.meta.url);
const result={exports:{}};
const source=ts.transpileModule(fs.readFileSync(filename,'utf8'),{compilerOptions:{module:ts.ModuleKind.CommonJS,esModuleInterop:true}}).outputText;
vm.runInNewContext(source,{exports:result.exports,module:result,require:name=>name.endsWith('.css')?{}:name==='../routes.json'?JSON.parse(fs.readFileSync(new URL('../campaign-v110/routes.json',import.meta.url))):require(name)});
const {campaignPresentation,elements,textContent,isCampaign,campaignRoutes}=result.exports;
const find=(nodes,p)=>elements(nodes,p);
const read=p=>fs.readFileSync(new URL('../'+p,import.meta.url),'utf8');
test('actual PPC route classification excludes offer, partnership and main-site tariff programmes',()=>{
 assert.equal(campaignRoutes.length,23);
 for(const route of ['/offers/defence-and-paramilitary/','/kairali-air-india-maharaja-club.html','/weight-loss-programme/','/digestive-wellness-gut-health-yoga-therapy/'])assert.equal(isCampaign(route),false,route);
 assert.equal(isCampaign('/treatment-in-kerala.html'),true);assert.equal(isCampaign('/lp/treatment-in-kerala/'),true);
});
test('legacy campaign transformation puts exactly one original form in the hero and preserves content',()=>{
 for(const route of campaignRoutes.filter(r=>!r.startsWith('/lp/'))){
  const file='campaign-v110/pages'+route+'/staging.html';
  if(!fs.existsSync(new URL('../'+file,import.meta.url)))continue;
  // Native routes use the other presentation mode; only the seven current legacy routes.
  if(!['/Kairali_Brand_and_Competition_Neo-original.html','/treatment-in-kerala.html','/weight-loss.html','/kairali-cleansing-centre.html','/Ayurveda_Treatment_Neo_S.India_Cities.html','/wellness-resort-kerala.html'].includes(route))continue;
  const before=htmlToDOM(read(file)),beforeText=before.map(textContent).join('');
  const after=campaignPresentation(before,true);
  assert.equal(find(after,n=>n.attribs['data-slot']==='enquiry-form').length,1,route);
  const target=find(after,n=>n.attribs.id==='campaign-consultation');assert.equal(target.length,1,route);
  assert.equal(find(target,n=>n.attribs['data-slot']==='enquiry-form').length,1,route);
  assert.equal(find(after,n=>n.name==='h1').length,1,route);
  assert.ok(after.map(textContent).join('').length>=beforeText.length,route);
 }
});
test('native hero hides campaign rates while retaining the original tariff data',()=>{
 const nodes=campaignPresentation(htmlToDOM('<main><div class="tl-hero"><img class="hero-photograph" src="/property.webp"><div class="hero-copy"><h1>Treatment</h1><p class="hero-price">From ₹16,264</p><a href="#enquiry">Request a consultation</a></div><traffic-enquiry></traffic-enquiry></div><a href="/pdf/AHV-INR-Rate-List.pdf">INR rate list</a><p>Programme content retained.</p></main>'));
 assert.equal(find(nodes,n=>n.name==='traffic-enquiry').length,1);
 assert.equal(find(nodes,n=>'hidden' in n.attribs).length,2);
 assert.ok(nodes.map(textContent).join('').includes('₹16,264'));
 assert.equal(find(nodes,n=>n.name==='a'&&n.attribs.href==='#campaign-consultation').length,1);
 assert.ok(nodes.map(textContent).join('').includes('Programme content retained.'));
});
test('opt-in native intro has stable closed mobile disclosure and identical expanded desktop content',()=>{
 const intro='<p class="hero-intro">A carefully planned programme with <strong>individual attention</strong> and <a href="/contact-us/">patient care support</a>, preserving every word and the original link.</p>';
 const fixture='<main><div class="tl-hero"><div class="hero-copy"><h1>Treatment</h1>'+intro+'</div><traffic-enquiry></traffic-enquiry></div></main>';
 const original=htmlToDOM(intro)[0];
 const stable=campaignPresentation(htmlToDOM(fixture),false,true);
 const desktop=find(stable,n=>n.attribs.class==='campaign-desktop-intro');
 const mobile=find(stable,n=>n.name==='details'&&n.attribs.class==='campaign-mobile-detail');
 assert.equal(desktop.length,1);assert.equal(mobile.length,1);
 assert.equal('open' in mobile[0].attribs,false,'mobile starts closed before hydration');
 assert.equal(find(mobile,n=>n.name==='summary').length,1,'native keyboard/no-JS disclosure');
 const paragraphs=[find(desktop,n=>n.name==='p')[0],find(mobile,n=>n.name==='p')[0]];
 for(const paragraph of paragraphs){
  assert.equal(textContent(paragraph),textContent(original));
  assert.equal(paragraph.attribs.class,'hero-intro');
  assert.equal(find([paragraph],n=>n.name==='strong').length,1);
  assert.equal(find([paragraph],n=>n.name==='a')[0].attribs.href,'/contact-us/');
 }
 assert.notEqual(paragraphs[0],paragraphs[1]);
 assert.equal(find(stable,n=>n.name==='traffic-enquiry').length,1,'form is never duplicated');
 const defaults=campaignPresentation(htmlToDOM(fixture));
 const explicitDefault=campaignPresentation(htmlToDOM(fixture),false,false);
 for(const nodes of [defaults,explicitDefault]){
  assert.equal(find(nodes,n=>n.attribs.class==='campaign-responsive-intro').length,0);
  assert.equal(find(nodes,n=>n.name==='p').length,1,'other campaigns retain one unchanged intro');
  assert.equal('open' in find(nodes,n=>n.name==='details')[0].attribs,true);
 }
 const css=read('campaign-v110/components/campaign-experience.css');
 assert.match(css,/\.campaign-responsive-intro > \.campaign-desktop-intro \{ display:none; \}/);
 assert.match(css,/@media\(min-width:761px\)\s*\{\s*body\[data-ahv-campaign\][^}]*\.campaign-desktop-intro \{ display:block; \}/);
 assert.match(css,/\.campaign-responsive-intro > \.campaign-mobile-detail \{ display:none; \}/);
});
test('M050 has 29 distinct programme destinations and five readable steps instead of bitmap text',()=>{
 const source=read('campaign-v110/pages/treatment-in-kerala.html/staging.html'),nodes=htmlToDOM(source);
 const list=find(nodes,n=>'data-ahv-programs' in n.attribs)[0];
 const links=find([list],n=>n.name==='a');assert.equal(links.length,29);assert.equal(new Set(links.map(n=>n.attribs.href)).size,29);
 const process=find(nodes,n=>(n.attribs.class||'').split(' ').includes('campaign-process'))[0];
 assert.equal(process.children.filter(n=>n instanceof Element&&n.name==='li').length,5);
 assert.equal(find([process],n=>'data-campaign-icon' in n.attribs).length,5);
 assert.doesNotMatch(source,/AHV-Campaign-post\.webp|KAIRALI KAIRALI/);
});
