// Verify the actual local built site, not only the isolated SDK fixture.
import {chromium} from '@playwright/test';
import assert from 'node:assert/strict';
import {writeFileSync} from 'node:fs';
const browser=await chromium.launch({channel:'chrome',headless:true});
const results=[];
try {
for(const mode of ['full','compact']) {
for(const [path,width] of [['/',390],['/contact-us/',1440],['/de/',390],['/ar/',390],['/ayurvedic-treatment-packages.html',390],['/new-privacy-policy/',1440]]) {
 const context=await browser.newContext({viewport:{width,height:900}});
 const page=await context.newPage(),remote=[],errors=[];
 await context.route('**/*',route=>{const url=new URL(route.request().url());if(url.hostname==='127.0.0.1'){if(mode==='compact'&&url.pathname==='/api/consent-region/')return route.fulfill({json:{version:1,prompt:'passive'}});return route.continue();}remote.push(url.hostname);return route.abort();});
 page.on('pageerror',e=>errors.push(e.message));
 const response=await page.goto('http://127.0.0.1:3139'+path);assert.equal(response.status(),200,path);
 const notice=page.locator(mode==='compact'?'.ahv-consent-compact':'.cm');
 await notice.waitFor({state:'visible'});await page.waitForTimeout(600);
 assert.equal(await page.locator('#cc-main').count(),1);
 assert.equal(await page.locator('#ahv-consent,[data-ahv-cta-notice]').count(),0);
 const box=await notice.boundingBox();assert.ok(box.x>=0&&box.x+box.width<=width+1&&box.y>=0);
 assert.equal(await notice.locator('button').count(),3);
 assert.equal(remote.some(h=>/googletagmanager|google-analytics|clarity\.ms|facebook\.net/.test(h)),false);
 const privacy=await notice.locator('a').getAttribute('href');
 assert.equal((await context.request.get('http://127.0.0.1:3139'+privacy)).status(),200);
 if(['/', '/contact-us/', '/ar/','/ayurvedic-treatment-packages.html'].includes(path))await page.screenshot({path:process.env.CONSENT_QA_SCREENSHOTS+'/built-'+mode+'-'+(path.split('/')[1]||'home')+'.png'});
 if(mode==='compact') {
  const styles=await notice.locator('button').evaluateAll(buttons=>buttons.map(button=>({width:button.getBoundingClientRect().width,height:button.getBoundingClientRect().height,color:getComputedStyle(button).color,background:getComputedStyle(button).backgroundColor})));
  assert.ok(styles.every(button=>button.height>=44&&Math.abs(button.width-styles[0].width)<1&&button.color===styles[0].color&&button.background===styles[0].background));
  await notice.locator('button').nth(1).click();assert.equal(await notice.count(),0);
 } else await page.locator('.cm button[data-role="necessary"]').click();
 await page.locator('[data-ahv-cookie-choices]').first().click();await page.locator('.pm').waitFor({state:'visible'});
 assert.deepEqual(errors,[]);results.push({mode,path,width,status:response.status(),privacy,reopened:true,errors});await context.close();
}
}
console.log(JSON.stringify(results,null,2));
writeFileSync(process.env.CONSENT_BUILT_QA_REPORT,JSON.stringify(results,null,2));
}finally{await browser.close();}
