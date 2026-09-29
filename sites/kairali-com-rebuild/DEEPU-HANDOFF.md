# DEEPU-HANDOFF — kairali.com rebuild

Prepared 29 September 2026. Target completion: **Saturday 3 October 2026**.
- **Owner of completion:** Deepu, assignment reused as MID-15049 via COS; Sunaj in CC. (banned-string-allow: deepu-name-conflation: internal developer handoff)
- **Publishing:** Codex publishes the working build to the private repo `kairali-digital/kairali-web-factory` under `sites/kairali-com-rebuild/`, with `site/` as the app root. The Vercel project is `kairali-web-factory` (staging host `kairali-web-factory.vercel.app`).
- **No domain cutover is requested.**

**Status in one line:** the initial implementation and requested navigation corrections are running and tested locally, but it is **not launch-ready**. Forms are mocked (they validate and send nothing), recipients and integrations are unconfirmed, 13 owner questions are open, and GA4 is installed behind consent but not verified firing.

---

## 1. Run it (portable — no source audit, image library or external drive needed)

Requirements: Node ≥ 22, pnpm 11 (`corepack enable`) and Python 3.9+ (for the test scripts only).

```bash
cd site
pnpm install --frozen-lockfile
pnpm build                  # SSG, 156 routes
pnpm start                  # http://127.0.0.1:8774  (package.json binds 127.0.0.1:8774)
```

- **Legacy documents:** `site/public/download/` holds the 72 legacy documents (473 MB). They are included in this publishing repository so deployments do not fetch from the old website. To restore or verify them from any folder of originals:
  ```bash
  python3 scripts/restore_legacy_docs.py --from /path/to/legacy-documents
  python3 scripts/restore_legacy_docs.py --check-only
  ```
  Both verify SHA-256 against `site/content/legacy-docs.json`.
- **Everything else is bundled in git:**
  - page content: `site/content/*.json`
  - optimised media: `site/public/media` (29 MB)
  - share images: `site/public/og`
  - brand SVGs: `site/public/brand`
  - self-hosted fonts and their licences: `site/public/fonts`
  - test reference data: `reference/`

**Environment variables** (set them in Vercel per environment; no secrets are needed):

| Variable | Local | Staging (kairali-web-factory.vercel.app) | Production (after approved cutover) |
|---|---|---|---|
| `SITE_ENV` | unset (preview) | **`preview`** — keep this even on the Vercel production alias | `production` |
| `NEXT_PUBLIC_ASSET_ORIGIN` | unset | `https://kairali-web-factory.vercel.app` | unset (defaults to `https://www.kairali.com`) |
| `NEXT_PUBLIC_GA4_ID` | unset | may be set; **never loads in preview** | `G-XKRP6ZF1R6` (from the live kairali.com, see §5) |
| `NEXT_PUBLIC_GTM_ID` | unset | unset | only if a genuine kairali.com container exists; if set, GTM replaces direct GA4 (configure GA4 inside GTM) |
| `NEXT_PUBLIC_CLARITY_ID` | unset | unset | **none found for kairali.com**; do not reuse the KTAHV Clarity project |
| `GOOGLE_SITE_VERIFICATION` | unset | unset | only if the Search Console owner provides a meta token (DNS verification needs nothing here) |

Anything other than `SITE_ENV=production` gives:
- an `X-Robots-Tag: noindex, nofollow` header;
- a robots meta `noindex`;
- `robots.txt` with `Disallow: /`;
- `Cache-Control: no-store` on HTML;
- no analytics at all.

Canonicals always point to `https://www.kairali.com`.

## 2. Code and content map
- **App code:** `site/app` (routes), `site/components`, `site/lib`, and `site/proxy.ts` (legacy `.aspx` and query routing, case redirects, real 404s).
  - `LegacyPage` renders every family.
  - `Browse`/`Lists` handle awards, certifications, news and the Group Profile pillars.
  - `Form` provides the synthetic forms.
  - `Analytics` is consent-gated.
- **Content (canonical, bundled):**
  - `pages.json`: 150 route records from the live capture, each with its source URL and SHA-256.
  - `awards-browse.json`: 77 records with source-stated years, type, entity and validity, plus 3 certificates verified from scans.
  - `news.json`: 172 dated whyayurveda.org company posts.
  - `downloads.json`: 12 current portal collections (100 editions) and 72 dated earlier editions.
  - Also: `events.json`, `accreditations.json`, `form-options.json`, `photos.json`, `videos-status.json`, `route-table.json`, `legacy-docs.json`.
- **Provenance:**
  - `pipeline/out/media-log.csv`: 357 page images with the SHA-256 of each original.
  - `pipeline/out/selected-photo-provenance.csv`: 16 selected photos, all `register_ok`.
  - `pipeline/out/deliberate-changes.csv`.
  - `evidence/metadata-register.csv`.
  - `evidence/source-to-render.csv`.
  - `evidence/parity-classification.csv`.
- **Regeneration only:** `pipeline/*.py` rebuilds the content JSON from the original audit capture and image library. **Deepu does not need these to run, build or deploy the site.** (banned-string-allow: deepu-name-conflation: internal developer handoff)

## 3. Tests (all run against a served build; set `BASE=` to test a deployed URL)

| Command | What it proves | Last result (29 Sep) |
|---|---|---|
| `python3 site/tests/verify.py` | Covers all 215 mapped routes plus observations: status and redirects, byte-exact documents, rendered images, internal links, per-page SEO (title, description, canonical, OG, Twitter, JSON-LD, noindex), sitemap, and no Google Fonts | 179/179 routes, 72/72 documents, 288/288 images, 304/304 links, 149-URL sitemap, **0 failures** |
| `python3 site/tests/registers.py` | Classifies every page-copy block not found on its own page (see §4) | 208 unmatched, all classified, 0 "REVIEW" |
| `node site/tests/interact.mjs` | Keyboard, menus, forms (errors and "not sent" state, no POST), search, downloads, reduced motion, no-JS rendering, 320 px reflow, fonts, lab CLS/LCP | 39/39 |
| `node site/tests/owner-feedback.mjs` | Square edges, no ALL CAPS, mobile section navigation and anchors, overflow at 1440/390/360 px | 150/150 |
| `node site/tests/round2.mjs` | Round 2 (below), in Chromium **and WebKit** | 76/76 |
| `node site/tests/screens.mjs` | 28 families at 1440 and 390 px | 56 captures, 0 overflow |

Playwright 1.62.1 is a dev dependency. On a new machine, run `pnpm exec playwright install chromium webkit` once.

## 4. Content parity — not "passed"; fully accounted
- 2,846 distinct audit page-copy blocks were compared on 152 pages. **208 blocks (4,616 of 61,871 words, 7.5%) are not found as contiguous text on their own page.** Each one is classified in `evidence/parity-classification.csv`:
  - **145 blocks / 4,250 words:** Group Profile award records. They were moved deliberately (owner round 2: a concise profile), and 145 of 145 are verified as rendered on `/kairali-group-awards.aspx` or on their own award-detail pages.
  - **20 / 73:** form validation messages, shown only on error in the rebuilt forms.
  - **13 / 30:** CAPTCHA labels. The image CAPTCHA is retired, and a production anti-spam service is pending.
  - **7 / 91:** consent labels, rebuilt with links.
  - **5 / 95:** application industry/company checkbox groups, re-laid-out as field options.
  - **5 / 20:** opener buttons. The text is present but interleaved with screen-reader text.
  - **4 / 26:** the old AJAX search shell.
  - **3 / 21:** hidden popup shells.
  - **3 / 3:** gender, age and address labels removed per owner Q7.
  - **2 / 4:** empty phone stubs.
  - **1 / 3:** the old misspelt heading "Kairali Awards & Accrediations".
- **Unresolved:** none are unexplained. The owner still has to accept the moved-records decision and the Q7 removals as part of the acceptance review.

## 5. Measurement audit (genuine IDs only)

| Tool | Evidence | Status |
|---|---|---|
| GA4 `G-XKRP6ZF1R6` | Direct gtag.js on all captured live kairali.com pages (29 Sep capture) | **Installed in code** behind `NEXT_PUBLIC_GA4_ID`, production-only and consent-gated (Consent Mode default denied). Verified locally: no request before consent; one gtag loader after Accept; none after Decline; no form data in the dataLayer. **Firing into GA4 is NOT verified** (the request was blocked in tests), and **GA4 property access is NOT verified**. |
| UA-1014497-1 | Legacy ga.js on live pages | Universal Analytics has been retired; **not installed**. |
| UA-41990250-1 | 5 live pages, created for `ayurvedichealingvillage.com` | AHV scope; **not reused**. |
| GTM | None in the capture or company configs | Not configured. Supported via env if a genuine kairali.com container is supplied (it then replaces the direct GA4 tag, avoiding double counting). |
| Clarity | None for kairali.com (the Clarity project available is KTAHV) | Not configured. |
| Search Console | No verification meta in the capture | Access unknown. Supported via `GOOGLE_SITE_VERIFICATION`; DNS verification is preferred at cutover. |

- **Events:** page views only. No form field values and no health information are ever sent.
- **Consent banner:** appears only in production with an ID configured. Staging never loads analytics.

## 6. SEO / readiness matrix

| Area | Local/staging state | Verified by | Pre-live action |
|---|---|---|---|
| Titles / descriptions | distinct on all indexable pages. Live values are kept where distinct; 92 titles and 89 descriptions were rebuilt from page H1/copy where the live site duplicated them | verify.py, metadata-register.csv | Owner review of changed metadata (optional) |
| Canonicals | Absolute `https://www.kairali.com` + exact legacy path and query | verify.py | None |
| OG + Twitter cards | 1200×630 company photographs with alt text; `summary_large_image` | verify.py; staging build test | Set `NEXT_PUBLIC_ASSET_ORIGIN` on staging, then **fetch-test the images on the deployed URL** (not yet verified). Remove it at cutover so images use www.kairali.com. |
| Sitemap / robots | 149 canonical 200 URLs. `robots.txt` disallows all in preview; in production it allows, excludes `/x/` and search, and lists the sitemap | verify.py; production-mode build test | Submit the sitemap in Search Console after cutover |
| Noindex | Header, meta and robots in every non-production build | verify.py; staging build test | Keep `SITE_ENV=preview` on the staging alias until the domain launch is approved |
| Structured data | Organization, WebSite, BreadcrumbList, Article (award details) and Event (World Wellness Weekend, past). No VideoObject (upload dates unverified); no ratings or reviews | verify.py (JSON parses; types present) | Run Google's Rich Results Test on the deployed URL (not yet done) |
| Legacy redirects | One-hop 301s for `default.aspx`, Namaste Dwaar and case variants. `detail.aspx?page=` is byte-exact; unknown values return 404 | verify.py (179 dispositions) | Re-run `verify.py` with `BASE=` pointing at staging |
| Image alt / dimensions | 288/288 rendered images have alt and width/height | verify.py | None |
| Mobile / performance | 0 overflow at 390 and 360 px; lab LCP 92 ms, CLS 0.000 (local, unthrottled) | interact.mjs, screens | Field Core Web Vitals after launch; a throttled mobile Lighthouse on staging |
| Fonts | Self-hosted OFL fonts; 0 Google Fonts requests | interact.mjs | None |

## 7. Owner round 2 — what changed (verified on the served build)

1. **Rounded corners.** Computed-style audits in Chromium and WebKit, at desktop and mobile widths, found:
   - WebKit on mobile drew native `<select>` elements with a **5 px radius**, and inputs and buttons kept `appearance: auto`. Fixed with `appearance: none` everywhere, a custom square select chevron, and a square file-selector button.
   - No image artwork has baked-in rounded corners (61 raster images checked).
   - Local HTML was served with `s-maxage` caching. Local and preview HTML now sends `no-store` so an open tab can't show pre-change styling.
   - Ports 8772 and 8773 on this Mac run old wireframe-proof servers with rounded prototype styling; they are not this site.

   **The exact screen the owner saw is not identified.** The owner should re-check after a hard reload on http://127.0.0.1:8774.

2. **Navigation.** Home was removed from the "Our group" submenu. The logo and breadcrumbs still link home.
3. **News (`/kairali-news.aspx`).**
   - A "Recent (last 12 months)" / "All news" toggle, newest first.
   - Year and topic filters, search, "Show more" in pages of 12, and a no-results state.
   - 172 real dated posts from whyayurveda.org. Nothing was invented.
4. **Group Profile.**
   - **Why the original template failed:**
     - The source "Our brands" block held two responsive copies of the same four pillars (a mobile carousel and a desktop circular leaf diagram built from absolute positioning and CSS backgrounds) without the desktop/mobile markers the extractor recognises, so both were flattened into duplicate lists.
     - The page embedded all 77 award records at full image width (about 47,000 px).
     - The scroll-reveal animation left below-fold content at opacity 0 in full-page captures.
   - **New shared brand-overview template:** four business pillars with company photographs, the verbatim source items, internal links and sub-brand sites, then the source prose (milestones, founder's message, management team, mission), then the six latest dated awards linking to the full collection.
   - **Result:** 9,390 px at 1440 px width (was 57,636) and 13,914 px at 390 px width.
5. **Awards and certifications.**
   - **Approach:** I weighed three options:
     - numbered pages, which add duplicate URLs;
     - year accordions, which make combined filtering awkward;
     - one server-rendered list with client-side filters and "Show more".

     I chose the third: every record stays crawlable, legacy detail URLs are untouched, and pages stay short.
   - **Browsing:** newest first; filters for year (including "Date not stated"), type and recipient; pages of 12.
   - **Detail pages:** "Back to awards" links land on the record, even when it is beyond the first page.
   - **Certifications,** grouped by verified validity:
     - **Current:** NABH AH-2024-0250 (to 24 Apr 2027) and the Kerala clinical registration (to 2 May 2028).
     - **Historical:** Ayur Diamond, lapsed 23 Jul 2026.
     - **Validity not stated:** 11 kairali.com certification records.
   - **Dates:** years come only from a record's title, listing text or an explicit date in the record; 10 records say "Date not stated".
   - **Mobile:** filters sit in an accessible disclosure.
   - **Also applied to:** site search (pages of 20). The short lists (openings, locations, testimonials, video libraries) deliberately get no filters.
6. **Preserved.** Square edges, natural casing, the mobile "On this page" navigation, the 215-route mapping and all content. Evidence is in `evidence/round2/` and `evidence/rounded-audit/`.
7. **Handoff.** This document.

## 8. Pre-live blockers (not launch-ready until all are closed)
1. **Forms are mocked** and deliberately say "Details checked — not sent". To go live they need:
   - recipients per form (owner Q8);
   - a server endpoint or CRM;
   - auto-reply, consent and retention wording;
   - medical-data handling for the consultation;
   - CV upload storage and scanning;
   - a production anti-spam service (for example Turnstile) with server-side verification.
2. **Owner answers to `OWNER-QUESTIONS.md` (13):**
   - health-claim wording, the stats band and "24 more centres";
   - legal entity name, office address and privacy policy text;
   - the canonical products domain;
   - whether openings are still current;
   - centre directory, founding year and Svata rates.
3. **Measurement:** confirm GA4 property access and verify real-time firing on production; confirm Search Console ownership. Supply GTM/Clarity only if genuine kairali.com IDs exist.
4. **Staging verification:** social-card fetch, Rich Results Test, `verify.py` against the staging URL, and a throttled mobile Lighthouse run.
5. **Documents:** Cody's review of the 34 name-matched replacements (due 5 Oct). Until then, all 72 legacy files stay available and dated, with no redirects.
6. **Brand:** approvals for the proposed tokens. Heritage engraving and paper-texture artwork are not supplied, and there is no horizontal logo lockup.
7. **Cutover:** set `SITE_ENV=production` and the production domain only when the domain launch is approved.

## 9. Saturday 3 October — Deepu acceptance checklist (banned-string-allow: deepu-name-conflation: internal developer handoff)
- [ ] Fresh clone installs and builds (`pnpm install --frozen-lockfile && pnpm build`) with no external paths.
- [ ] `scripts/restore_legacy_docs.py --check-only` reports 72/72 (or the publishing checkout contains them).
- [ ] Local `verify.py` shows 0 failures, and `registers.py` has 0 "REVIEW" items.
- [ ] `interact.mjs` 39/39, `owner-feedback.mjs` 150/150, `round2.mjs` 76/76.
- [ ] Staging deploy (by Codex): `verify.py` with `BASE=https://kairali-web-factory.vercel.app` shows 0 failures, and noindex is confirmed on every page.
- [ ] OG/Twitter images load from the staging asset origin (paste 3 URLs into a card validator).
- [ ] Rich Results Test on 1 award detail page and the Group Profile shows no errors.
- [ ] Owner visual review on staging, including a hard reload, desktop and iPhone (Safari): square edges, no ALL CAPS, Group Profile length, and the news/awards browsing.
- [ ] Owner answers recorded for the 13 questions, and copy updated where answered.
- [ ] Form recipients and integration decided. The forms stay mocked on staging until the integration is implemented and tested with synthetic data.
- [ ] GA4 access confirmed. Production firing is tested only after cutover (preview must stay excluded).
- [ ] Remaining gaps recorded in STATUS.md with owners and dates.
