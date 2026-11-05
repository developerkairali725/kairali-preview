/**
 * Kairali.com Lead Receiver & Google Sheet Bridge
 *
 * Dedicated Tabs & Column Setup:
 * 1. All Enquiries (Master Overview)
 * 2. contact (Contact Form)
 * 3. enquiry-form (General Enquiries)
 * 4. online-consultation (Clinical & Ayurvedic Consultations)
 * 5. apply-now (Job & Career Applications)
 * 6. opd (OPD Clinic Appointments)
 *
 * Captures all standard fields PLUS attribution & marketing:
 * - utm_source
 * - utm_medium
 * - utm_campaign
 * - utm_content
 * - lead_source_url
 * - referrer
 *
 * Recipient: info@kairali.com
 * CC: developer@kairali.com
 */

var ALL_CANONICAL_HEADERS = {
  "All Enquiries": [
    "ID", "Timestamp (IST)", "Form Type", "Full Name",
    "Phone / Mobile", "Email", "Country", "State", "City",
    "Subject / Programme", "Message",
    "UTM Source", "UTM Medium", "UTM Campaign", "UTM Content",
    "Lead Source URL", "Referrer", "IP Address", "All Fields (JSON)"
  ],
  "contact": [
    "ID", "Timestamp", "Site", "Full Name", "Phone", "Email", "Subject",
    "Country", "State", "City", "Message",
    "UTM Source", "UTM Medium", "UTM Campaign", "UTM Content",
    "Lead Source URL", "Referrer", "IP Address"
  ],
  "enquiry-form": [
    "ID", "Timestamp", "Site", "Form Type", "Full Name", "Phone", "Email", "Programme / Subject",
    "Country", "State", "City", "Message",
    "UTM Source", "UTM Medium", "UTM Campaign", "UTM Content",
    "Lead Source URL", "Referrer", "IP Address"
  ],
  "online-consultation": [
    "ID", "Timestamp", "First Name", "Last Name", "Full Name", "Email", "Phone", "Mobile",
    "Country", "State", "City", "Age", "Gender", "Marital Status", "Blood Pressure",
    "Weight", "Height", "Vegetarian", "Present Health Problems", "Main Complaint",
    "Medication",
    "UTM Source", "UTM Medium", "UTM Campaign", "UTM Content",
    "Lead Source URL", "Referrer", "IP Address", "Clinical Details (JSON)"
  ],
  "apply-now": [
    "ID", "Timestamp", "First Name", "Last Name", "Full Name", "Email", "Phone", "Mobile",
    "Post Applied For", "Job Reference Code", "Country", "State", "City",
    "Highest Qualification", "Experience (Years)", "Experience (Months)",
    "Current Organization", "Current Designation", "Current Location",
    "Resume / CV", "Cover Letter / Message",
    "UTM Source", "UTM Medium", "UTM Campaign", "UTM Content",
    "Lead Source URL", "Referrer", "IP Address"
  ],
  "opd": [
    "ID", "Timestamp", "Full Name", "Phone", "Email", "Country", "State", "City",
    "Preferred Visit Date", "Symptoms", "Preferred Doctor", "Message",
    "UTM Source", "UTM Medium", "UTM Campaign", "UTM Content",
    "Lead Source URL", "Referrer", "IP Address"
  ]
};

function getVal(d, payload, keys, def) {
  def = def || "-";
  if (!keys) return def;
  for (var i = 0; i < keys.length; i++) {
    var k = keys[i];
    if (d && d[k] !== undefined && d[k] !== null && String(d[k]).trim() !== "") {
      return String(d[k]).trim();
    }
    if (payload && payload[k] !== undefined && payload[k] !== null && String(payload[k]).trim() !== "") {
      return String(payload[k]).trim();
    }
  }
  return def;
}

function alignHeadersAndGetSheet(ss, name, canonicalHeaders) {
  var sheet = ss.getSheetByName(name);
  if (!sheet) {
    sheet = ss.insertSheet(name);
    sheet.getRange(1, 1, 1, canonicalHeaders.length).setValues([canonicalHeaders]);
    sheet.getRange(1, 1, 1, canonicalHeaders.length).setFontWeight("bold").setBackground("#EDE8DD"); /* brand-allow: rogue-hex */
    sheet.setFrozenRows(1);
    return sheet;
  }

  // Check if Row 1 headers need update/alignment
  var currentLastCol = sheet.getLastColumn();
  var needsUpdate = false;
  if (currentLastCol < canonicalHeaders.length) {
    needsUpdate = true;
  } else {
    var currentHeaders = sheet.getRange(1, 1, 1, canonicalHeaders.length).getValues()[0];
    for (var i = 0; i < canonicalHeaders.length; i++) {
      if (currentHeaders[i] !== canonicalHeaders[i]) {
        needsUpdate = true;
        break;
      }
    }
  }

  if (needsUpdate) {
    sheet.getRange(1, 1, 1, canonicalHeaders.length).setValues([canonicalHeaders]);
    sheet.getRange(1, 1, 1, canonicalHeaders.length).setFontWeight("bold").setBackground("#EDE8DD"); /* brand-allow: rogue-hex */
    sheet.setFrozenRows(1);
  }

  return sheet;
}

/**
 * 1-Click Function to instantly format and repair Row 1 headers across ALL tabs.
 * Run this function from the Apps Script editor menu to immediately see all new columns!
 */
function REPAIR_ALL_SHEET_HEADERS() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  for (var tabName in ALL_CANONICAL_HEADERS) {
    var headers = ALL_CANONICAL_HEADERS[tabName];
    var sheet = ss.getSheetByName(tabName);
    if (!sheet) {
      sheet = ss.insertSheet(tabName);
    }
    sheet.getRange(1, 1, 1, headers.length).setValues([headers]);
    sheet.getRange(1, 1, 1, headers.length).setFontWeight("bold").setBackground("#EDE8DD"); /* brand-allow: rogue-hex */
    sheet.setFrozenRows(1);
  }
}

function doPost(e) {
  try {
    var raw = e.postData ? e.postData.contents : null;
    if (!raw) {
      return ContentService.createTextOutput(JSON.stringify({ ok: false, error: "Empty body" }))
        .setMimeType(ContentService.MimeType.JSON);
    }

    var payload = JSON.parse(raw);
    var d = payload.data || {};
    var ss = SpreadsheetApp.getActiveSpreadsheet();

    var timestamp = payload.timestamp || Utilities.formatDate(new Date(), "Asia/Kolkata", "yyyy-MM-dd HH:mm:ss");
    var formId = (payload.formId || "contact").toLowerCase();
    var formTitle = payload.formTitle || formId;
    var ip = payload.ip || "-";

    var firstName = getVal(d, payload, ["firstName", "fname", "First Name", "first_name"]);
    var lastName = getVal(d, payload, ["lastName", "lname", "Last Name", "last_name"]);
    var name = getVal(d, payload, [
      "name", "Name", "full_name", "fullName", "Full Name",
      "contact_name", "your_name"
    ]);
    if (name === "-" && firstName !== "-") {
      name = firstName + (lastName !== "-" ? " " + lastName : "");
    }

    var phone = getVal(d, payload, [
      "phone", "Phone", "Phone No", "Phone No.", "mobile", "Mobile",
      "contact", "phone_number", "contact_number", "tel"
    ]);

    var email = getVal(d, payload, [
      "email", "Email", "E-mail", "Email Id", "Email address",
      "replyTo", "email_id"
    ]);

    var country = getVal(d, payload, ["country", "Country"]);
    var state = getVal(d, payload, ["state", "State", "State or province", "province"]);
    var city = getVal(d, payload, ["city", "City"]);
    var subject = getVal(d, payload, ["subject", "Subject", "programme", "Program"]);
    if (subject === "-") subject = formTitle;

    var message = getVal(d, payload, [
      "message", "Message", "Your message", "enquiry", "comments",
      "presentProblems", "health_concern", "otherInfo", "cover_letter"
    ]);

    // Marketing & Attribution Parameters
    var utmSource = getVal(d, payload, ["utm_source", "source", "UTM Source"]);
    var utmMedium = getVal(d, payload, ["utm_medium", "medium", "UTM Medium"]);
    var utmCampaign = getVal(d, payload, ["utm_campaign", "campaign", "UTM Campaign"]);
    var utmContent = getVal(d, payload, ["utm_content", "content", "UTM Content"]);
    var utmTerm = getVal(d, payload, ["utm_term", "term", "UTM Term"]);
    var leadSourceUrl = getVal(d, payload, ["lead_source_url", "source_url", "url", "page", "Lead Source URL"]);
    var referrer = getVal(d, payload, ["referrer", "ref", "Referrer"]);

    // =========================================================================
    // 1. MASTER SHEET: "All Enquiries" (Exactly aligned to 19 columns)
    // =========================================================================
    var masterSheet = alignHeadersAndGetSheet(ss, "All Enquiries", ALL_CANONICAL_HEADERS["All Enquiries"]);
    var masterId = Math.max(1, masterSheet.getLastRow());

    masterSheet.appendRow([
      masterId, timestamp, formId, name,
      phone, email, country, state, city,
      subject, message,
      utmSource, utmMedium, utmCampaign, utmContent,
      leadSourceUrl, referrer, ip, JSON.stringify(d)
    ]);

    // =========================================================================
    // 2. DEDICATED TABS (Matching form type)
    // =========================================================================
    var targetTab = "contact";
    if (formId === "consultation" || formId.indexOf("consult") !== -1) {
      targetTab = "online-consultation";
    } else if (formId === "application" || formId.indexOf("apply") !== -1 || formId.indexOf("job") !== -1) {
      targetTab = "apply-now";
    } else if (formId === "enquiry" || formId === "general" || formId === "svata") {
      targetTab = "enquiry-form";
    } else if (formId === "opd") {
      targetTab = "opd";
    }

    if (targetTab === "contact") {
      var sheetContact = alignHeadersAndGetSheet(ss, "contact", ALL_CANONICAL_HEADERS["contact"]);
      sheetContact.appendRow([
        Math.max(1, sheetContact.getLastRow()), timestamp, "kairali.com", name, phone, email, subject,
        country, state, city, message,
        utmSource, utmMedium, utmCampaign, utmContent, leadSourceUrl, referrer, ip
      ]);
    } else if (targetTab === "enquiry-form") {
      var sheetEnquiry = alignHeadersAndGetSheet(ss, "enquiry-form", ALL_CANONICAL_HEADERS["enquiry-form"]);
      sheetEnquiry.appendRow([
        Math.max(1, sheetEnquiry.getLastRow()), timestamp, "kairali.com", formId, name, phone, email, subject,
        country, state, city, message,
        utmSource, utmMedium, utmCampaign, utmContent, leadSourceUrl, referrer, ip
      ]);
    } else if (targetTab === "online-consultation") {
      var age = getVal(d, payload, ["age", "Age"]);
      var gender = getVal(d, payload, ["gender", "Gender"]);
      var maritalStatus = getVal(d, payload, ["maritalStatus", "marital_status"]);
      var bloodPressure = getVal(d, payload, ["bloodPressure", "blood_pressure"]);
      var weight = getVal(d, payload, ["weight", "Weight"]);
      var height = getVal(d, payload, ["height", "Height"]);
      var vegetarian = getVal(d, payload, ["vegetarian", "Vegetarian"]);
      var presentProblems = getVal(d, payload, ["presentProblems", "health_concern", "Present Health Problems"]);
      var mainComplaint = getVal(d, payload, ["mainComplaint", "Main Complaint"]);
      var medication = getVal(d, payload, ["medication", "Medication"]);

      var sheetConsult = alignHeadersAndGetSheet(ss, "online-consultation", ALL_CANONICAL_HEADERS["online-consultation"]);
      sheetConsult.appendRow([
        Math.max(1, sheetConsult.getLastRow()), timestamp, firstName, lastName, name, email, phone, phone,
        country, state, city, age, gender, maritalStatus, bloodPressure,
        weight, height, vegetarian, presentProblems, mainComplaint,
        medication,
        utmSource, utmMedium, utmCampaign, utmContent, leadSourceUrl, referrer,
        ip, JSON.stringify(d)
      ]);
    } else if (targetTab === "apply-now") {
      var post = getVal(d, payload, ["post", "post_applied_for", "Post Applied for"]);
      var jobRef = getVal(d, payload, ["jobRef", "job_reference_code", "Job Reference Code"]);
      var qualification = getVal(d, payload, ["qualification", "highest_qualification", "Highest Qualification"]);
      var expYears = getVal(d, payload, ["expYears", "experience_years", "Total Experience — years"]);
      var expMonths = getVal(d, payload, ["expMonths", "experience_months"]);
      var currentOrg = getVal(d, payload, ["currentOrganization", "current_organization"]);
      var currentDesig = getVal(d, payload, ["currentDesignation", "current_designation"]);
      var currentLocation = getVal(d, payload, ["currentLocation", "current_location"]);
      var resume = getVal(d, payload, ["cv", "resume", "resume_url", "cv_file"]);

      var sheetApply = alignHeadersAndGetSheet(ss, "apply-now", ALL_CANONICAL_HEADERS["apply-now"]);
      sheetApply.appendRow([
        Math.max(1, sheetApply.getLastRow()), timestamp, firstName, lastName, name, email, phone, phone,
        post, jobRef, country, state, city,
        qualification, expYears, expMonths,
        currentOrg, currentDesig, currentLocation,
        resume, message,
        utmSource, utmMedium, utmCampaign, utmContent, leadSourceUrl, referrer, ip
      ]);
    } else if (targetTab === "opd") {
      var visitDate = getVal(d, payload, ["preferred_visit_date", "visitDate", "date"]);
      var symptoms = getVal(d, payload, ["symptoms", "Symptoms"]);
      var doctor = getVal(d, payload, ["preferred_doctor", "doctor", "Doctor"]);

      var sheetOpd = alignHeadersAndGetSheet(ss, "opd", ALL_CANONICAL_HEADERS["opd"]);
      sheetOpd.appendRow([
        Math.max(1, sheetOpd.getLastRow()), timestamp, name, phone, email, country, state, city,
        visitDate, symptoms, doctor, message,
        utmSource, utmMedium, utmCampaign, utmContent, leadSourceUrl, referrer, ip
      ]);
    }

    // =========================================================================
    // 3. EMAIL ALERT: info@kairali.com with developer@kairali.com CC
    // =========================================================================
    try {
      var locationStr = [city, state, country].filter(function(x) { return x && x !== "-"; }).join(", ") || "-";
      var emailSubject = "New Website Lead: " + formTitle + " (" + name + ")";
      var emailBody = "New enquiry received on Kairali.com:\n\n" +
        "Form: " + formTitle + " (" + formId + ")\n" +
        "Name: " + name + "\n" +
        "Phone: " + phone + "\n" +
        "Email: " + email + "\n" +
        "Location: " + locationStr + "\n" +
        "Subject / Programme: " + subject + "\n" +
        "Message / Enquiry:\n" + message + "\n\n" +
        "--- Attribution & Marketing Details ---\n" +
        "Lead Source URL: " + leadSourceUrl + "\n" +
        "UTM Source: " + utmSource + "\n" +
        "UTM Medium: " + utmMedium + "\n" +
        "UTM Campaign: " + utmCampaign + "\n" +
        "UTM Content: " + utmContent + "\n" +
        "Referrer: " + referrer + "\n\n" +
        "---\n" +
        "View in Google Sheet:\n" + ss.getUrl() + "\n";

      MailApp.sendEmail({
        to: "info@kairali.com",
        cc: "developer@kairali.com",
        subject: emailSubject,
        body: emailBody
      });
    } catch (mailErr) {
      Logger.log("Email notification error: " + mailErr);
    }

    return ContentService.createTextOutput(JSON.stringify({
      ok: true,
      status: "appended_database_aligned",
      tab: targetTab,
      name: name,
      email: email
    })).setMimeType(ContentService.MimeType.JSON);

  } catch (err) {
    return ContentService.createTextOutput(JSON.stringify({
      ok: false,
      error: String(err)
    })).setMimeType(ContentService.MimeType.JSON);
  }
}
