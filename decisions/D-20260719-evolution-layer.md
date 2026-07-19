---
id: D-20260719-evolution-layer
type: infra
status: accepted
date: "2026-07-19 12:10:00 IST"
deciders: "Abilash (authority D-20260719-06) + agent"
expected_outcome: "The OS improves itself continuously (R1) without ever being able to weaken itself: quarantined scout, ringed adoption, owner-gated promotions."
confidence: high
governs:
  - evolution/
  - docs/process/os-2026/
sources:
  - ref: "docs/plans/2026-07-19-os-v2-architecture-merge-plan.md §7.1.11, §3.1"
    trust_tier: repo_artifact
    retrieved: "2026-07-19"
  - ref: "docs/plans/2026-07-19-os-v2-architecture-merge-plan.md §12 (pass-1 adopted findings: two-layer cadence; anti-pattern log reopening rule)"
    trust_tier: external_verified
    retrieved: "2026-07-19"
  - ref: "DIRECTIVES.md D-20260719-03 (R1: self-evolution layer, never diluting process)"
    trust_tier: owner_ruling
    retrieved: "2026-07-19"
---

# Evolution layer built exactly as plan §3.1: quarantined scout, radar rings, two-layer cadence, anti-pattern veto

## Context

Owner requirement R1: a self-evolution layer — pre-task best-of-today checks plus a per-task-domain
channel register — that never dilutes process. The design question was how much self-modification
to allow. Record seeded at M2 (2026-07-19 19:29:00 IST).

## Drivers

- R1's twin demands: stay current AND never dilute (D-20260719-03).
- Security: research-scout input is untrusted content (prompt-injection surface); forum
  consensus can be manufactured (GEO — plan §5 SE-3).
- Prior art: full self-modification loops (SICA/DGM-style) cost ~$7k/loop and amplify
  misalignment (plan §8 REJECTED).

## Options considered

1. Full self-modifying loop (rejected — plan §8: cost + misalignment amplification; the radar
   delivers the benefit at a fraction of the risk).
2. Manual/ad-hoc tool review (rejected — fails R1's "best of today" freshness demand and leaves
   staleness unmeasured).
3. **The §3.1 design: `evolution/radar.yaml` (ThoughtWorks-style rings with honest per-domain
   staleness) + `evolution/channels.yaml` (owner-approved, trust-tiered) + two-layer cadence
   (daily FEEDS on critical channels; local radar lookup per task; live search only on declared
   triggers) + ring promotions gated by candidate cards, sandboxed pilots scored by the existing
   audit harness, and owner sign-off + anti-pattern log with materially-changed reopening**
   (taken).

## Outcome

Plan §7.1.11 (register files are M2 mechanisms — strict residue `evolution/radar.yaml`,
review_by 2026-07-26). The scout is architecturally quarantined (SE-1): isolated no-side-effect
sessions, fixed data-only output schema, can never install, write doctrine, or touch client
context. Evolution PRs face a continuity lint that merge-blocks any touch on HARD GATES,
registry semantics, beauty/GO-science rubrics, or front gates.

## Scientific rationale

The one bound every surviving self-improving system keeps: the agent never modifies its own
evaluation criteria (plan §3.1). The two-layer cadence answers the pass-1 finding that
event-triggers cannot fire on weekly discovery (plan §12, adopted); ring promotion via measured
pilot-vs-incumbent scoring replaces vendor claims with evidence tiers ("vendor claims alone
never justify adoption" — plan §3.5).

## Consequences

- HARD GATE 15 (recommend-never-install) is the scout's hard boundary; SE-5 vetting is the only
  install path.
- Weak-signal domains (beauty, voice, go-science interpretation, clinical) ride the slow lane —
  clinical is frozen.
- Rejections are durable but reopenable when the world materially changes (anti-pattern log
  rule, §12 amendment).
