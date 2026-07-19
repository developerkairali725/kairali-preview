# CANDIDATE CARD — <tool/skill/practice name> (TEMPLATE)

<!--
evolution/candidate-card.md — the RING-PROMOTION template (merge plan §3.1).
A copy of this file, filled, is the REQUIRED artifact for every assess→trial
promotion on evolution/radar.yaml; trial→adopt additionally needs owner
sign-off + one supervised real use. HARD GATE 15: the agent PROPOSES with this
card, the owner approves, the vetting pipeline (SE-4/SE-5) installs — the
agent never installs anything discovered through research, ever.
Filled cards live at evolution/candidates/<date>-<slug>.md (append-only;
a revised proposal is a NEW card that links its predecessor).
-->

- **Card id:** CAND-<YYYYMMDD>-<slug>
- **Date:** <YYYY-MM-DD HH:MM:SS IST>
- **Radar row (step):** <exact `step` from evolution/radar.yaml>
- **Proposed ring change:** <e.g. assess → trial>
- **Source channel(s):** <ids from evolution/channels.yaml — an unregistered source may not seed a card>
- **Anti-pattern check:** <NONE MATCHED, or the matched evolution/anti-patterns.yaml signature — if matched, the original rejection MUST be surfaced below and answered point by point; an exact duplicate inside its review_by window stops here>

## 1. What it replaces

<The incumbent tool/practice on the radar row, exactly as the row states it — and what happens to the incumbent if the candidate wins (retired / demoted to fallback / kept parallel).>

## 2. Expected measurable gain

<Numbers, not adjectives. Which metric the EXISTING audit harness already measures moves, by how much, measured how. "Better DX" is not a gain; "full-battery runtime 28 min → ≤20 min on the same three sites" is.>

## 3. Rollback

<The exact path back if the pilot or adoption fails: what gets reverted, what data/evidence must survive the rollback, who executes it, how long it takes. A candidate with no rollback is a hold, not a trial.>

## 4. HARD-GATE conflict check

<Walk CLAUDE.md HARD GATES 1–15 + the registry gates the candidate touches. Any conflict = STOP: gates are never weakened for a tool (rule g). State explicitly: does it write to production surfaces? touch credentials? install anything (HARD GATE 15 → SE-4/SE-5 vetting: registry existence/age, version pin + integrity hash, no auto-update, MCP tool-description TOFU hash-pinning)? alter checkout/consent/analytics/payment logic?>

## 5. Evidence tier

<measured / vendor / anecdote — per claim, not per card. VENDOR CLAIMS ALONE NEVER JUSTIFY ADOPTION (plan §3.5 doctrine): a card whose gain rests only on vendor-tier evidence may propose a PILOT to produce measured evidence, never an adoption. Anecdote-tier (forum) claims additionally need the SE-3 tier-1 corroboration recorded here, with URLs.>

## 6. Sandbox-pilot plan

<Scored by the EXISTING audit harness vs the incumbent baseline — never by a harness the candidate brings along (the agent never modifies its own evaluation criteria, plan §3.1). Declare: sandbox scope (isolated, no client context, no side effects — SE-1 discipline), the baseline run of the incumbent, the identical run of the candidate, the scoring gates/scripts by name, the pass bar, cost budget for the pilot, and the review date the pilot result lands by.>

## 7. Owner decision

- **Decision:** <PENDING / APPROVED — trial / REJECTED>
- **His word, verbatim + where:** <chat/PR quote, date-time IST>
- **If REJECTED:** append the row to evolution/anti-patterns.yaml (signature, reason, rejected_date, review_by, reopen_conditions) in the same session.
