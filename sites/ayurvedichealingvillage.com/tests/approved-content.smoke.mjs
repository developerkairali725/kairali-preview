import { chromium } from '@playwright/test';
import assert from 'node:assert/strict';
const base=process.env.AHV_BASE||'http://127.0.0.1:4472';
const browser=await chromium.launch();let checks=0;
try {
for(const width of [390,1440]) {
 const ctx=await browser.newContext({viewport:{width,height:900}});const page=await ctx.newPage();const errors=[];page.on('pageerror',e=>errors.push(e.message));
 for(const [route,words] of [
 ['/', ['Certified Yoga Teacher Training — Coming Soon','four included follow-up']],
 ['/yoga-meditation-training/',['Yoga–Dhyāna Abhyāsa','Yoga & Meditation Training']],
 ['/yoga-retreats/',['Vaiyaktika Yoga Sādhanā','Personalized Yoga']],
 ['/all-programs/',['Yoga–Dhyāna Abhyāsa','Vaiyaktika Yoga Sādhanā']],
 ['/maharaja-suite/',['Refrigerator in both suites 1001 and 1002','Coffee maker in both suites 1001 and 1002']],
 ['/careers/',['unchecked by default','career@kairali.com','six months after closure','does not enrol you in a newsletter']],
 ['/new-to-yoga-teacher-training/',['Coming Soon','enrolment is not currently open']],
 ['/training-course-fees/',['Certified Yoga Teacher Training is Coming Soon']],
 ['/privacy-policy/',['unchecked by default','Sunaj owns','90 days']],
 ['/faqs-downloads/',['Planning your admission and follow-up','Four follow-up consultations','A coordinator will contact you to arrange the consultation.']]
 ]) {
  await page.goto(base+route,{waitUntil:'networkidle'});await page.waitForTimeout(500);
  const text=await page.locator('#ahv-design-root').textContent();for(const word of words)assert.ok(text.toLowerCase().includes(word.toLowerCase()),width+' '+route+' missing '+word);
  // internal operational ownership notes never ship in customer copy (owner wording standard, 28 Sep 2026)
  if(route==='/careers/'||route==='/privacy-policy/')assert.ok(!/providing technical support/i.test(text),width+' '+route+' shows internal staff note');
  assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1),width+' '+route+' overflow');checks++;
  if(route==='/faqs-downloads/') {assert.equal(await page.locator('#q-45').count(),1);await page.locator('#q-45 summary').click();assert.ok(await page.locator('#q-45').getAttribute('open')!==null);}
 }
 assert.deepEqual(errors,[]);await ctx.close();
}
console.log(JSON.stringify({checks,passed:true,base}));
}finally{await browser.close();}
