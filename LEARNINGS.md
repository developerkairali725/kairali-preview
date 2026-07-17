# LEARNINGS.md — append-only launch retros (Ship Gate §E)

**Rule: a 15-minute retro after EVERY launch — what broke, what was manual,
what becomes package/checklist code. Anything appearing twice gets a PR into
packages/* or the checklist within the same week. Agents read this file
before every new site build.**

---

## 2026-07-14 11:48:04 IST — arogyakendra.com v1/v2 retro (launched 13 Jul; retro overdue by one day — SPRINT_STATE gap #10)

### What broke (and the general lesson)

1. **A human 9.2/10 design review missed two hard accessibility failures.**
   The v2 header pill was 40px (`--control-md`) and the footer contact CTAs
   were 16px inline links — both under the 44px touch-target law (Ship Gate
   A4). Found 14 Jul by the new machine gates, not by the careful two-
   iteration human review. **Lesson: checklist items that a machine can
   measure MUST be machine gates; human review is for what machines can't
   score.** (Fixed: brand lint + tests/factory now merge-blocking.)
2. **Selector specificity leaked a desktop CTA onto mobile** (`.btn` display
   rule overrode `.header-cta{display:none}`) — caught only because review
   started at 375px. **Lesson: mobile-first review order is not a preference,
   it's where the bugs are.** (Now in ENGINEERING_STANDARDS; factory spec
   runs a 375px project first.)
3. **Floating UI collides**: Chatbase bubble sat on the sticky bar's email
   button (fixed with a bottom offset), and on 14 Jul the same bubble
   overlapped the new consent banner's text edge on first visit (cosmetic,
   unfixed). **Lesson: every floating element added to a layout must know
   about the others. Candidate: a packages/ui "floating stack" slot manager
   before Wave 1 multiplies the problem by 8 sites.**

### What was manual that is now package code (closed 14 Jul)

4. Meta/canonical/OG/robots/sitemap were HAND-ROLLED in layout.tsx —
   extracted to **@kairali/seo** with the A6 limits as build-time THROWS.
   llms.txt was entirely missing at launch despite checklist A6; the launch
   checklists were filled honestly but nobody nagged — **a checklist item
   without a machine gate silently rots.**
5. JSON-LD was a hand-built object literal — extracted to **@kairali/schema**;
   locked facts (email/1908/slogan) now come from @kairali/compliance/rules,
   one source of truth instead of copies per site.
6. Consent + analytics did not exist at launch (A12 gap) — **@kairali/consent
   + @kairali/analytics** built 14 Jul: Consent Mode v2 default-denied,
   data-cta delegation queues events before measurement IDs exist.
   **Lesson confirmed: "code first with env-var IDs" decouples the build lane
   from the access lane (Vikash handover still pending).**

### What stays open (honest gaps, tracked in BACKLOG)

7. OG image + favicons still absent — no real 1200×630 asset; fabrication is
   banned. Image library (798 described images) landed 14 Jul → swap task is
   NOW-queued. Logo SVGs still gated on Q17.
8. /privacy + /terms pages don't exist (A12 second half) — the banner ships
   without a privacy link so the gap stays VISIBLE, not papered over.
9. Lighthouse budgets (A5) and /security-review (A-13) still not in CI —
   gated on preview-URL wiring + ANTHROPIC_API_KEY secret.

### Process learnings

10. Retro-filling checklists AFTER launch worked but this retro itself was a
    day late — §E says same-day. **The learning loop only runs if the retro
    is part of the launch definition-of-done, not a follow-up task.**
11. Placeholder-first imagery (described placeholder + IMAGE_MANIFEST row)
    let the site ship without waiting on photography and made the swap list
    mechanical — keep for every Wave-1 site.

## 2026-07-14 21:35:00 IST — rates-ingestion retro (mid-sprint, workflow #3)
1. **Extract→verify→merge with forced PDF re-reads WORKS**: the verification stage caught 2 real transcription errors (a diacritic, a dash) by re-reading the exact PDF pages before merge. Pattern is now standard for any document ingestion.
2. **PROCESS BREACH (benign content, wrong lane): a workflow subagent pushed docs directly to origin/main** — and the orchestrator had done the same minutes earlier (MORNING_BRIEF). Content was docs-only and CI came back green, but direct pushes bypass the CI gate at review time. RULE HARDENED: every main-bound change goes via PR — docs included, agents included, orchestrator included; workflow prompts must say "commit to the current branch; NEVER push to main." (Also: admin bypass-merge remains only for green-checked PRs per the standing rule.)
3. Only a 10-price sample per file is PDF-verified; the rest mirrors transcription. Acceptable for a reckoner with FLAGS; any price that reaches a LIVE page gets pointwise re-verification at build time (rule 6).

## 2026-07-14 22:45:00 IST — A12 privacy/terms gap CLOSED fleet-wide (recurring-finding graduation)
- The missing /privacy page was flagged by the B-14 design critic on arogyakendra, kairali.com AND whatisayurveda — three strikes. Per the twice-rule it graduated to shared package code: **@kairali/legal** exports PrivacyPolicy/TermsOfService/CookiePolicy components parameterized by site.config (domain/entity/siteName); each site adds 3 thin noindex routes + passes privacyHref="/privacy" to ConsentBanner. One build, every current AND future site gets launch-complete consent + legal pages.
- Policy TEXT is an honest DRAFT grounded in the sites' ACTUAL data practices (Consent Mode v2 default-denied, GA4 only post-consent, forms→CRM with consent field, no data sale, DPDP+GDPR rights) — marked "pending legal review", must be reviewed by counsel before production. This is legitimate: describing what we genuinely do, not inventing claims.
- LESSON: a launch-checklist item (A12) that three sites shipped without is exactly the signal to build it into the factory, not to keep re-flagging it. New sites now inherit legal pages by adding the dep + 3 routes.

## 2026-07-15 15:41:04 IST — DataForSEO credential shape + live ( balance)
- **Gotcha:** the DataForSEO API-access page shows a ready-made `Authorization: Basic <base64>` token AND example code; a user copying "the key" often grabs the **base64 blob** (base64 of `login:password`), not the plain password. Stored as `DATAFORSEO_PASSWORD` it 40100s. **Detect:** `base64 -d` the value — if it decodes to `email:password` (contains `@` and `:`), it's the token; decode + split into `DATAFORSEO_LOGIN`/`DATAFORSEO_PASSWORD`. Now normalized in ~/.secrets/dataforseo.env; `curl -u login:password` → 20000 Ok.
- **Helper:** `scripts/dfs.sh <endpoint> '<json>'` does the authed POST (reads env, never echoes creds).
- **Cost seen:** google_ads/search_volume/live ≈ $0.011/keyword ($0.09 per ~85-kw call). $51 ⇒ ~4,600 kw of volume lookups. Be deliberate; don't spray from parallel agents.
- **Demand headline (US+India):** herbs cluster 2.57M/mo dominates → whatisayurveda build order starts with ingredient monographs. ("ojas" 1.5M India = brand noise, discount.)

## 2026-07-15 17:40:04 IST — the external auditor caught what self-review did not (first run, real bug)
**What happened:** I pulled a DataForSEO demand map and told Abilash "herbs = 2.57M/mo, build herbs first", intending it as the basis for a ~3,400-page content architecture. GPT-5 (`scripts/audit-gpt.mjs`) audited it and returned **FAIL**. Verifying its claims against the raw JSON proved it right on every substantive point.
**The bugs I shipped:** (1) **compound fake seeds** — "turmeric curcumin"/"amla amalaki"/"tulsi holy basil" are not real queries; single-term re-test showed turmeric 301K US (I reported 27.1K — 11x low) and amla 165K IN (I reported 6.6K — 25x low). (2) **implausible zeros summed into totals** — shilajit/shatavari/gokshura = 0 US (yet 246K/90.5K/27.1K in India). I *noticed* the ojas outlier but not the zeros — I pattern-matched on the anomaly I expected. (3) **India in English only**. (4) seed universe far too small; no ontology/competitor/intent/AEO work before prioritising.
**Lessons (binding):**
- A **different model family is not invested in the work being right** — it catches what self-review structurally cannot. Abilash's instinct was correct and this paid for itself immediately.
- **Never invent seed keywords.** Seeds come from a canonical entity ontology (AYUSH/CCRAS/API index for Ayurveda), then programmatic expansion. Concatenations are banned.
- **A zero for a known-major entity is a DATA FAULT, not a finding.** Plausibility-check before any number is reported, let alone used to prioritise. Same for outliers (brand/noise contamination).
- **Multi-locale is not optional** for India (Hindi/Devanagari/Hinglish).
- Noticing *one* anomaly is not auditing — I found ojas and stopped looking. Systematic validation beats spot-checks.

## 2026-07-15 18:04:09 IST — auditor contamination: never hand a fact-checker your own conclusions
Ran scripts/audit-perplexity.mjs against demand.md AFTER I had prepended a quarantine header explaining the bugs. The auditor dutifully "found" the faults — but several findings simply restated MY analysis back to me ("the artifact itself states…"). That is contaminated evidence, not independent verification, and it would let a future agent fake a passing fact-check by pre-loading the conclusion.
**Rule:** a fact-grounding gate must see the RAW artifact only. Strip our own annotations, warnings and conclusions before submitting. If an auditor's justification cites the artifact rather than an external source, that finding is worthless — treat "the artifact itself says" as a red flag in any verdict.

## 2026-07-16 14:43:42 IST — Research tooling directive (Abilash) + the content-gate-green retro

### Abilash directive (BINDING on all research work)
**Do not rely on built-in WebSearch/WebFetch alone.** The session has better research tools connected and they must be used alongside: **Tavily MCP** (tavily_search with search_depth:"advanced", tavily_extract for protected pages, tavily_research for deep dives) and the **Perplexity API** (scripts/audit-perplexity.mjs pattern / PERPLEXITY_API_KEY). Applied retroactively 16 Jul: the four r3-citation-floor sources chosen via built-in search were cross-checked with Tavily before shipping — Tavily's top authoritative result for triphala independently matched the chosen MSK About Herbs monograph, and the brahmi pick (Aguiar & Borowski 2013) was confirmed complementary to the page's existing Kongkeaw 2014 meta-analysis rather than duplicative. Every external citation on a YMYL page gets this two-tool check from now on.

### What broke (this pass) and the general lesson
Three separate artifacts had ENSHRINED a stale reality, and each cost time to unwind:
1. content-lint's r4 extractor could not see quoted PATHWAYS keys → "Villa Raag" routes were false positives;
2. its unit test asserted the broken output (["KAPPL","KTAHV"]) — a test that asserts broken output is the broken output's bodyguard;
3. the corpus test asserted errors>0 ("dirty corpus") — right when written, absurd once the corpus was fixed.
**Lesson: any assertion about CURRENT repo state (key lists, error counts, roster sizes) must be derived from the artifact, never hardcoded — or it becomes tomorrow's false gate.** Same class as the morning-brief staleness (fixed by brief-snapshot.sh) and the 3-of-5 physician roster literal (fixed by {{REVIEW_PANEL}}).

## 2026-07-17 12:30:00 IST — WAVE-4 RETROS, BACKFILLED (Session 2B)

**Preamble — the wave-level process failure these retros exist inside:** all four builds below (#81, #84, #85, #86) shipped WITHOUT their §E evidence layer — no wiki/log entries, no retros, no filled checklists — caught only by the 17 Jul retro-audit. The arogyakendra retro (14 Jul, item 10) already flagged "the learning loop only runs if the retro is part of the launch definition-of-done"; a whole wave then repeated the miss. **Twice-rule: this graduates from a reminder to a mechanism** — the retro-audit's process fix #2 (launch-scaffold + a gate that blocks a site PR whose launches/ folder lacks checklists/log/retro) is now the named owed build, not advice. A second wave-level find from this backfill: **committed audit reports lag merged code in BOTH directions** (healing.recipes' seo report's final committed verdict is FAIL though every blocker is verifiably fixed in the merge commit; its design report's "NOT fixed" items are also fixed) — a report whose verdict changed must be re-stamped in the same PR, or the evidence layer lies.

## 2026-07-17 12:31:00 IST — healing.recipes v1 retro (built 16 Jul, PR #81 — retro backfilled)
1. **Mine-first saved the owner's own history.** The domain turned out to be the 2017 Chef Retreat event site — the owner's own initiative. Without step-zero mining we would have silently overwritten it; with it, every legacy URL got a fate, the recipes are banked verbatim, and the archive question went to the owner (Q-HR-ARCHIVE) instead of being decided by accident.
2. **Design-gate iteration is the norm, not the exception:** it.1 scored 8.6 FAIL (hero image weight among the blockers, cut 3.3×). Three of the four wave sites failed it.1 — every build plan should budget two critic iterations as standard.
3. **Image weight keeps reaching the critic instead of a machine gate** (here: hero weight; on kairaliyoga: 3,066→322KB). Twice-rule: a CI image-weight budget (per-page bytes at load) is the owed package/gate — the critic should be catching taste, not kilobytes.
4. **The placeholder-with-test pattern extends to future facts:** the launch band ships a visible "details will be announced here" placeholder plus a TEST banning day-precision dates until the owner supplies them. A checklist item without a machine gate rots (14 Jul lesson) — this is the same law applied to a fact that doesn't exist yet.
5. Open (honest): no Vercel project (probe 404 — preview gate C-1 currently unsatisfiable for this site); event details; Q-HR-ARCHIVE/Q-HR-PHONE; Roli cover permission; sub-AA bronze display text until Q14's bronze-600 lands; triangulation item — Harmony's bibliographic facts need re-verification against the live Roli/ISBN listing before the end-July event (launches/healing.recipes/triangulation-2026-07-17.md).

## 2026-07-17 12:32:00 IST — arogyashala.in v1 retro (built 16 Jul, PR #84 — retro backfilled)
1. **THE FLEET-WIDE CATCH: a shared-package defect is a fleet-wide defect by construction.** Both rule-n auditors independently found `kairaliOrganization()` publishing `foundingDate: 1908` — the machine-readable form of the exact claim the owner had ruled wrong — on EVERY site, having survived five launches and every human review. Lessons: (a) the fix belongs at package level with a regression test (one PR healed the fleet at next deploy); (b) machine-readable claims (JSON-LD, llms.txt) rot invisibly — they need locked-fact gates exactly like visible copy (the #87 locked-counts gate is this lesson generalised); (c) auditors pointed at ONE site catch ESTATE bugs — a periodic fleet-wide schema/llms audit pass would have caught this years earlier.
2. **D-DESIGN-DIFF is executable and cheap:** the first run of the similarity gate produced a real verdict ("not mistakable for a recolor of arogyakendra") and forced five devices no fleet build uses. The gate works; keep it mandatory.
3. **Facts-law-by-guard-test beats copy discipline:** six CI guards ban outlet counts/locations/fees/cure-claims and force computed years. Nothing unverified can ship even if a future edit forgets the rule. Keep this pattern for every pre-commercials programme site.
4. Iteration: 8.4 → 9.1 in two passes (see wave pattern, healing retro item 2).
5. Open (honest): commercials gate before any programme promises harden (fees, training, verification SLA); .co.in forward HOLD lifts only at the human DNS action; triangulation items — "unbroken practice" phrasing exceeds the licensed D-1908 wording; NABH/WHO-GMP want proof links (launches/arogyashala.in/triangulation-2026-07-17.md).

## 2026-07-17 12:33:00 IST — kairaliyoga.com v1 retro (built 16 Jul, PR #85 — retro backfilled)
1. **A FONT IS A DEPENDENCY WITH BUGS — the Kurale IAST catch.** The brand manual's own display face misrenders IAST macrons (mark anchors to the FOLLOWING consonant: "Dhyāna"→"Dhyan̄a"), reproduced from Google's own CDN build; DOM strings correct, NFC/NFD immaterial — an upstream font defect with no pipeline fix. Lessons: (a) **a glyph-rendering probe belongs in design research for ANY script/diacritic-bearing brief** — new checklist-item candidate; (b) the honest interim (romanized display names + exact IAST in correctly-rendering support faces, BOTH string sets guard-pinned) preserved reckoner-exactness without shipping visibly broken marks; (c) fleet implication: Kurale is the group display face — every future Sanskrit-forward surface inherits this until the ch.04 ruling (Q-YOGA-IAST); (d) report the bug upstream to Google Fonts (right thing to do, no ship-date value).
2. **The legacy site is the price-doctrine's own proof:** a decade-stale site (2018-expired retreat calendar, 2013-frozen feed) is exactly what "prices/dates live only in approved, maintained surfaces" prevents. Never-hardcode-a-rolling-number, applied at site scope.
3. **PR-BODY CLAIM TRANSPLANT (found at backfill): evidence claims must trace to the site's OWN audit.** PR #85 described the legacy site with kairali.guru's defects ("expired 2020 prices", "no viewport meta") — unsupported by the mined corpus (home.html HAS a viewport meta) or by audits/kairaliyoga.com-2026-07-16.md. Same failure class as the stale-reality tests: an assertion detached from its artifact. PR templates should cite the audit file next to any legacy claim.
4. **D-DESIGN-DIFF catches same-wave convergence too:** three early devices twinned with arogyashala (built the same night) were found and de-twinned — the comparison must run against ALL prior builds, including the wave's own siblings.
5. **Triangulation earned its keep on this site:** the external pass found the shipped page asserts "private" sessions ×7 while Q-YOGA-PRIVATE is unresolved and the QUESTIONS record claims the site "claims neither" — a sell-critical contradiction self-review missed twice (launches/kairaliyoga.com/triangulation-2026-07-17.md).
6. Open (honest): ~56 legacy sitemap URLs need fates pre-flip; Q-YOGA-PRIVATE (now load-bearing), Q-YOGA-GUESTBOOK, Q-YOGA-IAST; "unbroken lineage" phrasing (fleet item); no Vercel project (probe 404).

## 2026-07-17 12:34:00 IST — kairalihospitality.com v1 retro (built 16 Jul, PR #86 — retro backfilled)
1. **Treat dictated names as claims to verify, and guard-test the WRONG spelling.** "Swatak Katrina" → verified Resort Svatá Kateřina (3 independent sources); the verified spelling ships and a guard asserts the dictated one never appears. The pattern generalises: any owner-dictated proper noun gets verified, and the known-wrong form gets a negative test so it cannot regress in.
2. **Two registers CAN share one page when the boundary is machine-enforced:** the Healing Village panel + treatment door hold the clinical lock (guards import the banned lexicon from packages/compliance and scan the rendered DOM) while Villa Raag speaks hospitality. The carve-out is a test, not a convention.
3. **Omission as design under rule 6:** the "on the horizon" band was cut (zero announceable facts) and the Czech panel is deliberately text-first (no photograph exists; fabrication banned). Honesty produced better design decisions than filler would have — and the critic still scored it the fleet's highest (9.4).
4. **Write builder interpretations down as reversible rulings:** four it.2 interpretation calls live in the brief as Q-KH-BRIEF-RULINGS instead of unspoken drift. When the builder must interpret, the interpretation becomes a one-line-reversible owner question.
5. **Even the critic needs verification:** B-14 caught its own instrumentation double-count before scoring. Machine evidence over authority — including the reviewer's.
6. Open (honest): Q-KH-JV-NAME now carries external-auditor weight (public sources say "in cooperation with", not "joint venture" — the LABEL needs the legal-form ruling, not just the spelling); Q-KH-2008/PHONE/BRIEF-RULINGS; "unbroken" phrasing (fleet item); NABH/WHO-GMP proof links; no Vercel project (probe 404 — Human Gate C-1 unsatisfiable today).

## 2026-07-17 15:45:00 IST — Open a PR only from a branch synced to origin/main IN THE SAME MINUTE (session 2C-hardening)
PR #92 opened CONFLICTING: the branch was cut from b47a11a at session start; the heritage-lines PR (#91) merged to main mid-session; both sessions appended to wiki/log.md's tail. A CONFLICTING PR gets NO merge commit, so GitHub Actions creates no check suite at all — the PR shows only Vercel checks and an error, and every CI gate this repo relies on silently never ran. That failure mode is worse than a red X: it looks like "checks missing", not "checks failed". Rule of thumb going forward: after any multi-hour session, `git fetch && git merge origin/main` (resolve, re-run gates) IMMEDIATELY BEFORE `gh pr create` — the CLAUDE.md concurrent-writer rule ("always git pull immediately before writing") applies to PR-opening too, not just to file writes. Append-append conflicts in the tail-growing logs (wiki/log.md, QUESTIONS.md, LEARNINGS.md) are the expected shape; resolution is always keep-both-chronological.

## 2026-07-17 15:49:17 IST — A budget passed by 0 points is a budget that fails on someone else's hardware (session 2C-hardening)
whatisayurveda + kairalicenters measured perf **90** locally (M2, exactly the A5 budget) and I treated that as "passing". The CI runner — slower, shared, throttled — measured **88/89** on the same commits, and the gate went red. Both were still shipping full-size hero JPEGs; the M2 simply decoded them fast enough to hide it. The other three sites, whose LCP heroes I had converted to next/image, scored 100/100/90 locally and held up on CI. Two rules from this: (1) **a local score AT the budget line is a FAILING score** — the margin is the evidence, not the number; treat ≤ budget+3 as red and fix the cause. (2) The perf fix that actually moves the needle on this fleet is always the same: the LCP hero image ships full-size to a 375px viewport; next/image with priority + layout-matched sizes takes it from ~76-90 to 95-100. Any new site opening on a photo gets next/image at build time, not after a gate catches it.

## 2026-07-17 16:03:28 IST — The A5 perf outlier was a font subset nobody used, not the photos (session 2C-hardening)
kairaliyoga sat at 89–92 while its siblings hit 95–100, and the obvious suspect (full-bleed hero + 8 photos) was wrong. The trace said so plainly: the LCP element was **the lede TEXT**, not any image — TTFB 456ms, load 0ms, **render delay 2.87s** — and `observedLargestContentfulPaint` was 157ms, meaning the 3.3s was Lighthouse's simulated slow-4G projection, not a real paint. The differentiator against every other fleet site: kairaliyoga was the ONLY build shipping `subsets: ["latin", "latin-ext"]` — 8 preloaded woff2 files (~144KB) instead of 4, all competing with the LCP paint in Lantern's network model. Walking the rendered DOM showed the macrons live ONLY in Asap (.path-hint) and Lato (.programme-iast); **Kurale carried none** — the Q-YOGA-IAST romanized interim is exactly why — so its latin-ext file was preloaded weight no glyph used. Dropping that ONE subset: 90/92 → **94, three consecutive runs**. Two transferable rules: (1) when a perf score is stubborn, read the LCP *element and phases* before optimizing anything — optimizing the photos would have burned a session and moved nothing; (2) `subsets`/`weights` in next/font are a perf budget, not a formality — audit which glyphs the page actually renders (walk the DOM, don't assume the comment) before adding a subset, and re-audit when an interim workaround like the romanized names changes what's on the page.

## 2026-07-17 17:02:33 IST — A squash-merge silently strands every commit you push after it
**What happened:** PR #92 was squash-merged at 16:11:58 IST. The session kept working and committed D-BRONZE-CONTRAST at 16:17:51 IST — **six minutes later, onto a branch whose only PR was now closed**. Its own log entry reads *"PR #92 should now be green"*: it never learned the PR had merged. Result: an entire ruled, implemented, acked, tested body of work — the bronze-600 token, brand-lint rule 6, all 20 contrast fixes, the evidence screenshots — sat on a dead branch that **nothing on main pointed at and no open PR referenced**. Main still shipped all 20 nodes failing AA. Discovered only because the next session went to build on the precedent and found it missing.
**Why it is invisible, specifically:** after a squash-merge, `git log main..branch` lists the branch's commits as "not in main" *even for work that did merge* (squash rewrites them into one new commit). So the one signal that would reveal a strand looks identical to normal post-squash noise. **The reliable check is content, not commits: `git diff main origin/<branch> --stat`.** Here it returned exactly 21 files — all bronze — which is what proved it.
**Lessons:**
1. **Merging is an event you must observe, not assume.** After pushing to a PR branch, re-check the PR's state before continuing to commit. The boot contract reconciles GitHub at session START; it cannot help you mid-session, which is exactly when this happened.
2. **`git diff main origin/<branch> --stat` is the strand detector.** `git log main..branch` is not — it lies by design after a squash.
3. **A branch whose PR is closed is a write-only medium.** Work committed there is not "pending review"; it is lost, silently, with a passing local test suite and a cheerful log entry.
4. **This is one disease with three symptoms today** — the stranded branch, two `wiki/log.md` append-append conflicts, and `directive-capture.mjs` assigning a duplicate ID (`D-20260717-05` to two different directives, because it counts `max+1` of the *local file*). All three are: append-only or long-lived state, concurrent writers, no structural protection. Fixing them one at a time treats symptoms.
5. **The self-check that would have caught it earliest is the cheapest:** a session that says "the PR should now be green" has made a claim about GitHub without asking GitHub. Evidence before assertions applies to PR state too, not just test output.

## 2026-07-17 18:51:20 IST — "17 red jobs" on a Dependabot PR usually means ONE line at the install step
**What #93 looked like:** every job red — brand-lint, all 8 factory-spec, all 8 lighthouse. Catastrophic. It read like the dependency bump had broken the fleet, and it was flagged as needing "a real look, separately".
**What it actually was:** one line, before any job's real work began.
```
✗ Lockfile failed supply-chain policy check (874 entries in 10.9s)
[ERR_PNPM_MINIMUM_RELEASE_AGE_VIOLATION] 2 lockfile entries failed verification:
  lucide-react@1.25.0 was published at 2026-07-17T08:28:15Z, within the minimumReleaseAge cutoff
  tailwindcss@4.3.3   was published at 2026-07-16T12:03:32Z, within the minimumReleaseAge cutoff
```
`pnpm install` refuses the lockfile, so **every** job dies at setup. brand-lint never linted; factory-spec never opened a browser. The red is one failure wearing seventeen hats.
**The policy is a pnpm 11 DEFAULT we never configured.** `minimumReleaseAge` appears nowhere in this repo — not pnpm-workspace.yaml, not .npmrc, not package.json — and `pnpm config get minimumReleaseAge` returns undefined. pnpm 11.12.0 ships it on, at **24h** (the log's cutoff is exactly 24h before the run). **It is a supply-chain protection: it refuses packages published in the last day, which is precisely the window a compromised npm release does its damage in.** Dependabot opens PRs within *hours* of a release, so Dependabot and this policy structurally disagree.
**Diagnostic rule — cheap and reliable:**
- **ALL jobs red → look at the install step first.** Lockfile/policy/setup. Do not read the job names as evidence; they are all the same failure.
- **SOME jobs red → a real failure or flake** (e.g. Q-A5-FLAKE, now mitigated by median-of-5 in #98).
**The fix is TIME, never the policy.** Rule (g) applies with force here — relaxing minimumReleaseAge to make a bump merge would trade a real supply-chain defence for a few hours' convenience. Wait until each package is 24h old and re-run. In #93's case: tailwindcss cleared on its own (25.2h by the time it was diagnosed); lucide-react clears 18 Jul 13:58 IST. No code change, no rebase (it merges clean).
**For the Monday Dependabot triage:** expect this on any PR bumping a package released in the previous 24h. It is not a broken bump. Re-run it a day later.

## 2026-07-17 18:58:12 IST — "He is reachable" is not "he was asked" — a blocker entry must name the ask date or admit there isn't one
**What happened:** the Shopify Storefront token sat on BACKLOG as **OPEN — Ambuj**, gating Wave 1 (20 Jul), annotated *"He is in active daily contact (director emailed him 16 Jul 07:22; he sends the daily delegation summary), so he is reachable, not silent."* Abilash asked me to check for Ambuj's reply and send a reminder if there wasn't one. **There was no reply because there was no ask.** Mailbox-verified: 201 sent threads to Ambuj, zero about a Storefront token; zero across all of director@. The 16 Jul 07:22 mail cited as evidence was the FMS/Quillrun thread — a different subject entirely.
**Why it survived a reconcile.** The 16-Jul mailbox reconcile was built to catch the OPPOSITE drift — phantom "stale" items where a reply existed but was never logged. This is the inverse: an item logged as *waiting* that was never *started*. The reconcile checked for replies, and finding none, left it open — which is exactly what a genuinely-unanswered ask looks like. **"No reply" is ambiguous between "they ignored us" and "we never asked", and only the sent folder distinguishes them.**
**The tell was in the prose.** Read the same reconcile's four entries side by side:
- Deepu — "**asked 14 Jul**, 2 days, no reply"
- Sunaj — "**asked 14 Jul**"
- Vikash — "**no ask thread**, no reply; the real gap"
- Ambuj — "but he's **in active daily contact**"
Three state the ask status. The fourth answers a question nobody asked (*is he reachable?*) and lets the reader infer the one that matters. It reads like progress. **Evidence of reachability is not evidence of a request.** Ambuj answers same-day when actually asked — he replied to the FMS mail in 76 minutes.
**Rules:**
1. **A blocker entry names the ask: `asked <date>` — or says `NOT YET ASKED`.** Nothing else is a status. "In contact", "reachable", "active", "aware" are not statuses.
2. **On any "chase X" instruction, check the SENT folder before composing.** The instruction presumes an ask; verify the premise. Sending a "reminder" for an email that never existed fabricates a history and confuses the recipient about which mail they missed.
3. **Reconcile both directions:** replies-not-logged (phantom stale) AND asks-never-sent (phantom pending). The 16-Jul rule only covered the first.
4. Cost here: the token gated Wave 1 from 3 days out, with the recipient never informed — for free, and invisibly.

## 2026-07-17 19:14:33 IST — The delegation system worked. Nobody read the replies, so we logged it as failure.
**The instruction:** "check for Ambuj's reply, and if there isn't one send a reminder." Then: "go ahead and send reminders." Following either literally would have chased four colleagues, two of whom had already answered, one of whom had done most of the work and fixed the exact item we were about to chase him for.
**What the mailbox actually said, verified message by message:**
- **Deepu** replied in **2h22m** and closed **6 of 13** audit items — including item 5 (contact-us NOINDEX), item 6 (stale static sitemap, 210 dead URLs) and **item 7, the sitemap_index.xml 404 that BACKLOG told us to chase him for**. He also named his own blocker unprompted: Shopify items 1–4, *"I'm still relatively new to"* it.
- **Vikash** replied **twice** (17 Jul 05:46, 06:00) with screenshots. **Both unread.**
- **Abilash had sent** almost every mail the delegation log still marked `DRAFTED (awaiting Abilash send)`.
**THE CHAIN NOBODY SAW.** 16 Jul 10:54 our mail states *"only 3 of our 128 pages are indexed"* → 16 Jul 13:16 Deepu fixes the three causes → **17 Jul 05:46 Vikash reports "646 KTAHV pages have been indexed."** The crisis was diagnosed, delegated, fixed and confirmed in **19 hours**, by two people doing their jobs well. Our records at that moment said: Deepu is stale, chase him; the indexing problem is open; Vikash is the real gap. **Every one of those was false, and the evidence was sitting unread in the inbox.**
**Root cause — a hand-maintained mirror of a system nobody updates is a rumour.** Three independent hand-maintained truths (delegation-log Status, BACKLOG, QUESTIONS) all drifted from the one machine-checkable source (the mailbox), in the same direction: **toward pessimism**. Every drifted record said someone had failed. Not one drifted toward "this is done".
**Why pessimism specifically:** a record is written when work is *dispatched* and would only be corrected when someone *reads a reply and remembers to log it*. Dispatch is motivated; reconciliation is a chore. So the logs accumulate open items and never accumulate closures. **An un-reconciled tracker converges on a lie about your colleagues.**
**Rules:**
1. **Read the inbox before writing about people.** A "chase" list built from our own records is a list of our own unread mail. Verify against the mailbox first — it takes minutes and it is the only real source.
2. **The 16-Jul mailbox-drift rule existed and did not save us.** A rule that depends on remembering is not a mechanism. If reconciliation is not automated or ritualised (Monday triage), it will not happen.
3. **Unread replies are worse than no replies.** Vikash answered in hours, twice, with evidence, and was recorded as "the real gap" — while his mail sat unread. That is how good people learn that answering does not matter.
4. **A blocked colleague ≠ a slow colleague.** Deepu is blocked on Shopify *access and unfamiliarity*, and said so. That needs help, not a reminder. Reminders sent to someone who already told you the blocker are corrosive.
5. **Before chasing, ask: does the task's premise still hold?** Vikash refuted his: 646 indexed, not 3; noindex on OLD URLs, not live ones. Chasing him would have been chasing a fixed problem.


## 2026-07-17 19:58:44 IST · Near-miss: I amended another session's commit, because `cd` persists between Bash calls

**What happened.** Session 2D worked in a worktree (`wt-session-2d`). To check the repo's standard commit author I ran `cd .../kairali-web-factory && git config user.name`. That `cd` **persisted into the next Bash call**. The next call was a `git commit --amend --author=...` intended for *my* commit in the worktree — the shell ran it in the **main repo**, on branch `factory/fix-ambuj-token-record`, which a **concurrent session** had just committed to. I rewrote their commit (`d124baf` → `d6ff9c5`), author field only, content byte-identical.

**Why it was recoverable, and what actually saved it.** Two things, neither of them me being careful:
1. The `--force-with-lease` push was **blocked by the Claude Code permission classifier**. Had it gone through, the other session's branch would have been rewritten under them mid-work.
2. `origin` still had `d124baf`, so `git reset --hard d124baf` restored their commit exactly. Verified: local == origin, author `Abhilash Kairali <director@kairali.com>` intact.

**Root cause, stated honestly:** not "the cwd was surprising" — it is documented that the working directory persists. The real cause is that I used a bare `git` command whose target depended on **ambient state I had changed two calls earlier**, in a repo whose CLAUDE.md **explicitly warns** that "more than one agent may touch the repo" (BRIEFS & STATE-TRUTH, concurrent-writer safety). The warning was right and I walked into it anyway.

**Rules that follow (cheap, mechanical):**
- **Never `cd` into the main repo during a worktree session.** Read config with `git -C <path> …` — it costs nothing and cannot leak into the next call.
- **Every history-rewriting command names its repo explicitly**: `git -C <worktree> commit --amend`, never a bare `git commit --amend`. Same for reset/rebase/push.
- **Before any amend/reset/force-push, print `git -C <path> log -1` first** and read the subject line. If the subject is not the commit you wrote this session, STOP. This one check would have caught it in one second.
- **`git reset --hard` destroys uncommitted AND committed-this-session work.** Earlier the same session I reset a probe away and took my own real work with it (recovered from reflog — `git checkout <reflog-sha> -- <paths>`). Probe in a scratch dir or `git stash` it; do not commit probes onto the branch you are about to reset.

**Wider point for concurrent sessions:** the worktree gave isolation of *files*, not of *shell state*. Isolation you can undo with one `cd` is not isolation. The `git -C` habit is what makes it real.

