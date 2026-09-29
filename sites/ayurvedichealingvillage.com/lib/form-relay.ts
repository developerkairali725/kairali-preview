import { createHash, createHmac, randomBytes, timingSafeEqual } from 'node:crypto';

/**
 * Client for the AHV form relay (protocol AHV-RELAY-V1, bridge/form-relay/SPEC.md).
 *
 * The website never connects to MySQL. The database endpoint has no TLS, so
 * each accepted form is sent to a small relay on the database host over HTTPS,
 * signed with a shared HMAC key; the relay writes over loopback and signs its
 * answer back. Configuration is environment-only:
 *
 *   AHV_FORM_RELAY_URL     https:// URL of the relay (anything else = not configured)
 *   AHV_FORM_RELAY_SECRET  shared HMAC key, >= 32 characters
 *   AHV_FORM_RELAY_KEY_ID  key id the relay knows the secret by (default "k1")
 *
 * There is deliberately no http:// mode, no TLS-verification opt-out, no
 * redirect following and no direct-database fallback. With any value missing
 * or unsafe, relayConfigured() is false and every form route answers a
 * truthful 503 before reading the visitor's body.
 */

export const RELAY_PROTOCOL = 'AHV-RELAY-V1';
const MIN_SECRET = 32;
const KEY_ID_RE = /^[A-Za-z0-9_-]{1,32}$/;
const TIMEOUT_MS = 15_000;

type Env = Record<string, string | undefined>;

export type RelaySettings = { url: URL; secret: string; keyId: string };

export function relayConfigProblem(env: Env = process.env): string | null {
  const rawUrl = (env.AHV_FORM_RELAY_URL ?? '').trim();
  const secret = env.AHV_FORM_RELAY_SECRET ?? '';
  const keyId = (env.AHV_FORM_RELAY_KEY_ID ?? 'k1').trim() || 'k1';
  if (!rawUrl || !secret) return 'missing';
  let url: URL;
  try { url = new URL(rawUrl); } catch { return 'invalid_url'; }
  if (url.protocol !== 'https:') return 'insecure_transport';
  if (url.username || url.password || url.search || url.hash) return 'invalid_url';
  if (secret.length < MIN_SECRET) return 'weak_secret';
  if (!KEY_ID_RE.test(keyId)) return 'invalid_key_id';
  return null;
}

export function relayConfigured(env: Env = process.env): boolean {
  return relayConfigProblem(env) === null;
}

function settings(env: Env = process.env): RelaySettings {
  const problem = relayConfigProblem(env);
  if (problem) throw new RelayError('RELAY_NOT_CONFIGURED', 503);
  return {
    url: new URL((env.AHV_FORM_RELAY_URL ?? '').trim()),
    secret: env.AHV_FORM_RELAY_SECRET ?? '',
    keyId: (env.AHV_FORM_RELAY_KEY_ID ?? 'k1').trim() || 'k1',
  };
}

const sha256Hex = (value: string) => createHash('sha256').update(value, 'utf8').digest('hex');
const hmacHex = (secret: string, value: string) => createHmac('sha256', secret).update(value, 'utf8').digest('hex');

export function canonicalRequest(keyId: string, timestamp: string, nonce: string, method: string, path: string, body: string): string {
  return [RELAY_PROTOCOL, keyId, timestamp, nonce, method.toUpperCase(), path, sha256Hex(body)].join('\n');
}

export function canonicalResponse(keyId: string, nonce: string, status: number, body: string): string {
  return [`${RELAY_PROTOCOL}-RESPONSE`, keyId, nonce, String(status), sha256Hex(body)].join('\n');
}

export function signRelay(secret: string, canonical: string): string {
  return hmacHex(secret, canonical);
}

function safeEqualHex(expected: string, received: string): boolean {
  if (!/^[0-9a-f]{64}$/.test(received)) return false;
  return timingSafeEqual(Buffer.from(expected, 'hex'), Buffer.from(received, 'hex'));
}

export class RelayError extends Error {
  code: string;
  status: number;
  field?: string;
  constructor(code: string, status = 502, field?: string) {
    super(`form relay: ${code}`);
    this.name = 'RelayError';
    this.code = code;
    this.status = status;
    this.field = field;
  }
}

type FetchLike = (input: string, init: RequestInit) => Promise<Response>;

export type RelayCallOptions = {
  env?: Env;
  fetchImpl?: FetchLike;
  now?: () => number;
  nonce?: () => string;
  timeoutMs?: number;
};

/**
 * One signed round trip. Resolves only with a response whose signature
 * verifies AND whose body says ok:true; everything else throws RelayError
 * carrying a short code (never relay/driver text).
 */
export type RelayOp = 'lead.store' | 'health' | 'newsletter.subscribe' | 'newsletter.mail_result' | 'newsletter.claim' | 'newsletter.confirm' | 'newsletter.unsubscribe';

export async function relayCall(op: RelayOp, data: Record<string, unknown> | undefined, options: RelayCallOptions = {}): Promise<Record<string, unknown>> {
  const { url, secret, keyId } = settings(options.env);
  const body = JSON.stringify(data === undefined ? { v: 1, op } : { v: 1, op, data });
  const timestamp = String(Math.floor((options.now ? options.now() : Date.now()) / 1000));
  const nonce = options.nonce ? options.nonce() : randomBytes(24).toString('base64url');
  const signature = signRelay(secret, canonicalRequest(keyId, timestamp, nonce, 'POST', url.pathname, body));

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), options.timeoutMs ?? TIMEOUT_MS);
  let response: Response;
  let text: string;
  try {
    response = await (options.fetchImpl ?? (fetch as FetchLike))(url.toString(), {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        'x-ahv-key-id': keyId,
        'x-ahv-timestamp': timestamp,
        'x-ahv-nonce': nonce,
        'x-ahv-signature': signature,
      },
      body,
      cache: 'no-store',
      // A redirect could only downgrade or re-target the request: refuse it.
      redirect: 'error',
      signal: controller.signal,
    });
    text = await response.text();
  } catch {
    throw new RelayError('RELAY_UNREACHABLE', 502);
  } finally {
    clearTimeout(timeout);
  }

  const received = (response.headers.get('x-ahv-relay-signature') || '').trim().toLowerCase();
  const expected = signRelay(secret, canonicalResponse(keyId, nonce, response.status, text));
  if (!safeEqualHex(expected, received)) throw new RelayError('RELAY_UNVERIFIED', 502);

  let parsed: unknown;
  try { parsed = JSON.parse(text); } catch { throw new RelayError('RELAY_UNVERIFIED', 502); }
  const reply = (parsed && typeof parsed === 'object' ? parsed : {}) as Record<string, unknown>;
  if (!response.ok || reply.ok !== true) {
    const code = typeof reply.code === 'string' && /^[A-Z_]{3,40}$/.test(reply.code) ? reply.code : 'RELAY_REJECTED';
    const field = typeof reply.field === 'string' ? reply.field.slice(0, 64) : undefined;
    throw new RelayError(code, response.status, field);
  }
  return reply;
}
