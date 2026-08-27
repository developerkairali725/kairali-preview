# Live release and production verification

- Task: `WOPS-ABHILASHKR-SEO-TECHNICAL-CLOSURE-001`
- Issues: `ISS-abhilashkr-com-0002`, `ISS-abhilashkr-com-0003`
- Owner production authority: current chat, reconfirmed before release
- Pull request: `#292`, human-merged 28 August 2026 00:54:02 IST
- Reviewed head: `dd288cc71777a891979ef0232fb77832b574e1a5`
- Merge commit: `88ee5b81d1511d6c4e8206200f9ef7e13250a8c2`
- Verified Preview: `dpl_34GcLAUh4mtAFRjYoPgRyjVt5pf6` (`READY`)
- Promoted production: `dpl_2juvGPYsUi8kPYn4CMAgJU7MSd4p` (`READY`)
- Production URL: `https://kairali-web-factory-abhilashkr-kh9idyggp-kairali.vercel.app`
- Public aliases: `https://abhilashkr.com`, `https://www.abhilashkr.com`
- Retained rollback: `dpl_DL7UZrz237RtFrFDF8ckBU92oEE3` (`READY`)

## Release and rollback proof

The protected Preview was inspected as `READY` immediately before release.
`vercel promote dpl_34GcLAUh4mtAFRjYoPgRyjVt5pf6 --yes` promoted the
reviewed artifact lineage to production; Vercel created production deployment
`dpl_2juvGPYsUi8kPYn4CMAgJU7MSd4p`. Inspection after the promotion proved that
deployment is `READY`, targets production, and owns both public aliases. The
prior production deployment remains `READY` as the exact rollback point.

## Public functional verification

The focused public release run against `https://abhilashkr.com` passed 18/18
Playwright tests at mobile 375 and desktop 1280:

```text
CI=1 SITE=sites/abhilashkr BASE_URL=https://abhilashkr.com pnpm exec playwright test tests/factory/abhilash-seo-security.spec.ts tests/factory/abhilash-contact-i18n.spec.ts tests/factory/abhilash-analytics-consent.spec.ts
```

The run covers all 37 sitemap routes; the stable Person, WebSite and
Organization graph; URL-exact page nodes; localized visible breadcrumbs and
`BreadcrumbList`; sequential headings; alt text; landmarks; mobile overflow;
all-language approved imagery; EN/DE/FR email, phone and LinkedIn links; the
email-draft-only/no-send/no-store contact disclosure; privacy-minimal consent;
consent-gated analytics; CSP and complementary response policies. A production
runtime-log scan found no matching error, fatal, or HTTP 5xx entries in the
post-release 30-minute window.

## Browser PageSpeed Insights

These reports were generated through the browser against the public apex after
release. PageSpeed reported no CrUX field data, so the values below are lab
measurements and may vary.

| Route | Mobile performance | Desktop performance | Accessibility / Best Practices / SEO | Agentic Browsing |
|---|---:|---:|---|---:|
| `/` | 95 | 100 | 100 / 100 / 100 | 3/3 |
| `/contact` | 94 | 96 | 100 / 100 / 100 | 3/3 |
| `/de` | 94 | 100 | 100 / 100 / 100 | 3/3 |
| `/fr` | 99 | 100 | 100 / 100 / 100 | 3/3 |

- Homepage report: `https://pagespeed.web.dev/analysis/https-abhilashkr-com/wl24dsebfx`
- Contact report: `https://pagespeed.web.dev/analysis/https-abhilashkr-com-contact/8i2a1fa7fm`
- German report entry: `https://pagespeed.web.dev/analysis?url=https%3A%2F%2Fabhilashkr.com%2Fde`
- French report entry: `https://pagespeed.web.dev/analysis?url=https%3A%2F%2Fabhilashkr.com%2Ffr`

Mobile lab LCP was 2.3–3.2 seconds, TBT 10–30 ms and CLS zero. Desktop lab LCP
was 0.5–0.7 seconds, TBT 10–160 ms and CLS zero. PageSpeed explicitly
recognized the CSP and strong HSTS policy. Automated Accessibility 100 does
not replace the manual accessibility checks PageSpeed itself recommends.

## Browser GTmetrix limitation

GTmetrix was attempted through the browser after release. `Test Now` redirected
to `/signup?job_limit=1&redirect=%2F` because the anonymous test quota is
exhausted. No account was created, no terms were accepted, and no personal data
or credentials were entered. This is an external account/quota boundary, not a
substituted pass.

## Explicit remaining boundaries

This release closes the production-safe implementation and automated live
verification scope. It does not claim legal-counsel certification, a complete
manual WCAG audit, an OWASP ZAP penetration assessment, account-gated
Google/Bing webmaster verification, GTmetrix account access, or an ongoing
keyword/backlink/off-page/AI-citation monitoring campaign.
