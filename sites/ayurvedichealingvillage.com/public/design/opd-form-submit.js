/* Walk-in Ayurveda Treatment (OPD) intake — the one "legacy-enquiry" variant
   page that is a live destination (contact-us-old / enquiry-form-old /
   online-consultation-old / postulez-maintenant are historical/untranslated
   snapshots and are deliberately left untouched). This overrides the inert
   legacy React submit notice, mirroring the newsletter.js pattern: a
   small, page-scoped progressive-enhancement listener alongside the shared
   family logic, not inside it. boot.ts's capture-phase submit guard already
   preventDefaults every non-search form; this only adds the real behaviour
   on top, exactly like every other wired variant does for itself. */
(function () {
  // Released OPD equivalents from l10n/routes.json; other legacy forms stay inert.
  function opdLanguage(pathname) {
    var match = /^\/(?:(hi|de|fr|es|it|pt|nl|ru|ar|zh|ja|ko)\/)?walk-in-ayurveda-treatment\/?$/.exec(pathname);
    return match ? (match[1] === 'zh' ? 'zh-Hans' : match[1] || 'en') : null;
  }
  if (!opdLanguage(window.location.pathname) || window.__ahvOpdBound) return;
  window.__ahvOpdBound = true;

  var submissionToken = null;

  document.addEventListener('input', function (event) {
    var form = event.target && event.target.form;
    if (form && form.elements.namedItem('fname') && form.elements.namedItem('symptoms') && form.getAttribute('aria-busy') !== 'true') {
      submissionToken = null;
    }
  }, true);

  document.addEventListener('submit', async function (event) {
    var locale = opdLanguage(window.location.pathname);
    if (!locale) return;
    var form = event.target;
    if (!form || !form.matches || !form.matches('form')) return;
    if (!form.elements.namedItem('fname') || !form.elements.namedItem('symptoms')) return;
    event.preventDefault();
    // The shared legacy view must not overwrite this handler's real receipt/error.
    event.__ahvOpdHandled = true;
    if (form.getAttribute('aria-busy') === 'true') return;
    var fd = new FormData(form);
    var email = (fd.get('email') || '').toString().trim();
    var phone = (fd.get('phone') || '').toString().trim();
    var status = form.querySelector('.ahv-opd-status');
    if (!status) {
      status = document.createElement('p');
      status.className = 'ahv-opd-status';
      status.setAttribute('role', 'status');
      status.setAttribute('aria-live', 'polite');
      form.appendChild(status);
    }
    if (!form.reportValidity()) return;
    var requiredNames = ['fname', 'age', 'gender', 'phone', 'symptoms'];
    var missing = requiredNames.find(function (name) { return !(fd.get(name) || '').toString().trim(); });
    if (missing || !fd.get('functional-history[]')) {
      status.textContent = 'Please complete the required fields and consent before submitting.';
      var invalid = form.elements.namedItem(missing || 'functional-history[]');
      if (invalid && invalid.focus) invalid.focus();
      return;
    }
    var button = form.querySelector('button[type="submit"], input[type="submit"]');
    var query = new URLSearchParams(window.location.search);
    var controller = new AbortController();
    var timeout = setTimeout(function () { controller.abort(); }, 10000);
    form.setAttribute('aria-busy', 'true');
    if (button) button.disabled = true;
    status.textContent = 'Sending…';
    if (!submissionToken) submissionToken = crypto.randomUUID();
    try {
      var response = await fetch('/api/lead/', {
        method: 'POST', credentials: 'same-origin', cache: 'no-store',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({
          form: 'opd',
          submissionToken: submissionToken,
          site_language: locale,
          lead_source_url: window.location.href,
          referrer: document.referrer,
          utm_source: fd.get('utm_source') || query.get('utm_source') || '',
          utm_medium: fd.get('utm_medium') || query.get('utm_medium') || '',
          utm_campaign: fd.get('utm_campaign') || query.get('utm_campaign') || '',
          utm_content: fd.get('utm_content') || query.get('utm_content') || '',
          utm_term: query.get('utm_term') || '',
          gclid: query.get('gclid') || '', fbclid: query.get('fbclid') || '',
          fields: {
            full_name: (fd.get('fname') || '').toString().trim(),
            age: (fd.get('age') || '').toString().trim(),
            gender: (fd.get('gender') || '').toString().trim(),
            phone: phone,
            email: email,
            address: (fd.get('address') || '').toString().trim(),
            symptoms: (fd.get('symptoms') || '').toString().trim(),
            preferred_doctor: (fd.get('preferred-doctor') || '').toString().trim(),
            consent: !!fd.get('functional-history[]'),
          },
        }), signal: controller.signal,
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
        submissionToken = null;
      } else if (response.status === 503 && /_NOT_CONFIGURED$/.test(String(data.code || ''))) {
        status.textContent = 'This form is not connected yet. Nothing has been saved or sent. Please email info@kairali.com or WhatsApp +91 92898 38797.';
      } else if (response.status === 429) {
        status.textContent = 'Please wait before trying again. Your details are still in the form.';
      } else {
        status.textContent = 'We could not confirm this was received. Your details are still here; please try again.';
      }
    } catch (_) {
      if (status) status.textContent = 'We could not confirm this was received. Please check your connection and try again.';
    } finally {
      clearTimeout(timeout);
      form.removeAttribute('aria-busy');
      if (button) button.disabled = false;
    }
  }, true);
})();
