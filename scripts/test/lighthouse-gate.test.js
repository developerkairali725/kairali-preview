// Acceptance tests — scripts/lighthouse-gate.mjs pure layer (judge + seoWaived).
//
// Why now (activation, not weakening): the gate shipped enforcing SEO=100 on
// every URL while the declared law already adapted it for landing class —
// gates/registry.yaml `lighthouse-budgets` landing: "SEO=100 n/a on noindexed
// LPs per LANDING_PAGE_DOCTRINE §8 — perf/a11y budgets bind unchanged". The
// first LP-only site to enter the CI matrix (ayurvedichealingvillage.com,
// PR #145) hit the mismatch: its noindexed-by-doctrine LPs can never score
// SEO 100. These tests pin the adaptation to EXACTLY its declared shape in
// both directions, so the waiver can neither over-apply (a noindexed non-LP
// page, an indexable LP) nor silently weaken perf/a11y.
import { test } from "node:test";
import assert from "node:assert/strict";
import { judge, seoWaived, BUDGETS } from "../lighthouse-gate.mjs";

test("budgets are the A5 figures — never lowered here", () => {
  assert.deepEqual(BUDGETS, { performance: 90, accessibility: 95, seo: 100 });
});

test("judge: clean scores pass", () => {
  assert.deepEqual(judge({ performance: 95, accessibility: 100, seo: 100 }), []);
});

test("judge: SEO below 100 fails WITHOUT a waiver (the default is unchanged)", () => {
  const v = judge({ performance: 95, accessibility: 100, seo: 99 });
  assert.equal(v.length, 1);
  assert.match(v[0], /SEO 99 < 100/);
});

test("judge: seoNA waives ONLY the SEO budget — perf/a11y still fail", () => {
  const v = judge({ performance: 88, accessibility: 92, seo: 69 }, { seoNA: true });
  assert.equal(v.length, 2);
  assert.match(v[0], /performance 88 < 90/);
  assert.match(v[1], /accessibility 92 < 95/);
  assert.ok(!v.some((x) => x.includes("SEO")), "SEO must not be judged under the waiver");
});

test("judge: seoNA with clean perf/a11y passes despite noindex-suppressed SEO score", () => {
  assert.deepEqual(judge({ performance: 93, accessibility: 98, seo: 69 }, { seoNA: true }), []);
});

test("seoWaived: noindexed /lp/ page → waived (the registry's exact shape)", () => {
  assert.equal(seoWaived({ finalPath: "/lp/panchkarma-treatment", crawlableScore: 0 }), true);
});

test("seoWaived: redirect that LANDS on a noindexed LP is judged by its final path", () => {
  // "/" → 307 → /lp/<golden>: the measured page is the LP, so the waiver
  // follows finalPath, never the requested path.
  assert.equal(seoWaived({ finalPath: "/lp/panchkarma-treatment", crawlableScore: 0 }), true);
});

test("seoWaived: INDEXABLE /lp/ page → NOT waived (SEO=100 binds)", () => {
  assert.equal(seoWaived({ finalPath: "/lp/panchkarma-treatment", crawlableScore: 1 }), false);
});

test("seoWaived: noindexed NON-lp page → NOT waived (noindex outside the LP doctrine is a defect signal)", () => {
  assert.equal(seoWaived({ finalPath: "/privacy", crawlableScore: 0 }), false);
  assert.equal(seoWaived({ finalPath: "/", crawlableScore: 0 }), false);
});

test("seoWaived: missing signals → NOT waived (fail closed)", () => {
  assert.equal(seoWaived({ finalPath: null, crawlableScore: 0 }), false);
  assert.equal(seoWaived({ finalPath: "/lp/x", crawlableScore: null }), false);
  assert.equal(seoWaived({ finalPath: "/lp/x", crawlableScore: undefined }), false);
});

test("seoWaived: /lp prefix must be a path segment, not a substring", () => {
  assert.equal(seoWaived({ finalPath: "/lpx/page", crawlableScore: 0 }), false);
  assert.equal(seoWaived({ finalPath: "/blog/lp/page", crawlableScore: 0 }), false);
});
