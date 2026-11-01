# Bookings backend: Google Sheet + Apps Script (free)

Every form on the page (bus seats, T-shirts, stay, volunteers, testimonies) posts to a small
script that lives inside a Google Sheet. Each submission becomes one row on its own tab.
Takes about ten minutes, needs only a Google account.

## 1. Create the sheet
1. Go to https://sheets.new and name it **WCI Lincoln event bookings**.
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
1. Open `shiloh-2026-lincoln.html`, find `sheetUrl: ""` in the `CONFIG` block, and paste the URL between the quotes.
2. Rebuild and deploy the site (`node build.js`, then push).

Tabs are created automatically on the first submission of each form, named after the event the
page sends, for example **Shiloh 2026 · Bus seats**. So one sheet can hold every event (each
event's page carries its own `eventKey` and `sheetUrl` in `CONFIG`), or you can repeat these steps
for a fresh sheet per event. Either way, each event page has its own `sheetUrl` entry.

## Changing the script later
Edit the code, then **Deploy → Manage deployments → pencil icon → Version: New version → Deploy**.
The URL stays the same, so the page needs no change.

## What visitors see
With the sheet connected, the primary button books directly and shows a confirmation.
"WhatsApp instead" is still offered, and if the sheet cannot be reached the page falls back to
WhatsApp automatically, so nothing is ever lost.
