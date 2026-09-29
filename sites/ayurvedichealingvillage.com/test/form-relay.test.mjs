// /api/lead/ over the signed HTTPS relay (bridge/form-relay). No network: global fetch is replaced by a stub that
// plays the relay exactly as relay-core.php does (verifies the request HMAC over the exact body, signs its answer
// back) and plays the Apps Script Sheet receiver. Nothing here reaches a database, a Sheet or a real relay.
import test from 'node:test';
import assert from 'node:assert/strict';
import crypto from 'node:crypto';
import fs from 'node:fs';
import { POST as leadPost } from '../app/api/lead/route.ts';
import { canonicalRequest, canonicalResponse, relayCall, signRelay } from '../lib/form-relay.ts';
import { LEAD_TABLES, TABLE_COLUMNS } from '../lib/lead-store.ts';

const RELAY = 'https://relay.example.test/ahv-form-relay/';
const SHEET = 'https://script.google.com/macros/s/test-deployment/exec';
const SECRET = 's'.repeat(48);
const ENV = {
  AHV_FORM_RELAY_URL: RELAY,
  AHV_FORM_RELAY_SECRET: SECRET,
  AHV_FORM_RELAY_KEY_ID: 'k1',
  AHV_LEAD_SHEET_WEBHOOK_URL: SHEET,
  AHV_LEAD_SHEET_WEBHOOK_SECRET: 'w'.repeat(32),
};
const ALL_KEYS = [...Object.keys(ENV)];
const TOKEN = '3f2b8c4e-1d2a-4b6c-9e8f-0a1b2c3d4e5f';
const sha = (s) => crypto.createHash('sha256').update(s, 'utf8').digest('hex');

function withEnv(values, fn) {
  return async () => {
    const saved = Object.fromEntries(ALL_KEYS.map((k) => [k, process.env[k]]));
    for (const k of ALL_KEYS) delete process.env[k];
    Object.assign(process.env, values);
    const realFetch = globalThis.fetch;
    try { await fn(); } finally {
      globalThis.fetch = realFetch;
      for (const k of ALL_KEYS) saved[k] === undefined ? delete process.env[k] : (process.env[k] = saved[k]);
    }
  };
}

/** A relay double with relay-core.php's contract. `mode` shapes the answer. */
function installStubs({ mode = 'store', sheet = 'success', relaySecret = SECRET } = {}) {
  const calls = { relay: [], sheet: [] };
  globalThis.fetch = async (url, init) => {
    if (String(url).startsWith(SHEET)) {
      calls.sheet.push(JSON.parse(init.body));
      return Response.json(sheet === 'success' ? { result: 'success' } : { result: 'error', message: 'request failed' });
    }
    assert.equal(String(url), RELAY, 'only the configured relay URL is ever contacted');
    assert.equal(init.method, 'POST');
    assert.equal(init.redirect, 'error', 'redirects are refused, never followed');
    const h = init.headers;
    const path = new URL(String(url)).pathname;
    const expected = signRelay(relaySecret, canonicalRequest(h['x-ahv-key-id'], h['x-ahv-timestamp'], h['x-ahv-nonce'], 'POST', path, init.body));
    const request = JSON.parse(init.body);
    calls.relay.push({ headers: h, request });
    const reply = (status, payload, { sign = true, tamper = false } = {}) => {
      const text = JSON.stringify(payload);
      const headers = { 'content-type': 'application/json' };
      if (sign) headers['x-ahv-relay-signature'] = signRelay(relaySecret, canonicalResponse(h['x-ahv-key-id'], h['x-ahv-nonce'], status, tamper ? text + ' ' : text));
      return new Response(text, { status, headers });
    };
    if (h['x-ahv-signature'] !== expected) return reply(401, { ok: false, code: 'UNAUTHENTICATED' }, { sign: false });
    if (Math.abs(Date.now() / 1000 - Number(h['x-ahv-timestamp'])) > 300) return reply(401, { ok: false, code: 'STALE_REQUEST' }, { sign: false });
    if (mode === 'rate') return reply(429, { ok: false, code: 'RATE_LIMITED' });
    if (mode === 'schema') return reply(400, { ok: false, code: 'SCHEMA_VIOLATION', field: 'nope' });
    if (mode === 'forged') return reply(200, { ok: true, alreadyStored: false, row: {} }, { tamper: true });
    if (mode === 'unsigned') return reply(200, { ok: true, alreadyStored: false, row: {} }, { sign: false });
    if (mode === 'wrong-row') return reply(200, { ok: true, alreadyStored: false, row: { submission_token: '00000000-0000-4000-8000-000000000000' } });
    const d = request.data;
    return reply(200, { ok: true, alreadyStored: mode === 'existing', row: { id: '41', site: d.site, form_type: d.form_type, submission_token: d.submission_token, ...d.values, consent: d.values.consent ? '1' : '0', submit_time: '2026-09-29 10:00:00' } });
  };
  return calls;
}

const contactBody = (overrides = {}) => ({
  form: 'contact', submissionToken: TOKEN, site_language: 'de', lead_source_url: 'https://preview.example.test/contact-us/', utm_source: 'google',
  fields: { full_name: 'Synthetic Test', countrycode: '+91', phone: '9999999999', email: 'synthetic@example.invalid', programme: 'Panchakarma', message: 'Synthetic', not_a_column: 'dropped', ...overrides },
});
const post = (body, headers = { 'content-type': 'application/json', 'x-forwarded-for': '203.0.113.9' }) =>
  new Request('https://preview.example.test/api/lead/', { method: 'POST', headers, body: typeof body === 'string' ? body : JSON.stringify(body) });

test('no relay configuration: truthful 503 before the body is read, nothing contacted', withEnv({}, async () => {
  let contacted = false;
  globalThis.fetch = async () => { contacted = true; throw new Error('must not be called'); };
  const request = post(contactBody());
  const response = await leadPost(request);
  assert.equal(response.status, 503);
  assert.equal(request.bodyUsed, false);
  const body = await response.json();
  assert.equal(body.ok, false);
  assert.equal(body.code, 'LEAD_STORE_NOT_CONFIGURED');
  assert.match(body.error, /Nothing has been saved or sent/);
  assert.equal(contacted, false);
  assert.equal(response.headers.get('cache-control'), 'no-store');
}));

test('an http:// relay URL is never used: still 503, never contacted', withEnv({ ...ENV, AHV_FORM_RELAY_URL: 'http://relay.example.test/ahv-form-relay/' }, async () => {
  let contacted = false;
  globalThis.fetch = async () => { contacted = true; throw new Error('must not be called'); };
  const request = post(contactBody());
  assert.equal((await leadPost(request)).status, 503);
  assert.equal(request.bodyUsed, false);
  assert.equal(contacted, false);
}));

test('relay configured but Sheet webhook missing: 503 LEAD_SHEET_NOT_CONFIGURED before the body is read', withEnv({ ...ENV, AHV_LEAD_SHEET_WEBHOOK_URL: '' }, async () => {
  const request = post(contactBody());
  const response = await leadPost(request);
  assert.equal(response.status, 503);
  assert.equal((await response.json()).code, 'LEAD_SHEET_NOT_CONFIGURED');
  assert.equal(request.bodyUsed, false);
}));

test('configured: signed relay store, stored row mirrored to the Sheet, then receipt with the language guide', withEnv(ENV, async () => {
  const calls = installStubs();
  const response = await leadPost(post(contactBody()));
  assert.equal(response.status, 200);
  const body = await response.json();
  assert.deepEqual({ ok: body.ok, status: body.status }, { ok: true, status: 'received' });
  assert.match(body.guideUrl, /^\/documents\/pdf\/healing-secrets\/de\//);
  assert.equal(calls.relay.length, 1);
  const { request, headers } = calls.relay[0];
  assert.equal(request.v, 1);
  assert.equal(request.op, 'lead.store');
  assert.equal(request.data.table, 'contact');
  assert.equal(request.data.submission_token, TOKEN);
  assert.equal(request.data.site, 'ayurvedichealingvillage.com');
  assert.equal(request.data.submit_ip, '203.0.113.9');
  assert.equal(request.data.values.not_a_column, undefined, 'unknown fields never reach the relay');
  assert.equal(request.data.values.consent, false, 'contact form sends no consent box: stored as false, never invented');
  assert.equal(request.data.tracking.utm_source, 'google');
  assert.match(headers['x-ahv-nonce'], /^[A-Za-z0-9_-]{22,64}$/);
  assert.equal(calls.sheet.length, 1);
  assert.equal(calls.sheet[0].row.submission_token, TOKEN);
  assert.equal(calls.sheet[0].form, 'contact');
}));

test('a retry of the same fill returns the stored row (idempotent) and still succeeds', withEnv(ENV, async () => {
  installStubs({ mode: 'existing' });
  assert.equal((await leadPost(post(contactBody()))).status, 200);
}));

test('a relay answer whose signature does not verify is never treated as stored', withEnv(ENV, async () => {
  for (const mode of ['forged', 'unsigned']) {
    const calls = installStubs({ mode });
    const response = await leadPost(post(contactBody()));
    assert.equal(response.status, 502, mode);
    assert.equal((await response.json()).code, 'STORE_FAILED');
    assert.equal(calls.sheet.length, 0, `${mode}: nothing mirrored`);
  }
}));

test('a relay holding a different key rejects the request; the route reports failure, not success', withEnv(ENV, async () => {
  const calls = installStubs({ relaySecret: 'x'.repeat(48) });
  const response = await leadPost(post(contactBody()));
  assert.equal(response.status, 502);
  assert.equal(calls.sheet.length, 0);
}));

test('a stored row for a different token is refused as unverified', withEnv(ENV, async () => {
  const calls = installStubs({ mode: 'wrong-row' });
  assert.equal((await leadPost(post(contactBody()))).status, 502);
  assert.equal(calls.sheet.length, 0);
}));

test('relay rate limit surfaces as 429; relay schema refusal as a generic failure', withEnv(ENV, async () => {
  installStubs({ mode: 'rate' });
  const limited = await leadPost(post(contactBody()));
  assert.equal(limited.status, 429);
  assert.equal((await limited.json()).code, 'RATE_LIMITED');
  installStubs({ mode: 'schema' });
  const refused = await leadPost(post(contactBody()));
  assert.equal(refused.status, 502);
  assert.doesNotMatch(JSON.stringify(await refused.json()), /SCHEMA_VIOLATION|nope/, 'relay detail never reaches the browser');
}));

test('Sheet failure after a stored row: 502 SHEET_SYNC_FAILED (row retained for the same-token retry)', withEnv(ENV, async () => {
  const calls = installStubs({ sheet: 'error' });
  const response = await leadPost(post(contactBody()));
  assert.equal(response.status, 502);
  assert.equal((await response.json()).code, 'SHEET_SYNC_FAILED');
  assert.equal(calls.relay.length, 1);
}));

test('validation failures are answered before the relay is contacted', withEnv(ENV, async () => {
  const calls = installStubs();
  const cases = [
    [post('email=synthetic%40example.invalid', { 'content-type': 'application/x-www-form-urlencoded' }), 415, 'INVALID_REQUEST'],
    [post('{not json'), 400, 'INVALID_REQUEST'],
    [post({ ...contactBody(), form: 'newsletter' }), 400, 'UNKNOWN_FORM'],
    [post({ ...contactBody(), form: 'contact; DROP TABLE contact' }), 400, 'UNKNOWN_FORM'],
    [post({ ...contactBody(), submissionToken: 'not-a-uuid' }), 400, 'INVALID_SUBMISSION'],
    [post(contactBody({ phone: '' })), 400, 'MISSING_REQUIRED_FIELDS'],
    [post(contactBody({ email: 'not-an-email' })), 400, 'INVALID_EMAIL'],
    [post({ ...contactBody(), form: 'opd', fields: { full_name: 'T', age: '30', gender: 'F', phone: '9', symptoms: 'x', consent: false } }), 400, 'MISSING_REQUIRED_FIELDS'],
  ];
  for (const [request, status, code] of cases) {
    const response = await leadPost(request);
    assert.equal(response.status, status, code);
    assert.equal((await response.json()).code, code);
  }
  assert.equal(calls.relay.length, 0);
}));

test('relay client signs method, path, timestamp, nonce and the exact body', withEnv(ENV, async () => {
  let seen;
  const reply = await relayCall('health', undefined, {
    now: () => 1_790_000_000_000,
    nonce: () => 'n'.repeat(32),
    fetchImpl: async (url, init) => {
      seen = init;
      const text = JSON.stringify({ ok: true, ready: true });
      return new Response(text, { status: 200, headers: { 'x-ahv-relay-signature': signRelay(SECRET, canonicalResponse('k1', 'n'.repeat(32), 200, text)) } });
    },
  });
  assert.equal(reply.ready, true);
  assert.equal(seen.headers['x-ahv-timestamp'], '1790000000');
  const canonical = ['AHV-RELAY-V1', 'k1', '1790000000', 'n'.repeat(32), 'POST', '/ahv-form-relay/', sha(seen.body)].join('\n');
  assert.equal(seen.headers['x-ahv-signature'], crypto.createHmac('sha256', SECRET).update(canonical).digest('hex'));
}));

test('one schema: website tables/columns, relay schema and the Sheet receiver agree', () => {
  const schema = JSON.parse(fs.readFileSync(new URL('../bridge/form-relay/lead-schema.json', import.meta.url), 'utf8'));
  assert.deepEqual(LEAD_TABLES, Object.keys(schema.tables));
  assert.deepEqual(TABLE_COLUMNS, schema.tables);
  assert.equal(schema.database, 'ktahv_ayurvedic_healing_village');
  const receiver = fs.readFileSync(new URL('../scripts/apps-script/lead-sheet.gs', import.meta.url), 'utf8');
  for (const table of LEAD_TABLES) assert.match(receiver, new RegExp(`'${table}': \\{`), `Sheet receiver handles ${table}`);
  for (const [table, columns] of Object.entries(schema.tables)) for (const column of columns) assert.match(column, /^[a-z][a-z0-9_]*$/, `${table}.${column} is a plain identifier`);
});
