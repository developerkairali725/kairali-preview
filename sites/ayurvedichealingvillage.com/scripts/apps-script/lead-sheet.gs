/**
 * AHV MySQL-to-Sheet receiver and private application-file uploader.
 *
 * Target Sheet: Copy of API - KTAHV New Website Online Enquiry - API Database
 * Target Drive folder: KTAHV-candidate-resume-photo
 *
 * Before deployment, set Script Property AHV_LEAD_WEBHOOK_SECRET to the same
 * random value used by the website's AHV_LEAD_SHEET_WEBHOOK_SECRET variable.
 * Deploy as a Web app, execute as the owner, access Anyone. The shared secret
 * authenticates every server-to-server request.
 */

var TARGET_SHEET_ID = '1z3sN5rbYl18ECQXzNRTUdO4IuJQ2rXxX7RMDiqJDa54';
var APPLICATION_FOLDER_ID = '1GQS5u-y33Io8i7ofgvHczrJGB1j0-AlO';
var MAIN_SHEET_NAME = 'Main';
var MAX_FILE_BYTES = 4 * 1024 * 1024;

var TRACKING_COLUMNS = [
  'source', 'campaign', 'medium', 'gclid', 'fbclid',
  'utm_source', 'utm_medium', 'utm_campaign', 'utm_term', 'utm_content',
  'lead_source_url', 'referrer', 'submit_time', 'submit_ip', 'submission_token', 'status',
];

function tableColumns(fields) {
  return ['id', 'site', 'form_type'].concat(fields, TRACKING_COLUMNS);
}

var FORMS = {
  'contact': {
    tab: 'contact',
    columns: tableColumns([
      'full_name', 'countrycode', 'phone', 'programme', 'email', 'subject',
      'country', 'state', 'city', 'message', 'consent', 'consent_at',
    ]),
    feedsMain: true,
  },
  'enquiry-form': {
    tab: 'enquiry-form',
    columns: tableColumns([
      'full_name', 'countrycode', 'phone', 'programme', 'email', 'subject',
      'country', 'state', 'city', 'message', 'consent', 'consent_at',
    ]),
    feedsMain: true,
  },
  'apply-now': {
    tab: 'apply-now',
    columns: tableColumns([
      'application_type', 'fname', 'lname', 'post_applied_for', 'job_reference_code',
      'gender', 'dob', 'address', 'full_name', 'countrycode', 'phone', 'mobile',
      'email', 'subject', 'country', 'state', 'city', 'message', 'consent', 'consent_at',
      'position_applied', 'resume_url', 'current_location', 'experience_years',
      'industry', 'highest_qualification', 'experience_months', 'current_organization',
      'current_designation', 'valid_passport', 'photo_url', 'cover_letter',
      'application_file_url', 'privacy_consent',
    ]),
    feedsMain: true,
  },
  'opd': {
    tab: 'opd',
    columns: tableColumns([
      'full_name', 'age', 'gender', 'countrycode', 'phone', 'email',
      'preferred_visit_date', 'address', 'symptoms', 'preferred_doctor',
      'consent', 'consent_at',
    ]),
    feedsMain: true,
  },
  'online-consultation': {
    tab: 'online-consultation',
    columns: tableColumns([
      'full_name', 'countrycode', 'phone', 'email', 'subject', 'country', 'state',
      'city', 'message', 'consent', 'consent_at', 'preferred_date', 'preferred_time',
      'health_concern', 'duration', 'consultation_for', 'preferred_language',
    ]),
    feedsMain: true,
  },
  'landing-page': {
    tab: 'landing-page',
    columns: tableColumns([
      'landing_page_path', 'form_variant', 'fname', 'lname', 'rdogender', 'phone',
      'email', 'country', 'duration', 'message', 'consent', 'consent_at', 'track_id',
      'campaign_name', 'utm_keyword',
    ]),
    feedsMain: true,
  },
  'exit-intent': {
    tab: 'exit-intent',
    columns: tableColumns([
      'full_name', 'countrycode', 'phone', 'email', 'subject', 'country', 'state',
      'city', 'message', 'consent', 'consent_at', 'step1_answer', 'trigger_type',
    ]),
    feedsMain: true,
  },
};

function spreadsheet() {
  return SpreadsheetApp.openById(TARGET_SHEET_ID);
}

function norm(value) {
  return String(value == null ? '' : value).trim().toLowerCase();
}

function safeCell(value) {
  if (typeof value !== 'string') return value == null ? '' : value;
  return /^[=+\-@]/.test(value) ? "'" + value : value;
}

function getOrCreateTab(name, columns) {
  var sheet = spreadsheet().getSheetByName(name);
  if (!sheet) {
    sheet = spreadsheet().insertSheet(name);
    sheet.getRange(1, 1, 1, columns.length).setValues([columns]);
  }
  return sheet;
}

function ensureHeaders(sheet, wanted) {
  var lastCol = Math.max(1, sheet.getLastColumn());
  var headers = sheet.getRange(1, 1, 1, lastCol).getValues()[0];
  if (!headers.some(function (header) { return norm(header); })) {
    sheet.getRange(1, 1, 1, wanted.length).setValues([wanted]);
    return wanted.slice();
  }
  var have = headers.map(norm);
  var missing = wanted.filter(function (wantedHeader) {
    return have.indexOf(norm(wantedHeader)) === -1;
  });
  if (missing.length) {
    sheet.getRange(1, headers.length + 1, 1, missing.length).setValues([missing]);
    headers = headers.concat(missing);
  }
  return headers;
}

function alreadyPresent(sheet, headers, tokenColumnName, token) {
  var column = headers.findIndex(function (header) {
    return norm(header) === norm(tokenColumnName);
  }) + 1;
  if (column < 1 || !token || sheet.getLastRow() < 2) return false;
  var finder = sheet.getRange(2, column, sheet.getLastRow() - 1, 1)
    .createTextFinder(String(token))
    .matchEntireCell(true)
    .matchCase(false);
  return finder.findNext() !== null;
}

function appendByHeader(sheet, headers, rowObject) {
  var keys = Object.keys(rowObject);
  var row = headers.map(function (header) {
    var wanted = norm(header);
    var found = keys.find(function (key) { return norm(key) === wanted; });
    return safeCell(found ? rowObject[found] : '');
  });
  sheet.appendRow(row);
}

function toMainRow(formKey, row, submissionToken) {
  var common = {
    id: submissionToken,
    utm_source: row.utm_source,
    utm_medium: row.utm_medium,
    utm_campaign: row.utm_campaign,
    utm_content: row.utm_content,
    lead_source_url: row.lead_source_url,
    submit_time: row.submit_time,
    submit_ip: row.submit_ip,
    'Enquiry Came From': formKey,
  };

  if (formKey === 'contact' || formKey === 'enquiry-form') {
    return Object.assign({}, common, {
      fname: row.full_name, email: row.email, phone: row.phone,
      message: row.message, subject: row.programme || row.subject,
    });
  }
  if (formKey === 'opd') {
    return Object.assign({}, common, {
      fname: row.full_name, email: row.email, phone: row.phone,
      age: row.age, gender: row.gender, address: row.address,
      'main-problem': row.symptoms,
      'other-information': row.preferred_doctor ? 'Preferred doctor: ' + row.preferred_doctor : '',
    });
  }
  if (formKey === 'online-consultation') {
    var consultationExtra = [];
    if (row.consultation_for) consultationExtra.push('Consultation for: ' + row.consultation_for);
    if (row.preferred_language) consultationExtra.push('Preferred language: ' + row.preferred_language);
    if (row.preferred_time) consultationExtra.push('Best time: ' + row.preferred_time);
    return Object.assign({}, common, {
      fname: row.full_name, email: row.email, phone: row.phone, country: row.country,
      'main-problem': row.health_concern, 'problem-duration': row.duration,
      'other-information': consultationExtra.join(' | '),
    });
  }
  if (formKey === 'apply-now') {
    var applicationExtra = [];
    if (row.post_applied_for) applicationExtra.push('Post applied for: ' + row.post_applied_for);
    if (row.job_reference_code) applicationExtra.push('Job reference code: ' + row.job_reference_code);
    if (row.cover_letter) applicationExtra.push('Cover letter: ' + row.cover_letter);
    if (row.current_designation || row.current_organization) {
      applicationExtra.push('Current role: ' + (row.current_designation || '') + ' at ' + (row.current_organization || ''));
    }
    if (row.resume_url) applicationExtra.push('Resume: ' + row.resume_url);
    if (row.photo_url) applicationExtra.push('Photo: ' + row.photo_url);
    if (row.application_file_url) applicationExtra.push('Application file: ' + row.application_file_url);
    return Object.assign({}, common, {
      fname: row.fname || row.full_name, lname: row.lname,
      email: row.email, phone: row.phone || row.mobile,
      address: row.address, country: row.country, state: row.state, city: row.city,
      gender: row.gender,
      subject: 'Job application' + (row.post_applied_for ? ': ' + row.post_applied_for : ''),
      message: applicationExtra.join('\n'),
      report: row.resume_url || row.application_file_url || row.photo_url || '',
    });
  }
  if (formKey === 'landing-page') {
    var landingExtra = [];
    if (row.form_variant) landingExtra.push('Form variant: ' + row.form_variant);
    if (row.campaign_name) landingExtra.push('Campaign name: ' + row.campaign_name);
    if (row.track_id) landingExtra.push('Track id: ' + row.track_id);
    return Object.assign({}, common, {
      fname: row.fname, lname: row.lname, email: row.email, phone: row.phone,
      country: row.country, gender: row.rdogender, message: row.message,
      'problem-duration': row.duration, subject: row.landing_page_path,
      'other-information': landingExtra.join(' | '),
    });
  }
  if (formKey === 'exit-intent') {
    var exitExtra = [];
    if (row.step1_answer) exitExtra.push('Step 1 answer: ' + row.step1_answer);
    if (row.trigger_type) exitExtra.push('Trigger: ' + row.trigger_type);
    return Object.assign({}, common, {
      fname: row.full_name, email: row.email, phone: row.phone,
      country: row.country, state: row.state, city: row.city,
      message: row.message, subject: row.subject,
      'other-information': exitExtra.join(' | '),
    });
  }
  return common;
}

function expectedSecret() {
  return String(PropertiesService.getScriptProperties().getProperty('AHV_LEAD_WEBHOOK_SECRET') || '');
}

function authenticated(payload) {
  var expected = expectedSecret();
  return expected.length >= 24 && String(payload.secret || '') === expected;
}

function handleLead(payload) {
  var formKey = String(payload.form || '');
  var config = FORMS[formKey];
  if (!config) throw new Error('unknown form');

  var row = payload.row && typeof payload.row === 'object' ? payload.row : {};
  var submissionToken = String(payload.submissionToken || row.submission_token || '');
  if (!submissionToken) throw new Error('missing submission token');
  row = Object.assign({}, row, { submission_token: submissionToken });

  var lock = LockService.getScriptLock();
  lock.waitLock(20000);
  try {
    var ownSheet = getOrCreateTab(config.tab, config.columns);
    var ownHeaders = ensureHeaders(ownSheet, config.columns);
    var ownDuplicate = alreadyPresent(ownSheet, ownHeaders, 'submission_token', submissionToken);
    if (!ownDuplicate) appendByHeader(ownSheet, ownHeaders, row);

    var mainDuplicate = false;
    if (config.feedsMain) {
      var mainSheet = spreadsheet().getSheetByName(MAIN_SHEET_NAME);
      if (!mainSheet) throw new Error('Main tab is missing');
      var mainHeaders = mainSheet.getRange(1, 1, 1, Math.max(1, mainSheet.getLastColumn())).getValues()[0];
      mainDuplicate = alreadyPresent(mainSheet, mainHeaders, 'id', submissionToken);
      if (!mainDuplicate) appendByHeader(mainSheet, mainHeaders, toMainRow(formKey, row, submissionToken));
    }
    return { result: 'success', form: formKey, duplicate: ownDuplicate && mainDuplicate };
  } finally {
    lock.releaseLock();
  }
}

function allowedUpload(purpose, extension, mimeType) {
  var photo = { jpg: ['image/jpeg'], jpeg: ['image/jpeg'], png: ['image/png'], webp: ['image/webp'] };
  var document = {
    pdf: ['application/pdf'],
    doc: ['application/msword', 'application/octet-stream'],
    docx: ['application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'application/octet-stream'],
  };
  var map = purpose === 'photo' ? photo : document;
  return map[extension] && map[extension].indexOf(mimeType) !== -1;
}

function digestHex(bytes) {
  return Utilities.computeDigest(Utilities.DigestAlgorithm.SHA_256, bytes).map(function (value) {
    var normalized = value < 0 ? value + 256 : value;
    return ('0' + normalized.toString(16)).slice(-2);
  }).join('');
}

function handleUpload(payload) {
  var token = String(payload.submissionToken || '').toLowerCase();
  var purpose = String(payload.purpose || '');
  var originalName = String(payload.originalName || '');
  var mimeType = String(payload.mimeType || '');
  var base64 = String(payload.base64 || '');
  var claimedDigest = String(payload.sha256 || '').toLowerCase();
  if (!/^[0-9a-f-]{36}$/.test(token) || ['photo', 'resume', 'application'].indexOf(purpose) === -1) {
    throw new Error('invalid upload request');
  }
  var extensionMatch = originalName.toLowerCase().match(/\.([a-z0-9]+)$/);
  var extension = extensionMatch ? extensionMatch[1] : '';
  if (!allowedUpload(purpose, extension, mimeType) || base64.length > 6 * 1024 * 1024) {
    throw new Error('invalid upload type');
  }

  var bytes = Utilities.base64Decode(base64);
  if (!bytes.length || bytes.length > MAX_FILE_BYTES || !/^[0-9a-f]{64}$/.test(claimedDigest) || digestHex(bytes) !== claimedDigest) {
    throw new Error('invalid upload content');
  }

  var folder;
  try {
    folder = DriveApp.getFolderById(APPLICATION_FOLDER_ID);
  } catch (error) {
    throw new Error('UPLOAD_FOLDER_UNAVAILABLE');
  }
  var storedName = token + '-' + purpose + '.' + extension;
  var file;
  try {
    var existing = folder.getFilesByName(storedName);
    file = existing.hasNext()
      ? existing.next()
      : folder.createFile(Utilities.newBlob(bytes, mimeType, storedName));
  } catch (error) {
    throw new Error('UPLOAD_CREATE_FAILED');
  }
  try {
    file.setSharing(DriveApp.Access.PRIVATE, DriveApp.Permission.NONE);
    if (file.getSharingAccess() !== DriveApp.Access.PRIVATE) throw new Error('not private');
  } catch (error) {
    throw new Error('UPLOAD_PRIVACY_FAILED');
  }
  var fileId = file.getId();
  return {
    result: 'success',
    fileId: fileId,
    fileUrl: 'https://drive.google.com/file/d/' + fileId + '/view',
  };
}

function doPost(request) {
  try {
    var payload = JSON.parse(request.postData.contents);
    if (!authenticated(payload)) return respond({ result: 'error', message: 'unauthorized' });
    return respond(payload.action === 'upload' ? handleUpload(payload) : handleLead(payload));
  } catch (error) {
    var safeCode = String(error && error.message || '');
    if (['UPLOAD_FOLDER_UNAVAILABLE', 'UPLOAD_CREATE_FAILED', 'UPLOAD_PRIVACY_FAILED'].indexOf(safeCode) === -1) {
      safeCode = 'request failed';
    }
    return respond({ result: 'error', message: safeCode });
  }
}

/**
 * Run manually in the Apps Script editor after deployment/auth changes.
 * It proves that the effective Web app owner can create a private file in the
 * configured folder, then moves the probe to trash so the folder stays clean.
 */
function diagnoseApplicationFolderAccess() {
  var folder = DriveApp.getFolderById(APPLICATION_FOLDER_ID);
  var probe;
  var result = {
    folderId: folder.getId(),
    folderName: folder.getName(),
    effectiveUser: Session.getEffectiveUser().getEmail() || 'unavailable',
    readable: true,
    writable: false,
    privateFileSupported: false,
  };
  try {
    probe = folder.createFile('ahv-drive-write-probe.txt', 'AHV Drive write probe', MimeType.PLAIN_TEXT);
    result.writable = true;
    probe.setSharing(DriveApp.Access.PRIVATE, DriveApp.Permission.NONE);
    result.privateFileSupported = probe.getSharingAccess() === DriveApp.Access.PRIVATE;
    if (!result.privateFileSupported) throw new Error('probe file is not private');
  } finally {
    if (probe) probe.setTrashed(true);
  }
  console.log(JSON.stringify(result));
  return result;
}

function respond(body) {
  return ContentService.createTextOutput(JSON.stringify(body)).setMimeType(ContentService.MimeType.JSON);
}

function doGet() {
  return respond({ result: 'error', message: 'This endpoint accepts POST only.' });
}
