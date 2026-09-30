# T04 Knowledge / explainer family — mobile template (390)

File: `AHV Template Knowledge Explainer Mobile.dc.html`
Data: `assets/knowledge-explainer-8-data.js` — generated verbatim from `uploads/knowledge-explainer-8-routes.json`
(record 2026-09-21T12:42:39.060Z). Regenerate, never hand-edit. No copy was added, altered or removed.
Status: MOBILE DRAFT — awaiting owner approval. Desktop file untouched.

## Why it is a separate layout, not a squeeze
- Desktop's 230px sticky "On this page" rail cannot exist at 390. Replaced by an always-open jump card
  directly under the hero, shown only when the route has 3–10 top-level body headings (fires on
  why-get-training 7, new-to-yoga 10, what-is-ayurvedic-food 7; suppressed on the five short routes,
  where a jump list would be longer than the article).
- Desktop's 120px left-breakout figures become full-bleed 390 bands (negative 20px gutters).
- Desktop's `<dl>` 20ch term column collapses; these 8 routes carry `ol` term:description items instead,
  rendered as hairline rows with a bronze Marcellus numeral in a 30px column.
- link-cards (6 on /new-to-yoga/) stack full-width, 170px image band + 21px Marcellus caption.
- The closing consultation band stacks: two 52px full-width buttons instead of the desktop inline pair.
- Heading levels are derived, not fixed: the highest heading level present in the body renders as the H2
  style (Marcellus 26px on a hairline), the next level down as the bronze uppercase H3. Five of the eight
  routes have only `h4` body headings, so on those the h4s carry the H2 treatment — no level is skipped.

## Navigation — the recorded ruling, applied
Per `notes/knowledge-explainer-8-routes-dataset.md` § In-main navigation (owner ruling, 22 Sep 2026):
1. The injected in-main nav is out of the article flow on all 8 routes.
2. One consistent **"More in the Knowledge Center"** block sits after the article on all 8 — five groups,
   live labels, no accordion, 52px rows, always open.
3. Current page renders as `aria-current="page"` with a bronze left rule, not a link.
4. Sequential prev / next within the eight sits between the article and the block.
5. The live injected list is retained verbatim below, under its own live heading, only where it is **not**
   the Knowledge Center list (i.e. the three "Things To Do" tourism routes and the corporate list on
   /what-is-panchkarma/). On the four routes whose injected block already *is* the Knowledge Center list,
   it is not repeated.
Slug ruling applied to every emitted href: cuisine → `/ayurvedic-restaurant-cooking-at-healing-village/`;
why-pick → hyphenated canonical.

## Mobile strain note
**One line:** the layout takes the strain on `/why-get-training-in-ayurveda/` and `/new-to-yoga/` — 662 and
621 words of unbroken h4/h3-and-paragraph rhythm plus 22 retained tourism links (training) and six stacked
link-cards (yoga) make those two pages roughly 9 and 11 screens long at 390, which the jump card mitigates
but does not remove; every other route fits inside four screens.

## Checks run (my own, in-project)
- 8/8 routes render: 1 `h1`, no heading-level skips, body block counts match the record exactly
  (15 / 28 / 16 / 3 / 5 / 3 / 5 / 4).
- No horizontal overflow at 390 **or** 360 on any route: every descendant measured against the column box,
  `scrollWidth == clientWidth` on both widths.
- Tap targets: zero block-level control under 44px (breadcrumb, jump rows 48px, KC rows 52px, prev/next
  tiles, CTAs 52px, route select 48px). The only sub-44px anchors are the five inline links inside sentences
  (WCAG 2.2 AA target-size inline exception).
- Copy fidelity: all 10 body paragraphs of /new-to-yoga/ compare byte-equal to the record after entity
  decoding; zero raw entities (`&amp;` `&#8217;` …) leak into rendered text on any route.
- Retained live nav renders in full on the four routes that carry a non-Knowledge-Center list:
  22 links (why-get-training, live-to-100, why-pick) and 19 (what-is-panchkarma, the corporate list),
  each under its live group heading, in live order.
- All five inline `<a>` links in the record are ported live (what-is-panchkarma 1, live-to-100 2,
  retreats-for-everyone 2), with their record hrefs.
- No `<img>` tags anywhere: hero, body figures and card images are sand placeholders labelled with the live
  upload path. Nothing is hotlinked.

## Deviations / decisions needing owner sign-off
1. **Standfirst = live meta description**, decoded, per route. Hero C requires a standfirst; the record has
   none and I did not draft eight. Marked in-page with a dashed badge. Approve, or supply drafted lines.
2. **Bold lead-ins are not rendered.** Seven paragraphs carry `<strong>` runs in `inline`; the plain `text`
   field is rendered instead, so the words are verbatim but the emphasis is lost. Inline `<a>` links *are*
   preserved. Confirm the emphasis loss is acceptable or ask for `inline` HTML rendering.
3. **/what-is-panchkarma/ has no current-page marker** in the Knowledge Center block — that route is not
   itself a link in the live Knowledge Center nav ("What is Panchkarma?" is a *group heading* there).
   Left as live truth rather than inventing an entry.
4. Breadcrumb Home / Knowledge Centre / page is **provisional** (URL hierarchy) pending
   `sitemap/sitemap-final.json`.
5. Chrome is a labelled placeholder band top and bottom — frozen mobile chrome is bound at page level,
   not in the template (standing rule 5).

## Codex asks (open)
- Self-host every image these 8 routes use: 6 hero covers (five of them the generic `2023/11/our-story.png`),
  `2024/10/Yoga-Retreats-Banner-min.jpg`, 4 body figures, 6 yoga link-card images. Per-page og:image
  assignment (task E in the dataset sidecar) is still outstanding.
- Alt text for the empty-alt figures (`learnmore-about-yoga-1`, `ayurveda-stress-management-therapy-1024x299`,
  `cooking`, `Ayurvedic-Training-aboutus-min-1`) — decorative-or-not per image.
- Link audit of the emitted hrefs vs the record, including the two ruled slug changes and the redirect map
  `sitemap/redirects-knowledge-explainers.json`.
- Width QA 320–430 by Codex (in-project checks at 360/390 are recorded above).

## Done-bar
- [x] SEO head contract — captured per route in the dataset sidecar (all 8 verified against live 22 Sep)
- [ ] Link audit vs frozen record — Codex
- [x] WCAG 2.2 AA: body 18px/1.7, single h1, no level skips, ≥44px targets, no hover-only disclosure,
      no motion, focus ring on every control, no carousel
- [x] Register-violation flags — unchanged from the desktop family list (verbatim live copy: "retreat",
      "wellness journey", "transformative", "best location", "luxury"); no new copy introduced by this view
- [ ] Owner approval of the five deviations above
