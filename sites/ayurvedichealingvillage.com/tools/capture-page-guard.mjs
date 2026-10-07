/** Inspect rendered content, including errors caught internally by DC runtime.
 * This function is serialized into the capture browser; keep it self-contained.
 */
export function inspectCapturePage({ formSelector = null, formCount = null, requiredSelector = null, forbiddenSelector = null, rootElement = null, neutralConfirmation = null } = {}) {
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
  const proof = { errors: [...new Set(errors)], heading, bodyChars, requiredForm, requiredContent, forbiddenContent };
  if (neutralConfirmation) {
    const normalize = value => String(value || '').replace(/\s+/g, ' ').trim();
    const states = root.querySelectorAll('[data-state="direct-visit"]');
    const direct = states.length === 1 ? states[0] : null;
    const headings = direct ? direct.querySelectorAll('h1') : [];
    const paragraphs = direct ? direct.querySelectorAll('p') : [];
    const actions = direct ? direct.querySelectorAll('a') : [];
    let hrefMatches = false;
    if (actions.length === 1) {
      try {
        const expected = new URL(neutralConfirmation.href);
        const href = actions[0].getAttribute('href') || '';
        const absoluteOrRootRelative = /^https?:\/\//.test(href) || /^\/(?!\/)/.test(href);
        const actual = new URL(href, expected);
        const localOrigin = typeof location === 'object' ? location.origin : null;
        hrefMatches = absoluteOrRootRelative && !actual.username && !actual.password &&
          (actual.origin === expected.origin || actual.origin === localOrigin) &&
          actual.pathname === expected.pathname && !actual.search && !actual.hash;
      } catch { /* A malformed destination never verifies a neutral state. */ }
    }
    proof.neutralConfirmation = {
      id: neutralConfirmation.id,
      locale: neutralConfirmation.locale,
      complete: !!(direct && root.querySelectorAll('h1').length === 1 &&
        headings.length === 1 && normalize(headings[0].textContent) === neutralConfirmation.heading &&
        paragraphs.length === 1 && normalize(paragraphs[0].textContent) === neutralConfirmation.body &&
        actions.length === 1 && normalize(actions[0].textContent) === neutralConfirmation.label && hrefMatches &&
        normalize(direct.textContent) === neutralConfirmation.text &&
        root.querySelectorAll('[data-state="receipt"]').length === 0 &&
        direct.querySelectorAll('form').length === 0),
    };
  }
  return proof;
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

// Approved Chinese direct-visit text is complete at 85/86 characters including
// the skip link. Verify its exact neutral semantics, rather than padding copy or
// admitting arbitrary short pages. Other routes/locales retain the 100-char rule.
const SHARED_NEUTRAL_ROUTES = new Set([
  '/contact-us/thank-you/', '/onlinebookingthankyou/', '/onlineconsultation-thanks/',
  '/ppc-thanks/', '/thanks/', '/thanks-old/',
]);
function neutralConfirmationContract(route, locale) {
  if (locale !== 'zh-Hans' || (!SHARED_NEUTRAL_ROUTES.has(route) && route !== '/emailsubscriber/')) return null;
  const newsletter = route === '/emailsubscriber/';
  const heading = '返回网站';
  const body = newsletter ? '本页面无法确认新闻通讯订阅是否已完成。' : '本页面无法确认留言或预订是否已提交。';
  const label = '返回首页';
  return {
    id: newsletter ? 'ahv-neutral-newsletter-zh-v1' : 'ahv-neutral-confirmation-zh-v1',
    locale, heading, body, label, href: 'https://ayurvedichealingvillage.com/zh/',
    text: ['Kairali — The Ayurvedic Healing Village · 始于1908年', heading, body, label].join(' '),
  };
}

export function captureContentRequirements(route, sourceRecord = {}, locale = 'en') {
  if (['/weight-loss-programme/', '/digestive-wellness-gut-health-yoga-therapy/'].includes(route)) return { formSelector: captureFormSelector(route), formCount: 1 };
  if (route === '/jobs/business-development-manager/' && sourceRecord.closed === true && sourceRecord.applicationsOpen === false) {
    return { formSelector: null, requiredSelector: '[data-job-closed="true"]', forbiddenSelector: 'form[data-form="job"]' };
  }
  const neutralConfirmation = neutralConfirmationContract(route, locale);
  return { formSelector: captureFormSelector(route), ...(neutralConfirmation ? { neutralConfirmation } : {}) };
}

export function assertCapturePage(state, route) {
  if (!state || !Array.isArray(state.errors) || typeof state.heading !== 'string' || !Number.isFinite(state.bodyChars) ||
      typeof state.requiredForm !== 'boolean' || typeof state.requiredContent !== 'boolean' || typeof state.forbiddenContent !== 'boolean') {
    throw new Error('Malformed capture content proof on ' + route);
  }
  if (state.errors.length) throw new Error('Rendered component error on ' + route + ': ' + state.errors.join('; '));
  if (!state.heading) throw new Error('Missing meaningful page H1 on ' + route);
  let requiredBodyChars = 100;
  if (Object.hasOwn(state, 'neutralConfirmation')) {
    const neutral = state.neutralConfirmation;
    const expected = neutralConfirmationContract(route, neutral?.locale);
    if (!expected || neutral.id !== expected.id || typeof neutral.complete !== 'boolean') {
      throw new Error('Malformed neutral confirmation proof on ' + route);
    }
    if (!neutral.complete || state.heading !== expected.heading) {
      throw new Error('Incomplete neutral confirmation state on ' + route);
    }
    requiredBodyChars = expected.text.length;
  }
  if (state.bodyChars < requiredBodyChars) throw new Error('Missing page body outside navigation on ' + route + ': ' + state.bodyChars + ' characters');
  if (!state.requiredForm) throw new Error('Missing expected page form on ' + route);
  if (state.requiredContent === false) throw new Error('Missing required page state on ' + route);
  if (state.forbiddenContent) throw new Error('Unexpected page state on ' + route);
}
