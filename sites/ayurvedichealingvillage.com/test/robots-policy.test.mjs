import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
import { stripTypeScriptTypes } from 'node:module';
const src = fs.readFileSync('app/(english)/_families/robots-policy.ts','utf8');
const c={process,overrides:JSON.parse(fs.readFileSync('english-candidate/route-overrides.json'))};
vm.runInNewContext(stripTypeScriptTypes(src).replace(/^import overrides.*;$/m,'').replace('export function','function'),c);
test('all staging routes remain closed to indexing',()=>{
 for(const r of JSON.parse(fs.readFileSync('english-candidate/route-manifest.json')).routes) assert.equal(c.routeRobots(r,true),'noindex, nofollow');
});
test('production separates canonical consolidation, owner rulings and utility pages',()=>{
 for(const path of ['/about-us/','/our-story/','/panchakarma/','/ayurveda-training-programs/','/yoga-retreats/']) assert.equal(c.routeRobots({path},false),'index, follow',path);
 for(const path of ['/ppc-thanks/','/emailsubscriber/','/search/','/cart/']) assert.equal(c.routeRobots({path},false),'noindex, follow',path);
 assert.equal(c.routeRobots({path:'/testing/'},false),'noindex, nofollow');
});

test('owner-approved campaign URLs are indexable only in production',()=>{
 for (const path of JSON.parse(fs.readFileSync('campaign-v110/routes.json'))) {
  assert.equal(c.routeRobots({path},false),'index, follow',path);
  assert.equal(c.routeRobots({path},true),'noindex, nofollow',path);
 }
});
test('native LP layout and the production campaign routes respect the production flag',()=>{
 // The German campaign page now renders on the production template (app/(ppc-v2-de)); its robots, like every
 // production route's, come from campaign-v2/production/metadata.ts with the same expression.
 const meta=fs.readFileSync('campaign-v2/production/metadata.ts','utf8');
 assert.match(meta,/robots: \{ index: env\.AHV_STAGING === "0", follow: true \}/);
 for (const path of ['app/(lp)/layout.tsx']) {
  const src=fs.readFileSync(path,'utf8');
  const expr=src.match(/index:([^,}]+)/)[1];
  for(const value of ['0','1',undefined,'[SENSITIVE]']) {
   assert.equal(vm.runInNewContext(expr,{process:{env:{AHV_STAGING:value}}}),value==='0',`${path}: ${value}`);
  }
 }
});
test('production build rejects an absent or redacted flag, preview stays protected',()=>{
 const src=fs.readFileSync('next.config.ts','utf8');
 const guard=src.slice(src.indexOf('if (process.env.VERCEL_ENV'),src.indexOf('const IS_STAGING'));
 for(const flag of [undefined,'1','[SENSITIVE]']) assert.throws(()=>vm.runInNewContext(guard,{process:{env:{VERCEL_ENV:'production',AHV_STAGING:flag}}}),/requires explicit AHV_STAGING=0/);
 for(const env of [{VERCEL_ENV:'production',AHV_STAGING:'0'},{VERCEL_ENV:'preview'},{}]) assert.doesNotThrow(()=>vm.runInNewContext(guard,{process:{env}}));
});
