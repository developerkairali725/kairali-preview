# Pass-3 revision note — what changed since the pass-2 dual FAIL (2026-07-18)

Prior defect list = launches/ktahv-lp-batch/design-review/2026-07-18-pass2.md. Every blocking/major
finding was actioned; nothing was argued around:

1. **[GPT blocking] Second hero action removed.** The "International patients: request a
   consultation" text link is GONE. The hero now carries exactly ONE action (marigold WhatsApp
   button) desktop and mobile; the consultation form remains a below-fold modality of the same
   single conversion goal (a patient lead), per LANDING_PAGE_DOCTRINE §4 WhatsApp-first law.
2. **[GPT major] Real photography, color-true.** The stylized duotone placeholder and conic
   starburst are replaced with the live site's own consultation-room photograph
   (weight-loss__doc_cons.webp — physician pulse-reading at desk, stethoscope visible; mined
   asset manifest docs/media/ktahv-lp-asset-manifest.md). No tint. Alt text set.
3. **[GPT major] Physician identity above the fold on MOBILE.** Compact chip (real portrait,
   "Dr. Deepu John, Chief Physician — treatment planning & admission") sits under the headline,
   before the CTA. Dr. Deepu John is verified as KTAHV Chief Physician (Perplexity pass-2 SUPPORTED).
4. **[GPT] NABH substantiated.** The credential now carries the verifiable certificate ID
   **AH-2024-0250** (NABH portal accredited list, 2024–2027 — Perplexity pass-2 citation 16).
   The official emblem artwork ships at build from the mined award-wall asset (binaries live
   outside git; the mockup chip is a typographic stand-in, stated openly).
5. **[Perplexity MISLEADING] "115-year-old institution" dropped.** Heritage now uses the licensed
   lineage phrasing "Practising Ayurveda since 1908" (D-1908 ruling: 1908 = family lineage, never
   the Group's founding). No precise institutional-age claim remains.
6. **[Perplexity UNVERIFIABLE] "103 countries treated" generalized** to "100+ countries — our
   patients" (the auditor's own suggested framing, "patients from over 100 countries").
7. **[Perplexity UNVERIFIABLE] "21+ physicians & therapists" replaced** with the qualitative
   "Physician-led treatment team".
8. **[Perplexity HIGH-RISK] "designed for your condition" removed.** Sub-copy now reads "planned
   by our physicians after an in-person assessment" — process description, no disease-specific
   efficacy implication. (Full copy still queues for Dr. Deepu John's HARD-GATE-7 sign-off.)
9. **[GPT minor] Visual noise reduced + contrast evidenced.** Diagonal etch texture removed.
   Computed ratios: ivory #F7F4EA on forest-800 #003720 = 12.9:1 (AAA) · ink #1C1B19 on marigold
   #EEB41E = 10.9:1 (AAA) · sub #E9E4D2 on the forest gradient ≥ 10:1.
10. **[GPT] WhatsApp number visible** under the button (+91 92898 38797 — the locked fact),
    no invented response-time stats (HARD GATE 6). Label "Speak to Priya on WhatsApp" is
    cta-label-lint-clean (no physician claim on the Priya channel).
11. **[GPT] Image shortlist + approval path documented** in the mockup header comment: both hero
    assets are the live site's own (already public on the ad-serving pages); physician-portrait
    reuse OK is queued with the HARD-GATE-7 clinical sign-off before staging→production.
