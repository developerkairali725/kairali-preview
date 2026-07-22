# Facts sheet — Gate-1 pre-content design review, KTAHV LP batch golden mockup

Written 2026-07-18 19:57:00 IST for scripts/design-review.mjs --stage pre (D-20260718-12).
Auditors: judge the design against THESE locked facts. Anything on the mockup that
contradicts a locked fact is a FAIL finding; anything not listed here is a legacy-page
claim carried from the mined live site (flag if it looks invented, do not assume).

## LOCKED FACTS (CLAUDE.md — grep-law, non-negotiable)

**Auditor instruction on locked OPERATIONAL facts:** the WhatsApp number and the contact
email below are INTERNAL locked operational facts supplied by the operator (Kairali's own
patient-services routing, ruled in the repo rulebook). They are ground truth for this review.
They are NOT expected to appear in public directories/listings — their absence from indexed
sources is EXPECTED and is not a finding. Verify the page AGAINST them (a different number
or email on the page = FAIL); do not fail the page FOR carrying them.

- KTAHV WhatsApp (Priya's line): **+91 92898 38797** — wa.me/919289838797. Any …38777 is WRONG.
- Public contact email everywhere: **info@kairali.com**.
- KTAHV = Kairali – The Ayurvedic Healing Village, **NABH-accredited Ayurvedic hospital**, Palakkad, Kerala.
- Kairali network canonical count: **14 treatment centres across five countries** (14/5 ruling,
  17 Jul 2026 — computed from @kairali/facts, never typed as a literal in copy).
- NABH accreditation certificate: **AH-2024-0250** (NABH portal accredited AYUSH-hospital list,
  2024–2027, scope includes Panchakarma) — externally verifiable, cite-safe.
- Clinical Establishment **permanent certificate under the Kerala Act** — reported by Express
  Healthcare ("Kairali Ayurvedic Healing Village receives Clinical Establishment Permanent
  Certificate under Kerala Act").
- Dr. Deepu John — Chief Physician & HOD at KTAHV (Wellness Loka physician profile; verified
  SUPPORTED in this review's pass 2 with citations). Treat as ground truth for this gate; the
  byline additionally rides HARD GATE 7 clinical sign-off before production.
- Scope note for the truth auditor: vet the claims VISIBLE ON THE PAGE. Claims that appear only
  in these context notes (history, rulings, process) are review scaffolding, not page copy.
- Entity register: KTAHV clinical lock — patient / physician / treatment / programme /
  Panchakarma / admission / discharge / consultation. Banned anywhere on the page:
  spa, resort, holiday, luxury, cure, journey, guests (+ DE/FR equivalents).
- No quantified outcome claims, no disease-cure promises (India DMR Act 1954 +
  Google Healthcare policy — landing pages are advertisements under both).

## LEGACY-PAGE CLAIMS visible on the mockup (mined from the live ad-serving page —
carried, not invented; owner/physician verification tracked separately)

- "115+ years of Ayurveda" — live-site authority spine (family lineage since 1908).
- "103 countries treated" — live-site world-map stat.
- "21+ physicians & therapists" — live-site stat block.
- Dr. Deepu John, Chief Physician — real person; clinical copy needs his sign-off (HARD GATE 7).

## Design system the mockup must obey

- Kairali Brand Manual tokens only (packages/ui/brand-tokens.css v1.1): ivory ground,
  forest interactive, leaf identity, bronze overlines, marigold ACCENT-ONLY (the single
  saturated object = the one CTA), Kurale 400 display / Asap body / Lato caption.
- Landing-page doctrine: 1:1 attention ratio, no nav, single WhatsApp-first CTA
  (India-geo), proof before the form, sticky mobile CTA, clinical register in pixels.
