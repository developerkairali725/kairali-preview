# URL, Sitemap and Migration Standard

**Version:** 1.0  
**Issued:** 2026-07-19  
**Scope:** This standard governs discovery, preservation and controlled change of every existing URL and sitemap entry. It defines the master URL inventory, six-class disposition, approved future sitemap, redirect map, migration rehearsal, launch verification and stabilization controls used by all existing-asset and migration workflows.  
**Referenced by:** `B2C-NEW-WEBSITE`, `B2C-EXISTING-WEBSITE`, `B2C-NEW-ORGANIC`, `B2C-EXISTING-ORGANIC`, `B2C-NEW-LANDING`, `B2C-EXISTING-LANDING`; `B2B-NEW-WEBSITE`, `B2B-EXISTING-WEBSITE`, `B2B-NEW-ORGANIC`, `B2B-EXISTING-ORGANIC`, `B2B-NEW-LANDING`, `B2B-EXISTING-LANDING`; `D2C-NEW-WEBSITE`, `D2C-EXISTING-WEBSITE`, `D2C-NEW-ORGANIC`, `D2C-EXISTING-ORGANIC`, `D2C-NEW-LANDING`, `D2C-EXISTING-LANDING`; `SHOPIFY-NEW-STORE`, `SHOPIFY-EXISTING-STORE`, `SHOPIFY-NEW-ORGANIC`, `SHOPIFY-EXISTING-ORGANIC`, `SHOPIFY-NEW-LANDING`, `SHOPIFY-EXISTING-LANDING`, and the corresponding manual-embedded workflows.

> **Precedence note:** Where a workflow uses a shorter migration checklist, this standard and the Master OS stop conditions control.

## 1. Core preservation rule

No existing URL may be removed, merged, renamed, redirected, canonicalized away, archived or retired until its traffic, queries, conversions, revenue, backlinks, internal links, ads, emails, feeds, external references and historical purpose have been checked.

## 2. Master URL discovery

Build the inventory from all available sources; never rely on navigation or the current XML sitemap alone:

- HTML crawl and JavaScript-rendered crawl;
- XML sitemap index and all child sitemaps;
- Google Search Console pages, queries and indexing exports;
- GA4 landing pages and conversion paths;
- CRM/backend/order/booking/form records;
- server/CDN logs;
- backlink tools and linked-source exports;
- paid-ad, email, affiliate, social and QR-code destinations;
- CMS/database exports;
- Shopify products, variants, collections, blogs, pages and redirects;
- image, video, PDF, document and feed URLs;
- historical crawl, analytics, archive and redirect files;
- manual owner/operator knowledge and offline references.

For each discovery source, preserve the raw dated export and configuration.

## 3. Required URL inventory fields

Each URL row must contain at least:

- URL ID and current URL;
- protocol, host, path and parameters;
- asset type/template;
- HTTP status and redirect target/chain;
- indexability, robots directive and crawlability;
- declared canonical and observed/search-selected canonical where available;
- sitemap membership;
- hreflang set;
- title, H1, metadata and structured data;
- internal inlinks/outlinks and crawl depth;
- organic clicks, impressions, queries and ranking role;
- sessions, conversions, revenue or qualified leads;
- backlinks and referring domains;
- paid, email, feed, affiliate and offline references;
- owner and historical purpose;
- content quality/freshness and legal/claims constraints;
- approved disposition, future URL and rationale;
- redirect/canonical/sitemap/internal-link action;
- reviewer, approval date and evidence IDs.

Unknown values remain `UNKNOWN`; they are not treated as zero.

## 4. Six-class URL disposition

Every URL must receive exactly one disposition:

1. **PROTECT** — preserve URL and material purpose/equity. Changes require protected-elements list and regression tests.
2. **REFRESH** — retain URL; improve content, proof, UX, technical implementation or conversion path while protecting intent and equity.
3. **CONSOLIDATE** — merge overlapping assets into one strongest canonical destination; preserve valuable unique content and links; redirect redundant URLs to the closest intent match.
4. **REDIRECT** — URL changes or becomes obsolete but has user/search/reference value; use a permanent one-hop redirect to the closest relevant destination.
5. **ARCHIVE/NOINDEX** — retain for users, records or history but remove from search eligibility deliberately; specify discoverability, links and retention.
6. **RETIRE** — remove when no useful user/search/commercial/reference purpose remains. Return an intentional 404/410 as approved; do not redirect everything to the homepage.

The accountable business owner, a human, approves dispositions for high-value or high-risk URLs.

## 5. Current and proposed sitemap standard

Create and approve both:

- **Current sitemap/architecture:** the observed state, including orphan and non-sitemap URLs.
- **Proposed sitemap/architecture:** the intended future URL, page purpose, primary intent, conversion role, owner, indexability and internal-link model.

Submitted XML sitemaps must achieve:

- 100% intended canonical, indexable, 200-status URLs;
- zero unintended redirects, `noindex`, 4xx or 5xx entries;
- correct host/protocol/locale;
- no duplicates or noncanonical parameters;
- accurate `lastmod` only when supported by real change data;
- child sitemaps segmented when operationally useful;
- validated XML and successful search-console fetch.

Sitemap inclusion does not guarantee indexing. Search eligibility and indexing are verified separately.

## 6. Redirect-map standard

Each redirect row must include:

- source URL;
- approved destination URL;
- disposition/reason;
- redirect code;
- current status and current target;
- intended final target;
- intent match explanation;
- backlinks/traffic/conversion priority;
- internal/campaign/feed links to update;
- test result, chain length and loop check;
- owner and approval.

Rules:

- use one hop where controllable;
- no loops;
- redirect to the closest intent match;
- do not mass-redirect unrelated URLs to the homepage;
- update internal, campaign, email, feed and canonical links to the final destination rather than relying on the redirect;
- preserve valuable query, content and backlink relevance;
- document unavoidable external legacy chains as exceptions;
- retain redirects for the approved migration lifetime and any longer business/legal requirement.

## 7. Protected-elements register

For every protected or high-value URL, capture before change:

- full-page desktop/mobile screenshots;
- copy and headings;
- metadata and structured data;
- internal links and navigation placement;
- form/CTA/conversion components;
- media and downloadable assets;
- ranking queries and landing-page performance;
- backlinks and important referrers;
- paid/email/offline destinations;
- analytics/tag and CRM behaviour.

The future page brief states what must be preserved and what may change.

## 8. Migration rehearsal

Before production release:

1. Freeze dated baselines and approved inventory.
2. Deploy the exact release candidate to a controlled environment.
3. Crawl old URLs in list mode against the release candidate.
4. Test the complete redirect map for code, destination, one-hop path, loop and intent.
5. Crawl the new site in HTML and rendered modes.
6. Compare statuses, indexability, canonicals, hreflang, titles, H1s, schema, internal links and sitemap membership.
7. Test forms, CRM, calls, bookings, payments, feeds and analytics.
8. Run performance, accessibility, security, market/language/currency and backup/rollback tests.
9. Produce a launch-readiness certificate with open issues.
10. Obtain human approval from the accountable business owner.

Do not proceed with open P0, unaccepted P1, incomplete URL discovery, failed redirect/conversion/tracking/security/rollback test or missing accountable owner.

## 9. Launch verification

At launch, the command centre verifies:

- DNS/SSL/availability;
- production robots, `noindex`, canonicals and hreflang;
- priority and sampled redirects;
- current XML sitemap and search-console submission;
- live HTML/rendered crawl;
- real primary conversion in each critical market/path;
- analytics, CRM/order/payment and consent reconciliation;
- feeds, ad destinations and external critical links;
- 404/5xx, redirect and canonical anomalies;
- rollback ability.

Every check records timestamp, release ID, result, owner, evidence and retest.

## 10. Stabilization windows

- **24h:** availability, directives, priority redirects, full crawl, sitemap fetch, primary conversion, analytics and critical errors.
- **72h:** crawl/index signals, 404/5xx and redirect anomalies, paid/feed destinations, conversion/revenue and regional routing.
- **7d:** GSC samples, priority indexation, queries/rank clusters, backlinks, lead/order quality and unresolved defects.
- **28d:** seasonally comparable traffic, indexation, revenue/conversion, CWV, content/query losses, root-cause fixes and acceptance.

An unexplained material regression stops acceptance and returns the issue to diagnosis or rollback.

## 11. Migration completion criteria

Migration is complete only when:

- every discovered URL has an approved disposition;
- intended sitemap hygiene is 100%;
- redirect tests pass and important external references are protected;
- production crawl and indexability match specification;
- conversions, tracking and commercial systems reconcile;
- 24h/72h/7d/28d reports are stored;
- no unexplained material regression remains;
- the accountable human business owner accepts the release.

## 12. Change control

An AI may classify, compare and recommend URL actions but may not delete, redirect, canonicalize, disavow or publish changes autonomously. It must **propose the change to the owner for approval**.

---

# Kairali adoption appendix (OS v2)

**Adopted:** 2026-07-19 14:09:19 IST per D-20260719-11/-12 (owner-delivered GPT standards zip).
**Source integrity:** everything above the horizontal rule is the owner's GPT-authored file, byte-verbatim (SHA-256 `0ec1ccb56bdbfa58752082e15ed8c6a6be86465b0f2ef4dcb970676120fc3a47`, zip manifest verified 7/7; immutable copy at docs/process/os-2026/source/00_SHARED_STANDARDS/03_URL_SITEMAP_MIGRATION_STANDARD.md).
**Supremacy:** Kairali v1 doctrine (CLAUDE.md, the merge plan's §2.6 strict union) is SUPREME over this file wherever they conflict (plan §0). The notes below subordinate specific passages; silence subordinates nothing — v1 always wins by default.
**Screen:** ingest screen per doctrine rule (r) + D-20260719-11 — 21-lens multi-agent screen + adversarial verify + completeness critic + first-party read; findings dispositioned in docs/reports/2026-07-19-standards-ingest-screen.md.

## Subordination notes (v1 supreme)

- **Precedence scoped** as in 00; v1 PROTECTION MAP doctrine (carried below) is the binding law this standard operationalizes.
- **Disavow:** HARD GATE 10 — no disavow submissions in the agent lane, ever. "May not disavow autonomously" never implies a gated agent path.
- **Execution lane:** RETIRE/404/410 and every other disposition EXECUTE via the human lane (Deepu / owner-approved script). The agent's lane ends at the approved inventory, map and PR (HARD GATES 1–2). The real-conversion step in §9 is a human command-centre action.
- **Disposition mapping:** the six classes map onto v1 KEEP-AS-PAGE/MERGE/301 (PROTECT+REFRESH ⊂ KEEP · CONSOLIDATE = MERGE · REDIRECT = 301); ARCHIVE/NOINDEX and RETIRE are additions requiring owner approval per URL, and content-rich ranking pages are never redirected to thin targets (v1 build matrix).

## Obligations carried

This standard carries the following merge-continuity.yaml obligations. Each is quoted verbatim — the quote, not this file's paraphrase of it, is the binding text (validated by scripts/standards-acceptance.mjs).

- **CM-105**
  > **MINE FIRST, ALWAYS**: full live-site inventory (sitemap, every URL, per-page value signals, assets, security screen) BEFORE design decisions. Mining the live site is not optional homework — it is step zero.
- **CM-106**
  > **PROTECTION MAP before any flip**: every legacy URL gets an explicit fate — KEEP-AS-PAGE (rebuild it), MERGE (into which page), or 301 (to which exact single-hop target). Content-rich ranking pages are never redirected to thin targets. Search Console data ranks the URLs when available.
- **CM-107**
  > **"Lean at birth, complete at launch"**: a new site may START lean, but DNS does not flip until it has absorbed the legacy site's ranking value and Abilash approves.
- **PKG-003**
  > Classify every URL: protect, refresh, consolidate, redirect, archive/noindex or retire.
- **PKG-036**
  > Never infer that an existing URL/page has no value without checking all discovery and commercial sources.
- **PKG-068**
  > New registry row + front gate baseline between brief and strategy wherever a live predecessor exists … CI blocks the strategy approval row until baseline/ is committed. Same register re-run at T+7/30/60/90 post-flip = the old-vs-new proof.
