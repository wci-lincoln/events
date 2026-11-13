/**
 * Shiloh 2026 Lincoln — bookings backend.
 * Lives inside the Google Sheet (Extensions → Apps Script). Receives the page's forms and
 * One workbook per event. Inside it, one sheet per form: Bus seats, T-shirts, Stay, Volunteers,
 * Testimonies, Classes, Delegates. Each submission appends one row. Optional email alert per form.
 */

// Columns per form. The page sends fields with exactly these names.
const FORMS = {
  bus:   ["Name", "Phone", "Pickup", "Seats", "Tue", "Wed", "Thu", "Fri", "Sat", "Summary", "Suggested pickup"],
  shirt: ["Name", "Phone", "Size", "Qty", "Fit", "Item", "Colour", "Sleeve"],
  camp:  ["Name", "Phone", "People", "Nights", "Notes"],
  vol:   ["Name", "Phone", "Units", "Tue", "Wed", "Thu", "Fri", "Sat", "Summary", "Sunday Thanksgiving"],
  test:  ["Name", "OK to share", "Testimony"],
  cls:   ["Name", "Phone", "Wed", "Thu", "Fri", "Summary"],
  del:   ["Name", "Phone", "Question"]
};

// Sheet (tab) names inside the event's workbook.
const TABS = { bus: "Bus seats", shirt: "T-shirts", camp: "Stay", vol: "Volunteers", test: "Testimonies", cls: "Classes", del: "Delegates" };

// Optional: an email address per form to alert on every new entry. Leave "" for none.
const NOTIFY = { bus: "", shirt: "", camp: "", vol: "", test: "", cls: "", del: "" };

function doPost(e) {
  try {
    const data = JSON.parse(e.postData.contents || "{}");
    if (data.website) return out({ ok: true });            // honeypot field filled: a bot, ignore quietly
    const cols = FORMS[data.form];
    if (!cols) return out({ ok: false, error: "Unknown form" });
    const tabName = TABS[data.form];
    const event = String(data.event || "Event").slice(0, 40);

    const lock = LockService.getScriptLock();
    lock.waitLock(10000);
    try {
      const ss = SpreadsheetApp.getActiveSpreadsheet();
      let sh = ss.getSheetByName(tabName);
      if (!sh) {
        sh = ss.insertSheet(tabName);
        sh.appendRow(["Submitted"].concat(cols));
        sh.setFrozenRows(1);
        sh.getRange(1, 1, 1, cols.length + 1).setFontWeight("bold");
      }
      // a form that gained columns since the tab was made: add the missing headers on the right
      const have = sh.getLastColumn();
      if (have < cols.length + 1) sh.getRange(1, have + 1, 1, cols.length + 1 - have).setValues([["Submitted"].concat(cols).slice(have)]).setFontWeight("bold");
      const fields = data.fields || {};
      sh.appendRow([new Date()].concat(cols.map(c => fields[c] == null ? "" : String(fields[c]).slice(0, 2000))));
    } finally {
      lock.releaseLock();
    }

    if (NOTIFY[data.form]) {
      const fields = data.fields || {};
      MailApp.sendEmail(
        NOTIFY[data.form],
        event + ": new " + TABS[data.form] + " entry",
        cols.map(c => c + ": " + (fields[c] || "")).join("\n")
      );
    }
    return out({ ok: true });
  } catch (err) {
    return out({ ok: false, error: String(err) });
  }
}

// Visiting the web app URL in a browser shows this, which is a quick way to check it is deployed.
function doGet() {
  return out({ ok: true, service: "Shiloh 2026 Lincoln bookings" });
}

function out(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(ContentService.MimeType.JSON);
}
