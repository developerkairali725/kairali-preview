# 2026 External Standards Register

**Version:** 1.0  
**Issued:** 2026-07-19  
**Scope:** This register records the external accessibility, application-security, agentic-AI-security, real-user performance and Google Search Console generative-AI reporting standards assumed by the operating system. It provides authoritative source URLs, source dates, verification date, applicability and caveats.  
**Referenced by:** `B2C-NEW-WEBSITE`, `B2C-EXISTING-WEBSITE`, `B2C-NEW-ORGANIC`, `B2C-EXISTING-ORGANIC`, `B2C-NEW-LANDING`, `B2C-EXISTING-LANDING`; `B2B-NEW-WEBSITE`, `B2B-EXISTING-WEBSITE`, `B2B-NEW-ORGANIC`, `B2B-EXISTING-ORGANIC`, `B2B-NEW-LANDING`, `B2B-EXISTING-LANDING`; `D2C-NEW-WEBSITE`, `D2C-EXISTING-WEBSITE`, `D2C-NEW-ORGANIC`, `D2C-EXISTING-ORGANIC`, `D2C-NEW-LANDING`, `D2C-EXISTING-LANDING`; `SHOPIFY-NEW-STORE`, `SHOPIFY-EXISTING-STORE`, `SHOPIFY-NEW-ORGANIC`, `SHOPIFY-EXISTING-ORGANIC`, `SHOPIFY-NEW-LANDING`, `SHOPIFY-EXISTING-LANDING`, and the corresponding manual-embedded workflows.

> **Precedence note:** The Master OS determines gates and approvals. External standards define technical baselines; where a law or contract is stricter, the stricter requirement applies. An AI may identify an update but must **propose the change to the owner for approval**.

**Register verified:** 2026-07-19

## 1. WCAG 2.2 AA

- **Standard:** Web Content Accessibility Guidelines (WCAG) 2.2.
- **Conformance target:** WCAG 2.2 Level AA unless a stricter legal or contractual requirement applies.
- **Source URL:** https://www.w3.org/TR/WCAG22/
- **Source date:** W3C Recommendation originally 2023-10-05; current Recommendation republished with errata 2024-12-12.
- **Applicability:** All applicable pages, components, documents and interaction technologies in scope.
- **Required evidence:** Automated scan plus manual keyboard, focus, zoom/reflow, screen-reader, forms/errors, contrast, motion and critical-journey testing.
- **Caveat:** Automated tools cannot establish full conformance. A clean axe/WAVE result is not proof of WCAG conformance.
- **Release rule:** Critical accessibility defects block release; exceptions require the accountable human business owner and applicable legal/accessibility review.

Key 2.2 additions relevant to release testing include Focus Not Obscured (Minimum), Dragging Movements, Target Size (Minimum), Consistent Help, Redundant Entry and Accessible Authentication (Minimum).

## 2. OWASP Top 10:2025

- **Standard:** OWASP Top 10:2025 — awareness baseline for critical web-application risks.
- **Source URL:** https://owasp.org/Top10/
- **Source date:** 2025 edition; verified 2026-07-19. The official page does not need to be converted into a fabricated day-specific publication date.
- **Applicability:** Web applications, CMS, ecommerce, APIs, authentication, integrations and release security review.
- **Caveat:** The Top 10 is an awareness baseline, not a complete security programme or penetration-test replacement.

Official 2025 categories:

1. A01:2025 Broken Access Control
2. A02:2025 Security Misconfiguration
3. A03:2025 Software Supply Chain Failures
4. A04:2025 Cryptographic Failures
5. A05:2025 Injection
6. A06:2025 Insecure Design
7. A07:2025 Authentication Failures
8. A08:2025 Software or Data Integrity Failures
9. A09:2025 Security Logging and Alerting Failures
10. A10:2025 Mishandling of Exceptional Conditions

- **Required evidence:** Threat model, dependency/supply-chain checks, access/authentication review, configuration and headers/TLS review, secrets and logging checks, DAST/SAST where applicable, remediation and retest.
- **Release rule:** Zero open confirmed critical vulnerabilities. High-risk exceptions require formal human approval, owner, mitigation and expiry.

## 3. OWASP Top 10 for Agentic Applications 2026

- **Standard:** OWASP Top 10 for Agentic Applications for 2026.
- **Source URL:** https://genai.owasp.org/resource/owasp-top-10-for-agentic-applications-for-2026/
- **Source date:** 2025-12-09.
- **Applicability:** AI agents that plan, use tools, retrieve content, maintain memory/context, create code/configuration, make decisions or interact with production/business systems.
- **Required controls:** Threat-model prompt injection, tool misuse, excessive agency, insecure memory/context, unsafe inter-agent trust, identity/credential boundaries, data exfiltration, untrusted external content and human approval for consequential actions.
- **Caveat:** The framework is a security starting point; it does not replace application security, privacy, legal review or domain expertise.
- **Release rule:** An agent cannot approve its own P0/P1 evidence or autonomously publish, migrate, redirect, delete, change tracking/consent/payment/checkout, expose secrets/customer data or issue regulated claims.

## 4. Core Web Vitals

- **Standard/source:** Google web.dev Core Web Vitals.
- **Source URLs:**
  - https://web.dev/articles/vitals
  - https://web.dev/articles/defining-core-web-vitals-thresholds
- **Source date:** Threshold-method article last updated 2025-05-07; verified 2026-07-19.
- **Applicability:** Field performance for valuable URLs/templates and origins, evaluated separately for mobile and desktop.

### Official thresholds at the 75th percentile

| Metric | Good | Needs improvement | Poor |
|---|---:|---:|---:|
| LCP | `<= 2.5 s` | `> 2.5 s` to `<= 4.0 s` | `> 4.0 s` |
| INP | `<= 200 ms` | `> 200 ms` to `<= 500 ms` | `> 500 ms` |
| CLS | `<= 0.1` | `> 0.1` to `<= 0.25` | `> 0.25` |

- **Field-data primacy:** Use CrUX or approved RUM at P75 for real-user status. Lab tools diagnose causes and enforce release budgets; they do not replace field status.
- **Segmentation:** Mobile and desktop separately; URL and origin as available; geography/template when using RUM.
- **Insufficient data:** Record `UNKNOWN` or unavailable. Do not manufacture a pass from a Lighthouse score.
- **Internal budgets:** A project may set stricter internal budgets, but they must be labelled OWN/EXPERIMENTAL, not official Google thresholds.

## 5. Google Search Console generative-AI reporting

- **Feature:** Dedicated Generative AI performance reports for Search and Discover.
- **Announcement URL:** https://developers.google.com/search/blog/2026/06/gen-ai-performance-reports
- **Help URL (Search):** https://support.google.com/webmasters/answer/16984139?hl=en
- **Source date:** Announced 2026-06-03; verified 2026-07-19.
- **Availability caveat:** Google is rolling the reports out to a subset of properties. Not all properties have access; a property may also lack sufficient impressions.
- **Included Search features:** AI Overviews and AI Mode. Search Labs experiments are not included.
- **Metrics/dimensions currently described:** impressions; pages; countries; devices for Search; dates. Ordinary Performance-report aggregation and row-limit caveats also apply.
- **Interpretation:** The report measures Google-defined impressions in supported generative features. It does not prove citations in every AI system, revenue impact, user sentiment or stable ranking.
- **Workflow rule:**
  - If available, export and preserve the report with date, property and dimensions.
  - If unavailable, mark `NOT_APPLICABLE` or `UNKNOWN` with reason and continue using approved controlled prompt panels and first-party commercial/search evidence.
  - Never fabricate zero impressions or infer report access from another property.
  - Report availability is a platform condition, not a quality verdict.

## 6. Standards applicability record

For every project, maintain:

| Standard | Applicable? | Scope | Evidence owner | Last verified | Exceptions | Human approver |
|---|---|---|---|---|---|---|
| WCAG 2.2 AA |  |  |  |  |  |  |
| OWASP Top 10:2025 |  |  |  |  |  |  |
| OWASP Agentic Applications 2026 |  |  |  |  |  |  |
| Core Web Vitals |  |  |  |  |  |  |
| GSC Generative AI reporting |  |  |  |  |  |  |

## 7. Revalidation and change control

External standards and platform reports may change. Review this register at least quarterly and before a material release when a relevant source has changed. An AI may retrieve the official source, identify a difference and draft a proposed amendment. It must **propose the change to the owner for approval**. Only the accountable human owner may issue Version 1.1 or later.
