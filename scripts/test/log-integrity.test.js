/**
 * log-integrity.test.js — catch what merge=union cannot.
 *
 * WHY THIS EXISTS (a bug I shipped, 17 Jul 2026):
 *
 * PR #95 gave wiki/log.md `merge=union` so concurrent sessions stop conflicting
 * on the tail. The .gitattributes comment states the trade honestly: union keeps
 * BOTH versions of an EDITED line, because it cannot tell a rewrite from an
 * append — "safe here only because this file is contractually never edited".
 *
 * Then, in that same PR, I edited a log entry twice (correcting a test count),
 * rebased, and **a rebase replays every commit as a three-way merge**. Union did
 * exactly what it says on the tin: it kept the stale draft AND the correction.
 * Both shipped to main. Nothing caught it — the PR's own checks passed, because
 * a duplicated append is not a conflict, not a lint error, and not a test
 * failure. It is just quietly wrong.
 *
 * The lesson is narrow and worth keeping: "the file is never edited" is a claim
 * about human behaviour, and rebases make a liar of it. If a mechanism's safety
 * rests on a convention, something must enforce the convention.
 *
 * So: this asserts the log's entries are unique. It is the specific detector for
 * union's one failure mode, and it costs nothing.
 */
import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { join, resolve } from "node:path";

const LOG = join(resolve(import.meta.dirname, "..", ".."), "wiki", "log.md");
const body = readFileSync(LOG, "utf8");

/** Entry lines look like: `- 2026-07-17 16:41:07 IST — <session>: <rollup>` */
const ENTRY_RE = /^- (\d{4}-\d{2}-\d{2}(?: \d{2}:\d{2}:\d{2} IST)?)\s+[—·-]\s*(.*)$/;

const entries = body
  .split(/\r?\n/)
  .map((line) => line.match(ENTRY_RE))
  .filter(Boolean)
  .map((m) => ({ stamp: m[1], rest: m[2] }));

test("the log-entry scan finds entries (guard against a dead test)", () => {
  assert.ok(entries.length >= 20, `expected the real log spine, parsed ${entries.length} entries — a test that scans nothing is not a gate`);
});

test("no two log entries share a timestamp — union's duplication signature", () => {
  const seen = new Map();
  for (const { stamp, rest } of entries) {
    if (seen.has(stamp)) {
      assert.fail(
        `wiki/log.md has TWO entries stamped "${stamp}".\n` +
        `  A: ${seen.get(stamp).slice(0, 90)}…\n` +
        `  B: ${rest.slice(0, 90)}…\n` +
        `This is merge=union's one failure mode: it cannot tell an EDIT from an APPEND, so a ` +
        `rewritten entry survives twice — once stale, once corrected. It happened for real on ` +
        `17 Jul 2026 (PR #95, fixed in #97). Delete the stale copy. If two sessions genuinely ` +
        `logged in the same second, bump one by a second — the spine is second-precision by rule.`,
      );
    }
    seen.set(stamp, rest);
  }
});

test("no log entry is byte-identical to another", () => {
  const seen = new Set();
  for (const { stamp, rest } of entries) {
    const key = `${stamp}||${rest}`;
    assert.ok(!seen.has(key), `wiki/log.md contains a byte-identical duplicate entry at "${stamp}" — union kept both sides of an edit, or an append landed twice`);
    seen.add(key);
  }
});

test("no conflict markers survive in the log", () => {
  // union auto-resolves, so a marker here means a hand-resolution went wrong.
  for (const marker of ["<<<<<<<", ">>>>>>>"]) {
    assert.ok(!body.includes(marker), `wiki/log.md contains a "${marker}" conflict marker`);
  }
});
