// /ayurveda-retreat-kerala.html — ayurveda-retreat-kerala.md, variant B (Garden Bento), buyer comparing an Ayurveda
// retreat stay in Kerala. Copy adapted from the reviewed brief for sales clarity
// (kairali-akshar-marketing-science CREATE+REVIEW); facts only from the brief and data/doctors.ts.
// Variant B: no `rest`. Villa cards use pain-management.ts text (writer spec), not the brief's villa lines.
import { defineCopy } from "../copy.ts";
import { story } from "../stories.ts";

const SITE = "https://ayurvedichealingvillage.com";

export default defineCopy({
  slug: "ayurveda-retreat",
  route: "/ayurveda-retreat-kerala.html",
  source: { file: "ayurveda-retreat-kerala.md", sha256: "d5db02587d5138c0c8e0bd35978f23ba94d6a44de98b2b695c5398cde7e244dc" },
  seo: {
    title: "Ayurveda Retreat in Kerala | Kairali",
    description: "Authentic Ayurveda, surrounded by nature. Explore doctor-guided care, villas, meals and programme inclusions at Kairali Ayurvedic Healing Village in Palakkad.",
  },
  adMatch: {
    keywords: ["ayurveda retreat kerala", "ayurveda retreat india", "ayurvedic wellness retreat", "wellness retreat kerala"],
    adHeadlines: [],
  },
  hero: {
    overline: "Doctor-guided care · Palakkad, Kerala",
    h1: "Ayurveda retreat in Kerala",
    standfirst: "Stay in a villa surrounded by gardens, with prescribed care, vegetarian meals, yoga and time to rest, planned with the doctors at Kairali.",
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
      heading: "A retreat with time set aside for you",
      paragraphs: [
        "A residential stay gives you time to focus on care and daily routines away from your usual schedule. At Kairali – The Ayurvedic Healing Village in Palakkad, your Ayurvedic doctor assesses your needs and discusses a programme with you before you decide on your stay.",
        "Kairali is an NABH-accredited Ayurvedic hospital with villas in the village gardens. Its Ayurvedic family tradition informs a place where prescribed therapies, food, yoga and rest come together around your care plan.",
        "What your stay offers: time away from your usual schedule, a programme discussed with your Ayurvedic doctor, and days in the village gardens where prescribed therapies, food, yoga and rest come together.",
      ],
      points: [
        "You want time away from your usual schedule",
        "You are exploring Panchakarma or rejuvenation",
        "You have a particular health concern to discuss",
        "You want yoga and meditation as part of your stay",
        "You are travelling with a partner or companion",
      ],
    },
    place: {
      heading: "Choose a villa set among the gardens",
      paragraphs: ["Your villa is your base between appointments. Walk through the grounds, sit outside your villa or rest in your room. Ask our team about availability, layout, occupancy and any access needs for your dates."],
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
      kicker: "Your programme",
      heading: "Find a programme that fits your needs",
      intro: ["Start with your health history, current treatment and what you hope to address. The consultation helps you understand which programme may be appropriate and what it involves, rather than choosing by name alone."],
      programmeLinks: true,
      cards: [
        {
          title: "Panchakarma and rejuvenation",
          links: [
            { label: "Panchakarma", href: `${SITE}/panchakarma-therapy/` },
            { label: "Rejuvenation", href: `${SITE}/holistic-treatment-for-rejuvenation-and-detoxification/` },
          ],
          paragraphs: ["Ask your doctor about the proposed therapies, dietary guidance, preparation and recommended length of stay."],
        },
        {
          title: "Care for a particular health concern",
          links: [{ label: "Personalised programme", href: `${SITE}/personalized-customized-healing-program/` }],
          // Names concerns a visitor may discuss, with no treatment claim.
          paragraphs: ["Kairali’s programme range includes weight and metabolic concerns, joint and back concerns, skin conditions, stress, women’s health and postpartum care, among other areas. Bring your diagnoses and current treatment so the doctor can assess your needs."],
        },
        {
          title: "Yoga and meditation",
          links: [
            { label: "Personalised yoga", href: `${SITE}/yoga-retreats/` },
            { label: "Yoga and meditation stay", href: `${SITE}/yoga-and-meditation-package/` },
          ],
          paragraphs: ["Yoga-focused programmes have their own session arrangements, so confirm the details of the programme you choose."],
        },
      ],
    },
    pathway: {
      heading: "Plan your retreat in three steps",
      steps: [
        { title: "Start with a free consultation", body: "Share your health history, current treatment and what you hope to address. Your doctor discusses a programme with you before you decide on your stay." },
        { title: "Review your plan and quotation", body: "Confirm the prescribed plan, recommended length of stay, villa and occupancy. Check what is included and what is charged separately before choosing your dates." },
        // Owner decision, 14 Oct 2026 (AHV-WB.167.change): a typical day from the approved Dinacharya times only. Variant B
        // has no quiet band, so the day sits in the existing routine step; the second therapy is never promised universally.
        { title: "Settle into a daily routine", body: "Your prescribed care sets the pace, with meals, yoga or meditation and rest fitting around it. On a typical day, your first treatment is at 09:30 and an activity at 14:00; a second therapy follows at 15:30 only when your plan includes two therapies. Ask about Ayurveda talks, cooking demonstrations, village walks and organic garden visits." },
      ],
    },
    stories: {
      heading: "See the village before you travel",
      body: "See a day at the village and hear patients describe their stays in their own words. Individual experiences vary.",
      films: [
        story("iPARaMRASUs", "A day at the village"),
        story("4x01PtWfNnk", "Watch Michaela & Jan’s experience"),
      ],
    },
    stay: {
      heading: "Know what your stay includes",
      paragraphs: ["Ask for a personalised quotation covering your programme, dates, villa category and occupancy."],
      lists: [
        { heading: "Review in your quotation", items: ["Prescribed therapies and doctor reviews", "Meals", "Yoga or meditation sessions", "Activities included in your stay"] },
        { heading: "Confirm any separate charges", items: ["Medicines and tests", "Specialist services and additional sessions", "Travel arrangements and personal extras"], extra: true },
      ],
      after: [
        "Travelling with a partner or companion? Tell the team who will receive care and which accommodation and meal arrangements you need.",
        // The brief's eligibility-offer sentence is left out: no current offer terms are approved (PPC rule: no unapproved offer).
      ],
    },
    doctors: {
      heading: "Meet your Ayurvedic doctors",
      intro: "Our doctors assess your health history, plan your care and review your progress. Ask about doctor availability when you enquire.",
    },
    faqHeading: "Your questions, answered",
    closing: {
      heading: "Plan your stay at Kairali",
      paragraphs: ["Tell us what you need from your stay, who will travel with you and when you hope to visit. Start with a free initial doctor consultation, then review your programme and quotation with our team."],
    },
  },
  faq: [
    { q: "How do I choose a programme for my stay?", a: "Start with a consultation about your health history, current treatment and goals. Explore the programme topics on this page, then ask the doctor what may be appropriate for you. Confirm the prescribed plan and recommended length of stay before choosing your dates or booking accommodation." },
    { q: "Can I choose my villa?", a: "There are several villa categories, including Deluxe, Classic and Royal Villas and the Maharaja Suite. Ask our team about availability, layout, occupancy and any access needs for your dates. Confirm the accommodation in your quotation so you know which arrangements are included before booking." },
    { q: "How do meals, yoga and rest fit into the day?", a: "The daily routine follows your prescribed care. Discuss meals, yoga or meditation with the doctor and confirm which sessions are suitable for you. Leave time for rest between appointments. Ask the team about the schedule for your programme before arranging other activities during your visit." },
    { q: "Can I travel with a partner or companion?", a: "Discuss your plans with patient care before booking. Tell us who will receive treatment, who will accompany them and whether you prefer to share accommodation. Each person considering care needs an individual assessment. Confirm occupancy, meals, programme dates and companion charges in the quotation." },
    { q: "Is the initial doctor consultation free?", a: "Yes. Your initial doctor consultation is free. Share your health history, current treatment and questions to discuss whether a stay may suit you. Ask for a quotation covering your programme, accommodation and any later services before you book." },
    { q: "What should I check in my quotation?", a: "Ask for the recommended programme, number of nights, villa occupancy and the care included for your dates. Confirm which medicines, tests, specialist services or travel arrangements cost extra. Review the full quotation with our team before booking, so you understand both the stay and any additional charges." },
  ],
});
