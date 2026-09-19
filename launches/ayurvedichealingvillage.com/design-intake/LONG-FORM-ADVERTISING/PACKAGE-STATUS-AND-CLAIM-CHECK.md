# Long-form advertising family — what arrived, and what its claims measure

Written 2026-09-19. Two separate things: what is physically on this machine, and
what the handover's checkable claims look like when measured against the repo
instead of read.

## 1 · The package is NOT here — only the handover

`long-form-advertising-claude-code-handover.md` arrived. The files it lists did not.
Searched this machine by name:

| expected file | found |
|---|---|
| `AHV Template Long-Form Advertising Desktop.dc.html` | **no** |
| `notes/long-form-advertising-family-page.md` (the sidecar) | **no** |
| `assets/img/ppc/hero-layer8.jpg` + the other 21 images | **no** |
| `AHV Chrome Header.dc.html` / `AHV Chrome Footer.dc.html` / `support.js` | **no** |

The 21 MB zip sitting next to the handover in `~/Downloads/2 Families 1-2 /AHV family 3 /`
is the **T04 knowledge-explainer** package, already unpacked and committed in
`6b24a079`. Nothing can be built from a handover alone: the view, the sidecar and the
22 images are the deliverable. Same transfer that worked twice before — drop the zip in
`~/Downloads/` and say the word.

## 2 · The eight routes already exist in this repo

Worth knowing before the package lands, because this is a REPLACEMENT, not a new build.
Both routes the DC builds are already rebuilt here, on the `ahv-page-campaign-nine-desktop`
view, together with six siblings:

```
/wellness-resort-kerala.html                                 <- DC default tab
/offers/defence-paramilitary-personnel-get-upto-30-off/      <- DC tab 2
/weight-loss.html                                            <- handover: NOT BOUND
/preventive-rejuvenation-detoxification.html                 <- handover: NOT BOUND
/pain-management.html
/kairali-cleansing-centre.html
/Ayurveda_Treatment_Neo_S.India_Cities.html
/Kairali_Brand_and_Competition_Neo-original.html
```

So the family is eight routes in this repo, not four. The four the handover does not name
are on the same view and would inherit whatever the new template does.

## 3 · The checkable claims, measured

Standing rule: every finding is a candidate until it is confirmed against the rendered
DOM or the payload. Four of the twelve items are checkable without the package.

**Item 3 — "3 Lacs" — CONFIRMED.** `"Kairali has performed more than 3 Lacs Treatments
with an 87% satisfactory rate"` is present **4×** across `public/ahv/assets` and
`public/ahv/views`. The owner has ruled it changes to `300,000`; because it is verbatim
live copy, the deviation gets recorded rather than made silently.
The companion warning in the same item stands on its own: **87% is an unsourced outcome
claim on a hospital page.** That is a clinical-register question for Dr. Deepu John, not
a copy edit.

**Item 6 — the Lakshya film — CONFIRMED, and the gap is total.** The film
(`Lakshya_Yoga_Retreat_-_KAIRALI_VERSION_-_Final_full_film…mp4`) appears **4×**, all of
them inside `campaign-nine-data.js` — i.e. only on this advertising family. Checked the
six pages the owner wants it on, in the served HTML: **0 occurrences on all six.**

| owner's name | route in this repo | film today |
|---|---|---|
| AHV Page Yoga Retreats | `/yoga-retreats/` | absent |
| AHV Page Yoga Meditation Program(s) | `/yoga-meditation-program/` | absent |
| AHV Page Ayuryoga | `/ayuryoga/` | absent |
| AHV Page Lakshya Yoga | `/lakshya-yoga/` | absent |
| AHV Page Yoga Stress Reset | `/yoga-based-stress-energy-reset-program/` | absent |
| AHV Page All Programs (yoga block) | `/all-programs/` | absent |

One naming note: there is no `/yoga-stress-reset/` route. The page the owner means is
`/yoga-based-stress-energy-reset-program/` — confirmed against the 252-route manifest,
not guessed. Note also that `/all-programs/` is one of the owner's benchmark pages, so
the yoga block there is a change to a page that is otherwise frozen.

**Item 10 — 30% vs 20% — CONFIRMED in substance, wrong in one detail.**
Measured on the rebuilt route, not the live one:
- the slug promises **30%** — `/offers/defence-paramilitary-personnel-get-upto-30-off/`
- the body caps at **20%** — the snapshot carries `20% OFF`, plus `10% Discount`,
  `15% Discount`, `20% Discount`
- `og:title` is **empty** on this route in the rebuild. The handover says it "says 20%";
  in this repo it says nothing at all.

So the contradiction the owner has to resolve is real (slug 30 / body 20) and it needs
his number. The og:title half of the claim does not hold here.

**Item 11 — "JSON-LD is wrong on the wellness route" — CANNOT be confirmed, and the real
finding is bigger.** The claim is that the route's `@graph` describes `/ayurvedic-treatments/`
instead of itself. In this repo that JSON-LD **does not exist**: `wellness-resort-kerala.html`
carries **0** `ld+json` blocks — and so does every other route. Zero of the 252 prerendered
routes emit structured data. The only `ld+json` in the codebase is in
`app/(lp)/_components/lp.tsx`, the landing-page lane, which none of these routes use.

That reframes the item. Correcting one wrong `@graph` is a 5-minute fix; the rebuilt
English site shipping **no structured data on any route** is a launch-blocking SEO gap and
belongs in its own decision, not inside a template drop. Flagged here, not fixed here —
schema for 252 routes is a design decision, not a repair.

## 4 · Items that stay blocked, unchanged

1 (programme list), 2 (award list + order), 4 (live Tripadvisor score) need the owner's
current data. 5 (hero regrade) needs the source file, which is in the missing package.
7 (enquiry endpoint + captcha) is a real-handler question. 8, 9, 12 wait on the package.
