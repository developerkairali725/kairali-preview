import type { LocalizedLocale, PageKey } from "@/lib/i18n";

export type LocalizedImage = {
  src: string;
  alt: string;
  objectPosition?: string;
};

export type LocalizedSection = {
  title: string;
  body: string;
  link?: { href: string; label: string };
  images?: LocalizedImage[];
};

export type LocalizedPageContent = {
  eyebrow: string;
  title: string;
  intro: string;
  heroImage?: LocalizedImage & { aspect: "portrait" | "square" };
  bannerImage?: LocalizedImage;
  sections: LocalizedSection[];
};

const de: Record<PageKey, LocalizedPageContent> = {
  home: {
    eyebrow: "Persönliches Unternehmensprofil",
    title: "Tradition bewahren. Systeme für die nächste Generation bauen.",
    intro: "Abhilash Kalathil Ramesh ist Executive Director der Kairali Ayurvedic Group, Gründungsmitglied des Vorstands von AYUSHEXCIL und Angel Investor.",
    heroImage: {
      src: "/images/abhilash-ramesh-event.jpg",
      alt: "Abhilash Kalathil Ramesh bei einer internationalen Veranstaltung der Gastgewerbebranche.",
      aspect: "portrait",
      objectPosition: "60% 30%",
    },
    bannerImage: {
      src: "/images/healing-village-property.jpg",
      alt: "Kairali – The Ayurvedic Healing Village, ein NABH-akkreditiertes ayurvedisches Krankenhaus in einer Gartenanlage in Palakkad, Kerala.",
      objectPosition: "center 40%",
    },
    sections: [
      { title: "Kairali Ayurvedic Group", body: "Operative Verantwortung über ayurvedische Versorgung, Herstellung, Zentren und Gastlichkeit – mit klarer Trennung der jeweiligen Unternehmens- und Leistungsbereiche.", link: { href: "/de/arbeit", label: "Arbeitsbereiche ansehen" } },
      { title: "Investitionen", body: "Interesse an frühen Unternehmen in Biotechnologie, botanischen Lieferketten, sauberer Körperpflege und nachhaltiger Gastlichkeit.", link: { href: "/de/investitionen", label: "Investitionsansatz" } },
      { title: "Texte und Medien", body: "Beiträge zu Ayurveda, Familienunternehmen, internationaler Zusammenarbeit, Wellnessreisen und operativer Technologie.", link: { href: "/de/texte", label: "Texte lesen" } },
      { title: "AI-Human Workspace", body: "Ein öffentliches, versioniertes Workspace-System, das Abhilash K. Ramesh für dauerhafte Zusammenarbeit zwischen Menschen, Codex und Claude entwickelt hat. Kontext, Freigaben, Aufgabenstatus, Nachweise, Aktualisierungen und Rollback bleiben ausdrücklich dokumentiert.", link: { href: "https://kairali-ai-method.vercel.app", label: "Öffentliche Website besuchen" } },
    ],
  },
  about: {
    eyebrow: "Biografie",
    title: "Über Abhilash Kalathil Ramesh",
    intro: "Ein persönliches Profil über Familiengeschichte, Ausbildung, Unternehmensführung und internationale Zusammenarbeit.",
    heroImage: {
      src: "/images/abhilash-portrait.png",
      alt: "Abhilash Kalathil Ramesh – Executive Director der Kairali Ayurvedic Group.",
      aspect: "square",
      objectPosition: "center 20%",
    },
    sections: [
      { title: "Familie und Ayurveda", body: "Abhilash gehört zur vierten Generation einer Kerala-Familie mit einer Ayurveda-Tradition seit 1908. Die heutige Kairali Ayurvedic Group wurde 1989 von K. V. Ramesh und Gita Ramesh gegründet." },
      { title: "Berufliche Rolle", body: "Als Executive Director arbeitet er an internationaler Entwicklung, institutionellen Beziehungen und operativen Systemen in den verschiedenen Unternehmen der Gruppe." },
      { title: "Ausbildung und Perspektive", body: "Seine Ausbildung umfasst Hospitality Management an der Florida International University. Das Profil verbindet Familienunternehmen, Gastlichkeit, Herstellung, Exportpolitik und Technologie." },
    ],
  },
  work: {
    eyebrow: "Operatives Verzeichnis",
    title: "Arbeit und Unternehmen",
    intro: "Die Einheiten der Gruppe werden hier nach ihrer tatsächlichen Funktion beschrieben – klinische Versorgung, Herstellung, Zentren und Gastlichkeit bleiben voneinander getrennt.",
    sections: [
      { title: "Kairali – The Ayurvedic Healing Village", body: "KTAHV in Palakkad ist ein NABH-akkreditiertes ayurvedisches Krankenhaus mit ärztlich geleiteten klinischen Programmen. Es ist kein Spa oder Resort.", link: { href: "https://www.kairali.com", label: "Offizielle Website" }, images: [{ src: "/images/healing-village-grounds.jpg", alt: "Kairali – The Ayurvedic Healing Village, ein NABH-akkreditiertes ayurvedisches Krankenhaus in Palakkad, Kerala.", objectPosition: "center 40%" }] },
      { title: "KAPPL", body: "Kairali Ayurvedic Products Private Limited ist der Herstellungsbereich für ayurvedische Produkte. Herstellung und klinische Versorgung werden nicht als dieselbe Leistung dargestellt.", images: [{ src: "/images/kappl-product-range.png", alt: "Ayurvedische pharmazeutische Produkte und Körperpflegeprodukte von Kairali mit WHO-GMP-Zertifizierung." }] },
      { title: "Kairali Ayurvedic Centre", body: "KAC bezeichnet das Netzwerk von Ayurveda-Zentren. Informationen zu einem Standort sollten immer auf der jeweiligen offiziellen Standortseite geprüft werden.", images: [{ src: "/images/kac-therapy.jpg", alt: "Ayurvedische Therapiesitzung bei einem Kairali Ayurvedic Centre." }, { src: "/images/kac-centre.jpg", alt: "Empfangsbereich eines Kairali Ayurvedic Centre." }] },
      { title: "Villa Raag", body: "Villa Raag in Agonda, Goa, ist ein eigenständiges Boutique-Angebot für Wellness und Gastlichkeit – kein medizinisches Krankenhausprogramm.", link: { href: "https://villaraag.com", label: "Villa Raag besuchen" }, images: [{ src: "/images/villa-raag-exterior.jpg", alt: "Terrasse und Pool der Boutique-Wellness-Unterkunft Villa Raag mit Blick auf den Agonda Beach." }, { src: "/images/villa-raag-1.webp", alt: "Erholsamer Aufenthaltsbereich am Strand in der Villa Raag." }, { src: "/images/villa-raag-2.webp", alt: "Speisebereich für Wellness-Gastronomie in der Villa Raag." }] },
    ],
  },
  investing: {
    eyebrow: "Angel Investing",
    title: "Investitionsansatz",
    intro: "Ein fokussierter Blick auf frühe Unternehmen, bei denen Fachwissen, Lieferketten und langfristige operative Substanz wichtiger sind als kurzfristige Trends.",
    sections: [
      { title: "Biotechnologie und Formulierungen", body: "Interesse an Unternehmen mit nachvollziehbarer Produktentwicklung, verantwortungsvoller Kommunikation und belastbarer regulatorischer Arbeit." },
      { title: "Botanische Lieferketten", body: "Geschäftsmodelle rund um Herkunft, Qualität, Verarbeitung und transparente Versorgung mit botanischen Rohstoffen." },
      { title: "Saubere Körperpflege", body: "Produkte und Marken, die Formulierung, Wirksamkeitsgrenzen und Kundennutzen klar und ohne überzogene Versprechen erklären." },
      { title: "Nachhaltige Gastlichkeit", body: "Infrastruktur und operative Modelle, die Ressourcen, lokale Einbindung und Gästeerlebnis langfristig zusammenbringen." },
    ],
  },
  writing: {
    eyebrow: "Veröffentlichungen",
    title: "Texte und Essays",
    intro: "Die derzeit veröffentlichten Langtexte sind auf Englisch verfügbar. Diese deutsche Seite bietet eine ehrliche Themenübersicht und verlinkt auf die Originale.",
    sections: [
      { title: "Ayurveda als klinisches Protokoll", body: "Warum Panchakarma in einem Krankenhaus als ärztlich geleitete klinische Versorgung beschrieben werden muss – nicht als Urlaubs- oder Spa-Paket.", link: { href: "/writing/panchakarma-clinical-protocol-not-a-holiday", label: "Original auf Englisch" } },
      { title: "Weitere englische Texte", body: "Weitere Langtexte werden hier erst nach ihrer redaktionellen Freigabe veröffentlicht und verlinkt. Entwürfe bleiben bewusst unsichtbar." },
      { title: "Übersetzungsstandard", body: "Klinische und gesundheitliche Inhalte werden nicht automatisch als vollständige Übersetzung veröffentlicht. Jede Fassung muss Bedeutung, Grenzen und Unternehmensregister erhalten." },
    ],
  },
  media: {
    eyebrow: "Presseverzeichnis",
    title: "Medien und Presse",
    intro: "Ein kuratiertes Verzeichnis veröffentlichter Interviews, Artikel, Podcasts und Videoauftritte. Titel und Herausgeber bleiben in ihrer Originalform erhalten.",
    sections: [
      { title: "Outlook Traveller", body: "Budget 2026: Key Takeaways for Travel, Tourism & Hospitality." },
      { title: "SV Business & Hospitality Magazine", body: "Expanding Ayurveda Globally." },
      { title: "DNA India", body: "Is Ayurveda Relevant Today?" },
      { title: "Failing It Up Podcast", body: "Gespräch über Wachstum und Systeme in Familienunternehmen." },
    ],
  },
  recognition: {
    eyebrow: "Veröffentlichte Anerkennungen",
    title: "Auszeichnungen",
    intro: "Eine kompakte Übersicht der auf der englischen Hauptseite veröffentlichten Auszeichnungen. Namen der Auszeichnungen werden nicht übersetzt oder erweitert.",
    sections: [
      { title: "Haute Grandeur Global Excellence Awards", body: "Best Marketing Director India (2026)." },
      { title: "PATWA International Travel Awards", body: "Excellence in Wellness Hospitality (India), 2026." },
      { title: "Enterprise Asia", body: "Asia Pacific Entrepreneurship Award (APEA), Most Promising (2016)." },
      { title: "AsiaOne", body: "40 Under 40 Most Influential (2017)." },
    ],
  },
  speaking: {
    eyebrow: "Vorträge und Interviews",
    title: "Vorträge und Panels",
    intro: "Für Konferenzen, Panels und Mediengespräche stehen Themen zur Verfügung, die auf tatsächlicher operativer und institutioneller Arbeit beruhen.",
    bannerImage: {
      src: "/images/abhilash-speaking.jpg",
      alt: "Abhilash Kalathil Ramesh bei einem Vortrag auf einer internationalen Branchenkonferenz.",
      objectPosition: "center 25%",
    },
    sections: [
      { title: "Ayurveda und internationale Märkte", body: "Verantwortungsvolle Positionierung traditioneller Medizin, Exportfragen und verständliche Kommunikation zwischen Märkten." },
      { title: "Familienunternehmen", body: "Nachfolge, Governance, operative Systeme und die Zusammenarbeit zwischen Generationen." },
      { title: "Technologie in Traditionsunternehmen", body: "Praktischer Einsatz von Automatisierung und KI, ohne Fachverantwortung oder menschliche Kontrolle zu ersetzen." },
      { title: "Anfragen", body: "Bitte senden Sie Thema, Zielgruppe, Format, Ort und Termin per E-Mail.", link: { href: "/de/kontakt", label: "Vortrag anfragen" } },
    ],
  },
  contact: {
    eyebrow: "Institutioneller Kontakt",
    title: "Kontakt",
    intro: "Für Unternehmenskooperationen, Vorträge, Medienanfragen und passende Investitionsvorschläge nutzen Sie bitte die zentrale Kontaktadresse.",
    sections: [
      { title: "E-Mail", body: "Bitte nennen Sie Ihr Anliegen, Ihre Organisation, den gewünschten Zeitrahmen und die beste Rückrufmöglichkeit. Der Link öffnet Ihr E-Mail-Programm; Sie müssen die Nachricht dort selbst senden. Die Website übermittelt oder speichert keine Nachricht.", link: { href: "mailto:info@kairali.com?subject=abhilashkr.com%20%E2%80%94%20Anfrage", label: "info@kairali.com schreiben" } },
      { title: "Telefon (IVR)", body: "Zentrale Telefonnummer der Kairali Ayurvedic Group in Indien.", link: { href: "tel:+919555156156", label: "+91-9555-156-156" } },
      { title: "LinkedIn", body: "Berufliches Profil von Abhilash Kalathil Ramesh.", link: { href: "https://www.linkedin.com/in/abhilashkramesh-ayurvedicmedicine-ayurvedicherbalproducts/", label: "Abhilash Ramesh auf LinkedIn" } },
      { title: "Kairali-Hauptsitz", body: "Neu-Delhi, Indien." },
      { title: "Hinweis", body: "Eine E-Mail-Anfrage ist keine medizinische Beratung und begründet keine Investitionszusage oder geschäftliche Verpflichtung." },
    ],
  },
  faq: {
    eyebrow: "Häufige Fragen",
    title: "Fragen und Antworten",
    intro: "Kurze, faktengebundene Antworten zu Abhilash Ramesh und den verschiedenen Kairali-Unternehmensbereichen.",
    sections: [
      { title: "Wer ist Abhilash Kalathil Ramesh?", body: "Er ist Executive Director der Kairali Ayurvedic Group, Gründungsmitglied des Vorstands von AYUSHEXCIL und Angel Investor." },
      { title: "Was ist die Kairali Ayurvedic Group?", body: "Eine familiengeführte Unternehmensgruppe mit getrennten Bereichen für ayurvedische Versorgung, Herstellung, Zentren und Gastlichkeit." },
      { title: "Was ist KTAHV?", body: "Kairali – The Ayurvedic Healing Village in Palakkad ist ein NABH-akkreditiertes ayurvedisches Krankenhaus mit ärztlich geleiteten Programmen. Es ist kein Spa oder Resort." },
      { title: "Was ist Villa Raag?", body: "Villa Raag in Agonda, Goa, ist ein Boutique-Angebot für Wellness und Gastlichkeit und wird nicht als Krankenhaus dargestellt." },
      { title: "Wie kann ich Kontakt aufnehmen?", body: "Institutionelle, Medien-, Vortrags- und Investitionsanfragen können an info@kairali.com gesendet werden.", link: { href: "/de/kontakt", label: "Kontaktseite" } },
    ],
  },
  now: {
    eyebrow: "Aktualisiert: August 2026",
    title: "Aktuelle Schwerpunkte",
    intro: "Diese Seite beschreibt gegenwärtige Arbeitsfelder und ist kein Versprechen über zukünftige Projekte oder Ergebnisse.",
    sections: [
      { title: "Operative Systeme", body: "Prozesse, Datenqualität und verantwortungsvolle Automatisierung innerhalb eines traditionsreichen Familienunternehmens weiterentwickeln." },
      { title: "Internationale Zusammenarbeit", body: "An verständlicher Positionierung, institutionellen Beziehungen und belastbaren Export- und Marktprozessen arbeiten." },
      { title: "Schreiben und Vermitteln", body: "Erfahrungen zu Ayurveda, Gastlichkeit, Familienunternehmen und Technologie in klarer, überprüfbarer Form veröffentlichen." },
    ],
  },
  privacy: {
    eyebrow: "Website-Hinweis",
    title: "Datenschutz",
    intro: "Diese Übersetzung beschreibt den derzeitigen technischen Zustand der Website und ersetzt keine individuell vereinbarte rechtliche Beratung.",
    sections: [
      { title: "Verantwortlicher", body: "Abhilash Kalathil Ramesh ist für die auf dieser Website beschriebene Verarbeitung personenbezogener Daten verantwortlich. Datenschutzfragen können an info@kairali.com gesendet werden." },
      { title: "Optionale Analyse", body: "Google Analytics bleibt ausgeschaltet, bis Sie „Analyse erlauben“ wählen. Bei Einwilligung werden Seitenaufrufe, Scrolls, ausgehende Klicks und Downloads gemessen. Google Signals, Werbepersonalisierung sowie detaillierte Standort- und Gerätedaten sind deaktiviert; Nutzer- und Ereignisdaten werden zwei Monate aufbewahrt. Über „Analyse-Einstellungen“ im Footer können Sie Ihre Auswahl jederzeit ändern oder widerrufen." },
      { title: "Kontakt", body: "Kontaktlinks öffnen das E-Mail-Programm des Besuchers. Die Website selbst übermittelt oder speichert dabei keine Formulardaten." },
      { title: "Fragen", body: "Fragen zu dieser Website können an info@kairali.com gesendet werden.", link: { href: "mailto:info@kairali.com?subject=abhilashkr.com%20%E2%80%94%20Datenschutz", label: "E-Mail senden" } },
    ],
  },
};

const fr: Record<PageKey, LocalizedPageContent> = {
  home: {
    eyebrow: "Profil personnel et professionnel",
    title: "Préserver un héritage. Construire des systèmes durables.",
    intro: "Abhilash Kalathil Ramesh est directeur exécutif de Kairali Ayurvedic Group, membre fondateur du conseil d’AYUSHEXCIL et investisseur providentiel.",
    heroImage: {
      src: "/images/abhilash-ramesh-event.jpg",
      alt: "Abhilash Kalathil Ramesh lors d’un événement international du secteur de l’hospitalité.",
      aspect: "portrait",
      objectPosition: "60% 30%",
    },
    bannerImage: {
      src: "/images/healing-village-property.jpg",
      alt: "Kairali – The Ayurvedic Healing Village, un hôpital ayurvédique accrédité NABH au milieu de jardins à Palakkad, au Kerala.",
      objectPosition: "center 40%",
    },
    sections: [
      { title: "Kairali Ayurvedic Group", body: "Responsabilités opérationnelles dans les soins ayurvédiques, la fabrication, les centres et l’hospitalité, avec une distinction claire entre chaque activité.", link: { href: "/fr/travail", label: "Voir les activités" } },
      { title: "Investissements", body: "Intérêt pour les jeunes entreprises en biotechnologie, filières botaniques, soins personnels sobres et hospitalité durable.", link: { href: "/fr/investissements", label: "Approche d’investissement" } },
      { title: "Écrits et médias", body: "Contributions sur l’Ayurveda, l’entreprise familiale, la coopération internationale, le voyage de bien-être et la technologie opérationnelle.", link: { href: "/fr/ecrits", label: "Lire les textes" } },
      { title: "AI-Human Workspace", body: "Un espace de travail public et versionné, créé par Abhilash K. Ramesh pour des collaborations durables entre humains, Codex et Claude. Le contexte, les validations, l’état des tâches, les preuves, les mises à jour et les procédures de retour arrière y restent explicites.", link: { href: "https://kairali-ai-method.vercel.app", label: "Visiter le site public" } },
    ],
  },
  about: {
    eyebrow: "Biographie",
    title: "À propos d’Abhilash Kalathil Ramesh",
    intro: "Un profil personnel consacré à l’histoire familiale, à la formation, à la direction d’entreprise et à la coopération internationale.",
    heroImage: {
      src: "/images/abhilash-portrait.png",
      alt: "Abhilash Kalathil Ramesh — directeur exécutif de Kairali Ayurvedic Group.",
      aspect: "square",
      objectPosition: "center 20%",
    },
    sections: [
      { title: "Famille et Ayurveda", body: "Abhilash appartient à la quatrième génération d’une famille du Kerala dont la tradition ayurvédique remonte à 1908. Kairali Ayurvedic Group a été fondé en 1989 par K. V. Ramesh et Gita Ramesh." },
      { title: "Rôle professionnel", body: "En tant que directeur exécutif, il travaille au développement international, aux relations institutionnelles et aux systèmes opérationnels des différentes entités du groupe." },
      { title: "Formation et perspective", body: "Sa formation comprend la gestion hôtelière à Florida International University. Son travail relie entreprise familiale, hospitalité, fabrication, exportation et technologie." },
    ],
  },
  work: {
    eyebrow: "Registre opérationnel",
    title: "Travail et entreprises",
    intro: "Les entités sont présentées selon leur fonction réelle : soins cliniques, fabrication, centres et hospitalité restent des activités distinctes.",
    sections: [
      { title: "Kairali – The Ayurvedic Healing Village", body: "KTAHV, à Palakkad, est un hôpital ayurvédique accrédité NABH proposant des programmes cliniques dirigés par des médecins. Ce n’est ni un spa ni un resort.", link: { href: "https://www.kairali.com", label: "Site officiel" }, images: [{ src: "/images/healing-village-grounds.jpg", alt: "Kairali – The Ayurvedic Healing Village, un hôpital ayurvédique accrédité NABH à Palakkad, au Kerala.", objectPosition: "center 40%" }] },
      { title: "KAPPL", body: "Kairali Ayurvedic Products Private Limited est l’activité de fabrication de produits ayurvédiques. La fabrication n’est pas présentée comme un service clinique.", images: [{ src: "/images/kappl-product-range.png", alt: "Produits pharmaceutiques ayurvédiques et soins personnels Kairali certifiés WHO-GMP." }] },
      { title: "Kairali Ayurvedic Centre", body: "KAC désigne le réseau de centres ayurvédiques. Les informations locales doivent toujours être vérifiées sur la page officielle du centre concerné.", images: [{ src: "/images/kac-therapy.jpg", alt: "Séance de thérapie ayurvédique dans un Kairali Ayurvedic Centre." }, { src: "/images/kac-centre.jpg", alt: "Accueil clinique d’un Kairali Ayurvedic Centre." }] },
      { title: "Villa Raag", body: "Villa Raag, à Agonda dans l’État de Goa, est une adresse indépendante d’hospitalité et de bien-être, et non un programme hospitalier.", link: { href: "https://villaraag.com", label: "Découvrir Villa Raag" }, images: [{ src: "/images/villa-raag-exterior.jpg", alt: "Terrasse et piscine de la propriété de bien-être Villa Raag avec vue sur la plage d’Agonda." }, { src: "/images/villa-raag-1.webp", alt: "Espace de séjour reposant en bord de plage à Villa Raag." }, { src: "/images/villa-raag-2.webp", alt: "Salle de restauration bien-être à Villa Raag." }] },
    ],
  },
  investing: {
    eyebrow: "Investissement providentiel",
    title: "Approche d’investissement",
    intro: "Une attention portée aux jeunes entreprises où l’expertise, les filières et la solidité opérationnelle comptent davantage que les tendances passagères.",
    sections: [
      { title: "Biotechnologie et formulations", body: "Intérêt pour des entreprises capables d’expliquer leur développement produit, leurs responsabilités et leur travail réglementaire." },
      { title: "Filières botaniques", body: "Modèles économiques fondés sur l’origine, la qualité, la transformation et la traçabilité des matières botaniques." },
      { title: "Soins personnels sobres", body: "Produits et marques qui présentent clairement leurs formulations, les limites de leurs allégations et leur utilité pour le client." },
      { title: "Hospitalité durable", body: "Infrastructures et opérations réunissant maîtrise des ressources, ancrage local et expérience des hôtes sur le long terme." },
    ],
  },
  writing: {
    eyebrow: "Publications",
    title: "Écrits et essais",
    intro: "Les essais longs actuellement publiés sont en anglais. Cette page française en présente honnêtement les thèmes et renvoie vers les originaux.",
    sections: [
      { title: "L’Ayurveda comme protocole clinique", body: "Pourquoi le Panchakarma doit être décrit, dans un hôpital, comme un parcours clinique dirigé par des médecins et non comme un séjour de spa.", link: { href: "/writing/panchakarma-clinical-protocol-not-a-holiday", label: "Original en anglais" } },
      { title: "Autres textes en anglais", body: "Les prochains essais ne seront publiés et liés ici qu’après validation éditoriale. Les brouillons restent volontairement invisibles." },
      { title: "Norme de traduction", body: "Les contenus cliniques et de santé ne sont pas publiés automatiquement en traduction intégrale. Chaque version doit préserver le sens, les limites et le registre de l’entité." },
    ],
  },
  media: {
    eyebrow: "Registre de presse",
    title: "Médias et presse",
    intro: "Une sélection d’entretiens, d’articles, de podcasts et de vidéos publiés. Les titres et les éditeurs restent dans leur forme originale.",
    sections: [
      { title: "Outlook Traveller", body: "Budget 2026: Key Takeaways for Travel, Tourism & Hospitality." },
      { title: "SV Business & Hospitality Magazine", body: "Expanding Ayurveda Globally." },
      { title: "DNA India", body: "Is Ayurveda Relevant Today?" },
      { title: "Failing It Up Podcast", body: "Conversation sur la croissance et les systèmes dans une entreprise familiale." },
    ],
  },
  recognition: {
    eyebrow: "Reconnaissances publiées",
    title: "Distinctions",
    intro: "Une vue concise des distinctions publiées sur le site principal en anglais. Les noms des prix ne sont ni traduits ni amplifiés.",
    sections: [
      { title: "Haute Grandeur Global Excellence Awards", body: "Best Marketing Director India (2026)." },
      { title: "PATWA International Travel Awards", body: "Excellence in Wellness Hospitality (India), 2026." },
      { title: "Enterprise Asia", body: "Asia Pacific Entrepreneurship Award (APEA), Most Promising (2016)." },
      { title: "AsiaOne", body: "40 Under 40 Most Influential (2017)." },
    ],
  },
  speaking: {
    eyebrow: "Conférences et entretiens",
    title: "Conférences et panels",
    intro: "Des sujets fondés sur un travail opérationnel et institutionnel réel, pour conférences, panels et entretiens médias.",
    bannerImage: {
      src: "/images/abhilash-speaking.jpg",
      alt: "Abhilash Kalathil Ramesh intervenant lors d’une conférence internationale du secteur.",
      objectPosition: "center 25%",
    },
    sections: [
      { title: "Ayurveda et marchés internationaux", body: "Positionnement responsable de la médecine traditionnelle, exportations et communication claire entre différents marchés." },
      { title: "Entreprise familiale", body: "Succession, gouvernance, systèmes opérationnels et collaboration entre générations." },
      { title: "Technologie et entreprises historiques", body: "Utilisation pratique de l’automatisation et de l’IA sans remplacer la responsabilité métier ni le contrôle humain." },
      { title: "Demandes", body: "Merci d’indiquer le sujet, le public, le format, le lieu et la date souhaitée.", link: { href: "/fr/contact", label: "Proposer une intervention" } },
    ],
  },
  contact: {
    eyebrow: "Contact institutionnel",
    title: "Contact",
    intro: "Pour les collaborations, conférences, demandes médias et propositions d’investissement pertinentes, utilisez l’adresse centrale ci-dessous.",
    sections: [
      { title: "Courriel", body: "Indiquez votre demande, votre organisation, le calendrier envisagé et le meilleur moyen de vous joindre. Le lien ouvre votre logiciel de messagerie ; vous devez ensuite envoyer vous-même le message. Le site ne transmet ni ne stocke aucun message.", link: { href: "mailto:info@kairali.com?subject=abhilashkr.com%20%E2%80%94%20Demande", label: "Écrire à info@kairali.com" } },
      { title: "Téléphone (serveur vocal)", body: "Numéro central de Kairali Ayurvedic Group en Inde.", link: { href: "tel:+919555156156", label: "+91-9555-156-156" } },
      { title: "LinkedIn", body: "Profil professionnel d’Abhilash Kalathil Ramesh.", link: { href: "https://www.linkedin.com/in/abhilashkramesh-ayurvedicmedicine-ayurvedicherbalproducts/", label: "Abhilash Ramesh sur LinkedIn" } },
      { title: "Siège de Kairali", body: "New Delhi, Inde." },
      { title: "Précision", body: "Un courriel ne constitue ni un avis médical, ni un engagement d’investissement, ni une obligation commerciale." },
    ],
  },
  faq: {
    eyebrow: "Questions fréquentes",
    title: "Questions et réponses",
    intro: "Des réponses brèves et factuelles sur Abhilash Ramesh et les différentes activités de Kairali.",
    sections: [
      { title: "Qui est Abhilash Kalathil Ramesh ?", body: "Il est directeur exécutif de Kairali Ayurvedic Group, membre fondateur du conseil d’AYUSHEXCIL et investisseur providentiel." },
      { title: "Qu’est-ce que Kairali Ayurvedic Group ?", body: "Un groupe familial réunissant des activités distinctes de soins ayurvédiques, fabrication, centres et hospitalité." },
      { title: "Qu’est-ce que KTAHV ?", body: "Kairali – The Ayurvedic Healing Village, à Palakkad, est un hôpital ayurvédique accrédité NABH avec des programmes dirigés par des médecins. Ce n’est ni un spa ni un resort." },
      { title: "Qu’est-ce que Villa Raag ?", body: "Villa Raag, à Agonda dans l’État de Goa, est une adresse d’hospitalité et de bien-être qui n’est pas présentée comme un hôpital." },
      { title: "Comment prendre contact ?", body: "Les demandes institutionnelles, médias, conférences et investissements peuvent être envoyées à info@kairali.com.", link: { href: "/fr/contact", label: "Page de contact" } },
    ],
  },
  now: {
    eyebrow: "Mise à jour : août 2026",
    title: "Priorités actuelles",
    intro: "Cette page décrit des axes de travail actuels, sans promettre de projets ni de résultats futurs.",
    sections: [
      { title: "Systèmes opérationnels", body: "Améliorer les processus, la qualité des données et l’automatisation responsable au sein d’une entreprise familiale historique." },
      { title: "Coopération internationale", body: "Travailler sur un positionnement compréhensible, les relations institutionnelles et des processus d’exportation et de marché solides." },
      { title: "Écriture et transmission", body: "Publier des expériences sur l’Ayurveda, l’hospitalité, l’entreprise familiale et la technologie sous une forme claire et vérifiable." },
    ],
  },
  privacy: {
    eyebrow: "Information sur le site",
    title: "Confidentialité",
    intro: "Cette traduction décrit l’état technique actuel du site et ne remplace pas un conseil juridique adapté à une situation particulière.",
    sections: [
      { title: "Responsable du traitement", body: "Abhilash Kalathil Ramesh est responsable du traitement des données personnelles décrit sur ce site. Les questions de confidentialité peuvent être envoyées à info@kairali.com." },
      { title: "Mesure d’audience facultative", body: "Google Analytics reste désactivé jusqu’à ce que vous choisissiez « Autoriser la mesure ». Après consentement, seuls les pages vues, défilements, clics sortants et téléchargements sont mesurés. Google Signals, la personnalisation publicitaire et les données détaillées de localisation et d’appareil sont désactivés ; les données utilisateur et événement sont conservées deux mois. Vous pouvez modifier ou retirer votre choix via « Préférences de mesure » dans le pied de page." },
      { title: "Contact", body: "Les liens de contact ouvrent le logiciel de messagerie du visiteur. Le site lui-même ne transmet ni ne stocke de données de formulaire." },
      { title: "Questions", body: "Les questions concernant ce site peuvent être envoyées à info@kairali.com.", link: { href: "mailto:info@kairali.com?subject=abhilashkr.com%20%E2%80%94%20Confidentialit%C3%A9", label: "Envoyer un courriel" } },
    ],
  },
};

export const LOCALIZED_CONTENT: Record<LocalizedLocale, Record<PageKey, LocalizedPageContent>> = { de, fr };
