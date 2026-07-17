# Retro-audit of last night's builds — PROMPT 1 report (17 Jul 2026, ~10:30 IST)

**Housekeeping first:** the plan of record is committed as [docs/plans/2026-07-17-factory-audit-and-launch-roadmap.md](../plans/2026-07-17-factory-audit-and-launch-roadmap.md) (`c03b5bd`), and the single permitted write — the canonical-count log entry — is in [PROJECT_CONTEXT.md](../../PROJECT_CONTEXT.md) §12 (`980da04`). Everything below is report-only; no fixes were executed.

**Scope note:** the wave is four sites. #81 healing.recipes and #84 arogyashala.in merged 16 Jul; #85 kairaliyoga.com and #86 kairalihospitality.com were built 16 Jul and merged this morning (10:03 / 10:13 IST) after CI re-ran. All four are audited.

---

## 1 · Per-site pipeline evidence

Evidence common to all four, then per-site rows.

| Pipeline step | Evidence found | Verdict | Note |
|---|---|---|---|
| Intake & brief | Briefs in docs/site-briefs/ for all four; design-research briefs (PR #83) for arogyashala/yoga/hospitality per D-DESIGN-DIFF; healing.recipes has books brief + legacy mine | **PASS** | Register entries exist for all four in the Register table, annotated with the 16 Jul rulings |
| Entity register locked | All four briefs contain injection/security screening of mined content; rule-6 discipline visible (unverified facts omitted: Q-KH-2008, Q-HR-PHONE, JV ownership) | **PASS** | — |
| Brand & design tokens | All four `globals.css` headers declare "Tokens ONLY (packages/ui/brand-tokens.css)"; brand-lint CI green on every PR | **PASS** | Library-level ramp gaps (Q14: bronze-600/marigold-300 aliases) surfaced as a sub-AA contrast finding on healing.recipes — a `packages/ui` gap, not a site defect |
| Build | 14/14 CI checks SUCCESS on each PR (gate incl. full-history gitleaks; brand-lint job incl. banned-string, CTA-label, content-lint, discovered tests; 6 Vercel deploys) | **PASS** | Clean; no secrets findings |
| Content & localisation | EN-only per register for all four ✓; per-site guard tests ran in CI via the discovered-tests step (hospitality guards 8/8; yoga guards pin IAST + romanized sets; arogyashala guards; healing.recipes books.test.js) | **PASS** | — |
| Compliance gates (Ship Gate) | CI A-gates green, but: **factory-spec (the Playwright browser suite, Ship Gate A2/A4 browser layer) never ran on any of the four** — the matrix at .github/workflows/factory-gate.yml:100 still lists only the four old sites, despite its own comment "Every Factory site adds itself here at scaffold time." Lighthouse (A5) not run for any (known open gap #1). No filled sitewide/pagewise checklists in any of the four `launches/` folders — only arogyakendra has them | **PARTIAL** | CLAUDE.md launch-evidence law: "A launch without its filled checklists in the repo is not a launch." Mitigation: these are preview-ready, not launched — but arogyakendra set the retro-fill-with-honest-pending precedent |
| Subagent audit round (rule n) | Per site: `design-qa-report.md` ✓ + `seo-aeo-geo-report.md` ✓, timestamped, evidence-linked, with real findings; security screening ✓ in briefs; catalog-compliance N/A (no KAPPL surface). **Logger failed:** wiki/log.md's last entry is 16:53 IST 16 Jul — none of the four builds are logged; no LEARNINGS.md retro for any (last entry 14:43 IST) | **PARTIAL** | The two auditors ran exactly as doctrine requires; the wiki/learning layer (Ship Gate §E) was skipped for the whole wave |
| Cross-model audit | **No Codex/GPT-5.5 audit note exists for this wave.** Grep across the repo: the only "codex" mention is today's plan doc. `scripts/audit-gpt.mjs`/`audit-perplexity.mjs` exist and were used 15 Jul (whatisayurveda demand map) but not on these builds. D-DESIGN-DIFF's post-build external-AI comparison (ChatGPT + Perplexity, old vs new side-by-side) also has no evidence of running | **MISSING** | Under the standing triangulation rule this wave sits in the pending-triangulation queue, not "skipped" |
| PR & human review | Four PRs with full evidence bundles, 14/14 green, 1-approval + CODEOWNERS protection in force, merged by Abilash | **PASS** | — |
| Merge | #81 `789b523` · #84 `e1c1651` · #85 `6d1ef5b` · #86 `79f7ec4`, all on main | **PASS** | — |

Per-site design-gate results (B-14, ≥9.0 required): **healing.recipes 9.2** (it.1 8.6 FAIL → it.2, both blockers machine-verified fixed; hero image weight cut 3.3×) · **arogyashala.in 9.1** (first D-DESIGN-DIFF build; its SEO audit caught the fleet-wide `foundingDate: 1908` schema violation → fixed at package level *inside the same PR*, now emits 1989 with the test asserting it) · **kairaliyoga.com 9.2 it.2** (found a genuine upstream Kurale font bug on IAST macrons; shipped a defensible romanized interim, ruling queued) · **kairalihospitality.com 9.4 it.2, fleet's highest** (JV verified as Resort Svatá Kateřina from 2+ independent sources; 29/29 legacy redirects curl-verified).

**Reading:** the build layer is in genuinely good shape — the auditors ran, caught real defects (one fleet-wide), and fixes landed before merge. The misses are all in the *evidence/learning* layer: CI browser matrix, wiki log, retros, checklists, cross-model pass.

---

## 2 · 14-Jul open items — reconciled with evidence

| Item | 14 Jul state | Current state | Evidence |
|---|---|---|---|
| Plugins | 1 of 7 | **CLOSED 14 Jul 13:28 IST** | `~/.claude/plugins/installed_plugins.json`: security-guidance 2.0.6, code-simplifier 1.0.0, commit-commands, skill-creator, frontend-design, superpowers 6.1.1 (+ miro, anthropic-skills), user scope; 13-skill design bundle in `~/.claude/skills` |
| MCP connections | 4 of 7 | **CLOSED as ruled** — the factory's own ruled roster is fully connected | QUESTIONS 14 Jul 15:05/15:35 + live session: playwright ✓ vercel ✓ cloudflare-docs ✓ next-devtools ✓ clarity-ktahv ✓ composio ✓ (+ tavily, gmail, drive, gamma). GitHub MCP **skipped by design** (gh CLI covers it; OAuth DCR-incompatible). Semrush **declined** (₹17k+/mo) → GSC + DataForSEO lane. Firecrawl still the planned Phase-10 swap. Note: the plan's "7" list (Context7, Triple Whale) doesn't match the repo's actual ruled roster — Triple Whale is browser/owner-access by decision, not MCP |
| Branch protection | Blocked (403) | **CLOSED 14 Jul 13:28** — GitHub Team active (6 seats) | Live `gh api` today: required checks gate + brand-lint + factory-spec(arogyakendra), 1 approving review, CODEOWNERS, no force-push/deletes. `enforce_admins=false` **by design** (owner one-click). Two caveats: (a) today's two doc pushes printed "Bypassed rule violations" — admin bypass is real and the agent used it (on Abilash's instruction); (b) the only required factory-spec context is arogyakendra — new sites aren't required checks, same root as the matrix gap |
| gitleaks allowlist | 89 findings, informal | **CLOSED** | .gitleaks.toml: formal rule-scoped allowlists, AND-semantics (path + line must both match), every entry documents its inspected finding, canary-proven that new findings still trip; pinned gitleaks CLI scans full history in gate.yml |
| Track B (Shopify) prerequisites | Not run | **STILL OPEN** | Ambuj's Storefront API token outstanding (gates Wave 1, 20 Jul — he's in active daily contact, not silent); engineer staff account pending. The six doctrine sub-agents are now installed in `.claude/agents/` (15 Jul correction) but none verified working |
| Villa Raag brand tokens | Pending manual delivery | **PARTIAL** | `packages/ui/raag-tokens.css` has existed since 13 Jul 18:18 (built from the Raag Manual 2026 anchors). Still missing: ramp hexes (Q15), web type scale (Q16), and Abilash's final corrected manual — the 14 Jul "updated" file was a marked-up review copy (DECISIONS 17:45 correction; Astha confirmed 15 Jul). villaraag.com visual pass stays gated |
| Cloudflare/Clarity/Semrush | Browser-only | **IMPROVED** | Clarity: dedicated MCP connected + verified with real data; Cloudflare admin granted to director@ (14 Jul); measurement lane ruled 16 Jul: Abilash's logged-in Chrome IS the access (GSC 11 properties, GA4, Ads, Bing verified live) |
| Shipping platform names | Asked 3× | **STILL OPEN** | No answer anywhere in the repo; still blocks KAPPL shipping/policy pages |

**TARIFF_MODE / BOOKING_ROUTE** (named in the plan §4): zero occurrences in this repo — those blockers live in the KTAHV WordPress-track workspace, not kairali-web-factory. Nothing here waits on them.

---

## 3 · Pending questions & parking lot — the full open list, tagged

Source: QUESTIONS.md (append-only, read in full), BACKLOG.md WAITING ON, IDEAS.md. Resolved entries are excluded (they carry their own RESOLVED stamps in-file); what follows is everything still genuinely open.

**needs-Abilash — blocking or near-term:**
1. **Shipping couriers/aggregators** for KAPPL orders (3rd+ ask) — blocks shipping & policy pages.
2. **Q-YOGA-IAST** — Kurale macron ruling: (a) keep romanized-display + IAST-support split (shipped interim) / (b) scoped face-mix probe / (c) fleet-wide display-face change (Brand Manual ch.04 amendment).
3. **Q-YOGA-PRIVATE** — private vs group yoga sessions; the RATES_RECKONER contradicts itself; answer fixes both site copy and the reckoner row.
4. **Q-YOGA-GUESTBOOK** — keep the late Pramod Mahajan's guestbook entry (historical-archive framing) or drop to 2 entries.
5. **Q-KH-JV-NAME** — confirm "Resort Svatá Kateřina" stands in for the dictation ("Swatak Katrina" is guarded to never ship); also the JV's legal form before any ownership claim ships.
6. **Q-KH-2008** — "established 2008 as a subsidiary": true and printable?
7. **Q-KH-PHONE** — does +91 9555156156 return anywhere on kairalihospitality.com?
8. **Q-KH-BRIEF-RULINGS** — ratify or reverse the four it.2 interpretation calls (3-line hero, ivory@88% overline, ivory-outline Enquire pill, H1-as-design-statement).
9. **Q-HR-ARCHIVE** — healing.recipes: add a Chef Retreat 2017 archive section later, or books-only forever?
10. **Q-HR-PHONE** — is +91-9999231117 still live/owned?
11. **Q-KC-DOMAIN** — kairalicent**re**s.com (emails) vs kairalicent**er**s.com (site): which spelling is canonical? *(Not resolved by today's count ruling.)*
12. **Q-KC-PARTNERS** — the 6 partner/franchise-branded centres: owned or partners? Affects presentation + which get full pages.
13. **Q14–Q16** — ink hex + the 10-step ramps (Kairali & Raag) + Raag web type scale. Q14 has live impact: healing.recipes ships sub-AA bronze display text until bronze-600 lands.
14. **Maharaja Suites 1001/1002** — names swapped between Nakshatra guide and old site (re-asked twice).
15. **Q-RATE1–3** — the $927 SUITE anomaly · missing Sanskrit price table vs filename · 18-month validity overlap.
16. **Q-TEA1/2/3/5** — FSSAI "tea" naming ruling · claims-guardrails sign-off · which tea SKUs will exist · Yuvan tea listing. (Franchise Q-FR-MONEY/ROYALTY/CONTACT and equipment Q-EQ-CATALOG/CLAIMS are formally HELD by decisions #59/#60 — reopen only when those tracks resume.)
17. **Physician layer** — head-office doctors unpublished or premise revisit? · "Dr. Priya Devi" status · Gita Ramesh "Editorial Voice" label confirm.
18. Missing source docs: **European Buyer Journey (8-stage)** + **MOA_Matrix_v3_0.xlsx** — not in Drive.
19. **Q-POS-MCB** — what "MCB" stands for (Pavan/Akshar Yadav source).
20. Smaller ratifications still open from 14 Jul: abhilashkr/kairali.ai CI-matrix membership · whyayurveda.* interim target · kairaliproduct.com future (live Shopify property) · kairalipharma.com ownership · domain-sheet "all forward into one" note outdated confirm · Q-KC4 agency name (low) · Q-EQ-CLAIMS.
21. From the plan doc (not in repo QUESTIONS): **Sprint-1 analytics-OS confirmation** — is lead-source trust the binding constraint?

**needs-team:**
22. **Deepu** — the 4 WP tech tasks (asked 14 Jul) cross the 3-day staleness threshold **today**; chase is due (pairs with Vikash's AHV indexing fix).
23. **Vikash** — kairali.com GSC property + AHV 3/125 indexing fix; status was requested "by 17 Jul" → due today.
24. **Ambuj** — Storefront API token (gates Wave 1 from 20 Jul) + registrar-access sheet columns.
25. **Sunaj** — whatisayurveda.org renewal confirm (expires 28 Sep; asked 14 Jul); the wider renewal window list (kairalicenters.com 03-Sep is the live main site); where ktahv.com's existing 301 is configured.
26. **HR** — medical-council registration numbers for all physicians (the single biggest YMYL credibility gap; collect before launch).
27. **Native-speaker/legal** — DE/FR banned-list confirmation (seeds only today) + the French "cure"/German "heilen" locale-aware cure-claims design + per-market regulated-phrase lists.
28. **Satyam** — production webhook URL when ready + consent-field call (store-first Supabase path is live meanwhile).
29. **Ritu/Eeshal** — Eeshal27/kairali.com public repo with paid plugin bundles → private.
30. **Folder owners** (mkt@ktahv / ho.mkt@) — KTAHV New Shoot 2025 + Villa Raag Images folder contents still not shared with director@.
31. **Abhishek + Gaurav Saraswat** — kairalicenters GSC access (Abilash asks directly). Vikash catalog flags: Q-TEA4 (benefit claim in a live SKU title) + Q-TEA6 (₹20 placeholder price live on .com).

**stale-close? (recommend closing, one line each):**
32. Q11 pmset batch — wiki/log 13 Jul records power hardening verified; close.
33. "Sol 5.6" image-model name — superseded by the 14 Jul image-gen roster decision (gpt-image-2); close.
34. kairali.guru course-pricing question — superseded by the Q9 ruling (Training Courses V2 = source); close.
35. Q2 MDX frontmatter convention — the fleet builds TSX pages, not MDX (see AMBER below); close as asked, the real question is the Factory-rule amendment.
36. Q7 "unique"-filler severity split — running unchallenged since 13 Jul; ratify-by-default.
37. Abishek canonical-roster ask — the *count* is resolved today (KAC site = canonical); only per-centre NAP detail for richer centre pages remains, and that can wait for that build.

**Parking lot (IDEAS.md, all enabler-gated, correctly parked):** Kairali's own herb list as content source (Abilash, later-phase) · periodic external-model repo review (enabler: newer model generation) · physician-review pass to flip honest "not yet reviewed" pages (enabler: Dr. Deepu John capacity) · Kerala Towels launch · Ayurveda Academy launch (institute/training family).

---

## 4 · Centres & countries — canonical anchor logged + every claim found

**Logged** (PROJECT_CONTEXT.md §12, committed `980da04`): the KAC website's published figures are canonical for all properties. **Machine-verified today:** kairalicenters.com/locations/ lists **14 centres in 5 countries** (India ×8 — Mehrauli, Sirifort, Gurgaon, Patna, Vadodara, Faridabad, Guwahati, Raipur · Japan ×3 · Mauritius · Czech Republic · Kuwait). The KAC homepage prints **no** aggregate count.

Every count claim across the estate, current value vs canonical — **listed only, nothing edited:**

| Surface | Location | Current claim | vs canonical (14/5) |
|---|---|---|---|
| **kairali.com (shipped, not live)** | layout.tsx:40 · page.tsx:51,181,228,302 · llms.txt route ×3 | "nine countries" ×8, incl. a "Nine Countries" stat tile and machine-readable llms.txt | **WRONG — 8 instances** |
| **arogyakendra.com (LIVE)** | page.tsx:185 hero lede · page.tsx:231 trust tile · llms.txt ×2 | "treatment centres across nine countries" + "Nine Countries" | **WRONG — 4 instances.** Note: the 16 Jul "softening" fixed only the brand-card line ("in India and overseas"); the hero, trust tile, and llms.txt still say nine |
| kairalicenters.com (shipped) | app/lib/centres.ts | Deliberately NO aggregate; 14 verified centres listed individually | **CORRECT by construction** |
| Wave-4 sites (all four) | — | No count claims anywhere | Clean |
| PROJECT_CONTEXT.md §1 | line 12 | "~18 Ayurvedic Centres across 9 countries" | **WRONG (governance doc)** |
| SITE_DESIGN_LOCALE_REGISTER.md | line 26 | "18 centres, 9 countries" | **WRONG (governance doc)** |
| wiki/entities/group.md | line 5 | "18 centres/9 countries" | **WRONG (wiki)** |
| Legacy estate (live sites, mirrored in audits/ + content-mined/) | arogyakendra legacy, kairalitraining, keralatraining, keralaequipments, keralaayurvedainstitute, kairaliayurvedainstitute | "**25 Centers Worldwide**" stat blocks (with 20 Distributors / 700 Staff / 300 Products / 40 Awards) | **WRONG — team-fix lane (Phase A delegation), sites not controlled from this repo** |
| Agency kairali.com draft (reference-only) | docs/group-inputs intake | "24 centres" incl. Hyderabad ×2 | WRONG — reference only, nothing reused without correction |
| Franchise legacy sources | mining notes | 35 / 25 / 13 / "6+19" | WRONG — franchise track HELD anyway |

Propagation happens on Abilash's go. The two shipped-code surfaces (kairali.com, arogyakendra.com — the latter is live) plus the three governance docs are the factory-side fix; the legacy "25 Centers Worldwide" blocks ride the Phase-A delegation fix-lists.

---

## 5 · DataForSEO & image generation — yes/no with evidence

**DataForSEO: YES — wired and already used.** Purchase decided 14 Jul (PR #29, $50 deposit vs Semrush/Ahrefs); credentials live and normalized in `~/.secrets/dataforseo.env` (LEARNINGS 15 Jul 15:41 records the base64-token gotcha and a verified `20000 Ok` API response); a real demand map was pulled 15 Jul for whatisayurveda (GPT-5 audited it; byte-for-byte API responses preserved in `test/fixtures/keyword/`); the S3 keyword gates in factory-gate.yml arm automatically when `docs/keywords/` artifacts land. Not an MCP — env-based API, which is fine for the lane it serves.

**Image generation: DECIDED and keyed, but NO generation pipeline is wired.** The roster was ruled 14 Jul 15:22 (DECISIONS): primary **OpenAI gpt-image-2**, FLUX.2 for pixel-locked edits, Nano Banana 2 fallback, Higgsfield video-only, Midjourney rejected — with prompting guide and C2PA/IPTC metadata law in docs/design/IMAGE_GEN_ROSTER.md. The OpenAI key sits in `~/.secrets/openai.env` (currently used only by the audit scripts). No script, package, or workflow generates images yet; the wave sites shipped on mined/real photography with IMAGE_MANIFEST placeholders. The plan's "no confirmed tool" row is out of date on the *decision*, current on the *integration*.

---

## 6 · GREEN / AMBER / RED

**GREEN**
- All four builds: briefs, register locks, token discipline, security-screened mining, design-critic PASSes (9.1–9.4), design-qa + seo-aeo-geo auditor reports with real teeth, guards in CI, clean merges. The pipeline caught and fixed a fleet-wide structured-data violation (foundingDate) before it shipped.
- 14-Jul infrastructure gaps closed: plugins, ruled MCP roster, branch protection (Team plan), formal gitleaks allowlist.
- The delegation/mailbox reconciliation (16 Jul) is holding — WAITING ON now matches reality, with only Deepu crossing staleness today.
- Canonical centres count is now a locked, machine-verified anchor.

**AMBER**
- **CI matrix drift:** the Playwright factory-spec never ran on any wave site; the required-check set covers arogyakendra only. Lighthouse (A5) still not in CI.
- **Evidence layer skipped for the whole wave:** no wiki/log.md entries, no LEARNINGS retros, no filled sitewide/pagewise checklists in the four launch folders.
- **No cross-model audit for the wave** (and no D-DESIGN-DIFF post-build external comparison evidence) — pending-triangulation, per the standing rule.
- **"Every page is MDX" Factory rule is de-facto abandoned** — every fleet site is TSX pages (only abhilashkr has MDX). Either amend the rule or enforce it; today it's a rule that isn't true.
- Villa Raag: tokens exist, but ramps/type-scale/final manual still gate the flagship's visual pass.
- Admin pushes to main bypass PR review (by design, but the agent now uses that lane too — worth an explicit rule about when it's allowed).

**RED**
- **arogyakendra.com is LIVE with "nine countries" ×4** against a now-canonical 14/5 — including machine-readable llms.txt. kairali.com carries 8 more instances (not yet live). Fix is one delegated pass + one PR, on Abilash's go.
- **Track B still blocked** on the Storefront token with Wave 1 opening 20 Jul — three days out.
- **Physician registration numbers** still uncollected — the biggest YMYL gap on the content engine now producing pages.

**Top 5 process fixes to prevent repeat misses** (not executed — for Abilash's ranking):
1. **Make site scaffolding self-registering:** a gate that fails if `sites/<domain>` exists but is absent from the factory-spec matrix (and, at launch, from the required checks). The matrix comment already promises this; make the promise mechanical — same class as the dead-test lesson.
2. **Make launch evidence mechanical, not remembered:** a `scripts/launch-scaffold.mjs` that creates `launches/<domain>/` with checklist templates + a gate that blocks a site PR when design-qa/seo reports exist but wiki/log + LEARNINGS + checklists don't. The logger sub-agent exists; wire its invocation into the PR ritual.
3. **Put the cross-model pass in the PR template:** a required checklist line "audit-gpt + Perplexity note attached (or pending-triangulation logged)" — the scripts exist; only the ritual is missing.
4. **Locked-fact tokens for counts:** the centres/countries figure should be a `packages/` constant (like `{{REVIEW_PANEL}}`) computed/sourced from one file, never typed into copy — the "never hardcode a rolling number" ruling applied to counts. That makes today's 12-instance drift structurally impossible.
5. **Truth-up the Factory rules:** amend the MDX rule (and any other rule reality has diverged from) via Abilash's sign-off — the repo's most persistent failure class is doctrine whose enforcement or truth lags what's built, and every instance so far (rule q, dead tests, phantom stale items) cost a session to unwind.

---

*Produced by the 17 Jul 2026 retro-audit session (PROMPT 1 of docs/plans/2026-07-17-factory-audit-and-launch-roadmap.md). Prompts 2–5 run in later sessions, in the document's sequence (2 → audit emails → 3 → 5 → 4), after owner review.*
