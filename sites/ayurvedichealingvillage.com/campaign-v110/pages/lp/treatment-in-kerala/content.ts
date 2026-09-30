// Content for /lp/treatment-in-kerala/ — generated from the saved staging page
//   staging-pages/Ayurvedic Treatment in Kerala _ Kairali Healing Village.html
// then corrected by hand. Every change from staging is logged in
// docs/changes/lp-treatment-in-kerala.md.

import type { LpContent } from "../../../components/lp/types";
import imgWxHero from "../../../../public/campaign-v110/images/wx-hero.webp";
import imgTherapyAbhyanga from "../../../../public/campaign-v110/images/therapy-abhyanga.jpg";
import imgPatientVillaClassic from "../../../../public/campaign-v110/images/patient-villa-classic.jpg";
import imgDrDeepuJohn192 from "../../../../public/campaign-v110/images/dr-deepu-john-192.webp";
import imgWxPathway from "../../../../public/campaign-v110/images/wx-pathway.jpg";

const content: LpContent = {
  path: "/lp/treatment-in-kerala/",
  head: {"title": "Ayurvedic Treatment in Kerala | Kairali Healing Village", "description": "Physician-planned Ayurvedic treatment at Kairali's NABH-accredited hospital in Palakkad, Kerala — consultation, therapy, diet and follow-up, on the record.", "keywords": ["ayurvedic treatment kerala", "ayurveda kerala hospital", "panchakarma treatment india", "kairali healing village"], "canonical": "https://ayurvedichealingvillage.com/lp/treatment-in-kerala/", "ogImage": "https://ayurvedichealingvillage.com/campaign-v110/ahv/assets/img/wx-pathway.jpg", "locale": "en_IN", "siteName": "Kairali — The Ayurvedic Healing Village"},
  jsonLd: {"@context": "https://schema.org", "@graph": [{"@type": "Organization", "@id": "https://ayurvedichealingvillage.com#org", "name": "Kairali Ayurvedic Group", "url": "https://www.kairali.com", "email": "info@kairali.com", "foundingDate": "1989", "description": "Founded in 1989 by K. V. Ramesh and Gita Ramesh.", "slogan": "health through ayurveda"}, {"@type": "MedicalClinic", "@id": "https://ayurvedichealingvillage.com#clinic", "name": "Kairali — The Ayurvedic Healing Village", "url": "https://ayurvedichealingvillage.com", "email": "info@kairali.com", "telephone": "+919555156156", "address": {"@type": "PostalAddress", "streetAddress": "Olassery P.O., Kodumbu", "addressLocality": "Palakkad", "addressRegion": "Kerala", "addressCountry": "IN"}, "medicalSpecialty": "Ayurveda", "parentOrganization": {"@id": "https://ayurvedichealingvillage.com#org"}}, {"@type": "WebSite", "@id": "https://ayurvedichealingvillage.com#website", "name": "Kairali — The Ayurvedic Healing Village", "url": "https://ayurvedichealingvillage.com/lp/treatment-in-kerala", "publisher": {"@id": "https://ayurvedichealingvillage.com#org"}, "inLanguage": "en"}]},
  hero: {
    overline: "NABH-accredited Ayurvedic hospital, Palakkad",
    h1: ["Ayurvedic treatment in Kerala, ", {"em": "the way a hospital does it"}, " — consultation first."],
    sub: "Kairali's Healing Village runs classical Ayurvedic programmes under physician supervision: assessment, therapy, hospital-kitchen diet, and follow-up at discharge.",
    doctor: { image: { src: imgDrDeepuJohn192, alt: "Dr. Deepu John, Chief Physician at Kairali — The Ayurvedic Healing Village" }, name: "Dr. Deepu John", role: "Chief Physician — treatment planning & admission" },
    creds: [{"label": "NABH", "nabh": true, "detail": "accredited · AH-2024-0250"}, {"label": "Panchakarma", "detail": "in NABH-accredited scope"}, {"label": "Clinical Establishment", "detail": "permanent certificate · Kerala Act"}, {"label": "Physician-led", "detail": "treatment team"}],
    photo: { ...{ src: imgWxPathway, alt: "Treatment buildings and gardens of the Healing Village in Palakkad" }, caption: "The Healing Village, Palakkad", detail: "An accredited Ayurvedic hospital" },
  },
  sections: [
    {
      id: "what-we-treat-you-with",
      overline: "What we treat you with",
      title: "The programme families",
      blocks: [
        { type: "lead", runs: ["Every admission draws on the same clinical toolkit — which tools, and for how long, is your physician's call at consultation."] },
        { type: "steps", cards: [{"k": "Programme", "title": "Panchakarma", "text": "The classical five-fold cleansing sequence: preparation, the indicated procedures, rebuilding."}, {"k": "Programme", "title": "Rejuvenation care", "text": "Oil therapies, diet and routine for depletion, poor sleep and long recoveries."}, {"k": "Programme", "title": "Pain management", "text": "Assessment-led programmes for chronic back, neck and joint discomfort."}, {"k": "Programme", "title": "Diet & routine", "text": "The hospital kitchen and a physician-set daily rhythm — the quiet half of every programme."}] },
      ],
    },
    {
      id: "the-place",
      variant: "alt",
      overline: "The place",
      title: "A hospital built like a village",
      blocks: [
        { type: "photos", images: [{ src: imgWxHero, alt: "Treatment buildings of the Healing Village campus" }, { src: imgTherapyAbhyanga, alt: "Therapists at work in a treatment room" }, { src: imgPatientVillaClassic, alt: "A patient villa in the treatment gardens" }] },
      ],
    },
    {
      id: "why-choose-kairali",
      variant: "proof",
      overline: "Why choose Kairali",
      title: "Care you can plan around",
      blocks: [
        { type: "proof", items: [{"title": "NABH accreditation", "text": "Certificate AH-2024-0250 · Panchakarma within accredited scope"}, {"title": "Clinical Establishment", "text": "Permanent certificate under the Kerala Act"}, {"title": "Four generations", "text": "A family practice of Ayurveda behind the hospital"}, {"title": "TripAdvisor Hall of Fame", "text": "Patient reviews on the public record"}] },
      ],
    },
    {
      id: "your-physicians",
      overline: "Your physicians",
      title: "Who plans your treatment",
      blocks: [
        { type: "physician", image: { src: imgDrDeepuJohn192, alt: "Dr. Deepu John, Chief Physician" }, name: "Dr. Deepu John", role: "Chief Physician — treatment planning & admission" },
        { type: "physicianNote", text: "Every programme at the Healing Village begins with an in-person consultation. Your physician assesses your health status, plans the treatment schedule, and reviews it through your stay and at discharge." },
      ],
    },
    {
      id: "questions-patients-ask",
      overline: "Questions patients ask",
      title: "Plainly answered",
      blocks: [
        { type: "faq", items: [{"q": "What treatments does the hospital offer?", "a": [["Classical Ayurvedic programmes: Panchakarma and its five-fold procedures, rejuvenation and cleansing therapies, pain-management programmes, and physician-planned diet and routine. Which of them apply to you is decided at consultation."]]}, {"q": "How do I choose the right programme?", "a": [["You do not have to — that is the physician's job. Send your situation and records; the consultation settles the programme, its length and its schedule."]]}, {"q": "Is this a medical facility or a wholesome hotel?", "a": [["A hospital first — NABH-accredited and physician-led, with proper admission and discharge. The comfort is deliberate: quiet villas and gardens help patients rest, sleep and recover between treatments. You will be comfortable here, and you will be cared for as a patient."]]}] },
      ],
    },
  ],
  enquiry: {"overline": "Begin with a consultation", "title": "Request a consultation", "lead": ["Tell us what you are dealing with and when you could travel. Patient services replies with options; the physician decides the programme with you."], "form": {"heading": "Request a consultation", "intro": "Tell us how to reach you. Our patient care team can help you plan your visit."}, "aside": {"k": "What happens next", "paragraphs": [["Submit the form to request a consultation. A receipt is shown only after the system confirms your enquiry. We reply with consultation options and what your physician will need to know before admission."], ["Prefer to talk now? Call ", {"a": "+91 9555 156 156", "href": "tel:+919555156156"}, {"br": true}, "International patients: ", {"a": "info@kairali.com", "href": "mailto:info@kairali.com"}]]}},
  whatsappText: "Hello, I would like to enquire about Ayurvedic Treatment in Kerala | Kairali Healing Village (/lp/treatment-in-kerala/).",
};

export default content;
