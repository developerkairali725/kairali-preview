// /lp/kairali-cleansing-centre/ — lp-batch/kairali-cleansing-centre.md, variant A, a buyer unsure whether
// "cleansing", Panchakarma or rejuvenation fits them. Copy adapted from the reviewed brief for sales clarity
// (kairali-akshar-marketing-science CREATE+REVIEW); facts only from the brief and data/doctors.ts. No toxin, detox
// or fixed-duration claim in visible copy. Villa cards copied from pain-management.ts (spec). sha256 as recorded in
// lp-batch/NONPUBLIC/LP-COPY-FACT-AUDIT.json (not recomputed in this session).
import { defineCopy } from "../copy.ts";
import { story } from "../stories.ts";

export default defineCopy({
  slug: "lp-cleansing-centre",
  route: "/lp/kairali-cleansing-centre/",
  source: { file: "lp-batch/kairali-cleansing-centre.md", sha256: "b1a259a652ef8f0f0f7e69de3e4d3af51f8a0734cebf40154aaa9aeb3134a002" },
  seo: {
    title: "Ayurvedic Cleansing Programmes in Kerala | Kairali",
    description: "Explore doctor-guided Ayurvedic cleansing care at Kairali in Palakkad, Kerala. Discuss your needs in a free initial doctor consultation.",
  },
  adMatch: { keywords: ["ayurvedic hospital kerala", "ayurvedic cleansing centre", "panchakarma detox kerala", "kairali healing village"], adHeadlines: [] },
  hero: {
    overline: "Kairali Cleansing Centre · Palakkad",
    h1: "Ayurvedic cleansing programmes in Kerala",
    standfirst: "Understand the programme before you plan your stay, from preparation and prescribed care to follow-up, with an Ayurvedic doctor at Kairali.",
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
      heading: "Find out what cleansing would mean for you",
      paragraphs: [
        "If you are looking into Ayurvedic cleansing, Panchakarma or rejuvenation, you will often see the terms used side by side. They can refer to different plans of care, and your medical history and assessment guide the choice.",
        "At Kairali – The Ayurvedic Healing Village, an NABH-accredited Ayurvedic hospital in Palakkad, Kerala, your doctor explains the preparation, prescribed procedures and recommended duration before treatment begins.",
        // AHV-WB.385.benefit-copy (staff workbook): one plain line on the stay itself, from this page's own reviewed facts; no outcome.
        "During your stay, prescribed sessions, meals and rest share one daily routine, and the time between sessions is yours to slow down, sit quietly or rest in your villa.",
      ],
      points: [
        "You are unsure whether cleansing, Panchakarma or rejuvenation fits",
        "You want to know what preparation involves before you commit",
        "You take medicines and want them considered in the plan",
        "You need the programme to fit the time you can set aside",
      ],
    },
    offering: {
      kind: "cards",
      kicker: "Your programme",
      heading: "Understand each part before you begin",
      intro: ["Your assessment decides what your programme includes. Use these as questions for your consultation, not as a fixed schedule for everyone."],
      cards: [
        { title: "Preparation, planned for you", paragraphs: ["Ask what preparation is needed and when it begins. Share your current medicines, previous treatment and any concerns about the proposed care. The preparation and schedule are chosen for your individual plan."] },
        { title: "Procedures chosen after assessment", paragraphs: ["Your doctor selects the appropriate procedures after assessment. A Panchakarma programme does not automatically include every classical procedure. Ask what is proposed, how it is supervised and how your care will be reviewed during the stay."] },
        { title: "Meals, rest and continuing care", paragraphs: ["Programme meals are prepared in the hospital kitchen, and diet and rest form part of the daily routine. Before discharge, discuss what to continue at home and whether any follow-up is recommended."] },
      ],
    },
    pathway: {
      heading: "From your first question to your programme",
      steps: [
        { title: "A free initial consultation", body: "Share your questions, current treatment and available dates. The doctor helps you understand whether a programme may suit you and what it would involve." },
        { title: "Your plan and quotation", body: "Confirm the exact programme, number of nights and accommodation, counting any preparation and travel days." },
        { title: "Your stay at the village", body: "Follow your prescribed programme, with your care reviewed during the stay and guidance discussed before discharge." },
      ],
    },
    rest: {
      heading: "Room to rest between procedures",
      paragraphs: ["Rest is part of the daily routine, not an afterthought. Between prescribed sessions and meals, leave space to slow down, sit quietly or rest in your villa. Let the schedule your doctor sets guide the pace of each day."],
    },
    place: {
      heading: "Choose your villa for the stay",
      paragraphs: ["Explore the villa categories below, then confirm the accommodation and occupancy for your dates with patient care before booking."],
      villas: [
        { name: "Deluxe Villa", body: "A king-size bed and private bathroom, with Wi-Fi, TV and air conditioning.", link: { label: "Explore Deluxe Villa", href: "/deluxe-villa/" } },
        { name: "Classic Villa", body: "Garden views and a private bathroom, with Wi-Fi, TV and air conditioning.", link: { label: "Explore Classic Villa", href: "/classic-villa/" } },
        { name: "Royal Villa", body: "A king-size bed, living area and garden access, with Wi-Fi, TV, air conditioning, a kettle and hair dryer.", link: { label: "Explore Royal Villa", href: "/royal-villa/" } },
        { name: "Maharaja Suite", body: "A king-size bed, a living area with a couch and garden access in a premium location.", link: { label: "Explore Maharaja Suite", href: "/maharaja-suite/" } },
      ],
    },
    stories: {
      heading: "Watch before you decide",
      body: "Learn about Panchakarma, see the village and hear patients describe their stays in their own words. Individual experiences vary.",
      films: [
        story("07tVC2oXd8g", "Watch the Panchakarma film"),
        story("iPARaMRASUs", "A day at the village"),
        story("4x01PtWfNnk", "Watch Michaela & Jan’s experience"),
      ],
    },
    stay: {
      heading: "Know the full plan before you decide",
      paragraphs: ["Request a personalised quotation covering the care included in your stay, so you understand the full plan before making a decision."],
      lists: [
        { heading: "Confirm in your quotation", items: ["The exact programme and number of nights", "Villa category and occupancy", "The care, meals and sessions included"] },
        { heading: "Check separately", items: ["Medicines and tests", "Specialist services and additional sessions", "Transport and personal extras"], extra: true },
      ],
      after: ["Review the booking terms before making a payment."],
    },
    doctors: {
      heading: "The doctors who plan your programme",
      intro: "Your doctor assesses your health history, plans your care and reviews your progress. Ask about doctor availability when you enquire.",
    },
    faqHeading: "Questions about cleansing programmes",
    closing: {
      heading: "Find out whether a programme suits you",
      paragraphs: ["Share your questions, current treatment and available dates. Begin with a free initial doctor consultation to understand whether a programme may suit you and what it would involve."],
    },
  },
  faq: [
    { q: "Is every cleansing programme Panchakarma?", a: "No. Ask the doctor to identify the exact programme being considered and explain its purpose, prescribed procedures and preparation. Panchakarma and rejuvenation are distinct choices, and the suitable care and duration depend on your individual assessment." },
    { q: "Can I choose individual procedures myself?", a: "Your doctor determines which procedures are suitable after reviewing your health history and examining you. Use the consultation to ask what each proposed part of the programme involves, how it is supervised and what preparation or follow-up is needed." },
    { q: "How long should I stay?", a: "The duration depends on the exact programme and your assessment. Tell the doctor how much time you have available, then confirm the recommended nights, preparation and follow-up." },
    { q: "Is the initial doctor consultation free?", a: "Yes. Your initial doctor consultation is free. Use it to discuss your needs and ask about programme suitability. Before booking a stay, request a quotation explaining the treatment, accommodation, doctor reviews and any later services, along with separately charged items." },
    { q: "What should I check before booking?", a: "Confirm the recommended programme, number of nights, villa category and occupancy in your quotation. Ask which care, meals and sessions are included, and which medicines, tests, additional services or travel arrangements cost extra. Review the booking terms before making a payment." },
  ],
});
