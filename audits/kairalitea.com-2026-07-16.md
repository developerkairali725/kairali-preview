# QA/QC audit — kairalitea.com (LIVE ASP.NET WebForms, single-brand tea microsite)

- Audited: **2026-07-16 19:13:27 IST** (fetch window 18:56:42–19:13:27 IST)
- Auditor: factory QA pass (findings only, no fixes applied — CLAUDE.md §QA audit pass; D-TWO-LANE 16 Jul 2026)
- Method: external raw-HTML capture via `curl` (desktop Chrome UA + Googlebot UA cross-check), byte-level inspection; read-only GET/HEAD only; no form submitted; no browser tools used (shared pane).
- Stack observed: `server: Microsoft-IIS/10.0` · `x-aspnet-version: 4.0.30319` · `x-powered-by-plesk: PleskWin` · HTTP/2 · valid TLS cert (headers of `https://kairalitea.com/`, 18:56 IST).
- Sample: 15 on-domain URLs fetched — `/`, `default.aspx`, `enquire-now.aspx`, `free-online-consultation.aspx`, `contact-us.aspx`, `about-us.aspx`, `privacy-policy.aspx`, `kairali-ayurvedic-group.aspx`, `career.aspx`, `apply-now.aspx`, `sitemap.aspx` (HTML sitemap), `founders-message-and-meet-the-directors.aspx`, `vision-and-mission.aspx`, `spotlight.aspx`, `newsletter.aspx` — plus `robots.txt` (404), `sitemap.xml` (404), captcha endpoint `asdfghjkl.aspx`, 1 deliberate-404 probe, http://, https://www, plain-http and Googlebot-UA homepage variants, 16 internal-link status checks, 28 external-link status checks.
- Triage context honoured: triage flagged "legacy UA-style analytics ID; email not info@kairali.com" — both CONFIRMED below. Triage's byte size (194KB) and title match.
- Evidence-integrity note: this audit's captures were re-fetched into an isolated scratchpad dir (`…/scratchpad/kairalitea-audit/`, `kt-*` filenames) after detecting a concurrent auditor's kairalitraining.com captures sharing the first working dir. All quotes below are from the isolated `kt-*` capture set only.

---

## SECURITY VERDICT: **CLEAN** (injection screen, rule r — as of 2026-07-16 19:05 IST)

- Spam keywords `casino|gambling|betting|poker|viagra`: 0 across all 15 pages. `<marquee>`: 0. Zero-width chars (U+200B/C/D): 0 on `/`.
- AI-directed text (`ignore previous`, `system prompt`, "as an AI", etc.): 0 — nothing fetched contained instructions addressed to an agent; nothing quarantined.
- No cloaking: Googlebot-UA fetch of `/` byte-identical to desktop fetch (194,767 bytes both), 0 spam keywords.
- External `<script src>` on `/` = 6 local files only (jquery, bootstrap, owl-carousel, PageScroll2id, wow, script.js) + Google analytics.js loader inline. One external script total across sample: `http://code.jquery.com/ui/1.10.2/jquery-ui.js` on `apply-now.aspx` (legit CDN, but see finding H3).
- Outbound links = Kairali sister domains + 5 social platforms only; no off-topic/pharma/gambling outbounds.

---

## Findings (severity-ranked, evidence-linked)

### H — high

- **H1 / ALL purchase paths are dead — every "Buy Tea" link 404s.** The site's entire commercial CTA chain points at `kairaliproducts.in` URLs that no longer exist. Verified with browser UA, redirects followed (http→https lands on Magento `<title>404 Not Found</title>`):
  - `http://www.kairaliproducts.in/yuvan-herbal-tea-100gms.html` → **404** ("Buy now", Yuvan Tea, homepage §BuyTea)
  - `http://www.kairaliproducts.in/taahira-herbal-tea-100gms.html` → **404** ("Buy now", Taahira Tea)
  - `http://www.kairaliproducts.in/aarogya-herbal-tea-100gms.html` → **404** ("Buy now", Aarogya Tea)
  - `http://www.kairaliproducts.in/catalogsearch/result/?q=Kashayam` → **404**; `…/catalogsearch/result/index/?dir=asc&order=relevance&q=capsules` → **404**
  - Footer ad link `https://www.kairaliproducts.in/catalogsearch/result/?q=sanitizer` → **404** (see M7)
  A visitor persuaded by the site cannot buy the product anywhere. 5/5 product links + 1 ad link dead = 100% of monetisation broken.
- **H2 / Analytics is dead — Universal Analytics only, sunset July 2023.** Every sampled page (11/11 with analytics) carries ONLY `ga('create', 'UA-79551626-1', 'auto')` via `https://www.google-analytics.com/analytics.js` (homepage lines 174–180). No GA4 (`G-…`), no GTM container anywhere. Google stopped processing UA hits 1 Jul 2023 → **~3 years of zero traffic data** on a lead-gen site. (Triage's second ID "G-I7IAK296" is a FALSE POSITIVE — it is a substring of the ASP.NET `ScriptResource.axd?d=…heG-I7IAK296eq…` hash on enquire-now line 190, not a tag.)
- **H3 / No HTTPS enforcement + active mixed content.** `http://kairalitea.com/` returns **200 with the full page** (194,767 bytes — no redirect to https); no `strict-transport-security` header. Consequence: the enquiry/consultation/job forms (name, age, gender, phone, email, address, health message) POST over plain HTTP for any http-entry visitor. Additionally `apply-now.aspx` loads `<script src="http://code.jquery.com/ui/1.10.2/jquery-ui.js">` and `<link rel="stylesheet" href="http://code.jquery.com/ui/1.10.2/themes/smoothness/jquery-ui.css">` (lines 1509, 161) — active mixed content that browsers block on the https page, which should kill the `#txtDateOfBirth` datepicker (lines 1477, 1490). Runtime render NOT RUN (no browser) — blockage inferred from mixed-content spec, flagged for Deepu to verify in a browser.
- **H4 / Site is invisible to crawlers' plumbing: no robots.txt, no XML sitemap, no canonicals, 5+ indexable duplicates of every page.** `https://kairalitea.com/robots.txt` → **404**; `https://kairalitea.com/sitemap.xml` → **404**; `rel="canonical"`: **0 occurrences across all 15 pages**. Meanwhile `http://kairalitea.com/`, `https://kairalitea.com/`, `https://www.kairalitea.com/`, `http://www.kairalitea.com/` and `/default.aspx` ALL return 200 with the same content (194,767 / 194,779 bytes) and `<meta name="robots" content="index, follow">` — every page exists at ≥5 crawlable URLs with nothing telling Google which is real.

### M — medium

- **M1 / LOCKED-FACT VIOLATION (PR #65) — homepage attaches 1908 to the company.** `https://kairalitea.com/` §Our Story (line 307): "*rigorous research and Ayurvedic practice for over 100 years. Since1908, Kairali initiated the development and the formulation of herbal product and treatment methodologies*" — (a) "Since1908, Kairali initiated…" reads as company-founding claim (1908 = family lineage ONLY; Group founded 1989); (b) typo "**Since1908**" missing space; (c) "over 100 years" is a frozen rolling number (2026−1908 = 118). Compare `about-us.aspx` line 250 which gets the framing right: "*In 1908, the Kairali family first started to develop and market herbal product formulations*" — but still opens with frozen "*for over 100 years*". `kairali-ayurvedic-group.aspx` line 318: "*part of a family tradition, carried over for over 100 years*" — family framing OK, frozen number flag.
- **M2 / LOCKED-FACT CONFLICT — public contact email is `support@kairaliproducts.com` sitewide, `info@kairali.com` absent.** `support@kairaliproducts.com` on 13/13 sampled pages incl. footer mailto (e.g. sitemap.aspx `href="mailto:support@kairaliproducts.com"`); `sales.ho@kairaliproducts.com` ×4 on privacy-policy.aspx; `career@kairali.com` ×6 on career.aspx. Zero occurrences of `info@kairali.com`. Same class as the kairalicenters email finding — **register review (Abilash), noted, not delegated as copy change.**
- **M3 / Sitewide footer copy is visibly broken English (13/13 pages).** Footer "Keep in Touch" block: "*We would to hear your feedback and inputs. Please feel free to drop leave*" (missing "love", sentence truncated mid-thought) and social label "*Gooogle Plus*" (triple-o typo). Live on every page of a consumer brand site.
- **M4 / Dead social platform link sitewide — Google+ (shut down 2019).** Footer `https://plus.google.com/102296388765014542269` redirects to Google's Currents-shutdown blog post (`workspaceupdates.googleblog.com/2023/04/…`, HTTP 200). Facebook link `https://www.facebook.com/Kairali-Ayurvedic-Products-662309010455010/` returns **400** to curl (FB bot-blocks; existence UNVERIFIED — needs a human/browser check). Twitter/LinkedIn/YouTube return 200 (profile liveness not deep-verified).
- **M5 / Sister-site link rot in the "Group" section.** `http://www.kairaliequipment.com/` → **500** (server error); `http://www.ayurvedichealingvillage.com/` → **403** (WAF-block suspected — reported honestly, not bypassed, existence UNVERIFIED). All ~20 sister-site links use `http://` scheme (6× kairalitraining, 5× kairaliorganic, 5× kairalicenters, etc.) — link-equity + redirect-latency hygiene.
- **M6 / "Live Chat" button is dead code.** Sitewide left-nav `<a onclick="chetramclick();">Live Chat</a>` (homepage line 234) → `js/script.js` line 246 calls `$zopim(function(){ $zopim.livechat.window.toggle(); })` — but the Zopim/Zendesk widget loader is loaded NOWHERE (0 occurrences of any zopim script tag on any sampled page or in script.js). Clicking should throw `ReferenceError: $zopim is not defined` and do nothing. Static-code finding; runtime click NOT RUN.
- **M7 / COVID-era hand-sanitizer ad still served in the footer, linking to a 404.** Footer `ucFooter_divleft` renders `<div class='picofads'>` — "*Kairali Hand Sanitizer … Kills 99.99% Germs & Bacteria*", image from `https://admin.kairali.com/products/86ed1a19-….jpg`, link → `kairaliproducts.in/catalogsearch/result/?q=sanitizer` → **404** (verified). Stale ~2020 promo on a 2026 tea site + dead destination + ad image served off an `admin.` subdomain.
- **M8 / Zero structured data and zero social meta.** `application/ld+json`: **0** on all 15 pages; `og:` properties: **0** on homepage. No Organization/Product/BreadcrumbList schema anywhere on a product brand site.
- **M9 / Privacy policy is 10 years stale; consent enforcement doubtful.** `privacy-policy.aspx`: "*effective from 18th June, 2016*" — predates DPDP Act 2023. The three lead forms DO render a consent checkbox + privacy link ("*I have read and agree to Kairali Tea privacy & terms of use.*", enquire-now lines 701–704), but no ASP.NET validator is wired to `chkAgree` (no `controltovalidate="chkAgree"` in markup) → consent appears optional; enforcement UNVERIFIED (form never submitted, per rules).
- **M10 / Newsletter puts subscriber email in the URL, and the endpoint thanks you regardless.** Homepage line ~2523: `window.location.href = 'newsletter.aspx?email=' + emailField;` — PII in a GET query string (logs, referrers). A bare parameterless GET of `newsletter.aspx` returns 200 `<title>Kairali Tea – Thanks</title>` — the thank-you page renders with no submission at all. (No form was submitted; the bare page fetch carried no data.)

### S — small

- **S1 / Version-disclosure headers**: `server: Microsoft-IIS/10.0`, `x-aspnet-version: 4.0.30319`, `x-powered-by: ASP.NET`, `x-powered-by-plesk: PleskWin` on every response. Fix: suppress tokens in IIS/Plesk.
- **S2 / Ancient JS libraries, no SRI**: jQuery **1.9.1** (2013; multiple known XSS advisories) sitewide + jQuery UI **1.10.2** on apply-now; the sole external CDN script tag (`code.jquery.com`, apply-now line 1509) carries no `integrity=`/`crossorigin=` attributes — no Subresource Integrity against CDN compromise. Upgrade/bundle locally or add SRI at rebuild.
- **S3 / Viewport disables pinch-zoom**: `maximum-scale=1.0, user-scalable=1.0` (homepage `<meta name="viewport">`) — accessibility flag (WCAG 1.4.4).
- **S4 / Unbranded 404**: probe `/qa-nonexistent-kt-20260716/` → correct HTTP **404** status but bare IIS default page ("*404 - File or directory not found.*", 1,245 bytes). Status behaviour correct (no soft-200); page is unbranded, no nav back.
- **S5 / Captcha endpoint named `asdfghjkl.aspx`** (keyboard-mash filename; endpoint itself WORKS — returns `image/GIF`, 1,606 bytes, HTTP 200). Dev-leftover naming hygiene.
- **S6 / Sitewide passive mixed content**: 3 images per page from `http://www.kairali.com/images/…` (kairali-view-home.jpg, kairaliayurvedictreatmentcentre.jpg, kairaliyoga.jpg) on all 15 https pages. Targets resolve (kairali.com 301s http→https, images 200), so browser auto-upgrade masks it today; still http:// in source.

### PASS (checked, no finding)

- **h1 discipline**: exactly 1 `<h1>` on every one of 10 checked pages.
- **Meta titles + descriptions**: present and unique on all sampled pages (triage title confirmed).
- **Meta robots**: `index, follow`; no stray `noindex` anywhere.
- **Viewport meta**: present on all sampled pages (see S3 for the zoom caveat).
- **Internal links**: all 16 unique on-domain `.aspx` targets (incl. `apply-now.aspx?id=7/26/31`) → HTTP 200; zero internal 4xx/5xx.
- **No Lorem ipsum**, no template-variable leaks, no expired prices (no prices on site), no `+91 92898 38777` (0 hits, all variants — see locked-facts).
- **Forms render** with labels + ASP.NET RequiredFieldValidators + working captcha image + privacy link + consent checkbox (renders; enforcement per M9).

---

## LOCKED-FACTS RESULT — **FAIL (2 violations, 1 conflict-class)**

| Locked fact | Result | Evidence |
|---|---|---|
| Banned phone `…38777` (any variant) | **PASS — absent** | 0 hits across all 15 pages; correct `…38797` also absent (non-KTAHV site, nothing to scrub). Site phone is `+91-9555156156` (footer + `tel:+919555156156`). |
| Public contact email = `info@kairali.com` | **FAIL** | `support@kairaliproducts.com` 13/13 pages; `sales.ho@kairaliproducts.com` ×4 (privacy-policy); `career@kairali.com` ×6 (career); `info@kairali.com` 0 hits. → M2, register review. |
| "Since 1908" never attached to Group/company (PR #65) | **FAIL on homepage** | `/` line 307 "*Since1908, Kairali initiated the development…*" = company framing. about-us + group pages use compliant "Kairali family" framing. → M1. |
| No frozen rolling numbers | **FLAG** | "*over 100 years*" typed literal on `/`, `about-us.aspx`, `kairali-ayurvedic-group.aspx` (real figure 118 if lineage-based). → M1. |

---

## NOT RUN (honest gaps)

1. **Mobile/visual render checks** — no browser/Playwright tools used (shared pane rule); layout, image loading, datepicker breakage (H3), Live-Chat click error (M6) are static-code inferences, not observed renders.
2. **Form submissions** — findings-only rule; consent enforcement (M9), server-side validation, and email delivery untested.
3. **Social profile liveness** — Facebook (400 to curl), Twitter/X, LinkedIn, YouTube page existence not verifiable via curl; needs human/browser check.
4. **ayurvedichealingvillage.com** — 403 to curl (suspected WAF); not bypassed; real status unknown.
5. **Analytics hit-level verification** — property-level UA deadness is inferred from Google's July 2023 UA sunset, not from account access.
6. **Lighthouse / Core Web Vitals / accessibility audit** — out of tool reach this pass.
7. **DE/FR locale checks** — N/A; site is EN-only and non-KTAHV (locale mandate is KTAHV-specific).
8. **WebFetch cross-check** — not needed; site never WAF-blocked curl (all 200s), so the WebFetch fallback path was unused.

---

## DELEGATION SPLIT (proposed — no fixes applied in this pass)

**Deepu (WP/web tech):**
1. Restore/redirect the 5 dead Buy-Tea targets on kairaliproducts.in, or repoint the buttons at live PDPs (H1 — revenue).
2. Force http→https + www canonical host redirect; add HSTS after burn-in (H3).
3. Swap `code.jquery.com` refs on apply-now to https (or bundle locally) and verify datepicker in a browser (H3).
4. Add robots.txt + XML sitemap + `rel="canonical"` on all pages (H4). *CLAUDE.md gate 3: robots.txt change needs sign-off first.*
5. Install GA4/GTM, remove dead UA-79551626-1 snippet (H2).
6. Remove or re-wire dead Live Chat (M6); remove Google+ link (M4); retire sanitizer footer ad (M7).
7. Suppress IIS/ASP.NET/Plesk version headers (S1); fix viewport zoom lock (S3); branded 404 (S4).

**Anupam (copy):**
1. Rewrite homepage Our Story sentence — family-lineage framing per PR #65, fix "Since1908" spacing, computed-or-removed "100 years" (M1).
2. Fix footer "We would to hear… drop leave" + "Gooogle Plus" (M3).

**Abilash (register review — decisions, not tasks):**
1. Email identity: `support@kairaliproducts.com` vs locked `info@kairali.com` (M2) — same ruling class as kairalicenters.
2. Whether kairalitea.com stays live as-is, gets minimum-fix (H1–H4 only), or waits for Wave rebuild — given 100% dead purchase paths, doing nothing means the site earns nothing.
3. Privacy-policy refresh (2016 → DPDP-era) — legal language, needs owner call (M9).

**Sunaj (security/infra):** nothing urgent — injection screen CLEAN; S1/S2 hardening at rebuild.

*Evidence artifacts (raw captures, link-check outputs) retained in session scratchpad `…/scratchpad/kairalitea-audit/` (`kt-*` files) — not committed.*

Finding count: **1 security verdict (CLEAN) · 4 H · 10 M · 6 S · 7 PASS · locked-facts FAIL (2 violations + 1 flag, 1 pass)**.
