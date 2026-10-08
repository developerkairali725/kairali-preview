// /kairali-cleansing-centre.html — next-five/kairali-cleansing-centre.md, variant A (Quiet Admission), buyer verifying
// the "Kairali Cleansing Centre" setting and what cleansing means here. Copy adapted from the reviewed brief for sales
// clarity (kairali-akshar-marketing-science CREATE+REVIEW); facts only from the brief and data/doctors.ts.
// No toxin-removal, medical-detox or disease-free promise (brief's fact-audit disposition).
import { defineCopy } from "../copy.ts";
import { story } from "../stories.ts";

const SITE = "https://ayurvedichealingvillage.com";

export default defineCopy({
  slug: "cleansing-centre",
  route: "/kairali-cleansing-centre.html",
  source: { file: "next-five/kairali-cleansing-centre.md", sha256: "623016de06a2c82a80ae5fb7f44a908193a457175f4ffcff14c91f4d2395965a" },
  seo: {
    title: "Kairali Cleansing Centre | Ayurvedic Hospital in Kerala",
    description: "Discuss Ayurvedic cleansing programmes at Kairali in Palakkad, Kerala. Understand assessment, prescribed care and stay planning in a free initial consultation.",
  },
  adMatch: {
    keywords: ["kairali cleansing centre", "ayurvedic hospital in kerala", "ayurvedic treatment centre in kerala", "kairali hospital kerala"],
    adHeadlines: [],
  },
  hero: {
    overline: "Kairali Cleansing Centre · Palakkad, Kerala",
    h1: "Ayurvedic cleansing programmes in Kerala",
    standfirst: "Understand the programme, the care and the time it may involve with an Ayurvedic doctor, before you plan a residential stay in Palakkad.",
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
      heading: "Looking for Kairali Cleansing Centre?",
      paragraphs: [
        "This is Kairali – The Ayurvedic Healing Village in Palakkad, Kerala. Our NABH-accredited Ayurvedic hospital offers residential care guided by individual assessment.",
        "Cleansing, detoxification and rejuvenation appear in different Ayurvedic programme names, and they do not all describe the same care. Bring your health history and goals to the conversation, so your doctor can explain the programme that may be appropriate for you.",
      ],
      points: [
        "You searched for a cleansing or detox programme",
        "You are unsure how cleansing differs from Panchakarma",
        "You want to know who would assess you",
        "You take medicines and want them considered",
        "You want to understand the time a programme needs",
      ],
    },
    offering: {
      kind: "cards",
      kicker: "Before you choose",
      heading: "Know which programme is proposed, and why",
      intro: ["Ask your doctor to identify the proposed programme, explain why it is being considered and discuss its preparation, therapies and recommended duration."],
      programmeLinks: true,
      cards: [
        {
          title: "Panchakarma needs its own assessment",
          links: [{ label: "Panchakarma", href: `${SITE}/panchakarma-therapy/` }],
          paragraphs: ["Panchakarma refers to five classical Ayurvedic procedures, but a stay does not automatically include all five. Your medical history and current treatment are part of deciding what is suitable."],
        },
        {
          title: "Rejuvenation and other programmes",
          links: [{ label: "Rejuvenation", href: `${SITE}/holistic-treatment-for-rejuvenation-and-detoxification/` }],
          paragraphs: ["Rejuvenation or another programme may involve a different plan. A programme name alone does not determine which procedures you receive."],
        },
        { title: "Sessions prescribed by your doctor", paragraphs: ["Trained therapists deliver the sessions prescribed by your Ayurvedic doctor. Ask about the purpose and experience of each procedure, any concerns you have, and how your care will be reviewed."] },
        { title: "Guidance beyond the stay", paragraphs: ["Before departure, clarify the advice recommended for you and how follow-up is arranged. Discuss any proposed medicines with the clinicians involved in your care, including questions about interactions and later consultation charges."] },
      ],
    },
    pathway: {
      heading: "From assessment to a planned stay",
      steps: [
        { title: "Share the full picture", body: "Start with a free initial doctor consultation. Bring diagnoses, reports, prescriptions and supplements, with your reason for considering a programme." },
        { title: "Understand the plan and quotation", body: "Discuss preparation, dietary guidance and practical requirements. Review the programme name, duration, accommodation and inclusions together before arranging travel." },
        { title: "Follow your prescribed routine", body: "Vegetarian meals, suitable yoga or meditation and time to rest fit around prescribed care. Tell the team about allergies, dietary restrictions and mobility needs." },
      ],
    },
    rest: {
      heading: "Time to rest around your care",
      paragraphs: ["Between sessions, the pace of a residential stay slows. Walk in the village gardens, sit outside your villa or rest in your room, while prescribed care, meals and quiet time set the rhythm of your day."],
    },
    place: {
      heading: "Plan the residential part of your care",
      paragraphs: ["The Healing Village has 30 villas in Palakkad. Compare the categories below, then confirm occupancy, access and any companion needs with patient care."],
      // Villa cards copied exactly from pain-management.ts (writer spec).
      villas: [
        { name: "Deluxe Villa", body: "A king-size bed and private bathroom, with Wi-Fi, TV and air conditioning.", link: { label: "Explore Deluxe Villa", href: "/deluxe-villa/" } },
        { name: "Classic Villa", body: "Garden views and a private bathroom, with Wi-Fi, TV and air conditioning.", link: { label: "Explore Classic Villa", href: "/classic-villa/" } },
        { name: "Royal Villa", body: "A king-size bed, living area and garden access, with Wi-Fi, TV, air conditioning, a kettle and hair dryer.", link: { label: "Explore Royal Villa", href: "/royal-villa/" } },
        { name: "Maharaja Suite", body: "A king-size bed, a living area with a couch and garden access in a premium location.", link: { label: "Explore Maharaja Suite", href: "/maharaja-suite/" } },
      ],
    },
    stories: {
      heading: "See the village and the care",
      body: "Watch a film on Panchakarma and see a day at the village before you enquire. Individual experiences vary.",
      films: [
        story("07tVC2oXd8g", "Watch the Panchakarma film"),
        story("iPARaMRASUs", "A day at the village"),
      ],
    },
    stay: {
      heading: "See what your quotation covers before you book",
      paragraphs: ["Once the proposed care is understood, review the programme name, duration, accommodation and inclusions together in your quotation."],
      lists: [
        { heading: "Confirm for your dates", items: ["The care and number of nights", "Villa occupancy and taxes", "Meals", "Sessions included in your programme"] },
        { heading: "Ask which items are charged separately", items: ["Medicines and tests", "Specialist services", "Travel arrangements", "Other items in your quotation"], extra: true },
      ],
      after: ["Still comparing options? [Explore Ayurvedic treatment programmes](/ayurvedic-treatment-packages.html)."],
    },
    doctors: {
      heading: "Meet your Ayurvedic doctors",
      intro: "Your doctors assess your health history, plan your care and review progress during your stay. Availability is confirmed when you enquire.",
    },
    faqHeading: "Your questions, answered",
    closing: {
      heading: "Begin with your questions",
      paragraphs: ["Our patient care team will help you discuss the programme and practical arrangements. Start with a free initial doctor consultation, then review your plan and quotation before booking."],
    },
  },
  faq: [
    { q: "Is a cleansing programme always Panchakarma?", a: "No. Programme names should be discussed individually. Ask the doctor whether the recommendation is Panchakarma, rejuvenation or another form of care, and what that specific plan involves." },
    { q: "Can I decide which Panchakarma procedures to have?", a: "You can ask about the procedures, but suitability is decided after assessment. Not every procedure is appropriate for every person, and a stay does not automatically include all five classical procedures." },
    { q: "How long does a cleansing programme take?", a: "The recommended duration depends on the exact programme and your needs. Tell the doctor how much time you can set aside. Confirm the stay and any preparation before booking transport or accommodation." },
    { q: "What should I bring to the consultation?", a: "Bring relevant medical reports and details of prescriptions, supplements, allergies and previous care. Explain what you hope to discuss and any practical limitations that may affect a residential stay." },
    { q: "Can I combine the programme with my current treatment?", a: "Share the full picture with the Ayurvedic doctor and your other treating clinicians. Ask them to review any proposed therapies or medicines alongside your existing care. Combining treatments requires an individual decision." },
    { q: "What does a programme quotation include?", a: "Confirm the care, number of nights, villa occupancy, taxes, meals and sessions included for your dates. Ask for separate charges to be identified clearly, including medicines, tests, specialist services or travel where applicable." },
    { q: "Is the first consultation free?", a: "Yes. The initial doctor consultation is free and can help you understand suitability and the proposed plan. Treatment, tests, medicines and later services are not automatically free." },
  ],
});
