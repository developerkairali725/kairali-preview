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

### 3b. Newsletter tables (double opt-in) — only when activating the newsletter

Run `newsletter-tables.sql` as the MySQL admin. It creates only the three
dedicated newsletter tables (`ahv_newsletter_subscriber`,
`ahv_newsletter_confirmation`, `ahv_newsletter_limit`) and never touches a
lead table. It is idempotent. Then grant the relay user exactly this:

```sql
GRANT SELECT, INSERT, UPDATE ON `ktahv_ayurvedic_healing_village`.`ahv_newsletter_subscriber`           TO 'ahv_relay'@'localhost';
GRANT SELECT, INSERT, UPDATE, DELETE ON `ktahv_ayurvedic_healing_village`.`ahv_newsletter_confirmation` TO 'ahv_relay'@'localhost';
GRANT SELECT, INSERT, UPDATE, DELETE ON `ktahv_ayurvedic_healing_village`.`ahv_newsletter_limit`        TO 'ahv_relay'@'localhost';
```

The rules behind these grants:

- `UPDATE` is granted on the newsletter tables only. The lead tables stay
  SELECT/INSERT.
- On the limit table, `UPDATE` is also what the atomic counter upsert
  (`INSERT … ON DUPLICATE KEY UPDATE`) needs.
- `DELETE` is used only for housekeeping: never-used confirmation rows that
  expired more than 30 days ago, and limit rows older than 2 days.
- The confirmation table stores tokens only as a SHA-256 hash plus an
  AES-256-GCM seal whose key lives only on Vercel. A database reader cannot
  recover a working confirmation link.
- On cPanel, if grants cannot be made per table, record the fallback in the
  activation evidence, as in step 3.

Upload the updated `relay-core.php` and `lead-schema.json` (step 2) before the
website is configured for the newsletter.

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
duplicate-rejecting keys on `submission_token` and `nonce`
(`submissionTokenUnique`, `nonceUnique`: full-length single-column keys only). If anything is missing:

- `landing-page` table missing: apply `db/003-landing-page.sql`.
- OPD without an email address: apply `db/004-opd-optional-email.sql`.
  `health` does not check nullability, so apply it even when `health` is
  green.
- The report also prints `newsletter.ready`. It does not affect the exit code.
  Configure the newsletter variables (step 7b) only when it is `true`. If it
  is `false`, apply `newsletter-tables.sql` (step 3b).
- Any other missing column or duplicate-rejecting key: **stop and ask**. Changing the live
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

### 7b. Newsletter (double opt-in) — separate activation

The newsletter stays on its truthful 503 until ALL of these are set as well.
Its mail sender is set up in FORM-INTEGRATION-SETUP.md, section "Newsletter
double opt-in".

| Variable | Value |
|---|---|
| `AHV_NEWSLETTER_MAIL_PROVIDER` | `apps-script`, the only adapter in the codebase. Any other value keeps the 503. |
| `AHV_NEWSLETTER_MAIL_WEBHOOK_URL` | The newsletter-mail Apps Script `/exec` URL. This is not the lead-Sheet one. |
| `AHV_NEWSLETTER_MAIL_WEBHOOK_SECRET` | The same value as that script's `AHV_NEWSLETTER_MAIL_SECRET`, at least 32 characters |
| `AHV_NEWSLETTER_PUBLIC_ORIGIN` | The https origin of the deployment the emailed links must open, e.g. the preview's origin. It must have no path, and it is never inferred from the request. |
| `AHV_NEWSLETTER_LINK_SECRET` | A random value of at least 32 characters (`openssl rand -base64 48`). It authenticates unsubscribe links, and rotating it invalidates every issued link. |
| `AHV_NEWSLETTER_OUTBOX_KEY` | A random value of at least 32 characters, different from the link secret. It seals confirmation tokens stored in the outbox. Rotating it only stops the worker re-sending jobs sealed under the old key; their links keep working. |
| `CRON_SECRET` | A random value of at least 32 characters. It authenticates the outbox worker `GET /api/newsletter/outbox`, and Vercel Cron sends it as `Authorization: Bearer …`. |

The relay variables from step 7 are required too.

The outbox worker needs an invocation mechanism. Vercel Cron runs only on
Production deployments; adding a `crons` entry will not schedule a Preview
worker. See https://vercel.com/docs/cron-jobs.

For Preview acceptance, after backend activation, invoke the existing worker
manually with the Preview `CRON_SECRET`, using the exact protected Preview
origin and its normal authorized access mechanism. Keep deployment protection
and worker bearer authentication enabled. Record the deployment identity,
invocation time, HTTP status and count-only response. Wait the actual
`retryDelaySeconds` before retrying a pending job. This proves a bounded
worker invocation and recovery, not recurring scheduler operation. Do not
promote a deployment to obtain a scheduler.

For eventual authorized Production release, configure and verify a scheduled
trigger separately. Confirm the project plan supports the selected frequency
and verify the route returns directly without a redirect. This configuration
is NOT made here. An example Vercel cron entry for the AHV project is:

```json
{ "crons": [{ "path": "/api/newsletter/outbox", "schedule": "*/10 * * * *" }] }
```

The schedule is a proposal, not a ruled value. Without the trigger, signup
still never claims an email it did not send. It answers
`pending_confirmation` only on a signed provider acceptance. Jobs whose inline
send crashed or ended uncertain simply wait until someone runs the worker
(`curl -H "Authorization: Bearer $CRON_SECRET" <origin>/api/newsletter/outbox`).

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

For the newsletter, record this evidence end to end with a clearly labelled
synthetic mailbox that you control:

1. The browser shows "Check your email". Screenshot it.
2. `ahv_newsletter_subscriber` has the row with `status = pending` and no
   consent evidence yet.
3. The confirmation email arrives from `info@kairali.com`. Screenshot its
   headers, without the link token.
4. Opening the link shows the Confirm page, and the row is still pending.
5. Pressing Confirm sets the row to `status = confirmed`, with `confirmed_at`
   and the consent version, text, locale and source path.
6. Using the Unsubscribe link from the result page sets
   `status = unsubscribed` and `suppressed = 1`.
7. Signing up again with the same address leaves the row suppressed until the
   new link is confirmed.
8. Outbox: temporarily point the mail webhook at an unreachable URL, sign up,
   and expect "could not confirm that the confirmation email was sent". Then
   restore the URL, wait `retryDelaySeconds`, trigger the worker, and confirm
   the SAME link arrives once. Record the worker's count-only JSON.

Remove the labelled rows only after the evidence is saved.

The agent cannot produce this evidence without the credentials above. It must
never claim delivery without it.

## 9. Rollback

- **Instant (website):** remove `AHV_FORM_RELAY_URL` or `AHV_FORM_RELAY_SECRET`
  from the Vercel environment and redeploy. Every form route returns to the
  truthful 503 before reading a body.
- **Newsletter only:** remove `AHV_NEWSLETTER_MAIL_PROVIDER` and redeploy.
  The signup, confirm, unsubscribe and outbox routes return to the truthful
  503. Stored subscribers and suppressions are untouched.
- **Relay:** delete `<web root>/ahv-form-relay/index.php`. Stored rows are
  untouched.
- **Key compromise:** replace the key in `config.php` and on Vercel. This
  invalidates every old signature at once.

## 10. Operating notes

- The error log gets one line per failure, `ahv-form-relay: <ExceptionClass>
  sqlstate=<code>`. It contains no SQL and no submitted values.
- The `ahv_relay_nonce` table purges itself. It keeps about one day of nonces.
- Rate limits:
  - Newsletter, from `lead-schema.json` `newsletter.limits`:
    - 10 signups per IP per hour.
    - 5 per address per day.
    - At most 3 confirmation emails per address per day.
    - No resend within 120 s of an accepted one.
    - All newsletter limits are fixed-window counters, locked per key, so
      they are atomic under concurrency.
  - Newsletter outbox, from `newsletter.outbox`:
    - The inline lease is 120 s.
    - An uncertain send is retried after 600 s.
    - A job is tried at most 5 times.
    - The worker claims up to 10 jobs per run.
  - 5 submissions per IP per table per 10 minutes. This is the same as before
    the relay.
  - 120 authenticated requests per minute in total. This is
    `max_requests_per_minute` in `config.php`.
