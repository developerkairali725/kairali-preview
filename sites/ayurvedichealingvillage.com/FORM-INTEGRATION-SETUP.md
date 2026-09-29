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

Newsletter submissions remain on their separate existing route, which stays
fail-closed (503, body never read) until a newsletter consent model is ruled —
see "Approval holds" below.

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
- Newsletter: the approved design (forms recommendations) specifies double
  opt-in with a `pending_confirmation` result, confirmation and unsubscribe
  routes. The earlier single-opt-in MySQL/Sheet newsletter change is **held**
  as a consent-logic change (HARD GATE 11) until the owner rules on it; the
  newsletter route stays fail-closed meanwhile.
- CRM/inbox forwarding remains unconfigured until its endpoint and credentials
  are supplied through an approved secure channel.
