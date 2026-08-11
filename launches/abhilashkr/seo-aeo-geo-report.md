# SEO / AEO / GEO audit — abhilashkr.com

- **Timestamp:** 2026-08-11 06:32 IST
- **Target:** final local production build
- **Scope:** 37 sitemap URLs, crawl files, four protected draft routes, OG and
  locale reciprocity
- **Method:** rendered HTTP crawl in batches of 25 + 12, JSON-LD parsing,
  internal-target crawl in batches of 25 + 15, browser/Lighthouse evidence

## Verdict: PASS for preview; production/Search Console follow-up pending

### SEO

- 37/37 sitemap URLs return 200.
- 37/37 have a title between 1 and 60 characters and description between 1 and
  155 characters.
- 37/37 have exactly one H1 and the expected self-canonical.
- 36 top-level pages form twelve complete EN/DE/FR/x-default clusters.
- The public essay is deliberately English-only and emits no false alternate.
- `html lang` is correct for all 37 pages.
- 40/40 unique internal targets return 200; no redirect migration was required
  because all existing English URLs were retained.
- `robots.txt`, `sitemap.xml`, `llms.txt` and RSS are present. AI crawlers are
  not selectively blocked.
- The one over-limit essay description found in the crawl was shortened and the
  full 37-page audit rerun to zero failures.

### AEO

- FAQ routes are localized and carry FAQPage schema.
- Localized home pages give a direct identity/role answer before the card grid.
- Contact, role, work and investment intent are exposed with descriptive links.
- No FAQ or answer is invented around medical outcomes, eligibility, pricing or
  services this personal site does not provide.

### GEO / entity consistency

- Person schema is global and uses a stable `#person` identifier.
- Localized pages add ProfilePage; the public essay adds BlogPosting.
- 37/37 schema sets parse successfully.
- `llms.txt` lists the canonical entity facts and the real English/German/French
  entry points, and states that the essay body is English-only.
- Names of organizations and awards remain unchanged across translations.
- A verified LinkedIn profile and media/recognition pages support the entity hub.

### Publication safety

- Four `draft: true` files are absent from sitemap, feed, writing listings and
  command search and return 404.
- Missing review provenance is shown as “Not listed”; no reviewer or public-domain
  assertion is fabricated.

### Search/listing decisions

- Search Console domain ownership and sitemap acceptance already exist. After
  production, re-submit the existing canonical sitemap once and request no
  duplicate property.
- Bing Webmaster is not yet verified and stays open.
- No Google Business Profile is created: known facts do not establish an
  eligible customer-facing location/service-area listing for this personal hub.
- `keyword-map.md` is qualitative and fact-safe. Search volume and competitor
  numbers remain unknown rather than invented.

### Deferred measurements

- GA4/GTM/pixels are off pending Google's owner-binding legal acceptance and
  privacy/controller approval.
- Day-1 and Day-7 GSC coverage, field CWV and query observations require the
  production release and passage of time.

