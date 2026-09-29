# AHV form integration activation

This site stores each accepted submission in the scoped MySQL database first,
then mirrors the stored database row to the target Google Sheet. The website
never connects to MySQL: the database endpoint has no TLS, so every write goes
through the HMAC-signed HTTPS relay on the database host
(`bridge/form-relay/`, protocol in `SPEC.md`, deployment in `RUNBOOK.md`). Application
files are uploaded to the approved Drive folder and their Drive URLs are stored
in both destinations.

## Fixed destinations

- Database: `ktahv_ayurvedic_healing_village`
- Sheet: `1z3sN5rbYl18ECQXzNRTUdO4IuJQ2rXxX7RMDiqJDa54`
- Application file folder: `1GQS5u-y33Io8i7ofgvHczrJGB1j0-AlO`

Newsletter signups use their own route and their own audience. The approved
consent model is **double opt-in**; see "Newsletter double opt-in" below. The
route stays fail-closed (503, body never read) until its storage and
confirmation-mail settings are configured.

## Apps Script

1. Open the target Sheet and choose **Extensions → Apps Script**.
2. Replace `Code.gs` with `scripts/apps-script/lead-sheet.gs`.
3. In **Project Settings → Script Properties**, add
   `AHV_LEAD_WEBHOOK_SECRET` with a random value of at least 24 characters.
4. Deploy a new Web app version:
   - Execute as: the Sheet/Drive owner
   - Who has access: Anyone
5. Copy the deployed `/exec` URL.
6. Run `diagnoseApplicationFolderAccess()` manually. It must report
   `writable: true` and `privateFileSupported: true`. The function creates a
   probe file and immediately moves it to trash. If it fails while creating the
   probe, grant the reported `effectiveUser` Editor access to the application
   folder, authorize Drive again, and deploy another Web app version.

Before accepting real applications, change the Drive folder's sharing from
link-public to **Restricted**. The Web app runs as its owner and can still add
files. Stored Drive links remain usable by authorized Drive users.

## Runtime variables

Configure these only in the intended **Preview** environment first:

```text
AHV_FORM_RELAY_URL=<https:// URL of the relay — http:// is refused>
AHV_FORM_RELAY_SECRET=<same key as config.php keys[k1], >= 32 characters>
AHV_FORM_RELAY_KEY_ID=k1
AHV_LEAD_SHEET_WEBHOOK_URL=<the deployed Apps Script /exec URL>
AHV_LEAD_SHEET_WEBHOOK_SECRET=<same value as the Script Property>
```

With any of them missing or unsafe, `/api/lead/` and `/api/application-upload/`
answer a truthful 503 (`*_NOT_CONFIGURED`, "nothing has been saved") before
the request body is read, and the forms show their existing "being connected"
notice. There is no fake success in any state.

The earlier direct-connection variables (`AHV_DB_HOST`, `AHV_DB_PORT`,
`AHV_DB_NAME`, `AHV_DB_USER`, `AHV_DB_PASSWORD`, `AHV_DB_SSL`, `AHV_DB_SSL_CA`)
are no longer read by any code and must stay unset on Vercel. The repository
contains no switch that weakens database transport: no plain-HTTP relay, no
TLS-verification opt-out, no redirect following, no direct-database fallback.

Relay deployment on the database host (one-time, needs host credentials):
follow `bridge/form-relay/RUNBOOK.md` end to end, including the signed
readiness check `node tools/forms/relay-health.mjs`, before setting the
variables above.

## Activation check

Use a preview deployment and submit one labelled test record for each form:

- contact
- enquiry-form
- apply-now careers form with photo and resume
- job-detail application with CV
- online-consultation
- OPD without an email address
- one legacy `.html` landing page
- one `/lp/` landing page

For each test, verify the same `submission_token` appears once in the correct
MySQL table, once in the same-named Sheet tab, and once in `Main`. Verify each
application URL opens the expected file for an authorized Drive user. Remove
the labelled test records only after recording the evidence.

Every successful non-newsletter form response also supplies the current final
`Healing Secrets` download from `public/documents/manifest.json`, selected from
the page's current language. The browser starts that same-origin PDF download
only after both database and Sheet acknowledgement succeed. Newsletter capture
does not trigger the guide.

## Newsletter double opt-in

The newsletter is the approved double opt-in design from the forms
recommendations. It is implemented in `lib/newsletter*.ts`,
`app/api/newsletter/**` and the relay ops `newsletter.*` (see
`bridge/form-relay/SPEC.md`, section "Newsletter").

It is kept apart from the lead forms in these ways:

- It is a separate email-only audience with its own three database tables.
- It never touches the lead tables, the lead Sheet or `Main`.
- It never triggers the Healing Secrets guide.
- It adds no tracking event and changes no consent UI.

The lifecycle:

1. The footer form posts `{email, consentVersion, sourcePath}` to
   `/api/newsletter`. The server checks the request size and type, validates
   the address, accepts only a known consent version, and accepts only a
   same-site relative source path. The source path is never used as a
   redirect.
2. The relay stores a **pending** subscriber (one per address) and a
   durable, **recoverable** confirmation-mail job (the outbox). The job holds
   the SHA-256 of a random single-use token, plus the token sealed with
   AES-256-GCM under a key that exists only on Vercel. The token expires
   after 48 hours.
3. The confirmation email goes out from `info@kairali.com`. The browser sees
   "Check your email" only after the provider signs an acceptance of THIS
   job.
   - A signed refusal answers `502 CONFIRMATION_MAIL_FAILED` ("not subscribed
     yet") and revokes that token.
   - An uncertain outcome (timeout, network error, unverifiable reply) answers
     `502 CONFIRMATION_MAIL_UNCERTAIN` ("could not confirm that the email was
     sent"). The token stays valid, because the email may have arrived.
   - The outbox worker (`GET /api/newsletter/outbox`, triggered by cron with
     `CRON_SECRET`) re-sends uncertain jobs, and jobs whose request crashed
     after saving, with the SAME link.
   - A repeat signup is neutral only when the address is confirmed or an
     accepted email is recent. It never is when a job is merely queued.
   - Delivery is at-least-once. Duplicates are suppressed by idempotency keys
     and the sender's journal, but exactly-once is not claimed.
4. The emailed link opens a Confirm page. Opening it changes nothing, so mail
   scanners are harmless. Pressing **Confirm subscription** consumes the token
   atomically. Only then are these recorded: the consent version, the exact
   English permission text shown beside the form, the display locale, the
   source path, and `confirmed_at`. Expired, used and tampered links get one
   neutral "no longer valid" page.
5. The confirmation page links an authenticated, opaque unsubscribe URL. It
   also works as an RFC 8058 one-click POST. Unsubscribing suppresses the
   address immediately and idempotently. Suppression survives retries,
   resends and re-imports. Only a fresh signup plus a fresh confirmation
   lifts it.
6. Abuse limits are enforced server-side in the database. They are atomic
   counters with one locked row per IP or address, proven under parallel
   load on MySQL:
   - 10 signups per IP per hour.
   - 5 per address per day.
   - 3 confirmation emails per address per day.
   - No resend within 120 s.

No email, token or secret is written to a log, a URL (except the opaque
token), analytics or browser storage.

### Confirmation-mail sender (Apps Script)

1. Create a **new** Apps Script project. Do not use the lead-Sheet project.
   It must be owned by the account that is `info@kairali.com`, or by an
   account that has `info@kairali.com` as a verified Gmail "Send mail as"
   address. The script refuses to send from any other address and never
   substitutes one.
2. Paste `scripts/apps-script/newsletter-mail.gs`.
3. In **Script Properties**, set `AHV_NEWSLETTER_MAIL_SECRET` to a random
   value of at least 32 characters.
4. Run `diagnoseNewsletterSender()`. It must report `senderAvailable: true`
   and `secretConfigured: true`. It sends nothing.
5. Deploy it as a Web app. Execute as: the owner. Who has access: Anyone.
   Copy the `/exec` URL.

The sender keeps a durable journal in Script Properties, one entry per job.
It writes `sending` before `GmailApp.sendEmail` and `accepted` after it
returns, so it never marks a job accepted before sending. A repeated job
behaves like this:

- If the journal says `accepted`, the repeat is acknowledged without a second
  email.
- If the journal says `sending`, the script searches the account's Sent mail
  for the job reference that every email carries. If found, the job is
  acknowledged. If not found, the answer is "unknown" for 10 minutes, and
  after that the email is sent again (at-least-once).
- Every reply is HMAC-signed and bound to the request nonce and job key.
- A refusal is signed only when nothing was sent.

### Newsletter runtime variables (Preview first)

```text
AHV_NEWSLETTER_MAIL_PROVIDER=apps-script
AHV_NEWSLETTER_MAIL_WEBHOOK_URL=<the newsletter-mail Apps Script /exec URL>
AHV_NEWSLETTER_MAIL_WEBHOOK_SECRET=<same value as AHV_NEWSLETTER_MAIL_SECRET>
AHV_NEWSLETTER_PUBLIC_ORIGIN=<https origin the emailed links must open, no path>
AHV_NEWSLETTER_LINK_SECRET=<random, >= 32 characters>
AHV_NEWSLETTER_OUTBOX_KEY=<random, >= 32 characters, different from the link secret>
CRON_SECRET=<random, >= 32 characters; outbox worker bearer token>
```

The outbox worker needs an invocation mechanism for `/api/newsletter/outbox`.
Vercel Cron runs only on Production deployments, so Preview acceptance uses
an authorized manual invocation after backend activation, with the Preview
`CRON_SECRET` and normal deployment-protection access. Record the exact
Preview deployment, time, HTTP status and count-only response. Manual recovery
does not prove recurring scheduling. RUNBOOK.md step 7b separates these
Preview checks from eventual authorized Production scheduler configuration;
no scheduler or production deployment is created here.

The relay variables above are required too. Before setting these variables,
apply the database tables: `bridge/form-relay/newsletter-tables.sql` and the
grants in RUNBOOK.md step 3b. With any value missing or unsafe, every
newsletter route answers 503 before reading a body.

Newsletter activation evidence (RUNBOOK.md step 8) needs a synthetic mailbox
you control. No agent has sent a real confirmation email, and no delivery has
been verified.

Confirm/unsubscribe pages and the email are English source strings
(`lib/newsletter-copy.ts`, listed in `l10n/source/ui-strings.json`). They are
served in a locale once the localization pipeline has accepted translations
for them.

## Approval holds

- Exit intent remains inactive. Its offer and clinical copy require separate
  approval before any trigger is added. (`/api/lead/` accepts the
  `exit-intent` table so the Sheet/DB contract is ready; nothing on the site
  posts to it.)
- Receipt copy: the earlier hold "awaiting Abhilash receipt-copy review" is
  superseded by the owner's later all-inputs-complete authority (29 Sep 2026
  coordinator note); it is not re-asked. The receipts are factual
  ("Thank you — your details have been received.") and, in the translated
  design views, ship as new units for the next localization round.
- Newsletter: the approved double opt-in is implemented (section "Newsletter
  double opt-in" above). It fails closed until configured, and no delivery has
  been verified. The earlier single-opt-in MySQL/Sheet newsletter change was
  never adopted and stays out: it would be a consent-logic change (HARD
  GATE 11). A newsletter Sheet mirror is not built. If one is ever added, it
  must be purpose-specific, and a pending row must never imply marketing
  consent.
- CRM/inbox forwarding remains unconfigured until its endpoint and credentials
  are supplied through an approved secure channel.
