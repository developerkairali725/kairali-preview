#!/usr/bin/env bash
# PostToolUse on Edit|Write|MultiEdit: compliance-lint the touched site, <10s.
# Non-zero exit 2 feeds findings straight back to the agent.

INPUT=$(cat)
FILE=$(printf '%s' "$INPUT" | python3 -c "import json,sys; print(json.load(sys.stdin).get('tool_input',{}).get('file_path',''))" 2>/dev/null)
[ -z "$FILE" ] && exit 0

ROOT="${CLAUDE_PROJECT_DIR:-$(git rev-parse --show-toplevel 2>/dev/null)}"
[ -z "$ROOT" ] && exit 0
case "$FILE" in
  "$ROOT"/sites/*/*)
    SITE_DIR=$(printf '%s' "$FILE" | sed -E "s|($ROOT/sites/[^/]+)/.*|\1|")
    OUT=$(node "$ROOT/packages/compliance/bin/lint.js" "$SITE_DIR" 2>&1) || { echo "$OUT" >&2; exit 2; }
    ;;
esac
exit 0
