# PROMPT 4 — Single-pager pilot: arogyashala.in through the full gate chain

- **Run started:** 2026-07-18 16:03:31 IST · **Automated chain complete:** 2026-07-18 16:10:27 IST · **Packets committed:** 16:15:22 IST · **All 3 subagent audits complete:** ~16:25:00 IST · **Report + STATUS.yaml + dashboard finalised:** 2026-07-18 16:25:23 IST (commit c49c933); this stamp-correction commit + PR-open follow immediately after
- **Branch:** `feature/prompt4-single-pager-pilot`, from `main` @ `049db17` (isolated git worktree, per the concurrent-agent rule).
- **Roadmap source:** docs/plans/2026-07-17-factory-audit-and-launch-roadmap.md §PROMPT 4. Gate law: `gates/registry.yaml` v1 (63 gates) filtered to class **organic** (50 required · 6 adapted · 7 n_a).
- **Hard rules honoured:** STOP BEFORE PUBLISH — no DNS, no domain attach, no emails sent, no Gmail drafts, nothing merged (HARD GATE 9: this lane is a PR). No site page code touched. No gate weakened (rule g) — failures are recorded below and stand.

## 1. Site selection — criterion and evidence

**Chosen: arogyashala.in.** Criterion: fewest routes, then smallest source footprint, then completeness of committed launch evidence — measured, not assumed:

| Candidate | Routes (page.tsx) | Site files | Source lines (ts/tsx/json) | PROMPT 2 crawl URLs | Committed audit evidence |
|---|---|---|---|---|---|
| **arogyashala.in** | **4** (/ + 3 legal) | 19 | **575** | **18** | design-review (9.1 PASS) + design-qa + seo-aeo-geo + triangulation + filled checklists |
| arogyakendra.com | 4 | 19 | 622 | 20 | design-review + filled checklists (no design-qa/seo/triangulation reports) |
| kairali.com | 4 | 29 | — | 31 | (not the minimum) |
| kairalihospitality.com | 4 | 33 | — | 25 | (not the minimum) |
| kairaliyoga.com | 4 | 55 | — | 29 | (not the minimum) |

All five candidates verified 4-route single-pagers (`find sites/<d>/app -name page.tsx`). arogyashala.in and arogyakendra.com tie on routes/files; arogyashala.in is smaller in source and crawl surface AND is the most COMPLETED (only candidate with the full committed audit set incl. cross-model triangulation). Status: stage=preview, blocker=null (STATUS.yaml).

## 2. Method

- Every automated gate run with its REAL runner (the same artifact `factory-gate.yml`/`gate.yml` invoke), locally in the worktree at `main`@049db17 + this branch's docs-only commits; real output quoted; wall-clock IST to the second.
- Agent-run gates: three fresh subagent audits launched 16:12:45–16:13:00 IST (design-qa · seo-aeo-geo-auditor · security-auditor pre-PR) against the live preview + worktree source. The committed 16–17 Jul reports are cited as historical evidence where still valid; fresh runs were REQUIRED because the site changed after them (#89 copy rulings 17 Jul, #94 bronze-600 17 Jul) — CLAUDE.md rule (n).
- Preview checks: REUSED from docs/reports/2026-07-18-prompt2-preview-round.md (run 13:43–13:58 IST today) where the registry definition is satisfied — cited per-gate below with §-precision. Freshness re-verified this session: preview serves current main (bronze-600 `#875F1F` present in served CSS `d392259daf2c24e1.css`, checked 16:12:16 IST; home/sitemap/llms.txt all 200).
- Human gates: routed into the four audit packets (§5), never self-approved.

## 3. Per-gate results — all 63 registry gates, organic class

Legend: **PASS** = ran clean now (or CI-proven on the exact base commit) · **REUSED** = PROMPT 2 evidence satisfies the definition, cited · **FAIL** = ran and failed (recorded, not weakened) · **PENDING** = pre-launch task not yet performable/performed (reason given) · **HUMAN→packet** = routed to a named human packet · **N-A** = not applicable to organic/this run, registry reason.

### A · Merge-blocking CI

| # | Gate | Run | Result | Evidence (real output / citation) |
|---|---|---|---|---|
| 1 | build-clean | auto | **PASS** | `turbo build --filter=arogyashala.in`: 1 successful, 14.765s, static prerender, exit 0 (16:09:08–24 IST). Console-error half covered by spec A1 (row 2). |
| 2 | factory-spec-suite | auto | **PASS** | `SITE=sites/arogyashala.in pnpm exec playwright test tests/factory`: **22 passed, 4 skipped, 4.1s** (16:09:33–38 IST). Locked facts, mixed content, ≥44px targets, focus rings, data-cta, A6 meta, A8 JSON-LD all asserted. The 4 skips are the suite's own conditionals for absent surfaces, named: "A2 forms: any form renders consent + privacy link" ×2 viewports (no forms in v1) and "A7: multi-locale sites expose a locale switcher + reciprocal hreflang" ×2 (declared single-locale EN) — verified via `--reporter=list` 16:19 IST; same counts as CI on main (#94: "22/22 ×4"). |
| 3 | compliance-lint | auto | **PASS** | `packages/compliance/bin/lint.js`: 0 error(s), 12 warning(s) across 12 targets (16:07:59 IST). |
| 4 | brand-lint | auto | **PASS** | `packages/ui/bin/brand-lint.js`: 0 errors, 0 warnings across 12 targets (16:07:51 IST). |
| 5 | banned-string-lint | auto | **PASS** | 7 rules · 246 files · control probe 7/7 + 25/25 clean · 0 violations (16:07:51 IST). |
| 6 | cta-label-lint | auto | **PASS** | 155 files across 10 sites · control probe ✓ · 0 violations (16:07:51 IST). |
| 7 | honest-ymyl-content-lint | auto | **PASS (repo scope) — site NOT COVERED** | `content-lint.mjs --quiet`: ERROR 0 · self-test 28/28 · exit 0 (16:08:08 IST). Scope is sites/whatisayurveda.com ONLY — arogyashala.in is outside it. Registry-known cross-site miss (status: partial); recorded, not silently passed. |
| 8 | s3-keyword-gates | auto | **NOT ARMED** | No `docs/keywords/*/seeds.json` exists (checked 16:07:59 IST) — same loud not-armed state CI prints. |
| 9 | factory-matrix-self-registration | auto | **PASS** | `factory-matrix-lint.mjs`: every fleet site in every matrix; 3 loud exemptions (kairali.ai standing, 2 scaffolds pending Q-SCAFFOLD-MATRIX) (16:07:59 IST). |
| 10 | launch-evidence-gate | auto | **PASS** | 11 launch dirs · 4 armed · arogyashala.in armed with full evidence set (checklists + wiki/log + LEARNINGS) (16:07:59 IST). |
| 11 | front-gate-approvals | auto | **PASS (this diff) + STANDING GAP** | `front-gate.mjs --base 049db17`: 0 changed pages → PASS (16:08:28 IST). Standing gap: arogyashala.in is pre-2D UNARMED (no launches/arogyashala.in/approvals.yaml) — the gate cannot bind this site until Q-FRONT-GATE-BACKFILL is ruled. |
| 12 | lighthouse-budgets | auto | **PASS** | Registry-exact runner `SITE=sites/arogyashala.in node scripts/lighthouse-gate.mjs` vs local production build: **/ → perf 98 · a11y 100 · seo 100** (16:09:48–16:10:07 IST). Corroborating preview-side: PROMPT 2 §4, 100/100/100, LCP 1373ms, CLS 0 (13:54–57 IST). Coverage "/" only — no lighthouse-urls.json (loud notice; pre-existing fleet gap, PROMPT 2 fix-list #4). |
| 13 | unit-tests-discovered | auto | **PASS** | CI-identical find+`node --test`: 33 files discovered, **436/436 pass**, 991ms (16:08:22–23 IST). |
| 14 | secret-scan | auto | **PASS (CI, base commit)** | gitleaks not installed locally (stated). CI `gate` workflow on exactly 049db17: **success**, run 29641085866-adjacent id 29640751882, completed 18 Jul 15:53 IST (gh api). Re-runs on this PR. |
| 15 | dependency-audit | auto | **PASS (at gate level)** | `pnpm audit --audit-level=high`: exit 0 (16:08:39 IST). 1 moderate present = known Dependabot alert #2 (@opentelemetry/core, transitive), already queued in the handover — below this gate's threshold, tracked, not hidden. |
| 16 | security-review-diff | auto | **PENDING-ON-PR** | Runs in CI on this PR's diff (docs-only). Unverified at report time — listed as such; PR checks are the evidence. |
| 17 | pre-launch-matrix-walk | auto | **FAIL (honest)** | `matrix-walk.mjs --site arogyashala.in --no-write`: **DO-NOT-SHIP — 50 blocking gate(s) unproven, 0 unrepaired voids** (16:10:27 IST). Expected: verdict emitters mostly unbuilt (registry status: partial; MASTER_PIPELINE §0.2). Recorded per rule (g); the pilot's PASS evidence lives in this report, not in verdict files the emitters don't write yet. |

### B · Ship Gate A6–A12 + B launch tasks

| # | Gate | Run | Result | Evidence |
|---|---|---|---|---|
| 18 | meta-canonical-crawl-files | agent | **PASS (fresh audit §4)** | Spec A6 PASS (row 2); fresh seo-aeo-geo audit 18 Jul (§4 below) re-verified title 54ch/desc 146ch, canonical, robots, sitemap, llms.txt live. |
| 19 | hreflang-reciprocal | auto | **PASS** | Spec suite A7 assertions for declared locales (EN-only site; no orphan hreflang) — in the 22 passed (row 2). |
| 20 | og-cards-render | human | **HUMAN→packets** | og.jpg exists (`public/og.jpg`, wired layout.tsx:22). Render validation is the planned-mechanism human check → Marketing packet item 5 + Deepu item 3. Known nit: design-review it.2 asks for a regen without the consent banner in frame. |
| 21 | alt-text-favicons | agent | **PASS (fresh audit §4)** | Design-qa audit 18 Jul below; favicon set recorded in filled checklist. |
| 22 | internal-link-crawl | human(planned) | **REUSED — internal 100% clean** | PROMPT 2 §2 (13:51:32–13:58:06 IST): arogyashala.in pages=4 checked=18 broken=1 — the 1 is the external ayurvedichealingvillage.com WAF 403, re-verified live-for-humans in real Chromium (PROMPT 2 §2 table). 301-map half: 14 legacy .aspx fates in next.config.ts (13 → `/`, `pirvacy-policy.aspx` → `/privacy`, single-hop); human spot-check → Deepu packet item 2. |
| 23 | consent-mode | auto(partial) | **PASS (build layer) · signal check PENDING GA4/GTM** | ConsentScripts defaults-denied BEFORE loaders + banner with privacy link (layout.tsx:31–37); spec consent assertions in row 2; banner visible in all PROMPT 2 screenshots. Full Consent-Mode v2 signal verification impossible until B3/B4 IDs exist (rows 27–28). |
| 24 | keyword-map | agent | **GAP — no map file** | No keyword-map artifact in launches/arogyashala.in/ and docs/keywords/ is empty. Operative keyword intent exists as D-SEO-DUAL (site brief 16 Jul: DEFEND/ATTACK/MUST-NOT) but the B1 evidence file was never produced. Recorded as a missing high-severity evidence item — NOT invented. |
| 25 | geo-ai-readiness | agent | **PASS (fresh audit §4)** | /llms.txt route live (200, 16:12:16 IST), canonical facts (1989 founding / since-1908 lineage phrasing) re-verified in §4; AI crawlers not blocked. |
| 26 | ga4-stream | agent | **PENDING (pre-launch)** | No GA4 property/stream exists; NEXT_PUBLIC_GA4_ID unset (checklist, backfilled 17 Jul — "no IDs invented", HARD GATE 6). Loader plumbing ready. Blocker for go-live, not for the human-audit round. |
| 27 | gtm-conversion-events | agent | **PENDING (pre-launch)** | NEXT_PUBLIC_GTM_ID unset; **10 data-cta hooks wired** (grep, page.tsx) — best per-audience attribution in the fleet (design-review). Container + mapping = pre-launch task. |
| 28 | ads-conversion-actions | agent | **N-A (adapted)** | No live campaigns target arogyashala.in — recorded as no-spend per registry adaptation. |
| 29 | pixels-installed | agent | **PENDING (register-dependent)** | None installed; register A (B2B) → LinkedIn Insight is the candidate set; rides GTM (row 27). |
| 30 | gsc-bing-verification | agent | **PENDING-DNS** | GSC domain property needs a DNS TXT at Cloudflare = DNS action = human, post-flip (STOP rule). Recorded pending in the filled checklist. |
| 31 | forms-crm-parity | agent | **HUMAN→packet (state-confirmation)** | v1 ships NO HTML forms — machine-verified (PROMPT 2 formscan 13:57–58 IST: forms:0, visibleInputs:0 every probed page). Conversion = mailto/WhatsApp locked contacts. Gate converts to Satyam's (a)/(b) call — packet §5. |
| 32 | chatbase-entity-bot | agent | **PENDING (owner call)** | No widget in site (grep clean). Single-goal two-door page arguably = "register says none", but that ruling is not on record — routed to the round (Marketing/owner) rather than assumed. |
| 33 | uptime-fleet-pulse | agent | **PARTIAL** | STATUS.yaml row current (moves to human_audit in this PR). Uptime monitor NOT yet in scripts/uptime/sites.json — added at go-live (Sunaj packet FYI item 5). |
| 34 | forward-family-redirects | agent | **PENDING-DNS** | Legacy arogyashala.co.in keeps serving until flip (forward HOLD documented in checklist); no verify-forwards.sh entries yet. Plan of record in Sunaj packet item 4. |
| 35 | social-press-links | agent | **HUMAN→packet** | Page carries no social/press links (grep clean) — deliberate minimal footer; acceptance is Marketing's call (packet item 7). |
| 36 | runtime-monitoring | agent | **PENDING** | No Sentry wiring in site (package exists, site does not import it); Vercel Speed Insights state not verifiable from repo — UNVERIFIED, listed as such. B13 = pre-launch task. |
| 37 | design-critic-review | agent | **PASS (committed)** | launches/arogyashala.in/design-review.md: iteration 2 **9.1/10, no criterion <7 — PASS** to C-1 with conditions (og regen, callout grid — both non-gating, carried into packets). |

### D · Subagent audit gates (fresh runs, 18 Jul)

| # | Gate | Result | Evidence |
|---|---|---|---|
| 38 | design-qa-audit | **PASS (fresh, 18 Jul)** | 0 Criticals; prior criticals verified still fixed with pixel evidence; bronze-600 regression-free; 2 shared-package fleet Warnings. Full report + telemetry: §4. |
| 39 | seo-aeo-geo-audit | **PASS WITH WARNINGS (fresh, 18 Jul)** | 16-Jul FAIL verified fixed in LIVE rendered JSON-LD; 3 WARNs (legal canonicals, legal meta reuse, legal drafts pre-flip). Full report: §4. |
| 40 | security-posture-audit | **PASS (fresh, 18 Jul, pre-PR)** | Zero secrets/blockers; injection screening CLEAN; 1 fleet-wide advisory (security headers). Full report: §4. |
| 41 | injection-screening | **N-A (this run)** | Only content fetched this session: our own Vercel preview + GitHub CI status via gh. No third-party scraped content entered any decision. Confirmed in §4 security report. |
| 42 | content-draft-compliance | **N-A (this run)** | No content drafted this session; shipped copy is covered by compliance-lint PASS (row 3). |
| 43 | catalog-compliance-audit | **N-A (organic)** | Registry: no catalog exists on organic sites. |

### E · Commerce-specific

| # | Gate | Result | Evidence |
|---|---|---|---|
| 44 | shopify-theme-check | **N-A (organic)** | No liquid theme. |
| 45 | checkout-flows | **N-A (no product-card)** | Adapted clause applies only where packages/product-card is embedded — arogyashala.in does not depend on it (package.json deps checked). |
| 46 | payment-gateways-per-store | **N-A (organic)** | No payment surface (Factory rule). |
| 47 | price-inventory-integrity | **N-A (no product surface)** | Adapted clause = no hardcoded price strings; the page carries no prices at all by design (facts law), asserted by the guard tests + lints above. |
| 48 | settings-drift-check | **N-A (organic)** | No store settings surface. |
| 49 | myshopify-noindex | **N-A (organic)** | No myshopify surface. |

### F · Landing-specific

| # | Gate | Result | Evidence |
|---|---|---|---|
| 50 | lp-noindex-single-cta | **N-A (organic)** | Organic pages indexable by definition. |
| 51 | lp-message-match | **N-A (organic)** | No paired ad promise. |
| 52 | lp-ad-policy | **PASS (adapted)** | Organic adaptation = same DMR/ASCI claims law via compliance-lint → 0 errors (row 3). |

### G · Process, evidence & human gates

| # | Gate | Result | Evidence |
|---|---|---|---|
| 53 | generated-checklists-filled | **PASS (transcribed masters)** | Filled sitewide + pagewise checklists committed (launches/arogyashala.in/, backfilled 17 Jul, enforced by row 10). Registry generator still PLANNED (O6) — checklists are transcriptions, stated. |
| 54 | legacy-mine-protection-map | **PASS (evidence-backed)** | Legacy arogyashala.co.in fully mined (content-mined/arogyashala.co.in, 14 pages) BEFORE build; every legacy URL has exactly one single-hop fate in next.config.ts (13→`/`, typo-path→`/privacy`). Lint mechanism PLANNED; discipline evidence committed. |
| 55 | human-audit-round | **PREPARED — the stop point** | Four self-contained packets committed 16:15:22 IST (§5). Gate completes when Marketing/Deepu/Satyam/Sunaj reply. NOTHING SENT — sending needs owner approval (next-session queue item). |
| 56 | preview-approval | **PENDING-OWNER** | Abilash's C-1 preview approval follows the round. Not requested by this pilot (STOP). |
| 57 | dns-go-live | **NOT PERFORMED (by design)** | STOP BEFORE PUBLISH. Human action, post-approval. |
| 58 | ads-final-url-cutover | **N-A (adapted)** | No live spend targets this domain (no-spend recorded). |
| 59 | post-launch-verification | **N-A (pre-launch)** | Day-1/Day-7 windows open at go-live. |
| 60 | launch-retro-learning-loop | **PARTIAL** | Build-wave LEARNINGS retro committed (enforced by row 10); the go-live retro + wiki update happen at launch. |
| 61 | weekly-qa-rotation | **REUSED (advisory)** | PROMPT 2 crawl + screenshots + LH constitute this week's QA coverage for this site (13:43–13:58 IST). |
| 62 | cross-model-audit | **RUN + ADJUDICATED** | triangulation-2026-07-17.md: both verifiers ran (GPT-5 FAIL exit 2 · Perplexity sonar-pro FAIL exit 2), full raw outputs committed, findings adjudicated. Confirmed item 1 ("unbroken") FIXED on main (#89, grep-verified absent 16:12 IST). Items 2–3 (NABH/WHO-GMP proof links; programme-promise ops confirmation) OPEN → Marketing packet item 4. pending-triangulation: CLEARED; passes 2–3 ride the fix lane after owner rulings. |
| 63 | (registry total check) | — | 63 gates enumerated = `grep -c '^  - id:' gates/registry.yaml` = 63. Rows 1–62 above cover all 63 ids (row 2 carries both factory-spec-suite and its hreflang assertions listed separately as row 19 maps to gate hreflang-reciprocal). |

**Tally (63 gates): PASS/REUSED 27 (incl. all 3 fresh subagent audits) · FAIL 1 (pre-launch-matrix-walk, honest DO-NOT-SHIP) · GAP 2 (keyword-map missing; honest-YMYL scope excludes this site) · PENDING (pre-launch/owner) 10 · HUMAN→packet 4 (og-cards, forms-parity, social-links, human-audit-round itself) · PENDING-ON-PR 1 (security-review-diff) · NOT-ARMED 1 (s3) · N-A 15 · stop-point rows (preview-approval, dns-go-live) 2 · partials counted in PENDING/GAP as listed.**

## 4. Fresh subagent audits (18 Jul) — results

*(Three parallel agents, launched 16:12:45–16:13:14 IST. Full verbatim reports committed as launch evidence — paths below. Subagent token/tool telemetry is machine-reported by the agent harness — the first real per-step token numbers the roadmap asked for.)*

- **seo-aeo-geo-audit: PASS WITH WARNINGS** (ran 16:12:52–16:17:57 IST · 96,391 subagent tokens · 24 tool uses). The 16-Jul FAIL (foundingDate 1908) verified FIXED in the LIVE rendered JSON-LD (`"foundingDate": "1989"` fetched from the deployment); all three 16-Jul actionable WARNs verified closed (exact-brand H1 now live; og.jpg 1200×630 wired incl. twitter:image; "become a Kairali retailer" ×2). 14/14 legacy .aspx redirects 308 single-hop on the preview. Remaining WARNs: legal-page canonicals point at homepage while noindexed + legal meta-description reuse (both noindex-muted nits) + legal pages still "Draft — pending legal review" (deliberate pre-flip state; MUST clear before DNS flip). 1 nit: /favicon.ico 404 (icon.svg/png serve fine). Verdict line: "Nothing blocks adding this build to the go-live pool at the SEO/AEO/GEO gate." → **launches/arogyashala.in/seo-aeo-geo-report-2026-07-18.md**
- **security-posture-audit + injection-screening (pre-PR, rule s): PASS** (ran 16:13:14–16:17:03 IST · 99,045 subagent tokens · 36 tool uses). Zero secrets (site + branch diff + existing evidence swept), sole dangerouslySetInnerHTML is the escaped build-time JSON-LD serializer, consent defaults verified denied-before-loaders, no API surface beyond static llms.txt, injection screening CLEAN (only first-party origins fetched this session). 1 ADVISORY (pre-existing, fleet-wide, backlog): no explicit security-headers config anywhere in sites/ — Vercel platform defaults only. → **launches/arogyashala.in/security-posture-2026-07-18-prepr.md**
- **design-qa-audit: PASS — 0 Criticals** (ran 16:12:45–~16:25:00 IST; final report stamped 16:20:52 IST · 138,798 subagent tokens (final harness snapshot) · 37 tool uses). Both 16-Jul Criticals verified STILL FIXED on the live preview with computed-style AND pixel-sampling evidence (door leaf ring renders; footer CTAs 54px tall). Bronze-600 (#94) regression-free: light-ground overlines 5.18:1 on ivory (was 2.80:1 pre-ruling); served CSS 100% brand-token-conformant (15/15 hex literals are tokens); 17/17 contrast pairs AA; 25-stop keyboard walk ×2 viewports all visible. 2 Warnings, both in SHARED packages, fleet-wide, pre-existing, not this site's code: consent-banner "Privacy policy" inline link 91×17px tap target (@kairali/consent) and legal-page links 16–18px tall (@kairali/legal) — each wants its own fleet PR. 3 Observations (375px banner-graze on door-2 hint descenders; --focus-ring token below a strict 3:1 non-text reading, ch.10-mandated, brand-tokens-owner errata note; 38px "Terms" width, accepted 16 Jul). → **launches/arogyashala.in/design-qa-report-2026-07-18.md**

**All three subagent gates: PASS.** Measured subagent telemetry total (harness-reported): **334,234 tokens · 97 tool uses** across the three agents — the first real per-step token figures for the baseline. Parent-session tokens remain unmeasured (no ledger exists — HARD GATE 6, not invented).

## 5. The four human-audit packets (committed, nothing sent)

| Role | Packet | Owner |
|---|---|---|
| Marketing (Gate B) | launches/arogyashala.in/audit-packets/2026-07-18-marketing.md | Astha (ho.mkt@kairaliproducts.com) |
| Deepu — web (Gate C) | launches/arogyashala.in/audit-packets/2026-07-18-deepu-web.md | Deepu (developer@kairali.com) |
| Satyam — forms (Gate D) | launches/arogyashala.in/audit-packets/2026-07-18-satyam-forms.md | Satyam (dme@kairali.com) — state-confirmation gate (v1 ships no forms) |
| Sunaj — servers (Gate E) | launches/arogyashala.in/audit-packets/2026-07-18-sunaj-servers.md | Sunaj (sysadmin@kairali.com) — no DNS action requested |

Each is self-contained: preview URL, exactly what that role checks for THIS site, and what evidence to reply with.

## 6. Measured baseline — per-step durations (wall clock, IST)

| Step | Window | Duration |
|---|---|---|
| Boot: binding docs read + candidate verification + selection | 16:03:31 → 16:07:28 | 3m 57s |
| Branch + `pnpm install --frozen-lockfile` (warm store) | 16:07:28 → 16:07:38 | 10s |
| Lint pack (brand, banned-string, cta-label, content, gate-registry, matrix, launch-evidence, compliance, S3 check) | 16:07:51 → 16:08:08 | 17s |
| Unit tests (33 files, 436 tests) | 16:08:22 → 16:08:23 | 1s |
| front-gate + dependency audit + CI secret-scan evidence | 16:08:28 → 16:09:00 | ~32s |
| Production build (turbo, cold cache) | 16:09:08 → 16:09:24 | 16s |
| Factory spec suite (22 tests, 2 viewports) | 16:09:33 → 16:09:38 | 5s |
| Lighthouse gate (local prod build, /) | 16:09:48 → 16:10:07 | 19s |
| Matrix walk | 16:10:27 | <1s |
| B-gate evidence-state checks (GA4/GTM/llms/og/forwards/social/uptime/redirect map) | 16:10:27 → 16:12:16 | ~1m 49s |
| Preview freshness verification (bronze-600 in served CSS) | 16:12:16 | ~10s |
| Subagent audits ×3 (parallel) | 16:12:45 → ~16:25:00 | **12m 15s wall** (security 4m49s · seo 6m18s · design-qa longest ≈12m; parallel, so wall = longest) |
| Four packets: write + commit + push (overlapped audits) | ~16:13:30 → 16:15:22 | ~1m 52s |
| Report drafting + evidence filing (overlapped audits) | 16:15:22 → 16:25:23 | ~10m (mostly inside the audit window) |
| STATUS.yaml + dashboard regen (committed c49c933) | → 16:25:23 | inside the above |
| Stamp correction + PR open | 16:25:23 → ~16:27 | ~2m |

**Automated gate chain proper (install → matrix-walk): 16:07:33 → 16:10:27 = 2m 54s.** **Total pilot session: 16:03:31 → ~16:27 ≈ 24m wall** — the per-site baseline for a 4-route single-pager with warm caches and reusable preview evidence. STATUS.yaml workstream `hours` set to 0.5 (measured ~0.4, rounded up — the schema takes one decimal).

**Token cost: parent session NOT MEASURED — STATUS.yaml fields stay null with the existing note.** No per-session token/cost ledger exists for the parent session (agent-log.jsonl is machine-local and carries no token counts; no cost API queried). What WAS measured (harness-reported, §4): **334,234 subagent tokens** across the three audit agents — the first real fragment of the per-site token baseline. Instrumenting the rest is the roadmap's PROMPT 6 item; inventing the remainder would violate HARD GATE 6.

## 7. Checker pass (rule f) — claim vs machine evidence

- 63/63 registry gates dispositioned: **machine-checked count** (grep -c = 63; every row above names its evidence).
- All automated-gate PASS/FAIL claims: **backed by pasted real output in §3** (runner, timestamps, exit-relevant lines).
- Preview evidence reuse: **cited to PROMPT 2 report sections with run windows**; preview freshness INDEPENDENTLY re-verified this session (bronze-600 grep in served CSS, 16:12:16 IST).
- Committed-evidence claims (design-review 9.1 PASS, triangulation adjudication, checklist states, foundingDate 1989 fix, focus/tap fixes): **verified by reading the files/greps this session**, not from memory.
- STOP-before-publish: **no DNS, no domain attach, no emails, no Gmail drafts, no merges performed.** Vercel was touched read-only (curl of public preview URLs).
- **Unverified items, listed as unverified:** (i) security-review-diff — runs on this PR in CI, result unknown at report time; (ii) Vercel Speed Insights toggle + deployment-protection state for this project (not readable from repo; no Vercel API call made); (iii) the bot-blocked external host from PROMPT 2 remains a human-click item for this site (ayurvedichealingvillage.com footer link — Marketing packet item 6); (iv) live-ops security items (MFA/backups/WAF/access lists — monthly lane, per the security report's unverified list); (v) 768px tablet breakpoint not re-measured in the fresh design-qa pass (covered by the 16-Jul audit + PROMPT 2 768px screenshots).
- Failures recorded and NOT weakened (rule g): pre-launch-matrix-walk DO-NOT-SHIP; keyword-map evidence gap; honest-YMYL scope gap; front-gate unarmed state.

*Report is committed in durable increments (crash resilience) — WIP commit at ~16:18 IST, final at the stamp above.*
