/* Email-only signup UI. The dedicated server route owns validation and delivery.
   No email in URLs, browser storage, analytics or console output. */
(function () {
  if (window.__ahvNewsletterBound) return;
  window.__ahvNewsletterBound = true;

  // One id per filled-in form, reused on every retry of that same fill so a
  // double tap or a resubmit after a network error collides with the row
  // that already exists instead of creating a second one.
  var submissionToken = null;

  function trackingFromLocation() {
    var q;
    try { q = new URLSearchParams(window.location.search); } catch (_) { q = new URLSearchParams(); }
    var pick = function (k) { return (q.get(k) || '').slice(0, 190); };
    return {
      utm_source: pick('utm_source'),
      utm_medium: pick('utm_medium'),
      utm_campaign: pick('utm_campaign'),
      utm_content: pick('utm_content'),
      lead_source_url: window.location.href.slice(0, 500),
      referrer: (document.referrer || '').slice(0, 500),
    };
  }

  document.addEventListener('submit', async function (event) {
    var form = event.target;
    if (!form || !form.matches || !form.matches('form[data-ahv-newsletter]')) return;
    event.preventDefault();
    event.stopImmediatePropagation();
    if (form.getAttribute('aria-busy') === 'true') return;
    var email = form.elements.namedItem('email');
    email.required = true;
    email.value = email.value.trim();
    if (!form.reportValidity()) return;
    var button = form.querySelector('button[type="submit"]');
    var status = form.querySelector('.ahv-newsletter-status');
    var controller = new AbortController();
    var timeout = setTimeout(function () { controller.abort(); }, 10000);
    form.setAttribute('aria-busy', 'true');
    button.disabled = true;
    button.textContent = 'Subscribing…';
    status.textContent = '';
    try {
      if (!submissionToken) submissionToken = crypto.randomUUID();
      var tracking = trackingFromLocation();
      var response = await fetch('/api/newsletter', {
        method: 'POST', credentials: 'same-origin', cache: 'no-store',
        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
        body: JSON.stringify({
          email: email.value, consent: true, consentVersion: 'newsletter-2026-09-24',
          sourcePath: window.location.pathname, submissionToken: submissionToken,
          utm_source: tracking.utm_source, utm_medium: tracking.utm_medium,
          utm_campaign: tracking.utm_campaign, utm_content: tracking.utm_content,
          lead_source_url: tracking.lead_source_url, referrer: tracking.referrer,
        }),
        signal: controller.signal
      });
      var data = await response.json();
      if (response.ok && data.ok === true && data.status === 'subscribed') {
        status.textContent = 'Thank you — you are subscribed.';
        form.reset();
        submissionToken = null; // a later signup from this page is a new fill
      } else if (response.status === 503 && data.code === 'NEWSLETTER_NOT_CONFIGURED') {
        status.textContent = 'Newsletter signup is not connected yet. Nothing has been saved or sent. Please try again later.';
      } else if (response.status === 429) {
        status.textContent = 'Please wait a little before trying again. Your email is still here.';
      } else {
        status.textContent = 'We could not confirm your signup. Please check your email address and try again.';
      }
    } catch (_) {
      status.textContent = 'We could not confirm your signup. Check your connection and try again. Your email is still here.';
    } finally {
      clearTimeout(timeout);
      form.removeAttribute('aria-busy');
      button.disabled = false;
      button.textContent = 'Subscribe';
    }
  }, true);
})();
