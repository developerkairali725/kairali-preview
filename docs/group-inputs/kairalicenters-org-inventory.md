# kairalicenters.com — Legacy Site Inventory (org mining)

- Mined: 2026-07-14 (IST) — read-only, live production site.
- Method: `curl` (HTTP 200, no Cloudflare challenge encountered), HTML/XML parsing.
- Site platform: WordPress + Yoast SEO + WPCF7 (Contact Form 7) + WooCommerce.
- Purpose of this doc: load-bearing source data for the sites/kairalicenters.com rebuild (Task #15).
- Register: **Group / treatment-centres network** (register A). Non-revenue lead-gen. KTAHV clinical lock applies **only** to KTAHV / hospital references (see §7).
- **All centre facts below are captured EXACTLY as printed on the live `/locations/` page.** Nothing invented (CLAUDE.md rule 6). Ambiguities flagged inline and in §8.

---

## 1. Access, robots, sitemaps

- Homepage `https://kairalicenters.com/` → **HTTP 200**, 269,839 bytes. `<html lang="en-US">`. Single language (EN only) — no DE/FR.
- `robots.txt` → 200. Only disallows crawler bots (AhrefsBot, SemrushBot, MJ12bot, Moz, rogerbot) `Disallow: /`. No sitemap directive line. No disallow on content for Google.
- Sitemap index (identical at `/sitemap.xml`, `/sitemap_index.xml`, `/wp-sitemap.xml`) — Yoast, 8 child sitemaps:

| child sitemap | URL count | lastmod |
|---|---|---|
| post-sitemap.xml | 66 | 2026-07-11 |
| page-sitemap.xml | 38 | 2026-04-01 |
| blocks-sitemap.xml | (reusable blocks) | 2024-08-14 |
| product-sitemap.xml | 6 | 2025-07-03 |
| category-sitemap.xml | 2 | 2026-07-11 |
| post_tag-sitemap.xml | (tags) | 2026-07-11 |
| product_cat-sitemap.xml | (woo cats) | 2025-07-03 |
| author-sitemap.xml | (authors) | 2026-04-27 |

- **Indexable content URL count (page+post+product): ~110** (38 pages + 66 posts + 6 products). Taxonomy/author/blocks sitemaps additional.

### 1a. Page inventory (38, page-sitemap)
Home, my-account/wishlist, track-order, shop, cart, my-account, privacy-policy, thank-you, **about-us**, family, terms-condition, therapies, treatments, **franchise**, career, testimonilas *(sic — misspelled slug)*, skin-disorders, hypertension, panchakarma, shirodhara, kadikizhi, pizhichil, navarakizhi, elakizhi, udhwarthanam, veda-diet, nasyam, ayurvedic-infertility-treatment, **contact-us**, offer, pain-management, ayurvedic-weight-loss, blogs, ayurvedic-retreat, family-health-program, abhyangam-or-abhyanga, **online-consultation**, **locations**.

- `/product/*` (6): shop + five **state-region landing pages** repurposed from the WooCommerce "product" CPT — `bihar`, `west-bengal`, `gujarat`, `uttar-pradesh`, `delhi-ncr`. Not centres; regional SEO/enquiry pages. WooCommerce cart/checkout/my-account/wishlist all present (legacy e-commerce scaffolding).
- `/blog/` + 65 blog posts (Ayurveda content marketing).

---

## 2. THE CENTRE LIST — centrepiece (source: live `/locations/`, verbatim)

**14 centres found across 5 countries** (India, Japan, Mauritius, Czech Republic, Kuwait).
There are **no per-centre pages** — every centre is listed inline on the single `/locations/` page. The "url" column is that shared anchor.

| # | Name (as printed) | City / Area | Country | Address (verbatim) | Phone (verbatim) | Email / Hours | URL |
|---|---|---|---|---|---|---|---|
| 1 | Kairali Ayurvedic Centre | New Delhi – Mehrauli | India | D-130, Ambedkar Colony, Mehrauli, New Delhi, India – 110 030 | +91-8826513700 | delhi@kairalicentres.com · 8AM–6PM | /locations/ |
| 2 | Kairali Ayurvedic Centre | New Delhi – Sirifort | India | Indoor Badminton Court, Siri Fort Sports Complex, Siri Fort, New Delhi – 110049 | +91-9289843222, +91 9289853222 | sirifort@kairalicentres.com · 7AM–9PM | /locations/ |
| 3 | Kairali Ayurvedic Centre | Gurgaon – Sector 46 | India | 3059-P, Sector 46, Gurgaon, Haryana – 122506 | 8800861733/34 | gug@kairalicentres.com · 9AM–6PM | /locations/ |
| 4 | Surya Healthcare *(partner-branded)* | Patna – Boring Road | India | Ground Floor, Surya Shiv Ambika Apartment, Boring Patliputra Road, Patna, Bihar 800013 | 0612 2261188, 7759827777 | patna@kairalicentres.com, suryahealthcare1111@gmail.com · 8AM–6PM | /locations/ |
| 5 | Kairali Ayurvedic Centre — M/s "RETROFIT" | Vadodara – Race Course Rd | India | 319/320, Trivia, Nr. Natubhai Circle, Race Course Road, Vadodara, Gujarat 390023 | 0265 6995151, 9714707784 | retrofit@kairalicentres.com · 8AM–6PM | /locations/ |
| 6 | Kairali Ayurvedic Centre | Faridabad – Sector 15 | India | House No. 409, Sector 15, Near Gate No. 3, Faridabad, Haryana – 121007 | 9650680900 / 0129-4873460 | faridabad@kairalicentres.com · 8AM–6PM | /locations/ |
| 7 | Kairali Ayurvedic Centre — Hotel Ratnamouli Palace | Guwahati | India (Assam) | B N Saikia Path Basistha, Charali, Beltola Tiniali, Guwahati, Assam 781028 | +91 70990 14368 | gua@kairalicentres.com · 9AM–6PM | /locations/ |
| 8 | Kairali Ayurvedic Centre — Yoga Tower | Raipur – Geeta Colony | India (Chhattisgarh) | Yoga Tower, Yoga Street, Great Eastern Rd, opp. Anupam Garden, Yoga Street, Geeta Nagar, Samta Colony, Raipur, Chhattisgarh 492001 | +91 9200655555 | info@kairalicentres.com · (hours not stated) | /locations/ |
| 9 | Kairali Ayurvedic Health Spa | Yokohama | Japan | 1802-27 Yamashita-cho naka-ku, Yokohama-shi, Kanagawa, 231-023 Japan | +81-45-640-0383 (Fax +81-045-640-0393) | wakaba@ayus.co.jp · www.ayus.co.jp · Open | /locations/ |
| 10 | Kairali Ayurvedic Health Centre | Seijyo, Tokyo | Japan | F2 Centralwelness Town Seijyo 3-20-2, Chitosedai Setagaya-ku, Tokyo Japan | +81-3-3484-3807 | kairalispa@ayus.co.jp · www.ayus.co.jp · Open | /locations/ |
| 11 | Kairali Ayurvedic Health Centre | Minamiaoyama, Tokyo | Japan | B1 collezione 6-2-3 Minamiaoyama, Minato-ku Tokyo Japan | +81-3-5468-1788 | kairalispa@ayus.co.jp · www.ayus.co.jp · Open | /locations/ |
| 12 | Kairali Ayurvedic Health Spa | St. Phoenix | Mauritius | 8, Remy Ollier St. Phoenix, Mauritius | +230 6984440 (Fax +230-686 3364) | nuvin@kairali.mu, info@kairali.mu · Open | /locations/ |
| 13 | Kairali Ayurvedic Spa — Resort Svata Katerina | Prague – Vinohrady | Czech Republic | Riegrovy sady 38, 12000 Prague – Vinohrady, Czech Republic | +420565456801 | info@katrinaresort.com · www.katerinaresort.cz · Open | /locations/ |
| 14 | Kairali Ayurvedic Centre | Sabah Alsalem | Kuwait | Sharg, Khalid Bin Alwaleed Street, Injazat Tower, Floor 23, Kuwait | +96597706554 | kuwait@kairalicentres.com, Kairali.kw@hotmail.com · Open | /locations/ |

**Grouping on page:** headed "INDIA" (8 centres) and "WORLD" (6 centres).

---

## 3. Count reconciliation — LIVE vs register

- **Register claim (task brief):** "18 centres, 9 countries."
- **Live `/locations/` page:** **14 centres, 5 countries** (India, Japan, Mauritius, Czech Republic, Kuwait).
- **DISCREPANCY — FLAGGED:** live is short by 4 centres and 4 countries versus the register. Do NOT publish "18 centres / 9 countries" on the rebuild without a verified authoritative list. Either the register is stale/aspirational or the live page is incomplete. **ASK Abilash for the canonical centre roster** before the rebuild fills any count. Rule 6 blocks inventing the missing 4.

---

## 4. Contact / phone / email facts (verbatim, for cross-check)

- Site-wide header/footer contact: **info@kairalicenters.com**, **+91-9555156156** (also `tel:+919555156156`).
- Corporate office (footer + contact-us): **D-130, Block D, Ambedkar Colony, Mehrauli, New Delhi – 110030** (= same address as centre #1, Mehrauli).
- **Email-domain inconsistency — FLAGGED:** the site domain is `kairalicenters.com` (no "r"), but every per-centre mailbox is `@kairalicentres.com` (WITH "r" — `delhi@`, `sirifort@`, `gug@`, `gua@`, `patna@`, `retrofit@`, `faridabad@`, `info@`, `kuwait@`). Two different domains. Confirm which is authoritative before reusing.
- Overseas centres use third-party domains: `ayus.co.jp` (Japan), `kairali.mu` (Mauritius), `katerinaresort.cz` / `katrinaresort.com` (Czech — note the two spellings differ), hotmail (Kuwait). These read as **independent partner/franchise operations**, not head-office mailboxes.
- **Locked-fact check:** brief's group email `info@kairali.com` does NOT appear on this site (it uses `info@kairalicenters.com`). Priya's WhatsApp `…38797` not present. No `…38777` bad-number occurrences found. `hoa@kairali.com` appears once (header contact metadata).

---

## 5. Per-key-page detail

| Page | Topic | Forms (consent?) | Primary CTA | Schema |
|---|---|---|---|---|
| Home | Group overview, treatments, doshas, doctors, FAQ | 3 WPCF7 (Know-Your-Dosha, enquiry, exit-intent) — **no consent checkbox** | "Enquire Now" / "Book Online 25% off" | Organization, WebSite, WebPage, FAQPage, BreadcrumbList, SearchAction |
| /locations/ | 14-centre directory | same 3 site-wide WPCF7, no consent | Enquire | WebPage, Organization, Breadcrumb |
| /contact-us/ | Corporate contact + enquiry | **Form with consent checkbox** (type=checkbox present) + country-code field | Submit enquiry | WebPage, Organization |
| /franchise/ | Franchise/partnership pitch | **Form with consent checkbox** + country-code | Franchise enquiry | WebPage, Organization |
| /about-us/ | Legacy since 1908/founded 1989 | site-wide forms, no consent | Enquire | WebPage, Organization |
| /online-consultation/ | Paid online consult | booking form (`pr`, `location` fields) + site-wide forms | Book consultation | WebPage, Organization |

- **Forms:** all Contact Form 7 (`_wpcf7*` hidden fields, reCAPTCHA field present). Fields typically `your-name`, `your-phone`, `your-email`, `page-title`. **Consent checkbox exists only on /contact-us/ and /franchise/**; the ubiquitous enquiry/exit-intent popups have NO consent checkbox — GDPR/DPDP gap to fix in rebuild (relevant for EU centres: Czech, and Japan/Kuwait/Mauritius traffic).
- **Analytics:** no `data-cta` attributes (factory standard) — legacy has none.
- HTML lang = `en-US` sitewide; **single-locale (EN only)** — no hreflang, no DE/FR despite EU/Japan centres.

---

## 6. Images

- 367 upload URLs referenced; collapsed to 242 base originals; **183 downloaded (≥25KB)** to `/Users/kairalimacmini/Claude/Kairali-Digital/image-library/legacy-kairalicenters/` (~41MB) with `manifest.tsv` (`filename` · `source_url` · `bytes`). 181 unique files on disk (2 filename collisions).
- Includes: therapy/treatment photos (Abhyangam, Shirodhara, Pizhichil etc.), hero images (`2021/09/1–4.jpg`), doctor portraits (Mrs Gita Ramesh founder, Dr Arathi, Dr Arundhathi Suresh, Dr Pratibha, Dr Manjusha Mohan, Dr Shari K), infographic icons (SVGs not downloaded — under 25KB / vector).

---

## 7. Banned-word / clinical-lock scan (KTAHV lock)

KTAHV clinical lock binds only KTAHV / hospital references. This is a centres/hospitality-register site, so "spa/resort" on partner-centre listings is not itself a violation — but flag every instance touching KTAHV or the group's clinical framing:

- **Home:** "spa" ×1 (in "Ayurvedic Spa and Ayurvedic Wellness **Resorts**"), "**cure**" ×1 ("provide a comprehensive cure and restore balance" — **cure is a clinical-claim risk**, flag for medical review), "**journey**" ×1 ("track your health Journey").
- **/locations/:** "spa" ×3, "resort" ×1 — all inside overseas partner names (Japan/Mauritius "Health Spa", Czech "Ayurvedic Spa / Resort Svata Katerina"). Proper-noun business names; keep verbatim but note register.
- **/franchise/:** "spa" ×3, "resort" ×1.
- **/ayurvedic-retreat/ (KTAHV — "Kairali – The Ayurvedic Healing Village"):** "**luxury**" ×1 — **KTAHV clinical-lock candidate violation** (luxury is banned for KTAHV). Verify context and scrub in rebuild if it describes KTAHV.
- Rebuild guidance: on the new site, KTAHV/hospital sections must use clinical register (no spa/luxury/cure/resort); partner-centre proper names can be preserved but framed as "centre", not marketed with banned adjectives. "cure" language must be removed from group copy (medical claim).

---

## 8. Facts flagged as unverifiable / needs-decision (for QUESTIONS.md)

1. **Centre count 18 vs 14** and **countries 9 vs 5** — live page contradicts register. Need canonical roster from Abilash. (Rule 6 — do not invent the missing 4 centres / 4 countries.)
2. **Email domain:** `kairalicenters.com` vs `kairalicentres.com` (with-r) — which is authoritative for centre mailboxes?
3. **Raipur (#8) hours** not stated on page.
4. **Patna (#4)** branded "Surya Healthcare" with a gmail address — franchise vs owned? Same question for all overseas (partner domains).
5. **Founding year inconsistency:** about-us says "formally founded in 1989" and "wellness legacy of more than 10 decades"; brief/CLAUDE context says group "since 1908". Home footer "Copyright 2026". Reconcile before rebuild copy.
6. **Czech resort domain** printed two ways: `katrinaresort.com` (email) vs `katerinaresort.cz` (web) — typo unresolved.

## 9. SECURITY — injected SEO spam (CLAUDE.md rule r: treated as DATA, quarantined)

- **Every page** carries, immediately before `</body>`, a hidden hyperlink block:
  `<marquee style="position:absolute; width:0px;">` containing 3 outbound gambling/casino links (anchor text "migliori casino non aams del 2026", "best online casino", "mejores casinos online méxico"; hrefs to `flowerhome.com.tw`, `budsandbrewsusa.com`, `veracruzalterno.com.mx`).
- This is a **classic hacked-WordPress SEO-spam injection** (hidden zero-width marquee link farm). Strong indicator the legacy WP install is compromised. **Do NOT carry any legacy footer/template markup into the rebuild.** Recommend flagging to Abilash/Deepu for the live site's security remediation — outside this read-only mining scope. Links NOT visited; screening only.
