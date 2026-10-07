# AHV Campaign Pages — AUTHORING GUIDE (for the content AI)

**You are the content author.** The templates (components, 4 design variants, validators) are already built.
Your job is to produce **one content file per campaign**, plus a change log, that passes `pnpm lp:check` with zero errors,
so the page renders correctly in variants A, B, C and D without anyone touching code.

| Read first | Path |
|---|---|
| Build spec (decisions, behaviour) | `docs/specs/2026-10-07-ahv-campaign-lp-v2-build-spec.md` |
| Visual reference | Claude Design canvas https://claude.ai/artifact/9YoYMS51SchBoDtSR2Cv3h |
| Research and compliance background | `docs/research/2026-10-07-landing-page-research.md` |
| Program names (master) | **"Ref Sheet KTAHV.pdf"** (Anupam, 6 Oct 2026). Save it into the repo as `campaign-v2/reference/ref-sheet-ktahv.pdf` before starting |
| Locked facts | Control workspace `sites/ayurvedichealingvillage.com/LOCKED_FACTS.md` |

If anything in this guide conflicts with the build spec, the spec wins. Ask; never guess.

---

## 0. One-shot workflow (do these in order)

1. **Pick the route** from the inventory (§13). Note its old source page and the default variant.
2. **Collect sources.** Never invent. Collect:
   - the old page copy (`campaign-v110/pages/<route>/page.tsx` plus the live URL)
   - the current tariff PDF from the document hub (https://kairali-documents.vercel.app/, AHV route)
   - the Ref Sheet
   - LOCKED_FACTS
   - the doctor registry (`campaign-v2/data/doctors.ts`)
   - the image registry (`campaign-v2/data/images.ts`)
   - the film registry (`campaign-v2/data/films.ts`)
3. **Copy `campaign-v2/campaigns/_template.ts`** to `campaign-v2/campaigns/<slug>.ts`, set `slug` and `previewRoute`, then **register it** in `campaign-v2/campaigns/index.ts`: add `import <name> from "./<slug>.ts";` and put `"<slug>": <name>` in `CAMPAIGNS`. Without this, `lp:check <slug>` says "unknown campaign" and `/lp-v2/<slug>/a` is a 404.
4. **Fill every field** using the limits in §3 and the rules in §4–§10. Unknown facts use `pending('C-xx', 'what is missing')`, never a guess (§2).
5. **Write the change log** `campaign-v2/campaigns/<slug>.changes.md` (§5).
6. **Run** `pnpm lp:check <slug>`. Fix every error. Warnings need a reason or an owner override.
7. **Preview** all four variants at `/lp-v2/<slug>/a|b|c|d` at 390px and 1440px, in English (other languages are not supported yet, §10). Screenshot them.
8. **Open a PR** with the content file, change log and screenshots. Never edit components, styles, forms, tracking or consent.

**Definition of done:** `lp:check` is green, the change log is complete, there are 8 screenshots (4 variants × 2 widths), and no `pending()` remains for a production route.

---

## 1. What you may and may not touch

| You WRITE | You NEVER touch |
|---|---|
| `campaign-v2/campaigns/<slug>.ts` | Components, variant layouts, CSS, tokens |
| `campaign-v2/campaigns/<slug>.changes.md` | Form fields, `/api/lead/`, hidden fields, consent, tracking code |
| `campaign-v2/campaigns/index.ts`: one import line and one `CAMPAIGNS` entry for your slug (§0 step 3), nothing else | Prices not taken from an approved tariff |
| New registry entries for images, films or doctors, **only** with a source and consent recorded | Phone numbers, WhatsApp number, emails, accreditation numbers (they come from `site.ts`) |

**Locked facts** (they render automatically; never retype them):
- Phone: +91 95551 56156
- WhatsApp (Priya): +91 92898 38797. Any number ending …38777 is wrong.
- Email: info@kairali.com
- NABH: AH-2024-0250
- Instagram: @kairaliayurvedichealingvillage
- Facebook / Messenger: KairaliTheAyurvedicHealingVillage
- Heritage: "Ayurvedic family tradition since 1908" and "The Healing Village, Palakkad, since [year]" (the year is pending, C8)

---

## 2. Missing facts: the `pending()` rule

- Any fact you cannot source → `pending('C-xx', 'short description')`.
- The preview renders it as visible text: the id in brackets, e.g. `[C2]`. This works in every field, including ones typed `string` (the template casts `pending()` into each of them).
- `lp:check` **fails on production routes** while any `pending()` remains. On `/lp-v2/` previews it passes and lists each open placeholder.
- Open items, from build spec §11:
  - **C2:** fees
  - **C3:** offer
  - **C4:** doctor qualifications
  - ~~**C5:** ratings~~ (resolved: `campaign-v2/data/ratings.ts`; see §17)
  - **C7:** yoga film
  - **C8:** village year
  - **C9:** address
  - **C11:** consent text
- Never fill a gap with a plausible-sounding number, rating, date, year or name.

---

## 3. Length budgets (hard limits enforced by `lp:check`)

The limits fit all 4 variants at 390px and 1440px without breaking layouts. Counts are characters including spaces, unless the limit says words. Every row is an `lp:check` error except the gallery-per-category rule, which is a warning.

| Field | Min | Max | Notes |
|---|---|---|---|
| `seo.title` | 30 | 60 | "<Program> in Kerala \| Kairali" pattern |
| `seo.description` | 120 | 155 | Benefit + program + place. No claims |
| `hero.overline` | — | 48 | e.g. "NABH-accredited Ayurvedic hospital · Kerala" |
| `hero.h1` | 20 | **60** | Message-matched to the ad headline (§7). One sentence. No full stop if it's a phrase |
| `hero.h1Accent` (optional) | — | 24 | The words rendered in italic or accent style in B/C. Must be a substring of `h1` |
| `hero.standfirst` | 90 | **160** | One sentence. What it is, where, for whom |
| `admission.heading` | — | 60 | |
| `admission.steps[3].title` | — | 24 | Exactly 3 steps |
| `admission.steps[3].body` | 40 | 120 | |
| `included[]` | 4 items | 7 items | each ≤ 34 chars |
| `chargedSeparately[]` | 1 item | 4 items | each ≤ 34 chars |
| `stillness.heading` | — | 45 | |
| `stillness.body` | 60 | 150 | Sensory, calm. No claims |
| `films.featured.title` | — | 32 | The registry title; override with `{ ...film('id'), title: '…' }` |
| `films.more[].title` | — | 28 | 2–3 items |
| `doctors[]` | 2 | 3 | From the registry only |
| `village.heading` | — | 50 | |
| `village.body` | 60 | 150 | |
| `gallery[]` | 6 | 24 | ≥ 2 per category used (**warning**) |
| `fees.rows[]` | 1 | 4 | `name` ≤ 24, `note` ≤ 60; a USD figure in every priced row (§11) |
| `offer.name` | — | 30 | |
| `offer.headline` | — | 80 | |
| `faq[]` | 4 | 6 | `q` ≤ 70 chars; `a` 25–70 **words** |
| `longForm` | 300 | 1,200 **words** | H2/H3 only, short paragraphs (≤ 4 sentences) |
| **Visible page words** (everything except `longForm`) | 450 | **900** | Benchmark: 355–1,020 words convert best for health pages |
| Reading level | — | Grade 8 | Average sentence ≤ 20 words. Prefer short words |

Variant D (Direct) shows only the header, hero, proof strip, offer, fees, doctors, enquiry form, FAQ and footer (`kit/variants.ts`). It automatically drops `admission`, `stillness`, all films, the village section with its gallery, and `longForm`. You don't write a separate D version.

---

## 4. The content file (TypeScript; the type is `CampaignConfig`)

```ts
// campaign-v2/campaigns/panchakarma.ts — same imports as _template.ts (there is no kit/index.ts)
import { defineCampaign } from '../kit/define.ts';
import { pending } from '../kit/pending.ts';
import { img, film, doc } from '../kit/registry.ts';

export default defineCampaign({
  slug: 'panchakarma',
  route: '/panchkarma-treatment.html',     // the ad URL it will eventually replace (Vikash confirms)
  previewRoute: '/lp-v2/panchakarma',      // variants at /a /b /c /d
  defaultVariant: 'A',                      // §13
  variants: ['A', 'B', 'C', 'D'],           // all four unless a variant is unsuitable
  index: false,                             // variant URLs are always noindex; Vikash decides the main route
  locales: ['en'],                          // only 'en' for now: other locales are not supported yet (§10)
  translations: [{ locale: 'en', review: 'approved' }],
  modesty: 'standard',                      // 'gcc' for Gulf-targeted campaigns (§6.4)
  wordingOverrides: [],                     // owner-approved banned-word uses (§8.3)
  production: false,                        // true only for the live ad route; then every pending() is an error

  seo: { title: '…', description: '…' },
  adMatch: { keywords: ['panchakarma treatment kerala'], adHeadlines: ['…'] },  // from Gaurav/Vikash (§7)

  hero: {
    overline: 'NABH-accredited Ayurvedic hospital · Kerala',
    h1: 'Panchakarma, practiced the way it was meant to be.',
    h1Accent: 'meant to be.',
    standfirst: 'A physician-led admission in a quiet Kerala village — therapy, prescribed diet and deep rest, planned around you.',
    image: { A: img('kt-199'), B: img('kt-199'), C: img('kt-190'), D: img('kt-202') },
    mobileImage: img('kt-190'),
  },
  programDefault: 'Panchakarma',            // preselects the program (program list comes from the Ref Sheet)
  tracking: { campaignName: 'panchkarma-treatment', trackId: '' },  // legacy CRM values (§12)
  admission: { heading: '…', steps: [ { title: 'Before you arrive', body: '…' }, …3 ] },
  included: ['Doctor consultations', 'Prescribed therapies', 'All meals, prescribed diet', 'Private villa', 'Yoga and meditation'],
  chargedSeparately: ['Medicines', 'Laboratory tests'],
  stillness: { heading: 'Stillness is part of the prescription.', body: '…', image: img('gal-post-therapy-stillness-wakem') },
  films: { featured: film('iPARaMRASUs'), more: [film('4x01PtWfNnk'), film('3vWviQfW1Ug'), film('07tVC2oXd8g')] },
  doctors: [doc('deepu-john'), doc('akhila-oommen'), doc('ashikha-raj')],
  village: { heading: '…', body: '…' },
  gallery: [ { category: 'Villas', image: img('kt-116') }, … ],
  fees: {
    source: 'Tariff PDF <hub URL>, page N',   // REQUIRED when fees are present
    validTo: '2026-…',
    nights: 14,
    rows: [ { name: 'Deluxe villa', note: '…', single: { INR: …, USD: …, EUR: … }, twinEach: { … } } ],  // USD required (§11)
  },
  offer: null,                               // or { name, headline, termsUrl, validFrom, validTo, source }
  faq: [ { q: 'Is the doctor consultation really free?', a: '…' }, … ],
  longForm: `## …`,                          // Markdown, linted
});
```

- `img('id')` must exist in the image registry (§6).
- `film('youtubeId')` must exist in the film registry (§6.6).
- `doc('id')` must exist in the doctor registry.
- An unknown ID throws `Unknown image id: …` as soon as the file loads, so `lp:check` stops with that message.
- `lp:check` also type-checks the file (tsc), so a missing, misspelt or extra field is an error. The fields marked optional in `kit/types.ts` (`hero.h1Accent`, `extraJsonLd`, `form`) may be left out.

---

## 5. Rewriting old pages (owner rule: rewrite to fit, facts verbatim)

**Keep these word for word.** Copy them exactly from the source; never paraphrase:
- program names, in Ref Sheet form
- durations and nights
- inclusions and exclusions
- prices, currencies and validity
- offer percentages, eligibility and terms
- doctor names, qualifications and years
- accreditation numbers
- award names and years

**Rewrite these** to the limits in §3, the voice in §8 and the claims rules in §9:
- headlines
- standfirsts
- section copy
- FAQs

**Remove** anything that breaks §9 (claims) or §8.2 (banned register words), and record each removal in the change log.

**Change log format** (`<slug>.changes.md`):

```md
# panchakarma — change log (source: /panchkarma-treatment.html, fetched 2026-10-08)
| # | Field | Old (verbatim, trimmed) | New | Reason |
|---|---|---|---|---|
| 1 | hero.h1 | "Panchakarma Treatment in Kerala – Ultimate Detox" | "Panchakarma, practiced the way it was meant to be." | message match + register |
| 2 | (removed) | "cures chronic diseases" | — | §9 cure claim | <!-- compliance-allow: cure, cure-claims, cures -->
| 3 | fees.rows[0] | ₹22,125/night | ₹… (14-night total) | from tariff PDF p.3, validity 31 Oct 2026 |
```

---

## 6. Images

### 6.1 Sources, in priority order
1. `Kairali-Image-Library/ahv-edited/`: the professional Palakkad shoot (8192px masters). **First choice.**
2. `Kairali-Image-Library/ktahv-shoot-2025/`: HO centre. **Never caption or alt-text these as Palakkad.**
3. `ktahv/legacy-treatment-photography/` (Matthew Wakem).
4. `team-*` portraits, for doctors only.

**Never** use:
- AI-generated people (`gen-*`)
- stock photos of people
- hotlinked WordPress URLs
- before/after photos
- patients photographed without a release

Model releases for the 2025/26 shoot are on file (owner, 7 Oct).

### 6.2 Slots per variant (the registry stores crops; you pick IDs)

| Slot | A Quiet Admission | B Garden Bento | C Editorial | D Direct | Min source px |
|---|---|---|---|---|---|
| hero | landscape 3:2, sensual treatment (hands, oil) | landscape 7:5 bento tile, treatment or grounds | **portrait 3:4**, editorial, face/hands | **landscape 3:2** (same shape as A/B); it is the strip in the headline card on desktop and the ~366×200 strip on phones, so the subject (oil, hands) sits mid-frame and must survive a wide, short crop | **1600 long edge enforced** (the registry entry's recorded size) |
| mobileImage | portrait, faces readable at 390px | not used on phones: `hero.image.B` is shown as a ~230px landscape strip | portrait | not used on phones: `hero.image.D` is shown as a ~200px landscape strip | **1600 long edge enforced** (it is a hero slot) |
| stillness | B&W or low-key, faceless or back view | — (hidden) | full-bleed B&W | — (hidden) | 1200 long edge enforced |
| village / gallery | villas, grounds, dining, therapy | same | same | — (D has no village or gallery) | 1200 long edge enforced |

### 6.3 What sells, within the rules
- Use touch, warm oil, steam, light, textures, eyes closed, unhurried pace, laterite and teak.
- Bodies are draped. Treatment shots focus on hands and oil.
- Show people aged 40–65 across ethnicities, matching the 45+ audience.
- One image per section. Don't repeat an image across slots on the same page.
- The hero must be **message-matched**: a Panchakarma ad shows a Panchakarma therapy, not a pool.

### 6.4 Modesty (`modesty: 'gcc'`)
Gulf-targeted campaigns use the registry's `gccSafe: true` images only: covered shoulders, no swimwear and no pool lounging shots. `lp:check` enforces this.

### 6.5 Alt text (WCAG 2.2 plus SEO, without stuffing)
- **Decorative** images (stillness band, pure texture, background) use `alt: ''`. The registry flag `decorative: true` does this automatically.
- **Informative** images: aim for 60–125 characters (`lp:check` errors under 20 or over 125). Describe what is visible and why it matters here. Write a sentence fragment with no "image of" or "photo of".
- `lp:check` scans the alt text of every informative page image (hero, mobile hero, stillness, gallery) with the claims rules (§9, errors) and the register words (§8.2, warnings). Award proper nouns stay exempt.
  - **Pattern:** `<who/what> <doing what> <where/context>`.
  - **Good:** "Two therapists performing four-hand Abhyangam with warm medicated oil" or "Octagonal villa interior under a terracotta dome at the Healing Village".
  - **Bad:** "best ayurvedic weight loss centre in kerala" (keyword stuffing; the live audit found this, and it fails). Also bad: "Hero", "image1", or a filename.
- **Doctors:** "Dr. Akhila Oommen, Ayurvedic physician".
- **Award logos:** the exact award name and year, e.g. "Tripadvisor Travelers' Choice 2025".
- **HO-centre photos** must not say "Palakkad" or "the village".
- At most **one** keyword phrase per page across all alt text, and only where it is genuinely descriptive.
- **Translations:** not supported yet (§10).

### 6.6 Films
- Use only IDs from the film registry. Each has a `kind`: `property`, `patient`, `treatment` or `yoga`, and a `consent: true` flag.
- **Featured film:** a property or treatment film that matches the campaign. Then 2–3 patient films.
- **Yoga campaigns:** a `yoga` film is required (open item C7). The only one on record (2017) is too old to feature.
- Titles are yours (§3 limits). Don't copy YouTube titles that contain banned words ("journey", "spa"). <!-- compliance-allow: journey, spa -->

### 6.7 Text over photos (owner, 7 Oct: "white text on hero image is not readable")
- Some layouts set text over a photo: the A header over the hero, the Stillness band (A/B desktop card, C heading over the full-bleed photo), the featured film caption, and photo chips ("+ 3 more", the B phone price chip).
- **Pick hero and band photos whose subject is away from the copy side:**
  - A hero: subject centre or right; the header links sit over the photo's top edge.
  - C Stillness: subject right or centre-right; the heading sits bottom-left (bottom-right in Arabic).
  - Featured film: nothing important in the bottom fifth, where the caption sits.
- **The scrim is mandatory and is never removed or lightened per campaign.** Every one of these text blocks carries `lp-scrim` (a directional gradient) or `lp-panel` (a translucent panel), coloured by the skin's `--lp-scrim` / `--lp-scrim-copy` tokens (`kit/skins.ts`). They are sized to keep the text at 4.5:1 or better even over a **pure white** photo, so any photo you choose is safe for legibility. They are not safe for composition: a face under the copy is still a bad crop.
- `text-shadow` may soften edges but never counts towards contrast.
- Before publishing, run `node tools/lp-contrast.mjs --base <server> --slug <slug>` and the same with `--white`. Both must report 0 failing.

---

## 7. Message match (the biggest conversion lever)

- `hero.h1` must reuse the **core noun phrase** of the ad group's headline or keyword, e.g. keyword "panchakarma treatment kerala" → H1 contains "Panchakarma".
- `lp:check` compares `hero.h1` with `adMatch.keywords` and warns if there is no overlap.
- Get the real ad headlines from Gaurav or Vikash and put them in `adMatch.adHeadlines`. Don't infer them.
- **Variant test copy is identical across A–D.** Only the design changes. Never write per-variant copy.

---

## 8. Voice, spelling and register

### 8.1 House style
- **American English** (Anupam, 6 Oct 2026; matches Kairali's print material): program, center, color, practiced (verb), traveler.
  - Exception: proper nouns keep their own spelling (e.g. "Tripadvisor Travelers' Choice").
- **Program naming:** English name first, then the Malayalam-Sanskrit name in brackets, exactly as on the Ref Sheet. Examples:
  - "One Week Ayurveda Program (Praveena)"
  - "Kairali's Yoga & Meditation Package – Dhyāna-Yoga Shibiram"
- **Malayalam-Sanskrit therapy names:** Abhyangam, Netra Tarpanam, Udhwarthanam, Lepam, Thalam, Shirodhara, Kizhi, and so on. Follow the Ref Sheet. Don't use the North Indian forms (Abhyanga, Udvartana).
- **Karkidakam vs Karkidaka:**
  - Karkidakam is the noun for the month or season: "Karkidakam at Kairali".
  - Karkidaka is the combining form before another word: "Karkidaka Chikitsa", "Karkidaka Kanji".
- **Daily routine at 14:00:** "Cooking demonstration / Garden visits / Workshops & Lectures". Never "factory visit".
- **Tone:**
  - calm, precise, warm and confident
  - second person ("you")
  - no exclamation marks, no ALL CAPS, no "Yes, I want to…" buttons
  - no fear copy ("Do not waste valuable time")
- **CTA labels are fixed** and come from the kit. Don't rename them: "Get free doctor consultation", "WhatsApp", "Ask".
- **No reply-time promises** about the consultation ("in minutes", "within 2 hours"). Only the chat channels may say the AI assistant answers instantly, and the kit already renders that.

### 8.2 KTAHV register (GST show-cause notice lock)
- **Use:** patient, physician/doctor, treatment, program, Panchakarma, admission, discharge, consultation, stay, villa.
- **Banned in every locale:** spa, resort, holiday, luxury, cure, journey, guests (and their translations, e.g. DE Kur/Urlaub/Luxus/Gäste, FR luxe/cure/vacances). <!-- compliance-allow: cure, cure-claims, guests, gäste, holiday, journey, luxe, luxury, luxus, resort, spa, urlaub, vacances -->
- **Award proper nouns** (e.g. "World Luxury Spa Awards") are allowed only as logo alt text or an award name, never in running copy. <!-- compliance-allow: luxury, spa -->

### 8.3 Owner overrides
- The owner may approve a banned word for a specific campaign. Record it as `wordingOverrides: [{ term, approvedBy: 'owner', date, reason }]`.
- Without an entry, `lp:check` warns and the PR reviewer will block it.

---

## 9. Claims (fails `lp:check`; legal and ad-policy critical)

**Never write, including in FAQs, the long form, alt text, film titles or translations:**
- Cure or curative language, "heals", "reverses", "eliminates". <!-- compliance-allow: cure, cure-claims -->
- Disease-treatment claims. This covers the DMR Act Schedule: obesity, diabetes, blood pressure, cholesterol, thyroid, cancer, arthritis, infertility and so on. Use symptom and well-being language ("support", "relief from everyday stiffness"), and keep even that cautious.
- Numeric outcomes:
  - kilograms lost, "% of patients", "in N days"
  - "87% improvement", "94% sustain results"
  - "zero adverse reactions"
  - "1.4M+ therapies"
- Unsourced superlatives: "best", "Asia's best", "No. 1", "world-class". An award name with its year is fine. <!-- compliance-allow: world-class -->
- Counts of lives or patients ("30,000+", "100K+", "11,347+"). They conflict across pages. Use none unless the owner approves one figure with a source.
- Before/after, weight-loss timelines, body-shaming ("Are you overweight?") or personal-attribute questions (Meta policy).
- "Free" anything other than the doctor consultation. That one is real: a qualified doctor, at no charge (owner, 7 Oct).
- Daily doctor review is **pending confirmation (C14)**. Until it's confirmed, write "your doctor reviews your progress throughout your admission", not "every day".

**The disclaimer** is added by the kit; don't write your own.

**Testimonials and films:** real, consented, no cure claims even inside quotes. The kit adds "Individual experiences vary." <!-- compliance-allow: cure, cure-claims -->

---

## 10. Languages (13): en, hi, ar, de, fr, es, it, pt, nl, ru, zh-Hans, ja, ko

> **Not yet supported — follow-up.** Nothing loads translation files yet, and the kit's own text (buttons, form, footer) is English only. Listing any locale other than `en` serves English copy under another `<html lang>`, so `lp:check` fails it (`locale.unsupported`). Keep `locales: ['en']`. The rules below describe the intended workflow once a locale loader and translated kit strings exist.

- Ship a locale only when a **reviewed** translation exists. List it in `locales`; the switcher shows only those.
- Write translations in `<slug>.<locale>.ts` with the same keys (once loaded). The same length budgets apply (±15% allowed for de, ru and fr).
- Every translation passes the claims and register lint for its locale, and needs clinical sign-off (Dr. Deepu John) before production.
- **Arabic:**
  - Use natural Modern Standard Arabic.
  - Numbers in prices stay Western Arabic numerals.
  - Program names keep the Latin-script Malayalam-Sanskrit name in brackets.
  - Check the RTL preview.
- **Hindi:** Devanagari script. Program names are transliterated plus the original in brackets.
- **Never machine-translate without review.** Machine output is a draft; mark it `review: 'pending'` and it will not ship.

---

## 11. Prices and currency

- Prices come only from the **approved tariff PDF**. Record `fees.source` (URL and page) and `validTo`.
- **Show 14-night all-inclusive totals** (owner: price is always shown). If the tariff is per night, total = per-night rate × nights, using the **exact** rate. Record the arithmetic in the change log.
- **Currencies:** INR, USD, EUR, GBP and AED, and **only** where the tariff gives a figure. Never convert. A currency missing from the tariff falls back to USD with a label, so **every priced row needs a USD figure** (`lp:check` error `fees.usd`); without one the page would show "[no tariff]".
- When `validTo` passes, `lp:check` fails, so update the fees or the page goes stale.
- No villa sizes (owner policy). Never show different rates for the same villa on one page.

---

## 12. Forms, tracking and codes (zero-touch, but you set these values)

| Field in content file | What to put | Where it comes from |
|---|---|---|
| `programDefault` | Program as named on the Ref Sheet | Ref Sheet |
| `tracking.campaignName` | The legacy `hdncampionname` value of the route being replaced (keeps CRM reporting continuous) | old page source / `campaign-v110/pages/<route>` |
| `tracking.trackId` | The legacy `hdntrackid` value, if any | same |

There is no form-variant field to set. The kit sends `form_variant` as `<form schema id>-<variant>`: `lp-v2-live-campaign-a` … `-d` for the default form, `lp-v2-3step-a` … `-d` when `form.schemaId: "three-step"`.

**Everything below is automatic.** Never re-implement or hard-code it:
- UTMs (`utm_source`, `utm_medium`, `utm_campaign`, `utm_term`, `utm_content`, `utm_keyword`) and `gclid`, `gbraid`, `wbraid`, `fbclid`, plus `lead_source_url`, `referrer` and `submissionToken`
- Endpoint: POST `/api/lead/`, `form:"landing-page"`
- Reply-channel handoff: WhatsApp `wa.me/919289838797`, Instagram `ig.me/m/kairaliayurvedichealingvillage`, Messenger `m.me/KairaliTheAyurvedicHealingVillage`. Only the opaque ref code goes in these links.
- Geo consent (EU/UK/EEA/CH only, with a working "Cookie preferences" footer control) and the language and currency auto-detection
- **Not built yet:** server-side lead conversions (Meta CAPI, Google enhanced conversions). The Meta `eventID` is already the submission token, ready for de-duplication when they are added

**Never** add form fields, health questions, free-text medical prompts, or any personal or health data to URLs.

---

## 13. Campaign inventory (the 18 ad routes) with suggested default variants

The default variant is a starting hypothesis. All four variants are generated for ad-level testing.

| # | Ad route | Slug | Default | Notes |
|---|---|---|---|---|
| 1 | /panchkarma-treatment.html | panchakarma | A | **Pilot.** Golden LP |
| 2 | /ayurvedic-treatment-packages.html | treatment-packages | B | Highest volume. Fees table matters most |
| 3 | /family-ayurvedic-retreat-kerala.html | family | B | Family/party step defaults to "Patient + companion" |
| 4 | /pain-management.html | pain-management | A | Condition page: strictest claims review |
| 5 | /preventive-rejuvenation-detoxification.html | rejuvenation | C | |
| 6 | /ayurveda-retreat-kerala.html | ayurveda-retreat | C | "retreat" is allowed; "resort" is not | <!-- compliance-allow: resort, retreat -->
| 7 | /weight-loss.html | weight-management | C | **Highest claims risk:** no kg, no timelines, no BMI. Duplicates /weight-loss-programme/ |
| 8 | /karkidaka-chikitsha-or-monsoon-wellness.html | karkidaka | C | Karkidakam/Karkidaka usage (§8.1). Seasonal `validTo` |
| 9 | /treatment-in-kerala.html | treatment-kerala | A | Head term |
| 10 | /kairali-cleansing-centre.html | cleansing-centre | A | |
| 11 | /wellness-resort-kerala.html | wellness-kerala | C | The slug contains a banned word; Vikash decides the URL. No "resort" in copy | <!-- compliance-allow: resort -->
| 12 | /Ayurveda_Treatment_Neo_S.India_Cities.html | south-india-cities | D | City geo, WhatsApp-heavy |
| 13 | /Kairali_Brand_and_Competition_Neo-original.html | brand | D | Brand/competitor: the shortest page |
| 14 | /offers/senior-citizen-offer/ | offer-seniors | B | `offer` required. Larger text is already built in |
| 15 | /offers/defence-and-paramilitary/ | offer-defence | B | Reconcile the offer % (code says 30%, homepage says 10%). Owner confirms |
| 16 | /offers/olympics-and-paralympics-offer/ | offer-olympics | B | |
| 17 | /kairali-air-india-maharaja-club.html | — | **excluded** | Keeps its approved design and member form |
| 18 | /offers/new/ | — | **excluded** | Redirect only |
| + | /lp/* (10 lean pages), /de/behandlung-in-kerala | — | later | Migrate after the pilot. DE needs a `de` locale |

---

## 14. `lp:check` reference (what fails, what warns)

| Rule | Level |
|---|---|
| Type errors anywhere in `campaign-v2/` (tsc runs first; `--no-types` skips it) | error |
| Unknown `img`, `film` or `doc` IDs | the file fails to load: `lp:check` stops with `Unknown … id` |
| Campaign not registered in `campaigns/index.ts` | `unknown campaign` (exit 2) |
| Length budgets (§3, including film titles, fee rows and the offer), visible-word range, reading level > grade 8 | error |
| Gallery category with fewer than 2 images | warning |
| Claims patterns (§9), numeric outcomes, superlatives | error |
| Banned register words without an override | warning; the PR reviewer blocks |
| British spellings (programme, centre, colour, practise as a verb, traveller) | error |
| Non-Ref-Sheet program names / therapy spellings | warning |
| Missing or invalid alt text (under 20 or over 125 chars), "image of", a filename | error |
| Claims (§9) in alt text | error |
| Banned register words in alt text, without an override | warning |
| Image long edge < 1600px for hero slots (`hero.image.*`, `hero.mobileImage`) or < 1200px for the rest (stillness, gallery), a duplicate image on the page, a non-`gccSafe` image when `modesty:'gcc'`, consent pending | error |
| `fees` without `source` or `validTo`; `validTo` in the past; a priced row without USD | error |
| `offer` without `name`, `headline`, `termsUrl` (https or same-site), `source`, or ISO `validFrom` ≤ `validTo`; offer expired | error |
| `pending()` on a production route | error |
| H1 without overlap with `adMatch.keywords` | warning |
| Locale listed without `review: 'approved'` | error |
| Any locale other than `en` (§10, not yet supported) | error |
| Reply-time promise ("minutes", "hours") near consultation wording | error |
| `data.stale`: Tripadvisor `asOf` > 120 days or a featured award `verifiedOn` > 180 days old (§17) | warning |

---

## 15. Worked example: Panchakarma (pilot) excerpt

```ts
hero: {
  overline: 'NABH-accredited Ayurvedic hospital · Kerala',                  // 43 ✓ (≤48)
  h1: 'Panchakarma, practiced the way it was meant to be.',                // 50 ✓ contains keyword noun
  h1Accent: 'meant to be.',
  standfirst: 'A physician-led admission in a quiet Kerala village — therapy, prescribed diet and deep rest, planned around you.', // 115 ✓
  image: { A: img('kt-199'), B: img('kt-199'), C: img('kt-190'), D: img('kt-202') },
  mobileImage: img('kt-190'),
},
admission: {
  heading: 'One doctor. One plan. Written for you.',
  steps: [
    { title: 'Before you arrive', body: 'A free video consultation with a qualified Ayurvedic doctor, who reviews your records and advises on length.' },
    { title: 'During admission',  body: 'Morning therapies, a prescribed diet from the hospital kitchen, gentle yoga and unhurried rest.' },
    { title: 'After discharge',   body: 'A written home regimen and a follow-up consultation, so the routine travels home with you.' },
  ],
},
stillness: { heading: 'Stillness is part of the prescription.', body: 'Warm oil, quiet rooms and monsoon light through tall windows. Nothing is asked of you.', image: img('gal-post-therapy-stillness-wakem') },
faq: [
  { q: 'Is the doctor consultation really free?', a: 'Yes. Before you book, a qualified Ayurvedic doctor consults with you by video at no charge, reviews any records you share and advises whether admission suits you and for how long.' },
  { q: 'How long should my admission be?', a: pending('C-14b', 'Physician-approved guidance on typical Panchakarma length (e.g. 14–28 nights)') },
  …
],
fees: pending('C2', '14-night all-inclusive totals per villa from the current tariff PDF'),
```

Image alt text, from the registry:
- `kt-199`: "Two therapists performing four-hand Abhyangam with warm medicated oil"
- `kt-190`: "A therapist preparing a patient for Shiro Abhyangam, a head therapy with warm oil"
- `gal-post-therapy-stillness-wakem`: decorative, `alt=""`

---

## 16. Integrations: what plugs in where (tags, events, SEO/AI-search, chat, forms)

Every integration point ships as an **empty, typed slot**. To switch a tool on, fill its slot (or its env var). Never edit components to add a tag. Everything lives in `campaign-v2/integrations/`, and the full table is in `integrations/README.md`.

| You want to… | Fill this | Where | Notes |
|---|---|---|---|
| Turn tracking on in production | `AHV_ANALYTICS=1` and `AHV_STAGING=0` | Vercel env | Master switch. It is never on in staging or preview |
| Use GTM | `INTEGRATIONS.gtm.containerId` / `NEXT_PUBLIC_LP_GTM_CONTAINERID` | `integrations/slots.ts` | Every event is also pushed to `dataLayer`, so GTM can own all tags |
| GA4 | `ga4.measurementId` | `slots.ts` | Events are sent 1:1 |
| Google Ads conversions | `googleAds.conversionId` plus one label per event in `googleAds.labels` | `slots.ts` | An event fires a conversion only if its label is filled. `generate_lead` fires only after a server-confirmed lead |
| Meta Pixel | `meta.pixelId` | `slots.ts` | `generate_lead` maps to `Lead`, with `eventID` = submission token (ready for CAPI dedupe) |
| Clarity / Bing UET / LinkedIn / TikTok | `clarity.projectId`, `bing.uetTagId`, `linkedin.partnerId`, `tiktok.pixelId` | `slots.ts` | In the EU/UK these load only after consent |
| Search-console verification | `verification.google`, `verification.bing`, `verification.facebook` | `slots.ts` | Rendered as `<meta>` only when filled |
| Chat widget and chat triggers | `chat.provider`, `chat.widgetId` | `slots.ts` | Call `onChatOpen()` / `onChatMessage()` / `onChatLeadCaptured()` from `integrations/chat.ts` in the vendor's callbacks |
| A new event | Add it to `EVENTS` in `integrations/events.ts`, then add `data-track="name"` on the element | — | Never put personal or health data in params |
| SEO / AI-search structured data | `campaign.extraJsonLd` (array) | the campaign file | MedicalClinic, FAQPage, VideoObject and Offer are generated automatically from the content |
| A different form (fields, steps or endpoint) | `campaign.form.schemaId`, `campaign.form.schema` and/or `campaign.form.adapterId` | the campaign file, plus `campaign-v2/forms/` | **The default is the live campaign enquiry form** (`LIVE_CAMPAIGN_FORM`: name, email, optional phone, optional "How can we help?", consent; one step, no step indicator). Set `form.schemaId: "three-step"` to switch to the 3-step channel form (`THREE_STEP_FORM`). A custom `form.schema` wins over both. Fields render from the schema. Validation, consent, honeypot and events stay in the shell. Keep `email` plus the consent field. Map every field to a lead column or to `message` (a `textarea` mapped to `message` is sent verbatim after the `Ref:` line) |

Note: a `guideUrl` the form returns must be a same-site path (starts with a single `/`); `safeGuideUrl` rejects anything else, including `//host`.

### Standard events (they already fire on every page)

| Group | Events |
|---|---|
| CTAs | `cta_click` (consult, whatsapp, ask, call, offer, email × position) |
| Form | `form_start`, `form_step_complete`, `form_error`, `form_submit_attempt`, `generate_lead` (server-confirmed only), `form_submit_failed` |
| Reply channel | `channel_select`, `channel_handoff` |
| Chat | `chat_open`, `chat_message`, `chat_lead` |
| Media | `film_play`, `gallery_open` |
| Switchers | `currency_change`, `locale_change` |
| Engagement | `scroll_depth` (50, 90) |

### Known live IDs (fill these at go-live; they are not active in the template)

| Tool | ID |
|---|---|
| GA4 | `G-PZBX8G4Y9N` |
| Google Ads | `AW-972059125`, lead label `fqrBCJvyugcQ9ePBzwM` |
| Meta Pixel | `1305161823266727` |
| Clarity | `rf5s9ugok4` |

The source for these is `analytics.config.json`.

### How to check the slots work

Run `pnpm lp:check`, then open the preview with `?lp_debug=1`. The page logs every `track()` call to the console with the adapters it reached. Then confirm the hits in GTM preview, GA4 DebugView and Meta Events Manager.

---

## 17. Awards & ratings — one source

- Every award, rating and review count on the pages comes from `campaign-v2/data/`:
  - `awards.ts`: `AWARDS`, featured and archive
  - `ratings.ts`: `TRIPADVISOR` and `NABH_VALIDITY`
  - `google-rating.ts`: the live Google rating
- The full refresh guide is `campaign-v2/data/README.md`.
- **Never type a rating, review count, award name or logo path** into a section, a campaign config or copy. Never guess one.
- **Tripadvisor:**
  - 4.6 / 5 from 450 reviews, "as of August 2026" (`asOf: "2026-08"`).
  - Copied from the proof block and footnote on https://ayurvedichealingvillage.com/.
  - The tile links to the listing in a new tab.
  - Spell it "Travelers' Choice" (Tripadvisor's official name).
- **Google:**
  - No stored number. The item shows only when the Places API answers. Enable it with `AHV_GOOGLE_REVIEWS_ENABLED=1`, `AHV_GOOGLE_PLACES_API_KEY` and `AHV_GOOGLE_PLACE_ID`.
  - Otherwise the item is omitted, with no placeholder and no gap.
- **Awards:**
  - Featured, most recent first: Travelers' Choice 2026, Haute Grandeur 2026, PATWA 2026, National Geographic Traveller 2026 collection, World Luxury Hotel & Spa Awards 2025. <!-- compliance-allow: luxury, spa -->
  - The A logo row shows at most 5 on desktop and 4 on phones. A logo that doesn't fit a phone is not requested there at all.
  - Logos are the live site's files, with their true pixel size recorded (one exception: the Haute Grandeur logo is cropped to its opaque bounding box, 667×375).
- **House rule:**
  - Award names with "Luxury"/"Spa" are proper nouns: logo alt or a captioned award name only, never running copy. <!-- compliance-allow: luxury, spa -->
  - `lp:check` skips the registry's exact award names in its register check.
- **Refresh:**
  - When `lp:check` warns `data.stale`, re-verify against the live site and update `campaign-v2/data/*.ts`, including `verifiedOn`/`asOf`.
  - Then run `node --test test/lp-v2-proof-data.test.mjs`, which checks every logo file exists at its recorded size.

## 18. Performance is pre-done — don't break it

The pages ship tuned for Lighthouse and PageSpeed Insights. The full detail is in `campaign-v2/PERF.md`.

- **Image size limits:**
  - Hero sources are at most 1600px on the long edge; other images are at most 1200px.
  - Use registry IDs only. The registry stores web-sized derivatives, never 8192px masters.
- **Exactly one priority image: the hero.** Never add `priority`, `fetchPriority="high"` or `loading="eager"` to any other image.
- **No third-party scripts outside `campaign-v2/integrations/`.** Tags, pixels and chat go into an integrations slot (§16), never into a section or the campaign file.
- **No client components in sections without need.** Sections are server components. Interactive pieces live in `sections/interactive/` and get plain data only.
- **Don't remove** a scrim (§6.7) or the hero preload to fix a look. Don't add `content-visibility` to sections either (Safari `#enquire` jumps and `scroll_depth` break). Change the photo instead.
- **Before publishing**, run these. Paste both results into the campaign's change log.
  - `pnpm lp:perf <slug>`: Lighthouse mobile on A–D plus desktop A, median of 3. It exits non-zero below the targets (Performance ≥ 95, Accessibility 100, Best Practices ≥ 95, LCP ≤ 2.5 s (a warning above 2.0 s), CLS ≤ 0.05, TBT ≤ 150 ms, v2 JS ≤ 90 KB, no `/design/*.js`). `node tools/lp-enquire-check.mjs --base <server>` checks the `#enquire` jumps at 390px in Chromium and WebKit.
  - The contrast check: `node tools/lp-contrast.mjs --base <server> --slug <slug>`, then again with `--white`.
- `lp:perf` is a pre-publish step, not CI.
- SEO scores 66 because the pages are noindex on purpose. Never remove noindex.
