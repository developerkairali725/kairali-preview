import type { ImageRef } from "../kit/types.ts";

const P = "/lp-v2/img/";
const photo = (id: string, file: string, width: number, height: number, alt: string, o: Partial<ImageRef> = {}): ImageRef => ({
  id, src: P + file, width, height, alt, decorative: false, gccSafe: true,
  location: "palakkad", consent: "confirmed", ...o,
});
/** A photograph from the site's own asset folder (public/ahv/assets/img), used as published. */
const staff = (id: string, file: string, width: number, height: number, alt: string): ImageRef => ({
  ...photo(id, file, width, height, alt), src: `/ahv/assets/img/${file}`,
});

export const IMAGES: Record<string, ImageRef> = {
  // AHV-WB.001/027/053/078.change: rest-section grounds photo, reused unchanged from /photo-gallery/.
  // AHV-IMG-016 owner batch 1, 28 Sep 2026; Palakkad archive -127.jpg. The owner's "current is Delhi"
  // note refers to the replaced HO doorway, not this approved cottage/garden photograph. Reuse adopted 14 Oct.
  // Published file SHA-256: 52bb11bb871ff8b2a9e325149e79a010df5f7023294c15ee905a5621be1e49b2.
  "ahv-img-016": {
    id: "ahv-img-016", src: "/ahv/assets/img/owner-approved-20260928/ahv-img-016.webp",
    width: 1600, height: 1067, alt: "Cottage, garden path and water channel among palms at the Healing Village in Palakkad",
    decorative: false, gccSafe: true, location: "palakkad", consent: "not-applicable",
  },
  "kt-199": photo("kt-199", "kt-199.jpg", 1600, 1067, "Two therapists performing four-hand Abhyangam with warm medicated oil", { gccSafe: false }),
  "kt-190": photo("kt-190", "kt-190.jpg", 1067, 1600, "A therapist preparing a patient for Shiro Abhyangam, a head therapy with warm oil", { gccSafe: false }),
  "gal-post-therapy-stillness-wakem": photo("gal-post-therapy-stillness-wakem", "gal-post-therapy-stillness-wakem.jpg", 1400, 1120, "", { decorative: true, gccSafe: false }),
  "kt-202": photo("kt-202", "kt-202.jpg", 1600, 1067, "Medicated oil poured from a brass vessel during Shirodhara preparation"),
  "kt-116": photo("kt-116", "kt-116.jpg", 1600, 1067, "Octagonal villa interior under a terracotta dome at the Healing Village"),
  "kt-314": photo("kt-314", "kt-314.jpg", 1600, 1067, "Brick cottage among palms and gardens at the Healing Village"),
  "wx-hero": photo("wx-hero", "wx-hero.jpg", 1900, 1267, "Morning mist over the cottages and garden paths at the Healing Village"),
  "wx-dining": photo("wx-dining", "wx-dining.jpg", 1600, 1067, "The dining hall with garden views, where prescribed meals are served"),
  "gal-poolside-rest-palakkad-2026": photo("gal-poolside-rest-palakkad-2026", "gal-poolside-rest-palakkad-2026.jpg", 1600, 1067, "A patient resting on a lounger beside the pool in the village gardens", { gccSafe: false }),
  "team-deepu-john": photo("team-deepu-john", "team-deepu-john.jpg", 1024, 1536, "Dr. Deepu John, Chief Physician at the Healing Village"),
  // Dr. Akhila Oommen: her own garden portrait, the site's published file. Owner, 23 Sep 2026 ("homepage akhila
  // oommen photo is of ashika — change it"; tools/repair-physician-roster.mjs step 4): the kit's former
  // team-akhila-oommen.jpg / -portrait.jpg showed another person, so BOTH Akhila keys point here and those two
  // lp-v2 files are no longer referenced. Framing for the production cards is in data/doctors.ts (frame).
  "team-akhila-oommen": staff("team-akhila-oommen", "team-akhila-oommen-2.webp", 600, 1051, "Dr. Akhila Oommen, Ayurvedic physician at the Healing Village"),
  "team-ashikha-raj": photo("team-ashikha-raj", "team-ashikha-raj.jpg", 948, 1660, "Dr. Ashikha Raj, Ayurvedic physician at the Healing Village"),
  // 4:5 head-and-torso crops of the full-length portraits above (Task 19: the doctor must read as a real,
  // recognizable person at card and avatar size). Cropped with sharp at 70% of the source width, face ~20% from
  // the top; the full-length originals stay in the registry. Akhila's key is an alias of her published portrait
  // (above), not a crop.
  "team-deepu-john-portrait": photo("team-deepu-john-portrait", "team-deepu-john-portrait.jpg", 717, 896, "Dr. Deepu John, Chief Physician at the Healing Village"),
  "team-akhila-oommen-portrait": staff("team-akhila-oommen-portrait", "team-akhila-oommen-2.webp", 600, 1051, "Dr. Akhila Oommen, Ayurvedic physician at the Healing Village"),
  "team-ashikha-raj-portrait": photo("team-ashikha-raj-portrait", "team-ashikha-raj-portrait.jpg", 664, 830, "Dr. Ashikha Raj, Ayurvedic physician at the Healing Village"),
  // The current consented physician roster's own portraits (consent-backed staff facts published 28 Sep 2026): the
  // files the physician section of the live ad routes shows (test/landing-current-physicians.test.mjs checks they
  // exist). Served from the site's own assets, unchanged.
  "team-rahul-r": staff("team-rahul-r", "team-rahul-r-c.webp", 943, 1421, "Dr. Rahul R, Ayurvedic physician at the Healing Village"),
  "team-adhina-ub": staff("team-adhina-ub", "team-adhina-ub.webp", 600, 900, "Dr. Adhina U.B., Resident Medical Officer at the Healing Village"),
  "team-aashitha-ps": staff("team-aashitha-ps", "team-aashitha-ps.webp", 600, 900, "Dr. Aashitha P.S., Ayurvedic physician at the Healing Village"),
  // Owner decision 10 (14 Oct 2026, OWNER-DECISIONS-20261014-ANSWERS.json "10-photos"): doctor-consultation, pulse-check
  // and village photographs picked from the existing image bank (Palakkad, ahv-edited) to replace bare-back therapy hero
  // and "How it works" photographs (production/bindings.ts PHOTO_PICKS_20261014). No identifiable person in any of them.
  // ahv-img-005 / -045: built by tools/build-owner-decision-20261014-photos.py from the SHA-256-verified library
  // originals (-111.jpg, -348.jpg); ahv-img-010 / -012: the owner-approved batch-1 files (28 Sep 2026), unchanged.
  "ahv-img-005": {
    id: "ahv-img-005", src: "/ahv/assets/img/owner-decision-20261014/ahv-img-005.webp",
    width: 1600, height: 1067, alt: "Physician consultation room with a curved wooden desk and round windows at Kairali in Palakkad",
    decorative: false, gccSafe: true, location: "palakkad", consent: "not-applicable",
  },
  "ahv-img-045": {
    id: "ahv-img-045", src: "/ahv/assets/img/owner-decision-20261014/ahv-img-045.webp",
    width: 1600, height: 1067, alt: "A physician's fingers on a patient's wrist for an Ayurvedic pulse examination at a wooden desk",
    // Hands and forearms only; faces are not shown (IMAGE_CATALOG register_ok=yes).
    decorative: false, gccSafe: true, location: "palakkad", consent: "not-applicable",
  },
  "ahv-img-010": {
    id: "ahv-img-010", src: "/ahv/assets/img/owner-approved-20260928/ahv-img-010.webp",
    width: 1600, height: 1067, alt: "Curved veranda of the main block overlooking lawns, a water channel and a colonnaded pavilion",
    decorative: false, gccSafe: true, location: "palakkad", consent: "not-applicable",
  },
  "ahv-img-012": {
    id: "ahv-img-012", src: "/ahv/assets/img/owner-approved-20260928/ahv-img-012.webp",
    width: 1600, height: 1067, alt: "Circular open veranda with cane chairs under a striped terracotta dome, looking out to the gardens",
    decorative: false, gccSafe: true, location: "palakkad", consent: "not-applicable",
  },
};
