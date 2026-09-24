# AHV — FINAL ENGLISH STAGING / FORMS DEVELOPER HANDOFF

**Use only https://ahv-final-staging.vercel.app for current review and form integration.**

This is one consolidated website. The short hostname remains the same when a verified replacement deployment is published. Older long Vercel preview URLs in historic messages/reports are immutable snapshots and are superseded as handoff links. They are retained for evidence and rollback, not separate final sites.

| Item | Authoritative value |
|---|---|
| Task | WOPS-AHV-FINAL-DRAFT-20260924-001 |
| Release status | Final consolidated staging; forms and launch gates outstanding |
| Repository | https://github.com/kairali-digital/kairali-web-factory |
| Handoff branch | `codex/ahv-english-staging-20260915` |
| Release PR | https://github.com/kairali-digital/kairali-web-factory/pull/309 |
| Application directory | `sites/ayurvedichealingvillage.com` |
| Vercel project | `kairali-web-factory-ayurvedichealingvillage-com` |
| Production domain | `ayurvedichealingvillage.com` — not switched by this handoff |
| Responsibility | Web developer: form implementation. Dr. Deepu John: clinical review. |

**Start here:** [complete launch checklist](../../docs/reports/2026-09-24-ahv-final-staging/GO-LIVE-CHECKLIST.md), [current CI findings](../../docs/reports/2026-09-24-ahv-final-staging/CI-STATUS.md).

## Developer’s first implementation steps

1. Work from the handoff branch/site directory above; do not start from an old preview, PR284 or PR285.
2. Restore documented runtime media with `pnpm assets:restore` using authorized company access. Use the repository's pinned package manager and a clean install in your own checkout.
3. Read `app/(english)/_families/boot.ts`, `app/api/enquiry/route.ts` and the existing `@kairali/forms` package before wiring the visible forms. Removing the capture guard alone is not integration.
4. Keep staging noindex, production-recipient isolation and tracking locks. Introduce an approved isolated form test backend instead of setting `AHV_STAGING=0` to test submissions.
5. Implement all form types, the guide fulfilment and one shared short enquiry popup, using the detailed acceptance criteria in the checklist. Verify synthetic lead delivery at the destination.
6. Push reviewed changes through the same release PR. After checks and a READY deployment, update **the same stable alias**, verify it, and record its commit/deployment. Never announce a new hash URL as another final site.

## Release discipline

The stable staging address is a label, not permission to bypass branch protection or production readiness. Authenticated owner approval is needed after the final push. Existing CI failures are documented, not hidden. A production build must use separately validated production settings; do not blindly promote this noindex/form-blocked staging artifact.

Keep historical deployments protected/noindex. PR284/285 contain unmerged migration work; preserve them as historical context and reconcile only necessary legacy-route requirements before cutover. Do not merge older designs on top of this handoff.

No launch date is invented. No new employee assignment or email is created by this document.
