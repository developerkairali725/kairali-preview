---
id: D-20260719-adr-altitude
type: process
status: accepted
date: "2026-07-19 12:20:00 IST"
deciders: "Abilash (authority D-20260719-06) + agent"
expected_outcome: "Every stakeholder-questionable choice has a retrievable record (R2) without drowning the store in keystroke-level noise."
confidence: high
governs:
  - decisions/
  - scripts/decisions-index.mjs
sources:
  - ref: "docs/plans/2026-07-19-os-v2-architecture-merge-plan.md §7.1.13 (amended per §12)"
    trust_tier: repo_artifact
    retrieved: "2026-07-19"
  - ref: "docs/plans/2026-07-19-os-v2-architecture-merge-plan.md §12 (pass-1 cut-list disposition: ADRs stay mandatory per the explicit R2 ask, at decision altitude; Decision Guardian KEPT)"
    trust_tier: external_verified
    retrieved: "2026-07-19"
  - ref: "DIRECTIVES.md D-20260719-03 (R2: scientific why for every font/color/keyword/sitemap choice, historically retrievable)"
    trust_tier: owner_ruling
    retrieved: "2026-07-19"
---

# ADR granularity bar: records at DECISION altitude, not keystroke altitude

## Context

External review pass 1 proposed cutting ADR mandatoriness as overhead; the owner's R2 ask
explicitly demands a citable why for every font/color/tagline/keyword/sitemap choice. The two
had to be reconciled without weakening R2. Record seeded at M2 (2026-07-19 19:30:00 IST). Date
reflects the §12 amendment pass (~12:20 IST, plan §12).

## Drivers

- R2 is an explicit owner ask — cutting it was never on the table.
- The reviewer's overhead concern is real at keystroke altitude (the M0(a) counterfactual).
- Retrieval, not ceremony, is the goal — records must stay findable and readable.

## Options considered

1. Adopt the reviewer's cut (rejected — directly contradicts the owner's explicit R2 ask).
2. One record per change/commit (rejected — keystroke-altitude records bury the retrievable
   whys under noise; the M0(a) walk showed a literal reading multiplies artifacts ~2x).
3. **Decision altitude: one record per design direction / token set / sitemap / keyword map /
   named tagline choice — anything a stakeholder might later ask "why?" — never one per trivial
   instance. Epistemic labels bind to decision-bearing claims, not every agent sentence; hash
   manifests bind to release-critical evidence bundles first. Decision Guardian KEPT (cheap,
   directly serves R2 retrieval)** (taken).

## Outcome

Plan §7.1.13; this store's README carries the altitude law as binding format law; the M0(a)
walk applied it live (one site-scoped ADR for a hero-swap change — report §2, ADR row).

## Scientific rationale

Retrievability is the goal, and retrievability degrades in both directions: too few records and
the why is lost; too many and it is buried. The altitude test ("would a stakeholder ask why?")
is the operational selector, and decision-journal practice (expected_outcome + confidence at
decision time — plan §3.2) is what beats hindsight bias when records are later reviewed.

## Consequences

- decisions/README.md encodes this law; the seed set itself follows it (e.g. M0(a) dispositions
  1–3 promoted as ONE scope-rules record, not three).
- Per-sentence epistemic labelling and universal hash-manifesting are explicitly NOT required at
  this altitude (labels on decision-bearing claims; manifests on release-critical bundles first).
