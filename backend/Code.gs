/**
 * Shiloh 2026 Lincoln — bookings backend.
 * Lives inside the Google Sheet (Extensions → Apps Script). Receives the page's forms and
 * appends one row per submission to a tab per form. Tabs are prefixed with the event name the
 * page sends (for example "Shiloh 2026 · Bus seats"), so one sheet can hold every event, or you can
 * deploy a fresh copy per event. Optional email alert per form.
 */

// Columns per form. The page sends fields with exactly these names.
const FORMS = {
  bus:   ["Name", "Phone", "Pickup", "Seats", "Tue", "Wed", "Thu", "Fri", "Sat", "Code", "Suggested pickup"],
  shirt: ["Name", "Phone", "Size", "Qty", "Fit"],
  camp:  ["Name", "Phone", "People", "Nights", "Notes"],
  vol:   ["Name", "Phone", "Units", "Tue", "Wed", "Thu", "Fri", "Sat", "Code", "Sunday Thanksgiving"],
  test:  ["Name", "OK to share", "Testimony"]
};

// Tab names in the sheet.
const TABS = { bus: "Bus seats", shirt: "T-shirts", camp: "Stay", vol: "Volunteers", test: "Testimonies" };

// Optional: an email address per form to alert on every new entry. Leave "" for none.
const NOTIFY = { bus: "", shirt: "", camp: "", vol: "", test: "" };

function doPost(e) {
  try {
    const data = JSON.parse(e.postData.contents || "{}");
    if (data.website) return out({ ok: true });            // honeypot field filled: a bot, ignore quietly
    const cols = FORMS[data.form];
    if (!cols) return out({ ok: false, error: "Unknown form" });
    const event = String(data.event || "Event").replace(/[\[\]\*\/\\\?:]/g, "").trim().slice(0, 40);
    const tabName = event + " · " + TABS[data.form];

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
