// placeholder-lint.test.js — tests for the D-EQ-CATALOG preview-only lock
// (scripts/placeholder-lint.mjs; law: DECISIONS.md 2026-07-18 17:46:09 IST +
// launches/kairaliequipment.com/STRATEGY.md §6 + BRIEF §4).
//
// House rule (front-gate.test.js, gate-registry-lint.test.js): every detector
// is tested in BOTH directions — placeholder grammar must FLAG and the honest
// production copy must STAY CLEAN, for the same matcher, in the same run.
//
// house style: plain ESM + node --test.
import { test } from "node:test";
import assert from "node:assert/strict";

import {
  ARMED_DOMAINS,
  PLACEHOLDER_PATTERNS,
  runControlProbes,
  scanFilename,
  scanText,
} from "../placeholder-lint.mjs";

// ── control probes ───────────────────────────────────────────────────────────

test("control probes pass (the lint is not broken)", () => {
  assert.deepEqual(runControlProbes(), []);
});

test("kairaliequipment.com is armed (the site the law was written for)", () => {
  assert.ok(ARMED_DOMAINS.includes("kairaliequipment.com"));
});

// ── the four grammar forms of STRATEGY §6.1: each must flag ─────────────────

test("placeholder SKU ids flag", () => {
  const hits = scanText('sku: "SKU-PLACEHOLDER-001"', "x.tsx");
  assert.ok(hits.some((h) => h.rule === "sku"));
});

test("placeholder rupee AND dollar prices flag", () => {
  const hits = scanText("₹X,XXX / $X,XXX — until the real catalogue lands", "x.tsx");
  assert.equal(hits.filter((h) => h.rule === "price").length, 2);
});

test("awaiting-catalog copy rows flag, case-insensitively", () => {
  assert.ok(scanText("<td>— awaiting catalog —</td>", "x.tsx").some((h) => h.rule === "awaiting"));
  assert.ok(scanText("AWAITING CATALOG", "x.tsx").some((h) => h.rule === "awaiting"));
});

test("PLACEHOLDER badge markers flag", () => {
  assert.ok(scanText('<span class="ph-tag">PLACEHOLDER</span>', "x.tsx").some((h) => h.rule === "badge"));
});

test("placeholder-named asset files flag by filename (binaries carry debt too)", () => {
  assert.equal(scanFilename("sites/x/public/catalogue-placeholder.pdf").length, 1);
});

// ── the other direction: honest copy stays clean ─────────────────────────────

test("real mined category copy does not flag", () => {
  const honest = [
    "Pathi — Wooden Massage Bed (Droni), 8.5 × 3 ft (2591 × 914 mm), slab 3 in (76 mm).",
    "Teak body with a steel steam tank, built for daily treatment-room duty.",
    "Prices, lead times and export terms are shared at quote stage.",
    "Write to info@kairali.com for specifications and dimensions.",
  ].join("\n");
  assert.deepEqual(scanText(honest, "x.tsx"), []);
});

test("real asset filenames do not flag", () => {
  assert.deepEqual(scanFilename("sites/x/public/images/wooden-massage-bed.jpg"), []);
});

test("every declared pattern has an id and a note (report lines stay readable)", () => {
  for (const p of PLACEHOLDER_PATTERNS) {
    assert.ok(p.id && p.note, `pattern ${p.re} missing id/note`);
  }
});
