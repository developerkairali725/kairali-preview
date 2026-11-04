/**
 * Kairali.com Lead Receiver & Google Sheet Database Bridge
 *
 * Database: spalabsdomain_kairali_com
 * Host: 165.22.220.165
 *
 * Automatically creates and organizes leads across 7 dedicated tabs matching database tables:
 * 1. All Enquiries (Master Overview)
 * 2. contact (Contact Form)
 * 3. enquiry-form (General Enquiries)
 * 4. online-consultation (Clinical & Ayurvedic Consultations)
 * 5. apply-now (Job & Career Applications)
 * 6. opd (OPD Clinic Appointments)
 * 7. landing-page (Campaign Landing Pages)
 * 8. exit-intent (Exit Popups & Surveys)
 *
 * Recipient: info@kairali.com
 * CC: developer@kairali.com
 */

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

function getOrCreateSheet(ss, name, headers) {
  var sheet = ss.getSheetByName(name);
  if (!sheet) {
    sheet = ss.insertSheet(name);
    sheet.appendRow(headers);
    sheet.getRange(1, 1, 1, headers.length).setFontWeight("bold").setBackground("#EDE8DD"); /* brand-allow: rogue-hex */
    sheet.setFrozenRows(1);
  } else if (sheet.getLastRow() === 0) {
    sheet.appendRow(headers);
    sheet.getRange(1, 1, 1, headers.length).setFontWeight("bold").setBackground("#EDE8DD"); /* brand-allow: rogue-hex */
    sheet.setFrozenRows(1);
  }
  return sheet;
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

    // Standard Universal Field Resolution (Case-Insensitive & Schema-Aware)
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

    var consent = getVal(d, payload, ["consent", "agree", "privacy_consent"], "yes");
    var leadUrl = getVal(d, payload, ["lead_source_url", "source_url", "url", "page"], "-");
    var referrer = getVal(d, payload, ["referrer", "ref"], "-");

    // =========================================================================
    // 1. MASTER SHEET: "All Enquiries" (Unified Live Overview)
    // =========================================================================
    var masterSheet = ss.getSheetByName("All Enquiries") || ss.getActiveSheet();
    if (masterSheet.getName() !== "All Enquiries" && ss.getSheets().length === 1) {
      masterSheet.setName("All Enquiries");
    } else {
      masterSheet = getOrCreateSheet(ss, "All Enquiries", [
        "ID", "Timestamp (IST)", "Form Type", "Form Title", "Full Name",
        "Phone / Mobile", "Email", "Country", "State", "City",
        "Subject / Programme", "Message", "IP Address", "All Fields (JSON)"
      ]);
    }

    if (masterSheet.getLastRow() === 0) {
      masterSheet.appendRow([
        "ID", "Timestamp (IST)", "Form Type", "Form Title", "Full Name",
        "Phone / Mobile", "Email", "Country", "State", "City",
        "Subject / Programme", "Message", "IP Address", "All Fields (JSON)"
      ]);
      masterSheet.getRange(1, 1, 1, 14).setFontWeight("bold").setBackground("#EDE8DD"); /* brand-allow: rogue-hex */
      masterSheet.setFrozenRows(1);
    }

    var masterId = Math.max(1, masterSheet.getLastRow());
    masterSheet.appendRow([
      masterId, timestamp, formId, formTitle, name,
      phone, email, country, state, city,
      subject, message, ip, JSON.stringify(d)
    ]);

    // =========================================================================
    // 2. DEDICATED TABLE TABS (100% Aligned with MySQL Database: spalabsdomain_kairali_com)
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
    } else if (formId === "landing" || formId.indexOf("landing") !== -1) {
      targetTab = "landing-page";
    } else if (formId === "exit" || formId.indexOf("exit") !== -1) {
      targetTab = "exit-intent";
    }

    if (targetTab === "contact") {
      var sheetContact = getOrCreateSheet(ss, "contact", [
        "ID", "Timestamp", "Site", "Full Name", "Phone", "Email", "Subject",
        "Country", "State", "City", "Message", "Consent", "Source URL", "Referrer", "IP Address"
      ]);
      sheetContact.appendRow([
        Math.max(1, sheetContact.getLastRow()), timestamp, "kairali.com", name, phone, email, subject,
        country, state, city, message, consent, leadUrl, referrer, ip
      ]);
    } else if (targetTab === "enquiry-form") {
      var sheetEnquiry = getOrCreateSheet(ss, "enquiry-form", [
        "ID", "Timestamp", "Site", "Form Type", "Full Name", "Phone", "Email", "Programme / Subject",
        "Country", "State", "City", "Message", "Consent", "Source URL", "Referrer", "IP Address"
      ]);
      sheetEnquiry.appendRow([
        Math.max(1, sheetEnquiry.getLastRow()), timestamp, "kairali.com", formId, name, phone, email, subject,
        country, state, city, message, consent, leadUrl, referrer, ip
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

      var sheetConsult = getOrCreateSheet(ss, "online-consultation", [
        "ID", "Timestamp", "First Name", "Last Name", "Full Name", "Email", "Phone", "Mobile",
        "Country", "State", "City", "Age", "Gender", "Marital Status", "Blood Pressure",
        "Weight", "Height", "Vegetarian", "Present Health Problems", "Main Complaint",
        "Medication", "IP Address", "Clinical Details (JSON)"
      ]);
      sheetConsult.appendRow([
        Math.max(1, sheetConsult.getLastRow()), timestamp, firstName, lastName, name, email, phone, phone,
        country, state, city, age, gender, maritalStatus, bloodPressure,
        weight, height, vegetarian, presentProblems, mainComplaint,
        medication, ip, JSON.stringify(d)
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

      var sheetApply = getOrCreateSheet(ss, "apply-now", [
        "ID", "Timestamp", "First Name", "Last Name", "Full Name", "Email", "Phone", "Mobile",
        "Post Applied For", "Job Reference Code", "Country", "State", "City",
        "Highest Qualification", "Experience (Years)", "Experience (Months)",
        "Current Organization", "Current Designation", "Current Location",
        "Resume / CV", "Cover Letter / Message", "IP Address"
      ]);
      sheetApply.appendRow([
        Math.max(1, sheetApply.getLastRow()), timestamp, firstName, lastName, name, email, phone, phone,
        post, jobRef, country, state, city,
        qualification, expYears, expMonths,
        currentOrg, currentDesig, currentLocation,
        resume, message, ip
      ]);
    } else if (targetTab === "opd") {
      var visitDate = getVal(d, payload, ["preferred_visit_date", "visitDate", "date"]);
      var symptoms = getVal(d, payload, ["symptoms", "Symptoms"]);
      var doctor = getVal(d, payload, ["preferred_doctor", "doctor", "Doctor"]);

      var sheetOpd = getOrCreateSheet(ss, "opd", [
        "ID", "Timestamp", "Full Name", "Phone", "Email", "Country", "State", "City",
        "Preferred Visit Date", "Symptoms", "Preferred Doctor", "Message", "IP Address"
      ]);
      sheetOpd.appendRow([
        Math.max(1, sheetOpd.getLastRow()), timestamp, name, phone, email, country, state, city,
        visitDate, symptoms, doctor, message, ip
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
