# AHV form relay: protocol AHV-RELAY-V1

The relay is a small authenticated HTTPS endpoint on the database host. It
exists because the scoped MySQL endpoint (`ktahv_ayurvedic_healing_village`)
does not offer TLS. Vercel must therefore never connect to MySQL directly.

The website sends one signed request per accepted form. The relay writes to
MySQL over the loopback interface and returns a signed reply. The relay does
not implement or allow a plain-HTTP, unsigned or direct-database mode.

Implementation files:

- Relay core: `relay-core.php`
- Web-root entry: `public/index.php`
- Allowlist shared by the website and relay: `lead-schema.json`
- Nonce table DDL: `relay-tables.sql`
- Newsletter table DDL: `newsletter-tables.sql`
- Website client: `lib/form-relay.ts`, `lib/lead-store.ts` and (newsletter)
  `lib/newsletter-store.ts`

## Transport

- `POST` only. Any other method gets `405`.
- HTTPS only. The relay checks `$_SERVER['HTTPS']` or
  `REQUEST_SCHEME=https`. A plain-HTTP request gets `403 HTTPS_REQUIRED`.
- The website client accepts only an `https:` URL with no credentials, query or
  fragment. It sets `redirect: 'error'`, so it never follows a redirect.
- The request must use `Content-Type: application/json`, and the body must be
  64 KiB or smaller.

## Request authentication

Each request carries these headers:

| Header | Value |
|---|---|
| `X-AHV-Key-Id` | Key id, `[A-Za-z0-9_-]{1,32}`. Default: `k1` |
| `X-AHV-Timestamp` | Unix seconds |
| `X-AHV-Nonce` | 22–64 characters from `[A-Za-z0-9_-]`. The client sends 24 random bytes as base64url |
| `X-AHV-Signature` | Lowercase hex HMAC-SHA256 of the canonical string below |

The canonical string joins these fields with `\n`:

```text
AHV-RELAY-V1
<key id>
<timestamp>
<nonce>
POST
<URL path exactly as requested, e.g. /ahv-form-relay/index.php>
<lowercase hex SHA-256 of the exact request body bytes>
```

The relay refuses the request with `401` in any of these cases:

- A header has the wrong shape.
- The timestamp is more than ±300 s from the relay clock. The operator can set
  the window from 30 to 900 s.
- The key id is unknown.
- The signature does not match. The relay compares signatures in constant time
  with `hash_equals`.

The relay records the nonce in `ahv_relay_nonce` only after the signature
verifies. A reused nonce gets `409 REPLAYED_REQUEST`. The relay purges nonces
older than one day.

## Response authentication

Every answer after authentication carries `X-AHV-Relay-Signature`, including
errors. Its value is the HMAC-SHA256, with the same key, of:

```text
AHV-RELAY-V1-RESPONSE
<key id>
<request nonce>
<HTTP status>
<lowercase hex SHA-256 of the exact response body>
```

The website counts a reply as a result only when this signature verifies. A
reply without a valid signature is `RELAY_UNVERIFIED`. This covers proxy error
pages, captive portals and HTML login pages. The website then answers
`502 STORE_FAILED` and never shows a success message.

## Body

```json
{ "v": 1, "op": "lead.store" | "health" | "newsletter.subscribe" | "newsletter.mail_result" | "newsletter.claim" | "newsletter.confirm" | "newsletter.unsubscribe", "data": { … } }
```

### `lead.store`

```json
{
  "table": "contact",
  "submission_token": "<uuid v1-5>",
  "site": "ayurvedichealingvillage.com",
  "form_type": "contact",
  "submit_ip": "203.0.113.9",
  "values":   { "<allowlisted column>": "string" | number | boolean | null },
  "tracking": { "<one of the 12 tracking columns>": "string" }
}
```

Schema rules come from `lead-schema.json`. A violation gets `400` with a code
and a field name, but never the submitted value.

- `table` must be one of the seven lead tables.
- `form_type` must equal `table`.
- `site` must be the fixed site.
- `submit_ip` must be empty or a valid IP.
- `values` keys must be the table's allowlisted columns.
- `consent` and `privacy_consent` must be JSON booleans. The relay sets
  `consent_at` from the database clock, never from the client.
- String limits: 500 characters by default and 4000 for the long-text columns.
  Tracking limits are set per column.
- Values must not contain NUL bytes and must be valid UTF-8.
- Unknown top-level keys are refused.

The relay builds SQL only from allowlisted identifiers and binds every value
as a parameter (`PDO::ATTR_EMULATE_PREPARES = false`).

Idempotency and rate limits:

- If `submission_token` already exists, the relay returns the stored row with
  `alreadyStored: true` and adds no second row.
- A duplicate-key race resolves the same way.
- The relay allows at most 5 rows per `submit_ip` per table in any 10 minutes.
  The sixth gets `429 RATE_LIMITED`.
- The relay also caps authenticated requests at a global per-minute ceiling,
  120 by default. Requests over it get `429`.

Success response:

```json
{ "ok": true, "alreadyStored": false, "row": { "<every column of the stored row>": "string|null" } }
```

The website mirrors this stored row to the Sheet unchanged.

### `health`

The relay returns `{ ok, ready, protocol, tables }`. For each lead table,
`tables` lists these schema-only facts:

- `exists`
- `missingColumns`
- `submissionTokenUnique`

`ahv_relay_nonce` lists `exists`, `missingColumns` and `nonceUnique`. The
response contains no submitted data. `ready` is true only when every table
exists, has every column the relay writes, and has a full-length,
single-column key that rejects duplicates (a primary key or a
duplicate-rejecting index) on `submission_token` (lead tables) or
`nonce` (nonce table). A composite key that merely contains the column, or a
prefix-length key, does not count.

The report also carries `newsletter: { ready, tables }` for the three
newsletter tables. For each table it gives `exists`, `missingColumns` and
`missingUnique`. The keys checked are the full-length duplicate-rejecting keys on
`email_hash`, `public_id` and `token_hash`, and the `(kind, subject_hash)`
PRIMARY KEY of the limit table. The report sits beside the lead report and
never changes the top-level `ready`.

## Newsletter (double opt-in)

The newsletter is a dedicated, purpose-specific audience in three tables
created by `newsletter-tables.sql`:

- `ahv_newsletter_subscriber`
- `ahv_newsletter_confirmation`: the durable, recoverable mail outbox
- `ahv_newsletter_limit`: atomic abuse counters

The newsletter ops never name a lead table, and `lead.store` never names a
newsletter table. The limits, outbox timings, consent versions (with their
exact permission text), locales and token lifetime come from the `newsletter`
block of `lead-schema.json`, which the website reads too. Timestamps come from
the relay clock (UTC), never from the client. Every value is a bound
parameter.

The website generates each confirmation token (32 random bytes, base64url) and
sends the relay two things:

- the token's lowercase hex SHA-256, which is the lookup key;
- the token SEALED with AES-256-GCM under `AHV_NEWSLETTER_OUTBOX_KEY`, with
  the hash as additional authenticated data (`v1.<base64url>`).

The key exists only in the website's environment. The relay and the database
can store the sealed value but never open it. It exists so that a crashed or
uncertain send can be re-sent later with the SAME link. The seal is cleared as
soon as the job is sent, failed, used, revoked, or out of attempts.

### Concurrency

Every newsletter transaction follows these rules:

- **Global lock order.** Transactions take row locks in one order: limit rows
  (ip, then email), then the subscriber row, then confirmation rows.
- **Single-row writes.** Writes outside a transaction touch one row each and
  run as autocommit statements.
- **No gap locks.** A row that might not exist is never locked with
  `SELECT … FOR UPDATE`. The relay first ensures the row exists with an
  autocommit upsert, or with a plain read and insert, then locks it.
- **Bounded retry.** Each transaction is retried a bounded number of times on
  deadlock (1213) or lock-wait timeout (1205).

`bridge/form-relay/test/mysql-integration.sh` proves these rules on a real,
throwaway MySQL with parallel processes. It covers the per-IP and per-address
limits, single-use confirmation, confirm racing unsubscribe, and outbox
leases.

### `newsletter.subscribe`

```json
{
  "email": "reader@example.invalid",
  "consent_version": "newsletter-2026-09-24",
  "consent_locale": "de",
  "source_path": "/de/",
  "submit_ip": "203.0.113.9",
  "token_hash": "<64 hex>",
  "token_sealed": "v1.<base64url>"
}
```

Validation:

- Unknown keys, non-string values, NUL bytes and invalid UTF-8 get
  `400 SCHEMA_VIOLATION` with the field name.
- A bad address gets `INVALID_EMAIL`, and an unlisted version gets
  `UNKNOWN_CONSENT_VERSION`.
- The consent **text** is never accepted from the client. The relay takes it
  from the schema by version.
- `source_path` must be a same-site relative path (`/…`): not
  protocol-relative, no dot segments, at most 300 characters.
- The email address is trimmed and lower-cased. `email_hash` is its SHA-256
  and the single duplicate-rejecting key of the subscriber row, so each address has one
  lifecycle.

Abuse limits are atomic:

- The `ahv_newsletter_limit` row for the IP (`perIpPerHour`) and for the
  address (`perEmailPerDay`) is locked and checked before anything else, and
  incremented only when both pass. These are fixed windows.
- Either limit gives `429 RATE_LIMITED`.
- The table stores SHA-256 digests only.
- Same-address requests are fully serialized by their limit row.

The answer is `{ ok, send, confirmation_id }` and nothing else:

- `send:false` is the neutral answer. It is given when the address is already
  confirmed, or when an email the provider **accepted** within
  `resendCooldownSeconds` is still usable. The cooldown is measured from the
  acceptance time, `mail_updated_at`.
- A queued or uncertain job never makes a repeat quiet, because its reply may
  have been lost.
- When `sendsPerEmailPerDay` jobs that did not fail already exist today:
  - the answer is the neutral `send:false` if an accepted, usable email
    exists;
  - otherwise it is `429 RATE_LIMITED`. The relay never implies an email that
    was not accepted.
- `send:true` comes with the id of a new job with these fields:
  - `mail_status = queued`
  - `attempts = 1`
  - `lease_until = now + inlineLeaseSeconds`, so the creating request owns the
    inline send
  - the token hash and seal
  - the requested consent version, text, locale, source path and request IP
  - an expiry of `confirmationTtlHours`
- An `unsubscribed` address stays `unsubscribed` with `suppressed = 1`. Only a
  valid confirmation of a token issued by this later request lifts it. This is
  fresh re-consent: retries, resends and re-imports through this op never
  re-subscribe anyone.

### `newsletter.mail_result`

`{ confirmation_id, token_hash, result }` is a single-row update of a `queued`
or `unknown` job. `result` is one of:

- `sent`: the provider accepted the email with a signed acknowledgement
  correlated to the request. The relay records `mail_updated_at` as the
  acceptance time and clears the seal and the lease.
- `failed`: the provider signed a definitive refusal made before sending. The
  relay revokes the token and clears the seal.
- `unknown`: the outcome is uncertain (a timeout, an unverifiable reply, or an
  HTTP error). The token stays valid, because the email may be in the inbox.
  The job is released to the outbox worker after `retryDelaySeconds`, and its
  seal is dropped once `attempts` reaches `maxSendAttempts`.

### `newsletter.claim`

`{ limit? }` is the outbox worker's lease. It returns up to `claimBatch` jobs
with `{ confirmation_id, token_hash, token_sealed, locale, email }`. A job is
eligible when all of these hold:

- it is queued or unknown;
- it is unused, unrevoked and sealed;
- it expires more than 10 minutes from now;
- it is within the attempt budget;
- its lease has lapsed;
- its address is not already confirmed.

Each job is leased with a single-row compare-and-set (`attempts + 1`,
`lease_until = now + inlineLeaseSeconds`), so two workers never both claim it.
The worker re-sends the same link under the same idempotency key. Occasional
housekeeping deletes stale counters, clears seals of expired jobs, and deletes
never-used jobs that expired more than 30 days ago.

### `newsletter.confirm`

`{ token_hash }`. The relay first looks up the token without a lock, then runs
one transaction in the global order:

1. Lock the subscriber, then the token.
2. Check that the token belongs to that subscriber, is unused and unrevoked,
   is not a failed job, has not expired, and was not issued before the latest
   unsubscribe. Queued and uncertain jobs ARE confirmable: whoever holds the
   raw token has proven the mailbox.
3. Consume the token with a conditional update (`used_at IS NULL`). It must
   affect exactly one row.
4. Set the subscriber `confirmed`, clear `suppressed`, and record
   `confirmed_at`, the consent version and text, locale, source path and IP.
5. Revoke, and unseal, every other outstanding token.

Answer: `{ outcome: "confirmed", public_id }`. Every failure gets the same
`{ outcome: "invalid" }`.

### `newsletter.unsubscribe`

`{ public_id }` (32 hex). The relay locks the subscriber, then its tokens, in
one transaction. It sets `status = unsubscribed`, `suppressed = 1` and
`unsubscribed_at`, and revokes and unseals every outstanding token, so the
outbox never re-sends them. The operation is idempotent. Unknown ids get the
same `{ outcome: "unsubscribed" }`. The website only calls it after verifying
the link's HMAC (`AHV_NEWSLETTER_LINK_SECRET`).

Marketing eligibility is exactly `status = 'confirmed' AND suppressed = 0`.
Any future newsletter export or sender must select on that. It must add
subscribers to the audience only through `newsletter.subscribe` +
`newsletter.confirm`, never by writing rows directly.

## Errors

- Only a code leaves the relay. It never returns driver text or SQL.
- The error log records the exception class and SQLSTATE only.
- A relay whose `config.php` fails validation answers
  `503 RELAY_NOT_CONFIGURED` and never opens a database connection. Validation
  fails in these cases:
  - A database field is empty.
  - The database name is wrong.
  - The database host is not a loopback address or local socket.
  - There is no key.
  - A key is shorter than 32 characters.

## Key rotation

1. Add the new `id => secret` pair beside the old one in `config.php`.
2. Switch Vercel's `AHV_FORM_RELAY_KEY_ID` and `AHV_FORM_RELAY_SECRET` to the
   new pair and redeploy.
3. Remove the old pair.
