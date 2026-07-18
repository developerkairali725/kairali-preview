# kairaliequipment.com — GO-science self-check (golden page, build-time half)

- Recorded: 2026-07-18 20:16:30 IST · directive: **D-GO-SCIENCE-GATE / D-20260718-20** (owner, in-chat, 18 Jul 2026 — "What would Akshar say?") + owner addendum same evening (the self-check covers the **LOOK** too: psychological attractiveness to the MoA, ROI as the key metric).
- Framework source read BEFORE the page copy was written: `docs/marketing/go-science/knowledge/ay-science-knowledge.md` (MCB · MoA/Market 2.0 · NDFF · Educational 4-Phase + objection strips · ARC · SBJ · IRO/FE-BE · KIT/TYO · emotion/influence check · Marketing Kit Stage 1).
- Scope: the golden homepage only (`sites/kairaliequipment.com/app/page.tsx`) + its rendered screenshots (`screens/golden-page-desktop.png`, `-mobile.png`, `-mobile-viewport.png`). The formal audit gate is being built in parallel; this is the build-time half.

## 1 · Requirements considered → how the page conforms

| GO element | Where it lands on the page |
|---|---|
| **MoA / Market 2.0** (Step 6) — 4 avatar groups from BRIEF §2 | Hero lede names hospitals · resorts · spas · export markets; §Trade gives each avatar its OWN door (contract mfg / hotel-resort-spa / consultancy / distributors) — the Drug Boy lesson: enter THEIR world, speak spec-language to spec-driven procurement, capability+aesthetics language to developers. |
| **Educational 4-Phase** (Step 2 / §4) | Section order IS the phase order. P1 Real Problem: equipping a centre needs exact dimensions + honest materials ("Equipment for the treatment room, from the people who use it" + ruled spec ledgers). P2 Permanent Solution: own manufacturing + the family group that runs its own NABH-accredited hospital. P3 Proof: credentials carried from record (NABH AH-2024-0250, Green Leaf, 1908/1989 ledger, four generations). P4 Installation: the RFQ section. |
| **"Price never before Phase 3"** (AY golden rule #1) | Structurally guaranteed: NO price exists anywhere on the site (quote-first law, BRIEF §3). Price is revealed only inside the sales conversation — the strongest possible conformance. |
| **Objection strips** (Step 2) | RFQ "What happens next" block pre-answers: what do I get (specs, dimensions, quote) · when do I learn cost (quote stage) · what's my risk ("No obligation attaches to a quote") · who replies (the sales team at info@kairali.com). |
| **MCB / curiosity** (Step 1, §7 emotions) | H1 "The equipment beneath the treatment." is the curiosity hook; the **dimensioned engineering drawing** is the wow/TC candidate ("I've never seen an Ayurveda-equipment site show linework"). Secret-desire anchor: the buyer's wish to equip like the best hospital does — served by "we manufacture what our own physicians treat on". |
| **Ethical bribe → TYO/KIT** (Steps 1, 3, 11) | Catalogue (PDF) soft CTA = free high-value content lowering the entry barrier; RFQ is store-first (`@kairali/forms`), so every hand-raise lands in OUR database — the KIT asset. WhatsApp prefill identifies the site, so even chat leads are attributable. |
| **IRO / FE flavour** (Steps 4, 9) | The no-obligation quote is the current risk-free entry point; `data-cta` events (quote-open per category, trade-lane-click, catalogue-download) instrument the SBJ stages for ROI measurement. |
| **ARC** (§3) | A: family/heritage warmth (ledger, "from the people who use it"). R: spec-first language mirrors the procurement buyer's world. C: three channels (RFQ, email, WhatsApp) + chat bubble. |

## 2 · Changes made to conform

The framework document was read **before** the homepage copy was written (coordinator order arrived mid-build, pre-copy), so conformance was built in rather than retrofitted. Decisions attributable to the GO lens:

1. Section order arranged as the Educational 4-Phase (problem → solution → proof → installation) rather than a generic brochure order.
2. The RFQ objection-strip block ("What happens next… No obligation attaches to a quote") — added specifically as an objection strip + risk reversal.
3. Per-avatar trade-lane doors with `trade-lane-click` events (MoA-specific entry, SBJ instrumentation).
4. Catalogue framed as the ethical-bribe soft CTA (subordinate ghost pill), not a co-primary action.
5. `quote-request-submit` event wired on the RFQ submit (additive `submitCta` prop on `@kairali/forms`) so the money metric — qualified RFQs — is directly measurable (ROI lens).

## 3 · LOOK judgment (owner addendum) — rendered screenshots vs the MoA

Judged against `screens/golden-page-desktop.png` + `-mobile-viewport.png`:

- **Visual hierarchy:** ONE action colour (marigold) = one obvious next step at every scroll depth; the dark forge ground makes the page instantly distinguishable from every white-brochure competitor in this SERP — memorable to the resort-developer avatar who buys aesthetics. Hierarchy reads: identity → promise → action → proof.
- **Imagery psychology:** real brass/wood legacy photographs (honestly captioned) read as *material truth* to spec-driven procurement — the buyer sees the actual metal and grain, not stock gloss. The engineering drawing signals manufacturer-grade seriousness no competitor shows.
- **CTA psychology per awareness stage:** hot buyer → quote pill (header/hero/cards/sticky); chat-native → WhatsApp (hero + sticky, exactly twice); early-stage researcher → catalogue PDF + email microcopy. Matches SBJ stages 1–4 without a hard-sell tone.
- **Trust signals above the fold:** NABH id + Green Leaf chips, 1908/1989 ledger, four-generations overline — Reality (R) before any ask.
- **ROI lens:** the page's every path terminates in a database-captured, event-instrumented RFQ; no decorative dead ends.

## 4 · Honest residuals (for the formal audit gate)

1. **No literal MCB-formula headline** ("How to [secret desire] without [pain]"). The H1 is the design-gate-approved identity line (6 external review passes, owner-signed design_direction) — the MCB formula belongs to CMA/ads/LP copy layers, which do not exist yet. Flagged, not fixed: changing the H1 would breach the signed design gate.
2. **Phase-3 proof is credentials-only.** No case studies or testimonials exist in the record; fabricating them is forbidden (HARD GATE 6). Case-study capture is a real content dependency for full 4-Phase strength.
3. **No true Seller-C IRO.** A genuine risk-reversal entry offer (trial placement, results-based terms) is a business decision only the owner can make; the agent may not invent offers. The no-obligation quote is the honest current floor.
4. **Mobile first viewport carries three quote affordances** (header pill + hero pill + sticky bar) — the pass-6 GPT residual, waived by D-VETO-WAIVED-18JUL, and also a GO-lens finding (CTA crowding vs premium tone). Recorded as a standing advisory for the formal audit; the owner's waiver governs.
5. **KIT machinery is off-site.** The page captures the database; the 50–60 touchpoints/year system is a separate build.
