# QA/QC Audit — www.kairaliproducts.in (LIVE)

**Timestamp:** 2026-07-16 16:18:30 IST
**Auditor:** Claude (QA audit pass, findings only — no fixes applied)
**Scope:** D-TWO-LANE basic/fast Google-compliance hygiene. Out of scope: redesign, structure, images, UI/UX, complex SEO, performance.
**Method:** External fetch (curl raw HTML + tavily_extract + WebFetch fallback). Platform detected: Shopify (store id 92589981983). Pages sampled (15): homepage; collections treatments-for-ailments, hair-care, skin-care, ayurvedic-proprietary-medicines; products shatavari-capsules…, kairoil…, kairtis (long slug), spazyme-syrup; pages contact-us, the-kairali-group, enqurie-now, thank-you; /cart; deliberate 404 URL. Plus /robots.txt, /sitemap.xml + all 5 children, /agents.md, and cross-checks on kairaliproducts.com.
**Evidence cache:** scratchpad HTML snapshots (session-local), quotes inline below.

**Counts: BLOCKER 0 · HIGH 3 · MED 11 · LOW 9 — plus 6 PASS notes**

---

## 1. Forms / lead capture (revenue-critical)

- **HIGH** — `https://www.kairaliproducts.in/pages/contact-us` — Page copy says "Please complete this form to get the perfect response" and renders a `contact-form-grid` with a `right-column`, but the server HTML contains **no contact form**: the only `<form>` elements on the page are header search (`action="/search"`), footer newsletter (`id="contact_form" class="newsletter-form wt-newsletter__form wt-footer__additional__fo…"`), cart drawer, and 2 localization forms. No third-party form embed (Zoho/Jotform/POWR/recaptcha) detected either. If no JS app injects a form, the primary lead page collects nothing. **Fix S:** open page in a browser, confirm; if absent, add the theme contact-form section. → Deepu (confirm within 1 day).
- **HIGH** — `https://www.kairaliproducts.in/pages/enqurie-now` — Same pattern: copy says "Fill the below form and get a call back from us" but zero page-level `<form>` in server HTML (same 6 header/footer forms only). **Fix S:** same as above. → Deepu.
- **PASS** — `/pages/online-consultation` has a working-looking "Free Online Consultation" form (Name / contact / health query fields) per WebFetch render.
- **PASS** — Cart page renders cart form (`<form action="/cart" class="cart__contents critical-hidden" method="post" id="cart-form">`).

## 2. Content errors / placeholder text

- **HIGH** — `https://www.kairaliproducts.in/pages/thank-you` — Raw **Magento template code from the old site is visible on the live page** (3 blocks in rendered body, also leaked into the meta description): `{{block class="Magento\Framework\View\Element\Template" template="Rsg_Kairali::pages/thank_you.phtml"}}` and 2× `{{block class="Rsg\Filterproducts\Block\Home\FeaturedList" name="best_selling" category_id="3" product_count="12"…}}`. Every form-submitter lands here. **Fix S:** delete the leftover `{{block …}}` lines from the page content. → Anupam/Astha (content) + Deepu (edit).
- **MED** — `https://www.kairaliproducts.in/pages/find-our-store` — "**Amazone**" (Amazon misspelled), a store tile labeled "**1 Img**" (placeholder), "Le marche" listed twice under OFFLINE STORE. **Fix S:** correct spelling, replace/remove placeholder tile, dedupe. → Anupam/Astha.
- **MED** — Site-wide — Analytics app edit-mode UI ships in the production DOM on every page sampled: visible text "Custom Event Setup — Click on the elements you want to track as custom events. Selected elements will appear in the list below. / Track New Element / Selected Elements (0) / Finish Setup" (seen on home, FAQ, sitemap page, collections, PDPs via extraction). **Fix S:** identify the tracking app and disable its setup overlay for storefront visitors. → Deepu.
- **MED** — `https://www.kairaliproducts.in/pages/enqurie-now` — Slug typo: "enqurie" (should be "enquire"); linked from homepage footer. **Fix M:** create correctly-spelled page + 301 redirect old slug (keep old URL redirecting — it may be linked externally). → Deepu.
- **LOW** — `https://www.kairaliproducts.in/pages/become-our-distributers-importers` — slug misspells "distributors" ("distributers"). Fix M (redirect) or accept. → Deepu backlog.
- **LOW** — 404 page — h1 is "**Ooops!**" (triple-o; standard is "Oops!"). Fix S. → Anupam/Astha.
- **LOW** — `https://www.kairaliproducts.in/products/spazyme-ayurvedic-medicine-for-digestion-and-gastric-problems` — Title tag says "Spazyme - Ayurvedic **Tablets** for Gas, Acidity & Indigestion" while page body sells "Spazyme **Capsules** (60 capsules)". Fix S: align title with product form. → Anupam/Astha.

## 3. Locked-facts compliance (CLAUDE.md)

- **HIGH** — `https://www.kairaliproducts.in/pages/contact-us` — Public emails shown are `support@kairaliproducts.com` (Corporate, "Reply in 24-48 Hrs") and `info@kairaliproducts.com` (KAPPL Pollachi). LOCKED FACTS say public contact email everywhere = **info@kairali.com**; that address appears on none of the 15 sampled pages. **Fix S — but ESCALATE first:** confirm with Abilash whether the kairaliproducts.com store intentionally uses its own domain mailboxes before any edit (facts ambiguity → STOP-and-ask rule). → Abilash decision, then Anupam/Astha.
- **PASS** — Banned number +91 92898 38777 appears on **zero** pages; the correct Priya number (+91 92898 38797, "Talk to Priya — your 24x7 assistant") is present site-wide.

## 4. Titles & meta descriptions

- **MED** — `https://www.kairaliproducts.in/` — Title tag ends with a dangling separator: `Kairali Ayurvedic Store: Buy Online Ayurvedic & Herbal Products -` (empty suffix after the hyphen; og:title identical). Looks like an empty "store name" suffix setting. **Fix S:** remove trailing "-" or append brand. → Deepu.
- **MED** — Meta descriptions auto-generated from body text and over 160 chars: contact-us 320 chars (starts "Contact Us \xa0 We welcome all communications…"), the-kairali-group 320 chars ("COMPANY PROFILE Kairali Ayurvedic Group is headed by…"), kairtis PDP 320 chars, treatments-for-ailments 202 chars, thank-you 410 chars (contains the Magento code above). **Fix S:** write ≤160-char descriptions for these 5. → Anupam/Astha (copy), Deepu (paste into Shopify SEO fields).
- **LOW** — `/cart` and the 404 page have no meta description (cart is robots-disallowed — cosmetic only). Fix S or skip. → Deepu backlog.
- **LOW** — Thin titles without brand: contact page title is exactly `Contact Us` (10 chars); cart `Your Shopping Cart`. Fix S. → Anupam/Astha.
- **PASS** — No duplicate titles among the 15 sampled pages; collection/product titles are unique and within length norms.

## 5. Headings (exactly-one-h1)

- **MED** — Template-wide **zero h1** on money pages: all 4 sampled collection pages (`/collections/treatments-for-ailments`, `/collections/hair-care`, `/collections/skin-care`, `/collections/ayurvedic-proprietary-medicines`), plus `/pages/contact-us`, `/pages/the-kairali-group`, `/pages/enqurie-now`, `/cart` have **no h1 element in the rendered DOM** (the only `<h1` string on those pages sits inside a COD-app's JSON config in a `<script>` — evidence: `"thankyou_text":"…<h1 …>Thank You, {{customer.first_name}}! 🎉</h1>…"`). Collection/page titles are rendered as non-h1 elements. **Fix M (theme templates):** promote collection/page title element to h1. → Deepu.
- **MED** — Multiple h1s where they do exist: homepage has 2 (`<h1 itemscope … class="wt-header__logo">` wrapping the logo + `<h1>KAIRALI AYURVEDIC PRODUCTS ONLINE STORE</h1>`); Shatavari PDP has 2 ("Herbal Health Supplement for Women - Supports Hormonal Balance…" and "Shatavari Capsules: Ayurvedic Health Supplement for Women…"). Other 3 PDPs have exactly 1. **Fix S:** demote logo h1 to div on index; demote one PDP heading. → Deepu.

## 6. Canonicals

- **PASS** — Self-referencing canonical present and correct on all 15 sampled pages (e.g. `<link rel="canonical" href="https://www.kairaliproducts.in/collections/hair-care">`); 404 page canonicals to `/404` (harmless).
- **MED** — `https://www.kairaliproducts.in/products/best-ayurvedic-oil-for-joint-knee-pain-support-mobility-muscle-comfort-kairtisbest-ayurvedic-oil-for-joint-knee-pain-support-mobility-muscle-comfort-kairtiskairtis-best-ayurvedic-oil-for-knees-pain-joints-relief-oil-for-arthritis-and-spondylosis` — Kairtis PDP slug is a 271-char triple-concatenation of the product title (clear handle-generation accident) and it is the live canonical + sitemap URL. **Fix M — CAUTION:** per doctrine (m), flag to Vikash BEFORE changing (live Ads may target it); change handle + keep Shopify auto-redirect. → Deepu after Vikash sign-off.

## 7. hreflang

- **MED** — Site-wide — Every page emits `hreflang="en-IN"` (self), `hreflang="en"` and `x-default` → same path on `www.kairaliproducts.com`. Two defects: (a) `https://www.kairaliproducts.com/pages/contact-us` returns **HTTP 404** (alternates generated without checking target exists); (b) the .com homepage emits **no hreflang return tags at all** (checked 2026-07-16), so per Google the annotations are unconfirmed and ignored cluster-wide. **Fix M:** add matching hreflang on .com or drop the tags on .in; suppress alternates for paths that 404. → Deepu (needs .com store access; loop Sunaj only if .com is separately hosted).

## 8. robots.txt & sitemaps

- **PASS** — `/robots.txt` valid (standard Shopify + AI-crawler allowances for GPTBot/ClaudeBot/PerplexityBot etc.), declares `Sitemap: https://www.kairaliproducts.in/sitemap.xml`. Sitemap index → 5 children, all HTTP 200 valid XML: products 138 URLs, collections 147, pages 61, blogs 2, agentic-discovery 1 (`/agents.md`, exists, UCP agent-commerce instructions).
- **MED** — Pages sitemap includes conversion/thank-you URLs: `/pages/thank-you`, `/pages/ppc-thank-you`, `/pages/consultation-thank-you` — and `/pages/thank-you` has **no robots noindex meta** (none of the sampled pages emit a robots meta). Indexable thank-you pages can enter Google and fire conversion pixels on organic entries, polluting Ads data. **Fix S:** set `seo.hidden` metafield (noindex + sitemap removal) on all 3. → Deepu.
- **LOW** — `/pages/no-route` (a Magento-era artifact page) is in the pages sitemap. **Fix S:** hide/delete. → Deepu.
- **LOW** — Blog nearly empty: blogs sitemap has 1 article (lastmod 2025-08-18) — stale but valid. Content lane decision; rebuild-scope, skip.

## 9. Mixed content & security surface

- **PASS** — **Zero** `http://` subresources (src/href) on all 15 sampled pages; all assets load from https/cdn.shopify.com. (Product JSON-LD uses `http://schema.org/InStock` availability URI — valid and accepted by Google, not mixed content.)

## 10. Structured data

- **PASS** — All 4 sampled PDPs carry valid `Product` JSON-LD: name, image, description, `brand: Kairali Products`, sku (e.g. `SHSHA0060NP0925`), offers with price (`792.0 INR`), availability `InStock`, url. `WebSite` + `Organization` + `BreadcrumbList` JSON-LD parse without error on every sampled page.
- **LOW** — No `aggregateRating`/`review` markup on PDPs despite on-page "Trusted by 50,000+ Customers" claims — rich-snippet stars forfeited. **Fix M** (review app schema) or note as enhancement. → Deepu backlog.

## 11. Internal links & 404 handling

- **PASS** — Wrong-URL test `https://www.kairaliproducts.in/this-page-does-not-exist-qa-audit-20260716` returns proper **HTTP 404** with a branded page (title "404 Not Found", h1 "Ooops!" — see copy nit above). No soft-404.
- **PASS (partial)** — 34 of 170 unique homepage internal links verified: 33 × HTTP 200, `/account` → 302 to login (expected). **Zero broken (404) internal links found.** Caveat: the remaining 136 could not be verified — Shopify rate-limited the audit client with HTTP 429 after ~30 rapid requests (a bot-protection response to the audit itself, NOT a user-facing defect). Re-run link sweep at ≤1 req/2s or via Playwright weekly pass.

## 12. Image alt attributes (sample)

- **MED** — Large alt-text gaps across templates (counts include lazy-load placeholders, so treat as upper bound): homepage 92 of 192 `<img>` missing/empty alt; collections ~48 of 72–82; PDPs ~43 of 76–130; the-kairali-group 74 imgs / 62 missing. **Fix M:** alt pass on template imagery + top-20 products in Shopify media editor. → Deepu (mechanism) + Anupam/Astha (alt copy). Full image audit = rebuild-scope, skip.

---

## DELEGATION SPLIT

**Deepu (WP/Shopify tech):**
1. Confirm + fix missing contact/enquiry forms (HIGH ×2) — first priority, same day.
2. Remove Magento `{{block}}` leftovers from /pages/thank-you (with Anupam/Astha copy).
3. noindex + de-sitemap 3 thank-you pages and /pages/no-route.
4. Homepage title dangling "-"; h1 fixes (add h1 to collection/page templates, demote logo/PDP duplicates).
5. Disable "Custom Event Setup" analytics overlay in production.
6. hreflang: fix .com return tags / suppress 404 alternates.
7. Kairtis 271-char slug rename — ONLY after Vikash confirms Ads targets (doctrine m).
8. enqurie-now slug + redirect; paste new meta descriptions; alt-text mechanism; (backlog) review schema, cart meta.

**Anupam/Astha (copy):**
1. Rewrite 5 over-length/auto-generated meta descriptions (≤160 chars): contact-us, the-kairali-group, kairtis PDP, treatments-for-ailments, thank-you.
2. find-our-store: "Amazone" → "Amazon", remove "1 Img" placeholder, dedupe "Le marche".
3. Spazyme capsules title "Tablets" → "Capsules"; "Ooops!" → "Oops!"; brand-suffix thin titles (Contact Us, cart).
4. Alt-text copy for template/hero images (with Deepu).

**Sunaj (infra/DNS/server):**
- Nothing found in this pass — no mixed content, TLS fine, robots/sitemap served correctly, 404s return proper status. Only loop in if kairaliproducts.com (hreflang counterpart) turns out to be infra he owns.

**Abilash (escalation, not delegation):**
- Locked-facts email conflict: site shows support@/info@kairaliproducts.com vs LOCKED FACT info@kairali.com — ruling needed before anyone edits.
- Note: this audit deviated from the weekly-rotation Playwright method (external curl/fetch per D-TWO-LANE ruling); mobile-viewport render and `data-cta` firing were therefore not checked.

---
## 2026-07-16 16:20:17 IST — BROWSER CONFIRMATION (main-session agent)
The two no-form findings are **CONFIRMED in a rendered browser session** (Chrome, logged-out view, 1920×907): /pages/contact-us renders NO form of any kind — interactive elements are nav links, tel/mailto links, cart drawer, WhatsApp button and the Priya chatbot only. Upgraded CONFIRMED-HIGH: the primary lead page of the #1 revenue surface collects nothing. (/pages/enqurie-now assumed same pattern — Deepu verifies both when fixing.)
