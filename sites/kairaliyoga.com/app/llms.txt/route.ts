import { buildLlmsTxt } from "@kairali/seo";
import siteConfig from "../../site.config.json";

// llms.txt (Ship Gate B2): ruled facts only — programme names/durations as
// printed in RATES_RECKONER.md; locked contacts; PR #65 lineage phrasing.
export const dynamic = "force-static";

export function GET() {
  const body = buildLlmsTxt(siteConfig, {
    name: "Kairali Yoga — residential yoga programmes at the Ayurvedic Healing Village",
    summary:
      "Kairali Yoga is the yoga programme surface of Kairali — The Ayurvedic Healing Village, a NABH-accredited Ayurvedic hospital in Palakkad, Kerala. Three residential programmes with printed minimum stays combine private sunrise yoga, private guided evening mindfulness, one Ayurvedic therapy per day and daily physician check-ins. No prices or batch dates are published; admissions are arranged by enquiry.",
    facts: [
      "Programme: Kairali's Yoga & Meditation Package — Dhyāna-Yoga Shibiram (minimum 07 nights)",
      "Programme: Digestive Wellness & Gut Health Yoga Therapy — Agni Dīpanam Yoga Chikitsa (minimum 14 nights)",
      "Programme: Yoga based Stress & Energy Reset Program — Prāna Sāmya Yoga Chikitsa (minimum 07 nights)",
      "Included daily: private sunrise yoga session, private guided evening mindfulness session, one Ayurvedic therapy (herbal steam baths included), wellness check-in with the Ayurvedic doctor, three vegetarian Ayurvedic meals from organic ingredients",
      "Weekly: Ayurveda & yoga workshops, Ayurvedic cooking classes, organic farm tours, village walks, nature trails",
      "Ayurveda Training Courses at the hospital: 1-day workshop, 3-day certificate, 5-day intensive, 10-day advanced, 20-day advanced consultant — certification by Kairali Institute of Panchakarma Therapies",
      "Venue: Kairali — The Ayurvedic Healing Village (NABH-accredited Ayurvedic hospital), Olassery P.O., Kodumbu, Palakkad District 678551, Kerala, India",
      "Transfers: Palakkad Railway Station 25 km, Coimbatore Airport 75 km, Cochin/Calicut airports 125 km",
      "Kairali Ayurvedic Group founded 1989 by K. V. Ramesh and Gita Ramesh; the family has practised Ayurveda since 1908",
      "No prices and no batch dates are published on this site — enquire at info@kairali.com or WhatsApp +91 92898 38797",
    ],
    sections: [
      {
        title: "Kairali sites",
        links: [
          { title: "Kairali Ayurvedic Group", url: "https://www.kairali.com", note: "the group behind the programmes" },
          { title: "Kairali — The Ayurvedic Healing Village", url: "https://www.ayurvedichealingvillage.com", note: "the NABH-accredited hospital hosting the programmes" },
          { title: "Kairali Store (India)", url: "https://www.kairaliproducts.in", note: "the group's product range" },
        ],
      },
    ],
  });
  return new Response(body, { headers: { "Content-Type": "text/plain; charset=utf-8" } });
}
