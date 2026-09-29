// Content for /lp/kairali-brand/ — generated from the saved staging page
//   staging-pages/Kairali — The Ayurvedic Healing Village, Palakkad.html
// then corrected by hand. Every change from staging is logged in
// docs/changes/lp-kairali-brand.md.

import type { LpContent } from "../../../components/lp/types";
import imgDrDeepuJohn192 from "../../../../public/campaign-v110/images/dr-deepu-john-192.webp";
import imgWxHero from "../../../../public/campaign-v110/images/wx-hero.webp";

const content: LpContent = {
  path: "/lp/kairali-brand/",
  head: {"title": "Kairali — The Ayurvedic Healing Village, Palakkad", "description": "The original Kairali: an NABH-accredited Ayurvedic hospital in Palakkad, Kerala. Confirm you have the right place and speak to patient services now.", "keywords": ["kairali ayurvedic healing village", "kairali palakkad", "kairali ayurveda hospital"], "canonical": "https://ayurvedichealingvillage.com/lp/kairali-brand/", "ogImage": "https://ayurvedichealingvillage.com/campaign-v110/ahv/assets/img/wx-hero.webp", "locale": "en_IN", "siteName": "Kairali — The Ayurvedic Healing Village"},
  jsonLd: {"@context": "https://schema.org", "@graph": [{"@type": "Organization", "@id": "https://ayurvedichealingvillage.com#org", "name": "Kairali Ayurvedic Group", "url": "https://www.kairali.com", "email": "info@kairali.com", "foundingDate": "1989", "description": "Founded in 1989 by K. V. Ramesh and Gita Ramesh.", "slogan": "health through ayurveda"}, {"@type": "MedicalClinic", "@id": "https://ayurvedichealingvillage.com#clinic", "name": "Kairali — The Ayurvedic Healing Village", "url": "https://ayurvedichealingvillage.com", "email": "info@kairali.com", "telephone": "+919555156156", "address": {"@type": "PostalAddress", "streetAddress": "Olassery P.O., Kodumbu", "addressLocality": "Palakkad", "addressRegion": "Kerala", "addressCountry": "IN"}, "medicalSpecialty": "Ayurveda", "parentOrganization": {"@id": "https://ayurvedichealingvillage.com#org"}}, {"@type": "WebSite", "@id": "https://ayurvedichealingvillage.com#website", "name": "Kairali — The Ayurvedic Healing Village", "url": "https://ayurvedichealingvillage.com/lp/kairali-brand", "publisher": {"@id": "https://ayurvedichealingvillage.com#org"}, "inLanguage": "en"}]},
  hero: {
    overline: "NABH-accredited Ayurvedic hospital, Palakkad",
    h1: ["You searched for Kairali. ", {"em": "This is the Healing Village"}, " — the hospital itself."],
    sub: "Right place: Kairali's NABH-accredited Ayurvedic hospital in Palakkad, Kerala — the family's flagship, where programmes are planned by physicians after an in-person consultation.",
    doctor: { image: { src: imgDrDeepuJohn192, alt: "Dr. Deepu John, Chief Physician at Kairali — The Ayurvedic Healing Village" }, name: "Dr. Deepu John", role: "Chief Physician — treatment planning & admission" },
    creds: [{"label": "NABH", "nabh": true, "detail": "accredited · AH-2024-0250"}, {"label": "Panchakarma", "detail": "in NABH-accredited scope"}, {"label": "Clinical Establishment", "detail": "permanent certificate · Kerala Act"}, {"label": "Physician-led", "detail": "treatment team"}],
    photo: { ...{ src: imgWxHero, alt: "Kairali — The Ayurvedic Healing Village campus" }, caption: "The Healing Village, Palakkad", detail: "Kairali's flagship hospital" },
  },
  sections: [
    {
      id: "confirm-you-have-the-right-place",
      variant: "proof",
      overline: "Confirm you have the right place",
      title: "Kairali, on the record",
      blocks: [
        { type: "proof", items: [{"title": "NABH accreditation", "text": "Certificate AH-2024-0250 — in the accredited AYUSH hospital list"}, {"title": "Clinical Establishment", "text": "Permanent certificate under the Kerala Act"}, {"title": "Four generations", "text": "A family practice of Ayurveda behind the hospital"}, {"title": "TripAdvisor Hall of Fame", "text": "Patient reviews on the public record"}] },
      ],
    },
  ],
  enquiry: {"overline": "You are one message away", "title": "Speak to patient services", "lead": ["Dates, programmes, tariffs, travel — ask on WhatsApp for the fastest answer, or send the form."], "form": {"heading": "Send an enquiry", "intro": "Tell us how to reach you. Our patient care team can help you plan your visit."}, "aside": {"k": "What happens next", "paragraphs": [["Submit the form to request a consultation. A receipt is shown only after the system confirms your enquiry. We reply with consultation options and what your physician will need to know before admission."], ["Prefer to talk now? Call ", {"a": "+91 9555 156 156", "href": "tel:+919555156156"}, {"br": true}, "International patients: ", {"a": "info@kairali.com", "href": "mailto:info@kairali.com"}]]}},
  whatsappText: "Hello, I would like to enquire about Kairali — The Ayurvedic Healing Village, Palakkad (/lp/kairali-brand/).",
};

export default content;
