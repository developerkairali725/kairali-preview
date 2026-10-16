import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import crypto from 'node:crypto';
import {createRequire} from 'node:module';
import {fileURLToPath} from 'node:url';
import {reverseTrainHConfig} from './fixtures/train-h-20261015.mjs';
const SITE=process.env.AHV_FACT_SITE_DIR||path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const require=createRequire(path.join(SITE,'package.json'));
const ts=require('typescript'),React=require('react'),{renderToStaticMarkup}=require('react-dom/server'),{htmlToDOM,Element}=require('html-react-parser');
const P=(...p)=>path.join(SITE,...p),dir=process.env.AHV_FACT_SOURCE_DIR;
const OFFERING=P('campaign-v2/production/sections/Offering.tsx'),FACTS=P('campaign-v2/production/package-facts.ts');
const fixture=JSON.parse(fs.readFileSync(dir?path.join(dir,'package-facts-baseline.json'):P('test/fixtures/package-facts-baseline.json')));
const overrides=dir?{[OFFERING]:fs.readFileSync(path.join(dir,'Offering.tsx'),'utf8'),[FACTS]:fs.readFileSync(path.join(dir,'package-facts.ts'),'utf8')}:{};
function graph(overrides={}) {
 const cache=new Map();
 function load(file) {
  if(cache.has(file))return cache.get(file).exports;
  const mod={exports:{}};cache.set(file,mod);
  const source=overrides[file]??fs.readFileSync(file,'utf8');
  if(file.endsWith('.json'))return mod.exports=JSON.parse(source);
  const js=ts.transpileModule(source,{fileName:file,compilerOptions:{module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2022,jsx:ts.JsxEmit.ReactJSX,esModuleInterop:true}}).outputText;
  const req=name=>{
   if(!name.startsWith('.'))return require(name);
   const base=path.resolve(path.dirname(file),name);const hit=[base,base+'.tsx',base+'.ts',base+'.json'].find(p=>overrides[p]!==undefined||(fs.existsSync(p)&&fs.statSync(p).isFile()));assert.ok(hit,name);return load(hit);
  };
  vm.runInNewContext(js,{module:mod,exports:mod.exports,require:req,URL},{filename:file});return mod.exports;
 }
 return load;
}
const now=graph(overrides),before=graph({...overrides,[OFFERING]:fixture.source});
const {PACKAGE_FACTS}=now(FACTS),Offering=now(OFFERING).default,Before=before(OFFERING).default;
const {PRODUCTION_SLUGS,productionCampaign}=now(P('campaign-v2/production/load.ts')),{uiFor}=now(P('campaign-v2/production/ui.ts'));
const configs=PRODUCTION_SLUGS.map(s=>productionCampaign(s));
const sha=p=>crypto.createHash('sha256').update(fs.readFileSync(p)).digest('hex');
const expected=['/panchkarma-treatment.html','/pain-management.html','/family-ayurvedic-retreat-kerala.html','/ayurveda-retreat-kerala.html','/kairali-cleansing-centre.html','/treatment-in-kerala.html','/Ayurveda_Treatment_Neo_S.India_Cities.html','/weight-loss.html','/lp/ayurveda-treatment-south-india/','/lp/ayurvedic-hospital-kerala/','/lp/kairali-cleansing-centre/','/lp/pain-management/','/lp/panchkarma-treatment/','/lp/treatment-in-kerala/','/lp/weight-loss/','/lp/treatment-in-kerala-russian/','/wellness-resort-kerala.html','/Kairali_Brand_and_Competition_Neo-original.html','/lp/kairali-brand/','/lp/behandlung-in-kerala/'];
const render=(Component,c)=>renderToStaticMarkup(React.createElement(Component,{c,o:c.page.offering,v:c.defaultVariant,ui:uiFor(c.locales[0])}));
function normalized(nodes) {
 return nodes.flatMap(n=>{
  if(n instanceof Element && n.attribs['data-package-facts'])return [];
  const children=n.children?normalized(n.children):undefined;
  if(n instanceof Element && n.attribs.class==='lp-poffer__intro' && !children.length)return [];
  return [{type:n.type,name:n.name,attrs:n.attribs,data:n.data,children}];
 });
}
function all(nodes,predicate){return nodes.flatMap(n=>[...(predicate(n)?[n]:[]),...(n.children?all(n.children,predicate):[])]);}
const text=n=>n.type==='text'?n.data:(n.children||[]).map(text).join('');
test('Twenty approved routes only; accepted catalogue and tariff facts are unchanged',()=>{
 assert.deepEqual(Object.keys(PACKAGE_FACTS).sort(),expected.sort());
 assert.equal(sha(P('public/ahv/assets/all-programs-data.js')),'0e2536118657369c52cb7c6c66e93458cd36d881b6ca20e778fc9c79b4d68968');
 assert.equal(sha(P('english-candidate/final-rates/strings.en.json')),'df4ded50ccdb7dbc04cff609bdd17a248d658e8d3cac480bb520338fef8e5a47');
 assert.equal(crypto.createHash('sha256').update(fixture.source).digest('hex'),fixture.sha256);
 const box={window:{}};vm.runInNewContext(fs.readFileSync(P('public/ahv/assets/all-programs-data.js'),'utf8'),box);
 for(const [route,facts] of Object.entries(PACKAGE_FACTS)) {
  const copy=facts.paragraphs.join(' ');assert.doesNotMatch(copy,/[₹$€£]|21 (?:nights|Nächte|ноч)/);assert.ok(facts.paragraphs.length);
  if(facts.locale==='en' && route!=='/treatment-in-kerala.html') {
   const named=box.window.AHV_FINDER.programmes.filter(p=>copy.includes(p.name));assert.ok(named.length,route);
   for(const p of named)assert.ok(copy.includes(p.name+', '+p.minimumNights+' nights'),route+' exact published minimum');
   assert.match(copy,/Your doctor recommends/);
  }
  if(facts.locale==='en')for(const phrase of ['three vegetarian or vegan meals a day','two Ayurvedic therapies a day, including herbal steam','daily consultation and monitoring by the attending physician','group yoga each morning and guided meditation each evening'])assert.ok(copy.includes(phrase),route+' inclusion '+phrase);
  if(facts.locale==='de') {assert.match(copy,/14 Nächte/);assert.match(copy,/7 Nächte/);assert.match(copy,/drei vegetarische oder vegane Mahlzeiten/);assert.match(copy,/zwei ayurvedische Behandlungen/);}
  if(facts.locale==='ru') {assert.match(copy,/14 ночей/);assert.match(copy,/7 ночей/);assert.match(copy,/три вегетарианских или веганских приёма пищи/);assert.match(copy,/две аюрведические процедуры/);}
 }
});
test('Rendered package facts preserve every existing offering node, card, CTA and link',()=>{
 let changed=0;
 // Train H (15 Oct 2026, AHV-WB.114/.137) later adds card photographs on two routes: compared without them (its recorded
 // config delta reversed); test/train-h-20261015.test.mjs pins the photographs.
 for(const c of configs.map(x=>reverseTrainHConfig(x.slug,JSON.parse(JSON.stringify(x))))) {
  const a=htmlToDOM(render(Before,c)),b=htmlToDOM(render(Offering,c));
  assert.deepEqual(normalized(b),normalized(a),c.route+' existing rendered content and attributes');
  const blocks=all(b,n=>n instanceof Element&&n.attribs['data-package-facts']);
  const facts=PACKAGE_FACTS[c.route];assert.equal(blocks.length,facts?1:0,c.route);
  if(facts){changed++;assert.equal(text(blocks[0]),facts.paragraphs.join(''));assert.equal(all(blocks,n=>n instanceof Element&&['a','button','form','input','select'].includes(n.name)).length,0);}
  else assert.equal(render(Offering,c),render(Before,c),c.route+' unlisted route byte-identical');
 }
 assert.equal(changed,20);
});
test('Locale mismatch and multi-locale configs receive no extra package facts',()=>{
 for(const c of configs.filter(c=>PACKAGE_FACTS[c.route]))for(const locales of [['xx'],['en','de']]) {
  // Train J3 (AHV-WB.298) later adds card photographs on /weight-loss.html; compared without them (its config delta reversed).
  const modified={...reverseTrainHConfig(c.slug,JSON.parse(JSON.stringify(c))),locales};assert.equal(render(Offering,modified),render(Before,modified),c.route);
 }
});
