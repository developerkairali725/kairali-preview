---
report_id: RPT-20260919-AHV-SWEEP-BASELINE
date: "2026-09-19 16:57:09 IST"
task: "Re-run the 252-route sweep against a fresh baseline and account for the difference"
project: "AHV English staging rebuild (codex/ahv-english-staging-20260915, PR #309)"
source_tool: "claude-code (single-writer session)"
type: audit
supersedes: null
title: The sweep is not green, and the reason was four days old
status: complete
topic: qa
site: ayurvedichealingvillage.com
---

# The sweep is not green, and the reason was four days old

Written 2026-09-19 IST, at the end of the image-alt work. The sweep was meant to be the last green
tick before handing the branch back. It is not green, and what it found is worth more than a tick.

## 1. The result

**426 of 504 states pass.** 252 routes × 320px and 1024px, against the accepted baseline.

The 78 failures split cleanly into two piles, and only one of them is a defect:

| | states | routes | verdict |
|---|---:|---:|---|
| horizontal overflow at 1024px | 34 | 34 | **REAL DEFECT** |
| title / h1 / canonical / view ≠ baseline | 44 | 23 | **baseline is stale, the site is right** |

An earlier run of the same sweep reported 369/504 with 65 states 404ing across 33 routes. Those 404s
were entirely an artefact of my own restarting the server underneath the sweep: the 33 routes formed a
contiguous alphabetical block, they returned 200 to a plain request immediately afterwards, and the
re-run on a warm server shows **zero 404s**. That first number is discarded, not explained away.

## 2. The real defect: 34 routes scroll sideways at 1024px

Reproduced outside the sweep, at both 1024 and 1280:

```
/packages/    @320: scrollWidth=320  inner=320  ok
/packages/    @768: scrollWidth=768  inner=768  ok
/packages/   @1024: scrollWidth=1359 inner=1024 OVERFLOW
/packages/   @1280: scrollWidth=1695 inner=1280 OVERFLOW
/things-to-do/ @1024: scrollWidth=1359 inner=1024 OVERFLOW
```

Clean at phone widths, broken from 1024 up. Mobile-usability tooling would never have caught it,
because mobile is the half that works.

The visible symptom is an image whose right edge lands past the viewport — one carries
`width:1024px; max-width:1024px; margin-left:-365.906px` inside a parent only 292px wide, which is a
full-bleed treatment (`50% of 292 − 50vw` = −366, exactly) applied to an image sitting in a narrow grid
cell rather than in a single centred column. Another overflowing image is an ordinary 580px card image
carried out of view by its own container. So the cause is containers, not the images; the images are
just what you can see.

**This is not from the image-alt work.** That change altered `alt` values and nothing else — with every
alt value blanked out, the changed files are byte-identical to their previous state — and none of the
benchmark pages reads a dataset it touched. The full-bleed treatment arrived with
`63acad69 feat(ahv): the article template becomes a real template — 129 routes at once` (19 Sep 14:25),
which is already an ancestor of this session's starting commit.

## 3. Why nobody had seen it: the evidence was four days stale

`english-candidate/route-verification.json` was committed reading **504/504 passed, 0 failed, 0
horizontal overflow**, at the same two widths. That is the number the handover quotes as
"Sweep 252 routes 0/0/0/0".

Its own stamp says `generated: 2026-09-14T20:20:10Z`, and it was last committed on 15 Sep 01:56.

Between that stamp and now: the article template rebuild (19 Sep), the corporate-menu fix, the campaign
CTAs, the maps, the course views, the training hub, the 301s. **Every one of those changes shipped
against a verification file that predated them, and the file kept saying 504/504.** The sweep was never
re-run, so the number stayed true-looking and stopped being true.

This is the same failure as the computed-style tool earlier in this session, which reported "0 of 16"
because it was comparing a reverted state against itself: **a verification artefact that is not
regenerated is not evidence, it is a souvenir.** The repo file has been replaced with the clean run, so
the next session inherits a number that means something.

## 4. The other 44: the baseline is behind, the site is ahead

23 routes fail on title, h1, canonical or which view they mount. Spot-checked, they are all work the
owner approved after 14 Sep, which the baseline cannot know about:

- `/gift-test/` now renders Gift Vouchers, `/how-to-reach-old/` now renders How to Reach — the owner's
  page-by-page canonicals, and both are in his twelve 301s.
- `/intensive-ayurveda-training-program-learn-practice-ayurveda/` now mounts the course view built on
  17 Sep instead of the generic article reader.
- `/ayurveda-training-programme/` carries the hub title from D-20260916-10.
- `/cart/`, `/checkout/`, `/contact-us-old/`, `/enquiry-form-old/` all resolve to their approved targets.

**Nothing here needs fixing in the site.** What needs doing is regenerating the accepted baseline in the
handoff directory so these stop reporting as drift — and that is an owner decision, because accepting a
new baseline is accepting that everything in it is correct.

## 5. What I did not do

I did not fix the overflow. Three reasons, in order:

1. It lives in the shared article template, and **that template is being replaced**. The owner is
   redesigning all 186 shared-template pages in Claude Design, starting with T14 ENQUIRY. Patching the
   full-bleed rule now is work that the T1 redesign throws away.
2. `/packages/` is one of the pages affected, and it is on the owner's benchmark list. Changing how it
   renders is exactly what MODE A forbids the agent doing unasked.
3. The mechanism is containers, not a single rule, so the fix is a real piece of layout work, not a
   one-line specificity change.

If the owner wants it fixed before the redesign reaches T1, it is a contained job: 34 routes, one
template, all at ≥1024px.

## 6. Numbers worth carrying forward

- Sweep: **426/504** states pass · **0** 404s · **0** JS errors · **0** broken images · **34** routes
  overflow at 1024px · 44 states are baseline drift.
- Prerender: **240/240 routes, 0 failed** — 240 and not 252 because the twelve 301s are correctly
  skipped; a route that redirects is not a page to snapshot.
- Image alt: exposed empty alt **159 → 143** across the snapshot set; **135** on the 240 routes that
  actually ship; 98 correctly `aria-hidden` and deliberately untouched.
- Benchmark pages: **0 of 16** page/width pairs changed, from a tool validated against an unchanged
  state first (three consecutive runs at 0 of 16).

## Dispositions (R3 triad — every finding rowed)

_Added 2026-09-21._

| # | Finding | Disposition | Reason / outcome |
|---|---|---|---|
| 1 | The committed `route-verification.json` read 504/504 with 0 overflow, and its own stamp said it was generated four days before the article template landed | **IMPLEMENT** | The stale file was replaced with a real run, and every change since has been measured against that baseline rather than against a claim. Standing practice now: the sweep is re-run and diffed after every payload change, and "0 new failures against baseline" is the phrase that means something. |
| 2 | 34 routes scroll sideways at 1024px — a real defect in the shared article template | **MONITOR** | Deliberately not fixed here: it lives in the template the owner is replacing family by family, and the fix is layout work inside a design he is redesigning. Carried in **BACKLOG** against the T1 EXPLAIN redesign, and in the flip-readiness report; it belongs to that redesign, not to a patch. |
| 3 | 44 further failing states across 23 routes are baseline drift, not defects | **REJECT** | Correctly classified as drift (the owner's canonicals, the 17 Sep course views, the D-20260916-10 hub title). No action; recording it stops the next session re-reporting 78 failures as if they were all real. |
