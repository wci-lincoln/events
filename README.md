# Shiloh 2026 · Winners Chapel International Lincoln

A one-link event hub ("all you need to know about Shiloh 2026") for the Lincoln viewing centre.
Countdown, programme, specialised classes, venue, bus booking, T-shirts, camping, volunteering,
testimonies, giving, sharing and a printable QR poster. No backend: bookings open WhatsApp with a
pre-filled message (or copy the text) so the committee can run everything from their phones.

## Run it locally

```bash
npm run dev
```

Then open http://localhost:4173/shiloh-2026/. The QR poster (A4, print from the browser) is at http://localhost:4173/qr.

## Edit content

Everything the committee changes lives in the `CONFIG` block near the bottom of
`shiloh-2026-lincoln.html` (page link, dates, venue, WhatsApp numbers, contacts, programme, links).
Run `npm run build` after editing (or just restart `npm run dev`).

## Files

- `shiloh-2026-lincoln.html` — the page (source of truth; also published as the Claude artifact)
- `build.js` — wraps the page into `docs/shiloh-2026/index.html` and copies assets
- `server.js` — tiny static server for `docs/`
- `backend/Code.gs` + `backend/SETUP.md` — the Google Sheet booking backend and how to deploy it
- `assets/` — official flyer, cropped hero, QR code (PNG + SVG), A4 QR poster
- `docs/` — generated; GitHub Pages serves this folder. The repository is named `events`, so the page is at `/events/shiloh-2026/`

## Going live (GitHub Pages, free)

1. Push this folder to the `wci-lincoln/events` repository.
2. Repository **Settings → Pages → Build and deployment**: Source "Deploy from a branch", branch `main`, folder `/docs`.
3. The site appears at `https://wci-lincoln.github.io/events/shiloh-2026/` within a minute or two (the repository must be public and named `events`). A custom domain (for example `shiloh.winnerschapellincoln.org.uk`) can be added on the same settings page.
4. Set `pageUrl` in `CONFIG` to that URL, run `node build.js`, commit and push, so the in-page QR and share links point there.
5. Regenerate the printed QR for the same URL (`assets/shiloh-2026-qr.*` currently point at the Claude artifact link).

## Bookings

Forms post to a Google Sheet through a small Apps Script. Follow `backend/SETUP.md`, then paste the web app URL into `sheetUrl` in `CONFIG`. Until that is set, forms open WhatsApp with the booking text instead.
