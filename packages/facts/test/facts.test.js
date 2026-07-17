// @kairali/facts — locked-fact constants gate.
//
// The canonical centres/countries count is a RULING (PROJECT_CONTEXT §12,
// 17 Jul 2026: the KAC website's published figures are canonical for all
// properties). These tests pin three things:
//   1. the counts are COMPUTED from the verified roster, never typed
//      (DECISIONS 16 Jul: "NEVER hardcode a rolling number");
//   2. today's canonical values are 14 centres / 5 countries — if the roster
//      changes, this fails and forces a conscious re-ruling, not silent drift;
//   3. the display strings sites render are derived from the same numbers.
import test from "node:test";
import assert from "node:assert/strict";

import {
  CENTRES,
  INDIA_CENTRES,
  INTERNATIONAL_CENTRES,
  COUNTRIES,
  CENTRES_COUNT,
  COUNTRIES_COUNT,
  COUNTRIES_WORD,
  COUNTRIES_PHRASE,
  COUNTRIES_PHRASE_TITLE,
  CENTRES_NETWORK_LINE,
  CANONICAL_COUNT_RULING,
  numberWord,
  centreBySlug,
} from "../src/index.js";

test("counts are computed from the roster, not typed", () => {
  assert.equal(CENTRES_COUNT, CENTRES.length);
  assert.equal(COUNTRIES_COUNT, COUNTRIES.length);
  assert.equal(COUNTRIES_COUNT, new Set(CENTRES.map((c) => c.country)).size);
});

test("canonical values today: 14 centres in 5 countries (KAC site, ruled 17 Jul 2026)", () => {
  // If this fails, the ROSTER changed. That needs a new ruling from Abilash
  // (the KAC website is the canonical anchor), not a silent constant bump.
  assert.equal(CENTRES_COUNT, 14, CANONICAL_COUNT_RULING);
  assert.equal(COUNTRIES_COUNT, 5, CANONICAL_COUNT_RULING);
  assert.deepEqual(COUNTRIES, ["India", "Japan", "Mauritius", "Czech Republic", "Kuwait"]);
  assert.equal(INDIA_CENTRES.length, 8);
  assert.equal(INTERNATIONAL_CENTRES.length, 6);
});

test("display strings derive from the computed numbers", () => {
  assert.equal(COUNTRIES_WORD, "five");
  assert.equal(COUNTRIES_PHRASE, "five countries");
  assert.equal(COUNTRIES_PHRASE_TITLE, "Five Countries");
  assert.equal(CENTRES_NETWORK_LINE, "14 treatment centres across five countries");
});

test("numberWord covers the plausible range and never invents beyond it", () => {
  assert.equal(numberWord(1), "one");
  assert.equal(numberWord(5), "five");
  assert.equal(numberWord(12), "twelve");
  // beyond twelve, style is digits — a 14-country future prints "14", not prose
  assert.equal(numberWord(14), "14");
  assert.equal(numberWord(0), "0");
});

test("the ruling's provenance travels with the constants", () => {
  assert.match(CANONICAL_COUNT_RULING, /KAC site/);
  assert.match(CANONICAL_COUNT_RULING, /17 Jul 2026/);
});

test("roster integrity: unique slugs, verbatim-mined fields present", () => {
  const slugs = CENTRES.map((c) => c.slug);
  assert.equal(new Set(slugs).size, slugs.length, "slugs must be unique");
  for (const c of CENTRES) {
    assert.ok(c.name && c.city && c.country && c.address, `${c.slug} is missing a NAP field`);
    assert.ok(Array.isArray(c.phones) && c.phones.length > 0, `${c.slug} has no phone`);
  }
});

test("roster schema: the full Centre shape is machine-checked (this replaced tsc when the roster moved to JS)", () => {
  // The old sites/kairalicenters lib/centres.ts was compile-checked by tsc
  // (excess-property checking included). Plain JS lost that, so this test IS
  // the type check now: a typoed key ("parnter") or a mistyped value fails here.
  const REQUIRED = { slug: "string", name: "string", city: "string", country: "string", address: "string" };
  const OPTIONAL = { region: "string", email: "string", hours: "string", note: "string", partner: "boolean" };
  const ALLOWED = new Set([...Object.keys(REQUIRED), ...Object.keys(OPTIONAL), "phones"]);
  for (const c of CENTRES) {
    for (const k of Object.keys(c)) {
      assert.ok(ALLOWED.has(k), `${c.slug}: unknown key "${k}" — typo? (tsc would have caught this)`);
    }
    for (const [k, t] of Object.entries(REQUIRED)) {
      assert.equal(typeof c[k], t, `${c.slug}.${k} must be a ${t}`);
      assert.ok(String(c[k]).trim().length > 0, `${c.slug}.${k} must be non-empty`);
    }
    for (const [k, t] of Object.entries(OPTIONAL)) {
      if (c[k] !== undefined) assert.equal(typeof c[k], t, `${c.slug}.${k} must be a ${t} when present`);
    }
    assert.ok(Array.isArray(c.phones), `${c.slug}.phones must be an array`);
    for (const p of c.phones) {
      assert.equal(typeof p, "string", `${c.slug}: phones entries must be strings`);
      assert.ok(p.trim().length > 0, `${c.slug}: empty phone entry`);
    }
  }
});

test("centreBySlug resolves and misses honestly", () => {
  assert.equal(centreBySlug("raipur")?.city, "Raipur");
  assert.equal(centreBySlug("nonexistent"), undefined);
});
