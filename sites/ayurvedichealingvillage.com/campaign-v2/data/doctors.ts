import type { DoctorRef } from "../kit/types.ts";
import { IMAGES } from "./images.ts";
import { pending } from "../kit/pending.ts";

// Facts for deepu-john and akhila-oommen are the approved current source, word for word: the physician section of
// /ayurvedic-treatment-packages.html and /panchkarma-treatment.html (consent-backed staff facts published
// 28 Sep 2026; content evidence DOCTOR-DURATION-EVIDENCE.json, 7 Oct 2026). Years in practice are not stated by
// the source, so they are omitted, never derived from a joining year. ashikha-raj is not on the current source
// pages: preview pilot only, still pending (C4), never on a production route.
export const DOCTORS: Record<string, DoctorRef> = {
  "deepu-john": {
    id: "deepu-john", name: "Dr. Deepu John", role: "Chief Physician & Head of Department", qualification: "BAMS",
    tenure: "Practising Ayurveda since 2010 · At Kairali since 2019",
    focus: "Panchakarma and lifestyle management",
    languages: ["Malayalam", "English", "Hindi", "Tamil"], photo: IMAGES["team-deepu-john-portrait"],
  },
  "akhila-oommen": {
    id: "akhila-oommen", name: "Dr. Akhila Oommen", role: "Ayurvedic Physician", qualification: "BAMS",
    tenure: "At Kairali since 2024",
    languages: ["Malayalam", "Hindi", "English"], photo: IMAGES["team-akhila-oommen-portrait"],
  },
  "ashikha-raj": {
    id: "ashikha-raj", name: "Dr. Ashikha Raj", role: pending("C4", "role"),
    qualification: pending("C4", "qualification"), yearsInPractice: pending("C4", "years"),
    languages: pending("C4", "languages"), photo: IMAGES["team-ashikha-raj-portrait"],
  },
};
