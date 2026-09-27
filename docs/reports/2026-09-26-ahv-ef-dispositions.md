# EF-01 to EF-24 + STAFF-01: worker dispositions (running log)

Claude CLI worker · task WOPS-AHV-FINAL-DRAFT-20260924-001 · branch codex/ahv-final-draft-20260924 · started 2026-09-26 12:20 IST.

How to read this file:

- **"Source fixed"** means the fix is committed in the repo and checked in a local browser. Local means `next start` on this branch, Playwright Chromium. "Hosted" means the protected preview. Local browser checks and hosted checks are reported separately.
- **No item is closed here.** Closing an item needs a hosted readback and the parent's or owner's acceptance.
- **Translation is on hold for edited English.** Units changed by these edits are held for delta translation after the current run, which is reading the frozen source.

## EF-04a · header label "Yoga & Training": source fixed, hosted check pending

- **Commit:** 88996c26.
- **What changed:** the homepage desktop primary nav was the only header carrying the long Sanskrit name. It now says "Yoga & Training", pointing at the same destination. The shared chrome and the mobile drawer already said this.
- **Translations:** the edited nav now equals the shared-header unit `t_e60bb2881c605be569e2`, which is already translated in all 12 locales. The translated labels are the short form (e.g. DE "Yoga & Training", JA "ヨガ・トレーニング", AR "اليوغا والتدريب"). Zero new units.
- **Evidence:** `CLAUDE-UX-CRITIQUE.md` §EF-04a.

## EF-04 · header, filter and CTA: options delivered, owner decision needed

- **What was delivered:** `CLAUDE-UX-CRITIQUE.md`, with measurements in `ux-evidence-20260926/`.
- **Recommendation:** Option A, a compact primary header plus one sticky contextual row plus a filter drawer, with a uniform CTA policy. Option C is the fallback.
- **What changed:** no layout change has been made.

## EF-03 · /yoga-meditation-programs/ rates: source fixed, hosted check pending

- **Commit:** 01094caa.
- **Root cause:** the finder logic treated a rate that isn't effective yet as expired. The approved 2026-27 yoga and training tariff starts 1 Oct 2026, so every yoga and training price printed "Request a quote".
- **Fix:** only a rate past its end date is withdrawn. An upcoming rate now shows "From ₹… · rates valid from 1 Oct 2026". Patched in `tools/build-finder-views.mjs` and in all 12 generated finder views (6 hubs × desktop/mobile).
- **Local check (390 px, /yoga-meditation-programs/):** four priced yoga programmes show "From ₹3,18,920 / ₹1,59,460 / ₹1,50,430 / ₹1,50,430 · rates valid from 1 Oct 2026". The personalised yoga programme keeps "Tailored programme — fee follows the doctor’s plan", because no published tariff exists for it (SOURCE.json "unpriced"). 0 console errors.
- **Deliberately unchanged:** the site-search dropdown. Its spec (`test/search-audit.test.mjs`) keeps future tariffs out of "current price" answers, and it was not edited.
- **New English unit:** "rates valid from". Delta translation is pending.
- **Tests:** 144/144 site tests pass.

## EF-02 · /ayurveda-package/: source fixed, hosted check pending

- **Commit:** 41823f2d. Tool: `tools/repair-ayurveda-package-cards.py` (idempotent).
- **Before (local render):** 24 captured cards showed old WordPress names. Every title was `href="#"`, marked non-interactive, and no image was linked. One title was truncated ("Holistic Treatment for Rejuvenation &").
- **After:** each card maps to the approved programme in `final-rates/ayurveda.json` (20260925-R1). It shows the current approved name, and both the title and the image link to the programme page.
  - The link probe at 1440 and 390 found 0 non-200 targets and 0 broken images.
  - "Treatment for Rheumatism" was **dropped**. It has no approved programme and no page (`site-tree-overrides.json` already recorded that).
  - Four approved programmes missing from the old list were **appended**: Immunity Enhancement, Sleep Restoration, Women's Hormonal Balance, and Personalised & Customised Healing. Each uses its own programme page's image, shown at the list's 300 px thumbnail width. Alt text is written from the images.
- **Follow-up for owner review, not changed:**
  - The section rail on this page (from the site tree) still carries older yoga labels:
    - "Kairali’s Personalized Yoga Program" (/yoga-retreats/). Its approved name is "Vaiyaktika Yoga Sādhanā — Personalized Yoga".
    - "Individual yoga therapy with Ayurveda" (/yoga-therapy-individual/).
    - "Yoga & meditation, 3-night minimum" (/yoga-meditation-program/).
    - "Yoga & Meditation Training Program".
  - The last three are not in the approved tariff catalogue. They are site-tree entries that owner-reviewed overrides may govern.

## EF-07 · /offers/: source fixed; the family-rail part waits on the EF-04 decision

- **Commit:** 0c420e76. Tool: `tools/repair-offers-ef07.mjs` (idempotent, desktop and mobile).
- **Removed internal notes that were public:**
  - "Reviewed on [TO CONFIRM]";
  - "Offer slots below. Each amount…";
  - "[TO CONFIRM] — the record's offer page states no claim procedure…";
  - "The record page carries no description…";
  - "The record's voucher page states no denominations…";
  - the voucher denomination placeholders;
  - the offer telephone placeholder and its note.
- **Owner rulings applied** (Q03 in `day-close/OWNER-DECISIONS-AND-TEAM-INPUTS.md`, 24–25 Sep):
  - Valid until → "No fixed end date". Minimum stay → "No minimum stay".
  - "Valid for first-time guests only" removed (the offer covers all guests).
  - "Confirm … this month" replaced with "Ask for this offer when you enquire with our patient care team." (the offer is indefinite).
  - The athlete and defence validity placeholders → "No fixed end date."
- **The Baoli Special Deal card is removed** (offers count 4→3). It has no description, amount or terms, and it is not among the owner-confirmed offers. Its own route, /the-baoli-special-deal/, is still served. That page has an empty body and a wrong head title ("Animal Husbandry | Kairali’s Organic Produce"). **Flagged for the owner.**
- **Offer phone:** now the published number +91 9555 156 156, as a tel: link.
- **Not changed:**
  - The staggered tier lists. Exact tiers are pending (Anupam MID-12046). Note that the defence bands overlap at 14 and 21 nights.
  - The KTAHV banned words on this page ("Three Journeys", "guest"). The language-lock audit records the owner's 15 Sep instruction: report only, the approved design copy is not rewritten.
- **Secondary navigation:** /offers/ is deliberately excluded from the shared rail (`EXCLUDE_FAMILIES` in `tools/build-section-nav.mjs`). Adding the rail reflows a designed template, so this is **decided together with EF-04**.
- **Local check (1440 and 390):** 0 `[TO CONFIRM]`, 0 internal notes, 0 console errors.

## EF-20 · /virtual-tour/: source fixed, hosted check pending

- **Commit:** 64c5419d.
- **New copy:** "Our full virtual tour … is in production and will be published on this page when it is ready…". No date is given. The staff name is not published.
- **The link:** it resolves to a 360° photo sphere of the property on Google Maps, so it stays, relabelled "360° view on Google Maps" and "Open in Google Maps" (new tab, noopener).
- **Head:** the description and og:description are updated in the record and the route manifest (140 chars).

## EF-22 · /video-gallery/ first thumbnail: cause found and fixed; check pending the rebuild

- **Commit:** 5133c7a8.
- **Reproduced locally at 1440 and 390:** the 1200×436 poster filled only the top of its 16:9 frame, leaving a grey band below.
- **Cause:** the section-rail rule `article img:not([class])` forced `object-fit: contain` and `width: auto` on this image.
- **Fix:** the poster image now has a class, so the gallery's `object-fit: cover` applies.

## EF-16 · shared footer on native pages: cause found and fixed; check pending the rebuild

- **Commit:** 5133c7a8.
- **Reproduced:** on /sightseeing/, /video-gallery/ and /read-feedback/ (the native Next.js pages), every footer link was underlined. On design pages such as /about-us/ there are none.
- **Cause:** the native pages inject the shared footer markup without the design runtime's base rule `a{text-decoration:none}`.
- **Fix:** the chrome CSS now covers both footers, as it already did the headers.
- **Remaining difference:** native-page breadcrumbs are underlined, while design-page breadcrumbs are not. This is a minor style drift and has not been changed.

## Regression found and fixed (not an owner EF item): consent notice on native and landing pages

- **Commit:** 5133c7a8.
- **What happened:** the localization commit 3e30e2a1 (25 Sep) made the consent notice copy call `T()`. `T` exists only inside the design boot script. So on every page that inlines the consent runtime on its own — the five native pages and **app/(lp)** landing pages — it threw `ReferenceError: T is not defined` in `designNotice`. Seen locally on /video-gallery/ at 390.
- **Fix:** the lookup is now self-contained (`CT`). The consent storage, signals and logic are unchanged (HARD GATE 11).
- **Needs:** re-verification on the next build, including one /lp/ page.

## Build sequence the release needs

- **Why:** English and native-page chrome snapshots predate the 13-language switcher (`english-candidate/prerender/about-us.html` is from 25 Sep 17:00). So the native pages still render the old "EN DE FR" buttons.
- **Sequence:** build → prerender English and all 12 locales from the current code → rebuild, which bakes in the fresh snapshots → QA.

## EF-23 · /retreats-gallery/: source fixed, hosted check pending

- **Commit:** f63cfd8b.
- **The defect:** the last two tiles were two frames of the same hammock shot. They are near-duplicates, not byte-identical files.
- **Fix:** the wider frame (-13) is kept and -12 removed (31→30 photos). The generator now excludes that sha256 (`NEAR_DUPLICATES`) so a rebuild can't bring it back.
- **Why nothing replaces it:** all 30 images in the verified retreats bank are already in use, so there is no unused verified image to substitute.
- **Not done — the gallery-family copy rewrite ("factual guest-focused copy"):** by doctrine (o) this is a content-geo-writer draft plus an owner review, so it's recorded here as NEXT rather than written ad hoc. Today the captions are descriptive alt-style text generated from the image catalogue.

## EF-18 · /gallery/ hub and children: source fixed, hosted check pending

- **Commit:** 2a381eea.
- **Hub reach:** the hub already reached all 10 children.
- **Breadcrumbs:** all 8 photo collections now show the site-tree chain (Home / Gallery [/ Photo gallery] / page). That is the same chain as the BreadcrumbList JSON-LD. Before, retreats sat under "News & Past Events", product under "About Us", and neither linked back to /gallery/.
- **Hub copy:**
  - The video note "Patient stories…" was inaccurate: none of the 22 films is a patient story. It now reads "Village life, yoga, therapies and villas on film".
  - The Virtual Tour card now reads "Coming soon · Full tour in production".
  - The heading "On film and in 360°" now reads "On film, and a tour on the way".
  - The retreats count is 29.
- **Redirect hop removed:** the countryside chapter link pointed at /attractions-under-10kms/, which 301s. It now goes straight to /sightseeing/.
- **Local check:** 0 non-200 on the hub and all 10 children.

## EF-09 · /ayurvedic-cuisine/: source fixed, hosted check pending

- **Commit:** f69099b6.
- **The defect:** 4 cards showed the same "World Luxury Spa Awards 2020" plaque and linked nowhere.
- **Fix:** each card now links, image and label, to its page (all 200). The images are verified assets:
  - two meal photos from the 2026 gallery bank;
  - the organic-farm and animal-husbandry pages' own 2026 illustrations.
- **Result:** tiles are an even 412×274.

## EF-10 · /experience/: source fixed, hosted check pending

- **Commit:** 638d39c9.
- **The defect:** 8 cards all showed the same 100px alcohol-free icon.
- **Fix:** each card shows its own page's owner-approved 2026 illustration (04df2a60), linked to that page. In-house products shows the product-gallery photo of the full range.
- **Thumbnails:** 360×240 derivatives, tracked in git like the originals.
- **Typo:** "The Ayurvedic care Village" → "Healing Village" (2 places).

## EF-15 · /things-to-do/: source fixed, hosted check pending

- **Commit:** 0eedb521.
- **The defects:** 3 cards had no image, and 3 showed the shared aerial banner (two with empty alt).
- **Fix:** every card now shows its activity and links from the image too. The stray "Cultural events" paragraph inside the jeep-safari card is now its own card linking to /cultural-events/ (no text lost).
- **Local check:** 65 links, 0 non-200; 20 images, 0 broken.

## EF-11 · /village-facilities/: partly source-fixed; owner facts needed

- **Commit:** bf36f19b.
- **Fixed:**
  - Linked tiles now link the image as well.
  - The "Beauty Therapy" tile gets its label back. A programme-rename sweep had renamed it to the eye programme and linked it there, which is the wrong destination.
- **Owner questions (not edited):**
  - (a) The **"Charm Science Experts" tile is an astrology graphic** ("Astrology Charm Science"). It sits on the NABH hospital's facilities page, which is a clinical-register and credibility concern. Keep, remove, or reword? Dr. Deepu John should be in the loop.
  - (b) The **"Amphitheatre"** tile shows an octagonal tiled-roof building among palms. Is that the amphitheatre?
  - (c) Are the Conference Hall and the Recreation & Business Centre (billiards photo) current facilities?
  - (d) Should the tiles carry short factual descriptions? That would be a content-writer draft plus owner facts.
- **Swimming pool:** corroborated by the property-gallery drone photo of the pool deck.

## EF-19 · photo and property galleries: hero replaced; owner marks needed for the rest

- **Commit:** c41fd42b.
- **Fixed:** the /photo-gallery/ hero and the /gallery/ Photo Gallery cover showed the vine-covered brick building with the Ganesha shrine (the head office, per the owner). They now show a Palakkad-library image (laterite patient villas along the water channel). The generator excludes the head-office frame by sha256.
- **Contact sheet:** `ef19-contact-sheet/contact-sheet.pdf` (12 pages, numbered 1–87, marks A/H/D/O) covers every gallery image whose source folder doesn't prove the property (`ktahv/`, `ktahv-shoot-2025/`).
  - `ktahv/ktahv-nontherapy-*` includes a wall emblem reading "Kairali Ayurvedic Centre" and urban-looking interiors, so those are likely the Delhi centre.
  - No image beyond the owner-identified hero has been swapped on inference.
- **Next:** replace the images the owner marks with verified Palakkad-library images. The treatment and therapy photos (Abhyanga, Pizhichil…) are in this uncertain set, which also blocks the /ayurveda-treatment/ placeholder fix (EF-12).

## EF-06 · clinical establishment certificate: source fixed, hosted check pending

- **Commit:** 0909b519.
- **Verified from the owner's file** `Clinical Establishment Permanent Registration certificate.pdf` (Kerala State Council for Clinical Establishments, Palakkad DRA, Form 7):
  - Permanent Registration No **P32563AY4104**, issued **12-05-2025**, valid to **10-05-2030**;
  - Olassery PO, Kodumba, Palakkad; person in charge Deepu John; Ayurveda; single-specialty hospital;
  - the same 32563AY series as the provisional T32563AY1145 (04-11-2023), which it supersedes.
- **Where it shows:** /accreditations/ and /about-us/, captioned "Clinical establishment permanent registration — 2025–2030". The image is rendered from the PDF. The PDF is kept as an asset, with 22 stray leading bytes from the portal download removed.
- **Note:** the certificate's legal entity name contains "RESORTS". It appears only inside the certificate image, never in page copy.

## EF-01 · homepage currency toggle: source fixed, hosted check pending

- **Commit:** a5436953.
- **What it does:** every homepage price renders from the approved 20260925-R1 editions:
  - the three programme rates;
  - the daily-admission line;
  - the four villa cards.
- **Controls:** ₹ INR / $ USD / € EUR buttons (aria-pressed) under the rates introduction.
- **Defaults:** the default is the locale's approved currency (build transform). The visitor's choice persists in `ahv-cur`, shared with the finder and search.
- **No conversion anywhere.** The patch asserts that the INR edition equals the figures printed today.
- **Local check:** all three currencies checked at 1440 and 390; the choice survives a reload; 0 errors.
- **Not changed:** the tariff PDF link stays the page language's edition. English has only an INR PDF; "All languages and currencies" links the rest.

## EF-05 · preferred-date fields: source fixed; physical-iPhone check pending

- **Commit:** 1ddc5345.
- **Reproduced in WebKit** (Playwright WebKit 26.5, iPhone 15 emulation; not a physical device). Empty date fields showed today's date in full-strength text, which reads as a chosen date. On iOS they appear blank. There were no visible labels, only aria-labels.
- **Fixed:**
  - visible From / To labels and "Optional. Leave blank if your dates are not fixed yet.";
  - untouched date fields are flagged sitewide (the script never sets a value);
  - Safari/WebKit hides the unfocused empty value;
  - Chromium keeps its dd/mm/yyyy hint.
- **Checked:** WebKit empty and filled states, and Chromium at 1440.

## EF-08 · senior-citizen offer: obvious defects fixed; claims flagged

- **Commit:** 76eed2e7. All CSS is scoped to this route.
- **Fixed:**
  - the hero now has inner padding;
  - the pill uses the site's 4px radius;
  - award logos are compacted (the section is 1,191px → 1,027px tall);
  - the portrait is 200px and framed, with mobile side padding;
  - "Call Us Now" is now visible (it was brown on brown), and its tel links carry +91.
- **Flagged, not edited:**
  - **"With over 12 years of experience in Ayurvedic geriatrics"** is a clinical and staff claim for Dr. Deepu John to confirm (STAFF-01 chronology).
  - **Award captions don't match their logos.** Four tiles read "World Luxury Award 2023" under TripAdvisor, ITCTA and trophy logos.
  - The interim note "This form is being connected. Until then…" is public.
  - Banned register words appear on the page ("journey", "luxury"). These are report-only per the owner's 15 Sep ruling.
- **Optional redesign:** that comes after launch.

## EF-13 · walk-in OPD: rates link added; copy needs a writer

- **Commit:** 2c59cf64.
- **Durations** equal the approved OPD edition.
- **Added:** a link after the table to the approved OPD rate PDF (EN-INR; each locale gets its own edition).
- **Content issues recorded, not rewritten:**
  - keyword-stuffed sentences ("best Ayurvedic doctor near me…", "online Ayurvedic doctor consultations in India");
  - "backed by over 35 centres worldwide" (a fact to verify);
  - "Visit: www.ktahv.com" (domain to confirm);
  - "healing journey" (banned word).
- **Owner decision needed:** a content-writer pass plus owner facts.

## EF-14 · /about-us/: source fixed

- **Commit:** 8f4ca892.
- **Fixed:** the landscape banner (also on /accreditations/) gets the site's existing alt text for that aerial shot.
- **Family audit:** 0 non-200 links, 0 broken images, no placeholders or internal notes. The certificate update is under EF-06.

## EF-12 · knowledge-centre family: audited; fixes depend on EF-19

- **Audit** (`family-audits/ef12-knowledge-centre.md`, 18 routes, one batch): links and images are technically clean.
- **Five articles have no content image:** /what-is-panchkarma/, /what-is-yoga/, /why-pick-a-yoga-or-yoga-retreat/, /retreats-for-everyone/, /yoga-retreats-for-everyone/. The last one also has an empty-alt banner.
- **/ayurveda-treatment/:** 13 therapy tiles show the old site's own `not-available.jpg` placeholder (a row of branded leaf bowls), and the alt texts are shifted by one against the images.
- **Next:** give each article one relevant verified image, and replace the therapy placeholders once the EF-19 provenance marks confirm which therapy photos are the Healing Village's.

## EF-17 · careers family: audited; handoff unverified

- **Audit** (`family-audits/ef17-careers.md`, 4 routes): 0 non-200 links, 0 broken images.
- **/jobs/business-development-manager/:** has no content image. Whether the vacancy is still open is an owner fact.
- **Navigation:** /apply-now/ and the job page draw no family rail (designed family), but both breadcrumb back to /careers/.
- **Deepu (web developer) careers-form handoff: UNVERIFIED.** Local records show the owner's routing decision (career@kairali.com, 25 Sep, "routing integration … NEXT under existing forms scope"). Forms-thread messages to Deepu Sahani exist (review invite 1a0d47fed4cb5929; newsletter 1a0d7f174700fa61). No record shows the careers-form scope specifically being sent. No mailbox search or email was made by this worker.

## EF-24 · archive families: audited; one merge candidate for the owner

- **Audit** (`family-audits/ef24-news-archive.md`, 21 routes): 0 non-200 links, 0 broken images.
- **/lakshya-yoga-retreat/:** has no content image.
- **Family rail:** 9 of 20 pages use designed past-event templates with no rail. All of them breadcrumb back to Past Retreats and News & Past Events. The rail decision rides with EF-04.
- **Duplicate evidence** (`family-audits/ef24-duplicate-evidence.json`, 5-word shingles):
  - **Only one real candidate:** /prav-simona-yoga-retreat/ ("summary") is 88% contained in /prav-simona-monsoon-yoga-retreat/ ("full record"). But it has 10 sentences the full record lacks, e.g. "70% of the ingredients … from the organic farm" and the yoga teachers' experience.
  - **Recommendation:** merge those sentences into the full record, then a single-hop 301 from summary to full record. The alternative is cross-links. **Owner decision; no redirect made.**
  - Lakshya 2017 vs 2018 are distinct events (0.26 similarity), and so is Karma Being vs 2019. Both stay.

## EF-21 · /ayurveda-gallery/: recommendation for the owner's decision

- **Evidence:**
  - 8 images, no captions, generic intro copy, "View image" buttons. One image is an illustration.
  - The July 2026 Search Console baseline shows 2 clicks from 72 impressions. It needs a re-pull before deciding, per the project note.
  - /treatments-gallery/ (39 verified photos) covers the same therapy intent.
- **Recommendation:** consolidate. Move any verified herb or preparation images into /treatments-gallery/, then a single-hop 301 /ayurveda-gallery/ → /treatments-gallery/.
- **Alternative:** rebuild it as a captioned herbs-and-preparations gallery, but only if verified herb imagery exists.
- **No change made.**

## STAFF-01 · Rana staff material: website-side, not started

- **Constraints:** per `staff-rana-20260926/STAFF-BANK-AND-TODO.md`, consent scopes and experience chronology have to be verified before any profile or portrait changes. No private CV detail has been copied anywhere.
- **Where it touches:** the only live site claim this worker met is on the EF-08 senior-offer page ("12 years … Ayurvedic geriatrics").
- **Next:** inventory every staff-profile route and start per-profile integration once the consent and chronology checks close. Dr. Deepu John signs off clinical titles.

## Local verification after the full rebuild (2026-09-26 ~14:15 IST)

- **Build:** `npm run build` with AHV_STAGING=1 exits 0 and generates 3145/3145 static pages. Checked with `next start` and Playwright Chromium.
- **EF-22:** the /video-gallery/ first poster fills its frame at 390 (354×199 in 354×199) and at 1440 (529×327), `object-fit: cover`.
- **EF-16:** 0 underlined footer links on /video-gallery/, /sightseeing/, /read-feedback/, /search/ and /givefeedback/.
- **Consent regression (5133c7a8):** the notice renders with 0 page errors on all five native pages and on /lp/treatment-in-kerala/ and /lp/pain-management/.
- **Still pending:** the native pages still carry the pre-13-language "EN DE FR" chrome from the old English snapshot. It is fixed by the prerender refresh in the release sequence.
- **Also fixed (745e7e63):** the homepage mobile menu button now exposes `aria-expanded` (false → true on open). The two desktop homepage switchers are never both in the viewport, so they're not a visible duplicate.

## 2026-09-28 05:20:00 IST — after the 04:30 reset: header takeover + EF-25 on protected staging

- **Staging:** https://ahv-final-staging.vercel.app now serves `dpl_F9LWa6pJpFQbiRZmmr63c5y9WtDK` (preview, built from 78d9c57a). Rollback target: `dpl_DZDP8tUC2e7VsgpA1b4tEGBMSmNe`. Evidence: `hosted-readback-20260928/README.md`.
- **EF-04a (hosted):** the short "Yoga & Training" label is visible on the same alias, in the desktop header (scrolled) and in the phone menu. The homepage footers are aligned to the shared footer (ab376e0d). The guard test covers headers, menus, footers and the native snapshot. **Status: awaiting parent/owner acceptance.**
- **EF-04 / EF-25 (hosted + local):** one compact family header on family pages. The coverage matrix of 254 routes × 2 viewports has 0 failures (`family-audits/ef25-coverage/MATRIX.md`). Stacked pinned bars fixed: training strip, packages top bar, FAQ filter, directions strip (ae3be320). Native locale pages keyed fixed (91c6e4a1). Finder badge and Clear fixed (c96b1e3a). Retired WordPress sidebar on /panchakarma/ removed (78d9c57a).
- **Round two** (committed 8cbf1c3a, not yet on the alias):
  - The cookie notice drops below the homepage's open phone menu.
  - The French homepage overflow from a long chip label is fixed.
  - Homepage language lock: "Take a Virtual Journey" → "Watch the Kairali Story", plus two accordion sentences.
- **TF-01 verification:** see STATUS.json `englishFeedback.teamFeedbackVerification`. Summary:
  - Counts 38 vs 47 are correct (overlapping categories).
  - The budget filter is correct; its badge and Clear bugs are fixed.
  - Remaining [TO CONFIRM] chips are genuine owner-fact gaps.
  - "Book my treatment" → enquiry form (21 pages) is listed for decision.
  - The sitewide legacy register (~1,400 locked words in migrated copy) is ESCALATED.
