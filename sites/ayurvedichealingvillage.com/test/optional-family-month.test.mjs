// LATER-006 / DEC-OPTIONAL-STAY-SELECTORS (owner decision: optional only, add only where absent).
// The family route gets ONE optional "Preferred month" select (blank default, then the shared next-six-months +
// Flexible list). A picked month travels in the existing fields.message as one extra line; an unanswered month leaves
// the request byte-identical to the R10 familyFields body. The receiver has no month column and is not changed.
// Packages and Panchakarma already ask month + length in their ConsultForm, so the default production form is untouched.
// Synthetic values only; no network, no real lead.

import { test } from "node:test";
import assert from "node:assert/strict";
import { productionCampaign } from "../campaign-v2/production/load.ts";
import { ROUTES } from "../campaign-v2/production/bindings.ts";
import {
  PRODUCTION_CAMPAIGN_FORM, FAMILY_DURATIONS, FLEXIBLE, monthOptions, resolveSchema, validateStep, CONSENT_FIELD,
} from "../campaign-v2/forms/schema.ts";
import { buildProductionLead, productionLeadAdapter, familyMessage } from "../campaign-v2/forms/adapter.ts";
import { validationProblem } from "../lib/lead-validation.ts";
import { normaliseCampaignPhone } from "../lib/campaign-phone.ts";

const FAMILY = "family-ayurvedic-retreat";
const NOW = new Date(Date.UTC(2026, 9, 10, 12)); // 10 Oct 2026 → Oct 2026 … Mar 2027 (current month first, AHV-WB.020), then Flexible
const TOKEN = "00000000-0000-4000-8000-000000000000";
const C = productionCampaign(FAMILY);
const FS = resolveSchema(C.form.schema, { campaign: C, locale: "en", now: NOW });
const field = (name) => FS.steps[0].fields.find((f) => f.name === name);
const fam = (over = {}) => ({
  fullName: "Test Visitor", rdogender: "", email: "visitor@example.com", dialCode: "+91", phone: "98470 12345",
  country: "India", duration: "", message: "", [CONSENT_FIELD]: true, marketing: false, honeypot: "", channel: "whatsapp", ...over,
});
const env = {
  location: { origin: "https://ayurvedichealingvillage.com", pathname: ROUTES[FAMILY].route, search: "?gclid=Cj0_test&utm_source=google&utm_medium=cpc&utm_campaign=Family%20Test&utm_term=family%20ayurveda&email=x%40example.com" },
  referrer: "https://www.google.com/search?q=test",
};
const ctx = (over = {}) => ({ token: TOKEN, locale: "en", production: C.productionForm, env, schema: FS, ...over });
// The R10 familyFields message, as the existing request built it (test/lp-v2-production-batch2.test.mjs r10Body).
const r10Message = (v) => `Country: ${String(v.country || "").trim()}\nPreferred duration: ${String(v.duration || "").trim()}\n${String(v.message || "").trim()}`;

test("schema: one optional family month select, blank default, the shared six months + Flexible", () => {
  const months = FS.steps[0].fields.filter((f) => /month/i.test(f.name) || /month/i.test(f.label));
  assert.equal(months.length, 1);
  const m = field("preferredMonth");
  assert.ok(m, "family form has a preferredMonth field");
  assert.deepEqual([m.type, m.label, m.required, m.defaultValue, m.mapsTo], ["select", "Preferred month", false, "", "message"]);
  assert.deepEqual(m.options, [{ value: "", label: "Select month" }, ...monthOptions({ locale: "en", now: NOW })]);
  assert.deepEqual(m.options.map((o) => o.value), ["", "2026-10", "2026-11", "2026-12", "2027-01", "2027-02", "2027-03", FLEXIBLE]);
  assert.equal(m.options.at(-1).label, "Flexible");
});

test("schema: every existing family field, its order, requiredness, limits and the DAYS choices are unchanged", () => {
  assert.deepEqual(FS.steps[0].fields.map((f) => f.name), ["fullName", "rdogender", "email", "dialCode", "phone", "country", "duration", "preferredMonth", "message"]);
  const d = field("duration");
  assert.deepEqual([d.type, d.label, d.required, d.defaultValue], ["select", "Preferred duration", false, ""]);
  assert.deepEqual(d.options, [...FAMILY_DURATIONS]);
  // Owner decision 22 (14 Oct 2026): nights, not days (AHV-LATER-010.02/.03); value = label, nothing else changes.
  assert.deepEqual(d.options.map((o) => o.value), ["", "7 nights", "14 nights", "21 nights"]);
  assert.deepEqual(d.options.map((o) => o.label), ["Select duration", "7 nights", "14 nights", "21 nights"]);
  assert.deepEqual([field("country").required, field("country").maxLength], [true, 100]);
  assert.deepEqual([field("message").required, field("message").maxLength, field("message").label], [false, 2700, "Any existing health conditions?"]);
  assert.equal(field("rdogender").required, false);
  for (const n of ["fullName", "email", "dialCode", "phone"]) {
    assert.deepEqual(C.form.schema.steps[0].fields.find((x) => x.name === n), PRODUCTION_CAMPAIGN_FORM.steps[0].fields.find((x) => x.name === n), n);
  }
  assert.equal(FS.id, "lp-v2-production-family");
  assert.equal(FS.genericNote, false);
  assert.equal(FS.consentLabels.whatsapp, "I have read and agree to the privacy policy and terms");
});

test("other owners unchanged: packages/panchakarma keep the default production form (no duplicate month); family stays without ConsultBar/prefill", () => {
  assert.equal(PRODUCTION_CAMPAIGN_FORM.steps[0].fields.some((f) => /month/i.test(f.name)), false);
  for (const slug of ["treatment-packages", "panchakarma"]) assert.equal(productionCampaign(slug).form.schema, PRODUCTION_CAMPAIGN_FORM, slug);
  assert.equal(ROUTES[FAMILY].consultBar, false);
  assert.equal(C.consultBar, false); // Enquiry.tsx: prefillEnabled = consultBar !== false → false
  assert.deepEqual(C.productionForm, { formVariant: "r10-family-retreat", downloadGuide: false, profile: "family-retreat" });
});

test("validation: blank, any listed month and Flexible pass; an unlisted value is rejected, never silently dropped", () => {
  const errs = (over) => validateStep(FS, 0, fam(over), "whatsapp").map((e) => [e.field, e.code]);
  assert.deepEqual(errs({}), []);
  assert.deepEqual(errs({ preferredMonth: "" }), []);
  for (const o of field("preferredMonth").options) assert.deepEqual(errs({ preferredMonth: o.value }), [], o.value);
  for (const bad of ["2020-01", "2027-05", "November 2026", "x"]) assert.deepEqual(errs({ preferredMonth: bad }), [["preferredMonth", "required"]], bad);
});

test("blank month: request byte-identical to the existing family body (with or without the schema)", () => {
  const cases = [
    fam(),
    fam({ rdogender: "Female", country: " Germany ", duration: "14 nights", message: " Lower back stiffness. " }),
    fam({ country: "x".repeat(100), duration: "21 nights", message: "y".repeat(2700) }),
  ];
  for (const values of cases) {
    const before = JSON.stringify(buildProductionLead(values, { token: TOKEN, locale: "en", production: C.productionForm, env }));
    for (const blank of [undefined, "", "   "]) {
      const v = blank === undefined ? values : { ...values, preferredMonth: blank };
      assert.equal(JSON.stringify(buildProductionLead(v, ctx())), before);
      assert.equal(JSON.stringify(buildProductionLead(v, ctx({ schema: undefined }))), before);
      assert.equal(familyMessage(v), r10Message(values));
      assert.equal(JSON.parse(before).fields.message, r10Message(values));
    }
  }
});

test("picked month: one 'Preferred month' line in the message; every other key identical", () => {
  const values = fam({ rdogender: "Male", duration: "14 nights", message: "Mild asthma" });
  const blank = buildProductionLead(values, ctx());
  const picked = buildProductionLead({ ...values, preferredMonth: "2027-01" }, ctx());
  assert.equal(picked.fields.message, "Country: India\nPreferred duration: 14 nights\nPreferred month: January 2027\nMild asthma");
  assert.deepEqual({ ...picked, fields: { ...picked.fields, message: blank.fields.message } }, blank);
  assert.deepEqual(Object.keys(picked), Object.keys(blank));
  assert.deepEqual(Object.keys(picked.fields), Object.keys(blank.fields));
  // routing, attribution, phone handling and form identity stay as they were
  for (const k of ["form_variant", "landing_page_path", "campaign_name", "utm_keyword", "phone", "rdogender", "consent", "fname", "email"]) {
    assert.equal(picked.fields[k], blank.fields[k], k);
  }
  assert.equal(picked.form, "landing-page");
  assert.equal(picked.lead_source_url, "https://ayurvedichealingvillage.com/family-ayurvedic-retreat-kerala.html?gclid=Cj0_test&utm_source=google&utm_medium=cpc&utm_campaign=Family+Test&utm_term=family+ayurveda");
  assert.equal(picked.fields.phone, normaliseCampaignPhone("+91 98470 12345")); // the existing phone rule, unchanged
  const flex = buildProductionLead({ ...values, preferredMonth: FLEXIBLE }, ctx());
  assert.equal(flex.fields.message, "Country: India\nPreferred duration: 14 nights\nPreferred month: Flexible\nMild asthma");
  assert.equal(validationProblem("landing-page", { ...picked.fields }), null);
});

test("malformed month: the body is never built (no silent drop, no raw value in the message)", () => {
  for (const bad of ["2020-01", "<script>", "January 2027"]) {
    assert.throws(() => buildProductionLead(fam({ preferredMonth: bad }), ctx()), /preferred month/i, bad);
  }
  // a picked month with no resolved schema to read its label from is refused too
  assert.throws(() => buildProductionLead(fam({ preferredMonth: "2027-01" }), ctx({ schema: undefined })), /preferred month/i);
});

test("synthetic receiver: the longest month label at the field maxima stays within message 3000 and passes validation", () => {
  let longest = "";
  for (let m = 0; m < 12; m++) {
    for (const o of monthOptions({ locale: "en", now: new Date(Date.UTC(2026, m, 15)) })) if (o.label.length > longest.length) longest = o.label;
  }
  assert.equal(longest.length, "September 2027".length); // the longest English month label
  const now = new Date(Date.UTC(2027, 3, 1)); // the list (April–September 2027, current month first) contains September 2027
  const S = resolveSchema(C.form.schema, { campaign: C, locale: "en", now });
  const sept = S.steps[0].fields.find((f) => f.name === "preferredMonth").options.find((o) => o.label === "September 2027");
  assert.ok(sept);
  const values = fam({ rdogender: "Female", country: "x".repeat(100), duration: "21 nights", message: "y".repeat(2700), preferredMonth: sept.value });
  assert.deepEqual(validateStep(S, 0, values, "whatsapp"), []);
  const body = buildProductionLead(values, ctx({ schema: S }));
  assert.ok(body.fields.message.length <= 3000, `${body.fields.message.length}`);
  assert.equal(validationProblem("landing-page", { ...body.fields }), null);
  assert.equal("month" in body.fields || "preferredMonth" in body.fields || "preferredMonth" in body, false); // no new receiver column
});

test("adapter: one same-origin POST carrying the month line; a malformed month sends nothing", async () => {
  let n = 0, last;
  const ok = async (url, init) => { n++; last = { url, init }; return new Response(JSON.stringify({ ok: true, status: "received" }), { status: 200 }); };
  const sub = (values) => productionLeadAdapter.submit(values, {
    schema: FS, campaign: { tracking: C.tracking }, variant: "A", locale: "en", token: TOKEN, tracking: {},
    pageUrl: "https://ayurvedichealingvillage.com/family-ayurvedic-retreat-kerala.html", referrer: "", fetch: ok,
    production: C.productionForm, env, timeoutMs: 200,
  });
  const values = fam({ duration: "7 nights", preferredMonth: "2026-12" });
  assert.deepEqual(await sub(values), { status: "received", ref: "", token: TOKEN });
  assert.equal(n, 1);
  assert.equal(last.url, "/api/lead/");
  assert.equal(last.init.body, JSON.stringify(buildProductionLead(values, ctx())));
  assert.match(JSON.parse(last.init.body).fields.message, /\nPreferred month: December 2026\n/);
  const r = await sub(fam({ preferredMonth: "1999-01" }));
  assert.equal(r.status, "error");
  assert.equal(r.code, "url");
  assert.equal(n, 1); // nothing sent
});

test("non-family routes ignore a month value: their bodies are unchanged", () => {
  for (const slug of ["treatment-packages", "panchakarma", "pain-management"]) {
    const production = ROUTES[slug].productionForm;
    const e = { ...env, location: { ...env.location, pathname: ROUTES[slug].route } };
    const values = fam({ message: "Hello" });
    const before = JSON.stringify(buildProductionLead(values, { token: TOKEN, locale: "en", production, env: e }));
    assert.equal(JSON.stringify(buildProductionLead({ ...values, preferredMonth: "2027-01" }, { token: TOKEN, locale: "en", production, env: e, schema: FS })), before, slug);
  }
});
