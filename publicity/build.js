// Renders the publicity kit: PNG cards, GIF animations and MP4 videos from the HTML templates in src/.
// Usage: node build.js [name-filter]
// MP4s use the ffmpeg bundled by the ffmpeg-static package (npm install), falling back to one on the PATH.
const fs = require("fs"), path = require("path"), os = require("os");
const { execFileSync, spawnSync } = require("child_process");
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
// GIFs render at the template's native size for a small file. Entries with `mp4` also render the same template at
// `scale` for a 1080px video at 30 fps, repeating the animation `loops` times, since Reels and Status like a few seconds of play.
const ANIMS = [
  { out: "20-theme-reveal.gif",  file: "anim-theme.html", w: 720, h: 720,  fps: 12, seconds: 5, mp4: true, scale: 1.5, loops: 2 },
  { out: "21-scan-me-story.gif", file: "anim-scan.html",  w: 540, h: 960,  fps: 12, seconds: 3, paletteAt: 0.4, mp4: true, scale: 2, loops: 3 },
  { out: "22-by-the-numbers.gif",file: "anim-stats.html", w: 720, h: 720,  fps: 12, seconds: 6, mp4: true, scale: 1.5, loops: 2 },
];
// One countdown per service day between now and the opening night: [date, label, service, days left, design 1-5].
const SERVICES = [
  ["2026-11-08", "8 November",  "Sunday Service", 30, 1], ["2026-11-11", "11 November", "Midweek Service", 27, 2],
  ["2026-11-15", "15 November", "Sunday Service", 23, 3], ["2026-11-18", "18 November", "Midweek Service", 20, 5],
  ["2026-11-22", "22 November", "Sunday Service", 16, 4], ["2026-11-25", "25 November", "Midweek Service", 13, 2],
  ["2026-11-29", "29 November", "Sunday Service",  9, 1], ["2026-12-02", "2 December",  "Midweek Service",  6, 3],
  ["2026-12-06", "6 December",  "Sunday Service",  2, 5],
];
for (const [iso, d, svc, n, v] of SERVICES) {
  const base = `countdown/${iso}-${String(n).padStart(2, "0")}-days`, q = `n=${n}&d=${encodeURIComponent(d)}&s=${encodeURIComponent(svc)}&v=${v}`;
  ANIMS.push({ out: base + "-wide.gif",   file: "countdown-anim.html", q, w: 1280, h: 720, fps: 12, seconds: 4, mp4: true, scale: 1.5, loops: 2, paletteAt: 3.9 });
  ANIMS.push({ out: base + "-square.gif", file: "countdown-anim.html", q, w: 720,  h: 720, fps: 12, seconds: 4, paletteAt: 3.9 });
}
// Video only: the projector film shown in church while announcements are read.
const VIDEOS = [{ out: "30-projector-announcement.mp4", file: "projector.html", w: 1920, h: 1080, seconds: 54, scale: 1, loops: 1 }];
const MP4_FPS = 30;
const FFMPEG = (() => { try { return require("ffmpeg-static"); } catch { return "ffmpeg"; } })();
const hasFfmpeg = () => spawnSync(FFMPEG, ["-version"], { stdio: "ignore" }).status === 0;

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
  // The church logo as kit assets: full colour and a white knockout for dark grounds, both on transparent backgrounds.
  for (const [from, to] of [["logo.png", "00-logo-colour.png"], ["logo-white.png", "00-logo-white.png"]]) if (to.includes(filter)) { fs.copyFileSync(path.join(SRC, from), path.join(OUT, to)); console.log("copy", to); }
  const browser = await puppeteer.launch({ executablePath: CHROME, headless: true, timeout: 60000, args: ["--no-first-run", "--no-default-browser-check", "--disable-gpu", "--hide-scrollbars", "--allow-file-access-from-files"] });
  const page = await browser.newPage();
  for (const a of STILLS.filter(a => a.out.includes(filter))) {
    await page.setViewport({ width: a.w, height: a.h, deviceScaleFactor: 1 });
    await page.goto(url(a.file, a.q), { waitUntil: "load" }); await ready(page);
    await page.screenshot({ path: path.join(OUT, a.out), type: "png" });
    console.log("png ", a.out);
  }
  const q = a => (a.q ? a.q + "&" : "") + `w=${a.w}&h=${a.h}`;
  for (const a of ANIMS.filter(a => a.out.includes(filter))) {
    fs.mkdirSync(path.dirname(path.join(OUT, a.out)), { recursive: true });
    await page.setViewport({ width: a.w, height: a.h, deviceScaleFactor: 1 });
    await page.goto(url(a.file, q(a)), { waitUntil: "load" }); await ready(page);
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
  const videos = [...ANIMS.filter(a => a.mp4), ...VIDEOS].filter(a => a.out.replace(".gif", ".mp4").includes(filter));
  if (videos.length && !hasFfmpeg()) console.log("mp4  skipped: ffmpeg not found (npm install)");
  else for (const a of videos) {
    const out = a.out.replace(".gif", ".mp4"), tmp = fs.mkdtempSync(path.join(os.tmpdir(), "shiloh-frames-"));
    fs.mkdirSync(path.dirname(path.join(OUT, out)), { recursive: true });
    await page.setViewport({ width: a.w, height: a.h, deviceScaleFactor: a.scale });
    await page.goto(url(a.file, q(a)), { waitUntil: "load" }); await ready(page);
    const frames = Math.round(MP4_FPS * a.seconds);
    for (let i = 0; i < frames; i++) {
      await freeze(page, (i / MP4_FPS) * 1000);
      await page.screenshot({ path: path.join(tmp, `f-${String(i).padStart(4, "0")}.png`), type: "png" });
    }
    // H.264, 4:2:0, even dimensions, faststart: what WhatsApp, Instagram, Facebook and TikTok all accept.
    execFileSync(FFMPEG, ["-y", "-loglevel", "error", "-stream_loop", String(a.loops - 1), "-framerate", String(MP4_FPS),
      "-i", path.join(tmp, "f-%04d.png"), "-c:v", "libx264", "-preset", "slow", "-crf", "20", "-pix_fmt", "yuv420p",
      "-vf", "scale=trunc(iw/2)*2:trunc(ih/2)*2", "-r", String(MP4_FPS), "-movflags", "+faststart", "-an", path.join(OUT, out)]);
    fs.rmSync(tmp, { recursive: true, force: true });
    console.log("mp4 ", out, (fs.statSync(path.join(OUT, out)).size / 1e6).toFixed(1) + " MB");
  }
  await browser.close();
})().catch(e => { console.error(e); process.exit(1); });
