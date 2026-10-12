// /lp/pain-management/ — lp-batch/pain-management.md, variant A, a buyer with ongoing discomfort who wants realistic
// expectations. Copy adapted from the reviewed brief for sales clarity (kairali-akshar-marketing-science
// CREATE+REVIEW); facts only from the brief and data/doctors.ts. Condition page, strictest claims: body areas are
// named only as topics to discuss with the doctor; no diagnosis names, no outcome or recovery-time claim. Distinct
// angle from pain-management.ts (limits and expectations, not a diagnosis list). Villa cards copied from
// pain-management.ts (spec). sha256 as recorded in lp-batch/NONPUBLIC/LP-COPY-FACT-AUDIT.json (not recomputed).
import { defineCopy } from "../copy.ts";
import { story } from "../stories.ts";

export default defineCopy({
  slug: "lp-pain-management",
  route: "/lp/pain-management/",
  source: { file: "lp-batch/pain-management.md", sha256: "bd774a86f3f2b309dac51842e14dba7ddd9362fd31c4ff9fc19413b732298426" },
  seo: {
    title: "Ayurvedic Pain Management in Kerala | Kairali KTAHV",
    description: "Discuss back, neck or joint discomfort with an Ayurvedic doctor at Kairali in Kerala. Explore residential care in a free initial consultation.",
  },
  adMatch: { keywords: ["ayurvedic pain management kerala", "chronic pain ayurveda programme", "ayurvedic hospital palakkad"], adHeadlines: [] },
  hero: {
    overline: "Individual assessment · Palakkad, Kerala",
    h1: "Ayurvedic pain management in Palakkad, Kerala",
    standfirst: "Discuss the discomfort affecting your day, review your medical history with a doctor and understand whether a residential Ayurveda programme may suit you.",
  },
  cta: {
    primary: "Get Free Doctor Consultation",
    primarySupport: "Your initial consultation is free. Ask for a quotation covering treatment and any later services.",
    secondary: "Ask Anything",
  },
  programDefault: "Pain Management",
  doctors: ["deepu-john", "rahul-r", "akhila-oommen", "adhina-ub", "aashitha-ps"],
  page: {
    lead: {
      heading: "When discomfort shapes how you sit, walk, work or sleep",
      paragraphs: [
        "Ongoing discomfort can quietly reorganise your day around it. A useful first step is an honest conversation: tell the doctor where you feel discomfort, how long it has been present and which activities have become difficult.",
        "At Kairali – The Ayurvedic Healing Village, an NABH-accredited Ayurvedic hospital in Palakkad, your Ayurvedic doctor assesses your needs before prescribing care. Together you discuss realistic goals, the proposed therapies and how progress would be reviewed during a stay.",
      ],
      points: [
        "Back or neck discomfort that affects work or sleep",
        "Shoulder or joint discomfort that makes daily tasks harder",
        "Stiffness that limits how you sit, walk or move",
        "Discomfort you want reviewed alongside your current care",
      ],
    },
    offering: {
      kind: "cards",
      kicker: "Your plan",
      heading: "What a plan built on your assessment can include",
      intro: ["Your doctor prescribes care after assessing you. These are topics to discuss in your consultation, not a list every patient receives."],
      cards: [
        { title: "Therapies matched to your assessment", paragraphs: ["The programme may draw on therapies such as Abhyanga, Pizhichil, Kizhi or localised oil-retention treatments, depending on your assessment. Ask what each recommended therapy involves and how it is supervised."] },
        { title: "Diet and a daily routine", paragraphs: ["Your plan may bring together prescribed therapies, dietary guidance and a daily routine, with physician reviews during your admission. Ask how the programme relates to the care you already receive."] },
        { title: "Honest limits, discussed up front", paragraphs: ["A particular result or recovery time cannot be promised. Use the consultation to understand the limits of the proposed programme and what may be appropriate for your situation."] },
        { title: "Practical support for your stay", paragraphs: ["Discuss mobility or assistance needs before you travel. Share any questions about comfort, movement or current treatment before sessions begin."] },
      ],
    },
    pathway: {
      heading: "From your first conversation to admission",
      steps: [
        { title: "Describe what has become difficult", body: "In a free initial consultation, share previous diagnoses, reports, imaging and the treatments or medicines you currently use." },
        { title: "Review the plan and quotation", body: "Confirm the recommended programme, number of nights, accommodation and any assistance you need. Ask for a quotation that sets out the included care and separate charges." },
        { title: "Follow your prescribed plan", body: "Attend your prescribed sessions, with physician reviews through your stay. Before discharge, discuss the recommended routine, dietary guidance and follow-up." },
      ],
    },
    rest: {
      heading: "Space to rest between sessions",
      paragraphs: ["Care is only part of the day. Between sessions there is time to rest in your villa and move at a pace that suits you. Let your prescribed routine set the rhythm, rather than rushing from one appointment to the next."],
    },
    place: {
      heading: "A villa arranged around your comfort",
      paragraphs: ["Tell patient care about mobility or assistance needs before you travel, and confirm the accommodation that works for you. Explore the villa categories below."],
      villas: [
        { name: "Deluxe Villa", body: "A king-size bed and private bathroom, with Wi-Fi, TV and air conditioning.", link: { label: "Explore Deluxe Villa", href: "/deluxe-villa/" } },
        { name: "Classic Villa", body: "Garden views and a private bathroom, with Wi-Fi, TV and air conditioning.", link: { label: "Explore Classic Villa", href: "/classic-villa/" } },
        { name: "Royal Villa", body: "A king-size bed, living area and garden access, with Wi-Fi, TV, air conditioning, a kettle and hair dryer.", link: { label: "Explore Royal Villa", href: "/royal-villa/" } },
        { name: "Maharaja Suite", body: "A king-size bed, a living area with a couch and garden access in a premium location.", link: { label: "Explore Maharaja Suite", href: "/maharaja-suite/" } },
      ],
    },
    stories: {
      heading: "Hear from people who have stayed at Kairali",
      body: "Watch patients describe their stays in their own words. Individual experiences vary.",
      films: [
        story("4x01PtWfNnk", "Watch Michaela & Jan’s experience"),
        story("3vWviQfW1Ug", "Watch Supriya Agarwal’s experience"),
      ],
    },
    stay: {
      heading: "Know what your quotation covers before you book",
      paragraphs: ["Your quotation is prepared for your own programme, dates and villa. Check it in full before arranging travel."],
      lists: [
        { heading: "Confirm in your quotation", items: ["The recommended programme and number of nights", "Villa category and occupancy", "The care, meals and sessions included"] },
        { heading: "Ask about separately", items: ["Medicines and tests", "Specialist services", "Travel and personal extras"], extra: true },
      ],
      after: ["Before you leave, confirm any follow-up appointments or charges."],
    },
    doctors: {
      heading: "Meet your Ayurvedic doctors",
      intro: "Your doctor assesses your health history, plans your care and reviews your progress. Ask about doctor availability when you enquire.",
    },
    faqHeading: "Questions about pain management",
    closing: {
      heading: "Talk through your symptoms with a doctor",
      paragraphs: ["Tell us about your symptoms, how they affect your routine and the care you have already tried. Start with a free initial doctor consultation and discuss the next steps."],
    },
  },
  faq: [
    { q: "What kinds of discomfort can I discuss?", a: "You can enquire about back, neck, shoulder or joint discomfort and stiffness. Describe your symptoms, any diagnosis and the activities affected. Bring relevant records or imaging so the doctor can assess whether an Ayurvedic programme may be appropriate for you." },
    { q: "Can the programme promise a result for my pain?", a: "No. A specific result cannot be promised. Your doctor will assess your health history and discuss realistic goals, the proposed care and how progress will be reviewed. Responses vary, so ask about the limits and expectations of your individual plan." },
    { q: "What about the treatment or medicines I already use?", a: "Bring your current prescriptions and explain the care you are receiving. Discuss any proposed changes with the clinicians involved in your treatment before making them. Ask how the Ayurveda programme would fit alongside your existing care." },
    { q: "Is the initial doctor consultation free?", a: "Yes. Your initial doctor consultation is free. Use it to discuss your needs and ask about programme suitability. Before booking a stay, request a quotation explaining the treatment, accommodation, doctor reviews and any later services, along with separately charged items." },
    { q: "What should I check before booking?", a: "Confirm the recommended programme, number of nights, villa category and occupancy in your quotation. Ask which care, meals and sessions are included, and which medicines, tests, additional services or travel arrangements cost extra. Review the booking terms before making a payment." },
  ],
});
