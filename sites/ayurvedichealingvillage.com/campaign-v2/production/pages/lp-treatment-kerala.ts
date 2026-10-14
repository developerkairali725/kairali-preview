// /lp/treatment-in-kerala/ — final-batch/lp-treatment-in-kerala.md, variant C (Editorial), buyer: a first-time or
// undecided visitor comparing Ayurvedic treatment in Kerala. Copy adapted from the reviewed brief for sales clarity
// (kairali-akshar-marketing-science CREATE+REVIEW); facts only from the brief and data/doctors.ts.
// /lp/ route: no outbound programme or villa links in copy (single next step); films are the consented registry only.
import { defineCopy } from "../copy.ts";
import { story } from "../stories.ts";

export default defineCopy({
  slug: "lp-treatment-kerala",
  route: "/lp/treatment-in-kerala/",
  // sha256 as recorded for this frozen brief in review/CLEAN-COPY-FINAL5-REVIEW.json (not recomputed in this session).
  source: { file: "final-batch/lp-treatment-in-kerala.md", sha256: "b19b3a9de60e638e6ebde1b36e51cf7b635a806d644566783d50313535a86407" },
  seo: {
    title: "Ayurvedic Treatment in Kerala | Kairali, Palakkad",
    description: "Plan Ayurvedic treatment at Kairali's NABH-accredited hospital in Palakkad, Kerala. Discuss care options, villa accommodation and your stay with the team.",
  },
  adMatch: { keywords: ["ayurvedic treatment in kerala", "ayurvedic treatment centre in kerala", "ayurvedic treatment in palakkad kerala"], adHeadlines: [] },
  hero: {
    overline: "NABH-accredited Ayurvedic hospital · Kerala",
    h1: "Ayurvedic treatment in Kerala, with a plan you understand",
    standfirst: "Speak with an Ayurvedic doctor about your needs, the care that may suit you and the time to set aside for a stay in Palakkad.",
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
      heading: "Not sure which programme you need? Start there.",
      paragraphs: [
        "You may be exploring Ayurveda for the first time, or considering a programme alongside care you already receive. You do not need a programme name before you enquire. Explain what brings you here, any diagnosis or ongoing treatment, and what you hope to address.",
        "Kairali – The Ayurvedic Healing Village is an NABH-accredited Ayurvedic hospital in Palakkad, Kerala. Residential care brings together an individual assessment, prescribed therapies, meals and time to rest, with doctors reviewing your programme during the stay.",
        // AHV-WB.452.benefit-copy (staff workbook): one plain line on the stay itself, from this page's own reviewed facts; no outcome.
        "Your days bring prescribed therapies, meals and rest into one schedule, with doctors reviewing your programme and time between appointments to walk in the gardens or rest in your villa.",
      ],
      points: [
        "You are exploring Ayurveda for the first time",
        "You want care alongside treatment you already receive",
        "You are weighing Panchakarma, rejuvenation or pain management",
        "You are unsure how much time to set aside for a stay",
        "You would like to travel with a companion",
      ],
    },
    offering: {
      kind: "cards",
      kicker: "Your options",
      heading: "Understand your options before arranging a stay",
      intro: ["A programme name is a starting point for a conversation. Your assessment determines the care and duration that may be appropriate for you."],
      cards: [
        { title: "Panchakarma", paragraphs: ["Panchakarma involves doctor-selected procedures, preparation, diet and rest. A programme does not automatically include all five classical procedures. Ask which, if any, are suitable for you."] },
        { title: "Rejuvenation care", paragraphs: ["Rejuvenation care brings prescribed therapies and daily routines together. Discuss the programme in relation to your health, current treatment and available time."] },
        { title: "Pain management", paragraphs: ["Pain management begins with an assessment of your concerns, medical history and practical needs. Tell the doctor about back, neck or joint discomfort, previous treatment and any limits on movement. The assessment guides the proposed care; outcomes vary between individuals."] },
        { title: "Diet, daily routine and discharge guidance", paragraphs: ["Our doctors can also discuss dietary guidance and daily routines. For each option, ask what your days would involve, how progress is reviewed and what guidance is provided at discharge."] },
      ],
    },
    pathway: {
      heading: "From your first conversation to admission",
      steps: [
        { title: "Start with a free consultation", body: "Share your health history, current medicines and relevant records, and say what you hope to address. The doctor explains suitable options and the information needed to assess you." },
        { title: "Agree your plan and quotation", body: "Review the recommended duration, villa category and occupancy. Ask for a quotation that sets out what is included and what is charged separately, and ask about any preparation before admission." },
        { title: "Settle into your prescribed routine", body: "Your days follow prescribed therapies, meals and rest, with doctors reviewing your programme during the stay. Before discharge, ask which guidance to continue at home." },
      ],
    },
    rest: {
      heading: "Hospital care in a residential village",
      paragraphs: ["Private villas, gardens and spaces for rest support the daily care schedule. Meals are arranged around your prescribed programme, and the hours between appointments are yours: walk in the gardens, sit outside your villa or simply rest."],
    },
    place: {
      heading: "A stay planned around your practical needs",
      paragraphs: [
        "Tell patient care if you are travelling with a companion or need help with access, food or travel arrangements. The team can explain accommodation options and confirm what is available for your dates.",
        "Discuss yoga, meditation and other available activities with the team, so they fit your individual plan.",
      ],
    },
    stories: {
      heading: "See the village and hear from patients",
      body: "Watch a day at the village, a film on Panchakarma and Michaela & Jan describing their stay in their own words. Individual experiences vary.",
      films: [
        story("iPARaMRASUs", "A day at the village"),
        story("4x01PtWfNnk", "Watch Michaela & Jan’s experience"),
        story("07tVC2oXd8g", "Watch the Panchakarma film"),
      ],
    },
    stay: {
      heading: "Know what your stay covers before you book",
      paragraphs: ["Before booking, review your recommended duration, villa category and occupancy. Share your proposed travel dates, keep travel time separate from the programme duration, and confirm arrival arrangements."],
      lists: [
        { heading: "Ask for a quotation that explains", items: ["Your programme, recommended duration and dates", "Villa category and occupancy", "Included meals and doctor reviews", "Prescribed therapies and activities"] },
        { heading: "Ask about separately charged items", items: ["Medicines and tests", "Additional sessions", "Transport", "Personal services"], extra: true },
      ],
      after: ["Your initial doctor consultation is free. Ask for a quotation covering your care and any later services, with the inclusions and any extra charges clearly explained."],
    },
    doctors: {
      heading: "Meet your Ayurvedic doctors",
      intro: "Our Ayurvedic doctors assess your health history, plan prescribed care and review your progress. Ask about availability when arranging your consultation.",
    },
    faqHeading: "Questions before you plan your stay",
    closing: {
      heading: "Talk through your next step",
      paragraphs: ["Tell us what brings you to Ayurveda and when you could travel. Start with a free initial doctor consultation and make an informed plan for your stay."],
    },
  },
  faq: [
    { q: "Do I need a programme in mind before contacting Kairali?", a: "No. Start with your health history, concerns and goals. The doctor can explain suitable options and the information needed to assess you. Patient care helps with consultation and stay arrangements." },
    { q: "What kind of care setting does Kairali provide?", a: "Kairali – The Ayurvedic Healing Village is an NABH-accredited Ayurvedic hospital in Palakkad, Kerala. Patients stay in villas and follow individually prescribed care, with meals and rest planned around treatment." },
    { q: "How long should I stay?", a: "Duration depends on the programme and your assessment. Tell the doctor how much time you have available, then confirm the recommended stay and any programme minimum before making travel bookings." },
    { q: "Can I come with a companion?", a: "Discuss companion accommodation and any support you need with patient care before admission. The team will confirm available options, occupancy arrangements and any additional charges for your dates." },
    { q: "What should I share with the doctor?", a: "Bring relevant records and a list of current medicines. Explain your symptoms, previous treatment, dietary needs and any practical limits on movement or daily activities. These details help the doctor assess suitability." },
    { q: "Is the initial consultation free?", a: "Yes. Your initial doctor consultation is free. Ask for a quotation covering your care and any later services, with the inclusions and any extra charges clearly explained before you book." },
  ],
});
