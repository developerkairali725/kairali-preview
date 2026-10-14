import {test} from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {createHash} from 'node:crypto';
import {productionCampaign,PRODUCTION_SLUGS} from '../campaign-v2/production/load.ts';
import {FILMS} from '../campaign-v2/data/films.ts';
import {APPROVED_FILM_IDS,GUEST_VIDEO_ROUTES,filmIdFromHref,routeAllowed,reduce,CLOSED,playerSrc} from '../campaign-v2/production/sections/guest-video-policy.mjs';
import fixture from './fixtures/third-guest-videos-20261014.json' with {type:'json'};
const targets={
 'wellness-kerala':{source:'ayurveda-retreat',index:1,id:'4x01PtWfNnk'},
 'cleansing-centre':{source:'lp-cleansing-centre',index:2,id:'4x01PtWfNnk'},
 'lp-pain-management':{source:'pain-management',index:2,id:'DcTMckQD3rc'},
};
const sha=x=>createHash('sha256').update(x).digest('hex');
// AHV train D03: reverse only the exact fixture copy edits in a loaded config before the hash pins (a pathway step is
// mirrored into admission.steps, so one source edit can appear twice; the config hash pin below is the exactness check).
const d03Fixture=JSON.parse(fs.readFileSync(new URL('./fixtures/d03-copy-corrections-20261014.json',import.meta.url),'utf8'));
function reverseD03(slug,c){
 const entry=d03Fixture.files['campaign-v2/production/pages/'+slug+'.ts'];if(!entry)return c;
 for(const {before,after} of [...entry.replacements].reverse()){
  let hits=0;const walk=o=>{for(const k of Object.keys(o)){const v=o[k];if(typeof v==='string'&&v.includes(after)){hits+=v.split(after).length-1;o[k]=v.replace(after,before);}else if(v&&typeof v==='object')walk(v);}};
  walk(c);assert.ok(hits>=1&&hits<=2,slug+': exact D03 copy correction');
 }
 return c;
}
function reverseD03Source(p,s){
 const entry=d03Fixture.files[p];if(!entry)return s;
 assert.equal(sha(s),entry.afterSHA256,p);
 for(const {before,after} of [...entry.replacements].reverse()){assert.equal(s.split(after).length-1,1,p+': exact D03 copy correction');s=s.replace(after,before);}
 assert.equal(sha(s),entry.beforeSHA256,p);return s;
}
for(const [slug,{source,index,id}] of Object.entries(targets))test(`${slug}: third card is the exact approved existing counterpart, including title and thumbnail`,()=>{
 const c=productionCampaign(slug),films=c.page.stories.films;assert.equal(films.length,3);
 assert.deepEqual(films[2],productionCampaign(source).page.stories.films[index]);assert.equal(new Set(films.map(f=>f.href)).size,3);
 assert.equal(filmIdFromHref(films[2].href),id);assert(APPROVED_FILM_IDS.includes(id));assert(routeAllowed(c.route,'en'));
 const asset=fs.readFileSync(new URL('../public'+films[2].thumb.src,import.meta.url));assert.equal(sha(asset),fixture.assetSHA256[films[2].thumb.src]);
 if(id==='4x01PtWfNnk')assert.equal(FILMS[id].consent,true);
 assert.match(c.page.stories.body,/Individual experiences vary\./);
 const denied=reduce(CLOSED,{type:'open',id,title:films[2].title,granted:false,routeOk:true});assert.equal(denied.kind,'consent');assert.equal(playerSrc(denied),null);
 const granted=reduce(CLOSED,{type:'open',id,title:films[2].title,granted:true,routeOk:true});assert.equal(granted.kind,'playing');assert.equal(playerSrc(granted),`https://www.youtube-nocookie.com/embed/${id}?autoplay=1&playsinline=1&rel=0`);
 assert.equal(playerSrc(reduce(granted,{type:'consent',granted:false})),null);
});
test('all21 other configs unchanged; remove only appended third card to restore each target and its original two cards',()=>{
 assert.equal(PRODUCTION_SLUGS.length,24);assert.equal(Object.keys(targets).length,3);
 for(const slug of PRODUCTION_SLUGS){const c=reverseD03(slug,JSON.parse(JSON.stringify(productionCampaign(slug))));if(targets[slug])c.page.stories.films.pop();assert.equal(sha(JSON.stringify(c)),fixture.configSHA256[slug],slug);}
 assert.equal(GUEST_VIDEO_ROUTES.length,13);assert.equal(APPROVED_FILM_IDS.length,5);
});
test('exact source additions reverse to the prior byte hashes; no testimonial text or rendering/consent policy changes',()=>{
 for(const [p,e]of Object.entries(fixture.files)){let s=reverseD03Source(p,fs.readFileSync(new URL('../'+p,import.meta.url),'utf8'));assert.equal(sha(s),e.afterSHA256);assert.equal(s.split(e.addition).length-1,1);s=s.replace(e.addition,'');assert.equal(sha(s),e.beforeSHA256);}
 for(const [p,hash]of Object.entries(fixture.unchangedSHA256))assert.equal(sha(fs.readFileSync(new URL('../'+p,import.meta.url))),hash,p);
});
