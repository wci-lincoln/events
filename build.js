// Builds the standalone site into ./docs (GitHub Pages serves it) from the single-page source.
// Usage: node build.js
const fs = require("fs");
const path = require("path");

const root = __dirname;
const src = fs.readFileSync(path.join(root, "shiloh-2026-lincoln.html"), "utf8");
const site = path.join(root, "docs");                 // GitHub Pages serves this folder (repo "events")
const out = path.join(site, "shiloh-2026");            // ...so the page lives at /events/shiloh-2026/
fs.mkdirSync(out, { recursive: true });

// The source file is written as page content (title + style + body + script) so it can also be
// published as a Claude artifact. For localhost and ordinary hosting we wrap it in a full document.
const doc = `<!doctype html>
<html lang="en-GB">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover">
<meta name="theme-color" content="#3a0309">
<meta name="description" content="Shiloh 2026 — Far Above. Everything about Shiloh at Winners Chapel International Lincoln: programme, bus seats, T-shirts, camping, volunteering, testimonies.">
<meta property="og:title" content="Shiloh 2026 - WCI Lincoln">
<meta property="og:description" content="Tue 8 – Sun 13 Dec 2026. Times, bookings, directions. One link for everything.">
<meta property="og:image" content="shiloh-2026-flyer.webp">
<link rel="icon" type="image/png" sizes="32x32" href="favicon-32.png">
<link rel="icon" type="image/png" sizes="192x192" href="icon-192.png">
<link rel="apple-touch-icon" sizes="180x180" href="apple-touch-icon.png">
<style>:root{padding-top:env(safe-area-inset-top,0px);padding-bottom:env(safe-area-inset-bottom,0px)}img{max-width:100%}[hidden]{display:none!important}</style>
</head>
<body>
${src}
</body>
</html>
`;
fs.writeFileSync(path.join(out, "index.html"), doc);

for (const f of ["shiloh-2026-flyer.webp", "shiloh-2026-qr.png", "shiloh-2026-qr.svg", "shiloh-2026-qr-poster-a4.html", "favicon-32.png", "icon-192.png", "icon-512.png", "apple-touch-icon.png"]) {
  const from = path.join(root, "assets", f);
  if (fs.existsSync(from)) fs.copyFileSync(from, path.join(out, f));
}
fs.writeFileSync(path.join(site, ".nojekyll"), "");
fs.writeFileSync(path.join(site, "index.html"), `<!doctype html><html lang="en-GB"><head><meta charset="utf-8"><title>Winners Chapel International Lincoln · Events</title><meta http-equiv="refresh" content="0; url=shiloh-2026/"><link rel="canonical" href="shiloh-2026/"></head><body><p>Redirecting to <a href="shiloh-2026/">Shiloh 2026</a>…</p></body></html>\n`);
console.log("Built docs/shiloh-2026/index.html (" + (doc.length / 1024).toFixed(0) + " KB) and copied assets.");
