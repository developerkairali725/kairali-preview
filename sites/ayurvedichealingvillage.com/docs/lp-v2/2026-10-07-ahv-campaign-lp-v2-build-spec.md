# AHV Campaign Landing Template v2 — "The Quiet Admission" — BUILD SPEC

| | |
|---|---|
| Status | Design approved by owner (Abilash), 7 Oct 2026. Build not started. |
| Visual source of truth | Claude Design canvas: https://claude.ai/artifact/9YoYMS51SchBoDtSR2Cv3h. Artboards: Desktop, Mobile first screen, 3-step form, Mobile full page, Gallery, Tokens |
| Evidence | `docs/research/2026-10-07-landing-page-research.md` (audit, benchmarks, compliance, live-site audit, team feedback) |
| Code orientation | `docs/research/code-phase-orientation.md` (repo, worktree, Vercel mapping, open PRs) |
| Task | WOPS-AHV-FINAL-DRAFT-20260924-001 (parent) |

This spec is the build AI's brief. Where the canvas and this spec disagree, this spec wins. Raise any conflict as a question; never guess.

---

## 1. Owner decisions (locked 7 Oct 2026)

1. **Page type: hybrid.** A lean conversion page on top, with a long SEO body collapsed below it (`<details>`). The collapsed text must still pass every claims rule in §9, because Google and Meta review it too. Each page's index/noindex setting is Vikash's decision; until he decides, keep the current setting of the route being replaced.
2. **Register.** Luxury and sensuality come through the visuals; the wording stays clinical (KTAHV GST language lock). The owner can override wording per campaign. Overrides are recorded in config (§5), and the linter warns on them but does not block. <!-- compliance-allow: luxury -->
3. **Lead backend.** Reuse the live `/api/lead/` contract (§7). Never build a second backend.
4. **Primary CTA:** "Get free doctor consultation" (Gaurav, 7 Oct). This label may ship only if the consultation really is given by a qualified doctor (see §11, open item C1).
5. **Chat** is labelled "Ask anything". It sits bottom-right on desktop and inside the mobile sticky bar, never in a top ribbon.
6. **Price display** is a per-campaign toggle (`showPrice`). Gaurav wants prices hidden; the research favours a transparent "from" price. Decide by A/B test (§12).
7. **Mobile:** nothing scrolls sideways. No carousels, swipe rows or horizontal scrollers (40+ audience).
8. **"Since 1908" is not used** until the owner settles 1908 vs 1989.
9. **Design first.** Visual changes go through the Claude Design canvas before code.
11. **Four design variants A–D (owner, 7 Oct)** all read the same campaign content file: A "Quiet Admission", B "Garden Light", C "Editorial", D "Direct". The **variant** controls palette, hero layout, image treatment and section order and length. The **content** never changes per variant.
12. **Test split is at the ad level.** Each variant has its own noindex URL (`/<campaign>/a|b|c|d` or `?v=`, decided at build). Traffic is split with Google Ads Experiments and Meta A/B tests. There is no on-site assignment cookie.
13. **Old-page copy (18 campaign pages):** rewrite it to fit the new length budgets and the clinical voice, and remove risky claims. Keep approved facts verbatim: rates, offer terms, programme names, durations, inclusions, doctor details. Every change goes in a change log.
14. **Price is always shown,** as an all-inclusive 14-night "from" total. `showPrice` defaults to true. Gaurav's objection is recorded; a price-hidden test can run later on the winning variant.
15. **The free doctor consultation is real:** a qualified doctor, at no charge (owner, 7 Oct). The CTA "Get free doctor consultation" is accurate.
16. **Heritage:** two separate facts. "Ayurvedic family tradition since 1908" and "The Healing Village, Palakkad, since [opening year]". The year is a content slot.
17. **Model images:** model releases exist for the 2025/26 shoot (kt-199, kt-190, kt-188 and the rest), so they can be used in production.
18. **Social handles:** Instagram is @kairaliayurvedichealingvillage (`ig.me/m/kairaliayurvedichealingvillage`). The Facebook Page username for Messenger is a config slot until it is confirmed.
19. **Scope split:** Claude builds the designs, the coded template kit (components, 4 variant layouts, schema, validators, one sample campaign) and the authoring guide. A separate AI or session writes one content file per campaign.
24. **Spelling and naming (Anupam, 6 Oct):**
    - American English (program, center, practiced).
    - Malayalam-Sanskrit therapy names (Abhyangam, Udhwarthanam, …).
    - Program names are the English name followed by the Ref Sheet name in brackets.
    - Karkidakam (noun) vs Karkidaka (combining form).
    - The 14:00 routine slot is cooking demo / garden visits / workshops, never a factory visit.
25. **The Messenger page is confirmed:** `m.me/KairaliTheAyurvedicHealingVillage` (from Anupam's signature). C13 is closed for handles.
20. **Language and currency switchers on every page, every variant,** auto-set from the visitor's location (§6b). There are 13 languages, the live site set: en, hi, ar, de, fr, es, it, pt, nl, ru, zh-Hans, ja, ko.
21. **Consent is geo-based (owner, 7 Oct; owner had first asked for no consent at all).**
    - There is no banner outside EU/EEA/UK/CH: tracking fires on the first page view.
    - EU/EEA/UK/CH visitors get a compact banner (Reject all · Manage · Accept all, equal weight) that sits above the bottom bar and never covers a CTA. Advanced Consent Mode v2 applies to them.
    - Every form lead is counted server-side for all visitors (§8).
22. **No reply-time promises for the consultation.** It is actually arranged within about 12 hours, and the owner said not to state it. Never write "reply in minutes" or "within 2 hours" about the consultation. Only the AI chat channels may say they answer instantly.
23. **Mobile bottom bar spec:**
    - Grid: `72px | 1fr | 72px`, height 56px, 8px gap.
    - Left: WhatsApp tile (icon + "WhatsApp", 12px). Centre: "Free doctor consultation" on ONE line, 15px bold. Right: Ask tile (icon + "Ask").
    - No pill/capsule shape and no sub-label.
    - Corner radius follows the variant skin: A 2px, B 14px, C 0, D 12px.
    - Includes the safe-area inset.
10. **Omnichannel replies (owner, 7 Oct).** The visitor chooses the channel we reply on: WhatsApp, Instagram, Facebook Messenger, on-page chat, phone or email. Every messaging channel has AI replies plus lead parsing and routing, so they are equally fast. The page never ends at a passive thank-you: the success screen hands the visitor straight into a live conversation on their chosen channel (§7b).

## 2. Where and how to build

- **Repo:** `kairali-digital/kairali-web-factory`. App: `sites/ayurvedichealingvillage.com`.
- **Worktree:** create a new isolated worktree on the SSD. Do not use the occupied `ahv-final-draft-20260924` worktree or the canonical checkout. Before choosing the base (current `origin/main` or the AHV integration branch), check the open PRs: #353 (consent), #341, #340 (forms Sheet).
- **Directory:** `sites/ayurvedichealingvillage.com/campaign-v2/`, a sibling of `campaign-v110/`. Do not edit `campaign-v110/` pages; v2 sits beside them.
- **Routes:**
  - Pilot first at a new **noindex** preview route: `app/(campaign)/lp-v2/[slug]/page.tsx`.
  - A live ad URL (for example `/panchkarma-treatment.html`) moves to v2 only with written approval from both the owner and Vikash. Ads point at those URLs.
- **Reuse; do not fork:**
  - `campaign-v110/lib/enquiry` and the `/api/lead/` payload
  - `CookieConsent`. Rebase onto PR #353's granular consent; don't rebuild it.
  - `ChatWidgetSlot` (relabelled)
  - the analytics consent gating already in production
- **Guardrails:** PR lane only. No production deploy, no main merge, and no changes to DNS, aliases, Ads or consent/analytics *behaviour*. Every clinical-copy change needs Dr. Deepu John's sign-off before production.

## 3. Design tokens (`campaign-v2/tokens.css`)

```css
:root{
  --night:#121A15;   /* hero, deep bands, primary button; ivory on it 16.1:1 */
  --ivory:#F7F4EA;   /* page ground */
  --paper:#FFFDF7;   /* cards, form surface */
  --ink:#2A2118;     /* text, 14.4:1 on ivory */
  --muted:#5C5448;   /* secondary text, 6.8:1 */
  --bronze-text:#7A5A22; /* overlines on ivory, 5.8:1 */
  --bronze-line:#B8955A; /* hairlines & numerals ONLY — 2.6:1, never text */
  --champagne:#D8C3A0;   /* overlines on night, 10.3:1 */
  --wa:#1F5E43;      /* WhatsApp actions only; white on it 7.7:1 */
  --error:#A3212C;   /* 6.8:1 */
  --focus:#6B7726;   /* 3px outline, 2px offset */
  --line:rgba(42,33,24,.14);
  --radius:2px;
}
```

- **Type: two families only.**
  - Marcellus 400 (display) and Mulish 400/500/600/700 (text), self-hosted through `next/font`. No Google CSS at runtime.
  - Sizes, desktop then mobile:
    - H1: 50 / 34
    - H2: 46 / 30
    - H3: 26 / 20
    - Body: 18 / 17, line-height 1.6–1.65
    - Overline: 13px, weight 600, letter-spacing .22em, uppercase
- **Retired:** marigold, pill buttons, uppercase button labels, motifs, gradient washes. The only gradient allowed is one functional scrim on the mobile hero photo.
- **Buttons:**
  - Sentence case, weight 600, 16px, min-height 54px (50px in the bar), 2px radius.
  - Variants: night, ivory-on-night, whatsapp, outline.

## 4. Page anatomy

Section order is fixed; content comes from config. Each section is one component in `campaign-v2/sections/`. Desktop is the canvas Main artboard; mobile is the Mobile-Full artboard.

| # | Component | Desktop | Mobile | Notes |
|---|---|---|---|---|
| 1 | `Header` | Absolutely positioned over the hero. White KTAHV logo SVG at 76px height. Right side: phone link and an outline WhatsApp button. | 54px logo with a 44px call icon | **No nav, no ribbon.** |
| 2 | `Hero` | 46/54 grid: Night copy panel + photo with caption | Photo 440px, then copy on Night | Contents: overline, H1 (message-matched to the ad), standfirst, optional price line, CTAs ("Get free doctor consultation" + "WhatsApp Priya"), one trust line. The hero photo is the LCP element: `next/image` with `priority` and `sizes`, never a CSS background. |
| 2b | `ConsultBar` | White card overlapping the hero bottom by 96px: Programme, Preferred month, Length of stay, button | not shown (hero CTA opens the step form) | The **whole bar must end within the first 780px** at 1440×800. Measured on the canvas at 773px. Submitting carries the values into step 1 of `#enquire`. |
| 3 | `ProofStrip` | Tripadvisor logo + rating, Google rating, 4–5 award logos | Ratings in two columns, 4 logos | Ratings must be live or dated figures; no invented numbers. Each logo appears **once** on the page. |
| 3b | `OfferBand` (toggle) | Bronze-bordered card: offer name, headline, terms link, CTA | stacked | Hidden when `offer` is null. Terms must link to real terms. |
| 4 | `Admission` | Steps I/II/III plus Included / Charged separately | Steps, with "What is included" in a `<details>` | |
| 5 | `StillnessBand` | Full-bleed sensual image with a Night text card | image, then text | The image is decorative: `alt=""`. |
| 6 | `Films` | One featured film plus 3 rows | Featured film plus stacked rows (**no side-scroll**) | YouTube **facade**: thumbnail and play button only. Load `youtube-nocookie` only on click, and only after consent if the CMP classes it as non-essential. No autoplay. Captions required. "Individual experiences vary." |
| 7 | `Doctors` | 3 cards with 1:1 photos | stacked rows (photo 104px + text) | Name, role, qualification, years, languages. "Doctor availability is confirmed when you enquire." |
| 8 | `Village` | 12-column mosaic plus a "View all photos" button | hero image, 2 thumbnails, a full-width button | Opens `Gallery`. |
| 8b | `Gallery` | Modal dialog: category filter buttons (`aria-pressed`), grid, lightbox with prev/next/close and an n/N counter | full-screen; grid of 2 columns | Focus trapped inside, Esc closes, focus returns to the trigger, swipe optional but buttons always shown. A CTA sits inside the lightbox. |
| 9 | `Fees` (if `showPrice`) | Currency switch (INR/USD/EUR/AED, `aria-pressed`) + villa rows | stacked rows | From config only. Shows validity date, "taxes as applicable" and "medicines/tests charged separately". **No villa sizes.** |
| 9-alt | `FeePlanCta` (if not `showPrice`) | "Your fee plan, written after your consultation" + CTA | same | |
| 10 | `Enquiry` `#enquire` | Night section: left copy and contacts, right the 3-step form | stacked | See §7. |
| 11 | `Faq` | `<details>` list, 4–6 items, FAQPage JSON-LD | same | The first item must answer "Is the doctor consultation free?" accurately. |
| 12 | `LongForm` | One collapsed `<details>` holding the SEO body | same | It passes the claims linter. |
| 13 | `Footer` | Logo, Visit (address and map), Speak to us, Accreditation, disclaimer, legal links | stacked, 44px link targets | Grows to fill the page end. Legal links: Privacy, Terms, Cookie preferences (re-opens the CMP), Main website. |
| — | `AskAnything` | Floating pill at bottom-right → channel sheet | inside `MobileBar` → bottom sheet | The sheet lists Chat here now · WhatsApp · Instagram message · Facebook Messenger · Call. It is a dialog with focus trap, Esc to close, 54px rows and the AI-disclosure line. The on-page chat vendor loads only after consent **and** only after the visitor taps "Chat here". |
| — | `MobileBar` | — | Sticky: WhatsApp · Free doctor consultation · Ask anything | **Hidden until the cookie choice is made**, so it never overlaps the banner. Never covers a focused field (WCAG 2.4.11). The page gets bottom padding equal to the bar's height. |

## 5. Per-campaign config (`campaign-v2/campaigns/<slug>.ts`)

> **The authoritative field list, length limits and rules for content live in `2026-10-07-ahv-campaign-lp-authoring-guide.md` §3–§4.** The type below is the build-side summary; keep the two in sync.

```ts
export type CampaignConfig = {
  slug: string;                       // 'panchakarma'
  route: string;                      // final path; pilot = '/lp-v2/panchakarma'
  index: boolean;                     // Vikash decides; default = route's current state
  adMessage: { h1: string; standfirst: string; overline: string }; // message match
  programmeDefault: string;           // preselected in step 1
  hero: { desktop: ImageRef; mobile: ImageRef; caption?: string };
  stillness: ImageRef;
  showPrice: boolean;
  fees?: { validTo: string; currencies: ('INR'|'USD'|'EUR'|'AED')[]; rows: FeeRow[]; fromPrice: Money };
  offer?: { name: string; headline: string; termsUrl: string; validFrom: string; validTo: string } | null;
  films: { featured: Film; more: Film[] };   // Film = { youtubeId, title, kind: 'property'|'patient'|'treatment'|'yoga', captionsUrl? }
  doctors: DoctorRef[];               // from the doctors registry, never free text
  gallery: { category: 'Villas'|'Therapies'|'Grounds'|'Dining'|'Yoga'; image: ImageRef }[];
  faq: { q: string; a: string }[];
  longForm?: string;                  // MDX, linted
  modesty: 'standard'|'gcc';          // gcc = alternative image set (covered shoulders, no swimwear)
  wordingOverrides?: { term: string; approvedBy: 'owner'; date: string; reason: string }[];
};
```

- `ImageRef` points at a file in the image pipeline (§10) and carries alt text and a consent status. The build fails if `consent !== 'confirmed'` for any image showing an identifiable person.
- **Yoga campaigns:** `films` uses `kind:'yoga'`, and the gallery adds a `Yoga` category. A current yoga-class film is needed (open item C7).

## 6. Interaction and state

- **ConsultBar → Enquiry:** carry the values over (no retyping across steps, WCAG 3.3.7) and scroll to `#enquire` with step 1 already filled. If JS is off, the bar is a normal GET form that pre-fills through the query string.
- **3-step form:** steps are 1 Programme + month, 2 Length + who is coming + reply channel, 3 Contact + consent (§7b).
  - Each step is a `<fieldset>` with a `<legend>`.
  - Show progress as "Step n of 3" text plus the bar.
  - Back keeps the entered values.
  - Validation runs on Continue, with the error message linked through `aria-describedby`, focus moved to the first error, and errors written in plain words.
- **Currency switch:** a client-only toggle with `aria-pressed`. The default comes from geo (CF-IPCountry header → INR / AED / EUR / USD), overridable by the visitor, and remembered in localStorage (wrapped in try/catch).
- **Reduced motion:** with `prefers-reduced-motion`, no scroll animations. Never use autoplaying carousels.

## 6b. Language and currency

- **Detection:**
  - Language comes from `Accept-Language` (best match within the campaign's *reviewed* locales), falling back to English.
  - Currency comes from the Cloudflare `CF-IPCountry` header: IN→INR, AE/SA/QA/KW/OM/BH→AED, Eurozone→EUR, GB→GBP, everything else→USD.
  - Detection runs at the edge (middleware). There are **no redirects:** the same URL renders the detected locale, which avoids ad "destination mismatch".
  - A manual choice is remembered in localStorage, wrapped in try/catch.
- **Switcher:** a header chip ("EN · INR", globe icon, 44px) opens a dialog (Locale-Switcher artboard). Language names appear in their own script with a `lang` attribute; there are 5 currency buttons. Detected values are explained ("Set for you from your location").
- **A language appears only if this campaign has a reviewed translation.** The content file lists `locales: [...]`. Translations must pass the same claims and register lint per locale, including banned-word equivalents (DE Kur/Luxus/Gäste, FR luxe/cure, and so on). Clinical sign-off applies per locale. <!-- compliance-allow: cure, cure-claims, gäste, luxe, luxus -->
- **Right-to-left (ar):** `dir="rtl"`, logical CSS properties throughout (`margin-inline`, `padding-inline-start`), mirrored arrows, and a non-mirrored logo.
- **Fonts per script:**
  - Latin and Cyrillic: the variant fonts (Mulish and Plus Jakarta Sans cover Cyrillic; Marcellus and Instrument Serif fall back to a matching serif for Cyrillic).
  - Devanagari: Noto Sans/Serif Devanagari.
  - Arabic: IBM Plex Sans Arabic.
  - CJK: system fonts only (no web font download).
- **Prices:** shown **only** from approved tariff tables per currency. Never auto-convert. If a currency has no approved table, show USD and label it.

## 7. Forms and lead contract

- **Endpoint:** POST `/api/lead/` with JSON, `form:"landing-page"`. This is the existing contract; read `campaign-v110/lib/enquiry` and `FORM-INTEGRATION-SETUP.md` first.
- **Field mapping** (existing names; any new column needs a backend PR coordinated with Deepu and PR #340):

| UI field | Payload | Note |
|---|---|---|
| Programme | `fields.programme` **(new)**; until the backend accepts it, prefix `fields.message` with `Programme: …` | flag to backend |
| Preferred month | `fields.preferred_month` **(new)**, with the same fallback | |
| Length of stay | `fields.duration` | existing |
| Who is coming | `fields.party` **(new)**, with the same fallback | |
| Full name | `fields.fname` (+ `lname` split server-side or left empty) | existing |
| Email | `fields.email` | existing |
| WhatsApp/phone with country code | `fields.phone` + `fields.country` | existing; use `autocomplete="tel"` |
| Consent (required, unticked) | `fields.consent=true` + server time | existing |
| Marketing (optional, unticked) | `fields.marketing_opt_in` **(new)** | must be separate from consent |
| Reply channel (step 2, required, default WhatsApp) | `fields.preferred_channel` **(new)**: `whatsapp\|instagram\|messenger\|chat\|call\|email` | drives routing and the success screen |
| hidden | `landing_page_path`, `form_variant:"lp-v2-3step"`, `campaign_name`, `track_id` | existing |
| top level | `submissionToken` (UUID), `site_language`, `lead_source_url`, `referrer`, UTMs, `gclid`, `fbclid`, `gbraid`, `wbraid` | existing |

- **Removed friction:** no gender field (`rdogender`), no maths captcha, no free-text message on the first pass.
- **Never collect health data on this form.** No conditions, medication or history. The doctor collects those privately later.
- **Consent label (verbatim until legal supplies final text):** "I agree that Kairali may contact me about this enquiry by {chosen channel}, phone or email." followed by a link to the privacy notice. The chosen channel is named in the label, so the opt-in is specific to it (WhatsApp Business opt-in rules).
- **Phone field:** required when the channel is WhatsApp or call; optional otherwise.
- **Must work without JavaScript.** The server-rendered form posts natively (a route or server action that accepts form-encoded data and redirects to the thanks page). Remove the `action="/api/forms-unavailable"` pattern from v2.
- **Spam protection:** a honeypot field that is actually **sent and rejected server-side**, plus the existing rate limit. Optionally Cloudflare Turnstile in non-interactive mode. Never a visible CAPTCHA (WCAG 3.3.8).
- **States, all copied from T07:** default, field error, consent missing, submitting (button disabled with spinner text), success (redirect to the noindex `/ppc-thanks/` carrying the token), server error, and not configured (503: show the truthful message plus WhatsApp and email, never a fake success).

## 7b. Omnichannel handoff (after a successful submit)

The 3-step form becomes 1 Programme + month, 2 Length + who is coming + **reply channel**, 3 Contact + consent. See the canvas Form-Flow artboard.

- **Success screen:**
  - "Enquiry received · ref {code}". `{code}` is a short code derived from `submissionToken`.
  - One primary "Continue on {channel} now" button.
  - "Or continue on" buttons for the other channels.
  - The AI-disclosure line.
  - Nobody is ever left on a passive "we'll get back to you" page.
- **Channel rules** (Meta platform constraints, verify against current Meta docs at build time):

| Channel | How the conversation starts | Link format | Lead context |
|---|---|---|---|
| WhatsApp | Visitor taps the link (visitor-initiated) **or** the business sends an approved *template* message. Proactive messaging is allowed only with the WhatsApp opt-in from the consent box | `https://wa.me/919289838797?text=` + an URL-encoded message holding **only** the ref code, e.g. "Hello, my enquiry ref is KT-7Q4M" | The router matches the ref code to the stored lead |
| Instagram | **Visitor must message first.** The business cannot DM a cold user; replies are allowed within Meta's messaging window | `https://ig.me/m/<handle>?ref=<code>` | `ref` arrives in the messaging webhook |
| Messenger | **Visitor must message first** (same rule) | `https://m.me/<page>?ref=<code>` | `ref` in the `messaging_referrals` webhook |
| Chat here | On-page widget (`ChatWidgetSlot`), opened with the ref pre-attached | — | passed to the widget |
| Call | `tel:` link, plus a callback promise | — | the team gets a lead row with `preferred_channel=call` |
| Email | Reply from info@kairali.com | — | lead row |

- **Hard rules:**
  - Links and `text=` / `ref=` carry **only the opaque ref code**. Never a name, email, phone, programme or any health detail (privacy, and Meta health-data restrictions).
  - Store the lead first (`/api/lead/` returns 200 with `received`), then show the handoff. If the store fails (503), still show every channel button with a generic message so the visitor can talk, and never claim the enquiry was saved.
  - **AI disclosure (EU AI Act Art. 50, effective Aug 2026)** goes on the sheet, step 2 and the success screen: "Our AI assistant replies first; a member of the patient team follows up."
  - The AI assistants follow the same claims rules as §9: no cures, no outcome promises, and escalate medical questions to a doctor. <!-- compliance-allow: cure-claims, cures -->
- **Routing:** the existing AI routing stack receives `{ref, preferred_channel, programme, month, duration, party}` from the lead store. No health data is in the payload. Confirm the integration point with whoever owns the routing stack (open item C13).

## 8. Measurement

- **Consent model (owner decision 21):**
  - A geo check at the edge (CF-IPCountry) decides whether the banner exists at all.
  - Outside EU/EEA/UK/CH, tags load immediately with Consent Mode defaults set to granted.
  - Inside, defaults are denied, the banner shows, and Advanced Consent Mode v2 sends cookieless pings.
  - The form consent box covers contacting the visitor and measuring the enquiry. On a stored lead, send server-side: Google Ads enhanced conversions for leads or an offline conversion import (hashed email/phone), and Meta Conversions API (hashed, with `event_id` = `submissionToken`). No health or programme fields are sent.
  - Rebase on PR #353 (granular consent) for the EU banner; do not build a second CMP.
- **Keep from production:**
  - The tag IDs: GA4 `G-PZBX8G4Y9N`, Ads `AW-972059125`, Clarity, Meta Pixel. When they load follows the geo consent model above.
  - `generate_lead` fires **only** after `/api/lead/` returns 200 with `status:"received"`. It is de-duplicated with `submissionToken` as `transaction_id` / `eventID`.
- **Allowlisted UI events** (outside EU/UK always; inside only after consent): `cta_click {cta: consult|whatsapp|ask|call|offer, position: hero|bar|section|sticky|footer}`, `form_step {step:1|2|3}`, `film_play {kind}`, `gallery_open`, `currency_change`, `price_variant_view {variant}`, `channel_select {channel}`, `channel_handoff {channel}` (fired when the success-screen button is tapped).
- **Never send** programme or condition names, free text or any health data to ad platforms. Use condition-neutral URLs (Meta health-data restrictions).
- **WhatsApp clicks are a micro-conversion only,** never imported as a lead.
- **Fix found in the live audit:** for EU/UK visitors, Chatbase, Cloudflare Insights and YouTube must not load before consent.
- **Offline conversions** (qualified lead, booking) through CRM import are a later phase. Do not build them here.

## 9. Compliance (blocking checks in CI)

- **`campaign-v2/lint/claims.ts`** runs over all config text, the long form and FAQ. It fails the build on:
  - cure/curative language <!-- compliance-allow: cure, cure-claims -->
  - disease-treatment claims (diabetes, obesity "treatment/cure", cancer, thyroid, BP, cholesterol and others; list the DMR Act Schedule terms) <!-- compliance-allow: cure, cure-claims -->
  - numeric outcomes ("lose X kg", "% patients", "N days")
  - "scientifically proven", "zero side effects/adverse", "guaranteed", "best"/"Asia's best" superlatives without a dated source
  - before/after
  - unsubstantiated "N+ lives/patients" figures (one owner-approved figure may be whitelisted with a source)
- **Banned-register words** (spa, resort, holiday, luxury, cure, journey, guests, in all locales) → **warning**. They pass only with a `wordingOverrides` entry. Award proper nouns (for example "World Luxury Spa Awards") are allowed in logo alt text only. <!-- compliance-allow: cure, cure-claims, guests, holiday, journey, luxury, resort, spa -->
- **Fixed disclaimer** in the footer: "Ayurvedic programmes at Kairali are supervised by qualified doctors and complement, not replace, the medical care you already receive. Individual experiences vary."
- **Imagery:**
  - Draped bodies; focus on hands, oil and light.
  - No before/after, no tape measures.
  - Ages 40–65 represented.
  - `modesty:'gcc'` set for Gulf campaigns.
  - Written consent is confirmed for every identifiable person.
- **Testimonials:** real, consented, no cure claims even inside quotes, and "Individual experiences vary." shown with them. <!-- compliance-allow: cure, cure-claims -->
- **Privacy:** a privacy notice link at the form, consent stored with a timestamp, the marketing opt-in kept separate, withdrawal as easy as giving consent (DPDP 2027 standard), a working "Cookie preferences" footer link, and Global Privacy Control honoured.

## 10. Performance and images

- **Budgets** (mobile, field p75): LCP ≤ 2.5s, INP ≤ 200ms, CLS ≤ 0.1. Above-the-fold JS ≤ 90KB compressed for v2 code. No `/design/*.js` bundle on v2 routes.
- **Images:**
  - `next/image` with AVIF/WebP, `sizes`, explicit dimensions, and `priority` on the hero only. Every other image lazy-loads.
  - The header logo is **not** lazy (the live site's logo is, which leaves a blank first paint).
  - Masters come from `Kairali-Image-Library/ahv-edited/` and must never be hotlinked from WordPress.
- **Fonts:** subset through `next/font`, `display: swap`, two families only.

## 11. Open content items (owner input needed before the pilot goes live)

| ID | Needed | Owner | Blocks |
|---|---|---|---|
| ~~C1~~ | RESOLVED 7 Oct: a qualified doctor, free. Previously asked: what exactly the "free doctor consultation" is: who gives it, format, length. The live footnote calls it a "lifestyle consultation" | Owner / Dr. Deepu John | CTA label |
| C2 | 14-night "from" totals per villa category, currencies, validity date | Sales / owner | Fees, hero price |
| C3 | Current offer (if any): name, terms page, dates | Owner / Astha | OfferBand |
| C4 | Doctor qualifications, years in practice, languages; confirm the three doctors shown | Dr. Deepu John | Doctors |
| ~~C5~~ | RESOLVED 7 Oct: data/ratings.ts (Tripadvisor 4.6 / 450, as of August 2026); Google via the Places API when enabled (`AHV_GOOGLE_*`), otherwise omitted. Previously: Google and Tripadvisor rating and review count, with the date checked | Vikash | ProofStrip |
| ~~C6~~ | RESOLVED 7 Oct: releases exist. Previously: written model consent for kt-199, kt-190, kt-188, kt-192, kt-174, kt-181 | Owner | Hero images |
| C7 | A current yoga film; confirm the patient films may be reused | Owner / Astha | Films (yoga campaign) |
| C8 | Healing Village opening year (1908 = family tradition, decided) | Owner | Overline/footer |
| C9 | Full postal address and map link (LOCKED_FACTS) | Ops | Footer |
| C10 | Reply-time promise ("within 2 hours, 9am–9pm IST"?) | Sales (Priya) | Hero, thanks page |
| C11 | Final consent wording from legal (EN/DE/FR) | Owner / legal | Form |
| ~~C12~~ | RESOLVED 7 Oct: always shown. Previously: price shown or hidden as the default | Owner + Gaurav | Fees |
| C14 | Is the patient seen by a doctor every day of the admission? Until confirmed, say "throughout your admission" | Dr. Deepu John | Admission copy |
| C13 | Routing integration (handles confirmed: IG kairaliayurvedichealingvillage, FB KairaliTheAyurvedicHealingVillage): whether `ref` codes are parsed by the AI router, the WhatsApp template message approved for proactive first contact, and who owns the stack | Owner / routing owner | Omnichannel handoff |

## 12. Rollout

1. **Build the template** plus the Panchakarma pilot config at `/lp-v2/panchakarma` (noindex, staging only).
2. **QA** using the done-bar (§13), with desktop 1440 and mobile 390 screenshots compared against the canvas.
3. **Review:** owner visual sign-off, Dr. Deepu John's clinical sign-off, Gaurav/Vikash ad-match review.
4. **A/B test (with Vikash):** price shown vs hidden. Split 50/50 by a Vercel Flag at the edge. Primary metric: qualified-lead rate (sales-tagged), not raw form fills. Run for at least 2 weeks or 100 leads per arm.
5. **Move ad traffic:** only with written approval from both the owner and Vikash, per URL. Keep the UTM contract.
6. **Later campaigns:** weight management, rejuvenation, pain management, family, monsoon, yoga. Each is a config file, not new components.

## 13. Done-bar (every v2 page)

- [ ] Matches the canvas at 1440 and 390 (screenshots attached to the PR)
- [ ] No horizontal overflow at 320, 390 and 768; no horizontal scroller elements on mobile
- [ ] Step-1 form or consult CTA fully visible within the first 780px on desktop and the first screen on mobile
- [ ] WCAG 2.2 AA: contrast as specified in the tokens, 44px targets, visible focus, focus not obscured by the sticky bar, labels on every input, error identification, keyboard-operable gallery and films
- [ ] Body text ≥ 17px; nothing below 12px
- [ ] Claims linter passes; wording warnings are either resolved or have owner overrides
- [ ] Forms: no-JS submission works; honeypot is rejected server-side; a 503 shows the truthful message; success redirects to `/ppc-thanks/`; tested with intercepted or isolated submissions only
- [ ] EU/UK (simulate CF-IPCountry=DE): nothing non-essential loads before consent. India (IN): tags load immediately. Both checked in the network tab
- [ ] Locale: Accept-Language de + IP IN renders German with INR, no redirect; the switcher overrides both; Arabic renders RTL with no overflow
- [ ] No reply-time promise for the consultation anywhere
- [ ] Lighthouse mobile ≥ 90 for performance, accessibility and SEO on the preview; LCP element is the hero `<img>`
- [ ] JSON-LD: MedicalClinic family plus FAQPage; no `@type: Resort` <!-- compliance-allow: resort -->
- [ ] No placeholder `[...]` text left in a production config
