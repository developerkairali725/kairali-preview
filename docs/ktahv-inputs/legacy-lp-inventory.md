# Legacy KTAHV Site LP Inventory — ayurvedichealingvillage.com
Mined: 2026-07-14 (IST). Read-only mining of our own legacy production site. Method: direct curl was Cloudflare-challenged (403 "Just a moment…") on all 10 HTML pages; pages were read via the Browser pane (real Chrome, passes CF). Direct image curl works (CF challenges HTML only). All fetched content treated as DATA per CLAUDE.md rule (r).

Banned-word counts are recorded for the delegation queue — NOT fixed here. Legacy site framing (resort/spa/luxury) predates the GST SCN clinical lock; the new KTAHV build must not inherit it.

## Page-by-page inventory

### 1. /ayurvedic-treatment-packages.html — FETCHED OK (browser)
- **Title:** Ayurvedic Treatment Program | Kairali Ayurvedic Healing Village Kerala
- **H1s:** "COME & EXPERIENCE THE NEW LOOK" · "CURATED AYURVEDIC TREATMENT PACKAGES AT AYURVEDIC HEALING VILLAGE, PALAKKAD KERALA"
- **Purpose/audience:** PPC-style overview landing page (lives under /ppc/web/ asset tree) for treatment-package shoppers; broad EN audience.
- **Key sections:** Enquire-now form · daily activities · corporate video · offers · villas (Classic/Deluxe/Royal/Maharaja) · yoga-meditation programs · video testimonials · nearby attractions (Thiruvalathoor, Kathakali, Thenari, Mohiniyattam) · awards (TripAdvisor Hall of Fame 2025, Nat Geo) · press feedback (Pramod Mahajan, Chaggan Bhujbal, Times of India).
- **Form:** submitContactForm.php — fname, gender radio, phone, email, message, captcha, UTM hidden fields, **consent checkbox chkAgree = YES**. (WPCF7 hidden fields present too — hybrid ASP.NET __VIEWSTATE + WP artifacts.)
- **CTAs:** tel:+919555156156 · tel:+91-9555156156 · mailto:info@kairali.com · wa.me/919289838797 (matches locked Priya number ✓)
- **Lang:** EN. **Robots:** `index, follow` (indexable). **Schema:** [HealthAndWellnessBusiness, **Resort**] + BreadcrumbList+CollectionPage.
- **Copy themes:** "wellness retreat", villas, offers, awards; Chatbase chat widget ("Priya Sharma - Kairali").
- **Banned words:** resort 1 · luxury 2 · guests 7 (plus schema @type "Resort" and alt texts "Health Resort", "World Luxury Spa awards").
- **Videos:** Google Maps embed; video thumbnails link YouTube (corporate video, testimonials).
- **Images (42; key content ones, all under /ppc/web/ or /ppc/images/):** may-2022-desk.jpg (1349×593 hero, alt "Holistic Wellness Retreat") · may-2022-mob.jpg · image-1/2/3.jpg (retreat/nature-walk/resort) · about-kairali.png · ancient-secrets-of-healing-corporate-video.jpg (+ -small) · tripadvisor-hall-of-fame-2025.png · classic-villa.jpg, delux-villa.jpg, royal-villa-ppc.jpg, maharaja-suite-ppc.jpg · yoga-meditation.jpg (+-new) · testimonial-video-01.jpg, video-1/2/3.jpg (+-new variants) · thiruvalathoor.jpeg, kathakali.jpeg, thenari.jpeg, mohiniyattam.jpeg · ngt.png · Patwa-icon.png, lotusw.png (award icons, wp-content/uploads/2026) · pramod-mahajan.jpg, chaggan-bhujbal.jpg, tiimes-of-india.jpg, nat-geo.jpg.

### 2. /panchkarma-treatment.html — FETCHED OK (browser)
- **Title:** Panchakarma Treatment in Kerala | Kairali Ayurvedic Healing Village
- **H1:** none detected (H2-led long-form LP). Lead H2: "Kairali - The Ayurvedic Healing Village, Asia's Best Ayurvedic Retreat".
- **Purpose/audience:** dedicated Panchakarma conversion LP; detox-seeking domestic + international audience.
- **Key sections:** "Ultimate Ayurvedic Detox" · Reflect/Renew/Restore · Five folds of Panchakarma (Vamana etc., 5 image cards) · why-you-need-it · WHO stat block ("mind-boggling fact") · 115+ years story · stats (115+ / 65 / 2000+ / 21+) · Why Choose Us slider (villa, consultation, therapy, therapists, own medicine manufacturing, organic farming) · awards · package block · Google/TripAdvisor review banners · world map of clients · testimonials (5) · doctor profiles (**Dr. Deepu John, Dr. Ashikha Raj**) · FAQ slider · memories gallery (10) .
- **Form:** submitContactForm.php — fname, lname, email, phone, message. **NO consent checkbox.**
- **CTAs:** tel:+91-9555-156-156 · mailto:info@kairali.com · wa.me/919289838797 ✓
- **Lang:** en-US. **Robots:** no meta (indexable by default). **Schema:** [HealthAndWellnessBusiness, Resort] + BreadcrumbList+CollectionPage.
- **Banned words:** resort 4 · holiday 1 · cure 3 · journey 1 · guest 1 (+ "World Luxury Awards" alts).
- **Videos:** none embedded (video-thumbnail sections).
- **Images (~60 under /assets/images/):** content-grade: group_110222.png (1164×461 banner) · panchkarma-therapy/p-1.jpg (481×634) · therapy-image.jpg (703×464) · five-folds-images/mask_group.png + image-2.webp + image-3.png + image-4.webp + image-5.png (640×738 each) · group_110285.png · specialist/video-nackground-pic.jpg · why-us slider img-1…img-6 (915×640) · package/image-1.jpg (393×513) · world-map.jpg · testimonials pic-1…pic-5 (480×520) · hod-image-1.png (Dr. Deepu John) · ashika-raj.png · component_11.webp + FAQ pic-1/pic-2 (454×606) · memories pic-1…pic-10 (~290w) · google.png / tripadvisor.png review banners. Many decorative leaf/border PNGs (skipped for download).

### 3. /weight-loss.html — FETCHED OK (browser)
- **Title:** Effective Ayurvedic Weight Loss Treatments in Kerala, India
- **H1:** none detected; lead H2 "Lose weight Naturally & Effectively in the Ayurvedic way".
- **Purpose/audience:** weight-loss conversion LP (asset tree /ppc/weightloass/ — note typo); result-oriented audience ("9 kgs", "14 days" banner badges).
- **Key sections:** results banner (lady + 14-days/104-cal/9-kgs/tape badges) · Rupak Mann client story · 5 mistakes · stop worrying · five-folds process · additional benefits (BP, cholesterol/diabetes, sleep/stress, skin, hormones) · "still confused about the weight loss journey" · superiority comparison · happy stories video · transformation videos (YouTube) · stats (115+/65+/11k+/21+) · why choose us slider · awards · package block (per-person, diet, yoga, consultation, meditation) · reviews, world map, client sliders, Dr. Deepu John + Dr. Ashikha Raj, FAQ, memories gallery.
- **Form:** submitContactForm.php — fname, lname, email, phone, message. **NO consent checkbox.**
- **CTAs:** tel:+91-9555-156-156 · mailto:info@kairali.com · wa.me/919289838797 ✓
- **Lang:** EN. **Robots:** no meta (indexable). **Schema:** WebPage+ImageObject+BreadcrumbList+WebSite+Organization (Yoast-style graph).
- **Banned words:** spa 2 · resort 1 · luxury 4 · journey 7 · guest 1. Alt texts also say "Health Resort", "World Luxury SPA Award Winner 2024".
- **Videos:** YouTube embeds CcDPOeSR67E, JztT26hwdnA, watch?v=3vWviQfW1Ug, D3QLxKpwtJs (weight-loss testimonials incl. "Ms. Rupak Weight Loss Journey").
- **Images (~100 under /ppc/weightloass/images/):** banner/lady.png + badge PNGs · intro/image.png (Rupak Mann) · 5-mistakes set · stop-worrying left/right · five-folds doc_cons.webp + image-2…5 · additional-benefits pic-1…5 · still-confused/left-box-image.jpg · happy-stories/video-banner-image.jpg · specialist/video-banner-backgroung.png · transformation-story/image-1.png · why-us slider img-1…6.jpg · awards set + /awards/luxury-spa-award.png · wiight-loss-package/mid-image.jpg · world-map.jpg · client sliders client-1…5.jpg + profiles · hod-image-1.png, ashika-raj.png · FAQ pics · memories pic-1…10.jpg.

### 4. /wellness-resort-kerala.html — FETCHED OK (browser)
- **Title:** Best Wellness Resort in Kerala for Ayurveda & Holistic Healing
- **H1s (multiple):** "Experience the Ultimate Harmony of Wellness and Serenity" · "KERALA" · "WHY KAIRALI … BEST AYURVEDIC TREATMENT…" · "OUR BEST FEATURES" · "103 Countries" · "AYURVEDIC TREATMENTS & THERAPIES" · "3 Lacs Treatments / 87% satisfactory rate" · "AYURVEDA - IS IT FOR ME?" · "POST TREATMENT CARE" · "STEPS TO GET YOUR PERSONALIZED AYURVEDIC TREATMENT".
- **Purpose/audience:** SEM/SEO LP explicitly targeting the "wellness resort Kerala" query — the URL itself is banned-register evidence. International audience (USD pricing: Wellness $201, Treatment $270).
- **Key sections:** hero (Layer 8-min.jpg) · Kerala safety quote · best-features grid (nature/architecture/trained professionals/farm-to-table/vegetarian/in-house products/no preservatives/no refrigeration/organic farming) · pricing blocks · 103-countries stat · treatments list · yoga retreat cross-sell · full awards wall (28 award images, 2005–2025 incl. NABH 2018) · video testimonials · villas · press quotes · post-treatment care · 3-step process.
- **Form:** submitContactForm.php — fname, gender, phone, email, **country**, message, **consent chkAgree = YES**.
- **CTAs:** tel:+919555156156 · mailto:info@kairali.com · wa.me/919289838797 ✓
- **Lang:** EN. **Robots:** `index, follow`. **Schema:** WebPage+ImageObject+BreadcrumbList+WebSite+Organization.
- **Banned words (HEAVIEST EN PAGE):** spa 16 · resort 15 · luxury 15 · cure 1 · guest 1 — plus title/URL/desc all say "wellness resort".
- **Images:** hero Layer%208-min.jpg + header-mobile-2022.jpg · feature tiles nature/modern/trained/local .png + strict/inhouse/nopr/nore/organic .jpg · yogaimg.png · /awards/*.jpg|png (28: certificate-of-excellance-2025/2019/2018, luxury-spa-award, fit-reisen, aspw, nabh-2018, wlsa-2019/2018/2017/2012, mice-2019, green-leaf, bds-2015, wta-2016/2015/2009, hmtd-2017, ngt-2013, safari-2007, patwa-2007, saca-2005, itm-2010, elle-india, fit-reisen-2012, hospitality-excellence-award, neue-wege) · video.jpg · press pics · villa set · process post.png/steps1.png. Google Maps embed.

### 5. /kairali-cleansing-centre.html — FETCHED OK (browser)
- **Title:** Kairali Cleansing Centre | Best Ayurvedic Hospital Kerala
- **H1/H2:** "Experience Authentic Ayurvedic / Wellness at Kairali - Ayurvedic **Hospital** in Kerala" · "REDISCOVER BALANCE AT KAIRALI – BEST AYURVEDIC HOSPITAL IN KERALA".
- **Purpose/audience:** same template as page 4 but pitched at "ayurvedic hospital" queries — the closest legacy page to the clinical register, yet body copy still resort-toned. Pricing: Treatment from $232, Yoga-based wellness from $307.
- **Sections/form/CTAs/images:** identical template to /wellness-resort-kerala.html (features grid, 103 countries, awards wall, villas, steps). Form WITH country + consent ✓. CTAs identical ✓.
- **Lang:** EN. **Robots:** `index, follow`. **Schema:** [HealthAndWellnessBusiness, Resort] + BreadcrumbList+CollectionPage.
- **Banned words:** spa 15 · resort 10 · luxury 16 · journey 1 · guests 3. Meta description itself says "Luxury villas".
- **Interesting:** "hospital" positioning + NABH award images — a bridge page worth studying for the new clinical-register KTAHV site (structure, not language).

### 6. /Ayurveda_Treatment_Neo_S.India_Cities.html — FETCHED OK (browser)
- **Title:** Ayurvedic Treatment in South India | Holistic Healing Packages
- **H1s:** "KAIRALI- THE AYURVEDIC HEALING VILLAGE" · "COME & EXPERIENCE THE NEW LOOK" · "VARIOUS AYURVEDIC TREATMENT PACKAGES IN KERALA, INDIA".
- **Purpose/audience:** PPC LP variant ("Neo") for South-India city campaigns (Bengaluru/Chennai/Hyderabad ad traffic guess); same skeleton as page 1 + "CULINARY DELIGHTS" section.
- **Form:** submitContactForm.php — fname, gender, phone, email, message, **consent chkAgree = YES**.
- **CTAs:** tel/mailto/wa.me identical ✓. **Lang:** EN. **Robots:** `index, follow` (a PPC LP left indexable). **Schema:** WebPage+ImageObject+BreadcrumbList+WebSite+Organization.
- **Banned words:** resort 2 · luxury 1 · guests 2.
- **Images:** unique heroes 38b-copy-min.jpg / 38a-copy-min.jpg (Ayurvedic Retreat Banner) · ancient-secrets-of-healing.jpg · tripadvisor-rationg.jpg · wlsaw-2022.png · fitrsn.png · rest shared with page 1 (villas, attractions, videos, press).

### 7. /Kairali_Brand_and_Competition_Neo-original.html — FETCHED OK (browser)
- **Title:** Best Ayurvedic Treatment Packages in Kerala - Kairali Ayurvedic **Health Resort**
- **Purpose/audience:** brand-defence PPC LP (bidding on brand + competitor terms — "Brand_and_Competition" campaign name); same Neo skeleton as page 6 minus daily-activities/culinary.
- **Form:** fname, gender, phone, email, message, consent ✓. CTAs identical ✓.
- **Lang:** EN. **Robots:** `index, follow`. **Schema:** WebPage+ImageObject+BreadcrumbList+WebSite+Organization.
- **Banned words:** resort 2 · luxury 1 · guests 2 (title itself contains "Health Resort").
- **Images:** unique hero header-atp-2022.jpg + video-4.jpg + nabh-new.jpg; rest shared /ppc/web set.

### 8. /pain-management.html — FETCHED OK (browser)
- **Title:** Effective Pain Management with Ayurvedic Treatments in Kerala
- **H1:** "Embrace a Pain-Free Life with the Wisdom of Ayurveda".
- **Purpose/audience:** condition LP for chronic-pain seekers; the most clinical page of the ten — approach → recommended-for → process → benefits → personalised doctor-guided program (pre/during/post) → FAQ (What is Ayurveda? / effectiveness / safety / duration / dietary restrictions).
- **Form:** submitContactForm.php — fname, gender, phone, email, message, **consent chkAgree = YES**. CTAs identical ✓.
- **Lang:** EN. **Robots:** `index, follow`. **Schema:** WebPage+ImageObject+BreadcrumbList+WebSite+Organization.
- **Banned words: NONE (0). The only clean page of the ten — the template to emulate.**
- **Images (assets at www…/painimagesassets/):** painmanagment-1.jpg · Rheumatism-Approach-min.png · why-5.jpg · benefit-4.jpg · TIMAGE-4/5/6.png · hero-2022.png · /assets/images/doctor.png · decorative leaf SVG/PNGs. WordPress emoji SVGs present (s.w.org).

### 9. /de/behandlung-in-kerala — FETCHED OK (browser)
- **Title:** behandlung-in-kerala - Ayurvedic Healing Village (default WP title — no crafted DE meta title; **meta description EMPTY**)
- **H1s:** "Bestes Ayurveda-Zufluchtsort in Kerala, Indien" · "KAIRALI AYURVEDISCHES HEILDORF" · "WARUM AYURVEDA?" · "103 Ländern" · "IST AYURVEDA ETWAS FÜR MICH?" · "Yoga-Retreats" · "PFLEGE NACH DER BEHANDLUNG". EUR pricing: Behandlungspaket ab 203 €, Yoga-Wellnesspaket ab 269 €.
- **Purpose/audience:** DE-market master treatment LP inside the WP /de/ tree (not the .html PPC tree). Treatment card grid (T1–T5 + condition cards from wp-content/uploads 2024–2025, incl. De-addiction, hormonal, bronchial, yoga-base) + DE villas (Maharadscha-Suite etc.).
- **Forms (many):** WP search forms (s) ×6 · submitContactForm.php (fname, gender, phone, email, country, message, **consent ✓**) · 3× WPForms (name/email/phone per treatment enquiry, **no consent checkbox**) · **submitAirIndiaForm.php** (fname, phone, email — Air India campaign form, no consent). CookieYes consent banner present.
- **CTAs:** tel:+91-9555156156 (+variants incl. malformed `tel:91-9555156156`) · mailto:info@kairali.com · wa.me/919289838797 ✓
- **Lang:** de-DE. **Robots:** index, follow, max-image-preview… **Schema:** WebPage graph + **HealthAndBeautyBusiness** + BreadcrumbList.
- **Banned words (DE senses):** spa 15 · resort 10 · luxury 11 · **Luxus 3** · Gäste 1 ("VILLEN IM RESORT" heading).
- **Images:** wp-content/uploads treatment cards (2024/11/2-20.jpg, 2025/01 T1–T5.png.webp, De-addiction…, 2025/05 five .webp) · DE villa images (Deluxe.jpg.webp, Classic-.png.webp, Royal-Villa.jpg.webp, MAharaj.jpg) · shared /ppc/web + /awards sets · de-post.png (DE process graphic). Alt texts mostly "Card image cap" (placeholder — SEO gap noted as data).

### 10. /treatment-in-kerala.html — FETCHED OK (browser)
- **Title:** Authentic Ayurvedic Treatments in Kerala for Holistic Wellness
- **H1s:** "Ayurveda: The Key to Living Life Fully and Healthily" · "KAIRALI KAIRALI - THE AYURVEDIC VILLAGE VILLAGE" (duplicated-word typo, recorded as-is) · same skeleton as pages 4/5. Pricing $201 / $270. "300K+ Treatments with an 87% satisfactory rate".
- **Form:** fname, gender, phone, email, country, message, **consent ✓**. CTAs identical ✓.
- **Lang:** EN. **Robots:** `index, follow`. **Schema:** WebPage+ImageObject+BreadcrumbList+WebSite+Organization.
- **Banned words:** spa 16 · resort 17 · luxury 19 — worst raw counts of all ten.
- **Images:** identical shared set to page 4 (Layer 8 hero, features, 28 awards, villas, videos, press).

## Sitemap & robots.txt
- **robots.txt — FETCHED OK via curl (200).** Heavily annotated (reviewed June 2026). Allows everything except /wp-admin/ (admin-ajax allowed), /xmlrpc.php, /*?s= (site search, covers /de/ /fr/), /trackback/. Deliberately GEO-friendly: no AI-bot blocks. Declares: `Sitemap: https://ayurvedichealingvillage.com/wp-sitemap.xml`.
- **/sitemap.xml — CLOUDFLARE-BLOCKED via curl (403 challenge)**; the canonical sitemap is **/wp-sitemap.xml** (WordPress core), read via browser.
- **wp-sitemap.xml structure — 12 child sitemaps, 594 URLs total:**

| Child sitemap | URLs | Cluster purpose |
|---|---|---|
| wp-sitemap-posts-page-1.xml (EN) | 193 | EN pages: policies, our-story, accreditations, awards, FAQs, thank-you pages, plus the large PPC/LP estate |
| de/wp-sitemap-posts-page-1.xml | 146 | DE page tree (behandlung-in-kerala, akkreditierungen, über-uns…) |
| fr/wp-sitemap-posts-page-1.xml | 140 | FR page tree (traitement-ayurvedique, mentions-legales…) |
| wp-sitemap-posts-offers-1.xml (EN) | 4 | Offers CPT (senior citizen, Olympics/Paralympics, defence 30% off) |
| fr/…offers-1.xml | 1 | FR offer (Olympics) — **no DE offers sitemap** |
| wp-sitemap-posts-villas-1.xml (EN) | 4 | Villas CPT (Classic/Deluxe/Royal/Maharaja) |
| de/…villas-1.xml | 4 | DE villas |
| fr/…villas-1.xml | 4 | FR villas |
| wp-sitemap-posts-programs-1.xml (EN) | 38 | Programs/treatments CPT (psoriasis, spondylitis, paralysis, diabetes, skin…) |
| de/…programs-1.xml | 28 | DE programs |
| fr/…programs-1.xml | 31 | FR programs |
| wp-sitemap-posts-awsm_job_openings-1.xml | 1 | Jobs CPT (Business Development Manager) |

- **DE coverage:** 178 URLs (146 pages + 4 villas + 28 programs) vs EN 240 vs FR 176. DE lacks an offers cluster; EN programs (38) > FR (31) > DE (28) — locale gaps exist at CPT level. The size of the map reflects a deep 3-locale page tree plus 4 custom post types; each cluster has a clear job (core pages / conversion offers / room inventory / condition programs / recruitment).

## Banned-word summary (KTAHV lock — for the delegation queue, NOT fixed here)
| Page | spa | resort | holiday | luxury | cure | journey | guest(s) | DE equivalents | Total |
|---|---|---|---|---|---|---|---|---|---|
| ayurvedic-treatment-packages.html | 0 | 1 | 0 | 2 | 0 | 0 | 7 | – | 10 |
| panchkarma-treatment.html | 0 | 4 | 1 | 0 | 3 | 1 | 1 | – | 10 |
| weight-loss.html | 2 | 1 | 0 | 4 | 0 | 7 | 1 | – | 15 |
| wellness-resort-kerala.html | 16 | 15 | 0 | 15 | 1 | 0 | 1 | – | 48 |
| kairali-cleansing-centre.html | 15 | 10 | 0 | 16 | 0 | 1 | 3 | – | 45 |
| Ayurveda_Treatment_Neo_S.India_Cities.html | 0 | 2 | 0 | 1 | 0 | 0 | 2 | – | 5 |
| Kairali_Brand_and_Competition_Neo-original.html | 0 | 2 | 0 | 1 | 0 | 0 | 2 | – | 5 |
| pain-management.html | 0 | 0 | 0 | 0 | 0 | 0 | 0 | – | **0** |
| de/behandlung-in-kerala | 15 | 10 | 0 | 11 | 0 | 0 | 0 | Luxus 3, Gäste 1 | 40 |
| treatment-in-kerala.html | 16 | 17 | 0 | 19 | 1 | 0 | 1 | – | 54 |
(Counts are visible-text word matches, case-insensitive, incl. plurals. Additional occurrences live in titles, meta descriptions, URLs, alt texts and schema @type "Resort" / award names "World Luxury Spa Awards" — award proper nouns are names of real accolades, flag for Dr. Deepu/GST counsel judgement, not blind replacement.)

## Image manifest — downloaded to /Users/kairalimacmini/Claude/Kairali-Digital/image-library/legacy-ktahv-site/
83 files, 5.9 MB total, 0 fetch failures (Cloudflare does not challenge direct image GETs). 121 candidate URLs skipped (<25KB: icons, feature tiles, award thumbs, memories thumbnails, press headshots). Machine-readable manifest: `manifest.tsv` in the same directory (status / local name / source URL / bytes / page slug; includes the SKIP records). Filename collisions found and resolved with renames: weight-loss banner vs 5-mistakes `lady.png` → `weight-loss__banner-lady.png` / `weight-loss__5mistakes-lady.png`; panchakarma testimonials vs memories `pic-2..5.jpg` → `panchakarma__testimonials-pic-2..5.jpg` (disk count reconciled against manifest: 83 = 83).

| Local file | Source URL | Size |
|---|---|---|
| treatment-packages__may-2022-desk.jpg | https://ayurvedichealingvillage.com/ppc/web/may-2022-desk.jpg | 105 KB |
| treatment-packages__may-2022-mob.jpg | https://ayurvedichealingvillage.com/ppc/web/may-2022-mob.jpg | 77 KB |
| treatment-packages__image-1.jpg | https://ayurvedichealingvillage.com/ppc/web/image-1.jpg | 29 KB |
| treatment-packages__about-kairali.png | https://ayurvedichealingvillage.com/ppc/web/about-kairali.png | 57 KB |
| treatment-packages__classic-villa.jpg | https://ayurvedichealingvillage.com/ppc/images/classic-villa.jpg | 31 KB |
| treatment-packages__delux-villa.jpg | https://ayurvedichealingvillage.com/ppc/images/delux-villa.jpg | 29 KB |
| treatment-packages__royal-villa-ppc.jpg | https://ayurvedichealingvillage.com/ppc/images/royal-villa-ppc.jpg | 28 KB |
| treatment-packages__maharaja-suite-ppc.jpg | https://ayurvedichealingvillage.com/ppc/images/maharaja-suite-ppc.jpg | 30 KB |
| panchakarma__group_110222.png | https://ayurvedichealingvillage.com/assets/images/group_110222.png | 87 KB |
| panchakarma__p-1.jpg | https://ayurvedichealingvillage.com/assets/images/panchkarma-therapy/p-1.jpg | 32 KB |
| panchakarma__therapy-image.jpg | https://ayurvedichealingvillage.com/assets/images/therapy-image.jpg | 33 KB |
| panchakarma__mask_group.png | https://ayurvedichealingvillage.com/assets/images/five-folds-images/mask_group.png | 60 KB |
| panchakarma__image-2.webp | https://ayurvedichealingvillage.com/assets/images/five-folds-images/image-2.webp | 98 KB |
| panchakarma__image-3.png | https://ayurvedichealingvillage.com/assets/images/five-folds-images/image-3.png | 78 KB |
| panchakarma__image-4.webp | https://ayurvedichealingvillage.com/assets/images/five-folds-images/image-4.webp | 97 KB |
| panchakarma__image-5.png | https://ayurvedichealingvillage.com/assets/images/five-folds-images/image-5.png | 84 KB |
| panchakarma__group_110285.png | https://ayurvedichealingvillage.com/assets/images/group_110285.png | 38 KB |
| panchakarma__video-nackground-pic.jpg | https://ayurvedichealingvillage.com/assets/images/specialist/video-nackground-pic.jpg | 48 KB |
| panchakarma__img-1.webp | https://ayurvedichealingvillage.com/assets/images/why-us%20slider%20image/img-1.webp | 108 KB |
| panchakarma__img-2.jpg | https://ayurvedichealingvillage.com/assets/images/why-us%20slider%20image/img-2.jpg | 67 KB |
| panchakarma__img-3.webp | https://ayurvedichealingvillage.com/assets/images/why-us%20slider%20image/img-3.webp | 98 KB |
| panchakarma__img-4.jpg | https://ayurvedichealingvillage.com/assets/images/why-us%20slider%20image/img-4.jpg | 49 KB |
| panchakarma__img-5.webp | https://ayurvedichealingvillage.com/assets/images/why-us%20slider%20image/img-5.webp | 75 KB |
| panchakarma__img-6.jpg | https://ayurvedichealingvillage.com/assets/images/why-us%20slider%20image/img-6.jpg | 63 KB |
| panchakarma__pic-1.webp | https://ayurvedichealingvillage.com/assets/images/testimonials/pic-1.webp | 97 KB |
| panchakarma__testimonials-pic-2.jpg | https://ayurvedichealingvillage.com/assets/images/testimonials/pic-2.jpg | 57 KB |
| panchakarma__testimonials-pic-3.jpg | https://ayurvedichealingvillage.com/assets/images/testimonials/pic-3.jpg | 77 KB |
| panchakarma__testimonials-pic-4.jpg | https://ayurvedichealingvillage.com/assets/images/testimonials/pic-4.jpg | 51 KB |
| panchakarma__testimonials-pic-5.jpg | https://ayurvedichealingvillage.com/assets/images/testimonials/pic-5.jpg | 79 KB |
| panchakarma__ashika-raj.png | https://ayurvedichealingvillage.com/assets/images/ashika-raj.png | 54 KB |
| panchakarma__component_11.webp | https://ayurvedichealingvillage.com/assets/images/component_11.webp | 90 KB |
| panchakarma__pic-1.png | https://ayurvedichealingvillage.com/assets/images/FAQ%20slider%20images/pic-1.png | 79 KB |
| panchakarma__pic-2.png | https://ayurvedichealingvillage.com/assets/images/FAQ%20slider%20images/pic-2.png | 52 KB |
| panchakarma__pic-10.jpg | https://ayurvedichealingvillage.com/assets/images/memories/pic-10.jpg | 28 KB |
| panchakarma__google.png | https://www.ayurvedichealingvillage.com/ppc/web/google.png | 27 KB |
| panchakarma__tripadvisor.png | https://www.ayurvedichealingvillage.com/ppc/web/tripadvisor.png | 27 KB |
| weight-loss__banner-lady.png | https://ayurvedichealingvillage.com/ppc/weightloass/images/banner/lady.png | 46 KB |
| weight-loss__image.png | https://ayurvedichealingvillage.com/ppc/weightloass/images/intro/image.png | 32 KB |
| weight-loss__5mistakes-lady.png | https://ayurvedichealingvillage.com/ppc/weightloass/images/5-mistakes/lady.png | 53 KB |
| weight-loss__doc_cons.webp | https://ayurvedichealingvillage.com/ppc/weightloass/images/five-folds-images/doc_cons.webp | 98 KB |
| weight-loss__image-2.webp | https://ayurvedichealingvillage.com/ppc/weightloass/images/five-folds-images/image-2.webp | 98 KB |
| weight-loss__image-3.png | https://ayurvedichealingvillage.com/ppc/weightloass/images/five-folds-images/image-3.png | 71 KB |
| weight-loss__image-4.png | https://ayurvedichealingvillage.com/ppc/weightloass/images/five-folds-images/image-4.png | 89 KB |
| weight-loss__image-5.webp | https://ayurvedichealingvillage.com/ppc/weightloass/images/five-folds-images/image-5.webp | 88 KB |
| weight-loss__video-banner-backgroung.png | https://ayurvedichealingvillage.com/ppc/weightloass/images/specialist/video-banner-backgroung.png | 81 KB |
| weight-loss__image-1.png | https://ayurvedichealingvillage.com/ppc/weightloass/images/transformation-story/image-1.png | 50 KB |
| weight-loss__img-1.jpg | https://ayurvedichealingvillage.com/ppc/weightloass/images/why-us%20slider%20image/img-1.jpg | 291 KB |
| weight-loss__img-2.jpg | https://ayurvedichealingvillage.com/ppc/weightloass/images/why-us%20slider%20image/img-2.jpg | 81 KB |
| weight-loss__img-3.jpg | https://ayurvedichealingvillage.com/ppc/weightloass/images/why-us%20slider%20image/img-3.jpg | 161 KB |
| weight-loss__img-4.jpg | https://ayurvedichealingvillage.com/ppc/weightloass/images/why-us%20slider%20image/img-4.jpg | 69 KB |
| weight-loss__img-5.jpg | https://ayurvedichealingvillage.com/ppc/weightloass/images/why-us%20slider%20image/img-5.jpg | 117 KB |
| weight-loss__img-6.jpg | https://ayurvedichealingvillage.com/ppc/weightloass/images/why-us%20slider%20image/img-6.jpg | 67 KB |
| weight-loss__world-map.jpg | https://ayurvedichealingvillage.com/ppc/weightloass/images/world-wide/world-map.jpg | 39 KB |
| weight-loss__client-1.jpg … client-5.jpg | …/client%20slider%20image/client-1..5.jpg | 58–69 KB each |
| weight-loss__hod-image-1.png | https://ayurvedichealingvillage.com/ppc/weightloass/images/hod-image-1.png | 63 KB |
| weight-loss__pic.png / pic-1.png / pic-2.png | …/FAQ%20slider%20images/ | 72–88 KB |
| weight-loss__luxury-spa-award.png | https://ayurvedichealingvillage.com/awards/luxury-spa-award.png | 26 KB |
| wellness-resort__Layer-8-min.jpg | https://ayurvedichealingvillage.com/ppc/web/Layer%208-min.jpg | 80 KB |
| wellness-resort__header-mobile-2022.jpg | https://ayurvedichealingvillage.com/ppc/web/header-mobile-2022.jpg | 98 KB |
| wellness-resort__yogaimg.png | https://ayurvedichealingvillage.com/ppc/web/yogaimg.png | 132 KB |
| wellness-resort__video.jpg | https://ayurvedichealingvillage.com/ppc/web/video.jpg | 33 KB |
| wellness-resort__post.png | https://ayurvedichealingvillage.com/ppc/web/post.png | 64 KB |
| wellness-resort__steps1.png | https://ayurvedichealingvillage.com/ppc/web/steps1.png | 57 KB |
| wellness-resort__fit-reisen.png | https://ayurvedichealingvillage.com/awards/fit-reisen.png | 26 KB |
| south-india-cities__38b-copy-min.jpg | https://ayurvedichealingvillage.com/ppc/images/38b-copy-min.jpg | 97 KB |
| south-india-cities__38a-copy-min.jpg | https://ayurvedichealingvillage.com/ppc/images/38a-copy-min.jpg | 113 KB |
| brand-competition__header-atp-2022.jpg | https://ayurvedichealingvillage.com/ppc/web/header-atp-2022.jpg | 99 KB |
| pain-management__painmanagment-1.jpg | https://www.ayurvedichealingvillage.com/painimagesassets/painimages/painmanagment-1.jpg | 35 KB |
| pain-management__Rheumatism-Approach-min.png | https://www.ayurvedichealingvillage.com/painimagesassets/painimages/Rheumatism-Approach-min.png | 64 KB |
| pain-management__benefit-4.jpg | https://www.ayurvedichealingvillage.com/painimagesassets/painimages/benefit-4.jpg | 66 KB |
| pain-management__TIMAGE-4.png / TIMAGE-5.png / TIMAGE-6.png | …/painimagesassets/painimages/ | 87 / 88 / 120 KB |
| pain-management__doctor.png | https://ayurvedichealingvillage.com/assets/images/doctor.png | 67 KB |
| de-behandlung__Classic-.png.webp | https://ayurvedichealingvillage.com/wp-content/uploads/2025/01/Classic-.png.webp | 38 KB |
| de-behandlung__MAharaj.jpg | https://ayurvedichealingvillage.com/wp-content/uploads/2024/11/MAharaj.jpg | 41 KB |
| de-behandlung__de-post.png | https://ayurvedichealingvillage.com/ppc/web/de-post.png | 78 KB |

Notes: most /awards/*, feature tiles (nature/modern/strict/…), memories thumbnails (except panchakarma pic-10), press headshots, DE wp-content treatment cards (T1–T5, 2024/11 series), and pain-management why-5.jpg/hero-2022.png came in under 25KB and were skipped per spec (all listed in manifest.tsv with sizes).

## Reusable asset shortlist (best hero-grade)
1. **weight-loss__img-1.jpg** (291 KB, 1000px+) — Kairali property/villa exterior; largest, sharpest property shot in the set.
2. **wellness-resort__yogaimg.png** (132 KB) — yoga/meditation on the grounds; strong programme-page candidate.
3. **weight-loss__img-3.jpg** (161 KB) — yoga & meditation session; hero-grade.
4. **south-india-cities__38a-copy-min.jpg / 38b-copy-min.jpg** (113/97 KB) — retreat banner pair (desktop+alt), lush grounds.
5. **panchakarma__img-1.webp** (108 KB, 915×640) — villa in greenery; plus the whole panchakarma why-us set (img-2…img-6: consultation, therapy, therapist, medicine manufacturing, organic farming) which maps 1:1 to clinical-register "why choose us" content.
Runners-up: treatment-packages__may-2022-desk.jpg (existing campaign hero), wellness-resort__Layer-8-min.jpg + header-mobile-2022.jpg (current live hero pair), brand-competition__header-atp-2022.jpg, panchakarma five-folds set (640×738 therapy close-ups — ideal for treatment-step cards), weight-loss__doc_cons.webp (doctor consultation), pain-management__TIMAGE-4/5/6.png (therapy close-ups usable on condition pages).
Caution: testimonial/client photos (panchakarma__pic-1…5, weight-loss__client-1…5) show identifiable patients — get consent status from Deepu before reuse. hod-image-1.png (Dr. Deepu John) and ashika-raj.png (Dr. Ashikha Raj) are physician portraits — reusable on the new site's doctor sections pending their OK.

## Checker pass (claim vs evidence)
- 10/10 pages fetched and parsed — evidence: extractor JSON per page captured in-session; all 10 curl attempts returned CF 403 first (noted).
- robots.txt fetched via curl 200; /sitemap.xml 403 via curl; wp-sitemap.xml + all 12 children read via browser fetch (594 URLs counted from <loc> tags).
- 83 images on disk = 83 OK manifest rows (reconciled with comm after fixing two collision classes: lady.png, testimonials pic-2..5), 5.9 MB — evidence: manifest.tsv, du output.
- Unverified: whether "-new" small variants or skipped <25KB tiles have larger originals elsewhere on the server; noindex status of thank-you pages (not in the 10-page scope); FR pages not fetched (out of scope).
