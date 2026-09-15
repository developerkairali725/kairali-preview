# AHV English staging — full UI/UX sweep, 68 design families, phone + desktop

**Session:** AHV English staging, 2026-09-15 · **Branch:** `codex/ahv-english-staging-20260915`
**Tool:** `sites/ayurvedichealingvillage.com/tools/audit-mobile-ux.mjs`
**Evidence:** `sites/ayurvedichealingvillage.com/english-candidate/mobile-ux-audit.json` (committed)
**Scope:** one representative route per design family — 68 families cover all **252 routes** —
loaded in a real browser at **390 px** and **1280 px**, 136 page loads. Machine-checkable facts
only; judgement calls are separated out and marked as such.

## Headline

**Zero hard defects at either width.**

| Check | Phone (390) | Desktop (1280) |
|---|---|---|
| Fatal page loads | **0** | **0** |
| Horizontal overflow | **0** | **0** |
| Page / console errors | **0** | **0** |
| Responses ≥ 400 | **0** | **0** |
| Broken images | **0** | **0** |
| Images missing `alt` | **0** | **0** |
| Pages with 0 or >1 `<h1>` | **0** | **0** |

For a 252-route site carried over from a legacy WordPress property, that is a good result and
it is the part of "no broken elements" that can be proven mechanically.

## Soft findings — all of them, ranked by how many routes they touch

### 1. Sub-12 px text on 63 of 68 families — but it is ONE string

Every single instance, at both widths, is the same text at 11.5 px:

```
ENGLISH · FRANÇAIS · DEUTSCH
```

the dead language-switcher label in the mobile menu (see the owner-reported defects report,
§2: it is a plain `<div>`, wired to nothing, and DE/FR do not exist in this build). No body
copy anywhere on the site renders below 12 px.

**This means one decision closes two findings at once:** hiding the dead locale label removes
the site-wide sub-12 px text finding AND the owner-reported "language switcher doesn't work".

### 2. Tap targets below the 44 px minimum — 165 of 252 routes touched

| Targets | Routes | Family |
|---|---|---|
| 49 | **135** | `/advanced-…-aalct-hv/` — the article-reader, the site's biggest family |
| 29 | 8 | `/Ayurveda_Treatment_Neo_S.India_Cities.html` (legacy campaign) |
| 28 | 1 | `/ayurvedic-treatment-packages.html` |
| 26 | 1 | `/` (homepage) |
| 4 | 7 | `/ayurveda-retreat-kerala.html` |
| 3 | 1 | `/panchkarma-treatment.html` |
| 2 each | 12 | `/yoga-meditation-programs/`, `/ayurvedic-treatments/`, `/apply-now/` |

Typical offenders are inline text links and small controls at 37–40 px tall
(`a 146x37 "Palakkad Weather"`, `a 119x37 "How to Reach?"`, `button 52x40`). None is a primary
CTA — the Book/Enquire/Call buttons all clear 44 px. **The single highest-leverage fix on the
whole site is the article-reader family: one template, 135 routes.**

### 3. A consent checkbox with no accessible name — 1 route, but it is a consent control

`/ayurvedic-treatment-packages.html` → `input#chkAgree` (`type=checkbox`, `name=chkAgree`) has
no `<label>`, no `aria-label`, no `aria-labelledby` and no `placeholder`. A screen-reader user
is asked to agree to something the screen reader cannot name. This is the only unlabelled form
control on the site, it sits on one of the owner's two hand-made pages, and it becomes more
important once consent-gated analytics lands (directive D-20260915-01).

### 4. Heading-level skips — 5, on 4 families

`h2 → h6` and `h2 → h4`, all on legacy campaign templates plus the packages page
(e.g. `h2→h6: "INR"`, `h2→h4: "Address:"`). Minor for SEO, real for screen-reader navigation.
These are the approved source's heading choices, not a build artefact.

## What this sweep does NOT cover — stated plainly

- **Colour contrast.** Not measured. The `axe-core-a11y` registry gate is the right home for
  it; it is not wired for this site yet.
- **Interaction states.** Links revealed only by interaction were audited separately on nine
  key routes (menus, accordions, `<details>` forced open) — see the owner-reported defects
  report §1 — but not across all 68 families.
- **Visual judgement.** Whether a page is *attractive* is not in this sweep. Screenshots are
  captured per family at both widths for that review.
- **The 4 remaining families' desktop screenshots** are evidence-only; their measurements are
  complete.

## Tool correction recorded here for honesty

The first run of this sweep reported "0 defects" for desktop on 67 of 68 families. That was
wrong: `page.screenshot({fullPage:true})` exceeded its 30-second default on these very tall
pages and threw inside the same `try` that wrapped data collection, discarding the entire
width's findings. The tool now captures screenshots separately, viewport-only, and records a
capture failure instead of losing measurements. The numbers in this report are from the
corrected run; the earlier desktop figures should not be cited.
