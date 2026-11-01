// Zero-dependency static server for ./docs.  Usage: node server.js  (PORT=4173 by default)
const http = require("http");
const fs = require("fs");
const path = require("path");

const PORT = Number(process.env.PORT) || 4173;
const PUBLIC = path.join(__dirname, "docs");
const TYPES = { ".html": "text/html; charset=utf-8", ".css": "text/css", ".js": "text/javascript", ".png": "image/png", ".jpg": "image/jpeg", ".webp": "image/webp", ".svg": "image/svg+xml", ".ico": "image/x-icon", ".json": "application/json" };

// Always rebuild on start so edits to the page are picked up.
{
  require("child_process").execFileSync(process.execPath, [path.join(__dirname, "build.js")], { stdio: "inherit" });
}

http.createServer((req, res) => {
  let p = decodeURIComponent(new URL(req.url, "http://x").pathname);
  if (p === "/" || p === "") p = "/index.html";
  if (p === "/qr" || p === "/qr/") p = "/shiloh-2026-qr-poster-a4.html";
  const file = path.normalize(path.join(PUBLIC, p));
  if (!file.startsWith(PUBLIC)) { res.writeHead(403); return res.end("Forbidden"); }
  fs.readFile(file, (err, data) => {
    if (err) { res.writeHead(404, { "Content-Type": "text/plain" }); return res.end("Not found"); }
    res.writeHead(200, { "Content-Type": TYPES[path.extname(file)] || "application/octet-stream", "Cache-Control": "no-cache" });
    res.end(data);
  });
}).listen(PORT, () => {
  console.log(`Shiloh 2026 Lincoln hub running at http://localhost:${PORT}  (QR poster: http://localhost:${PORT}/qr)`);
});
