---
id: D-20260719-pilot-clean-predecessor
type: process
status: accepted
date: "2026-07-19 12:20:00 IST"
deciders: "Abilash (authority D-20260719-06) + agent; pilot NAMED by owner same day (D-20260719-14: theblushlounge.com)"
expected_outcome: "The M4 pilot exercises baseline gate + protection map + full battery end-to-end without coupling architecture validation to incident recovery."
confidence: high
governs:
  - launches/theblushlounge.com/
  - sites/theblushlounge.com/
  - launches/kairalicenters.com/
  - sites/kairalicenters.com/
sources:
  - ref: "docs/plans/2026-07-19-os-v2-architecture-merge-plan.md §7.1.12 (amended per §12)"
    trust_tier: repo_artifact
    retrieved: "2026-07-19"
  - ref: "docs/plans/2026-07-19-os-v2-architecture-merge-plan.md §12 (gpt-5.6-sol pass-1 finding: pilot on recently-hacked origin — ADOPTED in substance)"
    trust_tier: external_verified
    retrieved: "2026-07-19"
  - ref: "DIRECTIVES.md D-20260719-14 (owner ruling: theblushlounge.com is THE one M4 pilot site)"
    trust_tier: owner_ruling
    retrieved: "2026-07-19"
---

# Pilot-site criterion: a rebuild with a CLEAN live predecessor; owner named theblushlounge.com

## Context

M4 runs ONE site through the complete merged OS end-to-end. kairalicenters.com (rebrief parked
in PR #132) was the standing candidate, but its live predecessor sits on a compromised shared
origin. External review pass 1 flagged piloting on a recently-hacked origin. Record seeded at M2
(2026-07-19 19:30:00 IST). Date reflects the §12 amendment pass (~12:20 IST, plan §12).

## Drivers

- The pilot is the first end-to-end exercise of the merged OS — it validates architecture, and
  must not be confounded with incident recovery.
- The baseline gate's old-vs-new proof (R6) needs a clean predecessor URL population.
- External pass 1 flagged the hacked-origin candidate (plan §12, adopted in substance).

## Options considered

1. Pilot kairalicenters.com regardless (rejected as FIRST exercise — a hacked predecessor
   pollutes the baseline register with spam URLs and couples architecture validation to incident
   recovery; it stays a candidate only after its compromise scope is documented).
2. Pilot a greenfield site (rejected — would not exercise the baseline gate, protection map, or
   migration machinery at all).
3. **Criterion: a rebuild with a CLEAN live predecessor, exercising baseline gate + protection
   map + full battery end-to-end; shortlist to the owner for the one-word pick** (taken).

## Outcome

Plan §7.1.12 (amended). The owner ruled the same day: **theblushlounge.com is the pilot**
(D-20260719-14, plan §7.2 ask closed). No other design/build work before the pilot completes —
the freeze holds for everything else (plan §10 M4).

## Scientific rationale

A first end-to-end exercise must isolate the variable under test (the merged OS), not confound
it with incident recovery; and the baseline gate's registers are only meaningful over a clean
URL population — spam URLs in the predecessor make the old-vs-new proof feed (R6) unreadable.
The pass-1 auditor's nuance was kept honestly: the rebuild never reuses compromised code, but
baseline pollution and coupling are real (plan §12 disposition).

## Consequences

- M4 = theblushlounge.com through baseline → … → stabilize, every gate live, timed and costed.
- kairalicenters.com re-enters candidacy only with a documented compromise scope.
- Pilot findings feed doctrine before any second site.
