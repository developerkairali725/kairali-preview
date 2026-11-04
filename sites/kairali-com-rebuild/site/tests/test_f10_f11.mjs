import { chromium } from "playwright";
import assert from "node:assert/strict";

const BASE = "http://127.0.0.1:8774";
const browser = await chromium.launch();

console.log("=== Testing F10: Mobile Focus Trap ===");
{
  const ctx = await browser.newContext({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true });
  const page = await ctx.newPage();
  await page.goto(BASE + "/", { waitUntil: "networkidle" });

  const toggle = page.locator(".menu-toggle");
  await toggle.click();
  await page.waitForSelector("#drawer .drawer-panel", { state: "visible" });

  // Initial focus should be on close button
  const closeBtn = page.locator("#drawer .drawer-head button");
  const isCloseFocused = await closeBtn.evaluate((el) => document.activeElement === el);
  console.log("Initial focus is on close button:", isCloseFocused);
  assert.ok(isCloseFocused, "Close button must have initial focus");

  // Shift+Tab from close button must wrap to the last control inside drawer and NEVER reach background header links
  await page.keyboard.press("Shift+Tab");
  const activeAfterShiftTab = await page.evaluate(() => {
    const el = document.activeElement;
    return {
      tag: el?.tagName,
      text: el?.textContent?.trim(),
      href: el?.getAttribute("href"),
      insideDrawer: document.getElementById("drawer")?.contains(el) ?? false,
    };
  });
  console.log("Active element after Shift+Tab on close button:", activeAfterShiftTab);
  assert.ok(activeAfterShiftTab.insideDrawer, "Focus must stay inside drawer!");
  assert.equal(activeAfterShiftTab.text, "Careers", "Focus wrapped to last drawer control (Careers)");

  // Tab from last control must wrap back to first control (close button)
  await page.keyboard.press("Tab");
  const activeAfterTab = await page.evaluate(() => {
    const el = document.activeElement;
    return {
      tag: el?.tagName,
      ariaLabel: el?.getAttribute("aria-label"),
      insideDrawer: document.getElementById("drawer")?.contains(el) ?? false,
    };
  });
  console.log("Active element after Tab on last item:", activeAfterTab);
  assert.ok(activeAfterTab.insideDrawer, "Focus must stay inside drawer!");
  assert.equal(activeAfterTab.ariaLabel, "Close menu", "Focus wrapped back to Close button");

  // Background content must be inert
  const mainInert = await page.$eval("#main", (el) => el.hasAttribute("inert"));
  const headerInert = await page.$eval(".masthead", (el) => el.hasAttribute("inert"));
  console.log("Background main inert:", mainInert, "masthead inert:", headerInert);
  assert.ok(mainInert, "Main must be inert when drawer is open");
  assert.ok(headerInert, "Masthead must be inert when drawer is open");

  // Escape must close drawer and restore focus to menu toggle button
  await page.keyboard.press("Escape");
  const drawerHidden = await page.evaluate(() => document.getElementById("drawer")?.hidden === true);
  const toggleRefocused = await toggle.evaluate((el) => document.activeElement === el);
  console.log("Drawer hidden after Escape:", drawerHidden, "Toggle refocused:", toggleRefocused);
  assert.ok(drawerHidden, "Drawer must be hidden after Escape");
  assert.ok(toggleRefocused, "Toggle button must regain focus after Escape");

  console.log("F10 Mobile Focus Trap: 100% PASS!\n");
  await ctx.close();
}

console.log("=== Testing F11: Consent Gating, Refusal, and Reopening ===");
{
  // Test 1: Saved refusal (Essential only) - Chatbase MUST NOT load
  const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const page = await ctx.newPage();

  // Set saved refusal in localStorage
  await page.addInitScript(() => {
    localStorage.setItem("kairali-consent-v1", JSON.stringify({
      v: 1,
      granted: false,
      consent: { ad_storage: "denied", analytics_storage: "denied" },
      at: new Date().toISOString()
    }));
  });

  const chatbaseRequests = [];
  page.on("request", (req) => {
    if (req.url().includes("chatbase")) chatbaseRequests.push(req.url());
  });

  await page.goto(BASE + "/", { waitUntil: "networkidle" });
  await page.waitForTimeout(1000);

  console.log("Chatbase requests with saved refusal:", chatbaseRequests);
  assert.equal(chatbaseRequests.length, 0, "Chatbase must NOT load after saved refusal!");

  const chatScript = await page.$("#rpNt_uRW6W8EDiTf6AvYJ");
  assert.equal(chatScript, null, "Chatbase embed script tag must NOT exist in DOM!");

  // Test 2: Cookie preferences reopen button in footer
  const cookiePrefsBtn = page.locator(".cookie-reopen-btn");
  assert.ok(await cookiePrefsBtn.isVisible(), "Cookie preferences button must be visible in footer");

  // Click Cookie preferences -> Consent banner must reopen
  await cookiePrefsBtn.click();
  await page.waitForSelector("[data-consent-banner]", { state: "visible" });
  const bannerVisible = await page.isVisible("[data-consent-banner]");
  console.log("Consent banner reopened via footer button:", bannerVisible);
  assert.ok(bannerVisible, "Consent banner must become visible upon clicking Cookie preferences");

  console.log("F11 Consent Gating & Reopening: 100% PASS!\n");
  await ctx.close();
}

await browser.close();
console.log("ALL PLAYWRIGHT TESTS PASSED!");
