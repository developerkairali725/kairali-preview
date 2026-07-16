# QA/QC audit — kairbykairali.com (LIVE, ASP.NET WebForms brochure site — Kair herbal-cosmetics brand)

- Audited: **2026-07-16 19:15:43 IST** (fetch window 19:07:04–19:15:43 IST)
- Auditor: factory QA pass (findings only, no fixes applied — CLAUDE.md §QA audit pass; D-TWO-LANE ruling 16 Jul 2026)
- Method: external raw-HTML capture via `curl` (desktop Chrome UA + Googlebot UA cross-check), byte-level inspection, read-only GET/HEAD only. No form submitted. Browser tools deliberately not used (shared pane rule) — see NOT RUN.
- Stack observed: `Server: Microsoft-IIS/10.0`, `X-AspNet-Version: 4.0.30319`, `X-Powered-By-Plesk: PleskWin` — this is NOT WordPress; it is a legacy ASP.NET WebForms site (`__VIEWSTATE` forms, `.aspx` URLs, `ScriptResource.axd`).
- Sample: 13 URLs fetched 200 — `/`, `/default.aspx`, `/about-us.aspx`, `/kairali-ayurvedic-group.aspx`, `/free-online-consultation.aspx`, `/enquire-now.aspx`, `/contact-us.aspx`, `/career.aspx`, `/apply-now.aspx`, `/founders-message-and-meet-the-directors.aspx`, `/vision-and-mission.aspx`, `/privacy-policy.aspx`, `/sitemap.aspx` — plus `robots.txt` (404), `sitemap.xml` (404), 2 deliberate 404 probes, http/www/host-variant probes, TLS cert read, 17 outbound-link checks.
- Triage context honoured: surfaced as unexpected CONTENT 200, 108KB, legacy UA analytics ID, email ≠ info@kairali.com — all three triage flags CONFIRMED below.

---

## SECURITY VERDICT: **CLEAN** (no compromise indicators) — but HTTPS is not enforced (finding #1)

- Spam keywords (`casino|gambling|betting|poker|viagra|escort|loan|crypto`): 0 hits across all 13 pages.
- Hidden markup: `<marquee>` 0; negative `text-indent` 0; `eval(`/`atob(`/`String.fromCharCode` 0; zero-width chars (U+200B/C/D) 0.
- No cloaking: Googlebot-UA fetch of `/` byte-identical to desktop fetch (108,539 = 108,539 bytes).
- Rule (r) injection screen: no text addressing AI agents / prompts / "ignore previous…" found in any fetched page. Nothing quarantined.
- External scripts: only `ajax.googleapis.com` (jQuery 1.7), `google-analytics.com/analytics.js`, Google Fonts. No injected third-party scripts.
- TLS cert valid: `CN=kairbykairali.com`, issuer Let's Encrypt (YR1), notAfter **2026-10-01** (~11 weeks out — Plesk should auto-renew; worth a watch).
- 404 handling: non-.aspx probe → IIS 404 (1,245 B); `.aspx` probe → ASP.NET 404 ("The resource cannot be found.") — both real HTTP 404, no soft-200. But the .aspx error page leaks framework versions (finding #13).

---

## LOCKED-FACTS RESULT: **FAIL** (register review — Abilash)

1. **FAIL / https://kairbykairali.com/kairali-ayurvedic-group.aspx (line 10, meta description)** — `"Since 1908, Kairali Ayurvedic Group is propagating the ideologies of Ayurveda."` — **"Since 1908" attached to the GROUP is WRONG per the PR #65 ruling** (1908 = family lineage only; Group founded 1989). Ironically the same page's body copy is CORRECT: line 251 reads "Kairali Ayurvedic Group stepped into the Wellness Industry in **1989**". Meta-only fix; this description is what Google shows in the SERP for the group page.
2. **FAIL / sitewide** — public contact email is `support@kairaliproducts.com` (20 occurrences across sample: header/footer mailto + contact page), not the locked `info@kairali.com` (0 occurrences anywhere). Same conflict class as kairalicenters — known rebuild-scope, Abilash-ruling-gated: noted, no copy delegated.
3. **FLAG / https://kairbykairali.com/ (line 866)** — `"Over 100 Years of Heritage & Tradition Simplified"` (Books carousel tile). Frozen typed number per the locked-facts rule. Mitigation: it is lineage-framed and "Over" keeps it evergreen-true (1908 lineage = 118 years in 2026), but it is a typed frozen value, not computed — register review.
4. **PASS** — banned phone `+91 92898 38777` / `9289838777`: 0 occurrences in any spacing variant across all 13 pages (correct `…38797` also absent — non-KTAHV site, nothing expected). Site phone throughout is `+91-9555156156` (tel: + display, matches kairalicenters).

---

## Findings (severity-ranked, evidence-linked)

### H1 — HTTPS not enforced anywhere; health-consultation form servable over plain HTTP
- `http://kairbykairali.com/` → **HTTP/1.1 200 OK, Content-Length 108539** (the full page, no 301 to https). Verified 19:07:22 IST.
- `http://kairbykairali.com/free-online-consultation.aspx` → **HTTP/1.1 200 OK, 90,878 B** — this page's form posts to itself (`<form method="post" action="./free-online-consultation.aspx"`) and collects **health data**: `<textarea name="txtPresentHealthProblems">`, `<textarea name="txtPreviousClinicalDetails">`, page copy "Describe it in detail. Our Ayurvedic experts and physicians will…" (line 199). A visitor who lands on the http:// variant submits present/previous clinical details in cleartext.
- No `Strict-Transport-Security` header on any response (0 hits in captured headers).
- Fix (S, server-level): Plesk/IIS permanent 301 http→https + HSTS. (Rule: infra change — Sunaj lane, human executes.)

### H2 — Duplicate homepage/site under 4+ URL variants with ZERO canonical tags sitewide
- All of these return HTTP 200 with the same content and **no `<link rel="canonical">` on any of the 13 sampled pages** (grep: 0 hits): `https://kairbykairali.com/`, `https://www.kairbykairali.com/` (200, 108,539 B), `http://kairbykairali.com/`, `http://www.kairbykairali.com/`, `https://kairbykairali.com/default.aspx` (200, 108,551 B — same page, 12-byte form-action delta).
- Google is left to guess the canonical among ≥5 homepage duplicates. Fix (S): host-level 301 (www→apex or vice versa, decide once) + canonical tag in the master template.

### H3 — Analytics are DEAD: legacy UA property, no GA4, no GTM (triage flag confirmed)
- Every sampled page (13/13) carries only `analytics.js` + `UA-102795379-1`; `gtag(`/`googletagmanager`/`G-*`/`GTM-*` = 0 hits sitewide.
- Universal Analytics stopped processing hits July 2023 → **this site has recorded zero analytics for ~3 years**. Fix (S): drop in GA4/GTM snippet in the master template (or leave for rebuild — Abilash call; if the domain stays live, measurement should too).

### M4 — robots.txt and sitemap.xml both 404, while every page's footer links "XML Sitmap" to the 404
- `https://kairbykairali.com/robots.txt` → **404** (IIS error page, 1,245 B).
- `https://kairbykairali.com/sitemap.xml` → **404** — yet the sitewide footer has `<a href="sitemap.xml">XML Sitmap` (home.html line 1450; present on all 13 pages) → a sitewide broken footer link **plus** the visible typo **"Sitmap"** on every page.
- Fix (S): add real robots.txt (+ `Sitemap:` line) and an XML sitemap, or point the footer link at `/sitemap.aspx`; fix "Sitmap" → "Sitemap". (robots.txt creation = ask-first per hard gate #3.)

### M5 — Wrong email in contact page SERP snippet: "support@kairaliproduct.com" (missing "s")
- `https://kairbykairali.com/contact-us.aspx` line 10, meta description: `"…Send us your queries at support@kairaliproduct.com we will be happy to assist you."` — every other occurrence on the site (20×) is `support@kairaliproducts.com`. The typo variant is what Google displays under the contact result; mail to it likely bounces (domain `kairaliproduct.com` not verified — see NOT RUN). Fix (S): one meta edit.

### M6 — Broken href scheme "hhttp://" on the homepage product carousel
- `https://kairbykairali.com/` line 820 (+ same in `/default.aspx`): `<a href="hhttp://www.kairbykairali.com/" target="_blank">Ayurveda Influenced Herbal Cosmetics</a>` — invalid scheme; clicking yields a browser error. Fix (S): delete the stray "h".

### M7 — Broken/dead outbound links in the sitewide brand strip & footer
- `http://www.kairaliequipment.com/` → **HTTP 500** (checked 19:12 IST; linked 2× from home brand strip).
- `https://plus.google.com/102296388765014542269` → Google+ shut down 2019; now redirects to a Google blog shutdown notice. Linked in the footer of **all 13 sampled pages**.
- `http://www.ayurvedichealingvillage.com/` → 403 to curl (known KTAHV WAF posture — not asserted broken; unverified, see NOT RUN).
- Other family links resolve 200: kairali.guru, kairalitea.com, kairaliorganic.com, kairalicenters.com, kairaliyoga.com, kairaliproducts.com, usakairali.com, kairalihospitality.com, healing.recipes, ayurvedafranchise.com, kairaliproducts.in/books.html (301→/collections/books, fine).
- Fix (S): remove the Google+ icon sitewide; flag kairaliequipment.com 500 to its owner.

### M8 — Mixed content: 3 http:// images on every sampled page
- All 13 pages embed `src="http://www.kairali.com/images/kairaliyoga.jpg"`, `…/kairaliayurvedictreatmentcentre.jpg`, `…/kairali-view-home.jpg` (Group section). kairali.com serves the same files fine over https (verified: https → 200, http → 301). Impact: mixed-content warnings/auto-upgrade dependence on an https page. Fix (S): change scheme to `https://` (or protocol-relative) in the template — 3 URLs.

### M9 — jQuery loaded three times, ending on v1.7 (2011)
- Homepage load order: line 50 `js/jQuery1.9.js` (head) → line 1511 `assets/js/jquery-1.9.1.min.js` → line 1517 `https://ajax.googleapis.com/ajax/libs/jquery/1.7/jquery.min.js` — the 1.7 CDN copy loads LAST, so plugins bound after it run on jQuery 1.7. Same double/triple pattern on inner pages (e.g. free-online-consultation.aspx loads 1.9.1 then 1.7). Three full library downloads per page; jQuery <3.5 carries known XSS CVEs (e.g. CVE-2020-11023). Fix (S): keep one modern copy.

### S10 — Zero structured data and zero social meta sitewide
- `application/ld+json` = 0 on all 13 pages; `og:*` / `twitter:*` = 0 sitewide. No Organization/Product/BreadcrumbList schema anywhere. Rebuild-scope for full schema; a minimal Organization JSON-LD on the template is an S interim.

### S11 — Meta/title copy defects (SERP-visible)
- `/vision-and-mission.aspx`: `<title>Mission | Vision</title>` (no brand) and meta description literally `"Kair By Kairali"` (3 words).
- `/contact-us.aspx`: `<title>Contact Us –Kair By Kairali| Herbal Cosmetics Brand</title>` (broken spacing around dash/pipe).
- `/enquire-now.aspx` meta: `"…we will get back to you with in Business day."` — "with in Business day" (sic).
- `/founders-message-and-meet-the-directors.aspx` meta: `"…our main objective it to encourage…"` — "it" should be "is".
- Fix (S): four meta edits.

### S12 — Viewport blocks pinch-zoom
- All pages: `<meta name="viewport" content="width=device-width, initial-scale=1.0, user-scalable=1.0, minimum-scale=1.0, maximum-scale=1.0">` — `maximum-scale=1.0` (and the malformed `user-scalable=1.0`) disables zoom; Lighthouse/accessibility flag. Fix (S): drop maximum-scale/user-scalable.

### S13 — Server/framework version disclosure
- Response headers on every request: `Server: Microsoft-IIS/10.0`, `X-AspNet-Version: 4.0.30319`, `X-Powered-By: ASP.NET`, `X-Powered-By-Plesk: PleskWin`.
- `.aspx` 404 probe returns the raw ASP.NET error page: `Version Information: Microsoft .NET Framework Version:4.0.30319; ASP.NET Version:4.7.4136.0` — customErrors is Off/RemoteOnly-misconfigured for 404s. Fix (S, Sunaj): strip headers in Plesk/IIS, set a custom 404, `customErrors mode="On"`.

### PASS — checks that came back clean
- **Forms render with consent + privacy** (render-only check; nothing submitted): `/enquire-now.aspx` line 604 and `/free-online-consultation.aspx` line 948 both have `<input name="chkAgree" type="checkbox">` + label "I have read and agree to KairbyKairali privacy & terms of use." linking `privacy-policy.aspx` (200). `/apply-now.aspx` job form renders (multipart, photo + CV `type="file"` inputs) with privacy link. Whether chkAgree is server-enforced: unverifiable without submitting — NOT asserted.
- **Internal links**: all 13 nav/sitemap-listed internal pages fetch 200 (list in Sample). Only internal 404 is the footer `sitemap.xml` (M4).
- **No Lorem ipsum** (0 hits, all pages). **No expired-date/price copy found** (no prices on site; no copyright-year line exists in the footer at all — nothing stale to flag).
- **Exactly one `<h1>` per page** on all 13 pages (note: homepage's sole h1 is the section heading "About Kair Products" — weak but compliant).
- **`<meta name="robots" content="index, follow">`** on all pages — no accidental noindex.
- **Meta description present** on 13/13 pages (quality issues → S11).
- **Viewport present** 13/13 (config issue → S12).

Finding count: **1 security verdict (CLEAN) · locked-facts FAIL (2 fail, 1 flag, 1 pass) · 3 H · 6 M · 4 S · 7 pass groups**.

---

## NOT RUN (honest gaps)

- **Mobile/visual render, JS console, CSS breakage, image visual loading, carousel behaviour** — browser tools banned this pass (shared pane; D-TWO-LANE). Needs a later Playwright pass.
- **Form submission / server-side validation** (does chkAgree actually block? does the enquiry email arrive?) — submitting is prohibited; render-only verified.
- **Deliverability of `support@kairaliproduct.com` / `support@kairaliproducts.com`** — no MX/mail probing done.
- **Social profile liveness**: facebook.com page returned HTTP 400 to curl (bot-blocked — not proof of a dead page); twitter→x.com, LinkedIn, YouTube returned 200 but curl cannot confirm the profiles are alive/unsuspended.
- **ayurvedichealingvillage.com outbound** — 403 to curl (WAF); not asserted broken.
- **Whether UA-102795379-1 property still exists in the GA account** — needs GA admin access; only the on-page tag class (legacy analytics.js) is asserted.
- **Lighthouse/performance, WAVE accessibility** — out of this pass's tooling.
- **Search Console status** (indexed dupes across http/www variants) — needs GSC access.

---

## DELEGATION SPLIT (draft — findings only, nothing executed)

**Sunaj (infra/Plesk/IIS):** 1. Force 301 http→https + HSTS; pick one canonical host (www or apex) and 301 the other (H1/H2). 2. Strip IIS/ASP.NET/Plesk version headers; custom 404 for .aspx (S13). 3. Watch Let's Encrypt renewal (expires 01 Oct 2026).
**Deepu (web tech — this is ASP.NET, not WP; confirm he owns it or name the vendor):** 1. Canonical tag in master template (H2). 2. GA4 snippet decision + install (H3, Abilash to confirm the domain's future first). 3. robots.txt + XML sitemap + fix footer "Sitmap"→"Sitemap" link target (M4 — robots.txt is ask-first, hard gate #3). 4. Fix `hhttp://` (M6), Google+ icon removal (M7), https image schemes (M8), single jQuery (M9), viewport zoom (S12).
**Anupam (copy/meta):** 1. Rewrite group-page meta description WITHOUT "Since 1908" (locked-fact FAIL #1 — priority). 2. Fix `support@kairaliproduct.com` typo in contact meta (M5). 3. Four SERP copy defects (S11).
**Abilash (register review — decisions):** 1. Locked-fact FAIL #2: `support@kairaliproducts.com` vs locked `info@kairali.com` on a products-brand microsite — ruling needed (same class as kairalicenters). 2. "Over 100 Years of Heritage" frozen-number flag. 3. Does kairbykairali.com stay live / get rebuilt / get folded into kairaliproducts.com? (It is a 2017-era brochure with dead analytics — the answer changes how much of the above is worth fixing.)

*Evidence artifacts (raw HTML captures, headers, link-check output) retained in session scratchpad `…/scratchpad/kair/` — not committed.*
