// The interface words of the live ad routes, per page language. English is exactly what the four accepted pages
// already render (these strings were moved here, not rewritten). German and Russian are the interface of the German
// and Russian campaign routes, so no English chrome is left on them; their translations are flagged for native review
// in the release notes. Facts (names, numbers, the NABH number, award names) are never translated here.
//
// Plain data only (client components receive slices of it). Erasable TypeScript only.

import type { PageLocale } from "../kit/types.ts";

export type FormUi = {
  formAria: string; stepOf: string; back: string; next: string; sending: string; terms: string; note: string;
  honeypot: string; errors: Record<string, string>; contactWa: string;
};
export type GalleryUi = {
  title: string; count: string; filter: string; all: string; close: string; closeViewer: string; prev: string; next: string;
  photoOf: string; open: string; cta: string; categories: Record<string, string>;
};

export type ProductionUi = {
  /** BCP 47 page language, for <html lang> and JSON-LD inLanguage. */
  lang: string;
  ogLocale: string;
  header: { contact: string; whatsapp: string; call: string; callAria: string };
  hero: { accredited: string; card: string; cardSub: string };
  proof: { aria: string; reviews: string; asOf: string; hospital: string; tradition: string; doctors: string; team: string };
  kicker: { lead: string; cards: string; row: string; index: string; pathway: string; village: string; stories: string; stay: string; doctors: string; faq: string; enquiry: string };
  village: { all: string; more: string };
  doctors: { speaks: (langs: string[]) => string; focus: string };
  enquiry: { contactIntro: string; wa: string; call: string };
  footer: { brand: string; visit: string; speak: string; accreditation: string; disclaimer: string; group: string; privacy: string; terms: string; cookiePolicy: string; cookiePrefs: string; main: string; mainHref: string };
  form: FormUi;
  gallery: GalleryUi;
  /** Image alt text by registry id, where the page language is not English. */
  alt: Record<string, string>;
  /** Doctor card facts in the page language, by registry id (role line, tenure line, focus, languages). */
  doctorFacts: Record<string, { role?: string; tenure?: string; focus?: string; languages?: string[] }>;
};

const list = (l: string[], and: string) => (l.length < 2 ? l.join("") : `${l.slice(0, -1).join(", ")} ${and} ${l[l.length - 1]}`);

const EN: ProductionUi = {
  lang: "en", ogLocale: "en_IN",
  header: { contact: "Contact", whatsapp: "WhatsApp", call: "Call", callAria: "Call" },
  hero: { accredited: "accredited", card: "Free doctor consultation", cardSub: "" },
  proof: { aria: "Accreditation, reviews and awards", reviews: "Tripadvisor reviews", asOf: "Tripadvisor, as of", hospital: "Accredited Ayurvedic hospital", tradition: "Ayurvedic family tradition since 1908", doctors: "Qualified Ayurvedic doctors", team: "and team" },
  kicker: { lead: "Where to begin", cards: "Programmes", row: "In brief", index: "Care for each person", pathway: "How it works", village: "The village", stories: "In their words", stay: "Your quotation", doctors: "Your doctors", faq: "Before you decide", enquiry: "Free doctor consultation" },
  village: { all: "View all photos", more: "more" },
  doctors: { speaks: (l) => `Speaks ${list(l, "and")}`, focus: "Focus" },
  enquiry: { contactIntro: "Prefer to talk?", wa: "WhatsApp", call: "Call" },
  footer: {
    brand: "A NABH-accredited Ayurvedic hospital of the Kairali Ayurvedic Group, in Palakkad, Kerala.", visit: "Visit", speak: "Speak to us", accreditation: "Accreditation",
    disclaimer: "Ayurvedic programs at Kairali are supervised by qualified doctors and complement, not replace, the medical care you already receive. Individual experiences vary.",
    group: "Kairali Ayurvedic Group", privacy: "Privacy", terms: "Terms", cookiePolicy: "Cookie policy", cookiePrefs: "Cookie preferences", main: "Main website", mainHref: "/",
  },
  form: {
    formAria: "Free doctor consultation enquiry", stepOf: "Step {i} of {n}", back: "Back", next: "Continue", sending: "Sending…", terms: "Terms",
    note: "No medical details needed. Your doctor asks for those privately at consultation.", honeypot: "Leave this empty", errors: {}, contactWa: "WhatsApp",
  },
  gallery: {
    title: "Gallery", count: "The village · {n} photos", filter: "Filter photos", all: "All", close: "Close gallery", closeViewer: "Close photo viewer", prev: "Previous photo", next: "Next photo",
    photoOf: "Photo {i} of {n}", open: "Open photo:", cta: "Get free doctor consultation", categories: {},
  },
  alt: {},
  doctorFacts: {},
};

const DE: ProductionUi = {
  lang: "de", ogLocale: "de_DE",
  header: { contact: "Kontakt", whatsapp: "WhatsApp", call: "Anrufen", callAria: "Anrufen:" },
  hero: { accredited: "akkreditiert", card: "Kostenlose ärztliche Erstberatung", cardSub: "" },
  proof: { aria: "Akkreditierung, Bewertungen und Auszeichnungen", reviews: "Tripadvisor-Bewertungen", asOf: "Tripadvisor, Stand", hospital: "Akkreditiertes Ayurveda-Krankenhaus", tradition: "Ayurvedische Familientradition seit 1908", doctors: "Qualifizierte Ayurveda-Ärzte", team: "und Team" },
  kicker: { lead: "Der erste Schritt", cards: "Programme", row: "Im Überblick", index: "Für jeden Einzelnen", pathway: "So funktioniert es", village: "Das Dorf", stories: "Erfahrungen", stay: "Ihr Angebot", doctors: "Ihr Arzt", faq: "Vor Ihrer Entscheidung", enquiry: "Kostenlose ärztliche Erstberatung" },
  village: { all: "Alle Fotos ansehen", more: "weitere" },
  doctors: { speaks: (l) => `Spricht ${list(l, "und")}`, focus: "Schwerpunkte" },
  enquiry: { contactIntro: "Lieber direkt sprechen?", wa: "WhatsApp", call: "Anrufen" },
  footer: {
    brand: "Ein NABH-akkreditiertes Ayurveda-Krankenhaus der Kairali Ayurvedic Group in Palakkad, Kerala.", visit: "Adresse", speak: "Kontakt", accreditation: "Akkreditierung",
    disclaimer: "Ayurvedische Programme bei Kairali werden von qualifizierten Ärzten betreut und ergänzen Ihre bestehende medizinische Versorgung, ohne sie zu ersetzen. Individuelle Erfahrungen können variieren.",
    group: "Kairali Ayurvedic Group", privacy: "Datenschutz (EN)", terms: "AGB (EN)", cookiePolicy: "Cookie-Richtlinie (EN)", cookiePrefs: "Cookie-Einstellungen", main: "Hauptwebsite", mainHref: "/de/",
  },
  form: {
    formAria: "Anfrage für eine kostenlose ärztliche Erstberatung", stepOf: "Schritt {i} von {n}", back: "Zurück", next: "Weiter", sending: "Wird gesendet…", terms: "AGB (EN)",
    note: "Medizinische Angaben sind hier nicht nötig. Ihr Arzt fragt diese vertraulich in der Beratung ab.", honeypot: "Bitte leer lassen",
    errors: {
      name: "Bitte geben Sie Ihren Namen ein.", email: "Bitte geben Sie eine E-Mail-Adresse wie name@beispiel.de ein.",
      phone: "Bitte geben Sie Ihre Telefonnummer mit Ländervorwahl ein, z. B. +49 30 123456.", consent: "Bitte setzen Sie das Häkchen, damit wir Ihnen antworten können.",
      too_long: "Bitte kürzen Sie Ihre Eingabe.", required: "Bitte füllen Sie dieses Feld aus.",
    },
    contactWa: "WhatsApp",
  },
  gallery: {
    title: "Galerie", count: "Das Dorf · {n} Fotos", filter: "Fotos filtern", all: "Alle", close: "Galerie schließen", closeViewer: "Fotoansicht schließen", prev: "Vorheriges Foto", next: "Nächstes Foto",
    photoOf: "Foto {i} von {n}", open: "Foto öffnen:", cta: "Kostenlose ärztliche Erstberatung",
    categories: { Villas: "Villen", Therapies: "Behandlungen", Grounds: "Gelände", Dining: "Speisesaal", Yoga: "Yoga" },
  },
  alt: {
    "ahv-img-011": "Weiße Holzbrücke mit Gittergeländer zu einem Gebäude auf Stelzen zwischen tropischen Bäumen",
    "ahv-img-017": "Traditionelle hölzerne Behandlungsliege und Messing-Ölgefäß im Behandlungsraum in Palakkad",
    "ahv-img-033": "Sprechzimmer mit Untersuchungsliege und unverputzten Backsteinwänden bei Kairali in Palakkad",
    "ahv-yoga-hall-consented-20261014": "Zwei Personen praktizieren Yoga in einer geräumigen Halle mit offenem Holzdach bei Kairali in Palakkad",
    "ahv-deluxe-bathroom": "Badezimmer der Deluxe-Villa mit Glasdusche und Waschbecken",

    "kt-199": "Zwei Therapeutinnen bei einer Abhyanga-Ganzkörpermassage mit warmem medizinischem Öl",
    "kt-190": "Eine Therapeutin bereitet eine Patientin auf eine Kopfbehandlung mit warmem Öl vor",
    "kt-202": "Medizinisches Öl fließt aus einem Messinggefäß zur Vorbereitung von Shirodhara",
    "kt-116": "Achteckiger Villa-Innenraum unter einer Terrakotta-Kuppel im Healing Village",
    "kt-314": "Backstein-Cottage zwischen Palmen und Gärten im Healing Village",
    "wx-hero": "Morgennebel über den Cottages und Gartenwegen des Healing Village",
    "wx-dining": "Der Speisesaal mit Gartenblick, in dem die verordneten Mahlzeiten serviert werden",
    "gal-poolside-rest-palakkad-2026": "Eine Patientin ruht auf einer Liege am Pool in den Gärten des Dorfes",
  },
  doctorFacts: {
    "deepu-john": { role: "Chefarzt und Abteilungsleiter", tenure: "Praktiziert Ayurveda seit 2010 · Bei Kairali seit 2019", focus: "Panchakarma und Beratung zu Lebensgewohnheiten", languages: ["Malayalam", "Englisch", "Hindi", "Tamil"] },
  },
};

const RU: ProductionUi = {
  lang: "ru", ogLocale: "ru_RU",
  header: { contact: "Контакты", whatsapp: "WhatsApp", call: "Позвонить", callAria: "Позвонить:" },
  hero: { accredited: "аккредитация", card: "Бесплатная консультация врача", cardSub: "" },
  proof: { aria: "Аккредитация, отзывы и награды", reviews: "отзывов на Tripadvisor", asOf: "Tripadvisor, по состоянию на", hospital: "Аккредитованная аюрведическая больница", tradition: "Семейная традиция аюрведы с 1908 года", doctors: "Квалифицированные аюрведические врачи", team: "и команда" },
  kicker: { lead: "С чего начать", cards: "Программы", row: "Коротко", index: "Для каждого", pathway: "Как это работает", village: "Деревня", stories: "Отзывы", stay: "Ваше предложение", doctors: "Ваш врач", faq: "Прежде чем решить", enquiry: "Бесплатная консультация врача" },
  village: { all: "Все фотографии", more: "ещё" },
  doctors: { speaks: (l) => `Говорит на ${list(l, "и")} языках`, focus: "Направления" },
  enquiry: { contactIntro: "Удобнее поговорить?", wa: "WhatsApp", call: "Позвонить" },
  footer: {
    brand: "Аюрведическая больница с аккредитацией NABH в составе Kairali Ayurvedic Group, Палаккад, Керала.", visit: "Адрес", speak: "Связаться с нами", accreditation: "Аккредитация",
    disclaimer: "Аюрведические программы в Kairali проходят под наблюдением квалифицированных врачей и дополняют, а не заменяют медицинскую помощь, которую вы уже получаете. Индивидуальный опыт может отличаться.",
    group: "Kairali Ayurvedic Group", privacy: "Конфиденциальность (EN)", terms: "Условия (EN)", cookiePolicy: "Политика cookie (EN)", cookiePrefs: "Настройки cookie", main: "Основной сайт", mainHref: "/ru/",
  },
  form: {
    formAria: "Запрос бесплатной консультации врача", stepOf: "Шаг {i} из {n}", back: "Назад", next: "Далее", sending: "Отправка…", terms: "Условия (EN)",
    note: "Медицинские сведения здесь не нужны. Врач спросит о них конфиденциально во время консультации.", honeypot: "Оставьте пустым",
    errors: {
      name: "Пожалуйста, укажите ваше имя.", email: "Пожалуйста, укажите адрес эл. почты, например name@example.com.",
      phone: "Пожалуйста, укажите номер телефона с кодом страны, например +7 900 000 00 00.", consent: "Пожалуйста, отметьте согласие, чтобы мы могли вам ответить.",
      too_long: "Пожалуйста, сократите текст.", required: "Пожалуйста, заполните это поле.",
    },
    contactWa: "WhatsApp",
  },
  gallery: {
    title: "Галерея", count: "Деревня · фото: {n}", filter: "Фильтр фотографий", all: "Все", close: "Закрыть галерею", closeViewer: "Закрыть просмотр", prev: "Предыдущее фото", next: "Следующее фото",
    photoOf: "Фото {i} из {n}", open: "Открыть фото:", cta: "Бесплатная консультация врача",
    categories: { Villas: "Виллы", Therapies: "Процедуры", Grounds: "Территория", Dining: "Столовая", Yoga: "Йога" },
  },
  alt: {
    "ahv-img-011": "Белый деревянный мост с решетчатыми перилами к зданию на сваях среди тропических деревьев",
    "ahv-img-017": "Традиционный деревянный лечебный стол и латунный сосуд для масла в процедурной в Палаккаде",
    "ahv-img-033": "Кабинет консультаций со смотровой кушеткой и открытыми кирпичными стенами в Kairali в Палаккаде",
    "ahv-yoga-hall-consented-20261014": "Два человека занимаются йогой в просторном зале с открытыми деревянными стропилами в Kairali в Палаккаде",
    "ahv-deluxe-bathroom": "Ванная комната виллы Deluxe со стеклянной душевой кабиной и раковиной",

    "kt-199": "Два терапевта проводят абхьянгу — массаж всего тела тёплым лечебным маслом",
    "kt-190": "Терапевт готовит пациентку к процедуре для головы с тёплым маслом",
    "kt-202": "Лечебное масло льётся из латунного сосуда при подготовке к широдхаре",
    "kt-116": "Восьмиугольная вилла под терракотовым куполом в Healing Village",
    "kt-314": "Кирпичный коттедж среди пальм и садов в Healing Village",
    "wx-hero": "Утренний туман над коттеджами и садовыми дорожками Healing Village",
    "wx-dining": "Столовая с видом на сад, где подают назначенное врачом питание",
    "gal-poolside-rest-palakkad-2026": "Пациентка отдыхает на шезлонге у бассейна в садах деревни",
  },
  doctorFacts: {
    "deepu-john": { role: "Главный врач и заведующий отделением", tenure: "Практикует аюрведу с 2010 года · В Kairali с 2019 года", focus: "Панчакарма и рекомендации по образу жизни", languages: ["малаялам", "английском", "хинди", "тамильском"] },
  },
};

export const UI: Record<PageLocale, ProductionUi> = { en: EN, de: DE, ru: RU };
export const uiFor = (locale: string | undefined): ProductionUi => (locale === "de" || locale === "ru" ? UI[locale] : EN);
/** The words a shared kit section uses: the page language on the production surface, else the kit's English. */
export const pageUi = (req: { surface?: string; locale: string }): ProductionUi => uiFor(req.surface === "production" ? req.locale : "en");
export const fmt =(s: string, v: Record<string, string | number>) => s.replace(/\{(\w+)\}/g, (_, k) => String(v[k] ?? ""));
