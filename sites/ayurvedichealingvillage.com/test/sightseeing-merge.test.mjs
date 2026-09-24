import {test} from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
const read=p=>readFileSync(new URL('../'+p,import.meta.url),'utf8');
const data=JSON.parse(read('app/(english)/sightseeing/destinations.json'));
const map=JSON.parse(read('english-candidate/redirect-map.json'));
const tree=JSON.parse(read('english-candidate/site-tree.json'));
const index=JSON.parse(read('public/ahv/search-index.json'));
const old=['/attractions-under-10kms/','/attractions-15kms-and-below/','/attractions-25kms-to-50kms/','/attractions-above-50kms/'];
test('all 22 destinations survive once with usable road estimates and distinct anchors',()=>{
 assert.equal(data.length,22);assert.equal(new Set(data.map(d=>d.id)).size,22);
 for(const d of data){assert.ok(d.km>0&&d.km<=150,d.name);assert.equal(d.coordinates.length,2);assert.ok(d.endpoint);assert.ok(d.description.length>60);}
 for(const id of ['thiruvalathoor','thenari','jainimedu','palakkad-fort','kalpathy','rock-garden','chittur-gurumadam','fantasy-park','malampuzha','thiruvegappura','meenvallam','meenkara','kanjirapuzha','pothundy','mangalam','nelliyampathy','kalamandalam','thrithala','attappadi','silent-valley','guruvayur','parambikulam'])assert.ok(data.some(d=>d.id===id),id);
});
test('old guides are single-hop 301s and disappear from navigation, sitemap and search',()=>{
 for(const p of old){assert.equal(map.redirects[p].to,'/sightseeing/');assert.equal(map.statusCode,301);assert.ok(!tree.index[p]);assert.ok(!index.pages.some(x=>x.route===p));assert.ok(!read('english-candidate/prerender/sitemap.html').includes(p));}
 assert.ok(tree.index['/wildlife-drive/']);assert.ok(tree.index['/house-boat-tour/']);
 const result=index.pages.find(x=>x.route==='/sightseeing/');assert.ok(result);
 for(const d of data)assert.ok(result.kw.includes(d.name),d.name);
});
test('native output, directions and meaningful structure are retained',()=>{
 const page=read('app/(english)/sightseeing/page.tsx');assert.match(page,/10\.7280291,76\.7117249/);assert.match(page,/travelmode=driving/);assert.match(page,/target="_blank" rel="noopener noreferrer"/);assert.match(page,/application\/ld\+json/);assert.match(read('app/(english)/[...slug]/page.tsx'),/nativePages = new Set\([^;]*"\/sightseeing\/"/);
});
