# PART 1 — AGENTS.md

## Project identity

Personal **entity-hub** website for **Abhilash Kalathil Ramesh** — Executive Director of Kairali Ayurvedic Group, founding board member of AYUSHEXCIL, angel investor. Its job is to be the canonical, machine-readable answer to "Who is Abhilash Kalathil Ramesh?" for Google Search/AI Mode, ChatGPT, Claude, Gemini, Perplexity, Copilot — and to read as ultra-premium to humans: press, conference organisers, policy circles, B2B wellness partners, founders seeking backing.

This is a digital identity platform, not a portfolio. Every element reinforces one consistent entity and its relationships. When a choice trades visitor-impressiveness against entity-clarity, pick clarity — but the Night Ledger design means you rarely have to choose.

Positioning hierarchy (never dilute into a title list):
- **Primary entity:** Executive Director, Kairali Ayurvedic Group — fourth-generation custodian of a family Ayurveda lineage dating to 1908.
- **Facets:** AYUSHEXCIL founding board member (policy) · angel investor (wellness, biotech, clean formulations, regenerative hospitality) · operator building AI-era systems inside a legacy enterprise.

## Naming rules (non-negotiable)

- Schema/entity name: **Abhilash Kalathil Ramesh**. Brand mark (nav, footer, OG template): **ABHILASH K. RAMESH**.
- Copy rule: full name on first mention per page and in all bios; "Abhilash K. Ramesh" thereafter.
- `alternateName` in schema only: "Abhilash K. Ramesh", "Abhilash Ramesh", "Abilash Ramesh", "Abilash K. Ramesh".
- One canonical URL per external property. WhyAyurveda is **whyayurveda.org** everywhere (the old site mixed .com/.org — never repeat that).

## Language register rules (regulatory — hard constraints on every word of copy, metadata, alt text, schema)

1. **KTAHV — Kairali · The Ayurvedic Healing Village** (Palakkad, Kerala): clinical register only — *NABH-accredited Ayurvedic hospital, patients, physicians, treatment, therapy, programme, admission*. **Banned in KTAHV context:** spa, resort, retreat, holiday, vacation, getaway, guest, pampering, luxury escape. No cure claims; use "treatment of / management of / programmes for".
2. **KAC — Kairali Ayurvedic Centres** (day spas & clinics): spa/clinic register is correct *here and only here*.
3. **KAPPL** — product/manufacturing register: Ayurvedic pharmaceutical & personal-care products, WHO-GMP-certified manufacturing.
4. **Villa Raag** (Agonda, South Goa): boutique wellness hospitality — guests, stays. Never clinical.
5. **Canonical group description — use verbatim wherever the group is summarised:**
   > Kairali Ayurvedic Group spans an NABH-accredited Ayurvedic hospital (Kairali – The Ayurvedic Healing Village, Palakkad), WHO-GMP-certified Ayurvedic pharmaceutical manufacturing (KAPPL), a network of Ayurvedic day-spa and clinic centres (KAC), and boutique wellness hospitality (Villa Raag, Goa).
6. The old site's phrases "luxury spa resorts" and "flagship retreats" are **specifically prohibited**. Ambiguous sentence → rewrite; unsure → flag `<!-- REGISTER-CHECK -->`.

## Anti-fabrication rules

- Facts come only from the Content Seed Data in the mission, or get `TODO-VERIFY` comments + placeholder styling. Never invent awards, press, testimonials, statistics, dates, portfolio companies, or quotes.
- Essays ship as skeletons marked `DRAFT — do not publish`; anything clinical also gets `CLINICAL-REVIEW: Dr. Deepu John`.
- Photography: real, owned images only (headshots exist; Kairali imagery rights held). No stock, no AI-generated imagery. Styled placeholders with exact dimensions + descriptive TODO filenames.

## Design system — "Night Ledger" (ultra-premium, sleek, dark-first)

Concept: gold zari on dark silk × an operator's ledger. Heritage surface, systems underneath. Not a spa palette, not a startup gradient, no glassmorphism, no purple.

**Tokens (Tailwind v4 `@theme`, OKLCH; hex for reference):**
- `--ground` #0E1712 deep green-black (default/dark) · `--ground-raised` #142019 (cards, palette)
- `--ink` #EDEADF kasavu ivory · `--ink-muted` #9BA69B
- `--zari` #C2A14D muted gold — hairlines, active states, key accents only; never large fills; darken to #8A6E2F as text on light
- `--leaf` #7FA98C (links/tags on dark) · #2E5641 (on light)
- Light "Kasavu" theme (secondary): ground #F5F4EC, ink #16241C, mist rules #E6E4D8
- Optional grain: ≤3% opacity tiled noise on `--ground` only; <5KB, zero CLS.

**Type (self-hosted via `next/font` — no runtime font CDN; GDPR-clean):**
- Display: **Instrument Serif** (regular + italic only — the constraint enforces restraint). Large optical sizes, tracking -0.01 to -0.02em, italic for standfirsts/pull-quotes.
- Body/UI: **Instrument Sans**. Prose measure ~68ch, line-height 1.65.
- Ledger/utility: **IBM Plex Mono** — eyebrows, dates, fact rows, nav, metadata. The mono layer encodes the operator identity; anything that is *data* is mono.

**Signature devices (spend all boldness here; everything else quiet):**
1. **The zari rule** — a 1px double hairline in gold framing the page top and separating major sections (the kasavu border). Also the link-hover underline. The only decorative device on the site.
2. **Ledger fact rows** — semantic `<dl>`, mono, dot-leader fill, right-aligned values:
   `ROLE ······· Executive Director, Kairali Ayurvedic Group`
   `LINEAGE ···· Fourth generation · since 1908`
   Used in hero, entity cards, timeline, footer colophon. (These `<dl>` rows double as machine-readable fact tables — see LLM layer.)
3. **⌘K command palette** (shadcn `command`): navigate, switch theme, copy each bio length, copy email, open socials, jump to essays. Mono hint in header. The premium-operator interaction.

## Premium execution rules: hairline borders instead of drop shadows; no default shadcn card shadows; 8pt spacing grid, generous whitespace; motion 180–240ms `cubic-bezier(0.22,1,0.36,1)` — one orchestrated hero reveal (staggered ledger rows + hairline draw-in), hover micro-interactions elsewhere, all gated by `prefers-reduced-motion`; custom `::selection` (zari on dark); mobile-first, verify at 390px. **Do not use** numbered section markers ("01 //"), stacked one-word noun lines, gradient text, emoji, or visible "optimization furniture" (see the exclusions list in Part 2) — these are the template/SEO-artifact tells the rebuild must shed.

## Code standards

- Next.js latest stable (App Router) + TypeScript strict + Tailwind v4 (`@theme`, OKLCH) + shadcn/ui via current CLI (Base UI flavour for new projects) + React 19 (no `forwardRef`, `data-slot` styling).
- shadcn components: only what's used — expect `button`, `card`, `badge`, `separator`, `sheet` (mobile nav), `accordion` (FAQ), `command` (palette), `tooltip`. No component dumping.
- **Static-first hard requirement:** every route SSG; all content present in raw HTML (most AI crawlers don't execute JS). `"use client"` allowed only in: theme toggle, mobile nav sheet, command palette, reading-progress bar, copy buttons. Nothing content-bearing.
- Content as MDX in `/content` with typed frontmatter (title, description, datePublished, dateModified, tags, draft, reviewedBy, readingTime auto-computed).
- Structure: `app/` routes · `components/ui|site` · `content/essays/*.mdx` · `lib/schema/` (typed entity factories — see Phase 3) · `lib/seo.ts` · `public/images/`.
- Clean, stable, lowercase URLs; no dates in slugs; descriptive image filenames + alt text.
- No analytics in build; leave a marked slot for Plausible/Umami (privacy-first, no cookie banner). No external UI kits, no animation libraries (CSS only), Lucide icons sparingly.
