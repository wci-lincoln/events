# Shiloh event app · Winners Chapel International Lincoln

The home for WCI Lincoln's Shiloh event pages, one edition per year. Each edition is a single-page
"all you need to know" hub for the Lincoln viewing centre: countdown, programme, bookings and a
printable QR poster. The current edition is **Shiloh 2026 · Far Above** (Tue 8 – Sun 13 Dec 2026).

Live address: `https://wci-lincoln.github.io/<repository-name>/shiloh-2026/`
(with the repository named `shiloh-event-app` that is `…/shiloh-event-app/shiloh-2026/`;
renaming the repository to `events` gives `…/events/shiloh-2026/`).

## What the page does

- Countdown that switches to "Live now · Day N" during Shiloh week.
- Programme by day, built on the four daily blocks: 1 Shiloh Prayer Hour, 2 Morning Session
  (Hour of Visitation), 3 Specialised Classes, 4 Evening Session (Encounter Night). Friday evening
  is the Victor Celebration Night; Saturday morning is the Impartation Service.
- Bookings: bus seats (day-by-session grid), T-shirts, stay, volunteering, testimonies.
  Submissions go to a Google Sheet; WhatsApp is the fallback.
- Venue and directions, giving, share links and a scan-to-open QR block.

## Run it locally

```bash
npm run dev
```

Then open http://localhost:4173/shiloh-2026/. The A4 QR poster is at http://localhost:4173/qr.

## Edit the 2026 edition

Everything the committee changes lives in the `CONFIG` block near the bottom of
`shiloh-2026-lincoln.html`: page link, dates, venue, WhatsApp numbers, contacts, programme,
links, T-shirt price, Sheet URL. Run `node build.js` after editing, then commit and push.

## Bookings backend

Forms post to a Google Sheet through a small Apps Script. Follow `backend/SETUP.md`, then paste
the web app URL into `sheetUrl` in `CONFIG`. Until it is set, forms open WhatsApp with the
booking text instead.

## Files

- `shiloh-2026-lincoln.html` — the 2026 page (source of truth)
- `build.js` — wraps the page into `docs/shiloh-2026/index.html` and copies its assets
- `server.js` — tiny static server for `docs/` (local preview only)
- `backend/` — the Google Sheet booking script and its setup guide
- `assets/` — official flyer, cropped hero, QR code (PNG + SVG), A4 QR poster
- `docs/` — generated site; GitHub Pages serves this folder

## Hosting (GitHub Pages, free)

Repository **Settings → Pages**: Source "Deploy from a branch", branch `main`, folder `/docs`.
The repository must be public for Pages on a free account. After any change: `node build.js`,
commit, push; the site updates within a minute or two.

## Adding the next edition

1. Copy `shiloh-2026-lincoln.html` to `shiloh-2027-lincoln.html` and update its `CONFIG`
   (dates, theme, venue, links) and the hero image.
2. In `build.js`, add the new page with its own output folder (`docs/shiloh-2027/`).
3. Point the root redirect in `build.js` at the new edition, generate a QR for the new address,
   and keep the old edition's folder so its printed QR codes keep working.
