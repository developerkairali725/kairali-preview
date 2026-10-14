// /treatment-in-kerala.html — next-five/treatment-in-kerala.md, variant A (Quiet Admission), buyer: broad Kerala
// treatment searcher comparing residential centres. Copy adapted from the reviewed brief for sales clarity
// (kairali-akshar-marketing-science CREATE+REVIEW); facts only from the brief, its NONPUBLIC audit and data/doctors.ts.
// "30 villas" and "vegetarian meals" are verifiedFactsUsed in next-five/NONPUBLIC/AUDIENCE-KEYWORDS-FACTS.json (C10).
import { defineCopy } from "../copy.ts";
import { story } from "../stories.ts";

export default defineCopy({
  slug: "treatment-kerala",
  route: "/treatment-in-kerala.html",
  source: { file: "next-five/treatment-in-kerala.md", sha256: "10915bda9dee4f2d54a6dfce72081e98a998bd1794de056621b7f818be0cac30" },
  // The brief's SEO metadata, verbatim.
  seo: {
    title: "Ayurvedic Treatment in Kerala | Kairali",
    description: "Explore doctor-guided Ayurvedic treatment in Palakkad, Kerala. Discuss programmes, residential care, accommodation and your stay in a free initial consultation.",
  },
  adMatch: {
    keywords: [
      "ayurvedic treatment in kerala",
      "ayurvedic treatment packages in kerala",
      "ayurvedic treatment centre in kerala",
      "ayurvedic treatment in palakkad kerala",
      "ayurvedic treatment cost in kerala",
    ],
    adHeadlines: [],
  },
  hero: {
    overline: "Doctor-guided Ayurveda · Palakkad, Kerala",
    h1: "Ayurvedic treatment in Kerala",
    standfirst: "Discuss the care you need with an Ayurvedic doctor first, then plan your programme, villa and stay in Palakkad, Kerala.",
  },
  cta: {
    primary: "Get Free Doctor Consultation",
    primarySupport: "Your initial consultation is free. Ask for a quotation covering treatment and any later services.",
    secondary: "Ask Anything",
  },
  // A broad discovery page: no single programme.
  programDefault: "",
  doctors: ["deepu-john", "rahul-r", "akhila-oommen", "adhina-ub", "aashitha-ps"],
  page: {
    lead: {
      heading: "You don’t need to choose a programme first",
      paragraphs: [
        "You may know exactly what you want to discuss, or only that you are considering Ayurveda for a health concern or a wellbeing goal. At Kairali – The Ayurvedic Healing Village, you start with your health history, current treatment and the reason you are looking into Ayurveda. Our doctors explain the relevant options and whether a residential stay is suitable for you.",
        "Kairali is an NABH-accredited Ayurvedic hospital with residential villas in Palakkad, Kerala. Let the programme, the recommended duration and your practical needs shape the booking. Tell us how much time you have, then leave room to discuss what the proposed care requires before you commit to travel.",
        "What your stay offers: a start with your own health history rather than a programme name, a residential villa in Palakkad, and meals, suitable yoga or meditation and quiet time planned around your treatment schedule.",
      ],
      points: [
        "You are comparing Ayurvedic treatment centres in Kerala",
        "You have a diagnosis and want to know if Ayurveda may suit you",
        "You have a wellbeing goal but no programme name in mind",
        "You want to understand time and cost before you book",
        "You need help with mobility, diet or a travelling companion",
      ],
    },
    offering: {
      kind: "cards",
      kicker: "Your care plan",
      heading: "Explore the treatment questions that matter to you",
      intro: ["Programme names are a starting point for the conversation, not a prescription. Your assessment guides the care proposed for you. You can also compare all [Ayurvedic treatment programmes](/ayurvedic-treatment-packages.html)."],
      // DEC-PACKAGE-COMPARISONS (AHV-WB.230): named examples only, each name + minimumNights from
      // public/ahv/assets/all-programs-data.js (KTAHV/AYT/EN-INR/20260925-R1): /panchakarma-therapy/ 14,
      // /holistic-treatment-for-rejuvenation-and-detoxification/ 7, /weight-loss-programme/ 14,
      // /sleep-restoration-therapy/ 7, /treatment-to-remove-stress-and-strain/ 7. No generic 7/14/21-night stay claim
      // (not established by the bounded sources); the doctor's recommendation and the FAQ's "no single duration" stand.
      cards: [
        { title: "Panchakarma and rejuvenation", paragraphs: [
          "Ask how these programmes differ and what the doctor recommends for your circumstances. Discuss procedures, preparation, dietary guidance and duration, rather than assuming every programme includes the same therapies.",
          "For example, Ayurvedic Panchakarma Detoxification Therapy has a published minimum stay of 14 nights, and Complete Rejuvenation & Detoxification Therapy 7 nights. Your doctor recommends the length of your own stay.",
        ] },
        { title: "Pain and mobility", paragraphs: ["Explain where you feel discomfort and how movement, work, sleep or daily tasks are affected. Share any diagnosis and current treatment. Discuss the proposed care together with access, assistance and companion needs."] },
        { title: "Weight, digestion and daily routine", paragraphs: [
          "Talk through your health history, medicines, meals and everyday activity. Your consultation helps clarify which programme is relevant and what changes or prescribed care may be proposed, so you don’t choose on a programme name alone.",
          "For example, Weight Management & Metabolism Therapy has a published minimum stay of 14 nights.",
        ] },
        { title: "Other health concerns", paragraphs: [
          "The programmes also cover areas such as sleep, stress, women’s health and ongoing conditions. Tell the doctor what you want to discuss, so the scope of care, and any need for other clinical support, is clear from the start.",
          "For example, Sleep Restoration Therapy and Comprehensive Stress Relief & Mental Wellness Program each have a published minimum stay of 7 nights.",
        ] },
      ],
    },
    pathway: {
      heading: "Three steps from first question to your stay",
      steps: [
        { title: "A free initial doctor consultation", body: "Describe your health history, current treatment and goals in your own words. Share medical reports, prescriptions and details of earlier treatment, so the doctor understands the full context." },
        { title: "Your plan and a clear quotation", body: "The doctor explains the proposed programme and recommended duration. Then review a quotation for the programme, nights, villa occupancy and taxes, with included meals, reviews and sessions, before you arrange travel." },
        { title: "Settle into your treatment routine", body: "Trained therapists deliver the sessions your Ayurvedic doctor prescribes. Meals, suitable yoga or meditation and rest fit around them. Keep the care team informed and ask when your progress will be reviewed." },
      ],
    },
    rest: {
      heading: "Room to rest around your treatment",
      paragraphs: ["Between sessions, the day slows down. Walk through the village gardens, sit outside your villa or simply rest. Meals, suitable yoga or meditation and quiet time are planned around your treatment schedule, so you are not rushing from one appointment to the next."],
    },
    place: {
      heading: "Choose a villa that suits who is travelling",
      paragraphs: ["Kairali has 30 villas across four categories. Tell patient care who is travelling with you and any room-access or occupancy preferences, then confirm the accommodation available for your dates."],
      // Villa cards copied exactly from pain-management.ts.
      villas: [
        { name: "Deluxe Villa", body: "A king-size bed and private bathroom, with Wi-Fi, TV and air conditioning.", link: { label: "Explore Deluxe Villa", href: "/deluxe-villa/" } },
        { name: "Classic Villa", body: "Garden views and a private bathroom, with Wi-Fi, TV and air conditioning.", link: { label: "Explore Classic Villa", href: "/classic-villa/" } },
        { name: "Royal Villa", body: "A king-size bed, living area and garden access, with Wi-Fi, TV, air conditioning, a kettle and hair dryer.", link: { label: "Explore Royal Villa", href: "/royal-villa/" } },
        { name: "Maharaja Suite", body: "A king-size bed, a living area with a couch and garden access in a premium location.", link: { label: "Explore Maharaja Suite", href: "/maharaja-suite/" } },
      ],
    },
    // Consented registry films only (data/films.ts).
    stories: {
      heading: "See the village and hear from patients",
      body: "Watch patients describe their stays in their own words, and see the daily setting for yourself. Individual experiences vary.",
      films: [
        story("4x01PtWfNnk", "Watch Michaela & Jan’s experience"),
        story("iPARaMRASUs", "A day at the village"),
        story("07tVC2oXd8g", "Watch the Panchakarma film"),
      ],
    },
    stay: {
      heading: "Know what your quotation covers before you book",
      paragraphs: ["Your quotation brings the programme, accommodation and care together, so you can compare the whole stay rather than a single figure."],
      lists: [
        { heading: "Ask your quotation to set out", items: ["The recommended programme and number of nights", "Villa category, occupancy and taxes", "Included meals, doctor reviews and sessions", "Any companion arrangements for your dates"] },
        { heading: "Ask what may add to the total", items: ["Medicines and tests", "Specialist services", "Travel arrangements", "Other items in your quotation"], extra: true },
      ],
      after: ["Before you leave, discuss the routine recommended for you and any follow-up. Confirm the purpose and charges of later consultations or services, rather than assuming they are part of the original stay."],
    },
    doctors: {
      heading: "Meet your Ayurvedic doctors",
      intro: "Your doctors assess your health history, plan your care and review your progress. Meet the team below; doctor availability is confirmed when you enquire.",
    },
    faqHeading: "Your questions, answered",
    closing: {
      heading: "Share what brings you to Ayurveda",
      paragraphs: ["Tell us about your health history, the time you have available and the questions on your mind. Start with a free initial doctor consultation, and we will help you understand the next step."],
    },
  },
  faq: [
    { q: "Can I enquire before choosing a treatment package?", a: "Yes. Describe your health history, current treatment and goals in your own words. The doctor can explain whether a programme is suitable and which options are relevant to your enquiry." },
    { q: "Is this residential Ayurvedic treatment?", a: "This page concerns care at Kairali – The Ayurvedic Healing Village in Palakkad, with villa accommodation and a prescribed daily routine. Discuss the type of care you need and confirm the admission arrangements with patient care." },
    { q: "How is the recommended length of stay decided?", a: "The doctor considers your needs and the proposed programme. Tell the team how much time you have available, then confirm the recommendation before arranging your travel. There is no single duration suitable for every enquiry." },
    { q: "What should I arrange before travelling?", a: "Discuss suitability, dates, accommodation, access and any assistance needs. Share relevant reports and prescriptions, complete the requested health information and confirm travel arrangements with patient care. If someone is travelling with you, tell the team early." },
    { q: "Can I keep my existing medicines?", a: "Give the Ayurvedic doctor and your other treating clinicians a full list of medicines and supplements. Discuss the proposed plan together where needed, including possible interactions or changes. Individual medical advice should guide those decisions." },
    { q: "What determines Ayurvedic treatment cost in Kerala?", a: "For a stay at Kairali, the recommended programme, duration, accommodation and occupancy inform your quotation. Review the included care and any additional charges for your dates before booking." },
    { q: "Is the initial consultation free?", a: "Yes. The initial doctor consultation is free. It is an opportunity to discuss suitability and ask about the programme. Treatment, tests, medicines and subsequent services are not automatically free." },
  ],
});
