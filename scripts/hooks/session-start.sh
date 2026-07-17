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

# SESSION BOOT CONTRACT (CLAUDE.md; docs/research/agentic-memory-and-state-2026-07-16.md
# MVP items 1+2). Regenerates state/boot.json from ground truth and reconciles the
# durable logs against GitHub. Fault-tolerant: a hook that can block a session
# open is worse than a stale boot file — failures print and move on.
if command -v node >/dev/null 2>&1 && [ -f "$ROOT/scripts/boot-contract.mjs" ]; then
  node "$ROOT/scripts/boot-contract.mjs" 2>&1 | head -12 || echo "boot-contract failed — run it by hand: node scripts/boot-contract.mjs"
  node "$ROOT/scripts/doctor.mjs" 2>&1 | grep -E "^doctor|^CONTRADICTION|FAIL —" | head -8 || echo "doctor failed — run it by hand: node scripts/doctor.mjs"
fi
exit 0
