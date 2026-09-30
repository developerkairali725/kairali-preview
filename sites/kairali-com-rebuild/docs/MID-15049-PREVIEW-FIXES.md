# MID-15049 — preview fixes and remaining release evidence

Recorded 2026-09-30 15:29:41 IST. Owner authority: Abhilash's 30 September reply in the email thread “[Project: Kairali.com rebuild] [Task: MID-15049] Finish Next.js website by 3 October”. Source code commit: `c3b7679d`; base main: `973ce108`. Local preview: http://127.0.0.1:8774. This report is a preview handoff, not a live-launch approval.

## Implemented

- Removed the contradicted home centre-count caption; kept the stale statistics graphic hidden.
- Removed explicit cure, permanent-result and no-side-effect promise sentences across home, product, Healing Village, founders' message and award detail copy. No replacement clinical claim was written. The content regeneration transform applies these rulings; source captures, source URLs and hashes remain unchanged. Search text is regenerated from corrected copy.
- Corrected the partnerships page's official Healing Village opening year to 1999. Removed Svata's undated price tables and stale “rates below” notice, preserving room/package descriptions and images.
- All six forms, including the footer newsletter, visibly disclose preview inactivity. Every input, file selector and submit button is disabled. Submission handlers return before reading FormData; APIs return 503 before parsing multipart bodies. `FORM_DELIVERY_APPROVED=false` cannot be overridden by an environment switch. The pre-existing delivery implementation is retained as inactive code; it is not approved for activation. Missing server-side Turnstile credentials refuse delivery if activation is later reviewed.
- Date controls have an explicit appearance rule that also covers WebKit's Windows text fallback. Real iPhone Safari verification remains a separate requirement.
- Visible legacy brochure actions/prose links point to maintained document-hub collection views. Eligible legacy `/download/` URLs and bytes remain available. Previously published vacancies disclose that HR confirmation is pending.

## Local verification

| Check | Result |
|---|---|
| Frozen-lockfile install, TypeScript, site production build in preview mode | Passed; 156 generated pages |
| Hard-lock build with `NEXT_PUBLIC_FORMS_ENABLED=true` | Passed; all six forms still inactive |
| `verify.py` | 179/179 route dispositions, 72/72 byte-identical legacy documents, 288/288 images, 302/302 internal links, 149 sitemap URLs; 0 failures |
| `registers.py` | 340 unmatched contiguous source blocks, all explained; 0 REVIEW rows. 146 moved-record blocks; 109 price-table blocks; 18 blocks affected by approved promise removal; remaining changes classified in the register |
| `interact.mjs` | 47/47. Old editable-mock validation checks were explicitly superseded by Q8-C; all other checks retained. Added all-six-form inactivity and no-submission checks |
| `owner-feedback.mjs` | 150/150 |
| `round2.mjs` | 76/76 in Chromium and Windows WebKit; assertions unchanged |
| `mid15049.mjs` | 15/15, including malformed-body rejection for every form API |
| `document-hub.mjs` | 12/12 real collection views plus one current PDF per collection; HTTP status, MIME and PDF signature checked |
| Desktop/mobile screenshots | 10 states on five changed pages; zero horizontal overflow; mobile enquiry and desktop medicine visually inspected |
| Root package tests | 76/76 |
| Site dependency audit | 0 vulnerabilities |
| Root dependency audit | 8 moderate, 0 high, 0 critical; `--audit-level=high` passed |
| Fresh-clone installation/build | Passed from a new shallow clone of runtime commit `c3b7679d`; frozen-lockfile install and production build exited 0 |

Evidence files are in `evidence/`: JSON browser/fix/audit/hub reports, verify summary, exact owner-approved omission inventory and parity/metadata registers. Historical source blocks are classified by exact route and source text. Unknown omissions now cause `registers.py` to exit nonzero.

## Actual document entry points

- `/download-centre.aspx`, navigation “Download Centre”, footer “FAQs and downloads”, brochure opener actions and in-page brochure links are the site's visible entry points.
- Group fallback view in use: https://kairali-documents.vercel.app/?property=all#library. The hub currently advertises `all`, `ahv`, `villa-raag` and `kappl` views; a distinct group-site view is not registered or claimed as verified.
- Known property/product brochure actions use existing `?property=ahv#healing-secrets`, `?property=villa-raag#programme-rates` or `?property=kappl#kappl-retail` collections. Visitors choose a current PDF there. The Download Centre's current-edition PDF links remain on the maintained hub.
- Proposed group handback view: use the verified `all` library until the document-hub maintainer registers a dedicated group collection/view. Do not fabricate a `property=group` route.
- All 72 direct legacy files remain dated earlier editions, without redirects. Replacement review remains due 5 October 2026.

## Root CI blockers — not suppressed

1. `pnpm build` failed in the separate AHV app's `tools/restore-runtime-assets.mjs` with “Unexpected archive member” on Windows. Owner: AHV/fleet maintainer (assignment needed from Abhilash); next evidence: successful root build or platform-specific restore repair. Review by 3 October EOD IST.
2. Root compliance gate failed: 6,786 errors / 1,513 warnings across 18 targets. Root brand gate failed on the rebuild's missing `site.config.json`. Commit `434bf952` deliberately removed rebuild/shared-workspace registration under the owner's unapproved-integration separation. Registration, token integration and gate-scope decisions must follow their review path; this patch does not reverse that commit or add exclusions. Owner: Abhilash + repository maintainer; next decision/evidence: approved integration plan and green normal CI, before merge/release.
3. Eight moderate root findings affect `ip-address`, `fast-uri` and two `brace-expansion` versions. Traced to AbhilashKR/shadcn/MCP and lint tooling; the standalone site's audited lockfile is clean. Owner: fleet dependency maintainer (assignment requested); next evidence: reviewed shared dependency patch and clean root audit. Target review 3 October. No high/critical launch blocker was found in the current audits.

## Owner/access dependencies

| Dependency | Owner | Next evidence / date |
|---|---|---|
| Final Premium v3 visual acceptance | Abhilash | Staging desktop/mobile review; by 3 October handback |
| Real iPhone Safari date-control check | Deepu + iPhone tester | Device/browser/date and screenshot; by 3 October |
| Five vacancy statuses | HR, coordinated by Deepu | Confirm each vacancy before any live “open” claim; report status 3 October |
| Legal operator / conflicting privacy-policy text | Abhilash + legal/privacy owner | Registry-established operator is Kairali Ayurvedic Health Resorts Private Limited; certificate wording and conflicting privacy policy stay unchanged pending verified revisions |
| Centre directory / product-store mapping | Abhilash + brand owners | Approved mapping; existing roster and distinct .in/.com store links preserved |
| Forms activation | Abhilash + form/data owners; Dr. Deepu John for medical handling | Per-form recipients, provider/CRM, privacy/consent/retention, medical handling, upload storage/scanning, server anti-spam and synthetic receipts. Q8-C applies to 3 October; no activation required for this preview |
| GA4 property access | Analytics property administrator | Verify developer access; production firing only after approved cutover |
| Search Console ownership | Domain/Search Console administrator | Verify owner/access; no invented GTM/Clarity IDs |
| Dedicated group document-hub view | Abhilash + hub maintainer | Register and verify the actual view; report 3 October. Replacement document review 5 October |
| Sunaj repository access / employee KPI link | Sunaj / Abhilash | Separate named-access confirmation and genuine existing KPI link; report 3 October |
| Hosted candidate verification | Deepu + repository/Vercel maintainer | Required PR gates, candidate URL, full deployed verifier, OG fetch, Google Rich Results and throttled mobile Lighthouse; pending normal release path |

No production analytics firing, live-domain/DNS change, form delivery or credentials by email. Deadline is 3 October 2026 EOD IST. The 5 October document review remains separate. No reply email was sent by this task.

## Later CI follow-up

See [MID-15049-CI-FOLLOWUP.md](MID-15049-CI-FOLLOWUP.md) for the later Windows archive repair, notice contrast fix, actual Linux root build PASS, protected candidate and mobile lab results. Earlier local gate findings above are retained as dated evidence.
