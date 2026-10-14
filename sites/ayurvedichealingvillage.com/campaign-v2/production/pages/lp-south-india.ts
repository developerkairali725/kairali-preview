// /lp/ayurveda-treatment-south-india/ — lp-batch/ayurveda-treatment-south-india.md, variant D (Direct), buyer: city
// searcher in Bengaluru, Chennai or Hyderabad weighing a residential stay in Palakkad. Copy adapted from the reviewed
// brief for sales clarity (kairali-akshar-marketing-science CREATE+REVIEW); facts only from the brief, its NONPUBLIC
// audit (LP-COPY-FACT-AUDIT.json) and data/doctors.ts. Travel: only the brief's own "rail or flights via Coimbatore"
// as options to discuss — no distances, travel times, speed or "weekend" claims; no offers.
import { defineCopy } from "../copy.ts";

export default defineCopy({
  slug: "lp-south-india",
  route: "/lp/ayurveda-treatment-south-india/",
  source: { file: "lp-batch/ayurveda-treatment-south-india.md", sha256: "6c3a3b9ddcd1183e27757eee355e4c995f6a7a9eb8a7898e80c8d550b7ae4727" },
  // The brief's SEO title and description, verbatim.
  seo: {
    title: "Ayurvedic Treatment in South India | Kairali, Palakkad",
    description: "Plan Ayurvedic treatment in Palakkad, Kerala. Discuss your care, residential stay and travel from South India in a free initial doctor consultation.",
  },
  adMatch: {
    keywords: ["ayurvedic treatment south india", "ayurveda hospital near bangalore", "panchakarma centre chennai hyderabad", "kairali palakkad"],
    adHeadlines: [],
  },
  hero: {
    overline: "Residential Ayurveda · Palakkad, Kerala",
    h1: "Ayurvedic treatment in South India",
    standfirst: "Plan a stay at Kairali’s NABH-accredited Ayurvedic hospital in Palakkad, with prescribed care, meals and time to rest together in one place.",
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
      heading: "Plan your care before you travel",
      paragraphs: [
        "If you are travelling from Bengaluru, Chennai, Hyderabad or elsewhere in South India, start with the care you need and the time you can set aside. A residential Ayurveda programme gives you one place to follow your prescribed treatment and daily routine during your stay.",
        "At Kairali – The Ayurvedic Healing Village, your doctor assesses your health history and explains the proposed programme. Confirm the recommended stay and accommodation before arranging travel to Palakkad.",
        // AHV-WB.318.benefit-copy (staff workbook): one plain line on the stay itself, from this page's own reviewed facts; no outcome.
        "Once you arrive, your days follow one routine in one place: therapies your doctor plans, meals from the hospital kitchen and a villa in the village gardens where you can rest between appointments.",
      ],
      points: [
        "You live in Bengaluru, Chennai, Hyderabad or nearby",
        "You want treatment, meals and rest in one place",
        "You need to plan care around your time away",
        "You want a doctor’s advice before booking travel",
      ],
    },
    offering: {
      kind: "cards",
      kicker: "During your admission",
      heading: "Care and daily routines in one place",
      intro: ["A residential stay brings your prescribed care, meals and rest into a single daily routine. This is what that routine involves at Kairali."],
      cards: [
        { title: "Therapies your doctor plans", paragraphs: ["During admission, your doctor plans the therapies and reviews your care. Ask about the proposed therapies, preparation and any follow-up before you travel."] },
        { title: "Meals from the hospital kitchen", paragraphs: ["Programme meals are prepared in the hospital kitchen, with dietary guidance that forms part of your prescribed routine. Tell the team about any dietary needs before you arrive."] },
        { title: "Villas in the village gardens", paragraphs: ["Residential villas in the village gardens give you space to rest between appointments. Discuss your practical needs, the daily schedule and any assistance you may require."] },
      ],
    },
    pathway: {
      heading: "Getting from your city to Palakkad",
      steps: [
        { title: "Start with a free consultation", body: "Share your health history and current medicine details with the doctor. Tell patient care where you will be travelling from and your preferred dates." },
        { title: "Confirm your plan and quotation", body: "Confirm your programme, villa occupancy, inclusions and booking terms in a personalised quotation. Keep your travel days separate from the time recommended for care." },
        { title: "Arrange the trip to Palakkad", body: "Discuss arrival by rail or flights via Coimbatore, then confirm the onward trip from the station or airport. Check current routes and travel times when booking, and ask about transfers and charges." },
      ],
    },
    stay: {
      heading: "Before you leave home",
      paragraphs: ["Prepare your medical records, current medicine details and questions for the doctor. Review your personalised quotation and the booking terms before making a payment."],
      lists: [
        { heading: "Check your quotation for", items: ["The recommended programme and number of nights", "Villa category and occupancy", "The care, meals and sessions included", "Booking terms"] },
        { heading: "Ask what costs extra", items: ["Medicines and tests", "Additional services", "Travel arrangements and transfers"], extra: true },
      ],
    },
    doctors: {
      heading: "Meet your Ayurvedic doctors",
      intro: "Your doctor assesses your health history, plans your care and reviews your progress. Ask about doctor availability when you enquire.",
    },
    faqHeading: "Frequently asked questions",
    closing: {
      heading: "Discuss your stay with us",
      paragraphs: ["Tell us where you are travelling from, your available dates and what you would like to discuss with the doctor. Start with a free initial consultation and plan the stay around your care."],
    },
  },
  faq: [
    { q: "Where will my treatment take place?", a: "This programme is at Kairali – The Ayurvedic Healing Village in Palakkad, Kerala. Discuss your travel plans with patient care after the doctor has advised on a suitable programme and length of stay. Confirm admission and accommodation before travelling." },
    { q: "Can I travel from Bengaluru, Chennai or Hyderabad?", a: "Yes, you can enquire about a residential stay from these cities. Discuss rail options or flights via Coimbatore with the team, and confirm current services, travel time and onward transfers before booking. Allow time for the onward trip to Palakkad." },
    { q: "How much time should I set aside?", a: "The suitable length of stay depends on the programme and your individual assessment. Tell the doctor the dates you have available and ask about preparation and follow-up. Allow for travel separately from your recommended time at Kairali." },
    { q: "Is the initial doctor consultation free?", a: "Yes. Your initial doctor consultation is free. Use it to discuss your needs and ask about programme suitability. Before booking a stay, request a quotation explaining the treatment, accommodation, doctor reviews and any later services, along with separately charged items." },
    { q: "What should I check before booking?", a: "Confirm the recommended programme, number of nights, villa category and occupancy in your quotation. Ask which care, meals and sessions are included, and which medicines, tests, additional services or travel arrangements cost extra. Review the booking terms before making a payment." },
  ],
});
