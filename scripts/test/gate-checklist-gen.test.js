// gate-checklist-gen.test.js — tests for the registry→checklist generator
// (CLAUDE.md §GATE REGISTRY: per-site ship checklists are GENERATED from the
// registry by site class, never hand-written; O6 of the PROMPT 5 report).
//
// House rule (gate-registry-lint.test.js and siblings): every detector is
// tested in BOTH directions — the clean input must PASS and the broken input
// must FAIL, for the same detector, in the same run.
//
// house style: plain ESM + node --test.
import { test } from "node:test";
import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";
import { join, resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";

import { PROBE_GOOD, REGISTRY, REPO_ROOT, parseRegistry } from "../gate-registry-lint.mjs";
import {
  SEVERITY_ORDER, assertKnownDomain, generateChecklist, knownDomains, runControlProbes,
} from "../gate-checklist-gen.mjs";

const HERE = dirname(fileURLToPath(import.meta.url));

/** Existence oracle for fixture text: only package.json "exists". */
const probeExists = (p) => p === "package.json";
/** Existence oracle for the real registry: the real filesystem. */
const realExists = (p) => existsSync(join(REPO_ROOT, p));

const META = { registryCommit: "abc1234", generatedAt: "2026-07-18 00:00:00 IST" };
const gen = (text, siteClass, exists = probeExists, extra = {}) =>
  generateChecklist(text, { domain: "probe.example", siteClass, exists, ...META, ...extra });

const REAL = readFileSync(resolve(HERE, "../..", REGISTRY), "utf8");

/** Checkbox row for a gate id (exactly the generator's row shape). */
const rowRe = (id) => new RegExp(`^- \\[ \\] \`${id}\` — `, "gm");
/** N/A-section row for a gate id (no checkbox, by design). */
const naRe = (id) => new RegExp(`^- \`${id}\` — .+ · n/a: `, "gm");

// ── control probes ───────────────────────────────────────────────────────────

test("control probes pass (the generator is not broken)", () => {
  assert.deepEqual(runControlProbes(), []);
});

// ── THE LAW: every gate accounted for, exactly once, never silently ──────────

test("real registry, every class: every non-n_a gate is exactly one checkbox row; every n_a gate is in the N/A section with its reason", () => {
  const parsed = parseRegistry(REAL);
  assert.deepEqual(parsed.errors, []);
  for (const cls of parsed.classes) {
    const md = gen(REAL, cls, realExists);
    let checkboxes = 0;
    for (const g of parsed.gates) {
      const kind = g.applicability[cls].kind;
      const rows = (md.match(rowRe(g.id)) ?? []).length;
      const nas = (md.match(naRe(g.id)) ?? []).length;
      if (kind === "n_a") {
        assert.equal(rows, 0, `${cls}/${g.id}: n_a gate must not be a checkbox row`);
        assert.equal(nas, 1, `${cls}/${g.id}: n_a gate must appear once in the N/A section`);
        assert.ok(md.includes(g.applicability[cls].reason), `${cls}/${g.id}: n_a reason dropped — no-silence law`);
      } else {
        assert.equal(rows, 1, `${cls}/${g.id}: ${kind} gate must appear exactly once as a checkbox row`);
        assert.equal(nas, 0, `${cls}/${g.id}: ${kind} gate must not be in the N/A section`);
        checkboxes += 1;
      }
    }
    // and the file contains no checkbox rows beyond the registry's gates
    assert.equal((md.match(/^- \[ \] `/gm) ?? []).length, checkboxes, `${cls}: stray checkbox rows`);
  }
});

test("adapted rows carry the how-text; required rows say required", () => {
  const md = gen(PROBE_GOOD, "organic"); // probe-gate is adapted for organic
  assert.match(md, /^- \[ \] `probe-gate` — .+ · organic: adapted$/m);
  assert.ok(md.includes("adapted for organic: adapted for the probe, in enough words"));
  const mdReq = gen(PROBE_GOOD, "commerce"); // probe-gate is required for commerce
  assert.match(mdReq, /^- \[ \] `probe-gate` — .+ · commerce: required$/m);
  assert.ok(!mdReq.includes("adapted for commerce:"));
});

// ── refusals: loud, never a silent skip ──────────────────────────────────────

test("an unknown class refuses; a declared class generates", () => {
  assert.throws(() => gen(PROBE_GOOD, "bogus"), /unknown class "bogus"/);
  assert.ok(gen(PROBE_GOOD, "commerce").length > 0); // clean direction
});

test("a lint-failing registry refuses; the clean registry generates", () => {
  const missing = PROBE_GOOD.replace(/\n      landing: .*\n/, "\n");
  assert.throws(() => gen(missing, "commerce"), /refusing to generate/);
  assert.ok(gen(PROBE_GOOD, "commerce").length > 0); // clean direction
});

test("an unknown domain refuses; a real domain passes", () => {
  const domains = knownDomains();
  assert.ok(domains.includes("arogyakendra.com"), `expected arogyakendra.com in ${domains.join(", ")}`);
  assert.doesNotThrow(() => assertKnownDomain("arogyakendra.com", domains));
  assert.throws(() => assertKnownDomain("no-such-site.example", domains), /unknown domain "no-such-site\.example"/);
});

// ── determinism & ordering ───────────────────────────────────────────────────

test("output is deterministic: same inputs, byte-identical output", () => {
  for (const cls of ["commerce", "organic", "landing"]) {
    assert.equal(gen(REAL, cls, realExists), gen(REAL, cls, realExists));
  }
});

test("severity groups appear in contract order: blocker → high → advisory", () => {
  const md = gen(REAL, "organic", realExists);
  const idx = SEVERITY_ORDER.map((s) => md.indexOf(`## ${s[0].toUpperCase()}${s.slice(1)} —`));
  assert.ok(idx.every((i) => i >= 0), `missing a severity section (${idx.join(", ")})`);
  assert.ok(idx[0] < idx[1] && idx[1] < idx[2], `sections out of order (${idx.join(", ")})`);
});

// ── header provenance ────────────────────────────────────────────────────────

test("header carries generated-by, registry commit, IST second-precision stamp, and DO NOT HAND-EDIT", () => {
  const md = gen(REAL, "organic", realExists, { registryCommit: "deadbee", generatedAt: "2026-07-18 20:15:42 IST" });
  assert.ok(md.startsWith("# Ship checklist — probe.example · class: organic"));
  assert.ok(md.includes("Generated-by: `node scripts/gate-checklist-gen.mjs --domain probe.example --class organic`"));
  assert.ok(md.includes("`gates/registry.yaml` @ deadbee"));
  assert.ok(md.includes("2026-07-18 20:15:42 IST"));
  assert.ok(md.includes("DO NOT HAND-EDIT — regenerate from gates/registry.yaml"));
});

// ── the summary line is arithmetic, not prose ────────────────────────────────

test("summary counts equal the registry's per-class kind counts", () => {
  const parsed = parseRegistry(REAL);
  for (const cls of parsed.classes) {
    const kinds = { required: 0, adapted: 0, n_a: 0 };
    for (const g of parsed.gates) kinds[g.applicability[cls].kind] += 1;
    const md = gen(REAL, cls, realExists);
    assert.ok(
      md.includes(`**${parsed.gates.length} gates in the registry · ${kinds.required} required + ${kinds.adapted} adapted = ${kinds.required + kinds.adapted} to clear for class ${cls} · ${kinds.n_a} explicitly n/a`),
      `${cls}: summary line does not match the registry arithmetic`,
    );
  }
});
