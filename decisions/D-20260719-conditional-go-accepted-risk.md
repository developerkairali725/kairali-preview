---
id: D-20260719-conditional-go-accepted-risk
type: gate
status: accepted
date: "2026-07-19 12:10:00 IST"
deciders: "Abilash (authority D-20260719-06) + agent"
expected_outcome: "The package's two escape hatches can never be used to route around a CI merge-block or a HARD/registry gate."
confidence: high
governs:
  - gates/
  - CLAUDE.md
sources:
  - ref: "docs/plans/2026-07-19-os-v2-architecture-merge-plan.md §7.1.3, §2.3"
    trust_tier: repo_artifact
    retrieved: "2026-07-19"
  - ref: "CLAUDE.md OS v2 DOCTRINE §2 (ISSUE STATE MACHINE — the landed doctrine text)"
    trust_tier: repo_artifact
    retrieved: "2026-07-19"
  - ref: "DIRECTIVES.md D-20260719-06 (owner authority)"
    trust_tier: owner_ruling
    retrieved: "2026-07-19"
---

# CONDITIONAL_GO never unblocks CI; ACCEPTED_RISK is owner-only and never applies to a gate

## Context

The package's issue lifecycle ships two escape hatches: CONDITIONAL_GO (proceed with conditions)
and ACCEPTED_RISK (ship with a known issue). Unconstrained, both are gate-bypass channels —
exactly the "looser than v1" language plan §0 subordinates. Record seeded at M2
(2026-07-19 19:25:00 IST).

## Drivers

- Rule g: a failing gate is never fixed by weakening it.
- v1's supremacy rule (D-20260719-package-superstructure): package hatches must not thin v1
  enforcement.
- Legitimate use case exists: some risks ARE owner-acceptable business calls — the hatch needs a
  constrained lane, not deletion.

## Options considered

1. Adopt both hatches as the package wrote them (rejected — an agent could label its own gate
   failure ACCEPTED_RISK).
2. Delete both statuses (rejected — loses a real vocabulary for owner-ruled risk acceptance and
   conditioned approvals).
3. **Constrain both: CONDITIONAL_GO never releases a CI merge-block (conditions become tracked
   issues); ACCEPTED_RISK is owner-only, requires a DECISIONS.md ruling + an expiry that
   auto-reopens the issue, and can NEVER apply to a HARD GATE or a registry gate** (taken).

## Outcome

Plan §2.3/§7.1.3; landed M1(a) as CLAUDE.md OS v2 DOCTRINE §2 (strict flips recorded in
CHANGELOG v2.0). The state machine keeps the package vocabulary; enforcement keeps v1 teeth.

## Scientific rationale

Escape hatches without authority binding are how gate systems decay: the agent-side failure mode
is self-approval (TheAgentCompany and Replit both documented agents fabricating completion status
— plan §6), so any risk-acceptance channel must terminate at the owner, on the record, with an
expiry that forces re-examination rather than permanent silence. Expiry auto-reopen mirrors the
strict-residues review_by mechanism (machine-enforced staleness, never silent dormancy).

## Consequences

- An ACCEPTED_RISK without a DECISIONS.md ruling id + expiry is invalid by construction.
- Conditions attached to any GO become tracked issues in the register (no verbal conditions).
- HARD GATES and registry gates have NO risk-acceptance path at all — fix or escalate.
