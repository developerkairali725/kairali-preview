// /lp/weight-loss/ — final-batch/lp-weight-loss.md, variant A (Quiet Admission), buyer: someone who has tried other
// approaches and wants a doctor-guided residential programme with realistic goals. Copy adapted from the reviewed brief
// for sales clarity (kairali-akshar-marketing-science CREATE+REVIEW); facts only from the brief and data/doctors.ts.
// Highest claims risk: no kilogram figures, timelines, BMI, outcome promises or body-shaming; no supplements/products.
// Owner decision, 14 Oct 2026 (AHV-WB.299.change: "it needs guest film you can use rupak mann one") supersedes the
// earlier no-`stories` rule: one guest story, the Rupak Mann film, titled with its approved attribution only.
// /lp/ route: no outbound programme or villa links in copy.
import { defineCopy } from "../copy.ts";

export default defineCopy({
  slug: "lp-weight-management",
  route: "/lp/weight-loss/",
  // sha256 as recorded for this frozen brief in review/CLEAN-COPY-FINAL5-REVIEW.json (not recomputed in this session).
  source: { file: "final-batch/lp-weight-loss.md", sha256: "75136b44a3a000a2951f5326af3d7ac9245004d35837abbd39eb355dcd6bb593" },
  seo: {
    title: "Ayurvedic Weight Loss Treatment in Kerala | Kairali",
    description: "Explore doctor-guided Ayurvedic weight management in Kerala. Discuss your health, meals, daily routine and a residential programme at Kairali in Palakkad.",
  },
  adMatch: { keywords: ["ayurvedic weight loss treatment", "ayurvedic treatment for weight loss in kerala", "ayurvedic weight loss treatment kerala"], adHeadlines: [] },
  hero: {
    overline: "Doctor-guided Ayurveda · Palakkad, Kerala",
    h1: "Ayurvedic weight management, planned around you",
    standfirst: "Discuss your health, eating patterns and daily routine with an Ayurvedic doctor before planning a residential programme in Palakkad, Kerala.",
  },
  cta: {
    primary: "Get Free Doctor Consultation",
    primarySupport: "Your initial consultation is free. Ask for a quotation covering treatment and any later services.",
    secondary: "Ask Anything",
  },
  programDefault: "Weight Management & Metabolism Therapy",
  doctors: ["deepu-john", "rahul-r", "akhila-oommen", "adhina-ub", "aashitha-ps"],
  page: {
    lead: {
      heading: "A first conversation about more than a number",
      paragraphs: [
        "If you are looking for Ayurvedic weight loss treatment, the first conversation is about more than a target weight. Tell the doctor about your health history, current medicines, previous approaches and the routines you find difficult to maintain.",
        "Kairali’s Weight Management & Metabolism Therapy is planned after assessment at Kairali – The Ayurvedic Healing Village, an NABH-accredited Ayurvedic hospital in Palakkad, Kerala. Your doctor discusses the proposed care and reviews progress during the stay. Weight change and timing vary from person to person.",
      ],
      points: [
        "You have tried other approaches and want a doctor’s view",
        "Eating patterns and daily routines feel hard to maintain",
        "You have another health condition or take regular medicines",
        "You want realistic goals rather than a promised number",
        "You can set aside time for a residential stay",
      ],
    },
    offering: {
      kind: "cards",
      kicker: "Your programme",
      heading: "What a residential programme can involve",
      intro: ["Your assessment decides your care. These are the parts of the programme to discuss with your doctor, rather than a fixed schedule for everyone."],
      cards: [
        { title: "An assessment before admission", paragraphs: ["Your assessment considers your history and relevant medical records. Explain other health conditions and any limits on movement or activity, so the doctor can discuss whether admission is appropriate."] },
        { title: "Therapies prescribed for you", paragraphs: ["Prescribed therapies are carried out by the treatment team under physician supervision. Your programme may include massage-based or cleansing therapies where indicated; the specific care is determined by assessment."] },
        { title: "A personalised vegetarian diet and routine", paragraphs: ["Meals, suitable activity and rest share one daily schedule. Ask the doctor which yoga or meditation sessions fit your plan and how your progress will be reviewed."] },
        { title: "Guidance to continue at home", paragraphs: ["Before discharge, discuss the guidance you can continue at home. Ask what follow-up is recommended and how any later consultation or service would be arranged and charged."] },
      ],
    },
    pathway: {
      heading: "Three steps from enquiry to admission",
      steps: [
        { title: "Start with a free consultation", body: "Share your health history, current medicines and previous approaches. Ask whether the programme is suitable for you and what goals are realistic." },
        { title: "Agree the duration and quotation", body: "Weight Management & Metabolism Therapy has a minimum admission of 14 nights. Confirm the duration recommended for you, your villa and the full quotation before arranging travel." },
        { title: "Settle into your daily routine", body: "Your days bring together prescribed therapies, meals, suitable activity and rest, with your doctor reviewing progress during the stay." },
      ],
    },
    rest: {
      heading: "Time to rest is part of the routine",
      paragraphs: ["Not every hour is scheduled. Between therapies and meals, walk through the village gardens, sit outside your villa or simply rest. A steadier daily pace leaves room to notice which habits you would like to continue at home."],
    },
    place: {
      heading: "Plan the practical side early",
      paragraphs: [
        "Patient care can explain villa accommodation, occupancy and available dates. Share dietary needs, access requirements or companion arrangements before booking, so the team can confirm what is available for you.",
      ],
    },
    stories: {
      heading: "Hear from people who have stayed at Kairali",
      body: "Watch a patient describe their stay in their own words. Individual experiences vary.",
      films: [
        { title: "Watch Rupak Mann’s experience", href: "https://www.youtube.com/watch?v=D3QLxKpwtJs", thumb: { src: "/ahv/assets/img/video-thumb-D3QLxKpwtJs.webp", width: 480, height: 360 } },
      ],
    },
    stay: {
      heading: "Know what your quotation covers",
      paragraphs: ["Ask for a quotation covering the programme, duration and accommodation. Included care and separately charged items should both be clearly explained before you book."],
      lists: [
        { heading: "Confirm what is included", items: ["Villa accommodation and occupancy for your dates", "Prescribed meals", "Doctor reviews", "Therapy sessions"] },
        { heading: "Ask about separate charges", items: ["Medicines and tests", "Extra sessions", "Transport", "Other separately charged items"], extra: true },
      ],
    },
    doctors: {
      heading: "Meet your Ayurvedic doctors",
      intro: "Our Ayurvedic doctors assess suitability, prescribe care and review your progress. Ask about doctor availability when you enquire.",
    },
    faqHeading: "Your questions, answered",
    closing: {
      heading: "Start with a conversation about your goals",
      paragraphs: ["Tell us about your circumstances and the time you can set aside. A free initial doctor consultation can help you understand whether a residential programme is appropriate for you."],
    },
  },
  faq: [
    { q: "How much weight will I lose?", a: "No particular number of kilograms or time to achieve it is promised. Your doctor discusses your health, goals and suitable care, then reviews progress during the stay. Individual responses vary." },
    { q: "I have another health condition. Can I still enquire?", a: "Yes. Share medical records, current medicines and any ongoing care with the doctor. The assessment helps establish whether this programme is suitable. It is not a substitute for the medical care your other conditions require." },
    { q: "How long is the programme?", a: "Weight Management & Metabolism Therapy has a minimum admission of 14 nights. Your doctor will discuss the recommended duration for your needs. Confirm the stay before booking travel." },
    { q: "What will I eat and do each day?", a: "Your programme combines prescribed therapies, a personalised vegetarian diet, suitable activity and rest. Discuss food requirements and physical limitations during assessment so the proposed routine can be explained clearly." },
    { q: "Will I receive guidance for returning home?", a: "Discuss daily habits and discharge guidance with the doctor during your stay. Ask what follow-up is recommended, how it is arranged and whether any later service carries a charge." },
    { q: "Is the first doctor consultation free?", a: "Yes. The initial doctor consultation is free. Ask for a quotation covering your care and any later services, with the inclusions and any additional charges explained before booking." },
  ],
});
