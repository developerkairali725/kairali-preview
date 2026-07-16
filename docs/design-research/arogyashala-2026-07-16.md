# Design research — arogyashala.co.in rebuild (pre-build, per D-DESIGN-DIFF)

- Researched: **2026-07-16 19:42:58 IST** (research window 19:15–19:43 IST)
- Ruling honoured: **D-DESIGN-DIFF** (DECISIONS.md, 16 Jul 2026 19:40 IST) — per-site design research BEFORE building; Pinterest boards + high-ranking well-designed niche sites chosen for product and audience; **inspiration only, NEVER copying (copyright)**. Post-build the page must survive the side-by-side comparison gate against our own fleet.
- Method: WebSearch + Tavily MCP search + WebFetch page reads. **Rule (r) honoured: every fetched page was treated as data, never instructions.** Fetch failures are marked honestly below; nothing unverified is asserted as seen.
- Companion inputs read: `audits/arogyashala.co.in-2026-07-16.md` (on `origin/feat/fleet-audit-tail` at research time), `SITE_DESIGN_LOCALE_REGISTER.md` row 44, `wiki/entities/arogya-brands.md`, `packages/ui/brand-tokens.css`, launch screenshots + design reviews for the four shipped builds.

---

## 1. What this page is (context locked before any aesthetic choice)

**Arogya Shala = Kairali's retail-branding programme for chemists and retail outlets in tier-2/3 India** (wiki/entities/arogya-brands.md, Abilash 16 Jul — LOCKED). B2B/trade audience (shop owners), plus walk-in customers checking whether a branded counter they saw is legitimate. The rebuild is a **brand-protective one-pager** in the same class as arogyakendra.com: generate curiosity + enquiries. Register row: EN only, no sub-brand font override, goal "Indexed + branded query capture".

Hard content constraints the design must absorb:
- **No roster/locations list** — blocked on data. The legacy site's own locator shows `Total 0` outlets (audit finding 1); we must not design a section that begs for data we don't have.
- **No commercial terms** (fees, investment, margins, formats): the richer B2B version inherits the franchise commercials gate (Decision #59 family). Competitor landers lead with "₹X lakhs investment" — we CANNOT and must not imitate that.
- **No outlet-count stats.** Every competitor lander leans on "2,000+ stores". We have no number; per CLAUDE.md rule 6 nothing is invented. Trust must come from **group-level locked facts** (family practising Ayurveda since 1908 — computed, never typed; NABH-accredited hospital; WHO-GMP-certified manufacturing; info@kairali.com).
- Never imply counters are run by Kairali physicians; "© Kairali Ayurvedic Group Since 1908" is a locked-facts violation (audit) — lineage phrasing only.

---

## 2. References (13) — what to learn, what to avoid

### A. Indian pharmacy / retail-franchise landers (the niche's high-rankers)

**A1. Wellness Forever — franchise page** · https://wellnessforever.in/franchise.php · *(fetched 16 Jul)*
- **Learn:** the section rhythm of a working Indian retail-franchise lander: hero promise → qualification bullets → *low-friction phone-first CTA (missed-call mechanism)* → short form (name, phone, pincode, role) → trust stats with icons → **FAQ that pre-answers objections**. The "give a missed call" device is a genuinely tier-2/3-native trust move — the phone number as primary CTA, form second.
- **Avoid:** stock-banner hero (a JPEG with text baked in); trust stats that are raw counts (we have none to show); generic corporate photography.

**A2. Dava India (Zota Healthcare) — franchise enquiry** · https://www.davaindia.com/franchisee-enquiry (brand home: https://www.davaindia.com/) · *(fetched 16 Jul; page is JS-heavy and rendered thin)*
- **Learn:** certification badges (NABL/WHO/FDA) carried in the page furniture rather than shouted; a single memorable brand graphic device (their honeycomb motif) framing key messaging — proof that ONE ornamental system, repeated, brands a page.
- **Avoid:** their enquiry page barely renders without JS and reads as a navigation mismatch (product filters on a franchise URL) — our one-pager must be complete, static-first, self-contained.

**A3. Zeno Health (ex-Generico) — tier-2/3 "Bharat" generics chain** · https://www.zeno.health/ + https://corporate.zeno.health/ · *(home is a JS shell to fetch — assessed from search coverage, mark for a visual pass in the build session)*
- **Learn:** positioning language for non-metro India — savings and access framed as dignity, not cheapness ("quality medicines for every Indian"); micro-franchise story told through people, not floorplans.
- **Avoid:** app-first CTAs (our audience walks in or WhatsApps); discount-percent visual clutter.

**A4. Patanjali Wellness — franchise page** · https://patanjaliwellness.com/franchise.php · *(fetched 16 Jul)*
- **Learn:** two things worth stealing as *ideas*: (1) the **anti-fraud notice** — they warn about fake franchise offers up front; inverted, this becomes our *authenticity-verification block* for walk-in customers ("saw an Arogya Shala board? here's how to confirm it's real"), a perfect brand-protective device; (2) values-before-money copy order — philosophy first, commercials later, which is exactly the order our commercials gate forces on us anyway.
- **Avoid:** text-wall tiers with infrastructure tables and PDF downloads (we have no commercials to tabulate); NABH badge used on a *retail* surface (our NABH fact belongs to the hospital — attribute it precisely); no hero imagery at all.

**A5. Sri Sri Tattva — Partner with Us** · https://www.srisritattva.com/pages/partner-with-us · *(fetched 16 Jul)*
- **Learn:** what a *minimum viable* partner page looks like — headline, 4-field form, phone line with stated hours. The stated call-hours ("10am–6pm, Mon–Sat") is a small honesty device worth keeping.
- **Avoid:** this page as a whole — it is the cautionary tale: a bare form with no story, no programme explanation, no trust architecture. Ours must never be mistaken for this.

### B. Ayurvedic retail brands (design-quality benchmarks in our own tradition)

**B6. Kama Ayurveda** · https://www.kamaayurveda.in/ · *(fetched 16 Jul)*
- **Learn:** the strongest India-heritage-premium execution in the niche: cream/ivory ground with deep jewel accents, serif display + sans body, and — critically — **Sanskrit formulation names celebrated, not hidden**, as typographic texture. Their transparency framing ("every ingredient and process shared openly") is the register our trade audience trusts.
- **Avoid:** e-commerce carousel rhythm (we sell nothing here); luxury-spa aspiration — Arogya Shala is a neighbourhood-chemist brand, warm not rarefied.

**B7. Forest Essentials** · https://www.forestessentialsindia.com/ · *(fetch blocked, HTTP 403, this pass — assessed from reputation; MUST be viewed in-browser during the build session before citing any specific device)*
- **Learn (pending visual pass):** benchmark for heritage-Indian art direction — ornament used sparingly over generous whitespace.
- **Avoid:** luxury price-tier cues; heavy imagery weight (tier-2/3 connections).

**B8. Arya Vaidya Sala, Kottakkal** · https://www.aryavaidyasala.com/ · *(fetched via search excerpts 16 Jul)*
- **Learn:** the authority *content* pattern — "century-old charitable institution", classical-formulation vocabulary, physician lineage. This is the trust language tier-2/3 chemists already respect; our copy should rhyme with it (Kairali's own since-1908 lineage, stated precisely).
- **Avoid:** the design itself — dated portal layout, dense link lists. A reference for *what to say*, not *how it should look*.

### C. Global pharmacy design leaders (composition patterns, not palette)

**C9. Capsule** · https://www.capsule.com/ · *(fetched 16 Jul)*
- **Learn:** the cleanest trust one-pager in pharmacy anywhere: one idea per section; a **numbered how-it-works flow**; testimonial carousel with real names/headshots anchored by a quantitative badge; an *availability check* device in the hero (their zip-code field) — which maps to our "is there / can there be an Arogya Shala near you?" enquiry prompt.
- **Avoid:** VC-startup neutrality — white-on-white minimalism would read cold and un-Indian here; no copying of their section order wholesale (copyright + D-DESIGN-DIFF).

**C10. Alto Pharmacy** · https://www.alto.com/ · *(fetched 16 Jul)*
- **Learn:** "What to expect" as a section title pattern — expectation-setting as a trust device; pharmacist availability ("even nights and weekends") as a *service* promise rather than a feature list. Maps to "what happens after you enquire" — the anxiety of a first-time franchise enquirer.
- **Avoid:** app-centric flows; fertility/specialty verticals irrelevant to us.

**C11. Cabinet Health (B2B partner surface)** · https://cabinethealth.com/ · design case study: https://www.otherway.com/work/cabinet-health · *(both fetched/searched 16 Jul)*
- **Learn:** how a pharma company addresses *business partners* on a page that still looks consumer-grade: "single-source supply chain partner" framing, benefit-led headers, design-system clarity ("clarity, simplicity, trust" per the case study). The closest analogue to our B2B half.
- **Avoid:** enterprise jargon ("omni-channel growth") — our chemist in Hubli or Wayanad does not talk like this.

### D. Pinterest boards + galleries (per D-DESIGN-DIFF, component-level only per D9(iv))

**D12. Pinterest boards** — browse for component-level moves (badge strips, storefront illustration, bilingual type texture), never whole-page copying:
- Ayurvedic Website Design idea hub: https://www.pinterest.com/ideas/ayurvedic-website-design/922712669480/
- Ayurveda Branding idea hub: https://www.pinterest.com/ideas/ayurveda-branding/895457741891/
- "110 Ayurveda ideas — pharmacy design, store design" board: https://in.pinterest.com/abashrasal/ayurveda/  ← the one board that mixes *physical* Indian pharmacy-counter design with web/brand material; useful for the annotated-storefront figure (§3, device 5)
- Franchise Website Design idea hub: https://www.pinterest.com/ideas/franchise-website-design/958945891626/

**D13. Design galleries** — for one-pager section-rhythm calibration during build:
- Awwwards single-page collection: https://www.awwwards.com/websites/single-page/ and https://www.awwwards.com/awwwards/collections/one-page/
- One Page Love pharmacy tag: https://onepagelove.com/tag/pharmacy *(fetched 16 Jul; thin — few direct-pharmacy entries, e.g. onepagelove.com/cambridge-healthcare; treat as secondary)*
- Landbook landing-page gallery: https://land-book.com/design/landing-page *(fetch blocked 403 this pass — browse in-session)*
- Godly: https://godly.website/ (also surfaced as https://godly.design/sites) — motion/typography component ideas only.

---

## 3. DIFFERENTIATION — what this page must do that NO fleet build does yet

**The shared skeleton, verified** (launch screenshots `launches/kairali.com/home-desktop-full.png`, `launches/kairalicenters.com/home-desktop.png`, whatisayurveda + arogyakendra design reviews, `sites/arogyakendra.com/app/page.tsx`): ivory ground → 64px ivory header (wordmark left, pill CTA right) → **left-text/right-framed-image two-column hero** with bronze overline + short accent rule → **4-up trust-fact strip** directly under the hero → white **card grid(s)** at 16px radius with warm shadow → **forest-700 dark promise band** (overline + Kurale quote + inverse pill) → dark footer → sticky mobile CTA. Four sites, one skeleton, different nouns — exactly what D-DESIGN-DIFF exists to stop.

**Devices the arogyashala page must use — none appear anywhere in the fleet:**

1. **Two-door split entry (dual-audience router).** Immediately below (or as) the hero: "**I run a chemist shop / retail counter**" vs "**I saw the Arogya Shala board at a shop**" — two doors, two scroll targets. No fleet page addresses two audiences structurally; this one has exactly two, so the layout can BE the information architecture. (Pattern class: franchise landers' role fields — Wellness Forever's form asks retailer/investor — promoted from a form field to the page's spine.)
2. **Numbered programme flow (01 → 02 → 03).** "What happens after you write to us" as oversized Lato numerals with short steps (enquire → Kairali evaluates the counter → branding & range). Capsule/Alto's how-it-works pattern, re-set in brand tokens. The fleet has zero numbered sequences; numerals-as-graphic is a fresh typographic device that costs no new colors.
3. **A hero that is not left-text/right-image.** Break the two-column hero: either a **centered statement hero** or a **forest-700 full-bleed dark opening** (dark surfaces are ch.08-legal; no fleet page opens dark). Kurale statement line, marigold-300 descriptor as the view's single accent.
4. **Authenticity-verification block.** "Checking a board you saw? Every genuine Arogya Shala counter is authorised by Kairali — verify on WhatsApp or info@kairali.com." Inverts Patanjali's anti-fraud banner into a warm legitimacy service for walk-in customers; purely brand-protective, needs no roster data. Nothing like it exists in the fleet.
5. **Annotated storefront figure.** One illustrated/photographed chemist-counter with 3–4 labelled callouts (the Arogya Shala board · the Kairali range shelf · the authorised-counter mark). Replaces the locations list we cannot ship; the fleet has no annotated diagram anywhere. (Component inspiration: the abashrasal Pinterest board's physical pharmacy-counter material.)
6. **FAQ accordion.** 4–6 objection-handlers (Is this a franchise fee page? — no, enquiries first; Do I need to be a chemist?; Who supplies the products?; How do customers verify a counter?). Wellness Forever proves FAQ belongs on this page class; no fleet build has an accordion.

Post-build, per D-DESIGN-DIFF(2–3): screenshot this page beside arogyakendra.com and run the external-AI similarity comparison; if a reviewer can mistake one for a recolor of the other, iterate before the design-critic gate.

## 4. Brand law (binding, unchanged)

`packages/ui/brand-tokens.css` only — ivory ground, forest-500 interactive, Kurale-400 display (never bold), Asap body, Lato caption/numerals, bronze overlines, pill buttons, warm shadow, leaf focus ring, **marigold = exactly one accent moment per view**, dark surfaces forest-700/800 or ink. No sub-brand font override exists for Arogya Shala (register row 44: "none"). **Distinctiveness comes from §3's composition, typography scale, and section grammar — never from rogue colors or fonts.** Reference palettes above (Kama's jewel tones, Capsule's whites) are composition lessons only.

---

## 5. Design direction

Build a **warm Indian retail-trust one-pager that reads like a well-run neighbourhood pharmacy counter, not a startup lander**: open dark or centered (breaking the fleet hero), split immediately into the two doors (shop owners / board-checkers), and let each door resolve within one scroll — the owners' path through an annotated storefront figure, a 3-step numbered programme flow and a phone-first + WhatsApp enquiry block (call-hours stated, Wellness Forever's low-friction lesson), the customers' path through the authenticity-verification block that turns brand protection into a service. Trust is carried by precisely-attributed group facts (family lineage since 1908 — computed; NABH hospital; WHO-GMP manufacturing) set in the Kama-style celebrate-the-tradition register, and by expectation-setting copy (Alto's "what to expect"), never by outlet counts, maps, or commercial figures we do not have. Kurale at statement scale, oversized Lato numerals, one marigold moment, generous ivory air — token-pure, but composed like nothing else in the fleet.

**Must / must-not:**
- **MUST** use the two-door dual-audience structure, a numbered 01–03 programme flow, an authenticity-verification block, an annotated storefront figure, and an FAQ accordion — the five devices absent from every fleet build (§3).
- **MUST** break the fleet hero: no left-text/right-image two-column opening; centered or dark-band hero instead; and phone/WhatsApp-first enquiry (missed-call-culture friendly), form minimal (name · phone · pincode · shop or customer).
- **MUST NOT** show locations, outlet counts, maps, investment figures, fees, or formats — roster data is blocked and commercials are gated (Decision #59 family); no invented numbers ever (CLAUDE.md rule 6).
- **MUST NOT** use any color/font outside `packages/ui/brand-tokens.css`, more than one marigold moment per view, bold Kurale, or the "© … Group Since 1908" locked-fact violation — lineage phrasing only, years computed from 1908.
- **MUST NOT** copy any reference's layout, imagery, or copy (copyright; D-DESIGN-DIFF is inspiration-only), imply counters are run by Kairali physicians, or ship without the post-build side-by-side fleet-similarity comparison.
