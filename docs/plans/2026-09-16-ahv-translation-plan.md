# AHV translation — the process, and what it costs

Written 2026-09-16, after the owner said: *"when we freeze english in staging we will
translate the site to all the other languages like we did villa raag."*

**Trigger:** EN frozen in staging. Not before. This document is the to-do, not a task
in flight.

---

## 1. What the Villa Raag precedent actually is

Verified live on 2026-09-16, not assumed:

```
villaraag.com/de/  200      villaraag.com/ru/  200
seven locales emitted, reciprocal, with x-default:
  en · de · fr · ru · es · he · zh-Hans · x-default
German title: "Villa Raag | Yoga-Rückzugsort in Agonda, Süd-Goa"
plugin fingerprints: gtranslate 0 · weglot 0 · wpml 0 · polylang 0 · translatepress 0
```

So: **real translated pages on real locale paths with complete reciprocal hreflang**,
not a machine-translation widget. That matches Factory law — `docs/group-inputs/
kairali-com-agency-build-intake.md` lists "GTranslate machine translation as the i18n
story" as a **blocker**, because "Factory standard is real locale pages with hreflang
(packages/i18n)".

**One catch worth knowing before planning around it:** `villaraag.com` site code is
**not in this monorepo**. Only its launch evidence is (`launches/villaraag.com/`).
It was built elsewhere. So Villa Raag is the *proof the pattern works*, not a codebase
to copy from.

### The in-repo template to actually copy: `sites/abhilashkr`

EN/DE/FR, live and verified (`/de/ueber-mich` 200, `/fr/a-propos` 200). Read
`sites/abhilashkr/src/lib/i18n.ts` — it is the whole pattern in one file:

| Piece | What it does |
|---|---|
| `LOCALES` | Declares the locale set, EN mandatory. |
| `ROUTES` | **Translated slugs**, not just translated text: `/de/ueber-mich`, `/fr/a-propos`. |
| `NAV_LABELS` | Per-locale navigation. |
| `SEO` | Per-locale title + description, hand-written per page. |
| `alternatesFor()` | Complete reciprocal hreflang + `x-default` by construction. |
| `localizedMetadata()` | Per-locale canonical, OG `locale` + `alternateLocale`. |
| `src/lib/localized-content.ts` | The translated body copy, typed per page key. |

`packages/i18n` backs this: `declaredLocales`, `localePath` (EN bare, others
`/<locale>/…`), `hreflangLanguages`, and `dictionaryGaps` / `createTranslator` —
**a declared locale missing a key THROWS at build**, so a half-translated locale
cannot ship silently as English.

---

## 2. How many locales AHV gets — decide this first

Villa Raag runs **seven**. AHV is **locked to three**.

- `CLAUDE.md` LOCKED FACTS: "KTAHV locales: **EN / DE / FR**."
- `SITE_DESIGN_LOCALE_REGISTER.md` row: "EN/DE/FR (**locked**)".
- Locale priority ruling (2026-07-15): DE is the priority second locale.

So "all the other languages like Villa Raag" is **not** the current AHV instruction —
it would be a change to a locked fact, which is the owner's to make, not mine to assume.
**Owner decision needed:** EN/DE/FR as locked, or widen toward Villa Raag's set?

Cost scales linearly and then some — see §4.

---

## 3. The AHV-specific complication nobody hits on a normal site

AHV is not TSX pages with a string dictionary. It is a **client-side runtime design**,
and the text lives inside the payloads:

```
public/ahv/views/*.json     136 payloads, 8.6 MB   <- template + logic + props, text inline
public/ahv/assets/*.js       69 family data files,  401 MB
public/ahv/components/        2 shared chrome components (header, footer)
```

Each payload carries a **`sourceSha256`** pinning it to the approved design source.
That matters:

1. **Translation means producing per-locale payloads**, not editing a `messages/de.json`.
   The `abhilashkr` pattern gives the routing, hreflang and metadata layer; it does
   **not** give the content layer for a runtime design.
2. **The sha pin is a governance question.** A translated payload is by definition not
   the approved EN bytes. Either the pin becomes per-locale, or translated payloads sit
   outside the pin with their own approval trail. Decide before translating, not after.
3. **Slugs.** `english-candidate/route-manifest.json` drives 252 routes. Translated
   slugs (the `abhilashkr` pattern, and correct for SEO) mean a per-locale manifest.
   `CLAUDE.md` already warns: "FR consultation-family slugs live under `/fr/…` — verify
   slug exists before linking."
4. **The prerender multiplies.** The SSR work delivered 2026-09-16 renders 252 snapshots
   at phone width. Three locales = **756 snapshots**; seven = 1,764. `tools/prerender-
   english.mjs` is per-locale-able but currently hardcodes the English manifest, and a
   full run already takes ~25 minutes.

---

## 4. The clinical lock applies in every locale — this is the expensive part

`CLAUDE.md`: banned words are banned "**any casing, all locales** — check DE/FR
translations for equivalents: e.g. **Kur/Urlaub/Luxus**, **cure/vacances/luxe** in banned
senses." The compliance package already ships the seeds — the AHV lint emits
`clinical-lock-de` and `clinical-lock-fr` findings today.

Two consequences:

1. **A translator who renders "retreat" as "Kur" or "holiday" as "Urlaub" breaks the GST
   language lock.** This is not a style preference; it is the SCN exposure the lock exists
   for. Translators must be briefed on the banned register *before* they start, and the
   compliance lint must run per locale.
2. **The EN clinical-language blocker must be closed first.** 191 of 252 routes currently
   carry banned-register words inherited from the approved content, awaiting the owner and
   Dr. Deepu John. **Translating before that is strictly wasted money** — every fix lands
   three times instead of once.

**Clinical sign-off is per locale.** `CLAUDE.md` HARD GATE 7: medical/clinical content
changes require Dr. Deepu John's sign-off. A German clinical page is a clinical change.

---

## 5. Order of work

Preconditions, all owner-side, none of them mine to close:

- [ ] EN frozen in staging (the owner's own trigger)
- [ ] EN clinical language lock resolved — **do not translate before this**
- [ ] Deepu's form sign-off (forms carry per-locale labels)
- [ ] Locale set ruled: EN/DE/FR locked, or widened
- [ ] The three non-English `/sitemap/` links resolved (`/de/behandlung-in-kerala.html`,
      `/de/lakshya-yoga-retreat-2017`, `/treatment-in-kerala-russian.html`) — already open
      from the SSR work, and they are DE/RU, so they belong to this lane

Then:

1. **Freeze and snapshot EN.** A moving source invalidates every translation in flight —
   the same freeze rule the migration playbook applies to redirect maps.
2. **Extract the translatable strings** from the 136 payloads into a reviewable
   per-locale file. This is the build step that does not exist yet and is the real
   engineering in this project.
3. **Decide the sha-pin and slug model** (§3.2, §3.3) — before any translation is bought.
4. **Brief translators on the clinical register** (§4), in writing, with the banned list
   and its DE/FR equivalents.
5. **Translate DE first** (priority second locale, 2026-07-15 ruling), FR second.
6. **Wire routing** on the `abhilashkr` pattern: `LOCALES`, translated `ROUTES`,
   `alternatesFor()`, `localizedMetadata()`.
7. **Run the gates per locale:** compliance lint (`clinical-lock-de` / `-fr` must be
   clean), `packages/i18n` dictionary-gap check (throws on a missing key), prerender +
   `verify-ssr.mjs`, and the 390/1280 browser sweep.
8. **Clinical sign-off per locale** from Dr. Deepu John.
9. **Ship all locales of a section together.** `docs/MIGRATION_PLAYBOOK.md`: each section
   must move "complete across all three languages at once so hreflang clusters never
   half-break." A half-shipped locale is worse than no locale.

---

## 6. What this is not

- Not a GTranslate/Weglot widget. Explicitly rejected as the i18n story.
- Not machine translation dumped into 252 pages. `MIGRATION_PLAYBOOK.md` §9 flags
  mass scaled content as a spam-footprint risk, and `gates/registry.yaml` carries a
  `scaled-content` row.
- Not in scope for the current staging lane, which is English-only by the owner's brief.

---

# ADDENDUM — 2026-09-16, after the owner's correction and a research pass

The owner corrected the plan above: Villa Raag was done **in a single batch run** —
content and SEO scraped from English and translated together — **not literal
translation**: some English terms were kept as-is and in context, and the output was
written as a native speaker of that locale would write and read it. And the locale set
is far wider than EN/DE/FR:

> "we will not only do de fr an ru we will do hebrew arabic mandarin simplified spanish
> japanese korean and maybe some of the nordic languages and as per search console data
> of countries visiting us other languages too — ask me first"

That supersedes §2 above. **This is a change to a locked fact** (`CLAUDE.md` LOCKED
FACTS and `SITE_DESIGN_LOCALE_REGISTER.md` both lock KTAHV to EN/DE/FR) and is the
owner's to make — captured, not assumed.

## A. The finding that decides whether Hebrew and Arabic are possible at all

Measured across all 252 approved snapshots and the design's own stylesheets:

```
PHYSICAL direction properties baked into the approved design   LOGICAL (RTL-safe)
  left:              4578      padding-left     2069             margin-inline    0
  right:              682      border-left       693             padding-inline   0
  text-align: left   1229      margin-left       593             border-inline    0
  padding-right        32      margin-right        1             inset-inline     0
                                                                 text-align:start 0
  TOTAL ~9,878 physical                                          TOTAL 0
```

**The approved design has zero RTL capability.** Hebrew and Arabic are therefore *not a
translation job on AHV — they are a design job.* You cannot flip `dir="rtl"` on a layout
whose geometry is ~9,878 hardcoded left/right values, most of them in inline `style`
attributes on elements the design tool **rewrites wholesale on every re-import**
(`tools/import-english-candidate.mjs`), so a hand-fix would not survive.

Every practitioner source agrees the fix is CSS logical properties applied from the
start, not `dir` plus override hacks. Options, in order of honesty:

1. **Drop HE/AR** from the first wave; ship the LTR locales.
2. **Rebuild the design's spacing layer on logical properties** — real design work,
   needs the design owner, and it is the only route that makes HE/AR correct.
3. **A separate RTL template** for HE/AR only, reusing the content layer.

Arabic/Hebrew also need: no `letter-spacing` (cursive script breaks), line-height
1.7–1.8, ~10–15% larger type, no all-caps in Arabic, `<bdi>`/`dir="ltr"` isolation for
phone numbers, emails and Latin brand names inside RTL text, and Arabic text runs
25–30% longer — which overflows buttons and fixed-width containers.

## B. Google's actual 2026 position — the risk is real but it is not "AI translation"

- Machine/AI translation is **not spam per se**. Google removed the old
  "block auto-translated pages via robots.txt" line in June 2025 and has stated its
  "policies do not strictly define content that has been translated by AI as spam".
- The live policy is **scaled content abuse**: many pages "including through automated
  transformations like… translating… where little value is provided to users."
- **But the enforcement in 2026 has been severe and is aimed exactly at our pattern.**
  The May 2026 core update and the 24–26 June 2026 spam update pushed *tens of millions*
  of machine-translated pages down the results across IT/ES/DE/FR; the August 2026 spam
  update explicitly extends to all languages and names "scaled translation abuse",
  calling one-English-article-into-forty-languages "a liability", not a loophole.

So the honest read: **a single unreviewed batch run into 10 languages across 252 pages
is 2,520 pages and is the exact shape currently being demoted.** What separates safe
from unsafe is not the tool — it is per-market value and native review.

And AHV is the worst case for shortcuts: it is a **NABH-accredited hospital**, i.e.
YMYL medical. The practitioner guidance is blunt — for YMYL, "budget for full human
localization and a qualified reviewer regardless of language pair distance."

Language-pair distance also matters: ES/DE/FR/PT/IT/NL tolerate MT plus a terminology
pass; **JA, KO, AR, RU, HE, ZH are distant pairs needing post-editing at minimum**.
Nearly every locale the owner named is in the hard group.

## C. Non-negotiable SEO mechanics (all cheap, all fatal if wrong)

- **One distinct URL per language.** Never serve two languages from one address.
- **Reciprocity + self-reference.** Every version lists itself and every other version.
  A missing return tag invalidates the **whole cluster**.
- **Self-referencing canonical.** If a page canonicalises elsewhere, *all* its hreflang
  annotations are dropped.
- **Valid ISO codes** — `he`, `ar`, `zh-Hans`, `ja`, `ko`, `es`, `de`, `fr`, `ru`. No
  invented codes (Villa Raag already does this correctly).
- **`x-default`** for unmatched visitors.
- **Past a few hundred pages, put hreflang in the XML sitemap, not head tags.** AHV at
  10 locales is 2,520 URLs — sitemap-based hreflang is the only maintainable option.
- **Translate the SEO layer too**, not just body: title, meta description, OG, image
  `alt`, and structured data.
- **Re-do keyword research per market.** A translated keyword list carries the wrong
  country's intent, and "translating a page nobody searches for in that market produces
  a page with no ranking upside and full scaled-content-abuse exposure."
- **Server-side rendered.** Client-side text swapping gets indexed as the source
  language only. The SSR work landed 2026-09-16 already satisfies this — and it is a
  precondition, not a bonus.
- Google determines page language from **visible content**, not the `lang` attribute.

## D. The batch pipeline, as practitioners actually run it

Consistent across r/nextjs, r/webdev, r/devops, r/reactjs and HN:

1. **Mask placeholders before the LLM, restore after.** Unmasked `{userName}` gets
   translated into `{用户名称}` and the page crashes. Regex out every variable to an
   opaque token first. This is the single most-reported failure.
2. **Translate whole files, not string-by-string** — the model needs surrounding context.
3. **Inject a glossary + product description + 5–10 words of per-key context.** One team
   reported ~70% fewer tone errors from context alone ("Sign up" as verb vs noun).
4. **A do-not-translate list is mandatory** and is exactly the owner's "some English
   words saved as is". For AHV that means at minimum: *Kairali*, *Ayurveda*,
   *Panchakarma*, *Ayurvedic*, *NABH*, *Vata/Pitta/Kapha*, *Abhyanga*, *Shirodhara*,
   and the treatment and programme names. Sanskrit clinical terms are domain
   vocabulary, not words to localise.
5. **CI parity gate that FAILS on a missing key.** `packages/i18n`'s
   `dictionaryGaps`/`createTranslator` already throws at build — keep that.
6. **next-intl** is the community default for App Router (`/[locale]` segment,
   middleware, hreflang via metadata, precompiled ICU). Tooling people name for the
   batch layer: Lingo.dev CLI, inlang/Paraglide, Tolgee, Crowdin, Lokalise, Weblate.
7. **Quality control**: native-reviewer sampling, back-translation, LLM-as-judge, and
   MQM/DQF error typology for anything clinical.

## E. What this does to the estimate

| | EN/DE/FR (§2) | The owner's set (~10 + Nordics + GSC additions) |
|---|---|---|
| Locale count | 3 | 10–14 |
| URLs | 756 | 2,520–3,528 |
| Prerender snapshots | 756 (~75 min) | 2,520–3,528 (~4–6 h) |
| RTL design work | none | **required** (HE, AR) — or drop them |
| CJK font/typography work | none | required (ZH-Hans, JA, KO) |
| Clinical sign-off passes | 2 | 9–13, each Dr. Deepu John |
| Compliance lock seeds | DE, FR exist | **7–11 new locales have no banned-word seed yet** |

That last row is a real build item: `packages/compliance` ships `clinical-lock-de` and
`clinical-lock-fr` today. Hebrew, Arabic, Mandarin, Japanese, Korean, Spanish and the
Nordics have **no banned-register list at all**, so the GST language lock would be
unenforced in those locales on day one. Those lists must be authored — by someone who
knows both the language and the lock — before those locales ship.

## F. Open questions for the owner

1. **RTL:** drop HE/AR from wave 1, rebuild the spacing layer on logical properties, or
   build a separate RTL template? (§A)
2. **Quality model:** given YMYL-medical + the 2026 spam enforcement, how much native
   review per locale? Batch-only is the cheapest and the most exposed.
3. **GSC-driven locales:** the owner asked to be asked. Needs the Search Console
   country/query export for ayurvedichealingvillage.com to propose a ranked list.
4. **Villa Raag's actual run:** its code is not in this monorepo. If the batch scripts
   still exist, they are the fastest possible start — where do they live?

---

# ADDENDUM 2 — the batch pipeline, specified

## G. "Single batch run" means one orchestrated pipeline, not one giant prompt

This is the most important correction to how the work gets built. A batch API takes a
**JSONL file of many independent bounded requests** — one per semantic unit per locale —
with a strict output schema, and returns JSONL. That avoids the three failure modes of
one enormous prompt: context-window omissions, JSON corruption, and one bad response
invalidating the whole site.

Eleven stages, each with the failure it prevents:

| # | Stage | Prevents |
|---|---|---|
| 1 | Crawl + inventory canonical EN URLs; capture body, headings, labels, **image alt**, captions, forms, validation messages, title, meta description, OG/Twitter, **JSON-LD text fields**, breadcrumbs, slugs. Record `pageId`, route, DOM location, content hash. | Translating body but not metadata — the single most common miss. |
| 2 | Extract code strings by **AST, not regex**. | Broken JSX, unstable line-number keys, untranslated `aria-label`s. |
| 3 | Parse content to an AST; strip scripts and nav duplication, keep paragraph/list/table boundaries. | Spending 13,000 HTML tokens where 1,500 Markdown tokens carry the same text. |
| 4 | Normalise to one manifest: `{id, source, locale, contentType, pageId, route, context, neighbors, maxLength, placeholders, dntTerms, sourceHash}`. Dedupe **only** when source *and* context match. | "Free", "Book", "Apply" collapsing to one translation across different senses. |
| 5 | Segment semantically — related UI strings by component, prose by section, each carrying page summary + neighbouring headings. | Context-free labels; inconsistent terminology. |
| 6 | Replace DNT terms, URLs, code and fragile markup with **typed sentinel tokens**. | The #1 reported crash: `{count}` translated to `{数量}`. Note: do **not** use ordinary-looking placeholders like `TERM1` — models inflect them. |
| 7 | One JSONL batch, one request per unit × locale, strict schema, per-locale concurrency caps, retry only failed IDs, cache on `sourceHash + locale + promptVersion + glossaryVersion`. | Retranslating unchanged material; rate-limit storms; non-deterministic overwrites. |
| 8 | Validate: key parity, schema, ICU compiles, placeholder multiset, DNT equality, markup structure, URL preservation, target length, source-language residue. | Fluent output that crashes at runtime or silently drops a variable. |
| 9 | **A different model** judges source vs target against an MQM rubric, naming the offending span. Then native review. | A model approving its own plausible-but-wrong output. LLM judges favour fluency — useful for ordering the review queue, never a certificate. |
| 10 | Reinject by **immutable ID**, never fuzzy text match. PR with source+target diffs and QA reports. | Injecting a translation into the wrong occurrence; clobbering manual corrections. |
| 11 | Build every locale, crawl, screenshot at mobile+desktop, compare routes and metadata, **publish only locales that pass**. | A valid translation batch creating thousands of bad URLs. |

## H. Corrections to my §A/§C above

- **CJK contracts, it does not expand.** Simplified Chinese ~20–40% *shorter* than English,
  Japanese ~10–55% shorter, Korean ~10–15% shorter. Arabic runs 25–30% *longer*. So the
  same hero can overflow in Arabic and look sparse and under-filled in Chinese — both are
  layout bugs, and only real-content screenshots catch the second one.
- **Never synthesise italics in CJK** — those typefaces have no italic tradition. Use
  weight, colour, brackets, a contrasting face, or Japanese emphasis dots.
- **Korean** needs `word-break: keep-all`; **Japanese** needs kinsoku (a closing bracket,
  comma or small kana must not begin a line); **Chinese** wraps between characters — do
  not reach for `word-break: break-all` as a blanket fix.
- **Per-locale CJK fonts, not one pan-CJK fallback** — glyph forms differ by region.
  `:lang(zh-Hans)`, `:lang(ja)`, `:lang(ko)` each get their own stack. These fonts are
  large: subsetting, `font-display` and preload strategy are Core Web Vitals items.
- **Canonical:** each translated locale page carries a **self-referential** canonical.
  Canonicalising translations back to English asks Google to consolidate them away — and
  a page whose canonical points elsewhere has *all* its hreflang annotations dropped.
- **`zh-Hans`** is the correct tag for Simplified Chinese (ISO 15924 script subtag).

## I. The cautionary tale, and it is our exact adjacent technology

An r/SEO report: a site went from ~2 million pageviews to under 100,000 after a **proxy
translation** implementation generated roughly **7 million malformed/duplicate URLs** with
partial translations and missing or wrong canonical/hreflang. It is one anecdote, but the
engineering lesson is the one to adopt: **stage a small URL cohort, crawl it, watch Search
Console, then expand.** Not 2,520 URLs on day one.

That technology class is GTranslate — the same widget approach the Factory already
rejected for kairali.com. Worth remembering when someone offers a fast shortcut.

## J. Recommended split

Do not make one tool do all three jobs:

- **Rendering/routing:** `next-intl` (App Router standard: `/[locale]`, middleware,
  localised pathnames, ICU, hreflang via `generateMetadata`).
- **Human workflow:** a TMS (Crowdin / Lokalise / Tolgee / Weblate / Smartling) for
  glossary, translation memory, screenshots and reviewer routing.
- **The 10-locale backfill:** a separate batch worker, exactly as §G.

`packages/i18n` already gives the locale gates and the build-time throw on a missing key;
it is not, and should not become, the content pipeline.
