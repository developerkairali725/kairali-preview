# Kairali Enterprise-Grade Build — SOP v1.0 Coverage Map

Every check in your Control SOP v1.0, distilled, with **where it's enforced today**. This is the lens for "did the site miss anything," and the seed of your unified gate registry.

**Status key**
- **ENFORCED** — a factory CI gate already fails the build if this is missed (from 2C / earlier)
- **2D** — a pre-build front gate that Session 2D installs
- **HUMAN** — covered by a named reviewer at the launch gate (Satyam / Sunaj / Deepu / clinical / legal), not automated
- **PARTIAL** — part covered, part gap (gap noted)
- **GAP** — not yet enforced or built; needs a gate or a signed sign-off before it is enterprise-grade
- **VERIFY** — I believe it's covered but couldn't confirm from the known gates; check the gate registry

---

## The 6 gaps that decide "enterprise vs average" right now

High-stakes SOP areas the factory does **not** yet systematically enforce, in priority order:

1. **Migration / redirect / URL-disposition (§6) — GAP.** You're rebuilding *ranking* legacy sites (kairaliyoga, healing.recipes, etc.). Without a one-row-per-URL disposition ledger, a tested redirect map, and backlink preservation, a rebuild silently drops SEO. The SOP demands 100% URLs dispositioned / 100% redirects tested / 100% critical backlinks protected (Appendix B). Nothing in the factory enforces this today. **Biggest enterprise risk in the current rebuild wave.**
2. **Healthcare claims register (§7.3 / §11.3) — GAP.** Every medical/therapeutic claim listed, categorised, evidence-sourced, clinical + legal signed, with disclaimer and re-review date — checked across copy, metadata, schema, alt text, FAQ and testimonials, not just visible copy. This is your known YMYL / physician-registration gap. Needs its own claims gate (existence + sign-off, like the front gates).
3. **Tracking QA + consent (§10) — PARTIAL.** Your strategy gate plans *which* events fire; the SOP wants them *implemented and QA'd*: canonical event dictionary, Consent Mode four-signal validation, click-ID capture (gclid/gbraid/wbraid/msclkid) surviving into CRM, browser/server dedup, and the full consent-state matrix. Planned, not verified.
4. **Full Shopify checklist (§9) — GAP** for the Next.js factory; this is your **Wave 1** track. Time-critical: Shopify Scripts stopped executing 30 Jun 2026, and Thank-You / Order-Status / checkout.liquid must be upgraded before 26 Aug 2026. Plus the test-order matrix and product-data completeness. None of this lives in the factory gates.
5. **Privacy / DPDP (§11.4) — GAP.** Patient/health business under India's DPDP: data inventory per field, consent records, withdrawal route, retention schedule, health data excluded from ordinary analytics. Needs a legal/privacy sign-off gate.
6. **Manual accessibility (§7.8 / §11.5) — PARTIAL.** Your Lighthouse a11y ≥95 is automated only; the SOP explicitly says automated scans alone are insufficient. Keyboard-only, screen-reader and zoom/reflow testing isn't enforced.

**2D closes the front of the pipeline. The six above are what the *next* hardening sessions (2E, 2F…) need to close for true enterprise-grade — and #1 and #4 touch live work this week.**

---

## Wave 1 (Shopify, 20 Jul) — what gates it

Before the KAPPL store launch, these SOP sections must pass, and none are in the current factory:
- **§9 Shopify checklist** — architecture, security/MFA, **Scripts→Functions migration**, product-data completeness, collections/search, PDP, theme/cart/checkout, payments/shipping/fulfilment, email/CRM, feeds, **§9.14 test-order matrix**, **§9.16 launch gate** (password removed only after OK TO PUBLISH).
- **§10 measurement** — Shopify Customer Events, order_paid/refund/fulfilment lifecycle, dedup.
- **§5.5 environments** — test mode disabled before launch; staging can't charge real payments.
- **Appendix B launch-preservation score** — 100% test orders pass, payments/tax/pixels active, backup + rollback tested, approvals tied to release ID.
- **Time-critical compliance:** Scripts dead since 30 Jun 2026; checkout/Thank-You/Order-Status upgrade deadline 26 Aug 2026.

---

## Full coverage map (SOP §5–§15 + appendices)

**§5 Common pre-flight**
- 5.1 Project control (ID, route, risk tier, market, KPI baseline, budget, owners, definition of done) — **2D** (brief gate)
- 5.2 Audience & conversion (one primary audience, objections, primary/secondary action, wrong-fit, SLA) — **2D** (brief / strategy)
- 5.3 Compliance applicability (countries, health data Y/N, payments/login/children Y/N, claims Y/N, reviewers named) — **GAP** (add to the brief gate as a routing question)
- 5.4 Data & vendor map (every field's purpose, storage, vendors, retention, consent, cross-border) — **GAP** (privacy)
- 5.5 Environments & release controls (dev/staging/prod split, staging no-index, no real payments, secrets, versioning, rollback owners, restore evidence) — **PARTIAL** (previews behind auth ✓; formal staging-charge/message guards + restore evidence = verify)

**§6 Migration & ranking preservation** — **GAP** (gap #1)
- 6.2 Current-state capture (full crawl, sitemaps/robots, analytics + GSC baselines, rankings/backlinks/revenue, backup + restore test, content freeze)
- 6.3 One-row-per-URL disposition ledger (identity, value, decision keep/redirect/410, destination, migration checks, sign-off)
- 6.4 Redirect & canonical rules (permanent redirects to equivalent pages only, no mass-redirect-to-home, 410 for removed, preserve backlinked redirects, final URLs in canonical/hreflang/schema/sitemap, no chains)
- 6.5 Launch migration gate + 6.6 Day 0/1/3/7/14/30/60/90 checkpoints

**§7 Organic SEO page**
- 7.1 Intake — **2D** (brief) · 7.2 Research & strategy (topics, intent, 3–5 competitors, content gap, Information Gain, internal-link plan) — **2D** (strategy)
- 7.3 Claims & evidence register — **GAP** (gap #2)
- 7.4 Required page content (5-sec hero, value prop, direct answer, who-it's-for, process, named experts, real proof, pricing, FAQ, CTA + compliance footer) — **PARTIAL** (design_source / golden-page approve structure; completeness of these blocks = add to the golden-page checklist)
- 7.5 Brand & copy (entity/dates not conflated, evidence-verified counts, no banned adjectives, no fake urgency, plain-English before Sanskrit, no cure/guarantee claims, logo-cover test) — **ENFORCED** (compliance lint + @kairali/facts + framing rules); claims portion → gap #2
- 7.6 Search & AI discoverability (one H1, headings, unique title/meta, self-canonical, OG, breadcrumbs/internal links, hreflang, valid schema matching visible content, no orphans/cannibalisation, entity-rich openings) — **PARTIAL** (some in factory-spec; full SEO checklist = verify/add)
- 7.7 Design/media/motion (responsive states, rights-cleared media, consent, captions, reduced-motion, no overflow/truncated CTA) — **PARTIAL** (tap-targets/render ENFORCED; media-rights + consent = HUMAN/gap)
- 7.8 Accessibility WCAG 2.2 AA (keyboard, focus, landmarks, labels/errors, contrast, **manual SR + zoom**) — **PARTIAL** (automated ENFORCED; manual = gap #6)
- 7.9 Technical & performance (field CWV LCP≤2.5 / INP≤200 / CLS≤0.1, assets optimised, no console/mixed-content errors, forms/CRM/analytics end-to-end, consent states) — **PARTIAL** (Lighthouse A5 ENFORCED; forms/consent end-to-end = HUMAN/gap)
- 7.10 Organic final 15-point audit — **PARTIAL** (several ENFORCED; run as the golden-page + launch checklist)

**§8 Paid landing page** — **GAP / HUMAN** (not in the current wave; message-match, minimised nav, dedup conversions, campaign paused until test conversion verified — activate when PPC pages start)

**§9 Shopify store** — **GAP** (Wave 1 track — full block above: 9.1 architecture → 9.16 launch gate, incl. Scripts/Functions, product data, PDP, checkout, payments, feeds, test-order matrix, migration reconcile)

**§10 Measurement, tags, events, attribution** — **PARTIAL** (gap #3) — platform matrix (activate only what's used), event dictionary, per-platform (Google/Bing/Yandex/Baidu) setup, Shopify events, conversion hierarchy, CRM offline loop, dedup, consent-state matrix

**§11 Compliance / privacy / a11y / security**
- 11.1 Kairali fact controls (118-yr = lineage only, not company/property age; verified dates; evidence + review date for counts/prices/awards; "Dr." only with verified qual) — **PARTIAL** (counts ENFORCED via facts; the 118-yr-lineage-vs-company + dates nuance governed by content rulings, not lint = verify)
- 11.2 Language & brand (zero-tolerance adjective list, replace with verifiable fact, calm authority, no urgency on clinical) — **ENFORCED** (compliance lint)
- 11.3 Healthcare claim register — **GAP** (gap #2)
- 11.4 Privacy & DPDP — **GAP** (gap #5)
- 11.5 Accessibility (automated never replaces manual) — **PARTIAL** (gap #6)
- 11.6 Security & supply chain (threat model, authz/validation/rate-limit, CSP/headers, secrets out of code, MFA/least-privilege, dep + secret scanning, SBOM Tier 3/4, AI-code human review, encrypted backups) — **PARTIAL** (supply-chain guard + dependabot + PR review ENFORCED; CSP/headers + secret-scanning + SBOM = verify/gap)
- 11.7 International / localisation (native-language reviewer, no unreviewed MT of regulated claims, hreflang/switcher/fallback, China = Baidu + local) — **PARTIAL/GAP** (multilingual builds ENFORCED; native-reviewer + regulated-claim-translation sign-off = gap)

**§12 Human review, approval, deployment, rollback** — **HUMAN** (your existing launch gate: marketing/sales/clinical/legal/finance/SEO + Satyam-forms / Sunaj-infra / Deepu-code + Abilash-final; feedback classification; approval log tied to exact version; deployment packs; OK-TO-PUBLISH gate; rollback triggers). Make sure the approval log ties every sign-off to build/commit/theme version.

**§13 Post-launch monitoring (24h / 2–7d / 8–30d / ongoing)** — **GAP / PLANNED** (your monitoring OS / AdWords-GSC-Analytics loop — not yet built; the 30-day acceptance decision is the close-out)

**§14 Claude output templates & dashboard** — **PARTIAL** (stage-review format, issue table, master dashboard from checklist %, GAR daily report — your kairali.ai dashboard / PROMPT 3 covers part of this)

**§15 Current-rule register** — **GAP** (dated external-platform-rule register with last-verified / next-review; RULE_REVALIDATION_REQUIRED on expiry — not built; DECISIONS.md is close but undated for external rules)

**Appendix A — evidence pack** — **PARTIAL** (2C launch-evidence gate enforces wiki/log + LEARNINGS + checklists; extend to the full 9-category pack)
**Appendix B — launch-preservation score** — **GAP** (the migration/launch 100%-scorecard — tie to §6 + §9 gates)
**Appendix C — official sources** — reference list (Google/Bing/Yandex/Baidu/Shopify/WCAG docs) — feed into the §15 register

---

## Honest note on the status column

Marks are my best read from the factory's **known** gates (2C + 2D + what's on record). Where I couldn't confirm, I wrote **VERIFY / PARTIAL** rather than assume a pass — the SOP's own "no unsupported completion claims" principle applied to my own map. Confirm the ENFORCED/PARTIAL calls against the actual gate registry before trusting them.

## What this means for sequencing

- **Tonight:** 2D (front gates) as planned — it closes §5.1/5.2, §7.1/7.2, and the design / golden-page spine.
- **Post-2D hardening order:** (1) §6 migration/redirect gate → (2) §7.3 / §11.3 claims gate → (3) §10 tracking + consent QA → (4) §9 Shopify gate-set for Wave 1 → (5) §11.4 DPDP → (6) §7.8 manual a11y.
- **The unified gate registry** you already want = this map, once each row has a class tag (organic / PPC / Shopify) marked required / adapted / N-A.
