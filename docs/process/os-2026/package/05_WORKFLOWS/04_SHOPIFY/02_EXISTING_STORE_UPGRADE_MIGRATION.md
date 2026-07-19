# Shopify - Existing Shopify Store Upgrade or Migration Workflow

**Version:** 1.0  
**Issued:** 2026-07-19  
**Workflow ID:** SHOPIFY-EXISTING_STORE

## Use this workflow when

Use for a live Shopify store being redesigned, re-themed, restructured, moved between stores/domains or materially reconfigured.

## Commercial objective

Operate a technically controlled, internationally correct and commercially optimised Shopify store without losing URL, product, customer, feed or tracking equity.

**Primary audiences:** direct customers across configured Shopify Markets, languages, currencies and fulfilment regions.  
**Primary conversions:** Shopify order/subscription, product discovery, cart/checkout progression, repeat order and profitable market expansion.

## Mandatory inherited standards

This workflow must be used with:

- `../00_SHARED_STANDARDS/00_MASTER_OPERATING_SYSTEM.md`
- `../00_SHARED_STANDARDS/01_TOOL_AND_REPORT_REGISTER.md`
- `../00_SHARED_STANDARDS/02_REGIONAL_DOMAIN_LOCATION_FRAMEWORK.md`
- `../00_SHARED_STANDARDS/03_URL_SITEMAP_MIGRATION_STANDARD.md`
- `../00_SHARED_STANDARDS/04_MEASUREMENT_ATTRIBUTION_STANDARD.md`
- `../00_SHARED_STANDARDS/05_QA_LAUNCH_MONITORING_LOOP.md`
- `../00_SHARED_STANDARDS/06_2026_STANDARDS.md`

## Phase 0 - Classification, authority and readiness

- [ ] Assign project ID, accountable owner, workflow file, approvers and evidence folder.
- [ ] Classify business model, asset type, new/existing status and project risk.
- [ ] Record production, staging, legacy and campaign domains/subdomains/subfolders.
- [ ] Record target regions, languages, currencies, locations, legal entities, fulfilment and traffic-source routing.
- [ ] Define primary commercial outcome, qualified conversion, secondary conversions and guardrails.
- [ ] Record budget, release date, dependencies, blackout periods and rollback authority.
- [ ] Confirm access to all first-party systems and identify missing data before recommendations.

**Gate 0 evidence:** approved Project Charter, access register, market/domain map, commercial outcome definition and project risk classification.

## Phase 1 - Discovery and protected baseline

- [ ] Freeze dated raw exports from GSC, GA4, GTM, CRM/backend, paid media, crawlers, backlinks, server logs and performance tools.
- [ ] Build the master URL inventory from every discovery source; do not rely on the current navigation or sitemap alone.
- [ ] Audit current XML sitemap index and child sitemaps and create the current visual architecture.
- [ ] Classify every URL: protect, refresh, consolidate, redirect, archive/noindex or retire.
- [ ] Identify pages with rankings, conversions, backlinks, paid traffic, referral traffic or offline references that must be protected.
- [ ] Capture screenshots, copy, metadata, schema, internal links and conversion components for protected pages.
- [ ] Record current analytics/tag behaviour, CRM routing, forms, payments, feeds and response times.
- [ ] Set pre-change KPI baselines and launch guardrail thresholds using comparable periods.
- [ ] Theme/Liquid architecture
- [ ] Shopify Markets/domains/languages
- [ ] Products/variants/collections/metafields
- [ ] Apps, checkout, payments, shipping, taxes and notifications
- [ ] Redirects, sitemap, analytics, pixels and feeds
- [ ] Merchant identity and policies
- [ ] Accurate product/variant/inventory data
- [ ] Shipping, duties, taxes, returns and delivery by market
- [ ] Reviews and product proof
- [ ] Payment security, support and order status
- [ ] Products, collections, pages and blogs
- [ ] Search/filter/merchandising content
- [ ] Market-language localisation
- [ ] Identify what is already working and explicitly mark protected URLs, copy, layouts, CTAs, proof, forms, links and tracking.
- [ ] Record current defects separately from redesign preferences.
- [ ] Interview operators/sales/support to identify hidden dependencies and offline uses of URLs.
- [ ] Export products, variants, collections, pages, blogs, menus, redirects, themes, apps, customers/orders as permitted, markets, domains, languages, policies, metafields and feeds.
- [ ] Audit platform URL constraints, automatic canonicals/sitemaps, tag/filter/search URLs, collection-product paths and app proxy URLs.
- [ ] Create an app register with business value, cost, scripts, data, schema, theme changes and uninstall residue.

### Shopify-specific trust controls

- [ ] Merchant identity and policies
- [ ] Accurate product/variant/inventory data
- [ ] Shipping, duties, taxes, returns and delivery by market
- [ ] Reviews and product proof
- [ ] Payment security, support and order status

### Shopify-specific content controls

- [ ] Products, collections, pages and blogs
- [ ] Search/filter/merchandising content
- [ ] Market-language localisation
- [ ] Product schema/feed content
- [ ] Post-purchase and retention

**Gate 1 evidence:** baseline/research pack, risks, protected assets or assumptions, current-state findings and KPI/guardrail sheet.

## Phase 2 - Site strategy, architecture and specification

- [ ] Approve business requirements, audience, message, offer, differentiation and success measures.
- [ ] Approve information architecture, proposed sitemap, URL naming rules, navigation, search/filter and internal-linking model.
- [ ] Map one primary search intent and one primary conversion objective to each important page.
- [ ] Create page briefs covering protected content, proof, CTA, schema, media, localisation, analytics and owner.
- [ ] Define responsive design system, accessibility requirements, content components and all loading/error/empty/success states.
- [ ] Define performance budgets by template and third-party script/app governance.
- [ ] Define privacy, consent, security, backup, access and incident-response requirements.
- [ ] Create implementation backlog with issue IDs, priority, owner, dependencies and acceptance criteria.
- [ ] Create the full page/template inventory and define which pages are launch-critical versus phased.
- [ ] Map navigation and internal links to customer journeys, search demand and commercial priority.
- [ ] Define site search/filter, location/market and utility-page requirements.
- [ ] Define design components as reusable governed templates rather than one-off pages.
- [ ] Prepare a preservation specification and change-impact register for every protected asset.
- [ ] Avoid simultaneous changes to URL, intent, content, layout, offer and tracking unless necessary and approved.
- [ ] Map product/variant/collection, bundle, subscription, upsell and lifecycle journeys with margin guardrails.
- [ ] Approve Shopify Markets architecture: primary domain, dedicated domains/subdomains/subfolders, languages, currencies, products, pricing and fulfilment.
- [ ] Define theme/Liquid/component and metafield/metaobject architecture before page-builder proliferation.
- [ ] Define native versus app responsibility for reviews, bundles, subscriptions, search, filters, localisation, feeds and pixels.

**Gate 2 evidence:** approved strategy/solution blueprint, page or topic ownership, domain/region decisions, measurement plan and implementation backlog.

## Phase 3 - Design, content, development and integration

- [ ] Build only on controlled staging with production indexing blocked and access restricted.
- [ ] Implement semantic HTML, crawlable links, correct status codes, canonicals, directives, schema and responsive media.
- [ ] Implement navigation, breadcrumbs, contextual internal links and required cross-market selectors.
- [ ] Implement analytics events, consent, CRM/backend integrations and QA logging.
- [ ] Implement performance budgets, image/font strategy, caching, CDN and third-party controls.
- [ ] Implement accessible keyboard/focus/form/modal/error behaviour and content hierarchy.
- [ ] Maintain release notes and map every change to a requirement or issue ID.
- [ ] Build all priority templates with real content early enough to expose layout and performance problems.
- [ ] Implement global header/footer/navigation, search/filter and market/location behaviour consistently.
- [ ] Create custom 404, search-zero-result, loading, error, success and unavailable states.
- [ ] Maintain an old-versus-new comparison and preserve the existing production asset until the new version passes.
- [ ] Synchronise catalogue, item IDs, inventory, price, currency, shipping, returns, feed and structured data.
- [ ] Build a duplicate theme and controlled market configuration; do not edit the live theme directly for a major release.
- [ ] Implement and test Shopify customer events/pixels, GA4, consent and channel integrations without duplication.
- [ ] Import/test URL redirects and update navigation/content links to final handles.

**Gate 3 evidence:** build/publishing complete on controlled environment, release notes, owner checks and no unexplained scope gaps.

## Phase 4 - Pre-launch or pre-release QA

- [ ] Run HTML crawl, JavaScript crawl, XML sitemap crawl and all-known-URL list crawl.
- [ ] Compare staging with approved page inventory and, for existing assets, with the production baseline.
- [ ] Validate robots.txt, meta robots, X-Robots-Tag, canonicals, status codes, hreflang, sitemaps and structured data.
- [ ] Test every primary user task on target devices, browsers, languages, currencies and network conditions.
- [ ] Test forms, calls, WhatsApp, booking, CRM, search, account, cart, checkout, payments, email and error recovery as applicable.
- [ ] Validate GA4/GTM/pixels, consent, attribution, ecommerce values and backend reconciliation.
- [ ] Run field/lab performance, accessibility, security, privacy and visual regression tests.
- [ ] Complete migration rehearsal, redirect tests, DNS/SSL/CDN plan, backup and rollback rehearsal where applicable.
- [ ] Obtain signed Launch Readiness certificate; unresolved P0 issues stop launch.
- [ ] Sample and test every template, not only the homepage.
- [ ] Verify all navigation, breadcrumb, footer and contextual-link destinations.
- [ ] Run regression checks against the protected baseline and resolve every unexplained loss.
- [ ] Test cart, discounts, tax, shipping, payment failure, confirmation, refund and market-specific checkout paths.
- [ ] Validate Shopify-generated sitemap child files, canonicals, hreflang/Markets behaviour and robots controls.
- [ ] Use Shopify Web Performance and external tools to identify theme/app regressions by page URL/template.
- [ ] Test notification emails, inventory, fulfilment, taxes/duties, refunds, gift cards, discounts and customer accounts.

**Gate 4 evidence:** completed test cases, crawl/report exports, fixed/retested P0-P1 issues, signed Launch Readiness certificate.

## Phase 5 - Launch or controlled release

- [ ] Open the launch command centre and record exact release time/version and responsible participants.
- [ ] Deploy using the approved sequence; preserve a rollback path.
- [ ] Validate availability, SSL, robots/noindex, canonicals, priority URLs, redirects, sitemap and analytics immediately.
- [ ] Complete a real primary conversion and verify it in frontend, backend/CRM, analytics and notifications.
- [ ] Check target markets, languages, currencies, locations, inventory/service availability and traffic-source destinations.
- [ ] Submit/update Search Console sitemaps and relevant platform/feed destinations; do not treat submission as guaranteed indexing.
- [ ] Record incidents, owner, resolution and retest evidence.
- [ ] Release with redirect/change map, control metrics and rollback triggers active.
- [ ] Publish the approved theme/configuration and verify domain/Markets routing, feeds and checkout immediately.

**Gate 5 evidence:** live validation record, completed real conversion, incident log, sitemap/feed/ads checks and acceptance or rollback decision.

## Phase 6 - Post-launch stabilisation

- [ ] Within 24 hours, run a full production crawl and compare against the final staging/production baseline.
- [ ] Inspect priority URLs, redirect sources, sitemap processing, 404/5xx, canonicals, schema and rendering.
- [ ] Monitor transactions/forms, qualified conversions, revenue, paid destinations, feeds and customer-support incidents.
- [ ] Monitor organic clicks/impressions, rankings, indexed priority pages, crawl activity and backlink destinations.
- [ ] Compare performance and conversion by template, device, region, language, source and location.
- [ ] Fix P0/P1 regressions immediately; record root cause and preventive control.
- [ ] Complete stabilisation review and obtain approval before closing the launch project.
- [ ] Compare new performance with both recent and seasonal baselines; investigate losses by page/segment.
- [ ] Reconcile orders, revenue, discounts, tax, shipping and refunds between platform, analytics and finance.

**Stabilisation exit:** critical paths are stable, P0/P1 regressions are closed or accepted, and performance is understood against the correct baseline.

## Phase 7 - Monitoring cadence

- [ ] Daily during stabilisation: uptime, errors, transactions/forms, feeds, ads destinations and critical SEO directives.
- [ ] Weekly for 8-12 weeks: GSC, rankings, indexation, conversions, qualified lead/order quality, CWV, redirects and lost links.
- [ ] Monthly: executive KPI scorecard, technical recrawl, content/landing-page performance, regional/local/merchant health and backlog.
- [ ] Quarterly: full technical, content, UX/CRO, accessibility, security, competitor and architecture review.
- [ ] Maintain content-decay, broken-link, redirect, app/script, privacy and platform-change alerts.
- [ ] Review Shopify Analytics, Web Performance, search terms/zero results, app/theme changes and market reports monthly.

## Phase 8 - Continuous improvement loop

- [ ] Collect evidence from users, sales/support, commercial systems, search, crawls and competitors.
- [ ] Diagnose the constraint and affected segment; do not jump from a metric to a cosmetic solution.
- [ ] Prioritise by business impact, reach, confidence, risk and effort.
- [ ] Write a hypothesis, acceptance criteria, primary metric, guardrails, owner and rollback.
- [ ] Implement one controlled change or a clearly documented batch.
- [ ] QA the implementation and data before evaluating performance.
- [ ] Adopt, iterate, revert or retire based on evidence; record the learning.

## Mandatory tools and reports

- [ ] Google Search Console
- [ ] GA4 and Google Tag Manager
- [ ] CRM/backend commercial data
- [ ] Screaming Frog HTML and JavaScript crawls
- [ ] Semrush Site Audit and visibility reports
- [ ] DataForSEO APIs where automation/scale is required
- [ ] Ahrefs or equivalent backlink verification
- [ ] PageSpeed Insights/CrUX plus GTmetrix or WebPageTest
- [ ] Clarity/Hotjar for behavioural evidence
- [ ] Accessibility, browser/device, security and uptime tools
- [ ] Shopify Analytics
- [ ] Shopify Web Performance
- [ ] Shopify Markets
- [ ] Search & Discovery
- [ ] Merchant Center
- [ ] theme/app profiling

Use the shared Tool and Report Register for exact exports, configuration and cadence. Add tools only when they have a defined decision or operational use.

## Required deliverables

- [ ] Project Charter and classification record
- [ ] Market/domain/location matrix
- [ ] Baseline or research pack
- [ ] KPI baseline, target and guardrail sheet
- [ ] Page/query/audience map appropriate to the workflow
- [ ] Issue register and prioritised backlog
- [ ] Analytics/event/attribution specification
- [ ] QA evidence and signed gate records
- [ ] Launch/post-launch report
- [ ] Monitoring dashboard and continuous-improvement backlog
- [ ] Master URL inventory
- [ ] Current sitemap/architecture audit
- [ ] Preservation register
- [ ] Redirect/change map where URLs change
- [ ] Proposed business sitemap
- [ ] Proposed XML sitemap specification
- [ ] Content/template inventory

## KPI and guardrail scorecard

- [ ] Shopify conversion funnel
- [ ] net sales and margin
- [ ] average order value
- [ ] checkout completion
- [ ] refund/return
- [ ] repeat customer rate
- [ ] market/product/collection profitability
- [ ] app cost and performance impact
- [ ] organic clicks/impressions and priority rankings where applicable
- [ ] indexation and crawl health
- [ ] Core Web Vitals by important template
- [ ] technical error and redirect rate
- [ ] accessibility/security/privacy closure

Segment results by market, domain/subfolder, language, location, device, source/campaign and page/product/service type as relevant.

## Roles and sign-off

| Role | Minimum responsibility |
|---|---|
| Accountable business owner | Commercial outcome, scope, priority, budget and acceptance |
| Project/product owner | Requirements, dependencies, backlog, gates and evidence |
| SEO/content | Search demand, architecture, URLs, sitemaps, content, links and monitoring |
| Design/UX/CRO | User journeys, hierarchy, accessibility, states and experiment quality |
| Development/DevOps | Implementation, performance, security, deployment and rollback |
| Analytics/data | Tracking, attribution, reconciliation, dashboards and alerts |
| CRM/sales/ecommerce operations | Routing, fulfilment, lead/order quality and revenue truth |
| Market/legal/privacy owner | Localisation, claims, policy, consent and market approval |
| QA | Independent test execution, evidence and retest |

## Do not launch or close the release if

- [ ] Primary conversion, CRM/order or payment path fails.
- [ ] Production indexability, canonicals, sitemap or priority redirects are wrong.
- [ ] Analytics cannot measure the primary outcome or duplicates material events.
- [ ] A target market receives the wrong language, currency, product/service availability, price, shipping or contact route.
- [ ] A critical security, privacy, accessibility or legal issue remains.
- [ ] Protected high-value content, links, URLs or proof were removed without approved evidence.
- [ ] Rollback, owners or command-centre coverage are unavailable for a material release.

## AI-agent execution rules

1. Select the correct workflow before taking action.
2. Never infer that an existing URL/page has no value without checking all discovery and commercial sources.
3. Label every finding as observed fact, calculated result, tool estimate, user-provided assumption or recommendation.
4. Attach evidence and affected URLs to every issue.
5. Do not close an issue without retest evidence.
6. Escalate conflicts between commercial truth and third-party SEO scores; do not optimise for the score.
7. Preserve immutable pre-change exports and screenshots.
8. Stop at phase gates requiring accountable approval; do not silently bypass them.
9. Add new learnings to the shared standard and relevant workflow rather than keeping them only in chat.


# Version 2 Agency-OS Overlay

This workflow inherits the Master Agency OS, Competitive Intelligence Playbook, Metric Dictionary, Evidence/Agent Standard, Localization Manual and Monitoring Manual. The original checklist remains valid; this overlay adds the controls required to make findings reproducible, competitive and commercially actionable.

## Phase control and proof matrix

| Phase | Required work | Evidence | Do not proceed when |
|---|---|---|---|
| 0 | Define market denominator, competitor types, workflow, authorized tools, economics, evidence access and prohibited actions. | Charter; competitor roster; market/domain matrix; access/risk register | No owner, unclear denominator, missing commercial source or unauthorized scope |
| 1 | Collect raw commercial, search, crawl, URL, sitemap, content, link, UX, performance, tracking and competitor evidence. Preserve immutable baseline. | Artifact manifests; URL inventory; current sitemap; metric baseline; competitor evidence matrix | Incomplete URL discovery; baseline overwritten; estimates presented as truth |
| 2 | Quantify gaps and constraints. Separate parity blockers from differentiation opportunities. Model downside/base/upside contribution. | Issue register; peer percentiles; opportunity backlog; preservation and exclusion registers | Recommendation has no metric, cause, economics, acceptance criteria or evidence |
| 3 | Specify future architecture, pages, content, offers, internal links, schema, analytics, localization, performance and tests. | Approved sitemap; page briefs; solution specs; measurement plan; RACI | Design changes without a purpose or protected-elements list |
| 4 | Implement in controlled environment with versioned changes, issue IDs, automated tests and human QA. | Commits/revisions; release notes; staging evidence; updated manifests | Production-only edits, untraceable app/plugin/config changes |
| 5 | Run crawl comparisons, migration rehearsal, critical journeys, accessibility/security/performance, market/language and tracking tests. | Launch readiness certificate; automated/manual evidence; rollback rehearsal | Open P0; unaccepted P1; broken conversion/redirect/tracking/backup |
| 6 | Release through command centre; validate live directives, URLs, sitemap/feed/ads and a real conversion in each critical path/market. | Deployment log; live test; incidents; go/rollback decision | Guardrail breach or inability to verify live commercial path |
| 7 | Compare 24h/72h/7d/28d results with pre-release and seasonal baselines; verify issue closures. | Stabilization reports; root cause; live evidence; accepted residual risks | Unexplained material revenue, conversion, indexation or ranking loss |
| 8 | Monitor competitors, customers, market share proxies and technical/commercial health; test next constraint. | Scorecards; experiments; research updates; decision/exclusion changes | Vanity reporting, no owner, repeated recommendations with no learning |

## Exact finding format

Every finding must contain:

1. issue ID, phase and severity;
2. exact metric/formula and affected dimensions;
3. current value, period and source of truth;
4. comparable own baseline, competitor peer values/percentiles and applicable external benchmark;
5. absolute/relative gap and confidence;
6. affected URLs, products, locations, campaigns or cohorts;
7. likely mechanism supported by corroborating evidence;
8. exact recommendation, owner and dependency;
9. acceptance criteria and automated/manual test;
10. business guardrail, monitoring window and rollback condition;
11. what must not be done;
12. excluded alternatives and why.

## Competitor and market-share requirements

- Build direct, SERP, paid, marketplace, local, publisher, substitute, AI-answer and aspirational competitor sets separately.
- Record current and peer median/upper-quartile/leader values using identical market, device, language and period.
- Identify defend, mandatory parity, flank, attack, category-creation, partner and deliberate-ignore opportunities.
- Quantify addressable demand, attainable share, qualified conversion, contribution and confidence.
- Archive competitor pages, ads, offers, reviews and SERPs with date, region and source; do not infer spend or performance from an ad library.
- Re-run the priority competitor panel monthly and the complete market map quarterly.

## Evidence and completion requirements

- Archive raw PDF where useful plus CSV/JSON/crawl/log and configuration.
- Generate SHA-256 manifest and never overwrite baseline evidence.
- Link each closed issue to implementation reference, staging proof, live proof and monitored result.
- Record included, deferred, not applicable, rejected, unknown and accepted-risk decisions.
- P0/P1 closure and launch gates require independent human review.

## Shopify-specific competitive edge controls

- [ ] Capture and test theme/app/script governance.
- [ ] Capture and test products/variants/collections/tags.
- [ ] Capture and test Shopify Markets, languages and currencies.
- [ ] Capture and test feeds, inventory, checkout and redirects.
- [ ] Capture and test Shopify web performance and search analytics.

### Market-share attack patterns

- use catalog/feed/search/merchandising advantages
- remove app and theme friction with measured impact
- increase profitable CVR, AOV and repeat purchase by market

## Required metric panel

| ID | Metric | Source | Target method | Red flag | Improvement path |
|---|---|---|---|---|---|
| COM-001 | Revenue | Finance/backend | OWN seasonal baseline + ECONOMIC plan | Material decline outside seasonality or tracking mismatch | Repair measurement; recover funnel; improve qualified demand, offer, CVR, AOV or retention |
| COM-002 | Contribution margin | Finance | ECONOMIC target by business model | Revenue grows while contribution falls | Prioritize profitable products/segments and improve price/operations |
| COM-003 | Revenue per session | Backend + analytics joined | OWN baseline, peer/context only | Traffic rises while RPS falls materially | Improve intent match, funnel and merchandising |
| COM-007 | LTV | Finance/CRM | OWN cohorts; model assumptions documented | LTV:CAC below approved threshold or cohort deterioration | Lifecycle, service, subscription/reorder, cross-sell, referral |
| SEO-006 | Indexable URL count | Screaming Frog + specification | Equals approved inventory within explained variance | Unplanned growth/decline or noncanonical URLs indexable | Correct templates, parameters, sitemaps and internal links |
| TEC-004 | LCP P75 | CrUX/RUM | Good <=2.5s; needs improvement 2.5-4s; poor >4s [G12] | Priority template poor or regression | Optimize server, LCP resource discovery/size/priority and rendering |
| TEC-005 | INP P75 | CrUX/RUM | Good <=200ms; needs improvement 200-500ms; poor >500ms [G12] | Priority template poor or long interaction tails | Reduce main-thread work, split tasks, optimize interactions |
| CRO-005 | Add-to-cart rate | Shopify/backend + analytics | OWN cohort and product-type peer context | High PDP traffic with low add or high add with low checkout | Improve PDP, offer, merchandising and inventory |
| CRO-006 | Checkout completion | Shopify/backend | OWN baseline; peer research context | Drop by step/payment/market | Fix checkout friction, costs and payment reliability |
| CRO-008 | Return/refund rate | ERP/Shopify/finance | OWN product economics | CVR rises with returns/complaints | Improve content/product/fulfilment and suppress bad acquisition |

## Required tool/report runs

- [ ] Run and archive the exact first-party, crawl, competitor, performance, behavioural and commercial reports specified in TOOL_STACK_REGISTER.csv.
- [ ] Record tool/version/configuration, market/device/date and known gaps.
- [ ] For existing assets, run old-versus-new URL/crawl/page/report comparisons.
- [ ] For new assets, create research baselines and explicit assumptions rather than inventing historical performance.

## Mandatory do-not-do register

- [ ] Do not redesign for visual novelty without a measurable user, brand, search or commercial purpose.
- [ ] Do not delete or redirect an existing page without the master URL and preservation checks.
- [ ] Do not apply a benchmark whose definition or segment is not comparable.
- [ ] Do not copy competitor content, claims, creative or dark patterns.
- [ ] Do not close work before live evidence and monitoring.
- [ ] Do not leave ignored recommendations unexplained; use the Decision/Exclusion Register.
