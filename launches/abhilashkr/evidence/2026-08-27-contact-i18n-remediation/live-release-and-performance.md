# Live release and performance verification

- Task: `WOPS-ABHILASHKR-CONTACT-I18N-RELEASE-001`
- Owner production approval: 27 August 2026, current chat
- PR: #288, merged 27 August 2026 18:36:41 IST
- Merge commit: `b1efeb808702be38755590ef9ee385b71c18367f`
- Production deployment: `dpl_HqJvDF728DFnWwYdwPRubYXTm2ED`
- Public aliases: `https://abhilashkr.com`, `https://www.abhilashkr.com`
- Exact retained rollback: `dpl_5u1q1KYrFufCAAHvLqaa4R7haGLn` (`READY`)

## Public functional verification

The promoted production deployment is `READY`, owns both public aliases and
records `originalDeploymentId=dpl_8FfHKPjM4ofhQ8CzKoXQ5c9LHnmv`. Public
Playwright against `https://abhilashkr.com` passed 14/14 at mobile 375 and
desktop 1280. The run covers all 24 translated routes, exact localized image
counts, all seven translated Work assets, EN/DE/FR email/phone/LinkedIn links,
the English mail-draft-only disclosure and post-action state, localized privacy
notices and the consent-gated GA4 network boundary.

## Browser PageSpeed Insights

All reports were generated through the browser against the public apex after
release. PageSpeed reports no CrUX field data for the tested URLs.

| Route | Mobile | Desktop | Accessibility / Best Practices / SEO | Report |
|---|---:|---:|---|---|
| `/` | 93 | 100 | 100 / 100 / 100 | `https://pagespeed.web.dev/analysis/https-abhilashkr-com/0d2p7f7s7u` |
| `/contact` | 95 | 100 | 99 / 100 / 100 | `https://pagespeed.web.dev/analysis/https-abhilashkr-com-contact/4xwq3ez5om` |
| `/work` | 95 | 100 | 100 / 100 / 100 | `https://pagespeed.web.dev/analysis/https-abhilashkr-com-work/farag81pa3` |
| `/de` | 90 | 100 | 100 / 100 / 100 | `https://pagespeed.web.dev/analysis/https-abhilashkr-com-de/9yxhht363f` |
| `/de/kontakt` | 96 | 100 | 100 / 100 / 100 | `https://pagespeed.web.dev/analysis/https-abhilashkr-com-de-kontakt/s9dr02d2y3` |
| `/de/arbeit` | 95 | 100 | 100 / 100 / 100 | `https://pagespeed.web.dev/analysis/https-abhilashkr-com-de-arbeit/tdx0sg20lo` |
| `/fr` | 98 | 100 | 100 / 100 / 100 | `https://pagespeed.web.dev/analysis/https-abhilashkr-com-fr/255gd8rrvq` |
| `/fr/contact` | 94 | 100 | 100 / 100 / 100 | `https://pagespeed.web.dev/analysis/https-abhilashkr-com-fr-contact/2sje2liqx8` |
| `/fr/travail` | service error | service error | public route itself is 200 and passed browser QA | PageSpeed returned `Unable to resolve` on two attempts; no third repeat |

The minimum PageSpeed Performance score is 90 mobile and 100 desktop. Every
successful report scores Best Practices 100 and SEO 100. Lab CLS is zero on
all successful mobile reports; TBT is 0–40 ms. Mobile LCP varies from 2.4–3.3
seconds under emulated Slow 4G, while the published release bar remains met
because PageSpeed Performance is at least 90 and no field data exists.

The English contact report exposed one actionable accessibility defect:
`Heading elements are not in a sequentially-descending order`. Source read
proved `h1 → h3 → h4`. The narrow follow-up changes it to `h1 → h2 → h3` and
adds exact heading-level assertions. Lint, 42-route build and 14/14 local
mobile/desktop Playwright pass. It requires protected PR verification and a
separate exact-artifact promotion before live acceptance.

## Browser GTmetrix limitation

GTmetrix was attempted in both the in-app browser and the existing Chrome
session. In both cases `Test Now` redirected to
`/signup?job_limit=1&redirect=%2F` before generating a report because the
anonymous job quota is exhausted. No account was created, no terms were
accepted and no credentials or personal data were entered. This is an exact
external quota limitation, not a substituted pass.

