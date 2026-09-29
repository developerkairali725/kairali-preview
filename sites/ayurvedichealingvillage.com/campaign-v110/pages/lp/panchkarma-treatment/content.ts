// Content for /lp/panchkarma-treatment/ — generated from the saved staging page
//   staging-pages/Panchakarma Treatment in Kerala _ Kairali Healing Village.html
// then corrected by hand. Every change from staging is logged in
// docs/changes/lp-panchkarma-treatment.md.

import type { LpContent } from "../../../components/lp/types";
import imgTherapyPanchakarma from "../../../../public/campaign-v110/images/therapy-panchakarma.jpg";
import imgTherapyAbhyanga from "../../../../public/campaign-v110/images/therapy-abhyanga.jpg";
import imgWxPathway from "../../../../public/campaign-v110/images/wx-pathway.jpg";
import imgDrDeepuJohn192 from "../../../../public/campaign-v110/images/dr-deepu-john-192.webp";
import imgConsultationPulse from "../../../../public/campaign-v110/images/consultation-pulse.webp";

const content: LpContent = {
  path: "/lp/panchkarma-treatment/",
  head: {"title": "Panchakarma Treatment in Kerala | Kairali Healing Village", "description": "Physician-planned Panchakarma at Kairali's NABH-accredited Ayurvedic hospital in Palakkad, Kerala. Consultation first — then therapy, diet and follow-up.", "keywords": ["panchakarma treatment kerala", "panchakarma centre india", "ayurvedic hospital palakkad", "panchakarma programme"], "canonical": "https://ayurvedichealingvillage.com/lp/panchkarma-treatment/", "ogImage": "https://ayurvedichealingvillage.com/campaign-v110/images/consultation-pulse.webp", "locale": "en_IN", "siteName": "Kairali — The Ayurvedic Healing Village"},
  jsonLd: {"@context": "https://schema.org", "@graph": [{"@type": "Organization", "@id": "https://ayurvedichealingvillage.com#org", "name": "Kairali Ayurvedic Group", "url": "https://www.kairali.com", "email": "info@kairali.com", "foundingDate": "1989", "description": "Founded in 1989 by K. V. Ramesh and Gita Ramesh.", "slogan": "health through ayurveda"}, {"@type": "MedicalClinic", "@id": "https://ayurvedichealingvillage.com#clinic", "name": "Kairali — The Ayurvedic Healing Village", "url": "https://ayurvedichealingvillage.com", "email": "info@kairali.com", "telephone": "+919555156156", "address": {"@type": "PostalAddress", "streetAddress": "Olassery P.O., Kodumbu", "addressLocality": "Palakkad", "addressRegion": "Kerala", "addressCountry": "IN"}, "medicalSpecialty": "Ayurveda", "parentOrganization": {"@id": "https://ayurvedichealingvillage.com#org"}}, {"@type": "WebSite", "@id": "https://ayurvedichealingvillage.com#website", "name": "Kairali — The Ayurvedic Healing Village", "url": "https://ayurvedichealingvillage.com/lp/panchkarma-treatment", "publisher": {"@id": "https://ayurvedichealingvillage.com#org"}, "inLanguage": "en"}]},
  hero: {
    overline: "NABH-accredited Ayurvedic hospital, Palakkad",
    h1: ["Panchakarma treatment in Kerala, ", {"em": "planned by physicians"}, " — after your consultation."],
    sub: "A physician-supervised programme at an NABH-accredited Ayurvedic hospital — consultation first, then five-fold therapy, diet and follow-up care.",
    doctor: { image: { src: imgDrDeepuJohn192, alt: "Dr. Deepu John, Chief Physician at Kairali — The Ayurvedic Healing Village" }, name: "Dr. Deepu John", role: "Chief Physician — treatment planning & admission" },
    creds: [{"label": "NABH", "nabh": true, "detail": "accredited · AH-2024-0250"}, {"label": "Panchakarma", "detail": "in NABH-accredited scope"}, {"label": "Clinical Establishment", "detail": "permanent certificate · Kerala Act"}, {"label": "Physician-led", "detail": "treatment team"}],
    photo: { ...{ src: imgConsultationPulse, alt: "Kairali physician reading a patient's pulse during an Ayurvedic consultation" }, caption: "Ayurvedic consultation", detail: "Treatment planning at Kairali" },
  },
  sections: [
    {
      id: "how-admission-works",
      overline: "How admission works",
      title: "Consultation first. Always.",
      blocks: [
        { type: "lead", runs: ["No programme here is bought off a page. It is prescribed — and that order of events is the whole difference between a hospital and a brochure."] },
        { type: "steps", cards: [{"k": "Step 1", "title": "In-person consultation", "text": "Your physician takes your history, examines you, and decides whether — and which — Panchakarma programme is appropriate."}, {"k": "Step 2", "title": "Five-fold therapy", "text": "The prescribed procedures and their preparatory therapies, carried out by the hospital's treatment team on the physician's schedule."}, {"k": "Step 3", "title": "Diet & follow-up", "text": "A supporting diet during your admission, and follow-up guidance at discharge so the programme's routine survives the trip home."}] },
      ],
    },
    {
      id: "the-five-folds",
      variant: "alt",
      overline: "The five folds",
      title: "What Panchakarma actually is",
      blocks: [
        { type: "lead", runs: ["Five classical procedure families — each one prescribed selectively, never as a package deal. Your programme may use some, not all; that is clinical judgement doing its job."] },
        { type: "steps", cards: [{"k": "Fold 1", "title": "Vamana", "text": "Therapeutic emesis, prepared for and administered only under physician supervision as part of a planned programme."}, {"k": "Fold 2", "title": "Virechana", "text": "Medicated purgation, scheduled by your physician after preparatory therapies and diet."}, {"k": "Fold 3", "title": "Basti", "text": "Medicated enema therapies — the classical core of many Panchakarma programmes, always physician-prescribed."}, {"k": "Fold 4", "title": "Nasya", "text": "Nasal administration of medicated preparations, where your assessment indicates it."}, {"k": "Fold 5", "title": "Raktamokshana", "text": "Classical blood-letting procedures, used selectively and only on clinical judgement."}] },
        { type: "photos", images: [{ src: imgTherapyPanchakarma, alt: "Panchakarma therapy in progress at the Healing Village" }, { src: imgTherapyAbhyanga, alt: "Two therapists performing synchronised Abhyanga massage" }, { src: imgWxPathway, alt: "Treatment buildings and gardens at the Healing Village, Palakkad" }] },
      ],
    },
    {
      id: "why-choose-kairali",
      variant: "proof",
      overline: "Why choose Kairali",
      title: "An accredited hospital, on the record",
      blocks: [
        { type: "proof", items: [{"title": "NABH accreditation", "text": "Certificate AH-2024-0250 · Panchakarma within accredited scope"}, {"title": "Clinical Establishment", "text": "Permanent certificate under the Kerala Act"}, {"title": "Physician-led", "text": "Ayurvedic doctors plan and review every programme"}, {"title": "Four generations", "text": "A family practice of Ayurveda behind the hospital"}] },
      ],
    },
    {
      id: "your-physicians",
      overline: "Your physicians",
      title: "The people who plan your programme",
      blocks: [
        { type: "physician", image: { src: imgDrDeepuJohn192, alt: "Dr. Deepu John, Chief Physician" }, name: "Dr. Deepu John", role: "Chief Physician — treatment planning & admission" },
        { type: "physicianNote", text: "Every programme at the Healing Village begins with an in-person consultation. Your physician assesses your health status, plans the treatment schedule, and reviews it through your stay and at discharge." },
      ],
    },
    {
      id: "patient-voices",
      variant: "alt",
      overline: "Patient voices",
      title: "What patients say",
      blocks: [
        { type: "lead", runs: ["Individual experiences from patients who chose to speak on camera. They are personal accounts — not a promise of results; outcomes differ from person to person."] },
        { type: "video", youtubeId: "CcDPOeSR67E", title: "Patient experiences at Kairali — The Ayurvedic Healing Village" },
      ],
    },
    {
      id: "questions-patients-ask",
      overline: "Questions patients ask",
      title: "Panchakarma, plainly answered",
      blocks: [
        { type: "faq", items: [{"q": "What is Panchakarma?", "a": [["Panchakarma is classical Ayurveda's five-fold set of cleansing procedures. At the Healing Village it is practised as a physician-planned programme: preparatory therapies, the indicated procedures, a supporting diet, and rest — in NABH-accredited scope."]]}, {"q": "How long does a programme take?", "a": [["That is a clinical decision, not a menu choice. Your physician sets the schedule at consultation based on your health status and history; programmes are typically measured in weeks, and the plan is reviewed through your stay."]]}, {"q": "Who plans and supervises the treatment?", "a": [["Our Ayurvedic physicians. Every admission starts with an in-person consultation, and therapy is carried out by the hospital's treatment team under physician supervision."]]}, {"q": "Will Panchakarma treat my medical condition?", "a": [["We do not promise outcomes for any condition. Your physician will tell you honestly, at consultation, what a programme can and cannot be expected to do in your case — and continue any conversation with your own doctors that your situation needs."]]}] },
      ],
    },
  ],
  enquiry: {"overline": "Begin with a consultation", "title": "Request a consultation", "lead": ["Tell us where you are and what you are dealing with. Our patient-services team replies with consultation options — the physician takes it from there."], "form": {"heading": "Request a consultation", "intro": "Tell us how to reach you. Our patient care team can help you plan your visit."}, "aside": {"k": "What happens next", "paragraphs": [["Submit the form to request a consultation. A receipt is shown only after the system confirms your enquiry. We reply with consultation options and what your physician will need to know before admission."], ["Prefer to talk now? Call ", {"a": "+91 9555 156 156", "href": "tel:+919555156156"}, {"br": true}, "International patients: ", {"a": "info@kairali.com", "href": "mailto:info@kairali.com"}]]}},
  whatsappText: "Hello, I would like to enquire about Panchakarma Treatment in Kerala | Kairali Healing Village (/lp/panchkarma-treatment/).",
};

export default content;
