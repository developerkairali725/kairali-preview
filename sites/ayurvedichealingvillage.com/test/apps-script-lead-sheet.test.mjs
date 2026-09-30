import test from 'node:test';
import assert from 'node:assert/strict';
import crypto from 'node:crypto';
import fs from 'node:fs';
import vm from 'node:vm';

class Sheet {
  constructor(name, headers = []) {
    this.name = name;
    this.rows = headers.length ? [headers.slice()] : [];
  }
  getLastColumn() { return Math.max(0, ...this.rows.map((row) => row.length)); }
  getLastRow() { return this.rows.length; }
  getRange(row, column, rowCount, columnCount) {
    const sheet = this;
    return {
      getValues() {
        return Array.from({ length: rowCount }, (_, rowOffset) =>
          Array.from({ length: columnCount }, (_, columnOffset) =>
            sheet.rows[row - 1 + rowOffset]?.[column - 1 + columnOffset] ?? ''));
      },
      setValues(values) {
        values.forEach((sourceRow, rowOffset) => {
          const targetRow = row - 1 + rowOffset;
          while (sheet.rows.length <= targetRow) sheet.rows.push([]);
          sourceRow.forEach((value, columnOffset) => {
            sheet.rows[targetRow][column - 1 + columnOffset] = value;
          });
        });
      },
      createTextFinder(needle) {
        return {
          matchEntireCell() { return this; },
          matchCase() { return this; },
          findNext() {
            const wanted = String(needle).toLowerCase();
            for (let offset = 0; offset < rowCount; offset += 1) {
              const value = sheet.rows[row - 1 + offset]?.[column - 1] ?? '';
              if (String(value).toLowerCase() === wanted) return { row: row + offset };
            }
            return null;
          },
        };
      },
    };
  }
  appendRow(row) { this.rows.push(row.slice()); }
}

function loadReceiver() {
  const sheets = new Map([
    ['Main', new Sheet('Main', ['id', 'fname', 'email', 'phone', 'message', 'report', 'Enquiry Came From'])],
  ]);
  const files = new Map();
  const folder = {
    getFilesByName(name) {
      const item = files.get(name);
      let read = false;
      return { hasNext: () => Boolean(item) && !read, next: () => { read = true; return item; } };
    },
    createFile(blob) {
      const id = `drive-file-${files.size + 1}`;
      let sharingAccess = 'anyone';
      const file = {
        getId: () => id,
        setSharing(access, permission) {
          assert.equal(permission, 'none');
          sharingAccess = access;
          return this;
        },
        getSharingAccess: () => sharingAccess,
        blob,
      };
      files.set(blob.name, file);
      return file;
    },
    getId: () => '1GQS5u-y33Io8i7ofgvHczrJGB1j0-AlO',
    getName: () => 'AHV applications',
  };
  const spreadsheet = {
    getSheetByName: (name) => sheets.get(name) ?? null,
    insertSheet(name) { const sheet = new Sheet(name); sheets.set(name, sheet); return sheet; },
  };
  const context = {
    SpreadsheetApp: {
      openById(id) {
        assert.equal(id, '1z3sN5rbYl18ECQXzNRTUdO4IuJQ2rXxX7RMDiqJDa54');
        return spreadsheet;
      },
    },
    PropertiesService: {
      getScriptProperties: () => ({ getProperty: () => 'test-secret-that-is-at-least-24-characters' }),
    },
    LockService: {
      getScriptLock: () => ({ waitLock() {}, releaseLock() {} }),
    },
    DriveApp: {
      Access: { PRIVATE: 'private' },
      Permission: { NONE: 'none' },
      getFolderById(id) {
        assert.equal(id, '1GQS5u-y33Io8i7ofgvHczrJGB1j0-AlO');
        return folder;
      },
    },
    Utilities: {
      DigestAlgorithm: { SHA_256: 'sha256' },
      base64Decode: (value) => [...Buffer.from(value, 'base64')],
      computeDigest: (_algorithm, bytes) => [...crypto.createHash('sha256').update(Buffer.from(bytes)).digest()],
      newBlob: (bytes, mimeType, name) => ({ bytes, mimeType, name }),
    },
    ContentService: {
      MimeType: { JSON: 'json' },
      createTextOutput(text) {
        return { text, setMimeType() { return this; } };
      },
    },
    Date,
    JSON,
    Object,
    String,
    RegExp,
  };
  vm.createContext(context);
  vm.runInContext(fs.readFileSync(new URL('../scripts/apps-script/lead-sheet.gs', import.meta.url), 'utf8'), context);
  return { context, sheets, files };
}

function post(context, payload) {
  const output = context.doPost({ postData: { contents: JSON.stringify({
    ...payload,
    secret: 'test-secret-that-is-at-least-24-characters',
  }) } });
  return JSON.parse(output.text);
}

test('Apps Script mirrors a database row once to the own tab and Main', () => {
  const { context, sheets } = loadReceiver();
  const submissionToken = '10000000-0000-4000-8000-000000000001';
  const payload = {
    action: 'lead',
    form: 'contact',
    submissionToken,
    row: {
      id: 42,
      site: 'ayurvedichealingvillage.com',
      form_type: 'contact',
      full_name: 'Test Patient',
      email: 'test@example.com',
      phone: '9999999999',
      message: '=IMPORTXML("https://example.test")',
      submission_token: submissionToken,
      submit_time: '2026-09-28T00:00:00.000Z',
    },
  };

  assert.equal(post(context, payload).result, 'success');
  assert.equal(post(context, payload).result, 'success');
  assert.equal(sheets.get('contact').rows.length, 2);
  assert.equal(sheets.get('Main').rows.length, 2);

  const own = sheets.get('contact');
  const messageColumn = own.rows[0].indexOf('message');
  assert.equal(own.rows[1][messageColumn], "'=IMPORTXML(\"https://example.test\")");
});

test('Apps Script stores an approved application file once and returns a Drive URL', () => {
  const { context, files } = loadReceiver();
  const bytes = Buffer.from('test resume');
  const payload = {
    action: 'upload',
    submissionToken: '10000000-0000-4000-8000-000000000002',
    purpose: 'resume',
    originalName: 'resume.pdf',
    mimeType: 'application/pdf',
    base64: bytes.toString('base64'),
    sha256: crypto.createHash('sha256').update(bytes).digest('hex'),
  };

  const first = post(context, payload);
  const second = post(context, payload);
  assert.equal(first.result, 'success');
  assert.equal(second.fileId, first.fileId);
  assert.match(first.fileUrl, /^https:\/\/drive\.google\.com\/file\/d\/drive-file-1\/view$/);
  assert.equal(files.size, 1);
  assert.equal([...files.values()][0].getSharingAccess(), 'private');
});
