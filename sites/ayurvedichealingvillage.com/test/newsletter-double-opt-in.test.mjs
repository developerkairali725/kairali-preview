// Newsletter double opt-in (lib/newsletter*.ts, app/api/newsletter/**, relay ops newsletter.* in
// bridge/form-relay/relay-core.php). NO NETWORK: global fetch is replaced by a stub that plays
//   · the signed relay — verifying the request HMAC and signing its answer exactly as relay-core.php does —
//     backed EITHER by an in-memory double of the relay's newsletter ops ("js") OR by the REAL PHP op code
//     against a throwaway SQLite file through bridge/form-relay/test/harness.php ("php", skipped without
//     php + pdo_sqlite), so every lifecycle test below also runs against the production relay logic;
//   · the Apps Script confirmation-mail endpoint (POST /exec → 302 → googleusercontent echo), verifying the
//     request signature and answering with signed, correlated replies — or failing in the ways a real
//     provider can (refusal, timeout before/after acceptance, unsigned or mismatched replies, bad redirects).
// True InnoDB concurrency (parallel processes) is exercised separately by
// bridge/form-relay/test/mysql-integration.sh. Nothing here reaches a database, a mail provider or any
// real endpoint, and no email is sent.
import test from 'node:test';
import assert from 'node:assert/strict';
import crypto from 'node:crypto';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import vm from 'node:vm';
import { execFileSync, spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { POST as subscribePost } from '../app/api/newsletter/route.ts';
import { GET as confirmGet, POST as confirmPost } from '../app/api/newsletter/confirm/route.ts';
import { GET as unsubscribeGet, POST as unsubscribePost } from '../app/api/newsletter/unsubscribe/route.ts';
import { GET as outboxGet } from '../app/api/newsletter/outbox/route.ts';
import { canonicalRequest, canonicalResponse, signRelay } from '../lib/form-relay.ts';
import { MAIL_PROTOCOL, NEWSLETTER_SENDER, createNewsletterMailer, mailReplySignature, newsletterMailProblem } from '../lib/newsletter-mail.ts';
import { NEWSLETTER_COPY, localeFromPath } from '../lib/newsletter-copy.ts';
import { relayNewsletterStore } from '../lib/newsletter-store.ts';
import {
  defaultNewsletterDeps, hashToken, newConfirmationToken, newsletterConfigProblem, normalizeEmail, processOutbox,
  safeSourcePath, sealToken, unsealToken, unsubscribeToken, verifyUnsubscribeToken,
} from '../lib/newsletter.ts';
import { guideDownloadUrl } from '../lib/guide-download.ts';
import { newsletterMarkup } from '../app/(english)/_families/newsletter-markup.mjs';

const SCHEMA = JSON.parse(fs.readFileSync(new URL('../bridge/form-relay/lead-schema.json', import.meta.url), 'utf8'));
const NL = SCHEMA.newsletter;
const RELAY = 'https://relay.example.test/ahv-form-relay/';
const MAIL = 'https://script.google.com/macros/s/test-newsletter-mail/exec';
const ECHO = 'https://script.googleusercontent.com/macros/echo';
const RELAY_SECRET = 'r'.repeat(48);
const MAIL_SECRET = 'm'.repeat(40);
const CRON = 'c'.repeat(40);
const ORIGIN = 'https://staging.example.test';
const ENV = {
  AHV_FORM_RELAY_URL: RELAY,
  AHV_FORM_RELAY_SECRET: RELAY_SECRET,
  AHV_FORM_RELAY_KEY_ID: 'k1',
  AHV_NEWSLETTER_MAIL_PROVIDER: 'apps-script',
  AHV_NEWSLETTER_MAIL_WEBHOOK_URL: MAIL,
  AHV_NEWSLETTER_MAIL_WEBHOOK_SECRET: MAIL_SECRET,
  AHV_NEWSLETTER_PUBLIC_ORIGIN: ORIGIN,
  AHV_NEWSLETTER_LINK_SECRET: 'l'.repeat(40),
  AHV_NEWSLETTER_OUTBOX_KEY: 'o'.repeat(40),
  CRON_SECRET: CRON,
};
const KEYS = Object.keys(ENV);
const VERSION = 'newsletter-2026-09-24';
const EMAIL = 'synthetic.subscriber@example.invalid';
const sha = (s) => crypto.createHash('sha256').update(s, 'utf8').digest('hex');
const HARNESS = fileURLToPath(new URL('../bridge/form-relay/test/harness.php', import.meta.url));
const HAS_PHP_SQLITE = spawnSync('php', ['-r', 'exit(extension_loaded("pdo_sqlite") && extension_loaded("hash") ? 0 : 1);']).status === 0;
const SEALED_RE = /^v1\.[A-Za-z0-9_-]{40,190}$/;

// ───────────────────────── relay backends ─────────────────────────

/** In-memory double of relay-core.php's newsletter ops (same rules; the php backend is the reference). */
function jsBackend(clock) {
  const S = [], C = [], LIM = new Map();
  const O = NL.outbox, L = NL.limits;
  const ts = (e) => new Date(e * 1000).toISOString().slice(0, 19).replace('T', ' ');
  const ep = (s) => Date.parse(s.replace(' ', 'T') + 'Z') / 1000;
  const bad = (code, field) => ({ status: 400, body: field ? { ok: false, code, field } : { ok: false, code } });
  const only = (d, keys) => d && typeof d === 'object' && !Array.isArray(d) && Object.keys(d).every((k) => keys.includes(k));
  const limit = (kind, subject, window) => {
    const key = `${kind}|${subject}`;
    const row = LIM.get(key) ?? { kind, subject_hash: subject, window_start: ts(clock.now), hits: 0 };
    const fresh = clock.now - ep(row.window_start) >= window;
    return { key, row, start: fresh ? clock.now : ep(row.window_start), hits: fresh ? 0 : row.hits };
  };
  const store = (st) => LIM.set(st.key, { ...st.row, window_start: ts(st.start), hits: st.hits + 1 });
  const handlers = {
    'newsletter.subscribe'(d) {
      if (!only(d, ['email', 'consent_version', 'consent_locale', 'source_path', 'submit_ip', 'token_hash', 'token_sealed'])) return bad('SCHEMA_VIOLATION');
      const email = normalizeEmail(d.email);
      if (!email) return bad('INVALID_EMAIL');
      if (!Object.hasOwn(NL.consentVersions, d.consent_version)) return bad('UNKNOWN_CONSENT_VERSION');
      if (!NL.locales.includes(d.consent_locale)) return bad('SCHEMA_VIOLATION', 'consent_locale');
      if (!safeSourcePath(d.source_path)) return bad('SCHEMA_VIOLATION', 'source_path');
      if (!/^[0-9a-f]{64}$/.test(d.token_hash)) return bad('SCHEMA_VIOLATION', 'token_hash');
      if (!SEALED_RE.test(d.token_sealed)) return bad('SCHEMA_VIOLATION', 'token_sealed');
      const now = clock.now, emailHash = sha(email);
      const ip = d.submit_ip ? limit('ip', sha('ip|' + d.submit_ip), 3600) : null;
      const em = limit('email', sha('email|' + emailHash), 86400);
      if ((ip && ip.hits >= L.perIpPerHour) || em.hits >= L.perEmailPerDay) return { status: 429, body: { ok: false, code: 'RATE_LIMITED' } };
      if (ip) store(ip);
      store(em);
      let s = S.find((r) => r.email_hash === emailHash);
      if (!s) S.push(s = { id: S.length + 1, public_id: crypto.randomBytes(16).toString('hex'), email_hash: emailHash, email, status: 'pending', suppressed: 0, created_at: ts(now), updated_at: ts(now), confirmed_at: null, consent_version: null, consent_text: null, consent_locale: null, consent_source_path: null, consent_ip: null, unsubscribed_at: null });
      const quiet = { status: 200, body: { ok: true, send: false, confirmation_id: null } };
      if (s.status === 'confirmed' && s.suppressed === 0) return quiet;
      const lastSent = C.filter((c) => c.subscriber_id === s.id && c.mail_status === 'sent' && !c.used_at && !c.revoked_at && c.expires_at > ts(now)).map((c) => c.mail_updated_at).sort().at(-1);
      if (lastSent && now - ep(lastSent) < L.resendCooldownSeconds) return quiet;
      if (C.filter((c) => c.subscriber_id === s.id && c.created_at >= ts(now - 86400) && c.mail_status !== 'failed').length >= L.sendsPerEmailPerDay) {
        return lastSent ? quiet : { status: 429, body: { ok: false, code: 'RATE_LIMITED' } };
      }
      const c = { id: C.length + 1, subscriber_id: s.id, token_hash: d.token_hash, consent_version: d.consent_version, consent_text: NL.consentVersions[d.consent_version], consent_locale: d.consent_locale, source_path: d.source_path, request_ip: d.submit_ip, created_at: ts(now), expires_at: ts(now + 3600 * NL.confirmationTtlHours), mail_status: 'queued', mail_updated_at: null, token_sealed: d.token_sealed, attempts: 1, lease_until: ts(now + O.inlineLeaseSeconds), used_at: null, revoked_at: null };
      C.push(c);
      return { status: 200, body: { ok: true, send: true, confirmation_id: c.id } };
    },
    'newsletter.mail_result'(d) {
      if (!only(d, ['confirmation_id', 'token_hash', 'result']) || !['sent', 'failed', 'unknown'].includes(d.result)) return bad('SCHEMA_VIOLATION');
      const now = ts(clock.now);
      const c = C.find((r) => r.id === d.confirmation_id && r.token_hash === d.token_hash && ['queued', 'unknown'].includes(r.mail_status));
      if (c) {
        c.mail_updated_at = now;
        if (d.result === 'sent') Object.assign(c, { mail_status: 'sent', token_sealed: null, lease_until: null });
        else if (d.result === 'failed') Object.assign(c, { mail_status: 'failed', token_sealed: null, lease_until: null, revoked_at: c.revoked_at ?? now });
        else Object.assign(c, { mail_status: 'unknown', lease_until: ts(clock.now + O.retryDelaySeconds), token_sealed: c.attempts >= O.maxSendAttempts ? null : c.token_sealed });
      }
      return { status: 200, body: { ok: true, updated: Boolean(c) } };
    },
    'newsletter.claim'(d) {
      if (!only(d ?? {}, ['limit'])) return bad('SCHEMA_VIOLATION');
      const n = Math.max(1, Math.min(O.claimBatch, d?.limit ?? O.claimBatch));
      const now = ts(clock.now);
      const jobs = [];
      for (const c of C) {
        if (jobs.length >= n) break;
        const s = S.find((r) => r.id === c.subscriber_id);
        if (!['queued', 'unknown'].includes(c.mail_status) || c.used_at || c.revoked_at || !c.token_sealed || c.expires_at <= ts(clock.now + 600)
          || c.attempts >= O.maxSendAttempts || (c.lease_until && c.lease_until > now) || (s.status === 'confirmed' && s.suppressed === 0)) continue;
        c.lease_until = ts(clock.now + O.inlineLeaseSeconds);
        c.attempts += 1;
        jobs.push({ confirmation_id: c.id, token_hash: c.token_hash, token_sealed: c.token_sealed, locale: c.consent_locale, email: s.email });
      }
      return { status: 200, body: { ok: true, jobs } };
    },
    'newsletter.confirm'(d) {
      if (!only(d, ['token_hash']) || !/^[0-9a-f]{64}$/.test(d.token_hash)) return bad('SCHEMA_VIOLATION');
      const now = ts(clock.now), invalid = { status: 200, body: { ok: true, outcome: 'invalid' } };
      const c = C.find((r) => r.token_hash === d.token_hash);
      if (!c) return invalid;
      const s = S.find((r) => r.id === c.subscriber_id);
      if (!s || c.used_at || c.revoked_at || c.mail_status === 'failed' || c.expires_at <= now || (s.unsubscribed_at && c.created_at < s.unsubscribed_at)) return invalid;
      Object.assign(c, { used_at: now, token_sealed: null, lease_until: null });
      Object.assign(s, { status: 'confirmed', suppressed: 0, confirmed_at: now, consent_version: c.consent_version, consent_text: c.consent_text, consent_locale: c.consent_locale, consent_source_path: c.source_path, consent_ip: c.request_ip, updated_at: now });
      for (const o of C) if (o.subscriber_id === s.id && o !== c && !o.used_at && !o.revoked_at) Object.assign(o, { revoked_at: now, token_sealed: null, lease_until: null });
      return { status: 200, body: { ok: true, outcome: 'confirmed', public_id: s.public_id } };
    },
    'newsletter.unsubscribe'(d) {
      if (!only(d, ['public_id']) || !/^[0-9a-f]{32}$/.test(d.public_id)) return bad('SCHEMA_VIOLATION');
      const now = ts(clock.now), s = S.find((r) => r.public_id === d.public_id);
      if (s) {
        Object.assign(s, { status: 'unsubscribed', suppressed: 1, unsubscribed_at: now, updated_at: now });
        for (const c of C) if (c.subscriber_id === s.id && !c.used_at && !c.revoked_at) Object.assign(c, { revoked_at: now, token_sealed: null, lease_until: null });
      }
      return { status: 200, body: { ok: true, outcome: 'unsubscribed' } };
    },
  };
  return {
    handle: (op, data) => (handlers[op] ? handlers[op](data) : bad('UNKNOWN_OPERATION')),
    dump: () => structuredClone({ ahv_newsletter_subscriber: S, ahv_newsletter_confirmation: C, ahv_newsletter_limit: [...LIM.values()] }),
  };
}

/** The REAL relay-core.php newsletter ops, against a throwaway SQLite file. */
function phpBackend(clock) {
  const db = path.join(fs.mkdtempSync(path.join(os.tmpdir(), 'ahv-nl-')), 'newsletter.sqlite');
  const php = (input) => JSON.parse(execFileSync('php', [HARNESS], { input: JSON.stringify(input), encoding: 'utf8' }));
  return {
    handle: (op, data) => php({ action: 'newsletter', db, op, data, now: clock.now }),
    dump: () => php({ action: 'newsletter_dump', db }),
  };
}

const BACKENDS = [
  { name: 'js', make: jsBackend, skip: false },
  { name: 'php', make: phpBackend, skip: !HAS_PHP_SQLITE && 'php/pdo_sqlite not installed' },
];

// ───────────────────────── fetch stub: relay + Apps Script mail endpoint ─────────────────────────

function world(makeBackend) {
  const clock = { now: Math.floor(Date.now() / 1000) };
  const backend = makeBackend(clock);
  const echoes = new Map();
  const w = { clock, backend, relayCalls: [], mails: [], delivered: [], unexpected: [], mail: 'ok', relay: 'ok', failOps: new Set() };
  const signedReply = (p, result, code = '', key = p.idempotencyKey) => ({ result, code, nonce: p.nonce, idempotencyKey: key, signature: mailReplySignature(MAIL_SECRET, p.nonce, key, result, code) });
  globalThis.fetch = async (url, init) => {
    url = String(url);
    if (url.startsWith(ECHO + '?')) {
      assert.equal(init.method, 'GET');
      if (!echoes.has(url)) throw new Error('unknown echo');
      return Response.json(echoes.get(url));
    }
    if (url === MAIL) {
      assert.equal(init.redirect, 'manual', 'redirects are validated by hand, never followed blindly');
      const envelope = JSON.parse(init.body);
      const expected = crypto.createHmac('sha256', MAIL_SECRET).update(`${MAIL_PROTOCOL}\n${envelope.payload}`, 'utf8').digest('hex');
      assert.equal(envelope.signature, expected, 'mail request is signed with the adapter secret');
      assert.ok(!init.body.includes(MAIL_SECRET), 'the mail secret never travels in the request');
      const p = JSON.parse(envelope.payload);
      assert.ok(p.text.includes(p.idempotencyKey), 'every email carries its job reference (sender-side reconciliation)');
      w.mails.push(p);
      const deliver = () => { if (!w.delivered.some((m) => m.idempotencyKey === p.idempotencyKey)) w.delivered.push(p); };
      let reply;
      switch (w.mail) {
        case 'network': throw new TypeError('fetch failed');
        case 'accept-then-timeout': deliver(); throw new DOMException('The operation was aborted.', 'AbortError');
        case 'bad-redirect': deliver(); return new Response(null, { status: 302, headers: { location: 'https://evil.example/echo?x=1' } });
        case 'unsigned': deliver(); return Response.json({ result: 'accepted' });
        case 'wrong-key': deliver(); reply = signedReply(p, 'accepted', '', 'ahv-newsletter-999-0000000000000000'); break;
        case 'reject': reply = signedReply(p, 'rejected', 'SENDER_UNAVAILABLE'); break;
        default: {
          const dup = w.delivered.some((m) => m.idempotencyKey === p.idempotencyKey);
          deliver();
          reply = signedReply(p, dup ? 'duplicate' : 'accepted');
        }
      }
      const echo = `${ECHO}?user_content_key=${crypto.randomBytes(8).toString('hex')}`;
      echoes.set(echo, reply);
      return new Response(null, { status: 302, headers: { location: echo } });
    }
    if (url !== RELAY) { w.unexpected.push(url); throw new Error('unexpected network call'); }
    assert.equal(init.redirect, 'error');
    const h = init.headers;
    const expected = signRelay(RELAY_SECRET, canonicalRequest(h['x-ahv-key-id'], h['x-ahv-timestamp'], h['x-ahv-nonce'], 'POST', new URL(url).pathname, init.body));
    assert.equal(h['x-ahv-signature'], expected, 'relay request signature verifies');
    const request = JSON.parse(init.body);
    w.relayCalls.push(request);
    if (w.relay === 'down') throw new TypeError('fetch failed');
    let result;
    if (w.relay === 'error' || w.failOps.has(request.op)) result = { status: 500, body: { ok: false, code: 'STORE_FAILED' } };
    else result = backend.handle(request.op, request.data);
    const text = JSON.stringify(result.body);
    const sig = w.relay === 'lost-reply' ? '' : signRelay(RELAY_SECRET, canonicalResponse(h['x-ahv-key-id'], h['x-ahv-nonce'], result.status, text));
    return new Response(text, { status: result.status, headers: { 'content-type': 'application/json', 'x-ahv-relay-signature': sig } });
  };
  return w;
}

function scenario(values, fn) {
  return async () => {
    const saved = Object.fromEntries(KEYS.map((k) => [k, process.env[k]]));
    const realFetch = globalThis.fetch;
    for (const k of KEYS) delete process.env[k];
    Object.assign(process.env, values);
    try { await fn(); } finally {
      globalThis.fetch = realFetch;
      for (const k of KEYS) saved[k] === undefined ? delete process.env[k] : (process.env[k] = saved[k]);
    }
  };
}

const signup = (body, { ip = '203.0.113.9', headers = {} } = {}) => new Request('https://staging.example.test/api/newsletter', {
  method: 'POST',
  headers: { 'content-type': 'application/json', accept: 'application/json', 'x-forwarded-for': ip, ...headers },
  body: typeof body === 'string' ? body : JSON.stringify(body),
});
const validBody = (overrides = {}) => ({ email: EMAIL, consent: true, consentVersion: VERSION, sourcePath: '/', ...overrides });
const linkOf = (mail) => new URL(/https:\/\/\S+\/api\/newsletter\/confirm\?\S+/.exec(mail.text)[0]);
const tokenFromMail = (mail) => linkOf(mail).searchParams.get('t');
const formPost = (url, fields, extra = {}) => new Request(url, {
  method: 'POST', headers: { 'content-type': 'application/x-www-form-urlencoded', accept: 'text/html', ...extra }, body: new URLSearchParams(fields).toString(),
});
const confirmWith = (token, l) => confirmPost(formPost(`${ORIGIN}/api/newsletter/confirm`, l ? { t: token, l } : { t: token }));
const cron = (auth = `Bearer ${CRON}`) => outboxGet(new Request(`${ORIGIN}/api/newsletter/outbox`, { headers: auth ? { authorization: auth } : {} }));
const subscriberRow = (w) => w.backend.dump().ahv_newsletter_subscriber[0];
const jobs = (w) => w.backend.dump().ahv_newsletter_confirmation;

async function subscribeOk(w, body = validBody(), opts) {
  const res = await subscribePost(signup(body, opts));
  assert.equal(res.status, 200);
  assert.deepEqual(await res.json(), { ok: true, status: 'pending_confirmation' });
}
async function subscribeCode(w, code, body = validBody(), opts) {
  const res = await subscribePost(signup(body, opts));
  const json = await res.json();
  assert.equal(json.code, code);
  assert.notEqual(json.status, 'pending_confirmation');
  return res.status;
}

// ───────────────────────── fail-closed ─────────────────────────

test('unconfigured in every missing/unsafe way: 503 before the body is read, nothing contacted', async () => {
  const cases = [
    {},
    { ...ENV, AHV_FORM_RELAY_URL: '' },
    { ...ENV, AHV_FORM_RELAY_URL: 'http://relay.example.test/ahv-form-relay/' },
    { ...ENV, AHV_NEWSLETTER_MAIL_PROVIDER: '' },
    { ...ENV, AHV_NEWSLETTER_MAIL_PROVIDER: 'toString' },
    { ...ENV, AHV_NEWSLETTER_MAIL_PROVIDER: 'smtp' },
    { ...ENV, AHV_NEWSLETTER_MAIL_WEBHOOK_URL: 'http://script.google.com/macros/s/x/exec' },
    { ...ENV, AHV_NEWSLETTER_MAIL_WEBHOOK_URL: 'https://evil.example/macros/s/x/exec' },
    { ...ENV, AHV_NEWSLETTER_MAIL_WEBHOOK_SECRET: 'short' },
    { ...ENV, AHV_NEWSLETTER_PUBLIC_ORIGIN: '' },
    { ...ENV, AHV_NEWSLETTER_PUBLIC_ORIGIN: 'http://staging.example.test' },
    { ...ENV, AHV_NEWSLETTER_PUBLIC_ORIGIN: 'https://staging.example.test/path' },
    { ...ENV, AHV_NEWSLETTER_LINK_SECRET: 'x'.repeat(31) },
    { ...ENV, AHV_NEWSLETTER_OUTBOX_KEY: '' },
    { ...ENV, AHV_NEWSLETTER_OUTBOX_KEY: 'x'.repeat(31) },
  ];
  for (const env of cases) {
    await scenario(env, async () => {
      let contacted = 0;
      globalThis.fetch = async () => { contacted++; throw new Error('must not be called'); };
      assert.notEqual(newsletterConfigProblem(), null, JSON.stringify(Object.keys(env)));
      const req = signup(validBody());
      const res = await subscribePost(req);
      assert.equal(res.status, 503);
      assert.equal(req.bodyUsed, false);
      assert.deepEqual(await res.json(), { ok: false, code: 'NEWSLETTER_NOT_CONFIGURED' });
      const confirmReq = formPost('https://x.test/api/newsletter/confirm', { t: 'a'.repeat(43) });
      assert.equal((await confirmPost(confirmReq)).status, 503);
      assert.equal(confirmReq.bodyUsed, false);
      const unsubReq = formPost('https://x.test/api/newsletter/unsubscribe', { u: 'x' });
      assert.equal((await unsubscribePost(unsubReq)).status, 503);
      assert.equal(unsubReq.bodyUsed, false);
      const page = await confirmGet(new Request(`https://x.test/api/newsletter/confirm?t=${'a'.repeat(43)}`));
      assert.equal(page.status, 503);
      assert.match(await page.text(), /Nothing has been saved or sent/);
      assert.equal((await unsubscribeGet(new Request('https://x.test/api/newsletter/unsubscribe?u=x'))).status, 503);
      assert.equal((await cron()).status, 503);
      assert.equal(contacted, 0);
    })();
  }
  await scenario({ ...ENV, CRON_SECRET: '' }, async () => {
    globalThis.fetch = async () => { throw new Error('must not be called'); };
    assert.equal(newsletterConfigProblem(), null, 'CRON_SECRET only gates the worker');
    assert.equal((await cron()).status, 503);
  })();
});

// ───────────────────────── input validation ─────────────────────────

test('invalid input is refused before anything is stored or sent', scenario(ENV, async () => {
  const w = world(jsBackend);
  const refusals = [
    [signup(validBody(), { headers: { 'content-type': 'text/plain' } }), 415, 'INVALID_REQUEST'],
    [signup('x'.repeat(3000)), 413, 'INVALID_REQUEST'],
    [signup('{not json'), 400, 'INVALID_REQUEST'],
    [signup('[]'), 400, 'INVALID_REQUEST'],
    [signup(validBody({ extra: 'x' })), 400, 'INVALID_REQUEST'],
    [signup(validBody({ consent: false })), 400, 'CONSENT_REQUIRED'],
    [signup(validBody({ email: 'not-an-email' })), 400, 'INVALID_EMAIL'],
    [signup(validBody({ email: 'a@b' })), 400, 'INVALID_EMAIL'],
    [signup(validBody({ email: 'two..dots@example.invalid' })), 400, 'INVALID_EMAIL'],
    [signup(validBody({ email: `${'a'.repeat(250)}@x.invalid` })), 400, 'INVALID_EMAIL'],
    [signup(validBody({ email: 'x@example.invalid\r\nBcc: y@example.invalid' })), 400, 'INVALID_EMAIL'],
    [signup(validBody({ consentVersion: 'newsletter-1999' })), 400, 'UNKNOWN_CONSENT_VERSION'],
    [signup(validBody({ consentVersion: '__proto__' })), 400, 'UNKNOWN_CONSENT_VERSION'],
    [signup(validBody({ sourcePath: 'https://evil.example/' })), 400, 'INVALID_SOURCE'],
    [signup(validBody({ sourcePath: '//evil.example/' })), 400, 'INVALID_SOURCE'],
    [signup(validBody({ sourcePath: '/\\evil.example' })), 400, 'INVALID_SOURCE'],
    [signup(validBody({ sourcePath: '/a/../../etc' })), 400, 'INVALID_SOURCE'],
    [signup(validBody({ sourcePath: 'javascript:alert(1)' })), 400, 'INVALID_SOURCE'],
    [signup(validBody({ sourcePath: '/?next=https://evil.example' })), 400, 'INVALID_SOURCE'],
  ];
  for (const [req, status, code] of refusals) {
    const res = await subscribePost(req);
    assert.equal(res.status, status, code);
    assert.equal((await res.json()).code, code);
  }
  assert.equal(w.relayCalls.length, 0, 'nothing persisted');
  assert.equal(w.mails.length, 0, 'nothing sent');
  assert.deepEqual(w.unexpected, []);
}));

for (const backend of BACKENDS) {
  const t = (name, fn) => test(`[${backend.name} relay] ${name}`, { skip: backend.skip }, scenario(ENV, fn));

  // ───────────────────────── accepted → pending, never confirmed ─────────────────────────

  t('accepted signup: pending record + recoverable job persisted first, one email, answer only after a signed acceptance', async () => {
    const w = world(backend.make);
    const res = await subscribePost(signup(validBody({ email: '  Synthetic.Subscriber@Example.INVALID ' })));
    assert.equal(res.status, 200);
    const text = await res.text();
    assert.deepEqual(JSON.parse(text), { ok: true, status: 'pending_confirmation' });
    assert.doesNotMatch(text, /synthetic|guide|@/i, 'no address echoed, no guide attached');
    assert.deepEqual(w.relayCalls.map((c) => c.op), ['newsletter.subscribe', 'newsletter.mail_result']);
    const token = tokenFromMail(w.delivered[0]);
    assert.ok(!JSON.stringify(w.relayCalls).includes(token), 'the raw token never reaches the relay');
    assert.match(w.relayCalls[0].data.token_sealed, SEALED_RE);
    assert.equal(w.delivered.length, 1);
    const mail = w.delivered[0];
    assert.equal(mail.from, NEWSLETTER_SENDER);
    assert.equal(mail.from, 'info@kairali.com');
    assert.equal(mail.to, EMAIL);
    assert.equal(mail.subject, NEWSLETTER_COPY.mailSubject);
    const link = linkOf(mail);
    assert.equal(link.origin, ORIGIN, 'emailed link uses the configured origin, never the request Host');
    assert.deepEqual([...link.searchParams.keys()], ['t'], 'only the opaque token in the URL');
    assert.ok(mail.html.includes(link.toString()));
    const s = subscriberRow(w);
    assert.equal(s.status, 'pending');
    assert.equal(s.email, EMAIL);
    for (const k of ['confirmed_at', 'consent_version', 'consent_text', 'consent_locale', 'consent_source_path']) assert.equal(s[k], null, `${k} only on confirmation`);
    const [c] = jobs(w);
    assert.equal(c.token_hash, hashToken(token));
    assert.equal(c.mail_status, 'sent');
    assert.equal(c.token_sealed, null, 'the seal is dropped once the provider accepted the email');
    assert.equal(c.consent_text, NL.consentVersions[VERSION]);
    assert.deepEqual(w.unexpected, []);
  });

  t('localized signup: locale comes from the same-site source path (zh → zh-Hans) and rides the link as l', async () => {
    const w = world(backend.make);
    await subscribeOk(w, validBody({ sourcePath: '/zh/walk-in-ayurveda-treatment/' }));
    const link = linkOf(w.delivered[0]);
    assert.equal(link.searchParams.get('l'), 'zh-Hans');
    assert.equal(jobs(w)[0].consent_locale, 'zh-Hans');
    const html = await (await confirmGet(new Request(link))).text();
    assert.match(html, /<html lang="zh-Hans" dir="ltr">/);
    assert.match(html, /name="l" value="zh-Hans"/);
  });

  // ───────────────────────── provider outcomes: refused / uncertain / accepted-then-timeout ─────────────────────────

  t('signed provider refusal: truthful 502 (not subscribed), job revoked, that token never confirms; a retry works', async () => {
    const w = world(backend.make);
    w.mail = 'reject';
    assert.equal(await subscribeCode(w, 'CONFIRMATION_MAIL_FAILED'), 502);
    const [job] = jobs(w);
    assert.equal(job.mail_status, 'failed');
    assert.notEqual(job.revoked_at, null);
    assert.equal(job.token_sealed, null);
    assert.equal((await confirmWith(tokenFromMail(w.mails[0]))).status, 400, 'a refused job never confirms');
    w.mail = 'ok';
    await subscribeOk(w);
    assert.equal(w.backend.dump().ahv_newsletter_subscriber.length, 1, 'retries share one pending record');
    assert.equal((await confirmWith(tokenFromMail(w.delivered[0]))).status, 200);
    assert.equal(subscriberRow(w).status, 'confirmed');
  });

  t('provider accepted but the reply timed out: reported as UNCERTAIN (never "not subscribed"), the delivered link still confirms', async () => {
    const w = world(backend.make);
    w.mail = 'accept-then-timeout';
    const res = await subscribePost(signup(validBody()));
    assert.equal(res.status, 502);
    const body = await res.json();
    assert.equal(body.code, 'CONFIRMATION_MAIL_UNCERTAIN');
    assert.doesNotMatch(body.error, /not subscribed/, 'no deterministic claim from a transport timeout');
    const [job] = jobs(w);
    assert.equal(job.mail_status, 'unknown');
    assert.equal(job.revoked_at, null, 'an uncertain job is NOT revoked: the email may be in the inbox');
    assert.match(job.token_sealed, SEALED_RE, 'still recoverable by the outbox worker');
    assert.equal(w.delivered.length, 1);
    assert.equal((await confirmWith(tokenFromMail(w.delivered[0]))).status, 200);
    assert.equal(subscriberRow(w).status, 'confirmed');
  });

  t('network failure before acceptance: UNCERTAIN, then the outbox worker re-sends the SAME link under the SAME job key', async () => {
    const w = world(backend.make);
    w.mail = 'network';
    assert.equal(await subscribeCode(w, 'CONFIRMATION_MAIL_UNCERTAIN'), 502);
    assert.equal(w.delivered.length, 0);
    const firstAttempt = w.mails[0];
    w.mail = 'ok';
    let report = await (await cron()).json();
    assert.equal(report.claimed, 0, 'nothing is re-sent inside the retry delay');
    w.clock.now += NL.outbox.retryDelaySeconds + 1;
    report = await (await cron()).json();
    assert.deepEqual(report, { ok: true, claimed: 1, accepted: 1, rejected: 0, uncertain: 0, unsealable: 0 });
    assert.equal(w.delivered.length, 1);
    assert.equal(w.delivered[0].idempotencyKey, firstAttempt.idempotencyKey);
    assert.equal(tokenFromMail(w.delivered[0]), tokenFromMail(firstAttempt), 'same capability, same link');
    assert.equal(jobs(w)[0].mail_status, 'sent');
    assert.equal((await confirmWith(tokenFromMail(w.delivered[0]))).status, 200);
  });

  t('unsigned, mis-correlated or badly redirected "success" replies are never taken as acceptance', async () => {
    for (const mode of ['unsigned', 'wrong-key', 'bad-redirect']) {
      const w = world(backend.make);
      w.mail = mode;
      assert.equal(await subscribeCode(w, 'CONFIRMATION_MAIL_UNCERTAIN'), 502, mode);
      assert.equal(jobs(w)[0].mail_status, 'unknown', mode);
      assert.ok(!w.unexpected.length, mode);
    }
  });

  t('refusal whose revoke bookkeeping keeps failing: still truthful, never "sent", and the job stays recoverable', async () => {
    const w = world(backend.make);
    w.mail = 'reject';
    w.failOps.add('newsletter.mail_result');
    assert.equal(await subscribeCode(w, 'CONFIRMATION_MAIL_FAILED'), 502);
    assert.equal(w.relayCalls.filter((c) => c.op === 'newsletter.mail_result').length, 3, 'bookkeeping retried (bounded)');
    const [job] = jobs(w);
    assert.equal(job.mail_status, 'queued');
    assert.notEqual(job.mail_status, 'sent');
    assert.equal(subscriberRow(w).status, 'pending');
    w.failOps.clear();
    w.mail = 'ok';
    w.clock.now += NL.outbox.inlineLeaseSeconds + 1;
    const report = await (await cron()).json();
    assert.equal(report.accepted, 1, 'recovered by the outbox worker once the provider accepts');
    assert.equal(jobs(w)[0].mail_status, 'sent');
  });

  // ───────────────────────── crash recovery ─────────────────────────

  t('crash after the job was committed but before any send: the worker delivers it; an immediate retry is never answered without an email', async () => {
    const w = world(backend.make);
    // What the route does up to the crash point: token → seal → relay commit. Then the process dies.
    const { token, tokenHash } = newConfirmationToken();
    const stranded = await relayNewsletterStore({ env: ENV }).subscribe({ email: EMAIL, consentVersion: VERSION, consentLocale: 'en', sourcePath: '/', submitIp: '203.0.113.9', tokenHash, tokenSealed: sealToken(token, tokenHash, ENV) });
    assert.equal(stranded.send, true);
    assert.equal(w.mails.length, 0);
    // The visitor retries at once (the parent probe): a queued job must not make this answer "quiet".
    await subscribeOk(w, validBody(), { ip: '203.0.113.10' });
    assert.equal(w.delivered.length, 1, 'the retry produced its own accepted email');
    // After the inline lease lapses, the worker sends the stranded job with its ORIGINAL link.
    w.clock.now += NL.outbox.inlineLeaseSeconds + 1;
    const report = await (await cron()).json();
    assert.equal(report.accepted, 1);
    assert.equal(w.delivered.length, 2);
    assert.equal(tokenFromMail(w.delivered[1]), token);
    assert.equal((await confirmWith(token)).status, 200);
    assert.equal((await confirmWith(tokenFromMail(w.delivered[0]))).status, 400, 'the first confirmation revokes the other link');
  });

  t('relay unreachable / failing: 502 STORE_FAILED and no email; a reply lost after commit is recovered, never faked', async () => {
    const w = world(backend.make);
    for (const mode of ['down', 'error']) {
      w.relay = mode;
      assert.equal(await subscribeCode(w, 'STORE_FAILED'), 502, mode);
    }
    assert.equal(w.mails.length, 0);
    w.relay = 'lost-reply';
    assert.equal(await subscribeCode(w, 'STORE_FAILED'), 502);
    assert.equal(w.mails.length, 0, 'no email on an unverified store');
    w.relay = 'ok';
    w.clock.now += NL.outbox.inlineLeaseSeconds + 1;
    const report = await (await cron()).json();
    assert.equal(report.accepted, 1, 'the committed job is delivered by the worker');
    await subscribeOk(w);
    assert.equal(w.delivered.length, 1, 'inside the cooldown of an ACCEPTED email a repeat is quiet');
  });

  // ───────────────────────── duplicates, concurrency, enumeration ─────────────────────────

  t('duplicate signups: one pending lifecycle, no second email inside the cooldown, identical neutral answers', async () => {
    const w = world(backend.make);
    const first = await (await subscribePost(signup(validBody()))).text();
    const second = await subscribePost(signup(validBody()));
    assert.equal(second.status, 200);
    assert.equal(await second.text(), first);
    assert.equal(w.delivered.length, 1);
    assert.equal(w.backend.dump().ahv_newsletter_subscriber.length, 1);
    assert.equal(jobs(w).length, 1);
  });

  t('concurrent signups: one subscriber row, bounded emails, and the first confirmation revokes the other links', async () => {
    const w = world(backend.make);
    const responses = await Promise.all([1, 2, 3, 4].map(() => subscribePost(signup(validBody()))));
    const answers = await Promise.all(responses.map((r) => r.json()));
    assert.equal(w.backend.dump().ahv_newsletter_subscriber.length, 1);
    assert.ok(w.delivered.length >= 1 && w.delivered.length <= NL.limits.sendsPerEmailPerDay, `emails sent: ${w.delivered.length}`);
    for (const a of answers) assert.ok(a.status === 'pending_confirmation' || a.code === 'RATE_LIMITED', JSON.stringify(a));
    const tokens = w.delivered.map(tokenFromMail);
    assert.equal((await confirmWith(tokens.at(-1))).status, 200);
    for (const other of tokens.slice(0, -1)) assert.equal((await confirmWith(other)).status, 400);
    assert.equal(subscriberRow(w).status, 'confirmed');
  });

  t('a confirmed address re-signing up gets the same neutral answer and no email (no enumeration)', async () => {
    const w = world(backend.make);
    await subscribeOk(w);
    const unknown = await (await subscribePost(signup(validBody({ email: 'other@example.invalid' }), { ip: '203.0.113.50' }))).text();
    assert.equal((await confirmWith(tokenFromMail(w.delivered[0]))).status, 200);
    const before = w.mails.length;
    w.clock.now += 3600;
    const again = await subscribePost(signup(validBody(), { ip: '203.0.113.51' }));
    assert.equal(again.status, 200);
    assert.equal(await again.text(), unknown);
    assert.equal(w.mails.length, before, 'nothing sent to an already-confirmed address');
  });

  // ───────────────────────── abuse limits ─────────────────────────

  t('abuse limits persist server-side: per IP, per address, and confirmation emails per address', async () => {
    const w = world(backend.make);
    for (let i = 0; i < NL.limits.perIpPerHour; i++) await subscribeOk(w, validBody({ email: `ip${i}@example.invalid` }), { ip: '198.51.100.7' });
    assert.equal(await subscribeCode(w, 'RATE_LIMITED', validBody({ email: 'ipx@example.invalid' }), { ip: '198.51.100.7' }), 429);
    w.clock.now += 3601;
    await subscribeOk(w, validBody({ email: 'ipx@example.invalid' }), { ip: '198.51.100.7' });

    // Accepted emails spaced beyond the cooldown: only sendsPerEmailPerDay go out, later repeats stay neutral.
    const target = 'bomb@example.invalid';
    const sentBefore = w.delivered.length;
    for (let i = 0; i < NL.limits.perEmailPerDay; i++) {
      await subscribeOk(w, validBody({ email: target }), { ip: `192.0.2.${i + 1}` });
      w.clock.now += NL.limits.resendCooldownSeconds + 1;
    }
    assert.equal(w.delivered.length - sentBefore, NL.limits.sendsPerEmailPerDay, 'email bombing capped');
    assert.equal(await subscribeCode(w, 'RATE_LIMITED', validBody({ email: target }), { ip: '192.0.2.99' }), 429, 'per-address attempt ceiling');
    assert.equal(w.delivered.length - sentBefore, NL.limits.sendsPerEmailPerDay);
  });

  t('email ceiling reached with NO accepted email: honest 429, never "check your email"', async () => {
    const w = world(backend.make);
    w.mail = 'network';
    for (let i = 0; i < NL.limits.sendsPerEmailPerDay; i++) assert.equal(await subscribeCode(w, 'CONFIRMATION_MAIL_UNCERTAIN', validBody(), { ip: `192.0.2.${i + 1}` }), 502);
    assert.equal(await subscribeCode(w, 'RATE_LIMITED', validBody(), { ip: '192.0.2.50' }), 429);
    assert.equal(w.delivered.length, 0);
  });

  // ───────────────────────── confirmation ─────────────────────────

  t('confirm: GET consumes nothing; explicit POST confirms once with consent evidence; replay/tamper neutral', async () => {
    const w = world(backend.make);
    await subscribeOk(w, validBody({ sourcePath: '/de/kontakt/' }));
    const token = tokenFromMail(w.delivered[0]);
    const callsBefore = w.relayCalls.length;
    const page = await confirmGet(new Request(`${ORIGIN}/api/newsletter/confirm?t=${token}&l=de`));
    assert.equal(page.status, 200);
    assert.equal(page.headers.get('referrer-policy'), 'no-referrer');
    assert.match(page.headers.get('content-security-policy'), /default-src 'none'/);
    assert.equal(page.headers.get('cache-control'), 'no-store');
    const html = await page.text();
    assert.match(html, /<form method="post" action="\/api\/newsletter\/confirm">/);
    assert.match(html, new RegExp(`name="t" value="${token}"`));
    assert.doesNotMatch(html, /<script/i);
    assert.equal(w.relayCalls.length, callsBefore, 'a link scanner fetching the email link changes nothing');
    assert.equal(subscriberRow(w).status, 'pending');

    const tampered = token.slice(0, -1) + (token.endsWith('A') ? 'B' : 'A');
    assert.equal((await confirmWith(tampered)).status, 400);
    assert.equal((await confirmWith('short')).status, 400);
    assert.equal(subscriberRow(w).status, 'pending');

    w.clock.now += 120;
    const ok = await confirmWith(token, 'de');
    assert.equal(ok.status, 200);
    const okHtml = await ok.text();
    assert.match(okHtml, /<html lang="de"/);
    const unsubscribeHref = /href="([^"]*\/api\/newsletter\/unsubscribe\?[^"]*)"/.exec(okHtml)[1].replace(/&amp;/g, '&');
    assert.equal(new URL(unsubscribeHref).origin, ORIGIN);
    const s = subscriberRow(w);
    assert.equal(s.status, 'confirmed');
    assert.equal(Number(s.suppressed), 0);
    assert.notEqual(s.confirmed_at, null);
    assert.equal(s.consent_version, VERSION);
    assert.equal(s.consent_text, NL.consentVersions[VERSION]);
    assert.equal(s.consent_locale, 'de');
    assert.equal(s.consent_source_path, '/de/kontakt/');

    const replay = await confirmWith(token);
    assert.equal(replay.status, 400);
    assert.match(await replay.text(), /no longer valid/);
    assert.equal(subscriberRow(w).confirmed_at, s.confirmed_at, 'replay changes nothing');
  });

  t('confirm: an expired token never confirms; a concurrent double-submit confirms exactly once', async () => {
    const w = world(backend.make);
    await subscribeOk(w);
    w.clock.now += NL.confirmationTtlHours * 3600 + 1;
    assert.equal((await confirmWith(tokenFromMail(w.delivered[0]))).status, 400);
    assert.equal(subscriberRow(w).status, 'pending');
    await subscribeOk(w);
    const token = tokenFromMail(w.delivered[1]);
    const results = await Promise.all([confirmWith(token), confirmWith(token), confirmWith(token)]);
    assert.deepEqual(results.map((r) => r.status).sort(), [200, 400, 400]);
    assert.equal(subscriberRow(w).status, 'confirmed');
  });

  t('confirm JSON variant answers without HTML and without subscriber detail', async () => {
    const w = world(backend.make);
    await subscribeOk(w);
    const req = new Request(`${ORIGIN}/api/newsletter/confirm`, { method: 'POST', headers: { 'content-type': 'application/json', accept: 'application/json' }, body: JSON.stringify({ t: tokenFromMail(w.delivered[0]) }) });
    assert.deepEqual(await (await confirmPost(req)).json(), { ok: true, status: 'confirmed' });
  });

  // ───────────────────────── unsubscribe / suppression ─────────────────────────

  t('unsubscribe: authenticated opaque link, GET changes nothing, POST suppresses immediately and idempotently', async () => {
    const w = world(backend.make);
    await subscribeOk(w);
    const confirmed = await (await confirmWith(tokenFromMail(w.delivered[0]))).text();
    const href = new URL(/href="([^"]*\/api\/newsletter\/unsubscribe\?[^"]*)"/.exec(confirmed)[1].replace(/&amp;/g, '&'));
    const u = href.searchParams.get('u');
    assert.match(u, /^[0-9a-f]{32}\.[A-Za-z0-9_-]{43}$/);
    assert.ok(!u.includes('example.invalid'));
    const calls = w.relayCalls.length;
    const page = await unsubscribeGet(new Request(href));
    assert.equal(page.status, 200);
    assert.match(await page.text(), /<form method="post" action="\/api\/newsletter\/unsubscribe">/);
    assert.equal(w.relayCalls.length, calls);

    const forged = u.slice(0, 33) + (u[33] === 'A' ? 'B' : 'A') + u.slice(34);
    assert.equal((await unsubscribePost(formPost(`${ORIGIN}/api/newsletter/unsubscribe`, { u: forged }))).status, 400);
    assert.equal(w.relayCalls.length, calls, 'a forged link never reaches the relay');
    assert.equal(subscriberRow(w).status, 'confirmed');

    const first = await unsubscribePost(formPost(`${ORIGIN}/api/newsletter/unsubscribe`, { u }));
    assert.equal(first.status, 200);
    assert.match(await first.text(), /You are unsubscribed/);
    assert.equal(subscriberRow(w).status, 'unsubscribed');
    assert.equal(Number(subscriberRow(w).suppressed), 1);
    const oneClick = new Request(`${ORIGIN}/api/newsletter/unsubscribe?u=${encodeURIComponent(u)}`, { method: 'POST', headers: { 'content-type': 'application/x-www-form-urlencoded' }, body: 'List-Unsubscribe=One-Click' });
    assert.equal((await unsubscribePost(oneClick)).status, 200);
    assert.equal(subscriberRow(w).status, 'unsubscribed');
  });

  t('suppression survives retries, resends, re-imports AND the outbox worker; only a fresh opt-in + confirmation lifts it', async () => {
    const w = world(backend.make);
    await subscribeOk(w);
    await confirmWith(tokenFromMail(w.delivered[0]));
    const publicId = subscriberRow(w).public_id;
    await unsubscribePost(formPost(`${ORIGIN}/api/newsletter/unsubscribe`, { u: unsubscribeToken(publicId, ENV) }));
    // A fresh opt-in whose email ended uncertain (job recoverable), then the address unsubscribes again.
    w.clock.now += 1;
    w.mail = 'network';
    await subscribeCode(w, 'CONFIRMATION_MAIL_UNCERTAIN', validBody(), { ip: '203.0.113.60' });
    const stale = tokenFromMail(w.mails.at(-1));
    await unsubscribePost(formPost(`${ORIGIN}/api/newsletter/unsubscribe`, { u: unsubscribeToken(publicId, ENV) }));
    w.mail = 'ok';
    w.clock.now += NL.outbox.retryDelaySeconds + 1;
    const report = await (await cron()).json();
    assert.equal(report.claimed, 0, 'the worker never re-sends a job revoked by an unsubscribe');
    assert.equal((await confirmWith(stale)).status, 400, 'a token issued before the unsubscribe never re-subscribes');
    assert.equal(subscriberRow(w).status, 'unsubscribed');

    // Retry / import through the only ingestion op: still suppressed until a fresh confirmation.
    await subscribeOk(w, validBody(), { ip: '203.0.113.61' });
    let s = subscriberRow(w);
    assert.equal(s.status, 'unsubscribed');
    assert.equal(Number(s.suppressed), 1);
    assert.equal((await confirmWith(tokenFromMail(w.delivered.at(-1)))).status, 200);
    s = subscriberRow(w);
    assert.equal(s.status, 'confirmed');
    assert.equal(Number(s.suppressed), 0);
  });

  // ───────────────────────── outbox worker ─────────────────────────

  t('outbox worker: bearer-authenticated, leases each job once, respects the attempt budget, skips confirmed and unsealable jobs', async () => {
    const w = world(backend.make);
    const calls = () => w.relayCalls.length;
    const before = calls();
    assert.equal((await cron('Bearer wrong')).status, 401);
    assert.equal((await cron(null)).status, 401);
    assert.equal(calls(), before, 'an unauthenticated trigger never reaches the relay');

    w.mail = 'network';
    await subscribeCode(w, 'CONFIRMATION_MAIL_UNCERTAIN', validBody({ email: 'a@example.invalid' }), { ip: '203.0.113.71' });
    await subscribeCode(w, 'CONFIRMATION_MAIL_UNCERTAIN', validBody({ email: 'b@example.invalid' }), { ip: '203.0.113.72' });
    w.clock.now += NL.outbox.retryDelaySeconds + 1;
    // Two workers at once: each job is claimed by exactly one of them.
    w.mail = 'ok';
    const [r1, r2] = await Promise.all([processOutbox(defaultNewsletterDeps(ENV)), processOutbox(defaultNewsletterDeps(ENV))]);
    assert.equal(r1.claimed + r2.claimed, 2);
    assert.equal(w.delivered.length, 2);
    assert.equal(new Set(w.delivered.map((m) => m.idempotencyKey)).size, 2);

    // Attempt budget: a job that keeps ending uncertain stops being retried.
    w.mail = 'network';
    await subscribeCode(w, 'CONFIRMATION_MAIL_UNCERTAIN', validBody({ email: 'c@example.invalid' }), { ip: '203.0.113.73' });
    let attempts = 1;
    for (let i = 0; i < 10; i++) {
      w.clock.now += NL.outbox.retryDelaySeconds + 1;
      const r = await (await cron()).json();
      attempts += r.claimed;
    }
    assert.equal(attempts, NL.outbox.maxSendAttempts);
    const cJob = jobs(w).find((j) => j.consent_locale && j.id === Math.max(...jobs(w).map((x) => x.id)));
    assert.equal(cJob.token_sealed, null, 'the seal is dropped when the budget is spent');
    assert.equal(cJob.revoked_at, null, 'an uncertain job is not revoked: its email may have arrived');

    // Unsealable (outbox key rotated): counted, never sent.
    w.mail = 'network';
    await subscribeCode(w, 'CONFIRMATION_MAIL_UNCERTAIN', validBody({ email: 'd@example.invalid' }), { ip: '203.0.113.74' });
    w.clock.now += NL.outbox.retryDelaySeconds + 1;
    w.mail = 'ok';
    const sentBefore = w.mails.length;
    const rotated = await processOutbox(defaultNewsletterDeps({ ...ENV, AHV_NEWSLETTER_OUTBOX_KEY: 'z'.repeat(40) }));
    assert.equal(rotated.unsealable, 1);
    assert.equal(w.mails.length, sentBefore);

    // Confirmed in the meantime: its leftover job is not re-sent.
    w.mail = 'network';
    await subscribeCode(w, 'CONFIRMATION_MAIL_UNCERTAIN', validBody({ email: 'e@example.invalid' }), { ip: '203.0.113.75' });
    w.mail = 'ok';
    w.clock.now += NL.limits.resendCooldownSeconds + 1;
    await subscribeOk(w, validBody({ email: 'e@example.invalid' }), { ip: '203.0.113.76' });
    await confirmWith(tokenFromMail(w.delivered.at(-1)));
    w.clock.now += NL.outbox.retryDelaySeconds + 1;
    const mailsNow = w.mails.length;
    await cron();
    assert.equal(w.mails.filter((m, i) => i >= mailsNow && m.to === 'e@example.invalid').length, 0);
  });
}

// ───────────────────────── PHP relay: strict schema on the real code ─────────────────────────

test('PHP relay newsletter ops refuse malformed payloads and never accept a client-supplied consent text', { skip: !HAS_PHP_SQLITE && 'php/pdo_sqlite not installed' }, () => {
  const b = phpBackend({ now: 1_790_000_000 });
  const good = { email: EMAIL, consent_version: VERSION, consent_locale: 'en', source_path: '/', submit_ip: '203.0.113.9', token_hash: sha('t'), token_sealed: 'v1.' + 'A'.repeat(80) };
  const refuse = (data, code, field, op = 'newsletter.subscribe') => {
    const r = b.handle(op, data);
    assert.equal(r.status, 400, JSON.stringify(data));
    assert.equal(r.body.code, code);
    if (field) assert.equal(r.body.field, field);
  };
  refuse({ ...good, consent_text: 'I agree to anything' }, 'SCHEMA_VIOLATION', 'consent_text');
  refuse({ ...good, email: 'nope' }, 'INVALID_EMAIL');
  refuse({ ...good, email: { $gt: '' } }, 'SCHEMA_VIOLATION', 'email');
  refuse({ ...good, consent_version: 'x' }, 'UNKNOWN_CONSENT_VERSION');
  refuse({ ...good, consent_locale: 'xx' }, 'SCHEMA_VIOLATION', 'consent_locale');
  refuse({ ...good, source_path: '//evil.example' }, 'SCHEMA_VIOLATION', 'source_path');
  refuse({ ...good, source_path: '/a/../b' }, 'SCHEMA_VIOLATION', 'source_path');
  refuse({ ...good, submit_ip: '999.0.0.1' }, 'SCHEMA_VIOLATION', 'submit_ip');
  refuse({ ...good, token_hash: 'abc' }, 'SCHEMA_VIOLATION', 'token_hash');
  refuse({ ...good, token_sealed: 'plain-token' }, 'SCHEMA_VIOLATION', 'token_sealed');
  refuse({ ...good, email: 'a\u0000@example.invalid' }, 'SCHEMA_VIOLATION', 'email');
  refuse({ token_hash: 'zz' }, 'SCHEMA_VIOLATION', 'token_hash', 'newsletter.confirm');
  refuse({ public_id: "1' OR '1'='1" }, 'SCHEMA_VIOLATION', 'public_id', 'newsletter.unsubscribe');
  refuse({ confirmation_id: '1', token_hash: sha('t'), result: 'sent' }, 'SCHEMA_VIOLATION', undefined, 'newsletter.mail_result');
  refuse({ confirmation_id: 1, token_hash: sha('t'), result: 'delivered' }, 'SCHEMA_VIOLATION', undefined, 'newsletter.mail_result');
  refuse({ limit: 5, extra: 1 }, 'SCHEMA_VIOLATION', 'extra', 'newsletter.claim');
  assert.equal(b.handle('newsletter.drop', {}).body.code, 'UNKNOWN_OPERATION');
  assert.equal(b.dump().ahv_newsletter_subscriber.length, 0, 'nothing stored for any refusal');
  const ok = b.handle('newsletter.subscribe', good);
  assert.deepEqual(Object.keys(ok.body).sort(), ['confirmation_id', 'ok', 'send'], 'the answer reveals nothing about the address');
  assert.equal(b.dump().ahv_newsletter_confirmation[0].consent_text, NL.consentVersions[VERSION]);
});

test('newsletter relay code and tables are separate from the patient lead tables', () => {
  const php = fs.readFileSync(new URL('../bridge/form-relay/relay-core.php', import.meta.url), 'utf8');
  const block = php.slice(php.indexOf('// ───────────────────────────── Newsletter'), php.indexOf('function ahv_relay_json'));
  assert.ok(block.length > 1000);
  for (const table of Object.keys(SCHEMA.tables)) assert.doesNotMatch(block, new RegExp(`['\`]${table}['\`]`), `newsletter code never names lead table ${table}`);
  assert.doesNotMatch(block, /lead\.store|ahv_relay_store_lead/);
  const sql = fs.readFileSync(new URL('../bridge/form-relay/newsletter-tables.sql', import.meta.url), 'utf8');
  assert.deepEqual([...sql.matchAll(/CREATE TABLE IF NOT EXISTS `([^`]+)`/g)].map((m) => m[1]), ['ahv_newsletter_subscriber', 'ahv_newsletter_confirmation', 'ahv_newsletter_limit']);
  assert.doesNotMatch(fs.readFileSync(new URL('../lib/newsletter-store.ts', import.meta.url), 'utf8'), /lead\.store|lead-sheet|deliverLeadToSheet/);
});

test('lock order: every newsletter transaction takes limit → subscriber → confirmation, and retries deadlocks', () => {
  const php = fs.readFileSync(new URL('../bridge/form-relay/relay-core.php', import.meta.url), 'utf8');
  const fn = (name) => php.slice(php.indexOf(`function ${name}(`), php.indexOf('\n}\n', php.indexOf(`function ${name}(`)));
  const confirm = fn('ahv_relay_newsletter_confirm');
  assert.ok(confirm.indexOf('AHV_NL_SUBSCRIBER) . \' WHERE `id` = ? LIMIT 1\' . ahv_nl_lock') < confirm.indexOf('AHV_NL_CONFIRMATION) . \' WHERE `id` = ? LIMIT 1\' . ahv_nl_lock'), 'confirm locks subscriber before token');
  assert.doesNotMatch(confirm.slice(0, confirm.indexOf('ahv_nl_transaction')), /ahv_nl_lock/, 'the token lookup before the transaction takes no lock');
  const subscribe = fn('ahv_relay_newsletter_subscribe');
  assert.ok(subscribe.indexOf("ahv_nl_lock_limit($pdo, 'ip'") < subscribe.indexOf("ahv_nl_lock_limit($pdo, 'email'"));
  assert.ok(subscribe.indexOf("ahv_nl_lock_limit($pdo, 'email'") < subscribe.indexOf('AHV_NL_SUBSCRIBER) . \' WHERE `email_hash` = ? LIMIT 1\' . ahv_nl_lock'));
  for (const name of ['ahv_relay_newsletter_subscribe', 'ahv_relay_newsletter_confirm', 'ahv_relay_newsletter_unsubscribe']) assert.match(fn(name), /ahv_nl_transaction\(/, name);
  assert.match(fn('ahv_nl_is_retryable'), /1213, 1205/);
});

// ───────────────────────── guide independence, logs, client contract, copy ─────────────────────────

test('guide downloads never depend on the newsletter (and the newsletter never hands out the guide)', scenario({}, async () => {
  assert.notEqual(newsletterConfigProblem(), null);
  assert.match(guideDownloadUrl('de'), /^\/documents\/pdf\/healing-secrets\/de\//);
  assert.doesNotMatch(fs.readFileSync(new URL('../app/api/lead/route.ts', import.meta.url), 'utf8'), /newsletter/i);
  for (const file of ['../app/api/newsletter/route.ts', '../app/api/newsletter/confirm/route.ts', '../app/api/newsletter/unsubscribe/route.ts', '../app/api/newsletter/outbox/route.ts', '../lib/newsletter.ts', '../lib/newsletter-store.ts', '../lib/newsletter-mail.ts']) {
    assert.doesNotMatch(fs.readFileSync(new URL(file, import.meta.url), 'utf8'), /guide-download|guideUrl|guideDownloadUrl|healing-secrets/i, file);
  }
}));

test('no email, token or secret is ever logged across the whole lifecycle (incl. failures and the worker)', scenario(ENV, async () => {
  const logged = [];
  const saved = {};
  for (const m of ['log', 'info', 'warn', 'error', 'debug', 'trace']) { saved[m] = console[m]; console[m] = (...args) => logged.push(args.map(String).join(' ')); }
  try {
    const w = world(jsBackend);
    await subscribeOk(w);
    w.clock.now += NL.limits.resendCooldownSeconds + 1;
    w.mail = 'network';
    await subscribePost(signup(validBody()));
    w.mail = 'ok';
    w.clock.now += NL.outbox.retryDelaySeconds + 1;
    await cron();
    w.relay = 'down';
    await confirmWith(tokenFromMail(w.delivered[0]));
    w.relay = 'ok';
    const done = await (await confirmWith(tokenFromMail(w.delivered[0]))).text();
    const href = /href="([^"]*\/api\/newsletter\/unsubscribe\?[^"]*)"/.exec(done)[1].replace(/&amp;/g, '&');
    await unsubscribePost(formPost(href, {}));
  } finally {
    for (const m of Object.keys(saved)) console[m] = saved[m];
  }
  assert.deepEqual(logged, []);
  for (const file of ['../lib/newsletter.ts', '../lib/newsletter-store.ts', '../lib/newsletter-mail.ts', '../lib/newsletter-copy.ts', '../app/api/newsletter/route.ts', '../app/api/newsletter/confirm/route.ts', '../app/api/newsletter/unsubscribe/route.ts', '../app/api/newsletter/outbox/route.ts']) {
    assert.doesNotMatch(fs.readFileSync(new URL(file, import.meta.url), 'utf8'), /console\.|localStorage|sessionStorage|document\.cookie/, file);
  }
}));

test('client contract: known version + exact form text; "Check your email" only on pending_confirmation; every status string extractable', () => {
  const client = fs.readFileSync(new URL('../public/design/newsletter.js', import.meta.url), 'utf8');
  const sent = /consentVersion: '([^']+)'/.exec(client)[1];
  assert.ok(Object.hasOwn(NL.consentVersions, sent));
  assert.ok(newsletterMarkup.includes(NL.consentVersions[sent]), 'recorded consent text is exactly the permission text beside the form');
  assert.match(client, /response\.ok && data\.ok === true && data\.status === 'pending_confirmation'/);
  assert.equal((client.match(/Check your email/g) || []).length, 1);
  assert.doesNotMatch(client, /localStorage|sessionStorage|gtag|dataLayer|fbq|clarity/);
  const allow = JSON.parse(fs.readFileSync(new URL('../l10n/source/runtime-allowlist.json', import.meta.url), 'utf8'))['newsletter.js'];
  for (const [, literal] of client.matchAll(/(?:status\.textContent|button\.textContent) = '([^']+)'/g)) assert.ok(allow.includes(literal), `allowlisted: ${literal}`);
});

test('copy: every visitor-facing string is extractable by the l10n pipeline and stays in the clinical register', () => {
  const ui = JSON.parse(fs.readFileSync(new URL('../l10n/source/ui-strings.json', import.meta.url), 'utf8')).strings;
  for (const [key, value] of Object.entries(NEWSLETTER_COPY)) {
    assert.ok(ui.includes(value), `${key} is listed in l10n/source/ui-strings.json`);
    assert.doesNotMatch(value, /\b(spa|resort|holiday|luxury|cure|journey|guests?)\b/i, `KTAHV language lock: ${key}`);
  }
  assert.match(NEWSLETTER_COPY.mailExpiry, new RegExp(`\\b${NL.confirmationTtlHours} hours\\b`), 'expiry copy matches the relay TTL');
  assert.equal(localeFromPath('/de/x/'), 'de');
  assert.equal(localeFromPath('/zh/'), 'zh-Hans');
  assert.equal(localeFromPath('/designs/'), 'en');
  assert.equal(localeFromPath('/'), 'en');
});

// ───────────────────────── sealing, adapter, Apps Script sender ─────────────────────────

test('outbox seal: AES-GCM bound to the token hash; wrong key, wrong hash or tampering never unseal', () => {
  const { token, tokenHash } = newConfirmationToken();
  const sealed = sealToken(token, tokenHash, ENV);
  assert.match(sealed, SEALED_RE);
  assert.ok(!sealed.includes(token));
  assert.equal(unsealToken(sealed, tokenHash, ENV), token);
  assert.equal(unsealToken(sealed, sha('other'), ENV), null);
  assert.equal(unsealToken(sealed, tokenHash, { ...ENV, AHV_NEWSLETTER_OUTBOX_KEY: 'q'.repeat(40) }), null);
  const flipped = sealed.slice(0, 10) + (sealed[10] === 'A' ? 'B' : 'A') + sealed.slice(11);
  assert.equal(unsealToken(flipped, tokenHash, ENV), null);
  assert.notEqual(sealToken(token, tokenHash, ENV), sealed, 'fresh IV per seal');
});

test('mail adapter: env-selected, no default provider, correlated signed acknowledgement or it is not accepted', async () => {
  assert.equal(newsletterMailProblem({}), 'missing');
  assert.equal(newsletterMailProblem({ AHV_NEWSLETTER_MAIL_PROVIDER: 'constructor' }), 'unknown_provider');
  assert.equal(newsletterMailProblem({ ...ENV }), null);
  assert.throws(() => createNewsletterMailer({}), /MAIL_NOT_CONFIGURED/);
  const msg = { to: EMAIL, subject: 's', text: 't ahv-newsletter-1-abcd', html: '', idempotencyKey: 'ahv-newsletter-1-abcd' };
  const run = (answer) => createNewsletterMailer(ENV, async (url, init) => answer(JSON.parse(JSON.parse(init.body).payload), url, init)).send(msg);
  const sign = (p, result, code = '', key = p.idempotencyKey, nonce = p.nonce) => ({ result, code, nonce, idempotencyKey: key, signature: mailReplySignature(MAIL_SECRET, nonce, key, result, code) });
  assert.equal(await run((p) => Response.json(sign(p, 'accepted'))), 'accepted');
  assert.equal(await run((p) => Response.json(sign(p, 'duplicate'))), 'accepted');
  assert.equal(await run((p) => Response.json(sign(p, 'rejected', 'SENDER_UNAVAILABLE'))), 'rejected');
  assert.equal(await run((p) => Response.json(sign(p, 'unknown', 'RECONCILING'))), 'uncertain');
  assert.equal(await run(() => Response.json({ result: 'success' })), 'uncertain', 'generic success JSON proves nothing');
  assert.equal(await run((p) => Response.json({ ...sign(p, 'accepted'), signature: '0'.repeat(64) })), 'uncertain');
  assert.equal(await run((p) => Response.json(sign(p, 'accepted', '', 'ahv-newsletter-2-ffff'))), 'uncertain', 'bound to this job');
  assert.equal(await run((p) => Response.json(sign(p, 'accepted', '', p.idempotencyKey, 'another-nonce-000000'))), 'uncertain', 'bound to this request');
  assert.equal(await run(() => new Response('<html>login</html>')), 'uncertain');
  assert.equal(await run(() => new Response('x', { status: 500 })), 'uncertain');
  assert.equal(await run(() => { throw new TypeError('offline'); }), 'uncertain');
  assert.equal(await run(() => new Response(null, { status: 302, headers: { location: 'https://evil.example/x' } })), 'uncertain');
  assert.equal(await run(() => new Response(null, { status: 302, headers: { location: 'http://script.googleusercontent.com/x' } })), 'uncertain');
  let hops = 0;
  assert.equal(await run(() => { hops++; return new Response(null, { status: 302, headers: { location: 'https://script.googleusercontent.com/loop' } }); }), 'uncertain');
  assert.ok(hops <= 3, 'bounded redirects');
});

function loadMailScript({ aliases = [], effective = 'someone@example.invalid', secret = MAIL_SECRET, failJournalAfterSend = false, sendThrows = false, indexed = true } = {}) {
  const sentMail = [];
  const cache = new Map();
  const props = new Map([['AHV_NEWSLETTER_MAIL_SECRET', secret]]);
  let clockOffset = 0;
  const state = { failJournalAfterSend, sendThrows, indexed };
  const context = {
    PropertiesService: { getScriptProperties: () => ({
      getProperty: (k) => props.get(k) ?? null,
      setProperty: (k, v) => {
        if (state.failJournalAfterSend && k.startsWith('nlj:') && v.includes('"accepted"')) { state.failJournalAfterSend = false; throw new Error('Service invoked too many times'); }
        props.set(k, v);
      },
      deleteProperty: (k) => props.delete(k),
      getKeys: () => [...props.keys()],
    }) },
    Utilities: { computeHmacSha256Signature: (value, key) => [...crypto.createHmac('sha256', key).update(value, 'utf8').digest()].map((b) => (b > 127 ? b - 256 : b)) },
    Session: { getEffectiveUser: () => ({ getEmail: () => effective }) },
    GmailApp: {
      getAliases: () => aliases,
      sendEmail: (...args) => { sentMail.push(args); if (state.sendThrows) { state.sendThrows = false; throw new Error('Gmail timed out'); } },
      search: (q) => (state.indexed ? sentMail.filter((m) => q.includes(/Reference: (\S+)/.exec(m[2])?.[1] ?? '\u0000')).map(() => ({})) : []),
    },
    CacheService: { getScriptCache: () => ({ get: (k) => cache.get(k) ?? null, put: (k, v) => cache.set(k, v) }) },
    LockService: { getScriptLock: () => ({ waitLock() {}, releaseLock() {} }) },
    ContentService: { createTextOutput: (s) => ({ setMimeType: () => JSON.parse(s) }), MimeType: { JSON: 'json' } },
    console: { log() {} },
    JSON, Math, Date: { now: () => Date.now() + clockOffset * 1000 },
  };
  vm.createContext(context);
  vm.runInContext(fs.readFileSync(new URL('../scripts/apps-script/newsletter-mail.gs', import.meta.url), 'utf8'), context);
  const post = (overrides = {}, key = MAIL_SECRET) => {
    const payload = { v: 1, action: 'newsletter.confirmation', from: 'info@kairali.com', to: EMAIL, subject: 'Please confirm', text: 'link\nReference: ahv-newsletter-7-0123456789abcdef', html: '<p>link</p>', idempotencyKey: 'ahv-newsletter-7-0123456789abcdef', ts: Math.floor(Date.now() / 1000) + clockOffset, nonce: crypto.randomBytes(18).toString('base64url'), ...overrides };
    const text = JSON.stringify(payload);
    const signature = crypto.createHmac('sha256', key).update(`${MAIL_PROTOCOL}\n${text}`, 'utf8').digest('hex');
    const reply = context.doPost({ postData: { contents: JSON.stringify({ payload: text, signature }) } });
    if (reply.signature) assert.equal(reply.signature, mailReplySignature(MAIL_SECRET, payload.nonce, payload.idempotencyKey, reply.result, reply.code), 'every authenticated reply is signed and correlated');
    return reply;
  };
  return { post, sentMail, cache, props, state, advance: (s) => { clockOffset += s; } };
}

test('Apps Script sender: signed correlated replies; refuses before sending; durable journal survives cache eviction', () => {
  const ok = loadMailScript({ aliases: ['info@kairali.com'] });
  assert.equal(ok.post().result, 'accepted');
  assert.equal(ok.sentMail.length, 1);
  assert.equal(ok.sentMail[0][0], EMAIL);
  assert.equal(ok.sentMail[0][3].from, 'info@kairali.com');
  assert.equal(ok.sentMail[0][3].replyTo, 'info@kairali.com');
  ok.cache.clear(); // CacheService eviction (the parent probe): the durable journal still prevents a second send
  assert.equal(ok.post().result, 'duplicate');
  assert.equal(ok.sentMail.length, 1);
  assert.equal(ok.post({}, 'wrong'.repeat(8)).message, 'unauthorized');
  assert.equal(ok.post({ idempotencyKey: 'ahv-newsletter-2-00000000000000a2', text: 'Reference: ahv-newsletter-2-00000000000000a2', ts: Math.floor(Date.now() / 1000) - 301 }).code, 'STALE');
  assert.equal(ok.post({ idempotencyKey: 'ahv-newsletter-3-00000000000000a3', text: 'Reference: ahv-newsletter-3-00000000000000a3', from: 'news@example.invalid' }).code, 'SENDER_REFUSED');
  assert.equal(ok.post({ idempotencyKey: 'ahv-newsletter-4-00000000000000a4', text: 'Reference: ahv-newsletter-4-00000000000000a4', subject: 'x\r\nBcc: a@b.c' }).code, 'BAD_REQUEST');
  assert.equal(ok.post({ idempotencyKey: 'ahv-newsletter-5-00000000000000a5', text: 'no reference line' }).code, 'BAD_REQUEST', 'every email must be reconcilable');
  const replay = { idempotencyKey: 'ahv-newsletter-6-00000000000000a6', text: 'Reference: ahv-newsletter-6-00000000000000a6', nonce: 'replayed-nonce-000000' };
  assert.equal(ok.post(replay).result, 'accepted');
  // parent outcome fix (29 Sep): the durable job is checked before nonce rejection, so an accepted job replayed with the
  // same nonce reports `duplicate` (already sent) instead of a rejection that could read as "never sent"; no second send
  assert.equal(ok.post(replay).result, 'duplicate');
  assert.equal(ok.sentMail.length, 2);
  const noAlias = loadMailScript({ aliases: ['other@example.invalid'] });
  const refused = noAlias.post();
  assert.deepEqual([refused.result, refused.code], ['rejected', 'SENDER_UNAVAILABLE']);
  assert.equal(noAlias.sentMail.length, 0);
  assert.equal([...noAlias.props.keys()].filter((k) => k.startsWith('nlj:')).length, 0, 'a refusal leaves no journal entry');
  assert.equal(loadMailScript({ effective: 'info@kairali.com' }).post().result, 'accepted');
  assert.equal(loadMailScript({ secret: '' }).post().message, 'not configured');
});

test('Apps Script sender: journal write lost AFTER a send is reconciled from Sent mail — no duplicate (parent probe)', () => {
  const s = loadMailScript({ aliases: ['info@kairali.com'], failJournalAfterSend: true });
  assert.equal(s.post().result, 'accepted', 'the send itself succeeded, so the truthful answer is accepted');
  assert.equal(s.sentMail.length, 1);
  assert.match(s.props.get('nlj:ahv-newsletter-7-0123456789abcdef'), /"sending"/);
  s.cache.clear();
  assert.equal(s.post().result, 'duplicate', 'found in Sent → accepted, not re-sent');
  assert.equal(s.sentMail.length, 1);
  assert.match(s.props.get('nlj:ahv-newsletter-7-0123456789abcdef'), /"accepted"/);
});

test('Apps Script sender: Gmail error mid-send is UNKNOWN; no resend while reconciling; at-least-once after the window', () => {
  const s = loadMailScript({ aliases: ['info@kairali.com'], sendThrows: true, indexed: false });
  const first = s.post();
  assert.deepEqual([first.result, first.code], ['unknown', 'SEND_ERROR']);
  assert.equal(s.sentMail.length, 1);
  const again = s.post();
  assert.deepEqual([again.result, again.code], ['unknown', 'RECONCILING'], 'not visible in Sent yet: never a blind second send');
  assert.equal(s.sentMail.length, 1);
  s.advance(601);
  assert.equal(s.post().result, 'accepted', 'after the window, still not in Sent: sent again (explicitly at-least-once)');
  assert.equal(s.sentMail.length, 2);
  const found = loadMailScript({ aliases: ['info@kairali.com'], sendThrows: true, indexed: true });
  found.post();
  assert.equal(found.post().result, 'duplicate', 'when Gmail did send it, the Sent search settles it without a second email');
  assert.equal(found.sentMail.length, 1);
});

test('unsubscribe link tokens: authentic only with the link secret, constant-shape, no address inside', scenario(ENV, () => {
  const id = 'a'.repeat(32);
  const token = unsubscribeToken(id);
  assert.equal(verifyUnsubscribeToken(token), id);
  assert.equal(verifyUnsubscribeToken(token, { ...ENV, AHV_NEWSLETTER_LINK_SECRET: 'z'.repeat(40) }), null);
  assert.equal(verifyUnsubscribeToken(`${'b'.repeat(32)}.${token.split('.')[1]}`), null);
  assert.equal(verifyUnsubscribeToken(token + 'x'), null);
  assert.equal(verifyUnsubscribeToken(null), null);
}));
