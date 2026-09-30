// Content for /lp/weight-loss/ — generated from the saved staging page
//   staging-pages/Ayurvedic Weight Loss Treatment in Kerala _ Kairali KTAHV.html
// then corrected by hand. Every change from staging is logged in
// docs/changes/lp-weight-loss.md.

import type { LpContent } from "../../../components/lp/types";
import imgWxPathway from "../../../../public/campaign-v110/images/wx-pathway.jpg";
import imgTherapyAbhyanga from "../../../../public/campaign-v110/images/therapy-abhyanga.jpg";
import imgPatientVillaClassic from "../../../../public/campaign-v110/images/patient-villa-classic.jpg";
import imgDrDeepuJohn192 from "../../../../public/campaign-v110/images/dr-deepu-john-192.webp";
import imgConsultationPulse from "../../../../public/campaign-v110/images/consultation-pulse.webp";

const content: LpContent = {
  path: "/lp/weight-loss/",
  head: {"title": "Ayurvedic Weight Loss Treatment in Kerala | Kairali KTAHV", "description": "A physician-guided Ayurvedic weight-management programme at Kairali's NABH-accredited hospital in Kerala — assessment, therapy, diet and follow-up.", "keywords": ["ayurvedic weight loss treatment kerala", "weight management programme ayurveda", "ayurvedic hospital palakkad"], "canonical": "https://ayurvedichealingvillage.com/lp/weight-loss/", "ogImage": "https://ayurvedichealingvillage.com/campaign-v110/images/consultation-pulse.webp", "locale": "en_IN", "siteName": "Kairali — The Ayurvedic Healing Village"},
  jsonLd: {"@context": "https://schema.org", "@graph": [{"@type": "Organization", "@id": "https://ayurvedichealingvillage.com#org", "name": "Kairali Ayurvedic Group", "url": "https://www.kairali.com", "email": "info@kairali.com", "foundingDate": "1989", "description": "Founded in 1989 by K. V. Ramesh and Gita Ramesh.", "slogan": "health through ayurveda"}, {"@type": "MedicalClinic", "@id": "https://ayurvedichealingvillage.com#clinic", "name": "Kairali — The Ayurvedic Healing Village", "url": "https://ayurvedichealingvillage.com", "email": "info@kairali.com", "telephone": "+919555156156", "address": {"@type": "PostalAddress", "streetAddress": "Olassery P.O., Kodumbu", "addressLocality": "Palakkad", "addressRegion": "Kerala", "addressCountry": "IN"}, "medicalSpecialty": "Ayurveda", "parentOrganization": {"@id": "https://ayurvedichealingvillage.com#org"}}, {"@type": "WebSite", "@id": "https://ayurvedichealingvillage.com#website", "name": "Kairali — The Ayurvedic Healing Village", "url": "https://ayurvedichealingvillage.com/lp/weight-loss", "publisher": {"@id": "https://ayurvedichealingvillage.com#org"}, "inLanguage": "en"}]},
  hero: {
    overline: "NABH-accredited Ayurvedic hospital, Palakkad",
    h1: ["Ayurvedic weight-loss treatment in Kerala — ", {"em": "care planned around you"}, "."],
    sub: "Physician-assessed, hospital-admitted weight management: supervised therapies, a prescribed diet, daily routine and follow-up. Your physician plans your care after a consultation.",
    doctor: { image: { src: imgDrDeepuJohn192, alt: "Dr. Deepu John, Chief Physician at Kairali — The Ayurvedic Healing Village" }, name: "Dr. Deepu John", role: "Chief Physician — treatment planning & admission" },
    creds: [{"label": "NABH", "nabh": true, "detail": "accredited · AH-2024-0250"}, {"label": "Physician-assessed", "detail": "admission after consultation"}, {"label": "Individual care", "detail": "programme planned after consultation"}, {"label": "Hospital kitchen", "detail": "programme diets prepared in-house"}],
    photo: { ...{ src: imgConsultationPulse, alt: "Kairali physician assessing a patient at consultation" }, caption: "Ayurvedic consultation", detail: "Treatment planning at Kairali" },
  },
  sections: [
    {
      id: "why-the-crash-diet-loop-fails",
      overline: "Why the crash-diet loop fails",
      title: "You have probably tried harder than most people ever will",
      blocks: [
        { type: "lead", runs: ["Restriction, rebound, repeat — the cycle is not a willpower failure, it is a method failure. An admitted programme changes the method: the food, the routine, the therapy and the review all happen in one supervised place."] },
        { type: "steps", cards: [{"k": "The pattern", "title": "Diets end", "text": "Anything you can only do for six weeks will only work for six weeks. The programme is built as a routine you take home."}, {"k": "The pattern", "title": "Alone is hard", "text": "At home, the kitchen, the schedule and the accountability are all yours to police. Under admission, they are the hospital's job."}, {"k": "The pattern", "title": "One-size fails", "text": "The same plan cannot fit every body. Your programme starts from your assessment, not from a template."}] },
      ],
    },
    {
      id: "the-programme",
      variant: "alt",
      overline: "The programme",
      title: "What a weight-management admission looks like",
      blocks: [
        { type: "steps", cards: [{"k": "Step 1", "title": "Assessment", "text": "In-person consultation: history, examination, and your records reviewed. The physician sets the plan — or tells you honestly if admission is not the right tool."}, {"k": "Step 2", "title": "Supervised therapy", "text": "Daily treatments — massage-based and cleansing therapies as indicated — carried out by the hospital's treatment team."}, {"k": "Step 3", "title": "Diet & routine", "text": "A prescribed diet from the hospital kitchen and a daily rhythm of activity and rest. The routine is designed to survive your trip home."}, {"k": "Step 4", "title": "Review & follow-up", "text": "Progress reviewed by your physician through the stay; discharge guidance and follow-up so the work continues after you leave."}] },
        { type: "photos", images: [{ src: imgWxPathway, alt: "Treatment gardens between the Healing Village's buildings, Palakkad" }, { src: imgTherapyAbhyanga, alt: "Supervised therapy in a Healing Village treatment room" }, { src: imgPatientVillaClassic, alt: "A quiet patient villa inside the treatment gardens" }] },
      ],
    },
    {
      id: "why-choose-kairali",
      variant: "proof",
      overline: "Why choose Kairali",
      title: "Care you can plan around",
      blocks: [
        { type: "proof", items: [{"title": "NABH accreditation", "text": "Certificate AH-2024-0250"}, {"title": "Clinical Establishment", "text": "Permanent certificate under the Kerala Act"}, {"title": "Physician-led", "text": "Assessment before admission, review through the stay"}, {"title": "Individual care", "text": "Programme planned after consultation"}] },
      ],
    },
    {
      id: "your-physicians",
      overline: "Your physicians",
      title: "Who runs your programme",
      blocks: [
        { type: "physician", image: { src: imgDrDeepuJohn192, alt: "Dr. Deepu John, Chief Physician" }, name: "Dr. Deepu John", role: "Chief Physician — treatment planning & admission" },
        { type: "physicianNote", text: "Every programme at the Healing Village begins with an in-person consultation. Your physician assesses your health status, plans the treatment schedule, and reviews it through your stay and at discharge." },
      ],
    },
    {
      id: "questions-patients-ask",
      overline: "Questions patients ask",
      title: "Asked and answered — honestly",
      blocks: [
        { type: "faq", items: [{"q": "How much weight will I lose?", "a": [["Results vary from person to person. Your physician will discuss your health, goals and suitable programme during consultation, and review your progress during your stay."]]}, {"q": "What does the programme involve day to day?", "a": [["A physician-set schedule: therapies through the morning, a prescribed diet from the hospital kitchen, activity appropriate to your assessment, and rest. The routine is the treatment."]]}, {"q": "How long is an admission?", "a": [["Your physician decides at consultation, based on your health status and goals — typically a matter of weeks, reviewed as you go."]]}, {"q": "I have other health conditions. Can I still come?", "a": [["Bring your medical records to the consultation. Your physician will review them, tell you plainly whether admission makes sense in your case, and coordinate with the care you already receive. We do not treat this programme as a substitute for the medical care your conditions need."]]}] },
      ],
    },
  ],
  enquiry: {"overline": "Begin with a consultation", "title": "Request a consultation", "lead": ["Tell us where you are starting from. Our patient-services team replies with consultation options; the physician decides the programme with you."], "form": {"heading": "Request a consultation", "intro": "Tell us how to reach you. Our patient care team can help you plan your visit."}, "aside": {"k": "What happens next", "paragraphs": [["Submit the form to request a consultation. A receipt is shown only after the system confirms your enquiry. We reply with consultation options and what your physician will need to know before admission."], ["Prefer to talk now? Call ", {"a": "+91 9555 156 156", "href": "tel:+919555156156"}, {"br": true}, "International patients: ", {"a": "info@kairali.com", "href": "mailto:info@kairali.com"}]]}},
  whatsappText: "Hello, I would like to enquire about Ayurvedic Weight Loss Treatment in Kerala | Kairali KTAHV (/lp/weight-loss/).",
};

export default content;
