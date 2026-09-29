# AHV form relay: deployment runbook

This runbook is for a human with database-host access, because it needs
hosting credentials the agent does not have and must not have. It deploys the
signed HTTPS relay described in `SPEC.md` and then activates the website's
forms on a preview deployment.

Until this runbook is complete, every AHV form route answers a truthful 503
and stores nothing. This is the intended fail-closed state.

You must not do any of the following during this runbook:

- Edit `.htaccess`, `wp-config.php`, DNS or permalink settings (HARD GATE 3).
- Configure a plain-HTTP relay URL. The website refuses one anyway.
- Configure the direct `AHV_DB_*` MySQL variables on Vercel. They are no longer
  read.
- Paste the relay key, database password or Apps Script secret into chat,
  email, tickets or screenshots (HARD GATE 14).
- Point anything at production (HARD GATE 1). Activate on a preview deployment
  first.

## 0. What you need

| # | Item | Who holds it |
|---|---|---|
| 1 | Shell (SSH) or cPanel File Manager access to the host running MySQL for `ktahv_ayurvedic_healing_village` | Hosting owner or the web developer |
| 2 | MySQL admin rights on that database, to create one user and one table | Same |
| 3 | An HTTPS virtual host on the **same** machine with a valid certificate. An existing domain there with AutoSSL is fine. It must not need a DNS change. | Same. If none exists, **stop and ask Abilash**: DNS is a human decision. |
| 4 | PHP 7.4 or later with `pdo_mysql` on that host | Check: `php -m \| grep -i pdo_mysql` |
| 5 | Vercel project access to set Preview environment variables | Abilash or the web developer |
| 6 | Owner access to the target Google Sheet and its Apps Script (FORM-INTEGRATION-SETUP.md) | Sheet owner |

## 1. Pick the relay URL

Choose a path on the HTTPS host from item 3, for example
`https://<existing-https-host>/ahv-form-relay/index.php`. Then confirm that the
certificate is valid:

```sh
curl -sS -o /dev/null -w '%{http_code} %{ssl_verify_result}\n' https://<existing-https-host>/
# expect an HTTP code and ssl_verify_result 0
```

The website verifies the certificate with Node's default TLS settings. The
codebase has no opt-out.

## 2. Create the relay home outside the web root

```sh
mkdir -m 700 ~/ahv-form-relay
# upload from this repository (sites/ayurvedichealingvillage.com/bridge/form-relay/):
#   relay-core.php      -> ~/ahv-form-relay/relay-core.php
#   lead-schema.json    -> ~/ahv-form-relay/lead-schema.json
#   config.sample.php   -> ~/ahv-form-relay/config.php
chmod 600 ~/ahv-form-relay/config.php ~/ahv-form-relay/relay-core.php ~/ahv-form-relay/lead-schema.json
```

Do not upload `test/`, `SPEC.md` or this runbook to the host.

## 3. Create the nonce table and a least-privilege database user

Run `relay-tables.sql` as the MySQL admin, using the `mysql` CLI or phpMyAdmin.
It creates only `ahv_relay_nonce`.

Then create a dedicated relay user that connects only from localhost. Use a
new random password and put it only in `config.php`.

```sql
CREATE USER 'ahv_relay'@'localhost' IDENTIFIED BY '<generated on the host>';
GRANT SELECT, INSERT ON `ktahv_ayurvedic_healing_village`.`contact`             TO 'ahv_relay'@'localhost';
GRANT SELECT, INSERT ON `ktahv_ayurvedic_healing_village`.`enquiry-form`        TO 'ahv_relay'@'localhost';
GRANT SELECT, INSERT ON `ktahv_ayurvedic_healing_village`.`apply-now`           TO 'ahv_relay'@'localhost';
GRANT SELECT, INSERT ON `ktahv_ayurvedic_healing_village`.`opd`                 TO 'ahv_relay'@'localhost';
GRANT SELECT, INSERT ON `ktahv_ayurvedic_healing_village`.`online-consultation` TO 'ahv_relay'@'localhost';
GRANT SELECT, INSERT ON `ktahv_ayurvedic_healing_village`.`landing-page`        TO 'ahv_relay'@'localhost';
GRANT SELECT, INSERT ON `ktahv_ayurvedic_healing_village`.`exit-intent`         TO 'ahv_relay'@'localhost';
GRANT SELECT, INSERT, DELETE ON `ktahv_ayurvedic_healing_village`.`ahv_relay_nonce` TO 'ahv_relay'@'localhost';
```

If MySQL resolves the loopback connection as `127.0.0.1` rather than
`localhost`, create the same user and grants for `'ahv_relay'@'127.0.0.1'`.

On cPanel, if the MySQL Databases screen cannot grant per table, grant only
SELECT, INSERT and DELETE on the database. Do not grant UPDATE, ALTER, DROP or
ALL. Record the fallback in the activation evidence. The relay code deletes
only expired nonces.

## 4. Fill `config.php` on the host

Generate the key on the host:

```sh
openssl rand -base64 48
```

Put the output into `keys => ['k1' => '…']`. Fill `db.user` and
`db.password` from step 3. Keep `host` as `127.0.0.1` or `localhost`, or use
the local `socket` path.

The relay refuses to start (`503 RELAY_NOT_CONFIGURED`) in these cases:

- A field is empty.
- The key is shorter than 32 characters.
- The database name is not `ktahv_ayurvedic_healing_village`.
- The database host is not loopback.

## 5. Publish the entry point

Copy `public/index.php` from this repository to
`<web root>/ahv-form-relay/index.php`. Then point it at the relay home in one
of two ways. Neither way touches `.htaccess`.

- **Option A:** If the hosting panel offers per-site environment variables for
  PHP, set `AHV_FORM_RELAY_HOME=/home/<user>/ahv-form-relay`.
- **Option B:** Otherwise, create `<web root>/ahv-form-relay/relay-home.php`
  containing only this line:

  ```php
  <?php return '/home/<user>/ahv-form-relay';
  ```

  The file holds a path, not a secret.

## 6. Smoke-test the relay (no data written)

```sh
R=https://<existing-https-host>/ahv-form-relay/index.php
curl -s -o /dev/null -w '%{http_code}\n' "$R"                                                     # 405 (POST only)
curl -s -X POST -H 'content-type: application/json' --data '{}' "$R"; echo                         # 401 UNAUTHENTICATED (unsigned)
curl -s -o /dev/null -w '%{http_code}\n' -X POST -H 'content-type: application/json' --data '{}' "http://${R#https://}"
#   ^ plain HTTP: must be 403 HTTPS_REQUIRED or a redirect to https — never 200
```

If the unsigned POST over **https://** answers `403 HTTPS_REQUIRED` rather than
`401`, PHP does not see HTTPS. This usually means a proxy or CDN in front of
the host terminates TLS and forwards plain HTTP. **Stop and ask.** Do not patch
the relay to trust `X-Forwarded-Proto`: that header can be forged, and the
relay deliberately has no such switch. The fix belongs to the host
configuration, which must present `HTTPS=on` to PHP.

Then run the signed readiness check from any machine with Node 22 or later and
the repository checked out. Put the secret in the environment of this shell
only. Do not paste it into chat.

```sh
cd sites/ayurvedichealingvillage.com
AHV_FORM_RELAY_URL="$R" AHV_FORM_RELAY_SECRET='<from config.php>' AHV_FORM_RELAY_KEY_ID=k1 \
  node tools/forms/relay-health.mjs
```

The check exits 0 only when the relay answers, its signature verifies and it
reports `ready: true`. The report lists missing tables, columns and
`UNIQUE(submission_token)` / nonce keys (`submissionTokenUnique`,
`nonceUnique`: full-length single-column keys only). If anything is missing:

- `landing-page` table missing: apply `db/003-landing-page.sql`.
- OPD without an email address: apply `db/004-opd-optional-email.sql`.
  `health` does not check nullability, so apply it even when `health` is
  green.
- Any other missing column or unique index: **stop and ask**. Changing the live
  table contract is a data decision, not a deployment step.

## 7. Vercel Preview environment (never Production first)

Set these variables for the **Preview** environment of the AHV project only:

| Variable | Value |
|---|---|
| `AHV_FORM_RELAY_URL` | The HTTPS relay URL from step 1 |
| `AHV_FORM_RELAY_SECRET` | The key from step 4 |
| `AHV_FORM_RELAY_KEY_ID` | `k1` |
| `AHV_LEAD_SHEET_WEBHOOK_URL` | The Apps Script `/exec` URL (FORM-INTEGRATION-SETUP.md) |
| `AHV_LEAD_SHEET_WEBHOOK_SECRET` | The same value as the Script Property `AHV_LEAD_WEBHOOK_SECRET` |

Leave every `AHV_DB_*` variable unset. Redeploy the preview.

## 8. Activation evidence (receipt verification)

On the preview, submit one clearly labelled synthetic record per form type.
The form types are listed in FORM-INTEGRATION-SETUP.md, under "Activation
check".

For each submission, record this evidence:

- The browser receipt, as a screenshot.
- The same `submission_token` once in the MySQL table, once in the Sheet tab
  and once in `Main`.
- For careers forms, that the Drive link opens for an authorized user.

Remove the labelled rows only after the evidence is saved.

The agent cannot produce this evidence without the credentials above. It must
never claim delivery without it.

## 9. Rollback

- **Instant (website):** remove `AHV_FORM_RELAY_URL` or `AHV_FORM_RELAY_SECRET`
  from the Vercel environment and redeploy. Every form route returns to the
  truthful 503 before reading a body.
- **Relay:** delete `<web root>/ahv-form-relay/index.php`. Stored rows are
  untouched.
- **Key compromise:** replace the key in `config.php` and on Vercel. This
  invalidates every old signature at once.

## 10. Operating notes

- The error log gets one line per failure, `ahv-form-relay: <ExceptionClass>
  sqlstate=<code>`. It contains no SQL and no submitted values.
- The `ahv_relay_nonce` table purges itself. It keeps about one day of nonces.
- Rate limits:
  - 5 submissions per IP per table per 10 minutes. This is the same as before
    the relay.
  - 120 authenticated requests per minute in total. This is
    `max_requests_per_minute` in `config.php`.
