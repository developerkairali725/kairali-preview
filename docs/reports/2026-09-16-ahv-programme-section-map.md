# AHV programme section — navigation map and rebuild plan

Read-only map for D-20260916-10 (owner, 2026-09-16). Evidence: `english-candidate/route-manifest.json`, the 252 prerender snapshots, `public/ahv/assets/all-programs-data.js`, the `/all-programs/` view logic, and the 16-month Search Console export (`launches/ayurvedichealingvillage.com/baseline/raw/gsc-ui-export-2026-07-19/Pages.csv`). Generated 2026-09-16, measured on the staging build at commit 92654a15.

## 1. What is actually there

| Route | Template today | GSC 16 mo (clicks / impr / pos) | Links to the 5 courses? |
|---|---|---|---|
| `/ayurvedic-treatments/` | own — **the benchmark** (33 cards, "Not sure which programme fits?") | 631 / 418,186 / 8.7 | n/a |
| `/all-programs/` | own finder — search, chips (All/Wellness/Treatment/Training), shortlist, compare | 2 / 629 / 9.7 | no |
| `/wellness-programs/` | thin finder: **1 card**, 2,816 chars | 40 / 50,655 / 5.9 | no |
| `/treatment-programs/` | thin finder, 6,343 chars | 31 / 29,197 / 9.7 | no |
| `/yoga-meditation-programs/` | own, 5 cards, carries the NABH block | 767 / 38,123 / 17.1 | n/a |
| `/training-programs/` | thin finder: **1 card** → `/ayurveda-training-programs/` | 36 / 3,755 / 14.2 | **no** |
| `/ayurveda-training-programs/` | own hub: process, features, outcomes, "Available Courses", FAQ | 48 / 2,983 / 7.4 | **no** — "Available Courses" links to none |
| `/ayurveda-training-programme/` | generic article-reader | 19 / **70,193** / 7.5 | **yes** — the only hub that does |
| `/yoga-meditation-training/` | programme-detail (package) template | 39 / 23,247 / 7.7 | n/a |

The five courses all exist, all on the generic article-reader with 5,800–9,150 characters of legacy text, each reachable only from `/ayurveda-training-programme/`, `/ayurveda-training/` and the sitemap:

| Course (tariff code, `RATES_RECKONER.md` KAHR/AY-TRG/2026-2027/04/GBL) | Route | GSC |
|---|---|---|
| 1 Day Workshop — OAP-HV | `/one-day-ayurveda-workshop-program-kerala/` | 48 / 1,558 / 17.3 |
| 3 Day Certificate Program — TAP-HV | `/three-day-short-term-ayurveda-certificate-program-tap-hv/` | 39 / 1,374 / 11.6 |
| Intensive (learn & practice) | `/intensive-ayurveda-training-program-learn-practice-ayurveda/` | 23 / 814 / 15.9 |
| 10 Days Advanced Program — AATP1-HV | `/level-one-advance-ayurveda-training-program-for-wellness-professionals-kerala-aatp-1-hv/` | 7 / 764 / 15.0 |
| 20 Days Advanced Consultant Program — AALCT-HV | `/advanced-ayurveda-lifestyle-consultant-and-therapist-training-program-kerala-aalct-hv/` | **202 / 7,755 / 16.1** |

Satellite training pages, all article-reader, all sitemap-only orphans with impressions: `/ayurveda-training/` (3,175 impr), `/training/` (750), `/ayurveda-workshop/` (483), `/training-course-fees/`, `/why-get-training-in-ayurveda/` (38 inbound — the one that is linked), `/why-get-training-in-yoga/`, `/new-to-yoga-teacher-training/`.

## 2. Why it feels disjointed — the four root causes

1. **Four different templates for one job.** `/ayurvedic-treatments/` (benchmark), `/all-programs/` (its own finder), the three homepage hubs (`/wellness-programs/`, `/treatment-programs/`, `/yoga-meditation-programs/` — a fourth design), and `/training-programs/` (the thin finder). Same visitor task, four looks.
2. **The finder dataset has one training entry.** `all-programs-data.js` holds 33 programmes; `counts.Training = 1`. The single entry is `/ayurveda-training-programs/`, priced off the one-day workshop. That single row is *why* the five courses collapsed into one card on every finder.
3. **The shortlist is in-memory only.** `/all-programs/` keeps `isSaved(route)` in view state; no localStorage, no URL state, no other view reads it. It is lost on the first navigation, so it cannot "go through all these pages" today.
4. **The hub that ranks is the one on the wrong template.** `/ayurveda-training-programme/` has 70k impressions at 0.03% CTR (a title problem on a URL Google already rates) and is the only page that links to the courses — but it is an article. `/ayurveda-training-programs/` has the hub layout and links to nothing.

`/yoga-meditation-training/`: the site header is byte-identical on every page; what reads as a stray is the page opening as a programme detail (About / History / Awards / Structure) while the homepage and nav present it as the yoga hub. It is a detail page in a hub slot.

The "mobile view for a microsecond" is unrelated to this section — it is the boot mount order (`host.innerHTML = "<x-dc></x-dc>"` wipes the phone-width server snapshot before the runtime has loaded), fixed in shared boot with the navigation work.

## 3. Target structure (proposed, owner to confirm the two starred calls)

**One template — the benchmark.** `/ayurvedic-treatments/` becomes the section template: h1 · "Choose Your Programme" · cards (the family dataset filtered by category) · the shared block on every finder/filter page:

> NABH Certified Hospital · 118+ Years Heritage · Individualised Programmes · World Luxury Award Winner — *Not sure which programme fits? Share your goal in your own words — the patient care team or an Ayurvedic doctor will point you to the right programme.* Free Doctor Consultation · WhatsApp Patient Care · Enquire Now (motif)

| Route | Role after | Content source |
|---|---|---|
| `/all-programs/` | master finder, all categories, search + chips + **persistent** shortlist (localStorage, keyed by route, read by every finder) | dataset |
| `/ayurvedic-treatments/` | Treatment finder (unchanged — it is the template) | as is |
| `/treatment-programs/` | Treatment finder on the benchmark template, same cards ★ (29k impressions — keep as a page; canonical stays self) | dataset · Treatment |
| `/wellness-programs/` | Wellness finder (needs more than 1 entry — see §4) | dataset · Wellness |
| `/yoga-meditation-programs/` | Yoga & Meditation finder, re-skinned to the template | dataset · Yoga |
| `/training-programs/` | Training finder: 5 course cards + link to the hub | dataset · Training (5 new rows) |
| `/ayurveda-training-programme/` ★ | **the training hub** (benchmark template + course cards + the hub sections it lacks) — it is the URL Google rates | merged from `/ayurveda-training-programs/` |
| `/ayurveda-training-programs/` ★ | same content, `rel=canonical` → `/ayurveda-training-programme/` (no 404, no redirect on staging) | mirror |
| `/yoga-meditation-training/` | stays a programme detail; homepage/nav labels that mean "the yoga hub" point to `/yoga-meditation-programs/` | as is |
| 5 course pages | programme-detail (package) template — the one used by `/yoga-meditation-training/` and the packages | legacy text rewritten; facts from the tariff |

★ Alternative for the pair: hub at `-programs`, canonical from `-programme`. The impressions (70k vs 3k) argue for `-programme`; the clicks (19 vs 48) are noise at these CTRs.

## 4. What the rebuild needs from outside the code

- **Course facts** come from `docs/rates/RATES_RECKONER.md` (codes, durations; fees per the current reference no.), never from kairali.guru — its printed rates expired 31 Mar 2020 and the reckoner already flags code drift (AATP-1 vs "AATP 1", AALC-2 vs "AALCT"). Anything the reckoner does not carry is left blank and flagged (HARD GATE 6).
- **Course narrative**: rewritten from the existing legacy page text (already in the repo, 5.8–9.2k chars each) plus kairali.guru only where the legacy text is thinner. kairali.guru is scraped content → security-auditor injection screen before use (rule r). Rewrite, not paraphrase-in-place, so the two sites do not carry the same paragraphs.
- **Wellness has one entry** in the dataset (`/preventive-and-regenerative-treatment/`). The category needs the owner's list of which programmes count as Wellness, or the finder shows a single card on a 50k-impression page.
- **`/yoga-meditation-training/` at 23k impressions** keeps its URL and template; only the inbound labels change.

## 5. Build order (after the running design audit; navigation before per-template design)

1. Shared boot: mount-order fix (snapshot kept until the template is pushed; phone snapshot hidden ≥700px) — one change, every page.
2. Dataset: 5 training rows (route, name, code, duration, categories `["Training"]`, tariff ref, `from` per reckoner) + Wellness list once ruled.
3. Persistent shortlist in the finder logic (localStorage; count badge on every finder; the compare view reads it).
4. The five finders onto the benchmark template with the shared block; `/all-programs/` keeps search + chips.
5. Training hub merge + canonical pair; homepage/nav label targets.
6. Five course pages onto the programme-detail template with rewritten text.
7. Re-render snapshots, re-run the 252-route sweep (0 JS errors, 0 404s), deploy to Preview, screenshots phone + desktop.
