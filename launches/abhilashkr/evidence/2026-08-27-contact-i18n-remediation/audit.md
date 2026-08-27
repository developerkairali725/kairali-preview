# Abhilashkr contact and localized-image remediation — pre-change evidence

Collected: 2026-08-27 16:47:00 IST  
Task: WOPS-ABHILASHKR-CONTACT-I18N-REMEDIATION-001  
Source revision: `02294e16410f89a5e7206ee6b92ecf49c8c4531b`

## Observed public behavior

- All 24 German and French sitemap routes returned HTTP 200, but none rendered an `img` element.
- The corresponding English image-bearing routes rendered 11 approved local assets: home (2), about (1), work (7), and speaking (1).
- Each of the 11 `/images/...` asset URLs returned HTTP 200 with an image MIME type. The fault is therefore rendering parity, not missing files or CDN delivery.
- On `/contact`, the email, phone, and LinkedIn values in the contact ledger were plain text. Only the separate footer LinkedIn link was actionable.
- The English form has no action endpoint, API route, CRM write, or server-side submission handler. Its client handler opens a `mailto:info@kairali.com` draft and immediately renders “Draft Prepared.” Nothing is delivered or stored by the site; the visitor must send the draft from their email application.

## Observed source cause

- `sites/abhilashkr/src/lib/localized-content.ts` had no image metadata in `LocalizedPageContent` or `LocalizedSection`.
- `sites/abhilashkr/src/components/site/localized-page.tsx` rendered text, cards, and links only.
- `sites/abhilashkr/src/app/(en)/contact/page.tsx` passed plain strings to `LedgerRow` for email, phone, and LinkedIn.
- `sites/abhilashkr/src/app/(en)/contact/contact-form.tsx` used `window.location.href = mailto:...` and then set its success state without proving that an email application opened or that a message was sent.

## Approved scope

Owner instruction in chat on 2026-08-27: “fix it.” The bounded implementation is to reuse the 11 existing approved assets on German/French counterparts, make English email/phone/LinkedIn values semantic links, and describe the existing email-draft-only form honestly. No backend, CRM, analytics, consent, DNS, medical claim, address-map destination, or production release is in scope.
