# QA/QC audit — keralaequipments.com (LIVE legacy ASP.NET brochure site, IIS/Plesk)

- Audited: **2026-07-16 19:22:19 IST** (fetch window 19:16:32–19:22:19 IST)
- Auditor: factory QA pass (findings only, no fixes applied — CLAUDE.md §QA audit pass; D-TWO-LANE 16 Jul 2026)
- Method: external raw-HTML capture via `curl` (desktop Chrome UA + Googlebot UA cross-check), byte-level inspection, read-only GET/HEAD only. No browser tools used (pane shared with other agents). No form submitted.
- Sample: `/` (https + http + www variants), `/default.aspx`, `/enquirenow.aspx`, `/freeonlineconsultation.aspx`, `/privacy-policy.aspx` (404), `/robots.txt` (404), `/sitemap.xml` (404), one deliberate 404 probe (`/qa-nonexistent-probe-20260716.aspx`), asset-host probes on `media.kairali.com`, and 22 outbound links HEAD/GET-checked. The site's nav exposes only these pages — there is no product catalog to sample.
- Triage context honoured: surfaced as unexpected CONTENT (200, ~38KB) with flag "Footer 'Kairali Ayurvedic Group Since 1908'".
- Stack: `server: Microsoft-IIS/10.0`, `x-aspnet-version: 4.0.30319`, `x-powered-by-plesk: PleskWin` — classic WebForms (`__VIEWSTATE`, `WebResource.axd`). Not WordPress; not on the factory monorepo.

---

## LOCKED-FACTS RESULT: **FAIL** (2 violations, 2 passes)

| Fact | Verdict | Evidence |
|---|---|---|
| "Since 1908" attached to Group | **FAIL — on every sampled page** | Footer `© Kairali Ayurvedic Group Since 1908.` verbatim on `/`, `/default.aspx`, `/enquirenow.aspx`, `/freeonlineconsultation.aspx` (1 occurrence each; also served identically to Googlebot UA). PR #65 ruling: Group founded 1989; 1908 = family lineage only. |
| Frozen rolling number | **FAIL** | Homepage stats block: `<span>109</span> Years of Experience` (`/` and `/default.aspx`). 1908+109 = 2017 — typed ~9 years ago and never recomputed. Companion stats "20 Distributors / 25 Centers / 700 Staff / 300 Products / 40 Awards" are static claims — unverifiable externally, register review. |
| Public contact email = info@kairali.com | **PASS** | `info@kairali.com` ×4 (footer of every page). No other public email found. |
| Banned WhatsApp +91 92898 38777 | **PASS (absent)** | grep `92898[ -]?38777|9289838777|38777` → 0 hits on all captures. Only phone on site: `+91- 9555156156` (Delhi corporate office — not a locked fact, no conflict). |

---

## SECURITY VERDICT: **CLEAN of injection/spam** (external view, as of 19:22 IST)

- Casino/gambling/pharma spam keywords: 0 across all pages + stylesheet. No `<marquee>`, no zero-width chars (U+200B/C/D), no hidden-element spam CSS.
- No cloaking: Googlebot-UA fetch of `/` byte-identical (37,621 bytes) to desktop-UA fetch.
- No prompt-injection text addressed to AI agents in any fetched content (rule r screen run on every capture) — nothing to quarantine.
- External scripts limited to: google-analytics.com (dead UA, see F2), `chat.kairali.com/embed.min.js` (Chatbase widget, first-party subdomain), bootstrapcdn/cloudflare/fonts.googleapis CSS. All business-plausible; no rogue outbounds.
- Info-disclosure hardening gaps exist (F11) but no compromise indicators.

---

## FINDINGS (severity-ranked, evidence-linked)

### F1 — **H / sitewide** / Active mixed content: CSS + JS loaded over `http://` on an https site — modern browsers BLOCK these, so the https site very likely renders unstyled with dead JS
- Evidence, verbatim in served HTML of `https://keralaequipments.com/`:
  - `<link rel="stylesheet" type="text/css" href="http://media.kairali.com/slick/slick.css">` (+ `slick-theme.css`, + `http://media.kairali.com/css/keralaequipments-style.css`)
  - `<script src='http://media.kairali.com/js/jQuery1.9.js' ...>` and `<script src="http://media.kairali.com/slick/slick.min.js" ...>`
  - Inner pages each carry 1 http CSS + the http jQuery.
- Browsers do not auto-upgrade **active** mixed content (scripts/stylesheets) — they block it. Consequence chain: no site stylesheet → unstyled page; no jQuery → slider, mobile menu toggle, and enquiry-panel JS all throw. (Actual render NOT RUN — no browser this pass — but the http URLs are verbatim and the blocking behaviour is standard.)
- The fix is trivial: `https://media.kairali.com/css/keralaequipments-style.css` already serves HTTP 200 (verified 19:18 IST) — same for the other assets. Change `http://` → `https://` (or protocol-relative) in the master page.
- Also passive mixed content: 16 `http://media.kairali.com` image srcs on `/` (4 each on inner pages) + favicon `http://media.kairali.com/fav/favicon.ico` — auto-upgraded by modern browsers, but should be https at source.

### F2 — **H / sitewide** / Analytics dead for ~3 years: only Universal Analytics, no GA4/GTM
- Every page carries only `ga('create', 'UA-51307833-1', 'keralaequipments.com')` (analytics.js). UA properties stopped processing data in 2023/24. `G-`/`GTM-` tags: 0 on all pages. The site has recorded nothing since UA sunset.

### F3 — **H / https://keralaequipments.com/ (homepage enquiry form)** / Consent checkbox hidden by CSS + names the WRONG entity + links to a 404 privacy policy
- Markup: `<div class="clearfix hi-hide"><input name="chkAgree" type="checkbox" id="chkAgree" />I have read and agree to ayurvedichealingvillage.com <a target="_blank" href="privacy-policy.aspx">privacy &amp; terms of use.</a></div>`
- Three defects in one line: (a) `.hi-hide{display:none}` (confirmed in `keralaequipments-style.css`) — the consent block is invisible, so the always-open homepage lead form collects name/phone/email with **no visible consent or privacy link**; (b) the consent text names **ayurvedichealingvillage.com** — KTAHV template leak on an equipment site; (c) relative `privacy-policy.aspx` → `https://keralaequipments.com/privacy-policy.aspx` → **HTTP 404** (verified).
- Inner-page forms do show a visible checkbox ("…agree to Kairali Ayurvedic Group privacy & terms…") linking to `kairali.com/privacy-policy.aspx` (resolves 200; the free-consultation one uses `http://` — should be https). Whether the checkbox is actually enforced: NOT RUN (no submission).

### F4 — **H / https://keralaequipments.com/freeonlineconsultation.aspx** / Full medical-consultation form (KTAHV template import) collecting health data on an equipment site, reachable over plain http
- The page collects: Blood Pressure, Weight/Height, alcohol/drug/smoking dependence, "Present Health Problems", past history (hypertension/diabetes/surgery), pregnancy/lactation status, current medication, etc. (visible-text extract on file).
- This is sensitive personal + health data. The site serves identical content on **plain http with no redirect to https** (F5), so the form can be loaded and submitted in cleartext. No HSTS.
- Register question for Abilash + (medical content) Dr. Deepu John's lane: should an equipment brochure site host a doctor-consultation intake at all, or deep-link to the KTAHV/centers consultation instead? Flag, not a fix.

### F5 — **M / hosts & duplicates** / No http→https redirect, no host canonicalisation, JS-only canonical → 6+ duplicate URLs of the homepage
- Verified 19:16 IST: `http://keralaequipments.com/` → **200** (no redirect), `https://www.keralaequipments.com/` → **200**, `https://keralaequipments.com/` → 200 — all 37,621 bytes. Plus `/default.aspx` is a byte-identical duplicate of `/` (only the form action differs).
- No static `<link rel="canonical">`; instead the head script does `ramc.href = window.location.href` — a JS-injected self-canonical on every variant, useless for consolidation and invisible to non-JS crawl paths.
- All variants are `index, follow`. Result: http/https × www/non-www × `/`|`/default.aspx` all independently indexable.

### F6 — **M / site root** / robots.txt AND sitemap.xml both 404
- `https://keralaequipments.com/robots.txt` → HTTP 404 (IIS default error page); `https://keralaequipments.com/sitemap.xml` → HTTP 404. No crawl directives, no sitemap declared anywhere.

### F7 — **M / all 3 forms** / Broken client-side JS: email regex has lost its backslashes, and the submit buttons call an undefined function
- Served verbatim on `/`, `/enquirenow.aspx`, `/freeonlineconsultation.aspx`: `regexEmailValid.validationexpression = "w+([-+.]w+)*@w+([-.]w+)*.w+([-.]w+)*"` — the `\w` escapes were stripped (`\w+` → literal `w+`), so the validator's pattern matches only strings built from literal "w" characters; virtually every real email fails it.
- Every submit button: `onclick="return onbuttonClicked();WebForm_DoPostBackWithOptions(...)"` — `function onbuttonClicked` is **not defined anywhere in any served page** (grep = 0), so the handler throws a ReferenceError and the `WebForm_DoPostBackWithOptions` call (which carries the validation group "eqn") is unreachable dead code.
- Net runtime behaviour (whether validation silently no-ops or blocks all submissions) NOT RUN — submitting forms is prohibited in this pass. Either way both defects are real coding errors in the served JS and the lead funnel cannot be trusted until tested. The captcha (`turing.aspx`) is additionally generated on a **different host** (`media.kairali.com`, own ASP.NET session cookie observed) — whether its value can validate against the form's session is unverified.

### F8 — **M / homepage outbound links** / Broken money links: sister equipment site 500s, hero CTA 404s, blog card 404s
Checked 22 outbound links (GET, follow redirects, 19:20 IST):
- `http://www.kairaliequipment.com/` ("Spa Equipment" under Our Brands — the only equipment-catalog link on this equipment site) → **HTTP 500**.
- Hero slide #1 "Hand Sanitizer" CTA → `https://www.kairaliproducts.in/catalogsearch/result/?q=sanitizer` → **HTTP 404**. (Also a COVID-era leftover slide, off-topic for equipment.)
- Blog card #1 → `whyayurveda.org/.../kairali-ayurvedic-spa-now-in-dubai.aspx` (2014) → **HTTP 404**.
- `http://www.facebook.com/pages/Kairaliayurvedicgroup/114901512030869` → **400** (legacy /pages/ URL format; likely dead — browser verify needed, FB blocks curl); `http://twitter.com/Kairali_Group` → **520** (curl-blocked, unverified).
- `https://www.ayurvedichealingvillage.com/` → **403** = known WAF vs curl, not asserted broken.
- Remaining 16 links (kairalicenters, kairaliproducts .com/.in, kairali.guru, kairaliorganic, kairalitea, kairbykairali, usakairali, ayurvedafranchise, kairalihospitality, kairaliyoga, healing.recipes, youtube, linkedin, 2 other whyayurveda posts) → 200.

### F9 — **M / content defects** (each S alone, M in aggregate)
- Blog card #2: link href is the **Bangkok** article (`.../kairali-ayurvedic-treatment-centre-in-bangkok.aspx`) but its visible title reads "Kairali Ayurvedic Spa Now in Dubai !" — copy-paste error. Blog block's newest item is 2018 (others 2012/2014) under "Get our latest updates".
- About Us, first line: "Kerala **Equipmentss** is the most trusted…" — double-s typo in the company's own name.
- Template leaks from the training site, ×5 per page: logo `aria-label="Kairali Training"`, social link titles `title="Facebook: Kairali Training"` / Twitter / Youtube / Linkedin, hero image file `keralatraining-banner.jpg`.
- `<title>` of /enquirenow.aspx: "Information | Communication | Enquire Now | **| |** Enquire Form" — empty segment/double pipe, generic keyword-stuffed title.
- Marketing claim "We are the **only** organization that offers and delivers the most authentic Kerala Ayurveda and spa therapy Equipment" (About Us) — absolute claim, register review.
- Kairali Centre card: "**Cure** your ailments through Ayurveda with **No side effects**" — medical claim; flag to the medical sign-off lane (KTAHV banned-word lock does not apply to this domain, but cure/no-side-effects is an advertising-compliance risk).

### F10 — **M / SEO hygiene**
- **0 `<h1>`** on `/` and `/default.aspx` (section headings are divs/h2s). Inner pages have exactly 1 (pass).
- **JSON-LD: 0** on every page; og:/twitter meta: 0. No Organization/Product/LocalBusiness markup anywhere.
- An equipment-sales site with **zero product/catalog pages**: nav is Home / About(anchor) / Enquire / Free Consultation / Blog(anchor) / Brands(anchor) / Contact(anchor). Product names (Droni, Dhara, Pathi, Urlis, steam chamber…) exist only as one About paragraph; the only equipment link offsite 500s (F8). Rebuild-scope observation, recorded for the protection map.
- Meta descriptions present on all 3 unique pages (pass); viewport meta present (pass); no Lorem ipsum; no prices to expire.

### F11 — **S / headers & error pages** / Version disclosure + unbranded errors
- Response headers on every hit: `server: Microsoft-IIS/10.0`, `x-aspnet-version: 4.0.30319`, `x-powered-by: ASP.NET`, `x-powered-by-plesk: PleskWin`.
- `.aspx` 404s return the ASP.NET **developer** error page: "Server Error in '/' Application… Version Information: Microsoft .NET Framework Version:4.0.30319; ASP.NET Version:4.7.4136.0" (customErrors not configured). Static 404s return the raw IIS default page. Correct 404 status codes (no soft-200 — pass), but unbranded + version-leaking.
- No HSTS header.
- No Subresource Integrity on third-party assets: `maxcdn.bootstrapcdn.com` CSS, `cdnjs.cloudflare.com` font-awesome CSS, and the `chat.kairali.com/embed.min.js` script all lack `integrity`/`crossorigin` attributes (verbatim in served head/footer) — a CDN compromise would execute unchecked.
- Stylesheet served with `Expires: Sun, 30 Dec 2020` (already expired — cache-busting every hit).

### F12 — **S / UX note** / Chatbase widget force-opens itself
- Inline script simulates a click on `#chatbase-bubble-button` 5s after load on each of the first two pageviews per session (code verbatim in every page). Auto-popping chat twice is an annoyance pattern; behaviour itself NOT RUN (needs browser).

---

## NOT RUN (honest gaps)

1. **Browser/visual render checks** — mobile viewport render, confirmation that mixed-content blocking actually strips styling/JS (F1), slider/menu function, chat-widget behaviour (F12), hidden-consent visual confirmation (F3). Browser tools were off-limits this pass (shared pane).
2. **Form submission tests** — never submit (binding rule). So: server-side validation, captcha cross-host session validity, email delivery, and whether chkAgree is enforced are all **unverified**, not asserted.
3. **Facebook (400) and Twitter (520) link states** — both hosts bot-block curl; need a browser check before calling them dead.
4. **ayurvedichealingvillage.com 403** — WAF vs curl (expected); not retried beyond policy.
5. **Full crawl** — no sitemap exists and nav exposes only 3 unique pages; unlinked orphan .aspx pages (if any) were not discoverable and were not brute-forced.
6. **Lighthouse/perf, Search Console data, DNS/mail records** — out of scope for this pass.

---

## DISPOSITION / DELEGATION NOTES (findings only — no fixes applied)

- **Site class:** legacy ASP.NET WebForms on IIS/Plesk, not in the monorepo — a rebuild-wave candidate. Interim S-sized fixes below keep it honest until its wave.
- **Deepu (web exec), interim:** F1 http→https asset URLs in master page (one search-replace); F5 http→https + www 301s (host-level, **ask before touching server config per CLAUDE.md §3**); F6 add robots.txt + sitemap.xml; F3 unhide/fix consent block + point privacy link at the working kairali.com policy; F7 restore `\w` escapes + define/remove `onbuttonClicked`; F8 fix/remove dead hero CTA + Dubai blog link; F11 suppress version headers + custom error pages.
- **Anupam (copy):** F9 typo "Equipmentss", Bangkok/Dubai blog title swap, "Kairali Training" aria/title leaks, enquire-page title, footer year claim text (pending Abilash wording per PR #65: Group 1989 / lineage-since-1908 phrasing), remove "109 Years" frozen stat or make it computed.
- **Abilash (register review — decisions):** F4 whether the medical-consultation form belongs on this domain at all (with Dr. Deepu John for the medical-content angle); F9 "only organization" and "Cure… No side effects" claims; stats block numbers (20/25/700/300/40); whether keralaequipments.com vs kairaliequipment.com (currently 500) is the surviving equipment domain — duplicate-brand consolidation is a protection-map decision for the rebuild.

*Evidence artifacts (raw HTML captures, header dumps, link-check output) retained in session scratchpad `…/scratchpad/ke/` — not committed.*
