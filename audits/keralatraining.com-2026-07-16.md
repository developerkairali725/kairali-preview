# QA/QC audit — keralatraining.com (LIVE legacy ASP.NET WebForms microsite, training satellite)

- Audited: **2026-07-16 19:22:36 IST** (fetch window 19:16:33–19:22:36 IST)
- Auditor: factory QA pass (findings only, no fixes applied — CLAUDE.md §QA audit pass, D-TWO-LANE 16 Jul 2026)
- Method: external raw-HTML capture via `curl` (desktop Chrome UA, `--max-time 20`), byte-level inspection. No browser tools used (pane shared — D-TWO-LANE); all render-dependent checks listed under NOT RUN.
- Stack: **Microsoft-IIS/10.0 + ASP.NET 4.0.30319 + Plesk (Windows)** — NOT WordPress. Single-template WebForms site; assets served from `media.kairali.com`.
- Sample: **the entire linked page set** — `/` (200, 38,232 B), `default.aspx` (200, duplicate of `/`), `enquirenow.aspx` (200), `freeonlineconsultation.aspx` (200), `privacy-policy.aspx` (**404**) — plus `robots.txt` (**404**), `sitemap.xml` (**404**), 2 deliberate 404 probes, 4 host/protocol variants, `media.kairali.com` asset probes, 25 outbound-link checks. The nav contains only these pages plus same-page anchors, so this is full coverage, not a sample.
- Triage context honoured: surfaced as "unexpected CONTENT: 200 … Footer 'Kairali Ayurvedic Group Since 1908'" — confirmed below.

---

## SECURITY SCREEN (rule r): **CLEAN** (as of 2026-07-16 19:22 IST)

- Injection screening of all fetched content: **zero** text addressing AI/agents (`ignore previous…`, `system prompt`, etc.) on any page — nothing to quarantine, no fetched content was acted upon as instructions.
- Spam keywords (`casino|gambling|betting|poker|slot|viagra|cialis|bookmaker|wager|payday`): **0** hits across all pages + `keralatraining-style.css`.
- `<marquee>`, hidden-element CSS (`text-indent:-…`, large negative `left`), zero-width chars (U+200B/C/D): **0**.
- External `<script src>` inventory (all pages): `media.kairali.com` (jQuery1.9.js, slick.min.js), `cdn.onesignal.com/sdks/OneSignalSDK.js`, `chat.kairali.com/embed.min.js` (Chatbase, chatbotId `rpNt_uRW6W8EDiTf6AvYJ`), Google `analytics.js` — all first-party/known vendors, no injected scripts.

---

## Findings (severity-ranked, evidence-linked)

### H-1 / https://keralatraining.com/freeonlineconsultation.aspx / Medical-intake form collectable over plain HTTP (no HTTPS enforcement sitewide)
The "Free Online Consultation" form is a full health questionnaire: fields include `txtBloodPressure`, `txtPregnant`, `chkPastHistory$0–4`, `txtTakingMedPresent`, `txtPreviousClinicalDetails`, `txtPresentHealthProblems`, `txtManiComplaint`, height/weight/age (field inventory from raw HTML, 19:18 IST). The site serves **HTTP 200 on all four variants with no redirect to HTTPS**: `http://keralatraining.com/` → 200, `http://www.keralatraining.com/` → 200, `https://` variants → 200 (verified 19:17 IST; `redirects 0`; no `Strict-Transport-Security` header). The form posts to `./` — a visitor who arrives on `http://` submits health data unencrypted. Form NOT submitted (rule). Fix: 301 http→https + non-www→www (pick one canonical host) + HSTS at IIS/Plesk level. **Health-data handling — flag to Abilash; any wording change near medical content needs Dr. Deepu John sign-off.**

### H-2 / sitewide / Active mixed content: site CSS + all JS loaded over `http://` on an HTTPS page — HTTPS visitors get an unstyled, non-functional page
Every page loads `<link rel="stylesheet" href="http://media.kairali.com/css/keralatraining-style.css" />`, `<script src='http://media.kairali.com/js/jQuery1.9.js'>`, `http://media.kairali.com/slick/slick.css|slick-theme.css|slick.min.js`, favicon `http://media.kairali.com/fav/favicon.ico` (home.html lines 9, 17–22, 552–553; same refs on both inner pages — 11–12 `http://` asset refs each). Modern browsers **block** active mixed content (http CSS/JS on https pages), so on `https://keralatraining.com/` the stylesheet, jQuery, and the slider/menu/enquiry-toggle scripts do not load — the page renders as raw unstyled HTML (mechanics standard; visual confirmation NOT RUN — no browser this pass). All blocked assets are already available over HTTPS (`https://media.kairali.com/css/keralatraining-style.css` → 200, verified 19:17 IST), so the fix is a mechanical `http://media.kairali.com` → `https://` swap in the template (+ the 27 `url(http://media.kairali.com/…)` refs inside the CSS file itself). All `media.kairali.com` images are also `http://` (passive mixed content, browser-auto-upgraded, same fix).

### H-3 / sitewide footer + homepage stats / LOCKED-FACT VIOLATION: "© Kairali Ayurvedic Group Since 1908." + frozen rolling number "109 Years of Experience"
- Footer on **all 4 fetched HTML pages**: `<div class="text-left">&copy; Kairali Ayurvedic Group Since 1908.</div>` (home.html line 547; also enquirenow, freeonlineconsultation, default.aspx). Per PR #65 ruling: 1908 = family lineage only; the **Group was founded 1989** — "Since 1908" attached to the Group is WRONG.
- Homepage stats block (home.html lines 496–505): `<span>109</span> Years of Experience` — a frozen rolling number (1908 + 109 = 2017: typed circa 2017, frozen 9 years; and anchored to the wrong 1908 baseline anyway). Same block: "20 Distributors Worldwide", "25 Centers Worldwide", "700 Staff & Growing", "300 Products & Expanding", "40 Awards & Accreditations" — all hard-coded 2017-era numbers; centre count conflicts with current network data (register review, per kairalicenters brief §0.2).
Copy decision is Abilash's (register review) — no copy delegated.

### M-4 / https://keralatraining.com/ (homepage enquiry form) / Consent checkbox HIDDEN + consent text names the WRONG SITE + privacy link is a 404
Home.html line 200–202: `<div class="clearfix hi-hide"><input name="chkAgree" type="checkbox" id="chkAgree" />I have read and agree to ayurvedichealingvillage.com <a target="_blank" href="privacy-policy.aspx">privacy &amp; terms of use.</a></div>`. Three defects in one block: (a) `.hi-hide{display:none}` (confirmed in keralatraining-style.css, 19:19 IST) — the consent checkbox is invisible to users; (b) the consent text says "**ayurvedichealingvillage.com** privacy & terms" on keralatraining.com — template copy-paste leak from the KTAHV site; (c) the link target `https://keralatraining.com/privacy-policy.aspx` returns **HTTP 404** (verified 19:17 IST). The two inner-page forms have visible checkboxes correctly naming "Kairali Ayurvedic Group" and linking to `kairali.com/privacy-policy.aspx` (200, verified) — though freeonlineconsultation.aspx links it as `http://` and enquirenow.aspx as `https://` (inconsistent).

### M-5 / sitewide / Analytics DEAD: Universal Analytics only (`UA-51517067-1`), no GA4, no GTM
All three pages ship the legacy `analytics.js` snippet `ga('create', 'UA-51517067-1', 'keralatraining.com')` (home.html line 24). UA stopped processing data July 2023 — the site has recorded **zero analytics for ~3 years**. No `G-…`, no `GTM-…`, no gtag anywhere (grep 19:18 IST). Enquiries arriving from this site are unmeasured.

### M-6 / https://keralatraining.com/robots.txt + /sitemap.xml / Both return HTTP 404
`robots.txt` → 404, `sitemap.xml` → 404 (verified 19:17 IST). No crawl directives, no sitemap declared anywhere.

### M-7 / sitewide / No real canonical: canonical tag is injected client-side by JavaScript, while FOUR duplicate hosts serve 200
The only canonical mechanism on the site is inside the GA snippet: `var ramc = document.createElement('link'); ramc.rel='canonical'; ramc.href = window.location.href; document.head.appendChild(ramc);` (home.html line 24; present on all 4 pages, static canonical count = 0). This (a) is invisible to non-JS-rendering crawlers, (b) canonicalises every URL variant **to itself** — including all four live hosts (`http/https × www/non-www`, all 200, no redirects — H-1 evidence) and the `/` vs `default.aspx` duplicate (both 200, identical `<title>`). Result: uncontrolled duplicate content with no consolidation signal. Fix: server-side 301s to one host + static self-referential canonicals; drop the JS injector.

### M-8 / .aspx error handling / ASP.NET `customErrors mode="Off"` — verbose framework error pages served publicly
404 probe `/qa-nonexistent-probe-20260716.aspx` returns the raw ASP.NET "**Server Error in '/' Application**" page including a commented stack trace and the framework's own warning: "This error page might contain sensitive information because ASP.NET is configured to show verbose error messages using &lt;customErrors mode=\"Off\"/&gt;…" (probe404.out tail, 19:20 IST). Any runtime exception will dump internals to visitors. Also version disclosure headers on every response: `Server: Microsoft-IIS/10.0`, `X-AspNet-Version: 4.0.30319`, `X-Powered-By: ASP.NET`, `X-Powered-By-Plesk: PleskWin`. Fix: `customErrors mode="On"` + strip headers in web.config/Plesk. (Non-.aspx 404s serve the bare IIS default page — correct 404 status, no soft-200, both probes verified.)

### M-9 / https://keralatraining.com/ (hero slider, slide 1) / COVID-era "Hand Sanitizer" banner with a BROKEN link — on a training site
Slide 1 of the homepage hero: `<span>Hand Sanitizer</span>` linking to `https://www.kairaliproducts.in/catalogsearch/result/?q=sanitizer` (home.html lines 121–126) → **HTTP 404** (Magento-era search path on the now-Shopify store; verified 19:19 IST). Expired pandemic content occupying the #1 hero slot of a Panchakarma-training site, linked to a dead URL. Fix: remove slide.

### M-10 / outbound links / 1 × 500, 1 × 404, 2 × unverifiable social, 1 WAF-blocked
Of 25 outbound URLs checked (GET, follow redirects, 19:19–19:20 IST):
- `http://www.kairaliequipment.com/` ("Spa Equipment", Our Brands) → **HTTP 500**.
- Blog card 1 `whyayurveda.org/treatment-center/2014/06/23/kairali-ayurvedic-spa-now-in-dubai.aspx` → **404** (the other two blog links 301-resolve to 200).
- `facebook.com/pages/Kairaliayurvedicgroup/114901512030869` → 400 and `twitter.com/Kairali_Group` → 520 to curl — bot-blocked, **unverifiable externally**; the `/pages/…` Facebook URL format is deprecated, likely dead (register check).
- `https://www.ayurvedichealingvillage.com/` → 403 = known WAF behaviour to curl (not asserted broken).
- Remaining 20 links resolve 200 (several via http→https or domain redirects — the hrefs are stale `http://` but functioning).

### M-11 / homepage / `<h1>` count = 0; meta description is a raw keyword list
Homepage has zero `<h1>` (inner pages have exactly 1 each — "Enquire Now", "FREE ONLINE CONSULTATION"). Homepage meta description is a comma-separated keyword string, not a sentence: `"ayurveda massage training, ayurvedic massage training in kerala, … ayurvedic massage training kerala"` (home.html line 15) — reads as spam in SERPs; a legacy `<meta name="keywords">` list also present (obsolete, harmless).

### S-12 / homepage blog section / Copy-paste title error + "stay updated" content from 2012–2018
Blog card 2 links to the **Bangkok** article (`…kairali-ayurvedic-treatment-centre-in-bangkok.aspx`) but its visible title reads "**Kairali Ayurvedic Spa Now in Dubai !**" (home.html line 472 — duplicate of card 1's title). Section header says "Stay updated" over posts dated 2012/2014/2018.

### S-13 / sitewide / No structured data at all
`application/ld+json` / `schema.org` markup: **0** occurrences on any page (grep 19:18 IST). No Organization/Course/FAQ schema. (Full schema build = rebuild-scope; noted for the Wave rebuild brief.)

### S-14 / sitewide / Ancient front-end dependencies
jQuery **1.9** (2013), Bootstrap **3.4.0**, Font Awesome 4.7, legacy OneSignal SDK (`cdn.onesignal.com/sdks/OneSignalSDK.js` — v16 is current; old URL still serves 200), CSS `Expires: Sun, 30 Dec 2020` / `Last-Modified: 21 Jan 2020`. jQuery 1.9 carries known XSS CVEs. Rebuild-scope; listed for the inventory.

### S-15 / inner-page titles / Generic/weak title tags
`enquirenow.aspx`: `<title>Communication | Information | Enquiry Form | Enquire Now</title>`; `freeonlineconsultation.aspx`: `<title>Ayurvedic Doctor | Free Online Consultation | Consultation</title>` — no brand, no "Kairali", keyword-fragment style.

### NOTE (register, not this site's lock) / homepage copy
"Cure your ailments through Ayurveda with No side effects" (home.html line 413, Kairali Centre card) — "cure" + "no side effects" is a medical-claim phrasing risk. KTAHV language lock does NOT apply to this non-KTAHV site (not cross-applied per CLAUDE.md); flagged for Abilash/Dr. Deepu John visibility only.

Finding count: **security screen CLEAN · 3 H · 8 M · 4 S · 1 register note**.

---

## LOCKED-FACTS RESULT

| Fact | Result | Evidence |
|---|---|---|
| Banned phone `+91 92898 38777` / `9289838777` (any spacing) | **PASS — absent** | grep across all 5 fetched HTML pages + CSS, 0 hits (19:18 IST) |
| Correct KTAHV WhatsApp `…38797` | absent (not required on this site) | same grep, 0 hits |
| Public contact email `info@kairali.com` | **PASS — correct** | footer of all pages: `Email: info@kairali.com`; no other public mailbox found |
| "Since 1908" attached to Group/company | **FAIL** | footer all 4 pages: "© Kairali Ayurvedic Group Since 1908." (finding H-3) |
| Frozen rolling numbers | **FAIL** | "109 Years of Experience" hard-coded (=2017 value); plus frozen 20/25/700/300/40 stats block (finding H-3) |

**Overall locked-facts verdict: FAIL** (Since-1908 + frozen rolling number; phone and email clean).

Other contact data on site (register reference, not delegated): corporate phone `+91-9555156156`, Mehrauli D-130 address — matches the group corporate office used on kairalicenters.com.

---

## NOT RUN (honest list)

1. **Mobile/visual render checks** — no browser/Playwright this pass (shared pane, D-TWO-LANE). Specifically: visual confirmation of the H-2 mixed-content blocking (unstyled HTTPS render), slider behaviour, menu toggle, Chatbase auto-open (script auto-clicks the chat bubble 5 s after each of the first two page loads — code seen, behaviour unverified).
2. **Form submission tests** — forbidden by audit rules; render + markup inspected only. Whether the enquiry/consultation forms actually deliver mail, and whether `chkAgree` is enforced server-side, is unverified.
3. **CAPTCHA function** — `media.kairali.com/images/turing.aspx` returns 200/image over both protocols, but cross-domain session validity of the code was not tested (would require submission).
4. **Facebook/Twitter link liveness** — bot-blocked (400/520 to curl); needs a human/browser check.
5. **ayurvedichealingvillage.com outbound** — 403 WAF to curl; not asserted broken.
6. **GA account state** — whether UA-51517067-1 has a linked GA4 property needs account access, not visible externally.
7. **Lighthouse/perf, Search Console data** — out of this pass's tooling.

*Evidence artifacts (raw HTML captures, headers, CSS, link-check output) retained in session scratchpad `…/scratchpad/kt/` — not committed.*
