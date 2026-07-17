# Triangulation note — kairalihospitality.com (BACKFILLED 2026-07-17)

**2026-07-17 12:20:00 IST · Session 2B evidence backfill · Standing triangulation rule (docs/plans/2026-07-17-factory-audit-and-launch-roadmap.md, "Secondary / external auditors") + D-DESIGN-DIFF post-build external comparison (DECISIONS.md 2026-07-16 19:40).**

The wave shipped without its cross-model pass — the 17 Jul retro-audit marked it MISSING (pending-triangulation queue). This note clears that state for kairalihospitality.com: both external verifiers ran 17 Jul 2026, full raw outputs in `triangulation-evidence/`.

## What ran
- `scripts/audit-gpt.mjs` (GPT-5) — artifact: `sites/kairalihospitality.com/app/page.tsx` + `app/llms.txt/route.ts`; prior (old-vs-new): `content-mined/kairalihospitality.com/home.html` + `about-us.html`. Verdict **FAIL** (exit 2), pass 1.
- `scripts/audit-perplexity.mjs` (sonar-pro, artifact auto-stripped) — same artifact. Verdict **FAIL** (exit 2), pass 1.
- Scope note: text/claims-level comparison; the visual pass ran in-build (B-14: 8.9 → 9.4 it.2, fleet's highest — design-review.md, PR #86).

## Verdicts
- **D-DESIGN-DIFF old-vs-new: PASS** — GPT-5 `vs prior — better for audience: true` (vs a stale legacy with the ruled-wrong Since-1908 footer).
- **GPT-5: FAIL** — JV/ownership language vs the stated no-ownership rule; unsourced NABH/WHO-GMP; consultancy without proof artifacts.
- **Perplexity: FAIL on relationship claims, but it CONFIRMED the core facts** — NABH AYUSH accreditation (portal.nabh.co AH-2024-0250), the Clinical Establishment certificate, 1989 founding + founders, and the WHO-GMP certification of the group's manufacturing. What it could NOT confirm is the ownership framing (below).

## Adjudication

**CONFIRMED — routed to owner attention (no fixes this session):**
1. **Ownership/relationship framing — this is auditor evidence FOR the already-open Q-KH-JV-NAME.** The page, layout meta and llms.txt say "the group's European joint venture" (page.tsx:270, layout.tsx:24, llms.txt route:15,19) and "the group's boutique wellness property" for Villa Raag. Perplexity: katerinaresort.cz describes the Ayurvedic Pavilion as run **"in cooperation with"** Kairali; no public corporate record documents a JV legal structure or Villa Raag ownership. The code comment at page.tsx:22 records honestly that "joint venture" is the owner's own dictated framing — so this was a conscious carry, not drift. Both auditors independently recommend softening ("in cooperation with" / "operated with") until the legal form is ruled. **Q-KH-JV-NAME's second half (legal form) now carries external-auditor weight; the JV *label* itself, not just the resort name spelling, needs the ruling.**
2. **"{LINEAGE_YEARS} years, unbroken" (page.tsx:289)** — "unbroken" exceeds the licensed D-1908 phrasing (fleet-wide finding: also arogyashala.in:260, kairaliyoga.com:653). Owner ruling needed.
3. **NABH / WHO-GMP without proof links** — both externally corroborated by Perplexity this run; fix-lane candidate: cite the NABH listing + attribute/link WHO-GMP on-page and in llms.txt.

**REFUTED (with evidence):**
- "Broken legal links": `/privacy`, `/terms`, `/cookie-policy` routes exist (@kairali/legal).
- "Banned-lexicon guard not evidenced": the guards import the clinical lexicon from packages/compliance and run in CI (guards 8/8, PR #86); the KTAHV register carve-out is machine-enforced.
- "29/29 redirects claimed without artifacts": the curl-verified redirect evidence is in `launches/kairalihospitality.com/seo-aeo-geo-report.md` + the PR evidence bundle. Meta-point accepted: include it in future triangulation bundles.
- "Text-only Katerina panel is an afterthought": it is a documented honest constraint — no Kateřina photograph exists in the library, and fabricating one is banned; the panel is deliberately text-first (PR #86). GPT's suggestion (licensed partner media with credit) is a legitimate fix-lane path.

**ALREADY-RULED / LOCKED:**
- Locked contacts (info@kairali.com, interim WhatsApp); "on the horizon" band deliberately omitted (zero announceable facts, rule 6); "Swatak Katrina" dictated spelling is guard-tested to never ship; Q-KH-2008 / Q-KH-PHONE / Q-KH-BRIEF-RULINGS already queued to the owner.

**DESIGN CONSIDERATIONS:**
- Consultancy proof artifacts (mini case notes with outcomes, capabilities deck) and a footer office address/phone for investor-register trust — good iteration candidates once the owner rules on what may be published.

## Disposition
**pending-triangulation: CLEARED for kairalihospitality.com** — pass 1 ran on both verifiers and was adjudicated; evidence committed. Item 1 folds into Q-KH-JV-NAME (now with independent external evidence that "cooperation", not "joint venture", is what public sources support). Passes 2–3 belong to the fix lane after the owner's rulings.
