// gate-registry-lint.test.js — tests for the unified-gate-registry lint
// (roadmap §7 / PROMPT 5: one registry, three site classes, no missing entries).
//
// House rule (matrix-walk.test.js, front-gate.test.js, factory-hardening.test.js):
// every detector is tested in BOTH directions — the clean input must PASS and
// the broken input must FAIL, for the same detector, in the same run. A lint
// that always says no gets deleted; one that always says yes is a comment.
//
// house style: plain ESM + node --test.
import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync, existsSync } from "node:fs";
import { join, resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";

import {
  CORE_CLASSES, PROBE_GOOD, REGISTRY, REPO_ROOT,
  lint, parseRegistry, pathTokens, runControlProbes,
} from "../gate-registry-lint.mjs";

const HERE = dirname(fileURLToPath(import.meta.url));

/** Existence oracle for fixture text: only package.json "exists". */
const probeExists = (p) => p === "package.json";

/** Run parse+lint on a registry text in one step. */
const check = (text, exists = probeExists) => lint(parseRegistry(text), exists);

// ── control probes ───────────────────────────────────────────────────────────

test("control probes pass (the gate is not broken)", () => {
  assert.deepEqual(runControlProbes(), []);
});

// ── parser: both directions ──────────────────────────────────────────────────

test("known-good registry parses cleanly with all fields and applicability kinds", () => {
  const parsed = parseRegistry(PROBE_GOOD);
  assert.deepEqual(parsed.errors, []);
  assert.deepEqual(parsed.classes, ["commerce", "organic", "landing"]);
  assert.equal(parsed.gates.length, 1);
  const g = parsed.gates[0];
  assert.equal(g.id, "probe-gate");
  assert.equal(g.severity, "blocker");
  assert.deepEqual(g.applicability.commerce, { kind: "required" });
  assert.equal(g.applicability.organic.kind, "adapted");
  assert.equal(g.applicability.landing.kind, "n_a");
});

test("unparseable lines are errors, never skipped", () => {
  const parsed = parseRegistry(PROBE_GOOD + "  - id: second\n    garbage without a colon value\n");
  assert.ok(parsed.errors.some((e) => e.includes("unparseable")));
  // and an unparseable registry FAILS the lint (front-gate stance)
  assert.ok(check(PROBE_GOOD + "  - id: second\n    garbage without a colon value\n").length > 0);
});

test("a registry with no classes line or no gates fails", () => {
  assert.ok(parseRegistry("gates:\n").errors.some((e) => e.includes("classes")));
  assert.ok(parseRegistry("classes: [commerce, organic, landing]\n").errors.some((e) => e.includes("no gates")));
});

// ── THE LAW: every class carries an explicit entry ───────────────────────────

test("a gate missing one class entry FAILS; the complete gate PASSES", () => {
  assert.deepEqual(check(PROBE_GOOD), []); // clean direction
  const missing = PROBE_GOOD.replace(/\n      landing: .*\n/, "\n");
  const violations = check(missing);
  assert.ok(violations.some((v) => v.includes('NO entry for class "landing"')), violations.join("\n"));
});

test("core classes can be extended but never shrunk", () => {
  const extended = PROBE_GOOD
    .replace("classes: [commerce, organic, landing]", "classes: [commerce, organic, landing, external]")
    .replace('      landing: { n_a: "no landing surface in the probe" }',
      '      landing: { n_a: "no landing surface in the probe" }\n      external: { n_a: "monitor-only channels carry no probe surface" }');
  assert.deepEqual(check(extended), []); // extension with full tagging passes
  // …and the extension FORCES tagging: without the external entry every gate fails
  const extendedUntagged = PROBE_GOOD.replace("classes: [commerce, organic, landing]", "classes: [commerce, organic, landing, external]");
  assert.ok(check(extendedUntagged).some((v) => v.includes('NO entry for class "external"')));
  // shrinking is a violation even if all gates are tagged consistently
  const shrunk = PROBE_GOOD
    .replace("classes: [commerce, organic, landing]", "classes: [commerce, organic]")
    .replace(/\n      landing: .*\n/, "\n");
  assert.ok(check(shrunk).some((v) => v.includes('missing core class "landing"')));
  assert.ok(CORE_CLASSES.includes("landing"));
});

test("adapted/n_a entries must carry a real how/reason", () => {
  const empty = PROBE_GOOD.replace('{ adapted: "adapted for the probe, in enough words" }', '{ adapted: "tbd" }');
  assert.ok(check(empty).some((v) => v.includes("dodge, not a decision")));
});

test("an unknown class key (typo) fails", () => {
  const typo = PROBE_GOOD.replace("      organic: {", "      organix: {");
  const violations = check(typo);
  assert.ok(violations.some((v) => v.includes('unknown class "organix"')));
  assert.ok(violations.some((v) => v.includes('NO entry for class "organic"')));
});

// ── field contract ───────────────────────────────────────────────────────────

test("missing required fields and bad enums fail; good values pass", () => {
  assert.ok(check(PROBE_GOOD.replace(/\n    severity: blocker/, "")).some((v) => v.includes("missing required field `severity`")));
  assert.ok(check(PROBE_GOOD.replace("severity: blocker", "severity: critical")).some((v) => v.includes('severity "critical"')));
  assert.ok(check(PROBE_GOOD.replace("run: automated", "run: script")).some((v) => v.includes('run "script"')));
  assert.ok(check(PROBE_GOOD.replace("status: built", "status: done")).some((v) => v.includes('status "done"')));
});

test("duplicate gate ids fail", () => {
  const dup = PROBE_GOOD + PROBE_GOOD.split("\n").filter((l) => !l.startsWith("classes:") && l !== "gates:").join("\n") + "\n";
  assert.ok(check(dup).some((v) => v.includes("duplicate id")));
});

// ── status ↔ ref honesty coupling ────────────────────────────────────────────

test("built gate naming a missing artifact fails; existing artifact passes", () => {
  assert.deepEqual(check(PROBE_GOOD), []);
  const ghost = PROBE_GOOD.replace("package.json (probe)", "scripts/ghost-gate.mjs runs in CI");
  assert.ok(check(ghost).some((v) => v.includes('"scripts/ghost-gate.mjs" but no such file exists')));
});

test("planned gates must say PLANNED; built gates must not", () => {
  const planned = PROBE_GOOD.replace("status: built", "status: planned");
  assert.ok(check(planned).some((v) => v.includes('does not start with "PLANNED"')));
  const plannedHonest = planned.replace('"package.json (probe)"', '"PLANNED: probe script"');
  assert.deepEqual(check(plannedHonest), []);
  const lying = PROBE_GOOD.replace('"package.json (probe)"', '"PLANNED: probe script"');
  assert.ok(check(lying).some((v) => v.includes("one of them is lying")));
});

test("pathTokens extracts real paths, ignores placeholders and line suffixes", () => {
  assert.deepEqual(
    pathTokens("scripts/foo.mjs via .github/workflows/gate.yml (job x) + DECISIONS.md:196"),
    ["scripts/foo.mjs", ".github/workflows/gate.yml", "DECISIONS.md"],
  );
  // <placeholder> segments break the path match — no token invented from them
  assert.deepEqual(pathTokens("evidence in launches/<domain>/ per campaign"), []);
});

// ── the REAL registry (integration — the gate on our own file) ───────────────

test("gates/registry.yaml parses clean and passes the lint against the real filesystem", () => {
  const text = readFileSync(resolve(HERE, "../..", REGISTRY), "utf8");
  const parsed = parseRegistry(text);
  assert.deepEqual(parsed.errors, []);
  assert.ok(parsed.gates.length >= 60, `expected the full inventory, got ${parsed.gates.length}`);
  const violations = lint(parsed, (p) => existsSync(join(REPO_ROOT, p)));
  assert.deepEqual(violations, []);
});
