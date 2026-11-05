// Captures a few frames of each animation to preview/ so the motion can be checked as stills.
const fs = require("fs"), path = require("path"); const puppeteer = require("puppeteer-core");
const ANIMS = [["anim-theme.html", 720, 720, [0.3, 1.0, 1.6, 2.4, 3.4, 4.6]], ["anim-scan.html", 540, 960, [0.2, 0.8, 1.4, 2.2]], ["anim-stats.html", 720, 720, [0.6, 1.8, 2.8, 3.8, 5.4]]];
(async () => {
  fs.rmSync("preview", { recursive: true, force: true }); fs.mkdirSync("preview");
  const b = await puppeteer.launch({ executablePath: "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome", headless: true, args: ["--no-first-run", "--disable-gpu", "--hide-scrollbars", "--allow-file-access-from-files"] });
  const p = await b.newPage();
  for (const [file, w, h, times] of ANIMS) {
    await p.setViewport({ width: w, height: h }); await p.goto("file://" + path.resolve("src", file), { waitUntil: "load" });
    await p.evaluate(async () => { await document.fonts.ready; });
    for (const t of times) { await p.evaluate(t => document.getAnimations().forEach(a => { a.pause(); a.currentTime = t; }), t * 1000); await p.screenshot({ path: `preview/${file.replace(".html", "")}-${t.toFixed(1)}s.png` }); }
  }
  await b.close(); console.log("preview frames written");
})();
