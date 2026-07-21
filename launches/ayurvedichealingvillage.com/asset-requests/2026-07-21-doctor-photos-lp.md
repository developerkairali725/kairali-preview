# CREATIVE ASSET REQUEST — KTAHV 10-LP photo re-shoot (Dr. Deepu John's review)

- **Date:** 2026-07-21 13:20:00 IST
- **Site:** ayurvedichealingvillage.com (KTAHV) — the 10 advertisement landing pages under `/lp/`
- **Trigger:** Dr. Deepu John's clinical review, 20 Jul 09:56 IST (Gmail 19f7ef47eddd9ca4): page 2
  (Panchakarma) "photos is not good"; page 3 (Weight Loss) "photos is not good" + "video in not
  available"; and the blanket note: *"reconsider the photos in all pages, not all is attractive and
  supporting the contents of the pages."* This is the one owed piece of the doctor wave (D-20260721-09;
  PR #219 handled the wording, the photos are the creative lane).
- **Protocol:** Missing-asset protocol (D-20260719-29) — draft-only; the OWNER clicks send. Every
  slot carries the 7-part spec + exact pixel dimensions + aspect ratio. The video slot carries a
  frame-by-frame storyboard OR a working-link request.
- **Register lock (HARD, non-negotiable):** KTAHV is an NABH-accredited Ayurvedic **hospital**. Every
  image must read as a clinical, physician-supervised hospital — **never** a spa, resort, holiday,
  luxury or "guests" framing. Real Kairali rooms, real therapists, real named physicians, patients
  shown respectfully and non-identifiably where relevant. No invented facilities, no stock "wellness"
  look. (This is the same clinical lock that governs the copy, applied to the imagery.)
- **Recipient:** Anupam, mkt@ktahv.com (KTAHV/Healing-Village creative lane, per D-QUEUE-18JUL-EVENING);
  cc director@, ho.mkt@ (Astha — she raised the fleet-wide photo note), doctor@ktahv.com (Dr. Deepu
  John may name which real therapies/rooms are appropriate to shoot).

## Why this is ~11 assets, not 30 slots

The 10 LP pages share one image pool: the same ~10 photo files fill every hero and gallery slot
across all ten pages, plus one physician headshot and one testimonial video. Replacing the pool
fixes every page. The map (verified against the page source on `feature/ktahv-lp-front-gates` +
`app/globals.css` for rendered geometry):

| Asset file | Slot geometry | Appears on |
|---|---|---|
| consultation-pulse.webp | hero (near-square) | panchkarma **(flagged)**, weight-loss **(flagged)** |
| therapy-panchakarma.jpg | hero + gallery (dual) | panchkarma gallery **(flagged)**, cleansing hero |
| therapy-abhyanga.jpg | hero + gallery (dual) | treatment-packages hero; gallery on panchkarma **(flagged)**, weight-loss **(flagged)**, cleansing, treatment-in-kerala, hospital-kerala |
| healing-village-grounds.jpg | hero + gallery (dual) | treatment-in-kerala hero; gallery on panchkarma **(flagged)**, weight-loss **(flagged)**, cleansing, hospital-kerala |
| therapy-pain-management.jpg | hero (near-square) | pain-management |
| patient-villa-classic.jpg | gallery (3:2) | weight-loss **(flagged)**, treatment-packages, cleansing, treatment-in-kerala, hospital-kerala |
| patient-villa-maharaja.jpg | hero + gallery (dual) | behandlung-in-kerala hero, treatment-packages gallery |
| hospital-campus.jpg | hero + gallery (dual) | hospital-kerala hero, kairali-brand hero, treatment-in-kerala gallery |
| treatment-context.jpg | hero (near-square) | ayurveda-treatment-south-india |
| dr-deepu-john.png | circular portrait | ALL 10 pages (physician row + hero doc-chip) |
| (weight-loss video) | 16:9 embed | weight-loss **(flagged)** |

Note `kairali-brand-header.jpg` and `physician-consult.png` exist in `public/images/` but are
referenced by NO current LP page — **do not shoot for these**; flag for cleanup.

## Rendered geometry (the dimension truth — from app/globals.css)

- **Hero slot** (`.lp-photo`, globals.css:93-97): renders **440 × 460 px**, near-square **≈0.96:1**,
  `object-fit: cover`, `object-position: TOP CENTER` (anchor the subject in the top-center — feet/
  floor get cropped), top corners rounded 16px. **Hidden below 900px — the hero never shows on
  mobile.** Deliver a 2× master ≥ **880 × 920 px** (portrait-ish), subject top-center.
- **Photo-band gallery tile** (`.photo-band`, globals.css:123-124): 3-up row, each **≈364 × 240 px**,
  **3:2 landscape**, `object-fit: cover`. Deliver a 2× master ≥ **728 × 480 px** landscape.
- **Dual-geometry files** (used as a hero on one page AND a gallery tile on others — abhyanga,
  grounds, panchakarma, villa-maharaja, hospital-campus): deliver **one high-res master ≥ 1600 px on
  the long edge that crops cleanly to BOTH** near-square-portrait (top-center safe) AND 3:2 landscape,
  OR deliver two separate crops. Please confirm which is easier.
- **Physician portrait** (`.physician-row img` 96×96 + `.doc-chip img` 52×52, both circular,
  `object-fit: cover`): supply a **square** headshot, face centered, ≥ **512 × 512 px** master.
- **Video** (`.video-embed`, globals.css:149-150): **16:9**, renders ≤ 760 × 428 px; a standard
  1920 × 1080 master is right. Currently a YouTube-nocookie embed, no local file.
- **OG / social-share** (metadata `ogImage`): **1200 × 630 px (1.91:1)**. Several pages reuse the
  hero as the OG image; where the hero is near-square it crops poorly to 1.91:1 — a dedicated
  1200×630 crop that stays legible at thumbnail size is preferable per flagged page.

Formats in use: `.jpg` / `.webp` for photos, `.png` for the portrait. No AVIF, no srcset — a single
high-quality file per asset is fine.

---

## PRIORITY 1 — doctor-flagged (Panchakarma + Weight Loss)

### A. `consultation-pulse.webp` — hero on Panchakarma AND Weight Loss (both flagged)
- **Slot:** near-square hero, 880×920 master, subject top-center. Also the OG image on both pages
  (supply a 1200×630 crop too).
- **7-part spec:** [A real KTAHV Ayurvedic physician performing *nadi pariksha* — pulse reading — on
  a seated patient during an in-person consultation] + [in an actual clean consultation room at the
  Palakkad hospital, calm and uncluttered, subtle Ayurvedic/clinical cues] + [Medium / waist-up
  shot, 85mm lens (flattering, natural)] + [Soft window light, gentle and even] + [Photorealistic,
  warm-but-clinical, documentary — a real doctor and patient, not a posed model].
- **Caption locked in code:** "Dr. Deepu John — Chief Physician, treatment planning & admission" —
  so **ideally Dr. Deepu John is the physician in frame**. Register: clearly doctor-led medicine,
  not a spa touch.

### B. `therapy-panchakarma.jpg` — Panchakarma gallery + Cleansing hero (dual geometry, flagged)
- **Slot:** dual — deliver a ≥1600px master that crops to both near-square hero and 3:2 gallery.
- **7-part spec:** [A trained therapist administering a genuine core Panchakarma procedure — e.g.
  Shirodhara (steady warm-oil stream to the forehead) or a supervised Basti setup — on a patient on
  a traditional wooden *Droni* table] + [in a real, hygienic KTAHV treatment room under clinical
  conditions] + [Medium shot, 35mm classic field of view] + [Soft, even softbox lighting, no harsh
  shadows] + [Photorealistic, clean clinical aesthetic]. One of the five folds (Vamana, Virechana,
  Basti, Nasya, Raktamokshana) — supervised hospital therapy, not decorative.

### C. `therapy-abhyanga.jpg` — Treatment-Packages hero + gallery on 5 pages (dual, flagged)
- **Slot:** dual master ≥1600px.
- **7-part spec:** [Two trained therapists performing synchronised four-hand *Abhyanga* — warm
  medicated-oil massage — on a patient lying on a wooden Droni table] + [in a clean, warm KTAHV
  therapy hall, professional and hygienic] + [Medium shot, 50mm] + [Soft window light + gentle fill]
  + [Photorealistic, organic and natural feel]. The classic *purvakarma* preparation — genuine
  Kerala Ayurvedic clinical therapy. Patient shown respectfully / non-identifiably.

### D. `healing-village-grounds.jpg` — Treatment-in-Kerala hero + gallery on 4 pages (dual, flagged)
- **Slot:** dual master ≥1600px.
- **7-part spec:** [The actual Kairali–The Ayurvedic Healing Village campus grounds — garden paths
  and greenery between the real treatment buildings] + [Palakkad, Kerala; tranquil, green, low-rise
  hospital-village architecture, no resort signage] + [Wide establishing shot, 35mm] + [Natural
  morning light, bright and optimistic] + [Photorealistic, documentary]. The real property — a calm,
  credible healing environment, **not** a generic tropical resort.

### E. `patient-villa-classic.jpg` — gallery on 5 pages incl. Weight Loss (flagged)
- **Slot:** 3:2 gallery, 728×480 master.
- **7-part spec:** [A tidy, inviting real patient villa — interior or exterior — set within the
  treatment gardens] + [clean and hospital-grade but restful, clearly in-patient recovery lodging]
  + [Wide/medium shot, 35mm] + [Soft natural daylight] + [Photorealistic, warm and inviting].
  Comfortable recovery room attached to a hospital stay — not a luxury suite.

### F. WEIGHT-LOSS VIDEO — patient-voices slot (doctor: "video in not available")
Two paths — the creative/marketing team picks one:

**Option 1 (fastest) — working-link request.** The slot currently embeds YouTube ID `JztT26hwdnA`,
which the doctor found unavailable (the dead embed was removed on the main build; the LP branch still
points at it). Please either (a) confirm a **real, consented** patient-testimonial video already
exists and give us its working YouTube/Vimeo URL, or (b) tell us none exists so we ship the page
without the video block (no invented testimonial).

**Option 2 — storyboard for a fresh, consent-cleared testimonial** (16:9, ~45–60s, 1920×1080):
- **Compliance lock:** the patient may describe the *experience* (routine, therapy, the supervised
  method) but **must NOT state any weight number or promise any outcome** — the page policy is "no
  numbers, outcomes differ from person to person." Written consent on file before any face is shown.
- **Scene 1 [0–8s]:** (Image 1) A real former patient, seated in a calm consultation/garden setting,
  begins speaking to camera. *Camera:* static medium shot, 85mm. *Lighting:* soft window light.
  *Style:* photorealistic documentary. **Audio:** patient's own voice, unscripted — "I came here
  because the diet cycle never held."
- **Scene 2 [8–24s]:** (Image 2) Cutaways of the supervised programme — a therapist beginning a
  therapy, the hospital kitchen plating a prescribed meal, a physician reviewing notes. *Camera:*
  gentle handheld, tracking. *Lighting:* natural daylight. **Audio:** patient VO continues over the
  cutaways, describing the *method* (assessment → supervised therapy → prescribed diet → review) —
  **no numbers.**
- **Scene 3 [24–45s]:** (Image 1 again) Back to the patient, closing. *Camera:* slow push-in.
  **Audio:** "What changed was the routine, not a promise." End on the KTAHV wordmark card.
- **Register:** clinical, honest, dignified — a hospital programme, not a before/after ad.

---

## PRIORITY 2 — blanket note ("reconsider the photos in all pages")

### G. `therapy-pain-management.jpg` — Pain-Management hero (+ OG)
- **Slot:** near-square hero 880×920 + 1200×630 OG crop.
- **7-part spec:** [A therapist performing a warm-oil pain therapy — *Pizhichil* (continuous warm
  medicated-oil pouring with massage) or *Kizhi* (herbal poultice)] + [in a real KTAHV hospital
  treatment room] + [Close/medium shot, 50mm] + [Warm soft light, oil sheen visible] + [Photorealistic,
  clean clinical]. Physician-scheduled hospital therapy, dignified.

### H. `patient-villa-maharaja.jpg` — Behandlung hero + Treatment-Packages gallery (dual)
- **Slot:** dual master ≥1600px.
- **7-part spec:** [A real Maharaja-category patient villa exterior nestled among the treatment-garden
  trees] + [Palakkad campus, quiet, green, same season/lighting as the Classic villa so the set is
  consistent] + [Wide shot, 35mm] + [Soft natural daylight] + [Photorealistic, warm]. Premium
  in-patient accommodation — comfortable, still clinical-hospital, not a resort villa.

### I. `hospital-campus.jpg` — Hospital-Kerala + Kairali-Brand hero + Treatment-in-Kerala gallery (dual)
- **Slot:** dual master ≥1600px (+ 1200×630 OG crop).
- **7-part spec:** [A wide establishing shot of the actual Kairali campus — NABH-accredited Ayurvedic
  hospital buildings genuinely set among Kerala gardens] + [Palakkad; recognisable Kerala-vernacular
  architecture, credible hospital scale, no promotional text] + [Wide/drone or high-angle
  establishing shot, 24–35mm] + [Natural morning light] + [Photorealistic, documentary]. Reads as an
  accredited hospital-in-gardens, legible even cropped to a social card.

### J. `treatment-context.jpg` — Ayurveda-Treatment-South-India hero (+ OG)
- **Slot:** near-square hero 880×920 + 1200×630 OG.
- **7-part spec:** [A patient villa set within the treatment gardens, warm and green] + [the real
  Palakkad campus, tranquil Kerala landscape, hospital context] + [Wide establishing shot, 35mm] +
  [Warm natural daylight] + [Photorealistic, documentary]. Clean campus framing, no offers/text.

### K. `dr-deepu-john.png` — physician portrait, ALL 10 pages (real person — supply, don't shoot to spec)
- **Slot:** square circular, ≥512×512 master (renders 96px + 52px).
- **Ask:** a **current, high-resolution professional headshot of Dr. Deepu John, Chief Physician** —
  clinical attire (white coat / consulting-room), clean neutral background, direct and trustworthy.
  This is a real named doctor whose name+title+photo appear on all ten pages (he confirmed he is
  comfortable with that). If other named planning physicians should also appear in the physician row,
  please supply their headshots in the **same** framing/lighting/background so the row reads as one
  clinical team. **Do not** generate or substitute a stock doctor.

### Also verify
- **Panchakarma video** (`CcDPOeSR67E`, not doctor-flagged but same dead-embed risk): confirm the
  URL still resolves, or supply a replacement / tell us to drop the block.
- **Dead assets** to ignore/clean up: `kairali-brand-header.jpg`, `physician-consult.png` (referenced
  by no LP page).

---

## Build status while we wait
Per HARD GATE 6 + the missing-asset protocol, the LP build proceeds with the **current placeholder
photos flagged** — this request is the escalation, not a build blocker. The pages do not go live on
these images: Dr. Deepu John's clinical sign-off (HARD GATE 7) and the owner's go-live word both
gate publication, and the photos are part of what he is signing off. When new assets arrive, each
swap is a mechanical PR that re-runs the Phase-5 battery (beauty + go-science + design Gate-2) on the
rendered page.
