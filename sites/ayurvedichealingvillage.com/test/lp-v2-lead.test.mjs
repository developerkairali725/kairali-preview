import { test } from "node:test";
import assert from "node:assert/strict";
import { randomUUID } from "node:crypto";
import { buildLeadPayload, packMessage } from "../campaign-v2/kit/lead.ts";
import { refCode, channelLink } from "../campaign-v2/kit/handoff.ts";
import { validConfig } from "./fixtures/lp-v2-valid.ts";

const A = { program: "Panchakarma", month: "Flexible", duration: "14 nights", party: "Just me", channel: "instagram",
  fullName: "Asha Menon", email: "asha@example.com", phone: "+44 7700 900000", country: "GB", consent: true, marketing: false, honeypot: "" };
const ctx = { campaign: validConfig(), variant: "B", token: "00000000-0000-4000-8000-000000000000", locale: "en",
  tracking: { utm_source: "google", gclid: "abc" }, pageUrl: "https://ayurvedichealingvillage.com/lp-v2/fixture/b", referrer: "" };

test("payload uses only existing landing-page columns and packs extras into message", () => {
  const r = buildLeadPayload(A, ctx);
  assert.equal(r.ok, true);
  const f = r.body.fields;
  assert.deepEqual(Object.keys(f).sort(), ["campaign_name","consent","country","duration","email","fname","form_variant","landing_page_path","lname","message","phone","track_id","utm_keyword"].sort());
  assert.equal(f.form_variant, "lp-v2-3step-b");
  assert.equal(f.fname, "Asha"); assert.equal(f.lname, "Menon");
  assert.match(f.message, /^Ref: KT-/); assert.match(f.message, /Program: Panchakarma/); assert.match(f.message, /Reply channel: instagram/);
  assert.equal(r.body.form, "landing-page"); assert.equal(r.body.submissionToken, ctx.token);
  assert.equal(r.body.gclid, "abc");
  assert.equal(r.ref, refCode(ctx.token));
});

test("no consent, bad email, filled honeypot, or malformed URL is rejected client-side", () => {
  assert.deepEqual(buildLeadPayload({ ...A, consent: false }, ctx), { ok: false, reason: "consent" });
  assert.deepEqual(buildLeadPayload({ ...A, email: "x@" }, ctx), { ok: false, reason: "email" });
  assert.deepEqual(buildLeadPayload({ ...A, honeypot: "bot" }, ctx), { ok: false, reason: "honeypot" });
  assert.deepEqual(buildLeadPayload(A, { ...ctx, pageUrl: "not a url" }), { ok: false, reason: "url" });
});

test("packMessage starts with ref and never contains health keywords from free text", () => {
  const ref = refCode(ctx.token);
  const msg = packMessage(A, ref);
  assert.match(msg, new RegExp(`^Ref: ${ref}`));
  assert.doesNotMatch(msg, /condition|medication|history/i);
});

test("refCode is stable, non-personal, and 6 characters", () => {
  assert.equal(refCode(ctx.token), refCode(ctx.token));
  assert.match(refCode(ctx.token), /^KT-[0-9A-Z]{6}$/);
});

test("refCode collision resistance: 2000 UUIDs yield at least 1995 distinct refs", () => {
  const refs = new Set();
  for (let i = 0; i < 2000; i++) refs.add(refCode(randomUUID()));
  assert.ok(refs.size >= 1995, `expected >= 1995 distinct refs, got ${refs.size}`);
});

test("channel links carry only the ref code", () => {
  const ref = "KT-7Q4MZ2";
  assert.equal(channelLink("whatsapp", ref), "https://wa.me/919289838797?text=Hello%2C%20my%20enquiry%20reference%20is%20KT-7Q4MZ2");
  assert.equal(channelLink("instagram", ref), "https://ig.me/m/kairaliayurvedichealingvillage?ref=KT-7Q4MZ2");
  assert.equal(channelLink("messenger", ref), "https://m.me/KairaliTheAyurvedicHealingVillage?ref=KT-7Q4MZ2");
  assert.equal(channelLink("call", ref), "tel:+919555156156");
  assert.equal(channelLink("email", ref), null);
  for (const ch of ["whatsapp","instagram","messenger"]) assert.doesNotMatch(channelLink(ch, ref), /asha|menon|example\.com|7700/i);
});

test("name edge cases: single name and whitespace", () => {
  const single = buildLeadPayload({ ...A, fullName: "Asha" }, ctx);
  assert.equal(single.ok, true);
  assert.equal(single.body.fields.fname, "Asha");
  assert.equal(single.body.fields.lname, "");
  const trimmed = buildLeadPayload({ ...A, fullName: "  Asha   Menon  " }, ctx);
  assert.equal(trimmed.ok, true);
  assert.equal(trimmed.body.fields.fname, "Asha");
  assert.equal(trimmed.body.fields.lname, "Menon");
});
