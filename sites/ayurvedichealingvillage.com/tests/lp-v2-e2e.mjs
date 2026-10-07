// tests/lp-v2-e2e.mjs — run manually (not part of `pnpm test`):
//   node tests/lp-v2-e2e.mjs http://localhost:<port> [outDir]
//   LP_E2E_ONLY=5,6 node tests/lp-v2-e2e.mjs …   runs only the listed sections (1–6)
// Needs a server with the pilot. Country is simulated with the `cf-ipcountry` header (middleware.ts maps it to x-lp-country).
// Never submits a real lead: /api/lead/ is either left unconfigured (503) or intercepted with a local mock.
import { chromium } from "@playwright/test";
import fs from "node:fs";

const base = (process.argv[2] || "http://localhost:4481").replace(/\/$/, "");
const out = process.argv[3] || "docs/lp-v2/screens/15";
fs.mkdirSync(out, { recursive: true });
const only = (process.env.LP_E2E_ONLY || "").split(",").map((x) => x.trim()).filter(Boolean);
const run = (n) => !only.length || only.includes(String(n));
const fail = [];
const notes = [];
const ok = (m) => notes.push(m);
const browser = await chromium.launch();
const url = (v) => `${base}/lp-v2/panchakarma/${v}`;
const ctxFor = async (w, h, country) => {
  const ctx = await browser.newContext({
    viewport: { width: w, height: h }, ...(w < 768 ? { hasTouch: true, isMobile: true } : {}),
    extraHTTPHeaders: { "cf-ipcountry": country, "accept-language": "en" },
  });
  ctx.setDefaultNavigationTimeout(120000); // a cold dev server compiles on first hit
  return ctx;
};

// Awards logos are rendered on variant A only (sections.css: [data-variant="A"] .lp-proof__awards{display:flex}); B/C/D have none by design.
// ---- 1. Matrix: 4 variants x 2 widths x IN/DE -------------------------------------------------------------
if (run(1)) for (const v of ["a", "b", "c", "d"]) for (const [w, h] of [[1440, 800], [390, 844]]) for (const country of ["IN", "DE"]) {
  const tag = `${v} ${w} ${country}`;
  const ctx = await ctxFor(w, h, country);
  const page = await ctx.newPage();
  const requests = [];
  page.on("request", (r) => requests.push(r.url()));
  const errors = [];
  page.on("pageerror", (e) => errors.push(e.message));
  await page.goto(url(v), { waitUntil: "networkidle" });
  if (errors.length) fail.push(`${tag}: page errors ${errors.join(" | ")}`);
  if (await page.evaluate(() => document.documentElement.scrollWidth > window.innerWidth + 1)) fail.push(`${tag}: horizontal overflow`);
  const scrollers = await page.evaluate(() => [...document.querySelectorAll("body *")].filter((e) => { const s = getComputedStyle(e); return (s.overflowX === "auto" || s.overflowX === "scroll") && e.scrollWidth > e.clientWidth + 1; }).length);
  if (w < 768 && scrollers) fail.push(`${tag}: ${scrollers} horizontal scrollers`);
  if (w === 1440) {
    // Live default form is one step; the ConsultBar / hero card is the only "step 1" surface. Skip when absent.
    const bottom = await page.evaluate(() => { const el = document.querySelector(".lp-consultbar, .lp-hero .lp-consult"); return el ? el.getBoundingClientRect().bottom : null; });
    if (bottom === null) ok(`${tag}: no ConsultBar/hero card; step-1 height check skipped`);
    else if (bottom > 780) fail.push(`${tag}: ConsultBar/hero card ends at ${Math.round(bottom)}px (>780)`);
  }
  const tiny = await page.evaluate(() => [...document.querySelectorAll("body *")].filter((e) => [...e.childNodes].some((n) => n.nodeType === 3 && n.textContent.trim()) && getComputedStyle(e).display !== "none" && parseFloat(getComputedStyle(e).fontSize) < 12 && !e.closest(".lp-sr")).map((e) => e.className || e.tagName).slice(0, 5));
  if (tiny.length) fail.push(`${tag}: elements under 12px: ${tiny.join(", ")}`);
  const banner = await page.getByRole("button", { name: /accept all/i }).count();
  if (country === "IN" && banner) fail.push(`${tag}: consent banner shown`);
  if (country === "DE" && !banner) fail.push(`${tag}: consent banner missing`);
  if (country === "DE" && requests.some((u) => /facebook\.net|googleads|googletagmanager|clarity\.ms|chatbase|youtube|ytimg/.test(u))) fail.push(`${tag}: third-party request before consent`);
  if (requests.some((u) => /\/design\/.*\.js/.test(u))) fail.push(`${tag}: /design/*.js loaded`);
  const html = await page.content();
  if (/in minutes|within \d+ hours?/i.test(html)) fail.push(`${tag}: reply-time promise in page`);
  if (!/noindex/.test(await page.locator('meta[name="robots"]').getAttribute("content").catch(() => "") || "")) fail.push(`${tag}: robots noindex missing`);
  // Proof area (Task 18)
  const proof = await page.locator(".lp-proof").first().innerText();
  if (!/4\.6/.test(proof) || !/450/.test(proof) || !/as of August 2026/i.test(proof)) fail.push(`${tag}: proof area lacks Tripadvisor 4.6 / 450 / as of August 2026`);
  if (/google/i.test(proof)) fail.push(`${tag}: Google item present in proof area`);
  if (/\[(C\d+b?|\d(\.\d)?x?|N|\d*x+)\]/i.test(proof)) fail.push(`${tag}: bracket placeholder in proof area: ${proof.match(/\[[^\]]+\]/)}`);
  const logos = await page.evaluate(() => [...document.querySelectorAll(".lp-proof__awards img")].flatMap((i) => [i.getAttribute("src"), (i.getAttribute("srcset") || "").split(",")[0].trim().split(" ")[0]]));
  const srcs = await page.evaluate(() => [...document.querySelectorAll(".lp-proof__awards source")].map((s) => s.srcset.split(",")[0].trim().split(" ")[0]));
  if (v === "a" && !logos.length) fail.push(`${tag}: no award logos`);
  for (const u of new Set([...logos, ...srcs].filter((u) => u && !u.startsWith("data:")))) {
    const r = await ctx.request.get(new URL(u, base).href);
    if (r.status() !== 200) fail.push(`${tag}: award logo ${u} -> ${r.status()}`);
  }
  await page.screenshot({ path: `${out}/${v}-${w}-${country}.png`, fullPage: true });
  await ctx.close();
}

// ---- 2. Form: unconfigured (503), then intercepted success, channel URLs carry no personal data ---------------
const NAME = "Zed Testperson", EMAIL = "zed.testperson@example.invalid", PHONE = "+91 98765 43210", MSG = "Back pain test message";
async function fillForm(page) {
  await page.locator("#enquiry").scrollIntoViewIfNeeded();
  const form = page.locator("form.lp-enq__form");
  await form.locator('input[name="fullName"]').fill(NAME);
  await form.locator('input[name="email"]').fill(EMAIL);
  await form.locator('input[name="phone"]').fill(PHONE);
  await form.locator('textarea[name="message"]').fill(MSG);
  await form.locator('input[name="consent"]').check();
  return form;
}
if (run(2)) {
  const ctx = await ctxFor(1440, 900, "IN");
  const page = await ctx.newPage();
  await page.goto(url("a"), { waitUntil: "networkidle" });
  const form = await fillForm(page);
  await form.locator('button[type="submit"]').click();
  await page.waitForFunction(() => !/Sending…/.test(document.querySelector("#enquiry")?.innerText || ""), null, { timeout: 30000 }).catch(() => {});
  const txt = await page.locator("#enquiry").innerText();
  const done = await page.locator(".lp-enq__done").count();
  if (done) fail.push("form 503: success screen shown without a stored lead");
  if (!/not connected yet|Nothing has been saved/i.test(txt)) fail.push(`form 503: verbatim not-connected message missing. Got: ${txt.slice(-300)}`);
  else ok("form 503: not-connected message shown verbatim, no success screen");
  await page.screenshot({ path: `${out}/form-503.png`, fullPage: false });
  await ctx.close();
}
if (run(2)) {
  const ctx = await ctxFor(390, 844, "IN");
  const page = await ctx.newPage();
  await page.route("**/api/lead/", (r) => r.fulfill({ status: 200, contentType: "application/json", body: JSON.stringify({ status: "received" }) }));
  await page.goto(url("a"), { waitUntil: "networkidle" });
  const form = await fillForm(page);
  await form.locator('button[type="submit"]').click();
  await page.waitForSelector(".lp-enq__done", { timeout: 15000 });
  const links = await page.$$eval(".lp-enq__done a", (as) => as.map((a) => ({ t: a.textContent.trim(), h: a.href })));
  const refTxt = await page.locator(".lp-enq__ref").innerText();
  const ref = (refTxt.match(/KT-[A-Z0-9]{6}/) || [])[0];
  if (!ref) fail.push(`success: ref code missing (${refTxt})`);
  const pii = [NAME, "Testperson", "Zed", EMAIL, "zed.test", "9876543210", "98765", MSG, "Back pain", "panchakarma"].flatMap((s) => [s, encodeURIComponent(s)]);
  for (const l of links) {
    if (pii.some((p) => l.h.toLowerCase().includes(p.toLowerCase()))) fail.push(`success: personal data in channel URL ${l.t}: ${l.h}`);
  }
  const ig = links.find((l) => /instagram/i.test(l.t));
  if (!ig || ig.h !== `https://ig.me/m/kairaliayurvedichealingvillage?ref=${ref}`) fail.push(`success: Instagram URL unexpected: ${ig?.h}`);
  if (!links.some((l) => /wa\.me/.test(l.h)) || !links.some((l) => /m\.me/.test(l.h)) || !links.some((l) => l.h.startsWith("tel:"))) fail.push("success: WhatsApp/Messenger/Phone buttons missing");
  if (/within \d|in minutes/i.test(await page.locator(".lp-enq__done").innerText())) fail.push("success: reply-time wording");
  ok(`success: ref ${ref}; channel URLs ${links.map((l) => l.h).join("  ")}`);
  await page.screenshot({ path: `${out}/form-success-390.png`, fullPage: false });
  await ctx.close();
}

// ---- 3. Keyboard: focus visible, not hidden under the mobile bar; dialogs trap focus, Esc closes, focus returns ---
if (run(3)) {
  const ctx = await ctxFor(390, 844, "IN");
  const page = await ctx.newPage();
  await page.goto(url("a"), { waitUntil: "networkidle" });
  let bad = 0, steps = 0, seen = new Set();
  for (let i = 0; i < 160; i++) {
    await page.keyboard.press("Tab");
    const r = await page.evaluate(() => {
      const e = document.activeElement;
      if (!e || e === document.body || e.tagName === "NEXTJS-PORTAL") return null;
      const s = getComputedStyle(e);
      const visible = (s.outlineStyle !== "none" && parseFloat(s.outlineWidth) > 0) || (s.boxShadow && s.boxShadow !== "none");
      const b = e.getBoundingClientRect();
      const bar = document.querySelector(".lp-bar")?.getBoundingClientRect();
      const hidden = bar && !e.closest(".lp-bar") && b.bottom > bar.top + 1 && b.top < bar.bottom && getComputedStyle(document.querySelector(".lp-bar")).display !== "none";
      return { id: e.outerHTML.slice(0, 80), visible, hidden, top: b.top, bottom: b.bottom, vh: innerHeight };
    });
    if (!r) continue;
    steps++;
    if (seen.has(r.id) && seen.size > 20) break;
    seen.add(r.id);
    if (!r.visible) { bad++; fail.push(`keyboard: no visible focus on ${r.id}`); }
    if (r.hidden) { bad++; fail.push(`keyboard: focus under mobile bar on ${r.id}`); }
  }
  ok(`keyboard: ${steps} tab stops walked, ${bad} problems`);
  await ctx.close();
}
if (run(3)) {
  const ctx = await ctxFor(1440, 900, "IN");
  const page = await ctx.newPage();
  await page.goto(url("a"), { waitUntil: "networkidle" });
  const dialogs = [
    ["Gallery", () => page.getByRole("button", { name: /view all photos/i }).first()],
    ["Ask", () => page.getByRole("button", { name: /ask anything/i }).first()],
    ["Locale", () => page.locator(".lp-header button, header button").filter({ hasText: /EN ·/ }).first()],
  ];
  for (const [name, get] of dialogs) {
    const trig = get();
    await trig.scrollIntoViewIfNeeded();
    await trig.focus();
    await trig.press("Enter");
    const dlg = page.locator('dialog[open]').first();
    try { await dlg.waitFor({ timeout: 4000 }); } catch { fail.push(`dialog ${name}: did not open`); continue; }
    let escaped = false;
    for (let i = 0; i < 40; i++) {
      await page.keyboard.press("Tab");
      if (!(await page.evaluate(() => !!document.activeElement?.closest("dialog[open]")))) { escaped = true; break; }
    }
    if (escaped) fail.push(`dialog ${name}: focus escaped the dialog`);
    await page.keyboard.press("Escape");
    await page.waitForTimeout(300);
    if (await page.locator('dialog[open]').count()) fail.push(`dialog ${name}: Esc did not close`);
    const back = await page.evaluate(() => document.activeElement?.outerHTML.slice(0, 80));
    const trigHtml = await trig.evaluate((e) => e.outerHTML.slice(0, 80));
    if (back !== trigHtml) fail.push(`dialog ${name}: focus did not return to trigger (got ${back})`);
    else ok(`dialog ${name}: opens, traps, Esc closes, focus returns`);
  }
  await ctx.close();
}

// ---- 4. Currency EUR while fees pending -> [C2] placeholder, no crash --------------------------------------------
if (run(4)) {
  const ctx = await ctxFor(1440, 900, "IN");
  const page = await ctx.newPage();
  const errs = [];
  page.on("pageerror", (e) => errs.push(e.message));
  await page.goto(url("a"), { waitUntil: "networkidle" });
  await page.getByRole("button", { name: /^EUR$/ }).first().click();
  await page.waitForTimeout(500);
  const body = await page.locator("body").innerText();
  if (!/\[C2\]/.test(body)) fail.push("currency EUR: [C2] placeholder not shown");
  if (errs.length) fail.push(`currency EUR: page errors ${errs.join("|")}`);
  else ok("currency EUR: [C2] placeholder shown, no page errors");
  await page.screenshot({ path: `${out}/currency-eur-1440.png`, fullPage: false });
  await ctx.close();
}

// ---- 5. Cookie preferences (EU): accept, then the footer control withdraws the choice and the banner returns ----
if (run(5)) for (const [v, w, h] of [["a", 1440, 900], ["d", 390, 844]]) {
  const tag = `cookie-prefs ${v} ${w} DE`;
  const ctx = await ctxFor(w, h, "DE");
  await ctx.route("**/api/lead/**", (r) => r.fulfill({ status: 200, contentType: "application/json", body: JSON.stringify({ status: "received" }) }));
  const page = await ctx.newPage();
  const errors = [];
  page.on("pageerror", (e) => errors.push(e.message));
  await page.goto(url(v), { waitUntil: "networkidle" });
  const accept = page.getByRole("button", { name: /accept all/i });
  if (!(await accept.count())) { fail.push(`${tag}: banner not shown on first visit`); await ctx.close(); continue; }
  await accept.click();
  await page.waitForTimeout(300);
  const stored = await page.evaluate(() => localStorage.getItem("kairali-consent-v1"));
  if (await accept.count()) fail.push(`${tag}: banner still shown after Accept`);
  if (!stored || !/"granted":true/.test(stored)) fail.push(`${tag}: choice not stored after Accept (${stored})`);
  await page.reload({ waitUntil: "networkidle" });
  if (await page.getByRole("button", { name: /accept all/i }).count()) fail.push(`${tag}: banner came back on reload after Accept`);
  const prefs = page.locator("footer [data-ahv-cookie-choices]");
  if (!(await prefs.count())) { fail.push(`${tag}: Cookie preferences control missing`); await ctx.close(); continue; }
  await prefs.scrollIntoViewIfNeeded();
  await Promise.all([page.waitForEvent("load", { timeout: 15000 }), prefs.click()]);
  // The reload re-renders the banner on hydration; wait for it rather than for network idle.
  await page.getByRole("button", { name: /accept all/i }).waitFor({ timeout: 15000 }).catch(() => {});
  const back = await page.getByRole("button", { name: /accept all/i }).count();
  const after = await page.evaluate(() => localStorage.getItem("kairali-consent-v1"));
  if (!back) fail.push(`${tag}: banner did not return after Cookie preferences`);
  if (after !== null) fail.push(`${tag}: stored choice not cleared (${after})`);
  if (errors.length) fail.push(`${tag}: page errors ${errors.join(" | ")}`);
  if (back && after === null && !errors.length) ok(`${tag}: Accept stored the choice; Cookie preferences cleared it and the banner returned`);
  await ctx.close();
}

// ---- 6. Tap targets: every standalone link/button/summary >= 48px at 390 and 1440 (inline text links exempt) ------
// The consent banner is @kairali/consent's (shared package, outside this kit) and is measured separately as a note.
const MEASURE = () => {
  const vis = (e) => { const s = getComputedStyle(e); const b = e.getBoundingClientRect(); return s.display !== "none" && s.visibility !== "hidden" && b.width > 0 && b.height > 0 && !e.closest("[hidden],[aria-hidden='true'],.lp-sr,.lp-enq__hp"); };
  const out = [];
  for (const e of document.querySelectorAll("a[href], button, summary, [role='button']")) {
    if (!vis(e) || e.closest("[data-consent-banner]")) continue;
    if (e.tagName === "A" && getComputedStyle(e).display === "inline") continue; // inline text link inside running text
    const b = e.getBoundingClientRect();
    if (b.height < 47.5 || b.width < 47.5) out.push(`${e.tagName.toLowerCase()}.${String(e.className).split(" ")[0] || "-"} "${(e.textContent || e.getAttribute("aria-label") || "").trim().slice(0, 24)}" ${Math.round(b.width)}x${Math.round(b.height)}`);
  }
  return out;
};
if (run(6)) for (const v of ["a", "b", "c", "d"]) for (const [w, h] of [[390, 844], [1440, 900]]) {
  const tag = `tap ${v} ${w}`;
  const ctx = await ctxFor(w, h, "IN");
  // Every submit in this section gets a 500, so the error-state links (.lp-enq__msg-links) render. Nothing leaves the browser.
  await ctx.route("**/api/lead/**", (r) => r.fulfill({ status: 500, contentType: "application/json", body: JSON.stringify({ error: "test" }) }));
  const page = await ctx.newPage();
  await page.goto(url(v), { waitUntil: "networkidle" });
  const small = new Set(await page.evaluate(MEASURE));
  // Dialog close button (Ask anything is present on every variant).
  const ask = page.getByRole("button", { name: /ask anything/i }).first();
  if (await ask.count()) {
    await ask.scrollIntoViewIfNeeded(); await ask.click();
    const dlg = page.locator("dialog[open]").first();
    if (await dlg.waitFor({ timeout: 4000 }).then(() => true).catch(() => false)) {
      const cb = await dlg.locator(".lp-dlg__close").first().boundingBox();
      if (!cb || cb.width < 47.5 || cb.height < 47.5) small.add(`dialog close ${cb ? `${Math.round(cb.width)}x${Math.round(cb.height)}` : "missing"}`);
      for (const s of await page.evaluate(MEASURE)) small.add(s);
      await page.keyboard.press("Escape");
    } else fail.push(`${tag}: Ask dialog did not open`);
  }
  // Error state: fill and submit; the intercepted 500 shows the WhatsApp/email links.
  if (v === "a") {
    const form = await fillForm(page);
    await form.locator('button[type="submit"]').click();
    await page.waitForSelector(".lp-enq__msg-links a", { timeout: 15000 }).catch(() => fail.push(`${tag}: error-state links did not render`));
    for (const s of await page.evaluate(MEASURE)) small.add(s);
  }
  if (small.size) fail.push(`${tag}: targets under 48px: ${[...small].join("; ")}`);
  else ok(`${tag}: all standalone targets >= 48px${v === "a" ? " (incl. dialog close and error-state links)" : " (incl. dialog close)"}`);
  if (w === 390) {
    const banner = await page.evaluate(() => [...document.querySelectorAll("[data-consent-banner] button")].map((b) => Math.round(b.getBoundingClientRect().height)));
    if (banner.length) notes.push(`note ${tag}: consent banner buttons (shared package) ${banner.join("/")}px high`);
  }
  if (w === 390 || w === 1440) await page.screenshot({ path: `${out}/tap-${v}-${w}.png`, fullPage: true });
  await ctx.close();
}

await browser.close();
for (const n of notes) console.log("ok  ", n);
console.log(fail.length ? "FAIL\n" + fail.join("\n") : "PASS");
process.exit(fail.length ? 1 : 0);
