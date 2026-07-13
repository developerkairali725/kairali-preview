#!/usr/bin/env bash
# SessionStart reminder — 6 lines, no noise.
ROOT="${CLAUDE_PROJECT_DIR:-$(git rev-parse --show-toplevel 2>/dev/null)}"
Q=$(grep -c '^[0-9]*\.' "$ROOT/QUESTIONS.md" 2>/dev/null || echo 0)
cat <<EOF
Kairali Web Factory — sprint 13 Jul → 12 Aug 2026 (see docs/KAIRALI_30DAY_BUILD_RUNBOOK_v1.0.md for current wave)
Open QUESTIONS.md items: $Q — answer or append, never delete.
Ship Gate: SITE_LAUNCH_CHECKLIST_v1.0.md runs for EVERY site, unprompted.
Wiki lint every Monday (wiki/ + pnpm audit + hook self-test).
Hard gates: staging only · no DNS · no production WP · locked facts · KTAHV clinical lock.
Read LEARNINGS.md before starting any new site build.
EOF
exit 0
