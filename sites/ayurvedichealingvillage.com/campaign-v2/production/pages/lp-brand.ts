// /lp/kairali-brand/ — lp-batch/kairali-brand.md, variant D, a brand searcher confirming this is the Palakkad
// hospital and how a stay begins. Copy adapted from the reviewed brief for sales clarity
// (kairali-akshar-marketing-science CREATE+REVIEW); facts only from the brief and data/doctors.ts.
// No heritage year in copy (the proof strip carries the approved line). sha256 as recorded in
// lp-batch/NONPUBLIC/LP-COPY-FACT-AUDIT.json (not recomputed in this session).
import { defineCopy } from "../copy.ts";

export default defineCopy({
  slug: "lp-brand",
  route: "/lp/kairali-brand/",
  source: { file: "lp-batch/kairali-brand.md", sha256: "d653a135dc561d351f233eec9b3d082e0386c599d8415b172e22cca8ec7266dc" },
  seo: {
    title: "Kairali — The Ayurvedic Healing Village, Palakkad",
    description: "Meet Kairali – The Ayurvedic Healing Village in Palakkad, Kerala. Explore residential Ayurveda and begin with a free initial doctor consultation.",
  },
  adMatch: { keywords: ["kairali ayurvedic healing village", "kairali palakkad", "kairali ayurveda hospital"], adHeadlines: [] },
  hero: {
    overline: "Ayurvedic care · Palakkad, Kerala",
    h1: "Kairali – The Ayurvedic Healing Village",
    standfirst: "Get to know Kairali’s NABH-accredited Ayurvedic hospital and plan a residential stay around your care, with villas in the village gardens.",
  },
  cta: {
    primary: "Get Free Doctor Consultation",
    primarySupport: "Your initial consultation is free. Ask for a quotation covering treatment and any later services.",
    secondary: "Ask Anything",
  },
  programDefault: "",
  doctors: ["deepu-john", "rahul-r", "akhila-oommen", "adhina-ub", "aashitha-ps"],
  page: {
    lead: {
      heading: "The Kairali Healing Village, in Palakkad",
      paragraphs: [
        "If you searched for Kairali, you may be planning care for yourself or helping someone else plan a stay. This page is about Kairali – The Ayurvedic Healing Village: an NABH-accredited Ayurvedic hospital in Palakkad, Kerala, with residential villas in the village gardens.",
        "The Healing Village brings a family tradition of Ayurveda to residential hospital care. Your programme begins with an individual assessment, so the proposed care reflects your health history and goals.",
        "What your stay gives you: a programme planned around your health history and goals, a doctor who plans your care and reviews your progress during admission, a villa in the village gardens, and a patient care team for practical arrangements before you travel.",
      ],
      points: [
        "You are planning a residential Ayurveda stay for yourself",
        "You are helping someone else plan their stay",
        "You want to speak with a doctor before choosing a programme",
        "You need to confirm villas, meals and travel before you book",
      ],
    },
    offering: {
      kind: "cards",
      kicker: "How a Kairali stay works",
      heading: "What to expect when you choose Kairali",
      cards: [
        { title: "A doctor’s assessment comes first", paragraphs: ["Your Ayurvedic doctor reviews your medical history and examines you before prescribing treatment. Discuss the proposed care, dietary guidance, preparation and recommended length of stay."] },
        { title: "Care reviewed while you stay", paragraphs: ["Your care is reviewed during admission, with next steps discussed before discharge. Ask about the daily routine, meals and sessions included in your programme."] },
        { title: "A patient care team for the practical details", paragraphs: ["Patient care can discuss consultation options, accommodation and the arrangements to confirm before you travel. Mention dietary needs, access requirements or a companion who may travel with you."] },
      ],
    },
    pathway: {
      heading: "How a stay at Kairali begins",
      steps: [
        { title: "Book your free consultation", body: "Tell us what you would like to discuss with the doctor and when you hope to visit. Use the enquiry form or the available contact options." },
        { title: "Agree your plan and quotation", body: "Discuss suitability, the proposed programme and its length. Treatment and accommodation are then confirmed in your care plan and a personalised quotation." },
        { title: "Arrive for your stay", body: "Confirm your dates, villa occupancy and travel, then arrive for admission. Your care is reviewed through the stay." },
      ],
    },
    stay: {
      heading: "See your full plan before you commit",
      paragraphs: ["A personalised quotation lets you review the programme and any additional charges together, before you confirm your booking."],
      lists: [
        { heading: "Check that it covers", items: ["Your programme and recommended number of nights", "Villa category, dates and occupancy", "The meals and sessions included", "The doctor reviews included in your care"] },
        { heading: "Ask about separately", items: ["Medicines and tests", "Specialist services", "Transport", "Personal extras"], extra: true },
      ],
      after: ["Review the booking terms before making a payment."],
    },
    doctors: {
      heading: "Meet Kairali’s Ayurvedic doctors",
      intro: "Your doctor assesses your health history, plans your care and reviews your progress. Ask about doctor availability when you enquire.",
    },
    faqHeading: "Questions about Kairali",
    closing: {
      heading: "Talk with patient care",
      paragraphs: ["Tell us what you would like to discuss with the doctor and when you hope to visit. Your free initial doctor consultation is the starting point for discussing suitability; treatment and accommodation are confirmed separately in your care plan and quotation."],
    },
  },
  faq: [
    { q: "Where is Kairali – The Ayurvedic Healing Village?", a: "The Healing Village is in Palakkad, Kerala. This page is for that residential Ayurvedic hospital. Tell patient care where you will travel from and discuss the admission plan, accommodation and onward travel arrangements before you book." },
    { q: "What does Kairali’s Ayurvedic heritage refer to?", a: "It refers to the family tradition of Ayurveda behind Kairali. The Healing Village is an Ayurvedic hospital of the Kairali Ayurvedic Group. For your own stay, the practical starting point is a consultation with the current medical team to discuss your health, proposed programme and arrangements for care." },
    { q: "How do I find the right programme?", a: "Begin with your health history, current treatment and goals. Ask the doctor to explain the programme being considered, its therapies, preparation and suitable duration. Confirm the exact care plan and inclusions with the team before arranging your stay." },
    { q: "Is the initial doctor consultation free?", a: "Yes. Your initial doctor consultation is free. Use it to discuss your needs and ask about programme suitability. Before booking a stay, request a quotation explaining the treatment, accommodation, doctor reviews and any later services, along with separately charged items." },
    { q: "What should I check before booking?", a: "Confirm the recommended programme, number of nights, villa category and occupancy in your quotation. Ask which care, meals and sessions are included, and which medicines, tests, additional services or travel arrangements cost extra. Review the booking terms before making a payment." },
  ],
});
