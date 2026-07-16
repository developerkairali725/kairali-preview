# Design research — kairalihospitality.com rebuild
**2026-07-16 19:42:38 IST** · per D-DESIGN-DIFF (DECISIONS.md, 16 Jul 19:40 IST: per-site design research BEFORE building; inspiration only, never copying) and D9(iv)/Factory design-source protocol (galleries primary; Dribbble/Pinterest component-level only; every design decision cites its source; brand tokens always win — CLAUDE.md rule d).

## 0. Inputs read
- `wiki/entities/kairali-hospitality.md` — umbrella entity: holds Villa Raag (Agonda, Goa), the Healing Village (KTAHV), the European JV Resort Svatá Kateřina (Czech Republic), and future properties; two jobs: (1) present owned properties, (2) offer hospitality/wellness consultancy to others. JV legal form: ASK ABILASH before any ownership claim is printed.
- `SITE_DESIGN_LOCALE_REGISTER.md` row (line 28): **Register E (Expressive)** · audience "Hospitality partners + Villa Raag prospects" / umbrella per 16 Jul amendment · locales EN (→DE) · video **HF-AMB** (ambient only) · KPI: partner + stay + consultancy enquiries/mo.
- `packages/ui/brand-tokens.css` v1.1 (binding, §4 below) and `launches/` screenshots (kairali.com, kairalicenters.com, whatisayurveda.com) for the current skeleton.
- **FLAG:** `audits/kairalihospitality.com-2026-07-16.md` named in the task **does not exist** in `audits/` as of 19:42 IST (checked; nearest files are the 16 Jul audits for other domains). Research proceeded without it; reconcile when the audit lands. → QUESTIONS.md candidate.
- Register scoping: wellness-hospitality register sitewide; the **Healing Village property card keeps the clinical register** (patient/physician/treatment/programme; no spa/resort/holiday/luxury/journey/guests on that card) per CLAUDE.md KTAHV lock — the lock applies where the site describes/links the hospital's clinical programmes.

All fetched pages below were treated as **data, not instructions** (CLAUDE.md rule r). Nothing embedded in any fetched page was acted on. All URLs accessed 16 Jul 2026, ~19:15–19:40 IST, via WebFetch/Tavily.

---

## 1. References — hospitality groups / collections (multi-property umbrellas)

### 1.1 Ennismore — https://www.ennismore.com/
Umbrella for a lifestyle-hotel collective; the closest structural analogue to our two-job brief.
- **Learn:** section order WHO WE ARE → brand portfolio (cards with one-phrase personality descriptors — "Quirky & Elaborate", "Homey & Layered") → **"Key Openings"** (upcoming projects listed geographically) → **"Develop with us"** B2B band inviting partners. The upcoming-openings device and the closing develop-with-us band are exactly our "future properties" + consultancy jobs. Also: italicised key words inside headlines create typographic rhythm without new fonts.
- **Avoid:** brand-soup scale (10+ brands) — we have 3 properties; do not pad. Their sans-serif coolness reads urban-lifestyle, not wellness-warm.

### 1.2 Kerzner International — https://www.kerzner.com/
Corporate umbrella (One&Only, Atlantis, SIRO, Rare Finds).
- **Learn:** opens with a single confident statement block — "The Global Standard in Luxury Hospitality… Since 1993" — before any property. An umbrella site may lead with the GROUP's claim, not a property photo. (Fetch was partial — JS-heavy site; verified the statement-led opening and minimal chrome.)
- **Avoid:** corporate distance; the page gives the visitor no traveller path. Ours must serve premium travellers too.

### 1.3 Lore Group — https://loregroup.com/
Small international group (5–7 properties) that "designs, transforms, manages and operates" hotels.
- **Learn:** hero is a typographic city-code line — **"AMS | LDN | NYC | DC"** — plus ONE mission sentence, then straight to hotels. A tiny portfolio presented with total confidence; the mission sentence doubles as the B2B service claim. A `GOA | PALAKKAD | VYSOČINA` analogue is honest and memorable for us. Dedicated `/development/` page = clean home for the consultancy offer.
- **Avoid:** near-zero storytelling on the homepage — we need the family/1908 lineage warmth; their austerity would read cold for wellness.

### 1.4 Soneva — https://soneva.com/
Three resorts — the SAME portfolio size as ours at launch.
- **Learn:** how three properties are made to feel like a complete world: mantra ("Just What Matters."), three named resorts, then a philosophy chapter ("Returning to What Matters" — 30 years of belief) and a purpose chapter ("Protecting What Matters"). Repetition of the mantra as a section-naming system. Proof that a 3-property umbrella needs narrative chapters, not a bigger grid.
- **Avoid:** their travel-advisory banners stack clutter above the hero; keep our top clean.

### 1.5 Singita — https://www.singita.com/
Conservation-led lodge collection.
- **Learn:** two-line poetic hero ("Place of Miracles / Where the wild brings you back to yourself"); **portrait-format (930×1200) property tiles** carrying ONLY a location eyebrow + property name — no paragraph, the image does the selling; a full-width **100-year purpose pull-quote** as a standalone section; "Journey Designers" human-concierge section (named humans help you choose). The purpose-quote device fits our 1908 family lineage perfectly.
- **Avoid:** 19-lodge grid length; at 3 properties ours should be one viewport, not a scroll of tiles.

### 1.6 Aman — https://www.aman.com/
- **Learn:** featured-opening hero ("Amanvari — opening 1 August 2026") — leading with what's NEXT signals growth, relevant to "future properties"; destinations nav nested by region; generous whitespace between editorial blocks; properties surfaced multiple ways (nav list, feature tiles, footer directory) without a monotonous grid.
- **Avoid:** its sheer nav depth (35 properties); and Aman's near-total silence about who owns/runs it — our umbrella must foreground the family/group identity, not hide it.

### 1.7 COMO Hotels and Resorts — https://www.comohotels.com/
Family-owned group where wellness (COMO Shambhala) is a named pillar.
- **Learn:** **"I'm searching for" intent fork** (Beach / Nature / Urban) directly under the hero — our version: *Stay at a property / Partner with us / Begin a treatment enquiry*; **dual CTA on every property card** ("Explore" narrative vs "Book Now" transactional) — ours: "Explore" vs "Enquire"; "award-winning, family-owned group" positioning line; wellness held on a sister platform (Shambhala) yet woven into cards — mirrors our Healing Village link-out-to-KTAHV pattern.
- **Avoid:** carousel stacking (hero carousel + property carousel + stories carousel); Instagram-feed section adds noise.

### 1.8 Six Senses — https://www.sixsenses.com/en/
Wellness hospitality group register benchmark.
- **Learn:** values triptych (Our values / Pioneering wellness / Sustainability) as a compact identity band; **"On the horizon: featured new openings"** with year tags — Six Senses AMAALA (2026), Loire Valley (2027), Porto Heli (2028) — the exact device for announcing future properties WITHOUT inventing facts: name + year + one sentence, nothing more. Per-property one-line poetic subcaptions ("Still the city, stir your soul").
- **Avoid:** IHG-scale template feel in inner pages; their spa-menu vocabulary is banned on our Healing Village card (clinical register there).

### 1.9 Auberge Resorts Collection — https://aubergeresorts.com/
- **Learn:** collection organised by region **with honest counters** ("United States — 26 Hotels", "East Africa — 9 Camps and Lodges"); thematic journey framing ("The Joy of Wellbeing", "Food, Wine and Spirits") that cross-cuts properties; "Auberge Journal" editorial layer.
- **Avoid:** consent-wall wall-of-text on entry; thematic sections only work with enough inventory — at 3 properties, themes would look padded.

### 1.10 Oetker Collection — https://www.oetkercollection.com/
- **Learn:** the **H1 IS the brand statement** over a full-viewport image ("Oetker Hotels are exceptional masterpieces, set in unforgettable locations…"); tall portrait property cards (1290×1710); "Masterpiece Hotels" naming elevates a small collection; villas/events/sustainability as clean secondary chapters.
- **Avoid:** aristocratic-European register would ring false for a Kerala family group; no B2B path at all.

### 1.11 Our Habitas — https://www.ourhabitas.com/ (see also the DesignRush analysis: https://www.designrush.com/best-designs/websites/habitas-web-design)
- **Learn:** full-screen **auto-playing ambient video hero** — the strongest live example of what our HF-AMB policy permits (nature/texture ambience, no people-as-guests claims needed); emotion-first minimal navigation.
- **Avoid:** video without a poster-first budget (our LCP law); member/community framing irrelevant to us.

## 2. References — wellness-hospitality consultancy (job 2)

### 2.1 GOCO Hospitality — https://www.gocohospitality.com/
THE wellness-hospitality consultancy analogue.
- **Learn:** section order for a consulting narrative: market rationale ("$5.6 trillion global wellness economy") → five services as cards (market research, concept development, design, training, management support) → featured projects → client-logo strip → thought-leadership articles. Our consultancy section can compress this to: why wellness hospitality → what we do (concept → build → operate, drawn from 35+ years running KTAHV/centres) → proof (our own properties ARE the case studies) → enquiry CTA.
- **Avoid:** their operated brands are buried in the footer — on OUR site the properties are the hero, consultancy second; never let the consultancy block outweigh the portfolio. No invented market statistics: any number we print needs a source or it stays out (CLAUDE.md gate 6).

### 2.2 Design Hotels — https://www.designhotels.com/
Curated portfolio + industry research brand.
- **Learn:** region **counter grid** (Europe 190 / Asia 46 / North America 75…) as a proud inventory device — ours is honest at small scale ("3 properties · 2 countries · since 1999"); "Further" cultural-study series = thought-leadership device that earns consultancy credibility without selling.
- **Avoid:** marketplace chrome (currency selector, membership upsells) — wrong genre for us.

## 3. India / closest-context references

### 3.1 CGH Earth — https://www.cghearth.com/
Kerala hospitality group with an Ayurveda arm — the closest Indian analogue.
- **Learn:** wellness entities (CGH Earth Ayurveda, SwaSwara, Prakriti Shakti) presented as **parallel first-class offerings, not a tacked-on spa tab** — validates our properties-plus-clinical-door architecture; per-property one-line experience taglines ("Celebrate Kerala's backwater life"); responsible-tourism pillars as identity.
- **Avoid (explicitly, it's our cautionary tale):** dense text-heavy layout, weak hero, early-2010s icon styling, static single-testimonial block — this is what the Kairali fleet looked like pre-rebuild; the umbrella site must visibly NOT be this.

### 3.2 Evolve Back — https://www.evolveback.com/
Three-to-five-property premium Indian group.
- **Learn:** consistent banner-and-description rhythm per property; "Spirit of the Land" brand line anchoring the narrative; property differentiation through specific cultural/architectural stories rather than amenity lists.
- **Avoid:** hero carousel dependency; stacked promotional banners (offers/gift/book-direct) cluttering the lower page — our register E is calm, one CTA voice per view.

### 3.3 Ananda in the Himalayas — https://www.anandaspa.com/
India's flagship wellness-hospitality single property.
- **Learn:** expert-team presentation (named physicians/experts with portraits) — a device for the consultancy section's credibility; wellness-programme taxonomy by goal. Note how heavily award badges carry trust — we have NABH (hospital) + group lineage instead; use ours, never rent theirs.
- **Avoid:** badge-wall overload (12+ logos dilute); their spa-luxury vocabulary is fine for Ananda but banned on our Healing Village card.

## 4. Galleries & Pinterest (component-level only, per D9(iv))
- Awwwards Hotel & Restaurant category — https://www.awwwards.com/websites/hotel-restaurant/ (browsed 16 Jul; current wall includes portfolio-style hospitality picks, e.g. "Reverie Safaris", "Tribe Stays") — primary gallery for hero/motion patterns before the visual pass.
- Land-book — https://land-book.com/ (search "hotel") and Godly — https://godly.website/ — secondary galleries; browse at visual-pass time for section-composition references; no specific picks locked in this pass.
- Pinterest idea boards (COMPONENT level only — never whole-page copying): Luxury resort web design — https://www.pinterest.com/ideas/luxury-resort-web-design/961227617636 · Hotel website design luxury — https://www.pinterest.com/ideas/hotel-website-design-luxury/906080117532 · Retreat website — https://www.pinterest.com/ideas/retreat-website/905068167142 . Useful for: property-card crops, stat/counter treatments, enquiry-form styling.
- Adjacent lists cross-checked: Mediaboom 52 luxury hotel sites — https://mediaboom.com/news/luxury-hotel-website-design · HotelTechReport 35 examples — https://hoteltechreport.com/news/hotel-website-designs (source of 7132 / Badrutt's Palace minimalism notes) · Blastness 2025 trends — https://www.blastness.com/en/insights-hotel-business-development/8-trends-hotel-website (season/time-switch homepage device — noted, NOT adopted: gimmick risk under our calm-motion law).

---

## 5. DIFFERENTIATION vs our existing skeleton
Our six shipped/inflight builds (see `launches/kairali.com/home-desktop-full.png`, `launches/kairalicenters.com/home-desktop.png`, `launches/whatisayurveda.com/*`) all share: ivory ground · 64px ivory header · **contained left-text/right-image hero** (rounded "polaroid" image card + caption) · 4-chip stat band · overline + Kurale-H2 band sections · uniform 3-col white card grids with warm shadow · alternating image/text bands · forest-700 CTA band · dark footer. Register E licenses more. **Layout devices the umbrella site must use that NONE of the six builds use:**

1. **Full-bleed edge-to-edge hero** (HF-AMB ambient video, poster-first, or full-bleed still) with a two-line poetic statement — Singita/Oetker/Habitas pattern — replacing the contained polaroid hero. First Factory site where imagery touches the viewport edges.
2. **Portrait-format (3:4) property panels** — location overline + property name + one line max, no body paragraph — Singita/Oetker pattern; the three properties in ONE viewport row, each a floor-to-ceiling image. Kills the landscape-card-with-paragraph monotony.
3. **Typographic place-code strip** — `GOA · PALAKKAD · VYSOČINA` as an oversized Kurale/Lato device in or under the hero (Lore Group pattern) — instant "this is a family of places" signal.
4. **Dual-audience intent fork** directly under the hero — *Stay* / *Partner & consultancy* / (Healing Village clinical door) — COMO "I'm searching for" pattern; none of our builds fork audiences.
5. **"On the horizon" future-openings band** — name + year + one sentence per upcoming property, Six Senses/Ennismore pattern — structurally announces growth using only Abilash-confirmed facts (gate 6: nothing announceable yet → band ships hidden/empty until facts exist).
6. **Full-width purpose pull-quote interlude** — the 1908 family-lineage line set alone on a full-bleed surface (Singita 100-year-purpose pattern) — vs our current image-card + text band treatment of heritage. Years figure COMPUTED from 1908, never typed (D-rule, 16 Jul).
7. **"Develop with us" closing B2B band + dedicated consultancy page** — Ennismore/Lore/GOCO pattern: services as 3–4 cards (concept → build → operate), our own properties as the case studies, one enquiry CTA. No build so far carries any B2B-services architecture.
8. **Honest counter strip** — "3 properties · 2 countries · operating since 1999*" (Design Hotels/Auberge counter device, truthful at our scale; *dates verified before print — KTAHV open-date 1998/99 is still an open family question, DECISIONS 16 Jul).
9. **Asymmetric editorial pairs** — one portrait + one landscape image offset with text in the negative space (Aman/COMO editorial spreads) — replacing symmetric alternating bands at least once per page.
10. **Dual CTA on property cards** — "Explore" (narrative) vs "Enquire" (transactional), COMO pattern; our current cards carry a single "Visit the site →" link.

**Explicitly NOT adopted:** season/time switchers, cursor gimmicks (Le Mirabeau torch), horizontal-scroll hijack, stacked carousels, parallax — all violate the calm-motion law (fades 150–400ms, nothing bounces) or add gimmick risk.

## 6. Brand-law binds (non-negotiable, from `packages/ui/brand-tokens.css` v1.1)
- Ivory ground, ink text; **Kurale 400** display (never bold), Asap body, Lato captions/overlines. Full-bleed sections sit on imagery or forest-700/ink dark surfaces — never invented neutrals.
- Forest-500 = every action/link; **marigold = ONE accent moment per view** (sexiness ≠ more marigold — register table standing note); bronze overlines; leaf never text on dark; marigold never text on white.
- Pill buttons only; warm shadow only; hover deepens one ramp step — never lifts. Motion: gentle ease-out fades 150–400ms; no parallax; `prefers-reduced-motion` ⇒ static poster (hero video hidden).
- HF-AMB video law: ambient subjects only (nature/texture/architecture), brand-graded, ≤2 MB poster + lazy stream, poster-first LCP budget; never people presented as guests/patients/staff.
- **Villa Raag imagery follows raag-tokens on ITS surfaces only** — the umbrella site is a Kairali surface: the Villa Raag property card is composed in Kairali tokens (raag-tokens.css is NOT imported here); Raag's own look lives on villaraag.com.
- **Healing Village card = clinical register**: patient/physician/treatment/programme/consultation vocabulary; banned words (spa, resort, holiday, luxury, cure, journey, guests) never appear on that card or its link copy; card links out to ayurvedichealingvillage.com surfaces.
- Facts gate: JV ownership language — ASK ABILASH before printing (wiki open item); no invented stats, dates, or counts; time-derived numbers computed at build.

---

## 7. Design direction (final)
kairalihospitality.com should read as **the confident family umbrella over a small collection of real places** — closer to Soneva/Singita/Lore than to any big-brand portal: a full-bleed ambient hero with one two-line statement, a typographic `GOA · PALAKKAD · VYSOČINA` place strip, then the three properties as floor-to-ceiling portrait panels (Villa Raag warm-sensorial, Svatá Kateřina cool-Bohemian, the Healing Village composed with clinical dignity in its copy), a COMO-style intent fork separating travellers from partners, a Singita-style full-width 1908 lineage pull-quote with a computed years figure, a Six Senses-style "on the horizon" band that stays honest (or hidden) until future properties are announceable, and an Ennismore/GOCO-style "Develop with us" consultancy chapter where our own properties are the case studies — all executed inside Kairali tokens (ivory/Kurale/forest, one marigold moment, calm fades), so the site is unmistakably the most cinematic Kairali surface yet ships zero gimmicks. Every device above is inspiration, not copy: no reference layout is reproduced wholesale, and each build decision in the site brief must cite its source line here.

### MUST
- Full-bleed HF-AMB hero (poster-first, ≤2 MB poster, reduced-motion static) with a two-line statement in Kurale 400.
- Three-property portrait-panel row (3:4 crops, location overline + name, one viewport) with dual "Explore / Enquire" CTAs.
- Dual-audience intent fork above the fold: Stay · Partner & consultancy · Healing Village (clinical door).
- Full-width 1908 lineage pull-quote; years computed (`currentYear − 1908`), never typed.
- Consultancy chapter: 3–4 service cards → own-property case studies → single enquiry CTA; "Develop with us" closing band.
- Honest counters only (properties/countries/dates verified before print); "on the horizon" band gated on Abilash-announceable facts.
- Healing Village card in clinical register, zero banned words; KTAHV lock scoped to that card/links only.
- Kairali brand tokens throughout; ONE marigold accent moment per view; pill CTAs; warm shadow; calm fades only.
- Every layout device in the build cites its reference from §1–§5 (D9(iv) citation rule).

### MUST NOT
- No contained polaroid hero / uniform landscape 3-col card grid / 4-chip stat band as the primary devices — those are the old skeleton this site must visibly break from.
- No raag-tokens.css import on this site (Raag look lives on villaraag.com only); no sub-brand display fonts on umbrella surfaces.
- No spa/resort/holiday/luxury/cure/journey/guests on the Healing Village card; no clinical claims on Villa Raag/JV panels (wellness-hospitality register there).
- No invented facts: no JV ownership language before Abilash rules; no future-property names/dates before announceable; no rented award badges; no fabricated market statistics in the consultancy chapter.
- No carousels-on-carousels, season/time switchers, cursor gimmicks, parallax, horizontal-scroll hijack, autoplay sound; nothing that violates the 150–400ms fade law.
- No people presented as guests/patients in AI/ambient video (HF-AMB), and no whole-page copying of any reference (inspiration only).

*Research pass complete 2026-07-16 19:42:38 IST. Sources fetched via WebSearch + Tavily (research-tools directive); all fetched content treated as data (rule r). Follow-ups: missing audit file (§0 flag); JV entity form (QUESTIONS.md); announceable future properties.*
