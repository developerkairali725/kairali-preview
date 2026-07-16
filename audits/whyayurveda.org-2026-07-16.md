# QA/QC audit — whyayurveda.org (LIVE WordPress, central blog ~2,262 posts)

- Audited: **2026-07-16 18:39:26 IST** (fetch window 18:25:50–18:39:26 IST)
- Auditor: factory QA pass (findings only, no fixes applied — CLAUDE.md §QA audit pass, D-TWO-LANE 16 Jul 2026)
- Method: external raw-HTML capture via `curl` (desktop Chrome UA, `--max-time 20`), byte-level inspection. Read-only GET/HEAD only — no POSTs, no form submissions. No browser tools used (pane shared with other agents).
- Sample: 17 HTML URLs fetched — `/`, `/about-us/`, `/contact-us/`, `/contact/`, `/category/doctor-profile/`, `/category/kairali-ayurveda-group/`, `/about-dr-ashikha-raj/`, `/about-dr-deepu-john/`, `/author/drashikaraj/`, posts spanning 1992→2026 lastmods (`/kairali-ayurvedic-centre-featured-in-first-city-delhis-no-1-city-magazine/`, `/spices-in-daily-diet-for-a-healthy-heart/`, `/achieving-holistic-wellness-how-long-should-panchakarma-be/`, `/youre-doing-yoga-wrong-unless-its-based-on-your-dosha/`, `/yoga-pose-for-core-strength/`), yoga page `/surya-namaskar/`, one 404 probe — plus `robots.txt`, `sitemap_index.xml` + all 5 child sitemaps (2,313 URLs), `/feed/`, xmlrpc GET probe, http/www redirect probes, 107 internal-link HEAD sample, 6 social-link probes.
- Context honoured: mined 15 Jul (~2,261 posts — sitemap now counts 2,262 post URLs, consistent); Site Kit by Google 1.181.0 confirmed in `<meta name="generator">`; the known "Dr. Ashika vs Ashikha Raj" Yoast contradiction was hunted and **evidenced** (finding #1).
- Stack observed: WordPress behind Cloudflare (APO, `cf-edge-cache: cache,platform=wordpress`), Yoast SEO Premium v27.9, Elementor 4.1.4, WP-Optimize page cache + minify, Contact Form 7 (+ cf7mls multistep), Site Kit 1.181.0, MonsterInsights 10.2.2, Microsoft Clarity, reCAPTCHA v3. HTTP/2, valid https, http→https and www→apex both 301 (verified 18:33 IST).

---

## SECURITY / INJECTION SCREEN: CLEAN (as of 2026-07-16 18:39 IST)

- Spam keywords (`casino|gambling|betting|poker|viagra|slot`): 0 across all sampled pages, sitemaps, robots.txt.
- `<marquee>`: 0. Hidden zero-width characters: only 2 benign U+200B inside a visible heading on `/surya-namaskar/` ("KAPHA DOSHA​") — content typo, not hidden text (noted in hygiene).
- Prompt-injection screen (rule r): no text addressing AI/agents ("ignore previous…", "you are an AI…", etc.) found in any fetched page or feed. robots.txt explicitly ALLOWS AI crawlers (GPTBot, ClaudeBot, PerplexityBot, CCBot etc.) — that is a directive block, not agent-addressed content; appears deliberate (AEO stance), no action.
- External scripts: googletagmanager (GT-P8422KTT, G-70BLLK1V5L), google.com/recaptcha, clarity.ms only. No unknown script hosts, no injected iframes.
- 404 handling correct: `/qa-nonexistent-probe-20260716/` → HTTP 404, themed "Page not found" page (no soft-200 doorway).
- All 2,313 sitemap `<loc>` URLs are on-domain `https://whyayurveda.org/…`; no spam slugs.
- WordPress core generator meta: absent (good). Elementor + Site Kit generator metas present (minor disclosure, S — see hygiene #10).
- `xmlrpc.php`: robots.txt disallows it; GET returns HTTP 200 with **empty body** (0 bytes, 18:36 IST) — looks neutered/filtered, but POST behaviour untested (read-only audit). Sunaj to confirm it is actually blocked for POST, given the fleet's recent compromise history.

---

## LOCKED-FACTS RESULT: **FAIL — 1 sitewide violation, 2 pass, 1 flag**

1. **FAIL / "Since 1908" attached to the GROUP — sitewide footer, every page (×2 per page, all 17 sampled incl. the 404 page).** Exact footer text: `© 2021 Whyayurveda. All rights reserved Kairali Ayurvedic Group Since 1908.` (e.g. https://whyayurveda.org/ raw HTML, two occurrences: mobile-menu copy + footer copy). Per PR #65 ruling: 1908 = family lineage only; the Group was founded 1989 — this line asserts the Group is "Since 1908". Same line also freezes the copyright year at **"© 2021"** (frozen rolling value — must be computed). One theme-footer edit fixes ~2,330 URLs.
2. **PASS / WhatsApp number.** Chat widget (Chatway) uses `"value":"919289838797"` with popup headline "Priya Sharma" and `web.whatsapp.com/send?phone=919289838797` — the CORRECT …38797 on every sampled page. The banned `+91 92898 38777` / `9289838777`: **0 occurrences** in all sampled HTML, sitemaps, feed (all spacing variants grepped).
3. **PASS / public contact email.** `info@kairali.com` present on https://whyayurveda.org/contact-us/ (×2, Cloudflare email-protection links with `aria-label="info@kairali.com"`). No other public mailbox found on sampled pages (the `claudebot@anthropic.com` / `bot@ibou.io` grep hits are crawler UA strings leaked by the page cache — see finding #3, not contact emails).
4. **FLAG / typed rolling numbers.** Doctor bios carry frozen experience claims: "12+ Years of Clinical Experience" (Dr. Deepu John, https://whyayurveda.org/about-dr-deepu-john/), "8+ Years of Clinical Experience" (https://whyayurveda.org/about-dr-ashikha-raj/ og:description + body), "7+ Years of Experience". These are typed, not computed — they will silently go stale (rolling-number rule). No "115+ years"-class group claims found in the sample.

---

## Findings (severity-ranked, evidence-linked)

1. **M / physician identity contradiction — "Dr. Ashika Raj" vs "Dr. Ashikha Raj" (context brief CONFIRMED, exact URLs found).**
   - https://whyayurveda.org/author/drashikaraj/ — **a single Yoast JSON-LD block contradicts itself**: the Person node is `"name":"Dr. Ashika Raj"` with image `"caption":"Dr. Ashika Raj"` but its own `"description":"Dr. Ashikha Raj is a dedicated Ayurvedic physician and Resident Medical Officer (RMO) at Kairali – The Ayurvedic Healing Village…"`. Page `<title>Dr. Ashika Raj, Author at Why Ayurveda</title>`; body counts: "Dr. Ashika Raj" ×31, "Dr. Ashikha Raj" ×2.
   - https://whyayurveda.org/about-dr-ashikha-raj/ — `<title>`, H1, og:title and body all say "Dr. **Ashikha** Raj", while the byline widget on the same page renders the WP display name "Dr. **Ashika** Raj" (`<a href="https://whyayurveda.org/author/drashikaraj/" rel="author">Dr. Ashika Raj</a>`).
   - The "Ashika" byline propagates to every post she authors (homepage recent-posts list shows it ×9). Third variant in the evidence trail: her profile image file is `…/2025/08/anshika.webp` ("Anshika").
   - Why it matters: E-E-A-T author schema for a medical site with two spellings of the physician's name in one schema graph. Fix path (register review first — which spelling is on her BAMS registration?): correct the WP user display name OR the bio page, then Yoast regenerates. **Clinical-adjacent: flag to Dr. Deepu John / Abilash for the authoritative spelling before anyone edits.**

2. **M / analytics triple-stack with a mismatched hand-pasted snippet — sitewide (all 17 sampled pages identical).**
   - Site Kit outputs `gtag/js?id=GT-P8422KTT` + `gtag("config","GT-P8422KTT")`.
   - A hand-pasted "Google tag (gtag.js)" snippet loads `gtag/js?id=G-70BLLK1V5L` **but then configures a different ID**: `gtag('config','G-H4VX4E2ER1')` — exact quote from `/` raw HTML: `<script async src="https://www.googletagmanager.com/gtag/js?id=G-70BLLK1V5L"></script> <script>…gtag('config', 'G-H4VX4E2ER1');</script>`. Consequence: property G-70BLLK1V5L is loaded but never configured (likely receives no data), while G-H4VX4E2ER1 gets configured here **and** by MonsterInsights 10.2.2 (`"v4_id":"G-H4VX4E2ER1"`) — double pageview risk on the main property.
   - Microsoft Clarity snippet also present (expected — Clarity MCP exists for the fleet).
   - Fix (S, Deepu + Abilash decide the canonical property): remove the hand-pasted snippet, keep ONE pipeline (Site Kit or MonsterInsights), verify realtime counts halve. No dead UA-xxxx tags found (MonsterInsights outputs a legacy `__gaTracker` no-op shim only).

3. **M / WP-Optimize page cache serves bot-primed HTML and leaks the priming visitor's user-agent into every page (~27 script blocks/page).**
   - Every sampled page embeds `var wpo_server_info_css = {"user_agent":"<UA of whoever primed the cache>"}` — observed values include `Googlebot/2.1` (on /about-dr-deepu-john/ and the 1992 press post), `bingbot/2.0` (on `/` and the newest post), `AhrefsBot/7.0`, `AhrefsSiteAudit/6.1`, `MJ12bot`, `ClaudeBot/1.0; +claudebot@anthropic.com` (×27 on /spices-in-daily-diet-for-a-healthy-heart/), `IbouBot/1.0; +bot@ibou.io` (×27 on /about-dr-ashikha-raj/), plus assorted human Chrome UAs.
   - Impact: WP-Optimize's async-CSS decision is computed from a bot's UA and then served to all visitors from cache; crawler UA strings/bot emails are shipped in public HTML; ~27 duplicated inline blocks bloat every page. It also proves cache variants are mostly bot-primed. Fix (Deepu): disable WPO "load CSS asynchronously" UA embedding or exclude the `wpo_server_info_css` feature; purge cache after.

4. **M / meta descriptions missing on most of the ~2,262 posts (sample: 6 of 8 posts, both doctor-bio posts, both category pages, author archive).** Missing on: `/kairali-ayurvedic-centre-featured-in-first-city-delhis-no-1-city-magazine/`, `/spices-in-daily-diet-for-a-healthy-heart/`, `/achieving-holistic-wellness-how-long-should-panchakarma-be/`, `/youre-doing-yoga-wrong-unless-its-based-on-your-dosha/`, `/about-dr-ashikha-raj/`, `/about-dr-deepu-john/`, `/category/doctor-profile/`, `/category/kairali-ayurveda-group/`, `/author/drashikaraj/`. Present on: home, /about-us/, /contact-us/, and the two 2026 pages sampled (`/yoga-pose-for-core-strength/`, `/surya-namaskar/`) — i.e. new content gets descriptions, the archive does not. Fix: bulk-writing 2k descriptions is rebuild/strategy scope — the S-sized move is descriptions for the ~20 highest-traffic legacy posts (Search Console ranks them) + the 16 category pages.

5. **M / duplicate live contact pages, both indexable, both in the sitemap.** https://whyayurveda.org/contact-us/ (`<title>Contact Us - Whyayurveda</title>`, canonical self) AND https://whyayurveda.org/contact/ (`<title>Contact - Why Ayurveda</title>`, canonical self, HTTP 200, same CF7 form `wpcf7-f7007`). Both listed in page-sitemap.xml. Competing duplicates for the money query "kairali contact". Fix (Deepu, needs Abilash pick of survivor): 301 one to the other + drop from sitemap.

6. **S→M / og:title on the homepage is "Home page".** Exact: `<meta property="og:title" content="Home page" />` on https://whyayurveda.org/ (the `<title>` itself is fine: "WhyAyurveda by Kairali – The Ayurvedic Healing Village"). Every social/WhatsApp share of the site's front door is captioned "Home page". Fix (S): set Yoast social title for the front page.

7. **S / sitemap `<lastmod>` values are impossible (pre-web).** 6 post URLs carry lastmods 1992–1995, e.g. `1992-09-10` on `/kairali-ayurvedic-centre-featured-in-first-city-delhis-no-1-city-magazine/`, `1995-12-04` on `/the-times-of-india-recommends-kairali-ayurvedic-health-club-for-the-best-kerala-massage-in-delhi/` (post-sitemap.xml). Press-clipping posts were backdated to magazine publication dates; a 1992 lastmod predates the site and tells Google the lastmod signal is unreliable. Fix (S): correct the 6 post dates or let Yoast emit real modified dates.

8. **S / heading hygiene: 0 `<h1>` on key pages.** `/about-us/`, `/contact-us/`, `/contact/`, `/category/doctor-profile/`, `/category/kairali-ayurveda-group/`, `/author/drashikaraj/`, `/surya-namaskar/` all render zero h1 (posts are fine — exactly one each in the 8-post sample). Fix (S): theme/Elementor heading-level edits.

9. **S / legacy post titles are pipe-stuffed keyword strings.** e.g. `<title>First City Magazine | Kairali Ayurvedic Centre | Benefits of Oil Treatments | Ayurvedic Health - Why Ayurveda</title>` (1992 press post), `Spices Diet | Healthy Heart | Modern Medicinal Science | Ayurvedic and Unani Medicines - Why Ayurveda` (2015 post). Pattern appears confined to the older archive; 2024–2026 titles are clean sentences. Bulk retitle = rebuild scope; noted for the protection map.

10. **S / small hygiene batch.**
    - Footer LinkedIn link is `http://` (not https): `href="http://www.linkedin.com/company/kairali-ayurvedic-group"` ×3 per page, sitewide. (No true mixed content anywhere — zero `src="http://…"` across all 17 pages.)
    - `<meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1">` — `maximum-scale=1` blocks pinch-zoom (accessibility, Lighthouse flag), sitewide.
    - Elementor + Site Kit `generator` metas disclose versions (WP core generator already removed).
    - U+200B zero-width space ×2 inside the visible "KAPHA DOSHA" heading on /surya-namaskar/.
    - robots.txt begins with a UTF-8 BOM (`﻿` before `User-agent`) — Google tolerates it; other parsers may not. Cosmetic.
    - `/refund_returns/` (underscore slug, WooCommerce default) sits in the page sitemap alongside robots-disallowed `/cart/`, `/checkout/`, `/my-account/` — dormant Woo scaffolding on a blog; tidy at rebuild.

11. **M (register review — Abilash; no copy delegated) / KTAHV-describing "resort/spa" language on the KTAHV-branded blog.** The site masthead is "WhyAyurveda by Kairali – The Ayurvedic Healing Village" (KTAHV branding), and the archive contains posts describing KTAHV itself in banned register, e.g. slugs `best-ayurvedic-resort-in-kerala-kairali-the-ayurvedic-healing-village`, `post-pregnancy-health-program-at-kairali-rejuvenate-and-restore-at-the-best-ayurvedic-resort-in-kerala`, `the-ayurvedic-healing-village-awarded-best-ayurvedic-health-resort-2010-…`; sampled post `/achieving-holistic-wellness-how-long-should-panchakarma-be/` renders spa×5 / luxury×4 / journey×5 / guests×3 (mostly sidebar widgets: Villa Raag Goa posts — where the register is ALLOWED — and the proper noun "World Spa Awards"). The CLAUDE.md lock binds KTAHV pages only, and this blog spans all three entities, so this is a **scope ruling needed from Abilash**: does the GST language lock extend to KTAHV-describing posts on whyayurveda.org? Counts and URLs supplied; nothing changed.

12. **NOTE (rebuild-scope, skip) / schema & register-adjacent observations.** Doctor bio posts carry Article schema authored by staff (`"author":{"name":"Roshni A John"}` on the Ashikha bio, `Vikash Jha` on Dr. Deepu John's) rather than Person/Physician schema about the doctor — E-E-A-T upgrade is rebuild scope. Physician-authored posts confirmed working (e.g. `/yoga-pose-for-core-strength/` → `"author":{"name":"Dr. Rahul R"}`). No hreflang anywhere (single-locale blog — expected). Homepage title/brand vs `/about-us/` meta ("it's a lifestyle blog as well as a herbal blog") — brand-positioning inconsistency for the rebuild brief.

### PASS list
- **Broken links:** 107 unique internal links harvested from home + newest post + contact + category, all HEAD-checked 18:34–18:37 IST: **107×200, zero 4xx/5xx**.
- **Redirect/HTTPS posture:** http→https 301, www→apex 301, HTTP/2, CSP `upgrade-insecure-requests` header present.
- **robots.txt + sitemaps:** `Sitemap:` directive present; index + 5 children parse as valid XML; 2,262 posts + 51 pages + 16 categories all on-domain.
- **Forms (render-only):** CF7 contact form renders on /contact-us/ with honeypot + Akismet + reCAPTCHA v3 and a required-style acceptance `I consent to the terms and conditions` (class has no `optional`); privacy link https://whyayurveda.org/privacy-policy/ present; /privacy-policy/, /cookie-policy/, /medical-disclaimer/ all live (HEAD 200). Gap: the 26-input multistep enquiry form (`wpcf7-f7996`) has **no consent checkbox** — same class of gap as kairalicenters (GDPR/DPDP, interim S-fix possible).
- **RSS:** /feed/ valid RSS2, 10 items, newest content.
- **404 probe:** correct 404 + themed page.
- **Social links:** 6 footer profiles resolve — twitter/instagram/pinterest/youtube/linkedin 200; facebook returned 400 to curl (platform anti-bot — **inconclusive, not verified dead**; manual click-check needed).

Finding count: **1 locked-facts FAIL (sitewide) + 1 rolling-number flag · 5 M · 5 S(-batches) · 1 M register-review · 2 rebuild-scope notes · 7 passes**.

---

## NOT RUN (honest list)
- Mobile/visual render checks, viewport screenshots, CLS/LCP — no browser tools this pass (pane shared; curl-only audit).
- JS-executed behaviour: GA4/Clarity events actually firing, chat widget runtime, form validation UX — raw HTML only.
- Form submissions — never submitted (rule: render-only).
- xmlrpc POST probe — read-only audit; GET showed empty 200, POST unverified.
- Full 2,262-post crawl — 8-post + 2-bio + 2-category sample only; title/description/lastmod claims are sample-based extrapolations except where a sitewide mechanism (footer, head template) makes them sitewide by construction.
- Facebook profile liveness (400 to curl — platform block, inconclusive).
- Search Console / GA data pulls (which legacy posts deserve the first 20 meta descriptions) — needs Abilash's account access.
- Lighthouse/performance scoring — out of audit scope this pass.

## DELEGATION SPLIT (draft — findings only, nothing executed)
- **Abilash (register/ruling):** #1 authoritative spelling Ashika vs Ashikha (with Dr. Deepu John); #11 does the KTAHV language lock extend to KTAHV-describing blog posts here; #2 which GA4 property is canonical; #5 which contact page survives.
- **Deepu (WP tech):** #1 (after ruling) fix WP display name/bio; #2 remove duplicate gtag snippet; #3 WPO async-CSS/UA-leak setting + cache purge; #5 301 the losing contact page; #6 Yoast front-page social title; #7 six impossible post dates; #8 h1s; #10 batch (https LinkedIn URL, viewport, BOM, ZWSP, generator metas); consent checkbox on the multistep form (interim).
- **Anupam (copy):** footer line — replace `© 2021 … Kairali Ayurvedic Group Since 1908.` with computed year + PR#65-compliant lineage wording (one theme setting, fixes every page); doctor-bio experience years → computed or dated ("as of 2026").
- **Sunaj (security/infra):** confirm xmlrpc.php POST is actually blocked (GET=empty 200 observed); no other security action needed — screen CLEAN.

*Evidence artifacts (raw HTML captures ×17, sitemap dumps, headcheck outputs) retained in session scratchpad `…/scratchpad/wa/` — not committed.*
