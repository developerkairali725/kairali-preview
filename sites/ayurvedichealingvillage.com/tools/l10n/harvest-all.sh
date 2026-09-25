#!/bin/sh
# Harvest every recorded workflow run journal (work/runs.txt) — idempotent.
W="/Volumes/Extreme SSD - Blue 2nd/Claude Workspaces/10x WordPress and Websites/deliverables/WOPS-AHV-FINAL-DRAFT-20260924-001/claude-localization-20260925/work"
T=/Users/kairalimacmini/.claude/projects/-Volumes-Extreme-SSD---Blue-2nd-Kairali-Digital--codex-worktrees-ahv-final-draft-20260924/3028582e-ff5c-4f0c-9116-62c602c71eec/subagents/workflows
while read r; do [ -f "$T/$r/journal.jsonl" ] && node "$(dirname "$0")/harvest.mjs" "$T/$r/journal.jsonl"; done < "$W/runs.txt"
