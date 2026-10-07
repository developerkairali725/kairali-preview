// Verify the actual local built site, not only the isolated SDK fixture.
import {chromium} from '@playwright/test';
import assert from 'node:assert/strict';
import {writeFileSync} from 'node:fs';
const browser=await chromium.launch({channel:'chrome',headless:true});
const results=[];
try {
for(const [path,width] of [['/',390],['/contact-us/',1440],['/de/',390],['/ar/',390],['/ayurvedic-treatment-packages.html',390],['/new-privacy-policy/',1440]]) {
 const context=await browser.newContext({viewport:{width,height:900}});
 const page=await context.newPage(),remote=[],errors=[];
 await context.route('**/*',route=>{if(new URL(route.request().url()).hostname==='127.0.0.1')return route.continue();remote.push(new URL(route.request().url()).hostname);return route.abort();});
 page.on('pageerror',e=>errors.push(e.message));
 const response=await page.goto('http://127.0.0.1:3139'+path);assert.equal(response.status(),200,path);
 await page.locator('.cm').waitFor({state:'visible'});await page.waitForTimeout(600);
 assert.equal(await page.locator('#cc-main').count(),1);
 assert.equal(await page.locator('#ahv-consent,[data-ahv-cta-notice]').count(),0);
 const box=await page.locator('.cm').boundingBox();assert.ok(box.x>=0&&box.x+box.width<=width+1);
 assert.equal(remote.some(h=>/googletagmanager|google-analytics|clarity\.ms|facebook\.net/.test(h)),false);
 const privacy=await page.locator('.cm__footer a').getAttribute('href');
 assert.equal((await context.request.get('http://127.0.0.1:3139'+privacy)).status(),200);
 if(path==='/')await page.screenshot({path:process.env.CONSENT_QA_SCREENSHOTS+'/built-home-mobile.png'});
 await page.locator('.cm button[data-role="necessary"]').click();
 await page.locator('[data-ahv-cookie-choices]').first().click();await page.locator('.pm').waitFor({state:'visible'});
 assert.deepEqual(errors,[]);results.push({path,width,status:response.status(),privacy,reopened:true,errors});await context.close();
}
console.log(JSON.stringify(results,null,2));
writeFileSync(process.env.CONSENT_BUILT_QA_REPORT,JSON.stringify(results,null,2));
}finally{await browser.close();}
