/**
 * AHV footer newsletter Sheet receiver.
 *
 * Install this on the newsletter spreadsheet
 * (https://docs.google.com/spreadsheets/d/1e4VOLp34MKfSuCx2APEzmk7NlDaoQ2TdksEym07y5KE):
 *
 *   1. Open the Sheet → Extensions → Apps Script.
 *   2. Replace the contents of Code.gs with this file, and Save.
 *   3. Deploy → New deployment → type "Web app".
 *        Execute as:        Me
 *        Who has access:    Anyone
 *      "Anyone" is what lets the website POST to it. The URL is unguessable and
 *      the script only ever appends rows — it reads nothing back out.
 *   4. Copy the /exec URL and set it as AHV_NEWSLETTER_SHEET_WEBHOOK_URL on the
 *      Vercel project for ayurvedichealingvillage.com.
 *
 * After changing this file you must Deploy → Manage deployments → Edit → New
 * version. Saving alone does not update the live /exec URL.
 *
 * ## Columns follow the Sheet, not this script
 *
 * Row 1 is the header row and it is the contract. Each incoming field is placed
 * under the header whose name matches it. A field with no matching header is
 * simply not written, and a header with no matching field is left blank.
 *
 * Header row for this Sheet:
 *
 *   Email | Time | Page URL
 *
 * ("Time" is the server's submit time, ISO 8601; "Page URL" is the page the
 * visitor signed up from.)
 *
 * ## Sending twice does not create two rows
 *
 * The newsletter table has one row per subscriber (email is unique there), so
 * this dedupes by Email rather than by a separate id: a repeat signup with the
 * same email is acknowledged without appending a second line.
 */

var SHEET_NAME = 'Sheet1';

function doPost(request) {
  try {
    var payload = JSON.parse(request.postData.contents);
    if (payload.verification !== 'AHV_NEWSLETTER') return respond({ result: 'error', message: 'unrecognised sender' });

    var lock = LockService.getScriptLock();
    lock.waitLock(20000);
    try {
      var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(SHEET_NAME)
        || SpreadsheetApp.getActiveSpreadsheet().getSheets()[0];
      var headers = sheet.getRange(1, 1, 1, Math.max(1, sheet.getLastColumn())).getValues()[0];
      if (!headers.length || !headers[0]) {
        headers = ['Email', 'Time', 'Page URL'];
        sheet.getRange(1, 1, 1, headers.length).setValues([headers]);
      }

      var email = String(payload.Email || '');
      if (email && alreadyPresent(sheet, headers, email)) {
        return respond({ result: 'success', email: email, duplicate: true });
      }

      var row = headers.map(function (header) {
        var key = String(header).trim();
        return Object.prototype.hasOwnProperty.call(payload, key) ? payload[key] : '';
      });
      sheet.appendRow(row);
      return respond({ result: 'success', email: email });
    } finally {
      lock.releaseLock();
    }
  } catch (error) {
    return respond({ result: 'error', message: String(error) });
  }
}

/** True when this email already has a row. */
function alreadyPresent(sheet, headers, email) {
  var column = headers.indexOf('Email') + 1;
  if (column < 1) return false;
  var rows = sheet.getLastRow() - 1;
  if (rows < 1) return false;
  var existing = sheet.getRange(2, column, rows, 1).getValues();
  for (var i = 0; i < existing.length; i++) {
    if (String(existing[i][0]).toLowerCase() === email.toLowerCase()) return true;
  }
  return false;
}

function respond(body) {
  return ContentService.createTextOutput(JSON.stringify(body)).setMimeType(ContentService.MimeType.JSON);
}

function doGet() {
  return respond({ result: 'error', message: 'This endpoint accepts POST only.' });
}
