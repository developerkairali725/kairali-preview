# Security posture review — Blush Lounge pilot

Date: 11 August 2026. Scope: the release diff and the publicly reachable site; no credential values were recorded.

Verdict: **PASS for protected preview; no known high/critical release-diff finding.** Automated PR diff review and ZAP remain separate pending gates.

## Cleared

- HTTPS and Vercel HSTS are active on apex and `www`.
- Added response headers: `X-Content-Type-Options: nosniff`, `X-Frame-Options: DENY`, `Referrer-Policy: strict-origin-when-cross-origin`, and a restrictive camera/microphone/geolocation/payment/USB Permissions Policy.
- No public form remains, so the site does not solicit personal lead data without an approved datastore/controller/privacy route.
- The unused `/api/enquiry` handler and dead form CSS were removed. The shared forms package remains an inert workspace dependency to avoid an unrelated, owner-guarded root lockfile rewrite; no handler, form component or public route imports it.
- Consent defaults render before any analytics component. No GA, GTM, Meta, Bing or other measurement loader was observed in the rendered audit.
- Dependency audit reported no known vulnerabilities at the configured high threshold.
- Vendored fonts are official Google Fonts WOFF2 files with OFL notice, provenance and SHA-256 hashes committed beside them.
- No scraped or untrusted content was introduced in the change.

## Explicit limits

- Vercel account MFA, WAF/account-role settings and backup retention were not mutated or independently proven in this source audit.
- Full-history gitleaks, repository security-review CI and OWASP ZAP are pending their own automated checks.
- Privacy/controller approval cannot be inferred from the consent component and remains required before GA4 activation or personal-data collection.
