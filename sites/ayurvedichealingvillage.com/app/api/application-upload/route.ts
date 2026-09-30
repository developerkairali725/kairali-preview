import { createHash } from 'node:crypto';
import { extname } from 'node:path';
import { relayConfigured } from '../../../lib/form-relay.ts';
import { leadSheetConfigured, uploadApplicationFileToDrive } from '../../../lib/lead-sheet-bridge.ts';

export const runtime = 'nodejs';
const headers = { 'Cache-Control': 'no-store', 'X-Robots-Tag': 'noindex' };
const MAX_FILE_BYTES = 4 * 1024 * 1024;
const MAX_MULTIPART_BYTES = MAX_FILE_BYTES + 256 * 1024;
const RATE_WINDOW_MS = 10 * 60 * 1000;
const RATE_LIMIT = 6;
const TOKEN_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
type ApplicationFilePurpose = 'photo' | 'resume' | 'application';
const PURPOSES: readonly ApplicationFilePurpose[] = ['photo', 'resume', 'application'];
const MIME_BY_EXTENSION: Record<string, readonly string[]> = {
  '.jpg': ['image/jpeg'],
  '.jpeg': ['image/jpeg'],
  '.png': ['image/png'],
  '.webp': ['image/webp'],
  '.pdf': ['application/pdf'],
  '.doc': ['application/msword', 'application/octet-stream'],
  '.docx': ['application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'application/octet-stream'],
};

const uploadRateCache = globalThis as { __ahvUploadRate?: Map<string, number[]> };
if (!uploadRateCache.__ahvUploadRate) uploadRateCache.__ahvUploadRate = new Map();

function requestOriginAllowed(request: Request): boolean {
  const origin = request.headers.get('origin');
  const host = (request.headers.get('x-forwarded-host') || request.headers.get('host') || new URL(request.url).host)
    .split(',')[0].trim().toLowerCase();
  if (!origin || !host) return false;
  try { return new URL(origin).host.toLowerCase() === host; } catch { return false; }
}

function uploadRateAllowed(request: Request): boolean {
  const now = Date.now();
  const key = (request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || 'unknown')
    .split(',')[0].trim().slice(0, 45) || 'unknown';
  const recent = (uploadRateCache.__ahvUploadRate!.get(key) || []).filter((at) => now - at < RATE_WINDOW_MS);
  if (recent.length >= RATE_LIMIT) return false;
  recent.push(now);
  uploadRateCache.__ahvUploadRate!.set(key, recent);
  return true;
}

function allowedFile(file: File, purpose: ApplicationFilePurpose): boolean {
  const extension = extname(file.name).toLowerCase();
  const allowedExtensions = purpose === 'photo'
    ? ['.jpg', '.jpeg', '.png', '.webp']
    : ['.pdf', '.doc', '.docx'];
  return allowedExtensions.includes(extension) && (MIME_BY_EXTENSION[extension] ?? []).includes(file.type || 'application/octet-stream');
}

export async function POST(request: Request): Promise<Response> {
  // Fails closed before reading the body: files are only accepted when the
  // lead store (relay) AND the Sheet/Drive webhook are both configured, so an
  // upload can never be orphaned by a form that cannot be stored.
  if (!relayConfigured() || !leadSheetConfigured()) {
    return Response.json({ ok: false, code: 'FILE_STORE_NOT_CONFIGURED' }, { status: 503, headers });
  }
  if (!(request.headers.get('content-type') || '').includes('multipart/form-data')) {
    return Response.json({ ok: false, code: 'INVALID_REQUEST' }, { status: 415, headers });
  }
  if (!requestOriginAllowed(request)) {
    return Response.json({ ok: false, code: 'INVALID_ORIGIN' }, { status: 403, headers });
  }
  const contentLength = Number(request.headers.get('content-length'));
  if (!Number.isSafeInteger(contentLength) || contentLength < 1) {
    return Response.json({ ok: false, code: 'CONTENT_LENGTH_REQUIRED' }, { status: 411, headers });
  }
  if (contentLength > MAX_MULTIPART_BYTES) {
    return Response.json({ ok: false, code: 'FILE_TOO_LARGE' }, { status: 413, headers });
  }
  if (!uploadRateAllowed(request)) {
    return Response.json({ ok: false, code: 'RATE_LIMITED' }, { status: 429, headers: { ...headers, 'Retry-After': '600' } });
  }

  let form: FormData;
  try { form = await request.formData(); } catch {
    return Response.json({ ok: false, code: 'INVALID_REQUEST' }, { status: 400, headers });
  }
  const file = form.get('file');
  const purpose = form.get('purpose');
  const submissionToken = form.get('submissionToken');
  if (!(file instanceof File) || typeof purpose !== 'string' || !PURPOSES.includes(purpose as ApplicationFilePurpose)) {
    return Response.json({ ok: false, code: 'INVALID_FILE' }, { status: 400, headers });
  }
  if (typeof submissionToken !== 'string' || !TOKEN_RE.test(submissionToken)) {
    return Response.json({ ok: false, code: 'INVALID_SUBMISSION' }, { status: 400, headers });
  }
  if (file.size < 1 || file.size > MAX_FILE_BYTES || !allowedFile(file, purpose as ApplicationFilePurpose)) {
    return Response.json({ ok: false, code: 'INVALID_FILE' }, { status: 400, headers });
  }

  try {
    const bytes = Buffer.from(await file.arrayBuffer());
    const uploaded = await uploadApplicationFileToDrive({
      submissionToken: submissionToken.toLowerCase(),
      purpose: purpose as ApplicationFilePurpose,
      originalName: file.name.slice(0, 255),
      mimeType: file.type || 'application/octet-stream',
      base64: bytes.toString('base64'),
      sha256: createHash('sha256').update(bytes).digest('hex'),
    });
    return Response.json({ ok: true, fileUrl: uploaded.fileUrl }, { status: 200, headers });
  } catch {
    return Response.json({ ok: false, code: 'FILE_STORE_FAILED' }, { status: 502, headers });
  }
}
