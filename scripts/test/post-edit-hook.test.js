// post-edit hook — the deterministic audit-log contract (CLAUDE.md rule (q)).
//
// Rule (q) says "every change lands in agent-log.jsonl". The mechanism as first
// written — "the logger sub-agent is invoked by the PostToolUse hook" — is
// impossible: a shell hook cannot call a Claude sub-agent. So the hook writes
// the log line itself. These tests pin that contract so it cannot silently
// regress into a comment (the failure mode the whole test-discovery fix exists
// to prevent).
//
// 20 Jul 2026 (RPT-20260720-SILENT): the hook now derives ROOT from ITS OWN
// location — never from CLAUDE_PROJECT_DIR or cwd, which pointed at the wrong
// root (or nowhere) in every live session. The harness therefore COPIES the
// script into a tmp repo tree so the self-locating derivation is what's
// tested, and deliberately passes a DECOY CLAUDE_PROJECT_DIR to prove the
// hook ignores it.
//
// house style: plain ESM + node --test.
import { test } from "node:test";
import assert from "node:assert/strict";
import { execFileSync } from "node:child_process";
import { copyFileSync, mkdirSync, mkdtempSync, readFileSync, existsSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const REAL_HOOK = resolve(__dirname, "..", "hooks", "post-edit.sh");

// Build an isolated tmp "repo" with the hook at its canonical path, so the
// real repo's agent-log.jsonl is never touched. A non-site file path is used
// so the compliance-lint branch never fires (covered by the compliance
// package's own tests) and we isolate the audit-log behaviour.
function makeTmpRepo() {
  const root = mkdtempSync(join(tmpdir(), "postedithook-"));
  mkdirSync(join(root, "scripts", "hooks"), { recursive: true });
  copyFileSync(REAL_HOOK, join(root, "scripts", "hooks", "post-edit.sh"));
  return root;
}

function runHook({ toolName, filePath, root }) {
  const hook = join(root, "scripts", "hooks", "post-edit.sh");
  const payload = JSON.stringify({
    tool_name: toolName,
    tool_input: { file_path: filePath },
  });
  let exitCode = 0;
  try {
    execFileSync("bash", [hook], {
      input: payload,
      // DECOY: the hook must ignore this entirely (the audit's root cause)
      env: { ...process.env, CLAUDE_PROJECT_DIR: mkdtempSync(join(tmpdir(), "decoy-")) },
    });
  } catch (e) {
    exitCode = e.status ?? 1;
  }
  const logPath = join(root, "agent-log.jsonl");
  const lines = existsSync(logPath)
    ? readFileSync(logPath, "utf8").trim().split("\n").filter(Boolean)
    : [];
  return { exitCode, lines };
}

test("appends one valid-JSON audit line per edit, with the documented shape", () => {
  const root = makeTmpRepo();
  const { exitCode, lines } = runHook({ toolName: "Write", filePath: join(root, "docs/x.md"), root });
  assert.equal(exitCode, 0, "a non-site edit must not block (exit 0)");
  assert.equal(lines.length, 1, "exactly one line appended");
  const entry = JSON.parse(lines[0]);
  assert.match(entry.timestamp, /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}Z$/);
  assert.equal(entry.actor, "claude-code");
  assert.equal(entry.action, "Write");
  assert.deepEqual(entry.files_touched, ["docs/x.md"], "path is stored repo-relative");
  assert.equal(entry.status, "success");
  rmSync(root, { recursive: true, force: true });
});

test("path is stored relative to the repo root, never absolute", () => {
  const root = makeTmpRepo();
  const { lines } = runHook({ toolName: "Edit", filePath: join(root, "sites/kairali.com/a.mdx"), root });
  const entry = JSON.parse(lines[0]);
  assert.equal(entry.files_touched[0], "sites/kairali.com/a.mdx");
  assert.ok(!entry.files_touched[0].startsWith("/"), "must not leak an absolute path");
  rmSync(root, { recursive: true, force: true });
});

test("edits OUTSIDE the hook's repo are skipped — root comes from the script, not the env decoy", () => {
  const root = makeTmpRepo();
  const foreign = mkdtempSync(join(tmpdir(), "foreignrepo-"));
  const { exitCode, lines } = runHook({ toolName: "Write", filePath: join(foreign, "note.md"), root });
  assert.equal(exitCode, 0, "foreign-file edit is a clean no-op");
  assert.equal(lines.length, 0, "nothing logged for a file outside the repo");
  rmSync(root, { recursive: true, force: true });
  rmSync(foreign, { recursive: true, force: true });
});

test("a missing file_path is a no-op, not a crash", () => {
  const root = makeTmpRepo();
  let exitCode = 0;
  try {
    execFileSync("bash", [join(root, "scripts", "hooks", "post-edit.sh")], {
      input: JSON.stringify({ tool_name: "Write", tool_input: {} }),
      env: { ...process.env },
    });
  } catch (e) {
    exitCode = e.status ?? 1;
  }
  assert.equal(exitCode, 0, "empty file_path exits 0 cleanly");
  assert.ok(!existsSync(join(root, "agent-log.jsonl")), "nothing logged for a no-op");
  rmSync(root, { recursive: true, force: true });
});
