# Triangulation note — healing.recipes (BACKFILLED 2026-07-17)

**2026-07-17 12:20:00 IST · Session 2B evidence backfill · Standing triangulation rule (docs/plans/2026-07-17-factory-audit-and-launch-roadmap.md, "Secondary / external auditors") + D-DESIGN-DIFF post-build external comparison (DECISIONS.md 2026-07-16 19:40).**

The 16 Jul wave shipped without its cross-model pass — the 17 Jul retro-audit marked it MISSING (pending-triangulation queue). This note clears that state for healing.recipes: both external verifiers ran 17 Jul 2026, full raw outputs in `triangulation-evidence/`.

## What ran
- `scripts/audit-gpt.mjs` (GPT-5) — artifact: `sites/healing.recipes/app/page.tsx` + `app/author/page.tsx`; prior (old-vs-new): `content-mined/healing.recipes/default.html` + `about-us.html` (the 2017 "Chef Retreat — Back to Roots" event site). Verdict **FAIL** (exit 2), pass 1.
- `scripts/audit-perplexity.mjs` (sonar-pro, artifact auto-stripped) — same artifact. Verdict **FAIL** (exit 2), pass 1.
- Scope note: text/claims-level comparison; the visual pass ran in-build (B-14: it.1 8.6 FAIL → it.2 9.2 PASS, design-review.md, PR #81).

## Verdicts
- **D-DESIGN-DIFF old-vs-new: PASS** — GPT-5 `vs prior — better for audience: true` (the domain pivot from the 2017 event site to the books' home is judged right for the audience; the 2017-context loss is exactly the parked Q-HR-ARCHIVE question).
- **GPT-5: FAIL** — bibliographic claims without surfaced proof; buy-path and press flows "unproven" (refuted below — artifact-scope); day-precision dates.
- **Perplexity: FAIL** — the Gourmand 2023 "Best in the World" award is **externally CONFIRMED** (The Hindu); Harmony's bibliographic details (dates, 280 pp, publisher) and the "All Published by Roli Books" blanket are not externally verifiable yet.

## Adjudication

**CONFIRMED — routed to owner attention (no fixes this session):**
1. **Pre-event re-verification of Harmony's bibliographic facts.** "International edition since 14 July 2026", "US trade edition 28 July 2026", "March 2026", "280 pages", and the "All Published by Roli Books" blanket all trace to `content/books.json` ← the 16 Jul books brief (docs/site-briefs/healing-recipes-books.md). Perplexity found no external listing yet for Harmony — expected for a brand-new title, but these must be re-verified against the live Roli Books / ISBN listing before the end-July launch event. A wrong printed date at the launch would be exactly the staleness failure the no-prices rule exists to prevent.
2. **Author-page accreditation lines (NABH, WHO-GMP)** — same treatment as fleet-wide: NABH is externally corroborated (NABH portal AH-2024-0250); link or attribute on the fix lane.
3. Day-precision PUBLICATION dates are shipped while the launch-band guard bans day-precision EVENT dates — consistent (different fact classes, publication dates are sourced) but worth the owner's glance since Perplexity cannot yet confirm them externally.

**REFUTED (with evidence):**
- "Buy path unproven / /books/:slug may not exist": `sites/healing.recipes/app/books/[slug]/page.tsx` exists; PR #81 shipped a retailer-allowlist guard + redirect-completeness test; CI green.
- "No press kit/page, only a generic email": `app/press/page.tsx` exists with sourced coverage (The Hindu award report, Travel Potpourri review, publisher features labelled as publisher promotion — honest-steward register).
- "Legal pages missing": `/privacy`, `/terms`, `/cookie-policy` routes exist (@kairali/legal).
- "Award scoping relies on hidden data": the award-misattribution guard (PR #81's 8 data-integrity guards) pins the award to the one winning book.
- "1989 first centre / 1999 Healing Village unverifiable": both are owner-ruled locked facts (AHV opening 14 Feb 1999 locked by the 15 Jul ruling batch; 1989 is the best-evidenced date in the lineage record — co-founder's own words + four corroborating sources).

**ALREADY-RULED / LOCKED:**
- No prices anywhere (buy click is the KPI — staleness guard); launch band is a flagged placeholder with a test banning day-precision event dates until the owner supplies them; author never styled "Dr."; 2017 archive question parked as Q-HR-ARCHIVE; legacy phone withheld pending Q-HR-PHONE.
- "from a family practising Ayurveda since 1908" is the licensed D-1908 phrasing (healing.recipes does NOT carry the "unbroken" extension that three sibling sites do).

**DESIGN CONSIDERATIONS:**
- GPT's suggestion of retailer buttons on the home Featured block as a stopgap, and surfacing the Gourmand proof link in the award band itself (it lives on /press today), are reasonable iteration candidates.

## Disposition
**pending-triangulation: CLEARED for healing.recipes** — pass 1 ran on both verifiers and was adjudicated; evidence committed. Passes 2–3 belong to the fix lane after owner rulings; item 1 (Harmony bibliographic re-verification) should land BEFORE the end-July launch event.
