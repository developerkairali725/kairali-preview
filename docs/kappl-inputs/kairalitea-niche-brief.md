# kairalitea.com — Pre-Design Niche Research Brief

**Compiled 2026-07-14 18:15:10 IST · Register: KAPPL / product-pharma (NOT KTAHV clinical lock — see §5).**
**Maintained via LEARNINGS.md-driven PRs only (same rule as DESIGN_DOCTRINE.md and the Ship Gate). Every external claim is cited inline; the source index is at the foot.**
**Model for this document: `docs/ktahv-inputs/comp-set.md`. Register authority: CLAUDE.md Factory Rules ("KAPPL/product sites = product-pharma register"). Design authority: `docs/design/DESIGN_DOCTRINE.md` + `packages/ui/brand-tokens.css`. E-commerce is Shopify — this site NEVER builds a cart/checkout (Factory Rules); it merchandises and hands off.**

> **Scope note.** This is a research brief that precedes design decisions (per CLAUDE.md, 13 Jul 2026 Abilash directive: "research the niche's competitors… BEFORE design decisions are made"). It does not itself approve copy or ship code. Two items below are hard ESCALATIONS to Abilash/legal before any build: the FSSAI "tea" naming exposure (§5.A) and all health-benefit copy (§5).

---

## 0 · Two blockers to resolve before a single page is designed

1. **NAMING EXPOSURE — the domain is `kairalitea.com` but FSSAI now restricts the word "tea."** On 24 Dec 2025 FSSAI (advisory RCD-02004/7/2025) directed that only products derived from *Camellia sinensis* may be called "tea"; pure-herbal blends (tulsi, chamomile, ginger, hibiscus) must be labelled "herbal infusion" / "botanical beverage," and the directive **explicitly binds e-commerce platforms and retailers** [S1, S2, S3]. The brand/domain name is fine as a mark, but regulated **product titles and category labels** for tea-less SKUs need "herbal infusion / botanical blend" language. Blends that contain a real green/black tea base can keep "tea." → **ESCALATE to Abilash + legal; audit every Shopify SKU title before launch.** (Note: this aligns with CLAUDE.md — do not invent a legal position.)
2. **HEALTH-CLAIM EXPOSURE — Ayurvedic-tea benefit copy is where all the legal risk sits, across all four regimes we sell into (India DMR/FSSAI/ASCI, US FDA/FTC, EU).** The premium/expressive register the brief wants is fully achievable through sensory + heritage + gifting language, which no regime restricts. Efficacy/disease language must be cut. → Full copy law in **§5**; route any proposed benefit claim to Abilash/legal before publish.

---

## 1 · Competitor landscape

Key players, sorted by what a new heritage-Ayurvedic entrant can learn. "Table-stakes" = furniture we must match to not read as untrusted. "Edge" = the differentiators that separate premium leaders and that our 1908 heritage + Kerala sourcing can plausibly own.

| Player | What they do well | Table-stakes vs edge | Evidence |
|---|---|---|---|
| **Vahdam** | Hard, quantified social proof above the fold — "6 Million Customers," "250,000+ reviews · 4.9★," "Oprah's Favorite Things (2018 & 2019)," "Featured on Ellen." Products with even 5 reviews are ~270% more likely to be bought than zero-review ones; 95% of shoppers read star ratings before Add-to-Cart. | **Table-stakes** — a new brand without a credible review count + ≥1 press/authority badge above the fold reads as untrusted. | [S4] |
| **Vahdam / Art of Tea / Teabox / Organic India** | Free-shipping-threshold banner pinned to the header ("FREE US SHIPPING ABOVE $59" / "over $60" / "$39+" / "$60 and over"). Doubles as an AOV nudge. | **Table-stakes** furniture, not a differentiator. | [S4] |
| **Art of Tea / Traditional Medicinals / Teabox** | Dual navigation taxonomy — shop by **type** AND by **function/benefit** (Energy & Focus, Calm & Sleep, Digestion, Immunity, Detox). Lets the connoisseur and the wellness buyer self-select. | **Table-stakes** IA — a gifting/wellness site must expose a benefit-led path alongside the type-led one. | [S5, S6] |
| **Modern PDP best practice / Traditional Medicinals** | PDP spine: zoomable hero + on-model + flat-lay, expandable detail/shipping/reviews sections, variant/multipack selector, integrated subscription toggle, inline reviews, prominent Add-to-Cart. TM bundles "single / 3-pack / 6-pack" + auto-delivery at 1/2/3/6-month intervals right in the buy box. | **Table-stakes** — this is the PDP spine, and PDP is where the sale is made or lost (§4). | [S7, S6] |
| **Traditional Medicinals / Organic India / Full Leaf** | Subscribe-and-save with flexible cadence and a clear discount. Organic India UK: "10% discount when customers subscribe." Full Leaf: subscriptions are "15%–20% of revenue." | **Table-stakes** for a wellness-tea brand chasing repeat purchase — materially drives revenue, not a nice-to-have. | [S6, S8, S9] |
| **Vahdam / Organic India / Art of Tea / Kama Ayurveda** | Tiered, price-banded gift sets + samplers — curated boxes, not "add products to cart." Vahdam "Under $30 Kits" + "Luxury Tea Gifts"; Organic India "Tulsi Tea Gift Box" (60 bags, 6 flavors); Kama Ayurveda "curated gift sets… handcrafted boxes" + corporate-gifting lane. | **Table-stakes** for a gifting-led entrant; samplers double as low-risk acquisition. | [S10, S11] |
| **Pukka (Alokai rebuild)** | Mobile-first performance as a conversion floor — rebuilt on Alokai+Shopify+Contentful to lift mobile revenue, hit "94% Lighthouse performance." Mobile is ~78% of ecommerce traffic / 66% of orders; 53% abandon slow pages. | **Table-stakes** — CTAs in the thumb zone, filters mid-screen. (Maps to our A5 Lighthouse ≥90 + ENGINEERING_STANDARDS.) | [S12] |
| **Traditional Medicinals** | Certifications rendered as visible trust badges — "USDA Organic, Fair Trade, FairWild, Fair for Life, B Corp… Certified for People, Plants & Planet." | **Table-stakes** for premium/ethical positioning — show organic/GMP/heritage certs as badges, not buried prose. | [S6] |
| **Teabox** | Named founder-origin narrative + supply-chain-impact number — founder Kausshal Dugarr ("I wasn't mad at Tea, just disappointed" video), "impacting 3.5M Indian tea pluckers." | **Edge** — a 1908 heritage line differentiates ONLY if told as a specific, human, sourcing-anchored story, not a date. | [S13] |
| **Teabox / Vahdam** | Freshness/provenance as a concrete, checkable technical claim — "India's first dehumidified facility with cold storage," vacuum-packing, merchandised by flush season + single region; Vahdam "Single Estate collections… freshest ingredients directly from source in India." | **Edge** — specific provenance out-differentiates vague "premium." | [S13, S4] |
| **Traditional Medicinals / Simple Loose Leaf** | Guided "find-your-tea" quiz — TM's "There's a Tea for That Quiz"; SLL builds a "Tea Profile" to personalize. | **Edge** — a quiz reduces choice paralysis for a benefit-led range and captures email/personalization data most small entrants skip. | [S6, S14] |
| **Art of Tea** | Enterprise/luxury client wall ("Proudly Serving" Disney, Google, The Venetian, Caesars) + Forbes/Bon Appétit quotes + "top 2% of all teas produced." | **Edge** — borrowed B2B-hospitality authority justifies a premium price to gifting buyers. | [S5] |
| **Traditional Medicinals / Adagio** | Editorial/education hub ("Plant Wisdom Collective," herbalist branding, tasting notes, brewing guides) — supports SEO ranking and premium framing simultaneously. | **Edge** — long-form ingredient/ritual content is how these brands rank informational queries and deepen perceived expertise (→ §3). | [S6] |
| **COMPLIANCE — Traditional Medicinals (as the safe model)** | Hedged structure/function verbs ("supports," "promotes," "helps," "relieves") + qualifiers ("occasional," "healthy") + the mandatory disclaimer. | **Table-stakes guardrail** — disease/cure claims are a legal red line in India, US and EU. Note: CLAUDE.md's banned word "cure" already aligns. Full law in §5. | [S15] |

---

## 2 · What kairalitea.com MUST have day one

### 2.1 Homepage sections (in order)
1. **Header** — visible global nav (no hamburger-hidden desktop nav — DESIGN_DOCTRINE §1.2), dual taxonomy entry (by **type** and by **benefit/ritual**), locale/currency where applicable, free-shipping-threshold bar [S5, S12].
2. **Hero** — a single art-directed visual statement (the 50ms first impression, DESIGN_DOCTRINE §2.1 #5), real product photography from the library (see §6), one primary CTA. Poster-first LCP, no autoplay-with-sound (DESIGN_DOCTRINE §1.4, §1.6).
3. **Social-proof strip** — aggregate review count + rating + ≥1 authority/press or certification badge, above the fold [S4]. Only genuine numbers (CLAUDE.md rule 6 — never invent counts; fake counts are a hard-gate violation, DESIGN_DOCTRINE §1.7).
4. **Shop-by-benefit / shop-by-ritual grid** — Calm & Sleep · Digestion · Immunity · Energy, mirroring the time-of-day ritual scaffold (§3) [S5, S6].
5. **Heritage story block** — 1908 Kerala origin told as a specific, human, sourcing-anchored narrative, not a date [S13].
6. **Gift collections entry** — price-banded (sampler <$30 · starter $30–75 · premium single-origin $100–150) [S10, S16].
7. **Certification/trust badges row** — organic/GMP/heritage as visible badges [S6].
8. **Editorial/education teasers** — links into the content hub (§3) [S6].

### 2.2 Product-page pattern (the conversion centerpiece — §4)
Zoomable hero + flat-lay + on-model imagery · **star rating adjacent to the title, above the fold** [S17] · sensory description (aroma, taste, brewing ritual) + heritage/origin + sourcing proof · variant/multipack selector · **subscribe-and-save toggle in the buy box** (1/2/3/6-month) [S6] · expandable ingredients / brewing / net weight / caffeine level / shipping sections [S7, S16] · **gift toggle surfaced ON the PDP** (message, hidden-price receipt, gift wrap) [S18] · inline verified reviews · complete Product + Review + Breadcrumb schema (§3).

### 2.3 Gifting (a differentiation opportunity, not an afterthought)
46% of sites don't allow gift orders at all; 80% fail to show gifting options on the product page [S18]. Day one: curated price-banded gift sets + samplers [S10], a **gift buyer's guide** segmented by budget/persona with net weight, brewing guidance, caffeine level, gift-note and eco-packaging cues buyers expect [S16], gift message + hidden-price gift receipt + gift wrap, default "ship to recipient" for gift-marked orders [S18].

### 2.4 Trust
3–4 trust signals max per location (more looks cluttered) [S19]: secure-checkout/SSL + payment marks + free-shipping badge + easy-returns/satisfaction at the payment step and PDP; certification badges (organic/GMP/heritage) [S6]; genuine review counts + ≥1 press/authority badge [S4]. 61% won't complete a purchase without visible security indicators [S19].

### 2.5 Mobile
Mobile-first is a conversion floor (~78% of traffic, ~80% cart abandonment on mobile) [S12, S20]. Thumb-zone CTAs, filters mid-screen, poster-first hero, ≤130 KB first-load JS and Lighthouse ≥90 per ENGINEERING_STANDARDS / Ship Gate A5. Never a fourth floating overlay — the known stack (consent + chat + sticky CTA) is already three (DESIGN_DOCTRINE §1.4).

---

## 3 · SEO / AEO content plan

### 3.1 Keyword themes (benefit + ailment is the highest-intent cluster)
Demand clusters around **benefit + concern** queries — "tulsi tea benefits," "ayurvedic tea for digestion / immunity / stress / sleep." **Tulsi is the anchor entity** (framed in Ayurveda as an adaptogen, "Queen of Herbs," tied to stress/cortisol, immunity, digestion) [S21]. Ranking listicles are structured explicitly by "Digestion, Immunity, and Stress Relief" — concern-based clustering is the dominant rank-winning structure [S22]. **Own one benefit/education page per hero herb-concern pair** (tulsi→calm/immunity, ashwagandha→sleep/calm, turmeric-ginger→digestion, chamomile→sleep). NOTE: benefit copy is claim-gated — see §5; use supportive/heritage framing, never the disease verbs the ranking sources themselves use.

### 3.2 The "ritual by time-of-day" framing (maps 1:1 to collections)
A distinct high-conversion pattern: morning tulsi-turmeric, post-lunch digestive, evening stress/sleep — "to support the body's natural rhythms" [S23]. Mirror as collections + guide content, internally linked from benefit pages to product pages.

### 3.3 Content pieces to ship day one
1. **Benefit/education page per hero herb-concern pair** — answer-capsule intro under a question-form H2 + FAQPage schema [S24, S25].
2. **Time-of-day ritual guide** linking to collections [S23].
3. **3–5 recipe / how-to-brew pages** — golden milk / haldi doodh / turmeric latte, moon milk, "how to brew tulsi" — sustained-volume SERP with native India-heritage authenticity; the legitimate home for **Recipe** schema [S26].
4. **Gift collections + gift buyer's guide** segmented by price/persona [S16].
5. **Product pages** with complete Product + Review schema, brewing instructions, net weight, caffeine level, ingredients/origin [S7].
6. **On-site review-collection mechanism** feeding aggregateRating (only mark up reviews that genuinely exist) [S24].
7. **"Last Updated" timestamps** for freshness [S27].

### 3.4 Schema stack (day one)
**Product** (offers/price/availability + aggregateRating/Review), **FAQPage**, **Recipe** (brewing/latte guides only), **BreadcrumbList**, **Organization/Brand** — all JSON-LD (Google-preferred). Review-enriched Product markup is the CTR driver ("+30% or more"); FAQ improves entity relationships and indexing — but only mark up genuinely relevant, genuinely present data [S24]. (No fabricated ratings — CLAUDE.md rule 6.)

### 3.5 AEO — win organic first, then structure for extraction
~60% of searches now end without a click and AI Overviews cover 30%+ of queries — but **SEO is the prerequisite: 99% of AI-Overview citations come from pages already in the organic top 10, and 87% of ChatGPT citations match top Bing results** [S25]. Practical rule: a concise, self-contained **answer capsule** under each question-form H2. Separately, **90–95% of AI citations come from EXTERNAL sources** (review sites, Reddit/Quora, buyer-guide listicles, PR) — Perplexity leans on Reddit/Quora and is the one engine giving trackable referral traffic [S28]. So day-one plan needs a user-language FAQ/Q&A surface **plus** an off-site presence strategy. AI weights **consensus across independent sources** — keep brand facts consistent across owned + earned surfaces [S29].

---

## 4 · Conversion levers to build in (mapped to our packages)

The PDP is where the decision is made and where most sites fail (52% desktop / 62% mobile / 64% app have mediocre-or-worse PDP UX) [S30]. Every lever below maps to an existing Factory package — **no cart/checkout is ever built here; checkout is the main Shopify store** (CLAUDE.md Factory Rules).

| Lever | Evidence | Our package / hook |
|---|---|---|
| Product cards → Shopify Storefront API; PDP with variant/multipack + subscribe-and-save toggle. | PDP spine + subscription revenue [S7, S6, S8] | `packages/product-card` (Shopify Storefront API). NEVER a cart/checkout — hand off to Shopify. |
| Lead with star ratings + verified reviews high on the PDP (aggregate rating adjacent to title). | Top-of-page reviews lift conversion up to ~18%; social-proof-first 11–14% higher [S17] | Review widget feeding aggregateRating (§3.4); genuine data only. |
| Surface total landed cost + free-shipping-threshold badge early; guest path, short form. | 48% abandon on unexpected costs; ~30% on forced accounts; mobile abandonment ~80% [S20] | Free-shipping bar (§2.1); Factory never forces accounts (DESIGN_DOCTRINE §1.5) — Shop Pay/express wallets on Shopify. |
| Gift toggle ON the PDP + message + hidden-price receipt + gift wrap. | 80% of sites hide gifting on PDP; 0% adjust shipping labels for gifts [S18] | PDP gift module (§2.3) — a differentiation opportunity. |
| Subscribe-and-save with skip/pause; front-load onboarding (brewing guides, welcome). | Replenishables churn 4–7%/mo; but 60–70% lost between orders 1–3, ~44% cancel in first 90 days [S31] | `packages/product-card` subscription toggle + editorial hub (§3) as onboarding value. |
| Samplers + mix-and-match bundles as the entry offer and AOV lever ("lead with savings"). | Bundling lifts AOV 15–25%; variety pack 31% take rate; keep variety count low [S32] | Bundle collections; never force-bundle. |
| 3–4 trust badges at PDP + payment step (secure-checkout, payment marks, free-shipping, returns). | Security badges +up to 32%; 61% won't buy without them; cap at 3–4 [S19] | Trust-badge row (§2.4); consent handled by our consent component (below). |
| **Consent** — cookie/consent banner, privacy link, most-private default. | DESIGN_DOCTRINE §1.4 overlay stack; safety rule (decline non-essential by default) | Factory consent banner (Ship Gate A12); reserve layout space to avoid CLS. |
| **Analytics** — `data-cta` events on every primary control, ≥44px touch targets. | CTA clarity + touch-target law | `data-cta` instrumentation (Ship Gate A4 / factory-site.spec.ts asserts ≥44px + data-cta). |
| **Forms** — labels always visible above fields, correct mobile keyboards, no forced accounts. | Placeholder-only labels harmful; wrong keyboards on ~60% of sites [DESIGN_DOCTRINE §1.5] | `packages/forms` (newsletter, gift-guide capture, quiz email); guest-only. |
| Guided "find-your-tea" quiz → recommendation + email capture. | Reduces choice paralysis; feeds personalization [S6, S14] | Quiz component → `packages/forms` capture + `data-cta`. |

---

## 5 · CLAIMS GUARDRAILS — safe vs banned phrasing (this is copy law for the site)

**Register:** KAPPL / product-pharma. The **KTAHV clinical lock does NOT apply here** (CLAUDE.md: it applies to KTAHV pages ONLY, do not cross-apply). But a *different*, stricter set of health-claim rules governs product copy — sensory/heritage/gifting language is fully allowed; **efficacy/disease language is where all four regimes bite.** The one word both locks share is **"cure"** — banned here too.

### 5.A Consolidated safe-copy doctrine (gates ALL copy, all locales incl. DE/FR equivalents)
1. **Never name a disease** anywhere near the product, in any language [S33, S34, S37].
2. **Never use these verbs:** cures · treats · heals · prevents · fights · remedies · detoxifies-to-cure · "boosts immunity against [X]." Also banned: "clinically proven to cure," "better than allopathic," "guaranteed results in X days" [S33, S38].
3. **Prefer heritage + sensory + lifestyle + gifting register** — fully allowed and matches the premium brand: "a warming ritual," "a thoughtful gift," "aromatic," "hand-blended in Kerala," "caffeine-free," "part of a mindful evening" [S37].
4. **"Supports / helps maintain normal…"** structure/function verbs are the ONLY health-adjacent phrasing that is even *conditionally* safe — and only in the US context, with substantiation. **Safest is to omit entirely** and lead with taste, aroma, ritual, and 1908 heritage [S35, S36].
5. **Regulated product NAME** = "herbal infusion / botanical blend" for tea-less SKUs per FSSAI (§0.1) [S3].

### 5.B By regime (why the doctrine exists)
- **India — DMR Act, 1954 (highest risk, CRIMINAL).** Advertising a product as treating/curing a scheduled disease is a criminal offence; 2020 penalties up to 2 yrs + ₹10 lakh (first), 5 yrs + ₹50 lakh (repeat). Patanjali was held in contempt (Feb 2024) for diabetes/cancer/COVID cure claims, and liability was extended to **e-commerce platforms** hosting the ads (May 2024) — so both the brand AND the Shopify storefront/ad channels carry exposure [S33, S34]. Also banned: implying "magic"/miraculous/guaranteed results.
- **India — FSSAI food-claims (FSS Advertising & Claims Regs 2018).** A herbal tea sold as a beverage is FOOD: "No claims shall be made which refer to… prevention, alleviation, treatment or cure of a disease… unless specifically permitted." BANNED: "prevents cold & flu," "treats indigestion," "lowers cholesterol," "relieves acidity/IBS." SAFE: "caffeine-free herbal infusion," "a warming blend to enjoy after a meal," "contains tulsi and ginger" [S39].
- **India — FSSAI "tea" naming (Dec 2025).** §0.1 — tea-less SKUs = "herbal infusion." Audit every Shopify title [S1, S2, S3].
- **India — ASCI.** ~8,000 ads scrutinised Apr-23→Mar-24, 98% needed modification, 85% digital. Brief every influencer/affiliate to avoid therapeutic language and disclose #ad; health claims require the promoter's relevant qualifications [S40].
- **US — FDA.** Disease claims = illegal drug claims; structure/function claims permitted if truthful/substantiated (+ DSHEA disclaimer for a supplement). Safest for a conventional beverage: market as an enjoyable food, no supplement disclaimer, no overt S/F claims. FDA reads context (product name, metatags, testimonials, imagery) as part of the claim. BANNED: "treats anxiety," "prevents the common cold," "anti-inflammatory for arthritis." SAFE: "supports relaxation," "promotes a sense of calm," "for general wellbeing" [S35].
- **US — FTC.** Every objective health claim needs "competent and reliable scientific evidence" — generally RCTs on the product/ingredient; "traditional Ayurvedic use" alone does NOT substantiate a present-day benefit claim. Keep traditional-context language descriptive/cultural ("used in Ayurveda for centuries as…") framed as heritage, not proven benefit [S36].
- **EU — strictest (if shipping to EU).** Under Reg. (EC) 1924/2006 a health claim is legal ONLY if on the authorised positive list; most botanical claims are stuck "on hold." The CJEU (30 Apr 2025) ruled advertising foods with botanicals via health claims is NOT permitted until authorised. Disease prevention/treatment on food is separately, absolutely banned. SAFE for EU: sensory/heritage/lifestyle only ("a soothing ritual," "aromatic blend of tulsi and cardamom," "crafted in Kerala since 1908"), NO health/function claim. Run separate EU-compliant copy if selling there [S37].

> **Enforcement hook:** route any proposed benefit claim to Abilash/legal before publish (CLAUDE.md ESCALATION). Product titles, descriptions AND ad creatives are all in scope, not just the label.

---

## 6 · Design direction hypotheses — the expressive register

Authority: `docs/design/DESIGN_DOCTRINE.md` + `packages/ui/brand-tokens.css` (the brand manual wins; design skills/plugins NEVER override tokens — CLAUDE.md Knowledge Doctrine (d)). KAPPL/product is an **expressive** register — warmer and more sensory than the KTAHV clinical register, but bound by the same doctrine (no carousels/auto-rotation, visible nav, no dark patterns, one-accent-per-view, real photography).

- **H1 — Photography carries the whole mood; use the real library, never stock.** Real, art-directed product photography is DESIGN_DOCTRINE §2.1's #1 lever (users ignore stock, scrutinise real photos). The library holds **111 tea images** (`docs/media/IMAGE_CATALOG.csv`) — `single_product`, `product`, `therapy-prep` categories, e.g. `kairali-taahira-ayurvedic-herbal-tea-01..08`, `kairali-group-herbal-tea-combo-01..03`, `kairali-group-tea-combo-box-01`. Flat-lay + steam/steeping + on-model gifting hero shots. Use `register_ok`/`quality` columns to filter; only KAPPL-register images (never KTAHV clinical/people photos cross-applied).
- **H2 — Restrained near-monochrome + ONE accent (60/30/10), accent reserved for the primary CTA.** Ground on `--ivory` (#F7F4EA); `--forest-500` (#006038) as the interactive/action color; `--marigold-400` (#EEB41E) as the single accent moment per view — **never body text** (brand tokens ch.10 usage law; A4 lint fails marigold body text). `--bronze-400` for taglines/overlines suits the heritage voice.
- **H3 — Typographic discipline signals "designed, not default."** Three-font hierarchy from tokens: **Kurale** display (h1–h3, ALWAYS weight 400, never bold) for the heritage/ritual voice · **Asap** body/UI · **Lato** captions/overlines/numerals. `--measure-prose: 720px`, 4px rhythm, pill action buttons (`--radius-pill`). No per-step modular scale token yet (brand-tokens TODO) — B-14 probes manually.
- **H4 — Tea/gifting/ritual mood via warmth + calm, not motion gimmicks.** Warm white cards on ivory, warm shadow (brand tokens ch.07). Motion is purposeful feedback only — `--dur-fast 150ms`/`--dur-slow 400ms`, `--ease-brand` ease-out, "NOTHING bounces," hover deepens one ramp step (never lifts). No auto-rotating carousels, no scrolljacking (DESIGN_DOCTRINE §1.1). The ritual/gifting feeling comes from photography + copy + pacing, not animation.
- **H5 — Perceived performance IS the premium signal.** Hero `fetchpriority="high"`, never lazy, explicit dimensions, poster-first video; LCP <2.5s, CLS ~0, INP <200ms; only ~42% of sites pass all three — passing is the differentiator (DESIGN_DOCTRINE §2.1 #4; Ship Gate A5). The 50ms first impression is scored by the B-14 design-critic gate.

---

## 7 · Design decisions this unlocks

1. **Dual-axis IA is locked in as a build requirement, not an option** — navigation and the homepage grid must expose BOTH shop-by-type and shop-by-benefit/ritual (Calm & Sleep · Digestion · Immunity · Energy), because that IS the rank-winning content structure (§3) and the standard wellness-buyer path (§1). This determines the collection taxonomy on Shopify.
2. **The PDP is designed as the conversion centerpiece** — buy box carries rating-adjacent-to-title, subscribe-and-save toggle, multipack selector, AND a gift toggle in the first viewport; sensory + heritage + sourcing copy below. This is a `packages/product-card` spec, and gifting-on-PDP is our deliberate differentiator (§2.3, §4).
3. **Copy is written in sensory/heritage/gifting register from the first word** — the §5 doctrine (no disease names, no cure/treat/prevent verbs, "herbal infusion" for tea-less SKUs) is a compliance-lint candidate and a hard pre-publish gate; benefit pages lead with ritual and aroma, never efficacy. This shapes every content template and the Shopify SKU titles.
4. **Design system = ivory ground + forest interactive + single marigold accent, three-font Kurale/Asap/Lato hierarchy, real library photography** — no new palette, no stock imagery, no motion gimmicks; the expressive warmth comes from the 111 real tea photos, pacing, and copy (§6). This is the visual spec the design-critic B-14 gate scores against.
5. **Two items ship to Abilash/legal BEFORE design proceeds** — (a) the FSSAI "tea" naming exposure on the domain/SKU titles, and (b) sign-off on the claims-guardrail doctrine as binding copy law. Per CLAUDE.md ESCALATION, a blocked task with these questions beats a wrong build; append to QUESTIONS.md if unattended.

---

## Source index

- S1 — No more 'herbal tea': FSSAI warns brands — Storyboard18: https://www.storyboard18.com/advertising/no-more-herbal-tea-fssai-warns-brands-against-misleading-beverage-names-86575.htm
- S2 — FSSAI cracks down on tealess herbal 'tea' — The South First: https://thesouthfirst.com/health/fssai-cracks-down-on-tealess-herbal-tea-warns-against-misleading-labels/
- S3 — Is Your 'Herbal Tea' Legally 'Tea'? (Dec 2025 advisory) — S.S. Rana & Co.: https://ssrana.in/articles/is-your-herbal-tea-legally-tea-fssai-issues-clarification/
- S4 — VAHDAM USA homepage: https://www.vahdam.com/
- S5 — Art of Tea homepage: https://www.artoftea.com/
- S6 — Traditional Medicinals homepage: https://www.traditionalmedicinals.com/
- S7 — Ecommerce PDP best practices — Mobiloud: https://www.mobiloud.com/blog/ecommerce-product-detail-page-best-practices
- S8 — Organic India UK (subscription discount): https://organic-india.co.uk/
- S9 — Full Leaf Tea Company 10 years ecommerce — Digital Commerce 360: https://www.digitalcommerce360.com/2025/04/18/full-leaf-tea-company-10-years-ecommerce/
- S10 — VAHDAM Tea Gift Sets collection: https://www.vahdam.com/collections/gifts
- S11 — Kama Ayurveda gifting: https://www.kamaayurveda.in/gifting.html
- S12 — Pukka Herbs — Alokai case study: https://alokai.com/case-studies/pukka-herbs
- S13 — Teabox homepage: https://www.teabox.com/
- S14 — Simple Loose Leaf subscription: https://simplelooseleaf.com/pages/loose-leaf-tea-samples-subscription
- S15 — How FDA and FTC regulate Ayurveda products — Nutritional Outlook: https://www.nutritionaloutlook.com/view/how-do-fda-and-ftc-regulate-ayurveda-products
- S16 — Best Tea Gift Sets for Wellness Enthusiasts — One With Tea: https://onewithtea.com/blogs/news/best-tea-gift-sets-for-wellness-enthusiasts
- S17 — Social Proof Conversion Stats 2026 — Genesys Growth: https://genesysgrowth.com/blog/social-proof-conversion-stats-for-marketing-leaders
- S18 — 4 Gifting UX Best Practices — Baymard: https://baymard.com/blog/gifting-flow
- S19 — 5 Types of Trust Badges — Shopify: https://www.shopify.com/blog/trust-badges
- S20 — Reasons for Cart Abandonment — Baymard: https://baymard.com/blog/ecommerce-checkout-usability-report-and-benchmark
- S21 — Tulsi Tea Benefits — Maharishi Ayurveda India: https://maharishiayurvedaindia.com/blogs/wellness-need/tulsi-tea-benefits-ayurveda
- S22 — Best Ayurvedic Teas for Digestion, Immunity, Stress — Livisca: https://livisca.in/best-ayurvedic-teas-for-digestion-immunity-and-stress-relief/
- S23 — Ayurvedic Herbal Teas for Digestion and Immunity — Swasthyam Ayurved Clinic: https://swasthyamayurvedclinic.com/ayurvedic-herbal-teas-for-better-digestion-and-immunity/
- S24 — E-commerce Schema Markup & Rich Results — Hashmeta: https://hashmeta.com/ecommerce-seo-guide/e-commerce-schema-markup-rich-results/
- S25 — What is Answer Engine Optimization — Frase.io: https://www.frase.io/blog/what-is-answer-engine-optimization-the-complete-guide-to-getting-cited-by-ai
- S26 — Authentic Golden Milk (Turmeric Milk Tea) — Tea for Turmeric: https://www.teaforturmeric.com/authentic-turmeric-milk/
- S27 — Answer Engine Optimization — The HOTH: https://www.thehoth.com/blog/answer-engine-optimization/
- S28 — How to Get Cited by ChatGPT, Perplexity, AI Overviews 2026 — Authority Tech: https://authoritytech.io/blog/how-to-get-cited-by-chatgpt-perplexity-ai-overview-2026
- S29 — Where AI Answer Engines Get Their Citations — Megrisoft: https://www.megrisoft.com/blog/artificial-intelligence/ai-answer-engines-citations-answer-engine-optimization
- S30 — Product Page UX Best Practices — Baymard: https://baymard.com/blog/current-state-ecommerce-product-page-ux
- S31 — DTC F&B Marketing Benchmarks 2026 — Foundry CRO: https://foundrycro.com/blog/dtc-food-beverage-marketing-benchmarks-2026/
- S32 — Physical Product Bundling Statistics — Swell: https://www.swell.is/content/physical-product-bundling-statistics
- S33 — Drugs and Magic Remedies (Objectionable Advertisements) Act, 1954: https://www.indiacode.nic.in/bitstream/123456789/1412/1/195421.pdf
- S34 — India's Ad Law Wrap 2024 (Patanjali contempt) — Lexology: https://www.lexology.com/library/detail.aspx?g=9183e709-eaa9-48dc-a0c0-1aa12d7c4a85
- S35 — Structure/Function Claims — US FDA: https://www.fda.gov/food/nutrition-food-labeling-and-critical-foods/structurefunction-claims
- S36 — Health Products Compliance Guidance (Dec 2022) — US FTC: https://www.ftc.gov/business-guidance/resources/health-products-compliance-guidance
- S37 — CJEU clarifies health claims on botanicals (30 Apr 2025) — Food Compliance International: https://foodcomplianceinternational.com/industry-insight/news/5368-the-cjeu-clarifies-use-of-health-claims-on-botanicals
- S38 — How to Market an Ayurveda Brand in India (AYUSH-Compliant) — Ichelon Consulting: https://ichelonconsulting.com/insights/ayurveda-marketing-india-ayush-compliant-guide
- S39 — FSS (Advertising and Claims) Regulations 2018 — Compendium (FSSAI): https://fssai.gov.in/upload/uploadfiles/files/Compendium_Advertising_Claims_Regulations_04_03_2021.pdf
- S40 — ASCI Updates Influencer Guidelines for Health Sector — LexOrbis: https://www.lexorbis.com/asci-updates-influencer-guidelines-for-health-and-finance-sectors-strikes-balance-between-expertise-and-expression/
- S41 — FDA Signals Flexibility on DSHEA Disclaimer Placement — Epstein Becker Green: https://www.healthlawadvisor.com/fda-signals-flexibility-on-placement-of-the-dshea-disclaimer

*Additional consulted sources (competitor/UX corpus): Organic India USA · Pukka Story · Ecommerce CRO 2025 (Empathy First) · DTC Retention Benchmarks (Taylor Sicard) · Shopify Ecommerce Schema · Shopify Product Bundling · Baymard Product-Page research · 1800DTC gifting-PDP · FDA Label Claims · Covington FTC guidance · Nutraceuticals World / King & Spalding (EU botanicals) · NutraIngredients AYUSH nutraceutical · PMC Ayurvedic-drugs DMR review · Convertibles homepage patterns · Mondaq / Hans India / Food Compliance Intl FSSAI 'tea' — full URLs in the research JSON backing this brief.*
