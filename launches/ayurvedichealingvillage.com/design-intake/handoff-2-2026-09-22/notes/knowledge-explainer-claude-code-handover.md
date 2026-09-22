# T04 Knowledge / explainer — Claude Code handover
Packaged 19 Sep 2026. Unpacks straight into `launches/ayurvedichealingvillage.com/design-intake/T04-KNOWLEDGE-EXPLAINER/`.

## What this is
The typography template for the knowledge/explainer family. Four other families inherit their type scale from it. One DC holds three real routes behind a review switcher in the top strip, chosen to bracket the family's extremes: a structured 644-word page, a 722-word wall of prose with zero lists, and an 87-word stub.

## Files
```
AHV Template Knowledge Explainer Desktop.dc.html   the view
AHV Chrome Header.dc.html / AHV Chrome Footer.dc.html
support.js
assets/img/…                                       10 images, all referenced, all present
notes/AHV Chrome Header.dc.html                    ← duplicate, see "Chrome resolution"
notes/AHV Chrome Footer.dc.html
notes/support.js
notes/knowledge-explainer-family-qa-harness.html   runAll() → 38 pass / 0 fail
notes/knowledge-explainer-family-page.md           sidecar: register flags, head contracts, Codex asks
ASSET-MANIFEST.json                                every contained file + every required-but-absent asset
```

## Self-containment check (done, not claimed)
Folder served over HTTP; all three route states opened at 1440px and 390px. **0 console errors, 0 network 404s.** Every `<img>` returns `naturalWidth > 0`. The only external request is the Google Fonts stylesheet for Marcellus + Mulish, which is deliberate and matches the other families.

The two files the last drop dropped — `kairali-colorful-logo.png` (header) and `ktahv-logo-white-brand.svg` (footer) — are both in `assets/img/`. Neither `legacy/lotus.svg` nor `legacy/gallery.png` is referenced by this family.

## Chrome resolution
The harness lives in `notes/` and loads the view through `../`, so `dc-import` resolves chrome relative to the *view*, not the harness. Copies of both chrome DCs and `support.js` sit in the package root **and** in `notes/`, so the family renders whether it is opened from the root or from the harness. Keep both copies in sync — they are byte-identical to the frozen Home chrome and must not be edited per family.

## QA harness is the contract
`notes/knowledge-explainer-family-qa-harness.html` → `runAll()`. 38 assertions, currently 38 pass / 0 fail. It asserts real counts per route state:

| State | Asserted |
|---|---|
| /new-to-ayurveda/ | 7 rail links, 7 article H2, 10 definition-list terms, 4 bullets, 2 figures, 3 FAQ questions, all 7 rail anchors resolve |
| /learn-about-ayurveda/ | 5 rail links, 3 H2, 2 H3, 13 paragraphs, **0** lists, 1 figure, 1 decorative pull quote, 3 glossary terms |
| /learn-more-about-ayurveda/ | rail suppressed, 1 paragraph, 2 CTAs, 5 index groups, 9 index links |
| all | 4 card images + 5 links in the closing block, 2 consultation CTAs, chrome mounted, 0 dead hrefs, no horizontal overflow, body ≥17px / ≥1.6, every target ≥44px |

**If you add or remove a control, change the expected number in the same commit and record the move below.** The 87-word route deliberately suppresses the contents rail — that is a design decision, not a missing element; if you reinstate it, the rail-suppressed assertion must change with it.

### Changed since the last packaged family
| Change | Assertion affected | Why |
|---|---|---|
| Draft badges removed, `showDrafts` prop deleted | none — badges were never asserted | Owner approved all drafted content 19 Sep 2026; the content stays, the badges go |
| Global `box-sizing:border-box` reset added | `no horizontal overflow` now passes | The consultation band's 104px padding sat on top of its 94% width and overflowed the viewport by 34px. Carry this into every future view in this family |
| Closing band recoloured forest → white card + bronze rule | none | Owner: "random green why", and brand conflict #1 (owner dislikes dark green). Forest is now only an inline link colour |
| Section rules lightened `#DCD3BF` → `#EAE3D2`, rule added above "Learn About Ayurveda" | none | Owner comment on divider weight; every H2 now opens on the same hairline |
| Card hrefs repointed to matrix-canonical routes | `0 dead hrefs` | See route split below |

## Routes — build only group A
Derived from `uploads/AHV-frozen-content-lock-608.json` and live `robots` headers. **UNVERIFIED against `BUILD-SETS.md`, which is not in this workspace — reconcile before building.**

**A · Stay live, build these (10)**
`/new-to-ayurveda/` · `/learn-more-about-ayurveda/` · `/why-pick-an-ayurveda-treatment-or-ayurvedic-retreat/` · `/why-get-training-in-ayurveda/` · `/what-is-panchkarma/` · `/live-to-100-with-panchkarma/` · `/ayurveda-retreats-for-everyone/` · `/new-to-yoga/` · `/what-is-ayurvedic-food/` · `/ayurvedic-resturant-and-cooking-at-healing-village/`

**B · 301 at the DNS flip, do not build (3)**
- `/why-pick-an-ayurveda-treatment-orayurvedic-retreat/` → `/why-pick-an-ayurveda-treatment-or-ayurvedic-retreat/`. The missing hyphen is a typo in the live Knowledge Centre sidebar; both currently resolve. The card links in this view use the matrix-canonical spelling.
- `/retreats-for-everyone/` → `/ayurveda-retreats-for-everyone/`. Both return 200 with the same article. Direction of the 301 needs owner confirmation.
- `/why-pick-a-yoga-or-yoga-retreat/` → **not a duplicate.** Live cross-links it as if it were the Ayurveda article; it is the separate yoga piece and stays in group A of the *yoga* family. The mis-link has been corrected in this view.

**C · Live but out of the XML sitemap (1)**
- `/learn-about-ayurveda/` — live serves `robots: noindex, follow` and emits no canonical. Built (it is the family's longest-layout case and is internally linked) but must be excluded from `sitemap.xml`. **Confirm the noindex is intentional before porting — if it is not, the whole family's indexation plan changes.**

No `-old` duplicates and no redirect targets have been built.

## Head contracts
Verbatim in `notes/knowledge-explainer-family-page.md`. Note the `/learn-about-ayurveda/` noindex and the fr_FR alternate on the other two.

## Open owner decisions
1. `/learn-about-ayurveda/` noindex — intentional?
2. Direction of the `/retreats-for-everyone/` 301.
3. The Gita Ramesh manual extracts (page currently ends mid-thought) and, if credited, a real portrait.
4. Register violations in the verbatim live copy — "resort", "spa therapy", "world-leader", exclaiming headings. Listed in the sidecar; not fixed without sign-off.

## Not in scope of this drop
Mobile view. Desktop is out for approval first, per standing rule 4.
