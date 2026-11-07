# Events · Winners Chapel International Lincoln

Event pages for WCI Lincoln, served free from GitHub Pages. Each event gets a single-page
"all you need to know" hub at its own address under `https://wci-lincoln.github.io/events/`,
so a printed QR code for one event never breaks when the next one is added.

| Event | Address | Source |
|---|---|---|
| Shiloh 2026 · Far Above (8–13 Dec 2026) | https://wci-lincoln.github.io/events/shiloh-2026/ | `shiloh-2026-lincoln.html` |

The root address redirects to the current event.

## What an event page does

- Countdown that switches to "Live now · Day N" while the event is on.
- Programme by day. For Shiloh, the four daily blocks: Shiloh Prayer Hour, Morning Session
  (Hour of Visitation), Specialised Classes and Evening Session (Encounter Night); Friday evening
  is the Victory Celebration Night and Saturday morning the Impartation Service.
- Bookings: bus seats (day-by-session grid), specialised class per day, T-shirts, stay, volunteering,
  testimonies, UK Foreign Delegate interest.
  Submissions go to a Google Sheet; WhatsApp is the fallback.
- Venue and directions, giving, share links and a scan-to-open QR block.

## Run locally

```bash
npm run dev
```

Then open http://localhost:4173/ (it redirects to the current event). The A4 QR poster for the
current event is at http://localhost:4173/qr.

## Edit an event

Everything the committee changes lives in the `CONFIG` block near the bottom of the event's page
file: page link, dates, venue, WhatsApp numbers, contacts, programme, links, T-shirt price,
Sheet URL. Run `node build.js` after editing, then commit and push. The site updates within a
minute or two.

## Bookings backend

Forms post to a Google Sheet through a small Apps Script. Follow `backend/SETUP.md`, then paste
the web app URL into `sheetUrl` in that event's `CONFIG`. Until it is set, forms open WhatsApp
with the booking text instead. One workbook per event, with a sheet per form inside it.

## Files

- `<event>-lincoln.html` — one page file per event (source of truth)
- `build.js` — wraps each page into `docs/<event>/index.html`, copies its assets, writes the root redirect
- `server.js` — tiny static server for `docs/` (local preview only)
- `backend/` — the Google Sheet booking script and its setup guide
- `assets/` — flyers, cropped hero images, QR codes (PNG + SVG), A4 QR posters
- `publicity/` — social media and projector kit: HTML templates, `build.js` renders PNG, GIF and MP4 into `publicity/out` (see `publicity/README.md`)
- `docs/` — generated site; GitHub Pages serves this folder

## Hosting (GitHub Pages, free)

Repository **Settings → Pages**: Source "Deploy from a branch", branch `main`, folder `/docs`.
The repository must be public for Pages on a free account.

## Adding an event

1. Copy the closest existing page file (for example `shiloh-2026-lincoln.html`) to
   `<event>-lincoln.html` and update its `CONFIG`, copy and hero image.
2. In `build.js`, add the new page with its own output folder (`docs/<event>/`) and point the
   root redirect at it if it is now the current event.
3. Generate a QR code and poster for `https://wci-lincoln.github.io/events/<event>/`.
4. Keep earlier events' folders in `docs/` so their printed QR codes keep working.
