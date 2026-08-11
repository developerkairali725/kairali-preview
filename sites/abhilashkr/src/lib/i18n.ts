import type { Metadata } from "next";

import { SITE_URL } from "@/lib/config";

export const LOCALES = ["en", "de", "fr"] as const;

export type Locale = (typeof LOCALES)[number];
export type LocalizedLocale = Exclude<Locale, "en">;

export const PAGE_KEYS = [
  "home",
  "about",
  "work",
  "investing",
  "writing",
  "media",
  "recognition",
  "speaking",
  "contact",
  "faq",
  "now",
  "privacy",
] as const;

export type PageKey = (typeof PAGE_KEYS)[number];

export const ROUTES: Record<Locale, Record<PageKey, string>> = {
  en: {
    home: "/",
    about: "/about",
    work: "/work",
    investing: "/investing",
    writing: "/writing",
    media: "/media",
    recognition: "/recognition",
    speaking: "/speaking",
    contact: "/contact",
    faq: "/faq",
    now: "/now",
    privacy: "/privacy",
  },
  de: {
    home: "/de",
    about: "/de/ueber-mich",
    work: "/de/arbeit",
    investing: "/de/investitionen",
    writing: "/de/texte",
    media: "/de/medien",
    recognition: "/de/auszeichnungen",
    speaking: "/de/vortraege",
    contact: "/de/kontakt",
    faq: "/de/fragen",
    now: "/de/aktuell",
    privacy: "/de/datenschutz",
  },
  fr: {
    home: "/fr",
    about: "/fr/a-propos",
    work: "/fr/travail",
    investing: "/fr/investissements",
    writing: "/fr/ecrits",
    media: "/fr/medias",
    recognition: "/fr/distinctions",
    speaking: "/fr/conferences",
    contact: "/fr/contact",
    faq: "/fr/questions",
    now: "/fr/maintenant",
    privacy: "/fr/confidentialite",
  },
};

export const NAV_KEYS: PageKey[] = [
  "about",
  "work",
  "investing",
  "writing",
  "media",
  "recognition",
  "speaking",
];

export const NAV_LABELS: Record<Locale, Partial<Record<PageKey, string>>> = {
  en: {
    home: "Home",
    about: "About",
    work: "Work",
    investing: "Investing",
    writing: "Writing",
    media: "Media",
    recognition: "Recognition",
    speaking: "Speaking",
    contact: "Contact",
    faq: "Questions",
    now: "Now",
    privacy: "Privacy",
  },
  de: {
    home: "Start",
    about: "Über mich",
    work: "Arbeit",
    investing: "Investitionen",
    writing: "Texte",
    media: "Medien",
    recognition: "Auszeichnungen",
    speaking: "Vorträge",
    contact: "Kontakt",
    faq: "Fragen",
    now: "Aktuell",
    privacy: "Datenschutz",
  },
  fr: {
    home: "Accueil",
    about: "À propos",
    work: "Travail",
    investing: "Investissements",
    writing: "Écrits",
    media: "Médias",
    recognition: "Distinctions",
    speaking: "Conférences",
    contact: "Contact",
    faq: "Questions",
    now: "Maintenant",
    privacy: "Confidentialité",
  },
};

const SEO: Record<LocalizedLocale, Record<PageKey, { title: string; description: string }>> = {
  de: {
    home: {
      title: "Abhilash K. Ramesh | Kairali Ayurvedic Group",
      description: "Abhilash Kalathil Ramesh: Executive Director der Kairali Ayurvedic Group, AYUSHEXCIL-Gründungsmitglied und Angel Investor.",
    },
    about: {
      title: "Über Abhilash Kalathil Ramesh",
      description: "Biografie, Ausbildung und beruflicher Hintergrund von Abhilash Kalathil Ramesh, Executive Director der Kairali Ayurvedic Group.",
    },
    work: {
      title: "Arbeit und Unternehmen | Abhilash K. Ramesh",
      description: "Ein Überblick über Kairali Ayurvedic Group, KAPPL, das KAC-Netzwerk und Villa Raag sowie Abhilash Rameshs operative Arbeit.",
    },
    investing: {
      title: "Investitionsansatz | Abhilash K. Ramesh",
      description: "Frühphasen-Investitionen in Biotechnologie, saubere Körperpflege, botanische Lieferketten und nachhaltige Gastlichkeit.",
    },
    writing: {
      title: "Texte und Essays | Abhilash K. Ramesh",
      description: "Ausgewählte Beiträge zu Ayurveda, Familienunternehmen, Wellnessreisen, internationaler Politik und operativer Technologie.",
    },
    media: {
      title: "Medien und Presse | Abhilash K. Ramesh",
      description: "Ein überprüfbares Verzeichnis von Interviews, Pressebeiträgen, Kolumnen, Podcasts und Videoauftritten.",
    },
    recognition: {
      title: "Auszeichnungen | Abhilash K. Ramesh",
      description: "Eine Übersicht der veröffentlichten Auszeichnungen und Anerkennungen für Führung, Unternehmertum und Gastlichkeit.",
    },
    speaking: {
      title: "Vorträge und Panels | Abhilash K. Ramesh",
      description: "Themen für Vorträge, Panels und Interviews zu Ayurveda, Exportpolitik, Familienunternehmen, Innovation und Gastlichkeit.",
    },
    contact: {
      title: "Kontakt | Abhilash K. Ramesh",
      description: "Kontakt für institutionelle Zusammenarbeit, Vorträge, Medienanfragen und ausgewählte Investitionsvorschläge.",
    },
    faq: {
      title: "Häufige Fragen | Abhilash K. Ramesh",
      description: "Antworten auf häufige Fragen zu Abhilash Ramesh, der Kairali Ayurvedic Group, AYUSHEXCIL und seinen Arbeitsfeldern.",
    },
    now: {
      title: "Aktuelle Schwerpunkte | Abhilash K. Ramesh",
      description: "Ein kompakter Überblick über die derzeitigen operativen, institutionellen und publizistischen Schwerpunkte.",
    },
    privacy: {
      title: "Datenschutzhinweis | Abhilash K. Ramesh",
      description: "Informationen zu Einwilligung, optionaler Analyse, kurzer Aufbewahrung und Kontaktanfragen auf abhilashkr.com.",
    },
  },
  fr: {
    home: {
      title: "Abhilash K. Ramesh | Kairali Ayurvedic Group",
      description: "Abhilash Kalathil Ramesh : directeur exécutif de Kairali Ayurvedic Group, membre fondateur d’AYUSHEXCIL et investisseur providentiel.",
    },
    about: {
      title: "À propos d’Abhilash Kalathil Ramesh",
      description: "Biographie, formation et parcours professionnel d’Abhilash Kalathil Ramesh, directeur exécutif de Kairali Ayurvedic Group.",
    },
    work: {
      title: "Travail et entreprises | Abhilash K. Ramesh",
      description: "Présentation de Kairali Ayurvedic Group, KAPPL, du réseau KAC, de Villa Raag et du rôle opérationnel d’Abhilash Ramesh.",
    },
    investing: {
      title: "Approche d’investissement | Abhilash K. Ramesh",
      description: "Investissements précoces en biotechnologie, soins personnels sobres, filières botaniques et hospitalité durable.",
    },
    writing: {
      title: "Écrits et essais | Abhilash K. Ramesh",
      description: "Textes choisis sur l’Ayurveda, l’entreprise familiale, le voyage de bien-être, les politiques publiques et la technologie.",
    },
    media: {
      title: "Médias et presse | Abhilash K. Ramesh",
      description: "Registre vérifiable d’entretiens, d’articles de presse, de chroniques, de podcasts et d’interventions vidéo.",
    },
    recognition: {
      title: "Distinctions | Abhilash K. Ramesh",
      description: "Liste des distinctions publiées pour le leadership, l’entrepreneuriat, le marketing et l’hospitalité de bien-être.",
    },
    speaking: {
      title: "Conférences et panels | Abhilash K. Ramesh",
      description: "Sujets d’intervention sur l’Ayurveda, les exportations, l’entreprise familiale, l’innovation et l’hospitalité.",
    },
    contact: {
      title: "Contact | Abhilash K. Ramesh",
      description: "Contact pour les collaborations institutionnelles, conférences, demandes médias et propositions d’investissement ciblées.",
    },
    faq: {
      title: "Questions fréquentes | Abhilash K. Ramesh",
      description: "Réponses aux questions courantes sur Abhilash Ramesh, Kairali Ayurvedic Group, AYUSHEXCIL et ses domaines de travail.",
    },
    now: {
      title: "Priorités actuelles | Abhilash K. Ramesh",
      description: "Un aperçu concis des priorités opérationnelles, institutionnelles et éditoriales actuellement suivies.",
    },
    privacy: {
      title: "Confidentialité | Abhilash K. Ramesh",
      description: "Informations sur le consentement, la mesure facultative, la conservation courte et les demandes de contact sur abhilashkr.com.",
    },
  },
};

export function isLocale(value: string): value is Locale {
  return LOCALES.includes(value as Locale);
}

export function isLocalizedLocale(value: string): value is LocalizedLocale {
  return value === "de" || value === "fr";
}

export function pageKeyForPath(pathname: string): PageKey {
  const normalized = pathname !== "/" ? pathname.replace(/\/$/, "") : pathname;

  for (const locale of LOCALES) {
    for (const key of PAGE_KEYS) {
      const route = ROUTES[locale][key];
      if (normalized === route || (key === "writing" && normalized.startsWith(`${route}/`))) {
        return key;
      }
    }
  }

  return "home";
}

export function hrefFor(locale: Locale, key: PageKey): string {
  return ROUTES[locale][key];
}

export function alternatesFor(key: PageKey) {
  return {
    canonical: `${SITE_URL}${ROUTES.en[key]}`,
    languages: {
      en: `${SITE_URL}${ROUTES.en[key]}`,
      de: `${SITE_URL}${ROUTES.de[key]}`,
      fr: `${SITE_URL}${ROUTES.fr[key]}`,
      "x-default": `${SITE_URL}${ROUTES.en[key]}`,
    },
    types: {
      "application/rss+xml": `${SITE_URL}/feed.xml`,
    },
  };
}

export function localizedMetadata(locale: LocalizedLocale, key: PageKey): Metadata {
  const seo = SEO[locale][key];
  const canonical = `${SITE_URL}${ROUTES[locale][key]}`;
  const ogLocale = locale === "de" ? "de_DE" : "fr_FR";
  const otherLocale = locale === "de" ? "fr_FR" : "de_DE";

  return {
    title: seo.title,
    description: seo.description,
    alternates: {
      canonical,
      languages: alternatesFor(key).languages,
      types: alternatesFor(key).types,
    },
    openGraph: {
      title: seo.title,
      description: seo.description,
      url: canonical,
      siteName: "Abhilash K. Ramesh",
      locale: ogLocale,
      alternateLocale: ["en_US", otherLocale],
      type: "website",
      images: [
        {
          url: `${SITE_URL}/api/og?title=${encodeURIComponent(seo.title)}&subtitle=${encodeURIComponent(seo.description)}&section=${locale.toUpperCase()}`,
          width: 1200,
          height: 630,
          alt: seo.title,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: seo.title,
      description: seo.description,
    },
  };
}

export function localizedKeyForSlug(locale: LocalizedLocale, slug: string): PageKey | null {
  const route = `/${locale}/${slug}`;
  return PAGE_KEYS.find((key) => ROUTES[locale][key] === route) ?? null;
}

export function localizedSlugs(locale: LocalizedLocale): string[] {
  return PAGE_KEYS.filter((key) => key !== "home").map((key) => ROUTES[locale][key].split("/").at(-1)!);
}
