# design-qa report — kairalihospitality.com (feat/kairalihospitality-v1)

**2026-07-16 22:07:28 IST · sub-agent: design-qa**
Audited against: `.claude/agents/design-qa.md` (mistakes checklist + principles + PREMIUM section — brief is premium/cinematic), `packages/ui/brand-tokens.css` v1.1, design intent `docs/design-research/kairalihospitality-2026-07-16.md` (§5 MUST/MUST NOT), CLAUDE.md KTAHV lock + locked facts, `IMAGE_MANIFEST.md`.
Method: production build (`next start -p 4316`, BUILD_ID `2u9sq4w8-hNDLlPy0xHdK`), Playwright (node lib) 1.61.1 headless Chromium at 375×812 / 768×1024 / 1440×900, settled-state reads (networkidle + 600ms), computed-DOM register scans (not source), real-keyboard focus reads, reduced-motion context. Evidence: `launches/kairalihospitality.com/screens/qa-*.png` (7 files). Site guard suite `test/guards.test.js`: **8/8 pass** (run 22:0x IST).

---

## Findings

| Issue | Severity | Location | Fix |
|---|---|---|---|
| Consent first-paint law near-miss at 375×812: hero statement (h1 bottom 531px) and place strip (573px) clear the banner (top 649px) ✓, but the first door's title bottom = 661px — its first line is clipped ~12px by the banner. The site's own stated law (globals.css lines 427–428: "the hero statement AND the first door must read above the consent banner") is not fully met. Evidence: `qa-mobile-375-firstpaint-consent.png`. | Warning | `app/globals.css` @media ≤759.98px (`.hero { min-height: 76svh }`, `.fork { margin-top: -30px }`) | Shave ~16px: `min-height: 74svh` on mobile hero, or `-38px` fork pull; re-verify at 375×812. |
| LCP economics: `hero-villa-raag-dusk.jpg` is 438 KB / 1600px, served whole to a 375px viewport — plain `<img>`, no `srcset`/`sizes`, no preload, JPEG only. Confirmed LCP element (`hero-photo`, buffered PO). Localhost LCP 64ms is not meaningful; at Fast-4G ~1.6 Mbps the transfer alone ≈ 2.2s → real-world mobile LCP > 2.5s risk. | Warning | `app/page.tsx` line 104–111 | Add responsive derivatives (e.g. 640/960/1600 srcset + sizes, or next/image) and an AVIF/WebP variant; keep `fetchPriority="high"`. |
| `panel-healing-village-cottage.jpg` 456 KB — heaviest asset on the page for a lazy panel that never renders wider than 560px (mobile/tablet). All 5 photos ship JPEG-only; premium tip requires WebP/AVIF despite visual richness. | Warning | `public/images/` + `app/page.tsx` line 201 | Re-derive at q≈70 or AVIF (~half weight); batch-add WebP/AVIF for all five. |
| Healing Village panel copy is the longest of the three and pushes its text up into the weakest zone of the veil gradient (over the sunlit footpath). Passes visually at 1440 (`qa-desktop-panels-viewport.png`) but it is the thinnest contrast moment on the page. | Warning (advisory) | `app/globals.css` `.panel-veil` / `app/page.tsx` line 211–215 | Deepen the mid-stop of `.panel-veil` (e.g. 78% → 84% at 100%, or start the ramp at 24%) or trim the panel-line by a clause. |
| Footer "Terms" link tap target 38px wide (height 44px ✓). WCAG 2.5.8 (24px) passes; the house 44px floor does not. Only offender on the page. | Warning (minor) | `app/page.tsx` line 395 / `.footer-nav a` | Add `padding-inline` to `.footer-legal a` (same negative-margin trick already used for `[data-cta]`). |

No Critical findings.

## Checks that PASS (computed page, not source)

- **Clinical lock (the named check):** both `data-register="clinical"` blocks extracted from the RENDERED DOM — the Treatment door (`door_clinical`) and the Healing Village panel (`#healing-village`) — scanned against the full 16-word lexicon from `packages/compliance/src/rules.js` (spa/resort/holiday(s)/luxury/luxurious/cure(s)/journey(s)/guest(s)/getaway(s)/escape(s)): **zero hits**. The card speaks hospital register (physician-led treatment programmes, patient cottages, "Begin a treatment enquiry"). "Resort Svatá Kateřina" appears only outside the clinical blocks — correct scoping (lock is card-scoped, and "Resort" is the property's verified name).
- **Register / voice:** zero banned-filler hits on the whole computed page; no exclamation headings; sentence-case body, Title Case heads.
- **Locked facts:** info@kairali.com is the only mailbox (×3); WhatsApp +91 92898 38797 / wa.me/919289838797; **no 38777**. Property links = villaraag.com, www.ayurvedichealingvillage.com, katerinaresort.cz/en.
- **Facts gate:** rolling numbers computed (118 = 2026−1908, 37 = 2026−1989 render correctly); counters "3 properties · 2 countries" are literally true; JV named without any ownership claim (schema also omits parentOrganization for Kateřina); "on the horizon" band correctly omitted (nothing announceable); Kateřina panel ships text-first on forest-700 — the manifest GAP honoured, no faked photo.
- **Brand tokens:** Kurale 400 for h1/h2/h3 (never bolded, computed weight 400); Asap body 16px; Lato overlines/captions/place-strip; latin-ext loaded — Kateřina/VYSOČINA render in brand faces (fonts.check true). No raag-tokens import. h2 forest-700 on ivory; panel text ivory-on-veiled-dark.
- **Marigold law:** exactly ONE marigold moment in the whole page — `.accent-bar` (52×5px, `#EEB41E` background) above the Consultancy overline; marigold never occurs as text anywhere (full-DOM computed sweep).
- **Buttons/motion:** all `.btn` pills 999px radius, 44px height, Asap 600; `btn-primary` hover deepens forest-500→forest-700 (`transform: none`); door/panel transitions are box-shadow/opacity at 150/400ms brand ease; no parallax, carousels, or bounce anywhere; `prefers-reduced-motion` collapses every transition to 0.01ms (verified in a reduced-motion context).
- **Focus (keyboard-verified, not programmatic):** Tab sequence wordmark → hero Enquire → 3 doors → panel links all show the leaf ring (`#8E9D35` @55%, 3px); on doors it correctly stacks OVER the warm card shadow. Evidence: `qa-desktop-door-focus.png`.
- **Layout:** no horizontal overflow at 375/768/1440; fork 3-col ≥760px; the three 3:4 portrait panels share one desktop viewport (462px tall at 1440×900) — §5.2 MUST met; asymmetric proof pair 1.35fr/1fr lands at ≥760px.
- **Hierarchy/CTA:** single H1; one primary CTA voice (Enquire/WhatsApp) with header pill above the fold at every breakpoint; `data-cta` on all 16 conversion links.
- **Imagery honesty:** all 6 alt texts match IMAGE_MANIFEST.md verbatim and describe the actual frames; 5 library originals, no stock, no AI humans; panels + proof pair `loading="lazy"`, hero eager+high. og.jpg 1200×630, 122 KB.
- **Consent:** defaults denied before tags ("Nothing is stored until you choose"), Essential-only offered as an equal 44px pill beside Accept-all, privacy link present.
- Note (test hygiene, not a page defect): `node --test test/` fails on a loader quirk while `node --test test/guards.test.js` passes 8/8 — add `"type": "module"` to the site package.json or run the file path in CI to avoid a false red.

## D-DESIGN-DIFF similarity check vs the fleet

Compared against: arogyashala.in (`launches/arogyashala.in/screens/critic-desktop-full.png` + source), kairali.com (`launches/kairali.com/home-desktop-full.png`), healing.recipes (`launches/healing.recipes/screens/home-desktop-full.png`), arogyakendra.com (source read — no screens dir).

**Page-level verdict: DISTINCT — not recolor-mistakable.** This is the only fleet surface with a full-bleed edge-to-edge photographic hero, on-image portrait property panels, a typographic place strip, a forest-700 pull-quote + counters band, and an asymmetric editorial pair. kairali.com/arogyakendra/healing.recipes all run the contained polaroid-hero + landscape-card skeleton; arogyashala runs a dark text band + annotated SVG. The old-skeleton devices the brief banned as primaries (polaroid hero, 4-chip stat band, uniform landscape grid) are genuinely absent.

Repeats, named:

1. **Tolerated per task, listed:** WhatsApp+email pill pair (arogyashala ×2, kairali.com hero, here ×2) · locked-facts trust content (1908 lineage / 1989 group / NABH / WHO-GMP — arogyashala's 4-col trust band, kairali.com's hero copy, here the lineage band + consultancy prose).
2. **Door/intent-fork component — the one non-tolerated repeat worth naming:** the `.door` card is a near-verbatim lift of arogyashala.in's (same anatomy: white card, 3px forest top border, bronze kicker caps, Kurale forest title, forest hint-with-arrow; same hover shadow line `0 12px 28px bronze@22%`; same negative-margin "hinge" breach of the band above; same `:focus-visible` stack). arogyashala = 2 doors on a dark band; here = 3 doors on a photo hero, so in situ they read related-but-different — component-level recolor-mistakable, page-level not. The research doc's §5.4 claim "none of our builds fork audiences" is now stale (two sites shipped forks the same week). Recommendation for the beauty pass: give the umbrella's doors one distinguishing move (e.g. drop the top border and letter the kickers, or image-back the Stay door) so the two sites don't share identical furniture at their most-clicked element.
3. **Marigold accent bar/rule micro-device:** kairali.com (bar over hero overline), arogyakendra (`accent-rule`), healing.recipes (vertical author bar), here (`accent-bar`). This is Brand-Manual "marigold punctuates" furniture — acceptable, but it is now the fleet's default way to spend the one marigold moment; noted for variety later.
4. **Shared brand furniture (expected, fine):** bronze overline + Kurale H2 section heads, white warm-shadow cards (services grid — secondary device here, so within the brief's MUST NOT), forest-700 dark bands, footer anatomy, consent banner.

## Verdict

**PASS WITH WARNINGS** — ship-quality cinematic surface; the five warnings above are pre-DNS polish items (the first two — mobile first-paint 12px clip and hero srcset/format — should land before the Lighthouse gate is run).

Similarity: **DISTINCT at page level; one component-level repeat named (door fork ex arogyashala.in) + tolerated pill pair / trust facts / accent-bar furniture.**

*Files reviewed: app/page.tsx, app/layout.tsx, app/globals.css, site.config.json, IMAGE_MANIFEST.md, public/images/*, packages/ui/brand-tokens.css, packages/consent/src/ConsentBanner.tsx, packages/compliance/src/rules.js, test/guards.test.js. Logged to agent-log.jsonl via the PostToolUse hook (rule q); logger rollup to wiki/log.md is the committed spine.*
