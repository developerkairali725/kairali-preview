/** Inspect rendered content, including errors caught internally by DC runtime.
 * This function is serialized into the capture browser; keep it self-contained.
 */
export function inspectCapturePage({ formSelector = null, formCount = null, requiredSelector = null, forbiddenSelector = null, rootElement = null } = {}) {
  const root = rootElement || document.getElementById('ahv-design-root');
  if (!root) return { errors: ['Missing design root'], heading: '', bodyChars: 0, requiredForm: false };
  const errors = [...root.querySelectorAll('.sc-logic-error,.sc-has-error,.sc-placeholder-error,[data-ahv-error]')]
    .map(node => (node.querySelector('.sc-logic-error') || node).textContent.trim().slice(0, 250));
  if (root.hasAttribute('data-ahv-error')) errors.push(root.getAttribute('data-ahv-error'));
  const copy = root.cloneNode(true);
  copy.querySelectorAll('header,footer,nav,script,style,template,[data-sc-name="AHV Chrome Header"],[data-sc-name="AHV Chrome Footer"],#ahv-consent,#ahv-contact-controls,#ahv-cta-bar,[data-ahv-snapshot]')
    .forEach(node => node.remove());
  const heading = [...root.querySelectorAll('h1')].map(node => node.textContent.trim()).find(Boolean) || '';
  const bodyChars = (copy.textContent || '').replace(/\s+/g, ' ').trim().length;
  const form = formSelector ? root.querySelector(formSelector) : null;
  const requiredForm = !formSelector || !!(form && form.querySelector('input:not([type="hidden"]),textarea,select') &&
    (formCount == null || root.querySelectorAll(formSelector).length === formCount));
  const requiredContent = !requiredSelector || !!root.querySelector(requiredSelector);
  const forbiddenContent = !!(forbiddenSelector && root.querySelector(forbiddenSelector));
  return { errors: [...new Set(errors)], heading, bodyChars, requiredForm, requiredContent, forbiddenContent };
}

/** Proof and extraction run synchronously in one browser task, against one DOM. */
export function createCaptureEvaluation(extract) {
  return new Function('requirements', `
    const inspect = (${inspectCapturePage.toString()});
    const liveContentProof = inspect(requirements);
    const got = (${extract.toString()})();
    const inert = document.createElement('template');
    inert.innerHTML = '<div>' + (got?.html || '') + '</div>';
    const contentProof = inspect({ ...requirements, rootElement: inert.content.firstElementChild });
    return { liveContentProof, contentProof, got };
  `);
}

export function captureFormSelector(route) {
  if (['/weight-loss-programme/', '/digestive-wellness-gut-health-yoga-therapy/'].includes(route)) return '#programme-enquiry form[data-form="contact"]';
  if (['/contact-us/', '/enquiry-form/'].includes(route)) return 'form[data-form="contact"]';
  if (route === '/apply-now/') return 'form[data-form="apply"]';
  if (route === '/jobs/business-development-manager/') return 'form[data-form="job"]';
  if (route === '/online-consultation/') return 'form[data-step="1"]';
  if (route === '/contact-us-old/') return 'form#lc-write-form';
  if (['/enquiry-form-old/', '/online-consultation-old/', '/postulez-maintenant/', '/walk-in-ayurveda-treatment/'].includes(route)) return 'form#le-form';
  return null;
}

export function captureContentRequirements(route, sourceRecord = {}) {
  if (['/weight-loss-programme/', '/digestive-wellness-gut-health-yoga-therapy/'].includes(route)) return { formSelector: captureFormSelector(route), formCount: 1 };
  if (route === '/jobs/business-development-manager/' && sourceRecord.closed === true && sourceRecord.applicationsOpen === false) {
    return { formSelector: null, requiredSelector: '[data-job-closed="true"]', forbiddenSelector: 'form[data-form="job"]' };
  }
  return { formSelector: captureFormSelector(route) };
}

export function assertCapturePage(state, route) {
  if (!state || !Array.isArray(state.errors) || typeof state.heading !== 'string' || !Number.isFinite(state.bodyChars) ||
      typeof state.requiredForm !== 'boolean' || typeof state.requiredContent !== 'boolean' || typeof state.forbiddenContent !== 'boolean') {
    throw new Error('Malformed capture content proof on ' + route);
  }
  if (state.errors.length) throw new Error('Rendered component error on ' + route + ': ' + state.errors.join('; '));
  if (!state.heading) throw new Error('Missing meaningful page H1 on ' + route);
  if (state.bodyChars < 100) throw new Error('Missing page body outside navigation on ' + route + ': ' + state.bodyChars + ' characters');
  if (!state.requiredForm) throw new Error('Missing expected page form on ' + route);
  if (state.requiredContent === false) throw new Error('Missing required page state on ' + route);
  if (state.forbiddenContent) throw new Error('Unexpected page state on ' + route);
}
