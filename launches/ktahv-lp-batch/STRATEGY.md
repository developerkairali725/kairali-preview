# STRATEGY — KTAHV LP batch (front gate 2; deliberately fat — one approval covers it all)

Drafted: 2026-07-18 19:05:00 IST. Evidence base: docs/ktahv-inputs/lp-mining/ (10/10 snapshots + signals,
18 Jul) · legacy-lp-inventory.md (14 Jul) · LANDING_PAGE_DOCTRINE.md · comp-set + competitor dossiers.

---

## ⚠️ VIKASH MUST CONFIRM REDIRECT/URL PLAN PRE-FLIP — READ THIS FIRST

**Live Google Ads point at these exact 10 URLs. NOTHING in this batch changes a slug, host, or
redirect until Vikash confirms, in writing, per URL** (same law as Shopify doctrine (m) for PDPs).
The proposed plan below is a PROPOSAL for his confirmation, not a schedule:

| # | Live URL (ad destination) | Proposed fate | Why |
|---|---|---|---|
| 1 | /ayurvedic-treatment-packages.html | KEEP slug, rebuild in place (or 301 → /lp/treatment-packages after ads re-point) | generic packages intent |
| 2 | /panchkarma-treatment.html | KEEP slug, rebuild in place — GOLDEN LP | highest-value query |
| 3 | /weight-loss.html | KEEP slug; copy compliance rebuild is the urgent part, not the URL | ads live; DMR risk is in copy |
| 4 | /wellness-resort-kerala.html | **DECISION NEEDED**: slug contains banned word "resort". Options: (a) keep serving legacy slug + ads re-point to /lp/ayurvedic-hospital-kerala when Vikash rotates creative; (b) 301 after re-point. NEVER a silent 301 while ads run | banned-word URL vs live QS history |
| 5 | /kairali-cleansing-centre.html | KEEP slug, rebuild in place | closest to clinical register already |
| 6 | /Ayurveda_Treatment_Neo_S.India_Cities.html | KEEP until Vikash rotates; propose /lp/ayurveda-treatment-south-india for the next campaign flight | ugly slug but live |
| 7 | /Kairali_Brand_and_Competition_Neo-original.html | KEEP until Vikash rotates ("-original" implies A/B twins — ask him which variants serve) | brand-defence campaign |
| 8 | /pain-management.html | KEEP slug, rebuild in place | clean page, clean slug |
| 9 | /de/behandlung-in-kerala | KEEP path; note live host truth: **www 301s to apex** — canonical is https://ayurvedichealingvillage.com/de/behandlung-in-kerala/ (owner's list says www) | DE ads + WP locale tree |
| 10 | /treatment-in-kerala.html | KEEP slug, rebuild in place | head-term page |

Also for Vikash: Ads final-URL rule (doctrine §7) — LPs stay on the advertised domain, no tracker/vanity
domains; every rebuilt page keeps its UTM contract so his attribution doesn't break. Questions for his reply:
(i) which of the 10 carry active spend today; (ii) ad-group-level keyword/ad copy per URL so H1 message
match is exact, not inferred; (iii) A/B variant inventory around #6/#7; (iv) GAds conversion actions
currently mapped to submitContactForm.php thank-you events.

---

## §1 The 10 rebuilds — per-LP plan

Register/compliance detail per page: docs/ktahv-inputs/lp-mining/MINING-NOTES.md. Summary table:

| # | LP | Target keyword / ad intent (msg-match H1 source) | Awareness · length | Form/CTA plan | Key preserve | Key fix |
|---|---|---|---|---|---|---|
| 1 | treatment-packages | "ayurvedic treatment packages Kerala" (Search, solution-aware) | short, offer-led | WA-first + form (consent ✓, UTM ✓) | packages grid, villas-as-context, TripAdvisor/NatGeo proof | resort/luxury/guests register; schema Resort→MedicalClinic-family |
| 2 | panchkarma-treatment **GOLDEN** | "panchakarma treatment Kerala / panchakarma centre India" | mid-long, authority-led | WA-first + form — ADD missing consent | 115+yrs spine, five-folds explainer, doctors, FAQ, world-map | no H1; "luxury" in meta; cure×3; "Ultimate Detox" reframe; physician byline fix (D-ASHIKA) |
| 3 | weight-loss | "ayurvedic weight loss treatment Kerala" (result-seeker) | long, proof-led | WA-first + form — ADD consent | funnel architecture, transformation videos (as disclaimed testimonials) | **quantified outcome badges + diabetes/BP claims OUT (DMR/Google Healthcare)**; journey×10 |
| 4 | wellness-resort-kerala | "wellness resort Kerala" (hospitality-intent, intl) | short-mid | form-first (intl) + WA | $ pricing, 28-award wall incl NABH, post-treatment care | heaviest register rewrite; the hospitality-query-vs-clinical-register tension = copy strategy: "the hospital the resort-searcher actually needs" framing, no banned words |
| 5 | kairali-cleansing-centre | "ayurvedic hospital Kerala / cleansing centre" | short-mid | form-first + WA | hospital positioning, NABH, pricing | body copy resort-toned; meta says "Luxury villas" |
| 6 | S.India cities Neo | city-geo PPC (Bengaluru/Chennai/Hyderabad) | short | **WhatsApp-first hardest** (India-geo CTWA doctrine §4) | city msg-match, captcha+consent form | light register scrub; slug (Vikash) |
| 7 | brand & competition Neo | brand + competitor terms | shortest, confirm-and-convert | WA + short form | speed-to-form, brand proof | "Health Resort" in title; slug (Vikash) |
| 8 | pain-management | "ayurvedic pain management Kerala" (condition) | mid, clinical | form (consent ✓) + WA | EVERYTHING — the register model page | condition-list phrasing → programme description; physician sign-off |
| 9 | DE behandlung-in-kerala | "Ayurveda Behandlung/Kur Kerala" DE market | short (product-aware DE) | form-first + consent (GDPR/CookieYes) — kill 6 search forms + AirIndia relic | DE treatment cards, EUR pricing, DE villas | default WP title; Kur/Gäste/luxe DE-sense bans; 13 forms→1; EN/DE/FR locale law |
| 10 | treatment-in-kerala | "ayurvedic treatment Kerala" (head term) | mid | WA-first + form (consent ✓) | 300K+/87% stats (owner-verify first), awards, pricing | worst banned counts; duplicated-H1 typo |

**LP-system laws applied to all ten:** noindex (legacy pages are index,follow — flip per doctrine §7,
organic value stays with the future organic KTAHV pages; if GSC later shows organic traffic worth
protecting on any of the ten, that page's noindex decision escalates to the owner, never silent) ·
no header-nav/footer link farm (legal/privacy links only) · single CTA + `data-cta` events ·
sticky bottom CTA mobile · LCP ≤2.5s (self-hosted media, no 468KB WP pages) · one H1, message-matched ·
clinical schema family (no `@type: Resort`) · forms keep the UTM/lead_source hidden-field contract +
boolean consent per Satyam spec (verify field names with Satyam pre-build) · Chatbase widget: keep ONLY
if it doesn't fight the WhatsApp CTA — default OFF on LPs, owner may override.

**Interim conversion routing (TARIFF_MODE + BOOKING_ROUTE still open):** those two blockers gate the
full KTAHV WP rebuild, NOT this lane — LP CTAs route to WhatsApp +91 92898 38797 (Priya) / info@kairali.com
/ the existing submitContactForm.php-equivalent store-first CRM endpoint. No pricing/booking flows are
built into LPs beyond the already-live package price displays (carried as-is from the live pages).

**Integrations plan (the strategy gate covers this):** GA4 + GTM retained; `data-cta` on every CTA
(whatsapp_click, form_submit, tel_click per LP); FB pixel retained where Vikash confirms it feeds
campaigns; Clarity retained (already on 1/2/9) for post-launch CRO; remarketing segments non-sensitive
only (site-visit/brand — never condition interest, Google health-personalization policy).

---

## §1b GO-SCIENCE DECLARATIONS (GS-MCB-6 · GS-MOA-1/2/3 · GS-VIS-3/A4)

*Added 2026-07-18 22:41:30 IST by the LP gate-battery lane. These declarations are LIFTED verbatim-in-substance
from this lane's committed build-time articulation (launches/ktahv-lp-batch/go-science/2026-07-18-selfcheck.md,
21:05 IST) and the §1 table above — consolidation into the bound strategy artifact per the golden-gate-battery
finding §1 (the GS-MCB-6/GS-MOA-3 "declarations missing from STRATEGY.md" failure pattern). Nothing here is new
marketing content; the self-check remains the derivation record.*

**Signature MCB / anchor secret desire (GS-MCB-6), batch-wide:** the KTAHV LP system's ONE anchor secret
desire is **"to be taken seriously as a patient — real, physician-run medical Ayurveda, not a wellness
performance."** Signature MCB mechanism: *hospital-grade Ayurveda without the tourism/package/overclaim
theatre — consultation first, then treatment.* Every per-LP MCB below is an evolution anchored to this
desire (KB: "It evolves but stays anchored to the same secret desire").

**NDFF source declaration (GS-MOA-3):** the declared NDFF evidence base is (i) docs/ktahv-inputs/lp-mining/
(10/10 live-page snapshots + per-page signals, 18 Jul — including the live funnels' own question/objection
architecture), (ii) docs/ktahv-inputs/comp-set.md + competitor dossiers, (iii) owner in-chat rulings and
market knowledge captured in DIRECTIVES/DECISIONS (D-LP-LIST session), (iv) Clarity session data on LPs
1/2/9. **No MoA interviews exist yet** — that residual is open (owner-gated); no NDFF claim beyond these
sources is permitted on any LP (HARD GATE 6 harmony).

**Ideal-group mapping (GS-MOA-2 / ambiguity A2), batch-wide:** IDEAL = the admission-intent patient:
someone with a health problem (or a considered prevention goal) prepared to travel to Palakkad, undergo an
in-person consultation, and follow a physician-planned inpatient programme measured in weeks. MISFITS
(excluded by design): leisure/spa-intent tourists wanting a menu of massages; day-trip sightseers;
book-now-without-consultation package shoppers; anyone seeking a promised outcome for a named disease
(DMR law makes that promise impossible — the honest refusal itself filters for the ideal group).

**Per-LP declarations — MoA (Market of Avatar, GS-MOA-1) · SBJ/awareness stage (GS-VIS-3/A4) · anchored MCB:**

| # | LP | MoA (avatar) | SBJ/awareness stage | Anchored MCB (mechanism) |
|---|---|---|---|---|
| 1 | treatment-packages | Indian/NRI treatment planner comparing "packages"; secret desire: handled-for-me certainty | solution-aware | packages without the guesswork — "prescribed, not picked" |
| 2 | panchkarma-treatment (GOLDEN) | high-intent treatment-seeker researching Panchakarma centres | product-aware | Panchakarma without the package-tour feel — "planned by physicians, after your consultation" |
| 3 | weight-loss | result-seeker burned by prior attempts (frustration = hot NDFF layer) | problem-aware | a programme, not a promise — method without the overclaim (DMR pivot, self-check conflict #1) |
| 4 | ayurvedic-hospital-kerala | international hospitality-intent searcher, problem-aware about the wrong solution | problem-aware (about solution class) | the rest you wanted, run as medicine — "a hospital that feels like a village" |
| 5 | kairali-cleansing-centre | detox-intent, safety-anxious (fear layer: "will a cleanse wreck me?") | solution-aware | a real cleanse without the cowboy risk — hospital medicine, not a menu |
| 6 | ayurveda-treatment-south-india | metro professional (Bengaluru/Chennai/Hyderabad), time-poor | problem-aware | hospital-grade Ayurveda without leaving the South |
| 7 | kairali-brand | most-aware brand-searcher verifying the original | most-aware | you found the original — record-based confirmation, zero friction |
| 8 | pain-management | chronic-pain endurer; fear: being over-promised AGAIN | problem-aware | taken seriously, without one more overclaiming pitch — "assessed first, then treated" |
| 9 | behandlung-in-kerala (DE) | German repeat-treatment seeker, documentation-driven | product-aware | echte Klinik-Ayurveda ohne Hotel-Theater — ärztlich geplant |
| 10 | treatment-in-kerala | broad head-term searcher, earliest awareness of the ten; secret desire: someone credible deciding for them | problem-aware (earliest) | the right treatment without becoming an expert first — consultation decides |

---

## §2 The 3 NEW LPs (build AFTER the ten — briefs for the same gates)

### N1 — KTAHV consultation LP
- **Goal:** paid-traffic consultation bookings (the pre-admission physician consult) — the top-of-funnel
  product every treatment query can convert to when a visitor isn't ready to book a programme.
- **Intent/keywords:** "ayurvedic doctor consultation online / ayurveda consultation India" + remarketing
  landing for the ten rebuilt LPs' non-converters (non-sensitive segments only).
- **Shape:** short; physician-led hero (real doctors, real NABH); multi-step qualification form
  (doctrine §4 — contact details last, no health-condition fields pre-consult without compliance review);
  WhatsApp-first India / form-first abroad. Routing: same interim channels; consultation fee/timing facts
  from the owner — NOT invented (HARD GATE 6).
- **Open input needed:** consultation price + fulfilment channel (video/phone/in-person) — ask at brief time.

### N2 — Franchise lead-gen LP
- **Goal:** qualified franchise-partner enquiries for Kairali centres.
- **Intent/keywords:** "ayurveda franchise India / wellness franchise investment".
- **Shape:** B2B mini-sales page: D-FR-MONEY/D-FR-ROYALTY ruling applies — investment/fee/ROI + royalty
  figures publish AS-IS from kairalifranchise.com (brother-confirmed); six partner centres named as
  FRANCHISE PARTNERS (D-KC-PARTNERS); enquiries → info@kairali.com (D-FR-CONTACT). Coordinate with the
  ayurvedafranchise.com / kairalicenters.com weekend builds (concurrent sessions) so one canonical
  franchise funnel exists, not three — flag at brief gate which domain hosts it.
- **Register:** group-corporate (NOT the KTAHV clinical lock — franchise audience), but no invented numbers.

### N3 — healing.recipes launch LP
- **Goal:** launch-capture for the healing.recipes property (email-first: recipe-book/waitlist capture),
  building the KAPPL/content flywheel audience.
- **Intent:** paid-social cold traffic (Meta) — long-education shape per doctrine §2b; food-as-medicine
  angle; NO disease-cure claims (DMR applies to food-health claims too).
- **Shape:** story-led, 3–4 proof touchpoints, single email-capture CTA (store-first CRM, boolean consent);
  register: warm consumer-editorial (healing.recipes is not KTAHV — clinical lock does not cross-apply,
  but health-claim law does).

---

## What APPROVE strategy signs

The per-LP keyword/intent map (§1 table) · the URL/redirect PROPOSAL as the thing sent to Vikash
(nothing flips without his written per-URL confirmation) · the LP-system laws + integrations plan ·
the interim CTA routing · the 3 new-LP briefs and their build order (after the ten).

> reply APPROVE strategy or CHANGES <notes>
