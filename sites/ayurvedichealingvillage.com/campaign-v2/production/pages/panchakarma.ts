// /panchkarma-treatment.html — the reviewed copy (owner-correction/panchakarma.md), arranged into the production
// template. Wording is the brief's own, except where a comment says otherwise.
// Owner decision, 14 Oct 2026 (AHV-WB.042.change: "panchakarma has 28 as well"): the stated stay reads 14–28 nights,
// matching the Length-of-stay box (14/21/28); description, lead and FAQ changed only in that range.
import { defineCopy } from "../copy.ts";

export default defineCopy({
  slug: "panchakarma",
  route: "/panchkarma-treatment.html",
  source: { file: "panchakarma.md", sha256: "cce75640a02253b4d3c66206c91ecbb67236d23e326f052fff08f849ef5e240e" },
  seo: {
    title: "Panchakarma Treatment in Kerala | Kairali Ayurvedic Healing Village",
    description: "Explore the 14–28 night Panchakarma programme at Kairali in Palakkad, Kerala, with Ayurvedic doctors, villa accommodation, vegetarian meals, yoga and meditation.",
  },
  adMatch: { keywords: ["panchakarma treatment kerala", "panchakarma centre india", "panchakarma treatment in kerala"], adHeadlines: [] },
  hero: {
    overline: "Doctor-guided Ayurveda · Palakkad, Kerala",
    h1: "Panchakarma treatment in Kerala",
    standfirst: "Plan your Panchakarma stay with an Ayurvedic doctor, with time for prescribed care, meals, yoga and rest in the village gardens.",
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
      heading: "Is Panchakarma right for you?",
      paragraphs: [
        "Before setting aside time for Panchakarma, understand what the programme may involve for you. Your health history, current medicines, daily routine and goals all matter when discussing suitability with an Ayurvedic doctor.",
        "At Kairali – The Ayurvedic Healing Village in Palakkad, Kerala, the programme begins with an individual assessment. Your doctor explains the proposed therapies, dietary guidance and time needed, and reviews your care during the stay. The published programme is a 14–28 night stay; confirm the recommended duration for your needs before arranging travel.",
        "What your stay offers: a programme your doctor explains before it begins and reviews during your stay, meals and activities that fit your programme, and a different daily pace, with time to sit in the gardens or rest in your villa.",
      ],
    },
    // "Panchakarma refers to five classical Ayurvedic procedures: Vamanam, Virechanam, Vasti, Nasyam and
    // Raktamokshana." The five names after the colon are set as the numbered row the sentence introduces.
    offering: {
      kind: "row",
      kicker: "The five procedures",
      heading: "Understanding Panchakarma",
      lead: "Panchakarma refers to five classical Ayurvedic procedures:",
      items: ["Vamanam", "Virechanam", "Vasti", "Nasyam", "Raktamokshana"],
      paragraphs: [
        "Each involves a different approach to care under an Ayurvedic doctor’s supervision.",
        "Your stay does not automatically include all five. Ask your doctor which procedures, if any, are suitable for you, what they involve and whether they are available as part of your proposed programme.",
      ],
    },
    pathway: {
      heading: "Your care begins with a conversation",
      steps: [
        { title: "Share your health history", body: "Tell the doctor about your symptoms, diagnoses, current medicines and previous treatment. Discuss sleep, food, activity and stress, along with what you hope to address during your stay." },
        { title: "Understand your treatment plan", body: "Your doctor decides which procedures are appropriate and explains preparation, prescribed care and diet. Ask what each part of the plan involves and how progress will be reviewed. Panchakarma is not the same treatment schedule for everyone." },
        { title: "Plan for care and rest", body: "Make time for prescribed therapies, meals, yoga, meditation and rest. Discuss the proposed duration, any preparation before arrival and guidance for continuing your routine after discharge." },
      ],
    },
    rest: {
      heading: "Time to rest between treatments",
      paragraphs: ["Your stay is also time set aside for a different daily pace. Take a quiet walk, sit in the gardens or rest in your villa. Let the prescribed care schedule guide your day, with meals and activities that fit your programme."],
    },
    // The second paragraph of "Time to rest between treatments", given its own section beside the photographs.
    // The heading is new.
    place: {
      heading: "Your villa at Kairali",
      paragraphs: ["Our team can explain the available villa categories, room layouts and travel arrangements. Discuss any dietary or access needs before you confirm your stay."],
      // AHV-WB.051.change: the four approved villa cards of pages/pain-management.ts, unchanged (no prices).
      villas: [
        { name: "Deluxe Villa", body: "A king-size bed and private bathroom, with Wi-Fi, TV and air conditioning.", link: { label: "Explore Deluxe Villa", href: "/deluxe-villa/" } },
        { name: "Classic Villa", body: "Garden views and a private bathroom, with Wi-Fi, TV and air conditioning.", link: { label: "Explore Classic Villa", href: "/classic-villa/" } },
        { name: "Royal Villa", body: "A king-size bed, living area and garden access, with Wi-Fi, TV, air conditioning, a kettle and hair dryer.", link: { label: "Explore Royal Villa", href: "/royal-villa/" } },
        { name: "Maharaja Suite", body: "A king-size bed, a living area with a couch and garden access in a premium location.", link: { label: "Explore Maharaja Suite", href: "/maharaja-suite/" } },
      ],
    },
    stay: {
      heading: "What your Panchakarma stay includes",
      paragraphs: ["Stay in an independent villa at Kairali, an NABH-accredited Ayurvedic hospital with gardens and space to rest between appointments. Your programme brings care and daily routines together:"],
      lists: [{
        items: [
          "Villa accommodation and vegetarian breakfast, lunch and dinner as advised by your doctor.",
          "Prescribed Ayurvedic therapies and daily doctor reviews.",
          "Yoga and meditation alongside your treatment schedule.",
          "Lectures, village walks and organic garden visits, according to the activity schedule.",
          "Lifestyle and fitness evaluation, with access to the swimming pool, library and gym.",
          "Herbal drinking water during your stay.",
        ],
      }],
      after: ["Ask for your treatment itinerary and a personalised quotation. Confirm the therapy schedule, accommodation, taxes and any separately charged medicines, tests, specialist care, additional sessions, transport or personal services before booking."],
    },
    doctors: {
      heading: "Meet your Ayurvedic doctors",
      intro: "Our doctors assess your health history, plan your care and review your progress. Ask about doctor availability when you enquire.",
    },
    faqHeading: "Frequently asked questions",
    closing: {
      heading: "Plan your Panchakarma stay",
      paragraphs: ["Discuss your needs, the time you have available and what the programme may involve. Start with a free initial doctor consultation and review your treatment plan and quotation before you book."],
    },
  },
  faq: [
    { q: "Who can enquire about Panchakarma?", a: "You can enquire whether you have a diagnosed condition or simply want to understand the programme. Suitability depends on your health, medicines and the proposed procedures. Share your symptoms, medical history and goals so the doctor can assess what may be appropriate." },
    { q: "How long is the programme, and when might I notice a change?", a: "The published Panchakarma programme is a 14–28 night stay. Your doctor will confirm the recommended duration and discuss realistic goals with you. Responses and timing vary; ask how progress will be reviewed and what preparation or follow-up your plan may involve." },
    { q: "Will I have all five Panchakarma procedures?", a: "Not automatically. Your doctor decides which procedures are appropriate after assessing your health history, medicines and needs. Ask them to explain the proposed procedures, their preparation and availability before you decide on a stay." },
    { q: "What will I eat and do each day?", a: "Your programme combines prescribed therapies, vegetarian meals, yoga, meditation and rest. The doctor advises on your diet and reviews your care. Walks, lectures and garden visits are also available according to the schedule; discuss which activities fit your individual treatment plan." },
    { q: "Is the consultation free, and how is my stay quoted?", a: "Your initial doctor consultation is free. The stay is quoted according to your programme, duration, dates and villa occupancy. Ask for a breakdown of included care, doctor reviews and any later services, with separately charged items clearly explained before booking." },
    { q: "What should I arrange before travelling?", a: "Discuss your medical history, current medicines and available time with the doctor. Confirm your programme, dates and accommodation, and ask about preparation and follow-up. Tell our team about dietary or access needs and whether you need help arranging airport transfers." },
  ],
});
