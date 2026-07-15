# chat-bubble-placement.md — The Mobile Chat-Bubble Law

Binding placement/behaviour rules for any chat or WhatsApp bubble on Kairali fleet sites. Evidence cited inline. Drafted 2026-07-14 19:45:42 IST.

## 1. Placement

- **Default: bottom-right**, because convention beats raw reachability. Hoober's observational study of 1,333 smartphone users (via Smashing Magazine's thumb-zone guide) found ~49% one-handed use with the thumb doing the work; the "natural" green zone is bottom-center and the lower area on the thumb side, with far corners in the stretch/hard zones. Bottom-right works for the right-handed majority (~70%), the pattern mirrors for left-handed holds (~30%), and users *expect* chat bottom-right — the expectation is the stronger argument. ([Smashing Magazine — thumb zone](https://www.smashingmagazine.com/2016/09/the-thumb-zone-designing-for-mobile-users/))
- **Low but not jammed into the corner:** the bubble sits low with generous padding rather than in the extreme corner (corners are reachable but not the easiest targets — same source).
- **Size/offsets:** 48–56px tap target, ≥16px edge padding. This satisfies WCAG 2.2 SC 2.5.8 (24×24 CSS px floor, Level AA) and the enhanced SC 2.5.5 AAA / Apple HIG 44×44pt / Material 48×48dp guidance. ([W3C — Understanding SC 2.5.8](https://www.w3.org/WAI/WCAG22/Understanding/target-size-minimum.html))

## 2. Offsets vs sticky bottom CTA bars

Long-form and LP pages carry a sticky bottom CTA (see LANDING_PAGE_DOCTRINE.md §6). The bubble must never overlap the page's single primary action; each floating element needs a collapse/close affordance, or sites accumulate a "cluttered fringe" of chat bubble + cookie bar + back-to-top + sticky CTA (Digital X Labs / GoodUI pattern #41, via Intercom custom-launcher discussion). The standard patterns:

1. **Vertical offset:** lift the bubble above the bar via launcher padding.
2. **Hide/shrink on scroll** or on pages that own a bottom CTA.
3. **Single-slot floating-stack manager:** only one floating element occupies the corner at a time.

Vendor caveat: Intercom exposes `alignment`, `horizontal_padding`, `vertical_padding` in intercomSettings, but "on mobile devices, the alignment, horizontal_padding, and vertical_padding values will be ignored" — the documented reliable fix for full placement control is a **custom launcher** (own button element that opens the messenger, default launcher disabled). Assume the same fragility from any third-party widget: we own the launcher. ([Intercom — custom launcher](https://www.intercom.com/help/en/articles/2894-create-a-custom-launcher))

## 3. Proactive-popup caps

Baymard's large-scale usability testing found **all three** proactive-chat approaches — full overlay dialogs, dialog pop-ups, persistent sticky bubbles — disruptive; site-initiated chat reads like a "pushy salesperson," and sticky bubbles disproportionately harm mobile by covering content (users unable to read text behind the bubble; blocked autocomplete, swatches, filter toggles). Chat should be **user-initiated**, with entry points in footer, help/support, and shipping/logistics content. ([Baymard — live chat usability](https://baymard.com/blog/live-chat-usability-issues))

If a proactive teaser is used at all, NN/g's rules apply: **never before the user has gleaned value from the page; only one at a time; nonmodal (page stays interactive); minimal screen coverage; easy dismissal.** NN/g logged ~25 popups/week in normal browsing; in testing a participant threw his phone across the table and abandoned the task after consecutive popups; overlapping floating elements are "even worse" on small devices. ([NN/g — popups](https://www.nngroup.com/articles/popups/))

Operational numbers:

- **Trigger delay:** 30–60s time-on-page on high-intent pages (pricing, product/programme); longer on reading-heavy pages — behaviour-based triggers (time, scroll depth, URL), never site-wide auto-open. ([Crisp — 25 live-chat triggers](https://crisp.chat/en/blog/live-chat-triggers-25-ideas-customers-engagement/))
- **Frequency:** max **one proactive message per session**; suppress for users who dismissed it and for recent converters (same source).
- **Coverage:** widget ≤ ~15% of the mobile screen (same source). SEO backstop: Google's intrusive-interstitial guidance penalizes mobile overlays that cover content on load — use elements occupying "a reasonable amount of screen space"; practitioners converge on <15–25% viewport for auto-shown elements. A small bubble is safe; **an auto-expanding chat window on landing is not** — it risks the ranking signal and the NN/g-documented abandonment. ([Google Search Central — intrusive interstitials](https://developers.google.com/search/docs/appearance/avoid-intrusive-interstitials))
- **Auto-open ban is also an accessibility rule:** unexpected focus/content changes break screen-reader context (Oscar Chat checklist, cited via the WCAG source below).

## 4. Hide states

Hide the bubble entirely on:

- **Checkout and payment steps, form-heavy pages, filtering/search interfaces** — exactly where Baymard found sticky chat blocking task-critical UI (swatches, filter toggles, autocomplete on mobile). ([Baymard](https://baymard.com/blog/live-chat-usability-issues))
- **Any page with its own sticky bottom CTA when no offset slot exists** (§2).

Conversion evidence for keeping chat everywhere is weak: CXL found "implementing live chat was negligible when it came to conversions" absent trained staff and process — chat earns its place in complex/high-consideration purchases and as qualitative research. **Targeted presence (programme/product, pricing, contact, how-to-reach pages) beats a site-wide always-on bubble.** ([CXL — how to make live chat convert](https://cxl.com/blog/how-to-make-live-chat-convert/))

## 5. Accessibility & performance

- **Collapsed bubble:** ≥24×24 CSS px (WCAG 2.2 SC 2.5.8, AA floor); we build to 44–48px (SC 2.5.5 AAA / Apple 44pt / Material 48dp). ([W3C — SC 2.5.8](https://www.w3.org/WAI/WCAG22/Understanding/target-size-minimum.html))
- **Opened window is a dialog:** focus moves in and is trapped per the ARIA APG modal-dialog pattern, returns to the launcher on close; dismissible via Escape and a visible close button (same source's companion checklist).
- **Facade loading is mandatory.** Third-party chat widgets are among the biggest Core Web Vitals offenders — 100–500KB+ JS each (Zendesk >500KB to render one button); Intercom/Drift/Crisp/Tawk/Tidio run 100–400KB and lead poor-INP causes; Lighthouse ships a dedicated "lazy load third-party resources with facades" audit for chat widgets. The pattern: render a lightweight fake bubble in HTML/CSS, load the real widget on click or idle — Postmark's Intercom facade cut TTI 7.7s → 3.7s, and a deferred widget cannot degrade LCP since it stops competing for bandwidth during initial render. ([DebugBear — third-party code](https://www.debugbear.com/blog/reduce-the-impact-of-third-party-code))

## 6. Synthesis (the law in one paragraph)

Default bottom-right bubble, 48–56px tap target, ≥16px edge padding, lifted above any sticky CTA bar (or bar and bubble share a managed single slot); facade-loaded; **no auto-open on mobile**; at most one contextual proactive teaser per session, after 30–60s on high-intent pages only, dismissible, covering well under 15% of the viewport; hidden on checkout/forms/filter UIs; opened dialog focus-trapped with focus return. No single source prescribes the full stack; each element traces to at least one citation above — the synthesis intersection is per the findings set anchored at ([Baymard](https://baymard.com/blog/live-chat-usability-issues)).

## 7. Factory implementation

- **`packages/ui` floating-stack task:** build the single-slot floating-stack manager (§2 pattern 3) as a shared `packages/ui` component — one corner slot arbitrating chat bubble / sticky CTA bar / cookie-consent / back-to-top, with per-page hide states (§4), the facade launcher (§5) as the only way a chat widget loads, and WCAG focus management baked in. Per Factory rules, every site consumes this from `packages/*` — no per-site bubble implementations. Design skills/plugins never override `brand-tokens.css`/`raag-tokens.css` (Doctrine d).
- **Already shipped and to be treated as the reference behaviour:** kairali.com and arogyakendra already implement the core of this law — **bubble lifted above the sticky bar** (§2 pattern 1), **proactive popups suppressed on mobile** (§3), and **consent-yield** (the bubble yields the slot to the cookie-consent element until consent is resolved — one floating element at a time, §2 pattern 3). The floating-stack component generalizes what those two sites do by hand.
- QA hook: the weekly audit pass and LP checklists should verify bubble/sticky-bar non-overlap on mobile viewport, absence of auto-open, and hide states on consultation/enquiry/contact form pages.

## 8. Multi-channel launcher (dual-bubble) verdict — 15 Jul 2026

Appended 2026-07-15 14:04:00 IST (task #11). Question researched: combined WhatsApp+AI-chat launchers vs two separate bubbles vs our current sticky-bar + bubble split.

### 8.1 What the market actually ships

- The dominant "combined" pattern is **NOT two bubbles** — it is a **single floating bubble that expands into a channel picker** (speed-dial FAB). Chaty (the category leader on WordPress/Wix/Shopify), GetButton, Bit Assist and Buttonizer all implement one launcher exposing WhatsApp/call/Messenger/email inside it, with per-device rules (e.g. Call+WhatsApp on mobile, form+email on desktop), page targeting, trigger delays and built-in click analytics. This is almost certainly the pattern Abilash saw. ([Chaty — WordPress plugin](https://wordpress.org/plugins/chaty/))
- The exact "WhatsApp + AI chatbot in one outer bubble" combination is a **productized commodity, not custom design**: GetButton's own pitch is an "all-in-one chat button… enabling chat via WhatsApp, Custom ChatGPT, Messenger, Instagram, and more" (also Boei, Social Intents), aimed largely at SMB/WhatsApp-first markets. ([GetButton](https://getbutton.io/))
- Design-system guardrail: Material's speed-dial spec caps an expanding FAB at **3–6 related actions** ("If more than six actions are needed, something other than a FAB should be used"); for a contact launcher the practical ceiling is **~3** (WhatsApp, call, AI chat) before choice costs kick in. ([MUI SpeedDial / Material spec](https://mui.com/material-ui/react-speed-dial/))

### 8.2 Why WhatsApp-forward launchers fit our market

- India is the archetypal WhatsApp-first market (500M+ users heading to ~800M). GoKwik's WhatsApp Commerce Intelligence Report 2026 (26B messages, 1,800+ D2C brands): 83% of WhatsApp-driven orders in the Oct–Dec 2025 festive quarter were first-time buyers; brands using WhatsApp marketing saw 2.25x higher median GMV growth; ~98% open rates vs email's ~20%. Indian D2C brands use WhatsApp for **acquisition**, not just support. ([Outlook Business — D2C brands lean on WhatsApp](https://www.outlookbusiness.com/corporate/d2c-brands-lean-on-whatsapp-to-find-new-customers))
- Healthcare specifically: WhatsApp is described as the #1 patient-communication channel for Indian hospitals; instant WhatsApp replies are credited with converting enquiries to confirmed appointments and 20–30% no-show reduction. **Caveat: vendor-reported figures (TeleCRM et al.), not independent A/B trials — directional only.** ([TeleCRM — WhatsApp chatbot for hospitals](https://telecrm.in/blog/whatsapp-chatbot-hospital/))

### 8.3 The honest conversion read

There is **no rigorous public A/B evidence that a combined multi-channel launcher outperforms a single well-chosen channel**. Vendor claims exist ("WhatsApp widgets boost conversions by 45%", "2–5x more inquiries than email or phone" — Flowcart/TailorTalk, unaudited). What the evidence does support:

1. **WhatsApp entry points strongly outperform email/phone for enquiry volume** (§8.2 sources).
2. **Fewer floating elements convert better.** Yonder's tourism-site analysis — the only placement-specific finding with a stated mechanism: overlapping widgets create "friction at the exact moment you should be removing it", and "over 60% of tourism traffic is mobile — and that's where conflicts show up most often." ([Yonder — chatbot placement](https://blog.yonderhq.com/yonders-blog/why-your-chatbot-placement-matters-and-how-to-fix-conflicts-on-your-tourism-website))
3. **Choice paralysis is real at the launcher:** Hick's Law / choice-overload research puts the usable ceiling at 3–5 options in a chat/contact context, and a launcher that opens to a menu adds one extra decision + one extra tap before any conversation starts — it must earn that tap.

Any combined-launcher decision gets validated with our own `data-cta` click analytics, not vendor claims.

### 8.4 Verdict

- **Two separate bubbles: NEVER.** It violates the single-slot law (§2 pattern 3) and the fewer-floating-elements finding (§8.3). If two channels are wanted, they live inside ONE launcher.
- **Combined launcher (speed-dial): allowed, capped at 3 channels**, and only where ≥2 channels genuinely carry lead volume. The menu costs one decision + one tap, so a site with one dominant channel should skip it.
- **Single direct-open WhatsApp bubble: the default** for WhatsApp-first lead-gen — zero extra taps, matches §8.2 market evidence.
- **Current sticky-bar + bubble split (kairali.com / arogyakendra reference behaviour, §7): keep.** It already satisfies the single-slot law; nothing in the research says to replace it.

**Recommendation per site type** (offers/copy still per entity register; KTAHV clinical lock applies):

| Site type | Launcher | Rationale |
|---|---|---|
| KTAHV lead-gen pages | Single WhatsApp bubble, direct-open (Priya: +91 92898 38797), clinical-register prefill | One dominant channel; menu tap unearned. Upgrade to 3-item speed-dial (WhatsApp / call / AI chat) ONLY if/when an AI intake assistant ships and call volume justifies it |
| kairalicenters (18-centre network) | Combined speed-dial: WhatsApp + click-to-call (2 items; 3 max if AI chat ships) | Local-business evidence favours click-to-call alongside WhatsApp; per-centre numbers make a picker genuinely useful |
| Villa Raag | Single WhatsApp bubble, direct-open | Boutique property, one channel; hospitality register |
| KAPPL / product sites | Single WhatsApp bubble on enquiry/product pages; hidden near Shopify checkout handoff | Checkout is Shopify — never interfere; product-pharma register |
| kairali.com (group corporate) | Keep current sticky-bar + bubble split as-is | Reference behaviour (§7); corporate register |
| /lp/ landing pages | NO launcher menu — single CTA rule wins; at most a single-channel bubble matching the campaign CTA, or none | LANDING_PAGE_DOCTRINE.md single-CTA law |

### 8.5 Changes to the `packages/ui` floating-stack spec

The §7 floating-stack component gains ONE addition — a launcher variant — everything else in this law is unchanged:

- `launcher: "single" | "speed-dial"` — `single` (default) opens the channel directly on tap; `speed-dial` expands upward into a channel list, **hard-capped at 3 items** (build-time lint, not a soft guideline).
- Speed-dial still occupies the SAME single corner slot, is facade-loaded (§5), inherits all hide states (§4), all placement/offset rules (§1–2), and the no-auto-open law (§3). The menu never auto-expands.
- Each expanded channel item ≥44px target; expanded state is a menu for focus purposes (Esc or re-tap collapses, focus returns to the launcher).
- **We own the launcher — no Chaty/GetButton/third-party plugin.** Same reasoning as the Intercom custom-launcher caveat (§2): third-party launchers break placement control and CWV (§5).
- Instrumentation is mandatory so §8.3's open question gets answered with our data: `data-cta="launcher-open"`, `launcher-whatsapp`, `launcher-call`, `launcher-ai` per channel; weekly QA audit verifies the events fire.
