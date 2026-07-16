# SITE DESIGN & LOCALE REGISTER — v1.0 (13 Jul 2026)
Companion to PROJECT_CONTEXT.md. Every Factory site is built to ONE of four design registers, ONE locale set, and ONE video policy. All four registers use the SAME brand tokens (colors, type, spacing, motion from brand-tokens.css) — they differ in photography, motion intensity, layout density, and copy energy, never in palette or voice rules.

## THE FOUR REGISTERS
- **A — AUTHORITY** (corporate-warm, ROI-first): generous ivory space, forest actions, credential-led, real photography, minimal motion (fades only). Converts on trust.
- **E — EXPRESSIVE** (sensorial — "sexiness sells", executed via craft not adjectives): full-bleed imagery, cinematic hero video allowed, marigold accent moments, larger Kurale display, parallax-free calm motion per Manual ch.07. Still zero banned-filler words — the seduction is visual, the copy stays precise.
- **C — COMMERCE-PREMIUM**: product-forward, Shopify cards, macro ingredient photography/video, tight benefit copy, one accent per view.
- **ED — EDITORIAL**: prose-measure 720px, Kurale headlines, black-&-white portrait treatment, citation-rich, author bylines + Person schema.

## VIDEO POLICY CODES
- **REAL** — professional photo/video only (Manual ch.05). No AI-generated imagery of people or treatments. (KTAHV rule is absolute.)
- **HF-AMB** — Higgsfield/AI video allowed for AMBIENT ONLY: nature, ingredients, textures, product renders, abstract motion. Never people presented as patients/staff/clients. Brand-graded (forest/ivory/marigold), ≤2 MB poster + lazy stream, `prefers-reduced-motion` = static poster.
- **HF-FULL** — Higgsfield full use incl. product-URL-to-video ads and stylized scenes (campaign LPs, social); people only as obviously stylized/CGI, never implied real customers/patients.

## TRANSCREATION RULES (locales are audience decisions, not translations)
1. A locale ships only with a per-locale brief: who she is (MOA), what she fears/wants, which claims-jurisdiction lens applies, local proof points, local CTA norms (form vs WhatsApp vs phone).
2. DE/FR for KTAHV follow the existing MOA v3.0 psychology (M4a/M4b) — arrival-confidence open by default, clinical credibility framing; EN follows M1/M2.
3. Launch discipline: EN + only MOA-justified locales in the sprint; the i18n system makes later locales cheap. No literal-translation locale ever ships.
4. Non-Google engines: DE → Google-first; RU → Yandex files/verification; CZ → Seznam awareness; AR → RTL tokens (already in guru).

## REGISTER TABLE — build/rebuild sites
| Site | Register | Primary audience (MOA) | Locales @launch (→later) | Video | 90-day KPI (baseline TBD from GSC/GA) |
|---|---|---|---|---|---|
| kairali.com | A | Group stakeholders, partners, press, franchise curious | EN (→DE) | REAL + HF-AMB hero | Enquiries/mo across verticals; brand queries CTR |
| ayurvedichealingvillage.com (KTAHV) | A (clinical) | M1/M2 India · M4a DACH · M4b FR patients | EN/DE/FR (locked) | **REAL only** | Consultation forms + WhatsApp starts/mo |
| kairalicenters.com | A | Centre patients (18 centres, 9 countries), B2B centre partners | EN (→ per-country later) | REAL | Centre enquiries/mo; location-page sessions |
| kairalifranchise.com | A | Franchise investors (India + intl.) | EN | REAL + HF-AMB | Qualified franchise leads/mo (LinkedIn Insight on) |
| kairalihospitality.com | E | Hospitality partners + Villa Raag prospects | EN (→DE) | HF-AMB | Partner + stay enquiries/mo |
| villaraag.com | **E (flag-bearer) — OWN BRAND: raag-tokens.css, NOT Kairali tokens** (updated Raag manual pending from Abilash; structure/content build on schedule, visual pass gated on manual) | Premium leisure/wellness travellers (domestic + intl.) | EN (→DE/RU later) | HF-AMB hero, REAL people | Stay enquiries/direct bookings assist |
| kappl.co.in | A | B2B pharma buyers, regulators, distributors | EN | REAL + HF-AMB product | Distributor/B2B enquiries/mo |
| kairaliproducts.in | C | India D2C content layer over Shopify | EN | HF-FULL product | Shopify sessions assisted; add-to-carts |
| kairaliproducts.us / .cz / kairaliproduct.com | C | US / EU buyers (claims: FDA/FTC · EU lens) | EN / EN(+CS later) | HF-FULL product | Shopify assisted sessions per market |
| kairalitea.com | **C→E blend** | Gifting + wellness-lifestyle buyers | EN | HF-FULL | Add-to-carts assisted |
| kairalioil.com | C | Oils category buyers + salon/B2B | EN | HF-FULL | Add-to-carts + bulk enquiries |
| kairaliherbals.com | C | Herbal supplements buyers | EN | HF-AMB (ingredient macro) | Add-to-carts assisted |
| kairaliorganic.com / kairorganics.com / kairproducts.com | C | Organic & KAIR sub-brand buyers (Decision #3 pending) | EN | HF-FULL | Add-to-carts assisted |
| kairaliequipment.com | A | B2B: spa/centre equipment buyers (note: "spa" allowed here — not a KTAHV surface) | EN | REAL + HF-AMB | Quote requests/mo |
| bulkayurvedaoils.com / bulkayurvedaproducts.com | A/C | B2B bulk & private-label buyers (US/EU/GCC) | EN | HF-AMB | RFQ leads/mo |
| kairaliyoga.com | E | Yoga programme seekers + TTC prospects | EN | HF-AMB + REAL people | Programme enquiries/mo |
| kairali.guru (live) | ED | Ayurveda learners (live site EN-ONLY, verified 13 Jul 2026 — /de/ 404s, no hreflang; EN/DE/FR/AR/RU exist only in Eeshal's repo, Wave-2 target set — DECISIONS 14 Jul) | as-is | REAL + HF-AMB | Course enquiries; article rankings |
| whatisayurveda.org/.com | ED | Top-funnel education, AI-answer capture (Decision #2) | EN (→DE/FR) | HF-AMB explainers | AI-citation presence; assisted enquiries |
| healing.recipes | **ED→E** | Cookbook readers, Gita Ramesh audience, press | EN | REAL (food) + HF-AMB | Book interest clicks; press pickups |
| ayurvedafranchise.com | A (or 301 → franchise; Decision #4) | SEO satellite | EN | REAL | Assisted franchise leads |
| arogyakendra.com / arogyashala.in | A (1-pagers) | Brand-protective single pages — MEANING (Abilash 16 Jul, wiki/entities/arogya-brands.md): Kendra = tier-2/3 partner-doctor clinics under Kairali brand (hub-and-spoke); Shala = tier-2/3 chemist/retail branding programme. Richer B2B versions inherit the franchise commercials gate | EN | none | Indexed + branded query capture |
| snehachowdhary.com (+theblushlounge; Decision #6) | E | Personal brand | EN | HF-FULL | n/a (personal) |
| abhilashkr.com | ED/personal | Personal | EN | owner's call | n/a |
| kairali.ai | internal | Fleet Pulse + tools | EN | none | uptime of dashboard itself |

## PPC LANDING PAGES
Register inherits from parent site; video default HF-FULL allowed EXCEPT any KTAHV-related campaign (REAL only, clinical lock applies). One CTA. noindex.

## STANDING NOTES
- Villa Raag is the "sexy" flagship; KTAHV is the authority flagship. If a design choice would look at home on a resort site, it does not belong on KTAHV.
- Marigold: one accent moment per view (Manual). Sexiness ≠ more marigold.
- Every E-register hero video must pass: LCP budget with poster-first load, reduced-motion fallback, brand-grade check, and the "no implied patients" rule.
- KPI baselines: pulled from GSC/GA in Phase 0; targets set in DECISIONS.md within week 2; Fleet Pulse renders red/amber/green against them.

*v1.0 — amend via DECISIONS.md entries only.*


## 2026-07-15 amendments (Abilash-ratified)
- **whyayurveda.org** ADDED — register ED (blog). The group's centralised BLOG on WordPress (live). Role: topical blog/news/stories; cross-links with whatisayurveda (the authority reference). Locale EN (→DE priority). Mine + security-screen before rebuild.
- **Locale priority:** German (DE) is the priority 2nd locale over Hindi on KTAHV / Villa Raag / whatisayurveda / whyayurveda (DACH+UK+GCC MOA).
- **villaraag.com:** wellness-lifestyle register LOCKED — no clinical/medical vocabulary (D&MR compliance); clinical demand → KTAHV referral.
- **KTAHV:** audience expands (+NRI 'bring your parents', +GCC capped test); programme-outcome page architecture.
