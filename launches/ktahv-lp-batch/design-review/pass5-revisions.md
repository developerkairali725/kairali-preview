# Pass-5 revision note — actions on the pass-4 dual FAIL (2026-07-18)

Prior defect list = launches/ktahv-lp-batch/design-review/2026-07-18-pass4.md.

## Observation-vs-pixels record (stated plainly, per review-rigor law)

Pass-4's two GPT blocking findings do not match the submitted images and are answered with
an ANNOTATED composite this pass (hero-v4-mobile-states-annotated.png):

- "Two marigold CTAs visible simultaneously on mobile (scrolled shot)" — the pass-4 scrolled
  shot contains exactly ONE marigold button (the hero CTA, still in view on the short mock;
  the sticky bar is hidden by the IntersectionObserver precisely BECAUSE the hero CTA is
  visible). No frame ever contains two.
- "No CTA visible on first mobile fold" — the pass-4 fold shot shows the full marigold CTA at
  ~650px of an 812px viewport, with the number caption beneath it.

The composite labels each state so the behavior cannot be misread. The observer logic is
implemented in the mockup's own script (rootMargin −24px), not promised.

## Improvements actioned from pass-4 recommendations

1. **Photo frame simplified** — the double-card wrapper is gone; one clean photograph with a
   caption gradient, larger (460px), face and stethoscope foregrounded. Color-true, no duotone.
2. **Cred strip now 100% externally verifiable:** NABH · AH-2024-0250 (NABH portal) ·
   "Panchakarma — in NABH-accredited scope" (certificate scope) · "State-certified — Kerala
   Clinical Establishments Act" (Express Healthcare, permanent certificate) · "Physician-led
   treatment team" (qualitative). The "4 generations" heritage line moved OUT of the hero.
3. **Bronze overline measured and disclosed:** 4.35:1 on forest-800 at 13px caps. bronze-400
   is the ruled dark-ground overline step (D-BRONZE-CONTRAST); brand-token law (doctrine d)
   holds, the measurement is printed in the mockup's token legend, body copy never renders in
   bronze. Flagged, not smoothed.
4. **CTA label** stays "Speak to Priya on WhatsApp" — the label the approved STRATEGY routes
   (WhatsApp +91 92898 38797, Priya). It is cta-label-lint-clean (no clinical claim on that
   channel). "Admissions Desk" would assert a desk we have not verified exists — HARD GATE 6
   forbids inventing it. Recorded as the reasoned rejection of a recommendation, not a miss.
5. **Rationale, in one place:** H1 repeats the ad keyword ("Panchakarma treatment in Kerala")
   per the message-match law; the differentiator "planned by physicians — not packaged" is the
   clinical-register answer to the resort-toned competition; the consultation-room photograph
   IS the product (the first minute with a physician); single WhatsApp CTA per India-geo
   CTWA doctrine §4; proof strip = verifiable credentials only, before any adjective.

## Standing instruction to the truth auditor (facts sheet, restated)

+91 92898 38797 and info@kairali.com are the repo's LOCKED internal operational facts — ground
truth by rulebook; absence from public listings is expected and is not a finding. Dr. Deepu
John's Chief Physician role was verified SUPPORTED in pass 2 (Wellness Loka profile: Chief
Physician & HOD; TripAdvisor; Kairali pages) — the title also rides HARD GATE 7 clinical
sign-off before production.
