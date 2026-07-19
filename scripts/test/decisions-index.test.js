// decisions-index.test.js — tests for the decisions/ provenance store tooling
// (OS v2 plan §3.2; strict residues CM-073/CM-076; owner requirement R2).
//
// House rule (gate-registry-lint.test.js et al.): every detector is tested in
// BOTH directions — the clean input must PASS and the broken input must FAIL,
// for the same detector, in the same run.
//
// house style: plain ESM + node --test, no dependencies.
import { test } from "node:test";
import assert from "node:assert/strict";
import { execFileSync, spawnSync } from "node:child_process";
import { readFileSync, existsSync, mkdirSync, mkdtempSync, rmSync, writeFileSync } from "node:fs";
import { join, resolve } from "node:path";
import { tmpdir } from "node:os";

import {
  INDEX_FILE, PROBE_GOOD, REPO_ROOT, SECTIONS, TYPES,
  buildIndex, checkImmutability, guardianFindings, immutableHash, lintRecords,
  loadRecords, parseRecord, resolveBaseIndex, runControlProbes, serializeIndex,
} from "../decisions-index.mjs";

/** Parse the known-good probe, optionally transformed. */
const probe = (transform = (s) => s, file = "decisions/D-20260719-probe-good.md") =>
  parseRecord(transform(PROBE_GOOD), file);

/** A second, independent good record (for linkage / guardian fixtures). */
const RECORD_B = PROBE_GOOD
  .replace("D-20260719-probe-good", "D-20260720-probe-heir")
  .replace('date: "2026-07-19 12:00:00 IST"', 'date: "2026-07-20 09:00:00 IST"')
  .replace("type: process", "type: gate");

test("control probes pass (the validator can catch its own removal)", () => {
  assert.deepEqual(runControlProbes(), []);
});

/* ───────────── format validation, both directions ───────────── */

test("known-good record parses and lints clean", () => {
  const { rec, errors } = probe();
  assert.deepEqual(errors, []);
  assert.equal(rec.fm.id, "D-20260719-probe-good");
  assert.equal(rec.title, "Probe decision");
  assert.deepEqual(lintRecords([rec]), []);
});

test("DETECTOR frontmatter completeness: each missing field fails; complete record passes", () => {
  for (const field of ["deciders", "expected_outcome"]) {
    const { rec } = probe((s) => s.replace(new RegExp(`${field}: .*\\n`), ""));
    assert.ok(lintRecords([rec]).some((e) => e.includes(`missing/empty ${field}`)), field);
  }
  const noSources = probe((s) => s.replace(/sources:[\s\S]*?retrieved: "2026-07-19"\n/, ""));
  assert.ok(lintRecords([noSources.rec]).some((e) => e.includes("sources must be a non-empty list")));
  assert.deepEqual(lintRecords([probe().rec]), []);
});

test("DETECTOR enums: bad type/status/confidence/trust_tier fail; good ones pass", () => {
  assert.ok(lintRecords([probe((s) => s.replace("type: process", "type: vibes")).rec])
    .some((e) => e.includes('type "vibes" not in enum')));
  assert.ok(lintRecords([probe((s) => s.replace("status: accepted", "status: maybe")).rec])
    .some((e) => e.includes('status "maybe" not in enum')));
  assert.ok(lintRecords([probe((s) => s.replace("confidence: high", "confidence: 90%")).rec])
    .some((e) => e.includes('confidence "90%" not in enum')));
  assert.ok(lintRecords([probe((s) => s.replace("trust_tier: repo_artifact", "trust_tier: reddit")).rec])
    .some((e) => e.includes('trust_tier "reddit" not in enum')));
  assert.deepEqual(lintRecords([probe().rec]), []);
});

test("DETECTOR IST-to-the-second date: date-only fails, full IST stamp passes; id/date agreement enforced", () => {
  const dateless = probe((s) => s.replace('date: "2026-07-19 12:00:00 IST"', 'date: "2026-07-19"'));
  assert.ok(lintRecords([dateless.rec]).some((e) => e.includes("IST to the second")));
  const wrongDay = probe((s) => s.replace('date: "2026-07-19 12:00:00 IST"', 'date: "2026-07-21 12:00:00 IST"'));
  assert.ok(lintRecords([wrongDay.rec]).some((e) => e.includes("disagrees with frontmatter date")));
  assert.deepEqual(lintRecords([probe().rec]), []);
});

test("DETECTOR filename/id law: mismatched filename fails, matching passes; bare-number slug rejected", () => {
  const wrongFile = probe((s) => s, "decisions/D-20260719-other-name.md");
  assert.ok(lintRecords([wrongFile.rec]).some((e) => e.includes("filename must equal id")));
  const numeric = probe((s) => s.replace(/D-20260719-probe-good/g, "D-20260719-06"),
    "decisions/D-20260719-06.md");
  assert.ok(lintRecords([numeric.rec]).some((e) => e.includes("does not match D-YYYYMMDD-<kebab-slug>")));
  assert.deepEqual(lintRecords([probe().rec]), []);
});

test("DETECTOR body sections: each of the six is required in order; complete body passes", () => {
  for (const h of SECTIONS) {
    const { rec } = probe((s) => s.replace(`${h}\n`, ""));
    assert.ok(lintRecords([rec]).some((e) => e.includes(`missing body section "${h}"`)), h);
  }
  const reordered = probe((s) =>
    s.replace("## Context\nx\n## Drivers\nx\n", "## Drivers\nx\n## Context\nx\n"));
  assert.ok(lintRecords([reordered.rec]).some((e) => e.includes("out of order")));
  assert.deepEqual(lintRecords([probe().rec]), []);
});

/* ───────────── immutability tamper detection, both directions ───────────── */

test("DETECTOR immutability: edited accepted record fails vs stored hash; untouched passes", () => {
  const good = probe().rec;
  const prior = buildIndex([good]);
  const tampered = probe((s) => s.replace("probe outcome", "quietly rewritten")).rec;
  assert.ok(checkImmutability([tampered], prior).some((e) => e.includes("changed vs stored hash")));
  assert.deepEqual(checkImmutability([good], prior), []);
});

test("DETECTOR immutability: deleting an accepted record fails; proposed records stay editable", () => {
  const good = probe().rec;
  assert.ok(checkImmutability([], buildIndex([good])).some((e) => e.includes("now MISSING")));
  const proposed = probe((s) => s.replace("status: accepted", "status: proposed")).rec;
  const priorProposed = buildIndex([proposed]);
  const editedProposed = probe((s) => s
    .replace("status: accepted", "status: proposed")
    .replace("probe outcome", "still drafting")).rec;
  assert.deepEqual(checkImmutability([editedProposed], priorProposed), []);
});

test("the supersession flip is the ONLY legal mutation of an accepted record", () => {
  const good = probe().rec;
  const prior = buildIndex([good]);
  // status + superseded_by are excluded from the immutable hash…
  const flipped = probe((s) => s
    .replace("status: accepted", "status: superseded\nsuperseded_by: D-20260720-probe-heir")).rec;
  assert.equal(flipped.immutable_sha256, good.immutable_sha256);
  assert.deepEqual(checkImmutability([flipped], prior), []);
  // …but flipping accepted → rejected fails, and superseded is terminal.
  const rejected = probe((s) => s.replace("status: accepted", "status: rejected")).rec;
  assert.ok(checkImmutability([rejected], prior).some((e) => e.includes("only legal flip")));
  const priorSuperseded = buildIndex([flipped]);
  const unflipped = probe().rec;
  assert.ok(checkImmutability([unflipped], priorSuperseded).some((e) => e.includes("superseded is terminal")));
});

/* ───────────── supersedes chain, both directions ───────────── */

test("DETECTOR supersedes chain: fully-linked pair passes; each broken link fails", () => {
  const old = probe((s) => s
    .replace("status: accepted", "status: superseded\nsuperseded_by: D-20260720-probe-heir")).rec;
  const heir = parseRecord(
    RECORD_B.replace("confidence: high", "confidence: high\nsupersedes: D-20260719-probe-good"),
    "decisions/D-20260720-probe-heir.md").rec;
  assert.deepEqual(lintRecords([old, heir]), []);

  // heir points at a record that does not exist
  assert.ok(lintRecords([heir]).some((e) => e.includes("no such record")));
  // target never flipped (still accepted, no backlink)
  const unflippedOld = probe().rec;
  assert.ok(lintRecords([unflippedOld, heir]).some((e) => e.includes('status is "accepted"')));
  // flip without a backlink
  const noBacklink = probe((s) => s.replace("status: accepted", "status: superseded")).rec;
  assert.ok(lintRecords([noBacklink]).some((e) => e.includes("without a superseded_by backlink")));
  // self-supersession
  const selfRef = probe((s) => s.replace("confidence: high", "confidence: high\nsupersedes: D-20260719-probe-good")).rec;
  assert.ok(lintRecords([selfRef]).some((e) => e.includes("supersedes itself")));
});

/* ───────────── guardian matching, both directions ───────────── */

test("DETECTOR guardian: global type heuristics match governed paths and skip unrelated ones", () => {
  const gateRec = parseRecord(RECORD_B, "decisions/D-20260720-probe-heir.md").rec; // type: gate
  const hits = guardianFindings([gateRec], ["gates/registry.yaml", "sites/kairali.com/app/page.tsx"]);
  assert.deepEqual(hits.map((h) => h.file), ["gates/registry.yaml"]);
  assert.equal(hits[0].id, "D-20260720-probe-heir");
});

test("DETECTOR guardian: explicit governs list replaces the type heuristic — matches its paths, ignores heuristic paths", () => {
  const withGoverns = probe((s) => s.replace(
    "confidence: high",
    "confidence: high\ngoverns:\n  - gates/class-map.yaml\n  - CLAUDE.md")).rec; // type: process
  assert.deepEqual(lintRecords([withGoverns]), []);
  const hits = guardianFindings([withGoverns], [
    "gates/class-map.yaml", "CLAUDE.md", "gates/registry.yaml", "docs/process/os-2026/whatever.md",
  ]);
  // docs/process/ would match the process heuristic — the explicit list wins instead.
  assert.deepEqual(hits.map((h) => h.file), ["gates/class-map.yaml", "CLAUDE.md"]);
  // and an empty governs entry is a lint finding
  const badGoverns = probe((s) => s.replace("confidence: high", 'confidence: high\ngoverns:\n  - ""')).rec;
  assert.ok(lintRecords([badGoverns]).some((e) => e.includes("governs[0] is empty")));
});

test("DETECTOR guardian: site-scoped records govern their domain trees only; decision records themselves are exempt", () => {
  const site = probe((s) => s.replace("type: process", "type: design.direction"),
    "launches/theblushlounge.com/decisions/D-20260719-probe-good.md").rec;
  const hits = guardianFindings([site], [
    "sites/theblushlounge.com/app/page.tsx",
    "launches/theblushlounge.com/design-review/2026-07-20-pass1.md",
    "sites/kairali.com/app/page.tsx",
    "launches/theblushlounge.com/decisions/D-20260719-probe-good.md",
  ]);
  assert.deepEqual(hits.map((h) => h.file), [
    "sites/theblushlounge.com/app/page.tsx",
    "launches/theblushlounge.com/design-review/2026-07-20-pass1.md",
  ]);
});

/* ───────────── the real store ───────────── */

test("every committed record in the real store lints clean", () => {
  const { records, errors } = loadRecords();
  assert.deepEqual(errors, []);
  assert.ok(records.length >= 15, `expected the M2 seed set (15+ records), found ${records.length}`);
  assert.deepEqual(lintRecords(records), []);
  for (const r of records) assert.ok(TYPES.has(r.fm.type), r.file);
});

test("committed decisions/index.json is present, current, and hash-consistent (the --check contract)", () => {
  const indexPath = resolve(REPO_ROOT, INDEX_FILE);
  assert.ok(existsSync(indexPath), `${INDEX_FILE} must be committed (CI --check depends on it)`);
  const { records } = loadRecords();
  assert.equal(readFileSync(indexPath, "utf8"), serializeIndex(buildIndex(records)));
  const parsed = JSON.parse(readFileSync(indexPath, "utf8"));
  assert.deepEqual(checkImmutability(records, parsed), []);
  for (const row of parsed) {
    assert.match(row.content_sha256, /^sha256:[0-9a-f]{64}$/);
    assert.match(row.immutable_sha256, /^sha256:[0-9a-f]{64}$/);
  }
});

/* ───────────── BASE TRUST (--check vs the merge-base ledger) ─────────────
 *
 * The blocker this closes: --check used to load the prior index from the
 * WORKING TREE, so a PR that edited an accepted record AND re-hashed
 * decisions/index.json in the same commit compared the edited record with
 * the edited ledger — and passed. Both directions are proven below on real
 * git fixtures: the laundering commit FAILS with --base and (documented old
 * behavior) still passes without it; legal supersession passes WITH --base;
 * the store-minting PR bootstraps loudly instead of bricking itself.
 */

const SCRIPT = resolve(REPO_ROOT, "scripts/decisions-index.mjs");

/** Run `decisions-index.mjs --check --root <root> [...args]` with BASE env cleared. */
function runCheck(root, extraArgs = []) {
  return spawnSync(process.execPath, [SCRIPT, "--check", "--root", root, ...extraArgs], {
    encoding: "utf8",
    env: { ...process.env, BASE: "" }, // ambient BASE must not leak into "local mode" runs
  });
}

/** Fresh git repo (branch main) in a tmpdir; returns {root, git, commitStore}. */
function gitFixture() {
  const root = mkdtempSync(join(tmpdir(), "decisions-base-trust-"));
  const git = (...a) => execFileSync("git", a, { cwd: root, encoding: "utf8" });
  git("init", "-q", "-b", "main");
  git("config", "user.email", "test@example.com");
  git("config", "user.name", "test");
  /** Write record files + a FRESH index built from them, then commit. */
  const commitStore = (files, msg) => {
    const records = [];
    for (const [rel, text] of files) {
      mkdirSync(join(root, rel, ".."), { recursive: true });
      writeFileSync(join(root, rel), text);
      records.push(parseRecord(text, rel).rec);
    }
    mkdirSync(join(root, "decisions"), { recursive: true });
    writeFileSync(join(root, "decisions/index.json"), serializeIndex(buildIndex(records)));
    git("add", "-A");
    git("commit", "-q", "-m", msg);
  };
  return { root, git, commitStore };
}

const GOOD_REL = "decisions/D-20260719-probe-good.md";
const HEIR_REL = "decisions/D-20260720-probe-heir.md";
const HEIR_SUPERSEDING = RECORD_B.replace("confidence: high", "confidence: high\nsupersedes: D-20260719-probe-good");
const GOOD_FLIPPED = PROBE_GOOD.replace("status: accepted",
  "status: superseded\nsuperseded_by: D-20260720-probe-heir");

test("BASE TRUST: same-commit edit+reindex laundering FAILS with --base — and (the documented hole) passes without it", () => {
  const { root, git, commitStore } = gitFixture();
  try {
    commitStore([[GOOD_REL, PROBE_GOOD]], "mint store");
    git("checkout", "-q", "-b", "pr");
    // The laundering commit: edit the accepted record AND re-hash the ledger together.
    commitStore([[GOOD_REL, PROBE_GOOD.replace("probe outcome", "laundered outcome")]], "launder");

    const withBase = runCheck(root, ["--base", "main"]);
    assert.equal(withBase.status, 1, withBase.stdout + withBase.stderr);
    assert.match(withBase.stderr, /BASE-TRUST\(@[0-9a-f]{12}\): IMMUTABILITY:.*changed vs stored hash/);

    // Without a base the working-tree comparison is all there is — the edited
    // ledger vouches for the edited record. This run PASSING is exactly why
    // CI must pass BASE; the local-mode line says so out loud.
    const withoutBase = runCheck(root);
    assert.equal(withoutBase.status, 0, withoutBase.stdout + withoutBase.stderr);
    assert.match(withoutBase.stdout, /CI enforces base-trust/);
  } finally { rmSync(root, { recursive: true, force: true }); }
});

test("BASE TRUST: deleting an accepted record together with its index row FAILS with --base", () => {
  const { root, git, commitStore } = gitFixture();
  try {
    commitStore([[GOOD_REL, PROBE_GOOD]], "mint store");
    git("checkout", "-q", "-b", "pr");
    rmSync(join(root, GOOD_REL));
    commitStore([], "delete record + de-index it");

    const r = runCheck(root, ["--base", "main"]);
    assert.equal(r.status, 1, r.stdout + r.stderr);
    assert.match(r.stderr, /BASE-TRUST\(@[0-9a-f]{12}\): IMMUTABILITY: D-20260719-probe-good.*now MISSING/);
  } finally { rmSync(root, { recursive: true, force: true }); }
});

test("BASE TRUST: legal supersession (flip + linked heir, reindexed) PASSES with --base", () => {
  const { root, git, commitStore } = gitFixture();
  try {
    commitStore([[GOOD_REL, PROBE_GOOD]], "mint store");
    git("checkout", "-q", "-b", "pr");
    commitStore([[GOOD_REL, GOOD_FLIPPED], [HEIR_REL, HEIR_SUPERSEDING]], "supersede legally");

    const r = runCheck(root, ["--base", "main"]);
    assert.equal(r.status, 0, r.stdout + r.stderr);
    assert.match(r.stdout, /base-trust: current records verified against decisions\/index\.json @ merge base [0-9a-f]{12}/);
  } finally { rmSync(root, { recursive: true, force: true }); }
});

test("BASE TRUST bootstrap: the PR that MINTS the store passes with a LOUD base-trust-unavailable line", () => {
  const { root, git, commitStore } = gitFixture();
  try {
    writeFileSync(join(root, "README.md"), "pre-store repo\n");
    git("add", "-A");
    git("commit", "-q", "-m", "no store yet");
    git("checkout", "-q", "-b", "pr");
    commitStore([[GOOD_REL, PROBE_GOOD]], "mint store in this PR");

    const r = runCheck(root, ["--base", "main"]);
    assert.equal(r.status, 0, r.stdout + r.stderr);
    assert.match(r.stdout, /BASE-TRUST UNAVAILABLE/);
    assert.match(r.stdout, /bootstrap/);
  } finally { rmSync(root, { recursive: true, force: true }); }
});

test("resolveBaseIndex fails CLOSED on a corrupt base index and on an unresolvable merge base", () => {
  const { root, git } = gitFixture();
  try {
    mkdirSync(join(root, "decisions"), { recursive: true });
    writeFileSync(join(root, "decisions/index.json"), "not json at all");
    git("add", "-A");
    git("commit", "-q", "-m", "corrupt ledger");
    const corrupt = resolveBaseIndex({ baseRef: "main", root });
    assert.equal(corrupt.baseIndex, null);
    assert.match(corrupt.error ?? "", /not a valid JSON array.*FAILS CLOSED/);
    assert.ok(!corrupt.bootstrap, "corruption must not be mistaken for a bootstrap");
  } finally { rmSync(root, { recursive: true, force: true }); }

  const empty = mkdtempSync(join(tmpdir(), "decisions-no-commits-"));
  try {
    execFileSync("git", ["init", "-q", "-b", "main"], { cwd: empty });
    const r = resolveBaseIndex({ baseRef: "main", root: empty });
    assert.equal(r.baseIndex, null);
    assert.match(r.error ?? "", /cannot resolve a merge base/);
  } finally { rmSync(empty, { recursive: true, force: true }); }
});

test("immutableHash excludes exactly the two mutable fields and nothing else", () => {
  const base = PROBE_GOOD;
  assert.equal(
    immutableHash(base.replace("status: accepted", "status: superseded\nsuperseded_by: D-20260720-x")),
    immutableHash(base));
  assert.notEqual(immutableHash(base.replace("type: process", "type: gate")), immutableHash(base));
  assert.notEqual(immutableHash(base.replace("## Outcome\nx", "## Outcome\nrewritten")), immutableHash(base));
});
