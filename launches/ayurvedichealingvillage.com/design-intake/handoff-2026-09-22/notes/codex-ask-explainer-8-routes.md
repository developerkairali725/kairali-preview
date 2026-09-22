# Codex ask — Knowledge/Explainer 8 routes

Paste below the line into Codex. Everything here is mechanical verification against the live source; none of it needs a design decision. Deliver as `drops/<slug>/` folders per the standard drop contract where noted, and one JSON for task A.

Routes (URLs exactly as shown — `resturant` is the live spelling, do not correct):

```
https://ayurvedichealingvillage.com/why-get-training-in-ayurveda/
https://ayurvedichealingvillage.com/new-to-yoga/
https://ayurvedichealingvillage.com/what-is-ayurvedic-food/
https://ayurvedichealingvillage.com/what-is-panchkarma/
https://ayurvedichealingvillage.com/live-to-100-with-panchkarma/
https://ayurvedichealingvillage.com/why-pick-an-ayurveda-treatment-or-ayurvedic-retreat/
https://ayurvedichealingvillage.com/ayurvedic-resturant-and-cooking-at-healing-village/
https://ayurveda-retreats-for-everyone → https://ayurvedichealingvillage.com/ayurveda-retreats-for-everyone/
```

Current dataset to reconcile against: `uploads/knowledge-explainer-8-routes.json` (8 routes, prompt schema, built from the 21 Sep verbatim record).

---

## A · Head contract completion (BLOCKING — 11 fields × 8 routes)

Head-only pass over the 8 live URLs. Return `head-contract-8-explainer.json` keyed by route path, each with these fields verbatim (null where genuinely absent, never invented):

```
ogImageWidth, ogImageHeight, ogType, ogLocale, ogLocaleAlternate[],
twitterCard, readingTime (twitter:data1), modified (article:modified_time),
hreflang { en, de, fr }
```

Also re-confirm, per route, the values the record already gave so we can diff them: `title`, `description`, `canonical`, `robots`, `ogTitle`, `ogDescription`, `ogImage`. Flag any field where live now differs from the 21 Sep record.

Note: the record ships `robots: null` on all 8. Confirm there is genuinely no `meta robots` tag (vs. the extractor having dropped it) — a missing `index, follow` line changes the indexation plan.

## B · Container adjudication (BLOCKING — resolves every count shortfall)

The "Things To Do" / "Knowledge Center" accordion sits inside `<main id="wp--skip-link--target">` on all 8 routes. Our body-only counts therefore fall short of the expected-counts table on `listItems` (every route) and `h2` (last two routes).

For each route report:
1. the DOM path from `<main>` to the accordion, and whether it is inside or outside the `entry-content` wrapper;
2. `h2 / h3 / listItems / images` counted **twice** — once for all of `<main>`, once for `<main>` minus the accordion column;
3. which of the two reproduces the expected-counts table (words 1099 / 1060 / 997 / 768 / 737 / 730 / 698 / 696, h2 3/3/3/3/3/3/4/4, listItems 44/28/20/23/26/26/18/18, images 9/15/9/9/10/10/10/10).

If neither reproduces it, say so — the table may be stale and the live page wins.

## C · `h1` verification (BLOCKING for the SEO head contract)

All 8 routes ship `h1: null` in the record; the page title appears to render as `<h2>` twice (hero cover + content column). Confirm against live server HTML whether these pages truly have **no** `<h1>` anywhere in `<main>`, or whether the extractor dropped it. Report the actual heading outline per route.

## D · Route-identity / link audit (BLOCKING — two defects found)

1. The Knowledge Center sidebar on the explainer routes links to `/why-pick-an-ayurveda-treatment-orayurvedic-retreat/` (no hyphen before "ayurvedic"), while the canonical route is `/why-pick-an-ayurveda-treatment-or-ayurvedic-retreat/`. Report live HTTP status of **both** URLs, their canonicals, and whether they are two pages or one plus a redirect.
2. The sidebar carries an empty anchor to `/ayurvedic-restaurant-cooking-at-healing-village/` (correctly spelled) while the live page is `/ayurvedic-resturant-and-cooking-at-healing-village/`. Same report.
3. Confirm live HTTP status + canonical for every distinct href in each route's `links[]` array in the dataset (~35 unique targets across the 8). Flag 404s, redirect chains, and cross-locale leaks.
4. Confirm the doubled-anchor pattern (empty `<a>` immediately followed by the labelled `<a>` to the same URL) is present in live source and not a record artefact.

## E · Image assets — download and self-host

Moving WP → Next.js: nothing may be hotlinked. Download and self-host into `assets/img/explainer/` these distinct files, keeping the originals (not the WordPress derivatives) where a larger original exists:

| file | used on | note |
|---|---|---|
| `2023/11/our-story.png` (1440×524) | hero cover on 6 of 8 routes | already local at `assets/img/article/our-story.png` — confirm byte-identical |
| `2024/10/Yoga-Retreats-Banner-min.jpg` (1440×459) | /new-to-yoga/ hero | |
| `2024/10/De-addiction-About-us.jpg` (580×386) | /new-to-yoga/ card 1 | |
| `2023/07/fusionyogaforstressed.jpg` (1000×562) | card 2 | |
| `2023/07/internationalyogafestival.jpg` (1000×562) | card 3 | |
| `2023/07/yogateacher.jpg` (1000×562) | card 4 | |
| `2023/07/yogateacherteachinghisstudent.jpg` (1000×562) | card 5 | |
| `2023/07/yoga-retreat-centre.jpg` (1000×562) | card 6 | |
| `2024/10/learnmore-about-yoga-1.jpg` (500×380) | /live-to-100-with-panchkarma/ figure | filename/content mismatch |
| `2024/10/ayurveda-stress-management-therapy.jpg` (1200w original) | /why-pick.../ figure | page uses the 1024×299 derivative — fetch the original too |
| `2024/10/cooking.jpg` (400×420) | /ayurvedic-resturant.../ figure | |
| `2024/11/Ayurvedic-Training-aboutus-min-1.png` (580×386) | /ayurveda-retreats-for-everyone/ figure | upscaled to 631px on live — flag as low-res |
| `2024/11/panchkarma.webp` | og:image on 2 routes, appears nowhere in main | fetch for reference |

For each: **re-measure the actual file dimensions** and report where they differ from the `<img>` width/height attributes (our dataset currently trusts the attributes). Report file size and format, and flag anything under 800px wide that we plan to use in the Hero C full-width image band.

## F · Screenshots + QA (per drop contract)

Desktop / tablet / mobile screenshots of all 8 live routes into `drops/<slug>/`, so the ported pages can be diffed against live. Then, once the Desktop pages exist, QA each at 1280 / 1440 / 1920 and at 200% browser zoom, plus the 45+/55+ accessibility bar: body ≥17px, line-height ≥1.6, AA contrast, ≥44px targets, no hover-only disclosure.

## G · Accordion behaviour

The sidebar is an Essential Blocks accordion (`data-accordion-type="accordion"`, `fas fa-plus` / `fa-minus`, 500ms). Report whether panels are collapsed or expanded on first paint in live server HTML, and whether the content is present in the DOM when collapsed (it matters for both SEO and the no-hover-only-disclosure rule).

---

Do not change any copy. Do not fix `resturant`, "Halth", "give/gives", or any other live typo. Report, don't repair.
