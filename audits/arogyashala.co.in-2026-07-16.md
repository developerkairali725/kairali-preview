# QA/QC audit — arogyashala.co.in (LIVE legacy ASP.NET site, retail-outlet brand) + arogyashala.in domain recheck

- Audited: **2026-07-16 18:36:13 IST** (fetch window 18:26:01–18:36:13 IST)
- Auditor: factory QA pass (findings only, no fixes applied — CLAUDE.md §QA audit pass, D-TWO-LANE 16 Jul 2026)
- Method: external raw-HTML capture via `curl` (desktop UA + Googlebot UA cross-check), byte-level inspection; DNS via `dig`, cert via `openssl`, registry via `whois`. Read-only GET/HEAD only; no forms submitted; no browser tools used (shared pane rule).
- Sample: 14 site URLs fetched — `/`, `/about-us.aspx`, `/company-profile.aspx`, `/why-arogyashala.aspx`, `/our-locations.aspx`, `/our-products.aspx`, `/contact-us.aspx`, `/free-ayurvedic-consultation.aspx`, `/enquire-now.aspx`, `/apply-now.aspx`, `/career.aspx`, `/awards.aspx`, `/sitemap.aspx`, `/pirvacy-policy.aspx` — plus `robots.txt` (404), `sitemap.xml` (404), 2 deliberate-404 probes, http/https/www variant probes, captcha-image probe, 8 internal-link spot checks, 16 outbound brand-link probes, 5 social-link probes, and the arogyashala.in domain recheck.
- Stack observed: `server: Microsoft-IIS/10.0`, `x-aspnet-version: 4.0.30319`, `x-powered-by-plesk: PleskWin` (ASP.NET WebForms — NOT WordPress). TLS: Let's Encrypt, CN=arogyashala.co.in, valid 2026-07-03 → 2026-10-01, SANs incl. www + webmail.
- Context honoured: planned forward target arogyashala.in was DNS-dead on 14 Jul — both domains re-checked (see §Domain recheck).

---

## SECURITY VERDICT: **CLEAN** (external view, as of 2026-07-16 18:36 IST)

- Spam keywords (`casino|gambling|betting|poker|slot|bookmaker|wager|viagra|cialis`): **0 hits** on all 14 pages + probes.
- `<marquee>`: 0. Zero-width chars (U+200B/C/D): 0. `eval(`/`atob(`/`String.fromCharCode`: 0.
- External `<script src>` hosts: `www.google-analytics.com/analytics.js` (dead UA — see finding 3) and `chat.kairali.com/embed.min.js` (Kairali's own Chatbase widget, HTTP 200) only. External iframes: 0.
- No cloaking: Googlebot-UA fetch of `/` byte-identical to desktop fetch (26,476 bytes both); 0 spam keywords in the Googlebot variant.
- Rule (r) injection screen: no text addressing AI agents/instructions found in any fetched content (`ignore previous|you are an AI|system prompt|assistant:` → 0). Nothing quarantined.
- 404 handling: both probes return true HTTP 404 (no soft-200, no doorway). See finding 10 for the error-page disclosure issue.

---

## LOCKED-FACTS RESULT: **FAIL — 1 violation, sitewide**

| Locked fact | Result | Evidence |
|---|---|---|
| "Since 1908" on Group/company = WRONG (PR #65: Group founded 1989) | **FAIL — ×14 pages (every page footer)** | `<a href="http://www.kairali.com/" target="_blank">&copy; Kairali Ayurvedic Group Since 1908.</a>` — footer of all 14 sampled pages, e.g. https://arogyashala.co.in/ . Self-contradiction on the same site: home + company-profile body copy says "Kairali Ayurvedic Group was established in 1989 by Mr. K.V Ramesh and Mrs. Geeta Ramesh" (that copy is CORRECT per the ruling) |
| Banned WhatsApp +91 92898 38777 / 9289838777 | PASS — 0 occurrences (all spacing variants grepped, all 14 pages) | — |
| Correct WhatsApp …38797 | Absent (0 occurrences — nothing to check; site carries no WhatsApp number) | — |
| Public contact email = info@kairali.com | PASS — `info@kairali.com` ×28 (footer mailto, all pages); no rogue domains. Also `career@kairali.com` ×8 on career/apply pages (plausible HR mailbox — register review if in doubt) | footer sitewide |
| Frozen rolling numbers ("115+ years", "25 years of…") | PASS — none found beyond the "Since 1908" violation above | — |

Other phone/contact facts observed (cannot verify against register externally — flag for review): career page job posts list Contact Person "SINI NAIR", Contact No `8826921119` (also `+91-8826921119` ×3); the same job posts' hidden email field contains the PHONE number (`rptjobpost$ctl00$hdnemail` value="8826921119") — data-entry defect in the job-post records.

---

## Findings (severity-ranked)

### 1. H / https://arogyashala.co.in/our-locations.aspx / **The store-locator page — the site's entire purpose — lists ZERO locations**
Evidence: rendered page contains `<span id="lblTotal"> 0</span>` ("Total 0"), the locality dropdown has a single placeholder entry `<option selected="selected" value="0">--select--</option>`, and the results `<ul>` is empty. The homepage nav's "Our Locations" sub-menu is also empty (`<ul class="sub-menu"></ul>`, home.html). Meanwhile the page's own meta description claims "We have locations in all major cities of India and also in Dubai." A retail-outlet site with an empty outlet database is either a broken data source or a discontinued network presented as live — either way the money page is dead. Bonus code defect on the same page: `<li id="alocation" href="http://www.arogyashala.co.in/arogyashalas/our-locations.aspx">Our Locations</li>` — an `href` on an `<li>` (invalid, unclickable), and that URL returns **404** (verified).

### 2. H / sitewide footer, ×14 pages / **LOCKED-FACT violation: "© Kairali Ayurvedic Group Since 1908."**
See locked-facts table. Contradicted by the site's own body copy ("established in 1989", home + company-profile). Fix is a one-line footer edit in the shared footer control. Register-gated fact — flag to Abilash, copy correction via Anupam.

### 3. H / all 13 HTML pages / **Analytics dead for ~3 years — Universal Analytics only**
Evidence: every page carries `ga('create', 'UA-51310624-1', 'arogyashala.co.in');` loading `analytics.js`. UA properties stopped processing data 1 Jul 2023 (free) / 1 Jul 2024 (360). No GA4 (`G-…`), no GTM container on any page. The site has recorded no traffic data since the sunset; every enquiry/consultation lead here is invisible to measurement.

### 4. H / scheme/host handling sitewide / **No https enforcement; 4 duplicate variants; medical form reachable over plaintext http**
Evidence: `http://arogyashala.co.in/`, `https://arogyashala.co.in/`, `http://www…`, `https://www…` ALL return HTTP 200 with byte-identical content (26,476 bytes each; VIEWSTATE/session ignored in diff) — no 301, no HSTS header (absent from response headers), and **no `rel="canonical"` on any sampled page** → 4-way duplicate content for crawlers. Worse: all header/footer nav links are hardcoded absolute `http://www.arogyashala.co.in/…` (14 pages), so a user who arrives on https is steered back to http — and `/free-ayurvedic-consultation.aspx` collects medical data (form fields verified in HTML: `txtBloodPressure`, `txtPregnant`, `txtPresentHealthProblems`, `txtPreviousClinicalDetails`, `txtTakingMedPresent`, `txtWeight`, `txtHeight`, `txtManiComplaint` [sic]) posting relative (`./free-ayurvedic-consultation.aspx`) — i.e. over whatever scheme the visitor is on, including plaintext http. A valid Let's Encrypt cert exists (2026-07-03→2026-10-01), so enforcement is a server-config change away.

### 5. H / https://arogyashala.co.in/robots.txt + /sitemap.xml / **Both 404 — and the sitewide footer links to the missing sitemap.xml**
Evidence: `robots.txt` → HTTP 404 (IIS error page); `sitemap.xml` → HTTP 404. Footer on all 14 pages: `<a href="http://www.arogyashala.co.in/sitemap.xml">XML</a>` → broken link ×14. No robots.txt is not fatal (crawl allowed by default) but combined with no XML sitemap, no canonicals, and 4 duplicate hosts, the site gives Google zero crawl guidance. (An HTML sitemap at `/sitemap.aspx` exists and returns 200.)

### 6. M / https://arogyashala.co.in/ (hero slider, position 1) / **Lead banner links to a 404 — stale COVID-era promo**
Evidence: first slide `<a href="https://www.kairaliproducts.in/catalogsearch/result/?q=sanitizer"><img src="http://media.kairali.com/images/arogyakendra-banner.jpg" alt="Hand Sanitizer" /></a>` — target verified **HTTP 404**. A 2020-vintage hand-sanitizer promotion is the first thing the slider shows in 2026, and its click-through is dead (also note the banner image file says "arogyakendra", the sister brand).

### 7. M / https://arogyashala.co.in/ ("Our Brands" strip, 16 links) / **Brand-link rot incl. one domain lost to a reseller**
Verified by probe: `www.kairaliherbals.com` → **DNS does not resolve** (curl: could not resolve host); `www.kairaliequipment.com` → **HTTP 500**; `www.keyawellness.com` → **302 to https://www.hugedomains.com/domain_profile.cfm?d=keyawellness.com** (domain-for-sale page — a Kairali-branded logo link now sends visitors to a domain reseller; reputational + possible future squatter risk). Remaining 13 brand links resolve 200/301-to-https. Register review: whether keyawellness.com was intentionally dropped; if so remove the panel.

### 8. M / sitewide footer, ×14 pages / **Dead Google+ social icon (service shut down 2019)**
Evidence: `<a href="https://plus.google.com/102296388765014542269" …class="gp">` on every page; probe returns 301 to a Google blog post about the Currents shutdown. The Facebook icon's old-style URL `facebook.com/pages/Kairali-Yoga-Retreats/377417889032009` returned HTTP 400 to curl (bot-blocked — status **unverified**, flagged not asserted); it also points at a "Kairali Yoga Retreats" page rather than an ArogyaShala/Group page. Twitter/LinkedIn/YouTube URLs redirect plausibly (account status unverifiable via curl — see NOT RUN).

### 9. M / https://arogyashala.co.in/enquire-now.aspx / **Template/code leak: raw `</asp:TextBox>` server tag rendered in the page**
Evidence (line ~566 of served HTML): `</asp:TextBox>` appears as literal text/markup after the security-code input — an unclosed-server-control editing error, visible in source on the primary lead form (and the kind of thing Google flags as sloppy HTML). Same block on all 3 forms uses a captcha image named `<img src="asdfghjkl.aspx" …>` — keyboard-mash filename; the handler DOES work (probe: HTTP 200, image/Jpeg, 60×20px, 1,044 bytes) so forms are functional, but the name is a dev-slop leak. Forms were NOT submitted (audit rule); render + field checks only.

### 10. M / 404 error pages / **ASP.NET default error page with framework version disclosure; header disclosure sitewide**
Evidence: `/qa-nonexistent-probe-20260716.aspx` → HTTP 404 rendering "Server Error in '/' Application." with "Version Information: … ASP.NET Version:4.7.4136.0" (customErrors not configured for extensionless friendliness; raw framework error page shown to visitors). Extensionless probe → bare IIS "404 - File or directory not found." page (no site navigation — poor recovery UX, though correctly 404). Response headers on every page disclose `server: Microsoft-IIS/10.0`, `x-aspnet-version: 4.0.30319`, `x-powered-by: ASP.NET`, `x-powered-by-plesk: PleskWin`. Also: jQuery 1.9.1 (2013; multiple known XSS advisories in that line) on all pages. Findings only — server config is Sunaj/host territory.

### 11. M / forms consent + privacy slug / **Consent checkbox not enforced; privacy policy lives on a misspelled URL**
Evidence: `chkAgree` ("I have read and agree to arogyashala.co.in Privacy & Terms of Use.") exists on enquire-now and free-ayurvedic-consultation but has **no validator** (all `RequiredFieldValidator`s target other fields; no CustomValidator references chkAgree) — consent is skippable on forms that collect medical data (DPDP hygiene gap). The consent label and the sitewide footer both link the privacy policy at **`pirvacy-policy.aspx`** (sic — misspelled slug, HTTP 200); the correctly spelled `privacy-policy.aspx` returns **404**. Anyone typing/guessing the correct URL gets a 404; the typo is also visible in the address bar of a trust page.

### 12. M / mixed content, ×14 pages / **8 hardcoded `http://` image URLs on https pages**
Evidence (counts across the 14-page sample): `http://www.arogyashala.co.in/images/logo.png` ×14, `…/images/ii.png` ×14, `…/images/kairali-view-home.jpg` ×14, `…/images/kairaliyoga.jpg` ×14, `…/images/kairaliayurvedictreatmentcentre.jpg` ×14, `…/images/freeconsultation-btn.png` ×14, `…/images/buyourproducts-btn.png` ×14, plus `http://media.kairali.com/images/arogyakendra-banner.jpg` ×1 (home). Passive mixed content — modern browsers auto-upgrade, but it is another reason the padlock/UX degrades on stricter agents. Fix is a search-replace to https or relative paths (both hosts serve the files over https — verified for media.kairali.com and arogyashala.co.in).

### 13. S / meta-data defects (per page)
- `/apply-now.aspx`: meta description tag has **no content attribute at all** (`<meta name="description" />`).
- `/free-ayurvedic-consultation.aspx`: meta description is a single space (`content=" "`).
- `/sitemap.aspx`: meta description is the single word "Sitemap".
- `/career.aspx` meta description contains run-together words: "At ArogyaShalawe provide a stable, enjoyable environment…"
- Home meta description typo: "…awareness of **Ayurvda** and its benefits…" (also double spaces); keywords meta has trailing-space padding.
- Titles are inconsistent in brand casing/spacing across pages ("Arogyashala- About Us" vs "ArogyaShala-Career" vs "ArogyaShala - Home"). No JSON-LD/structured data anywhere on the site (no Organization/LocalBusiness/FAQ blocks) — noted; retrofit is rebuild-scope.

### 14. S / visible copy typos (evidence quotes, exact)
- Home + company-profile intro: "**Karali Ayuvedic** Group's ArogyaShala is all about the ancient Indian science of healing" (two typos in the Group's own name; "Karali" also appears in awards + our-products page copy).
- Home + career: "At **AroygyaShala**, we believe that fulfilling work is its own reward."
- Home ×2 ("Why Arogyashala?" panel + three-col teaser): "Today **is has** spread all across the globe".
- Sitewide footer floating panel ×14: "Ayurvedic treatments for various disorders such as weightloss **spondylytis** etc." (spondylitis).
- Career job post ×1: city list "Delhi,Hubli, Wynad, Sirsi,**Gurgoan**,Jodhpur,Ganganagar,Kolhapur" (Gurgaon; inconsistent spacing).
- Our-products: product-name typos "DhoordhoorapathradiThaialm" (Thailam) and "BalaguluchyediKashaym" (Kashayam) in enquiry URLs/product entries.
- Consultation form field names leak into markup quality: `txtAddres`, `txtManiComplaint` (functional, but sloppy).

### 15. S / stale content, ×14 pages
Footer floating promo panel on every page: "2021 World Spa Awards — India's Best Wellness Retreat 2021" (5 years old, presented as current). Awards page content stops at 2020/2021 (year histogram of page text: 2007–2021 only). Career page's 3 job posts (Business Development Executive, Business Development Manager, Ayurveda Therapist) carry no posted-on dates — freshness unverifiable externally; flag for HR confirmation that they are still open before leads apply.

### 16. PASS / checks that came back clean
- Exactly one `<h1>` per page, all 14 pages. Viewport meta present on all pages. `meta robots` = "index, follow" (no accidental noindex anywhere).
- Internal-link spot check: 8/8 sampled targets 200 (default.aspx, award-detail ×2, enquire-now?productname, apply-now?id, logo, jquery) — sole internal 404 is the /arogyashalas/… URL in finding 1 and the sitemap.xml in finding 5.
- No Lorem ipsum on any page. 404 probes return real 404 status codes (no soft-200s).
- Google site-verification + Bing msvalidate metas present sitewide.

---

## DOMAIN RECHECK — arogyashala.in (planned forward target, was DNS-dead 14 Jul)

State CHANGED since 14 Jul — now resolves, but to a GoDaddy parking page, not to anything Kairali controls operationally:
- DNS: NS = `ns17/ns18.domaincontrol.com` (GoDaddy); A = 15.197.148.33 / 3.33.130.190 (verified 18:26 IST).
- HTTP: `http://arogyashala.in/` → 200, 114-byte stub that JS-redirects to `/lander`; `/lander` = GoDaddy parking-lander app (body contains `window._trfd.push({ap:"parking"})`, assets from img1.wsimg.com). It is a PARKED page, not a redirect to arogyashala.co.in.
- HTTPS: **broken** — TLS handshake fails (`tlsv1 unrecognized name`); no certificate served for the domain.
- whois: Registrant Organization **Kairali Ayurvedic Health Resorts Pvt. Ltd.**, Registrar GoDaddy, Created 2010-05-15, **Registry Expiry 2027-05-15**, registry Updated Date **2026-07-14** (the same day mining found it dead — something was changed that day). Status: ACTIVE, client Renew/Transfer/Delete/Update Prohibited.
- Verdict: the domain is still Kairali-owned and now alive at the registrar's default parking. As a forward/rebuild target it needs deliberate DNS + hosting + TLS setup before it can be used; today any visitor or crawler hitting arogyashala.in sees a GoDaddy ad lander over http only. Escalate to Abilash/Ambuj (DNS is a human action).

---

## NOT RUN (honest list)
- **Mobile/visual render checks** (viewport behaviour, slider, floating panels, chat auto-open) — browser/Playwright tools were off-limits this pass (shared pane); raw-HTML only.
- **Form submission tests** — forbidden by audit rules (render + field inspection only); the captcha image endpoint was GET-probed for status only, never solved (bot-check bypass prohibited).
- **Social account status** for Facebook (HTTP 400 to curl — bot-blocked), Twitter/X, LinkedIn, YouTube — cannot be verified without a browser; only the Google+ death is asserted (service shutdown + observed redirect).
- **Search Console / analytics data** — no access from this pass; UA-sunset conclusion is from the tag itself, not from property data.
- **Full 117-product enquiry-link sweep** on our-products.aspx — one product link sampled (200); the rest untested.
- **webmail.arogyashala.co.in** (present in the TLS SAN) — out of audit scope, not probed beyond the cert observation.
- **Server-side checks** (web.config, customErrors, Plesk config, DB behind the empty locations table) — external pass only; root cause of "Total 0" locations is unverified (could be data wipe or query bug).
- WebFetch fallback was not needed — no WAF blocks encountered (all curl fetches succeeded).

---

## DELEGATION SPLIT (proposals — findings only, nothing executed)

**Abilash (register/decision):** 1. "Since 1908" footer violation (H, locked fact — one-line fix once ruled). 2. Locations = 0: is the ArogyaShala outlet network still operating? Determines whether this site gets fixed, frozen, or fast-tracked into the rebuild queue. 3. keyawellness.com lost to HugeDomains — drop or recover. 4. arogyashala.in parked-at-GoDaddy state + 14-Jul registry change — confirm who touched it; DNS plan is a human action. 5. Career contact 8826921119 / career@kairali.com — register check.

**Sunaj (security/infra):** 1. Force https (301 http→https, both hosts) + HSTS; cert already valid. 2. Replace ASP.NET default error pages; strip IIS/ASP.NET/Plesk disclosure headers. 3. robots.txt + XML sitemap creation (needs Abilash's call on the site's future first — don't invest if it's being retired).

**Deepu (web):** 1. Fix locations data/query ("Total 0") if the network is live. 2. Remove/replace dead brand links (kairaliherbals DNS-dead, kairaliequipment 500, keyawellness reseller) and dead G+ icon. 3. Kill the 404 sanitizer banner slide. 4. Repair `</asp:TextBox>` leak on enquire-now; fix `<li href>` on our-locations. 5. Canonicals + absolute-http nav links → https/relative; mixed-content image srcs. 6. GA4/GTM tag to replace dead UA (if site is kept). 7. Enforce chkAgree consent validator. 8. `privacy-policy.aspx` correct-slug alias/301.

**Anupam (copy):** typos batch (finding 14) + meta descriptions batch (finding 13) + retire "2021 World Spa Awards" footer promo — ONLY if Abilash rules the site stays live; otherwise fold into rebuild content.

Finding count: **1 security verdict (CLEAN) · 1 locked-facts FAIL (sitewide) · 5 H · 7 M · 3 S · 1 pass-block · 1 domain-recheck (state changed: DNS-dead → GoDaddy-parked)**.

*Evidence artifacts (raw HTML captures, headers, cert dump, link-probe outputs) retained in session scratchpad `…/scratchpad/aro/` — not committed.*
