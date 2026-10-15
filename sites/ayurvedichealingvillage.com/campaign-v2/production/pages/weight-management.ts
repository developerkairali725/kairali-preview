// /weight-loss.html — final-batch/weight-loss.md, variant C (Editorial), buyer: adult who has found weight changes
// hard to sustain and wants a doctor-guided residential programme. Copy adapted from the reviewed brief for sales
// clarity (kairali-akshar-marketing-science CREATE+REVIEW); facts only from the brief, its NONPUBLIC audit (C22) and
// data/doctors.ts. Highest claims risk: weight-management framing only — no kilograms, no timelines, no BMI, no
// outcome, no body-shaming, no named conditions. The 14-night minimum admission is the brief's own fact (audit C22).
// Owner decision, 14 Oct 2026 (AHV-WB.299.change: "it needs guest film you can use rupak mann one"): one guest story,
// the Rupak Mann film already published on the legacy weight page, with its existing local thumbnail. Title uses only
// the approved attribution; no quote, figure or timeline is reproduced, and the caveat matches the other story bands.
import { defineCopy } from "../copy.ts";

export default defineCopy({
  slug: "weight-management",
  route: "/weight-loss.html",
  source: { file: "final-batch/weight-loss.md", sha256: "e698609e1c0ecb5db04514790c7ac69a13ca56c241054c545d1b2b2251d695b6" },
  // The brief's SEO title and description, verbatim (straight apostrophe as in the brief).
  seo: {
    title: "Ayurvedic Weight Management in Kerala | Kairali",
    description: "Discuss weight management and daily habits with Kairali's Ayurvedic doctors in Palakkad. Explore prescribed care, vegetarian meals and a residential stay.",
  },
  adMatch: {
    keywords: ["ayurvedic treatment for weight loss", "ayurvedic weight loss treatment kerala", "ayurvedic weight management"],
    adHeadlines: [],
  },
  hero: {
    overline: "Doctor-guided Ayurveda · Palakkad, Kerala",
    h1: "Ayurvedic weight management for the way you live",
    standfirst: "Make time to understand your health, food habits and daily routine with an Ayurvedic doctor, then plan a programme around realistic goals.",
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
      heading: "Look beyond a target on the scales",
      paragraphs: [
        "Weight management raises practical questions: how to plan meals, make time for activity, cope with an irregular routine and keep changes going after a stay. At Kairali – The Ayurvedic Healing Village in Palakkad, Kerala, Weight Management & Metabolism Therapy is planned around an individual assessment and realistic goals.",
        "Kairali is an NABH-accredited Ayurvedic hospital. Ayurvedic doctors prescribe and review your care, and trained therapists carry out the recommended sessions. No one can promise a set amount of weight change or a fixed result for everyone.",
        "What your stay offers: Ayurvedic doctors who prescribe and review your care, trained therapists for the recommended sessions, and a steady rhythm of meals, sessions and quiet time in the villas and gardens.",
      ],
      points: [
        "You have tried diets that were hard to keep up",
        "Your routine makes regular meals and activity difficult",
        "You take medicines or have health needs to consider",
        "You want habits you can continue at home",
      ],
    },
    offering: {
      kind: "cards",
      kicker: "Your programme",
      heading: "Bring care and daily habits together",
      intro: ["Your assessment shapes the programme. The schedule is individual; a programme name does not prescribe every treatment for every patient."],
      cards: [
        { title: "Prescribed therapies", paragraphs: ["Your doctor explains which therapies may be appropriate and how they fit into the programme. Oil therapies, steam treatments or other Ayurvedic care are considered according to your assessment."] },
        { title: "A personalised vegetarian diet", paragraphs: ["A personalised vegetarian diet is part of the programme. Discuss your usual eating patterns, food restrictions and practical needs, so the team can explain the proposed meals and arrangements."] },
        { title: "Activity and rest in your day", paragraphs: ["The daily routine makes time for care, appropriate activity and rest. Ask about yoga and meditation sessions that suit your assessment, and tell the doctor about any injury or limitation before taking part."] },
        { title: "Progress and life after the stay", paragraphs: ["Discuss how progress will be reviewed and which habits you would like to continue at home. Before discharge, ask for clear guidance on your routine and any recommended follow-up, including how later consultations or services are arranged."] },
      ],
    },
    pathway: {
      heading: "How your programme takes shape",
      steps: [
        { title: "Start with a free doctor consultation", body: "Tell the doctor what you have tried, what has been hard to sustain and what you would like to work towards. Share your medical history, current medicines, physical limitations and any ongoing care." },
        { title: "Agree your plan and dates", body: "Weight Management & Metabolism Therapy has a minimum admission of 14 nights. Your doctor discusses the duration appropriate to your needs; confirm the programme and dates before making travel arrangements." },
        // AHV-WB.308.change (staff workbook row 311): the day plan from the programme's own approved Dinacharya and
        // inclusions (/weight-loss-programme/: two therapies a day, morning yoga, evening meditation, weekly walk). No outcome.
        { title: "Your 14-night routine", body: "Over the minimum 14-night admission, a typical day begins with group yoga at 06:30, as advised by your doctor, and a vegetarian breakfast. Your therapies are at 09:30 and 15:30, each followed by rest; therapy types, times and durations follow your doctor’s plan. Lunch is at 13:00, and a cooking demonstration, garden visit, workshop or lecture may be scheduled at 14:00. Guided meditation at 18:30 comes before dinner, and a farm, village or nature walk is arranged each week. Keep your doctor informed about how you feel, and ask how your progress will be reviewed during the stay." },
      ],
    },
    rest: {
      heading: "Space to rest between appointments",
      paragraphs: ["Not every hour is scheduled. The villas and gardens give you room to rest between appointments, take a quiet walk or simply sit outside. Meals, sessions and quiet time follow a steady rhythm, so the day supports the routine your doctor recommends."],
    },
    place: {
      heading: "Choose a villa and plan any companion stay",
      paragraphs: ["Patient care can explain accommodation options, occupancy and practical arrangements, including a companion’s stay where available. Mention dietary or access needs early, so they can be discussed before booking."],
      // Villa cards copied exactly from pain-management.ts.
      villas: [
        { name: "Deluxe Villa", body: "A king-size bed and private bathroom, with Wi-Fi, TV and air conditioning.", link: { label: "Explore Deluxe Villa", href: "/deluxe-villa/" } },
        { name: "Classic Villa", body: "Garden views and a private bathroom, with Wi-Fi, TV and air conditioning.", link: { label: "Explore Classic Villa", href: "/classic-villa/" } },
        { name: "Royal Villa", body: "A king-size bed, living area and garden access, with Wi-Fi, TV, air conditioning, a kettle and hair dryer.", link: { label: "Explore Royal Villa", href: "/royal-villa/" } },
        { name: "Maharaja Suite", body: "A king-size bed, a living area with a couch and garden access in a premium location.", link: { label: "Explore Maharaja Suite", href: "/maharaja-suite/" } },
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
      heading: "Understand your quotation before you commit",
      paragraphs: ["Ask for a personalised quotation for the recommended programme, dates, duration and villa occupancy. Your initial doctor consultation is free; the quotation explains the inclusions and any charges in the proposed plan."],
      lists: [
        { heading: "Confirm what is included", items: ["Your programme, dates and number of nights", "Villa category, occupancy and taxes", "Meals and doctor reviews", "Therapy sessions and activities"] },
        { heading: "Ask about separate charges", items: ["Medicines and tests", "Additional care", "Transport", "Personal services"], extra: true },
      ],
    },
    doctors: {
      heading: "Meet your Ayurvedic doctors",
      intro: "Your doctors assess your needs, plan your care and review your progress. Meet the team below; ask about doctor availability when arranging your consultation.",
    },
    faqHeading: "Frequently asked questions",
    closing: {
      heading: "Discuss your goals with a doctor",
      paragraphs: ["Tell us what you would like to work on and when you could travel. Start with a free initial consultation to understand suitability, the proposed programme and the practical next steps."],
    },
  },
  faq: [
    { q: "Is this programme suitable if I have struggled with previous diets?", a: "You can discuss previous approaches and the difficulties you experienced in your consultation. Your doctor considers that history alongside your health and goals when assessing suitability. A past experience alone does not determine which programme is right for you." },
    // The buyer's own search words in the question; the answer keeps the brief's no-promise wording without a unit.
    { q: "Can I expect a specific amount of weight loss?", a: "Weight change and timing vary between individuals. The doctor can discuss realistic goals and how progress will be reviewed. The programme does not promise a particular amount of weight change or any fixed outcome." },
    { q: "What if I have a health condition or take medicines?", a: "Share relevant records, current medicines and information about ongoing care. The doctor will assess whether the programme is appropriate and discuss any further information needed. This programme does not replace the medical care your other conditions require." },
    { q: "How long should I stay?", a: "The minimum admission for Weight Management & Metabolism Therapy is 14 nights. Your doctor will discuss the duration appropriate to your needs. Confirm the recommended duration and the programme before booking travel." },
    { q: "Can the programme take account of dietary needs or physical limitations?", a: "Explain food restrictions, injuries and any assistance you need during the consultation. Ask the team to confirm the proposed meals, suitable activities and practical arrangements before you decide on a stay." },
    { q: "What happens after I leave?", a: "Discuss discharge guidance and the routine you can continue at home. Ask about any recommended follow-up, availability and charges. Later services should be confirmed individually rather than assumed to be included indefinitely." },
    { q: "Is the initial consultation free, and what will I pay for?", a: "Your initial doctor consultation is free. Ask our team to set out your programme, accommodation, care and any later services, then review what is included and any separately charged items before confirming your stay." },
  ],
});
