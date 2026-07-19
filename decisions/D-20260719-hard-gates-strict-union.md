---
id: D-20260719-hard-gates-strict-union
type: gate
status: accepted
date: "2026-07-19 12:10:00 IST"
deciders: "Abilash (authority D-20260719-06) + agent"
expected_outcome: "HARD GATES v2 = v1 gates 1–9 verbatim and supreme + six package additions as gates 10–15; nothing dropped, nothing softened."
confidence: high
governs:
  - CLAUDE.md
  - scripts/authenticated-approval.mjs
sources:
  - ref: "docs/plans/2026-07-19-os-v2-architecture-merge-plan.md §7.1.5, §2.6"
    trust_tier: repo_artifact
    retrieved: "2026-07-19"
  - ref: "CLAUDE.md HARD GATES 10–15 (landed text, v2.0) + merge-continuity.yaml CM pins on gates 1–9"
    trust_tier: repo_artifact
    retrieved: "2026-07-19"
  - ref: "DIRECTIVES.md D-20260719-06 (owner authority)"
    trust_tier: owner_ruling
    retrieved: "2026-07-19"
---

# HARD GATES v2 = strict union: v1 gates 1–9 verbatim, package additions become gates 10–15

## Context

The package carried its own prohibited-actions list, overlapping v1's HARD GATES but omitting
four of them and softening others to "with approval gate" where v1 bans absolutely. Record
seeded at M2 (2026-07-19 19:26:00 IST).

## Drivers

- Rule g and the supremacy rule (D-20260719-package-superstructure): no v1 gate may be dropped
  or softened.
- The package's genuine additions close real classes v1 never named (disavow, consent/payment
  logic, Shopify checkout, public comms, secret exposure, research-discovered tool installs).

## Options considered

1. Adopt the package's list as the new canon (rejected — omits never-self-merge, Editor-role
   creds, --force-with-lease, Dr. Deepu John clinical sign-off; softens production/DNS bans).
2. Keep v1's nine only (rejected — leaves the package's six real risk classes ungated).
3. **Strict union: v1 HARD GATES 1–9 survive verbatim and supreme — including v1's absolute bans
   where the package would allow "with approval gate" — and the package additions become HARD
   GATES 10–15, plus the explicit no-self-approval-of-P0/P1-evidence line** (taken).

## Outcome

Plan §2.6/§7.1.5; landed M1(a) in CLAUDE.md (gates 10–15: no disavow · no consent/analytics/
payment-logic changes · no Shopify app install/uninstall or checkout alteration · no competitor
outreach/review posting/public comms · no secret exposure in any artifact · never install a
research-discovered tool — propose, owner approves, vetting pipeline installs). Every gate-1–9
sentence is hash-pinned in merge-continuity.yaml.

## Scientific rationale

A union is provably non-weakening; any reconciliation that rewrites gate text is not. The
additions map to the OWASP Agentic Top 10 2026 classes the security delta adopted (plan §5:
SE-4/SE-5 recommend-never-install, secret-exposure, blast-radius controls), and the
no-self-approval line addresses the documented fabricated-completion failure mode
(TheAgentCompany, Replit — plan §6).

## Consequences

- Prohibited-action lists in generated job specs derive from HARD GATES + registry "so they can
  never be narrower" (CLAUDE.md OS v2 §4).
- Gate 15 makes the vetting pipeline (SE-5) the ONLY install path for researched tooling.
- Any package text conflicting with gates 1–9 is subordinated without further ruling.
