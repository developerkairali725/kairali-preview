/** Inspect rendered content, including errors caught internally by DC runtime.
 * This function is serialized into the capture browser; keep it self-contained.
 */
export function inspectCapturePage({ formSelector = null } = {}) {
  const root = document.getElementById('ahv-design-root');
  if (!root) return { errors: ['Missing design root'], heading: '', bodyChars: 0, requiredForm: false };
  const errors = [...root.querySelectorAll('.sc-logic-error,.sc-has-error,[data-ahv-error]')]
    .map(node => (node.querySelector('.sc-logic-error') || node).textContent.trim().slice(0, 250));
  if (root.hasAttribute('data-ahv-error')) errors.push(root.getAttribute('data-ahv-error'));
  const copy = root.cloneNode(true);
  copy.querySelectorAll('header,footer,nav,script,style,template,[data-sc-name="AHV Chrome Header"],[data-sc-name="AHV Chrome Footer"],#ahv-consent,#ahv-contact-controls,#ahv-cta-bar,[data-ahv-snapshot]')
    .forEach(node => node.remove());
  const heading = [...root.querySelectorAll('h1')].map(node => node.textContent.trim()).find(Boolean) || '';
  const bodyChars = (copy.textContent || '').replace(/\s+/g, ' ').trim().length;
  const form = formSelector ? root.querySelector(formSelector) : null;
  const requiredForm = !formSelector || !!(form && form.querySelector('input:not([type="hidden"]),textarea,select'));
  return { errors: [...new Set(errors)], heading, bodyChars, requiredForm };
}

export function captureFormSelector(route) {
  if (['/contact-us/', '/enquiry-form/'].includes(route)) return 'form[data-form="contact"]';
  if (route === '/apply-now/') return 'form[data-form="apply"]';
  if (route === '/jobs/business-development-manager/') return 'form[data-form="job"]';
  if (route === '/online-consultation/') return 'form[data-step="1"]';
  if (route === '/contact-us-old/') return 'form#lc-write-form';
  if (['/enquiry-form-old/', '/online-consultation-old/', '/postulez-maintenant/', '/walk-in-ayurveda-treatment/'].includes(route)) return 'form#le-form';
  return null;
}

export function assertCapturePage(state, route) {
  if (state.errors.length) throw new Error('Rendered component error on ' + route + ': ' + state.errors.join('; '));
  if (!state.heading) throw new Error('Missing meaningful page H1 on ' + route);
  if (state.bodyChars < 100) throw new Error('Missing page body outside navigation on ' + route + ': ' + state.bodyChars + ' characters');
  if (!state.requiredForm) throw new Error('Missing expected page form on ' + route);
}
