// Contact details and shared facts. Every page reads from here.

export const contact = {
  phone: {
    display: "+91 9555 156 156",
    href: "tel:+919555156156", // no spaces
  },
  whatsapp: {
    display: "+91 92898 38797",
    number: "919289838797", // wa.me format: country code, no plus or spaces
  },
  // Live pages show contact@ayurvedichealingvillage.com – see OPEN-ITEMS.md.
  email: "info@kairali.com",
  address: [
    "III/73 Palayamkadu",
    "P.O. Olassery, Kodumbu",
    "Palakkad District 678551",
    "Kerala, India",
  ],
} as const;

export const site = {
  name: "Kairali – The Ayurvedic Healing Village",
  shortName: "Kairali",
  tagline: "The Ayurvedic Healing Village",
  // From the staging credential line; "established 1989" per management.
  accreditation:
    "NABH-accredited Ayurvedic hospital, Palakkad · Certificate AH-2024-0250 · Established 1989",
  legal: {
    privacy: "/new-privacy-policy/",
    terms: "/terms-and-conditions/",
    cookies: "/lp/cookie-policy/",
  },
  // Social strip, as on the staging /lp/ pages.
  social: [
    { label: "X (Twitter)", href: "https://x.com/Kairali_Group" },
    { label: "YouTube", href: "https://www.youtube.com/@kairaliayurvedagroup" },
    { label: "LinkedIn", href: "https://www.linkedin.com/company/kairali-ayurvedic-group" },
    { label: "Facebook", href: "https://www.facebook.com/KairaliGroup" },
  ],
} as const;

// Anchor of the enquiry section. The staging /lp/ pages use #consult.
export const ENQUIRY_ID = "consult";
export const ENQUIRY_HREF = `#${ENQUIRY_ID}`;

export const PRIMARY_CTA = "Plan my programme";

export function whatsappLink(text?: string) {
  const base = `https://wa.me/${contact.whatsapp.number}`;
  return text ? `${base}?text=${encodeURIComponent(text)}` : base;
}
