// Content for /lp/ayurvedic-hospital-kerala/ — generated from the saved staging page
//   staging-pages/Ayurvedic Hospital in Kerala _ Kairali Healing Village.html
// then corrected by hand. Every change from staging is logged in
// docs/changes/lp-ayurvedic-hospital-kerala.md.

import type { LpContent } from "../../../components/lp/types";
import imgWxPathway from "../../../../public/campaign-v110/images/wx-pathway.jpg";
import imgTherapyAbhyanga from "../../../../public/campaign-v110/images/therapy-abhyanga.jpg";
import imgPatientVillaClassic from "../../../../public/campaign-v110/images/patient-villa-classic.jpg";
import imgDrDeepuJohn192 from "../../../../public/campaign-v110/images/dr-deepu-john-192.webp";
import imgWxHero from "../../../../public/campaign-v110/images/wx-hero.webp";

const content: LpContent = {
  path: "/lp/ayurvedic-hospital-kerala/",
  head: {"title": "Ayurvedic Hospital in Kerala | Kairali Healing Village", "description": "Searching for wellness in Kerala? Kairali is the NABH-accredited Ayurvedic hospital behind the famous gardens — physician-planned care, village quiet.", "keywords": ["ayurvedic hospital kerala", "wellness kerala ayurveda", "ayurvedic treatment centre palakkad", "panchakarma hospital india"], "canonical": "https://ayurvedichealingvillage.com/lp/ayurvedic-hospital-kerala/", "ogImage": "https://ayurvedichealingvillage.com/campaign-v110/ahv/assets/img/wx-hero.webp", "locale": "en_IN", "siteName": "Kairali — The Ayurvedic Healing Village"},
  jsonLd: {"@context": "https://schema.org", "@graph": [{"@type": "Organization", "@id": "https://ayurvedichealingvillage.com#org", "name": "Kairali Ayurvedic Group", "url": "https://www.kairali.com", "email": "info@kairali.com", "foundingDate": "1989", "description": "Founded in 1989 by K. V. Ramesh and Gita Ramesh.", "slogan": "health through ayurveda"}, {"@type": "MedicalClinic", "@id": "https://ayurvedichealingvillage.com#clinic", "name": "Kairali — The Ayurvedic Healing Village", "url": "https://ayurvedichealingvillage.com", "email": "info@kairali.com", "telephone": "+919555156156", "address": {"@type": "PostalAddress", "streetAddress": "Olassery P.O., Kodumbu", "addressLocality": "Palakkad", "addressRegion": "Kerala", "addressCountry": "IN"}, "medicalSpecialty": "Ayurveda", "parentOrganization": {"@id": "https://ayurvedichealingvillage.com#org"}}, {"@type": "WebSite", "@id": "https://ayurvedichealingvillage.com#website", "name": "Kairali — The Ayurvedic Healing Village", "url": "https://ayurvedichealingvillage.com/lp/ayurvedic-hospital-kerala", "publisher": {"@id": "https://ayurvedichealingvillage.com#org"}, "inLanguage": "en"}]},
  hero: {
    overline: "NABH-accredited Ayurvedic hospital, Palakkad",
    h1: ["Came looking for wellness in Kerala? ", {"em": "What you need is a hospital"}, " that feels like a village."],
    sub: "Kairali's Healing Village is an NABH-accredited Ayurvedic hospital set in treatment gardens: physician-planned programmes, admission and discharge, quiet villas — care first, scenery second.",
    doctor: { image: { src: imgDrDeepuJohn192, alt: "Dr. Deepu John, Chief Physician at Kairali — The Ayurvedic Healing Village" }, name: "Dr. Deepu John", role: "Chief Physician — treatment planning & admission" },
    creds: [{"label": "NABH", "nabh": true, "detail": "accredited · AH-2024-0250"}, {"label": "Panchakarma", "detail": "in NABH-accredited scope"}, {"label": "Clinical Establishment", "detail": "permanent certificate · Kerala Act"}, {"label": "Physician-led", "detail": "treatment team"}],
    photo: { ...{ src: imgWxHero, alt: "The Healing Village campus in Palakkad — treatment buildings among gardens" }, caption: "The Healing Village, Palakkad", detail: "A hospital in treatment gardens" },
  },
  sections: [
    {
      id: "the-difference",
      overline: "The difference",
      title: "What a hospital brings that a hotel does not",
      blocks: [
        { type: "lead", runs: ["Many places in Kerala offer Ayurvedic therapies. The difference here is who decides your treatment, and on what grounds."] },
        { type: "steps", cards: [{"k": "Difference 1", "title": "A physician decides", "text": "Your physician plans your programme after reviewing your medical history and examining you at consultation."}, {"k": "Difference 2", "title": "Accredited protocols", "text": "NABH accreditation means audited clinical processes: records, hygiene, qualified therapists, physician oversight."}, {"k": "Difference 3", "title": "Admission to discharge", "text": "You are a patient here, with a plan that is reviewed through your stay and closed out properly at discharge."}] },
      ],
    },
    {
      id: "after-you-leave",
      variant: "alt",
      overline: "After you leave",
      title: "Post-treatment care, taken seriously",
      blocks: [
        { type: "lead", runs: ["The fortnight after a programme matters as much as the programme. Discharge comes with diet and routine guidance, and our physicians remain reachable for follow-up questions as you settle back home."] },
        { type: "photos", images: [{ src: imgWxPathway, alt: "Gardens between treatment buildings at the Healing Village" }, { src: imgTherapyAbhyanga, alt: "Therapists at work in a Healing Village treatment room" }, { src: imgPatientVillaClassic, alt: "A patient villa at the Healing Village" }] },
      ],
    },
    {
      id: "why-choose-kairali",
      variant: "proof",
      overline: "Why choose Kairali",
      title: "Care you can plan around",
      blocks: [
        { type: "proof", items: [{"title": "NABH accreditation", "text": "Certificate AH-2024-0250 · Panchakarma within accredited scope"}, {"title": "Clinical Establishment", "text": "Permanent certificate under the Kerala Act"}, {"title": "TripAdvisor Hall of Fame", "text": "Reviews from guests on Tripadvisor"}, {"title": "International patients", "text": "Programmes run for patients from around the world"}] },
      ],
    },
    {
      id: "your-physicians",
      overline: "Your physicians",
      title: "Who looks after you",
      blocks: [
        { type: "physician", image: { src: imgDrDeepuJohn192, alt: "Dr. Deepu John, Chief Physician" }, name: "Dr. Deepu John", role: "Chief Physician — treatment planning & admission" },
        { type: "physicianNote", text: "Every programme at the Healing Village begins with an in-person consultation. Your physician assesses your health status, plans the treatment schedule, and reviews it through your stay and at discharge." },
      ],
    },
  ],
  enquiry: {"overline": "Begin with a consultation", "title": "Plan your admission", "lead": ["Tell us what you are hoping to address and your travel window. Our patient-services team replies with programme options and current tariffs; your physician confirms the plan at consultation."], "form": {"heading": "Plan your admission", "intro": "Tell us how to reach you. Our patient care team can help you plan your visit."}, "aside": {"k": "What happens next", "paragraphs": [["For international patients the simplest start is email — send your enquiry and our patient-services team replies with programme options, current tariffs and what to prepare before travel."], ["Prefer to talk now? Call ", {"a": "+91 9555 156 156", "href": "tel:+919555156156"}, {"br": true}, "International patients: ", {"a": "info@kairali.com", "href": "mailto:info@kairali.com"}]]}},
  whatsappText: "Hello, I would like to enquire about Ayurvedic Hospital in Kerala | Kairali Healing Village (/lp/ayurvedic-hospital-kerala/).",
};

export default content;
