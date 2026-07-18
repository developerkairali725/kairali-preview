# kairaliequipment.com — Gate-1 pass 4: OWNER-FIXED RULINGS (binding context for both auditors)

- Recorded: 2026-07-18 19:12:30 IST · coordinator-fixed per the owner's option-(c) choice on Q-EQ-DESIGN-GATE (QUESTIONS.md 2026-07-18 18:49:33 IST) after passes 1–3.
- These rulings are the OWNER's decisions. They are not up for re-litigation by this review; the review judges the design WITHIN them. A finding that contradicts a ruling below is noted as out-of-scope, not a defect.

## 1 · WhatsApp count — FIXED (owner option-c ruling, this pass's reason for existing)

WhatsApp appears **EXACTLY TWICE** in the design system:
1. ONE primary CTA in the hero ("WhatsApp us" pill) — present on both viewports.
2. ONE entry in the **sticky MOBILE utility bar** (the pattern the kairalicenters lane landed: utility chrome pinned to the screen bottom; mobile only, hidden on desktop).

The **header carries NONE**. Desktop therefore shows WhatsApp once (hero); mobile shows it twice (hero + utility bar). Pass 2's "add to header + hero + sticky" and pass 3's "redundant" are both superseded by this fixed count.

- The kairalicenters utility-bar pattern pairs Call + WhatsApp; the **Call slot activates only when a verified equipment phone number exists** — the live site's +91-9555156156 is NOT in LOCKED FACTS and is never printed (HARD GATE 6). Until then the bar pairs the quote CTA + WhatsApp.
- **Screenshot artifact note:** in FULL-PAGE captures, `position:fixed` chrome renders at the FIRST-VIEWPORT bottom and can appear "inline" mid-page (pass 3 misread this as an extra inline WhatsApp button near the category chips). The additional mobile-VIEWPORT image (`design-direction-hero-mobile-viewport.png`) shows the true placement: pinned to the screen bottom.

## 2 · D-EQ-CATALOG (owner ruling, DECISIONS.md 2026-07-18 17:46:09 IST)

No real product data exists yet. The build ships the FULL catalog structure with UNMISTAKABLE placeholders — prices as "₹X,XXX / $X,XXX", SKU IDs as "SKU-PLACEHOLDER-0NN", placeholder imagery clearly labelled — and the site is **PREVIEW-ONLY until real data replaces every placeholder** (a lint blocks the DNS flip). Placeholder presence is BY OWNER ORDER and is not a defect; only placeholder data masquerading as real would be.

## 3 · D-EQ-CLAIMS (same DECISIONS block)

The live site's certification / export / own-manufacturing / heritage claims are carried **AS-IS** on the owner's instruction (brother-confirmed trust basis). The design renders them at the granularity the record supports; badge chips are text until official artwork lands (§5).

## 4 · Heritage wording — FLAG-3 / D-LIN-1989-WORDING (owner-ruled 17 Jul, docs/group-inputs/kairali-lineage.md)

Canonical, owner-ruled forms — the design implements exactly these:
- **"Founded in 1989"** is the canonical group founding (ledger: "1989 · Group founded").
- **1908 is FAMILY LINEAGE only**: "A family practising Ayurveda since 1908" (header lockup sub-line; ledger "1908 · Family lineage"). Never "est. 1908" / corporate "since 1908".
- "Four generations of Ayurveda" is supported by the canonical lineage document §0b (Dr. Sankunny Vaidiar → Dr. K.S. Vasudevan → K.V. Ramesh & Gita Ramesh → K.R. Abhilash / K.R. Abishek).

## 5 · Assets that DO NOT EXIST yet (HARD GATE 6 — fabricating them is forbidden)

- **Commissioned product photography does not exist.** It is a flagged build dependency (niche brief §6-D1). Stock photos and AI-generated "premium" product/CGI imagery are BANNED by fleet law (no stock, no fake photos). The **dimensioned technical drawing** (real mined 8.5 ft × 3 ft / 3 in spec as engineering linework) is the honest interim hero asset, with the real legacy catalogue photograph demoted to a captioned reference thumbnail.
- **Official NABH / Green Leaf mark artwork files are not in hand.** The FACTS are verified (NABH AH-2024-0250 — portal.nabh.co accredited list; Green Leaf — Govt. of Kerala), so the design carries them as text badge chips scoped "— group"; official artwork swaps in when the files land. Demanding logo artwork now = demanding fabrication.

## 6 · Copy removed in pass 3 (do not re-flag)

- "authentic Ayurveda treatment" is **ABSENT** from this design (H1 is "The equipment beneath the treatment."). Pass 3's Perplexity critique flagged "continued use" of this phrase; it does not appear in any pass-4 image.
- The equipment-identity implication ("we treat on what we sell") was reworded in pass 3 to the documented group-affiliation claim: "built in our own facility by the Kairali Ayurvedic Group, the family group behind the NABH-accredited Kairali — The Ayurvedic Healing Village". The trust item reads "One family group — incl. the NABH-accredited Healing Village". No equipment-identity equivalence is asserted anywhere.

## 7 · ADDENDUM for pass 5 — D-EXTREVIEW-OWNER-FACTS (owner ruling, verified) [2026-07-18 19:28:00 IST]

**D-EXTREVIEW-OWNER-FACTS** (DECISIONS.md, 2026-07-18 18:55:33 IST block, on `origin/docs/sweep-rulings-cont`, PR pending merge — text verified verbatim): "OWNER-CONFIRMED FACTS ARE AUTHORITY in external AI design reviews. Every review run attaches a canonical facts sheet (relevant DECISIONS rulings + @kairali/facts); reviewer doubt on owner-confirmed facts is ADVISORY, never a blocking FAIL; the owner's signature remains the deciding judgment."

Application to this review: the heritage/operational claims in the design (family lineage since 1908 · founded 1989 · own manufacturing · worldwide alliances · the D-EQ-CLAIMS carry-as-is set) are OWNER-CONFIRMED FACTS under D-EQ-CLAIMS + the canonical lineage document. Auditor findings that these are "self-reported / not independently audited" are, under this ruling, **ADVISORY — never a blocking FAIL**. Findings of actual fabrication, contradiction with the owner's canonical record, or new unverified claims remain fully blocking.

Pass-4 fixables applied before this pass: the sheet-header PLACEHOLDER tag moved off the card header (the technical drawing renders the REAL mined spec; PLACEHOLDER now marks only the SKU/price line and nothing else) and all hero spec callouts render dual imperial + metric units (8.5 × 3 ft / 2591 × 914 mm · 3 in / 76 mm — mechanical conversion of the real spec). DESIGN_DIRECTION.md is attached as context per the pass-4 plumbing note.
