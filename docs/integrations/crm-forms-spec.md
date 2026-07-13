# CRM Form Integration Spec — from Satyam, 2026-07-13 (verbatim; v1 FREEZE source of truth)

## Fields the CRM expects
fullName, countrycode, phone, email, subject, country, state, city, message,
source, campaign, medium, landingPage, gclid, fbclid,
utm_source, utm_medium, utm_campaign, utm_term, utm_content
(sample payload also carries `referrer`)

Hidden/tracking fields: source, campaign, medium, landingPage, gclid, fbclid,
utm_source, utm_medium, utm_campaign, utm_term, utm_content.

## Endpoints
- TEST webhook (no separate sandbox — all test submissions land in the test sheet):
  https://script.google.com/macros/s/AKfycby7jxLuqMmgawkdc95DHyOthDKuz3a4XpwnnMF3wl6w0XoAHN0M2GwzW1-KVR_vuzBJ-Q/exec
- Test sheet: https://docs.google.com/spreadsheets/d/15F2n0MIMolKMufbJxm4TJjF6Ut7y9ghzJgbqnXTrd14/
- PRODUCTION webhook: NOT yet provided — ask Satyam before first real launch. Lives in env `CRM_WEBHOOK_URL`, never committed.

## Notes
- No recent or upcoming changes to payload structure (Satyam, 13 Jul 2026).
- OPEN (QUESTIONS): does the CRM want an explicit consent field? v1 enforces the
  DPDP consent checkbox client-side but sends only the fields above.

## VERIFIED 2026-07-13 18:42 IST (Checklist B8 evidence)
Test lead POSTed to the test webhook → response `{"status":"success","row":4,"unmappedKeys":[]}`
→ confirmed visible in the test sheet (3 test rows, 18:40–18:42, labeled "Factory Test Lead (Claude agent)" — Satyam may delete).
Client note: POST then follow the 302 as GET (standard fetch `redirect:"follow"`); forcing POST on the redirect returns a misleading 405 AFTER the row is already written.
