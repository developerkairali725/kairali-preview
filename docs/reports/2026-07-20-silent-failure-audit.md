---
report_id: RPT-20260720-SILENT
date: "2026-07-20 08:20:00 IST"
task: "Silent-failure audit — every installed-but-never-loading / declared-but-never-firing mechanism across the OS (D-20260720-02); triggered by the taste-skill discovery"
project: "OS v2 (M1+M2 merged; M3(a) PR riding)"
source_tool: "claude-code 45-agent adversarial workflow (7 sweep lanes → per-finding refutation → completeness critic; 3.37M subagent tokens) + gpt-5.6-sol counter-check (appendix)"
type: audit
supersedes: null
---

# SILENT-FAILURE AUDIT — what was installed or declared but never actually fired

Owner's question, verbatim intent: *"how can you check no other mistakes like this
wasn't made while building the os?"* — "like this" = the Leonxlnx/taste-skill install
whose 13 symlinks dangled for 6 days, and the go-science saved-but-never-loading
setup bug. This audit hunted that CLASS across seven activation surfaces. Raw
machine evidence for every row: `2026-07-20-silent-failure-audit-evidence.json`
(same directory; every finding was adversarially re-verified by an independent
agent before it made this report — 37 raw findings → 31 confirmed + 3 critic
additions, 6 refuted/rescoped).

## The headline (blocker cluster, all one root cause)

**Every session launches from `~/Claude` (the parent dir). The repo's
`.claude/settings.json` — where ALL three hooks were registered — is only read
when a session launches from the repo root. That has happened once, on 13 Jul.**
Consequence, verified by transcript census and on-disk absence:

- **guard.sh PreToolUse battery** (force-push ban, production-WP block, DNS
  block, Shopify read-only, curl|bash ban) — fired ZERO times in any working
  session. Every hard gate held by DOCTRINE (the agent reading CLAUDE.md), not
  mechanism.
- **post-edit.sh** (rule-q audit log + per-site compliance lint on edit) —
  `agent-log.jsonl` did not exist anywhere on this machine despite six days of
  daily edits.
- **session-start.sh** (boot-contract + doctor banner) — appeared in zero live
  sessions; boot.json freshness came from agents running it BY HAND because
  CLAUDE.md told them to.

**IMPLEMENTED THIS SESSION, ⅔ ACTIVATION-PROVEN (sol counter-check wording —
"fixed" waits for the fresh-session proof):** hooks are now
registered at the `~/Claude` launch level (`~/Claude/.claude/settings.json`,
machine-local) with absolute paths; the two path-dependent scripts were made
self-locating (root derived from the script's own location, never cwd/project
dir) and repo-scoped; the dead `|| echo` failure-fallbacks in session-start.sh
were rebuilt to bind to the actual node exit status, and doctor's `attention`
lines now pass through instead of being grep-hidden. **Live-fire proof:** the
force-push probe was BLOCKED by the hook in this very session (first mechanical
hard-gate enforcement ever), and `agent-log.jsonl` received its first real
PostToolUse line. **SessionStart remains ACTIVATION-UNPROVEN until the next
fresh launch** — the very next session must confirm the banner appears, and the
#7 canary (independent scheduled-task check) is the standing watchdog after
that. Same caveat class applies to the repaired taste-skills: on-disk correct,
hash-matched to upstream, but load-proof arrives with the next session.

## Full disposition table (triad rule)

| # | finding (severity) | disposition | reason / owner / where | review_by |
|---|---|---|---|---|
| 5,22,24,6 | Hook layer never fires (blocker×2, major×2) | IMPLEMENT | FIXED this session (this PR + machine-local settings); live-fire proven | done |
| 9,31 | session-start dead fallbacks + hidden doctor attention (minor) | IMPLEMENT | FIXED in the same script rework | done |
| 28 | wp-snapshot.mjs cwd-relative backups say "safe" from any cwd (major) | IMPLEMENT | FIXED this PR — repo-anchored path | done |
| 1 | security-guidance LLM review NEVER ran — macOS Python 3.9.6 < required 3.10 (blocker) | IMPLEMENT (owner word) | needs `brew install python` — system install, owner's machine, one-worder Q-PYTHON-SECURITY-GUIDANCE | 2026-07-22 |
| C1 | Ship Gate A-13 security-review is NOT a required status check — auto-merge never waits for it (blocker) | IMPLEMENT (owner action) | branch-protection edit = owner lane; add `security-review` to required contexts | 2026-07-22 |
| 18 | KTAHV critical-flows spec finds ZERO tests — the Tier-1 deterministic gate is un-runnable (blocker) | IMPLEMENT (scheduled, claim truthed NOW) | sol pushed IMPLEMENT-now; adopted in two parts: the FALSE CLAIM is corrected immediately (this report + QUESTIONS; registry row truthing rides the next doctrine PR since gates/** is owner-guarded), and the spec itself is rebuilt at the KTAHV lane before ANY Tier-1 deploy — none is scheduled pre-M4, which bounds today's exposure | 2026-08-02 |
| 2 | Repo agents declare mcp__context7/mcp__firecrawl — configured NOWHERE (major) | IMPLEMENT (proposal) | either add the servers or strip the declarations; recommendation: strip + WebFetch with rule-r screening until a vetted server lands (SE-4/SE-5 lane) | 2026-07-26 |
| 13,19 | emit-verdicts NEVER landed a verdict (GH006 push block) (major×2) | IMPLEMENT (blocked-awaiting-owner) | sol counter-check overturned MONITOR: a lane failing on EVERY armed run is broken, not observed. Blocked on the kairali-os-bot account (owner's Monday list, home: QUESTIONS.md Q-EMITTER-PUSH-ALLOWANCE); on the bot's arrival I wire + prove ONE end-to-end verdict commit | 2026-07-22 |
| 14,29 | auditors.yml: 6-minute life, dangling ACTIVE registration, paid keys as secrets consumed by NOTHING (major×2) | IMPLEMENT (owner word) | one-worder Q-AUDITORS-YML: re-land the gate or delete branch+registration+rotate keys | 2026-07-26 |
| 10 | Miro plugin MCP: OAuth Unauthorized every session for 7 days (major) | IMPLEMENT (owner action) | authorize once in an interactive session (/mcp) or remove the plugin | 2026-07-26 |
| 11 | WordPress.com connector 0/13 auths then vanished in the connector migration (major) | MONITOR | home: BACKLOG.md 2026-07-20 entry — re-add deliberately before the first whyayurveda.org batch | 2026-08-02 |
| 23 | rule-q log historical gap 13–19 Jul (major) | REJECT | CORRECTED per sol counter-check B1: the log NEVER received a line anywhere — the hook never fired, so nothing was written and nothing destroyed (the "destroyed with worktrees" version was itself the refuted claim). Six days of edits have no deterministic log, unrecoverably; the log is ALIVE from 2026-07-20 02:38 UTC | — |
| 7 | Monday hook self-test has no mechanism (major) | IMPLEMENT (proposal, redesigned) | sol counter-check killed the first proposal as CIRCULAR (a dead SessionStart cannot report its own death). Redesign: the canary rides the INDEPENDENT control plane — the 09:30 scheduled task checks hook-freshness evidence (agent-log.jsonl mtime + last SessionStart banner timestamp) and files a QUESTIONS entry when stale | 2026-07-27 |
| 16,27,30 | uptime cron: declared 10-min, real ~hourly (GitHub Actions drift); issue text overstates 6× (minor×3) | IMPLEMENT (proposal) | honest-wording fix + threshold review; touches guarded .github/** so it rides the next doctrine PR | 2026-07-27 |
| 15 | "main pushes are never cancelled" comment is false — 7 cancelled runs (minor) | IMPLEMENT (proposal) | same guarded-workflow ride-along | 2026-07-27 |
| 17 | zero-page matrix exemptions have no mechanical exit (minor) | IMPLEMENT (proposal) | factory-matrix-lint: fail when an EXEMPT site gains its first page outside the matrix | 2026-07-27 |
| 20 | shopify-catalog-lint merged+tested, invoked nowhere, registry row stale (minor) | IMPLEMENT (proposal) | wire the Monday ritual (doctrine l) + truth the row; registry is guarded → doctrine PR | 2026-07-27 |
| 21 | pre-push.sh cited as enforcement but not a git hook (minor) | MONITOR | home: BACKLOG.md 2026-07-20 entry — install as a real .git/hooks/pre-push (or truth the registry citation) at the M3 remainder pass; it fires in Claude sessions now via the live hook layer | 2026-08-02 |
| 3,26 | go-science double-registration (missing plugin.json → '1.0.0' namespace) (minor×2) | IMPLEMENT (proposal) | vendor-side plugin.json + clean reinstall; context duplication only | 2026-07-27 |
| 4 | anthropic-agent-skills marketplace clone feeds nothing (minor) | REJECT (keep) | dormant but harmless registration; removal is cosmetic; documented here so nobody edits it expecting effect | — |
| 12 | GitHub MCP configured-never-connected, since removed (minor) | REJECT (historical) | already gone; recorded as pattern evidence | — |
| C2 | theblushlounge production alias serves the PRE-FIX golden build; owner promote pending ~36h (major) | IMPLEMENT (blocked-awaiting-owner) | sol counter-check overturned MONITOR: the PILOT's public alias serving pre-fix bytes is a live defect. The promote is the owner's click (session permission gate blocks agent-side vercel promote — on record in STATUS); home: STATUS.yaml theblushlounge blocker row; escalated in today's summary as an immediate owner action | 2026-07-21 |
| C3 | Vercel project drift: 2 sourceless projects, one "delete-me", one cancelled deploy (minor) | IMPLEMENT (proposal) | propose-first cleanup list to owner with the Sunaj GSC/GA4 cleanup (D-26 pattern) | 2026-07-27 |
| 25 | monday-billing-verify-access-check VERIFIED ARMED for 09:30 IST today (all-clear) | — | the one surface that was exactly as believed | — |

**Refuted/rescoped by the adversarial pass (6):** taste-skill repair correct on
disk but activation unproven until next session (honest caveat — the links now
resolve and hash-match upstream); three official plugins at version "unknown" DO
load; boot.json staleness was explained by the manual-run pattern, not a new
defect; worktree-era log lines are destroyed, not missing; vidIQ/GCal connector
disappearance is the known claude.ai migration; headless-session MCP-auth
limitation is platform behavior, not a repo defect.

## Incident logged against this audit's own tooling

During the sweep, a workflow subagent ran `git checkout main` in the SHARED
working tree while the dashboard commit was being made, landing it on local
main (caught via reflog; commit relocated; origin never touched). The repo's
own standing rule — every concurrent agent gets its OWN worktree — was violated
by the audit workflow's configuration, not by the rule. LEARNINGS entry added;
future workflow specs must set worktree isolation for any agent that runs git
state commands. A second subagent (in the M3(a) review) used a wildcard rm on
shared $TMPDIR test dirs — flagged by the harness, no damage; same lesson.

## What this means for the OS (honest summary, sol-corrected wording)

Doctrine existed and was read every session; several load-bearing MACHINE
protections beneath it were nonfunctional the whole week: hard-gate hooks, the
deterministic audit log, the LLM security review, the A-13 merge-block, and the
KTAHV spec gate never once executed. **No claim is made that every gate was
manually honored** — the absence of a detected breach is not execution
evidence, and the six-day log gap means conduct in that window is attested by
git history and PR review trails, not by the deterministic log. The failure
pattern is uniform: registration on a surface nothing reads — the taste-skill
bug at OS scale. Cures standing after today: (1) hooks registered where
sessions actually launch, self-locating scripts, live-fire proof for 2 of 3
events; (2) the counter-check's sweep-completeness point is ADOPTED — a Round-2
sweep over the enforcement/deployment control planes it named (branch
protections/rulesets, GitHub Apps/webhooks/secret-consumers, Vercel git
integration/alias promotion, git-native hooks) is queued with the same
adversarial method; (3) the right-tool-right-time doctrine (§6) needs its
promised "declared capability actually FIRED" evidence checks — this audit is
the manual version of what that mechanism should run continuously.

## Appendix — gpt-5.6-sol counter-check (owner-ordered)

Verdict: **FAIL, 6 blocking findings** — the counter-check did its job.
Dispositions: **B1 ADOPTED** (the #23 row propagated the refuted version of the
log-gap story; corrected above — nothing was destroyed because nothing was ever
written). **B2 ADOPTED** (sweep-completeness: Round-2 lanes queued, claim of
completeness withdrawn). **B3 ADOPTED** (emit-verdicts #13/#19, pilot alias C2
overturned MONITOR → IMPLEMENT blocked-awaiting-owner; #18 split: claim truthed
now, spec build scheduled with bounded exposure). **B4 ADOPTED** (#7 circular
self-test redesigned onto the independent scheduled-task plane). **B5 ADOPTED**
(headline reworded; SessionStart + taste-skill activation marked UNPROVEN until
next launch). **B6 ADOPTED** (summary rewritten; no conduct-layer blanket
claim). Rec-9's richer state vocabulary is carried INSIDE the triad's reason
column (activation-proven / blocked-awaiting-owner / scheduled) rather than
replacing the ruled IMPLEMENT|REJECT|MONITOR vocabulary — changing the ruled
triad is a doctrine decision, flagged for the owner rather than self-adopted.
Full model output: `2026-07-20-silent-failure-audit-solcheck.txt` (committed
beside this report).
