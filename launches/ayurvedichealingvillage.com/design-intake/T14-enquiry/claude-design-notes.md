# Forms family template (T07-adjacent) — Desktop + Mobile — 21 Sep 2026

Files: `AHV Template Forms Family Desktop.dc.html` (1440px) · `AHV Template Forms Family Mobile.dc.html` (390px).
Built to the owner's standing forms brief (grey placeholder chrome; fixed closing block reproduced verbatim).
Scope: template only. No endpoint, no payment step, nothing published.

## Shape
Desktop: hero (breadcrumb → eyebrow → one h1 → standfirst with bronze rule) → two-column band, form card left (max 640px fields) + sticky trust rail right (372px) → page prose region (the 871-word zone, two images) → fixed closing block → 620px footer placeholder.
Mobile: hero → trust list in a sand panel ABOVE the form → full-bleed white form band (56px controls) → direct-contact buttons → prose region with full-bleed images → closing block with three full-width stacked buttons. Not the desktop squeezed: rail becomes a pre-form panel, images go edge to edge, contact channels move up.

## Form
Single column, labels above every field, hints below the label, 52px (desktop) / 56px (mobile) controls with a 1.5px #6F6152 border, worded inline errors beside the offending field plus an error summary that takes focus, required consent checkbox with privacy-statement link above the submit, submit solid #EEB41E and the brightest element on the page, "What happens next" block immediately above the submit, success panel states who has the details.
Validation is client-side only and marked "Prototype — no endpoint is wired in this file."

## Content extremes (Tweaks props)
`variant`: Enquiry form (871 words, full field set + prose region) · Online consultation (19 words, 4 fields, no prose region) · Apply now (0 words, application field set incl. CV upload, no prose region).
`language`: English · French — swaps every field label, hint, error and button to French to prove long labels wrap without breaking.

Where it strains: the desktop trust rail is sticky and 372px wide — if a page in this family carries more than about six trust items or a very long field set, the rail runs out before the form does and leaves whitespace at the bottom of the column; everything else (prose region, field count) is a flow and simply gets longer or disappears.

## Drafted copy — DRAFT, approve or replace
Hero standfirst · all field labels, hints and error strings · "What happens next" on all three variants · the trust rail items · the entire prose region (headings, four-step admission list, three FAQ answers, image captions).
No source record for /enquiry-form/ exists in `data/records/` — none of the 871 source words were available, so the prose region is drafted structure, not ported copy. It must be replaced with the live copy verbatim before this template is poured.

## [TO CONFIRM] markers in the design
Reply time (hours) · patient care hours IST · HR response window · Panchakarma programme length in days · companion charges · CV maximum file size.
SLA conflict carried over from the T07 pass (source pledges 24 hours, owner stated 12) is unresolved — hence the marker rather than a number.

## Register
No banned word used. "World Luxury Award Winner" appears only inside the fixed closing block as the award's proper name.

## Accessibility
One h1, h2/h3 with no skips · 44px minimum targets, 52/56px controls and buttons · labels bound by `for`/`id`, hints and errors wired through `aria-describedby`, `aria-invalid` on failure · error summary `role="alert"` and focused on submit · consent visible before submit · body 17–18px / 1.7 · `prefers-reduced-motion` honoured, no motion in the page · every full-width block `box-sizing: border-box`, mobile root `overflow-x: hidden` for 360px.

## Open
- Owner approval of drafted copy and of the field sets per route.
- Real endpoints + exact field/hidden-field names per route (Codex) — this template uses plain names (name, phone_code, phone, email, country, programme, month, message / position, experience, cv, cover, consent).
- Breadcrumb chain provisional until `sitemap/sitemap-final.json` lands.
