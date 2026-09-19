# Handoff: Kairali AHV — enquiry/application (T07) and confirmation/post-submission (T10)

## Overview
Two page families for ayurvedichealingvillage.com, ported from the live WordPress site ahead of a Next.js rebuild.
**Family A — enquiry / application**: the site's highest-earning template group (1,111 clicks; /online-consultation/ 379, /apply-now/ 350, /contact-us/ 310). Four routes, four different forms.
**Family B — confirmation / post-submission**: what a person sees immediately after submitting. Ten routes; most were blank pages on the live site.

## About the design files
The files in this bundle are **design references created in HTML** — prototypes showing intended look, copy and behaviour. They are not production code to paste in. The task is to recreate them in the target codebase (Next.js is the intended destination) using its own patterns, then wire the real handlers. The bundled `.dc.html` files run standalone in a browser over HTTP for reference.

Each view is a single file that renders ALL routes of its family from a JavaScript dataset — one reader, several variants — so the visual system is defined once. Route selection in the prototype is `?route=/contact-us/` (a private review control, not a public picker).

## Fidelity
**High fidelity.** Final colours, typography, spacing, states and copy. Recreate pixel-accurately using the codebase's libraries. Everything marked **DRAFT** in the page is copy awaiting owner sign-off — keep it visibly flagged until approved.

## Screens / views
### Family A (`AHV Page Enquiry Desktop.dc.html` · `… Mobile.dc.html`)
| Route | Purpose | Shape |
|---|---|---|
| /contact-us/ | Route the enquirer to the right channel, then a short message form | Hero C → channel-router tiles → four channel cards with glyphs → message form + trust aside → photo band → Priya card → visit/location cards → founder quote → FAQ |
| /apply-now/ | Job application capture (zero source words — the form IS the page) | Hero C → sticky about-nav + single-column 23-field form |
| /jobs/business-development-manager/ | One vacancy + apply | Hero C → job sections → sticky apply form |
| /online-consultation/ | Consultation request, highest impressions (44,680) | Hero C → two-column intro + stepped request card (About you → Your concern → Review → Done) → journey band → credentials → FAQ |

Form rules, applied everywhere: one column; labels ABOVE every field, never placeholder-only; inputs ≥52px with a visible 2px border; errors in words beside the offending field (`role="alert"`, `aria-invalid`, `aria-describedby`); a required consent checkbox with a privacy-statement link ABOVE the submit; submit is the brightest control (60px, full width to 420px); a "what happens next" block stating who replies and when.

### Family B (`AHV Page Confirmation Desktop.dc.html` · `… Mobile.dc.html`)
Two states per route:
- **Direct visit (default)** — someone opened the URL without submitting. Claims nothing. H1 "This page only appears after you send us something", a plain explanation, and four exits (enquiry form, WhatsApp, e-mail, homepage).
- **Receipt** — only after verified handler success (in the prototype: `?receipt=prototype` or the `prototypeReceipt` control). Order: the route's own source content → receipt strip (tick, "Your message/booking/consultation request has been sent.", Sent at / copy went to / read by, response pledge) → contact row → The Healing Secrets download → "While you wait" cards.
Variants: `next-steps` (/contact-us/thank-you/, /thanks/, /ppc-thanks/), `legacy-queue` (/onlinebookingthankyou/), `legacy-confirmation` (/thanks-old/), `image-receipt` (/onlineconsultation-thanks/, /emailsubscriber/), and utility direct-visit-only routes (/book-now/, /cart/, /checkout/ — parked).

## Interactions & behaviour
- Forms: client validation only in the prototype. On submit, every failing control gets `aria-invalid` and a worded message, and focus moves to the first invalid one (including the consent box). Apply-now validation reads live form values, not React state.
- Consultation: four steps with progress, chip toggles, a review list, a consent gate, then a WhatsApp draft link. Opening a draft is never treated as receipt.
- Confirmation: no animation of any kind. A URL, refresh, prefetch or crawler must never produce a receipt or emit a conversion event.
- Links out (maps, WhatsApp) open in a new tab with `rel="noopener noreferrer"`; all navigation is default-prevented inside the prototype.
- Responsive: separate Desktop and Mobile files. Mobile stacks every row, full-width buttons, 320/390/430 tested.

## State
Per form: field values, per-field error flags, consent flag, a local "looks complete" flag. Consultation adds a step pointer (1 → 2 → review → done), chip selections and a modal-open flag. Confirmation adds route + receipt state, which in production must come from server-verified handler success only.

## Design tokens
Colours — page `#F7F4EA`; ink `#2A2118`; secondary ink `#514a3f`; muted `#75695A`; card `#FFFFFF`; band `#EFE9DA`; rule `#E9E2D3` / border `#E0D7C4`; brand brown (primary CTA) `#5A4420`, hover `#3E2E14`; bronze `#8F6212`, accent `#C1882C`; green link `#006038`, hover `#004226`; olive (success) `#6B7726` / `#4F5A1C`; error `#A32D2D`; dark band `#2A2014` with `#EEB41E` attribution; on-dark ink `#F7F4EA`.
Type — Marcellus (headings), Mulish (everything else). H1 `clamp(36px,4vw,56px)`/1.1; H2 `clamp(26px,2.4vw,34px)`; H3 22–24px; body 17–19px/1.7; labels 15.5px/700; eyebrows 12.5px/700, 2.6px letter-spacing, uppercase.
Spacing — 1220px max content width at 94%; section rhythm 56px + 48px top padding; card padding 22–40px; grid gaps 20–64px.
Radius 4px throughout (999px pills). Shadow: only `0 2px 0 #3E2E14` under primary buttons and `0 20px 50px rgba(20,14,6,.35)` on the legacy cover card. Targets ≥44px, inputs ≥52px, primary buttons 56–60px. Contrast AA; audience is 45+/55+.

## Assets
All self-hosted under `assets/img/`. Enquiry family: garden banner, resume clipboard, lotus mark, Kerala/Palakkad map, plus three photos re-encoded from the client's own library (verandah band, guest on the lawn, treatment hands). Confirmation family: two landscape banners, booking cover + logo, lotus. The Priya avatar and founder portrait are external on the live site and were NOT self-hosted — both circles carry the lotus mark instead; do not substitute stock faces for named people. The Healing Secrets PDF does not exist yet: the CTA renders as a visibly disabled placeholder until `window.AHV_CONFIRM.asset.href` is set.

## Files in this bundle
- Views: `AHV Page Enquiry Desktop.dc.html`, `AHV Page Enquiry Mobile.dc.html`, `AHV Page Confirmation Desktop.dc.html`, `AHV Page Confirmation Mobile.dc.html`
- Chrome (frozen, imported by every view): `AHV Chrome Header.dc.html`, `AHV Chrome Footer.dc.html`
- Data + render helpers: `assets/enquiry-family-data.js`, `assets/enquiry-family-render.js`, `assets/confirmation-family-data.js`, `assets/confirmation-family-render.js`
- Runtime: `support.js` (required; serve over HTTP, not file://)
- Images: `assets/img/`
- Briefs and contracts: `notes/two-families-claude-code-handover.md` (**start here**), `notes/enquiry-family-claude-code-handover.md`, `notes/enquiry-family-page.md`, `notes/confirmation-family-page.md`
- QA harnesses: `notes/enquiry-family-qa-harness.html` (28 states), `notes/confirmation-family-qa-harness.html` (70 states) — open each and call `runAll()`

## What is not done
No endpoint is wired; no submission is ever sent. Server-side head emission, BreadcrumbList, file uploads, map embeds, analytics/consent and the Healing Secrets PDF are all open. A passing client validation is not a delivered message.
