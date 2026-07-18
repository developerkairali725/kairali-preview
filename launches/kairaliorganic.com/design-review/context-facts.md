# Canonical-facts context — kairaliorganic.com Gate-1 pre-content review (fed to both auditors via --context)

Compiled 2026-07-18 19:03:04 IST for design-review batch 2. Template: the kairalicenters context-rulings file.

**BINDING POLICY — D-EXTREVIEW-OWNER-FACTS (DECISIONS.md, Abilash, 2026-07-18 18:55:33 IST, verbatim):**

> OWNER-CONFIRMED FACTS ARE AUTHORITY in external AI design reviews. Every review run attaches a canonical facts sheet (relevant DECISIONS rulings + @kairali/facts); reviewer doubt on owner-confirmed facts is ADVISORY, never a blocking FAIL; the owner's signature remains the deciding judgment.

If your only concern with an element is doubt about a fact listed below, record it as an ADVISORY note (recommendations), not a blocking finding.

## 1 · The two-brand split — D3 (DECISIONS.md, 13 Jul 2026, verbatim)

> D3: Kairali Organics and KAIR are TWO brands. Organics = 100% chemical-free products; KAIR = soaps/shampoos/moisturizing cream/body wash (not fully chemical-free).

This site is the **Kairali Organics** side. The "100% CHEMICAL-FREE · BY FORMULATION" overline is the owner-ruled claim (D3 + the live legacy site's own copy). The claim is deliberately "chemical-free", never "certified organic" — see §3.

## 2 · Domain ruling — D-KAIR-CANONICAL (DECISIONS.md, 2026-07-18 18:35:00 IST, verbatim)

> D-KAIR-CANONICAL (AMENDS D-KAIR-DOMAINS same day): kairbykairali.com STAYS the canonical KAIR home (it is the live site — rebuild in place); kairproducts.com becomes a 301 INTO kairbykairali.com, NOT the KAIR site. kairaliorganic.com ruling unchanged (Organics canonical, kairorganics.com 301s in; note: it is a LIVE legacy site — rebuild, not create).

## 3 · No organic certification — mined fact, owner-acknowledged (docs/kappl-inputs/kair-pair-brand-mining.md, verbatim)

> Any organic **certification** (India Organic/NPOP, USDA, Ecocert, COSMOS): NO certification evidence anywhere in the estate or repo. "Organics" is the brand name; **"certified organic" must never be implied.** If a cert exists, owner supplies it; until then the shell says "chemical-free" (D3 basis) and never "certified".

The design accordingly shows NO organic-certification badge and never says "certified". Do not demand one — its absence is the honest, ruled state. Doubt about the "100% chemical-free" absolute is a known open owner question (BRIEF §open-questions: an ingredient-transparency block is recommended at copy stage) — advisory lane, not blocking.

## 4 · The nine products (live Organics page, mined 18 Jul — the ledger strip 01–09)

Kairbossom · Kairwash · Kairpack · Kaircin · Kairoil · Kairbal · Kairheal · Kairkare Plus · Kairkare. All nine carry the Kair- prefix; Kair-prefixed product names do NOT make them KAIR-brand products (the naming trap, mining doc §6 — both sites state their own brand definition).

## 5 · What the mockup is (and is not)

- SVG **desktop artboard** (1440×820) — the approval object for the MODE B design_direction gate. The 390-wide render supplied is the same artboard scaled, honestly labelled: responsive/mobile layout is specified in DESIGN_DIRECTION.md prose and is built + vetted at the golden_page gate and the post-build Gate 2 (real page screenshots, desktop AND mobile). Judge desktop composition, hierarchy, and direction here.
- Mockup fonts are FALLBACKS (Kurale→Georgia, Asap/Lato→Helvetica); the build loads the real brand faces from packages/ui/brand-tokens.css. Every colour is an existing brand-manual token — no invented hexes.
- Photography slots are labelled placeholders BY DESIGN; the build uses the group's real 583-image Drive library (no stock, no AI imagery). Do not fail the placeholder art.
- Hero copy is DRAFT — copy passes its own review at build; the claims ceiling is the mining doc's.
- NO cart, checkout, or prices anywhere — owner-ruled informational brand shell; purchase intent hands off to the stores/marketplaces. Enquiry routes to info@kairali.com (CLAUDE.md locked fact).
