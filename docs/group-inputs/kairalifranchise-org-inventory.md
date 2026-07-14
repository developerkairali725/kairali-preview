# kairalifranchise.com — Legacy Site Inventory & Franchise-Offer Mining

**Mined:** 2026-07-14 23:47:22 IST
**Entity/register:** Kairali Ayurvedic Group — FRANCHISE lead-gen (register A, group). Audience = franchise investors, India + international.
**Access method:** curl with browser UA (no Cloudflare challenge encountered; site served directly).
**Read-only.** No writes, no form submissions.

---

## 0. CRITICAL DOMAIN FINDING — the brief's domain is a redirect

- `https://kairalifranchise.com/` **301/302-redirects to `https://ayurvedafranchise.com/`** (confirmed: `curl -L` lands on `ayurvedafranchise.com` with HTTP 200; a bare HEAD to kairalifranchise.com returned 405).
- **`ayurvedafranchise.com` is the live franchise site.** All content below is from there.
- Both `kairali.com`-family and `.aspx` legacy URLs still appear as internal links (see Broken Links). The current site is a **WordPress rebuild** of an older **ASP.NET (.aspx)** site; the migration left many dead `.aspx` links behind.

**Platform:** WordPress (generator meta reports `WordPress 7.0.1` — note: no such version exists as of mid-2026; likely spoofed/odd — low-priority flag), **Flatsome** theme 3.20.4, **Contact Form 7** 6.1.4, jQuery 3.7.1. Developer footer: "Powered by OpenLogic Systems" (openlogicsys.com). Fonts: Georgia + Seaweed Script. Brand accent `#b48231` (gold).

---

## 1. URL INVENTORY & STRUCTURE

**robots.txt** (`ayurvedafranchise.com/robots.txt`): standard WP — `Disallow: /wp-admin/`, allow admin-ajax; declares `Sitemap: https://ayurvedafranchise.com/wp-sitemap.xml`. No cloaking rules. Clean.

**Sitemap** (native WP `wp-sitemap.xml`; Yoast `sitemap_index.xml` 404s → no Yoast). Real content pages (posts-page-1):

| # | URL | Topic |
|---|-----|-------|
| 1 | `/` | Home — franchise pitch + 4 models + FAQ teaser + testimonials + awards + enquiry form |
| 2 | `/about-us/` | Brands, founder's message (K.V. Ramesh), management team, mission/vision |
| 3 | `/locations/` | India + World centre list (addresses, phones, emails) |
| 4 | `/franchise-model-opportunity/` | The 4 franchise models described |
| 5 | `/faqs/` | **Real financial terms live here** (royalty, area, fees) |
| 6 | `/success-story/` | Domestic (Hyderabad) + International (Japan) testimonials |
| 7 | `/awards/` | Awards & NABH accreditation list |
| 8 | `/enquire-now/` | CF7 enquiry form |
| 9 | `/contact-us/` | Delhi address, IVR, email |

**Junk / demo content still published** (Flatsome starter demo — NOT real, should be excluded from any rebuild):
- Blog posts: `/hello-world/`, `/welcome-to-flatsome/`, `/velkommen-til-bloggen-min/`, `/a-simple-blog-post/`, `/a-video-blog-post/`, `/just-a-cool-blog-post-with-images/`, `/just-a-cool-blog-post-with-a-gallery-2/`, `/new-client-landed/`, `/welcome-to-flatsome-an-amazing-responsive-and-retina-ready-theme/`
- `featured_item` CPT: lookbook-summer, another-print-package, fl3-print-package, awesome-pencil-poster, portfolio-typography, flatsome-poster-print, magazine, flat-t-shirt-company
- Taxonomies: `/category/uncategorized/`, `/category/style/`

**Locale:** EN (`en-US`) only. No DE/FR, no hreflang. (Register-A group site; no multi-locale requirement stated in brief.)

**Schema:** **NONE** — no JSON-LD / structured data on any page (grep across all 9 pages returned zero `@type`). Rebuild gap.

---

## 2. THE REAL FRANCHISE OFFER (captured exactly as printed)

### Models offered (4)
1. **Standalone Day-Care Centre**
   - *Kairali Ayurvedic Centre* (DOMESTIC market) — full treatment centre; BAMS Ayurvedic Doctor + Kerala therapists; Panchakarma advised where needed.
   - *Kairali Ayurvedic Spa* (INTERNATIONAL market) — wellness spa; can run with or without an Ayurvedic Consultant on board.
2. **Fusion / Shop-in-Shop Concept** — investor brings multiple health/wellness brands under one roof; Ayurveda ("Kairali" brand) is one essential element. Sub-items: Customise Ayurveda Solution, Tailor-made brand SOP, Third-Party Brand Association.
3. **Wellness Hotels & Resorts / Ayurvedic Hospitals** — association with hoteliers to offer Kairali Ayurvedic services inside 5-star resorts/hotels; also offered to Ayurvedic Hospitals/Clinics.
4. **(Home page also groups these as:** Franchise Model/Opportunity · Standalone Day Care Centre · Wellness Hotels & Resorts/Ayurvedic Hospitals · Fusion/Shop-in-Shop.)

### Financial & operational terms — REAL figures (from /faqs/)
| Term | Value (verbatim) |
|------|------|
| **Royalty — Domestic** | **Rs. 25,000.00 or 5% of net sales from services, whichever is higher; monthly + applicable tax** |
| **Royalty — International** | **USD 1000.00 or 7% of net sales, whichever is higher; charged monthly, collected quarterly** |
| **Area — 2 Treatment Room model** | **1500 sq. ft.** |
| **Area — 4 Treatment Room model** | **2100 sq. ft.** |
| **Setup time** | ~**90 days** post licensing/admin (varies by location) |
| **Minimum distance between Kairali centres** | **10 km – 15 km** (territory protection) |
| **Franchise fee discounts** | "can be discussed & negotiated" — no figure |
| **Products** | Kairali has own mfg unit at **Pollachi, Tamil Nadu**; **150+** products (classical/patent/cosmetic) |

### What Kairali provides (support)
- Interior/ambience design + project consultants (layouts).
- Ayurveda equipment (carved massage beds, brass utensils, toiletries, towels).
- Own product line (medicines, oils, cosmetics, teas).
- Marketing: start-up + ongoing marketing/advertising plans, offline+online, fairs & exhibitions "at no extra cost", SOP development.
- Staffing: recruits, trains & places Ayurvedic Doctor/Consultants & Therapists (on franchisee's payroll, "affordable cost"); franchisee hires housekeeping/reception/accounts/GRE locally.
- Training: "will train, educate and support" — no spa-industry background required.

### Eligibility / who it's for
Entrepreneurs/investors in healthcare/wellness; hoteliers (for model 3); no prior spa/Ayurveda background required. No stated net-worth or credential bar.

### Locations sought
"Various parts of country" (India) + international. No specific target-city list published.

---

## 2a. UNVERIFIABLE / MISSING FIGURES — FLAGGED, NOT FILLED (rule 6)

- **Upfront investment / franchise fee / technical service fee: NOT PUBLISHED on any reachable page.** The FAQ "average investment and technical service fees" answer points to two links that **both 404**:
  - `ayurvedafranchise.com/treatment-centre-franchise-india.aspx` → **404**
  - `ayurvedafranchise.com/spa-franchise-international.aspx` → **404**
  → The core investment number a franchise investor needs is effectively **absent**. Must be obtained from Kairali (Abilash) before any rebuild states a figure. **Do NOT invent.**
- **ROI / payback period:** not stated anywhere.
- **Contradictory heritage/scale numbers across pages** (do not reconcile — confirm with Abilash):
  - Founding: footer "**Since 1908**" vs home/about "founded **1989**" vs "**over two decades ago, 1989**" vs pharma division "**1948**" vs "**10 decades**".
  - Scale: "**35 centres in 9 countries**" (success-story) vs "**25 centers**" (founder's message) vs locations page lists **~13** addresses.
- **Public contact email deviation:** site uses **`franchise@kairali.com`** (+ IVR **+91-9555156156**), NOT the locked group email `info@kairali.com`. Flag — confirm which is canonical for the rebuild. (Locations page also exposes `delhi@kairalicentres.com`, `info@kairalihyd.com`, `retrofit@kairalicentres.com`, `kairalispa@ayus.co.jp`, `info@kairali.mu`.)

---

## 3. PER-PAGE NOTES (topic · CTAs · forms · banned words)

- **Home** — CTA banner "START YOUR AYURVEDA JOURNEY TODAY"; "Know More" (FAQ), "Read More" (testimonials/awards); inline **Enquire Now** form (Name / Phone / E-mail / Address / message). Contact block: Delhi address, IVR, `franchise@kairali.com`.
- **About-us** — Founder's message (K.V. Ramesh, Chairman & MD); team: Gita Ramesh (MD), **Abhilash K.R. (Director)**, Abishek K.R. (Director). Mission/Vision. No form.
- **Locations** — India + World tabs. Addresses/phones/emails for: New Delhi-Mehrauli, Vadodara, Hyderabad-Banjara Hills, Hyderabad-Kukatpally, Patna; Intl: Prague (Czech), Japan ×3 (Yamaguchi/Setagaya/Yokohama via ayus.co.jp), Mauritius (kairali.mu). All "Website" links are dead `.aspx`.
- **FAQs** — 13 Q&A; the financial source-of-truth page (see §2).
- **Contact-us** — Delhi address; IVR +91-9555156156; `franchise@kairali.com`; "Free Ayurvedic Consultation" heading. No visible form fields on this page.
- **Success-story** — headline "over 10 Decades… 35 centres in 9 countries"; testimonials: Mr. Shyam Sundar (Hyderabad/master franchise), Ms. Wakaba Nishida (Japan).
- **Awards** — NABH Panchakarma Clinic (Delhi centre); ~16 award lines (National Geographic Top 10 Asia/Top 50 wellness; World Travel Award; Spa Asia Crystal; TripAdvisor 2018; etc.). Several typos ("Nationaal", "Clinnic", "Cerrtificate", "off the Year").

### KTAHV language-lock check
This is a **register-A group/franchise** page-set, so the KTAHV clinical lock does NOT apply site-wide. **However**, the copy is saturated with hospitality-register words — **spa, resort, luxury, guests, journey, cure** — including in passages that reference the **NABH hospital / KTAHV healing village** (e.g. awards page mixes "NABH Panchakarma Clinic" with "Best Luxury Destination Spa", "India's Leading Spa Resort"; about-us uses "cure", "guests"). For any rebuild, KTAHV/hospital references must be de-coupled from spa/resort/luxury framing per the clinical lock. Flagging for register discipline in the rebuild, not as a violation of the current legacy site.

---

## 4. ENQUIRY FORM (/enquire-now/) — fields & compliance

Contact Form 7 (`wpcf7-f657-p586-o1`), POST to `/enquire-now/`. Fields:
- Name* (`your-name`, text) · Phone No* (`PhoneNo`, tel) · E-mail* (`your-email`, email)
- Country* (`country`, full ISO country `<select>`) · State* (`state`) · City* (`city`) — cascading selects
- Subject* · Your message* (textarea)
- Hidden: standard CF7 tokens + `_wpcf7_recaptcha_response` → **Google reCAPTCHA (v3)** active.

**Compliance gaps:**
- **NO consent / GDPR / privacy-policy checkbox** (no CF7 `acceptance` field). For an India+international lead-gen form this is a gap — the rebuild's `packages/forms` must add boolean consent (Satyam spec).
- Home-page mini-form collects only Name/Phone/Email/Address/message.
- No visible privacy-policy link near the form.

---

## 5. SECURITY / SPAM-INJECTION SCAN (kairalicenters.com-style check)

- **Pharma/SEO spam scan** (viagra/cialis/casino/payday/loan/replica/betting/hidden-div/negative-text-indent) across all 9 pages: **CLEAN.** The single "cialis" substring hit on success-story was a **false positive** inside the word "spe**cialis**ed" — verified in context, not spam.
- **Outbound domains:** all legitimate — ayurvedafranchise.com (self), openlogicsys.com (developer), ayus.co.jp / kairali.mu / kairalicentres.com / kairalicenters.com (Kairali's own network), google.com (reCAPTCHA), w3.org/gmpg.org/api.w.org (standard WP). **No injected/foreign spam domains, no cloaking, no hidden link farm.**
- **Verdict: NO hacked-WP spam injection found.** (Contrast: the kairalicenters.com case.)
- Minor hygiene notes (not security incidents): `xmlrpc.php` pingback enabled; generator version string odd ("WordPress 7.0.1"); Flatsome demo content still published.

---

## 6. BROKEN LINKS (migration debris — all confirmed 404)

Footer "USEFUL LINKS" (present on every page) point to relative `.aspx` files that no longer exist:
`why-franchise-with-kairali.aspx`, `kairali-franchise-support.aspx`, `accreditation.aspx`, `initialinvestment.aspx`, `media-gallery.aspx`, `news-and-articles.aspx` — **all 404**. Plus the two investment `.aspx` links in the FAQ (§2a). All "Website:" links on the Locations page are dead `.aspx` too. Entire secondary information architecture (Why Franchise / Support / Accreditation / Investment / Media / News) is **linked but missing** — content likely lost in the ASP.NET→WP migration. Confirm with Abilash whether that content exists anywhere to recover.

---

## 7. IMAGES

Downloaded to `/Users/kairalimacmini/Claude/Kairali-Digital/image-library/legacy-kairalifranchise/` with `manifest.tsv` (filename · bytes · source_url). **35 content images ≥25KB kept** (24 sub-25KB icons/bullets skipped) — includes director portraits (Ramesh, Gita, Abhilash, Abishek), award logos (NABH, Nat Geo, World Travel, etc.), healing-village/centre banners, model tiles (Domestic/International market), location photos. All from `/wp-content/uploads/2022/07/`.
