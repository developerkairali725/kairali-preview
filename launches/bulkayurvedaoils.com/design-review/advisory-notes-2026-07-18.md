# Advisory notes — bulkayurvedaoils.com Gate-1 review (D-EXTREVIEW-OWNER-FACTS separation)

2026-07-18 19:03:04 IST lane · batch 2. Per D-EXTREVIEW-OWNER-FACTS, reviewer doubt on owner-confirmed facts is ADVISORY, never a blocking FAIL. This file records those advisory items separately from the pass evidence, plus the lane's judgment.

## Advisory (owner-fact doubt — NOT blocking, recorded for the owner)

1. **Cert strip "WHO-GMP · ISO · FSSAI · FDA · GLP · CE"** — cited-owned: published verbatim on the kairaliproducts.in homepage [OWN-3]; the owned-claims register's carry rule is "as published, never expanded". Perplexity confirms WHO-GMP/ISO/CE from Kairali's own materials but calls the combined strip MISLEADING because it cannot find registry-grade evidence for **FDA** (only a leadership profile) or **FSSAI** (absent from the certifications page it consulted). Under the policy this is advisory — the strip is the owner's published claim, carried with an "(as published)" qualifier. **Worth the owner's eye anyway:** if FDA/FSSAI certificate artefacts exist, adding them to the planned /quality wall closes this doubt permanently; if not, the strip's FDA/FSSAI entries are a complaint surface on a NEW surface even though they are carried from an owned page.
2. **"Since 1908, founded 1989" + "Trusted since 1908 — four generations"** — owner-ruled lineage forms (D-1908 Abilash-confirmed; D-LIN-1989-WORDING canonical) and published on the owned homepage [OWN-3]. Perplexity: UNVERIFIABLE externally, low-risk. Advisory by policy.
3. **5 L / 1 kg pack formats** — verified from the owner's live store per the facts sheet; Perplexity marked pass-1 UNVERIFIABLE (no public spec sheet for *all* thailams), pass-2 SUPPORTED. Advisory residue only.

## Blocking findings and the revise-pass ledger (ONE allowed — SPENT pass 1 → pass 2)

Pass-1 audit-gpt blockers, both mechanical, both FIXED in `design-direction/hero-mockup.html`: (a) primary-CTA duplication → header demoted to ghost + copy unified ("Get a bulk quote", one solid primary in the spec card, ghost hidden on mobile in favour of the build's sticky bar); (b) decorative/occluded photo slot → full-height unoccluded photography column (~28% of hero width). Also applied from the same critique: oversized pack numerals (42px scan beacons), "Dispatch — India & export markets" spec row, nav label "Oils & powders".

Pass-2 audit-gpt FAIL raises NEW, smaller mechanical residue: (a) the mobile comp shows no nav affordance (the mockup hides nav as documented shorthand — the build uses the packages/ui visible-nav pattern, never a desktop hamburger; a mobile nav affordance should still be drawn in the next mockup rev); (b) the dark trust strip omits the "(as published)" qualifier the spec card carries — one-line consistency fix; (c) a "probable" small-text contrast query (marigold-300 on forest-800 measures ≈7:1 — passes AA; no token change needed, evidence to attach next rev).

**The single revise-pass is spent, so the verdict stands for the lane + owner: FAIL / FAIL (pass 2).** The remaining GPT items are minutes of mockup work for the next design pass; the Perplexity position is advisory-class under the policy, with the FDA/FSSAI artefact ask above as the one substantive owner follow-up.
