import type { DoctorRef } from "../kit/types.ts";
import { IMAGES } from "./images.ts";
import { pending } from "../kit/pending.ts";

// The current consented physician roster (consent-backed staff facts published 28 Sep 2026; the physician section of
// the live ad routes, test/landing-current-physicians.test.mjs). Every fact is word for word from the approved
// source and the reviewed copy of 8 Oct 2026 (owner-correction/*.md): name, role, BAMS, the "since" years and
// languages. Years in practice are not stated by the source, so they are omitted, never derived from a joining year.
//
// `frame` places each portrait in the production cards' 4:5 frame (production/sections/Physicians.tsx): the five
// photographs are framed differently (full-length to head-and-shoulders), so each is positioned and enlarged until
// the faces read at a similar size and height. Display only; the photographs are not edited.
//
// ashikha-raj is not on the current roster (the roster test forbids her on the live routes): preview pilot only,
// still pending (C4), never on a production route.
export const DOCTORS: Record<string, DoctorRef> = {
  "deepu-john": {
    id: "deepu-john", name: "Dr. Deepu John", role: "Chief Physician & Head of Department", qualification: "BAMS",
    tenure: "Practising Ayurveda since 2010 · At Kairali since 2019",
    focus: "Panchakarma and lifestyle management",
    languages: ["Malayalam", "English", "Hindi", "Tamil"], photo: IMAGES["team-deepu-john-portrait"],
    frame: { position: "50% 50%", origin: "50% 0%", zoom: 1.27 },
  },
  "rahul-r": {
    id: "rahul-r", name: "Dr. Rahul R", role: "Ayurvedic Physician", qualification: "BAMS",
    tenure: "At Kairali since 2023",
    languages: ["English", "Malayalam", "Tamil"], photo: IMAGES["team-rahul-r"],
    frame: { position: "50% 0%", origin: "51% 16.5%", zoom: 1.95 },
  },
  "akhila-oommen": {
    id: "akhila-oommen", name: "Dr. Akhila Oommen", role: "Ayurvedic Physician", qualification: "BAMS",
    tenure: "At Kairali since 2024",
    // Her own full-length garden portrait (600×1051, data/images.ts): top-aligned, enlarged about her face so it
    // reads at the size and eye height of the other cards, cropped head to chest above the folded arms.
    languages: ["Malayalam", "Hindi", "English"], photo: IMAGES["team-akhila-oommen-portrait"],
    frame: { position: "50% 0%", origin: "55% 16.5%", zoom: 1.7 },
  },
  "adhina-ub": {
    id: "adhina-ub", name: "Dr. Adhina U.B.", role: "Resident Medical Officer", qualification: "BAMS",
    tenure: "At Kairali since 2026",
    languages: ["English", "Malayalam"], photo: IMAGES["team-adhina-ub"],
    frame: { position: "50% 50%", origin: "50% 50%", zoom: 1 },
  },
  "aashitha-ps": {
    id: "aashitha-ps", name: "Dr. Aashitha P.S.", role: "Ayurvedic Physician", qualification: "BAMS",
    tenure: "At Kairali since 2026",
    languages: ["Malayalam", "English", "Hindi", "Tamil"], photo: IMAGES["team-aashitha-ps"],
    frame: { position: "50% 25%", origin: "50% 25%", zoom: 1 },
  },
  "ashikha-raj": {
    id: "ashikha-raj", name: "Dr. Ashikha Raj", role: pending("C4", "role"),
    qualification: pending("C4", "qualification"), yearsInPractice: pending("C4", "years"),
    languages: pending("C4", "languages"), photo: IMAGES["team-ashikha-raj-portrait"],
  },
};

/** The current consented physician roster, in the order the reviewed copy introduces them. */
export const CURRENT_ROSTER: readonly string[] = ["deepu-john", "rahul-r", "akhila-oommen", "adhina-ub", "aashitha-ps"];
