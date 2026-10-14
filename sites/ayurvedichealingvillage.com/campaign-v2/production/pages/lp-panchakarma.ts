// /lp/panchkarma-treatment/ — final-batch/lp-panchakarma.md, variant D, a buyer comparing Panchakarma packages and
// cost. Copy adapted from the reviewed brief for sales clarity (kairali-akshar-marketing-science CREATE+REVIEW);
// facts only from the brief and data/doctors.ts. The quotation is personal; no price. Distinct angle from
// panchakarma.ts (package comparison, cards rather than the numbered row). sha256 as recorded in
// final-batch/NONPUBLIC/AUDIENCE-KEYWORDS-FACTS.json (not recomputed in this session).
import { defineCopy } from "../copy.ts";

export default defineCopy({
  slug: "lp-panchakarma",
  route: "/lp/panchkarma-treatment/",
  source: { file: "final-batch/lp-panchakarma.md", sha256: "b213aea9032572b5250e6b0591e763867462dac613339628da669f2f87282781" },
  seo: {
    title: "Panchakarma Treatment in Kerala | Kairali",
    description: "Discuss Panchakarma treatment in Kerala with Kairali’s Ayurvedic doctors. Understand assessment, prescribed procedures, diet and residential stay planning.",
  },
  adMatch: { keywords: ["panchakarma treatment in kerala", "panchakarma packages in kerala", "panchakarma treatment cost"], adHeadlines: [] },
  hero: {
    overline: "NABH-accredited Ayurvedic hospital · Palakkad",
    h1: "Panchakarma treatment planned around your assessment",
    standfirst: "Your health history, current medicines and available time help the doctor assess whether Panchakarma is suitable, before you plan your stay.",
  },
  cta: {
    primary: "Get Free Doctor Consultation",
    primarySupport: "Your initial consultation is free. Ask for a quotation covering treatment and any later services.",
    secondary: "Ask Anything",
  },
  programDefault: "Panchakarma",
  doctors: ["deepu-john", "rahul-r", "akhila-oommen", "adhina-ub", "aashitha-ps"],
  page: {
    lead: {
      heading: "Comparing Panchakarma packages? Start with your needs",
      paragraphs: [
        "When you compare Panchakarma packages, it is natural to look at length and cost first. At Kairali, the programme is not picked from a list: your doctor first assesses whether Panchakarma is suitable, which procedures may be considered and how long you would need.",
        "Kairali – The Ayurvedic Healing Village is an NABH-accredited Ayurvedic hospital in Palakkad, Kerala. The published Panchakarma programme is a 14–21 night stay; discuss the time you can set aside and confirm the recommended duration before arranging travel.",
      ],
      points: [
        "You are comparing Panchakarma packages and what they cost",
        "You are unsure which procedures, if any, would suit you",
        "You want to know how many nights to plan for",
        "You need a quotation you can check before booking",
      ],
    },
    offering: {
      kind: "cards",
      kicker: "What the programme involves",
      heading: "Know what you are comparing",
      cards: [
        { title: "Five classical procedures, chosen individually", paragraphs: ["Panchakarma refers to five classical Ayurvedic procedures: Vamanam, Virechanam, Vasti, Nasyam and Raktamokshana. An admission does not automatically include all five; the doctor explains which, if any, are appropriate and what preparation they require."] },
        { title: "Sessions under physician supervision", paragraphs: ["After assessment, your doctor discusses the proposed procedures, preparation and therapy schedule. Trained therapists carry out prescribed sessions under physician supervision, and your progress is reviewed."] },
        { title: "Meals, rest and what comes after", paragraphs: ["Your stay makes time for prescribed meals and rest. Discuss suitable yoga or meditation sessions, and what you should continue after discharge."] },
      ],
    },
    pathway: {
      heading: "How your Panchakarma stay is planned",
      steps: [
        { title: "A free initial consultation", body: "Share your symptoms, diagnoses, current medicines and previous treatment. Bring relevant medical records and mention any dietary needs or practical assistance you may require." },
        { title: "Your plan and personal quotation", body: "Patient care prepares a quotation for your programme, dates, duration and occupancy." },
        { title: "Your stay at the Healing Village", body: "Follow your prescribed programme from your villa, with gardens and space to rest between appointments." },
      ],
    },
    stay: {
      heading: "Your quotation is personal to you",
      paragraphs: ["Panchakarma is planned after assessment, so your quotation is prepared for your recommended programme, duration, dates and villa choice, rather than as a fixed package."],
      lists: [
        { heading: "Confirm in your quotation", items: ["The recommended programme and duration", "Villa choice and occupancy", "Meals, doctor reviews, therapies and activities"] },
        { heading: "Ask about separately", items: ["Medicines and tests", "Additional sessions", "Transport and personal services"], extra: true },
      ],
    },
    doctors: {
      heading: "The doctors planning your care",
      intro: "Our Ayurvedic doctors assess your needs, prescribe care and review your progress. Ask about doctor availability when you enquire.",
    },
    faqHeading: "Before you compare packages",
    closing: {
      heading: "Discuss your Panchakarma stay",
      paragraphs: ["Tell us what you hope to address, where you will travel from and the time you have available. Patient care can help arrange your free initial consultation and explain the next steps."],
    },
  },
  faq: [
    { q: "Do I need to choose procedures before I enquire?", a: "No. Describe your needs and goals to the doctor. Assessment determines whether a Panchakarma programme is appropriate and which procedures may be considered. You do not need to select a treatment schedule yourself." },
    { q: "Will my stay include every Panchakarma procedure?", a: "Not automatically. Your doctor selects appropriate procedures and explains their preparation, suitability and availability. The programme is individual rather than a fixed list for every patient." },
    { q: "Can I fit Panchakarma into a short visit?", a: "The published programme is a 14–21 night stay. Share your available dates before choosing a programme. Ask the doctor what duration is appropriate; do not assume that a shorter visit provides the same care." },
    { q: "Can I discuss an existing health condition?", a: "Yes. Share your medical records, current medicines and previous treatment. The doctor can discuss suitability, realistic expectations and any further information needed. Individual responses vary, and a consultation cannot promise an outcome." },
    { q: "How is the programme cost confirmed?", a: "Patient care prepares a quotation for your programme, dates, duration and occupancy. Check the included care and separately charged items before booking. Your initial doctor consultation is free; ask for a quotation covering your care and any later services." },
  ],
});
