---
id: D-20260719-docx-excluded
type: process
status: accepted
date: "2026-07-19 12:10:00 IST"
deciders: "Abilash (authority D-20260719-06) + agent"
expected_outcome: "Doctrine has exactly one text per manual (the canonical .md); the DOCX renderings stay preserved but non-normative."
confidence: high
governs:
  - docs/process/os-2026/
sources:
  - ref: "docs/plans/2026-07-19-os-v2-architecture-merge-plan.md §7.1.10, §1, §9 (residual: DOCX parity spot-check)"
    trust_tier: repo_artifact
    retrieved: "2026-07-19"
  - ref: "DIRECTIVES.md D-20260719-06 (owner authority)"
    trust_tier: owner_ruling
    retrieved: "2026-07-19"
---

# DOCX specialist manuals excluded from doctrine as verified duplicates; the committed zip remains source-of-record

## Context

The package includes 11 specialist-manual DOCX files, verified at ingest as renderings of the
canonical .md sources (plan §1). Two texts for the same manual is a fork waiting to happen.
Record seeded at M2 (2026-07-19 19:29:00 IST).

## Drivers

- Two normative texts for one manual drift silently.
- The owner-supplied package must stay preserved intact as provenance (evidence law).

## Options considered

1. Adopt both formats as doctrine (rejected — duplicate normative texts drift; a reader citing
   the DOCX and a reader citing the .md can diverge silently).
2. Delete the DOCX files (rejected — the owner-supplied package is preserved intact as
   provenance; evidence law keeps sources immutable).
3. **Exclude the DOCX renderings from doctrine as verified duplicates; the committed source zip
   (SHA 046cba11, manifest 85/85) preserves them as source-of-record** (taken).

## Outcome

Plan §7.1.10. The canonical .md files are the only normative text; the zip in
`docs/process/os-2026/` is the immutable provenance layer.

## Scientific rationale

Same normalization law as the work-item boundary and the registers: one truth, one home,
everything else a pointer or a preserved rendering. The exclusion was made honest by
verification, not assumption — parity was spot-checked on the largest DOCX at ingest, with the
full text-diff riding the merge PR as the recorded residual (plan §9).

## Consequences

- Doctrine citations always point at .md paths, never .docx.
- The full DOCX/text-diff residual remains on the merge-PR record; any parity failure found
  there reopens this decision via a superseding record.
