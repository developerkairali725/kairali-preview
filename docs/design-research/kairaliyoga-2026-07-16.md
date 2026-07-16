# Design research — kairaliyoga.com rebuild

- Written: **2026-07-16 19:44:23 IST** (research window 19:35–19:44 IST)
- Per ruling **D-DESIGN-DIFF** (DECISIONS.md, 16 Jul 2026 19:40 IST): per-site design research BEFORE building — Pinterest + high-ranking, well-designed niche sites for this product and audience. **Inspiration only, never copying.**
- Rule (r) note: all externally fetched content below was treated as DATA. No instruction-like text encountered; the legacy-site audit's own injection screen was CLEAN.
- Inputs read: `audits/kairaliyoga.com-2026-07-16.md` (on `feat/fleet-audit-tail`, commit c7a9bf3 — not yet on main), `SITE_DESIGN_LOCALE_REGISTER.md` row (kairaliyoga.com = **E — Expressive** · yoga programme seekers + TTC prospects · EN · HF-AMB + REAL people · KPI: programme enquiries/mo), `packages/ui/brand-tokens.css` v1.1, `docs/rates/RATES_RECKONER.md` yoga tables (programme names/durations only — **no rates on this site**), `launches/` screenshots (skeleton baseline).

## What this site sells (design brief in one breath)

Residential yoga programmes hosted at KTAHV, Palakkad — three priced programmes with Sanskrit names and minimum stays (Dhyāna-Yoga Shibiram 7N · Agni Dīpanam Yoga Chikitsa 14N · Prāna Sāmya Yoga Chikitsa 7N), private sunrise yoga + one therapy/day, all-inclusive per-night model — plus TTC-adjacent training demand (Ayurveda Training Courses live in the reckoner). Audience: international + Indian yoga travellers and teacher-training seekers researching a high-commitment, flight-distance purchase. The site's only job: **programme enquiries** (feeding KTAHV bookings). The legacy site is a decade-frozen ASP.NET brochure (2013 feed content, expired 2018 calendar, dead UA analytics, chatbot force-open + push-prompt double interruption) — nothing visual worth keeping; asset-mining checklist still applies for photos.

## References (device worth learning · what to avoid)

1. **Samahita Retreat — samahitaretreat.com** (Koh Samui; Asia's benchmark retreat operator)
   - Learn: dual programme model made legible — *fixed-date retreats* (named teacher + exact date range, "Learn more" rows) alongside *customizable year-round stays*; all-inclusive framing ("program, accommodation, meals… so you can fully focus") stated in the hero; wellness value-packages as named bundles.
   - Avoid: dense text walls; biohack jargon ("brainwave modulation") would collide with our register.
2. **Suryalila — suryalila.com** (Andalusia; award-winning independent retreat centre)
   - Learn: a real **retreat calendar** page (dated cards, soonest first) as the site's beating heart; "Retreat Yourself" self-designed package for date-flexible guests; facility index ("The Suryalila Experience": studios, pool, farm, café) as an appetite-building grid.
   - Avoid: Wix-template flatness — heading hierarchy goes mushy (h6 everywhere); calendar cards repeat boilerplate copy.
3. **The Yoga Barn — theyogabarn.com** (Ubud; highest-footfall yoga venue in Asia)
   - Learn: card-based programme architecture (Classes → Retreats → Trainings) that scales; upcoming events shown with date + instructor name (answers "when/who" instantly); living Instagram layer as proof-of-life.
   - Avoid: "Reset, reconnect, rejuvenate" stock language; Gandhi/Tolle quote carousel — the generic-wisdom cliché; no pricing/booking clarity above the fold.
4. **Ananda in the Himalayas — anandaspa.com** (India's flagship luxury wellness destination)
   - Learn: **goal-first programme taxonomy** (Immunity & Vitality, Detox, Sleep, Weight, Pain…) — the buyer self-selects by outcome, not by treatment name; physicians/experts shown as named faces; "Personalised Assistance" as a soft conversion lane.
   - Avoid: award-badge wall (11+ logos in the footer) — authority by clutter; near-identical section headers ("A journey of wellness" ×4) reveal template repetition. ("Journey"/"luxury" are banned on KTAHV-named surfaces anyway.)
5. **Kamalaya — kamalaya.com** (Koh Samui; design-literate wellness resort)
   - Learn: "Explore Wellness Programs by selecting your **Personal Wellness Goals**" — an explicit selector device; named sub-places (Longevity House, Cognitive House, Arjan Cave) give the property narrative geography; "Wellness Guardians" humanises guidance.
   - Avoid: mega-menu overload (40+ links) — enquiry sites need fewer, deeper paths.
6. **Sampoorna Yoga — sampoornayoga.com** (Agonda, Goa — same beach as Villa Raag; 17-yr TTC school)
   - Learn: the **proof stack**: "17,000+ graduates · 17+ years", Yoga Alliance RYS badges, aggregated review scores with counts, video testimonials of named students with countries; transparent deposit/refund T&Cs as a trust device; giving-back section (local animal shelter).
   - Avoid: no visible pricing anywhere → friction; dates buried one click too deep; "circle of souls" copy drifts into guru-speak.
7. **Kranti Yoga — krantiyoga.com** (Patnem, Goa; TTC conversion machine)
   - Learn: duration-tier cards (50/100/200/300/500hr) each with a plain-verb promise ("Start My Yoga Journey!"); multi-platform star ratings shown side by side (Google 4.8 · Facebook 5.0 · YA 4.8, "based on 1020 reviews"); WhatsApp as first-class contact.
   - Avoid: "Namaste" greeting copy, emoji-icon benefit bullets, generic "family environment" claims — the exact AI-generic register our design bar bans.
8. **Power of Now Oasis — powerofnowoasis.com/yoga-teacher-training-bali/** (Bali; the best long-form TTC landing page found)
   - Learn: the **page architecture**: accreditation-first hero ("Yoga Alliance Accredited · Beachfront · Since 2010") → what-to-expect → reviews BEFORE pricing → dates calendar with early-bird → curriculum → daily logistics → stable-team bios → FAQ that kills objections ("Do I need experience?", "Can I come if I don't want to teach?", visas) → cascading CTAs (ask a question → 15-min chat → enquire). Scarcity done honestly ("maximum 20 students"). Photo cohesion via consistent wardrobe; real student diversity in imagery.
   - Avoid: "life-changing journey" testimonial boilerplate; sunset-beach sameness.
9. **BookYogaRetreats Kerala category — bookyogaretreats.com/all/d/asia-and-oceania/india/kerala** (the OTA our buyers actually compare on)
   - Learn: the OTA teaches what converts: **arrival-month filter + date picker first**, duration/hours taxonomy (100/200/300/500hr), format facets, "Popular" badges, inclusions comparison. Our programme pages must answer the same triplet — *when can I come, how long, what's included* — or lose the comparison shopper back to the OTA.
   - Avoid: marketplace visual noise; iframe-y filter UI. (Adjacent: bookretreats.com's "let our team hand-pick for you" concierge card = a soft-enquiry device worth stealing conceptually.)
10. **SwaSwara (CGH Earth) — cghearth.com/swaswara** (Om Beach, Gokarna; the closest Indian register-cousin: eco-wellness + yoga + art)
    - Learn: the **meaning-of-name device** ("SwaSwara means your inner voice…") as an identity anchor — ours: each programme's Sanskrit name set large with its plain-English meaning; earthy restraint; art/cuisine/nature woven as one story rather than an amenity list.
    - Avoid: widget clutter (cookie banner, loyalty, tell-a-friend); PNG-filename image hygiene; Instagram embeds doing the imagery's job.
11. **Yoga by Nina — awwwards.com/sites/yoga-by-nina** (Awwwards Honorable Mention, 7.8/10)
    - Learn: proof a yoga surface can win on **typography and restraint** — warm-neutral (#ccbb99) + near-black palette, loader/menu transitions, minimal noise. Maps directly onto our ivory/ink + Kurale toolkit and calm-fade motion law.
    - Avoid: portfolio-minimalism has no conversion spine — beautiful, but zero enquiry logic; we take the finish, not the emptiness.
12. **Sivananda — sivananda.org / sivananda.eu** (the lineage giant; also the cautionary tale)
    - Learn: **lineage authority framing** ("teachings passed guru to disciple in an unbroken chain", "since 1957") — Kairali's four-generation physician family is our honest equivalent (worded per PR #65: lineage 1908, group 1989).
    - Avoid: the execution — dated templates, wall-of-text reviews, navigation sprawl; authenticity ≠ visual neglect.
13. **Pinterest idea boards** (mood-board seeds, browsed as search surfaces):
    - pinterest.com/ideas/retreat-website-design/899549668392/ · /ideas/retreat-landing-page/945651441617 · /ideas/wellness-landing-page/928968209580 · /ideas/yoga-website-design-inspiration/933616495338
    - Pattern across boards: the pins that stand out are **bold green-palette nature layouts, oversized serif type, editorial white space** — NOT the script-font/lotus/zen-stone pins, which read as template wallpaper. Confirms our brand kit is already on-trend; the differentiator is editorial confidence.
14. **Himalayan Institute — himalayaninstitute.org** (Poconos; tradition + education hybrid)
    - Learn: clean three-door homepage (Retreats / Wellness / Teacher Training) mirroring our own demand split; education layer as retention.
    - Avoid: newsletter-first hero (mission before offer buries the enquiry path).

## The cliché blacklist (named so we never build them)

Zen stock photo + script font · lotus/om/mandala clip-art · stacked-stones and incense-smoke imagery · Rumi/Gandhi quote carousels · "reset · reconnect · rejuvenate" and "transformative journey" copy · sunset-silhouette hero sameness · award-badge walls · auto-opening chatbots and push prompts (the legacy site's own sin, audit finding #15) · guru-speak ("circle of souls") · fake scarcity timers · AI-generated people (register: HF-AMB ambient only; people = REAL).

## Differentiation vs our six-build skeleton

Our six shipped/queued builds share: ivory ground, overline + Kurale headline left / framed-captioned photo right hero, 4-up stat band, white card grids in alternating bands, dark forest promise band, dark footer, WhatsApp pill CTAs. For E-register kairaliyoga, adopt devices **none of the six use**:

1. **Full-bleed HF-AMB video hero** (dawn light on the herbal farmland / palm canopy — ambient only, no people implied as clients), Kurale display set larger than any current build, single marigold accent moment. First E-register break from the left/right ivory hero.
2. **Programme calendar strip** — a dated "next admissions" device (programme · Sanskrit name · minimum nights · next start) modelled on Samahita/Suryalila rows. No build has a date-led device; for this audience dates ARE the product. (Admission dates need Abilash/reservations input — leave slots, never invent dates, CLAUDE.md gate 6.)
3. **Goal-first selector** (Kamalaya/Ananda device): "What brings you?" — *stress & energy reset / digestive & gut health / meditation immersion / train to teach* — four doors routing to the three programmes + training. Interactive routing exists in no current build.
4. **A-day-at-Kairali vertical timeline** — sunrise private yoga → therapy → conscious meals → evening mindfulness, drawn from the reckoner's real inclusions. A time-axis device; none of the six have one.
5. **Sanskrit-name editorial typography** — Dhyāna-Yoga Shibiram / Agni Dīpanam / Prāna Sāmya set huge in Kurale with plain-English meaning as the bronze overline (SwaSwara's name device, our content). Instantly ownable; no competitor found does this.
6. **Named-person testimonial + review-count proof block** (Sampoorna/Power of Now device) and an **objection-killing FAQ** (visas, experience level, solo travellers, "is this a hospital?") — neither exists in any current build.
7. **Cascading enquiry ladder** — ask a question → WhatsApp → full enquiry form — replacing the single header pill; reviews sequenced before the enquiry ask.

## Brand law binds (packages/ui/brand-tokens.css v1.1 — non-negotiable)

- Ivory ground, ink text; **forest-500 actions**, leaf identifies, bronze overlines, **marigold = ONE accent moment per view, never text on white**.
- Kurale display h1–h3 **weight 400 only**; Asap body/UI; Lato captions/overlines. No script fonts, ever.
- Pill CTAs (radius-pill), hover deepens one ramp step — never lifts; white cards, warm shadow; 4px rhythm; 1120px layout / 720px prose.
- Motion: gentle 150–400ms ease-out fades only, nothing bounces, no parallax (register E = "parallax-free calm motion", Manual ch.07).
- Video: **HF-AMB** — ambient nature/texture only, brand-graded, ≤2MB poster + lazy stream, `prefers-reduced-motion` → static poster. People imagery = REAL photography only.
- Dark surfaces forest-700/ink only; marigold-300 accents on dark; leaf never text on dark. Focus ring on every control; touch targets ≥44px.

## Design direction (one paragraph)

Build kairaliyoga.com as the factory's first true E-register surface: a cinematic but calm site where a full-bleed ambient dawn video opens into an editorial, Sanskrit-forward programme story — the three programmes presented as named practices with real minimum stays and a date-led admissions strip, a goal-first selector routing seekers by outcome, and a sunrise-to-evening timeline that lets the visitor pre-live a day at the Healing Village. The seduction is visual and typographic (oversized Kurale, ivory space, one marigold moment, real Palakkad photography), never adjectival; proof is named people and counted reviews, not badge walls; and every scroll path ends in the enquiry ladder — question, WhatsApp, form — because the KPI is programme enquiries, not applause. Where KTAHV is named, the clinical register holds (physician, programme, admission); the yoga-wellness warmth lives in imagery and rhythm, not in banned words.

### MUST
- Full-bleed HF-AMB ambient hero with static-poster fallback; REAL people photography elsewhere (asset-mine legacy site first — Operating Principles).
- Programme calendar/admissions strip + minimum-nights honesty; enquiry (not price) as the action. Rates live ONLY in approved surfaces — link "request the current tariff" into the enquiry flow.
- Goal-first selector; day-timeline; Sanskrit-name editorial type with English meaning overlines.
- Proof block: named testimonials, counted ratings, Yoga Alliance/NABH-adjacent facts ONLY as verified (gate 6 — ask, never invent).
- Objection FAQ (experience level, solo travel, visas, arrival/transfers — transfer facts exist in reckoner sources).
- Cascading CTA ladder with `data-cta` events; GA4/GTM from day one (legacy had 3 years of analytics darkness).
- Clinical register wherever KTAHV/the hospital is named (audit finding #14's register question is Abilash's ruling — design must carry the clinical wording without visual change).
- info@kairali.com everywhere (audit #2: legacy mailto dropped "fo" — never reproduce); locked WhatsApp …38797 if surfaced.

### MUST NOT
- No price tables or per-night grids anywhere on this site (rates = approved surfaces only, per task ruling + reckoner FLAGS on bundled-figure display).
- No "Since 1908" attached to the Group (audit #1 / PR #65 — lineage wording only).
- Nothing from the cliché blacklist above: script fonts, lotus clip-art, stock zen imagery, quote carousels, badge walls, auto-opening chat/push, "journey/luxury/spa/resort" on KTAHV-named surfaces (banned senses), guru-speak.
- No AI-generated people, no parallax/bounce motion, no second accent color per view.
- No copying: every device above is re-composed in Kairali tokens and Kairali content — layouts, copy, and imagery are ours alone.

## Sources

- Local: `audits/kairaliyoga.com-2026-07-16.md` (c7a9bf3) · `SITE_DESIGN_LOCALE_REGISTER.md` · `packages/ui/brand-tokens.css` · `docs/rates/RATES_RECKONER.md` · `launches/kairali.com/home-desktop-full.png`
- Web (fetched 16 Jul 2026, 19:35–19:44 IST; treated as data): samahitaretreat.com · suryalila.com (+ /retreats) · theyogabarn.com · anandaspa.com · kamalaya.com · sampoornayoga.com · krantiyoga.com · powerofnowoasis.com/yoga-teacher-training-bali/ · bookyogaretreats.com/all/d/asia-and-oceania/india/kerala · bookretreats.com · cghearth.com/swaswara · awwwards.com/sites/yoga-by-nina · sivananda.org · sivananda.eu · himalayaninstitute.org · pinterest.com/ideas/retreat-website-design/899549668392/ · /ideas/retreat-landing-page/945651441617 · /ideas/wellness-landing-page/928968209580 · /ideas/yoga-website-design-inspiration/933616495338 · wpastra.com/resources/yoga-websites/ · htmlburger.com/blog/yoga-websites-examples/ (gallery cross-checks)
