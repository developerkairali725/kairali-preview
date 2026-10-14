// /pain-management.html — the reviewed copy (owner-correction/pain-management.md), arranged into the production
// template. Wording is the brief's own. A condition page: it names diagnoses a visitor may discuss (never as a
// treatment claim; kit/lint/claims.ts lists each as a disease.mention warning for clinical review).
import { defineCopy } from "../copy.ts";

const STORY = "/ahv/images/";

export default defineCopy({
  slug: "pain-management",
  route: "/pain-management.html",
  source: { file: "pain-management.md", sha256: "89cf5e4c3a21e7d3995e1aaef18980fbf3741e744343a6ea5a0942ce17200c57" },
  seo: {
    title: "Ayurvedic Pain Management in Kerala | Kairali",
    description: "Discuss pain management with an Ayurvedic doctor in Palakkad, Kerala. Explore your care and stay options in a free initial consultation.",
  },
  adMatch: { keywords: ["ayurvedic pain management kerala", "ayurvedic treatment for back pain", "ayurvedic treatment for joint pain"], adHeadlines: [] },
  hero: {
    overline: "Doctor-guided Ayurveda · Palakkad, Kerala",
    h1: "Ayurvedic pain management in Kerala",
    standfirst: "Discuss your pain, health history and daily needs with an Ayurvedic doctor, then plan a stay in Kerala with care and time to rest.",
  },
  cta: {
    primary: "Get Free Doctor Consultation",
    primarySupport: "Your initial consultation is free. Ask for a quotation covering treatment and any later services.",
    secondary: "Ask Anything",
  },
  // Editorial context only: this route has no Step-1 bar, and its form asks no program question.
  programDefault: "Pain Management",
  doctors: ["deepu-john", "rahul-r", "akhila-oommen", "adhina-ub", "aashitha-ps"],
  page: {
    lead: {
      heading: "Care that starts with your everyday life",
      paragraphs: ["Planning Ayurvedic pain management starts with understanding how pain affects walking, sitting or sleeping. At Kairali – The Ayurvedic Healing Village, an NABH-accredited Ayurvedic hospital in Palakkad, Kerala, your consultation brings together your symptoms, medical history and current treatment. Discuss whether a residential Ayurveda programme is right for you, and the practical help you would need during a stay."],
      points: [
        "Back pain, slipped disc and associated discomfort",
        "Joint pain, osteoarthritis and rheumatoid arthritis",
        "Spondylitis, stiffness and rheumatic discomfort",
        "Muscular pain and sciatica affecting daily activities",
      ],
    },
    offering: {
      kind: "cards",
      kicker: "Your care plan",
      heading: "What your pain management plan may involve",
      intro: ["Your assessment guides the care prescribed for you. These are topics to discuss with your doctor, rather than a fixed set of treatments for everyone."],
      cards: [
        { title: "Ayurvedic therapies", paragraphs: ["Discuss therapies such as Abhyangam – full-body medicated oil therapy; Kizhi, a herbal treatment; Pizhichil, a warm oil treatment; Kati Basti, herbal oil pooling; or Nasya, nasal administration. Your doctor explains which procedures suit you and what each session involves."] },
        { title: "Medicines considered alongside your current care", paragraphs: ["Bring a list of your prescriptions and supplements. If Ayurvedic medicines are proposed, discuss their purpose, ingredients and possible interactions with the clinicians involved in your treatment."] },
        { title: "Food, movement and rest", paragraphs: ["Build the daily routine around your needs. Your doctor can discuss meals, posture, suitable movement, yoga or meditation, and ways to manage stress. Tell the team about allergies, dietary advice and physical limitations."] },
        { title: "Reviews during the stay and guidance for home", paragraphs: ["Keep your doctor informed about comfort, symptoms and any concerns. Before departure, understand the routine recommended for you and how follow-up will work, including the frequency and cost of later consultations."] },
      ],
    },
    pathway: {
      heading: "From your first conversation to your stay",
      steps: [
        { title: "Start with a free initial consultation", body: "Describe your pain, what has become difficult and what you would like to discuss. Share reports, your diagnosis and details of current or previous treatment." },
        { title: "Agree the care and practical arrangements", body: "Discuss proposed therapies, the recommended stay, room access and any companion or assistance needs." },
        { title: "Settle into your care routine", body: "Attend prescribed sessions and make time for meals and rest. Ask how your progress will be reviewed and what to do if you feel uncomfortable or your needs change." },
      ],
    },
    rest: {
      heading: "Time to rest between appointments",
      paragraphs: ["Care is only one part of planning your day. Leave space for prescribed meals, rest and the activity your doctor recommends. Kairali’s gardens offer a quiet setting between appointments, with room to pause rather than rush from one session to the next."],
    },
    place: {
      heading: "Choose a villa around your comfort and access needs",
      paragraphs: ["Explore the accommodation options, then tell patient care about mobility, room access or help you may need. If someone is travelling with you, confirm occupancy and companion arrangements for your dates."],
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
      heading: "Plan your stay with a clear quotation",
      paragraphs: ["Review your programme, accommodation and inclusions before booking. Confirm the recommended stay, villa occupancy and the charges for your dates with patient care."],
      lists: [
        { heading: "Confirm what your stay includes", items: ["Villa stay and taxes", "Three prescribed meals daily", "Daily doctor review", "Prescribed therapies", "Group yoga and meditation", "Weekly activities", "Leisure facilities"] },
        { heading: "Ask about additional charges", items: ["Medicines and tests", "Specialist and private sessions", "Travel and personal extras", "Other items in your quotation"], extra: true },
      ],
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
    { q: "Can I enquire about Ayurvedic pain management for back or joint pain?", a: "Yes. Share where you feel pain, any diagnosis and how symptoms affect your daily routine. The doctor can discuss back pain, joint pain, arthritis, sciatica or related concerns in the context of your medical history. An individual assessment determines whether a programme is suitable." },
    { q: "What happens in the free initial doctor consultation?", a: "You can explain your health history, current treatment and questions about a stay. The doctor discusses suitability and the care that may be proposed. The initial consultation is free; treatment, tests, medicines and later services are not automatically free." },
    { q: "How long should I stay, and when might I notice a change?", a: "There is no single duration or result that applies to everyone. Discuss your available time, the recommended programme and how progress would be reviewed before booking. Ask what would prompt a change in the plan and confirm the number of nights with patient care." },
    { q: "Can I continue my existing medicines and treatment?", a: "Share all prescriptions, supplements and other care with the Ayurvedic doctor and your other treating clinicians. Ask them to review the proposed plan, including any interactions or adjustments. Decisions about combining treatments need to be made for your individual circumstances." },
    { q: "How are therapy safety and comfort assessed?", a: "Tell the doctor about allergies, medical conditions, mobility and any concerns before starting. Ask what the prescribed procedures and medicines involve, including possible risks. During a session, tell your therapist or doctor if you feel uncomfortable. A natural ingredient does not make a treatment suitable for everyone." },
    { q: "Will I need to change my diet or daily routine?", a: "Your doctor can explain dietary guidance and suitable activity for your programme. Discuss existing advice, allergies and restrictions so meals can be planned around your needs. Before leaving, ask which recommendations to continue at home and how to arrange follow-up." },
    { q: "Can I travel with a companion or request help with access?", a: "Tell patient care who is travelling and describe any mobility, room access or assistance needs. The team can discuss villas and companion arrangements for your dates. Confirm the actual accommodation, support and charges before booking." },
    { q: "What should my quotation include?", a: "Check the programme, number of nights, villa occupancy, taxes, meals, doctor reviews and prescribed therapies. Confirm the yoga or meditation sessions and activities included in your plan. Ask separately about medicines, tests, specialist or private sessions, travel and personal extras." },
  ],
});
