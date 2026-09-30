import schema from '../bridge/form-relay/lead-schema.json' with { type: 'json' };
import { RelayError, relayCall, type RelayCallOptions } from './form-relay.ts';

/**
 * Durable newsletter storage (double opt-in) through the signed HTTPS relay on
 * the database host — ops newsletter.* (bridge/form-relay/SPEC.md "Newsletter").
 * Its own tables, never the patient lead tables; the website never connects to
 * MySQL and never sends a raw confirmation token (only its SHA-256).
 *
 * Every relay answer is shape-checked here: anything unexpected is a
 * NewsletterStoreError, never a success.
 */

export const NEWSLETTER_SCHEMA = schema.newsletter as {
  consentVersions: Record<string, string>;
  locales: string[];
  confirmationTtlHours: number;
  limits: Record<string, number>;
  outbox: { inlineLeaseSeconds: number; retryDelaySeconds: number; maxSendAttempts: number; claimBatch: number };
  maxEmailLength: number;
  maxSourcePathLength: number;
};

export type SubscribeRecord = {
  email: string;
  consentVersion: string;
  consentLocale: string;
  sourcePath: string;
  submitIp: string;
  tokenHash: string;
  /** The token sealed with the website-only outbox key (lib/newsletter.ts sealToken), so the job is recoverable. */
  tokenSealed: string;
};

/** `send` false = nothing to email (already confirmed, a live recent confirmation, or the daily ceiling). */
export type SubscribeOutcome = { send: false } | { send: true; confirmationId: number };
export type ConfirmOutcome = { confirmed: true; publicId: string } | { confirmed: false };
/** A leased outbox job: a confirmation email still owed (crashed inline send or uncertain outcome). */
export type OutboxJob = { confirmationId: number; tokenHash: string; tokenSealed: string; locale: string; email: string };
export type MailResult = 'sent' | 'failed' | 'unknown';

export interface NewsletterStore {
  subscribe(record: SubscribeRecord): Promise<SubscribeOutcome>;
  markMail(confirmationId: number, tokenHash: string, result: MailResult): Promise<void>;
  claim(limit: number): Promise<OutboxJob[]>;
  confirm(tokenHash: string): Promise<ConfirmOutcome>;
  unsubscribe(publicId: string): Promise<void>;
}

export class NewsletterRateLimitError extends Error {
  constructor() {
    super('newsletter rate limit exceeded');
    this.name = 'NewsletterRateLimitError';
  }
}

export class NewsletterStoreError extends Error {
  code: string;
  constructor(code: string) {
    super(`newsletter store: ${code}`);
    this.name = 'NewsletterStoreError';
    this.code = code;
  }
}

const HASH_RE = /^[0-9a-f]{64}$/;
const PUBLIC_ID_RE = /^[0-9a-f]{32}$/;
const SEALED_RE = /^v1\.[A-Za-z0-9_-]{40,190}$/;

async function call(op: 'newsletter.subscribe' | 'newsletter.mail_result' | 'newsletter.claim' | 'newsletter.confirm' | 'newsletter.unsubscribe', data: Record<string, unknown>, options: RelayCallOptions): Promise<Record<string, unknown>> {
  try {
    return await relayCall(op, data, options);
  } catch (error) {
    if (error instanceof RelayError && error.code === 'RATE_LIMITED') throw new NewsletterRateLimitError();
    throw new NewsletterStoreError(error instanceof RelayError ? error.code : 'RELAY_FAILED');
  }
}

export function relayNewsletterStore(options: RelayCallOptions = {}): NewsletterStore {
  return {
    async subscribe(record) {
      if (!HASH_RE.test(record.tokenHash) || !SEALED_RE.test(record.tokenSealed)) throw new NewsletterStoreError('INVALID_TOKEN');
      const reply = await call('newsletter.subscribe', {
        email: record.email,
        consent_version: record.consentVersion,
        consent_locale: record.consentLocale,
        source_path: record.sourcePath,
        submit_ip: record.submitIp,
        token_hash: record.tokenHash,
        token_sealed: record.tokenSealed,
      }, options);
      if (reply.send === false) return { send: false };
      if (reply.send === true && Number.isSafeInteger(reply.confirmation_id) && (reply.confirmation_id as number) > 0) {
        return { send: true, confirmationId: reply.confirmation_id as number };
      }
      throw new NewsletterStoreError('RELAY_UNVERIFIED');
    },
    async markMail(confirmationId, tokenHash, result) {
      await call('newsletter.mail_result', { confirmation_id: confirmationId, token_hash: tokenHash, result }, options);
    },
    async claim(limit) {
      const reply = await call('newsletter.claim', { limit }, options);
      if (!Array.isArray(reply.jobs)) throw new NewsletterStoreError('RELAY_UNVERIFIED');
      return reply.jobs.map((raw: unknown) => {
        const job = (raw && typeof raw === 'object' ? raw : {}) as Record<string, unknown>;
        if (!Number.isSafeInteger(job.confirmation_id) || (job.confirmation_id as number) < 1
          || typeof job.token_hash !== 'string' || !HASH_RE.test(job.token_hash)
          || typeof job.token_sealed !== 'string' || !SEALED_RE.test(job.token_sealed)
          || typeof job.locale !== 'string' || !NEWSLETTER_SCHEMA.locales.includes(job.locale)
          || typeof job.email !== 'string' || !job.email.includes('@')) throw new NewsletterStoreError('RELAY_UNVERIFIED');
        return { confirmationId: job.confirmation_id as number, tokenHash: job.token_hash, tokenSealed: job.token_sealed, locale: job.locale, email: job.email };
      });
    },
    async confirm(tokenHash) {
      if (!HASH_RE.test(tokenHash)) return { confirmed: false };
      const reply = await call('newsletter.confirm', { token_hash: tokenHash }, options);
      if (reply.outcome === 'invalid') return { confirmed: false };
      if (reply.outcome === 'confirmed' && typeof reply.public_id === 'string' && PUBLIC_ID_RE.test(reply.public_id)) {
        return { confirmed: true, publicId: reply.public_id };
      }
      throw new NewsletterStoreError('RELAY_UNVERIFIED');
    },
    async unsubscribe(publicId) {
      if (!PUBLIC_ID_RE.test(publicId)) throw new NewsletterStoreError('INVALID_PUBLIC_ID');
      const reply = await call('newsletter.unsubscribe', { public_id: publicId }, options);
      if (reply.outcome !== 'unsubscribed') throw new NewsletterStoreError('RELAY_UNVERIFIED');
    },
  };
}
