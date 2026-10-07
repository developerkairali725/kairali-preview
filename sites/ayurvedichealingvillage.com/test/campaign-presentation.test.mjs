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
test('M050 has 29 distinct programme destinations and five readable steps instead of bitmap text',()=>{
 const source=read('campaign-v110/pages/treatment-in-kerala.html/staging.html'),nodes=htmlToDOM(source);
 const list=find(nodes,n=>'data-ahv-programs' in n.attribs)[0];
 const links=find([list],n=>n.name==='a');assert.equal(links.length,29);assert.equal(new Set(links.map(n=>n.attribs.href)).size,29);
 const process=find(nodes,n=>(n.attribs.class||'').split(' ').includes('campaign-process'))[0];
 assert.equal(process.children.filter(n=>n instanceof Element&&n.name==='li').length,5);
 assert.equal(find([process],n=>'data-campaign-icon' in n.attribs).length,5);
 assert.doesNotMatch(source,/AHV-Campaign-post\.webp|KAIRALI KAIRALI/);
});
