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
- Website client: `lib/form-relay.ts` and `lib/lead-store.ts`

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
{ "v": 1, "op": "lead.store" | "health", "data": { … } }
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
`tables` lists these column-name-only facts:

- `exists`
- `missingColumns`
- `submissionTokenUnique`

The same facts are listed for `ahv_relay_nonce`. The response contains no
submitted data. `ready` is true only when every table exists, has every column
the relay writes, and has a UNIQUE index on `submission_token`.

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
