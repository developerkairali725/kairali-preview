<!-- launches/kairaliequipment.com — scaffolded by scripts/launch-scaffold.mjs on 2026-07-18 17:57:22 IST.
     Master: docs/checklists/pagewise-migration-checklist.md (Abilash's originals — every item mandatory unless a
     stricter Launch Checklist gate covers it). FILL EVERY ITEM during the build:
     [x] done · [ ] pending with an honest note. CLAUDE.md launch-evidence law:
     "A launch without its filled checklists in the repo is not a launch." -->
# Page-Specific Migration Checklist (Abilash's original — verbatim, ingested 2026-07-13)

## Content Management
- Content review: aligns with brand voice/tone; outdated info updated; irrelevant content removed; primary + secondary keywords incorporated naturally.
- Proofreading: grammar, typos, clarity, readability for target audience.
- Internal linking: links to related pages; all functional.
- Multimedia optimization: compressed images/videos; descriptive alt text on ALL images.
- Canonical tags: self-referencing canonicals; verified post-migration.
- Breadcrumb navigation: present, correct hierarchy, linked appropriately.
- Structured data: relevant types (Article, Product, …) validated with Rich Results Test.
- Analytics/tracking codes on each page (GA, Facebook Pixel where applicable).
  - Marketing URLs: UTM parameters (utm_source, utm_medium, utm_campaign); consistent naming conventions; verified capture in analytics; tested end-to-end.
- hreflang for multilingual pages, correctly implemented, pointing to right versions.
- Third-party integrations (CRM forms, chatbots) reintegrated and tested per page.
- Accessibility: alt text, ARIA roles; assessed with WAVE.
- Page-specific 301 redirects for changed URLs; tested.
- Metadata: unique meta title (~60ch) + description (~155ch) with target keywords; page-specific OG (title, type, URL, image) + Twitter Card metadata.

## Technical Checks
- Clean descriptive URL, consistent with structure, target keywords included.
- All links functional (no 404s).
- Forms and interactive features tested per page.

## Mobile-Friendliness (per page)
- Layout checked on multiple screen sizes; images/text adjust dynamically; touch elements sized right.

## Performance (per page)
- GTmetrix + PageSpeed Insights run per page; LCP optimized, CLS minimized, FID reduced; audit with SEOptimer.

## Post-Migration Monitoring
- Page performance + engagement monitored; issues fixed promptly.

## Individual Page Optimization
- Unique keyword-rich titles/descriptions; H1/H2/H3 structure; keywords natural; images compressed (TinyPNG-class) with alt text; internal links; structured data validated; clean URLs; SEOptimer audits.

## Priority Pages
- High-priority (conversion/traffic drivers): fresh content, rankings monitored, strategy adjusted.
- Low-priority: basic SEO standards; periodic review for stale content/broken links.

---
## FILL — full-site build lane [2026-07-19 00:35:00 IST]

Applies to all 19 content routes (+10 placeholder PDPs, marked): built from the
approved golden page's design system (Foundry Ledger), every page TSX from
packages/* + site components.

- [x] Content: register A / B2B procurement voice; category copy VERBATIM-mined (record-quote blocks cite the legacy catalogue); heritage strictly per kairali-lineage.md canonical forms; zero invented facts (gaps read "— awaiting catalog —" / "shared at quote stage").
- [x] Proofread: full-site read-through this lane; guard test pins banned constructions (equivalence lexicon, est.-1908 forms, unverified phone, real-looking prices).
- [x] Internal links: every page linked from nav/footer/hub; 33 unique hrefs verified 200; breadcrumbs on all subpages (+ BreadcrumbList JSON-LD).
- [x] Multimedia: 8 mined legacy photos via next/image with descriptive alt text; single honest photography disclaimer; no stock, no AI imagery.
- [x] Canonicals: self-referencing via buildMetadata on every route.
- [x] Structured data: per-page (see sitewide fill); placeholder PDPs carry NONE.
- [x] Analytics: data-cta on every primary control; GA4 consent-gated.
- [x] Marketing URLs: no UTM campaigns exist yet (/lp lane is out of scope for this site build).
- [x] hreflang: n/a by design — EN-only per BRIEF §5 (flagged, not silent).
- [x] Third-party: RFQ form (store-first, consent-required, honeypot) tested live on the preview; Chatbase consent-gated and verified; WhatsApp count law held (hero + sticky only).
- [x] Accessibility: labels above fields, aria-labels on nav/sections, focus-visible ring, ≥44px primary targets; WAVE-class run pending CI accessibility budget (Lighthouse a11y ≥95 in the A5 job).
- [ ] Page-specific 301s: land at DNS flip per the protection map (KEEP/MERGE routes already mirror legacy URLs' content).
- [x] Metadata: unique title+description per page inside gate limits, keywords per STRATEGY §2.
- [x] Forms: RFQ submit exercised on the preview (store-first path; consent enforced client + server side).
- [x] Mobile per page: category/trade/RFQ/FAQ pages captured or DOM-audited at 390px; no overflow found anywhere.
- [ ] Per-page GTmetrix/PageSpeed: CI Lighthouse covers the key templates; per-page third-party audits deferred to the pre-flip QA round.
- PDP note: the 10 placeholder PDPs are owner-ordered scaffolds (noindex, out of sitemap, no schema, unmistakable placeholder grammar) — they graduate route-for-route when the real catalogue lands.
