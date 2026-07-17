/**
 * log-merge.test.js — pins the wiki/log.md merge contract.
 *
 * [D-RAMP-STEPS item zero · Abilash, 17 Jul 2026]
 *
 * wiki/log.md is the append-only committed spine and the crash-recovery map.
 * Concurrent sessions append to its tail; before .gitattributes, every such
 * pair produced an append-append conflict resolved by hand, identically, every
 * time (a04edde). Two conflicts on 17 Jul alone.
 *
 * These tests build REAL throwaway git repos and run REAL merges — the claim
 * "union fixes it" is worthless unless git itself demonstrates it. The control
 * test (no .gitattributes → conflict) is what proves the union test isn't
 * passing for some unrelated reason.
 */
import { test } from "node:test";
import assert from "node:assert/strict";
import { execFileSync } from "node:child_process";
import { mkdtempSync, writeFileSync, readFileSync, appendFileSync, rmSync, copyFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join, resolve } from "node:path";

const REPO_ROOT = resolve(import.meta.dirname, "..", "..");
const REAL_GITATTRIBUTES = join(REPO_ROOT, ".gitattributes");

const git = (cwd, ...args) =>
  execFileSync("git", args, { cwd, encoding: "utf8", stdio: ["ignore", "pipe", "pipe"] });

/** Build a throwaway repo whose wiki/log.md mimics the real spine's shape. */
function scaffold({ withAttributes }) {
  const dir = mkdtempSync(join(tmpdir(), "logmerge-"));
  git(dir, "init", "-q", "-b", "main");
  git(dir, "config", "user.email", "test@example.com");
  git(dir, "config", "user.name", "test");
  execFileSync("mkdir", ["-p", join(dir, "wiki")]);

  writeFileSync(join(dir, "wiki", "log.md"), "# Log — append only\n\n- 2026-07-17 10:00:00 IST — base entry\n");
  if (withAttributes) {
    // Copy the REAL file — so this test breaks if someone drops the union line.
    copyFileSync(REAL_GITATTRIBUTES, join(dir, ".gitattributes"));
  }
  git(dir, "add", "-A");
  git(dir, "commit", "-qm", "base");

  // Two sessions branch from the same point and each append one entry.
  git(dir, "checkout", "-q", "-b", "session-a");
  appendFileSync(join(dir, "wiki", "log.md"), "\n- 2026-07-17 15:00:00 IST — SESSION A rollup\n");
  git(dir, "commit", "-qam", "session A logs");

  git(dir, "checkout", "-q", "main");
  git(dir, "checkout", "-q", "-b", "session-b");
  appendFileSync(join(dir, "wiki", "log.md"), "\n- 2026-07-17 15:30:00 IST — SESSION B rollup\n");
  git(dir, "commit", "-qam", "session B logs");

  return dir;
}

/** Attempt session-a <- session-b. Returns {conflicted, body}. */
function mergeSessions(dir) {
  git(dir, "checkout", "-q", "session-a");
  try {
    git(dir, "merge", "--no-edit", "session-b");
  } catch {
    return { conflicted: true, body: readFileSync(join(dir, "wiki", "log.md"), "utf8") };
  }
  return { conflicted: false, body: readFileSync(join(dir, "wiki", "log.md"), "utf8") };
}

test("CONTROL: without .gitattributes, two sessions appending to log.md CONFLICT", () => {
  const dir = scaffold({ withAttributes: false });
  try {
    const { conflicted, body } = mergeSessions(dir);
    assert.equal(conflicted, true, "expected the historical append-append conflict — if this passes cleanly, the control is broken and the union test below proves nothing");
    assert.match(body, /<<<<<<</, "expected conflict markers in the log body");
  } finally {
    rmSync(dir, { recursive: true, force: true });
  }
});

test("with the real .gitattributes, the same merge auto-resolves and KEEPS BOTH entries", () => {
  const dir = scaffold({ withAttributes: true });
  try {
    const { conflicted, body } = mergeSessions(dir);
    assert.equal(conflicted, false, "union driver should have auto-resolved the append-append merge");
    assert.doesNotMatch(body, /<<<<<<</, "no conflict markers may survive");
    assert.match(body, /SESSION A rollup/, "session A's entry must survive");
    assert.match(body, /SESSION B rollup/, "session B's entry must survive — losing a log entry is the failure this prevents");
    assert.match(body, /base entry/, "the pre-existing history must survive");
  } finally {
    rmSync(dir, { recursive: true, force: true });
  }
});

test("the repo's real .gitattributes actually assigns union to wiki/log.md", () => {
  const out = execFileSync("git", ["check-attr", "merge", "--", "wiki/log.md"], {
    cwd: REPO_ROOT,
    encoding: "utf8",
  });
  assert.match(out, /merge:\s*union/, "wiki/log.md must resolve to merge=union in the real repo — this is the line that was directed twice and dropped twice");
});

test("union is NOT applied to files that are edited in place, only appended-to", () => {
  // DIRECTIVES.md takes `[ ]`->`[x]` ack flips; DECISIONS/QUESTIONS are amended.
  // Union would silently keep BOTH sides of such an edit. Guard the boundary.
  for (const f of ["DIRECTIVES.md", "DECISIONS.md", "QUESTIONS.md", "LEARNINGS.md"]) {
    const out = execFileSync("git", ["check-attr", "merge", "--", f], {
      cwd: REPO_ROOT,
      encoding: "utf8",
    });
    assert.doesNotMatch(out, /merge:\s*union/, `${f} is edited in place (ack flips / amendments) — union would silently duplicate those edits. It must NOT be union.`);
  }
});
