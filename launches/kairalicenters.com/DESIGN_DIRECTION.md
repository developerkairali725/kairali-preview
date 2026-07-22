# kairalicenters.com — MODE B DESIGN DIRECTION (front gate: design_direction)

- Written: 2026-07-18 (weekend rebrief lane). **ONE direction, as the law requires** — tokens + a single hero mockup. No pages are built until this row and golden_page are signed.
- Mockup: `design-direction/hero-mockup.html` · rendered `hero-desktop-1440x900.png` + `hero-mobile-390x844.png` (real Chromium renders of the actual HTML, not illustrations).

## The direction: "The Healing Atlas"

One idea carries the site: **Kairali is not a clinic with branches — it is a century-old family network radiating from Kerala to five countries.** The signature element is the **atlas panel**: a deep forest-700 surface with an abstract marigold route-map — node size proportional to the REAL per-country center counts (8/3/1/1/1 from `@kairali/facts`), warm arcs from the India hub. It reappears at small scale as the wayfinding motif (hub page header, "nearby centers" modules, region pages), so the network idea is felt on every page, not asserted once.

Around it: calm heritage. Ivory ground, Kurale display serif speaking the network numbers as the headline ("Fourteen centers. Five countries. One family tradition." (D-KC-HEADLINE) — counts computed from `@kairali/facts`), one real photograph anchored to a real center with a caption that names it, and the four-credential trust strip (Since 1908 · NABH · 14 centers/5 countries · Physician-led). Sexy comes from confidence and specificity — numbers that are real, a map that is data, a photo that is ours — not from motion gimmicks.

## Anchoring (MODE B honesty — what this is reasoned FROM)

`design-intake/REFERENCES.md` is EMPTY (owner has not supplied references for this domain; the agent does not fill it). This direction is therefore anchored to the only owner-validated design signals that exist, named plainly:
1. **The brand manual** — `packages/ui/brand-tokens.css` + DESIGN_DOCTRINE.md; wins over everything (doctrine d). Every hex/typeface/radius below is the manual's, unmodified.
2. **The current build's 9.0/10 design-gate PASS** (launches/kairalicenters.com/design-review.md, 14 Jul, two iterations) — the one aesthetic for this domain a reviewer has scored and the owner's pipeline has accepted: ivory/forest/Kurale calm-heritage, one-accent restraint, single filled primary per view. This direction keeps that foundation and adds the missing warmth the review itself flagged (sparse below the fold, text-only cards, single photo).
3. **The D9(iv) gallery law** (Awwwards/Mobbin/CSSDA primary; component-level only): the atlas/route-map hero panel and overlapping photo-card are established best-living-template component patterns (editorial travel/network sites); the nearby-center module is the category best practice (competitor research §1/§5). No whole-page copying.

If Abilash drops anything into `design-intake/` before Monday, MODE A takes over and this proposal is discarded without argument.

## Tokens (verbatim from the manual — no new palette, no overrides)

| Role | Token | Value |
|---|---|---|
| Page ground | `--ivory` | #F7F4EA |
| Interactive / primary buttons / links | `--forest-500` | #006038 |
| Display headings, dark panels | `--forest-700` | #004226 (alt dark `--forest-800` #003720) |
| Single accent (atlas arcs, one moment per light view) | `--marigold-400` / on dark `--marigold-300` | #EEB41E / #F0BF3E |
| Overlines, captions | `--bronze-600` (body-size on light) / `--bronze-400` (≥14px bold) | #875F1F / #C1882C |
| Focus ring, secondary identity | `--leaf-500` (`--leaf-700` body on light) | #8E9D35 / #636E25 |
| Type | `--font-display` Kurale 400 (h1–h3, never bold) · `--font-body` Asap · `--font-caption` Lato | manual |
| Shape | pills for ALL actions (999px) · cards 16px radius, white, warm shadow · 4px spacing grid · 1120px layout / 720px prose | manual |

Accent law kept: the marigold arcs live on the DARK atlas panel (marigold-on-dark is the manual's allowed use); the light view keeps at most one marigold moment. Sub-14px labels never use bronze-400 (the review's contrast lesson, now with a real `--bronze-600` to step to).

## What the hero mockup shows (and the rules it encodes)

- Desktop: single filled primary ("Find your center"); header WhatsApp CTA present but outline (the review's conversion fix, kept); Kurale h1 with the facts-line; atlas panel right with real count badges; photo-card overlapping the panel, captioned with a REAL center name.
- Mobile (pass-2 revision): "Find your center" is the single filled primary IN the first viewport, with a city-chip selector (real centre cities from the facts roster) directly beneath; the sticky bottom bar becomes two-action contact UTILITY chrome (Call + WhatsApp) rather than a competing filled pill; atlas stacks below; floating-stack cap unchanged (consent → sticky → chat at bottom:84px).
- `data-cta` attributes already on every control in the mockup markup (whatsapp_click, browse_india, consult_book).

## How the direction extends to the rest of the site (for golden page and beyond)

- **Center pages**: ivory page, forest-700 "center passport" header block (name · franchise-partner line where D-KC-PARTNERS applies · NAP · hours · GBP/directions), mini-atlas locating the center, photo where real photography exists, therapies offered, named physicians where verified, nearby-centers row, enquiry form with consent. Honest-gap lines stay visible (Raipur hours "to be confirmed").
- **Hub `/centers/`**: Birla-style photo cards (real images only) grouped India/World, atlas as the section header, filter by country/city.
- **Partner centers**: the franchise-partner statement is designed as a TRUST chip (bronze overline + partner name), not a footnote — disclosure worn proudly (competitor research §3).
- **Therapy/condition pages**: prose measure 720px, one therapy photograph from the mined library, sticky enquiry rail.
- **Motion**: route-line draw-in on the atlas once on load, `--ease-brand`, ≤400ms, fully disabled under `prefers-reduced-motion`; nothing else moves by itself (no carousels, no scrolljacking).

## Flags carried into this gate (not silently resolved)

1. "Since 1908" appears in the mockup because the 9.0-PASS build shipped it; the 1908-vs-1989 reconciliation (mining audit §3.4) must close before launch copy is final.
2. The WhatsApp CTA number is UNSET in the mockup (href="#") — the current build reuses Priya's KTAHV number; strategy gate flags the correct centers-network routing for your word.
3. Per-center photography does not exist yet (asset manifest §5) — hub/center cards use the mined therapy/center-library imagery until Abishek's round delivers; no stock, ever.

## Pass-2 revisions (external AI review, Gate 1 — D-20260718-12)

Pass 1 (both auditors, `design-review/2026-07-18-pass1.md`): **FAIL / FAIL.** The three coordinator-scoped findings, and what changed:

1. **D-KC-DOMAIN ruling breach (blocking):** nav/hero/CTA used "Centres". Every site-copy instance in the mockup is now "Centers" ("Fourteen centers…", nav "Centers", "Find your center", "14 centers · five countries", caption "…the flagship center"); all four rebrief artifacts were grepped and de-drifted the same way. Verbatim legacy quotes and code identifiers (`CENTRES`, `centre_click`, `lib/centres.ts`) stay as they are — quotes and code are not site copy. Roster `name` fields as mined read "Kairali Ayurvedic Centre"; whether each physical center's REGISTERED signboard name is Centre or Center is a NAP-round question (Abishek) — flagged, not assumed, before any page renders the name. **Flagged for the build wave:** `@kairali/facts` exports `CENTRES_NETWORK_LINE` = "14 treatment centres across five countries" — the package's copy string needs a D-KC-DOMAIN alignment PR before any page renders it (a code change outside this artifacts-only lane).
2. **YMYL claim hygiene:** the lede blended verified NABH with unverifiable WHO-GMP in one sentence (Perplexity: MISLEADING). The lede is now NABH-only and names the accredited entity ("the family behind the NABH-accredited Ayurvedic Healing Village" — NABH portal AH-2024-0250, valid 2024-04-25 → 2027-04-24, Perplexity-verified). The **WHO-GMP tile is REMOVED** from the mockup — my site mining does not evidence it; it exists as the KAPPL entity description in the fleet rulebook, so it may return to copy only with certificate evidence (certificate number/site/dates) — parked, not printed. Its tile slot now carries the facts-computed "14 centers across five countries" (Perplexity: SUPPORTED). "Qualified BAMS doctors" softened to "Named, qualified doctors" (universality of BAMS across all 14 centers is unverified); the "replies within a day" promise removed (unverifiable SLA). "Since 1908" KEPT: Perplexity verified it against Kairali's official pages (SUPPORTED, high confidence) — the residual 1989-vs-1908 reconciliation with the live about-us copy remains flag #1 below.
3. **Mobile finder-first:** "Find your center" was hidden on mobile. It is now the single filled primary in the first viewport, with a city-chip selector (New Delhi · Gurgaon · Faridabad · Patna · Vadodara · Raipur · Guwahati · International — facts-roster cities only) directly beneath, and the sticky bar reworked into two-action Call + WhatsApp utility chrome. Both viewports re-rendered (`hero-desktop-1440x900.png`, `hero-mobile-390x844.png`).

Auditor recommendations deliberately NOT taken in pass 2 (scope honesty): interactive map/city-selector behaviour, hover/focus state specs, and the WCAG contrast audit are build-time work for the golden page, not mockup work — they are recorded as golden-page obligations; the decorative-map-vs-selector tension is resolved by the city chips carrying the selection job while the atlas stays narrative.

## Pass-2 verdict + judged critique (evidence: `design-review/2026-07-18-pass2.md` — FAIL / FAIL)

The revised mockup was re-audited; both auditors returned FAIL again, on largely NEW grounds. Per the 15 Jul loop law the caller judges the critique before revising — judgment, honestly:

**Accepted — queued as pass-3 revisions (small, non-ruling-breaching):**
- Drop the year from the hero overline and trust tile until 1908-vs-1989 is reconciled (the mockup contradicted the brief's own constraint — fair hit; pass-1 Perplexity externally supported 1908, but the internal reconciliation is still open, so the hero should not lead with it).
- Caption "the flagship center" is my inference from the corporate-office address — change to the mining-evidenced "corporate office & center, Mehrauli".
- Desktop finder-first: city chips + a Call affordance on desktop too; single "Delhi NCR" chip routing to the region page (two Delhi centers branch there); reduce atlas dominance toward 60/40.
- NABH tile gains a "view certificate" affordance (scope + validity are real: AH-2024-0250, to 2027-04-24).
- "Physician-led" tile scoped to consultations, not an all-14-centers staffing claim.

**Rejected — collides with owner rulings (escalation, not revision):**
- Perplexity ruled the headline "14 centers · five countries" CONTRADICTED because public Kairali marketing profiles claim 25–45 centers in 8–10+ countries. Those larger figures are precisely the stale/aspirational register data the owner's ruling overrides: canonical counts come ONLY from `@kairali/facts` (14/5 — KAC-site-canonical, owner's-brother confirm, PROJECT_CONTEXT §12; the 18/9 register claim was already rejected on the same basis). Printing 25–45 would breach HARD GATE 6 and the counts ruling. Pass-1 Perplexity, reading the canonical KAC site itself, marked the same 14/5 claim SUPPORTED — the pass-2 contradiction is a sources problem, not a copy problem. **Pass 3 should feed the counts ruling + facts module as `--context` so the auditor verifies against the canonical source; the copy does not change without the owner's word.**

**STOPPED here:** the coordinator's mandate was revise → re-run → commit pass-2 evidence → stop at the gates. A pass 3 needs (a) the ruling-context feed above and (b) the owner's word on the accepted revision list — it will not pass while the auditors are scored against non-canonical public counts.

## Pass-3 verdict + judged critique (evidence: `design-review/2026-07-18-pass3.md` — FAIL / FAIL, but materially converged)

Pass 3 applied the coordinator-endorsed revision list (year off the hero; "Founded 1989" canonical phrasing + licensed lineage line as the heritage tile; corporate-office caption; desktop city chips + header Call; single Delhi-NCR chip; NABH view-certificate affordance; physician-led scoped to consultations) and fed the canonical rulings as `--context` (`design-review/context-rulings-pass3.md` + `packages/facts/src/index.js`).

**What the context feed fixed (coordinator's counts ruling upheld):** the truth audit now marks SUPPORTED — "14 centers across five countries", the per-country badges (8/3/1/1/1), the Mehrauli corporate-office caption, the NABH certificate (AH-2024-0250), the city chips, and the overall design direction. The pass-2 stale-counts contradiction is gone.

**Remaining FAIL grounds, judged honestly:**
1. **Network-uniformity YMYL phrasing (LEGITIMATE — needs the owner's word, because it touches the signature headline).** "One family of physicians" (h1) and the physician-led tile imply all 14 centers — including the six franchise-partner "Health Spa" centers we deliberately refuse `MedicalClinic` schema for — are uniformly physician-led with video consultation. That is the prose form of the same overclaim our schema plan already avoids. Pass-4 options for the owner: h1 → "…One family tradition." (lineage, no staffing claim) or scope the physician-led tile to owned Indian centers; lede → drop the uniform video-consult implication. **CHANGES-level decision — the headline is the direction's signature line, not mine to rewrite silently.**
2. **Heritage facts ruled unverifiable-by-construction (STANDS, no change).** "Founded 1989" and "a family practising Ayurveda since 1908" came back UNVERIFIABLE externally — while the auditor itself acknowledges the internal canonical context rules them. D-1908 anticipated precisely this: for pre-registry family facts the family is the primary source, and "unverifiable from a registry" ≠ false. The wording used is the licensed canonical form (D-LIN-1989-WORDING).
3. **GPT design nits (one refuted with numbers, one contradicted by the render).** (a) "Small gold text likely fails WCAG AA": computed ratios — bronze-600 #875F1F on ivory = **5.18:1** (AA pass for normal text; the mockup uses bronze-600 precisely because bronze-400's 3.1:1 failed, per D-BRONZE-CONTRAST), marigold-300 on forest-700 = 6.77:1, forest-700 on ivory = 10.56:1. (b) "Mobile hero lacks immediate Call/WhatsApp": the 390×844 render shows the fixed Call + WhatsApp bar inside the first viewport at first paint. Remaining polish recs (cert ID text in tile, Delhi-NCR tooltip, International split-chip, consultation-scene photo, chip scroll affordance) are recorded as golden-page obligations.

**Position at STOP:** three passes run, evidence append-only in `design-review/`. The loop has converged to (1) a copy decision only the owner can make and (2) auditor findings the owner's rulings already dispose of. Per the 15 Jul loop law the next pass follows the owner's CHANGES note — recommended reply: `CHANGES h1 "One family tradition" + scope physician-led to owned centers`, or `APPROVE design_direction` accepting the residuals as ruled.

## Pass-4 verdict + judged critique (evidence: `design-review/2026-07-18-pass4.md` — FAIL / FAIL; residuals are advisory-class or evidence-feed gaps)

Applied per D-KC-HEADLINE (owner, 18 Jul): h1 → "One family tradition"; physician-led tile → "CONSULTATIONS AT KAIRALI-OWNED CENTERS"; lede → "— in your city, or by online consultation" (no uniform video-consult implication). Both viewports re-rendered; rulings context extended with D-KC-HEADLINE + D-EXTREVIEW-OWNER-FACTS (§6 of the context file).

**Truth audit (Perplexity) is now effectively clean on facts:** SUPPORTED across the board — 14/5 + distribution, NABH certificate, the lede, "Founded 1989", the Mehrauli caption, the CTAs. Its FAIL rests on exactly two residuals, both owner-fact-class under D-EXTREVIEW-OWNER-FACTS:
1. "A family practising Ayurveda since 1908" — UNVERIFIABLE externally, which D-1908 rules is the expected absence (family = primary source); the auditor itself notes "owner-confirmed … low risk".
2. "Physician-led — consultations at Kairali-owned centers" — MISLEADING for lack of per-center public substantiation. The scoping IS the owner's ruling (D-KC-HEADLINE: physician-led claims scope to owned centers); under D-EXTREVIEW-OWNER-FACTS reviewer doubt on an owner-confirmed fact is ADVISORY, not blocking.

**Judgment:** the auditor tooling predates D-EXTREVIEW-OWNER-FACTS and still renders strict FAIL on advisory-class doubts — the verdict enum has no advisory lane. Implementing the ruling in `scripts/audit-*.mjs` / the verdict law is a FLEET TOOLING change (separate PR, owner-gated; rule g — a gate is never weakened by its caller, and I do not touch the tooling from this lane). Until then a formal dual-PASS evidence file cannot exist for any design carrying owner-facts that lack third-party paper.

**Design audit (GPT) residuals:** (a) mobile persistent Call/WhatsApp — the fixed two-action bar IS inside the first viewport in the render; GPT wants it acknowledged/pinned in the header too — mechanical tweak, queued; (b) contrast "no evidence provided" — the computed spec (bronze-600 on ivory 5.18:1 AA-pass, marigold-300 on forest-700 6.77:1, forest-700 on ivory 10.56:1) existed in this file but was not fed to the auditor — a context-feed gap, queued for the next pass's `--context`; (c) advisory polish (complete city-chip set incl. Gurgaon/Faridabad, owned-tag in pickers, badge icon on NABH, hero-card rebalance) — logged as golden-page obligations.

**Position at STOP (per coordinator mandate):** revisions applied, pass 4 run with the ruling feed, evidence committed append-only. What stands for the owner's judgment: (i) accept the two advisory-class truth residuals as ruled (D-EXTREVIEW-OWNER-FACTS) and sign `design_direction` on this evidence trail, or (ii) hold the gate until the advisory-lane tooling PR lands and a formal dual-PASS is achievable, plus (iii) the two mechanical GPT items land in the next revision either way.

---
**reply APPROVE design_direction or CHANGES <notes>** (MODE B: nothing is built until this is signed; drop any design into design-intake/ at any time to switch to MODE A)
