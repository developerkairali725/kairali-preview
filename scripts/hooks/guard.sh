#!/usr/bin/env bash
# PreToolUse guard on Bash — CLAUDE.md hard gates, mechanically enforced.
# Exit 2 blocks the command and feeds stderr back to the agent.
# Never weaken this file to make something pass (CLAUDE.md rule g).

INPUT=$(cat)
CMD=$(printf '%s' "$INPUT" | python3 -c "import json,sys; print(json.load(sys.stdin).get('tool_input',{}).get('command',''))" 2>/dev/null)
[ -z "$CMD" ] && exit 0

block() { echo "BLOCKED by guard.sh: $1" >&2; exit 2; }

case "$CMD" in
  *"git push --force"*|*"git push -f "*|*"git push -f"$'\n'*) block "force push — use --force-with-lease only (CLAUDE.md gate 5)";;
esac
case "$CMD" in
  *"rm -rf /"*|*"rm -rf ~"*|*"rm -rf \$HOME"*) block "rm -rf outside the repo";;
esac
case "$CMD" in
  *"curl "*"| bash"*|*"curl "*"|bash"*|*"wget "*"| sh"*) block "piping downloads to a shell — review scripts before running";;
esac
# Production WordPress / DNS surfaces — HUMAN actions only (CLAUDE.md gates 1,3)
case "$CMD" in
  *"wp-admin"*|*"wp-config"*|*"/xmlrpc.php"*) block "production WordPress surface — Lane B via Deepu/Abilash only";;
esac
case "$CMD" in
  *"api.cloudflare.com/client"*"dns_records"*) block "DNS change — FOREVER-HUMAN action (Abilash/Ambuj flip)";;
esac

# Pre-push gate: build + tests + compliance must pass before any push
case "$CMD" in
  *"git push"*)
    bash "$(dirname "$0")/pre-push.sh" || block "pre-push gate failed — fix the cause, never the gate";;
esac

exit 0
