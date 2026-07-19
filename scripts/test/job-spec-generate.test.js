// job-spec-generate.test.js — tests for the M2 job-spec generator
// (CLAUDE.md §OS v2 DOCTRINE 4 / plan §2.7; M0(a) disposition 4; EX-1/EX-3).
//
// House rule (class-map-lint.test.js, merge-continuity-lint.test.js): every
// detector is tested in BOTH directions — the clean input must PASS and the
// broken input must FAIL, for the same detector, in the same run.
//
// house style: plain ESM + node --test; fixtures in tmp dirs; nothing mocked
// over the network.
import { test } from "node:test";
import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { join, resolve, dirname } from "node:path";
import { tmpdir } from "node:os";
import { fileURLToPath } from "node:url";

import {
  FIXTURE_ISSUE, FIXTURE_ISSUE_ID, FIXTURE_ISSUE_REF, FOREVER_HUMAN_FLOOR,
  REPO_ROOT, RISK_TIERS_PATH, T1_TIER,
  generateEnvelope, generateProhibitions, istToUtc, lintRiskTiersFloor,
  loadDoctrine, parseEnvelope, parseHardGates, parseIssuesFile, parseRiskTiers,
  prohibitionId, scanT1, serializeEnvelope, splitInline, validateEnvelope,
  vetRequestedActions,
} from "../job-spec-generate.mjs";

const HERE = dirname(fileURLToPath(import.meta.url));
const BIN = resolve(HERE, "..", "job-spec-generate.mjs");
const NOW = "2026-07-19 20:00:00 IST";

// Real doctrine, loaded once — the generator must work against the actual
// repo files (CLAUDE.md, gates/registry.yaml, gates/class-map.yaml,
// gates/risk-tiers.yaml), not only probes.
const doctrine = loadDoctrine({});
const fixtureIssue = parseIssuesFile(FIXTURE_ISSUE).issues.find((i) => i.id === FIXTURE_ISSUE_ID);

const gen = (issueOverrides = {}, opts = {}) =>
  generateEnvelope({
    issue: { ...fixtureIssue, ...issueOverrides },
    issueRef: FIXTURE_ISSUE_REF,
    doctrine: opts.doctrine ?? doctrine,
    builder: opts.builder,
    verifier: opts.verifier,
    now: NOW,
  });

/* ───────────────────────── doctrine loading ───────────────────────── */

test("real doctrine loads clean (CLAUDE.md hard gates, registry, class-map, risk-tiers floor)", () => {
  assert.deepEqual(doctrine.errors, []);
  assert.equal(doctrine.hard.gates.size >= 15, true);
  assert.ok(doctrine.hard.noSelfApproval);
});

test("parseHardGates fail-closed: missing section, missing gate, missing NSA line all refuse", () => {
  assert.ok(parseHardGates("# no gates here\n## SOMETHING ELSE\n").errors.length > 0);
  const claude = readFileSync(join(REPO_ROOT, "CLAUDE.md"), "utf8");
  const clean = parseHardGates(claude);
  assert.deepEqual(clean.errors, []);
  // drop gate 10 → refuse
  const g10 = claude.replace(/^10\. \*\*/m, "SUPPRESSED ");
  assert.ok(parseHardGates(g10).errors.some((e) => e.includes("gate 10")));
  // drop the no-self-approval line → refuse
  const nsa = claude.replace(/^\*\*No self-approval of P0\/P1 evidence\*\*/m, "(gone)");
  assert.ok(parseHardGates(nsa).errors.some((e) => e.includes("No self-approval")));
});

/* ───────────────────────── generation from the fixture ───────────────────────── */

test("generation from the fixture issue produces a full envelope", () => {
  const { envelope, errors } = gen();
  assert.deepEqual(errors, []);
  assert.equal(envelope.issue, FIXTURE_ISSUE_REF);
  assert.equal(envelope.scope, "change");
  assert.equal(envelope.site, "ayurvedichealingvillage.com");
  assert.equal(envelope.entity, "ktahv-clinical");
  assert.deepEqual(envelope.locales, ["en", "de", "fr"]);
  assert.ok(envelope.authorized_tools.length > 0);
  assert.ok(envelope.prohibited_actions.length > 0);
  assert.ok(envelope.definition_of_done.includes("Dr. Deepu John"));
  assert.equal(envelope.generated_at, NOW);
  assert.equal(envelope.generated_at_utc, istToUtc(NOW));
  // change-scope resolution actually fired the diff-sensitive resolver:
  // page.tsx under app/** must pull keyword-map + meta-canonical-crawl-files
  const gateIds = envelope.authorized_tools.filter((t) => t.startsWith("gate:")).map((t) => t.slice(5).split(" ")[0]);
  assert.ok(gateIds.includes("keyword-map"), `keyword-map in ${gateIds}`);
  assert.ok(gateIds.includes("meta-canonical-crawl-files"));
  // run:human gates are NEVER in the agent lane
  const humanIds = (envelope.human_gates ?? []).map((t) => t.slice(5).split(" ")[0]);
  assert.ok(humanIds.includes("preview-approval"), `preview-approval must be a human gate, got ${humanIds}`);
  assert.ok(!gateIds.includes("preview-approval"));
});

test("deterministic output: same inputs + same --now => same bytes", () => {
  const a = serializeEnvelope(gen().envelope);
  const b = serializeEnvelope(gen().envelope);
  assert.equal(a, b);
});

test("envelope round-trips through the narrow parser", () => {
  const { envelope } = gen();
  const { env, errors } = parseEnvelope(serializeEnvelope(envelope));
  assert.deepEqual(errors, []);
  assert.equal(env.issue, envelope.issue);
  assert.deepEqual(env.prohibited_actions, envelope.prohibited_actions);
  assert.equal(env.cost_budget.tokens_max, "400000");
});

/* ───────────────────────── prohibited-actions superset property ───────────────────────── */

test("prohibitions ⊇ HARD GATE ids (HG-1..15 + HG-NSA), registry blockers, and T1 actions", () => {
  const { envelope } = gen();
  const ids = new Set(envelope.prohibited_actions.map(prohibitionId));
  for (let n = 1; n <= 15; n++) assert.ok(ids.has(`HG-${n}`), `HG-${n} missing`);
  assert.ok(ids.has("HG-NSA"));
  const blockers = doctrine.reg.gates.filter((g) => g.severity === "blocker");
  assert.ok(blockers.length > 0, "registry has blocker rows");
  for (const g of blockers) assert.ok(ids.has(`REG:${g.id}`), `REG:${g.id} missing`);
  for (const id of FOREVER_HUMAN_FLOOR) assert.ok(ids.has(`T1:${id}`), `T1:${id} missing`);
});

test("superset property is re-proven at --check: a narrowed envelope FAILS, the full one PASSES", () => {
  const { envelope } = gen();
  const full = parseEnvelope(serializeEnvelope(envelope)).env;
  assert.deepEqual(validateEnvelope(full, { issue: fixtureIssue, doctrine }), []);
  const narrowed = { ...full, prohibited_actions: full.prohibited_actions.filter((p) => prohibitionId(p) !== "HG-1") };
  const errs = validateEnvelope(narrowed, { issue: fixtureIssue, doctrine });
  assert.ok(errs.some((e) => e.includes("NARROWER") && e.includes("HG-1")), errs.join("\n"));
});

/* ───────────────────────── budget-required refusal ───────────────────────── */

test("a spec without a budget is refused (no default) — and a budgeted one is not", () => {
  assert.deepEqual(gen().errors, []); // budgeted: passes
  for (const bad of [undefined, null, {}, { tokens_max: "0" }, { usd_max: "-1" }, { wall_clock_minutes: "30" }]) {
    const { envelope, errors } = gen({ cost_budget: bad });
    assert.equal(envelope, null);
    assert.ok(errors.some((e) => e.includes("cost_budget")), `expected budget refusal for ${JSON.stringify(bad)}`);
  }
});

/* ───────────────────────── builder == verifier refusal (EX-3) ───────────────────────── */

test("builder == verifier is refused; distinct sessions pass; missing either is refused", () => {
  assert.deepEqual(gen().errors, []); // fixture has distinct sessions
  const same = gen({ builder_session: "s-1", verifier_session: "s-1" });
  assert.ok(same.errors.some((e) => e.includes("EX-3")));
  const missing = gen({ builder_session: "s-1", verifier_session: "" });
  assert.ok(missing.errors.some((e) => e.includes("verifier_session")));
  // flags override the row — and the refusal fires on flags too
  const viaFlags = gen({}, { builder: "s-x", verifier: "s-x" });
  assert.ok(viaFlags.errors.some((e) => e.includes("EX-3")));
});

/* ───────────────────────── T1 refusal (EX-1 risk tiers) ───────────────────────── */

test("a spec authorizing a T1 action is refused; a clean tool request passes", () => {
  const ok = gen({ spec_requested_tools: ["playwright", "wp-rest-staging"] });
  assert.deepEqual(ok.errors, []);
  for (const t1 of ["dns-cutover", "disavow", "theme-publish", "admin-bypass"]) {
    const { errors } = gen({ spec_requested_tools: [t1] });
    assert.ok(errors.some((e) => e.includes("T1 forever-human")), `expected T1 refusal for "${t1}": ${errors.join("; ")}`);
  }
});

test("run:human gate smuggled into authorized_tools fails validation", () => {
  const { envelope } = gen();
  const env = parseEnvelope(serializeEnvelope(envelope)).env;
  env.authorized_tools = [...env.authorized_tools, "gate:dns-go-live · smuggled"];
  const errs = validateEnvelope(env, { issue: fixtureIssue, doctrine });
  assert.ok(errs.some((e) => e.includes("smuggled") || e.includes("run:human")), errs.join("\n"));
});

test("risk-tier floor: real file passes; moving a floor action below T1 refuses; deleting it refuses", () => {
  const realText = readFileSync(join(REPO_ROOT, RISK_TIERS_PATH), "utf8");
  const real = parseRiskTiers(realText);
  assert.deepEqual(real.errors, []);
  assert.deepEqual(lintRiskTiersFloor(real), []);
  // every floor id is present and T1 in the real file
  for (const id of FOREVER_HUMAN_FLOOR) {
    const row = real.action_types.find((a) => a.id === id);
    assert.ok(row, `floor id ${id} present in risk-tiers.yaml`);
    assert.equal(row.tier, T1_TIER);
  }
  // demote dns → refusal
  const demoted = parseRiskTiers(realText.replace(
    /- id: dns-robots-htaccess-permalinks\n    tier: T1-forever-human/,
    "- id: dns-robots-htaccess-permalinks\n    tier: T4-routine"));
  assert.ok(lintRiskTiersFloor(demoted).some((e) => e.includes("dns-robots-htaccess-permalinks") && e.includes("NEVER map lower")));
  // delete disavow row's id → missing-floor refusal
  const deleted = parseRiskTiers(realText.replace(/- id: disavow-submission/, "- id: disavow-submission-renamed"));
  assert.ok(lintRiskTiersFloor(deleted).some((e) => e.includes('"disavow-submission" MISSING')));
});

/* ───────────────────────── DEFAULT-DENY action vocabulary (external-review
   adoption, 19 Jul 2026: the boundary is the declared vocabulary; the
   keyword net is the second line of defense, never the boundary) ───────── */

test("default-deny vocabulary: 'release to live' (unknown kind) is refused as T1", () => {
  // No match_token contains "release" or "live" — the OLD keyword-only
  // control would have let this through. The vocabulary boundary refuses it.
  assert.equal(scanT1(["requested:release to live"], doctrine.riskTiers).length, 0,
    "precondition: the keyword net alone does NOT catch this phrasing — the vocabulary must");
  const { envelope, errors } = gen({ spec_requested_tools: ["release to live"] });
  assert.equal(envelope, null);
  assert.ok(errors.some((e) => e.includes("NOT in the declared action vocabulary") && e.includes("forever-human until the owner tiers it")), errors.join("\n"));
  // same for any unnamed state-changing tool nobody enumerated
  const unk = gen({ spec_requested_tools: ["some-new-shiny-tool"] });
  assert.equal(unk.envelope, null);
  assert.ok(unk.errors.some((e) => e.includes("NOT in the declared action vocabulary")));
});

test("vocabulary: declared T4 kind passes; declared T1 kind is refused by tier", () => {
  const ok = gen({ spec_requested_tools: ["playwright"] });
  assert.deepEqual(ok.errors, []);
  assert.ok(ok.envelope.authorized_tools.some((t) => t === "requested:playwright · tier:T4-routine"),
    `tier annotation recorded: ${ok.envelope.authorized_tools.join("; ")}`);
  const bad = gen({ spec_requested_tools: ["dns-cutover"] });
  assert.equal(bad.envelope, null);
  assert.ok(bad.errors.some((e) => e.includes(`declared ${T1_TIER} in the action vocabulary`)), bad.errors.join("\n"));
});

test("vetRequestedActions fires at --check too: a hand-added unknown requested entry fails", () => {
  const { envelope } = gen();
  const env = parseEnvelope(serializeEnvelope(envelope)).env;
  env.authorized_tools = [...(env.authorized_tools ?? []), "requested:release to live"];
  const errs = validateEnvelope(env, { issue: fixtureIssue, doctrine });
  assert.ok(errs.some((e) => e.includes("NOT in the declared action vocabulary")), errs.join("\n"));
});

test("vocabulary lint: missing vocabulary, undeclared tier, T1 kind without maps_to all refuse", () => {
  const realText = readFileSync(join(REPO_ROOT, RISK_TIERS_PATH), "utf8");
  // strip the whole actions: section → doctrine load must refuse loudly
  const stripped = parseRiskTiers(realText.slice(0, realText.indexOf("\nactions:")));
  assert.ok(lintRiskTiersFloor(stripped).some((e) => e.includes("actions: vocabulary missing/empty")));
  // vet against an empty vocabulary: EVERYTHING is denied (fail-closed)
  assert.ok(vetRequestedActions(["playwright"], stripped).length > 0);
  const real = parseRiskTiers(realText);
  // undeclared tier on a kind
  const badTier = parseRiskTiers(realText.replace(
    "- kind: playwright\n    tier: T4-routine",
    "- kind: playwright\n    tier: T9-imaginary"));
  assert.ok(lintRiskTiersFloor(badTier).some((e) => e.includes('undeclared tier "T9-imaginary"')));
  // T1 kind must cite its action_types row
  const noMap = parseRiskTiers(realText.replace(
    "- kind: disavow\n    tier: T1-forever-human\n    maps_to: disavow-submission",
    "- kind: disavow\n    tier: T1-forever-human"));
  assert.ok(lintRiskTiersFloor(noMap).some((e) => e.includes('T1 vocabulary kind "disavow" must cite')));
  assert.deepEqual(lintRiskTiersFloor(real), []); // and the real file stays clean
});

test("scanT1 token matching is whole-token, case-insensitive", () => {
  const rt = doctrine.riskTiers;
  assert.ok(scanT1(["requested:DNS-cutover"], rt).length > 0);
  assert.ok(scanT1(["requested:playwright"], rt).length === 0);
  // token must not fire on substrings of longer words: "disavowal-analysis-doc" still
  // contains the whole token "disavow" bounded by "-", so it DOES fire (fail-closed)…
  assert.ok(scanT1(["requested:disavow-analysis"], rt).length > 0);
  // …but an unrelated word does not
  assert.ok(scanT1(["requested:screwdriver"], rt).length === 0);
});

/* ───────────────────────── fail-closed change resolution ───────────────────────── */

test("change with no trigger match and no content-only declaration runs the FULL battery", () => {
  const { envelope, errors } = gen({ spec_change_paths: ["docs/some/unclassifiable.md"], spec_change_kinds: [] });
  assert.deepEqual(errors, []);
  assert.ok(envelope.gate_resolution.includes("FAIL-CLOSED"), envelope.gate_resolution);
  const changeCount = gen().envelope.authorized_tools.length + gen().envelope.human_gates.length;
  const fullCount = envelope.authorized_tools.length + envelope.human_gates.length;
  assert.ok(fullCount > changeCount, `full battery (${fullCount}) must exceed the diff subset (${changeCount})`);
});

test("unknown site (no class-map property) is refused, never guessed", () => {
  const { errors } = gen({ site: "not-a-fleet-domain.example" });
  assert.ok(errors.some((e) => e.includes("no properties: row")));
});

/* ───────────────────────── issue-file parsing + hash binding ───────────────────────── */

test("parseIssuesFile reads the fixture register clean; quote-aware inline lists work", () => {
  const parsed = parseIssuesFile(FIXTURE_ISSUE);
  assert.deepEqual(parsed.errors, []);
  assert.equal(parsed.domain, "ayurvedichealingvillage.com");
  assert.equal(fixtureIssue.opportunity_economics.label, "ESTIMATED");
  assert.deepEqual(fixtureIssue.locales, ["en", "de", "fr"]);
  assert.deepEqual(splitInline('a, "b, c", d'), ["a", "b, c", "d"]);
});

test("issue_row_hash binds the envelope to the exact row: an edited row fails --check", () => {
  const { envelope } = gen();
  const env = parseEnvelope(serializeEnvelope(envelope)).env;
  const editedIssue = { ...fixtureIssue, __raw: [...fixtureIssue.__raw, '    title: "edited after generation"'] };
  const errs = validateEnvelope(env, { issue: editedIssue, doctrine });
  assert.ok(errs.some((e) => e.includes("issue_row_hash")), errs.join("\n"));
});

/* ───────────────────────── --check = CANONICAL REGENERATION (external-review
   adoption, 19 Jul 2026: --check rebuilds the envelope from the issue row +
   current doctrine and deep-compares every generated field — a hand-edited
   envelope can never "still pass") ───────────────────────── */

test("--check is canonical regeneration: removing a required gate from authorized_tools fails", () => {
  const { envelope } = gen();
  const clean = parseEnvelope(serializeEnvelope(envelope)).env;
  assert.deepEqual(validateEnvelope(clean, { issue: fixtureIssue, doctrine }), []); // untouched: passes
  // hand-edit: drop the keyword-map gate the row's change paths require
  const env = { ...clean, authorized_tools: clean.authorized_tools.filter((t) => !t.startsWith("gate:keyword-map")) };
  assert.ok(env.authorized_tools.length < clean.authorized_tools.length, "precondition: a gate entry was removed");
  const errs = validateEnvelope(env, { issue: fixtureIssue, doctrine });
  assert.ok(errs.some((e) => e.includes('field "authorized_tools" DRIFTED')), errs.join("\n"));
});

test("canonical regeneration catches drift in ANY generated field (approver, DoD, closure grep, human_gates, locales)", () => {
  const clean = parseEnvelope(serializeEnvelope(gen().envelope)).env;
  const cases = [
    ["approver", "launches/x/approvals.yaml · self"],
    ["definition_of_done", "ship it"],
    ["closure_grep", ""],
    ["human_gates", []],
    ["locales", ["en"]],
    ["entity", "villa-raag"],
  ];
  for (const [field, forged] of cases) {
    const env = { ...clean, [field]: forged };
    const errs = validateEnvelope(env, { issue: fixtureIssue, doctrine });
    assert.ok(errs.some((e) => e.includes(`field "${field}" DRIFTED`)), `${field}: ${errs.join("\n")}`);
  }
});

test("--check: absent issue_row_hash fails (deleting the hash is not passing)", () => {
  const clean = parseEnvelope(serializeEnvelope(gen().envelope)).env;
  const env = { ...clean };
  delete env.issue_row_hash;
  const errs = validateEnvelope(env, { issue: fixtureIssue, doctrine });
  assert.ok(errs.some((e) => e.includes("issue_row_hash ABSENT")), errs.join("\n"));
});

test("canonical regeneration: unknown hand-added fields are drift; a row that would be refused today fails", () => {
  const clean = parseEnvelope(serializeEnvelope(gen().envelope)).env;
  const withExtra = { ...clean, sneaky_extra: "yes" };
  assert.ok(validateEnvelope(withExtra, { issue: fixtureIssue, doctrine })
    .some((e) => e.includes('unknown field "sneaky_extra"')));
  // an issue row that no longer generates (budget stripped) fails the check
  const { cost_budget: _drop, ...rest } = fixtureIssue;
  const errs = validateEnvelope(clean, { issue: rest, doctrine });
  assert.ok(errs.some((e) => e.includes("canonical regeneration from the issue row REFUSED")), errs.join("\n"));
});

/* ───────────────────────── CLI end-to-end ───────────────────────── */

test("CLI: --fixture generates, --check validates the written envelope (round trip)", () => {
  const dir = mkdtempSync(join(tmpdir(), "job-spec-"));
  try {
    const out = join(dir, "envelope.yaml");
    const g = spawnSync("node", [BIN, "--fixture", "--now", NOW, "--out", out], { encoding: "utf8" });
    assert.equal(g.status, 0, g.stderr);
    assert.ok(readFileSync(out, "utf8").includes("job_spec:"));
    const c = spawnSync("node", [BIN, "--check", out], { encoding: "utf8" });
    assert.equal(c.status, 0, c.stderr);
    assert.ok(c.stdout.includes("OK"));
    // narrow the envelope on disk → --check refuses
    const text = readFileSync(out, "utf8");
    writeFileSync(out, text.split("\n").filter((l) => !l.includes("HG-1 ·")).join("\n"));
    const bad = spawnSync("node", [BIN, "--check", out], { encoding: "utf8" });
    assert.equal(bad.status, 1);
    assert.ok(bad.stderr.includes("NARROWER"));

    // hand-edit: remove a required gate from authorized_tools → canonical
    // regeneration drift (the removed prohibition line above also drifts)
    const gateEdited = join(dir, "gate-edited.yaml");
    writeFileSync(gateEdited, text.split("\n").filter((l) => !l.includes("gate:keyword-map")).join("\n"));
    const drift = spawnSync("node", [BIN, "--check", gateEdited], { encoding: "utf8" });
    assert.equal(drift.status, 1);
    assert.ok(drift.stderr.includes('field "authorized_tools" DRIFTED'), drift.stderr);

    // hand-edit: delete the issue_row_hash line → refused, never "passes by absence"
    const hashless = join(dir, "hashless.yaml");
    writeFileSync(hashless, text.split("\n").filter((l) => !l.startsWith("  issue_row_hash:")).join("\n"));
    const noHash = spawnSync("node", [BIN, "--check", hashless], { encoding: "utf8" });
    assert.equal(noHash.status, 1);
    assert.ok(noHash.stderr.includes("issue_row_hash ABSENT"), noHash.stderr);

    // unresolvable issue ref → refused
    const badRef = join(dir, "bad-ref.yaml");
    writeFileSync(badRef, text.replace(/^  issue: .*$/m, '  issue: "launches/nope/issues.yaml#ISS-nope-0001"'));
    const unref = spawnSync("node", [BIN, "--check", badRef], { encoding: "utf8" });
    assert.equal(unref.status, 1);
    assert.ok(unref.stderr.includes("REFUSED"), unref.stderr);
  } finally {
    rmSync(dir, { recursive: true, force: true });
  }
});

test("CLI: refusals exit 1 with REFUSED lines (no --issue/--fixture; bad ref)", () => {
  const none = spawnSync("node", [BIN], { encoding: "utf8" });
  assert.equal(none.status, 1);
  assert.ok(none.stderr.includes("REFUSED"));
  const bad = spawnSync("node", [BIN, "--issue", "does/not/exist.yaml#ISS-x-0001"], { encoding: "utf8" });
  assert.equal(bad.status, 1);
});
