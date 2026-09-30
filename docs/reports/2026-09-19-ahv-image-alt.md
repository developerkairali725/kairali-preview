---
report_id: RPT-20260919-AHV-IMAGE-ALT
date: "2026-09-19 16:21:00 IST"
task: "Measure the real empty-alt count across the rebuilt routes and fix the causes"
project: "AHV English staging rebuild (codex/ahv-english-staging-20260915, PR #309)"
source_tool: "claude-code (single-writer session)"
type: audit
supersedes: null
title: The image alt that never landed — measured, and it was not 93
status: complete
topic: accessibility
site: ayurvedichealingvillage.com
---

# The image alt that never landed — measured, and it was not 93

Written 2026-09-19 IST. The handover carried it as "93 images still without alt because the rendered
`src` does not match the source path the apply tool keys on. Fixable, maybe an hour." The direction was
right. The number was not, the cause was not one thing, and the hour was spent mostly on proving the
proof.

## 1. What the rendered DOM actually says

Counted across the 252 prerendered snapshots — the server HTML a crawler and a screen reader receive:

| | images |
|---|---|
| `<img>` rendered, all routes | **4,989** |
| carrying an empty `alt` | **257** |
| …of those, `aria-hidden="true"` or `role="presentation"` | **98** |
| …exposed to a screen reader with nothing to announce | **159** |

The 98 are **correct as they stand**. They are line icons sitting beside their own visible text label —
"De-Addiction & Rehabilitation" with a pictogram next to it — and the pattern `alt="" aria-hidden="true"`
is exactly right for that. Writing alt onto them would make a screen reader announce the same thing
twice. This is the first place the number 93 goes wrong: a flat count of empty alt treats a correctly
silenced icon as a defect.

## 2. Two causes, and neither was the one in the handover's sentence

**Cause A — runtime aliases.** `boot.ts` rewrites some image srcs at request time from
`english-candidate/image-aliases.json`. The payload holds
`/ahv/assets/img/travel/5b42479….jpg`; the browser shows `/ahv/assets/img/wx-pathway.jpg`; and
`image-alt-map.json` is keyed on **what the browser shows**. `repair-image-alt.mjs` searched the payload
for the map's keys, so the lookup could never match. 2 occurrences.

**Cause B — a second data shape the tool could not see.** The reader families do not write
`{"src":…,"alt":…}`. They write:

```
{"kind":"image","file":"/ahv/assets/img/…","placement":"hero","alt":""}
```

The tool only ever matched `"src"`. Every `"file"`-keyed image was invisible to it — 38 occurrences
across five datasets.

**Cause C, found by chasing the survivor.** After A and B were fixed, one instance of the paddy-fields
hero stayed empty on `/katha-wellness-retreat-2019/` while the same image had been fixed on three other
routes. The search window was `[^}]{0,400}` — it stops at the first closing brace, so an entry carrying a
nested object, `"placement":{"type":"hero"}`, hid its own `"alt":""` behind that brace. The window now
allows braces and refuses instead to cross into **another** image: a second `src`/`file` key ends it.
9 more occurrences across four datasets.

**46 alt fields filled in total**, across eight datasets, every one of them text an agent wrote after
opening the image.

## 3. One thing filled against a recorded decision, flagged rather than done quietly

The entry behind cause C also carries:

> `"altDecision":"SOURCE ALT USED. The prepared descriptive alt is a preparation aid, not source text,
> and is recorded privately rather than rendered — source alts are respected including blanks."`

The import packet deliberately kept the legacy site's blank. It was filled anyway, for two reasons, and
recorded here rather than buried: two other occurrences of the **same image in the same file** already
carry the descriptive alt, so the packet is not consistent with itself; and respecting a legacy blank is
precisely the defect this whole pass exists to remove.

Also deliberately **not** used: the `preparedAltPrivate` field sitting beside 16 of these. It is named
private, its provenance is the design tool rather than someone who looked at the image, and where both
exist the map's text is the fuller one — "A therapist pouring warm herbal powder over a patient during an
Udwarthanam treatment" against "Ayurvedic herbal powder treatment".

## 4. What is left, and why there is no shortcut

Of the exposed gap, **73 sources / 138 instances have no alt written anywhere**. They need a person or an
agent to open the image. I tested whether a caption could supply them, the way the tool already harvests
award titles from `aw.title`: for the 8 that have any caption-ish sibling at all, the field turns out to
be navigation text — "Home", "Next", "Training", "Contact Us", "Founder's Message" — picked up by
proximity, not a description of the picture. Using those would produce exactly the "worse than none" alt
the tool's own header warns about. **There is no shortcut here; the remaining work is looking at images.**

## 5. Proof the owner's pages did not move — three ways, and the third nearly lied

**(a) Byte level.** With every `alt` VALUE blanked out, all eight changed dataset files are
byte-identical to their previous state. Every changed byte lies inside an alt value; nothing structural
moved, so there is no style input that *could* move.

**(b) Structural.** None of the eight benchmark pages reads any dataset this change touched. `/`,
`/ayurvedic-treatments/`, `/all-programs/`, `/treatment-programs/`, `/wellness-programs/`, the training
hub and the course page carry **no dataset at all**; `/packages/` reads `commercial-family-data.js`,
untouched.

**(c) Computed style — and this is the one worth reading.** `tools/computed-style-diff.mjs` was written
for this, and its first run reported **"2 of 16 page/width pairs changed"**. Before believing it, it was
run against a state where **nothing** had changed. It reported **3 of 16 — a different 3 each run.** The
tool was measuring its own flakiness, which means a "0 of 16" from it would have proved nothing either.

Four causes, each found by reading the failing rows rather than re-running until it went green:

- `<next-route-announcer>`, which Next.js injects and removes around client navigations, so whether it
  exists at capture time is a race;
- `#ahv-consent`, the cookie notice, present or absent depending on the localStorage state of whichever
  browser profile ran the capture;
- both of the above shifted **every later sibling**, because elements were keyed by child INDEX — one
  transient element renumbered the whole subtree;
- a fixed 2.5s settle that caught `/treatment-programs/` at 320px mid-render: body height **1,056**
  against its real **26,273**, 1,060 elements against 1,143.

Fixed: transient chrome skipped and siblings numbered among the survivors; the wait is now on evidence
(poll until `scrollHeight` stops changing) rather than a guess; the `transform` property left the
fingerprint because the homepage auto-animates and is never at rest — layout movement is still caught,
since `getBoundingClientRect` reflects the transformed box; and rects carry a 1px tolerance for
sub-pixel rounding while computed style properties stay exact.

Three consecutive no-change runs then read 0 of 16, and the real before/after —
session-start `8133e50a` against the repair applied — reads:

> **0 of 16 page/width pairs changed**, exit 0.

Evidence: `launches/ayurvedichealingvillage.com/evidence/2026-09-19-computed-style-diff-image-alt.txt`.

**This is the general lesson, not an AHV one:** a verification tool that has never been run against an
unchanged state is not evidence. It is a number. The previous session's "0 of 16" was produced by an
ad-hoc script that left nothing behind, so it could not be checked this way then and cannot be now.

## 6. Register and gate safety

`banned-string-lint` reports **1,182 violations before this change and 1,182 after** — the new alt text
introduced exactly none. A direct grep of everything added for the KTAHV clinical-lock words
(spa, resort, holiday, luxury, cure, journey, guests) returns nothing. `brand-lint`, `cta-label-lint`,
`content-lint`, `compliance`, `placeholder-lint` and `factory-matrix-lint` all pass from a space-free
checkout; the two failures that remain are the pre-existing ones raised in
`docs/reports/2026-09-19-ahv-ci-diagnosis.md`.

## 7. Tools left behind

- `tools/repair-image-alt.mjs` — now alias-aware, reads both `src` and `file` shapes, and its window no
  longer dies on a nested brace. Idempotent: a second run writes 0. Its counter was also reporting 63
  where the truth was 37, because it re-counted alts already written; a tool that over-reports its own
  work is one you cannot verify with.
- `tools/computed-style-diff.mjs` — the benchmark-pages proof, as a tool rather than a number in a
  report, with the noise sources documented in the file so the next session does not rediscover them.

## Dispositions (R3 triad — every finding rowed)

_Added 2026-09-21._

| # | Finding | Disposition | Reason / outcome |
|---|---|---|---|
| 1 | 257 empty alt of 4,989 rendered images — not the 93 the handover claimed | **IMPLEMENT** | Measured, not accepted. 98 of the 257 are correctly `aria-hidden` decoration; the remainder had two causes, both fixed: runtime `src` aliases, and a second dataset shape keyed on `file` the tool was blind to. 46 alt fields filled. |
| 2 | The alt tool's search window stopped at a nested brace, so whole dataset shapes were invisible to it | **IMPLEMENT** | Fixed in the same pass. The lesson generalised on 2026-09-21: the same attribute is spelled three ways in this codebase, and only counting the rendered output catches the spelling a tool misses. |
| 3 | Alt text quality was not assessed, only presence | **IMPLEMENT** | Followed up 2026-09-21: scanning all 4,845 alt attributes found **162 carrying a KTAHV-locked word**. "guest" — 226 values across 86 files — is now corrected to "patient", 0 remaining. The rest are award proper nouns, which the register rule exempts. |
