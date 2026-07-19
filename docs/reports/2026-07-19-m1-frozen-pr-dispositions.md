---
report_id: RPT-20260719-M1-PRLEDGER
date: "2026-07-19 17:31:03 IST"
task: "Disposition the 11 frozen-ledger PRs against the OS v2 architecture (plan §10 M1 review line; BACKLOG design-freeze ledger 19 Jul)"
project: "OS v2 architecture merge (feature/os-v2-architecture, PR #167)"
source_tool: "gh pr view --json (read-only) + STATUS.yaml + BACKLOG.md freeze ledger + plan"
type: disposition
supersedes: null
---

# FROZEN-PR LEDGER — M1 DISPOSITIONS (recommendation table only)

**Scope:** the 11 PRs frozen by the 19 Jul design-freeze directive (BACKLOG ledger ~10:00 IST),
dispositioned against the v2 architecture per plan §10 ("the 11 PRs get dispositioned against the
new architecture in M1 review"). Every `gh pr view` call was READ-ONLY; no PR was merged, closed,
commented on, or relabelled. All 11 remain OPEN as of this report.

**Disposition enum:**
- **MERGE-CANDIDATE-NOW** — docs/gate-infra only, no site pages; safe under the freeze.
- **HOLD-UNTIL-M4-PILOT** — site work frozen by the design freeze; re-enters through the v2
  Phase 3/4 gates after the theblushlounge.com pilot (D-20260719-14) completes.
- **RE-BASELINE-AT-M2** — gate/process work partially superseded by v2; needs reconcile.
- **CLOSE-SUPERSEDED** — fully replaced; says by what.

## Disposition table

| PR | Branch · size | Disposition | Reason (one line) | Re-entry gate lane |
|---|---|---|---|---|
| [#130](https://github.com/kairali-digital/kairali-web-factory/pull/130) ayurvedafranchise.com full site | `feature/ayurvedafranchise-front-gates` · 141 files / +17,812 | **HOLD-UNTIL-M4-PILOT** | Full-site build (10 pages + golden fixes) is exactly the class the design freeze parks; pass-1 gate verdicts will be stale by re-entry. | Phase 3 exit (design_source + Gate 1 at design-direction altitude) → Phase 4 golden_page → full Phase 5 battery re-run |
| [#132](https://github.com/kairali-digital/kairali-web-factory/pull/132) kairalicenters.com rebrief | `feature/kairalicenters-rebrief` · 19 files / +1,753 | **HOLD-UNTIL-M4-PILOT** | Front-gate artifacts for a site with an undocumented shared-origin compromise; plan §7.1.12 makes it a candidate ONLY after compromise scope is documented, and the pilot is ruled theblushlounge.com (D-20260719-14), so this re-enters post-pilot at earliest. | Phase 0 charter (Gate 0) → Phase 1 baseline gate (compromise-scope doc + spam-URL screen precede the baseline register) |
| [#139](https://github.com/kairali-digital/kairali-web-factory/pull/139) fleet footer socials | `feature/fleet-footer-socials` · 40 files / +733 | **HOLD-UNTIL-M4-PILOT** | Fleet-wide site change already drifted (16-file conflict vs the newer `@kairali/chat` package); the verified one-file true-up data survives, the diff likely does not — rebase-or-recreate as a change-class item. | Issue state machine as a CHANGE (M0(a) disposition 3: diff-relevant gate subset), not the full battery |
| [#143](https://github.com/kairali-digital/kairali-web-factory/pull/143) sweep-rulings docs | `docs/sweep-rulings-cont` · 2 files / +19 | **MERGE-CANDIDATE-NOW** | Docs-only ruling capture (Villa Raag CTA + sessions rulings), zero site pages, no v2 conflict — freezing it only risks losing recorded rulings to drift. | None needed pre-merge; routine-PR auto-merge tier per D-AUTOMERGE-TIERS applies (owner merge word still governs, see standing law) |
| [#144](https://github.com/kairali-digital/kairali-web-factory/pull/144) abhilashkr.com publish | `feature/abhilashkr-publish` · 8 files / +82 | **HOLD-UNTIL-M4-PILOT** | Production domain cutover = DNS flip, forever-HUMAN under the HARD GATE; held on the owner's explicit publish word (BACKLOG `held-owner-golive`), which he can give at any time independent of the pilot — the hold here is the owner's, not the freeze's. | Phase 6 launch command centre (DNS human, owner go-live word) — no agent lane exists for this |
| [#145](https://github.com/kairali-digital/kairali-web-factory/pull/145) KTAHV 10 LPs front gates | `feature/ktahv-lp-front-gates` · 174 files / +40,430 | **HOLD-UNTIL-M4-PILOT** | Batch LP mining + BRIEF/STRATEGY/design-direction is parked site work; its batch design-direction artifacts happen to sit at exactly the Gate-1 altitude v2 rules (M0(a) disposition 2), so the mining survives re-entry well. | Phase 3 (fat strategy gate re-signed under v2 payload + Gate 1 design-direction) → Phase 4/5 per LP; KTAHV clinical register lock binds at Gate 0 |
| [#146](https://github.com/kairali-digital/kairali-web-factory/pull/146) design-review advisory lane | `feature/design-review-advisory-lane` · 6 files / +774 | **RE-BASELINE-AT-M2** | Gate-machinery change (advisory verdict lane, owner-confirmed facts as authority) partially superseded by v2's design-review Gates 1+2 relocation, Gate-1 altitude rule, and M1 authenticated approvals — the owner-facts-are-authority principle survives, the wiring must be reconciled. | Doctrine/evolution PR lane (authenticated owner approval required per D-20260719-10); reconcile rides M2 mechanisms |
| [#150](https://github.com/kairali-digital/kairali-web-factory/pull/150) session close 18 Jul + CLAUDE v1.13 | `docs/session-close-weekend` · 9 files / +174 | **RE-BASELINE-AT-M2** | Its STATUS/handover payload is long superseded by later state, but its ONE live payload — CLAUDE v1.13 documenting the already-flipped auto-merge repo settings (the BACKLOG "doc-vs-reality gap") — must be carried into M1's CLAUDE.md v2 (per D-20260719-10 automerge tiers), then the remainder closed as stale. | Doctrine PR lane (CLAUDE.md v2 at M1 absorbs the v1.13 text; merge-continuity lint proves carriage before the stale remainder is dropped) |
| [#157](https://github.com/kairali-digital/kairali-web-factory/pull/157) villaraag.com full site | `feature/villaraag-golden` · 168 files / +13,092 | **HOLD-UNTIL-M4-PILOT** | 14-page MODE-A full-site build is parked design work by definition; brand manual/tokens delivery (Villa Raag workstream) may also land meanwhile and change inputs. | Phase 3 exit (design_source MODE A re-confirm + Gate 1) → Phase 4 golden_page → Phase 5 battery re-run |
| [#163](https://github.com/kairali-digital/kairali-web-factory/pull/163) golden-gate battery 8/8 | `feature/golden-gate-battery` · 326 files / +26,924 | **HOLD-UNTIL-M4-PILOT** | Gate-run EVIDENCE for parked sites (all pass-1 FAIL with itemized fixes, awaiting the owner's per-site APPROVE/CHANGES); verdicts are perishable — each site re-runs the v2 Phase 5 battery at re-entry, with this PR's itemized fixes as the work list. | Owner APPROVE/CHANGES on the verdict table first; then per-site Phase 4 fixes → Phase 5 battery re-run under v2 registry (incl. new axe/ZAP/redirect rows) |
| [#164](https://github.com/kairali-digital/kairali-web-factory/pull/164) kairaliorganic.com full site | `feature/kairaliorganic-fullsite` · 132 files / +5,530 | **HOLD-UNTIL-M4-PILOT** | Nine-PDP full-site build (revenue-carrying, so high in the post-pilot queue per the revenue-opportunity-lost law) is still parked site work under the freeze. | Phase 3 exit gates → Phase 4 golden_page → Phase 5 battery; commerce-adjacent rows activate only if/when the Shopify lane touches it |

## Tally

- **MERGE-CANDIDATE-NOW: 1** (#143)
- **HOLD-UNTIL-M4-PILOT: 8** (#130 #132 #139 #144 #145 #157 #163 #164 — #144's hold is the
  owner's go-live word, releasable independent of the pilot)
- **RE-BASELINE-AT-M2: 2** (#146 #150)
- **CLOSE-SUPERSEDED: 0** — no PR is fully superseded yet; #150 becomes a close candidate only
  AFTER merge-continuity proves its v1.13 text is carried by CLAUDE.md v2.

Nothing in this table weakens the freeze or any gate (rule g): every HOLD keeps its branch +
preview intact per the BACKLOG ledger ("nothing lost"), and every re-entry lane is a v2 gate
lane, never a bypass.

## Standing law

**The MERGE WORD and the merge ORDER remain the owner's** — per the session protocol (explicit
PR merge order always, owner merge word always) and the asks cadence (D-20260719-12). This
report is a **recommendation table only**: no PR is merged, closed, commented on, or reordered
by it, and the single MERGE-CANDIDATE-NOW row is presented for the owner's word, not acted on.
