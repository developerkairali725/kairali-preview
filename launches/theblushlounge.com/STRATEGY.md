# STRATEGY — theblushlounge.com · 2026-07-18 18:18:10 IST

Front gate 2 of 4 (approvals.yaml `strategy` — the deliberately FAT gate: ONE
approval covers sitemap + per-page keywords + competitor-keyword-to-page map +
integrations plan). Grounded in docs/blushlounge-inputs/comp-set.md (18 Jul),
the 18 Jul mining layers, and BRIEF.md. No search-volume numbers anywhere — no
GSC/keyword-tool history exists for this domain; the map is qualitative until
data accrues (HARD GATE 6).

## 1 · Sitemap (6 pages, lean at birth — complete at launch)

```
/            Home — full-bleed hero · positioning · services teaser · portfolio strip ·
             press/trust bar (MAC Bridal · Femina · Grazia · CMS LA) · testimonial slot ·
             academy teaser · WhatsApp-first CTA
/portfolio   Category-filterable gallery (bridal · cocktail/party · editorial/SFX ·
             destination) — interim: the 14 screened IG captures; static IG strip → profile
/services    ONE page, anchored sections (kills the old duplicate-content problem):
             #bridal · #engagement-cocktail · #party · #editorial-sfx · #grooming-men
             — each with OWN copy in her voice; price-on-enquiry CTA per section
/academy     Blush School of Beauty — PRO course · online masterclasses · self-makeup
             class; what-you-learn structure; enquiry CTA (no checkout)
/about       Sneha's story: Chandini Singh training → Scandinavian Makeup Academy →
             Cinema Makeup School LA → MAC Bridal · press features · destination map ·
             Person schema
/contact     WhatsApp-first + enquiry form (event-date field) + hours + Shivalik,
             New Delhi + BeautySalon/LocalBusiness schema
```

Dropped: `/blog` (dead since 2019 — `/blog/*` 301 → `/`). Landing pages
(`/lp/*`) out of scope this launch, LP-lane doctrine applies later.

## 2 · Keywords per page (primary → secondary; qualitative)

| Page | Primary | Secondary |
|---|---|---|
| / | bridal makeup artist delhi | makeup artist delhi NCR · blush lounge sneha · sneha chowdhary makeup artist |
| /portfolio | bridal makeup looks delhi | soft glam bridal makeup · destination wedding makeup looks · SFX makeup artist delhi |
| /services | bridal makeup delhi price/packages (intent) | engagement makeup artist delhi · cocktail party makeup delhi · airbrush vs HD bridal makeup |
| /academy | makeup artist course delhi | professional makeup course online · bridal makeup masterclass · self makeup class delhi · blush school of beauty |
| /about | sneha chowdhary makeup artist | cinema makeup school certified india · MAC bridal makeup artist delhi |
| /contact | bridal makeup artist delhi contact/booking | makeup trial delhi · destination wedding makeup enquiry |

## 3 · Competitor-keyword-to-page map (comp-set §2/§4)

- "best/top bridal makeup artist in delhi (NCR)" — Guneet Virdi title-tag verbatim;
  every comp chases it → **/** (title pattern: "Bridal & SFX Makeup Artist in
  Delhi | Blush Lounge by Sneha Chowdhary") + supported by /portfolio.
- Aggregator/listicle SERP field ("top 10 MUA delhi") → not chased on-page;
  countered with Person/LocalBusiness schema + press-name entity signals on
  **/about** (AEO: the entity answer, not the listicle).
- Academy terms (Chandni Singh academy, Meenakshi Dutt academy own this field)
  → **/academy** with Course schema — Sneha's differentiators: LA certification
  + online delivery (her ONLINE CLASSES highlight).
- Destination terms (no Delhi comp owns "destination wedding makeup artist
  india" cleanly) → **/portfolio** destination category + /about destination
  map. This is the attack lane; Bali/Budapest/London/Bodrum/HK/Cannes work is
  evidence we hold.
- Technical gap: comps are JS-broken/slow (parulgarg.com NXDOMAIN,
  chandnisingh.com empty-without-JS) → clean SSR/SSG, schema-complete,
  Lighthouse ≥90/100 is itself the SEO play.

## 4 · Integrations plan (the one approval that covers them all)

**CTA + events (all via `data-cta`, GA4):**
- `whatsapp_click` — every WhatsApp CTA (wa.me/918826921110, prefilled text
  per page: "Hi Sneha, enquiring for <service> on <date>")
- `enquiry_submit` — contact + academy forms (packages/forms; consent checkbox
  + privacy link, factory standard)
- `call_click` · `email_click` — contact page
- `ig_profile_click` — portfolio IG strip + footer
- `academy_enquiry` — /academy CTA (separate funnel from bridal)
- `portfolio_filter` — category filter engagement (soft signal)

**Booking model:** premium-bridal pattern (comp-set §3) — enquiry form with
event-date field + WhatsApp; NO instant-calendar tool this launch.

**Chat bubble — D-05 FLAG, decision needed, not assumed:** the standing interim
rule deploys the Priya/Chatbase bot on ALL sites (DECISIONS.md 13–14 Jul). On a
personal beauty brand, a Kairali clinical-register Ayurveda bot answering bridal
enquiries is off-brand and off-register in both directions.
**Recommendation: personal-brand EXEMPTION — no Chatbase on theblushlounge.com;
the WhatsApp deep-link (her own number) IS the chat surface**, placed per the
binding mobile law (docs/design/chat-bubble-placement.md: bottom-right, 48–56px,
single-slot sticky bar). If the owner rules the bubble stays, it must be a
Blush-branded bot, not Priya. **Owner ruling requested with this gate.**

**Analytics:** GA4 via GTM. Old site carries container **GTM-MFXP2LH** —
ownership/access unverified. FLAG: confirm we control it; else new container.
Consent banner: factory standard (consent yields to banner, D 14-Jul rule).

**Schema:** Person (sitewide, @about) · BeautySalon/LocalBusiness (contact) ·
Course (academy) · ImageGallery (portfolio). OG/Twitter cards on every page
(the old site had none).

**Instagram:** static strip of interim images linking to the profile —
deliberately NOT a live embed (no third-party JS dependency, no login-surface
scraping at runtime).

**Redirects (in-site config at launch; DNS/Cloudflare = human):**
`/about.php→/about` · `/contact.php→/contact` · `/gallery.php→/portfolio` ·
`/bridal-makeup.php→/services#bridal` · `/creative-makeup.php→/services#editorial-sfx` ·
`/fashion-makeup.php→/services#party` · `/grooming-session.php→/services#grooming-men` ·
`/services.php→/services` · `/blog/*→/` · snehachowdhary.com/* → / (domain-level,
at flip only, D1 rule 8).

## 5 · Open items riding this gate (answers change nothing structural)

1. D-05 exemption ruling (above).
2. GTM-MFXP2LH ownership.
3. Email + hours confirmation (BRIEF locked-facts table).
4. Testimonial reuse permission.
5. NDFF ratification by owner/Sneha (§6 declared-inference block; added
   2026-07-18 22:27:58 IST with the battery-fix amendment).

## 6 · GO-science declarations — MCB · MoA · NDFF · SBJ stage

> Added 2026-07-18 22:27:58 IST per the owner's full-site-build directive
> (D-20260718-23 paste-prompt, ~22:10 IST): lifts the build-time self-check's
> declarations (go-science/2026-07-18-selfcheck.md) into the strategy stack,
> closing the golden-gate-battery pass-1 findings **GS-MCB-6** (no signature
> MCB declared), **GS-MOA-1 note** (avatar block not duplicated here),
> **GS-MOA-3** (NDFF source undeclared) and **GS-VIS-3 / ambiguity A4** (no
> SBJ stage declared) — launches/theblushlounge.com/go-science/2026-07-18.md.
> Declarative only: nothing structural in §§1–4 changes.

### Signature MCB — the anchor secret desire (GS-MCB-6)

- **Anchor secret desire:** being the most beautiful version of **HERSELF** on
  the day — still unmistakably her, surviving tears, embraces and a few
  hundred photographs. Not the surface need "book a makeup artist".
- **Signature MCB (mechanism form):** *soft glamour that is still you —
  without heaviness, masks, or a look that fades mid-event.* On-page voice:
  "Soft glamour, precise drama." (her own caption language) + big-promise
  support "luminous skin · sculpted structure · lasts from the first
  photograph to the last dance" + small non-pressuring CTA (one WhatsApp
  message to her verified number).
- Every page of the full build stays anchored to THIS desire; per-page hooks
  evolve but never re-anchor (ay-science-knowledge.md: "It evolves but stays
  anchored to the same secret desire").

### MoA avatar (duplicated verbatim from BRIEF §Who-it-is-for — GS-MOA-1)

1. **Brides + brides-to-be** (Delhi NCR first, destination-wedding India/abroad
   second) researching artists between IG and Google — the paying core.
2. **Party/occasion clients** (cocktail, engagement, events).
3. **Aspiring artists** evaluating her courses/masterclasses (school funnel) —
   fenced to /academy and the labelled academy teaser; never courted in the
   bridal lane.

### NDFF + declared source (GS-MOA-3)

- **Needs:** an artist who shows up, holds up, photographs true.
- **Desires:** luminous, editorial, "unmistakably me".
- **Fears/frustrations:** cakey/heavy makeup, a look that fades mid-event,
  not looking like herself.
- **SOURCE (declared, never invented):** INFERRED by the builder from (a) the
  artist's own mined caption corpus, content-mined/theblushlounge.com/
  instagram-2026-07-18/profile-capture.md ("soft glamour with just the right
  amount of drama", "softness takes just as much precision as drama"), and
  (b) niche competitor research docs/blushlounge-inputs/comp-set.md. **No MoA
  (bride) interviews and no owner-supplied NDFF research exist for this site
  yet.** Per Akshar's law NDFF may not be guessed: this inference is declared
  as inference, and **owner/Sneha ratification (or the real research source)
  is a riding open item — §5 gains item 5.** Until ratified, page copy leans
  only on the caption-grounded claims above.

### SBJ / awareness stage (GS-VIS-3, ambiguity A4)

- **Homepage (golden page): Stage 1→2 — CMA → Strong Foundation.** The
  IG/Google stranger arrives, meets curiosity + trust, raises her hand on
  WhatsApp. Target emotions: desire (imagery), trust (press marks), warmth
  (her voice). No price anywhere (4-Phase law + HARD GATE 6: no trusted price
  source exists).
- Full-build stage map: /portfolio + /about = Stage 2 (proof/foundation);
  /services + /academy = Stage 2→3 (consideration, price-on-enquiry);
  /contact = Stage 3 (hand-raise capture). The real 4-Phase selling happens
  in the WhatsApp thread, off-page, by design.

### Homepage must-answer mapping (beauty B2, closest-chapter analogue)

- *Who/where/what* → hero eyebrow ("Delhi · Worldwide — Beauty, Bridal & SFX").
- *Personal involvement / how bookings work* → services lede + /services
  booking-mechanics section (full build) — anchored, never mysterious.
- *Inclusions/experiences* → services teaser bullets → /services anchors.
- *Policies & access* → /contact (hours/address land there once confirmed —
  BRIEF locked-facts flags stand).

---
**STOP.** reply `APPROVE strategy` or `CHANGES <notes>`.
