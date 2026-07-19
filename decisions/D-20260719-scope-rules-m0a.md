---
id: D-20260719-scope-rules-m0a
type: process
status: accepted
date: "2026-07-19 13:05:11 IST"
deciders: "Abilash (authority D-20260719-06) + agent"
expected_outcome: "A P2 change costs 1 owner touch and ~8 durable artifacts instead of 8–9 touches and ~16 artifacts, with no gate weakened."
confidence: high
governs:
  - gates/class-map.yaml
  - CLAUDE.md
sources:
  - ref: "docs/reports/2026-07-19-m0a-paper-dryrun.md §3 dispositions 1–3 (+ §2 walk, §4 numbers)"
    trust_tier: repo_artifact
    retrieved: "2026-07-19"
  - ref: "CLAUDE.md OS v2 DOCTRINE §1 SCOPE RULES (the landed doctrine lines, M1 v2.0)"
    trust_tier: repo_artifact
    retrieved: "2026-07-19"
  - ref: "DIRECTIVES.md D-20260719-06 (owner authority) + D-20260719-12 (M0 authorized to run)"
    trust_tier: owner_ruling
    retrieved: "2026-07-19"
---

# M0(a) scope rules: phase-gates bind per project engagement; Gate 1 at design-direction altitude; per-change gates = diff-relevant subset

## Context

M0(a) walked one representative hypothetical change (CH-1: KTAHV /consultation hero swap +
retitle, EN/DE/FR, P2) through every phase, gate and register of the merged OS on paper before
any code. The literal package reading priced that hero swap at ≈16 artifacts, 8–9 owner touches,
~40 min machine time (report §2 counterfactual). Dispositions 1–3 are the scope rulings that
delete the delta; promoted here as ONE record per the altitude law (D-20260719-adr-altitude) —
they are three faces of a single decision: WHERE obligations bind. Record seeded at M2
(2026-07-19 19:31:00 IST).

## Drivers

- Approval-fatigue research (200+/day → rubber-stamping, plan §2.1): 7 owner signatures per
  content change would make oversight worse, not better.
- Rule g: scoping must declare WHERE an obligation binds without weakening WHAT it obliges.
- Duplicate external-AI passes on the same rendered artifact (Gate 1 + Gate 2 + beauty +
  go-science) add cost without adding eyes.

## Options considered

1. Literal package reading — charter gate events, Gate 1, and the full battery fire per change
   (rejected — the measured counterfactual above; M0(a) exists to delete machinery that earns
   nothing).
2. Exempt changes from gates entirely (rejected — rule g; changes must still meet the
   diff-relevant battery).
3. **Three scope rules (dispositions 1–3): (i) phase-gate events bind PER PROJECT ENGAGEMENT
   (site build / rebuild / campaign), never per change — changes ride the issue state machine +
   diff-relevant gates; (ii) Gate 1 (design external AI review, pre-content) binds at
   design-DIRECTION altitude (new site, redesign, new LP template) — asset-level changes are
   judged by the Phase-5 battery, which sees the rendered page; (iii) `gates/class-map.yaml`
   gains a scope dimension project|change, the per-change gate set resolved by policy
   composition** (taken).

## Outcome

Report §3 rows 1–3, all IMPLEMENT; landed M1 as CLAUDE.md OS v2 DOCTRINE §1 "SCOPE RULES
(M0(a) dispositions 1–3)" + the class-map scope_map (M1(b)) + the Gate-1 altitude paragraph
under DESIGN EXTERNAL AI REVIEW. Result on the walk: 1 owner touch, 8 durable artifacts per P2
change (report §4) — identical owner load to v1 today.

## Scientific rationale

The dry-run is the evidence: a measured paper execution, not an estimate — owner touches, files
produced and duplicate data counted per phase (report §2 table), with the counterfactual priced
from the same walk. Not a weakening by construction: "no artifact class loses external-AI eyes;
the scope rules declare WHERE an obligation binds; none softens WHAT it obliges" (report §3
footer, carried verbatim into doctrine).

## Consequences

- Full battery stays per-site pre-launch + scheduled sweeps; changes get the linted
  diff-relevant subset.
- Dispositions 4–7 and 10–11 (job-spec generation, pointer-only logs, single-bundle evidence)
  ride M2 mechanisms; disposition 9 landed as the work-item boundary doc
  (D-20260719-work-item-boundary).
