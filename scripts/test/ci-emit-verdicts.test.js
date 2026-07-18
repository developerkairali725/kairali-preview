// ci-emit-verdicts.test.js — tests for the emitter CI wiring
// (scripts/ci-emit-verdicts.mjs + the emit-verdicts job in factory-gate.yml).
//
// Two layers, same house asymmetry as the gate-emit suite:
//   1. the LOOP: a fake failing check must yield a FAIL verdict (never a PASS,
//      never silence), a clean check a PASS, an un-armed gate NOTHING, and a
//      broken §0.6 probe must abort the WHOLE run;
//   2. the WIRING: the workflow invariants that make a committed verdict pass
//      checkProvenance() are asserted against the real YAML — the bot identity
//      the job commits with is validated against verdict.mjs's OWN
//      CI_AUTHOR/CI_EMAIL patterns, so an edit to either side that would
//      silently kill provenance fails here first. Same promise-made-mechanical
//      doctrine as factory-matrix-lint.
//
// house style: plain ESM + node --test, throwaway repos, injected runners.
import { test } from "node:test";
import assert from "node:assert/strict";
import { existsSync, mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join, resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";

import { CI_AUTHOR_PATTERNS, CI_EMAIL_PATTERNS, validateVerdict } from "../lib/verdict.mjs";
import { EMITTERS } from "../gate-emit.mjs";
import { EXEMPT, parseMatrices, fleetSites } from "../factory-matrix-lint.mjs";
import { emitAll, emitSiteSet, exitCodeFor } from "../ci-emit-verdicts.mjs";

const REPO_ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "..", "..");
const WORKFLOW = join(REPO_ROOT, ".github", "workflows", "factory-gate.yml");

// detectRunner() reads GITHUB_ACTIONS; pin to "local" for determinism (same
// dance as gate-emit.test.js) and restore after.
const savedEnv = {};
for (const k of ["GITHUB_ACTIONS", "GITHUB_SERVER_URL", "GITHUB_REPOSITORY", "GITHUB_RUN_ID"]) {
  savedEnv[k] = process.env[k];
  delete process.env[k];
}
process.on("exit", () => {
  for (const [k, v] of Object.entries(savedEnv)) if (v !== undefined) process.env[k] = v;
});

const SITE = "arogyashala.in";

/** Throwaway repo with fleet sites (site.config.json = the fleet-site marker). */
function makeRepo(t, { sites = [SITE] } = {}) {
  const root = mkdtempSync(join(tmpdir(), "ci-emit-"));
  t.after(() => rmSync(root, { recursive: true, force: true }));
  for (const site of sites) {
    mkdirSync(join(root, "sites", site, "app"), { recursive: true });
    writeFileSync(join(root, "sites", site, "site.config.json"), "{}\n");
    writeFileSync(join(root, "sites", site, "package.json"), JSON.stringify({ name: site }));
    writeFileSync(join(root, "sites", site, "app", "page.tsx"), "export default function Page() { return null }\n");
  }
  return root;
}

/** Same injected runner shape as gate-emit.test.js: probe answered, commands scripted. */
function fakeRunner({ probeExit = 2, exits = [] } = {}) {
  const calls = [];
  const queue = [...exits];
  const run = (argv) => {
    calls.push(argv);
    if (argv[0] === "node" && argv[1] === "-e") return { exit: probeExit, output: "" };
    return queue.length ? queue.shift() : { exit: 0, output: "ok" };
  };
  return { run, calls };
}

/* ==========================================================================
 * 1 · THE EMIT SET — matrix parity by construction, exemptions excluded
 * ========================================================================== */

test("emitSiteSet excludes every matrix exemption and strips the sites/ prefix", (t) => {
  const exemptName = [...EXEMPT.keys()][0].replace(/^sites\//, "");
  const root = makeRepo(t, { sites: ["x.com", exemptName] });
  assert.deepEqual(emitSiteSet(root), ["x.com"], `the exempt site ${exemptName} must never enter the emit set`);
});

test("★ the emit set IS the factory-spec matrix set — the two cannot drift (real repo state)", () => {
  const matrices = parseMatrices(readFileSync(WORKFLOW, "utf8"));
  assert.ok(matrices.length >= 2, "the workflow's site matrices must be parseable — if this breaks, factory-matrix-lint is blind too");
  const bare = (s) => s.replace(/^sites\//, "");
  for (const m of matrices) {
    assert.deepEqual(
      emitSiteSet(REPO_ROOT).sort(),
      [...m.sites].map(bare).sort(),
      `emit set != \`${m.job}\` matrix — verdicts would be emitted for sites CI never validated (or validated sites would silently go unproven)`,
    );
  }
  // and the set really came from disk truth, not a hardcoded list
  assert.deepEqual(
    emitSiteSet(REPO_ROOT).map((s) => `sites/${s}`).sort(),
    fleetSites(REPO_ROOT).filter((s) => !EXEMPT.has(s)).sort(),
  );
});

/* ==========================================================================
 * 2 · THE LOOP — both directions, per emitter, through the REAL emitForGate
 * ========================================================================== */

test("★ a fake FAILING check produces a FAIL verdict on disk — never PASS, never silence", (t) => {
  const root = makeRepo(t);
  const { run } = fakeRunner({ exits: [{ exit: 2, output: "build blew up" }] });
  const results = emitAll({ repoRoot: root, sites: [SITE], gates: ["G6-BUILD"], run });

  assert.deepEqual(results.map((r) => r.outcome), ["FAIL"]);
  assert.equal(exitCodeFor(results), 2, "a FAIL verdict must turn the run red");
  const v = JSON.parse(readFileSync(join(root, "audits", SITE, "G6-BUILD-verdict.json"), "utf8"));
  assert.equal(v.status, "FAIL", "the verdict must record the failure, not soften it");
  assert.equal(v.exit_code, 2, "the REAL exit code, verbatim");
  assert.deepEqual(validateVerdict(v), [], "a FAIL verdict is exactly as contract-valid as a PASS");
});

test("★ a clean check produces a contract-valid PASS and exit 0", (t) => {
  const root = makeRepo(t);
  const { run, calls } = fakeRunner({ exits: [{ exit: 0, output: "1 successful" }] });
  const results = emitAll({ repoRoot: root, sites: [SITE], gates: ["G6-BUILD"], run });

  assert.deepEqual(results.map((r) => r.outcome), ["PASS"]);
  assert.equal(exitCodeFor(results), 0);
  assert.equal(results[0].path, join("audits", SITE, "G6-BUILD-verdict.json"));
  const v = JSON.parse(readFileSync(join(root, results[0].path), "utf8"));
  assert.deepEqual(validateVerdict(v), []);
  // the loop invoked the REAL enforcing command, not a stand-in
  assert.ok(calls.some((argv) => argv.join(" ").includes(`turbo build --filter=${SITE}`)), JSON.stringify(calls));
});

test("un-armed gates report NOT_ARMED, write NOTHING, and never fail the run", (t) => {
  const root = makeRepo(t); // no docs/keywords, site outside content-lint scope
  const { run } = fakeRunner({ exits: [{ exit: 0, output: "" }] });
  const results = emitAll({ repoRoot: root, sites: [SITE], run }); // all three emitters

  const byGate = Object.fromEntries(results.map((r) => [r.gate, r]));
  assert.equal(byGate["G6-BUILD"].outcome, "PASS");
  assert.equal(byGate["G6-LINT"].outcome, "NOT_ARMED");
  assert.match(byGate["G6-LINT"].reason, /outside its scope/);
  assert.equal(byGate["G3-PRE"].outcome, "NOT_ARMED");
  assert.match(byGate["G3-PRE"].reason, /no docs\/keywords/);
  assert.equal(exitCodeFor(results), 0, "absence is the honest state, not a failure");
  assert.ok(!existsSync(join(root, "audits", SITE, "G6-LINT-verdict.json")));
  assert.ok(!existsSync(join(root, "audits", SITE, "G3-PRE-verdict.json")));
});

test("★ a broken §0.6 probe aborts the WHOLE run — no verdict from any site survives a dead failure-detector", (t) => {
  const root = makeRepo(t, { sites: ["a.example", "b.example"] });
  const { run } = fakeRunner({ probeExit: 0 }); // the must-fail probe "passed": detector broken
  assert.throws(
    () => emitAll({ repoRoot: root, sites: ["a.example", "b.example"], gates: ["G6-BUILD"], run }),
    /control probe misfired/,
  );
  assert.ok(!existsSync(join(root, "audits", "a.example")), "nothing may be written after the probe misfires");
  assert.ok(!existsSync(join(root, "audits", "b.example")));
});

test("the default gate list is the FULL closed spec table — the wiring cannot quietly drop an emitter", (t) => {
  const root = makeRepo(t);
  const { run } = fakeRunner({ exits: [{ exit: 0, output: "" }] });
  const results = emitAll({ repoRoot: root, sites: [SITE], run });
  assert.deepEqual(results.map((r) => r.gate).sort(), EMITTERS.map((s) => s.gate).sort());
});

/* ==========================================================================
 * 3 · THE WIRING — factory-gate.yml invariants that §0.2 provenance depends on
 * ========================================================================== */

/** The emit-verdicts job's YAML slice (from its header to the next job or EOF). */
function emitJobSlice() {
  const text = readFileSync(WORKFLOW, "utf8");
  const start = text.search(/^  emit-verdicts:\s*$/m);
  assert.notEqual(start, -1, "factory-gate.yml has no emit-verdicts job — the ratified wiring (D-EMITTER-WIRING) is gone");
  const rest = text.slice(start + 1);
  const next = rest.search(/^  [A-Za-z0-9_-]+:\s*$/m);
  return next === -1 ? text.slice(start) : text.slice(start, start + 1 + next);
}

test("emit-verdicts runs the wiring script on main pushes only, gated on emit_affecting", () => {
  const job = emitJobSlice();
  assert.match(job, /node scripts\/ci-emit-verdicts\.mjs/, "the job must run THIS wiring, not an inline reimplementation");
  assert.match(job, /github\.event_name == 'push'/, "PR-time emission can never be ship evidence (squash-merge rewrites the author) — the job must be main-push only");
  assert.match(job, /needs\.changes\.outputs\.emit_affecting == 'true'/);
  assert.match(job, /contents: write/, "the job needs push rights (scoped to the job, not the workflow)");
  const wholeFile = readFileSync(WORKFLOW, "utf8");
  assert.match(wholeFile, /^\s*emit_affecting: \$\{\{ steps\.diff\.outputs\.emit_affecting \}\}/m, "the changes job must export emit_affecting");
});

test("★ the identity the job commits with satisfies verdict.mjs's OWN CI provenance patterns", () => {
  const job = emitJobSlice();
  const name = job.match(/git config user\.name "([^"]+)"/)?.[1];
  const email = job.match(/git config user\.email "([^"]+)"/)?.[1];
  assert.ok(name && email, "the commit step must set an explicit bot identity");
  assert.ok(CI_AUTHOR_PATTERNS.some((re) => re.test(name)) || CI_EMAIL_PATTERNS.some((re) => re.test(email)),
    `"${name}" <${email}> would FAIL checkProvenance() — every verdict the job commits would be rejected as a hand-authored file`);
});

test("the verdict commit is recursion-guarded and touches audits/ ONLY", () => {
  const job = emitJobSlice();
  assert.match(job, /git commit -m "[^"]*\[skip ci\]/, "without [skip ci] the bot's own push re-triggers the workflow");
  const adds = [...job.matchAll(/git add ([^\n]*)/g)].map((m) => m[1].trim());
  assert.deepEqual(adds, ["-- audits/"], "the bot may commit verdict evidence and nothing else — no STATUS.yaml, no source, no docs");
  // second guard: the bot's own audits/ commit must not re-arm the emit job
  const changes = readFileSync(WORKFLOW, "utf8").match(/emit_pattern='([^']+)'/)?.[1];
  assert.ok(changes, "the changes job must compute emit_affecting from an explicit emit_pattern");
  assert.ok(!new RegExp(changes).test("audits/arogyashala.in/G6-BUILD-verdict.json"),
    "audits/ matches emit_pattern — the verdict commit would re-arm the job that wrote it");
  // and the pattern still covers what the emitters actually judge
  for (const judged of ["sites/arogyashala.in/app/page.tsx", "docs/keywords/arogyashala/demand.json", "scripts/content-lint.mjs", "packages/ui/tokens.css"]) {
    assert.ok(new RegExp(changes).test(judged), `emit_pattern misses ${judged} — a change to a judged artifact would skip re-emission and leave a stale verdict standing`);
  }
});

test("evidence order: verdicts are committed BEFORE the run is turned red on FAIL", () => {
  const job = emitJobSlice();
  const commitAt = job.indexOf("Commit verdicts");
  const surfaceAt = job.indexOf("Surface FAIL");
  assert.ok(commitAt !== -1 && surfaceAt !== -1, "both the commit step and the FAIL-surfacing step must exist");
  assert.ok(commitAt < surfaceAt, "a FAIL verdict is evidence too — record first, go red after");
  assert.match(job, /continue-on-error: true/, "the emit step must not abort the job before the FAIL verdict is committed");
});
