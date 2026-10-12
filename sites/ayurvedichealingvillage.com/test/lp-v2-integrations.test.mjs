import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { EVENTS, isEventName } from "../campaign-v2/integrations/events.ts";
import { DEFAULT_SLOTS, INTEGRATIONS, buildSlots } from "../campaign-v2/integrations/slots.ts";
import { createTracker, cleanParams, looksLikePii } from "../campaign-v2/integrations/track.ts";
import { ADAPTERS } from "../campaign-v2/integrations/adapters/index.ts";
import { googleAds, adsLabelKey } from "../campaign-v2/integrations/adapters/googleAds.ts";
import { meta } from "../campaign-v2/integrations/adapters/meta.ts";
import { ga4 } from "../campaign-v2/integrations/adapters/ga4.ts";
import { loaderSnippet } from "../campaign-v2/integrations/loader.ts";
import { buildJsonLd, jsonLdScript, verificationMeta, MAIN_SITE_URL } from "../campaign-v2/integrations/seo.ts";
import { eventFromElement } from "../campaign-v2/integrations/dom.ts";
import { pending } from "../campaign-v2/kit/pending.ts";
import panchakarma from "../campaign-v2/campaigns/panchakarma.ts";

const clone = (o) => JSON.parse(JSON.stringify(o));
const filled = () => {
  const s = clone(DEFAULT_SLOTS);
  s.enabled = true;
  s.ga4.measurementId = "G-TEST123";
  s.googleAds.conversionId = "AW-TEST1";
  s.meta.pixelId = "META-TEST";
  s.clarity.projectId = "clartest";
  s.bing.uetTagId = "UET-TEST";
  s.linkedin.partnerId = "LI-TEST";
  s.tiktok.pixelId = "TT-TEST";
  s.gtm.containerId = "GTM-TEST";
  return s;
};
const memStorage = (init = {}) => {
  const m = new Map(Object.entries(init));
  return { getItem: (k) => (m.has(k) ? m.get(k) : null), setItem: (k, v) => m.set(k, String(v)), _m: m };
};
const fakeAdapter = (id, consentMode, calls) => ({
  id, consentMode, enabled: () => true, load: () => "", send: (e, p) => calls.push([id, e, p]),
});

// ---- slots ----
test("slots: every ID is empty by default and the master switch needs AHV_ANALYTICS=1 + AHV_STAGING=0", () => {
  const walk = (o, path = "") => {
    for (const [k, v] of Object.entries(o)) {
      if (typeof v === "string") assert.equal(v, "", `${path}${k} must be empty`);
      else if (v && typeof v === "object") walk(v, `${path}${k}.`);
    }
  };
  walk(DEFAULT_SLOTS);
  assert.equal(buildSlots({}).enabled, false);
  assert.equal(buildSlots({ AHV_ANALYTICS: "1" }).enabled, false);
  assert.equal(buildSlots({ AHV_ANALYTICS: "1", AHV_STAGING: "1" }).enabled, false);
  assert.equal(buildSlots({ AHV_ANALYTICS: "1", AHV_STAGING: "0" }).enabled, true);
  assert.equal(typeof INTEGRATIONS.enabled, "boolean");
});

test("slots: NEXT_PUBLIC_LP_<TOOL>_<FIELD> env vars win over the empty defaults", () => {
  const s = buildSlots({
    NEXT_PUBLIC_LP_GA4_MEASUREMENTID: "G-ENV",
    NEXT_PUBLIC_LP_GOOGLEADS_CONVERSIONID: "AW-ENV",
    NEXT_PUBLIC_LP_GOOGLEADS_LABELS_GENERATE_LEAD: "lbl",
    NEXT_PUBLIC_LP_VERIFICATION_GOOGLE: "gv",
    NEXT_PUBLIC_LP_CHAT_OPENONLOAD: "1",
  });
  assert.equal(s.ga4.measurementId, "G-ENV");
  assert.equal(s.googleAds.conversionId, "AW-ENV");
  assert.equal(s.googleAds.labels.generate_lead, "lbl");
  assert.equal(s.googleAds.labels.whatsapp_click, "");
  assert.equal(s.verification.google, "gv");
  assert.equal(s.chat.openOnLoad, true);
});

test("no known live ID is active anywhere in the integrations code", () => {
  const files = ["slots.ts", "track.ts", "loader.ts", "seo.ts", "events.ts", "dom.ts", "chat.ts",
    "adapters/ga4.ts", "adapters/googleAds.ts", "adapters/meta.ts", "adapters/clarity.ts", "adapters/bing.ts", "adapters/linkedin.ts", "adapters/tiktok.ts"];
  for (const f of files) {
    const src = readFileSync(new URL(`../campaign-v2/integrations/${f}`, import.meta.url), "utf8");
    for (const id of ["G-PZBX8G4Y9N", "AW-972059125", "fqrBCJvyugcQ9ePBzwM", "1305161823266727", "rf5s9ugok4"]) {
      assert.ok(!src.includes(id), `${f} contains ${id}`);
    }
  }
});

// ---- events ----
test("EVENTS: the catalogue is complete, well-formed and has no PII-ish params", () => {
  const expected = ["cta_click", "form_start", "form_step_complete", "form_error", "form_submit_attempt", "generate_lead",
    "form_submit_failed", "channel_select", "channel_handoff", "chat_open", "chat_message", "chat_lead", "film_play",
    "gallery_open", "currency_change", "locale_change", "scroll_depth"];
  assert.deepEqual(Object.keys(EVENTS).sort(), [...expected].sort());
  for (const [name, spec] of Object.entries(EVENTS)) {
    assert.match(name, /^[a-z][a-z0-9_]*$/);
    assert.ok(Array.isArray(spec.params) && spec.params.length > 0, name);
    assert.equal(new Set(spec.params).size, spec.params.length, `${name} duplicate params`);
    assert.ok(spec.description.length > 5, name);
    for (const p of spec.params) {
      assert.match(p, /^[a-z][a-z0-9_]*$/);
      assert.ok(!/email|phone|name|message|health|condition|dob/i.test(p), `${name}.${p}`);
    }
  }
  assert.equal(isEventName("cta_click"), true);
  assert.equal(isEventName("toString"), false);
  assert.equal(isEventName("nope"), false);
});

test("every Google Ads label key is reachable from a catalogue event", () => {
  const keys = new Set([
    adsLabelKey("generate_lead", {}), adsLabelKey("channel_handoff", {}), adsLabelKey("chat_open", {}),
    adsLabelKey("cta_click", { cta: "whatsapp" }), adsLabelKey("cta_click", { cta: "call" }), adsLabelKey("cta_click", { cta: "consult" }),
  ]);
  assert.deepEqual([...keys].sort(), Object.keys(DEFAULT_SLOTS.googleAds.labels).sort());
  assert.equal(adsLabelKey("scroll_depth", { percent: 50 }), undefined);
});

// ---- track ----
test("track: drops undeclared params and PII-looking values", () => {
  assert.deepEqual(cleanParams("cta_click", { cta: "consult", position: "hero", email: "a@b.co", extra: "x" }), { cta: "consult", position: "hero" });
  assert.deepEqual(cleanParams("channel_handoff", { channel: "someone@example.com", ref: "+91 95551 56156" }), {});
  assert.deepEqual(cleanParams("generate_lead", { form_id: "enquiry", transaction_id: "123e4567-e89b-12d3-a456-426614174000", ref: "KT-4821" }),
    { form_id: "enquiry", transaction_id: "123e4567-e89b-12d3-a456-426614174000", ref: "KT-4821" });
  assert.deepEqual(cleanParams("scroll_depth", { percent: 90 }), { percent: 90 });
  assert.equal(looksLikePii("9555156156"), true);
  assert.equal(looksLikePii("call me on +44 20 7946 0958"), true);
  assert.equal(looksLikePii(9555156156), true);
  assert.equal(looksLikePii("4x01PtWfNnk"), false);
  assert.equal(looksLikePii("whatsapp"), false);
  assert.deepEqual(cleanParams("cta_click", { cta: { nested: 1 }, position: "x".repeat(500) }), {});
});

test("track: pushes to dataLayer, calls enabled adapters, SSR-safe and never throws", () => {
  const calls = [];
  const w = { location: { search: "" }, __lpSlots: filled(), __ahvConsentRequired: false, localStorage: memStorage() };
  const t = createTracker({ getWindow: () => w, adapters: [fakeAdapter("a", true, calls), fakeAdapter("b", false, calls)], log: () => {} });
  const reached = t("cta_click", { cta: "consult", position: "hero", junk: 1 });
  assert.deepEqual(w.dataLayer, [{ event: "cta_click", cta: "consult", position: "hero" }]);
  assert.deepEqual(reached, ["a", "b"]);
  assert.deepEqual(calls, [["a", "cta_click", { cta: "consult", position: "hero" }], ["b", "cta_click", { cta: "consult", position: "hero" }]]);

  // unknown events are dropped entirely
  assert.deepEqual(t("not_an_event", {}), []);
  assert.equal(w.dataLayer.length, 1);

  // SSR: no window → no-op
  const ssr = createTracker({ getWindow: () => undefined, adapters: [fakeAdapter("a", true, calls)], log: () => {} });
  assert.deepEqual(ssr("cta_click", { cta: "consult" }), []);

  // a throwing adapter does not stop the next one, and track never throws
  const boom = { id: "boom", consentMode: true, enabled: () => true, load: () => "", send: () => { throw new Error("x"); } };
  const calls2 = [];
  const t2 = createTracker({ getWindow: () => w, adapters: [boom, fakeAdapter("ok", true, calls2)], log: () => {} });
  assert.deepEqual(t2("form_start", { form_id: "f" }), ["ok"]);
  const t3 = createTracker({ getWindow: () => { throw new Error("no"); }, adapters: [], log: () => {} });
  assert.doesNotThrow(() => t3("form_start", {}));
});

test("track: master switch off (no __lpSlots or enabled:false) → dataLayer only, no adapters", () => {
  const calls = [];
  const w1 = { location: { search: "" } };
  const t1 = createTracker({ getWindow: () => w1, adapters: [fakeAdapter("a", true, calls)], log: () => {} });
  assert.deepEqual(t1("cta_click", { cta: "ask" }), []);
  assert.equal(w1.dataLayer.length, 1);
  const w2 = { location: { search: "" }, __lpSlots: { ...filled(), enabled: false } };
  const t2 = createTracker({ getWindow: () => w2, adapters: [fakeAdapter("a", true, calls)], log: () => {} });
  assert.deepEqual(t2("cta_click", { cta: "ask" }), []);
  assert.equal(calls.length, 0);
});

test("track: EU/UK without a granted choice skips non-Consent-Mode adapters; GA4/Ads/dataLayer still receive", () => {
  const run = (w) => {
    const calls = [];
    const t = createTracker({ getWindow: () => w, adapters: [fakeAdapter("ga4", true, calls), fakeAdapter("meta", false, calls), fakeAdapter("clarity", false, calls)], log: () => {} });
    return t("cta_click", { cta: "whatsapp", position: "hero" });
  };
  const base = () => ({ location: { search: "" }, __lpSlots: filled() });
  assert.deepEqual(run({ ...base(), __ahvConsentRequired: true, localStorage: memStorage() }), ["ga4"]);
  assert.deepEqual(run({ ...base(), __ahvConsentRequired: true, localStorage: memStorage({ "kairali-consent-v1": JSON.stringify({ v: 1, granted: false }) }) }), ["ga4"]);
  assert.deepEqual(run({ ...base(), __ahvConsentRequired: true, localStorage: memStorage({ "kairali-consent-v1": "{broken" }) }), ["ga4"]);
  assert.deepEqual(run({ ...base(), __ahvConsentRequired: true, localStorage: memStorage({ "kairali-consent-v1": JSON.stringify({ v: 1, granted: true }) }) }), ["ga4", "meta", "clarity"]);
  // outside the consent region: everything, unless the visitor explicitly denied earlier
  assert.deepEqual(run({ ...base(), __ahvConsentRequired: false, localStorage: memStorage() }), ["ga4", "meta", "clarity"]);
  assert.deepEqual(run({ ...base(), __ahvConsentRequired: false, localStorage: memStorage({ "kairali-consent-v1": JSON.stringify({ v: 1, granted: false }) }) }), ["ga4"]);
  // the real adapter list marks exactly GA4 and Google Ads as Consent-Mode governed
  assert.deepEqual(ADAPTERS.filter((a) => a.consentMode).map((a) => a.id), ["ga4", "googleAds"]);
  assert.deepEqual(ADAPTERS.filter((a) => !a.consentMode).map((a) => a.id), ["meta", "clarity", "bing", "linkedin", "tiktok"]);
});

test("track: ?lp_debug=1 logs [lp-track] lines even when tracking is off", () => {
  const lines = [];
  const w = { location: { search: "?utm_source=x&lp_debug=1" } };
  const t = createTracker({ getWindow: () => w, adapters: [], log: (l) => lines.push(l) });
  t("cta_click", { cta: "consult", position: "hero" });
  assert.deepEqual(lines, ['[lp-track] cta_click {"cta":"consult","position":"hero"} → []']);
  const quiet = [];
  createTracker({ getWindow: () => ({ location: { search: "" } }), adapters: [], log: (l) => quiet.push(l) })("cta_click", { cta: "ask" });
  assert.equal(quiet.length, 0);
});

// ---- adapters ----
test("adapters: every adapter is a no-op with empty slots", () => {
  const s = clone(DEFAULT_SLOTS);
  const calls = [];
  const spy = (...a) => calls.push(a);
  const w = { gtag: spy, fbq: spy, clarity: spy, uetq: { push: spy }, lintrk: spy, ttq: { track: spy }, localStorage: memStorage() };
  for (const a of ADAPTERS) {
    assert.equal(a.enabled(s), false, a.id);
    assert.equal(a.load(s), "", a.id);
    a.send("generate_lead", { form_id: "f", transaction_id: "tok-1" }, s, w);
    a.send("cta_click", { cta: "whatsapp", position: "hero" }, s, w);
  }
  assert.equal(calls.length, 0);
});

test("googleAds: no-op without a label; sends with a label; de-dupes generate_lead on transaction_id", () => {
  const calls = [];
  const w = { __ahvConsentRequired: false, gtag: (...a) => calls.push(a), localStorage: memStorage() };
  const s = filled();
  googleAds.send("cta_click", { cta: "whatsapp", position: "hero" }, s, w);
  assert.equal(calls.length, 0, "no label → nothing");
  s.googleAds.labels.whatsapp_click = "waLabel";
  googleAds.send("cta_click", { cta: "whatsapp", position: "hero" }, s, w);
  assert.deepEqual(calls.pop(), ["event", "conversion", { send_to: "AW-TEST1/waLabel" }]);

  s.googleAds.labels.generate_lead = "leadLabel";
  googleAds.send("generate_lead", { form_id: "f" }, s, w);
  assert.equal(calls.length, 0, "generate_lead without a transaction_id never fires");
  googleAds.send("generate_lead", { form_id: "f", transaction_id: "tok-1" }, s, w);
  googleAds.send("generate_lead", { form_id: "f", transaction_id: "tok-1" }, s, w);
  assert.deepEqual(calls, [["event", "conversion", { send_to: "AW-TEST1/leadLabel", transaction_id: "tok-1" }]]);
  assert.ok(w.localStorage._m.get("ktahv-lead-conversions").includes("tok-1"));
  googleAds.send("generate_lead", { form_id: "f", transaction_id: "tok-2" }, s, w);
  assert.equal(calls.length, 2);
});

test("meta: generate_lead → Lead with eventID; other events → trackCustom; ga4 sends 1:1", () => {
  const calls = [];
  const w = { fbq: (...a) => calls.push(a), gtag: (...a) => calls.push(a) };
  const s = filled();
  meta.send("generate_lead", { form_id: "f", transaction_id: "tok-9" }, s, w);
  meta.send("film_play", { kind: "patient", youtube_id: "abc" }, s, w);
  ga4.send("film_play", { kind: "patient", youtube_id: "abc" }, s, w);
  assert.deepEqual(calls, [
    ["track", "Lead", {}, { eventID: "tok-9" }],
    ["trackCustom", "film_play", { kind: "patient", youtube_id: "abc" }],
    ["event", "film_play", { kind: "patient", youtube_id: "abc", send_to: "G-TEST123" }],
  ]);
});

// ---- loader ----
const THIRD_PARTY = /googletagmanager\.com|connect\.facebook\.net|clarity\.ms|bat\.bing\.com|licdn\.com|tiktok\.com/;

test("loader: empty slots produce no third-party URL", () => {
  const out = loaderSnippet({ ...clone(DEFAULT_SLOTS), enabled: true });
  assert.doesNotMatch(out, THIRD_PARTY);
  assert.match(out, /window\.__lpSlots=/);
});

test("loader: filled slots produce each tool, configs, and EU gating for non-Consent-Mode tools", () => {
  const out = loaderSnippet(filled());
  assert.match(out, /googletagmanager\.com\/gtag\/js/);
  assert.match(out, /gtag\('config',"G-TEST123"\)/);
  assert.match(out, /gtag\('config',"AW-TEST1"\)/);
  assert.match(out, /googletagmanager\.com\/gtm\.js/);
  assert.match(out, /connect\.facebook\.net/);
  assert.match(out, /fbq\('init',"META-TEST"\)/);
  assert.match(out, /clarity\.ms\/tag/);
  assert.match(out, /bat\.bing\.com/);
  assert.match(out, /snap\.licdn\.com/);
  assert.match(out, /analytics\.tiktok\.com/);
  assert.match(out, /__ahvConsentRequired/);
  assert.match(out, /kairali-consent-v1/);
  assert.match(out, /setInterval\(/);
  // gtag.js / GTM sit outside the gated run(); Meta sits inside it
  const gate = out.indexOf("function run(){");
  assert.ok(out.indexOf("gtag/js") < gate && out.indexOf("gtm.js") < gate && out.indexOf("fbevents.js") > gate);
  // only GA4 → gtag.js but no Meta
  const s = clone(DEFAULT_SLOTS); s.enabled = true; s.ga4.measurementId = "G-ONLY";
  const only = loaderSnippet(s);
  assert.match(only, /gtag\/js/);
  assert.doesNotMatch(only, /connect\.facebook|clarity\.ms|bat\.bing|licdn\.com|tiktok\.com|gtm\.js/);
  // Ads only → gtag.js keyed on the AW id
  const a = clone(DEFAULT_SLOTS); a.googleAds.conversionId = "AW-ONLY";
  assert.match(loaderSnippet(a), /encodeURIComponent\("AW-ONLY"\)/);
});

test("loader: output contains no raw '<' even with hostile slot values; it parses as JS", () => {
  const s = filled();
  s.ga4.measurementId = "</script><script>alert(1)</script>";
  s.meta.pixelId = "<img>";
  s.chat.widgetId = "<b>";
  const out = loaderSnippet(s);
  assert.ok(!out.includes("<"), "raw < found");
  assert.doesNotThrow(() => new Function(out));
  assert.doesNotThrow(() => new Function(loaderSnippet(clone(DEFAULT_SLOTS))));
});

// ---- seo ----
test("seo: JSON-LD shapes for the pilot (clinic, FAQ without pending answers, films)", () => {
  const items = buildJsonLd(panchakarma, { locale: "en" });
  const types = items.map((i) => i["@type"]);
  assert.equal(types[0], "MedicalClinic");
  const clinic = items[0];
  assert.equal(clinic.url, `${MAIN_SITE_URL}/`);
  assert.equal(clinic.telephone, "+919555156156");
  assert.equal(clinic.address.postalCode, "678551");
  assert.equal(clinic.address.addressLocality, "Palakkad");
  assert.equal(clinic.address.addressRegion, "Kerala");
  assert.equal(clinic.address.streetAddress, "III/73 Palayamkadu, P.O. Olassery, Kodumbu");
  const faq = items.find((i) => i["@type"] === "FAQPage");
  const answeredCount = panchakarma.faq.filter((f) => typeof f.a === "string").length;
  assert.equal(faq.mainEntity.length, answeredCount);
  assert.ok(answeredCount < panchakarma.faq.length, "pilot has a pending answer to exclude");
  assert.ok(!JSON.stringify(faq).includes("__pending"));
  const videos = items.filter((i) => i["@type"] === "VideoObject");
  assert.equal(videos.length, 1 + panchakarma.films.more.length);
  for (const v of videos) {
    assert.match(v.thumbnailUrl, /^https:\/\/ayurvedichealingvillage\.com\/lp-v2\/img\/yt-/);
    assert.match(v.embedUrl, /^https:\/\/www\.youtube-nocookie\.com\/embed\//);
  }
  assert.ok(!types.includes("Offer"), "pilot offer is null");
  for (const i of items) assert.equal(i["@context"], "https://schema.org");
  JSON.parse(jsonLdScript(items));
});

test("seo: Offer only when a real offer exists; extraJsonLd appended; script escaping", () => {
  const offer = { name: "Monsoon", headline: "Save on 21 nights", termsUrl: "/offers/monsoon/", validFrom: "2026-06-01", validTo: "2026-09-30", source: "x" };
  const withOffer = { ...panchakarma, offer, extraJsonLd: [{ "@context": "https://schema.org", "@type": "HowTo", name: "</script>" }] };
  const items = buildJsonLd(withOffer, { locale: "de" });
  const o = items.find((i) => i["@type"] === "Offer");
  assert.equal(o.url, "https://ayurvedichealingvillage.com/offers/monsoon/");
  assert.equal(o.validThrough, "2026-09-30");
  assert.equal(items.at(-1)["@type"], "HowTo");
  assert.equal(items.find((i) => i["@type"] === "FAQPage").inLanguage, "de");
  const pendingOffer = buildJsonLd({ ...panchakarma, offer: pending("C9", "offer") }, { locale: "en" });
  assert.ok(!pendingOffer.some((i) => i["@type"] === "Offer"));
  const allPending = buildJsonLd({ ...panchakarma, faq: [{ q: "x", a: pending("C1", "y") }] }, { locale: "en" });
  assert.ok(!allPending.some((i) => i["@type"] === "FAQPage"));
  const script = jsonLdScript(items);
  assert.ok(!script.includes("<"));
  assert.equal(JSON.parse(script).at(-1).name, "</script>");
});

test("seo: MAIN_SITE_URL matches site.config.json domain", () => {
  const cfg = JSON.parse(readFileSync(new URL("../site.config.json", import.meta.url), "utf8"));
  assert.equal(MAIN_SITE_URL, `https://${cfg.domain}`);
});

test("verificationMeta: only filled entries", () => {
  assert.deepEqual(verificationMeta(DEFAULT_SLOTS), []);
  assert.deepEqual(verificationMeta({ verification: { google: "g1", bing: "", facebook: "f1" } }), [
    { name: "google-site-verification", content: "g1" },
    { name: "facebook-domain-verification", content: "f1" },
  ]);
});

// ---- dom ----
const fakeEl = (attrs, parent = null) => {
  const el = {
    attrs,
    getAttribute: (n) => (n in attrs ? attrs[n] : null),
    get attributes() { return Object.entries(attrs).map(([name, value]) => ({ name, value })); },
    closest(sel) {
      const names = sel.split(",").map((s) => s.slice(1, -1));
      for (let e = el; e; e = e.parent) if (names.some((n) => n in e.attrs)) return e;
      return null;
    },
    parent,
  };
  return el;
};

test("dom: data-track-* attributes become params; legacy data-cta maps to cta_click", () => {
  const btn = fakeEl({ "data-track": "cta_click", "data-track-cta": "consult", "data-track-position": "hero", class: "x" });
  assert.deepEqual(eventFromElement(fakeEl({}, btn)), { event: "cta_click", params: { cta: "consult", position: "hero" } });
  assert.deepEqual(eventFromElement(fakeEl({ "data-track": "film_play", "data-track-kind": "patient", "data-track-youtube-id": "abc" })),
    { event: "film_play", params: { kind: "patient", youtube_id: "abc" } });
  assert.deepEqual(eventFromElement(fakeEl({ "data-cta": "consult", "data-cta-position": "consult-bar" })),
    { event: "cta_click", params: { cta: "consult", position: "bar" } });
  assert.equal(eventFromElement(fakeEl({ class: "plain" })), null);
  assert.equal(eventFromElement(null), null);
});

// ---- fix round 1 (hardening) ----
import { consentAllowsNonCm, consentRequired } from "../campaign-v2/integrations/track.ts";
import { browserSlots } from "../campaign-v2/integrations/loader.ts";
import { installChatHooks } from "../campaign-v2/integrations/chat.ts";

test("consent fails closed: __ahvConsentRequired missing ⇒ required", () => {
  assert.equal(consentRequired({}), true);
  assert.equal(consentRequired({ __ahvConsentRequired: undefined }), true);
  assert.equal(consentRequired({ __ahvConsentRequired: true }), true);
  assert.equal(consentRequired({ __ahvConsentRequired: false }), false);
  assert.equal(consentAllowsNonCm({ localStorage: memStorage() }), false);
  const calls = [];
  const w = { location: { search: "" }, __lpSlots: filled(), localStorage: memStorage() };
  const t = createTracker({ getWindow: () => w, adapters: [fakeAdapter("ga4", true, calls), fakeAdapter("meta", false, calls), fakeAdapter("clarity", false, calls)], log: () => {} });
  assert.deepEqual(t("cta_click", { cta: "consult", position: "hero" }), ["ga4"]);
  // the loader's gate is fail-closed too
  const out = loaderSnippet(filled());
  assert.match(out, /w\.__ahvConsentRequired===false/);
  assert.doesNotMatch(out, /!w\.__ahvConsentRequired/);
});

test("__lpSlots carries only browser-needed values; never capiEndpoint or verification", () => {
  const s = filled();
  s.meta.capiEndpoint = "https://capi.example.internal/hook";
  s.verification.google = "gv-secretish";
  s.chat.provider = "chatbase"; s.chat.widgetId = "w1"; s.chat.openOnLoad = true;
  s.googleAds.labels.generate_lead = "leadLabel";
  const out = loaderSnippet(s);
  assert.ok(!out.includes("capiEndpoint"));
  assert.ok(!out.includes("capi.example.internal"));
  assert.ok(!out.includes("gv-secretish"));
  const b = browserSlots(s);
  assert.deepEqual(Object.keys(b.meta), ["pixelId"]);
  assert.equal(b.verification, undefined);
  assert.equal(b.googleAds.labels.generate_lead, "leadLabel");
  assert.deepEqual(b.chat, { provider: "chatbase", widgetId: "w1", openOnLoad: true });
  assert.equal(b.enabled, true);
  // the browser slots still drive every adapter
  for (const a of ADAPTERS) assert.equal(a.enabled(b), a.enabled(s), a.id);
});

test("googleAds dedupe: localStorage only when consent not required or granted; memory otherwise", () => {
  const s = filled();
  s.googleAds.labels.generate_lead = "leadLabel";
  const KEY = "ktahv-lead-conversions";
  // EU, no record → no localStorage write, but still de-duped in memory for the page view
  const calls = [];
  const eu = { __ahvConsentRequired: true, gtag: (...a) => calls.push(a), localStorage: memStorage() };
  googleAds.send("generate_lead", { form_id: "f", transaction_id: "tok-eu" }, s, eu);
  googleAds.send("generate_lead", { form_id: "f", transaction_id: "tok-eu" }, s, eu);
  assert.equal(calls.length, 1);
  assert.equal(eu.localStorage._m.has(KEY), false);
  // missing flag fails closed the same way
  const unk = { gtag: () => {}, localStorage: memStorage() };
  googleAds.send("generate_lead", { form_id: "f", transaction_id: "tok-unk" }, s, unk);
  assert.equal(unk.localStorage._m.has(KEY), false);
  // EU with a granted record → persisted
  const euOk = { __ahvConsentRequired: true, gtag: () => {}, localStorage: memStorage({ "kairali-consent-v1": JSON.stringify({ v: 1, granted: true }) }) };
  googleAds.send("generate_lead", { form_id: "f", transaction_id: "tok-g" }, s, euOk);
  assert.ok(euOk.localStorage._m.get(KEY).includes("tok-g"));
  // outside the consent region → persisted
  const row = { __ahvConsentRequired: false, gtag: () => {}, localStorage: memStorage() };
  googleAds.send("generate_lead", { form_id: "f", transaction_id: "tok-row" }, s, row);
  assert.ok(row.localStorage._m.get(KEY).includes("tok-row"));
});

test("installChatHooks returns a cleanup that removes window.lpChat", () => {
  const had = Object.hasOwn(globalThis, "window");
  if (!had) globalThis.window = {};
  try {
    const off = installChatHooks();
    assert.equal(typeof window.lpChat?.onChatOpen, "function");
    off();
    assert.equal(window.lpChat, undefined);
  } finally {
    if (!had) delete globalThis.window;
  }
});
