// gate-emit.test.js — tests for the tranche-1 verdict emitters (gate-emit.mjs).
//
// Same asymmetry as the matrix-walk suite: an emitter that always writes PASS
// and one that never writes anything are both useless, so every path is tested
// in BOTH directions — a clean run must emit a contract-valid PASS bound to the
// real artifact hash, and a failing run must emit FAIL with the real exit code.
// And the falsification refusals are tested AS refusals: not-armed writes
// NOTHING, a broken failure-detector throws rather than emits, and a gate the
// harness does not enforce throws.
//
// house style: plain ESM + node --test, throwaway repos, injected runners
// (like matrix-walk.test.js injects provenance) plus one REAL spawn test so the
// default path never ships unexecuted.
import { test } from "node:test";
import assert from "node:assert/strict";
import { existsSync, mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";

import { validateVerdict, sha256File } from "../lib/verdict.mjs";
import { REGISTRY } from "../matrix-walk.mjs";
import { EMITTERS, buildSourceManifest, emitForGate, realRun, writeSourceManifest } from "../gate-emit.mjs";

// detectRunner() reads GITHUB_ACTIONS; tests must be deterministic both locally
// and inside CI, so pin the environment to "local" and restore after.
const savedEnv = {};
for (const k of ["GITHUB_ACTIONS", "GITHUB_SERVER_URL", "GITHUB_REPOSITORY", "GITHUB_RUN_ID"]) {
  savedEnv[k] = process.env[k];
  delete process.env[k];
}
process.on("exit", () => {
  for (const [k, v] of Object.entries(savedEnv)) if (v !== undefined) process.env[k] = v;
});

const SITE = "arogyashala.in";

/** Throwaway repo with a minimal site. */
function makeRepo(t, { site = SITE, pkgName = site } = {}) {
  const root = mkdtempSync(join(tmpdir(), "gate-emit-"));
  t.after(() => rmSync(root, { recursive: true, force: true }));
  mkdirSync(join(root, "sites", site, "app"), { recursive: true });
  writeFileSync(join(root, "sites", site, "package.json"), JSON.stringify({ name: pkgName }, null, 2));
  writeFileSync(join(root, "sites", site, "app", "page.tsx"), "export default function Page() { return null }\n");
  return root;
}

/**
 * Injected runner: answers the §0.6 probe (`node -e "process.exit(2)"`) with
 * exit 2 by default, and pops scripted results for the real commands. Records
 * every argv so a test can prove the real commands were actually invoked.
 */
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
 * 1 · THE SPEC TABLE IS CLOSED AND HONEST
 * ========================================================================== */

test("every emitter speaks for a real matrix-walk gate, and never for a HUMAN one", () => {
  for (const s of EMITTERS) {
    const g = REGISTRY.find((r) => r.id === s.gate);
    assert.ok(g, `${s.gate} is not in the matrix-walk registry — an emitter for a gate that is not walked emits into the void`);
    assert.notEqual(g.kind, "HUMAN", `${s.gate} is HUMAN — a sign-off is recorded by the person, never emitted by a machine`);
    assert.ok(s.command && s.command.length > 3, `${s.gate} emitter names no enforcing command`);
  }
});

test("emitter gate ids are unique", () => {
  const ids = EMITTERS.map((s) => s.gate);
  assert.equal(new Set(ids).size, ids.length);
});

test("an unknown gate throws — the emitter list is closed, not a suggestion", (t) => {
  const root = makeRepo(t);
  assert.throws(() => emitForGate("G5-PRE", { site: SITE, repoRoot: root }), /no emitter for "G5-PRE"/);
  assert.throws(() => emitForGate("G5-HUMAN", { site: SITE, repoRoot: root }), /never synthesized/);
});

/* ==========================================================================
 * 2 · SOURCE MANIFEST — deterministic, content-sensitive, build-product-blind
 * ========================================================================== */

test("the manifest is deterministic on unchanged source and changes when any file changes", (t) => {
  const root = makeRepo(t);
  const a = buildSourceManifest(root, join("sites", SITE));
  const b = buildSourceManifest(root, join("sites", SITE));
  assert.equal(a.tree_sha256, b.tree_sha256, "re-running over unchanged source must be byte-identical");
  writeFileSync(join(root, "sites", SITE, "app", "page.tsx"), "changed\n");
  const c = buildSourceManifest(root, join("sites", SITE));
  assert.notEqual(a.tree_sha256, c.tree_sha256, "a real source change must change the manifest (and thereby void the old verdict)");
});

test("build products are never judged source: node_modules/.next do not move the manifest", (t) => {
  const root = makeRepo(t);
  const before = buildSourceManifest(root, join("sites", SITE)).tree_sha256;
  mkdirSync(join(root, "sites", SITE, "node_modules", "x"), { recursive: true });
  writeFileSync(join(root, "sites", SITE, "node_modules", "x", "index.js"), "junk");
  mkdirSync(join(root, "sites", SITE, ".next"), { recursive: true });
  writeFileSync(join(root, "sites", SITE, ".next", "build-id"), "junk");
  assert.equal(buildSourceManifest(root, join("sites", SITE)).tree_sha256, before);
});

test("writeSourceManifest writes the manifest the verdict will bind", (t) => {
  const root = makeRepo(t);
  const rel = writeSourceManifest(root, join("sites", SITE), join("audits", SITE, "m.json"));
  const parsed = JSON.parse(readFileSync(join(root, rel), "utf8"));
  assert.equal(parsed.judged_dir, join("sites", SITE));
  assert.ok(parsed.file_count >= 2);
  assert.match(parsed.tree_sha256, /^[0-9a-f]{64}$/);
});

/* ==========================================================================
 * 3 · G6-BUILD — both directions
 * ========================================================================== */

test("★ a clean build emits a contract-valid PASS bound to the real manifest hash", (t) => {
  const root = makeRepo(t);
  const { run, calls } = fakeRunner({ exits: [{ exit: 0, output: "1 successful" }] });
  const r = emitForGate("G6-BUILD", { site: SITE, repoRoot: root, run });

  assert.equal(r.emitted, true);
  const v = JSON.parse(readFileSync(join(root, "audits", SITE, "G6-BUILD-verdict.json"), "utf8"));
  assert.equal(v.gate, "G6-BUILD");
  assert.equal(v.status, "PASS");
  assert.equal(v.exit_code, 0);
  assert.deepEqual(validateVerdict(v), [], "the emitted verdict must satisfy the §0.2 contract");
  // bound to the REAL manifest on disk, hash recomputable by anyone
  assert.equal(v.artifact_path, join("audits", SITE, "G6-BUILD-source-manifest.json"));
  assert.equal(v.artifact_sha256, sha256File(join(root, v.artifact_path)));
  // the real enforcing command was invoked, with the site's package name
  assert.ok(calls.some((argv) => argv.join(" ").includes(`turbo build --filter=${SITE}`)), JSON.stringify(calls));
  // the probe result is recorded, expected == observed
  assert.deepEqual(v.control_probe, { name: "harness-detects-nonzero-exit", expected: 2, observed: 2 });
});

test("★ a failing build emits FAIL with the command's REAL exit code — never a softened PASS", (t) => {
  const root = makeRepo(t);
  const { run } = fakeRunner({ exits: [{ exit: 2, output: "build blew up" }] });
  const r = emitForGate("G6-BUILD", { site: SITE, repoRoot: root, run });
  assert.equal(r.emitted, true);
  const v = JSON.parse(readFileSync(join(root, "audits", SITE, "G6-BUILD-verdict.json"), "utf8"));
  assert.equal(v.status, "FAIL");
  assert.equal(v.exit_code, 2);
  assert.deepEqual(validateVerdict(v), [], "a FAIL verdict is exactly as contract-valid as a PASS");
});

test("turbo filters by the package NAME, which may differ from the directory name", (t) => {
  const root = makeRepo(t, { pkgName: "not-the-dirname" });
  const { run, calls } = fakeRunner({ exits: [{ exit: 0, output: "" }] });
  emitForGate("G6-BUILD", { site: SITE, repoRoot: root, run });
  assert.ok(calls.some((argv) => argv.includes("--filter=not-the-dirname")));
});

test("no site → NOT ARMED, and NOTHING is written — absence stays honest", (t) => {
  const root = makeRepo(t);
  const { run } = fakeRunner();
  const r = emitForGate("G6-BUILD", { site: "no-such-site.example", repoRoot: root, run });
  assert.equal(r.emitted, false);
  assert.match(r.reason, /no sites\/no-such-site\.example\/package\.json/);
  assert.ok(!existsSync(join(root, "audits", "no-such-site.example")), "not-armed must not write a verdict OR a manifest");
});

/* ==========================================================================
 * 4 · THE CONTROL PROBE — a broken failure-detector refuses to emit (§0.6)
 * ========================================================================== */

test("★ if the harness cannot see a failure, it throws and writes NO verdict", (t) => {
  const root = makeRepo(t);
  const { run } = fakeRunner({ probeExit: 0 }); // detector broken: the must-fail probe "passed"
  assert.throws(() => emitForGate("G6-BUILD", { site: SITE, repoRoot: root, run }), /control probe misfired[\s\S]*REFUSING to emit/);
  assert.ok(!existsSync(join(root, "audits", SITE, "G6-BUILD-verdict.json")));
});

test("a command that never produced an exit code is a harness error, not a verdict", (t) => {
  const root = makeRepo(t);
  const { run } = fakeRunner({ exits: [{ exit: null, output: "spawn ENOENT" }] });
  assert.throws(() => emitForGate("G6-BUILD", { site: SITE, repoRoot: root, run }), /did not complete/);
  assert.ok(!existsSync(join(root, "audits", SITE, "G6-BUILD-verdict.json")));
});

/* ==========================================================================
 * 5 · G6-LINT — the registry-flagged one-site scope is mirrored, not widened
 * ========================================================================== */

test("★ G6-LINT for a site outside content-lint's scope is NOT ARMED — a verdict for pages the lint never read would be a synthesized PASS", (t) => {
  const root = makeRepo(t);
  const { run, calls } = fakeRunner();
  const r = emitForGate("G6-LINT", { site: SITE, repoRoot: root, run });
  assert.equal(r.emitted, false);
  assert.match(r.reason, /outside its scope/);
  assert.match(r.reason, /cross-site miss/);
  assert.equal(calls.length, 0, "not-armed must not even run the command");
});

test("G6-LINT for the covered site emits from the real lint exit, bound to the content manifest", (t) => {
  const covered = "whatisayurveda.com";
  const root = makeRepo(t, { site: covered });
  mkdirSync(join(root, "sites", covered, "content"), { recursive: true });
  writeFileSync(join(root, "sites", covered, "content", "x.json"), "{}\n");
  const { run } = fakeRunner({ exits: [{ exit: 0, output: "ERROR 0" }] });
  const r = emitForGate("G6-LINT", { site: covered, repoRoot: root, run });
  assert.equal(r.emitted, true);
  const v = JSON.parse(readFileSync(join(root, "audits", covered, "G6-LINT-verdict.json"), "utf8"));
  assert.deepEqual(validateVerdict(v), []);
  assert.equal(v.artifact_path, join("audits", covered, "G6-LINT-content-manifest.json"));
  assert.equal(v.artifact_sha256, sha256File(join(root, v.artifact_path)));
});

/* ==========================================================================
 * 6 · G3-PRE — half a claim is not armed; the full claim binds demand.json
 * ========================================================================== */

function seedS3(root, dir, { demand = true } = {}) {
  mkdirSync(join(root, "docs", "keywords", dir), { recursive: true });
  writeFileSync(join(root, "docs", "keywords", dir, "seeds.json"), JSON.stringify({ seeds: [] }));
  writeFileSync(join(root, "docs", "keywords", dir, "ontology.json"), JSON.stringify({}));
  if (demand) writeFileSync(join(root, "docs", "keywords", dir, "demand.json"), JSON.stringify({ rows: [] }));
}

test("G3-PRE with no S3 artifacts is NOT ARMED — same loud state CI prints", (t) => {
  const root = makeRepo(t);
  const r = emitForGate("G3-PRE", { site: SITE, repoRoot: root, run: fakeRunner().run });
  assert.equal(r.emitted, false);
  assert.match(r.reason, /no docs\/keywords/);
});

test("★ seeds WITHOUT demand.json is half the claim — NOT ARMED, never a PASS on the half that ran", (t) => {
  const root = makeRepo(t);
  seedS3(root, SITE.split(".")[0], { demand: false });
  const r = emitForGate("G3-PRE", { site: SITE, repoRoot: root, run: fakeRunner().run });
  assert.equal(r.emitted, false);
  assert.match(r.reason, /missing demand\.json/);
  assert.match(r.reason, /half the claim/);
});

test("★ the full S3 artifact set runs BOTH scripts and binds demand.json — the §0.2 example shape", (t) => {
  const root = makeRepo(t);
  seedS3(root, SITE); // full-domain dir name works too
  const { run, calls } = fakeRunner({ exits: [{ exit: 0, output: "" }, { exit: 0, output: "" }] });
  const r = emitForGate("G3-PRE", { site: SITE, repoRoot: root, run });
  assert.equal(r.emitted, true);
  const invoked = calls.filter((a) => !(a[0] === "node" && a[1] === "-e")).map((a) => a.join(" "));
  assert.equal(invoked.length, 2, "both halves of the claim must actually run");
  assert.match(invoked[0], /seed-lint\.mjs/);
  assert.match(invoked[1], /keyword-validate\.mjs/);
  const v = JSON.parse(readFileSync(join(root, "audits", SITE, "G3-PRE-verdict.json"), "utf8"));
  assert.deepEqual(validateVerdict(v), []);
  assert.equal(v.artifact_path, join("docs", "keywords", SITE, "demand.json"));
  assert.equal(v.artifact_sha256, sha256File(join(root, v.artifact_path)));
});

test("if seed-lint fails, keyword-validate's clean exit cannot rescue the gate", (t) => {
  const root = makeRepo(t);
  seedS3(root, SITE);
  const { run } = fakeRunner({ exits: [{ exit: 2, output: "Rule B violation" }, { exit: 0, output: "" }] });
  const r = emitForGate("G3-PRE", { site: SITE, repoRoot: root, run });
  const v = JSON.parse(readFileSync(join(root, "audits", SITE, "G3-PRE-verdict.json"), "utf8"));
  assert.equal(v.status, "FAIL");
  assert.equal(v.exit_code, 2);
  assert.equal(r.results.length, 2, "the second command still ran and is still recorded");
});

/* ==========================================================================
 * 7 · THE REAL SPAWN PATH — never ships unexecuted (matrix-walk suite §14's rule)
 * ========================================================================== */

test("realRun reports real exit codes in both directions, and ENOENT as no-exit", (t) => {
  const root = makeRepo(t);
  assert.equal(realRun(["node", "-e", "process.exit(0)"], { repoRoot: root }).exit, 0);
  assert.equal(realRun(["node", "-e", "process.exit(2)"], { repoRoot: root }).exit, 2);
  const gone = realRun(["definitely-not-a-real-binary-xyz"], { repoRoot: root });
  assert.equal(gone.exit, null, "a command that never ran must not look like exit 0");
});

test("★ end-to-end with the REAL runner: the probe fires and the verdict derives from a real child exit", (t) => {
  // G3-PRE's spec normally spawns the real lints; here the fake repo's scripts
  // ARE tiny real node programs, so the whole spawn path executes for real.
  const root = makeRepo(t);
  seedS3(root, SITE);
  mkdirSync(join(root, "scripts"), { recursive: true });
  writeFileSync(join(root, "scripts", "seed-lint.mjs"), "process.exit(0);\n");
  writeFileSync(join(root, "scripts", "keyword-validate.mjs"), "process.exit(2);\n");
  const r = emitForGate("G3-PRE", { site: SITE, repoRoot: root });
  assert.equal(r.emitted, true);
  const v = JSON.parse(readFileSync(join(root, "audits", SITE, "G3-PRE-verdict.json"), "utf8"));
  assert.equal(v.status, "FAIL", "the real child exited 2; the verdict must say so");
  assert.equal(v.exit_code, 2);
  assert.equal(v.runner, "local", "outside CI the runner is local — iteration evidence, and the walk will say so");
  assert.deepEqual(validateVerdict(v), []);
});
