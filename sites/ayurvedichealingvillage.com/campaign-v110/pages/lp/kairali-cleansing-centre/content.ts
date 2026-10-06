// Content for /lp/kairali-cleansing-centre/ — generated from the saved staging page
//   staging-pages/Kairali Cleansing Centre _ Ayurvedic Hospital in Kerala.html
// then corrected by hand. Every change from staging is logged in
// docs/changes/lp-kairali-cleansing-centre.md.

import type { LpContent } from "../../../components/lp/types";
import imgWxPathway from "../../../../public/campaign-v110/images/wx-pathway.jpg";
import imgTherapyAbhyanga from "../../../../public/campaign-v110/images/therapy-abhyanga.jpg";
import imgPatientVillaClassic from "../../../../public/campaign-v110/images/patient-villa-classic.jpg";
import imgDrDeepuJohn192 from "../../../../public/campaign-v110/images/dr-deepu-john-192.webp";
import imgTherapyPanchakarma from "../../../../public/campaign-v110/images/therapy-panchakarma.jpg";

const content: LpContent = {
  path: "/lp/kairali-cleansing-centre/",
  head: {"title": "Kairali Cleansing Centre | Ayurvedic Hospital in Kerala", "description": "Physician-planned cleansing programmes at Kairali's NABH-accredited Ayurvedic hospital in Palakkad — Panchakarma in scope, admission to discharge.", "keywords": ["ayurvedic hospital kerala", "ayurvedic cleansing centre", "panchakarma detox kerala", "kairali healing village"], "canonical": "https://ayurvedichealingvillage.com/lp/kairali-cleansing-centre/", "ogImage": "https://ayurvedichealingvillage.com/campaign-v110/images/therapy-panchakarma.jpg", "locale": "en_IN", "siteName": "Kairali — The Ayurvedic Healing Village"},
  jsonLd: {"@context": "https://schema.org", "@graph": [{"@type": "Organization", "@id": "https://ayurvedichealingvillage.com#org", "name": "Kairali Ayurvedic Group", "url": "https://www.kairali.com", "email": "info@kairali.com", "foundingDate": "1989", "description": "Founded in 1989 by K. V. Ramesh and Gita Ramesh.", "slogan": "health through ayurveda"}, {"@type": "MedicalClinic", "@id": "https://ayurvedichealingvillage.com#clinic", "name": "Kairali — The Ayurvedic Healing Village", "url": "https://ayurvedichealingvillage.com", "email": "info@kairali.com", "telephone": "+919555156156", "address": {"@type": "PostalAddress", "streetAddress": "Olassery P.O., Kodumbu", "addressLocality": "Palakkad", "addressRegion": "Kerala", "addressCountry": "IN"}, "medicalSpecialty": "Ayurveda", "parentOrganization": {"@id": "https://ayurvedichealingvillage.com#org"}}, {"@type": "WebSite", "@id": "https://ayurvedichealingvillage.com#website", "name": "Kairali — The Ayurvedic Healing Village", "url": "https://ayurvedichealingvillage.com/lp/kairali-cleansing-centre", "publisher": {"@id": "https://ayurvedichealingvillage.com#org"}, "inLanguage": "en"}]},
  hero: {
    overline: "NABH-accredited Ayurvedic hospital, Palakkad",
    h1: ["Kairali's cleansing centre — ", {"em": "Panchakarma as hospital medicine"}, ", not a menu."],
    sub: "Cleansing programmes prescribed by physicians and carried out under supervision: preparatory therapy, the indicated procedures, a hospital-kitchen diet, and proper discharge.",
    doctor: { image: { src: imgDrDeepuJohn192, alt: "Dr. Deepu John, Chief Physician at Kairali — The Ayurvedic Healing Village" }, name: "Dr. Deepu John", role: "Chief Physician — treatment planning & admission" },
    creds: [{"label": "NABH", "nabh": true, "detail": "accredited · AH-2024-0250"}, {"label": "Panchakarma", "detail": "in NABH-accredited scope"}, {"label": "Clinical Establishment", "detail": "permanent certificate · Kerala Act"}, {"label": "Physician-led", "detail": "treatment team"}],
    photo: { ...{ src: imgTherapyPanchakarma, alt: "A Panchakarma cleansing therapy underway at the Healing Village" }, caption: "Hospital treatment rooms", detail: "Cleansing procedures under supervision" },
  },
  sections: [
    {
      id: "how-cleansing-works-here",
      overline: "How cleansing works here",
      title: "Prepared, performed, closed out",
      blocks: [
        { type: "lead", runs: ["Classical cleansing is a sequence, not a session. Skipping the preparation or the wind-down is how cleansing programmes go wrong — so here the sequence is the law."] },
        { type: "steps", cards: [{"k": "Stage 1", "title": "Preparation", "text": "Internal and external oleation and warming therapies ready the body for the main procedures, on the physician's schedule."}, {"k": "Stage 2", "title": "The procedures", "text": "The indicated cleansing procedures from the classical five-fold set — only those your assessment calls for."}, {"k": "Stage 3", "title": "Rebuilding", "text": "Diet, rest and rejuvenation therapy close the programme, with discharge guidance for the weeks after."}] },
        { type: "photos", images: [{ src: imgWxPathway, alt: "Treatment gardens between the Healing Village's buildings, Palakkad" }, { src: imgTherapyAbhyanga, alt: "Preparatory oleation therapy in a hospital treatment room" }, { src: imgPatientVillaClassic, alt: "A quiet patient villa where patients rest between procedures" }] },
      ],
    },
    {
      id: "why-choose-kairali",
      variant: "proof",
      overline: "Why choose Kairali",
      title: "Care you can plan around",
      blocks: [
        { type: "proof", items: [{"title": "NABH accreditation", "text": "Certificate AH-2024-0250 · Panchakarma within accredited scope"}, {"title": "Clinical Establishment", "text": "Permanent certificate under the Kerala Act"}, {"title": "Physician-led", "text": "Every cleansing programme is prescribed, never self-selected"}, {"title": "Hospital kitchen", "text": "Programme diets prepared in-house"}] },
      ],
    },
    {
      id: "your-physicians",
      overline: "Your physicians",
      title: "Who prescribes the programme",
      blocks: [
        { type: "physician", image: { src: imgDrDeepuJohn192, alt: "Dr. Deepu John, Chief Physician" }, name: "Dr. Deepu John", role: "Chief Physician — treatment planning & admission" },
        { type: "physicianNote", text: "Every programme at the Healing Village begins with an in-person consultation. Your physician assesses your health status, plans the treatment schedule, and reviews it through your stay and at discharge." },
      ],
    },
  ],
  enquiry: {"overline": "Begin with a consultation", "title": "Ask about a cleansing programme", "lead": ["Tell us your situation and travel window. Patient services replies with options and current tariffs; the physician decides the programme with you at consultation."], "form": {"heading": "Ask about cleansing programmes", "intro": "Tell us how to reach you. Our patient care team can help you plan your visit."}, "aside": {"k": "What happens next", "paragraphs": [["Request a consultation and our patient care team will contact you about consultation options and the information your doctor may need before admission."], ["Prefer to talk now? Call ", {"a": "+91 9555 156 156", "href": "tel:+919555156156"}, {"br": true}, "International patients: ", {"a": "info@kairali.com", "href": "mailto:info@kairali.com"}]]}},
  whatsappText: "Hello, I would like to enquire about Kairali Cleansing Centre | Ayurvedic Hospital in Kerala (/lp/kairali-cleansing-centre/).",
};

export default content;
