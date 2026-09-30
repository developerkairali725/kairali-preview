# `/download/ayurvedaworkshop-in-kairali.pdf` — found, and read before wiring

**Owner supplied the file, 2026-09-21**, from
`kairali-web-factory-kairaliyoga-preview/sites/kairaliyoga.com/public/download/ayurvedaworkshop-in-kairali.pdf`
(71,645 bytes, sha256 `bcc3cc4e00666457…`, valid `%PDF-`).

## It is the right file by name — the link has been dead for a while

AHV references it **5 times**, from `training7-family-data.js` and `article-family-data.js`:

```
link text : "Ayurveda Workshop In Kairali (9 Days) (PDF)"
href      : /download/ayurvedaworkshop-in-kairali.pdf          (missing in this repo)
and       : https://ayurvedichealingvillage.com/download/ayurvedaworkshop-in-kairali
```

The PDF's own title page reads **"Ayurveda Workshop In Kairali (9 Days)"** — an exact match. And
`article-family-data.js` already carries a measured `"status": 404` against the absolute URL, so a
previous pass confirmed it is **dead on the live site too**. Nobody has been able to download this
since before the rebuild started.

## But read page 1 before publishing it

```
Organized by Oriental Spa Ayus (Via Singapore Airlines)
Ayurveda Workshop In Kairali (9 Days)

Itinerary
1  Mar 26 (Sat.)  Depart Narita airport  SQ-637  11:10 …
                  Upon arrival, to Kairali Resort by bus
2  Mar 27 (Sun.)  Palakkad  7:00 Yoga class … Dinner with Ms. Gita
```

Four problems, none of them about the file being the wrong file:

1. **It is a third party's document.** "Organized by Oriental Spa Ayus (Via Singapore Airlines)" —
   another operator's branding, on a Kairali page.
2. **It is a dated one-off tour, not a programme brochure.** Real flight numbers (SQ-637, MI-0456)
   and calendar dates; "Mar 26 (Sat.)" last fell on a Saturday in 2022. It describes a specific
   Japanese group's trip from Narita, not the One-Day / Three-Day / Five-Day training programmes
   the page is actually selling.
3. **"Kairali Resort"** — a KTAHV-locked word, in a document offered from a NABH hospital's site.
4. **A named individual** ("Dinner with Ms. Gita") in a public download.

## Three ways to close it — owner's call

| | action | effect |
|---|---|---|
| **A** | Publish as-is at `public/download/ayurvedaworkshop-in-kairali.pdf` | restores a link dead since before the rebuild; ships all four problems above |
| **B** *(recommended)* | Remove the 5 links | the page stops promising a download it has never delivered; costs nothing, since the file 404s today |
| **C** | Replace with a current AHV workshop brochure | what the page is actually selling; needs a document nobody has produced yet |

Nothing has been wired either way. The file is **not** copied into this repo pending the ruling —
publishing a third party's branded itinerary is not a decision the agent makes (MODE A, HARD GATE 6).

## While measuring this, two more broken PDF links surfaced

- `/wp-content/uploads/2024/10/fauna-booklet.pdf` — **MISSING**, but a self-hosted copy already
  exists at `/ahv/assets/doc/fauna-booklet.pdf`. This one is a straight repoint, no new asset
  needed, and I can do it on your word.
- `https://ayurvedichealingvillage.com/download/ayurvedaworkshop-in-kairali` — an **absolute link
  to the production domain**, extension-less. Even if the PDF ships, this form breaks at the flip
  unless the new host serves that exact path; it should be relative.
