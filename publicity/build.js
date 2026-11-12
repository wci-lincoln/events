// Renders the publicity kit: PNG cards, GIF animations and MP4 videos from the HTML templates in src/.
// Usage: node build.js [name-filter]      then node pack.js to build the two team folders and zips
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
  { out: "40-poster-a4.png",           file: "poster.html",    q: "",            w: 1240, h: 1754, scale: 2 },
  // Shiloh week: one "Today at Shiloh" card per day, for the groups (square), status (story) and the screen (wide).
  ...[1, 2, 3, 4, 5, 6].flatMap(d => [["square", 1080, 1080], ["story", 1080, 1920], ["wide", 1920, 1080]].map(([size, w, h]) => ({ out: `today/2026-12-${String(7 + d).padStart(2, "0")}-day-${d}-${size}.png`, file: "today.html", q: `day=${d}&size=${size}`, w, h }))),
  // Projector slides: each scene of the announcement film, frozen once it has fully arrived, as a 1920×1080 PNG.
  ...[["01-lockup", 5.5], ["02-theme", 16.5], ["03-dates-venue", 28.5], ["04-a-day-at-shiloh", 44.5], ["05-free-bus", 56.5], ["06-classes", 71.5], ["07-also-on-the-page", 83.5], ["08-scan", 108.5]]
    .map(([name, at]) => ({ out: `slides/${name}.png`, file: "projector.html", q: "", w: 1920, h: 1080, at })),
];
// Every day from tomorrow to the opening night: days left, date label, weekday, and the service if it is a Sunday or Wednesday.
// The five countdown designs rotate day by day, so the social post and the projector slide for one day always match.
const OPEN = Date.UTC(2026, 11, 8);
const MONTHS = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
const WEEKDAYS = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
const DAYS = Array.from({ length: 31 }, (_, i) => {
  const n = 30 - i, dt = new Date(OPEN - n * 864e5), wd = dt.getUTCDay();
  const svc = n > 0 && wd === 0 ? "Sunday Service" : n > 0 && wd === 3 ? "Midweek Service" : "";
  return { n, iso: dt.toISOString().slice(0, 10), d: `${dt.getUTCDate()} ${MONTHS[dt.getUTCMonth()]}`, wd: WEEKDAYS[wd], svc, v: (i % 5) + 1,
    base: `countdown/${dt.toISOString().slice(0, 10)}-${String(n).padStart(2, "0")}-days`, q: `n=${n}&d=${encodeURIComponent(`${dt.getUTCDate()} ${MONTHS[dt.getUTCMonth()]}`)}&s=${encodeURIComponent(svc)}&v=${(i % 5) + 1}` };
});
const SERVICE_DAYS = DAYS.filter(d => d.svc);
for (const d of DAYS) {
  // Stills of the animation at its final frame: the still countdown cards for status and the feed.
  STILLS.push({ out: d.base + "-square.png", file: "countdown-anim.html", q: d.q, w: 720, h: 720, scale: 1.5, at: 3.9 });
  STILLS.push({ out: d.base + "-story.png",  file: "countdown-anim.html", q: d.q, w: 540, h: 960, scale: 2, at: 3.9 });
}
// GIFs render at the template's native size for a small file. Entries with `mp4` also render the same template at
// `scale` for a 1080px video at 30 fps, repeating the animation `loops` times, since Reels and Status like a few seconds of play.
// `hold` keeps the finished frame on screen for that many seconds before the loop repeats, so everything can be read
// (one long-delay frame in a GIF, repeated frames in an MP4).
const ANIMS = [
  { out: "20-theme-reveal.gif",  file: "anim-theme.html", w: 720, h: 720,  fps: 12, seconds: 5, hold: 5, mp4: true, scale: 1.5, loops: 2 },
  { out: "21-scan-me-story.gif", file: "anim-scan.html",  w: 540, h: 960,  fps: 12, seconds: 9, paletteAt: 0.4, mp4: true, scale: 2, loops: 2 },
  { out: "22-by-the-numbers.gif",file: "anim-stats.html", w: 720, h: 720,  fps: 12, seconds: 6, hold: 6, mp4: true, scale: 1.5, loops: 2 },
];
// Print: the A4 wall poster as a vector PDF, the frame scaled to the paper (print=1).
const PDFS = [{ out: "40-poster-a4.pdf", file: "poster.html", q: "print=1", w: 1240, h: 1754 }];
// Video only: the projector film shown in church while announcements are read.
const VIDEOS = [{ out: "30-projector-announcement.mp4", file: "projector.html", w: 1920, h: 1080, seconds: 110, scale: 1, loops: 1 }];
// The giant-number design runs 8 seconds so its strip keeps scrolling at a readable pace; the others animate in over 4
// seconds and then hold for 6, so every loop shows the finished card for long enough to read the details.
const loop = d => d.v === 1 && d.n > 0 ? { seconds: 8, loops: 2 } : { seconds: 4, hold: 6, loops: 2 };
for (const d of DAYS) {
  ANIMS.push({ out: d.base + "-square.gif", file: "countdown-anim.html", q: d.q, w: 720, h: 720, fps: 12, paletteAt: 3.9, ...loop(d) });
  VIDEOS.push({ out: d.base + "-story.mp4", file: "countdown-anim.html", q: d.q, w: 540, h: 960, scale: 2, ...loop(d) });
}
for (const d of SERVICE_DAYS) {
  ANIMS.push({ out: d.base + "-wide.gif", file: "countdown-anim.html", q: d.q, w: 1280, h: 720, fps: 12, mp4: true, scale: 1.5, paletteAt: 3.9, ...loop(d) });
  VIDEOS.push({ out: d.base + "-screensaver.mp4", file: "ambient.html", q: d.q, w: 1920, h: 1080, seconds: 60, scale: 1, loops: 1, vfps: 24 });
}
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
if (require.main === module) (async () => {
  const filter = process.argv[2] || "";
  fs.mkdirSync(OUT, { recursive: true });
  // The church logo as kit assets: full colour and a white knockout for dark grounds, both on transparent backgrounds.
  for (const [from, to] of [["logo.png", "00-logo-colour.png"], ["logo-white.png", "00-logo-white.png"]]) if (to.includes(filter)) { fs.copyFileSync(path.join(SRC, from), path.join(OUT, to)); console.log("copy", to); }
  const browser = await puppeteer.launch({ executablePath: CHROME, headless: true, timeout: 60000, args: ["--no-first-run", "--no-default-browser-check", "--disable-gpu", "--hide-scrollbars", "--allow-file-access-from-files"] });
  const page = await browser.newPage();
  const q = a => (a.q ? a.q + "&" : "") + `w=${a.w}&h=${a.h}`;
  for (const a of STILLS.filter(a => a.out.includes(filter))) {
    fs.mkdirSync(path.dirname(path.join(OUT, a.out)), { recursive: true });
    await page.setViewport({ width: a.w, height: a.h, deviceScaleFactor: a.scale || 1 });
    await page.goto(url(a.file, a.at != null ? q(a) : a.q), { waitUntil: "load" }); await ready(page);
    if (a.at != null) await freeze(page, a.at * 1000);
    await page.screenshot({ path: path.join(OUT, a.out), type: "png" });
    console.log("png ", a.out);
  }
  for (const a of PDFS.filter(a => a.out.includes(filter))) {
    await page.setViewport({ width: a.w, height: a.h, deviceScaleFactor: 1 });
    await page.goto(url(a.file, a.q), { waitUntil: "load" }); await ready(page);
    await page.pdf({ path: path.join(OUT, a.out), width: "210mm", height: "297mm", printBackground: true, preferCSSPageSize: true, pageRanges: "1", margin: { top: 0, right: 0, bottom: 0, left: 0 } });
    console.log("pdf ", a.out, (fs.statSync(path.join(OUT, a.out)).size / 1e6).toFixed(1) + " MB");
  }
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
    if (a.hold) gif.writeFrame(applyPalette(await grab((a.seconds - 0.02) * 1000), palette, "rgb444"), a.w, a.h, { palette, delay: Math.round(a.hold * 1000), repeat: 0 });
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
    const fps = a.vfps || MP4_FPS, frames = Math.round(fps * a.seconds);
    for (let i = 0; i < frames; i++) {
      await freeze(page, (i / fps) * 1000);
      await page.screenshot({ path: path.join(tmp, `f-${String(i).padStart(4, "0")}.png`), type: "png" });
    }
    for (let i = frames; i < frames + Math.round(fps * (a.hold || 0)); i++) fs.copyFileSync(path.join(tmp, `f-${String(frames - 1).padStart(4, "0")}.png`), path.join(tmp, `f-${String(i).padStart(4, "0")}.png`));
    // H.264, 4:2:0, even dimensions, faststart: what WhatsApp, Instagram, Facebook and TikTok all accept.
    execFileSync(FFMPEG, ["-y", "-loglevel", "error", "-stream_loop", String(a.loops - 1), "-framerate", String(fps),
      "-i", path.join(tmp, "f-%04d.png"), "-c:v", "libx264", "-preset", "slow", "-crf", "20", "-pix_fmt", "yuv420p",
      "-vf", "scale=trunc(iw/2)*2:trunc(ih/2)*2", "-r", String(fps), "-movflags", "+faststart", "-an", path.join(OUT, out)]);
    fs.rmSync(tmp, { recursive: true, force: true });
    console.log("mp4 ", out, (fs.statSync(path.join(OUT, out)).size / 1e6).toFixed(1) + " MB");
  }
  await browser.close();
})().catch(e => { console.error(e); process.exit(1); });
module.exports = { DAYS, SERVICE_DAYS };
