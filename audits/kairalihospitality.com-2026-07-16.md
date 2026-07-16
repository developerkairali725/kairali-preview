# QA/QC audit — kairalihospitality.com (LIVE legacy ASP.NET group-hospitality site)

- Audited: **2026-07-16 19:14:00 IST** (fetch window 18:56:58–19:14:00 IST)
- Auditor: factory QA pass (findings only, no fixes applied — CLAUDE.md §QA audit pass, D-TWO-LANE 16 Jul 2026)
- Method: external raw-HTML capture via `curl` (desktop Chrome UA + Googlebot UA cross-check), byte-level inspection, read-only GET/HEAD only. No browser tools used (shared pane rule) — see NOT RUN.
- Platform: ASP.NET WebForms on IIS 10 / Plesk (`Server: Microsoft-IIS/10.0`, `X-AspNet-Version: 4.0.30319`, `X-Powered-By-Plesk: PleskWin`) — NOT WordPress.
- Sample: 11 pages fetched full — `/`, `about-us.aspx`, `contact-us.aspx`, `enquiry-now.aspx`, `ayurvedic-healing-village.aspx`, `kairali-hospitality.aspx`, `founders-message.aspx`, `accommodation-tariffs.aspx`, `privacy-policy.aspx`, `free-online-consultation.aspx`, `sitemap.aspx`, plus `give-feedback.aspx`, `newsletter.aspx`, `robots.txt`, `sitemap.xml`, `Turing.aspx` (captcha), 6 JS/CSS assets, 1 deliberate 404 probe, 27 internal-link HEAD sample, 16 outbound group links, 4 social links, http/https + www/non-www host probes.
- Triage context honoured: surfaced as "unexpected CONTENT: 200; 'Since 1908' claim; legacy UA-style analytics ID" — both triage flags CONFIRMED below.

---

## LOCKED-FACTS RESULT: **FAIL — "Since 1908" attached to the Group, sitewide footer (11/11 pages)**

| Locked fact | Verdict | Evidence |
|---|---|---|
| "Since 1908" must never attach to Group/company (PR #65: 1908 = family lineage only; Group founded 1989) | **FAIL** | Footer copyright on **all 11 sampled pages**: `&copy; Kairali Ayurvedic Group Since 1908.` — e.g. `https://kairalihospitality.com/` line 867, `about-us.aspx` line 506, `privacy-policy.aspx` line 483, `enquiry-now.aspx` line 1135, `sitemap.aspx` line 562. Sitewide footer include → one template fix clears all pages. |
| Banned phone `+91 92898 38777` / `9289838777` | **PASS (absent)** | 0 occurrences across all fetched files (all spacing variants grepped). Correct-Priya `…38797` also absent — not expected on this non-KTAHV site. Site phone is `+91 9555156156` (header line 90, footer line 854) — same group line seen on kairalicenters.com. |
| Public contact email must be `info@kairali.com` | **PASS** | `info@kairali.com` in header (line 91) and footer (line 855) via `mailto:` on every sampled page; no other public contact mailbox found. |
| Frozen rolling numbers | **FLAG (2 claims)** | (1) "We at Kairali group with **over 8 decades** of experience in production and practice in traditional science of Ayurveda…" — `/` (line 423) + `kairali-hospitality.aspx` (line 279). 2026−1908 = 118 yrs (~12 decades); 2026−1989 = 37 yrs. Wrong under either anchor — typed, frozen. (2) "It was with this vision **over 2 decades ago** that my wife and I decided to venture…" — `founders-message.aspx` (line 281); 1989→2026 = 37 yrs, i.e. nearly 4 decades. Frozen. |

---

## SECURITY SCREEN (rule r): CLEAN

- Spam keywords (`casino|gambling|betting|poker|viagra|bookmaker`): 0 hits across all fetched pages.
- No `<marquee>`, no zero-width chars (U+200B/C/D), no AI-directed instruction text in any fetched content.
- External scripts: `cdn.onesignal.com/sdks/OneSignalSDK.js` (200) + `chat.kairali.com/embed.min.js` (200, 37,464 B) + inline GA snippet — all plausibly first-party-intent; no injected/off-topic domains.
- No cloaking: Googlebot-UA fetch of `/` = identical 57,622 bytes; diff vs desktop UA (excluding `__VIEWSTATE`/`__EVENTVALIDATION`) is only server-side rotation of the news-carousel items; 0 spam keywords in Googlebot variant.
- Outbound domains: all Kairali-group properties + facebook/twitter/linkedin/youtube + OneSignal + chat.kairali.com. No pharma/gambling outbounds.

---

## Findings (severity-ranked)

### P1 — site-breaking / revenue-relevant

1. **L / ENTIRE `/js/` DIRECTORY RETURNS HTTP 500 — all client-side JavaScript is dead sitewide.** Every script the pages load 500s: `js/jquery-1.9.1.min.js`, `js/BlogDisplayJS.js`, `js/stepcarousel.js`, `js/slider-gallery.js`, `js/html5.js` → each returns `500 - Internal server error` (1,208-byte IIS error page; re-verified with `Referer` header and cache-buster `?v=1`; `js/` directory itself = 403). CSS (`include/global.css` 200/42,163 B, `responsive.css` 200) and images (logo 200) serve fine — the failure is specific to `/js/`. Consequence (inferred, see NOT RUN): jQuery never loads, so the mobile nav `<select>` builder (inline script, `/` lines 22–46), header search (`onclick="searchheaderresultsrightside();"` — function defined in the dead `BlogDisplayJS.js`), carousels/sliders and gallery scripts all throw. Likely IIS handler/permission misconfig on the `js` folder. **One server fix restores site interactivity.**
2. **M / LOCKED-FACT FAIL — "© Kairali Ayurvedic Group Since 1908." in sitewide footer**, 11/11 sampled pages (evidence in locked-facts table). PR #65 ruling: Group ≠ 1908.
3. **M / Analytics is a 3-year data black hole.** Only tracker on every page (11/11) is legacy Universal Analytics `ga('create', 'UA-42461617-1', 'kairalihospitality.com')` via `//www.google-analytics.com/analytics.js` (`/` lines 60–75). UA stopped processing hits July 2023 (July 2024 for 360). Zero GA4 (`G-`), zero GTM (`GTM-`), zero `gtag(` across all pages. Triage flag CONFIRMED. Site has recorded no analytics since mid-2023.
4. **M / Active mixed content — blocked iframes on https.** (a) `<iframe src="http://www.youtube.com/embed/DSZ4U7rTRSM"` on 5 pages incl. `/` and `about-us.aspx`; (b) `<iframe src="http://maps.google.co.in/maps?…&output=embed"` on `contact-us.aspx`. Modern browsers BLOCK http iframes inside https pages (active mixed content is not auto-upgraded the way images are) → the YouTube video and the contact-page map do not render for https visitors. Fix: `https://` (or protocol-relative) srcs.
5. **M / Homepage hero is a COVID-era promo with a dead CTA.** First slide: "Hand Sanitizer — Kills 99.9% Germs & Bacteria — **Buy Now »**" (`/` lines 197–205, repeated in footer block lines 883–885). The Buy Now target `https://www.kairaliproducts.in/catalogsearch/result/?q=sanitizer` returns **HTTP 404**. Six-year-stale pandemic promo occupying the top slot, linking to a 404.
6. **M / "Our Group Company" slider links to dead/lost domains** (slider on every page, `/` lines 688–748): `www.keyawellness.com` → 301-chain to **HugeDomains "domain for sale" parking page** (domain lost/expired — group link now hands traffic to a squatter page); `www.kairaliherbals.com` → **DNS NXDOMAIN** (curl: `Could not resolve host`); `www.kairaliequipment.com` → **HTTP 500**. Also `www.ayurvedichealingvillage.com` → 403 to curl (WAF-blocked — status unverifiable externally, likely fine in browsers; not counted as broken).

### P2 — Google-compliance hygiene

7. **M / No canonical host or protocol.** `http://` serves 200 directly (no 301 to https — verified header capture), `https://www.` also 200 with identical content-length (57,622 B); zero `rel="canonical"` on all 11 pages; no HSTS header. Four duplicate hosts (`http/https × www/non-www`) with nothing telling Google which one is real.
8. **M / robots.txt is 404** (`https://kairalihospitality.com/robots.txt` → 404, IIS error page). No crawl directives, no `Sitemap:` pointer.
9. **M / sitemap.xml contradicts the live site.** `https://kairalihospitality.com/sitemap.xml` (200, 37 URLs, generated by "Free Online Sitemap Generator www.xml-sitemaps.com") lists every URL as `http://www.kairalihospitality.com/…` — wrong protocol AND wrong host vs the served https non-www; and it contains a dead URL: `celebrate-the-festival-of-mahashivratri-staying-at-om-beach-ayurvedic-resort-gokarna.aspx` → **404** (only 404 in the 27-URL internal sample).
10. **M / Framework error pages + version disclosure.** The .aspx 404 probe (`/qa-nonexistent-probe-20260716.aspx`) returns the RAW ASP.NET "The resource cannot be found." yellow-screen dev page, leaking `Version Information: Microsoft .NET Framework Version:4.0.30319; ASP.NET Version:4.7.4136.0`. Response headers additionally leak `Server: Microsoft-IIS/10.0`, `X-AspNet-Version`, `X-Powered-By: ASP.NET`, `X-Powered-By-Plesk: PleskWin`. (Status code IS a correct 404 — no soft-200 — but `customErrors` is off, an ancient .NET 4.x runtime is advertised, and the error page is unbranded.) Fix: custom error pages + strip version headers.
11. **S / Zero structured data, zero social meta.** 0 × `application/ld+json`, 0 × `og:` tags across all 11 pages (grep counts). No Organization/LocalBusiness schema anywhere on a group corporate site.
12. **S / Newsletter signup leaks the email into a URL and dead-ends.** Footer newsletter (all pages) navigates via inline JS to `newsletter.aspx?email=<typed address>` (`/` line 823) — PII in a GET query string — and `newsletter.aspx` (200, 643 B) is a **blank page**: empty title, empty body, no confirmation, no privacy notice. Subscriber sees nothing happen. (NOT submitted during audit — behaviour read from source + a parameterless GET of the blank page.)

### P3 — content defects

13. **S / Contact address inconsistency (register review — Abilash).** Footer + visible contact block: "D - 130, Block D, Ambedkar Colony, Mehrauli, New Delhi - 110030" (all pages). But the `contact-us.aspx` Google-Maps embed pins "Kairali Ayurvedic Group **D-120, Andheria Modh**, Mehrauli New Delhi **– 110 074**". Two different door numbers AND PIN codes. Cannot verify externally which is current — flag before leads navigate to the wrong address (map is currently blocked by finding #4 anyway).
14. **S / Meta typos & grammar (SERP-visible).** `founders-message.aspx` meta description: "…Director's Message on Kairali **Hopitality**" (sic). `/` meta description: "We **managed** many resorts with Ayurvedic service" (tense). `privacy-policy.aspx` meta description: "provides **a extensive** privacy policy for **his guest** of their ayurvedic resorts". All titles are legacy keyword-stuffed pipe-chains (e.g. home title carries 4 segments + trailing space); descriptions present on all 11 pages though (no missing-meta finding).
15. **S / Malformed HTML in the sitewide copyright bar.** `<a href="http://www.kairali.com/" target="_blank">&copy; Kairali Ayurvedic Group Since 1908. … <a href="privacy-policy.aspx">` — the first `<a>` never closes before the next opens (illegally nested anchors, all pages, `/` lines 867–869). Whole copyright line becomes a link to kairali.com in most parsers.
16. **S / Stale event/news content presented as current.** Homepage news carousel leads with 2019–2020 items ("Best Luxury Ayurveda Spa for 2020", "Certificate of Excellence 2019", hand-sanitizer compliance certificate); the Mahashivratri event page is already deleted (404) but still in the sitemap and news index. Content freshness ends ~2020.
17. **NOTE (register review — Abilash, GST sensitivity).** This is a hospitality-register site (lock does not apply to it), but it describes **KTAHV** in banned-sense terms: `ayurvedic-healing-village.aspx` meta description — "ayurvedic treatment **in vacation** by yoga, meditation, **spa** and therapies"; body — "treat its **guest** like gods"; homepage news item — "Kairali Ayurvedic Healing Village is declared the winner of **best luxury ayurveda spa** for 2020" (also a live `details.aspx` page). The KTAHV language lock formally covers KTAHV pages only; whether group-domain descriptions of KTAHV must also comply is an Abilash ruling — flagged, not asserted as a violation.

### PASS items

- **404 handling**: correct 404 status codes (no soft-200) — probe + dead sitemap URL both true 404s.
- **Viewport meta**: present on all 11 pages (`width=device-width, initial-scale=1.0`).
- **Forms render** (never submitted): `enquiry-now.aspx` (1 form, name/email/phone/age/gender/subject/message), `free-online-consultation.aspx` (1 form, 41 inputs), `give-feedback.aspx` (1 form) — all with `Turing.aspx` captcha image (200, image/Jpeg) and required-field validators. `enquiry-now.aspx` has an explicit consent checkbox: `chkAgree` + "I have read and agree to kairalihospitality.com privacy & terms of use." linking `privacy-policy.aspx` (line 725). Privacy Policy (200) and Terms (200) exist and are footer-linked sitewide.
- **Internal links**: 26/27 sampled → 200 (sole 404 = finding #9's sitemap ghost).
- **Passive mixed content minimal**: the 8 `http://admin.kairali.com/BlogImages/*.jpg` homepage images 301 to https and load (verified: 301 → https 200, image/jpeg); browsers auto-upgrade passive image content — low impact, still worth an href sweep alongside finding #4.
- **No Lorem ipsum, no template-variable leaks** (`{0}`, unbound `Label`) found in any sampled page.
- **TLS**: valid cert (all https fetches clean, no `-k` needed).
- **Social links**: LinkedIn company page 200; YouTube user channel 200. (Facebook legacy `/pages/…/436192759829834` → 400 and Twitter `Kairali_Group` → 200-shell — both bot-gated, see NOT RUN.)

Finding count: **1 locked-facts FAIL (+1 pass-set) · 1 security screen CLEAN · 6 P1 (1 L, 5 M) · 6 P2 (4 M, 2 S) · 5 P3 (4 S, 1 register-note) · 8 pass items.**

---

## NOT RUN (honest list)

- **Mobile/visual render checks** — no browser/Playwright/Chrome tools this pass (shared-pane rule). The sitewide JS-500 breakage (#1) is therefore *inferred from asset HTTP codes + source reading*, not observed in a rendered page; ditto the blocked-iframe consequences (#4).
- **Form submission tests** — findings-only rule: no form was submitted; validation, delivery, and post-submit UX unverified.
- **JS console/runtime errors, analytics network beacons** — require a browser; UA-deadness asserted from the published UA sunset + absence of GA4/GTM tags, not from live hit inspection.
- **Full 37-URL sitemap crawl** — 27 internal URLs HEAD-sampled; the remaining ~10 news/detail URLs unfetched.
- **Facebook page & Twitter account existence** — both endpoints bot-gate curl (FB 400, Twitter JS shell); listed as unverified, not as broken.
- **ayurvedichealingvillage.com outbound targets** — 403 WAF block to curl (incl. `virtual-tour.aspx` nav link); tried once, not bypassed; status in real browsers unverified.
- **Search Console / ranking data, Lighthouse scores, DNS/WHOIS ownership of keyawellness.com** — out of tool scope this pass.
- **Server-side cause of the /js/ 500s** — external audit sees the symptom only; needs Plesk/IIS log access (Sunaj/Deepu lane).

*Evidence artifacts (raw HTML/headers, asset probes, link-check output) retained in session scratchpad `…/scratchpad/kh/` — not committed.*
