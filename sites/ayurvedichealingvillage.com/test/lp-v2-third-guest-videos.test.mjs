import {test} from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {createHash} from 'node:crypto';
import {productionCampaign,PRODUCTION_SLUGS} from '../campaign-v2/production/load.ts';
import {FILMS} from '../campaign-v2/data/films.ts';
import {APPROVED_FILM_IDS,GUEST_VIDEO_ROUTES,filmIdFromHref,routeAllowed,reduce,CLOSED,playerSrc} from '../campaign-v2/production/sections/guest-video-policy.mjs';
import fixture from './fixtures/third-guest-videos-20261014.json' with {type:'json'};
import ownerDecisions from './fixtures/owner-decisions-20261014-approved-delta.json' with {type:'json'};
// Owner decisions, 14 Oct 2026 (AHV-WB.042.change, AHV-WB.299.change), reversed exactly before the earlier pins:
// the weight routes' one-card Rupak Mann Stories band and the Panchakarma 14–28 night range.
const WEIGHT_STORY={heading:'Hear from people who have stayed at Kairali',body:'Watch a patient describe her stay in her own words. Individual experiences vary.',films:[{title:'Watch Rupak Mann’s experience',href:'https://www.youtube.com/watch?v=D3QLxKpwtJs',thumb:{src:'/ahv/assets/img/video-thumb-D3QLxKpwtJs.webp',width:480,height:360}}]};
const PANCHAKARMA_RANGE={'panchakarma':3,'lp-panchakarma':2};
const reverseOwnerDecisions=(slug,c)=>{
 if(slug==='weight-management'||slug==='lp-weight-management'){assert.deepEqual(c.page.stories,WEIGHT_STORY,slug);delete c.page.stories;}
 if(PANCHAKARMA_RANGE[slug]){let j=JSON.stringify(c);assert.equal(j.split('14–28 night').length-1,PANCHAKARMA_RANGE[slug],slug);assert.equal(j.split('14–21 night').length-1,0,slug);c=JSON.parse(j.replaceAll('14–28 night','14–21 night'));}
 return c;
};
const targets={
 'wellness-kerala':{source:'ayurveda-retreat',index:1,id:'4x01PtWfNnk'},
 'cleansing-centre':{source:'lp-cleansing-centre',index:2,id:'4x01PtWfNnk'},
 'lp-pain-management':{source:'pain-management',index:2,id:'DcTMckQD3rc'},
};
const sha=x=>createHash('sha256').update(x).digest('hex');
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
 for(const slug of PRODUCTION_SLUGS){const c=reverseOwnerDecisions(slug,JSON.parse(JSON.stringify(productionCampaign(slug))));if(targets[slug])c.page.stories.films.pop();assert.equal(sha(JSON.stringify(c)),fixture.configSHA256[slug],slug);}
 assert.deepEqual(GUEST_VIDEO_ROUTES.slice(13),['/weight-loss.html','/lp/weight-loss/']);assert.deepEqual(APPROVED_FILM_IDS.slice(5),['D3QLxKpwtJs']);
 assert.equal(GUEST_VIDEO_ROUTES.length-2,13);assert.equal(APPROVED_FILM_IDS.length-1,5);
});
test('exact source additions reverse to the prior byte hashes; no testimonial text or rendering/consent policy changes',()=>{
 for(const [p,e]of Object.entries(fixture.files)){let s=fs.readFileSync(new URL('../'+p,import.meta.url),'utf8');assert.equal(sha(s),e.afterSHA256);assert.equal(s.split(e.addition).length-1,1);s=s.replace(e.addition,'');assert.equal(sha(s),e.beforeSHA256);}
 for(const [p,hash]of Object.entries(fixture.unchangedSHA256)){
  let s=fs.readFileSync(new URL('../'+p,import.meta.url),'utf8');const owner=ownerDecisions.files[p];
  if(owner){assert.equal(sha(s),owner.afterSHA256,p);for(const {before,after}of owner.edits){assert.equal(s.split(after).length-1,1,p);s=s.replace(after,before);}assert.equal(sha(s),owner.beforeSHA256,p);}
  assert.equal(sha(s),hash,p);
 }
});
