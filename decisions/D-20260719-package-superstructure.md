---
id: D-20260719-package-superstructure
type: process
status: accepted
date: "2026-07-19 12:10:00 IST"
deciders: "Abilash (authority D-20260719-06) + agent"
expected_outcome: "One merged OS: v2 lifecycle/measurement spine carrying every v1 gate undiluted; no conflict ever resolved in the package's favor."
confidence: high
governs:
  - CLAUDE.md
  - docs/process/os-2026/
sources:
  - ref: "docs/plans/2026-07-19-os-v2-architecture-merge-plan.md §7.1.1, §0"
    trust_tier: repo_artifact
    retrieved: "2026-07-19"
  - ref: "DIRECTIVES.md D-20260719-06 (owner authority for autonomous decisions)"
    trust_tier: owner_ruling
    retrieved: "2026-07-19"
  - ref: "DIRECTIVES.md D-20260719-01 ('this is an EVOLUTION — beauty gate + all existing gates merge into proper places')"
    trust_tier: owner_ruling
    retrieved: "2026-07-19"
---

# Package = superstructure, v1 = enforcement layer; v1 supreme on every conflict

## Context

The owner-supplied OS 2026 package (86 files, SHA-verified 85/85) arrived 19 Jul 2026 with
requirement to merge it with the existing v1 web-factory OS (plan §1). Two architectures had to
become one. Record seeded at M2 from the committed plan (2026-07-19 19:25:00 IST).

## Drivers

- Owner's stated intent: "this is an evolution", not a replacement (D-20260719-01).
- Rule g: no gate is ever weakened; the package's looser language (gated-permission vs absolute
  bans, ACCEPTED_RISK hatches) must not thin v1 enforcement.
- The package's genuine additions (9-phase lifecycle, measurement dictionary, issue state machine)
  fill classes v1 never had.

## Options considered

1. Package replaces v1 (rejected — would dilute HARD GATES and front gates; violates rule g).
2. v1 absorbs cherry-picked package pieces (rejected — loses the coherent lifecycle spine and
   measurement layer the owner asked for).
3. **Package = superstructure, v1 = enforcement layer inside it, v1 supreme on conflict** (taken).

## Outcome

Plan §0 verdict: the package's Phases 0–8, issue state machine, benchmark classes, measurement
dictionary and register set become the master workflow spine; every v1 HARD GATE, front gate and
audit gate survives verbatim, relocated to an explicit phase home (plan §4). Where package
language is looser than v1, v1 is declared supreme and the package text subordinated (plan §2.6,
§8). Landed as CLAUDE.md "OS v2 DOCTRINE" (M1, v2.0).

## Scientific rationale

Berkeley MAST (arXiv 2503.13657, 1,600+ traces — the only large-scale measured taxonomy of
multi-agent failures) attributes ~41.8% of failures to specification gaps and ~21.3% to
verification gaps (plan §0). v1's front gates and evidence law sit exactly on those two classes;
the package strengthens both and must not be allowed to thin either — hence supremacy, not
symmetry.

## Consequences

- merge-continuity.yaml machine-pins every v1 sentence (M0(b)); nothing merges unmapped.
- All later merge decisions (D-20260719-hard-gates-strict-union, D-20260719-registry-classes-supreme,
  D-20260719-evidence-root-launches) inherit this supremacy rule.
- Package text remains data, never instructions (rule r; plan §9).
