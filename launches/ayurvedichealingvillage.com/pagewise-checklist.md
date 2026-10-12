<!-- launches/ayurvedichealingvillage.com — scaffolded by scripts/launch-scaffold.mjs on 2026-07-18 12:56:28 IST.
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

## 2026-10-07 20:30:03 IST — current release dispositions

WOPS-AHV-CONSOLIDATED-RELEASE-20261007-001: [candidate evidence and remaining gates](releases/2026-10-07-consolidated-release.md). Historical master text above remains unchanged; this is scoped release evidence, not a new all-page audit.

| Master scope | Current disposition |
| --- | --- |
| Content/proofreading/claims |Approved content captured in 201 EN / 2,412 locale bodies; owner airport guidance 66/114/116 km. Unconfirmed Baoli terms separate; no broader medical/translation approval inferred. |
| Links/URLs/breadcrumbs |Actual released routes drive acceptance; final served checks/document-entry journeys pending. |
| Multimedia/alt/OG/social |Approved illustration/share changes included; final asset-byte/metadata/visual checks pending. No blanket image/alt or external-audit PASS claimed. |
| Canonical/schema/headings/metadata |Final served checks pending; September FAQ/search reports are historical limited evidence. |
| Marketing query parameters |Ordinary/query variants for 169 changed redirects prepared; served preservation pending. No analytics conversion sent. |
| Hreflang/switcher |Two real clusters × 13 languages, raw/hydrated and desktop/mobile; 48 offline tests PASS, served runs pending; no all-page claim. |
| Forms/integrations/Chat |Final safe interaction/error-path regression pending; no real lead/message. Q03 acknowledgement stays NOT-PROVEN/separate. |
| Accessibility/mobile/touch |Final factory/visual checks pending; no new WAVE audit claimed. |
| Redirects |169 total = 13 EN + 156 locale; 26 merger subset, 143 added verifier coverage. 17 offline tests PASS; final served checks pending. Closed unchanged routes not reopened. |
| Performance/individual optimization |Final production Lighthouse pending; no per-page GTmetrix/PageSpeed/SEOptimer claim. |
| Priority/ranking/monitoring |Approved retained merger targets preserved; ranking/engagement monitoring follows release. |

Preparation does not certify final hosted/public behavior; no production publication is asserted.
