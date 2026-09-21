# T1 EXPLAIN — FETCH-PROMPT-8-EXPLAINER-ROUTES.md handed to Claude Design (owner: "give this to
claude design when you get the chance")

Session 2026-09-22 06:45–07:35 IST. Message 1: open `uploads/FETCH-PROMPT-8-EXPLAINER-ROUTES.md`
and carry it out with `uploads/knowledge-explainer-8-routes.json`. It stopped rather than guess:
the JSON was never in the project (the file picker cannot be driven from this session) and a live
fetch cannot recover image dims/alt/inline HTML. Message 2: the repo's verbatim
`sites/ayurvedichealingvillage.com/english-candidate/knowledge-explainer-8-routes.json` pasted as
three chunks (a single paste truncated at 929/1,166 lines; routes 1-3 / 4-6 / 7-8, 603+341+245
lines, same top-level metadata + a chunk field). One "Connection interrupted" mid-write; it
recovered by itself, no retry clicked.

## Claude Design's closing comment (verbatim)

> Produced two files:
>
> uploads/knowledge-explainer-8-routes.json — all 8 routes in the fetch prompt's schema (meta · h1
> · breadcrumbVisible · blocks in source order · links · images · counts · discrepancy), built
> entirely from your three chunks. No fetching, no paraphrase. Entities (&#8211;, &#8217;, &amp;,
> &nbsp;) left exactly as the record has them; resturant untouched.
>
> notes/knowledge-explainer-8-routes-dataset.md — the sidecar: counts table, checks run, 11 open
> items, deviations.
>
> My checks: JSON parses; per route the heading/list/image counts reconcile with the blocks array;
> images de-duplicated; every figure and card src present in images[]; all hrefs absolute. Against
> your expected-counts table, body words land within a few words of table − ~440 on all 8; h3
> matches 8/8, h2 6/8. listItems and images are short on every route — recorded as discrepancy,
> content not adjusted.
>
> Three things that need you:
>
> The in-main sidebar ruling is still open and it's what causes every count shortfall. Kept as
> body blocks for now, per the record.
> 11 meta fields are [TO CONFIRM] on all 8 routes (og image dims, ogType/Locale, twitterCard,
> readingTime, modified, hreflang) — the record doesn't carry them. One head-only pass over the 8
> URLs fixes it; until then no route is done-bar clear on the SEO head contract.
> Two route-identity defects: the sidebar links to
> /why-pick-an-ayurveda-treatment-orayurvedic-retreat/ (missing hyphen) and to a correctly-spelled
> restaurant slug that isn't the live route.

Its sidecar (`notes/knowledge-explainer-8-routes-dataset.md`) counts table, verbatim:

| route | body words | h2 | h3 | h4 | list items | images | blocks | links |
|---|---|---|---|---|---|---|---|---|
| /why-get-training-in-ayurveda/ | 662 | 3 | 3 | 7 | 40 | 1 | 25 | 23 |
| /new-to-yoga/ | 621 | 3 | 15 | 0 | 18 | 7 | 42 | 29 |
| /what-is-ayurvedic-food/ | 559 | 3 | 5 | 7 | 16 | 1 | 30 | 17 |
| /what-is-panchkarma/ | 329 | 3 | 4 | 0 | 19 | 1 | 15 | 21 |
| /live-to-100-with-panchkarma/ | 300 | 3 | 3 | 0 | 22 | 2 | 15 | 25 |
| /why-pick-an-ayurveda-treatment-or-ayurvedic-retreat/ | 297 | 3 | 3 | 0 | 22 | 2 | 13 | 23 |
| /ayurvedic-resturant-and-cooking-at-healing-village/ | 245 | 3 | 6 | 0 | 9 | 2 | 19 | 17 |
| /ayurveda-retreats-for-everyone/ | 237 | 3 | 5 | 0 | 9 | 2 | 18 | 19 |

Its sidecar's owner items 1–7 (verbatim headings): (1) in-main sidebar ruling — chrome, body, or
separate navigation record; (2) h1 is null on all 8 routes (title rendered as h2 twice) — confirm
live truth; (3) route identity /why-pick-…-orayurvedic-retreat/ (missing hyphen) — link-audit /
redirect decision; (4) route identity restaurant/resturant — same; (5) empty <a> artefacts doubled
in source — drop on port, confirm; (6) hero image reuse: 2023/11/our-story.png is the hero cover on
six of eight routes — per-page banner assignment from the Kairali-Image-Library; (7) og:image ≠
page image on /what-is-panchkarma/ and /live-to-100-with-panchkarma/ (2024/11/panchkarma.webp not
in main). Items 8–11 are in the sidecar file in the project (not downloadable — export failing).

Not downloaded (export failing). No design was built in this session — the prompt produces the
dataset the T1 EXPLAIN template consumes.
