import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import { fileURLToPath } from 'node:url';

// LATER-011 / DEC-FREE-CONSULT (owner, 10 Oct 2026: same-page Free Consult, unchanged styling). On the live campaign
// routes the shared phone bar's "Free Consult" opens the page's own free doctor consultation form (#enquiry, the target
// of every in-page consultation CTA); everywhere else, and wherever that form is missing, it keeps the bar's own
// consultation link. Drives the real ctaBar() slice of review-chrome.js (the slice tools/build-review-chrome.mjs copies
// into the locale chrome) through a mocked DOM whose observer schedules a pass on every href write, as the real one does.
const source = fs.readFileSync(new URL('../public/design/review-chrome.js', import.meta.url), 'utf8');
const start = source.indexOf('  function ctaBar()');
const end = source.indexOf('  window.addEventListener("resize"', start);
const barMarkup = source.match(/var CTA_BAR = (".*?");\n/);
assert.ok(start >= 0 && end > start && barMarkup, 'ctaBar() and CTA_BAR are present in review-chrome.js');
const slice = source.slice(start, end);
const BAR = '<nav id="ahv-cta-bar" aria-label="Quick actions"><a class="ahv-cta-call" href="tel:+91 9555 156 156">Call</a> <a class="ahv-cta-enquire" href="/contact-us/">Enquire</a> <a class="ahv-cta-consult" href="/online-consultation/">Free Consult</a></nav>';
const barLinks = [...JSON.parse(barMarkup[1]).matchAll(/<a class="([^"]+)" href="([^"]*)"/g)].map(([, cls, href]) => ({ cls, href }));
const MAX_PASSES = 50;

// The live campaign routes, from the routes themselves: every app/(ppc-v2*) page that renders ProductionPage, which
// always renders the Enquiry section (#enquiry) and the body[data-ahv-campaign] document.
const APP = fileURLToPath(new URL('../app/', import.meta.url));
function campaignRoutes() {
  const out = [];
  const walk = (dir, url) => {
    for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
      if (!e.isDirectory()) continue;
      const seg = /^\(.*\)$/.test(e.name) ? '' : '/' + e.name;
      const sub = path.join(dir, e.name);
      const page = path.join(sub, 'page.tsx');
      if (fs.existsSync(page) && /<ProductionPage\b/.test(fs.readFileSync(page, 'utf8'))) out.push(url + seg + (/\.html$/.test(e.name) ? '' : '/'));
      walk(sub, url + seg);
    }
  };
  for (const g of fs.readdirSync(APP).filter((d) => /^\(ppc-v2(-[a-z]+)?\)$/.test(d))) walk(path.join(APP, g), '');
  return out.sort();
}
const ROUTES = campaignRoutes();

function page({ path: initialPath, campaign = true, enquiry = true, enquiryForm = true, otherForm = null, localPaths = null, askLabel = null }) {
  const writes = [];
  let scheduled = false, passes = 0, here = initialPath;
  const dom = { enquiry, enquiryForm, otherForm };
  const schedule = () => { scheduled = true; };
  const links = barLinks.map(({ cls, href }) => {
    const attrs = { href };
    const listeners = {};
    return {
      cls,
      listeners,
      addEventListener: (type, fn) => { (listeners[type] = listeners[type] || []).push(fn); },
      classList: { contains: (c) => cls.split(' ').includes(c) },
      getAttribute: (n) => (n in attrs ? attrs[n] : null),
      setAttribute: (n, v) => { if (n === 'href') { writes.push({ cls, from: attrs.href, to: String(v) }); schedule(); } attrs[n] = String(v); },
    };
  });
  let chatText = 'Chat', chatWrites = 0;
  const chat = {};
  Object.defineProperty(chat,'textContent',{get:()=>chatText,set:value=>{chatText=value;chatWrites++;schedule();}});
  const bar = { querySelector: () => chat, querySelectorAll: () => links, getBoundingClientRect: () => ({ height: 56 }) };
  const enquiryEl = () => (dom.enquiry ? { id: 'enquiry' } : null);
  const formEl = () => (dom.enquiry && dom.enquiryForm ? { id: '' } : null);
  const body = {
    classList: { contains: () => false },
    querySelectorAll: () => [],
    querySelector: (sel) => {
      if (sel === '.lp-prod[data-variant="C"] .lp-hero__ask') return askLabel ? {textContent:askLabel} : null;
      if (sel === '#enquiry form') return formEl();
      if (sel === '#enquiry') return enquiryEl();
      if (sel === '#enquiry, #consult') return enquiryEl() || (dom.otherForm === 'consult' ? { id: 'consult' } : null);
      if (sel === 'main form[id]' || sel === 'form[id]') return dom.otherForm ? { id: dom.otherForm } : null;
      return null;
    },
  };
  const style = new Map();
  const html = { style: { getPropertyValue: (k) => style.get(k) || '', setProperty: (k, v) => style.set(k, v), removeProperty: (k) => style.delete(k) }, setAttribute() {} };
  const location = { get pathname() { return here; } };
  const ctx = {
    window: localPaths ? { AHV_LOCAL_PATHS: localPaths } : {}, location,
    document: { body, documentElement: html, getElementById: (id) => (id === 'ahv-cta-bar' ? bar : null), querySelector: () => null },
    campaignRoot: campaign ? body : null, root: body, CTA_BAR: JSON.parse(barMarkup[1]),
    ctaBarKind: () => '', contactTrigger: () => ({}), markDesignNotices() {},
  };
  vm.createContext(ctx);
  vm.runInContext(slice + '\nthis.ctaBar = ctaBar;', ctx);
  const get = (c) => links.find((a) => a.classList.contains(c)).getAttribute('href');
  return {
    writes,
    chat: () => chatText, chatWrites: () => chatWrites,
    consult: () => get('ahv-cta-consult'),
    enquire: () => get('ahv-cta-enquire'),
    call: () => get('ahv-cta-call'),
    // client navigation or a DOM change: the observer schedules a pass
    navigate(p) { here = p; schedule(); },
    // MOCKED history-only navigation: location.pathname changes and NOTHING else — no DOM/href mutation, no resize, so
    // the observer schedules no pass (as with history.pushState that leaves the bar's subtree untouched)
    historyOnly(p) { here = p; },
    // a form appears or disappears with no pass run (the activation path must not depend on one)
    domOnly(next) { Object.assign(dom, next); },
    // MOCKED activation: runs the handlers actually installed on the link for `type` (target phase), then reports the
    // href the browser's default action would read afterwards. No real browser, navigation or event loop.
    activate(cls, type = 'click', init = {}) {
      const a = links.find((l) => l.classList.contains(cls));
      const ev = { type, button: 0, ctrlKey: false, metaKey: false, shiftKey: false, altKey: false, ...init, defaultPrevented: false, propagationStopped: false };
      ev.preventDefault = () => { ev.defaultPrevented = true; };
      ev.stopPropagation = () => { ev.propagationStopped = true; };
      ev.stopImmediatePropagation = () => { ev.propagationStopped = true; };
      for (const fn of a.listeners[type] || []) fn.call(a, ev);
      return { href: a.getAttribute('href'), defaultPrevented: ev.defaultPrevented, propagationStopped: ev.propagationStopped };
    },
    listenerCounts: (cls) => Object.fromEntries(Object.entries(links.find((l) => l.classList.contains(cls)).listeners).map(([k, v]) => [k, v.length])),
    pending: () => scheduled,
    setDom(next) { Object.assign(dom, next); schedule(); },
    settle() {
      const before = writes.length, from = passes;
      if (passes === 0) schedule();
      while (scheduled && passes - from < MAX_PASSES) { scheduled = false; passes++; ctx.ctaBar(); }
      return { passes: passes - from, writes: writes.slice(before), quiet: !scheduled };
    },
  };
}
const consultWrites = (run) => run.writes.filter((w) => w.cls === 'ahv-cta-consult');

test('the bar markup is unchanged: labels, classes, order and default destinations', () => {
  assert.equal(JSON.parse(barMarkup[1]), BAR);
});

test('exactly the 24 live campaign routes render ProductionPage (EN, DE and RU groups)', () => {
  assert.equal(ROUTES.length, 24, ROUTES.join('\n'));
  assert.ok(ROUTES.includes('/lp/behandlung-in-kerala/') && ROUTES.includes('/lp/treatment-in-kerala-russian/'));
  assert.ok(ROUTES.includes('/ayurvedic-treatment-packages.html') && ROUTES.includes('/Kairali_Brand_and_Competition_Neo-original.html'));
});

test('all 24 campaign routes: Free Consult opens the same-page consultation form #enquiry, in one write', () => {
  for (const r of ROUTES) {
    const p = page({ path: r });
    const run = p.settle();
    assert.equal(p.consult(), '#enquiry', r);
    assert.deepEqual(consultWrites(run), [{ cls: 'ahv-cta-consult', from: '/online-consultation/', to: '#enquiry' }], r);
    assert.equal(p.enquire(), '#enquiry', `${r}: Enquire keeps its existing in-page target`);
    assert.equal(p.call(), 'tel:+91 9555 156 156', r);
    assert.ok(run.quiet && run.passes <= 2, `${r}: settled after ${run.passes} passes`);
  }
});

test('served spellings of the same routes: trailing slash added or dropped', () => {
  for (const r of ['/lp/weight-loss', '/ayurvedic-treatment-packages.html/', '/lp/behandlung-in-kerala']) {
    const p = page({ path: r });
    p.settle();
    assert.equal(p.consult(), '#enquiry', r);
  }
});

test('locale chrome: DE and RU campaign routes reach the form; the fallback follows the locale path map', () => {
  const localPaths = { '/online-consultation/': '/de/online-consultation/', '/contact-us/': '/de/contact-us/' };
  const de = page({ path: '/lp/behandlung-in-kerala/', localPaths });
  de.settle();
  assert.equal(de.consult(), '#enquiry');
  const ru = page({ path: '/lp/treatment-in-kerala-russian/', localPaths: { '/online-consultation/': '/ru/online-consultation/' } });
  ru.settle();
  assert.equal(ru.consult(), '#enquiry');
  const off = page({ path: '/lp/some-other-campaign/', localPaths });
  const run = off.settle();
  assert.equal(off.consult(), '/de/online-consultation/', 'excluded route keeps the localized consultation page');
  assert.deepEqual(consultWrites(run), [{ cls: 'ahv-cta-consult', from: '/online-consultation/', to: '/de/online-consultation/' }]);
});

test('locale aliases of scope pages in l10n/routes.json are not campaign routes: no prefix stripping, fallback kept', () => {
  const routes = JSON.parse(fs.readFileSync(new URL('../l10n/routes.json', import.meta.url), 'utf8')).routes;
  const aliases = [];
  for (const r of ROUTES) for (const [loc, p] of Object.entries(routes[r] || {})) if (loc !== 'en' && p !== r) aliases.push(p);
  assert.ok(aliases.length > 0, 'the source carries locale aliases for some scope pages');
  for (const a of aliases) {
    assert.ok(!ROUTES.includes(a), `${a} is not itself a campaign route`);
    for (const campaign of [false, true]) {
      const p = page({ path: a, campaign });
      p.settle();
      assert.equal(p.consult(), '/online-consultation/', `${a} (campaign root: ${campaign})`);
    }
  }
});

test('non-target campaign roots keep the external consultation page', () => {
  for (const r of ['/lp-v2/panchakarma/', '/lp/', '/', '/lp/weight-loss/extra/', '/LP/weight-loss/', '/x/ayurvedic-treatment-packages.html', '/ayurvedic-treatment-packages.htm']) {
    const p = page({ path: r });
    const run = p.settle();
    assert.equal(p.consult(), '/online-consultation/', r);
    assert.deepEqual(consultWrites(run), [], r);
  }
});

test('non-campaign routes are untouched, including a scope path served without the campaign document', () => {
  for (const r of ['/', '/contact-us/', '/ayurvedic-treatment-packages.html']) {
    const p = page({ path: r, campaign: false });
    p.settle();
    assert.equal(p.consult(), '/online-consultation/', r);
  }
  // the consultation page itself: its own existing self-link rule still applies
  const self = page({ path: '/online-consultation/', campaign: false, enquiry: false, otherForm: 'consult-form' });
  self.settle();
  assert.equal(self.consult(), '#consult-form');
});

test('missing form: no #enquiry, or #enquiry without its form, keeps the fallback; no generic form substitution', () => {
  for (const dom of [{ enquiry: false }, { enquiry: true, enquiryForm: false }, { enquiry: false, otherForm: 'consult' }, { enquiry: false, otherForm: 'newsletter' }]) {
    const p = page({ path: '/lp/weight-loss/', ...dom });
    p.settle();
    assert.equal(p.consult(), '/online-consultation/', JSON.stringify(dom));
  }
  // Enquire's existing rule is unchanged: it still follows #consult or any main form[id]
  const p = page({ path: '/lp/weight-loss/', enquiry: false, otherForm: 'newsletter' });
  p.settle();
  assert.equal(p.enquire(), '#newsletter');
});

test('form appearing or disappearing later is followed with one write each way', () => {
  const p = page({ path: '/lp/weight-loss/', enquiry: false });
  p.settle();
  assert.equal(p.consult(), '/online-consultation/');
  p.setDom({ enquiry: true });
  let run = p.settle();
  assert.equal(p.consult(), '#enquiry');
  assert.equal(consultWrites(run).length, 1);
  p.setDom({ enquiryForm: false });
  run = p.settle();
  assert.equal(p.consult(), '/online-consultation/');
  assert.equal(consultWrites(run).length, 1);
});

test('route changes: allowed -> excluded restores the fallback, excluded -> allowed opens the form, one write each', () => {
  const p = page({ path: '/lp/weight-loss/' });
  p.settle();
  assert.equal(p.consult(), '#enquiry');
  let run = p.navigate('/lp-v2/panchakarma/') || p.settle();
  assert.equal(p.consult(), '/online-consultation/', 'no stale #enquiry after leaving the campaign family');
  assert.deepEqual(consultWrites(run), [{ cls: 'ahv-cta-consult', from: '#enquiry', to: '/online-consultation/' }]);
  run = p.navigate('/pain-management.html') || p.settle();
  assert.equal(p.consult(), '#enquiry');
  assert.deepEqual(consultWrites(run), [{ cls: 'ahv-cta-consult', from: '/online-consultation/', to: '#enquiry' }]);
  run = p.navigate('/lp/pain-management/') || p.settle();
  assert.deepEqual(consultWrites(run), [], 'allowed -> allowed writes nothing');
  assert.ok(run.quiet && run.passes === 1);
});

test('write budget: unchanged passes write nothing and the page goes quiet', () => {
  for (const r of [ROUTES[0], '/lp-v2/panchakarma/']) {
    const p = page({ path: r });
    p.settle();
    for (let i = 0; i < 5; i++) {
      p.setDom({});
      const run = p.settle();
      assert.deepEqual(run.writes, [], r);
      assert.ok(run.quiet && run.passes === 1, `${r}: ${run.passes}`);
    }
  }
});

test('the slice stays self-contained for the locale chrome build', () => {
  assert.ok(slice.includes('var lp = window.AHV_LOCAL_PATHS,'), 'tools/build-review-chrome.mjs anchor kept');
  assert.ok(slice.includes('function freeConsultHref('), 'the Free Consult rule lives inside the copied slice');
  assert.ok(slice.includes('function syncFreeConsult('), 'the activation refresh lives inside the copied slice');
});

// ── Activation-time refresh (V2). The observer only runs a pass on DOM/href mutations and resize; a history-only route
// change touches neither, so the destination is re-decided on the consultation link itself when it is activated.
test('activation after a history-only change allowed -> excluded uses the fallback, no pass needed', () => {
  const p = page({ path: '/lp/weight-loss/' });
  p.settle();
  assert.equal(p.consult(), '#enquiry');
  p.historyOnly('/lp-v2/panchakarma/');
  assert.equal(p.pending(), false, 'mock: no observer pass is scheduled by the path change');
  const r = p.activate('ahv-cta-consult');
  assert.equal(r.href, '/online-consultation/', 'no stale #enquiry at activation');
  assert.equal(r.defaultPrevented, false);
  assert.equal(r.propagationStopped, false);
});

test('activation after a history-only change excluded -> allowed opens the form', () => {
  const p = page({ path: '/lp-v2/panchakarma/' });
  p.settle();
  assert.equal(p.consult(), '/online-consultation/');
  p.historyOnly('/ayurvedic-treatment-packages.html');
  assert.equal(p.pending(), false);
  const r = p.activate('ahv-cta-consult');
  assert.equal(r.href, '#enquiry');
  assert.equal(r.defaultPrevented, false);
});

test('activation on an allowed route whose form is gone keeps the fallback; form back -> #enquiry', () => {
  const p = page({ path: '/lp/weight-loss/' });
  p.settle();
  p.domOnly({ enquiryForm: false });
  assert.equal(p.activate('ahv-cta-consult').href, '/online-consultation/');
  p.domOnly({ enquiryForm: true });
  assert.equal(p.activate('ahv-cta-consult').href, '#enquiry');
});

test('activation on DE chrome follows the locale fallback after leaving the route', () => {
  const p = page({ path: '/lp/behandlung-in-kerala/', localPaths: { '/online-consultation/': '/de/online-consultation/' } });
  p.settle();
  assert.equal(p.consult(), '#enquiry');
  p.historyOnly('/lp/some-other-campaign/');
  assert.equal(p.activate('ahv-cta-consult').href, '/de/online-consultation/');
});

test('modified and non-primary activations refresh too and keep the browser default', () => {
  const inits = [['click', { ctrlKey: true }], ['click', { metaKey: true }], ['click', { shiftKey: true }], ['auxclick', { button: 1 }], ['contextmenu', { button: 2 }]];
  for (const [type, init] of inits) {
    const p = page({ path: '/lp/weight-loss/' });
    p.settle();
    p.historyOnly('/contact-us/');
    const r = p.activate('ahv-cta-consult', type, init);
    assert.equal(r.href, '/online-consultation/', `${type} ${JSON.stringify(init)}`);
    assert.equal(r.defaultPrevented, false, type);
    assert.equal(r.propagationStopped, false, type);
  }
});

test('activation with nothing changed writes nothing', () => {
  const p = page({ path: '/lp/weight-loss/' });
  p.settle();
  const before = p.writes.length;
  for (const t of ['click', 'auxclick', 'contextmenu']) p.activate('ahv-cta-consult', t);
  assert.equal(p.writes.length, before);
});

test('listeners: installed once on the consultation link only, never on Enquire or Call, and not off-campaign', () => {
  const p = page({ path: '/lp/weight-loss/' });
  for (let i = 0; i < 6; i++) { p.setDom({}); p.settle(); p.navigate(i % 2 ? '/lp/weight-loss/' : '/lp-v2/x/'); p.settle(); }
  assert.deepEqual(p.listenerCounts('ahv-cta-consult'), { click: 1, auxclick: 1, contextmenu: 1 });
  assert.deepEqual(p.listenerCounts('ahv-cta-enquire'), {});
  assert.deepEqual(p.listenerCounts('ahv-cta-call'), {});
  const off = page({ path: '/', campaign: false });
  off.settle();
  assert.deepEqual(off.listenerCounts('ahv-cta-consult'), {});
});

test('other CTAs are unchanged by activation of Free Consult', () => {
  const p = page({ path: '/lp/weight-loss/' });
  p.settle();
  const enquire = p.enquire(), call = p.call();
  p.historyOnly('/lp-v2/x/');
  p.activate('ahv-cta-consult');
  assert.equal(p.enquire(), enquire);
  assert.equal(p.call(), call);
  assert.equal(p.activate('ahv-cta-enquire').href, enquire, 'Enquire has no added handler');
});


test('P05: existing variant C mobile action reuses the approved localized label once, with no mutation loop',()=>{
 for(const askLabel of ['Ask Anything','Fragen Sie uns','Задать вопрос']){
  const p=page({path:'/lp/treatment-in-kerala/',askLabel});
  assert(p.settle().quiet);assert.equal(p.chat(),askLabel);assert.equal(p.chatWrites(),1);
  for(let i=0;i<20;i++){p.setDom({});assert(p.settle().quiet);}
  assert.equal(p.chatWrites(),1);assert.equal(p.consult(),'#enquiry');assert.equal(p.enquire(),'#enquiry');assert.equal(p.call(),'tel:+91 9555 156 156');
 }
});
test('P05: other campaign variants and non-campaign bars retain their existing Chat label',()=>{
 for(const props of [{campaign:true,askLabel:null},{campaign:false,askLabel:'Ask Anything'}]){
  const p=page({path:'/',...props});assert(p.settle().quiet);assert.equal(p.chat(),'Chat');assert.equal(p.chatWrites(),0);
 }
});
