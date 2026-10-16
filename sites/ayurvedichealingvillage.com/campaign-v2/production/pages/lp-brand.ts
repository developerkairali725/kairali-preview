// /lp/kairali-brand/ — lp-batch/kairali-brand.md, variant D, a brand searcher confirming this is the Palakkad
// hospital and how a stay begins. Copy adapted from the reviewed brief for sales clarity
// (kairali-akshar-marketing-science CREATE+REVIEW); facts only from the brief and data/doctors.ts.
// No heritage year in copy (the proof strip carries the approved line). sha256 as recorded in
// lp-batch/NONPUBLIC/LP-COPY-FACT-AUDIT.json (not recomputed in this session).
import { defineCopy } from "../copy.ts";
import { story } from "../stories.ts";

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
        { title: "Agree your plan", body: "Discuss suitability, the proposed programme and its length. Treatment and accommodation are then confirmed in your care plan." },
        { title: "Arrive for your stay", body: "Confirm your dates, villa occupancy and travel, then arrive for admission. Your care is reviewed through the stay." },
      ],
    },
    // AHV-WB.362.villa-gallery and .guest-video (Train J3; staff review 9 Oct 2026; owner's standing authority for approved
    // villa photographs and on-page guest video; production/section-order.ts D_VILLAGE_AND_STORIES): the village section
    // with the route's own approved gallery, and the consented registry films, reused verbatim from the sibling brand page
    // (brand.ts, AHV-WB.272). No new facts, names, countries or quotes.
    place: {
      heading: "Choose a villa set among the gardens",
      paragraphs: ["Your villa is your base between appointments. Walk through the grounds, sit outside your villa or rest in your room. Ask our team about availability, layout, occupancy and any access needs for your dates."],
      villas: [
        { name: "Deluxe Villa", body: "A king-size bed and private bathroom, with Wi-Fi, TV and air conditioning.", link: { label: "Explore Deluxe Villa", href: "/deluxe-villa/" } },
        { name: "Classic Villa", body: "Garden views and a private bathroom, with Wi-Fi, TV and air conditioning.", link: { label: "Explore Classic Villa", href: "/classic-villa/" } },
        { name: "Royal Villa", body: "A king-size bed, living area and garden access, with Wi-Fi, TV, air conditioning, a kettle and hair dryer.", link: { label: "Explore Royal Villa", href: "/royal-villa/" } },
        { name: "Maharaja Suite", body: "A king-size bed, a living area with a couch and garden access in a premium location.", link: { label: "Explore Maharaja Suite", href: "/maharaja-suite/" } },
      ],
    },
    stories: {
      heading: "See the village before you decide",
      body: "Watch a day at the village, then hear patients describe their stays in their own words. Individual experiences vary.",
      films: [
        story("iPARaMRASUs", "A day at the village"),
        story("3vWviQfW1Ug", "Watch Supriya’s experience"),
        story("4x01PtWfNnk", "Watch Michaela & Jan’s experience"),
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
      paragraphs: ["Tell us what you would like to discuss with the doctor and when you hope to visit. Your free initial doctor consultation is the starting point for discussing suitability; treatment and accommodation are confirmed separately in your care plan."],
    },
  },
  faq: [
    { q: "Where is Kairali – The Ayurvedic Healing Village?", a: "The Healing Village is in Palakkad, Kerala. This page is for that residential Ayurvedic hospital. Tell patient care where you will travel from and discuss the admission plan, accommodation and onward travel arrangements before you book." },
    { q: "What does Kairali’s Ayurvedic heritage refer to?", a: "It refers to the family tradition of Ayurveda behind Kairali. The Healing Village is an NABH-accredited Ayurvedic hospital of the Kairali Ayurvedic Group. For your own stay, the practical starting point is a consultation with the current medical team to discuss your health, proposed programme and arrangements for care." },
    { q: "How do I find the right programme?", a: "Begin with your health history, current treatment and goals. Ask the doctor to explain the programme being considered, its therapies, preparation and suitable duration. Confirm the exact care plan and inclusions with the team before arranging your stay." },
    { q: "Is the initial doctor consultation free?", a: "Yes. Your initial doctor consultation is free. Use it to discuss your needs and ask about programme suitability. Treatment and accommodation are confirmed separately in your care plan." },
  ],
});
