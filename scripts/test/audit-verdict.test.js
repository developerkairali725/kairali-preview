// audit-verdict.test.js — tests for the cross-model auditors' verdict emission
// (scripts/lib/audit-verdict.mjs, wired inside audit-gpt.mjs / audit-perplexity.mjs).
//
// The surface under test is small and entirely about refusing forgery: the
// emit request must be parsed from the auditor's own argv, only the gates that
// auditor enforces are accepted, only a strict PASS|FAIL enum is emittable, and
// the verdict must bind exactly one real on-disk artifact. Both directions per
// the house rule: valid emissions must pass the §0.2 contract, and every
// refusal must actually refuse.
//
// house style: plain ESM + node --test, throwaway repos.
import { test } from "node:test";
import assert from "node:assert/strict";
import { existsSync, mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";

import { validateVerdict, sha256File } from "../lib/verdict.mjs";
import { parseReviewArgs } from "../lib/review-brief.mjs";
import { AUDIT_GATES, emitAuditVerdict, parseEmitRequest } from "../lib/audit-verdict.mjs";
import { REGISTRY } from "../matrix-walk.mjs";

// pin detectRunner() to "local" regardless of where the tests run (see gate-emit.test.js)
const savedEnv = {};
for (const k of ["GITHUB_ACTIONS", "GITHUB_SERVER_URL", "GITHUB_REPOSITORY", "GITHUB_RUN_ID"]) {
  savedEnv[k] = process.env[k];
  delete process.env[k];
}
process.on("exit", () => {
  for (const [k, v] of Object.entries(savedEnv)) if (v !== undefined) process.env[k] = v;
});

const SITE = "whatisayurveda.com";

function makeRepo(t) {
  const root = mkdtempSync(join(tmpdir(), "audit-verdict-"));
  t.after(() => rmSync(root, { recursive: true, force: true }));
  mkdirSync(join(root, "docs"), { recursive: true });
  writeFileSync(join(root, "docs", "artifact.json"), JSON.stringify({ claims: ["x"] }) + "\n");
  return root;
}

const emit = (root, over = {}) =>
  emitAuditVerdict({
    auditor: "audit-gpt",
    gate: "G3-PROC",
    site: SITE,
    repoRoot: root,
    artifacts: [join("docs", "artifact.json")],
    verdict: "PASS",
    startedAt: "2026-07-18T10:00:00+05:30",
    argv: ["--artifact", "docs/artifact.json"],
    model: "gpt-5",
    ...over,
  });

/* ==========================================================================
 * 1 · THE LANE MAP — each auditor may speak only for the gates it enforces
 * ========================================================================== */

test("every emittable gate exists in the matrix-walk registry with the matching enforcing command", () => {
  for (const [auditor, gates] of Object.entries(AUDIT_GATES)) {
    for (const id of gates) {
      const g = REGISTRY.find((r) => r.id === id);
      assert.ok(g, `${id} is not a walked gate`);
      assert.match(g.command ?? "", new RegExp(auditor.replace("audit-", "audit-")), `${id}'s enforcing command is not ${auditor}`);
    }
  }
});

test("parseEmitRequest: absent flags mean no emission — existing usage is untouched", () => {
  assert.equal(parseEmitRequest(parseReviewArgs(["--ask", "q"]), "audit-gpt"), null);
});

test("parseEmitRequest reads the real argv path (parseReviewArgs)", () => {
  const args = parseReviewArgs(["--ask", "q", "--emit-gate", "G6-FACT", "--emit-site", SITE]);
  assert.deepEqual(parseEmitRequest(args, "audit-perplexity"), { gate: "G6-FACT", site: SITE });
});

test("★ a half-specified request throws — an emitter must never guess the site or the gate", () => {
  assert.throws(() => parseEmitRequest({ "emit-gate": "G3-PROC" }, "audit-gpt"), /must be given together/);
  assert.throws(() => parseEmitRequest({ "emit-site": SITE }, "audit-gpt"), /must be given together/);
});

test("★ an out-of-lane gate throws — audit-gpt cannot record a FACT gate, audit-perplexity cannot record a PROC gate", () => {
  assert.throws(() => parseEmitRequest({ "emit-gate": "G3-FACT", "emit-site": SITE }, "audit-gpt"), /not the enforcing command/);
  assert.throws(() => parseEmitRequest({ "emit-gate": "G3-PROC", "emit-site": SITE }, "audit-perplexity"), /not the enforcing command/);
  assert.throws(() => parseEmitRequest({ "emit-gate": "G6-LINT", "emit-site": SITE }, "audit-gpt"), /not the enforcing command/);
});

/* ==========================================================================
 * 2 · EMISSION — contract-valid in both directions
 * ========================================================================== */

test("★ a completed PASS run emits a §0.2-valid verdict bound to the real artifact hash", (t) => {
  const root = makeRepo(t);
  const { verdict, path } = emit(root);
  assert.equal(path, join(root, "audits", SITE, "G3-PROC-verdict.json"));
  const v = JSON.parse(readFileSync(path, "utf8"));
  assert.deepEqual(validateVerdict(v), []);
  assert.equal(v.gate, "G3-PROC");
  assert.equal(v.status, "PASS");
  assert.equal(v.exit_code, 0);
  assert.equal(v.artifact_path, join("docs", "artifact.json"));
  assert.equal(v.artifact_sha256, sha256File(join(root, "docs", "artifact.json")));
  assert.equal(v.command, "node scripts/audit-gpt.mjs");
  assert.equal(verdict.control_probe.expected, verdict.control_probe.observed);
});

test("a FAIL run emits FAIL with exit 2 — as contract-valid as a PASS", (t) => {
  const root = makeRepo(t);
  emit(root, { verdict: "FAIL" });
  const v = JSON.parse(readFileSync(join(root, "audits", SITE, "G3-PROC-verdict.json"), "utf8"));
  assert.equal(v.status, "FAIL");
  assert.equal(v.exit_code, 2);
  assert.deepEqual(validateVerdict(v), []);
});

/* ==========================================================================
 * 3 · THE REFUSALS — every forgery path actually refuses
 * ========================================================================== */

test("★ anything but the strict PASS|FAIL enum is unemittable", (t) => {
  const root = makeRepo(t);
  for (const bad of ["MAYBE", "pass", "", null, undefined]) {
    assert.throws(() => emit(root, { verdict: bad }), /strict enum PASS\|FAIL/);
  }
  assert.ok(!existsSync(join(root, "audits", SITE, "G3-PROC-verdict.json")), "no refusal may leave a verdict behind");
});

test("★ a verdict must bind exactly ONE on-disk artifact — none, many, missing and empty all refuse", (t) => {
  const root = makeRepo(t);
  writeFileSync(join(root, "docs", "second.json"), "{}\n");
  writeFileSync(join(root, "docs", "empty.json"), "");
  assert.throws(() => emit(root, { artifacts: [] }), /exactly ONE --artifact/);
  assert.throws(() => emit(root, { artifacts: [join("docs", "artifact.json"), join("docs", "second.json")] }), /exactly ONE --artifact/);
  assert.throws(() => emit(root, { artifacts: ["docs/nope.json"] }), /exactly ONE --artifact/);
  assert.throws(() => emit(root, { artifacts: [join("docs", "empty.json")] }), /judged nothing/);
  assert.ok(!existsSync(join(root, "audits", SITE, "G3-PROC-verdict.json")));
});

test("emitAuditVerdict re-checks the lane even if a caller bypasses parseEmitRequest", (t) => {
  const root = makeRepo(t);
  assert.throws(() => emit(root, { gate: "G3-FACT" }), /may not emit/);
  assert.throws(() => emit(root, { auditor: "audit-perplexity", gate: "G3-PROC" }), /may not emit/);
});
