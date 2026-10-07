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
  "team-akhila-oommen": photo("team-akhila-oommen", "team-akhila-oommen.jpg", 1023, 1537, "Dr. Akhila Oommen, Ayurvedic physician at the Healing Village"),
  "team-ashikha-raj": photo("team-ashikha-raj", "team-ashikha-raj.jpg", 948, 1660, "Dr. Ashikha Raj, Ayurvedic physician at the Healing Village"),
  // 4:5 head-and-torso crops of the three full-length portraits above (Task 19: the doctor must read as a real,
  // recognizable person at card and avatar size). Cropped with sharp at 70% of the source width, face ~20% from
  // the top; the full-length originals stay in the registry.
  "team-deepu-john-portrait": photo("team-deepu-john-portrait", "team-deepu-john-portrait.jpg", 717, 896, "Dr. Deepu John, Chief Physician at the Healing Village"),
  "team-akhila-oommen-portrait": photo("team-akhila-oommen-portrait", "team-akhila-oommen-portrait.jpg", 716, 895, "Dr. Akhila Oommen, Ayurvedic physician at the Healing Village"),
  "team-ashikha-raj-portrait": photo("team-ashikha-raj-portrait", "team-ashikha-raj-portrait.jpg", 664, 830, "Dr. Ashikha Raj, Ayurvedic physician at the Healing Village"),
  // The current consented physician roster's own portraits (consent-backed staff facts published 28 Sep 2026): the
  // files the physician section of the live ad routes shows (test/landing-current-physicians.test.mjs checks they
  // exist). Served from the site's own assets, unchanged.
  "team-rahul-r": staff("team-rahul-r", "team-rahul-r-c.webp", 943, 1421, "Dr. Rahul R, Ayurvedic physician at the Healing Village"),
  "team-adhina-ub": staff("team-adhina-ub", "team-adhina-ub.webp", 600, 900, "Dr. Adhina U.B., Resident Medical Officer at the Healing Village"),
  "team-aashitha-ps": staff("team-aashitha-ps", "team-aashitha-ps.webp", 600, 900, "Dr. Aashitha P.S., Ayurvedic physician at the Healing Village"),
};
