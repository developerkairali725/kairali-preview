// /family-ayurvedic-retreat-kerala.html — the reviewed copy (owner-correction/family-ayurvedic-retreat.md), arranged
// into the production template. Wording is the brief's own. The programme topics name diagnoses a visitor may
// discuss (never as a treatment claim; kit/lint/claims.ts lists each as a disease.mention warning for clinical review).
import { defineCopy } from "../copy.ts";

const STORY = "/ahv/images/";

export default defineCopy({
  slug: "family-ayurvedic-retreat",
  route: "/family-ayurvedic-retreat-kerala.html",
  source: { file: "family-ayurvedic-retreat.md", sha256: "f3b0d2d2f3703f2f4dd83acd4938746135bb272646bd7e8586d6e0f678101524" },
  seo: {
    title: "Family Ayurveda Retreat in Kerala | Kairali",
    description: "Plan a family Ayurveda stay in Palakkad, Kerala. Discuss individual care, villa options and shared travel in a free initial doctor consultation.",
  },
  adMatch: { keywords: ["family ayurveda retreat kerala", "ayurvedic retreat with parents", "family ayurveda package kerala"], adHeadlines: [] },
  hero: {
    overline: "Doctor-guided Ayurveda · Palakkad, Kerala",
    h1: "Family Ayurveda retreat in Kerala",
    standfirst: "Plan a shared stay in Kerala with individual care for each person, time together and villa options to discuss with our team.",
  },
  cta: {
    primary: "Get Free Doctor Consultation",
    primarySupport: "Your initial consultation is free. Ask for a quotation covering treatment and any later services.",
    secondary: "Ask Anything",
  },
  // Editorial context only: this route has no Step-1 bar; its form asks its own preferred duration.
  programDefault: "Family Ayurveda Retreat",
  doctors: ["deepu-john", "rahul-r", "akhila-oommen", "adhina-ub", "aashitha-ps"],
  // The family form's note under its optional health-conditions field (approved with the batch-2 copy, 7 Oct 2026).
  familyFormNote: "Share any health concerns you would like to discuss with the doctor. This field is optional.",
  page: {
    lead: {
      heading: "A family Ayurveda retreat, with care planned for each person.",
      paragraphs: ["A family Ayurveda retreat in Kerala can bring your own wellbeing plans together with a parent’s care, a partner’s programme or time shared as companions. At Kairali’s NABH-accredited Ayurvedic hospital in Palakkad, each person’s assessment guides their care. Plan the travel and accommodation together, while leaving room for different therapies, routines and lengths of stay.", "What your stay offers: travel and accommodation planned together, care planned for each person, and space for rest and time together in the gardens."],
      points: [
        "Travel with your partner, parents or several generations",
        "Discuss each person’s health, current treatment and goals separately",
        "Confirm room access, meals, occupancy and assistance before booking",
        "Agree care, participation and charges for companions and younger travellers",
      ],
    },
    offering: {
      kind: "index",
      heading: "Explore the care each person wants to discuss",
      intro: ["Use these programme topics to start the conversation with your doctor. Family members may need different care, and participation is confirmed individually."],
      // Owner decision, 14 Oct 2026 (AHV-WB.083.change): adult children bringing their parents — only the existing
      // approved topics suited to older parents, in their reviewed order and wording; no new topic, wording or claim.
      topics: [
        { title: "Cardiovascular health and blood pressure", body: "Discuss your diagnosis, blood-pressure history and prescriptions. Confirm assessment, monitoring, meals and suitable activity as part of planning the stay alongside your existing care." },
        { title: "Back pain and sciatica", body: "Explain how pain or stiffness affects walking, sitting and sleep. Discuss the suitability of therapies such as Kati Basti, along with room access, assistance and guidance for everyday movement." },
        { title: "Stress and mental wellbeing", body: "Give each person space to discuss stress, daily life and current mental-health care. Explore suitable meditation, breathing practices or prescribed therapies such as Shirodhara, and confirm the support available." },
        { title: "Diabetes and metabolism", body: "Share your diagnosis, monitoring, medicines and dietary guidance. Discuss how meals, timing, suitable activity and any proposed Ayurvedic care fit your existing treatment and travel needs." },
        { title: "Digestive and gut health", body: "Discuss symptoms, reports, current care and dietary needs. The doctor can explain the Ayurvedic concept of Agni and any proposed diet, therapies or yoga practice, with a plan for review." },
        { title: "Immunity and executive health assessment", body: "Talk about your wellbeing goals, fatigue or other concerns, and the assessment that would be useful. Ask what proposed Ojas or Rasayana care involves rather than assuming a particular outcome." },
        { title: "Joint care and arthritis", body: "Discuss osteoarthritis, rheumatoid arthritis or other joint concerns, including stairs, walking and daily tasks. Ask about suitable local therapies such as Janu Basti, movement and support during the stay." },
      ],
    },
    pathway: {
      heading: "Bring everyone’s plans together",
      steps: [
        { title: "Tell us who is travelling", body: "Share the ages of family members, the reason for each enquiry and any current treatment or assistance needs. Start with a free initial doctor consultation." },
        { title: "Plan individual care and a shared stay", body: "Discuss the proposed programme and duration for each person. Then work through dates, who will share a villa, meal needs and anyone travelling as a companion." },
        { title: "Confirm the details before you travel", body: "Review each person’s quotation and the room arrangements. Complete advance health forms and bring current prescriptions and relevant medical reports." },
      ],
    },
    rest: {
      heading: "A day with time for care and time together",
      paragraphs: ["Mornings can begin with suitable yoga and breakfast before scheduled appointments. Lunch makes room for a pause; afternoon care is followed by the evening meditation and dinner schedule. Your doctor and care team confirm participation and treatment times for each person, leaving space for rest and time together in the gardens."],
    },
    place: {
      heading: "Find a villa arrangement that works for your family",
      paragraphs: ["Choose from four villa categories within Kairali’s 65-acre setting. Tell patient care who will share, whether you would prefer adjoining villas and what access or assistance you need. Confirm availability and the actual room allocation for your dates."],
      villas: [
        { name: "Deluxe Villa", body: "A king-size bed and private bathroom, with Wi-Fi, TV and air conditioning.", link: { label: "Explore Deluxe Villa", href: "/deluxe-villa/" } },
        { name: "Classic Villa", body: "Garden views and a private bathroom, with Wi-Fi, TV and air conditioning.", link: { label: "Explore Classic Villa", href: "/classic-villa/" } },
        { name: "Royal Villa", body: "A king-size bed, living area and garden access, with Wi-Fi, TV, air conditioning, a kettle and hair dryer.", link: { label: "Explore Royal Villa", href: "/royal-villa/" } },
        { name: "Maharaja Suite", body: "A king-size bed, a living area with a couch and garden access in a premium location.", link: { label: "Explore Maharaja Suite", href: "/maharaja-suite/" } },
      ],
    },
    // The page's own films and thumbnails, as on the page this replaces: links to YouTube, no embedded player.
    stories: {
      heading: "Hear from people who have stayed at Kairali",
      body: "Watch people describe their stays in their own words. Individual experiences vary.",
      films: [
        { title: "Watch Ms. Supriya’s experience", href: "https://www.youtube.com/watch?v=3vWviQfW1Ug", thumb: { src: `${STORY}7ed7fe732c79427d6e00bc42d720a2a3b0b6e5c5ce2e25e260b53823a33ed17d.webp`, width: 480, height: 360 } },
        { title: "Watch Michaela & Jan’s experience", href: "https://www.youtube.com/watch?v=4x01PtWfNnk", thumb: { src: `${STORY}5e86ab8760fb7570f517bfe69abfbcaa8a0168127e03d927656a69155934faf0.webp`, width: 640, height: 480 } },
        { title: "Watch Corine’s experience", href: "https://www.youtube.com/watch?v=DcTMckQD3rc", thumb: { src: `${STORY}d29b9a9547272822619b085b78fee54550d828dd5e1792486eef0b6e102d4351.webp`, width: 480, height: 360 } },
      ],
    },
    stay: {
      "heading": "A stay planned around your family",
      "paragraphs": [
        "Share your preferred dates, the number of people travelling and who would like Ayurvedic care. Our team can help you explore suitable programmes, villa options and companion stays, with a personalised quotation for your family."
      ],
      "lists": [
        {
          "heading": "Your family’s stay",
          "items": [
            "Villa choice, room occupancy and taxes",
            "Meals for each family member",
            "Doctor reviews and individually prescribed therapies",
            "Yoga, meditation and activities suited to your programme",
            "Companion arrangements and leisure access"
          ]
        },
        {
          "heading": "Services that may cost extra",
          "items": [
            "Medicines and diagnostic tests",
            "Specialist therapies outside your programme",
            "Travel arrangements and personal expenses",
            "Any additional services you choose"
          ],
          "extra": true
        }
      ],
      "after": [
        "Treatment, yoga and companion stays have different inclusions. We’ll explain what is included and any additional charges before you confirm your booking."
      ]
    },
    doctors: {
      heading: "Meet your Ayurvedic doctors",
      intro: "Your doctors assess your health history, plan your care and review your progress. Meet the team below; doctor availability is confirmed when you enquire.",
    },
    faqHeading: "Your questions, answered",
    closing: {
      heading: "Start with a conversation about your stay",
      paragraphs: ["Tell us what brings you to Kairali and the questions you would like to discuss. Our patient care team can help you explore programme suitability, villas, travel and the details of your stay."],
    },
  },
  faq: [
    { q: "Can family members follow different programmes?", a: "Yes. Each person’s medical history, current care and goals are assessed individually. Programmes and recommended durations may differ even when you travel together. Patient care can help coordinate dates, villas and practical arrangements once those individual plans are clear." },
    { q: "Can I book a family Ayurveda retreat with my parents?", a: "You can discuss a shared stay with our team. Explain your parents’ health, prescriptions, mobility and any assistance needs. The doctor assesses programme suitability; patient care helps you confirm access, accommodation and travel arrangements. Panchakarma or other therapies may be modified or deferred according to medical guidance." },
    { q: "Can children and teenagers take part?", a: "Tell the team each child’s age, health needs and the reason for your enquiry. Care, yoga and other participation should be assessed individually. An adult programme is not automatically suitable for a younger family member, and age alone does not determine the right plan." },
    { q: "Can someone come as a companion without treatment?", a: "Ask patient care about companion arrangements for your dates. Explain who will receive treatment and who will accompany them, then confirm occupancy, meals, leisure access and charges. Ayurveda, yoga and companion stays can have different inclusions." },
    { q: "Will we stay together, and can you accommodate dietary needs?", a: "Discuss how many people are travelling, who will share and whether you prefer adjoining villas. Tell the team about allergies, restrictions and existing dietary advice for every family member. Confirm the actual rooms and meal arrangements before booking, including the needs of older relatives or children." },
    { q: "What kind of care setting does Kairali provide?", a: "Kairali – The Ayurvedic Healing Village is an NABH-accredited Ayurvedic hospital with residential villas in Palakkad, Kerala. Therapies are prescribed after medical assessment. Family travel and time together can be planned around each person’s care rather than a single treatment schedule for everyone." },
    { q: "How long should we stay, and what should we bring?", a: "Discuss the recommended duration for each person before arranging travel. The enquiry form’s preferred-duration options help explain your availability; they are not medical recommendations. Complete the advance health forms and bring current prescriptions and relevant medical reports." },
    { q: "Is the initial doctor consultation free?", a: "Yes. Use the free initial consultation to discuss health history, current treatment and whether a stay may suit you. It does not make treatment, tests, medicines or later services free." },
    { q: "What is included in a family Ayurveda package?", a: "Ask for a quotation for each person’s programme, villa occupancy and dates. Confirm meals, doctor reviews, prescribed therapies, yoga and meditation, activities and leisure access. Ayurveda, yoga and companion plans differ, so check which sessions are included and which medicines, tests, specialist services, travel or personal extras cost more." },
  ],
});
