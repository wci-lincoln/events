// Captures frames of the animations to preview/ so the motion can be checked as stills.
// node frames.js            -> the three GIF animations
// node frames.js countdown  -> every countdown design, wide and square, at four moments
// node frames.js projector  -> the projector film at the middle of each scene
const fs = require("fs"), path = require("path"); const puppeteer = require("puppeteer-core");
const which = process.argv[2] || "anims";
const SETS = {
  anims: [["anim-theme.html", "", 720, 720, [0.3, 1.0, 1.6, 2.4, 3.4, 4.6]], ["anim-scan.html", "", 540, 960, [0.2, 0.8, 1.4, 2.2]], ["anim-stats.html", "", 720, 720, [0.6, 1.8, 2.8, 3.8, 5.4]]],
  countdown: [1, 2, 3, 4, 5].flatMap(v => [[`countdown-anim.html`, `n=${[30, 27, 23, 16, 20][v - 1]}&d=8%20November&s=Sunday%20Service&v=${v}`, 1280, 720, [0.5, 1.2, 2.0, 3.9]], [`countdown-anim.html`, `n=${[9, 13, 6, 16, 2][v - 1]}&d=2%20December&s=Midweek%20Service&v=${v}`, 720, 720, [0.5, 1.2, 2.0, 3.9]]]),
  projector: [["projector.html", "", 1920, 1080, process.env.TIMES ? process.env.TIMES.split(",").map(Number) : [1.0, 3.2, 7.4, 10.5, 15, 17.5, 23.5, 27, 30, 32.5, 36.5, 39, 43, 45, 48, 52]]],
};
(async () => {
  fs.rmSync("preview", { recursive: true, force: true }); fs.mkdirSync("preview");
  const b = await puppeteer.launch({ executablePath: "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome", headless: true, args: ["--no-first-run", "--disable-gpu", "--hide-scrollbars", "--allow-file-access-from-files"] });
  const p = await b.newPage();
  for (const [file, q, w, h, times] of SETS[which]) {
    await p.setViewport({ width: w, height: h }); await p.goto("file://" + path.resolve("src", file) + "?" + (q ? q + "&" : "") + `w=${w}&h=${h}`, { waitUntil: "load" });
    await p.evaluate(async () => { await document.fonts.ready; await Promise.all([...document.images].map(i => i.complete ? 0 : new Promise(r => { i.onload = i.onerror = r; }))); });
    const tag = file.replace(".html", "") + (q ? "-" + (q.match(/v=(\d)/) || [, ""])[1] + "-" + w : "");
    for (const t of times) { await p.evaluate(t => document.getAnimations().forEach(a => { a.pause(); a.currentTime = t; }), t * 1000); await p.screenshot({ path: `preview/${tag}-${t.toFixed(1).padStart(4, "0")}s.png` }); }
  }
  await b.close(); console.log("preview frames written:", fs.readdirSync("preview").length);
})();
