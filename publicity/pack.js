// Packs the rendered files in out/ into two hand-over folders, one per team, each with its own guide, and zips them:
//   kit/Shiloh 2026 - Social Media (publicity team)/      square and story files, day by day, with captions
//   kit/Shiloh 2026 - Church Projection (media team)/     landscape files for the screen, service day by service day
// Usage: node pack.js        (run after node build.js)
const fs = require("fs"), path = require("path");
const { execFileSync } = require("child_process");
const { DAYS, SERVICE_DAYS } = require("./build.js");
const OUT = path.join(__dirname, "out"), KIT = path.join(__dirname, "kit");
const SOCIAL = path.join(KIT, "Shiloh 2026 - Social Media (publicity team)");
const SCREEN = path.join(KIT, "Shiloh 2026 - Church Projection (media team)");
const URL = "https://wci-lincoln.github.io/events/shiloh-2026/";
const HASH = "#Shiloh2026 #FarAbove #WCILincoln #WinnersChapelLincoln #Lincoln #LivingFaithChurch";
const DESIGN = { 1: "Giant number", 2: "Calendar grid", 3: "Flip clock", 4: "Papa and seal", 5: "Number in words" };
const pad = n => String(n).padStart(2, "0");
const copy = (from, toDir, rename) => { const src = path.join(OUT, from); if (!fs.existsSync(src)) { console.warn("missing", from); return; } fs.mkdirSync(toDir, { recursive: true }); fs.copyFileSync(src, path.join(toDir, rename || path.basename(from))); };
const write = (dir, name, text) => { fs.mkdirSync(dir, { recursive: true }); fs.writeFileSync(path.join(dir, name), text.replace(/^\n/, "")); };
const dayLabel = d => `${d.iso} ${d.wd.slice(0, 3)} - ${d.n === 0 ? "opening night" : d.n + (d.n === 1 ? " day" : " days")}`;

const CAPTIONS = {
  announce: `Shiloh 2026 comes to Lincoln. 🔥 Far Above: Tuesday 8 to Sunday 13 December, every session live at Moorland Community Centre, LN6 7NH. Programme, free transport, specialised classes and more on one page. Scan or tap the link in bio. Come expecting, and bring someone with you.`,
  programme: `A day at Shiloh in Lincoln: 5:00 AM Shiloh Prayer Hour, 6:15 AM Hour of Visitation, 11:30 AM Specialised Classes, 5:00 PM Encounter Night. Friday is Victory Celebration Night. Saturday 5:00 AM is the Impartation Service. Sunday, two Thanksgiving Services. Be in every one.`,
  bus: `Nobody should miss Shiloh because of a lift. Free buses to every session from the University of Lincoln, Newark, Gainsborough and Grimsby. Book your seat on the page. Got a car? Fill it on the way.`,
  classes: `Seven specialised classes, 11:30 AM Wednesday to Friday. Pick the one you need, or a different one each day. Swipe for what each class is about, then book your place.`,
  invite: `I'm going to Shiloh 2026, and I'd love you to come with me. Six days of prayer, the Word and real encounters with God, right here in Lincoln. Everything you need is one scan away. I'll save you a seat. 🙏`,
  delegates: `Want to be at Shiloh on ground at Canaanland this year? A delegation from the UK goes every year. Register your interest on the page and the team will be in touch with all the details.`,
  volunteer: `Shiloh in Lincoln runs on people like you. Driving, welcome, media, hospitality, children, protocol, set-up, outreach, intercession, first aid. Pick your unit and the sessions you can cover. Sign up on the page.`,
  numbers: `6 days. 4 sessions a day. 7 specialised classes. 1 encounter that changes everything. Shiloh 2026 in Lincoln, 8 to 13 December.`,
  scan: `Everything about Shiloh in Lincoln is one scan away: programme, free transport, classes, volunteering. ${URL}`,
  countdown: n => n === 0 ? `It starts tonight. Opening Encounter Night, 5:00 PM, Moorland Community Centre. Come expecting, and bring someone with you.`
    : `${n} ${n === 1 ? "day" : "days"} to Shiloh 2026. Opens Tuesday 8 December, 5:00 PM, Moorland Community Centre. Clear the week, come to every session, and bring someone.`,
};
// What else goes out on a given day, beside the countdown. Folder names refer to the folders in this kit.
const CLASS_DAYS = ["2026-11-12", "2026-11-13", "2026-11-14", "2026-11-15", "2026-11-16", "2026-11-17", "2026-11-18"];
const EXTRA = {
  "2026-11-08": ["Launch: announcement cards, theme reveal, Facebook cover", "Launch day. Post 02-announce-square.png to every group and the feed, and 01-announce-story.png on status, with the Announcement caption. Send 20-theme-reveal.gif to the groups first. Set 03-announce-fb-cover.png as the Facebook cover.", "01 Launch - announcement and theme"],
  "2026-11-09": ["Delegates card", "Post 08-delegates-square.png with the Delegates caption. Delegates need the most notice.", "04 Free bus, volunteers and delegates"],
  "2026-11-10": ["Programme story", "Post 04-programme-story.png on status with the Programme caption.", "03 Programme and invitations"],
  "2026-11-11": ["Classes carousel", "Post the classes carousel on Instagram and Facebook: 06-classes-00-cover.png first, then 01 to 07, with the Classes caption.", "05 Classes carousel"],
  "2026-11-20": ["Free bus card", "Post 05-bus-square.png with the Free bus caption.", "04 Free bus, volunteers and delegates"],
  "2026-11-21": ["Volunteer card", "Post 09-volunteer-square.png with the Volunteer caption.", "04 Free bus, volunteers and delegates"],
  "2026-11-24": ["Invite story, members repost", "Two weeks to go. Post 07-invite-story.png on status with the Invite caption and ask members to repost it on their own status.", "03 Programme and invitations"],
  "2026-11-29": ["Free bus card again", "Post 05-bus-square.png again. Bookings close in on the page.", "04 Free bus, volunteers and delegates"],
  "2026-12-01": ["Programme story, by the numbers", "One week to go. Post 04-programme-story.png and 22-by-the-numbers.gif (or .mp4) with the Programme and By the numbers captions.", "03 Programme and invitations"],
  "2026-12-05": ["Scan-me story, profile badge", "Post 21-scan-me-story.mp4 on status. Ask members to switch their profile picture to 10-profile-badge.png for Shiloh week.", "03 Programme and invitations", "07 Profile badge"],
  "2026-12-07": ["Programme story again", "Post 04-programme-story.png again, and remind everyone it starts tomorrow at 5:00 PM.", "03 Programme and invitations"],
};
for (const [i, iso] of CLASS_DAYS.entries()) EXTRA[iso] = [`Class of the day: 06-classes-${pad(i + 1)}`, `Class of the day on status: 06-classes-${pad(i + 1)}.png with the Classes caption.`, "05 Classes carousel"];

fs.rmSync(KIT, { recursive: true, force: true });

/* ---------- Social media ---------- */
const S = sub => path.join(SOCIAL, sub);
for (const f of ["01-announce-story.png", "02-announce-square.png", "03-announce-fb-cover.png", "20-theme-reveal.gif", "20-theme-reveal.mp4", "00-logo-colour.png", "00-logo-white.png"]) copy(f, S("01 Launch - announcement and theme"));
for (const d of DAYS) {
  const dir = S(path.join("02 Daily countdown - 8 Nov to 8 Dec", dayLabel(d)));
  copy(d.base + "-square.gif", dir); copy(d.base + "-square.png", dir); copy(d.base + "-story.mp4", dir); copy(d.base + "-story.png", dir);
  const extra = EXTRA[d.iso];
  write(dir, "post-today.txt", `
${d.wd} ${d.d} 2026 - ${d.n === 0 ? "opening night" : d.n + " days to Shiloh"}
Design: ${d.n === 0 ? "Opening night" : DESIGN[d.v]}

MORNING
- WhatsApp groups and Instagram feed: the square GIF (or the square PNG where a GIF does not play).
- WhatsApp status and Instagram or Facebook story: the story MP4 (or the story PNG).

CAPTION
${CAPTIONS.countdown(d.n)}
${HASH}
${extra ? `\nALSO TODAY\n${extra[1]}\nFiles in: ${extra.slice(2).map(x => `"${x}"`).join(" and ")}\n` : ""}`);
}
for (const f of ["04-programme-story.png", "07-invite-story.png", "22-by-the-numbers.gif", "22-by-the-numbers.mp4", "21-scan-me-story.gif", "21-scan-me-story.mp4"]) copy(f, S("03 Programme and invitations"));
for (const f of ["05-bus-square.png", "09-volunteer-square.png", "08-delegates-square.png"]) copy(f, S("04 Free bus, volunteers and delegates"));
for (let i = 0; i <= 7; i++) copy(`06-classes-${pad(i)}${i === 0 ? "-cover" : ""}.png`, S("05 Classes carousel"));
const TODAY = [["Tue 8 Dec", "Opening Encounter Night, 5:00 PM"], ["Wed 9 Dec", "full day"], ["Thu 10 Dec", "full day"], ["Fri 11 Dec", "Victory Celebration Night"], ["Sat 12 Dec", "Impartation Service, 5:00 AM"], ["Sun 13 Dec", "Thanksgiving Services"]];
for (let d = 1; d <= 6; d++) for (const size of ["square", "story"]) copy(`today/2026-12-${pad(7 + d)}-day-${d}-${size}.png`, S("06 Shiloh week - Today at Shiloh"));
copy("10-profile-badge.png", S("07 Profile badge"));

write(SOCIAL, "READ ME FIRST.md", `
# Shiloh 2026 social media kit · for the publicity team

Everything here points people to the Shiloh page: ${URL}
Post in the order of the folders. Folder 02 is the daily routine; the rest are posted on the days named below.

Sizes: **square** files (1080×1080) are for the WhatsApp groups and the Instagram and Facebook feed.
**story** files (1080×1920) are for WhatsApp status and Instagram or Facebook stories. GIFs play
inline in WhatsApp groups; MP4s are for status, stories, Reels and TikTok. Where a GIF does not
play, use the PNG of the same design.

## The daily routine (folder 02)

One folder per day from Sunday 8 November to the opening night on Tuesday 8 December. Each
folder has the day's countdown as a square GIF, a square PNG, a story MP4 and a story PNG, plus
\`post-today.txt\` with the caption and anything else to post that day. Five designs rotate so
the feed never looks the same two days running: giant number, calendar grid, flip clock, Papa
with the seal, and the number in words. The design on the church screen matches the post on
Sundays and Wednesdays.

| Date | Days left | Design | Also post |
| --- | --- | --- | --- |
${DAYS.map(d => `| ${d.wd.slice(0, 3)} ${d.d} | ${d.n === 0 ? "Opening night" : d.n} | ${d.n === 0 ? "It starts tonight" : DESIGN[d.v]} | ${EXTRA[d.iso] ? EXTRA[d.iso][0] : ""} |`).join("\n")}

## The other folders

- **01 Launch**: the announcement cards (story, square and Facebook cover), the theme reveal animation and the church logo. Post on Sunday 8 November.
- **03 Programme and invitations**: the "A day at Shiloh" story, the personal invite for members to repost, the by-the-numbers animation and the animated scan-me story.
- **04 Free bus, volunteers and delegates**: the three calls to action.
- **05 Classes carousel**: cover plus one card per class. Post as a carousel on 11 November, then one class a day on status from 12 to 18 November.
- **06 Shiloh week**: a "Today at Shiloh" card for each of the six days (square for the groups, story for status). Post each morning from 8 to 13 December, and keep the scan-me story in circulation for latecomers.
- **07 Profile badge**: for members' WhatsApp and Instagram profile pictures during Shiloh week.

## Captions

Hashtags for Instagram and TikTok: \`${HASH}\`

**Announcement.** ${CAPTIONS.announce}

**Programme.** ${CAPTIONS.programme}

**Free bus.** ${CAPTIONS.bus}

**Classes.** ${CAPTIONS.classes}

**Invite (for members to post).** ${CAPTIONS.invite}

**Delegates.** ${CAPTIONS.delegates}

**Volunteer.** ${CAPTIONS.volunteer}

**By the numbers.** ${CAPTIONS.numbers}

**Scan me.** ${CAPTIONS.scan}

**Countdown.** ${CAPTIONS.countdown(16)} (Change the number to the day.)

**Shiloh week (morning post).** Today at Shiloh: ${TODAY.map(t => `${t[0]}, ${t[1]}`).join("; ")}. Every session at Moorland Community Centre. Be in all of them, and bring someone.
`);

/* ---------- Church projection ---------- */
const C = sub => path.join(SCREEN, sub);
copy("30-projector-announcement.mp4", C("01 Announcement film and slides"));
for (const f of fs.readdirSync(path.join(OUT, "slides"))) copy("slides/" + f, C("01 Announcement film and slides"));
for (const d of SERVICE_DAYS) {
  const dir = C(path.join("02 Service days - countdown and screensaver", `${d.iso} ${d.wd} - ${d.n} days`));
  copy(d.base + "-wide.gif", dir); copy(d.base + "-wide.mp4", dir); copy(d.base + "-screensaver.mp4", dir); copy(d.base + "-square.png", dir, `${d.iso}-${pad(d.n)}-days-square-for-whatsapp.png`);
}
for (let d = 1; d <= 6; d++) copy(`today/2026-12-${pad(7 + d)}-day-${d}-wide.png`, C("03 Shiloh week - Today at Shiloh"));
for (const f of ["00-logo-colour.png", "00-logo-white.png"]) copy(f, C("04 Logo"));

write(SCREEN, "READ ME FIRST.md", `
# Shiloh 2026 projection kit · for the media team

Everything here is 16:9 for the church screen (1920×1080). The MP4s are H.264 and play in
PowerPoint, Keynote, ProPresenter, VLC and the TV's own player. Set every video to loop.

## 01 Announcement film and slides

- \`30-projector-announcement.mp4\` is the 54-second announcement film. Start it looping on the
  screen whenever Shiloh is being announced, from Sunday 8 November until it starts.
- The eight slide PNGs are the same scenes as stills, for a slide deck or for holding one
  message on screen: lockup, theme, dates and venue, a day at Shiloh, free bus, classes, what
  else is on the page, and the QR code.

## 02 Service days · countdown and screensaver

One folder for every Sunday and Wednesday from 8 November to 6 December, named by date and
days left. Each has:

- \`...-wide.gif\` and \`...-wide.mp4\`: a 4-second looping countdown for the announcement slide.
  Use the MP4 where a GIF stutters.
- \`...-screensaver.mp4\`: a slow 32-second loop of three scenes (the theme with Papa, the
  day's countdown with the venue, and the QR code) for when the Shiloh committee is up front,
  before the service starts, or whenever the screen is otherwise idle. Loop it.
- \`...-square-for-whatsapp.png\`: the same day's countdown in the square shape, in case the
  media team is asked for it on the day.

| Service | Days left | Design |
| --- | --- | --- |
${SERVICE_DAYS.map(d => `| ${d.wd} ${d.d} | ${d.n} | ${DESIGN[d.v]} |`).join("\n")}

The design changes from service to service, and matches what the publicity team posts the
same morning.

## 03 Shiloh week · Today at Shiloh

A 16:9 "Today at Shiloh" slide for each of the six days, 8 to 13 December, listing that day's
sessions and times. Put it up before each session and between sessions.

## 04 Logo

The church emblem in full colour and in white, on transparent backgrounds, for anything the
media team builds itself.
`);

// Zips, one per team, plus the full kit.
for (const [dir, zip] of [[SOCIAL, "Shiloh-2026-Social-Media.zip"], [SCREEN, "Shiloh-2026-Church-Projection.zip"]]) {
  fs.rmSync(path.join(__dirname, zip), { force: true });
  execFileSync("zip", ["-qr", path.join(__dirname, zip), path.basename(dir), "-x", "*.DS_Store"], { cwd: KIT });
  console.log(zip, (fs.statSync(path.join(__dirname, zip)).size / 1e6).toFixed(1) + " MB");
}
const count = dir => fs.readdirSync(dir, { withFileTypes: true }).reduce((n, e) => n + (e.isDirectory() ? count(path.join(dir, e.name)) : 1), 0);
console.log("social files:", count(SOCIAL), " projection files:", count(SCREEN));
