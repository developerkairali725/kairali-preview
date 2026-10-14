// /Kairali_Brand_and_Competition_Neo-original.html — next-five/kairali-brand.md, variant D (Direct), buyer: branded
// searcher verifying this is the intended Kairali property before comparing care and stay. Copy adapted from the
// reviewed brief for sales clarity (kairali-akshar-marketing-science CREATE+REVIEW); facts only from the brief and
// data/doctors.ts. No competitor copy, superiority, review counts or founding year (heritage = family tradition only;
// the approved "since 1908" line is the renderer's proof strip, not this copy).
import { defineCopy } from "../copy.ts";
import { story } from "../stories.ts";

export default defineCopy({
  slug: "brand",
  route: "/Kairali_Brand_and_Competition_Neo-original.html",
  source: { file: "next-five/kairali-brand.md", sha256: "37f8c65e7ce6fc325ed261f50303bc36f9d0ff0d6ef42ecfa7cdb050f81aa665" },
  // The brief's SEO metadata, verbatim.
  seo: {
    title: "Kairali Ayurveda in Palakkad, Kerala | Kairali",
    description: "Discover Kairali – The Ayurvedic Healing Village in Palakkad. Explore doctor-guided Ayurveda, villa options and stay planning in a free initial consultation.",
  },
  adMatch: {
    keywords: [
      "kairali ayurvedic healing village",
      "kairali ayurveda palakkad",
      "kairali hospital kerala",
      "kairali ayurvedic healing village price",
    ],
    adHeadlines: [],
  },
  hero: {
    overline: "NABH-accredited Ayurvedic hospital · Palakkad",
    h1: "Kairali Ayurveda in Palakkad, Kerala",
    standfirst: "Get to know the Healing Village, the people guiding your care and the practical details of a residential stay.",
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
      heading: "Yes, this is Kairali’s Healing Village in Palakkad",
      paragraphs: [
        "Kairali – The Ayurvedic Healing Village is the Kairali Ayurvedic Group’s residential Ayurveda property in Palakkad, Kerala. It is an NABH-accredited Ayurvedic hospital with residential villas, where your assessment guides the proposed programme.",
        "At a glance: an NABH-accredited Ayurvedic hospital in Palakkad, Kerala; 30 villas in a garden setting; Ayurvedic doctors who assess your health history, plan your care and review progress; [location and directions](/how-to-reach/).",
        "Kairali’s Ayurvedic family tradition informs its approach to care. Here, that means an individual plan in a residential setting, with doctors, therapists, meals and accommodation all part of your stay.",
        "What your stay gives you: an individual plan, sessions delivered by trained therapists as prescribed, vegetarian meals and villa accommodation in a garden setting, with time to rest around your prescribed care.",
      ],
      points: [
        "You searched for Kairali and want to confirm the property",
        "You are comparing residential Ayurveda programmes",
        "You want to know who will assess and treat you",
        "You want the full cost of a stay, not a headline rate",
      ],
    },
    offering: {
      kind: "cards",
      kicker: "Before you decide",
      heading: "Understand what you are choosing",
      intro: ["A programme name is only part of the decision. You also need to know who will assess you, which care is prescribed, the time recommended and how your daily routine will work."],
      cards: [
        {
          title: "Begin with your reason for seeking care",
          links: [{ label: "Explore Ayurvedic treatment programmes", href: "/ayurvedic-treatment-packages.html" }],
          paragraphs: ["You may want to discuss Panchakarma, rejuvenation, weight management, pain, sleep, stress or another health concern. Explain your goals in your own words. The doctor can help you understand which programme is relevant and what the proposed care involves."],
        },
        { title: "Know how your plan is prescribed and reviewed", paragraphs: ["Your assessment informs the procedures, dietary guidance and suitable activity. Trained therapists deliver prescribed sessions. Ask how progress will be reviewed, how to raise concerns and what follow-up may be recommended after your stay."] },
        { title: "Compare the whole stay", paragraphs: ["When considering a residential Ayurveda programme, compare the full proposal: care, duration, accommodation, meals, reviews and additional charges. Ask for an individual quotation so you can see what applies to your dates and needs."] },
      ],
    },
    pathway: {
      heading: "From your first question to your stay",
      steps: [
        { title: "Start with a free consultation", body: "Share the reason for your visit, the dates you are considering and relevant medical information, including your current treatment." },
        { title: "Review your plan and quotation", body: "Once the doctor has explained the proposed care, review the recommended stay and quotation with patient care, including anything charged separately." },
        { title: "Begin your stay at the village", body: "Vegetarian meals, suitable yoga or meditation and time to rest fit around your prescribed care. Ask which other activities or local cultural visits are available and whether they suit your programme." },
      ],
    },
    // AHV-WB.272.villa-gallery and .guest-video (staff review 9 Oct 2026; owner's standing authority for approved
    // villa photographs and on-page guest video; production/section-order.ts D_VILLAGE_AND_STORIES). Reviewed copy
    // reused verbatim: the village from ayurveda-retreat.ts, the consented registry films from lp-treatment-packages.ts.
    // No new facts, names, countries or quotes.
    place: {
      heading: "Choose a villa set among the gardens",
      paragraphs: ["Your villa is your base between appointments. Walk through the grounds, sit outside your villa or rest in your room. Ask our team about availability, layout, occupancy and any access needs for your dates."],
      villas: [
        { name: "Deluxe Villa", body: "A king-size bed and private bathroom, with Wi-Fi, TV and air conditioning.", link: { label: "Explore Deluxe Villa", href: "/deluxe-villa/" } },
        { name: "Classic Villa", body: "Garden views and a private bathroom, with Wi-Fi, TV and air conditioning.", link: { label: "Explore Classic Villa", href: "/classic-villa/" } },
        { name: "Royal Villa", body: "A king-size bed, living area and garden access, with Wi-Fi, TV, air conditioning, a kettle and hair dryer.", link: { label: "Explore Royal Villa", href: "/royal-villa/" } },
        { name: "Maharaja Suite", body: "A king-size bed, a living area with a couch and garden access in a premium location.", link: { label: "Explore Maharaja Suite", href: "/maharaja-suite/" } },
      ],
    },
    stories: {
      heading: "See the village before you decide",
      body: "Watch a day at the village, then hear patients describe their stays in their own words. Individual experiences vary.",
      films: [
        story("iPARaMRASUs", "A day at the village"),
        story("3vWviQfW1Ug", "Watch Supriya’s experience"),
        story("4x01PtWfNnk", "Watch Michaela & Jan’s experience"),
      ],
    },
    stay: {
      heading: "Choose your villa and know what is covered",
      paragraphs: ["Kairali has 30 villas in a garden setting. [Classic Villa](/classic-villa/), [Deluxe Villa](/deluxe-villa/), [Royal Villa](/royal-villa/) and [Maharaja Suite](/maharaja-suite/) offer different accommodation options. Tell patient care about occupancy, access and any companion needs before confirming your choice."],
      lists: [
        { heading: "Confirm in your quotation", items: ["The programme, dates and recommended stay", "Villa category, occupancy and taxes", "Included care, meals and doctor reviews", "Companion arrangements, if someone travels with you"] },
        { heading: "Ask about separate charges", items: ["Medicines and tests", "Specialist services", "Transport", "Activities or visits outside your programme"], extra: true },
      ],
    },
    doctors: {
      heading: "Meet your Ayurvedic doctors",
      intro: "Your doctors assess your health history, plan your care and review your progress. Availability is confirmed when you enquire.",
    },
    faqHeading: "Your questions, answered",
    closing: {
      heading: "Ask the questions that help you decide",
      paragraphs: ["Tell us why you are considering Kairali and when you might travel. Start with a free initial doctor consultation; our patient care team can then guide you through the programme and stay arrangements."],
    },
  },
  faq: [
    { q: "Is this the Kairali property in Palakkad?", a: "Yes. This page is for Kairali – The Ayurvedic Healing Village in Palakkad, Kerala. Discuss the care and accommodation at this property with our patient care team when planning your visit." },
    { q: "What kind of care setting does the Healing Village provide?", a: "It is an NABH-accredited Ayurvedic hospital with residential villas. The doctor assesses your needs and determines prescribed care. Meals, suitable activity and rest are considered alongside your treatment routine." },
    { q: "What does Kairali’s Ayurvedic heritage mean?", a: "It refers to the family’s Ayurvedic tradition. The doctors assess and plan each person’s care individually. You can ask about their qualifications, experience and availability when discussing your stay." },
    { q: "Can I enquire without choosing a programme?", a: "Yes. Tell the team why you are considering Ayurveda and share your current treatment and relevant health history. The initial consultation can help clarify suitable options, duration and practical next steps." },
    { q: "How do I compare the cost of a stay at Kairali?", a: "Ask for a quotation covering the programme, dates, villa occupancy, taxes and included care. Confirm additional charges such as medicines, tests, specialist services and travel. Compare the full arrangements rather than an isolated headline rate." },
    { q: "Can a companion stay with me?", a: "Explain who will travel and who needs treatment. Patient care can discuss occupancy and companion arrangements for your dates, including meals and applicable charges. Confirm those details before booking." },
    { q: "Is the initial doctor consultation free?", a: "Yes. The initial consultation is free and gives you an opportunity to discuss suitability and ask questions. Treatment, tests, medicines and later services are not automatically free." },
  ],
});
