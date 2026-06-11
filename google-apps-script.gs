/**
 * Google Apps Script — receives Supabase webhooks and appends rows to this spreadsheet.
 * Routes by table: waitlist -> 'Waitlist' tab, heart_rate -> 'HeartChecks' tab.
 *
 * SETUP: paste into Extensions → Apps Script, set SECRET below, deploy as a Web App
 * ("Execute as: Me", "Who has access: Anyone"), then point Supabase Database Webhooks
 * (one per table, INSERT events) at the deployment URL with `?secret=YOUR_SECRET` appended.
 * To update: Deploy → Manage deployments → edit → New version (keeps the same URL).
 */

// Must match the ?secret=... in your Supabase webhook URLs.
var SECRET = 'sw1mm3rs-k7q2x9-vn4';

var ROUTES = {
  waitlist: {
    sheet: 'Waitlist',
    headers: ['id', 'email', 'created_at', 'received_at'],
    row: function (r) { return [r.id || '', r.email || '', r.created_at || '', new Date()]; }
  },
  heart_rate: {
    sheet: 'HeartChecks',
    headers: ['id', 'name', 'email', 'resting_hr', 'active_hr', 'recovery_seconds', 'spo2', 'ecg_reading', 'created_at', 'received_at'],
    row: function (r) {
      return [r.id || '', r.name || '', r.email || '', r.resting_hr || '', r.active_hr || '', r.recovery_seconds || '', r.spo2 || '', r.ecg_reading || '', r.created_at || '', new Date()];
    }
  }
};

function doPost(e) {
  try {
    // Reject requests that don't carry the shared secret.
    if (SECRET && (!e.parameter || e.parameter.secret !== SECRET)) {
      return json({ ok: false, error: 'unauthorized' });
    }

    var body = JSON.parse(e.postData.contents);
    var record = body.record || {};
    var route = ROUTES[body.table] || ROUTES.waitlist;

    var ss = SpreadsheetApp.getActiveSpreadsheet();
    var sheet = ss.getSheetByName(route.sheet) || ss.insertSheet(route.sheet);

    // Write a header row the first time.
    if (sheet.getLastRow() === 0) {
      sheet.appendRow(route.headers);
    }

    sheet.appendRow(route.row(record));

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
