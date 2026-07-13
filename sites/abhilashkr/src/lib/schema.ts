import { SITE_URL } from "./config";

export function getPersonSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "Person",
    "@id": `${SITE_URL}/#person`,
    "name": "Abhilash Kalathil Ramesh",
    "alternateName": [
      "Abhilash K. Ramesh",
      "Abhilash Ramesh",
      "Abilash Ramesh",
      "Abilash K. Ramesh"
    ],
    "email": "info@kairali.com",
    "image": {
      "@type": "ImageObject",
      "url": `${SITE_URL}/images/abhilash-portrait.png`,
      "caption": "Abhilash Kalathil Ramesh — Executive Director, Kairali Ayurvedic Group"
    },
    "jobTitle": "Executive Director",
    "worksFor": {
      "@type": "Organization",
      "name": "Kairali Ayurvedic Group",
      "url": "https://www.kairali.com",
      "sameAs": [
        "https://www.kairaliproducts.com",
        "https://ktahv.com"
      ]
    },
    "memberOf": [
      {
        "@type": "Organization",
        "name": "AYUSHEXCIL (Ayush Export Promotion Council)",
        "url": "https://ayushexcil.in"
      },
      {
        "@type": "Organization",
        "name": "Mumbai Angels Network",
        "url": "https://www.mumbaiangels.com"
      }
    ],
    "alumniOf": {
      "@type": "EducationalOrganization",
      "name": "Florida International University",
      "url": "https://www.fiu.edu"
    },
    "knowsLanguage": ["Malayalam", "English", "German", "Chinese"],
    "sameAs": [
      "https://www.linkedin.com/in/abhilashkramesh-ayurvedicmedicine-ayurvedicherbalproducts/"
    ],
    "knowsAbout": [
      "Ayurveda",
      "Ayurvedic medicine",
      "wellness tourism",
      "Ayurvedic pharmaceutical manufacturing",
      "AYUSH export policy",
      "hospitality management",
      "angel investing",
      "family business",
      "AI in business operations"
    ],
    "award": [
      "Best Marketing Director India — Haute Grandeur Global Excellence Awards (2026)",
      "Excellence in Wellness Hospitality (India) — PATWA International Travel Awards (2026)",
      "Asia Pacific Entrepreneurship Award (APEA), Most Promising — Enterprise Asia (2016)",
      "Entrepreneurial Excellence for AYUSH Leadership — Indian Salon & Wellness Awards (2015)",
      "40 Under 40 Most Influential — AsiaOne (2017)"
    ]
  };
}
