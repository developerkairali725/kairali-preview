# Pass-4 revision note — actions on the pass-3 dual FAIL (2026-07-18)

Prior defect list = launches/ktahv-lp-batch/design-review/2026-07-18-pass3.md.

## GPT blocking issues — all three closed

1. **Two marigold buttons on mobile → ONE, mechanically.** The sticky bottom bar is now
   hidden by default and driven by a real IntersectionObserver: it slides in ONLY once the
   hero CTA has left the viewport by ≥24px (rootMargin -24px) and hides again when the hero
   CTA returns. Exactly one marigold object is ever on screen. The motion spec is implemented
   in the mockup's own script, not promised. (The earlier "two buttons" render was a full-page
   screenshot artifact of an always-on fixed bar; the bar is now state-driven.)
2. **Green-on-green emphasis → ivory type + leaf underline.** The emphasized phrase is now
   ivory #F7F4EA on forest-800 (12.9:1, AAA); leaf-500 survives only as a 3px decorative
   underline (decoration carries no 4.5:1 requirement). No text renders in leaf on forest.
3. **Overline token proven.** A TOKEN LEGEND strip at the foot of the mockup annotates every
   hex against packages/ui/brand-tokens.css v1.1: overline = bronze-400 #C1882C (the
   D-BRONZE-CONTRAST dark-ground step), CTA = marigold-400 #EEB41E (accent-only, one on
   screen at a time), gradient stops forest-700/800, ivory/ink contrast ratios computed inline.

## Perplexity UNVERIFIABLE/MISLEADING claims — truthed or replaced

4. **"Since 1908" cred replaced** with "4 generations — family practice of Ayurveda" — the
   externally corroborated phrasing (Healing Guide: four generations). No year claim remains
   on the page.
5. **"100+ countries" cred REMOVED** (no external verification exists). Replaced with
   "Panchakarma — in NABH-accredited scope", verifiable against certificate AH-2024-0250's
   published scope of services.
6. **Hero sub softened**: "physician-supervised … planned after an in-person assessment with
   our doctors" — process description tied to the verified facts (in-house doctors,
   consultation-first), no assurance language.
7. **WhatsApp number (+91 92898 38797)**: retained BY LAW — it is the repo's locked internal
   operational fact (CLAUDE.md Locked Facts; the facts sheet now instructs auditors to treat
   locked operational facts as ground truth: absence from public listings is expected, not a
   finding). A page carrying a DIFFERENT number would be the failure.
8. **Dr. Deepu John, Chief Physician**: retained — role verified in pass 2 (Wellness Loka:
   Chief Physician & HOD, Panchakarma specialisation; TripAdvisor + Kairali's own pages).
   Physician-photo/byline reuse rides the HARD-GATE-7 clinical sign-off before production.
