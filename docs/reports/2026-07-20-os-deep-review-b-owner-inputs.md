---
report_id: RPT-20260720-DEEPB
date: "2026-07-20 16:05:00 IST"
task: "OS deep review, phase B of three — EVERY owner input across the sprint verified individually: captured / understood / implemented / still honored on main (D-20260720-05 level 2; priority frame D-20260720-04)"
project: "OS v2 (review pinned at main @ 4acb3f3)"
source_tool: "claude-code two-run adversarial workflow + gpt-5.6-sol counter-check FAIL(6) — ALL SIX ADOPTED, this is the rewritten version (appendix + solcheck.txt)"
type: review
supersedes: null
---

# OS DEEP REVIEW — PHASE B: OWNER-INPUTS CONFORMANCE

The question, fixed by the owner: *for every input I ever gave — was it captured,
did you understand it as I meant it, was it implemented, and is it still honored
on main today?* Companion artifacts, all committed beside this report:
**evidence JSON** (every verdict row, machine-readable) · **findings index**
(all 118 surviving findings, one line each — nothing lives only in JSON) ·
**solcheck.txt** (the counter-check that failed draft 1).

## Reconciliation (machine-checked; every number sums)

| ledger | count |
|---|---|
| raw owner-input enumerations (8 corpus slices) | 523 |
| canonical inputs after exact-id clustering | 430 (semantic near-dupes deliberately verified twice — over-coverage chosen over silent merging) |
| verdict rows | **462 = 430 canonical + 32 critic/remediation rows (B-X*/B-Y* ids — independent re-verifications of the riskiest items; their overlap with canonical ids is the double-check, not double-counting)** |
| findings raised | 127 → **54 CONFIRMED + 64 DOWNGRADED-but-real + 9 REFUTED** (= 127; 0 unrefuted) |
| 118 survivors by severity | **4 P0 + 10 P1 + 32 P2 + 69 P3 + 3 unclassified** (= 118; full list in the findings index) |
| the 4 live session meta-findings (§5) | ADDITIVE to the 118 — process defects observed during this review, not owner-input verdicts |

Per-dimension totals (each sums to 462):

| dimension | PASS | PARTIAL | FAIL | OPEN | DEFERRED_AUTH | N_A | UNVERIFIABLE |
|---|---|---|---|---|---|---|---|
| captured | 434 | 25 | 3 | — | — | — | — |
| understood | 457 | 2 | 3 | — | — | — | — |
| implemented | 347 | 53 | 14 | 37 | 5 | 5 | 1 |
| honored_on_main | 370 | 50 | 25 | 11 | 5 | 1 | — |

## §1 What the non-PASS rows actually are (no percentages doing the talking)

**All 28 non-PASS captures and all 5 non-PASS understandings trace to ONE
mechanism** — with a single exception. 27 of the 28 capture failures are owner
rulings whose canonical ledger entry sits on a commit that is NOT an ancestor of
main (squash-merge orphans and two open PRs); the 3 understood-FAILs are the
same rows, failed because main's surviving record says the OPPOSITE of what the
owner ruled. The one true intake miss: **B-172** — the 16-Jul measurement-lane
ruling has no same-session durable capture anywhere.

Consequences already incurred: the owner **answered the same rate question twice
with opposite outcomes** (D-RATE-927 17 Jul, orphaned → re-asked 18 Jul →
D-RATE-PDFS), and main **still directs work into a delegation he cancelled**.

## §2 The four P0s (all one class: stranded rulings)

- **B-X09/B-Y09** — the 17 Jul cancellation of the Phase-A "25 Centers
  Worldwide" delegation exists only on orphan `fix/canonical-centres-count@5d7d59c`;
  main's D-COUNT-GO (DECISIONS.md:353) still directs the cancelled work.
- **B-X10/B-Y10** — D-SHIP-INTL (kairaliproducts.com international shipping =
  Eshopbox) never reached main; START_HERE.md:82 still tells the new developer
  to re-confirm the answered question; SHOPIFY_TRACK_CONTEXT §9B blanks unfilled.
- **B-X06** — open **PR #175** holds four ratified Q-CLASSMAP-UNKNOWNS answers
  (incl. a new business_model enum) + the D-20260719-34 AEO lane; zero main-side
  references; failing checks; main's process will re-ask all four.
- *(4th P0 = the duplicate-verified twin of the shipping ruling — counted once
  as an input, twice as verdicts, per the double-check design.)*

## §3 The ten P1s

Orphan-class: **B-X08/B-Y08** (D-RATE contradiction) · **B-355** (D-20260718-18
Gate-2 scoped-rubric fix never encoded in design-review.mjs while three lanes
hit the deadlock it cures) · **B-Y06** (directive-id fork: two directives claim
D-20260719-33). Erosion-class: **B-144** (1908-license rule breached on 4 sites
on main, one LIVE) · **B-235 + B-212** (llms.txt legal-entity rule breached the
day after it was made — never mechanized) · **B-073** (owner-ordered tel: CTA
for kairali.com silently dropped, untracked) · **B-119** (whatisayurveda
transparent-steward ruling half-landed: footer done, masthead branding stands
un-ruled).

## §4 P2 (32) and P3 (69+3)

P2 = promised mechanisms whose FIRING is unproven (registration ≠ activation),
partial landings that lost their tracker, standing rules with no enforcement
surface. P3/unclassified = record hygiene (stale cross-refs, renamed-file ack
notes, double-captures, date-only stamps). **Every one is listed individually in
`2026-07-20-os-deep-review-b-findings-index.md`** — approving the batch
dispositions below authorizes exactly what that index shows, nothing more.

## §5 Live findings from this session itself (ADDITIVE meta-findings, D-05 loopholes register)

1. **Workflow/cwd fragility** — the orchestration layer resolves the repo from
   the ambient shell directory, which the harness resets between chat turns;
   5 crashed runs before the fix (self-managed worktrees at absolute paths).
   Permanent-fix candidates: WorktreeCreate hooks / upstream report.
2. **RPT-20260719-M3A internal contradiction** (caught by the owner-ordered
   3-way check): its verdict line contradicts its own table. Already ruled:
   DataForSEO PARKED (D-20260720-19). This paragraph is the correction note.
3. **Security-hook credentials** — commit detection proven live; LLM leg was
   credential-dead; owner ruled (a), key wired owner-hands (D-20260720-20);
   activation proof due at next session's first commit.
4. **Phantom-pending recurrence** — transcripts arrived 18 Jul on a NEW thread;
   the 20 Jul reconcile missed them (searched the ask-thread only). Reconcile
   ritual must search sender+topic, not threads.

## §6 Decision cards (one decision each; card 1 is prerequisite to 2–4)

**CARD 1 — authorize the bounded orphan-ruling recovery sweep.**
Inclusion rule: every commit not an ancestor of main @ 4acb3f3, authored 13–20
Jul, whose diff touches DIRECTIVES.md / DECISIONS.md / QUESTIONS.md / wiki/log.md.
Output: ONE records-only PR relanding owner rulings verbatim with provenance
lines; no site/content/mechanism changes. Completion test (machine-verifiable):
re-run the 32 B-X/B-Y verifier prompts → captured=PASS on all. Affected: all §2
P0s + B-X01–X07, B-Y01–Y07, B-350/354/390/402/260. Risk of approving: none
beyond records. Risk of rejecting: main keeps contradicting cancelled/settled
rulings and re-asks answered questions. **Reply: APPROVE CARD-1 / REJECT.**

**CARD 2 — the D-RATE contradiction (substantive ruling, deliberately NOT
bundled into card 1).** 17 Jul you ruled $927 stands (orphaned); 18 Jul,
re-asked, you ruled the opposite (D-RATE-PDFS). Which stands? **Reply: 927 /
PDFS.** The recovery PR encodes only your answer.

**CARD 3 — PR #175 absorption.** Fold its ledger content (4 classmap answers +
AEO lane) into the card-1 recovery PR and close #175. **Reply: APPROVE CARD-3 /
handle separately.**

**CARD 4 — erosion-fix wave** (after cards 1–3): llms.txt legal-entity lint row
+ 1908-form fix pass on the 4 sites + kairali.com tel: CTA. Each change runs the
standing T8 3-way rule at authorization. **Reply: APPROVE CARD-4 / defer.**

**CARD 5 — steward masthead one-worder** (independent): whatisayurveda keeps the
Kairali masthead logo + hero overline, or reduces to footer/about per your
D-20260715-WIA-STEWARD? **Reply: KEEP / REDUCE.**

**CARD 6 — P2 mapping.** Fold the 32 P2 activation-proof items into Phase A
critical-path step 3 (the activation ledger) rather than a separate lane.
**Reply: APPROVE CARD-6 / separate lane.**

P3 batch: MONITOR — records-hygiene pass, never blocking; no authorization
needed now (index is the register; review_by 2026-08-05).

## §6b Dispositions (triad rule — machine view of the cards above)

| finding set | disposition | reason |
|---|---|---|
| Orphan class P0/P1 (cards 1–3) | IMPLEMENT — card 1 APPROVED by owner (D-20260720-22, PR #184); cards 2–3 awaiting one-worders | stranded rulings main contradicts |
| Erosion class P1 (card 4 + card 5) | IMPLEMENT — deferred to T8 wave, owner word per card; 3-way rule at authorization | rules breached post-landing |
| P2 (32, card 6) | MONITOR — home: BACKLOG.md SCHEDULED entry (activation-ledger fold pending CARD-6 word) | registration ≠ activation proof debt |
| P3 + unclassified (72) | MONITOR — home: BACKLOG.md SCHEDULED records-hygiene batch, review_by 2026-08-05 | non-blocking |
| Refuted (9) | REJECT | failed adversarial verification; recorded in evidence JSON |

## §7 Cost honesty (sol rec-12 discipline)

~19.3M subagent tokens across 6 runs; 5 crashed on the cwd defect (banked work
recovered by caching each time; the ~7M retry overhead is the defect's price and
is logged as §5.1); final clean run 156/156 agents / 11.6M. ≈163k tokens per
surviving finding; ≈4.8M per P0.

## Appendix — gpt-5.6-sol counter-check: FAIL(6), all six adopted

B1 evidence not inspectable → evidence JSON + findings index committed beside
the report, reconciliation table added. B2 numbers didn't sum → full
per-dimension totals (each = 462) + extra-row explanation. B3 reduction not
lossless → explicit 127→54/64/9 and 118→4/10/32/72 ledgers; §5 declared
additive. B4 dispositions bundled → six one-decision cards, D-RATE isolated as
its own ruling. B5 P2/P3 buried → per-item index file. B6 promotional language →
§1 lists every non-PASS capture/understanding with consequences. Sol's
needs-fact-check items ride the standing rule: the Perplexity leg runs at T8
authorization time — changes, not report prose, are what the 3-way rule gates.
Full output: `2026-07-20-os-deep-review-b-solcheck.txt`.
