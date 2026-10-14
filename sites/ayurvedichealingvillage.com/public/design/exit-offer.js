/* AHV — exit-intent "Get 10% OFF on all Treatment Packages" offer with a real enquiry form.
 *
 * Owner decision, 14 Oct 2026 (direct chat, structured question): the "10% offer popup" was chosen over the
 * no-discount help popup and over keeping exit popups off. This replaces the design-preview-only mock in the home
 * views (which stays a preview and never opens by itself, so the two can never stack) with one sitewide dialog.
 *
 *   - Copy: the approved English, German and French strings of the existing home-view popup (owner popup handoff,
 *     29 Aug 2026); the other locales use the existing l10n translations of those same English strings. No offer
 *     terms, validity dates or exclusions are shown: the approved offer has no footnote (LOCKED_FACTS 29 Aug 2026).
 *   - Trigger: the site's existing designed exit equivalent (GuestSupport.tsx) — after 30 s on the page and at least
 *     one viewport of scrolling, a fine pointer leaving through the top of the viewport (desktop) or, on a coarse
 *     pointer, a deliberate scroll back towards the top of more than one viewport (mobile). Never the Back button.
 *   - Frequency: at most once per browser session; none for 30 days after a dismissal or a submission.
 *   - Shown on the site tree and, by the owner's 14/15 Oct 2026 answer "Show on paid pages too" (superseding
 *     DEC-PAID-NAV for this popup only), on the paid campaign pages (/lp/…, the .html landers, Air India) through
 *     campaign-v2/production/Document.tsx. Never on confirmation/thank-you, legal or lead-form pages, never on the
 *     /offers/ category-discount pages (the 10% must not stack), never while the cookie notice, the chat or another
 *     dialog is open, and never while the visitor is typing into a form.
 *   - Form: name, country code + phone, email and the site's existing required consent wording, posted to the existing
 *     /api/lead/ pipeline as form "exit-intent" with the same body shape, validation, transport, guide download and
 *     messages as the contact form. The accepted response is observed by lead-receipt.js exactly as for the other
 *     forms: the same consented lead event (exit-intent is on consent-runtime.ts's enquiry allowlist by explicit owner
 *     approval for HARD GATE 11, 14/15 Oct 2026) and the same-locale /thanks/ page. No tracking tag, consent setting
 *     or delivery path is added. Offer terms: none — the owner ruled "No terms, honour as shown".
 * Built with createElement/textContent only (no HTML parsing). Exposed as a CommonJS module for tests. */
(function () {
  'use strict';

  var LOCALES = ['en', 'hi', 'de', 'fr', 'es', 'it', 'pt', 'nl', 'ru', 'ar', 'zh', 'ja', 'ko'];
  var OFFER_SUBJECT = 'Get 10% OFF on all Treatment Packages';
  var STORE_KEY = 'ktahv-exit-offer';
  var SESSION_KEY = 'ktahv-exit-offer-shown';
  var SUPPRESS_DAYS = 30;
  var DAY_MS = 24 * 60 * 60 * 1000;
  var MIN_ENGAGED_MS = 30000;
  var SUBMIT_TIMEOUT_MS = 45000;
  var PRIVACY_PATH = '/new-privacy-policy/';
  var IMAGE = '/ahv/assets/img/ho-welcome-49.webp';

  // English base paths, by reason. Locale copies match after their /xx/ prefix is removed, plus LOCALIZED_EXCLUDED
  // for the locale slugs that differ from English. Kept in step with the route sources by test/exit-offer.test.mjs.
  var EXCLUDED = {
    confirmation: ['/book-now/', '/cart/', '/checkout/', '/contact-us/thank-you/', '/emailsubscriber/',
      '/onlinebookingthankyou/', '/onlineconsultation-thanks/', '/ppc-thanks/', '/thanks-old/', '/thanks/'],
    legal: ['/cancellation-and-refund-policy/', '/cookie-policy/', '/disclaimer/', '/legal-notice/',
      '/lp/cookie-policy/', '/new-privacy-policy/', '/payment-policy-compliance/', '/privacy-policy/',
      '/privacy-statement/', '/privacy/', '/terms-and-conditions/', '/terms/'],
    form: ['/apply-now/', '/contact-us-old/', '/contact-us/', '/enquiry-form-old/', '/enquiry-form/',
      '/jobs/business-development-manager/', '/online-consultation-old/', '/online-consultation/',
      '/postulez-maintenant/', '/walk-in-ayurveda-treatment/'],
    // Category-offer pages: the 10% offer must not stack with their discounts (owner, 14/15 Oct 2026).
    offers: ['/offers/defence-and-paramilitary/', '/offers/defence-paramilitary-personnel-get-upto-30-off/',
      '/offers/new/', '/offers/olympics-and-paralympics-offer/', '/offers/senior-citizen-offer/']
  };
  var LOCALIZED_EXCLUDED = {
    '/de/cookie-richtlinie/': 'legal', '/de/e-mail-abonnent/': 'confirmation', '/de/haftungsausschluss/': 'legal',
    '/de/jetzt-bewerben/': 'form', '/de/kontakt/': 'form', '/de/kostenlose-online-beratung/': 'form',
    '/de/rechtlicher-hinweis/': 'legal', '/de/stornierungs-und-ruckerstattungsbedingungen/': 'legal',
    '/fr/abonne-au-courrier-electronique/': 'confirmation', '/fr/clause-de-non-responsabilite/': 'legal',
    '/fr/consultation-en-ligne/': 'form', '/fr/contactez-nous/': 'form', '/fr/mentions-legales/': 'legal',
    '/fr/politique-dannulation-et-de-remboursement/': 'legal', '/fr/politique-en-matiere-de-cookies/': 'legal',
    '/fr/remerciers/': 'confirmation', '/fr/termes-et-conditions/': 'legal'
  };
  var PAID_LOCALE = { '/lp/behandlung-in-kerala/': 'de', '/lp/treatment-in-kerala-russian/': 'ru' };
  var LOCALE_PREFIX = /^\/(hi|de|fr|es|it|pt|nl|ru|ar|zh|ja|ko)(\/.*)?$/;

  var COPY = {
    en: {
      eyebrow: "Before You Leave",
      caption: "Before you go",
      place: "Palakkad, Kerala · since 1908",
      title: "We’d love to have you experience the healing touch of Ayurveda! 🌿",
      offer: "Get 10% OFF on all Treatment Packages",
      desc: "Enter your details below to claim your exclusive discount!",
      name: "Name:*",
      countryCode: "Country code",
      phone: "Phone Number:*",
      email: "Email:*",
      consent: "I consent to be contacted by the clinic",
      privacy: "Privacy Policy",
      cta: "Claim Your Offer Now!",
      note: "NABH-accredited · Physician-led since 1908",
      imageAlt: "A therapist at Kairali carrying a welcome tray of herbal poultices",
      close: "Close",
      invalid: "Please check the highlighted fields and try again.",
      countryCodeError: "Please enter a country code.",
      consentError: "Please tick the consent box so we can process your request.",
      sending: "Sending…",
      success: "Thank you — your details are with our team. A physician will be in touch shortly.",
      notConnected: "This form is not connected yet. Nothing has been saved or sent. Please email info@kairali.com or WhatsApp +91 92898 38797.",
      failed: "We could not confirm your submission. Your details are still here; please try again.",
      network: "We could not confirm your submission. Check your connection and try again.",
      wait: "Please wait before trying again. Your details are still in the form."
    },
    hi: {
      eyebrow: "जाने से पहले",
      caption: "जाने से पहले",
      place: "पालक्काड, केरल · 1908 से",
      title: "हमें खुशी होगी यदि आप आयुर्वेद के उपचारात्मक स्पर्श का अनुभव करें! 🌿",
      offer: "सभी उपचार पैकेज पर 10% की छूट पाएँ",
      desc: "अपनी विशेष छूट पाने के लिए नीचे अपना विवरण दर्ज करें!",
      name: "नाम:*",
      countryCode: "देश कोड",
      phone: "फ़ोन नंबर:*",
      email: "ईमेल:*",
      consent: "मैं क्लिनिक द्वारा संपर्क किए जाने के लिए सहमति देता/देती हूँ",
      privacy: "गोपनीयता नीति",
      cta: "अभी अपना ऑफ़र पाएँ!",
      note: "NABH-मान्यता प्राप्त · 1908 से चिकित्सक-नेतृत्व में",
      imageAlt: "Kairali में हर्बल पोटली की स्वागत-थाली लिए एक थेरेपिस्ट",
      close: "बंद करें",
      invalid: "कृपया हाइलाइट किए गए फ़ील्ड जाँचें और फिर से प्रयास करें।",
      countryCodeError: "कृपया देश कोड दर्ज करें।",
      consentError: "कृपया सहमति बॉक्स पर टिक करें, ताकि हम आपके अनुरोध पर कार्रवाई कर सकें।",
      sending: "भेजा जा रहा है…",
      success: "धन्यवाद — आपका विवरण हमारी टीम को मिल गया है। एक चिकित्सक शीघ्र ही आपसे संपर्क करेंगे।",
      notConnected: "यह फ़ॉर्म अभी कनेक्ट नहीं है। कुछ भी सहेजा या भेजा नहीं गया है। कृपया info@kairali.com पर ईमेल करें या +91 92898 38797 पर WhatsApp करें।",
      failed: "हम आपके सबमिशन की पुष्टि नहीं कर सके। आपका विवरण अभी भी यहाँ है; कृपया दोबारा प्रयास करें।",
      network: "हम आपके सबमिशन की पुष्टि नहीं कर सके। अपना कनेक्शन जाँचें और दोबारा प्रयास करें।",
      wait: "कृपया दोबारा प्रयास करने से पहले कुछ देर प्रतीक्षा करें। आपका विवरण अभी भी फ़ॉर्म में है।"
    },
    de: {
      eyebrow: "Bevor Sie gehen",
      caption: "Bevor Sie gehen",
      place: "Palakkad, Kerala · seit 1908",
      title: "Wir würden uns freuen, wenn Sie die heilende Kraft des Ayurveda erleben! 🌿",
      offer: "Erhalten Sie 10% Rabatt auf alle Behandlungspakete",
      desc: "Geben Sie unten Ihre Daten ein, um Ihren exklusiven Rabatt zu erhalten!",
      name: "Name:*",
      countryCode: "Ländervorwahl",
      phone: "Telefonnummer:*",
      email: "E-Mail:*",
      consent: "Ich willige ein, von der Klinik kontaktiert zu werden",
      privacy: "Datenschutzerklärung",
      cta: "Jetzt Angebot sichern!",
      note: "NABH-akkreditiert · Ärztlich geleitet seit 1908",
      imageAlt: "Eine Therapeutin bei Kairali trägt ein Willkommenstablett mit Kräuterstempeln",
      close: "Schließen",
      invalid: "Bitte prüfen Sie die markierten Felder und versuchen Sie es erneut.",
      countryCodeError: "Bitte geben Sie eine Ländervorwahl ein.",
      consentError: "Bitte setzen Sie das Häkchen bei der Einwilligung, damit wir Ihre Anfrage bearbeiten können.",
      sending: "Wird gesendet…",
      success: "Vielen Dank — Ihre Angaben liegen unserem Team vor. Ein Arzt wird sich in Kürze bei Ihnen melden.",
      notConnected: "Dieses Formular ist noch nicht verbunden. Es wurde nichts gespeichert oder gesendet. Bitte schreiben Sie an info@kairali.com oder per WhatsApp an +91 92898 38797.",
      failed: "Wir konnten Ihre Übermittlung nicht bestätigen. Ihre Angaben sind noch vorhanden; bitte versuchen Sie es erneut.",
      network: "Wir konnten Ihre Übermittlung nicht bestätigen. Bitte prüfen Sie Ihre Verbindung und versuchen Sie es erneut.",
      wait: "Bitte warten Sie kurz, bevor Sie es erneut versuchen. Ihre Angaben sind noch im Formular."
    },
    fr: {
      eyebrow: "Avant de partir",
      caption: "Avant de partir",
      place: "Palakkad, Kerala · depuis 1908",
      title: "Nous serions ravis de vous faire découvrir le pouvoir de guérison de l’Ayurveda ! 🌿",
      offer: "Obtenez 10% de réduction sur tous les forfaits de traitement",
      desc: "Entrez vos coordonnées ci-dessous pour réclamer votre réduction exclusive !",
      name: "Nom :*",
      countryCode: "Indicatif pays",
      phone: "Numéro de téléphone :*",
      email: "E-mail :*",
      consent: "J'accepte d'être contacté(e) par la clinique",
      privacy: "Politique de confidentialité",
      cta: "Réclamez votre offre maintenant !",
      note: "Accréditation NABH · Sous direction médicale depuis 1908",
      imageAlt: "Une thérapeute de Kairali portant un plateau d'accueil de pochons d'herbes médicinales",
      close: "Fermer",
      invalid: "Veuillez vérifier les champs signalés et réessayer.",
      countryCodeError: "Veuillez saisir un indicatif de pays.",
      consentError: "Veuillez cocher la case de consentement afin que nous puissions traiter votre demande.",
      sending: "Envoi en cours…",
      success: "Merci — vos coordonnées ont bien été transmises à notre équipe. Un médecin vous contactera prochainement.",
      notConnected: "Ce formulaire n’est pas encore connecté. Rien n’a été enregistré ni envoyé. Veuillez écrire à info@kairali.com ou sur WhatsApp au +91 92898 38797.",
      failed: "Nous n’avons pas pu confirmer votre envoi. Vos informations sont toujours là ; veuillez réessayer.",
      network: "Nous n’avons pas pu confirmer votre envoi. Vérifiez votre connexion et réessayez.",
      wait: "Veuillez patienter avant de réessayer. Vos informations sont toujours dans le formulaire."
    },
    es: {
      eyebrow: "Antes de irse",
      caption: "Antes de ir",
      place: "Palakkad, Kerala · desde 1908",
      title: "¡Nos encantaría que experimentara el efecto sanador del Ayurveda! 🌿",
      offer: "Obtenga un 10% de descuento en todos los paquetes de tratamiento",
      desc: "¡Introduzca sus datos a continuación para obtener su descuento exclusivo!",
      name: "Nombre:*",
      countryCode: "Prefijo del país",
      phone: "Número de teléfono:*",
      email: "Correo electrónico:*",
      consent: "Acepto que la clínica se ponga en contacto conmigo",
      privacy: "Política de privacidad",
      cta: "¡Solicite su oferta ahora!",
      note: "Acreditado por NABH · Dirigido por médicos desde 1908",
      imageAlt: "Una terapeuta de Kairali lleva una bandeja de bienvenida con cataplasmas de hierbas",
      close: "Cerrar",
      invalid: "Revise los campos resaltados e inténtelo de nuevo.",
      countryCodeError: "Introduzca un prefijo de país.",
      consentError: "Marque la casilla de consentimiento para que podamos tramitar su solicitud.",
      sending: "Enviando…",
      success: "Gracias: sus datos ya están en manos de nuestro equipo. Un médico se pondrá en contacto con usted en breve.",
      notConnected: "Este formulario aún no está conectado. No se ha guardado ni enviado nada. Escriba a info@kairali.com o por WhatsApp al +91 92898 38797.",
      failed: "No hemos podido confirmar su envío. Sus datos siguen aquí; vuelva a intentarlo.",
      network: "No hemos podido confirmar su envío. Compruebe su conexión y vuelva a intentarlo.",
      wait: "Espere un momento antes de volver a intentarlo. Sus datos siguen en el formulario."
    },
    it: {
      eyebrow: "Prima di andare",
      caption: "Prima di andare",
      place: "Palakkad, Kerala · dal 1908",
      title: "Saremmo lieti di farLe sperimentare il tocco benefico dell'Ayurveda! 🌿",
      offer: "Ottenga il 10% di SCONTO su tutti i pacchetti di Trattamento",
      desc: "Inserisca i Suoi dati qui sotto per richiedere il Suo sconto esclusivo!",
      name: "Nome:*",
      countryCode: "Prefisso internazionale",
      phone: "Numero di telefono:*",
      email: "Email:*",
      consent: "Acconsento a essere contattato/a dalla clinica",
      privacy: "Informativa sulla privacy",
      cta: "Richieda subito la Sua offerta!",
      note: "Accreditamento NABH · Guidati da medici dal 1908",
      imageAlt: "Una terapista di Kairali con un vassoio di benvenuto di impacchi alle erbe",
      close: "Chiudi",
      invalid: "Controlli i campi evidenziati e riprovi.",
      countryCodeError: "Inserisci un prefisso internazionale.",
      consentError: "Selezioni la casella del consenso per consentirci di elaborare la Sua richiesta.",
      sending: "Invio in corso…",
      success: "Grazie — i Suoi dati sono stati inoltrati al nostro team. Un medico La contatterà a breve.",
      notConnected: "Questo modulo non è ancora collegato. Nulla è stato salvato o inviato. Scriva a info@kairali.com o su WhatsApp al +91 92898 38797.",
      failed: "Non è stato possibile confermare il Suo invio. I Suoi dati sono ancora qui; riprovi.",
      network: "Non è stato possibile confermare il Suo invio. Controlli la connessione e riprovi.",
      wait: "Attenda prima di riprovare. I Suoi dati sono ancora nel modulo."
    },
    pt: {
      eyebrow: "Antes de sair",
      caption: "Antes de ir",
      place: "Palakkad, Kerala · desde 1908",
      title: "Teríamos todo o gosto em que conhecesse o toque terapêutico do Ayurveda! 🌿",
      offer: "Obtenha 10% de DESCONTO em todos os pacotes de tratamento",
      desc: "Introduza os seus dados abaixo para obter o seu desconto exclusivo!",
      name: "Nome:*",
      countryCode: "Indicativo do país",
      phone: "Número de telefone:*",
      email: "E-mail:*",
      consent: "Autorizo que a clínica me contacte",
      privacy: "Política de Privacidade",
      cta: "Aproveite já a sua oferta!",
      note: "Acreditação NABH · Orientado por médicos desde 1908",
      imageAlt: "Uma terapeuta da Kairali segurando uma bandeja de boas-vindas com cataplasmas de ervas",
      close: "Fechar",
      invalid: "Verifique os campos assinalados e tente novamente.",
      countryCodeError: "Indique um indicativo do país.",
      consentError: "Assinale a caixa de consentimento para podermos processar o seu pedido.",
      sending: "A enviar…",
      success: "Obrigado — os seus dados foram enviados à nossa equipa. Um médico entrará em contacto consigo em breve.",
      notConnected: "Este formulário ainda não está ligado. Nada foi guardado nem enviado. Envie um email para info@kairali.com ou uma mensagem por WhatsApp para +91 92898 38797.",
      failed: "Não foi possível confirmar o seu envio. Os seus dados continuam aqui; tente novamente.",
      network: "Não foi possível confirmar o seu envio. Verifique a sua ligação e tente novamente.",
      wait: "Aguarde antes de tentar novamente. Os seus dados continuam no formulário."
    },
    nl: {
      eyebrow: "Voordat u vertrekt",
      caption: "Voordat u vertrekt",
      place: "Palakkad, Kerala · sinds 1908",
      title: "Wij nodigen u graag uit om de helende kracht van Ayurveda te ervaren! 🌿",
      offer: "Ontvang 10% korting op alle behandelpakketten",
      desc: "Vul hieronder uw gegevens in om uw exclusieve korting te ontvangen!",
      name: "Naam:*",
      countryCode: "Landcode",
      phone: "Telefoonnummer:*",
      email: "E-mail:*",
      consent: "Ik geef toestemming om door de kliniek te worden gecontacteerd",
      privacy: "Privacybeleid",
      cta: "Claim nu uw aanbieding!",
      note: "NABH-geaccrediteerd · Onder leiding van artsen sinds 1908",
      imageAlt: "Een therapeut bij Kairali met een welkomstblad met kruidenkompressen",
      close: "Sluiten",
      invalid: "Controleer de gemarkeerde velden en probeer het opnieuw.",
      countryCodeError: "Vul een landcode in.",
      consentError: "Vink het toestemmingsvakje aan, zodat wij uw aanvraag kunnen verwerken.",
      sending: "Bezig met verzenden…",
      success: "Dank u — uw gegevens zijn bij ons team. Een arts neemt binnenkort contact met u op.",
      notConnected: "Dit formulier is nog niet gekoppeld. Er is niets opgeslagen of verzonden. Mail naar info@kairali.com of stuur een WhatsApp-bericht naar +91 92898 38797.",
      failed: "We konden uw inzending niet bevestigen. Uw gegevens staan er nog; probeer het opnieuw.",
      network: "We konden uw inzending niet bevestigen. Controleer uw verbinding en probeer het opnieuw.",
      wait: "Wacht even voordat u het opnieuw probeert. Uw gegevens staan nog in het formulier."
    },
    ru: {
      eyebrow: "Прежде чем уйти",
      caption: "Прежде чем уйти",
      place: "Палаккад, Керала · с 1908 года",
      title: "Мы будем рады, если вы ощутите целительное прикосновение Аюрведы! 🌿",
      offer: "Скидка 10% на все пакеты процедур",
      desc: "Введите свои данные ниже, чтобы получить эксклюзивную скидку!",
      name: "Имя:*",
      countryCode: "Код страны",
      phone: "Номер телефона:*",
      email: "Эл. почта:*",
      consent: "Я согласен(-на), чтобы клиника связалась со мной",
      privacy: "Политика конфиденциальности",
      cta: "Получить предложение!",
      note: "Аккредитация NABH · Под руководством врачей с 1908 года",
      imageAlt: "Терапевт Kairali с приветственным подносом травяных мешочков",
      close: "Закрыть",
      invalid: "Пожалуйста, проверьте выделенные поля и попробуйте ещё раз.",
      countryCodeError: "Укажите код страны.",
      consentError: "Пожалуйста, отметьте согласие, чтобы мы могли обработать ваш запрос.",
      sending: "Отправка…",
      success: "Спасибо — ваши данные переданы нашей команде. Врач свяжется с вами в ближайшее время.",
      notConnected: "Эта форма пока не подключена. Ничего не сохранено и не отправлено. Пожалуйста, напишите на info@kairali.com или в WhatsApp по номеру +91 92898 38797.",
      failed: "Нам не удалось подтвердить отправку. Ваши данные по-прежнему здесь; пожалуйста, попробуйте ещё раз.",
      network: "Нам не удалось подтвердить отправку. Проверьте подключение и попробуйте ещё раз.",
      wait: "Пожалуйста, подождите, прежде чем повторить попытку. Ваши данные по-прежнему в форме."
    },
    ar: {
      eyebrow: "قبل أن تغادر",
      caption: "قبل أن تغادر",
      place: "بالاكاد، كيرالا · منذ 1908",
      title: "يسعدنا أن تختبر لمسة الأيورفيدا العلاجية! 🌿",
      offer: "احصل على خصم 10% على جميع باقات العلاج",
      desc: "أدخل بياناتك أدناه للحصول على خصمك الحصري!",
      name: "الاسم:*",
      countryCode: "رمز البلد",
      phone: "رقم الهاتف:*",
      email: "البريد الإلكتروني:*",
      consent: "أوافق على أن تتواصل معي العيادة",
      privacy: "سياسة الخصوصية",
      cta: "احصل على عرضك الآن!",
      note: "معتمد من NABH · بإشراف الأطباء منذ 1908",
      imageAlt: "معالِجة في Kairali تحمل صينية ترحيب عليها كمادات عشبية",
      close: "إغلاق",
      invalid: "يُرجى مراجعة الحقول المميزة والمحاولة مرة أخرى.",
      countryCodeError: "يرجى إدخال رمز الدولة.",
      consentError: "يُرجى تحديد خانة الموافقة لنتمكن من معالجة طلبك.",
      sending: "جارٍ الإرسال…",
      success: "شكرًا لك — وصلت بياناتك إلى فريقنا. سيتواصل معك أحد الأطباء قريبًا.",
      notConnected: "لم يتم ربط هذا النموذج بعد. لم يُحفظ أو يُرسل أي شيء. يُرجى مراسلتنا عبر البريد الإلكتروني info@kairali.com أو عبر WhatsApp على الرقم +91 92898 38797.",
      failed: "تعذّر علينا تأكيد إرسالك. لا تزال بياناتك هنا؛ يُرجى المحاولة مرة أخرى.",
      network: "تعذّر علينا تأكيد إرسالك. تحقّق من اتصالك وحاول مرة أخرى.",
      wait: "يُرجى الانتظار قليلًا قبل المحاولة مرة أخرى. لا تزال بياناتك في النموذج."
    },
    zh: {
      eyebrow: "离开之前",
      caption: "离开之前",
      place: "喀拉拉邦帕拉卡德 · 始于 1908 年",
      title: "诚邀您亲身体验阿育吠陀的疗愈之触！🌿",
      offer: "所有治疗项目套餐享 10% 折扣",
      desc: "请在下方填写您的信息，领取您的专属优惠！",
      name: "姓名：*",
      countryCode: "国家/地区代码",
      phone: "电话号码：*",
      email: "电子邮箱：*",
      consent: "我同意诊所与我联系",
      privacy: "隐私政策",
      cta: "立即领取优惠！",
      note: "NABH 认证 · 自 1908 年起由医生主导",
      imageAlt: "Kairali 的一位理疗师端着盛有草药敷包的迎宾托盘",
      close: "关闭",
      invalid: "请检查标出的字段后重试。",
      countryCodeError: "请输入国家代码。",
      consentError: "请勾选同意框，以便我们处理您的申请。",
      sending: "正在发送…",
      success: "谢谢——我们的团队已收到您的信息，医生将很快与您联系。",
      notConnected: "此表单尚未接通。您的信息未被保存或发送。请发送电子邮件至 info@kairali.com，或通过 WhatsApp 联系 +91 92898 38797。",
      failed: "我们无法确认您的提交。您填写的信息仍保留在此，请重试。",
      network: "我们无法确认您的提交。请检查网络连接后重试。",
      wait: "请稍候再试。您填写的信息仍保留在表单中。"
    },
    ja: {
      eyebrow: "お帰りになる前に",
      caption: "お帰りになる前に",
      place: "ケーララ州パラッカド · 1908年創業",
      title: "アーユルヴェーダの癒やしを、ぜひご体験ください！🌿",
      offer: "すべての治療パッケージが10%オフ",
      desc: "以下にご情報をご入力のうえ、特別割引をお受け取りください！",
      name: "お名前：*",
      countryCode: "国番号",
      phone: "電話番号：*",
      email: "メールアドレス：*",
      consent: "クリニックからの連絡に同意します",
      privacy: "プライバシーポリシー",
      cta: "今すぐ特典を受け取る！",
      note: "NABH認定 · 1908年より医師主導",
      imageAlt: "薬草のポウルティス（ハーブボール）を載せた歓迎のトレイを運ぶ Kairali のセラピスト",
      close: "閉じる",
      invalid: "強調表示された項目をご確認のうえ、もう一度お試しください。",
      countryCodeError: "国番号を入力してください。",
      consentError: "ご依頼を処理するため、同意欄にチェックを入れてください。",
      sending: "送信中…",
      success: "ありがとうございます。ご入力内容はスタッフに届きました。まもなく医師よりご連絡いたします。",
      notConnected: "このフォームはまだ接続されていません。情報は保存も送信もされていません。info@kairali.com までメールいただくか、WhatsApp（+91 92898 38797）でご連絡ください。",
      failed: "送信を確認できませんでした。入力内容はそのまま残っていますので、もう一度お試しください。",
      network: "送信を確認できませんでした。インターネット接続をご確認のうえ、もう一度お試しください。",
      wait: "しばらく待ってから再度お試しください。入力内容はフォームにそのまま残っています。"
    },
    ko: {
      eyebrow: "떠나시기 전에",
      caption: "떠나시기 전에",
      place: "케랄라주 팔라카드 · 1908년부터",
      title: "아유르베다의 치유 손길을 꼭 경험해 보시기 바랍니다! 🌿",
      offer: "모든 치료 패키지 10% 할인",
      desc: "아래에 정보를 입력하시고 특별 할인을 받으십시오!",
      name: "이름:*",
      countryCode: "국가 번호",
      phone: "전화번호:*",
      email: "이메일:*",
      consent: "클리닉이 저에게 연락하는 것에 동의합니다",
      privacy: "개인정보 처리방침",
      cta: "지금 혜택 받기!",
      note: "NABH 인증 · 1908년부터 의사 주도 진료",
      imageAlt: "허브 찜질 주머니가 담긴 환영 쟁반을 들고 있는 Kairali의 치료사",
      close: "닫기",
      invalid: "표시된 항목을 확인한 후 다시 시도하십시오.",
      countryCodeError: "국가 코드를 입력해 주세요.",
      consentError: "신청을 처리할 수 있도록 동의란에 체크해 주십시오.",
      sending: "전송 중…",
      success: "감사합니다. 입력하신 정보가 담당 팀에 전달되었습니다. 곧 의사가 연락드릴 예정입니다.",
      notConnected: "이 양식은 아직 연결되지 않았습니다. 저장되거나 전송된 내용은 없습니다. info@kairali.com으로 이메일을 보내시거나 WhatsApp(+91 92898 38797)으로 연락해 주십시오.",
      failed: "제출을 확인하지 못했습니다. 입력하신 정보는 그대로 남아 있으니 다시 시도해 주십시오.",
      network: "제출을 확인하지 못했습니다. 인터넷 연결을 확인하신 후 다시 시도해 주십시오.",
      wait: "잠시 후 다시 시도해 주십시오. 입력하신 정보는 양식에 그대로 남아 있습니다."
    }
  };

  function language(path) {
    // Same rule as lead-receipt.js: released route prefixes are stable (Chrome Translate can rewrite <html lang>).
    var match = LOCALE_PREFIX.exec(String(path || '/'));
    if (match) return match[1];
    // The two non-English paid landers have no locale prefix (app/(ppc-v2-de), app/(ppc-v2-ru)).
    return PAID_LOCALE[String(path || '/')] || 'en';
  }
  function copyFor(lang) { return COPY[lang] || COPY.en; }
  function localPath(base, lang) { return !lang || lang === 'en' ? base : '/' + lang + base; }

  /** The reason a path never shows the offer ('confirmation' | 'legal' | 'form' | 'offers'), or null. */
  function exclusionReason(path) {
    var p = String(path || '/');
    var match = LOCALE_PREFIX.exec(p);
    var base = match ? (match[2] || '/') : p;
    var candidates = [p, base];
    if (!/\/$/.test(base) && !/\.html$/i.test(base)) candidates.push(base + '/');
    for (var reason in EXCLUDED) {
      for (var i = 0; i < candidates.length; i++) if (EXCLUDED[reason].indexOf(candidates[i]) !== -1) return reason;
    }
    if (Object.prototype.hasOwnProperty.call(LOCALIZED_EXCLUDED, p)) return LOCALIZED_EXCLUDED[p];
    if (Object.prototype.hasOwnProperty.call(LOCALIZED_EXCLUDED, p + '/')) return LOCALIZED_EXCLUDED[p + '/'];
    return null;
  }

  function readJson(storage, key) {
    try { var raw = storage && storage.getItem(key); return raw ? JSON.parse(raw) : null; } catch (_) { return null; }
  }
  /** True while a dismissal or submission is less than SUPPRESS_DAYS old. Unreadable storage never suppresses. */
  function suppressed(storage, now) {
    var item = readJson(storage, STORE_KEY);
    if (!item || (item.state !== 'dismissed' && item.state !== 'submitted') || typeof item.at !== 'number') return false;
    return now >= item.at && now - item.at < SUPPRESS_DAYS * DAY_MS;
  }
  function remember(storage, state, now) {
    // Only the outcome and its time: never anything the visitor typed.
    try { storage.setItem(STORE_KEY, JSON.stringify({ state: state, at: now })); return true; } catch (_) { return false; }
  }
  function shownThisSession(session) {
    try { return session.getItem(SESSION_KEY) === 'shown'; } catch (_) { return false; }
  }
  function markShown(session) { try { session.setItem(SESSION_KEY, 'shown'); } catch (_) { /* once per page then */ } }

  /** Another overlay or an active form owns the visitor's attention. */
  function busyElsewhere(doc, own) {
    if (!doc) return true;
    var html = doc.documentElement;
    if (doc.getElementById && doc.getElementById('ahv-consent')) return true;
    if (html && html.classList && (html.classList.contains('show--consent') || html.classList.contains('show--preferences'))) return true;
    if (doc.body && doc.body.getAttribute && doc.body.getAttribute('data-ahv-chat-open') === 'true') return true;
    var active = doc.activeElement;
    if (active && active.closest && active.closest('form')) return true;
    var open = doc.querySelectorAll ? doc.querySelectorAll('dialog[open], [aria-modal="true"]') : [];
    for (var i = 0; i < open.length; i++) {
      var n = open[i];
      if (n === own || (own && own.contains && own.contains(n)) || n.hidden) continue;
      // A closed-but-mounted aria-modal panel (display:none) does not count; an open <dialog> always does.
      if (n.tagName !== 'DIALOG' && typeof n.getClientRects === 'function' && !n.getClientRects().length) continue;
      return true;
    }
    return false;
  }

  /** The exit-intent decision, separated from the DOM: GuestSupport.tsx's rules. `show()` is called at most once. */
  function createTrigger(env, show) {
    var started = env.now(), engaged = false, fired = false, peak = env.scrollY();
    function attempt(kind) {
      if (fired || !engaged || env.now() - started < MIN_ENGAGED_MS) return false;
      if (show(kind) === false) return false;
      fired = true;
      return true;
    }
    return {
      scroll: function () {
        var y = env.scrollY(), h = env.innerHeight();
        if (y > h) engaged = true;
        peak = Math.max(peak, y);
        // Touch devices have no mouse exit: a deliberate return towards the top after real engagement.
        if (env.matches('(pointer: coarse)') && peak - y > h && y < h) return attempt('mobile-scroll-return');
        return false;
      },
      mouseout: function (e) {
        if (e && e.clientY <= 0 && !e.relatedTarget && env.matches('(pointer: fine)')) return attempt('desktop-exit');
        return false;
      },
      get fired() { return fired; }
    };
  }

  var EMAIL = /^\S+@\S+\.\S+$/;
  /** The contact form's own client rules, plus the required consent the exit-intent table enforces. */
  function validate(values) {
    var invalid = {
      full_name: String(values.full_name || '').trim().length < 2,
      countrycode: !String(values.countrycode || '').trim(),
      phone: String(values.phone || '').replace(/\D/g, '').length < 7,
      email: !EMAIL.test(String(values.email || '').trim()),
      consent: values.consent !== true
    };
    var ok = true;
    for (var k in invalid) if (invalid[k]) ok = false;
    return { ok: ok, invalid: invalid };
  }

  /** Exactly the contact form's /api/lead/ body (static-design-boot), as table "exit-intent". */
  function buildPayload(values, ctx) {
    var c = ctx.attribution || {};
    return {
      form: 'exit-intent', submissionToken: ctx.token,
      site_language: ctx.siteLanguage,
      utm_source: c.utm_source || '', utm_medium: c.utm_medium || '', utm_campaign: c.utm_campaign || '',
      utm_term: c.utm_term || '', utm_content: c.utm_content || '',
      gclid: c.gclid || '', fbclid: c.fbclid || '', gbraid: c.gbraid || '', wbraid: c.wbraid || '',
      lead_source_url: String(ctx.href || '').slice(0, 500),
      referrer: String(ctx.referrer || '').slice(0, 500),
      fields: {
        full_name: String(values.full_name || '').trim(),
        countrycode: String(values.countrycode || '').trim(),
        phone: String(values.phone || '').trim(),
        email: String(values.email || '').trim(),
        consent: values.consent === true,
        subject: OFFER_SUBJECT,
        trigger_type: ctx.trigger || ''
      }
    };
  }

  // ---------------------------------------------------------------- dialog ----
  var CSS = [
    'dialog.ahv-exit-offer{padding:0;border:0;border-radius:4px;background:#F7F4EA;color:#2A2118;width:min(430px,calc(100vw - 32px));max-width:430px;max-height:calc(100vh - 32px);max-height:calc(100dvh - 32px);overflow-y:auto;box-shadow:0 24px 60px rgba(26,22,14,.55);box-sizing:border-box;font-family:inherit}',
    'dialog.ahv-exit-offer::backdrop{background:rgba(26,22,14,.80);-webkit-backdrop-filter:blur(3px);backdrop-filter:blur(3px)}',
    '.ahv-exit-offer *{box-sizing:border-box}',
    '.ahv-exit-offer__close{position:absolute;top:12px;inset-inline-end:12px;width:44px;height:44px;border:1px solid rgba(247,244,234,.45);background:rgba(26,22,14,.45);color:#F7F4EA;font-size:19px;line-height:1;cursor:pointer;z-index:3;border-radius:0}',
    '.ahv-exit-offer__close:focus-visible,.ahv-exit-offer__cta:focus-visible,.ahv-exit-offer input:focus-visible,.ahv-exit-offer a:focus-visible{outline:2px solid #EEB41E;outline-offset:2px}',
    '.ahv-exit-offer__media{position:relative;height:190px;background-color:#2A2014;background-image:url(' + IMAGE + ');background-size:cover;background-position:52% 26%}',
    '.ahv-exit-offer__media::after{content:"";position:absolute;inset:0;background:linear-gradient(to top,rgba(26,22,14,.80) 0%,rgba(26,22,14,.12) 58%,rgba(26,22,14,.22) 100%)}',
    '.ahv-exit-offer__caption{position:absolute;left:22px;right:70px;bottom:16px;color:#F7F4EA;z-index:1}',
    '[dir=rtl] .ahv-exit-offer__caption{left:70px;right:22px}',
    '.ahv-exit-offer__caption-line{font-family:"Marcellus",serif;font-size:19px;line-height:1.3}',
    '.ahv-exit-offer__place{font-weight:700;font-size:12px;letter-spacing:2.4px;text-transform:uppercase;color:#EEB41E;margin-top:6px}',
    '.ahv-exit-offer__body{padding:26px 22px 24px}',
    '.ahv-exit-offer__eyebrow{font-weight:700;font-size:12px;letter-spacing:2.6px;color:#8F6212;text-transform:uppercase;margin:0}',
    '.ahv-exit-offer__title{font-family:"Marcellus",serif;font-size:24px;font-weight:400;line-height:1.2;margin:12px 0 16px;color:#2A2118;text-wrap:balance}',
    '.ahv-exit-offer__offer{border-top:1px solid #C1882C;padding-top:14px;margin:0 0 16px;font-family:"Marcellus",serif;font-size:21px;color:#5A4420}',
    '.ahv-exit-offer__desc{font-size:15.5px;line-height:1.68;color:#4A4238;margin:0 0 20px}',
    '.ahv-exit-offer__alert{background:#FBEEEA;border-inline-start:3px solid #9B3B23;color:#9B3B23;padding:12px 14px;font-size:14px;margin:0 0 16px}',
    '.ahv-exit-offer__fields{display:flex;flex-direction:column;gap:14px;margin-bottom:20px}',
    '.ahv-exit-offer__phone{display:grid;grid-template-columns:minmax(92px,30%) 1fr;gap:14px;align-items:end}',
    '.ahv-exit-offer__label{display:block;font-size:12px;font-weight:700;letter-spacing:1.8px;text-transform:uppercase;color:#8F6212;margin-bottom:6px}',
    '.ahv-exit-offer__input{display:block;width:100%;border:0;border-bottom:1px solid #D8D1C0;border-radius:0;background:transparent;padding:4px 2px 8px;font:inherit;font-size:16px;color:#2A2118;min-height:44px}',
    '.ahv-exit-offer__input[aria-invalid=true]{border-bottom-color:#9B3B23}',
    '.ahv-exit-offer__consent{display:flex;gap:10px;align-items:flex-start;font-size:14.5px;line-height:1.55;color:#4A4238}',
    '.ahv-exit-offer__consent input{width:22px;height:22px;margin:1px 0 0;flex:0 0 22px;accent-color:#5A4420}',
    '.ahv-exit-offer__consent input[aria-invalid=true]{outline:2px solid #9B3B23;outline-offset:2px}',
    '.ahv-exit-offer__privacy{display:inline-block;margin-top:4px;color:#5A4420;text-decoration:underline}',
    '.ahv-exit-offer__cta{display:flex;align-items:center;justify-content:center;width:100%;min-height:56px;border:0;background:#5A4420;color:#F7F4EA;border-radius:4px;padding:16px 20px;font:inherit;font-weight:700;font-size:13px;letter-spacing:2px;text-transform:uppercase;text-align:center;cursor:pointer}',
    '.ahv-exit-offer__cta:hover{background:#483616}',
    '.ahv-exit-offer form[aria-busy=true] .ahv-exit-offer__cta{opacity:.6;cursor:progress}',
    '.ahv-exit-offer__status{min-height:1.5em;margin:12px 0 0;font-size:14px;line-height:1.5;color:#4A4238}',
    '.ahv-exit-offer__success{background:#EDF3EC;border-inline-start:3px solid #006038;padding:18px 20px;font-size:15px;line-height:1.65;color:#2A2118;margin:0}',
    '.ahv-exit-offer__note{font-size:12px;letter-spacing:1.3px;text-transform:uppercase;color:#75695A;margin:20px 0 0}',
    '.ahv-exit-offer [hidden]{display:none!important}',
    '@media (max-height:900px){.ahv-exit-offer__media{height:150px}.ahv-exit-offer__desc{margin-bottom:14px}}',
    '@media (max-width:420px),(max-height:700px){.ahv-exit-offer__media{height:132px}.ahv-exit-offer__body{padding:20px 18px 20px}.ahv-exit-offer__title{font-size:21px;margin:10px 0 12px}.ahv-exit-offer__offer{font-size:19px;margin-bottom:12px}.ahv-exit-offer__desc{margin-bottom:16px}}'
  ].join('');

  function el(doc, tag, cls, text) {
    var n = doc.createElement(tag);
    if (cls) n.className = cls;
    if (text != null) n.textContent = text;
    return n;
  }
  function field(doc, id, label, attrs) {
    var wrap = el(doc, 'div', 'ahv-exit-offer__field');
    var l = el(doc, 'label', 'ahv-exit-offer__label', label);
    l.setAttribute('for', id);
    var input = el(doc, 'input', 'ahv-exit-offer__input');
    input.id = id;
    for (var k in attrs) input.setAttribute(k, attrs[k]);
    wrap.appendChild(l);
    wrap.appendChild(input);
    return wrap;
  }

  function buildDialog(doc, lang) {
    var t = copyFor(lang);
    var d = el(doc, 'dialog', 'ahv-exit-offer');
    d.setAttribute('data-ahv-exit-offer', '');
    d.setAttribute('role', 'dialog');
    d.setAttribute('aria-modal', 'true');
    d.setAttribute('aria-labelledby', 'ahv-exit-offer-title');
    d.setAttribute('aria-describedby', 'ahv-exit-offer-offer');

    var close = el(doc, 'button', 'ahv-exit-offer__close', '×');
    close.setAttribute('type', 'button');
    close.setAttribute('aria-label', t.close);
    close.setAttribute('data-ahv-exit-close', '');
    d.appendChild(close);

    var media = el(doc, 'div', 'ahv-exit-offer__media');
    media.setAttribute('role', 'img');
    media.setAttribute('aria-label', t.imageAlt);
    var caption = el(doc, 'div', 'ahv-exit-offer__caption');
    caption.setAttribute('aria-hidden', 'true');
    caption.appendChild(el(doc, 'div', 'ahv-exit-offer__caption-line', t.caption));
    caption.appendChild(el(doc, 'div', 'ahv-exit-offer__place', t.place));
    media.appendChild(caption);
    d.appendChild(media);

    var body = el(doc, 'div', 'ahv-exit-offer__body');
    body.appendChild(el(doc, 'p', 'ahv-exit-offer__eyebrow', t.eyebrow));
    var h = el(doc, 'h2', 'ahv-exit-offer__title', t.title);
    h.id = 'ahv-exit-offer-title';
    body.appendChild(h);
    var offer = el(doc, 'p', 'ahv-exit-offer__offer', t.offer);
    offer.id = 'ahv-exit-offer-offer';
    body.appendChild(offer);
    body.appendChild(el(doc, 'p', 'ahv-exit-offer__desc', t.desc));

    var alert = el(doc, 'p', 'ahv-exit-offer__alert');
    alert.setAttribute('role', 'alert');
    alert.setAttribute('data-ahv-exit-alert', '');
    alert.hidden = true;
    body.appendChild(alert);

    var form = el(doc, 'form', 'ahv-exit-offer__form');
    form.setAttribute('novalidate', '');
    form.setAttribute('data-ahv-exit-form', '');
    var fields = el(doc, 'div', 'ahv-exit-offer__fields');
    fields.appendChild(field(doc, 'ahv-exit-name', t.name, { name: 'full_name', type: 'text', autocomplete: 'name', required: '', maxlength: '120' }));
    var phone = el(doc, 'div', 'ahv-exit-offer__phone');
    phone.appendChild(field(doc, 'ahv-exit-code', t.countryCode, { name: 'countrycode', type: 'tel', inputmode: 'tel', autocomplete: 'tel-country-code', required: '', maxlength: '6' }));
    phone.appendChild(field(doc, 'ahv-exit-phone', t.phone, { name: 'phone', type: 'tel', inputmode: 'tel', autocomplete: 'tel-national', required: '', maxlength: '20' }));
    fields.appendChild(phone);
    fields.appendChild(field(doc, 'ahv-exit-email', t.email, { name: 'email', type: 'email', autocomplete: 'email', required: '', maxlength: '254' }));
    var consent = el(doc, 'div', 'ahv-exit-offer__consent');
    var box = el(doc, 'input');
    box.id = 'ahv-exit-consent';
    box.setAttribute('type', 'checkbox');
    box.setAttribute('name', 'consent');
    box.setAttribute('required', '');
    var consentText = el(doc, 'div');
    var consentLabel = el(doc, 'label', null, t.consent);
    consentLabel.setAttribute('for', 'ahv-exit-consent');
    consentText.appendChild(consentLabel);
    consentText.appendChild(doc.createTextNode ? doc.createTextNode(' ') : el(doc, 'span', null, ' '));
    var privacy = el(doc, 'a', 'ahv-exit-offer__privacy', t.privacy);
    privacy.setAttribute('href', localPath(PRIVACY_PATH, lang));
    privacy.setAttribute('target', '_blank');
    privacy.setAttribute('rel', 'noopener');
    consentText.appendChild(privacy);
    consent.appendChild(box);
    consent.appendChild(consentText);
    fields.appendChild(consent);
    form.appendChild(fields);
    var cta = el(doc, 'button', 'ahv-exit-offer__cta', t.cta);
    cta.setAttribute('type', 'submit');
    form.appendChild(cta);
    var status = el(doc, 'p', 'ahv-exit-offer__status');
    status.setAttribute('role', 'status');
    status.setAttribute('data-ahv-exit-status', '');
    form.appendChild(status);
    body.appendChild(form);

    var success = el(doc, 'p', 'ahv-exit-offer__success', t.success);
    success.setAttribute('role', 'status');
    success.setAttribute('data-ahv-exit-success', '');
    success.setAttribute('tabindex', '-1');
    success.hidden = true;
    body.appendChild(success);
    body.appendChild(el(doc, 'p', 'ahv-exit-offer__note', t.note));
    d.appendChild(body);
    return d;
  }

  var FOCUSABLE = 'a[href], button:not([disabled]), input:not([disabled]):not([type="hidden"]), [tabindex]:not([tabindex="-1"])';
  function focusables(d) {
    var list = d.querySelectorAll(FOCUSABLE), out = [];
    for (var i = 0; i < list.length; i++) if (!list[i].closest('[hidden]')) out.push(list[i]);
    return out;
  }
  /** Keeps Tab / Shift+Tab inside the open dialog (showModal already makes the page inert). */
  function trapTab(ev, d, active) {
    if (ev.key !== 'Tab') return false;
    var f = focusables(d);
    if (!f.length) return false;
    var first = f[0], last = f[f.length - 1];
    if (ev.shiftKey && (active === first || !d.contains(active))) { ev.preventDefault(); last.focus(); return true; }
    if (!ev.shiftKey && (active === last || !d.contains(active))) { ev.preventDefault(); first.focus(); return true; }
    return false;
  }

  function readValues(form) {
    var get = function (name) { var n = form.querySelector('[name="' + name + '"]'); return n ? n : null; };
    return {
      full_name: (get('full_name') || {}).value || '',
      countrycode: (get('countrycode') || {}).value || '',
      phone: (get('phone') || {}).value || '',
      email: (get('email') || {}).value || '',
      consent: !!(get('consent') || {}).checked
    };
  }

  /** Validation, the POST and the outcome UI. `deps` = { win, doc, lang, trigger, storage, now, state }. */
  async function submit(d, deps) {
    var state = deps.state, t = copyFor(deps.lang);
    if (state.busy || state.done) return false;
    var form = d.querySelector('[data-ahv-exit-form]');
    var alert = d.querySelector('[data-ahv-exit-alert]');
    var status = d.querySelector('[data-ahv-exit-status]');
    var values = readValues(form);
    var check = validate(values);
    var first = null;
    for (var name in check.invalid) {
      var input = form.querySelector('[name="' + name + '"]');
      if (!input) continue;
      if (check.invalid[name]) { input.setAttribute('aria-invalid', 'true'); if (!first) first = input; }
      else input.removeAttribute('aria-invalid');
    }
    if (!check.ok) {
      var onlyConsent = check.invalid.consent && !check.invalid.full_name && !check.invalid.countrycode && !check.invalid.phone && !check.invalid.email;
      alert.textContent = onlyConsent ? t.consentError
        : check.invalid.countrycode && !check.invalid.full_name && !check.invalid.phone && !check.invalid.email && !check.invalid.consent ? t.countryCodeError
        : t.invalid;
      alert.hidden = false;
      if (first && first.focus) first.focus();
      return false;
    }
    alert.hidden = true;
    alert.textContent = '';
    var win = deps.win;
    if (!state.token) state.token = win.crypto.randomUUID();
    state.busy = true;
    form.setAttribute('aria-busy', 'true');
    status.textContent = t.sending;
    var controller = typeof win.AbortController === 'function' ? new win.AbortController() : null;
    var timeout = win.setTimeout(function () { if (controller) controller.abort(); }, SUBMIT_TIMEOUT_MS);
    try {
      var receipt = win.AHV_LEAD_RECEIPT;
      var payload = buildPayload(values, {
        token: state.token,
        trigger: deps.trigger,
        attribution: receipt && typeof receipt.attribution === 'function' ? receipt.attribution() : {},
        siteLanguage: receipt && typeof receipt.siteLanguage === 'function' ? receipt.siteLanguage() : (deps.lang === 'zh' ? 'zh-Hans' : deps.lang),
        href: win.location.href,
        referrer: deps.doc.referrer || ''
      });
      var response = await win.fetch('/api/lead/', {
        method: 'POST', credentials: 'same-origin', cache: 'no-store',
        body: new win.Blob([JSON.stringify(payload)], { type: 'application/json' }),
        signal: controller ? controller.signal : undefined
      });
      var result = await response.json().catch(function () { return {}; });
      if (response.status === 503 && /_NOT_CONFIGURED$/.test(String(result.code || ''))) {
        status.textContent = t.notConnected;
        return false;
      }
      if (!response.ok || result.ok !== true) {
        status.textContent = response.status === 429 ? t.wait : t.failed;
        return false;
      }
      if (typeof result.guideUrl === 'string' && result.guideUrl.charAt(0) === '/') {
        var guide = deps.doc.createElement('a');
        guide.href = result.guideUrl; guide.download = ''; guide.hidden = true;
        deps.doc.body.appendChild(guide); if (guide.click) guide.click(); if (guide.remove) guide.remove();
      }
      state.done = true;
      remember(deps.storage, 'submitted', deps.now());
      status.textContent = '';
      form.hidden = true;
      var success = d.querySelector('[data-ahv-exit-success]');
      success.hidden = false;
      if (success.focus) success.focus();
      return true;
    } catch (_) {
      status.textContent = t.network;
      return false;
    } finally {
      win.clearTimeout(timeout);
      state.busy = false;
      form.removeAttribute('aria-busy');
    }
  }

  /** Builds (once), wires and opens the dialog. Returns false when it cannot open. */
  function open(win, kind, deps) {
    var doc = win.document;
    var d = doc.querySelector('dialog[data-ahv-exit-offer]');
    if (!d) {
      if (!doc.querySelector('style[data-ahv-exit-offer-css]')) {
        var style = doc.createElement('style');
        style.setAttribute('data-ahv-exit-offer-css', '');
        style.textContent = CSS;
        (doc.head || doc.documentElement).appendChild(style);
      }
      d = buildDialog(doc, deps.lang);
      if (typeof d.showModal !== 'function') return false;
      doc.body.appendChild(d);
      wire(win, d, deps);
    }
    if (d.open) return true;
    deps.trigger = kind;
    deps.opener = doc.activeElement && doc.activeElement !== doc.body ? doc.activeElement : null;
    try { d.showModal(); } catch (_) { return false; }
    var c = d.querySelector('[data-ahv-exit-close]');
    if (c && c.focus) c.focus();
    return true;
  }

  function wire(win, d, deps) {
    var doc = win.document;
    var form = d.querySelector('[data-ahv-exit-form]');
    var reset = function (ev) {
      if (!deps.state.busy) deps.state.token = null;
      // A corrected field drops its error mark, as on the contact form.
      if (ev && ev.target && ev.target.removeAttribute) ev.target.removeAttribute('aria-invalid');
    };
    form.addEventListener('input', reset);
    form.addEventListener('change', reset);
    form.addEventListener('submit', function (ev) { ev.preventDefault(); submit(d, deps); });
    d.addEventListener('keydown', function (ev) { trapTab(ev, d, doc.activeElement); });
    d.addEventListener('click', function (ev) {
      if (ev.target && ev.target.closest && ev.target.closest('[data-ahv-exit-close]')) { d.close(); return; }
      // A click on the backdrop reaches the dialog element itself, outside its box.
      if (ev.target === d && typeof d.getBoundingClientRect === 'function' && typeof ev.clientX === 'number') {
        var r = d.getBoundingClientRect();
        if (ev.clientX < r.left || ev.clientX > r.right || ev.clientY < r.top || ev.clientY > r.bottom) d.close();
      }
    });
    // Escape fires the native cancel then close; every way out ends here.
    d.addEventListener('close', function () {
      if (!deps.state.done) remember(deps.storage, 'dismissed', deps.now());
      var t = deps.opener;
      deps.opener = null;
      if (t && t.isConnected && typeof t.focus === 'function') t.focus();
    });
  }

  function init(win) {
    var doc = win && win.document;
    if (!doc || win.__ahvExitOffer) return false;
    var path = win.location.pathname;
    if (exclusionReason(path)) return false;
    if (typeof win.HTMLDialogElement !== 'function') return false;
    var storage = null, session = null;
    try { storage = win.localStorage; } catch (_) { storage = null; }
    try { session = win.sessionStorage; } catch (_) { session = null; }
    var now = function () { return Date.now(); };
    if (shownThisSession(session) || suppressed(storage, now())) return false;
    win.__ahvExitOffer = true;
    var deps = { win: win, doc: doc, lang: language(path), storage: storage, now: now, state: { busy: false, done: false, token: null } };
    var trigger = createTrigger({
      now: now,
      scrollY: function () { return win.scrollY || 0; },
      innerHeight: function () { return win.innerHeight || 0; },
      matches: function (q) { return !!(win.matchMedia && win.matchMedia(q).matches); }
    }, function (kind) {
      // Re-checked at the moment of exit: the route, other tabs' outcomes and anything else on screen.
      if (exclusionReason(win.location.pathname)) return false;
      if (shownThisSession(session) || suppressed(storage, now())) return false;
      if (busyElsewhere(doc, doc.querySelector('dialog[data-ahv-exit-offer]'))) return false;
      if (!open(win, kind, deps)) return false;
      markShown(session);
      return true;
    });
    var onScroll = function () { if (trigger.scroll()) detach(); };
    var onOut = function (e) { if (trigger.mouseout(e)) detach(); };
    function detach() { win.removeEventListener('scroll', onScroll); doc.removeEventListener('mouseout', onOut); }
    win.addEventListener('scroll', onScroll, { passive: true });
    doc.addEventListener('mouseout', onOut);
    return true;
  }

  var api = {
    LOCALES: LOCALES, COPY: COPY, EXCLUDED: EXCLUDED, LOCALIZED_EXCLUDED: LOCALIZED_EXCLUDED, OFFER_SUBJECT: OFFER_SUBJECT,
    STORE_KEY: STORE_KEY, SESSION_KEY: SESSION_KEY, SUPPRESS_DAYS: SUPPRESS_DAYS, MIN_ENGAGED_MS: MIN_ENGAGED_MS,
    language: language, copyFor: copyFor, localPath: localPath, exclusionReason: exclusionReason,
    suppressed: suppressed, remember: remember, busyElsewhere: busyElsewhere,
    createTrigger: createTrigger, validate: validate, buildPayload: buildPayload, buildDialog: buildDialog,
    trapTab: trapTab, submit: submit, open: open, init: init
  };
  if (typeof module === 'object' && module && module.exports) module.exports = api;
  else if (typeof window !== 'undefined') init(window);
})();
