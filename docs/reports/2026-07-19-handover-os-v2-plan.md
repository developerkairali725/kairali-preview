# HANDOVER — OS v2 ingested, merge plan in PR #167, M0 next (written 2026-07-19 12:22:20 IST)

Read this first, then STATUS.yaml + state/boot.json. Branch of record: feature/os-v2-architecture (PR #167,
labelled governance, NOT armed). main untouched at e84dc31; designs still FROZEN; the 11 ledger PRs untouched.

## What happened this session
1. Base verified clean; settings drift fixed + prevention in PR #166 — later reconciled against
   D-AUTOMERGE-TIERS → Q-AUTOMERGE-V2 in QUESTIONS.md (owner one-worder; deny holds through the freeze).
2. Owner delivered the v2 package + go-science skill. Both committed with provenance + SHA verification
   (docs/process/os-2026/ · docs/marketing/go-science/source/). go-science skill PROPERLY installed
   (vendor setup bug found: wrote a config surface Claude Code no longer reads — skill had never loaded;
   now v1.0.0 in installed_plugins.json, loads from next session).
3. Full ingest: 16-agent workflow (1.66M tok, 15 readers + critic, zero uncovered content) + 6-lane research
   sweep (541k tok). Evidence: docs/reports/2026-07-19-os-v2-evidence/. One injection-class line found in the
   package (self-mod "rule 9") — neutralization is an M1 deliverable.
4. MERGE PLAN written: docs/plans/2026-07-19-os-v2-architecture-merge-plan.md — the session's core artifact.
5. External review pass 1 (D-20260719-04): gpt-5.6-sol + sonar-reasoning-pro, highest modes. 6 blocking
   findings ADOPTED (continuity proof, authenticated approvals, policy composition, DataForSEO bake-off,
   daily feeds, clean-predecessor pilot). Verdicts + dispositions in plan §12. Pass 2 runs on the M0+M1 diff.
6. Directives D-20260719-03…06 captured; -01 and -05 acked. STATUS.yaml + dashboard updated.

## NEXT SESSION = M0 (fresh session per protocol — this one ran heavy)
- M0(a) paper dry-run of one change through all phases (measure owner touches; DELETE machinery first);
- M0(b) generate merge-continuity.yaml (every normative rule + 63 registry rows + package obligations, CI-checked);
- M0(c) acceptance tests for the seven authored standards. Then M1 doctrine merge → external pass 2 → owner merge.
- Nothing in M3+ starts before the owner one-worders (plan §7.2). NO site build before M4 pilot approval.

## OWNER ONE-WORDERS OUTSTANDING (plan §7.2 + QUESTIONS.md)
URGENT GSC 16-month export + BigQuery enable (permanent deletion clock) · DataForSEO $50 PAYG ·
GSC/GA4 routing (Composio vs local MCP) · CRM / call-tracking / booking facts · pilot-site pick
(clean-predecessor shortlist) · Q-AUTOMERGE-V2 (authenticated arming at M1 recommended) · PR #166 + #167 merge words.

## AFTERNOON ADDENDUM (same day, ~13:50 IST — supersedes parts of the above)
- **GSC exports COMPLETE: 13 snapshots across BOTH accounts** (director@ ×4 + abilash.kr ×9 — the u/0
  account holds 11 properties; the /welcome-page zero-property reading was a false negative). Landed with
  SHA manifests in launches/<domain>/baseline/raw/gsc-ui-export-2026-07-19*/. See
  launches/README-gsc-snapshot-2026-07-19.md for numbers + gaps (kairalicenters with Abhishek/Gaurav;
  ~8 domains unregistered). GA4 snapshot rides M3.
- **AUTOMERGE RULED (D-20260719-10):** self-merging for routine green technical PRs STAYS
  (D-AUTOMERGE-TIERS); the #166 deny rule removed on this branch AND the governance branch; learnings/
  doctrine always owner-approved; authenticated approvals scope = front gates + doctrine PRs (plan M1
  amended). Q-AUTOMERGE-V2 answered in QUESTIONS.md.
- **Missing 00_SHARED_STANDARDS ×7 (D-20260719-11):** owner will run the prepared GPT prompt
  (docs/process/os-2026/merge/gpt-missing-standards-prompt.md); returned files pass the ingest screen +
  v1-supremacy reconcile before adoption. If they never arrive, M1 authors them by mapping (plan §3.6).
- **External-AI chain checks (D-20260719-08) + right-tool-right-time enforcement (D-20260719-09)** are
  standing build requirements for M1/M2.
- **Owner asks OUTSTANDING (the tools/API list, his "do you need anything" answer pending):** DataForSEO
  account + $50 PAYG (bake-off first) · Composio-vs-local ruling then GSC/GA4 OAuth (one-time click) ·
  GBP API application go · kairalicenters GSC request to Abhishek/Gaurav (draft ready on the word) ·
  CRM / call-tracking / booking facts · optional: Screaming Frog £199/yr (M3), Miro re-auth (cosmetic).
  Everything else needed for M0-M2 is already installed.

## PASTE THIS TO START THE NEXT SESSION
> Read docs/reports/2026-07-19-handover-os-v2-plan.md first (including the afternoon addendum), then
> STATUS.yaml. If my one-worders / GPT standards zip / tool approvals are in this message, ingest-screen and
> apply them first; then run M0 from docs/plans/2026-07-19-os-v2-architecture-merge-plan.md §10 on the
> feature/os-v2-architecture branch. Designs stay frozen; no site work before the M4 pilot; the one pilot
> site is whichever I name. Standing protocol.
