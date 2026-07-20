---
report_id: RPT-20260720-HANDOVER-EROSION
date: "2026-07-20 17:32:00 IST"
task: "Session close handover — CARD-4 + CARD-5 erosion wave executed"
project: "OS v2"
source_tool: "claude-code session close"
type: handover
supersedes: null
---

# HANDOVER — erosion-wave session close (20 Jul, evening)

## THE WAVE — ALL FOUR FIXES SHIPPED AS A STACKED PR CHAIN

- **#188 — CARD-4(a)**: ruled-wrong group-attached 1908 form purged on kairali.com /
  arogyakendra.com (LIVE) / kairalicenters.com / whatisayurveda.com → the ruled
  "a family tradition since 1908" forms; llms `founded 1908` facts → `founded 1989 +
  family lineage`; **6** typed copyright literals → computed year (B-142's four PLUS
  theblushlounge "© 2026" and kairaliequipment "© 1989–2026", found by the widened scan);
  new banned-string-lint rule `group-attached-1908` + fixture rows; meta descriptions
  re-fit to the 155 cap (the build gate caught the longer wording — cap check works).
- **#189 — CARD-4(b)**: llms.txt legal-entity purge (both bulk sites, single-token
  brand-form fix per the hospitality precedent) + `llms-legal-entity` lint row scoped to
  llms.txt paths, fixture-bound. Zero legal-entity strings across all 12 llms routes +
  emitter inputs, machine-verified.
- **#190 — CARD-4(c)**: kairali.com tel: CTA restored — group IVR +91 9555156156 in the
  footer contact row, `call_click` captured by the mounted @kairali/analytics delegation
  (B-073 / D-20260714-QKC3 landing).
- **#191 — CARD-5 REDUCE**: whatisayurveda masthead logo + steward small line + hero
  overline OFF; footer/About steward homes kept; site leads with its own name.

**T8 3-way per fix** (bakeoff precedent: one pass per leg + judged record; GPT went 3
passes on (a)): spec + GPT + PPX + evidence + judgment files committed append-only per fix
(`docs/reports/2026-07-20-card4a/4b/4c/5-3way-*.txt`). Owner-fact authority
(D-EXTREVIEW-OWNER-FACTS) applied where external legs contested owner-primary-source facts.
D-20260720-25 and D-20260720-26 ACKED (this branch).

## MERGE ORDER (owner clicks, exact)

1. **#188** then **#189** — each touches the guarded `scripts/banned-string-lint.mjs`, so
   the authenticated-approval step is DESIGNED-red: Files changed → Review changes →
   **Approve** → Submit (AFTER the latest push) → rerun the failed front-gate job
   (`gh run rerun --failed`) → merge. (Owner admin-lane also valid; gets an HG9 log.)
2. **#190** then **#191** — stacked; they inherit the guarded diff until the predecessors
   merge, then their front-gate goes green (everything else already passes).
3. After ANY admin-merge: post-merge-push orphan check on the merged branch (standing).

## ACTIVATION CHECKS — ALL PASSED

① boot + doctor clean; the crash-exposure item resolved (stranded 20-Jul morning brief
pushed as chore/morning-brief-2026-07-20 — it never landed on main, flag if wanted as PR;
both worktree-agent branches verified contained on origin). ② 13 taste skills loading.
③ PROVEN: first source commit LLM-reviewed 17:11:13 IST — "no security issues found"
(20 files). (#186 verified MERGED ed98048; its HG9 log landed via #187, auto-merge fired
16:58 IST, routine docs lane.)

## NEW ONE-WORDERS (appended this session, ride the PRs)

- **Q-IVR-FLEET-GAP**: D-KH-PHONE / D-HR-PHONE ruled the group IVR prints on
  kairalihospitality + healing.recipes — neither site's source prints it. GO lands it.
- **Q-WIA-TRUST-STRIP**: the whatisayurveda homepage trust-strip (steward facts) is neither
  a named CARD-5 removal nor a ruled home. KEEP / RELABEL / REMOVE.

## NEXT SESSION — IN ORDER

1. Activation checks ①②③ as always (③ = real LLM review after first source commit).
2. Verify the merge chain #188→#191 landed; else it is the first owner ask.
3. Checklist walk resumes: Q-AUDITORS-YML (RELAND/DELETE) · Q-A13 (owner branch-protection
   click) · Anupam reply read · Villa Raag feedback round · Sunaj/Vikash/Satyam/Shadab/
   G-section chases (reconcile-before-chasing: mailbox by SENDER+TOPIC, never ask-threads).
4. Then Phase C (D-20260720-05 level 3) + remaining D-05 legs.

## STANDING CAUTIONS (unchanged + one new)

- Squash-orphan trap: post-admin-merge pushes check on every merged branch.
- Read-only verify workflows safe; workflow + parallel Bash worktree crashes — this session
  ran the external legs as plain background Bash (clean, no workflow needed at this scale).
- Report-store lint: never hand-edit docs/reports/index.json.
- NEW: the pre-push guard (guard.sh) runs compliance lint → package tests → full build on
  every push — a lint rule without its fixture-corpus row, or a >155-char meta description,
  blocks at push time. Budget for it in wave pacing (it caught two real defects today).
