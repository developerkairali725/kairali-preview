# DESIGN DIRECTION — kairaliorganic.com (MODE B, gate: design_direction)

**Proposed 2026-07-18 18:26:30 IST · ONE direction, per the MODE B law · status: AWAITING APPROVAL — no page is built before this row is signed.**
**Anchoring (design-intake/REFERENCES.md is empty — owner-supplied only, so per the kairalicenters precedent this proposal anchors to what the owner HAS pointed at):** the Kairali Brand Manual 2026 rev.2 via `packages/ui/brand-tokens.css` (doctrine d — the manual wins) · the "sexy sells" law + D9(iv) galleries (Awwwards/Mobbin component-level) · docs/kappl-inputs/kair-pair-comp-set.md §5 (the luxury-Ayurveda apothecary lane: Forest Essentials / Kama school). **No hex, face, radius or spacing below is invented — every value is an existing brand token; site-level names are ALIASES.**

## The direction: "The Apothecary Ledger"

Kairali Organics is the master brand's heritage voice speaking about products: a chemical-free formulary presented like a beautifully-kept ledger — numbered, unhurried, editorial. Deep forest surfaces, ivory paper, bronze rules and overlines, serif display. The apothecary lane out-differentiates every marketplace listing the brand competes with, and it is the natural OPPOSITE of KAIR's direction (see §Distinctness), which is what D3 demands.

## Tokens (aliases over packages/ui/brand-tokens.css — nothing new)

| Site alias | → Token | Role on this site |
|---|---|---|
| `--org-ground` | `--ivory` #F7F4EA | Page ground ("paper") |
| `--org-panel` | `--forest-700` #004226 | Hero/section dark panels (`--forest-800` for alternate bands) |
| `--org-action` | `--forest-500` #006038 | Links, interactive, primary buttons on light |
| `--org-overline` | `--bronze-400` #C1882C | Overlines, taglines, hairline rules |
| `--org-body-accent` | `--bronze-600` #875F1F | Bronze text on light (D-BRONZE-CONTRAST) + the ledger numerals |
| `--org-accent` | `--marigold-400` #EEB41E | Accent ONLY, never body text (ch.10); `--marigold-300` on dark |
| `--org-display` | `--font-display` Kurale 400 | h1–h3, never bolded |
| `--org-body` | `--font-body` Asap | body, UI, h4+ |
| `--org-caption` | `--font-caption` Lato | captions, overlines, the ledger numerals |
| buttons | `--radius-pill` | ALL action buttons are pills (token law) |
| cards | `--card-bg` / `--card-border` / `--shadow-warm` | Product cards on ivory |

Leaf family stays a supporting note here (identity/focus rings only) — leaf-led is the KAIR site's job.

## The hero (mockup: `hero-mockup.svg`, renders in the PR)

Asymmetric editorial split. LEFT: forest-700 panel — bronze overline "100% CHEMICAL-FREE · BY FORMULATION", Kurale display "Nine formulations. Nothing that isn't from the earth.", Asap subline carrying the mined dosha-philosophy line, marigold pill CTA (Meet the Nine) + quiet outline pill (Where to buy). RIGHT: ivory still-life field, bronze hairline frame — real range photography (slot: `kairali-group-kairali-proprietary-organic-01.jpg`, natural-warm treatment per manual ch.05). BELOW: the ledger strip — the nine products as a numbered 01–09 row (bronze numerals, Lato), which becomes the site's signature motif (the range grid, product-page headers and footer all reuse the numbered-ledger language).

Mockup faces are fallbacks (Kurale→Georgia, Asap/Lato→Helvetica); the build uses the real Google faces from the tokens. Hero copy is DRAFT — copy passes its own review at build; the claims ceiling is the mining doc's.

## Photography & texture

Library-first (583-image Drive library; manifest docs/media/kairali-product-images/): the eight PROPRIETARY ORGANIC range shots for heroes/bands, per-product stills (Kaircin ×42 … full counts in mining doc §5) on product pages, natural-warm treatment; heritage marigold overlay (multiply, reduced opacity) only when an image plays a supporting role (manual ch.05). No stock, no AI product imagery.

## Accessibility & performance notes carried into the build

Marigold never carries text (ch.10); bronze-600/leaf-700 are the only bronze/leaf text steps on light; ink placeholder caveat stands (Q-INK-INCONSISTENT). Lighthouse ≥90 floor; hero is a poster-first LCP image, no carousel.

## Distinctness vs kairbykairali.com (D3: never blur — same table in both artifacts)

| Axis | kairaliorganic.com (this) | kairbykairali.com |
|---|---|---|
| Display voice | Kurale serif (master heritage) | Quicksand rounded sans (manual's "kair range" voice) |
| Colour lead | forest + bronze on ivory (deep, warm) | leaf + marigold on ivory (bright, fresh) |
| Geometry | Asymmetric editorial split, hairline rules, numbered ledger | Rounded pill nav, tilted playful cards, soft blobs |
| Photography | Still-life apothecary, natural warm | Bright product-forward, ingredient colour |
| Voice | Formulary, unhurried, "the nine" | Everyday, light, category-led |

---
**On APPROVE design_direction:** tokens land as site CSS aliases, the golden page (homepage) is built to this direction, then STOP for the golden_page gate.
