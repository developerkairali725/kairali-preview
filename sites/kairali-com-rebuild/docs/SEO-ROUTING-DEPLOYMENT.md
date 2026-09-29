# SEO, routing, integrations and deployment preparation

Checked against the primary guidance listed in BUILD-TASK.md on 29 Sep 2026:
- Google SEO starter guide
- Structured data introduction
- Site move with URL changes
- AI features
- ogp.me

The build does not claim or promise any ranking or rich result.

## Routing (site/proxy.ts, content/route-table.json)
- **Legacy URLs are kept.** All 142 retained pages are served at their exact `.aspx` path and query, so no page redirect is needed at cut-over. That is the lowest-risk option under the site-move guidance.
- **`/detail.aspx?page=<value>`** is matched byte-exactly (including the trailing `.` in `…xel-research.` and the `&` inside `…health-&-wellness-congress`).
  - Case variants redirect 301 once to the canonical spelling.
  - Unknown or missing values return a real 404. On the live site they were soft 404s.
- **`/apply-now.aspx?id=<n>`**: ids 7, 9, 17, 23 and 26 pre-select their opening. An unknown id serves the generic form, as the live site did, with its canonical set to `/apply-now.aspx`.
- **`/kairali-blog.aspx?page=2`** has its own content.
  - `?page=1` canonicalises to `/kairali-blog.aspx`.
  - `?page=3` and above return 404 (live served an empty shell).
- **One-hop 301s:**
  - `/default.aspx` → `/`.
  - `/namastedwaar-mansurpur-muzaffarnagar-up-india.aspx` → `/our-partner-resorts.aspx` (owner Q2).
  - Letter-case variants of any page or document → the canonical spelling. IIS ignored case; Vercel will not.
- **Real 404s** for:
  - CAPTCHA handlers
  - the 7 relative e-mail URLs
  - `/index.aspx`, `/site-map.aspx`, `/sitemap.html` and `/search.aspx`
  - direct access to the internal rewrite targets `/x/*`
- **Documents:** all 72 legacy files are served at their exact URLs (spaces and `&` included), byte-identical to the owner's legacy manifest. None redirects until a verified replacement exists (Q4). The Download Centre lists them as dated earlier editions.

## Indexability switch
- `SITE_ENV=production` is the only indexable mode. It enables:
  - the robots meta `index,follow`
  - `robots.txt` with `Allow` and the `Sitemap:` line
  - no `X-Robots-Tag` header
- Any other value (local, preview) gives:
  - `X-Robots-Tag: noindex, nofollow`
  - the robots meta `noindex`
  - `robots.txt` `Disallow: /`
- Verified locally: every page carries noindex.
- Production eligibility must be re-tested on the deployed host (Search Console URL Inspection, robots tester, social fetchers).

## Metadata policy (evidence/metadata-register.csv)
- **Live title and description** are kept verbatim where distinct, for search continuity.
- **Where the live value was shared** by several URLs (78 award pages used one title and description, as did 6 application variants and 2–3 pages elsewhere):
  - the title becomes `<page H1> | Kairali Ayurvedic Group`;
  - the description becomes an excerpt of the page's own opening copy.
- **Totals:** 92 titles and 89 descriptions changed out of 150. Every change is listed per route.
- **Home** follows owner Q3.
- **Canonical:** absolute `https://www.kairali.com` plus the exact legacy path and query. The home page uses the live form `https://www.kairali.com`.
- **Open Graph:** title, description, type, url, site_name and a per-family 1200×630 company photograph with alt text.
- **Twitter:** `summary_large_image`.
- The stale Facebook OG block and `og:audio` on the live home page are **not** copied (D5).
- There are no localhost URLs in the metadata; this is verified.
- **JSON-LD:**
  - `Organization` and `WebSite` on every page;
  - `BreadcrumbList` on every inner page;
  - `Article` on award detail pages;
  - `Event` for the World Wellness Weekend, whose dates are stated and visible.
- **No VideoObject**, because upload dates are not verifiable.
- No ratings, reviews or invented dates.
- No hreflang: there are no real translations; the Google Translate widget is dropped (D8).
- No `llms.txt` or other AI-specific file; Google's AI features guidance says none is needed.
- **Sitemap:** 149 canonical, indexable HTML URLs, all verified 200.
  - Excluded: `?page=1`, search, and documents (historical editions).
  - No `lastmod`, because the live server sent no Last-Modified and dates are not known per page.
- **Search results** (`/search-results.aspx`) are noindex and disallowed in production `robots.txt`. Filter states live in the URL `?q=` only on that page.

## Performance (lab only; not field proof)
- Local unthrottled Chromium on the home page: LCP 92 ms, CLS 0.000.
- Measures in place:
  - self-hosted subset fonts with metric-adjusted fallbacks and preload;
  - pre-sized WebP images with width and height;
  - a responsive `srcset` hero with `fetchpriority=high`;
  - lazy loading below the fold;
  - YouTube and Maps as click-to-load facades (no third-party request on load, verified).
- The CWV targets (LCP ≤ 2.5 s, INP ≤ 200 ms, CLS ≤ 0.1 at p75) need field data after launch.

## Integrations pending (nothing live in this build)

| Integration | State in build | Needed for production |
|---|---|---|
| Contact, enquiry, Svata, consultation, careers and newsletter forms | Client-side validation. The state reads "Details checked — not sent" and makes no network request (verified). | Recipients per form (Q8), a server endpoint or CRM, auto-reply text, retention, consent wording, and medical-data handling for the consultation. Careers needs CV upload storage and virus scanning. |
| Anti-spam | Honeypot field only | A production challenge (for example Cloudflare Turnstile or hCaptcha) plus server-side verification. The legacy image CAPTCHAs are retired. |
| State/city cascade | Free-text State and City | The live cascade came from an ASP.NET postback that was never captured (D6). |
| Chat widget (chat.kairali.com), Google Translate | Not included | Owner decision D8, if wanted. |
| Analytics / consent | None loaded | Add with a consent banner at launch, if required. |
| YouTube / Google Maps | Click-to-load facades | None |

## Deployment preparation (not deployed)
- **Stack:** Next.js 16.3.7 (App Router, SSG for all 156 routes, plus `proxy.ts` for legacy query routing), pnpm 11 with a lockfile, Node ≥ 22.
- **Build steps, in order:**
  1. `python3 pipeline/build_content.py`
  2. `python3 pipeline/curated_photos.py` <!-- Exact existing script filename, not promotional copy. compliance-allow: curated -->
  3. `python3 pipeline/build_downloads_events.py`
  4. `python3 pipeline/route_table.py`
  5. `cd site && pnpm install && pnpm build`
- **Environment:** `SITE_ENV=production` for the production host only. There are no secrets, and no credentials are in the source.
- **Static payload:** `public/download` is 473 MB (72 legacy files). The largest are:
  - the company brochure (94.4 MB)
  - `KTAHV_Presentation_2018.pptx` (62.2 MB)
  - the products catalogue (38.3 MB)
- **Verify the host's per-file and deployment size limits before upload.** If they are exceeded, host the legacy files on the owned document portal at stable URLs and add one-hop 301s from the exact legacy paths.
- **Proxy note:** internal rewrites carry the request header `x-kairali-internal-rewrite`. If a client sends that header itself, it can view the internal `/x/*` duplicates. They canonicalise to the legacy URL, so this is harmless for SEO, but the header can be stripped at the edge if preferred.
- **Post-deploy checks:**
  - production robots, sitemap submission and Search Console
  - an OG/Twitter fetch test
  - a redirect sample of the case and legacy aliases
  - the document byte check re-run against the production URL (`BASE=https://… python3 site/tests/verify.py`)
  - field CWV
