# exit-intent-spec.md — Exit-Intent Component Spec (LEAD-GEN sites only)

**Status: SPEC — pending Abilash's per-site offer approval.** Every offer/discount/copy line below is a placeholder direction, not approved copy: per rule 6, no invented prices, discounts, or claims ship without his sign-off. Drafted 2026-07-15 14:04:00 IST from the exit-intent evidence pass.

## 0. Scope — where this component may and may not exist

- **APPLIES: lead-gen sites only** — kairalicenters (18-centre network), KTAHV lead-gen/programme pages, Villa Raag enquiry pages, KAPPL product-enquiry sites, and `/lp/` campaigns where the brief asks for it.
- **EXPLICITLY EXCLUDED (Abilash directive): kairali.com and whatisayurveda.** No exit-intent of any kind on those properties. Build-time: the component refuses to mount unless the site config sets `exitIntent.enabled: true`; those two site configs never set it.
- Shipped as a shared component in `packages/ui` (Factory rule: no per-site implementations), themed only via `brand-tokens.css` / `raag-tokens.css` (Doctrine d).

## 1. Why it earns a place (benchmarks)

- Exit-intent popups convert at **~3.94% on average** (Wisepops 2026, 1B popup displays; overall popup average 4.82%, top-10% campaigns 57.7%). Cross-checked against Popupsmart's independent benchmark (6,692 campaigns, 105.3M displays, Jan 2024–Sep 2025): overall 3.49%, interaction rate 7.05%. Two independent datasets converge on the 3–5% baseline Abilash quoted. ([Wisepops popup stats](https://wisepops.com/blog/popup-stats), [Popupsmart benchmark](https://popupsmart.com/blog/popup-conversion-benchmark-report))
- A well-matched offer recovers **~10–15% of abandoning visitors** — "this works best when the offer matches the reason for leaving" (Popupsmart 2025; Flint's compilation puts top performers at 10–20%). The mechanism fits our vertical: high-consideration health/travel decisions have long research cycles, so capture-before-they-leave harvests visitors who were never converting on visit one. ([Popupsmart](https://popupsmart.com/blog/popup-conversion-benchmark-report))
- Success bar for our rollout: ≥3% shown→submit per site within 60 days, measured by our own `data-cta` events (§8), or the site's config is revisited.

## 2. Triggers

### Desktop
- **Mouse-leave through the top of the viewport** (`mouseout` where `relatedTarget` is null and `clientY <= 0`) — the standard exit signal.
- **Arming delay:** the trigger is inert for the first **10 seconds** on page AND until ≥1 scroll or interaction — never fires on a bounce-in-progress or on load (NN/g: never before the user has gleaned value from the page; see chat-bubble-placement.md §3).

### Mobile (no mouse-leave exists — proxy signals)
Industry-standard proxies, per Wisepops' mobile exit-intent guide and independently PushOwl (both document the same four): (1) back-button press, (2) fast upward scroll, (3) tab-switch/visibility change, (4) inactivity timer. We implement the **most effective pair**:

1. **Back-button (`popstate`)** — fires on hardware back and iOS swipe-back. Implementation law: push **exactly one** history state on arm; on `popstate` show the popup and do NOT re-push — the user's next back action MUST leave the page normally. Back-button hijacking (re-pushing states, trapping the user) is banned: it is hostile UX and a spam signal.
2. **Tuned upward scroll velocity** — scroll-up is "needed to access the URL bar on mobile" so the threshold must be tuned: Wisepops' explicit warning — "if it's too sensitive, it will trigger as soon as the user scrolls up a little." Spec default: fires only on a fast flick upward (velocity threshold, config-exposed) after ≥50% scroll depth, never on small corrective scroll-ups.

Not implemented in v1: visibility-change and idle-timer triggers (weaker signals; add later only with A/B evidence from our own analytics).

### SEO safety (both platforms)
Google's intrusive-interstitial guidance penalizes overlays that cover content **on load / immediately after navigation from search**. Exit-intent is user-behaviour-triggered, never load-triggered, which is exactly the safe side of that line — the component therefore: never fires on load, never within the 10s arming window, keeps a prominent close affordance, and is fully dismissible in one tap. ([Google Search Central — intrusive interstitials](https://developers.google.com/search/docs/appearance/avoid-intrusive-interstitials); see also chat-bubble-placement.md §3 coverage rules.)

## 3. Frequency caps & suppression

- **Max ONE exit-intent display per session.** Fired = spent, regardless of trigger type.
- **Dismissed → suppressed for 14 days** (config default; localStorage key, see §7 consent note).
- **Submitted → suppressed for 180 days** on that device (they're a lead; re-asking is noise).
- **One proactive element per session, fleet-wide:** the exit popup and the proactive chat teaser (chat-bubble-placement.md §3) share a single session budget. If the chat teaser fired, exit-intent is suppressed for that session, and vice versa. Priority: exit-intent wins on lead-gen pages (it has the direct capture form).
- **Never shown on:** form pages (the visitor is already converting), thank-you/confirmation pages, checkout handoff pages, privacy/legal pages.

## 4. Offer per site type — ALL COPY PENDING ABILASH APPROVAL (rule 6)

Evidence that shapes the offers:

- **A lead magnet roughly DOUBLES conversion vs a bare email ask** — the single highest-leverage decision: GetSiteControl (200+ popups): 3.83% mobile / 1.84% desktop without a magnet vs 7.73% / 4.70% with; corroborated by Wisepops (7.45% with incentive vs 4.60% without) and Omnisend 1.24B displays (2.4% vs 1.7%, 41% relative lift). ([GetSiteControl via shno.co](https://www.shno.co/marketing-statistics/email-list-growth-statistics))
- **For service/consultation businesses, consultation offers OUTPERFORM newsletter offers**, and low-friction phrasing ("5-minute consult", "quick chat") beats discounts for high-ticket services; **local businesses convert best with click-to-call and appointment-booking CTAs** — exactly the 18-centre case. ([Popupsmart vertical breakdown](https://popupsmart.com/blog/popup-conversion-benchmark-report); Crazy Egg: "replace the discount with a 5-minute consult… often more valuable than a price cut")

| Site type | Offer direction (placeholder — Abilash approves final copy) | Register |
|---|---|---|
| KTAHV lead-gen | **Programme brochure/guide download** (lead magnet, doubles CVR) + optional physician-consultation booking step | Clinical lock: patient/physician/programme/consultation language ONLY; banned-word lint runs on all popup copy in EN/DE/FR. Any clinical claim in the copy → Dr. Deepu John sign-off before staging→production (rule 7) |
| kairalicenters | **Consultation offer** ("book a consultation" / click-to-call / WhatsApp) — NOT a newsletter ask | Wellness-services register; per-centre phone/WhatsApp from content files, never invented |
| Villa Raag | Property brochure / enquiry ("check availability") | Hospitality-wellness register (spa/resort framing permitted here — do not cross-apply KTAHV lock) |
| KAPPL product sites | Product guide download / WhatsApp product enquiry | Product-pharma register. **No discount codes without Abilash** — pricing lives in Shopify, out of this workspace's scope |
| /lp/ campaigns | Mirror the LP's single CTA only — the popup may restate it, never introduce a second competing offer | Per campaign brief |

**No discounts anywhere in v1.** The evidence says consultation/magnet offers fit high-ticket services better than price cuts, and any discount requires Abilash's explicit approval of the amount and terms.

## 5. Format

- **Two-step (multi-step) by default:** step 1 = one wellness-goal / intent question (button choices, no typing), step 2 = the capture form. Evidence: multi-step popups convert 5.17% vs 4.62% single-step on average, top-10% multi-step campaigns ~46% (Wisepops 2026); the health-vertical proof point is Batch CBD's interactive exit funnels asking wellness-goal questions before requesting email. Step-1 answer is stored on the lead (source tag) — it is qualification data, not decoration. ([Wisepops](https://wisepops.com/blog/popup-stats))
- **With an image** (5.71% vs 3.98% imageless — same source). Image from the entity's approved media library; brand tokens for everything else.
- **Direct offer, no teaser:** ~12% vs ~3.4% teaser-first for lead-gen (Popupsmart 2025). The popup states the offer immediately; no "wait, spin, unlock" games.
- **Mobile-first sizing:** mobile popups outconvert desktop (4.98% vs 3.67%, Wisepops) — mobile is the primary design target, and coverage respects the interstitial guidance (§2): comfortably dismissible, never a full-screen takeover on organic-landing pageviews.

## 6. Form

- Built on **`packages/forms`** exactly as frozen: replicate the production CRM schema/endpoint (field names, hidden fields, source tags), plus the three permitted v1 additions — **consent checkbox + privacy-policy link, invisible Cloudflare Turnstile, `data-cta` events**. Store-first submission handling per `packages/forms`; no new endpoints, no schema drift.
- Hidden source tag identifies the lead as exit-intent (+ site + step-1 answer) so CRM can score it.
- Minimal visible fields (name + phone/WhatsApp OR email — per site brief); the consultation variants may replace the form with click-to-call / WhatsApp deep-link buttons (still emitting `data-cta`).
- KTAHV: ships in **EN/DE/FR** or is explicitly flagged EN-only pending translation; DE/FR copy passes the banned-word check in those locales (Kur/Urlaub/Luxus; cure/vacances/luxe in banned senses).
- Evidence per site at launch: one live test lead screenshotted in CRM (Checklist B8).

## 7. Dismissal law

- Visible close button (≥44×44px target), **Escape key**, and **click/tap on the backdrop** all dismiss. One action, no confirm-shaming copy ("No thanks, I hate my health" patterns are banned).
- Dismissal is remembered (§3 caps). Storage note: the dismissal flag is strictly-necessary/functional storage (it exists to NOT show the user things); it does not gate on marketing consent, but the analytics events (§8) respect `packages/consent` state like every other event.
- **Back-button dismissal counts as dismissal** — a second back press always leaves the page (§2 mobile law).
- The popup never re-arms on the same pageview after dismissal.

## 8. Accessibility

- Opened popup is a **modal dialog per the ARIA APG pattern**: `role="dialog"`, `aria-modal="true"`, labelled by its heading; focus moves into the dialog on open, is trapped while open, and **returns to the previously focused element** on close.
- Esc closes (§7). All controls keyboard-operable; step-1 choice buttons are real buttons.
- Trigger timing never interrupts active typing: if focus is inside any form field on the page, the exit trigger is deferred until blur.
- Animation respects `prefers-reduced-motion`.
- No auto-focus theft on mobile scroll-up trigger without visible cause — the dialog announces via the dialog role, not `aria-live` spam.

## 9. Measurement plan (`data-cta` events)

Per doctrine: the combined evidence above is benchmark/vendor data — **our own analytics decide whether this stays**. Events via `packages/analytics`:

| Event | Fires |
|---|---|
| `data-cta="exit-intent-armed"` | trigger armed (10s + interaction gate passed) |
| `data-cta="exit-intent-shown"` | display, with trigger-type payload (`mouse-leave` / `back-button` / `scroll-up`) |
| `data-cta="exit-intent-step1"` | wellness-goal answer selected (answer in payload) |
| `data-cta="exit-intent-submit"` | form submitted / call or WhatsApp CTA clicked (channel in payload) |
| `data-cta="exit-intent-dismissed"` | closed without converting (method in payload: `x` / `esc` / `backdrop` / `back`) |

- **KPIs:** shown→submit CVR vs the 3.94% benchmark (§1); step1→submit completion; trigger-type performance split (validates the mobile trigger pair); dismissal-method mix.
- **Guard metrics:** bounce rate and session depth on popup-enabled pages vs pre-launch baseline; any organic-traffic dip on popup-enabled templates escalates to Abilash (SEO §2).
- Weekly QA audit verifies events fire (Playwright pass) and that the component is ABSENT on kairali.com and whatisayurveda.

## 10. Ship gate

Component ships when: `pnpm build` clean · spec coverage for triggers/caps/dismissal green · compliance lint zero findings on all popup copy (per-entity register + KTAHV banned words, all locales) · a11y checks pass · **Abilash has approved the per-site offer copy** · KTAHV clinical copy has Dr. Deepu John's sign-off where rule 7 applies. Until the offer approvals land, this document is a SPEC, not a build order.

## Changelog
- v0.1 SPEC (2026-07-15 14:04:00 IST): initial evidence-based spec from the exit-intent research pass; offers pending approval.
