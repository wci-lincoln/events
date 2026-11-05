// Contact sheet of everything in out/ for a quick visual review.
const fs = require("fs"), path = require("path"); const puppeteer = require("puppeteer-core");
(async () => {
  const files = fs.readdirSync(process.argv[3] || "out").filter(f => f.endsWith(".png")).sort();
  const html = `<html><body style="margin:0;background:#222;padding:20px;display:flex;flex-wrap:wrap;gap:20px;align-items:flex-start">${files.map(f => `<figure style="margin:0;color:#ddd;font:14px sans-serif;text-align:center"><img src="file://${path.resolve(process.argv[3] || "out", f)}" style="height:${process.argv[2] || 560}px;display:block"><figcaption>${f}</figcaption></figure>`).join("")}</body></html>`;
  const b = await puppeteer.launch({ executablePath: "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome", headless: true, args: ["--no-first-run", "--disable-gpu", "--hide-scrollbars", "--allow-file-access-from-files"] });
  const p = await b.newPage(); await p.setViewport({ width: 2600, height: 1200 }); fs.writeFileSync("sheet.html", html); await p.goto("file://" + path.resolve("sheet.html"), { waitUntil: "load" }); await p.evaluate(() => Promise.all([...document.images].map(i => i.complete ? 0 : new Promise(r => { i.onload = i.onerror = r; }))));
  await p.screenshot({ path: "sheet.png", fullPage: true }); await b.close(); console.log("sheet.png", files.length, "images");
})();
