# STATUS — Kairali.com preview fixes

Updated 2026-09-30 15:29:41 IST. Runtime source commit `c3b7679d`, based on current main `973ce108`.

**State:** OWNER COPY FIXES IMPLEMENTED AND VERIFIED LOCALLY; Q8-C INACTIVE PREVIEW; NOT LIVE-LAUNCH READY.

Local preview: http://127.0.0.1:8774. Current public alias remains the previous build until the normal release path passes.

- Owner corrections: stale count caption removed, explicit clinical promises removed, opening year 1999, Svata prices removed, HR warning, maintained hub brochure entry points.
- Forms: all six disabled, no personal/medical/CV input or upload, API rejects before parsing. Existing backend retained inactive.
- Local checks: route/docs/images/links/SEO verifier 0 failures; parity 0 REVIEW; browser 47/47, owner styling 150/150, Chromium/WebKit 76/76; focused fixes 15/15; document hub 12/12.
- Legacy documents: 72/72 SHA-256 verified. Separate replacement review due 5 October.
- Site audit: zero vulnerabilities. Root audit: eight moderate findings, no high/critical.
- Root package tests: 76/76. Root build/compliance/brand gates fail; see report for owners and exact next evidence. No gate was weakened and the owner's deliberate unapproved-integration separation was preserved.
- Fresh-clone build: passed.

Acceptance matrix, actual document entry URLs and remaining owner/access/release dependencies: [MID-15049-PREVIEW-FIXES.md](docs/MID-15049-PREVIEW-FIXES.md).

3 October EOD IST handback: reviewed candidate URL, final commit, checks and blocker owner/date. Real iPhone Safari, final visual approval, hosted verifier/OG/Rich Results/Lighthouse, legal/privacy/HR/analytics access remain open. No live-domain or DNS cutover approval.

## CI follow-up

2026-09-30 15:58:16 IST — Windows archive repair and footer notice contrast fix verified. Linux root build/package tests pass at 74ff099b; compliance, brand and AHV Lighthouse remain red. Automatic candidate Ready but protected; connected account gets 403 for Kairali team. Final local mobile lab scores: {'performance': 53, 'accessibility': 100, 'best-practices': 100, 'seo': 69}. Full evidence and dependencies: [MID-15049-CI-FOLLOWUP.md](docs/MID-15049-CI-FOLLOWUP.md).

## Owner resolution — 2026-10-06 12:27:24 IST

The 6 October reply in the MID-15049 email thread approves shared workspace/factory integration, Brief, Strategy, Premium v3 design source, the current homepage as golden page and final preview visual/design. Evidence is recorded at `launches/kairali-com-rebuild/owner-approvals/2026-10-06-mid15049-email.md` and in `launches/kairali-com-rebuild/approvals.yaml`.

It also directs the implementation to use a general careers-interest state with vacancy status pending HR confirmation; preserve conflicting privacy-policy/certificate wording while using **Kairali Ayurvedic Health Resorts Private Limited** in factual contexts; link the current centre roster at `kairalicenters.com`; preserve `kairaliproducts.com` and `kairaliproducts.in` as distinct markets; retain the document hub as implemented; and keep forms inactive.

Still required: real-device iPhone Safari screenshots, authenticated hosted route/PDF/OG evidence, sysadmin-issued least-privilege GA4/GSC property IDs/roles/proof, final green CI and protected review/merge. Production deployment, DNS cutover, promotion, analytics activation and form activation remain unapproved.
