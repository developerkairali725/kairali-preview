// writer-lease.test.js — tests for the writer-lease + duplicate-report guard
// (GPTW-04/36/42, owner-ruled ADOPT: concurrent worktree sessions produced
// truncated duplicate reports; this is the contention convention MECHANIZED,
// report-only altitude).
//
// House rule (matrix-walk.test.js, gate-registry-lint.test.js): every
// detector is tested in BOTH directions — the clean input must PASS and the
// broken input must FAIL, for the same detector, in the same run. Everything
// runs offline: leases live in a per-run temp dir, holder ids come from
// injected env, the clock is an injected nowMs.
//
// house style: plain ESM + node --test.
import { test } from "node:test";
import assert from "node:assert/strict";
import { existsSync, mkdtempSync, readFileSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";

import {
  DEFAULT_TTL_MIN, fmtAge, holderId, isStale, istStamp, loadState, runCli,
} from "../writer-lease.mjs";
import {
  PROBE_NEW_GOOD, TRUNCATION_BYTES, canonicalStem, duplicateReportSignals,
  lintReportStore, runControlProbes,
} from "../report-store-lint.mjs";

// ── harness: temp state + injected env/clock ─────────────────────────────────

const T0 = Date.UTC(2026, 6, 21, 9, 0, 0); // 2026-07-21 14:30:00 IST
const MIN = 60 * 1000;
let n = 0;
/** Fresh temp state file per test — parallel tests never share a lease. */
const freshState = () => join(mkdtempSync(join(tmpdir(), "writer-lease-test-")), `lease-${n++}.json`);
/** Drive the CLI as holder `id` at time `at` against state file `state`. */
const cli = (state, id, at, ...argv) =>
  runCli([...argv, "--state", state], { env: { WRITER_LEASE_ID: id }, nowMs: at, pid: 424242 });

// ── time + identity helpers ──────────────────────────────────────────────────

test("istStamp is IST to the second (house timestamp law)", () => {
  assert.equal(istStamp(T0), "2026-07-21 14:30:00 IST");
  assert.equal(istStamp(Date.UTC(2026, 0, 1, 0, 0, 7)), "2026-01-01 05:30:07 IST");
});

test("holderId: WRITER_LEASE_ID env names the session; pid fallback otherwise", () => {
  assert.equal(holderId({ WRITER_LEASE_ID: "wave1-B" }, 7), "wave1-B");
  assert.equal(holderId({ WRITER_LEASE_ID: "  " }, 7), "pid-7");
  assert.equal(holderId({}, 7), "pid-7");
});

test("fmtAge renders minutes/seconds and folds hours in", () => {
  assert.equal(fmtAge(4 * MIN + 12_000), "4m12s");
  assert.equal(fmtAge(65 * MIN), "1h5m0s");
});

// ── claim: free scope ────────────────────────────────────────────────────────

test("claim on a free scope succeeds, persists the lease, default TTL 30m", () => {
  const state = freshState();
  const { code, lines } = cli(state, "agent-A", T0, "claim", "reports");
  assert.equal(code, 0);
  assert.ok(lines.some((l) => l.startsWith("CLAIMED") && l.includes("agent-A") && l.includes("2026-07-21 14:30:00 IST")), lines.join(" | "));
  const persisted = JSON.parse(readFileSync(state, "utf8")).leases.reports;
  assert.equal(persisted.holder, "agent-A");
  assert.equal(persisted.ttl_min, DEFAULT_TTL_MIN);
  assert.equal(persisted.claimed_at_ms, T0);
});

test("--ttl-min overrides the TTL; garbage TTL is a usage error (exit 1)", () => {
  const state = freshState();
  assert.equal(cli(state, "A", T0, "claim", "reports", "--ttl-min", "45").code, 0);
  assert.equal(JSON.parse(readFileSync(state, "utf8")).leases.reports.ttl_min, 45);
  assert.equal(cli(freshState(), "A", T0, "claim", "reports", "--ttl-min", "soon").code, 1);
});

// ── claim: foreign LIVE lease is DENIED loudly (the incident's exact race) ───

test("a live foreign lease DENIES a claim with exit 2, naming holder and age", () => {
  const state = freshState();
  cli(state, "agent-A", T0, "claim", "reports");
  const { code, lines } = cli(state, "agent-B", T0 + 4 * MIN + 12_000, "claim", "reports");
  assert.equal(code, 2);
  const msg = lines.join(" | ");
  assert.ok(msg.includes("LEASE DENIED"), msg);
  assert.ok(msg.includes("agent-A"), "denial must NAME the holder");
  assert.ok(msg.includes("4m12s"), "denial must state the lease age");
  assert.ok(msg.includes("GPTW-04"), "denial cites the incident, not vibes");
  // ...and the lease on disk is UNCHANGED (a denied claim writes nothing)
  assert.equal(JSON.parse(readFileSync(state, "utf8")).leases.reports.holder, "agent-A");
});

// ── claim: stale takeover ────────────────────────────────────────────────────

test("a stale foreign lease (past TTL) is TAKEN OVER with a printed note", () => {
  const state = freshState();
  cli(state, "agent-A", T0, "claim", "reports"); // 30m TTL
  const { code, lines } = cli(state, "agent-B", T0 + 31 * MIN, "claim", "reports");
  assert.equal(code, 0);
  assert.ok(lines.some((l) => l.startsWith("TAKEOVER") && l.includes("agent-A") && l.includes("STALE")), lines.join(" | "));
  assert.equal(JSON.parse(readFileSync(state, "utf8")).leases.reports.holder, "agent-B");
});

test("staleness boundary: one minute BEFORE TTL still denies; AT TTL takes over", () => {
  const state = freshState();
  cli(state, "A", T0, "claim", "reports");
  assert.equal(cli(state, "B", T0 + 29 * MIN, "claim", "reports").code, 2);
  assert.equal(cli(state, "B", T0 + 30 * MIN, "claim", "reports").code, 0);
});

// ── claim: same-holder re-claim refreshes ────────────────────────────────────

test("same-holder re-claim REFRESHES: TTL clock resets, first-claim stamp kept", () => {
  const state = freshState();
  cli(state, "agent-A", T0, "claim", "reports");
  const { code, lines } = cli(state, "agent-A", T0 + 10 * MIN, "claim", "reports");
  assert.equal(code, 0);
  assert.ok(lines.some((l) => l.startsWith("REFRESHED")), lines.join(" | "));
  const lease = JSON.parse(readFileSync(state, "utf8")).leases.reports;
  assert.equal(lease.claimed_at_ms, T0 + 10 * MIN);
  assert.equal(lease.first_claimed_at_ist, istStamp(T0));
  // the refresh really moved the staleness clock: 35m after T0 is only 25m
  // after the refresh, so a foreign claim is still denied…
  assert.equal(cli(state, "agent-B", T0 + 35 * MIN, "claim", "reports").code, 2);
  // …and 40m after T0 (30m after refresh) it is stale again.
  assert.equal(cli(state, "agent-B", T0 + 40 * MIN, "claim", "reports").code, 0);
});

// ── release ──────────────────────────────────────────────────────────────────

test("release of an own lease frees the scope; releasing nothing is idempotent", () => {
  const state = freshState();
  cli(state, "agent-A", T0, "claim", "reports");
  assert.equal(cli(state, "agent-A", T0 + MIN, "release", "reports").code, 0);
  assert.deepEqual(JSON.parse(readFileSync(state, "utf8")).leases, {});
  const again = cli(state, "agent-A", T0 + MIN, "release", "reports");
  assert.equal(again.code, 0);
  assert.ok(again.lines.some((l) => l.includes("nothing to release")));
});

test("releasing a foreign LIVE lease is REFUSED (exit 2); a stale one is cleared", () => {
  const state = freshState();
  cli(state, "agent-A", T0, "claim", "reports");
  const refused = cli(state, "agent-B", T0 + 5 * MIN, "release", "reports");
  assert.equal(refused.code, 2);
  assert.ok(refused.lines.some((l) => l.includes("RELEASE REFUSED")), refused.lines.join(" | "));
  assert.equal(JSON.parse(readFileSync(state, "utf8")).leases.reports.holder, "agent-A");
  const cleared = cli(state, "agent-B", T0 + 31 * MIN, "release", "reports");
  assert.equal(cleared.code, 0);
  assert.ok(cleared.lines.some((l) => l.includes("stale-cleanup")));
});

// ── check + list ─────────────────────────────────────────────────────────────

test("check: free=0, own=0, foreign live=2, foreign stale=0 (claim will take over)", () => {
  const state = freshState();
  assert.equal(cli(state, "B", T0, "check", "reports").code, 0);
  cli(state, "agent-A", T0, "claim", "reports");
  assert.equal(cli(state, "agent-A", T0 + MIN, "check", "reports").code, 0);
  const held = cli(state, "agent-B", T0 + MIN, "check", "reports");
  assert.equal(held.code, 2);
  assert.ok(held.lines.some((l) => l.startsWith("HELD") && l.includes("agent-A")));
  const stale = cli(state, "agent-B", T0 + 31 * MIN, "check", "reports");
  assert.equal(stale.code, 0);
  assert.ok(stale.lines.some((l) => l.startsWith("STALE")));
});

test("list shows every lease with LIVE/STALE status; empty list exits 0", () => {
  const state = freshState();
  assert.equal(cli(state, "A", T0, "list").code, 0);
  cli(state, "agent-A", T0, "claim", "reports");
  cli(state, "agent-A", T0, "claim", "wave-records");
  const { code, lines } = cli(state, "agent-B", T0 + 31 * MIN, "list");
  assert.equal(code, 0);
  assert.ok(lines.some((l) => l.startsWith("STALE") && l.includes('"reports"')), lines.join(" | "));
  assert.ok(lines.some((l) => l.includes('"wave-records"')));
});

// ── harness edges ────────────────────────────────────────────────────────────

test("unknown command and missing scope are usage errors (exit 1), never findings", () => {
  assert.equal(cli(freshState(), "A", T0, "grab", "reports").code, 1);
  assert.equal(cli(freshState(), "A", T0, "claim").code, 1);
});

test("a corrupt state file is RESET with a loud note and the claim proceeds", () => {
  const state = freshState();
  writeFileSync(state, "{not json");
  const { code, lines } = cli(state, "agent-A", T0, "claim", "reports");
  assert.equal(code, 0);
  assert.ok(lines.some((l) => l.startsWith("NOTE") && l.includes("corrupt")), lines.join(" | "));
  assert.equal(JSON.parse(readFileSync(state, "utf8")).leases.reports.holder, "agent-A");
  assert.ok(isStale({ claimed_at_ms: T0, ttl_min: 30 }, T0 + 30 * MIN));
});

test("loadState tolerates a missing file (fresh machine) without creating it", () => {
  const state = freshState();
  assert.deepEqual(loadState(state), { leases: {} });
  assert.ok(!existsSync(state));
});

// ── duplicate-report guard in report-store-lint (GPTW-04/36/42) ──────────────
// REPORT-ONLY contract: loud lines fire, violations NEVER change. A legacy
// filler body keeps synthetic fixtures over the truncation floor.

const FILLER = "# Legacy twin\n\n" + "Historical prose line for byte padding, no frontmatter here.\n".repeat(6);

test("report-store-lint control probes still pass with the guard wired in", () => {
  assert.deepEqual(runControlProbes(), []);
});

test("canonicalStem: copy/numeric suffixes strip, glued digits and bare dates survive", () => {
  assert.equal(canonicalStem("2026-07-20-chase-2.md"), "2026-07-20-chase");
  assert.equal(canonicalStem("2026-07-20-chase (copy).md"), "2026-07-20-chase");
  assert.equal(canonicalStem("2026-07-20-chase copy 2.md"), "2026-07-20-chase");
  // separator-anchored: digits glued to a word are content, not a copy suffix
  assert.equal(canonicalStem("2026-07-20-gptw-step1.md"), "2026-07-20-gptw-step1");
  // the date prefix is never stripped into a collision
  assert.notEqual(canonicalStem("2026-07-20.md"), canonicalStem("2026-07-21.md"));
});

test("near-dup basenames for the same date fire a LOUD line naming both files", () => {
  const loud = duplicateReportSignals([
    { file: "docs/reports/2026-07-20-chase.md", text: FILLER },
    { file: "docs/reports/2026-07-20-chase-2.md", text: FILLER },
  ]);
  const hit = loud.find((l) => l.startsWith("NEAR-DUP-BASENAME"));
  assert.ok(hit, loud.join(" | "));
  assert.ok(hit.includes("2026-07-20-chase.md") && hit.includes("2026-07-20-chase-2.md"));
  assert.ok(hit.includes("REPORT-ONLY"), "the line itself declares the altitude");
});

test("distinct topics on the same date do NOT fire (clean fixture stays quiet)", () => {
  const loud = duplicateReportSignals([
    { file: "docs/reports/2026-07-20-chase.md", text: FILLER },
    { file: "docs/reports/2026-07-20-handover.md", text: FILLER },
    { file: "docs/reports/2026-07-20-gptw-step1.md", text: FILLER },
    { file: "docs/reports/2026-07-20-gptw-step2.md", text: FILLER },
  ]);
  assert.deepEqual(loud.filter((l) => l.startsWith("NEAR-DUP-BASENAME")), []);
});

test("a sub-200-byte report fires TRUNCATION-SUSPECT; a whole report does not", () => {
  const loud = duplicateReportSignals([
    { file: "docs/reports/2026-07-20-dead.md", text: "# Report\n\ntruncat" },
    { file: "docs/reports/2026-07-20-whole.md", text: FILLER },
  ]);
  const hit = loud.find((l) => l.startsWith("TRUNCATION-SUSPECT"));
  assert.ok(hit, loud.join(" | "));
  assert.ok(hit.includes("2026-07-20-dead.md") && hit.includes(`${TRUNCATION_BYTES}`));
  assert.ok(!loud.some((l) => l.includes("2026-07-20-whole.md")));
});

test("REPORT-ONLY proof: both signals firing together still yield ZERO violations", () => {
  const { violations, loud } = lintReportStore([
    { file: "docs/reports/2026-07-20-chase.md", text: FILLER },
    { file: "docs/reports/2026-07-20-chase-2.md", text: "# dead" }, // dup name AND truncated
  ], new Map());
  assert.ok(loud.some((l) => l.startsWith("NEAR-DUP-BASENAME")));
  assert.ok(loud.some((l) => l.startsWith("TRUNCATION-SUSPECT")));
  assert.deepEqual(violations, [], "the guard must NEVER touch violations before the FP-baseline re-ruling");
});

test("a clean store stays loud-free AND violation-free (both directions, same run)", () => {
  const { violations, loud } = lintReportStore([
    { file: "docs/reports/2026-07-20-topic.md", text: PROBE_NEW_GOOD },
  ], new Map());
  assert.deepEqual(violations, []);
  assert.deepEqual(loud.filter((l) => l.startsWith("NEAR-DUP-BASENAME") || l.startsWith("TRUNCATION-SUSPECT")), []);
});

test("signal (a) untouched: duplicate report_id remains a hard VIOLATION (never weakened)", () => {
  const twin = PROBE_NEW_GOOD; // same report_id in both files
  const { violations } = lintReportStore([
    { file: "docs/reports/2026-07-20-a.md", text: twin },
    { file: "docs/reports/2026-07-21-b.md", text: twin },
  ], new Map());
  assert.ok(violations.some((v) => v.includes("already used by")), violations.join(" | "));
});
