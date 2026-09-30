import type { LeadTable } from './lead-store.ts';

const TIMEOUT_MS = 15_000;

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
  if (!leadSheetConfigured()) throw new Error('lead Sheet webhook is not configured');

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
    if (!response.ok) throw new Error('lead Sheet webhook rejected the request');
    const reply = await response.json() as WebhookReply;
    if (reply.result !== 'success') throw new Error('lead Sheet webhook did not acknowledge the request');
    return reply;
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
