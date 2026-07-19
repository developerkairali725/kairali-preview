---
id: D-20260719-registry-classes-supreme
type: gate
status: accepted
date: "2026-07-19 12:10:00 IST"
deciders: "Abilash (authority D-20260719-06) + agent"
expected_outcome: "Every dimension combination a real Kairali property uses resolves to an unambiguous, linted gate set; the selector never silently drives anything."
confidence: high
governs:
  - gates/
  - scripts/class-map-lint.mjs
  - scripts/gate-registry-lint.mjs
sources:
  - ref: "docs/plans/2026-07-19-os-v2-architecture-merge-plan.md §7.1.2, §2.2"
    trust_tier: repo_artifact
    retrieved: "2026-07-19"
  - ref: "docs/plans/2026-07-19-os-v2-architecture-merge-plan.md §12 (gpt-5.6-sol pass-1 blocking finding: class-only applicability can miss B2B/D2C/migration/entity controls)"
    trust_tier: external_verified
    retrieved: "2026-07-19"
  - ref: "DIRECTIVES.md D-20260719-06 (owner authority)"
    trust_tier: owner_ruling
    retrieved: "2026-07-19"
---

# Registry classes stay supreme; selector is a policy-composition overlay via gates/class-map.yaml

## Context

The package brought a 24-workflow selector ({B2C,B2B,D2C,Shopify} × asset situations); v1 had one
gate registry with three lint-enforced site classes (commerce / organic / landing). The two
applicability models had to be reconciled. Record seeded at M2 (2026-07-19 19:25:00 IST).

## Drivers

- The registry's "every gate carries an explicit entry for ALL classes" no-miss guarantee must
  survive (CLAUDE.md GATE REGISTRY; rule g).
- External review pass 1 showed class-only applicability can miss business-model / asset-situation /
  entity / locale / platform controls (plan §12, adopted finding).
- A selector that silently decides which gates apply is an invisible decision-maker.

## Options considered

1. Replace the three classes with the package's 24-workflow matrix (rejected — breaks the
   registry's lint guarantee and every existing gate binding).
2. Ignore the extra dimensions (rejected — the pass-1 finding is real: B2B/migration/entity
   controls would go unmapped).
3. **Policy composition: classes stay the primary, supreme dimension; `gates/class-map.yaml`
   adds declared dimensions (business model, asset situation, entity register, locale/market,
   platform, and — per M0(a) disposition 3 — scope project|change); a gate row may bind to any
   combination; the lint proves every real combination resolves unambiguously** (taken).

## Outcome

Plan §2.2 (amended per §12). Landed M1(b): `gates/class-map.yaml` (32 properties, 5 overlays,
project|change scope_map, 24 package workflows as test vectors) + `scripts/class-map-lint.mjs`
(never-weakens structural check). The selector drives gates ONLY through declared, linted rows.

## Scientific rationale

Composition over replacement preserves the registry's constructive no-miss property (a missing
class entry fails CI — an absence is always a decision, never a silence) while adding the
dimensions the external reviewer proved necessary. The 24 package workflows serve as fixed test
vectors, so the reconciliation is machine-checked rather than asserted (same law as
merge-continuity: manual assertion was pass-1's first blocking finding).

## Consequences

- New applicability dimensions land by editing class-map rows (linted), never by forking
  checklists.
- Unknown dimension vectors fail closed → Q-CLASSMAP-UNKNOWNS (owner one-worder, non-blocking).
- The registry's three classes remain the supremacy anchor on any conflict (plan §2.2).
