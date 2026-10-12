// test/lp-v2-lint-language.test.mjs
import { test } from "node:test";
import assert from "node:assert/strict";
import { validConfig } from "./fixtures/lp-v2-valid.ts";
import { pending } from "../campaign-v2/kit/pending.ts";
import { lintCampaign } from "../campaign-v2/kit/lint/index.ts";
import { diseaseClaim } from "../campaign-v2/kit/lint/claims.ts";

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

test("disease names: a treatment or effect claim is an error anywhere in its sentence (negations included); a diagnosis named for discussion warns for clinical review", () => {
  for (const claim of [
    "Relief from obesity and diabetes.",
    "Ayurveda for diabetes, in the gardens.",
    "Our arthritis programme runs all year.",
    "Panchakarma helps control thyroid levels.",
    "This is not a treatment for blood pressure.",
    "Manage diabetes the natural way.",
    "Lower your cholesterol with diet.",
    "Arthritis relief in Kerala.",
    "We treat diabetes.",
    // Long sentences: the claim word is far from the disease name (a fixed word window missed both).
    "We treat persistent and longstanding cases of complex type 2 diabetes.",
    "Our treatment can permanently normalize high fasting glucose levels associated with diabetes.",
    "Our specialised treatment for the most persistent and longstanding forms of rheumatoid arthritis.",
    // "Previous" describing someone else, or a qualifier before a comma, does not make a claim the reader's history.
    "Previous patients reversed their arthritis here.",
    "Unlike your previous treatment, Ayurveda normalizes blood sugar in diabetes.",
    "Discuss how Ayurveda can reverse your diabetes.",
    // A qualifier with no your/their/any is the provider's own service, not the reader's history.
    "Our current treatment for diabetes.",
    "Our existing diabetes programme.",
    "We offer other treatments for diabetes.",
    // "any" + qualifier is the reader's history only when the copy asks them to disclose it, never in an offer.
    "We offer any current treatment for diabetes.",
  ]) {
    assert.notEqual(diseaseClaim(claim), null, claim);
    assert.ok(errs(body(claim)).includes("claims"), claim);
  }
  for (const mention of [
    // The reviewed copy's neutral topics, and the visitor's own history.
    "Discuss osteoarthritis, rheumatoid arthritis or other joint concerns with the doctor.",
    "Our programme range includes skin conditions, diabetes and women’s health, among other areas.",
    "Share your diagnosis, blood-pressure history and prescriptions.",
    "The doctor can discuss back pain, joint pain, arthritis, sciatica or related concerns in the context of your medical history.",
    "Bring details of your current diabetes treatment and medicines.",
    "Tell the doctor how you currently manage your blood pressure.",
    "Share any previous treatment for arthritis with the doctor.",
    "Bring your reports for your diabetes history to the consultation.",
    "Tell us about your current treatment for diabetes.",
    "Tell us about any previous treatment for arthritis.",
  ]) {
    assert.equal(diseaseClaim(mention), null, mention);
    const c = body(mention);
    assert.ok(!errs(c).includes("claims"), mention);
    assert.ok(warns(c).includes("disease.mention"), mention);
  }
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
