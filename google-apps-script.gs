/**
 * Google Apps Script — receives Supabase waitlist signups and appends them to the Sheet.
 *
 * SETUP (see README steps): paste this into Extensions → Apps Script, set SECRET below,
 * deploy as a Web App ("Execute as: Me", "Who has access: Anyone"), then point a
 * Supabase Database Webhook at the deployment URL with `?secret=YOUR_SECRET` appended.
 */

// Make up any random string. Must match the ?secret=... in your Supabase webhook URL.
var SECRET = 'change-me-to-a-random-string';

function doPost(e) {
  try {
    // Reject requests that don't carry the shared secret.
    if (SECRET && (!e.parameter || e.parameter.secret !== SECRET)) {
      return json({ ok: false, error: 'unauthorized' });
    }

    var body = JSON.parse(e.postData.contents);
    var record = body.record || {};

    var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('Waitlist')
             || SpreadsheetApp.getActiveSpreadsheet().getSheets()[0];

    // Write a header row the first time.
    if (sheet.getLastRow() === 0) {
      sheet.appendRow(['id', 'email', 'created_at', 'received_at']);
    }

    sheet.appendRow([
      record.id || '',
      record.email || '',
      record.created_at || '',
      new Date()
    ]);

    return json({ ok: true });
  } catch (err) {
    return json({ ok: false, error: String(err) });
  }
}

function json(obj) {
  return ContentService
    .createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}
