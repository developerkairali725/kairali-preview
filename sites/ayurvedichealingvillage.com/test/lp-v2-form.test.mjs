import { test } from "node:test";
import assert from "node:assert/strict";
import {
  DEFAULT_FORM, resolveSchema, validateStep, monthOptions, MESSAGES, CHANNELS, isRequired,
} from "../campaign-v2/forms/schema.ts";
import { leadApiAdapter, getAdapter, toLeadAnswers, MSG_RATE_LIMITED, MSG_GENERIC, MSG_RETRY } from "../campaign-v2/forms/adapter.ts";
import { carryParams, CARRY_KEYS } from "../campaign-v2/forms/carry.ts";
import { pickPrefill } from "../campaign-v2/sections/interactive/consult-prefill.ts";
import { refCode } from "../campaign-v2/kit/handoff.ts";
import { countryCode } from "../campaign-v2/request.ts";

const NOW = new Date(Date.UTC(2026, 9, 7)); // 7 Oct 2026
const octx = { campaign: { programDefault: "Panchakarma" }, locale: "en", now: NOW };
const S = resolveSchema(DEFAULT_FORM, octx);
const base = () => ({ program: "Panchakarma", month: "flexible", length: "14", party: "solo", channel: "whatsapp",
  fullName: "Asha Menon", email: "asha@example.com", phone: "+44 7700 900000", consent: true, marketing: false, honeypot: "" });

// ── schema ──────────────────────────────────────────────────────────────────
test("DEFAULT_FORM reproduces the canvas Form-Flow: 3 steps, fields in order", () => {
  assert.deepEqual(S.steps.map((s) => s.title), ["Your free doctor consultation", "Your stay, and how we reply", "Your details"]);
  assert.deepEqual(S.steps.map((s) => s.fields.map((f) => f.name)), [["program", "month"], ["length", "party", "channel"], ["fullName", "email", "phone"]]);
  const prog = S.steps[0].fields[0];
  assert.deepEqual(prog.options.map((o) => o.label), ["Panchakarma", "Not sure — advise me"]);
  assert.equal(prog.defaultValue, "Panchakarma");
  assert.deepEqual(S.steps[1].fields[0].options.map((o) => o.label), ["14 nights", "21 nights", "28 nights", "Doctor to advise"]);
  assert.equal(S.steps[1].fields[0].mapsTo, "duration");
  assert.deepEqual(S.steps[1].fields[1].options.map((o) => o.label), ["Just me", "Two patients", "Patient + companion"]);
  const ch = S.steps[1].fields[2];
  assert.equal(ch.type, "channel"); assert.equal(ch.options.length, 6); assert.equal(ch.defaultValue, "whatsapp");
  assert.equal(S.marketingOptIn, true);
});

test("months: six from the current month (AHV-WB.020.current-month), then Flexible", () => {
  const m = monthOptions({ locale: "en", now: NOW });
  assert.equal(m.length, 7);
  assert.deepEqual(m[0], { value: "2026-10", label: "October 2026" });
  assert.deepEqual(m[1], { value: "2026-11", label: "November 2026" });
  assert.equal(m[5].value, "2027-03");
  // Last day of a month (UTC) still starts at that month; December rolls into the next year.
  assert.equal(monthOptions({ locale: "en", now: new Date(Date.UTC(2026, 9, 31, 23, 59)) })[0].value, "2026-10");
  assert.deepEqual(monthOptions({ locale: "en", now: new Date(Date.UTC(2026, 11, 15)) }).slice(0, 2).map((o) => o.value), ["2026-12", "2027-01"]);
  assert.deepEqual(m[6], { value: "flexible", label: "Flexible" });
  assert.doesNotThrow(() => monthOptions({ locale: "not a locale!!", now: NOW }));
});

test("consent label names the chosen channel, verbatim", () => {
  assert.equal(S.consentLabels.whatsapp, "I agree that Kairali may contact me about this enquiry by WhatsApp, phone or email.");
  assert.equal(S.consentLabels.instagram, "I agree that Kairali may contact me about this enquiry by Instagram, phone or email.");
  assert.equal(S.consentLabels.chat, "I agree that Kairali may contact me about this enquiry by chat on this page, phone or email.");
  assert.equal(S.consentLabels.call, "I agree that Kairali may contact me about this enquiry by phone or email.");
  assert.equal(Object.keys(S.consentLabels).length, CHANNELS.length);
});

test("resolved schema is plain data (crosses the server→client boundary)", () => {
  assert.doesNotThrow(() => structuredClone(S)); // throws on functions
  const fns = []; const walk = (v, p) => { if (typeof v === "function") fns.push(p); else if (v && typeof v === "object") for (const [k, x] of Object.entries(v)) walk(x, `${p}.${k}`); };
  walk(S, "S"); assert.deepEqual(fns, []);
});

// ── validateStep ────────────────────────────────────────────────────────────
test("validateStep: a complete form has no errors on any step", () => {
  for (let i = 0; i < 3; i++) assert.deepEqual(validateStep(S, i, base(), "whatsapp"), []);
  assert.deepEqual(validateStep(S, 9, base(), "whatsapp"), []);
});

test("validateStep: program missing → the brief's verbatim message", () => {
  const e = validateStep(S, 0, { ...base(), program: "" }, "whatsapp");
  assert.deepEqual(e, [{ field: "program", code: "required", message: "Please choose a program." }]);
  // A value that is not one of the options (e.g. a tampered query string) is also rejected
  assert.equal(validateStep(S, 0, { ...base(), program: "Cure-all" }, "whatsapp")[0].field, "program");
});

test("validateStep: bad email, missing consent, in field order", () => {
  const e = validateStep(S, 2, { ...base(), email: "x@", consent: false }, "email");
  assert.deepEqual(e.map((x) => [x.field, x.code]), [["email", "email"], ["consent", "consent"]]);
  assert.equal(e[0].message, "Please enter an email like name@example.com.");
  assert.equal(e[1].message, "Please tick the first box so we can reply to you.");
  assert.equal(validateStep(S, 2, { ...base(), email: "" }, "email")[0].message, MESSAGES.email);
});

test("validateStep: phone is required only for whatsapp and call", () => {
  const noPhone = { ...base(), phone: "" };
  assert.deepEqual(validateStep(S, 2, noPhone, "whatsapp").map((x) => x.field), ["phone"]);
  assert.deepEqual(validateStep(S, 2, noPhone, "call").map((x) => x.field), ["phone"]);
  for (const ch of ["instagram", "messenger", "chat", "email"]) assert.deepEqual(validateStep(S, 2, noPhone, ch), [], ch);
  // when given, it must look like a number even if optional
  assert.equal(validateStep(S, 2, { ...base(), phone: "abc" }, "email")[0].code, "phone");
  const phone = S.steps[2].fields[2];
  assert.equal(isRequired(phone, "whatsapp"), true); assert.equal(isRequired(phone, "email"), false);
  assert.equal(phone.label, "WhatsApp / phone with country code");
  assert.equal(phone.optionalLabel, "Phone with country code (optional)");
});

test("validateStep: name required; whitespace counts as empty; consent must be strictly true", () => {
  assert.equal(validateStep(S, 2, { ...base(), fullName: "   " }, "email")[0].field, "fullName");
  assert.equal(validateStep(S, 2, { ...base(), consent: "true" }, "email")[0].code, "consent");
});

test("validateStep also works on the unresolved schema", () => {
  assert.deepEqual(validateStep(DEFAULT_FORM, 0, base(), "whatsapp"), []);
  assert.equal(validateStep(DEFAULT_FORM, 0, { ...base(), program: "" }, "whatsapp")[0].message, "Please choose a program.");
});

// ── adapter ─────────────────────────────────────────────────────────────────
const TOKEN = "00000000-0000-4000-8000-000000000000";
function ctx(fetchImpl) {
  return { schema: S, campaign: { tracking: { campaignName: "Panchakarma 2026", trackId: "lp-pk" } }, variant: "A", locale: "en",
    token: TOKEN, tracking: { gclid: "TEST", utm_source: "google" }, pageUrl: "http://localhost:3000/lp-v2/panchakarma/a/?gclid=TEST", referrer: "", fetch: fetchImpl };
}
const json = (status, body) => async () => new Response(JSON.stringify(body), { status, headers: { "content-type": "application/json" } });

test("adapter: 200 received → received with ref and token; posts JSON to /api/lead/", async () => {
  let seen;
  const f = async (url, init) => { seen = { url, init }; return json(200, { ok: true, status: "received" })(); };
  const r = await leadApiAdapter.submit(base(), ctx(f));
  assert.deepEqual(r, { status: "received", ref: refCode(TOKEN), token: TOKEN });
  assert.equal(seen.url, "/api/lead/");
  assert.equal(seen.init.method, "POST");
  assert.equal(seen.init.headers["content-type"], "application/json");
  const body = JSON.parse(seen.init.body);
  assert.equal(body.form, "landing-page"); assert.equal(body.submissionToken, TOKEN); assert.equal(body.gclid, "TEST");
  assert.equal(body.fields.duration, "14 nights");
  assert.equal(body.fields.fname, "Asha");
  assert.match(body.fields.message, /Program: Panchakarma/);
  assert.match(body.fields.message, /Preferred month: Flexible/);
  assert.match(body.fields.message, /Party: Just me/);
  assert.match(body.fields.message, /Reply channel: whatsapp/);
  assert.equal(body.fields.track_id, "lp-pk");
});

test("adapter: 200 without status=received is NOT a success", async () => {
  const r = await leadApiAdapter.submit(base(), ctx(json(200, { ok: true })));
  assert.equal(r.status, "error"); assert.equal(r.code, "invalid");
});

test("adapter: 503 → not_configured with the server text verbatim", async () => {
  const text = "This form is not connected yet. Nothing has been saved or sent. Please email info@kairali.com.";
  const r = await leadApiAdapter.submit(base(), ctx(json(503, { ok: false, code: "LEAD_STORE_NOT_CONFIGURED", error: text })));
  assert.deepEqual(r, { status: "error", code: "not_configured", message: text, httpStatus: 503 });
  const r2 = await leadApiAdapter.submit(base(), ctx(async () => new Response("down", { status: 503 })));
  assert.equal(r2.code, "not_configured"); assert.ok(r2.message.length > 10, "fallback text when the body is not JSON");
});

test("adapter: 429 → rate_limited", async () => {
  const r = await leadApiAdapter.submit(base(), ctx(json(429, { ok: false, error: "Please wait before trying again." })));
  assert.deepEqual(r, { status: "error", code: "rate_limited", message: MSG_RATE_LIMITED, httpStatus: 429 });
  assert.equal(MSG_RATE_LIMITED, "Too many attempts. Please try again in a minute or WhatsApp us.");
});

test("adapter: other 4xx/5xx → invalid with the live form's retry text (Task 17)", async () => {
  for (const s of [400, 415, 422, 500, 502]) {
    const r = await leadApiAdapter.submit(base(), ctx(json(s, { ok: false })));
    assert.deepEqual(r, { status: "error", code: "invalid", message: MSG_RETRY, httpStatus: s }, String(s));
  }
  assert.equal(MSG_RETRY, "We could not confirm your enquiry. Your details are still here; please retry or use WhatsApp.");
  assert.equal(MSG_GENERIC, "Something went wrong. Nothing was sent. Please WhatsApp or email us.");
});

test("adapter: 502 surfaces the server text verbatim (SHEET_SYNC_FAILED / STORE_FAILED), else generic", async () => {
  const sheet = "Your details were saved, but final confirmation failed. Please retry once.";
  const r1 = await leadApiAdapter.submit(base(), ctx(json(502, { ok: false, code: "SHEET_SYNC_FAILED", error: sheet })));
  assert.deepEqual(r1, { status: "error", code: "invalid", message: sheet, httpStatus: 502, serverCode: "SHEET_SYNC_FAILED" });
  const store = "We could not confirm your submission. Please try again, or email info@kairali.com.";
  const r2 = await leadApiAdapter.submit(base(), ctx(json(502, { ok: false, code: "STORE_FAILED", error: store })));
  assert.deepEqual(r2, { status: "error", code: "invalid", message: store, httpStatus: 502, serverCode: "STORE_FAILED" });
  const r3 = await leadApiAdapter.submit(base(), ctx(json(502, { ok: false, error: "  " })));
  assert.equal(r3.message, MSG_RETRY);
  const r4 = await leadApiAdapter.submit(base(), ctx(async () => new Response("<html>bad gateway</html>", { status: 502 })));
  assert.equal(r4.message, MSG_RETRY);
});

test("adapter: a retry after 502 posts the same submissionToken", async () => {
  const tokens = [];
  const f = async (_u, init) => { tokens.push(JSON.parse(init.body).submissionToken); return json(502, { ok: false, code: "SHEET_SYNC_FAILED", error: "x" })(); };
  await leadApiAdapter.submit(base(), ctx(f)); await leadApiAdapter.submit(base(), ctx(f));
  assert.deepEqual(tokens, [TOKEN, TOKEN]);
});

test("adapter: country from the request context lands in fields.country", async () => {
  let body;
  const f = async (_u, init) => { body = JSON.parse(init.body); return json(200, { status: "received" })(); };
  await leadApiAdapter.submit(base(), { ...ctx(f), country: "IN" });
  assert.equal(body.fields.country, "IN");
  await leadApiAdapter.submit(base(), ctx(f));
  assert.equal(body.fields.country, "");
});

test("honeypot: the lp_hp_ref value maps to LeadAnswers.honeypot", () => {
  assert.equal(toLeadAnswers(S, { ...base(), honeypot: "bot" }).answers.honeypot, "bot");
});

test("countryCode: two uppercase letters, sentinels rejected", () => {
  assert.equal(countryCode("IN"), "IN");
  assert.equal(countryCode("GB"), "GB");
  for (const bad of ["XX", "ZZ", "T1", "A1", "A2", "AP", "EU", "O1", "in", "IND", "", " IN", null, undefined, "1N"]) {
    assert.equal(countryCode(bad), undefined, String(bad));
  }
});

test("adapter: fetch failure → network", async () => {
  const r = await leadApiAdapter.submit(base(), ctx(async () => { throw new TypeError("Failed to fetch"); }));
  assert.equal(r.status, "error"); assert.equal(r.code, "network"); assert.equal(r.httpStatus, undefined);
});

test("adapter: client-side rejections never call fetch", async () => {
  let called = 0; const f = async () => { called++; return json(200, { status: "received" })(); };
  assert.equal((await leadApiAdapter.submit({ ...base(), honeypot: "Acme" }, ctx(f))).code, "honeypot");
  assert.equal((await leadApiAdapter.submit({ ...base(), consent: false }, ctx(f))).code, "consent");
  assert.equal((await leadApiAdapter.submit({ ...base(), email: "nope" }, ctx(f))).code, "email");
  assert.equal((await leadApiAdapter.submit(base(), { ...ctx(f), pageUrl: "::" })).code, "url");
  assert.equal(called, 0);
});

test("adapter registry: lead-api by default and for unknown ids", () => {
  assert.equal(getAdapter().id, "lead-api");
  assert.equal(getAdapter("lead-api"), leadApiAdapter);
  assert.equal(getAdapter("nope"), leadApiAdapter);
  assert.equal(getAdapter("__proto__"), leadApiAdapter);
});

test("toLeadAnswers: extra message fields from a custom schema are appended as Label: value", () => {
  const custom = resolveSchema({
    ...DEFAULT_FORM,
    steps: [...DEFAULT_FORM.steps.slice(0, 2), { id: "c", title: "C", fields: [
      ...DEFAULT_FORM.steps[2].fields,
      { name: "arrival", type: "text", label: "Arriving from", required: false, mapsTo: "message" },
      { name: "secret", type: "text", label: "Internal", required: false, mapsTo: "none" },
    ] }],
  }, octx);
  const { answers, extra } = toLeadAnswers(custom, { ...base(), arrival: "Dubai", secret: "x" });
  assert.deepEqual(extra, ["Arriving from: Dubai"]);
  assert.equal(answers.channel, "whatsapp"); assert.equal(answers.program, "Panchakarma");
  assert.equal(toLeadAnswers(S, { ...base(), channel: "fax" }).answers.channel, "whatsapp");
});

// ── no-JS carry-through + prefill keys ──────────────────────────────────────
test("carryParams: only allow-listed tracking keys, trimmed to 200 chars, in a fixed order", () => {
  const long = "x".repeat(250);
  const out = carryParams({ gclid: "TEST", utm_source: "google", lp_debug: "1", program: "Panchakarma", email: "a@b.co", fbclid: ["F1", "F2"], utm_term: long, utm_medium: "  ", wbraid: undefined });
  assert.deepEqual(out, [["utm_source", "google"], ["utm_term", "x".repeat(200)], ["gclid", "TEST"], ["fbclid", "F1"]]);
  assert.deepEqual(CARRY_KEYS, ["utm_source", "utm_medium", "utm_campaign", "utm_term", "utm_content", "utm_keyword", "gclid", "gbraid", "wbraid", "fbclid"]);
  assert.deepEqual(carryParams(undefined), []);
  assert.deepEqual(carryParams(Object.create({ gclid: "inherited" })), []);
});

test("pickPrefill: only program, month, length and channel", () => {
  const q = new URLSearchParams("program=Panchakarma&month=2026-11&length=21&email=a@b.co&gclid=X&channel=call");
  assert.deepEqual(pickPrefill((k) => q.get(k)), { program: "Panchakarma", month: "2026-11", length: "21", channel: "call" });
});
