# Prompt for GPT — generate the seven missing 00_SHARED_STANDARDS files
(Owner pastes everything below the line into the SAME GPT conversation that built
Digital_Growth_Agency_OS_2026. Written 2026-07-19; per D-20260719-11.)

---

In the Digital_Growth_Agency_OS_2026 package you built for me, every one of the 24 workflow files and all
manual-embedded workflows declares that it "inherits" seven shared-standards files under
`00_SHARED_STANDARDS/` — but that directory does not exist anywhere in the ZIP. All seven are dangling
references. Generate them now, as seven separate self-contained Markdown files with exactly these paths:

1. `00_SHARED_STANDARDS/00_MASTER_OPERATING_SYSTEM.md`
2. `00_SHARED_STANDARDS/01_TOOL_AND_REPORT_REGISTER.md`
3. `00_SHARED_STANDARDS/02_REGIONAL_DOMAIN_LOCATION_FRAMEWORK.md`
4. `00_SHARED_STANDARDS/03_URL_SITEMAP_MIGRATION_STANDARD.md`
5. `00_SHARED_STANDARDS/04_MEASUREMENT_ATTRIBUTION_STANDARD.md`
6. `00_SHARED_STANDARDS/05_QA_LAUNCH_MONITORING_LOOP.md`
7. `00_SHARED_STANDARDS/06_2026_STANDARDS.md`

Requirements, all mandatory:

- **Consistency over novelty.** Each file must contain exactly the standard the existing package already
  assumes: 00 = the Master OS core (phases 0–8 with the same names and stop conditions, 10 non-negotiable
  rules, 6-tier evidence hierarchy, 6 benchmark classes, definition of done — no new inventions);
  01 = the operational tool-and-report register that generalizes TOOL_STACK_REGISTER.csv's 18 stages,
  including per-report retention and never-overwrite versioning; 02 = the market/domain/location decision
  framework the International manual and REGIONAL_DOMAIN_LOCATION_MATRIX.csv assume (domain architecture
  decision record, hreflang rules, local/GBP workflow); 03 = the per-URL inventory → 6-class disposition
  (protect/refresh/consolidate/redirect/archive-noindex/retire) → redirect-map → migration-rehearsal
  standard your existing-asset workflows reference; 04 = measurement/attribution: GA4/GTM/GSC/consent-mode
  event and conversion definitions, dual-source verification, tracking red flags; 05 = the QA → launch
  command centre → 24h/72h/7d/28d stabilization → monitoring cadence loop with the 13 automated release
  checks and P0/P1 severity gating; 06 = the 2026 external standards register: WCAG 2.2 AA, OWASP Top 10
  2025 + OWASP Agentic Applications 2026, Core Web Vitals thresholds (field data primacy), GSC generative-AI
  reporting availability caveats — each with source URL, date, and applicability notes.
- **Every named structure must match the package verbatim** (phase names, status enum, benchmark classes,
  the 7-way competitive decision including "partner", the 10 agent evidence labels). Where the package is
  internally inconsistent, follow the Master OS core file, and say so in a one-line note.
- **Approval authority:** all approval language must state that gates are signed by the accountable business
  owner (a human). Do NOT include any instruction telling an AI agent to update, extend, or add learnings to
  these standards or any workflow autonomously — self-modification of standards is prohibited; the correct
  wording is "propose the change to the owner for approval."
- **No invented facts:** no fabricated statistics, no invented benchmark numbers presented as measured, no
  URLs you are not confident exist. Anything that is an estimate must be labelled an estimate.
- Each file starts with: title, Version 1.0, Issued date, one-paragraph scope, and a "Referenced by"
  line listing the workflow files that inherit it.
- Deliver as a single ZIP (`00_SHARED_STANDARDS.zip`) with an updated SHA-256 manifest for the seven files.
