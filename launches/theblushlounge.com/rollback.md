# Rollback — Blush Lounge

## Production application release

Human executor: Abilash or a delegated Vercel project administrator.

1. In Vercel, open project `kairali-web-factory-theblushlounge`.
2. Select retained deployment `dpl_9ttZm2LfERZ2FJ2tS5T6r3D4Axio` for the current safe form-free production, or `dpl_5xTuSrpweUcYoCp7dMj3uzrSSNYc` only for the older reviewed build.
3. Promote that exact deployment to Production.
4. Read back `/`, `/contact`, `/robots.txt`, `/sitemap.xml`, one legacy redirect and an unknown route.
5. Confirm the visible WhatsApp and two Instagram links, and confirm no enquiry form is present.

Source rollback for this pilot is a normal revert of the pilot commit after it exists on `main`; do not reset shared history.

## DNS rollback

The exact pre-cutover web records, retained only for emergency restoration, were:

- apex `A 165.22.220.165`, TTL 30 minutes
- `www CNAME theblushlounge.com.`, TTL 1 hour

Current Vercel web records are two apex A records (`216.150.1.1`, `216.150.16.1`) and project-specific `www` CNAME `59e7ea11f6c0ba94.vercel-dns-016.com.`. Nameservers and non-web records must not be changed as part of rollback.

DNS rollback requires a separately authorized human action and public regression test. It is not needed for a normal application rollback.

## Rehearsal status

The retained deployment, exact source hotfix and public read-back prove that a recoverable target exists. A human has not rehearsed the final promotion click during this pilot, so the `rollback-verification` card remains partial rather than complete.
