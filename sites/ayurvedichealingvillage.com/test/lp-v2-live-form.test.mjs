// Task 17: the live campaign enquiry form as the default schema; the 3-step form stays opt-in.
import { test } from "node:test";
import assert from "node:assert/strict";
import {
  LIVE_CAMPAIGN_FORM, THREE_STEP_FORM, DEFAULT_FORM, FORMS, DEFAULT_SCHEMA_ID, formSchemaFor,
  resolveSchema, validateStep, MESSAGES, LENGTHS, CHANNELS, monthOptions, programOptions, tooLongMessage,
} from "../campaign-v2/forms/schema.ts";
import { leadApiAdapter, toLeadAnswers, keepTokenAfterEdit, safeGuideUrl, MSG_NETWORK } from "../campaign-v2/forms/adapter.ts";
import { packMessage } from "../campaign-v2/kit/lead.ts";
import { refCode } from "../campaign-v2/kit/handoff.ts";
import { prefillLines, mergePrefill } from "../campaign-v2/sections/interactive/consult-prefill.ts";

const NOW = new Date(Date.UTC(2026, 9, 7));
const octx = { campaign: { programDefault: "Panchakarma" }, locale: "en", now: NOW };
const L = resolveSchema(LIVE_CAMPAIGN_FORM, octx);
const base = () => ({ fullName: "Asha Menon", email: "asha@example.com", phone: "+91 98765 43210", message: "", consent: true, marketing: false, honeypot: "", channel: "whatsapp" });
const TOKEN = "00000000-0000-4000-8000-000000000000";
const json = (status, body) => async () => new Response(JSON.stringify(body), { status, headers: { "content-type": "application/json" } });
function ctx(fetchImpl) {
  return { schema: L, campaign: { tracking: { campaignName: "Panchakarma 2026", trackId: "lp-pk" } }, variant: "A", locale: "en",
    token: TOKEN, tracking: { gclid: "TEST" }, pageUrl: "http://localhost:3000/lp-v2/panchakarma/a/", referrer: "", fetch: fetchImpl };
}

// ── registry ────────────────────────────────────────────────────────────────
test("registry: the default is the live campaign form; three-step is opt-in; custom schema wins", () => {
  assert.equal(DEFAULT_SCHEMA_ID, "live-campaign");
  assert.deepEqual(Object.keys(FORMS).sort(), ["live-campaign", "three-step"]);
  assert.equal(formSchemaFor(undefined), LIVE_CAMPAIGN_FORM);
  assert.equal(formSchemaFor({}), LIVE_CAMPAIGN_FORM);
  assert.equal(formSchemaFor({ schemaId: "live-campaign" }), LIVE_CAMPAIGN_FORM);
  assert.equal(formSchemaFor({ schemaId: "three-step" }), THREE_STEP_FORM);
  assert.equal(formSchemaFor({ schemaId: "nope" }), LIVE_CAMPAIGN_FORM);
  assert.equal(formSchemaFor({ schemaId: "__proto__" }), LIVE_CAMPAIGN_FORM);
  const custom = { ...THREE_STEP_FORM, id: "custom" };
  assert.equal(formSchemaFor({ schema: custom, schemaId: "live-campaign" }), custom);
  assert.equal(DEFAULT_FORM, THREE_STEP_FORM, "deprecated alias still points at the 3-step form");
});

// ── schema ──────────────────────────────────────────────────────────────────
test("LIVE_CAMPAIGN_FORM reproduces the live form: one step, four fields, verbatim copy", () => {
  assert.equal(L.steps.length, 1);
  const [s] = L.steps;
  assert.equal(s.title, "Request a consultation");
  assert.equal(s.intro, "Tell us how to reach you. Our patient care team can help you plan your visit.");
  assert.deepEqual(s.fields.map((f) => [f.name, f.type, f.mapsTo]), [
    ["fullName", "text", "fname"], ["email", "email", "email"], ["phone", "tel", "phone"], ["message", "textarea", "message"]]);
  assert.deepEqual(s.fields.map((f) => f.label), ["Your name", "Email", "Phone / WhatsApp (optional, include country code)", "How can we help? (optional)"]);
  assert.deepEqual(s.fields.map((f) => f.required), [true, true, false, false]);
  assert.deepEqual(s.fields.map((f) => f.maxLength), [120, 254, 30, 3000]);
  assert.equal(s.fields[2].pattern, "[+0-9() .-]{7,30}");
  assert.equal(s.fields[2].placeholder, "+91 …");
  assert.equal(s.fields[3].rows, 3);
  for (const c of CHANNELS) assert.equal(L.consentLabels[c.id], "I agree to be contacted about my enquiry.");
  assert.equal(L.marketingOptIn, false);
  assert.equal(L.submitLabel, "Get free doctor consultation");
  assert.equal(L.privacyLabel, "Privacy policy");
  assert.equal(L.successText, "Thank you. Your enquiry has been received.");
  assert.doesNotThrow(() => structuredClone(L));
  // the 3-step form keeps its own defaults
  const T = resolveSchema(THREE_STEP_FORM, octx);
  assert.equal(T.submitLabel, "Send"); assert.equal(T.privacyLabel, "Privacy notice"); assert.equal(T.successText, undefined);
});

// ── validation ──────────────────────────────────────────────────────────────
test("live validation: required name and email, then consent, in field order", () => {
  assert.deepEqual(validateStep(L, 0, base(), "whatsapp"), []);
  const e = validateStep(L, 0, { ...base(), fullName: "   ", email: "", consent: false }, "whatsapp");
  assert.deepEqual(e.map((x) => [x.field, x.code]), [["fullName", "required"], ["email", "email"], ["consent", "consent"]]);
  assert.equal(e[0].message, MESSAGES.name);
  assert.equal(validateStep(L, 0, { ...base(), email: "x@" }, "whatsapp")[0].message, MESSAGES.email);
});

test("live validation: phone optional (for every channel), but must match the live pattern when given", () => {
  for (const ch of ["whatsapp", "call", "email"]) assert.deepEqual(validateStep(L, 0, { ...base(), phone: "" }, ch), [], ch);
  for (const ok of ["+91 98765 43210", "(020) 7946-0958", "+44.7700.900000"]) assert.deepEqual(validateStep(L, 0, { ...base(), phone: ok }, "whatsapp"), [], ok);
  for (const bad of ["+91 9876x43210", "12345", "call me"]) {
    const e = validateStep(L, 0, { ...base(), phone: bad }, "whatsapp");
    assert.deepEqual(e.map((x) => [x.field, x.code]), [["phone", "phone"]], bad);
  }
  assert.equal(validateStep(L, 0, { ...base(), phone: "+".repeat(3) + "1".repeat(28) }, "whatsapp")[0].field, "phone", "over 30 characters");
});

test("live validation: message length and name length", () => {
  assert.deepEqual(validateStep(L, 0, { ...base(), message: "x".repeat(3000) }, "whatsapp"), []);
  const e = validateStep(L, 0, { ...base(), message: "x".repeat(3001) }, "whatsapp");
  assert.deepEqual(e, [{ field: "message", code: "too_long", message: tooLongMessage(3000) }]);
  assert.equal(tooLongMessage(3000), "Please keep this to 3,000 characters or fewer.");
  assert.equal(validateStep(L, 0, { ...base(), fullName: "A".repeat(121) }, "whatsapp")[0].code, "too_long");
});

// ── payload ─────────────────────────────────────────────────────────────────
test("live payload: single-step mapping, form_variant from the schema id, message = Ref + visitor text only", async () => {
  let body;
  const f = async (_u, init) => { body = JSON.parse(init.body); return json(200, { ok: true, status: "received" })(); };
  const msg = "Program: Panchakarma\nPreferred month: November 2026\nLength of stay: 21 nights\nTravelling with my sister.";
  const r = await leadApiAdapter.submit({ ...base(), message: msg }, ctx(f));
  assert.deepEqual(r, { status: "received", ref: refCode(TOKEN), token: TOKEN });
  assert.equal(body.form, "landing-page");
  assert.equal(body.submissionToken, TOKEN);
  const x = body.fields;
  assert.equal(x.fname, "Asha Menon"); assert.equal(x.lname, "");
  assert.equal(x.email, "asha@example.com"); assert.equal(x.phone, "+91 98765 43210");
  assert.equal(x.consent, true); assert.equal(x.landing_page_path, "/lp-v2/panchakarma/a/");
  assert.equal(x.form_variant, "lp-v2-live-campaign-a");
  assert.equal(x.duration, "");
  assert.equal(x.message, `Ref: ${refCode(TOKEN)}\n${msg}`);
  assert.doesNotMatch(x.message, /Reply channel|Marketing opt-in|Party:/);
});

test("live payload: an empty message is just the Ref line", () => {
  const { answers } = toLeadAnswers(L, base());
  assert.deepEqual(answers.packed, []);
  assert.equal(packMessage(answers, "KT-AAAAAA"), "Ref: KT-AAAAAA");
  assert.equal(answers.channel, "whatsapp", "no channel field → whatsapp default");
});

test("three-step payload is unchanged: all packed lines, 3-step form_variant", () => {
  const T = resolveSchema(THREE_STEP_FORM, octx);
  const { answers } = toLeadAnswers(T, { program: "Panchakarma", month: "flexible", length: "14", party: "solo", channel: "instagram", ...base(), channel: "instagram" });
  assert.equal(packMessage(answers, "KT-AAAAAA"),
    "Ref: KT-AAAAAA\nProgram: Panchakarma\nPreferred month: Flexible\nParty: Just me\nReply channel: instagram\nMarketing opt-in: no");
  // packMessage without `packed` (older callers) writes every line
  const { packed: _p, ...legacy } = answers;
  assert.match(packMessage(legacy, "KT-AAAAAA"), /Marketing opt-in: no$/);
});

// ── ConsultBar prefill into the textarea ────────────────────────────────────
const labels = { program: programOptions(octx), month: monthOptions(octx), length: LENGTHS, channel: CHANNELS.map((c) => ({ value: c.id, label: c.label })) };

test("prefillLines: labels, in bar order, only known option values", () => {
  assert.equal(prefillLines({ program: "Panchakarma", month: "2026-11", length: "21" }, labels),
    "Program: Panchakarma\nPreferred month: November 2026\nLength of stay: 21 nights\n");
  assert.equal(prefillLines({ program: "advise", month: "flexible", length: "advise", channel: "call" }, labels),
    "Program: Not sure — advise me\nPreferred month: Flexible\nLength of stay: Doctor to advise\nReply on: Phone call\n");
  assert.equal(prefillLines({ program: "Cure-all", month: "1999-01", length: "99" }, labels), "");
  assert.equal(prefillLines({}, labels), "");
});

test("mergePrefill: replaces an earlier block, keeps the visitor's own text", () => {
  const b1 = "Program: Panchakarma\nPreferred month: Flexible\nLength of stay: 14 nights\n";
  const b2 = "Program: Panchakarma\nPreferred month: November 2026\nLength of stay: 21 nights\n";
  assert.equal(mergePrefill("", b1), b1);
  assert.equal(mergePrefill("Two of us.", b1), `${b1}Two of us.`);
  assert.equal(mergePrefill(`${b1}Two of us.`, b2), `${b2}Two of us.`);
});

// ── errors, token, guide ────────────────────────────────────────────────────
test("token: kept through edits only after 502 SHEET_SYNC_FAILED or a network error/timeout", () => {
  assert.equal(keepTokenAfterEdit({ status: "error", code: "invalid", message: "x", httpStatus: 502, serverCode: "SHEET_SYNC_FAILED" }), true);
  assert.equal(keepTokenAfterEdit({ status: "error", code: "invalid", message: "x", httpStatus: 502, serverCode: "STORE_FAILED" }), false);
  assert.equal(keepTokenAfterEdit({ status: "error", code: "not_configured", message: "x", httpStatus: 503 }), false);
  assert.equal(keepTokenAfterEdit({ status: "error", code: "network", message: "x" }), true, "unknown outcome: server dedups by token");
  assert.equal(keepTokenAfterEdit({ status: "error", code: "rate_limited", message: "x", httpStatus: 429 }), false);
  assert.equal(keepTokenAfterEdit(null), false);
});

test("guideUrl: same-origin paths only, passed through on received", async () => {
  assert.equal(safeGuideUrl("/guides/panchakarma.pdf"), "/guides/panchakarma.pdf");
  for (const bad of ["//evil.example/x.pdf", "/\\evil.example", "https://evil.example/x.pdf", "guide.pdf", "/a b.pdf", 7, null]) assert.equal(safeGuideUrl(bad), undefined, String(bad));
  const r = await leadApiAdapter.submit(base(), ctx(json(200, { ok: true, status: "received", guideUrl: "/g.pdf" })));
  assert.equal(r.guideUrl, "/g.pdf");
  const r2 = await leadApiAdapter.submit(base(), ctx(json(200, { ok: true, status: "received", guideUrl: "//evil/x" })));
  assert.equal("guideUrl" in r2, false);
});

test("network failure uses the live form's connection text", async () => {
  const r = await leadApiAdapter.submit(base(), ctx(async () => { throw new TypeError("Failed to fetch"); }));
  assert.deepEqual(r, { status: "error", code: "network", message: MSG_NETWORK });
  assert.equal(MSG_NETWORK, "We could not confirm your enquiry. Check your connection and try again.");
});

test("name mapping: live schema sends the whole trimmed name in fname, lname empty; three-step still splits", async () => {
  const grab = async (schema, values) => {
    let body;
    const f = async (_u, init) => { body = JSON.parse(init.body); return json(200, { status: "received" })(); };
    await leadApiAdapter.submit(values, { ...ctx(f), schema });
    return body.fields;
  };
  const live = await grab(L, { ...base(), fullName: "  Asha   Kumari Menon " });
  assert.equal(live.fname, "Asha   Kumari Menon"); assert.equal(live.lname, "");
  const single = await grab(L, { ...base(), fullName: "Asha" });
  assert.equal(single.fname, "Asha"); assert.equal(single.lname, "");
  const T = resolveSchema(THREE_STEP_FORM, octx);
  const three = await grab(T, { ...base(), fullName: "Asha Kumari Menon" });
  assert.equal(three.fname, "Asha"); assert.equal(three.lname, "Kumari Menon");
});

test("timeout: a fetch that never resolves ends as the network error and the signal is aborted", async () => {
  let signal;
  const hang = (_u, init) => { signal = init.signal; return new Promise(() => {}); };
  const r = await leadApiAdapter.submit(base(), { ...ctx(hang), timeoutMs: 20 });
  assert.deepEqual(r, { status: "error", code: "network", message: MSG_NETWORK });
  assert.equal(signal.aborted, true);
  assert.equal(keepTokenAfterEdit(r), true);
});
