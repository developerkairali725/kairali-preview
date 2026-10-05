// Content for /lp/pain-management/ — generated from the saved staging page
//   staging-pages/Ayurvedic Pain Management in Kerala _ Kairali KTAHV.html
// then corrected by hand. Every change from staging is logged in
// docs/changes/lp-pain-management.md.

import type { LpContent } from "../../../components/lp/types";
import imgDrDeepuJohn192 from "../../../../public/campaign-v110/images/dr-deepu-john-192.webp";
import imgTherapyPainManagement from "../../../../public/campaign-v110/images/therapy-pain-management.jpg";

const content: LpContent = {
  path: "/lp/pain-management/",
  head: {"title": "Ayurvedic Pain Management in Kerala | Kairali KTAHV", "description": "Physician-assessed Ayurvedic pain-management programmes at Kairali's NABH-accredited hospital in Kerala: therapy, diet and routine — planned, not promised.", "keywords": ["ayurvedic pain management kerala", "chronic pain ayurveda programme", "ayurvedic hospital palakkad"], "canonical": "https://ayurvedichealingvillage.com/lp/pain-management/", "ogImage": "https://ayurvedichealingvillage.com/campaign-v110/images/therapy-pain-management.jpg", "locale": "en_IN", "siteName": "Kairali — The Ayurvedic Healing Village"},
  jsonLd: {"@context": "https://schema.org", "@graph": [{"@type": "Organization", "@id": "https://ayurvedichealingvillage.com#org", "name": "Kairali Ayurvedic Group", "url": "https://www.kairali.com", "email": "info@kairali.com", "foundingDate": "1989", "description": "Founded in 1989 by K. V. Ramesh and Gita Ramesh.", "slogan": "health through ayurveda"}, {"@type": "MedicalClinic", "@id": "https://ayurvedichealingvillage.com#clinic", "name": "Kairali — The Ayurvedic Healing Village", "url": "https://ayurvedichealingvillage.com", "email": "info@kairali.com", "telephone": "+919555156156", "address": {"@type": "PostalAddress", "streetAddress": "Olassery P.O., Kodumbu", "addressLocality": "Palakkad", "addressRegion": "Kerala", "addressCountry": "IN"}, "medicalSpecialty": "Ayurveda", "parentOrganization": {"@id": "https://ayurvedichealingvillage.com#org"}}, {"@type": "WebSite", "@id": "https://ayurvedichealingvillage.com#website", "name": "Kairali — The Ayurvedic Healing Village", "url": "https://ayurvedichealingvillage.com/lp/pain-management", "publisher": {"@id": "https://ayurvedichealingvillage.com#org"}, "inLanguage": "en"}]},
  hero: {
    overline: "NABH-accredited Ayurvedic hospital, Palakkad",
    h1: ["Ayurvedic pain management in Kerala — ", {"em": "assessed first"}, ", then treated."],
    sub: "A physician examines you, reads your records, and only then builds the programme: supervised therapies, diet and daily routine, reviewed through your admission.",
    doctor: { image: { src: imgDrDeepuJohn192, alt: "Dr. Deepu John, Chief Physician at Kairali — The Ayurvedic Healing Village" }, name: "Dr. Deepu John", role: "Chief Physician — treatment planning & admission" },
    creds: [{"label": "NABH", "nabh": true, "detail": "accredited · AH-2024-0250"}, {"label": "Panchakarma", "detail": "in NABH-accredited scope"}, {"label": "Clinical Establishment", "detail": "permanent certificate · Kerala Act"}, {"label": "Physician-led", "detail": "treatment team"}],
    photo: { ...{ src: imgTherapyPainManagement, alt: "A therapist administering a warm-oil therapy at the Healing Village" }, caption: "Hospital treatment rooms", detail: "Therapy on a physician's schedule" },
  },
  sections: [
    {
      id: "the-approach",
      overline: "The approach",
      title: "Programme, not procedure",
      blocks: [
        { type: "lead", runs: ["Chronic discomfort rarely yields to one intervention. The programme treats it as a whole: therapy for the body, diet from the hospital kitchen, routine for the habits that feed the problem."] },
        { type: "steps", cards: [{"k": "Step 1", "title": "Assessment", "text": "In-person consultation with your records and imaging: the physician maps what hurts, what drives it, and what a programme can honestly aim at."}, {"k": "Step 2", "title": "The plan", "text": "Therapies, diet and routine set out day by day — and adjusted at physician reviews through your stay."}, {"k": "Step 3", "title": "Discharge & after", "text": "A home routine and follow-up guidance, so the programme's gains have somewhere to live after you leave."}] },
      ],
    },
    {
      id: "the-therapies",
      variant: "alt",
      overline: "The therapies",
      title: "What your plan may draw on",
      blocks: [
        { type: "steps", cards: [{"k": "Therapy", "title": "Abhyanga", "text": "Whole-body medicated-oil massage by trained therapists, scheduled as your plan indicates."}, {"k": "Therapy", "title": "Pizhichil", "text": "Continuous warm-oil pouring with massage — a classical therapy for musculoskeletal complaints."}, {"k": "Therapy", "title": "Kizhi", "text": "Warm herbal poultices applied over affected areas, prepared in the hospital's own pharmacy."}, {"k": "Therapy", "title": "Basti family", "text": "Localised oil-retention therapies (e.g. for the lower back or knees) where the assessment indicates them."}] },
      ],
    },
    {
      id: "why-choose-kairali",
      variant: "proof",
      overline: "Why choose Kairali",
      title: "Care you can plan around",
      blocks: [
        { type: "proof", items: [{"title": "NABH accreditation", "text": "Certificate AH-2024-0250"}, {"title": "Clinical Establishment", "text": "Permanent certificate under the Kerala Act"}, {"title": "In-house pharmacy", "text": "Medicated oils and poultices prepared on site"}, {"title": "Physician-led", "text": "Assessment before admission, review through the stay"}] },
      ],
    },
    {
      id: "your-physicians",
      overline: "Your physicians",
      title: "Who assesses you",
      blocks: [
        { type: "physician", image: { src: imgDrDeepuJohn192, alt: "Dr. Deepu John, Chief Physician" }, name: "Dr. Deepu John", role: "Chief Physician — treatment planning & admission" },
        { type: "physicianNote", text: "Every programme at the Healing Village begins with an in-person consultation. Your physician assesses your health status, plans the treatment schedule, and reviews it through your stay and at discharge." },
      ],
    },
    {
      id: "questions-patients-ask",
      overline: "Questions patients ask",
      title: "Straight answers",
      blocks: [
        { type: "faq", items: [{"q": "What kinds of pain do patients come with?", "a": [["Most commonly long-running back, neck, shoulder and joint discomfort, and stiffness that has stopped responding to rest. Whether our programmes suit YOUR case is exactly what the consultation decides — bring your records and imaging."]]}, {"q": "Will the programme fix my pain?", "a": [["No specific result can be guaranteed. Your care includes a careful assessment, a physician-planned programme, supervised therapy and a clear discussion of your progress at each review."]]}, {"q": "Do I stop my current treatment?", "a": [["No. Bring your prescriptions to the consultation; our physicians plan around your existing care and will tell you plainly what should not change."]]}] },
      ],
    },
  ],
  enquiry: {"overline": "Begin with a consultation", "title": "Request an assessment", "lead": ["Describe the discomfort, how long it has been there, and what you have tried. Patient services replies with consultation options; the physician takes it from there."], "form": {"heading": "Request an assessment", "intro": "Tell us how to reach you. Our patient care team can help you plan your visit."}, "aside": {"k": "What happens next", "paragraphs": [["Request a consultation and our patient care team will contact you about consultation options and the information your doctor may need before admission."], ["Prefer to talk now? Call ", {"a": "+91 9555 156 156", "href": "tel:+919555156156"}, {"br": true}, "International patients: ", {"a": "info@kairali.com", "href": "mailto:info@kairali.com"}]]}},
  whatsappText: "Hello, I would like to enquire about Ayurvedic Pain Management in Kerala | Kairali KTAHV (/lp/pain-management/).",
};

export default content;
