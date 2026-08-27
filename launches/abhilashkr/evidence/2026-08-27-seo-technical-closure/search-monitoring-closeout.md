# Search and visibility monitoring closeout

- Task: `WOPS-ABHILASHKR-SEO-TECHNICAL-CLOSURE-001`
- Collected: 28 August 2026, 01:51 IST
- Property: `sc-domain:abhilashkr.com`
- Completion class: `ACTION-COMPLETE / MONITOR-OPEN`

## Authenticated Google Search Console baseline

The Search Console property was read through the owner's existing authenticated
session. The Performance report had a three-month filter selected and exposed
data from 9–25 August 2026, last updated approximately six hours before this
check:

| Metric | Observed value |
|---|---:|
| Total clicks | 2 |
| Total impressions | 54 |
| Average CTR | 3.7% |
| Average position | 33.3 |

Observed query rows:

| Query | Clicks | Impressions |
|---|---:|---:|
| `abhilash ramesh` | 0 | 4 |
| `abhilashpalakkad` | 0 | 2 |
| `akhil ayurvedic sansthan` | 0 | 1 |

Observed page rows:

| Page | Clicks | Impressions |
|---|---:|---:|
| `/` | 2 | 30 |
| `/about` | 0 | 17 |
| `/now` | 0 | 5 |
| `/contact` | 0 | 3 |
| `/recognition` | 0 | 3 |
| `/speaking` | 0 | 3 |
| `/de/ueber-mich` | 0 | 1 |
| `/work` | 0 | 1 |
| `/faq` | 0 | 1 |
| `/media` | 0 | 1 |
| `/investing` | 0 | 1 |

These are Search Console aggregate rows; row values must not be summed as if
they were mutually exclusive. Low-volume and anonymized query data may not
appear in the visible query table.

## Indexing, sitemap and search safety

- Indexing report, last updated 21 August 2026: 32 indexed and 13 not indexed.
- The 13 processing/exclusion rows are: 2 pages with redirects, 6 discovered
  but currently not indexed, and 5 crawled but currently not indexed.
- Validation is `Not Started`; no repeated validation or indexing request was
  issued because these are current Google processing states and the canonical
  sitemap is already accepted.
- `https://abhilashkr.com/sitemap.xml` is `Success`, submitted 10 August 2026,
  last read 24 August 2026, and reports 37 discovered pages.
- Core Web Vitals has no field data yet. The release's browser PageSpeed values
  are lab data and are not substituted for CrUX.
- Manual Actions: `No issues detected`.
- Security Issues: `No issues detected`.
- Search Console's Links report says it is still processing data and to check
  again later. The external-link export is therefore not available yet.

## Keyword, entity and vendor baseline

- The existing fact-safe `keyword-map.md` remains the controlled qualitative
  map for English, German and French page intent.
- A current public discovery sample found the canonical homepage for the full
  name and found corroborating Kairali and LinkedIn entity profiles. This is a
  bounded discovery check, not a comprehensive rank, competitor or backlink
  study.
- The configured DataForSEO account passed its free authentication check. No
  billable keyword-volume, SERP or backlink pull was made, so cost for this
  closeout was zero and no third-party estimate is presented as first-party
  fact.
- No outreach, link placement, paid campaign or off-page mutation was made.

## Bing and AI-search boundary

The site is not present in the owner's authenticated Bing Webmaster Tools
property list. Bing offers import from the verified Search Console property,
but its continuation requests Google Search Console read-only access plus
offline/persistent access for recurring verification and sitemap updates. That
new cross-service OAuth permission was not granted without action-time owner
confirmation. Manual Bing verification would instead require a new detectable
site/DNS verification change and a separate release path.

No one-time check can complete ongoing citation monitoring across ChatGPT,
Perplexity, Gemini and other answer engines. The site now exposes the technical
surfaces used for discovery (`robots.txt`, `sitemap.xml`, structured data and
`llms.txt`), while actual citations and mentions remain a time-based monitoring
program rather than a release claim.

## GTmetrix recheck

The public GTmetrix test was attempted again on 28 August 2026. `Test Now`
redirected to `/signup?job_limit=1&redirect=%2F`; the anonymous quota remains
exhausted. No account was created, no terms were accepted and no personal data
was entered. The browser PageSpeed results in `post-release.md` remain the
available current performance evidence.

## Closure decision

The current authenticated Google snapshot, qualitative keyword map, free vendor
readiness check and bounded public entity-discovery baseline are complete.
Indexing, field Core Web Vitals, backlink processing, rankings and AI citations
remain `MONITOR` items. Bing import is `BLOCKED` only on explicit owner approval
for its persistent Google OAuth permission.

