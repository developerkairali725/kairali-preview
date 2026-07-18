# DESIGN DIRECTION — theblushlounge.com · MODE B · 2026-07-18 18:22:45 IST

Front gate (approvals.yaml `design_direction` — MODE B's extra gate). **ONE
direction, as the law requires: tokens + a single hero mockup.** No page has
been built; nothing under `sites/` exists for this domain.

## Anchor (what this is reasoned FROM — not invented)

`design-intake/` is empty of human design and `REFERENCES.md` is unfilled (that
file is the owner's; the agent does not write it). The anchoring authority for
this MODE B proposal is instead **D-BL-INTERIM (owner ruling, 18 Jul 2026)**:
build from **Sneha's own IG @blushlounge_sneha** as the interim asset + aesthetic
source — her account, her site. Concrete anchors, all mined and screened:

1. **Her grid's look** (14 captured images): luminous skin, champagne/ivory/
   muted-metallic couture, warm low-key light, editorial portrait crops.
2. **Her existing brand assets**: the gold-foil + ink circular logo (script "bl"
   monogram, tracked-caps wordmark), Allura + Montserrat from the live site.
3. **Her school posts' typography**: editorial serif overlays (the Femina/Grazia
   press register she already lives in).
4. Comp-set anti-references (docs/blushlounge-inputs/comp-set.md §5): NOT
   template-glam pink curlicues, NOT dead-Bootstrap, NOT aggregator-listing look.

## The direction: "Champagne Editorial"

The site should feel like her press features — a fashion-magazine spread where
the photograph carries the glamour and the type stays precise. Split-screen
editorial hero: ivory copy field + full-bleed portrait. Restraint IS the sexy
here — in a niche split between glitter templates and dead brochures, a quiet
editorial page is the memorable one.

### Proposed tokens (→ `packages/ui/blush-tokens.css` once approved; answers the
open QUESTIONS.md item "does Blush Lounge get its own token file" — YES, like raag)

| Token | Value | Source |
|---|---|---|
| `--blush-ink` | `#211A16` | warm near-black — her photos' shadow floor |
| `--blush-ink-soft` | `#4A3F37` | body text |
| `--blush-ivory` | `#FAF6EF` | studio-wall ivory (page field) |
| `--blush-champagne` | `#C9AE7E` | sampled from the logo's gold foil |
| `--blush-champagne-deep` | `#A08652` | hover / rules / accents on ivory (AA at text sizes used) |
| `--blush-rose` | `#D8A79E` | the quiet "blush" — sparing accents only |
| `--font-display` | Fraunces | editorial serif — her course-post overlay register; NOT Playfair (AI-generic default) |
| `--font-ui` | Montserrat | continuity — the wordmark's tracked caps; buttons/labels/body |
| `--font-script` | Allura | the monogram's lineage — HARD CAP one accent per page |
| caps tracking | `.22em` | matches the logo wordmark |

Buttons: rectangular (no radius), tracked caps — solid ink (primary) / 1px ink
line (secondary), champagne-deep hover. Imagery: full-bleed, warm gradient
scrims for text legibility, script photo-credit overlay ("makeup by Sneha").

### The single hero mockup (the approval object)

- Source: `design-direction/hero-mockup.html` (self-contained; image by local
  library path — re-render on the M2)
- **Desktop 1440×900: `screens/design-direction-hero-desktop-1440x900.png`**
- **Mobile 375×812: `screens/design-direction-hero-mobile-375x812.png`**
  (image-first, copy below; verified zero horizontal overflow at 375)

Composition: left ivory column — logo lockup, champagne eyebrow "DELHI ·
WORLDWIDE — BEAUTY, BRIDAL & SFX", Fraunces headline **"Soft glamour, precise
drama."** (derived from her own captions: "soft glamour with just the right
amount of drama", "softness takes just as much precision as drama"), lede in
her process-led voice, dual CTA ("Enquire for your date" / "WhatsApp Sneha" —
the strategy's `data-cta` events), press trust bar (MAC Bridal · Femina ·
Grazia · Cinema Makeup School LA). Right: full-bleed bride portrait
(ig-DUsF6VCjFHW.jpg, INTERIM-IG-SOURCED) with script credit + handle.

## Honest limits (flagged, not hidden)

- **Hero image is a 640px reel poster** upscaled ~1.2× at desktop — acceptable
  as INTERIM; the two full-res photo-post captures carry baked-in course text
  (unusable as heroes); the hi-res shoot sets are the real fix (D-BL-INTERIM swap).
- Logo ceiling is the 499×401 PNG (mockup rebuilds the lockup in type as a
  stand-in; vector logo remains an open QUESTIONS.md ask).
- Fraunces/Allura pairing shown in the mockup via Google Fonts; production
  self-hosts per factory standards.
- Doctrine (d) note: no Blush brand manual exists to override this; if one
  surfaces, it wins.

---
**STOP.** reply `APPROVE design_direction` or `CHANGES <notes>`.
