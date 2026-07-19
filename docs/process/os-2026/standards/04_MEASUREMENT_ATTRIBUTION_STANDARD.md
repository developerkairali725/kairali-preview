# Measurement and Attribution Standard

**Version:** 1.0  
**Issued:** 2026-07-19  
**Scope:** This standard governs measurement specifications, GA4, GTM, Search Console, consent behaviour, events, primary and secondary conversions, ecommerce and lead attribution, CRM/backend reconciliation, offline conversion proof, monitoring and tracking release gates. It prevents clicks, modelled analytics or vendor dashboards from being mistaken for commercial truth.  
**Referenced by:** `B2C-NEW-WEBSITE`, `B2C-EXISTING-WEBSITE`, `B2C-NEW-ORGANIC`, `B2C-EXISTING-ORGANIC`, `B2C-NEW-LANDING`, `B2C-EXISTING-LANDING`; `B2B-NEW-WEBSITE`, `B2B-EXISTING-WEBSITE`, `B2B-NEW-ORGANIC`, `B2B-EXISTING-ORGANIC`, `B2B-NEW-LANDING`, `B2B-EXISTING-LANDING`; `D2C-NEW-WEBSITE`, `D2C-EXISTING-WEBSITE`, `D2C-NEW-ORGANIC`, `D2C-EXISTING-ORGANIC`, `D2C-NEW-LANDING`, `D2C-EXISTING-LANDING`; `SHOPIFY-NEW-STORE`, `SHOPIFY-EXISTING-STORE`, `SHOPIFY-NEW-ORGANIC`, `SHOPIFY-EXISTING-ORGANIC`, `SHOPIFY-NEW-LANDING`, `SHOPIFY-EXISTING-LANDING`, and the corresponding manual-embedded workflows.

> **Precedence note:** Where a workflow uses a shorter tracking checklist, the Master OS evidence hierarchy and this dual-source verification standard control.

## 1. Measurement source-of-truth hierarchy

1. Finance/backend/CRM/order/payment evidence defines recognized revenue, qualified pipeline, wins, refunds, returns and repeat purchase.
2. GA4/GTM/ad-platform data supports behaviour and attributed conversion; it does not overrule commercial truth.
3. Search Console defines Google Search visibility under its reporting definitions; it is not a revenue ledger.
4. Diagnostic and third-party tools support diagnosis and estimates only.

## 2. Measurement specification required before build

For every project, create an approved specification containing:

- business objective and exact primary outcome;
- primary, secondary and diagnostic events;
- metric formula and denominator;
- page, template, market, language, device and traffic-source dimensions;
- event name and trigger;
- required parameters and prohibited personal/sensitive data;
- event ID or transaction ID and deduplication method;
- value, currency, tax, shipping, discount and refund treatment;
- cross-domain/subdomain and payment-gateway rules;
- UTM, click-ID and original-source preservation;
- CRM/backend field mapping;
- consent category, default state, update state and regional applicability;
- browser/server delivery and reconciliation;
- debug method, expected result and acceptance criteria;
- owner, reviewer, release ID and monitoring alert.

The accountable business owner, a human, approves the business definitions. Analytics/data and CRM/ecommerce owners approve implementation details.

## 3. Event and conversion definitions

### 3.1 Diagnostic event

A behavioural signal such as page view, scroll, FAQ open, CTA click, video engagement, search or form start. It may diagnose friction but is not automatically a business conversion.

### 3.2 Secondary conversion

A meaningful intermediate action such as valid guide download, connected call, initiated WhatsApp conversation, qualified content request or checkout progression. The definition must state whether it is used for reporting or bidding.

### 3.3 Primary conversion

The workflow's intended verified outcome, such as:

- valid form delivered and accepted by CRM;
- connected and qualified call;
- confirmed booking/appointment;
- qualified account enquiry or accepted meeting;
- completed order/subscription;
- won revenue or other approved commercial outcome.

A button click alone is not a submitted lead, booking, order or sale.

### 3.4 Commercial conversion and negative outcome

Where applicable, capture qualification, win, payment, fulfilment, cancellation, refund, return and repeat purchase. Success is evaluated with quality and contribution guardrails, not volume alone.

## 4. GA4 and GTM control

- Maintain a versioned event dictionary and data-layer contract.
- Record GA4 property, data stream, GTM container and environment IDs.
- Preserve every published GTM container version and approval.
- Test event trigger, parameters, value, currency, identity, consent and deduplication in staging and production.
- Separate internal/test traffic under an approved rule.
- Validate referral exclusions and cross-domain/subdomain journeys.
- Do not place sensitive free text, health information, payment-card data, full names, emails or phone numbers in ordinary analytics parameters.
- Use transaction/event IDs to prevent duplicate purchases or leads where applicable.
- Record modelling, consent and ad-blocker limitations.
- No AI may publish a GTM container or change analytics definitions without human approval.

## 5. Google Search Console control

Archive and monitor, as applicable:

- Performance by query, page, country, device and search appearance;
- Page Indexing;
- Sitemaps;
- Crawl Stats;
- Core Web Vitals;
- Links;
- enhancement/rich-result reports;
- URL Inspection samples;
- generative-AI reports where available.

Search Console data may lag and aggregate differently. Preserve exports and report configuration. If a report is unavailable, mark it `NOT_APPLICABLE` or `UNKNOWN` with reason; never fabricate zero data.

## 6. Consent-mode and privacy control

For each jurisdiction and tag category:

- document whether consent is required and the accountable legal/privacy owner;
- set default consent state before dependent tags where required;
- test accept, reject, custom choice, return visit and withdrawal/change;
- verify tag sequencing, storage behaviour and regional variation;
- test session-recording masking and suppression;
- ensure privacy notice and preferences reflect actual tags and data recipients;
- store consent implementation evidence with the release.

Consent-banner appearance alone is not proof. Evidence must show actual tag and storage behaviour.

## 7. Attribution preservation

Preserve, where present and lawfully processed:

- UTM source, medium, campaign, term and content;
- platform click IDs;
- referrer and landing page;
- original and latest source under the approved model;
- campaign/ad/creative identifiers;
- market, language and device;
- CRM lead/account/order ID;
- transaction/event ID.

Test that identifiers survive redirects, subdomains, forms, checkout, payment gateways and CRM transfer. Do not overwrite the original source silently.

## 8. Ecommerce and lead payload validation

### Ecommerce

Validate product/item ID, variant, quantity, value, currency, tax, shipping, discount, order ID, payment state, cancellation and refund against Shopify/backend/finance.

### Lead/booking/B2B

Validate form success, backend delivery, CRM record, deduplication, source fields, assigned owner, qualification, connected call/WhatsApp/booking and offline conversion. Distinguish click from connected or qualified outcome.

## 9. Dual-source verification

No material conversion is approved from a single analytics stream.

| Outcome | Source A | Source B | Acceptance |
|---|---|---|---|
| Form lead | GA4/GTM success event | Form server/CRM accepted record | Counts reconcile within explained variance; failures owned |
| Call/WhatsApp | Click/connection event | Call provider/CRM qualification | Click and connected/qualified stages are separate |
| Booking | Analytics event | Booking backend/CRM confirmation | Booking ID, value/status and source map correctly |
| Order | GA4 ecommerce purchase | Shopify/backend/payment/finance | Order ID, value, currency, tax, shipping, discount and status reconcile |
| Refund/return | Analytics adjustment where used | Shopify/ERP/finance | Original transaction linked; negative value/state reconciles |
| Organic visibility | GSC report | Live crawl/index inspection or server evidence | Reporting and eligibility are interpreted together |

Record the comparison period, join key, variance, explanation and owner. Unexplained material variance is a P1; zero or failed critical conversion delivery is P0.

## 10. Tracking red flags

Block launch or escalate when:

- the primary outcome cannot be measured;
- material events are duplicated;
- conversion fires before verified success;
- analytics shows conversions but backend/CRM/order evidence does not;
- backend outcomes exist but analytics suddenly drops to zero;
- revenue, currency, tax, shipping, discount or refund values mismatch;
- transaction/event IDs are absent or reused;
- cross-domain or payment-gateway referrals overwrite source;
- UTMs/click IDs are lost through redirect, form, checkout or CRM;
- calls/WhatsApp clicks are reported as qualified connections;
- consent state or tag sequencing is wrong;
- session recordings expose unmasked personal/sensitive data;
- tags fire on wrong domains/markets or before allowed consent;
- internal/test traffic contaminates production results;
- Search Console or analytics estimates are presented as finance truth;
- a tag/container change is unversioned or lacks rollback.

## 11. Automated alerts

Create owned alerts for:

- zero primary conversions;
- sudden conversion or revenue drop;
- duplicate-event spike;
- revenue/order mismatch;
- form/payment/backend delivery failure;
- tag or consent-state regression;
- wrong-market/currency anomalies;
- unexplained source/attribution shift.

Each alert records metric, baseline, threshold, minimum duration, owner, channel, runbook and rollback authority.

## 12. Release evidence

A tracking release pack must include:

- approved measurement specification;
- event dictionary and field map;
- GTM/container or code version;
- staging debug evidence;
- production debug evidence;
- dual-source reconciliation;
- consent-state test matrix;
- cross-domain/referral test;
- real or controlled end-to-end conversion evidence;
- known gaps and accepted risks;
- accountable human approval.

## 13. Change control

An AI may identify inconsistencies, draft an event plan and run tests, but it may not change analytics definitions, consent, tag publication, payment logic or attribution rules autonomously. It must **propose the change to the owner for approval**.

---

# Kairali adoption appendix (OS v2)

**Adopted:** 2026-07-19 14:09:19 IST per D-20260719-11/-12 (owner-delivered GPT standards zip).
**Source integrity:** everything above the horizontal rule is the owner's GPT-authored file, byte-verbatim (SHA-256 `bf265a548f1e64ada5eae4d8da2c8a9786b49c8d1338d2ef97f469da668587aa`, zip manifest verified 7/7; immutable copy at docs/process/os-2026/source/00_SHARED_STANDARDS/04_MEASUREMENT_ATTRIBUTION_STANDARD.md).
**Supremacy:** Kairali v1 doctrine (CLAUDE.md, the merge plan's §2.6 strict union) is SUPREME over this file wherever they conflict (plan §0). The notes below subordinate specific passages; silence subordinates nothing — v1 always wins by default.
**Screen:** ingest screen per doctrine rule (r) + D-20260719-11 — 21-lens multi-agent screen + adversarial verify + completeness critic + first-party read; findings dispositioned in docs/reports/2026-07-19-standards-ingest-screen.md.

## Subordination notes (v1 supreme)

- **HARD GATE 11:** GTM container publication, analytics definitions, consent and payment logic are never agent actions, gate or no gate — humans execute; the agent drafts, tests in staging and verifies evidence.
- **Approver mapping:** "analytics/data and CRM/ecommerce owners" resolve to Abilash until those roles exist by name; business definitions are always the owner's.
- **"Known gaps and accepted risks"** in the release pack follow the v1 ACCEPTED_RISK constraint — owner-only, DECISIONS.md ruling, expiry, never on a HARD/registry gate.
- **Hierarchy nuance:** GSC is first-party evidence (00 §4 tier 2) whose SCOPE is Google visibility, never revenue — §1's ordering expresses scope, not a demotion; no conflict in practice.
- **Real primary-conversion tests in production** are human/command-centre actions (HARD GATE 1).

## Obligations carried

This standard carries the following merge-continuity.yaml obligations. Each is quoted verbatim — the quote, not this file's paraphrase of it, is the binding text (validated by scripts/standards-acceptance.mjs).

- **CM-009**
  > **Never invent IDs, keys, prices, distances, phone numbers, emails, or facts.** Read from env/content files, or leave empty and flag. If a fact is missing, ASK — do not fill the gap.
- **PKG-015**
  > Every report and issue must answer seven questions: exact formula, mandatory dimensions, source of truth, benchmark class, gap, diagnosis before recommending, exact improvement/acceptance test/monitoring period.
- **PKG-017**
  > Expected incremental contribution = addressable demand x attainable share x qualified conversion rate x contribution value x confidence - incremental cost; Priority score = incremental contribution x strategic importance x confidence x reach / (effort x time-to-value x risk). Every input must identify whether it is observed, calculated, estimated or assumed. A sensitivity range is mandatory for high-value bets.
- **PKG-018**
  > A third-party estimate cannot overrule finance, CRM, Search Console or server evidence.
- **PKG-026**
  > …must not: change analytics definitions, consent or payment logic.
- **PKG-037**
  > Label every finding as observed fact, calculated result, tool estimate, user-provided assumption or recommendation.
- **PKG-071**
  > metric_id,workstream,metric,definition_formula,required_dimensions,source_of_truth,secondary_tools,target_method,red_flag,diagnosis,improvement_action,do_not — 63 rows COM-001…OPS-002.
