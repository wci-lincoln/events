# Shiloh 2026 publicity kit · WCI Lincoln

Ready-to-post graphics for WhatsApp, Instagram, Facebook and TikTok, all pointing people
to the Shiloh 2026 page by QR code: https://wci-lincoln.github.io/events/shiloh-2026/

Everything is in `out/`. Sizes: **story** = 1080×1920 (WhatsApp status, Instagram and Facebook
stories, TikTok photo mode), **square** = 1080×1080 (Instagram and Facebook feed), **cover** =
1640×924 (Facebook page cover). GIFs play inline on WhatsApp and Instagram; WhatsApp turns them
into short videos when you send them.

## What is in the kit

| File | Use it for | Notes |
| --- | --- | --- |
| `01-announce-story.png` | The first WhatsApp status and Instagram story. Pin it to the church status for the week. | Papa, the theme, dates, venue, QR. |
| `02-announce-square.png` | The announcement post on Instagram and Facebook. | Same design in feed shape. |
| `03-announce-fb-cover.png` | Facebook page cover photo for November and December. | No QR, because covers are cropped on phones. |
| `04-programme-story.png` | "What happens each day" story. Post early and again on 7 December. | Timetable with the four daily blocks and the special nights. |
| `05-bus-square.png` | Free transport post. | Pick-up points from the page. |
| `06-classes-00-cover.png` to `06-classes-07.png` | An eight-slide Instagram or Facebook carousel. Cover first, then one slide per class. | Also works as eight separate WhatsApp statuses over a day. |
| `07-invite-story.png` | For members to repost on their own status: "I'm going. Come with me." | Written in the first person on purpose. |
| `08-delegates-square.png` | UK Foreign Delegates call. Post early, travel takes planning. | Points to the "Go to Canaanland" form. |
| `09-volunteer-square.png` | Volunteer call. | Units as on the page. |
| `10-profile-badge.png` | WhatsApp or Instagram profile picture for members during Shiloh week. | Designed to crop to a circle. |
| `11-countdown-30.png` … `11-countdown-00.png` | Countdown statuses for 30, 14, 7, 3 and 1 day to go, and the morning of the opening. | See the schedule below. |
| `20-theme-reveal.gif` | Theme reveal animation, square. First WhatsApp group post and Instagram feed. | 5 seconds, loops. |
| `21-scan-me-story.gif` | Animated "scan me" story. Great as the last status in a sequence. | 3 seconds, loops. |
| `22-by-the-numbers.gif` | "6 days, 4 sessions a day, 7 classes, 1 encounter". | 6 seconds, loops. |

## Posting schedule

Dates work back from the opening Encounter Night on Tuesday 8 December 2026.

| When | Post | Where |
| --- | --- | --- |
| As soon as the committee signs off | `20-theme-reveal.gif`, then `01` / `02` | Church WhatsApp groups, status, Instagram, Facebook. Set `03` as the Facebook cover. |
| Same week | `08-delegates-square.png` | Groups and feed. Delegates need the most notice. |
| Sun 8 Nov | `11-countdown-30.png` | Status and stories. |
| Week of 10 Nov | Classes carousel `06-*` | Instagram and Facebook carousel; one slide a day on status. |
| Week of 17 Nov | `05-bus-square.png`, `09-volunteer-square.png` | Feed and groups. |
| Tue 24 Nov | `11-countdown-14.png`, then `07-invite-story.png` with the caption below | Status. Ask members to repost the invite. |
| Tue 1 Dec | `11-countdown-07.png`, `04-programme-story.png`, `22-by-the-numbers.gif` | Status, stories, groups. |
| Sat 5 Dec | `11-countdown-03.png`, `21-scan-me-story.gif` | Status. Members switch to `10-profile-badge.png`. |
| Mon 7 Dec | `11-countdown-01.png`, `04-programme-story.png` again | Status and groups. |
| Tue 8 Dec, morning | `11-countdown-00.png` | Status and groups. |
| Every day of Shiloh | Photos from the hall, plus `21-scan-me-story.gif` | Status. Keep the QR in circulation for latecomers. |

## Captions

Copy and adapt. Hashtags for Instagram and TikTok: `#Shiloh2026 #FarAbove #WCILincoln #WinnersChapelLincoln #Lincoln #LivingFaithChurch`

**Announcement.** Shiloh 2026 comes to Lincoln. 🔥 Far Above: Tuesday 8 to Sunday 13 December, every session live at Moorland Community Centre, LN6 7NH. Programme, free transport, specialised classes and more on one page. Scan or tap the link in bio. Come expecting, and bring someone with you.

**Programme.** A day at Shiloh in Lincoln: 5:00 AM Shiloh Prayer Hour, 6:15 AM Hour of Visitation, 11:30 AM Specialised Classes, 5:00 PM Encounter Night. Friday is Victory Celebration Night. Saturday 5:00 AM is the Impartation Service. Sunday, two Thanksgiving Services. Be in every one.

**Free bus.** Nobody should miss Shiloh because of a lift. Free buses to every session from the University of Lincoln, Newark, Gainsborough and Grimsby. Book your seat on the page. Got a car? Fill it on the way.

**Classes.** Seven specialised classes, 11:30 AM Wednesday to Friday. Pick the one you need, or a different one each day. Swipe for what each class is about, then book your place.

**Invite (for members to post).** I'm going to Shiloh 2026, and I'd love you to come with me. Six days of prayer, the Word and real encounters with God, right here in Lincoln. Everything you need is one scan away. I'll save you a seat. 🙏

**Delegates.** Want to be at Shiloh on ground at Canaanland this year? A delegation from the UK goes every year. Register your interest on the page and the team will be in touch with all the details.

**Volunteer.** Shiloh in Lincoln runs on people like you. Driving, welcome, media, hospitality, children, protocol, set-up, outreach, intercession, first aid. Pick your unit and the sessions you can cover. Sign up on the page.

**Countdown.** 7 days to go. Shiloh 2026 opens Tuesday 8 December, 5:00 PM, here in Lincoln. Six days. Every session. Bring someone. (Change the number to match the image.)

**Opening morning.** It starts tonight. Opening Encounter Night, 5:00 PM, Moorland Community Centre. Come expecting, and bring someone with you.

## Making changes

The designs are HTML files in `src/`, sharing `shared.css` and `shared.js`. Edit the words there,
then run:

```
npm install
node build.js            # everything
node build.js 05-bus     # just the files whose name contains this
```

`build.js` renders with the Chrome installed on this Mac. GIFs are built in Node; for MP4 versions
install ffmpeg (`brew install ffmpeg`) and ask for the MP4 step to be added.
