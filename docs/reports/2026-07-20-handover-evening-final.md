---
report_id: RPT-20260720-HANDOVER-EVENING
date: "2026-07-20 18:05:00 IST"
task: "Evening-final handover — merge walkthrough, GO ruling, BigQuery region one-worder, new-session queue"
project: "OS v2"
source_tool: "claude-code session close"
type: handover
supersedes: null
---

# HANDOVER — evening final (20 Jul). Supplements RPT-20260720-HANDOVER-EROSION.

## OWNER MERGE WALKTHROUGH — exact clicks, exact order, exact red gate

The red check on #188–#191 is named **`front-gate`**; the failing step inside it is
**"Authenticated approval (guarded paths need an owner-identity review)"** — DESIGNED red because
the diff touches the guarded enforcer `scripts/banned-string-lint.mjs`. Everything else is green.

1. **PR #188** — open it → Files changed → Review changes → **Approve** → Submit (AFTER the latest
   push) → Checks tab → rerun the failed `front-gate` run (`gh run rerun --failed <run-id>` or the
   UI "Re-run failed jobs") → it goes green → **Merge**. (Owner admin-merge instead is fine — it
   gets an HG9 log next session, the #184/#186 lane.)
2. **PR #189** — same clicks (it also touches the guarded lint). Approve → rerun `front-gate` →
   merge.
3. **PR #190** — its `front-gate` red is only INHERITED (#188's lint sits in its stacked diff).
   After #189 merges: rerun the failed `front-gate` job → all green → merge (approve first if
   GitHub asks; no guarded path of its own).
4. **PR #191** — same as #190: after #190 merges, rerun `front-gate` → green → merge.
5. **PR #192** (session-close records) — no red CI; only the required-review protection. Approve →
   merge, any time, independent of the stack.
6. **PR #193** (this records lane: D-28/D-29 + runbook addendum 6 + this handover) — same as #192.
7. After ANY admin-merge: post-merge-push orphan check on the merged branch (standing caution).

## RULINGS RECEIVED THIS CLOSE

- **Q-IVR-FLEET-GAP = GO** (D-20260720-29): land the group IVR tel: CTA (+91 9555156156,
  call_click, footer contact row — the #190 pattern) on kairalihospitality.com + healing.recipes.
  FIRST BUILD TASK of the next session. Close Q-IVR-FLEET-GAP in QUESTIONS.md after #190 merges
  (the question text rides that PR).
- **whyayurveda GSC bulk export DONE by owner in DELHI asia-south2** (D-20260720-28) → new
  one-worder **Q-BQ-REGION: DELHI-STAYS / REDO-MUMBAI (recommended)** — free to change only until
  the first export lands (~48h). Full verified facts: runbook addendum 6. Whichever word: ALL
  remaining datasets (7 GSC properties + GA4 exports) land in that one region.

## NEW FINDING (spotted in passing, rides next session)

whatisayurveda homepage trust-strip tile 4: **"Physician-Reviewed / Every health page checked by a
BAMS doctor"** — this is the PROHIBITED blanket review claim (D-REVIEW-2; machine state: zero pages
carry a genuine reviewedOn yet). It predates the wave and slipped the lint's current regex. Next
session: truth the tile to the per-page rule ("Reviewed pages carry the doctor's name and date")
+ widen the `blanket-review-claim` lint pattern to catch this phrasing. Interacts with
Q-WIA-TRUST-STRIP: whatever the owner picks there, this tile gets truthed regardless.

## NEXT SESSION — IN ORDER

1. Activation checks ①②③ (③ = real LLM review on the first SOURCE commit).
2. Verify the merge chain #188→#192 (+#193) landed; else it is the first owner ask (walkthrough above).
3. Execute the IVR GO (D-20260720-29) — small PR, both sites, same pattern as #190.
4. Truth the whatisayurveda review tile + widen the blanket-review-claim lint regex.
5. Act on the Q-BQ-REGION word (either update runbook step 10 to Delhi, or confirm the owner's
   Mumbai redo landed); then the remaining 7 bulk-export configs follow in that region.
6. Checklist walk resumes: Q-AUDITORS-YML · Q-A13 · Anupam reply · Villa Raag round · chases
   (reconcile-before-chasing). Then Phase C (D-05 level 3).
