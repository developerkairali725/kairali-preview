# AHV template design audit — partial run, 2026-09-16

Workflow `wf_66ad40c6-509`; benchmark = owner-built homepage + package pages; local build at commit 92654a15.
**Partial:** 28 of 66 templates were audited before the session allowance ran out; the 3-vote verification and the synthesis stages did not run. Resume from cache is queued after the navigation work ships.

| Template | routes audited | verdict | HIGH | MEDIUM | LOW |
|---|---|---|---|---|---|
| ahv-page-enquiry | 3 | major-drift | 4 | 9 | 5 |
| ahv-page-policy-reader | 3 | minor-drift | 0 | 5 | 5 |
| ahv-page-article-reader | 3 | major-drift | 4 | 5 | 3 |
| ahv-page-campaign-nine | 3 | major-drift | 7 | 5 | 2 |
| ahv-page-confirmation | 4 | minor-drift | 2 | 4 | 4 |
| ahv-page-ayurveda-gallery | 3 | major-drift | 3 | 6 | 5 |
| ahv-page-ananda-lahari-retreat | 1 | minor-drift | 0 | 6 | 3 |
| ahv-page-accreditations | 1 | minor-drift | 2 | 6 | 6 |
| ahv-page-all-programs | 1 | major-drift | 4 | 3 | 5 |
| ahv-page-attractions | 3 | minor-drift | 0 | 6 | 5 |
| ahv-page-about-us | 1 | minor-drift | 2 | 4 | 5 |
| ahv-page-past-retreats | 1 | minor-drift | 1 | 4 | 3 |
| ahv-page-campaign-retreat | 3 | major-drift | 5 | 9 | 2 |
| ahv-page-ayurveda-training-programs | 1 | minor-drift | 2 | 4 | 5 |
| ahv-page-ashtanga-retreat | 1 | major-drift | 4 | 2 | 4 |
| ahv-page-awards-and-accolades | 1 | minor-drift | 0 | 3 | 4 |
| ahv-page-yala-2018-retreat | 1 | minor-drift | 1 | 3 | 5 |
| ahv-page-back-to-roots | 1 | minor-drift | 0 | 2 | 4 |
| ahv-page-ayuryoga | 1 | minor-drift | 0 | 4 | 4 |
| ahv-page-ayurvedic-treatments | 1 | minor-drift | 2 | 8 | 4 |
| ahv-page-classic-villa | 1 | minor-drift | 1 | 4 | 4 |
| ahv-page-deluxe-villa | 1 | minor-drift | 1 | 5 | 4 |
| ahv-page-de-addiction-rehabilitation | 1 | minor-drift | 4 | 7 | 2 |
| ahv-page-vision-eye-rejuvenation | 1 | minor-drift | 1 | 8 | 4 |
| ahv-page-holistic-rejuvenation-detoxification | 1 | minor-drift | 3 | 6 | 6 |
| ahv-page-digestive-wellness-gut-health | 1 | minor-drift | 3 | 5 | 6 |
| ahv-page-immunity-executive-health | 1 | minor-drift | 2 | 6 | 4 |
| ahv-page-knowledge-centre | 1 | minor-drift | 2 | 4 | 3 |

## HIGH findings

- **ahv-page-enquiry** — enquiry-form: entire lower payload (/sections/5) renders as unstyled prose — labels concatenated, CTAs and badges are plain text  
  fix: Scoped stylesheet keyed on [data-ahv-route="/enquiry-form/"] [data-source-pointer^="/sections/5"]: (1) wrap each channel block (…/c/3/c/3/c/N) as a card — white bg, 1px #E0D7C4, 4px radius, 24px padding — and lay them out as a 3-col grid ≥1024px, 1-col below; (2) small DOM pass that converts the 'How'/'Expect' label te
- **ahv-page-enquiry** — enquiry-form: AI-cartoon 'Help??' avatar used as the Patient Care Coordinator photo, upscaled 2.15x and blurry  
  fix: Scoped CSS: [data-ahv-route="/enquiry-form/"] img[src*="enquiry-form-chat-icon"] { display:none } and render the same 72px paper-toned initial-circle used on the contact-us Priya card in its place until a real portrait is supplied (flag the missing asset via the creative-asset request SOP; do not invent one). If a real
- **ahv-page-enquiry** — enquiry-form desktop is the mobile column stretched — single 720/819px column, right 400px of the 1203px content width is empty  
  fix: Scoped CSS at ≥1024px keyed on [data-ahv-route="/enquiry-form/"]: place form#le-form and the 'Start a conversation' block (/sections/5/c/1) in a 2-col grid (minmax(0,1.4fr) minmax(0,1fr), gap 48px) like contact-us #message; lay out the six channel blocks (/sections/5/c/3/c/3/c/N) as a 3-col card grid; testimonials (/se
- **ahv-page-enquiry** — apply-now hero is a generic stock 'RESUME' clipboard photo with empty alt  
  fix: Scoped CSS keyed on [data-ahv-route="/apply-now/"]: swap the hero <img> src to an existing real-property photograph already in the asset manifest (e.g. the garden banner AHV-Enquiry-Garden-Banner.png used by contact-us, 1200x382) via a small DOM pass, and set a descriptive alt. If a careers-specific photo (physicians/t
- **ahv-page-article-reader** — Legacy sidebar menu renders as body content above the article on 2 of 3 routes  
  fix: Template-scoped stylesheet + a small DOM pass in boot.ts: detect the leading nav/sitemap block (NAV[data-source-pointer] or the first section whose children are only H2/H3 + UL-of-links, e.g. /sections/3/c/1 on training7, /sections/5/c/1 on reader25b) and tag it .ahv-sidenav; then apply the awards route's accordion tre
- **ahv-page-article-reader** — Currency tab labels render as 11.7px H6 bullets (below the 15px floor) and leave three identical tariff tables unlabeled  
  fix: Scoped CSS: `[data-ahv-route] main h6[data-source-pointer]` → hide the orphan list (display:none) OR restyle as 12px-uppercase-gold eyebrows is not enough for readers; better DOM pass in boot.ts: for each tariff table (/sections/3/c/3/c/38/c/3/c/0/c/0/c/1/c/{1,3,5}/…/table) prepend a `<caption>` or an H3-styled label t
- **ahv-page-article-reader** — Page CTAs 'Book Now' / 'Enquire Now' are 22px-tall inline text links, not the site button system  
  fix: Scoped CSS keyed on the two pointers (and generically `main p[data-source-pointer] > a[href*='bookings.'], a[href='/enquiry-form/']` when the anchor is the paragraph's only child): display:inline-flex; min-height:52px; padding:0 28px; background:#EEB41E; color:#2A2118; border-radius:4px; font:700 13px/1 Mulish; text-tr
- **ahv-page-article-reader** — Inline link lists give 22px-tall targets — 24 under-size targets on the training route (mobile), 8 on alcohol-free  
  fix: Scoped CSS: `[data-ahv-route] main li[data-source-pointer] > a:only-child { display:inline-flex; align-items:center; min-height:44px; padding:0 4px; margin:-4px 0; }` and `main td a { display:inline-flex; min-height:44px; align-items:center; }`; keep the 17.5px size. This adds no visible height beyond ~6px per row and 
- **ahv-page-campaign-nine** — No site chrome: no header, nav or footer on any route  
  fix: DOM pass keyed on [data-ahv-view^="ahv-page-campaign-nine"]: mount the shared site header/footer chrome around the page wrapper div[data-dc-tpl="3"] (the same shared chrome other English views carry). Until then, a scoped sheet can at least restyle ul[data-source-pointer="/sections/c/6/c/1/c/1/c/3/c/1/c/1"] as a horizo
- **ahv-page-campaign-nine** — Every CTA is an inline underlined text link; zero benchmark buttons exist  
  fix: Scoped sheet: [data-ahv-view^="ahv-page-campaign-nine"] p[data-source-line] > a[href^="/#Enquirenow"], ... a[href^="/#DesktopView"] { display:inline-flex !important; align-items:center; min-height:52px; padding:0 28px; background:#EEB41E !important; color:#2A2118 !important; text-decoration:none !important; text-transf
- **ahv-page-campaign-nine** — All enquiry CTAs link to the homepage hash, not the on-page form  
  fix: Small DOM pass on this template only: rewrite a[href="/#Enquirenow"] and a[href="/#DesktopView"] to point at the on-page form (assign the form a stable id such as the source's own 'Enquirenow' anchor, then href="#Enquirenow"), or, if the owner prefers the site-wide flow, to /enquiry-form/. Also give the form a sticky/s
- **ahv-page-campaign-nine** — 21-25 interactive targets per page are under 44px tall  
  fix: Scoped sheet: [data-ahv-view^="ahv-page-campaign-nine"] p a, li a { display:inline-block !important; min-height:44px; padding:10px 0; } Currency links (INR/USD/EURO) as 44px pill buttons with 12px gaps; form input[type=radio], input[type=checkbox] { width:28px; height:28px } with the associated label made the 44px hit 
- **ahv-page-campaign-nine** — Hero slider renders as a bulleted text list 'Image 01 … Image 06'  
  fix: Scoped sheet keyed on the route: [data-ahv-route="/kairali-cleansing-centre.html"] ul[data-source-pointer="/sections/c/9/c/1/c/1"] { display:none !important } (or a DOM pass that drops <li> whose text matches /^Image \d\d$/), then promote the banner img to a full-bleed hero (width:100%; max-width:none; border-radius:0 
- **ahv-page-campaign-nine** — Desktop is the phone column widened to 1024px: no grid, no cards, one column for 15-29k px  
  fix: DOM pass on this template (same pattern as public/design/directions.css does for /how-to-reach/ via .ahv-band/.ahv-grid/.ahv-card): wrap the award group (children of /sections/c/31/c/1/c/3/c/1/c/1), the feature-icon rows (/sections/c/21/c/1/c/7, /c/9, /c/11), the villa blocks and the testimonial blocks in .ahv-grid; sc
- **ahv-page-campaign-nine** — Villa tariffs: currency labels and prices are disconnected (table semantics lost)  
  fix: DOM pass (no content change): for each villa block, pair the 3-item currency <ul> with the 3 following price <p> into a 3-column definition grid (.ahv-tariff { display:grid; grid-template-columns:repeat(3,1fr) } with the currency as a gold uppercase 15px label above its own price), or render them as one 2-row <table>. 
- **ahv-page-confirmation** — KTAHV banned words in this template family's copy (journey, luxury)  
  fix: Not a stylesheet fix. Flag to Abilash / content owner: the captured legacy copy for /book-now/, /emailsubscriber/ and /contact-us/thank-you/ needs a compliant rewrite in the dataset (Lane B, EN + DE/FR or flagged EN-only). Do not ship the family while these strings render.
- **ahv-page-confirmation** — Live /thanks/ tells the reader it cannot confirm their enquiry while the tab says Thank you  
  fix: No CSS fix; owner decision (HARD GATE 6 governs). Either (a) wire the enquiry/consultation forms to redirect with a governed receipt signal the renderer is allowed to trust so the next-steps state shows, or (b) align the direct-visit fallback title/heading so title and H1 say the same thing. Flag in QUESTIONS.md; do no
- **ahv-page-ayurveda-gallery** — Generated debug label rendered as the visible section heading on the 8 dataset routes  
  fix: Small DOM pass in the render step (or boot.ts hydration) for routes with a dataset: set h2[data-group-role="grid"] text to R.h1's section title only (e.g. the collection name) and move the count into a separate eyebrow-style span above it (Mulish >=15px, uppercase, letter-spacing 2px, color #C1882C, e.g. "69 photograph
- **ahv-page-ayurveda-gallery** — Desktop photo-gallery grid shows large white voids under landscape photos  
  fix: Scoped stylesheet keyed on the dataset gallery routes: `[data-ahv-route="/photo-gallery/"] main ul > li { align-self: start; }` (removes the stretch), or for a uniform card language `[data-ahv-route^="/"][data-ahv-template*="gallery"] main ul > li img { aspect-ratio: 4 / 3; height: auto; width: 100%; object-fit: cover;
- **ahv-page-ayurveda-gallery** — VIEW IMAGE card labels are 13px / 13.5px, below the 15px floor  
  fix: Scoped CSS: `[data-ahv-route="/ayurveda-gallery/"] main button.scp1 span { font-size: 15px !important; letter-spacing: 2px; }` (label wrap already has room: 56px tall label strip). Keep colour/tracking as designed.
- **ahv-page-accreditations** — Certificate-card action label is 11.5px on mobile / 12.5px on desktop  
  fix: Scoped CSS: [data-ahv-route="/accreditations/"] #certificates button[data-doc-index] > span > span:last-child { font-size: 15px; letter-spacing: 1.5px; min-height: 24px; } — keep colour #006038 (7.69:1 on white). Optionally restyle it as a 44px brown-outline secondary button (border 1px solid #5A4420, radius 4px, paddi
- **ahv-page-accreditations** — KTAHV banned-word family in body copy: 'luxurious'  
  fix: Not a stylesheet fix and not for the agent to rewrite: flag to the content lane (Lane B) for an owner-approved wording change to the approved payload; requires Dr. Deepu John / Abilash sign-off as clinical-register copy. Until then the page should not go live.
- **ahv-page-all-programs** — Programme directory has zero photography; 33 text-only cards  
  fix: Add a media slot to each #browse li card (e.g. a 16:9 <img> with border-radius 4px above the badge) populated by a small DOM pass from each programme's own existing hero/OG image (the same asset the linked programme page already uses) — never a stock or invented image; if a programme has no owned photo, leave the slot 
- **ahv-page-all-programs** — Card badges 11px and card action labels 13px — 102 text runs under the 15px floor  
  fix: Scoped stylesheet on [data-ahv-route="/all-programs/"]: #browse li span[style*="font-size: 11px"] { font-size:15px !important; letter-spacing:1.2px } ; #browse li a, #browse li button { font-size:15px !important; letter-spacing:1.2px } ; #browse label { font-size:15px !important }. Keep uppercase + tracking so the eyeb
- **ahv-page-all-programs** — Mobile filter chips overflow off-screen with no scroll affordance (3 of 5 hidden)  
  fix: Scoped CSS: [data-ahv-route="/all-programs/"] #browse .chips { flex-wrap:wrap; overflow:visible } (or show a right-edge fade + visible scrollbar: scrollbar-width:thin; mask-image:linear-gradient(90deg,#000 85%,transparent)). Wrapping adds ~50px to the sticky bar, so pair with the sticky-bar fix below.
- **ahv-page-all-programs** — Sticky search/filter bar plus header and bottom bar cover 33% of the phone viewport while reading  
  fix: Scoped CSS: @media (max-width:767px) { [data-ahv-route="/all-programs/"] #browse > div[style*="sticky"] { position:static } } (let the search bar scroll away) — or keep only the chip row sticky (collapse label + input when stuck via a small IntersectionObserver DOM pass adding a .is-stuck class that sets the label/inpu
- **ahv-page-about-us** — Desktop header renders as a non-sticky two-row header, unlike the homepage's single-row fixed header  
  fix: Scoped stylesheet keyed on [data-ahv-route="/about-us/"] header: make the header position: sticky; top: 0; z-index above content; lay the inner wrapper out as a single flex row (logo | nav | search + language + BOOK YOUR STAY) with `flex-wrap: nowrap; align-items: center; height: 73px` and push the right-hand control g
- **ahv-page-about-us** — KTAHV language-lock words present in body copy (compliance flag, not a design fix)  
  fix: No stylesheet fix — escalate to Abilash / content lane (Lane B) for a copy decision; 'World Spa Awards' is a proper noun and needs an owner ruling. Do not ship /about-us/ to production with these strings; clinical-register rewrite needs sign-off per gate 7 if medical claims change.
- **ahv-page-past-retreats** — Sticky header + sticky in-page nav pin 210px (25%) of the phone viewport  
  fix: Scoped CSS on the template root: `@media (max-width:767px){[data-ahv-route="/archive-yoga-retreat/"] nav[aria-label="On this page"]{position:static}}` (nav becomes a one-time jump list under the hero) OR keep it sticky but collapse to one 48px row: `nav[aria-label="On this page"] > div{display:flex;flex-wrap:nowrap;ove
- **ahv-page-campaign-retreat** — Stacked legacy page headers under the site header eat half the phone viewport (family, maharaja)  
  fix: Scoped CSS: [data-ahv-route="/family-ayurvedic-retreat-kerala.html"] main > div > div:nth-of-type(1), [data-ahv-route="/family-ayurvedic-retreat-kerala.html"] main > div > div:nth-of-type(2), [data-ahv-route="/kairali-air-india-maharaja-club.html"] main > div > div:nth-of-type(1) { display:none !important } on <768px (
- **ahv-page-campaign-retreat** — Enquiry form precedes the H1 (form-first hero) on family/maharaja mobile and dominates the desktop hero on all three routes  
  fix: Scoped CSS reorder without touching content: #v1-hero > div > div, #v3-hero > div > div, #retreat-hero > div:not(form) { order:1 } and #v1-enquiry, #v3-form, #Enquirenow { order:2 } (mobile column). Desktop: #retreat-hero, #v1-hero > div, #v3-hero > div { grid-template-columns: minmax(0,1fr) minmax(0,440px) } with the 
- **ahv-page-campaign-retreat** — 62 text elements under the 15px floor on the retreat route: 12–13px eyebrows, 13.5–14px CTA labels, 14px notes  
  fix: Scoped stylesheet keyed on [data-ahv-route] with !important (all sizes are inline): eyebrows -> font-size:15px; letter-spacing:2.5px (keep uppercase + rgb(143,98,18)); a/button labels -> font-size:15px; form label -> 16px; helper/notes -> 15px; footer legal links + © -> 15px. Simplest as a small DOM pass: for every lea
- **ahv-page-campaign-retreat** — Family route runs on a green/mint/white system that does not read as the same site  
  fix: Scoped token remap for [data-ahv-route="/family-ayurvedic-retreat-kerala.html"]: elements with inline background rgb(15,87,55) -> #5A4420 (solid buttons) ; text/border rgb(15,87,55) -> #006038; section backgrounds rgb(233,247,234) -> rgb(239,233,218) (the tinted band already used on the retreat/maharaja routes); tab ch
- **ahv-page-campaign-retreat** — KTAHV register-lock words present in copy, title and alt text (flag only — not a stylesheet fix)  
  fix: Not fixable by the scoped stylesheet or DOM pass without rewriting approved content — route to the content owner / Dr. Deepu John lane before staging goes further. Listed here so it is not lost; no change proposed to the approved payloads.
- **ahv-page-ayurveda-training-programs** — Course card / table meta text is 15.5-16px, below the 17px body floor  
  fix: Scoped stylesheet keyed on the route: `[data-ahv-route="/ayurveda-training-programs/"] #courses dl, [data-ahv-route="/ayurveda-training-programs/"] #courses dt, … dd { font-size:17px; line-height:1.6 }` and on desktop `#courses table, #courses td { font-size:17px }` (the 'Suitable for' column can drop `width:28%` to ~3
- **ahv-page-ayurveda-training-programs** — KTAHV language-lock hits in this template's content (flag only, not a styling fix)  
  fix: Do not restyle. Route to the content lane: the four 'Suitable for' strings and the one alt attribute need owner-approved replacements before this page leaves staging; the audit itself makes no wording proposal (approved-content rule). Record in QUESTIONS.md if unattended.
- **ahv-page-ashtanga-retreat** — Two of three content photos are stock urban yoga imagery, not KTAHV photography  
  fix: Asset swap, not CSS: replace AHV-Ashtanga-Intro.jpg and AHV-Ashtanga-Panels.jpg with on-site KTAHV photography (yoga hall / lawn at Olassery, Abhyangam). Until replacements exist, a scoped rule [data-ahv-route='/ashtanga-yoga-and-ayurveda-retreat/'] img[src$='AHV-Ashtanga-Panels.jpg'], img[src$='AHV-Ashtanga-Intro.jpg'
- **ahv-page-ashtanga-retreat** — Intro two-column grid uses a fixed 560px image column, collapsing body text to 98px (10ch) at 768px  
  fix: Scoped stylesheet in public/design/directions.css: [data-ahv-route='/ashtanga-yoga-and-ayurveda-retreat/'] section#retreat { max-width:none !important } and its parent grid -> grid-template-columns: minmax(0,1.1fr) minmax(280px,0.9fr) !important on >=1180px, and grid-template-columns: minmax(0,1fr) !important (single c
- **ahv-page-ashtanga-retreat** — Shared header/footer chrome carries 12-14.5px text including the mobile primary CTA label  
  fix: Site-wide chrome rule (applies to every route, so key on the header/footer rather than this template): header a.scp3, header a.scp2, header nav a.scp1, footer label, footer button, footer a, footer p, footer span { font-size:15px !important } with letter-spacing reduced to 1px so the desktop nav still fits on one row a
- **ahv-page-ashtanga-retreat** — KTAHV language lock: 'Luxury' in the page <title> and 'journey' in body copy  
  fix: Not a stylesheet fix: the <title> string in the design payload head and the one body sentence need a content edit in the approved payload (both -desktop and -mobile JSON), then Dr. Deepu John / Abilash sign-off per Lane B. Flagged, not applied (read-only audit).
- **ahv-page-yala-2018-retreat** — Text under the 15px floor inside the template's own main: eyebrow 13px and CTA labels 13/14px  
  fix: Scoped stylesheet keyed on [data-ahv-route="/ayurvedic-new-year-yala-2018/"]: (1) `main div:has(+ h1){font-size:15px;letter-spacing:3px;color:#C1882C}` (matches both the mobile section and the desktop grid cell); (2) `#current a{font-size:15px;letter-spacing:1.5px}`. No content or payload change.
- **ahv-page-ayurvedic-treatments** — Stock clinical photography on at least 8 of 33 programme cards  
  fix: Not fixable by stylesheet. Raise a creative-asset request (7-part spec, 1200x720 / 5:3 per card slot) for the 8 slots, or have the owner re-map those 8 cards to existing Kairali library photos in the approved payload (e.g. panchkarma.webp / ayurveda-training.webp style therapy shots). Until then a scoped rule `[data-ah
- **ahv-page-ayurvedic-treatments** — Mobile page is 32 screens long: 33 full cards stacked in one 24,394px section  
  fix: Scoped mobile stylesheet + small DOM pass. CSS (inline styles need !important): `@media (max-width:640px){ [data-ahv-route="/ayurvedic-treatments/"] main img[alt] { height:150px !important } [data-ahv-route="/ayurvedic-treatments/"] p > a[data-dc-tpl="113"] { display:none } [data-ahv-route="/ayurvedic-treatments/"] a.s
- **ahv-page-classic-villa** — KTAHV banned words rendered in <title> and body copy  
  fix: No stylesheet or DOM fix is appropriate — this is approved design-payload text. Flag to Abilash (and Dr. Deepu John if the copy is treated as clinical) for a content revision of the page <title>/meta and the three body occurrences; do not ship the route to production while the title carries 'Luxury'.
- **ahv-page-deluxe-villa** — In-template micro-labels render at 12-13px, under the 15px floor  
  fix: Scoped stylesheet keyed on [data-ahv-route="/deluxe-villa/"] (all blocks are inline-styled, so declarations need !important): #gallery button span { font-size:15px !important; letter-spacing:1.5px !important } ; #rooms dt, #rooms th { font-size:15px !important } ; #rooms button[data-room-index] { font-size:15px !import
- **ahv-page-de-addiction-rehabilitation** — Fixed mobile CTA bar labels are 12.5px  
  fix: Scoped CSS on [data-ahv-route="/de-addiction-and-rehabilitation-from-alcohol-drugs-tobacco/"]: target the fixed bottom bar anchors (position:fixed DIV > a) and set font-size:15px; letter-spacing:1px; keep min-height:52px. If the three labels no longer fit at 390, shorten via DOM pass to CALL / ENQUIRE / CONSULT.
- **ahv-page-de-addiction-rehabilitation** — Desktop paragraphs and list items run 108-185ch  
  fix: Scoped CSS: #faqs details p, #package p, section ul li (inclusions accordion), and the bottom strip p { max-width: 68ch }. For the inclusions list, set the parent ul to columns:2 / grid 2-col at ≥1024px so the list stays parallel-item content rather than a single 1183px column.
- **ahv-page-de-addiction-rehabilitation** — 82-96 text nodes below the 15px floor, including price and category labels  
  fix: Scoped CSS floor: [data-ahv-route=…] :is(strong, div, span, a, label, button)[style*="font-size: 1"] cannot be keyed reliably, so key on the inline-styled blocks: #package [style*="11.5px"], [style*="13.5px"], [style*="13px"], header nav a, footer a, footer label, footer button { font-size: 15px !important }. Keep lett
- **ahv-page-de-addiction-rehabilitation** — Clip-art 'History of Ayurveda' illustration with baked-in caption text  
  fix: Not a stylesheet fix — the asset is part of the approved payload. Flag for owner: replace with a real photograph from the media manifest (e.g. the archive/heritage photos used on the homepage) via the missing-asset protocol; until then a scoped CSS rule can hide the image container in #history and let the '1908' waterm
- **ahv-page-vision-eye-rejuvenation** — Chrome and sticky-bar CTA labels sit at 12-13.5px, under the 15px floor  
  fix: Scoped stylesheet on [data-ahv-route="/beauty-care-and-eye-care/"]: [data-dc-tpl="537"] a, a.scpc, a.scp3, a.scpe, button.scpe, footer a, nav[aria-label="Primary"] a, nav[data-dc-tpl="48"] a { font-size: 15px; letter-spacing: 1px }. The 390px bottom bar is exactly 56+98+108+128 = 390px wide, so reduce its letter-spacin
- **ahv-page-holistic-rejuvenation-detoxification** — Desktop FAQ block runs full 1203px width: 81-110 characters per line  
  fix: Scoped stylesheet keyed on the route root (inline styles dominate, so use !important): [data-ahv-route="/holistic-treatment-for-rejuvenation-and-detoxification/"] #faqs p, #faqs details, #faqs summary { max-width: 72ch !important; } and #recognitions > div:first-of-type p { max-width: 68ch !important; } plus the italic
- **ahv-page-holistic-rejuvenation-detoxification** — Tariff card price labels 10.5-13.5px muted on white (SINGLE/DOUBLE, per night, SIGNATURE)  
  fix: [data-ahv-route="…"] #package div[style*="text-transform: uppercase"] { font-size: 15px !important; letter-spacing: 1.4px !important; } #package div:has(> div + div) > div:last-child (the 'per night' cells) { font-size: 15px !important; } #package span[style*="font-size: 10.5px"] { font-size: 13px !important; padding: 
- **ahv-page-holistic-rejuvenation-detoxification** — KTAHV language-lock words present in rendered copy (luxury x10, journey x5, guests x4, spa x2, resort x1)  
  fix: Not a stylesheet fix. Flag to owner / Dr. Deepu John for copy sign-off before staging->production; decide policy for award proper nouns vs. free copy ('guests' -> 'patients', 'luxury villas' -> 'villas', 'journey' -> 'programme'). No content edit made in this audit.
- **ahv-page-digestive-wellness-gut-health** — Routine (Dinacharya) timeline squeezes 19 descriptions into a 180px column on mobile  
  fix: Scoped CSS at max-width 640px on [data-ahv-route="/digestive-wellness-gut-health-yoga-therapy/"] section[data-dc-tpl="313"] div[data-dc-tpl="319"]: grid-template-columns:1fr; put the time cell and the h3 on one flex row (time as an inline label), and let the description span the full 310-350px at 17px (about 42-45 cpl)
- **ahv-page-digestive-wellness-gut-health** — Package Tariff price qualifiers and accordion labels are 10.5-13.5px  
  fix: Scoped CSS: section#package div[data-dc-tpl="373"], span[data-dc-tpl="369"], section#package details strong[data-dc-tpl="387"] { font-size:15px; letter-spacing:1.2px } and div[data-dc-tpl="375"] { font-size:15.5px }. Cards have room (mobile card 350px with two 150px price columns; desktop card 287px).
- **ahv-page-digestive-wellness-gut-health** — Awards cards on mobile put 15.5px text in a 174px column (19-22 characters per line)  
  fix: Scoped CSS at max-width 640px: section#recognitions div[data-dc-tpl="114"] { flex-direction:column; gap:12px } so the badge sits above and text spans the 310px card (about 40 cpl); and section#recognitions p { font-size:17px } at both widths.
- **ahv-page-immunity-executive-health** — Desktop accordion/FAQ text runs 108–118ch across the full 1203px column  
  fix: Scoped stylesheet keyed on [data-ahv-route="/immunity-enhancement-executive-health-assessment-therapy/"]: `details p, details li { max-width: 68ch }`, FAQ section intro `p { max-width: 62ch }`; for Inclusions/Terms consider `details > div { columns: 2; column-gap: 48px }` at ≥1024px so the list still fills the row with
- **ahv-page-immunity-executive-health** — Awards cards on mobile squeeze body text to 14–19ch lines (1–3 words per line)  
  fix: Scoped CSS at ≤640px inside the route: award card grid → `grid-template-columns: 1fr` (logo above text, or logo inline with the h3 only), so the paragraph gets the full ~300px card width (≈32ch, the same as every other mobile paragraph). Also drop the 420px max-height scroll box on the expanded list at ≤640px (see sepa
- **ahv-page-knowledge-centre** — Sticky header + 3-row sticky jump nav pin 25% of the phone viewport while reading the cards  
  fix: Scoped stylesheet keyed on [data-ahv-route="/knowledge-centre/"]: at max-width 767px turn the jump nav (nav[style*="position: sticky"] containing a[href^="#"], inside main section[data-dc-tpl="23"]'s sibling) into a single horizontally scrolling row — .jump > div { display:flex; flex-wrap:nowrap; overflow-x:auto; gap:0
- **ahv-page-knowledge-centre** — Jump-nav labels are 12.5px (phone) / 13.5px (desktop) uppercase — below the 15px floor on the template's primary in-page navigation  
  fix: Scoped CSS: [data-ahv-route="/knowledge-centre/"] nav a[href^="#"] { font-size: 15px !important; letter-spacing: 1.5px; } (desktop 15-16px). Keep uppercase/700/gold-or-ink so it still reads as the site's tracked-label language; combined with the single-row fix above this stays one line on desktop (5 labels ≈ 900px at 1
