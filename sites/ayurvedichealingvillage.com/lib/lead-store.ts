import schema from '../bridge/form-relay/lead-schema.json' with { type: 'json' };
import { RelayError, relayCall, type RelayCallOptions } from './form-relay.ts';

/**
 * Store-first lead persistence for the AHV forms, via the signed HTTPS relay
 * on the database host (bridge/form-relay). Table and column allowlists come
 * from the same lead-schema.json the relay enforces, so the website cannot
 * drift from what the relay will accept, and neither side ever takes a SQL
 * identifier from a visitor.
 */

export type LeadTable =
  | 'contact'
  | 'enquiry-form'
  | 'apply-now'
  | 'opd'
  | 'online-consultation'
  | 'landing-page'
  | 'exit-intent';

export const LEAD_TABLES = Object.keys(schema.tables) as LeadTable[];

/** Request-writable columns per table (identifiers fixed by lead-schema.json). */
export const TABLE_COLUMNS = schema.tables as Record<LeadTable, readonly string[]>;
const BOOLEAN_COLUMNS = new Set<string>(schema.booleanColumns);

export type LeadInput = {
  site: string;
  formType: string;
  values: Record<string, string | number | boolean | null | undefined>;
  submitIp: string;
  tracking: {
    source: string; campaign: string; medium: string; gclid: string; fbclid: string;
    utmSource: string; utmMedium: string; utmCampaign: string; utmTerm: string; utmContent: string;
    leadSourceUrl: string; referrer: string;
  };
};

export type StoredLead = {
  alreadyStored: boolean;
  row: Record<string, unknown>;
};

export class LeadRateLimitError extends Error {
  constructor() {
    super('lead rate limit exceeded');
    this.name = 'LeadRateLimitError';
  }
}

function isTruthyConsent(value: unknown): boolean {
  return value === true || value === 1 || value === '1';
}

/** Build the exact relay payload: allowlisted columns only, booleans as booleans. */
export function relayLeadPayload(table: LeadTable, input: LeadInput, submissionToken: string): Record<string, unknown> {
  const values: Record<string, string | number | boolean | null> = {};
  for (const column of TABLE_COLUMNS[table]) {
    const value = input.values[column];
    if (BOOLEAN_COLUMNS.has(column)) {
      if (column === 'consent' || value !== undefined) values[column] = isTruthyConsent(value);
      continue;
    }
    if (value === undefined) continue;
    values[column] = typeof value === 'boolean' ? (value ? '1' : '0') : value;
  }
  const t = input.tracking;
  return {
    table,
    submission_token: submissionToken,
    site: input.site,
    form_type: input.formType,
    submit_ip: input.submitIp,
    values,
    tracking: {
      source: t.source, campaign: t.campaign, medium: t.medium, gclid: t.gclid, fbclid: t.fbclid,
      utm_source: t.utmSource, utm_medium: t.utmMedium, utm_campaign: t.utmCampaign,
      utm_term: t.utmTerm, utm_content: t.utmContent,
      lead_source_url: t.leadSourceUrl, referrer: t.referrer,
    },
  };
}

export async function saveLead(table: LeadTable, input: LeadInput, submissionToken: string, options?: RelayCallOptions): Promise<StoredLead> {
  if (!LEAD_TABLES.includes(table)) throw new Error('unknown lead table');
  try {
    const reply = await relayCall('lead.store', relayLeadPayload(table, input, submissionToken), options);
    const row = reply.row && typeof reply.row === 'object' ? reply.row as Record<string, unknown> : null;
    if (!row || String(row.submission_token ?? '').toLowerCase() !== submissionToken) {
      throw new RelayError('RELAY_UNVERIFIED', 502);
    }
    return { alreadyStored: reply.alreadyStored === true, row };
  } catch (error) {
    if (error instanceof RelayError && error.code === 'RATE_LIMITED') throw new LeadRateLimitError();
    throw error;
  }
}
