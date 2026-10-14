// /lp/treatment-packages/ — final-batch/lp-treatment-packages.md, variant B (Garden Bento), buyer: someone comparing
// packages and costs who needs to know what a quotation covers. Copy adapted from the reviewed brief for sales clarity
// (kairali-akshar-marketing-science CREATE+REVIEW); facts only from the brief and data/doctors.ts.
// Variant B: no `rest`. /lp/ route: no outbound programme or villa links in copy; films are the consented registry only.
import { defineCopy } from "../copy.ts";
import { story } from "../stories.ts";

export default defineCopy({
  slug: "lp-treatment-packages",
  route: "/lp/treatment-packages/",
  // sha256 as recorded for this frozen brief in review/CLEAN-COPY-FINAL5-REVIEW.json (not recomputed in this session).
  source: { file: "final-batch/lp-treatment-packages.md", sha256: "bf78e581e066f48cc307077b98e66c75dabf7c45b0ae008bd6675307ecd020f2" },
  seo: {
    title: "Compare Ayurvedic Packages & Costs in Kerala | Kairali",
    description: "Compare Ayurvedic treatment options at Kairali in Palakkad. Discuss your programme, duration, accommodation and inclusions in a free initial consultation.",
  },
  adMatch: { keywords: ["ayurvedic treatment packages in kerala", "ayurvedic treatment packages", "ayurvedic treatment cost in kerala"], adHeadlines: [] },
  hero: {
    overline: "Doctor-guided Ayurveda · Palakkad, Kerala",
    h1: "Find an Ayurvedic treatment package that fits your needs",
    standfirst: "Bring your health concerns, dates and questions, and let an Ayurvedic doctor’s assessment guide the programme before you compare quotations.",
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
      heading: "Compare the care behind the package, not just its name",
      paragraphs: [
        "A package name alone does not tell you which therapies you will receive, how long you need or what is included. A useful comparison starts with the programme, its suitability for you and the time it requires.",
        "Kairali – The Ayurvedic Healing Village is an NABH-accredited Ayurvedic hospital in Palakkad, Kerala, with residential villa accommodation. After an Ayurvedic doctor’s assessment, your programme brings prescribed care, meals and rest together in one place.",
        // AHV-WB.473.benefit-copy (staff workbook): one plain line on the stay itself, from this page's own reviewed facts; no outcome.
        "Whichever programme is recommended, your days bring prescribed care, meals and quiet time together, with villas and gardens around you and doctors reviewing your care during the stay.",
      ],
      points: [
        "You are comparing treatment packages and their costs",
        "You are unsure which programme suits your health concerns",
        "You need to know how long to be away from home",
        "You want to see what a quotation includes and excludes",
        "You are travelling with a companion or have access needs",
      ],
    },
    place: {
      heading: "Care, meals and rest in one place",
      paragraphs: [
        "Villas and gardens give you space for quiet time around the prescribed programme. Patient care can explain accommodation categories and availability for your dates.",
        "Share practical needs early, including dietary or access requirements, so the team can confirm suitable arrangements before you book.",
      ],
    },
    offering: {
      kind: "cards",
      kicker: "Programmes to discuss",
      heading: "Understand what each programme involves",
      intro: ["Ask what the proposed therapies involve, how your care is reviewed and what is included in your stay."],
      // DEC-PACKAGE-COMPARISONS (AHV-WB.468): each box's programme name + minimumNights from
      // public/ahv/assets/all-programs-data.js (KTAHV/AYT/EN-INR/20260925-R1): /panchakarma-therapy/ 14,
      // /holistic-treatment-for-rejuvenation-and-detoxification/ 7, /treatment-to-remove-stress-and-strain/ 7; inclusions
      // ayurveda.included[1–4] of english-candidate/final-rates/strings.en.json. No prices; no outbound links (this LP's rule).
      cards: [
        { title: "Panchakarma", paragraphs: [
          "Panchakarma programmes combine preparation, doctor-selected procedures, diet and rest. All five classical procedures are not automatically included for every patient.",
          "Ayurvedic Panchakarma Detoxification Therapy has a published minimum stay of 14 nights. Included: three vegetarian or vegan meals a day, to the dietary prescription; two Ayurvedic therapies a day, including herbal steam; daily consultation and monitoring by the attending physician; and group yoga each morning and guided meditation each evening.",
        ] },
        { title: "Rejuvenation and detoxification", paragraphs: [
          "These programmes have their own prescribed care and daily routines. Discuss how the available programme relates to your needs; its name does not determine your individual therapy schedule.",
          "Complete Rejuvenation & Detoxification Therapy has a published minimum stay of 7 nights. Included: three vegetarian or vegan meals a day, to the dietary prescription; two Ayurvedic therapies a day, including herbal steam; daily consultation and monitoring by the attending physician; and group yoga each morning and guided meditation each evening.",
        ] },
        { title: "Stress management", paragraphs: [
          "Prescribed therapies, meals, activity and rest are brought into an organised routine. Share what has been affecting your daily life, and ask the doctor to explain suitable care and realistic expectations.",
          "Comprehensive Stress Relief & Mental Wellness Program has a published minimum stay of 7 nights. Included: three vegetarian or vegan meals a day, to the dietary prescription; two Ayurvedic therapies a day, including herbal steam; daily consultation and monitoring by the attending physician; and group yoga each morning and guided meditation each evening.",
        ] },
      ],
    },
    pathway: {
      heading: "From enquiry to a quotation you can compare",
      steps: [
        { title: "Start with a free consultation", body: "Tell us what you hope to address, any diagnosis or ongoing treatment, and how much time you can set aside. The consultation helps establish whether a programme is appropriate for you." },
        { title: "Review a written quotation", body: "Ask about preparation and recommended duration. Patient care then brings the programme and accommodation together in a written quotation for your dates, duration and occupancy." },
        { title: "Begin your prescribed programme", body: "Bring your records and a list of current medicines. Your doctors review your care during the stay, and you can ask what follow-up guidance may involve." },
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
      heading: "Know exactly what your quotation covers",
      paragraphs: ["Ask for a written quotation for your proposed programme, dates, duration and occupancy. When you compare, compare like with like: the same duration, dates and occupancy, with the care and accommodation clearly described."],
      lists: [
        { heading: "Check that it sets out", items: ["Villa accommodation, occupancy and taxes", "Meals included in your programme", "Doctor reviews and prescribed therapies", "Activities, and which yoga or meditation sessions are included"] },
        { heading: "Confirm what is charged separately", items: ["Medicines and tests", "Specialist care and additional sessions", "Transport", "Personal services"], extra: true },
      ],
      after: ["Different programmes can have different arrangements. Your initial doctor consultation is free: an opportunity to understand your options before deciding on treatment or a residential stay."],
    },
    doctors: {
      heading: "Meet your Ayurvedic doctors",
      intro: "Our doctors assess your health history, plan care and review your progress. Ask about doctor availability when arranging a consultation.",
    },
    faqHeading: "Questions about packages and costs",
    closing: {
      heading: "Ask about your programme",
      paragraphs: ["Share your needs and preferred dates, and mention whether anyone will accompany you. We can help you arrange the initial doctor consultation and understand the practical details of a stay in Palakkad."],
    },
  },
  faq: [
    { q: "Which Ayurvedic treatment package should I choose?", a: "Begin with your needs and medical history. The doctor can discuss programme suitability and the proposed duration. You do not need to select therapies or a complete schedule before enquiring." },
    { q: "Does every package include the same treatment?", a: "No. The therapies and routine depend on the programme and your assessment. Ask the doctor to explain the recommended care, and check your quotation for the specific inclusions." },
    { q: "How long should I plan to stay?", a: "Each programme has its own requirements. Share your available dates, then confirm the recommended duration and any minimum stay before arranging travel. A shorter stay should not be assumed to provide the same programme." },
    { q: "How do I compare costs?", a: "Compare quotations for the same duration, dates and occupancy, with the care and accommodation clearly described. Check meals, doctor reviews, therapy sessions, taxes and separately charged items rather than relying only on a package name." },
    { q: "Can I arrange accommodation for a companion?", a: "Ask patient care about the occupancy and arrangements you need, including any help with access or travel. Availability and charges should be confirmed for your dates before booking." },
    { q: "Is the initial doctor consultation free?", a: "Yes. The initial doctor consultation is free. Ask for a quotation covering your care and any later services, and review the inclusions and charges before confirming your stay." },
  ],
});
