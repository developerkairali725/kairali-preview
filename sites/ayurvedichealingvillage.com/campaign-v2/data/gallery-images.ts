// Approved photographs added to the full gallery of live ad routes (owner decision: add suitable
// approved villa/bathroom/consultation/therapy/yoga/dining/grounds photographs, keep the gallery design, truthful
// counts). Each is an image the site already publishes, at its published URL and size, with concise accurate alt text (english-candidate/
// galleries-2026.json, D-20260922-31); nothing is re-cropped or newly copied. Only photographs whose owner approval
// is on record, whose file is tracked in git (CI and the existing public/ check see it), whose accessible description passes
// the kit's alt lint, and either contain no identifiable person or have exact owner consent. Activation is in production/bindings.ts
// (the first four routes, then the twelve in APPROVED_GALLERY_ROUTES).
//
// Erasable TypeScript only (node --test imports this file).

import type { GalleryCategory, ImageRef } from "../kit/types.ts";

export type GalleryProvenance = {
  /** The published gallery manifest and the entry this image is in, verbatim. */
  manifest: "english-candidate/galleries-2026.json" | "public/ahv/assets/enquiry-family-data.js" | "english-candidate/prerender/deluxe-villa.html";
  /** Full published caption when the gallery uses a concise accessible description. */
  publishedAlt?: string;
  manifestRoute: string;
  manifestChapter: string;
  /** The owner's recorded decision on this image. */
  ownerDecision: { id: string; decision: "yes"; recorded: string; record: string };
  /** The library original the published file was made from, and its SHA-256 (as the owner decision records it). */
  libraryPath?: string;
  librarySha256?: string;
  /** HTML display attributes, when the legacy page scales an unchanged source image. */
  publishedSize?: { width: number; height: number };
  /** SHA-256 of the exact published file at the time it was added here. */
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
  {
    "category": "Therapies",
    "image": {
      "id": "ahv-img-017",
      "src": "/ahv/assets/img/owner-approved-20260928/ahv-img-017.webp",
      "width": 1600,
      "height": 1067,
      "alt": "Traditional wooden therapy table and brass oil vessel in the Palakkad treatment room",
      "decorative": false,
      "gccSafe": true,
      "location": "palakkad",
      "consent": "not-applicable"
    },
    "provenance": {
      "manifest": "english-candidate/galleries-2026.json",
      "manifestRoute": "/property-gallery/",
      "manifestChapter": "block",
      "publishedAlt": "Traditional treatment room with a carved single-piece wooden therapy table (dhroni); brass oil vessel suspended on a swing arm; arched brick windows with bamboo blinds.",
      "ownerDecision": {
        "id": "AHV-IMG-017",
        "decision": "yes",
        "recorded": "2026-09-28T06:48:12.268Z",
        "record": "deliverables/WOPS-AHV-FINAL-DRAFT-20260924-001/english-feedback-20260926/image-approval-review/owner-decisions-batch-01-20260928.json"
      },
      "libraryPath": "ahv-edited/kAIRALI PALAK KAD_DEPICTIONS BY PRACHI KHASGIWALA-106.jpg",
      "librarySha256": "05687031bb0c46959958d4874f2d5466f7765088c733edccce4453df22865f92",
      "publishedSha256": "c48b085d8bda87d9c0fb3da6593de3bb29f8daeb398ee9b1c6c4c7490058162f",
      "people": "No identifiable patient or staff member; room and equipment only."
    }
  },
  {
    "category": "Therapies",
    "image": {
      "id": "ahv-img-033",
      "src": "/ahv/assets/img/owner-approved-20260928/ahv-img-033-banner.webp",
      "width": 1600,
      "height": 510,
      "alt": "Consultation room with examination couch and exposed brick walls at Kairali in Palakkad",
      "decorative": false,
      "gccSafe": true,
      "location": "palakkad",
      "consent": "not-applicable"
    },
    "provenance": {
      "manifest": "public/ahv/assets/enquiry-family-data.js",
      "manifestRoute": "/walk-in-ayurveda-treatment/",
      "manifestChapter": "heroImage",
      "publishedAlt": "Examination corner of the consultation room with wooden examination couch; sphygmomanometer and stethoscope on desk; wall clock; founder portraits on brick wall.",
      "ownerDecision": {
        "id": "AHV-IMG-033",
        "decision": "yes",
        "recorded": "2026-09-28T07:06:38.744Z",
        "record": "deliverables/WOPS-AHV-FINAL-DRAFT-20260924-001/english-feedback-20260926/image-approval-review/owner-decisions-batch-02-20260928.json"
      },
      "libraryPath": "ahv-edited/kAIRALI PALAK KAD_DEPICTIONS BY PRACHI KHASGIWALA-112.jpg",
      "librarySha256": "ff998584faf4ee5c78d562d737775e0fd77429af822b5a38acd61bbf0145c9c3",
      "publishedSha256": "332cc70a887dd0a5ca505be84dbd06fb02544fccbd163eeac5fb9efa36757b96",
      "people": "No identifiable patient or staff member; room and equipment only; existing founder portraits on the wall."
    }
  },
  {
    "category": "Villas",
    "image": {
      "id": "ahv-deluxe-bathroom",
      "src": "/ahv/assets/img/AHV-Deluxe-G01.webp",
      "width": 1200,
      "height": 857,
      "alt": "Deluxe Villa bathroom with glass shower and basin",
      "decorative": false,
      "gccSafe": true,
      "location": "palakkad",
      "consent": "not-applicable"
    },
    "provenance": {
      "manifest": "english-candidate/prerender/deluxe-villa.html",
      "manifestRoute": "/deluxe-villa/",
      "manifestChapter": "69",
      "ownerDecision": {
        "id": "DEC-GALLERY-ASSETS",
        "decision": "yes",
        "recorded": "2026-10-10; exact timestamp not supplied",
        "record": "deliverables/WOPS-AHV-CHANGE-TRACKER-20261010-001/AHV-change-tracker.json#owner_decision_groups/DEC-GALLERY-ASSETS"
      },
      "publishedSize": {
        "width": 1400,
        "height": 1000
      },
      "publishedSha256": "1090f286085171335c5a5b532a0b02f7ed9663aa8c31df36b16332ec33cf7e18",
      "people": "No identifiable person; empty bathroom with glass shower, basin and mirror."
    }
  },
  {
    category: "Yoga",
    image: {
      id: "ahv-yoga-hall-consented-20261014",
      src: "/ahv/assets/img/gallery-2026/photo/yoga-large-hall-exposed-03.webp",
      width: 1600, height: 1067,
      alt: "Two people practising yoga in a spacious hall with an exposed timber roof at Kairali in Palakkad",
      decorative: false, gccSafe: true, location: "palakkad", consent: "confirmed",
    },
    provenance: {
      manifest: "english-candidate/galleries-2026.json",
      manifestRoute: "/yoga-gallery/",
      manifestChapter: "hall",
      publishedAlt: "Large yoga hall with exposed timber trussed roof and clerestory glazing",
      ownerDecision: {
        id: "AHV-YOGA-CONSENT-20261014",
        decision: "yes",
        recorded: "2026-10-14; exact owner-message timestamp not supplied",
        record: "deliverables/WOPS-WEBSITE-SEQUENTIAL-20261008-001/recovery-20261014/yoga-gallery-consent/CONSENT-BINDING.json",
      },
      libraryPath: "ahv-edited/kAIRALI PALAK KAD_DEPICTIONS BY PRACHI KHASGIWALA-138.jpg",
      publishedSha256: "5ea375faff82fcf26adddda817e81eced1f4a4f3eb0dcbd45f64630c319a5a81",
      people: "Two people practising yoga; direct owner consent bound to this exact photograph and nineteen campaign galleries. No identity or clinical status asserted.",
    },
  },
];

/** The gallery entries appended, in order, after a route's existing gallery. */
export const APPROVED_GALLERY_ADDITIONS: { category: GalleryCategory; image: ImageRef }[] =
  APPROVED_GALLERY_IMAGES.map(({ category, image }) => ({ category, image }));
