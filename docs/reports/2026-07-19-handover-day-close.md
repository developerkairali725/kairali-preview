# HANDOVER — day close 19 Jul (M0 ✓ · standards ✓ · vulns ✓ · asks ✓ · analytics access built) → M1 next

Read this first, then STATUS.yaml + state/boot.json. Branch of record: feature/os-v2-architecture
(PR #167, governance, owner-merged; main carries the security fix, PR #168 MERGED). Designs FROZEN;
no site work before the M4 pilot; **PILOT = theblushlounge.com** (D-14). **ULTRACODE default for OS
sessions** (D-13). Asks one-at-a-time (D-12). Directives D-20260719-12…27 all captured + acked.

## Where the OS stands (morning → evening, one line each)

1. **M0 COMPLETE** (plan §10): dry-run report (7 scope rulings) · merge-continuity.yaml 293 rows +
   CI lint · standards-acceptance harness. docs/reports/2026-07-19-m0a-paper-dryrun.md.
2. **Seven 00_SHARED_STANDARDS ADOPTED** — owner's GPT zip, manifest 7/7, 129-agent screen
   0-blocking, v1-supremacy appendices, ACCEPTED ×7. docs/reports/2026-07-19-standards-ingest-screen.md.
3. **Vulnerabilities ZERO** — otel-core override, PR #168 auto-merged, audit + Dependabot clean.
4. **All 6 owner asks CLOSED same-day** — DataForSEO funded · GSC/GA4 = LOCAL · GBP both-parallel ·
   kairalicenters email SENT · R4 facts complete (central CRM = truth, Satyam; wa.me+UTM launch;
   KTAHV/VR = CRM+2 PMS; centres = separate CRM via Gaurav) · Screaming Frog parked to M3.
   wiki/integrations/crm-centralized.md is the R4 fact page. **UTM mapping gap = M3 build req.**
5. **Analytics access EXECUTED agent-driven** (owner order "do it yourself"; runbook
   docs/sops/gsc-ga4-local-access-runbook.md carries THE FULL STATE in EXECUTION STATUS +
   addendums 2-3 — read it before touching anything Google):
   - GCP project **kairali-analytics-os** (number **174837120177** — the GBP form needs this),
     org kairali.com; SA **kairali-os-reader@kairali-analytics-os.iam.gserviceaccount.com**;
     key `~/secrets/kairali-os-reader.json` (0600, env in ~/.zshrc). 3 APIs enabled.
   - **GSC: 8 properties granted Restricted** (smoke test 200). **5 ownership gaps** (villaraag
     domain, kairali.com, institute, kairalitraining, keralatraining) + kairalicenters (Abhishek/
     Gaurav thread).
   - **GA4 is MULTI-ACCOUNT: ~15 accounts across both logins** (full map addendum 2; TWO Villa
     Raag accounts). SA = account-level Viewer on "Kairali" (384203334) only so far; runReport 200.
   - **BigQuery armed**: billing "Kairali Analytics OS Billing" linked (owner paid) · BigQuery+
     Storage APIs on · search-console-data-export system account = Job User + Data Editor.
     **Per-property Bulk-export UI config PENDING** (form gotcha documented in addendum 3 —
     type-into-focused-fields only, verify the review dialog; nothing half-created).
   - ⚠️ **Billing identity verification PAST DUE** (suspension warning) — owner asked for reminder.

## In flight (nobody waits on us)

- **Scheduled task `monday-billing-verify-access-check` fires Mon 20 Jul 09:30 IST**: billing-verify
  reminder · Sunaj/Vikash chase · Satyam/Abhishek/Gaurav reply reconcile (mailbox first!) · SA sweep
  + bulk-export config once ownership lands · first-export check (~48h, likely Tue).
- **Owner's one click pending: SEND the Sunaj/Vikash draft v3** (subject "…Monday 20 July…";
  discard the two older drafts — v1 had a wrong date). It orders: director@ = GSC Owner + GA4 Admin
  EVERYWHERE by Mon EOD + propose-first cleanup of inactive accounts (D-26 safety clause: no
  deletion without owner confirm, nothing unexported).
- Sent + awaiting replies: Satyam CRM read-access · Abhishek/Gaurav kairalicenters GSC · Gaurav
  centres workflow map (all mailbox-verified sends).
- Owner-side whenever: GBP 5-min trio (group check + first Insights CSV + application submit —
  docs/sops/gbp-access-runbook.md) · GSC/GA4 runbook already executed for him.
- BigQuery-vs-Supabase RULED as lanes: GSC export = BigQuery (Google's only door); forms/leads =
  Supabase (standing decision). Not competitors.

## NEXT WORK SESSION = M1 doctrine merge (ultracode default binds)

All inputs exist. Scope (plan §10 M1 + M0(a) §5 checklist + ingest report "opens"):
- CLAUDE.md v2 sections + HARD GATES 10–15 + M0(a) scope rulings (per-project gate events ·
  Gate-1 at design-direction altitude · launch-cert n_a for changes · issue-row specs).
- gates/class-map.yaml (policy composition + project|change dimension) + registry rows (axe-core,
  ZAP, redirect-tests, rollback, scaled-content PKG-085, baseline).
- Rule-9 neutralization in the 24 package workflows (PKG-043).
- Authenticated approvals (front gates + doctrine PRs only, D-20260719-10).
- --strict flip on merge-continuity-lint + standards-acceptance once the 17 strict residues exist.
- merge-continuity row updates as text moves (source-drift pin forces re-verification — intended).
- **External review pass 2** (gpt-5.6-sol + sonar-reasoning-pro, highest modes) on the full
  M0+M1 diff → owner merge word on PR #167. Then M2 mechanisms → M3 tools/data → M4 pilot
  (theblushlounge.com; snehachowdhary.com is its live predecessor for the baseline gate).

## PASTE THIS TO START THE NEXT SESSION

> Read docs/reports/2026-07-19-handover-day-close.md first, then STATUS.yaml. If Sunaj/Vikash/
> Satyam/Gaurav replies or my one-worders are in this message, ingest-screen and apply them first
> (Monday's scheduled task may already have handled ops — check its output/DIRECTIVES before
> redoing). Then run M1 from docs/plans/2026-07-19-os-v2-architecture-merge-plan.md §10 on
> feature/os-v2-architecture, honouring the M0(a) §5 checklist and the ingest report's M1 list.
> Ultracode default. Designs stay frozen; no site work before the M4 pilot; pilot is
> theblushlounge.com. Asks one at a time. Standing protocol.
