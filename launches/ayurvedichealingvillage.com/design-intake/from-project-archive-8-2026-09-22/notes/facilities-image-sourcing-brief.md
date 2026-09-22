# Image acquisition — facilities / things-to-do / experience
Companion to `01-HANDOVER.md` §1. Written 21 Sep 2026.
Follows the precedent in the project's `GPT Image Prompts.dc.html`: some assets are **generated**, some are **sourced, never generated**. That split matters more here than on the home page.

---

## The governing rule

These pages describe a **real, NABH-accredited hospital-retreat**. Nine of the fourteen images name a specific physical place on the property — "Swimming Pool", "Amphitheatre", "Tennis Court", "Conference Hall", "Herbal Garden". A generated or stock photograph under one of those labels is not a placeholder; it is a false claim about the premises, and it is the kind of thing that gets an accredited hospital's marketing challenged.

**So: named facilities must be photographed or sourced. Never generated, never stock.**
Generation is available only for the handful of generic subjects, and only if route 1 and 2 both fail.

---

## Acquisition chain, in order. Stop at the first that works.

### 1. Download from the live server — PRIMARY, covers all 14
These are Kairali's own photographs, already live on their own domain. Nothing needs to be created.

```
BASE=https://ayurvedichealingvillage.com/wp-content/uploads
mkdir -p assets/img

curl -fL "$BASE/2023/11/our-story.png"     -o assets/img/AHV-Facilities-Landscape.png
for n in 1 2 3 4 5 6 7 8 9 10; do
  curl -fL "$BASE/2024/10/Village-$n.jpg"  -o "assets/img/AHV-Village-$(printf %02d $n).jpg"
done
curl -fL "$BASE/2024/11/9-13.jpg"          -o assets/img/AHV-ThingsToDo-01.jpg
curl -fL "$BASE/2024/11/kerala1.jpg"       -o assets/img/AHV-ThingsToDo-02.jpg
curl -fL "$BASE/2024/11/img0.jpg"          -o assets/img/AHV-ThingsToDo-03.jpg
```

Then: record each file's sha256 and natural dimensions into an import-hash log (see `data/family-04/attractions-import-hash-log.json` for the format the sibling family used). Expect byte hashes to differ from the frozen-source values through transport re-encoding — dimensions must match exactly. Do not upscale.

**This is the whole job.** Everything below is contingency.

### 2. Kairali-Image-Library — for any file route 1 cannot retrieve
`Kairali-Image-Library/ktahv/` holds 50 property photographs (`ktahv-nontherapy-01…50.jpg`, ~5.8MB each, 3648×5472). They are almost certainly the right subjects — grounds, pool, hall, gardens — but the filenames carry no subject information, so nobody can map them to labels without looking.

That mapping is a **human task, not a guess**. Build a contact sheet, have Abhilash label which frame is the amphitheatre, which is the tennis court, and so on, then crop to the aspect ratios the template sets. Do not assign them by inference.

Also check `Kairali-Image-Library/ktahv-shoot-2025/` — newer material, may already be captioned.

### 3. Generation — ONLY the subjects below, only if 1 and 2 fail
Per-image ruling. **DO NOT GENERATE** means exactly that.

| Image | Label | Ruling |
|---|---|---|
| our-story.png | hero band | Generate — generic establishing shot of the grounds |
| Village-1 | Ayurvedic Treatment | Generate — generic therapy scene |
| Village-2 | Fine Dining | Generate — generic dining room |
| Village-3 | Yoga & Meditation | Generate — generic hall interior |
| Village-4 | Herbal Garden | **DO NOT GENERATE** — a real, specific garden |
| Village-5 | Charm Science Experts | **DO NOT GENERATE** — label is unexplained; ask the owner what it depicts before anything |
| Village-6 | Beauty Therapy | Generate — generic treatment scene |
| Village-7 | Conference Hall | **DO NOT GENERATE** — a real, specific room |
| Village-8 | Swimming Pool | **DO NOT GENERATE** — a real, specific pool |
| Village-9 | Recreation & Business Centre | **DO NOT GENERATE** — a real, specific building |
| Village-10 | Amphitheatre | **DO NOT GENERATE** — a real, specific structure |
| 9-13.jpg | In Healing Village | Generate — generic grounds |
| kerala1.jpg | In Kerala | Generate — generic Kerala backwater/landscape |
| img0.jpg | Sight Seeing | Generate — generic Kerala landscape |

Five of ten facility images cannot be generated. That is why route 1 is not optional.

#### System block — paste before every image request, one image per request
Reuse the project's established block verbatim from `GPT Image Prompts.dc.html`, with this output line:

> Output: landscape 4:3, minimum 1600×1200px. Hero: 16:9, 2400×1350. Things-to-do cards: 16:10, minimum 1600×1000.

#### Prompts for the generatable subjects only

**AHV-Facilities-Landscape.png (16:9, 2400×1350)** — Cinematic wide establishing shot of the village at mid-morning: brick cottages with tiled roofs set among coconut palms, a stone-lined water channel running through cut lawns, low warm haze, no people, layered depth. 16:9.

**AHV-Village-01.jpg (4:3)** — A uniformed therapist's hands pouring warm herbal oil from a brass vessel onto a carved single-piece wooden therapy table (dhroni) in a treatment room; laterite brick wall and arched bamboo-blind window softly blurred behind; patient's shoulder only at frame edge, fully draped. No faces. 4:3.

**AHV-Village-02.jpg (4:3)** — The dining hall interior at lunch: long polished timber tables, banana-leaf place settings, brass water tumblers, terracotta-tiled ceiling, open arches to greenery on one side; warm daylight, unoccupied and immaculate. 4:3.

**AHV-Village-03.jpg (4:3)** — The yoga hall empty and prepared: exposed timber trussed roof, red-oxide floor, rolled cotton mats set in even rows, glass doors open to lawns on both sides, misty morning light streaming across the floor. No people. 4:3.

**AHV-Village-06.jpg (4:3)** — A therapist applying a herbal paste mask to a reclining female patient's face and forehead; only face and shoulders in frame, fully draped in cream kasavu; small brass bowls of paste and cotton pads on a wooden side table; soft window light. 4:3.

**AHV-ThingsToDo-01.jpg (16:10)** — Two guests in loose white cotton walking a stone-lined path between herbal plantation beds inside the village grounds, seen from behind at middle distance; coconut palms, morning haze, unhurried pace. 16:10.

**AHV-ThingsToDo-02.jpg (16:10)** — A traditional Kerala houseboat (kettuvallam) with a woven bamboo canopy moving slowly along a wide backwater channel lined with coconut palms; low golden light, still water, no people visible. 16:10.

**AHV-ThingsToDo-03.jpg (16:10)** — A misty layered view over the Western Ghats from a hill road in Palakkad district at dawn: tea and forest slopes receding into haze, no buildings, no people. 16:10.

### 4. Free stock — REJECTED for this family
Do not use. A stock swimming pool captioned "Swimming Pool" on a hospital's own facilities page is a misrepresentation of the premises. The only stock that would be defensible is generic Kerala landscape for the two things-to-do cards, and route 3 already covers those honestly.

---

## After the files land

1. Swap each keyed placeholder in `AHV Template Facilities and Things To Do Desktop.dc.html` for a real `<img>` — markup and per-slot aspect ratios in handover §1.
2. Carry the **verbatim source alt** from `source/IMAGE-MANIFEST.csv`. Four images have empty alt in source; author those with the owner (handover §4). Do not auto-generate.
3. If any image is generated rather than sourced, record it in the notes file as generated, with the prompt used. Generated imagery of a real medical facility must be traceable.
4. Re-run the done-bar.

---

## The /experience/ icon — separate, do not solve here
`2024/10/alcohol-free.png` is used on all 8 cards with empty alt. It is not a missing image, it is one image used eight times. Do not download it, do not generate eight variants, do not source eight icons. It needs the owner decision in handover §2 first: either 8 distinct photographs, or ratify the no-image numbered treatment already built.
