# Security posture review — Abhilash pilot

**Timestamp:** 2026-08-11 06:32 IST  
**Scope:** release diff and hosting posture; no credentials or personal-data
processing authorized.

## Result: no local high/critical finding; CI and preview scan items remain open

- Production and rollback deployment are HTTPS on Vercel and the current target
  read-back is `Ready`.
- Response headers set `X-Content-Type-Options: nosniff`, `X-Frame-Options: DENY`,
  `Referrer-Policy: strict-origin-when-cross-origin` and restrictive camera,
  geolocation and microphone permissions.
- No remote font fetch remains; fonts are self-hosted with provenance recorded.
- `pnpm audit --audit-level=high` reports no known vulnerability.
- No API key, analytics measurement ID, GTM ID, password or token is added.
- Analytics does not render when `NEXT_PUBLIC_GA_MEASUREMENT_ID` is absent and
  optional analytics loads only after an explicit local consent choice.
- Contact data stays in the visitor's email client via `mailto:`; this site does
  not accept, store or transmit form data to a custom backend.
- Draft content is denied at navigation, sitemap/feed, metadata and route layers.
- External links use appropriate new-tab relationship attributes where used.
- Four protected drafts and an unknown essay slug return 404 without server-log
  errors.

## Open controls

- Full-history gitleaks and the automated release-diff security review run only
  in protected CI and must be green before merge.
- OWASP ZAP is not wired in this repository; no false scan result is claimed.
- Vercel account MFA, team member least privilege, WAF policy and recovery codes
  cannot be proven from the source diff; retain as monthly owner/admin review.
- GA4/GTM activation remains legally blocked and must not be bypassed.

