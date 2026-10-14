import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import zlib from 'node:zlib';
import vm from 'node:vm';
import copy from '../english-candidate/room209-area-copy.json' with {type:'json'};
import {withRoom209Area} from '../app/(english)/_families/room209-area.mjs';
import {reviewCopyFor, applyReviewSnapshot} from '../app/(english)/_families/content-review.mjs';
import {applyStaffExperienceDom} from '../app/(english)/_families/staff-experience.mjs';

const esc = s => s.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
const read = p => fs.readFileSync(new URL('../'+p,import.meta.url),'utf8');
const sourceRoot = process.env.AHV_ROOM209_SOURCE_ROOT || process.cwd();
const bootSource = read('app/(english)/_families/boot.ts');
const start = bootSource.indexOf('  var reviewByKey = new Map();');
const end = bootSource.indexOf('\n\n  // Media loading', start);
assert(start > 0 && end > start);
// boot.ts interpolates the imported staff-experience DOM helper into this runtime template.
const actualRuntime = Function('applyStaffExperienceDom','return `'+bootSource.slice(start,end)+'`;')(applyStaffExperienceDom);

test('exact thirteen locales; total includes outdoor43 and indoor228, no invented footprint/occupancy',()=>{
 assert.deepEqual(Object.keys(copy).sort(),['en','ar','de','es','fr','hi','it','ja','ko','nl','pt','ru','zh-Hans'].sort());
 assert.equal(169+59,228);assert.equal(169+59+43,271);
 for(const f of Object.values(copy)) {
  assert.match(f.rangeNew,/271/);assert.match(f.rangeNew,/375/);
  assert.doesNotMatch(f.rangeNew,/260|371/);
  assert(f.paragraphNew.startsWith(f.paragraphReviewed.replace('260','271')+' '));
  for(const n of ['209','271','169','59','43','228'])assert(f.paragraphNew.includes(n));
 }
});

test('each language explicitly labels the range as including outdoor sit-outs and228 as indoor area',()=>{
 const terms={
  en:['including sit-outs','indoor area is 228'],
  ar:['شاملة الجلسات الخارجية','المساحة الداخلية 228'],
  de:['einschließlich Außensitzbereichen','Innenfläche beträgt 228'],
  es:['incluidas las zonas de estar exteriores','superficie interior es de 228'],
  fr:['espaces extérieurs pour s’asseoir inclus','surface intérieure est de 228'],
  hi:['बाहर बैठने की जगह सहित','अंदर का क्षेत्र 228'],
  it:['spazi esterni per sedersi inclusi','superficie interna è di 228'],
  ja:['屋外のくつろぎスペースを含む','屋内面積は228'],
  ko:['야외 휴식 공간 포함','실내 면적은 228'],
  nl:['inclusief buitenzitjes','binnenruimte meet 228'],
  pt:['incluindo as áreas de estar exteriores','área interior é de 228'],
  ru:['включая открытые зоны отдыха','внутренняя площадь — 228'],
  'zh-Hans':['含户外休息区','室内面积为228'],
 };
 for(const [locale,[outdoor,indoor]] of Object.entries(terms)){
  assert(copy[locale].rangeNew.includes(outdoor),locale);
  assert(copy[locale].paragraphNew.includes(indoor),locale);
 }
});

// Each route is a separate thirteen-locale batch, not a single26-case batch.
for(const route of ['/deluxe-villa/','/our-villas/']) for(const [locale,f] of Object.entries(copy)) test(`${route} ${locale}: actual saved page, SSR/runtime text parity and unchanged surrounding markup`,()=>{
 const slug=route.slice(1,-1);
 const input=locale==='en' ? read(`english-candidate/prerender/${slug}.html`) : zlib.gunzipSync(fs.readFileSync(path.join(sourceRoot,`l10n/prerender/${locale}/${slug}.html.gz`))).toString();
 assert(input.includes(esc(f.rangeOld)),`${locale}: original range must exist in saved page`);
 const output=applyReviewSnapshot(input,route,locale);
 assert(output.includes(esc(f.rangeNew)));assert(!output.includes(esc(f.rangeOld)));
 if(route==='/deluxe-villa/')assert(output.includes(esc(f.paragraphNew)));
 const edits=reviewCopyFor(route,locale);
 assert.equal(edits.filter(e=>e.kind==='text'&&e.old===f.rangeOld).length,1);
 const values=route==='/deluxe-villa/'?[f.rangeOld,f.paragraphOld,f.paragraphReviewed]:[f.rangeOld];
 const nodes=values.map(value=>({nodeType:3,nodeValue:' '+value+' ',parentElement:{closest:()=>null}}));
 let observer;
 const context={cfg:{path:route,contentReviewCopy:edits},host:{nodeType:1,matches:()=>false,querySelectorAll:()=>[]},NodeFilter:{SHOW_TEXT:4},document:{createTreeWalker(){let i=0;return {nextNode:()=>nodes[i++]||null}}},MutationObserver:class {constructor(fn){observer=fn}observe(){}}};
 vm.runInNewContext(actualRuntime,context);
 nodes.forEach((n,i)=>assert.equal(n.nodeValue,' '+(i===0?f.rangeNew:f.paragraphNew)+' '));
 const after=nodes.map(n=>n.nodeValue);observer(nodes.map(target=>({type:'characterData',target})));assert.deepEqual(nodes.map(n=>n.nodeValue),after);
 // An unrelated room/price/form value is not a matching text node.
 const untouched='<form><p>'+esc(f.rangeOld)+'</p></form><p>Room203</p><p>Room212</p><p>Room301</p>';
 assert.equal(applyReviewSnapshot(untouched,route,locale),untouched);
});

test('composer preserves other editorial changes and is immutable/idempotent; unrelated routes/locales untouched',()=>{
 const f=copy.en;const other={kind:'text',old:'Other',new:'Reviewed other'};
 const input=[{kind:'text',old:f.paragraphOld,new:f.paragraphReviewed},other];const before=JSON.stringify(input);
 const after=withRoom209Area(input,'/deluxe-villa/','en');assert.equal(JSON.stringify(input),before);assert.equal(after[1],other);
 assert.deepEqual(withRoom209Area(after,'/deluxe-villa/','en'),after);
 for(const route of ['/','/classic-villa/','/royal-villa/','/maharaja-suite/','/villa-raag/','/lp/pain-management/'])assert.equal(withRoom209Area(input,route,'en'),input);
 assert.equal(withRoom209Area(input,'/deluxe-villa/','xx'),input);
});

test('shared on-page dialog has the same approved English total-area chip and unchanged occupancy',()=>{
 const source=read('public/design/villa-dialog.js');const ctx={module:{exports:{}}};vm.runInNewContext(source,ctx);
 const villas=ctx.module.exports.VILLAS;
 assert.equal(villas['/deluxe-villa/'].facts[0],copy.en.rangeNew);
 assert.equal(villas['/deluxe-villa/'].facts[2],'Upto 3 Adults');
});
