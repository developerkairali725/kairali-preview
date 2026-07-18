# DESIGN DIRECTION — kairbykairali.com (MODE B, gate: design_direction)

**Proposed 2026-07-18 18:28:30 IST · re-targeted 2026-07-18 18:46:30 IST per D-KAIR-CANONICAL (the KAIR site is a rebuild in place on kairbykairali.com; the direction itself is unchanged) · ONE direction, per the MODE B law · status: AWAITING APPROVAL — no page is built before this row is signed.**
**Anchoring (design-intake/REFERENCES.md is empty — owner-supplied only, so per the kairalicenters precedent this proposal anchors to what the owner HAS pointed at):** the Kairali Brand Manual 2026 rev.2 — which NAMES a dedicated sub-brand display voice for the "kair range" (**Quicksand, as specified in 2017**, manual ch.04) — via `packages/ui/brand-tokens.css` (doctrine d) · the "sexy sells" law + D9(iv) galleries (component-level) · docs/kappl-inputs/kair-pair-comp-set.md §5 (the fresh contemporary herbal-cosmetics lane, aspirational-accessible slot). **No hex is invented — every colour is an existing brand token; the distinctness vs the Organics site comes from DISTRIBUTION, geometry and type, not new values.**

## The direction: "Fresh Pressed"

KAIR is the group's everyday face: herbal cosmetics you actually reach for in the shower. Bright ivory ground, leaf-and-marigold energy, rounded geometry everywhere (the visual echo of Quicksand's letterforms), product photography doing the colour work — lemon, henna, aloe, strawberry, neem, sandal ARE the palette's content layer. Modern bath-and-body freshness with the Kairali umbrella's credibility underneath, and deliberately NOT the apothecary voice next door.

## Tokens (aliases over packages/ui/brand-tokens.css — nothing new)

| Site alias | → Token | Role on this site |
|---|---|---|
| `--kair-ground` | `--ivory` #F7F4EA | Page ground |
| `--kair-identity` | `--leaf-500` #8E9D35 | Brand identity colour: marks, borders, decorative shapes |
| `--kair-identity-text` | `--leaf-700` #636E25 | Leaf TEXT on light (ramp law — leaf-500 never carries text) |
| `--kair-action` | `--forest-500` #006038 | Buttons/links (the fleet's interactive colour — kept for a11y + family coherence) |
| `--kair-accent` | `--marigold-400` #EEB41E | Accent shapes/badges, never body text |
| `--kair-warm` | `--bronze-400` / `--bronze-600` | Small warm notes: eyebrow text (600 on light), card captions |
| `--kair-card` | `--card-bg` #FFFFFF + `--card-border` + `--shadow-warm` | The white category/variant cards |
| `--kair-display` | **Quicksand** (manual "kair range" sub-brand voice) | h1–h3 display |
| `--kair-body` | `--font-body` Asap | body, UI, h4+ — **PROVISIONAL PAIRING, FLAGGED**: the manual names only the display face for the kair range; pairing the master body face is derived per the D-BRONZE-CONTRAST clause-2 method (complete, don't invent) and needs the owner's nod, not silently assumed |
| radii | `--radius-3`/`--radius-4` cards · `--radius-pill` ALL buttons | The rounded geometry IS the direction |

## The hero (mockup: `hero-mockup.svg`, renders in the PR)

Centered and airy: floating pill nav on ivory; soft leaf/marigold circles behind (decorative, low-opacity); bronze eyebrow "HERBAL COSMETICS · UNDER THE KAIRALI UMBRELLA"; Quicksand display "Everyday care, pressed from herbs." (second line in leaf-700); one-line Asap subline naming the four D3 categories; forest pill CTA (See the range) + leaf outline pill (Enquire). BELOW: the category ribbon — four white rounded cards at playful ±2–3° tilts (Shampoos · Soaps · Body Wash · Lotions), each carrying a real product photo slot (`kairali-group-shampoo-01.jpg`, `kairali-group-hand-made-soaps-01.jpg`, strawberry-shower-gel PDP shot, `kairali-grape-seed-almond-herbal-lotion-01.jpg`) — the tilted-card ribbon becomes the site's signature motif (range pages straighten the cards, variant chips keep the rounded language).

Mockup faces are fallbacks (Quicksand→Trebuchet); the build loads the real face. Hero copy is DRAFT; claims ceiling per the mining doc — note the hero says "herbal", never "chemical-free"/"organic" (D3, lint-checked per STRATEGY §2).

## Photography & texture

Library-first: soap/shampoo group shots for the ribbon and range pages, per-variant stills where they exist, bright natural light, ingredient close-ups as section punctuation. No stock, no AI product imagery.

## Accessibility & performance notes carried into the build

leaf-500 and marigold-400 never carry text (ch.10 + ramp law) — text roles use leaf-700/bronze-600/ink/forest; tilted cards keep tap targets level ≥48px; Lighthouse ≥90 floor; poster-first LCP.

## Distinctness vs kairaliorganic.com (D3: never blur — same table in both artifacts)

| Axis | kairbykairali.com (this) | kairaliorganic.com |
|---|---|---|
| Display voice | Quicksand rounded sans (manual's "kair range" voice) | Kurale serif (master heritage) |
| Colour lead | leaf + marigold on ivory (bright, fresh) | forest + bronze on ivory (deep, warm) |
| Geometry | Rounded pill nav, tilted playful cards, soft blobs | Asymmetric editorial split, hairline rules, numbered ledger |
| Photography | Bright product-forward, ingredient colour | Still-life apothecary, natural warm |
| Voice | Everyday, light, category-led | Formulary, unhurried, "the nine" |

---
**On APPROVE design_direction:** tokens land as site CSS aliases (Quicksand added to this site's font loading only), the golden page (homepage) is built to this direction, then STOP for the golden_page gate.
