# Protected Preview verification

- Task: `ISS-abhilashkr-com-0001`
- Verified: `2026-08-27 17:42:02 IST` (`2026-08-27T12:12:02Z`)
- Builder commit: `257532ac9533941b8a281efbb25879f2739faecf`
- Vercel deployment: `dpl_5FWgndB5sqzshKbeiLGmFMkkfAY3`
- Environment: `preview`
- Status: `Ready`
- Protected Preview: <https://kairali-web-factory-abhilashkr-3okk1lz30-kairali.vercel.app>
- Production promotion: not performed

## Authenticated deployment checks

Vercel's authenticated Preview request path was used; Deployment Protection was
not disabled.

- All 24 German and French sitemap routes returned HTTP 200.
- Image counts matched the approved localized parity contract:
  - `/de` 2, `/de/ueber-mich` 1, `/de/arbeit` 7, `/de/vortraege` 1.
  - `/fr` 2, `/fr/a-propos` 1, `/fr/travail` 7, `/fr/conferences` 1.
- Both localized work pages contained all seven approved enterprise assets:
  `healing-village-grounds.jpg`, `kappl-product-range.png`, `kac-therapy.jpg`,
  `kac-centre.jpg`, `villa-raag-exterior.jpg`, `villa-raag-1.webp`, and
  `villa-raag-2.webp`.
- `/contact` contained the exact email, phone, and LinkedIn destinations.
- `/contact` contained the pre-submit no-send/no-store disclosure and the
  `Prepare Email Draft` action.

## Release posture

The scoped Preview verification passed. The issue remains `STAGING_QA` because
the repository's path resolver expanded this change into the full cross-site CI
matrix; that independent CI is not green. One unrelated
`lighthouse (sites/theblushlounge.com)` job was failing at evidence capture time,
while other matrix jobs were still pending. No production release or merge is
claimed.
