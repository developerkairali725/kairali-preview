# Design-Philosophy Audit — kairali.com (post-hoc law compliance)

**2026-07-15 13:29:47 IST · Audit-only pass — no code modified.**
**Subject:** `sites/kairali.com` as built 14 Jul ~18:40 IST (design gate 9.2 PASS, commit `0a97f5e`/PR #24) + the 22:55 legal-pages addition (`/privacy`, `/terms`, `/cookie-policy`).
**Why this audit exists:** four bodies of law were finalized AFTER the site was built and gate-passed — the site was never scored against them. This pass diffs the built artifact against each law source.

| Law source | Finalized | vs build (14 Jul ~18:40) |
|---|---|---|
| docs/design/DESIGN_DOCTRINE.md Parts 1–2 | 14 Jul (pre-build) | in force at build |
| DESIGN_DOCTRINE.md **Part 3** (YC/AI-design techniques) | 14 Jul (post-build ingest) | post-hoc |
| CLAUDE.md OPERATING PRINCIPLES — "sexy sells" design bar | 14 Jul evening (v1.4) | post-hoc |
| Trust-furniture law (DECISIONS.md 2026-07-14 22:40:00 IST) | 14 Jul 22:40 | post-hoc |
| docs/design/chat-bubble-placement.md | 14 Jul 19:45:42 | post-hoc (by ~1h) |
| docs/strategy/POSITIONING_AND_MOA.md (§5 mapping) | 15 Jul 12:36:19 | post-hoc |
| Build Decision Matrix / SEO-protection law (CLAUDE.md + DECISIONS 15 Jul 13:19:11) | 15 Jul | post-hoc |

**Evidence base:** source audit of `sites/kairali.com/app/page.tsx`, `app/layout.tsx`, `app/globals.css`, `app/chatbase-loader.tsx`, `public/images/` (9 files), `sitemap.ts`; `packages/ui/brand-tokens.css`; `launches/kairali.com/design-review.md` (the 9.2 gate record incl. its computed-style/live-session findings); committed captures `home-desktop-full.png` / `home-mobile-full.png`; `docs/group-inputs/kairali-com-agency-build-intake.md`; DECISIONS.md/QUESTIONS.md entries cited inline.

---

## 1 · COMPLIANT — what already meets the post-hoc law

**Compliant count: 19** (specific, evidence-linked):

### vs DESIGN_DOCTRINE Parts 1–2
1. **No carousels, no auto-rotation, no scrolljacking** (§1.1) — the page is static sections only; motion is token-fade transitions.
2. **Desktop nav = visible links, never hamburger** (§1.2) — `globals.css` ≥768px `.site-nav{display:flex}`, comment cites the doctrine clause by name; links padded to 44px.
3. **Touch targets ≥44px everywhere** (§1.2 / A4) — buttons `min-height: var(--control-lg)` (48px); footer `a[data-cta]` padded to 44px via padding-block/negative-margin; verified computed in the 9.2 review.
4. **No generic link labels / naked "Get Started"** (§1.2) — cards say "Visit the site →" inside a named-brand card (information scent carried by context); hero CTA has helper copy ("One message reaches the whole group — we will point you to the right Kairali door.").
5. **No text over busy photos** (§1.3) — all copy sits on ivory/white/forest-700 surfaces; photo captions on white caption bars.
6. **No walls of text** (§1.3) — overline → heading → ≤2 short paragraphs per section; `--measure-prose` and 58ch caps.
7. **No entry modals, no needy patterns, no fake urgency, no fabricated counts** (§1.4/§1.7) — every number is a locked fact (1908, four generations, nine countries, fifty acres, NABH, WHO-GMP, named founders).
8. **Overlay-stack management** (§1.4, ≤3 floating elements) — consent-open suppresses BOTH chat bubble and popups (`:root[data-consent-open] … display:none`, live-verified in the gate); one floating decision at a time.
9. **Performance-as-UX levers** (§1.6, lever 4) — hero `fetchPriority="high"`, explicit width/height on all 9 images (CLS 0), below-fold `loading="lazy"`, `next/font` self-hosted `display:swap`, Chatbase deferred to first interaction / 6s idle so it never competes with LCP.
10. **Lever 1 — real, art-directed library photography** — all 9 images are Kairali library originals (IMAGE_MANIFEST.md), no stock, no AI humans; dated place captions ("The Ayurvedic Healing Village, Palakkad — morning.").
11. **Lever 2 — one-accent law** — DOM sweep in the gate found exactly ONE marigold element on the light ground (`.accent-rule`) at 375 and 1280; marigold-300 on the dark band is the documented ch.08 dark-surface rule, not a second accent.
12. **Lever 3 — typographic discipline** — Kurale 400-only display / Asap body / Lato caption via token stacks; `clamp()` fluid h1/h2; layout on `--measure-layout` 1120px.
13. **§3 hierarchy laws** — proposition top-left in the F-path, one forest-500 primary per view, all action buttons `--radius-pill` (uniform shape language so the accent is the only differentiator).
14. **Luxury warning (§3)** — contact path never hidden: header CTA, hero CTA row, sticky mobile bar, footer links, all `data-cta`-wired (whatsapp ×5, email ×3, brand ×6 verified in served HTML).

### vs brand-tokens law (packages/ui/brand-tokens.css)
15. **Tokens only, no rogue hexes** — the gate's computed-style audit matched forest-700/forest-500/bronze-400/ivory/ink/leaf-500 focus ring exactly; undocumented ramp steps (marigold-300 etc.) correctly left as anchor fallbacks per the DO-NOT-INVENT header; `prefers-reduced-motion` inherited from the token sheet; nothing bounces, hover deepens one ramp step.

### vs chat-bubble-placement.md
16. **Mobile bubble behaviour is the law's own reference implementation** (§7 names kairali.com): bubble lifted to `bottom: 84px` above the sticky bar (§2 pattern 1), proactive popups suppressed <768px (§3), consent-yield single-slot (§2 pattern 3), deferred/facade-style load (§5 — script injected on first interaction or idle, never competing with initial render).

### vs POSITIONING_AND_MOA.md §5 (partial)
17. **Trust strip leads with the institutional moat core** — Since 1908 / NABH-Accredited / WHO-GMP Certified / Nine Countries is Angle 2 material in the right place; **per-pillar register law is exactly the §5 rule**: KTAHV card fully clinical (patient/physician/treatment/programme/consultation/admission/discharge; banned-word scan zero), Villa Raag card hospitality-register with zero clinical claims (D&MR guardrail respected), Products card pharma-register. Locked facts correct (info@kairali.com; +91 92898 38797; zero …38777).

### vs the 9.2 gate record (what was already fixed after it)
18. **/privacy, /terms, /cookie-policy shipped 14 Jul 22:55** — the review's "no /privacy page" honest limitation is closed; `ConsentBanner privacyHref="/privacy"` wired in layout.tsx.
19. **Real OG image** (`/og.jpg` 1200×630 footbridge derivative) + Organization/WebSite/BreadcrumbList JSON-LD + canonical — the AEO/schema plumbing the gate verified still stands.

---

## 2 · GAPS — vs each law source, with severity and concrete fix

Severity legend: **LB** = launch-blocker (gates go-live/DNS flip) · **SF** = should-fix (before or during the kairali.com build-out) · **P** = polish.

### 2.1 vs POSITIONING_AND_MOA.md §5 — the biggest conceptual gap

| # | Gap | Severity | Fix |
|---|---|---|---|
| G1 | **The page speaks to a generic direct consumer; §5 assigns kairali.com to M5a/M5b B2B + press + franchise-curious — explicitly "NOT a direct-consumer acquisition surface."** The WhatsApp-first CTA system ("One message reaches the whole group…", "Chat With Us on WhatsApp" ×3) is a consumer-Decision device. There is NO trade/press/partner entry point anywhere: no "For travel partners & agencies", no press/media section, no B2B credibility asset (§1 Rank 6: "co-op material every independent can deploy" — the anti-Fit-Reisen-concentration play). | **SF** now (copy/section level); full B2B + press sections belong to the post-protection-map build-out | Reframe hero + add one B2B/press block: (a) hero lede keeps the moat but adds the institutional framing ("the credibility hub the specialist agencies and press check"); (b) a "Travel trade & press" strip or footer section routing to info@kairali.com (do NOT invent a trade email — rule 6; ask Abilash if a dedicated alias exists); (c) plan /partners and /press as build-out pages. |
| G2 | **The moat is under-told.** "10,000+ practitioners trained" — the fourth pillar of Angle 2, sourced in POSITIONING_AND_MOA §3 — appears nowhere. "118 years" is never stated as a number (only "since 1908"); the audits use the number as the memorable institutional form. | **SF** (mechanical copy) | Add "10,000+ Practitioners Trained" as a fifth trust-strip cell (or swap into the four); introduce the "118 years" numeral once in hero or heritage copy. Both are sourced facts, no invention. |

### 2.2 vs Trust-furniture law (DECISIONS.md 14 Jul 22:40)

| # | Gap | Severity | Fix |
|---|---|---|---|
| G3 | **Trust furniture is text-only and incomplete.** NABH/WHO-GMP exist as `dt/dd` text; there are NO award assets, NO certificate visuals, NO media-coverage/"as featured in" press bar — the law requires awards + certificates + accreditations + media coverage "showcased in the RIGHT sections… trust strip / about / footer row; shared component." MOA-matched furniture for THIS site's audience (agencies, press, franchise investors) = accreditation marks, award logos, press logos, training count — institutional proof, not patient testimonials. | **SF** — needs team assets | Build the shared trust-furniture component in packages/* (the law says shared, not per-site); populate from team/archive asset files (Astha / archive-drive handoff). CAUTION: award proper nouns must be Abilash-approved for the group surface — e.g. "World Luxury Spa Awards" carries banned-register words; DECISIONS already ruled award names = human judgement. Until assets land, the text strip stays (correct per rule 6 — never fabricate a press bar). |

### 2.3 vs CLAUDE.md OPERATING PRINCIPLES — the "sexy sells" bar

| # | Gap | Severity | Fix |
|---|---|---|---|
| G4 | **Clean-premium but short of memorable.** The composition is the standard shape: left-text/right-photo-card hero → 4-stat strip → 3-col card grid → 2-col feature → dark quote band. Token-faithful and calm — but nothing a visitor would describe to a colleague, and the flagship group site is exactly where "memorable beats safe" bites. No best-living-template inspiration was recorded (zero Awwwards/Mobbin/CSSDA citations in launches/kairali.com/ or the intake — the D9(iv) mandatory-input and §5.1 cite-your-source rules are unmet, both technically in force pre-build). The build predates the rule and was NOT explicitly flagged as an early-wave speed build, so the exception doesn't cover it. | **SF** — the beauty pass | **The single art-direction move:** commit the hero to the misty footbridge photograph as a full-width cinematic establishing shot — it is the strongest asset on the page and is currently shrunk into a 3:2 bordered card — with the H1 on the ivory ground above it (never overlaid on the busy image — doctrine §1.3), paired with an oversized Kurale numeral device ("1908 — four generations") as the institutional signature. Second candidate already in the record: the "heritage-illustration art direction" the intake (§Verdict) prescribed but that never shipped. Execute via the Part 3 process (G5) and cite gallery sources in the launch evidence. |

### 2.4 vs DESIGN_DOCTRINE Part 3 (AI-design techniques)

| # | Gap | Severity | Fix |
|---|---|---|---|
| G5 | **None of the Part 3 input-discipline artifacts exist for kairali.com:** no `soul` section / soul.md distillation, no "designs I love" reference corpus, no mood-board build artifact, no divergent parallel one-shot pass — the build went straight to the convergent token build. (Expected: Part 3 was ingested after the build. It now binds the next design iteration.) | **SF** — process debt gating G4 | Before the beauty pass: write the kairali.com soul section (group-corporate voice, what the brand is NOT, verbatim Abilash language on the moat), assemble the A-register reference corpus (Awwwards/Mobbin/CSSDA; benchmark Aman/Six Senses-grade restraint per the positioning doc's Angle 9), produce the mood board, then run N divergent one-shots before converging on packages/*. |

### 2.5 vs chat-bubble-placement.md

| # | Gap | Severity | Fix |
|---|---|---|---|
| G6 | **Desktop proactive popups are uncapped and off-law.** Chatbase fires THREE stacked sales bubbles over the hero within seconds of load — violating §3 (max ONE proactive per session, 30–60s delay, never on load, ≤15% viewport, behaviour-triggered) — and one popup asserts a "free consultation" offer no locked fact backs (CLAUDE.md rule 6 violation, live on desktop first paint). Mobile is compliant (suppressed). **This is bot-config in Priya's Chatbase dashboard, NOT repo code** — already queued as design-review fix #2; noted here because the bubble law that now makes it a hard violation post-dates the review. | **LB** (config-only) — the unverified offer must not be visible at go-live | In the Chatbase dashboard: cap at one popup, ≥30s delay, group-register copy approved against ch.11, kill the "free consultation" line unless Abilash verifies the offer, swap the avatar to the ch.08 icon tile. Interim repo-side option if the dashboard lags: extend the mobile `#chatbase-message-bubbles{display:none}` suppression to all viewports until config is fixed. |
| G7 | **§5 dialog-accessibility unverified** — focus-trap/Escape/focus-return of the opened Chatbase window was never exercised (third-party). Bubble tap-target size (§1: 48–56px) not explicitly measured either. | **P** (verify, then log) | Add to the weekly QA audit pass per the law's §7 QA hook; long-term the packages/ui floating-stack manager + custom facade launcher (task #11) makes this first-party. |

### 2.6 vs brand-tokens law

| # | Gap | Severity | Fix |
|---|---|---|---|
| G8 | **Raster logo confirmed still in place** — header renders `/images/kairali-logo.png` (67,548 B PNG at 52px; the only logo file in `public/`, no SVG anywhere in the site). Known interim (QUESTIONS.md Q17; review "honest limitations"). Per Abilash: Astha's SVG pack arrived 15 Jul by email — retrieval + swap pending. Note also: the current header composes PNG icon + a Kurale text span as an ad-hoc lockup, and brand-tokens ch.08 comments spec "horizontal lockup 34–40px" in the 64px header — the official SVG lockup resolves both. | **SF** — mechanical once assets retrieved | Pull the SVG pack from the email, place light+dark lockups in packages/ui assets, swap header to the official horizontal lockup at spec size, delete the composed span treatment. High-DPI desktop softness disappears with it. |
| G9 | **Off-rhythm spacing values** — the ch.07 law is "all spacing = n × 4px", but globals.css carries `gap:10px` (buttons, sticky bar), `padding-block:14px`, `margin:14px 0 0` (×3), `figcaption padding 10px 16px`, `.brand-body padding 20px 20px 22px`, `margin-bottom:20px` on the accent rule with `border-radius:2px` and logo `border-radius:4px` (non-token radii). | **P** — mechanical sweep | Round every spacing value to the 4px grid (10→12, 14→16, 22→24, 2→ keep as decorative hairline or use radius-1); candidate for a brand-lint rule so it's caught mechanically fleet-wide. |
| G10 | **Sticky-bar email button is icon-only** (48px square, aria-label only) — doctrine §1.2 warns on icon-only controls without visible text on touch. Mitigations: it's the secondary action, the primary carries text, and the mail glyph is near-universal. | **P** | Either accept as scored (the gate did) or add a "Email" text label when the floating-stack component generalizes the bar. |

### 2.7 vs Build Decision Matrix / SEO-protection law (protection-map implication)

| # | Gap | Severity | Fix |
|---|---|---|---|
| G11 | **Single-page IA vs a legacy site with a full group IA.** The built site is one route (+3 legal pages; sitemap.ts lists only "/"); nav is 4 same-page anchors. The legacy kairali.com carries About / Ayurveda / Hospitality / Products / Centres / Training / Contact (agency intake) and the 15 Jul law says: no DNS flip for a ranked site without live-URL inventory + KEEP/MERGE/301 map + built-out value pages. "Lean at birth, complete at launch" legitimizes the lean start — so this is NOT a defect of the 14 Jul build, but it IS the gate the site must clear. Live mining is already launched (DECISIONS 15 Jul 13:19). | **LB for DNS flip** (not for the staging artifact) | Land the kairali.com protection map (every legacy URL → KEEP/MERGE/301); build the KEEP pages (heritage/about and per-pillar pages are the obvious ranking holders); convert nav anchors to real routes as pages land (`#heritage` → `/heritage` etc. — the current anchor nav should be built with that migration in mind); sitemap.ts grows with each route. No flip until absorbed value ≈ legacy value and Abilash approves. |

### 2.8 Carried debt from the 9.2 gate (still open, now re-severitied under the new law)

| # | Gap | Severity | Fix |
|---|---|---|---|
| G12 | **Review fix #1 unapplied** — on the 375px first paint the hero WhatsApp pill AND the sticky-bar WhatsApp pill are both visible (two identical full-width primaries in one view — tension with the one-primary-per-view law). Verified: no IntersectionObserver / `data-hero-cta-visible` anywhere in the app. | **SF** | Implement as specified in design-review.md fix #1 (observer on `.cta-row` toggles sticky-bar visibility with the brand fade). |
| G13 | **Review fix #3 unapplied** — "Ayurveda" casing wobbles: H1 "Health through Ayurveda" (page.tsx:176) vs "health through ayurveda" (page.tsx:243, :312, :326). | **P** | Pick the casing law (suggestion in the review stands), apply, record in the wiki brand page. |
| G14 | **Committed mobile evidence file still misleading** — home-mobile-full.png shows two lazy-load blanks (cleared as a capture artifact, but the artifact was never re-captured). | **P** | Re-capture with a scroll-settle wait next gate run. |

---

## 3 · PRIORITIZED FIX PLAN

### Apply NOW (mechanical, no new assets, hours not days)
1. **G6 interim guard** — until Priya's Chatbase dashboard is fixed, suppress `#chatbase-message-bubbles` on ALL viewports (one CSS line); the dashboard fix itself is a config task already on the list (cap 1 / delay / register copy / verify-or-kill the offer / avatar swap).
2. **G2** — add "10,000+ Practitioners Trained" to the trust strip + one "118 years" numeral mention (sourced facts, copy-only).
3. **G12 + G13** — sticky-bar first-paint dedupe (review fix #1 spec) and the ayurveda casing law (review fix #3).
4. **G9** — 4px-rhythm sweep of globals.css; propose the brand-lint rule so the whole fleet inherits it.
5. **G1 (copy layer)** — hero/footer B2B-trust reframe + a "Travel trade & press → info@kairali.com" line; flag the dedicated-trade-alias question to Abilash (never invent an address).

### Waits for the kairali.com BUILD-OUT (post protection-map)
6. **G11** — protection map lands first (mining already launched), then the KEEP pages (heritage, about, per-pillar), nav anchors → real routes, sitemap growth. This is the DNS-flip gate.
7. **G1 (structural layer)** — /partners (M5a/M5b enablement + co-op assets) and /press pages as part of the build-out IA.
8. **G4 + G5** — the beauty pass, run the Part 3 way: soul.md → reference corpus (Awwwards/Mobbin/CSSDA, cited) → mood board → divergent one-shots → converge on tokens. The single move to brief: full-width footbridge establishing hero + oversized Kurale "1908 / four generations" numeral device (heritage-illustration direction as the alternate).

### Needs Abilash / team assets
9. **G8** — retrieve Astha's SVG logo pack from the 15 Jul email → swap header lockup (mechanical once files are in hand).
10. **G3** — trust-furniture component: award/certificate/press asset files from team/archive + Abilash's ruling on which award names may appear on the group surface (banned-register proper nouns).
11. **G6 (permanent)** — Chatbase dashboard config (Priya) + Abilash verification of the "free consultation" offer; longer-term the packages/ui floating-stack + custom facade launcher task (#11) brings the whole bubble under first-party law.

---

## 4 · VERDICT SUMMARY

- **Compliant: 19 specific items** — the build already satisfies nearly all of DESIGN_DOCTRINE Parts 1–2, the brand-token law, and the mobile half of the chat-bubble law (which names this site as its reference implementation). The mechanical laws were in force at build time and held.
- **Gaps: 14** (G1–G14): **2 launch-blockers** (G6 desktop popups w/ unverified offer — config-only; G11 protection-map/page build-out — gates the DNS flip, not the artifact), **7 should-fix** (G1, G2, G3, G4, G5, G8, G12), **5 polish** (G7, G9, G10, G13, G14).
- **Root pattern:** everything mechanical passed; every gap lives in the layers the 9.2 gate never scored because the law didn't exist yet — audience mapping (B2B-trust surface, not consumer brochure), trust-furniture completeness, the memorability bar, and Part 3 input discipline.

**Top 3 fixes in priority order:**
1. **Chatbase desktop popups (G6)** — interim all-viewport suppression in CSS today; dashboard fix (cap 1, delay, register copy, verify-or-kill "free consultation", avatar swap) before any go-live. It is the only place the live surface currently asserts an unverified fact.
2. **Institutional-moat + trust-furniture pass (G1/G2/G3)** — copy layer now (10,000+ practitioners, 118-years numeral, trade/press routing line), shared trust-furniture component with real award/certificate/press assets as they arrive. This converts the page from "nice group brochure" to the B2B-trust surface §5 says it must be.
3. **The beauty pass, run the Part 3 way (G4/G5) + SVG logo swap (G8)** — soul.md + cited reference corpus + mood board + divergent one-shots feeding ONE committed art-direction move: the full-width footbridge establishing hero with the Kurale "1908 / four generations" numeral signature; official SVG lockup in the header. This is what lifts clean-premium to memorable without touching a single token law.

*Checker note (doctrine f): claims above verified against source files and the committed gate record; explicitly UNVERIFIED: Chatbase opened-dialog focus behaviour (G7), bubble exact px size, live desktop popup state as of today (evidence is the 14 Jul gate record + the unchanged repo CSS), and the contents of Astha's 15 Jul email (stated by Abilash's brief; repo evidence confirms only that no SVG exists in the site yet).*
