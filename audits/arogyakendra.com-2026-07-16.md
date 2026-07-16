# QA/QC audit — arogyakendra.com (LIVE legacy ASP.NET/IIS one-pager) + sibling probe arogyakendra.co.in

- Audited: **2026-07-16 18:35:23 IST** (fetch window 18:26:13–18:34:02 IST)
- Auditor: factory QA pass (findings only, no fixes applied — CLAUDE.md §QA audit pass; D-TWO-LANE 16 Jul 2026: curl-only, no browser pane)
- Method: external raw-HTML capture via `curl` (desktop Chrome UA, `--max-time 20`), byte-level inspection. Read-only GET/HEAD only; no form submitted, no captcha touched.
- Stack observed: `Server: Microsoft-IIS/10.0`, `X-AspNet-Version: 4.0.30319`, `X-Powered-By-Plesk: PleskWin` — the legacy IIS site is still what DNS serves (Vercel rebuild exists but DNS never flipped; context honoured).
- Sample (arogyakendra.com): `/` (200, 47,296 B), `/default.aspx` (200, 47,308 B), `/enquirenow.aspx` (200), `/freeonlineconsultation.aspx` (200), `/privacy-policy.aspx` (**404**), `/robots.txt` (**404**), `/sitemap.xml` (**404**), `/sitemap_index.xml` (404), 404 probe `/qa-nonexistent-probe-20260716` (404), captcha endpoints `/Turing.aspx` + `/asdfghjkl.aspx` (both 200 image/Jpeg), http→https probe (301 ✓), `www.` probe (200 — duplicate host). The site is effectively a one-pager (anchor nav) + 2 form pages; this sample IS the crawlable set.
- Sibling probe (arogyakendra.co.in): `/` (200, 28,770 B — a DIFFERENT legacy ASP.NET site, not a mirror), `/robots.txt` (404), footer-linked `/sitemap.xml` (404), 5 inner pages HEAD-checked 200, http→https 301 ✓.
- Evidence artifacts (raw HTML + header captures) retained in session scratchpad `…/scratchpad/ak/` — not committed.

---

## LOCKED-FACTS RESULT: **FAIL** (register review — Abilash)

- **FAIL / "Since 1908" attached to the GROUP — both domains, sitewide footer.**
  - `https://arogyakendra.com/` (and default.aspx, enquirenow, freeonlineconsultation — footer on every page): `&copy; Kairali Ayurvedic Group Since 1908.` — exact capture. Per PR #65 ruling: 1908 = family lineage only; the Group was founded 1989. WRONG as written.
  - `https://arogyakendra.co.in/` footer: `<a href="http://www.kairali.com/">&copy; Kairali Ayurvedic Group Since 1908.</a>` — same violation, hyperlinked to kairali.com.
- **FAIL / frozen rolling numbers.**
  - `https://arogyakendra.com/` stats band: **"109 Years of Experience"** — typed, not computed. 1908+109 = 2017: this counter froze ~9 years ago. Adjacent typed counters "20 Distributors Worldwide / 25 Centers Worldwide / 700 Staff / 300 Products / 40 Awards" — all static text, unverifiable externally, flag for register review.
  - `https://arogyakendra.co.in/` (home, Company Profile teaser): "Kairali Ayurvedic Group has been for last **25 years** encouraging and establishing…" — frozen rolling number (1989+25 = 2014 vintage copy).
- **PASS / banned phone.** `9289838777` / `92898 38777` / any `…38777`: **0 occurrences** on every page fetched, both domains (grep across all captures). Correct-Priya `…38797` also absent (this is not a KTAHV contact page — nothing to scrub).
- **PASS (with one defect) / contact email.** `info@kairali.com` present in the contact block of every arogyakendra.com page (`<strong>Email</strong>: info@kairali.com`) — correct. On arogyakendra.co.in the footer mailto is correct but the **visible text is wrong**: `<a href="mailto:info@kairali.com">gm.marketing@kairaliproducts.com</a>` — display text shows a private mailbox over the correct mailto (see finding C4).
- **PASS / phone printed on .com**: `+91- 9555156156` (Kairali Ayurvedic Group, Mehrauli corporate office block) — matches the number used fleet-wide on kairalicenters.com; not a banned number.

---

## Findings — arogyakendra.com (severity-ranked)

### A. HIGH

- **A1 / CODING — active mixed content breaks the homepage slider for every HTTPS visitor.** `https://arogyakendra.com/` head/body load slider assets over plain **http:// from a third-party domain**:
  - `<link rel="stylesheet" type="text/css" href="http://www.keralatraining.com/slick/slick.css">`
  - `<link rel="stylesheet" type="text/css" href="http://www.keralatraining.com/slick/slick-theme.css">`
  - `<script src="http://www.keralatraining.com/slick/slick.min.js" type="text/javascript" charset="utf-8">`
  Browsers **block** active mixed content (CSS/JS) on https pages, so the slick carousel CSS+JS never load — the hero slider markup (3 `.sliderslide` divs) renders broken/stacked on the live https URL. Assets themselves resolve over http (200, verified 18:31 IST) — the breakage is purely the http-on-https scheme. Also passive mixed content: `<img src="http://media.kairali.com/images/keralatraining-banner.jpg" alt="Hand Sanitizer" />` (200 over http). Dependency on unrelated domain keralatraining.com is its own fragility flag.
- **A2 / COMPLIANCE+CODING — the privacy link on the homepage consent line is a 404, and the consent label names the WRONG WEBSITE.** Homepage enquiry form consent line (exact capture): `<input name="chkAgree" type="checkbox" id="chkAgree" />I have read and agree to ayurvedichealingvillage.com <a target="_blank" href="privacy-policy.aspx">privacy &amp; terms of use.</a>` —
  - `https://arogyakendra.com/privacy-policy.aspx` → **HTTP 404** (broken privacy link at the exact point of consent);
  - the label says the user is agreeing to **ayurvedichealingvillage.com** terms while on arogyakendra.com — copy-paste from the KTAHV site.
  On /enquirenow.aspx the label correctly says "Kairali Ayurvedic Group" and links `https://www.kairali.com/privacy-policy.aspx` (200 ✓); on /freeonlineconsultation.aspx same label but the link is **http://**www.kairali.com/privacy-policy.aspx (redirects to https, 200 — should be https at source). No on-domain privacy policy exists at all.
- **A3 / COMPLIANCE — /freeonlineconsultation.aspx collects detailed HEALTH DATA with the above consent defects.** The rendered form asks for blood pressure, weight, height, current medications, past medical history (5 checkbox conditions + free text), pregnancy status ("Are you pregnant", "planning next 6 months"), marital status, age, full address (fields `txtBloodPressure`, `txtWeight`, `chkPastHistory_0-4`, `txtPregnant`, `rdoPlaningNext6Month`, … captured 18:28 IST). Sensitive-category personal data riding on an off-domain, http-schemed privacy link and no on-domain policy. Form render itself: PASS (fields, validators, captcha image `asdfghjkl.aspx` → 200 image/Jpeg, consent checkbox present). NOT submitted (rule: never submit).
- **A4 / ANALYTICS DEAD — the site has measured nothing since July 2023.** Only tracker on every page: legacy Universal Analytics `ga('create', 'UA-51307935-1', 'arogyakendra.com')` (analytics.js snippet). UA properties stopped processing hits 1 Jul 2023. **No GA4 (`G-…`), no GTM (`GTM-…`) anywhere** (grep = 0 on all pages). All enquiry/consultation lead traffic is invisible.

### B. MEDIUM

- **B1 / GOOGLE HYGIENE — no robots.txt, no sitemap.** `https://arogyakendra.com/robots.txt` → 404 (IIS default error page, 1,245 B); `/sitemap.xml` → 404; `/sitemap_index.xml` → 404.
- **B2 / DUPLICATE URLS with no real canonical.** Three URLs serve the same homepage with HTTP 200 and no server-side canonical or redirect: `https://arogyakendra.com/`, `https://arogyakendra.com/default.aspx` (47,308 B vs 47,296 B — viewstate delta only), `https://www.arogyakendra.com/` (200, 47,296 B — www never redirects to apex). The only canonical is **JavaScript-injected** on every page: `ramc.href = window.location.href` — i.e., every duplicate (and any query-string/UTM variant) self-canonicalizes after JS render. Effectively no canonical consolidation.
- **B3 / BROKEN + WRONG-TITLED promo/blog links on the homepage.**
  - Hero slide 1 CTA (the "Hand Sanitizer" banner) → `https://www.kairaliproducts.in/catalogsearch/result/?q=sanitizer` → **HTTP 404** (Magento search URL; the store has since moved — books.html now 301s to a Shopify `/collections/` path).
  - Blog card 1 → `http://www.whyayurveda.org/treatment-center/2014/06/23/kairali-ayurvedic-spa-now-in-dubai.aspx` → **HTTP 404** after redirect to https.
  - Blog card 2 links to the 2018 Bangkok article but carries the **wrong title** — anchor text reads `Kairali Ayurvedic Spa Now in Dubai !` on the Bangkok card (exact capture; correct Bangkok URL, Dubai label).
  - "Our Brands" carousel: `http://www.kairaliequipment.com/` → **HTTP 500** at destination (Spa Equipment brand card dead).
  - Facebook (`400`) and Twitter (`520`) footer links returned bot-block-ish codes to curl — **unverified**, likely anti-bot, listed in NOT RUN. YouTube and LinkedIn 200 ✓.
- **B4 / STALE COVID-ERA CONTENT as hero slide #1.** First slider slide is a "Hand Sanitizer" promo (`alt="Hand Sanitizer"`, punchline span "Hand Sanitizer", banner `keralatraining-banner.jpg`) pointing at the dead sanitizer search (B3). 2020-vintage promo still in first position in 2026. The "Blog — Get our latest updates" section's newest item is from **2018** (Bangkok), alongside 2014 (Dubai) and 2012 (Cauldwell review).
- **B5 / SEO BASICS on a page-one template.** Homepage has **zero `<h1>`** (only `<h2>`s: "Enquire Now", "About Us"); title is keyword-stuffed (`Arogya Kendra | Kairali Arogya Kendra | Ayurvedic Arogya Kendra | Arogya Sansthan`); meta `keywords` tag present (obsolete; includes "spa and massage center"); **zero JSON-LD** on any page (no Organization/LocalBusiness/WebSite). /enquirenow.aspx and /freeonlineconsultation.aspx each have exactly one h1 ✓ and unique titles/descriptions ✓.

### C. SMALL (S)

- **C1 / VERSION DISCLOSURE.** `/privacy-policy.aspx` 404 renders the raw ASP.NET default error page: `Version Information: Microsoft .NET Framework Version:4.0.30319; ASP.NET Version:4.7.4136.0` (exact capture). Response headers on every page leak `Server: Microsoft-IIS/10.0`, `X-AspNet-Version`, `X-Powered-By: ASP.NET`, `X-Powered-By-Plesk: PleskWin`. No `Strict-Transport-Security` header on any response (grep = 0). Note also: .aspx 404s render the ASP.NET error page while non-.aspx 404s render the IIS default — no branded 404 either way (both return proper HTTP 404, no soft-200 ✓).
- **C2 / CODE LEAKS.** Production `console.log("load count - ", loadCount)` in the Chatbase auto-open script on `/` (the script also force-clicks `chatbase-bubble-button` 5 s after first load — noted, UX call is out of scope). Captcha endpoints named `Turing.aspx` (homepage form) and **`asdfghjkl.aspx`** (keyboard-mash filename, both form pages) — functional (200 image/Jpeg) but unprofessional leftovers visible in source/network tab.
- **C3 / footer social links use http://** (facebook/twitter/youtube/linkedin) — redirect-only cost; and blog images hotlink `admin.kairali.com/BlogImages/…` (an admin-named host serving public assets — fragility/optics flag, 200 ✓ today).
- **C4 / no Subresource Integrity on any external script.** Neither `https://chat.kairali.com/embed.min.js` nor `http://www.keralatraining.com/slick/slick.min.js` carries `integrity`/`crossorigin` attributes (grep `integrity=` → 0 across all captures) — a compromise of either host executes arbitrary JS on the lead-capture pages. Compounds A1's third-party-over-http dependency.

### Security screen (rule r) — CLEAN
- Injection screen on every fetched page (both domains): no text addressing AI/agents, no "ignore previous…", no hidden prompts — 0 hits. Zero-width characters: 0. No `<marquee>`/casino/spam-keyword injection signature (the kairalicenters 14-Jul class): 0 hits. External scripts: google-analytics.com + chat.kairali.com (own chatbot infra) + keralatraining.com slick assets (A1) — no unknown third-party JS.

---

## Sibling probe — arogyakendra.co.in (brief, same fetch window)

A **different** legacy ASP.NET site (28,770 B home; multi-page: about-us, company-profile, our-locations/Pollachi, career, contact-us, enquire-now, free-ayurvedic-consultation — 5 inner URLs HEAD-checked 200). Same IIS/Plesk stack. Findings:

- **C-1 / LOCKED FACTS: FAIL** — footer `© Kairali Ayurvedic Group Since 1908.` (linked to kairali.com) + frozen "last **25 years**" in Company Profile teaser (details in locked-facts section above). Banned phone: 0 hits ✓.
- **C-2 / Brand name misspelled 3 different ways on the homepage alone:** "**Ayogyakendra** is an endeavour…" (About Us teaser), "At **Aroygya Kendra**, we believe…" (Careers teaser), "…treatment centers, **Aryogya Shalas**…" (Company Profile teaser) — exact captures.
- **C-3 / Footer links to `sitemap.xml` that is a 404.** Footer anchor "XML" → `http://www.arogyakendra.co.in/sitemap.xml` → **404**. `/robots.txt` → 404 as well. (Its `/privacy-policy.aspx` DOES resolve, 200 ✓ — unlike the .com.)
- **C-4 / Footer email display/mailto mismatch:** `<a href="mailto:info@kairali.com">gm.marketing@kairaliproducts.com</a>` — correct mailto, wrong visible text exposing an internal marketing mailbox.
- **C-5 / Dead analytics:** `UA-63539650-1` only; no GA4/GTM — zero measurement since Jul 2023.
- **C-6 / Mixed content + all-http internal linking:** `http://media.kairali.com/images/arogyakendra-banner.jpg` on the https page; every internal nav/footer link is absolute `http://www.arogyakendra.co.in/…` (each click takes a 301 hop). No canonical at all (not even the JS trick), no JSON-LD, "index, follow".
- **NOTE / duplicate hosts:** `https://arogyakendra.co.in/` and `https://www.arogyakendra.co.in/` both 200 (28,770 B each), no canonical — same duplicate-host issue as the .com.

---

## NOT RUN (honest gaps)

- **Mobile/visual render checks** — no browser/Playwright per D-TWO-LANE ruling (single shared pane, other agents running). The A1 slider-breakage impact is inferred from the mixed-content blocking standard, not visually confirmed; viewport meta IS present (`width=device-width, initial-scale=1`).
- **Form submission / captcha flow** — forms verified render-only; never submitted, captcha never attempted (binding rule).
- **JS-rendered behaviour** — the JS-injected canonical (B2) and Chatbase auto-open (C2) verified in source only, not in an executing browser.
- **Facebook (HTTP 400) and Twitter/X (HTTP 520) footer links** — bot-blocked to curl; broken-vs-alive **unverified**.
- **ayurvedichealingvillage.com brand-card link** — HTTP 403 to curl (WAF-class block, consistent with known KTAHV WAF); not bypassed, **unverified**, not counted as broken.
- **arogyakendra.co.in full crawl** — brief probe only (home + robots + footer targets + 5 inner-page HEADs); its inner-page content, forms, and locked-facts sweep beyond the homepage were not audited.
- **Static-counter truth values** ("20 Distributors", "25 Centers", "700 Staff", "300 Products", "40 Awards") — cannot be verified externally; flagged as typed/frozen, truth left to register review.
- **Search Console / analytics data** — no access from this pass.

---

## DELEGATION SPLIT (findings routing only — no fixes applied in this pass)

**Primary note (Abilash):** this whole site is Wave-scope — the Vercel rebuild exists and DNS never flipped. Every finding below is moot the day DNS flips; the only items arguably worth touching on the legacy box before then are A2 (consent line naming the wrong site + 404 privacy link on a health-data funnel) and the locked-facts footer.

- **Abilash (register review):** locked-facts FAIL — "Since 1908" footers (both domains), "109 Years of Experience", ".co.in 25 years"; static counters truth-check; decide whether A2/A3 warrant a legacy-box touch before DNS flip.
- **Deepu (web):** if any legacy touch is approved: privacy-policy.aspx 404 + consent label site-name (A2); https-scheme the three keralatraining.com slick assets + media.kairali.com banner (A1); kill or retarget the sanitizer hero slide + Dubai 404 card + Bangkok title (B3/B4); GA4 tag if the site will live longer than expected (A4).
- **Sunaj (infra):** version-disclosure headers + ASP.NET default error page + missing HSTS (C1) — only if the IIS box stays in service; otherwise fold into decommission checklist.
- **Anupam (copy):** .co.in brand misspellings ×3 (C-2) — only if .co.in is staying live; otherwise inventory for the rebuild.

Finding count: **locked-facts FAIL (2 violation classes, both domains) · .com: 4 HIGH, 5 MEDIUM, 3 S · .co.in: 6 findings + 1 note · security screen CLEAN · 8 NOT-RUN items.**
