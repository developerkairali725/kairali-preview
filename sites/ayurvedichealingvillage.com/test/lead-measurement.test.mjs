import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { runInNewContext } from "node:vm";

const consentSource = readFileSync(new URL("../app/(english)/_families/consent-runtime.ts", import.meta.url), "utf8");
const consentRuntime = consentSource.slice(consentSource.indexOf("`") + 1, consentSource.lastIndexOf("`"));
const receiptRuntime = readFileSync(new URL("../public/design/lead-receipt.js", import.meta.url), "utf8");
const token = "c3da5d5e-95ca-4a0a-a730-e4ab31c7f65a";

function browser(choice = "accepted", status = 200, result = { ok: true, status: "received" }, search = "?gclid=paid123", environment = "production") {
  const items = new Map([["ktahv-consent", choice]]);
  const storage = {
    getItem: (key) => items.get(key) ?? null,
    setItem: (key, value) => items.set(key, String(value)),
    removeItem: (key) => items.delete(key),
  };
  const ctx = {
    URL, URLSearchParams, JSON, Date, Promise,
    localStorage: storage, sessionStorage: storage,
    location: {
      origin: "https://ayurvedichealingvillage.com",
      pathname: "/contact-us/",
      search,
      hash: "",
      href: "https://ayurvedichealingvillage.com/contact-us/" + search,
      assign() {},
    },
    document: {
      referrer: "https://search.example/result?email=private%40example.com",
      addEventListener() {},
      createElement: () => ({}),
      head: { appendChild(script) {
        if (script.src?.includes("googletagmanager.com")) {
          ctx.googleCommandsAtLoad = Array.from(ctx.dataLayer || [], entry => Array.from(entry));
        }
      } },
      getElementById: () => null,
    },
    setTimeout() {},
  };
  ctx.window = ctx;
  ctx.window.fetch = async () => ({ status, clone: () => ({ json: async () => result }) });
  runInNewContext(`var cfg={measurement:{ga4:"G-test",clarity:"c-test",metaPixel:"p-test",adsSendTo:"AW-test/action",environment:${JSON.stringify(environment)}}};var host=document.body;${consentRuntime}\nwindow.AHV_SET_CONSENT({analytics:${choice === "accepted" || choice === "analytics"},advertising:${choice === "accepted" || choice === "advertising"}});`, ctx);
  runInNewContext(receiptRuntime, ctx);
  return ctx;
}

test("paid arrival starts only consented measurement; unsafe query suppresses third-party tags", () => {
  const accepted = browser();
  assert.equal(accepted.__ahvMeasurementStarted, true);
  const config = accepted.dataLayer.find((entry) => entry[0] === "config" && entry[1] === "G-test");
  assert.equal(config[2].page_location, "https://ayurvedichealingvillage.com/contact-us/?gclid=paid123");
  assert.equal(config[2].page_referrer, "https://search.example/");
  assert.equal(browser("accepted", 200, { ok: true, status: "received" }, "?gclid=paid123&email=private%40example.com").__ahvMeasurementStarted, undefined);
  const fragment = browser();
  fragment.location.hash = "#draft";
  assert.equal(fragment.AHV_MEASUREMENT.recordLead("contact", token), false);
  const declined = browser("declined");
  assert.equal(declined.__ahvMeasurementStarted, undefined);
  assert.equal(declined.dataLayer.at(-1)[2].analytics_storage, "denied");
});

test('active campaign URLs retain consented measurement and the first nonempty attribution value', async () => {
  const cases = [
    ['?utm_source=googleads&utm_source=google-ads&utm_medium=cpc&utm_campaign=disease_specific_neo_india&utm_campaign=&utm_term=pain_mgmt&utm_term', 'utm_campaign', 'disease_specific_neo_india'],
    ['?utm_source=ppc&utm_medium=search&utm_campaign=Kairali+Brand+%26+Competition&utm_content=kairali+ahv', 'utm_campaign', 'Kairali Brand & Competition'],
    ['?utm_campaign=&utm_campaign=Campaign&gad_source=1&gad_campaignid=12345678901234567890&gclid=paid123', 'utm_campaign', 'Campaign'],
  ];
  for (const [query, key, expected] of cases) {
    const ctx = browser('accepted', 200, {ok:true,status:'received'}, query);
    assert.equal(ctx.__ahvMeasurementStarted, true, query);
    assert.equal(ctx.AHV_MEASUREMENT.attribution()[key], expected);
    await ctx.fetch('/api/lead/', {method:'POST',body:JSON.stringify({form:'landing-page',submissionToken:token})});
    const events = ctx.dataLayer.filter(entry => entry[1] === 'conversion');
    assert.equal(events.length, 1);
    const url = new URL(events[0][2].page_location);
    assert.equal(url.searchParams.get(key), expected);
    assert.equal(url.searchParams.getAll(key).length, 1);
    assert.equal(url.searchParams.has('gad_source'), false);
    assert.equal(url.searchParams.has('gad_campaignid'), false);
  }
});

test('Google click metadata and empty UTM slots never bypass private-data and length guards', () => {
  for (const query of ['?gad_source=1&gad_campaignid=123&gclid=paid123','?utm_term=&utm_content']) {
    assert.equal(browser('accepted',200,{ok:true,status:'received'},query).__ahvMeasurementStarted,true);
    assert.equal(browser('declined',200,{ok:true,status:'received'},query).__ahvMeasurementStarted,undefined);
  }
  for (const query of [
    '?gad_source=private%40example.com', '?gad_campaignid=123%26email', '?gad_campaignid='+ '1'.repeat(21),
    '?utm_campaign=Campaign&utm_campaign=private%40example.com', '?utm_term=&email=private%40example.com',
    '?utm_content=Campaign%0ASecret', '?gclid=', '?utm_campaign='+ 'a'.repeat(121),
  ]) assert.equal(browser('accepted',200,{ok:true,status:'received'},query).__ahvMeasurementStarted,undefined,query);
});

test("accepted API receipt emits one lead per token; retry, error and direct thanks do not", async () => {
  const ctx = browser();
  const post = () => ctx.fetch("/api/lead/", { method: "POST", body: JSON.stringify({ form: "contact", submissionToken: token }) });
  await post();
  assert.equal(ctx.dataLayer.filter((entry) => entry[0] === "event" && entry[1] === "conversion").length, 1);
  assert.equal(ctx.dataLayer.filter((entry) => entry[0] === "event" && entry[1] === "generate_lead").length, 1);
  assert.equal(ctx.fbq.queue.filter((entry) => entry[0] === "track" && entry[1] === "Lead").length, 1);
  assert.equal(ctx.clarity.q.filter((entry) => entry[0] === "event" && entry[1] === "lead_received").length, 1);
  await post();
  assert.equal(ctx.dataLayer.filter((entry) => entry[1] === "conversion").length, 1);
  assert.equal(ctx.AHV_MEASUREMENT.recordLead("contact", token), false);
  assert.equal(ctx.sessionStorage.getItem("ktahv-accepted-lead-events-v1")?.includes(token), true);
  // Visiting a thank-you path has no fetch response and therefore no event.
  ctx.location.pathname = "/thanks/";
  assert.equal(ctx.dataLayer.filter((entry) => entry[1] === "conversion").length, 1);
  for (const failed of [browser("accepted", 502, { ok: false }), browser("accepted", 200, { ok: true, status: "pending" })]) {
    await failed.fetch("/api/lead/", { method: "POST", body: JSON.stringify({ form: "contact", submissionToken: token }) });
    assert.equal(failed.dataLayer.filter((entry) => entry[1] === "conversion").length, 0);
  }
});

test("a received careers application is not an enquiry conversion", async () => {
  const ctx = browser();
  await ctx.fetch("/api/lead/", { method: "POST", body: JSON.stringify({ form: "apply-now", submissionToken: token }) });
  assert.equal(ctx.dataLayer.filter((entry) => entry[0] === "event").length, 0);
  assert.equal(ctx.fbq.queue.filter((entry) => entry[0] === "track" && entry[1] === "Lead").length, 0);
  assert.equal(ctx.clarity.q?.filter((entry) => entry[0] === "event").length ?? 0, 0);
});

test("authorised staging labels signals without creating production lead conversions", async () => {
  const ctx = browser("accepted", 200, { ok: true, status: "received" }, "?utm_source=cody_qa", "staging");
  const config = ctx.dataLayer.find(entry => entry[0] === "config" && entry[1] === "G-test");
  assert.equal(config[2].ahv_environment, "staging");
  assert.equal(config[2].debug_mode, true);
  await ctx.fetch("/api/lead/", { method: "POST", body: JSON.stringify({ form: "contact", submissionToken: token }) });
  assert.equal(ctx.dataLayer.filter(entry => entry[1] === "conversion" || entry[1] === "generate_lead").length, 0);
  assert.equal(ctx.dataLayer.filter(entry => entry[1] === "ahv_staging_lead").length, 1);
  assert.equal(ctx.fbq.queue.filter(entry => entry[0] === "trackCustom" && entry[1] === "AHVStagingLead").length, 1);
  assert.equal(ctx.clarity.q.filter(entry => entry[1] === "ahv_staging_lead").length, 1);
  assert.ok(ctx.clarity.q.some(entry => entry[0] === "consentv2" && entry[1].analytics_Storage === "granted"));
});

test("Meta bootstrap dispatches events through the loaded SDK instead of leaving them queued", () => {
  const ctx = browser();
  let dispatched;
  ctx.fbq.callMethod = (...args) => { dispatched = args; };
  ctx.fbq("track", "Lead");
  assert.deepEqual(dispatched, ["track", "Lead"]);
});


test("R10 paid campaign spaces and fixed enquiry anchor retain attribution and one confirmed conversion", async () => {
 const ctx=browser("accepted",200,{ok:true,status:"received"},"?utm_campaign=Competition&utm_content=kairali+ahv&gclid=paid123");
 assert.equal(ctx.__ahvMeasurementStarted,true);
 ctx.location.hash="#enquiry";
 await ctx.fetch("/api/lead/",{method:"POST",body:JSON.stringify({form:"landing-page",submissionToken:token})});
 const events=ctx.dataLayer.filter(entry=>entry[1]==="conversion");
 assert.equal(events.length,1);
 assert.match(events[0][2].page_location,/utm_content=kairali\+ahv/);
 assert.equal(events[0][2].page_location.includes("#"),false);
 for(const query of ["?utm_content=private%40example.com","?email=private%40example.com","?utm_content=%3Cscript%3E","?gclid=not+a+click+id"])
  assert.equal(browser("accepted",200,{ok:true,status:"received"},query).__ahvMeasurementStarted,undefined);
});

test('R10 interactions respect consent, environment and a fixed non-personal parameter allowlist',()=>{
 const ctx=browser('accepted',200,{ok:true,status:'received'},'?utm_source=google','staging');
 ctx.location.pathname='/ayurvedic-treatment-packages.html';
 assert.equal(ctx.AHV_MEASUREMENT.recordInteraction('contact_click','whatsapp'),true);
 assert.equal(ctx.dataLayer.filter(e=>e[1]==='ahv_staging_contact_click').length,1);
 assert.equal(ctx.AHV_MEASUREMENT.recordInteraction('contact_click','private@example.com'),false);
 assert.equal(ctx.AHV_MEASUREMENT.recordInteraction('generate_lead','enquiry'),false);
 assert.equal(ctx.dataLayer.filter(e=>e[1]==='conversion').length,0);
 const declined=browser('declined');declined.location.pathname=ctx.location.pathname;
 assert.equal(declined.AHV_MEASUREMENT.recordInteraction('exit_help','shown'),false);
});

test('consented attribution survives programme navigation, expires, and excludes arbitrary private parameters',()=>{
 const ctx=browser('accepted',200,{ok:true,status:'received'},'?utm_source=google&utm_content=kairali+ahv&gbraid=braid123&email=private%40example.com');
 const first=ctx.AHV_MEASUREMENT.attribution();
 assert.equal(first.utm_content,'kairali ahv');assert.equal(first.gbraid,'braid123');assert.equal(first.email,undefined);
 ctx.location.search='';assert.equal(ctx.AHV_MEASUREMENT.attribution().utm_source,'google');
 ctx.sessionStorage.setItem('ahv-paid-attribution-v1',JSON.stringify({at:Date.now()-1800001,values:first}));
 assert.equal(Object.keys(ctx.AHV_MEASUREMENT.attribution()).length,0);
 const declined=browser('declined');declined.AHV_MEASUREMENT.attribution();
 assert.equal(declined.sessionStorage.getItem('ahv-paid-attribution-v1'),null);
});

test('saved withdrawal denies loaded tags before a reload', () => {
 const ctx=browser(); let reloads=0;
 ctx.location.reload=()=>{reloads++;assert.equal(ctx.dataLayer.at(-1)[2].analytics_storage,'denied');};
 ctx.AHV_SET_CONSENT({analytics:false,advertising:false});
 assert.equal(reloads,1);
 assert.equal(ctx.fbq.queue.at(-1)[1],'revoke');
 assert.equal(ctx.clarity.q.at(-1)[1].analytics_Storage,'denied');
 assert.equal(ctx.AHV_MEASUREMENT.recordLead('contact',token),false);
});

test('paid page location retains attribution in Safari without URLSearchParams.size', () => {
  const descriptor = Object.getOwnPropertyDescriptor(URLSearchParams.prototype, 'size');
  try {
    delete URLSearchParams.prototype.size;
    const ctx = browser('accepted',200,{ok:true,status:'received'},'?utm_campaign=Brand+%26+Competition&gclid=paid123');
    const config = ctx.dataLayer.find(entry => entry[0] === 'config' && entry[1] === 'G-test');
    assert.equal(new URL(config[2].page_location).searchParams.get('utm_campaign'),'Brand & Competition');
  } finally { if(descriptor) Object.defineProperty(URLSearchParams.prototype,'size',descriptor); }
});


test("automatic Google customer-data collection is disabled before SDK load and for every enquiry event", async () => {
  for (const environment of ["production", "staging"]) {
    const ctx = browser("accepted", 200, {ok:true,status:"received"}, "?gclid=paid123", environment);
    const commands = ctx.googleCommandsAtLoad;
    assert.equal(commands[0][0], "consent");
    const privacy = commands.find(entry => entry[0] === "set");
    assert.equal(Object.hasOwn(privacy[1], "user_data"), true);
    assert.equal(privacy[1].user_data, null);
    assert.ok(commands.some(entry => entry[0] === "config"));
    for (const entry of commands.filter(entry => entry[0] === "config")) {
      assert.equal(Object.hasOwn(entry[2], "user_data"), true);
      assert.equal(entry[2].user_data, null);
    }
    await ctx.fetch("/api/lead/", {method:"POST",body:JSON.stringify({form:"contact",submissionToken:token,email:"synthetic@example.com"})});
    ctx.location.pathname = "/ayurvedic-treatment-packages.html";
    assert.equal(ctx.AHV_MEASUREMENT.recordInteraction("contact_click", "whatsapp"), true);
    for (const entry of ctx.dataLayer.filter(entry => entry[0] === "event")) {
      assert.equal(Object.hasOwn(entry[2], "user_data"), true);
      assert.equal(entry[2].user_data, null);
      assert.equal(JSON.stringify(entry).includes("synthetic@example.com"), false);
    }
    assert.equal(ctx.dataLayer.filter(entry => entry[1] === (environment === "staging" ? "ahv_staging_lead" : "generate_lead")).length, 1);
  }
});

// VM-only commands: no network or conversion receipts reach vendors.
test('category choices keep lead destinations separate', () => {
 for (const category of ['analytics','advertising']) {
  const ctx=browser(category);
  assert.equal(ctx.AHV_MEASUREMENT.recordLead('contact',token),true);
  const events=ctx.dataLayer.filter(c=>c[0]==='event').map(c=>c[1]);
  assert.equal(events.includes('generate_lead'),category==='analytics');
  assert.equal(events.includes('conversion'),category==='advertising');
  assert.equal(!!ctx.fbq,category==='advertising');
  assert.equal(!!ctx.clarity,category==='analytics');
 }
});
