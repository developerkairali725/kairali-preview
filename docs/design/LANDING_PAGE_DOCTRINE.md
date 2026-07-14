# LANDING_PAGE_DOCTRINE.md — Paid Landing Page Doctrine (Kairali Web Factory)

> **STATUS: DRAFT v0.9 — PENDING ABILASH SIGN-OFF. DO NOT SHIP ANY LP AGAINST THIS DOCUMENT YET.**
>
> Abilash rules on LP strategy. His 14 Jul 2026 directive: **LP style changes with ROI, aim, messaging, platform, and market-of-awareness (MOA) — an LP is never the same as an organic page.** This doctrine is the evidence base for a brainstorm with him; every rule below is provisional until he approves, amends, or strikes it. Open questions for that session are collected in §8.
>
> Drafted: 2026-07-14 19:45:42 IST. Every claim cites its source inline; nothing here is invented.

---

## 1. LP vs organic page — the structural law

An organic page and a paid landing page are different species with opposite jobs. The organic page needs navigation, internal links, and topical breadth to rank; the paid LP needs the opposite.

**Message match is the foundational paid-LP law.** The LP headline must repeat the phrasing of the ad/keyword that produced the click, measured per-campaign, not per-site. Unbounce defines message match as "how well your landing page copy matches the phrasing of the ad or link that brought the visitor there," and quotes Oli Gardner: "If your ad copy doesn't match the message on your landing page, you're disrespecting the click." Strong match reassures visitors they've arrived at the right place; weak match raises bounce and kills Quality Score. ([Unbounce — message match](https://unbounce.com/conversion-glossary/definition/message-match/))

**Per-campaign variants pay measurably.** The Instapage platform doctrine is one matched page per ad group (its AdMap product links each paid ad group to its matching page for "perfect message continuity"); an Instapage PPC case study reports a **254% conversion lift** from keyword message-matched pages. Dynamic Text Replacement automates swapping the H1 to the triggering keyword; practitioners report 10–20% lifts from DTR alone. ([Instapage — personalization](https://instapage.com/blog/personalization))

**Attention ratio approaches 1:1.** One page, one campaign goal, no header nav, no footer link farm, no leaks back into the organic site. Unbounce's Conversion-Centered Design principles define attention ratio as links-on-page : conversion goals, target 1:1. Case data behind nav removal: VWO cut attention ratio from 13:1 to 3:1 and conversions rose 100%; Career Point College +336% after removing top nav; SparkPage went 9.2% → 17.6% during a nav-removal test. ([Unbounce — Conversion-Centered Design](https://unbounce.com/conversion-centered-design/))

**Single CTA outconverts multi-link in aggregate.** Pages with a single CTA convert ~13.5% on average vs ~10.5% for pages with 5+ links; Unbounce's Q4 2024 benchmark across 41,000 pages puts the median LP conversion rate at 6.6%. KlientBoost's best-practices list makes single-offer/single-CTA its structural core. ([KlientBoost — LP best practices](https://www.klientboost.com/landing-pages/landing-page-best-practices/))

**Doctrine (draft):** No Kairali paid LP carries the site header, footer link block, or any link that is not the campaign CTA (legal/privacy links excepted — see §5). Each ad group gets its own message-matched variant, not a shared generic page.

## 2. Per-platform templates

Google's own Quality Score doc names exactly three components — expected CTR, ad relevance, and **landing page experience** ("how relevant and useful your landing page is to people who click your ad") — each rated Above average / Average / Below average by "comparison with other advertisers whose ads showed for the exact same search over the last 90 days." LPX criteria include relevance to keyword/ad, load speed, mobile usability, transparency and navigability; higher QS yields materially lower CPC for the same position. ([Google Ads — About Quality Score](https://support.google.com/google-ads/answer/6167118?hl=en)) The platform therefore dictates the template:

### 2a. Google Search LP (high intent, warm-to-hot)
- Short, offer-led. The searcher did the research; the page confirms and converts.
- Headline = the keyword phrasing (message match, §1). ([Unbounce](https://unbounce.com/conversion-glossary/definition/message-match/))
- Graded comparatively against competitors on the same query — LPX is a per-query contest, not an absolute bar. ([Google Ads QS doc](https://support.google.com/google-ads/answer/6167118?hl=en))

### 2b. Meta / paid-social LP (cold, interruption-based)
- Longer persuasion architecture — "a mini-sales page." Cold Meta traffic "doesn't know you, doesn't trust you, and didn't ask for you"; the page must do the research/validation work Google searchers did themselves. Structure: problem agitation → education → social-proof blocks → objection handling, with **3–4 proof touchpoints spread throughout the scroll, proof arriving before the form, not after**. ([Apexure — Meta vs Google LPs](https://www.apexure.com/blog/meta-ads-vs-google-ads-landing-pages))

### 2c. Remarketing LP (warm, returning)
- A third distinct species — never the cold-traffic page. Serving the cold-visitor page to a cart/enquiry abandoner "tanks performance at both ends." Product/programme viewers get objection-handling (logistics, guarantees, comparisons); abandoners get urgency + friction removal; form fields drop to ~3–4 where cold required 8. KlientBoost documents segment-specific creative and LP sequencing for high-ROAS remarketing. ([KlientBoost — retargeting](https://www.klientboost.com/ppc/retargeting/))
- **KTAHV constraint:** remarketing segments must be built on non-sensitive signals only — see §5.

## 3. Awareness-stage messaging matrix

Eugene Schwartz's five stages (Breakthrough Advertising, 1966) — Unaware → Problem Aware → Solution Aware → Product Aware → Most Aware — are the standard MOA framework in LP copywriting: "to sell a product to a prospect, you need to meet them at their level of awareness"; "page length … is dictated by the level of awareness your prospect has when they arrive." Unbounce Academy teaches the same buyer-journey/information-hierarchy mapping. ([Unbounce Academy — buyer journey & information hierarchy](https://workshops.unbounce.com/lesson/3-buyer-journey-information-hierarchy/))

| Traffic source | Typical awareness stage | LP length & lead |
|---|---|---|
| Google high-intent search | Solution/Product aware | Short, offer-led |
| Meta prospecting | Problem aware | Long, education-led (§2b) |
| Remarketing | Product/Most aware | Short, offer + objection (§2c) |

(Mapping per the same source's practical guidance for paid traffic.)

**Draft entity note (for the brainstorm):** the same programme can sit at different stages per market — e.g. Panchakarma is likely Product-aware for DE repeat-cure-seeker traffic and Problem-aware for a US cold audience. Which programme × market × stage combinations we buy is Abilash's call (§8).

## 4. Forms & WhatsApp-first CTA law

**Field minimization.** Baymard's checkout research: "as the number of form fields increase, the overall checkout UX performance decreases"; what matters is fields users must *consider*, not step count; average e-commerce checkout has 11.3 form elements, optimal 7–8, with completion dropping 4–6% per field beyond the eighth; ~26% of users abandon flows that feel too long/complex. Directly transferable to lead-gen: every field must earn its place. ([Baymard — form fields](https://baymard.com/blog/checkout-flow-average-form-fields))

**Multi-step for high-commitment asks.** 2024–25 comparative data: multi-step forms average ~13.85% conversion vs ~4.53% single-page (~86% relative lift claim); BrokerNotes (B2C financial lead gen) went 11% → 46% after switching to multi-step — start with low-friction questions, ask for contact details last. Counter-evidence in the same literature: for simple quick actions multi-step adds exit points (mobile completion lags desktop by ~8pp); success depends on progress bars, auto-save, and mobile fluidity. **So:** multi-step fits consultation/programme-qualification asks; single-step fits simple asks. ([Numinam — multi-step vs single-page 2026 guide](https://www.numinam.com/en/blog/multi-step-vs-single-page-forms-which-really-generates-more-leads-complete-guide-2026))

**India-geo: WhatsApp-first.** In WhatsApp-default markets (India, UAE, Brazil, Indonesia, Mexico) click-to-WhatsApp ads "consistently delivered 3-5x lower cost per lead compared to traditional lead generation forms," and CTWA funnels outperform LP funnels 2–3x on conversion by removing read-scroll-judge-form-wait friction; healthcare appointment booking and education are named top CTWA verticals. **Draft rule:** India-geo LPs lead with a WhatsApp CTA (form secondary); EU/US LPs lead with form/email. ([Spur — CTWA guide](https://www.spurnow.com/en/blogs/click-to-whatsapp-ads))
- KTAHV WhatsApp number is the locked fact: **+91 92898 38797** (Priya). Any …38777 occurrence is wrong — fix on sight (CLAUDE_FLEET.md Locked Facts).

**Satyam CRM spec (per the task brief handed to this draft — verify with Abilash/Satyam before build):** every LP lead capture is **store-first into our own DB** (the lead lands in the CRM before/regardless of any third-party handoff), and consent is a **boolean field** on the record — the LP consent checkbox writes it explicitly; no implied consent.

## 5. Compliance guardrails for Ayurveda ads

These bind the copy on every Kairali LP, and they bite hardest on KTAHV.

- **Google Healthcare and medicines policy** prohibits marketing "non-government approved products … in a way that implies that they're safe or effective for use in preventing, curing, or treating a particular disease," bans "promotion of speculative and/or experimental medical treatments," and restricts "herbal and dietary supplements with active pharmaceutical or dangerous ingredients." Certification is required for prescription-drug services, pharma manufacturers, addiction services, etc. **Policy scope explicitly covers landing pages, not just ad text.** ([Google Ads policy — Healthcare and medicines](https://support.google.com/adspolicy/answer/176031?hl=en))
- **Google health-personalization policy** disallows remarketing/audience targeting based on medical conditions, diseases, mental-health issues, or treatments; custom segments using sensitive assets or pointing to sensitive LPs serve only contextually/non-sensitively on Display. **So KTAHV remarketing segments are built on non-sensitive signals (page visits, brand engagement) — never condition interest.** ([Google Ads policy — Health in personalized advertising](https://support.google.com/adspolicy/answer/16701855?hl=en))
- **India — Drugs and Magic Remedies (Objectionable Advertisements) Act 1954** prohibits ads claiming diagnosis, cure, mitigation, treatment or prevention of the ~56 scheduled diseases (incl. diabetes, cancer, AIDS), and its rules cover misleading/exaggerated claims for AYUSH medicines; landing pages are advertisements under it. 14,876 misleading ASU&H ad instances were reported Aug 2018–Jun 2021 via AYUSH pharmacovigilance centres. ([PIB — DMR Act release](https://www.pib.gov.in/PressReleaseIframePage.aspx?PRID=1782667))
- **Enforcement is active and Ayurveda-focused.** ASCI's 2024–25 report flagged 233 health ads to the AYUSH Ministry for DMR Act violations "for promoting magical or guaranteed cures, with most of these ads appearing online, especially in the wellness and Ayurveda categories"; healthcare was among the most non-compliant sectors (370 ads investigated, 56% misleading); 91% of celebrity-endorsement health ads required modification. ([Medical Dialogues — ASCI report](https://medicaldialogues.in/news/industry/pharma/asci-flags-233-health-ads-for-dmr-act-violation-reports-to-ayush-ministry-149226))

**Net copy doctrine:** outcome language is framed as programme/protocol descriptions and testimonials with disclaimers — **never disease-cure claims, never guaranteed outcomes, never scheduled-disease names as claims**. This is consistent with, and additional to, the KTAHV clinical register and its existing 'cure' ban (CLAUDE_FLEET.md Language Lock). Medical/clinical LP copy still requires Dr. Deepu John's sign-off before staging→production (Hard Gate 7).

## 6. Speed & mobile layout

- **Speed is both a conversion input and a QS input (§2 LPX criteria include load speed).** Google/Think with Google's mobile benchmark research (11M mobile-ad landing pages, 213 countries) found most mobile LPs too slow; **53% of mobile users abandon past 3 seconds**; bounce probability +32% from 1s→3s, +123% from 1s→10s. Visits with faster-than-average LCP were 27% more likely to convert; good-LCP threshold is **2.5s**, and mobile lags desktop badly (61.4% vs 74% good-LCP share). ([Think with Google — mobile page speed benchmarks](https://business.google.com/ca-en/think/marketing-strategies/mobile-page-speed-new-industry-benchmarks/))
- **Thumb-zone layout law:** primary CTA in the bottom third of the screen (the one-handed sweet spot), tap targets ≥44×44px, full-width mobile buttons with spacing to prevent mis-taps, and a **sticky bottom CTA on long-form pages** ("especially effective for long-form pages"); Heyflow reports up to 54% more leads after thumb-zone-first funnel optimization. ([Heyflow — thumb zone](https://heyflow.com/blog/mastering-the-thumb-zone/))
- Sticky-bar × chat-bubble collision rules live in the companion doc: `docs/design/chat-bubble-placement.md`.

## 7. Measurement & hygiene

- **noindex by default.** The Factory rule already says `/lp/<campaign>` is noindex by default; the evidence backs it: Search Engine Land's guidance is to keep separate paid and organic pages — "it's better to go with separate pages and a canonical tag than to try to shoehorn one page into doing double-duty." Practitioner consensus: noindex PPC LPs so only paid traffic reaches them; canonical alone is a hint Google can ignore (it may index both); indexed paid pages inflate organic numbers and mix attribution signals. The organic page holds the canonical. ([Search Engine Land — PPC LPs & SEO](https://searchengineland.com/ppc-landing-pages-seo-388033))
- **Ads final-URL rule: never a redirecting domain.** Google Ads destination requirements: display URL domain must match final/mobile URL domain; cross-domain redirects from the final URL lead to disapproval — a June 2026 update permits them only "in certain circumstances, with prior approval" (e.g., CPG manufacturers → approved retailers). **Campaign LPs must live on the advertised brand's own domain** — no vanity-domain redirects, no tracker domains in the final URL. ([Google Ads policy — destination requirements](https://support.google.com/adspolicy/answer/6368661?hl=en))
- **One LP = one goal = one conversion action.** Google frames landing-page experience as per-ad-click relevance judged per search query over 90 days ([Search Ads 360 — landing page experience](https://support.google.com/sa360/answer/9351020?hl=en)); combined with the 1:1 attention-ratio doctrine (§1), each LP carries its own conversion event(s) mapped to its single CTA, with `data-cta` event instrumentation per CTA so the ad platforms optimize against the LP's specific goal, not sitewide conversions.

## 8. How this maps to our factory

- **Route:** `/lp/<campaign>` — already the Factory convention (noindex default, single CTA, `data-cta` events required). This doctrine adds: one campaign/ad-group per LP variant, message-matched H1, no nav/footer.
- **Build:** LPs are MDX pages built only from `packages/*` like every other page — no bespoke one-off components. Frontmatter complete (title, description, locale, keywords[], schemaType, cta).
- **Design-critic still applies:** brand tokens (`packages/ui/brand-tokens.css` / `raag-tokens.css`) win over any LP-template aesthetic; an LP is stripped-down, not off-brand.
- **Entity register carries through:** KTAHV LP = clinical register + language lock (no spa/resort/holiday/luxury/cure/journey/guests, all locales); Villa Raag LP = wellness-hospitality register; KAPPL = product-pharma. No cross-application.
- **Ship gates unchanged:** spec suite green (consultation/enquiry/contact flows), Lighthouse ≥90 perf / (SEO gate n/a to noindexed LPs — flag for checklist amendment, §8 Q7), compliance lint zero findings, `/security-review` on the release diff, Abilash approves the Vercel preview. Post-publish QA fetch as per Lane B.
- **Checkout law:** product LPs use `packages/product-card`; never a cart/checkout/payment form — checkout is the main Shopify store, always.

## 9. Open questions for the Abilash brainstorm

1. **Campaign granularity vs build cost:** evidence says one LP per ad group (§1). Do we commit to that, or start at one LP per campaign and split by ad group only where spend justifies it? Do we adopt DTR-style H1 swapping in the factory (a `packages/*` component)?
2. **Which entity/programme LPs first**, and at which awareness stage per market (§3)? E.g. DE Panchakarma (product-aware, short) vs US stress/burnout prospecting (problem-aware, long)?
3. **WhatsApp-first threshold:** is the India-geo WhatsApp-primary / EU-US form-primary split (§4) the rule, or does DE also get WhatsApp given existing guest behaviour? Who staffs CTWA response SLAs (Priya's line is the locked number)?
4. **Form depth:** for KTAHV consultation LPs, do we adopt multi-step qualification (health-consult-style, §4) and what may we ask pre-consultation without tripping health-data sensitivity (§5)?
5. **Satyam CRM contract:** confirm store-first DB + boolean consent field spec (§4), field names, and where the consent text lives per locale. Also: does remarketing audience sync happen from CRM, and how do we keep those segments non-sensitive (§5)?
6. **Remarketing scope for KTAHV:** given Google's health-personalization restrictions (§5), which non-sensitive segments do we build (site visitors, brand-search clickers, video viewers)?
7. **Checklist amendments:** the launch checklists (docs/checklists/) assume indexable pages — LPs need an LP-specific pagewise checklist (noindex verified, message-match verified against the live ad, attention ratio audit, DMR/healthcare-policy copy scan). Who owns that lint?
8. **Legal footer minimum:** what stays on an LP when the footer is stripped (§1) — privacy link and consent text presumably must remain (forms law + Google LPX "transparency"). Confirm the minimum set with compliance.
9. **Locale rule for LPs:** Factory says EN always, DE/FR per brief. Do paid LPs follow the campaign's target geo only (e.g. DE-only LP for a DE campaign), exempting them from the all-three-locales KTAHV content rule?

---

*Sources are cited inline above; no claims beyond the cited evidence and the repo's own rulebook (CLAUDE_FLEET.md). Draft prepared 2026-07-14 19:45:42 IST for Abilash's review.*
