# The Tripadvisor lockup — measured, not assumed

**Handover item 4**, owner ruling 2026-09-21: *"should be a sales type tripadvisor, not vanilla"* →
**embed the official Tripadvisor widget.** He was shown the objection and overrode it. The objection
turned out to be wrong, which is the substance of this note.

## What I told him, and what the measurement said

I put the widget forward as the option that *"sets third-party cookies on load, which is exactly
what your no-consent ruling and HARD GATE 11 sit against, and injects a layout-shifting iframe"*.
Perplexity declined to confirm that from Tripadvisor's documentation and said to inspect the
rendered widget. Inspecting it:

| measured, headless Chromium, widget loaded and left to settle 6s | result |
|---|---|
| iframes injected | **0** |
| cookies set (any domain) | **0** |
| localStorage / sessionStorage keys written | **0** |
| off-origin hosts contacted | 3 — `www.jscache.com`, `www.tripadvisor.com`, `static.tacdn.com` |
| page errors | 0 |

**So the two blockers I raised do not exist.** The sweep gate
(`tools/verify-english-candidate.mjs` counts every `<iframe>` as a problem) is not triggered, and
the no-consent position is not disturbed by a widget that sets no cookies. The owner's call was
right and the caution was mine.

What remains true, and is not a blocker: three off-origin hosts are contacted on load, so the
visitor's IP and User-Agent reach Tripadvisor before any interaction, and `www.jscache.com` is a
third-party script with DOM access on the page. That is the honest residual, stated rather than
implied.

## Which widget, and the live figures it returns

Five widget types were probed against `locationId=530306`. Only one renders the rating lockup he
asked for:

| wtype | renders | iframes | cookies |
|---|---|---|---|
| `cdsratingsonlynarrow` | **bubbles + score + review count + Tripadvisor logo** | 0 | 0 |
| `selfserveprop` | property name + "Read reviews" only — the vanilla thing being replaced | 0 | 0 |
| `cdswritereviewlg` | a "click to rate" prompt, wrong intent for a credential strip | 0 | 0 |
| `cdsscarecrow`, `cdsstarrating` | nothing rendered | 0 | 0 |

`cdsratingsonlynarrow`, read out of the rendered DOM on 2026-09-21:

- rating **4.6 / 5** — `<span class="ui_bubble_rating bubble_46">`
- **453 reviews**
- Tripadvisor logo served from `tripadvisor.com/img/cdsi/...svg`, which is what their partner brand
  guidelines require (serve their asset, do not store a copy locally)
- the widget's own link target: `http://www.tripadvisor.com/Hotel_Review-g1096235-d530306-...`

These are LIVE values the widget fetches on each load. Nothing is hard-coded, so nothing goes
stale — which is the one real advantage the widget has over the badge-and-figure approach.

## The two listing URLs, resolved as far as evidence allows

The repo carries both `g1096235` (7 occurrences, campaign data) and `g26530598` (13 occurrences,
exception-five and utility7 family data), same property id `d530306`. **Tripadvisor's own widget
emits `g1096235`**, which is the best evidence available that it is the canonical one.

Fetching both directly returned **403 to headless Chromium** — Tripadvisor bot-blocks it, so that
test establishes nothing about either URL and is recorded here only so it is not repeated. No URL
was changed: both are verbatim live copy, neither is shown to be broken, and a redirect hop is not
a defect worth touching verbatim SEO text for.

## Build spec

```html
<div id="TA_cdsratingsonlynarrow1" class="TA_cdsratingsonlynarrow">
  <ul id="…" class="TA_links"><li id="…" class="…"></li></ul>
</div>
<script async
  src="https://www.jscache.com/wejs?wtype=cdsratingsonlynarrow&uniq=1&locationId=530306&lang=en_US&border=true&display_version=2"></script>
```

Constraints the handover already sets and this widget must still meet when wired: **≥44px touch
target, AA contrast, no autoplay, no layout shift.** The last one needs re-measuring in place — the
widget injects asynchronously, so its container needs a reserved height or it will shift the
credential strip on a slow connection. Measure CLS on the built page, do not assume it.
