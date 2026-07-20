#!/usr/bin/env bash
# SessionStart reminder — 6 lines, no noise.
# ROOT from THIS SCRIPT'S location (20 Jul audit: sessions launch from ~/Claude,
# so CLAUDE_PROJECT_DIR/cwd derivations never pointed here).
ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"
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
  # Failure detection binds to the NODE exit status, not to head/grep — the
  # old `pipeline || echo` form made both fallbacks dead code (audit finding:
  # `||` bound to head, which always exits 0; a crashing doctor was silent).
  if BOOT_OUT=$(cd "$ROOT" && node scripts/boot-contract.mjs 2>&1); then
    printf '%s\n' "$BOOT_OUT" | head -12
  else
    echo "boot-contract FAILED — run it by hand: cd $ROOT && node scripts/boot-contract.mjs"
    printf '%s\n' "$BOOT_OUT" | tail -3
  fi
  if DOC_OUT=$(cd "$ROOT" && node scripts/doctor.mjs 2>&1); then
    # attention lines pass through — hiding them defeated doctor's purpose
    printf '%s\n' "$DOC_OUT" | grep -E "^doctor|^CONTRADICTION|FAIL —|attention" | head -10
  else
    echo "doctor FAILED — run it by hand: cd $ROOT && node scripts/doctor.mjs"
    printf '%s\n' "$DOC_OUT" | tail -3
  fi
fi
exit 0
