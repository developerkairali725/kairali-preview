// /karkidaka-chikitsha-or-monsoon-wellness.html — monsoon-wellness.md, variant C (Editorial), buyer planning a
// seasonal Karkidaka Chikitsa stay. Copy adapted from the reviewed brief for sales clarity
// (kairali-akshar-marketing-science CREATE+REVIEW); facts only from the brief and data/doctors.ts.
// Karkidakam = the month/season (noun); Karkidaka = combining form ("Karkidaka Chikitsa"). Dates: only the brief's
// Owner, 14 October 2026, adopts the recovered 2026 offer for July–August 2027 (month precision only).
// Historical source: english-candidate/legacy-routes/karkidaka-chikitsha-or-monsoon-wellness.json.
// Preserve the reviewed brief/source hash below; this later correction restores days/inclusions without prices.
import { defineCopy } from "../copy.ts";
import { story } from "../stories.ts";

export default defineCopy({
  slug: "monsoon-wellness",
  route: "/karkidaka-chikitsha-or-monsoon-wellness.html",
  source: { file: "monsoon-wellness.md", sha256: "76eb55eae6dd122a7cacb565e8d366f312674f0ca530fa79f22a8052a7a8d334" },
  seo: {
    title: "Monsoon Ayurvedic Treatment in Kerala | Kairali",
    description: "Karkidaka Chikitsa · Plan your July–August 2027 retreat. Explore doctor-guided care, villas and meals at Kairali Ayurvedic Healing Village in Palakkad.",
  },
  adMatch: {
    keywords: ["karkidaka chikitsa", "karkidaka treatment", "karkidaka treatment kerala", "karkidaka chikitsa package", "monsoon ayurveda treatment", "monsoon ayurvedic treatment kerala"],
    adHeadlines: [],
  },
  hero: {
    overline: "Karkidaka Chikitsa · July–August 2027",
    h1: "Monsoon Ayurvedic treatment in Kerala",
    standfirst: "Make time for doctor-guided care, prescribed meals and rest during Karkidakam, Kerala’s traditional season for Ayurveda.",
  },
  cta: {
    primary: "Get Free Doctor Consultation",
    primarySupport: "Your initial consultation is free. Ask for a quotation covering treatment and any later services.",
    secondary: "Ask Anything",
  },
  programDefault: "Karkidaka Chikitsa",
  doctors: ["deepu-john", "rahul-r", "akhila-oommen", "adhina-ub", "aashitha-ps"],
  page: {
    lead: {
      heading: "Set aside time for Ayurveda this monsoon",
      paragraphs: [
        "Plan your Karkidaka Chikitsa stay for July–August 2027. At Kairali – The Ayurvedic Healing Village, an NABH-accredited Ayurvedic hospital in Palakkad, Kerala, a Karkidaka Chikitsa stay begins with a conversation about your health and the care that may suit you.",
        "Bring your questions to an Ayurvedic doctor, whether you have an existing diagnosis or are simply exploring your options. Your assessment guides the proposed programme. The season alone does not determine the treatment you need.",
        "What your stay gives you: a doctor who explains your proposed therapies, preparation and dietary guidance before you travel, a daily routine of prescribed care, meals and rest, and time in the village gardens or your villa between appointments.",
      ],
      points: [
        "Sleep, digestion or energy you would like to discuss",
        "Pain that is affecting your daily routine",
        "A daily routine you want to talk through with a doctor",
        "An existing diagnosis, or simply questions to explore",
        "Seven-, fourteen- or twenty-one-day programmes, guided by your physician’s assessment",
      ],
    },
    offering: {
      kind: "cards",
      kicker: "Your seasonal programme",
      heading: "Choose your Karkidaka Chikitsa programme",
      intro: ["All programmes are personalised based on individual constitution and physician assessment. Inclusions are indicative and subject to clinical evaluation.", "Programme durations are stated in days. Confirm the number of accommodation nights and the full quotation before booking."],
      cards: [
        { title: "The Monsoon Starter · 7 days", paragraphs: ["Seven days for physician-guided care, a daily routine and rest.", "Two physician-prescribed therapy sessions daily. Oils, treatment sequence and techniques selected for you.", "Full-body medicated oil therapy and therapeutic steam, as prescribed. Physician-prescribed therapies with type, frequency and duration adjusted to your assessment.", "A daily routine of movement, meals, therapy, rest and meditation, suited to your care. A written post-programme wellness plan and personalised guidance."] },
        { title: "The Monsoon Reset · 14 days", paragraphs: ["A two-week programme planned around your constitution and clinical assessment.", "Two physician-prescribed therapy sessions daily. Five days of preparation before purification, subject to your physician’s assessment.", "Classical Panchakarma procedures selected by your physician. Rasayana therapies such as Pizhichil, Njavara Kizhi or Shirodhara, as prescribed.", "A personalised herbal decoction prepared each morning during the 14-day programme, as prescribed. Daily physician review and adjustment of your protocol."] },
        { title: "The Monsoon Overhaul · 21 days", paragraphs: ["A three-week Karkidaka programme planned and reviewed by your physician.", "Two physician-prescribed therapy sessions daily across the 21-day programme. Seven days of preparation before purification, subject to your physician’s assessment.", "A classical Panchakarma protocol with every stage determined by your physician. A Rasayana phase with Pizhichil, Njavara Kizhi, Shirodhara and targeted joint therapies, as prescribed.", "A personalised herbal formula reviewed and adjusted throughout your stay. Three months of structured physician-led remote follow-up included."] },
      ],
    },
    pathway: {
      heading: "From a free consultation to your seasonal stay",
      steps: [
        { title: "Start with a free consultation", body: "Tell the doctor about your health concerns, current treatment and why you are considering a monsoon stay. Share medical reports and current prescriptions." },
        { title: "Agree the programme and dates", body: "Discuss your recommended programme for July–August 2027. Confirm your arrival date, accommodation nights and availability before booking travel." },
        { title: "Settle into your seasonal routine", body: "Follow your prescribed care, meals and rest. Ask how your progress will be reviewed and how follow-up will work after your stay." },
      ],
    },
    rest: {
      heading: "Quiet time between appointments",
      paragraphs: ["Between appointments, the day slows down. Sit in the village gardens, surrounded by greenery, or rest in your villa. Pack light cotton clothing for moving easily between sessions, meals and quiet time."],
    },
    place: {
      heading: "Stay at the Healing Village",
      paragraphs: [
        "Kairali is an NABH-accredited Ayurvedic hospital with residential villas in Palakkad, Kerala. The village brings accommodation, care and daily routines together in a setting surrounded by greenery.",
        "Tell our team about access requirements or any help you need with travel arrangements, and confirm villa occupancy for your dates.",
      ],
      // Villa cards copied exactly from pain-management.ts (writer spec).
      villas: [
        { name: "Deluxe Villa", body: "A king-size bed and private bathroom, with Wi-Fi, TV and air conditioning.", link: { label: "Explore Deluxe Villa", href: "/deluxe-villa/" } },
        { name: "Classic Villa", body: "Garden views and a private bathroom, with Wi-Fi, TV and air conditioning.", link: { label: "Explore Classic Villa", href: "/classic-villa/" } },
        { name: "Royal Villa", body: "A king-size bed, living area and garden access, with Wi-Fi, TV, air conditioning, a kettle and hair dryer.", link: { label: "Explore Royal Villa", href: "/royal-villa/" } },
        { name: "Maharaja Suite", body: "A king-size bed, a living area with a couch and garden access in a premium location.", link: { label: "Explore Maharaja Suite", href: "/maharaja-suite/" } },
      ],
    },
    stories: {
      heading: "See the village before you plan",
      body: "Watch a day at the village and hear a patient describe her stay in her own words. Individual experiences vary.",
      films: [
        story("iPARaMRASUs", "A day at the village"),
        story("3vWviQfW1Ug", "Watch Ms. Supriya’s experience"),
      ],
    },
    stay: {
      heading: "Know exactly what your seasonal stay covers",
      paragraphs: ["Ask for a personalised quotation before you book. The programme recommended for you determines the care and inclusions."],
      lists: [
        { heading: "Ask your quotation to set out", items: ["Your programme and number of nights", "Villa category and occupancy for your dates", "Meals and doctor reviews", "Prescribed therapies", "Any included yoga, meditation or activities"] },
        { heading: "Confirm separately", items: ["Medicines and tests", "Specialist services", "Transport and personal extras"], extra: true },
      ],
      after: ["Review your dates, villa occupancy and the cancellation or rescheduling conditions before paying for your stay."],
    },
    doctors: {
      heading: "Meet your Ayurvedic doctors",
      intro: "Our doctors assess your health history, plan your care and review your progress. Ask about doctor availability when you enquire.",
    },
    faqHeading: "Your questions, answered",
    closing: {
      heading: "Discuss your monsoon stay",
      paragraphs: ["Tell us about your health concerns, the time you can set aside and the season you hope to visit. Start with a free initial doctor consultation, then confirm the programme and dates with our team."],
    },
  },
  faq: [
    { q: "When can I book a Karkidaka Chikitsa stay?", a: "Plan your Karkidaka Chikitsa stay for July–August 2027. Confirm your arrival date, programme suitability and accommodation availability before arranging travel. Discuss your recommended care and length of stay before making your booking." },
    { q: "Does the monsoon make this suitable for everyone?", a: "Suitability depends on your individual assessment. Share your health history, current treatment and reasons for considering a stay with the doctor. Ask what a seasonal programme would involve for you, including the therapies, meals and rest. The season alone does not determine the care you need." },
    { q: "How long should I plan to stay?", a: "The Monsoon Starter is 7 days, The Monsoon Reset is 14 days and The Monsoon Overhaul is 21 days. Your physician assesses which programme suits you. Inclusions are indicative and subject to clinical evaluation. These durations are days; confirm accommodation nights, preparation and follow-up before booking." },
    { q: "What should I prepare before travelling?", a: "Share medical reports, current prescriptions and dietary needs during the consultation. Pack light cotton clothing and ask for current pre-arrival guidance. Confirm travel or access arrangements, your villa occupancy and the cancellation or rescheduling conditions before paying for your stay." },
    { q: "Is the initial doctor consultation free?", a: "Yes. Your initial doctor consultation is free. Share your health history, current treatment and questions to discuss whether a stay may suit you. Ask for a quotation covering your programme, accommodation and any later services before you book." },
    { q: "What should I check in my quotation?", a: "Ask for the recommended programme, number of nights, villa occupancy and the care included for your dates. Confirm which medicines, tests, specialist services or travel arrangements cost extra. Review the full quotation with our team before booking, so you understand both the stay and any additional charges." },
  ],
});
