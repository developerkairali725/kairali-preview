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

## Historical feedback freeze — 24 September

Use the same alias for Saturday feedback. [Consolidated owner questions and team inputs](../../docs/reports/2026-09-24-ahv-final-staging/OWNER-DECISIONS-AND-TEAM-INPUTS.md) is the historical pending-input queue; the 25 September update below supersedes its answered items. Latest rates PDF and later batch translation remain explicit dependencies. Production is not switched.

## Consolidation update — 25 September

All 31 programme pages now carry the completed staging FAQ set, including the 22 remaining programme-specific questions. Approved Sanskrit yoga names, teacher training Coming Soon, Maharaja suite amenities, consultation choices, patient preparation and report/CV notices are incorporated. No physician sign-off or working backend retention process is inferred from published copy.

The owner has requested one main-branch handoff and permits the dependency work to be consolidated in whichever order is necessary. The reviewed fleet dependency commit `37f189baba375539f60d1098a1af0e29be15ef6c` is included in this branch, with a regenerated combined lockfile and residual dependency fixes. PR314's branch is not edited. A fresh whole-repository dependency audit reports zero advisories. Main is not considered updated until a verified merge commit is recorded.

To preserve the owner's staging-only restriction, 13 existing Git-linked app roots carry `git.deploymentEnabled.main=false`. The KairaliHerbals project has no application root; its automatic Git deployments were separately disabled and read back through the project API. These holds preserve current production deployments. Restore them only during a separately authorized release. Preview branches and the manually deployed AHV staging site remain available.

The review gate currently requires AbhilashKairali to approve a PR that was also created as AbhilashKairali; GitHub prohibits self-approval. A real authorized collaborator can create a replacement PR from the final consolidated branch, followed by the owner's review. The agent must not impersonate a collaborator, manufacture approval or use admin bypass.

Current technical results and remaining integration checks are recorded in the linked CI findings. The web developer's actual form delivery and policy-process implementation, Claude's rates/Healing Secrets, Anupam's offer details, translations and production release remain their separate dependencies. The current staging artifact deliberately remains noindex with submissions isolated; a DNS change alone is not its production release procedure.
