// Offline browser double for app/(english)/_families/consent-runtime.ts.
// Vendor scripts are recorded, never fetched; /api/lead/ answers from memory;
// beacon, XHR and image transports throw if anything reaches them.
import { runInNewContext } from "node:vm";

export const ORIGIN = "https://ayurvedichealingvillage.com";

export function runtimeFrom(source) {
  // Browsers receive the template literal's value. Insist it equals the source
  // text, so escapes cannot make this double run different code from a page.
  const raw = source.slice(source.indexOf("`") + 1, source.lastIndexOf("`"));
  const cooked = new Function(`return \`${raw}\`;`)();
  if (cooked !== raw) throw new Error("consent runtime text differs from its template value");
  return cooked;
}

export function browser(runtime, options = {}) {
  const {
    path = "/", search = "", hash = "", referrer = "", choice = "accepted",
    next = "none", measurement, receipt, replaceThrows = false, result = { ok: true, status: "received" },
  } = options;
  const items = new Map();
  const storage = {
    getItem: (key) => items.get(key) ?? null,
    setItem: (key, value) => items.set(key, String(value)),
    removeItem: (key) => items.delete(key),
  };
  const transport = { leadReceipts: [], external: [] };
  const vendorReads = [];
  const historyCalls = [];
  const timers = [];
  const location = {
    origin: ORIGIN, pathname: path, search, hash,
    get href() { return ORIGIN + this.pathname + this.search + this.hash; },
    assign(url) { transport.navigations = (transport.navigations || []).concat(String(url)); },
    reload() { ctx.reloads++; },
  };
  function replaceState(state, _title, url) {
    if (replaceThrows) throw new Error("SecurityError");
    const target = new URL(String(url), location.href);
    if (target.origin !== ORIGIN) throw new Error("cross-origin history entry");
    historyCalls.push({ state, url: String(url) });
    history.state = state;
    location.pathname = target.pathname;
    location.search = target.search;
    location.hash = target.hash;
  }
  // A bound function prints as [native code], like the browser's own method
  // before Next.js installs its history integration after hydration.
  const history = { state: null, replaceState: next === "pending" ? replaceState.bind(null) : replaceState };
  const ctx = {
    URL, URLSearchParams, JSON, Date, Promise,
    localStorage: storage, sessionStorage: storage, location, history,
    navigator: { sendBeacon(url) { transport.external.push(["beacon", String(url)]); throw new Error("beacon blocked"); } },
    XMLHttpRequest: function () { transport.external.push(["xhr"]); throw new Error("XHR blocked"); },
    Image: function () { transport.external.push(["image"]); throw new Error("image blocked"); },
    document: {
      referrer,
      addEventListener() {},
      createElement: () => ({}),
      getElementById: () => null,
      head: { appendChild(script) {
        if (!script.src) return;
        vendorReads.push({ src: script.src, href: location.href, referrer: ctx.document.referrer });
        if (script.src.includes("googletagmanager.com")) ctx.googleLoader = script.src;
      } },
    },
    setTimeout(fn) { timers.push(fn); },
    reloads: 0, transport, vendorReads, historyCalls,
  };
  ctx.window = ctx;
  if (next !== "none") ctx.next = { version: "15", appDir: true };
  ctx.fetch = async (input, init = {}) => {
    const url = new URL(typeof input === "string" ? input : input.url, location.href);
    if (url.origin === ORIGIN && url.pathname === "/api/lead/") {
      transport.leadReceipts.push(JSON.parse(init.body || "{}"));
      return { status: 200, clone: () => ({ json: async () => result }) };
    }
    transport.external.push(["fetch", url.href]);
    throw new Error("network blocked");
  };
  ctx.settle = () => { history.replaceState = replaceState; };
  ctx.flush = (rounds = 200) => { for (let i = 0; i < rounds && timers.length; i++) timers.shift()(); };
  ctx.timersPending = () => timers.length;
  runInNewContext(`var cfg=${JSON.stringify({ measurement })};var host=document.body;${runtime}`, ctx);
  if (choice !== "none") ctx.AHV_SET_CONSENT({
    analytics: choice === "accepted" || choice === "analytics",
    advertising: choice === "accepted" || choice === "advertising",
  });
  if (receipt) runInNewContext(receipt, ctx);
  return ctx;
}
