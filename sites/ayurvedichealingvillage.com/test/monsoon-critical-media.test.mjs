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
