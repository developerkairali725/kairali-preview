import { test } from "node:test";
import assert from "node:assert/strict";
import { resolveRequest } from "../campaign-v2/request.ts";

test("German browser in India: German UI, INR, no banner", () => {
  assert.deepEqual(resolveRequest({ acceptLanguage: "de-DE,de;q=0.9", country: "IN" }, ["en", "de"]),
    { locale: "de", dir: "ltr", currency: "INR", consentRequired: false });
});
test("Arabic browser in UAE with Arabic available: RTL, AED", () => {
  assert.deepEqual(resolveRequest({ acceptLanguage: "ar-AE", country: "AE" }, ["en", "ar"]),
    { locale: "ar", dir: "rtl", currency: "AED", consentRequired: false });
});
test("France visitor, English-only campaign: English, EUR, banner", () => {
  assert.deepEqual(resolveRequest({ acceptLanguage: "fr-FR", country: "FR" }, ["en"]),
    { locale: "en", dir: "ltr", currency: "EUR", consentRequired: true });
});
