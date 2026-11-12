# Shiloh 2026 publicity kit · WCI Lincoln

Graphics, animations and videos for WhatsApp, Instagram, Facebook, TikTok and the church
projector, all pointing people to the Shiloh 2026 page by QR code:
https://wci-lincoln.github.io/events/shiloh-2026/

The hand-over is two folders, built by `node pack.js` into `kit/` and zipped:

- **Shiloh 2026 - Social Media (publicity team)**: square and story files, grouped by use, with a
  folder for every day from 8 November to the opening night and a `post-today.txt` in each.
- **Shiloh 2026 - Church Projection (media team)**: 16:9 files for the screen, with a folder for
  every Sunday and Wednesday service until Shiloh.

Each folder has a `READ ME FIRST.md` written for that team: what to post or show, when, and the
captions. Raw renders live in `out/`.

## One design system

Every piece shares the same grammar so the run-up reads as one campaign: the church lockup top
left and a tag top right; type from the WCI Lincoln brand guide (see `BRAND.md`): Bebas Neue
display headlines, Bebas Kai for dates, times, addresses and labels, Gontserrat for body text
with its italic for the one warm line; the Winners palette as solid colour blocks (crimson,
red, gold, ivory, ink); the circular "Live in Lincoln" seal; the QR in a white panel bottom
right; and a footer with "Shiloh 2026 · Far Above" and the opening details. The logo is the
church's own emblem from winnerschapellincoln.org.uk, bare on light grounds and in a white
roundel on dark ones (`00-logo-colour.png`, `00-logo-white.png`).

Times follow the guide's format (`5:00pm`, `9:20am`). The brand font files are not in the
repository; drop them into `src/fonts/` (names in `src/fonts/README.md`) and re-render. Until
then Google Fonts stand-ins are used: Bebas Neue for both Bebas faces, Montserrat for
Gontserrat. The brand's signature script, Brother Signature, is not used on screen (see `BRAND.md`).

## Projection

The church screen is a projector on a pale wall in a daylit sports hall, so everything made for
it (the film and slides, the wide countdowns, the screensaver, the wide "Today at Shiloh" cards)
follows stricter rules: light grounds with crimson or ink text, no text under 36 px on a
1920×1080 frame (24 px on the 1280×720 countdowns), secondary text at 40 px or more, one
message a scene, and no script face. The same day's countdown keeps its design on the screen
and on the phone; only the colours and sizes differ.

## What is in `out/`

| Files | What |
| --- | --- |
| `01-announce-story.png`, `02-announce-square.png`, `03-announce-fb-cover.png` | The announcement: Papa, the theme, dates, venue, QR. |
| `04-programme-story.png` | A day at Shiloh: the four daily blocks and the special nights. |
| `05-bus-square.png`, `08-delegates-square.png`, `09-volunteer-square.png` | Free bus, UK Foreign Delegates ("Go to Canaanland"), volunteers. |
| `06-classes-00-cover.png` … `06-classes-07.png` | Classes carousel: cover plus one card per class. |
| `07-invite-story.png` | First-person invite for members to repost. |
| `10-profile-badge.png` | Profile picture for Shiloh week. |
| `40-poster-a4.pdf`, `40-poster-a4.png` | A4 "Scan me" wall poster: vector PDF for printing (sharp at A3 too), 2480×3508 PNG for sharing. |
| `20-theme-reveal`, `21-scan-me-story`, `22-by-the-numbers` (`.gif` + `.mp4`) | Short animations. |
| `30-projector-announcement.mp4` | 110-second announcement film for the screen, built to loop; the QR scene holds for 25 seconds. |
| `slides/*.png` | The film's eight scenes as 1920×1080 stills. |
| `countdown/<date>-<nn>-days-*` | One countdown per day, 30 days to the opening night. Every day: `-square.gif`, `-square.png`, `-story.mp4`, `-story.png`. Sundays and Wednesdays also: `-wide.gif`, `-wide.mp4`, `-screensaver.mp4`. |
| `today/<date>-day-<n>-*.png` | "Today at Shiloh" for each of the six days, square, story and wide. |

### Countdowns

Five designs rotate day by day so the feed never repeats two days running: giant number with a
running strip (ivory), calendar grid filling gold (crimson), flip clock (crimson), Papa with a
swaying seal (gold), and the number in words (red). The opening day uses the words design with
"It starts tonight". The design for a given date is the same in every shape, so the projector
slide and the social post match on service days. Each countdown animates in over four seconds
and then holds the finished card for six, a ten-second loop, so the details can be read; the
giant-number design runs an eight-second loop instead so its strip keeps scrolling at a readable
pace. The MP4s play the loop twice.

The screensaver is a slow 60-second loop of three scenes, 20 seconds each, (theme with Papa, the day's countdown
with the venue, the QR) for when the screen is idle in church.

## Making changes

The designs are HTML files in `src/`, sharing `shared.css` and `shared.js`. Edit the words there,
then run:

```
npm install
node build.js               # render everything into out/ (about 45 minutes, mostly video)
node build.js 05-bus        # just the files whose name contains this
node build.js countdown     # the daily countdowns
node build.js today         # the Shiloh-week cards
node build.js screensaver   # the service-day screensavers
node pack.js                # build kit/ and the two zips from out/
node verify-qr.js           # decode the QR in every card and check it opens the Shiloh page
node frames.js countdown    # still frames of the countdown designs into preview/, for checking
node frames.js projector    # the projector film at the middle of each scene
```

`build.js` renders with the Chrome installed on this Mac. GIFs are built in Node; MP4s use the
ffmpeg that `npm install` brings in with the `ffmpeg-static` package, so nothing else needs
installing. The day list (dates, days left, which days are services, which design) is computed
in `build.js` from the opening date; the posting notes per day are in `pack.js`. Projector
scene timings are the `data-a` attributes in `src/projector.html` ("animation duration start").
