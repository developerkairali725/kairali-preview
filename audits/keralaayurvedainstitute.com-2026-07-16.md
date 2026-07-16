# QA/QC audit — keralaayurvedainstitute.com (LIVE legacy ASP.NET WebForms one-pager, group education/brand site)

- Audited: **2026-07-16 19:19:51 IST** (fetch window 19:13:19–19:19:51 IST)
- Auditor: factory QA pass (findings only, no fixes applied — CLAUDE.md §QA audit pass; D-TWO-LANE 16 Jul 2026)
- Method: external raw-HTML capture via `curl` (desktop Chrome UA, `--max-time 20`), byte-level inspection. Read-only GET/HEAD only; no form submitted. WebFetch not needed — curl was never blocked on this domain.
- Stack: Microsoft-IIS/10.0 + ASP.NET 4.0.30319 behind Plesk (`X-Powered-By-Plesk: PleskWin`); shared asset host `media.kairali.com`.
- Sample: `/`, `/default.aspx`, `/enquirenow.aspx`, `/freeonlineconsultation.aspx`, `/privacy-policy.aspx` (404), `/robots.txt` (404), `/sitemap.xml` + `/sitemap_index.xml` (404), one deliberate 404 probe, all 4 host variants (http/https × apex/www), the shared CSS file, plus 20 outbound-link HEAD/GET checks. The nav exposes only 3 real pages — this is effectively a 3-page site; no sitemap exists to enumerate more.
- Triage context honoured: surfaced as unexpected CONTENT 200 with footer "Kairali Ayurvedic Group Since 1908".

---

## SECURITY/COMPROMISE SCREEN: **CLEAN** (as of 2026-07-16 19:18 IST)

- Spam keywords (`casino|gambling|betting|poker|viagra|escort`), `<marquee>`: 0 hits on all 4 sampled pages.
- Zero-width characters (U+200B/C/D): 0. `eval(`/`atob(`/`String.fromCharCode`: 0.
- Outbound href inventory (home): only Kairali-family domains + whyayurveda.org + Google/CDN/social boilerplate — no off-topic outbounds.
- Rule-r injection screen: no text addressing AI/agents in any fetched content. Nothing quarantined.

---

## LOCKED-FACTS RESULT: **FAIL**

| Fact | Verdict | Evidence |
|---|---|---|
| "Since 1908" attached to Group | **FAIL — sitewide** | Footer on every sampled page: `&copy; Kairali Ayurvedic Group Since 1908.` (home line ~550; also enquirenow.aspx, freeonlineconsultation.aspx, default.aspx). Group founded 1989 — PR #65 ruling. |
| Frozen rolling number | **FAIL** | Home stats strip: `<span>109</span> Years of Experience`. 2026−1908=118 even on the (itself-wrong) lineage math → the counter was typed ~2017 and frozen; from Group founding 1989 the true figure is 37. Neighbouring stats (`25 Centers Worldwide`, `700 Staff`, `40 Awards`) are also hard-typed — unverifiable, likely stale. |
| Public contact email = info@kairali.com | **PASS** | Footer on all sampled pages: `Email: info@kairali.com` (only email on site). |
| Banned phone +91 92898 38777 | **PASS (absent)** | 0 occurrences of 38777 in any spacing variant; …38797 also absent (site is not KTAHV; footer phone is `+91- 9555156156`). Nothing to scrub. |

---

## Findings (severity-ranked, evidence-linked)

### HIGH

1. **H / https-served pages hard-block their own CSS and JS (active mixed content) — the https site is broken in modern browsers.** All site styling and scripting is hardcoded `http://`: `http://media.kairali.com/slick/slick.css`, `slick-theme.css`, `css/keralaayurvedainstitute-style.css` (head lines 17–22), `js/jQuery1.9.js` + `slick/slick.min.js` (pre-footer), favicon, and every `media.kairali.com` image (62 `http://` src/href refs on home, 11 on enquirenow, 12 on consultation). Browsers block active mixed content (stylesheets/scripts) on https pages → on `https://keralaayurvedainstitute.com/` the page renders unstyled with dead sliders/menu/enquire-form JS. Images auto-upgrade in current Chrome/Firefox, but jQuery1.9 + slick + the theme CSS do not. The asset host DOES serve https (verified: `https://media.kairali.com/css/keralaayurvedainstitute-style.css` → HTTP 200, 57,110 bytes) — the breakage is purely the hardcoded protocol. *Visual confirmation NOT RUN (no browser this pass) — blocking behaviour asserted from the mixed-content spec, not observed.*

2. **H / no https enforcement + no canonical host — 4 duplicate live sites, and a medical-history form reachable over cleartext http.** `http://keralaayurvedainstitute.com/`, `http://www.…/`, `https://www.…/`, `https://…/` all return HTTP 200 (37,619 bytes each) with zero redirects and no HSTS (security-header grep on response headers: 0 hits). `/freeonlineconsultation.aspx` collects sensitive health data — "Present Health Problems*", past history (hypertension/diabetes/surgery), medication, "Pregnant/Lactation", "Planning for Pregnancy in next 6 Months" — and on the http variants that data would POST unencrypted. (Form render-checked only; never submitted.)

3. **H / verbose ASP.NET errors exposed to the public (`customErrors mode="Off"`).** The 404 probe `/qa-nonexistent-probe-20260716.aspx` returns the raw "Server Error in '/' Application" developer page containing a full `[HttpException]` stack trace in an HTML comment, framework versions ("Microsoft .NET Framework Version:4.0.30319; ASP.NET Version:4.7.4136.0"), and ASP.NET's own embedded warning: "This error page might contain sensitive information because ASP.NET is configured to show verbose error messages using &lt;customErrors mode=\"Off\"/&gt;". Any runtime exception on this box dumps internals to visitors. Also: no branded 404 (status code itself is correctly 404).

4. **H / analytics are dead — the site has recorded nothing for ~3 years.** Only tracking on all pages is legacy Universal Analytics via `analytics.js`: `ga('create', 'UA-51315790-1', 'keralaayurvedainstitute.com')` (head inline script, every sampled page). UA stopped processing hits July 2023 (properties fully shut down July 2024). No GA4 `G-` tag, no GTM (grep `gtag(|googletagmanager|G-[A-Z0-9]{8,}` → 0 on all pages).

5. **H / consent + privacy chain is broken on the homepage form.** The homepage enquiry form's consent block is hidden by CSS — markup `<div class="clearfix hi-hide"><input name="chkAgree" type="checkbox"…` (home line ~200) with `.hi-hide{display:none}` confirmed in keralaayurvedainstitute-style.css — so visitors see NO consent line at all. The hidden text names the wrong site ("I have read and agree to **ayurvedichealingvillage.com** privacy & terms of use") and links to local `privacy-policy.aspx`, which is **HTTP 404** on this domain. Inner pages (enquirenow, consultation) show a visible consent line correctly branded "Kairali Ayurvedic Group" linking to `kairali.com/privacy-policy.aspx` (verified HTTP 200) — but `chkAgree` has no validator anywhere (validator inventory in page JS covers name/phone/email/message/captcha only), so consent is never enforced, including on the health-data form. Consultation page's privacy link is also `http://` (enquirenow uses `https://`).

### MEDIUM

6. **M / robots.txt and sitemap.xml both missing (HTTP 404).** No crawl directives, no sitemap anywhere (sitemap_index.xml also 404). Combined with finding 7, Google is left to guess among duplicate URLs.

7. **M / canonical is JS-injected as `window.location.href` — no static canonical, duplicates self-canonicalize.** Head script on every page: `var ramc = document.createElement('link'); ramc.rel = 'canonical'; ramc.href = window.location.href; document.head.appendChild(ramc);`. Every duplicate variant (4 hosts × `/` and `/default.aspx`, byte-identical body except the form action; any URL with query params) canonicalizes to itself, and only if Google executes the JS. `/default.aspx` serves the same 37.6KB homepage as `/` with no redirect.

8. **M / homepage hero slide 1 is a COVID-era "Hand Sanitizer" banner whose CTA is a dead link.** First slider slide: `<span>Hand Sanitizer</span>` linking to `https://www.kairaliproducts.in/catalogsearch/result/?q=sanitizer` → **HTTP 404** (verified). Expired campaign content as the first impression of an "Ayurveda College" site, and image is named `keralatraining-banner.jpg` (template leak, see 11).

9. **M / broken outbound links (sample).** Blog card 1 `http://www.whyayurveda.org/treatment-center/2014/06/23/kairali-ayurvedic-spa-now-in-dubai.aspx` → **404** after redirect; "Our Brands" → Spa Equipment `http://www.kairaliequipment.com/` → **HTTP 500** (listed twice on home). Other brand links resolve 200 (kairali.guru, healing.recipes, usakairali, kairalihospitality, kairalitea, kairaliorganic, kairbykairali, kairaliproducts.com/.in, kairalicenters, ayurvedafranchise, kairaliyoga). ayurvedichealingvillage.com → 403 to curl (WAF, known — unverified, not asserted broken).

10. **M / blog card copy-paste error.** The Bangkok article card (`…/kairali-ayurvedic-treatment-centre-in-bangkok.aspx`, resolves 200) displays the title of the Dubai article: `>Kairali  Ayurvedic  Spa Now in Dubai !</a>` (home line ~475). Two of three blog cards claim "Spa Now in Dubai".

11. **M / template/code leaks from sibling-site build.** Enquire hero image `media.kairali.com/images/keralaequipments-online-enquire.jpg`; consultation hero `keralaequipments-free-online-consultation.jpg` (built from the keralaequipments template); homepage banner `keralatraining-banner.jpg`; logo `aria-label="Kairali Training"`; social link titles `title="Facebook: Kairali Training"` etc. (footer, all pages); shared CSS contains sibling classes `.maharaja-hide,.royal-hide`.

12. **M / SEO basics absent or junk.** No JSON-LD on any page (grep `application/ld+json` → 0; no Organization/EducationalOrganization schema). Homepage has **0 `<h1>`** (title-tag keywords never echoed on-page). enquirenow.aspx title is keyword salad: `Communication | Enquire Form | Information | Enquire Now`; its meta description carries typo "**detaiked** information". No hreflang (single-locale site — noted, not a defect per brief).

13. **M / server fingerprint + zero security headers.** Response headers advertise `Server: Microsoft-IIS/10.0`, `X-AspNet-Version: 4.0.30319`, `X-Powered-By: ASP.NET`, `X-Powered-By-Plesk: PleskWin`; HSTS / X-Content-Type-Options / X-Frame-Options / CSP all absent (grep → 0).

### SMALL

14. **S / copy defects (home + consultation).** About section double word: "no other medical science today speaks **of of** maintaining the health of healthy people" (home, About Us). Country dropdown: "**Antartica**", "**Czeck** Republic" (consultation). Consultation submit button reads "**May Our Mind Meet**" — flag to Anupam whether intentional. Kairali Centre card copy "Cure your ailments through Ayurveda with No side effects" is an absolute medical claim (register review; KTAHV language lock does not apply to this domain, noted only).
15. **S / dead-ish social links (unverifiable).** Footer Facebook `facebook.com/pages/Kairaliayurvedicgroup/114901512030869` → HTTP 400; Twitter `twitter.com/Kairali_Group` → 520. Both endpoints bot-block, so listed as **unverified**, not asserted dead — but both use legacy URL formats worth a manual check. YouTube and LinkedIn resolve 200.
16. **S / stale asset cache headers.** Site CSS served with `Expires: Sun, 30 Dec 2020` and `Last-Modified: 20 Jan 2020` — asset host cache config is 5+ years stale.
17. **S / captcha image served cross-origin over http.** `<img src="http://media.kairali.com/images/turing.aspx">` on all 3 forms; https variant works (200, `image/Jpeg` — malformed content-type casing is cosmetic). Whether the cross-domain captcha actually validates on submit is NOT verifiable without submitting (never done).
18. **NOTE (rebuild-scope) / content-completeness.** The site titles itself "Ayurveda Academy | Ayurveda College India" yet contains zero course, curriculum, faculty, admission, or accreditation pages — all "Training Programs" links exit to kairali.guru. Whether a group site should publicly style itself a "College" with no offerings is an Abilash register decision, not a QA fix.

Finding count: **1 security screen (CLEAN) · locked-facts FAIL (2 fail / 2 pass) · 5 HIGH · 8 MEDIUM · 4 SMALL + 1 rebuild-scope note.**

---

## NOT RUN (honest gaps)

- **Mobile/visual render checks** — browser tools prohibited this pass (shared pane). This includes visually confirming the https mixed-content breakage (finding 1), slider behaviour, and viewport rendering (viewport meta is present on all pages).
- **Form submission tests** — forms render-checked only; never submitted (binding rule). Captcha validation, mail delivery, thank-you flow unverified.
- **Facebook/Twitter profile validity** — endpoints bot-block curl (400/520); unverified.
- **ayurvedichealingvillage.com link target** — 403 WAF to curl; tried once, not bypassed.
- **GA property status** — asserted from tag type (UA-only, sunset product); Google-account-side confirmation not possible externally.
- **Full URL inventory** — no sitemap exists; sample covers every page discoverable from the nav (3 pages). Orphan .aspx pages, if any, were not enumerable externally.
- **Wayback/age of the frozen "109 Years" counter** — inferred arithmetically, not archive-verified.

*Evidence artifacts (raw HTML captures, headers, CSS, link-check output) retained in session scratchpad `…/scratchpad/kai/` — not committed.*
