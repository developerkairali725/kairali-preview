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
    '/kairali-air-india-maharaja-club.html',
    '/kairali-cleansing-centre.html',
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
  if (!routes.has(window.location.pathname)) return;

  var tokens = new WeakMap();
  function isLandingForm(form) {
    return !!(form && form.elements && form.elements.namedItem('email') &&
      (form.elements.namedItem('fname') || form.elements.namedItem('phone')));
  }
  function statusFor(form) {
    var status = form.querySelector('.ahv-landing-status');
    if (!status) {
      status = document.createElement('p');
      status.className = 'ahv-landing-status';
      status.setAttribute('role', 'status');
      status.setAttribute('aria-live', 'polite');
      form.appendChild(status);
    }
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
    if (isLandingForm(form) && form.getAttribute('aria-busy') !== 'true') tokens.delete(form);
  }, true);
  document.addEventListener('change', function (event) {
    var form = event.target && event.target.form;
    if (isLandingForm(form) && form.getAttribute('aria-busy') !== 'true') tokens.delete(form);
  }, true);

  document.addEventListener('submit', async function (event) {
    var form = event.target;
    if (!isLandingForm(form)) return;
    event.preventDefault();
    event.stopImmediatePropagation();
    if (form.getAttribute('aria-busy') === 'true') return;
    var status = statusFor(form);
    var fd = new FormData(form);
    if (!form.reportValidity()) return;
    if (!captchaValid(form, fd)) {
      status.textContent = 'Please check the sum before submitting.';
      var result = form.elements.namedItem('result');
      if (result && result.focus) result.focus();
      return;
    }

    var button = form.querySelector('button[type="submit"], input[type="submit"]');
    var query = new URLSearchParams(window.location.search);
    var controller = new AbortController();
    var timeout = setTimeout(function () { controller.abort(); }, 10000);
    var token = tokens.get(form) || crypto.randomUUID();
    tokens.set(form, token);
    form.setAttribute('aria-busy', 'true');
    if (button) button.disabled = true;
    status.textContent = 'Sending…';

    try {
      var response = await fetch('/api/lead/', {
        method: 'POST', credentials: 'same-origin', cache: 'no-store',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({
          form: 'landing-page',
          submissionToken: token,
          site_language: document.documentElement.lang || 'en',
          lead_source_url: window.location.href,
          referrer: document.referrer,
          utm_source: value(fd, 'utm_source') || query.get('utm_source') || '',
          utm_medium: value(fd, 'utm_medium') || query.get('utm_medium') || '',
          utm_campaign: value(fd, 'utm_campaign') || query.get('utm_campaign') || '',
          utm_content: value(fd, 'utm_content') || query.get('utm_content') || '',
          utm_term: query.get('utm_term') || query.get('utm_keyword') || '',
          fields: {
            landing_page_path: window.location.pathname,
            form_variant: form.getAttribute('data-recorded-id') || form.id || 'campaign',
            fname: value(fd, 'fname') || value(fd, 'fullName'), lname: value(fd, 'lname'),
            rdogender: value(fd, 'rdogender'), phone: value(fd, 'phone'),
            email: value(fd, 'email'), country: value(fd, 'country'),
            duration: value(fd, 'duration'), message: value(fd, 'message'),
            consent: !!fd.get('chkAgree') || !!fd.get('consent'),
            track_id: value(fd, 'hdntrackid'), campaign_name: value(fd, 'hdncampionname'),
            utm_keyword: value(fd, 'utm_keyword') || query.get('utm_keyword') || '',
          },
        }),
        signal: controller.signal,
      });
      var data = await response.json().catch(function () { return {}; });
      if (response.ok && data.ok === true) {
        status.textContent = 'Thank you — your details have been received.';
        if (typeof data.guideUrl === 'string' && data.guideUrl.charAt(0) === '/') {
          var guide = document.createElement('a');
          guide.href = data.guideUrl; guide.download = ''; guide.hidden = true;
          document.body.appendChild(guide); guide.click(); guide.remove();
        }
        form.reset();
        tokens.delete(form);
      } else if (response.status === 503 && /_NOT_CONFIGURED$/.test(String(data.code || ''))) {
        status.textContent = 'This form is not connected yet. Nothing has been saved or sent. Please email info@kairali.com or WhatsApp +91 92898 38797.';
      } else if (response.status === 429) {
        status.textContent = 'Please wait before trying again. Your details are still in the form.';
      } else {
        status.textContent = 'We could not confirm this was received. Your details are still here; please try again.';
      }
    } catch (_) {
      status.textContent = 'We could not confirm this was received. Please check your connection and try again.';
    } finally {
      clearTimeout(timeout);
      form.removeAttribute('aria-busy');
      if (button) button.disabled = false;
    }
  }, true);
})();
