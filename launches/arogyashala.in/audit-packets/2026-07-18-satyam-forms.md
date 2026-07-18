# Human-audit packet — SATYAM, FORMS/CRM (Gate D) · arogyashala.in

**Prepared: 2026-07-18 16:15:30 IST · roadmap PROMPT 4 single-pager pilot · packet owner: Satyam (dme@kairali.com) — CRM/databases/forms webhook · CC director@kairali.com**
**Status: PACKET ONLY — nothing has been emailed; sending is a separate owner-approved step.**

## The one link you need

**Preview URL: https://kairali-web-factory-arogyashala-in.vercel.app**

## Honest current state — this is a STATE-CONFIRMATION gate, not a regression pass

**This v1 ships NO HTML forms.** Machine-verified 18 Jul (Playwright-rendered scan, PROMPT 2 evidence, `docs/reports/2026-07-18-prompt2-preview-round.md` §7 + Appendix): `forms: 0, visibleInputs: 0` on every probed page. There is nothing to test-submit.

All conversion paths on this site are direct channels, wired with 10 per-audience `data-cta` hooks (door_owner, door_verify, whatsapp_owner, email_owner, whatsapp_verify, email_verify, whatsapp_closing, email_closing, whatsapp_click, email_click):

- **Email:** mailto → info@kairali.com (the locked group contact)
- **WhatsApp:** wa.me/919289838797 (the locked interim Priya number)

Leads from this site will therefore arrive **in the inbox and on WhatsApp, not via webhook into the CRM.** GA4/GTM are not yet wired (Ship Gate B3/B4 pending IDs), so CTA-click attribution starts only when the container lands.

## Your call as forms owner (reply (a) or (b))

- **(a) Confirm the no-form v1 is acceptable for launch** from a CRM standpoint for THIS site (a low-volume B2B/verification one-pager; leads via email/WhatsApp with manual CRM entry), **or**
- **(b) Rule that arogyashala.in must NOT go live without a CRM-wired form.** If (b): attach or point to the EXACT current CRM field schema + endpoint for enquiry submissions (the v1-freeze parity rule — the build must match your schema first time), and the form build becomes a pre-launch work item with a live test lead routed to you for the parity check (consent flag + source attribution included) before any cutover.

## What to reply with

One line — (a) or (b). If (b): the schema/endpoint reference and which consent + attribution fields you need stored per lead.
