/**
 * AHV lead conversion — CANDIDATE, NOT ACTIVATED.
 *
 * Task WOPS-AHV-GO-LIVE-MEASUREMENT-PERFORMANCE-AUDIT-001.
 *
 * WHAT THIS REPLACES. On the live WordPress site the Google Ads conversion
 * `AW-972059125/fqrBCJvyugcQ9ePBzwM` (EnquirySubmission, ctId 15644955, account
 * AHV-NEO 712-961-0573) is fired by a plain inline script on /ppc-thanks/ that
 * runs on PAGE LOAD. A recorded read-only audit on 27 Aug 2026 observed that
 * opening the URL directly generated the conversion request, and the page is
 * public, indexable and self-canonical. So the signal currently means "a URL was
 * opened", not "a patient enquired".
 *
 * WHAT THIS DOES INSTEAD, per the required new-site behaviour already written
 * into that plan: fire once, only after the SERVER confirms an accepted lead,
 * deduplicated by a non-personal correlation id, and never because a page was
 * viewed, refreshed or navigated back to.
 *
 * SUCCESS IS NOT GUESSED. The new stack's contract is known exactly from
 * packages/forms/src/route-handler.ts:
 *
 *   201 + { ok: true, id: "<lead row id>" }   accepted and stored
 *   200 + { ok: true }            NO id       honeypot tripped — pretend success
 *   400 + { ok: false }                       invalid body
 *   422 + { ok: false, error }                validation, incl. missing consent
 *   500 + { ok: false }                       server/config failure
 *   503 + { ok: false, staging: true }        staging guard, never reaches the store
 *
 * The honeypot path is exactly why `ok: true` alone is not the predicate: a bot
 * gets 200/ok:true with NO id. Acceptance requires 201 AND ok:true AND a
 * non-empty string id. packages/forms/src/store.js also throws unless
 * `consent === true`, so a stored lead already carries explicit consent and a
 * consent_at timestamp.
 *
 * NO PERSONAL DATA leaves this module. The only value sent is the lead row id,
 * used as the Ads `transaction_id` so Google can deduplicate. Name, phone,
 * email, condition and free text are never read here.
 *
 * ACTIVATION IS A SEPARATE OWNER DECISION. Nothing calls this module yet, and
 * `config` is undefined unless a build sets AHV_ANALYTICS=1, so on staging it
 * cannot fire even if it were called. Reversal is deleting the call site.
 */

/** Outcomes are explicit so a caller — and a test — can prove WHY nothing fired. */
export const FIRED = "fired";
export const SKIPPED_DISABLED = "skipped:disabled";
export const SKIPPED_NO_CONSENT = "skipped:no-consent";
export const SKIPPED_NOT_ACCEPTED = "skipped:not-accepted";
export const SKIPPED_DUPLICATE = "skipped:duplicate";

/**
 * The lead id from a CONFIRMED acceptance, or null.
 * Deliberately strict: 201 only, ok === true only, non-empty string id only.
 * @param {{status:number, body:unknown}} res
 * @returns {string|null}
 */
export function acceptedLeadId(res) {
  if (!res || res.status !== 201) return null;
  const body = res.body;
  if (!body || typeof body !== "object") return null;
  if (body.ok !== true) return null;
  const id = body.id;
  if (typeof id !== "string" || id.trim() === "") return null;
  return id;
}

/**
 * Record an accepted lead as a Google Ads conversion, once.
 *
 * @param {{status:number, body:unknown}} res  the handler's response
 * @param {{
 *   config?: { adsSendTo?: string },   absent => measurement off for this build
 *   consent: () => string|null,        the ktahv-consent value, read at FIRE time
 *   seen: { has(id:string):boolean, add(id:string):void },
 *   gtag?: (...args:unknown[]) => void
 * }} env
 * @returns {{ outcome:string, leadId:string|null, sent?:object }}
 */
export function recordAcceptedLead(res, env) {
  const leadId = acceptedLeadId(res);
  if (leadId === null) return { outcome: SKIPPED_NOT_ACCEPTED, leadId: null };

  // Dedup BEFORE consent, so a withdrawn-consent retry of an already-counted
  // lead cannot be re-counted later if consent is granted again.
  if (env.seen.has(leadId)) return { outcome: SKIPPED_DUPLICATE, leadId };

  // Consent is read at fire time, never cached: a visitor who declines, or who
  // withdraws after an earlier acceptance, must not have this dispatched.
  if (env.consent() !== "accepted") return { outcome: SKIPPED_NO_CONSENT, leadId };

  // Build-time switch. No ids reach the browser unless AHV_ANALYTICS=1, so this
  // is the lock that keeps staging silent independently of consent.
  const sendTo = env.config && env.config.adsSendTo;
  if (!sendTo) return { outcome: SKIPPED_DISABLED, leadId };

  if (typeof env.gtag !== "function") return { outcome: SKIPPED_DISABLED, leadId };

  const payload = {
    send_to: sendTo,
    // The row id only. It is a correlation key, not personal data, and it is
    // what lets Google drop a duplicate if this ever dispatches twice.
    transaction_id: leadId,
  };
  env.gtag("event", "conversion", payload);

  // Marked only after dispatch, so a throw leaves the lead eligible for a retry
  // rather than silently swallowing the conversion.
  env.seen.add(leadId);
  return { outcome: FIRED, leadId, sent: payload };
}

/**
 * Dedup store backed by localStorage, surviving refresh, back-navigation and a
 * re-mounted client. Falls back to in-memory when storage is unavailable
 * (private mode), which still covers double-click within the same page view.
 * @param {Storage|null} storage
 */
export function createSeenStore(storage) {
  const KEY = "ktahv-lead-conversions";
  const memory = new Set();
  const read = () => {
    if (!storage) return null;
    try {
      const raw = storage.getItem(KEY);
      const list = raw ? JSON.parse(raw) : [];
      return Array.isArray(list) ? list : [];
    } catch {
      return null;
    }
  };
  return {
    has(id) {
      const list = read();
      return list === null ? memory.has(id) : list.indexOf(id) !== -1;
    },
    add(id) {
      const list = read();
      if (list === null) {
        memory.add(id);
        return;
      }
      if (list.indexOf(id) !== -1) return;
      list.push(id);
      // Bounded: a browser that never clears storage should not grow forever.
      const trimmed = list.slice(-50);
      try {
        storage.setItem(KEY, JSON.stringify(trimmed));
      } catch {
        memory.add(id);
      }
    },
  };
}
