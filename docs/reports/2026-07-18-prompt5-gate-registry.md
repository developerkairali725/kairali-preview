# PROMPT 5 — Unified gate registry across all three site classes
**2026-07-18 14:28:56 IST · Branch `feature/prompt5-gate-registry` · Executes docs/plans/2026-07-17-factory-audit-and-launch-roadmap.md §PROMPT 5 (Abilash's 17 Jul "one gate registry, three site classes" rule, roadmap §7)**

**Deliverables in this PR (no site-code changes):**
1. `gates/registry.yaml` — every rigorous check defined ONCE: **63 gates**, each with `{id, name, what_it_verifies, severity, run, status, script_or_agent_ref, source, applicability{commerce, organic, landing}}`.
2. CLAUDE.md **v1.10** — §GATE REGISTRY law: a gate with a missing class entry fails validation; per-site ship checklists are GENERATED from the registry by class, never hand-written.
3. `scripts/gate-registry-lint.mjs` — merge-blocking validation (wired into `.github/workflows/factory-gate.yml`, brand-lint job) + `scripts/test/gate-registry-lint.test.js` (14 tests, both-directions house rule). No existing gate touched or weakened.
4. This report — the full gates × classes matrix (§3) and the cross-class misses the rule closes (§4).

## 1. Inventory sources (what was read to compile the registry)

| Source | What it contributed |
|---|---|
| `SITE_LAUNCH_CHECKLIST_v1.0.md` (the Ship Gate) | A1–A13 CI gates, B1–B14 launch tasks, C1–C3 human gates, D post-launch, E learning loop, FORMS v1-freeze, CHATBOT architecture |
| `docs/checklists/sitewide-migration-checklist.md` + `pagewise-migration-checklist.md` (masters) | Migration-era checks (redirect/301 map, GSC+Bing, UTM, breadcrumbs, WAVE accessibility) — absorbed into A6–A12, B7, `internal-link-crawl`, `legacy-mine-protection-map`, `generated-checklists-filled` |
| "The 19-gate page suites" (named in the roadmap + this prompt's brief) | **ORPHAN REFERENCE — no 19-item gate exists.** `docs/process/MASTER_PIPELINE.md:1639` retired it ("Ship Gate A has 13"). The real page suites are Ship Gate A + `tests/factory/factory-site.spec.ts`. See OPEN O2 |
| `.claude/agents/` (design-qa, seo-aeo-geo-auditor, security-auditor, catalog-compliance, content-geo-writer) + `docs/sops/` | The subagent audit gates (§D rows of the registry) incl. injection screening (rule r) and the content-draft compliance gate (rule o) |
| `scripts/*.mjs` + `.github/workflows/factory-gate.yml` + `gate.yml` + `uptime.yml` + `tests/factory/` + `scripts/hooks/` | The 17 built merge-blocking gates (§A rows), matrix-walk (G9-PRE), uptime |
| Shopify Track: CLAUDE.md doctrine (j–s), `M2_SHOPIFY_SETUP_PROMPT.md`, `SHOPIFY_TRACK_CONTEXT.md`, roadmap §7 | theme-check, checkout flows, catalog compliance, payment gateways, price/inventory integrity, settings drift, myshopify noindex. **`scripts/shopify-catalog-lint.mjs` does NOT exist in the repo** despite CLAUDE.md (l)/(p) citing a Monday cadence for it — see OPEN O1 |
| `docs/design/LANDING_PAGE_DOCTRINE.md` + CLAUDE.md §FACTORY RULES (landing pages) | lp-noindex-single-cta, lp-message-match, lp-ad-policy |
| `docs/process/inventory-existing-rules.md` + `MASTER_PIPELINE.md` | Enforcement-status ground truth (MACHINE / PROSE-ONLY / PHANTOM per rule) — the `status: built|partial|planned` honesty layer |

**Deliberately excluded** (session laws, not per-site ship checks): boot contract, directive capture, STATUS.yaml session-end, agent-log hook (q), crash-resilience commit cadence. They bind on sessions, not on a site's shipability; generating them into a per-site checklist would misstate what they gate.

## 2. Registry stats (printed by the lint — real output in §5)

| Class | required | adapted | n_a | total tagged |
|---|---|---|---|---|
| commerce | 18 | 42 | 3 | 63 |
| organic | 50 | 6 | 7 | 63 |
| landing | 27 | 21 | 15 | 63 |

Severity: 44 blocker · 18 high · 1 advisory. Status: 43 built · 12 partial · 8 planned (every planned/partial row says so explicitly — the A5/A9/A10/A11 "FALSE-automated" failure class is now structurally impossible in the registry: a built/partial ref is existence-checked on disk, a planned ref must say PLANNED).

## 3. The full matrix — 63 gates × three classes

Legend: **required** = binds as written · adapted — how it binds for that class · n/a — why it cannot apply. `run · status`: automated/agent/human · built/partial/planned. Rows generated from `gates/registry.yaml` by the lint's own parser (not hand-transcribed).

| gate | severity | run · status | commerce | organic | landing |
|---|---|---|---|---|---|
| `build-clean` | blocker | automated · built | adapted — Factory product microsites build via pnpm as-is; the Shopify theme itself is validated by shopify-theme-check instead (no pnpm build exists for liquid) | **required** | **required** |
| `factory-spec-suite` | blocker | automated · built | adapted — Runs as-is on commerce microsites in the matrix; the store itself needs the planned checkout-flows suite against the dev-theme preview — locked-fact and mixed-content assertions apply there too | **required** | adapted — Suite runs at host-site level; /lp/ routes are not individually visited today — LP-specific assertions live in lp-noindex-single-cta (flagged cross-class miss until an LP route walker exists) |
| `compliance-lint` | blocker | automated · built | adapted — Repo-side commerce surfaces linted as-is; live store catalog copy is linted by catalog-compliance-audit (the lint cannot see the Shopify admin) | **required** | **required** |
| `brand-lint` | blocker | automated · built | adapted — Factory microsites linted as-is; theme liquid/CSS is NOT scanned today — theme token conformance rides design-qa-audit on the dev-theme preview until a liquid-aware lint exists (flagged cross-class miss) | **required** | **required** |
| `banned-string-lint` | blocker | automated · built | adapted — Repo surfaces scanned as-is; live store catalog strings covered by catalog-compliance-audit | **required** | **required** |
| `cta-label-lint` | blocker | automated · built | adapted — Repo surfaces scanned as-is; store theme CTAs verified by design-qa-audit on the dev-theme preview until the theme repo carries the same lint | **required** | **required** |
| `honest-ymyl-content-lint` | blocker | automated · partial | adapted — Product-claim honesty enforced through catalog-compliance-audit's claims lens (.in DMR/ASCI · US FDA/FTC · EU health-claims) | **required** | adapted — LP claims run compliance-lint + lp-ad-policy (DMR/ASCI ad enforcement is stricter than page rules); YMYL article rules n/a to single-goal campaign pages |
| `s3-keyword-gates` | blocker | automated · built | adapted — Applies whenever S3 keyword work runs for commerce microsites/collection metadata — same artifacts, same gates | **required** | n/a — LPs are noindex by default (Factory rule); paid terms come from the approved campaign mandate, and term-to-page alignment is gated by lp-message-match, not organic demand data |
| `factory-matrix-self-registration` | blocker | automated · built | adapted — Commerce microsites in this monorepo register as-is; the Shopify theme repo lives outside these matrices — its CI equivalent is the planned theme-repo pipeline (flagged cross-class miss) | **required** | adapted — /lp/ pages ship inside a registered host site; no separate matrix entry exists or is needed |
| `launch-evidence-gate` | blocker | automated · built | adapted — Store launches keep the same law — evidence lands in launches/<store-domain>/ with the commerce-class generated checklist | **required** | adapted — Campaign launches file evidence under the host site's launches/<domain>/ keyed by campaign slug |
| `front-gate-approvals` | blocker | automated · built | adapted — Microsites arm normally; theme-repo work is not under sites/<domain> so the mechanical gate never fires there — the forever-human list (CLAUDE.md k) is the commerce front gate today (flagged cross-class miss) | **required** | **required** |
| `lighthouse-budgets` | blocker | automated · built | adapted — Run against the UNPUBLISHED dev-theme preview URL; checkout-critical templates included; budgets per roadmap §7 | **required** | adapted — STRICTER speed budget (LP doctrine §6 — paid traffic pays per click); SEO=100 n/a on noindexed LPs per LANDING_PAGE_DOCTRINE §8 — perf/a11y budgets bind unchanged |
| `unit-tests-discovered` | blocker | automated · built | adapted — Monorepo commerce code tested as-is; theme-repo tests ride the planned theme-repo pipeline | **required** | **required** |
| `secret-scan` | blocker | automated · built | adapted — Monorepo scanned as-is; security-audit-posture additionally checks no tokens in theme code/liquid and ~/work/.env.shopify hygiene | **required** | **required** |
| `dependency-audit` | blocker | automated · built | adapted — Monorepo lockfile audited as-is; theme repo audited where a lockfile exists | **required** | **required** |
| `security-review-diff` | blocker | automated · built | **required** | **required** | **required** |
| `pre-launch-matrix-walk` | blocker | automated · partial | adapted — Same verdict-contract walk over the Shopify track's stage set once its emitters exist; the forever-human rows record human sign-off verdicts | **required** | adapted — LP variants under an approved campaign mandate walk the SΔ re-entry slice (MASTER_PIPELINE §0.3), not the full pre-launch walk |
| `meta-canonical-crawl-files` | blocker | agent · partial | adapted — Shopify generates robots/sitemap — verify rather than build; per-store claims lens on titles/descriptions; myshopify-noindex is its own gate | **required** | adapted — Meta present for QA but page is noindex BY DESIGN — the check inverts: verify noindex IS set (lp-noindex-single-cta) and the page is excluded from sitemap.xml |
| `hreflang-reciprocal` | blocker | automated · built | adapted — Two-store market split (.in/.com): cross-store hreflang only where both stores carry the equivalent page; within a store, per Shopify markets config | **required** | n/a — Campaign LPs are single-locale by design; a locale variant is a separate campaign page with its own mandate |
| `schema-jsonld` | blocker | agent · partial | adapted — PDP: valid Product/Offer JSON-LD (price, currency, availability) with one canonical PDP URL — per seo-aeo-geo-auditor Shopify section | **required** | adapted — Organization schema only; FAQ/Article rich-result schema n/a on noindexed pages |
| `og-cards-render` | high | human · planned | adapted — Store OG comes from theme settings + product images — verify render on PDP/collection templates in the dev-theme preview | **required** | **required** |
| `alt-text-favicons` | high | agent · partial | adapted — Catalog images-without-alt linted by catalog-compliance-audit; favicons from theme settings | **required** | **required** |
| `internal-link-crawl` | blocker | human · planned | adapted — Store crawl for collection/PDP 404s; PDP URL changes flagged to Vikash BEFORE they happen (CLAUDE.md rule m) since live Ads point at them | **required** | adapted — No legacy 301 map for new /lp/ paths; internal + outbound links on the LP still crawled clean |
| `consent-mode` | blocker | automated · partial | adapted — Shopify Customer Privacy API / consent app in the theme + Consent Mode v2 via GTM — same signals, Shopify-native mechanism | **required** | adapted — Even with the stripped LP footer, consent + privacy link REMAIN (LP doctrine §9 Q8 minimum set); consent boolean written to the CRM record explicitly |
| `keyword-map` | high | agent · built | adapted — Collection/PDP keyword map for commerce microsites and store metadata | **required** | n/a — Paid terms come from the campaign mandate; term alignment gated by lp-message-match |
| `geo-ai-readiness` | high | agent · built | adapted — llms.txt on commerce microsites; store product facts flow to the Products entity bot KB rather than a store llms.txt | **required** | n/a — Noindexed campaign pages are not AI-answer surfaces; entity facts live on the host site's organic pages |
| `ga4-stream` | blocker | agent · built | adapted — Store GA4 via Shopify's Google channel + Triple Whale for commerce metrics; microsites use packages/analytics as-is | **required** | **required** |
| `gtm-conversion-events` | blocker | agent · built | **required** | **required** | **required** |
| `ads-conversion-actions` | high | agent · built | **required** | adapted — Only where live campaigns target the domain; otherwise recorded as no-spend in launch evidence | **required** |
| `pixels-installed` | high | agent · built | **required** | adapted — Per register: Meta (C/E consumer), LinkedIn (A-register B2B) — the register decides the set | **required** |
| `gsc-bing-verification` | high | agent · built | adapted — Store primary domains verified; Shopify auto-sitemap submitted; myshopify subdomain excluded (see myshopify-noindex) | **required** | n/a — Noindex pages are not submitted; the host site's domain property already covers the URL space |
| `forms-crm-parity` | blocker | agent · built | n/a — Checkout replaces lead forms — checkout is ALWAYS the main Shopify store (Factory rule: never build a cart/checkout/payment form); any store contact form follows the host CRM parity rule where present | **required** | adapted — LP lead capture is store-first into our own DB with consent as an explicit boolean field (LP doctrine §4, Satyam spec) — same parity law, stricter field-minimization |
| `chatbase-entity-bot` | high | agent · built | adapted — Products/Shopify entity bot answers product Qs and links to PDPs; KB fed from catalog export | **required** | n/a — Single-CTA law — no chatbot widget competes with the one conversion goal on a campaign LP |
| `uptime-fleet-pulse` | high | agent · built | **required** | **required** | adapted — Rides the host site's monitor; campaign tracked as a workstream/stage in STATUS.yaml rather than a separate uptime row |
| `forward-family-redirects` | high | agent · built | adapted — Store forward family plus myshopify.com → primary-domain redirect (see myshopify-noindex) | **required** | n/a — No forward family exists for an /lp/ path under an already-forwarded domain |
| `social-press-links` | high | agent · built | adapted — Store social links via theme settings; press pages n/a to the store itself | **required** | n/a — Stripped-footer LPs carry no social/press links by design (attention ratio) |
| `runtime-monitoring` | high | agent · built | adapted — Shopify hosts the store (no Vercel/Sentry surface) — web vitals + error signals via Shopify analytics and Triple Whale; microsites wire Sentry as-is | **required** | adapted — Covered by the host site's Vercel/Sentry project — verify LP routes report into it |
| `design-critic-review` | blocker | agent · built | adapted — Review runs on the dev-theme preview URL screenshots — never the live theme | **required** | adapted — Same rubric plus message-match awareness: the reviewer scores against the ad promise, not just the page in isolation |
| `design-qa-audit` | blocker | agent · built | **required** | **required** | **required** |
| `seo-aeo-geo-audit` | blocker | agent · built | adapted — Shopify-specific section runs first: PDP Product/Offer JSON-LD, collection canonicals, variant/tag URLs not indexable, per-store claims lens | **required** | adapted — SEO/AEO/GEO sections n/a on noindex pages — audit scope narrows to meta hygiene, mobile usability, CWV and schema minimum |
| `security-posture-audit` | blocker | agent · built | **required** | **required** | **required** |
| `injection-screening` | blocker | agent · built | **required** | **required** | **required** |
| `content-draft-compliance` | blocker | agent · built | **required** | **required** | **required** |
| `catalog-compliance-audit` | high | agent · planned | **required** | n/a — No catalog exists on organic sites; product mentions are page content, covered by compliance-lint | n/a — Product LPs render packages/product-card fed by the Storefront API — catalog truth is linted at the store, once, upstream |
| `shopify-theme-check` | blocker | automated · planned | **required** | n/a — No liquid themes exist on Factory/WordPress organic sites | n/a — LPs are Factory TSX pages; no theme layer |
| `checkout-flows` | blocker | automated · planned | **required** | adapted — Where packages/product-card is embedded: verify the buy action resolves to the main store checkout — no local cart/checkout exists to test (Factory rule) | adapted — Product LPs: same product-card handoff verification — the buy CTA must land on the store checkout |
| `payment-gateways-per-store` | blocker | human · built | **required** | n/a — No payment surface exists — Factory sites never carry checkout or payment forms | n/a — Same law — LPs never carry payment forms; money changes hands only at the store |
| `price-inventory-integrity` | blocker | automated · planned | **required** | adapted — Product cards render LIVE Storefront API prices — a hardcoded price string in a page is a HARD GATE 6 violation | adapted — Same product-card rule on product LPs |
| `settings-drift-check` | blocker | agent · built | **required** | n/a — No store settings surface exists | n/a — No store settings surface exists |
| `myshopify-noindex` | high | agent · built | **required** | n/a — No myshopify surface | n/a — No myshopify surface |
| `lp-noindex-single-cta` | blocker | automated · planned | n/a — Store pages are indexable commerce surfaces with their own conversion architecture | n/a — Organic pages are indexable by definition and serve multiple journeys | **required** |
| `lp-message-match` | blocker | human · planned | n/a — No paired ad-to-page promise on store pages; Ads final-URL policy still applies via ads-final-url-cutover | n/a — Organic pages answer queries, not ad promises | **required** |
| `lp-ad-policy` | blocker | agent · partial | adapted — Product claims on store surfaces run the same claims lens via catalog-compliance-audit; Ads destination rules apply to store campaigns at cutover | adapted — Same DMR/ASCI claims law enforced by compliance-lint; ad-destination rules n/a without paired ads | **required** |
| `generated-checklists-filled` | blocker | human · partial | adapted — Commerce-class checklist generated from this registry (the docs/checklists/ masters assume indexable web pages) | **required** | adapted — Landing-class checklist generated from this registry (LP-specific items per LANDING_PAGE_DOCTRINE §9 Q7) |
| `legacy-mine-protection-map` | blocker | human · planned | adapted — Store migrations: PDP/collection URL fates + Vikash flagged BEFORE any PDP URL change (CLAUDE.md rule m) | **required** | n/a — New /lp/ paths have no legacy URLs; the host domain's map is owned by the host site's rebuild |
| `human-audit-round` | blocker | human · built | adapted — Same round on the theme preview link; Satyam's slot covers checkout test transactions instead of lead forms | **required** | adapted — Satyam verifies LP lead capture lands store-first with the consent boolean; Sunaj slot shrinks to routing (no DNS change for a path) |
| `preview-approval` | blocker | human · built | adapted — Approval is on the UNPUBLISHED theme preview link; publishing the theme is itself forever-human (rule k) | **required** | **required** |
| `dns-go-live` | blocker | human · built | adapted — Domain connect + theme publish inside Shopify admin — forever-human list (rule k) | **required** | n/a — An /lp/ path under a live domain needs no DNS action; go-live is the Ads cutover |
| `ads-final-url-cutover` | blocker | human · built | adapted — Where live spend targets store URLs — coordinated with Vikash (PDP URL rule m) | adapted — Only where campaigns point at the domain; otherwise recorded as no-spend | **required** |
| `post-launch-verification` | high | agent · built | adapted — Plus checkout conversion monitoring and Triple Whale baseline in the same windows | **required** | adapted — Indexing checks invert (verify still noindexed); Day-1 = events firing + first lead in CRM; Day-7 = conversion rate vs campaign baseline |
| `launch-retro-learning-loop` | high | agent · built | **required** | **required** | **required** |
| `weekly-qa-rotation` | advisory | agent · partial | adapted — Store surfaces crawled READ-ONLY; catalog layer covered by the Monday catalog-compliance-audit instead | **required** | adapted — Live campaign LPs join the host site's rotation while spend is active |
| `cross-model-audit` | high | agent · built | **required** | **required** | **required** |

## 4. The cross-class misses this rule closes

These are the gates that TODAY exist (run, or are doctrine) for one class while the other classes were simply UNMARKED — no required, no adapted, no reasoned n/a. Each is now an explicit registry entry; the mechanical enforcement gaps stay flagged as `planned`/`partial` rather than papered over.

| # | Gate(s) | Existed for | Was unmarked for | What the registry now says |
|---|---|---|---|---|
| M1 | `honest-ymyl-content-lint` | ONE organic site (`scripts/content-lint.mjs` is hard-scoped to sites/whatisayurveda.com) | commerce, landing — and every OTHER organic site | commerce → catalog claims lens; landing → compliance-lint + lp-ad-policy; organic scope-widening flagged (status: partial). The same claim risk existed on PDPs and LPs with nothing pointed at it |
| M2 | The entire merge-blocking CI block (`build-clean`, `factory-spec-suite`, `lighthouse-budgets`, matrices) | organic (Factory sites in the CI matrices) | commerce (the store/theme — NOTHING equivalent runs; Track B blocked on Ambuj's tokens), landing (LP routes not individually exercised) | commerce → theme-check + checkout-flows (planned, required); landing → adapted with the LP-walker gap named |
| M3 | `brand-lint` | organic/landing (TSX/CSS surfaces) | commerce theme (liquid/CSS never scanned) | adapted — rides design-qa on the dev-theme preview until a liquid-aware lint exists |
| M4 | `front-gate-approvals` | organic + landing (arms on sites/<domain> paths) | commerce theme-repo work (no mechanical front gate fires) | adapted — forever-human list (k) is the commerce front gate today; gap named |
| M5 | `banned-string-lint`, `cta-label-lint` | repo surfaces (organic/landing) | live store catalog strings | adapted — covered by catalog-compliance-audit once its script exists (see O1) |
| M6 | `catalog-compliance-audit`, `settings-drift-check`, `myshopify-noindex`, `payment-gateways-per-store`, `shopify-theme-check`, `checkout-flows`, `price-inventory-integrity` | commerce (doctrine j–s + agent contracts) | organic, landing — the roadmap's Shopify checks had NO stated relationship to Factory sites | explicit n/a with reasons, or adapted (e.g. the one-checkout handoff verification on product-card surfaces was owned by NOBODY — now an explicit adapted entry on organic + landing under `checkout-flows`) |
| M7 | `lp-noindex-single-cta`, `lp-message-match`, `lp-ad-policy` | landing (doctrine prose only — LANDING_PAGE_DOCTRINE §9 Q7 itself asks "who owns that lint?") | commerce, organic | landing required (planned mechanization named); commerce/organic n_a or adapted with reasons |
| M8 | `hreflang-reciprocal` | organic (factory spec A7) | commerce (cross-store .in/.com hreflang unowned), landing | commerce adapted; landing reasoned n/a |
| M9 | `forms-crm-parity` | organic (B8) | commerce (silently assumed irrelevant), landing (LP forms follow a DIFFERENT spec — store-first + consent boolean — that lived only in the LP doctrine) | commerce reasoned n/a; landing adapted with the Satyam spec named |
| M10 | `design-critic-review` (B14) | organic (formalized from the arogyakendra pass) | commerce (dev-theme), landing | both adapted explicitly |
| M11 | `og-cards-render`, `alt-text-favicons`, `internal-link-crawl` (A9/A10/A11) | claimed automated for organic — **verified FALSE** (MASTER_PIPELINE: "four of thirteen") | all classes, in effect — a check that doesn't run exists for nobody | status now honest (planned/partial), all classes tagged; the lint makes a ref that names a missing artifact a CI failure |
| M12 | `weekly-qa-rotation` | organic (prose-only, no scheduler — inventory WF-QA) | commerce store surfaces, live LPs | both adapted explicitly; still advisory + partial (no scheduler — not hidden) |
| M13 | `s3-keyword-gates`, `keyword-map`, `geo-ai-readiness`, `gsc-bing-verification`, `chatbase-entity-bot`, `forward-family-redirects`, `social-press-links` | organic (Ship Gate B) | landing — every one was silently skipped for LPs with no recorded reason | reasoned n/a or adapted per gate — the skip is now a decision, not a silence |

## 5. Evidence (real output — no self-reported success)

`node scripts/gate-registry-lint.mjs` against `gates/registry.yaml` @ this branch:

```
gate-registry-lint — 63 gates × 3 classes (commerce, organic, landing) in gates/registry.yaml
  commerce: 18 required · 42 adapted · 3 n_a
  organic: 50 required · 6 adapted · 7 n_a
  landing: 27 required · 21 adapted · 15 n_a

PASS — every gate carries an explicit entry for every class; enums valid; every built/partial ref resolves on disk.
```

`node --test scripts/test/gate-registry-lint.test.js`:

```
✔ control probes pass (the gate is not broken) (3.731584ms)
✔ known-good registry parses cleanly with all fields and applicability kinds (0.225625ms)
✔ unparseable lines are errors, never skipped (0.202125ms)
✔ a registry with no classes line or no gates fails (0.089167ms)
✔ a gate missing one class entry FAILS; the complete gate PASSES (0.215917ms)
✔ core classes can be extended but never shrunk (0.214667ms)
✔ adapted/n_a entries must carry a real how/reason (0.111583ms)
✔ an unknown class key (typo) fails (0.729417ms)
✔ missing required fields and bad enums fail; good values pass (0.262625ms)
✔ duplicate gate ids fail (0.190292ms)
✔ built gate naming a missing artifact fails; existing artifact passes (0.134083ms)
✔ planned gates must say PLANNED; built gates must not (0.151417ms)
✔ pathTokens extracts real paths, ignores placeholders and line suffixes (0.080584ms)
✔ gates/registry.yaml parses clean and passes the lint against the real filesystem (2.624708ms)
ℹ tests 14
ℹ pass 14
ℹ fail 0
```

(The `MODULE_TYPELESS_PACKAGE_JSON` reparse warning is pre-existing repo-wide behaviour for every scripts/test file; not introduced here.)

Full CI-equivalent test discovery (`find packages sites scripts -path '*/test/*.test.js'` → 33 files, after `pnpm install --frozen-lockfile`), 2026-07-18 14:33 IST:

```
ℹ tests 436
ℹ suites 9
ℹ pass 436
ℹ fail 0
ℹ cancelled 0
ℹ skipped 0
```

Nothing existing broke; the 14 new tests are included in the 436.

## 6. OPEN items (flagged, not guessed — CLAUDE.md HARD GATE 6 / evidence law)

- **O1 — `scripts/shopify-catalog-lint.mjs` does not exist.** CLAUDE.md rules (l)/(p) assert a Monday cadence for it, `.claude/agents/catalog-compliance.md` step 1 invokes it, and ten docs reference it — but the file is absent from the repo (verified: `find . -name "*catalog*"` returns only docs/agents). The registry records `catalog-compliance-audit` as `planned` honestly. Needs: build the script (Track B unblocked) or amend the doctrine's cadence claim. Owner call.
- **O2 — "19-gate page suites" is an orphan.** The roadmap and this prompt's own brief name it; `docs/process/MASTER_PIPELINE.md:1639` ruled: no 19-item gate exists (Ship Gate A has 13) — RETIRED. The registry inventories the REAL suites (Ship Gate A + factory spec). The registry itself now supersedes any numbered-list reference: "all gates" = this file.
- **O3 — `tests/ktahv-critical-flows.spec.ts` is an orphaned spec.** CLAUDE.md §TEST SUITE calls it "the deterministic gate", but no runner references it (playwright.config.ts scopes testDir to tests/factory — per docs/process/inventory-existing-rules.md WF-TEST). It guards WordPress-fleet flows (outside this registry's three classes) so it is NOT a registry row; flagged here so the dead-gate finding isn't lost. NOT fixed in this PR (no site-code changes; fixing a gate's runner is its own change).
- **O4 — `run` enum deviation, deliberate.** PROMPT 5 specifies `automated|human`; the registry uses `automated|agent|human`. An LLM-subagent audit is not deterministic automation and this repo's own doctrine (MASTER_PIPELINE §0.5 machine-vs-model; the rubric contract) forbids conflating them. Collapsing `agent` into `automated` would overstate 24 gates' enforcement. Flagged for ratification rather than silently assumed.
- **O5 — organic scope of the YMYL lint.** Whether content-lint's 35 rules widen from whatisayurveda.com to all organic health surfaces is a policy call (cost: per-site rule tuning). The registry marks the gate `partial` with the scope stated; widening is a follow-up PR on Abilash's word.
- **O6 — the checklist GENERATOR is not built yet.** The law (checklists generated from the registry, never hand-written) is in CLAUDE.md v1.10 and the registry row `generated-checklists-filled` is `partial`: until a generator script lands, filled checklists are transcribed from the masters. Natural follow-up: `scripts/gate-checklist-gen.mjs` emitting launches/<domain>/checklist-<class>.md from this registry. Deliberately NOT built in this PR — PROMPT 5 scopes the registry + validation; the generator deserves its own tested change.
- **O7 — STATUS.yaml untouched in this PR, deliberately.** Another session is actively working the main checkout; per §BRIEFS & STATE-TRUTH concurrent-writer safety, this PR avoids clobbering the Fleet Pulse file from a parallel worktree. The session-end update belongs to the coordinating session.

## 7. Checker pass (doctrine f)

Claim vs machine evidence: registry parses + passes its lint (pasted, §5) · 14/14 tests pass (pasted, §5) · CI step added is additive-only (no existing step modified — rule g respected; verified by diff) · matrix rows in §3 emitted by the parser, not hand-copied · every `built/partial` script_or_agent_ref existence-checked by the lint at every future CI run. Unverified by machine: the adapted/n_a REASONS are editorial judgments compiled from the cited doctrine — they are the registry's content, reviewable in this PR, and the lint can only enforce their presence, not their wisdom.
