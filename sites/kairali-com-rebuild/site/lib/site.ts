import { SOCIAL_PROFILES } from "../../../../packages/social/src/config";
import { cleanRoute } from "./routes";

// Site-wide constants. Every value here is sourced; see docs/SOURCE-FACT-DECISIONS.md.

export const SITE_URL = "https://www.kairali.com"; // production canonical host (live site uses www)
export const SITE_NAME = "Kairali Ayurvedic Group";
export const IS_PRODUCTION = process.env.SITE_ENV === "production";
// Public origin that actually serves /og, /media and /brand files. Canonicals stay on SITE_URL; share images must
// resolve wherever the build is deployed (e.g. https://kairali-web-factory.vercel.app for staging).
export const ASSET_ORIGIN = (process.env.NEXT_PUBLIC_ASSET_ORIGIN || SITE_URL).replace(/\/$/, "");
const id = (v: string | undefined, re: RegExp) => (v && re.test(v.trim()) ? v.trim() : undefined);
export const MEASUREMENT = {
  ga4: id(process.env.NEXT_PUBLIC_GA4_ID, /^G-[A-Z0-9]{6,}$/i),
  gtm: id(process.env.NEXT_PUBLIC_GTM_ID, /^GTM-[A-Z0-9]{4,}$/i),
  clarity: id(process.env.NEXT_PUBLIC_CLARITY_ID, /^[a-z0-9]{6,}$/i),
  googleSiteVerification: process.env.GOOGLE_SITE_VERIFICATION?.trim() || undefined,
};
export const PHONE = { label: "+91-9555156156", href: "tel:+919555156156" }; // live header, 29 Sep 2026
export const TAGLINE = "health through ayurveda | since 1908"; // 2026 logo artwork tagline
export const HOME_H1 = "Health through Ayurveda since 1908."; // owner decision Q3

export type NavLink = { label: string; href: string; external?: boolean };
export type NavGroup = { label: string; href: string; intro: string; links: NavLink[] };

// All 38 live mega-menu destinations (evidence/nav_footer_comparison.json) are carried, grouped
// under the seven Premium v3 labels. Live labels are kept for the individual links.
const LEGACY_NAV: NavGroup[] = [
  {
    label: "Discover Ayurveda", href: "/ayurveda.aspx", intro: "Ayurveda - Science of life.",
    links: [
      { label: "Overview", href: "/ayurveda.aspx" },
      { label: "Discover Ayurveda", href: "/discover-ayurveda.aspx" },
      { label: "Why Ayurveda", href: "/why-ayurveda.aspx" },
      { label: "Ayurveda Treatments", href: "/ayurveda-treatments.aspx" },
      { label: "Vedic Knowledge", href: "/vedic-knowledge.aspx" },
      { label: "Ayurvedic Diet", href: "/ayurvedic-diet.aspx" },
      { label: "Free online consultation", href: "/onlineconsultation.aspx" },
    ],
  },
  {
    label: "Experience Kairali", href: "/hospitality.aspx", intro: "Stays and treatment centres.",
    links: [
      { label: "Hospitality overview", href: "/hospitality.aspx" },
      { label: "Kairali - The Ayurvedic Healing Village", href: "/ayurvedic-healing-village.aspx" },
      { label: "Villa Raag", href: "/villa-raag.aspx" },
      { label: "Collaborating Partners of Kairali", href: "/our-partner-resorts.aspx" },
      { label: "Treatment Centres overview", href: "/treatment-centres.aspx" },
      { label: "Ayurveda Treatment Centres", href: "/ayurveda-treatment-centres.aspx" },
      { label: "Locations", href: "/locations.aspx" },
    ],
  },
  {
    label: "Ayurvedic products", href: "/ayurvedic-products.aspx", intro: "Medicines, remedies and care.",
    links: [
      { label: "Overview", href: "/ayurvedic-products.aspx" },
      { label: "Ayurvedic Medicine", href: "/ayurvedic-medicine.aspx" },
      { label: "Patented Ayurvedic Remedies", href: "/patented-ayurvedic-remedies.aspx" },
      { label: "Skin Care & Body Products", href: "/skin-care-and-body-products.aspx" },
      { label: "Ayurvedic Spa Equipments", href: "/ayurvedic-spa-equipment.aspx" },
      { label: "Ayurvedic Pharmacy Brands", href: "/ayurvedic-pharmacy-brands.aspx" },
      { label: "Shop Kairali products", href: "https://www.kairaliproducts.com/", external: true },
    ],
  },
  {
    label: "Learn & train", href: "/training.aspx", intro: "Courses in the theory and practice of Ayurveda.",
    links: [
      { label: "Training overview", href: "/training.aspx" },
      { label: "Ayurveda College", href: "/ayurveda-college.aspx" },
      { label: "Yoga Teacher Training", href: "/yoga-teacher-training.aspx" },
      { label: "Yoga Ayurveda Retreats", href: "/yoga-ayurveda-retreats.aspx" },
    ],
  },
  {
    label: "Our group", href: "/about-us.aspx", intro: "Four generations of Ayurvedic practice.",
    links: [
      { label: "About Us", href: "/about-us.aspx" },
      { label: "Kairali Ayurvedic Group", href: "/kairali-group-profile.aspx" },
      { label: "Founder’s Message", href: "/founders-message.aspx" },
      { label: "Management Team", href: "/management-team.aspx" },
      { label: "Mission and Vision", href: "/mission-and-vision.aspx" },
      { label: "Awards & Accreditations", href: "/kairali-group-awards.aspx" },
      { label: "Social Responsibility", href: "/ayurveda-csr.aspx" },
      { label: "Careers", href: "/careers.aspx" },
    ],
  },
  {
    label: "Stories & resources", href: "/media-centre.aspx", intro: "News, journal, galleries and downloads.",
    links: [
      { label: "Media Centre", href: "/media-centre.aspx" },
      { label: "Kairali News", href: "/kairali-news.aspx" },
      { label: "Kairali Blog", href: "/kairali-blog.aspx" },
      { label: "Testimonials", href: "/testimonials.aspx" },
      { label: "Media Gallery", href: "/media-gallery.aspx" },
      { label: "Download Centre", href: "/download-centre.aspx" },
      { label: "Archive", href: "/archive.aspx" },
    ],
  },
  {
    label: "Partner with us", href: "/partnerships-and-investment.aspx", intro: "Franchise, management and enquiries.",
    links: [
      { label: "Partnerships & Investment", href: "/partnerships-and-investment.aspx" },
      { label: "Ayurveda Spa Franchise", href: "/ayurveda-spa-franchise.aspx" },
      { label: "Hotel & Spa Management", href: "/hotel-and-spa-management.aspx" },
      { label: "Our Partners", href: "/our-partners.aspx" },
      { label: "Get in touch", href: "/get-in-touch.aspx" },
      { label: "Contact us", href: "/contact-us.aspx" },
      { label: "Enquire now", href: "/enquiry-form.aspx" },
    ],
  },
];
export const NAV: NavGroup[] = LEGACY_NAV.map((group) => ({
  ...group,
  href: cleanRoute(group.href),
  links: group.links.map((link) => ({ ...link, href: link.external ? link.href : cleanRoute(link.href) })),
}));

// Live footer (32 destinations). The whyayurveda.org/topics/csr.aspx CSR link now returns 404
// (checked 29 Sep 2026) so the CSR entry points to the on-site CSR page instead.
const LEGACY_FOOTER_COLUMNS: { title: string; links: NavLink[] }[] = [
  { title: "Kairali", links: [
    { label: "Home", href: "/" }, { label: "About Kairali", href: "/about-us.aspx" }, { label: "Our Group", href: "/kairali-group-profile.aspx" },
    { label: "Our Partners", href: "/our-partners.aspx" }, { label: "Careers", href: "/careers.aspx" }, { label: "Testimonials", href: "/testimonials.aspx" },
  ] },
  { title: "Explore", links: [
    { label: "Ayurveda", href: "/ayurveda.aspx" }, { label: "Hospitality", href: "/hospitality.aspx" }, { label: "Treatment Centres", href: "/treatment-centres.aspx" },
    { label: "Ayurveda Products", href: "/ayurvedic-products.aspx" }, { label: "Training", href: "/training.aspx" }, { label: "Media Centre", href: "/media-centre.aspx" },
  ] },
  { title: "Get in touch", links: [
    { label: "Free online consultation", href: "/onlineconsultation.aspx" }, { label: "Get in touch", href: "/get-in-touch.aspx" },
    { label: "Contact us", href: "/contact-us.aspx" }, { label: "Enquire now", href: "/enquiry-form.aspx" }, { label: "Video gallery", href: "/ayurvedic-hospitality-video-library.aspx" },
  ] },
  { title: "Resources", links: [
    { label: "FAQs and downloads", href: "/download-centre.aspx" }, { label: "Blog", href: "/kairali-blog.aspx" }, { label: "Archive", href: "/archive.aspx" },
    { label: "CSR", href: "/ayurveda-csr.aspx" }, { label: "Site map", href: "/sitemap.aspx" }, { label: "XML sitemap", href: "/sitemap.xml" },
  ] },
];
export const FOOTER_COLUMNS = LEGACY_FOOTER_COLUMNS.map((column) => ({
  ...column,
  links: column.links.map((link) => ({ ...link, href: cleanRoute(link.href) })),
}));
const LEGACY_LEGAL_LINKS: NavLink[] = [
  { label: "Terms and conditions", href: "/terms-and-conditions.aspx" },
  { label: "Privacy policy", href: "/privacy-policy.aspx" },
  { label: "Security policy", href: "/security-policy.aspx" },
  { label: "Useful links", href: "/useful-links.aspx" },
];
export const LEGAL_LINKS = LEGACY_LEGAL_LINKS.map((link) => ({ ...link, href: cleanRoute(link.href) }));
const groupSocial = Object.fromEntries(SOCIAL_PROFILES.map((profile) => [profile.id, profile])) as Record<string, (typeof SOCIAL_PROFILES)[number]>;
// Preserve the locally sourced Pinterest and Instagram links without labelling them as group-registry profiles.
export const SOCIAL = [
  { ...groupSocial.facebook, icon: "fb" },
  { ...groupSocial.x, icon: "x" },
  { ...groupSocial.linkedin, icon: "in" },
  { id: undefined, label: "Pinterest", href: "https://www.pinterest.com/kairalihealing/", icon: "pi" },
  { id: undefined, label: "Instagram", href: "https://www.instagram.com/kairali_the_healing_village/", icon: "ig" },
  { ...groupSocial.youtube, icon: "yt" },
];

// Confirmed dedicated sites (each resolved 200 on 29 Sep 2026; brand manual 2026 ch. 06).
const LEGACY_SUB_BRANDS = [
  { key: "ktahv", name: "Kairali – The Ayurvedic Healing Village", url: "https://ayurvedichealingvillage.com/", logo: "/brand/ktahv-logo.svg",
    line: "Doctor-led Ayurvedic care in Palakkad, Kerala.", page: "/ayurvedic-healing-village.aspx", cta: "Visit the Healing Village website" },
  { key: "raag", name: "Villa Raag", url: "https://www.villaraag.com/", logo: "/brand/villa-raag-logo.svg",
    line: "Kairali-owned and operated coastal sanctuary, Agonda, South Goa.", page: "/villa-raag.aspx", cta: "Visit villaraag.com" },
  { key: "products", name: "Kairali Ayurvedic Products", url: "https://www.kairaliproducts.com/", logo: "/brand/kairali-products-logo.svg",
    line: "Ayurvedic medicines, oils, teas and personal care.", page: "/ayurvedic-products.aspx", cta: "Shop at kairaliproducts.com" },
  { key: "centres", name: "Kairali Ayurvedic Centres", url: "https://kairalicenters.com/", logo: "/brand/kairali-icon.svg",
    line: "Ayurvedic treatment centres in India and abroad.", page: "/treatment-centres.aspx", cta: "Visit kairalicenters.com" },
] as const;
export const SUB_BRANDS = LEGACY_SUB_BRANDS.map((brand) => ({ ...brand, page: cleanRoute(brand.page) }));

export const DOCUMENT_PORTAL = "https://kairali-documents.vercel.app/";
export const WHYAYURVEDA = "https://whyayurveda.org/";
