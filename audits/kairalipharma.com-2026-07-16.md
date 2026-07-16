# QA/QC audit — kairalipharma.com (LIVE Active eCommerce CMS storefront — OWNERSHIP UNVERIFIED)

- Audited: **2026-07-16 19:04:51 IST** (fetch window 18:56:41–19:04:51 IST)
- Auditor: factory QA pass (findings only, no fixes applied — CLAUDE.md §QA audit pass)
- Method: external raw-HTML capture via `curl` (desktop Chrome UA, `--max-time 20`), byte-level inspection. Read-only GET/HEAD only; no forms submitted, nothing written.
- Sample: 20 fetches — `/`, `robots.txt`, `sitemap.xml`, `/?sitemap.xml`, `/categories`, `/category/immunity`, `/category/Menor-sLmua`, `/todays-deal`, `/flash-deals`, `/privacy-policy`, `/terms`, `/return-policy`, `/support-policy`, `/track-your-order`, `/users/login`, `/search?sort_by=newest`, `/brands`, `/playstore` + `/apple` probes, deliberate-404 probe `/qa-nonexistent-probe-20260716`, `http://` and `https://www.` redirect probes, HEAD on the topbar-banner PDF, GET (redirect-only) on `/social-login/redirect/google`.
- Platform fingerprint: Laravel (`XSRF-TOKEN` + `kairali_pharma_session` cookies) running **Active eCommerce CMS** (`aiz-core.js?v=6209`, `AIZ.*` JS namespace, activeitzone demo link — finding #7). Server: Cloudflare → LiteSpeed (`x-turbo-charged-by: LiteSpeed`). NOT WordPress.
- Triage context honoured: surfaced as "unexpected CONTENT: 200; 130KB pharma wholesaler site, Kottakkal Kerala; meta title typo 'kairaliphrama.com'; no info@kairali.com on homepage". Both triage flags confirmed below.

---

## OWNERSHIP VERDICT: **UNVERIFIED — likely NOT a Kairali Ayurvedic Group site. Register review (Abilash) required before any fleet action.**

Evidence that this is an independent business that happens to share the "Kairali" name:

- Footer identity: `© Kairali Pharma` only — zero occurrences of "Kairali Ayurvedic Group", "KAPPL", "KTAHV", "Healing Village", Delhi, or Palakkad anywhere in the 20-fetch sample.
- Footer address (×2 on every page): `Parappur Road . KOTTAKKAL, Malappuram (Dt.), Kerala INDIA 676503` — a Kottakkal wholesaler address, not a group location.
- Contact set: phone `0483 274 30 47 | +919947988988` (helpline `tel:+919947988988` ×4 on home), email `info@kairalipharma.com` (×2, Cloudflare-obfuscated `data-cfemail`, decoded offline). No group phone/email present.
- Merchandise: the only branded content on the site is **Dabur** promo banners (home carousel: "Dabur / Pudin Hara", "Dabur / Pure Cold Pressed Castor Oil", "Dabur / Amla Juice") — third-party FMCG, not Kairali products.
- Privacy policy self-description: "Company … refers to Kairali Pharma, Parappur, Kottakkal, ." (`/privacy-policy`).
- CLAUDE.md notes KAPPL e-commerce runs on Shopify; this is an Active eCommerce CMS (Laravel) store — no overlap.

**Consequence:** if Abilash confirms the domain is not group-owned, the locked-fact email rule (`info@kairali.com`) does not apply here and the domain should be recorded in the org inventory as a brand-name collision (a common Kerala name), not a fleet defect. Everything below is reported anyway, as instructed, in case the domain IS group-owned legacy property.

---

## Findings (severity-ranked, evidence-linked)

1. **H / `https://kairalipharma.com/sitemap.xml`** / **Sitemap is a dead file that leaks the server filesystem path.** HTTP 200, `content` = the literal 47-byte string `/home/kairalipharma.com/public_html/sitemap.xml` — not XML at all. It discloses the hosting account's directory layout (account name + docroot), and `robots.txt` actively directs every crawler to it (`Sitemap:https://kairalipharma.com/sitemap.xml`). Google gets a broken sitemap AND an information-disclosure string. Fix (S): generate a real XML sitemap or remove both Sitemap lines.
2. **H / `https://kairalipharma.com/robots.txt`** / **Malformed robots.txt — misspelled directive, wrong-platform rule, second broken sitemap line.** Full body (124 bytes): `User-agent:*` / `Disalow:/wp-admin/` / `Sitemap:https://kairalipharma.com/sitemap.xml` / `Sitemap:https://kairalipharma.com/?sitemap.xml`. "Disalow" is not a valid directive (should be `Disallow`), so it is ignored by crawlers; `/wp-admin/` is a WordPress path on a Laravel site (copy-paste artifact); `?sitemap.xml` returns the homepage HTML (verified: HTTP 200, 130,609 bytes = byte-identical size to `/`) — an HTML page declared as a sitemap. Fix (S): rewrite the 4-line file.
3. **H / sitewide `<title>`** / **The site misspells its own domain in the title tag.** `<title>kairaliphrama.com | Pharmaceutical products wholesaler in Kottakkal, Kerala</title>` ("phrama", sic) — confirmed on `/`, `/categories`, `/todays-deal`, `/flash-deals`, `/track-your-order`, `/users/login`, the 404 page, and `https://www.` variant (it is the CMS default title). This is the SERP headline and browser-tab text for most of the site. Fix (S): one field in the CMS site settings.
4. **H / catalog — `/category/immunity`, `/category/Menor-sLmua`, `/todays-deal`, `/flash-deals`, `/search?sort_by=newest` ("All products")** / **The store has ZERO products.** Every listing page renders its filter rail and sort bar with an empty grid — 0 `href="…/product/…"` links exist anywhere in the sample; the only price string on any page is the empty-cart header `Rs0.00`. The homepage promotes Dabur products (Pudin Hara, Castor Oil, Amla Juice) but the banners link only to `/flash-deals` and `/todays-deal` — both empty. An e-commerce site where nothing can be bought is either abandoned or pre-launch; either way it is indexable (`<meta name="robots" content="index, follow">`) in this state. Fix: business decision (populate or noindex/park).
5. **H / `https://kairalipharma.com/terms`** / **Terms & conditions declare the governing law of the NETHERLANDS for a Kerala pharma wholesaler**: "…in accordance with and subject to, prevailing law of Netherlands." — un-edited output of a T&C generator. Same page misspells the company as "**Khairali** Pharma" twice (body: "in agreement with the Khairali Pharma's Privacy Policy"; meta description: "…rules and regulations for the use of Khairali Pharma's Website…"). Fix (S): regenerate terms with India/Kerala jurisdiction + correct name.
6. **M / `/return-policy` and `/support-policy`** / **Two footer policy pages are empty shells with empty `<title></title>` and empty meta description.** Body content is the heading alone ("return policy" / "Support Policy") — no policy text. For a commerce site these are consumer-trust/compliance pages. `/category/Menor-sLmua` also serves an empty `<title>`. Fix (S): write the two policies; set titles.
7. **M / sitewide cookie-consent banner** / **Consent notice links to the CMS vendor's demo site, not the site's own policy**: `<p>We use cookie for better user experience, check our policy <a href="https://demo.activeitzone.com/ecommerce/privacypolicy">here</a>&nbsp;</p>` (home.html line 1524, present sitewide). A user clicking "here" leaves for demo.activeitzone.com. Stock demo text left in ("We use cookie…"). Fix (S): point to `/privacy-policy`, rewrite sentence.
8. **M / duplicate host + no canonicals** / `https://www.kairalipharma.com/` serves HTTP 200 (131,153 bytes, same title) with **no redirect** to the apex, and `rel="canonical"` count is **0 on every sampled page** — Google sees two full copies of the site with no consolidation signal. (`http://` → 301 → `https://` is correct.) Fix (S): 301 www→apex at Cloudflare + emit canonicals.
9. **M / analytics** / **No analytics at all on any sampled page**: zero GA4/GTM/UA snippets (grep `googletagmanager|gtag(|GTM-|UA-` = 0 across all 15 HTML captures). A Facebook Pixel `AddToCart` call exists but is dead code inside `if ("0" == 1){ fbq('track', 'AddToCart', …) }` (home.html line ~2019) — pixel disabled in CMS settings, no `fbq('init')` anywhere. The business has no visibility into the site. Fix (S): install GA4 if the site is meant to be live.
10. **M / demo/template residue in the catalog taxonomy** / Category "**Menor**" (slug `/category/Menor-sLmua`) sits in the main nav alongside "mens-health" — a garbled fragment (its filter rail offers "**Fabric**"; site-wide search offers "**Size | Fabric**" filters — clothing attributes from the Active eCommerce demo data on a pharma store). Stock-template strings ship to users: "Dont have an account?" (missing apostrophe, login page + modal), "If you create any classified **ptoducts**…", "it may **takes some times**" (account-deletion modal, sitewide), auction module "Bid For Product / Place Bid Price" modal rendered on every page though no auctions exist. Fix (S): delete/rename the category, correct the language strings, disable unused modules.
11. **M / homepage topbar banner → 70 MB PDF** / The full-width topbar banner (`alt="Topbar Banner"`, home.html line 241) links directly to `https://kairalipharma.com/public/uploads/all/KR4d6ijDayy6FOYd23rrJcdYvzXVjDjno2CP9swJ.pdf` — HEAD verified `content-type: application/pdf`, `content-length: 74048097` (70.6 MB). One tap on the most prominent element of the page starts a 70 MB download (mobile data killer). Content of the PDF not inspected (size). Fix (S): compress or replace with a landing page.
12. **S / structured data** / 0 `application/ld+json` blocks on any sampled page — no Organization/LocalBusiness/Product schema anywhere. Consistent with an out-of-box install.
13. **S / homepage heading structure** / 0 `<h1>` elements on `/` (grep `<h1` = 0). Minor given the larger issues.
14. **S / headers** / No `strict-transport-security` header on any response (Cloudflare edge, LiteSpeed origin). HTTPS itself works and `http://` 301s correctly.
15. **PASS / hygiene checks that came back clean** / 404 probe `/qa-nonexistent-probe-20260716` returns a real HTTP 404 with the themed 404 page (no soft-200). Mixed content: 0 `http://` asset/link URLs across all captures. Viewport meta present. No Lorem ipsum. Forms render (search GET, newsletter POST `/subscribers` with CSRF `_token`, order-tracking GET, login POST, Google social-login 302s to a real configured OAuth client) — none submitted per rules; note the newsletter form has **no consent checkbox and no adjacent privacy link** (footer link only) — DPDP hygiene gap if group-owned.

Finding count: **1 ownership verdict (UNVERIFIED) · 5 H · 6 M · 3 S · 1 PASS block.**

---

## LOCKED-FACTS RESULT (all 15 HTML captures grepped, all spacing variants)

- Banned phone `+91 92898 38777` / `9289838777`: **0 occurrences.** Correct `…38797`: 0 occurrences (nothing to correct). **PASS.**
- `Since 1908` / any `1908`: **0 occurrences.** **PASS.**
- Frozen rolling numbers (`115+`, `25 years`, `years of`): **0 occurrences.** **PASS.**
- `info@kairali.com`: **absent.** Site-wide contact is `info@kairalipharma.com` (×2 per page, Cloudflare-obfuscated). **Conditional:** a locked-fact violation ONLY IF this is a group property — see Ownership Verdict; flagged for Abilash's register review, not asserted as a defect.

## SECURITY (rule r) — injection screen

- Fetched content screened for agent-directed text (`ignore previous`, `as an AI`, `system prompt`, etc.): **0 hits** across all captures. Nothing quarantined.
- No spam keywords, no hidden elements, no zero-width characters, no rogue outbound links (full external href inventory: fonts.googleapis/gstatic, Cloudflare email-decode script, and the activeitzone demo link in finding #7).
- Info-disclosure note: finding #1's filesystem-path leak (`/home/kairalipharma.com/public_html/…`) is the only security-relevant disclosure observed.

## NOT RUN (honest gaps)

- **Mobile/visual render checks** — browser tools off-limits this pass (shared pane); layout, carousel behaviour, tap targets unverified.
- **Form submissions** — never submitted (rule); server-side validation, newsletter double-opt-in, order-tracking behaviour unverified.
- **WHOIS/registrant lookup** — not performed (no whois tooling exercised this pass); ownership verdict rests on on-page evidence only and stays UNVERIFIED until Abilash rules.
- **70 MB PDF content** — HEAD only; not downloaded, contents unknown.
- **Authenticated areas** (`/dashboard`, `/purchase_history`, `/wishlists`) — require login; not attempted.
- **Broken-link full crawl** — only the ~30 unique homepage/footer links were inventoried; a full-depth link check was not run (site has no product URLs to crawl anyway).
- **Lighthouse/performance, DNS/email (SPF/DMARC) checks** — out of this pass's scope.

## DELEGATION SPLIT (conditional on ownership ruling)

**Abilash (register review — decision, not task):**
1. Confirm whether kairalipharma.com is group-owned (WHOIS/registrar records, or ask Ambuj). If NOT ours: record as brand-name collision in org inventory, close — none of the findings are our work. If OURS: prioritise findings 1–5 and decide park-vs-populate (finding #4) before any SEO fix matters.

**If group-owned — Deepu (web tech):** robots.txt rewrite + real sitemap (H×2), CMS default title fix "kairaliphrama" (H), www→apex 301 + canonicals (M), cookie-banner link (M), GA4 (M), banner-PDF replacement (M), empty policy pages' titles (M).
**If group-owned — Anupam (copy):** terms regeneration (Netherlands→India, "Khairali"→"Kairali") (H), return/support policy text (M), template-string typos (M).

*Evidence artifacts (raw HTML/header captures, decoded emails, grep logs) retained in session scratchpad `…/scratchpad/kp/` — not committed.*
