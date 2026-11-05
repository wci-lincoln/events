// Renders the publicity kit: PNG cards and GIF animations from the HTML templates in src/.
// Usage: node build.js [name-filter]
const fs = require("fs"), path = require("path");
const puppeteer = require("puppeteer-core");
const { PNG } = require("pngjs");
const { GIFEncoder, quantize, applyPalette } = require("gifenc");
const CHROME = "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome";
const SRC = path.join(__dirname, "src"), OUT = path.join(__dirname, "out");
const url = (file, q) => "file://" + path.join(SRC, file) + (q ? "?" + q : "");

const CLASSES = ["Healing, Health and Wholeness", "Breaking Generational Curses", "Breaking Marital Siege", "Successful Christian Family", "Business and Career Breakthrough", "Keys to Academic Success", "Fathers and Mothers of Nations"];
const STILLS = [
  { out: "01-announce-story.png",      file: "announce.html",  q: "size=story",  w: 1080, h: 1920 },
  { out: "02-announce-square.png",     file: "announce.html",  q: "size=square", w: 1080, h: 1080 },
  { out: "03-announce-fb-cover.png",   file: "announce.html",  q: "size=cover",  w: 1640, h: 924 },
  { out: "04-programme-story.png",     file: "programme.html", q: "",            w: 1080, h: 1920 },
  { out: "05-bus-square.png",          file: "bus.html",       q: "",            w: 1080, h: 1080 },
  { out: "06-classes-00-cover.png",    file: "classes.html",   q: "i=-1",        w: 1080, h: 1080 },
  ...CLASSES.map((c, i) => ({ out: `06-classes-0${i + 1}.png`, file: "classes.html", q: "i=" + i, w: 1080, h: 1080 })),
  { out: "07-invite-story.png",        file: "invite.html",    q: "",            w: 1080, h: 1920 },
  { out: "08-delegates-square.png",    file: "delegates.html", q: "",            w: 1080, h: 1080 },
  { out: "09-volunteer-square.png",    file: "volunteer.html", q: "",            w: 1080, h: 1080 },
  { out: "10-profile-badge.png",       file: "dp.html",        q: "",            w: 1080, h: 1080 },
  ...[30, 14, 7, 3, 1, 0].map(n => ({ out: `11-countdown-${String(n).padStart(2, "0")}.png`, file: "countdown.html", q: "n=" + n, w: 1080, h: 1920 })),
];
const ANIMS = [
  { out: "20-theme-reveal.gif",  file: "anim-theme.html", w: 720, h: 720,  fps: 12, seconds: 5 },
  { out: "21-scan-me-story.gif", file: "anim-scan.html",  w: 540, h: 960,  fps: 12, seconds: 3, paletteAt: 0.4 },
  { out: "22-by-the-numbers.gif",file: "anim-stats.html", w: 720, h: 720,  fps: 12, seconds: 6 },
];

async function ready(page) {
  await page.evaluate(async () => {
    await document.fonts.ready;
    await Promise.all([...document.images].map(i => i.complete ? 0 : new Promise(r => { i.onload = i.onerror = r; })));
  });
}
async function freeze(page, t) {
  await page.evaluate(t => { document.getAnimations().forEach(a => { a.pause(); a.currentTime = t; }); }, t);
}
(async () => {
  const filter = process.argv[2] || "";
  fs.mkdirSync(OUT, { recursive: true });
  const browser = await puppeteer.launch({ executablePath: CHROME, headless: true, timeout: 60000, args: ["--no-first-run", "--no-default-browser-check", "--disable-gpu", "--hide-scrollbars", "--allow-file-access-from-files"] });
  const page = await browser.newPage();
  for (const a of STILLS.filter(a => a.out.includes(filter))) {
    await page.setViewport({ width: a.w, height: a.h, deviceScaleFactor: 1 });
    await page.goto(url(a.file, a.q), { waitUntil: "load" }); await ready(page);
    await page.screenshot({ path: path.join(OUT, a.out), type: "png" });
    console.log("png ", a.out);
  }
  for (const a of ANIMS.filter(a => a.out.includes(filter))) {
    await page.setViewport({ width: a.w, height: a.h, deviceScaleFactor: 1 });
    await page.goto(url(a.file, `w=${a.w}&h=${a.h}`), { waitUntil: "load" }); await ready(page);
    const frames = Math.round(a.fps * a.seconds), delay = Math.round(1000 / a.fps);
    const grab = async t => { await freeze(page, t); const png = PNG.sync.read(await page.screenshot({ type: "png" })); return new Uint8Array(png.data.buffer, png.data.byteOffset, png.data.length); };
    // One palette for the whole GIF, built from the frame with the most content, so still areas compress and nothing flickers.
    const palette = quantize(await grab(a.paletteAt != null ? a.paletteAt * 1000 : (a.seconds - 0.05) * 1000), 256, { format: "rgb444" });
    const gif = GIFEncoder();
    for (let i = 0; i < frames; i++) {
      const rgba = await grab((i / a.fps) * 1000);
      gif.writeFrame(applyPalette(rgba, palette, "rgb444"), a.w, a.h, { palette, delay, repeat: 0 });
    }
    gif.finish();
    fs.writeFileSync(path.join(OUT, a.out), gif.bytes());
    console.log("gif ", a.out, (fs.statSync(path.join(OUT, a.out)).size / 1e6).toFixed(1) + " MB");
  }
  await browser.close();
})().catch(e => { console.error(e); process.exit(1); });
