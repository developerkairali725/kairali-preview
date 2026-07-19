# QA, Launch and Monitoring Loop

**Version:** 1.0  
**Issued:** 2026-07-19  
**Scope:** This standard governs pre-launch QA, automated release checks, migration rehearsal, P0/P1 gating, human approval, launch command-centre execution, 24h/72h/7d/28d stabilization and the ongoing monitoring and continuous-improvement cadence.  
**Referenced by:** `B2C-NEW-WEBSITE`, `B2C-EXISTING-WEBSITE`, `B2C-NEW-ORGANIC`, `B2C-EXISTING-ORGANIC`, `B2C-NEW-LANDING`, `B2C-EXISTING-LANDING`; `B2B-NEW-WEBSITE`, `B2B-EXISTING-WEBSITE`, `B2B-NEW-ORGANIC`, `B2B-EXISTING-ORGANIC`, `B2B-NEW-LANDING`, `B2B-EXISTING-LANDING`; `D2C-NEW-WEBSITE`, `D2C-EXISTING-WEBSITE`, `D2C-NEW-ORGANIC`, `D2C-EXISTING-ORGANIC`, `D2C-NEW-LANDING`, `D2C-EXISTING-LANDING`; `SHOPIFY-NEW-STORE`, `SHOPIFY-EXISTING-STORE`, `SHOPIFY-NEW-ORGANIC`, `SHOPIFY-EXISTING-ORGANIC`, `SHOPIFY-NEW-LANDING`, `SHOPIFY-EXISTING-LANDING`, and the corresponding manual-embedded workflows.

> **Precedence note:** Where older workflow text uses different post-launch windows, the Master OS core windows—24h, 72h, 7d and 28d—control.

## 1. QA layers

| Layer | Examples | Required evidence |
|---|---|---|
| Content | Completeness, factual accuracy, localization, claims, links, spelling, protected content | Approved page inventory, claims/evidence register and screenshots |
| Design/UX | Responsive layouts, hierarchy, states, navigation, search, forms, accessibility | Device/browser and task-test record |
| Technical SEO | Status, robots, canonical, hreflang, sitemap, rendering, internal links, schema | HTML/JS crawls and validators |
| Performance | CWV, waterfall, TTFB, third parties, page weight | PSI/CrUX/RUM and controlled lab evidence |
| Functional | Forms, CRM, calls, WhatsApp, account, cart, payment, email, search | Test cases, logs and backend proof |
| Analytics | Tags, events, values, attribution, consent and reconciliation | Debug evidence and backend comparison |
| Security/privacy | SSL, headers, dependencies, access, backups, consent and data handling | Scan, review and approval |
| Migration | URL inventory, redirect map, crawl comparison and rollback | Rehearsal results and launch certificate |

## 2. Thirteen automated release checks

Where technically possible, require exactly these checks:

1. Build, unit and integration tests.
2. Playwright critical journeys and traces.
3. Visual snapshot comparison under a controlled environment.
4. Redirect-map tests and no-loop checks.
5. Internal broken-link scan.
6. Robots, `noindex`, canonical, hreflang and schema tests.
7. Analytics event and ecommerce payload tests.
8. axe-core accessibility scan plus manual critical-journey checks.
9. Lighthouse CI and performance budgets.
10. Security and dependency scans.
11. Sitemap validation.
12. Market, language, currency and inventory tests.
13. Backup and rollback verification.

Protect the release branch and require reviews/checks. Automated passes do not replace necessary human, assistive-technology, legal, clinical or security review.

## 3. Severity and release gating

### P0 — critical

Examples:

- production unavailable or critical conversion fails twice from independent checks;
- payment/form/booking success drops to zero or backend delivery fails;
- production homepage or major template becomes `noindex`, blocked or canonically points elsewhere;
- widespread 5xx or DNS/SSL failure;
- material revenue or qualified-lead collapse after release beyond approved guardrail;
- critical security finding or data exposure;
- wrong-market pricing, claims or availability with material customer impact.

**Gate:** no launch or continued rollout with open P0. Roll back or stop. No AI may accept P0 risk.

### P1 — major release blocker

Examples:

- priority pages lose indexation or redirects fail;
- significant GSC click/impression decline not explained by demand or seasonality;
- priority-template Core Web Vitals becomes poor;
- Merchant/product disapprovals spike;
- checkout/form abandonment or error rate rises materially;
- review sentiment or local visibility deteriorates in a priority location;
- competitor captures a strategically important demand cluster;
- analytics cannot measure the primary outcome or duplicates material events;
- protected high-value content, links, URLs or proof were removed without approved evidence.

**Gate:** unaccepted P1 blocks release. A P1 exception requires the accountable business owner, a human, to document consequence, mitigation, owner and expiry date.

## 4. Pre-launch certificate

The certificate records:

- project/workflow/release IDs;
- exact environment and artifact version;
- approved scope and protected elements;
- results of all applicable QA layers and 13 automated checks;
- URL/sitemap/redirect comparison;
- real critical conversion and backend reconciliation;
- market/language/currency tests;
- open P0/P1/P2/P3 issues;
- rollback trigger, method and authority;
- command-centre participants and coverage;
- human approvals.

Phase 5 cannot pass with open P0, unaccepted P1, failed conversion/tracking/redirect/security/backup/rollback test or no accountable owner.

## 5. Launch command centre

Required participants, as applicable:

- accountable business/project owner;
- developer/DevOps;
- SEO;
- analytics/data;
- content;
- design/UX/CRO;
- QA;
- CRM/sales operations;
- paid media;
- ecommerce/finance;
- legal/privacy/clinical;
- market owner.

Use the package launch checklist. Record exact timestamp, release version, deployment action, validation, incident, owner, fix, retest and go/rollback decision.

### Launch sequence

1. Confirm approved release, backups, rollback and people on duty.
2. Deploy through controlled process.
3. Verify availability, DNS/SSL and core assets.
4. Verify robots, `noindex`, canonical, hreflang and sitemap.
5. Test priority redirects and live crawl.
6. Complete a real or controlled primary conversion in every critical path/market.
7. Reconcile analytics with CRM/order/payment/backend.
8. Verify feeds, ads and campaign destinations.
9. Review P0/P1 guardrails.
10. Human accountable owner records continue, pause or rollback.

## 6. Stabilization windows

### 24 hours

- availability, DNS/SSL and severe errors;
- production directives, canonicals, hreflang and sitemap;
- priority redirects and 404/5xx;
- full production crawl and crawl comparison;
- primary conversion, CRM/order/payment delivery and analytics;
- critical feeds, ads and market routes;
- incident ownership and retests.

### 72 hours

- repeated synthetic journeys and backend success;
- redirect/canonical/indexability anomalies;
- initial crawl and index signals;
- conversion, revenue, lead/order quality and attribution;
- Merchant/feed and paid-destination issues;
- wrong-market/language/currency behaviour;
- unresolved P0/P1 root causes.

### 7 days

- GSC pages/queries and URL Inspection samples;
- priority indexation and ranking clusters;
- redirects, backlinks and broken legacy destinations;
- CWV and JavaScript errors;
- funnel, form/cart/checkout and lead/order quality;
- local/market anomalies;
- issue closure evidence and rollback decision if guardrails fail.

### 28 days

- compare post-release against pre-release and seasonally comparable baseline;
- revenue, contribution, qualified pipeline and conversion;
- organic clicks/impressions, indexation and ranking/page losses;
- CWV by valuable template;
- content decay, internal links and backlinks;
- regional, merchant, local and AI visibility where available;
- root-cause fixes, accepted residual risks and stabilization acceptance.

An unexplained material regression blocks stabilization acceptance.

## 7. Monitoring architecture

Five layers:

1. **Availability and revenue protection:** uptime, payment/form/booking, inventory/feed, DNS/SSL, errors and alerts.
2. **Search eligibility and migration protection:** robots, `noindex`, canonicals, redirects, sitemap, indexation, crawl and priority rankings.
3. **Experience and conversion:** CWV, JavaScript errors, task funnels, search, form/cart/checkout, accessibility and support incidents.
4. **Commercial quality:** qualified leads, wins, contribution, returns, repeat rate, CAC/payback and cohort LTV.
5. **Competitive position:** SOV, market/channel estimates, pricing/offers, reviews, links, content, paid creative, local and AI visibility.

## 8. Monitoring cadence

| Cadence | Controls | Audience | Output |
|---|---|---|---|
| Real-time/hourly | Uptime, critical synthetic journeys, payment/form failures, 5xx, feed disapprovals, severe security and deployment alerts | Operations/development | Incident or no-notification rule |
| Daily during launch | Revenue/conversions, tracking, redirects, 404/5xx, robots/canonical/sitemap, ad destinations, Merchant Center, critical markets | Launch command centre | Daily launch log and actions |
| Weekly for 8–12 weeks | GSC pages/queries, indexation, rank clusters, redirects, backlinks, CWV, funnel, lead/order quality, regional anomalies | Project team | Stabilization scorecard |
| Monthly | Executive commercial KPIs, recrawl, content decay, landing pages, local/merchant, AI/competitive SOV, tests and backlog | Leadership/channel owners | Monthly operating review |
| Quarterly | Full competitor map, technical/content/UX/accessibility/security audit, architecture, localization and tool health | Steering group | Quarterly growth plan |
| Annual/pre-rebuild | Complete baseline, market strategy, platform architecture, data governance and risk review | Executive sponsor | Approved annual roadmap/rebuild charter |

## 9. Alert design

Every alert records metric, scope, baseline method, threshold, minimum duration, owner, notification channel, diagnostic runbook and rollback authority. Use absolute and relative thresholds where appropriate. Suppress seasonality or planned campaign effects only through documented maintenance windows.

## 10. Continuous-improvement loop

1. Observe a metric, customer problem, competitor move or operational failure.
2. Validate the data and segment.
3. Diagnose the mechanism using multiple evidence sources.
4. Quantify commercial impact and confidence.
5. Prioritize with the opportunity score.
6. Define hypothesis, change, primary metric, guardrails and acceptance criteria.
7. Implement a controlled change.
8. QA tracking and user experience before interpreting results.
9. Adopt, iterate, revert or reject.
10. Store the evidence and update the decision/exclusion register.

Any standards amendment arising from a learning must be **proposed to the owner for approval**. The AI must not update this file autonomously.

## 11. Closure

A release closes only after live verification, required monitoring window, issue evidence, no unexplained regression and human approval. The proof state must reach:

`OPEN -> EVIDENCED -> APPROVED -> IMPLEMENTING -> STAGING_QA -> READY_FOR_RELEASE -> DEPLOYED -> LIVE_VERIFIED -> MONITORED -> CLOSED`

---

# Kairali adoption appendix (OS v2)

**Adopted:** 2026-07-19 14:09:19 IST per D-20260719-11/-12 (owner-delivered GPT standards zip).
**Source integrity:** everything above the horizontal rule is the owner's GPT-authored file, byte-verbatim (SHA-256 `aeaa851779baa22d372cbb16f3cc89c8ab6413620c1ff220deb2b28fb175e685`, zip manifest verified 7/7; immutable copy at docs/process/os-2026/source/00_SHARED_STANDARDS/05_QA_LAUNCH_MONITORING_LOOP.md).
**Supremacy:** Kairali v1 doctrine (CLAUDE.md, the merge plan's §2.6 strict union) is SUPREME over this file wherever they conflict (plan §0). The notes below subordinate specific passages; silence subordinates nothing — v1 always wins by default.
**Screen:** ingest screen per doctrine rule (r) + D-20260719-11 — 21-lens multi-agent screen + adversarial verify + completeness critic + first-party read; findings dispositioned in docs/reports/2026-07-19-standards-ingest-screen.md.

## Subordination notes (v1 supreme)

- **Registry supremacy:** gates/registry.yaml is the SINGLE source of truth for release checks (CM-109/CM-110 carried below). The 13 automated checks bind VIA registry rows — several exist today; the additions (redirect-map tests, axe-core, security scans, rollback verification…) land as M1 registry rows per plan §2.1 Phase 5. "Exactly these" reads as "at least these, through the registry"; the registry may exceed and is never weakened (rule g).
- **P1 exceptions / residual-risk acceptance:** owner-only + DECISIONS.md + expiry + never on a HARD or registry gate (plan §2.3).
- **Launch sequence actors:** deploy, rollback and real-conversion steps are HUMAN command-centre actions (v1 go-live law: Abilash approves, Deepu/Vercel-promote executes); the agent assembles evidence and verifies.
- **"Package launch checklist"** binds to docs/process/os-2026/package/07_TEMPLATES/V1_LAUNCH_CHECKLIST.csv; per-site ship checklists remain GENERATED from the registry, never hand-written (CM-111 carried below).
- **Cadence integration:** weekly/monthly rhythms integrate with the existing Monday-lint and STATUS.yaml session-end law; scorecards feed Phase 8.

## Obligations carried

This standard carries the following merge-continuity.yaml obligations. Each is quoted verbatim — the quote, not this file's paraphrase of it, is the binding text (validated by scripts/standards-acceptance.mjs).

- **CM-022**
  > Fixing one instance ≠ done. Grep/audit ALL instances, ALL page types, ALL three locales.
- **CM-109**
  > **`gates/registry.yaml` is the SINGLE source of truth for every rigorous check** — ship gates, repo lints, subagent audits, human gates — across the three site classes: **commerce** (Shopify stores), **organic** (Factory + WordPress content sites), **landing** (`/lp/<campaign>` pages). A check that is not in the registry is not part of the ship standard.
- **CM-110**
  > **Every gate MUST carry an explicit applicability entry for ALL three classes** — `required`, `adapted:"how"`, or `n_a:"reason"`. A gate with a missing class entry FAILS validation (`scripts/gate-registry-lint.mjs`, merge-blocking in factory-gate.yml). Skipping a class is a decision with a written reason, never a silence.
- **PKG-007**
  > Require: redirect-map tests and no-loop checks; axe-core accessibility scan plus manual critical-journey checks; security/dependency scans; backup and rollback verification; Lighthouse CI/performance budgets.
- **PKG-008**
  > Launch command centre: deployment log, real conversion, live crawl, sitemap/feed/ad verification, incident log — stop: guardrail breach or inability to roll back.
- **PKG-009**
  > Stabilize and verify: 24h/72h/7d/28d comparison, root-cause fixes and acceptance — stop: unexplained material regression.
- **PKG-010**
  > Daily/weekly/monthly/quarterly scorecards, experiments, content refreshes and competitor watch — stop: no owner, no evidence, no closed-loop learning.
- **PKG-012**
  > severity enum: P0, P1, P2, P3; Master OS rule: Never launch with unresolved P0 issues. P1 exceptions require named accountable acceptance and expiry date.
- **PKG-024**
  > Not proof: a task status without live retest; a screenshot without URL, timestamp, environment and expected result; an AI-generated summary without raw exports; … 'not applicable' without rationale. (10 items)
- **PKG-039**
  > Do not close an issue without retest evidence.
- **PKG-082**
  > Never launch with unresolved P0 issues. P1 exceptions require named accountable acceptance and expiry date.
