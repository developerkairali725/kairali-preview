# Metrics, Tools, Benchmarks and Solution Dictionary - 2026

## 1. How to use this dictionary

Every report and issue must answer seven questions:

1. **What is the metric and exact formula?**
2. **What dimensions are mandatory?** Region, domain, language, page/template, device, source, cohort and period are not optional when they materially change interpretation.
3. **What is the source of truth?** A third-party estimate cannot overrule finance, CRM, Search Console or server evidence.
4. **What benchmark class applies?** Hard standard, own baseline, peer percentile, industry study, economic requirement or experiment.
5. **How far behind or ahead are we?** Show absolute and percentage gap, confidence and comparability.
6. **What diagnosis should be performed before recommending a change?** Metrics do not identify causes by themselves.
7. **What exact improvement, acceptance test and monitoring period are required?**

## 2. Target-setting protocol

- Use a hard threshold only where an authoritative standard defines one.
- Use the client’s seasonal and cohort baseline as the default comparator for business performance.
- Build peer percentiles from the named relevant competitor set using identical definitions.
- Use industry benchmarks only as context and record sample, year, sector and conversion definition.
- Derive commercial targets from contribution economics, capacity and payback.
- Use experiments for uncertain causal changes; define minimum detectable effect and guardrails before launch.
- Record `not comparable` rather than forcing a misleading benchmark.

## 3. Core metric controls

| ID | Metric | Formula/definition | Source | Target/benchmark | If weak |
|---|---|---|---|---|---|
| COM-001 | Revenue | Sum of recognized transaction value after cancellations as defined by finance | Finance/backend | OWN seasonal baseline + ECONOMIC plan | Repair measurement; recover funnel; improve qualified demand, offer, CVR, AOV or retention |
| COM-002 | Contribution margin | Revenue minus variable product, fulfilment, payment, return, media and service costs | Finance | ECONOMIC target by business model | Prioritize profitable products/segments and improve price/operations |
| COM-003 | Revenue per session | Revenue / eligible sessions | Backend + analytics joined | OWN baseline, peer/context only | Improve intent match, funnel and merchandising |
| COM-004 | Qualified lead rate | Qualified leads / eligible sessions or submitted leads; state denominator | CRM | OWN baseline + sales capacity/economics | Refine audience, message, form and follow-up |
| COM-005 | Lead-to-win rate | Won customers / qualified leads | CRM | OWN cohort + sales target | Improve routing, enablement, proof, offer and nurture |
| COM-006 | CAC | Acquisition cost / new customers using agreed blended or channel definition | Finance + ad platforms | ECONOMIC target linked to contribution/LTV | Improve demand quality, conversion, retention and cost efficiency |
| COM-007 | LTV | Expected or realized contribution over defined customer horizon | Finance/CRM | OWN cohorts; model assumptions documented | Lifecycle, service, subscription/reorder, cross-sell, referral |
| COM-008 | Actual market share | Own category revenue or units / total category revenue or units | Audited sales + credible industry denominator | Strategic plan with confidence interval | Focus on specific segment/channel/region attack |
| COM-009 | Share of search | Brand search interest / total selected brand search interest | Google Trends + keyword data | Trend/leading indicator; validate with sales | Grow distinctive demand and category association |
| COM-010 | Digital traffic share | Estimated visits to own domain / selected competitor-set visits | Similarweb estimate | PEER trend with estimate confidence | Build channel-specific acquisition and retention plan |
| SEO-001 | GSC clicks | Clicks reported by Search Console | Google Search Console | OWN seasonal baseline and opportunity forecast | Fix eligibility, intent, snippet, content, authority or migration defects |
| SEO-002 | GSC impressions | Search result impressions under GSC definition | Google Search Console | OWN/PEER opportunity | Improve eligibility, coverage, content and authority |
| SEO-003 | Organic CTR | GSC clicks / impressions | Google Search Console | OWN by comparable position/feature; experiment | Rewrite/search appearance tests while preserving relevance |
| SEO-004 | Weighted organic SOV | Sum(search volume x visibility/CTR model) / total selected demand | Semrush/STAT/AccuRanker | PEER median then upper quartile in priority clusters | Close content/technical/authority gaps by cluster |
| SEO-005 | Top-3/Top-10 coverage | Priority keywords ranking in bands / tracked priority keywords | Rank tracker | Strategy-defined by cluster value | Improve/merge page, links, content and SERP fit |
| SEO-006 | Indexable URL count | Canonical 200 HTML URLs eligible for indexation | Screaming Frog + specification | Equals approved inventory within explained variance | Correct templates, parameters, sitemaps and internal links |
| SEO-007 | Priority indexation rate | Indexed priority canonical URLs / submitted priority URLs | GSC Page Indexing + URL Inspection | Near 100% for eligible high-value stable pages after reasonable discovery period | Fix root cause and resubmit naturally |
| SEO-008 | Canonical agreement rate | URLs where declared, sitemap, internal-link and Google-selected canonical agree / checked URLs | GSC URL Inspection + crawler | 100% on priority URLs; exceptions documented | Align all canonical signals |
| SEO-009 | Sitemap hygiene rate | Valid canonical indexable 200 URLs / sitemap URLs | Crawler + GSC Sitemaps | 100%; zero redirects/noindex/4xx/5xx | Fix sitemap generation and inventory |
| SEO-010 | Crawl waste ratio | Low-value/duplicate/parameter bot requests / total bot requests; definition documented | Server logs | Trend down without blocking useful discovery | Fix generation, links, parameters, status and crawl controls |
| SEO-011 | Internal link coverage | Priority URLs with at least required contextual/nav inlinks / priority URLs | Screaming Frog/Sitebulb | 100% priority pages; depth target by architecture | Add meaningful crawlable contextual links and update destinations |
| SEO-012 | Content decay rate | Previously valuable pages with sustained clicks/revenue decline / valuable pages | GSC+GA4/CRM | OWN trend and refresh SLA | Refresh, consolidate, improve evidence or retire deliberately |
| SEO-013 | Referring domain gap | Relevant domains linking to peers but not own site | Ahrefs/Semrush/DataForSEO | Close relevant feasible gaps; build unique assets | Create original research/tools/PR and reclaim links |
| SEO-014 | Broken backlink value | Backlinked source URLs resolving to error/irrelevant redirect and estimated value | Ahrefs/Semrush + crawl | Zero high-value broken targets | Restore or one-hop redirect to closest intent |
| AI-001 | Google generative impressions | Impressions in GSC generative AI report where available | GSC Generative AI report | OWN trend; availability caveat | Improve original expert content and technical/search foundations |
| AI-002 | Prompt mention share | Own brand mentioned / valid prompt runs | Controlled prompt panel | PEER same prompt/model; confidence intervals | Improve source ecosystem, product evidence and authoritative content |
| AI-003 | Citation share | Own domains cited / total citations in controlled prompt set | Controlled prompt panel | PEER trend by stable panel | Create cite-worthy evidence and fix entity/page clarity |
| AI-004 | AI factual accuracy rate | Accurate material claims about brand/offering / checked material claims | Manual reviewed prompt archive | 100% material facts or response plan | Correct owned/third-party data; publish authoritative facts |
| TEC-001 | Critical status error rate | Priority/internal URLs returning unexpected 4xx/5xx / checked URLs | Screaming Frog + live monitoring | 0% P0/P1; documented intentional 404/410 | Fix link/route/server; monitor |
| TEC-002 | Redirect chain rate | Redirecting URLs requiring >1 hop / redirecting URLs | Screaming Frog | 0 for internal links and migration map where controllable | One-hop redirect and update internal/campaign links |
| TEC-003 | Rendering parity | Priority content/links/meta present in rendered output and accessible without interaction | Screaming Frog JS + browser | 100% priority elements | SSR/prerender or reliable rendering; real href links |
| TEC-004 | LCP P75 | 75th percentile Largest Contentful Paint | CrUX/RUM | Good <=2.5s; needs improvement 2.5-4s; poor >4s [G12] | Optimize server, LCP resource discovery/size/priority and rendering |
| TEC-005 | INP P75 | 75th percentile Interaction to Next Paint | CrUX/RUM | Good <=200ms; needs improvement 200-500ms; poor >500ms [G12] | Reduce main-thread work, split tasks, optimize interactions |
| TEC-006 | CLS P75 | 75th percentile Cumulative Layout Shift | CrUX/RUM | Good <=0.1; needs improvement 0.1-0.25; poor >0.25 [G12] | Reserve dimensions, stable inserts/fonts and component behavior |
| TEC-007 | TTFB P75 | 75th percentile server response timing under chosen RUM definition | RUM/CrUX | Set own/architecture budget; diagnose LCP | Caching/CDN/backend/query optimization |
| TEC-008 | Page weight and requests | Transferred bytes and request count for controlled lab profile | WebPageTest/GTmetrix | Performance budget per template | Compress/remove/defer, enforce budgets |
| TEC-009 | Third-party script cost | Main-thread, network, privacy and failure contribution by third party | WebPageTest/DevTools | Only approved scripts with measured value | Remove, defer, consolidate, server-side where valid |
| TEC-010 | Uptime and transaction success | Successful availability/transaction checks / scheduled checks | Uptime/synthetic monitoring + backend | SLA by criticality; 100% critical conversion success in release tests | Rollback/fix and add monitor |
| UX-001 | Task success rate | Users completing defined task correctly / attempted users | Moderated/unmoderated usability test | Set per critical task; improve vs baseline/peer test | Fix IA, labels, content and interactions |
| UX-002 | Time on task | Time from task start to verified completion among successful attempts | Usability test | OWN baseline and context, not always lower | Simplify steps, labels and defaults |
| UX-003 | Critical error rate | Attempts encountering specified severe error / attempts | Usability/QA | 0 severe errors | Fix and regression-test |
| UX-004 | Onsite search success | Search sessions leading to relevant click/desired outcome / search sessions | Shopify/Search analytics | OWN baseline; zero-result target near 0 for important queries | Improve indexing, synonyms, merchandising and result design |
| UX-005 | Accessibility conformance | Applicable WCAG 2.2 AA success criteria passed | Manual audit + axe | WCAG 2.2 AA unless stricter law/contract [W01-W02] | Fix design system and code; retest with assistive tech |
| CRO-001 | Primary conversion rate | Primary conversions / eligible sessions or users; denominator fixed | Backend/CRM + analytics | OWN seasonal + industry context + experiment | Research then test highest-confidence constraint |
| CRO-002 | Landing page CVR | Defined page conversions / landing sessions under fixed attribution | CRM/backend + analytics | Use own control; UB median 6.6% only broad context [UB01] | Preserve control; run valid test |
| CRO-003 | CTA click-through | Qualified primary CTA clicks / eligible page views | Analytics | OWN baseline and downstream quality | Improve hierarchy/message and verify downstream |
| CRO-004 | Form completion | Successful valid submissions / form starts | Form/backend + analytics | OWN baseline; 0 delivery failures | Reduce friction, improve validation, preserve data and test routing |
| CRO-005 | Add-to-cart rate | Add-to-cart events / product-detail sessions or product viewers | Shopify/backend + analytics | OWN cohort and product-type peer context | Improve PDP, offer, merchandising and inventory |
| CRO-006 | Checkout completion | Completed orders / checkout starts | Shopify/backend | OWN baseline; peer research context | Fix checkout friction, costs and payment reliability |
| CRO-007 | Cart abandonment | 1 - completed purchases / carts or checkout starts; definition stated | Shopify/backend | OWN baseline; Baymard ~70% broad context, not target [BM02] | Fix hidden costs, trust, delivery, errors and recovery |
| CRO-008 | Return/refund rate | Returned/refunded units or value / fulfilled units or value | ERP/Shopify/finance | OWN product economics | Improve content/product/fulfilment and suppress bad acquisition |
| B2B-001 | MQL-to-SQL rate | Sales-qualified leads / marketing-qualified leads | CRM | OWN cohort and capacity | Refine ICP, qualification and handoff |
| B2B-002 | Pipeline sourced/influenced | Opportunity amount under documented sourcing/influence model | CRM | OWN plan; model clearly labelled | Improve account journey and attribution |
| B2B-003 | Lead response time | Time from valid inquiry to first meaningful response | CRM/call system | SLA by lead value/urgency | Automate routing/escalation and staff coverage |
| LOC-001 | Local pack visibility share | Observed grid/keyword visibility points won / eligible points | Local rank tracker/DataForSEO | PEER by location; selected priority areas | Improve profile, local page, reviews, citations and local authority |
| LOC-002 | Review health | Rating, volume, velocity, recency, topic and response SLA | Review platform/GBP | Own service standard + peer quartiles | Fix service and request authentic reviews |
| INT-001 | Hreflang validity | Valid reciprocal locale annotations / intended locale URLs | Crawler | 100% intended URLs; no invalid/missing return tags | Fix generated annotations and sitemap/html strategy |
| INT-002 | Wrong-market session rate | Sessions reaching wrong locale/currency/availability experience / evaluated sessions | GA4 + QA | Near 0 for material journeys | Use stable locale URLs and clear selector |
| INT-003 | Translation QA defect rate | Material linguistic/functional defects / reviewed units | Human linguistic QA | 0 critical; threshold by content risk | Fix source terminology, translation memory and review |
| SEC-001 | Critical vulnerability count | Confirmed critical exploitable findings under approved severity method | Security testing | 0 open critical at release; OWASP 2025 baseline [O01] | Patch, mitigate, retest and monitor |
| SEC-002 | Backup restore success | Successful verified restoration / scheduled restoration tests | Operations evidence | 100% scheduled restore tests | Fix backup, runbook and recovery architecture |
| OPS-001 | Evidence completeness | Closed items with required implementation/retest artifacts / closed items | Evidence ledger | 100% P0/P1; threshold for others | Reopen until definition of done is met |
| OPS-002 | Change failure rate | Deployments causing rollback, incident or material regression / deployments | Deployment/incident logs | OWN DevOps baseline; trend down | Add automated controls and smaller releases |

## 4. Tool stack by stage

| Stage | Primary | Secondary | Mandatory reports | Decision | Limit |
|---|---|---|---|---|---|
| Commercial truth | CRM + finance/backend | Shopify/ERP/CDP | Orders, lead stages, wins/losses, refunds, margin, cohorts | Revenue and contribution truth | Definitions and attribution must be governed |
| Google organic | Google Search Console | BigQuery/API extraction | Performance by query/page/country/device/appearance; Page Indexing; Sitemaps; Crawl Stats; CWV; Links; enhancements; AI reports where available | Google visibility, indexing and migration monitoring | API limits and some UI-only data; reports can lag |
| Analytics and tags | GA4 + GTM | Server-side GTM/warehouse | Landing pages, acquisition, funnels, ecommerce, events, attribution, geography; container/version/consent audit | Behaviour and attributed conversion | Consent, blockers and modelling create gaps |
| Technical crawling | Screaming Frog SEO Spider | Sitebulb/Lumar/Oncrawl/JetOctopus | HTML crawl; JS crawl; sitemap crawl; list-mode historical URLs; crawl comparison; canonicals; directives; links; schema; hreflang; images | URL-level technical diagnosis and regression | Crawler view depends on configuration and access |
| Automated SEO data | DataForSEO APIs | Custom crawler/data warehouse | On-Page, SERP, Labs, backlinks, business/maps, merchant/shopping, Lighthouse | Agent-agnostic data acquisition at scale | Paid estimates; validate critical findings with first party/live checks |
| SEO/competitor suite | Semrush | Ahrefs + Similarweb | Site Audit; Organic Research; Position Tracking; Keyword Gap; Backlink Analytics/Audit; Advertising; AI visibility; Market/Traffic | Integrated SEO, paid and competitor trend analysis | Estimated traffic/volume/authority are not business truth |
| Market/channel intelligence | Similarweb | Semrush Traffic Analytics | Traffic/channel/device/geography/referrals/search/social/AI estimates; competitor set | Relative digital market/channel share | Modelled estimates; small sites can be noisy |
| Performance field | CrUX/PSI + RUM | Shopify Web Performance; SpeedCurve/New Relic | LCP/INP/CLS P75 by URL/origin, device, geography; trends | Real user performance and regressions | CrUX requires sufficient eligible traffic |
| Performance diagnosis | WebPageTest or GTmetrix | Chrome DevTools/Lighthouse CI | Waterfall, filmstrip/video, CPU/main thread, request chain, page weight, third parties, lab CWV | Root cause and performance budgets | Synthetic runs vary; control location/device/connection |
| Behaviour/UX | Microsoft Clarity | Hotjar/FullStory | Heatmaps, scroll, rage/dead clicks, recordings, errors, funnel/form segments | Behavioral hypotheses and bug discovery | Not causal; privacy masking and consent required |
| Usability research | Moderated/unmoderated testing | UserTesting/Maze/Lookback | Task success, time, errors, comprehension, SUS/qualitative findings | User task evidence and problem discovery | Sample and task design determine validity |
| Accessibility | axe-core + manual WCAG protocol | Accessibility Insights/WAVE/Deque | Automated violations; keyboard; screen reader; focus; zoom; contrast; forms; components | WCAG defect prevention and release gate | Automated coverage is partial |
| Visual/functional QA | Playwright | Cypress/BrowserStack | Critical journeys, visual snapshots, forms/payments, redirects, locale/currency, screenshots/traces | Proof that release works and did not visually regress | Golden baselines need controlled environment/review |
| Security | OWASP ZAP + dependency scanner | Commercial DAST/SAST/pen test | OWASP categories, headers, TLS, dependencies, auth/access, secrets, logging, restore | Risk detection and release gate | Automated scan does not replace expert testing |
| Commerce feeds | Google Merchant Center + Shopify | Feed management platform/DataForSEO Merchant | Diagnostics, item issues, price/availability/shipping/returns, free listings, feed/landing consistency | Shopping eligibility and product visibility | Platform policy and feed latency |
| Local | Google Business Profile + local rank tool | BrightLocal/Whitespark/DataForSEO Business | Profiles, categories, reviews, calls/directions/bookings, grid rankings, citations | Location visibility and reputation | Proximity and personalization limit rank reproducibility |
| Paid competitor creative | Google Ads Transparency Center + Meta Ad Library | TikTok Creative Center/Semrush Advertising | Active ads, creative, offer, destination, dates/markets; own impression share and landing experience | Creative/offer monitoring and paid gaps | Libraries do not expose full spend, targeting or performance |
| Evidence/versioning | GitHub + immutable object storage | GitLab/Bitbucket + S3 Object Lock/Drive Vault | Commits, PRs, required checks, artifacts, manifests, hashes, approvals, PDFs/CSV/JSON | Proof, rollback and audit trail | Permissions/retention must be configured |

## 5. Benchmark register

| ID | Metric | Rule/value | Applicability | Class | Caveat |
|---|---|---|---|---|---|
| BMK-001 | LCP P75 | Good <=2.5s; needs improvement >2.5-4s; poor >4s | URL/origin field data; mobile and desktop separately | HARD | Use field/RUM or CrUX; lab only diagnoses |
| BMK-002 | INP P75 | Good <=200ms; needs improvement >200-500ms; poor >500ms | URL/origin field data; mobile and desktop separately | HARD | TBT is not field INP |
| BMK-003 | CLS P75 | Good <=0.1; needs improvement >0.1-0.25; poor >0.25 | URL/origin field data; mobile and desktop separately | HARD | Measure P75 over field window |
| BMK-004 | Conformance target | WCAG 2.2 AA unless stricter contractual/legal requirement | Applicable pages/components and technologies | HARD | Automated tests cannot establish full conformance |
| BMK-005 | Release gate | 0 open confirmed critical vulnerabilities; high-risk exceptions require formal approval | Defined environment and severity model | HARD | Security standard is risk baseline, not penetration test replacement |
| BMK-006 | Critical conversion path | 100% pass for production release test; 0 unowned P0 failures | Target device/market/payment/form variants | HARD | Use real end-to-end evidence |
| BMK-007 | Sitemap hygiene | 100% intended canonical indexable 200 URLs; 0 unintended redirects/noindex/4xx/5xx | Each submitted XML sitemap | HARD | Sitemap inclusion does not guarantee indexing |
| BMK-008 | Redirect control | One hop where controllable; no loops; closest intent match | All historical valuable URLs and internal links | HARD | External legacy chains may need documented exceptions |
| BMK-009 | Median CVR context | 6.6% median across industries in Q4 2024 sample | 41k pages, 464m visits, 57m conversions; conversion definitions vary | INDUSTRY | Do not use as universal target; segment by industry/offer/source |
| BMK-010 | Cart abandonment context | Approximately 70% broad research average | Multiple studies aggregated; funnel definitions vary | INDUSTRY | Not a target and not equivalent to checkout abandonment |
| BMK-011 | Product page maturity | 62% of mobile sites rated mediocre or worse in Baymard 2026 benchmark | Leading US/EU ecommerce sites; manually rated criteria | INDUSTRY | Use criteria/failure modes, not as direct CVR benchmark |
| BMK-012 | Google report availability | 2026 generative reports rolled to a subset of properties initially | Search Console property availability | PLATFORM | Mark not available rather than fabricate data |
| BMK-013 | AI traffic risk context | A 2026 preprint estimated ~15% Wikipedia traffic decline from AIO exposure for matched articles | English Wikipedia; informational content; specific study design | ACADEMIC | Do not generalize to commerce/lead-gen without evidence |

## 6. Gap calculation

For higher-is-better metrics:

`Gap to target = target - current`  
`Relative gap = (target - current) / target`

For lower-is-better metrics:

`Gap to target = current - target`

For competitor percentiles, store the competitor set, values, median, upper quartile, leader, collection date, market and method. Do not compare values created by different tools without normalization.

## 7. Diagnostic rule

A metric crossing a threshold creates an investigation, not an automatic solution. The issue record must connect:

`observation -> affected segment -> corroborating evidence -> likely mechanism -> proposed intervention -> acceptance test -> commercial guardrail`

The complete row-level definitions, required dimensions, red flags, diagnosis, recommended actions and prohibited shortcuts are in `07_TEMPLATES/METRIC_DICTIONARY.csv`.
