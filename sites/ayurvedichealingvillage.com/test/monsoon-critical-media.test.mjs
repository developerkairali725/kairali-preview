import test from 'node:test';
import assert from 'node:assert/strict';
import {phoneCriticalMedia,firstCriticalImage} from '../app/(english)/_families/critical-media.mjs';
const route='/karkidaka-chikitsha-or-monsoon-wellness.html';
const original='/ahv/assets/img/legacy/karkidaka-chikitsha-or-monsoon-wellness/kar5-19.webp';
const variant=original.replace('.webp','-768.avif');
test('Monsoon phone hero retains content and geometry with a prioritized smaller source',()=>{
 const input=`<img alt="Existing localized caption" src="${original}" style="width:100%;height:auto" loading="lazy" fetchpriority="low">`;
 const output=phoneCriticalMedia(input,route);
 assert.ok(output.includes(`src="${variant}"`));
 assert.ok(output.includes('alt="Existing localized caption"'));assert.ok(output.includes('style="width:100%;height:auto"'));
 assert.ok(output.includes('loading="eager"'));assert.ok(output.includes('fetchpriority="high"'));
 assert.equal(firstCriticalImage(output,route),variant);assert.equal(phoneCriticalMedia(output,route),output);
 assert.equal(phoneCriticalMedia(input,'/other/'),input);assert.equal(firstCriticalImage(output,'/other/'),null);
 assert.equal(phoneCriticalMedia(original,route),variant);
});

import fs from 'node:fs';
import {monsoonRuntimeMedia} from '../app/(english)/_families/critical-media.mjs';
import {orderedRuntimeScripts} from '../app/(english)/_families/runtime-script-order.mjs';
test('All translated Monsoon readers retain their exact article dependency pair',()=>{
 for(const locale of ['hi','de','fr','es','it','pt','nl','ru','ar','zh','ja','ko']) {
  const data=JSON.parse(fs.readFileSync(new URL(`../public/ahv/l10n/${locale}/assets/article-family-data.js`,import.meta.url),'utf8').replace(/^window.AHV_ARTICLE = /,'').replace(/;\s*$/,''));
  const page=data.routes.find(x=>x.path===route);assert.ok(page);assert.equal(page.heroImg.src,original);
  for(const device of ['mobile','desktop']) {
   const view=JSON.parse(fs.readFileSync(new URL(`../public/ahv/l10n/${locale}/views/ahv-page-article-reader-${device}.json`,import.meta.url)));
   const cfg={path:route,previewSrc:'/preview.js',supportSrc:'/support.js'};
   assert.deepEqual(orderedRuntimeScripts(view,cfg,true).map(x=>x.src),['/preview.js',`/ahv/l10n/${locale}/assets/article-family-data.js`,`/ahv/l10n/${locale}/assets/article-family-render.js`,'/support.js']);
   assert.equal(orderedRuntimeScripts(view,{...cfg,path:'/other/'},true).length,view.scripts.length+2);
  }
 }
});
test('Runtime mapping changes only selected phone hero source and is idempotent',()=>{
 const hero={src:original,alt:'Localized caption',width:1400,height:2000};const page={path:route,heroImg:hero};
 const win={matchMedia:()=>({matches:false}),AHV_ARTICLE:{routes:[page]}};
 monsoonRuntimeMedia(win,route);assert.equal(page.heroImg,hero);
 win.matchMedia=()=>({matches:true});monsoonRuntimeMedia(win,'/other/');assert.equal(page.heroImg,hero);
 monsoonRuntimeMedia(win,route);assert.deepEqual(page.heroImg,{...hero,src:variant});const mapped=page.heroImg;monsoonRuntimeMedia(win,route);assert.equal(page.heroImg,mapped);assert.equal(hero.src,original);
});
