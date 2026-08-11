# Site-wide checklist — abhilashkr.com

**Task:** `WOPS-ABHILASHKR-LAUNCH-001`  
**Filled:** 2026-08-11 06:32 IST  
**Scope:** change-class release on an already-live personal entity hub; English
root retained, German and French added.  
**Marks:** `[x]` verified · `[~]` partial/deferred with reason · `[ ]` requires a
named human, vendor or post-release observation.

## 1. Release control

- [x] Owner brief and release decisions recorded in `BRIEF.md` and `STRATEGY.md`.
- [x] Existing live state recorded before mutation in `baseline/live-2026-08-11.md`.
- [x] Exact rollback target recorded in `rollback.md`; Vercel read-back on 11
  August shows deployment `dpl_5AQSN9tuBgbSTRhFj6UQJo7BuW9f` is production and
  `Ready` with apex and `www` aliases.
- [x] Immutable protected preview `dpl_CSUCMWcPCSi6m4srfeheBAZQno2t` is `Ready`;
  authenticated route/draft/crawl-file probes are recorded in
  `preview-2026-08-11.md`.
- [x] Healthy DNS is unchanged. This is a source deployment, not a DNS cutover.
- [ ] Protected PR approval and production promotion remain release events; no
  agent self-approval or branch-protection bypass is authorized.

## 2. Build, crawl and performance

- [x] `pnpm --filter @kairali/site-abhilashkr lint` — exit 0.
- [x] `pnpm --filter @kairali/site-abhilashkr build` — exit 0; 42 generated
  pages, 36 localized top-level pages, one public essay, only OG/feed dynamic.
- [x] `pnpm audit --audit-level=high` — no known vulnerabilities.
- [x] Final sitemap crawl: 37/37 URLs return 200. Batch 1 = 25; batch 2 = 12.
- [x] Internal target crawl: 40/40 unique internal targets return 200. Batch 1 =
  25; batch 2 = 15.
- [x] Zero browser console errors on English, German and French representative
  routes; no server errors when all four protected draft URLs are requested.
- [x] Lighthouse mobile budgets: `/` 98/100/100; public essay 92/100/100;
  `/de` 95/100/100; `/fr` 98/100/100 (performance/accessibility/SEO).
- [x] Self-hosted fonts remove the intermittent Google Fonts build dependency.

## 3. International and search surfaces

- [x] English root is `x-default`; German `/de`; French `/fr`.
- [x] Twelve English/German/French page families use one central semantic route
  map, including meaningful German and French slugs.
- [x] Every localized document emits the correct `html lang`.
- [x] All 36 top-level pages emit reciprocal `en`, `de`, `fr` and `x-default`
  alternates. The English-only essay does not claim a false translation.
- [x] Titles are present and no longer than 60 characters on all 37 sitemap URLs.
- [x] Descriptions are present and no longer than 155 characters on all 37 URLs.
- [x] Every sitemap URL has a self-canonical and exactly one H1.
- [x] `robots.txt`, `sitemap.xml`, `llms.txt`, RSS and OG/Twitter metadata exist.
- [x] 37/37 JSON-LD sets parse: Person globally; ProfilePage on localized pages;
  FAQPage on FAQ routes; BlogPosting on the public essay.
- [x] The sitemap contains 37 canonical URLs and locale alternates.
- [~] Search Console ownership and the existing sitemap submission are verified.
  Re-submit the same sitemap after production; Bing Webmaster is not verified.
- [~] `keyword-map.md` is a fact-safe intent map without invented volume.
  Paid volume/competitor evidence has not been purchased or fabricated.

## 4. Content and publication safety

- [x] Four `draft: true` essays are excluded from writing lists, command search,
  sitemap, feed and static params and each returns 404.
- [x] The one public essay remains public and carries BlogPosting schema.
- [x] Fabricated reviewer fallback removed: missing reviewer now reads “Not
  listed”; colophon reads “author publication.”
- [x] German and French copy preserves entity and award facts. Long-form English
  essays are not represented as translated.
- [x] Compliance, brand, banned-string and CTA-label site lints pass.
- [~] Honest-YMYL automation currently scans only whatisayurveda.com. The public
  clinical essay received manual publication-surface review, but this repo gap
  prevents claiming the YMYL automation covered Abhilash.

## 5. UX, accessibility and assets

- [x] English, German and French desktop/mobile screenshots are committed under
  `screens/` and visually inspected.
- [x] 375px viewport width equals document scroll width (375px) on EN/DE/FR;
  localized labels do not cause horizontal overflow.
- [x] Mobile header uses an `AKR` mark and reflowed controls; interactive header,
  menu, language and theme controls meet the 44px floor.
- [x] Lighthouse accessibility = 100 on all four representative templates.
- [x] Content images on all 37 rendered pages have an alt attribute.
- [x] Favicons render at 32, 180 and 512px; existing ICO retained.
- [x] OG image endpoint returns PNG and the committed representative card is
  exactly 1200×630.
- [~] The repository has no wired axe-core job for this site. Lighthouse and
  factory accessibility checks are evidence, not a substitute for axe.

## 6. Contact, privacy, analytics and listings

- [x] Contact is honestly implemented as a prefilled `mailto:` routed through
  the visitor's own email client; there is no false backend success claim.
- [x] No CRM, checkout, price, inventory, ad campaign, ad pixel or chatbot is
  introduced for this personal site.
- [x] Analytics code is inert when no measurement ID exists.
- [ ] GA4 property/stream creation is blocked at Google's owner-binding terms
  acceptance. GA4, GTM and analytics consent must stay off until that legal
  action and the privacy/controller approval are complete.
- [x] Google Business Profile is not created: the known facts do not establish a
  customer-facing location or service-area business eligible for a listing.
- [x] The verified LinkedIn profile and media/recognition pages are linked.

## 7. Human and post-release gates

- [ ] Deepu: execute `DEEPU-QA-HANDOFF.md` against the immutable preview in
  `preview-2026-08-11.md`.
- [ ] Owner: view and approve the exact preview after CI.
- [ ] CI: full-history secret scan and release-diff security review.
- [ ] Optional external design/cross-model reviews are not run; no paid API call
  was authorized or fabricated.
- [ ] OWASP ZAP baseline is not wired; record it as an open security enhancement.
- [ ] Day 1: production route/hreflang/draft/OG checks and sitemap re-submission.
- [ ] Day 7: GSC coverage/CWV/broken-link and query spot-check.
