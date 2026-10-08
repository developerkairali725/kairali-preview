import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { measurementForEnvironment } from "../lib/measurement-config.mjs";
import { browser, runtimeFrom, ORIGIN } from "./fixtures/measurement-browser.mjs";
import { SYNTHETIC_AD_CLICKS, BLOCKED, LEADING_QUESTION_MARK, APPROVED_KEYS } from "./fixtures/measurement-url-cases.mjs";

const runtime = runtimeFrom(readFileSync(new URL("../app/(english)/_families/consent-runtime.ts", import.meta.url), "utf8"));
const receipt = readFileSync(new URL("../public/design/lead-receipt.js", import.meta.url), "utf8");
const config = JSON.parse(readFileSync(new URL("../analytics.config.json", import.meta.url), "utf8"));
const production = measurementForEnvironment({ AHV_ANALYTICS: "1", AHV_STAGING: "0" }, config);
const receiptId = "6f1c2b9e-4d3a-4f8b-9c7d-1a2b3c4d5e6f";
const caseById = (id) => SYNTHETIC_AD_CLICKS.find(c => c.id === id);
const A17 = caseById("A17"), A18 = caseById("A18");
const AD_VALUES = ["12345678901", "123456789012", "765432109876", "synthetic keyword", "synthetic+keyword", "synthetic_group", "kwd-", "aud-", "www.example.com", "{_creative}", "%7B"];

const plain = (value) => JSON.parse(JSON.stringify(value ?? null));
function open(options) { return browser(runtime, { measurement: production, ...options }); }
function vendorPayload(ctx) { return JSON.stringify([ctx.dataLayer, ctx.fbq?.queue, ctx.clarity?.q]); }
function approvedOnly(href) {
  const url = new URL(href);
  url.searchParams.forEach((_value, name) => assert.ok(APPROVED_KEYS.includes(name), `${name} reached a vendor-readable URL`));
  assert.ok(url.hash === "" || url.hash === "#enquiry", url.hash);
}

test("synthetic ad-click shapes lose only ad metadata before any SDK can read the address", () => {
  assert.ok(SYNTHETIC_AD_CLICKS.length <= 25);
  for (const c of SYNTHETIC_AD_CLICKS) {
    const ctx = open(c);
    assert.equal(ctx.__ahvMeasurementStarted, true, c.id);
    assert.equal(ctx.location.search, c.after, c.id);
    assert.equal(ctx.location.pathname, c.path || "/", c.id);
    assert.equal(ctx.location.hash, c.hash || "", c.id);
    assert.equal(ctx.historyCalls.length, c.search === c.after ? 0 : 1, c.id);
    if (ctx.historyCalls.length) assert.equal(ctx.historyCalls[0].state, null, c.id);
    assert.equal(ctx.vendorReads.length, 3, c.id);
    for (const read of ctx.vendorReads) {
      assert.equal(read.href, ORIGIN + (c.path || "/") + c.after + (c.hash || ""), c.id);
      approvedOnly(read.href);
    }
    const payload = vendorPayload(ctx);
    for (const value of AD_VALUES) assert.equal(payload.includes(value), false, `${c.id} forwarded ${value}`);
    const config = ctx.dataLayer.find(entry => entry[0] === "config" && entry[1] === production.ga4);
    approvedOnly(config[2].page_location);
    assert.deepEqual(ctx.transport.external, [], c.id);
  }
});

function assertBlocked(c) {
  const ctx = open(c);
  assert.equal(ctx.__ahvMeasurementStarted, undefined, c.id);
  assert.equal(ctx.location.search, c.search, c.id);
  assert.equal(ctx.location.hash, c.hash || "", c.id);
  assert.deepEqual(ctx.historyCalls, [], c.id);
  assert.deepEqual(ctx.vendorReads, [], c.id);
  assert.equal(ctx.fbq, undefined, c.id);
  assert.equal(ctx.clarity, undefined, c.id);
  assert.deepEqual(plain(ctx.dataLayer.map(entry => entry[0])), ["consent"], c.id);
  assert.equal(ctx.AHV_MEASUREMENT.recordLead("contact", receiptId), false, c.id);
  assert.equal(ctx.timersPending(), 0, c.id);
  assert.deepEqual(ctx.transport.external, [], c.id);
}

test("unknown, invalid or private values keep measurement off and leave the address untouched", () => {
  assert.ok(BLOCKED.length <= 25);
  for (const c of BLOCKED) assertBlocked(c);
});

test("a key spelled with a leading ? is unknown, not the ad key it resembles", () => {
  assert.ok(LEADING_QUESTION_MARK.length <= 25);
  for (const c of LEADING_QUESTION_MARK) assertBlocked(c);
});

test("other sites' referrers are unchanged: GA4 gets the origin, raw-reading SDKs get the browser value", () => {
  const referrer = "https://search.example/result?q=synthetic";
  const ctx = open({ search: "?gclid=SyntheticGclid0005", referrer });
  assert.equal(ctx.__ahvMeasurementStarted, true);
  const config = ctx.dataLayer.find(entry => entry[0] === "config" && entry[1] === production.ga4);
  assert.equal(config[2].page_referrer, "https://search.example/");
  // Documented residual: browsers normally send other sites' referrers as an
  // origin only; a site that sends more is not altered by this runtime.
  assert.ok(ctx.vendorReads.every(read => read.referrer === referrer));
  const cleanOwn = open({ search: "?gclid=SyntheticGclid0006", referrer: ORIGIN + "/ayurvedic-treatment-packages.html?utm_source=google&utm_medium=cpc" });
  assert.equal(cleanOwn.__ahvMeasurementStarted, true);
  // targetid is not a removable key, so an own page that still carries it is
  // an unsafe referrer even when every other key there would be removed.
  const targetOwn = open({ search: "?gclid=SyntheticGclid0008", referrer: ORIGIN + "/?utm_source=google&campaignid=12345678901&targetid=kwd-123456789" });
  assert.equal(targetOwn.__ahvMeasurementStarted, undefined);
  assert.deepEqual(targetOwn.vendorReads, []);
  assert.deepEqual(targetOwn.historyCalls, []);
});

test("the address changes only after Next.js can adopt it, and the wait is bounded", () => {
  const ctx = open({ search: A17.search, next: "pending" });
  assert.equal(ctx.__ahvMeasurementStarted, undefined);
  assert.equal(ctx.location.search, A17.search);
  assert.deepEqual(ctx.historyCalls, []);
  ctx.flush(3);
  assert.deepEqual(ctx.historyCalls, []);
  ctx.settle();
  ctx.flush();
  assert.equal(ctx.location.search, A17.after);
  assert.equal(ctx.historyCalls.length, 1);
  assert.equal(ctx.__ahvMeasurementStarted, true);
  assert.equal(ctx.timersPending(), 0);
  for (const read of ctx.vendorReads) approvedOnly(read.href);

  const never = open({ search: A17.search, next: "pending" });
  never.flush(1000);
  assert.equal(never.timersPending(), 0);
  assert.equal(never.__ahvMeasurementStarted, undefined);
  assert.equal(never.location.search, A17.search);

  const settled = open({ search: A17.search, next: "settled" });
  assert.equal(settled.__ahvMeasurementStarted, true);
  assert.equal(settled.location.search, A17.after);

  const broken = open({ search: A17.search, replaceThrows: true });
  assert.equal(broken.__ahvMeasurementStarted, undefined);
  assert.deepEqual(broken.vendorReads, []);
});

test("staging without the build switch is untouched; declining loads nothing", () => {
  const off = browser(runtime, { search: A17.search, measurement: undefined });
  assert.equal(off.location.search, A17.search);
  assert.deepEqual(off.historyCalls, []);
  assert.equal(off.__ahvMeasurementStarted, undefined);
  const declined = open({ search: A17.search, choice: "declined" });
  assert.equal(declined.location.search, A17.after, "unused ad metadata is still removed from the address");
  assert.equal(declined.__ahvMeasurementStarted, undefined);
  assert.deepEqual(declined.vendorReads, []);
  assert.equal(declined.dataLayer.at(-1)[2].analytics_storage, "denied");
  assert.equal(declined.dataLayer.at(-1)[2].ad_storage, "denied");
  const undecided = open({ search: A17.search, choice: "none" });
  assert.deepEqual(undecided.vendorReads, []);
  assert.equal(undecided.dataLayer, undefined);
});

test("withdrawal after an ad-click visit revokes before reload and records nothing more", () => {
  const ctx = open({ search: A18.search });
  assert.equal(ctx.__ahvMeasurementStarted, true);
  ctx.AHV_MEASUREMENT.attribution();
  assert.notEqual(ctx.sessionStorage.getItem("ahv-paid-attribution-v1"), null);
  ctx.AHV_SET_CONSENT({ analytics: false, advertising: false });
  assert.equal(ctx.reloads, 1);
  assert.equal(ctx.dataLayer.at(-1)[2].analytics_storage, "denied");
  assert.equal(ctx.dataLayer.at(-1)[2].ad_user_data, "denied");
  assert.equal(ctx.fbq.queue.at(-1)[1], "revoke");
  assert.equal(ctx.clarity.q.at(-1)[1].analytics_Storage, "denied");
  assert.equal(ctx.sessionStorage.getItem("ahv-paid-attribution-v1"), null);
  assert.equal(ctx.AHV_MEASUREMENT.recordLead("contact", receiptId), false);
  const reloaded = open({ search: ctx.location.search, choice: "declined" });
  assert.deepEqual(reloaded.vendorReads, []);
});

test("attribution keeps its allowed fields and 30-minute session limit", () => {
  const ctx = open({ search: A17.search });
  const first = ctx.AHV_MEASUREMENT.attribution();
  assert.deepEqual(Object.keys(first).sort(), ["gclid", "utm_campaign", "utm_medium", "utm_source"]);
  const stored = JSON.parse(ctx.sessionStorage.getItem("ahv-paid-attribution-v1"));
  assert.deepEqual(Object.keys(stored.values).sort(), Object.keys(first).sort());
  ctx.location.search = "";
  assert.equal(ctx.AHV_MEASUREMENT.attribution().gclid, "SyntheticGclid0002");
  ctx.sessionStorage.setItem("ahv-paid-attribution-v1", JSON.stringify({ at: Date.now() - 1800001, values: first }));
  assert.deepEqual(plain(ctx.AHV_MEASUREMENT.attribution()), {});
  assert.equal(ctx.sessionStorage.getItem("ahv-paid-attribution-v1"), null);
});

test("one accepted receipt gives GA4, Ads and Meta the same id once, with verified loaders only", async () => {
  const ctx = open({ search: A18.search, receipt });
  const configs = ctx.dataLayer.filter(entry => entry[0] === "config").map(entry => entry[1]);
  assert.deepEqual(plain(configs), ["G-PZBX8G4Y9N", "GT-K8D5DQJT"]);
  assert.equal(ctx.googleLoader, "https://www.googletagmanager.com/gtag/js?id=G-PZBX8G4Y9N");
  assert.equal(ctx.vendorReads.some(read => read.src.includes("AW-")), false);
  const post = () => ctx.fetch("/api/lead/", { method: "POST", body: JSON.stringify({ form: "landing-page", submissionToken: receiptId }) });
  await post();
  await post();
  const lead = ctx.dataLayer.filter(entry => entry[1] === "generate_lead");
  const conversion = ctx.dataLayer.filter(entry => entry[1] === "conversion");
  const meta = ctx.fbq.queue.filter(entry => entry[0] === "track" && entry[1] === "Lead");
  assert.equal(lead.length, 1);
  assert.equal(conversion.length, 1);
  assert.equal(meta.length, 1);
  assert.equal(ctx.clarity.q.filter(entry => entry[1] === "lead_received").length, 1);
  assert.equal(lead[0][2].event_id, receiptId);
  assert.equal(conversion[0][2].transaction_id, receiptId);
  assert.equal(conversion[0][2].send_to, production.adsSendTo);
  assert.equal(meta[0][3].eventID, receiptId);
  for (const event of [...lead, ...conversion]) approvedOnly(event[2].page_location);
  assert.equal(ctx.transport.leadReceipts.length, 2);
  assert.deepEqual(ctx.transport.external, []);
  const advertisingOnly = open({ search: A18.search, choice: "advertising" });
  assert.equal(advertisingOnly.googleLoader, "https://www.googletagmanager.com/gtag/js?id=GT-K8D5DQJT");
});
