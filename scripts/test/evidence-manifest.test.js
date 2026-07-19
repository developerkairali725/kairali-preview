// evidence-manifest.test.js — tests for the EVIDENCE LAW v2 manifest mechanism
// (plan §2.5, M2; clears strict residues PKG-020/PKG-077): SHA-256 manifests on
// every evidence bundle, dual IST/UTC timestamps, producer identity (EX-3),
// and THE ONE CORRECTION MODEL (external review adoption, M2 PR):
//
//   manifest entries are APPEND-ONLY everywhere — write mode refuses any
//   change/deletion of a manifested file; a correction is a NEW file under a
//   versioned name + an appended entry with a strictly newer run-id; the
//   superseded entry stays and may gain superseded_by (the one legal
//   mutation); CI runs FULL verification on every touched bundle at HEAD
//   (added manifests included — the status-A blind spot is closed) and holds
//   modified manifests to byte-identical base-entry survival.
//
// House rule (gate-registry-lint.test.js et al.): every detector is tested in
// BOTH directions — the clean input must PASS and the broken input must FAIL,
// for the same detector, in the same run. A validator that always says no and
// one that always says yes are equally useless; for an evidence mechanism the
// always-yes failure mode is evidence falsification by construction.
//
// house style: plain ESM + node --test; tmp-dir fixtures (audit-verdict.test.js
// pattern); CI-law scenarios build throwaway git repos in tmp — the working
// repo is never touched.
import { test } from "node:test";
import assert from "node:assert/strict";
import { execFileSync } from "node:child_process";
import { existsSync, mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";

import {
  CORRECTION_LAW, DOCTRINE_LINE, MANIFEST, appendOnlyFindings, buildManifest,
  bundleDirCheck, ciFindings, collectCiFindings, deriveRunId, manifestCovers,
  parseRunId, planWrite, runControlProbes, runIdGreater, sha256Hex,
  snapshotBundle, validateManifest, verifyBundle, verifyFindings, walkBundle,
  writeManifest,
} from "../evidence-manifest.mjs";

const NOW = new Date("2026-07-19T12:00:00Z"); // 17:30:00 IST
const NOW2 = new Date("2026-07-20T12:00:00Z"); // next IST day → run-ids derive fresh
const PRODUCER = { session: "test-session", role: "builder" };

/** A fresh tmp bundle dir seeded with a couple of evidence files. */
function mkBundle(files = { "raw/a.txt": "alpha", "raw/b.txt": "beta" }) {
  const dir = mkdtempSync(join(tmpdir(), "evidence-manifest-"));
  for (const [rel, body] of Object.entries(files)) {
    mkdirSync(join(dir, ...rel.split("/").slice(0, -1)), { recursive: true });
    writeFileSync(join(dir, ...rel.split("/")), body);
  }
  return dir;
}

const writeOpts = (extra = {}) => ({ session: "test-session", role: "builder", now: NOW, ...extra });

// ── the control probes ───────────────────────────────────────────────────────

test("control probes pass (the validator can catch its own removal)", () => {
  assert.deepEqual(runControlProbes(), []);
});

// ── run-ids: format, monotonic order, derivation ────────────────────────────

test("parseRunId accepts <date>-r<N> and rejects everything else", () => {
  assert.deepEqual(parseRunId("2026-07-19-r1"), { date: "2026-07-19", n: 1 });
  assert.deepEqual(parseRunId("2026-07-19-r12"), { date: "2026-07-19", n: 12 });
  assert.equal(parseRunId("2026-07-19-r0"), null);   // runs count from 1
  assert.equal(parseRunId("2026-13-45-r1"), null);   // not a real date
  assert.equal(parseRunId("run-1"), null);
  assert.equal(parseRunId(null), null);
});

test("runIdGreater is strict and numeric (r10 sorts after r9)", () => {
  assert.equal(runIdGreater("2026-07-19-r2", "2026-07-19-r1"), true);
  assert.equal(runIdGreater("2026-07-19-r10", "2026-07-19-r9"), true);
  assert.equal(runIdGreater("2026-07-20-r1", "2026-07-19-r9"), true);
  assert.equal(runIdGreater("2026-07-19-r1", "2026-07-19-r1"), false);
  assert.equal(runIdGreater("2026-07-18-r5", "2026-07-19-r1"), false);
});

test("deriveRunId: first run, same-day bump, new day, and clock-skew refusal", () => {
  assert.equal(deriveRunId(null, "2026-07-19"), "2026-07-19-r1");
  assert.equal(deriveRunId("2026-07-19-r1", "2026-07-19"), "2026-07-19-r2");
  assert.equal(deriveRunId("2026-07-18-r7", "2026-07-19"), "2026-07-19-r1");
  assert.equal(deriveRunId("2026-07-20-r1", "2026-07-19"), null, "a future-dated prior run cannot be sorted after — fail closed");
});

// ── write → verify green path ────────────────────────────────────────────────

test("write then verify: green path, dual timestamps, producer identity, per-entry run-ids", () => {
  const dir = mkBundle();
  const res = writeManifest(dir, writeOpts());
  assert.equal(res.refusal, undefined);
  assert.equal(res.unchanged, false);
  const m = JSON.parse(readFileSync(join(dir, MANIFEST), "utf8"));
  assert.equal(m.version, 1);
  assert.equal(m.run_id, "2026-07-19-r1");
  assert.equal(m.generated, "2026-07-19 17:30:00 IST", "IST to the second stays canonical");
  assert.equal(m.collected_at_utc, "2026-07-19T12:00:00Z", "machine records carry the dual UTC field");
  assert.deepEqual(m.producer, { session: "test-session", role: "builder" }, "EX-3 producer identity is recorded");
  assert.deepEqual(m.files.map((e) => e.path), ["raw/a.txt", "raw/b.txt"]);
  assert.ok(m.files.every((e) => e.run_id === "2026-07-19-r1"), "every entry records the run that appended it");
  assert.deepEqual(verifyBundle(dir), []);
  rmSync(dir, { recursive: true, force: true });
});

test("re-write with unchanged files is an idempotent no-op (same run-id)", () => {
  const dir = mkBundle();
  writeManifest(dir, writeOpts());
  const again = writeManifest(dir, writeOpts());
  assert.equal(again.unchanged, true);
  assert.equal(again.manifest.run_id, "2026-07-19-r1");
  rmSync(dir, { recursive: true, force: true });
});

test("producer identity is mandatory: missing session or bad role refuses; valid passes", () => {
  const dir = mkBundle();
  assert.match(writeManifest(dir, { role: "builder", now: NOW }).refusal, /session is required/);
  assert.match(writeManifest(dir, { session: "s", role: "approver", now: NOW }).refusal, /builder\|verifier/);
  assert.equal(writeManifest(dir, writeOpts({ role: "verifier" })).refusal, undefined);
  rmSync(dir, { recursive: true, force: true });
});

test("in-repo bundle dirs must live under launches/<domain>/; out-of-repo fixtures may not", () => {
  assert.equal(bundleDirCheck("/somewhere/else/entirely"), null, "outside the repo: fixture territory");
  assert.match(bundleDirCheck(join(process.cwd(), "docs", "reports")) ?? bundleDirCheck("/x"), /launches\/<domain>\//);
});

// ── tamper detection ─────────────────────────────────────────────────────────

test("DETECTOR tamper: edited evidence file fails verify, restored file passes", () => {
  const dir = mkBundle();
  writeManifest(dir, writeOpts());
  writeFileSync(join(dir, "raw", "a.txt"), "alpha-edited");
  assert.ok(verifyBundle(dir).some((f) => f.includes("TAMPER")));
  writeFileSync(join(dir, "raw", "a.txt"), "alpha");
  assert.deepEqual(verifyBundle(dir), []);
  rmSync(dir, { recursive: true, force: true });
});

test("DETECTOR missing: deleted manifested file fails verify", () => {
  const dir = mkBundle();
  writeManifest(dir, writeOpts());
  rmSync(join(dir, "raw", "b.txt"));
  assert.ok(verifyBundle(dir).some((f) => f.includes("MISSING")));
  rmSync(dir, { recursive: true, force: true });
});

// ── invisible evidence ───────────────────────────────────────────────────────

test("DETECTOR unmanifested file: extra file is a finding, manifesting it via append passes", () => {
  const dir = mkBundle();
  writeManifest(dir, writeOpts());
  writeFileSync(join(dir, "raw", "extra.txt"), "smuggled");
  assert.ok(verifyBundle(dir).some((f) => f.includes("invisible evidence")));
  // the legal cure is the append path, not deletion-and-pretend
  const appended = writeManifest(dir, writeOpts({ now: NOW2 }));
  assert.equal(appended.refusal, undefined);
  assert.deepEqual(verifyBundle(dir), []);
  rmSync(dir, { recursive: true, force: true });
});

test("a bundle with no manifest at all is itself a finding", () => {
  const dir = mkBundle();
  assert.ok(verifyBundle(dir).some((f) => f.includes("unmanifested bundle")));
  rmSync(dir, { recursive: true, force: true });
});

// ── THE ONE CORRECTION MODEL: entries append-only in WRITE mode ─────────────

test("DETECTOR mutation refusal: a changed manifested file is REFUSED under ANY run-id, citing the correction law", () => {
  const dir = mkBundle();
  writeManifest(dir, writeOpts());
  writeFileSync(join(dir, "raw", "a.txt"), "corrected content");
  // same run-id: refused
  const r1 = writeManifest(dir, writeOpts({ runId: "2026-07-19-r1" }));
  assert.ok(r1.refusal?.includes(CORRECTION_LAW), "refusal carries the correction law verbatim");
  // NEW run-id does not launder a mutation either — this was the old model's contradiction
  const r2 = writeManifest(dir, writeOpts({ runId: "2026-07-19-r2" }));
  assert.ok(r2.refusal?.includes(CORRECTION_LAW), "a bumped run-id cannot buy an in-place rewrite");
  // auto-derived run-id: same refusal
  const r3 = writeManifest(dir, writeOpts());
  assert.ok(r3.refusal?.includes(CORRECTION_LAW));
  // and the manifest on disk is untouched by every refused write
  assert.equal(JSON.parse(readFileSync(join(dir, MANIFEST), "utf8")).run_id, "2026-07-19-r1");
  rmSync(dir, { recursive: true, force: true });
});

test("DETECTOR deletion refusal: a missing manifested file refuses the write (the superseded file stays forever)", () => {
  const dir = mkBundle();
  writeManifest(dir, writeOpts());
  rmSync(join(dir, "raw", "b.txt"));
  const res = writeManifest(dir, writeOpts());
  assert.ok(res.refusal?.includes("missing from bundle"));
  assert.ok(res.refusal?.includes(CORRECTION_LAW));
  rmSync(dir, { recursive: true, force: true });
});

test("the documented correction: NEW versioned file + appended entry + superseded_by passes write AND verify", () => {
  const dir = mkBundle();
  writeManifest(dir, writeOpts());
  writeFileSync(join(dir, "raw", "b-v2.txt"), "beta corrected");
  const res = writeManifest(dir, writeOpts({ supersedes: { "raw/b.txt": "raw/b-v2.txt" } }));
  assert.equal(res.refusal, undefined);
  assert.equal(res.manifest.run_id, "2026-07-19-r2");
  const entries = Object.fromEntries(res.manifest.files.map((e) => [e.path, e]));
  assert.equal(entries["raw/b.txt"].superseded_by, "raw/b-v2.txt", "superseded entry stays and gains superseded_by");
  assert.equal(entries["raw/b.txt"].run_id, "2026-07-19-r1", "superseded entry keeps its original run-id");
  assert.equal(entries["raw/b-v2.txt"].run_id, "2026-07-19-r2", "appended entry carries the strictly-newer run-id");
  assert.deepEqual(verifyBundle(dir), []);
  rmSync(dir, { recursive: true, force: true });
});

test("supersedes guards: unknown old entry, already-superseded entry, and a corrector not added this run all refuse", () => {
  const dir = mkBundle();
  writeManifest(dir, writeOpts());
  writeFileSync(join(dir, "raw", "b-v2.txt"), "beta corrected");
  assert.match(writeManifest(dir, writeOpts({ supersedes: { "raw/ghost.txt": "raw/b-v2.txt" } })).refusal, /not an entry/);
  assert.match(writeManifest(dir, writeOpts({ supersedes: { "raw/b.txt": "raw/a.txt" } })).refusal, /ADDED files/,
    "the corrector must be a file appended in this very run");
  writeManifest(dir, writeOpts({ supersedes: { "raw/b.txt": "raw/b-v2.txt" } }));
  writeFileSync(join(dir, "raw", "b-v3.txt"), "beta re-corrected");
  assert.match(writeManifest(dir, writeOpts({ now: NOW2, supersedes: { "raw/b.txt": "raw/b-v3.txt" } })).refusal, /already superseded/,
    "superseded_by is set once — the one legal mutation, once");
  rmSync(dir, { recursive: true, force: true });
});

test("append with omitted --run-id auto-derives the next monotonic run-id", () => {
  const dir = mkBundle();
  writeManifest(dir, writeOpts());
  writeFileSync(join(dir, "raw", "c.txt"), "gamma");
  const res = writeManifest(dir, writeOpts());
  assert.equal(res.refusal, undefined);
  assert.equal(res.manifest.run_id, "2026-07-19-r2");
  rmSync(dir, { recursive: true, force: true });
});

test("DETECTOR monotonic: an append run-id that does not sort after the existing one is refused", () => {
  const dir = mkBundle();
  writeManifest(dir, writeOpts({ runId: "2026-07-19-r5" }));
  writeFileSync(join(dir, "raw", "c.txt"), "gamma");
  assert.match(writeManifest(dir, writeOpts({ runId: "2026-07-19-r3" })).refusal, /monotonic/);
  assert.equal(writeManifest(dir, writeOpts({ runId: "2026-07-19-r6" })).refusal, undefined);
  rmSync(dir, { recursive: true, force: true });
});

test("a run-id bump with nothing to append is refused (no content-free history rewrites)", () => {
  const dir = mkBundle();
  writeManifest(dir, writeOpts());
  assert.match(writeManifest(dir, writeOpts({ runId: "2026-07-19-r2" })).refusal, /nothing to append/);
  rmSync(dir, { recursive: true, force: true });
});

test("an unreadable existing manifest fails closed (cannot prove append vs rewrite)", () => {
  const dir = mkBundle();
  writeFileSync(join(dir, MANIFEST), "{ not json");
  assert.match(writeManifest(dir, writeOpts()).refusal, /fail closed/);
  rmSync(dir, { recursive: true, force: true });
});

// ── manifest schema ──────────────────────────────────────────────────────────

test("validateManifest: good manifest passes; each broken field fails", () => {
  const entries = [{ path: "raw/a.txt", sha256: sha256Hex(Buffer.from("x")), bytes: 1, run_id: "2026-07-19-r1" }];
  const good = buildManifest({ entries, runId: "2026-07-19-r1", producer: PRODUCER, now: NOW });
  assert.deepEqual(validateManifest(good), []);
  const broken = (patch) => validateManifest({ ...good, ...patch });
  assert.ok(broken({ version: 2 }).some((f) => f.includes("version")));
  assert.ok(broken({ generated: "2026-07-19T17:30:00" }).some((f) => f.includes("IST")));
  assert.ok(broken({ collected_at_utc: "yesterday" }).some((f) => f.includes("dual-timestamp")));
  assert.ok(broken({ run_id: "run-1" }).some((f) => f.includes("run_id")));
  assert.ok(broken({ producer: { session: "", role: "builder" } }).some((f) => f.includes("producer.session")));
  assert.ok(broken({ producer: { session: "s", role: "owner" } }).some((f) => f.includes("verifier separation")));
  assert.ok(broken({ files: [{ ...entries[0], path: "../escape.txt" }] }).some((f) => f.includes("bad file path")));
  assert.ok(broken({ files: [entries[0], entries[0]] }).some((f) => f.includes("duplicate")));
  assert.ok(broken({ files: [{ ...entries[0], sha256: "beef" }] }).some((f) => f.includes("64 hex")));
});

test("validateManifest per-entry laws: missing/future entry run_id and bad superseded_by fail; legal supersession passes", () => {
  const e = (p, runId, extra = {}) => ({ path: p, sha256: sha256Hex(Buffer.from(p)), bytes: p.length, run_id: runId, ...extra });
  const good = buildManifest({
    entries: [e("raw/b.txt", "2026-07-19-r1", { superseded_by: "raw/b-v2.txt" }), e("raw/b-v2.txt", "2026-07-19-r2")],
    runId: "2026-07-19-r2", producer: PRODUCER, now: NOW,
  });
  assert.deepEqual(validateManifest(good), [], "legal supersession chain is clean");
  const noRunId = buildManifest({ entries: [{ path: "a", sha256: sha256Hex(Buffer.from("a")), bytes: 1 }], runId: "2026-07-19-r1", producer: PRODUCER, now: NOW });
  assert.ok(validateManifest(noRunId).some((f) => f.includes("entry run_id")), "entry without run_id fails");
  const future = buildManifest({ entries: [e("a", "2026-07-19-r3")], runId: "2026-07-19-r1", producer: PRODUCER, now: NOW });
  assert.ok(validateManifest(future).some((f) => f.includes("future")), "entry from a later run than the manifest fails");
  const dangling = buildManifest({ entries: [e("a", "2026-07-19-r1", { superseded_by: "ghost.txt" })], runId: "2026-07-19-r1", producer: PRODUCER, now: NOW });
  assert.ok(validateManifest(dangling).some((f) => f.includes("superseded_by")), "superseded_by must point at a real entry");
  const backwards = buildManifest({
    entries: [e("a", "2026-07-19-r2", { superseded_by: "b" }), e("b", "2026-07-19-r1")],
    runId: "2026-07-19-r2", producer: PRODUCER, now: NOW,
  });
  assert.ok(validateManifest(backwards).some((f) => f.includes("strictly after")), "a correction cannot predate what it corrects");
});

test("walkBundle excludes the manifest itself and .DS_Store, and flags symlinks via snapshot", () => {
  const dir = mkBundle();
  writeFileSync(join(dir, MANIFEST), "{}");
  writeFileSync(join(dir, ".DS_Store"), "finder droppings");
  const { files } = walkBundle(dir);
  assert.deepEqual(files, ["raw/a.txt", "raw/b.txt"]);
  const { odd } = snapshotBundle(dir);
  assert.deepEqual(odd, []);
  rmSync(dir, { recursive: true, force: true });
});

// ── EV-4 append-only: pure law ───────────────────────────────────────────────

test("appendOnlyFindings: honest append passes; superseded_by gain is the ONE legal mutation; rewrite/removal/same-run fail", () => {
  const e = (p, body, runId = "2026-07-19-r1") => ({ path: p, sha256: sha256Hex(Buffer.from(body)), bytes: body.length, run_id: runId });
  const base = buildManifest({ entries: [e("a", "1"), e("b", "2")], runId: "2026-07-19-r1", producer: PRODUCER, now: NOW });
  const append = { ...base, run_id: "2026-07-19-r2", files: [...base.files, e("c", "3", "2026-07-19-r2")] };
  assert.deepEqual(appendOnlyFindings(base, append, "m"), []);
  const gained = { ...base, run_id: "2026-07-19-r2", files: [base.files[0], { ...base.files[1], superseded_by: "c" }, e("c", "3", "2026-07-19-r2")] };
  assert.deepEqual(appendOnlyFindings(base, gained, "m"), [], "gaining superseded_by is legal");
  const rewrite = { ...base, run_id: "2026-07-19-r2", files: [e("a", "1"), e("b", "EDITED")] };
  assert.ok(appendOnlyFindings(base, rewrite, "m").some((f) => f.includes("HISTORY REWRITE")));
  const removal = { ...base, run_id: "2026-07-19-r2", files: [e("a", "1")] };
  assert.ok(appendOnlyFindings(base, removal, "m").some((f) => f.includes("entry removed")));
  const sameRun = { ...base, files: [...base.files, e("c", "3")] };
  assert.ok(appendOnlyFindings(base, sameRun, "m").some((f) => f.includes("strictly greater run-id")));
  const runIdLaundered = { ...base, run_id: "2026-07-19-r2", files: [{ ...base.files[0], run_id: "2026-07-19-r2" }, base.files[1]] };
  assert.ok(appendOnlyFindings(base, runIdLaundered, "m").some((f) => f.includes("HISTORY REWRITE")), "changing an entry's run_id is a rewrite");
  const supersededFlip = {
    ...gained, run_id: "2026-07-19-r3",
    files: [gained.files[0], { ...gained.files[1], superseded_by: "a" }, gained.files[2]],
  };
  assert.ok(appendOnlyFindings(gained, supersededFlip, "m").some((f) => f.includes("superseded_by changed")), "superseded_by is set once");
});

test("manifestCovers matches only files inside the manifested bundle", () => {
  const m = { files: [{ path: "raw/a.txt", sha256: "0".repeat(64), bytes: 1 }] };
  const mp = "launches/x.com/evidence/run1/manifest.json";
  assert.equal(manifestCovers(mp, m, "launches/x.com/evidence/run1/raw/a.txt"), true);
  assert.equal(manifestCovers(mp, m, "launches/x.com/evidence/run1/raw/other.txt"), false);
  assert.equal(manifestCovers(mp, m, "launches/y.com/evidence/run1/raw/a.txt"), false);
});

test("ciFindings pure law: rename of manifested evidence counts as a deletion; files outside launches/ are ignored", () => {
  const e = { path: "raw/a.txt", sha256: "0".repeat(64), bytes: 1 };
  const mp = "launches/x.com/evidence/run1/manifest.json";
  const baseManifests = new Map([[mp, { run_id: "2026-07-19-r1", files: [e] }]]);
  const renamed = ciFindings({
    changed: [{ status: "R", oldPath: "launches/x.com/evidence/run1/raw/a.txt", path: "launches/x.com/evidence/run1/raw/renamed.txt" }],
    baseManifests, headRead: () => null,
  });
  assert.ok(renamed.some((f) => f.includes("DELETED")));
  const outside = ciFindings({ changed: [{ status: "M", path: "docs/reports/x.md" }], baseManifests, headRead: () => null });
  assert.deepEqual(outside, []);
});

test("ciFindings pure law: an ADDED manifest routes its bundle through FULL verification (status-A blind spot closed)", () => {
  const mp = "launches/new.com/evidence/run1/manifest.json";
  const calls = [];
  const findings = ciFindings({
    changed: [{ status: "A", path: mp }, { status: "A", path: "launches/new.com/evidence/run1/raw/a.txt" }],
    baseManifests: new Map(),
    headManifestPaths: new Set([mp]),
    verifyBundleAt: (d) => { calls.push(d); return ["TAMPER: sha256 mismatch for raw/a.txt"]; },
    headRead: () => null,
  });
  assert.deepEqual(calls, ["launches/new.com/evidence/run1/"], "the bundle is verified exactly once");
  assert.ok(findings.some((f) => f.includes("TAMPER")));
  const clean = ciFindings({
    changed: [{ status: "A", path: mp }],
    baseManifests: new Map(),
    headManifestPaths: new Set([mp]),
    verifyBundleAt: () => [],
    headRead: () => null,
  });
  assert.deepEqual(clean, [], "a fully-verified new bundle passes");
});

// ── EV-4 append-only: real git repos (tmp fixtures) ─────────────────────────

const git = (root, args) =>
  execFileSync("git", ["-c", "user.name=test", "-c", "user.email=test@test", ...args],
    { cwd: root, encoding: "utf8", stdio: ["ignore", "pipe", "pipe"] }).trim();

/** Throwaway git repo seeded with one committed evidence bundle + manifest. */
function mkRepo() {
  const root = mkdtempSync(join(tmpdir(), "evidence-ci-"));
  git(root, ["init", "-q"]);
  const bundle = join(root, "launches", "x.com", "evidence", "run1");
  mkdirSync(join(bundle, "raw"), { recursive: true });
  writeFileSync(join(bundle, "raw", "a.txt"), "alpha");
  writeFileSync(join(bundle, "raw", "b.txt"), "beta");
  const res = writeManifest(bundle, writeOpts());
  assert.equal(res.refusal, undefined, "fixture manifest must write clean");
  git(root, ["add", "-A"]);
  git(root, ["commit", "-q", "-m", "seed bundle"]);
  return { root, bundle, base: git(root, ["rev-parse", "HEAD"]) };
}

test("CI green path: adding new evidence + appending to the manifest under a new run-id passes", () => {
  const { root, bundle, base } = mkRepo();
  writeFileSync(join(bundle, "raw", "c.txt"), "gamma");
  const res = writeManifest(bundle, writeOpts({ now: NOW2 }));
  assert.equal(res.refusal, undefined);
  git(root, ["add", "-A"]);
  git(root, ["commit", "-q", "-m", "append evidence, new run-id"]);
  assert.deepEqual(collectCiFindings(root, base), []);
  rmSync(root, { recursive: true, force: true });
});

test("CI green path END-TO-END: the documented correction (write --supersedes → commit → ci) passes", () => {
  const { root, bundle, base } = mkRepo();
  // the documented correction command sequence, exactly as the header states it
  writeFileSync(join(bundle, "raw", "b-v2.txt"), "beta corrected");
  const res = writeManifest(bundle, writeOpts({ now: NOW2, supersedes: { "raw/b.txt": "raw/b-v2.txt" } }));
  assert.equal(res.refusal, undefined, "the documented write command must succeed");
  git(root, ["add", "-A"]);
  git(root, ["commit", "-q", "-m", "correction: raw/b-v2.txt supersedes raw/b.txt"]);
  assert.deepEqual(collectCiFindings(root, base), [], "a correction created through the documented write command passes CI");
  // and the bundle still verifies clean at HEAD
  assert.deepEqual(verifyBundle(bundle), []);
  rmSync(root, { recursive: true, force: true });
});

test("CI DETECTOR: a NEW bundle whose manifest carries a false hash FAILS ci", () => {
  const { root, base } = mkRepo();
  const evil = join(root, "launches", "y.com", "evidence", "run1");
  mkdirSync(join(evil, "raw"), { recursive: true });
  writeFileSync(join(evil, "raw", "fake.txt"), "actual bytes");
  const forged = buildManifest({
    entries: [{ path: "raw/fake.txt", sha256: "0".repeat(64), bytes: 12, run_id: "2026-07-19-r1" }],
    runId: "2026-07-19-r1", producer: PRODUCER, now: NOW,
  });
  writeFileSync(join(evil, MANIFEST), JSON.stringify(forged, null, 2) + "\n");
  git(root, ["add", "-A"]);
  git(root, ["commit", "-q", "-m", "smuggle forged new bundle"]);
  const findings = collectCiFindings(root, base);
  assert.ok(findings.some((f) => f.includes("TAMPER")), `expected TAMPER in: ${findings.join(" | ")}`);
  rmSync(root, { recursive: true, force: true });
});

test("CI DETECTOR: a NEW bundle with an unmanifested file FAILS ci", () => {
  const { root, base } = mkRepo();
  const dir = join(root, "launches", "y.com", "evidence", "run1");
  mkdirSync(join(dir, "raw"), { recursive: true });
  writeFileSync(join(dir, "raw", "listed.txt"), "listed");
  const res = writeManifest(dir, writeOpts());
  assert.equal(res.refusal, undefined);
  writeFileSync(join(dir, "raw", "smuggled.txt"), "not in the manifest");
  git(root, ["add", "-A"]);
  git(root, ["commit", "-q", "-m", "bundle with invisible evidence"]);
  assert.ok(collectCiFindings(root, base).some((f) => f.includes("invisible evidence")));
  rmSync(root, { recursive: true, force: true });
});

test("CI DETECTOR: a NEW malformed manifest (missing producer / bad schema) FAILS ci", () => {
  const { root, base } = mkRepo();
  const dir = join(root, "launches", "y.com", "evidence", "run1");
  mkdirSync(join(dir, "raw"), { recursive: true });
  const body = "hello";
  writeFileSync(join(dir, "raw", "a.txt"), body);
  const m = buildManifest({
    entries: [{ path: "raw/a.txt", sha256: sha256Hex(Buffer.from(body)), bytes: body.length, run_id: "2026-07-19-r1" }],
    runId: "2026-07-19-r1", producer: PRODUCER, now: NOW,
  });
  delete m.producer; // the forged bundle omits EX-3 identity
  writeFileSync(join(dir, MANIFEST), JSON.stringify(m, null, 2) + "\n");
  git(root, ["add", "-A"]);
  git(root, ["commit", "-q", "-m", "manifest without producer"]);
  assert.ok(collectCiFindings(root, base).some((f) => f.includes("producer")));
  rmSync(root, { recursive: true, force: true });
});

test("CI DETECTOR: modifying a manifested evidence file fails append-only", () => {
  const { root, bundle, base } = mkRepo();
  writeFileSync(join(bundle, "raw", "a.txt"), "alpha REWRITTEN");
  git(root, ["add", "-A"]);
  git(root, ["commit", "-q", "-m", "rewrite evidence in place"]);
  assert.ok(collectCiFindings(root, base).some((f) => f.includes("append-only")));
  rmSync(root, { recursive: true, force: true });
});

test("CI DETECTOR: deleting a manifested evidence file fails append-only", () => {
  const { root, bundle, base } = mkRepo();
  rmSync(join(bundle, "raw", "b.txt"));
  git(root, ["add", "-A"]);
  git(root, ["commit", "-q", "-m", "delete evidence"]);
  assert.ok(collectCiFindings(root, base).some((f) => f.includes("DELETED")));
  rmSync(root, { recursive: true, force: true });
});

test("CI DETECTOR: rewriting manifest history (entry changed, run-id not bumped) fails", () => {
  const { root, bundle, base } = mkRepo();
  const mPath = join(bundle, MANIFEST);
  const m = JSON.parse(readFileSync(mPath, "utf8"));
  m.files[0].sha256 = "0".repeat(64); // launder a hash without touching run_id
  writeFileSync(mPath, JSON.stringify(m, null, 2) + "\n");
  git(root, ["add", "-A"]);
  git(root, ["commit", "-q", "-m", "launder manifest"]);
  const findings = collectCiFindings(root, base);
  assert.ok(findings.some((f) => f.includes("HISTORY REWRITE")));
  assert.ok(findings.some((f) => f.includes("strictly greater run-id")));
  rmSync(root, { recursive: true, force: true });
});

test("CI DETECTOR: deleting a committed manifest.json fails", () => {
  const { root, bundle, base } = mkRepo();
  rmSync(join(bundle, MANIFEST));
  git(root, ["add", "-A"]);
  git(root, ["commit", "-q", "-m", "drop the manifest"]);
  assert.ok(collectCiFindings(root, base).some((f) => f.includes(`${MANIFEST} DELETED`)));
  rmSync(root, { recursive: true, force: true });
});

test("CI refuses to guess when no base can be resolved", () => {
  const root = mkdtempSync(join(tmpdir(), "evidence-ci-nobase-"));
  git(root, ["init", "-q", "-b", "work"]); // no main, no origin/main, no --base
  writeFileSync(join(root, "f.txt"), "x");
  git(root, ["add", "-A"]);
  git(root, ["commit", "-q", "-m", "only commit"]);
  assert.throws(() => collectCiFindings(root, ""), /refuses to guess/);
  rmSync(root, { recursive: true, force: true });
});
