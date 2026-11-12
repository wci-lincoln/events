// One frozen frame of a template, for review: node frame.js <template.html> "<query>" <w> <h> <seconds> <out.png>
const path = require("path"); const puppeteer = require("puppeteer-core");
const [file, q, w, h, t, out] = process.argv.slice(2);
(async () => {
  const b = await puppeteer.launch({ executablePath: "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome", headless: true, args: ["--no-first-run", "--disable-gpu", "--hide-scrollbars", "--allow-file-access-from-files"] });
  const p = await b.newPage(); await p.setViewport({ width: +w, height: +h, deviceScaleFactor: 1 });
  await p.goto("file://" + path.join(__dirname, "src", file) + (q ? "?" + q + "&" : "?") + `w=${w}&h=${h}`, { waitUntil: "load" });
  await p.evaluate(async () => { await document.fonts.ready; await Promise.all([...document.images].map(i => i.complete ? 0 : new Promise(r => { i.onload = i.onerror = r; }))); });
  await p.evaluate(t => { document.getAnimations().forEach(a => { a.pause(); a.currentTime = t; }); }, +t * 1000);
  await p.screenshot({ path: out, type: "png" }); await b.close();
})().catch(e => { console.error(e); process.exit(1); });
