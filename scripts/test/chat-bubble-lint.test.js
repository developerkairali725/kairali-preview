// chat-bubble-lint.test.js — tests for the fleet-wide chat-bubble presence
// gate (D-20260718-05: chat bubble mandatory on every Factory site).
//
// House rule (matrix-walk.test.js, gate-registry-lint.test.js): every
// detector is tested in BOTH directions — the clean input must PASS and the
// broken input must FAIL, for the same detector, in the same run.
//
// house style: plain ESM + node --test.
import { test } from "node:test";
import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";

import {
  PKG, PROBE_BAD_ORDER, PROBE_GOOD, PROBE_MISSING, REPO_ROOT,
  checkLayoutSource, fleetSites, main, rootLayouts, runControlProbes,
} from "../chat-bubble-lint.mjs";
import { EXEMPT } from "../factory-matrix-lint.mjs";

// ── control probes ───────────────────────────────────────────────────────────

test("control probes pass (the gate is not broken)", () => {
  assert.deepEqual(runControlProbes(), []);
});

// ── checker: both directions ─────────────────────────────────────────────────

test("known-good layout passes: shared import, loader present, consent first", () => {
  assert.deepEqual(checkLayoutSource(PROBE_GOOD, "s"), []);
});

test("missing loader fails with both the import and the render finding", () => {
  const v = checkLayoutSource(PROBE_MISSING, "s");
  assert.ok(v.some((m) => m.includes(`from "${PKG}"`)), "missing-import finding expected");
  assert.ok(v.some((m) => m.includes("<ChatbaseLoader/>")), "missing-render finding expected");
});

test("loader before consent defaults fails the denied-before-loaders order check", () => {
  const v = checkLayoutSource(PROBE_BAD_ORDER, "s");
  assert.ok(v.some((m) => m.includes("denied-before-loaders")), `order finding expected, got: ${v.join(" | ")}`);
});

test("a local-copy import does not satisfy the shared-package requirement", () => {
  const localCopy = PROBE_GOOD.replace(
    `import { ChatbaseLoader } from "@kairali/chat";`,
    `import ChatbaseLoader from "./chatbase-loader";`,
  );
  const v = checkLayoutSource(localCopy, "s");
  assert.ok(v.some((m) => m.includes("never a local copy")), "local-copy finding expected");
});

test("consent missing entirely is its own finding", () => {
  const noConsent = PROBE_GOOD.replace(/<ConsentScripts \/>/, "");
  const v = checkLayoutSource(noConsent, "s");
  assert.ok(v.some((m) => m.includes("<ConsentScripts/>")), "missing-consent finding expected");
});

// ── live repo: the actual fleet is clean, exemptions are real ────────────────

test("live repo passes (every non-exempt fleet site carries the bubble)", () => {
  assert.equal(main([]), 0);
});

test("every exemption key still names a real site dir (exemptions rot too)", () => {
  for (const key of EXEMPT.keys()) {
    assert.ok(existsSync(join(REPO_ROOT, key)), `stale exemption: ${key} not on disk`);
  }
});

test("fleet discovery finds the eight preview-stage sites", () => {
  const sites = fleetSites(join(REPO_ROOT, "sites"));
  for (const s of [
    "kairali.com", "kairalicenters.com", "kairalihospitality.com", "kairaliyoga.com",
    "whatisayurveda.com", "healing.recipes", "arogyakendra.com", "arogyashala.in",
  ]) {
    assert.ok(sites.includes(s), `fleet discovery missing ${s}`);
  }
});

// ── root-layout discovery ───────────────────────────────────────────────────
// Both directions, same detector: a single-root site and a route-group-root
// site must BOTH be found. Before 2026-09-21 the lint looked only for
// app/layout.tsx, so a site that had split into route-group roots read as
// "no root layout at all" and its real layouts were never inspected — the gate
// could not have seen a bubble that WAS there.

test("rootLayouts finds a single app/layout.tsx", () => {
  const found = rootLayouts(join(REPO_ROOT, "sites", "kairali.com"));
  assert.equal(found.length, 1, "single-root site should yield exactly one root");
  assert.ok(found[0].endsWith(join("app", "layout.tsx")));
});

test("rootLayouts finds EVERY route-group root when there is no app/layout.tsx", () => {
  const site = join(REPO_ROOT, "sites", "ayurvedichealingvillage.com");
  assert.equal(existsSync(join(site, "app", "layout.tsx")), false,
    "fixture assumption: AHV has no single root layout");
  const found = rootLayouts(site);
  assert.ok(found.length >= 2, `expected both route-group roots, got ${found.length}`);
  assert.ok(found.some((f) => f.includes("(english)")), "missed the (english) root");
  assert.ok(found.some((f) => f.includes("(lp)")), "missed the (lp) root");
});

test("rootLayouts returns nothing for a directory with no app/", () => {
  assert.deepEqual(rootLayouts(join(REPO_ROOT, "docs")), []);
});

test("the AHV English root really does render the bubble, consent-first", () => {
  const english = rootLayouts(join(REPO_ROOT, "sites", "ayurvedichealingvillage.com"))
    .find((f) => f.includes("(english)"));
  assert.ok(english, "no (english) root layout found");
  assert.deepEqual(checkLayoutSource(readFileSync(english, "utf8"), "ahv-english"), []);
});
