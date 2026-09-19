# Handover prompt — T07 enquiry / application family (Claude Code)

Paste this whole file as the task brief. Do not restructure the design; you are wiring and QA-ing what exists.

## What exists
Two views, one data source, four routes:
- `AHV Page Enquiry Desktop.dc.html`, `AHV Page Enquiry Mobile.dc.html` — one route-bound reader each. Route is selected by `?route=` or the private Tweaks enum. No public route picker.
- `assets/enquiry-family-data.js` (`window.AHV_ENQUIRY`) — all route copy, 105 captured controls, options, metadata, breadcrumbs, corrections, flow contract.
- `assets/enquiry-family-render.js` (`window.AHV_ENQUIRY_RENDER`) — inline-tree renderer, validators `V`, WhatsApp draft builder, head binding, legacy field builder.

Routes and variants: `contact` (/contact-us/), `careers-apply` (/apply-now/), `job-detail` (/jobs/business-development-manager/), `consultation` (/online-consultation/). Legacy variants `legacy-contact`, `legacy-enquiry` also render from the same file.

## Design decisions that are FIXED — do not change
1. Controls: min-height 52px, 2px #6F6152 border, labels always above the field, never placeholder-only. Textarea min-height 132px.
2. One column for every form, including /apply-now/ (max-width 640px on desktop).
3. Inline worded errors next to the offending field (`role="alert"`, `aria-invalid` on the control, `aria-describedby` wired). Never colour alone.
4. Required consent checkbox + link to /privacy-statement/ ABOVE the submit on contact, apply and job. Consultation carries consent at the review step.
5. Submit is the brightest control: 60px, 17.5px, #5A4420 on cream, full width (to 420px on desktop).
6. Hero C shell (breadcrumb → overline → single H1 → image band) stays on all four routes.
7. Chrome header/footer are frozen — do not touch.

## DRAFT copy that needs owner sign-off before launch
Blocks marked `data-draft="next-steps"` on all four routes:
"Our front office / HR team reads every message, Monday to Sunday, 9 am to 6 pm IST. We usually reply within 12 hours — a little longer on public holidays."
Consent sentences on contact and apply are also new copy (source had no consent control on those two forms).
CONFLICT to resolve with the owner: the captured consultation source contract pledges "We reply within 24 hours"; the owner states 12. The rendered block says 12; the 24-hour string is retained in data only.

## Your job
1. **Wire the real endpoints.** Nothing submits today; each form runs local validation and prints "Prototype only — nothing was sent."
   - Contact → source endpoint `submitContactEn.php`. Field names exactly: `fname`, `country_code`, `phone`, `programme`, `email`, `message`. The source Company honeypot is deliberately absent from the DOM — decide with the owner whether to restore it server-side.
   - Apply → CF7 form. 23 unique field names, captured requiredness; hidden CF7/UTM/nonce inputs were deliberately omitted and must be reintroduced by the real handler, not by the view.
   - Job → awsm job form, 6 fields incl. `awsm_form_privacy_policy`; `career@kairali.com` is the only authorised recovered address.
   - Consultation → WhatsApp draft only (`wa.me`, default-prevented in the prototype). Opening a draft is NOT receipt; keep that wording.
   - Each handler needs: success receipt, error state, retry, and a server-side record. A passing client validation is not a delivered message.
2. **Server-side head emission.** `applyHead()` is a prototype binding: title/description/canonical/robots/og/twitter come from the record and must be emitted server-side, plus BreadcrumbList schema and the retained `og:modified_time` / twitter misc.
3. **File uploads.** File inputs accept as captured but never upload. Implement with size/type limits and a virus scan.
4. **Maps.** Three Google map iframes are not loaded by contract (privacy / lazy-load). The static map now links out to Google Maps in a new tab. If the owner wants an embed, implement consent-gated lazy loading.
5. **Missing self-hosted assets.** The Priya avatar (external Chatbase) and the founder photo (whyayurveda.org) are not self-hosted; both circles currently carry the Kairali lotus mark. Do not substitute stock faces for named people — get real portraits or leave the mark.
6. **Images added this pass** (self-hosted, re-encoded at q0.82 from `Kairali-Image-Library/ahv-edited`): `AHV-Contact-Verandah-Band.jpg`, `AHV-Contact-Guest-Hammock.jpg`, `AHV-Consultation-Therapy-Hands.jpg`. If byte-exact native assembly is required, re-encode from the originals and record hashes.

## Locations / maps (state as of 19 Sep 2026)
- Palakkad card: the static Kerala map image links out to the real Google place URL with an "Open the map in Google Maps ↗" button and a caption saying it opens in a new tab.
- Delhi card: one "Directions to the Delhi office in Google Maps ↗" button, querying the full street address printed on the card (D-130, Block D, Ambedkar Colony, Mehrauli, New Delhi 110030). Replace with the exact place URL when the owner supplies it.
- Exactly ONE map affordance per card — do not add a second.

## Acceptance checks (run per route × 1024/1280/1440/1920 desktop and 320/390/430 mobile)
- Head exact against the record; one H1; governed breadcrumb.
- Empty submit flags EVERY required control with worded text and moves focus to the first invalid one, consent checkbox included.
- Consent cannot be bypassed; privacy link resolves.
- Controls ≥44×44, body text ≥17px, line-height ≥1.6, AA contrast, no hover-only disclosure.
- No horizontal overflow; no console errors; no tracking globals, no window.open, no non-runtime fetch.
- Audience is 45+/55+: nothing that needs zooming on a 390px phone.

## Do not
Publish, deploy, touch WordPress/DNS/tracking, rewrite governed source copy, change the frozen homepage or package page, or alter the four routes' scope. /postulez-maintenant/, /enquiry-form/, /walk-in-ayurveda-treatment/ are OUT of this family for now.
