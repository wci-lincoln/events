// Builds the WhatsApp content calendar from whatsapp/calendar.js:
//   whatsapp/CALENDAR.md     the plan, day by day, with every caption
//   whatsapp/web/index.html  a phone page that opens on today's post with one-tap sharing
//   whatsapp/web/img/*       the day's cards, resized for phones
// Usage: node whatsapp.js      (then `node ../build.js` copies web/ into docs/shiloh-2026/share/)
const fs = require("fs"), path = require("path");
const { execFileSync } = require("child_process");
const { BASE, LINKS, LINK_NAMES, POSTS } = require("./whatsapp/calendar.js");

const OUT = path.join(__dirname, "out"), WA = path.join(__dirname, "whatsapp"), WEB = path.join(WA, "web"), IMG = path.join(WEB, "img");
fs.rmSync(WEB, { recursive: true, force: true });
fs.mkdirSync(IMG, { recursive: true });

// ---- checks -----------------------------------------------------------------------------------------------
const problems = [];
const sorted = [...POSTS].sort((a, b) => (a.date + a.send.padStart(7, "0")).localeCompare(b.date + b.send.padStart(7, "0")));
const OPEN = Date.UTC(2026, 11, 8);
for (const p of POSTS) {
  if (p.image && !fs.existsSync(path.join(OUT, p.image))) problems.push(`${p.date}: image missing, ${p.image}`);
  if (!p.caption.includes(p.url)) problems.push(`${p.date}: caption has no link`);
  if (!LINKS[p.link]) problems.push(`${p.date}: unknown link ${p.link}`);
  // A countdown card must carry the right number for the day it is sent.
  const m = p.image && p.image.match(/countdown\/(\d{4}-\d\d-\d\d)-(\d+)-days/);
  if (m && m[1] !== p.date) problems.push(`${p.date}: countdown card is dated ${m[1]}`);
  const left = Math.round((OPEN - Date.parse(p.date)) / 864e5);
  if (m && +m[2] !== left) problems.push(`${p.date}: card says ${m[2]} days, ${left} left`);
  const hit = (re) => re.test(p.caption.replace(/https?:\/\/\S+/g, ""));
  // Talking about transport or shirts always carries that section's link (the overview post lists them on purpose).
  if (!p.overview && p.type !== "Overview") {
    if (hit(/\b(bus|transport|lift)\b/i) && p.link !== "transport") problems.push(`${p.date}: mentions transport but links to ${p.link}`);
    if (hit(/\b(shirt|hoodie|polo)\b/i) && p.link !== "tshirt") problems.push(`${p.date}: mentions shirts but links to ${p.link}`);
  }
  if (/\b\d{1,2}(:\d\d)? ?(AM|PM)\b/.test(p.caption)) problems.push(`${p.date}: time not in the 9:20am style`);
  if (/\bwatch live|stream|livestream|to be confirmed|tbc|draft\b/i.test(p.caption)) problems.push(`${p.date}: banned wording`);
  // Every message must say who is inviting, label its facts, and end on a plain sentence before the link (no pointing hand).
  if (!/Winners Chapel/.test(p.caption)) problems.push(`${p.date}: never names Winners Chapel Lincoln`);
  // A venue line belongs only where the venue is part of the subject; a post that opts out (shirts, delegates, thanks) must not carry one.
  const hasPlace = /\*(Venue|Takes you to|Where):\*/.test(p.caption);
  if (!p.noVenue && !hasPlace) problems.push(`${p.date}: no labelled venue`);
  if (p.noVenue && /\*Venue:\*/.test(p.caption)) problems.push(`${p.date}: venue line on a post that opts out`);
  if (/👉/.test(p.caption)) problems.push(`${p.date}: pointing hand`);
  if (!new RegExp("\\n\\n[A-Z][^\\n]* at " + p.url.replace(/[.*+?^${}()|[\]\\]/g, "\\$&") + "$").test(p.caption)) problems.push(`${p.date}: last line is not "<words> at <link>"`);
}
if (problems.length) { console.error("Problems:\n  " + problems.join("\n  ")); process.exit(1); }

// ---- images, resized for phones ---------------------------------------------------------------------------
const files = new Map();
for (const p of POSTS) {
  if (!p.image) continue;
  if (!files.has(p.image)) {
    const base = path.basename(p.image, path.extname(p.image)), isGif = p.image.endsWith(".gif");
    const name = isGif ? base + ".gif" : base + ".jpg", src = path.join(OUT, p.image), dst = path.join(IMG, name);
    if (isGif) fs.copyFileSync(src, dst);
    else execFileSync("sips", ["-s", "format", "jpeg", "-s", "formatOptions", "82", src, "--out", dst], { stdio: "ignore" });
    files.set(p.image, name);
  }
  p.file = files.get(p.image);
}
const kb = Array.from(files.values()).reduce((s, f) => s + fs.statSync(path.join(IMG, f)).size, 0) / 1024;

// ---- CALENDAR.md ------------------------------------------------------------------------------------------
const fmt = iso => new Date(iso + "T12:00:00Z").toLocaleDateString("en-GB", { weekday: "short", day: "numeric", month: "short", timeZone: "UTC" });
const left = iso => Math.round((OPEN - Date.parse(iso)) / 864e5);
let md = `# Shiloh 2026 · WhatsApp content calendar

One post a day from Tuesday 17 November to Sunday 13 December, 28 posts in all. Each has one image, a short message
and one link that opens the part of the Shiloh page the post is about. Written to be forwarded as it is.

**Easiest way to send:** open the share page on your phone (it opens on today's post) and tap *Send on WhatsApp*.
The same messages are listed below if you would rather copy from here. The calendar is built from
\`whatsapp/calendar.js\`; edit there and run \`node whatsapp.js\`.

## How it runs

- **Actions first.** Until the last week, the days between the countdowns are the things people have to do, so they can plan:
  Shiloh shirts first (time sensitive, three posts), then free bus booking, classes, volunteering, UK Foreign Delegates and
  staying nearby. The softer posts (programme, invitation, theme) come in the last week.
- **Round countdown days** (20, 15, 10, 7, 5, 3 and 1 days to go) use the countdown card.
- **Every message** says who is inviting (Winners Chapel Lincoln), labels its facts (Date, Venue, Opens, Time) and ends with a
  plain line such as "Learn more at" or "Book your seat at" and the link.
- **Send at 8:00pm** each evening, except opening day. Shiloh week is different: the 5:00am sessions need a night's notice,
  so each day's "Tomorrow at Shiloh" card goes out at 8:00pm the evening before. Tuesday 8 December has two posts: the opening
  night in the morning, and Wednesday's card at 8:00pm.
- **Where the links go.** Transport posts open the free bus section, shirt posts open the shirt form, classes open the class
  booking, and so on. Posts about Shiloh in general open the landing page. The page scrolls to the section by itself.

| Link | Opens | Address |
| --- | --- | --- |
${Object.keys(LINKS).map(k => `| ${k} | ${LINK_NAMES[k]} | ${LINKS[k]} |`).join("\n")}

## Calendar

| Date | Send | Post | Image | Link |
| --- | --- | --- | --- | --- |
${sorted.map(p => `| ${fmt(p.date)} | ${p.send} | ${p.type} | ${p.image ? p.image : "none (text only, WhatsApp shows the page preview)"} | ${p.link} |`).join("\n")}

## The messages

Images are in \`publicity/out/\`, resized copies for phones in \`publicity/whatsapp/web/img/\`.

${sorted.map(p => `### ${fmt(p.date)} · ${p.send} · ${p.type}${left(p.date) > 0 && p.date < "2026-12-08" ? ` · ${left(p.date)} days to go` : ""}

Image: ${p.image ? "`" + p.image + "`" : "none"}

\`\`\`text
${p.caption}
\`\`\`
`).join("\n")}
## Spare cards, for any quiet day

- \`10-profile-badge.png\`: members' profile picture for Shiloh week.
- \`21-scan-me-story.gif\`: animated scan-me, for status. \`22-by-the-numbers.gif\`: 6 days, 4 sessions, 7 classes.
- \`06-classes-01.png\` to \`06-classes-07.png\`: one card per class, if you want to give a class its own day (the two spotlight
  slots can be swapped for any of these).
- \`40-poster-a4.png\`: the wall poster, for sending to someone who will print it.
`;
fs.writeFileSync(path.join(WA, "CALENDAR.md"), md);

// ---- the phone page ---------------------------------------------------------------------------------------
const data = sorted.map(p => ({ date: p.date, send: p.send, type: p.type, file: p.file ? "img/" + p.file : null, link: p.link, linkName: LINK_NAMES[p.link], url: p.url, caption: p.caption }));
const html = `<!doctype html>
<html lang="en-GB">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover">
<meta name="robots" content="noindex">
<meta name="theme-color" content="#3a0309">
<title>Shiloh 2026 · Today's post</title>
<link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700;800&family=Source+Sans+3:wght@400;600;700&display=swap">
<style>
:root{--crimson-deep:#3a0309;--crimson:#8a0f1e;--gold:#d9a63a;--gold-light:#f3d27a;--ivory:#fbf3e4;--bg:#f8efdd;--fg:#2a0a0f;--muted:rgba(42,10,15,.66);--line:rgba(138,15,30,.2);--card:#fffaf0;--ok:#1f8a55}
*{box-sizing:border-box}
html{-webkit-text-size-adjust:100%}
body{margin:0;background:var(--bg);color:var(--fg);font:400 17px/1.45 "Source Sans 3",system-ui,-apple-system,sans-serif;padding-bottom:env(safe-area-inset-bottom)}
header{background:var(--crimson-deep);color:var(--ivory);padding:calc(18px + env(safe-area-inset-top)) 16px 20px}
header .in{max-width:520px;margin:0 auto}
header small{display:block;letter-spacing:.14em;text-transform:uppercase;font-weight:700;font-size:12px;color:var(--gold-light)}
header h1{font:800 28px/1.1 "Playfair Display",Georgia,serif;margin:6px 0 4px}
header p{margin:0;color:rgba(251,243,228,.85);font-size:16px}
main{max-width:520px;margin:0 auto;padding:16px}
.nav{display:flex;align-items:center;justify-content:space-between;gap:8px;margin-bottom:12px}
.nav button{white-space:nowrap;font:600 15px/1 inherit;border:1px solid var(--line);background:var(--card);color:var(--crimson);border-radius:999px;padding:10px 14px;min-height:44px}
.nav button[disabled]{opacity:.35}
.nav .when{text-align:center;font-weight:700}
.nav .when small{display:block;font-weight:400;color:var(--muted);font-size:14px}
.post{background:var(--card);border:1px solid var(--line);border-radius:16px;overflow:hidden;margin-bottom:16px;box-shadow:0 6px 18px rgba(58,3,9,.07)}
.post .top{padding:14px 16px 10px}
.chips{display:flex;flex-wrap:wrap;gap:6px}
.chip{font-size:13px;font-weight:700;letter-spacing:.04em;border-radius:999px;padding:4px 10px;background:rgba(138,15,30,.09);color:var(--crimson)}
.chip.time{background:var(--crimson-deep);color:var(--gold-light)}
.post img.card{display:block;width:100%;height:auto;background:#e9dcc0}
.noimg{margin:0 16px;padding:12px 14px;border-radius:12px;background:rgba(217,166,58,.16);font-size:15px;color:var(--muted)}
.msg{margin:14px 16px 0;padding:14px;border-radius:12px;background:#fff;border-left:4px solid var(--gold);white-space:pre-wrap;word-break:break-word;font-size:16.5px}
.msg b{font-weight:700}
.goes{margin:10px 16px 0;font-size:14px;color:var(--muted)}
.goes a{color:var(--crimson);word-break:break-all}
.actions{display:grid;gap:8px;padding:14px 16px 16px}
.btn{font:700 17px/1 inherit;display:flex;align-items:center;justify-content:center;gap:8px;min-height:50px;border-radius:12px;border:1px solid var(--line);background:var(--card);color:var(--crimson);text-decoration:none;cursor:pointer;padding:0 14px}
.btn.primary{background:var(--crimson);border-color:var(--crimson);color:#fff}
.row2{display:grid;grid-template-columns:1fr 1fr;gap:8px}
h2{font:800 20px/1.2 "Playfair Display",Georgia,serif;color:var(--crimson);margin:26px 0 10px}
.list{display:grid;gap:8px}
.item{display:grid;grid-template-columns:56px 1fr;gap:12px;align-items:center;text-align:left;width:100%;border:1px solid var(--line);background:var(--card);border-radius:12px;padding:8px;font:inherit;color:inherit;cursor:pointer}
.item img,.item .ph{width:56px;height:56px;object-fit:cover;border-radius:8px;background:#e9dcc0;display:block}
.item .ph{display:grid;place-items:center;font-size:11px;color:var(--muted);text-align:center;line-height:1.1}
.item b{display:block;font-size:16px}
.item span{display:block;color:var(--muted);font-size:14px}
.item.sel{border-color:var(--crimson);box-shadow:inset 0 0 0 1px var(--crimson)}
.item.past{opacity:.55}
.tips{font-size:15px;color:var(--muted);margin-top:22px}
.tips li{margin:4px 0}
#toast{position:fixed;left:16px;right:16px;bottom:calc(16px + env(safe-area-inset-bottom));max-width:488px;margin:0 auto;background:var(--crimson-deep);color:#fff;border-radius:12px;padding:12px 14px;font-size:15px;opacity:0;transform:translateY(8px);transition:.2s;pointer-events:none;z-index:9}
#toast.on{opacity:1;transform:none}
@media (prefers-reduced-motion:reduce){#toast{transition:none}}
</style>
</head>
<body>
<header><div class="in"><small>Winners Chapel International Lincoln</small><h1>Shiloh 2026 · Today's post</h1><p id="sub">One post a day, ready to send.</p></div></header>
<main>
  <div class="nav"><button id="prev" type="button">‹ Back</button><div class="when" id="when"></div><button id="next" type="button">Next ›</button></div>
  <div id="posts"></div>
  <h2>The whole calendar</h2>
  <div class="list" id="list"></div>
  <ul class="tips">
    <li>Send one a day at the time shown. The message is written to be forwarded as it is.</li>
    <li>Each link opens the part of the Shiloh page the post is about.</li>
    <li>Send to your groups and your status. The more people who forward it on, the better.</li>
  </ul>
</main>
<div id="toast" role="status" aria-live="polite"></div>
<script>
const POSTS = ${JSON.stringify(data)};
const OPEN = Date.parse("2026-12-08T00:00:00Z");
const esc = s => s.replace(/[&<>]/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;" }[c]));
const rich = s => esc(s).replace(/\\*([^*\\n]+)\\*/g, "<b>$1</b>");
const dates = Array.from(new Set(POSTS.map(p => p.date)));
const todayLondon = () => new Intl.DateTimeFormat("en-CA", { timeZone: "Europe/London", year: "numeric", month: "2-digit", day: "2-digit" }).format(new Date());
const long = d => new Date(d + "T12:00:00Z").toLocaleDateString("en-GB", { weekday: "long", day: "numeric", month: "long", timeZone: "UTC" });
const short = d => new Date(d + "T12:00:00Z").toLocaleDateString("en-GB", { weekday: "short", day: "numeric", month: "short", timeZone: "UTC" });
const toast = (t) => { const el = document.getElementById("toast"); el.textContent = t; el.classList.add("on"); clearTimeout(toast.t); toast.t = setTimeout(() => el.classList.remove("on"), 4200); };
const files = {};   // pre-loaded images, so the share sheet opens straight from the tap
function preload(p) { if (!p.file || files[p.file]) return; files[p.file] = null; fetch(p.file).then(r => r.blob()).then(b => { files[p.file] = new File([b], p.file.split("/").pop(), { type: b.type }); }).catch(() => {}); }

let today = todayLondon(), sel = new URLSearchParams(location.search).get("d") || today;
if (!dates.includes(sel)) sel = sel < dates[0] ? dates[0] : sel > dates[dates.length - 1] ? dates[dates.length - 1] : (dates.filter(d => d <= sel).pop());

function copyText(t) {
  if (navigator.clipboard && window.isSecureContext) return navigator.clipboard.writeText(t).then(() => true, () => false);
  const ta = document.createElement("textarea"); ta.value = t; ta.style.position = "fixed"; ta.style.opacity = "0"; document.body.appendChild(ta); ta.select();
  let ok = false; try { ok = document.execCommand("copy"); } catch (e) {} ta.remove(); return Promise.resolve(ok);
}
function send(i) {
  const p = POSTS[i], file = p.file && files[p.file];
  const wa = () => { window.open("https://wa.me/?text=" + encodeURIComponent(p.caption), "_blank"); toast(p.file ? "Message opened in WhatsApp. Save the image and attach it." : "Opened in WhatsApp."); };
  if (file && navigator.canShare && navigator.canShare({ files: [file] })) {
    copyText(p.caption);   // WhatsApp on some phones drops the text when an image is shared, so it is on the clipboard too
    navigator.share({ files: [file], text: p.caption }).then(() => toast("Message copied too. If it did not appear under the image, paste it."), e => { if (e && e.name !== "AbortError") wa(); });
  } else wa();
}
function render() {
  const day = POSTS.map((p, i) => [p, i]).filter(([p]) => p.date === sel);
  const n = Math.round((OPEN - Date.parse(sel + "T00:00:00Z")) / 864e5);
  document.getElementById("when").innerHTML = (sel === today ? "Today · " : "") + long(sel) + "<small>" + (n > 0 ? n + " days to Shiloh" : n === 0 ? "Shiloh opens today" : "Shiloh week") + "</small>";
  document.getElementById("prev").disabled = dates.indexOf(sel) === 0;
  document.getElementById("next").disabled = dates.indexOf(sel) === dates.length - 1;
  document.getElementById("sub").textContent = today < dates[0] ? "The first post goes out on " + long(dates[0]) + "." : today > dates[dates.length - 1] ? "Shiloh 2026 is done. Thank you for sharing it." : "One post a day, ready to send.";
  document.getElementById("posts").innerHTML = day.map(([p, i]) => \`<article class="post">
    <div class="top"><div class="chips"><span class="chip time">Send at \${p.send}</span><span class="chip">\${esc(p.type)}</span></div></div>
    \${p.file ? \`<img class="card" src="\${p.file}" alt="" width="1080" height="\${/invite|programme/.test(p.file) ? 1920 : 1080}">\` : \`<div class="noimg">Text only. WhatsApp shows the Shiloh page preview under the message.</div>\`}
    <div class="msg">\${rich(p.caption)}</div>
    <div class="goes">The link opens: <a href="\${p.url}" target="_blank" rel="noopener">\${esc(p.linkName)}</a></div>
    <div class="actions">
      <button class="btn primary" type="button" data-send="\${i}">Send on WhatsApp</button>
      <div class="row2"><button class="btn" type="button" data-copy="\${i}">Copy message</button>\${p.file ? \`<a class="btn" href="\${p.file}" download>Save image</a>\` : \`<a class="btn" href="\${p.url}" target="_blank" rel="noopener">Test the link</a>\`}</div>
    </div></article>\`).join("");
  day.forEach(([p]) => preload(p));
  document.getElementById("list").innerHTML = POSTS.map((p, i) => \`<button type="button" class="item\${p.date === sel ? " sel" : ""}\${p.date < today ? " past" : ""}" data-date="\${p.date}">\${p.file ? \`<img src="\${p.file}" alt="" loading="lazy" width="56" height="56">\` : \`<div class="ph">text only</div>\`}<div><b>\${short(p.date)} · \${p.send}</b><span>\${esc(p.type)}</span></div></button>\`).join("");
}
document.addEventListener("click", e => {
  const s = e.target.closest("[data-send]"), c = e.target.closest("[data-copy]"), it = e.target.closest("[data-date]");
  if (s) send(+s.dataset.send);
  else if (c) copyText(POSTS[+c.dataset.copy].caption).then(ok => toast(ok ? "Message copied. Paste it into WhatsApp." : "Could not copy. Press and hold the message to select it."));
  else if (it) { sel = it.dataset.date; history.replaceState(null, "", "?d=" + sel); render(); window.scrollTo({ top: 0, behavior: "smooth" }); }
});
const step = k => { const j = dates.indexOf(sel) + k; if (dates[j]) { sel = dates[j]; history.replaceState(null, "", "?d=" + sel); render(); } };
document.getElementById("prev").onclick = () => step(-1); document.getElementById("next").onclick = () => step(1);
render();
</script>
</body>
</html>
`;
fs.writeFileSync(path.join(WEB, "index.html"), html);
console.log(`${POSTS.length} posts, ${files.size} images (${kb.toFixed(0)} KB) -> whatsapp/CALENDAR.md, whatsapp/web/`);
