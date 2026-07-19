---
id: D-20260719-partner-strategy-enum
type: process
status: accepted
date: "2026-07-19 12:10:00 IST"
deciders: "Abilash (authority D-20260719-06) + agent"
expected_outcome: "The 7-way strategy enum stays complete; 'partner' gets its missing procedure text instead of being dropped."
confidence: medium
governs:
  - docs/process/os-2026/
sources:
  - ref: "docs/plans/2026-07-19-os-v2-architecture-merge-plan.md §7.1.9, §1"
    trust_tier: repo_artifact
    retrieved: "2026-07-19"
  - ref: "DIRECTIVES.md D-20260719-06 (owner authority)"
    trust_tier: owner_ruling
    retrieved: "2026-07-19"
---

# "Partner" stays in the 7-way strategy enum; its missing §5 procedure gets authored

## Context

The package's own QA report omits "partner" from its 7-way strategy set (plan §1 — one of the two
package self-attestation errors caught at ingest), and the §5 procedure text for the partner
strategy is missing from the package. Record seeded at M2 (2026-07-19 19:28:00 IST).

## Drivers

- The workflows themselves use the 7-way set; only the package's QA self-attestation disagrees.
- Kairali runs real partner audiences (KAPPL B2B — five named partner audiences in the beauty
  doctrine).
- A dangling enum value is a reference that binds to nothing (same defect class as the missing
  shared standards, plan §1).

## Options considered

1. Drop "partner" to match the package QA's 6-way count (rejected — the QA report is the wrong
   artifact; the workflows themselves use the 7-way set, and Kairali genuinely runs partner
   audiences — the beauty doctrine's KAPPL B2B chapters name five partner audiences).
2. Leave the enum value present but procedure-less (rejected — a dangling enum value is the same
   defect class as the missing shared standards: a reference that binds to nothing).
3. **Keep "partner" in the enum and author its missing §5 procedure (one paragraph)** (taken).

## Outcome

Plan §7.1.9. The enum stays 7-way; the authored paragraph rides the standards/procedure surface
(same authoring lane as the seven shared standards, plan §3.6).

## Scientific rationale

Package self-attestations were re-verified independently wherever they matter (plan §1) — this
row is the concrete case: the QA count contradicts the package's own workflow set, and
independent verification (not the self-attestation) is what the merged OS trusts. Confidence is
recorded medium because the authored procedure is new text awaiting its first real partner-lane
use to validate.

## Consequences

- Strategy classification for partner-model properties has a legal enum value and a procedure.
- The ingest-screen precedent stands: package counts are never trusted un-recomputed.
