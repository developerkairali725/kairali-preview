# Evidence, Storage, QA and AI-Agent Execution Standard - 2026

## 1. Objective

The operating system must prove not only what was recommended, but what was observed, changed, deployed, verified and learned. A PDF is useful for human review but is not sufficient alone. Preserve the raw machine-readable data, configuration and provenance needed to reproduce the finding.

## 2. Three evidence layers

1. **RAW:** immutable exports exactly as collected - CSV, JSON, crawl files, HAR, screenshots, videos, PDFs, logs and platform exports.
2. **PROCESSED:** normalized tables, joins, calculated metrics and notebooks/scripts. Every processed artifact references its raw inputs.
3. **PUBLISHED:** client reports, dashboards, issue summaries and decisions. These reference processed calculations and raw evidence IDs.

Never edit or overwrite RAW evidence. Corrections create a new run ID.

## 3. Required storage path

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

The folder may live in approved object storage, Google Drive and/or a Git repository depending on artifact type. Large binary raw reports belong in durable object/document storage; code, schemas, manifests and small text evidence belong in version control. Sensitive data must follow access, retention and deletion policies.

## 4. Artifact manifest

Every report run or evidence bundle must include:

- artifact ID and run ID;
- client/project/release/issue identifiers;
- source/tool and version;
- exact configuration, API endpoint/query or crawl settings;
- domain/property, environment and URL scope;
- market, country, location, language, currency, device and user agent;
- date range, comparison range, timezone and collection timestamp;
- operator or agent identity and model/version when applicable;
- raw file names, MIME types, sizes and SHA-256 hashes;
- known exclusions, sampling, failures and data gaps;
- upstream input IDs and downstream issue/report IDs;
- review and approval status.

This follows the W3C PROV idea of recording entities, activities and agents so trust and reproducibility can be assessed [W03].

## 5. Historical report policy

- Save each human-readable report as PDF when the source supports it.
- Save the corresponding CSV/JSON/API response and settings; PDF alone is insufficient.
- Never overwrite a monthly or pre-launch report. Use a new timestamp/version.
- Generate a checksum manifest after collection.
- Store baseline screenshots and critical-page full-page captures.
- For dynamic dashboards, export the underlying data and save the dashboard definition or query.
- Record tool plan/licence limitations and unavailable dimensions.
- Retain pre-migration evidence and redirect maps for the approved retention period, normally at least the useful life of the migration and any legal/contractual requirement.

## 6. Issue evidence bundle

Every issue folder contains:

1. issue record and severity;
2. raw evidence or pointers to artifact IDs;
3. affected URL/entity export;
4. business consequence and confidence;
5. recommendation and acceptance criteria;
6. implementation link: commit, PR, CMS revision, tag version, configuration or vendor ticket;
7. staging test evidence;
8. live deployment evidence;
9. post-deployment retest;
10. KPI monitoring result;
11. final reviewer decision or accepted risk.

## 7. Proof-of-completion state machine

`OPEN -> EVIDENCED -> APPROVED -> IMPLEMENTING -> STAGING_QA -> READY_FOR_RELEASE -> DEPLOYED -> LIVE_VERIFIED -> MONITORED -> CLOSED`

A ticket may not skip directly from IMPLEMENTING to CLOSED. A failed live test returns it to IMPLEMENTING or triggers rollback. P0/P1 closure requires independent review.

## 8. Automated release checks

Where technically possible, require:

- build/unit/integration tests;
- Playwright critical journeys and traces;
- visual snapshot comparison under controlled environment [PW01];
- redirect-map tests and no-loop checks;
- internal broken-link scan;
- robots/noindex/canonical/hreflang/schema tests;
- analytics event and ecommerce payload tests;
- axe-core accessibility scan plus manual critical-journey checks;
- Lighthouse CI/performance budgets;
- security/dependency scans;
- sitemap validation;
- market/language/currency/inventory tests;
- backup and rollback verification.

Protect the release branch and require reviews/checks. Build provenance or artifact attestations may be used to verify where/how release artifacts were produced [GH01-GH02].

## 9. AI-agent operating contract

An AI agent must receive:

- workflow ID and phase;
- client/project/release IDs;
- exact domain, market, language, device and date scope;
- authorized tools and credentials boundaries;
- input artifact IDs and freshness requirements;
- required output schema;
- evidence and citation requirements;
- prohibited actions;
- approval gate and escalation owner;
- retry/timeout/cost limits;
- definition of done.

### Agent evidence labels

Every statement must be labelled internally as one of:

- `OBSERVED_FIRST_PARTY`
- `OBSERVED_LIVE_TEST`
- `CALCULATED`
- `THIRD_PARTY_ESTIMATE`
- `USER_PROVIDED`
- `EXTERNAL_BENCHMARK`
- `ANECDOTAL_SIGNAL`
- `ASSUMPTION`
- `RECOMMENDATION`
- `UNKNOWN`

### Prohibited autonomous actions

Without the specified human gate, an agent must not:

- publish or delete production content;
- change domains, DNS, robots, canonicals, hreflang or redirects;
- submit disavow files;
- change analytics definitions, consent or payment logic;
- install/uninstall Shopify apps or alter checkout;
- make regulated medical, legal or financial claims;
- send competitor outreach, reviews or public communications;
- expose secrets or customer data;
- approve its own P0/P1 evidence.

Agentic systems should also be threat-modelled for prompt injection, tool misuse, insecure memory/context and excessive autonomy, using current agent-security guidance [O02].

## 10. Exclusion and decision register

Every suggested control, finding or opportunity receives one status:

- **INCLUDED_NOW** - applicable and scheduled;
- **DEFERRED** - applicable but delayed, with risk and reconsideration date;
- **NOT_APPLICABLE** - reason tied to business model, technology, market or absence of feature;
- **REJECTED** - evidence or economics do not support it;
- **UNKNOWN** - evidence/access missing; owner and next step required;
- **ACCEPTED_RISK** - accountable owner accepts consequence until expiry.

Record source, rationale, risk, owner, approval, expiry and reconsideration trigger. This prevents future reviewers or AIs from repeatedly proposing an idea that was already evaluated, while allowing decisions to be reopened when assumptions change.

## 11. What must not count as proof

- a task status without live retest;
- a screenshot without URL, timestamp, environment and expected result;
- an AI-generated summary without raw exports;
- a tool health score without issue-level evidence;
- a PDF without machine-readable data/configuration;
- code committed but not deployed;
- deployment completed but conversion/indexation not verified;
- improved rankings without qualified conversion/revenue analysis;
- a benchmark without source, date, segment and definition;
- “not applicable” without rationale.
