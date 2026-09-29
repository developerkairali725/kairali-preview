# STATUS — Kairali.com local build (29 Sep 2026)

**State:** LOCAL BUILD COMPLETE + OWNER ROUND 2 DONE — handoff ready (DEEPU-HANDOFF.md); NOT launch-ready (forms mocked, integrations/owner answers open)
**Previous state line:** LOCAL BUILD COMPLETE — running at **http://127.0.0.1:8774** (Next.js production server, bound to 127.0.0.1)
**Current action:** none running except the preview. Awaiting owner answers (`OWNER-QUESTIONS.md`) and visual approval.

## Guardrails honoured
- Local only: no push, no deployment, no DNS, no live form delivery, and no new or duplicate workers. The one Git repository here is `local-build/`, with no remote.
- Other website projects and company sources were read-only.

## Headline results (details in BUILD-REPORT.md)
- 179/179 route dispositions correct (the 215 mapping plus observations and probes). Legacy query routes, case variants and real 404s all behave as specified.
- 72/72 legacy documents are byte-identical at their exact URLs. 12 current collections with 100 editions are live on the portal, including all five product catalogues as public current editions per the owner update.
- Content parity is 99.4% of source words as contiguous text, and every one of the 62 unmatched blocks is classified as deliberate.
- 0 SEO failures and 39/39 browser interaction checks passed. 56 screenshots at desktop and mobile widths show no overflow. No Google Fonts or other third-party requests are made on load.

## Log
- 13:52 BUILD-TASK.md read; STATUS.md created.
- 14:40 Sources read: owner decisions, the Premium v3 bundle (tokens and OFL fonts), the audit REPORT/HANDOFF and the 215-route mapping.
- 14:55 Real 2026 brand artwork located in `Kairali-Image-Library/brand-assets/svg`.
- 15:05 Portal, sub-brand URL and whyayurveda.org event facts verified.
- 15:20 Content pipeline complete (150 pages, 357 images, 72 documents). 88 company CMS images fetched politely.
- 15:45 Next.js app, chrome, families, proxy routing and forms built. First production build passed.
- Owner update applied: the five product catalogues are public current editions, and the pending/401 labels were removed.
- 16:30 Verification suite and interaction suite: 0 failures.
- Certificates read from the scans themselves: NABH current to 24 Apr 2027; Kerala clinical registration current to 2 May 2028; Ayur Diamond lapsed 23 Jul 2026 (not shown).
- Final: docs, registers and evidence written. The worktree was merged to `main` in `local-build/` and the preview now serves from there.

- Owner feedback round implemented (square edges, compact products band, natural casing, mobile section navigation): 150/150 owner-feedback checks, full regression green. See BUILD-REPORT.md → Owner feedback round.

- Owner round 2 complete (rounded native controls, nav, news hub, Group Profile template, awards/certifications browsing); portable handoff with bundled reference data and a GA4 measurement audit. Codex publishes to kairali-web-factory/sites/kairali-com-rebuild with SITE_ENV=preview.

## Open (owner / release)
See BUILD-REPORT.md → Publication dependencies, OWNER-QUESTIONS.md, and docs/SEO-ROUTING-DEPLOYMENT.md.
