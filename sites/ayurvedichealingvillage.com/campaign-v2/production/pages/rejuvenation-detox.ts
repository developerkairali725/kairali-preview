// /preventive-rejuvenation-detoxification.html — preventive-rejuvenation-detoxification.md, variant C (Editorial),
// buyer choosing between rejuvenation programmes. Copy adapted from the reviewed brief for sales clarity
// (kairali-akshar-marketing-science CREATE+REVIEW); facts only from the brief and data/doctors.ts.
// Minimum stays (7 / 3 nights) are the brief's published facts. Programme links as in treatment-packages.ts.
import { defineCopy } from "../copy.ts";
import { story } from "../stories.ts";

const SITE = "https://ayurvedichealingvillage.com";

export default defineCopy({
  slug: "rejuvenation-detox",
  route: "/preventive-rejuvenation-detoxification.html",
  source: { file: "preventive-rejuvenation-detoxification.md", sha256: "f966b9e3a9b859d076019fe45a4e2be5bff450991c8aeba413e6df06d8b6418e" },
  seo: {
    title: "Ayurvedic Rejuvenation & Detoxification in Kerala | Kairali",
    description: "Make time for rest, renewal and personalised care. Explore doctor-guided care, villas and meals at Kairali Ayurvedic Healing Village in Palakkad.",
  },
  adMatch: {
    keywords: ["ayurvedic rejuvenation treatment", "ayurvedic rejuvenation packages", "ayurvedic detox retreat", "ayurvedic detox retreat kerala"],
    adHeadlines: [],
  },
  hero: {
    overline: "Doctor-guided care · Palakkad, Kerala",
    h1: "Ayurvedic rejuvenation & detoxification in Kerala",
    standfirst: "Make time for prescribed care, nourishing meals and rest, planned with an Ayurvedic doctor for a residential stay at Kairali in Kerala.",
  },
  cta: {
    primary: "Get Free Doctor Consultation",
    primarySupport: "Your initial consultation is free. Ask for a quotation covering treatment and any later services.",
    secondary: "Ask Anything",
  },
  programDefault: "Complete Rejuvenation & Detoxification Therapy",
  doctors: ["deepu-john", "rahul-r", "akhila-oommen", "adhina-ub", "aashitha-ps"],
  page: {
    lead: {
      heading: "Time away, with a plan made around you",
      paragraphs: [
        "Time away gives you space to focus on your daily routine and the care recommended for you. At Kairali – The Ayurvedic Healing Village, an NABH-accredited Ayurvedic hospital in Palakkad, Kerala, your programme starts with a discussion of your health history, sleep, food, activity and goals.",
        "Your doctor assesses your needs and explains the proposed therapies, preparation and length of stay. Care, prescribed meals, yoga, meditation and time to rest then come together around that individual plan.",
        "What your stay gives you: an individual plan from your doctor, vegetarian meals and dietary guidance planned around your programme, yoga and meditation alongside prescribed care and rest, and a recommended daily routine to discuss before you go home.",
      ],
      points: [
        "Your sleep, food or activity is not where you want it",
        "You want time set aside for your own daily routine",
        "You are weighing rejuvenation against Panchakarma",
        "You want to know which programme fits the time you have",
        "You want guidance to continue after you return home",
      ],
    },
    offering: {
      kind: "cards",
      kicker: "Two distinct programmes",
      heading: "Choose the programme that fits your needs and time",
      intro: ["These are distinct programme choices, with different therapy schedules and terms. Your doctor can explain which may suit you and whether a longer stay is recommended."],
      programmeLinks: true,
      cards: [
        {
          title: "Complete Rejuvenation & Detoxification Therapy",
          links: [{ label: "Rejuvenation", href: `${SITE}/holistic-treatment-for-rejuvenation-and-detoxification/` }],
          paragraphs: [
            "This programme has a published minimum stay of seven nights. Ask your doctor about the proposed therapies, the preparation involved and whether your needs call for a longer stay.",
            // DEC-PACKAGE-COMPARISONS (AHV-WB.140): minimum = all-programs-data.js
            // /holistic-treatment-for-rejuvenation-and-detoxification/ 7 (KTAHV/AYT/EN-INR/20260925-R1); inclusions =
            // ayurveda.included[1–3] of english-candidate/final-rates/strings.en.json (two therapies a day).
            "Minimum stay: 7 nights. Included: two Ayurvedic therapies a day, including herbal steam; three vegetarian or vegan meals a day, to the dietary prescription; and daily consultation and monitoring by the attending physician. Your doctor’s plan sets which therapies you receive.",
          ],
        },
        {
          title: "Preventive Health & Regenerative programme",
          links: [{ label: "Preventive Ayurveda", href: `${SITE}/preventive-and-regenerative-treatment/` }],
          paragraphs: [
            "This separately listed programme has a three-night minimum. It has its own therapy schedule and terms, so confirm what it includes before you choose it.",
            // DEC-PACKAGE-COMPARISONS (AHV-WB.140): minimum = all-programs-data.js /preventive-and-regenerative-treatment/ 3
            // (KTAHV/AYT/EN-INR/20260925-R1); the one-therapy exception = ayurveda.included[2] + notes.one_therapy_note of
            // final-rates/strings.en.json; meals and physician = ayurveda.included[1], [3]. No herbal-steam claim (not bound).
            "Minimum stay: 3 nights. Included: one Ayurvedic therapy a day rather than two; three vegetarian or vegan meals a day, to the dietary prescription; and daily consultation and monitoring by the attending physician. Your doctor’s plan sets which therapy you receive.",
          ],
        },
        {
          title: "Not the same as Panchakarma",
          links: [{ label: "Panchakarma", href: `${SITE}/panchakarma-therapy/` }],
          paragraphs: ["A rejuvenation enquiry does not mean that every Panchakarma procedure is appropriate for you. Ask your doctor to explain the purpose of the recommended plan and the procedures it includes."],
        },
      ],
    },
    pathway: {
      heading: "A clear plan before you commit",
      steps: [
        { title: "Start with a free consultation", body: "Share your health history, current treatment, sleep, food and activity, and what you hope to address. Ask whether a stay may suit you." },
        { title: "Confirm your programme", body: "Your doctor recommends a programme and length of stay. Confirm the exact programme name and number of nights before booking." },
        { title: "Follow your plan, then take it home", body: "Attend your prescribed care, vegetarian meals and rest. Before you return home, discuss the daily routine, dietary guidance and any follow-up recommended for you." },
      ],
    },
    rest: {
      heading: "Space to slow down between appointments",
      paragraphs: ["Rest in your villa, take a quiet walk or sit in the village gardens. Ask about the current schedule of talks, workshops, cooking demonstrations and garden visits, and choose the activities that fit your programme."],
    },
    place: {
      heading: "Residential care in Palakkad",
      paragraphs: ["Kairali is an NABH-accredited Ayurvedic hospital with independent villas in the village gardens. Choose your accommodation with our team and confirm the layout, occupancy and any access requirements before you travel."],
      // Villa cards copied exactly from pain-management.ts (writer spec).
      villas: [
        { name: "Deluxe Villa", body: "A king-size bed and private bathroom, with Wi-Fi, TV and air conditioning.", link: { label: "Explore Deluxe Villa", href: "/deluxe-villa/" } },
        { name: "Classic Villa", body: "Garden views and a private bathroom, with Wi-Fi, TV and air conditioning.", link: { label: "Explore Classic Villa", href: "/classic-villa/" } },
        { name: "Royal Villa", body: "A king-size bed, living area and garden access, with Wi-Fi, TV, air conditioning, a kettle and hair dryer.", link: { label: "Explore Royal Villa", href: "/royal-villa/" } },
        { name: "Maharaja Suite", body: "A king-size bed, a living area with a couch and garden access in a premium location.", link: { label: "Explore Maharaja Suite", href: "/maharaja-suite/" } },
      ],
    },
    stories: {
      heading: "Hear from people who have stayed at Kairali",
      body: "Watch patients describe their stays in their own words, and see a day at the village. Individual experiences vary.",
      films: [
        story("4x01PtWfNnk", "Watch Michaela & Jan’s experience"),
        story("iPARaMRASUs", "A day at the village"),
      ],
    },
    stay: {
      heading: "Know what your quotation covers",
      paragraphs: ["Your quotation should set out the care, meals and accommodation for your chosen programme. Review it with our team before you book."],
      lists: [
        { heading: "Check that it includes", items: ["Your villa, dates and occupancy", "Prescribed meals and daily doctor reviews", "Prescribed therapies", "Group yoga and meditation", "Included activities and leisure facilities"] },
        { heading: "Ask about items that may be charged separately", items: ["Medicines and tests", "Specialist therapies and private sessions", "Transport and personal extras"], extra: true },
      ],
      after: ["Before departure, ask about any medicines, follow-up appointments and their charges. Responses to treatment vary, so use your consultations to discuss realistic goals and how progress will be reviewed."],
    },
    doctors: {
      heading: "Meet your Ayurvedic doctors",
      intro: "Our doctors assess your health history, plan your care and review your progress. Ask about doctor availability when you enquire.",
    },
    faqHeading: "Your questions, answered",
    closing: {
      heading: "Make time for your care",
      paragraphs: ["Discuss your health, your goals and the dates you have available. A free initial doctor consultation helps you explore the programme before you commit to a stay."],
    },
  },
  faq: [
    { q: "How is rejuvenation different from Panchakarma?", a: "These are distinct programme choices. Ask your doctor to explain the purpose of the recommended plan, the procedures it includes and any preparation involved. A rejuvenation enquiry does not mean that every Panchakarma procedure is appropriate for you. Your assessment guides the care selected for your stay." },
    { q: "What is the minimum stay for rejuvenation?", a: "Complete Rejuvenation & Detoxification Therapy has a seven-night minimum. The separate Preventive Health & Regenerative programme has a three-night minimum. Your doctor will discuss the suitable duration for you." },
    { q: "What happens during a residential stay?", a: "Your day is arranged around the plan discussed with your Ayurvedic doctor. Ask about the proposed therapies, meals, yoga or meditation and time for rest. Confirm which sessions and amenities are included in your chosen programme, and tell the team about dietary, mobility or other practical needs." },
    { q: "What should I discuss before returning home?", a: "Ask your doctor about the routine and dietary guidance recommended after your stay. Confirm any follow-up appointments, medicines and charges before departure. Bring up questions about fitting the advice into daily life, and make sure you understand who to contact if you need further guidance." },
    { q: "Is the initial doctor consultation free?", a: "Yes. Your initial doctor consultation is free. Share your health history, current treatment and questions to discuss whether a stay may suit you. Treatment and accommodation are confirmed separately before you book." },
  ],
});
