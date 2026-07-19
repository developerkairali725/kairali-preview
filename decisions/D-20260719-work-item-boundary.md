---
id: D-20260719-work-item-boundary
type: process
status: accepted
date: "2026-07-19 12:10:00 IST"
deciders: "Abilash (authority D-20260719-06) + agent"
expected_outcome: "One item, one home: issue register = work items, QUESTIONS.md = owner questions, BACKLOG.md = deferred polish, DIRECTIVES.md = owner rulings — cross-referenced by id, never duplicated."
confidence: high
governs:
  - QUESTIONS.md
  - BACKLOG.md
  - DIRECTIVES.md
  - docs/process/os-2026/merge/work-item-boundary.md
sources:
  - ref: "docs/plans/2026-07-19-os-v2-architecture-merge-plan.md §7.1.7"
    trust_tier: repo_artifact
    retrieved: "2026-07-19"
  - ref: "docs/reports/2026-07-19-m0a-paper-dryrun.md §3 disposition 9 (MONITOR: walk confirmed the boundary doc is needed)"
    trust_tier: repo_artifact
    retrieved: "2026-07-19"
  - ref: "docs/process/os-2026/merge/work-item-boundary.md (the landed boundary doc, M1(e))"
    trust_tier: repo_artifact
    retrieved: "2026-07-19"
  - ref: "DIRECTIVES.md D-20260719-06 (owner authority)"
    trust_tier: owner_ruling
    retrieved: "2026-07-19"
---

# QUESTIONS.md / DIRECTIVES.md keep their jobs; the issue register tracks work items only

## Context

The package's issue register could plausibly absorb owner questions, deferred polish and rulings
— three things v1 already tracks in dedicated, doctrine-bound files with their own capture
mechanics (directive-capture.mjs, unattended-rule QUESTIONS.md appends, POLISH TIME-BOX BACKLOG
entries). Record seeded at M2 (2026-07-19 19:27:00 IST).

## Drivers

- Three v1 files carry doctrine-bound mechanics that would break if absorbed.
- Work items genuinely lacked a state-machine spine (M0(a) walk).
- Duplicate homes fork state (M0(a) counted duplicate-data instances as a defect class).

## Options considered

1. Fold everything into the issue register (rejected — breaks directive capture, the unattended
   rule, and the polish time-box, all of which key off their files).
2. Skip the package register entirely (rejected — work items genuinely lacked a state-machine
   spine; the M0(a) walk showed a change "gets a spine that today lives in chat").
3. **Boundary: the issue register tracks WORK ITEMS only; QUESTIONS.md, BACKLOG.md and
   DIRECTIVES.md keep their existing jobs; items cross-reference by id** (taken).

## Outcome

Plan §7.1.7; the M0(a) walk confirmed the overlap risk (disposition 9, MONITOR) and the boundary
doc landed at M1(e): `docs/process/os-2026/merge/work-item-boundary.md`. Doctrine line in
CLAUDE.md OS v2 §2 ("One item, one home, cross-referenced by id").

## Scientific rationale

Duplicate homes for the same item are how state forks: the M0(a) dry-run counted duplicate-data
instances as a first-class defect class (4 found, all deleted before code — report §4). A single
home per item with id cross-references is the same normalization law the registers already
follow (dictionary holds definitions, registers hold values — disposition 13).

## Consequences

- An owner question never becomes an issue row (and vice versa) — it is referenced.
- Existing capture mechanics (directive-capture.mjs, boot.json unacked surfacing) continue
  unchanged.
- Boundary violations are findable by lint (same-text-two-homes grep class).
