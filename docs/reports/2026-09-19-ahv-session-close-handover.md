# AHV — session close and handover, 2026-09-19

Written at the owner's instruction to close this session, consolidate to one branch and one
deployment, and let a new session start exactly where this one stopped.

**Branch:** `codex/ahv-english-staging-20260915` — 73 commits ahead of `origin/main`, **0 behind**,
887 files changed. A clean fast-forward.
**PR:** [#309](https://github.com/kairali-digital/kairali-web-factory/pull/309) — DRAFT, MERGEABLE, state BLOCKED.
**Preview:** https://kairali-web-factory-ayurvedichealingvillage-kawlovb0q-kairali.vercel.app
**Summary page for the team:** https://claude.ai/artifact/5gDFGuY8nFMFed5QndBnKw

---

## 1. The consolidation, and one correction

The owner's read was "too many branches and vercel sites". Measured, it is narrower than that:

- **Vercel is already ONE project** — `kairali-web-factory-ayurvedichealingvillage-com`. There is no
  second site. What looks like many sites is roughly ten **preview deployments** of that one project;
  every `vercel deploy` mints a new immutable URL by design, and old ones stay reachable forever. That
  is not sprawl and nothing needs deleting. **The fix is to stop generating them**: once this branch is
  on `main`, the project's production deployment becomes the single stable URL and previews stop
  mattering.
- **Branches**: the repo has 281 remote branches, 8 mentioning AHV. Only **one** carries this work:
  `codex/ahv-english-staging-20260915`. The other seven are older or unrelated lanes
  (`ahv-headless-demo`, `ahv-next-parity-wave-001`, three `ktahv-lp-*`, `media/ktahv-raag-catalog`,
  `records/deepu-ahv-escalation-panel`). None of them needs to merge for this site; deleting them is a
  separate tidy-up and is the owner's call, not the agent's.
- **Worktrees**: 45 exist locally, 5 mentioning AHV. All scratch worktrees this session created have
  been removed. The rest are historical and local-only — they affect nobody else.

So consolidation is really one action: **get #309 onto `main`.**

## 2. What blocks `main` becoming the final design

Five required checks currently fail on #309:

| Check | Conclusion |
|---|---|
| `changes` | FAILURE |
| `gate` | FAILURE |
| `brand-lint` | FAILURE |
| `security-review` | FAILURE |
| `front-gate` | FAILURE |
| `factory-spec` | SKIPPED |

Two things are known and two are not:

- **Known:** `launches/ayurvedichealingvillage.com/approvals.yaml` exists, is `mode: A`, and carries four
  `status: approved` rows — so the front-gate ledger itself is not obviously the blocker.
- **Known:** the PR is still a **DRAFT**. A draft cannot merge regardless of checks.
- **Not known:** the actual failing step inside each job. `gh run view --log-failed` returned nothing
  from this machine, so the cause was not established and is deliberately **not guessed at here**.
  Reading those five logs is the first task of the next session.
- **Not known:** whether the historical Actions-billing problem (recorded in memory against this PR) is
  still contributing.

**The agent cannot merge this.** HARD GATE 9: the agent's lane is always a PR; a blocked PR waits for
review, it does not route around it. Marking ready-for-review, fixing the gates and merging is the
owner's sequence.

## 3. What was delivered this session

Fourteen commits, `65e72e91` → `379b68e6`. Every fix is a re-runnable tool under
`sites/ayurvedichealingvillage.com/tools/` (26 of them) so the next design import cannot silently
undo it.

| Area | Result, measured |
|---|---|
| Article template (129 routes) | Line length 91 chars → 66ch cap; hero now full-bleed; headings/lists/tables given rhythm; every article now closes with the approved trust + CTA block |
| Corporate menu (36 routes) | Was printing as article body text, above the article on 26. `/arogya-kendra/` first paragraph: phone 1,617px → **470px**, desktop 1,868px → **802px** |
| Chat with Priya | Was a link with no target that **replaced the site**. 380 external links now open in a new tab with `rel="noopener noreferrer"` |
| Campaign CTAs | All pointed at `#Enquirenow` / `#contact` — sections the rebuild does not contain. Now `/enquiry-form/` as 52px buttons. **0** dead in-page anchors across all 15 campaign routes |
| Campaign design | Duplicate Kairali logo hidden (partner lockup kept); promo bar corrected to brand green with legible text; heroes given a photograph |
| Images | Empty alt **1,785 → 231**, of which 138 are correctly-empty ornament. 404 images opened and described by 23 agents |
| Duplicates | `/our-story/` 96% identical to `/about-us/`; `/offers/new/` 93% identical to the senior-citizen offer (236 clicks vs 0). Four canonicalised, 15 routes out of the sitemap |
| Maps | All four (India → Kerala → Palakkad → grounds plan) now on `/how-to-reach/` |
| Design audit | 60 templates, 243 of 250 routes (97.2%). Evidence in `launches/ayurvedichealingvillage.com/design-audit/` |

Verification after every change: 252 routes swept — **0** render failures, **0** JS errors, **0**
horizontal overflow, **0** broken images, **0** live-domain links. Owner-built pages (homepage,
packages, `/ayurvedic-treatments/`, `/all-programs/`, finders, course pages) re-verified by computed-style
diff at **0 of 16 page/width pairs changed**.

### Three reports that did NOT survive measurement

Recorded because the pattern repeated and the next session should expect it:

1. The design audit's "six sitewide defects reaching 200+ routes each" — the flagged pages carry
   **larger, more uniform text** than the owner's benchmark, and the benchmark itself has 30 sub-44px
   tap targets. Applying those rules would have moved 243 routes *away* from the approved design.
2. "12 villa links in tariff tables point at the homepage" — across all 252 routes, **zero** links
   inside tables point at the homepage.
3. `/offers/new/` "UI/UX is terrible" — it measures on-brand. Its only defect is being a 93% copy.

**The rule this produces:** every finding is a candidate. Confirm it in the rendered DOM, against the
owner's own pages, before writing a line of code.

## 4. To-do, for the next session

### A. First, and blocking everything else
1. **Read the five failing CI logs on PR #309** and fix the causes. Do not guess; the logs were not
   readable from the previous machine.
2. **Take #309 out of draft** once green, and hand it to the owner for review. The agent never merges it.
3. After merge: confirm the project's **production deployment on `main`** is the single URL, and use
   only that from then on. Stop minting previews per change.

### B. Agent work, unblocked, safe to do any time
4. **93 images** still without alt because the rendered `src` does not match the source path the apply
   tool keys on. Map is `english-candidate/image-alt-map.json`; tool is `tools/repair-image-alt.mjs`.
5. **7 single-route templates never audited**, plus the design audit's **verification pass**, which ran
   out of session allowance twice. Resume: `Workflow({scriptPath: .../scratchpad/ahv-design-audit.js, resumeFromRunId: 'wf_66ad40c6-509'})`.
6. **`/payment-policy-compliance/` and `/new-privacy-policy/`** — measured 7% and 38% similar to
   `/privacy-policy/`, so neither is a clean duplicate. Owner asked for them to be "checked and put in
   the right place"; they still need a decision and a link.
7. **Each offer its own landing page** — owner's stated intent, not yet designed.
8. **Two "(Mon - Sat)" opening-hours labels** are wrapped in a bare `#` link and resolve to the
   homepage. Cosmetic; left because rewiring a non-link carries renderer risk for two instances.

### C. Parked by owner ruling — do not start without his word
9. **Register / word lock**: ~595 descriptive uses of *journey*, *guests*, *holiday* across ~93 routes.
   The other 1,627 (*luxury*, *spa*, *resort*) are **award names** and cannot change. Owner ruled
   2026-09-19: leave until after go-live. Clinical wording needs Dr. Deepu John (HARD GATE 7).
10. **Translations**: parked until after go-live (owner, 2026-09-19). HARD GATE 7 unresolved —
    Dr. Deepu John cannot sign clinical text in nine languages he does not read.

### D. Owner and team
11. **Deepu** — the three WPForms confirmation settings (IDs 11965, 18926, 8055), and switching the
    forms on. This is the real go-live blocker.
12. **Tracking and measurement** — deliberately off; needs the owner's word.
13. **Workshop PDF** — a draft email to Deepu and Sunaj is in the owner's Gmail, **unsent**. The file
    404s on the live site too, so it is a pre-existing gap.
14. **Eight orphan pages that still earn clicks** — `/panchakarma/` (2,964 impressions), the cancer
    supportive-care page, `/learn-about-ayurveda/`, `/yoga-and-ayurveda/`, `/our-story/`,
    `/payment-policy-compliance/`, `/kairali-air-india-maharaja-club.html`,
    `/family-ayurvedic-retreat-kerala.html`, plus `/offers/defence-paramilitary.../`. Owner was
    reviewing these in open tabs and had not returned a verdict.
15. **Team feedback** due Monday 21 September. Their link (`…hek2z0v4o…`) is several fixes behind.
    Send the current URL once their notes are in, so it is one pass.
16. **Gate signage** physically reads "Kairali Ayurvedic Health Resort" — off-register in the real
    world, not something the website can fix.

### E. Go-live sequence, human
17. Flip `AHV_STAGING=0` — that alone turns the sitemap on and lifts the staging noindex. Verified to
    produce correct output; **106 routes deliberately carry `max-snippet` and one is deliberately
    noindex**, so a blanket "index, follow" would be wrong. Runbook:
    `docs/reports/2026-09-16-ahv-go-live-runbook.md`.
18. Submit the new sitemap to Search Console.
19. DNS flip — Abilash/Ambuj. Never the agent (HARD GATE 1 and 3).

## 5. Tool run order, after any design re-import

The import rewrites `public/ahv/` wholesale, so these must be re-run in this order:

```
repair-payload-navigation → repair-payload-schema → repair-finder-dataset →
repair-finder-shortlist → build-finder-views → repair-all-programs-block →
repair-training-hub → build-training-hub-route → build-course-views →
repair-campaign-cta → repair-external-links → repair-review-notes →
repair-image-alt → repair-article-cta → repair-how-to-reach-maps →
repair-route-manifest → (build, serve) → prerender-english →
repair-snapshot-links → (build again — snapshots are read at build time)
```

## 6. Traps that cost real time, so they are not paid for twice

- **`boot.ts` is a JS template literal.** Backslashes are eaten. Write boot additions with **zero**
  backslashes; use `new RegExp("...")` and `String.fromCharCode()`. Has killed the whole design twice.
- **`:has()` cannot be nested inside `:has()`.** `main:has(> nav:has(a))` is invalid and the rule is
  dropped **silently** — no console error, no build warning. Cost one failed attempt at the phone reorder.
- **Specificity decides between two `!important` rules.** The article hero rule
  `[data-ahv-family] main img:first-of-type` is (0,2,2) and beat the maps rule at (0,2,1), painting
  maps 1280px wide with a −435px margin. Chaining both root attributes gives (0,3,1).
- **A full-width card without `box-sizing:border-box`** put 23 routes into horizontal overflow.
- **Padding added to rows that already measure 44px** made a block 322px *taller*, not shorter.
- **`/sitemap/` links to everything**, so any "match by link" selector must be checked against it.
- **Snapshots are the server HTML.** After any view or dataset change, re-run `prerender-english` or
  crawlers keep reading the old markup.
