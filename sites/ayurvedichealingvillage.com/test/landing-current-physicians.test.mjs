import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync,existsSync} from 'node:fs';

const routes=['ayurvedic-treatment-packages.html','panchkarma-treatment.html','pain-management.html','family-ayurvedic-retreat-kerala.html','preventive-rejuvenation-detoxification.html','ayurveda-retreat-kerala.html','weight-loss-programme','digestive-wellness-gut-health-yoga-therapy','karkidaka-chikitsha-or-monsoon-wellness.html'];
// Consent-backed staff facts published 28 September 2026. Earlier legacy landing
// imports silently reintroduced departed staff and disputed experience totals.
const names=['Dr. Deepu John','Dr. Rahul R','Dr. Akhila Oommen','Dr. Adhina U.B.','Dr. Aashitha P.S.'];
for(const route of routes) test(`${route}: current consented physician roster survives legacy imports`,()=>{
 const raw=readFileSync(new URL(`../app/(campaign)/${route}/content.ts`,import.meta.url),'utf8');
 const html=JSON.parse(raw.match(/export const \w+ = (".*");/s)[1]);
 const profiles=html.match(/<section[^>]*class="[^"]*doctors-section[\s\S]*?<\/section>/)?.[0];
 assert.ok(profiles,'physician section exists');
 for(const name of names)assert.ok(profiles.includes(name),name);
 assert.doesNotMatch(html,/Ashikh?a Raj|Dr\. Anagha|team-ashikh?a-raj/i);
 assert.doesNotMatch(profiles,/\d+\+\s*(?:years|Years)/);
 for(const [,src] of profiles.matchAll(/src="([^\"]+)"/g))assert.ok(existsSync(new URL('../public'+src,import.meta.url)),src);
});
