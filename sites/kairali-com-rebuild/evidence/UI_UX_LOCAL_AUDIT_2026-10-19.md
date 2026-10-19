# Kairali.com UI/UX refinement audit — 19 October 2026

Scope: homepage and shared header/footer/consent UI on `codex/kairali-premium-clean-urls`. No deployment or production change.

## Initial findings

### P0

- The inactive newsletter checkbox is enlarged to roughly 114×48px because `.newsletter input` styles every input type as a text field. The rule must target the email input only.
- The mobile consent bar occupies a large part of the 390px viewport and obscures page CTAs and footer content. It needs a compact mobile layout, safe-area padding, and non-wrapping equal controls.
- In local React Strict Mode, the search query initialization runs twice and the URL-sync effect clears `?q=…`, leaving the search empty. URL synchronization must wait until the initial query has been read.

### P1

- Mobile sticky header height can be reduced without shrinking its 48px controls, leaving more usable content space.
- Topbar and footer text links have visual hit areas below the preferred 44px mobile target.
- Footer newsletter spacing and inactive-preview notice need a tighter hierarchy, while retaining the full compliance message and disabled submission state.
- Brand tiles and dark-surface links need clearer keyboard focus treatment.

### Verified baseline

- No horizontal overflow at 375, 390, 430, 768, 1024, 1280, 1440, or 1920px.
- After scrolling lazy content into view, all homepage images load at 390 and 1440px.
- Desktop hero, pathways, Healing Village, image mosaic, and products composition retain the approved editorial structure.
- Current local font assets are Kurale, Asap, and Lato. Gelasio and Roboto are not present, so this pass keeps the existing approved local fonts rather than adding a network dependency.

## Files intended for this pass

- `site/app/globals.css` — shared responsive, touch-target, consent, footer-form, focus, and spacing fixes.
- `site/app/page.tsx` — only if validation finds a structural homepage defect; existing content and destinations remain unchanged.
- `site/components/SearchPage.tsx` — keep legacy and clean search queries stable during client initialization.

## Validation results

- TypeScript: PASS.
- Next.js 16.3.8 production build with Webpack: PASS; 239 pages generated.
- Brand lint: PASS with 0 errors and 6 existing dark-surface marigold warnings.
- Existing interaction suite: 46/46 PASS.
- Browser QA at 375, 390, 430, 768, 1024, 1280, 1440, and 1920px: zero horizontal overflow, zero broken images and zero console errors.
- Mobile drawer and desktop mega-menu keyboard open/Escape/focus-return checks: PASS.
- Search regression: legacy `/search-results.aspx?q=panchakarma` reaches `/search?q=panchakarma` and renders 10 indexed results.
- Newsletter checkbox is 20×20px; mobile header is 81px; mobile footer links are at least 44px high; fresh mobile consent banner is 129px high.

## Group Profile and route-family refinement

- Replaced the Group Profile’s generic legacy stream with a semantic editorial sequence for history, the founder’s message, leadership, mission and vision.
- Mapped every leadership portrait to the verified source name and role. Founder photography is explicitly captioned as K.V. Ramesh and Gita Ramesh; the message is attributed to K.V. Ramesh.
- Removed unsupported medical language from the shortened founder presentation while retaining the documented Ayurveda-and-hospitality purpose.
- Rebuilt the Photo Library landing as three responsive collection cards and removed the source’s blank olive placeholder asset.
- Rebuilt all three linked photo collections as responsive editorial grids. Source photography and captions remain; outdated promotional paragraphs and unsupported treatment claims are not promoted.
- Corrected the Group Profile visible heading and unique metadata title, and added a unique description for blog pagination.
- Made award/news browsing deterministic in server HTML: all records remain crawlable, while only the applicable first 12 are visible before and after hydration.
- Stabilised search facet availability until the index is loaded and made award-detail back links reveal their exact record after clean-route navigation.
- Removed remaining forced-uppercase CSS from the homepage and leadership roles in line with the owner feedback gate.

## Final validation

- Next.js 16.3.8 production build with Webpack: PASS; 239 pages generated.
- Brand lint: PASS with 0 errors and 6 existing dark-surface marigold warnings.
- Interaction suite: 46/46 PASS.
- Owner-feedback suite: 150/150 PASS.
- MID-15049 suite: 19/19 PASS.
- Chromium + WebKit round 2: 76/76 PASS.
- Document hub: 12/12 maintained collections and current PDFs PASS.
- Full verifier: 179/179 route dispositions, 72/72 byte-identical legacy PDFs, 274/274 rendered images, 313/313 internal links and 149/149 sitemap URLs; 0 failures.
- Source-to-render register: no unclassified parity omissions.
- Group Profile and Photo Library progressive-scroll QA at desktop and 390px mobile: zero broken images, zero horizontal overflow and zero console errors.

## External acceptance still required

- Real-device iPhone Safari evidence must be captured on the exact hosted preview, with device model, iOS/Safari version, URL and date.
- Authenticated hosted route/PDF/image/link/OG/noindex/Lighthouse evidence must be captured after the maintainer deploys the final SHA.
- GA4/GSC least-privilege property IDs, roles and access proof must come from the Sysadmin; analytics stays off.
- Production deployment, DNS cutover, forms and analytics remain outside MID-15049 until their separate approvals are supplied.
- Cross-model design triangulation was not run. It remains logged as pending; no dual-model PASS is claimed.
