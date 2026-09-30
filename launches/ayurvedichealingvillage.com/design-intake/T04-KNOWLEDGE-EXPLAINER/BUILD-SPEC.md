# T04 Knowledge Explainer — what wiring it actually takes

Written 2026-09-21 after the owner said "yes, wire it". **Nothing has been wired.** This records
what the drop is, what production needs, and the gap between them — because the gap is bigger than
I represented when I proposed the job, and it is cheaper to say so than to half-build it.

## What I got wrong when I proposed this

I described T04 as "10 real routes, the design is already verified, wire it next". Two things in
that were wrong:

1. **The drop contains three route bodies, not ten.** The DC holds `/new-to-ayurveda/` (`isNew`),
   `/learn-about-ayurveda/` (`isLong`) and `/learn-more-about-ayurveda/` (`isShort`) as three
   `<sc-if>` blocks behind a review tab strip. The other seven group-A routes have no body here.
2. **Views on this site are not per-route files you can drop in.** They are shared and
   data-driven.

## The architecture, measured

`ahv-page-article-reader-desktop` serves **131 routes** from ONE view. Its logic is a **dispatcher**
over fourteen render modules:

```
AHV_ARTICLE_RENDER · AHV_TRAVEL_RENDER · AHV_COLLECTION_RENDER · AHV_COMMERCIAL_RENDER
AHV_READER25A_RENDER · AHV_READER25B_RENDER · AHV_READER6C_RENDER · AHV_TRAINING7_RENDER
AHV_STORY_RENDER · AHV_SEVEN_RENDER · AHV_UTILITY7_RENDER · AHV_EXCEPTION5_RENDER
AHV_HIST9_RENDER · AHV_LAKSHYA_RENDER
```

Each sub-family is a `<name>-data.js` + `<name>-render.js` pair; 22 such renderers exist today,
15–18 KB each. The view's template mentions no route and carries no article text — all content
arrives from the dataset at runtime.

So "the article-reader family" is really fourteen sub-families behind one view, and the ten T04
routes are currently served by several of them (`reader25a`, `reader25b`, `utility7`,
`article`, …).

## Therefore wiring T04 means building a family renderer

Not a config change. The work is:

1. **`knowledge-explainer-data.js`** — the ten routes' content in T04's shape. The content exists
   today, but spread across the sub-family datasets that currently serve those routes; it has to be
   lifted into one dataset with the fields T04's markup needs (contents rail, definition lists,
   FAQ, glossary, closing cards, the rail-suppressed case).
2. **`knowledge-explainer-render.js`** — T04's markup and CSS as a renderer over that dataset,
   replacing the three baked `<sc-if>` bodies. The review tab strip and `showDrafts` come out.
3. **Dispatch** — register `AHV_KNOWLEDGE_RENDER` in the shared view's logic and point the ten
   routes at it.
4. **Verify** — the drop's own harness (`notes/knowledge-explainer-family-qa-harness.html`,
   38 assertions) is the contract and must keep passing against the rendered pages, plus the
   252-route sweep and the computed-style benchmark on the owner's pages.

Comparable to the existing renderers in scope: a 15–18 KB module plus its dataset, plus content
lifting for seven routes whose bodies the drop does not show.

## Two gaps that decide the order

**Mobile.** The drop is desktop-only and says so ("Not in scope of this drop: Mobile"). The site is
~80% mobile. If the renderer is built to the desktop shape now and the mobile design arrives later
with a different structure, the renderer is written twice. Building both at once is materially
cheaper than building it twice.

**Seven of ten routes have no designed state.** Their content would be mapped into the template by
inference from the three shown. That is the agent making layout decisions for pages the designer
has not drawn — which MODE A exists to prevent.

## The options

| | approach | what ships | cost |
|---|---|---|---|
| **A** | Wait for the mobile view + the remaining states, then build once | all 10, both viewports, nothing inferred | one build, but blocked on the designer |
| **B** *(recommended)* | Build the renderer + dataset for the **three designed routes** now, desktop only, and hold the cutover until mobile lands | a verified renderer, provably correct on 3 routes | small build now; the other 7 and mobile still to come |
| **C** | Build all 10 desktop now, inferring the 7 unshown bodies | 10 routes desktop, 7 of them agent-designed | largest, and it breaks MODE A |

**Recommendation: A if the mobile view is days away, B if it is weeks.** The thing to avoid is C,
and the thing to avoid second is writing the renderer twice.

## What is true regardless

The drop itself is sound and that is not in question: served over HTTP at 1440 and 390, **0 console
errors, 0 network 404s**, every `<img>` resolving, both chrome logos present (the two the previous
drop dropped), and its own harness at **38 pass / 0 fail**.
