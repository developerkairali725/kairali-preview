# QA/QC audit — kairaliayurvedainstitute.com (LIVE ASP.NET WebForms brochure site, 3 pages)

- Audited: **2026-07-16 19:03:06 IST** (fetch window 18:56:41–19:03:06 IST)
- Auditor: factory QA pass (findings only, no fixes applied — CLAUDE.md §QA audit pass; D-TWO-LANE ruling 16 Jul 2026)
- Method: external raw-HTML capture via `curl` (desktop Chrome UA, `--max-time 20`), byte-level inspection + live-CSS verification. No browser tools used (pane shared with other agents — see NOT RUN). No form submitted, read-only GET/HEAD only.
- Stack: **not WordPress** — ASP.NET WebForms 4.0 on `Microsoft-IIS/10.0` + `PleskWin` (response headers), classic ViewState postback form, shared asset host `media.kairali.com`.
- Sample: the site's entire discoverable page inventory — menu exposes only 3 real URLs (`/`, `/enquirenow.aspx`, `/freeonlineconsultation.aspx`; all other nav items are same-page anchors). Fetched: `/`, `/default.aspx`, `/enquirenow.aspx`, `/freeonlineconsultation.aspx`, `/privacy-policy.aspx`, `/robots.txt`, `/sitemap.xml`, `/sitemap_index.xml`, 1 deliberate 404 probe, http→https and www-variant probes (4 host/scheme combos), the live stylesheet, 9 asset URLs (http+https variants), ~20 outbound links (GET, status only — rule r: content not acted upon).
- Triage context honoured: surfaced 16 Jul as "unexpected CONTENT: 200 … 'Since 1908' claim present; legacy UA-style analytics ID". Both confirmed below.

---

## SECURITY SCREEN: **CLEAN** (as of 2026-07-16 19:03 IST)

- Spam keywords (`casino|gambling|betting|poker|slot|viagra`): **0** on all 4 fetched HTML pages. No `<marquee>`.
- AI-directed / injection text (`ignore previous…`, `you are an AI/agent`, `system prompt`): **0**. Nothing in any fetched page addressed this auditor; nothing quarantined.
- Zero-width characters (U+200B/C/D): **0**. Obfuscated JS (`eval(`/`atob(`/`String.fromCharCode`): **0**.
- Outbound link inventory is all Kairali-family domains + whyayurveda.org (Kairali blog property) + Google/social/CDN boilerplate — no off-topic externals.
- Third-party JS: google-analytics.com/analytics.js, `chat.kairali.com/embed.min.js` (Chatbase widget, id `rpNt_uRW6W8EDiTf6AvYJ`, 200 over https), jQuery/slick from media.kairali.com + keralatraining.com (family domains). No unknown script hosts.
- 404 handling: `/qa-nonexistent-page-20260716.aspx` → real **HTTP 404** (no soft-200, no doorway).

---

## LOCKED-FACTS RESULT: **FAIL** (2 violations, sitewide)

- **FAIL / "Since 1908" — footer on ALL pages** / `/`, `/default.aspx`, `/enquirenow.aspx`, `/freeonlineconsultation.aspx` each carry `&copy; Kairali Ayurvedic Group Since 1908.` (copyright strip, 1× per page). **Violates the PR #65 ruling**: 1908 = family lineage only; the Group was founded 1989. Register review — Abilash rules the replacement wording; Deepu applies (one shared footer include on an ASP.NET master page — single edit).
- **FAIL / frozen rolling number — homepage stats strip** / `https://kairaliayurvedainstitute.com/` `<span>109</span> Years of Experience` — a typed constant: 1908+109 = 2017, i.e. frozen for ~9 years (and it compounds the 1908 claim). The same strip carries 5 more typed constants: `20` Distributors Worldwide, `25` Centers Worldwide, `700` Staff & Growing, `300` Products & Expanding, `40` Awards & Accreditations — all flagged per the rolling-values rule (must be computed or re-approved, not typed).
- **PASS / banned phone** / `+91 92898 38777` (all spacing variants, and bare `38777`): **0 occurrences** on every fetched page. The correct `…38797` also absent — expected, non-KTAHV site. Only phone on the site: `+91- 9555156156` (footer, Corporate Office Mehrauli). (Two other 10-digit grep hits were false positives inside a Facebook page-ID and a WebResource token — verified in context.)
- **PASS / contact email** / footer on all pages: `info@kairali.com` — matches the locked fact. No other public-facing mailbox found.

---

## Findings (severity-ranked, evidence-linked)

### H1 / sitewide / ACTIVE mixed content — the https site loads its CSS and JS over `http://`, which browsers block
- Evidence, `https://kairaliayurvedainstitute.com/` head + body: `<link rel="stylesheet" href="http://media.kairali.com/css/kairaliayurvedainstitute-style.css" />`, `http://media.kairali.com/slick/slick.css`, `http://media.kairali.com/slick/slick-theme.css`, `<script src='http://media.kairali.com/js/jQuery1.9.js'>`, `<script src="http://www.keralatraining.com/slick/slick.min.js">`. Inner pages: main stylesheet over http on both.
- Per the Mixed Content spec, stylesheets and scripts are **blockable** content: on the https origin, Chrome/Firefox/Safari refuse to load them. Code-level consequence: the https site renders **without its main stylesheet, without jQuery, and without the slider library** (slider dead, menu/enquire-panel JS dead). Not visually confirmed (NOT RUN — no browser), but the references and the blocking rule are facts.
- Also ~15 `http://media.kairali.com/...` image srcs on `/` (passive — auto-upgraded by modern browsers) incl. the favicon and the CAPTCHA image.
- **Fix is trivial and verified available**: every one of these assets answers **200 over https** (checked 18:59 IST: style.css, jQuery1.9.js, slick.min.js, turing.aspx, logo.png). A search-replace `http://` → `https://` (or protocol-relative) in the master page ends it. (Loading site JS from sister domain keralatraining.com is a further single-point-of-failure smell — same fix pass.)

### H2 / https://kairaliayurvedainstitute.com/ (homepage enquiry form) / consent is HIDDEN, names the WRONG site, and links to a 404
Three defects compounding on one control:
1. The consent block is `<div class="clearfix hi-hide"><input name="chkAgree" type="checkbox" …>` and the live stylesheet defines `.hi-hide,.maharaja-hide,.royal-hide{display:none}` (verified in `https://media.kairali.com/css/kairaliayurvedainstitute-style.css`, 18:59 IST) — **the privacy consent checkbox is invisible** on the homepage form.
2. Its label reads *"I have read and agree to **ayurvedichealingvillage.com** privacy & terms of use."* — wrong property named on kairaliayurvedainstitute.com (template copied from the KTAHV site).
3. The label link `href="privacy-policy.aspx"` → `https://kairaliayurvedainstitute.com/privacy-policy.aspx` = **HTTP 404** (3,886 bytes, verified 18:57 IST). The homepage form therefore has **no reachable privacy policy at all**.
- Contrast: the two inner form pages have a **visible** chkAgree checkbox correctly labelled "…agree to Kairali Ayurvedic Group privacy & terms of use" linking to `https://www.kairali.com/privacy-policy.aspx` = **200** (the freeonlineconsultation variant uses `http://www.kairali.com/…` = also lands 200 over https after redirect). The homepage is the broken one.
- Fix (S, Deepu): unhide the block, relabel to Kairali Ayurvedic Group, point at the kairali.com policy URL (https). A hidden gender radio (`rdogender`, also `hi-hide`) rides in the same form — remove or unhide deliberately.

### H3 / sitewide / analytics are DEAD — legacy Universal Analytics only, no GA4, no GTM
- Every page runs `ga('create', 'UA-51511979-1', 'kairaliayurvedainstitute.com')` via `analytics.js` (triage flag confirmed). Universal Analytics stopped processing hits in July 2023 (July 2024 for GA360) — **this site has recorded zero analytics for ~3 years**. Grep for `G-`/`GTM-` IDs across all pages: 0.
- Every enquiry/consultation lead since the sunset is invisible to measurement. Fix (S, Deepu): install the group GA4/GTM container; remove the dead snippet.

### H4 / https://kairaliayurvedainstitute.com/robots.txt + /sitemap.xml / both MISSING (HTTP 404)
- `robots.txt` → 404; `sitemap.xml` → 404; `sitemap_index.xml` → 404 (all verified 18:57 IST). No crawl directives, no sitemap declared anywhere. Fix (S): minimal robots.txt with a `Sitemap:` line + a 3-URL sitemap. (Per CLAUDE.md gate 3, robots.txt changes need Abilash's ask-first — flagging, not fixing.)

### M1 / sitewide / canonicals are JavaScript-injected self-references → 3-way duplicate homepage, no host canonicalization
- No static `<link rel="canonical">` on any page (grep: 0). Instead the GA snippet does `ramc.href = window.location.href; document.head.appendChild(ramc)` — a JS-injected canonical that always points at whatever URL was loaded, i.e. it can never consolidate duplicates, and Google only sees it on render.
- Duplicates verified: `https://www.kairaliayurvedainstitute.com/` → **200**, byte-identical size to non-www (38,114 bytes; no redirect between hosts); `/default.aspx` → **200**, identical body except the form action (diff run 19:00 IST); the header logo links to `http://www.kairaliayurvedainstitute.com/`, actively feeding the www variant. http→https 301s exist (verified) but www↔non-www does not. All pages `index, follow`.
- Fix (S, Deepu): pick one host, 301 the other; emit a real server-side canonical; make the logo link relative.

### M2 / https://kairaliayurvedainstitute.com/ / broken + stale outbound links on prime real estate
- **Hero slide 1** is "Hand Sanitizer" (a COVID-era banner as the first thing on an *institute* site) and its CTA `https://www.kairaliproducts.in/catalogsearch/result/?q=sanitizer` → **404** (verified 19:00 IST).
- **Blog card 1** `http://www.whyayurveda.org/treatment-center/2014/06/23/kairali-ayurvedic-spa-now-in-dubai.aspx` → **404**.
- **Blog card 2** links to the Bangkok post (200) but its visible title is a copy-paste of card 1: *"Kairali Ayurvedic Spa Now in Dubai !"* — wrong title on a working link.
- **Our Brands** link `http://www.kairaliequipment.com/` → **500** (server error, verified).
- Facebook (`facebook.com/pages/Kairaliayurvedicgroup/114901512030869` → 400) and Twitter (`twitter.com/Kairali_Group` → 500) responses are consistent with bot-blocking — **unverified**, listed for a human click-check, not asserted dead. YouTube + LinkedIn → 200.

### M3 / https://kairaliayurvedainstitute.com/ / zero `<h1>` on the homepage
- h1 count: `/` = 0 (top heading is `<h2>Enquire Now`); `/enquirenow.aspx` = 1; `/freeonlineconsultation.aspx` = 1. Fix (S): make the About/brand headline the h1.

### M4-verify / enquiry + consultation forms / CAPTCHA image served from a DIFFERENT host than the validating server
- All three forms use `<img src="http://media.kairali.com/images/turing.aspx" … class="turingcode">` — a dynamic .aspx (content-type `image/Jpeg`, verified) generating the security code on `media.kairali.com`, while the form posts to `kairaliayurvedainstitute.com`. Unless the code is shared via a common DB, the validating host cannot know what the image said — **the form may be un-submittable**. Cannot verify externally (forms are never submitted per binding rules). Flag for Deepu to test a real submission end-to-end; a dead lead form on both lead pages would be the site's single worst defect if confirmed.

### S1 / meta/SEO hygiene (bundle)
- **No JSON-LD anywhere** (grep: 0 on all pages) — not even Organization. No og: / twitter: tags (0). `meta keywords` tag present (obsolete, harmless).
- `/enquirenow.aspx` title is keyword-stuffed boilerplate: `Enquire Now | Information | Enquiry Form | Communication`.
- Homepage meta description ~250 chars — will truncate in SERPs.
- No hreflang (single-locale legacy — note only).

### S2 / response-header hygiene
- No `Strict-Transport-Security`, no `X-Content-Type-Options`; version disclosure: `server: Microsoft-IIS/10.0`, `x-aspnet-version: 4.0.30319`, `x-powered-by: ASP.NET`, `x-powered-by-plesk: PleskWin`. Session cookie is `HttpOnly; SameSite=Lax` but **not `Secure`**. Fix (S, Sunaj/Plesk): HSTS + nosniff + strip version headers + Secure flag.
- Third-party CDN tags (`maxcdn.bootstrapcdn.com` bootstrap 3.4.0 CSS, `cdnjs.cloudflare.com` font-awesome 4.7.0, `chat.kairali.com/embed.min.js`) carry **no Subresource Integrity** (`integrity=`/`crossorigin=` grep: 0 on all pages) — a CDN compromise would execute in-page. Fix (S): add SRI hashes where the resource is version-pinned (bundle with the H1 https pass).

### S3 / https://kairaliayurvedainstitute.com/<any-missing-url> / 404 page is the raw ASP.NET framework error page
- "The resource cannot be found." — default unbranded ASP.NET error (Verdana/red-heading page), 3,914 bytes. Correct 404 status (good), but users hitting the dead `privacy-policy.aspx` link see a developer error page. Fix (S): custom error page in web.config.

### S4 / content typos (note)
- Country dropdown on both form pages: "Antartica" (sic), "Czeck Republic" (sic), "Burma" (dated). About copy: "to be a Ayurvedic Panchakarma Therapist" (grammar). Chatbase widget force-opens itself 5s after each of the first two page loads (`chatbase-bubble-button").click()`) — intrusive, register-review call, not a defect per se.

Finding count: **1 security screen (CLEAN) · locked facts FAIL (2 violations, 2 passes) · 4 H · 4 M (1 M-verify) · 4 S bundles**.

---

## NOT RUN (honest list)

- **Mobile/visual render checks** — no browser/Playwright used (single shared pane, other agents running per task rules). Specifically: the H1 mixed-content blocking consequence (unstyled/JS-dead https render) is asserted from code + spec, **not observed**; slider, menu toggle, Chatbase auto-open behaviour unobserved.
- **Form submission / CAPTCHA validation** — never submitted (binding rule). M4-verify stands as unverified either way.
- **Facebook/Twitter link liveness** — curl responses (400/500) look like bot-blocks; needs a human click.
- **WAF check** — n/a, site answered curl directly (no 403s).
- **Lighthouse/perf, Search Console data, DNS/TLS-cert inspection, media.kairali.com asset audit beyond the 9 URLs checked** — out of this pass's scope.
- Any page not reachable from the 3-page menu (none discovered; no sitemap exists to enumerate more).

---

## DELEGATION SPLIT (draft — no fixes applied in this pass)

**Deepu (ASP.NET/Plesk tech):**
1. `http://`→`https://` for all CSS/JS/img refs in the master page (H1 — assets already live on https).
2. Homepage consent block: unhide, relabel to Kairali Ayurvedic Group, link `https://www.kairali.com/privacy-policy.aspx`; remove/unhide the hidden gender radio (H2).
3. Install GA4/GTM, remove dead UA-51511979-1 (H3).
4. robots.txt + 3-URL sitemap.xml (H4 — **gate 3: ask Abilash before touching robots.txt**).
5. www↔non-www 301 + server-side canonical + relative logo link (M1).
6. Retire the sanitizer hero slide; fix/remove the 2 broken blog/brand links; fix blog-card-2 title (M2).
7. Add an h1 to the homepage (M3).
8. **Test a real enquiry submission end-to-end (CAPTCHA cross-host, M4-verify)** — highest-value single check.
9. Custom 404 page; HSTS/nosniff/version-header cleanup with Sunaj (S2/S3).

**Anupam (copy):** country-list typos, About grammar, blog card title (S4/M2).

**Abilash (register review — decisions):**
1. "Since 1908" footer replacement wording (PR #65 ruling applies) + what the stats strip may claim ("109 Years", "25 Centers", etc. — recompute or drop).
2. Whether this 3-page brochure site stays live as-is until its rebuild wave, given H1–H3 (a Wave-order call, not a QA call).
3. Chatbase auto-open behaviour: keep or calm.

*Evidence artifacts (raw HTML, headers, CSS, link-check output) retained in session scratchpad `…/scratchpad/kai/` — not committed.*
