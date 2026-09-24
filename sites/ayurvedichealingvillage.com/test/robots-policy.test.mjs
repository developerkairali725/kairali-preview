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
