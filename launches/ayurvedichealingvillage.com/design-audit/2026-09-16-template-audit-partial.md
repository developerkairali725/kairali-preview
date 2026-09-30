# AHV template design audit — 2026-09-16/19

Workflow `wf_66ad40c6-509`, benchmark = the owner-built homepage and package pages, measured in a real browser at 390px and 1280px.

**Coverage: 60 of 67 templates — 243 of 250 routes (97.2%).** The 7 unaudited templates are single-route each; one of them (`ahv-page-yoga-meditation-programs`) has since become a derived instance of the benchmark finder, so the comparison no longer applies to it. Verification and the synthesis agent did not run (allowance); the clustering below is derived mechanically from the findings themselves.

**Findings: 143 HIGH · 326 MEDIUM · 255 LOW** across 60 templates. Verdicts: 9 major-drift, 51 minor-drift, 0 matches-benchmark, 0 broken.

## The shape of it: six defects, repeated everywhere

These are not 724 separate problems. The same handful of drifts recur on almost every template, which means they are fixable as sitewide rules rather than page by page:

| Defect | templates | routes reached |
|---|---|---|
| Body/label type below the 15–17px floor | 60 | 244 |
| CTAs are inline text links, not the button system | 59 | 243 |
| Hero imagery: not full-bleed, reused, or empty alt | 59 | 243 |
| Gold eyebrow missing above H1/H2 | 58 | 242 |
| Tap targets under 44px | 51 | 235 |
| Tables unreadable at phone width | 38 | 205 |
| Desktop is the phone column stretched | 15 | 165 |

506 of 724 proposed fixes are a scoped stylesheet or a small boot.ts DOM pass — one shared change, not per-page work. 176 are content or owner input (facts, alt text, slugs) and are explicitly flagged 'do not invent'.

## Per template

| Template | routes | verdict | HIGH | MEDIUM | LOW |
|---|---|---|---|---|---|
| ahv-page-article-reader | 135 | major-drift | 4 | 5 | 3 |
| ahv-page-confirmation | 10 | minor-drift | 2 | 4 | 4 |
| ahv-page-enquiry | 10 | major-drift | 4 | 9 | 5 |
| ahv-page-ayurveda-gallery | 9 | major-drift | 3 | 6 | 5 |
| ahv-page-policy-reader | 9 | minor-drift | 0 | 5 | 5 |
| ahv-page-campaign-nine | 8 | major-drift | 7 | 5 | 2 |
| ahv-page-campaign-retreat | 7 | major-drift | 5 | 9 | 2 |
| ahv-page-attractions | 4 | minor-drift | 0 | 6 | 5 |
| ahv-page-about-us | 1 | minor-drift | 2 | 4 | 5 |
| ahv-page-accreditations | 1 | minor-drift | 2 | 6 | 6 |
| ahv-page-all-programs | 1 | major-drift | 4 | 3 | 5 |
| ahv-page-ananda-lahari-retreat | 1 | minor-drift | 0 | 6 | 3 |
| ahv-page-ashtanga-retreat | 1 | major-drift | 4 | 2 | 4 |
| ahv-page-awards-and-accolades | 1 | minor-drift | 0 | 3 | 4 |
| ahv-page-ayurveda-training-programs | 1 | minor-drift | 2 | 4 | 5 |
| ahv-page-ayurvedic-treatments | 1 | minor-drift | 2 | 8 | 4 |
| ahv-page-ayuryoga | 1 | minor-drift | 0 | 4 | 4 |
| ahv-page-back-to-roots | 1 | minor-drift | 0 | 2 | 4 |
| ahv-page-breath-respiratory | 1 | minor-drift | 4 | 5 | 5 |
| ahv-page-chronic-back-pain | 1 | minor-drift | 4 | 4 | 4 |
| ahv-page-classic-villa | 1 | minor-drift | 1 | 4 | 4 |
| ahv-page-de-addiction-rehabilitation | 1 | minor-drift | 4 | 7 | 2 |
| ahv-page-deluxe-villa | 1 | minor-drift | 1 | 5 | 4 |
| ahv-page-diabetes-metabolic-balance | 1 | minor-drift | 2 | 4 | 4 |
| ahv-page-digestive-wellness-gut-health | 1 | minor-drift | 3 | 5 | 6 |
| ahv-page-facial-paralysis | 1 | minor-drift | 4 | 10 | 5 |
| ahv-page-holistic-rejuvenation-detoxification | 1 | minor-drift | 3 | 6 | 6 |
| ahv-page-hypertension | 1 | minor-drift | 5 | 4 | 5 |
| ahv-page-immunity-executive-health | 1 | minor-drift | 2 | 6 | 4 |
| ahv-page-joint-rehabilitation-arthritis | 1 | minor-drift | 3 | 8 | 4 |
| ahv-page-knowledge-centre | 1 | minor-drift | 2 | 4 | 3 |
| ahv-page-lakshya-yoga | 1 | minor-drift | 1 | 4 | 3 |
| ahv-page-maharaja-suite | 1 | minor-drift | 1 | 4 | 7 |
| ahv-page-mindfulness-retreat | 1 | minor-drift | 1 | 6 | 3 |
| ahv-page-neck-upper-back (views: public/ahv/views/ahv-page-neck-upper-back-desktop.json + -mobile.json; root #ahv-design-root[data-ahv-route="/treatment-for-cervical-spondylosis/"][data-ahv-view=ahv-page-neck-upper-back-desktop|mobile]; note: page carries 0 data-source-pointer attributes — blocks are addressable only by section id (#about #history #recognitions #process #benefits #testimonials #package) and data-dc-tpl index) | 1 | minor-drift | 4 | 4 | 4 |
| ahv-page-nervous-disability | 1 | minor-drift | 4 | 5 | 3 |
| ahv-page-our-partners | 1 | minor-drift | 1 | 4 | 5 |
| ahv-page-our-villas | 1 | minor-drift | 0 | 6 | 5 |
| ahv-page-panchakarma-therapy | 1 | minor-drift | 2 | 6 | 3 |
| ahv-page-panchkarma-treatment | 1 | minor-drift | 1 | 8 | 5 |
| ahv-page-paralysis-recovery | 1 | minor-drift | 2 | 8 | 4 |
| ahv-page-past-retreats | 1 | minor-drift | 1 | 4 | 3 |
| ahv-page-personalized-customized-healing | 1 | minor-drift | 4 | 6 | 6 |
| ahv-page-post-pregnancy-health-programme | 1 | minor-drift | 1 | 6 | 4 |
| ahv-page-preventive-regenerative | 1 | minor-drift | 3 | 5 | 4 |
| ahv-page-psoriasis | 1 | minor-drift | 5 | 5 | 4 |
| ahv-page-royal-villa | 1 | minor-drift | 1 | 2 | 5 |
| ahv-page-sinus-migraine | 1 | minor-drift | 3 | 5 | 4 |
| ahv-page-skin-vitality | 1 | minor-drift | 5 | 6 | 4 |
| ahv-page-sleep-restoration | 1 | minor-drift | 1 | 9 | 6 |
| ahv-page-spinal-disc-nerve-restoration | 1 | minor-drift | 3 | 4 | 4 |
| ahv-page-spondylitis | 1 | major-drift | 6 | 5 | 3 |
| ahv-page-stress-strain | 1 | major-drift | 3 | 8 | 3 |
| ahv-page-supportive-care-cancer | 1 | minor-drift | 3 | 7 | 6 |
| ahv-page-training-programs | 1 | minor-drift | 0 | 7 | 5 |
| ahv-page-treatment-programs | 1 | minor-drift | 3 | 8 | 3 |
| ahv-page-vision-eye-rejuvenation | 1 | minor-drift | 1 | 8 | 4 |
| ahv-page-wellness-programs | 1 | minor-drift | 1 | 6 | 5 |
| ahv-page-yala-2018-retreat | 1 | minor-drift | 1 | 3 | 5 |
| ahv-page-yoga-stress-reset | 1 | minor-drift | 2 | 4 | 4 |

## Every HIGH finding

### ahv-page-article-reader (135 routes)
- **Legacy sidebar menu renders as body content above the article on 2 of 3 routes**  
  _structure-hierarchy · bothpx_ — Training route: the first content the reader meets after the hero is H2 'About Us' (30.72px Marcellus, /sections/3/c/1/c/1) followed by H3 'Kairali Ayurvedic Group' + a 15-item bullet list of green links (Kairali Hospita  
  fix: Template-scoped stylesheet + a small DOM pass in boot.ts: detect the leading nav/sitemap block (NAV[data-source-pointer] or the first section whose children are only H2/H3 + UL-of-links, e.g. /sections/3/c/1 on training7, /sections/5/c/1 on reader25b) and tag it .ahv-sidenav; then apply the awards route's accordion treatment (border 1px #E0D7C4, radius 4px, bg #FFF, 44px-min-height rows, H3 items 
- **Currency tab labels render as 11.7px H6 bullets (below the 15px floor) and leave three identical tariff tables unlabeled**  
  _typography · bothpx_ — Training route, /sections/3/c/3/c/38/c/3/c/0/c/0/c/0/c/0/c/{0,1,2}: H6 'INR', 'USD', 'EURO' at font-size 11.725px Mulish, rendered as a plain bullet list under H2 'Package Tariffs' (see train-390-tariff.png and advanced-  
  fix: Scoped CSS: `[data-ahv-route] main h6[data-source-pointer]` → hide the orphan list (display:none) OR restyle as 12px-uppercase-gold eyebrows is not enough for readers; better DOM pass in boot.ts: for each tariff table (/sections/3/c/3/c/38/c/3/c/0/c/0/c/1/c/{1,3,5}/…/table) prepend a `<caption>` or an H3-styled label taken from the corresponding H6 text ('INR', 'USD', 'EURO'), Marcellus 23px, and 
- **Page CTAs 'Book Now' / 'Enquire Now' are 22px-tall inline text links, not the site button system**  
  _buttons-ctas · bothpx_ — Training route: A 'Book Now' 84x22px, A 'Enquire Now' 104x22px, display:inline, bg transparent, colour #006038, 17.5px, no uppercase/tracking, each alone inside a P with max-width 76ch (/sections/3/c/3/c/38/c/5/c/1/c/1/c  
  fix: Scoped CSS keyed on the two pointers (and generically `main p[data-source-pointer] > a[href*='bookings.'], a[href='/enquiry-form/']` when the anchor is the paragraph's only child): display:inline-flex; min-height:52px; padding:0 28px; background:#EEB41E; color:#2A2118; border-radius:4px; font:700 13px/1 Mulish; text-transform:uppercase; letter-spacing:1.5px; text-decoration:none; the second one br
- **Inline link lists give 22px-tall targets — 24 under-size targets on the training route (mobile), 8 on alcohol-free**  
  _tap-targets · bothpx_ — Measured on 390: training route tapSmallCount=24 of 76 (worst five: 'Books' 49x22 /sections/3/c/1/c/3/…/c/1/c/17; 'Royal Villa' 84x21 in tariff tables; 'Book Now' 84x22; 'Enquire Now' 104x22; 'Arogya Shala' 110x22). Alco  
  fix: Scoped CSS: `[data-ahv-route] main li[data-source-pointer] > a:only-child { display:inline-flex; align-items:center; min-height:44px; padding:0 4px; margin:-4px 0; }` and `main td a { display:inline-flex; min-height:44px; align-items:center; }`; keep the 17.5px size. This adds no visible height beyond ~6px per row and needs no content change.

### ahv-page-enquiry (10 routes)
- **enquiry-form: entire lower payload (/sections/5) renders as unstyled prose — labels concatenated, CTAs and badges are plain text**  
  _structure-hierarchy · bothpx_ — Measured on both widths. Section count for /enquiry-form/ = 2 (vs 9 on /contact-us/); everything below the form lives under data-source-pointer /sections/5 with no section wrappers, no cards, no buttons. Screenshot text   
  fix: Scoped stylesheet keyed on [data-ahv-route="/enquiry-form/"] [data-source-pointer^="/sections/5"]: (1) wrap each channel block (…/c/3/c/3/c/N) as a card — white bg, 1px #E0D7C4, 4px radius, 24px padding — and lay them out as a 3-col grid ≥1024px, 1-col below; (2) small DOM pass that converts the 'How'/'Expect' label text nodes into <dt>/<dd> or prefixes them with a gold 12.5px uppercase eyebrow sp
- **enquiry-form: AI-cartoon 'Help??' avatar used as the Patient Care Coordinator photo, upscaled 2.15x and blurry**  
  _imagery · bothpx_ — img src …/ahv/assets/img/legacy/enquiry-form-chat-icon.webp, natural 149x149, rendered 320x320 (2.15x upscale, visibly blurred in both screenshots), alt='Patient Care Coordinator', data-source-pointer /sections/5/c/1/c/3  
  fix: Scoped CSS: [data-ahv-route="/enquiry-form/"] img[src*="enquiry-form-chat-icon"] { display:none } and render the same 72px paper-toned initial-circle used on the contact-us Priya card in its place until a real portrait is supplied (flag the missing asset via the creative-asset request SOP; do not invent one). If a real Priya photo exists in the asset manifest, swap the src in the dataset with owne
- **enquiry-form desktop is the mobile column stretched — single 720/819px column, right 400px of the 1203px content width is empty**  
  _layout-desktop · 1280px_ — At 1280: form#le-form max-width 720px (measured 720px wide), prose paragraphs max-width 819px (pointer /sections/5/c/1/c/3/c/1/c/1/c/1), ul 795.6px, images 320px. No grid or multi-column anywhere below the hero (sections  
  fix: Scoped CSS at ≥1024px keyed on [data-ahv-route="/enquiry-form/"]: place form#le-form and the 'Start a conversation' block (/sections/5/c/1) in a 2-col grid (minmax(0,1.4fr) minmax(0,1fr), gap 48px) like contact-us #message; lay out the six channel blocks (/sections/5/c/3/c/3/c/N) as a 3-col card grid; testimonials (/sections/5/c/7) as a 3-col grid; cap prose at max-width 62ch. Mobile stays single 
- **apply-now hero is a generic stock 'RESUME' clipboard photo with empty alt**  
  _imagery · bothpx_ — img src …/ahv/assets/img/AHV-Enquiry-Resume-Clipboard.webp, natural 1500x500, rendered 1203x400 (desktop) / 367x122 (mobile), alt='' (empty on a content hero), 4px radius. Screenshot shows a stock-library clipboard with   
  fix: Scoped CSS keyed on [data-ahv-route="/apply-now/"]: swap the hero <img> src to an existing real-property photograph already in the asset manifest (e.g. the garden banner AHV-Enquiry-Garden-Banner.png used by contact-us, 1200x382) via a small DOM pass, and set a descriptive alt. If a careers-specific photo (physicians/therapists at work) is wanted, raise a creative-asset request rather than keeping

### ahv-page-confirmation (10 routes)
- **KTAHV banned words in this template family's copy (journey, luxury)**  
  _other · bothpx_ — Rendered on /book-now/ at 390 and 1280 (p, 19px, main#main-content section[data-state=direct-visit]): "Secure your adventure today and begin your journey of Ayurvedic healing and relaxation." Source public/ahv/assets/con  
  fix: Not a stylesheet fix. Flag to Abilash / content owner: the captured legacy copy for /book-now/, /emailsubscriber/ and /contact-us/thank-you/ needs a compliant rewrite in the dataset (Lane B, EN + DE/FR or flagged EN-only). Do not ship the family while these strings render.
- **Live /thanks/ tells the reader it cannot confirm their enquiry while the tab says Thank you**  
  _structure-hierarchy · bothpx_ — Direct visit to /thanks/ at 390 and 1280 renders H1 "Return to the website" (Marcellus 35.1px / 51.2px) and p "This page cannot confirm whether a message or booking was submitted." with document.title "Thank you — your e  
  fix: No CSS fix; owner decision (HARD GATE 6 governs). Either (a) wire the enquiry/consultation forms to redirect with a governed receipt signal the renderer is allowed to trust so the next-steps state shows, or (b) align the direct-visit fallback title/heading so title and H1 say the same thing. Flag in QUESTIONS.md; do not self-decide.

### ahv-page-ayurveda-gallery (9 routes)
- **Generated debug label rendered as the visible section heading on the 8 dataset routes**  
  _structure-hierarchy · bothpx_ — /photo-gallery/ main h2#grp-h0 (data-source-pointer=/sections/8, data-group-role=grid) reads "Photo Gallery — grid, 69 images"; /product-gallery/ same node reads "Product Gallery — grid, 6 images" (Marcellus 24px at 390,  
  fix: Small DOM pass in the render step (or boot.ts hydration) for routes with a dataset: set h2[data-group-role="grid"] text to R.h1's section title only (e.g. the collection name) and move the count into a separate eyebrow-style span above it (Mulish >=15px, uppercase, letter-spacing 2px, color #C1882C, e.g. "69 photographs"). No change to gallery-family-data.js or the approved ayurveda design payload
- **Desktop photo-gallery grid shows large white voids under landscape photos**  
  _layout-desktop · 1280px_ — At 1280 the 69-item grid is `main ul` with grid-template-columns 282.797px x4, gap 24px, align-items normal, grid-auto-rows auto. Portrait sources (840x1200, aspect-ratio 1400/2000) render 281x401; landscape sources (120  
  fix: Scoped stylesheet keyed on the dataset gallery routes: `[data-ahv-route="/photo-gallery/"] main ul > li { align-self: start; }` (removes the stretch), or for a uniform card language `[data-ahv-route^="/"][data-ahv-template*="gallery"] main ul > li img { aspect-ratio: 4 / 3; height: auto; width: 100%; object-fit: cover; }` so every tile is the same shape. Apply the same rule to all 8 dataset routes
- **VIEW IMAGE card labels are 13px / 13.5px, below the 15px floor**  
  _typography · bothpx_ — /ayurveda-gallery/: 8 card buttons (button.scp1 365x219 at 390, 584x321 at 1280) carry two spans: "VIEW IMAGE" Mulish 13px bold uppercase letter-spacing 1.8px rgb(0,96,56) and the arrow "→" 13px rgb(193,136,44) at 390; 1  
  fix: Scoped CSS: `[data-ahv-route="/ayurveda-gallery/"] main button.scp1 span { font-size: 15px !important; letter-spacing: 2px; }` (label wrap already has room: 56px tall label strip). Keep colour/tracking as designed.

### ahv-page-campaign-nine (8 routes)
- **No site chrome: no header, nav or footer on any route**  
  _navigation · bothpx_ — All 6 renders: landmarks header=false, nav=0, footer=false (homepage on the same server at 1280: header 73px tall with 9 links, 1 nav, footer present; at 390: header 65px, 3 controls). The page opens with the 290x68 logo  
  fix: DOM pass keyed on [data-ahv-view^="ahv-page-campaign-nine"]: mount the shared site header/footer chrome around the page wrapper div[data-dc-tpl="3"] (the same shared chrome other English views carry). Until then, a scoped sheet can at least restyle ul[data-source-pointer="/sections/c/6/c/1/c/1/c/3/c/1/c/1"] as a horizontal utility row (list-style:none !important; flex-direction:row !important; gap
- **Every CTA is an inline underlined text link; zero benchmark buttons exist**  
  _buttons-ctas · bothpx_ — Route 1 mobile: 35 interactive elements, 0 with a solid background except the form Submit (BUTTON 324x52, bg #0f5737 green, radius 4px, 17px bold, no uppercase/tracking). All conversion CTAs ('Tell Me More' 99x37, 'Book   
  fix: Scoped sheet: [data-ahv-view^="ahv-page-campaign-nine"] p[data-source-line] > a[href^="/#Enquirenow"], ... a[href^="/#DesktopView"] { display:inline-flex !important; align-items:center; min-height:52px; padding:0 28px; background:#EEB41E !important; color:#2A2118 !important; text-decoration:none !important; text-transform:uppercase; letter-spacing:1.5px; font-size:15px; font-weight:700; border-rad
- **All enquiry CTAs link to the homepage hash, not the on-page form**  
  _navigation · bothpx_ — Route 1: 11 anchors href="/#Enquirenow" (data-source-href="#Enquirenow", rewritten to a root-relative URL by the runtime); routes 2/3: 4 anchors each href="/#DesktopView". No element on any of the three pages carries an   
  fix: Small DOM pass on this template only: rewrite a[href="/#Enquirenow"] and a[href="/#DesktopView"] to point at the on-page form (assign the form a stable id such as the source's own 'Enquirenow' anchor, then href="#Enquirenow"), or, if the owner prefers the site-wide flow, to /enquiry-form/. Also give the form a sticky/secondary 'Enquire' button near the hero since the form is 30-35k px down. Do not
- **21-25 interactive targets per page are under 44px tall**  
  _tap-targets · bothpx_ — Route 1 mobile: 21 of 35 targets <44px (all 37px tall inline links: '+91-9555156156' 140x37, 'info@kairali.com' 129x37 (×2), 'View more' 84x37 (×2), 'Tell Me More' 99x37, 'Privacy Policy' 108x37, 'Cookie Policy' 103x37,   
  fix: Scoped sheet: [data-ahv-view^="ahv-page-campaign-nine"] p a, li a { display:inline-block !important; min-height:44px; padding:10px 0; } Currency links (INR/USD/EURO) as 44px pill buttons with 12px gaps; form input[type=radio], input[type=checkbox] { width:28px; height:28px } with the associated label made the 44px hit area (label { display:inline-flex; min-height:44px; align-items:center; gap:12px
- **Hero slider renders as a bulleted text list 'Image 01 … Image 06'**  
  _imagery · bothpx_ — Route 1, both widths, directly under the logo: <ul data-source-pointer="/sections/c/9/c/1/c/1" style="list-style-type: disc; display:flex; flex-direction:column"> with six <li><span>Image 0N</span></li> (pointers /sectio  
  fix: Scoped sheet keyed on the route: [data-ahv-route="/kairali-cleansing-centre.html"] ul[data-source-pointer="/sections/c/9/c/1/c/1"] { display:none !important } (or a DOM pass that drops <li> whose text matches /^Image \d\d$/), then promote the banner img to a full-bleed hero (width:100%; max-width:none; border-radius:0 or 12px per site language) with the H1/H2 overlaid. Flag to the owner that the s
- **Desktop is the phone column widened to 1024px: no grid, no cards, one column for 15-29k px**  
  _layout-desktop · 1280px_ — Desktop main is a 1024px single column (h1/h2 width 1024 at x=128); the content wrapper div[data-dc-tpl="21"] is display:flex; flex-direction:column on both widths; gridTemplateColumns is 'none' for all 80 measured block  
  fix: DOM pass on this template (same pattern as public/design/directions.css does for /how-to-reach/ via .ahv-band/.ahv-grid/.ahv-card): wrap the award group (children of /sections/c/31/c/1/c/3/c/1/c/1), the feature-icon rows (/sections/c/21/c/1/c/7, /c/9, /c/11), the villa blocks and the testimonial blocks in .ahv-grid; scoped CSS @media (min-width:900px) { .ahv-grid { display:grid; grid-template-colu
- **Villa tariffs: currency labels and prices are disconnected (table semantics lost)**  
  _readability-45plus · bothpx_ — Routes 2 and 3, each of the 4 villa blocks: 'Tariff (Per Night) / Inclusive Treatment*' then a disc <ul> 'INR / Euro / USD' (3 li) followed by three orphan <p> '18709 (Single) 31644 (Double)', '301 (Single) 443 (Double)'  
  fix: DOM pass (no content change): for each villa block, pair the 3-item currency <ul> with the 3 following price <p> into a 3-column definition grid (.ahv-tariff { display:grid; grid-template-columns:repeat(3,1fr) } with the currency as a gold uppercase 15px label above its own price), or render them as one 2-row <table>. Scoped CSS: table th, table td { font-size:17px !important; padding:12px }.

### ahv-page-campaign-retreat (7 routes)
- **Stacked legacy page headers under the site header eat half the phone viewport (family, maharaja)**  
  _navigation · bothpx_ — 390: shared <header> is 131px and position:sticky on all 3 routes. Family: main > div > div:nth-of-type(1) (green rgb(15,87,55) contact/offer bar) 162px + main > div > div:nth-of-type(2) (white bar: second Kairali logo +  
  fix: Scoped CSS: [data-ahv-route="/family-ayurvedic-retreat-kerala.html"] main > div > div:nth-of-type(1), [data-ahv-route="/family-ayurvedic-retreat-kerala.html"] main > div > div:nth-of-type(2), [data-ahv-route="/kairali-air-india-maharaja-club.html"] main > div > div:nth-of-type(1) { display:none !important } on <768px (all styles are inline, so !important is required). On desktop keep only the anch
- **Enquiry form precedes the H1 (form-first hero) on family/maharaja mobile and dominates the desktop hero on all three routes**  
  _structure-hierarchy · bothpx_ — 390 family: form#v1-enquiry top y=450, H1 'Reconnect, Rejuvenate…' top y=1437 (a 7-field form and H2 'Begin Your Family's Healing Journey' come first). 390 maharaja: form#v3-form top y=338, H1 'Your Restoration Awaits' y  
  fix: Scoped CSS reorder without touching content: #v1-hero > div > div, #v3-hero > div > div, #retreat-hero > div:not(form) { order:1 } and #v1-enquiry, #v3-form, #Enquirenow { order:2 } (mobile column). Desktop: #retreat-hero, #v1-hero > div, #v3-hero > div { grid-template-columns: minmax(0,1fr) minmax(0,440px) } with the copy column first; drop position:sticky on #Enquirenow (or cap its height). DOM 
- **62 text elements under the 15px floor on the retreat route: 12–13px eyebrows, 13.5–14px CTA labels, 14px notes**  
  _typography · bothpx_ — Computed font sizes at 390 and 1280 (same counts, 62 leaf elements): eyebrow labels 12–13px x27 (inline 'font-weight:700; font-size:12.5px; letter-spacing:2.2px; color:rgb(143,98,18)' e.g. 'YEARS OF EXPERIENCE', 'WELLNES  
  fix: Scoped stylesheet keyed on [data-ahv-route] with !important (all sizes are inline): eyebrows -> font-size:15px; letter-spacing:2.5px (keep uppercase + rgb(143,98,18)); a/button labels -> font-size:15px; form label -> 16px; helper/notes -> 15px; footer legal links + © -> 15px. Simplest as a small DOM pass: for every leaf element whose computed font-size < 15px set style.fontSize='15px'.
- **Family route runs on a green/mint/white system that does not read as the same site**  
  _colour-tokens · bothpx_ — family@390/1280 colour census: rgb(15,87,55) x90/87 (green promo bar, 'Send Enquiry' submit, 16 programme tab chips with 1px green border on white, prices 'Stay starts from ₹…', accordion +/- icons, carousel arrow glyphs  
  fix: Scoped token remap for [data-ahv-route="/family-ayurvedic-retreat-kerala.html"]: elements with inline background rgb(15,87,55) -> #5A4420 (solid buttons) ; text/border rgb(15,87,55) -> #006038; section backgrounds rgb(233,247,234) -> rgb(239,233,218) (the tinted band already used on the retreat/maharaja routes); tab chips -> brown 1px outline, uppercase tracked 15px; feature chips -> rgb(239,233,2
- **KTAHV register-lock words present in copy, title and alt text (flag only — not a stylesheet fix)**  
  _other · bothpx_ — Rendered body text: retreat 'luxury' x11, 'spa' x3, 'resort' x3, 'guests' x1 and <title> 'Luxury Ayurveda Retreat in Kerala | Kairali Healing Village'; H3 'Kairali- The Winner Of Best Luxury Ayurveda Spa'. Family: 'resor  
  fix: Not fixable by the scoped stylesheet or DOM pass without rewriting approved content — route to the content owner / Dr. Deepu John lane before staging goes further. Listed here so it is not lost; no change proposed to the approved payloads.

### ahv-page-accreditations (1 routes)
- **Certificate-card action label is 11.5px on mobile / 12.5px on desktop**  
  _buttons-ctas · bothpx_ — The only in-content affordance that tells the reader a certificate card opens is the span 'VIEW →' (390: font-size 11.5px, letter-spacing 1.6px, uppercase, green rgb(0,96,56)) / 'VIEW DOCUMENT →' (1280: 12.5px, letter-sp  
  fix: Scoped CSS: [data-ahv-route="/accreditations/"] #certificates button[data-doc-index] > span > span:last-child { font-size: 15px; letter-spacing: 1.5px; min-height: 24px; } — keep colour #006038 (7.69:1 on white). Optionally restyle it as a 44px brown-outline secondary button (border 1px solid #5A4420, radius 4px, padding 0 14px) to match the site button system.
- **KTAHV banned-word family in body copy: 'luxurious'**  
  _other · bothpx_ — Regex scan of main innerText + <title> + meta description for spa|resort|holiday|luxur*|cure|journey|guests returned exactly one hit: 'luxurious' in list item 4 'Wellness and Hospitality Awards' — 'Kairali has received n  
  fix: Not a stylesheet fix and not for the agent to rewrite: flag to the content lane (Lane B) for an owner-approved wording change to the approved payload; requires Dr. Deepu John / Abilash sign-off as clinical-register copy. Until then the page should not go live.

### ahv-page-all-programs (1 routes)
- **Programme directory has zero photography; 33 text-only cards**  
  _imagery · bothpx_ — document.images = 4 (two logo <img> each rendered twice for mobile/desktop; alt 'Kairali — The Ayurvedic Healing Village'); background-image url() elements = 0 at both widths. Homepage measured 20 visible images >300px a  
  fix: Add a media slot to each #browse li card (e.g. a 16:9 <img> with border-radius 4px above the badge) populated by a small DOM pass from each programme's own existing hero/OG image (the same asset the linked programme page already uses) — never a stock or invented image; if a programme has no owned photo, leave the slot out and flag it (HARD GATE 6). Scoped CSS: [data-ahv-route="/all-programs/"] #br
- **Card badges 11px and card action labels 13px — 102 text runs under the 15px floor**  
  _typography · bothpx_ — Text histogram inside #browse at 390 and 1280: 11px Mulish uppercase badge spans ×36 ('TREATMENT' ×29, 'YOGA & MEDITATION' ×5, 'WELLNESS' ×1, 'TRAINING' ×1; inline style 'font-weight:700; font-size:11px; letter-spacing:1  
  fix: Scoped stylesheet on [data-ahv-route="/all-programs/"]: #browse li span[style*="font-size: 11px"] { font-size:15px !important; letter-spacing:1.2px } ; #browse li a, #browse li button { font-size:15px !important; letter-spacing:1.2px } ; #browse label { font-size:15px !important }. Keep uppercase + tracking so the eyebrow/label language is preserved; widen badge padding to 4px 10px so it does not 
- **Mobile filter chips overflow off-screen with no scroll affordance (3 of 5 hidden)**  
  _navigation · 390px_ — Chip scroller: scrollWidth 968 vs clientWidth 390, scrollbar-width:none. Chip rects at 390: 'All programmes 33' 20–200, 'Wellness 1' 208–325, 'Ayurvedic treatments 29' 333–556 (off-screen), 'Ayurveda training 1' 564–751   
  fix: Scoped CSS: [data-ahv-route="/all-programs/"] #browse .chips { flex-wrap:wrap; overflow:visible } (or show a right-edge fade + visible scrollbar: scrollbar-width:thin; mask-image:linear-gradient(90deg,#000 85%,transparent)). Wrapping adds ~50px to the sticky bar, so pair with the sticky-bar fix below.
- **Sticky search/filter bar plus header and bottom bar cover 33% of the phone viewport while reading**  
  _layout-mobile · 390px_ — At scrollY 2500–3000 on 390x844: header div.sc-host position:sticky top:0 h:64; search+filter div position:sticky top:64 h:163 (bg rgba(255,255,255,0.97), backdrop-filter blur(8px), z 40, contains label + 48px input + 44  
  fix: Scoped CSS: @media (max-width:767px) { [data-ahv-route="/all-programs/"] #browse > div[style*="sticky"] { position:static } } (let the search bar scroll away) — or keep only the chip row sticky (collapse label + input when stuck via a small IntersectionObserver DOM pass adding a .is-stuck class that sets the label/input to display:none). Either brings pinned chrome back to ~117–165px.

### ahv-page-about-us (1 routes)
- **Desktop header renders as a non-sticky two-row header, unlike the homepage's single-row fixed header**  
  _navigation · 1280px_ — 1280: <header> is 123px tall, position: relative (not sticky/fixed; after scrolling to y=900 all header controls sit at y=-890). Row 1: logo @38,10 (171x44) + nav links AYURVEDA TREATMENT@629 / VILLAS@836 / YOGA & TRAINI  
  fix: Scoped stylesheet keyed on [data-ahv-route="/about-us/"] header: make the header position: sticky; top: 0; z-index above content; lay the inner wrapper out as a single flex row (logo | nav | search + language + BOOK YOUR STAY) with `flex-wrap: nowrap; align-items: center; height: 73px` and push the right-hand control group with `margin-left: auto`; collapse the EN/DE/FR pills into the homepage's '
- **KTAHV language-lock words present in body copy (compliance flag, not a design fix)**  
  _other · bothpx_ — Rendered <main> text contains 'spa' x3 (#leadership Gita Ramesh bio: 'Kairali's retreats and spas'; #awards: 'best Ayurvedic spa in Asia' and 'World Spa Awards') and 'luxury' x1 (#introduction: 'height of modern holistic  
  fix: No stylesheet fix — escalate to Abilash / content lane (Lane B) for a copy decision; 'World Spa Awards' is a proper noun and needs an owner ruling. Do not ship /about-us/ to production with these strings; clinical-register rewrite needs sign-off per gate 7 if medical claims change.

### ahv-page-past-retreats (1 routes)
- **Sticky header + sticky in-page nav pin 210px (25%) of the phone viewport**  
  _layout-mobile · 390px_ — At 390x844 after scrolling to y=1800: header 64px (sticky, top:0, z-index 80) + nav[aria-label="On this page"] 146px (inline style position:sticky; top:64px; z-index:40; 5 links at min-height:48px laid out as grid-templa  
  fix: Scoped CSS on the template root: `@media (max-width:767px){[data-ahv-route="/archive-yoga-retreat/"] nav[aria-label="On this page"]{position:static}}` (nav becomes a one-time jump list under the hero) OR keep it sticky but collapse to one 48px row: `nav[aria-label="On this page"] > div{display:flex;flex-wrap:nowrap;overflow-x:auto;gap:0 20px;-webkit-overflow-scrolling:touch} nav[aria-label="On thi

### ahv-page-ayurveda-training-programs (1 routes)
- **Course card / table meta text is 15.5-16px, below the 17px body floor**  
  _readability-45plus · bothpx_ — 390: inside each of the 5 course cards (#courses li, inline `dl … font-size: 15.5px`) 20 <dt> labels (Duration/Training hours/Level/Suitable for) and 15 value spans render at 15.5px, and the 5 'Suitable for' descriptions  
  fix: Scoped stylesheet keyed on the route: `[data-ahv-route="/ayurveda-training-programs/"] #courses dl, [data-ahv-route="/ayurveda-training-programs/"] #courses dt, … dd { font-size:17px; line-height:1.6 }` and on desktop `#courses table, #courses td { font-size:17px }` (the 'Suitable for' column can drop `width:28%` to ~32% to absorb the reflow). No content change.
- **KTAHV language-lock hits in this template's content (flag only, not a styling fix)**  
  _other · bothpx_ — Rendered HTML grep (page.html, 334,190 bytes): the banned word 'spa' appears 4 times in visible text — the 'Suitable for' copy of three course rows ('Spa & wellness industry professionals, spa & salon managers & owners…'  
  fix: Do not restyle. Route to the content lane: the four 'Suitable for' strings and the one alt attribute need owner-approved replacements before this page leaves staging; the audit itself makes no wording proposal (approved-content rule). Record in QUESTIONS.md if unattended.

### ahv-page-ashtanga-retreat (1 routes)
- **Two of three content photos are stock urban yoga imagery, not KTAHV photography**  
  _imagery · bothpx_ — img[src$='AHV-Ashtanga-Intro.jpg'] (alt 'Yoga forward fold on a grassy lawn', 560x280 natural) shows a woman in a seated forward fold on a lawn in front of a glass-curtain office building; img[src$='AHV-Ashtanga-Panels.j  
  fix: Asset swap, not CSS: replace AHV-Ashtanga-Intro.jpg and AHV-Ashtanga-Panels.jpg with on-site KTAHV photography (yoga hall / lawn at Olassery, Abhyangam). Until replacements exist, a scoped rule [data-ahv-route='/ashtanga-yoga-and-ayurveda-retreat/'] img[src$='AHV-Ashtanga-Panels.jpg'], img[src$='AHV-Ashtanga-Intro.jpg'] { display:none !important } removes the off-brand skyscraper imagery; draft th
- **Intro two-column grid uses a fixed 560px image column, collapsing body text to 98px (10ch) at 768px**  
  _layout-desktop · 1280px_ — Parent of section#retreat: display:grid; grid-template-columns:minmax(0,1fr) minmax(0,560px); gap:32px 64px (public/ahv/views/ahv-page-ashtanga-retreat-desktop.json). Measured text column (section#retreat / its p): 768px  
  fix: Scoped stylesheet in public/design/directions.css: [data-ahv-route='/ashtanga-yoga-and-ayurveda-retreat/'] section#retreat { max-width:none !important } and its parent grid -> grid-template-columns: minmax(0,1.1fr) minmax(280px,0.9fr) !important on >=1180px, and grid-template-columns: minmax(0,1fr) !important (single column, image below text at max-width 560px) below 1180px. Alternatively minmax(4
- **Shared header/footer chrome carries 12-14.5px text including the mobile primary CTA label**  
  _readability-45plus · bothpx_ — Text nodes under 15px: 41 on 390px, 48 on 1280px (computed font-size histogram). Mobile header: a.scp3 'BOOK NOW' 12px uppercase (99x44 brown button), 'EN' chip 13px. Desktop header nav a.scp1 x5 12.5px uppercase 2px tra  
  fix: Site-wide chrome rule (applies to every route, so key on the header/footer rather than this template): header a.scp3, header a.scp2, header nav a.scp1, footer label, footer button, footer a, footer p, footer span { font-size:15px !important } with letter-spacing reduced to 1px so the desktop nav still fits on one row at 1280 (currently 612px wide, gap 22px). Keep the min-height:44px already presen
- **KTAHV language lock: 'Luxury' in the page <title> and 'journey' in body copy**  
  _other · bothpx_ — document.title = 'Ashtanga Yoga & Ayurveda Retreat | Luxury Wellness Retreat in India' (source: governed <head> in public/ahv/views/ahv-page-ashtanga-retreat-desktop.json, string 'Luxury Wellness Retreat in India</title>  
  fix: Not a stylesheet fix: the <title> string in the design payload head and the one body sentence need a content edit in the approved payload (both -desktop and -mobile JSON), then Dr. Deepu John / Abilash sign-off per Lane B. Flagged, not applied (read-only audit).

### ahv-page-yala-2018-retreat (1 routes)
- **Text under the 15px floor inside the template's own main: eyebrow 13px and CTA labels 13/14px**  
  _typography · bothpx_ — Measured via getComputedStyle at both widths. Eyebrow div before h1 ('PAST RETREAT'): font-size 13px, letter-spacing 2.6px, color rgb(143,98,18) #8F6212 (not benchmark gold #C1882C), weight 700 — same at 390 and 1280. Th  
  fix: Scoped stylesheet keyed on [data-ahv-route="/ayurvedic-new-year-yala-2018/"]: (1) `main div:has(+ h1){font-size:15px;letter-spacing:3px;color:#C1882C}` (matches both the mobile section and the desktop grid cell); (2) `#current a{font-size:15px;letter-spacing:1.5px}`. No content or payload change.

### ahv-page-ayurvedic-treatments (1 routes)
- **Stock clinical photography on at least 8 of 33 programme cards**  
  _imagery · bothpx_ — Visually confirmed in /tmp/claude-501/audit-ahv-page-ayurvedic-treatments/d1280-slice03.png, -slice05.png, -slice07.png, -slice08.png and the mobile equivalents: diabaties.png (blue-gloved hand holding a glucometer; also  
  fix: Not fixable by stylesheet. Raise a creative-asset request (7-part spec, 1200x720 / 5:3 per card slot) for the 8 slots, or have the owner re-map those 8 cards to existing Kairali library photos in the approved payload (e.g. panchkarma.webp / ayurveda-training.webp style therapy shots). Until then a scoped rule `[data-ahv-route="/ayurvedic-treatments/"] img[src$="diabaties.png"], img[src$="bloodpres
- **Mobile page is 32 screens long: 33 full cards stacked in one 24,394px section**  
  _readability-45plus · 390px_ — document.documentElement.scrollHeight = 27,272px at 390x844 (32.3 viewports). The programme <section> is 24,394px tall; card heights measured 628-767px each (33 cards, grid-template-columns: 1fr, gap 20px). Each card car  
  fix: Scoped mobile stylesheet + small DOM pass. CSS (inline styles need !important): `@media (max-width:640px){ [data-ahv-route="/ayurvedic-treatments/"] main img[alt] { height:150px !important } [data-ahv-route="/ayurvedic-treatments/"] p > a[data-dc-tpl="113"] { display:none } [data-ahv-route="/ayurvedic-treatments/"] a.scp2, [data-ahv-route="/ayurvedic-treatments/"] a.scp3 { flex:1 1 45% } }` and la

### ahv-page-classic-villa (1 routes)
- **KTAHV banned words rendered in <title> and body copy**  
  _other · bothpx_ — document.title = "Classic Villa Stay at Kairali – Luxury Ayurveda Retreat Kerala" (contains 'Luxury'). Rendered main.innerText word-boundary counts: 'luxurious' x2 (paragraph 1 'The villas’ luxurious interiors…' and the   
  fix: No stylesheet or DOM fix is appropriate — this is approved design-payload text. Flag to Abilash (and Dr. Deepu John if the copy is treated as clinical) for a content revision of the page <title>/meta and the three body occurrences; do not ship the route to production while the title carries 'Luxury'.

### ahv-page-deluxe-villa (1 routes)
- **In-template micro-labels render at 12-13px, under the 15px floor**  
  _readability-45plus · bothpx_ — Measured via getComputedStyle at 390 (DPR2) and 1280. Gallery thumbnail cards: label span 'View →' = 12px / letter-spacing 1.5px / weight 700, green rgb(0,96,56), 30 instances on mobile (button[data-dc-tpl] inside #galle  
  fix: Scoped stylesheet keyed on [data-ahv-route="/deluxe-villa/"] (all blocks are inline-styled, so declarations need !important): #gallery button span { font-size:15px !important; letter-spacing:1.5px !important } ; #rooms dt, #rooms th { font-size:15px !important } ; #rooms button[data-room-index] { font-size:15px !important } ; span[aria-hidden] diamond glyphs { font-size:15px !important }. No conte

### ahv-page-de-addiction-rehabilitation (1 routes)
- **Fixed mobile CTA bar labels are 12.5px**  
  _typography · 390px_ — 390: fixed DIV at y=792, 390x52 holds CALL (98x52), ENQUIRE (108x52), FREE CONSULT (128x52); each label computed font-size 12.5px Mulish 700 uppercase letter-spacing 1.5px (probe2.mjs widgets). These are the page's persi  
  fix: Scoped CSS on [data-ahv-route="/de-addiction-and-rehabilitation-from-alcohol-drugs-tobacco/"]: target the fixed bottom bar anchors (position:fixed DIV > a) and set font-size:15px; letter-spacing:1px; keep min-height:52px. If the three labels no longer fit at 390, shorten via DOM pass to CALL / ENQUIRE / CONSULT.
- **Desktop paragraphs and list items run 108-185ch**  
  _readability-45plus · 1280px_ — 1280: 38 p/li wider than 75ch (paragraph stats: median 53ch, p75 108ch, max 185ch). FAQ answers p 1203px wide at 17px = 142ch (faqP maxWidth:none); Inclusions <li> ('A Warm Welcome…', 'Luxury Stay…', 15 items) 1183px at   
  fix: Scoped CSS: #faqs details p, #package p, section ul li (inclusions accordion), and the bottom strip p { max-width: 68ch }. For the inclusions list, set the parent ul to columns:2 / grid 2-col at ≥1024px so the list stays parallel-item content rather than a single 1183px column.
- **82-96 text nodes below the 15px floor, including price and category labels**  
  _typography · bothpx_ — smallText count 82 (390) / 96 (1280). Non-eyebrow offenders: tariff cards 'SINGLE'/'DOUBLE' 11.5px rgb(117,105,90) x8, 'per night' 13.5px x8, 'SIGNATURE' badge 10.5px; inclusion category <strong> labels ('Arrival & Accom  
  fix: Scoped CSS floor: [data-ahv-route=…] :is(strong, div, span, a, label, button)[style*="font-size: 1"] cannot be keyed reliably, so key on the inline-styled blocks: #package [style*="11.5px"], [style*="13.5px"], [style*="13px"], header nav a, footer a, footer label, footer button { font-size: 15px !important }. Keep letter-spacing ≤1.5px so uppercase labels still fit.
- **Clip-art 'History of Ayurveda' illustration with baked-in caption text**  
  _imagery · bothpx_ — img /ahv/assets/img/History-of-De-addiction-and-Rehabilitation-Therapy.jpg (natural 580x386, rendered 621x413 desktop / 367x244 mobile, radius 4px), alt 'Illustration of an Ayurvedic scholar writing beside herbs and a mo  
  fix: Not a stylesheet fix — the asset is part of the approved payload. Flag for owner: replace with a real photograph from the media manifest (e.g. the archive/heritage photos used on the homepage) via the missing-asset protocol; until then a scoped CSS rule can hide the image container in #history and let the '1908' watermark + text carry the section.

### ahv-page-vision-eye-rejuvenation (1 routes)
- **Chrome and sticky-bar CTA labels sit at 12-13.5px, under the 15px floor**  
  _readability-45plus · bothpx_ — Mobile fixed bottom bar (data-dc-tpl=537, y=792, 52px tall): 4 buttons (WhatsApp 56x52, CALL 98x52, ENQUIRE 108x52, FREE CONSULT 128x52) all with font-size 12.5px uppercase. Mobile sticky header BOOK NOW (a.scpc) 99x44 a  
  fix: Scoped stylesheet on [data-ahv-route="/beauty-care-and-eye-care/"]: [data-dc-tpl="537"] a, a.scpc, a.scp3, a.scpe, button.scpe, footer a, nav[aria-label="Primary"] a, nav[data-dc-tpl="48"] a { font-size: 15px; letter-spacing: 1px }. The 390px bottom bar is exactly 56+98+108+128 = 390px wide, so reduce its letter-spacing to 0.8px and let CALL/ENQUIRE/FREE CONSULT flex (flex:1 1 0; padding-inline: 8

### ahv-page-holistic-rejuvenation-detoxification (1 routes)
- **Desktop FAQ block runs full 1203px width: 81-110 characters per line**  
  _readability-45plus · 1280px_ — At 1280px the #faqs section has no inner max-width. Intro <p> 'The World Health Organization reports…' measures w=1203px, 18.5px, 220 chars over 2 lines = 110 ch/line (screenshot d1280-v13 shows a single line spanning th  
  fix: Scoped stylesheet keyed on the route root (inline styles dominate, so use !important): [data-ahv-route="/holistic-treatment-for-rejuvenation-and-detoxification/"] #faqs p, #faqs details, #faqs summary { max-width: 72ch !important; } and #recognitions > div:first-of-type p { max-width: 68ch !important; } plus the italic day-plan note (em inside the Dinacharya section) { max-width: 68ch !important; 
- **Tariff card price labels 10.5-13.5px muted on white (SINGLE/DOUBLE, per night, SIGNATURE)**  
  _typography · bothpx_ — Inside section#package the four villa cards render 'SINGLE'/'DOUBLE' as <div> 11.5px uppercase rgb(117,105,90) letter-spacing 1.8px (8 instances), 'per night' as <div> 13.5px rgb(117,105,90) (8 instances) and the Maharaj  
  fix: [data-ahv-route="…"] #package div[style*="text-transform: uppercase"] { font-size: 15px !important; letter-spacing: 1.4px !important; } #package div:has(> div + div) > div:last-child (the 'per night' cells) { font-size: 15px !important; } #package span[style*="font-size: 10.5px"] { font-size: 13px !important; padding: 5px 10px !important; } #package span.sc-interp { font-size: 17px !important; }. 
- **KTAHV language-lock words present in rendered copy (luxury x10, journey x5, guests x4, spa x2, resort x1)**  
  _other · bothpx_ — Case-insensitive scan of main.innerText: 'Trusted by 80% of guests…' (hero strapline, Marcellus 21px), '92% patient satisfaction from international guests', 'World Luxury Award Winner' (About bullets + closing band), 'Wo  
  fix: Not a stylesheet fix. Flag to owner / Dr. Deepu John for copy sign-off before staging->production; decide policy for award proper nouns vs. free copy ('guests' -> 'patients', 'luxury villas' -> 'villas', 'journey' -> 'programme'). No content edit made in this audit.

### ahv-page-digestive-wellness-gut-health (1 routes)
- **Routine (Dinacharya) timeline squeezes 19 descriptions into a 180px column on mobile**  
  _readability-45plus · 390px_ — Section section[data-dc-tpl="313"] (h2 'Routine (Dinacharya)') lays each of the 19 items in a grid row div[data-dc-tpl="319"] with grid-template-columns 96px 180px inside a 310px timeline (time cell div[data-dc-tpl="320"  
  fix: Scoped CSS at max-width 640px on [data-ahv-route="/digestive-wellness-gut-health-yoga-therapy/"] section[data-dc-tpl="313"] div[data-dc-tpl="319"]: grid-template-columns:1fr; put the time cell and the h3 on one flex row (time as an inline label), and let the description span the full 310-350px at 17px (about 42-45 cpl). Cuts the section height by roughly half and needs no content change.
- **Package Tariff price qualifiers and accordion labels are 10.5-13.5px**  
  _readability-45plus · bothpx_ — section#package[data-dc-tpl="354"]: 'SINGLE'/'DOUBLE' labels div[data-dc-tpl="373"] are 11.5px 700 #75695A (8 instances); 'per night' div[data-dc-tpl="375"] is 13.5px (8); 'SIGNATURE' badge span[data-dc-tpl="369"] is 10.  
  fix: Scoped CSS: section#package div[data-dc-tpl="373"], span[data-dc-tpl="369"], section#package details strong[data-dc-tpl="387"] { font-size:15px; letter-spacing:1.2px } and div[data-dc-tpl="375"] { font-size:15.5px }. Cards have room (mobile card 350px with two 150px price columns; desktop card 287px).
- **Awards cards on mobile put 15.5px text in a 174px column (19-22 characters per line)**  
  _readability-45plus · 390px_ — section#recognitions[data-dc-tpl="111"] cards are flex rows div[data-dc-tpl="114"] (badge 64-72px left, text right). At 390px the text column is 174px: 33 description paragraphs at 15.5px measure 19-22 chars/line; the NA  
  fix: Scoped CSS at max-width 640px: section#recognitions div[data-dc-tpl="114"] { flex-direction:column; gap:12px } so the badge sits above and text spans the 310px card (about 40 cpl); and section#recognitions p { font-size:17px } at both widths.

### ahv-page-immunity-executive-health (1 routes)
- **Desktop accordion/FAQ text runs 108–118ch across the full 1203px column**  
  _readability-45plus · 1280px_ — At 1280px the content column is min(1220px,94%) = 1203px and paragraphs/list items carry max-width:none (122 of 128 visible <p> have max-width none). Measured with canvas '0'-width: FAQ intro <p> 1203px @18.5px = 108ch (  
  fix: Scoped stylesheet keyed on [data-ahv-route="/immunity-enhancement-executive-health-assessment-therapy/"]: `details p, details li { max-width: 68ch }`, FAQ section intro `p { max-width: 62ch }`; for Inclusions/Terms consider `details > div { columns: 2; column-gap: 48px }` at ≥1024px so the list still fills the row without 116ch lines. No payload/content change.
- **Awards cards on mobile squeeze body text to 14–19ch lines (1–3 words per line)**  
  _readability-45plus · 390px_ — Awards & Accreditations section on 390px keeps the desktop two-column card (72px logo + text). Measured: NABH card <p> width 146px @17px = 14ch; the four visible award cards <p> 174px @15.5px = 19ch; the 29 cards inside   
  fix: Scoped CSS at ≤640px inside the route: award card grid → `grid-template-columns: 1fr` (logo above text, or logo inline with the h3 only), so the paragraph gets the full ~300px card width (≈32ch, the same as every other mobile paragraph). Also drop the 420px max-height scroll box on the expanded list at ≤640px (see separate finding).

### ahv-page-knowledge-centre (1 routes)
- **Sticky header + 3-row sticky jump nav pin 25% of the phone viewport while reading the cards**  
  _navigation · 390px_ — 390x844, scrolled to scrollY=1500: header rect top 0 / bottom 64 (position: sticky), jump nav rect top 64 / bottom 210 (position: sticky; top: 64px), pinned chrome = 210px of 844px (24.9%). The nav is a 2-column grid (gr  
  fix: Scoped stylesheet keyed on [data-ahv-route="/knowledge-centre/"]: at max-width 767px turn the jump nav (nav[style*="position: sticky"] containing a[href^="#"], inside main section[data-dc-tpl="23"]'s sibling) into a single horizontally scrolling row — .jump > div { display:flex; flex-wrap:nowrap; overflow-x:auto; gap:0 20px; -webkit-overflow-scrolling:touch } a { white-space:nowrap; min-height:52p
- **Jump-nav labels are 12.5px (phone) / 13.5px (desktop) uppercase — below the 15px floor on the template's primary in-page navigation**  
  _typography · bothpx_ — Measured on the 5 links AYURVEDIC CUISINE / EXPLORE AYURVEDA / AYURVEDA PROGRAMS / YOGA / AYURVEDA PRODUCTS: mobile font-size 12.5px, font-weight 700, letter-spacing 1.4px, text-transform uppercase, min-height 48px; desk  
  fix: Scoped CSS: [data-ahv-route="/knowledge-centre/"] nav a[href^="#"] { font-size: 15px !important; letter-spacing: 1.5px; } (desktop 15-16px). Keep uppercase/700/gold-or-ink so it still reads as the site's tracked-label language; combined with the single-row fix above this stays one line on desktop (5 labels ≈ 900px at 15px within the 1203px container).

### ahv-page-our-partners (1 routes)
- **KTAHV language-lock words in body copy, alt text and partner artwork**  
  _other · bothpx_ — #franchise > p (data-dc-tpl=42, data-pos=5) renders "…open Ayurvedic treatment facilities, wellness spas, luxury hotel spas, and health resorts." at 17.5px on both widths (visible in seg-390-00.png bottom and seg-1280-01  
  fix: Not a stylesheet fix — flag for owner + Dr. Deepu John sign-off. Body sentence needs a register rewrite in the approved payload (e.g. 'treatment facilities and health centres'); the two third-party proper nouns (Global Spa, Spafinder) need an explicit owner ruling on a proper-noun exception or removal of those two tiles. Read-only audit: nothing changed.

### ahv-page-mindfulness-retreat (1 routes)
- **KTAHV locked words in title, meta description and body (compliance, not design)**  
  _other · bothpx_ — document.title = "Luxury Mindfulness Retreat in India | Transformative Yoga & Holistic Healing"; meta description contains "exclusive five-day luxury retreat"; visible body text contains "journey"/"Journey" x5 ("5-day Mi  
  fix: Not a stylesheet fix. Route to the content/compliance lane: retitle the <title>/meta (drop "Luxury"), and decide with the owner whether the retained 2014 historical text may keep "journey"/"curing" under an explicit archival exemption or must be edited. Requires Dr. Deepu John / Abilash sign-off; do not change in the design pass.

### ahv-page-maharaja-suite (1 routes)
- **KTAHV language lock violated in title and body copy (compliance flag, not a design defect)**  
  _other · bothpx_ — document.title = "Maharaja Suite at Kairali – Ultimate Luxury Ayurveda Retreat". Whole-word grep of main.innerText at both widths: luxury x2, resort x1, journey x1, guests x1, getaway x1 (e.g. p "…combining luxury and im  
  fix: No stylesheet/DOM fix — this is content in the approved payload. Route to the content lane / owner (Abilash) and Dr. Deepu John if clinical wording changes; do not rewrite in a design pass.

### ahv-page-panchakarma-therapy (1 routes)
- **Most body copy renders below the 17px floor (15.5px / 16.5px / 16px / 13px)**  
  _readability-45plus · bothpx_ — Computed <p> font-size histogram at 390 (identical at 1280 because sizes are fixed inline px): 15.5px x46 (award cards, routine footnote, tariff subtitles e.g. 'Peaceful Wellness Haven'), 16.5px x36 (Daily Activities des  
  fix: Scoped stylesheet keyed on [data-ahv-route="/panchakarma-therapy/"] — styles are all inline (data-dc-tpl payload) so use !important: `[data-ahv-route="/panchakarma-therapy/"] :is(p, li, dd, blockquote){font-size:max(17px, 1em)!important}` is not expressible with inline px, so instead target the known sizes via a small DOM pass: for every p/li whose computed font-size < 17px set style.fontSize='17p
- **Full-width paragraphs run 108-125ch at 1280 (FAQ, process intro, closing trust line)**  
  _layout-desktop · 1280px_ — Measured at 1280: #faqs <details> answer 1203px wide = 118ch at 17px (5 answers); #faqs intro 'The World Health Organization reports…' 1203px = 108ch at 18.5px; #process intro 'At Kairali – The Ayurvedic Healing Village   
  fix: Scoped CSS: `[data-ahv-route="/panchakarma-therapy/"] #faqs p, #faqs details > :not(summary), #process > p, #faqs > p {max-width:72ch!important}` and `#recognitions article:first-of-type p{max-width:70ch}`; for the centred closing block set `max-width:64ch;margin-inline:auto`. The FAQ <details> list itself can be capped at `max-width:900px`.

### ahv-page-panchkarma-treatment (1 routes)
- **Builder annotation rendered as visible page content in Dr. Ashikha Raj card**  
  _other · bothpx_ — Visible <p> in the second doctor card reads verbatim: "Live source repeats Dr Deepu's guest quote in this card. Quote withheld pending the correct one — see the page note." Styled as a gold blockquote (color rgb(143,98,1  
  fix: Scoped CSS: [data-ahv-route="/panchkarma-treatment.html"] [data-dc-tpl="413"], [data-ahv-route="/panchkarma-treatment.html"] [data-dc-tpl="418"] { display:none } until the owner supplies the correct Dr. Ashikha quote; log the missing quote to QUESTIONS.md. Do not rewrite the payload.

### ahv-page-lakshya-yoga (1 routes)
- **KTAHV banned word 'Luxury' in Included-in-the-package list**  
  _other · bothpx_ — Banned-word scan of document.body.innerText at 390 matched exactly one hit: 'Luxury villa designed according to Vastu (ancient Indian Feng Shui)' inside section#included (li, 17px Mulish). Visible in /tmp/claude-501/audi  
  fix: Not a stylesheet fix. Flag to Abilash / content owner: the approved design payload for section#included carries the word 'Luxury' in the retained legacy list item; the payload needs a single-word substitution (e.g. 'Villa designed according to Vastu') approved through Lane B before staging→production. Do not silently DOM-patch clinical/legal language.

### ahv-page-preventive-regenerative (1 routes)
- **66 body paragraphs/list items render below the 17px floor**  
  _readability-45plus · bothpx_ — Computed font-size histogram over visible <p>/<li> with >60 chars (both widths identical): 17px x45, 15.5px x34, 16.5px x31, 17.5px x7, 14px x1, 16px x1, 18.5px x1. The 15.5px set = all 33 award-card descriptions (#recog  
  fix: Scoped stylesheet keyed on the page root: [data-ahv-route="/preventive-and-regenerative-treatment/"] main p, main li, main dd { font-size: max(17px, 1em) !important; line-height: 1.6 !important; } — and for the 16.5px/15.5px spans inside cards (span at 15.5px x44, 16.5px x26, 14.5px x18) add main section span:not([class*=eyebrow]) { font-size: max(17px, 1em) !important; }. Keep Marcellus display s
- **Narrow text columns beside icons: 14-19ch measures in awards and routine timeline on mobile**  
  _readability-45plus · bothpx_ — Measured with a real '0' glyph width (Mulish 17px = 10.3px/ch, so the 350px content column = 34ch). Mobile: 29 award-card paragraphs at 150px wide = 16ch (15.5px), 4 more at 174px = 19ch, NABH card paragraph at 146px = 1  
  fix: Scoped CSS at max-width:640px: in #recognitions cards switch the logo+text grid to a single column (grid-template-columns:1fr !important; logo 56px, text full width); in the Routine timeline make the time label a block above the title (grid-template-columns: 24px 1fr; the time span display:block) so the description gets the full 300px+ column; testimonial attribution row flex-wrap with the stars o
- **Full-width 107-124ch text runs on desktop (process intro, FAQ, inclusions/addons/T&C, trust line)**  
  _layout-desktop · 1280px_ — At 1280px the content container is 1203px with no max-width on text blocks (all <section> containers report max-width:none). Real-ch measurements: Process intro <p> 1203px = 117ch (17px); FAQ intro <p> 1203px = 107ch (18  
  fix: Scoped CSS at min-width:900px: [data-ahv-route="/preventive-and-regenerative-treatment/"] #process > p, #faqs p, #package details li, #package details p, section:last-of-type > p { max-width: 68ch; } (keep left-aligned; for the centred closing block use margin-inline:auto). Optionally lay the three accordion <ul>s out as 2-column grids (grid-template-columns: repeat(2, minmax(0,1fr)); gap 12px 40p

### ahv-page-post-pregnancy-health-programme (1 routes)
- **Related-programme card uses an upscaled stock photo (Wright-Loss-1.jpg)**  
  _imagery · bothpx_ — 'Discover More Customizable Programs' card 1 image /ahv/assets/img/Wright-Loss-1.jpg: natural 428x285, rendered 365x230 on 390 @DPR2 (needs 730px source, 1.7x upscale) and 384x230 on 1280. Visual (m390-s13.png, d1280-s14  
  fix: Small DOM pass keyed on [data-ahv-route="/post-pregnancy-health-programme/"]: swap the card 1 src via english-candidate/image-aliases.json to an existing >=800px Kairali photograph (owner/creative team to pick — do not invent); serve a >=800px source for Holistic.jpg; scoped CSS `section:has(h2:contains 'Discover More') img{border-radius:4px}` (or key on the card container) so related cards share 

### ahv-page-personalized-customized-healing (1 routes)
- **Awards cards on phone squeeze copy into a 146-174px column beside the badge**  
  _readability-45plus · 390px_ — 390px: section#recognitions renders 34 cards as flex rows (72x72 badge + text). Measured text column widths: NABH card 146px (p 17px, 10 lines); Travelers' Choice / Worlds Luxury Spa / Worlds Luxury Hotel / APSWC cards 1  
  fix: Scoped sheet keyed on [data-ahv-route="/personalized-customized-healing-program/"] @media (max-width:430px): section#recognitions .card{flex-direction:column !important} (badge above text as desktop already does), or shrink badge to 56px with gap 14px; set card p to 17px/1.6. Inline styles on the dc-runtime blocks mean the override needs !important or a small DOM pass on the data-dc-tpl card nodes
- **Body copy below the 17px floor across seven sections**  
  _typography · bothpx_ — Both widths, computed font-size of running text: #recognitions card copy 15.5px (33 elements); Routine (Dinacharya) descriptions 16.5px (19); Daily Activities body 16.5px (7) + list items 16px (21); What We Offer inclusi  
  fix: Scoped sheet: [data-ahv-route="/personalized-customized-healing-program/"] section :is(p,li,em,span.sc-interp):not(h1 *,h2 *,h3 *,h4 *,a *,button *){font-size:max(17px,1em) !important; line-height:1.6}. Because sizes are inline on data-dc-tpl nodes, the !important is required (or a DOM pass rewriting font-size on those nodes).
- **Text under 15px inside the page body: tariff labels, accordion labels, video placeholder, badge**  
  _typography · bothpx_ — #package: 'SINGLE'/'DOUBLE' 11.5px #75695A (8x), 'per night' 13.5px (8x), 'SIGNATURE' pill 10.5px #EEB41E, accordion labels <strong> 13px #8F6212 (14x: 'Arrival & Accommodation', 'Nourishment', 'INR', 'Check-in & Check-o  
  fix: Scoped sheet: raise tariff labels to 13px->15px uppercase tracked (letter-spacing 1.5px), 'per night' 15px, SIGNATURE pill 12px->15px, accordion <strong> labels 13px->15px, eyebrows 13px->15px keeping colour/tracking. Selector hooks: section#package div[style*="11.5px"], section#package strong[style*="13px"], section#package span[style*="10.5px"] or a DOM pass by data-dc-tpl id.
- **KTAHV language lock: banned words present in rendered copy (owner ruling needed)**  
  _other · bothpx_ — Rendered body text contains 'luxury' x9 (award names 'Worlds Luxury Spa Awards Winner 2024', 'World Luxury Hotel Awards 2024', 'Best Luxury Yoga & Wellness Retreat'; inclusions 'Luxury, vastu-compliant villas'; tariff 'P  
  fix: Not a stylesheet fix. Escalate to Abilash: award proper nouns may need an explicit ruling; the non-award instances ('Luxury, vastu-compliant villas', 'Premium luxury experience', 'journey', 'guests') should be re-registered to patient/treatment wording in the content payload.

### ahv-page-supportive-care-cancer (1 routes)
- **Award cards on mobile squeeze 15.5px body text into 150-174px columns (19-22ch lines)**  
  _readability-45plus · bothpx_ — Mobile 390: section#recognitions (mobile data-dc-tpl=113 / desktop tpl=99) renders each award card as icon-left + text-right flex; the 33 description <p> measure 174px (4 visible cards) and 150px (29 in the collapsed lis  
  fix: Scoped CSS on [data-ahv-route="/revitalizing-and-strengthening/"] #recognitions: on the mobile variant set the card inner flex to flex-direction:column (badge above text) so text gets the full ~310px; raise card <p> to font-size:17px; line-height:1.55; on desktop drop the awards grid to 3 columns (grid-template-columns:repeat(3,1fr)) so each card text is ~330px (~39-40ch) and set the same 17px. No
- **Routine (Dinacharya) timeline on mobile leaves 19 descriptions in a 180px column (~22ch)**  
  _readability-45plus · 390px_ — Mobile 390: the Routine section (mobile data-dc-tpl=300 / desktop tpl=284) keeps a time column (96px) + gutter beside the text, so all 19 step descriptions measure 180px wide at 16.5px (~22ch) and the 19 h3 titles are 18  
  fix: Scoped CSS for the mobile variant only: make each timeline row a block (time + title on one line, description below spanning the full 310px): [data-ahv-variant="mobile"] section:has(h2:contains Routine) .row { display:grid; grid-template-columns:auto 1fr; } .row p { grid-column:1 / -1; font-size:17px }. Keep the desktop 2-col layout as is.
- **Package Tariffs price labels are 10.5-13.5px muted text on price cards**  
  _typography · bothpx_ — Both widths, section#package (mobile tpl 348 / desktop tpl 332): 'SINGLE'/'DOUBLE' labels 11.5px uppercase rgb(117,105,90) on paper (8 instances), 'per night' 13.5px rgb(117,105,90) (8-9 instances), 'SIGNATURE' badge 10.  
  fix: Scoped CSS: #package .tariff-label (SINGLE/DOUBLE) { font-size:15px } ; #package .per-night { font-size:15px } ; the SIGNATURE badge { font-size:15px; padding:4px 10px } ; #package details p (13px group labels) { font-size:15px } ; the em price note { font-size:16px }. Keep the muted colour but not below 15px.

### ahv-page-royal-villa (1 routes)
- **In-template functional labels are 12-14px, below the 15px floor**  
  _readability-45plus · bothpx_ — Measured text nodes under 15px inside the template body (excluding header/footer chrome). 390px: gallery tile labels 'VIEW' + arrow 12px Mulish 700 uppercase ls 1.5px, 60 nodes across 30 tiles (button.scp3 > span, inline  
  fix: Scoped stylesheet keyed on [data-ahv-route="/royal-villa/"] with !important (every rule is inline): #gallery button.scp3 > span { font-size: 15px !important; letter-spacing: 1.2px !important } ; #rooms dt, #rooms th { font-size: 15px !important } ; #rooms button (PHOTOS) { font-size: 15px !important } ; a.scp1, a.scp2 { font-size: 15px !important } ; the hero eyebrow div (text 'Our Villas') { font

### ahv-page-sleep-restoration (1 routes)
- **Desktop FAQ answers, tariff accordion bodies and FAQ intro run the full 1203px container (~130-142ch)**  
  _readability-45plus · 1280px_ — 1280: #faqs details p width 1203px @17px, 4-5 lines each (~142ch); FAQ intro p (dc-tpl:482) 1203px @18.5px = 130ch, visible without opening; #package details li (Inclusions/Addons/T&C, dc-tpl:367-475) 1183px @17px = ~139  
  fix: Scoped stylesheet: [data-ahv-route="/sleep-restoration-therapy/"] #faqs details > :not(summary), #faqs > p, #package details li, #package details p, #process > p, #recognitions article p { max-width: 68ch; } and hero intro p { max-width: 62ch; } — no content change.

### ahv-page-chronic-back-pain (1 routes)
- **Two stock-library photos break the real-photography rule**  
  _imagery · bothpx_ — img[src$="/ahv/assets/img/back.jpg"] in section#about (mobile y=1037, desktop y=1139): man in a teal t-shirt holding his lower back with a red pain glow in a generic white room (element screenshot img-0.png) — classic st  
  fix: Swap the two slots for owned Kairali photography (a kati vasti / spine-therapy frame for #about, a physician-consultation frame for the Spine Care card). If no owned frame exists, raise a creative-team request per the missing-asset protocol and, as an interim DOM pass keyed on [data-ahv-route="/treatment-for-chronic-back-pain/"], point #about img at the already-owned model_img.jpg/cronic.jpg and a
- **Tariff card price labels are 10.5–13.5px in the pricing block**  
  _readability-45plus · bothpx_ — section#package (mobile y=22923, desktop y=11250): div 'Single'/'Double' 11.5px uppercase rgb(117,105,90) letter-spacing 1.8px (8 instances); div 'per night' 13.5px rgb(117,105,90) (8 instances); span 'Signature' tag 10.  
  fix: Scoped stylesheet on [data-ahv-route="/treatment-for-chronic-back-pain/"] #package: occupancy labels 15px min (uppercase, letter-spacing 1.5px), 'per night' 15px, Signature tag 12px→15px with padding adjusted, 'View Villa Options' 15px. Cards are 236px wide on desktop and full-width on mobile, so the bump fits without reflow.
- **Awards grid stays two-column at 390px, giving 16–19ch lines**  
  _layout-mobile · bothpx_ — section#recognitions (mobile y=4497, h=2045): grid of award cards renders two columns on the phone; card text width 174px (first row) and 150px (second row) → measured 19ch and 16ch at 15.5px Mulish (zoom-awards.png show  
  fix: Scoped CSS: at max-width 600px set #recognitions .grid to a single column (cards full 350px → ~36ch at 17px); white-space:nowrap on the '(29 more)' count or move it to its own line; on desktop consider 3 columns (≈38ch). Keep the details/summary collapse.
- **Routine timeline and daily-activity cards make the phone page 29,114px tall**  
  _layout-mobile · 390px_ — document.documentElement.scrollHeight = 29,114px at 390x844 (≈34.5 screens; homepage control is 24,060px with 23 sections vs 17 here). Routine (Dinacharya) section (white bg, mobile y=17562) is 4,359px tall: a two-column  
  fix: Scoped CSS for max-width 600px: routine rows to a single column with the time as an inline label above the text (text width 350px → ~36ch), tighten row gap; day cards could collapse the 4-item lists behind the existing details pattern or display as an accordion of days. No content change needed.

### ahv-page-breath-respiratory (1 routes)
- **Sub-15px text throughout the page body (not only chrome)**  
  _typography · bothpx_ — Text-node histogram: 86 visible text nodes under 15px at 390, 98 at 1280. In-page (non-header/footer) instances: section eyebrows 13px (div style="font-size:13px;letter-spacing:2.6px;color:rgb(143,98,18)" — PROGRAM DETAI  
  fix: Scoped stylesheet keyed on [data-ahv-route="/treatment-for-bronchial-diseases/"]: raise eyebrow divs (uppercase, letter-spacing 2.6px) to 15px; tariff SINGLE/DOUBLE and 'per night' to 15px; Inclusions <p><strong> group labels to 15px; SIGNATURE badge to 15px; CTA anchors (.scp2/.scp3/.scp4/.scp9/.scpa and card BOOK NOW) to font-size:15px with letter-spacing kept. Because these sizes are inline sty
- **Awards & Accreditations cards: 15.5px body in a 22ch column on phone**  
  _readability-45plus · bothpx_ — #recognitions renders 34 award cards (5 visible + 29 inside a closed <details>), each with a 72px badge left and text right. 33 description <p> at 15.5px, rgb(81,74,63), text column 150–174px wide at 390 (= 19–22ch, 8–10  
  fix: Scoped CSS on #recognitions inside the route root: set card <p> to 17px/1.6 and 'Read more' to 17px; at <=480px stack the badge above the text (flex-direction:column or grid-template-columns:1fr) so the paragraph gets the full 300px+ card width (~36–40ch); at 1280 reduce the grid from 4 to 3 columns (grid-template-columns:repeat(3,1fr)) so each text column is ~330px (~39ch at 17px). Keep the 4px r
- **Full-width prose at 130–142ch on desktop (FAQ intro/answers, Inclusions, Terms)**  
  _layout-desktop · 1280px_ — At 1280 the content container is 1203px with no measure cap on prose blocks: #faqs intro <p> 18.5px spans 1203px = 130ch over 2 lines; first FAQ answer <p> 17px at 1203px = 142ch over 4 lines (measured after opening the   
  fix: Scoped CSS: in #faqs, #package details, and the Routine disclaimer set max-width:72ch on <p> and <li> (or max-width:66ch on the <ul>) — the FAQ/details blocks already have a full-width summary row, so only the content bodies need the cap. Alternatively put the Inclusions <ul>s in a 2-column grid (columns:2; column-gap:48px) at >=1024px so the 16 items read as a card list like the benchmark package
- **Routine (Dinacharya) timeline squeezes descriptions into a 22ch column on phone**  
  _layout-mobile · 390px_ — At 390 the Routine section is a single-column 2-col grid (time gutter | content) inside a 310px card: 19 description <p> measure 180px wide at 16.5px = 22ch, 5–7 lines each (m390-seg07/08.png); the time label column plus  
  fix: Scoped CSS at <=480px on the Routine section: switch each row to grid-template-columns:1fr with the time stamp and title on one line (time as an inline Marcellus label) and the description below at full 300px width (~36ch); or collapse the gutter to 56px. Raise the description <p> to 17px.

### ahv-page-neck-upper-back (views: public/ahv/views/ahv-page-neck-upper-back-desktop.json + -mobile.json; root #ahv-design-root[data-ahv-route="/treatment-for-cervical-spondylosis/"][data-ahv-view=ahv-page-neck-upper-back-desktop|mobile]; note: page carries 0 data-source-pointer attributes — blocks are addressable only by section id (#about #history #recognitions #process #benefits #testimonials #package) and data-dc-tpl index) (1 routes)
- **Award cards on phone: 15.5px text in a 150–174px column (19–22ch) for 33 cards**  
  _readability-45plus · 390px_ — 390: #recognitions renders 34 cards as badge(72px)+text two-column inside a 350px card. Measured p 15.5px Mulish w150 ch19 ×29 and w174 ch22 ×4 (data.json paras). Screenshot sec-390-04.png shows 'Kairali – The / Ayurvedi  
  fix: Scoped CSS keyed on [data-ahv-route="/treatment-for-cervical-spondylosis/"] #recognitions at max-width:480px: set each award card to flex-direction:column (badge 56px above, text full 350px width), p font-size 17px !important, line-height 1.55; keep the details/summary expander. No content change.
- **Price-card labels SINGLE/DOUBLE 11.5px, 'per night' 13.5px, SIGNATURE 10.5px in muted grey**  
  _readability-45plus · bothpx_ — #package tariff cards (both widths): div 'SINGLE'/'DOUBLE' 11.5px rgb(117,105,90) letter-spacing 1.8px ×8, 'per night' 13.5px rgb(117,105,90) ×8, span 'SIGNATURE' 10.5px rgb(238,180,30) on brown pill ×1. These label the   
  fix: Scoped CSS: #package [inline-style font-size:11.5px], .per-night → font-size:15px !important; SIGNATURE pill → 15px with padding 4px 10px; keep uppercase + tracking so the card language stays. Verify 4-col tariff grid at 1280 still fits (cards 236px wide, labels 'SINGLE'/'DOUBLE' at 15px tracked ≈ 70px each).
- **Desktop text runs 139–155ch full-width in Process intro, Package accordions and footnotes**  
  _layout-desktop · 1280px_ — 1280: p 17px w1203 ch142 (Process intro 'Neck & Upper Back Rehabilitation Treatment involves…'); #package details 'Inclusions' 16 li at 17px w1183 ch139 (probe2: lines=1 each, screenshot inc-1280.png), 'Addons'/'Terms &   
  fix: Scoped CSS at min-width:1024px: #process > p, #package details p, #package details li, #package p[style*="16.5px"], #package p[style*="15.5px"], closing-CTA trust p → max-width:72ch. For the Inclusions accordion optionally grid-template-columns:1fr 1fr with each subhead+ul as a cell (gap 32px) to keep the accordion short.
- **KTAHV clinical-lock words present in rendered copy and alt text (flag on sight, out of design scope)**  
  _other · bothpx_ — Visible text scan at 1280: 'Luxury/luxury' ×10 (li 'Luxury Stay', 'Luxury, vastu-compliant villas', trust line 'World Luxury Award Winner' ×2, award names), 'Spa' ×2 and 'Resort' ×1 (award names), 'journey' ×3 ('Inclusio  
  fix: Content owner / Dr. Deepu John sign-off; no design fix. Award proper names may need an explicit ruling.

### ahv-page-diabetes-metabolic-balance (1 routes)
- **Running body text at 15.5-16px in awards cards, notes and doctor-guidance cards (below the 17px floor)**  
  _readability-45plus · bothpx_ — Measured on both widths (identical values): 34 text blocks at 15.5px, colour rgb(81,74,63) or rgb(117,105,90), line-height 24.8px: 32 award descriptions in section#recognitions (4 visible cards 'Travelers' Choice Award 2  
  fix: Font sizes are set inline on the design payload (925 style attributes), so a scoped rule needs !important or a DOM pass. Scoped stylesheet: [data-ahv-route="/treatment-for-diabetes/"] :is(section#recognitions p, section#package > p, main section p > em, a.scp5 span span, main > section:last-of-type > p) { font-size: 17px !important; line-height: 1.6 !important; }. Alternative DOM pass: for every p
- **KTAHV language-lock words present in rendered copy (content, not a stylesheet fix)**  
  _other · bothpx_ — Banned-word scan of document.body.innerText at both widths: luxury x10 (visible: 'World Luxury Award Winner' bullet in #about and repeated in the closing trust line; 'Worlds Luxury Spa Awards Winner 2024' card title; 'Be  
  fix: No CSS/DOM fix — route to the content owner. Award proper nouns ('World Luxury Spa Awards') need an owner ruling on whether accolade names are exempt; the FAQ 'cure' question is clinical wording and needs Dr. Deepu John's sign-off before any rewrite. The four non-award uses (Royal Villa subtitle, inclusions 'Luxury' items, 'journey' x3, 'guests') are plain register drift and can be fixed in the de

### ahv-page-joint-rehabilitation-arthritis (1 routes)
- **Stock-looking 'red-glow arthritic hand' image used as the primary About photo (also low-res, empty alt)**  
  _imagery · bothpx_ — section#about first <img> src=/ahv/assets/img/Athritis2.jpg is a WebP of 523x348 natural px showing a white-background hand with digitally painted red joint glows (seen in m390-tile00 and d1280-tile00 screenshots) with a  
  fix: DOM pass keyed on [data-ahv-route="/treatment-for-arthritis-and-spondylitis/"] #about img[src*="Athritis2"]: swap src to an existing Kairali therapy asset already on the page (e.g. /ahv/assets/img/Benefits.jpg 580x386 or the hero ktahv-janu-vasti-2.jpg 1200x799) and set alt from the adjacent H2. Flag the slot to the creative team per the missing-asset protocol for a >=1200px joint-therapy photogra
- **Desktop paragraphs run 86-150ch; FAQ answers are 142ch wide**  
  _readability-45plus · 1280px_ — d1280: only 34 of 88 measured paragraphs fall in 45-75ch. Over-long: #faqs answer <p> x4 = 1203px @17px = 142ch (max-width:none); FAQ intro 1203px @18.5px = 130ch; process intro 918px = 108ch; NABH card body 796px = 94ch  
  fix: Scoped stylesheet: [data-ahv-route="/treatment-for-arthritis-and-spondylitis/"] #faqs p, #faqs details > div, #process > p, #recognitions article p, #testimonials blockquote p, section:last-of-type > p { max-width: 68ch; } — and for #faqs set the <details> block max-width: 72ch so the accordion rows do not stretch across 1203px.
- **KTAHV language lock: banned register words rendered in main content (owner/clinical action, not a stylesheet fix)**  
  _other · bothpx_ — main.innerText on both widths contains: 'luxury' x10 ('World Luxury Award Winner' in the About bullets and the closing trust line; 'Worlds Luxury Spa Awards Winner 2024'; 'Worlds Luxury Hotel Awards 2024'; 'Best Luxury Y  
  fix: Not a CSS/DOM fix — escalate to Abilash before staging->production. Award proper nouns need an owner ruling (e.g. render the badge image with alt text only, or list as 'Awards 2024' without the banned noun); body-copy instances ('healing journey', 'guests most often ask', 'Premium luxury experience', 'Luxury, vastu-compliant villas', 'World Luxury Award Winner') are plain rewrites in the approved 

### ahv-page-facial-paralysis (1 routes)
- **Awards section is a scroll-within-scroll box holding 34 cards at 15.5px**  
  _readability-45plus · bothpx_ — section#recognitions contains a div with overflow:auto, height/max-height 420px on 390 (clientHeight 428, scrollHeight 10,649px) and 560px on 1280 (clientHeight 568, scrollHeight 3,072px). It holds 34 award cards (34 h3   
  fix: Scoped CSS on [data-ahv-route="/treatment-for-facial-paralysis/"] #recognitions: set the overflow:auto wrapper to max-height:none; overflow:visible; keep only the first 4 cards visible by default and let the existing 'View all recognitions' <details/summary> reveal the rest (DOM pass: move cards 5-34 inside the details). Raise card copy to 17px (span[style*="15.5px"] -> 17px) and let cards span th
- **About 120 body-copy elements render below the 17px floor**  
  _typography · bothpx_ — Paragraph/list font-size histogram (identical at 390 and 1280): 17px=63, 16.5px=45, 16px=29, 15.5px=46, 15px=8, 13px=13. Locations (count on 390): Awards span 15.5px x33; Routine (Dinacharya) span 16.5px x19 + em 15.5px;  
  fix: Scoped stylesheet keyed on the route: within #recognitions, the Routine section, Daily Activities cards, What We Offer inclusion lists, doctor-guidance cards, program cards, tariff notes and testimonial — force p, li, span.sc-interp, em to font-size:17px !important; line-height:1.6 (inline styles require !important). Do not touch the 13px eyebrow/category labels here (see separate finding).
- **Template-owned CTA labels, eyebrows and price labels are under 15px**  
  _buttons-ctas · bothpx_ — Elements with text <15px: 83 on 390, 95 on 1280. Template-owned ones: primary gold CTAs a.scp2 (FREE DOCTOR CONSULTATION, BEGIN TREATMENT x2) 14px on 390 / 14.5px on 1280; a.scp3 outline (ENQUIRE NOW x3) 14px/14.5px; a.s  
  fix: Scoped CSS: a.scp2, a.scp3, a.scp4 { font-size:15px } (keeps uppercase/1.5px tracking); eyebrow divs/strongs with letter-spacing:2.6px -> font-size:15px; letter-spacing:2px; tariff 'SINGLE/DOUBLE' and 'per night' -> 15px; SIGNATURE badge -> 15px with padding trimmed. Small DOM pass not needed.
- **KTAHV banned words present on the page (compliance, not stylesheet-fixable)**  
  _other · bothpx_ — innerText scan at both widths: 'luxury' x10 (award names 'World Luxury Spa Awards', 'World Luxury Award Winner' credibility strip, 'Luxury, vastu-compliant villas', 'Premium luxury experience'), 'spa' x2, 'resort' x1 ('W  
  fix: Outside the design remit: route to content owner / Dr. Deepu John sign-off. Award proper names may need an owner ruling; the inclusion heading, FAQ intro, villa blurbs and 'journey' sentences are editable copy in the approved payload and should be re-worded before staging→production.

### ahv-page-hypertension (1 routes)
- **Two stock/clip-art images with baked-in text in About and History, reused from another programme page**  
  _imagery · bothpx_ — Mobile y=1123 / desktop y=1211: <img src=/ahv/assets/img/Approach-of-Facial-Paralysis-1.jpg alt=""> is a red heart + blood-pressure-gauge clip-art with the word 'HYPERTENSION' rendered inside the bitmap (mobile-v01.png,   
  fix: DOM pass on [data-ahv-route="/treatment-for-hypertension/"] section#about img and section#history img: swap src to an approved real photograph from the KTAHV asset library (e.g. a consultation / pulse-reading photo for About, an archival or treatment photo for History) and set a descriptive alt. Do not invent assets: if no approved photo exists, mark the slot as a FLAGGED placeholder and raise a c
- **CTA and sticky-bar labels are 12–14.5px, below the 15px floor**  
  _buttons-ctas · bothpx_ — Mobile: a.scp2/a.scp3/a.scp4 primary/secondary CTAs ('Free Doctor Consultation', 'Enquire Now', 'Begin Treatment', 'Book Now', 'WhatsApp Patient Care') = 14px uppercase, 56–58px tall, x8; fixed bottom bar (div position:f  
  fix: Scoped stylesheet keyed on [data-ahv-route="/treatment-for-hypertension/"] (page uses 962 inline-styled elements, so rules need !important): a.scp2, a.scp3, a.scp4, a.scp9, a.scpa, a.scpb, header a[href*=book], button[type=submit], .sc-host [style*="position: fixed"] a { font-size: 15px !important; letter-spacing: 1.2px !important; min-height: 52px !important }. Keep uppercase and colours; reduce 
- **Micro labels at 10.5–13.5px: eyebrows, tariff SINGLE/DOUBLE/per-night, SIGNATURE badge, footer legal links**  
  _readability-45plus · bothpx_ — Measured on both widths (83 visible text elements <15px mobile, 95 desktop). Section eyebrows: div/strong 13px uppercase #8F6212 x17 ('Program details', 'History', 'Inclusions', 'Testimonials', 'View Villa Options', 'Nou  
  fix: Scoped stylesheet on [data-ahv-route="/treatment-for-hypertension/"]: eyebrow labels (div/strong with text-transform:uppercase and colour #8F6212 / #EEB41E) → font-size:15px !important; letter-spacing:2.4px. section#package [style*="11.5px"], [style*="13.5px"] → 15px !important. SIGNATURE badge span → 15px, padding 4px 10px. footer a, footer span, footer div, footer label → min 15px !important and
- **Body copy at 15–16.5px in eight sections (awards, routine, daily activities, inclusions, cards, tariff notes)**  
  _readability-45plus · bothpx_ — Base body is 17px Mulish (correct), but 76 visible p/li elements sit below 17px on both widths: #recognitions award-card paragraphs 15.5px #514A3F (4 open + 29 in the drawer); 'Routine (Dinacharya)' timeline p 16.5px x19  
  fix: Scoped stylesheet on [data-ahv-route="/treatment-for-hypertension/"]: main p, main li, main blockquote, footer p { font-size: 17px !important; line-height: 1.6 !important } with an exception only for the two italic disclaimers (min 15px). Because sizes are inline (style="font-size: 15.5px"), use attribute selectors [style*="font-size: 15.5px"], [style*="font-size: 16.5px"], [style*="font-size: 16p
- **KTAHV clinical-lock banned words render on the page (luxury, spa, resort, journey, guests, cure)**  
  _other · bothpx_ — Served HTML word counts: luxury 74, spa 64, resort 8, journey 8, cure 4, guests 2. Visible instances: About bullet and closing band 'World Luxury Award Winner' (mobile-v02/v31.png, desktop-v01/v15.png); About body 'the r  
  fix: Not a stylesheet fix and not a design-payload rewrite by this audit: flag to the content owner. Award names are third-party proper nouns and need an owner ruling (keep verbatim vs. paraphrase); the body-copy instances (resort, journey, guests, cure, luxury villas) need a content edit with Dr. Deepu John's sign-off for the FAQ 'cure' wording.

### ahv-page-paralysis-recovery (1 routes)
- **Routine (Dinacharya) timeline squeezes 19 descriptions into an 18ch column on mobile**  
  _readability-45plus · 390px_ — At 390 the Routine section (main section[11], H2 'Routine (Dinacharya)', white band) renders each of its 19 entries as a 2-col grid 'grid-template-columns: 96px 180px' inside a 302px row; the description <p> measures 180  
  fix: Scoped stylesheet keyed on [data-ahv-route="/treatment-for-paralysis/"]: at max-width 640px collapse the timeline row to a single column (grid-template-columns: 1fr; place the 21px Marcellus time and the H3 on one line with gap, description full 350px width below), and lift the description to 17px. Optionally a DOM pass wraps the 19 rows in a <details> 'Full day plan' the way the page already does
- **Roughly two-thirds of body paragraphs and list items sit below the 17px floor**  
  _readability-45plus · bothpx_ — p/li font-size histogram at 390 (identical at 1280): 17px ×64, 17.5px ×14, 18.5px ×1 vs 16.5px ×45, 16px ×29, 15.5px ×46, 15px ×8, 14px ×1, 13px ×13 — 142 of 221 measured p/li are under 17px. Per section: Awards captions  
  fix: Scoped stylesheet: [data-ahv-route="/treatment-for-paralysis/"] main :is(p, li, dd, figcaption) { font-size: max(17px, 1em); } plus explicit 17px on the #recognitions caption <p>, the Daily Activities <li>, the routine <p>, the 5 icon labels and the villa subtitle <div>s — inline styles win over a plain selector, so use the route attribute + element selector with !important on font-size only.

### ahv-page-nervous-disability (1 routes)
- **NABH feature card squeezes its text into a 146px / 17ch column on phone**  
  _readability-45plus · 390px_ — At 390px the NABH card (#recognitions > div[data-dc-tpl="117"], inline style: display:flex; gap:26px; padding:28px 32px; img flex 0 0 72px) leaves the text wrapper 146px wide. The 17px paragraph 'Kairali – The Ayurvedic   
  fix: Scoped stylesheet keyed on [data-ahv-route="/treatment-for-nervous-disability/"]: at max-width 600px, `#recognitions div[data-dc-tpl="117"]{flex-direction:column!important;align-items:flex-start!important;padding:24px 20px!important;gap:16px!important}` so the badge sits above the text and the paragraph gets the full ~270px (≈32ch at 17px). No content change.
- **Award cards on phone: 174px / 22ch text column at 15.5px, 10 lines per card**  
  _readability-45plus · 390px_ — Each of the 33 award cards uses an inline `display:grid; grid-template-columns:96px 1fr; gap:24px` (19 measured instances at 302px card width; 72px badge). The description <p> (inline `font-size:15.5px; line-height:1.6;   
  fix: Scoped rule at ≤600px: `#recognitions [style*="grid-template-columns: 96px"]{grid-template-columns:1fr!important;gap:12px!important}` and `#recognitions p{font-size:17px!important;line-height:1.55!important}`; badge stays 72px above the title. Optionally shrink badge to 56px inside the collapsed list to keep the block short.
- **Routine (Dinacharya) timeline on phone: 96px time column leaves descriptions 180px / 22ch wide**  
  _readability-45plus · 390px_ — All 19 timeline rows use inline `display:grid; grid-template-columns:96px 1fr; gap:24px` (measured gtc '96px 180px' on the row containing 'Wake up and perform self-care…'). Description <p> is 16.5px, 180px wide → 22ch; t  
  fix: Scoped rule at ≤600px on the Routine section (the section whose h2 text is 'Routine (Dinacharya)', aria-label attr on the <section>): `[style*="grid-template-columns: 96px"]{grid-template-columns:64px 1fr!important;gap:14px!important}` and reduce the time label (inline 21px Marcellus gold) to 17px so it fits 64px; set description p to 17px. Gains ~50px of text width (≈30ch) and halves section heig
- **91 body-text elements render below the 17px floor (15.5px and 16.5px)**  
  _typography · bothpx_ — Mobile histogram: 46 <p> at 15.5px (award descriptions, day-plan disclaimer p[data-dc-tpl="303"] 'The above day plan is a general outline…'), 45 <p>/<li> at 16.5px (routine descriptions, 'Discover More' card blurbs p at   
  fix: Scoped stylesheet: `[data-ahv-route="/treatment-for-nervous-disability/"] main :is(p,li){font-size:max(17px,1em)!important}` is not expressible directly because inline sizes win; instead target the recurring inline patterns: `main p[style*="font-size: 15.5px"], main p[style*="font-size: 16.5px"], main li[style*="font-size: 16.5px"], main span[style*="font-size: 16px"]{font-size:17px!important}`. K

### ahv-page-psoriasis (1 routes)
- **Awards block: 33 descriptions at 15.5px in 19ch columns inside a nested 420px scroll box**  
  _readability-45plus · bothpx_ — #recognitions contains 34 award cards and 27 'Read more' links inside a div with inline `max-height: 420px; overflow-y: auto` — clientHeight 428px vs scrollHeight 10,649px at 390 (a 25-screen scroll trap inside the page)  
  fix: Scoped CSS keyed on `[data-ahv-route="/treatment-for-psoriasis/"] #recognitions div[style*="max-height"]` → `max-height:none!important; overflow:visible!important; grid-template-columns:1fr!important` at <640px (icon stacked above text, description 17px) and `repeat(2,1fr)` at desktop; plus a small DOM pass that wraps awards beyond the first 4 in a `<details><summary>Show all 34 awards</summary>` 
- **Routine (Dinacharya) timeline: 19 descriptions in an 18ch, 16.5px column; section is 4,359px tall on phone**  
  _readability-45plus · 390px_ — Routine section (h2 'Routine (Dinacharya)') uses grid `96px 180px` per item at 390 — description <p> 180px wide, 16.5px, colour rgb(81,74,63) → 18ch lines; 19 items; section height 4,359px (5+ phone screens). At 1280 it   
  fix: Scoped CSS: at <640px set the item grid to `grid-template-columns:1fr!important` (time above text), description `font-size:17px!important`; optionally a DOM pass wrapping the timeline in `<details>` (open on desktop) so the phone page shortens. At desktop widen text column to `minmax(0,1fr)` with `max-width:60ch`.
- **Process intro paragraph runs 118ch across the full 1203px container**  
  _readability-45plus · 1280px_ — `#process > p` ('Ayurvedic Treatment for Psoriasis involves a comprehensive approach…') has inline `margin: 0 0 26px; color: rgb(81,74,63)` with no max-width: rendered 1203px wide at 17px = 118ch (measured with a '0' gly  
  fix: Scoped CSS: `[data-ahv-route="/treatment-for-psoriasis/"] #process > p { max-width: 66ch !important; }` (matches the hero intro's own inline 66ch).
- **Two of three 'Discover More Customizable Programs' cards use stock-looking images, one upscaled**  
  _imagery · bothpx_ — Card images: `wdawda.jpg` (580x386, doctor in blue scrubs holding a plastic spine model — generic medical stock, not Kairali) and `FI-Preventive-2-2.png` (380x253 natural, rendered 384x230 at 1280 → upscaled; woman in a   
  fix: Asset swap, not CSS: replace the two card images with existing Kairali photography (the page already has 5 real 1200x800 therapy photos) or raise a creative-asset request; flag to owner since it is part of the design payload. CSS can only add `border-radius:4px 4px 0 0` to the card images.
- **KTAHV language-lock words rendered on the page (luxury x22, spa x16, guest/guests x9, journey x5, resort x2)**  
  _other · bothpx_ — Grep of the rendered HTML text (scripts/styles stripped): 'luxury' 22, 'spa' 16, 'journey' 5, 'guest' 6 + 'guests' 3 (5 of the 'guest' hits are in content-photo alt attributes, e.g. 'the back of a guest lying face-down')  
  fix: Out of scope for a scoped stylesheet — content/alt-text decision for the owner and Dr. Deepu John (medical page). Flagged only; no rewrite proposed here. Award proper nouns need an explicit owner ruling.

### ahv-page-sinus-migraine (1 routes)
- **Most body copy sits below the 17px floor (15–16.5px in 141 of ~220 p/li)**  
  _readability-45plus · bothpx_ — p/li font-size histogram (identical at 390 and 1280): 17px x60, 17.5px x14, 18.5px x1 vs 16.5px x44, 16px x29, 15.5px x46, 15px x9, 13px x13. Sub-17 blocks by section (desktop count): #recognitions award-card paragraphs   
  fix: Scoped stylesheet keyed on the page root: `[data-ahv-route="/treatment-for-sinusitis-and-migraine/"] :is(#recognitions, #package, #testimonials, section) :is(p, li) { font-size: max(17px, 1em) !important; line-height: 1.6 }` (the `!important` is required because 899 elements carry inline `style` attributes from the dc-runtime payload). Alternatively a small DOM pass that removes `font-size` from i
- **Routine (Dinacharya) timeline squeezes 19 descriptions into a 180px column on mobile**  
  _layout-mobile · 390px_ — At 390: each row is `display:grid; grid-template-columns: 96px 180px` (time column 96px, text column 180px); description <p> measured 180px wide at 16.5px = ~17ch per line; 19 rows; section height 4359px (5.2 phone scree  
  fix: Scoped `@media (max-width: 639px)` rule on the routine rows: `grid-template-columns: 1fr !important; row-gap: 4px` with the time cell (`06:00`, Marcellus 20px gold) placed inline before the h3 (`grid-auto-flow` or make the h3 `display:inline`), and the <p> spanning the full 350px content width (~34ch at 17px). Keep the gold timeline dot/line via the existing pseudo-element or drop it below 640px.
- **Award cards on mobile keep badge-beside-text, leaving 146–174px (14–19ch) text columns**  
  _layout-mobile · 390px_ — At 390 the #recognitions cards are `display:flex` rows: badge 72x72 + text column. NABH card <p> = 146px wide at 17px (14ch); the four visible award cards' <p> = 174px at 15.5px (~19ch); 29 more cards behind the 'View al  
  fix: Scoped `@media (max-width: 639px) [data-ahv-route="/treatment-for-sinusitis-and-migraine/"] #recognitions div:has(> img)` → `flex-direction: column !important; align-items:flex-start; gap:12px` so the badge sits above the text and the paragraph spans the ~300px card width (~30ch at 17px). Also raise card <p> to 17px (covered by finding 1).

### ahv-page-spinal-disc-nerve-restoration (1 routes)
- **141 body paragraphs/list items render below the 17px floor (both widths)**  
  _readability-45plus · bothpx_ — Measured p/li font-size histogram (identical at 390 and 1280): 17px x61, 17.5px x16, but 16.5px x43, 16px x30, 15.5px x46, 15px x8, 13px x13. By section: Awards & Accreditations card descriptions 15.5px x33 (p inside 72p  
  fix: Scoped stylesheet keyed on [data-ahv-route="/treatment-for-slip-disc/"]: inside #recognitions, the Daily Activities, Routine (Dinacharya), Offered Package, Package Tariffs and Discover More sections set `p, li { font-size: 17px; line-height: 1.6 }` and the card sub-captions (gold 15px p, 'Duration' span) to 17px; let the awards icon column shrink (grid-template-columns: 64px 1fr) so the 17px copy 
- **Sub-15px text on price labels, footer and utility nav (82 nodes mobile / 96 desktop)**  
  _typography · bothpx_ — Text nodes under 15px: mobile 82, desktop 96. Worst: Package Tariffs 'SINGLE'/'DOUBLE' labels 11.5px x8 (rgb(117,105,90)), 'per night' 13.5px x8, 'SIGNATURE' badge 10.5px gold #EEB41E on rgb(255,253,247) = 1.85:1 contras  
  fix: Scoped CSS: `[data-ahv-route="/treatment-for-slip-disc/"] { --ahv-min-text: 15px }` and set the tariff label/per-night/badge/accordion-label/footer-link/header-nav/sticky-nav/locale-chip rules to `font-size: 15px` (badge 15px with ink text on gold, or brown #5A4420 text). Eyebrows to 15px while keeping their letter-spacing. Raise DE/FR chip colour to the muted token #75695A (4.6:1).
- **KTAHV clinical-lock banned words visible on the page (content, not stylesheet-fixable)**  
  _other · bothpx_ — document.body.innerText word counts: luxury x10 ('World Luxury Award Winner', 'Worlds Luxury Spa Awards Winner 2024', 'Luxury, vastu-compliant villas', 'Premium luxury experience'), spa x2, resort x1 ('Wellness Resort of  
  fix: Not a design fix: route to content/clinical sign-off (Abilash; Dr. Deepu John for clinical copy). Award names may need a ruling on proper-noun exemption; the rest is editable copy in the approved payload.

### ahv-page-spondylitis (1 routes)
- **Package Tariffs price labels are 10.5–13.5px muted text at the conversion point**  
  _readability-45plus · bothpx_ — Measured in section#package at both widths: 'SINGLE'/'DOUBLE' labels 11.5px (8 instances), 'per night' 13.5px (8 instances), both rgb(117,105,90) #75695A on white; 'SIGNATURE' badge 10.5px rgb(238,180,30). Prices themsel  
  fix: Scoped stylesheet keyed on [data-ahv-route="/treatment-for-spondylitis/"] #package: div[style*="font-size: 11.5px"]{font-size:15px!important;letter-spacing:1.5px!important} div[style*="font-size: 13.5px"]{font-size:15px!important} span[style*="font-size: 10.5px"]{font-size:15px!important;padding:4px 10px!important} p[style*="font-size: 15.5px"]{font-size:17px!important}. Inline styles require !imp
- **Mobile sticky action bar labels are 12.5px and fixed chrome eats 20% of the viewport, with the chat bubble occluding body text**  
  _readability-45plus · 390px_ — At 390x844 two fixed layers sit at the bottom: DIV[data-dc-tpl=522] 390x52 bg rgb(42,32,20) z-index 70 with CALL / ENQUIRE / FREE CONSULT links at 12.5px (98x52, 108x52, 128x52) plus a 56x52 WhatsApp button; above it DIV  
  fix: Scoped CSS: [data-ahv-route="/treatment-for-spondylitis/"] div[data-dc-tpl] a[href^="tel:"], a[href="/enquiry-form/"], a[href="/online-consultation/"] inside the fixed bar → font-size:15px!important (bar may grow to 56px). On max-width:600px hide the floating chat bubble layer (the bar already carries WhatsApp) or shift it to bottom:64px left-aligned so it never sits over the text column; add html
- **Desktop paragraphs run the full 1203px container at 130–155 characters per line**  
  _readability-45plus · 1280px_ — Measured at 1280 (width/(fontSize*0.5)): Process intro 'Spine Care Therapy in Ayurveda involves…' 1203px @17px = 142ch; Package Tariffs note 1203px @15.5px = 155ch; FAQs intro 'Here are the questions…' 1203px @18.5px = 1  
  fix: Scoped CSS at min-width:900px: [data-ahv-route="/treatment-for-spondylitis/"] section#process > p, section#faqs > p, section#package p[style*="15.5px"], section#recognitions p, section#testimonials p, the closing-CTA trust line, and the H1 intro blockquote → max-width:68ch. Keep the section container at 1203px; only the running text narrows.
- **Routine (Dinacharya) timeline squeezes 19 descriptions into a 180px column (22ch) and runs 4,359px tall on mobile**  
  _layout-mobile · 390px_ — At 390: each timeline row is display:grid with grid-template-columns '96px 180px' (row 302px wide); time span 21px Marcellus in the 96px column; h3 180x68; descriptions 16.5px Mulish at 180px wide = 22ch, 19 items; secti  
  fix: Scoped CSS at max-width:600px on the Routine section (h2 'Routine (Dinacharya)', data-dc-tpl=302 at 390): make each row grid-template-columns:1fr!important; place the time span inline before the h3 (display:inline-block;margin-right:8px) or as a small line above it; description p font-size:17px!important; reduce row gap. This gives the description the full ~330px (≈39ch) and cuts the section by ro
- **Awards cards on mobile set 15.5px text in a 174px column (22ch) beside the badge**  
  _readability-45plus · bothpx_ — At 390 inside section#recognitions each award card is display:flex row: badge column then a 174px text column containing h3 174x49, p 174x124 at 15.5px (=22ch), 'Read more' link 174x44. Five cards visible (NABH + 4) befo  
  fix: Scoped CSS: [data-ahv-route="/treatment-for-spondylitis/"] #recognitions p{font-size:17px!important;line-height:1.6!important}. At max-width:600px set the card to flex-direction:column (badge above text) so the text column becomes ~300px (≈35ch). At desktop consider a 3-column grid for the award cards (grid-template-columns:repeat(3,1fr)!important) to reach ~40ch.
- **KTAHV language lock: banned words present in rendered copy (not a CSS fix — escalate)**  
  _other · bothpx_ — Rendered innerText at both widths contains: 'luxury' ×10, 'spa' ×2, 'resort' ×1, 'journey' ×4, 'guests' ×1. Plain-copy instances (not proper nouns): Royal Villa tagline 'Premium luxury experience' (#package), inclusions   
  fix: Not a stylesheet fix and outside the design lane: flag to Abilash for a content ruling. Plain-copy instances should be re-registered in the approved payload (patient/programme/treatment register); award proper names need an explicit owner ruling on whether they may appear verbatim on a KTAHV page.

### ahv-page-skin-vitality (1 routes)
- **129 body-text nodes render below the 17px floor (15-16.5px)**  
  _readability-45plus · bothpx_ — Computed font-size histogram of visible p/li/dd/td at 390px: 17px x60, 16.5px x46, 15.5px x46, 16px x29, 15px x8, 13px x13 (1280px identical). Sub-17 groups by section: Awards & Accreditations descriptions 15.5px x33 (da  
  fix: Scoped sheet keyed on [data-ahv-route="/treatment-for-skin-diseases/"]: main p, main li, main dd, main td, main .sc-interp { font-size: max(17px, 1em) !important; line-height: 1.6 !important } with an exclusion for uppercase letter-spaced label nodes (handled by the micro-label finding). !important is required because every rule is an inline style attribute on data-dc-tpl nodes; the live DOM carri
- **CTA labels are 12-14.5px, under the 15px no-text-below floor**  
  _buttons-ctas · bothpx_ — Measured at 390px: FREE DOCTOR CONSULTATION / ENQUIRE NOW / BEGIN TREATMENT / BOOK MY TREATMENT / WHATSAPP PATIENT CARE labels 14px (56-58px tall); program-card BOOK NOW 13px (48px tall, x3); header BOOK NOW 12px (44x99)  
  fix: Scoped sheet: [data-ahv-route="/treatment-for-skin-diseases/"] a[style*="text-transform: uppercase"], button[style*="text-transform: uppercase"], [data-dc-tpl="532"] a { font-size: 15px !important; letter-spacing: 1.2px !important } and normalise min-height: 52px !important on the primary/secondary CTA anchors (currently 44/46/48/54/56/57/58/59/62px). Leave the shared header/footer chrome to the s
- **Price-card and accordion micro-labels at 10.5-13.5px**  
  _readability-45plus · bothpx_ — Package Tariffs cards: SINGLE / DOUBLE labels 11.5px (<div data-dc-tpl="357" style="font-weight:700; font-size:11.5px; letter-spacing:1.8px; color:#75695A; text-transform:uppercase">, x8), 'per night' 13.5px x8 (#75695A   
  fix: Scoped sheet: [data-ahv-route="/treatment-for-skin-diseases/"] #package div[style*="font-size: 11.5px"], #package div[style*="font-size: 13.5px"], #package strong[style*="font-size: 13px"], main span[style*="font-size: 10.5px"] { font-size: 15px !important; letter-spacing: 1.2px !important }; keep uppercase/colour as is.
- **Awards cards collapse to a 146-174px text column (~19-22ch) on the phone and the expander label breaks**  
  _layout-mobile · 390px_ — At 390px each award card is display:flex row (img 72px + gap 26/18px + text) inside a 310px container: NABH text column 146px, award descriptions 174px at 15.5px = ~19-22ch per line; pLines shows 29 paragraphs at 150px/1  
  fix: Scoped sheet for <=480px: [data-ahv-route="/treatment-for-skin-diseases/"] #recognitions div[style*="display: flex"] { flex-direction: column !important; align-items: flex-start !important; gap: 12px !important } so text gets the full 266px (~31ch at 17px); #recognitions summary { white-space: nowrap; display: flex !important; justify-content: space-between } and shorten padding-right; optionally 
- **Dinacharya timeline keeps a 96px time column on the phone, leaving ~20ch for 19 entries (section 4,359px tall)**  
  _layout-mobile · 390px_ — Routine (Dinacharya) rows are grid-template-columns: 96px 1fr; gap 24px (data-dc-tpl 303) inside a 302px column, so descriptions render at 167-180px wide, 16.5px = ~20-22ch (pLines: 19 items at 22ch). Section spans 17571  
  fix: Scoped sheet for <=480px: [data-ahv-route="/treatment-for-skin-diseases/"] [data-dc-tpl="303"] { grid-template-columns: 1fr !important; gap: 4px 0 !important } so the Marcellus time becomes a label above the title (text column ~290px = ~34ch); or reduce to 64px 1fr with gap 12px as a lighter change.

### ahv-page-treatment-programs (1 routes)
- **Inline 'Read More' link is 85x21px and duplicates the READ MORE button on every card**  
  _tap-targets · bothpx_ — 22 instances at 390 (20 at 1280) of <a> 'Read More' measuring 85x21px inside the excerpt <p> of each <article data-dc-tpl="97">; same href as the 50px READ MORE button 40px below it (card 1: both -> /panchakarma-therapy/  
  fix: Scoped CSS: [data-ahv-route="/treatment-programs/"] article p > a { display:none } (the 50px READ MORE button already carries the action). If the inline link must stay, give it display:inline-block; min-height:44px; padding:10px 0 instead.
- **Running text at 14-14.5px in cards and fee footnotes**  
  _readability-45plus · bothpx_ — Measured leaf text under 15px (excluding uppercase labels): 29x '14 nights' chips 14px rgb(90,68,32); 20x legacy-name sub-line 14px rgb(117,105,90) e.g. 'Kairali's Treatment For Diabetes'; 4x tagline span 14.5px rgb(90,6  
  fix: Scoped CSS on the route root: card meta/tagline/legacy-name spans and the two footnote <p> -> font-size:16px; '14 nights' chip -> 15px; excerpt <p> 16.5px -> 17px. Selectors are stable by position: article span[style*="14px"], article span[style*="14.5px"], section > p[style*="14.5px"] (inline-styled payload; a [style*=] attribute hook or a small DOM pass adding a class is needed because no data-s
- **Fixed 'Chat with Priya' bubble plus template-only bottom CTA bar occlude card CTAs**  
  _layout-mobile · bothpx_ — At 390 the template has two fixed layers the homepage does not: a 54px Priya div at y720 and a 52px bottom bar (WhatsApp | CALL | ENQUIRE | FREE CONSULT, labels 12.5px) at y792; homepage at 390 has only one 58px 'CHAT WI  
  fix: Scoped CSS: give the route root padding-bottom >= 120px so the last card/footer clears the fixed stack; move the Priya bubble up (bottom:110px) or hide it on this route while the bottom bar exists ([data-ahv-route="/treatment-programs/"] [fixed Priya wrapper] {bottom:calc(52px + 16px)}); bump bottom-bar labels 12.5px -> 15px. Alternatively drop the bottom bar so the page uses the same single Priya

### ahv-page-wellness-programs (1 routes)
- **Fee and consultation disclaimer paragraphs are 14.5px muted text, 106ch wide on desktop**  
  _readability-45plus · bothpx_ — Two <p> elements directly below the card grid ('Programme fees are "from" totals at minimum stay…' and 'Every programme begins with an Ayurvedic doctor's consultation…'): computed font-size 14.5px, color rgb(117,105,90)   
  fix: Scoped stylesheet keyed on [data-ahv-route="/wellness-programs/"]: target the two muted <p> siblings after the card grid (e.g. via a small DOM pass adding class .ahv-wp-disclaimer to <p> elements whose computed color is rgb(117,105,90) inside the 'Choose Your Programme' section) and set font-size:17px; line-height:1.6; max-width:68ch; color: var(--ink) or keep muted only if >=4.5:1. No content cha

### ahv-page-yoga-stress-reset (1 routes)
- **Three-quarters of body paragraphs and list items render below the 17px floor**  
  _readability-45plus · bothpx_ — Mobile 390: visible <p>/<li> font-size histogram = 15px:8, 15.5px:17, 16px:28, 16.5px:44, 17px:17, 17.5px:15, 18.5px:1 -> 97 of 130 (75%) are under 17px. Identical sizes at 1280. By section (data-dc-tpl of the section co  
  fix: Scoped stylesheet keyed on [data-ahv-route="/yoga-based-stress-energy-reset-program/"]: `main p, main li { font-size: max(17px, 1em) !important; line-height: 1.6 }` (the design payload sets sizes inline, so !important is required). Exclude the eyebrow divs and button labels by scoping to p/li only; then re-measure the Daily Activities and Routine sections, which will grow ~6% taller.
- **Awards list is a nested scroll box: 10,649px of cards inside a 420px window**  
  _layout-mobile · bothpx_ — #recognitions > details (summary tpl 133 mobile / 118 desktop) wraps a div (tpl 134 / 119) with inline `max-height: 420px; overflow-y: auto` (560px on desktop). After opening: mobile box clientHeight 430, scrollHeight 10  
  fix: Scoped CSS: `#recognitions details > div[style*="max-height"] { max-height: none !important; overflow: visible !important }` so the disclosure expands in the page flow (keep it collapsed by default). Optionally a small DOM pass that shows the first 8 cards and appends a second 'Show remaining N' summary, so an opened list is never longer than ~3 screens on mobile.

### ahv-page-stress-strain (1 routes)
- **65% of body copy sits below the 17px floor at both widths**  
  _readability-45plus · bothpx_ — Measured on main p/li/dd: 137 of 209 elements < 17px (identical at 390 and 1280 — body copy does not scale on desktop). Paragraph histogram: 15.5px Mulish x46 (awards descriptions, tariff sub-copy, 'The above rates…', mu  
  fix: Scoped stylesheet keyed on [data-ahv-route="/treatment-to-remove-stress-and-strain/"]: raise every p, li, dd, blockquote inside main to min 17px (e.g. `#ahv-design-root[data-ahv-route=...] main :is(p,li,dd){font-size:max(17px,1em)!important;line-height:1.6}`), and set desktop body copy to 17.5–18px under @media (min-width:1024px). Keep colour and family; no content change.
- **Package tariff price labels and inclusion labels rendered at 10.5–13.5px**  
  _readability-45plus · bothpx_ — Package Tariffs cards: 'SINGLE'/'DOUBLE' labels 11.5px rgb(117,105,90) ls 1.8px (8 instances), 'per night' 13.5px (8 instances), 'SIGNATURE' badge 10.5px rgb(238,180,30), and the 13 inclusion/T&C category labels ('Arriva  
  fix: Scoped CSS: within the tariff section (section with h2 'Package Tariffs', id #package) set the SINGLE/DOUBLE labels and 'per night' to 15px min (`[data-ahv-route=...] #package div[style*="11.5px"], [style*="13.5px"]{font-size:15px!important}` or target by data-dc-tpl ids), SIGNATURE badge to 15px, and the 13px category <strong> labels to 15px with the same gold/tracking. No layout change needed — 
- **Dinacharya routine on mobile squeezes descriptions into a ~150px column (~18ch) for 29 rows**  
  _layout-mobile · 390px_ — Section 'Routine (Dinacharya)' at 390: two-column grid (time | text) inside a 310px inner width; 29 description <p> elements measure 150px wide at 16.5–17px (≈18ch per line, e.g. 'Wake up and perform / self-care practice  
  fix: Scoped CSS for the routine timeline at max-width 767px: collapse each row to a single column (`grid-template-columns: 1fr`), render the time as an inline gold label above the title (`display:block; font-size:17px`), and let the description use the full 310–350px (≈40ch). Halves the section height without touching copy.

## Not audited

`ahv-page-neck-upper-back`, `ahv-page-weight-loss-programme`, `ahv-page-womens-hormonal-balance`, `ahv-page-yoga-meditation-program`, `ahv-page-yoga-meditation-programs`, `ahv-page-yoga-meditation-training`, `ahv-page-yoga-retreats` — one route each, 7 routes total. They share the programme-detail family whose siblings were audited, so the sitewide rules above apply to them too; a dedicated pass is optional.
