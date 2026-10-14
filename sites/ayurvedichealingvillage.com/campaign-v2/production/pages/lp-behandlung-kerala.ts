// /lp/behandlung-in-kerala/ — languages/german-treatment-in-kerala.md, variant C (Editorial), German (de, "Sie"),
// buyer: a German-speaking reader exploring assessed residential Ayurveda in Palakkad. Copy reorganised from the
// reviewed German brief (independent linguistic + factual PASS) for sales clarity (kairali-akshar-marketing-science
// CREATE+REVIEW); wording reused wherever possible; facts only from the brief and data/doctors.ts.
// Owner correction, 14 Oct: present the complete current consented roster. No villa cards (links are English); stories = English films, labelled (decision 11).
// adMatch keywords = the fact audit's editorial topics (no German search-volume evidence exists).
// "Abhyanga" kept as the brief writes it (house lint prefers "Abhyangam" — warning only).
import { defineCopy } from "../copy.ts";
import { story } from "../stories.ts";

export default defineCopy({
  slug: "lp-behandlung-kerala",
  route: "/lp/behandlung-in-kerala/",
  // sha256 as recorded in review/CLEAN-COPY-LANGUAGES-REVIEW.json and LANGUAGE-COPY-FACT-AUDIT.json (not recomputed here).
  source: { file: "languages/german-treatment-in-kerala.md", sha256: "f5dd2f770275d51b03d07add3419036077a2aee6baa9c774c2d65ebf2108e210" },
  seo: {
    title: "Ayurveda-Behandlung in Kerala | Kairali, Palakkad",
    description: "Planen Sie Ihre Ayurveda-Behandlung bei Kairali in Palakkad: ärztliche Beratung, individuell verordnete Therapien und Unterkunft während Ihres Aufenthalts.",
  },
  adMatch: { keywords: ["ayurveda-behandlung in kerala", "ayurveda kerala", "panchakarma kerala"], adHeadlines: [] },
  hero: {
    overline: "Ärztlich begleitetes Ayurveda · Palakkad",
    h1: "Ayurveda-Behandlung in Kerala, individuell geplant",
    standfirst: "Besprechen Sie Ihre gesundheitlichen Anliegen mit einem Ayurveda-Arzt und erfahren Sie, welches Programm für Sie infrage kommt.",
  },
  cta: {
    primary: "Kostenlose ärztliche Erstberatung",
    primarySupport: "Ihre ärztliche Erstberatung ist kostenlos. Bitten Sie um ein Angebot, das die Behandlung und etwaige spätere Leistungen umfasst.",
    secondary: "Fragen Sie uns",
  },
  programDefault: "",
  doctors: ["deepu-john", "rahul-r", "akhila-oommen", "adhina-ub", "aashitha-ps"],
  page: {
    lead: {
      heading: "Sie müssen noch kein Programm ausgewählt haben",
      paragraphs: [
        "Vielleicht interessieren Sie sich zum ersten Mal für Ayurveda oder möchten ein bestimmtes gesundheitliches Anliegen besprechen. Beides ist ein guter Ausgangspunkt. Die ärztliche Beurteilung klärt, ob ein Programm geeignet ist und welche Behandlungen infrage kommen.",
        "Kairali – The Ayurvedic Healing Village ist ein NABH-akkreditiertes Ayurveda-Krankenhaus in Palakkad, Kerala. Ärztlich verordnete Behandlungen, abgestimmte Mahlzeiten und Zeit zum Ausruhen gehören zur Planung Ihres Aufenthalts.",
      ],
      points: [
        "Sie interessieren sich zum ersten Mal für Ayurveda",
        "Sie möchten ein bestimmtes gesundheitliches Anliegen besprechen",
        "Sie nehmen Medikamente oder sind in laufender Behandlung",
        "Sie möchten wissen, wie lange ein Aufenthalt dauern sollte",
        "Sie reisen mit einer Begleitperson",
      ],
    },
    offering: {
      kind: "cards",
      kicker: "Mögliche Behandlungen",
      heading: "Welche Behandlungen infrage kommen",
      intro: ["Die folgenden Behandlungen sind Themen für das Gespräch mit Ihrem Arzt. Welche davon für Sie geeignet sind, ergibt sich aus Ihrer individuellen Beurteilung."],
      cards: [
        { title: "Panchakarma", paragraphs: ["Panchakarma umfasst fünf klassische ayurvedische Verfahren. Ob und welche davon für Sie geeignet sind, entscheidet der Arzt nach der Untersuchung. Ein Aufenthalt beinhaltet nicht automatisch alle fünf Verfahren. Vorbereitung, Ernährung und Ruhe werden mit dem vorgeschlagenen Programm abgestimmt."] },
        { title: "Abhyanga und Shirodhara", paragraphs: ["Abhyanga ist eine Ganzkörperanwendung mit medizinischen Kräuterölen. Bei Shirodhara wird ein gleichmäßiger Ölstrahl über die Stirn geführt. Beide sind mögliche, ärztlich verordnete Behandlungen; sie gehören nicht automatisch zu jedem Programm."] },
        { title: "Anwendungen nach ärztlichem Plan", paragraphs: ["Geschulte Therapeuten führen die verordneten Anwendungen nach ärztlichem Plan durch. Fragen Sie, was die einzelnen Behandlungen beinhalten und wie der Verlauf überprüft wird."] },
      ],
    },
    pathway: {
      heading: "Vom ersten Gespräch bis zu Ihrem Aufenthalt",
      steps: [
        { title: "Kostenlose ärztliche Erstberatung", body: "Informieren Sie den Arzt über Ihre Krankengeschichte, aktuelle Medikamente und bisherige Behandlungen. Erläutern Sie Ihre Ziele und wie viel Zeit Sie für einen Aufenthalt einplanen können." },
        { title: "Programm, Dauer und Angebot klären", body: "Lassen Sie sich die vorgeschlagenen Therapien, die empfohlene Dauer und eine mögliche Vorbereitung erklären. Stimmen Sie danach Unterkunft und Reisedaten mit dem Team ab und prüfen Sie das Angebot, bevor Sie Ihre Reise buchen." },
        { title: "Ihr Aufenthalt in Palakkad", body: "Verordnete Behandlungen, Mahlzeiten und Ruhezeiten bestimmen Ihren Tagesablauf. Die Ärzte überprüfen den Verlauf während Ihres Aufenthalts." },
      ],
    },
    rest: {
      heading: "Zeit zum Ausruhen zwischen den Terminen",
      paragraphs: ["Die Villen und Gärten bieten Raum für Ruhe zwischen den Terminen. Vegetarische Mahlzeiten werden auf das verordnete Programm abgestimmt. Besprechen Sie, welche Yoga- oder Meditationseinheiten zu Ihrem individuellen Plan passen."],
    },
    place: {
      heading: "Wohnen und Alltag während Ihres Aufenthalts",
      paragraphs: [
        "Teilen Sie dem Patientenservice frühzeitig mit, ob Sie besondere Ernährungsbedürfnisse, Einschränkungen der Beweglichkeit oder Unterstützung im Alltag berücksichtigen müssen.",
        "Wenn Sie mit einer Begleitperson reisen, lassen Sie sich Unterkunft, Belegung und Verfügbarkeit für Ihre Termine bestätigen. Der Patientenservice nennt Ihnen die verfügbaren Unterkünfte sowie die jeweiligen Bedingungen und Kosten.",
      ],
    },
    // Owner decision 11 (14 Oct 2026, AHV-WB.519): the existing consented English films, shown as English-language films
    // (no German-subtitled film exists yet; subtitle request to the video owner is tracked separately). Same three films as
    // the English sibling /lp/treatment-in-kerala/; YouTube links only (the on-page player stays English-route only).
    stories: {
      heading: "Das Dorf und Erfahrungen von Patienten im Video",
      body: "Diese Videos sind auf Englisch. Sehen Sie einen Tag im Dorf, einen Film über Panchakarma und Michaela & Jan, die von ihrem Aufenthalt erzählen. Individuelle Erfahrungen sind unterschiedlich.",
      films: [
        story("iPARaMRASUs", "Ein Tag im Dorf (Video auf Englisch)"),
        story("4x01PtWfNnk", "Michaela & Jan berichten (Video auf Englisch)"),
        story("07tVC2oXd8g", "Film über Panchakarma (Video auf Englisch)"),
      ],
    },
    stay: {
      heading: "Vor der Buchung wissen, was enthalten ist",
      paragraphs: ["Besprechen Sie zunächst die empfohlene Aufenthaltsdauer und eine mögliche Vorbereitung. Bitten Sie dann um ein individuelles Kostenangebot für Ihr Programm, die Dauer, die gewählte Villa und die Belegung."],
      lists: [
        { heading: "Klären Sie, was enthalten ist", items: ["Unterkunft in der gewählten Villa und Belegung", "Mahlzeiten", "Ärztliche Besprechungen", "Verordnete Therapien und Aktivitäten"] },
        { heading: "Fragen Sie nach zusätzlich berechneten Leistungen", items: ["Medikamente", "Untersuchungen", "Weitere Anwendungen", "Transfers", "Persönliche Dienstleistungen"], extra: true },
      ],
      after: ["Welche Leistungen zusätzlich berechnet werden, hängt von der Vereinbarung ab."],
    },
    doctors: {
      heading: "Ihre Ayurveda-Ärzte",
      intro: "Unsere Ayurveda-Ärzte beurteilen Ihre Bedürfnisse, planen die verordneten Behandlungen und überprüfen den Verlauf während Ihres Aufenthalts. Fragen Sie bei Ihrer Anfrage nach der Verfügbarkeit eines Arztes.",
    },
    faqHeading: "Häufig gestellte Fragen",
    closing: {
      heading: "Besprechen Sie Ihren nächsten Schritt",
      paragraphs: ["Teilen Sie uns mit, was Sie zu Ayurveda führt und wann Sie reisen könnten. Beginnen Sie mit einer kostenlosen ärztlichen Erstberatung und klären Sie das vorgeschlagene Programm, bevor Sie buchen."],
    },
  },
  faq: [
    { q: "Muss ich bereits wissen, welches Programm ich möchte?", a: "Nein. Beschreiben Sie Ihre Anliegen, Krankengeschichte und Ziele. Der Arzt bespricht mit Ihnen, welche Möglichkeiten geeignet sein können. Der Patientenservice hilft Ihnen bei der Organisation der Beratung und des Aufenthalts." },
    { q: "Wie lange sollte ich bleiben?", a: "Die Dauer hängt vom Programm und Ihrer individuellen Beurteilung ab. Nennen Sie Ihre verfügbaren Termine und lassen Sie sich die empfohlene Dauer sowie einen etwaigen Mindestaufenthalt bestätigen, bevor Sie Ihre Reise buchen." },
    { q: "Sind alle Panchakarma-Verfahren im Aufenthalt enthalten?", a: "Nicht automatisch. Ihr Arzt entscheidet, welche Verfahren geeignet sind, und erläutert Vorbereitung, Ablauf und Verfügbarkeit. Die Auswahl richtet sich nach Ihrer individuellen Beurteilung. Lassen Sie sich vor Ihrer Entscheidung erklären, was die vorgeschlagenen Verfahren beinhalten." },
    { q: "Kann ich trotz einer bestehenden Erkrankung eine Anfrage stellen?", a: "Ja. Legen Sie relevante Befunde vor und informieren Sie den Arzt über Medikamente und laufende Behandlungen. So kann er beurteilen, ob ein Programm geeignet ist. Eine Beratung oder ein Aufenthalt ist keine Zusage eines bestimmten Behandlungsergebnisses." },
    { q: "Kann eine Begleitperson mitkommen?", a: "Besprechen Sie die gewünschte Belegung und einen möglichen Unterstützungsbedarf vor der Buchung. Der Patientenservice bestätigt die verfügbaren Unterkünfte und die jeweiligen Bedingungen und Kosten für Ihre Reisedaten." },
    { q: "Was ist bei der kostenlosen Erstberatung und dem Angebot zu beachten?", a: "Die erste ärztliche Beratung ist kostenlos. Bitten Sie um ein Angebot, das die vorgesehene Betreuung und etwaige spätere Leistungen umfasst. Prüfen Sie, was enthalten ist und welche zusätzlichen Kosten anfallen können." },
  ],
});
