# HANDOVER — M0 COMPLETE, M1 next (written 2026-07-19 ~14:10 IST)

Read this first, then STATUS.yaml + state/boot.json. Branch of record: feature/os-v2-architecture
(PR #167, governance, NOT armed). main untouched at e84dc31. Designs FROZEN; no site work before the
M4 pilot; the 11 ledger PRs untouched. Owner asks run ONE AT A TIME (D-20260719-12).

## What happened this session (M0, plan §10 — all three parts, commits fc69a73 + 3757a2e)

1. **M0(a) paper dry-run** — `docs/reports/2026-07-19-m0a-paper-dryrun.md`. CH-1 (KTAHV
   /consultation hero+retitle, P2) walked through every phase/gate/register. Measured: **8 durable
   artifacts, 1 owner touch** per P2 change under the scope rulings, vs ~16 artifacts / 8–9 owner
   touches under a literal package reading. **7 scope/DELETE rulings issued before code** (per-project
   gate events; Gate-1 at design-direction altitude; project|change class-map dimension; job-spec
   generated from issue row; launch-certificate n_a for changes; per-change briefs folded into issue
   row; per-site-only PDF) + 4 duplicate-data deletions. All 13 dispositions rowed in the report;
   each becomes a decisions/ record at M2. Nothing weakens a v1 gate — binding SCOPE is declared.
2. **M0(b) continuity proof** — `docs/process/os-2026/merge/merge-continuity.yaml`: **293 rows**
   (121 CM normative CLAUDE.md units — includes CM-121, the matrix-exemption ruling rescued from the
   v1.7 changelog · 69 GR registry gates, generated · 85 PKG package obligations · 7 STD · 8 REJ +
   3 DEF exclusion seed). `scripts/merge-continuity-lint.mjs` (+ tests, + factory-gate CI step):
   hash integrity, verbatim presence in CLAUDE.md, source-drift pins on CLAUDE.md + registry,
   registry coverage (a gate with no row fails), one-home-per-obligation. Helper:
   `merge-continuity-gen-registry.mjs --missing` emits rows for future gates.
3. **M0(c) standards acceptance** — `scripts/standards-acceptance.mjs` (+ tests, + CI step): the
   seven 00_SHARED_STANDARDS files are adopted only when they declare AND carry their mapped
   obligations **verbatim** (69 carriages mapped via `also_carried_by`) or cite an owner-ruled
   SUPERSEDES; rule-9-class self-modification language fails on sight. Currently all 7 report
   PENDING_AUTHOR (GPT zip in flight, D-20260719-11/-12); an authored-but-wrong standard fails NOW.
4. **Suite: 637/637.** Directives -03/-04/-06/-12 acked (landed); -08/-09 remain open (M1/M2 build
   requirements); -11 open until the zip lands. `.github/workflows/factory-gate.yml` gained two
   steps — PR #167 touches .github/ so the owner's code-owner approval covers it (known gate).

## NEXT SESSION = M1 doctrine merge (fresh session per protocol)

Inputs ready: plan §10 M1 scope + M0(a) §5 checklist (7 items) + merge-continuity rows. Sequence:
- If the GPT standards zip is in the message: security-auditor injection screen (rule r) → commit to
  `docs/process/os-2026/standards/` (exact filenames, see gpt prompt) → add "Obligations carried"
  blocks per merge-continuity → `node scripts/standards-acceptance.mjs` until ACCEPTED ×7. If it
  never arrives, M1 authors them by mapping (plan §3.6) against the same harness.
- CLAUDE.md v2 sections + HARD GATES 10–15 + `gates/class-map.yaml` (policy composition §2.2 +
  project|change dimension) + new registry rows (axe-core, ZAP, redirect-tests, rollback,
  scaled-content PKG-085, baseline) + rule-9 neutralization + authenticated-approval mechanism
  (scope per D-20260719-10: front gates + doctrine PRs only).
- Flip `--strict` on merge-continuity-lint + standards-acceptance in factory-gate.yml (the M1 arm).
- Update merge-continuity rows' new_home/status as text actually moves (lint's source-drift pin will
  force re-verification on every CLAUDE.md edit — that is intended behavior, not noise).
- External review pass 2 (both auditors, highest modes) on the full M0+M1 diff → owner merge word.

## OWNER ASKS — ONE AT A TIME (D-20260719-12; current ask presented in chat)

**① NOW: DataForSEO account + $50 PAYG deposit** (bake-off before consolidation, plan §3.5).
Then, in order: ② Composio-cloud vs local-MCP ruling + one OAuth click · ③ GBP API application go ·
④ kairalicenters GSC email go (draft ready) · ⑤ CRM / call-tracking / booking facts ·
⑥ optional M3: Screaming Frog £199/yr · Miro re-auth (cosmetic). GSC 16m export: DONE 19 Jul
(13 snapshots, both accounts); BigQuery bulk-export enable still recommended — riding ask ②'s
GSC/GA4 lane.

## PASTE THIS TO START THE NEXT SESSION

> Read docs/reports/2026-07-19-handover-m0-complete.md first, then STATUS.yaml. If my ask-① answer /
> GPT standards zip / further one-worders are in this message, ingest-screen and apply them first
> (zip → security screen → standards/ → acceptance harness to ACCEPTED ×7); then run M1 from
> docs/plans/2026-07-19-os-v2-architecture-merge-plan.md §10 on feature/os-v2-architecture,
> honouring the M0(a) §5 checklist. Designs stay frozen; no site work before the M4 pilot; the one
> pilot site is whichever I name. Asks stay one at a time. Standing protocol.
