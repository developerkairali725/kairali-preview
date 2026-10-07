// test/lp-v2-lint-language.test.mjs
import { test } from "node:test";
import assert from "node:assert/strict";
import { validConfig } from "./fixtures/lp-v2-valid.ts";
import { pending } from "../campaign-v2/kit/pending.ts";
import { lintCampaign } from "../campaign-v2/kit/lint/index.ts";

const NOW = new Date("2026-10-08T00:00:00Z");
const errs = (c) => lintCampaign(c, NOW).errors.map((i) => i.rule);
const warns = (c) => lintCampaign(c, NOW).warnings.map((i) => i.rule);

test("valid fixture passes everything", () => {
  assert.deepEqual(lintCampaign(validConfig(), NOW).errors, []);
});

for (const [label, text] of [
  ["cure", "Our therapy cures chronic pain."],
  ["disease", "Relief from obesity and diabetes."],
  ["kg", "Guests lost 8 kg in 21 days."],
  ["percent", "87% of patients improved."],
  ["zero adverse", "Zero adverse reactions in 1.4M+ therapies."],
  ["superlative", "Asia's best Ayurvedic hospital."],
  ["patients count", "Trusted by 30,000+ lives transformed."],
  ["proven", "Scientifically proven results."],
]) {
  test(`claims: ${label} is an error`, () => {
    const c = validConfig(); c.village.body = text + " Laterite, teak and terracotta rooms around the gardens.";
    assert.ok(errs(c).includes("claims"), JSON.stringify(errs(c)));
  });
}

test("'program' is not flagged as British", () => {
  const p = validConfig(); p.village.body = "A program of therapies set among the gardens, palms and paddy fields.";
  assert.ok(!errs(p).includes("spelling.us"));
});

test("British spellings are errors", () => {
  const c = validConfig(); c.village.body = "A programme centred on colour and calm, with rooms set among the gardens.";
  assert.ok(errs(c).includes("spelling.us"));
});

test("banned register words warn unless overridden by owner wordingOverrides", () => {
  const c = validConfig(); c.stillness.body = "A luxury spa feeling, with warm oil and quiet rooms in the monsoon light.";
  assert.ok(warns(c).includes("register"));
  c.wordingOverrides = [{ term: "luxury", approvedBy: "owner", date: "2026-10-07", reason: "test" }, { term: "spa", approvedBy: "owner", date: "2026-10-07", reason: "test" }];
  assert.ok(!warns(c).includes("register"));
});

test("reply-time promises near consultation are errors", () => {
  const c = validConfig(); c.faq[0].a = "Yes. A qualified doctor replies within 2 hours and the consultation is free of charge for everyone who enquires with us today here.";
  assert.ok(errs(c).includes("reply-time"));
});

test("Abhyanga (North Indian form) warns; Abhyangam does not", () => {
  const c = validConfig(); c.stillness.body = "After Abhyanga, warm oil and quiet rooms with monsoon light through tall windows.";
  assert.ok(warns(c).includes("therapy-names"));
});

test("pending markers in any string field do not throw", () => {
  const c = validConfig(); c.hero.h1 = pending("h1", "tbd"); c.village.body = pending("vb", "tbd"); c.adMatch.keywords = [pending("k", "tbd"), "panchakarma treatment kerala"];
  const r = lintCampaign(c, NOW);
  assert.ok(!r.warnings.some((i) => i.rule === "ad-match"));
});

test("American 'color' is not flagged; 'colour' is", () => {
  const c = validConfig(); c.village.body = "Warm color in the gardens and quiet rooms set among palms and paddy fields.";
  assert.ok(!errs(c).includes("spelling.us"));
  c.village.body = "Warm colour in the gardens and quiet rooms set among palms and paddy fields.";
  assert.ok(errs(c).includes("spelling.us"));
});

test("h1 without ad keyword overlap warns", () => {
  const c = validConfig(); c.hero.h1 = "Rest, deeply, in a quiet Kerala village today.";
  assert.ok(warns(c).includes("ad-match"));
});

const body = (t) => { const c = validConfig(); c.village.body = t + " Rooms sit among the gardens, palms and paddy fields."; return c; };

test("ad-match: generic words ignored, core words matched", () => {
  const c = validConfig(); c.adMatch.keywords = ["yoga retreat kerala"]; c.hero.h1 = "Yoga at the village, every morning.";
  assert.ok(!warns(c).includes("ad-match"));
  const d = validConfig(); d.hero.h1 = "Panchakarma, practiced the way it was meant to be.";
  assert.ok(!warns(d).includes("ad-match"));
});

test("reply-time: only near a reply word", () => {
  assert.ok(!errs(body("Held in 30 minutes of massage, then rest.")).includes("reply-time"));
  assert.ok(errs(body("Our team will reply within 2 hours.")).includes("reply-time"));
  assert.ok(errs(body("A doctor will call you back in 10 minutes.")).includes("reply-time"));
  assert.ok(errs(body("Patients hear from us in minutes.")).includes("reply-time"));
});

test("claims: time-bound outcomes only near outcome words; unplussed counts", () => {
  assert.ok(!errs(body("Panchakarma in 21 days.")).includes("claims"));
  assert.ok(!errs(body("Free cancellation within 7 days of booking.")).includes("claims"));
  assert.ok(!errs(body("Refunds are processed within 14 days.")).includes("claims"));
  assert.ok(errs(body("Feel the relief in 21 days.")).includes("claims"));
  assert.ok(errs(body("Lose weight within 2 weeks.")).includes("claims"));
  assert.ok(!errs(body("A 14-night program.")).includes("claims"));
  assert.ok(errs(body("30,000 patients treated.")).includes("claims"));
});

test("claims: brand name 'Healing Village' and neutral 'feel'/'better' not outcome words", () => {
  assert.ok(!errs(body("Free cancellation within 7 days at the Healing Village.")).includes("claims"));
  assert.ok(!errs(body("You will feel at home within 2 days of arrival.")).includes("claims"));
  assert.ok(errs(body("Feel the relief in 21 days.")).includes("claims"));
});

test("spelling: award names stripped, rest still checked", () => {
  assert.ok(errs(body("Tripadvisor Travellers' Choice 2025, a colourful garden.")).includes("spelling.us"));
  assert.ok(!errs(body("Tripadvisor Travelers\u2019 Choice 2025.")).includes("spelling.us"));
  assert.ok(!errs(body("Tripadvisor Travellers\u2019 Choice 2025.")).includes("spelling.us"));
  assert.ok(errs(body("Our favourite specialised program.")).includes("spelling.us"));
});

test("cure is reported once, as a claim, not as register", () => {
  const c = body("Our therapy cures pain.");
  assert.ok(errs(c).includes("claims")); assert.ok(!warns(c).includes("register"));
});

test("doctor role and fee row text are linted", () => {
  const c = validConfig(); c.doctors[0].role = "Best physician";
  assert.ok(errs(c).includes("claims"));
  const d = validConfig(); d.fees.rows[0].note = "Guaranteed villa";
  assert.ok(errs(d).includes("claims"));
});
