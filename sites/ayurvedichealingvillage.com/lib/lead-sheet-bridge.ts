import type { LeadTable } from './lead-store.ts';

const TIMEOUT_MS = 15_000;

// Fixed categories only: never serialize provider errors, payloads, URLs or tokens.
const FAILURE_REASONS = [
  'CONFIG', 'TIMEOUT', 'TRANSPORT', 'HTTP_4XX', 'HTTP_5XX', 'HTTP_OTHER',
  'BODY_READ', 'INVALID_JSON', 'INVALID_REPLY', 'RECEIVER_REJECTED',
] as const;
type FailureReason = typeof FAILURE_REASONS[number];
class SheetDeliveryError extends Error {
  readonly reason: FailureReason;
  constructor(reason: FailureReason) {
    super('Sheet delivery unconfirmed');
    this.reason = reason;
  }
}

export function leadFailureDiagnostic(stage: 'store' | 'sheet', error: unknown) {
  const reason = stage === 'store' ? 'STORE_UNCONFIRMED'
    : error instanceof SheetDeliveryError && FAILURE_REASONS.includes(error.reason)
      ? error.reason : 'UNKNOWN';
  return { event: 'ahv_lead_failure', stage, reason };
}

type WebhookReply = {
  result?: string;
  message?: string;
  fileUrl?: string;
  fileId?: string;
};

function setting(name: 'AHV_LEAD_SHEET_WEBHOOK_URL' | 'AHV_LEAD_SHEET_WEBHOOK_SECRET'): string {
  return (process.env[name] || '').trim();
}

export function leadSheetConfigured(): boolean {
  const url = setting('AHV_LEAD_SHEET_WEBHOOK_URL');
  const secret = setting('AHV_LEAD_SHEET_WEBHOOK_SECRET');
  if (!url || !secret) return false;
  try {
    const parsed = new URL(url);
    return parsed.protocol === 'https:' && parsed.hostname === 'script.google.com' && parsed.pathname.endsWith('/exec');
  } catch {
    return false;
  }
}

async function postToWebhook(payload: Record<string, unknown>): Promise<WebhookReply> {
  if (!leadSheetConfigured()) throw new SheetDeliveryError('CONFIG');

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), TIMEOUT_MS);
  try {
    const response = await fetch(setting('AHV_LEAD_SHEET_WEBHOOK_URL'), {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ ...payload, secret: setting('AHV_LEAD_SHEET_WEBHOOK_SECRET') }),
      cache: 'no-store',
      redirect: 'follow',
      signal: controller.signal,
    });
    if (!response.ok) {
      throw new SheetDeliveryError(response.status >= 500 ? 'HTTP_5XX' : response.status >= 400 ? 'HTTP_4XX' : 'HTTP_OTHER');
    }
    let body: string;
    try { body = await response.text(); } catch {
      throw new SheetDeliveryError(controller.signal.aborted ? 'TIMEOUT' : 'BODY_READ');
    }
    let parsed: unknown;
    try { parsed = JSON.parse(body); } catch { throw new SheetDeliveryError('INVALID_JSON'); }
    if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) throw new SheetDeliveryError('INVALID_REPLY');
    const reply = parsed as WebhookReply;
    if (reply.result !== 'success') throw new SheetDeliveryError('RECEIVER_REJECTED');
    return reply;
  } catch (error) {
    if (error instanceof SheetDeliveryError) throw error;
    throw new SheetDeliveryError(controller.signal.aborted ? 'TIMEOUT' : 'TRANSPORT');
  } finally {
    clearTimeout(timeout);
  }
}

export async function deliverLeadToSheet(
  form: LeadTable,
  row: Record<string, unknown>,
  submissionToken: string,
): Promise<void> {
  await postToWebhook({
    action: 'lead',
    verification: 'AHV_LEAD',
    form,
    row,
    submissionToken,
  });
}

export type DriveUploadInput = {
  submissionToken: string;
  purpose: 'photo' | 'resume' | 'application';
  originalName: string;
  mimeType: string;
  base64: string;
  sha256: string;
};

export async function uploadApplicationFileToDrive(input: DriveUploadInput): Promise<{ fileUrl: string; fileId: string }> {
  const reply = await postToWebhook({ action: 'upload', ...input });
  if (!reply.fileUrl || !reply.fileId) throw new Error('Drive upload acknowledgement is incomplete');
  return { fileUrl: reply.fileUrl, fileId: reply.fileId };
}
