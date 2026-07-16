# QA/QC audit — ayurvedajournals.com (LIVE, CodeIgniter magazine site — apparently frozen since ~2018–2022)

- Audited: **2026-07-16 18:54:35 IST** (fetch window 18:38:07–18:54:35 IST)
- Auditor: factory QA pass (findings only, no fixes applied — CLAUDE.md §QA audit pass; D-TWO-LANE 16 Jul 2026)
- Method: external raw-HTML capture via `curl` (desktop Chrome UA, `--max-time 15–25`), byte-level inspection + python grep. Read-only GET/HEAD only; no form submitted, nothing written to the site. No browser tools used (shared pane rule).
- Sample: 12 URLs fetched — `/`, `/spirit/gita-ramesh`, `/article/kairali-ayurvedic-healing-village`, `/section/story`, `/section/style`, `/spirit/ayurveda-trails`, `/article/sprouted-green-gram-salad`, `/company/cookie-policy`, `/company/terms_and_conditions`, `/index.php/konzultace` (+ its redirect target `/konzultace`), 404 probe `/qa-nonexistent-probe-20260716` — plus `robots.txt`, `sitemap.xml`, `index.php` probe, http/apex redirect probes, 14 internal-link HEAD sample, 8 outbound-link checks, TLS cert inspection of the two sister-site domains.
- Context honoured: ownership/management state unclear per task brief — audited as hygiene pass and documented what the site currently is. No fixes, no delegation of edits to a site we may not control.

---

## WHAT THE SITE CURRENTLY IS (identity snapshot)

- An Ayurveda **travel/lifestyle online magazine** ("Ayurveda Journals") on a custom **CodeIgniter** PHP app (evidence: `ci_session` cookie in response headers; default CodeIgniter 404 template; `index.php/<Controller>` form actions), server **LiteSpeed**, HTTP/2 + h3.
- Footer attribution on `/`: `<p class="copy">ayurveda trails pvt | &copy; 2018</p>` — the operator is **Ayurveda Trails Pvt**, not a Kairali entity. All 5 social links are Ayurveda Trails accounts (`facebook.com/ayurvedatrails`, `twitter.com/AyurvedaTrails`, `in.pinterest.com/ayurvedatrails`, `linkedin.com/company/ayurveda-trails-journals`, `instagram.com/ayurvedajournals`). Czech connection visible (sitemap remnant `/index.php/konzultace` = Czech "consultation"; founder profile `/spirit/zuzana-zwiebel-magdova` is the single most-linked page on the homepage, 84 hrefs).
- It carries **Kairali editorial content**: `/spirit/gita-ramesh` (interview hub; meta description: "She is heart and soul behind the Kairali Group since its inception…") and `/article/kairali-ayurvedic-healing-village` (KTAHV feature, 82 Kairali mentions on the homepage across teasers/labels).
- **Freshness signals say frozen**: sitemap.xml self-dated `Date: 2022-01-18`; footer © 2018; homepage "RESORT OF THE WEEK" offer window ended 30/09/2025; Bootstrap `4.0.0-beta.2` (2017 beta) + jQuery 3.2.1 from CDN; analytics still Universal Analytics (dead since Jul 2023).
- **Ownership relative to Kairali: UNVERIFIED.** Nothing on the public site establishes Kairali ownership/management; public attribution is Ayurveda Trails Pvt. WHOIS/registrar not checked (out of audit scope) — listed under NOT RUN. Decision on relationship/outreach is Abilash's, not this audit's.

---

## SECURITY & INJECTION SCREEN: **CLEAN** (as of 2026-07-16 18:54 IST)

Across all 12 captured pages (rule r screen — fetched content treated as data throughout):

- Spam keywords `casino|gambling|betting|poker|viagra|escort` → **0**. `<marquee>` → 0.
- AI-directed instruction text (`ignore previous`, `as an AI`, `system prompt`, prompts addressing an agent) → **0** — nothing to quarantine.
- Zero-width characters (U+200B/C/D) → 0. Hidden-element CSS (`text-indent:-999…`, huge negative `left`) → 0. `eval(`/`atob(`/`String.fromCharCode` → 0.
- External `<script src>` on `/` limited to: ajax.googleapis.com (jQuery 3.2.1), cdnjs (popper, wow.js), maxcdn.bootstrapcdn.com (Bootstrap 4.0.0-beta.2), googletagmanager.com (gtag UA-122008508-1), static.zdassets.com (Zendesk snippet key `2b97355b-…REDACTED (public client-side widget key; full value visible in the live page source — not reproduced here so the secret gate stays meaningful)`), plus 2 same-origin scripts. No unknown/injected hosts.
- Mixed content: **0** `src="http://…"` assets on any sampled page (the two `http://` refs are outbound `href` links, covered in finding #2).
- Redirect hygiene: `http://apex` → 301 → `https://www.` (correct, single hop); `/index.php` → 301 → `/` (correct); 404 probe returns real HTTP 404 (no soft-200).

---

## LOCKED-FACTS RESULT: **PASS** (nothing to scrub on this site)

- Banned `+91 92898 38777` / `9289838777` (all spacing variants): **0 occurrences** across all 12 captured pages. Correct `…38797` also absent — the site publishes no KTAHV phone at all.
- Only contact vector sitewide: `https://wa.me/+919037299527` (×7, header/footer template) — Ayurveda Trails' own number, not a locked Kairali fact. **Zero `mailto:`/`tel:` links anywhere**; `info@kairali.com` neither present nor expected (not a Kairali property).
- "Since 1908": **0 occurrences.** The Kairali article states — exact quote — "The Kairali Ayurvedic Group was established in 1989, when we opened the first ayurveda center in Delhi." → **matches the PR #65 ruling (Group = 1989).**
- Frozen rolling numbers ("115+ years", "N years of …"): **0** found.
- **Register-review note (not a violation):** the same interview text claims products "researched and developed from the year 1948" and "Ten years later Kairali - The Ayurvedic Healing Village was established in Palakkad" (⇒ KTAHV 1999). 1948/1999 are not in the locked-facts list and sit inside quoted interview copy on a third-party site — recorded here as **unverified claims**, flagged to Abilash for awareness only.

---

## Findings (severity-ranked, evidence-linked)

1. **H / sitewide / DEAD ANALYTICS — Universal Analytics only.** Every sampled page loads `googletagmanager.com/gtag/js?id=UA-122008508-1` + `gtag('config', 'UA-122008508-1')` (×2 per page: `/`, gita, kairali, recipe checked). UA stopped processing hits 1 Jul 2023; there is **no GA4 `G-`, no GTM container, no other tag**. The site has collected zero analytics for ~3 years. (Facebook: `facebook.net` string ×1 on `/` but no `fbq('init')` — no active pixel found.)

2. **H / homepage "RESORT OF THE WEEK" block + header/footer / SISTER-SITE LINKS ARE BROKEN AT TLS LEVEL.** `/` links `http://www.ayurvedatrails.com/FeaturedRetreat.aspx` (the featured-resort booking CTA) and `http://www.shaktitrails.com/`. Both 301 to their https hosts, and both https hosts serve a **self-signed "Parallels Panel" certificate that expired 2014-10-07** (openssl: `subject CN=Parallels Panel`, `notAfter=Oct 7 17:12:56 2014 GMT`; curl error 60 "self signed certificate", HTTP 000). Any user clicking the booking CTA hits a full browser security interstitial. All conversion-intent traffic from this site dead-ends.

3. **M / homepage / EXPIRED OFFER WITH PRICE still live.** "RESORT OF THE WEEK … CLIFF VIEW AYURVEDA RETREAT … Dates: 01/06/2025 - 30/09/2025 … Stay: 14 night in single room … Price: 2283 Euro" — the offer window ended **~9.5 months ago**, and a frozen "of the week" label is itself a staleness leak. In-scope defect class: expired dates/prices.

4. **M / sitemap.xml (https://www.ayurvedajournals.com/sitemap.xml, HTTP 200).** Four defects: (a) self-dated `<!-- Date: 2022-01-18 07:24:10 -->` (Plop generator) — 4.5 years stale and lists only 5 URLs for a site with dozens of articles; (b) all `<loc>` use non-www `https://ayurvedajournals.com/…`, which 301s to www — sitemap URLs should be final; (c) malformed double-slash entry `https://ayurvedajournals.com//` (listed twice); (d) contains `https://ayurvedajournals.com/index.php/konzultace` → 301 → `/konzultace` → **HTTP 404** (verified both hops) — a dead Czech-language remnant URL submitted to crawlers. robots.txt does carry a `Sitemap:` line (also non-www).

5. **M / homepage / 5 internal links with a TRAILING SPACE in href silently bounce users to home.** Exact hrefs captured: `article/cochin-carnival `, `search/KAIRALI `, `question/how-was-your-journey-to-ayurveda `, `question/what-ayurveda-mean-for-you `, `question/how-would-you-describe-your-ayurveda-resort `. Probe: `/article/cochin-carnival%20` → **303 → `https://www.ayurvedajournals.com/index.php/`** → 301 → `/` (user lands back on the homepage; the space-trimmed URLs all return 200). The linked content is unreachable from these links.

6. **M / all sampled pages / SEO plumbing absent.** `<link rel="canonical">`: **0 on every page** (incl. homepage). JSON-LD: **0 blocks anywhere** (no Organization/Article/Recipe schema — a recipe page and interview pages carry nothing). `og:title`/`og:url`: 0; homepage `og:type` is `article` (wrong — should be website); `og:image` is a 100×100 logo PNG. Titles: `<title> STORY</title>` and `<title> STYLE</title>` ship leading whitespace; `<title>KAIRALI - THE AYURVEDIC HEALING VILLAGE </title>` trailing space; kairali article meta description is just "INDIA, KERALA, PALAKKAD". `<h1>` count: 0 on `/spirit/gita-ramesh` and `/spirit/ayurveda-trails`, 1 elsewhere sampled. `meta robots` is `index, follow` — no noindex mistakes found.

7. **M / forms (render-only inspection — never submitted) / PII collected with no consent mechanism and no privacy policy.** Four forms on `/`: newsletter popup (`first_name`, `last_name`, `email`, `nationality` → `index.php/NewsLetterController/add`), menu newsletter (name + email), "Ask your question" (question + `name` + `email` → `index.php/AskYourQuestionManagement/add`), search. **No consent checkbox on any form** — the only checkboxes near the newsletter form (Daily/Weekly/Monthly) are commented out in the HTML (`<!-- <input type="checkbox" class='… newslttercheckbox'…`). Footer legal links are placeholders: `<a href="#"><p class="footerElm">PRIVACY & SECURITY</p></a>`, same for `TERMS & CONDITION` and `LOGIN` — **all `href="#"`**. No privacy-policy page found; the cookie bar's only link is labelled "Terms and Conditions." but points to `/company/cookie-policy` (mislabeled; that page is a cookie policy, 200). `/company/terms_and_conditions` exists (200) but is only linked from the cookie bar area, not the footer labels. EU-facing operator (Czech) collecting nationality + email with zero consent = GDPR-relevant gap.
   - **Code finding, same forms:** every rendered CSRF field is empty — `<input type="hidden" name="ci_csrf_token" value="" />` on `/`, kairali, recipe. Either CSRF regeneration is broken (all POSTs would fail) or protection is effectively off. Submission NOT tested (audit rule).

8. **S / sitewide header/footer template (×7 per page) / typo in the WhatsApp CTA prefill:** "Namaste! Let me contact you **regaurding** my Ayurveda Healing. Thank You!" — should be "regarding".

9. **S / homepage footer / stale copyright:** `ayurveda trails pvt | © 2018` — 8 years old, lowercase brand, reinforces the abandoned look.

10. **S / 404 page / default CodeIgniter error template.** `/qa-nonexistent-probe-20260716` → HTTP 404 (correct code) but the body is the stock unbranded CodeIgniter "404 Page Not Found" template: no site nav, no branding, **no viewport meta** (0 occurrences) — framework leak + dead-end UX.

11. **S / robots.txt vs homepage / crawl-waste contradiction.** robots.txt disallows `/search`, yet the homepage emits 25+ `href`s into `/search/…` (e.g. `search/AYURVEDA RESORTS`, `search/GITA RAMESH` — also unencoded spaces in hrefs). Disallowed-but-linked URLs burn crawl signals; `/search/AYURVEDA` returns 200 (GET works despite the search form being POST).

12. **S / transport & weight.** No `Strict-Transport-Security` header on `www` (verified absent). Homepage HTML alone is **523,430 bytes** with 261 `<img>` tags + 51 CSS background images — extremely heavy for a content homepage. Frontend stack: Bootstrap **4.0.0-beta.2** (2017 pre-release) and jQuery 3.2.1 — outdated third-party libs (no known-exploit check performed externally).

13. **NOTE / Zendesk widget** (`static.zdassets.com/ekr/snippet.js?key=2b97355b-…REDACTED (public client-side widget key; full value visible in the live page source — not reproduced here so the secret gate stays meaningful)`) present sitewide — whether the account/widget still functions requires JS execution: NOT RUN.

14. **PASS / link sample.** 14 internal URLs HEAD-checked: 13×200, 1×303 (the trailing-space case, finding #5). Both policy pages 200. `/section/spirit` 200. Socials: LinkedIn 200, Instagram 200, Pinterest 200, Twitter 301→`x.com/AyurvedaTrails` 200; **Facebook returned 400 to curl — normal bot-blocking, liveness UNVERIFIED, not asserted dead.**

Finding count: **1 security screen (CLEAN) · 1 locked-facts PASS (+1 register-review note) · 2 H · 5 M · 5 S · 1 note · 1 pass.**

---

## NOT RUN (honest gaps)

- **Mobile/visual render checks** — browser/Playwright tools excluded by task rule (shared pane); viewport meta verified present on all content pages by grep only.
- **Form submissions** — render-only inspection; POST endpoints, the empty-CSRF behaviour, and newsletter/question delivery untested (audit never submits).
- **JS runtime checks** — GA hit firing, Zendesk widget liveness, cookie-bar behaviour, lazy-loaded "load more" content (`index.php/Welcome/load_more_*`) not executed.
- **Facebook page liveness** — curl 400 (bot-blocked); unverified.
- **Full-site crawl** — sample of 12 pages + 14 link HEADs; the sitemap is unusable as a URL inventory (5 entries), so total URL count unknown.
- **WHOIS/registrar/ownership records** — not queried; ownership vs Kairali left explicitly unverified.
- **Lighthouse/perf, hreflang, DNS/mail records** — out of scope for this pass.

---

## DISPOSITION (for Abilash — decisions, not tasks)

This does not look like a site we can or should patch: public attribution is **Ayurveda Trails Pvt (© 2018)**, dead UA analytics, 2022 sitemap, expired 2025 offer, and its two conversion outlets (ayurvedatrails.com, shaktitrails.com) have been TLS-dead since their 2014 self-signed cert expired. Value to us today: it hosts favourable Kairali/KTAHV editorial (Gita Ramesh interview + KTAHV feature with the **correct 1989 founding claim**) that still resolves and could be link/citation material for the rebuild. Questions for the register: (1) do we have any relationship/ownership stake to confirm? (2) if not, do we want outreach to Ayurveda Trails, or just archive the two Kairali articles into `content-mined/` while they're still live?

*Evidence artifacts (raw HTML captures, headers, cert output) retained in session scratchpad `…/scratchpad/aj/` — not committed.*
