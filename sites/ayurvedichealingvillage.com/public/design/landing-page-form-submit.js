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
  function captchaValid(form, fd) {
    var control = form.elements.namedItem('result');
    if (!control) return true;
    var label = control.closest ? control.closest('label') : null;
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
    setStatus(record, 'Sending…');

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
        setStatus(record, 'Thank you — your details have been received.');
        if (typeof data.guideUrl === 'string' && data.guideUrl.charAt(0) === '/') {
          var guide = document.createElement('a');
          guide.href = data.guideUrl; guide.download = ''; guide.hidden = true;
          document.body.appendChild(guide); guide.click(); guide.remove();
        }
        document.querySelectorAll('form').forEach(function (current) { if (isLandingForm(current) && keyFor(current) === keyFor(form)) current.reset(); });
        record.token = null; record.fields = [];
      } else if (response.status === 503 && /_NOT_CONFIGURED$/.test(String(data.code || ''))) {
        setStatus(record, 'This form is not connected yet. Nothing has been saved or sent. Please email info@kairali.com or WhatsApp +91 92898 38797.');
      } else if (response.status === 429) {
        setStatus(record, 'Please wait before trying again. Your details are still in the form.');
      } else {
        setStatus(record, 'We could not confirm this was received. Your details are still here; please try again.');
      }
    } catch (_) {
      setStatus(record, 'We could not confirm this was received. Please check your connection and try again.');
    } finally {
      clearTimeout(timeout);
      record.busy = false; refreshRecords();
    }
  }, true);
})();
