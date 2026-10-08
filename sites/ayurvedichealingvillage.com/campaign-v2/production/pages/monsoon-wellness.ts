// /karkidaka-chikitsha-or-monsoon-wellness.html — monsoon-wellness.md, variant C (Editorial), buyer planning a
// seasonal Karkidaka Chikitsa stay. Copy adapted from the reviewed brief for sales clarity
// (kairali-akshar-marketing-science CREATE+REVIEW); facts only from the brief and data/doctors.ts.
// Karkidakam = the month/season (noun); Karkidaka = combining form ("Karkidaka Chikitsa"). Dates: only the brief's
// "traditionally observed in July and August"; programme dates are confirmed per year with the team.
import { defineCopy } from "../copy.ts";
import { story } from "../stories.ts";

export default defineCopy({
  slug: "monsoon-wellness",
  route: "/karkidaka-chikitsha-or-monsoon-wellness.html",
  source: { file: "monsoon-wellness.md", sha256: "76eb55eae6dd122a7cacb565e8d366f312674f0ca530fa79f22a8052a7a8d334" },
  seo: {
    title: "Monsoon Ayurvedic Treatment in Kerala | Kairali",
    description: "Karkidaka Chikitsa · Plan your July–August retreat. Explore doctor-guided care, villas and meals at Kairali Ayurvedic Healing Village in Palakkad.",
  },
  adMatch: {
    keywords: ["karkidaka chikitsa", "karkidaka treatment", "karkidaka treatment kerala", "karkidaka chikitsa package", "monsoon ayurveda treatment", "monsoon ayurvedic treatment kerala"],
    adHeadlines: [],
  },
  hero: {
    overline: "Karkidaka Chikitsa · Palakkad, Kerala",
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
        "Karkidakam is traditionally observed in July and August. At Kairali – The Ayurvedic Healing Village, an NABH-accredited Ayurvedic hospital in Palakkad, Kerala, a Karkidaka Chikitsa stay begins with a conversation about your health and the care that may suit you.",
        "Bring your questions to an Ayurvedic doctor, whether you have an existing diagnosis or are simply exploring your options. Your assessment guides the proposed programme. The season alone does not determine the treatment you need.",
      ],
      points: [
        "Sleep, digestion or energy you would like to discuss",
        "Pain that is affecting your daily routine",
        "A daily routine you want to talk through with a doctor",
        "An existing diagnosis, or simply questions to explore",
        "Seven, fourteen or twenty-one days you could set aside",
      ],
    },
    offering: {
      kind: "cards",
      kicker: "Your seasonal programme",
      heading: "What a Karkidaka Chikitsa stay can bring together",
      intro: ["Your assessment guides the care prescribed for you. These are the parts of the programme to discuss with your doctor before you decide."],
      cards: [
        { title: "Care you understand before you travel", paragraphs: ["Talk through your medical history, current treatment and goals. Your doctor can explain the proposed therapies, preparation and dietary guidance, so you know what a Karkidaka Chikitsa stay would involve for you."] },
        { title: "Treatment, meals and rest in one routine", paragraphs: ["Prescribed care, meals and quiet time form the basis of your day. Discuss yoga and meditation with the doctor, and ask how activities fit around the treatment schedule."] },
        { title: "A length of stay that fits your care", paragraphs: ["If you are considering a seven-, fourteen- or twenty-one-day stay, ask which option fits the care recommended for you. Confirm the exact number of nights, preparation and any follow-up before arranging travel."] },
        { title: "Preparation specific to you", paragraphs: ["Share medical reports, current prescriptions and dietary needs during the consultation. Ask for the current pre-arrival guidance and any preparation your care requires."] },
      ],
    },
    pathway: {
      heading: "From a free consultation to your seasonal stay",
      steps: [
        { title: "Start with a free consultation", body: "Tell the doctor about your health concerns, current treatment and why you are considering a monsoon stay. Share medical reports and current prescriptions." },
        { title: "Agree the programme and dates", body: "Discuss the recommended care and length of stay. Seasonal programme dates and accommodation availability are confirmed for the year you plan to visit, so check them before booking travel." },
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
    { q: "When can I book a Karkidaka Chikitsa stay?", a: "Karkidakam is traditionally observed in July and August. Ask our team to confirm programme dates and availability for the season you plan to visit. Discuss your recommended care and length of stay before arranging travel." },
    { q: "Does the monsoon make this suitable for everyone?", a: "Suitability depends on your individual assessment. Share your health history, current treatment and reasons for considering a stay with the doctor. Ask what a seasonal programme would involve for you, including the therapies, meals and rest. The season alone does not determine the care you need." },
    { q: "How long should I plan to stay?", a: "Tell the doctor how much time you can set aside. You can ask about seven-, fourteen- or twenty-one-day stays, but the suitable programme and current availability need to be confirmed for you. Ask about the recommended nights, preparation and follow-up before making your booking." },
    { q: "What should I prepare before travelling?", a: "Share medical reports, current prescriptions and dietary needs during the consultation. Pack light cotton clothing and ask for current pre-arrival guidance. Confirm travel or access arrangements, your villa occupancy and the cancellation or rescheduling conditions before paying for your stay." },
    { q: "Is the initial doctor consultation free?", a: "Yes. Your initial doctor consultation is free. Share your health history, current treatment and questions to discuss whether a stay may suit you. Ask for a quotation covering your programme, accommodation and any later services before you book." },
    { q: "What should I check in my quotation?", a: "Ask for the recommended programme, number of nights, villa occupancy and the care included for your dates. Confirm which medicines, tests, specialist services or travel arrangements cost extra. Review the full quotation with our team before booking, so you understand both the stay and any additional charges." },
  ],
});
