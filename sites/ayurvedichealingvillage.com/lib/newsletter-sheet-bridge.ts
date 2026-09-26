/**
 * Feeding the Google Sheet the team manages newsletter subscribers from.
 *
 * The database is the source of record (lib/newsletter-store.ts); the Sheet is
 * a destination fed from it, exactly like the villaraag fleet's own enquiry
 * Sheet. Only an explicit acknowledgement counts as delivered — an Apps Script
 * that is broken, unpublished or has hit a quota can still answer HTTP 200
 * with an HTML login page, so "the request did not throw" is not evidence
 * that a row was written.
 */

export function newsletterSheetUrl(): string {
  return process.env.AHV_NEWSLETTER_SHEET_WEBHOOK_URL ?? '';
}

export async function deliverToSheet(url: string, payload: Record<string, string>): Promise<boolean> {
  try {
    const upstream = await fetch(url, {
      method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload),
      cache: 'no-store', signal: AbortSignal.timeout(20000),
    });
    if (!upstream.ok) return false;
    const result: unknown = await upstream.json();
    if (!result || typeof result !== 'object') return false;
    const ack = result as Record<string, unknown>;
    if (ack.error || ack.result === 'error') return false;
    return ack.result === 'success';
  } catch {
    // Never retry here: a timeout can happen after the Sheet accepted the row.
    return false;
  }
}

export function newsletterSheetRow(email: string, submitTimeIso: string, pageUrl: string): Record<string, string> {
  return {
    Email: email,
    Time: submitTimeIso,
    'Page URL': pageUrl,
    verification: 'AHV_NEWSLETTER',
  };
}
