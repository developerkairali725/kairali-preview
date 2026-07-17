# kairaliyoga.com — image manifest

All photography is REAL (register E: HF-AMB + REAL people; no stock, no AI
people). Source: `~/Claude/Kairali-Digital/image-library/ahv-edited/` (the
KTAHV campus shoot, "kAIRALI PALAK KAD_DEPICTIONS BY PRACHI KHASGIWALA"
series), selected from `docs/media/IMAGE_CATALOG.csv`. Catalog `register_ok`
= yes for every file used. The hero replaces the design brief's HF-AMB dawn
video (no usable video asset exists tonight) — flagged as a beauty-pass
upgrade in the build brief.

**it.2 optimization pass (2026-07-16, design review finding 2):** every
photo regenerated from the 8192px originals via `sips -Z <w> -s format jpeg
-s formatOptions <q>` into a srcset ladder — 640/800(/1024/1280) rungs plus
the 1600-max master — with per-file quality tuned to the mobile byte budget
(375 first-load image transfer ≤1.2MB; hero ≤220KB at mobile width). All
below-fold images `loading="lazy"`; hero eager `fetchPriority=high` with
`sizes="100vw"`. A 2560w hero rung for DPR-2 desktops (review micro 6b) was
probed and REJECTED: the dawn foliage scene costs ~1MB even at q55 — the
retina-desktop upgrade waits for the HF-AMB video beauty pass.

| File (master + rungs) | Catalog source (…KHASGIWALA-N.jpg) | Catalog description (abridged) | Use on page | Alt text honesty |
|---|---|---|---|---|
| public/images/ktahv-round-stone-cottages-dawn.jpg (+640/800/1280) | -13 (pro, yes) | Round stone patient cottages amid coconut palms; curving footpath and water channel at dawn | Hero (full-bleed, eager, 400ms fade) | Cottages/palms/footpath/water channel at dawn — no people implied |
| public/images/ktahv-yoga-cobra-instructor-adjustment.jpg (+640/800) | -224 (pro, yes) | Instructor adjusting a practitioner in cobra posture in the yoga hall | Day timeline — sunrise practice | Instructor + practitioner, cobra posture, yoga hall |
| public/images/ktahv-physician-consultation-room.jpg (+640/800/1024) | -111 (pro, yes) | Physician consultation room with curved wooden desk; stools and chairs; round frosted windows; founder portraits on brick wall | Day timeline — the physician's check-in (it.2: honest re-pick, review finding 3) | Consultation room, desk, windows, portraits — no people implied |
| public/images/ktahv-therapist-carrying-dhara-pot-sunrise.jpg (+640/800/1024) | -166 (pro, yes) | Therapist carrying brass bowl and hanging dhara pot along a verandah at sunrise | Day timeline — one therapy, every day (it.2: moved to the therapy stop, review finding 3) | Therapist with dhara pot on a verandah in early light |
| public/images/ahv-food-idiyappam-veg-stew.jpg (+640/800/1024) | -294 (pro, yes) | Idiyappam on banana leaf with vegetable stew | Day timeline — the Ayurvedic table (it.2: the meals stop now exists; the manifest's original assignment is finally literal) | Idiyappam + vegetable stew, curry leaves |
| public/images/ktahv-meditation-seated-chin-mudra.jpg (+640/800) | -223 (pro, yes) | Practitioner seated in meditation with chin mudra on a mat | Day timeline — evening mindfulness | Seated meditation, chin mudra, yoga hall |
| public/images/ktahv-organic-farm-rice-transplanting.jpg (+640/800/1024) | -171 (pro, yes) | Farm workers transplanting rice seedlings in a flooded paddy | Day timeline — weekly farm/village layer | Workers transplanting rice, misty palms |
| public/images/ktahv-grounds-water-channel-cottages.jpg (+640/800) | -101 (pro, yes) | Water channel over stones, palms, lawns, brick cottages | What-to-expect figure | Grounds: channel, palms, cottages |
| public/images/ktahv-yoga-namaste-greeting-instructor.jpg (+640/800/1024) | -222 (pro, yes) | Practitioner and senior instructor in namaste greeting in the yoga hall | Teachers section figure | Instructor + practitioner namaste, yoga hall |
| public/images/kairali-icon.svg | image-library/brand-assets (via sites/arogyashala.in) | Kairali icon mark (vector) | Wordmark + favicon source | group asset |
| public/logo.png | rasterized from kairali-icon.svg at 512px (qlmanage; the icon mark, never a recreated logo — ch.02) | Kairali icon mark, 512×512 PNG | JSON-LD Organization `logo` (it.2, SEO audit WARN) | group asset |
| public/og.jpg | derived | 1200×630 OG card shot from the served hero (consent pre-seeded) | og:image / WhatsApp shares | derivative of -13 |

Catalog rows -222/-223/-224 describe the subjects as "patient and
instructor" — the campus-shoot models photographed in the KTAHV yoga hall.
Alt texts say "practitioner", which is honest for the yoga surface and
implies no clinical status.
