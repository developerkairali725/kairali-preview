# Session report — batch SOPs into the Playbook + one-time-setup walk (18 Jul 2026, PM)

Pickup from `2026-07-18-handover-next-session.md` (to-dos #1–#4). Directive captured as D-20260718-01.

## 1. Old Vercel project RETIRED (handover to-do #1)

- `kairali-team-workbook` (team `kairali`, prj_VmSrAy4DOX8Vu0AVSHvpOFLMjB4M) **deleted** via Vercel CLI, 18 Jul 2026 ~12:35 IST.
- Evidence: `https://kairali-team-workbook.vercel.app` → **404**; the Playbook (`https://kairali-web-factory-kairali-ai.vercel.app/playbook`) → **200** before and after.
- Stale-project sweep of all 14 team projects: **no other stale dashboard projects.** `voyagent-pulse` is a live metrics dashboard for Voyagent (group-trip planner — unrelated project, left alone); `kairali-guru-website` serves the live kairali.guru (keep); `portfolio-website` looks like an old personal site — Abilash's call, flagged here, not touched.

## 2. Batch SOPs built into the Playbook wizard (to-dos #2–#3) — PR #110

Branch `content/batch-sops-playbook`. Full design in `docs/sops/batch-content-sops.md` (SoT). Three new wizard paths, all walked live in the browser; `next build` clean; all local gates PASS:

- **Marketing → "QA/QC a batch of existing pages (e.g. Vikash's 11)"** — 4 steps: batch-list template → facts verification vs FACTS doc → one-folder/one-card handoff → track.
- **Deepu → "Batch QA/QC — import & re-publish existing pages"** — 6 steps: prereq check (HELD without scaffold + signed rows) → wp-snapshot ALL then import on ONE branch → one PR, DEV-FIX vs BOUNCE → severable batches → Novamira page-by-page snapshot-first publish → CHECKED-✅ per page. Budget ~1–2 days.
- **Roshni → "Update OLD posts in batches (the 600)"** — 7 steps: the NO-to-600-in-a-day verdict (scaled-content-abuse fingerprint, March 2026 core update) → prereqs (whyayurveda scaffold + link map) → batch kitting → improve-not-rewrite per-post prompt → approve → batch handoff → weekly GSC safety loop with same-day PAUSE rule.

## 3. Deepu one-time setup walked (to-do #4) — this PR

Repo-side items of Workbook Part 4 executed:

| # | Item | State |
|---|------|-------|
| 1 | `sites/ayurvedichealingvillage.com` scaffold | ✅ `site.config.json` (entity **ktahv** = the clinical-lock switch; register A, EN/DE/FR, video real) + `launches/ayurvedichealingvillage.com/` (checklists, design-intake, **armed approvals.yaml, rows pending Abilash**) |
| 2 | `sites/whyayurveda.org` content home | ✅ `site.config.json` (register ED blog, group entity) + armed ledger, rows pending |
| 3 | Novamira on WP **staging** | ⏳ **Deepu's human step** (guide: /guide/deepu) — cannot and must not be done by the agent |
| 4 | `content/ledger.yaml` | ✅ created (Part 5 schema in comments, `items: []`) |
| 5 | Bookmarks (Drive folder + Tracker) | ⏳ Deepu's human step |
| 6 | Verify prompt + Tracker PASS | ⏳ runs after #3/#5; the repo-side items will PASS except "signed rows" until Abilash signs |

**Design decision (Q-SCAFFOLD-MATRIX, QUESTIONS.md):** both scaffolds are config + armed ledger, ZERO pages. A page-less site cannot run factory-spec/lighthouse, so they are **matrix-EXEMPT (TEMPORARY, loud)** with a stated exit: the first-page PR adds each site to BOTH matrices. Front-gate is armed by construction — no page can merge for either domain until Abilash signs the rows. Nothing was self-approved; no gate weakened.

**Needed from Abilash (one word each, per domain):** `APPROVE brief` · `APPROVE strategy` · `APPROVE design_source` · `APPROVE golden_page` — context notes are inside each approvals.yaml. Plus ratify Q-SCAFFOLD-MATRIX.

## 4. Also in this PR

- The previous session's handover doc (`2026-07-18-handover-next-session.md`) was found **uncommitted** in the working tree — committed here (report-deliverable law).
- STATUS.yaml session-end update + `status-data.json` regenerated (workbook workstream milestone; KTAHV + whyayurveda rows moved to "scaffold exists, pending signatures").
- DIRECTIVES.md: D-20260718-01 captured.

## Open items after this session

1. Abilash: review/merge PR #110 + this PR; sign 8 front-gate rows; ratify Q-SCAFFOLD-MATRIX; the handover's open questions (Q-PLAYBOOK-V4 #2, Dr. Ashika spelling) still stand.
2. Deepu: human steps 3/5/6 above, then the batch QA/QC path is fully unblocked once Vikash's 11-URL list lands.
3. Unchanged from handover: Vikash transcripts thread unanswered; 2 UNREAD GSC-thread replies; whyayurveda sitewide link map (after first content item ships).

*Timestamped per repo law: 2026-07-18 13:10:00 IST (times in this report are approximate to the minute; git carries second precision).*
