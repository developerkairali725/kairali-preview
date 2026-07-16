# QA/QC audit — theblushlounge.com (LIVE static-PHP site + /blog/ WordPress, Sneha's personal brand)

- Audited: **2026-07-16 18:46:25 IST** (fetch window 18:39:46–18:46:25 IST)
- Auditor: factory QA pass (findings only, no fixes applied — CLAUDE.md §QA audit pass; D-TWO-LANE ruling 16 Jul 2026)
- Method: external raw-HTML capture via `curl` (desktop Chrome UA, `--max-time 20`), byte-level inspection + `openssl s_client` for TLS. No browser tools used (shared pane rule) — visual/mobile render checks NOT RUN, listed below. Read-only GET/HEAD only; no form submitted.
- Sample: 14 page URLs fetched — `/` (apex http+https+www), `/about.php`, `/services.php`, `/gallery.php`, `/contact.php`, `/bridal-makeup.php`, `/fashion-makeup.php`, `/creative-makeup.php`, `/special-effects.php`, `/mens-makeup.php`, `/grooming-session.php`, `/blog/` (http+https), blog post `/blog/bridal-makeup/` — plus `robots.txt`, sitemap probes (5 paths), `/blog/wp-sitemap.xml`, `/blog/wp-json/`, `/blog/wp-json/wp/v2/users`, `/blog/feed/`, xmlrpc/wp-login/readme probes, 1 deliberate 404 probe, 7 asset HEAD checks, TLS cert inspection (apex + www).
- Context honoured: full outage restored 14 Jul by Sunaj (SSL fix) — liveness was check #1. Known old-site WhatsApp conflict: **+91 88269 21110 ruled correct** vs +91 88260 21114 wrong. E register (personal brand) — Kairali brand law (info@kairali.com etc.) does NOT apply here; noted as N/A, not as violations.

---

## LIVENESS VERDICT: **UP** — the 14 Jul restore is holding (as of 2026-07-16 18:46 IST)

- `https://theblushlounge.com/` → HTTP/1.1 **200**, 10,208 bytes, 0.11 s (Server: nginx). All 14 sampled URLs 200.
- TLS: Let's Encrypt cert, **issued 2026-07-14 07:52:40 GMT** (matches Sunaj's restore), **expires 2026-10-12**, SAN covers `theblushlounge.com` + `www.theblushlounge.com`, chain verifies (depth 0–3 OK). LE = 90-day cert: **auto-renew must be confirmed server-side or the site dies again ~12 Oct** (NOT verifiable externally — see NOT RUN).
- SECURITY SCREEN CLEAN (rule r): 0 spam keywords (`casino|gambling|betting|poker|viagra|payday`), 0 `<marquee>`, 0 hidden-element CSS, 0 `eval(/atob(/fromCharCode` in inline scripts, 0 zero-width-char clusters (single ZWSP in about.php is a copy defect, finding #15), and **no text addressing AI agents in any fetched content** — nothing quarantined.

---

## Findings (severity-ranked, evidence-linked)

### HIGH

1. **H / https://theblushlounge.com/gallery.php (nav menu)** / **Dev-machine `localhost` link leaked to production**: the Blog nav item is `<a href="http://localhost/ram/theblushlounge/blog/">Blog</a>` (line 44 of served HTML). Dead link for every visitor who opens the menu on the Gallery page, and it leaks the developer's local path/user `ram` (same `ram` exists as a live WP account — finding #6). Other pages link `http://theblushlounge.com/blog` correctly, so this is a stale template variant on gallery.php only.

2. **H / sitewide floating WhatsApp CTA (5 main pages: /, about, services, gallery, contact)** / **Malformed WhatsApp link — literal space inside the phone parameter**: `href="https://api.whatsapp.com/send?phone=+9188269 21110&text=Hi"` (verbatim, incl. the space). The number is the RULED-CORRECT +91 88269 21110, but a raw space in a URL query is invalid — browsers encode it to `phone=+9188269%2021110`, which WhatsApp's send endpoint does not parse as a valid phone. The site's #1 lead channel likely fails on click. Click-through behaviour requires an interactive client — flagged as high-risk, behaviour itself listed unverified in NOT RUN. Fix (S): remove the space → `phone=918826921110`.

3. **H / protocol + host canonicalisation** / **No http→https redirect, no www→apex redirect, no canonical tags anywhere**: `http://theblushlounge.com/` → 200 (no redirect), `https://www.theblushlounge.com/` → 200, `http://www.…` → 200; www homepage is byte-identical to apex (cmp = identical, 10,208 bytes); `grep rel="canonical"` across all 14 captured pages = 0. Four duplicate hosts of every page for Google, and users can browse the whole site insecure over http. Fix (S): server-level 301 http→https + www→apex.

4. **H / forms + privacy (DPDP/GDPR hygiene)** / **Lead forms collect name/phone/email on 8+ pages with NO privacy policy, terms, or consent anywhere on the site**: `<form>` present on contact.php (name/mobile/email/message, `method="post"`, no `action`) and on all 6 service sub-pages (`<form action="#" id="contactFormInner" method="post">`), plus WP comment forms on blog; `grep -il 'privacy|terms|consent'` across every captured page = **0 hits**. Forms render (HTML present; not submitted per rules). Fix: add a privacy page + link it from footer/forms.

### MEDIUM

5. **M / https://theblushlounge.com/robots.txt + sitemap** / **robots.txt = 404; main site has NO sitemap**: `robots.txt` → 404; `/sitemap.xml`, `/sitemap_index.xml`, `/wp-sitemap.xml` → 404. Only the blog has one (`/blog/wp-sitemap.xml` → 200, 4 child maps; `/blog/sitemap.xml` 302s to it) — the 11 main-site pages are in no sitemap. Bonus defect: the 404 error page itself says "*Additionally, a 404 Not Found error was encountered while trying to use an ErrorDocument to handle the request*" — the custom error page is misconfigured (Apache behind nginx). Fix (S): add robots.txt with Sitemap: line + a simple sitemap.xml covering the PHP pages; repair ErrorDocument.

6. **M / /blog/ WordPress hardening (post-outage)** / stack is old and fully enumerable: feed generator = **WordPress 6.1.10** (`/blog/feed/`, current core is 6.x several branches ahead — mid-2026); `/blog/readme.html` → 200; `/blog/xmlrpc.php` answers POST `system.listMethods` → 200 (brute-force amplification vector); `/blog/wp-json/wp/v2/users` → 200 **exposing account list including leftover dev account** `{"id":2,"slug":"ram "}` (trailing space in slug; same "ram" as the localhost path in finding #1) + user 1 "Blush Lounge"; `/blog/wp-sitemap-users-1.xml` also publishes author archives. Fix (Sunaj): core+plugin update, disable xmlrpc, remove/disable the `ram` account, block users REST enumeration.

7. **M / 5 service sub-pages are one duplicated page** / fashion-makeup.php, creative-makeup.php, special-effects.php, mens-makeup.php, grooming-session.php (each ~15.1 KB) differ from each other **only in the `<h1>` text and one hero image** (verified by diff); all five carry the BRIDAL body copy verbatim ("We start this process with a one to one bridal consultation…" + "Looking for Bridal Makeup? Submit your enquiry now… call +91-088269 21110") under FASHION/Creative/Mens/etc. headings. Same defect inside services.php: the **MENS MAKEUP section repeats the Special-Effects Halloween paragraph verbatim** ("Is it Halloween time and you need a quick makeover ? Well we cater to this need and can dress you as a zombie etc…"). Duplicate/wrong content on 6 indexable URLs. Fix (copy): write real copy per service or noindex/remove the stubs.

8. **M / mixed content sitewide (http:// img srcs on https pages)** / counts of `src="http://` per page: home/about/services/gallery/contact **6 each** (footer social icons insta/fb/icon/utube + whatsapp.png, all `http://theblushlounge.com/img/…`), bridal-makeup **27**, other sub-pages **19 each**, blog list **3**, blog post **4** (incl. `http://theblushlounge.com/img/book.jpg` booking CTA). Passive mixed content — modern browsers auto-upgrade, older agents warn/block. Fix (S): search-replace `src="http://theblushlounge.com` → `https://` (+ same for the http:// internal `<a href>`s on services.php and nav Blog links).

9. **M / dead CTA buttons on 5 sub-pages** / "Book Your Appointment" and "Get Call Back" image buttons are `<a href="">` (empty href — clicking reloads the page) on fashion-makeup, creative-makeup, special-effects, mens-makeup, grooming-session (2 each = **10 dead CTAs**; bridal-makeup.php has real targets). Fix (S): point them at contact.php or the enquiry form anchor.

10. **M / titles + meta descriptions** / `contact.php` ships placeholder `<title>blush</title>` and `<meta name="description" content="">` (empty) — the money page's SERP snippet is "blush". All 10 other main pages share ONE identical title (`Blush Lounge - Makeup by Sneha`) and ONE identical description (`…Health/beauty in Delhi, India` — reads like a scraped Facebook category). Every blog URL (list + posts) shares `<title>Blush Blog</title>`; blog list + posts have empty descriptions. No JSON-LD anywhere (0 `application/ld+json`), no Open Graph tags (0 `property="og:`) — no LocalBusiness/BeautySalon schema on a local-service business. Fix (S): unique title+description per page; schema is rebuild-scope.

11. **M / truncated testimonial, home + about pages** / the single testimonial ends mid-sentence: "…Sneha is a pure professional who took my coctail party make up look to another level! Definitely " — cut off after "Definitely " (verbatim, incl. trailing space) + typo "coctail" (→ cocktail). The only social proof on the site is visibly broken. Fix (S): restore the full quote.

12. **M / dormant WRONG WhatsApp number still in source (5 pages)** / the ruled-wrong number survives in a commented-out footer block on /, about, services, gallery, contact: `<!-- … href="https://api.whatsapp.com/send?phone=+918826021114&text=Hi theblushlounge.com" … -->` (×5). Not rendered to users today, but it is one uncomment away from regressing the 21110-vs-21114 conflict. Fix (S): delete the comment block outright.

13. **M / heading structure** / h1 counts: home **3** ("MAKEUP ARTIST", "OUR SERVICES", "TESTIMONIALS"), about **2**, gallery **0**, blog post h1 = generic "BLOGS". services/contact/sub-pages = 1 (correct). Fix (S): one h1 per page.

### SMALL

14. **S / frozen rolling number (LOCKED-FACTS flag)** / `<h2>5+ Years Experience in Makeup </h2>` hard-coded on all 6 service sub-pages. Site template dates to ~2018 (Google Maps embed param `!4v1515477223271` = Jan 2018; newest blog post Mar 2019), so the typed "5+" is ~8 years stale. Rolling values must be computed or removed (PR #65 class of defect). Fix: reword or compute.

15. **S / copy defects (beyond #7/#11)** / services.php: "Makeup **Intermidiate**" (→ Intermediate), "nothing less **that** the best" (→ than), "the **trail** is an in-depth analysis down" (→ trial; sentence broken), "An in-house nail technician **in** provided" (→ is), "globe.Each" (missing space); about.php: "E​very brides vision" — contains a **zero-width space** inside "Every" (1 ZWSP, byte-verified) + missing apostrophe ("bride's"); homepage header `<p>my profile</p>` reads as placeholder. Fix (S): copy sweep.

16. **S / script-order coding error, contact.php** / loads `js/bootstrap.min.js` (line ~243) BEFORE `js/jquery.min.js` (line ~245) — Bootstrap's JS requires jQuery and throws a console error on every contact-page load (all other pages load jquery first). Also stray markup after `</html>`: `<!-- PHP E-mail functionality -->` trails the closing tag. The form posts to itself with client-side JS validation only; whether the PHP mailer actually delivers is NOT verifiable without submitting (see NOT RUN). Fix (S): swap the two script tags.

17. **S / invalid HTML nesting, services.php** / engagement section closes `</div>` before its parent `</ul>` (`<ul><li>…</li></div>` then `</ul>`, lines ~90–91) — malformed list markup. Fix (S): move the `</ul>` inside the column div.

18. **S / blog is stale + metadata broken** / newest visible post dated **March 13, 2019** (7+ years); `datetime=""` attributes are empty on post dates (`class="entry-date" datetime="">March 13, 2019`); only 3 posts exist (`/blog/blushlounge-by-sneha/`, `/blog/bridal-makeup/`, `/blog/our-services/`) and their titles duplicate main-site pages. Decision for rebuild: keep-and-refresh or 301 into the main site.

### PASS / notes

- **PASS / analytics** — GTM container `GTM-MFXP2LH` present (script + noscript) on all main + blog pages; no dead `UA-` tag anywhere; no hard-coded `G-` tag (GA4 presumably inside GTM — container contents not externally verifiable, see NOT RUN).
- **PASS / viewport meta** present on every sampled page. Favicon 200.
- **PASS / assets sample** — logo.png, favicon.png, gal1.jpg, style.css, jquery.min.js, whatsapp.png, book-your-appointment.jpg all HEAD 200 with correct content-types.
- **PASS / 404 handling** — `/qa-nonexistent-20260716.php` returns real HTTP 404 (no soft-200); error-page cosmetics covered in #5.
- **NOTE / homepage has no `<meta charset>`** tag (about/services/gallery/contact have it) — covered by the `Content-Type: text/html; charset=utf-8` response header, so informational only.

---

## LOCKED-FACTS RESULT: **FLAG (fail on rolling-number rule; group facts clean/N-A)**

- Banned `+91 92898 38777` / `9289838777` (all spacing variants): **0 occurrences** across all 16 captured files. Correct-Priya `…38797`: 0 (N/A — not a KTAHV property).
- `Since 1908` / `115+ years` / group-founding claims: **0 occurrences**.
- **Frozen rolling number: PRESENT — "5+ Years Experience in Makeup" ×6 pages** (finding #14) → this is the flag that fails the pass.
- `info@kairali.com`: absent — **N/A by design** (E register, personal brand; per task context "not Kairali brand law"). Public contact is `makeoverbysneha@gmail.com` (contact.php) — consistent, noted only.
- Site-specific ruling (21110 vs 21114): the RULED-CORRECT **+91 88269 21110** is what users see and dial — displayed "088269 21110" (contact.php ×2) and `tel:08826921110` (blog post); the live WhatsApp link also carries 21110 **but is malformed** (finding #2). The ruled-WRONG **+91 88260 21114** appears ONLY inside commented-out HTML ×5 pages (finding #12) — dormant, zero rendered occurrences.

---

## NOT RUN (honest list)

1. **Mobile/visual render checks** — no browser/Playwright tools this pass (shared-pane fleet rule); layout, nav-overlay behaviour, image rendering, gallery display unverified.
2. **Form submission / email delivery** — findings-only rule forbids submitting; contact.php PHP mailer and sub-page enquiry forms unverified beyond "renders in HTML".
3. **WhatsApp CTA click-through** — the malformed-space link (#2) needs one manual tap on a phone to confirm fail/degrade; flagged high on URL-syntax evidence only.
4. **GTM container contents** — whether GA4 actually fires inside GTM-MFXP2LH is not externally inspectable; needs GTM account access or a browser network trace.
5. **SSL auto-renew configuration** — cert expires 2026-10-12; renewal cron/certbot state is server-side (Sunaj to confirm, else repeat of the 13-14 Jul outage).
6. **Full crawl** — 14 pages + 7 assets sampled, not an exhaustive link check; blog taxonomy/author archives not walked.
7. **Lighthouse / performance / Search Console data** — out of this pass's scope.

---

## DELEGATION SPLIT (findings only — no fixes applied this pass)

**Sunaj (infra/security):** 301 http→https + www→apex (#3); robots.txt + sitemap + ErrorDocument (#5); WP 6.1.10 update, xmlrpc off, remove `ram` account, block user enumeration, readme.html (#6); confirm LE auto-renew before 12 Oct (NOT-RUN #5).

**Deepu (web dev):** fix localhost Blog link on gallery.php (#1); remove space from WhatsApp href ×5 pages (#2); delete commented wrong-number block ×5 (#12); https search-replace for img srcs + internal links (#8); wire the 10 empty-href CTAs (#9); unique titles/descriptions incl. contact.php "blush" (#10); h1 structure (#13); script order + post-`</html>` stray on contact.php (#16); `</ul>` nesting on services.php (#17).

**Anupam (copy):** real copy for the 5 duplicated sub-pages + MENS/Halloween paragraph (#7); restore truncated testimonial + "coctail" (#11); typo sweep incl. ZWSP (#15); resolve "5+ years" frozen claim with Sneha (#14).

**Abilash (register/decisions):** blog fate at rebuild (keep-refresh vs 301) (#18); confirm with Sneha that 88269 21110 remains the sole public number before Deepu's #2/#12 edits ship.

*Evidence artifacts (raw HTML captures, header dumps, TLS output, grep logs) retained in session scratchpad `…/scratchpad/tbl/` — not committed.*
