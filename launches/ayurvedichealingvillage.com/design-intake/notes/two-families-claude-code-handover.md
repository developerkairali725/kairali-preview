# Handover prompt — Kairali AHV, two families (Claude Code)

Paste this whole file as the task brief. You are wiring and QA-ing finished designs; do not restructure them.

## Where everything is
Project root = the design workspace. Both families ship from the SAME root, and both need `support.js` (project root) served over HTTP — never file://.

### Family A — T07 enquiry / application (the site's highest-traffic template: 1,111 clicks)
- Views: `AHV Page Enquiry Desktop.dc.html` · `AHV Page Enquiry Mobile.dc.html`
- Data: `assets/enquiry-family-data.js` (`window.AHV_ENQUIRY`)
- Render helpers: `assets/enquiry-family-render.js` (`window.AHV_ENQUIRY_RENDER`)
- Brief + contract: `notes/enquiry-family-claude-code-handover.md` — READ FIRST
- Sidecar (corrections, flags, QA history): `notes/enquiry-family-page.md`
- QA harness: `notes/enquiry-family-qa-harness.html` (`runAll()`, 28 states)
- Packaged drop: `launches/ayurvedichealingvillage.com/design-intake/` (self-contained copy incl. chrome + support.js)
- Routes (`?route=` or the private Tweaks enum): /contact-us/ · /apply-now/ · /jobs/business-development-manager/ · /online-consultation/

### Family B — T10 confirmation / post-submission
- Views: `AHV Page Confirmation Desktop.dc.html` · `AHV Page Confirmation Mobile.dc.html`
- Data: `assets/confirmation-family-data.js` (`window.AHV_CONFIRM`)
- Render helpers: `assets/confirmation-family-render.js` (`window.AHV_CONFIRM_RENDER`)
- Sidecar: `notes/confirmation-family-page.md` — READ FIRST (everything below is expanded there)
- QA harness: `notes/confirmation-family-qa-harness.html` (`runAll()`, 70 states — needs a re-run, expectations were updated)
- Ten routes: /contact-us/thank-you/ · /thanks/ · /ppc-thanks/ · /onlinebookingthankyou/ · /onlineconsultation-thanks/ · /thanks-old/ · /emailsubscriber/ · /book-now/ · /cart/ · /checkout/
- Two states: direct-visit (DEFAULT, claims nothing) and receipt. The receipt state is reachable ONLY via the private controls `?receipt=prototype` or the `prototypeReceipt` Tweaks prop. Neither may become public success authority.
- Shared images: `assets/img/AHV-Confirm-*`; family A images: `assets/img/AHV-Enquiry-*`, `assets/img/AHV-Contact-*`, `assets/img/AHV-Consultation-*`, `assets/img/location-kerala-palakkad-map.png`
- Chrome, imported by every view: `AHV Chrome Header.dc.html` · `AHV Chrome Footer.dc.html` — frozen, do not redesign.

## Fixed design decisions (both families)
Controls 52px with a 2px border · labels above every field · one column per form · worded inline errors beside the offending field · required consent + /privacy-statement/ link above the submit · submit is the brightest control (60px) · Hero C shell on enquiry routes · one map affordance per location card · exactly one contact block per confirmation page · no celebration animation on confirmation · 44px+ targets, 17px+ body, AA contrast (audience is 45+/55+).

## The work
1. **Wire the four enquiry endpoints.** Nothing submits today — local validation only. Exact field names, captured requiredness and the per-route handler (submitContactEn.php, CF7, awsm job form, WhatsApp draft) are in the family A brief. Each needs a success receipt, an error state, retry and a server-side record. A passing client validation is not a delivered message.
2. **Connect handler success to the confirmation receipt state.** Server-verified success is the ONLY permitted trigger; direct load, refresh, prefetch, crawler and history navigation must emit no business outcome. Replace the two private review controls with that signal. The receipt strip's two pending rows ("Sent at", "A copy went to") are placeholders for real handler values — no invented timestamps, reference numbers or addresses.
3. **Server-side head emission** for both families: title/description/canonical/robots(noindex,follow on confirmation)/og/twitter, plus BreadcrumbList where the route has crumbs. `applyHead()` is a prototype binding in both render files.
4. **File uploads** (enquiry apply + job): size/type limits and scanning. Inputs accept but never upload.
5. **The Healing Secrets PDF** is missing. `window.AHV_CONFIRM.asset.href` is null, so the CTA renders as a non-interactive placeholder. Set `href` and it becomes a real download — no other change needed.
6. **Map embeds**: three Google iframes are not loaded by contract. Either keep the current link-out or implement consent-gated lazy loading.
7. **Missing portraits**: the Priya avatar and founder photo are external and not self-hosted; both circles carry the Kairali lotus mark. Do not substitute stock faces for named people.

## Owner decisions already applied — do not "fix" these back
- One response time across the whole estate: **12 hours, Mon–Sun 9 am–6 pm IST**. `window.AHV_CONFIRM.pledgeNormalise` rewrites the older "24 hours" / "1-2 Business Days" source strings at render; the datasets keep the source wording for the record. Carry the 12-hour promise into the real handler e-mails too.
- The newsletter route gets a thank-you only — no pledge, no timeframe, no reply implied.
- Direct-visit copy is owner-approved (no DRAFT flag). It still must not claim a submission happened.
- The /onlineconsultation-thanks/ poster image and its transcript box were removed; the phone number it carried lives in the contact row.
- Trust row years are computed from `foundedYear: 1908`, not hard-coded.

## Still DRAFT — needs owner sign-off before launch
The "what happens next" blocks, the consent sentences on contact and apply, the receipt strip copy, `standardWait` cards, and the drafted direct-visit copy's four exits.

## Acceptance
Per route × 1024/1280/1440/1920 desktop and 320/390/430 mobile:
head exact · one H1 · governed breadcrumb where the route has one · empty submit flags EVERY required control incl. consent and moves focus to the first invalid one · receipt state never reachable without verified success · direct-visit state contains no thank-you/success/receipt/booking vocabulary · at most one wa.me and one tel: per page inside `main` · ≥44px targets · ≥17px body · AA contrast · no horizontal overflow · no console errors · no tracking globals, no window.open, no non-runtime fetch.
Run both harnesses (`runAll()`) and report the state counts.

## Do not
Publish, deploy, touch WordPress/DNS/tracking, rewrite governed source copy beyond the owner overrides listed above, alter the frozen homepage, package page or chrome, or widen scope — /postulez-maintenant/, /enquiry-form/ and /walk-in-ayurveda-treatment/ are out of family A; /cart/ and /checkout/ are parked pending an owner decision.
