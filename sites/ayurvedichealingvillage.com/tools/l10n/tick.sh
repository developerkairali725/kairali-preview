#!/bin/sh
# One coordinator tick: wait ~25 min (or until the run's checkpoints stop growing), then harvest + status + review queue.
W="/Volumes/Extreme SSD - Blue 2nd/Claude Workspaces/10x WordPress and Websites/deliverables/WOPS-AHV-FINAL-DRAFT-20260924-001/claude-localization-20260925/work"
cd "$(dirname "$0")/../.."
start=$(find "$W/out" -name '*.json' | wc -l); t=0; last=$start; idle=0
while [ $t -lt 1500 ]; do sleep 60; t=$((t+60)); n=$(find "$W/out" -name '*.json' | wc -l); if [ "$n" = "$last" ]; then idle=$((idle+1)); else idle=0; fi; last=$n; [ $idle -ge 8 ] && break; done
echo "checkpoints +$((last-start)) in ${t}s (idle ${idle}m)"
./tools/l10n/harvest-all.sh >/dev/null 2>&1
node tools/l10n/review-queue.mjs
node tools/l10n/status.mjs
