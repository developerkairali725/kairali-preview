// Local integration fixture: current AHV runtime + real pinned consent UI.
// All remote requests are intercepted; no conversion or visitor data is sent.
import { chromium } from '@playwright/test';
import { createServer } from 'node:http';
import { readFileSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { join, resolve } from 'node:path';
import assert from 'node:assert/strict';
const root=fileURLToPath(new URL('../',import.meta.url));
const source=readFileSync(join(root,'app/(english)/_families/consent-runtime.ts'),'utf8');
const runtime=source.slice(source.indexOf('`')+1,source.lastIndexOf('`'));
const report=[];
const identities=JSON.parse(readFileSync(join(root,'analytics.config.json'),'utf8'));
const liveIds={ga4:identities.measurement.ga4.id,adsSendTo:identities.googleAds.sendTo,clarity:identities.measurement.clarity.id,metaPixel:identities.measurement.metaPixel.id};
const server=createServer((req,res)=>{
 const url=new URL(req.url,'http://localhost');
 if(url.pathname.startsWith('/consent/')) {
  const file=resolve(root,'public','.'+url.pathname);
  if(!file.startsWith(join(root,'public/consent/'))){res.writeHead(403).end();return;}
  try {res.setHeader('Content-Type',file.endsWith('.css')?'text/css':'text/javascript');res.end(readFileSync(file));}catch{res.writeHead(404).end();}return;
 }
 const lang=url.pathname.split('/')[1]||'en';
 const measurement=url.pathname==='/sdk/'?liveIds:{ga4:'G-test',adsSendTo:'AW-test/action',clarity:'c-test',metaPixel:'p-test'};
 res.setHeader('Content-Type','text/html');res.end(`<!doctype html><html lang="${/^[a-z]{2}$/.test(lang)?lang:'en'}"><head><script>window.dataLayer=[];window.gtag=function(){dataLayer.push(arguments)};gtag('consent','default',{analytics_storage:'denied',ad_storage:'denied',ad_user_data:'denied',ad_personalization:'denied'});</script></head><body><main><h1>AHV consent integration fixture</h1><button data-ahv-cookie-choices>Cookie choices</button></main><script>(function(){var cfg={breakpoint:700,measurement:${JSON.stringify(measurement)}};var host=document.body;${runtime}\nensureConsentNotice();})();</script></body></html>`);
});
await new Promise(ok=>server.listen(0,'127.0.0.1',ok));
const origin=`http://127.0.0.1:${server.address().port}`;
const browser=await chromium.launch({channel:'chrome',headless:true});
async function context(options={}){
 const ctx=await browser.newContext({viewport:{width:390,height:844}});
 const fixtureOrigin=options.publicCountry?'https://ayurvedichealingvillage.com':origin;
 if(options.gpc)await ctx.addInitScript(()=>Object.defineProperty(navigator,'globalPrivacyControl',{value:true,configurable:true}));
 if(options.storageBlocked)await ctx.addInitScript(()=>{Object.defineProperty(window,'localStorage',{get(){throw Error('blocked')}})});
 const page=await ctx.newPage(),requests=[],errors=[];
 page.on('pageerror',e=>errors.push(e.message));
 await ctx.route('**/*',async route=>{
  const url=new URL(route.request().url());
  // A local response fixture under the public hostname exercises the real
  // browser adapter. No request reaches the public website or Cloudflare.
  if(fixtureOrigin!==origin && url.origin===fixtureOrigin) {
   if(url.pathname==='/cdn-cgi/trace')return route.fulfill({contentType:'text/plain',body:`h=ayurvedichealingvillage.com\nloc=${options.publicCountry}\nts=${Date.now()/1000}\n`});
   const response=await fetch(origin+url.pathname+url.search);
   return route.fulfill({status:response.status,headers:Object.fromEntries(response.headers),body:Buffer.from(await response.arrayBuffer())});
  }
  if(url.origin===origin && url.pathname==='/api/consent-region/' && options.prompt) {
   if(options.prompt==='error')return route.abort();
   return route.fulfill({json:{version:1,prompt:options.prompt},headers:{'Cache-Control':'no-store'}});
  }
  if(url.origin===origin)return route.continue();
  requests.push({host:url.hostname,path:url.pathname,resource:route.request().resourceType()});
  const sdk=route.request().resourceType()==='script' && (
   (url.hostname==='www.googletagmanager.com'&&url.pathname==='/gtag/js') ||
   (url.hostname==='www.clarity.ms'&&url.pathname.startsWith('/tag/')) ||
   (url.hostname==='scripts.clarity.ms'&&url.pathname.endsWith('/clarity.js')) ||
   (url.hostname==='connect.facebook.net'&&(url.pathname.endsWith('/fbevents.js')||url.pathname.startsWith('/signals/config/'))));
  if(options.sdk&&sdk){try {return await route.fulfill({response:await route.fetch()});}catch{return route.abort();}}
  return route.abort();
 });
 await page.goto(fixtureOrigin+(options.sdk?'/sdk/':options.path||''));await page.waitForFunction(()=>typeof window.AHV_COOKIE_SETTINGS==='function');
 if(!options.gpc && options.prompt!=='passive')await page.locator('.cm').waitFor({state:'visible'});
 return {ctx,page,requests,errors};
}
try {
 const a=await context();const {page,requests}=a;
 await page.locator('.cm').waitFor({state:'visible'});
 await page.waitForTimeout(350);
 if(process.env.CONSENT_QA_SCREENSHOTS)await page.screenshot({path:join(process.env.CONSENT_QA_SCREENSHOTS,'mobile-consent.png')});
 assert.equal(requests.length,0);report.push({case:'fresh default denied',pass:true});
 await page.getByRole('button',{name:'Reject optional',exact:true}).click();
 await page.reload();await page.waitForFunction(()=>typeof window.AHV_COOKIE_SETTINGS==='function');assert.equal(requests.length,0);
 report.push({case:'reject persists without optional SDKs',pass:true});
 await page.locator('[data-ahv-cookie-choices]').click();
 await page.locator('.pm').waitFor({state:'visible'});await page.waitForTimeout(350);
 if(process.env.CONSENT_QA_SCREENSHOTS)await page.screenshot({path:join(process.env.CONSENT_QA_SCREENSHOTS,'mobile-preferences.png')});
 await page.locator('input[value="analytics"]').focus(); await page.keyboard.press('Space'); assert.equal(await page.locator('input[value="analytics"]').isChecked(),true);
 await page.getByRole('button',{name:'Save my choices',exact:true}).click();
 await page.waitForFunction(()=>window.__ahvMeasurementStarted===true);
 assert.ok(requests.some(r=>r.host==='www.googletagmanager.com'));assert.ok(requests.some(r=>r.host==='www.clarity.ms'));assert.ok(!requests.some(r=>r.host==='connect.facebook.net'));
 assert.equal(await page.evaluate(()=>dataLayer.filter(c=>c[0]==='config'&&c[1].startsWith('AW-')).length),0);
 report.push({case:'analytics-only loads Google/Clarity, no Ads config or Meta',pass:true});
 await page.locator('[data-ahv-cookie-choices]').click();
 const prior=requests.length;
 await page.getByRole('button',{name:'Reject optional',exact:true}).click();
 await page.waitForLoadState('load');await page.waitForFunction(()=>typeof window.AHV_COOKIE_SETTINGS==='function');
 assert.equal(requests.length,prior);report.push({case:'withdrawal reload stops new optional requests',pass:true});
 assert.deepEqual(a.errors,[]);await a.ctx.close();
 const b=await context();await b.page.getByRole('button',{name:'Accept all',exact:true}).click();
 await b.page.waitForFunction(()=>window.__ahvMeasurementStarted===true);
 assert.equal(new Set(b.requests.map(r=>r.host)).size,3);
 assert.ok(await b.page.evaluate(()=>dataLayer.some(c=>c[0]==='config'&&c[1]==='AW-test')));
 report.push({case:'accept all configures GA/Ads and loads Meta/Clarity',pass:true});
 await b.page.reload();await b.page.waitForFunction(()=>window.__ahvMeasurementStarted===true);
 assert.equal(await b.page.locator('.cm').isVisible(),false);
 report.push({case:'accepted preference persists',pass:true});
 await b.ctx.close();
 const c=await context({gpc:true});await c.page.locator('[data-ahv-cookie-choices]').click();await c.page.getByRole('button',{name:'Accept all',exact:true}).click();
 await c.page.waitForFunction(()=>window.__ahvMeasurementStarted===true);
 assert.ok(!c.requests.some(r=>r.host==='connect.facebook.net'));assert.equal(await c.page.evaluate(()=>dataLayer.some(x=>x[0]==='config'&&x[1]==='AW-test')),false);
 report.push({case:'GPC keeps advertising denied even on Accept all',pass:true});await c.ctx.close();
 for(const lang of ['en','de','fr','es','it','pt','nl','ru','ar','hi','zh','ja','ko']) {
  const d=await context();await d.page.goto(origin+'/'+lang+'/');await d.page.locator('.cm').waitFor({state:'visible'});
  assert.equal(d.requests.length,0);
  const box=await d.page.locator('.cm').boundingBox();assert.ok(box.x>=0&&box.x+box.width<=391,lang);
  const buttons=d.page.locator('.cm button');assert.equal(await buttons.count(),3);
  await d.page.keyboard.press('Tab');assert.equal(await d.page.evaluate(()=>document.activeElement!==document.body),true);
  assert.deepEqual(d.errors,[]);report.push({case:lang+' mobile translated banner, keyboard, no overflow/preconsent tags',pass:true});
  await d.ctx.close();
 }
 // Edge cases are a second bounded browser batch.
 for(const [label,mutation] of [
  ['expired preference', `value.expirationTime=1`],
  ['old revision', `value.revision=1`],
  ['malformed record', null]
 ]) {
  const d=await context();await d.page.getByRole('button',{name:'Accept all',exact:true}).click();
  await d.page.waitForFunction(()=>window.__ahvMeasurementStarted===true);
  await d.page.evaluate(mutation=>{let value=JSON.parse(localStorage.getItem('ahv-consent-v2')); if(mutation===null)localStorage.setItem('ahv-consent-v2','{invalid');else {if(mutation.includes('expiration'))value.expirationTime=1;else value.revision=1;localStorage.setItem('ahv-consent-v2',JSON.stringify(value));}},mutation);
  const count=d.requests.length;await d.page.reload();await d.page.locator('.cm').waitFor({state:'visible'});
  assert.equal(d.requests.length,count);report.push({case:label+' re-prompts with no new tags',pass:true});await d.ctx.close();
 }
 const blocked=await context({storageBlocked:true});
 await blocked.page.getByRole('button',{name:'Accept all',exact:true}).click();await blocked.page.waitForFunction(()=>window.__ahvMeasurementStarted===true);
 await blocked.page.reload();await blocked.page.locator('.cm').waitFor({state:'visible'});assert.deepEqual(blocked.errors,[]);
 report.push({case:'blocked storage honors page choice, reload defaults denied',pass:true});await blocked.ctx.close();
 const ads=await context();await ads.page.getByRole('button',{name:'Choose settings',exact:true}).click();await ads.page.locator('.pm').waitFor({state:'visible'});await ads.page.waitForTimeout(350);await ads.page.locator('input[value="advertising"]').focus();await ads.page.keyboard.press('Space');assert.equal(await ads.page.locator('input[value="advertising"]').isChecked(),true);await ads.page.getByRole('button',{name:'Save my choices',exact:true}).click();await ads.page.waitForFunction(()=>window.__ahvMeasurementStarted===true);
 assert.ok(ads.requests.some(r=>r.host==='connect.facebook.net'));assert.ok(!ads.requests.some(r=>r.host==='www.clarity.ms'));
 assert.equal(await ads.page.evaluate(()=>dataLayer.some(x=>x[0]==='config'&&x[1]==='G-test')),false);
 report.push({case:'advertising-only has Ads/Meta without GA or Clarity',pass:true});await ads.ctx.close();
 const desktop=await context();await desktop.page.setViewportSize({width:1440,height:900});const bounds=await desktop.page.locator('.cm').boundingBox();assert.ok(bounds.width<1440&&bounds.x>=0);
 await desktop.page.getByRole('button',{name:'Choose settings',exact:true}).click();await desktop.page.keyboard.press('Escape');assert.equal(await desktop.page.locator('.pm').isVisible(),false);
 report.push({case:'desktop and Escape preferences dismissal',pass:true});await desktop.ctx.close();
 // Migration/GPC/cross-tab and local asset failure are a third bounded batch.
 for (const choice of ['accepted','declined']) {
  const d=await context();await d.page.evaluate(choice=>localStorage.setItem('ktahv-consent',choice),choice);
  await d.page.reload();await d.page.waitForFunction(()=>typeof window.AHV_COOKIE_SETTINGS==='function');
  await d.page.locator('.cm').waitFor({state:choice==='accepted'?'visible':'hidden'});
  assert.equal(d.requests.length,0);assert.equal(await d.page.locator('.cm').isVisible(),choice==='accepted');
  report.push({case:'legacy '+choice+' migration remains denied until valid optional choice',pass:true});await d.ctx.close();
 }
 const g=await context();await g.page.getByRole('button',{name:'Accept all',exact:true}).click();await g.page.waitForFunction(()=>window.__ahvMeasurementStarted===true);
 await g.ctx.addInitScript(()=>Object.defineProperty(navigator,'globalPrivacyControl',{value:true}));const n=g.requests.length;
 await g.page.reload();await g.page.waitForFunction(()=>typeof window.AHV_COOKIE_SETTINGS==='function');
 assert.ok(!g.requests.slice(n).some(r=>r.host==='connect.facebook.net'));
 assert.equal(await g.page.evaluate(()=>JSON.parse(localStorage.getItem('ahv-consent-v2')).categories.includes('advertising')),false);
 report.push({case:'GPC removes previously saved advertising permission',pass:true});await g.ctx.close();
 const x=await context();await x.page.getByRole('button',{name:'Reject optional',exact:true}).click();
 const other=await x.ctx.newPage();await other.goto(origin);await other.waitForFunction(()=>typeof window.AHV_COOKIE_SETTINGS==='function');
 let tabReloads=0;x.page.on('load',()=>tabReloads++);other.on('load',()=>tabReloads++);
 await Promise.all([x.page.waitForEvent('load'),other.evaluate(()=>localStorage.removeItem('ahv-consent-v2'))]);await x.page.waitForFunction(()=>typeof window.AHV_COOKIE_SETTINGS==='function');assert.equal(await x.page.locator('.cm').isVisible(),false);assert.equal(x.requests.length,0);
 await x.page.waitForTimeout(800);assert.equal(tabReloads,1,'refusal writes must settle without a cross-tab reload loop');
 report.push({case:'cross-tab grant removal preserves recent refusal and defaults denied',pass:true});await x.ctx.close();
 const failed=await context();await failed.ctx.route('**/consent/bridge.mjs',route=>route.abort());await failed.page.reload();await failed.page.getByRole('button',{name:'Cookie choices unavailable. Retry'}).waitFor();assert.equal(failed.requests.length,0);
 report.push({case:'module failure keeps optional tags blocked with retry',pass:true});await failed.ctx.close();
 // Regional presentation and denial renewal form another bounded batch.
 for(const path of ['/','/de/','/fr/','/es/','/it/','/pt/','/nl/','/ru/','/ar/','/hi/','/zh/','/ja/','/ko/','/ayurvedic-treatment-packages.html','/lp/panchakarma/']) {
  const d=await context({prompt:'passive',path});await d.page.waitForTimeout(150);
  assert.equal(await d.page.locator('.cm').isVisible(),false);assert.equal(d.requests.length,0);
  assert.equal(await d.page.evaluate(()=>localStorage.getItem('ahv-consent-v2')),null);
  await d.page.locator('[data-ahv-cookie-choices]').first().click();await d.page.locator('.pm').waitFor({state:'visible'});
  assert.equal(await d.page.locator('input[value="analytics"]').isChecked(),false);assert.equal(await d.page.locator('input[value="advertising"]').isChecked(),false);
  await d.page.locator('.pm button[data-role="necessary"]').click();await d.page.reload();await d.page.waitForFunction(()=>typeof window.AHV_COOKIE_SETTINGS==='function');
  assert.equal(d.requests.length,0);assert.deepEqual(d.errors,[]);report.push({case:path+' passive presentation retains manual translated choices and no tracking',pass:true});await d.ctx.close();
 }
 for(const prompt of ['automatic','error','unexpected']) {
  const d=await context({prompt});assert.equal(d.requests.length,0);assert.equal(await d.page.locator('.cm').isVisible(),true);
  report.push({case:prompt+' geo shows strict prompt without vendor requests',pass:true});await d.ctx.close();
 }
 const regional=await context({prompt:'passive'});await regional.page.locator('[data-ahv-cookie-choices]').click();await regional.page.getByRole('button',{name:'Accept all',exact:true}).click();await regional.page.waitForFunction(()=>window.__ahvMeasurementStarted===true);
 await regional.ctx.route('**/api/consent-region/',route=>route.fulfill({json:{version:1,prompt:'automatic'}}));await regional.page.reload();await regional.page.waitForFunction(()=>window.__ahvMeasurementStarted===true);assert.equal(await regional.page.locator('.cm').isVisible(),false);
 report.push({case:'explicit saved choice survives region change without another prompt',pass:true});await regional.ctx.close();
 const renewal=await context();await renewal.page.getByRole('button',{name:'Choose settings',exact:true}).click();await renewal.page.locator('input[value="analytics"]').check();await renewal.page.getByRole('button',{name:'Save my choices',exact:true}).click();await renewal.page.waitForFunction(()=>window.__ahvMeasurementStarted===true);
 await renewal.page.evaluate(()=>{
  const at=Date.now()-183*86400000,value=JSON.parse(localStorage.getItem('ahv-consent-v2'));
  value.consentTimestamp=value.lastConsentTimestamp=new Date(at).toISOString();value.expirationTime=at+182*86400000;localStorage.setItem('ahv-consent-v2',JSON.stringify(value));localStorage.setItem('ahv-consent-refusals-v1',JSON.stringify({version:1,advertising:at}));
 });
 const beforeRenewal=renewal.requests.length;await renewal.page.reload();await renewal.page.waitForFunction(()=>typeof window.AHV_COOKIE_SETTINGS==='function');
 assert.equal(renewal.requests.length,beforeRenewal);assert.equal(await renewal.page.locator('.cm').isVisible(),false);
 await renewal.page.locator('[data-ahv-cookie-choices]').click();assert.equal(await renewal.page.locator('input[value="analytics"]').isChecked(),false);assert.equal(await renewal.page.locator('input[value="advertising"]').isChecked(),false);
 report.push({case:'expired analytics grant stays off; advertising denial suppresses opt-back-in request before twelve months',pass:true});
 await renewal.page.getByRole('button',{name:'Accept all',exact:true}).click();await renewal.page.waitForFunction(()=>window.__ahvMeasurementStarted===true);
 assert.deepEqual(await renewal.page.evaluate(()=>JSON.parse(localStorage.getItem('ahv-consent-refusals-v1'))),{version:1});
 report.push({case:'voluntary settings regrant clears refusal only after explicit choice',pass:true});await renewal.ctx.close();
 const oldMixed=await context();await oldMixed.page.getByRole('button',{name:'Choose settings',exact:true}).click();await oldMixed.page.locator('input[value="analytics"]').check();await oldMixed.page.getByRole('button',{name:'Save my choices',exact:true}).click();await oldMixed.page.waitForFunction(()=>window.__ahvMeasurementStarted===true);
 await oldMixed.page.evaluate(()=>{const value=JSON.parse(localStorage.getItem('ahv-consent-v2'));value.revision=1;localStorage.setItem('ahv-consent-v2',JSON.stringify(value));});
 const mixedRequests=oldMixed.requests.length;await oldMixed.page.reload();await oldMixed.page.waitForFunction(()=>typeof window.AHV_COOKIE_SETTINGS==='function');
 assert.equal(oldMixed.requests.length,mixedRequests);assert.equal(await oldMixed.page.locator('.cm').isVisible(),false);
 await oldMixed.page.locator('[data-ahv-cookie-choices]').click();assert.equal(await oldMixed.page.locator('input[value="analytics"]').isChecked(),false);assert.equal(await oldMixed.page.locator('input[value="advertising"]').isChecked(),false);
 report.push({case:'old-revision mixed choice preserves refusal without restoring its former grant',pass:true});await oldMixed.ctx.close();
 const gpcFresh=await context({gpc:true,prompt:'passive'});assert.equal(gpcFresh.requests.length,0);assert.equal(await gpcFresh.page.locator('.cm').isVisible(),false);
 await gpcFresh.ctx.addInitScript(()=>Object.defineProperty(navigator,'globalPrivacyControl',{value:false,configurable:true}));await gpcFresh.page.reload();await gpcFresh.page.waitForFunction(()=>typeof window.AHV_COOKIE_SETTINGS==='function');assert.equal(await gpcFresh.page.evaluate(()=>navigator.globalPrivacyControl),false);assert.equal(gpcFresh.requests.length,0);assert.equal(await gpcFresh.page.locator('.cm').isVisible(),false);
 report.push({case:'fresh GPC suppresses advertising and survives signal removal as a refusal',pass:true});await gpcFresh.ctx.close();
 // Real-browser Cloudflare adapter, all fixtures and telemetry remain local.
 for(const country of ['IN','US','CA','BR','DE','GB','CH','XX']) {
  const strict=['DE','GB','CH','XX'].includes(country),d=await context({publicCountry:country,prompt:strict?'automatic':'passive'});await d.page.waitForTimeout(150);
  assert.equal(await d.page.locator('.cm').isVisible(),strict);assert.equal(d.requests.length,0);
  assert.equal(await d.page.evaluate(()=>localStorage.getItem('ahv-consent-v2')),null);
  assert.deepEqual(d.errors,[]);report.push({case:country+' public-hostname Cloudflare fixture has expected presentation and no optional vendors',pass:true});await d.ctx.close();
 }
 if(process.env.CONSENT_QA_VENDOR_SCRIPTS==='1') {
  const v=await context({sdk:true});assert.equal(v.requests.length,0);
  await v.page.getByRole('button',{name:'Accept all',exact:true}).click();
  await v.page.waitForTimeout(6000);
  const loaded=await v.page.evaluate(()=>({google:!!window.google_tag_manager,meta:typeof window.fbq?.callMethod==='function',clarity:typeof window.clarity==='function'&&!window.clarity.q}));
  assert.equal(loaded.google,true);assert.equal(loaded.meta,true);
  assert.ok(v.requests.some(r=>r.host.endsWith('.clarity.ms')&&r.path==='/collect')); 
  const deniedDestinations=v.requests.filter(r=>r.resource!=='script');
  report.push({case:'real vendor JavaScript runs locally; all collection requests aborted',pass:true,loaded,blockedRequests:deniedDestinations});
  await v.ctx.close();
 }
 console.log(JSON.stringify(report,null,2));
 if(process.env.CONSENT_QA_REPORT)writeFileSync(process.env.CONSENT_QA_REPORT,JSON.stringify(report,null,2));
} finally {await browser.close();server.close();}
