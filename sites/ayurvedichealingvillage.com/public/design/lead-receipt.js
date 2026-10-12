/* One-use, same-tab confirmation for accepted AHV lead submissions.
   The existing form handlers retain validation, retry, guide download and error UI.
   This observes only the confirmed /api/lead/ response; consented measurement
   receives only an enquiry form type and the non-personal submission token. */
(function () {
  'use strict';
  if (window.AHV_LEAD_RECEIPT) return;
  var key = 'ahv:lead-receipt:v1';
  var ttl = 2 * 60 * 1000;
  var originalFetch = window.fetch;
  var active = null;
  var pending = false;
  var targets = {
    'contact': '/contact-us/thank-you/',
    'enquiry-form': '/thanks/',
    'online-consultation': '/onlineconsultation-thanks/',
    'apply-now': '/thanks/',
    'opd': '/thanks/',
    'landing-page': '/thanks/'
  };
  // Paid landing receipts used to go to /ppc-thanks/, which now 301s to the same
  // locale's /thanks/. A receipt a cached bridge stored for the old path is
  // honoured there; any other form, locale or path still fails closed.
  var retired = { 'landing-page': '/ppc-thanks/' };
  var received = {
    application: {
      en: 'Thank you — your application has been received.', hi: 'धन्यवाद — आपका आवेदन प्राप्त हो गया है।',
      de: 'Vielen Dank – Ihre Bewerbung ist eingegangen.', fr: 'Merci — votre candidature a bien été reçue.',
      es: 'Gracias — hemos recibido su solicitud de empleo.', it: 'Grazie — abbiamo ricevuto la tua candidatura.',
      pt: 'Obrigado — recebemos a sua candidatura.', nl: 'Dank u wel — uw sollicitatie is ontvangen.',
      ru: 'Спасибо — ваше заявление о приёме на работу получено.', ar: 'شكرًا لك — تم استلام طلب التوظيف الخاص بك.',
      zh: '谢谢——我们已收到您的求职申请。', ja: 'ありがとうございます。ご応募を受け付けました。',
      ko: '감사합니다. 지원서가 접수되었습니다.'
    },
    opd: {
      en: 'Thank you — your OPD request has been received.', hi: 'धन्यवाद — आपका ओपीडी अनुरोध प्राप्त हो गया है।',
      de: 'Vielen Dank – Ihre OPD-Anfrage ist eingegangen.', fr: 'Merci — votre demande de consultation externe a bien été reçue.',
      es: 'Gracias — hemos recibido su solicitud de consulta ambulatoria.', it: 'Grazie — abbiamo ricevuto la tua richiesta di visita ambulatoriale.',
      pt: 'Obrigado — recebemos o seu pedido de consulta ambulatória.', nl: 'Dank u wel — uw aanvraag voor een poliklinisch consult is ontvangen.',
      ru: 'Спасибо — ваш запрос на амбулаторный приём получен.', ar: 'شكرًا لك — تم استلام طلب العيادة الخارجية الخاص بك.',
      zh: '谢谢——我们已收到您的门诊咨询请求。', ja: 'ありがとうございます。外来診療のお申し込みを受け付けました。',
      ko: '감사합니다. 외래 진료 요청이 접수되었습니다.'
    }
  };
  var contactIntro = {
    en: 'Please complete your name, country code, phone number and email. The other fields are optional.',
    hi: 'कृपया अपना नाम, देश कोड, फ़ोन नंबर और ईमेल भरें। बाकी फ़ील्ड वैकल्पिक हैं।',
    de: 'Bitte geben Sie Ihren Namen, die Ländervorwahl, Ihre Telefonnummer und Ihre E-Mail-Adresse an. Die übrigen Felder sind optional.',
    fr: 'Veuillez indiquer votre nom, l’indicatif du pays, votre numéro de téléphone et votre adresse e-mail. Les autres champs sont facultatifs.',
    es: 'Indique su nombre, prefijo del país, número de teléfono y correo electrónico. Los demás campos son opcionales.',
    it: 'Inserisci nome, prefisso internazionale, numero di telefono e indirizzo e-mail. Gli altri campi sono facoltativi.',
    pt: 'Indique o seu nome, indicativo do país, número de telefone e e-mail. Os restantes campos são opcionais.',
    nl: 'Vul uw naam, landcode, telefoonnummer en e-mailadres in. De overige velden zijn optioneel.',
    ru: 'Укажите имя, код страны, номер телефона и адрес электронной почты. Остальные поля необязательны.',
    ar: 'يرجى إدخال الاسم ورمز الدولة ورقم الهاتف والبريد الإلكتروني. الحقول الأخرى اختيارية.',
    zh: '请填写您的姓名、国家代码、电话号码和电子邮箱。其他字段为选填。',
    ja: 'お名前、国番号、電話番号、メールアドレスを入力してください。その他の項目は任意です。',
    ko: '이름, 국가 코드, 전화번호, 이메일을 입력해 주세요. 나머지 항목은 선택 사항입니다.'
  };
  var countryCodeError = {
    en: 'Please enter a country code.', hi: 'कृपया देश कोड दर्ज करें।',
    de: 'Bitte geben Sie eine Ländervorwahl ein.', fr: 'Veuillez saisir un indicatif de pays.',
    es: 'Introduzca un prefijo de país.', it: 'Inserisci un prefisso internazionale.',
    pt: 'Indique um indicativo do país.', nl: 'Vul een landcode in.',
    ru: 'Укажите код страны.', ar: 'يرجى إدخال رمز الدولة.',
    zh: '请输入国家代码。', ja: '国番号を入力してください。', ko: '국가 코드를 입력해 주세요.'
  };
  // Persist stable values while the released datasets supply translated labels.
  var canonicalOptions = {
    programme: ['', 'Planning a treatment programme', 'Online physician consultation', 'I’m a current / returning patient',
      'Booking & reservations', 'Travel trade / partnership', 'Media / press', 'Something else'],
    gender: ['Male', 'Female'],
    'radio-448': ['Yes', 'No'],
    duration: ['< 1 month', '1–6 months', '6–12 months', 'Over a year'],
    who: ['Myself', 'A family member'],
    lang: ['English', 'हिन्दी'],
    time: ['Morning', 'Afternoon', 'Evening', 'Any time']
  };
  function canonicalOption(field, index, fallback) {
    var list = canonicalOptions[field];
    return list && index >= 0 && index < list.length ? list[index] : fallback;
  }
  function language() {
    // Chrome Translate can rewrite <html lang>; released route prefixes are stable.
    var match = /^\/(hi|de|fr|es|it|pt|nl|ru|ar|zh|ja|ko)(?:\/|$)/.exec(location.pathname);
    if (match) return match[1];
    return location.pathname === '/lp/behandlung-in-kerala/' ? 'de' : 'en';
  }
  function attribution() {
    var bridge = window.AHV_MEASUREMENT;
    if (bridge && typeof bridge.attribution === 'function') return bridge.attribution();
    var incoming = new URLSearchParams(location.search), result = {};
    ['gclid', 'gbraid', 'wbraid', 'fbclid', 'utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'utm_term'].forEach(function (name) {
      var pattern = name.indexOf('utm_') === 0 ? /^[a-zA-Z0-9_.~ &-]{1,120}$/ : /^[a-zA-Z0-9_.~-]{1,120}$/;
      var value = incoming.getAll(name).find(function (candidate) { return pattern.test(candidate); });
      if (value) result[name] = value;
    });
    return result;
  }
  function localize(base, lang) {
    if (lang === 'en') return base;
    if (lang === 'fr' && base === '/thanks/') return '/fr/remerciers/';
    return '/' + lang + base;
  }
  function targetFor(form, lang) {
    var base = targets[form];
    return base ? localize(base, lang) : null;
  }
  function retiredFor(item, path) {
    return Object.prototype.hasOwnProperty.call(retired, item.form) && typeof item.lang === 'string' &&
      /^(en|hi|de|fr|es|it|pt|nl|ru|ar|zh|ja|ko)$/.test(item.lang) &&
      item.path === localize(retired[item.form], item.lang) && path === targetFor(item.form, item.lang);
  }
  function receiptKind(form) { return form === 'apply-now' ? 'application' : form === 'opd' ? 'opd' : form; }
  async function submission(init) {
    try {
      var body = init && init.body;
      if (typeof body !== 'string') body = body && typeof body.text === 'function' ? await body.text() : '';
      var data = JSON.parse(body);
      if (!data || !Object.prototype.hasOwnProperty.call(targets, data.form) ||
          !/^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(String(data.submissionToken || ''))) return null;
      return { form: data.form, token: data.submissionToken };
    } catch (_) { return null; }
  }
  function consume(path) {
    if (active) {
      if (active.path === path) return active;
      active = null;
      return null;
    }
    try {
      var raw = sessionStorage.getItem(key);
      if (!raw) return null;
      sessionStorage.removeItem(key);
      var item = JSON.parse(raw);
      if (item && (item.path === path || retiredFor(item, path)) && typeof item.at === 'number' &&
          Date.now() >= item.at && Date.now() - item.at < ttl &&
          typeof item.token === 'string' && /^[0-9a-f-]{36}$/i.test(item.token) &&
          Object.prototype.hasOwnProperty.call(targets, item.form)) {
        // Keep the original token and time; only the page it is bound to moves.
        active = item.path === path ? item : Object.assign({}, item, { path: path });
      }
    } catch (_) { return null; }
    return active;
  }
  function personalize(route, item, images) {
    if (!route || !item || (item.form !== 'apply-now' && item.form !== 'opd')) return route;
    var kind = receiptKind(item.form);
    var heading = received[kind][item.lang] || received[kind].en;
    return Object.assign({}, route, {
      variant: 'image-receipt',
      h1: heading,
      metadata: Object.assign({}, route.metadata, {
        title: heading,
        description: heading,
        og: Object.assign({}, route.metadata.og, { title: heading, description: heading })
      }),
      posterImage: images && images.landscape1024,
      body: null,
      transcript: null
    });
  }
  window.AHV_LEAD_RECEIPT = {
    attribution: attribution,
    consume: consume,
    current: function () { return active && active.path === location.pathname ? active : null; },
    personalize: personalize,
    contactIntro: function () { return contactIntro[language()]; },
    countryCodeError: function () { return countryCodeError[language()]; },
    siteLanguage: function () { var lang = language(); return lang === 'zh' ? 'zh-Hans' : lang; },
    canonicalOption: canonicalOption
  };
  if (typeof originalFetch !== 'function') return;
  window.fetch = async function (input, init) {
    var response = await originalFetch.apply(this, arguments);
    try {
      var url = new URL(typeof input === 'string' ? input : input.url, location.href);
      if (pending || url.origin !== location.origin || url.pathname !== '/api/lead/' ||
          String(init && init.method || 'GET').toUpperCase() !== 'POST' || response.status !== 200) return response;
      var request = await submission(init);
      if (!request) return response;
      var result = await response.clone().json();
      if (!result || result.ok !== true || result.status !== 'received') return response;
      // Only the accepted API response can dispatch a lead event. A direct or
      // refreshed thank-you page has no call path to this method.
      try {
        if (window.AHV_MEASUREMENT) window.AHV_MEASUREMENT.recordLead(request.form, request.token);
      } catch (_) { /* Measurement must never change form delivery or receipt UI. */ }
      var lang = language();
      var path = targetFor(request.form, lang);
      if (!path) return response;
      var item = { form: request.form, token: request.token, lang: lang, path: path, at: Date.now() };
      sessionStorage.setItem(key, JSON.stringify(item));
      pending = true;
      // Let the original form handler finish reading the response and offering its guide PDF.
      setTimeout(function () { location.assign(path); }, 350);
    } catch (_) { /* Storage or observation failure leaves the form's existing inline receipt intact. */ }
    return response;
  };
})();
