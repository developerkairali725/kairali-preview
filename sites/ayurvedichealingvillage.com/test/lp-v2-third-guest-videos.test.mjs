import {test} from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {createHash} from 'node:crypto';
import {productionCampaign,PRODUCTION_SLUGS} from '../campaign-v2/production/load.ts';
import {FILMS} from '../campaign-v2/data/films.ts';
import {APPROVED_FILM_IDS,GUEST_VIDEO_ROUTES,filmIdFromHref,routeAllowed,reduce,CLOSED,playerSrc} from '../campaign-v2/production/sections/guest-video-policy.mjs';
import fixture from './fixtures/third-guest-videos-20261014.json' with {type:'json'};
const sha=x=>createHash('sha256').update(x).digest('hex');
import {BATCH6} from './fixtures/train-a-batch6-20261014.mjs';
import {reverseTrainAConfig,reverseTrainASource} from './fixtures/train-a-20261014.mjs';
import {reverseTrainBConfig,reverseTrainBSource} from './fixtures/train-b-20261015.mjs';
// Train F (15 Oct 2026) sits on top of Train B: its exact photograph picks are reversed first (fixtures/train-f-20261015.mjs).
import {reverseTrainFConfig,reverseTrainFSource} from './fixtures/train-f-20261015.mjs';
// Train G rework (15 Oct 2026) sits on top of Train F: its exact RU phone placeholder is reversed first (fixtures/train-g-rework-20261015.mjs).
import {reverseTrainGConfig} from './fixtures/train-g-rework-20261015.mjs';
import {reverseStaffRosterConfig} from './fixtures/pr429-integration-config.mjs';
const targets={
 'wellness-kerala':{source:'ayurveda-retreat',index:1,id:'4x01PtWfNnk'},
 'cleansing-centre':{source:'lp-cleansing-centre',index:2,id:'4x01PtWfNnk'},
 'lp-pain-management':{source:'pain-management',index:2,id:'DcTMckQD3rc'},
};
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
 // PR428's staff roster/experience facts (PR429 base bf3f7ce70) were not in these pins' base; reverse them exactly as lp-v2-locale-physicians does.
 for(const slug of PRODUCTION_SLUGS){const c=reverseStaffRosterConfig(slug,reverseTrainAConfig(slug,reverseTrainBConfig(slug,reverseTrainFConfig(slug,reverseTrainGConfig(slug,JSON.parse(JSON.stringify(productionCampaign(slug))))))));if(targets[slug])c.page.stories.films.pop();assert.equal(sha(JSON.stringify(c)),fixture.configSHA256[slug],slug);}
 // Train A: batch 6 appended exactly four D routes after the original 13 (batch 8's AHV-WB.015/039 routes were rejected and
 // excluded), then the owner decision of 14 Oct 2026 (AHV-WB.299.change) the two weight routes and the Rupak Mann film.
 assert.equal(GUEST_VIDEO_ROUTES.length,13+BATCH6.guestVideoRoutesAdded.length+2);assert.deepEqual(GUEST_VIDEO_ROUTES.slice(13,17),BATCH6.guestVideoRoutesAdded);
 assert.deepEqual(GUEST_VIDEO_ROUTES.slice(17),['/weight-loss.html','/lp/weight-loss/']);assert.deepEqual(APPROVED_FILM_IDS.slice(5),['D3QLxKpwtJs']);assert.equal(APPROVED_FILM_IDS.length-1,5);
});
test('exact source additions reverse to the prior byte hashes; no testimonial text or rendering/consent policy changes',()=>{
 // Train A and Train B (fixtures/train-b-20261015.mjs, newest first): every merged candidate's exact source delta is reversed first (fixtures/train-a-20261014.mjs); rendering and consent code are unchanged.
 for(const [p,e]of Object.entries(fixture.files)){let s=reverseTrainASource(p,reverseTrainBSource(p,reverseTrainFSource(p,fs.readFileSync(new URL('../'+p,import.meta.url),'utf8'))));assert.equal(sha(s),e.afterSHA256);assert.equal(s.split(e.addition).length-1,1);s=s.replace(e.addition,'');assert.equal(sha(s),e.beforeSHA256);}
 for(const [p,hash]of Object.entries(fixture.unchangedSHA256))assert.equal(sha(reverseTrainASource(p,reverseTrainBSource(p,reverseTrainFSource(p,fs.readFileSync(new URL('../'+p,import.meta.url),'utf8'))))),hash,p);
});
