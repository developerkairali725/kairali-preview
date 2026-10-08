// Code tokens that look like words must never become translation units (28 Sep 2026 locale defect audit:
// de rendered createElement('.') for table headers, it image-slot observed 'forma'/'raggio', form payload keys and
// the online-consultation step machine were translated). Visible text in the same positions must still be extracted.
import test from "node:test";
import assert from "node:assert/strict";
import { jsUnits, applyUnits } from "../tools/l10n/lib.mjs";

const units = (code) => jsUnits(code).units.map((u) => u.source);

test("tag ternaries, attribute arrays and identifier state values are not units", () => {
  assert.deepEqual(units("React.createElement(c.tag === 'th' ? 'th' : 'td')"), []);
  assert.deepEqual(units("static get observedAttributes() { return ['shape', 'radius', 'mask', 'fit']; }"), []);
  assert.deepEqual(units("x = { ps: 'valid', consent: 'pending', step: 'review', style: { overflow: 'hidden', alignItems: 'start' } }"), []);
  assert.deepEqual(units("const f = { name: 'email', autocomplete: 'email', field: 'phone', payloadSchema: ['name', 'phone country code'] }"), []);
  assert.deepEqual(units("const fit = (this.getAttribute('fit') || 'cover')"), []);
});

test("visible text in the same syntactic positions is still extracted", () => {
  assert.deepEqual(units("x = { label: 'Email', title: 'Deluxe Villa' }"), ["Email", "Deluxe Villa"]);
  assert.deepEqual(units("const m = ['Jan', 'Feb']; const s = open ? 'Open now' : 'Closed';"), ["Jan", "Feb", "Open now", "Closed"]);
  assert.deepEqual(units("x = { tree: [{ k: 't', v: 'not' }] }"), ["not"]);
});

test("strings anywhere under an efNN provenance key are not units", () => {
  assert.deepEqual(units("x = { routes: [{ ef12: { structural: { removed: [{ ptr: '/a', why: 'S1 stand-in photo' }], reason: 'text-only cards' } }, label: 'Visible label' }] }"), ["Visible label"]);
});

test("availability enums and private outline notes stay unchanged while labels translate", () => {
  assert.deepEqual(units("if (['current','enquiry_only','coming_soon'].includes(value)) show();"), []);
  assert.deepEqual(units("x = { statuses: [['current', 'Current offerings'], ['enquiry_only', 'Enquiry-only']] }"), ["Current offerings", "Enquiry-only"]);
  assert.deepEqual(units("x = { headingOutline: { note: 'The consolidated release replaces four generic subject headings with the five approved Ayurveda course links under one educational heading.' }, note: 'Ask us about current offerings' }"), ["Ask us about current offerings"]);
});

test('currency keys keep the callback/price contract while visible Euro labels translate', () => {
  const code = "const currencyKeys = ['INR', 'Euro', 'USD']; const display = { label: 'Euro' };";
  const parsed = jsUnits(code).units;
  assert.deepEqual(parsed.map(u => u.source), ['Euro']);
  assert.equal(applyUnits(code, parsed, s => s === 'Euro' ? 'यूरो' : undefined),
    "const currencyKeys = ['INR', 'Euro', 'USD']; const display = { label: 'यूरो' };");
});
