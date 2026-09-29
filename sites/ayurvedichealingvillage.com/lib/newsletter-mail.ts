import { createHmac, randomBytes, timingSafeEqual } from 'node:crypto';

/**
 * Transactional mail for the newsletter double opt-in (confirmation emails only).
 *
 * Provider-agnostic: the lifecycle talks to the NewsletterMailer interface; a
 * concrete adapter is chosen ONLY by environment (AHV_NEWSLETTER_MAIL_PROVIDER).
 * No provider is the default, no credential lives in the repository, and with
 * the provider unset, unknown or incompletely configured the newsletter routes
 * answer a truthful 503 before reading any body.
 *
 * Every send has exactly one of three outcomes, and the lifecycle never turns
 * a transport event into a certainty it does not have:
 *   accepted  — the provider acknowledged THIS job (signed, correlated to the
 *               request nonce and the job's idempotency key);
 *   rejected  — the provider signed a definitive refusal made BEFORE sending;
 *   uncertain — anything else: timeout, network error, HTTP error, unsigned or
 *               mismatched reply. The message may or may not have gone out.
 * Delivery is at-least-once under retries (the same job may be re-sent after
 * an uncertain outcome); providers de-duplicate on the idempotency key where
 * they can. Exactly-once is not claimed.
 *
 * Sender: the locked public contact address (CLAUDE.md LOCKED FACTS). An
 * adapter must send from exactly this address or refuse.
 *
 * Adapters:
 *   apps-script — a dedicated Google Apps Script web app
 *                 (scripts/apps-script/newsletter-mail.gs) with a durable send
 *                 journal. Requests and replies are HMAC-signed (the secret
 *                 never travels); the /exec → script.googleusercontent.com
 *                 redirect is followed manually and only to those two hosts.
 *     AHV_NEWSLETTER_MAIL_PROVIDER=apps-script
 *     AHV_NEWSLETTER_MAIL_WEBHOOK_URL=https://script.google.com/macros/s/<deployment>/exec
 *     AHV_NEWSLETTER_MAIL_WEBHOOK_SECRET=<>= 32 chars; same as Script Property AHV_NEWSLETTER_MAIL_SECRET>
 */

export const NEWSLETTER_SENDER = 'info@kairali.com';
export const MAIL_PROTOCOL = 'AHV-NEWSLETTER-MAIL-V1';
const TIMEOUT_MS = 15_000;
const MIN_SECRET = 32;
const MAX_REDIRECTS = 2;
const REDIRECT_HOSTS = new Set(['script.google.com', 'script.googleusercontent.com']);

type Env = Record<string, string | undefined>;
type FetchLike = (input: string, init: RequestInit) => Promise<Response>;

export type ConfirmationMail = {
  to: string;
  subject: string;
  text: string;
  html: string;
  /** Stable per mail job across every retry, so a provider can recognise a repeat. */
  idempotencyKey: string;
};

export type MailOutcome = 'accepted' | 'rejected' | 'uncertain';

export interface NewsletterMailer {
  /** Never throws: resolves with the outcome the provider actually proved. */
  send(mail: ConfirmationMail): Promise<MailOutcome>;
}

export class NewsletterMailError extends Error {
  code: string;
  constructor(code: string) {
    super(`newsletter mail: ${code}`);
    this.name = 'NewsletterMailError';
    this.code = code;
  }
}

type Adapter = {
  problem(env: Env): string | null;
  create(env: Env, fetchImpl: FetchLike): NewsletterMailer;
};

const setting = (env: Env, name: string) => (env[name] ?? '').trim();

export function mailSignature(secret: string, payload: string): string {
  return createHmac('sha256', secret).update(`${MAIL_PROTOCOL}\n${payload}`, 'utf8').digest('hex');
}

/** Signature the sender puts on its reply: binds the outcome to this request's nonce and job key. */
export function mailReplySignature(secret: string, nonce: string, idempotencyKey: string, result: string, code: string): string {
  return createHmac('sha256', secret).update(`${MAIL_PROTOCOL}-RESPONSE\n${nonce}\n${idempotencyKey}\n${result}\n${code}`, 'utf8').digest('hex');
}

function safeEqualHex(expected: string, received: unknown): boolean {
  if (typeof received !== 'string' || !/^[0-9a-f]{64}$/.test(received)) return false;
  return timingSafeEqual(Buffer.from(expected, 'hex'), Buffer.from(received, 'hex'));
}

function allowedRedirect(location: string | null, base: string): string | null {
  if (!location) return null;
  try {
    const next = new URL(location, base);
    return next.protocol === 'https:' && REDIRECT_HOSTS.has(next.hostname) && !next.username && !next.password ? next.toString() : null;
  } catch {
    return null;
  }
}

const appsScript: Adapter = {
  problem(env) {
    const url = setting(env, 'AHV_NEWSLETTER_MAIL_WEBHOOK_URL');
    const secret = setting(env, 'AHV_NEWSLETTER_MAIL_WEBHOOK_SECRET');
    if (!url || !secret) return 'missing';
    if (secret.length < MIN_SECRET) return 'weak_secret';
    try {
      const parsed = new URL(url);
      if (parsed.protocol !== 'https:' || parsed.hostname !== 'script.google.com' || !parsed.pathname.endsWith('/exec') || parsed.username || parsed.password) return 'invalid_url';
    } catch {
      return 'invalid_url';
    }
    return null;
  },
  create(env, fetchImpl) {
    const url = setting(env, 'AHV_NEWSLETTER_MAIL_WEBHOOK_URL');
    const secret = setting(env, 'AHV_NEWSLETTER_MAIL_WEBHOOK_SECRET');
    return {
      async send(mail) {
        const nonce = randomBytes(18).toString('base64url');
        const payload = JSON.stringify({
          v: 1,
          action: 'newsletter.confirmation',
          from: NEWSLETTER_SENDER,
          to: mail.to,
          subject: mail.subject,
          text: mail.text,
          html: mail.html,
          idempotencyKey: mail.idempotencyKey,
          ts: Math.floor(Date.now() / 1000),
          nonce,
        });
        const controller = new AbortController();
        const timeout = setTimeout(() => controller.abort(), TIMEOUT_MS);
        let reply: Record<string, unknown>;
        try {
          let response = await fetchImpl(url, {
            method: 'POST',
            headers: { 'content-type': 'application/json' },
            body: JSON.stringify({ payload, signature: mailSignature(secret, payload) }),
            cache: 'no-store',
            redirect: 'manual',
            signal: controller.signal,
          });
          // Apps Script answers POST /exec with a redirect to its googleusercontent echo URL. Follow it by
          // hand, and only to the two Apps Script hosts; anything else is not this provider.
          for (let hop = 0; response.status >= 300 && response.status < 400; hop++) {
            const next = hop < MAX_REDIRECTS ? allowedRedirect(response.headers.get('location'), url) : null;
            if (!next) return 'uncertain';
            response = await fetchImpl(next, { method: 'GET', cache: 'no-store', redirect: 'manual', signal: controller.signal });
          }
          if (!response.ok) return 'uncertain';
          reply = await response.json() as Record<string, unknown>;
        } catch {
          // Timeout / network / unreadable body: the provider may already have sent the message.
          return 'uncertain';
        } finally {
          clearTimeout(timeout);
        }
        if (!reply || typeof reply !== 'object') return 'uncertain';
        const result = typeof reply.result === 'string' ? reply.result : '';
        const code = typeof reply.code === 'string' ? reply.code : '';
        if (reply.nonce !== nonce || reply.idempotencyKey !== mail.idempotencyKey) return 'uncertain';
        if (!safeEqualHex(mailReplySignature(secret, nonce, mail.idempotencyKey, result, code), reply.signature)) return 'uncertain';
        if (result === 'accepted' || result === 'duplicate') return 'accepted';
        if (result === 'rejected') return 'rejected';
        return 'uncertain';
      },
    };
  },
};

const ADAPTERS: Record<string, Adapter> = { 'apps-script': appsScript };

function adapterFor(env: Env): Adapter | null {
  const name = setting(env, 'AHV_NEWSLETTER_MAIL_PROVIDER');
  return Object.prototype.hasOwnProperty.call(ADAPTERS, name) ? ADAPTERS[name] : null;
}

export function newsletterMailProblem(env: Env = process.env): string | null {
  if (!setting(env, 'AHV_NEWSLETTER_MAIL_PROVIDER')) return 'missing';
  const adapter = adapterFor(env);
  if (!adapter) return 'unknown_provider';
  return adapter.problem(env);
}

export function createNewsletterMailer(env: Env = process.env, fetchImpl?: FetchLike): NewsletterMailer {
  const adapter = adapterFor(env);
  if (!adapter || adapter.problem(env)) throw new NewsletterMailError('MAIL_NOT_CONFIGURED');
  return adapter.create(env, fetchImpl ?? ((input, init) => fetch(input, init)));
}
