// Live ad routes, batch 1 (/ayurvedic-treatment-packages.html, /panchkarma-treatment.html) on the campaign-v2 kit:
// the production form, measurement and chat contracts are the ones the pages they replace already used.
// Every request is intercepted: no network, no real lead.
import { test } from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { PRODUCTION_CAMPAIGN_FORM, resolveSchema, validateStep, fullCampaignPhone, MESSAGES, CONSENT_FIELD } from "../campaign-v2/forms/schema.ts";
import {
  productionLeadAdapter, buildProductionLead, urlAttribution, PRODUCTION_MESSAGES, keepTokenAfterEdit, getAdapter, leadApiAdapter,
} from "../campaign-v2/forms/adapter.ts";
import { validationProblem } from "../lib/lead-validation.ts";
import { validCampaignPhone } from "../lib/campaign-phone.ts";
import { createTracker, PRODUCTION_INTERACTIONS, isProductionSurface } from "../campaign-v2/integrations/track.ts";
import { interactionForLink, openExistingChatChoices, CONTACT_DIALOG_ID } from "../campaign-v2/production/interaction-map.ts";
import { withoutPrefillParams } from "../campaign-v2/sections/interactive/consult-prefill.ts";
import { productionCampaign, PRODUCTION_SLUGS } from "../campaign-v2/production/load.ts";
import { ROUTES } from "../campaign-v2/production/bindings.ts";

const SITE = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const read = (p) => fs.readFileSync(path.join(SITE, p), "utf8");
const NOW = new Date(Date.UTC(2026, 9, 7));
const S = resolveSchema(PRODUCTION_CAMPAIGN_FORM, { campaign: { programDefault: "" }, locale: "en", now: NOW });
const TOKEN = "00000000-0000-4000-8000-000000000000";
const PACKAGES = ROUTES["treatment-packages"].productionForm;
const valid = (over = {}) => ({ fullName: "Asha Menon", email: "asha@example.com", dialCode: "+91", phone: "98470 12345", message: "", [CONSENT_FIELD]: true, marketing: false, honeypot: "", channel: "whatsapp", ...over });
const ENV = {
  location: {
    origin: "https://ayurvedichealingvillage.com", pathname: "/ayurvedic-treatment-packages.html",
    // ad click values, a numeric Google value, and personal values that must never be forwarded
    search: "?gclid=Cj0KCQ_abc&utm_source=google&utm_medium=cpc&utm_campaign=Brand%20%26%20Competition&utm_term=ayurveda%20packages&gad_source=1&name=Asha&email=asha%40example.com",
  },
  referrer: "https://www.google.com/search?q=ayurveda&email=asha@example.com",
};
const json = (status, body) => async (url, init) => { json.last = { url, init }; return new Response(JSON.stringify(body), { status, headers: { "content-type": "application/json" } }); };
const ctx = (fetchImpl, over = {}) => ({
  schema: S, campaign: { tracking: { campaignName: "treatment-packages", trackId: "" } }, variant: "A", locale: "en", token: TOKEN,
  tracking: {}, pageUrl: "https://ayurvedichealingvillage.com/ayurvedic-treatment-packages.html", referrer: "", fetch: fetchImpl,
  production: PACKAGES, env: ENV, timeoutMs: 200, ...over,
});

// ── the form ──────────────────────────────────────────────────────────────────────────────────────────
test("form: name, email and a phone with its country code are required; message optional; consent required", () => {
  assert.deepEqual(validateStep(S, 0, valid(), "whatsapp"), []);
  assert.deepEqual(validateStep(S, 0, valid({ phone: "" }), "whatsapp").map((e) => [e.field, e.code]), [["phone", "phone"]]);
  assert.deepEqual(validateStep(S, 0, valid({ fullName: " " }), "whatsapp").map((e) => e.field), ["fullName"]);
  assert.deepEqual(validateStep(S, 0, valid({ email: "asha@" }), "whatsapp").map((e) => [e.field, e.code]), [["email", "email"]]);
  assert.deepEqual(validateStep(S, 0, valid({ [CONSENT_FIELD]: false }), "whatsapp").map((e) => e.field), [CONSENT_FIELD]);
  assert.deepEqual(validateStep(S, 0, valid({ message: "x".repeat(3001) }), "whatsapp").map((e) => [e.field, e.code]), [["message", "too_long"]]);
  assert.deepEqual(validateStep(S, 0, valid({ fullName: "x".repeat(121) }), "whatsapp").map((e) => [e.field, e.code]), [["fullName", "too_long"]]);
});

test("form: the phone passes the lead API's own campaign-phone rule before anything is sent", () => {
  const errs = (v) => validateStep(S, 0, valid(v), "whatsapp").map((e) => e.field);
  assert.deepEqual(errs({ phone: "12345" }), ["phone"]);                       // too short
  assert.deepEqual(errs({ phone: "98765 43210" }), ["phone"]);                 // the API's rejected sequence
  assert.deepEqual(errs({ dialCode: "91" }), ["dialCode"]);                    // country code needs "+"
  assert.deepEqual(errs({ dialCode: "+44", phone: "7700 900123" }), []);       // international
  assert.deepEqual(errs({ dialCode: "+91", phone: "+971 50 123 4567" }), []);  // own "+" number wins
  assert.equal(fullCampaignPhone(valid()), "+91 98470 12345");
  assert.equal(fullCampaignPhone(valid({ phone: "+971 50 123 4567" })), "+971 50 123 4567");
  assert.equal(fullCampaignPhone(valid({ phone: "098470 12345" })), "+91 98470 12345"); // trunk 0 dropped, as the API does
  for (const v of [valid(), valid({ dialCode: "+44", phone: "7700 900123" })]) assert.ok(validCampaignPhone(fullCampaignPhone(v)));
  assert.equal(MESSAGES.phone.length > 0, true);
});

test("form: labels of the phone pair are the replaced form's own; no health question", () => {
  const f = Object.fromEntries(S.steps[0].fields.map((x) => [x.name, x]));
  assert.deepEqual(S.steps[0].fields.map((x) => x.name), ["fullName", "email", "dialCode", "phone", "message"]);
  assert.equal(f.dialCode.label, "Country code");
  assert.equal(f.dialCode.defaultValue, "+91");
  assert.equal(f.phone.label, "Phone / WhatsApp");
  assert.equal(f.phone.hint, "Change +91 for your country.");
  assert.equal(f.phone.required, true);
  assert.ok(!S.steps[0].fields.some((x) => /health|condition|medic|diagnos/i.test(x.label)));
});

// ── the request ───────────────────────────────────────────────────────────────────────────────────────
test("request: the replaced form's exact body; only allow-listed attribution leaves the page", () => {
  const body = buildProductionLead(valid(), { token: TOKEN, locale: "en", production: PACKAGES, env: ENV });
  assert.deepEqual(body, {
    form: "landing-page",
    company: "",
    submissionToken: TOKEN,
    site_language: "en",
    lead_source_url: "https://ayurvedichealingvillage.com/ayurvedic-treatment-packages.html?gclid=Cj0KCQ_abc&utm_source=google&utm_medium=cpc&utm_campaign=Brand+%26+Competition&utm_term=ayurveda+packages",
    referrer: "https://www.google.com/",
    gclid: "Cj0KCQ_abc", utm_source: "google", utm_medium: "cpc", utm_campaign: "Brand & Competition", utm_term: "ayurveda packages",
    fields: {
      landing_page_path: "/ayurvedic-treatment-packages.html",
      form_variant: "r10-ayurvedic-treatment-packages",
      campaign_name: "Brand & Competition",
      utm_keyword: "ayurveda packages",
      fname: "Asha Menon", rdogender: "", email: "asha@example.com", phone: "+91 98470 12345", message: "", consent: true,
    },
  });
  const s = JSON.stringify(body);
  assert.ok(!/name=Asha|email=|gad_source|#/.test(body.lead_source_url));
  assert.ok(!s.includes("search?q="));
});

test("request: consent-aware attribution from the site runtime wins; a failing runtime falls back to the URL", () => {
  const withBridge = buildProductionLead(valid(), { token: TOKEN, locale: "en", production: PACKAGES, env: { ...ENV, attribution: () => ({ gclid: "FROM-RUNTIME" }) } });
  assert.equal(withBridge.lead_source_url, "https://ayurvedichealingvillage.com/ayurvedic-treatment-packages.html?gclid=FROM-RUNTIME");
  assert.equal(withBridge.gclid, "FROM-RUNTIME");
  assert.equal(withBridge.utm_source, undefined);
  const broken = buildProductionLead(valid(), { token: TOKEN, locale: "en", production: PACKAGES, env: { ...ENV, attribution: () => { throw new Error("x"); } } });
  assert.equal(broken.gclid, "Cj0KCQ_abc");
  assert.deepEqual(urlAttribution("?gclid=bad%20value&gclid=good_one&utm_source=&utm_source=bing"), { gclid: "good_one", utm_source: "bing" });
});

test("request: the lead API's own validation accepts the built fields (both routes)", () => {
  for (const slug of PRODUCTION_SLUGS) {
    const b = ROUTES[slug];
    const body = buildProductionLead(valid({ message: "Preferred month: November 2026\nLength of stay: 14 nights\n" }), {
      token: TOKEN, locale: "en", production: b.productionForm, env: { ...ENV, location: { ...ENV.location, pathname: b.route } },
    });
    assert.equal(validationProblem("landing-page", { ...body.fields }), null, slug);
    assert.equal(body.fields.landing_page_path, b.route);
  }
});

test("request: the kit honeypot reaches the API's own guard as `company` (server-side rejection, never stored)", () => {
  const body = buildProductionLead(valid({ honeypot: "Acme Trading" }), { token: TOKEN, locale: "en", production: PACKAGES, env: ENV });
  assert.equal(body.company, "Acme Trading");
  const route = read("app/api/lead/route.ts");
  assert.match(route, /table === 'landing-page' && typeof body\.company === 'string' && body\.company\.trim\(\)/);
  assert.match(read("campaign-v2/sections/interactive/EnquiryForm.tsx"), /name="lp_hp_ref"/);
});

// ── the response ──────────────────────────────────────────────────────────────────────────────────────
test("adapter: success only on 200 + ok:true + received; one POST to /api/lead/ as JSON; guide only where the route had it", async () => {
  let n = 0;
  const ok = async (url, init) => { n++; ok.last = { url, init }; return new Response(JSON.stringify({ ok: true, status: "received", guideUrl: "/documents/kairali-guide.pdf" }), { status: 200 }); };
  const r = await productionLeadAdapter.submit(valid(), ctx(ok));
  assert.deepEqual(r, { status: "received", ref: "", token: TOKEN, guideUrl: "/documents/kairali-guide.pdf" });
  assert.equal(n, 1);
  assert.equal(ok.last.url, "/api/lead/");
  assert.equal(ok.last.init.method, "POST");
  assert.equal(ok.last.init.credentials, "same-origin");
  assert.equal(ok.last.init.cache, "no-store");
  assert.equal(ok.last.init.headers["Content-Type"], "application/json");
  assert.deepEqual(JSON.parse(ok.last.init.body), buildProductionLead(valid(), { token: TOKEN, locale: "en", production: PACKAGES, env: ENV }));
  const noGuide = await productionLeadAdapter.submit(valid(), ctx(ok, { production: ROUTES.panchakarma.productionForm }));
  assert.equal(noGuide.guideUrl, undefined);
  const offSite = await productionLeadAdapter.submit(valid(), ctx(json(200, { ok: true, status: "received", guideUrl: "//evil.example/x.pdf" })));
  assert.equal(offSite.status, "received");
  assert.equal(offSite.guideUrl, undefined);
});

test("adapter: every failure keeps the replaced form's words and never reports success", async () => {
  const cases = [
    [json(200, { status: "received" }), "invalid", PRODUCTION_MESSAGES.unconfirmed],
    [json(503, { ok: false, code: "LEAD_STORE_NOT_CONFIGURED" }), "not_configured", PRODUCTION_MESSAGES.notConnected],
    [json(429, { ok: false, code: "RATE_LIMITED" }), "rate_limited", PRODUCTION_MESSAGES.retry],
    [json(502, { ok: false, code: "STORE_FAILED" }), "invalid", PRODUCTION_MESSAGES.unconfirmed],
    [json(400, { ok: false, code: "INVALID_SUBMISSION" }), "invalid", PRODUCTION_MESSAGES.unconfirmed],
    [async () => { throw new TypeError("Failed to fetch"); }, "network", PRODUCTION_MESSAGES.network],
    [() => new Promise(() => {}), "network", PRODUCTION_MESSAGES.network], // never answers: timed out
  ];
  for (const [f, code, message] of cases) {
    const r = await productionLeadAdapter.submit(valid(), ctx(f));
    assert.equal(r.status, "error");
    assert.equal(r.code, code);
    assert.equal(r.message, message);
  }
  const sheet = await productionLeadAdapter.submit(valid(), ctx(json(502, { ok: false, code: "SHEET_SYNC_FAILED" })));
  assert.equal(keepTokenAfterEdit(sheet), true); // the row is stored: the retry must reuse the token
  const store = await productionLeadAdapter.submit(valid(), ctx(json(502, { ok: false, code: "STORE_FAILED" })));
  assert.equal(keepTokenAfterEdit(store), false);
});

test("adapter: registered as ahv-production; without the route's identity nothing is sent", async () => {
  assert.equal(getAdapter("ahv-production"), productionLeadAdapter);
  assert.equal(getAdapter("unknown"), leadApiAdapter);
  let called = false;
  const r = await productionLeadAdapter.submit(valid(), ctx(async () => { called = true; return new Response("{}"); }, { production: undefined }));
  assert.equal(r.status, "error");
  assert.equal(called, false);
});

test("routes keep their existing lead identity and use the production form and adapter", () => {
  assert.deepEqual(ROUTES["treatment-packages"].productionForm, { formVariant: "r10-ayurvedic-treatment-packages", downloadGuide: true });
  assert.deepEqual(ROUTES.panchakarma.productionForm, { formVariant: "r10-panchakarma", downloadGuide: false });
  for (const slug of PRODUCTION_SLUGS) {
    const c = productionCampaign(slug);
    assert.equal(c.form.adapterId, "ahv-production");
    assert.equal(c.form.schema, PRODUCTION_CAMPAIGN_FORM);
    assert.deepEqual(c.productionForm, ROUTES[slug].productionForm);
  }
});

test("no-JS: the production enquiry posts to /api/forms-unavailable (never reads the body); previews keep /api/lead/", () => {
  const src = read("campaign-v2/sections/interactive/EnquiryForm.tsx");
  assert.match(src, /action=\{production \? "\/api\/forms-unavailable" : "\/api\/lead\/"\}/);
  assert.match(src, /tracking: production \? \{\} : readTracking\(\)/); // no sessionStorage write on the live routes
  assert.match(read("app/api/forms-unavailable/route.ts"), /Never parse or forward the body/);
});

// ── measurement ───────────────────────────────────────────────────────────────────────────────────────
function fakeWindow(surface) {
  const calls = [];
  const sent = [];
  const w = {
    dataLayer: [],
    location: { search: "" },
    document: { documentElement: { getAttribute: (n) => (n === "data-lp-surface" ? surface : null) } },
    AHV_MEASUREMENT: { recordInteraction: (name, target) => { calls.push([name, target]); return true; } },
    __lpSlots: { enabled: true },
  };
  const adapter = { id: "fake", consentMode: true, enabled: () => true, load: () => "", send: (e) => sent.push(e) };
  const track = createTracker({ getWindow: () => w, adapters: [adapter], log: () => {} });
  return { w, calls, sent, track };
}

test("measurement: on the live routes the site's consented runtime is the only sink; no dataLayer, no kit tags", () => {
  const { w, calls, sent, track } = fakeWindow("production");
  assert.equal(isProductionSurface(w), true);
  assert.deepEqual(track("form_start", { form_id: "lp-v2-live-campaign", variant: "A" }), ["ahv-measurement"]);
  assert.deepEqual(track("film_play", { kind: "patient", youtube_id: "iPARaMRASUs" }), ["ahv-measurement"]);
  assert.deepEqual(track("generate_lead", { form_id: "x", transaction_id: TOKEN, ref: "KT-1" }), []); // lead-receipt.js owns the lead
  assert.deepEqual(track("cta_click", { cta: "consult", position: "hero" }), []);
  assert.deepEqual(track("form_error", { form_id: "x", field: "phone", code: "phone" }), []);
  assert.deepEqual(calls, [["form_start", "enquiry"], ["video_open", "video"]]);
  assert.deepEqual(w.dataLayer, []);
  assert.deepEqual(sent, []);
  assert.deepEqual(Object.keys(PRODUCTION_INTERACTIONS).sort(), ["film_play", "form_start"]);
});

test("measurement: /lp-v2 previews are unchanged (dataLayer + adapters, no site runtime calls)", () => {
  const { w, calls, sent, track } = fakeWindow(null);
  assert.deepEqual(track("form_start", { form_id: "x", variant: "A" }), ["fake"]);
  assert.deepEqual(w.dataLayer, [{ event: "form_start", form_id: "x", variant: "A" }]);
  assert.deepEqual(sent, ["form_start"]);
  assert.deepEqual(calls, []);
});

test("measurement: the replaced page's interaction mapping, unchanged", () => {
  assert.deepEqual(interactionForLink("#enquiry", false), ["enquiry_open", "enquiry"]);
  assert.deepEqual(interactionForLink("tel:+919555156156", false), ["contact_click", "phone"]);
  assert.deepEqual(interactionForLink("mailto:info@kairali.com", false), ["contact_click", "email"]);
  assert.deepEqual(interactionForLink("https://wa.me/919289838797", false), ["contact_click", "whatsapp"]);
  assert.deepEqual(interactionForLink("https://www.google.com/maps/place/x", false), ["contact_click", "directions"]);
  assert.deepEqual(interactionForLink("/documents/pdf/rates.pdf", false), ["tariff_download", "tariff"]);
  assert.deepEqual(interactionForLink("https://www.youtube.com/watch?v=1s1gMtcpTME", false), ["video_open", "video"]);
  assert.deepEqual(interactionForLink("/panchakarma-therapy/", true), ["programme_open", "programme"]);
  assert.equal(interactionForLink("/panchakarma-therapy/", false), null);
  const old = read("app/(campaign)/ayurvedic-treatment-packages.html/GuestSupport.tsx");
  for (const s of ["href==='#enquiry'", "startsWith('tel:')", "startsWith('mailto:')", "includes('wa.me/')", "includes('google.com/maps/')", "includes('/pdf/')", "includes('youtube.com/')", "closest('#section-1,#section-6')"]) assert.ok(old.includes(s), s);
});

test("measurement: the lead event carries only the form type and the token (no health data to pixels)", () => {
  const receipt = read("public/design/lead-receipt.js");
  assert.match(receipt, /window\.AHV_MEASUREMENT\.recordLead\(request\.form, request\.token\)/);
  assert.match(receipt, /'landing-page': '\/ppc-thanks\/'/);
  const runtime = read("app/(english)/_families/consent-runtime.ts");
  assert.match(runtime, /#\(\?:enquiry\|main\|contact\|section-\[0-8\]\|written-testimonials\|press\)/);
});

test("measurement: every in-page anchor on the live routes is one the consent runtime measures", () => {
  const MEASURED = /^#(?:enquiry|main|contact|section-[0-8]|written-testimonials|press)$/;
  const files = ["campaign-v2/sections/Hero.tsx", "campaign-v2/sections/Doctors.tsx", "campaign-v2/production/FeePlan.tsx", "campaign-v2/sections/interactive/ConsultIntercept.tsx", "campaign-v2/sections/Header.tsx"];
  for (const f of files) {
    for (const m of read(f).matchAll(/href=(?:"|\{")(#[^"]*)"/g)) assert.match(m[1], MEASURED, `${f}: ${m[1]}`);
  }
  assert.match(read("campaign-v2/sections/Header.tsx"), /href=\{production \? "\/" : "#top"\}/);
  assert.match(read("campaign-v2/sections/interactive/ConsultIntercept.tsx"), /if \(production\) \{\s*window\.location\.hash = "enquiry";/);
  assert.equal(withoutPrefillParams("https://x.test/ayurvedic-treatment-packages.html?gclid=A&month=2026-11&length=14&utm_source=g#enquiry"), "/ayurvedic-treatment-packages.html?gclid=A&utm_source=g#enquiry");
  assert.equal(withoutPrefillParams("https://x.test/p.html?gclid=A"), null);
});

// ── chat ──────────────────────────────────────────────────────────────────────────────────────────────
test("chat: Ask Anything opens the site's existing choices (WhatsApp / Priya / Instagram / Messenger); never a new channel", () => {
  let clicked = 0;
  assert.equal(openExistingChatChoices({ querySelector: () => ({ click: () => clicked++ }), getElementById: () => null }), true);
  assert.equal(clicked, 1);
  let shown = 0, focused = 0;
  const dialog = { open: false, showModal: () => shown++, querySelector: () => ({ focus: () => focused++ }) };
  assert.equal(openExistingChatChoices({ querySelector: () => null, getElementById: (id) => (id === CONTACT_DIALOG_ID ? dialog : null) }), true);
  assert.deepEqual([shown, focused], [1, 1]);
  assert.equal(openExistingChatChoices({ querySelector: () => null, getElementById: () => null }), false);
  const chrome = read("public/design/review-chrome.js");
  for (const s of ['id = "ahv-contact-controls"', "https://wa.me/919289838797", "Chat with Priya", "ig.me/m/kairaliayurvedichealingvillage", "m.me/KairaliTheAyurvedicHealingVillage", 'b.className = "ahv-contact-trigger"']) assert.ok(chrome.includes(s), s);
  const hero = read("campaign-v2/sections/Hero.tsx");
  assert.match(hero, /production && c\.cta\?\.secondary/);
  assert.match(hero, /<AskAnythingButton /);
  assert.ok(!/ig\.me|m\.me|instagram\.com|facebook\.com/.test(read("campaign-v2/production/interaction-map.ts")));
});

// Headers can arrive successfully while the response body never completes.
test("production submission bounds a stalled response body and preserves the retry token", async () => {
  let signal;
  const fetchImpl = async (_url, init) => {
    signal = init.signal;
    return { ok: true, status: 200, json: () => new Promise(() => {}) };
  };
  let guard;
  try {
    const result = await Promise.race([
      productionLeadAdapter.submit(valid(), ctx(fetchImpl, { timeoutMs: 15 })),
      new Promise(resolve => { guard = setTimeout(() => resolve({ status: "hung" }), 500); }),
    ]);
    assert.equal(result.status, "error");
    assert.equal(result.code, "network");
    assert.equal(signal.aborted, true);
    assert.equal(keepTokenAfterEdit(result), true);
  } finally { clearTimeout(guard); }
});

test("production consent preserves the current legal acknowledgement and document links", () => {
  assert.equal(S.consentLabels.whatsapp, "I have read and agree to the privacy policy and terms");
  const form = read("campaign-v2/sections/interactive/EnquiryForm.tsx");
  assert.match(form, /href=\{production \? "\/new-privacy-policy\/" : privacyHref\}/);
  assert.match(form, /production \? <a[^>]+href="\/terms-and-conditions\/"/);
});
