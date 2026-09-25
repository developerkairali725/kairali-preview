#!/bin/sh
# Foreground coordinator step: wait up to 570 s for new checkpoints, then harvest + status.
W="/Volumes/Extreme SSD - Blue 2nd/Claude Workspaces/10x WordPress and Websites/deliverables/WOPS-AHV-FINAL-DRAFT-20260924-001/claude-localization-20260925/work"
cd "$(dirname "$0")/../.."
a=$(find "$W/out" -name '*.json' | wc -l); t=0
while [ $t -lt 570 ]; do sleep 30; t=$((t+30)); done
b=$(find "$W/out" -name '*.json' | wc -l)
./tools/l10n/harvest-all.sh >/dev/null 2>&1
echo "checkpoints +$((b-a)) in ${t}s; limit-errors in journal: $(grep -c "hit your session limit\|usage limit" /Users/kairalimacmini/.claude/projects/-Volumes-Extreme-SSD---Blue-2nd-Kairali-Digital--codex-worktrees-ahv-final-draft-20260924/3028582e-ff5c-4f0c-9116-62c602c71eec/subagents/workflows/$1/journal.jsonl 2>/dev/null)"
node tools/l10n/status.mjs | tail -1
