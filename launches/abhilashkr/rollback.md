# Rollback — Abhilash i18n pilot

## Protected before-state

- production target before release: `dpl_5AQSN9tuBgbSTRhFj6UQJo7BuW9f`
- DNS before release: already healthy on Vercel; unchanged by this release
- canonical behavior: apex 200; `www` one 308 to apex
- source base: `origin/main` at `8b689e6f0664e4367f4cf8ce06b1f1db3e8feb5d`

## Trigger

Rollback on a production 5xx, a wrong-domain deployment, a widespread route or
asset failure, broken canonical/indexing controls, an unrecoverable mobile-nav
regression, or an unexpected analytics/tag activation.

## Exact recovery path

The owner or an authorized Vercel team member runs:

```text
vercel rollback dpl_5AQSN9tuBgbSTRhFj6UQJo7BuW9f --scope kairali
```

If the CLI requires a URL rather than an ID, select the same immutable
deployment in the Vercel project Deployment list and use **Promote to
Production**. Do not change DNS; the project/domain binding remains correct.

## Rehearsal/read-back

- The immutable before deployment ID is recorded and remained `READY` in the
  project history when this plan was prepared.
- Local release verification used a separate build and did not mutate the
  production deployment.
- The production rollback action itself is intentionally not executed as a
  rehearsal because that would replace a healthy live site. Preview promotion
  and production read-back are the narrow reversible proof.

## Post-rollback checks

1. apex returns 200 and `www` returns one 308;
2. `/`, `/about`, `/writing`, `/contact`, `/robots.txt` and `/sitemap.xml` pass;
3. production HTML carries no unexpected analytics ID or `noindex`;
4. record the restored deployment ID and incident trigger.
