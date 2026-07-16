# QA/QC audit — kappl.co.in (LIVE legacy ASP.NET, KAPPL corporate/pharma site)

- Audited: **2026-07-16 19:21:15 IST** (fetch window 19:10:36–19:21:15 IST)
- Auditor: factory QA pass (findings only, no fixes applied — CLAUDE.md §QA audit pass; D-TWO-LANE 16 Jul 2026)
- Method: external raw-HTML capture via `curl` (desktop Chrome UA, `--max-time 20`), byte-level inspection + header inspection. Read-only GET/HEAD only; no form submitted; no browser tools used (pane shared with other agents).
- Sample: 11 on-domain URLs fetched — `/` (default.aspx), `about-us.aspx`, `contact-us.aspx`, `products.aspx`, `enquire-now.aspx`, `free-online-consultation.aspx`, `privacy-policy.aspx`, `sitemap.aspx`, `testimonials.aspx`, `news-and-articles.aspx?id=282`, `news-and-articles.aspx?id=277` — plus `robots.txt`, `sitemap.xml`, `turing.aspx` (captcha probe), 2 deliberate 404 probes, http/www variant probes, 48-link internal status sweep, 15 external-link probes.
- Context honoured: surfaced by 16 Jul triage as unexpected CONTENT (200, ~46 KB, real ASP.NET site) with a footer "Since 1908" flag. KAPPL e-commerce itself runs on Shopify (kairaliproducts.com) — out of factory workspace scope; this audit covers only the live kappl.co.in corporate site.
- Server fingerprint: `Server: Microsoft-IIS/10.0`, `X-AspNet-Version: 4.0.30319`, `X-Powered-By-Plesk: PleskWin` (from `home.headers`). TLS: valid Let's Encrypt cert `CN=kappl.co.in`, expires 2026-10-01; negotiates TLSv1.2 only.

---

## LOCKED-FACTS RESULT: **FAIL** (1 confirmed violation, 1 rolling-number flag, 1 email deviation for register review)

1. **FAIL / sitewide footer, all 10 sampled pages (10/10)** — `<a href="http://www.kairali.com/" target="_blank">&copy; Kairali Ayurvedic Group Since 1908.</a>` (home.html line 786; identical footer include on every sampled page). **Violates the PR #65 ruling: 1908 = family lineage only; the Group was founded 1989.** Aggravating evidence: the same site's own body copy contradicts it — homepage line 658 and about-us.aspx both state "KAIRALI Ayurvedic Group was founded in 1989, and its founders have been sharing this knowledge throughout the world ever since." The footer claim and the body copy cannot both be true; the body copy is the one that matches the ruling.
2. **FLAG (frozen rolling numbers) / https://kappl.co.in/about-us.aspx** — "Kairali Ayurvedic Products Private Limited (KAPPL) has more than **100 years of experience** in practice and research of ayurvedic medicine. With **8 decades of modern day experience** in production and manufacture…" (about-us.html lines 188–189). Both are typed frozen values (rolling values must be computed, not typed), both attach lineage-scale numbers to the **company** (KAPPL, incorporated under a Group founded 1989 — same PR #65 class of error), and they are mutually inconsistent (100 years vs 8 decades vs 1989 founding = 37 years).
3. **Banned phone +91 92898 38777: ABSENT — PASS.** Grepped all fetched pages for `38777`, `9289838777`, spaced variants: 0 occurrences. (The correct KTAHV `…38797` is also absent — expected; this is not a KTAHV page.)
4. **Email deviation (register review — Abilash) / sitewide footer** — public contact shown site-wide is `support@kairaliproducts.com` (20 occurrences across the 10 sampled pages, e.g. home.html line 777 `<a href="mailto:support@kairaliproducts.com">`). Locked fact says public contact email everywhere = **info@kairali.com**, which appears only on `contact-us.aspx` (line 196, Delhi corporate office block) and `privacy-policy.aspx` (4 occurrences total). `support@kairaliproducts.com` may be a legitimate product-support mailbox for the Shopify store — **cannot rule externally; flag for decision, not asserted wrong.**
5. Only phone published: `+91-9555156156` (12 occurrences; same Delhi group line as kairalicenters) + landline numbers for factory/distribution/marketing offices on contact-us.aspx. No conflict with locked facts.

---

## Findings (severity-ranked, evidence-linked)

### H — high

- **H1 / HTTPS never enforced + zero canonicals = 4 duplicate indexable sites.** `http://kappl.co.in/`, `http://www.kappl.co.in/`, `https://kappl.co.in/`, `https://www.kappl.co.in/` ALL return `HTTP 200` with identical 45,984-byte bodies — no 301, no HSTS header (verified: no `strict-transport-security` in any response). `rel="canonical"` count across all 10 sampled pages: **0**. Google sees four parallel copies of every URL with nothing declaring the preferred one, and every page is reachable unencrypted. Fix (M): server-level 301 http→https + www→apex (or vice versa) + canonical tag in the master template.
- **H2 / health data collected on a page reachable over plain http.** `free-online-consultation.aspx` renders a medical intake form — fields include `txtBloodPressure`, `txtWeight`, `txtHeight`, `txtPresentHealthProblems` (textarea), `chkPastHistory$0–n`, `chkDependOn$0–n` (dependencies/habits), age/gender/marital status — and posts back to itself (`<form method="post" action="./free-online-consultation.aspx"`). Because of H1, the page serves 200 over `http://` too: a user arriving via http would submit health data unencrypted. Form inspected render-only, never submitted (rule). Fix rides on H1's forced-https; flag to Dr. Deepu John lane if the form is still meant to be live.
- **H3 / robots.txt AND sitemap.xml both 404 — while every page's footer links to sitemap.xml.** `https://kappl.co.in/robots.txt` → `HTTP/2 404`; `https://kappl.co.in/sitemap.xml` → `HTTP/2 404` (both return the IIS 404 page, 1,245 bytes). The sitewide footer contains `<a href="sitemap.xml">XML</a>` on all 10 sampled pages → a broken link on every page of the site. Site carries `google-site-verification` + `msvalidate.01` metas (home.html head), so Search Console was set up at some point — with no sitemap and no robots.txt behind it.

### M — medium

- **M1 / analytics are dead (Universal Analytics only).** Sole tracker sitewide: `ga('create', 'UA-63572962-1', 'auto')` via `analytics.js` (home.html head; same include all pages). UA stopped processing hits when Google sunset Universal Analytics (July 2023 / July 2024 for 360). No GA4 `G-` tag, no GTM container anywhere (grep: 0). The site has recorded **no analytics for ~2 years**.
- **M2 / all 4 homepage product-card buttons are dead links.** `<a class="btn" href="http://www.kairaliproducts.in/...">` (home.html lines 209, 223, 237, 251) → `kaircin-25ml.html`, `lemon-shampoo-200ml.html`, `kairali-shampoo-orange-blossom-200ml.html`, `kairoil-200ml.html` all resolve (via redirect to https) to **HTTP 404** on kairaliproducts.in. The live store is kairaliproducts.com (Shopify, verified 200) — the homepage's only product CTAs point at a dead legacy domain's deleted pages.
- **M3 / dead + erroring family-site links in the sitewide footer.** `http://www.kairaliherbals.com` → connection failure (curl exit, no HTTP response — domain dead); `http://www.kairaliequipments.com/` → redirects to `http://kairaliequipment.com/` → **HTTP 500**. `http://www.ayurvedichealingvillage.com/` → 403 after redirect (likely WAF/bot-block — **unverified, not asserted dead**). Facebook link (`facebook.com/pages/Kairali-Products-Herbal-Cosmetics/662309010455010`, legacy `/pages/` URL format) → HTTP 400 to curl — **possibly bot-blocking, unverified**. Twitter/LinkedIn/YouTube links returned 200 (account existence not verifiable by curl beyond status).
- **M4 / mixed content on the https homepage.** 3 blog thumbnails hard-coded `src="http://admin.kairali.com/BlogImages/…"` (`abdominal-disorder.png`, `ayurveda-for-hair-diseases.png`, `sexual-health-with-ayurveda.jpg`) — each 301s to https and the asset exists (verified 200 after redirect), so impact is passive-mixed-content warnings + a redirect per image. Only page in sample affected: `/` (3 occurrences; all other sampled pages 0).
- **M5 / heading structure inverted sitewide.** Homepage has **5 `<h1>`** elements ("Kairali Products Pvt.Ltd." + product names "Kairali - Kaircin", "Herbal Shampoo", "Orange Blossom", "Kairali - Kairoil"); **all 9 sampled inner pages have 0 `<h1>`** (e.g. about-us.aspx: 1×h2, 3×h3 only). Every page should have exactly one h1.
- **M6 / duplicate title + meta description on all news-article pages.** `news-and-articles.aspx?id=277` and `?id=282` serve the identical `<title>Ayurvedic Articles | Ayurvedic Products Article | Kairali Articles | Ayurveda Details</title>` and identical description ("Articles about kairali ayurvedic products give you mor and more detail…") — the dynamic article template has one static meta set, so every article competes with every other in the SERP.
- **M7 / 100 KB `__VIEWSTATE` on article pages.** `news-and-articles.aspx?id=282` is 220,210 bytes, of which a single base64 `__VIEWSTATE` field is ~101,461 chars (~46% of the page) — the article list appears to be serialized into viewstate. Page-weight and TTFB drag on the whole news section. (`?id=277` same pattern.)
- **M8 / framework version disclosure + default error page.** Every response carries `Server: Microsoft-IIS/10.0`, `X-AspNet-Version: 4.0.30319`, `X-Powered-By: ASP.NET`, `X-Powered-By-Plesk: PleskWin`. The `.aspx` 404 probe (`/qa-nonexistent-probe-20260716.aspx`) returns the **ASP.NET default error page** ("The resource cannot be found.") printing `Microsoft .NET Framework Version:4.0.30319; ASP.NET Version:4.7.4136.0` — customErrors is not shielding remote users. (Status code itself is a correct 404 — see PASS list.) No security headers at all (no HSTS/CSP/X-Frame-Options/X-Content-Type-Options).
- **M9 / consent checkbox renders but appears unenforced.** `enquire-now.aspx` (line 640) and `free-online-consultation.aspx` (line 978) render `<input name="chkAgree" type="checkbox">` — "I have read and agree to kappl.co.in privacy & terms" linking to `privacy-policy.aspx` (link works, 200). Every other mandatory field has a `RequiredFieldValidator` wired in the page's validator script (age, phone, email, address, country/state/city, subject, message, security code — all present); **no validator references `chkAgree`**, so consent appears optional. Client-side inspection only — not submitted to confirm server behaviour (rule: never submit).

### S — small

- **S1 / https://kappl.co.in/about-us.aspx `<title>`** — typo **"Limitedt"**: `About- Kairali Ayurvedic Products Private Limitedt | Ayurvedic Products…` (user-visible in tab + SERP).
- **S2 / meta-description typos across pages** — home: "Kairali **Ayurvedics** Products Private Limited"; contact-us: "These are **mantion** on Our contact page"; article template: "give you **mor** and more detail to understand **tha** ayurveda"; enquire-now: "Kappl **surpases** all expectations".
- **S3 / enquire-now.aspx meta-description register mismatch** — "…their **luxury ayurvedic retreats**, authentic ayurvedic medicine, body and ski[n]…" on a WHO-GMP pharma manufacturer's enquiry page. Not a banned-word violation (KTAHV clinical lock does NOT apply to KAPPL — no cross-application), but the description sells retreats on a product/pharma site. Register-review note.
- **S4 / template/code leak on https://kappl.co.in/enquire-now.aspx** — literal unrendered server-control tag in the delivered HTML, line ~631: `</asp:TextBox>` immediately after the `txtVerification` input. Harmless to browsers, but raw ASP.NET markup is leaking into output.
- **S5 / company-name inconsistency across the site** — "Kairali Ayurvedic Products Private Limited" (about-us body) vs "Kairali **Ayurvedics** Products Private Limited" (home meta) vs "Kairali Ayurvedic **Product** Pvt. Ltd." (contact-us factory block + about-us img alt) vs "Kairali **Products** Pvt.Ltd." (home h1). One legal name should be used everywhere.
- **S6 / no structured data, no social meta** — JSON-LD across all 10 sampled pages: **0** (not even Organization). Open Graph tags: **0**. Presence check only; full schema build is rebuild-scope.
- **S7 / TLS ceiling** — server negotiates TLSv1.2 only (no 1.3). Cert itself valid (Let's Encrypt, expires 2026-10-01) — renewal presumably automated by Plesk, worth a calendar check.

### PASS (verified clean)

- **Injection/compromise screen: CLEAN.** No `<marquee>`, no casino/gambling/pharma-spam keywords, no zero-width characters, no hidden-element spam CSS, no rogue external scripts (externals = google-analytics.com, cdn.onesignal.com OneSignalSDK.js [200], chat.kairali.com/embed.min.js [200]). Rule-r screen: no text addressing AI/agents anywhere in visible content — the only grep hits were base64 coincidences inside `__VIEWSTATE` blobs (re-screened excluding viewstate: 0 hits). Nothing quarantined.
- **Internal links: 48/48 return 200** (full status sweep of every `.aspx` link harvested from sitemap.aspx, over https).
- **404 handling: correct status codes.** `.aspx` probe → 404 (3,916 B, default ASP.NET page — see M8); directory probe → 404 (1,245 B IIS page). No soft-200s.
- **Viewport meta present on 10/10 pages.** No Lorem ipsum anywhere. Captcha on enquiry form works (`turing.aspx` serves a 60×20 JPEG, verified 200 + `image/Jpeg`).
- **Forms render** on enquire-now, free-online-consultation, testimonials (write-a-testimonial), each with a privacy-policy link in the form's consent label and footer. (Enforcement gap = M9.)
- **Both 1989 body-copy statements are correct per PR #65** ("founded in 1989" on home + about-us) — the footer (locked-facts FAIL #1) is the outlier.

Finding count: **locked-facts FAIL (1 violation + 1 flag + 1 review item) · 3 H · 9 M · 7 S · 6 pass groups**.

---

## NOT RUN (honest gaps)

- **Mobile/visual render checks** — no browser/Playwright tools this pass (single shared pane, other agents running). Viewport meta verified textually only; actual responsive rendering unchecked.
- **Form submission behaviour** — never submitted (binding rule). M9 (consent enforcement) and server-side validation are client-side observations only.
- **JS runtime checks** — OneSignal init, chat.kairali.com widget behaviour, whether the dead UA tag errors in console: static HTML inspection only.
- **Full crawl** — link status verified for the 48 sitemap.aspx links + 15 sampled externals; the rest of the site's ~unknown dynamic URL space (news-and-articles ids, disease.aspx params) not enumerated.
- **Lighthouse/performance, hreflang** — out of this pass's scope/tooling (site is single-locale EN; no hreflang expected or found).
- **Social-account existence** — Facebook 400 / Twitter 200 / LinkedIn 200 to curl are not proof of live or dead accounts (bot-handling); listed unverified.
- **http/www variant sweep of inner pages** — 4-variant test done on `/` only; inner pages assumed same server config (single IIS site), not individually probed.
- **WHOIS/DNS, server config, GSC data** — external fetch only.

## DELEGATION SPLIT (proposals — no fixes applied this pass)

**Abilash (register review — decisions):** footer "Since 1908" (locked-facts #1) — remove or reword to lineage phrasing per PR #65; `support@kairaliproducts.com` vs `info@kairali.com` (locked-facts #4); about-us frozen "100 years / 8 decades" claims (locked-facts #2); whether kappl.co.in is a Wave rebuild candidate or gets interim patches only.
**Deepu (web, interim patches if site is kept live):** H1 https+www 301s + canonical in master template; H3 add robots.txt + generate sitemap.xml (or drop the footer XML link); M1 GA4 tag; M2 repoint 4 product buttons to kairaliproducts.com; M3 remove/repoint dead footer family links; M4 https for 3 blog image srcs; M8 strip version headers + custom error page; M9 wire a validator to chkAgree.
**Anupam (copy):** S1 "Limitedt", S2 meta typos, S5 legal-name consistency (after Abilash confirms the canonical legal name).
**Dr. Deepu John (clinical lane, FYI):** H2 — the free-online-consultation medical intake form is live on this legacy site; confirm it should remain up pending rebuild.

*Evidence artifacts (raw HTML captures, headers, link-check output) retained in session scratchpad `…/scratchpad/kappl/` — not committed.*
