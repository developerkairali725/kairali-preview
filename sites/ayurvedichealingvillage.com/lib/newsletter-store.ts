import { randomBytes } from 'node:crypto';
import type { RowDataPacket } from 'mysql2/promise';
import { pool } from './db.ts';

/**
 * Footer newsletter — email-only, single destination: our own MySQL table.
 * Deliberately NOT the CRM/enquiry lead pipeline and NOT an email-marketing
 * platform; the team manages subscribers from this table directly.
 *
 * Duplicate-submission guard: the browser mints a `submissionToken` when the
 * visitor starts sending and resends it on every retry of that same fill, so
 * a double tap or a resubmit after a network error collides with the row
 * that already exists instead of creating a second one. A repeat signup with
 * the SAME EMAIL on a later visit is also not an error — it is treated as
 * "already subscribed" and answered the same way as a fresh signup.
 */

export type NewsletterSignup = {
  site: string;
  email: string;
  consent: boolean;
  consentVersion: string;
  sourcePath: string;
  utmSource: string;
  utmMedium: string;
  utmCampaign: string;
  utmContent: string;
  leadSourceUrl: string;
  referrer: string;
  submitIp: string;
};

function isDuplicate(error: unknown): boolean {
  const e = error as { code?: string; errno?: number } | null;
  return e?.code === 'ER_DUP_ENTRY' || e?.errno === 1062;
}

export type StoredSignup = { alreadySubscribed: boolean };

export async function saveNewsletterSignup(
  signup: NewsletterSignup,
  submissionToken: string,
): Promise<StoredSignup> {
  const connection = await pool().getConnection();
  try {
    const unsubscribeToken = `ns_${randomBytes(16).toString('base64url')}`;
    try {
      await connection.execute(
        `INSERT INTO \`newsletter\`
           (site, email, consent, consent_version, consent_at, source_path,
            utm_source, utm_medium, utm_campaign, utm_content, lead_source_url,
            referrer, status, confirmed_at, unsubscribe_token, submit_ip, submission_token)
         VALUES (?,?,?,?,NOW(),?,?,?,?,?,?,?, 'subscribed', NOW(), ?, ?, ?)`,
        [
          signup.site, signup.email, signup.consent ? 1 : 0, signup.consentVersion, signup.sourcePath,
          signup.utmSource, signup.utmMedium, signup.utmCampaign, signup.utmContent, signup.leadSourceUrl,
          signup.referrer, unsubscribeToken, signup.submitIp, submissionToken,
        ],
      );
      return { alreadySubscribed: false };
    } catch (error) {
      if (!isDuplicate(error)) throw error;
      // Same fill retried, or this email already subscribed. Either way the
      // visitor should see success, not an error.
      const [rows] = await connection.query<RowDataPacket[]>(
        'SELECT id FROM `newsletter` WHERE email = ? OR submission_token = ? LIMIT 1',
        [signup.email, submissionToken],
      );
      if (!rows[0]) throw error;
      return { alreadySubscribed: true };
    }
  } finally {
    connection.release();
  }
}
