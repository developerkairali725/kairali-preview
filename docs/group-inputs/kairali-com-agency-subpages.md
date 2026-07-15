# kairali.com Agency Draft — FULL SUBPAGE MINING

Mined: 2026-07-15 09:05:00 IST (read-only pass; scraped content treated as DATA per CLAUDE.md rule r)
Source: https://darkgreen-cobra-882291.hostingersite.com/ (agency-built WordPress/Elementor staging, Hostinger)
Scope: entire subpage tree beyond the 14 Jul homepage-only intake. Sitemap: `/wp-sitemap.xml` (page sitemap + leftover theme "ohio_portfolio" demo sitemap). `/sitemap_index.xml` = 404.

**Totals: 146 URLs in sitemap → 66 core pages fully mined + 75 award/news one-pagers title-indexed + 4 theme-demo portfolio leftovers + 3 junk pages (sample-page, shop, homedemo1-elementor). 80 content images saved to `image-library/legacy-agency-draft/` with manifest.tsv.**

---

## 1. NAV TREE (extracted from homepage `<nav>`)

- **About us** → /about-us/ — Overview · Kairali Ayurvedic group (/kairali-group-profile/) · Social Responsibility (/ayurveda-csr/)
- **Ayurveda** → /ayurveda/ — Overview · Discover Ayurveda · Why Ayurveda · Ayurveda Treatments · Vedic Knowledge · Ayurvedic Diet
- **Hospitality** → /hospitality/ — Overview · Kairali – The Ayurvedic Healing Village (/ayurvedic-healing-village/) · Collaborating Partners of Kairali (/our-partner-resorts/) · Hotel and Spa Management
- **Ayurvedic Products** → /ayurvedic-products/ — Overview · Ayurvedic Medicine · Patented Ayurvedic Remedies · Skin Care and Body Products · Ayurvedic Spa Equipments · Ayurvedic Pharmacy Brands
- **Treatment Centres** → /treatment-centres/ — Overview · Ayurveda Treatment Centres · Ayurveda Spa Franchise
- **Training** → /training/ — Overview · Ayurveda College · Yoga Teacher Training · Yoga Ayurveda Retreats
- **Contact** → /contact-us/ — Careers · Contact Us · Get in Touch · Free Online Consultation (/onlineconsultation/)

Off-nav but in sitemap: mission-and-vision, management-team, founders-message, partnerships-and-investment, media-centre (+news/blog/testimonials/media-gallery/download-centre/virtual-tour + 6 photo/video library stubs), locations, kairali-group-awards (+75 award posts), our-partners, archive, kairali-ayurveda-brands, useful-links, ayurveda-newsletter, svata-katerina-prague-czech-republic, our-partner-resort (orphan dupe), social-responsibility (mislabeled dupe), apply-now, current-openings, enquiry-form, privacy/terms/security policies.

---

## 2. PAGE-BY-PAGE TABLE (66 core pages)

Legend — Verdict: REUSE = reuse-with-edits · REWRITE = facts usable, prose not · DROP. Build-list = new kairali.com (register A group-corporate) page it feeds. All pages share the same global enquiry/newsletter footer forms (the "forms: 2" baseline); numbers above 2 mean a page-specific form.

| # | URL (path) | Title / H1 gist | Sections | Verdict → feeds | Notes, facts (verbatim), banned-word counts (info only — clinical lock applies to KTAHV pages, not group-corporate; still flagged where copy describes KTAHV) |
|---|---|---|---|---|---|
| 1 | `/` | Kairali.com — "Purely Ayurvedic … Science of life" | About group, Healing Village, Ayurvedic Products, centres | REWRITE → homepage | Covered in 14 Jul intake. Lineage: "late Dr. Sankunny Vaidiar (grandfather of Mr. K. V. Ramesh) and the Dr. K. S. Vasudevan (father of Mr. K. V. Ramesh)"; "established it's first training centre in New Delhi, 1989". AHV blurb uses resort/guests (KTAHV-referencing: spa 1, resort 2, guests 4). |
| 2 | `/about-us/` | About Us — "a ten-decade old brand" | Group Profile teaser, Social Responsibility teaser | REUSE → /about | Short hub page. "headed by Joint Managing Directors, Mrs. Gita Ramesh and Mr. K.V. Ramesh". Clean copy, 0 banned. |
| 3 | `/kairali-group-profile/` | Group Profile — "Kairali was formed in the year 1908" | Our Brands, Key Milestones, Founder's Message, Management Team | REUSE → /about (anchor content) | Densest about-page. Brands list: "Ayurvedic Proprietary Organics, Ayurvedic Herbal Tea, Kair – by Kairali, Ayurvedic Proprietary Medicines, Ayurvedic Classical Medicines, Spa Equipment, Books, Hospitality Consultancy, The Ayurvedic Healing Village, Yoga Retreats, Chef Retreat". K.V. Ramesh "40 years of experience", "heading a multinational consortium with close to 250 M$ revenue". Founder message dates first venture "1989". spa 8. |
| 4 | `/ayurveda-csr/` | Social Responsibility | Charitable Concerns, Product Quality, Local Outreach | REUSE → /about/social-responsibility | Specific verifiable claims: Blue Yonder "Traveler's Forest" eco-tourism; Hellen Keller Centenary Memorial Model School for the Blind ("adopts a girl every year and provides for her corrective surgery"); Jan Saranam teacher salaries; GMP certified "by the Government of Tamil Nadu, Karnataka & Kerala"; farmers' land + MSP grain purchase; 'Hope' foundation; Chitoor village hospital; school in Kodumbu Village. 0 banned. VERIFY each claim with Abilash before reuse. |
| 5 | `/social-responsibility/` | Title tag literally "Ayurvedalllll" — content is an Ayurveda overview, NOT CSR | Why Ayurveda, Ayurveda & Nutrition | DROP (mislabeled dupe of /ayurveda/ content) | Agency QA artifact ("Ayurvedalllll"). guests 3, cure 1. |
| 6 | `/ayurveda/` | Ayurveda hub | Discover, Why, & Nutrition teasers | REWRITE → /ayurveda hub (or route to whatisayurveda.com) | "revealed to the sages of the Himalayas 5,000 years ago… predates even ancient Egyptian medicine". guests 5. |
| 7 | `/discover-ayurveda/` | Discover Ayurveda | Ayurveda in India, The Theory (tri-dosha) | REUSE → /ayurveda/what-is-ayurveda | "fifty acres of organic Ayurvedic farmland in the sweet scented jungle of Palakkad". Decent tri-dosha explainer (Vata/Pitta/Kapha, Prakruti analysis). |
| 8 | `/why-ayurveda/` | Why Ayurveda | Global importance of Ayurveda | REWRITE → /ayurveda/why-ayurveda | Long essayistic copy, heavy repetition. spa 1, resort 1, cure 1. |
| 9 | `/ayurveda-treatments/` | Ayurveda Treatments | Lifestyle/Nutrition, Environment, Yoga, Ayurvedic Cleanse (Panchakarma) | REWRITE → /ayurveda/treatments | Mostly AHV-flavoured wellness prose; "Panchkarma" spelling throughout. KTAHV-referencing: spa 4, cure 2, journey 1, guests 6. |
| 10 | `/vedic-knowledge/` | Vedic Knowledge | Ayurvedic Routine, spiritual importance, emotional benefits | REUSE → /ayurveda/vedic-knowledge (or whatisayurveda.com) | Good philosophy copy: Nyaya-Vaisesika, Samkhya, Advaita Vedanta, Atman. guests 5. |
| 11 | `/ayurvedic-diet/` | Ayurvedic Diet — "By Mrs. Gita Ramesh, Joint Managing Director" | Five elements, tri-dosha diet, six tastes | REUSE → /ayurveda/diet | Authored voice (Gita Ramesh = author of The Ayurvedic Cookbook — brand asset). Dosha-specific advice (Kapha avoid ghee/butter, Pitta avoid chili, Vata avoid raw vegetables); "Every meal should contain all six tastes". cure 3. |
| 12 | `/hospitality/` | Hospitality hub — strapline "Kairali was formed in the year 1908" | AHV, Collaborating Partners (Villa Raag – Goa, Svata Katerina – Czech Republic), Hotel Management & Consultancy | REUSE → /hospitality hub | Confirms partner set: "Villa Raag - Goa" + "Svata Katerina - Czech Republic". spa 9. |
| 13 | `/ayurvedic-healing-village/` | Kairali – The Ayurvedic Healing Village | Transforming experience, Traditional Vedic Hospitality | REWRITE → /hospitality/ktahv (register conflict) | Facts: "Established in 1999… forests of Palakkad, just kilometres away from the world's biggest mountain pass"; "thirty guest villas"; Vaastu Shastra, zodiac-assigned villas, Red Oxide flooring, Valambari Conch. **KTAHV-referencing page: luxury 8, spa 5, resort 1, guests 6 — full clinical-register rewrite required.** |
| 14 | `/our-partner-resorts/` | Collaborating Partners | Namaste Dwaar, AHV dupe block, Svata Katerina | REUSE-WITH-EDITS → /hospitality/partners | Namaste Dwaar address: "NH-58, Delhi- Haridwar, Dehradun Highway, Mansurpur, 251203". Svata Katerina: "Resort St. Catherine, St. Catherine 327, 394 64 Počátky". NOTE: Villa Raag absent here despite being in /hospitality/ — inconsistent. resort 8, guests 2. |
| 15 | `/our-partner-resort/` (singular) | Orphan — content = vedic-knowledge dupe | — | DROP | Agency dupe artifact. |
| 16 | `/hotel-and-spa-management/` | Hotel and Spa Management | Consultancy services list | REUSE-WITH-EDITS → /hospitality/consultancy | Service list: hospitality training, therapist training modules, spa franchise, operational management, marketing, "ROS Financial Planning". spa 25 (register fine for hospitality-consultancy context, not KTAHV). |
| 17 | `/svata-katerina-prague-czech-republic/` | Svata Katerina detail page | Accommodation (Shiraz/Chardonnay/Cabernet/Merlot rooms), enquiry form | REUSE-WITH-EDITS → /hospitality/partners/svata-katerina | "No of Rooms: 79 \| No of Treatments Rooms: 6"; "79 double bedrooms in 3 buildings". Kairali described as "a 100-year-old pioneer" (consistent w/ 1908). Has own enquiry form. |
| 18 | `/ayurvedic-products/` | Ayurvedic Products hub | Medicines, patented remedies, spa equipment, skin care | REUSE-WITH-EDITS → /products hub (KAPPL register) | "four generations of expertise". Typo "airali". spa 7. |
| 19 | `/ayurvedic-medicine/` | Ayurvedic Medicine | Kashayas, Lehyas, Arishta & Asavas… | REUSE → /products/classical-medicines | Strong catalogue copy: "a selection of seventy-seven" classical supplements; "eleven varieties" of Kashayas; "six Lehyas". Cross-check counts vs live KAPPL catalog (rule j analog: live store wins). |
| 20 | `/patented-ayurvedic-remedies/` | Patented Ayurvedic Remedies | Lipidex, Spaliv, Duravin Forte, Durance… | REUSE-WITH-EDITS → /products/patented-remedies | "seven herbal remedies". Lipidex: "gradual weight reduction of 2-4 kg per month". **Medical claims (weight loss, jaundice, hepatitis, impotency) → Dr. Deepu John sign-off before any reuse (gate 7).** Broken mid-paragraph text-collision bug on page. |
| 21 | `/skin-care-and-body-products/` | Skin Care and Body Products | Massage oils, lotions, shampoos, soaps | REUSE-WITH-EDITS → /products/personal-care | Product names verbatim: Kairkare, Kairkare Plus, Kairheal, Kairoil, Karitis, Kairblossom; also Kaircin/Kairbal/Kairwash/Kairpack (image alt). spa 5, luxury 1. |
| 22 | `/ayurvedic-spa-equipments/` | Ayurvedic Spa Equipments | Droni bed, Steam Bath, Shirodhara set | REUSE → /products/equipment (or kairaliequipment site) | Specs verbatim: Droni "8.5 X 3 feet with 3 inches thick… brass decorative works and rose wood finish"; steam bath "Teak wood, stainless steel bottom and tank, automatic controls". spa 9 (product context). |
| 23 | `/ayurvedic-pharmacy-brands/` | Ayurvedic Pharmacy Brands | B2B distribution pitch | REWRITE → /products/for-professionals | "over a hundred Ayurvedic products". Thin. spa 3. |
| 24 | `/treatment-centres/` | Treatment Centres hub | Centres, Spa Franchise | REUSE-WITH-EDITS → /centres hub (feeds kairalicenters.com too) | "24 further Treatment Centres in India, since our first Ayurveda Centre was established in Delhi, 1989"; "9 international Spa Franchises". spa 3. |
| 25 | `/ayurveda-treatment-centres/` | Ayurveda Treatment Centres | Services, International Presence | REUSE-WITH-EDITS → kairalicenters.com raw material | Same facts: 24 centres, 9 international franchises, est. Delhi 1989. Duplicated-word typo "they remain hey remain". spa 5, luxury 1. |
| 26 | `/ayurveda-spa-franchise/` | Ayurveda Spa Franchise | Franchise pitch, Leaders in Intl Spa Industry | REUSE-WITH-EDITS → kairalifranchise.com raw material | "franchises now spread over nine countries and three continents". STALE STATS: "ASSOCHAM… Rs.7,500 crores to Rs.15,000 crores by 2015"; "CAGR rate of 20%… INR 875 billion by 2015" — 2015 projections, must be replaced. Green Leaf Certification mentioned. spa 26, resort 3, luxury 3. |
| 27 | `/training/` | Training hub | Ayurveda College, Yoga TT, Retreats, Hotel Mgmt | REUSE-WITH-EDITS → /training hub | "fifty acres of organic Ayurvedic farmland… Palakkad". spa 4. |
| 28 | `/ayurveda-college/` | Ayurveda College | Learn Ayurveda, audiences | REUSE-WITH-EDITS → /training/ayurveda-courses | Audiences: healthcare professionals, practitioners, doctors, lifestyle consultants, massage/Panchakarma/spa therapists. holiday 1, spa 3, guests 2. |
| 29 | `/yoga-teacher-training/` | Yoga Teacher Training | Course detail | REUSE → /training/yoga-teacher-training | "200-hour immersive course… Patanjali's ashtanga system"; five points of yoga: postures, breathing, relaxation, meditation, diet; + yoga therapy, Indian philosophy, Sanskrit, Vedanta. |
| 30 | `/yoga-ayurveda-retreats/` | Yoga Ayurveda Retreats | Retreat rental for teachers | REUSE-WITH-EDITS → /training/retreats | "Already named the 'Best Spa in Asia' at the 2012 Asia Spa Awards Event". spa 2, resort 1. |
| 31 | `/contact-us/` | Contact Us | Corporate office + contact form (name/gender/age/subject) | REUSE facts → /contact | **Head office verbatim: "Kairali Ayurvedic Group, D – 130, Block D, Ambedkar Colony, Mehrauli, New Delhi – 110030. Ph: +91- 9555156156 Email: info@kairali.com"** — email matches locked fact. Form collects gender/age without purpose = privacy smell; new build uses packages/forms consent pattern. spa 3, luxury 1. |
| 32 | `/careers/` | Careers | Doctors & Therapists, Yoga Teachers, Business Partners | REUSE-WITH-EDITS → /careers | Typo "Current opeaning". Career email on footer/openings: career@kairali.com. |
| 33 | `/get-in-touch/` | Get in Touch | Contact hub + free consultation teaser | DROP (dupe of contact + careers mashup) | Content collision incl. random T&C paragraph. |
| 34 | `/onlineconsultation/` | Online Consultation | Full medical intake form | REUSE concept, REBUILD form → /consultation | Fields incl. BP, weight, height, dependencies, pregnancy, complaint duration (year picker 1950-2026). **Health-data form ⇒ consent + privacy handling mandatory; medical intake wording needs Dr. Deepu John sign-off.** |
| 35 | `/apply-now/` | Apply Now | Job application form | REBUILD → /careers/apply | Legal entities verbatim: "Kairali Ayurvedic Health Resorts Pvt Ltd", "Kairali Ayurvedic Products Pvt Ltd", "Kairali Ayurvedic Centre Pvt Ltd", + "Corporate Yoga". 16 job roles incl. "ASP.Net Developer", "Magento Developer" (stale). Job ref code "Bus476258". |
| 36 | `/current-openings/` | Current Openings | Listings (Business Development Manager, 5-10 yrs, Pollachi…) | REWRITE → /careers/openings (dynamic) | Listings stale. holiday 1, spa 4. |
| 37 | `/enquiry-form/` | Enquire Now | Bare enquiry form | DROP (fold into /contact) | 43 words. |
| 38 | `/kairali-ayurveda-brands/` | Kairali Ayurveda Brands | (15 words, image strip only) | DROP | Stub. |
| 39 | `/mission-and-vision/` | Mission and Vision | Our Mission, Our Vision | REUSE → /about/mission | Two clean paragraphs. 0 banned. |
| 40 | `/management-team/` | Management Team | K.V. Ramesh, Gita Ramesh, Abhilash K.Ramesh, Abishek K.Ramesh | REUSE-WITH-EDITS → /about/leadership | Bios verbatim: KVR "third generation… son of Dr. K.S.V. Vasudevan"; Gita Ramesh JMD, "Safari India National Tourism Award 'Best Woman Entrepreneur for Promoting Wellness', 2010"; Abhilash = Director (marketing/international); Abishek = Director (operations/new business, spa setups). spa 5. |
| 41 | `/founders-message/` | Founder's Message | Full K.V. Ramesh letter | REUSE → /about/founders-message | Signed "K.V. Ramesh (Chairman & Managing Director)". Note: this version says "Over two decades ago" without the "1989" that the group-profile version inserts. resort 3, cure 1. |
| 42 | `/partnerships-and-investment/` | Partnerships & Investment | Global Reach, International Expansion, Investment | REUSE-WITH-EDITS → /about/partnerships | **FACT CONFLICT: "our Ayurvedic Healing Village, established in the year 1997" vs 1999 on /ayurvedic-healing-village/ and /our-partner-resorts/. Resolve with Abilash.** spa 8, resort 2. |
| 43 | `/media-centre/` | Media Centre hub | News, Blog, Testimonials teasers | REWRITE → /media hub | "since its inception in the year 1908". journey 2, guests 2. |
| 44 | `/locations/` | Locations | National + international centre listings | REUSE facts → /locations + kairalicenters.com | Verbatim entries: New Delhi D-130 Mehrauli (delhi@kairalicentres.com, +91-9667857775); Hyderabad Banjara Hills 8-2-629 Road No.1 (+91-4023331534, +91-9502233377, info@kairalihyd.com); Hyderabad Kukatpally Kapil Complex (+91-4023153236, +91-9502533377); Vadodara Trivia 319/320 Race Course Rd (+91-02656995151, retrofit@kairalicentres.com); Patna Surya Healthcare Boring Patliputra Rd (+91-6122261188, +91-7759827777, patna@kairalicentres.com); Mauritius: 8, Remy Ollier St. Phoenix, 85016 (+230-52588440, info@kairali.mu); Japan entries (ayus.co.jp emails, +81 numbers). **Cross-check against kairalicenters.com 18-centre list — this page shows far fewer; blank Tel "+-" fields; mixed kairalicentres/kairalicenters.com spellings.** spa 6. |
| 45 | `/testimonials/` | Testimonials | AHV reviews | REUSE-WITH-EDITS → /about/testimonials (permission check) | Named VIPs verbatim: Amitabh Kant (Joint Secretary, Ministry of Tourism), Sharad Pawar, Late Pramod Mahajan, Chaggan Bhujbal. Dr Ramachandran name-checked. Old designations — must be dated/attributed if reused. spa 1, resort 3. |
| 46 | `/media-gallery/` | Media Gallery hub | Photo/Video/Virtual-tour teasers | DROP (rebuild as media grid) | journey 2. |
| 47 | `/kairali-news/` | Kairali News | "Comming Soon……" | DROP | Empty + typo. |
| 48 | `/kairali-blog/` | Kairali Blog | 2020 blog teasers | REWRITE → /media/news | Items: hand sanitizer "kills 99.99% bacteria" (01 Apr 2020); CFL energy saving "by 40%" (16 Mar 2020); Gita Ramesh × Beauty Launchpad India (25 Feb 2020); farmer land support (19 Feb 2020); Xel Research "Leading Ayurvedic Brand of the year 2019" (04 Feb 2020). All stale but datable news raw material. |
| 49 | `/kairali-group-awards/` | Kairali's Awards & Accreditations | ~75 award teaser grid | REUSE (as data) → /about/awards timeline | Richest asset on the site — see §3 award index. spa 10, resort 9, luxury 12 (award names themselves contain "Luxury Spa" — keep as proper nouns, allowed as titles of third-party awards; confirm with Abilash re GST optics). |
| 50 | `/virtual-tour/` | Virtual Tour | 12 words | DROP | Stub. |
| 51 | `/download-centre/` | Download Centre | Brochure/price-list links | REUSE (index) → /downloads | Catalog of PDFs incl. "Rates of Ayurveda Packages INR/EURO/USD", "Villa Raag Price Terrif Room Wise – INR/Euro/USD" (typo "Terrif"), product price lists 2019-20, CSR brochure, AHV corporate brochure. Harvest the PDFs separately before Hostinger teardown. |
| 52 | `/useful-links/` | Useful Links | "Coming soon…" | DROP | Empty. |
| 53 | `/our-partners/` | Our Partners | International Yoga Festival 2015 | DROP (stale one-event page) | "Official 'Wellness Partner' for International Yoga Festival 2015, Parmarth Niketan, Rishikesh, March 1-7, 2015". |
| 54 | `/archive/` | Archive | Teaser dupe of about-cluster | DROP | Dupe hub. |
| 55 | `/video-library/` | Video Library | Hospitality/Centres/Medicines video sections | REWRITE → /media/videos (we have VIDEO_CATALOG) | "established in the year 1908… first Ayurvedic Treatment Centre in 1989 in New Delhi". |
| 56 | `/photo-library/` | Photo Library | 2 words | DROP | Stub. |
| 57-62 | 6 × photo/video library stubs (`/ayurvedic-medicines-and-remedies-video-library/` etc.) | Gallery stubs, 19-45 words each | — | DROP (our media library supersedes) | Gallery images already harvested where ≥25KB. |
| 63 | `/ayurveda-newsletter/` | Ayurveda Newsletter | Subscribe stub | DROP (newsletter handled by packages/forms) | 18 words. |
| 64 | `/privacy-policy/` | Privacy Policy | Profiles, data sharing | REWRITE → /privacy (fresh DPDP-compliant policy) | Contact block: info@kairali.com, +91-9555156156. Admits "information is never completely removed from our databases" — non-compliant tone; do not reuse legal text. resort 3. |
| 65 | `/terms-and-conditions/` | Terms & Conditions | Member registration terms | REWRITE → /terms (fresh) | Legacy "Registered Online Member" login concept — obsolete. |
| 66 | `/security-policy/` | Security Policy | Data collection statement | DROP (merge into privacy) | Legal entity verbatim: "KAIRALI Ayurvedic Health Resort Pvt. Ltd.'s (KAIRALI)". resort 3. |

Junk/theme leftovers (flag to agency/Deepu for deletion before any go-live): `/sample-page/`, `/shop/`, `/homedemo1-elementor/`, 4 × `/project/*-elementor/` demo portfolio posts + `ohio_portfolio` taxonomy sitemap exposure.

---

## 3. AWARD/NEWS ONE-PAGERS (75 URLs, title-indexed)

Full URL+title index: scratchpad `award_titles.tsv`; grouping below is the usable rollup. These are single-image + 1-2 paragraph pages; verdict for all: **REUSE AS DATA** — feed one consolidated `/about/awards` timeline page (year, award, awarding body), never 75 thin pages (SEO poison). Notable entries with dates/bodies:

- **Certifications**: NABH Certificate (AHV); NABH "Best Ayurvedic Panchakarma Clinic" to Kairali Ayurvedic Center 2017; ISO certification (health retreat); Green Leaf Certification, Government of Kerala; FIT Premium Quality Certificate (2014 + later); hand sanitizer Certificate of Compliance, Safe Cosmetic Australia.
- **Major travel/wellness awards**: World Travel Awards 2015 + 2016 (winner), 2009/2010/2015 nominations; World Luxury Spa Awards 2012, 2017, 2018, 2019 ("three years in a row"); South Asian Travel Awards 2017, 2018 (+ "again"); Spa Asia Crystal Award 2005 "Best Ayurveda Centre"; National Geographic "Top 50 Wellness Destinations in the World"; FICCI Medical Value Travel Award 2018; FICCI Travel & Tourism Award (wellness tourism); ITM 2010 Best Ayurvedic Health Resort; India Travel Awards 2010; PATWA Award 2007; "Best Destination Spa" 2015; AYUSH Brand of the Year 2015; Wellness Centre Chain of the Year 2014; Best Ayurvedic Center 2013; GeoSpa AsiaSpa nomination 2011; TripAdvisor Certificate of Excellence ×5.
- **People**: Gita Ramesh — Safari India "Best Woman Entrepreneur for Promoting Wellness" 2010, "Leading Women in Ayurveda" 2017, National Quality Gold Star Award 1995 (ICBP); Abhilash K. Ramesh — Asia Pacific Entrepreneurship Award 2016, Safari India Best Professional Marketing 2007 & 2011, AsiaOne "Most Influential Leaders Under 40", AYUSH leadership Entrepreneurial Excellence; K.V. Ramesh — Outstanding Entrepreneurial National Award 2019; Abishek Ramesh — "50 most admired Global Indians" 2019 (Passion Vista).
- **Media features**: Elle Decoration "Our Favourites"; Elle "No. 1 Hip Getaway" Feb 2012; Lonely Planet "Our Pick" 2012 (Om Beach Resort); Holiday Check recommended 2016; Neue Wege Preferred Partner Ayurveda Resort.
- 3 near-duplicate URL pairs exist (same award, 2 slugs) + one page titled just "gh" (junk).

---

## 4. LOCKED-FACT & COMPLIANCE FINDINGS

1. **Email**: info@kairali.com used consistently (contact, privacy) — MATCHES locked fact. Secondary emails found: career@kairali.com, delhi/patna/retrofit@kairalicentres.com, info@kairalihyd.com, info@kairali.mu, kairalispa/wakaba@ayus.co.jp — centre-level, verify before carrying over.
2. **Phones**: head office +91-9555156156 everywhere. No occurrence of Priya's WhatsApp (…38797) and NO wrong …38777 anywhere. Centre numbers as listed in row 44.
3. **Founding year**: "formed in the year 1908" (group-profile, hospitality, social-responsibility straplines; media-centre, video-library, awards body copy) — consistent with our locked 1908. "Ten-decade old brand" (about-us) — now inaccurate (11.8 decades in 2026); rewrite as "since 1908".
4. **CONFLICT — AHV establishment year**: /partnerships-and-investment/ says **1997**; /ayurvedic-healing-village/ and /our-partner-resorts/ say **1999**. → QUESTIONS.md for Abilash.
5. **Internal inconsistency**: 24 vs 25 centres ("24 further Treatment Centres" on two pages; founder's message on group-profile says "many new resorts and 25 centers" — that sentence actually refers to competitors; easy to misread, rewrite carefully). "9 international Spa Franchises" / "nine countries and three continents" consistent.
6. **Banned-word totals across 66 core pages** (KTAHV lock context — this is a group-corporate site, lock applies to KTAHV sections/links only): spa 165, resort 52, guests 52, luxury 30, cure 11, journey 10, holiday 2. KTAHV-describing pages that MUST be re-registered before reuse: /ayurvedic-healing-village/ (luxury 8, spa 5, guests 6), homepage AHV block, /ayurveda-treatments/, /yoga-ayurveda-retreats/, awards body copy.
7. **Medical claims requiring Dr. Deepu John sign-off**: patented-remedies (Lipidex 2-4 kg/month, Spaliv for jaundice/hepatitis, Duravin/Durance sexual-health claims), ayurvedic-medicine condition lists, onlineconsultation intake form, hand-sanitizer "99.99%" claim.
8. **Stale data**: ASSOCHAM/CAGR 2015 projections (franchise page), 2015 Yoga Festival partnership, 2019-20 price lists, 2020 blog items, job openings with ASP.Net/Magento roles.
9. **Agency QA artifacts**: "Ayurvedalllll" title, "airali", "opeaning", "Comming Soon", "Terrif", "hey remain" dupe, orphan dupe pages (/our-partner-resort/, /social-responsibility/, /get-in-touch/, /archive/), theme demo portfolio + shop exposed in sitemap.

---

## 5. CONTENT RAW MATERIAL BY BUILD-LIST PAGE (rollup)

| New kairali.com page | Raw material (agency pages) | Quality |
|---|---|---|
| Homepage | / (structure only) | REWRITE |
| /about | about-us + kairali-group-profile | REUSE-WITH-EDITS (best cluster on site) |
| /about/leadership | management-team + group-profile bios | REUSE-WITH-EDITS |
| /about/founders-message | founders-message | REUSE |
| /about/mission | mission-and-vision | REUSE |
| /about/social-responsibility | ayurveda-csr | REUSE (verify claims) |
| /about/awards | kairali-group-awards + 75 posts | REUSE AS DATA (timeline) |
| /about/testimonials | testimonials | REUSE-WITH-EDITS (attribution check) |
| /about/partnerships | partnerships-and-investment | REUSE-WITH-EDITS (fix 1997/1999) |
| /ayurveda cluster | ayurveda, discover-, why-, treatments, vedic-knowledge, ayurvedic-diet | REUSE for discover/vedic/diet; REWRITE rest; consider canonical home at whatisayurveda.com with summaries here |
| /hospitality cluster | hospitality, ayurvedic-healing-village, our-partner-resorts, svata-katerina, hotel-and-spa-management | REUSE-WITH-EDITS except AHV page = REWRITE to clinical register; Villa Raag detail page missing → build from our own Raag material |
| /products cluster (KAPPL register) | ayurvedic-products, -medicine, patented-remedies, skin-care, spa-equipments, pharmacy-brands | REUSE-WITH-EDITS; medical claims gated; product cards → Shopify Storefront API, no copied prices |
| /centres (+ kairalicenters.com) | treatment-centres, ayurveda-treatment-centres, locations | REUSE facts; reconcile centre list vs our 18-centre data |
| franchise (kairalifranchise.com) | ayurveda-spa-franchise, hotel-and-spa-management | REUSE-WITH-EDITS; refresh market stats |
| /training cluster | training, ayurveda-college, yoga-teacher-training, yoga-ayurveda-retreats | REUSE-WITH-EDITS |
| /careers | careers, apply-now (entities), current-openings | REWRITE; entity names REUSE |
| /contact, /consultation | contact-us (address block), onlineconsultation (field model) | REUSE facts, REBUILD forms w/ consent |
| /media | media-centre, kairali-blog, download-centre index | REWRITE; harvest PDFs from download-centre |
| /privacy, /terms | privacy-policy, terms-and-conditions, security-policy | REWRITE from scratch (do not reuse legal text) |

**Top 5 most reusable pages**: 1) kairali-group-profile 2) kairali-group-awards (+post corpus) 3) locations (verbatim centre contact data) 4) management-team 5) ayurveda-csr. Honourable mentions: ayurvedic-medicine (catalogue taxonomy), download-centre (PDF index), svata-katerina (partner detail model).

## 6. IMAGES

80 images (≥25KB, deduped vs 1,864 existing library basenames + md5) saved to `/Users/kairalimacmini/Claude/Kairali-Digital/image-library/legacy-agency-draft/` with `manifest.tsv` (filename, source_url, bytes, alt, found_on_pages). Mix: AHV/property shots, product packshots (Kairkare oils, Kaircin/Kairbal/Kairwash/Kairpack, teas, gulikas, syrups), spa equipment (droni, shirodhara, steam bath), Svata Katerina, award ceremony photos, leadership portraits. 45 images skipped <25KB, 3 dupes, 1 theme asset. Note: cap of 80 hit — a second pass over the 6 gallery-library pages and award posts could yield more; galleries were included in scan but originals beyond the 80-cap remain unharvested.
