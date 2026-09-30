// Protocol interop between the website's relay client (lib/form-relay.ts) and the REAL relay code that runs on the
// database host (bridge/form-relay/relay-core.php), driven through a CLI harness. Skipped when no php binary is
// available; the database-backed path is exercised separately (bridge/form-relay/test/mysql-integration.sh).
import test from 'node:test';
import assert from 'node:assert/strict';
import { execFileSync, spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { relayCall } from '../lib/form-relay.ts';
import { relayLeadPayload } from '../lib/lead-store.ts';

const HARNESS = fileURLToPath(new URL('../bridge/form-relay/test/harness.php', import.meta.url));
const hasPhp = spawnSync('php', ['-r', 'exit(extension_loaded("hash") ? 0 : 1);']).status === 0;
const php = (input) => JSON.parse(execFileSync('php', [HARNESS], { input: JSON.stringify(input), encoding: 'utf8' }));

const SECRET = 'q'.repeat(40);
const ENV = { AHV_FORM_RELAY_URL: 'https://relay.example.test/ahv-form-relay/index.php', AHV_FORM_RELAY_SECRET: SECRET, AHV_FORM_RELAY_KEY_ID: 'k1' };
const CONFIG = { db: { host: '127.0.0.1', name: 'ktahv_ayurvedic_healing_village', user: 'relay', password: 'p' }, keys: { k1: SECRET } };
const TOKEN = '3f2b8c4e-1d2a-4b6c-9e8f-0a1b2c3d4e5f';

/** Capture what the Node client sends, as PHP's $_SERVER would see it. */
async function capture(data, op = 'lead.store') {
  let captured;
  await relayCall(op, data, { env: ENV, fetchImpl: async (url, init) => { captured = { url, init }; throw new Error('captured'); } }).catch(() => {});
  const h = captured.init.headers;
  const server = {
    REQUEST_METHOD: 'POST', HTTPS: 'on', CONTENT_TYPE: h['content-type'], REQUEST_URI: new URL(captured.url).pathname,
    HTTP_X_AHV_KEY_ID: h['x-ahv-key-id'], HTTP_X_AHV_TIMESTAMP: h['x-ahv-timestamp'], HTTP_X_AHV_NONCE: h['x-ahv-nonce'], HTTP_X_AHV_SIGNATURE: h['x-ahv-signature'],
  };
  return { server, body: captured.init.body, now: Number(h['x-ahv-timestamp']), nonce: h['x-ahv-nonce'] };
}

const lead = () => relayLeadPayload('contact', {
  site: 'ayurvedichealingvillage.com', formType: 'contact', submitIp: '203.0.113.9',
  values: { full_name: 'Synthetic', countrycode: '+91', phone: '9999999999', email: 'synthetic@example.invalid', message: 'Hi' },
  tracking: { source: '', campaign: '', medium: '', gclid: '', fbclid: '', utmSource: 'google', utmMedium: '', utmCampaign: '', utmTerm: '', utmContent: '', leadSourceUrl: 'https://x.test/', referrer: '' },
}, TOKEN);

test('PHP relay accepts exactly what the Node client signs, and nothing tampered', { skip: !hasPhp && 'php not installed' }, async () => {
  const req = await capture(lead());
  assert.deepEqual(php({ action: 'authenticate', ...req, config: CONFIG }), { ok: true, keyId: 'k1', nonce: req.nonce });
  const reject = (patch, code) => assert.equal(php({ action: 'authenticate', ...req, config: CONFIG, ...patch }).code, code, code);
  reject({ body: req.body.replace('Synthetic', 'Tampered') }, 'UNAUTHENTICATED');
  reject({ server: { ...req.server, REQUEST_URI: '/other/index.php' } }, 'UNAUTHENTICATED');
  reject({ server: { ...req.server, HTTPS: 'off' } }, 'HTTPS_REQUIRED');
  reject({ server: { ...req.server, HTTPS: undefined } }, 'HTTPS_REQUIRED');
  reject({ server: { ...req.server, REQUEST_METHOD: 'GET' } }, 'METHOD_NOT_ALLOWED');
  reject({ server: { ...req.server, CONTENT_TYPE: 'text/plain' } }, 'INVALID_REQUEST');
  reject({ now: req.now + 301 }, 'STALE_REQUEST');
  reject({ config: { ...CONFIG, keys: { k1: 'z'.repeat(40) } } }, 'UNAUTHENTICATED');
  reject({ config: { ...CONFIG, keys: { k2: SECRET } } }, 'UNAUTHENTICATED');
});

test('PHP relay response signature is verified by the Node client (and a forged one is not)', { skip: !hasPhp && 'php not installed' }, async () => {
  const text = JSON.stringify({ ok: true, ready: true });
  const run = (signText) => relayCall('health', undefined, {
    env: ENV,
    fetchImpl: async (url, init) => {
      const { signature } = php({ action: 'sign_response', secret: SECRET, keyId: 'k1', nonce: init.headers['x-ahv-nonce'], status: 200, body: signText });
      return new Response(text, { status: 200, headers: { 'x-ahv-relay-signature': signature } });
    },
  });
  assert.equal((await run(text)).ready, true);
  await assert.rejects(run(text.replace('true}', 'false}')), /RELAY_UNVERIFIED/);
});

test('PHP relay schema: the Node payload validates; unknown tables/columns, bad tokens and oversize values do not', { skip: !hasPhp && 'php not installed' }, () => {
  const ok = php({ action: 'validate', data: lead() });
  assert.equal(ok.ok, true);
  assert.equal(ok.table, 'contact');
  assert.ok(ok.columns.includes('consent') && ok.columns.includes('utm_source'));
  assert.ok(!ok.columns.includes('consent_at'), 'consent_at comes from the database clock, never the client');
  const bad = (patch, code, field) => {
    const r = php({ action: 'validate', data: { ...lead(), ...patch } });
    assert.equal(r.ok, false);
    assert.equal(r.code, code);
    if (field) assert.equal(r.field, field);
  };
  bad({ table: 'contact`; DROP TABLE contact; --' }, 'UNKNOWN_FORM');
  bad({ table: 'newsletter' }, 'UNKNOWN_FORM');
  bad({ submission_token: 'x' }, 'INVALID_SUBMISSION');
  bad({ site: 'evil.example' }, 'SCHEMA_VIOLATION', 'site');
  bad({ form_type: 'opd' }, 'SCHEMA_VIOLATION', 'form_type');
  bad({ submit_ip: '999.1.1.1' }, 'SCHEMA_VIOLATION', 'submit_ip');
  bad({ values: { ...lead().values, 'email) VALUES (1); --': 'x' } }, 'SCHEMA_VIOLATION');
  bad({ values: { ...lead().values, message: 'x'.repeat(4001) } }, 'SCHEMA_VIOLATION', 'message');
  bad({ values: { ...lead().values, email: { $gt: '' } } }, 'SCHEMA_VIOLATION', 'email');
  bad({ values: { ...lead().values, consent: 'yes' } }, 'SCHEMA_VIOLATION', 'consent');
  bad({ values: { ...lead().values, phone: 'a\u0000b' } }, 'SCHEMA_VIOLATION', 'phone');
  bad({ tracking: { ...lead().tracking, sql: 'x' } }, 'SCHEMA_VIOLATION', 'sql');
  bad({ extra: 1 }, 'SCHEMA_VIOLATION', 'extra');
});

test('PHP relay refuses unusable operator config and fails closed without touching the database', { skip: !hasPhp && 'php not installed' }, async () => {
  const problem = (config) => php({ action: 'config_problem', config }).problem;
  assert.equal(problem(CONFIG), null);
  assert.equal(problem({ ...CONFIG, db: { ...CONFIG.db, host: 'db.remote.example' } }), 'db_not_loopback');
  assert.equal(problem({ ...CONFIG, db: { ...CONFIG.db, name: 'another_db' } }), 'wrong_database');
  assert.equal(problem({ ...CONFIG, db: { ...CONFIG.db, password: '' } }), 'db_password_missing');
  assert.equal(problem({ ...CONFIG, keys: {} }), 'no_keys');
  assert.equal(problem({ ...CONFIG, keys: { k1: 'short' } }), 'weak_key');
  const req = await capture(lead());
  const out = php({ action: 'handle_unconfigured', ...req, config: { ...CONFIG, keys: {} } });
  assert.equal(out.status, 503);
  assert.equal(out.body.code, 'RELAY_NOT_CONFIGURED');
  assert.equal(out.pdoRequested, false);
});

test('relay health reports ready only with full single-column unique keys on submission_token and nonce', {
  skip: (spawnSync('php', ['-r', 'exit(extension_loaded("pdo_sqlite") ? 0 : 1);']).status !== 0) && 'php/pdo_sqlite not installed',
}, () => {
  const run = spawnSync('php', [fileURLToPath(new URL('../bridge/form-relay/test/health-readiness.php', import.meta.url))], { encoding: 'utf8' });
  const out = JSON.parse(run.stdout);
  assert.equal(out.tests, 10);
  assert.deepEqual(out.cases.filter((c) => !c.pass).map((c) => c.case), []);
  assert.equal(run.status, 0);
});
