# QA audit — villaraag.com (LIVE) — 2026-07-16 16:13:41 IST

Auditor: Claude (QA/QC pass per CLAUDE.md "QA audit pass" — findings only, NO fixes applied).
Method: external fetch (curl over HTTPS from M2; raw HTML analysis). Scope: homepage, stay/room pages (/your-stay/, /harmony-haven-with-steam/, /serenity-suite/), contact/booking (/contact-us/, /book-now/, /enquire-now/), /about-us/, robots.txt, sitemap, 404 handling, broken-link sample, schema, alts, locked facts, mobile viewport. OUT OF SCOPE per brief: redesign/UI-UX, complex SEO, performance.
Register note: Villa Raag = wellness-hospitality register — spa/resort/luxury wording is CORRECT here (KTAHV clinical lock does not apply).
Platform observed: WordPress + Elementor + Yoast, behind Cloudflare (server headers, `x-redirect-by: Yoast SEO`, `cf-edge-cache: platform=wordpress`).

## Findings

### HIGH

- **HIGH** / `https://villaraag.com/ppc-thanks/`, `https://villaraag.com/thank-you/`, `https://villaraag.com/landing-page/` / Conversion/thank-you and PPC landing pages are fully indexable (`<meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1">` confirmed on all three, fetched 2026-07-16 ~16:05 IST) AND all three are listed in `https://villaraag.com/page-sitemap.xml`. Anyone (or Googlebot) landing directly on /ppc-thanks/ or /thank-you/ can fire fake ad/analytics conversions and pollute PPC conversion data on the #3 revenue surface; Google also indexes empty-intent pages. Two of them carry default WP titles: `PPC Thanks - villaraag`, `Landing Page - villaraag`. / Fix (S): set Yoast noindex on all three + exclude from sitemap.

### MEDIUM

- **MEDIUM** / `https://villaraag.com/contact-us/`, `https://villaraag.com/enquire-now/` / Lead forms render and submit (Elementor forms, `name="Contact Us "` and `name="Enquire Now Form"`, 1 submit each) but have **zero consent checkboxes and zero privacy-policy links in or near the form** (regex scan of `<form>…</form>` + 3000 chars either side: no "privacy/consent/agree/terms" match). Site's own /privacy-policy/ page claims GDPR/DPDPA/CCPA/APPI compliance — collecting personal data on the main booking-enquiry funnel without a consent affirmation contradicts it. / Fix (S): add required consent checkbox with privacy-policy link to both Elementor forms.
- **MEDIUM** / sitewide (JSON-LD emitted on every page incl. `https://villaraag.com/`) / Resort schema `"image": ["https://villaraag.com/images/resort.jpg"]` — that URL returns **HTTP 404** (curl check 2026-07-16 ~16:07 IST; real media lives under /wp-content/uploads/). Broken required-ish property degrades lodging rich-result eligibility. Schema type itself is fine: `Resort` (a LodgingBusiness subtype) present sitewide with name/address/geo/telephone/email — presence check PASS. / Fix (S): point schema image at a real uploaded hero image.
- **MEDIUM** / `https://villaraag.com/` / Homepage `<title>` is 87 chars ("Villa Raag | A Transformative Luxury Yoga & Wellness Retreat on Agonda Beach, South Goa") and meta description is **302 chars** — both will be truncated in SERPs (title ~60, description ~160), hurting CTR on brand + "Agonda resort" queries. /book-now/ (204), /enquire-now/ (217), /contact-us/ (191) descriptions also exceed ~160. / Fix (S): rewrite to ≤60-char titles / ≤160-char descriptions in Yoast.
- **MEDIUM (VERIFY — facts, per ESCALATION rule)** / `https://villaraag.com/contact-us/` + `https://villaraag.com/how-to-reach/` / Distance claims: "Dabolim Airport (GOI) – approx. 35 km", "Madgaon Station — ~15 km / ~30 min", "Vasco da Gama Station — ~35 km" (identical on both pages and in the contact-us meta description). Map reality for Agonda is materially different (Madgaon ≈ 37–40 km; Dabolim ≈ 60–70 km) — guests planning transfers off these numbers will be misled. Not asserting the correct figures here — **needs Abilash/property confirmation** before any copy change. / Fix (S after verification): correct distances on both pages + meta.

### LOW

- **LOW** / `https://villaraag.com/` / 5 content images missing `alt` (excl. the FB-pixel noscript img), e.g. `wp-content/uploads/2026/02/arrow-1-1.png`, `wp-content/uploads/2025/09/Group-18.webp` (6 of 11 img tags lack a non-empty alt). / Fix (S): add alts (or `alt=""` if purely decorative).
- **LOW** / `https://villaraag.com/about-us/` / 12 content images missing `alt` (13 of 27 incl. pixel), e.g. `wp-content/uploads/2025/09/01.svg` series. / Fix (S): add alts.
- **LOW** / `https://villaraag.com/your-stay/` / "Know More" card links to `/harmony-haven/` which 301s (`x-redirect-by: redirection`) to `/harmony-haven-with-steam/` — internal link through a redirect on the room-selection path. / Fix (S): link directly to `/harmony-haven-with-steam/`.
- **LOW** / `https://villaraag.com/this-page-does-not-exist-qa-20260716/` / 404 handling PASS on status (real HTTP 404 + `noindex, follow`) but the 404 page has **no H1** and default title `Page not found - villaraag` (lowercase brand). / Fix (S): branded 404 title + H1 + link back to /your-stay/ and /book-now/.
- **LOW** / `https://villaraag.com/harmony-haven-with-steam/` / Title-case inconsistency: `<title>` says "Harmony Haven with steam" (lowercase "steam") vs H1 "Harmony Haven With Steam". Reads as a typo in the SERP. / Fix (S): normalise to "Harmony Haven with Steam".
- **LOW (VERIFY)** / sitewide JSON-LD / Geo coordinates `15.0120, 74.0210` place the pin several km east/inland of Agonda Beach (~15.04, 73.99). Needs property confirmation of exact coordinates. / Fix (S after verification): correct `GeoCoordinates`.
- **LOW (VERIFY)** / `https://villaraag.com/privacy-policy/` + `https://villaraag.com/privacy-statement/` / Two overlapping full-length privacy documents are both live, both indexable, and both linked in the footer ("Privacy Policies – Villa Raag" H1 vs "Privacy Statement" H1). Confusing for users and near-duplicate for Google. Verify which is canonical with Abilash. / Fix (S): keep one, 301 the other (rebuild-scope if legal wants both — skip then).

### INFO / PASS record

- **PASS — LOCKED FACTS**: banned phone `+91 92898 38777` appears **nowhere** on any fetched page (grep across 14 pages: zero hits). `info@kairali.com` also appears nowhere; the site consistently uses `info@villaraag.com` + `+91 9555156156` (page body, footer, and Resort schema all agree). Note for the register: confirm `info@villaraag.com` is the locked contact for this property — internally consistent, so recorded as PASS-with-note.
- **PASS**: exactly one H1 on every in-scope page (home, your-stay, both rooms, contact, book-now, enquire-now, about); self-referencing canonicals on all; `<meta name="viewport" content="width=device-width, initial-scale=1">` on all incl. 404; meta robots index,follow on all in-scope pages.
- **PASS**: robots.txt valid (allows crawl, blocks wp-admin/search, declares sitemap `https://villaraag.com/sitemap_index.xml`; AI-training bots deliberately blocked per its own comments). Sitemap index → page-sitemap.xml valid Yoast XML; **all 79 sitemap URLs return HTTP 200** (full sweep 2026-07-16 ~16:09 IST). Minor: robots.txt points at `/sitemap_index.xml` while `/sitemap.xml` 301s to it — fine.
- **PASS**: no mixed content — zero `http://` src/href resources on any fetched page; `http://villaraag.com` and `https://www.villaraag.com` both 301 → `https://villaraag.com/`.
- **PASS**: booking funnel reachable — /book-now/ in-content "Book Now" button → `https://www.secure-booking-engine.com/accounts/T2YMhOZCo_atV6-dJGvjdQ/properties/kydwtWZIqEqJEsXbNPR9yw/booking-engine/web/source/4wsctBw6Oq6j-g9XuxeRzQ/` → HTTP 200 (live engine). Enquire Now → /enquire-now/ form renders. Broken-link sample (all anchor hrefs across 9 pages, deduped): 0 genuine broken links (`/cdn-cgi/l/email-protection` 404 is Cloudflare email-obfuscation behaviour, resolved by JS — not a defect).
- **PASS**: hreflang `en` + `x-default` present on homepage; EN-only is consistent with a hospitality WP site (no DE/FR brief on record for Villa Raag).
- **INFO**: zero `data-cta` attributes anywhere — the factory analytics convention doesn't exist on this legacy WP build. Rebuild-scope, skip for now (note for the Villa Raag rebuild brief).
- **INFO**: phone rendered inconsistently as `+91 9555156156` (body) vs `+91-9555156156` (schema/tel:) — cosmetic only.

## Totals
HIGH 1 · MEDIUM 4 (2 of which VERIFY-gated) · LOW 7 · INFO 2 · PASS records 6.

## DELEGATION SPLIT

**Deepu (WordPress/technical):**
- Yoast noindex + sitemap exclusion for /ppc-thanks/, /thank-you/, /landing-page/ (HIGH).
- Fix Resort schema: real image URL; apply corrected geo coordinates once confirmed (MEDIUM/LOW-VERIFY).
- Add consent checkbox + privacy link to both Elementor forms (MEDIUM) — copy text from Anupam-Astha.
- Retarget /your-stay/ "Know More" link to /harmony-haven-with-steam/ (LOW).
- Branded 404 template: title, H1, funnel links (LOW).

**Anupam-Astha (content/copy):**
- Rewrite homepage title (≤60) + meta descriptions ≤160 for home, book-now, enquire-now, contact-us (MEDIUM).
- Alt text for homepage (5) and about-us (12) images (LOW).
- Title-case fix "Harmony Haven with Steam" (LOW).
- Draft consent-checkbox microcopy + corrected distance copy — distances ONLY after Abilash/property verification (MEDIUM-VERIFY).

**Sunaj (SEO/analytics):**
- After noindex lands: remove the three URLs in Search Console, confirm sitemap regenerated, request recrawl (HIGH follow-through).
- Decide /privacy-policy/ vs /privacy-statement/ canonical with Abilash; 301 the loser (LOW-VERIFY).
- Validate fixed Resort schema in Rich Results test; monitor lodging rich-result eligibility (MEDIUM follow-through).
- Log data-cta gap into the Villa Raag rebuild brief (INFO, rebuild-scope).

**Escalations to Abilash (per ESCALATION rule — facts):** (1) correct airport/rail distances for Agonda property; (2) exact geo coordinates; (3) which privacy document is canonical; (4) confirm info@villaraag.com as the locked contact email for this property.

---
Checker pass (doctrine f): all claims above are backed by fetched HTML/HTTP evidence captured 2026-07-16 15:57–16:12 IST from the live site. Unverified items are explicitly tagged VERIFY (distances, geo coords, privacy-doc canonical, locked email for this property). No fixes applied, no commits, no git, no one contacted.
