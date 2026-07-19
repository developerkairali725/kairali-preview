---
id: D-20260719-benchmark-classes-7-8
type: process
status: accepted
date: "2026-07-19 12:10:00 IST"
deciders: "Abilash (authority D-20260719-06) + agent"
expected_outcome: "All 13 package benchmark rows keep a declared class; nothing is silently dropped."
confidence: high
governs:
  - docs/process/os-2026/
sources:
  - ref: "docs/plans/2026-07-19-os-v2-architecture-merge-plan.md §7.1.8, §2.4"
    trust_tier: repo_artifact
    retrieved: "2026-07-19"
  - ref: "DIRECTIVES.md D-20260719-06 (owner authority)"
    trust_tier: owner_ruling
    retrieved: "2026-07-19"
---

# Benchmark classes: PLATFORM and ACADEMIC declared as classes 7–8 rather than silently dropping BMK-012/013

## Context

The package's benchmark register declares six classes (HARD/OWN/PEER/INDUSTRY/ECONOMIC/
EXPERIMENTAL) but rows BMK-012/013 use two classes — PLATFORM and ACADEMIC — that its own class
list never declares (plan §2.4: "package's undeclared PLATFORM/ACADEMIC classes"). Record seeded
at M2 (2026-07-19 19:28:00 IST).

## Drivers

- Silent drops are the defect class the whole merge machinery exists to prevent.
- BMK-012/013 carry real benchmark content behaving unlike the six declared classes.

## Options considered

1. Drop BMK-012/013 as malformed (rejected — silent data loss; the rows carry real benchmarks).
2. Reclassify the two rows into existing classes (rejected — platform SLAs and academic study
   results genuinely behave differently from peer/industry numbers in validity and staleness).
3. **Declare PLATFORM and ACADEMIC as benchmark classes 7–8, keeping the rows intact** (taken).

## Outcome

Plan §7.1.8: the merged measurement layer (plan §2.4, adopted whole) runs eight declared
benchmark classes. BMK-012/013 keep their content under their now-legal classes.

## Scientific rationale

The same law as the gate registry: an absence (or an undeclared class) must be a decision with a
written reason, never a silence. Declaring the classes preserves the package's data while making
the class vocabulary complete and lintable — and the package's own QA errors (plan §1: two of
its self-attested counts were wrong) are exactly why declared-over-silent handling is the default
for every package inconsistency.

## Consequences

- Benchmark rows citing PLATFORM/ACADEMIC validate against the 8-class vocabulary.
- Future benchmark additions must name one of the eight declared classes.
- Target-validity fields and ESTIMATE labelling (HARD GATE 6) apply across all eight classes.
