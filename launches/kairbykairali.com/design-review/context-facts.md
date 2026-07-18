# Canonical-facts context — kairbykairali.com Gate-1 pre-content review (fed to both auditors via --context)

Compiled 2026-07-18 19:03:04 IST for design-review batch 2. Template: the kairalicenters context-rulings file.

**BINDING POLICY — D-EXTREVIEW-OWNER-FACTS (DECISIONS.md, Abilash, 2026-07-18 18:55:33 IST, verbatim):**

> OWNER-CONFIRMED FACTS ARE AUTHORITY in external AI design reviews. Every review run attaches a canonical facts sheet (relevant DECISIONS rulings + @kairali/facts); reviewer doubt on owner-confirmed facts is ADVISORY, never a blocking FAIL; the owner's signature remains the deciding judgment.

If your only concern with an element is doubt about a fact listed below, record it as an ADVISORY note (recommendations), not a blocking finding.

## 1 · The two-brand split — D3 (DECISIONS.md, 13 Jul 2026, verbatim)

> D3: Kairali Organics and KAIR are TWO brands. Organics = 100% chemical-free products; KAIR = soaps/shampoos/moisturizing cream/body wash (not fully chemical-free).

This site is the **KAIR** side: Ayurveda-influenced herbal COSMETICS. The hero deliberately says "herbal" and NEVER "chemical-free" or "organic" — that restraint is a D3 compliance feature (lint-checked per STRATEGY), not a weak claim. Do not ask the design to make purity claims; they are ruled out for this brand.

## 2 · Domain ruling — D-KAIR-CANONICAL (DECISIONS.md, 2026-07-18 18:35:00 IST, verbatim)

> D-KAIR-CANONICAL (AMENDS D-KAIR-DOMAINS same day): kairbykairali.com STAYS the canonical KAIR home (it is the live site — rebuild in place); kairproducts.com becomes a 301 INTO kairbykairali.com, NOT the KAIR site. kairaliorganic.com ruling unchanged (Organics canonical, kairorganics.com 301s in; note: it is a LIVE legacy site — rebuild, not create).

The stale content on today's live kairbykairali.com (KTAHV spa awards, tea copy) is exactly what this rebuild replaces — do not judge the direction against the live site's current content.

## 3 · Owner-anchored design facts

- **Quicksand is the brand manual's OWN named display voice for the "kair range"** (Kairali Brand Manual 2026 rev.2, ch.04, specified 2017) — not an arbitrary font pick. The mockup shows a Trebuchet FALLBACK; the build loads real Quicksand. The Asap body pairing is flagged PROVISIONAL in the artifact itself and awaits the owner's nod.
- Every colour is an existing brand-manual token (leaf/marigold/forest/bronze on ivory); distinctness vs the Organics site comes from distribution, geometry, and type — per D3's never-blur requirement. The two sites are DELIBERATE opposites (rounded/bright/playful here vs serif/ledger/apothecary there).
- Category set per D3 + the live site: shampoos (6 herbal variants) · soaps (hand-made bars) · body wash (strawberry shower gel) · lotions (+ conditioner).
- The "KAIR by Kairali" H1/logo lockup is an interim type stand-in; the consumer-facing brand-mark question is an open owner question riding the APPROVE reply.

## 4 · What the mockup is (and is not)

- SVG **desktop artboard** (1440×820) — the approval object for the MODE B design_direction gate. The 390-wide render supplied is the same artboard scaled, honestly labelled: mobile layout is specified in DESIGN_DIRECTION.md prose and is vetted at golden_page and post-build Gate 2 with real page screenshots. Judge desktop composition, hierarchy, and direction here.
- Photography slots are labelled placeholders BY DESIGN; the build uses real product photography from the group library (no stock, no AI imagery). Do not fail the placeholder art.
- Hero copy is DRAFT — copy passes its own review at build; claims ceiling per the mining doc.
- NO cart, checkout, or prices anywhere — owner-ruled informational brand shell; purchase intent hands off to stores/marketplaces. Enquiry routes to info@kairali.com (CLAUDE.md locked fact; the live site's support@kairaliproducts.com and +91-9555156156 are NOT carried).
