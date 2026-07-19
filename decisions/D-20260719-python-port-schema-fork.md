---
id: D-20260719-python-port-schema-fork
type: infra
status: accepted
date: "2026-07-19 12:10:00 IST"
deciders: "Abilash (authority D-20260719-06) + agent"
expected_outcome: "One toolchain (Node .mjs) for every OS mechanism; package schemas live in-repo, versioned, admitting v1 fields."
confidence: high
governs:
  - scripts/evidence-manifest.mjs
  - docs/process/os-2026/
sources:
  - ref: "docs/plans/2026-07-19-os-v2-architecture-merge-plan.md §7.1.6"
    trust_tier: repo_artifact
    retrieved: "2026-07-19"
  - ref: "docs/plans/2026-07-19-os-v2-architecture-merge-plan.md §1 (package contents: 2 benign stdlib-only Python utilities, 3 JSON Schemas)"
    trust_tier: repo_artifact
    retrieved: "2026-07-19"
  - ref: "DIRECTIVES.md D-20260719-06 (owner authority)"
    trust_tier: owner_ruling
    retrieved: "2026-07-19"
---

# Package Python utilities ported to .mjs; package JSON Schemas forked into the repo

## Context

The package ships two stdlib-only Python utilities (statically verified benign — plan §9) and
three JSON Schemas with `additionalProperties` constraints that would reject v1's extra fields.
The repo's entire mechanism layer is dependency-free Node `.mjs` (scripts/*.mjs, node --test).
Record seeded at M2 (2026-07-19 19:27:00 IST).

## Drivers

- Toolchain uniformity: every existing OS mechanism is dependency-free `.mjs` under `node --test`.
- The shipped Python script omits fields the §4 evidence spec requires — a port must extend, not
  just translate.
- Schemas must admit v1 fields without upstream-drift blindness.

## Options considered

1. Run the Python utilities as-is (rejected — introduces a second runtime into a uniformly
   Node-tooled repo; two toolchains = two maintenance surfaces).
2. Use the package schemas by reference, unmodified (rejected — `additionalProperties: false`
   would reject legitimate v1 fields; upstream drift would be invisible).
3. **Port the Python utilities to `.mjs` (repo toolchain uniformity — evidence-manifest.mjs is
   the port target, extended with the §4 fields the shipped script omits); fork the schemas into
   the repo, relax `additionalProperties` to admit v1 fields, and version each fork by its own
   decision record** (taken).

## Outcome

Plan §7.1.6 (port mechanism scheduled M2 per §10: `scripts/evidence-manifest.mjs` + CI
validator). The original package files remain untouched in `docs/process/os-2026/` as the
committed source-of-record layer (immutable, read-only — same law as content-mined/).

## Scientific rationale

Toolchain uniformity is a verified house rule, not a preference: every existing gate mechanism
(gate-registry-lint, merge-continuity-lint, front-gate) is dependency-free `.mjs` tested under
`node --test`, so a port inherits the test harness, the CI discovery command, and the
control-probe convention for free. Forking schemas (rather than referencing) keeps validation
hermetic and in-repo — the same reasoning as the evidence law's "if it isn't in the repo, it
didn't happen".

## Consequences

- `scripts/evidence-manifest.mjs` (M2) is the port; parity with the Python original is part of
  its test surface.
- Each forked schema's future changes ride their own decision record (versioned provenance).
- No Python runtime becomes a repo dependency.
