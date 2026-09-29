/**
 * AHV newsletter confirmation-mail sender (double opt-in, transactional only).
 *
 * The website's `apps-script` mail adapter (lib/newsletter-mail.ts) posts one
 * HMAC-signed request per confirmation email. This script verifies it and
 * sends ONE email from info@kairali.com. It stores no subscriber data, touches
 * no Sheet or Drive file, and never sends newsletters or any other message.
 *
 * Separate from lead-sheet.gs on purpose: its own Apps Script project,
 * deployment and secret, so the newsletter can never write into the patient
 * lead Sheet and a lead-Sheet secret can never send email.
 *
 * Delivery semantics — at-least-once, never "exactly once":
 *  - A DURABLE journal in Script Properties records, per idempotency key,
 *    `sending` (written BEFORE GmailApp.sendEmail) and `accepted` (written
 *    after it returned). Nothing is ever marked accepted before the send.
 *  - A repeat of an `accepted` job is acknowledged without sending.
 *  - A repeat of a job left in `sending` (crash, Gmail error, lost journal
 *    write) is RECONCILED against the account's Sent mail: every message
 *    carries its job reference, so if it is found there the job is accepted
 *    without a second send; if not, the answer is `unknown` until the
 *    reconciliation window has passed, after which it is sent again. A
 *    duplicate is therefore possible only when Gmail neither confirmed nor
 *    indexed a message that it did in fact send.
 *  - Every reply after authentication is signed and bound to the request's
 *    nonce and idempotency key: `accepted` / `duplicate` (sent), `rejected`
 *    (definitively NOT sent — refused before sending), `unknown` (may or may
 *    not have been sent).
 *
 * Deployment (a human with the Google account; see FORM-INTEGRATION-SETUP.md):
 *  1. Create a new Apps Script project owned by the account that IS
 *     info@kairali.com, or that has info@kairali.com as a verified Gmail
 *     "Send mail as" address. Any other sender is refused — the script never
 *     substitutes a different From address.
 *  2. Script Properties: AHV_NEWSLETTER_MAIL_SECRET = a random value of at
 *     least 32 characters, identical to the website's
 *     AHV_NEWSLETTER_MAIL_WEBHOOK_SECRET.
 *  3. Run diagnoseNewsletterSender() once; it must report senderAvailable:true.
 *  4. Deploy as Web app — Execute as: the owner; Who has access: Anyone.
 */

var SENDER = 'info@kairali.com';
var SENDER_NAME = 'Kairali – The Ayurvedic Healing Village';
var PROTOCOL = 'AHV-NEWSLETTER-MAIL-V1';
var MAX_SKEW_SECONDS = 300;
var NONCE_CACHE_SECONDS = 21600;
var JOURNAL_PREFIX = 'nlj:';
var RECONCILE_SECONDS = 600;
var JOURNAL_TTL_SECONDS = 3 * 86400;
var EMAIL_RE = /^[A-Za-z0-9.!#$%&'*+\/=?^_`{|}~-]{1,64}@(?:[A-Za-z0-9](?:[A-Za-z0-9-]{0,61}[A-Za-z0-9])?\.)+[A-Za-z]{2,63}$/;

function toHex(bytes) {
  return bytes.map(function (value) {
    var normalized = value < 0 ? value + 256 : value;
    return ('0' + normalized.toString(16)).slice(-2);
  }).join('');
}

function constantTimeEquals(a, b) {
  if (a.length !== b.length) return false;
  var diff = 0;
  for (var i = 0; i < a.length; i += 1) diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return diff === 0;
}

function sharedSecret() {
  return String(PropertiesService.getScriptProperties().getProperty('AHV_NEWSLETTER_MAIL_SECRET') || '');
}

function senderAvailable() {
  var me = String(Session.getEffectiveUser().getEmail() || '').toLowerCase();
  if (me === SENDER) return true;
  var aliases = GmailApp.getAliases() || [];
  return aliases.map(function (alias) { return String(alias).toLowerCase(); }).indexOf(SENDER) !== -1;
}

function nowSeconds() {
  return Math.floor(Date.now() / 1000);
}

/** Unsigned error: only for requests that did not authenticate (the caller treats it as uncertain). */
function fail(message) {
  return respond({ result: 'error', message: message });
}

/** Signed, correlated reply for an authenticated request. */
function signedReply(secret, p, result, code) {
  var c = code || '';
  var canonical = PROTOCOL + '-RESPONSE\n' + p.nonce + '\n' + p.idempotencyKey + '\n' + result + '\n' + c;
  return respond({
    result: result,
    code: c,
    nonce: p.nonce,
    idempotencyKey: p.idempotencyKey,
    signature: toHex(Utilities.computeHmacSha256Signature(canonical, secret)),
  });
}

function readJournal(props, key) {
  var raw = props.getProperty(JOURNAL_PREFIX + key);
  if (!raw) return null;
  try { return JSON.parse(raw); } catch (error) { return { s: 'sending', t: 0 }; }
}

function writeJournal(props, key, state) {
  props.setProperty(JOURNAL_PREFIX + key, JSON.stringify({ s: state, t: nowSeconds() }));
}

function foundInSentMail(key) {
  var threads = GmailApp.search('in:sent "' + key + '"', 0, 1);
  return Boolean(threads && threads.length);
}

function pruneJournal(props) {
  var cutoff = nowSeconds() - JOURNAL_TTL_SECONDS;
  props.getKeys().forEach(function (name) {
    if (name.indexOf(JOURNAL_PREFIX) !== 0) return;
    var entry = readJournal(props, name.slice(JOURNAL_PREFIX.length));
    if (entry && entry.t && entry.t < cutoff) props.deleteProperty(name);
  });
}

function doPost(request) {
  try {
    var secret = sharedSecret();
    if (secret.length < 32) return fail('not configured');
    var envelope = JSON.parse(request.postData.contents);
    var payloadText = String(envelope && envelope.payload || '');
    var signature = String(envelope && envelope.signature || '').toLowerCase();
    var expected = toHex(Utilities.computeHmacSha256Signature(PROTOCOL + '\n' + payloadText, secret));
    if (!/^[0-9a-f]{64}$/.test(signature) || !constantTimeEquals(expected, signature)) return fail('unauthorized');

    var p = JSON.parse(payloadText);
    if (!p || typeof p.nonce !== 'string' || !/^[A-Za-z0-9_-]{16,64}$/.test(p.nonce)
      || typeof p.idempotencyKey !== 'string' || !/^[A-Za-z0-9-]{1,80}$/.test(p.idempotencyKey)) return fail('bad request');
    // From here every answer is signed and correlated. `rejected` always means: NOT sent.
    if (p.v !== 1 || p.action !== 'newsletter.confirmation') return signedReply(secret, p, 'rejected', 'BAD_REQUEST');
    if (typeof p.ts !== 'number' || Math.abs(nowSeconds() - p.ts) > MAX_SKEW_SECONDS) return signedReply(secret, p, 'rejected', 'STALE');
    if (p.from !== SENDER) return signedReply(secret, p, 'rejected', 'SENDER_REFUSED');
    if (typeof p.to !== 'string' || p.to.length > 254 || !EMAIL_RE.test(p.to)
      || typeof p.subject !== 'string' || !p.subject || p.subject.length > 200 || /[\r\n]/.test(p.subject)
      || typeof p.text !== 'string' || !p.text || p.text.length > 8000 || p.text.indexOf(p.idempotencyKey) === -1
      || typeof p.html !== 'string' || p.html.length > 16000) return signedReply(secret, p, 'rejected', 'BAD_REQUEST');

    var lock = LockService.getScriptLock();
    lock.waitLock(20000);
    try {
      var cache = CacheService.getScriptCache();
      if (cache.get('nonce:' + p.nonce)) return signedReply(secret, p, 'rejected', 'REPLAYED');
      cache.put('nonce:' + p.nonce, '1', NONCE_CACHE_SECONDS);

      var props = PropertiesService.getScriptProperties();
      var entry = readJournal(props, p.idempotencyKey);
      if (entry && entry.s === 'accepted') return signedReply(secret, p, 'duplicate');
      if (entry && entry.s === 'sending') {
        if (foundInSentMail(p.idempotencyKey)) {
          try { writeJournal(props, p.idempotencyKey, 'accepted'); } catch (error) { /* next repeat reconciles again */ }
          return signedReply(secret, p, 'duplicate');
        }
        // Not (yet) visible in Sent: it may still be indexing. Do not send again inside the window.
        if (nowSeconds() - (entry.t || 0) < RECONCILE_SECONDS) return signedReply(secret, p, 'unknown', 'RECONCILING');
      }
      if (!senderAvailable()) return signedReply(secret, p, 'rejected', 'SENDER_UNAVAILABLE');

      writeJournal(props, p.idempotencyKey, 'sending');
      var options = { from: SENDER, name: SENDER_NAME, replyTo: SENDER };
      if (p.html) options.htmlBody = p.html;
      try {
        GmailApp.sendEmail(p.to, p.subject, p.text, options);
      } catch (error) {
        // Gmail may or may not have sent it; the journal stays `sending` for reconciliation.
        return signedReply(secret, p, 'unknown', 'SEND_ERROR');
      }
      try { writeJournal(props, p.idempotencyKey, 'accepted'); } catch (error) { /* stays `sending`; a repeat reconciles against Sent */ }
      if (Math.random() < 0.05) {
        try { pruneJournal(props); } catch (error) { /* housekeeping only */ }
      }
      return signedReply(secret, p, 'accepted');
    } finally {
      lock.releaseLock();
    }
  } catch (error) {
    // No address, subject or provider text ever leaves in an error. Unsigned: the caller treats it as uncertain.
    return fail('request failed');
  }
}

/**
 * Run manually in the Apps Script editor before deployment. Reports whether
 * the executing account can send as info@kairali.com. Sends nothing.
 */
function diagnoseNewsletterSender() {
  var result = { sender: SENDER, senderAvailable: senderAvailable(), secretConfigured: sharedSecret().length >= 32 };
  console.log(JSON.stringify(result));
  return result;
}

function respond(body) {
  return ContentService.createTextOutput(JSON.stringify(body)).setMimeType(ContentService.MimeType.JSON);
}

function doGet() {
  return respond({ result: 'error', message: 'This endpoint accepts POST only.' });
}
