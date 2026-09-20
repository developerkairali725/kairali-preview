# KTAHV clinical register — Russian

**Status: DRAFTED, AWAITING ABILASH'S SIGN-OFF.** Owner ruling 2026-09-20: "Add RU to the lock."
The list below is the draft he asked for. `CLAUDE.md` is **not** edited until he approves the
wording — the exact replacement text is in §4 so it can be approved in one read.

## 1. Why Russian needs a list at all

`CLAUDE.md` locks **EN / DE / FR**. Russian has never been covered, and until this week nobody
noticed, because the site's only Russian page —
`/treatment-in-kerala-russian.html` — has been served as mojibake for as long as it has been
live: 277,280 bytes, zero Cyrillic letters, 14,640 corrupted character pairs. **A banned-word
scan over that page returns zero hits in any language**, which is exactly the wrong kind of
clean. The register was never passing; it was never readable.

Recovered (`tools/lib/mojibake.mjs`, every one of 2,831 runs proven to round-trip), the page is
3,224 words of real Russian — and it carries the banned register throughout:

| EN term | Russian forms found | hits |
|---|---|---|
| luxury | роскош*, люкс | **13** |
| journey | путешеств* | **16** |
| spa | спа | **13** |
| resort | курорт* | **8** |
| guests | гост* | **6** |
| cure | исцел* | **6** |
| holiday | отдых | **3** |
| *(retreat — off-register, not banned)* | ретрит | *13* |

**78 banned-register hits**, including the page's own `<title>`, which recovers to
*"Лучший Аюрведический Ретрит в Керале | Роскошные курорты Кералы"* — **"luxury resorts"**, the
string Google would show.

## 2. The list

Matched case-insensitively on the stem, so every inflected form is caught — Russian declines
heavily and a fixed-form list would miss most real uses.

| EN banned term | Russian stems to ban | notes |
|---|---|---|
| spa | `спа` (as a word or in `спа-салон`, `спа-центр`, `спа-процедур*`) | must not match inside unrelated words — see §3 |
| resort | `курорт` | `курорт`, `курортный`, `курортно-` |
| luxury | `роскош`, `люкс` | `роскошь`, `роскошный`, `люкс`, `люксовый`. **`премиум` is NOT banned** — it is not a translation of *luxury* and the EN lock does not ban *premium* |
| holiday | `отпуск`, `каникул`, `отдых` | **sense-sensitive.** `отдых` also means clinical *rest*; banned only in the vacation sense |
| cure | `исцел`, `излеч`, `вылеч` | the outcome-claim sense. `лечение` (*treatment*) is the CORRECT clinical word and is **not** banned |
| journey | `путешеств` | **sense-sensitive.** Banned as brand metaphor ("your wellness journey"); *travel* in a How-to-Reach sense is legitimate |
| guests | `гост` | `гость`, `гости`, `гостей`. The clinical word is `пациент` (*patient*) |

Same construction as the DE/FR guidance already in `CLAUDE.md` ("Kur/Urlaub/Luxus,
cure/vacances/luxe **in banned senses**") — three of the seven are sense-sensitive in Russian
too, so the checker flags them for a human rather than failing the build.

### The clinical words that must be used instead

`пациент` (patient) · `врач` (physician) · `лечение` (treatment) · `программа` (programme) ·
`панчакарма` (Panchakarma) · `госпитализация` (admission) · `выписка` (discharge) ·
`консультация` (consultation).

## 3. False positives the checker must not raise

Stem matching in Russian is sharp, so these are carved out explicitly and tested:

- **`спа`** appears inside ordinary words — `спасибо` (thank you), `спасение` (rescue),
  `спальня` (bedroom), `спад`. The rule requires a word boundary or a hyphen after the stem.
- **`гост`** is also `ГОСТ`, the Russian state standard, and appears in `гостиница` (hotel —
  off-register but a different word) and `гостеприимство` (hospitality). Flagged, not failed.
- **`отдых`** in `отдых между процедурами` (rest between treatments) is clinically correct.
  Flagged, not failed.
- **`путешеств`** on a How-to-Reach page describes actual travel. Flagged, not failed.

Four of the seven terms therefore fail the build; three raise a finding a human rules on. That
split is the same trade the EN lock already makes — the owner parked ~595 descriptive uses of
*journey*, *guests* and *holiday* until after go-live precisely because they are sense-dependent.

## 4. The exact `CLAUDE.md` change, for approval

Two edits. Nothing else in the file is touched.

**(a)** In `LOCKED FACTS`, replace:

> - KTAHV locales: **EN / DE / FR**. Every content change ships in all three or is explicitly flagged as EN-only pending translation.

with:

> - KTAHV locales: **EN / DE / FR**, plus a single legacy **RU** landing page (`/treatment-in-kerala-russian.html`). Every content change ships in EN/DE/FR or is explicitly flagged as EN-only pending translation; RU is a legacy surface, not a maintained locale, and no new RU page is created without a ruling.

**(b)** In `KTAHV LANGUAGE LOCK`, replace:

> - **Banned words:** spa, resort, holiday, luxury, cure, journey, guests (any casing, all locales — check DE/FR translations for equivalents: e.g. Kur/Urlaub/Luxus, cure/vacances/luxe in banned senses).

with:

> - **Banned words:** spa, resort, holiday, luxury, cure, journey, guests (any casing, all locales — check DE/FR/RU translations for equivalents: e.g. Kur/Urlaub/Luxus, cure/vacances/luxe, and спа/курорт/отдых/роскошь/исцеление/путешествие/гости in banned senses). The Russian stems and their sense-sensitive carve-outs are in docs/ktahv-inputs/ktahv-register-ru.md.

## 5. Mechanism

`tools/audit-register-ru.mjs` scans Russian content — recovering mojibake first, so a corrupted
page can never pass by being unreadable. That last point is the whole lesson here: **the page
scored zero banned words for years because nothing could read it.** A register check that cannot
decode its input is not a passing check, it is an absent one.
