---
id: D-20260719-external-pass-adoptions
type: process
status: accepted
date: "2026-07-19 20:35:00 IST"
deciders: "Abilash (authority D-20260719-06, review law D-20260719-04) + agent"
expected_outcome: "Every external pass-2/pass-3 finding has a recorded disposition — adopted findings hardened the M1 diff; refuted findings carry their refutation evidence."
confidence: high
governs:
  - scripts/authenticated-approval.mjs
  - .github/
  - docs/process/os-2026/merge/
sources:
  - ref: "docs/reports/2026-07-19-m1-doctrine-merge.md (RPT-20260719-M1) §3"
    trust_tier: repo_artifact
    retrieved: "2026-07-19"
  - ref: "docs/reports/2026-07-19-os-v2-evidence/pass2-dispositions.md (full pass-2 disposition table)"
    trust_tier: repo_artifact
    retrieved: "2026-07-19"
  - ref: "DIRECTIVES.md D-20260719-04 (external review law: constructive depth, highest modes; ignore feedback of no importance)"
    trust_tier: owner_ruling
    retrieved: "2026-07-19"
---

# M1 external review passes 2–3: the adoption set (dispositions, not obedience)

## Context

The deploy-gate law (plan §11–12, D-20260719-04) requires dual external review — ChatGPT
(gpt-5.6-sol, highest mode) + Perplexity (sonar-reasoning-pro) — on the M0+M1 diff before any
doctrine merges, with every finding DISPOSITIONED rather than obeyed or ignored. Pass 2 ran on
the M1 diff (both FAIL), pass 3 on the fixed head (sonar PASS; gpt FAIL 6, dispositioned).
Record date = the M1 report's external-review record (RPT-20260719-M1, §3); seeded at M2
(2026-07-19 19:32:00 IST).

## Drivers

- Single-auditor verdicts are input, not truth (plan §12's live demonstration: sonar's
  "gpt-5.6-sol doesn't exist" refuted by direct API evidence).
- Standing rulings bound the dispositions: D-EXTREVIEW-OWNER-FACTS (owner-confirmed business
  facts are advisory to external auditors), D-AUTOMERGE-TIERS + D-20260719-10 (auto-merge
  boundary).

## Options considered

1. Obey every finding (rejected — several pass-3 findings were refutable with platform or
   ruling evidence; obedience would have re-litigated owner rulings).
2. Ship without the external passes (rejected — violates the deploy-gate law, D-20260719-04).
3. **Disposition every finding: ADOPT what survives scrutiny, REFUTE with evidence what does
   not, and record both** (taken — the standing review law applied).

## Outcome

Per RPT-20260719-M1 §3. **Pass-2 adoptions → the ec34c2e fix round:** base-trusted owner
register (mutable trust root closed) · rename-aware guards · latest-effective-review semantics ·
workflow-derived tamper-evident enforcer guards (13 net-new) · change_triggers with fail-closed
unknowns · review_by expiry machine-enforced · CLAUDE.md v2.0.1 (HG9×automerge reconciliation,
activation semantics, Lane-B 19-gate resolution) · scaled-content risk-basis correction.
**Pass-3 adoptions:** m1-bootstrap-runbook.md (controlled bootstrap procedure) · CODEOWNERS
extended to the doctrine surface (closes the workflow-guard circularity with defense in depth) ·
report auditability partially adopted (run/job ids + exact test command in the report).
**Refuted with evidence:** workflow-guard circularity (CODEOWNERS + base-branch
require_code_owner_reviews, platform-verified) · NABH/WHO-GMP third-party provenance
(D-EXTREVIEW-OWNER-FACTS) · sonar's baseline "data fault" (overlay adds ≠ scope_map — orthogonal
axes, documented in-file). **Scoped, not dropped:** required-context activation (owner action by
nature, bootstrap runbook step 3) · change_triggers execution wiring (M2 by plan §10, governed
by ACTIVATION SEMANTICS — never citable as a passed gate meanwhile).

## Scientific rationale

The disposition table IS the mechanism: it converts adversarial review into a monotone hardening
of the diff (adoptions add guards; refutations add recorded evidence) while keeping authority
where the owner put it. Pass-3 GPT's own verdict — four of eight pass-2 blockers "substantially
addressed in implementation" — is the external measure that the loop converges (RPT-20260719-M1
§3).

## Consequences

- The remaining gate after the passes is the owner's merge word on PR #167 (RPT §5), executed
  via the bootstrap runbook.
- M2-scoped adoptions (change_triggers wiring, job-spec generator, evidence-manifest validator)
  bind conduct now under ACTIVATION SEMANTICS and activate mechanically when the mechanisms land.
- Future doctrine merges inherit this pattern: dual pass on the actual diff + full disposition
  table in the milestone report.
