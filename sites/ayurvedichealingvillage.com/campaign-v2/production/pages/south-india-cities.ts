// /Ayurveda_Treatment_Neo_S.India_Cities.html — next-five/south-india-cities.md, variant D (Direct), buyer: South
// India searcher planning travel to the one Palakkad property. Copy adapted from the reviewed brief for sales clarity
// (kairali-akshar-marketing-science CREATE+REVIEW); facts only from the brief and data/doctors.ts. No city branches,
// distances, travel times or flight claims (the brief states none); no offers. "30 villas" is the brief's own fact.
import { defineCopy } from "../copy.ts";
import { story } from "../stories.ts";

export default defineCopy({
  slug: "south-india-cities",
  route: "/Ayurveda_Treatment_Neo_S.India_Cities.html",
  source: { file: "next-five/south-india-cities.md", sha256: "2f2afb933f422e5eb356c8e2c093db8f470aaa89105a9f31c187103dda58e187" },
  // The brief's SEO metadata, verbatim.
  seo: {
    title: "Ayurvedic Treatment in South India | Kairali",
    description: "Plan Ayurvedic treatment in Palakkad, Kerala, with individual assessment, residential care and practical travel planning. Start with a free initial consultation.",
  },
  adMatch: {
    keywords: [
      "ayurvedic treatment in south india",
      "ayurvedic treatment south india",
      "ayurvedic treatment in kerala",
      "ayurvedic treatment in palakkad kerala",
    ],
    adHeadlines: [],
  },
  hero: {
    overline: "Residential Ayurveda · Palakkad, Kerala",
    h1: "Ayurvedic treatment in South India",
    standfirst: "Plan a residential Ayurveda stay in Palakkad, Kerala, starting with an individual consultation before you book any travel.",
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
      heading: "One clear destination for your care",
      paragraphs: [
        "If you are comparing Ayurvedic treatment in South India, begin with the location and the care you need. Kairali – The Ayurvedic Healing Village is an NABH-accredited Ayurvedic hospital in Palakkad, Kerala. Your enquiry is for a stay at this one property, wherever you are travelling from.",
        "You can start the conversation before choosing flights, trains or other transport. Discuss your health history first, then bring the programme, villa and travel plans together.",
      ],
      points: [
        "You are travelling from elsewhere in South India",
        "You want to speak with a doctor before booking transport",
        "You need to fit care around a set amount of time",
        "Someone may travel with you, with or without treatment",
      ],
    },
    offering: {
      kind: "cards",
      kicker: "Before you plan the trip",
      heading: "Understand the programme before you book travel",
      intro: ["A residential stay may involve prescribed therapies, dietary guidance, suitable yoga or meditation and time to rest. Trained therapists deliver the sessions prescribed by your Ayurvedic doctor."],
      cards: [
        {
          title: "Programmes to discuss",
          links: [{ label: "Explore Ayurvedic treatment programmes", href: "/ayurvedic-treatment-packages.html" }],
          paragraphs: ["Explore programmes such as Panchakarma, rejuvenation, weight management or care related to pain and everyday health concerns. Your assessment guides the choice; a programme name is a starting point for discussion, not a substitute for individual advice."],
        },
        { title: "How your care is reviewed", paragraphs: ["Ask what the proposed programme involves and how care would be reviewed during the stay. Check the current yoga and meditation schedule, and talk through any outside plans with the care team so they fit your programme."] },
        { title: "Time for care, separate from travel", paragraphs: ["The recommended stay depends on your assessment and programme. Ask about preparation and follow-up as well as the residential duration, and keep your travel days separate from it."] },
      ],
    },
    pathway: {
      heading: "Plan the care first, then the travel",
      steps: [
        { title: "Start with a free consultation", body: "Share your health history, reports and current treatment. Tell patient care where you will travel from and the dates you have in mind." },
        { title: "Agree the programme and admission", body: "The doctor explains the proposed programme and recommended stay. Patient care then helps you clarify admission dates, villa accommodation and any assistance you need on arrival." },
        { title: "Arrange arrival and departure", body: "Share your proposed travel details and ask about transport options and charges. Confirm any transfer explicitly before relying on it, so your arrival and return fit the agreed plan." },
      ],
    },
    // AHV-WB.249.villa-gallery and .guest-video (staff review 9 Oct 2026; owner's standing authority for approved
    // villa photographs and on-page guest video; production/section-order.ts D_VILLAGE_AND_STORIES). Reviewed copy
    // reused verbatim: the village from treatment-kerala.ts, the consented registry films from lp-hospital-kerala.ts.
    // No new facts, names, countries or quotes.
    place: {
      heading: "Choose a villa that suits who is travelling",
      paragraphs: ["Kairali has 30 villas across four categories. Tell patient care who is travelling with you and any room-access or occupancy preferences, then confirm the accommodation available for your dates."],
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
      heading: "Know what to confirm before you travel",
      paragraphs: ["Kairali has 30 villas across [Classic](/classic-villa/), [Deluxe](/deluxe-villa/), [Royal](/royal-villa/) and [Maharaja Suite](/maharaja-suite/) categories. Explain who is travelling, who will receive treatment and any room-access or assistance needs."],
      lists: [
        { heading: "Your quotation should show", items: ["The recommended programme and number of nights", "Your villa, occupancy and taxes", "The care included in your programme", "Companion arrangements for your dates"] },
        { heading: "Ask to see these separately", items: ["Medicines and tests", "Specialist services", "Transport and transfers", "Personal extras"], extra: true },
      ],
    },
    doctors: {
      heading: "Meet your Ayurvedic doctors",
      intro: "Your doctors assess your health history, plan your care and review your progress. Confirm doctor availability when you enquire.",
    },
    faqHeading: "Your questions, answered",
    closing: {
      heading: "Tell us where you are travelling from",
      paragraphs: ["Share your starting point and what you would like to discuss with the doctor. We will help you plan the next step in Palakkad, beginning with a free initial consultation."],
    },
  },
  faq: [
    { q: "Is the treatment centre in my home city?", a: "This page is for Kairali – The Ayurvedic Healing Village in Palakkad, Kerala, and your enquiry is about care at that property. Tell the team where you are travelling from so the location and travel arrangements are clear from the start." },
    { q: "Can I speak with the team before making travel bookings?", a: "Yes. Begin with the initial consultation and a discussion of your needs, available time and preferred dates. Confirm the programme, accommodation and admission arrangements before committing to transport." },
    { q: "Which airport or station should I use?", a: "Share your starting point and proposed itinerary with patient care. Ask about suitable arrival options and onward travel to the Healing Village. Confirm any transfer, timing and cost for your particular trip." },
    { q: "How much time should I set aside?", a: "The recommended stay depends on your assessment and programme. Ask about preparation and follow-up as well as the residential duration. Allow separately for travel rather than assuming it is included in the programme length." },
    { q: "Can I bring a family member or companion?", a: "Discuss who will travel and whether each person wants treatment. Confirm the care, meals, occupancy, support and charges that apply to each traveller. A shared booking does not necessarily mean an identical programme." },
    { q: "What should I bring for the doctor?", a: "Bring relevant medical reports, prescriptions and details of supplements or earlier treatment. Tell the team about allergies, dietary advice, mobility and other practical needs before arrival." },
    { q: "Is the initial consultation free?", a: "Yes. The initial doctor consultation is free; use it to discuss suitability. Treatment, tests, medicines and later services are separate as applicable, so review your programme quotation before booking the stay." },
  ],
});
