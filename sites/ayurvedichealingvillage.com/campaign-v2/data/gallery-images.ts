// Approved photographs added to the full gallery of the first four live ad routes (owner decision: add suitable
// approved villa/bathroom/consultation/therapy/yoga/dining/grounds photographs, keep the gallery design, truthful
// counts). Each is an image the site already publishes, at its published URL, size and alt (english-candidate/
// galleries-2026.json, D-20260922-31); nothing is re-cropped or newly copied. Only photographs whose owner approval
// is on record, whose file is tracked in git (CI and the existing public/ check see it), whose published alt passes
// the kit's alt lint verbatim, and in which no person can be identified. Activation is in production/bindings.ts
// (first four routes only).
//
// Erasable TypeScript only (node --test imports this file).

import type { GalleryCategory, ImageRef } from "../kit/types.ts";

export type GalleryProvenance = {
  /** The published gallery manifest and the entry this image is in, verbatim. */
  manifest: "english-candidate/galleries-2026.json";
  manifestRoute: string;
  manifestChapter: string;
  /** The owner's recorded decision on this image. */
  ownerDecision: { id: string; decision: "yes"; recorded: string; record: string };
  /** The library original the published file was made from, and its SHA-256 (as the owner decision records it). */
  libraryPath: string;
  librarySha256: string;
  /** SHA-256 of the published 1600w file at the time it was added here. */
  publishedSha256: string;
  /** What is in the frame, as checked against the published file (people, if any, and whether identifiable). */
  people: string;
};

export type ApprovedGalleryImage = { category: GalleryCategory; image: ImageRef; provenance: GalleryProvenance };

const OWNER_BATCH_1 = "deliverables/WOPS-AHV-FINAL-DRAFT-20260924-001/english-feedback-20260926/image-approval-review/owner-decisions-batch-01-20260928.json";

export const APPROVED_GALLERY_IMAGES: readonly ApprovedGalleryImage[] = [
  {
    category: "Grounds",
    image: {
      id: "ahv-img-011",
      src: "/ahv/assets/img/owner-approved-20260928/ahv-img-011.webp",
      width: 1600, height: 1067,
      alt: "White wooden footbridge with lattice railing leading to a gable-roofed building raised on stilts amid dense tropical trees.",
      decorative: false, gccSafe: true, location: "palakkad",
      // No identifiable person: only small, unclear figures behind the far window glass.
      consent: "not-applicable",
    },
    provenance: {
      manifest: "english-candidate/galleries-2026.json",
      manifestRoute: "/property-gallery/",
      manifestChapter: "arrival",
      ownerDecision: { id: "AHV-IMG-011", decision: "yes", recorded: "2026-09-28T06:47:46.002Z", record: OWNER_BATCH_1 },
      libraryPath: "ahv-edited/kAIRALI PALAK KAD_DEPICTIONS BY PRACHI KHASGIWALA-102.jpg",
      librarySha256: "14a7bad7d300111ed43290b6166d43103d4346c78bc3121dfba1ddf8ee6b4949",
      publishedSha256: "58b2d4fff4eb03a686ae0cb97b516c8b355c33ab3c8a8a8dd9ef45c73748a359",
      people: "No identifiable person; small, unclear seated figures behind the far window glass (not described by the published alt).",
    },
  },
];

/** The gallery entries appended, in order, after a route's existing gallery. */
export const APPROVED_GALLERY_ADDITIONS: { category: GalleryCategory; image: ImageRef }[] =
  APPROVED_GALLERY_IMAGES.map(({ category, image }) => ({ category, image }));
