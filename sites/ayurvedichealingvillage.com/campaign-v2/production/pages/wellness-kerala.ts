// The legacy wellness URL (route below) — next-five/wellness-resort-kerala.md, variant B (Garden Bento), buyer
// unsure whether this is leisure or doctor-guided care. Copy adapted from the reviewed brief for sales clarity
// (kairali-akshar-marketing-science CREATE+REVIEW); facts only from the brief and data/doctors.ts.
// Clinical register: the URL's leisure term never appears in copy; ad keywords are the brief's public themes only.
import { defineCopy } from "../copy.ts";
import { story } from "../stories.ts";

export default defineCopy({
  slug: "wellness-kerala",
  route: "/wellness-resort-kerala.html",
  source: { file: "next-five/wellness-resort-kerala.md", sha256: "f6745c280da9eb5911a577c4645871e3ea6f764d99d6e993175fc416a9bdf854" },
  seo: {
    title: "Ayurvedic Wellness in Kerala | Kairali Healing Village",
    description: "Plan a doctor-guided Ayurveda stay in Palakkad, Kerala, with villa accommodation, vegetarian meals and time to rest. Start with a free initial consultation.",
  },
  adMatch: {
    keywords: ["ayurvedic wellness in kerala", "ayurveda in palakkad", "residential ayurveda in kerala", "doctor-guided ayurveda stay"],
    adHeadlines: [],
  },
  hero: {
    overline: "Doctor-guided Ayurveda · Palakkad, Kerala",
    h1: "Ayurvedic wellness in Kerala",
    standfirst: "A residential stay in Palakkad, with doctor-prescribed care, vegetarian meals and time to rest, all planned around you.",
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
      heading: "A stay with a doctor’s plan behind it",
      paragraphs: [
        "At Kairali – The Ayurvedic Healing Village, Ayurveda shapes the purpose of your stay. Our NABH-accredited Ayurvedic hospital combines residential accommodation with doctor-prescribed care, vegetarian meals, yoga and meditation.",
        "You may be looking for time to focus on your wellbeing, support for an existing concern or a residential Ayurveda programme. Explain that purpose in your own words. Your doctor can discuss suitable care, how it would be reviewed and the recommended duration before you make travel plans.",
      ],
      points: [
        "Time set aside to focus on your wellbeing",
        "An existing concern you want a doctor’s view on",
        "Not sure yet which programme to choose",
        "Someone travelling with you, with or without treatment",
        "Dietary needs or practical help during your stay",
      ],
    },
    place: {
      heading: "Find the right accommodation",
      paragraphs: ["Kairali has 30 villas across four categories. Discuss your preferred occupancy, access needs and any companion arrangements with patient care. Confirm the category and actual room arrangements for your dates."],
      // Villa cards copied exactly from pain-management.ts (writer spec).
      villas: [
        { name: "Deluxe Villa", body: "A king-size bed and private bathroom, with Wi-Fi, TV and air conditioning.", link: { label: "Explore Deluxe Villa", href: "/deluxe-villa/" } },
        { name: "Classic Villa", body: "Garden views and a private bathroom, with Wi-Fi, TV and air conditioning.", link: { label: "Explore Classic Villa", href: "/classic-villa/" } },
        { name: "Royal Villa", body: "A king-size bed, living area and garden access, with Wi-Fi, TV, air conditioning, a kettle and hair dryer.", link: { label: "Explore Royal Villa", href: "/royal-villa/" } },
        { name: "Maharaja Suite", body: "A king-size bed, a living area with a couch and garden access in a premium location.", link: { label: "Explore Maharaja Suite", href: "/maharaja-suite/" } },
      ],
    },
    offering: {
      kind: "cards",
      kicker: "Care and daily life",
      heading: "Care and daily life, considered together",
      intro: ["A stay here follows a prescribed routine. Appointments, meals and suitable yoga or meditation leave room for rest, rather than a list of activities to fit into every day."],
      cards: [
        { title: "Therapies prescribed for you", paragraphs: ["Your assessment guides the proposed procedures. Trained therapists carry out the sessions prescribed by your Ayurvedic doctor. Ask what each part of the programme involves and discuss comfort, mobility or other concerns before starting."] },
        { title: "Meals and a routine you understand", paragraphs: ["Vegetarian meals are part of life at the Healing Village. Share allergies, dietary restrictions and existing medical advice before arrival, and discuss how meals, suitable activity and rest fit your plan."] },
        { title: "Space between appointments", paragraphs: ["Gardens, villa accommodation and the quieter pace of a residential stay give you room to pause. Ask about the current yoga and meditation schedule; participation should fit the care recommended for you."] },
        {
          title: "Not sure which programme you need?",
          links: [{ label: "Explore Ayurvedic treatment programmes", href: "/ayurvedic-treatment-packages.html" }],
          paragraphs: ["You do not need to choose before you enquire. Start with your health history, current treatment and the reason for considering a stay, and your doctor can explain the relevant options."],
        },
      ],
    },
    pathway: {
      heading: "Understand the stay before you choose it",
      steps: [
        { title: "Start with a free consultation", body: "Explain what you need from the visit in your own words. Share your health history, current treatment and any help you may need." },
        { title: "Agree your plan and quotation", body: "Your doctor discusses suitable care, how it would be reviewed and the recommended duration. Confirm the programme, nights, accommodation and charges before you make travel plans." },
        { title: "Settle into a prescribed routine", body: "Attend your sessions, meals and suitable yoga or meditation, with time to rest in between. Tell the care team if your needs change during the stay." },
      ],
    },
    stories: {
      heading: "See daily life at the village",
      body: "Watch a day at the village and hear a patient describe her stay in her own words. Individual experiences vary.",
      films: [
        story("iPARaMRASUs", "A day at the village"),
        story("3vWviQfW1Ug", "Watch Ms. Supriya’s experience"),
      ],
    },
    stay: {
      heading: "Know what your quotation covers",
      paragraphs: ["Ask for the recommended programme, number of nights, accommodation and applicable taxes."],
      lists: [
        { heading: "Check what is included", items: ["Meals", "Doctor reviews", "Prescribed therapies", "Yoga or meditation", "Other activities in your plan"] },
        { heading: "Ask for these to be explained separately", items: ["Medicines and tests", "Specialist services", "Travel and personal extras"], extra: true },
      ],
      after: ["Travelling with someone? Tell patient care whether they also want treatment, and see their accommodation, meals and charges set out in the quotation."],
    },
    doctors: {
      heading: "Meet your Ayurvedic doctors",
      intro: "Your doctors assess your history, plan care and review your progress. Doctor availability is confirmed when you enquire.",
    },
    faqHeading: "Your questions, answered",
    closing: {
      heading: "Tell us what you need from your stay",
      paragraphs: ["Tell us what you would like to discuss, and our patient care team will help you take the next step. Start with a free initial doctor consultation, then review your plan and quotation before booking."],
    },
  },
  faq: [
    { q: "What kind of care setting does Kairali provide?", a: "Kairali is an NABH-accredited Ayurvedic hospital with residential villas in Palakkad, Kerala. Your assessment guides the programme and prescribed therapies. Discuss what you are seeking so the team can explain whether this type of stay suits you." },
    { q: "Do I need to know which programme I want?", a: "No. Start with your health history, current treatment and the reason for considering a stay. Your doctor can explain relevant options, the proposed routine and the time recommended for them." },
    { q: "Can I choose individual therapies?", a: "You can ask about any therapy that interests you, but the doctor determines suitability after assessment. The programme and schedule should be clear before you book; a description online is not a prescription." },
    { q: "Will there be time for rest and other activities?", a: "Rest fits around your appointments and meals. Ask the care team about suitable yoga, meditation or other activities, and discuss any additional plans before making arrangements." },
    { q: "Can someone accompany me?", a: "Tell patient care who plans to travel and whether they also want treatment. Confirm accommodation, meals, participation and charges for companions rather than assuming the same programme applies to everyone." },
    { q: "How long should I stay?", a: "Duration depends on the programme and your assessment. Share the time you have available, then confirm the recommended stay and your accommodation before booking any travel." },
    { q: "Is the initial doctor consultation free?", a: "Yes. You can discuss your needs and questions in a free initial doctor consultation. It does not make treatment, tests, medicines or subsequent services free. Review the charges for your proposed stay before confirming it." },
  ],
});
