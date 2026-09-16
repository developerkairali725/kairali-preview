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
