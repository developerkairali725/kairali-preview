# Tool and Report Register

**Version:** 1.0  
**Issued:** 2026-07-19  
**Scope:** This standard defines the 18 operational tool/report stages assumed by `TOOL_STACK_REGISTER.csv`, the mandatory report families, evidence configuration, decision use, limitations, retention and never-overwrite controls. Tools are selected for a defined decision or operational use; a tool score is not proof by itself.  
**Referenced by:** `B2C-NEW-WEBSITE`, `B2C-EXISTING-WEBSITE`, `B2C-NEW-ORGANIC`, `B2C-EXISTING-ORGANIC`, `B2C-NEW-LANDING`, `B2C-EXISTING-LANDING`; `B2B-NEW-WEBSITE`, `B2B-EXISTING-WEBSITE`, `B2B-NEW-ORGANIC`, `B2B-EXISTING-ORGANIC`, `B2B-NEW-LANDING`, `B2B-EXISTING-LANDING`; `D2C-NEW-WEBSITE`, `D2C-EXISTING-WEBSITE`, `D2C-NEW-ORGANIC`, `D2C-EXISTING-ORGANIC`, `D2C-NEW-LANDING`, `D2C-EXISTING-LANDING`; `SHOPIFY-NEW-STORE`, `SHOPIFY-EXISTING-STORE`, `SHOPIFY-NEW-ORGANIC`, `SHOPIFY-EXISTING-ORGANIC`, `SHOPIFY-NEW-LANDING`, `SHOPIFY-EXISTING-LANDING`, and the corresponding manual-embedded workflows.

> **Precedence note:** Where a workflow lists a different tool or report, the Master OS evidence hierarchy and the decision purpose in this register control. Tools may be substituted only when equivalent evidence, configuration and limitations are documented and the accountable business owner approves.

## 1. Universal report-run requirements

Every report run must record:

- report/run ID;
- client, project, phase, release and issue IDs;
- source/tool and exact version or plan;
- configuration, API query, filters, crawl settings and user agent;
- property/domain/environment and URL scope;
- market, country, location, language, currency and device;
- date range, comparison range, timezone and collection timestamp;
- operator or agent identity and model/version where applicable;
- raw file names, MIME types, sizes and SHA-256 hashes;
- sampling, exclusions, failures, missing dimensions and licence limitations;
- upstream inputs, downstream findings and approval state.

## 2. Evidence layers and storage

- **RAW:** immutable exports as collected: CSV, JSON, crawl files, HAR, screenshots, videos, PDFs, logs and platform exports.
- **PROCESSED:** normalized tables, joins, calculations, notebooks or scripts; each references RAW inputs.
- **PUBLISHED:** dashboards, reports, summaries and decisions; each references processed calculations and RAW artifact IDs.

Never edit or overwrite RAW evidence. Corrections create a new run ID.

Recommended package storage pattern:

```text
clients/{client_id}/projects/{project_id}/
  00_governance/
  01_raw/{YYYY}/{MM}/{DD}/{source}/{report_type}/{run_id}/
  02_processed/{dataset}/{version}/
  03_findings/{issue_id}/
  04_specifications/
  05_implementation/{release_id}/
  06_qa/{release_id}/{environment}/
  07_launch/{release_id}/
  08_monitoring/{cadence}/{period}/
  09_published_reports/{version}/
  10_archive/
```

## 3. Retention and versioning policy

For every report family, the owner must record an approved retention period based on legal, contractual, financial, security, privacy and operational requirements. The following are mandatory regardless of the period chosen:

- never overwrite a baseline, monthly report, pre-launch report, migration inventory, redirect map, launch report or release evidence;
- use a timestamped run ID and version for each collection;
- save a human-readable PDF where supported **and** the corresponding machine-readable CSV/JSON/API response and settings;
- preserve dashboard queries/definitions with data exports;
- create a checksum manifest after every evidence collection;
- retain pre-migration URL, crawl, backlink, analytics, sitemap and redirect evidence for at least the useful life of the migration and any longer legal/contractual requirement;
- deletion requires the approved retention schedule and accountable human owner authorization.

## 4. Eighteen-stage tool and report register

| Stage | Primary | Secondary | Mandatory reports | Decision supported | Known limit | Retention rule |
|---|---|---|---|---|---|---|
| **1. Commercial truth** | CRM + finance/backend | Shopify/ERP/CDP | Orders, lead stages, wins/losses, refunds, margin, cohorts | Revenue and contribution truth | Definitions and attribution must be governed | Approved financial/legal retention; immutable dated export for every baseline and release comparison |
| **2. Google organic** | Google Search Console | BigQuery/API extraction | Performance by query/page/country/device/appearance; Page Indexing; Sitemaps; Crawl Stats; CWV; Links; enhancements; generative-AI reports where available | Google visibility, indexing and migration monitoring | API limits, UI-only data and reporting lag | Preserve baseline, pre/post-launch, monthly and incident exports; never overwrite |
| **3. Analytics and tags** | GA4 + GTM | Server-side GTM/warehouse | Landing pages, acquisition, funnels, ecommerce, events, attribution, geography; container/version/consent audit | Behaviour and attributed conversion | Consent, blockers and modelling create gaps | Preserve event spec, container versions, debug evidence and dated exports for each release |
| **4. Technical crawling** | Screaming Frog SEO Spider | Sitebulb/Lumar/Oncrawl/JetOctopus | HTML crawl; JS crawl; sitemap crawl; list-mode historical URLs; crawl comparison; canonicals; directives; links; schema; hreflang; images | URL-level diagnosis and regression | Crawler view depends on configuration and access | Preserve raw crawl files and comparison exports for every baseline, rehearsal, launch and incident |
| **5. Automated SEO data** | DataForSEO APIs | Custom crawler/data warehouse | On-Page, SERP, Labs, backlinks, business/maps, merchant/shopping, Lighthouse | Agent-agnostic acquisition at scale | Paid estimates; validate critical findings with first-party/live checks | Preserve request configuration, API response and normalized output for each run |
| **6. SEO/competitor suite** | Semrush | Ahrefs + Similarweb | Site Audit; Organic Research; Position Tracking; Keyword Gap; Backlink Analytics/Audit; Advertising; AI visibility; Market/Traffic | Integrated SEO, paid and competitor trend analysis | Estimated traffic/volume/authority are not business truth | Retain dated competitor panels and monthly/quarterly trend exports; never replace prior snapshots |
| **7. Market/channel intelligence** | Similarweb | Semrush Traffic Analytics | Traffic/channel/device/geography/referrals/search/social/AI estimates; competitor set | Relative digital market/channel share | Modelled estimates; small sites can be noisy | Retain each dated estimate with competitor set and method; label as estimate |
| **8. Performance field** | CrUX/PSI + RUM | Shopify Web Performance; SpeedCurve/New Relic | LCP/INP/CLS P75 by URL/origin, device, geography; trends | Real-user performance and regressions | CrUX requires sufficient eligible traffic | Retain monthly field windows, pre/post-release comparisons and RUM definitions |
| **9. Performance diagnosis** | WebPageTest or GTmetrix | Chrome DevTools/Lighthouse CI | Waterfall, filmstrip/video, CPU/main thread, request chain, page weight, third parties, lab CWV | Root cause and performance budgets | Synthetic runs vary; control location/device/connection | Retain controlled run settings, raw artifacts and release-specific results |
| **10. Behaviour/UX** | Microsoft Clarity | Hotjar/FullStory | Heatmaps, scroll, rage/dead clicks, recordings, errors, funnel/form segments | Behavioural hypotheses and bug discovery | Not causal; consent and privacy masking required | Retain approved aggregate exports and masked evidence under privacy schedule; never retain excess personal data |
| **11. Usability research** | Moderated/unmoderated testing | UserTesting/Maze/Lookback | Task success, time, errors, comprehension, SUS/qualitative findings | User-task evidence and problem discovery | Sample and task design determine validity | Retain consent, protocol, anonymized results and synthesis under research/privacy schedule |
| **12. Accessibility** | axe-core + manual WCAG protocol | Accessibility Insights/WAVE/Deque | Automated violations; keyboard; screen reader; focus; zoom; contrast; forms; components | WCAG defect prevention and release gate | Automated coverage is partial | Retain issue-level evidence, manual test record and remediation retest for each release |
| **13. Visual/functional QA** | Playwright | Cypress/BrowserStack | Critical journeys, visual snapshots, forms/payments, redirects, locale/currency, screenshots/traces | Proof that release works and did not visually regress | Golden baselines require controlled environment and review | Retain traces, screenshots and results by release/environment; never overwrite golden baseline without approval |
| **14. Security** | OWASP ZAP + dependency scanner | Commercial DAST/SAST/penetration test | OWASP categories, headers, TLS, dependencies, auth/access, secrets, logging, restore | Risk detection and release gate | Automated scan does not replace expert testing | Retain reports and remediation evidence under security policy; restrict access; preserve release attestations |
| **15. Commerce feeds** | Google Merchant Center + Shopify | Feed management platform/DataForSEO Merchant | Diagnostics, item issues, price/availability/shipping/returns, free listings, feed/landing consistency | Shopping eligibility and product visibility | Platform policy and feed latency | Retain feed snapshots, diagnostics and release/incident comparisons |
| **16. Local** | Google Business Profile + local rank tool | BrightLocal/Whitespark/DataForSEO Business | Profiles, categories, reviews, calls/directions/bookings, grid rankings, citations | Location visibility and reputation | Proximity/personalization limit reproducibility | Retain profile exports, review snapshots and dated rank grids per location |
| **17. Paid competitor creative** | Google Ads Transparency Center + Meta Ad Library | TikTok Creative Center/Semrush Advertising | Active ads, creative, offer, destination, dates/markets; own impression share and landing experience | Creative/offer monitoring and paid gaps | Libraries do not expose full spend, targeting or performance | Archive dated screenshots/URLs with market and date; do not infer undisclosed performance |
| **18. Evidence/versioning** | GitHub + immutable object storage | GitLab/Bitbucket + S3 Object Lock/Drive Vault | Commits, PRs, required checks, artifacts, manifests, hashes, approvals, PDFs/CSV/JSON | Proof, rollback and audit trail | Permissions and retention must be configured | Retain according to approved project/legal policy; immutable release evidence and manifests are never overwritten |

## 5. Report acceptance check

A report is accepted only when:

- the metric and formula are defined;
- material dimensions are included;
- the source of truth is identified;
- the benchmark class is recorded;
- the absolute/relative gap and comparability are shown;
- diagnosis precedes recommendation;
- acceptance test, owner and monitoring period are specified;
- raw and processed evidence are linked;
- the accountable business owner signs the applicable gate.

## 6. Change control

An AI may recommend a new tool, report or retention change only when it has a defined decision use, evidence benefit, cost, privacy/security impact and migration plan. It must **propose the change to the owner for approval**. No agent may add or replace a register row autonomously.
