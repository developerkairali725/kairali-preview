import { test } from "node:test";
import assert from "node:assert/strict";
import { validConfig } from "./fixtures/lp-v2-valid.ts";
import { lintLengths, visibleWords, gradeLevel } from "../campaign-v2/kit/lint/lengths.ts";
import { lintAssets } from "../campaign-v2/kit/lint/assets.ts";
import { pending } from "../campaign-v2/kit/pending.ts";
import { img } from "../campaign-v2/kit/registry.ts";

const NOW = new Date("2026-10-08T00:00:00Z");
const rules = (issues) => issues.filter((i) => i.level === "error").map((i) => i.rule);

test("valid fixture has no structural errors", () => {
  const c = validConfig();
  assert.deepEqual(rules(lintLengths(c)), []);
  assert.deepEqual(rules(lintAssets(c, NOW)), []);
});

test("h1 over 60 chars is an error", () => {
  const c = validConfig(); c.hero.h1 = "x".repeat(61);
  assert.ok(rules(lintLengths(c)).includes("length.hero.h1"));
});

test("FAQ answers must be 25-70 words", () => {
  const c = validConfig(); c.faq[0].a = "Too short.";
  assert.ok(rules(lintLengths(c)).includes("length.faq.a"));
});

test("visible words counted without longForm and kept within 450-900", () => {
  const n = visibleWords(validConfig());
  assert.ok(n > 100 && n < 900, String(n));
});

test("gradeLevel is low for short plain sentences", () => {
  assert.ok(gradeLevel("You rest. Your doctor plans each day. Meals are made for you.") < 8);
});

test("pending on a production route is an error, on preview it is not", () => {
  const c = validConfig(); c.fees = pending("C2", "fees");
  assert.ok(!rules(lintAssets(c, NOW)).includes("pending.production"));
  c.production = true;
  assert.ok(rules(lintAssets(c, NOW)).includes("pending.production"));
});

test("expired fees, missing source and non-gccSafe images under gcc modesty are errors", () => {
  const c = validConfig(); c.fees.validTo = "2026-01-01";
  assert.ok(rules(lintAssets(c, NOW)).includes("fees.expired"));
  const d = validConfig(); d.fees.source = "";
  assert.ok(rules(lintAssets(d, NOW)).includes("fees.source"));
  const g = validConfig(); g.modesty = "gcc";
  assert.ok(rules(lintAssets(g, NOW)).includes("image.gcc"));
});

test("duplicate image on page and locale without approved review are errors", () => {
  const c = validConfig(); c.gallery.push({ category: "Villas", image: img("kt-116") });
  assert.ok(rules(lintAssets(c, NOW)).includes("image.duplicate"));
  const l = validConfig(); l.locales = ["en", "de"];
  assert.ok(rules(lintAssets(l, NOW)).includes("locale.unreviewed"));
});

test("image size: hero needs 1600px, stillness and gallery need 1200px", () => {
  const sizeErrors = (c) => lintAssets(c, NOW).filter((i) => i.rule === "image.size").map((i) => i.path);
  const h = validConfig(); h.hero.image.A = { ...img("kt-116"), width: 1500, height: 1000 };
  assert.ok(sizeErrors(h).includes("hero.image.A"));
  const s = validConfig(); s.stillness.image = { ...img("kt-116"), width: 1400, height: 1120 };
  assert.deepEqual(sizeErrors(s), []);
  const g = validConfig(); g.gallery[0].image = { ...img("kt-116"), width: 1000, height: 667 };
  assert.ok(sizeErrors(g).includes("gallery[0]"));
});

test("pending markers in any string field never throw and are flagged on production", () => {
  const c = validConfig();
  c.hero.h1 = pending("P1", "h1"); c.longForm = pending("P2", "long");
  c.included[0] = pending("P3", "inc"); c.faq[0].q = pending("P4", "q");
  c.admission.steps[0].body = pending("P5", "body");
  assert.doesNotThrow(() => lintLengths(c));
  assert.doesNotThrow(() => visibleWords(c));
  assert.doesNotThrow(() => lintAssets(c, NOW));
  assert.ok(!rules(lintLengths(c)).some((r) => r.startsWith("length.hero.h1") || r === "length.longForm"));
  c.production = true;
  const paths = lintAssets(c, NOW).filter((i) => i.rule === "pending.production").map((i) => i.path);
  for (const p of ["hero.h1", "longForm", "included[0]", "faq[0].q", "admission.steps[0].body"]) assert.ok(paths.includes("$." + p), p + " in " + paths);
});

test("visible words counts doctors, films, fees, and offer fields", () => {
  const base = validConfig();
  const baseCounts = visibleWords(base);

  // Test fees rows
  const withoutFees = validConfig();
  withoutFees.fees = pending("F1", "fees");
  const withoutFeesCounts = visibleWords(withoutFees);
  assert.equal(baseCounts - withoutFeesCounts, 4, "fees.rows[0].name and .note should be 4 words: 'Deluxe villa' (2) + 'Garden-facing villa' (2)");

  // Test offer
  const withOffer = validConfig();
  withOffer.offer = { name: "Summer Special", headline: "Twenty percent off", termsUrl: "http://example.com", validFrom: "2026-10-01", validTo: "2026-12-31", source: "promo" };
  const withOfferCounts = visibleWords(withOffer);
  assert.equal(withOfferCounts - baseCounts, 5, "offer.name and .headline should add 5 words: 'Summer Special' (2) + 'Twenty percent off' (3)");
});
