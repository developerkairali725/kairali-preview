import { test } from "node:test";
import assert from "node:assert/strict";
import { feeFor, fromPrice, isExpired } from "../campaign-v2/kit/price.ts";

const fees = { source: "x", validTo: "2027-03-31", nights: 14, rows: [
  { name: "Deluxe", note: "", single: { INR: 400000, USD: 4800 }, twinEach: { INR: 310000, USD: 3700 } },
  { name: "Royal", note: "", single: { INR: 700000 }, twinEach: { INR: 520000 } },
]};

test("feeFor returns the requested currency when present", () => {
  assert.deepEqual(feeFor(fees.rows[0], "twinEach", "INR"), { currency: "INR", amount: 310000, fallback: false });
});
test("feeFor falls back to USD, never converts", () => {
  assert.deepEqual(feeFor(fees.rows[0], "twinEach", "EUR"), { currency: "USD", amount: 3700, fallback: true });
  assert.equal(feeFor(fees.rows[1], "twinEach", "EUR"), null);
});
test("fromPrice picks the lowest twin-sharing figure in the currency", () => {
  assert.deepEqual(fromPrice(fees, "INR"), { currency: "INR", amount: 310000, fallback: false });
});
test("isExpired compares end of validTo day in IST", () => {
  assert.equal(isExpired("2026-10-31", new Date("2026-10-31T18:00:00Z")), false);
  assert.equal(isExpired("2026-10-31", new Date("2026-10-31T19:00:00Z")), true);
});

test("isExpired fails closed: invalid dates always return true", () => {
  const now = new Date("2026-10-07T12:00:00Z");
  assert.equal(isExpired("", now), true);
  assert.equal(isExpired("31/03/2027", now), true);
  assert.equal(isExpired("2027-3-31", now), true);
  assert.equal(isExpired("invalid", now), true);
  assert.equal(isExpired("2027-13-01", now), true);
});

test("feeFor: only finite positive amounts count", () => {
  // Zero is not positive
  assert.deepEqual(feeFor({ single: { INR: 0, USD: 3700 }, twinEach: {} }, "single", "INR"),
    { currency: "USD", amount: 3700, fallback: true });

  // NaN is not finite
  assert.equal(feeFor({ single: { INR: NaN }, twinEach: {} }, "single", "INR"), null);
  assert.equal(feeFor({ single: { INR: NaN, USD: NaN }, twinEach: {} }, "single", "INR"), null);

  // Negative is not positive
  assert.deepEqual(feeFor({ single: { INR: -100, USD: 3700 }, twinEach: {} }, "single", "INR"),
    { currency: "USD", amount: 3700, fallback: true });
});

test("fromPrice prefers same-currency within a row: twinEach over single", () => {
  const feesAlt = { source: "x", validTo: "2027-03-31", nights: 14, rows: [
    { name: "Deluxe", note: "", single: { INR: 400000 }, twinEach: { USD: 3000 } },
  ]};
  assert.deepEqual(fromPrice(feesAlt, "INR"),
    { currency: "INR", amount: 400000, fallback: false });
});

test("fromPrice: all-fallback pool (only USD available for EUR)", () => {
  const feesUsd = { source: "x", validTo: "2027-03-31", nights: 14, rows: [
    { name: "Deluxe", note: "", single: { USD: 4800 }, twinEach: { USD: 3700 } },
  ]};
  assert.deepEqual(fromPrice(feesUsd, "EUR"),
    { currency: "USD", amount: 3700, fallback: true });
});

test("fromPrice: empty rows returns null", () => {
  const emptyFees = { source: "x", validTo: "2027-03-31", nights: 14, rows: [] };
  assert.equal(fromPrice(emptyFees, "INR"), null);
});
