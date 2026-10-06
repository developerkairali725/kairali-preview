import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {offersFlow} from '../app/(english)/_families/offers-flow.mjs';
for(const variant of ['desktop','mobile','ssr'])test(`Senior programme is discoverable before rates and enquiry: ${variant}`,()=>{
 const html=variant==='ssr'?fs.readFileSync('english-candidate/prerender/offers.html','utf8'):JSON.parse(fs.readFileSync(`public/ahv/views/ahv-template-offers-deals-and-gift-vouchers-${variant}.json`)).template;
 const result=offersFlow(html,'/offers/');
 assert.equal((result.match(/class="ahv-offer-photo /g)||[]).length,2,'Both care-story sections have one photograph');
 assert.equal((result.match(/class="ahv-offer-story-grid"/g)||[]).length,1,'The heritage copy and photo share one layout');
 assert.match(result,/Care begins with a conversation\./);
 assert.match(result,/Ayurveda, when practised ethically/,'Preserve the approved care rationale');
 assert.doesNotMatch(result,/>118 Years</,'The old isolated count badge is retired');
 assert.match(result,/href="#senior-citizen-"/);assert.match(result,/id="senior-citizen-"/);
 assert.match(result,/data-senior-flow="1" href="\/offers\/senior-citizen-offer\/"/);
 const headline=result.indexOf('Holistic Ayurvedic');assert.ok(result.indexOf('data-senior-flow',headline)<result.indexOf('<dl',headline));
 assert.equal(offersFlow(result,'/offers/'),result);
 assert.equal(offersFlow(html,'/offers/','de'),html);assert.equal(offersFlow(html,'/other/'),html);
});
