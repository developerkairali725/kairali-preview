// drift-killers.test.js — tests for the session-2C state layer: directive
// capture (no chat instruction silently dropped), the doctor's reconcile
// heuristics (contradictions found AND wolf not cried), the boot contract's
// pure pieces, and the lighthouse gate's judge. House rule: every detector is
// tested in BOTH directions in the same run (matrix-walk.test.js preamble).
//
// house style: plain ESM + node --test.
import { test } from "node:test";
import assert from "node:assert/strict";

import { addDirective, ackDirective, nextId, parseDirectives, HEADER } from "../directive-capture.mjs";
import { findDeadRequiredChecks, findMissingRequiredChecks, findPrContradictions } from "../doctor.mjs";
import { BUDGETS, judge, median, urlsFor, PERF_RUNS_ON_MISS } from "../lighthouse-gate.mjs";

const NOW = "2026-07-17 15:00:00 IST";

// ── directive-capture ────────────────────────────────────────────────────────

test("add → list → ack round-trips; ids are per-day sequential; ack is flip-only", () => {
  let text = HEADER;
  ({ text } = addDirective(text, { directive: "first", source: "chat (Abilash)", now: NOW }));
  const second = addDirective(text, { directive: "second", now: NOW });
  text = second.text;
  assert.equal(second.id, "D-20260717-02");
  assert.equal(nextId(text, NOW), "D-20260717-03");

  const parsed = parseDirectives(text);
  assert.equal(parsed.length, 2);
  assert.deepEqual(parsed.map((d) => d.acked), [false, false]);
  assert.equal(parsed[0].source, "chat (Abilash)");

  const acked = ackDirective(text, "D-20260717-01", { note: "landed in PR #93", now: NOW });
  assert.equal(acked.result, "acked");
  const after = parseDirectives(acked.text);
  assert.equal(after[0].acked, true);
  assert.match(acked.text, /acked 2026-07-17 15:00:00 IST: landed in PR #93/);
  assert.equal(after[1].acked, false, "ack must touch exactly one entry");

  // flip-only law: a second ack refuses, an unknown id refuses
  assert.equal(ackDirective(acked.text, "D-20260717-01", { now: NOW }).result, "already");
  assert.equal(ackDirective(acked.text, "D-99999999-99", { now: NOW }).result, "unknown");
});

test("a multi-line or empty directive is rejected — one entry per instruction", () => {
  assert.throws(() => addDirective(HEADER, { directive: "a\nb", now: NOW }));
  assert.throws(() => addDirective(HEADER, { directive: "  ", now: NOW }));
});

// ── doctor ───────────────────────────────────────────────────────────────────

test("doctor FLAGS the 16-Jul class: unchecked item asserting an in-flight PR that GitHub merged", () => {
  const backlog = `- [ ] ship the thing — PR #65 blocked, awaiting review\n`;
  const hits = findPrContradictions(backlog, new Map([[65, "MERGED"]]));
  assert.equal(hits.length, 1);
  assert.equal(hits[0].pr, 65);
  assert.equal(hits[0].state, "MERGED");
});

test("doctor does NOT cry wolf (the 7 false positives of the naive first run)", () => {
  const prStates = new Map([[87, "MERGED"], [81, "MERGED"], [1, "MERGED"], [65, "MERGED"]]);
  const healthy = [
    "- [ ] Non-revenue build queue UNBLOCKED on data: the canonical roster is RULED (KAC figures canonical, PR #87)", // historic citation
    "- [ ] healing.recipes launch end of July (merged via PR #81; launch is the remaining step)", // closure word in window
    "- [ ] Lighthouse CI vs Vercel preview in gate.yml (A5 TODO — needs preview-URL wiring) [gap #1]", // not a PR reference
    "- [x] ship the thing — PR #65 blocked, awaiting review", // checked item = history
    "PR #65 blocked, awaiting review", // not a checklist item at all
  ].join("\n");
  assert.deepEqual(findPrContradictions(healthy, prStates), []);
});

test("doctor leaves genuinely-open PRs alone (an OPEN assertion about an OPEN PR is the truth)", () => {
  const hits = findPrContradictions("- [ ] PR #70 awaiting review\n", new Map([[70, "OPEN"]]));
  assert.deepEqual(hits, []);
});

test("required-checks reconcile: dead contexts flagged, missing contexts listed, clean set clean", () => {
  const sites = ["sites/a.com", "sites/b.com"];
  const dead = findDeadRequiredChecks(["gate", "factory-spec (sites/gone.com)", "factory-spec (sites/a.com)"], sites);
  assert.deepEqual(dead, ["factory-spec (sites/gone.com)"]);

  const missing = findMissingRequiredChecks(["gate", "factory-spec (sites/a.com)", "lighthouse (sites/a.com)"], sites);
  assert.deepEqual(missing, ["factory-spec (sites/b.com)", "lighthouse (sites/b.com)"]);

  const full = ["factory-spec (sites/a.com)", "lighthouse (sites/a.com)", "factory-spec (sites/b.com)", "lighthouse (sites/b.com)"];
  assert.deepEqual(findDeadRequiredChecks(full, sites), []);
  assert.deepEqual(findMissingRequiredChecks(full, sites), []);
});

// ── lighthouse-gate ──────────────────────────────────────────────────────────

test("judge enforces the A5 budgets in both directions (incl. SEO strictly 100)", () => {
  assert.deepEqual(judge({ performance: 90, accessibility: 95, seo: 100 }), []);
  assert.deepEqual(judge({ performance: 98, accessibility: 100, seo: 100 }), []);
  assert.equal(judge({ performance: 89, accessibility: 95, seo: 100 }).length, 1);
  assert.equal(judge({ performance: 90, accessibility: 94, seo: 100 }).length, 1);
  assert.equal(judge({ performance: 90, accessibility: 95, seo: 99 }).length, 1);
  assert.equal(judge({ performance: 76, accessibility: 92, seo: 99 }).length, 3);
  // the budgets themselves are the checklist's numbers — a drive-by "adjustment" fails here
  assert.deepEqual(BUDGETS, { performance: 90, accessibility: 95, seo: 100 });
});

test("median is a median, not a best-of (gaming our own gate is the failure mode)", () => {
  assert.equal(median([83, 91, 84]), 84);
  assert.equal(median([90, 70]), 80);
  assert.equal(median([88]), 88);
});

test("urlsFor defaults to home-only WITH the defaulted flag set (loud partial coverage)", () => {
  const { urls, defaulted } = urlsFor("sites/no-such-site-fixture");
  assert.deepEqual(urls, ["/"]);
  assert.equal(defaulted, true);
});

// ── Q-A5-FLAKE (Abilash's ruling, 17 Jul 2026): median-of-5 ──────────────────
// The gate was failing ~50% of the time on code that cannot affect performance.
// Two real kairaliyoga runs, each later GREEN on a re-run of the identical SHA:
//   64/91/89 -> median 89 (fail)   ·   71/92/89 -> median 89 (fail)
// One outlier below two healthy samples decides a median-of-3. It cannot decide
// a median-of-5. Budget stays 90; the gate stays required; only noise is removed.

test("perf sampling is 5 — one runner-noise outlier must not decide the gate (Q-A5-FLAKE)", () => {
  assert.equal(PERF_RUNS_ON_MISS, 5,
    "Q-A5-FLAKE ruled median-of-5. Lowering this back to 3 re-arms a ~50% flake on correct code; raising the pass rate by lowering BUDGETS instead is forbidden (CLAUDE.md rule g).");
});

test("the real flake samples now pass, and the budget still is not lowered", () => {
  assert.equal(BUDGETS.performance, 90, "budget stays 90 — the ruling removed noise, not the bar");
  // The two observed outliers, plus healthy samples the same runs produced.
  assert.equal(median([64, 91, 89]), 89, "median-of-3 on the real run: the outlier decided, and it failed");
  assert.equal(median([64, 89, 91, 92, 94]), 91, "median-of-5 on the same page: the outlier is outvoted");
  assert.ok(judge({ performance: median([64, 89, 91, 92, 94]), accessibility: 100, seo: 100 }).length === 0);
});

test("a genuinely slow page still FAILS median-of-5 — this removes noise, not the gate", () => {
  // Every sample honestly below budget: no amount of sampling may rescue it.
  const v = judge({ performance: median([80, 81, 82, 83, 84]), accessibility: 100, seo: 100 });
  assert.equal(v.length, 1, "a real regression must still fail");
  assert.match(v[0], /performance 82 < 90/);
});
