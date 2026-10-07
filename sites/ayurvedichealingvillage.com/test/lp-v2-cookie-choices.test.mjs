import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { CONSENT_STORAGE_KEY, DENIED_ALL } from "@kairali/consent/core";
import { isCookieChoicesClick, reopenConsent, COOKIE_CHOICES_SELECTOR } from "../campaign-v2/integrations/consent.ts";

const el = (matches) => ({ closest: (sel) => (sel === COOKIE_CHOICES_SELECTOR && matches ? {} : null) });

test("cookie preferences: only clicks on [data-ahv-cookie-choices] count", () => {
  assert.equal(isCookieChoicesClick(el(true)), true);
  assert.equal(isCookieChoicesClick(el(false)), false);
  assert.equal(isCookieChoicesClick(null), false);
  assert.equal(isCookieChoicesClick({}), false); // text nodes etc. have no closest()
});

test("cookie preferences: clears the stored choice, sets Consent Mode to denied, then reloads", () => {
  const order = [];
  const removed = [];
  reopenConsent({
    storage: { removeItem: (k) => { removed.push(k); order.push("remove"); } },
    gtag: (...a) => { assert.deepEqual(a, ["consent", "update", DENIED_ALL]); order.push("gtag"); },
    reload: () => order.push("reload"),
  });
  assert.deepEqual(removed, [CONSENT_STORAGE_KEY]);
  assert.deepEqual(order, ["remove", "gtag", "reload"]);
});

test("cookie preferences: still reloads when storage throws and gtag is absent", () => {
  let reloaded = false;
  reopenConsent({ storage: { removeItem: () => { throw new Error("blocked"); } }, gtag: undefined, reload: () => { reloaded = true; } });
  assert.equal(reloaded, true);
});

test("cookie preferences: the footer button exists and the lp-v2 Tracking component installs the listener", () => {
  assert.match(readFileSync("campaign-v2/sections/Footer.tsx", "utf8"), /data-ahv-cookie-choices/);
  const tracking = readFileSync("campaign-v2/sections/Tracking.tsx", "utf8");
  assert.match(tracking, /installCookieChoices\(\)/);
  assert.match(readFileSync("campaign-v2/sections/Document.tsx", "utf8"), /<Tracking \/>/);
});
