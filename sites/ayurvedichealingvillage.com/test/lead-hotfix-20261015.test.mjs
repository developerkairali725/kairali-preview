// AHV lead hotfix (15 Oct 2026, AHV-Q01.01-04). Live proof (train-g/proof-q01) showed the 12 localized
// /xx/ayurvedic-treatment-packages.html forms could never send a lead: captchaValid() read only an ancestor <label>,
// but those views put <label for="txtResult"> before input#txtResult; fname/email also carried no `required`. The
// landing script's status lines were English on all 36 locale URLs, and /lp/treatment-in-kerala-russian/ acknowledged
// on English /thanks/. Owner decision 14 Oct 2026: name and email required, phone optional.
// No real endpoint is reachable from any check here: the DOM test serves a synthetic https origin from memory and
// aborts every other request; /api/lead/ is answered locally.
import { test, before, after } from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import vm from "node:vm";
import { verifyInteractionOnlySource } from "../tools/verify-interaction-only-source.mjs";

const read = (p) => fs.readFileSync(new URL(`../${p}`, import.meta.url), "utf8");
const json = (p) => JSON.parse(read(p));
const LANDING = read("public/design/landing-page-form-submit.js");
const RECEIPT = read("public/design/lead-receipt.js");
const PREFIXES = ["hi", "de", "fr", "es", "it", "pt", "nl", "ru", "ar", "zh", "ja", "ko"];
const SITE_LANGUAGE = (p) => (p === "zh" ? "zh-Hans" : p);
const SUM_PROMPT = "Please check the sum before submitting.";

/** The landing script's message table, evaluated from its own source. */
function messageTable() {
  const start = LANDING.indexOf("  var messages = {");
  const end = LANDING.indexOf("\n  };\n", start);
  assert.ok(start > 0 && end > start, "message table present");
  return vm.runInNewContext("(" + LANDING.slice(start + "  var messages = ".length, end + 4).trim().replace(/;$/, "") + ")");
}

test("every localized status line is the approved catalogue entry already shipped by opd-form-submit.js", () => {
  const units = json("l10n/source/units.json").units;
  const messages = messageTable();
  assert.deepEqual(Object.keys(messages).sort(), ["notConnected", "offline", "received", "retry", "sending", "wait"]);
  for (const [key, set] of Object.entries(messages)) {
    const unit = units.find((u) => u.source === set.en);
    assert.ok(unit, `${key}: English source is a catalogue unit`);
    assert.ok(unit.files.includes("public/design/opd-form-submit.js"), `${key}: shipped by the OPD form`);
    assert.match(LANDING, new RegExp(`// ${unit.id}\\n\\s+${key}: \\{`), `${key}: unit id recorded beside it`);
    assert.equal(Object.keys(set).length, 13, `${key}: en + 12 locales`);
    for (const p of PREFIXES) {
      const lang = SITE_LANGUAGE(p);
      assert.equal(set[lang], json(`l10n/generated/${lang}.catalog.json`)[unit.id], `${key} ${lang}`);
    }
  }
  // No approved translation exists for the sum prompt: it stays English, once, and is not in the table.
  assert.equal(units.some((u) => u.source === SUM_PROMPT), false);
  assert.equal(LANDING.split(`'${SUM_PROMPT}'`).length - 1, 1);
});

function fixture(lang, responses) {
  const listeners = {}, requests = [], attrs = new Map();
  const fields = { email: "synthetic@example.test", fname: "Synthetic test", phone: "" };
  const elements = Object.entries(fields).map(([name, value]) => ({ name, value, type: "text", required: false }));
  elements.namedItem = (name) => elements.find((x) => x.name === name);
  const status = { textContent: "", classList: { contains: () => true } }, button = { disabled: false };
  const seen = [];
  const form = { id: "campaign", elements, getAttribute: (n) => attrs.get(n), hasAttribute: (n) => attrs.has(n), setAttribute: (n, v) => attrs.set(n, v), removeAttribute: (n) => attrs.delete(n), querySelector: (s) => (s.includes("submit") ? button : status), reportValidity: () => true, reset() {} };
  const context = {
    URLSearchParams, AbortController, crypto: { randomUUID: () => "b48b7aad-56ac-424a-844c-c1c45ab186ec" }, setTimeout: () => 1, clearTimeout() {},
    FormData: class { get(n) { return fields[n] || null; } },
    document: { referrer: "", getElementById: () => null, addEventListener: (n, fn) => (listeners[n] = fn), querySelectorAll: () => [form] },
    window: { location: { pathname: "/ayurvedic-treatment-packages.html", search: "", href: "https://example.test/" }, AHV_LEAD_RECEIPT: { attribution: () => ({}), siteLanguage: () => lang } },
    fetch: async (url, init) => {
      seen.push(status.textContent);
      requests.push({ url, body: JSON.parse(init.body) });
      const r = responses.shift();
      if (r === "abort") throw new Error("aborted");
      return { ok: r.status === 200, status: r.status, json: async () => r.body };
    },
  };
  vm.runInNewContext(LANDING, context);
  return { requests, status, seen, elements, submit: () => listeners.submit({ target: form, preventDefault() {}, stopImmediatePropagation() {} }) };
}

test("status and failure lines follow the page language; English stays byte-identical", async () => {
  const messages = messageTable();
  for (const lang of ["en", ...PREFIXES.map(SITE_LANGUAGE)]) {
    const view = fixture(lang, [
      { status: 502, body: { ok: false } }, "abort", { status: 429, body: {} },
      { status: 503, body: { code: "LEAD_STORE_NOT_CONFIGURED" } }, { status: 200, body: { ok: true, status: "received" } },
    ]);
    const after = [];
    for (let i = 0; i < 5; i++) { await view.submit(); after.push(view.status.textContent); }
    assert.deepEqual(view.seen, Array(5).fill(messages.sending[lang]), lang);
    assert.deepEqual(after, [messages.retry[lang], messages.offline[lang], messages.wait[lang], messages.notConnected[lang], messages.received[lang]], lang);
    // One token across the failed attempts and the success; payload contract unchanged.
    assert.equal(new Set(view.requests.map((r) => r.body.submissionToken)).size, 1);
    assert.equal(view.requests[0].url, "/api/lead/");
    assert.equal(view.requests[0].body.form, "landing-page");
    // Owner decision 14 Oct 2026: name and email become required on submit, phone never.
    assert.equal(view.elements.namedItem("fname").required, true);
    assert.equal(view.elements.namedItem("email").required, true);
    assert.equal(view.elements.namedItem("phone").required, false);
  }
  const en = messageTable();
  assert.equal(en.sending.en, "Sending…");
  assert.equal(en.received.en, "Thank you — your details have been received.");
  assert.equal(en.retry.en, "We could not confirm this was received. Your details are still here; please try again.");
});

test("the localized landing copies are the fixed script and stay interaction-only", () => {
  assert.ok(verifyInteractionOnlySource(LANDING, "public/design/landing-page-form-submit.js") === 17);
  for (const p of PREFIXES) assert.equal(read(`public/ahv/l10n/${p}/design/landing-page-form-submit.js`), LANDING, p);
});

function receiptPage(path) {
  const navigations = [], timers = [], store = new Map();
  const context = {
    window: { fetch: async () => ({ status: 200, clone: () => ({ json: async () => ({ ok: true, status: "received" }) }) }) },
    location: { href: "https://ayurvedichealingvillage.com" + path, origin: "https://ayurvedichealingvillage.com", pathname: path, search: "", assign: (t) => navigations.push(t) },
    sessionStorage: { getItem: (k) => store.get(k) ?? null, setItem: (k, v) => store.set(k, v), removeItem: (k) => store.delete(k) },
    document: { documentElement: { lang: "en" } }, setTimeout: (fn) => timers.push(fn), URL, URLSearchParams, Date,
  };
  vm.runInNewContext(RECEIPT, context);
  return { context, navigations, timers };
}

test("paid landers acknowledge on their own language's /thanks/ (Russian joins German)", async () => {
  for (const [path, target, lang] of [
    ["/lp/treatment-in-kerala-russian/", "/ru/thanks/", "ru"],
    ["/lp/behandlung-in-kerala/", "/de/thanks/", "de"],
    ["/lp/treatment-in-kerala/", "/thanks/", "en"],
    ["/lp/treatment-in-kerala-russian", "/thanks/", "en"],
    ["/ru/ayurvedic-treatment-packages.html", "/ru/thanks/", "ru"],
  ]) {
    const view = receiptPage(path);
    assert.equal(view.context.window.AHV_LEAD_RECEIPT.siteLanguage(), lang, path);
    await view.context.window.fetch("/api/lead/", { method: "POST", body: JSON.stringify({ form: "landing-page", submissionToken: "545404ff-a177-4f93-b5ab-10b90ee90d58" }) });
    view.timers.forEach((fn) => fn());
    assert.deepEqual(view.navigations, [target], path);
  }
  const routes = json("l10n/routes.json").routes["/thanks/"];
  assert.equal(routes.ru, "/ru/thanks/");
  assert.equal(routes.de, "/de/thanks/");
});

// ── DOM level: the real localized view markup in one headless Chromium ─────────────────────────────────────────────
const ORIGIN = "https://ahv-hotfix.test";
function viewForm(prefix, view, route) {
  const v = json(`public/ahv/l10n/${prefix}/views/ahv-page-${route}-${view}.json`);
  const form = v.template.match(/<form[\s\S]*?<\/form>/g).find((f) => /name="result"/.test(f));
  assert.ok(form, `${prefix} ${route} ${view}: form`);
  const q = v.logic.match(/(captchaQuestion|arithLabel): '((?:[^'\\]|\\.)*)' \+ (?:s\.capA|a) \+ ' \+ ' \+ (?:s\.capB|b) \+ ' \?'/);
  assert.ok(q, `${prefix} ${route} ${view}: localized sum label`);
  return form
    .replace(`{{ ${q[1]} }}`, `${q[2].replace(/\\'/g, "'")}7 + 6 ?`)
    .replace(/\s(on[A-Z][a-zA-Z]*|style-hover)="[^"]*"/g, "")
    .replace(/\saction="[^"]*"/, ` action="${ORIGIN}/blocked-native-post"`)
    .replace(/\{\{[^}]*\}\}/g, "");
}
function html(prefix, form, route) {
  return `<!doctype html><html lang="${prefix}"><head><meta charset="utf-8"><script>${RECEIPT}</script></head><body>
<div id="ahv-design-root" data-ahv-route="${route}">${form}</div><script>${LANDING}</script></body></html>`;
}

let browser;
before(async () => {
  const { chromium } = await import("@playwright/test");
  browser = await chromium.launch({ headless: true });
});
after(async () => { if (browser) await browser.close(); });

async function open(path, body) {
  const context = await browser.newContext();
  const leads = [], escaped = [];
  let reply = [];
  await context.route("**/*", async (route) => {
    const url = new URL(route.request().url());
    if (url.origin !== ORIGIN) { escaped.push(url.href); return route.abort(); }
    if (url.pathname.startsWith("/api/lead")) {
      leads.push(JSON.parse(route.request().postData()));
      const r = reply.shift() || { status: 200, body: { ok: true, status: "received" } };
      return route.fulfill({ status: r.status, contentType: "application/json", body: JSON.stringify(r.body) });
    }
    if (url.pathname === path) return route.fulfill({ status: 200, contentType: "text/html", body });
    if (/\/(thanks|remerciers)\/$/.test(url.pathname)) return route.fulfill({ status: 200, contentType: "text/html", body: "<!doctype html><title>thanks</title>" });
    return route.fulfill({ status: 404, body: "" }); // the synthetic origin only; nothing leaves the browser
  });
  const page = await context.newPage();
  await page.goto(ORIGIN + path);
  return { context, page, leads, escaped, setReply: (r) => { reply = r; } };
}
const status = (page) => page.evaluate(() => (document.querySelector(".ahv-landing-status") || {}).textContent || "");

test("localized packages forms (12 locales x desktop/mobile markup): correct sum sends once, empty and wrong sum are blocked", async () => {
  for (const prefix of PREFIXES) for (const view of ["desktop", "mobile"]) {
    const label = `${prefix} ${view}`;
    const path = `/${prefix}/ayurvedic-treatment-packages.html`;
    const t = await open(path, html(prefix, viewForm(prefix, view, "ayurvedic-treatment-packages"), "/ayurvedic-treatment-packages.html"));
    const { page } = t;
    // The defect: the sum's label is not an ancestor of the input (the pre-fix lookup found nothing).
    assert.equal(await page.evaluate(() => document.getElementById("txtResult").closest("label")), null, label);
    assert.equal(await page.evaluate(() => document.getElementById("txtResult").labels.length), 1, label);
    // Empty form: blocked by native validation on the name, nothing sent.
    await page.click("#btnSubmit");
    assert.equal(t.leads.length, 0, `${label}: empty`);
    assert.deepEqual(await page.evaluate(() => ["fname", "email", "phone"].map((n) => document.querySelector(`[name=${n}]`).required)), [true, true, false], label);
    assert.equal(await page.evaluate(() => document.querySelector("[name=fname]").validity.valueMissing), true, label);
    // Name + email, phone left empty, wrong sum: blocked with the (English-only) sum prompt.
    await page.fill("[name=fname]", "Hotfix Synthetic");
    await page.fill("[name=email]", "hotfix@example.invalid");
    await page.fill("[name=result]", "12");
    await page.click("#btnSubmit");
    assert.equal(t.leads.length, 0, `${label}: wrong sum`);
    assert.equal(await status(page), SUM_PROMPT, label);
    // Correct sum after a 502: retry line in the page language, values kept, same token on success.
    t.setReply([{ status: 502, body: { ok: false, code: "STORE_FAILED" } }]);
    await page.fill("[name=result]", "13");
    await page.click("#btnSubmit");
    await page.waitForFunction(() => document.querySelector("form").getAttribute("aria-busy") !== "true" && /\S/.test(document.querySelector(".ahv-landing-status").textContent) && document.querySelector(".ahv-landing-status").textContent !== "Please check the sum before submitting.");
    assert.equal(await status(page), messageTable().retry[SITE_LANGUAGE(prefix)], label);
    assert.equal(await page.inputValue("[name=fname]"), "Hotfix Synthetic", label);
    assert.equal(t.leads.length, 1, `${label}: one request per click`);
    await Promise.all([page.waitForURL(`${ORIGIN}${prefix === "fr" ? "/fr/remerciers/" : `/${prefix}/thanks/`}`).catch(() => null), page.click("#btnSubmit")]);
    assert.equal(t.leads.length, 2, `${label}: exactly one more request`);
    const [failed, sent] = t.leads;
    assert.equal(failed.submissionToken, sent.submissionToken, label);
    assert.equal(sent.form, "landing-page");
    assert.equal(sent.site_language, SITE_LANGUAGE(prefix));
    assert.equal(sent.fields.landing_page_path, path);
    assert.equal(sent.fields.fname, "Hotfix Synthetic");
    assert.equal(sent.fields.email, "hotfix@example.invalid");
    assert.equal(sent.fields.phone, "");
    assert.deepEqual(t.escaped, [], label);
    await t.context.close();
  }
});

test("the ancestor-label forms (localized Panchakarma) behave as before", async () => {
  for (const prefix of ["de", "ko"]) {
    const path = `/${prefix}/panchkarma-treatment.html`;
    const t = await open(path, html(prefix, viewForm(prefix, "desktop", "panchkarma-treatment"), "/panchkarma-treatment.html"));
    const { page } = t;
    assert.notEqual(await page.evaluate(() => document.querySelector("[name=result]").closest("label")), null);
    const requiredBefore = await page.evaluate(() => [...document.querySelectorAll("form [required]")].map((x) => x.name));
    await page.evaluate(() => {
      for (const el of document.querySelectorAll("form input, form textarea, form select")) {
        if (el.type === "checkbox") el.checked = true;
        else if (el.type !== "hidden" && el.type !== "submit" && el.type !== "radio") el.value = el.name === "email" ? "hotfix@example.invalid" : el.type === "tel" ? "+919000000000" : "x";
      }
    });
    await page.fill("[name=result]", "13");
    await Promise.all([page.waitForURL(`${ORIGIN}/${prefix}/thanks/`).catch(() => null), page.click("form [type=submit]")]);
    assert.equal(t.leads.length, 1, prefix);
    assert.ok(requiredBefore.includes("phone"), `${prefix}: existing required phone untouched`);
    assert.deepEqual(t.escaped, []);
    await t.context.close();
  }
});
