# AHV programme-section navigation — what changed (D-20260916-10)

Branch `codex/ahv-english-staging-20260915`, commits `231c7ed0` → `df6a9eb2`, 2026-09-16. Map and reasoning: `docs/reports/2026-09-16-ahv-programme-section-map.md`. Every change is a re-runnable tool under `sites/ayurvedichealingvillage.com/tools/` so the next import cannot lose it.

## Done, with proof

| Owner's point | What was wrong | What is live on staging now | Proof |
|---|---|---|---|
| "mobile view opens for a microsecond then switches to desktop" | boot wiped the phone-width server snapshot the moment the payload arrived, then loaded the runtime — desktop saw a 390px layout, then blank paper (1.5–6 s at 1.5 Mbps) | snapshot held until the live view renders; desktop never paints it (`data-ahv-snapshot-state` held → released → retired); a boot failure now degrades to the snapshot instead of a blank page | throttled Playwright 150 ms / 1.5 Mbps: desktop paints 0 chars while held, then the 860px view; phone keeps its snapshot at every sample; 0 page errors |
| "/all-programs/ … does the shortlist even work across pages?" | in-memory only; gone on the first navigation | persists in `localStorage['ahv-shortlist']` | add → leave to /about-us/ → return: shortlist 1/3, saved state restored, 0 errors |
| "5 training programs all got combined into one" | the finder dataset had ONE training row | five course rows (tariff KAHR/AY-TRG/2026-2027/04/GBL: code, days; per-night Deluxe single rate as the stated basis — the sheet quotes no course fee) | chip "Ayurveda training 6"; six cards link the hub + five courses |
| "/all-programs/, /yoga-meditation-training/, /wellness-programs/ look different, not cohesive" | four templates for one job; two of them 215-char stubs | `/wellness-programs/`, `/treatment-programs/`, `/training-programs/`, `/yoga-meditation-programs/` are instances of the `/ayurvedic-treatments/` template (own category, h1, breadcrumb, approved intro, hero, head) | 1280 + 390 on all five finders: h1, crumb, title, canonical right; 0 errors; 0 overflow; cards 38 / 2 / 29 / 7 / 5 |
| "this should be there in every finder page" | only the package pages carried it | NABH Certified Hospital · 118+ Years Heritage · Individualised Programmes · World Luxury Award Winner / "Share your goal in your own words — the patient care team or an Ayurvedic doctor will point you to the right programme." / Free Doctor Consultation · WhatsApp Patient Care · Enquire Now — on all five finders | block detected on all five at both widths; the old "every guest" sentence (a locked word) is gone from the derived pages |
| "/ayurveda-training-programme/ seems like a duplicate … has the programs but not their detailed pages" | it was the URL Google rates (70,193 impressions) on an article template; the hub page linked to no course | `-programme` mounts the hub layout; `-programs` serves the same page and canonicalises to it (no redirect, no 404, out of the sitemap); every "Available Courses" row links to its course page; the wrong legacy title on `-programme` replaced by the hub's | both routes at both widths: hub view, one canonical, five course links, 0 errors |
| "/yoga-meditation-training/ … a complete stray on the header" | not the header — the page is a programme detail sitting in a hub slot | left as the detail page it is; the yoga hub is `/yoga-meditation-programs/` (now on the benchmark template) | — |

## Owner rulings applied this session
- Hub URL = `/ayurveda-training-programme/`; `/treatment-programs/` kept as its own page — both "go with your recommendation".
- Wellness: Preventive + Personalized & Customized (owner). Five more proposed and **awaiting his word**: Complete Rejuvenation & Detox, Immunity & Executive Health, Stress Relief & Mental Wellness, Sleep Restoration, Panchakarma. `english-candidate/finder-additions.json` → `proposedAwaitingOwner`.

## Not done yet (next)
1. **Five course pages on the programme-detail template** with rewritten narrative (legacy text + kairali.guru, screened before use; fees only from the tariff). They exist today as article-reader pages with their legacy text and are now linked from the hub, the finder and the sitemap.
2. `/all-programs/` keeps its own search + shortlist + compare finder; it does not yet carry the shared block or the benchmark look. Cohesion call: give it the block now, or fold it into the benchmark template (which would drop the shortlist/compare feature the owner asked about).
3. Design audit resume: 28 of 66 templates done; verification and synthesis pending (`launches/ayurvedichealingvillage.com/design-audit/`).
4. Content flags for the Lane-B pass, not touched: "80% guest-trusted…" card lines in the benchmark dataset carry a locked word; "Ayurveda Training Program" h1 on the hub is US-spelled.

## Tools (run order after any import)
`repair-payload-navigation` → `repair-payload-schema` → `repair-finder-dataset` → `repair-finder-shortlist` → `build-finder-views` → `repair-training-hub` → `build-training-hub-route` → `repair-route-manifest` → `prerender-english` → `repair-snapshot-links`.

## 2026-09-17 — the open items, closed

| Item | Owner's word | What is live |
|---|---|---|
| Five course pages | "do as per recommendation" | each course is a data-driven instance of the training family's detail view (the hub template): own head, eyebrow (code · duration), h1, intro, real training photograph, and dataset — process lead + day-by-day modules, features, learning outcomes, course table with all five linked, FAQ, related. Content rewritten from each course's own legacy page and the training tariff; kairali.guru read for framing only after an injection screen (clean); guru course fees are not used. KTAHV word-lock lint on the copy: clean. The legacy sidebar that rendered as body text is gone. `tools/build-course-views.mjs`, `english-candidate/course-pages.json`. |
| `/all-programs/` | keep + add block | keeps search, shortlist, compare; carries the shared block, lifted verbatim from the benchmark. `tools/repair-all-programs-block.mjs` |
| Wellness | "add them" | Preventive + Personalized, Rejuvenation & Detox, Immunity & Executive Health, Stress Relief, Sleep Restoration, Panchakarma — chips read Wellness 7 on every finder |
| Design audit | "go ahead" | resumed from cache (28 templates cached, 38 + verification + synthesis running against an isolated HEAD build on 4321) |

Proof: browser at 1280 and 390 on all five course pages — right names, eyebrow, five course links, no legacy menu, 0 errors, 0 overflow; 252-route sweep on the deployed build 0/0/0/0; authenticated preview checked in the owner's Chrome (AALCT page). Preview `…-5gg3459oo-kairali.vercel.app` (breadcrumb fix redeployed after).
