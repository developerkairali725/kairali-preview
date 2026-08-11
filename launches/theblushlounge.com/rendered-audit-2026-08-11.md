# Rendered route audit — 11 August 2026

Final local production build at `http://127.0.0.1:4175`, Playwright Chromium.

## Coverage

- 6 pages × 2 viewports = 12 rendered page checks
- desktop and mobile screenshots for Home, Portfolio, Services, Academy, About and Contact in `screens/pilot-2026-08-11/`
- internal-link crawl: 6 unique canonical targets
- robots, sitemap, manifest, `llms.txt` and favicon endpoints
- representative legacy redirects and unknown-route behavior

## Result

- 12/12 pages: 200; 0 console errors; 0 Next error overlays; 0 horizontal overflow
- every page: meaningful content, title <=60, description <=155, canonical, one H1, parseable JSON-LD, image alt text
- 0 forms and 0 analytics/tag-manager loaders
- 6/6 internal targets: 200
- `/about.php`: 308 to `/about`
- `/blog/legacy-post`: 308 to `/`
- unknown route: 404
- `/llms.txt`, `/manifest.json`, 16/32/180/512 icons: 200
- security headers: `nosniff`, `DENY`, `strict-origin-when-cross-origin`, restrictive Permissions Policy

Factory suite on the same build: 16 passed, 12 intentional single-locale/personal-brand/no-form skips, 0 failures.

Visual spot-checks included desktop Home, mobile Home and mobile Contact. No broken image, clipped content, overlap or unusable contact path was observed. The mobile homepage was re-captured after lazy images loaded; 7/7 images reported complete with non-zero natural width.
