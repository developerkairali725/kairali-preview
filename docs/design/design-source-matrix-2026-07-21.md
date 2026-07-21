---
report_id: RPT-20260721-DESIGN-SOURCE-MATRIX
date: 2026-07-21 14:29:58 IST
task: D-20260720-07
type: proposal
status: AWAITING OWNER SIGN-OFF
related: D-20260720-11 (Akshar prompts filed), D-20260720-13 (claude.ai/design added as candidate), D-20260720-14 (Akshar set complete)
note: >
  The orchestrator's {tools, doctrine} input payload arrived un-interpolated
  (literal template string). Use-case rows were therefore taken from the
  directive text itself plus repo evidence (CLAUDE.md, docs/design/,
  docs/marketing/go-science/); external facts verified by web research this
  session. Nothing below is invented (HARD GATE 6); nothing below is
  installed, purchased, or adopted (HARD GATE 15) — this is a PROPOSAL.
---

# DESIGN-SOURCE DECISION MATRIX — which source fills the design step, per use case

## 1 · What this decides — and what it never overrides

This matrix decides ONE thing: **when a design input is needed, which candidate source produces it.** It governs what goes INTO `launches/<domain>/design-intake/` (MODE A material a human hands us) or what the agent uses to build its single MODE-B proposal. It changes nothing about who approves.

Never overridden by this matrix:

- **MODE A stays DEFAULT and PREFERRED** (CLAUDE.md § DESIGN SOURCE): a human-supplied design in `design-intake/` is the authority; the agent implements faithfully and never redesigns. The matrix only fills the gap when the intake folder is empty (MODE B) or when a human asks which tool to use to PRODUCE intake material.
- **Front gates and stop-order stand** (CLAUDE.md § STOP AT EACH GATE): brief → strategy → design_source (+ design_direction in MODE B) → golden_page → full build. No source on this page bypasses a gate; `scripts/front-gate.mjs` still makes an unapproved build un-mergeable.
- **Brand manuals win over every source** (CLAUDE.md § KNOWLEDGE & VERIFICATION DOCTRINE (d)): no skill, tool, template, or prompt output ever overrides `packages/ui/brand-tokens.css` / `raag-tokens.css`.
- **Gate 1 / Gate 2 external AI review binds regardless of source** (CLAUDE.md § DESIGN EXTERNAL AI REVIEW, D-20260718-12/-15): ChatGPT + Perplexity must SEE the image pre-content, and vet element-by-element post-build. A design from ANY column below still faces both gates.
- **Golden page law** (CLAUDE.md § GOLDEN PAGE): one page first, owner approval, every later page matches it.
- **Factory rule — TSX from `packages/*` only**: no external tool's code is ever pasted into a site. External outputs enter as REFERENCE (images, composition, structure) and are re-implemented through factory components.
- **Register locks** (KTAHV clinical lock etc.) and the beauty/go-science ship gates bind inside every row.

## 2 · THE MATRIX

Cell values: **USE** (fit for the row's job) · **ASSIST** (feeds the primary, never sole source) · **AVOID** (misfit; owner ruling in DECISIONS.md required to override). Per row, the **PRIMARY** and **FALLBACK** are bolded. MotionSites column carries an identity caveat — see §3.5.

| Use case | Claude in-repo design | claude.ai/design | ChatGPT input | V0 (Vercel) | MotionSites.ai † | Akshar-prompt wireframes |
|---|---|---|---|---|---|---|
| **New-site design direction (MODE B)** | **FALLBACK — USE**: doctrine-loaded skills + REFERENCES.md anchoring | **PRIMARY — USE**: renders the ONE hero mockup; in-repo Claude authors the prompt, anchored to `design-intake/REFERENCES.md` — MODE B law: never from nothing (owner: "good if the prompt is great") | ASSIST: pre-Gate-1 prompt critique; never authors (it audits Gate 1) | ASSIST: internal contrast comps only — the MODE-B proposal stays ONE direction | ASSIST: reference gallery for direction moods | ASSIST: structure/psychology input to the direction |
| **Golden page** | **PRIMARY — USE**: builds real TSX from `packages/*` under full doctrine | **FALLBACK — USE**: pre-build mockup reference only — the `golden_page` gate signs the BUILT TSX page, never a mockup | ASSIST: Gate-1/2 auditor; independence bars authorship | ASSIST: section composition reference | AVOID: template look risks AI-generic bar | ASSIST: Canvas 11-section homepage order, improved not copied |
| **Full-site section templates** | **PRIMARY — USE**: `packages/*` is the only legal component home | ASSIST: layout variants to react to | ASSIST: pattern critique | **FALLBACK — USE**: shadcn/Tailwind composition reference, re-implemented in `packages/*` | AVOID: copy-paste template economics don't fit factory law | ASSIST: section-purpose logic (authority→transformation→tension→CTA) |
| **Landing-page template (`/lp/<campaign>`)** | ASSIST: implements; LANDING_PAGE_DOCTRINE binds | **FALLBACK — USE**: LP mockup from a great prompt | ASSIST: MoA/awareness-stage critique | ASSIST: LP scaffold reference | ASSIST †: LP-hero prompt library is its declared specialty — pending identity confirm | **PRIMARY — USE**: owner's own note — Akshar structure × Claude visual language; go-science gate already enforces the same science |
| **PDP / commerce** | **PRIMARY — USE**: `packages/product-card` + Storefront API law; register locks | ASSIST: PDP mockups | ASSIST: conversion critique | **FALLBACK — USE**: commerce UI patterns as reference | AVOID: motion-heavy heroes misfit PDP trust job | ASSIST: IRO/CTA psychology on the buy decision |
| **Corporate / trust pages** | **PRIMARY — USE**: register locks + beauty-doctrine corporate chapter live here | **FALLBACK — USE**: restrained corporate comps | ASSIST: trust-signal critique | ASSIST: layout reference | AVOID: animated-flash register clashes with clinical/corporate trust | ASSIST: authority-phase teachings (Phase 1), mined |
| **Editorial / blog** | **PRIMARY — USE**: author-voice system + editorial doctrine in-repo | **FALLBACK — USE**: editorial layout mockups | ASSIST: readability critique | ASSIST: article-layout reference | AVOID: motion fights reading | ASSIST: "So what?" fact discipline for content shape |
| **Portfolio / personal (abhilashkr)** | **FALLBACK — USE**: design-taste skills built for portfolios | **PRIMARY — USE**: creative freedom, the "great prompt" case; CI-matrix-exempt site | ASSIST: taste check | ASSIST: interactive-bits reference | ASSIST †: portfolio is a listed strength — pending confirm | AVOID: conversion canvas misfits a personal site |
| **Dashboard / internal (kairali.ai /status)** | **FALLBACK — USE**: implements; status-build pipeline is ours | ASSIST: can read the repo's components for mockups | ASSIST: IA critique | **PRIMARY — USE**: dashboards are v0's sweet spot; low brand risk; still lands as our TSX | AVOID: zero fit | AVOID: zero fit |
| **Hero / creative imagery** | **PRIMARY — USE**: imagegen skills + IMAGE_GEN_ROSTER + missing-asset 7-part-spec protocol | **FALLBACK — USE**: marketing-visual generation | ASSIST: art-direction critique | AVOID: code tool, not imagery | ASSIST †: animated-hero prompt inspiration — pending confirm | ASSIST: 5-theme slide-image prompt mined for framing ideas |
| **Wireframe-first exploration** | ASSIST: turns the wireframe into TSX after approval | **FALLBACK — USE**: wireframes are a listed output | ASSIST: flow critique | ASSIST: sketch-to-code to test a wireframe fast | AVOID: sells high-fidelity templates, not wireframes | **PRIMARY — USE**: the owner's exact case — "Claude's design + Akshar's prompts could give good wireframes for specific use cases" |

**Dimensions: 11 use-case rows × 6 source columns.** † = identity UNCONFIRMED as the tool the owner meant (Wispr spelling) — see §3.5 and §7.

## 3 · Per-source profiles

### 3.1 Claude in-repo design (this workspace)
- **What it is:** the factory's own design capability — installed skills (design-taste-frontend, high-end-visual-design, imagegen-frontend-web, image-to-code, brandkit, frontend-design, minimalist/brutalist variants), the doctrine stack (DESIGN_DOCTRINE.md, BEAUTY_DOCTRINE.md + owner paper, LANDING_PAGE_DOCTRINE.md), brand tokens, and `packages/*`.
- **Outputs:** production TSX from `packages/*`, image-gen reference boards, MODE-B proposals.
- **Wins:** the only source that natively obeys doctrine (d), register locks, factory component law, and the beauty/go-science rubrics; zero translation loss to code.
- **Fails:** taste ceiling without external references — MODE B law already forbids inventing from nothing; the 8-site redesign history shows unreviewed self-direction drifts.
- **Cost/friction:** zero marginal cost; friction is session time.
- **Evidence:** CLAUDE.md §§ DESIGN SOURCE / FACTORY RULES; docs/design/*; skills roster in-session. OBSERVED_FIRST_PARTY.

### 3.2 claude.ai/design (Claude Design, Anthropic Labs) — distinct candidate per D-20260720-13
- **What it is:** Anthropic's AI visual-creation tool at claude.ai/design (Anthropic Labs, powered by Claude Opus 4.7 per the launch post), launched 17 Apr 2026 as a research preview. [In-claude.ai entry point ("palette icon") UNVERIFIED — not on the launch page; removed as a claim.]
- **Outputs:** interactive prototypes, UI mockups, wireframes, one-pagers, decks, marketing visuals — refined via chat/inline comments/sliders; can link a code repo and read real React components to apply an existing design system.
- **Wins:** exactly the MODE-B artifact shape (single direction mockup fast); repo-aware design-system fidelity is unique among the candidates; owner's own verdict: "a good tool for design if the prompt is great" — and the in-repo doctrine is the great-prompt generator.
- **Fails:** research-preview stability/availability not guaranteed; outputs are mockups, not factory TSX — everything is re-implemented through `packages/*`; garbage prompt → garbage direction.
- **Cost/friction:** included in existing Claude Pro/Max/Team/Enterprise plans (no separate price found); friction is prompt-authoring discipline.
- **Evidence:** anthropic.com/news/claude-design-anthropic-labs; datacamp.com/blog/claude-design; digitalapplied.com and agence-scroll 2026 guides. VERIFIED this session (2026-07-21); RE-VERIFIED in adversarial pass same day (direct fetch of the Anthropic launch post + VentureBeat/Adweek): launch date, plan-included access, repo/React-reading design system, inline comments + adjustment knobs, and "product wireframes and mockups" as a listed use all CONFIRMED.

### 3.3 ChatGPT's input
- **What it is:** the external GPT auditor already wired into law (`scripts/audit-gpt.mjs`) — "is the design actually good" at Gate 1 and Gate 2, plus phase-gate checkpoints (D-20260719-08).
- **Outputs:** verdicts, element-by-element checklists, critique notes, prompt refinements.
- **Wins:** independent taste pressure; catches AI-generic drift; cheap iteration on direction language before Gate 1.
- **Fails:** as an AUTHOR it would audit its own work — Gate 1/2 independence collapses. Structurally capped at ASSIST everywhere; never the primary design source.
- **Cost/friction:** existing audit lane; no new cost.
- **Evidence:** CLAUDE.md § DESIGN EXTERNAL AI REVIEW. OBSERVED_FIRST_PARTY.

### 3.4 V0 (Vercel)
- **What it is:** Vercel's generative-UI tool: natural language (or screenshot/sketch) → React components styled with Tailwind on shadcn/ui; 2026 updates added Git integration, multi-page apps, agentic workflows.
- **Outputs:** working React/Next.js UI code; one-click Vercel deploys.
- **Wins:** dashboards, component composition, fast interactive scaffolds; stack-adjacent to ours (React/Tailwind), so its output reads as legible reference.
- **Fails:** shadcn-default look is the AI-generic look our design bar bans; its code can NEVER ship as-is (factory `packages/*` law) — always a reference, re-implemented; not a brand/imagery tool.
- **Cost/friction:** third-party 2026 guide (nxcode.io, checked in the adversarial pass 2026-07-21) lists Free / Premium $20/mo / Team $30/user/mo / Business $100/user/mo / Enterprise tiers — THIRD-PARTY figures, confirm on vercel.com before any paid reliance (HARD GATE 6). Friction: translation from its component idiom to ours.
- **Evidence:** vercel.com/blog/announcing-v0; vercel.com/academy/ai-sdk/ui-with-v0; 2026 third-party guides (buildfastwithai, nxcode). VERIFIED capability set this session; RE-VERIFIED in adversarial pass same day (nxcode 2026 guide + vercel.com/blog/introducing-the-new-v0 + v0 GitHub-integration docs): Feb 2026 update's Git integration, agentic workflows, and multi-page apps CONFIRMED.

### 3.5 MotionSites.ai — SPELLING VERDICT
- **Verified:** `motionsites.ai` EXISTS and is a real product — a curated library of premium hero-section PROMPTS and animated landing-page TEMPLATES (categories: SaaS, agency, portfolio, e-commerce, Web3, luxury real estate…), designed to be pasted into AI builders (Lovable, Cursor, Bolt). Confirmed by direct fetch of motionsites.ai plus third-party listings (stork.ai, sourceforge, navtools) on 2026-07-21.
- **Unresolved:** (1) a near-twin domain `motionsite.ai` (singular) also serves "MotionSite AI — AI Website Prompts" — same niche; which is canonical/original was not adjudicated; (2) whether THIS prompt-library is the tool the owner had in mind via Wispr, rather than a similarly-named motion/animation tool. **The MotionSites column therefore carries UNCONFIRMED (†).** One-line owner ask: *"MotionSites.ai = the paid hero-prompt/animated-template library for Lovable/Cursor-style builders — is that the tool you meant? yes/no."*
- **Outputs:** copy-paste prompts + animated templates + background videos; free "Copy" tier and Premium tier.
- **Wins:** LP/hero motion inspiration; ready visual vocabulary for animated heroes.
- **Fails:** template economics collide with the no-copy-paste factory law and the "no AI-generic" design bar; heavy motion collides with brand motion law ("nothing bounces") and NN/g anti-scrolljacking doctrine; useless for clinical/corporate registers.
- **Cost/friction:** third-party listing (stork.ai, as of 2026-03-09) showed a $29 one-time founding-members lifetime deal, listed from $199 — DATED third-party figure, re-verify at purchase time; site itself shows free/Premium tiers without prices on the landing page. Any purchase is owner-approved (HARD GATE 15).
- **Evidence:** motionsites.ai (fetched), stork.ai/en/motionsites-ai, sourceforge listing, moge.ai/product/motionsites. Spelling VERIFIED to a real product; identity-as-intended UNCONFIRMED.

### 3.6 Akshar-prompt wireframes (GO science × Claude design)
- **What it is:** the owner-supplied Akshar Yadav set, filed per D-20260720-11 at `docs/marketing/go-science/four-phase-prompts/` — Million-Dollar Website Canvas (fixed 11-section homepage wireframe + per-section tips), matching Blueprint intake worksheet, four Phase content prompts, one slide-image design prompt. Owner confirmed set complete (D-20260720-14).
- **Outputs:** page STRUCTURE and conversion psychology — section order, per-section jobs, intake questions; combined with Claude's visual design it yields wireframes (the owner's stated combination).
- **Wins:** conversion-first scaffolding for LPs and wireframe exploration; aligns with the already-binding go-science gate (MCB, MoA, IRO, NDFF); the "So what?" and anti-cliché disciplines strengthen copy structure.
- **Fails:** owner caveat is BINDING — *"good teachings but improve-on, not use-as-is."* The 11-section canvas is a generic-business template: applied verbatim it flattens entity registers and the beauty doctrine's per-type chapters. Its locked 5-theme image design system is mined for ideas, never adopted as our visual system.
- **Cost/friction:** zero cost (owner-supplied); friction is the improvement pass each use requires.
- **Evidence:** docs/marketing/go-science/four-phase-prompts/ (SHA-pinned sources, INERT-DATA fenced). OBSERVED_FIRST_PARTY.

## 4 · The Akshar × Claude combination (owner's note, honored with the caveat)

The owner's exact idea — "Claude's design + Akshar's prompts could give good wireframes for specific use cases" — resolves to a two-layer split that keeps the caveat structural, not aspirational:

1. **Akshar supplies the SKELETON, never the skin:** section order, per-section conversion job, intake questions (Canvas + Blueprint), phase logic (authority → transformation → tension → CTA/IRO). Before use, each element passes an IMPROVE pass: keep what the beauty/go-science doctrine confirms, replace generic-business assumptions with the entity's register and page-type chapter. Use-as-is is a matrix violation.
2. **Claude supplies the SKIN and the JUDGMENT:** in-repo doctrine turns the improved skeleton into a wireframe (or authors the prompt that claude.ai/design renders), brand tokens govern every visual choice, and the result enters the normal lane — design-intake/ or MODE-B proposal → Gate 1 → golden page.

Primary application rows: **landing-page template** and **wireframe-first exploration** (the "specific use cases" of his note); ASSIST elsewhere as marked.

## 5 · Decision rules (how a session picks, without reopening this doc)

1. `design-intake/` has human design → MODE A, implement it faithfully; this matrix is not consulted.
2. Intake empty → this IS MODE B: declare `mode: B` in `launches/<domain>/approvals.yaml` FIRST; then find your use-case row and take **PRIMARY** to produce the ONE direction proposal; if unavailable or it fails Gate 1 twice, take **FALLBACK**. The `design_direction` gate + Gate 1 still stop the run before any content or page build — the matrix never substitutes for either.
3. Brand manual conflicts with any source's output → brand manual wins, no exceptions (doctrine d).
4. ChatGPT never authors what it will audit — it is capped at ASSIST in every row, forever.
5. External tool output (claude.ai/design, V0, MotionSites) enters ONLY as reference/mockup — and WHOSE hand ran the tool decides the mode: a HUMAN who ran the tool and dropped the output into `design-intake/` is MODE A authority; the AGENT running a tool feeds its single MODE-B proposal only and NEVER files its own output into `design-intake/` (that would launder MODE B into MODE A). Production code is always TSX from `packages/*`.
6. An AVOID cell is overridden only by an owner ruling logged in DECISIONS.md.
7. MotionSites stays ASSIST-ceiling and unpurchased until the owner confirms identity and approves spend (HARD GATE 15).
8. Whatever the source: Gate 1 → golden page → Gate 2 → beauty + go-science. No source shortcuts a gate.

## 6 · The next three real builds — rows resolved (no session interprets)

| Build (queue state, from BACKLOG/STATUS) | Governing row(s) | Resolved source call | Case-specific binds |
|---|---|---|---|
| **kairaliorganic PDPs** (golden page signed via #156; full-site PR #164 parked in design freeze) | PDP / commerce | **Claude in-repo PRIMARY** — `packages/product-card` + Storefront API; **V0 FALLBACK** as commerce-pattern reference only, re-implemented | TWO separate Shopify stores/tokens (U1 ruling: `.in` → kairali-products.myshopify.com, `.com` → ayurvedakairali.myshopify.com); every PDP matches the signed golden page; go-science + beauty gates judge the rendered PDP; product-pharma register |
| **KTAHV LP template** (10-LP set PR #145 parked in design freeze) | Landing-page template | **Akshar × Claude PRIMARY** (§4 two-layer split); **claude.ai/design FALLBACK** for the LP mockup | KTAHV CLINICAL LOCK binds inside every hook/CTA (banned words incl. DE/FR senses — a hook never buys its curiosity with a locked word); the §4 IMPROVE pass strips generic-business psychology to clinical register; **MotionSites is AVOID here, not ASSIST** — animated-flash register clashes with clinical trust (same reasoning as the corporate row); a new LP template is design-DIRECTION altitude → Gate 1 binds; `/lp/<campaign>`, noindex, single CTA per LANDING_PAGE_DOCTRINE |
| **kairalicenters rebuild** (mined 14 Jul — hacked WP caught, 14 verified centres; rebrief PR #132 parked; Q-KC-PARTNERS / Q-KC-DOMAIN open) | New-site design direction (MODE B) + Corporate / trust pages + Full-site section templates | **MODE A if a human fills `design-intake/` (DEFAULT, always)**; else **claude.ai/design PRIMARY** for the ONE direction with **in-repo FALLBACK**; corporate/trust row governs the centre-network trust pages, full-site row the build-out | BUILD DECISION MATRIX step zero (MINE FIRST) already done 14 Jul — re-verify freshness post-hack-remediation before design decisions; centre-roster counts come ONLY from `@kairali/facts` (D-COUNT-GO — locked-count lint enforces); KTAHV clinical lock does NOT cross-apply (KTAHV-only by law); the open owner questions block the richer build, not the direction work |

## 7 · Open items for the owner

1. **MotionSites identity confirm:** MotionSites.ai = paid hero-prompt + animated-template library for AI builders (Lovable/Cursor/Bolt), free tier + ~$29 founding LTD per a dated third-party listing. Is that the tool you meant? **reply YES / NO (+ correct name if no)**. Until then its column stays † UNCONFIRMED, ASSIST-ceiling.
2. **Sign-off:** this matrix is a PROPOSAL (HARD GATE 15 — nothing installed/adopted/purchased). **reply APPROVE design-source-matrix or CHANGES <notes>**.
