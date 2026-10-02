import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {createRequire} from 'node:module';
const require=createRequire(import.meta.url),nextRequire=createRequire(require.resolve('next'));
test('inline first-paint styles equal Next minification of the complete existing site rules',async()=>{
 const postcss=nextRequire('postcss'),cssnano=nextRequire('next/dist/compiled/cssnano-simple');
 const source=fs.readFileSync('public/design/site-bundle.css','utf8');
 const result=await postcss([cssnano({})]).process(source,{from:undefined});
 const inline=fs.readFileSync('public/design/site-bundle.inline.css','utf8');
 assert.equal(inline,result.css);
 assert.equal(result.warnings().length,0);
 assert.doesNotMatch(inline,/<\/style/i);
 const layout=fs.readFileSync('app/(english)/_families/site-document.tsx','utf8');
 assert.doesNotMatch(layout,/data-ahv-site-styles/);
 for(const name of ['sightseeing','video-gallery','read-feedback','givefeedback','search']) assert.match(fs.readFileSync('app/(english)/'+name+'/view.tsx','utf8'),/data-ahv-route-styles/);
 assert.doesNotMatch(layout,/import ["'][^"']*site-bundle\.css["']/);
});

test('every canonical route has a reproducible scoped stylesheet',()=>{
 const manifest=JSON.parse(fs.readFileSync('public/design/site-route-styles.json','utf8'));
 assert.equal(Object.keys(manifest.routes).length,254);
 for(const file of new Set([manifest.base,...Object.values(manifest.routes)])){
  assert.match(file,/^site-route-[a-f0-9]{16}\.css$/);
  const css=fs.readFileSync('public/design/'+file,'utf8');
  assert.ok(css.length>1000);assert.doesNotMatch(css,/<\/style/i);
 }
});
