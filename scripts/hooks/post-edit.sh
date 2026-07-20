#!/usr/bin/env bash
# PostToolUse on Edit|Write|MultiEdit. Two jobs, in order:
#   1. Deterministic audit log — append one JSON line to agent-log.jsonl for
#      EVERY edit (this is rule (q) made real: a shell hook cannot "invoke the
#      logger sub-agent", but it CAN write the log line itself). Best-effort;
#      a logging failure must never block the edit.
#   2. Compliance-lint the touched site, <10s. Non-zero exit 2 feeds findings
#      straight back to the agent. Kept LAST so its exit code is the hook's.
# Never weaken this file to make something pass (CLAUDE.md rule g).

INPUT=$(cat)

# ROOT is derived from THIS SCRIPT'S location, never from CLAUDE_PROJECT_DIR or
# the session cwd: the 20 Jul silent-failure audit proved every live session
# launches from ~/Claude (parent dir), so cwd/project-dir derivations pointed
# the log and lint at the WRONG root — or the hook never fired at all.
ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"
[ -z "$ROOT" ] && exit 0

FILE=$(printf '%s' "$INPUT" | python3 -c "import json,sys; print(json.load(sys.stdin).get('tool_input',{}).get('file_path',''))" 2>/dev/null)
TOOL=$(printf '%s' "$INPUT" | python3 -c "import json,sys; print(json.load(sys.stdin).get('tool_name',''))" 2>/dev/null)
[ -z "$FILE" ] && exit 0

# Repo-scope guard: this hook is registered at the ~/Claude launch level so it
# actually fires; edits OUTSIDE this repo are not its business.
case "$FILE" in
  "$ROOT"/*) ;;
  *) exit 0 ;;
esac

# ---- 1. audit log (best-effort; never blocks work) -------------------------
# Path stored relative to the repo root so the log stays portable and diffable.
REL="${FILE#$ROOT/}"
python3 - "$ROOT/agent-log.jsonl" "$TOOL" "$REL" <<'PY' 2>/dev/null || true
import json, sys, datetime
logpath, tool, rel = sys.argv[1], sys.argv[2], sys.argv[3]
entry = {
    "timestamp": datetime.datetime.now(datetime.timezone.utc)
        .strftime("%Y-%m-%dT%H:%M:%SZ"),
    "actor": "claude-code",
    "action": tool or "edit",
    "files_touched": [rel] if rel else [],
    "rationale": "PostToolUse hook auto-log",
    "status": "success",
}
with open(logpath, "a", encoding="utf-8") as f:
    f.write(json.dumps(entry, ensure_ascii=False) + "\n")
PY

# ---- 2. compliance lint (authoritative; its exit code is the hook's) -------
case "$FILE" in
  "$ROOT"/sites/*/*)
    SITE_DIR=$(printf '%s' "$FILE" | sed -E "s|($ROOT/sites/[^/]+)/.*|\1|")
    OUT=$(node "$ROOT/packages/compliance/bin/lint.js" "$SITE_DIR" 2>&1) || { echo "$OUT" >&2; exit 2; }
    ;;
esac
exit 0
