# QA/QC audit — ayurvedafranchise.com (LIVE WordPress, canonical franchise domain per decision #59, lead-gen surface)

- Audited: **2026-07-16 18:40:12 IST** (fetch window 18:26:06–18:37:49 IST)
- Auditor: factory QA pass (findings only, no fixes applied — CLAUDE.md §QA audit pass; D-TWO-LANE ruling 16 Jul 2026: curl-only, no browser tools)
- Method: external raw-HTML capture via `curl` (desktop Chrome UA, `--max-time 20`), byte-level inspection. Read-only GET/HEAD only; no forms submitted, no POSTs sent.
- Sample: 12 page captures — `/`, `/franchise-model-opportunity/`, `/contact-us/`, `/about-us/`, `/locations/`, `/faqs/`, `/success-story/`, `/awards/`, `/enquire-now/`, demo post `/welcome-to-flatsome/`, `/author/admin/`, one deliberate 404 probe — plus `robots.txt`, sitemap index + all 9 child sitemaps, http/www redirect probes, 5 dead-link probes, 12-image HEAD sample, favicon, xmlrpc GET probe, 2 external-host image probes.
- Context honoured: **Q-FR-ROYALTY open** — financial specifics inventoried verbatim below, truth not judged. No production write of any kind.

---

## SECURITY VERDICT (rule r screen): **CLEAN**

- Zero `<marquee>`, zero casino/gambling/betting/poker/bookmaker keywords, zero zero-width characters (U+200B/C/D), zero `eval(`/`atob(`/`String.fromCharCode` in inline scripts, across all 12 captures + sitemaps + robots.txt.
- No fetched content contained text addressing an AI agent or embedded instructions — nothing quarantined.
- External `<script src>` inventory site-wide: `www.google.com/recaptcha/api.js` only. External iframes: Google reCAPTCHA fallback + one Google Maps embed. No third-party analytics, no unknown script hosts.
- Sole third-party asset host is `knew.openlogicsys.com` (the WP vendor's dev server — hygiene finding #6, not an injection).
- 404 handling correct: `/qa-nonexistent-probe-20260716/` → HTTP 404, normal theme page (`<title>Page not found – Kairali</title>`, "Oops! That page can't be found."). No soft-200.

---

## LOCKED-FACTS RESULT: **FAIL — 1 confirmed violation + register-review flags**

- **VIOLATION (sitewide, 12/12 captured pages incl. the 404 page):** footer prints `Copyright 2026 © Kairali Ayurvedic Group Since 1908.` — "Since 1908" attached to the **GROUP**, which is WRONG per the PR #65 ruling (1908 = family lineage only; Group founded 1989). Evidence: `home.html` footer, exact string above, identical on every capture.
- **Same-class age claim, homepage hero:** "Kairali is a **centenarian** Ayurvedic brand" (`https://ayurvedafranchise.com/`, text block `text-206919139`) — a 100+-years claim attached to the brand. Flag with the 1908 violation.
- **Internal inconsistency (register review, not judged):** `/franchise-model-opportunity/` says "Kairali group founded in the year 1989" (matches locked fact) **and** "pharmaceuticals division which started in the year 1948" — so the site simultaneously claims 1908 (footer), centenarian (home), 1948 (pharma), 1989 (group).
- **Banned phone `+91 92898 38777`: ABSENT** (all spacing variants grepped, all 12 captures). Correct `…38797` also absent — zero occurrences of either; nothing to scrub on this site.
- **`info@kairali.com`: ABSENT.** Public contact printed is `franchise@kairali.com` (home + `/contact-us/`) with `IVR : +91-9555156156`. Locked fact says public contact email everywhere = info@kairali.com — **register-review flag for Abilash** (franchise@ may be an approved departmental line; not asserted as a violation).
- **Frozen rolling numbers (typed, not computed):** `/about-us/` founder's message: "Over two decades ago, i.e., 1989" (2026 − 1989 = 37 years — copy frozen since ~2009); "Ramesh has 40 years of experience" (typed literal).

---

## Q-FR-ROYALTY INVENTORY — financial specifics the live site publishes (verbatim, truth NOT judged)

All on `https://ayurvedafranchise.com/faqs/` unless noted:

1. **Domestic royalty:** "For Domestic Franchise – Rs. 25000.00 or 5% of the Net sales made from services plus applicable tax; whichever is higher will be collected monthly as royalty by Kairali."
2. **International royalty:** "For International Franchise – USD 1000.00 or 7% of the Net sales made from services, whichever is higher will be charged monthly and collected quarterly as royalty by Kairali."
3. **Area:** "For Two Treatment Room Model Setup– 1500 Sq. Ft. For Four Treatment Room Model Setup – 2100 Sq. Ft."
4. **Investment / technical service fee:** NOT printed anywhere. The FAQ "What is the average investment and Technical service fees to own a Kairali franchise?" answers only with two raw links — `http://www.ayurvedafranchise.com/treatment-centre-franchise-india.aspx` and `http://www.ayurvedafranchise.com/spa-franchise-international.aspx` — **both verified HTTP 404** (probed 18:31 IST). No ₹/lakh/crore capex figure exists in the sample.
5. **Fee discounts:** "Yes, it can be discussed & negotiated…" (also duplicated on homepage FAQ block).
6. **Time to open:** "Post licensing and administration work will normally take 90 days (can vary from location to location)." (faqs + home).
7. **Territory protection:** "The minimum distance between Kairali centers would be 10 km to 15 km."
8. **Staffing cost:** doctors/therapists placed "at an affordable cost who will be at franchisee's pay roll" — no figure.
9. Footer link "Initial Investstment" (sic) → `initialinvestment.aspx` → **HTTP 404** — the one page that would carry investment numbers is a dead link sitewide.

---

## Findings (severity-ranked)

1. **L / https://ayurvedafranchise.com/ (head)** / **Homepage title is `<title>Kairali – Just another WordPress site</title>`** — the default WordPress tagline is live in the SERP title of the canonical franchise lead-gen domain. Also: **zero meta descriptions on all 12 captured pages, zero Open Graph/Twitter tags, zero JSON-LD anywhere** (no Organization, no FAQPage despite two FAQ surfaces). Fix (S): set tagline + Yoast/RankMath titles & descriptions; add Organization + FAQPage schema.
2. **L / sitewide** / **No analytics of any kind** — grep for GTM/gtag/GA4/UA/fbq/clarity across all 12 captures = 0 hits. A lead-gen surface with CF7 lead forms (hidden fields `lead_id`, `lead_source_url`, `submit_datetime` prove lead-capture intent) has no conversion or traffic measurement at all. Fix (S): install GA4/GTM.
3. **L / sitemap + live URLs** / **Flatsome theme demo content is live and indexable**: `wp-sitemap-posts-post-1.xml` lists 9 demo posts (`/hello-world/`, `/welcome-to-flatsome/`, `/velkommen-til-bloggen-min/`, `/a-simple-blog-post/`…), 8 demo portfolio items (`/featured_item/flat-t-shirt-company/`, `/lookbook-summer/`…), 10 theme block URLs (`/blocks/search-box/`…), demo tags (`/tag/brooklyn/`, `/tag/fashion/`…). Spot-probes `/welcome-to-flatsome/`, `/hello-world/`, `/blocks/features-overview/`, `/featured_item/flat-t-shirt-company/` all HTTP 200, self-canonical, **no noindex anywhere on the site**; `/welcome-to-flatsome/` carries Lorem ipsum ×5, `/author/admin/` archive ×11. Google can index t-shirt-company portfolio pages on the franchise domain. Fix (M): delete/draft all demo content or noindex it; regenerate sitemap.
4. **L / sitewide footer (every page)** / **All 12 "USEFUL LINKS" are dead**: relative `.aspx` hrefs copied from the old ASP.NET site (`default.aspx`, `why-franchise-with-kairali.aspx`, `franchise-model-opportunity.aspx`, `kairali-franchise-support.aspx`, `accreditation.aspx`, `initialinvestment.aspx`, `ayurvedic-treatments.aspx`, `ayurvedic-products.aspx`, `spa-equipments.aspx`, `media-gallery.aspx`, `news-and-articles.aspx`, `sitemap.aspx`) — resolve on this WP domain and 404 (3 probed: `initialinvestment.aspx`, `accreditation.aspx`, `sitemap.aspx` all HTTP 404; identical pattern for the rest). Anchor-text typos included: "Accredition", "Initial **Investstment**", "Spa Equipment's". Fix (S): repoint to real WP pages or delete the block.
5. **M / https://ayurvedafranchise.com/faqs/** / **Investment-question links dead** — the two `http://www.ayurvedafranchise.com/*.aspx` hrefs in the "average investment" FAQ answer are plain-HTTP self-links to pages that 404 (evidence in Q-FR-ROYALTY §4). The single most commercially important question on the page has an unreachable answer. Fix: content decision (Q-FR-ROYALTY) — do not invent figures.
6. **M / https://ayurvedafranchise.com/success-story/ (×12) + /franchise-model-opportunity/ (×1)** / **13 images hotlinked from the vendor's dev server over plain HTTP**: `http://knew.openlogicsys.com/wp-content/uploads/2022/07/ayurvedafranchise-leaf.png` (×12) and `…four-circle-800x165.png` (×1). Both probed → **connection fails entirely (curl exit, HTTP 000)** — these render as broken images, are mixed content on an https page, and leak the dev host (openlogicsys.com) in production markup. Fix (S): upload the 2 files to this site's media library and search-replace.
7. **M / sitewide footer** / **"NEWSLETTER SIGNUP — Subscribe to Receive Latest News and Updates" is followed by a site-search form, not a signup form** (`<form method="get" class="searchform" action="https://ayurvedafranchise.com/" role="search">` with `name="s"` search input; verified on all 12 captures). Anyone "subscribing" performs a search. Fix (S): wire a real form or remove the heading.
8. **M / sitewide header** / Flatsome placeholder **"Add anything here or just remove it..."** renders in the top bar on all 12 captured pages. Fix (S): one theme-option edit.
9. **M / forms & consent (render-only check)** / CF7 6.1.4 lead forms render on `/` (form 660) and `/enquire-now/` (form 657, with country/state/city selects) with reCAPTCHA v2 wired (`google.com/recaptcha/api.js` + noscript fallback). But: **no privacy-policy page or link exists anywhere in the sample** (grep "privacy" = 0 hits on all 12 captures), **no consent checkbox** on either form — a lead-gen site collecting name/phone/email with zero privacy notice (DPDP/GDPR gap). And **/contact-us/ has no contact form at all** — CF7 CSS/JS load but the page body is only the address block + "Free Ayurvedic Consultation" text; its only forms are the two theme search boxes. Forms NOT submitted (rule). Fix: publish privacy policy + link it, add acceptance field, restore the contact-page form.
10. **M / https://ayurvedafranchise.com/locations/** / directory data quality: empty template fields printed ("Tel: – –", blank "Tel:", blank "E-mail:" for Prague); heading typo "**CZECK** REPUBLIC"; printed (non-linked) website URLs are dead — `www.kairalicentres.com/NewDelhi-Mehrauli.aspx` (domain doesn't resolve: connection failure) and `www.kairalicenters.com/Hyderabad-BanjaraHills.aspx` (probed → HTTP 404 on the live WP site), plus a bare path "`/Prague-RiegrovySady.aspx`" printed as a "Website:"; **both spellings** kairalicentres.com/kairalicenters.com used; suspect placeholder email `retrofit@kairalicentres.com` for Vadodara; malformed Japan number "81-35-460838757". Per-centre emails on the extra-"r" `@kairalicentres.com` domain ×3 — known rebuild-scope conflict, noted only.
11. **M / copy defects (visible)** / homepage FAQ block: duplicated fragment "…guidance and support of Kairali. **guidance and support of Kairali.**"; stray pipe in "How long will it take to get my **|** Kairali Franchise officially up and running?"; missing space "through **Ayurvedawhere** the services…". `/franchise-model-opportunity/`: "**toprovide**", "**Pallakad**" (Palakkad), "…National Geographic Traveller **.Kairali** group…". Fix (S): copy pass.
12. **S / heading structure** / **0 `<h1>` on all 9 real pages** (home, about, locations, franchise-model, faqs, success-story, awards, enquire-now, contact); the only pages with an h1 are the demo post and the author archive. Fix (S): promote hero headings.
13. **S / index hygiene** / `wp-sitemap-users-1.xml` exposes `/author/admin/` (HTTP 200) — confirms the default `admin` username publicly and serves a thin lorem archive. `<meta name="generator" content="WordPress 7.0.1">` version disclosure in head. `xmlrpc.php` alive (GET → HTTP 405 "XML-RPC server accepts POST requests only"; not POST-probed — read-only rule). No HSTS header (`Server: nginx`, https + 301s otherwise correct: http→https and www→apex both 301, verified). Fix (S): disable users sitemap + xmlrpc, strip generator meta, add HSTS.
14. **S / robots.txt** / present, sane (`Disallow: /wp-admin/` + admin-ajax allow), `Sitemap:` line present → `wp-sitemap.xml` (WP core sitemap, no SEO plugin active — consistent with the missing titles/descriptions).
15. **PASS / link + asset sample** / 9 unique internal nav links HEAD-checked: all 200. 12-image on-domain sample: all 200. Favicon 200. Canonicals present and self-referencing on all captured pages. Viewport meta present sitewide. No hreflang (single-locale site — expected). Google Maps embed present on `/` and `/contact-us/` (embed centre ≈27.73 N 77.92 E vs printed Mehrauli address ≈28.52 N 77.19 E — **~100 km apart; render not verified curl-only, flagged unverified** for the visual pass).

Finding count: **1 security verdict (CLEAN) · 1 locked-facts FAIL (1 violation + flags) · 1 Q-FR-ROYALTY inventory (9 items) · 4 L · 7 M · 3 S · 1 robots note · 1 pass**.

---

## NOT RUN (honest list)

- **Mobile/visual render checks** — no browser/Playwright per D-TWO-LANE (shared pane); viewport meta confirmed in HTML only. Broken-image findings (#6) are inferred from network failure, not screenshots; the map-location discrepancy (#15) is unverified.
- **Form submission tests** — never submit (binding rule). Render-only verified.
- **xmlrpc POST introspection** — read-only GET/HEAD rule; only the GET 405 response recorded.
- **Analytics event firing** — nothing to test (no tags found), and would need a browser.
- **Full-site crawl** — link checking was sample-based (nav + footer + FAQ links + 12-image sample); demo-content URLs spot-probed (4 of 27).
- **Lighthouse/Core Web Vitals, Search Console data, WHOIS/DNS/SSL-chain depth** — out of curl scope this pass.
- **Truth of the royalty/investment figures** — explicitly not judged per Q-FR-ROYALTY; inventoried verbatim only.

---

## DELEGATION SPLIT (proposed — findings only, nothing executed)

**Abilash (register review — decisions):**
1. "Since 1908" footer + "centenarian" hero + "1948 pharma" vs locked 1989 — one ruling for all age claims on this domain (PR #65 lineage rule).
2. Q-FR-ROYALTY: the inventory above is the complete set of published figures; the investment answer is a dead link — confirm/replace figures before anyone re-links them.
3. `franchise@kairali.com` vs locked `info@kairali.com`; `retrofit@kairalicentres.com` and the extra-"r" centre mailboxes.

**Deepu (WP tech):** set site tagline + install SEO plugin (titles/descriptions/schema) (L) · install GA4/GTM (L) · delete or noindex all Flatsome demo posts/portfolio/blocks/tags + regenerate sitemap (L) · replace the 12 dead `.aspx` footer links (L) · self-host the 2 openlogicsys images (M) · fix newsletter block (M) · remove "Add anything here…" top-bar text (M) · restore contact-page form + add acceptance checkbox once privacy page exists (M) · h1s (S) · disable users-sitemap + xmlrpc, strip generator meta, add HSTS (S).

**Anupam (copy):** privacy-policy page draft for legal review (M) · locations data clean-up (CZECK, blanks, dead printed URLs) (M) · homepage/franchise-page typo pass (duplicated sentence, stray pipe, Ayurvedawhere, toprovide, Pallakad, Accredition, Investstment) (M/S).

*Evidence artifacts (raw HTML captures, sitemap dumps, probe outputs) retained in session scratchpad `…/scratchpad/af/` — not committed.*
