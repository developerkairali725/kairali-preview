// /ayurvedic-treatment-packages.html — the reviewed copy (owner-correction/treatment-packages.md), arranged into the
// production template. Wording is the brief's own, except where a comment says otherwise. Apostrophes are set as
// typographic ’ throughout (the brief used straight ones here); that is typography, not wording.
import { defineCopy } from "../copy.ts";

const SITE = "https://ayurvedichealingvillage.com";

export default defineCopy({
  slug: "treatment-packages",
  route: "/ayurvedic-treatment-packages.html",
  source: { file: "treatment-packages.md", sha256: "5f75d53cedd7a551adb9024636b13c2b81d8c5c58ad218e6cd67b0eb72b3772d" },
  seo: {
    title: "Ayurvedic Treatment Packages in Kerala | Kairali",
    description: "Explore authentic Ayurvedic treatment packages, villa stays, yoga and meditation at Kairali Ayurvedic Healing Village in Palakkad, Kerala. Plan your stay.",
  },
  adMatch: { keywords: ["ayurvedic treatment packages in kerala", "ayurveda treatment packages", "kerala ayurvedic treatment"], adHeadlines: [] },
  hero: {
    overline: "Doctor-guided Ayurveda · Palakkad, Kerala",
    h1: "Ayurvedic treatment packages in Kerala",
    standfirst: "Find a programme that fits your needs, with doctor-guided care, prescribed meals and time to rest in the gardens of Kairali, Palakkad.",
  },
  cta: {
    primary: "Get Free Doctor Consultation",
    primarySupport: "Your initial consultation is free. Ask for a quotation covering treatment and any later services.",
    secondary: "Ask Anything",
  },
  // As on the page this replaces: the Step-1 bar shows no program select on this route.
  programDefault: "",
  doctors: ["deepu-john", "rahul-r", "akhila-oommen", "adhina-ub", "aashitha-ps"],
  page: {
    lead: {
      heading: "Start with what you need from your stay",
      paragraphs: [
        "You may be looking into Ayurveda for a particular health concern, considering Panchakarma, or making time for yoga and a more regular daily routine. At Kairali – The Ayurvedic Healing Village, your health history and goals are the starting point for discussing a programme.",
        "Kairali is an NABH-accredited Ayurvedic hospital in Palakkad, Kerala, with residential accommodation in the village gardens. Speak with an Ayurvedic doctor about the care that may suit you, the time it involves and what to expect before you book.",
        "What your stay offers: doctor-guided care, prescribed meals and time to rest in the gardens of Kairali, with villa accommodation, doctor reviews and therapies brought together in one plan.",
      ],
    },
    // Each card's programme links are set as the card's own list of links (the same labels, capitalised as list
    // items). The sentences that only listed them ("Explore [a], [b] and [c].", "Ask about programmes for …",
    // "Programmes also include …") are dropped for that list; "personalised programme" keeps its sentence, unlinked.
    // Every other sentence is unchanged.
    offering: {
      kind: "cards",
      heading: "Explore the programmes",
      programmeLinks: true,
      cards: [
        {
          title: "Panchakarma and rejuvenation",
          links: [
            { label: "Panchakarma", href: `${SITE}/panchakarma-therapy/` },
            { label: "Rejuvenation", href: `${SITE}/holistic-treatment-for-rejuvenation-and-detoxification/` },
            { label: "Preventive Ayurveda", href: `${SITE}/preventive-and-regenerative-treatment/` },
          ],
          paragraphs: [
            "Discuss the differences with your doctor, including the proposed therapies, preparation and length of stay. The programme name alone does not determine what is appropriate for you.",
            // DEC-PACKAGE-COMPARISONS (AHV-WB.007): names + minimumNights from public/ahv/assets/all-programs-data.js
            // (/panchakarma-therapy/ 14, /holistic-treatment-for-rejuvenation-and-detoxification/ 7, both
            // KTAHV/AYT/EN-INR/20260925-R1); inclusions are ayurveda.included[1–4] of english-candidate/final-rates/strings.en.json,
            // with its Preventive Health & Regenerative one-therapy exception. No prices.
            "Published minimum stays: Ayurvedic Panchakarma Detoxification Therapy, 14 nights; Complete Rejuvenation & Detoxification Therapy, 7 nights. Both include three vegetarian or vegan meals a day, to the dietary prescription; two Ayurvedic therapies a day, including herbal steam; daily consultation and monitoring by the attending physician; and group yoga each morning and guided meditation each evening. The Preventive Health & Regenerative programme has one therapy a day rather than two. Your doctor prescribes the therapies themselves.",
          ],
        },
        {
          title: "Weight, sleep and daily habits",
          links: [
            { label: "Weight management", href: `${SITE}/weight-loss-programme/` },
            { label: "Sleep", href: `${SITE}/sleep-restoration-therapy/` },
            { label: "Stress", href: `${SITE}/treatment-to-remove-stress-and-strain/` },
          ],
          paragraphs: [
            "Your consultation is a chance to explain how you eat, sleep, work and move, and to discuss realistic goals for your stay.",
            // DEC-PACKAGE-COMPARISONS (AHV-WB.007): all-programs-data.js /weight-loss-programme/ 14 and
            // /treatment-to-remove-stress-and-strain/ 7 (KTAHV/AYT/EN-INR/20260925-R1); inclusions ayurveda.included[1–4]
            // of final-rates/strings.en.json. Sleep is not named: it is not one of the four approved examples.
            "Published minimum stays: Weight Management & Metabolism Therapy, 14 nights; Comprehensive Stress Relief & Mental Wellness Program, 7 nights. Both include three vegetarian or vegan meals a day, to the dietary prescription; two Ayurvedic therapies a day, including herbal steam; daily consultation and monitoring by the attending physician; and group yoga each morning and guided meditation each evening. Your doctor prescribes the therapies themselves.",
          ],
        },
        {
          title: "Care for a specific health concern",
          links: [{ label: "Personalised programme", href: `${SITE}/personalized-customized-healing-program/` }],
          // Names diagnoses a visitor may discuss, with no treatment claim (kit/lint/claims.ts diseaseClaim).
          paragraphs: ["Kairali’s programme range includes joint and back concerns, skin conditions, diabetes, women’s health and postpartum care, among other areas. Bring your diagnoses, medical records and current medicine details so the doctor can assess your needs. Ask about a personalised programme if you are unsure where to begin."],
        },
        {
          title: "Yoga and meditation",
          links: [
            { label: "Personalised yoga", href: `${SITE}/yoga-therapy-individual/` },
            { label: "Yoga and meditation stay", href: `${SITE}/yoga-and-meditation-package/` },
            { label: "Yoga for digestive wellbeing", href: `${SITE}/digestive-wellness-gut-health-yoga-therapy/` },
            { label: "Yoga-based stress programme", href: `${SITE}/yoga-based-stress-energy-reset-program/` },
          ],
          paragraphs: ["Ask which practice and level of support fit your experience, health and goals."],
        },
      ],
    },
    // The brief's two paragraphs, set as two numbered steps. The step titles are new labels.
    pathway: {
      heading: "A clear plan before you book",
      steps: [
        { title: "A free initial consultation", body: "Start with a free initial doctor consultation. Share your health history, current medicines and what you would like to discuss. Your doctor can explain the proposed care, diet, preparation and time needed." },
        { title: "Dates and accommodation", body: "Once you understand the programme, confirm your dates and accommodation with our team. Review what is included, what is charged separately and any programme-specific minimum stay before arranging travel." },
      ],
    },
    rest: {
      heading: "Time to rest in the village gardens",
      paragraphs: ["Your day makes room for care, meals and quiet time. Walk through the gardens, sit outside your villa or rest between appointments. Depending on the schedule, you can also ask about Ayurveda talks, cooking demonstrations, farm visits and meditation activities."],
    },
    // The villa paragraph of "Time to rest in the village gardens", given its own section beside the photographs.
    // The heading is new.
    place: {
      heading: "Your villa at Kairali",
      paragraphs: [`Choose from [Deluxe](${SITE}/deluxe-villa/), [Classic](${SITE}/classic-villa/) and [Royal](${SITE}/royal-villa/) villas, or the [Maharaja Suite](${SITE}/maharaja-suite/). The suite has a king-size bed and a private lawn. Our team can help you compare layouts and availability for your stay.`],
    },
    stay: {
      heading: "Understand what your stay covers",
      paragraphs: ["Ayurvedic care packages bring together villa accommodation, prescribed meals, doctor reviews and therapies, with yoga, meditation and time to rest. The treatment schedule and inclusions depend on the programme you choose."],
      lists: [{
        heading: "Ask for a quotation that sets out:",
        items: [
          "Your villa category, occupancy, dates and applicable taxes.",
          "Prescribed meals, doctor reviews and the therapy schedule.",
          "The yoga or meditation sessions included in your programme.",
          "Available activities and use of leisure facilities.",
          "Any extra charges for medicines, tests, specialist care, additional sessions, transport or personal services.",
        ],
      }],
      after: ["Yoga programmes have their own session arrangements. Confirm whether private sessions are included in your chosen programme before adding them to your plans."],
    },
    doctors: {
      heading: "Meet your Ayurvedic doctors",
      intro: "Our doctors assess your health history, plan your care and review your progress. Ask about doctor availability when you enquire.",
    },
    faqHeading: "Frequently asked questions",
    closing: {
      heading: "Discuss your programme with a doctor",
      paragraphs: ["Tell us what you need from your stay and when you hope to travel. Start with a free initial doctor consultation, then review your care plan before booking."],
    },
  },
  faq: [
    { q: "How do I choose an Ayurvedic treatment package?", a: "Start with your needs rather than a programme name. Tell the doctor about your health history, current medicines and goals. They can discuss suitable options, the proposed care and the time involved, so you can make an informed decision before booking." },
    { q: "Is the initial doctor consultation free?", a: "Yes. Your initial doctor consultation is free. Use it to discuss your needs and ask whether a programme may suit you. Before booking, ask the team to explain the treatment, doctor reviews and any later services included in your stay, along with separately charged items." },
    { q: "How long should I stay?", a: "The recommended duration varies by programme and individual assessment. Share the dates you have available, then ask the doctor about preparation, the proposed treatment period and follow-up. Confirm the programme’s minimum stay before booking flights or other travel." },
    { q: "What determines the cost of my programme?", a: "The cost depends on the programme, duration, dates, villa category and occupancy. Ask for a clear breakdown of included care and any extras. Review medicines, tests, additional sessions, transport and personal services before confirming your booking." },
    { q: "Do Ayurveda and yoga programmes have the same inclusions?", a: "No. Treatment schedules and yoga arrangements vary between programmes. Ask our team which prescribed therapies, meals, doctor reviews and group or private sessions are included in your stay, and confirm the details of your chosen programme." },
    { q: "What should I share before travelling?", a: "Bring your medical records and a list of current medicines to the consultation. Discuss any dietary needs or access requirements, and ask about preparation and follow-up. Confirm your programme, accommodation and travel arrangements with the team before you leave." },
  ],
});
