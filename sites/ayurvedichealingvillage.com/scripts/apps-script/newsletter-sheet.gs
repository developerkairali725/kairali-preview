/**
 * AHV footer newsletter Sheet receiver.
 *
 * Install this on the newsletter spreadsheet
 * (https://docs.google.com/spreadsheets/d/1e4VOLp34MKfSuCx2APEzmk7NlDaoQ2TdksEym07y5KE):
 *
 *   1. Open the Sheet → Extensions → Apps Script.
 *   2. Replace the contents of Code.gs with this file, and Save.
 *   3. Deploy → Manage deployments → Edit (pencil icon) → Version: New version → Deploy.
 *      (If there is no existing deployment yet: Deploy → New deployment → type "Web app",
 *      Execute as: Me, Who has access: Anyone.)
 *   4. Set the /exec URL as AHV_NEWSLETTER_SHEET_WEBHOOK_URL on Vercel.
 *
 * ## Columns follow the Sheet, not this script — and are matched case-insensitively
 *
 * Row 1 is the header row and it is the contract. Matching ignores case, so an
 * existing "email" header (lowercase) is recognised as the Email column and is
 * never touched or duplicated. Any of Email / Time / "Page URL" that the header
 * row does not already have is appended as a new column, after whatever is
 * already there — an existing column and its data are never moved or renamed.
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
var WANTED = ['Email', 'Time', 'Page URL'];

function norm(value) {
  return String(value == null ? '' : value).trim().toLowerCase();
}

/** Reads row 1, adds whichever of WANTED it is missing (appended after
 * whatever headers already exist), and returns the up-to-date header row. */
function ensureHeaders(sheet) {
  var lastCol = Math.max(1, sheet.getLastColumn());
  var headers = sheet.getRange(1, 1, 1, lastCol).getValues()[0];
  if (!headers.length || !headers.some(function (h) { return norm(h); })) {
    sheet.getRange(1, 1, 1, WANTED.length).setValues([WANTED]);
    return WANTED.slice();
  }
  var have = headers.map(norm);
  var missing = WANTED.filter(function (w) { return have.indexOf(norm(w)) === -1; });
  if (missing.length) {
    sheet.getRange(1, headers.length + 1, 1, missing.length).setValues([missing]);
    headers = headers.concat(missing);
  }
  return headers;
}

/** payload key for a given header, matched case-insensitively against the
 * three fields this script ever sends. */
function payloadKeyFor(header) {
  var byNorm = { email: 'Email', time: 'Time', 'page url': 'Page URL' };
  return byNorm[norm(header)] || String(header).trim();
}

function doPost(request) {
  try {
    var payload = JSON.parse(request.postData.contents);
    if (payload.verification !== 'AHV_NEWSLETTER') return respond({ result: 'error', message: 'unrecognised sender' });

    var lock = LockService.getScriptLock();
    lock.waitLock(20000);
    try {
      var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(SHEET_NAME)
        || SpreadsheetApp.getActiveSpreadsheet().getSheets()[0];
      var headers = ensureHeaders(sheet);
      var emailCol = headers.findIndex(function (h) { return norm(h) === 'email'; }) + 1;

      var email = String(payload.Email || '');
      if (email && emailCol > 0 && alreadyPresent(sheet, emailCol, email)) {
        return respond({ result: 'success', email: email, duplicate: true });
      }

      var row = headers.map(function (header) {
        var key = payloadKeyFor(header);
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

/** True when this email already has a row, checked in the given column. */
function alreadyPresent(sheet, column, email) {
  var rows = sheet.getLastRow() - 1;
  if (rows < 1) return false;
  var existing = sheet.getRange(2, column, rows, 1).getValues();
  for (var i = 0; i < existing.length; i++) {
    if (norm(existing[i][0]) === norm(email)) return true;
  }
  return false;
}

function respond(body) {
  return ContentService.createTextOutput(JSON.stringify(body)).setMimeType(ContentService.MimeType.JSON);
}

function doGet() {
  return respond({ result: 'error', message: 'This endpoint accepts POST only.' });
}
