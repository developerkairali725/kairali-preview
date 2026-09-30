// Footer reachability (PARENT-DESIGN-QA-TRIAGE): a tall footer necessarily has its upper links above the viewport
// at page bottom, so "rect above the viewport at max scroll" proves nothing. This tool scrolls UP from the bottom
// (real mouse-wheel steps, so the site's scroll-driven header behaves as for a person) until each footer link is
// fully inside the viewport, clear of every fixed/sticky layer (header, contact bar, chat controls, cookie notice),
// and hit-tests to itself; then confirms it is clickable (Playwright trial click — actionability only, nothing is
// followed) and keyboard-reachable (real Tab presses through the footer: focus reached, :focus-visible, visible focus
// indicator, and not obscured by a fixed layer when focused).
//
// Two consent states per page/viewport:
//   before-choice  fresh visitor, the notice is left exactly as the site shows it (never auto-dismissed);
//   after-choice   an ordinary choice is made in the notice's own UI ("Decline" — the first button), then measured.
// Nothing is changed in storage directly and no link is followed.
//
//   node tools/footer-reachability.mjs --base http://127.0.0.1:4471 --out /tmp/footer [--routes /,/about-us/] [--viewports 1440,390] [--shots]
//   hosted: vercel env run -- bash -c "cd sites/ayurvedichealingvillage.com && node tools/footer-reachability.mjs --base https://ahv-final-staging.vercel.app --out <dir>"
import path from "node:path";
import fs from "node:fs";
import { attachStagingToken } from "./lib/staging-auth.mjs";
import { classifyHref } from "./lib/link-class.mjs";
import { arg, flag, baseArg, outDir, writeJson, nowIso, istStamp, runContext, line, playwright } from "./lib/verify-common.mjs";

const BASE = baseArg();
const OUT = outDir("/tmp/ahv-footer-reachability");
const ROUTES = arg("routes", "/,/about-us/,/contact-us/,/festivals/,/de/").split(",");
const VIEWPORTS = arg("viewports", "1440,390").split(",").map(Number);
const STATES = arg("states", "before-choice,after-choice").split(",");
const SHOTS = flag("shots");
const run = { ...runContext(BASE), tool: "tools/footer-reachability.mjs", at: nowIso(), ist: istStamp(), routes: ROUTES, viewports: VIEWPORTS, states: STATES };
console.log(`footer reachability @ ${BASE} (${run.note})`);
function keyboardFails(x) {
  return !x.reachable || x.clickable !== true || !x.keyboard.reached || !x.keyboard.inViewport || !x.keyboard.focusVisible || !x.keyboard.indicator || x.keyboard.obscuredWhenFocused.some(o=>o.fraction>=0.99);
}
function assertNoticeDismissed(notices) {
  if (notices.length) throw new Error("after-choice notice remains visible: " + notices.join(", "));
}
const results = [];

// fixed/sticky layers that can sit over footer links, named for the report. Installed into the page once per load
// through Playwright's own evaluate channel (no eval/script tag, so a CSP cannot interfere).
const INSTALL_LAYERS = () => {
  // the design's own notice button, in English or in the locale's translation of the same label (window.__AHV_T)
  window.__verifyIsAccept = (b) => { const t = (b.textContent || "").trim(); const tr = (window.__AHV_T || {})["Accept all"] || (window.__AHV_T || {})["Accept All"]; return /^accept all$/i.test(t) || (!!tr && t.toLowerCase() === tr.toLowerCase()); };
  window.__verifyLayers = () => { const isAccept = window.__verifyIsAccept;
  const vis = (e) => { const s = getComputedStyle(e); return s.display !== "none" && s.visibility !== "hidden" && +s.opacity > 0.05 && e.getClientRects().length > 0; };
  const footer = [...document.querySelectorAll("footer")].filter((f) => f.getClientRects().length && f.getBoundingClientRect().height > 0).pop();
  const name = (e) => e.matches("#ahv-consent") || e.closest("#ahv-consent") ? "cookie notice"
    : e.matches("#ahv-cta-bar,[data-ahv-cta-bar]") ? "contact bar"
    : e.matches("#ahv-contact-controls") || /chatbase/i.test(e.id + " " + e.className) ? "chat controls"
    : e.matches("header,[data-ahv-fh-sticky]") || e.querySelector("header") ? "header"
    : [...e.querySelectorAll("button")].some((b) => isAccept(b)) ? "cookie notice (design)" : `${e.tagName.toLowerCase()}${e.id ? "#" + e.id : ""}`;
  const out = [];
  for (const e of document.querySelectorAll("body *")) {
    const pos = getComputedStyle(e).position; if (pos !== "fixed" && pos !== "sticky") continue;
    if (!vis(e) || (footer && (footer.contains(e) || e.contains(footer)))) continue;
    const r = e.getBoundingClientRect(); if (r.width < 2 || r.height < 2 || r.right <= 0 || r.left >= innerWidth || r.bottom <= 0 || r.top >= innerHeight) continue;
    if (out.some((o) => o.el.contains(e))) continue;
    // This wrapper is transparent flex layout; only its rendered controls obstruct content.
    // Other fixed/sticky layers retain their full rectangles (including cookie panels and contact bars).
    const children = e.matches("#ahv-contact-controls") ? [...e.querySelectorAll("a[href],button")].filter(vis) : [];
    const obstacles = children.length ? children : [e];
    for (const target of obstacles) {
      const box = target.getBoundingClientRect();
      out.push({ el: target, name: name(e), r: { l: box.left, t: box.top, r: box.right, b: box.bottom }, pe: getComputedStyle(target).pointerEvents });
    }
  }
  return out;
}; };

const { chromium } = await playwright();
const browser = await chromium.launch();
for (const w of VIEWPORTS) for (const route of ROUTES) for (const state of STATES) {
  const tag = `${route}@${w} ${state}`;
  const h = w < 800 ? 844 : 900;
  const ctx = await browser.newContext({ viewport: { width: w, height: h }, isMobile: w < 800, hasTouch: w < 800 });
  await attachStagingToken(ctx, BASE);
  const pg = await ctx.newPage();
  const rec = { route, w, state };
  try {
    const resp = await pg.goto(BASE + route, { waitUntil: "networkidle", timeout: 120000 }); await pg.waitForTimeout(2500);
    rec.status = resp ? resp.status() : 0; rec.finalUrl = pg.url();
    await pg.evaluate(INSTALL_LAYERS);
    rec.noticeBefore = await pg.evaluate(() => { const own = document.getElementById("ahv-consent"); const design = [...document.querySelectorAll("button")].find((b) => window.__verifyIsAccept(b) && !b.closest("#ahv-consent")); return { own: !!(own && own.getClientRects().length), design: !!(design && design.getClientRects().length) }; });
    if (state === "after-choice") {
      // the notice's own first button ("Decline"); on the design homepage the design notice's decline sibling
      const clicked = await pg.evaluate(() => {
        const own = document.getElementById("ahv-consent");
        let btn = own ? own.querySelector("button") : null;
        if (!btn) { const acc = [...document.querySelectorAll("button")].find((b) => window.__verifyIsAccept(b)); if (acc) btn = [...acc.parentElement.querySelectorAll("button")].find((b) => b !== acc) || null; }
        if (!btn) return null; const t = btn.textContent.trim(); btn.click(); return t;
      });
      rec.choice = clicked ? `clicked "${clicked}" in the notice` : "no notice shown (nothing to choose)";
      await pg.waitForTimeout(800);
      rec.noticeAfterChoice = await pg.evaluate(() => window.__verifyLayers().filter(l=>l.name.startsWith("cookie notice")).map(l=>l.name));
      assertNoticeDismissed(rec.noticeAfterChoice);
    } else rec.choice = "none (notice left as shown)";
    await pg.evaluate(INSTALL_LAYERS);
    // tag footer links
    const links = await pg.evaluate(() => {
      const footer = [...document.querySelectorAll("footer")].filter((f) => f.getClientRects().length && f.getBoundingClientRect().height > 0).pop();
      if (!footer) return null;
      return [...footer.querySelectorAll("a[href]")].filter((a) => a.getClientRects().length).map((a, i) => { a.setAttribute("data-verify-fl", String(i)); return { i, href: a.getAttribute("href"), text: (a.innerText || a.getAttribute("aria-label") || "").replace(/\s+/g, " ").trim().slice(0, 50), tabIndex: a.tabIndex }; });
    });
    if (!links) { rec.error = "no visible footer"; throw new Error("no visible footer"); }
    rec.links = links.map((l) => ({ ...l, url: classifyHref(l.href, pg.url(), new URL(BASE).origin).url, kind: classifyHref(l.href, pg.url(), new URL(BASE).origin).kind }));
    // 1. bottom, then wheel upward until every link has been clear at least once
    await pg.mouse.move(Math.round(w / 2), Math.round(h / 2));
    await pg.evaluate(() => window.scrollTo(0, document.documentElement.scrollHeight)); await pg.waitForTimeout(1200);
    if (SHOTS) await pg.screenshot({ path: path.join(OUT, `${route.replace(/\W+/g, "_") || "home"}-${w}-${state}-bottom.png`) });
    const reach = {}; const blockedBy = {}; const positions = [];
    for (let step = 0; step < 60; step++) {
      const snap = await pg.evaluate(() => {
        const layers = window.__verifyLayers();
        const res = {};
        for (const a of document.querySelectorAll("[data-verify-fl]")) {
          const i = a.getAttribute("data-verify-fl"); const r = a.getBoundingClientRect();
          const inside = r.width > 0 && r.height > 0 && r.top >= 0 && r.left >= 0 && r.bottom <= innerHeight && r.right <= innerWidth;
          if (!inside) { res[i] = { inside: false }; continue; }
          const over = layers.filter((o) => !(o.r.r <= r.left || o.r.l >= r.right || o.r.b <= r.top || o.r.t >= r.bottom)).map((o) => o.name);
          // hit-test the centre of every line box: an inline link that wraps has a bounding box whose centre can fall
          // on its parent paragraph's text
          const frags = [...a.getClientRects()].filter((f) => f.width > 1 && f.height > 1);
          const hits = frags.map((f) => document.elementFromPoint(f.left + f.width / 2, f.top + f.height / 2));
          const selfHit = hits.some((h) => h && (h === a || a.contains(h)));
          const hit = hits.find((h) => h && !(h === a || a.contains(h))) || null;
          res[i] = { inside: true, over, hitSelf: selfHit, hitBy: !selfHit && hit ? (hit.closest("#ahv-consent") ? "cookie notice" : hit.tagName.toLowerCase() + (hit.id ? "#" + hit.id : "")) : null };
        }
        return { y: Math.round(scrollY), layers: layers.map((l) => l.name), res, footerTop: Math.round([...document.querySelectorAll("footer")].filter((f) => f.getClientRects().length && f.getBoundingClientRect().height > 0).pop().getBoundingClientRect().top) };
      });
      positions.push({ y: snap.y, layers: snap.layers });
      for (const [i, s] of Object.entries(snap.res)) {
        if (reach[i]) continue;
        if (s.inside && !s.over.length && s.hitSelf) reach[i] = { y: snap.y };
        else if (s.inside) blockedBy[i] = [...new Set([...(blockedBy[i] || []), ...s.over, ...(s.hitBy ? [s.hitBy] : [])])];
      }
      if (Object.keys(reach).length === links.length) break;
      if (snap.footerTop > h) break; // the whole footer has scrolled below the viewport: every position was tried
      await pg.mouse.wheel(0, -Math.round(h * 0.35)); await pg.waitForTimeout(450);
    }
    // 2. clickable: trial click at the position where the link was clear
    const click = {};
    for (const l of links) {
      const r = reach[l.i]; if (!r) continue;
      await pg.evaluate((y) => window.scrollTo(0, y), r.y); await pg.waitForTimeout(250);
      try { await pg.locator(`[data-verify-fl="${l.i}"]`).click({ trial: true, timeout: 3000 }); click[l.i] = true; } catch (e) { click[l.i] = String(e.message).split("\n").find((x) => /intercept|not visible|outside|timeout/i.test(x))?.trim().slice(0, 160) || "trial click failed"; }
    }
    // 3. keyboard: real Tab presses through the footer, starting just before the first footer link
    const kb = {}; let focusShots = 0;
    await pg.evaluate(() => window.scrollTo(0, document.documentElement.scrollHeight)); await pg.waitForTimeout(500);
    await pg.locator('[data-verify-fl="0"]').focus(); await pg.keyboard.press("Shift+Tab"); await pg.waitForTimeout(100);
    // Include non-anchor form controls in the finite traversal budget; missing links still fail below.
    rec.keyboardBudget = await pg.evaluate(() => [...document.querySelectorAll('a[href],button,input,select,textarea,[tabindex],summary')].filter(e=>e.tabIndex>=0 && e.getClientRects().length && !e.disabled && !e.closest('[inert]')).length + 10);
    for (let n = 0; n < rec.keyboardBudget; n++) {
      await pg.keyboard.press("Tab"); await pg.evaluate(async () => { let last = -1, same = 0; const t0 = Date.now(); while (same < 3 && Date.now() - t0 < 2000) { await new Promise((r) => setTimeout(r, 60)); if (scrollY === last) same++; else { same = 0; last = scrollY; } } }); // wait for any smooth scroll to settle
      const f = await pg.evaluate(() => {
        const a = document.activeElement; if (!a) return null; const i = a.getAttribute && a.getAttribute("data-verify-fl");
        if (i == null) return { i: null, tag: a.tagName, insideFooter: !!a.closest("footer") };
        const cs = getComputedStyle(a); const r = a.getBoundingClientRect();
        const layers = window.__verifyLayers();
        const area = Math.max(1, r.width * r.height);
        const over = layers.map((o) => { const iw = Math.min(o.r.r, r.right) - Math.max(o.r.l, r.left), ih = Math.min(o.r.b, r.bottom) - Math.max(o.r.t, r.top); return iw > 0 && ih > 0 ? { by: o.name, fraction: Math.round((iw * ih / area) * 100) / 100 } : null; }).filter(Boolean);
        return { i, focusVisible: a.matches(":focus-visible"), indicator: (cs.outlineStyle !== "none" && parseFloat(cs.outlineWidth) > 0) || (cs.boxShadow && cs.boxShadow !== "none") || cs.textDecorationLine.includes("underline"), outline: `${cs.outlineStyle} ${cs.outlineWidth}`, inViewport: r.width > 0 && r.height > 0 && r.top >= 0 && r.bottom <= innerHeight && r.left >= 0 && r.right <= innerWidth, obscuredBy: over };
      });
      if (!f) continue;
      if (f.i == null) { if (Object.keys(kb).length && !f.insideFooter) break; continue; }
      if (!kb[f.i]) { kb[f.i] = f; if (SHOTS && focusShots < 3 && f.obscuredBy.some((o) => o.fraction >= 0.99)) { focusShots++; const fp = path.join(OUT, `${route.replace(/\W+/g, "_") || "home"}-${w}-${state}-focus-hidden-${f.i}.png`); await pg.screenshot({ path: fp }); f.screenshot = fp; } }
    }
    rec.results = rec.links.map((l) => ({ i: l.i, url: l.url, kind: l.kind, text: l.text,
      reachable: !!reach[l.i], atScrollY: reach[l.i] ? reach[l.i].y : null, blockedBy: reach[l.i] ? [] : (blockedBy[l.i] || ["never fully inside the viewport"]),
      clickable: click[l.i] === true ? true : (click[l.i] || (reach[l.i] ? "not tried" : false)),
      keyboard: kb[l.i] ? { reached: true, inViewport: kb[l.i].inViewport, focusVisible: kb[l.i].focusVisible, indicator: kb[l.i].indicator, outline: kb[l.i].outline, obscuredWhenFocused: kb[l.i].obscuredBy, screenshot: kb[l.i].screenshot || null } : { reached: false, tabIndex: l.tabIndex } }));
    const r = rec.results;
    rec.summary = { links: r.length, reachable: r.filter((x) => x.reachable).length, clickable: r.filter((x) => x.clickable === true).length, keyboardReached: r.filter((x) => x.keyboard.reached).length, focusVisible: r.filter((x) => x.keyboard.focusVisible && x.keyboard.indicator).length,  layersSeen: [...new Set(positions.flatMap((p) => p.layers))] };
    // focus obscured: ENTIRELY hidden (≥ 99 % under one layer) fails WCAG 2.4.11 (AA) → FAIL; partly hidden (2.4.12, AAA) → WARN
    const fully = (x) => x.keyboard.reached && x.keyboard.obscuredWhenFocused.some((o) => o.fraction >= 0.99);
    const partly = (x) => x.keyboard.reached && x.keyboard.obscuredWhenFocused.length && !fully(x);
    const bad = r.filter(keyboardFails);
    rec.summary.focusFullyObscured = r.filter(fully).length; rec.summary.focusPartlyObscured = r.filter(partly).length;
    rec.status2 = bad.length ? "FAIL" : r.some(partly) ? "WARN" : "PASS";
    rec.warnings = r.filter(partly).map((x) => ({ i: x.i, url: x.url, text: x.text, obscuredWhenFocused: x.keyboard.obscuredWhenFocused }));
    rec.failures = bad.map((x) => ({ i: x.i, url: x.url, text: x.text, reachable: x.reachable, blockedBy: x.blockedBy, clickable: x.clickable, keyboard: x.keyboard }));
  } catch (e) { rec.status2 = "FAIL"; rec.error = rec.error || String(e.message).slice(0, 200); }
  results.push(rec);
  line(rec.status2, tag, rec.summary ? { ...rec.summary, choice: rec.choice, notice: rec.noticeBefore, firstFailures: (rec.failures || []).slice(0, 3).map((f) => `${f.text || f.url}: ${!f.reachable ? "blocked by " + f.blockedBy.join("/") : f.clickable !== true ? "click " + f.clickable : !f.keyboard.reached ? "not reached by Tab" : !f.keyboard.inViewport ? "focused outside viewport" : f.keyboard.obscuredWhenFocused.length ? "focused entirely under " + f.keyboard.obscuredWhenFocused.map((o) => o.by).join("/") : "no visible focus"}`) } : { error: rec.error });
  await ctx.close();
}
await browser.close();
const summary = { PASS: results.filter((r) => r.status2 === "PASS").length, WARN: results.filter((r) => r.status2 === "WARN").length, FAIL: results.filter((r) => r.status2 === "FAIL").length };
writeJson(OUT, "footer-reachability.json", { run, summary, method: "wheel upward from the bottom; clear = fully inside viewport, no overlapping fixed/sticky layer, centre hit-tests to the link; clickable = Playwright trial click at that position; keyboard = real Tab through the footer", results });
console.log(`\nsummary: ${JSON.stringify(summary)} → ${path.join(OUT, "footer-reachability.json")}`);
process.exit(summary.FAIL ? 1 : 0);
