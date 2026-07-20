// footer-socials-lint.test.js — tests for the fleet-wide footer social-links
// gate (D-20260718-04: footer social parity on every Factory site).
//
// House rule (matrix-walk.test.js, gate-registry-lint.test.js): every
// detector is tested in BOTH directions — the clean input must PASS and the
// broken input must FAIL, for the same detector, in the same run.
//
// house style: plain ESM + node --test.
import { test } from "node:test";
import assert from "node:assert/strict";
import { existsSync } from "node:fs";
import { join } from "node:path";

import {
  CONFIG_PATH, PKG, PROBE_GOOD, PROBE_HARDCODED, PROBE_HREFS, PROBE_LOCAL_COPY,
  PROBE_MISSING, PROBE_OUTSIDE_FOOTER, REPO_ROOT,
  canonicalHrefs, checkSiteSources, collectAppSources, fleetSites, main, runControlProbes,
} from "../footer-socials-lint.mjs";
import { EXEMPT } from "../factory-matrix-lint.mjs";

// ── control probes ───────────────────────────────────────────────────────────

test("control probes pass (the gate is not broken)", () => {
  assert.deepEqual(runControlProbes(), []);
});

// ── canonical config parsing ─────────────────────────────────────────────────

test("canonicalHrefs reads the four canonical profiles from the ONE config file", () => {
  assert.ok(existsSync(CONFIG_PATH), "packages/social/src/config.ts must exist");
  const hrefs = canonicalHrefs();
  assert.equal(hrefs.length, 4, `expected the 4 canonical KAG profiles (D-20260720-39), got ${hrefs.length}`);
  for (const h of hrefs) assert.match(h, /^https:\/\//);
});

test("canonicalHrefs throws on a drifted config format rather than guarding nothing", () => {
  assert.throws(() => canonicalHrefs("export const SOCIAL_PROFILES = [];"), /no hrefs parsed/);
});

// ── checker: both directions ─────────────────────────────────────────────────

test("known-good site passes: shared import, footer placement, no hardcodes", () => {
  assert.deepEqual(checkSiteSources(PROBE_GOOD, "s", PROBE_HREFS), []);
});

test("missing SocialLinks fails with the mandatory-parity finding", () => {
  const v = checkSiteSources(PROBE_MISSING, "s", PROBE_HREFS);
  assert.ok(v.some((m) => m.includes("<SocialLinks/>")), "missing-render finding expected");
});

test("a local-copy import does not satisfy the shared-package requirement", () => {
  const v = checkSiteSources(PROBE_LOCAL_COPY, "s", PROBE_HREFS);
  assert.ok(v.some((m) => m.includes("never a local copy")), "local-copy finding expected");
});

test("rendering outside a footer fails the placement check", () => {
  const v = checkSiteSources(PROBE_OUTSIDE_FOOTER, "s", PROBE_HREFS);
  assert.ok(v.some((m) => m.includes("outside any <footer>")), "placement finding expected");
});

test("a hardcoded canonical URL in site code fails the one-source check", () => {
  const v = checkSiteSources(PROBE_HARDCODED, "s", PROBE_HREFS);
  assert.ok(v.some((m) => m.includes("hardcodes")), "one-source finding expected");
});

// ── live repo: the actual fleet is clean, exemptions are real ────────────────

test("live repo passes (every non-exempt fleet site carries footer socials)", () => {
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

test("collectAppSources walks nested app dirs (chrome components are seen)", () => {
  const files = collectAppSources(join(REPO_ROOT, "sites", "healing.recipes"));
  assert.ok(
    files.some((f) => f.path.includes("_components") && f.src.includes(`from "${PKG}"`)),
    "healing.recipes chrome.tsx (nested) must be collected and carry the shared import",
  );
});
