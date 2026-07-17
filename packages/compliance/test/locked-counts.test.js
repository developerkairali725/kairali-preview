// Locked-count gate — the lint half of the 17 Jul 2026 canonical-count ruling
// (PROJECT_CONTEXT §12: the KAC website's figures — 14 centres / 5 countries —
// are canonical for all properties; retro-audit process fix #4).
//
// Two enforcement layers share ONE pattern list (LOCKED_COUNT_PATTERNS in
// src/rules.js — a second list is a second thing to drift):
//   · packages/compliance lintText — fires at edit time via the PostToolUse
//     hook and in every per-site lint run;
//   · scripts/banned-string-lint.mjs — the probe-verified, comment-stripping
//     CI gate over sites/.
//
// The ban covers the STALE counts ("nine countries", "18 centres", "25
// Centers") AND the current canonical values typed as literals ("five
// countries", "14 centres") — a typed count rots the day the network changes;
// copy renders @kairali/facts constants instead (D 16 Jul: never hardcode a
// rolling number).
import { test } from "node:test";
import assert from "node:assert/strict";
import { lintText } from "../src/lint.js";
import { LOCKED_COUNT_PATTERNS } from "../src/rules.js";
import { RULES, scanText, runControlProbes } from "../../../scripts/banned-string-lint.mjs";

const errs = (f) => f.filter((x) => x.severity === "error");
const countErrs = (f) => errs(f).filter((x) => x.rule === "locked-counts");

// ── the pattern list itself ──────────────────────────────────────────────────

test("LOCKED_COUNT_PATTERNS exists and every entry carries a note", () => {
  assert.ok(Array.isArray(LOCKED_COUNT_PATTERNS) && LOCKED_COUNT_PATTERNS.length >= 5);
  for (const p of LOCKED_COUNT_PATTERNS) {
    assert.ok(p.re instanceof RegExp, "pattern is a RegExp");
    assert.ok(typeof p.note === "string" && p.note.length > 0, "pattern has a note");
  }
});

// ── compliance lintText layer ────────────────────────────────────────────────

test("stale counts are ERRORS in content", () => {
  for (const text of [
    "Treatment centres across nine countries",
    "centres in 9 countries carry the tradition",
    "our 18 centres welcome you",
    "eighteen centres across the world",
    "25 Centers Worldwide",
    "Twenty-Five Centers Worldwide",
    "18 Centers and growing",
  ]) {
    const f = lintText(text, { entity: "group" });
    assert.ok(countErrs(f).length > 0, `should flag: "${text}"`);
  }
});

test("typed canonical values are ERRORS too — render @kairali/facts, never type the number", () => {
  for (const text of [
    "treatment centres across five countries",
    "our network spans 5 countries",
    "14 centres carry the tradition",
    "fourteen centres worldwide",
    "14 treatment centres across five countries",
  ]) {
    const f = lintText(text, { entity: "group" });
    assert.ok(countErrs(f).length > 0, `should flag the hardcode: "${text}"`);
  }
});

test("locked counts stay ERRORS even in code files (like locked facts, unlike word lists)", () => {
  const f = lintText('const LINE = "Treatment centres across nine countries";', {
    entity: "group",
    asCode: true,
  });
  const hits = countErrs(f);
  assert.ok(hits.length > 0, "code hardcode must be an error, not a warning");
});

test("legitimate copy does not trip the count gate", () => {
  for (const text of [
    "One family, five doors: hospital, products, centres, training, Villa Raag.", // "five doors" ≠ "five countries"
    "Ayurveda is practised in 195 countries today.", // digit-boundary: 195 ≠ 9 / 5
    "the group's treatment centres carry the tradition forward", // no number, no claim
    "`${CENTRES_COUNT} treatment centres across ${COUNTRIES_PHRASE}`", // the constants-rendered form
    "Nine practitioners trained in five disciplines", // numbers without the centres/countries nouns
  ]) {
    const f = lintText(text, { entity: "group" });
    assert.equal(countErrs(f).length, 0, `should NOT flag: "${text}"`);
  }
});

test("compliance-allow suppression reports info, never silence", () => {
  const f = lintText(
    'legacy sites still print "25 Centers Worldwide" <!-- compliance-allow: locked-counts -->',
    { entity: "group" }
  );
  assert.equal(countErrs(f).length, 0);
  assert.ok(f.some((x) => x.severity === "info" && x.rule === "locked-counts"), "suppression is reported");
});

// ── banned-string-lint layer (CI gate over sites/) ───────────────────────────

test("banned-string-lint carries the hardcoded-centres-count rule with live probes", () => {
  const rule = RULES.find((r) => r.id === "hardcoded-centres-count");
  assert.ok(rule, "rule exists");
  const probe = runControlProbes([rule]);
  assert.ok(probe.ok, probe.broken.join("\n"));
});

test("banned-string-lint flags stale and typed counts in site code, comments excluded", () => {
  const code = [
    'const A = "Treatment centres across nine countries";', // live string — flag
    "// the register's stale claim was written as eighteen centres once", // comment — never a finding
    'const B = `${CENTRES_COUNT} treatment centres across ${COUNTRIES_PHRASE}`;', // constants — clean
  ].join("\n");
  const findings = scanText(code, { kind: "code" }).filter((f) => f.rule === "hardcoded-centres-count");
  assert.equal(findings.length, 1, JSON.stringify(findings, null, 2));
  assert.equal(findings[0].line, 1);
});

test("banned-string-lint flags counts in content JSON (llms.txt-adjacent surfaces)", () => {
  const json = '{ "note": "treatment centres across nine countries" }';
  const findings = scanText(json, { kind: "plain" }).filter((f) => f.rule === "hardcoded-centres-count");
  assert.equal(findings.length, 1);
});
