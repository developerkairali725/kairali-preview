// /lp/ayurvedic-hospital-kerala/ — lp-batch/ayurvedic-hospital-kerala.md, variant A, a buyer checking who assesses
// and admits them. Copy adapted from the reviewed brief for sales clarity (kairali-akshar-marketing-science
// CREATE+REVIEW); facts only from the brief and data/doctors.ts. Villa cards copied from pain-management.ts (spec).
// sha256 as recorded in lp-batch/NONPUBLIC/LP-COPY-FACT-AUDIT.json (not recomputed in this session).
import { defineCopy } from "../copy.ts";
import { story } from "../stories.ts";

export default defineCopy({
  slug: "lp-hospital-kerala",
  route: "/lp/ayurvedic-hospital-kerala/",
  source: { file: "lp-batch/ayurvedic-hospital-kerala.md", sha256: "456365a076e4afbe10a447bca4ba9e54d89ac70f5579c8f198981caaf5b38b7c" },
  seo: {
    title: "Ayurvedic Hospital in Kerala | Kairali Healing Village",
    description: "Explore doctor-guided residential care at Kairali, an Ayurvedic hospital in Palakkad, Kerala. Start with a free initial doctor consultation.",
  },
  adMatch: { keywords: ["ayurvedic hospital kerala", "wellness kerala ayurveda", "ayurvedic treatment centre palakkad", "panchakarma hospital india"], adHeadlines: [] },
  hero: {
    overline: "Kairali Healing Village · Palakkad, Kerala",
    h1: "Ayurvedic hospital in Kerala",
    standfirst: "Discuss your care at an NABH-accredited Ayurvedic hospital with residential villas, prescribed programmes and time to rest in the village gardens.",
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
      heading: "Know who will assess you before you are admitted",
      paragraphs: [
        "Choosing a residential Ayurveda programme means trusting people you have not met yet. Before you commit, you need to know who will assess you, how your care is planned and what your stay involves.",
        "At Kairali – The Ayurvedic Healing Village, an NABH-accredited Ayurvedic hospital in Palakkad, Kerala, an Ayurvedic doctor reviews your medical history and examines you before prescribing treatment. Your programme is reviewed during your stay, and the next steps are discussed before discharge.",
        // AHV-WB.342.benefit-copy (staff workbook): one plain line on the stay itself, from this page's own reviewed facts; no outcome.
        "Once you are admitted, physicians review your care through the stay, and your villa in the village gardens gives you a quiet place to pause between appointments.",
      ],
      points: [
        "You want a doctor’s assessment before any treatment begins",
        "You are comparing residential Ayurveda options in Kerala",
        "You need mobility, dietary or companion arrangements in place",
        "You want a clear quotation before you book travel",
      ],
    },
    offering: {
      kind: "cards",
      kicker: "Admission to discharge",
      heading: "What hospital-led care means for your stay",
      intro: ["Your care follows a prescribed plan from the first assessment to the day you leave. Ask about each stage in your free initial consultation."],
      cards: [
        { title: "An assessment before any prescription", paragraphs: ["Bring your symptoms, diagnoses, reports and current medicines. Your doctor reviews your medical history and examines you, then explains the proposed programme and the care being considered for you."] },
        { title: "Physician reviews through your stay", paragraphs: ["Therapies and daily routines follow your prescribed plan, with physician reviews during the stay. Raise questions or practical difficulties as they arise, so they can be discussed as part of your care."] },
        { title: "Guidance before you return home", paragraphs: ["Before discharge, discuss the diet, daily routine and follow-up recommended for you. Confirm any medicines or appointments, the charges that apply and whom to contact if you need further guidance."] },
      ],
    },
    pathway: {
      heading: "Three steps from enquiry to admission",
      steps: [
        { title: "Start with a free consultation", body: "Tell the doctor what you would like to address, your health history and the medicines you take. Ask about programme suitability and the recommended duration." },
        { title: "Review your plan and quotation", body: "Understand the proposed therapies and daily routine. Then review a quotation covering your programme, accommodation and included care, with any extra charges set out." },
        { title: "Arrive for admission", body: "Settle into your villa and follow your prescribed plan, with physician reviews through the stay. Tell the team if your needs change." },
      ],
    },
    rest: {
      heading: "Time to rest in the village gardens",
      paragraphs: ["Between appointments, the pace slows. Your villa sits within the village gardens, so a quiet walk or a moment outdoors is close at hand. Let your prescribed plan shape the day, with room to pause rather than hurry from one session to the next."],
    },
    place: {
      heading: "Choose a villa that suits your needs",
      paragraphs: ["Residential accommodation is in villas within the village gardens. Tell patient care about mobility needs, dietary requirements or a companion who may travel with you, then confirm the room layout and occupancy before booking."],
      villas: [
        { name: "Deluxe Villa", body: "A king-size bed and private bathroom, with Wi-Fi, TV and air conditioning.", link: { label: "Explore Deluxe Villa", href: "/deluxe-villa/" } },
        { name: "Classic Villa", body: "Garden views and a private bathroom, with Wi-Fi, TV and air conditioning.", link: { label: "Explore Classic Villa", href: "/classic-villa/" } },
        { name: "Royal Villa", body: "A king-size bed, living area and garden access, with Wi-Fi, TV, air conditioning, a kettle and hair dryer.", link: { label: "Explore Royal Villa", href: "/royal-villa/" } },
        { name: "Maharaja Suite", body: "A king-size bed, a living area with a couch and garden access in a premium location.", link: { label: "Explore Maharaja Suite", href: "/maharaja-suite/" } },
      ],
    },
    stories: {
      heading: "See the village and hear from patients",
      body: "Watch a day at the village and hear patients describe their stays in their own words. Individual experiences vary.",
      films: [
        story("iPARaMRASUs", "A day at the village"),
        story("4x01PtWfNnk", "Watch Michaela & Jan’s experience"),
        story("3vWviQfW1Ug", "Watch Supriya Agarwal’s experience"),
      ],
    },
    stay: {
      heading: "Know exactly what your stay covers",
      paragraphs: ["Your quotation is prepared for your own programme, dates and villa. Review it in full before you confirm the stay."],
      lists: [
        { heading: "Ask your quotation to set out", items: ["Your recommended programme and number of nights", "Villa category and occupancy", "The care, meals and sessions included", "Doctor reviews during your stay"] },
        { heading: "Ask about separate charges", items: ["Tests and medicines", "Specialist services", "Transport", "Personal needs"], extra: true },
      ],
      after: ["Review the booking terms before making a payment."],
    },
    doctors: {
      heading: "Meet the doctors who plan your care",
      intro: "Your doctor assesses your health history, plans your care and reviews your progress. Ask about doctor availability when you enquire.",
    },
    faqHeading: "Questions before admission",
    closing: {
      heading: "Discuss your admission with a doctor",
      paragraphs: ["Tell us what you would like to address and the dates you have available. Begin with a free initial doctor consultation and discuss your admission needs before planning travel."],
    },
  },
  faq: [
    { q: "Is Kairali an Ayurvedic hospital?", a: "Kairali – The Ayurvedic Healing Village is an NABH-accredited Ayurvedic hospital in Palakkad, Kerala, with residential villa accommodation. Your doctor assesses your health and prescribes the programme, with care reviewed during the stay and guidance discussed before discharge." },
    { q: "What should I bring to the consultation?", a: "Be ready to discuss your symptoms, diagnoses, previous care and current medicines. Share relevant reports and ask the team whether any further information is needed for admission. Tell the doctor about your goals and practical needs for the stay." },
    { q: "Can a companion stay with me?", a: "Discuss this with patient care before admission. Explain who will receive treatment, who will accompany them and what assistance may be needed. Confirm accommodation, meals, access arrangements and any companion charges in your quotation before booking." },
    { q: "Is the initial doctor consultation free?", a: "Yes. Your initial doctor consultation is free. Use it to discuss your needs and ask about programme suitability. Before booking a stay, request a quotation explaining the treatment, accommodation, doctor reviews and any later services, along with separately charged items." },
    { q: "What should I check before booking?", a: "Confirm the recommended programme, number of nights, villa category and occupancy in your quotation. Ask which care, meals and sessions are included, and which medicines, tests, additional services or travel arrangements cost extra. Review the booking terms before making a payment." },
  ],
});
