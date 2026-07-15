#!/usr/bin/env bash
# brief-snapshot.sh — the MACHINE-VERIFIABLE state block for any morning/session
# brief. A morning brief is a GENERATED VIEW, not a source of truth; this script
# produces its factual base so a brief can never claim a stale "machine idle /
# nothing merged after X" as final. Run it FIRST, against origin/main, every time.
# Interpretive context (unsent drafts, decisions) is appended by the human/agent
# ON TOP of this fresh base — never in place of it.
set -euo pipefail
cd "$(git rev-parse --show-toplevel)"
git fetch origin --quiet 2>/dev/null || true

HASH=$(git rev-parse --short origin/main)
NOW=$(TZ=Asia/Kolkata date '+%Y-%m-%d %H:%M:%S IST')
echo "## State snapshot — as of origin/main @ ${HASH} · generated ${NOW}"
echo "_A brief is a view of this commit. Work after ${HASH} is NOT reflected — re-run to refresh._"
echo

echo "### Merged since the last brief"
LAST=$(git log origin/main -i -E --grep="morning brief|MORNING_BRIEF|overnight wrap" -n 2 --format="%H" | tail -1)
if [ -n "${LAST:-}" ]; then
  git log origin/main --oneline "${LAST}..origin/main" | sed 's/^/- /' | head -30
  [ -z "$(git log origin/main --oneline "${LAST}..origin/main")" ] && echo "- (nothing merged since the last brief commit ${LAST:0:7})"
else
  git log origin/main --oneline -8 | sed 's/^/- /'
fi
echo

echo "### Sites in the factory"
for d in sites/*/; do [ -f "${d}site.config.json" ] && echo "- ${d%/} ($(grep -o '"register"[^,]*' "${d}site.config.json" | tr -d '" '))"; done
echo

echo "### Live flags in the durable logs (grep, most-recent first)"
for kw in HACKED URGENT "BLOCKED" "PAUSED" "SECURITY"; do
  N=$(grep -ric "$kw" QUESTIONS.md DECISIONS.md 2>/dev/null | awk -F: '{s+=$2} END{print s+0}')
  echo "- ${kw}: ${N} mention(s)"
done
echo

echo "### Open-question headers (newest 8 in QUESTIONS.md)"
grep -nE "^## " QUESTIONS.md 2>/dev/null | tail -8 | sed 's/^/- /'
echo

echo "### Open PRs + branch-protection state"
gh pr list --state open --json number,title --jq '.[] | "- #\(.number) \(.title[0:70])"' 2>/dev/null | head -12 || echo "- (gh unavailable)"
