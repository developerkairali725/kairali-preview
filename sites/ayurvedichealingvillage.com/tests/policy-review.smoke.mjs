import { chromium } from '@playwright/test';
import assert from 'node:assert/strict';
const base=process.env.POLICY_BASE||'http://127.0.0.1:4470';
const browser=await chromium.launch();
let checks=0;
try {
for(const width of [390,1440]) {
 const context=await browser.newContext({viewport:{width,height:900}});const page=await context.newPage();
 const errors=[];page.on('pageerror',e=>errors.push(e.message));
 for(const [route,phrase] of [['privacy-policy','90 days'],['privacy-statement','90 days'],['payment-policy-compliance','Razorpay'],['cookie-policy','Cookie choices'],['terms-and-conditions','mandatory'],['disclaimer','Qualified physicians'],['legal-notice','Operator:'],['cancellation-and-refund-policy','Razorpay']]) {
  await page.goto(base+'/'+route+'/',{waitUntil:'networkidle'});
  await page.waitForTimeout(500);
  const text=await page.locator('#ahv-design-root').innerText();assert.ok(text.includes(phrase),route+' missing '+phrase);
  assert.ok(!/CCAvenue|CC AVENUE|Japan AI Transparency Regulation/.test(text),route+' stale claim');
  assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1),route+' overflow '+width);checks++;
 }
 await page.goto(base+'/cookie-policy/',{waitUntil:'networkidle'});
 await page.getByRole('button',{name:'Accept All',exact:true}).click();
 assert.equal(await page.evaluate(()=>localStorage.getItem('ktahv-consent')),'accepted');
 await page.locator('[data-ahv-cookie-choices]').click();await page.waitForLoadState('networkidle');
 await page.getByRole('button',{name:'Accept All',exact:true}).waitFor();
 assert.equal(await page.evaluate(()=>localStorage.getItem('ktahv-consent')),null);
 assert.equal(await page.evaluate(()=>JSON.parse(localStorage.getItem('kairali-consent-v1')).granted),false);checks++;
 const tracked=await page.evaluate(()=>{const events=[];window.gtag=(...x)=>events.push(x);window.AHVSearch.track('test','diabetes patient@example.com',1);return events;});assert.deepEqual(tracked,[]);checks++;
 assert.deepEqual(errors,[]);await context.close();
}
console.log(JSON.stringify({checks,passed:true,base}));
} finally {await browser.close();}
