// OWNER-REG-05 / OWNER-REG-07: scroll-lock lifecycles restore exactly what they changed, once.
// Unit level (fake DOM): chrome.js's chat open/close lifecycle and the about-us certificate viewer logic.
// Physical iOS Safari behaviour is NOT proven here; these assert the state machine the fix relies on.
import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import vm from 'node:vm';

// A CSSStyleDeclaration stand-in: `overflow` is a shorthand over overflow-x/overflow-y, as in browsers
// (reads back only when both longhands agree; set/remove writes both).
const LONG = {overflow: ['overflow-x', 'overflow-y']};
const lh = (v, p = '') => ({'overflow-x': [v, p], 'overflow-y': [v, p]});
function styleDecl(init = {}) {
  const m = new Map();
  let writes = 0;
  const put = (k, v, p) => { for (const l of LONG[k] || [k]) { if (!v) m.delete(l); else m.set(l, [String(v), p || '']); } };
  const s = {
    getPropertyValue: (k) => { const ls = (LONG[k] || [k]).map((l) => m.get(l)); return ls.every((e) => e && e[0] === ls[0][0] && e[1] === ls[0][1]) ? ls[0][0] : ''; },
    getPropertyPriority: (k) => { const ls = (LONG[k] || [k]).map((l) => m.get(l)); return ls.every((e) => e && e[1] === ls[0][1]) ? ls[0][1] : ''; },
    setProperty(k, v, p = '') { writes++; put(k, v, p); },
    removeProperty(k) { writes++; put(k, ''); },
    get writes() { return writes; },
    dump() { return Object.fromEntries([...m].sort()); },
  };
  for (const [k, v] of Object.entries(init)) put(k, ...(Array.isArray(v) ? v : [v, '']));
  // CSSStyleDeclaration camelCase accessors (el.style.overflow = '…'), as a real browser exposes them
  for (const k of ['overflow', 'position', 'top']) Object.defineProperty(s, k, {get: () => s.getPropertyValue(k), set: (v) => s.setProperty(k, v)});
  return s;
}

// ── chrome.js chat lifecycle ────────────────────────────────────────────────
const chrome = readFileSync(new URL('../public/design/chrome.js', import.meta.url), 'utf8');
function chat({body = {}, html = {}, scrollY = 2400, providerLock = true, providerRestores = false, classPin = false} = {}) {
  const code = chrome.slice(chrome.indexOf('  var chatPending ='), chrome.indexOf('  function chatLinks(f)'));
  const el = (extra = {}) => ({attrs: {}, getAttribute(k) { return this.attrs[k] ?? null; }, setAttribute(k, v) { this.attrs[k] = v; }, querySelector() { return null; }, ...extra});
  const win = {scrollX: 0, scrollY, scrolls: [], dispatchEvent() {}, location: {href: ''},
    scrollTo(x, y) { const o = typeof x === 'object' ? {...x} : {left: x, top: y}; this.scrollX = o.left; this.scrollY = o.top; this.scrolls.push(o); },
    getComputedStyle: (n) => ({position: n.pinned ? 'fixed' : 'static'})};
  const bodyEl = el({style: styleDecl(body)}), htmlEl = el({style: styleDecl(html)});
  const panel = el({shown: false, focusInside: false, contains(n) { return n === panelInner; }});
  const panelInner = {};
  const launcher = el();
  const trigger = el({isConnected: true, focusCalls: [], focus(o) { this.focusCalls.push(JSON.parse(JSON.stringify(o))); doc.activeElement = this; }});
  const modals = [];
  let saved = null;
  const native = el();
  native.attrs['aria-expanded'] = 'false';
  native.click = () => {
    const opening = native.attrs['aria-expanded'] !== 'true';
    native.attrs['aria-expanded'] = opening ? 'true' : 'false';
    panel.shown = opening;
    if (opening && providerLock) { // a provider that pins the page on open (the iOS-style body lock)
      saved = {o: bodyEl.style.getPropertyValue('overflow'), p: bodyEl.style.getPropertyValue('position'), t: bodyEl.style.getPropertyValue('top')};
      bodyEl.style.setProperty('overflow', 'hidden'); bodyEl.style.setProperty('position', 'fixed'); bodyEl.style.setProperty('top', -win.scrollY + 'px');
      win.scrollY = 0; doc.activeElement = panelInner;
    }
    if (classPin) { // Chatbase's real mechanism: html.__cb_widget_active pins html/body (no inline style); its close-time
      // scrollTo runs under the page's smooth scroll-behavior, so at close the page is still at the top
      htmlEl.pinned = opening; if (opening) { saved = {y: win.scrollY}; win.scrollY = 0; doc.activeElement = panelInner; }
    }
    if (!opening && providerRestores && saved) { bodyEl.style.setProperty('overflow', saved.o); bodyEl.style.setProperty('position', saved.p); bodyEl.style.setProperty('top', saved.t); }
  };
  const timers = new Map(); let seq = 0;
  const doc = {body: bodyEl, documentElement: htmlEl, activeElement: bodyEl,
    getElementById(id) { return id === 'chatbase-bubble-button' ? native : id === 'chatbase-bubble-window' ? panel : null; },
    querySelector() { return launcher; },
    querySelectorAll() { return modals.filter((m) => m.open); }};
  const context = {document: doc, window: win, Event: class {}, visible: (n) => n === panel ? panel.shown : !!n.open,
    WA_HREF: 'https://wa.me/919289838797', setTimeout(fn) { timers.set(++seq, fn); return seq; }, clearTimeout(id) { timers.delete(id); }};
  vm.createContext(context); vm.runInContext(code, context);
  return {context, win, body: bodyEl, html: htmlEl, native, panel, launcher, trigger, timers, modals, doc,
    open(t = trigger) { context.openChat({preventDefault() {}, currentTarget: t}); },
    tick() { const [id, fn] = timers.entries().next().value; timers.delete(id); fn(); }};
}

test('REG-05: footer trigger at deep scroll → provider close restores the exact prior inline lock and scroll, 3 times', () => {
  const f = chat({body: {overflow: ['auto', 'important']}});
  for (let round = 0; round < 3; round++) {
    f.win.scrollY = 2400;
    f.open(); // footer link / floating button share openChat
    assert.equal(f.launcher.attrs['aria-expanded'], 'true');
    assert.equal(f.body.style.getPropertyValue('position'), 'fixed');
    f.native.click(); f.context.syncChatState(); // the provider's own close control
    assert.deepEqual(f.body.style.dump(), lh("auto", "important"), `round ${round}: exact restore, not an empty reset`);
    assert.equal(f.win.scrollY, 2400, `round ${round}: scroll position back`);
    assert.equal(f.body.attrs['data-ahv-chat-open'], 'false');
    assert.equal(f.launcher.attrs['aria-expanded'], 'false');
    assert.deepEqual(f.trigger.focusCalls[round], {preventScroll: true}, 'focus left in the hidden chat returns without scrolling');
  }
});

test('REG-05: minimizing via the custom button restores once; a second sync does not re-apply', () => {
  const f = chat();
  f.open(); f.open(); // second click on the same launcher = minimize
  assert.deepEqual(f.body.style.dump(), {});
  assert.equal(f.win.scrollY, 2400);
  const writes = f.body.style.writes, scrolls = f.win.scrolls.length;
  f.body.style.setProperty('overflow', 'hidden'); // someone else's lock after close
  f.context.syncChatState(); f.context.syncChatState();
  assert.equal(f.body.style.getPropertyValue('overflow'), 'hidden', 'a later, unrelated lock is never stolen');
  assert.equal(f.body.style.writes, writes + 1); assert.equal(f.win.scrolls.length, scrolls);
});

test('REG-05: class-pinned provider (Chatbase html.__cb_widget_active): instant return to the opening position, no inline writes', () => {
  const f = chat({providerLock: false, classPin: true});
  for (const via of ['custom', 'provider', 'custom']) {
    f.win.scrollY = 2400; f.open(); assert.equal(f.win.scrollY, 0);
    if (via === 'custom') f.open(); else { f.native.click(); f.context.syncChatState(); }
    assert.equal(f.win.scrollY, 2400, via);
    assert.equal(f.win.scrolls.at(-1).behavior, 'instant', 'overrides the page\'s smooth scroll-behavior');
  }
  assert.equal(f.body.style.writes + f.html.style.writes, 0);
});

test('REG-05: an unpinned page (desktop) is never moved on close, even if the visitor scrolled while chat was open', () => {
  const f = chat({providerLock: false});
  f.open(); f.win.scrollY = 5000; f.open();
  assert.equal(f.win.scrollY, 5000); assert.equal(f.win.scrolls.length, 0);
});

test('REG-05: a prior overflow-x-only inline value survives the provider overflow lock exactly', () => {
  const f = chat({body: {'overflow-x': 'hidden'}});
  f.open(); f.open();
  assert.deepEqual(f.body.style.dump(), {'overflow-x': ['hidden', '']});
});

test('REG-05: a provider that cleans up after itself is left alone (no writes, no scroll jump)', () => {
  const f = chat({body: {overflow: 'scroll'}, providerRestores: true});
  f.open(); const writesAfterProvider = () => f.body.style.writes;
  f.win.scrollY = 2400; // provider restored position itself
  f.native.click(); const w = writesAfterProvider(); f.context.syncChatState();
  assert.equal(f.body.style.writes, w, 'nothing to restore → nothing written');
  assert.equal(f.win.scrolls.length, 0);
  assert.equal(f.body.style.getPropertyValue('overflow'), 'scroll');
});

test('REG-05: stale aria-expanded="true" with the panel hidden after it was shown counts as closed', () => {
  const f = chat();
  f.open(); f.context.syncChatState(); assert.equal(f.launcher.attrs['aria-expanded'], 'true');
  f.panel.shown = false; f.context.syncChatState(); // provider hid its window, aria left stale
  assert.equal(f.launcher.attrs['aria-expanded'], 'false');
  assert.deepEqual(f.body.style.dump(), {}); assert.equal(f.win.scrollY, 2400);
});

test('REG-05: an absent aria-expanded is not "closed" while the panel is visibly open', () => {
  const f = chat();
  delete f.native.attrs['aria-expanded']; f.panel.shown = true; f.context.syncChatState();
  assert.equal(f.launcher.attrs['aria-expanded'], 'true');
  f.panel.shown = false; f.context.syncChatState();
  assert.equal(f.launcher.attrs['aria-expanded'], 'false');
});

test('REG-05: while another modal owns the page the restore waits; <html> lock of film-player is not stolen', () => {
  const f = chat({html: {overflow: 'visible'}});
  f.open();
  const film = {open: true, tagName: 'DIALOG', closest: () => null};
  f.modals.push(film); f.html.style.setProperty('overflow', 'hidden'); // film-player.js locks documentElement
  f.native.click(); f.context.syncChatState();
  assert.equal(f.html.style.getPropertyValue('overflow'), 'hidden', 'film lock intact while its dialog is open');
  assert.equal(f.body.style.getPropertyValue('position'), 'fixed', 'restore deferred, not partially applied');
  assert.equal(f.timers.size, 1);
  film.open = false; f.html.style.setProperty('overflow', 'visible'); // film-player restores its own saved value
  f.tick();
  assert.deepEqual(f.body.style.dump(), {}); assert.equal(f.html.style.getPropertyValue('overflow'), 'visible');
  assert.equal(f.win.scrollY, 2400); assert.equal(f.timers.size, 0);
});

test('REG-05: cancelling a pending open drops the baseline and cancels the fallback; late provider init does not reopen', () => {
  const f = chat();
  const native = f.native; let ready = false;
  f.doc.getElementById = (id) => (ready ? (id === 'chatbase-bubble-button' ? native : f.panel) : null);
  f.open(); assert.equal(f.launcher.attrs['aria-busy'], 'true');
  f.open(); assert.equal(f.timers.size, 0);
  ready = true; f.context.syncChatState();
  assert.equal(native.attrs['aria-expanded'], 'false'); assert.equal(f.win.location.href, '');
  assert.equal(f.body.style.writes, 0);
});

// ── about-us certificate viewer (both variants) ─────────────────────────────
function viewer(variant, body = {}, scrollY = 3100) {
  const {logic} = JSON.parse(readFileSync(new URL(`../public/ahv/views/ahv-page-about-us-${variant}.json`, import.meta.url), 'utf8'));
  const timers = new Map(); let seq = 0;
  const bodyStyle = styleDecl(body);
  const mk = (id) => ({id, focusCalls: [], focus(o) { this.focusCalls.push(JSON.parse(JSON.stringify(o))); }, getBoundingClientRect: () => ({top: 200, bottom: 400, height: 200})});
  const close = mk('doc-close'), openers = {0: mk('d0'), 1: mk('d1')};
  const win = {scrollX: 0, scrollY, innerHeight: 800, scrolls: [], scrollTo(o) { if (o.left != null) this.scrollX = o.left; this.scrollY = o.top; this.scrolls.push(o); }};
  const listeners = new Set();
  const doc = {body: {style: bodyStyle}, documentElement: {lang: ''}, listeners,
    addEventListener(t, fn) { if (t === 'keydown') listeners.add(fn); }, removeEventListener(t, fn) { if (t === 'keydown') listeners.delete(fn); },
    getElementById: (id) => (id === 'doc-close' ? close : null),
    querySelector: (sel) => { const m = /data-doc-index="(\d+)"/.exec(sel); return m ? openers[m[1]] : null; }};
  const ctx = {document: doc, window: win, setTimeout(fn) { timers.set(++seq, fn); return seq; }, clearTimeout(id) { timers.delete(id); }, console};
  vm.createContext(ctx);
  class StreamableLogic { constructor() { this.state = {}; this.props = {}; } setState(u) { this.state = {...this.state, ...(typeof u === 'function' ? u(this.state) : u)}; } }
  const Component = vm.runInContext(`(function(DCLogic,StreamableLogic,React){${logic}\n;return Component;})`, ctx)(StreamableLogic, StreamableLogic, {createElement: () => ({})});
  const c = new Component(); c.componentDidMount();
  return {c, body: bodyStyle, win, close, openers, timers, listeners, key(e) { for (const fn of [...listeners]) fn(e); }, flush() { for (const [id, fn] of [...timers]) { timers.delete(id); fn(); } }};
}

for (const variant of ['desktop', 'mobile']) {
  test(`REG-07 ${variant}: open → close restores the exact prior inline overflow and scroll; focus never scrolls`, () => {
    const v = viewer(variant, {overflow: ['clip', 'important']});
    v.c.openAt(0); assert.equal(v.body.getPropertyValue('overflow'), 'hidden'); v.flush();
    assert.deepEqual(v.close.focusCalls, [{preventScroll: true}]);
    v.win.scrollY = 0; // e.g. iOS reset the offset under the lock
    v.c.closeViewer();
    assert.deepEqual(v.body.dump(), lh("clip", "important"));
    assert.equal(v.win.scrollY, 3100);
    v.flush(); assert.deepEqual(v.openers[0].focusCalls, [{preventScroll: true}]);
  });

  test(`REG-07 ${variant}: a prior overflow-x-only inline value is restored exactly, not wiped by a shorthand reset`, () => {
    const v = viewer(variant, {'overflow-x': 'hidden'});
    v.c.openAt(0); assert.equal(v.body.getPropertyValue('overflow'), 'hidden'); v.c.closeViewer();
    assert.deepEqual(v.body.dump(), {'overflow-x': ['hidden', '']});
  });

  test(`REG-07 ${variant}: Escape closes and releases; repeated open/close ×3 across documents leaves no lock`, () => {
    const v = viewer(variant);
    for (let k = 0; k < 3; k++) {
      v.c.openAt(k % 2); v.c.openAt(k % 2); // a double activation must not overwrite the baseline with 'hidden'
      const e = {key: 'Escape', preventDefault() {}};
      if (k === 1) v.c.closeViewer(); else closeByKey(v, e);
      assert.deepEqual(v.body.dump(), {}, `round ${k}`);
      assert.equal(v.c.state.open, false);
    }
  });

  test(`REG-07 ${variant}: Escape with focus left on <body> (Safari tap) still closes and releases; listener is removed`, () => {
    const v = viewer(variant);
    v.c.openAt(0); assert.equal(v.listeners.size, 1);
    v.key({key: 'ArrowLeft', defaultPrevented: false}); assert.equal(v.c.state.open, true);
    v.key({key: 'Escape', defaultPrevented: true}); assert.equal(v.c.state.open, true, 'the dialog\'s own handler already took it');
    v.key({key: 'Escape', defaultPrevented: false});
    assert.equal(v.c.state.open, false); assert.deepEqual(v.body.dump(), {}); assert.equal(v.listeners.size, 0);
    v.c.openAt(1); v.c.componentWillUnmount(); assert.equal(v.listeners.size, 0, 'unmount removes it too');
  });

  test(`REG-07 ${variant}: closing before the 30ms focus timer cancels it (no late focus into the hidden dialog)`, () => {
    const v = viewer(variant);
    v.c.openAt(1); v.c.closeViewer(); v.flush();
    assert.deepEqual(v.close.focusCalls, []);
    assert.deepEqual(v.openers[1].focusCalls, [{preventScroll: true}]);
    v.c.closeViewer(); v.flush(); // idempotent
    assert.equal(v.openers[1].focusCalls.length, 1);
  });

  test(`REG-07 ${variant}: unmount while open releases the lock and silences pending callbacks`, () => {
    const v = viewer(variant, {overflow: 'auto'});
    v.c.openAt(0); v.c.componentWillUnmount(); v.flush();
    assert.deepEqual(v.body.dump(), lh('auto'));
    assert.deepEqual(v.close.focusCalls, []);
  });

  test(`REG-07 ${variant}: a lock another owner placed while the viewer was open is not clobbered`, () => {
    const v = viewer(variant);
    v.c.openAt(0); v.body.setProperty('overflow', 'hidden', 'important'); // another modal's lock
    v.c.closeViewer();
    assert.deepEqual(v.body.dump(), lh("hidden", "important"));
  });
}

function closeByKey(v, e) {
  // the dialog's own key handler (template onKeyDown={{ dlgKey }}) needs the page dataset only for rendering
  const docs = [{src: 'a.webp', label: 'A', width: 10, height: 10}, {src: 'b.webp', label: 'B', width: 10, height: 10}];
  const link = {text: '', href: '/'};
  const D = {quote: {text: ''}, intro: {link}, founder: {link}, leadership: {directors: []}, awards: {link}, certificates: {documents: docs}};
  v.win.AHV_ABOUT = D;
  v.c.renderVals().dlgKey(e);
}

// ── family-header.js: the observed root cause of both freezes (Chromium iPhone-13 emulation, 29 Sep 2026) ──
// stickyRow() turned any ancestor that READ overflow:hidden into a permanent [data-ahv-fh-clip] (overflow:clip
// !important). While the Chatbase panel (html.__cb_widget_active) or the certificate viewer held its temporary
// lock, <body> read "hidden", got marked, and after the modal closed the viewport stayed clipped: no touch scroll.
const fh = readFileSync(new URL('../public/design/family-header.js', import.meta.url), 'utf8');
test('REG-05/07: family-header never converts a temporary <body> scroll lock into a permanent clip', () => {
  const code = fh.slice(fh.indexOf('  function stickyRow()'), fh.indexOf('  var scheduled = false;'));
  const node = (tag, parent, overflow = 'visible', h = 60) => ({tagName: tag, parentElement: parent, id: '', attrs: {}, overflow, h,
    hasAttribute(k) { return k in this.attrs; }, setAttribute(k, v) { this.attrs[k] = v; }, getBoundingClientRect() { return {height: this.h}; }, closest() { return null; }});
  const html = node('HTML', null), body = node('BODY', html, 'hidden', 9000); // body mid-lock
  const wrapper = node('DIV', body, 'hidden', 9000); // a genuine overflow:hidden template wrapper
  const header = node('HEADER', wrapper, 'visible', 60);
  const btn = {closest: () => header};
  const document = {documentElement: html, body, querySelectorAll: () => [btn]};
  const ctx = {document, getComputedStyle: (n) => ({overflowX: n.overflow, overflowY: n.overflow})};
  vm.createContext(ctx); vm.runInContext(code + ';stickyRow();', ctx);
  assert.ok(header.hasAttribute('data-ahv-fh-sticky'));
  assert.ok(wrapper.hasAttribute('data-ahv-fh-clip'), 'a real overflow:hidden wrapper is still clipped for sticky');
  assert.equal(body.hasAttribute('data-ahv-fh-clip'), false, '<body> is never marked');
  assert.equal(html.hasAttribute('data-ahv-fh-clip'), false);
});
