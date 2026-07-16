// post-edit hook — the deterministic audit-log contract (CLAUDE.md rule (q)).
//
// Rule (q) says "every change lands in agent-log.jsonl". The mechanism as first
// written — "the logger sub-agent is invoked by the PostToolUse hook" — is
// impossible: a shell hook cannot call a Claude sub-agent. So the hook writes
// the log line itself. These tests pin that contract so it cannot silently
// regress into a comment (the failure mode the whole test-discovery fix exists
// to prevent).
//
// house style: plain ESM + node --test.
import { test } from "node:test";
import assert from "node:assert/strict";
import { execFileSync } from "node:child_process";
import { mkdtempSync, readFileSync, existsSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const HOOK = resolve(__dirname, "..", "hooks", "post-edit.sh");

// Run the hook with a simulated PostToolUse payload against an isolated ROOT,
// so the real repo's agent-log.jsonl is never touched. A non-site file path is
// used so the compliance-lint branch never fires (that path is covered by the
// compliance package's own tests) and we isolate the new audit-log behaviour.
function runHook({ toolName, fileRel }) {
  const root = mkdtempSync(join(tmpdir(), "postedithook-"));
  const payload = JSON.stringify({
    tool_name: toolName,
    tool_input: { file_path: join(root, fileRel) },
  });
  let exitCode = 0;
  try {
    execFileSync("bash", [HOOK], {
      input: payload,
      env: { ...process.env, CLAUDE_PROJECT_DIR: root },
    });
  } catch (e) {
    exitCode = e.status ?? 1;
  }
  const logPath = join(root, "agent-log.jsonl");
  const lines = existsSync(logPath)
    ? readFileSync(logPath, "utf8").trim().split("\n").filter(Boolean)
    : [];
  rmSync(root, { recursive: true, force: true });
  return { exitCode, lines };
}

test("appends one valid-JSON audit line per edit, with the documented shape", () => {
  const { exitCode, lines } = runHook({ toolName: "Write", fileRel: "docs/x.md" });
  assert.equal(exitCode, 0, "a non-site edit must not block (exit 0)");
  assert.equal(lines.length, 1, "exactly one line appended");
  const entry = JSON.parse(lines[0]);
  assert.match(entry.timestamp, /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}Z$/);
  assert.equal(entry.actor, "claude-code");
  assert.equal(entry.action, "Write");
  assert.deepEqual(entry.files_touched, ["docs/x.md"], "path is stored repo-relative");
  assert.equal(entry.status, "success");
});

test("path is stored relative to the repo root, never absolute", () => {
  const { lines } = runHook({ toolName: "Edit", fileRel: "sites/kairali.com/a.mdx" });
  const entry = JSON.parse(lines[0]);
  assert.equal(entry.files_touched[0], "sites/kairali.com/a.mdx");
  assert.ok(!entry.files_touched[0].startsWith("/"), "must not leak an absolute path");
});

test("a missing file_path is a no-op, not a crash", () => {
  const root = mkdtempSync(join(tmpdir(), "postedithook-"));
  let exitCode = 0;
  try {
    execFileSync("bash", [HOOK], {
      input: JSON.stringify({ tool_name: "Write", tool_input: {} }),
      env: { ...process.env, CLAUDE_PROJECT_DIR: root },
    });
  } catch (e) {
    exitCode = e.status ?? 1;
  }
  assert.equal(exitCode, 0, "empty file_path exits 0 cleanly");
  assert.ok(!existsSync(join(root, "agent-log.jsonl")), "nothing logged for a no-op");
  rmSync(root, { recursive: true, force: true });
});
