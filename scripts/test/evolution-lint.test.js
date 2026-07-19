// evolution-lint.test.js — tests for the evolution/ register validator + the
// SE-6 continuity guard (merge plan §3.1 R1 + §5 SE-6; strict residue PKG-059).
//
// House rule (class-map-lint.test.js, merge-continuity-lint.test.js): every
// detector is tested in BOTH directions — the clean input must PASS and the
// broken input must FAIL, for the same detector, in the same run. A lint that
// always says no gets deleted; one that always says yes is a comment.
//
// house style: plain ESM + node --test; fixtures built from the exported
// probe generators; nothing mocked over the network.
import { test } from "node:test";
import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { join, resolve, dirname } from "node:path";
import { tmpdir } from "node:os";
import { fileURLToPath } from "node:url";

import {
  ANTI_PATTERNS, CHANNELS, DOMAIN_LIMITS, EVIDENCE_TIERS, GUARDED_PATHS, RADAR,
  REPO_ROOT, REQUIRED_CHANNELS, REQUIRED_STEPS, RINGS, SCOUT_FINDING_FIELDS,
  SCOUT_SCHEMA, SEED_SIGNATURES,
  extractHardGatesSection, lintAntiPatterns, lintChannels, lintRadar,
  lintScoutSchema, parseRegister, probeAntiPatterns, probeChannels, probeRadar,
  runControlProbes, seContinuityGuard,
} from "../evolution-lint.mjs";

const HERE = dirname(fileURLToPath(import.meta.url));
const LINT_BIN = resolve(HERE, "..", "evolution-lint.mjs");

// ── control probes ───────────────────────────────────────────────────────────

test("control probes pass (the gate is not broken)", () => {
  assert.deepEqual(runControlProbes(), []);
});

// ── narrow parser ────────────────────────────────────────────────────────────

test("parser: scalars, list items, empty and block sublists; junk is an error, never a skip", () => {
  const ok = parseRegister(`version: 1
status: pending-owner-ratification
rows:
  - step: "A"
    ring: adopt
    candidates: []
  - step: "B"
    candidates:
      - "first candidate"
      - "second candidate"
`);
  assert.deepEqual(ok.errors, []);
  assert.equal(ok.top.version, "1");
  assert.equal(ok.top.status, "pending-owner-ratification");
  assert.equal(ok.lists.rows.length, 2);
  assert.deepEqual(ok.lists.rows[0].candidates, []);
  assert.deepEqual(ok.lists.rows[1].candidates, ["first candidate", "second candidate"]);

  const bad = parseRegister("version: 1\n\t<<< junk line >>>\n");
  assert.equal(bad.errors.length, 1);
  assert.match(bad.errors[0], /unparseable/);
});

// ── radar: both directions per detector ──────────────────────────────────────

test("radar: known-good seeded register passes", () => {
  const r = lintRadar(probeRadar());
  assert.deepEqual(r.errors, []);
  assert.deepEqual(r.warnings, []);
});

test("radar: invalid ring enum fails", () => {
  const r = lintRadar(probeRadar({ ring: "shipped" }));
  assert.ok(r.errors.some((e) => e.includes("is not one of adopt/trial/assess/hold")));
});

test("radar: a dropped seeded OS step fails (register may grow, never quietly shrink)", () => {
  const r = lintRadar(probeRadar({ breakStep: "Google organic" }));
  assert.ok(r.errors.some((e) => e.includes('"Google organic"') && e.includes("has NO row")));
});

test("radar: review_by beyond the per-domain honesty cap fails; within the cap passes", () => {
  // ai-model rows cap at 56 days — 200 breaks them, 40 satisfies every domain
  assert.ok(lintRadar(probeRadar({ reviewOffset: 200 })).errors.some((e) => e.includes("staleness cap")));
  assert.deepEqual(lintRadar(probeRadar({ reviewOffset: 40 })).errors, []);
});

test("radar: review_by before last_reviewed fails", () => {
  const text = probeRadar().replace(/review_by: "[^"]+"/g, 'review_by: "2020-01-01"');
  const r = lintRadar(text);
  assert.ok(r.errors.some((e) => e.includes("must be after last_reviewed")));
});

test("radar: missing field fails; candidates must be present as a list", () => {
  const noTool = probeRadar().replace(/    current_tool: "probe incumbent"\n/, "");
  assert.ok(lintRadar(noTool).errors.some((e) => e.includes("missing current_tool")));
  const noCand = probeRadar().replace(/    candidates: \[\]\n/, "");
  assert.ok(lintRadar(noCand).errors.some((e) => e.includes("candidates must be a list")));
});

test("radar: a STALE row is a loud WARNING, never an error (both directions)", () => {
  const fresh = lintRadar(probeRadar());
  assert.deepEqual(fresh.warnings, []);
  const stale = lintRadar(probeRadar(), { today: new Date("2099-01-01") });
  assert.deepEqual(stale.errors, []);
  assert.ok(stale.warnings.length > 0);
  assert.match(stale.warnings[0], /STALE/);
  assert.match(stale.warnings[0], /not a failure/);
});

test("radar: pinned domain per seeded step (an ai-model row cannot slide to doctrine cadence)", () => {
  const r = lintRadar(probeRadar({ domainOverride: "doctrine", reviewOffset: 40 }));
  assert.ok(r.errors.some((e) => e.includes('"Agent runtime (OS layer)"') && e.includes('domain must be "ai-model"')));
});

// ── channels: both directions per detector ───────────────────────────────────

test("channels: known-good register passes", () => {
  assert.deepEqual(lintChannels(probeChannels()).errors, []);
});

test("channels: missing status header fails; unknown status fails; ratified needs ratified_ref", () => {
  assert.ok(lintChannels(probeChannels().replace(/^status: .*\n/m, "")).errors.some((e) => e.includes("status header MISSING")));
  assert.ok(lintChannels(probeChannels({ status: "approved" })).errors.some((e) => e.includes("is not one of")));
  assert.ok(lintChannels(probeChannels({ status: "ratified" })).errors.some((e) => e.includes("without ratified_ref")));
  const ratified = probeChannels({ status: "ratified" }).replace(/^status: ratified$/m, 'status: ratified\nratified_ref: "D-20260720-01"');
  assert.deepEqual(lintChannels(ratified).errors, []);
});

test("channels: a forum promoted out of the untrusted tier fails (pin)", () => {
  const r = lintChannels(probeChannels({ tierOverride: { id: "reddit-seo", tier: "tier1-vendor" } }));
  assert.ok(r.errors.some((e) => e.includes('"reddit-seo"') && e.includes("PINNED")));
});

test("channels: a daily vendor feed slowed to weekly fails (cadence pin)", () => {
  const slowed = probeChannels().replace(
    /- id: shopify-changelog\n    name: "[^"]+"\n    url: "[^"]+"\n    tier: tier1-vendor\n    cadence: daily/,
    (s) => s.replace("cadence: daily", "cadence: weekly"));
  assert.ok(lintChannels(slowed).errors.some((e) => e.includes('"shopify-changelog"') && e.includes("PINNED")));
});

test("channels: an untrusted-forum row without the SE-3 corroboration note fails", () => {
  const r = lintChannels(probeChannels({ notesOverride: { id: "hn-front", notes: "interesting links live here" } }));
  assert.ok(r.errors.some((e) => e.includes("SE-3 corroboration")));
});

test("channels: a dropped plan-named channel fails; extra channels are allowed", () => {
  assert.ok(lintChannels(probeChannels({ dropId: "anthropic-claude-code" })).errors.some((e) => e.includes("MISSING")));
  const extra = probeChannels() + `  - id: extra-channel
    name: "probe extra"
    url: "https://example.com/extra"
    tier: tier2-research
    cadence: weekly
    notes: "candidate addition awaiting the owner's word"
`;
  assert.deepEqual(lintChannels(extra).errors, []);
});

test("channels: http:// url and bad cadence fail", () => {
  const httpUrl = probeChannels().replace('url: "https://example.com/hn-front"', 'url: "http://example.com/hn-front"');
  assert.ok(lintChannels(httpUrl).errors.some((e) => e.includes("must be https://")));
  const badCadence = probeChannels().replace("cadence: monthly", "cadence: quarterly");
  assert.ok(lintChannels(badCadence).errors.some((e) => e.includes('cadence "quarterly"')));
});

// ── anti-patterns: both directions per detector ──────────────────────────────

test("anti-patterns: known-good seeded register passes", () => {
  assert.deepEqual(lintAntiPatterns(probeAntiPatterns()).errors, []);
});

test("anti-patterns: a dropped plan-§8 seed fails (append-only)", () => {
  const r = lintAntiPatterns(probeAntiPatterns({ dropSig: "CONDITIONAL_GO as a gate-pass" }));
  assert.ok(r.errors.some((e) => e.includes("append-only")));
});

test("anti-patterns: trivial reopen_conditions fails; substantive passes", () => {
  assert.ok(lintAntiPatterns(probeAntiPatterns({ reopenOverride: "never" })).errors.some((e) => e.includes("trivial")));
  assert.deepEqual(lintAntiPatterns(probeAntiPatterns()).errors, []);
});

test("anti-patterns: invalid date and reversed dates fail; past review_by is a warning only", () => {
  const badDate = probeAntiPatterns().replace(/rejected_date: "[^"]+"/, 'rejected_date: "someday"');
  assert.ok(lintAntiPatterns(badDate).errors.some((e) => e.includes("not a valid YYYY-MM-DD")));
  const reversed = probeAntiPatterns().replace(/review_by: "[^"]+"/g, 'review_by: "2020-01-01"');
  assert.ok(lintAntiPatterns(reversed).errors.some((e) => e.includes("must be after rejected_date")));
  const stale = lintAntiPatterns(probeAntiPatterns(), { today: new Date("2099-01-01") });
  assert.deepEqual(stale.errors, []);
  assert.ok(stale.warnings.some((w) => w.includes("STALE")));
});

// ── scout schema: both directions per detector ───────────────────────────────

const realSchema = () => readFileSync(resolve(REPO_ROOT, SCOUT_SCHEMA), "utf8");

test("scout schema: the committed file passes every SE-1/SE-2 structural check", () => {
  assert.deepEqual(lintScoutSchema(realSchema()).errors, []);
});

test("scout schema: additionalProperties true (any level) fails", () => {
  const root = realSchema().replace('"additionalProperties": false,', '"additionalProperties": true,');
  assert.ok(lintScoutSchema(root).errors.some((e) => e.includes("additionalProperties must be false")));
  const s = JSON.parse(realSchema());
  s.properties.findings.items.additionalProperties = true;
  assert.ok(lintScoutSchema(JSON.stringify(s)).errors.some((e) => e.includes("instruction-smuggling")));
});

test("scout schema: a smuggled instruction-bearing field fails; the fixed field set passes", () => {
  const s = JSON.parse(realSchema());
  s.properties.findings.items.properties.agent_instructions = { type: "string" };
  s.properties.findings.items.required.push("agent_instructions");
  const r = lintScoutSchema(JSON.stringify(s));
  assert.ok(r.errors.some((e) => e.includes("EXACTLY")));
  assert.deepEqual(
    Object.keys(JSON.parse(realSchema()).properties.findings.items.properties).sort(),
    [...SCOUT_FINDING_FIELDS].sort());
});

test("scout schema: evidence_tier and ring enums are pinned; drift fails", () => {
  const s = JSON.parse(realSchema());
  s.properties.findings.items.properties.evidence_tier.enum = ["measured", "vendor", "anecdote", "vibes"];
  assert.ok(lintScoutSchema(JSON.stringify(s)).errors.some((e) => e.includes("evidence_tier enum")));
  const s2 = JSON.parse(realSchema());
  const obj = s2.properties.findings.items.properties.proposed_ring_change.oneOf.find((b) => b.type === "object");
  obj.properties.to.enum = ["adopt"];
  assert.ok(lintScoutSchema(JSON.stringify(s2)).errors.some((e) => e.includes("mirror the radar rings")));
  assert.deepEqual(EVIDENCE_TIERS, ["measured", "vendor", "anecdote"]);
  assert.deepEqual(RINGS, ["adopt", "trial", "assess", "hold"]);
});

test("scout schema: header without the NFKC/injection ingest law fails", () => {
  const s = JSON.parse(realSchema());
  s.$comment = "a schema";
  const r = lintScoutSchema(JSON.stringify(s));
  assert.ok(r.errors.some((e) => e.includes("Unicode-normalization")));
  assert.ok(r.errors.some((e) => e.includes("injection-screen")));
});

test("scout schema: invalid JSON fails", () => {
  assert.ok(lintScoutSchema("{ not json").errors.some((e) => e.includes("not valid JSON")));
});

// ── SE-6 continuity guard: both directions ───────────────────────────────────

test("SE-6: evolution + each guarded surface fails; either half alone passes", () => {
  for (const g of GUARDED_PATHS) {
    const guarded = g.path ?? `${g.prefix}mcb.md`;
    const bundled = seContinuityGuard(["evolution/channels.yaml", guarded], false);
    assert.ok(bundled.length === 1 && bundled[0].includes("SE-6 CONTINUITY VIOLATION"), `bundle with ${guarded} must fail`);
    assert.deepEqual(seContinuityGuard([guarded], false), [], `${guarded} alone must pass`);
  }
  assert.deepEqual(seContinuityGuard(["evolution/channels.yaml", "docs/reports/x.md"], false), []);
});

test("SE-6: CLAUDE.md guarded at HARD-GATES-SECTION altitude, not file altitude", () => {
  assert.equal(seContinuityGuard(["evolution/radar.yaml", "CLAUDE.md"], true).length, 1);
  assert.deepEqual(seContinuityGuard(["evolution/radar.yaml", "CLAUDE.md"], false), []);
});

test("SE-6: multiple guarded surfaces each get their own violation line", () => {
  const r = seContinuityGuard(["evolution/radar.yaml", "scripts/front-gate.mjs", "gates/registry.yaml"], false);
  assert.equal(r.length, 2);
});

test("extractHardGatesSection: pulls the section, stable under edits elsewhere", () => {
  const doc = "# Title\n## HARD GATES — NEVER VIOLATE\n1. one\n2. two\n## NEXT SECTION\nbody\n";
  const section = extractHardGatesSection(doc);
  assert.match(section, /^## HARD GATES/);
  assert.ok(section.includes("2. two"));
  assert.ok(!section.includes("NEXT SECTION"));
  // an edit OUTSIDE the section leaves the extraction identical
  assert.equal(extractHardGatesSection(doc.replace("body", "edited body")), section);
  // an edit INSIDE it does not
  assert.notEqual(extractHardGatesSection(doc.replace("2. two", "2. two-changed")), section);
  assert.equal(extractHardGatesSection("no gates here"), "");
  // the real CLAUDE.md has the section and it ends before the next ## heading
  const real = extractHardGatesSection(readFileSync(resolve(REPO_ROOT, "CLAUDE.md"), "utf8"));
  assert.match(real, /^## HARD GATES/);
  assert.ok(real.includes("Never submit a disavow file"));
  assert.ok(!real.includes("KTAHV LANGUAGE LOCK"));
});

// ── the real registers + CLI ─────────────────────────────────────────────────

test("real registers: radar/channels/anti-patterns/scout-schema all pass the real lint", () => {
  assert.deepEqual(lintRadar(readFileSync(resolve(REPO_ROOT, RADAR), "utf8")).errors, []);
  assert.deepEqual(lintChannels(readFileSync(resolve(REPO_ROOT, CHANNELS), "utf8")).errors, []);
  assert.deepEqual(lintAntiPatterns(readFileSync(resolve(REPO_ROOT, ANTI_PATTERNS), "utf8")).errors, []);
  assert.deepEqual(lintScoutSchema(realSchema()).errors, []);
});

test("real channels register: awaits owner ratification loudly; forums stay untrusted", () => {
  const { top, lists } = parseRegister(readFileSync(resolve(REPO_ROOT, CHANNELS), "utf8"));
  assert.equal(top.status, "pending-owner-ratification");
  for (const [id, pin] of Object.entries(REQUIRED_CHANNELS)) {
    const row = lists.channels.find((c) => c.id === id);
    assert.ok(row, `required channel ${id} present`);
    assert.equal(row.tier, pin.tier);
  }
});

test("real radar: every gap-list stage + both OS-layer ai-model rows present", () => {
  const { lists } = parseRegister(readFileSync(resolve(REPO_ROOT, RADAR), "utf8"));
  const steps = lists.rows.map((r) => r.step);
  for (const step of Object.keys(REQUIRED_STEPS)) assert.ok(steps.includes(step), `radar row for "${step}"`);
  assert.equal(Object.keys(REQUIRED_STEPS).length, 20);
  assert.equal(Object.values(REQUIRED_STEPS).filter((d) => d === "ai-model").length, 2);
  assert.ok(DOMAIN_LIMITS["ai-model"] <= 56);
});

test("real anti-patterns: all 7 plan-§8 seeds present", () => {
  const { lists } = parseRegister(readFileSync(resolve(REPO_ROOT, ANTI_PATTERNS), "utf8"));
  assert.equal(SEED_SIGNATURES.length, 7);
  for (const sig of SEED_SIGNATURES)
    assert.ok(lists.patterns.some((p) => p.signature === sig), `seed "${sig}" present`);
});

test("CLI: exits 0 on the real registers; --base HEAD engages the SE-6 guard cleanly", () => {
  const plain = spawnSync(process.execPath, [LINT_BIN], { encoding: "utf8" });
  assert.equal(plain.status, 0, plain.stdout + plain.stderr);
  assert.match(plain.stdout, /PASS/);
  const based = spawnSync(process.execPath, [LINT_BIN, "--base", "HEAD"], { cwd: REPO_ROOT, encoding: "utf8" });
  assert.equal(based.status, 0, based.stdout + based.stderr);
  assert.match(based.stdout, /SE-6 guard/);
});

test("CLI: a broken register exits 2 with a violation (spawned, real bin)", () => {
  const dir = mkdtempSync(join(tmpdir(), "evolution-lint-"));
  try {
    const doctored = join(dir, "radar.yaml");
    writeFileSync(doctored, probeRadar({ ring: "shipped" }));
    const r = spawnSync(process.execPath, [LINT_BIN, "--radar", doctored], { encoding: "utf8" });
    assert.equal(r.status, 2, r.stdout + r.stderr);
    assert.match(r.stdout, /VIOLATION/);
    assert.match(r.stdout, /is not one of adopt\/trial\/assess\/hold/);
  } finally {
    rmSync(dir, { recursive: true, force: true });
  }
});
