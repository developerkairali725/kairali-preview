# /faqs-downloads/ — page notes

Files: `AHV Page FAQs and Downloads Desktop.dc.html` (1440) · `AHV Page FAQs and Downloads Mobile.dc.html` (390)
Source: `data/family-04/faq-grouped-exact-bindings.json` (sourceSha256 c9f79efc…41d71), extracted to `data/faq-page-content.json`.
Content: 44 questions across 12 topic groups, answers verbatim (p / ul / li / strong / em / br preserved).

## Head contract (verbatim from record)
- title: Ayurvedic FAQs & Hormonal Balance at Kairali Retreat
- description: Get answers about Ayurveda, women’s hormonal balance, stay info & treatments at Kairali Healing Village. A complete guide to your wellness journey.
- canonical: https://ayurvedichealingvillage.com/faqs-downloads/
- robots: index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1
- OG type article, modifiedTime 2026-04-02T10:35:51+00:00
- FAQPage schema should be re-emitted from the same 44 pairs (source carries it).

## Breadcrumb
Rendered Home › FAQs & Downloads (sitemap-final navLabel). The bindings file carries a candidate label
"Plan Your Visit & FAQs" marked PENDING acceptance — switch if that candidate is approved.

## Register-violation flags (brand §12.2) — all inside verbatim source copy, none introduced by me
- Intro standfirst: "wellness journey", "guest relations team".
- Closing paragraph: "your journey to holistic wellness", "experience".
- Group "For International Guests" (group heading, source).
- Q "What makes Kairali different from other Ayurvedic retreat?" and 6 sibling questions in
  "Why Choose Kairali?" use retreat / luxury wellness retreat / wellness retreats throughout.
- Several answers use "retreats", "guests", "spa"-adjacent phrasing. Nothing rewritten — SEO hold.
- "World Luxury Award Winner" in the fixed closing block is a proper noun, retained by instruction.

## Drafted content (marked in page)
- Hero aside copy ("Still unanswered… patient care team…") — DRAFT, new to the hero pattern.
- Downloads shelf intro line + three document slots — DRAFT structure.
- Empty-filter-state sentence.

## Gaps / [TO CONFIRM]
- **No downloadable files exist in the source record.** The bindings file states explicitly: no source
  download file found; do not invent downloads from the page title. The shelf is built as three real
  slots with [TO CONFIRM] title, file type, size and date. Needs the hospital to supply actual PDFs.
- Only one outbound link in source body (whyayurveda.org, inside "Are Ayurvedic doctors real doctors?"),
  preserved.

## Images
`assets/img/faq/faqs-downloads-hero.png` — self-hosted from source gallery-1.png (1440×459, sha ed49c6df…),
used as the hero band on both views. `assets/img/faq/faq-hero-lotus.svg` unused here.

## Interaction
Client-side filter over question + answer text: hides non-matching items, hides emptied groups, auto-opens
matches, dims rail/chips for emptied groups, live-region status line, Clear button. No animation, no
autoplay, reduced-motion honoured. Accordions are native details/summary (keyboard + screen-reader safe),
all closed on load.

## Codex asks
1. Supply or confirm the PDF set for the downloads shelf (filenames, titles, sizes, dates) or delete the
   section and retitle the route.
2. Re-emit FAQPage JSON-LD from the 44 pairs; verify against source schema block.
3. QA widths 360 / 390 / 768 / 1024 / 1440 / 1920.
4. Confirm breadcrumb label decision above.

## Done-bar
- SEO head contract captured above (not yet emitted into the page — Next.js head layer).
- Link audit: 1 source body link preserved; all other links are governed CTAs (wa.me, online-consultation,
  enquiry-form, mailto info@kairali.com).
- WCAG 2.2 AA: body 17–17.5px / 1.75, targets ≥44px, buttons 52px, no hover-only disclosure.
- Register flags listed above.
