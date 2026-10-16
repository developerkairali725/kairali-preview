/* Shared delivery for the 17 existing campaign/landing routes. The script is
   inert everywhere else and only claims receipt after /api/lead confirms that
   the row was stored; while /api/lead is not configured (503 *_NOT_CONFIGURED)
   it says so and claims nothing. Existing field names and browser validation
   stay intact. The rebuilt campaign short form names its name field fullName,
   the legacy captures fname: both land in the fname column. */
(function () {
  if (window.__ahvLandingFormsBound) return;
  window.__ahvLandingFormsBound = true;

  var routes = new Set([
    '/Ayurveda_Treatment_Neo_S.India_Cities.html',
    '/Kairali_Brand_and_Competition_Neo-original.html',
    '/ayurveda-retreat-kerala.html',
    '/ayurvedic-treatment-packages.html',
    '/family-ayurvedic-retreat-kerala.html',
    '/kairali-cleansing-centre.html',
    '/kairali-air-india-maharaja-club.html',
    '/offers/defence-paramilitary-personnel-get-upto-30-off/',
    '/offers/new/',
    '/offers/olympics-and-paralympics-offer/',
    '/offers/senior-citizen-offer/',
    '/pain-management.html',
    '/panchkarma-treatment.html',
    '/preventive-rejuvenation-detoxification.html',
    '/treatment-in-kerala.html',
    '/weight-loss.html',
    '/wellness-resort-kerala.html',
  ]);
  var host = document.getElementById('ahv-design-root');
  var canonicalRoute = host && host.getAttribute('data-ahv-route') || window.location.pathname;
  if (!routes.has(canonicalRoute)) return;

  var records = new Map();
  function keyFor(form) { return form.getAttribute('data-recorded-id') || form.id || 'campaign'; }
  function recordFor(form) {
    var key = keyFor(form);
    if (!records.has(key)) records.set(key, { text: '', busy: false, token: null, form: null, fields: [] });
    return records.get(key);
  }
  function applyRecord(form, record) {
    if (record.form && record.form !== form) {
      record.fields.forEach(function (field) {
        var control = form.elements.namedItem(field.name);
        if (!control || !('value' in control)) return;
        if (control.type === 'checkbox' || control.type === 'radio') control.checked = field.checked;
        else control.value = field.value;
      });
      record.form = form;
    }
    var status = statusFor(form);
    if (status.textContent !== record.text) status.textContent = record.text;
    if (record.busy && form.getAttribute('aria-busy') !== 'true') form.setAttribute('aria-busy', 'true');
    if (!record.busy && form.hasAttribute('aria-busy')) form.removeAttribute('aria-busy');
    var button = form.querySelector('button[type="submit"], input[type="submit"]');
    if (button && button.disabled !== record.busy) button.disabled = record.busy;
  }
  function refreshRecords() {
    document.querySelectorAll('form').forEach(function (form) {
      if (isLandingForm(form) && records.has(keyFor(form))) applyRecord(form, records.get(keyFor(form)));
    });
  }
  // A reader can submit the crawlable snapshot before the live view mounts.
  // Carry pending/receipt state to its replacement, with idempotent DOM writes.
  if (host && window.MutationObserver) {
    var queued = false;
    new MutationObserver(function () {
      if (queued || !records.size) return;
      queued = true;
      queueMicrotask(function () { queued = false; refreshRecords(); });
    }).observe(host, { childList: true, subtree: true });
  }
  function setStatus(record, text) { record.text = text; refreshRecords(); }
  // Owner decision 14 Oct 2026: name and email are required, phone stays optional.
  // The localized packages views shipped fname/email without `required`; restore
  // it on the visitor's submit (never at load: the crawlable body stays untouched).
  function requireContact(form) {
    ['fname', 'fullName', 'email'].forEach(function (name) {
      var control = form.elements.namedItem(name);
      if (control && control.type !== 'hidden' && 'required' in control && !control.required) control.required = true;
    });
  }
  // Status lines in the page language. Each translation is the approved l10n
  // catalogue entry (l10n/generated/<locale>.catalog.json, unit id noted) that
  // public/design/opd-form-submit.js already ships for the identical English
  // source. The sum prompt has no approved translation and stays English.
  var messages = {
    // t_b8ed5279e897be5def6b
    sending: {
      en: 'Sending…',
      hi: 'भेजा जा रहा है…',
      de: 'Wird gesendet…',
      fr: 'Envoi en cours…',
      es: 'Enviando…',
      it: 'Invio in corso…',
      pt: 'A enviar…',
      nl: 'Bezig met verzenden…',
      ru: 'Отправка…',
      ar: 'جارٍ الإرسال…',
      'zh-Hans': '正在发送…',
      ja: '送信中…',
      ko: '전송 중…'
    },
    // t_3650d5e9945fc68d0990
    received: {
      en: 'Thank you — your details have been received.',
      hi: 'धन्यवाद — आपका विवरण प्राप्त हो गया है।',
      de: 'Vielen Dank — Ihre Angaben sind eingegangen.',
      fr: 'Merci — vos informations ont bien été reçues.',
      es: 'Gracias — hemos recibido sus datos.',
      it: 'Grazie — abbiamo ricevuto i Suoi dati.',
      pt: 'Obrigado — os seus dados foram recebidos.',
      nl: 'Dank u — uw gegevens zijn ontvangen.',
      ru: 'Спасибо — ваши данные получены.',
      ar: 'شكرًا لك — تم استلام بياناتك.',
      'zh-Hans': '感谢您——您的信息已收到。',
      ja: 'ありがとうございます。ご入力内容を受け付けました。',
      ko: '감사합니다. 입력하신 정보가 접수되었습니다.'
    },
    // t_ded0496cf709b40c792f
    notConnected: {
      en: 'This form is not connected yet. Nothing has been saved or sent. Please email info@kairali.com or WhatsApp +91 92898 38797.',
      hi: 'यह फ़ॉर्म अभी कनेक्ट नहीं है। कुछ भी सहेजा या भेजा नहीं गया है। कृपया info@kairali.com पर ईमेल करें या +91 92898 38797 पर WhatsApp करें।',
      de: 'Dieses Formular ist noch nicht verbunden. Es wurde nichts gespeichert oder gesendet. Bitte schreiben Sie an info@kairali.com oder per WhatsApp an +91 92898 38797.',
      fr: 'Ce formulaire n’est pas encore connecté. Rien n’a été enregistré ni envoyé. Veuillez écrire à info@kairali.com ou sur WhatsApp au +91 92898 38797.',
      es: 'Este formulario aún no está conectado. No se ha guardado ni enviado nada. Escriba a info@kairali.com o por WhatsApp al +91 92898 38797.',
      it: 'Questo modulo non è ancora collegato. Nulla è stato salvato o inviato. Scriva a info@kairali.com o su WhatsApp al +91 92898 38797.',
      pt: 'Este formulário ainda não está ligado. Nada foi guardado nem enviado. Envie um email para info@kairali.com ou uma mensagem por WhatsApp para +91 92898 38797.',
      nl: 'Dit formulier is nog niet gekoppeld. Er is niets opgeslagen of verzonden. Mail naar info@kairali.com of stuur een WhatsApp-bericht naar +91 92898 38797.',
      ru: 'Эта форма пока не подключена. Ничего не сохранено и не отправлено. Пожалуйста, напишите на info@kairali.com или в WhatsApp по номеру +91 92898 38797.',
      ar: 'لم يتم ربط هذا النموذج بعد. لم يُحفظ أو يُرسل أي شيء. يُرجى مراسلتنا عبر البريد الإلكتروني info@kairali.com أو عبر WhatsApp على الرقم +91 92898 38797.',
      'zh-Hans': '此表单尚未接通。您的信息未被保存或发送。请发送电子邮件至 info@kairali.com，或通过 WhatsApp 联系 +91 92898 38797。',
      ja: 'このフォームはまだ接続されていません。情報は保存も送信もされていません。info@kairali.com までメールいただくか、WhatsApp（+91 92898 38797）でご連絡ください。',
      ko: '이 양식은 아직 연결되지 않았습니다. 저장되거나 전송된 내용은 없습니다. info@kairali.com으로 이메일을 보내시거나 WhatsApp(+91 92898 38797)으로 연락해 주십시오.'
    },
    // t_80a8d713c881aeb9738a
    wait: {
      en: 'Please wait before trying again. Your details are still in the form.',
      hi: 'कृपया दोबारा प्रयास करने से पहले कुछ देर प्रतीक्षा करें। आपका विवरण अभी भी फ़ॉर्म में है।',
      de: 'Bitte warten Sie kurz, bevor Sie es erneut versuchen. Ihre Angaben sind noch im Formular.',
      fr: 'Veuillez patienter avant de réessayer. Vos informations sont toujours dans le formulaire.',
      es: 'Espere un momento antes de volver a intentarlo. Sus datos siguen en el formulario.',
      it: 'Attenda prima di riprovare. I Suoi dati sono ancora nel modulo.',
      pt: 'Aguarde antes de tentar novamente. Os seus dados continuam no formulário.',
      nl: 'Wacht even voordat u het opnieuw probeert. Uw gegevens staan nog in het formulier.',
      ru: 'Пожалуйста, подождите, прежде чем повторить попытку. Ваши данные по-прежнему в форме.',
      ar: 'يُرجى الانتظار قليلًا قبل المحاولة مرة أخرى. لا تزال بياناتك في النموذج.',
      'zh-Hans': '请稍候再试。您填写的信息仍保留在表单中。',
      ja: 'しばらく待ってから再度お試しください。入力内容はフォームにそのまま残っています。',
      ko: '잠시 후 다시 시도해 주십시오. 입력하신 정보는 양식에 그대로 남아 있습니다.'
    },
    // t_abef53c4287fbd78b3cf
    retry: {
      en: 'We could not confirm this was received. Your details are still here; please try again.',
      hi: 'हम इसके प्राप्त होने की पुष्टि नहीं कर सके। आपका विवरण अभी भी यहाँ है; कृपया फिर से प्रयास करें।',
      de: 'Wir konnten den Eingang nicht bestätigen. Ihre Angaben sind noch vorhanden; bitte versuchen Sie es erneut.',
      fr: 'Nous n’avons pas pu confirmer la réception. Vos informations sont toujours là ; veuillez réessayer.',
      es: 'No pudimos confirmar la recepción. Sus datos siguen aquí; inténtelo de nuevo.',
      it: 'Non è stato possibile confermare la ricezione. I Suoi dati sono ancora qui; riprovi.',
      pt: 'Não foi possível confirmar a receção. Os seus dados continuam aqui; tente novamente.',
      nl: 'We konden niet bevestigen dat dit is ontvangen. Uw gegevens staan er nog; probeer het opnieuw.',
      ru: 'Нам не удалось подтвердить получение. Ваши данные по-прежнему здесь; пожалуйста, попробуйте ещё раз.',
      ar: 'تعذّر علينا تأكيد الاستلام. لا تزال بياناتك هنا؛ يُرجى المحاولة مرة أخرى.',
      'zh-Hans': '我们无法确认是否已收到。您填写的信息仍保留在此，请重试。',
      ja: '受信を確認できませんでした。入力内容はそのまま残っていますので、もう一度お試しください。',
      ko: '접수 여부를 확인하지 못했습니다. 입력하신 정보는 그대로 남아 있으니 다시 시도해 주십시오.'
    },
    // t_dff59aa7ac928816916a
    offline: {
      en: 'We could not confirm this was received. Please check your connection and try again.',
      hi: 'हम इसके प्राप्त होने की पुष्टि नहीं कर सके। कृपया अपना कनेक्शन जाँचें और फिर से प्रयास करें।',
      de: 'Wir konnten den Eingang nicht bestätigen. Bitte prüfen Sie Ihre Verbindung und versuchen Sie es erneut.',
      fr: 'Nous n’avons pas pu confirmer la réception. Veuillez vérifier votre connexion et réessayer.',
      es: 'No pudimos confirmar la recepción. Compruebe su conexión e inténtelo de nuevo.',
      it: 'Non è stato possibile confermare la ricezione. Verifichi la connessione e riprovi.',
      pt: 'Não foi possível confirmar a receção. Verifique a sua ligação e tente novamente.',
      nl: 'We konden niet bevestigen dat dit is ontvangen. Controleer uw verbinding en probeer het opnieuw.',
      ru: 'Нам не удалось подтвердить получение. Пожалуйста, проверьте подключение и попробуйте ещё раз.',
      ar: 'تعذّر علينا تأكيد الاستلام. يُرجى التحقّق من اتصالك والمحاولة مرة أخرى.',
      'zh-Hans': '我们无法确认是否已收到。请检查网络连接后重试。',
      ja: '受信を確認できませんでした。インターネット接続をご確認のうえ、もう一度お試しください。',
      ko: '접수 여부를 확인하지 못했습니다. 인터넷 연결을 확인하신 후 다시 시도해 주십시오.'
    }
  };
  function say(key) {
    var lang = 'en';
    try { lang = window.AHV_LEAD_RECEIPT.siteLanguage(); } catch (_) { lang = 'en'; }
    return messages[key][lang] || messages[key].en;
  }
  function isLandingForm(form) {
    return !!(form && form.elements && form.elements.namedItem('email') &&
      (form.elements.namedItem('fname') || form.elements.namedItem('phone')));
  }
  function statusFor(form) {
    var status = form.querySelector('.ahv-landing-status, p[aria-live="polite"]');
    if (!status) {
      status = document.createElement('p');
      status.className = 'ahv-landing-status';
      status.setAttribute('role', 'status');
      status.setAttribute('aria-live', 'polite');
      form.appendChild(status);
    }
    if (!status.classList.contains('ahv-landing-status')) status.classList.add('ahv-landing-status');
    return status;
  }
  function value(fd, name) { return (fd.get(name) || '').toString().trim(); }
  // The sum lives in the field's label. The legacy views wrap the input in it; the
  // localized /xx/ayurvedic-treatment-packages.html views put <label for="txtResult">
  // before input#txtResult, so an ancestor-only lookup rejected every correct sum
  // there (AHV-Q01, 15 Oct 2026). Ancestor first (unchanged), then the for/id label.
  function labelFor(control, form) {
    var label = control.closest ? control.closest('label') : null;
    if (label) return label;
    if (control.labels && control.labels.length) return control.labels[0];
    var id = control.id;
    if (!id || !form.querySelectorAll) return null;
    var labels = form.querySelectorAll('label[for]');
    for (var i = 0; i < labels.length; i++) if (labels[i].getAttribute('for') === id) return labels[i];
    return null;
  }
  function captchaValid(form, fd) {
    var control = form.elements.namedItem('result');
    if (!control) return true;
    var label = labelFor(control, form);
    var text = label ? label.textContent : '';
    var sum = text && text.match(/(\d+)\s*\+\s*(\d+)/);
    if (!sum) return false;
    return Number(value(fd, 'result')) === Number(sum[1]) + Number(sum[2]);
  }

  document.addEventListener('input', function (event) {
    var form = event.target && event.target.form;
    if (isLandingForm(form) && !recordFor(form).busy) { var record = recordFor(form); record.token = null; record.text = ''; refreshRecords(); }
  }, true);
  document.addEventListener('change', function (event) {
    var form = event.target && event.target.form;
    if (isLandingForm(form) && !recordFor(form).busy) { var record = recordFor(form); record.token = null; record.text = ''; refreshRecords(); }
  }, true);

  document.addEventListener('submit', async function (event) {
    var form = event.target;
    if (!isLandingForm(form)) return;
    event.preventDefault();
    event.stopImmediatePropagation();
    var record = recordFor(form);
    if (record.busy) return;
    var status = statusFor(form);
    var fd = new FormData(form);
    record.form = form;
    record.fields = Array.from(form.elements).filter(function (control) { return !!control.name && 'value' in control; }).map(function (control) { return { name: control.name, value: control.value, checked: control.checked }; });
    var airIndia = canonicalRoute === '/kairali-air-india-maharaja-club.html';
    requireContact(form);
    if (!form.reportValidity()) return;
    if (!captchaValid(form, fd)) {
      setStatus(record, 'Please check the sum before submitting.');
      var result = form.elements.namedItem('result');
      if (result && result.focus) result.focus();
      return;
    }

    var button = form.querySelector('button[type="submit"], input[type="submit"]');
    var campaign = window.AHV_LEAD_RECEIPT.attribution();
    var keyword = new URLSearchParams(window.location.search).getAll('utm_keyword').find(function (v) { return /^[a-zA-Z0-9_.~ &-]{1,120}$/.test(v); }) || '';
    var controller = new AbortController();
    var timeout = setTimeout(function () { controller.abort(); }, 10000);
    var token = record.token || crypto.randomUUID();
    record.token = token; record.busy = true;
    setStatus(record, say('sending'));

    try {
      var response = await fetch('/api/lead/', {
        method: 'POST', credentials: 'same-origin', cache: 'no-store',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({
          form: 'landing-page',
          submissionToken: token,
          site_language: window.AHV_LEAD_RECEIPT.siteLanguage(),
          lead_source_url: window.location.href,
          referrer: document.referrer,
          utm_source: campaign.utm_source || value(fd, 'utm_source') || '',
          utm_medium: campaign.utm_medium || value(fd, 'utm_medium') || '',
          utm_campaign: campaign.utm_campaign || value(fd, 'utm_campaign') || '',
          utm_content: campaign.utm_content || value(fd, 'utm_content') || '',
          utm_term: campaign.utm_term || keyword,
          gclid: campaign.gclid || '', fbclid: campaign.fbclid || '',
          gbraid: campaign.gbraid || '', wbraid: campaign.wbraid || '',
          fields: {
            landing_page_path: window.location.pathname,
            form_variant: form.getAttribute('data-recorded-id') || form.id || 'campaign',
            fname: value(fd, 'fname') || value(fd, 'fullName'), lname: value(fd, 'lname'),
            rdogender: value(fd, 'rdogender'), phone: value(fd, 'phone'),
            email: value(fd, 'email'), country: airIndia ? '' : value(fd, 'country'),
            duration: value(fd, 'duration'), message: airIndia
              ? 'Air India Maharaja Club membership number: ' + value(fd, 'membership_number') + '\nPreferred date: ' + value(fd, 'country') + '\nProgramme interest: ' + value(fd, 'message')
              : value(fd, 'message'),
            consent: !!fd.get('chkAgree') || !!fd.get('consent'),
            track_id: value(fd, 'hdntrackid'), campaign_name: value(fd, 'hdncampionname'),
            utm_keyword: value(fd, 'utm_keyword') || keyword,
          },
        }),
        signal: controller.signal,
      });
      var data = await response.json().catch(function () { return {}; });
      if (response.ok && data.ok === true) {
        setStatus(record, say('received'));
        if (typeof data.guideUrl === 'string' && data.guideUrl.charAt(0) === '/') {
          var guide = document.createElement('a');
          guide.href = data.guideUrl; guide.download = ''; guide.hidden = true;
          document.body.appendChild(guide); guide.click(); guide.remove();
        }
        document.querySelectorAll('form').forEach(function (current) { if (isLandingForm(current) && keyFor(current) === keyFor(form)) current.reset(); });
        record.token = null; record.fields = [];
      } else if (response.status === 503 && /_NOT_CONFIGURED$/.test(String(data.code || ''))) {
        setStatus(record, say('notConnected'));
      } else if (response.status === 429) {
        setStatus(record, say('wait'));
      } else {
        setStatus(record, say('retry'));
      }
    } catch (_) {
      setStatus(record, say('offline'));
    } finally {
      clearTimeout(timeout);
      record.busy = false; refreshRecords();
    }
  }, true);
})();
