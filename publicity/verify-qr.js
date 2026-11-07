// Decodes the QR in every PNG in out/ (or the files given) and checks it points at the Shiloh page.
const fs = require("fs"), path = require("path"); const jsQR = require("jsqr"); const { PNG } = require("pngjs");
const WANT = "https://wci-lincoln.github.io/events/shiloh-2026/";
const files = process.argv.length > 2 ? process.argv.slice(2) : fs.readdirSync("out").filter(f => f.endsWith(".png")).map(f => path.join("out", f));
let bad = 0;
for (const f of files) {
  const png = PNG.sync.read(fs.readFileSync(f));
  const r = jsQR(new Uint8ClampedArray(png.data.buffer, png.data.byteOffset, png.data.length), png.width, png.height);
  const ok = r && r.data.replace(/\/?$/, "/") === WANT;
  console.log((r ? (ok ? "ok    " : "WRONG ") : "none  ") + path.basename(f) + (r && !ok ? "  -> " + r.data : ""));
  if (r && !ok) bad++;
}
process.exit(bad ? 1 : 0);
