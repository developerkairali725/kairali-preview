# QA/QC audit — kairalicenters.com (LIVE WordPress, treatment-centres network)

- Audited: **2026-07-16 16:50:56 IST** (fetch window 16:44:49–16:50:56 IST)
- Auditor: factory QA pass (findings only, no fixes applied — CLAUDE.md §QA audit pass)
- Method: external raw-HTML capture via `curl` (desktop UA + Googlebot UA cross-check), byte-level inspection. WebFetch/markdown conversion deliberately avoided for the security pass — it strips the hidden-markup evidence this audit exists to find. Spam links NOT visited (rule r).
- Sample: 13 URLs fetched — `/`, `/locations/`, `/about-us/`, `/contact-us/`, `/product/bihar/`, `/product/delhi-ncr/`, `/panchakarma/`, `/blogs/`, `/franchise/`, `/online-consultation/`, blog post `/gut-health-secrets-how-an-aiims-doctor-lost-15-kg-naturally/`, `/testimonilas/`, `/5051-2/` — plus `robots.txt`, sitemap index + all 8 child sitemaps (340 URLs), 2 deliberate-404 probes, xmlrpc probe, http→https probes.
- Context honoured: 14 Jul mining found hidden `<marquee>` casino injection on every page (org-inventory §9); Sunaj cleaned pages + DB and rotated passwords 15 Jul. Known rebuild-scope content conflicts (email-domain extra "r", centre counts, founding year) noted only, not delegated.

---

## SECURITY VERDICT: **CLEAN** — the 15 Jul cleanup has held (as of 2026-07-16 16:50 IST)

Evidence, per the 14 Jul infection signature and standard WP-compromise markers, across all 13 sampled pages:

- **Hidden marquee GONE.** Zero `<marquee>` elements anywhere. Every sampled page's raw HTML tail now ends in stock WordPress `wp-emoji-loader.min.js` inline script → `</script></body></html>`. The pre-`</body>` injection point is clean on all 13 pages.
- **Casino/gambling keywords: zero.** `casino|gambling|betting|poker|slot|non aams|bookmaker|wager` → 0 hits on all pages, all sitemaps, robots.txt. (Sole grep hit was our own `/casino/` 404-probe URL echoed 3× in that 404 page's canonical/og tags — benign.)
- **The three 14-Jul spam domains** (`flowerhome.com.tw`, `budsandbrewsusa.com`, `veracruzalterno.com.mx`): 0 occurrences.
- **Zero-width characters** (U+200B/U+200C/U+200D): 0 across all pages. **Hidden-element CSS** (`width:0`, large negative `left`/`text-indent` inline styles): 0.
- **No cloaking.** Googlebot-UA fetch of `/` returned byte-identical size (261,815 bytes) to the desktop-UA fetch; 0 spam keywords in the Googlebot variant.
- **Outbound link inventory is clean.** Only externals across all pages: youtube.com, facebook, instagram, linkedin, twitter, pinterest, wa.link/wa.me, maps.app.goo.gl/goo.gl, gmpg.org (WP boilerplate), plus the literal placeholder `href="http://url"` (hygiene finding #7). No off-topic/pharma/gambling outbounds.
- **No injected scripts.** External `<script src>` = googletagmanager (AW-973271018, G-Q6LY3L0NK7) + google.com/recaptcha only. External iframes = Google Maps embed + GTM noscript only. `eval(`/`atob(`/`String.fromCharCode` in inline scripts: 0. Suspicious base64 blobs ≥500 chars: 0.
- **Sitemaps clean.** Index + 8 Yoast child sitemaps parse as valid XML; all 340 `<loc>` URLs are on-domain `https://kairalicenters.com/…`; 0 spam-keyword slugs; slugs all Ayurveda/business-plausible (oddball `/5051-2/` verified = a real Ayurveda blog post, "Anxiety Rash…", scanned clean).
- **robots.txt unchanged** from the 14 Jul capture (5 crawler-bot disallows only) — no injected sitemap/allow lines.
- **404 handling correct.** `/qa-nonexistent-page-20260716/` and `/casino/` both return HTTP 404 with the normal theme 404 page (no soft-200, no spam doorway behaviour).

### Post-hack hardening gaps (security findings for Sunaj — S-sized)
- **M / `https://kairalicenters.com/xmlrpc.php`** / POST `system.listMethods` answers fully, `system.multicall` available (verified 16:50 IST) — brute-force/credential-stuffing amplification vector left open on a site compromised 2 days ago. Fix: disable xmlrpc (plugin or server rule) unless Jetpack/app needs it.
- **S / `/` (sitewide head)** / `<meta name="generator" content="WordPress 7.0.1">` + `<meta name="generator" content="WooCommerce 10.9.4">` — version disclosure aids re-targeting. Fix: remove generator metas.
- **NOTE / reinfection watch** / injections of this class commonly return via a persisting backdoor (rogue admin, modified plugin file, cron). This external pass sees only rendered output. Recommend Sunaj re-run a server-side file-integrity + user-list + cron check ~1 week out, and re-run this external grep weekly until Wave-2 replaces the site.

---

## Hygiene findings (S/M only; rebuild-scope items noted, not delegated)

- **M / https://kairalicenters.com/about-us/** / **Visible Lorem ipsum placeholder copy, 6 instances** on the primary trust page: the hero lead paragraph directly under the "About Us" h1 (`<p class="lead">Lorem ipsum dolor sit amet, consectetuer adipiscing elit, sed diam nonummy nibh euismod tincidunt…`), one intro paragraph (`<p class="lead text-center"><strong>Lorem ipsum</strong>…`), and 4 team-member bio blurbs ("Lorem ipsum dolor sit amet, consectetuer adipiscing elit, sed diam nonummy."). Fix (S): replace with one approved sentence each, or hide the blocks until rebuild — this page is on the lead path and currently reads as an unfinished site.
- **M / https://kairalicenters.com/ (footer, sitewide — 39 occurrences across 13 sampled pages)** / social icons Instagram/Twitter/Pinterest link to literal `href="http://url"` placeholder (`target="_blank"`, e.g. `<a href="http://url" target="_blank" data-label="Instagram"…`) — every page ships 3 dead social buttons. Fix (S): set the real profile URLs in theme footer settings, or remove the icons.
- **M / https://kairalicenters.com/locations/** (+ sitewide header/footer) / **insecure `http://` image srcs**: `divider.jpg` ×16, `whatsapp.jpg` ×8, `email.jpg` ×5, `locations.jpg` ×4 on /locations/; `logo.svg` ×13 sitewide; also `br.jpg`, `brl.jpg`, `hindi.jpg`, `rank.jpg`. Server does 301 http→https (verified) and modern browsers auto-upgrade passive mixed content, so impact today is redirect latency + warnings in stricter agents — but on the site's #1 lead page. Fix (S): DB search-replace `src="http://kairalicenters.com` → `https://`.
- **M / https://kairalicenters.com/online-consultation/** / 4 `<h1>` elements — the real title "AYURVEDIC DOCTOR CONSULTATION" plus stat numbers "33+", "15.3L", "83%" each marked up as h1. Fix (S): demote stats to styled `<p>/<span>`.
- **M / https://kairalicenters.com/product/bihar/** / 5 `<h1>` elements (region lead-landing page); **https://kairalicenters.com/** / 2 `<h1>` ("IMPROVING HEALTH EVERYDAY" + "WHY KAIRALI AYURVEDA?"); **/contact-us/** and **/franchise/** / 0 `<h1>`. Fix (S): exactly one h1 per page via heading-level edits in the builder.
- **M / meta descriptions MISSING** on /locations/, /about-us/, /blogs/, /product/bihar/, /product/delhi-ncr/ (present on home, contact, panchakarma, franchise, online-consultation). /locations/ is the money page — SERP snippet is currently Google's guess. Fix (S): write Yoast descriptions for the 5 pages.
- **S / https://kairalicenters.com/ (head)** / home meta description + og:description + JSON-LD description carry typo **"Best Ayurvedic healing centere"** ("centere" ×3). Fix (S): one Yoast field edit.
- **S / https://kairalicenters.com/testimonilas/** / misspelled slug AND live page `<title>Testimonilas - Kairali Ayurvedic Center</title>` (known sic from inventory §1a — the misspelling is user-visible in browser tab + SERP). Fix (S): retitle "Testimonials" now; slug+301 is rebuild-scope.
- **S / https://kairalicenters.com/robots.txt** / no `Sitemap:` directive line. Fix (S): append `Sitemap: https://kairalicenters.com/sitemap_index.xml`.
- **M (register review — Abilash) / sitewide floating WhatsApp widget + wa.link** / widget config uses `"phone":"918826139700"` (×49, incl. `wa.link/4yt0ne` → resolves to `api.whatsapp.com/send?phone=918826139700`, and one raw `wa.me/918826139700`), while the Mehrauli/HQ centre phone printed on /locations/ is `+91-8826513700` (×5). **8826-139700 vs 8826-513700 — near-transposed digit blocks; one may be wrong, or they are two legitimately different lines. Cannot verify externally — flag for register review before any lead is lost to a dead WhatsApp number.**
- **LOCKED-FACTS RESULT (register review) / sitewide** / The banned `+91 92898 38777` does NOT appear anywhere in the sample (all spacing variants grepped); the correct-Priya `…38797` also absent — zero occurrences of either on this non-KTAHV site, nothing to scrub. Site-wide contact is `info@kairalicenters.com` (×80) + `+91-9555156156` (×78); locked group fact `info@kairali.com` absent; `hoa@kairali.com` ×4 in header metadata; per-centre `@kairalicentres.com` (extra "r") mailboxes ×7 still live — **email-domain + info@ conflicts are known rebuild-scope (niche-brief §0.2), Abilash-ruling-gated: noted only, no copy delegation.**
- **NOTE (rebuild-scope, skip) / schema** / No `LocalBusiness`/`MedicalClinic` anywhere — /locations/ (14 centres) carries only WebPage/Organization/Breadcrumb. FAQPage valid-looking on home (4 Q/A) and /panchakarma/ (5 Q/A). Per-centre MedicalClinic schema is the rebuild's job (niche-brief §2.5) — do not retrofit the legacy site.
- **NOTE (rebuild-scope, skip) / forms & consent** / CF7 forms render on all sampled pages, each with a privacy-policy link in footer reach. Consent checkbox exists ONLY on /contact-us/ and /franchise/ — and there it is `wpcf7-acceptance optional` with widget `consent_enabled:"no"`; the sitewide enquiry/exit-intent popups have no checkbox at all. Matches inventory §5 (known GDPR/DPDP gap); full fix is rebuild-scope. S-sized interim if Deepu wants it: flip the two existing acceptance boxes from optional to required.
- **PASS / broken-link sample** / 40 unique internal links harvested from home + locations, all HEAD-checked: 39×200; only non-200 was `xmlrpc.php` 405 (head-boilerplate EditURI link, covered above). No 4xx/5xx content links. 404 handling correct (see verdict). No hreflang (known single-locale legacy — rebuild-scope, skip).

Finding count: **1 security-verdict (CLEAN) · 2 security-hardening (1 M, 1 S) + 1 watch-note · 10 hygiene findings (6 M, 3 S, 1 M-verify) · 2 rebuild-scope notes · 1 pass**.

---

## DELEGATION SPLIT

**Sunaj (security/infra):**
1. Disable/block `xmlrpc.php` (M).
2. Strip WP/Woo generator metas (S).
3. Schedule server-side integrity re-check (~23 Jul) + weekly external spam-grep until Wave-2 cutover (watch-note).

**Deepu (WP tech):**
1. DB search-replace `http://kairalicenters.com` → `https://` in image srcs (M).
2. Fix h1 counts: online-consultation (4), product/bihar (5), home (2), contact-us (0), franchise (0) (M).
3. Add 5 missing Yoast meta descriptions — /locations/ first (M).
4. Replace `href="http://url"` placeholder social links in footer or remove icons (M).
5. Add `Sitemap:` line to robots.txt (S). 6. Retitle /testimonilas/ page title (S). 7. Optional interim: make the 2 existing consent checkboxes required (S).

**Anupam (copy):**
1. Replace 6 visible Lorem ipsum blocks on /about-us/ (hero lead + intro + 4 team bios) with approved one-liners (M).
2. Fix "centere" typo in home meta/og/JSON-LD description (S).

**Abilash (register review — decisions, not tasks):**
1. WhatsApp number 918826139700 vs Mehrauli 8826513700 — confirm the correct live WhatsApp line.
2. Known rebuild-scope conflicts left untouched per brief: `@kairalicentres.com` mailboxes, `info@kairali.com` absence, centre-count/founding-year copy.

*Evidence artifacts (raw HTML captures, sitemap dumps, link-check output) retained in session scratchpad `…/scratchpad/kc/` — not committed.*
