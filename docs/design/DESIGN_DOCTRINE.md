# DESIGN DOCTRINE — Kairali Web Factory
**Compiled 2026-07-14 IST · Maintained via LEARNINGS.md-driven PRs only (same rule as the Ship Gate).**
**Evidence-based: every claim links to its source. "Our law" column maps each item to: brand lint / factory spec (Ship Gate A-items, tests/factory/factory-site.spec.ts), ENGINEERING_STANDARDS.md, brand tokens (packages/ui/brand-tokens.css), or the design-critic gate (B-14, scripts/design-review/PROMPT.md).**

Legend: ✅ = mechanically caught (lint/spec/build) · 🔍 = B-14 design-critic gate must probe it manually (add to the reviewer's walkthrough) · ⚠️ = not covered anywhere yet.

---

## 1 · MISTAKES TO AVOID AT ALL COST

### 1.1 Carousels & motion hijacks
| Mistake | Evidence | Our law |
|---|---|---|
| Auto-forwarding/auto-rotating carousels — content moves before users read/click it; treated as an ad (banner blindness); hostile to slow readers and screen readers. | [NN/g — Auto-forwarding](https://www.nngroup.com/articles/auto-forwarding/) | 🔍 B-14 mobile walkthrough must flag any auto-rotation. Brand tokens motion law helps ("gentle ease-out fades 150–400ms; NOTHING bounces") but doesn't ban rotation. |
| If a carousel exists: user-controlled, ≤5 frames, most important message + primary CTA in frame 1 — later frames are effectively invisible. | [NN/g — Carousel usability](https://www.nngroup.com/articles/designing-effective-carousels/) | 🔍 B-14 criterion 4 (one primary action per view) partially covers; frame-count rule is a manual probe. |
| Scrolljacking / forced-step scroll / altered scroll speed — majority of test users disoriented; some read it as a bug. | [NN/g — Scrolljacking 101](https://www.nngroup.com/articles/scrolljacking-101/) | 🔍 B-14 walkthrough. ENGINEERING_STANDARDS `prefers-reduced-motion` honored everywhere is adjacent but doesn't ban scroll hijack. |

### 1.2 Navigation & controls
| Mistake | Evidence | Our law |
|---|---|---|
| Hamburger-hidden nav on desktop — hidden navigation halves discoverability, increases task time on BOTH desktop and mobile (179-participant study). | [NN/g — Hamburger menus](https://www.nngroup.com/articles/hamburger-menus/) | 🔍 B-14 desktop pass (1120/1280) must verify visible global nav. |
| Touch targets under ~1cm (44–48px) — fat-finger errors, unusable with motor impairments; a conversion tax on mobile CTAs. | [NN/g — Touch targets](https://www.nngroup.com/articles/touch-target-size/) | ✅ A4 brand lint (touch targets ≥44px) + factory spec "A4 (browser layer): every data-cta control is ≥44px". |
| Icon-only controls (nav, booking, WhatsApp, language switcher) without visible text labels; hover-revealed labels fail entirely on touch. | [NN/g — Icon usability](https://www.nngroup.com/articles/icon-usability/) | 🔍 B-14 mobile walkthrough. Factory spec A7 asserts a locale switcher *exists* but not that it's labeled. |
| Generic "Learn More"/"Click Here" links — no information scent; screen readers hear identical meaningless links. Label = what the destination delivers ("View Panchakarma programme details"). | [NN/g — Learn More links](https://www.nngroup.com/articles/learn-more-links/) | 🔍 B-14 criterion 4 (CTA clarity, helper copy tells what happens next). ⚠️ No lint for banned generic labels — cheap to add to compliance lint. |
| Vague "Get Started" CTAs without adjacent text stating what starts, cost, next step — commitment fear suppresses clicks. | [NN/g — Get Started stops users](https://www.nngroup.com/articles/get-started/) | 🔍 B-14 criterion 4 explicitly requires "helper copy tells the visitor what happens next". |

### 1.3 Readability & content
| Mistake | Evidence | Our law |
|---|---|---|
| Low-contrast gray-on-white text for aesthetics — "illegible, undiscoverable, and inaccessible"; unreadable in glare/aging eyes. | [NN/g — Low-contrast text](https://www.nngroup.com/articles/low-contrast/) | ✅ Brand tokens USAGE LAW (ch.10) hard-codes contrast tiers (forest 7.7:1, ink 15.6:1; leaf/bronze restricted to large text; marigold NEVER text on white) + A4 brand lint "marigold-as-body-text = fail" + A5 Lighthouse Accessibility ≥95. |
| Text over busy/textured background photos — letterform interference; users skip the text. Classic failure on image-heavy wellness heroes. | [NN/g — Legibility & comprehension](https://www.nngroup.com/articles/legibility-readability-comprehension/) | 🔍 B-14 375px + desktop screenshot pass. ⚠️ Not machine-checkable today. |
| Walls of unformatted text — F-pattern scanning means ~¼ of words read; everything below the first lines is skipped. Chunk with subheadings, bullets, bolded keywords, front-loaded sentences. | [NN/g — F-shaped pattern](https://www.nngroup.com/articles/f-shaped-pattern-reading-web-content/) | 🔍 B-14 criterion 2. Pairs with the AEO answer-first rule (docs/seo/SEO_PLAYBOOK.md §3.2) — same fix serves both. |

### 1.4 Popups & interruptions
| Mistake | Evidence | Our law |
|---|---|---|
| Entry modals (newsletter/discount/app-install) — 95% of participants reacted negatively; Google penalizes intrusive mobile interstitials. | [NN/g — Popups](https://www.nngroup.com/articles/popups/) | ⚠️ No gate bans entry modals. Factory has no such component in packages/* — keep it that way; B-14 must flag any that appear. |
| Stacked competing overlays (cookie banner + chat widget + discount modal + notification prompt) — compounding disorientation and abandonment. | [NN/g — Overlay overload](https://www.nngroup.com/articles/overlay-overload/) | 🔍 B-14 method step 1 explicitly checks "floating-UI collisions (chat bubble · sticky bar · consent banner)" at 375px. Our known stack: consent banner (A12) + Chatbase widget (B9) + sticky WhatsApp CTA (ENGINEERING_STANDARDS mobile-first) — three overlays already; NEVER add a fourth. |
| Autoplay video with sound, content-reorganizing ads, full-page takeovers — the most-hated formats, worst on mobile; poison for premium brand perception. | [NN/g — Most-hated advertising](https://www.nngroup.com/articles/most-hated-advertising-techniques/) | ✅ Partially: A5 hero video is poster-first with reduced-motion fallback (no autoplay-with-sound pattern exists in packages/*). 🔍 B-14 for anything else. |
| "Needy" patterns: please-don't-go exit popups, get-back-to-me tab titles, confirm-shaming decline buttons — breed resentment; fatal for a premium clinical brand. | [NN/g — Needy design patterns](https://www.nngroup.com/articles/needy-design-patterns/) | ⚠️ No gate. Doctrine: banned outright on all Factory sites, all registers. B-14 flags on sight. |

### 1.5 Forms & trust (enquiry/consultation = the money path)
| Mistake | Evidence | Our law |
|---|---|---|
| Placeholder text as the only label — strains memory, breaks error correction, mistaken for pre-filled values, skipped by screen readers. Labels permanently visible above fields. | [NN/g — Placeholders are harmful](https://www.nngroup.com/articles/form-design-placeholders/) | ⚠️ Not gated. Must be a `packages/forms` v1 construction rule + 🔍 B-14 probe. |
| Inline/floating-only labels on mobile — users lose context mid-form and clear fields to re-see the label. | [Baymard — Never use inline labels](https://baymard.com/blog/mobile-forms-avoid-inline-labels) | ⚠️ Same as above — encode in packages/forms v1. |
| Form bloat — most flows can cut 20–60% of fields; ideal flow ~7–8 fields; "too long/complicated" is a top abandonment driver (70%+ average abandonment; ~35% conversion gain available from form design alone). | [Baymard — Cart abandonment statistics](https://baymard.com/lists/cart-abandonment-rate) | 🟡 v1 forms freeze replicates the EXACT current CRM schema (Ship Gate FORMS section) — field-count optimization is explicitly deferred to v2 backlog. 🔍 B-14 notes friction honestly in limitations. |
| Forced account creation before purchase/enquiry — top-3 abandonment cause (~26%). Always a guest/one-step path. | [Baymard — Cart abandonment statistics](https://baymard.com/lists/cart-abandonment-rate) | ✅ Structurally avoided: Factory never builds carts/checkout (Factory Rules — checkout is Shopify); enquiry forms have no accounts. |
| Late cost reveal — unexpected extra costs are the #1 abandonment reason (~48%). Surface programme/package costs, inclusions/exclusions early. | [Baymard — Cart abandonment statistics](https://baymard.com/lists/cart-abandonment-rate) | ⚠️ No gate; pricing facts are locked-source-only (CLAUDE.md rule 6 — never invent prices; missing price = flag, not fill). 🔍 B-14 criterion 1 should ask "is cost transparency adequate?" |
| Wrong mobile keyboards — ~60% of sites get touch keyboards wrong; numeric keypad = 471% larger hit area; autocorrect corrupts names/addresses. Use `inputmode`/`type`/`autocomplete` per field. | [Baymard — Mobile touch keyboards](https://baymard.com/blog/mobile-touch-keyboards) | ⚠️ Not gated. Encode in packages/forms v1 + add a factory spec assertion (cheap: check `type`/`inputmode` on tel/email fields). |

### 1.6 Performance as UX
| Mistake | Evidence | Our law |
|---|---|---|
| Slow hero media — hero is the LCP element on ~72% of mobile pages; Vodafone +31% LCP → +8% sales; Nykaa +40% LCP → +28% organic traffic. | [web.dev — CWV business impact](https://web.dev/case-studies/vitals-business-impact) | ✅ A5 Lighthouse Perf ≥90 + poster-first LCP; ENGINEERING_STANDARDS hero `priority`, video ≤4 MB poster-first. |
| Ignoring the 3-second mobile budget — 53% abandon pages slower than 3s; bounce probability +32% from 1s→3s. | [Think with Google — Mobile speed benchmarks](https://business.google.com/ca-en/think/marketing-strategies/mobile-page-speed-new-industry-benchmarks/) | ✅ A5 budgets + ENGINEERING_STANDARDS ≤130 KB first-load JS. |
| Layout shift — users lose reading position, mis-click wrong buttons (rage clicks, perceived bugginess); CLS is a ranking input. Reserve space for every image/embed/font/banner. | [web.dev — CLS](https://web.dev/articles/cls) | ✅ ENGINEERING_STANDARDS next/image explicit width/height + next/font `display: swap`; A5 gates the score. 🔍 Consent-banner space reservation — B-14 375px pass. |

### 1.7 Dark patterns (zero tolerance — trust is the product)
| Mistake | Evidence | Our law |
|---|---|---|
| Fake urgency: resetting countdowns, fabricated stock counts, "X people viewing" — ~40% of shopping-site countdowns were fake (11K-site Princeton crawl); FTC treats these as enforceable violations. For a medical brand the trust destruction is permanent. | [Princeton — Dark Patterns at Scale](https://arxiv.org/pdf/1907.07032) | ✅ Structurally aligned: CLAUDE.md rule 6 (never invent facts/numbers) makes fabricated counts a hard-gate violation, and A3 compliance lint bans manipulative filler. 🔍 B-14 flags any urgency device on sight. Doctrine: NO urgency mechanics on any Kairali surface, ever. |

---

## 2 · HIGH-END DESIGN LEVERS

### 2.1 Top-5
| # | Lever | Evidence | Our law |
|---|---|---|---|
| 1 | **Real, art-directed photography of actual people/places/products — never generic stock.** Eyetracking: users ignore decorative stock entirely but scrutinize real photos as content. For KTAHV: the actual hospital, physicians, grounds. | [NN/g — Photos as web content](https://www.nngroup.com/articles/photos-as-web-content/) | ✅ ENGINEERING_STANDARDS placeholder-first workflow: source priority = Kairali image library → manual-linked galleries → licensed stock → AI-gen only per policy code, **never people on KTAHV**. B-14 criterion 1 scores "placeholders styled as intentional brand blocks". |
| 2 | **Restrained near-monochrome palette + ONE accent used sparingly (60/30/10), accent reserved for the primary CTA.** Scattering the accent dilutes CTA salience. | [NN/g — Minimalism characteristics](https://www.nngroup.com/articles/characteristics-minimalism/) | ✅ Brand tokens: marigold = "Accent ONLY — never body text"; ENGINEERING_STANDARDS "Marigold: one accent moment per view"; A4 brand lint fails rogue hex + marigold body text; B-14 computed-style audit checks the one-accent-per-view rule in actual rgb() values. |
| 3 | **Typographic discipline: modular scale, 50–75ch measure, line-height ~1.2–1.5 scaled to measure** — a harmonious mathematical scale is what separates "designed" from "default". | [A List Apart — More meaningful typography](https://alistapart.com/article/more-meaningful-typography/) | ✅ Brand tokens encode the system: `--measure-prose: 720px`, 4px rhythm base, three-font hierarchy (Kurale display always weight 400 / Asap body / Lato caption); A4 lint enforces token usage. ⚠️ A per-step modular type-scale token set is not yet in brand-tokens.css (deferred to the design-system library, per the file's TODO header). |
| 4 | **Perceived performance is a design feature:** hero gets `fetchpriority="high"`, never lazy, explicit dimensions; LCP <2.5s, CLS ~0, INP <200ms. Only ~42% of sites pass all three — passing IS the differentiator. | [web.dev — Optimize LCP](https://web.dev/articles/optimize-lcp) | ✅ A5 + ENGINEERING_STANDARDS (see §1.6). INP gap noted in SEO_PLAYBOOK GAPS #1. |
| 5 | **Design for the 50ms first impression** — aesthetics judgment forms in ~50ms and rarely revises; attractive design buys forgiveness for minor (not major) usability flaws. Above-the-fold on key templates is art-directed as a single visual statement. | [NN/g — Aesthetic-usability effect](https://www.nngroup.com/articles/aesthetic-usability-effect/) | 🔍 This is exactly what B-14 criterion 1 ("Premium feel… calm, expensive, no template-smell") scores — the gate is the mechanism. |

### 2.2 Full list
| Lever | Evidence | Our law |
|---|---|---|
| Motion = purposeful, subtle feedback only; microinteraction durations ~100–500ms, ease-out entrances; long/gratuitous transitions read as gimmicky. | [NN/g — Animation duration](https://www.nngroup.com/articles/animation-duration/) | ✅ Brand tokens: `--dur-fast: 150ms / --dur-slow: 400ms`, `--ease-brand` ease-out, "NOTHING bounces", hover deepens one ramp step — never lifts. |
| Honor `prefers-reduced-motion` on every animated component — replace movement with opacity fades; parallax can trigger vestibular disorders. A wellness brand causing motion sickness is a brand contradiction. | [web.dev — prefers-reduced-motion](https://web.dev/articles/prefers-reduced-motion) | ✅ ENGINEERING_STANDARDS: "`prefers-reduced-motion` honored everywhere motion exists"; A5 gates the hero-video reduced-motion fallback. |
| Animation's only legitimate jobs: feedback + preventing disorientation. Default = no animation; justify each addition (motion budget per template). | [NN/g — Animation purpose](https://www.nngroup.com/articles/animation-purpose-ux/) | 🔍 B-14 should ask "does each animation earn its place?" ⚠️ No formal per-template motion budget yet. |
| Microinteractions as trigger-feedback pairs (press states, field validation, hover confirmations) — small confirmations reduce abandonment on conversion flows. | [NN/g — Microinteractions](https://www.nngroup.com/articles/microinteractions/) | 🔍 B-14 criterion 4; packages/forms v1 should ship validation feedback states. |
| Response-time tiers: 0.1s = instantaneous (no feedback), 1s = flow (minor feedback), 10s = attention limit (percent-done). A spinner on a sub-100ms action feels SLOWER and cheaper. | [NN/g — Response times](https://www.nngroup.com/articles/response-times-3-important-limits/) | ⚠️ Not encoded; add to packages/ui component guidance. |
| Skeleton screens (not spinners) for section loads, shaped like the final layout — cuts perceived wait AND prevents CLS. | [NN/g — Skeleton screens](https://www.nngroup.com/articles/skeleton-screens/) | ⚠️ Not encoded; mostly moot on SSG pages, relevant for any client-fetched sections. |
| Brand fonts without FOIT/reflow: preload critical WOFF2, `font-display` strategy, subsetting, size-adjusted fallbacks — a late-arriving premium serif that reflows is worse than a tuned fallback. | [web.dev — Font best practices](https://web.dev/articles/font-best-practices) | ✅ ENGINEERING_STANDARDS: `next/font` only, self-hosted, `display: swap`, no CDN links, no FOIT loaders. |
| Fluid typography (clamp/viewport-relative) keeps the modular scale and 50–75ch measure continuous from 320px to 1440px. | [Smashing — Fluid typography](https://www.smashingmagazine.com/2016/05/fluid-typography/) | 🟡 Mobile-first at 375px is law (ENGINEERING_STANDARDS); fluid `clamp()` scale not yet tokenized (same design-system-library TODO). |
| Whitespace as the primary grouping tool (Gestalt proximity): space between groups visibly larger than within; borders/backgrounds only when spacing can't carry it. Luxury layouts are disciplined emptiness. | [Smashing — Spaces & Gestalt](https://www.smashingmagazine.com/2019/04/spaces-web-design-gestalt-principles/) | ✅ Brand tokens 4px rhythm (`--space-1`, all spacing n×4px); 🔍 group-vs-within ratios are B-14 judgment. |
| Multi-shot galleries on detail pages: 56% of shoppers' first action is exploring images; need in-scale/in-context/on-human/detail types at high resolution. For treatment/room pages: space, treatment in progress, physician, texture detail. | [Baymard — Product page UX](https://baymard.com/research/product-page) | 🟡 IMAGE_MANIFEST.md per site specs every slot (subject, mood, dimensions, format, alt); shot-type coverage per detail page not mandated. Budget photography as a conversion line item. |
| Trust through convergent quality signals: real employee photos with names/credentials, substantive About pages — users "see right through" corporate speak and stock. NABH physician credentials are both premium signal and medical-trust requirement. | [NN/g — Communicating trustworthiness](https://www.nngroup.com/articles/communicating-trustworthiness/) | 🟡 A8 Person schema for bylines; B-14 criterion 2 (specific verifiable facts, family voice). Facts locked by rule 6. |

---

## 3 · TIMELESS PRINCIPLES → OUR SYSTEM

| Principle | Evidence | Application here |
|---|---|---|
| **Visual hierarchy is deliberate:** size + color signal importance; proximity + common regions signal belonging; F-pattern favors top-left — value proposition and primary CTA sit in the scanning path. | [NN/g — Visual hierarchy](https://www.nngroup.com/articles/visual-hierarchy-ux-definition/) | Hero composition rule for every template: proposition top-left region, one forest-500 action, marigold accent at most once per view. |
| **Why designs look good — four recurring properties:** consistent typography, clear hierarchy, refined limited palette, strict grid alignment. Fail one and the page reads amateur regardless of content. | [NN/g — Why does design look good?](https://www.nngroup.com/articles/why-does-design-look-good/) | This is a usable sub-checklist for B-14 criterion 1: score all four explicitly. Grid = `--measure-layout: 1120px` 12-col; typography = the three-font token system. |
| **Contrast works only against repetition:** make exactly ONE element per view differ (the CTA); repeat consistent shapes/colors elsewhere. A page where everything is special has no focal point. | [Smashing — Gestalt principles](https://www.smashingmagazine.com/2014/03/design-principles-visual-perception-and-the-principles-of-gestalt/) | The operational rule behind marigold-once-per-view and pill-shaped action buttons (`--radius-pill` on ALL action buttons — uniform shape language so the accent color is the only differentiator). |
| **Aesthetic & minimalist design (heuristic #8):** every extra element competes with the relevant ones — remove anything not serving a user goal. Subtraction is the premium move. | [NN/g — Aesthetic & minimalist design](https://www.nngroup.com/articles/aesthetic-minimalist-design/) | KTAHV treatment pages gain authority by carrying fewer, better elements — no badge walls, no widget clutter. B-14's "find the weakest thing" stance is the enforcement. |
| **Art direction is the Big Idea layer:** one visual concept per site (imagery style, crop language, tonal palette, typographic voice); every page executes variations — consistency without staleness. | [A List Apart — Art direction and design](https://alistapart.com/article/art-direction-and-design/) | Codified per entity BEFORE layout: KTAHV clinical-serene · Villa Raag coastal-boutique (own manual, raag-tokens.css ONLY — never Kairali tokens as a "temporary" skin, per Ship Gate standing note) · KAPPL product-pharma. Sub-brand display voices live in brand-tokens.css comments. |
| **Luxury warning:** premium brands sacrificing usability for exclusivity aesthetics backfires — high-intent customers left "confused and annoyed". Premium must never hide prices, navigation, or contact paths. | [NN/g — Luxury ecommerce principles](https://www.nngroup.com/articles/luxury-principles-ecommerce-design/) | For a high-ticket healing programme: consultation/enquiry path stays obvious inside the restrained layout. Factory spec asserts every Kairali surface offers a contact path (A2) and ≥1 data-cta CTA; B-14 criterion 4 scores clarity. |

---

## 4 · MAPPING SUMMARY — what catches what

**Mechanically caught today (lint/spec/CI):**
- Touch targets ≥44px, focus rings — A4 brand lint + factory spec browser layer.
- Rogue colors, marigold body text, contrast tiers — A4 brand lint + brand-tokens USAGE LAW + A5 Lighthouse a11y ≥95.
- CLS sources (image dims, font swap), hero priority, JS weight, video poster-first + reduced-motion — ENGINEERING_STANDARDS + A5 budgets.
- Forms consent + privacy link, contact path present, ≥1 data-cta — factory spec A2/A4.
- Fabricated numbers/urgency counts — impossible under CLAUDE.md rule 6 + A3 compliance lint.

**B-14 design-critic gate (scripts/design-review/PROMPT.md) must probe manually — add these to the reviewer's standing walkthrough:**
carousels/auto-rotation · desktop hamburger · icon-only controls · text-over-busy-image legibility · wall-of-text formatting · entry modals & overlay stacking (chat bubble + sticky bar + consent banner is already 3 — never 4) · generic CTA labels ("Learn More"/"Get Started" without next-step copy) · scrolljacking · needy patterns · cost transparency · animation justification · 4-property "looks good" sub-check (type/hierarchy/palette/grid).

**Not covered anywhere yet (mechanization candidates):**
1. Form construction rules — visible labels above fields (never placeholder-only, never inline/floating on mobile), correct `type`/`inputmode`/`autocomplete` per field → encode in `packages/forms` v1 + a factory spec assertion. ([NN/g](https://www.nngroup.com/articles/form-design-placeholders/) · [Baymard](https://baymard.com/blog/mobile-touch-keyboards))
2. Generic-link-label lint ("Learn More", "Click Here", bare "Get Started") → compliance lint addition. ([NN/g](https://www.nngroup.com/articles/learn-more-links/))
3. Modular/fluid type-scale tokens + full color ramps → blocked on the design-system library (brand-tokens.css header TODO — DO NOT invent hexes).
4. Per-template motion budget note in each site brief. ([NN/g](https://www.nngroup.com/articles/animation-purpose-ux/))
5. Entry-modal / overlay-count assertion (≤3 floating elements per viewport, none on load except consent). ([NN/g](https://www.nngroup.com/articles/overlay-overload/))

---

## 5 · PROCESS — Abilash's rulings, 14 Jul 2026 (binding)

### 5.1 Design sources
- **Primary references: Awwwards, Mobbin, CSSDA.** Full-page/site-level direction comes from these.
- **Dribbble and Pinterest: COMPONENT-LEVEL only.** Never full-page direction from either — concept shots there are unbuilt fiction.
- **Every design decision cites its source.** A pattern adopted into a Factory site records where it came from (URL or reference name) in the site's design notes / launch evidence — same evidence discipline as everything else.
- **Brand tokens always win.** No inspiration source, skill, or plugin ever overrides `packages/ui/brand-tokens.css` or `raag-tokens.css` (CLAUDE.md doctrine (d)). If a reference conflicts with the manual, the manual wins, full stop.

### 5.2 Asset generation
- **Claude never generates raster assets itself.** For any image/graphic need, Claude drafts the EXACT generation prompt and names the tool to run it:
  - **Higgsfield** — per the site's register/imagery policy code;
  - **ChatGPT image model** — where policy allows;
  - **Google Nano Banana** — where policy allows.
- **No AI humans on KTAHV. Ever.** (Consistent with ENGINEERING_STANDARDS: "AI-gen only per the site's video/imagery policy code (never people on KTAHV)".)
- Source priority for real imagery stands: Kairali image library → manual-linked galleries → licensed stock → AI-gen last (ENGINEERING_STANDARDS placeholder-first workflow). Every slot ships with a described placeholder + IMAGE_MANIFEST.md entry until the real asset lands.

### 5.3 Scoring instrument
- **The design-critic gate (Ship Gate B-14, scripts/design-review/PROMPT.md) is THE scoring instrument** for design quality: skeptical-marketer review at 375px then desktop with computed-style audit; five criteria; **average ≥9.0/10, no criterion <7, max 3 iterations**; scorecard + honest-limitations committed to `launches/<domain>/design-review.md` BEFORE the preview goes to Abilash (C-1). Never grind the score up by softening criteria (doctrine (g): a failing gate is never fixed by weakening it).
- This doctrine feeds B-14: the manual-probe list in §4 is the reviewer's checklist extension; amendments to the five criteria go through LEARNINGS-driven PRs only.

---

## Reference sources
- [NN/g — Auto-forwarding carousels](https://www.nngroup.com/articles/auto-forwarding/) · [Carousel usability](https://www.nngroup.com/articles/designing-effective-carousels/) · [Hamburger menus](https://www.nngroup.com/articles/hamburger-menus/) · [Touch targets](https://www.nngroup.com/articles/touch-target-size/) · [Low-contrast text](https://www.nngroup.com/articles/low-contrast/) · [Legibility & comprehension](https://www.nngroup.com/articles/legibility-readability-comprehension/) · [F-shaped pattern](https://www.nngroup.com/articles/f-shaped-pattern-reading-web-content/) · [Popups](https://www.nngroup.com/articles/popups/) · [Overlay overload](https://www.nngroup.com/articles/overlay-overload/) · [Most-hated advertising](https://www.nngroup.com/articles/most-hated-advertising-techniques/) · [Learn More links](https://www.nngroup.com/articles/learn-more-links/) · [Get Started stops users](https://www.nngroup.com/articles/get-started/) · [Form placeholders](https://www.nngroup.com/articles/form-design-placeholders/) · [Needy patterns](https://www.nngroup.com/articles/needy-design-patterns/) · [Scrolljacking 101](https://www.nngroup.com/articles/scrolljacking-101/) · [Icon usability](https://www.nngroup.com/articles/icon-usability/) · [Photos as web content](https://www.nngroup.com/articles/photos-as-web-content/) · [Minimalism characteristics](https://www.nngroup.com/articles/characteristics-minimalism/) · [Aesthetic-usability effect](https://www.nngroup.com/articles/aesthetic-usability-effect/) · [Animation duration](https://www.nngroup.com/articles/animation-duration/) · [Animation purpose](https://www.nngroup.com/articles/animation-purpose-ux/) · [Microinteractions](https://www.nngroup.com/articles/microinteractions/) · [Response times](https://www.nngroup.com/articles/response-times-3-important-limits/) · [Skeleton screens](https://www.nngroup.com/articles/skeleton-screens/) · [Visual hierarchy](https://www.nngroup.com/articles/visual-hierarchy-ux-definition/) · [Why does design look good?](https://www.nngroup.com/articles/why-does-design-look-good/) · [Aesthetic & minimalist design](https://www.nngroup.com/articles/aesthetic-minimalist-design/) · [Luxury ecommerce principles](https://www.nngroup.com/articles/luxury-principles-ecommerce-design/) · [Communicating trustworthiness](https://www.nngroup.com/articles/communicating-trustworthiness/)
- [Baymard — Cart abandonment statistics](https://baymard.com/lists/cart-abandonment-rate) · [Mobile touch keyboards](https://baymard.com/blog/mobile-touch-keyboards) · [Mobile inline labels](https://baymard.com/blog/mobile-forms-avoid-inline-labels) · [Product page UX](https://baymard.com/research/product-page)
- [web.dev — CWV business impact](https://web.dev/case-studies/vitals-business-impact) · [CLS](https://web.dev/articles/cls) · [Optimize LCP](https://web.dev/articles/optimize-lcp) · [Font best practices](https://web.dev/articles/font-best-practices) · [prefers-reduced-motion](https://web.dev/articles/prefers-reduced-motion)
- [Think with Google — Mobile speed benchmarks](https://business.google.com/ca-en/think/marketing-strategies/mobile-page-speed-new-industry-benchmarks/)
- [Princeton — Dark Patterns at Scale](https://arxiv.org/pdf/1907.07032)
- [A List Apart — More meaningful typography](https://alistapart.com/article/more-meaningful-typography/) · [Art direction and design](https://alistapart.com/article/art-direction-and-design/)
- [Smashing — Fluid typography](https://www.smashingmagazine.com/2016/05/fluid-typography/) · [Spaces & Gestalt](https://www.smashingmagazine.com/2019/04/spaces-web-design-gestalt-principles/) · [Gestalt principles](https://www.smashingmagazine.com/2014/03/design-principles-visual-perception-and-the-principles-of-gestalt/)

*Amendments to this doctrine: LEARNINGS.md-driven PRs only.*
