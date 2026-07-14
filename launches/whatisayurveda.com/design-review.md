# whatisayurveda.com — Design-Critic Gate (Ship Gate B-14)

**Reviewed 2026-07-14 22:00:00 IST · Reviewer: design-critic agent (skeptical marketer + senior design reviewer) · PROMPT: `scripts/design-review/PROMPT.md` v1.0**

**Verdict: PASS — average 9.0/10, no criterion below 7.** Marginal pass: one score (Mobile UX, CTA clarity, both 8.5) carries the average to the line; two cheap, concrete fixes below would move it clearly clear of 9.0. No fixes applied in this pass (gate met); improvements handed to Abilash + the build owner.

This is judged as an **educational authority site** (group/educational register, ~20-page hub-and-spoke) whose job is to be trusted and cited — competitor set Cleveland Clinic / WebMD / Healthline / NCCIH — NOT as a commercial landing page. "Premium" is read as *authoritative / library-credible*, not flashy, per the niche brief §6 and the editorial-calm design direction (`docs/group-inputs/whatisayurveda-niche-brief.md` §2.2–2.3, §6).

---

## Method + viewports

Mobile-first per ENGINEERING_STANDARDS. Live preview `http://localhost:4312` (Next.js `next start`).

1. **375×812 (mobile)** — full walkthrough of `/` and `/what-is-ayurveda`; floating-UI stack audited live (consent banner · sticky CTA · Chatbase bubble) in both consent-open and consent-dismissed states; horizontal-overflow check; tap-target measurement; computed-style audit via `getComputedStyle` + `getBoundingClientRect`.
2. **1280×900 (desktop)** — pillar `/what-is-ayurveda`; nav render, one-accent-per-view verification across the whole page, section-capsule hierarchy, question-form H2 inventory, byline/citations presence, overflow check.
3. Static captures reviewed: `home-mobile.png`, `pillar-mobile.png`, `dosha-hub-mobile.png` (mobile first), then `home-desktop.png`, `pillar-desktop.png`, `skeptic-desktop.png`, `herb-desktop.png`. Live evidence capture committed: `mobile-footer-stack.png`.
4. Source + token audit: `sites/whatisayurveda.com/app/globals.css`, `app/page.tsx`, `app/layout.tsx`, `app/_components/{chrome,article}.tsx`, `packages/consent/src/ConsentBanner.tsx`, against `packages/ui/brand-tokens.css`.

All colour claims below are **computed `rgb()` values read from the live DOM**, not eyeballed from screenshots.

---

## Computed-style evidence (load-bearing)

| Element | Computed value | Token | Verdict |
|---|---|---|---|
| `h1` | `Kurale`, weight **400**, `rgb(0,66,38)`, 35.2px @375 | forest-700, Kurale-never-bold | ✓ |
| `.overline` | `Lato`, `rgb(193,136,44)`, 0.14em tracking | bronze-400 (NOT marigold) | ✓ |
| `.accent-rule` | `rgb(238,180,30)`, 52×4px | marigold-400 | ✓ |
| `.trust-item dt` | `rgb(0,96,56)` | forest-500 | ✓ |
| `.btn-primary` | bg `rgb(0,96,56)`, text `#fff`, min-h **48px**, radius 999px | forest-500 pill | ✓ |
| `.btn-secondary` | text+border `rgb(0,96,56)`, min-h 48px | forest-500 outline pill | ✓ |
| Focus ring (`.btn-primary:focus`) | `0 0 0 3px srgb(0.557,0.616,0.208)/0.55` | **leaf-500 @55%, 3px** (Manual ch.10) | ✓ present |
| Pillar lead capsule | `border-left-color rgb(238,180,30)` | marigold-400 | ✓ the one accent |
| Pillar section capsules (×8) | `border-left-color rgb(0,96,56)` | forest-500 | ✓ not marigold |
| **Marigold across entire pillar** | **one visible use: `.capsule.lead`** | one-accent-per-view | ✓ strict pass |
| Horizontal overflow | 0px @375, 0px @1280 | — | ✓ no leak |
| WhatsApp number | `wa.me/919289838797` → +91 92898 38797 | locked fact | ✓ correct (not …38777) |

**Floating-UI stack @375 (the mobile-UX crux):**
- Consent open: banner `z-index 60` / `position:fixed` / bottom, 140px tall, occupies 672–812; sticky CTA `z-index 50` sits *behind* it (743–812) fully covered; Chatbase bubble `display:none` via `:root[data-consent-open]`; `data-consent-open` attribute present. Clean — no visible collision.
- Consent dismissed: `data-consent-open` removed; sticky CTA revealed at bottom (48px button, 347px wide); Chatbase bubble `display:block`, `bottom:84px` (bumped above the sticky CTA by the `@media (max-width:767px)` rule). Stack is genuinely *managed*, better than most sites.

---

## Iteration-1 findings

No blocking defects. Findings are polish-level; none breaks a flow or the gate.

| # | Severity | Finding | Evidence | Selector-level fix |
|---|---|---|---|---|
| F1 | Minor (compliance/trust) | **Consent banner has no privacy-policy link.** `layout.tsx` renders `<ConsentBanner />` with `privacyHref` omitted, so the "We use cookies for analytics" band offers no link out — for a site whose whole value is trust, a linkless consent notice is a credibility + Ship-Gate-A12 gap. | `ConsentBanner.tsx` L23/L71 (link only renders when `privacyHref` set); `layout.tsx` L37 passes none; live DOM `[data-consent-banner] a` → absent. | Ship a `/privacy` page and pass `privacyHref="/privacy"` in `layout.tsx`. Known documented interim — but it is the single most concrete deficiency. |
| F2 | Minor (mobile floating-UI) | **Chatbase bubble overlaps the footer disclaimer on mobile.** At `bottom:84px` the third-party bubble sits over the copyright line and covers "Kairali" in "© 1908–2026 Kairali Ayurvedic Group." | `mobile-footer-stack.png`; bubble box vs `.footer-disclaimer`. | Add bottom padding on `.site-footer` (mobile) equal to the bubble clear-zone, or raise the bubble only when the footer is not in view. The method explicitly flags chat-bubble collisions. |
| F3 | Minor (CTA) | **Two adjacent "ask a doctor" affordances** at the mobile bottom: the Chatbase bubble AND the sticky CTA "Ask an Ayurvedic doctor" (→ WhatsApp). A first-time visitor sees two competing chat entry points in one corner. | `mobile-footer-stack.png`; `page.tsx` L129–131 sticky CTA + Chatbase loader. | Differentiate the two (e.g. sticky CTA → "Message us on WhatsApp", bubble → "Chat with our assistant"), or suppress one when the other is present. |
| F4 | Minor (CTA) | **Sticky CTA gives no "what happens next" cue.** "Ask an Ayurvedic doctor" silently deep-links to WhatsApp; the criterion wants helper copy telling the visitor where a tap goes. | `page.tsx` L130 (`href={WHATSAPP_URL}`); `article.tsx` L179. | Label or sub-label it "on WhatsApp", or add a WhatsApp glyph, so the destination is explicit. |
| F5 | Nit (E-E-A-T/human-made) | **Author byline is a collective, not a named individual.** "By the Kairali Editorial Team" — the reviewer (Dr. Deepu John, BAMS) is named, but every incumbent (Cleveland/WebMD/Healthline) names an individual *author*. Honest, but a notch below the incumbent byline pattern the brief sets (§2.2). | `article.tsx` L121; live byline. | Optional: name a lead author (or vaidya) alongside the team once editorial ownership is assigned. |
| F6 | Nit (brand) | **Chatbase bubble is the one off-token surface** — generic photographic face + marigold ring, not brand-token-controlled. Accepted third-party interim, but it is the only element on an otherwise token-perfect page that does not read as Kairali. | `mobile-footer-stack.png`. | If Chatbase allows, set the bubble avatar to the KAG icon on forest ground; else accept as documented interim. |

**Fixes applied this pass:** none. The gate is met at 9.0 without changes; per the hard gates the reviewer does not edit source to grind the score. F1–F4 are handed forward as the top improvements.

---

## Final scorecard

| # | Criterion | Score | Per-criterion evidence |
|---|---|---:|---|
| 1 | **Premium feel** (authoritative/trustworthy) | **9.0** | Calm, library-credible, expensive without hype: ivory ground, Kurale-400 headings, warm card shadow, real therapy photography (medicated oils + herbal poultices in brass, `home-desktop.png`), a genuine trust strip (Since 1908 · NABH-accredited · WHO-GMP pharmacy · Physician-reviewed) and dual byline. Zero template-smell; the "Our promise" band is a distinctive, non-generic editorial move. Only drag: the third-party Chatbase bubble (F2/F6) is the one non-premium blemish. |
| 2 | **Human-made feel** | **9.5** | The standout. Dense, specific, verifiable facts (Since 1908, four generations, NABH teaching hospital in Palakkad, own WHO-GMP pharmacy, *Withania somnifera*, classical-text framing) and a real point of view: "We will not overstate what Ayurveda can do… not to sell you anything," and a candid skeptic capsule that opens "Ayurveda is a 3,000-year-old medical tradition, not a modern science. Its core theory of doshas has no biological validation." Zero filler; the honest register is the opposite of AI-slop. Only ding: collective author byline (F5). |
| 3 | **Mobile UX** | **8.5** | 375px is clean: 0px horizontal overflow, 48px buttons/347px sticky-CTA tap targets, and a genuinely *managed* floating stack (consent z60 over sticky z50; Chatbase hidden via `data-consent-open`; bubble bumped to `bottom:84px` after dismissal; safe-area-inset padding throughout). Deductions: chat bubble overlaps the footer disclaimer (F2) and two adjacent "ask" affordances stack at the bottom (F3). Both minor; neither breaks a flow. |
| 4 | **CTA clarity** | **8.5** | One primary action per view (hero: filled "Start with the basics" + outline "Does it actually work?"); `data-cta` wired everywhere (`start_reading`, `read_evidence`, `cluster_click`, `whatsapp_click`, `pathway_click`, `email_click`); pathway modules are single-CTA and non-promotional (register-correct routing to KTAHV/KAPPL/Villa Raag). Deductions: sticky CTA lacks a "opens WhatsApp" cue (F4) and competes with the chat bubble (F3). |
| 5 | **Brand-manual fidelity** | **9.5** | Token-perfect, verified by computed styles: forest-500 interactive, ivory ground, Kurale-400 (never bold), Asap body, Lato/bronze-400 overlines, **marigold-400 as exactly ONE accent per view** (accent-rule on home; single `.capsule.lead` border across the whole pillar — all 8 section capsules forest), leaf-500 focus ring, warm shadow, pill buttons. Register-correct: KTAHV routing uses clinical language (physician supervision, treatment programmes, NABH hospital) with **no banned spa/resort/luxury/guests**; Villa Raag routing uses wellness register; no raag-tokens leakage. Footer marigold-300 is on a dark surface (Manual-allowed, code-flagged). WhatsApp number correct. Only 0.5 off: the non-token Chatbase widget (F6). |

**Average = (9.0 + 9.5 + 8.5 + 8.5 + 9.5) / 5 = 9.0/10.**

**Gate: average ≥ 9.0 ✓ · no criterion < 7 ✓ → PASS.**

---

## Honest limitations (not scored away)

- **Marginal pass at exactly 9.0.** Human-made-feel (9.5) carries the average to the line; had it been 9.0 the site would fail at 8.9. The score is honest, not rounded up — but F2 + F4 are cheap fixes that would lift Mobile UX and CTA clarity clear of the line and make the pass unambiguous. Recommended before C-1.
- **Consent banner has no privacy-policy link (F1)** — Ship Gate A12 remains a visible, documented launch gap. A trust-first site should not ship a linkless cookie notice; land `/privacy` first.
- **Clinical pages (`/panchakarma/*`, `/herbs/*`) await Dr. Deepu John's content sign-off** before go-live (CLAUDE.md rule 7). Their *design/template* is reviewed and passes here; their **content is not cleared for production** by this gate. `herb-desktop.png` (Ashwagandha) is design-approved, content-pending.
- **Raster KAG logo** (`/images/kairali-logo.png`, 46×46) is the accepted interim; vector lockups are still owed by the design team (`brand-tokens.css` L133). No penalty applied per the gate brief.
- **Chatbase bubble** is a live third-party widget (F6): its avatar + marigold ring are outside brand-token control and were reviewed as an accepted interim, not scored against brand fidelity.
- **Reviewed date is the build date** (`REVIEWED = "2026-07-14"`, `article.tsx` L22); a real review-cadence process (editorial policy) is asserted but not yet operational — freshness must be *monitored*, per brief §2.2.
- **Coverage:** live computed-style audit ran on `/` and `/what-is-ayurveda`; other pages (`/doshas`, `/is-ayurveda-scientific`, `/faq`, `/about`) were reviewed via committed screenshots + shared template source (`article.tsx`), which stamps identical furniture on every content page — but each was not independently walked at 375px in this pass.
- **Locales:** EN-only at launch. DE/FR scope for this site is an open question for Abilash (brief §9 Q5); flagged, not resolved here.
- **Performance/CWV not measured** in this gate (Lighthouse ≥90/100 is a separate Ship-Gate-A5 check); this review scores what machines cannot.

---

## Top 3 improvements (even on a pass)

1. **Ship `/privacy` and wire it into the consent banner** — pass `privacyHref="/privacy"` to `<ConsentBanner />` in `layout.tsx`. Closes F1 + Ship-Gate-A12; a linkless cookie notice is the weakest, most visible thing on an otherwise trust-first site.
2. **Resolve the mobile bottom-corner floating stack (F2 + F3)** — give `.site-footer` a mobile bottom clear-zone so the Chatbase bubble stops covering the copyright line, and differentiate the two "ask" affordances (sticky CTA → "Message us on WhatsApp"; bubble → "Chat with our assistant") so they don't compete.
3. **Add a destination cue to the sticky CTA (F4)** — label "Ask an Ayurvedic doctor" with an explicit "on WhatsApp" (text or glyph) so the visitor knows where the tap goes. Cheapest lift to CTA clarity.
