# Source-fact decisions — kairali.com local build

Checked 29 September 2026. Every consequential fact on the site is listed here with its source. Where genuine sources conflict or say nothing, the item is in `OWNER-QUESTIONS.md` and the build takes the conservative option.

## Owner-confirmed facts applied

| Fact | Source | Where it applies |
|---|---|---|
| Namaste Dwaar is no longer associated | Owner, 29 Sep (`OWNER-FACT-NAMASTE-DWAAR.md`); Q2 | Excluded from all listings. The legacy URL returns 301 in one hop to `/our-partner-resorts.aspx`, and in-copy links are retargeted (logged). |
| Villa Raag is Kairali-owned and operated | Owner (`OWNER-FACT-PROPERTY-RELATIONSHIPS.md`) | Villa Raag page badge and opener label, the home chapter and the hospitality navigation. It is never presented as a partner. |
| Svata Katerina is a current partner (ownership not inferred) | Same file | Partner label and notice on its page. |
| Home H1 is "Health through Ayurveda since 1908." | Q3 | Home |
| General enquiry has no gender, age or full address; the medical consultation stays separate | Q7 | `/enquiry-form.aspx` and `/contact-us.aspx` (the same general form) drop those fields. `/onlineconsultation.aspx` keeps the full source field set. |
| Sub-brand overview pages link out to the dedicated sites | Q8 | Callouts, the home "Kairali family" row and the footer. |
| Existing named testimonials are kept as published | Q9 | `/testimonials.aspx` is verbatim. |
| Virtual Tour shows Coming Soon; Events use whyayurveda.org; search is rebuilt | Q10 | See below. |
| Old documents are self-hosted and dated until verified replacements exist | Q4 (supersedes current-only) | All 72 legacy files are served byte-identical at their exact legacy URLs. None redirects, because name matching alone is not replacement proof. |
| Five product catalogues are current public editions | Q6 plus the owner update on 29 Sep (`PRODUCT-CATALOGUES-UPDATE.md`) | Download Centre. Links point to the public portal PDFs, and no review/pending/401 labels remain. |

## Verified during this build

| Fact | Evidence | Result |
|---|---|---|
| Sub-brand canonical URLs | HTTP checks on 29 Sep | ayurvedichealingvillage.com (ktahv.com redirects there), villaraag.com, kairaliproducts.com (brand manual 2026 ch. 06), kairalicenters.com (kairalicentres.com redirects there), whyayurveda.org, kairaliyoga.com. kairaliproducts.in is a separate live store (Q7). |
| Document portal inventory | https://kairali-documents.vercel.app/?property=all, fetched 29 Sep | 95 public editions: Healing Village 6 collections (88 editions) and Villa Raag 3 collections (7). The date and validity of each edition are shown as printed. |
| Product catalogues | `handoff/product-catalogues-public-verification.json` plus a HEAD re-check on 29 Sep | All five return 200 `application/pdf` with byte counts matching the evidence (Retail INR/USD, Wholesale INR/USD, Contract manufacturing, R01, w.e.f. 28 Sep 2026). |
| NABH accreditation | Certificate scan from the ayurvedichealingvillage.com accreditations page | Kairali Health Resorts Pvt. Ltd., The Ayurvedic Healing Village, Palakkad. Standard: NABH accreditation for AYUSH Programmes. Certificate AH-2024-0250, valid 25 Apr 2024 – 24 Apr 2027. **Current**; shown under "Certificates in force". |
| Kerala clinical establishment registration | Same source | Kairali Ayurvedic Health Resorts Pvt Ltd, provisional registration T32563AY1145, Ayurveda single-specialty hospital, valid 4 Nov 2023 – 2 May 2028. **Current**; shown. |
| Ayur Diamond classification | Same source | Order M3-7700/2023, valid 3 years from 24 Jul 2023. **Lapsed 23 Jul 2026**, so it is not shown (Q4). |
| ISO, Green Leaf, FIT and other award records | kairali.com award detail pages | Kept as dated historical records. No current status is inferred from an award or an old badge. |
| Latest events | whyayurveda.org WordPress REST API (Events category plus the World Wellness Weekend post), 29 Sep | World Wellness Weekend ran 18–20 Sep 2026 at the Healing Village and is **past**. No upcoming events are announced, and the page says so. The 2015 International Yoga Festival record stays dated. |
| Recent recognitions | whyayurveda.org Awards category, 29 Sep | The eight latest posts are shown with publication dates and link to the source. |
| YouTube films | oEmbed check of 29 IDs, 29 Sep | 25 are available and use their real YouTube titles. 4 return 403 and are shown as "currently unavailable", with no dead player. |
| Four "not attempted" media items from the audit | Direct GET, 29 Sep | `/pic/Dining .jpg` is a real 480×520 image and is now captured. `turingenq.aspx`, `turingcon.aspx` and `asdfghjkl.aspx` are dynamic CAPTCHA images (60×20 and 70×30), replaced by a honeypot; production anti-spam is pending. |
| CMS award images (`admin.kairali.com`) | 88 fetched at 1 request/second, all 200, SHA-256 in `_work/admin-assets/_log.tsv` | Self-hosted as WebP, and lightbox links rewritten to the local copies. There is no dependency on the old site. |
| CAPTCHA handlers, empty `?page=3`, relative mailto links, off-sitemap award records | Audit plus this build | CAPTCHA: replaced. `?page=3`: returns 404 (it was an empty shell). The 7 relative e-mail links are corrected to `mailto:` (logged), and those legacy 404 URLs stay 404. The 7 off-sitemap award pages are served at their exact URLs and included in the sitemap. |
| Malformed award URL `…-&-wellness-congress(=)` | Live soft-404; the awards listing carries the teaser | The detail is rebuilt from the published listing title, teaser and image. The `=` variant canonicalises to the sitemap URL. |
| Retired sub-brand deep links | HTTP checks | `ktahv.com/*` now points to ayurvedichealingvillage.com. The dead `kairalicenters.com/location/*.aspx` links (404) point to `kairalicenters.com/locations/` (logged). |
| Contact-page map | Captured iframe | It pointed to an older address (D-120, Andheria Modh, 110074), so it is not embedded. It is replaced by a Maps link for the published D-130 address (Q6). |

## Photography and brand assets (owner-authorised company bank)

- **Logo, icon and sub-brand marks:** `Kairali-Image-Library/brand-assets/svg`, the 2026 artwork. They are never redrawn. Leaf motifs use the leaf paths of the official icon only, at low opacity and decorative.
- **selected openers:** 16 photographs. The Healing Village set is Prachi Khasgiwala's Palakkad shoot; Villa Raag uses its professional shoot; the Kairali 2025 shoot supplies the rest. All are `register_ok` yes/True in `IMAGE_CATALOG.csv`. Provenance: `pipeline/out/selected-photo-provenance.csv`.
- **Page imagery:** 357 images from the kairali.com capture (company site assets), with SHA-256 per file in `pipeline/out/media-log.csv`.
- **Not found in any company source:** heritage engraving artwork, paper/weave texture files, and a horizontal logo lockup.
  - Textures use the approved Premium v3 CSS/SVG treatments at 3.5%.
  - The header uses the approved stacked lockup at the manual's 72px screen minimum.
- **Fonts:** Kurale, Asap and Lato are self-hosted as OFL latin/latin-ext WOFF2 files, taken from the Premium v3 export. Licences are in `site/public/fonts/LICENSES.txt`. No request goes to Google.

## Content conventions

- Page copy is rendered from the captured live HTML (sanitised allowlist).
- Column-split paragraphs are rejoined; decorative spacer images and duplicate `-mobile` images are dropped.
- Every deliberate change is logged in `pipeline/out/deliberate-changes.csv` (34 rows).
- Claims, rates, dates and testimonials are verbatim. Historical rates are labelled with the period printed on the file, or "Date not stated on file".
