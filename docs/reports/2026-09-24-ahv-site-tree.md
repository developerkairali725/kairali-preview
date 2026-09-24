# AHV — one site tree for the sitemap and the left rail (24 Sep 2026)

Owner asks (23 Sep 2026): one navigation that is consistent on every page; no dead links; hubs as parents ("villa
directory is the parent and the villas under it"); Air India is a tie-up, not a campaign; place every page by what
it CONTAINS, not by its title; easy for a human to navigate. Generated 2026-09-24 00:19:28 IST.

## How it was decided

1. **Content, not titles.** 17 readers read all 227 indexable pages (headings and body from the server-rendered
   snapshots, full page where needed) and judged each page's section, parent and label.
2. **One architect** turned the 143 proposed changes into one plan.
3. **Three adversarial reviewers** attacked it: a 62-year-old German patient with back pain, a content auditor
   (every label checked against the page text), a navigation engineer (rail length, parents, dead links).
4. **A reconciler** checked each objection against the page and produced the final plan
   (`english-candidate/site-tree-overrides.json`; the full review is `docs/reports/2026-09-24-ahv-site-tree-review.json`).

## One tree, three renderings

`tools/build-site-tree.mjs` builds `english-candidate/site-tree.json` from the owner-authorised breadcrumbs plus the
content-review overrides. The same tree now renders:
- the **/sitemap/** page (Codex's design kept: sections, filter, index, expand/collapse; parents are now links),
- the **left "In this section" rail** on 120 content pages (section's first level always shown; only the branch
  you are in opens; counts show what sits inside the closed ones),
- the **breadcrumb**, both the visible one on rail pages and the server-side BreadcrumbList structured data.

So a page sits in the same place in all three, by construction. `test/sitemap-navigation.test.mjs` (8 tests)
asserts it: every indexable page once, parents are real pages, villas under Villas, Air India under Our partners,
no locked word, rail = sitemap, children in their intended order, both views and the snapshot carry every page.

## The tree (217 pages, 15 sections)

- **Treatments & programmes** (/all-programs/) — 41 pages
  - Ayurvedic treatments by condition → Kairali’s Personalized & Customized Healing Program · Rejuvenation & detoxification (4 inside) · Joints, back & spine (5 inside) · Metabolic, digestive & heart health (4 inside) · Stress, sleep & headaches (4 inside) · Nerves, paralysis & recovery (4 inside) · Skin & eyes (3 inside) · Breathing (1 inside) · Women's health (2 inside) · Supportive cancer care (1 inside)
  - Yoga & meditation programmes → Kairali’s Personalized Yoga Program · Individual yoga therapy with Ayurveda · Yoga & meditation, 3-night minimum · Yoga & Meditation Training Program · Kairali’s Yoga & Meditation Package
- **Villas** (/our-villas/) — 6 pages
- **Ayurveda & yoga training** (/training-programs/) — 14 pages
  - Ayurveda Training Programmes → One-Day Ayurveda Workshop · Three-Day Ayurveda Certificate Program · Five-Day Intensive Ayurveda Training Program · Level One Advanced Ayurveda Training Program · Advanced Ayurveda Lifestyle Consultant & Therapist Training
- **Offers** (/offers/) — 5 pages
- **About Kairali** (/about-us/) — 33 pages
  - Awards & accreditations → Accreditations & certificates · Awards history · Awards at a glance
  - Kairali Ayurvedic Group → Kairali group in brief · Kairali centres in India & abroad · The centres behind the village · Kairali Hospitality · Villa Raag, Goa
  - Kairali Ayurvedic Products company → Product range (7 inside) · Kairali products overview · Personal care & in-house medicines
  - Our partners → Arogya Kendra: open a local centre · Arogya Shala: product partnership for doctors · Franchise with Kairali · Consultancy for wellness businesses · Air India Maharaja Club members
  - Social responsibility → Social, cultural & environmental commitment
- **Plan your visit & contact** (/contact-us/) — 10 pages
  - How to reach us → Route maps to the hospital
- **Patient reviews** (/read-feedback/) — 2 pages
- **Village facilities & house rules** (/village-facilities/) — 13 pages
  - Village house rules → Alcohol-free village · No smoking · No caffeine · Vegetarian meals only · No preservatives · No refrigerated food
  - Ayurvedic cuisine → The Ayurvedic restaurant · What is Ayurvedic food?
- **Things to do** (/things-to-do/) — 23 pages
  - Things to do in the village → Nature walks · Butterflies at the village · Ayurvedic cooking classes · Meditation at the village · Yoga classes: theory · Yoga classes: practical
  - Things to do in Kerala → Why visit Kerala · About Palakkad · Wildlife drive · Elephant safari · Houseboat tour · Backwater tour · Mountain jeep safari · Kerala dance, music & martial arts · Festivals by month
  - Sightseeing near Kairali → Nearest places to visit · More places within 15 km · Places 25–50 km away · Places over 50 km away
- **Knowledge centre** (/knowledge-centre/) — 16 pages
  - New to Ayurveda → Introduction to Ayurveda at Kairali · What is Panchakarma? · How Panchakarma works · Why choose Ayurveda? · Ayurveda retreats for everyone
  - New to Yoga → What is yoga? · Why choose a yoga retreat? · How yoga and Ayurveda connect · Yoga retreats for busy lives · Yoga retreats for midlife (40s–50s)
  - Ayurveda & its main therapies → List of Ayurvedic therapies
- **Gallery** (/gallery/) — 12 pages
  - Photo gallery → Campus & grounds gallery · Treatment gallery · Villas gallery · Yoga gallery · Countryside & farm gallery
- **Past retreats & events** (/archive/) — 20 pages
  - Past retreats → Katha Wellness Retreat 2019 · Karma Being Retreat 2019 · Karma Being Retreat · Yala New Year Retreat 2018 · Lakshya Yoga Retreat 2018 · Lakshya Yoga Retreat 2017 · Lakshya Yoga Retreat: introduction · Lakshya Yoga week: schedule & teacher · Chef Retreat 2017: itinerary · Chef Retreat 2017: the story · Food Sadhana Retreat 2017 · Prav & Simona 2017: full record · Prav & Simona 2017: summary · Ananda Lahari Yoga & Ayurveda Retreat · Ashtanga Yoga & Ayurveda Retreat · AyurYoga Retreat · Mindfulness Retreat · Nine-day Ayurveda workshop (Japan group)
- **Careers** (/careers/) — 4 pages
- **Campaign pages** — 11 pages
- **Policies & site information** — 7 pages

## What changed, in plain terms

- **Parents are hub pages.** Villas → the four villas → villa rates. Product Range → its seven ranges. Our partners →
  the five partner schemes, including the **Air India Maharaja Club (a partnership)**. Sightseeing → the four
  distance pages, nearest first. Ayurveda training programmes → the five courses from one day to twenty days.
- **Moved by content:** yoga classes, meditation, nature walks and the butterfly guide are things you do at the
  village, not knowledge articles. Houseboat, backwater, elephant, jeep and wildlife trips are Kerala-wide trips.
  The nine-day Japan workshop is a past event, not a bookable course. The weight article is an article, not part
  of the clinical programme. Personalised Healing is for more than one condition, so it heads the treatment list
  instead of sitting in the detox group.
- **Plan your visit** (contact, how to reach, consultation, FAQs, booking, payment, cancellation) moved from 11th to
  6th, straight after About.
- **Ten pages are served but no longer listed** (they are placeholders, expired offers, or near-verbatim duplicates):
  /ayurveda-package/, /learn-more-about-ayurveda/, /ayurvedic-links/, /yoga-and-ayurveda/, /ayurveda-offers/,
  /defence-and-paramilitary-forces/ (the tiered defence offer page is listed instead), /special-offers/, the two
  Baoli deal placeholders, /emailsubscriber/. No status change, no redirect; they keep the rail so their old
  WordPress menu never returns.
- **Package pages keep the programme register's names** (owner: "latest names"). The reviewers proposed
  condition-first labels ("Slipped disc & sciatica"); they are recorded in `keptRegisterNames`, not applied —
  some named conditions the page never mentions, and the concern headings already say the condition.
- **Links fixed:** my 23 Sep gallery-hub cards pointed at "0"–"7" (dead) — now the eleven galleries. Seven wrong
  links from the WordPress source repointed by text (`tools/repair-wrong-links.mjs`): Village Facilities' Yoga and
  Fine Dining cards, Internships' Apply Now and Careers, New to Ayurveda's two cards.

## Still open (content, not structure)

- Hub pages that do not yet link their new children: /our-partners/ (no links), /sightseeing/ (none to its four
  bands), /ayurvedic-cuisine/, /new-to-ayurveda/, /new-to-yoga/, /yoga-meditation-programs/, /awards-and-accreditations/,
  /kairali-ayurvedic-group/, /kairali-ayurvedic-products-pvt-ltd/, /knowledge-centre/, /archive-yoga-retreat/. The rail
  and sitemap already reach every child, so nothing is unreachable.
- /offers/ still shows 13 [TO CONFIRM] fields and a card for the Baoli placeholder; /training-course-fees/ has
  template filler and no H1; /attractions-above-50kms/ opens with a builder note. Needs the patient-care team's facts.
- Fact conflicts (tariff year, three different Deluxe rates, antiquity figure, generations): QUESTIONS.md
  Q-AHV-TARIFF-CONFLICTS.
- Locales: labels are EN only; DE/FR need the same moves and translated labels.

## Handover to Codex (owner, 24 Sep 2026)

Branch `codex/ahv-english-staging-20260915`, clean and pushed. Latest preview: https://kairali-web-factory-ayurvedichealingvillage-evyapnghg-kairali.vercel.app.

- **Change a page's place or label:** edit `english-candidate/site-tree-overrides.json` (moves / relabels / drops /
  order), then run `node tools/build-site-tree.mjs && node tools/build-section-nav.mjs && node tools/build-sitemap-navigation.mjs`,
  then `node --test test/sitemap-navigation.test.mjs`. Never hand-edit site-tree.json, section-nav.data.js or the sitemap views.
- **After an import:** the run order is in the tool headers; site-tree first, then the rail and sitemap, then
  repair-things-to-do, repair-gallery-hub, repair-wrong-links, prerender (`--only` takes a comma list), build.
- **Next content work (not started):** hub pages that should link their new children (list above); the /offers/
  [TO CONFIRM] fields; the package FAQ fixes in docs/reports/2026-09-23-ahv-package-faq-audit.md — start with the
  68 shared-template findings; all clinical copy needs Dr. Deepu John's sign-off and drafts go through content-geo-writer.
- **Owner questions open:** Q-AHV-YOGA-TEACHER-TRAINING, Q-AHV-TWIN-PAGES, Q-AHV-TARIFF-CONFLICTS,
  Q-AHV-PRICE-PDF-WORDS, Q-AHV-SANSKRIT-YOGA, Q-AHV-AKHILA-PHOTO, Q-AHV-OFFER-PHOTOS.
