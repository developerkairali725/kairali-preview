# Deepu QA handoff — Blush Lounge

Pilot date: 11 August 2026. Review the protected preview linked in `preview-2026-08-11.md`; do not test against an old Vercel alias.

## Highest-value human pass

1. At 390px and desktop, open Home, Portfolio, Services, Academy, About and Contact.
2. Confirm each header/footer route, every WhatsApp button and both Instagram profiles go to the expected destination.
3. Confirm there is no enquiry form and no sentence promising one.
4. Check the real business facts with Sneha: spelling, service list, Shivalik/New Delhi service-area wording, worldwide/destination availability, phone and Instagram profiles.
5. Check visual trust: imagery is real and appropriate, no person is misidentified, no stale event/poster is presented as current, and no unconfirmed testimonial appears.
6. Review Search preview titles/descriptions and the social card.
7. Approve or return findings by checklist gate ID. Do not mark GA4, GBP, legal/privacy, ZAP, launch certificate or Day-7 monitoring complete without their named evidence.

## Automated evidence already completed

- build PASS
- factory Playwright 16 passed / 0 failed
- 12-page desktop/mobile rendered audit PASS
- 6/6 internal targets 200
- Lighthouse: 90–96 performance, 100 accessibility, 100 SEO
- compliance and brand lint: 0 errors
- dependency audit: no known vulnerabilities at the configured threshold
- uptime probe: live Blush endpoint up

## Decisions already made for this use case

- English-only: no hreflang cluster.
- WhatsApp is the enquiry path; unconfigured form/backend removed.
- No checkout, product price, chatbot, ads conversion or ad pixel surface.
- GA4 remains off until a site-specific controller/privacy policy and consent QA exist.
- No GBP until the real staffed-location/service-area, address and hours facts are confirmed.

## Human output expected

Record `APPROVE` or a concise list of findings with the page, viewport and gate ID. Approval is for the protected hardening PR; it is not permission to invent legal/business facts or activate measurement.
