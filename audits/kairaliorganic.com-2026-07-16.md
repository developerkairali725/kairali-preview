# QA/QC audit — kairaliorganic.com (LIVE legacy ASP.NET WebForms brochure site, KAPPL product register)

- Audited: **2026-07-16 19:10:44 IST** (fetch window 18:56:56–19:10:44 IST)
- Auditor: fleet QA pass (findings only, no fixes applied — CLAUDE.md §QA audit pass; D-TWO-LANE ruling 16 Jul 2026: curl-only, no browser tools)
- Method: external raw-HTML capture via `curl` (desktop Chrome UA + Googlebot UA cross-check), byte-level inspection. Stack: Microsoft-IIS/10.0 + ASP.NET 4.0.30319 + Plesk (server headers). No WAF encountered — all fetches 200.
- Sample: 15 pages fetched — `/` (=default.aspx), `about-us.aspx`, `kairali-ayurvedic-group.aspx`, `enquire-now.aspx`, `free-online-consultation.aspx`, `contact-us.aspx`, `career.aspx`, `apply-now.aspx`, `kaircin.aspx`, `kairbossom.aspx`, `privacy-policy.aspx`, `sitemap.aspx`, `newsletter.aspx`, `founders-message-and-meet-the-directors.aspx`, `vision-and-mission.aspx` — plus `robots.txt`, `sitemap.xml`, 2 deliberate 404 probes, http/https/www/non-www variant probes, Googlebot cloaking check, 25 internal-link checks, 20 external family/social-link checks, 5 CDN-asset checks.
- Triage context honoured: "since 1908" claim, kairaliproducts.com email, legacy UA analytics — all three confirmed and evidenced below.

---

## SECURITY SCREEN: **CLEAN** (rule r injection screening, as of 2026-07-16 19:10 IST)

- **No AI-directed text / prompt-injection strings** on any sampled page or the 404 bodies (`ignore previous|you are an AI|system prompt|…` → 0 hits). Nothing quarantined.
- **Spam keywords zero** (`casino|gambling|betting|poker|viagra|…` → 0 across all 15 pages).
- **Zero-width characters 0; hidden-element CSS tricks 0** (only benign UI `display:none` on dropdown/menu blocks).
- **No script obfuscation**: `eval(|atob(|String.fromCharCode` → 0. Base64 blobs ≥300 chars are all legitimate ASP.NET `__VIEWSTATE`/`__EVENTVALIDATION` (decoded spot-check of career.aspx viewstate = its own job-listing data).
- **No cloaking**: Googlebot-UA fetch of `/` byte-identical to desktop-UA fetch (50,802 bytes both).
- **External scripts**: Google Analytics (analytics.js), jQuery/Bootstrap/owl/wow via cdnjs+stackpath+code.jquery.com, Zopim chat (`//v2.zopim.com/?38RRs4dEOpPyPxjFzvslnYOFx85Djzwk`), Chatbase chat (`https://chat.kairali.com/embed.min.js`, own domain). No unknown/injected third parties.

---

## LOCKED-FACTS RESULT: **FAIL** — "since 1908" Group claim live ×2 on homepage

- **FAIL / https://kairaliorganic.com/ (homepage, 2 instances)** — the Group-founding 1908 claim (WRONG per PR #65: 1908 = family lineage only; Group founded 1989):
  1. Why section: `"Moving to achieving our vision since 1908, Kairali has always proved itself to be an epitome of success…"`
  2. Group section: `"Kairali Ayurvedic Group, since its inception in 1908 has been preaching Ayurvedic principles…"`
  - Self-contradicted on the SAME homepage (and on kairali-ayurvedic-group.aspx): `"During the late 1980s, Kairali Ayurvedic Group ventured into holistic healthcare"` — consistent with the correct 1989 founding.
- **FLAG / frozen rolling numbers** (must be computed, not typed): home Books carousel `"Over 100 Years of Heritage & Tradition Simplified"`; kairali-ayurvedic-group.aspx body `"family tradition, carried over for over 100 years"` (lineage framing is the right register but the number is frozen); kairali-ayurvedic-group.aspx meta description `"From the 8 decades, Kairali subserves…"` (frozen + broken grammar, SERP-visible).
- **FAIL (register review — Abilash-gated, noted only) / public email** — locked fact `info@kairali.com` appears NOWHERE. Site-wide footer contact is `support@kairaliproducts.com` (2× per page, 13/13 footer pages); `sales.ho@kairaliproducts.com` ×4 on privacy-policy.aspx; `career@kairali.com` ×4 on career.aspx. Same conflict class as kairalicenters (known rebuild-scope, no copy delegation).
- **PASS / banned phone** — `+91 92898 38777`/9289838777 (all spacing variants): **0 occurrences** on all 15 pages. The correct-Priya …38797 also absent (non-KTAHV site, nothing expected). Site-wide phone is `+91-9555156156` (IVR + Customer Care, 2–3× per page).

---

## Findings (severity-ranked, evidence-linked)

### M — Google-compliance / infrastructure

1. **M / no robots.txt, no XML sitemap, but a sitewide dead link TO the sitemap** / `https://kairaliorganic.com/robots.txt` → **HTTP 404**; `https://kairaliorganic.com/sitemap.xml` → **HTTP 404** — yet the footer on all 13 footer-bearing pages links `<a href="sitemap.xml">XML Sitmap</a>` (sic). 13× dead footer link + "Sitmap" typo + no crawl directives + no sitemap for indexing. (HTML `sitemap.aspx` exists and returns 200.)
2. **M / zero canonicalization — 4-way duplicate site, insecure HTTP fully live** / `http://kairaliorganic.com/`, `http://www.kairaliorganic.com/`, `https://www.kairaliorganic.com/`, `https://kairaliorganic.com/` ALL return **200 with no redirect** (`location:` empty on every probe); https-www body byte-identical to https-non-www (cmp, 50,802 B); **no `rel="canonical"` on any of the 15 sampled pages**; no HSTS header. Google picks a version by guess; link equity splits 4 ways; http:// serves the full site unencrypted.
3. **M / analytics completely dead ~3 years** / all 15 pages carry TWO Universal Analytics stubs and nothing else: `ga('create','UA-102148054-1','auto')` via analytics.js, plus `gtag('config','UA-150512230-1')` **with no gtag.js loader script anywhere** (grep `googletagmanager.com/gtag/js` → 0 pages) — the second config pushes to a dataLayer nothing reads. UA properties stopped processing data 1 Jul 2023. **No GA4, no GTM** → the site has recorded nothing since mid-2023. (Property status inferred from the UA product retirement; account-level check NOT RUN.)
4. **M / raw ASP.NET error page on .aspx 404s, with version disclosure** / `GET /qa-nonexistent-20260716.aspx` → HTTP 404 but body is the framework default "The resource cannot be found." page ending `Version Information: .NET Framework Version:4.0.30319; ASP.NET Version:4.7.4136.0`. Non-.aspx probe (`/qa-nonexistent-20260716/`) → bare IIS 1,245-byte 404. Correct status codes (no soft-200), but no custom 404 and the YSOD discloses the patch level. Compounded by headers `server: Microsoft-IIS/10.0`, `x-aspnet-version: 4.0.30319`, `x-powered-by-plesk: PleskWin` and **zero security headers** (no HSTS/X-Frame-Options/X-Content-Type-Options/CSP on `/`).

### M — coding errors

5. **M / newsletter Subscribe button dead on ALL pages — JS SyntaxError kills the whole handler script** / footer inline script (13/13 footer pages, e.g. `https://kairaliorganic.com/` and every .aspx sampled) declares `var reg=/^([A-Za-z0-9_-.])+@([A-Za-z0-9_-.])+.([A-Za-z]{2,4})$/` — the character class `[…_-.]` is an out-of-order range. Verified in Node: `Invalid regular expression: … Range out of order in character class`. A regex-literal parse error is an early error → the ENTIRE inline block fails → `validateEmails` is never defined → clicking Subscribe throws `ReferenceError` and does nothing. The site-wide newsletter capture has been silently dead. Fix (S): `[A-Za-z0-9_.-]` (hyphen last) — one character move.
6. **M / homepage loads a 404 stylesheet + two conflicting jQuerys** / `/` includes `<link rel='stylesheet' href='https://daneden.github.io/animate.css/animate.min.css'>` → **HTTP 404** (verified; the repo moved to animate.style years ago), while wow.js still runs `new WOW().init()` against the missing keyframes; and it loads **jQuery 3.2.1 in `<head>` then jQuery 1.9.1 before `</body>`** (`code.jquery.com/jquery-1.9.1.min.js`), the second overwriting the first — a live downgrade to a 2013 build. Product pages use local `css/animate.css` (correct pattern) — home was never switched.
7. **M / dead brand links on the homepage** /
   - `href="hhttp://www.kairbykairali.com/"` (product-range carousel, "Ayurveda Influenced Herbal Cosmetics" subtitle link) — typo scheme `hhttp://` = unknown protocol, dead click.
   - `http://www.kairaliequipment.com/` ("Spa Equipment", linked 3× in Brands section) → **HTTP 500** (verified 19:0x IST) — the linked family site is down.
   - `http://www.ayurvedichealingvillage.com/` (Brands, "The Ayurvedic Healing Village") → **HTTP 403** to curl — WAF-blocked or dead, **unverified**, needs a human browser check.
   - All 20 other family/social links resolve 200 (twitter → x.com redirect OK); `facebook.com/KairaliAyurvedicProducts` returned **400 to curl** — Facebook bot-blocking, liveness **unverified**, not asserted dead.
8. **M / newsletter.aspx is a template leak from the TEA site + broken flow** / `https://kairaliorganic.com/newsletter.aspx` `<title>` = **"Kairali Tea – Thanks"** (wrong site — copied from kairalitea.com); h1 = `"Thank You for Subscribe Newsletter"` (sic); the thank-you renders even when opened with **no email parameter at all** (this fetch); meta description = `"Ayurvedic Proprietary Prodducts"` (sic — "Prodducts", also on sitemap.aspx). Additionally the subscribe flow (when the JS worked) passes the subscriber's address as a **GET query param** `newsletter.aspx?email=<address>` — personal data in URL/logs/referrers (S, privacy hygiene).

### M — content mistakes (SERP-visible)

9. **M / founders page `<title>`: "Founder's Massage"** / `founders-message-and-meet-the-directors.aspx` → `<title>Kairaliorganic - Founder’s Massage and Meet the Directors of Kairali</title>` — Massage↔Message typo in the browser tab + SERP title (page h1 is correct: "Founder's Message and Meet the Directors"). One-field fix.
10. **M (register review — Abilash) / Kairbossom marketed as "Breast Enlargement Oil"** / `kairbossom.aspx` `<title>Kairbossom – Ayurvedic Breast Massage Oil | Breast Enlargement Oil</title>` + homepage img alt `"Breast Enlargement Oil"`; meta claims "strengthen, firm and ton the breast … transform the bosom in proper shape". Enhancement-claim exposure (ASCI/Drugs & Magic Remedies Act adjacency) + typo "ton". Decision, not copy delegation.
11. **S / meta-description grammar cluster** / kaircin.aspx: `"helps to prevents pimples"`; kairbossom.aspx: `"firm and ton the breast"`; enquire-now.aspx: `"we will get back to you within business day"`; kairali-ayurvedic-group.aspx: `"From the 8 decades, Kairali subserves…"`; newsletter/sitemap: `"Prodducts"`. Five Yoast-equivalent field edits.

### S — SEO/markup hygiene

12. **S / no structured data anywhere** / `application/ld+json` → 0 on all 15 pages, including all 10 product pages (no Product/Organization schema) — product SERPs run bare. (Rebuild-scope for the new site; noted for the record.)
13. **S / h1 defects** / homepage's ONLY h1 is `<h1><span class="heading abouticon">Why</span></h1>` (the brand/products headings are h2/spans); kaircin.aspx and kairbossom.aspx have **0 h1** (product name is a `<span class="products-dtl-title">`).
14. **S / homepage og/meta clutter** / `og:image` = `http://www.kairaliorganic.com/images/logo-new.png` (insecure scheme + www variant on an https page; only og:image+og:description exist — no og:title/og:url); duplicate robots metas (`content="ALL"` AND `content="index, follow"`); duplicate author metas. Inner pages have no og at all.
15. **S / homepage viewport locks zoom** / `/` only: `maximum-scale=1.0` (+ `user-scalable=1.0`) — pinch-zoom disabled, WCAG 1.4.4 failure on the page most visited; all 14 inner pages use the correct `width=device-width, initial-scale=1`.
16. **S / privacy policy frozen in 2016** / privacy-policy.aspx: `"effective from 18th June, 2016"` — predates GDPR (2018) and DPDP Act (2023), on a site whose consultation form collects health information. Register review for the legal wording; the date itself is an expired-date flag.
17. **PASS / mixed content** — zero `http://` asset srcs (img/css/js) on any sampled page; all CDN assets https or protocol-relative. (The http:// URLs on-page are outbound links and the og:image above, not loaded assets.)
18. **PASS / Lorem ipsum** — 0 occurrences on all 15 pages.

### Forms (render-only inspection — nothing submitted)

19. **PASS with caveats / forms render** / enquire-now.aspx (name/gender/age/phone/email/address/country-state-city/subject/message), free-online-consultation.aspx (health questionnaire incl. medical-history checkboxes), contact-us.aspx, career.aspx + apply-now.aspx (job application) all render with fields and a working CAPTCHA image (endpoint literally named `asdfghjkl.aspx` — returns a real 70×30 GIF, works, but the keyboard-mash filename is a code-quality smell). Every form page carries a privacy-policy.aspx link (1–2×).
20. **M-verify / consent enforcement unknown** / enquire-now.aspx and free-online-consultation.aspx each have `<input name="chkAgree" type="checkbox">` + label `"I have read and agree to Kairali Organic privacy & terms"` — but **no client-side validator is attached to chkAgree** (WebForm validators cover name/phone/email/security-code only; chkAgree appears only in `__ControlsRequirePostBackKey__`). Whether the server rejects an unticked consent cannot be verified without submitting the form (rule: never submit) → **unverified**; flag: consent on the health-data consultation form may be optional in practice (DPDP exposure).

---

## Finding count
1 security screen (CLEAN) · locked facts **FAIL** (2× "since 1908" + email-domain conflict; banned phone PASS) · 4 M infrastructure · 4 M coding · 3 content (2 M, 1 S cluster) · 5 S hygiene + 2 PASS · 1 form PASS-with-caveat + 1 M-verify.

---

## NOT RUN (honest gaps — D-TWO-LANE: curl-only pass, no browser)
- **Mobile/visual render checks** — no browser/Playwright per the two-lane ruling (shared pane in use). Homepage zoom-lock and the 404-stylesheet visual impact are inferred from source only.
- **Form submissions** — never submitted (binding rule), so server-side consent enforcement, CAPTCHA validation, and the enquiry/consultation delivery pipeline are unverified.
- **GA account status** — UA property death is inferred from Google's product retirement (Jul 2023), not from account access.
- **Facebook page liveness** — curl got HTTP 400 (bot-block); needs a human browser look. Same for ayurvedichealingvillage.com (403).
- **Lighthouse / Core Web Vitals**, JS runtime behaviour of the double-jQuery + dual chat widgets (Zopim AND Chatbase, the latter auto-clicked open after 5s on first two page loads per its inline script) — noted from source, not profiled.
- **Search Console / index coverage** — no property access from this pass.

## DELEGATION SPLIT (proposed — findings only, nothing executed)

**Deepu (web tech):** 1. robots.txt + XML sitemap + fix footer link/typo (M/#1). 2. 301 scheme+host canonicalization http→https, www→non-www (or reverse) + canonical tags (M/#2) — *touches server config: ask before touching per hard gate 3*. 3. GA4 install (M/#3). 4. Custom 404 / customErrors + strip version headers (M/#4). 5. One-char regex fix to revive newsletter (M/#5). 6. Swap daneden 404 CSS for local animate.css, remove second jQuery (M/#6). 7. Fix `hhttp://` link (M/#7). 8. Founders title Massage→Message (M/#9). 9. h1/og/viewport/meta-typo batch (S/#11–#15).

**Anupam (copy):** meta-description grammar cluster (#11); newsletter page title+h1 (#8, after Deepu confirms the template source).

**Sunaj (infra):** kairaliequipment.com HTTP 500 — separate site, needs its own look; version-disclosure hardening review (#4).

**Abilash (register review — decisions):** 1. "Since 1908" ×2 on homepage → correct lineage framing per PR #65 (this is the D-triage headline). 2. support@kairaliproducts.com vs locked info@kairali.com — same class as kairalicenters, rebuild-scope call. 3. Kairbossom "Breast Enlargement Oil" claim exposure. 4. 2016 privacy policy + possibly-optional consent on the health-data consultation form (with #20). 5. Whether this site is rebuilt or folded into the KAPPL Shopify/kairaliproducts.in estate (two dead-analytics chat widgets + WebForms stack suggest fold-in).

*Evidence artifacts (raw HTML captures, headers, link-check outputs, captcha GIF) retained in session scratchpad `…/scratchpad/ko/` — not committed.*
