# QA/QC audit — kairaliyoga.com (LIVE, legacy ASP.NET/IIS, yoga-retreat satellite for KTAHV)

- Audited: **2026-07-16 19:22:19 IST** (fetch window 19:05:47–19:22:19 IST)
- Auditor: factory QA pass (findings only, no fixes applied — CLAUDE.md §QA audit pass, D-TWO-LANE 16 Jul 2026)
- Method: external raw-HTML capture via `curl` (desktop Chrome UA, `--max-time 20`), byte-level inspection; read-only GET/HEAD only, no form submitted. Browser tools deliberately not used (shared pane) — see NOT RUN.
- Stack observed: `server: Microsoft-IIS/10.0`, `x-aspnet-version: 4.0.30319`, `x-powered-by-plesk: PleskWin` — ASP.NET WebForms, NOT WordPress. No WAF trouble: all fetches 200 first try.
- Sample: 11 pages fetched — `/`, `/about-us.aspx`, `/contact-us.aspx`, `/enquiry-form.aspx`, `/free-consultation-form.aspx`, `/kairali-retreats.aspx`, `/yoga-therapy.aspx`, `/ayurvedic-treatments.aspx`, `/kairali-profile.aspx`, `/retreatprograms/ahv/calendar.aspx` — plus `robots.txt`, `sitemap.xml` (65 URLs, all status-checked), 62 internal links status-checked, 13 outbound/social links checked, 2 deliberate 404 probes, http/https × www/non-www redirect matrix.
- Triage context confirmed: unexpected CONTENT 200; title "Kairali Yoga | Yoga Retreat | Restorative Yoga Retreat | Yoga and Meditation"; 161,105 bytes; "Since 1908" present; legacy UA analytics; no email on homepage.

---

## SECURITY / INJECTION SCREEN (rule r): **CLEAN**

- Spam keywords (`casino|gambling|betting|poker|viagra|escort`): 0 hits across all 11 pages, robots.txt, sitemap. `<marquee>`: 0.
- No AI-directed instruction text in any fetched content (`ignore previous|system prompt|you are an AI|as an AI|assistant:`): 0 hits — nothing to quarantine.
- robots.txt explicitly ALLOWS AI/LLM crawlers (GPTBot, ClaudeBot, Claude-Web, PerplexityBot, CCBot, Anthropic-AI, etc.) — a deliberate allow-list, not an injection; noted as configuration, no action taken on it.
- Outbound inventory is on-brand group domains + social only; no off-topic/pharma/gambling links. (One outbound now resolves to a PARKED domain — hygiene finding #7, not an injection.)

---

## FINDINGS (ranked by severity)

### 1. H / LOCKED-FACT VIOLATION — "Kairali Ayurvedic Group Since 1908." sitewide footer
- Evidence: `https://kairaliyoga.com/` line 2166: `<div class="copy-right"><a href="http://www.kairali.com/" target="_blank">Kairali Ayurvedic Group Since 1908.</a></div>` — present on **all 11 sampled pages** (grep `1908` = 1 hit per page, all this footer line).
- PR #65 ruling: 1908 = family lineage only; the GROUP was founded 1989. This attaches "Since 1908" directly to "Kairali Ayurvedic Group" → WRONG on every page of the site. Register review (Abilash) → copy fix delegation.

### 2. H / BROKEN CONTACT MAILTO — visible `info@kairali.com`, actual link `in@kairali.com`
- Evidence: `https://www.kairaliyoga.com/contact-us.aspx` lines 318 and 332 (both contact blocks — KTAHV Palakkad and Corporate/Reservation Delhi): `<a href="mailto:in@kairali.com" target="_blank">info@kairali.com</a>`.
- The visible text is the correct locked-fact address; the mailto target drops "fo". Every "email us" click opens a draft to `in@kairali.com`. Whether that mailbox exists/forwards is NOT externally verifiable — flagged as probable silent lead loss on the site's only published email link. These are the only 2 email occurrences on the whole sample; homepage has **zero** email/phone/tel: anywhere (triage flag confirmed).

### 3. H / ANALYTICS DEAD ~3 YEARS — legacy Universal Analytics only, no GA4/GTM
- Evidence: every sampled page loads `https://www.google-analytics.com/analytics.js` with `ga('create', 'UA-41701680-1', 'auto')` (homepage head, lines ~24–34; same tag on all 11 pages). Zero `G-*`, `GTM-*`, `AW-*`, gtag.js anywhere.
- Universal Analytics stopped processing hits on 1 Jul 2023 (GA360: Jul 2024). The site has collected **no analytics since then**. Fix (S): install GA4 (or the group GTM container) sitewide; remove the dead UA snippet.

### 4. H / ACTIVE MIXED CONTENT on https — jQuery and Google-Fonts CSS loaded over `http://`
- Evidence (homepage head): `<script src="http://www.kairaliyoga.com/js/jquery-1.10.2.min.js"></script>` and `<link rel='stylesheet' href='http://fonts.googleapis.com/css?family=Lato…'>` on the https page.
- Current browsers **block** http-scheme scripts/stylesheets on https pages (active mixed content is not auto-upgraded). When blocked, jQuery never loads → the superslides hero slider, sf-menu nav, fancybox, search-box handler, footer-year script and mobile `<select>` menu (all `$(...)`-dependent, see inline scripts at page tail) fail on the https origin. Rendering NOT verified (see NOT RUN) — the blocking behaviour is standard browser policy, the breakage inference is marked as such.
- Both assets exist over https (`https://www.kairaliyoga.com/js/jquery-1.10.2.min.js` → HTTP 200 verified) — fix (S) is scheme-relative/https URLs.
- Passive mixed content too: 12 `src="http://www.kairaliyoga.com/…"` images on the homepage (slides `kairaliyoga-banner.jpg`, `buddha-statue-sunset1.jpg`, `85632516.jpg`, `6011047041…jpg`, logo, buttons) — browsers auto-upgrade these, server 301s http→https (verified), so impact is latency/warnings.
- Related (S, security): jQuery 1.10.2 is a 2013 release with known XSS advisories — upgrade at rebuild.

### 5. M / NO CANONICALS + DUPLICATE HOSTS — www and non-www both serve 200, no rel=canonical anywhere
- Evidence: redirect matrix — `https://kairaliyoga.com/` HTTP 200 (161,105 bytes) AND `https://www.kairaliyoga.com/` HTTP 200 (161,105 bytes); neither redirects to the other. `rel="canonical"` count = 0 on all 11 sampled pages. No `og:*`, no hreflang, no JSON-LD anywhere (0 hits sitewide sample).
- Google sees two complete duplicate sites. Compounded by internal links hardcoding `http://www.kairaliyoga.com/…` (entire nav/footer) — every internal click from the https non-www origin takes an http hop → 301 → https. Fix (S at server level): pick one host, 301 the other, add canonicals.

### 6. M / SITEMAP STALE (2018) + PROTOCOL/HOST MISMATCH with robots.txt
- Evidence: `sitemap.xml` header comment `created with Free Online Sitemap Generator www.xml-sitemaps.com`; 65 `<loc>` URLs, ALL `http://www.kairaliyoga.com/…`; lastmod values: 63× `2018-12-20`, 1× `2016-02-26`, 1× `2014-10-13`. robots.txt declares `Sitemap: https://www.kairaliyoga.com/sitemap.xml` (https) while the sitemap body is all http. robots.txt also begins with a UTF-8 BOM (`ef bb bf` verified) — tolerated by Google, untidy.
- Mitigating: all 65 sitemap URLs were status-checked over https → **all 200, zero 4xx/5xx**. Fix (S): regenerate sitemap on the canonical https host.

### 7. M / DEAD & PARKED OUTBOUND LINKS (footer group-sites + socials, sitewide)
- Evidence (final status after redirects, checked 19:1x IST):
  - `http://www.keyawellness.com` → 200 at **hugedomains.com domain-for-sale page** — a group-branded footer link now points to a parked/squattable domain.
  - `https://plus.google.com/102296388765014542269` → redirects to a Google blog post announcing Currents shutdown — Google+ has been dead since 2019; icon still in footer socials.
  - `https://www.facebook.com/pages/Kairali-Yoga-Retreats/377417889032009` → HTTP 400 (legacy /pages/ URL format, broken).
  - `http://www.whyayurveda.org/topics/csr.aspx` → 404 (after redirect to https).
  - Unverified (not asserted broken): `http://www.ayurvedichealingvillage.com` → 403 to curl (WAF-style block; may render in browsers — one retry only, no bypass attempted).
  - OK: twitter.com/Kairali_Group (200 via x.com), youtube user page 200, linkedin company 200, kairali.com/ayurveda-csr.aspx 200, kairaliproducts.com 200, keralatraining.com 200, keralaequipments.com 200, keralaayurvedainstitute.com 200.
- Fix (S): remove Google+ icon, correct/remove keyawellness + facebook + whyayurveda CSR links.

### 8. M / EXPIRED EVENT + STALE FEED CONTENT presented live
- Evidence: `/retreatprograms/ahv/calendar.aspx` (linked from main nav "Retreat Programs") — `<h1>Calendar</h1>` page whose only listed retreat is `alt='Lakshya Yoga and Ayurveda Retreat 19th July 2018 to 22nd July 2018'` — **8 years expired**.
- Homepage blog/news feed pulls 2013-era posts from whyayurveda.org ("World Luxury Spa Award 2012…", National Geographic 2013) — year tokens on homepage: 126× "2013", 51× "2014", newest 9× "2018". The site presents a decade-frozen feed as current.
- Positive: footer year is computed (`$("#year").text((new Date).getFullYear())`) — no frozen rolling number found ("115+ years"/"25 years of" patterns: 0 hits).

### 9. M / MOJIBAKE ×36 on homepage (double-encoded UTF-8 in feed content)
- Evidence: 36 occurrences of `â€` sequences on `/`, e.g. `Indiaâ€™s most southerly state`, `Itâ€™s a unique resort`, `Kairali â€“ The Ayurvedic` — apostrophes/dashes render as garbage in the visible blog-feed and awards text (page charset is utf-8; source data double-encoded).

### 10. M / MANGLED EDITOR HTML leaking admin internals on homepage
- Evidence: `/` line 1859: `<div class='whydiscription'><span class="<img src=" http:="" admin.kairali.com="" htmleditor="" images="" pixel.gif"="" title="" rel="media6305913787800819" width="150" height="100">` — a broken img tag serialized into attribute soup, exposing the `admin.kairali.com/htmleditor/` path in public HTML. Code-leak class defect (scope: template/code leaks).

### 11. M / ENQUIRY FORM — consent sentence with NO consent control
- Evidence: `/enquiry-form.aspx` renders (HTTP 200) a WebForms POST form (`txtName`, `txtPhone`, `txtEmail`, `btnSubmit`) with line 471: `Confirm adhering to <a href="privacy-policy.aspx">privacy policy.</a>` — but `type="checkbox"` count = **0** on the page. The user is told to "confirm" with nothing to tick; no consent is actually captured.
- Contrast: `/free-consultation-form.aspx` (HTTP 200) DOES have `<input name="chkAgree" type="checkbox" id="chkAgree">` + "I have read and agree to kairaliyoga.com privacy & terms of use." (line ~1100) — the pattern exists in the codebase; the enquiry form just lacks it.
- Note: the consultation form collects **health data** (txtBloodPressure, txtManiComplaint [sic], txtHeight, txtAge, 20 symptom checkboxes) — with the consent checkbox present this is minimally covered, but DPDP-grade consent wording is rebuild-scope. `privacy-policy.aspx` → HTTP 200 (target valid). Forms NOT submitted (rule: render check only).

### 12. S / VERSION-DISCLOSURE HEADERS + DEFAULT FRAMEWORK 404 PAGE
- Evidence: every response carries `server: Microsoft-IIS/10.0`, `x-aspnet-version: 4.0.30319`, `x-powered-by: ASP.NET`, `x-powered-by-plesk: PleskWin`. 404 probe `/qa-nonexistent-probe-20260716.aspx` → HTTP 404 with the **raw ASP.NET default error page** ("The resource cannot be found.", Verdana/red-H1 template); extensionless probe → IIS default 404. Correct status codes (no soft-200 — PASS), but unbranded framework error pages + full version fingerprint aid targeting. Fix (S): strip headers in Plesk/web.config, add custom 404.

### 13. S / HOMEPAGE META/HEADING HYGIENE
- Evidence: homepage `<h1>` count = **0** (inner pages sampled all have exactly 1). Meta description (present) has grammar/casing defects: `"Kairali Yoga Provide You the Best Services like yoga training, yoga retreat,  teacher training, … in palakkad, Kerala"` — "Provide" (verb agreement), double space, lowercase "palakkad". Title tag contains a trailing line-break before `</title>`. Keyword-stuffed pipe titles sitewide (e.g. contact page title contains literal run-on whitespace: `"…Email Kerala        Yoga"`). Viewport meta present on all pages (PASS).

### 14. NOTE (register review — Abilash) / hospitality register on a KTAHV-marketing satellite
- This domain sells retreats AT "Kairali – The Ayurvedic Healing Village" (KTAHV) but uses hospitality register: `<title>…| Ayurvedic Spa</title>` on `/kairali-profile.aspx`; "It's a unique resort where you c…" (homepage); "the luxurious gardens at ayurvedic healing village" (kairali-profile img alt); homepage feed headlines "World Luxury Spa Award 2012…". The CLAUDE.md language lock formally binds **KTAHV pages only** — whether a satellite domain marketing KTAHV falls under the GST-SCN register is an Abilash decision, not a finding I can rule on. Noted, not delegated.

### 15. NOTE / widget config (observation only)
- Chatbase chatbot (`chat.kairali.com`, chatbotId `rpNt_uRW6W8EDiTf6AvYJ`) force-opens itself 5s after load on each visitor's first two pageviews (sessionStorage loadCount script at page tail). OneSignal push (appId `c2d94bf3-…`, `autoRegister: true`) also prompts. Two competing interruptions on a lead page — UX call for rebuild, out of audit scope.

---

## LOCKED-FACTS RESULT (all 11 pages + robots + sitemap grepped)

| Locked fact | Result |
|---|---|
| Banned `+91 92898 38777` / `9289838777` (all spacing variants) | **ABSENT — PASS** (0 hits; correct `…38797` also absent — no KTAHV WhatsApp published here at all) |
| Public contact email `info@kairali.com` | **PARTIAL FAIL** — visible text correct ×2 on /contact-us.aspx, but both hyperlinks are `mailto:in@kairali.com` (finding #2); absent from homepage and all other sampled pages |
| "Since 1908" attached to Group/company | **FAIL** — sitewide footer "Kairali Ayurvedic Group Since 1908." (finding #1) |
| Frozen rolling numbers ("115+ years", "25 years of…") | **PASS** — 0 hits; footer year is JS-computed |
| Phones found | `(+91)-(4923)-222553/222623/224402/224403`, `+91-9555156156, Ext-8` (contact page only) — no banned number; correctness of these lines not externally verifiable → register review if desired |

**Overall locked-facts verdict: FAIL** (Since-1908 sitewide + broken info@ mailto).

---

## PASSES (verified clean)

- HTTP hygiene: http→https 301 on both hosts (verified); all sampled pages HTTP/2 200; no 4xx/5xx on any of 62 internal links or 65 sitemap URLs (https-normalized); 404 probes return true 404 status (no soft-404).
- robots.txt: `User-agent: * / Allow: /` — no accidental noindex/disallow; no `noindex` meta on any sampled page.
- Security screen clean (see top): no spam injection, no hidden elements, no AI-instruction text in fetched content.
- Lorem ipsum: 0 hits on all sampled pages.
- Viewport meta present sitewide; charset utf-8 declared.

## NOT RUN (honest list)

- Mobile/visual render checks, JS execution, layout verification — browser/Playwright tools not used (shared pane rule). Consequence: the mixed-content breakage in finding #4 is a policy-based inference, not an observed render failure; slider/menu/fancybox state unobserved.
- Form submission tests — forms render-checked only, never submitted (binding rule). Delivery of enquiry/consultation posts unverified.
- Existence/deliverability of mailbox `in@kairali.com` — not externally testable; flagged, not asserted dead.
- `ayurvedichealingvillage.com` outbound — 403 to curl (single retry, no bypass); browser behaviour unverified.
- Google Search Console / index-state data — no access from this pass; duplicate-host impact (finding #5) inferred from crawl behaviour only.
- Full-site crawl — 11 of 65 pages deep-inspected; remaining 54 status-checked only (all 200). Sitewide footer findings (#1, #3, #7) verified on all 11 deep-sampled pages and asserted sitewide on template-inheritance grounds.

## DELEGATION SPLIT (draft — findings only, no fixes applied in this pass)

- **Abilash (register/decisions):** #1 Since-1908 wording ruling (PR #65 application to this domain); #14 hospitality-register question; confirm intended email (`info@kairali.com`) so #2 is a one-character fix; decide GA4 vs group GTM for #3.
- **Deepu (web exec, after rulings):** #2 mailto fix ×2; #3 analytics swap; #4 https asset URLs (jquery, fonts, 12 imgs); #5 host 301 + canonicals; #6 sitemap regen; #7 footer link cleanup; #11 add chkAgree to enquiry form; #12 header strip + custom 404; #13 h1/meta fixes.
- **Anupam (copy):** #8 expired calendar + 2013 feed content; #9 mojibake source text; #13 meta-description rewrite.

*Evidence artifacts (raw HTML captures, headers, link-check output) retained in session scratchpad `…/scratchpad/ky/` — not committed.*
