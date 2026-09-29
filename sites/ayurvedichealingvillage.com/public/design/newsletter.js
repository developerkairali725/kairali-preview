/* Email-only signup UI. The dedicated server route owns validation and delivery.
   No email in URLs, browser storage, analytics or console output. */
(function () {
  if (window.__ahvNewsletterBound) return;
  window.__ahvNewsletterBound = true;
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
      var response = await fetch('/api/newsletter', {
        method: 'POST', credentials: 'same-origin', cache: 'no-store',
        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
        body: JSON.stringify({ email: email.value, consent: true, consentVersion: 'newsletter-2026-09-24', sourcePath: window.location.pathname }),
        signal: controller.signal
      });
      var data = await response.json();
      if (response.ok && data.ok === true && data.status === 'pending_confirmation') {
        status.textContent = 'Check your email to confirm your subscription. If it does not arrive, check your spam folder.';
        form.reset();
      } else if (response.status === 503 && data.code === 'NEWSLETTER_NOT_CONFIGURED') {
        status.textContent = 'Newsletter signup is not connected yet. Nothing has been saved or sent. Please try again later.';
      } else if (response.status === 429) {
        status.textContent = 'Please wait a little before trying again. Your email is still here.';
      } else if (response.status === 502 && data.code === 'CONFIRMATION_MAIL_UNCERTAIN') {
        status.textContent = 'We could not confirm that the confirmation email was sent. If it does not arrive within a few minutes, please try again.';
      } else if (response.status === 502) {
        status.textContent = 'We could not complete your signup. You are not subscribed yet. Please try again. Your email is still here.';
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
