import { createCipheriv, createDecipheriv, createHash, createHmac, randomBytes, timingSafeEqual } from 'node:crypto';
import { isIP } from 'node:net';
import { relayConfigProblem } from './form-relay.ts';
import { createNewsletterMailer, newsletterMailProblem, type MailOutcome, type NewsletterMailer } from './newsletter-mail.ts';
import { NEWSLETTER_SCHEMA, NewsletterRateLimitError, relayNewsletterStore, type MailResult, type NewsletterStore } from './newsletter-store.ts';
import { confirmationMail, isNewsletterLocale, localeFromPath } from './newsletter-copy.ts';

/**
 * Newsletter double opt-in — the approved lifecycle (forms recommendations;
 * FORM-INTEGRATION-SETUP.md "Newsletter"):
 *
 *   POST /api/newsletter            → pending record + durable, recoverable mail job, then the
 *                                     confirmation email; `pending_confirmation` only once the
 *                                     provider ACCEPTED it
 *   GET  /api/newsletter/outbox     → cron worker: re-sends jobs whose inline send crashed or
 *                                     ended uncertain (same link, same idempotency key)
 *   GET  /api/newsletter/confirm    → confirm page (scanner-safe: consumes nothing)
 *   POST /api/newsletter/confirm    → single-use atomic consume → confirmed + consent evidence
 *   GET  /api/newsletter/unsubscribe → unsubscribe page
 *   POST /api/newsletter/unsubscribe → idempotent immediate suppression (also RFC 8058 one-click)
 *
 * A dedicated audience: nothing here touches the patient lead tables, the
 * lead Sheet, the guide download, analytics or consent UI.
 *
 * ACTIVATION is environment-only. Every one of these must be present and safe,
 * or every newsletter route answers 503 before reading a body:
 *   AHV_FORM_RELAY_URL / _SECRET / _KEY_ID   the signed relay (shared with /api/lead)
 *   AHV_NEWSLETTER_MAIL_PROVIDER (+ that adapter's variables, lib/newsletter-mail.ts)
 *   AHV_NEWSLETTER_PUBLIC_ORIGIN            https origin used in emailed links (never the Host header)
 *   AHV_NEWSLETTER_LINK_SECRET              >= 32 chars; authenticates unsubscribe links
 *   AHV_NEWSLETTER_OUTBOX_KEY               >= 32 chars; seals confirmation tokens stored in the
 *                                           outbox (the relay/database never hold the key)
 * The outbox worker additionally needs CRON_SECRET (>= 32 chars; Vercel Cron's bearer token).
 */

type Env = Record<string, string | undefined>;

export const CONSENT_VERSIONS = NEWSLETTER_SCHEMA.consentVersions;
export const MAX_BODY_BYTES = 2048;
const MIN_LINK_SECRET = 32;
const MIN_OUTBOX_KEY = 32;
const TOKEN_RE = /^[A-Za-z0-9_-]{43}$/;
const PUBLIC_ID_RE = /^[0-9a-f]{32}$/;
// Same pattern as relay-core.php (AHV_NL_EMAIL_RE).
const EMAIL_RE = /^[A-Za-z0-9.!#$%&'*+/=?^_`{|}~-]{1,64}@(?:[A-Za-z0-9](?:[A-Za-z0-9-]{0,61}[A-Za-z0-9])?\.)+[A-Za-z]{2,63}$/;
const PATH_RE = /^\/(?!\/)[A-Za-z0-9/._~%-]*$/;
const UNSUB_CONTEXT = 'AHV-NEWSLETTER-UNSUBSCRIBE-V1\n';

export function publicOrigin(env: Env = process.env): string | null {
  const raw = (env.AHV_NEWSLETTER_PUBLIC_ORIGIN ?? '').trim();
  if (!raw) return null;
  try {
    const url = new URL(raw);
    if (url.protocol !== 'https:' || url.username || url.password || url.search || url.hash || (url.pathname !== '/' && url.pathname !== '')) return null;
    return url.origin;
  } catch {
    return null;
  }
}

function linkSecret(env: Env): string {
  return env.AHV_NEWSLETTER_LINK_SECRET ?? '';
}

function outboxKey(env: Env): Buffer | null {
  const raw = env.AHV_NEWSLETTER_OUTBOX_KEY ?? '';
  return raw.length >= MIN_OUTBOX_KEY ? createHash('sha256').update(`AHV-NEWSLETTER-OUTBOX-V1\n${raw}`, 'utf8').digest() : null;
}

/** null when every activation setting is present and safe; otherwise a short reason (never a value). */
export function newsletterConfigProblem(env: Env = process.env): string | null {
  const relay = relayConfigProblem(env);
  if (relay) return `relay_${relay}`;
  const mail = newsletterMailProblem(env);
  if (mail) return `mail_${mail}`;
  if (!publicOrigin(env)) return 'public_origin';
  if (linkSecret(env).length < MIN_LINK_SECRET) return 'link_secret';
  if (!outboxKey(env)) return 'outbox_key';
  return null;
}

/** The outbox worker's bearer check (Vercel Cron sends `Authorization: Bearer <CRON_SECRET>`). */
export function cronAuthorized(headers: Headers, env: Env = process.env): boolean {
  const secret = env.CRON_SECRET ?? '';
  if (secret.length < 32) return false;
  const received = Buffer.from(headers.get('authorization') || '', 'utf8');
  const expected = Buffer.from(`Bearer ${secret}`, 'utf8');
  return received.length === expected.length && timingSafeEqual(received, expected);
}

export function newsletterConfigured(env: Env = process.env): boolean {
  return newsletterConfigProblem(env) === null;
}

// ── validation ──

export function normalizeEmail(value: unknown): string | null {
  if (typeof value !== 'string') return null;
  const email = value.trim().toLowerCase();
  if (email.length > NEWSLETTER_SCHEMA.maxEmailLength || !EMAIL_RE.test(email)) return null;
  const local = email.slice(0, email.lastIndexOf('@'));
  if (local.startsWith('.') || local.endsWith('.') || local.includes('..')) return null;
  return email;
}

export function safeSourcePath(value: unknown): string | null {
  if (typeof value !== 'string') return null;
  if (value === '' || value.length > NEWSLETTER_SCHEMA.maxSourcePathLength || !PATH_RE.test(value)) return null;
  if (/(^|\/)\.\.?(\/|$)/.test(value)) return null;
  return value;
}

export type SubscriptionRequest = { email: string; consentVersion: string; sourcePath: string; locale: string };

const ALLOWED_KEYS = new Set(['email', 'consent', 'consentVersion', 'sourcePath']);

/** Strict server-side check of the signup body. Returns a short code on refusal. */
export function validateSubscription(body: unknown): { ok: true; value: SubscriptionRequest } | { ok: false; code: string } {
  if (!body || typeof body !== 'object' || Array.isArray(body)) return { ok: false, code: 'INVALID_REQUEST' };
  const record = body as Record<string, unknown>;
  for (const key of Object.keys(record)) if (!ALLOWED_KEYS.has(key)) return { ok: false, code: 'INVALID_REQUEST' };
  if ('consent' in record && record.consent !== true) return { ok: false, code: 'CONSENT_REQUIRED' };
  const email = normalizeEmail(record.email);
  if (!email) return { ok: false, code: 'INVALID_EMAIL' };
  const consentVersion = typeof record.consentVersion === 'string' ? record.consentVersion : '';
  if (!Object.prototype.hasOwnProperty.call(CONSENT_VERSIONS, consentVersion)) return { ok: false, code: 'UNKNOWN_CONSENT_VERSION' };
  const sourcePath = safeSourcePath(record.sourcePath);
  if (!sourcePath) return { ok: false, code: 'INVALID_SOURCE' };
  return { ok: true, value: { email, consentVersion, sourcePath, locale: localeFromPath(sourcePath) } };
}

export function clientIp(headers: Headers): string {
  const candidate = (headers.get('x-forwarded-for') || '').split(',')[0].trim();
  return isIP(candidate) ? candidate : '';
}

// ── tokens ──

export function hashToken(token: string): string {
  return createHash('sha256').update(token, 'utf8').digest('hex');
}

export function newConfirmationToken(): { token: string; tokenHash: string } {
  const token = randomBytes(32).toString('base64url');
  return { token, tokenHash: hashToken(token) };
}

/**
 * AES-256-GCM seal of a confirmation token for the durable outbox, bound to its hash (AAD) so a sealed
 * value cannot be moved to another job. The key exists only in the website's environment.
 */
export function sealToken(token: string, tokenHash: string, env: Env = process.env): string {
  const key = outboxKey(env);
  if (!key) throw new Error('outbox key not configured');
  const iv = randomBytes(12);
  const cipher = createCipheriv('aes-256-gcm', key, iv);
  cipher.setAAD(Buffer.from(tokenHash, 'utf8'));
  const body = Buffer.concat([cipher.update(token, 'utf8'), cipher.final()]);
  return `v1.${Buffer.concat([iv, body, cipher.getAuthTag()]).toString('base64url')}`;
}

/** The token when the seal is authentic for this hash and key; null otherwise. */
export function unsealToken(sealed: string, tokenHash: string, env: Env = process.env): string | null {
  const key = outboxKey(env);
  if (!key || !/^v1\.[A-Za-z0-9_-]{40,190}$/.test(sealed)) return null;
  try {
    const raw = Buffer.from(sealed.slice(3), 'base64url');
    const decipher = createDecipheriv('aes-256-gcm', key, raw.subarray(0, 12));
    decipher.setAAD(Buffer.from(tokenHash, 'utf8'));
    decipher.setAuthTag(raw.subarray(raw.length - 16));
    const token = Buffer.concat([decipher.update(raw.subarray(12, raw.length - 16)), decipher.final()]).toString('utf8');
    return isTokenShape(token) && hashToken(token) === tokenHash ? token : null;
  } catch {
    return null;
  }
}

export function isTokenShape(value: unknown): value is string {
  return typeof value === 'string' && TOKEN_RE.test(value);
}

export function unsubscribeToken(publicId: string, env: Env = process.env): string {
  if (!PUBLIC_ID_RE.test(publicId)) throw new Error('invalid public id');
  const mac = createHmac('sha256', linkSecret(env)).update(UNSUB_CONTEXT + publicId, 'utf8').digest('base64url');
  return `${publicId}.${mac}`;
}

/** The subscriber's public id when the link token is authentic; null otherwise (constant-time compare). */
export function verifyUnsubscribeToken(value: unknown, env: Env = process.env): string | null {
  if (typeof value !== 'string' || value.length > 128) return null;
  const match = /^([0-9a-f]{32})\.([A-Za-z0-9_-]{43})$/.exec(value);
  if (!match || linkSecret(env).length < MIN_LINK_SECRET) return null;
  const expected = Buffer.from(unsubscribeToken(match[1], env).split('.')[1], 'utf8');
  const received = Buffer.from(match[2], 'utf8');
  return expected.length === received.length && timingSafeEqual(expected, received) ? match[1] : null;
}

function withLocale(url: URL, locale: string): URL {
  if (locale !== 'en' && isNewsletterLocale(locale)) url.searchParams.set('l', locale);
  return url;
}

export function confirmUrl(origin: string, token: string, locale: string): string {
  const url = new URL('/api/newsletter/confirm', origin);
  url.searchParams.set('t', token);
  return withLocale(url, locale).toString();
}

export function unsubscribeUrl(origin: string, publicId: string, locale: string, env: Env = process.env): string {
  const url = new URL('/api/newsletter/unsubscribe', origin);
  url.searchParams.set('u', unsubscribeToken(publicId, env));
  return withLocale(url, locale).toString();
}

// ── lifecycle ──

export type NewsletterDeps = { store: NewsletterStore; mailer: NewsletterMailer; env: Env };

export function defaultNewsletterDeps(env: Env = process.env): NewsletterDeps {
  return { store: relayNewsletterStore({ env }), mailer: createNewsletterMailer(env), env };
}

export type SubscribeResult = 'pending_confirmation' | 'rate_limited' | 'store_failed' | 'mail_failed' | 'mail_uncertain';

export function mailIdempotencyKey(confirmationId: number, tokenHash: string): string {
  return `ahv-newsletter-${confirmationId}-${tokenHash.slice(0, 16)}`;
}

/** Bookkeeping write with a bounded retry; a lost write leaves the job leased-then-recoverable, never "sent". */
async function recordMail(store: NewsletterStore, confirmationId: number, tokenHash: string, result: MailResult): Promise<boolean> {
  for (let attempt = 0; attempt < 3; attempt++) {
    try {
      await store.markMail(confirmationId, tokenHash, result);
      return true;
    } catch { /* retry */ }
  }
  return false;
}

const MAIL_RESULT: Record<MailOutcome, MailResult> = { accepted: 'sent', rejected: 'failed', uncertain: 'unknown' };

/**
 * Persist first, then email, then answer — truthfully:
 *  - The pending record and the durable, RECOVERABLE mail job (token sealed with the website-only
 *    outbox key) are committed before any email leaves.
 *  - `pending_confirmation` only when the provider accepted this job's email, or in the neutral case
 *    where nothing needs sending (already confirmed, or an accepted email is recent) — that answer
 *    does not reveal whether the address is known.
 *  - A signed provider refusal revokes the job ("not subscribed, try again").
 *  - An uncertain outcome (timeout, unverifiable reply) is reported as uncertain: the token stays valid
 *    because the email may have been delivered, and the outbox worker retries the SAME job later.
 *  - A crash anywhere after the commit leaves the job leased; when the lease lapses the worker sends it.
 */
export async function requestSubscription(request: SubscriptionRequest, submitIp: string, deps: NewsletterDeps): Promise<SubscribeResult> {
  const origin = publicOrigin(deps.env);
  if (!origin) return 'store_failed';
  const { token, tokenHash } = newConfirmationToken();
  let outcome;
  try {
    outcome = await deps.store.subscribe({
      email: request.email,
      consentVersion: request.consentVersion,
      consentLocale: request.locale,
      sourcePath: request.sourcePath,
      submitIp,
      tokenHash,
      tokenSealed: sealToken(token, tokenHash, deps.env),
    });
  } catch (error) {
    return error instanceof NewsletterRateLimitError ? 'rate_limited' : 'store_failed';
  }
  if (!outcome.send) return 'pending_confirmation';
  const key = mailIdempotencyKey(outcome.confirmationId, tokenHash);
  const mail = confirmationMail(request.locale, confirmUrl(origin, token, request.locale), key);
  const sent = await deps.mailer.send({ to: request.email, ...mail, idempotencyKey: key });
  await recordMail(deps.store, outcome.confirmationId, tokenHash, MAIL_RESULT[sent]);
  if (sent === 'accepted') return 'pending_confirmation';
  return sent === 'rejected' ? 'mail_failed' : 'mail_uncertain';
}

export type OutboxReport = { claimed: number; accepted: number; rejected: number; uncertain: number; unsealable: number };

/**
 * The outbox worker (cron): claims jobs whose inline send crashed or ended uncertain and re-sends the
 * SAME link under the SAME idempotency key. Counts only — never an address or token — are reported.
 */
export async function processOutbox(deps: NewsletterDeps): Promise<OutboxReport> {
  const report: OutboxReport = { claimed: 0, accepted: 0, rejected: 0, uncertain: 0, unsealable: 0 };
  const origin = publicOrigin(deps.env);
  if (!origin) return report;
  const jobs = await deps.store.claim(NEWSLETTER_SCHEMA.outbox.claimBatch);
  report.claimed = jobs.length;
  for (const job of jobs) {
    const token = unsealToken(job.tokenSealed, job.tokenHash, deps.env);
    const email = normalizeEmail(job.email);
    if (!token || !email) {
      // Key rotated or data damaged: this job cannot be re-sent. Recorded as uncertain (the inline send may
      // have delivered it); the relay drops the seal once the attempt budget is spent.
      report.unsealable++;
      await recordMail(deps.store, job.confirmationId, job.tokenHash, 'unknown');
      continue;
    }
    const key = mailIdempotencyKey(job.confirmationId, job.tokenHash);
    const mail = confirmationMail(job.locale, confirmUrl(origin, token, job.locale), key);
    const sent = await deps.mailer.send({ to: email, ...mail, idempotencyKey: key });
    report[sent]++;
    await recordMail(deps.store, job.confirmationId, job.tokenHash, MAIL_RESULT[sent]);
  }
  return report;
}

export type ConfirmResult = { kind: 'confirmed'; unsubscribeUrl: string } | { kind: 'invalid' } | { kind: 'failed' };

export async function confirmSubscription(token: unknown, locale: string, deps: NewsletterDeps): Promise<ConfirmResult> {
  if (!isTokenShape(token)) return { kind: 'invalid' };
  const origin = publicOrigin(deps.env);
  if (!origin) return { kind: 'failed' };
  try {
    const outcome = await deps.store.confirm(hashToken(token));
    if (!outcome.confirmed) return { kind: 'invalid' };
    return { kind: 'confirmed', unsubscribeUrl: unsubscribeUrl(origin, outcome.publicId, locale, deps.env) };
  } catch {
    return { kind: 'failed' };
  }
}

export type UnsubscribeResult = 'unsubscribed' | 'invalid' | 'failed';

export async function unsubscribeSubscriber(token: unknown, deps: NewsletterDeps): Promise<UnsubscribeResult> {
  const publicId = verifyUnsubscribeToken(token, deps.env);
  if (!publicId) return 'invalid';
  try {
    await deps.store.unsubscribe(publicId);
    return 'unsubscribed';
  } catch {
    return 'failed';
  }
}

// ── request helpers ──

/** Reads at most `limit` bytes of the body; null when it is larger (the rest is never buffered). */
export async function readBoundedText(request: Request, limit = MAX_BODY_BYTES): Promise<string | null> {
  const declared = Number(request.headers.get('content-length') || '0');
  if (Number.isFinite(declared) && declared > limit) return null;
  if (!request.body) return '';
  const reader = request.body.getReader();
  const chunks: Uint8Array[] = [];
  let size = 0;
  for (;;) {
    const { done, value } = await reader.read();
    if (done) break;
    size += value.byteLength;
    if (size > limit) {
      await reader.cancel().catch(() => {});
      return null;
    }
    chunks.push(value);
  }
  return new TextDecoder('utf-8', { fatal: false }).decode(Buffer.concat(chunks.map((c) => Buffer.from(c))));
}

export const NO_STORE_HEADERS = { 'Cache-Control': 'no-store', 'X-Robots-Tag': 'noindex' } as const;

export function htmlResponse(html: string, status: number): Response {
  return new Response(html, {
    status,
    headers: {
      ...NO_STORE_HEADERS,
      'Content-Type': 'text/html; charset=utf-8',
      // Links carry an opaque token: never leak it onward.
      'Referrer-Policy': 'no-referrer',
      'Content-Security-Policy': "default-src 'none'; style-src 'unsafe-inline'; form-action 'self'; base-uri 'none'; frame-ancestors 'none'",
      'X-Content-Type-Options': 'nosniff',
    },
  });
}

export function wantsJson(request: Request): boolean {
  const accept = request.headers.get('accept') || '';
  return accept.includes('application/json') && !accept.includes('text/html');
}
