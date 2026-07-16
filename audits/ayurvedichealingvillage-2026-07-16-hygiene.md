# QA hygiene audit — ayurvedichealingvillage.com (KTAHV, live production)

- **Audit run:** 2026-07-16 16:13:26 IST (checks executed 16:06–16:12 IST)
- **Auditor:** agent QA pass (findings only, NO fixes applied — CLAUDE.md QA-audit rule)
- **Scope:** hygiene delta only — titles/metas/h1s/canonicals on key pages, robots/sitemap validity, broken-link sample, mixed content, 404 handling, schema presence, locked facts (info@kairali.com / WhatsApp 38797), form consent render, hreflang EN/DE/FR. OUT of scope: banned-word sweep (delegated to Anupam 14 Jul), indexing investigation (delegated to Vikash 16 Jul), redesign/UX.
- **Method:** live fetches from a real browser session (Cloudflare WAF challenges all curl/plain fetches — `cf-mitigated: challenge`; statuses below are true in-browser statuses, same-origin fetch carrying the CF clearance cookie). www host 301s to apex; all checks on `https://ayurvedichealingvillage.com`.

## Pages audited
`/` · `/online-consultation/` · `/enquiry-form/` · `/contact-us/` · `/how-to-reach/` · `/apply-now/` · `/panchakarma-therapy/` · `/treatment-for-arthritis-and-spondylitis/` · `/de/` · `/fr/` · `bookings.ayurvedichealingvillage.com` (+ status checks on DE/FR contact-family pages, 14 legacy .html LPs, 10-URL internal-link sample, both sitemaps, robots.txt, 404 probe)

---

## Findings

### CRITICAL

- **CRITICAL / NEW · `/contact-us/` is NOINDEXED and has NO canonical.** Evidence: `<meta name='robots' content='noindex, follow'>`, `canonical: null` (fetched 16 Jul ~16:08 IST). The primary contact page of the #2 revenue surface is excluded from Google. `/fr/contactez-nous/` is ALSO `noindex, follow`, while `/de/kontakt/` is `index, follow` — the locale inconsistency indicates this is accidental, not policy. `/contact/` 301s to the noindexed `/contact-us/`. Directly feeds the 3-of-128-indexed problem Vikash is investigating. Fix: S — remove noindex (Yoast/robots setting on the two pages), add canonical.

- **CRITICAL / NEW · Rogue static `/sitemap.xml` (200 OK) serving a stale 210-URL urlset that contradicts the real sitemap.** Evidence: `https://ayurvedichealingvillage.com/sitemap.xml` returns 200 `application/xml`, urlset (not index) of 210 URLs, lastmod 2026-06-20, including all 14 legacy PPC `.html` pages (`/wellness-resort-kerala.html`, `/kairali-cleansing-centre.html`, `/treatment-in-kerala.html`, `/ayurveda-retreat-kerala.html`, `/treatment-in-kerala-russian.html`, `/Kairali_Brand_and_Competition_Neo-original.html` …) and dozens of retreat-era archive pages (`/lakshya-yoga-retreat-2017/`, `/karma-being-retreat-2019/` …) plus `/blog/` which 404s. robots.txt declares only `wp-sitemap.xml`; this second sitemap at the default path is what many crawlers/tools try first. All 14 legacy `.html` URLs verified live at 200 — this file is actively advertising banned-word URLs to search engines during a GST SCN. Fix: S — delete/redirect the static file (likely a physical `sitemap.xml` on the server predating WP core sitemaps); tell Vikash whether it is submitted in GSC. NOTE: goes to Deepu alongside his sitemap_index task — same subsystem.

### HIGH

- **HIGH / CONFIRMS-KNOWN (state verified) · `sitemap_index.xml` → 404. CONFIRMED-STILL-BROKEN.** Evidence: in-browser fetch 16 Jul ~16:07 IST returns HTTP 404 (HTML 404 page, `noindex, follow`). Known issue already with Deepu (MORNING_BRIEF 16 Jul). The working index is `wp-sitemap.xml` (200, 12 children, 594 URLs: EN 193 / DE 146 / FR 140 pages + offers/villas/programs/jobs). Add to Deepu's existing task: either 301 `sitemap_index.xml` → `wp-sitemap.xml` or ensure nothing (GSC, robots ecosystem) still references it.

- **HIGH / NEW · 23 malformed nav/footer links sitewide — menu labels saved as URLs, all resolving to dead `http://` hosts.** Evidence (rendered home DOM, present in the fetched HTML of every page checked): `href="http://Ambulance"`, `http://Villas`, `http://À propos de nous`, `http://Jetzt bewerben`, `http://Sonderangebote`, `http://Traitement Ayurvédique`, `http://Galerie de photos`, `http://Feedback geben`, `http://Aperçu des pages` … (23 unique). These are DE/FR menu items whose URL field contains the label text; every click = DNS error, and they are the only `http://` references on the site. Fix: S–M — WP Menus screen, DE+FR menus, re-point each item to its real URL. Owner: Deepu (menu config, not copy).

- **HIGH / NEW · Booking engine (`bookings.ayurvedichealingvillage.com` — target of EVERY "Book Now"/"BOOK YOUR STAY" CTA) serves GERMAN title/meta on its default page, no canonical, no H1, indexable.** Evidence: title `Ayurvedic Healing Village | ayurvedisches Wellness Zentrum Pauschalangebote | ayurvedisches Gesundheitsretreat Angebote`, meta description in German, `robots: index, follow`, `canonical: null`, `h1s: []` — while the page body renders in English (screenshot taken; engine functional, Check Availability widget renders, contact info@kairali.com correct). German "Wellness Zentrum / Gesundheitsretreat" framing on a KTAHV surface is also a language-lock exposure in the SERP snippet. Fix: S — set EN title/meta (clinical register) in the booking-engine admin; canonical to itself. Owner: Deepu/Sunaj (engine config).

- **HIGH / NEW · Home page sole H1 is "OUR BRANDS"** (DE: "UNSERE MARKEN", FR: "Nos Marques"). Evidence: only one `<h1>` on `/`, and it is the brands strip, not the hospital's positioning. The most-linked page on the site tells Google its topic is "our brands". Fix: S — make the hero heading the H1 (clinical register), demote brands strip to h2. Owner: Deepu (template), copy via Anupam if new wording needed.

- **HIGH / NEW · hreflang x-default is inconsistent per locale + duplicate self-references.** Evidence: `/` declares `x-default -> /` (EN), `/de/` declares `x-default -> /de/`, `/fr/` declares `x-default -> /fr/` — three different x-defaults across one alternate cluster (invalid; x-default must be one URL). EN pages also declare `en` twice (`en -> /` appears 2×); `/de/` adds `de, de-DE, de-AT` all → same URL; `/fr/` adds `fr, fr-FR, fr-CA`. Malformed hreflang clusters are ignored by Google — relevant to the indexing case. Fix: S–M — configure single x-default (EN) in the multilingual/SEO plugin. Owner: Deepu; flag to Vikash as indexing-relevant.

### MEDIUM

- **MEDIUM / CONFIRMS-KNOWN (broader than delegated) · Consent checkboxes missing on nearly all rendered forms.** Evidence: home renders 13 `<form>`s (incl. WPForms 11965 EN, 18926 DE ×2, 8055) — 0 with a consent checkbox, 0 with a privacy link inside the form. `/online-consultation/`: 13 forms, 0 checkboxes. `/contact-us/`: 14 forms, 0 checkboxes. `/enquiry-form/`: 14 forms, exactly 1 with checkbox (main enquiry form — has consent + privacy link ✔). The delegation to developers6@ (14 Jul) covers "3 forms"; the live count of distinct consent-less WPForms instances (11965, 18926, 8055 + Air India form) is at least 4 form IDs rendered sitewide. Fix: S — extend the existing developer task with the exact form IDs above; no new delegation needed, just scope note.

- **MEDIUM / NEW · Legacy "Air India Maharaja Club" offer form embedded on the home page, posting to a bare PHP endpoint with no consent checkbox.** Evidence: `<form id="Form1" action="https://ayurvedichealingvillage.com/submitAirIndiaForm.php">`, submit label "Claim Your Offer Now!", 0 checkboxes; the endpoint answers 200 with a thank-you page (also on GET). A years-old co-marketing offer form live on the 2026 home page of an NABH hospital, collecting personal data outside the WPForms/DPDP flow. Fix: S — remove the embed (or confirm the offer is current with marketing); if kept, add consent. Owner: Deepu to remove; Anupam to rule on offer validity.

- **MEDIUM / NEW · `/blog/` returns 404 but is listed in the rogue `/sitemap.xml`.** Evidence: fetch `/blog/` → 404; URL present in the static sitemap's 210 URLs. (Not linked from the home nav — sitemap-only ghost.) Fix: S — resolved automatically by killing the static sitemap (see CRITICAL); if a blog exists elsewhere, 301.

- **MEDIUM / NEW · `/how-to-reach/` has NO H1.** Evidence: `h1s: []` in fetched HTML — a key pre-arrival page (good title, good MedicalClinic+FAQPage schema, but no H1 at all). Fix: S — promote the page heading to `<h1>`. Owner: Deepu.

- **MEDIUM / CONFIRMS-KNOWN · Schema on most audited pages is generic WebPage/Organization; no Hospital/MedicalClinic on home, consultation, enquiry, treatment pages.** Evidence: `/how-to-reach/` is the ONLY audited page emitting `MedicalClinic` (+PostalAddress, GeoCoordinates, ContactPoint, FAQPage) — that block is the model. `/de/` emits `HealthAndBeautyBusiness` (wrong entity class for an NABH hospital — same family of defect as the Resort→Hospital fix already with developers6@, but on a page/type not in that delegation; add DE home to the list). Fix: S–M — extend the existing schema task: apply the how-to-reach MedicalClinic block sitewide; replace `HealthAndBeautyBusiness` on `/de/`.

### LOW

- **LOW / NEW · Plain-`http://` external links to sister sites.** Evidence (home): `http://www.kairaliproducts.in/books.html`, `http://www.kairalihospitality.com/`. Not mixed content (links, not resources) but they bounce through insecure redirects. Fix: S — update to https. Owner: Deepu.
- **LOW / NEW · Treatment pages are EN-only in hreflang** (`/panchakarma-therapy/`, `/treatment-for-arthritis-and-spondylitis/` declare only `en` + `x-default`). Per CLAUDE.md locked facts, pages missing DE/FR must be explicitly flagged — flagging here: treatment family appears EN-only pending translation. Not a defect if intentional; needs a ruling. Owner: Abilash ruling → Anupam translation queue.
- **LOW / CONFIRMS-KNOWN · Banned-word register in titles/metas of audited pages** (recorded for cross-reference only — sweep is Anupam's): home title "Wellness Retreat", `/apply-now/` meta "luxury Ayurveda… wellness retreats", `/panchakarma-therapy/` H1 "80% guest-trusted" + meta "wellness retreat", `/de/` title/meta "Ayurveda-Retreat". No NEW delegation.

### Clean checks (no finding)
- **robots.txt**: 200, valid, well-commented, declares `wp-sitemap.xml` (which is 200/valid, 594 URLs across EN/DE/FR). No accidental blocks.
- **404 handling**: unknown URLs return true HTTP 404 with `noindex, follow` and a themed page. Correct.
- **Mixed content**: zero `http://` scripts/styles/images on any audited page (the only http:// refs are the malformed links + 2 sister-site links above).
- **LOCKED FACTS**: **PASS.** `info@kairali.com` is the only contact email found (home, how-to-reach, booking engine). WhatsApp **+91 92898 38797 present; the WRONG …38777 appears NOWHERE** on any of the 11 audited surfaces. No fix-on-sight events.
- **Internal-link sample** (10 nav-level URLs): all 200 except `/blog/` (above). `/contact/` 301s cleanly (single hop) to `/contact-us/`.
- **Enquiry + consultation pages**: `/enquiry-form/` and `/online-consultation/` and DE/FR equivalents (`/de/anfrageformular/`, `/de/online-beratung/`, `/fr/demandez-maintenant/`, `/fr/consultation-en-ligne/`) all 200 and indexable; main enquiry form has consent checkbox + privacy link; titles already in clinical register ("NABH-akkr…", "Hôpital a…").

---

## DELEGATION SPLIT

**Deepu (web developer — WP/server config; NOT copy):**
1. Kill/redirect rogue static `/sitemap.xml` (CRITICAL) — same subsystem as his existing sitemap_index-404 task (CONFIRMED-STILL-BROKEN 16 Jul 16:07 IST).
2. Remove noindex + add canonical: `/contact-us/`, `/fr/contactez-nous/` (CRITICAL).
3. Fix 23 malformed DE/FR menu URLs (HIGH — list above).
4. hreflang: single x-default, dedupe `en` (HIGH).
5. Home H1 → hero heading; add H1 to `/how-to-reach/` (HIGH/MEDIUM).
6. Remove Air India legacy form embed from home (MEDIUM — pending Anupam's offer ruling).
7. https on sister-site links (LOW).

**developers6@ (existing technical task — extend, no new email):** consent checkboxes: exact WPForms IDs 11965, 18926, 8055 (+ Air India Form1 if retained); schema: add DE home `HealthAndBeautyBusiness`→Hospital/MedicalClinic to the Resort→Hospital list; model block = `/how-to-reach/` MedicalClinic schema.

**Anupam (marketing):** no new banned-word work (sweep already his); two rulings needed — (a) is the Air India Maharaja Club offer still valid? (b) booking-engine DE title/meta rewrite copy (clinical register) once Deepu/Sunaj open the engine admin.

**Sunaj (infra/Cloudflare):** booking-engine admin access to fix German default title/meta + canonical (HIGH); note Cloudflare WAF challenges ALL non-browser fetches sitewide (curl/monitoring/GSC-adjacent tools see `403 cf-mitigated: challenge`) — verify Googlebot/Bingbot are exempt from the managed challenge, else this is an indexing suspect.

**Vikash (SEO — indexing case, already his):** three inputs for his investigation: (1) rogue `/sitemap.xml` existence + whether it's submitted in GSC; (2) `/contact-us/` + `/fr/contactez-nous/` noindex; (3) invalid multi-x-default hreflang clusters; (4) confirm WAF challenge doesn't hit Googlebot.

**Abilash (ruling):** treatment pages EN-only — intentional or translation gap?

---
*Evidence basis: live in-browser fetches + rendered-DOM inspection + screenshot of booking engine, 2026-07-16 16:06–16:12 IST. No fixes applied, no commits, no emails sent.*
