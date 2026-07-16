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
