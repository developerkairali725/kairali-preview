# MID-15049 — CI and preview follow-up

Recorded 2026-09-30 15:58:16 IST. Review PR: https://github.com/kairali-digital/kairali-web-factory/pull/324.

## Completed fixes

Windows tar output uses CRLF. The runtime-asset restore compared each raw line with an exact allowlist, so carriage returns caused valid members to be rejected. The parser now accepts LF/CRLF and rejects missing, duplicate, extra, traversal and renamed members. Archive/member SHA-256 checks remain required. The owned archive restored and verified 2,053 assets. Five focused regressions pass.

The footer's inactive-form notice has a light surface. Its phone/email links inherited light footer text and failed contrast. A narrow CSS rule now uses existing indigo text on that surface. Browser-computed colors are rgb(38,38,95) on rgb(241,241,248). Site production build passes; existing focused acceptance passes 15/15. Final mobile contrast audit score: 1.

## Verified CI and lab evidence

At PR head 74ff099b, Linux CI root Build (turbo) and Package tests PASS. The gate fails later at compliance. Brand lint and AHV Lighthouse also fail. The local fleet rerun was stopped after resource contention; it is not reported as a completed green run. The full AHV suite, from its correct site directory, reports 337 pass / 9 fail / 26 skip: existing overlay/runtime assertions and missing generated locale fixtures remain open. Archive tests pass separately.

Mobile Lighthouse is LOCAL lab evidence, not hosted or field evidence: performance 53, accessibility 100, best practices 100, SEO 69. LCP 4.5 s; TBT 2,740 ms; CLS 0. Noindex remains intentional for preview. Mobile performance remains below the required 90 threshold and needs further measurement on the hosted candidate; no pass claimed. Raw audits retained locally; machine summary committed at evidence/followup-summary.json.

## Publication dependencies

The automatic candidate is Ready in GitHub's Vercel status: https://kairali-web-factory-git-codex-mid15049-preview-fixes-kairali.vercel.app. Anonymous access redirects to Vercel login. The connected account lists another team and returns 403 for the Kairali team. Hosted content/OG/route/PDF/browser tests have therefore NOT been run or claimed. Required next evidence: authenticated Kairali-team candidate access. The user has been asked to connect access without posting secrets.

Brand lint requires the removed rebuild site.config.json; compliance applies its fallback rules to rebuild source/audit prose. Actual Linux error lines are in the rebuild handoff/reference documents; the larger Windows count is not interchangeable with that run. Owner commit 434bf952 removed unapproved integration. No registration was restored, audit source rewritten to evade checks, suppression added, protection disabled, approval fabricated or PR merged. Abhilash/repository maintainer must approve a registry/integration plan before that boundary changes. Real iPhone Safari and final visual acceptance remain required. No production or DNS change.

## Owner resolution — 2026-10-06 12:27:24 IST

The 6 October reply in the MID-15049 email thread approves shared workspace/factory integration, Brief, Strategy, Premium v3 design source, the current homepage as golden page and final preview visual/design. Evidence is recorded at `launches/kairali-com-rebuild/owner-approvals/2026-10-06-mid15049-email.md` and in `launches/kairali-com-rebuild/approvals.yaml`.

It also directs the implementation to use a general careers-interest state with vacancy status pending HR confirmation; preserve conflicting privacy-policy/certificate wording while using **Kairali Ayurvedic Health Resorts Private Limited** in factual contexts; link the current centre roster at `kairalicenters.com`; preserve `kairaliproducts.com` and `kairaliproducts.in` as distinct markets; retain the document hub as implemented; and keep forms inactive.

Still required: real-device iPhone Safari screenshots, authenticated hosted route/PDF/OG evidence, sysadmin-issued least-privilege GA4/GSC property IDs/roles/proof, final green CI and protected review/merge. Production deployment, DNS cutover, promotion, analytics activation and form activation remain unapproved.
