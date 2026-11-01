# Bookings backend: one Google Sheet workbook per event (free)

Each event gets its own workbook. Inside it, each form gets its own sheet: **Bus seats**,
**T-shirts**, **Stay**, **Volunteers**, **Testimonies**. A small script inside the workbook receives
the page's forms and appends one row per submission. Takes about ten minutes, needs only a
Google account. Repeat for each new event.

## 1. Create the workbook
1. Go to https://sheets.new and name it after the event, for example **Shiloh 2026 · Bookings**.
2. Share it with the committee members who need to see bookings (Viewer is enough).

## 2. Add the script
1. In the sheet: **Extensions → Apps Script**.
2. Delete the sample code, paste the whole of `backend/Code.gs`, and save (Ctrl/Cmd + S).
3. Optional: in `NOTIFY`, put an email address against any form to get an email per entry,
   for example `bus: "transport.lead@example.com"`.

## 3. Deploy it as a web app
1. **Deploy → New deployment**.
2. Click the gear next to "Select type" and choose **Web app**.
3. Description: `Shiloh bookings`. Execute as: **Me**. Who has access: **Anyone**.
4. Click **Deploy**, approve the permissions when asked (it only touches this sheet and, if set, sends email from you).
5. Copy the **Web app URL** (ends in `/exec`). Opening it in a browser should show
   `{"ok":true,"service":"Shiloh 2026 Lincoln bookings"}`.

## 4. Connect the page
1. Open the event's page file (for 2026, `shiloh-2026-lincoln.html`), find `sheetUrl: ""` in the `CONFIG` block, and paste the URL between the quotes.
2. Rebuild and deploy the site (`node build.js`, then push).

The five sheets are created automatically, each on the first submission of its form, with bold
frozen headers. Each event page carries its own `sheetUrl` in `CONFIG`, so every event points at
its own workbook.

## Changing the script later
Edit the code, then **Deploy → Manage deployments → pencil icon → Version: New version → Deploy**.
The URL stays the same, so the page needs no change.

## What visitors see
With the sheet connected, the primary button books directly and shows a confirmation.
"WhatsApp instead" is still offered, and if the sheet cannot be reached the page falls back to
WhatsApp automatically, so nothing is ever lost.
