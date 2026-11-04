/**
 * Kairali.com Live Enquiries & Forms Receiver (Google Apps Script)
 *
 * Target Sheet: https://docs.google.com/spreadsheets/d/1eioiqTELEgrZIhSgjCguefIDVvAcExD2UEFRqc7t6Uk/edit
 *
 * Setup Instructions:
 * 1. Open the Google Sheet above.
 * 2. In the top menu, go to Extensions -> Apps Script.
 * 3. Delete any default code in Code.gs and paste this entire file.
 * 4. Click Deploy -> New deployment.
 * 5. Select type: "Web app".
 * 6. Execute as: "Me" (your Google account).
 * 7. Who has access: "Anyone".
 * 8. Click Deploy, authorize access, and copy the Web App URL (starts with https://script.google.com/macros/s/.../exec).
 * 9. Add that URL in Vercel environment variables as:
 *    FORM_SHEET_WEBHOOK_URL=<your-copied-url>
 */

function doPost(e) {
  try {
    var raw = e.postData ? e.postData.contents : null;
    if (!raw) {
      return ContentService.createTextOutput(JSON.stringify({ ok: false, error: "Empty body" })).setMimeType(ContentService.MimeType.JSON);
    }

    var payload = JSON.parse(raw);
    var ss = SpreadsheetApp.getActiveSpreadsheet();
    var sheet = ss.getActiveSheet();

    // Setup headers if sheet is brand new (row 1 is empty)
    if (sheet.getLastRow() === 0) {
      sheet.appendRow([
        "Timestamp (IST)",
        "Form Type",
        "Form Title",
        "Full Name",
        "Phone / Mobile",
        "Email",
        "Subject / Message",
        "All Submitted Fields (JSON)",
        "IP Address"
      ]);
      sheet.getRange(1, 1, 1, 9).setFontWeight("bold").setBackground("#EDE8DD");
    }

    var d = payload.data || {};
    var timestamp = payload.timestamp || Utilities.formatDate(new Date(), "Asia/Kolkata", "yyyy-MM-dd HH:mm:ss");
    var formId = payload.formId || "unknown";
    var formTitle = payload.formTitle || formId;
    var name = d["name"] || d["fullName"] || d["fname"] || d["full_name"] || "-";
    var phone = d["phone"] || d["mobile"] || d["contact"] || "-";
    var email = d["email"] || payload.replyTo || "-";
    var message = d["message"] || d["otherInfo"] || d["subject"] || d["enquiry"] || "-";
    var ip = payload.ip || "-";

    // Append lead row to sheet
    sheet.appendRow([
      timestamp,
      formId,
      formTitle,
      name,
      phone,
      email,
      message,
      JSON.stringify(d),
      ip
    ]);

    // Send email alert to info@kairali.com with developer CC
    try {
      var recipient = "info@kairali.com";
      var ccRecipient = "developer@kairali.com"; // Change to your exact email if needed
      var emailSubject = "New Website Lead: " + formTitle + " (" + name + ")";
      var emailBody = "New enquiry received on Kairali.com:\n\n" +
        "Date/Time: " + timestamp + "\n" +
        "Form: " + formTitle + " (" + formId + ")\n" +
        "Name: " + name + "\n" +
        "Phone: " + phone + "\n" +
        "Email: " + email + "\n" +
        "Message: " + message + "\n\n" +
        "Full Sheet: " + ss.getUrl() + "\n";

      MailApp.sendEmail({
        to: recipient,
        cc: ccRecipient,
        subject: emailSubject,
        body: emailBody
      });
    } catch (mailErr) {
      // Don't fail the sheet append if email sending encounters an error
      Logger.log("Mail send notice: " + mailErr);
    }

    return ContentService.createTextOutput(JSON.stringify({ ok: true, status: "appended" })).setMimeType(ContentService.MimeType.JSON);
  } catch (err) {
    return ContentService.createTextOutput(JSON.stringify({ ok: false, error: String(err) })).setMimeType(ContentService.MimeType.JSON);
  }
}
