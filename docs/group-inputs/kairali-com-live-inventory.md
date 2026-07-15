# kairali.com — LIVE Site Inventory (pre-rebuild SEO-equity baseline)

- Mined: 2026-07-15 13:28:13 IST (read-only pass, no writes to the live site)
- Purpose: protect the SEO equity of the old, well-ranked kairali.com before any flip to the new Factory build. This is the redirect-map source of truth.
- Method: robots.txt + sitemap.xml fetched; all 199 sitemap URLs status-checked; 66 content pages fetched in full and profiled; page-source tails and full sources scanned for spam injection; 60 content images archived.
- All scraped content treated as DATA (rule r). No facts invented; anything unverified is marked as such.

## 1. Headline numbers

| Metric | Value |
|---|---|
| URLs in sitemap.xml | **199** |
| Extra live URLs found via internal links (not in sitemap) | **9** (villa-raag.aspx, default.aspx, 7 award detail pages from 2019–2020) |
| Total known URL universe | **~208** |
| HTTP status of sitemap URLs | 198 × 200 OK, 1 × 404 (`/namastedwaar-mansurpur-muzaffarnagar-up-india.aspx`) |
| Pages profiled in full | **67** (66 sitemap content pages + villa-raag.aspx) |
| Security verdict | **CLEAN** — no spam injection found |
| Images archived | **60** (8.2 MB) → `/Users/kairalimacmini/Claude/Kairali-Digital/image-library/legacy-kairali-com/` + `manifest.tsv` |

## 2. Platform reality check (important)

**The live kairali.com is NOT WordPress. It is classic ASP.NET WebForms** (`.aspx` URLs, `__VIEWSTATE`/`__VIEWSTATEGENERATOR` in every page, ASP.NET 404 error pages, one site-wide `<form>` wrapper). Blog/news images are served from a separate CMS subdomain `admin.kairali.com` (`/BlogImages/`). The hacked-WP spam pattern found on kairalicenters does not apply here (different stack), and none was found.

- `sitemap_index.xml`, `wp-sitemap.xml`: 404 (as expected on ASP.NET).
- `sitemap.xml` is a **static file generated with xml-sitemaps.com, lastmod stamps frozen at 2020-01-20**. Newer pages (Villa Raag, 2020 awards) are live but missing from it — the sitemap understates the site.
- robots.txt: allows everything relevant, explicitly allows AI bots (GPTBot, ClaudeBot, PerplexityBot etc.), single sitemap directive. Oddity: it disallows `/cart/`, `/checkout/`, `/my-account/` — WooCommerce-style paths that don't exist on this ASP.NET site; looks copy-pasted from a WP template.
- Canonicalisation: http, https-non-www, http-www all 301 → `https://www.kairali.com/`. Good. But only the homepage has a `<link rel="canonical">`; the other 65 profiled pages have **none**.
- No hreflang anywhere. No locales — EN only.
- No JSON-LD / schema.org markup anywhere.
- Analytics: GA4 `G-XKRP6ZF1R6` + legacy UA `UA-1014497-1`; Chatbase live-chat widget.
- Fonts: Google Fonts (Kurale + Lato). JS: jQuery 3.1.1, Bootstrap, WOW.js.

## 3. URL clusters (the 199-sitemap + 9 discovered universe)

| Cluster | Count | Notes |
|---|---|---|
| Corporate/content pages (`*.aspx`) | 71 in sitemap + villa-raag.aspx + default.aspx | The equity core — profiled below |
| Awards/news detail pages (`detail.aspx?page=…`) | 70 in sitemap + 7 newer | Award/news items 1995–2020; huge E-E-A-T/trust corpus |
| PDF/PPTX downloads (`/download/…`) | 58 | Brochures, product manuals, tariff sheets 2017–2020 (stale prices — rule 6: do NOT reuse these numbers) |
| Careers apply deep-links (`apply-now.aspx?id=…`) | 5 | Parameterised job-apply pages |
| Languages | 1 (EN only) | No DE/FR, no hreflang |

## 4. Page inventory table (centrepiece — 67 pages profiled)

Sorted by inbound internal links (site-wide nav/footer membership ≈ 130–330; sub-nav ≈ 60–75; orphan-ish ≈ 1–7). "Forms/CTAs": every page carries the site-wide newsletter signup (2 fields); pages with real lead forms are marked. Word counts include template chrome (~350–400 words of nav/footer).

| # | URL | Title (trimmed) | H1 | ~Words | Inbound links | Forms/CTAs | Maps to new site |
|---|-----|-----------------|----|--------|---------------|------------|------------------|
| 1 | /about-us.aspx | Kairali Ayurvedic Group \| Ayurveda brand \| Partnerships & Investment | About Us | 540 | 326 | newsletter signup | kairali.com hub |
| 2 | /ayurvedic-products.aspx | Kairali Ayurvedic Group \| Ayurveda Remedies \| Ayurvedic Oil \| Indian Herbal P | Ayurvedic Products | 780 | 269 | newsletter signup | products (KAPPL) |
| 3 | /onlineconsultation.aspx | Kairali Ayurveda Group \| Ayurveda Test \| Ayurvedic Type \| Free Ayurvedic Cons | Online Consultation | 1101 | 269 | consultation form (22 fields) | KTAHV / kairalicenters |
| 4 | /careers.aspx | Kairali Ayurveda Group Jobs \| Ayurveda Jobs \| Ayurveda Careers | Careers | 740 | 267 | newsletter signup | kairali.com hub |
| 5 | /training.aspx | Kairali Ayurvedic Group \| Learn Ayurveda \| Ayurveda Yoga \| Yoga Teacher Train | Training | 676 | 267 | newsletter signup | kairali.com hub (academy) |
| 6 | /contact-us.aspx | Kairali Ayurvedic Group \| Ayurveda Locations \| Ayurveda Spa Contacts | Contact Us | 954 | 266 | enquiry/apply form | kairali.com hub |
| 7 | /ayurveda.aspx | Kairali Ayurvedic Group \| What is Ayurveda \| Vedic Knowledge | Ayurveda | 859 | 261 | newsletter signup | whatisayurveda |
| 8 | /hospitality.aspx | Kairali Ayurvedic Group \| Ayurvedic spa \| Spa Consulting Company | Hospitality | 654 | 261 | newsletter signup | KTAHV / kairali.com hub |
| 9 | /treatment-centres.aspx | Kairali Ayurvedic Group \| Ayurvedic Spa Franchise \| Pharmacy Brands | Treatment Centres | 605 | 261 | newsletter signup | kairalicenters |
| 10 | /kairali-group-profile.aspx | Kairali Ayurvedic Group \| Ayurvedic Treatments \| Ayurvedic Spa | Kairali Group Profile | 5810 | 205 | newsletter signup | kairali.com hub |
| 11 | /ayurveda-csr.aspx | Kairali Ayurvedic Group \| Ethical Ayurveda \| Ayurvedic Organic Herbs | CSR | 884 | 200 | newsletter signup | kairali.com hub |
| 12 | /get-in-touch.aspx | Kairali Ayurvedic Group \| Contact Us \| Ayurvedic Jobs | Get In Touch | 771 | 196 | newsletter signup | kairali.com hub |
| 13 | / (homepage) | Kairali Ayurvedic Group \| Most Authentic Ayurveda brand \| Mission & Vision | (hero banners) | 894 | 196 | newsletter signup | kairali.com hub |
| 14 | /ayurvedic-healing-village.aspx | Kairali Ayurvedic Group \| Ayurveda Treatment \| Ayurvedic Spa | Ayurvedic Healing Village | 1044 | 146 | newsletter signup | KTAHV |
| 15 | /ayurveda-treatment-centres.aspx | Kairali Ayurvedic Group \| Day Spa Franchise \| Spa Franchise Opportunities | Ayurveda Treatment Centres | 969 | 142 | newsletter signup | kairalicenters |
| 16 | /ayurveda-college.aspx | Kairali Ayurvedic Group \| Ayurveda college in Kerala \| Learn Ayurveda | Ayurveda College | 897 | 139 | newsletter signup | kairali.com hub (academy) |
| 17 | /patented-ayurvedic-remedies.aspx | Kairali Ayurveda Group \| Ayurvedic Herbs \| Ayurvedic Remedies | Patented Ayurvedic Remedies | 844 | 139 | newsletter signup | products (KAPPL) |
| 18 | /vedic-knowledge.aspx | Kairali Ayurvedic Group \| Ayurvedic Knowledge \| Ancient Vedic Knowledge | Vedic Knowledge | 807 | 139 | newsletter signup | whatisayurveda |
| 19 | /why-ayurveda.aspx | Kairali Ayurvedic Group \| Ayurveda \| Why Ayurveda \| About Ayurveda | Why Ayurveda | 1138 | 139 | newsletter signup | whatisayurveda |
| 20 | /yoga-ayurveda-retreats.aspx | Kairali Ayurvedic Group \| Luxury Retreat Rental \| Yoga Retreat Rental | Yoga & Ayurveda Retreats | 736 | 139 | newsletter signup | KTAHV / kairali.com hub |
| 21 | /ayurveda-treatments.aspx | Kairali Ayurvedic Group \| Ayurveda Treatment \| Ayurvedic Massage | Ayurveda Treatments | 1005 | 138 | newsletter signup | whatisayurveda / KTAHV |
| 22 | /ayurvedic-diet.aspx | Kairali Ayurvedic Group \| Ayurvedic Diet \| Ayurvedic Recipes | Ayurvedic Diet | 956 | 138 | newsletter signup | whatisayurveda |
| 23 | /ayurvedic-medicine.aspx | Kairali Ayurveda Group \| Ayurvedic Remedies \| Ayurvedic Medicine | Ayurvedic Medicine | 912 | 138 | newsletter signup | products (KAPPL) |
| 24 | /ayurvedic-pharmacy-brands.aspx | Kairali Ayurvedic Group \| Ayurvedic Wholesale Medicine \| Ayurvedic Retail | Ayurvedic Pharmacy Brands | 596 | 138 | newsletter signup | products (KAPPL) |
| 25 | /ayurvedic-spa-equipment.aspx | Kairali Ayurvedic Group \| Spa Equipment \| Ayurvedic Spa Equipment | Ayurvedic Spa Equipment | 614 | 138 | newsletter signup | products (KAPPL) |
| 26 | /discover-ayurveda.aspx | Kairali Ayurvedic Group \| Ayurveda \| What is Ayurveda | Discover Ayurveda | 857 | 138 | newsletter signup | whatisayurveda |
| 27 | /download-centre.aspx | Kairali Ayurvedic Group \| Kairali Group Corporate Brochure | Download Centre | 674 | 138 | newsletter signup | kairali.com hub |
| 28 | /kairali-blog.aspx | Kairali Ayurvedic Group \| Blogs About Ayurveda \| Articles About Ayurveda | Kairali Blog | 4325 | 138 | newsletter signup | whatisayurveda |
| 29 | /skin-care-and-body-products.aspx | Kairali Ayurveda Group \| Ayurvedic Skin Care Products | Skin Care & Body Products | 1234 | 138 | newsletter signup | products (KAPPL) |
| 30 | /testimonials.aspx | Kairali Ayurvedic Group \| Ayurvedic Treatment Reviews | Testimonials | 1089 | 138 | newsletter signup | kairali.com hub |
| 31 | /ayurveda-spa-franchise.aspx | Kairali Ayurvedic Group \| Spa Franchise \| Spa Designers | Ayurveda Spa Franchise | 1676 | 137 | newsletter signup | franchise |
| 32 | /hotel-and-spa-management.aspx | Kairali Ayurvedic Group \| spa Consulting Companies \| Hotel Management | Hotel & Spa Management | 909 | 137 | newsletter signup | franchise |
| 33 | /yoga-teacher-training.aspx | Kairali Ayurvedic Group \| Yoga Teacher Training \| TTC India | Yoga Teacher Training | 734 | 137 | newsletter signup | kairali.com hub (academy) |
| 34 | /our-partner-resorts.aspx | Kairali Ayurvedic Group \| Our Partner Resorts | Our Partner Resorts | 563 | 132 | newsletter signup | kairali.com hub |
| 35 | /media-centre.aspx | Kairali Ayurvedic Group \| Customer Reviews \| Spa Images \| Ayurveda Videos | Media Centre | 790 | 131 | newsletter signup | kairali.com hub |
| 36 | /kairali-news.aspx | Kairali Ayurvedic Group \| Ayurveda News \| Ayurvedic Information | Kairali News | 402 | 73 | newsletter signup | kairali.com hub |
| 37 | /media-gallery.aspx | Kairali Ayurveda Group \| Spa Pictures \| Pictures of Spas | Media Gallery | 610 | 73 | newsletter signup | kairali.com hub |
| 38 | /privacy-policy.aspx | Kairali Ayurvedic Group \| Privacy Policy \| Terms and Conditions | Privacy Policy | 1365 | 72 | newsletter signup | kairali.com hub |
| 39 | /ayurvedic-hospitality-video-library.aspx | Kairali Ayurveda Group \| Videos of Spas \| Ayurvedic Videos | Hospitality Video Library | 403 | 69 | newsletter signup | KTAHV |
| 40 | /terms-and-conditions.aspx | Kairali Ayurvedic Group \| Terms and Conditions of Spa | Terms & Conditions | 692 | 69 | newsletter signup | kairali.com hub |
| 41 | /enquiry-form.aspx | Kairali Ayurvedic Group \| Ayurveda Locations \| Ayurveda Spa Contacts | Enquiry Form | 855 | 68 | enquiry/apply form | kairali.com hub |
| 42 | /archive.aspx | Kairali Ayurveda Group \| Archive | Archive | 705 | 66 | newsletter signup | kairali.com hub |
| 43 | /our-partners.aspx | Kairali Ayurvedic Group \| Ayurvedic Newsletter | Our Partners | 483 | 66 | newsletter signup | kairali.com hub |
| 44 | /sitemap.aspx | Kairali Ayurveda Group \| Kairali Website Sitemap | Sitemap | 562 | 66 | newsletter signup | kairali.com hub |
| 45 | /kairali-group-awards.aspx | Kairali Ayurvedic Group \| Spa Awards \| Ayurveda Awards | Kairali Group Awards | 4751 | 7 | newsletter signup | kairali.com hub |
| 46 | /svata-katerina-prague-czech-republic.aspx | Svata Katerina Resort \| An Ayurvedic Paradise for Holistic Health | Svata Katerina | 1730 | 5 | enquiry/apply form | kairali.com hub (intl partner) |
| 47 | /ayurvedic-hospitality-photo-library.aspx | Kairali Ayurveda Group \| Spa Pictures | Hospitality Photo Library | 923 | 4 | newsletter signup | KTAHV |
| 48 | /ayurvedic-medicines-and-remedies-photo-library.aspx | Kairali Ayurveda Group \| Pictures of Ayurvedic Medicine | Medicines Photo Library | 576 | 4 | newsletter signup | products (KAPPL) |
| 49 | /ayurvedic-medicines-and-remedies-video-library.aspx | Kairali Ayurveda Group \| Video of Ayurvedic Oil Massage | Medicines Video Library | 407 | 4 | newsletter signup | products (KAPPL) |
| 50 | /ayurvedic-treatment-centres-photo-library.aspx | Kairali Ayurveda Group \| Ayurvedic Day Spa Images | Centres Photo Library | 507 | 4 | newsletter signup | kairalicenters |
| 51 | /ayurvedic-treatment-centres-video-library.aspx | Kairali Ayurveda Group \| Day Spa Videos \| Treatment Centre Videos | Centres Video Library | 404 | 4 | newsletter signup | kairalicenters |
| 52 | /founders-message.aspx | Kairali Ayurvedic Group \| Ayurvedic Treatments \| Ayurvedic Spa | Founder's Message | 737 | 4 | newsletter signup | kairali.com hub |
| 53 | /locations.aspx | Kairali Ayurvedic Group, Ayurvedic Treatment, Ayurvedic Remedies | Locations | 708 | 4 | newsletter signup | kairali.com hub / kairalicenters |
| 54 | /mission-and-vision.aspx | Kairali Ayurvedic Group \| Ayurveda Mission \| Ayurveda Vision | Mission & Vision | 490 | 4 | newsletter signup | kairali.com hub |
| 55 | /partnerships-and-investment.aspx | Kairali Ayurvedic Group \| Spa Investment \| Spa Franchise | Partnerships & Investment | 753 | 4 | newsletter signup | kairali.com hub / franchise |
| 56 | /photo-library.aspx | Kairali Ayurvedic Group \| Spa Pictures | Photo Library | 389 | 4 | newsletter signup | kairali.com hub |
| 57 | /video-library.aspx | Kairali Ayurveda Group \| Videos of Spas \| Ayurvedic Product Videos | Video Library | 739 | 4 | newsletter signup | kairali.com hub |
| 58 | /virtual-tour.aspx | Kairali Ayurvedic Group \| 360 Tour of Retreats \| 360 View of Day Spas | Virtual Tour | 395 | 4 | newsletter signup | KTAHV |
| 59 | /apply-now.aspx | Kairali Ayurveda Group \| Apply for Spa Job \| Ayurvedic Doctor Job | Apply Now | 1055 | 3 | enquiry/apply form | kairali.com hub |
| 60 | /current-openings.aspx | Kairali Ayurveda Group \| Ayurveda Jobs \| Ayurvedic Doctor Jobs | Current Openings | 1991 | 3 | newsletter signup | kairali.com hub |
| 61 | /management-team.aspx | Kairali Ayurvedic Group \| World Leading Ayurveda Business | Management Team | 872 | 3 | newsletter signup | kairali.com hub |
| 62 | /security-policy.aspx | Kairali Ayurvedic Group's Security Policy | Security Policy | 856 | 3 | newsletter signup | kairali.com hub |
| 63 | /ayurveda-newsletter.aspx | Kairali Ayurveda Group \| Ayurvedic Newsletter | Ayurveda Newsletter | 387 | 1 | newsletter signup | kairali.com hub |
| 64 | /kairali-ayurveda-brands.aspx | Kairali Ayurvedic Group \| Ayurveda Treatments \| Ayurveda Spa | Kairali Ayurveda Brands | 384 | 1 | newsletter signup | kairali.com hub |
| 65 | /useful-links.aspx | Kairali Ayurveda Group \| Kairali Useful Links | Useful Links | 382 | 1 | newsletter signup | kairali.com hub |
| 66 | /villa-raag.aspx | Villa Raag \| Best Luxury Beach Villa in Agonda, South Goa - Kairali | Villa Raag | 1369 | 1 | newsletter signup | Villa Raag site |
| 67 | /namastedwaar-…-up-india.aspx | (404 — dead sitemap entry) | — | — | 3 | — | drop / 410 |

Word counts are estimates from stripped HTML and include ~350–400 words of shared nav/footer chrome per page.

### 4b. Award/news detail cluster (77 URLs, not individually tabled)

`detail.aspx?page=<slug>` — one page per award/press item, spanning 1995–2020: World Travel Awards (2015, 2016), World Luxury Spa Awards (2012, 2017–2020), NABH certification (2017, 2018), FICCI awards, National Geographic "top 50 wellness destinations", ISO certification, SATA awards, TripAdvisor CoE (5×), personal awards for Gita Ramesh / K.V. Ramesh / Abhilash K. Ramesh / Abishek Ramesh. 7 of these (2019–2020 items incl. Asian-African Leadership Award 2020, hand-sanitizer compliance cert) are live but missing from sitemap.xml. **This is the group's E-E-A-T backbone — the new kairali.com hub needs an awards/press archive to receive these via redirects (per-item or mapped to a consolidated awards page).**

### 4c. Downloads cluster (58 PDFs/PPTX)

Corporate brochures, CSR docs, product manuals/price lists (2016–2020), KTAHV tariff sheets (2017–2020, INR/USD/EUR), training modules. All prices/tariffs are 6+ years stale — never reuse the numbers (rule 6). Some PDFs likely hold backlinks; redirect the brochure-class ones to the new download centre, 410 the stale tariff sheets after checking backlink profiles in GSC/Ahrefs.

## 5. Security verdict: CLEAN

- Page-source tails of all 67 fetched pages inspected: no hidden link blocks, no injected `<div style="display:none">` link farms (the only `display:none` hits are legitimate form/CSS usage on contact/enquiry/consultation/apply pages).
- Spam keyword scan (viagra/cialis/casino/slot/betting/escort/replica/payday/judi/togel etc.): all hits are false positives — "spe**cialis**t", "ju**di**ciously", and random substrings inside base64 `__VIEWSTATE` blobs. Manually verified in context.
- External link domains across all pages: only Kairali family domains (kairaliproducts.com/.in, kairalicenters.com, ayurvedichealingvillage.com, kairaliyoga.com, whyayurveda.org, kairali.guru, kairalitea.com, kairbykairali.com, usakairali.com, kairali.mu etc.), social networks, YouTube, Google Fonts. No unrelated third-party outbound links.
- The kairalicenters hacked-WP pattern is not present (different stack: ASP.NET, not WP).

## 6. Tech & SEO gaps observed (opportunities for the rebuild)

1. **No structured data at all** — zero JSON-LD/schema.org on 67 pages.
2. **No canonicals** except homepage; no hreflang; EN-only.
3. **Stale static sitemap** (2020) missing live pages (villa-raag.aspx, 2020 awards).
4. Title tags are keyword-stuffed pipe-lists ("… | Ayurveda Spa Contacts | …"), many keyed to "spa" terms.
5. Doorway-ish near-duplicates: contact-us vs get-in-touch vs enquiry-form; ayurveda vs discover-ayurveda vs why-ayurveda; treatment-centres vs ayurveda-treatment-centres; photo/video library × 3 variants each.
6. Mixed-protocol internal links (http:// links to family domains) and heavy cross-domain footer linking (each family domain linked ~200× site-wide).
7. GA4 `G-XKRP6ZF1R6` + retired UA property both still loaded; Chatbase chat widget.
8. Blog/news images hosted on `admin.kairali.com` — that subdomain must survive the flip or images 404 in any preserved/archived content.

## 7. KTAHV language-lock exposure (rule: KTAHV pages only)

Legacy pages describing KTAHV freely use banned-register words — e.g. `/ayurvedic-healing-village.aspx`: spa ×11, resort ×1, luxury ×4, cure ×1, guests ×3; `/hospitality.aspx`: spa ×14; `/ayurveda-treatments.aspx`: guests ×4, cure ×3, journey ×1. **Any content migrated from these pages into the new KTAHV site or KTAHV sections of the hub must be re-registered to clinical language first (and clinical claims need Dr. Deepu John's sign-off).** Non-KTAHV pages (franchise, products, Villa Raag) are exempt from the lock.

## 8. Contacts found on the live site (for cross-checking, not for reuse without verification)

- Emails seen: career@kairali.com (10×), info@kairali.com (7×), plus centre-specific ones (delhi@kairalicentres.com, patna@kairalicentres.com, info@kairalihyd.com, support@kairaliproducts.com, kairalispa@ayus.co.jp, info@kairali.mu). Locked fact says public contact = info@kairali.com everywhere; the extra addresses are flagged for Abilash to confirm keep/kill in the rebuild.
- Dominant phone: +91-9555156156 (site-wide header/footer). The wrong WhatsApp number …38777 does NOT appear anywhere (verified by grep).

## 9. SEO-equity implications for the flip (findings, not actions)

1. The redirect map must cover **~208 URLs**: 71 content pages, 77 detail.aspx award/news items, 58 downloads, 5 apply-now?id links — every one needs a 301 target or a deliberate 410. The new Factory kairali.com is lean; the biggest crater risk is the 77-item awards corpus and the ~20 informational Ayurveda pages (those belong to whatisayurveda.com — cross-domain 301s will bleed some equity; keeping an awards archive + condensed topic pages on the hub bleeds less).
2. Query-string URLs (`detail.aspx?page=…`, `apply-now.aspx?id=…`) need explicit rewrite rules — path-based redirect maps alone will miss them.
3. The 404 sitemap entry (namastedwaar) and the missing-from-sitemap live pages show the sitemap can't be trusted as the full universe — GSC "Indexed pages" + Ahrefs top-pages export should be pulled before the flip to catch legacy URLs beyond this crawl (flagged as unverified gap).
4. Nothing on this site was modified. Read-only pass.

## Evidence

- Raw fetches: scratchpad `mine/` (66 pages + home + villa-raag, sitemap.xml, status.tsv with per-URL HTTP codes, profiles.json).
- Status check: 198×200 + 1×404 across sitemap.xml (see §1).
- Images: `/Users/kairalimacmini/Claude/Kairali-Digital/image-library/legacy-kairali-com/manifest.tsv` (60 rows: filename, source_url, bytes).
