import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
import { STATIC_BOOT } from '../app/(english)/_families/static-design-boot.mjs';
import { describeHomeImages } from '../app/(english)/_families/home-image-descriptions.mjs';
const start=STATIC_BOOT.indexOf('  if (window.matchMedia("(min-width:"');
const end=STATIC_BOOT.indexOf('\n  if (cfg.staticHome) {',start);
assert(start>=0&&end>start,'Exercise actual serialized desktop fetch branch');
const branch=STATIC_BOOT.slice(start,end);
const snapshot=fs.readFileSync(new URL('../public/ahv/static/index.html',import.meta.url),'utf8');
async function run(html,{home=true,wide=true,ok=true}={}){
 const host={innerHTML:'original mobile snapshot',attributes:{},setAttribute(k,v){this.attributes[k]=v;}};
 let calls=0;const cfg={breakpoint:700,staticDesktopPath:'/ahv/static/index.html',...(home?{staticHome:{}}:{})};
 await vm.runInNewContext(`(async function(){${branch}})()`,{host,cfg,window:{matchMedia(){return {matches:wide};}},fetch:async(url,options)=>{calls++;assert.equal(url,cfg.staticDesktopPath);assert.equal(options.credentials,'same-origin');return {ok,status:ok?200:503,text:async()=>html};}});
 return {host,calls};
}
const descriptions={
 '/ahv/assets/img/kt-199.webp':'Two therapists providing an Ayurvedic oil massage at Kairali',
 '/ahv/assets/img/kt-181.webp':'Ayurvedic herbal poultice treatment at Kairali',
 '/ahv/images/ad83198eacd55a67cab2a6d74e8cf2b2e935634769520511515e605d6c392fae.svg':'Kairali – The Ayurvedic Healing Village',
};
test('actual fetched desktop homepage receives reviewed photo descriptions with every other snapshot byte preserved',async()=>{
 const {host,calls}=await run(snapshot);assert.equal(calls,1);assert.equal(host.attributes['data-ahv-variant'],'desktop');
 let changes=0;const expected=snapshot.replace(/<img\b[^>]*>/g,tag=>{
  const src=tag.match(/\bsrc="([^"]+)"/)?.[1];if(!descriptions[src])return tag;
  const alt=tag.match(/\balt="([^"]*)"/);assert(alt);if(alt[1]&&alt[1]!=='Photo')return tag;
  changes++;return tag.replace(alt[0],`alt="${descriptions[src]}"`);
 });
 assert.equal(changes,3, "Only three generic/missing alts change; two meaningful audited alts are retained");assert.equal(host.innerHTML,expected);
 assert.match(host.innerHTML,/alt="Kairali — The Ayurvedic Healing Village"/);
 assert.equal((host.innerHTML.match(/alt="" aria-hidden="true" src="\/ahv\/assets\/img\/lotus.svg"/g)||[]).length,2);
});
test('serialized helper has no module closure: audited logo and both missing/Photo alternatives are corrected',async()=>{
 const html=Object.keys(descriptions).map((src,i)=>`<img src="${src}"${i===0?'':` alt="${i===1?'Photo':''}"`}>`).join('');
 const {host}=await run(html);for(const text of Object.values(descriptions))assert(host.innerHTML.includes(`alt="${text}"`));
 assert.equal(host.innerHTML,describeHomeImages(html));
});
test('meaningful, decorative and unrelated images remain byte-identical',async()=>{
 const src=Object.keys(descriptions)[0];const html=`<img src="${src}" alt="Previously reviewed meaningful description"><img src="${src}" alt="" aria-hidden="true"><img src="/other.webp" alt="Photo"><p>Unchanged copy &amp; links</p>`;
 assert.equal((await run(html)).host.innerHTML,html);
});
test('non-home desktop fragments and mobile paths keep original behavior',async()=>{
 const html=`<img src="${Object.keys(descriptions)[0]}" alt="Photo">`;
 assert.equal((await run(html,{home:false})).host.innerHTML,html);
 const mobile=await run(html,{wide:false});assert.equal(mobile.calls,0);assert.equal(mobile.host.innerHTML,'original mobile snapshot');
 const failed=await run(html,{ok:false});assert.equal(failed.host.innerHTML,'original mobile snapshot');assert.equal(failed.host.attributes['data-ahv-variant'],'mobile-fallback');
});
