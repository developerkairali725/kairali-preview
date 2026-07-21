# The Guided Engagement Flow — round-3 ruled spec (D-20260722-05/-06, GPT round 3 + Perplexity DFS check)

The product's core, per the owner: the AI knows the job, picks the lane, decides the next step, and FLOWS —
showing him/his team the result of every step as it happens, asking for input only at the right moments.
This supersedes "a menu of six cells": the matrix is the lane-picker; the FLOW is the product.

## 1. Engagement stage library (v1 cells; the 6 job types compose from these)

Intake+Brief → Old-Site Baseline (DataForSEO + GSC) → Asset Mining → Competitor/Reference Harvest →
Strategy Spec (SEO/GEO/AEO + KPI pick) → IA/Sitemap + Keep/Kill/Redirect map → Template Direction (3 options, HUMAN pick) →
Golden Page (real assets, HUMAN yes/no vs references) → Beauty+GO-science review → Asset Lock → Full Build →
Battery/QA → Cutover Pack + 301s → Launch Evidence → Monitoring vs Baseline → (paid LPs only) A/B Experiment.
Each of the six job types (+ Shopify column) runs a defined subset; QA-QC and LP-improve enter mid-library.
Backlog cells (ruled v2+): content calendar/blog ops, local SEO/GBP, reputation, CRO audit, email/CRM tie-ins,
brand refresh, migrations/decommissioning, multilingual rollout as a first-class job.

## 2. The Artifact Card — the unit the user watches (machine schema, carries R2+R3)

card_id (ulid) · engagement_id · stage_id/name · status ∈ {pending, processing, needs_input, blocked, done, rejected} ·
inputs_used (links to files/forms/prior cards) · tools_map (tool, version, run id — R7) · data_sources (provider, query,
timestamp, cost, raw-dump link) · evidence (tables/screenshots/files) · recommendation (plain text + action enum) ·
provenance_why (the scientific WHY — R2) · decision_required + decision (who, when, what — one clear ask max — R4) ·
audit_trail. Cards are immutable once done (R3: the card stream IS the report store); hashes per evidence bundle.
Storage: JSON in-repo per engagement (no DB — the ruled dashboard architecture), rendered by the dashboard stepper.

## 3. Human-input points (everything else advances autonomously)

Template Direction pick · Golden Page YES/NO vs references · guarded-field publishes · cutover GO (DNS = human hands) ·
tool/spend adoptions (HARD GATE 15) · A/B test conclusions that change money pages. Every other stage shows its card and moves on.

## 4. A/B + measurement v1 (guardrails ruled)

Experiments ONLY on paid LPs or pages ≥500 sessions/week; one primary metric per test (lead CVR or CTA CTR) in GA4;
pre-test power gate (expected MDE >30% relative ⇒ blocked as vanity); min runtime 14 days or 1,000 sessions/variant.
Tooling: ad-platform split tests now; GrowthBook-class tooling = an owner tool-adoption card (HG15) when traffic justifies.

## 5. DataForSEO — RULED: KEEP AND WIRE (GPT + Perplexity + Claude three-agree; the $50 PAYG was not waste)

Facts: the integration already exists on main (scripts/seo-baseline.mjs, merged #176, 43 tests, live bake-off); PAYG credits
never expire, no monthly fee; GSC/GA4 cannot provide competitor/SERP-feature/volume data. Plug-ins:
(1) Old-Site Baseline stage — baseline card (top pages/queries/positions/SERP features, PDF+CSV, raw dumps kept);
(2) IA/Sitemap stage — old sitemap × DataForSEO value data ⇒ Keep/Kill/Redirect table;
(3) Competitor stage — 3–5 competitors' top pages/queries diff table;
(4) Keyword/Content-brief stage — volumes, SERP features, questions ⇒ clusters per page.
Old-vs-new benchmark feeds the Monitoring stage (owner requirement R6, verbatim).

## 6. Owner wishlist placement (R1–R8 all land)

R1 channel register + weekly best-of-today proposal card · R2 provenance_why on every card · R3 card stream = report store ·
R4 needs_input asks · R5 prior-art attached to Strategy Spec · R6 DFS baseline + benchmark (above) · R7 tools_map per stage ·
R8 beauty/GO-science/registry gates run INSIDE stages, undiluted — surfaced as cards, enforced in CI as today.

## 7. Tonight → morning (build order, after dashboard Phase A lands)

(1) engagement/card JSON model + stepper UI + card list/detail with one needs_input control;
(2) seed ONE REAL demo engagement — arogyakendra.com REBUILD — through its first stages with real data:
DFS+GSC baseline card, mined-assets card, competitor card, template-direction card awaiting the human pick;
(3) the morning message shows the owner the live stepper with his first real decision waiting.

## 8. The Agency Roster — specialist AIs per stage (D-20260722-07: the system replaces a full creative+digital agency)

Every stage of a chosen work path is run by a SPECIALIST agent with its own charter (fresh context, stage-scoped
expertise), not one generalist. Existing specialists (in .claude/agents/, already operational) slot in; gaps get chartered:

| Stage | Specialist AI | Status |
|---|---|---|
| Intake/Brief + Strategy Spec | brand-strategist | charter NEW |
| Old-Site Baseline + Keyword/Content briefs | seo-aeo-geo-auditor + seo-analyst lane | EXISTS (+DFS wiring) |
| Asset Mining | asset-miner | charter NEW (mining playbooks exist) |
| Competitor/Reference Harvest | market-researcher | charter NEW (comp-set method exists) |
| Template Direction + Golden Page | art-director | charter NEW (beauty doctrine + references law as charter) |
| Copy/Content | content-geo-writer | EXISTS |
| Build | site-builder crews | EXISTS (factory workflows) |
| QA/Battery | design-qa + spec battery | EXISTS |
| Compliance (clinical/legal/catalog) | security-auditor + catalog-compliance + clinical locks | EXISTS |
| Marketing psychology | GO-science gate ("what would Akshar say") | EXISTS |
| CRO/A-B | cro-analyst | charter NEW (guardrails §4) |
| Measurement/Monitoring | measurement-analyst | charter NEW (GA4/CRM lanes pending access) |
| Shopify | commerce-specialist (doctrine j–s binds) | charter NEW |

## 9. Universal dual-AI vet law (extends the design-review law to EVERYTHING)

Whatever the system builds — a website, an LP, the dashboard itself, a specialist's stage output — is vetted by the
other two AIs (GPT: is it good · Perplexity: is it true) and iterated TO RESULTS before it counts as done. The
dashboard Phase A/B builds get their own dual-AI vet pass (including this roster) as their acceptance step.
