import test from 'node:test';
import assert from 'node:assert/strict';
import {villaImageAttributes,responsiveVillaImages,deferHomeSnapshotImages} from '../app/(english)/_families/critical-media.mjs';
import {installLazyImgOrder} from '../app/(english)/_families/media-loading.mjs';
test('villa thumbnails select smaller files while the expanded viewer and original source stay intact',()=>{
 const src='/ahv/assets/img/AHV-OurVillas-Maharaja-1.webp';
 const html=responsiveVillaImages(`<img src="${src}" alt="Garden" width="1400" height="1000"><img id="villa-expanded" src="${src}">`);
 assert.ok(html.includes(`src="${src}"`));assert.ok(html.includes('-384.webp 384w'));assert.ok(html.includes(`1400w"`));assert.ok(html.includes(`<img id="villa-expanded" src="${src}">`));
 assert.equal(villaImageAttributes(src,'villa-expanded'),null);assert.equal(villaImageAttributes('/other/site/photo.webp'),null);
 class Element {constructor(id=''){this.tagName='IMG';this.id=id;this.isConnected=true;this.attrs=new Map();}setAttribute(k,v){this.attrs.set(k,v);}hasAttribute(k){return this.attrs.has(k);}}
 installLazyImgOrder({Element,queueMicrotask},villaImageAttributes);
 const thumb=new Element();thumb.setAttribute('src',src);assert.ok(thumb.attrs.get('srcset').includes('-384.webp'));assert.equal(thumb.attrs.get('src'),src);
 const expanded=new Element('villa-expanded');expanded.setAttribute('src',src);assert.equal(expanded.attrs.has('srcset'),false);assert.equal(expanded.attrs.get('src'),src);
});
test('home snapshots keep logo and hero priority while off-screen photos wait for scrolling',()=>{
 const html=deferHomeSnapshotImages('<img src="/ahv/assets/img/kairali-colorful-logo.webp"><img src="/ahv/assets/img/wx-hero-544.webp" fetchpriority="high"><img src="/ahv/assets/img/wx-welcome-768.webp" fetchpriority="high">');
 assert.match(html,/<img src="\/ahv\/assets\/img\/wx-hero-544.webp" fetchpriority="high">/);assert.match(html,/<img loading="lazy" fetchpriority="low" src="\/ahv\/assets\/img\/wx-welcome-768.webp">/);
});
