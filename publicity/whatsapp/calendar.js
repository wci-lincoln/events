// The WhatsApp content calendar for Shiloh 2026: one post a day from 17 November to the last day, 13 December.
// Edit the words and links here, then run `node whatsapp.js` (in publicity/) to rebuild CALENDAR.md and the share page.
//
// Rules the captions follow:
//  - One idea, one image, one link per post, so each one forwards cleanly.
//  - The link goes to the part of the page the post is about (the page opens that section and scrolls to it):
//    transport -> #transport, shirts -> #tshirt, classes -> #classes, and so on. Posts about Shiloh in general
//    go to the landing page.
//  - Everything stated is already on the page. Times are written 9:20am, UK English, no hedges.
//  - Round countdown days (20, 15, 10, 7, 5, 3, 1 days to go) use the countdown card; the days between mix topics.
//  - Shiloh week: the 5:00am sessions need a night's notice, so each day's card goes out at 8:00pm the evening before.

const BASE = "https://wci-lincoln.github.io/events/shiloh-2026/";
const LINKS = {
  home: BASE,
  programme: BASE + "#programme",
  transport: BASE + "#transport",
  tshirt: BASE + "#tshirt",
  classes: BASE + "#classes",
  volunteer: BASE + "#volunteer",
  delegate: BASE + "#delegate",
  camping: BASE + "#camping",
  arrive: BASE + "#arrive",
  testimonies: BASE + "#testimonies",
};
// What each link opens, in words the person sending it will recognise.
const LINK_NAMES = {
  home: "Landing page", programme: "When do I need to be there?", transport: "How do I get there? (free bus)",
  tshirt: "Can I get the Shiloh shirt?", classes: "Which class should I take?", volunteer: "How can I serve?",
  delegate: "Go to Canaanland", camping: "Can I stay nearby for the week?", arrive: "What happens when I arrive?",
  testimonies: "Share your testimony",
};

const VENUE = "Moorland Community Centre, Lincoln LN6 7NH";
const day = (...lines) => lines.join("\n\n");

// date: the day it is sent. send: time to send. type: what kind of post. image: file in out/ (omit for text only).
// link: key in LINKS. text: the caption, WITHOUT the link line (it is added below).
const POSTS = [
  { date: "2026-11-17", send: "8:00pm", type: "Overview", image: "02-announce-square.png", link: "home",
    text: day("*Everything about Shiloh 2026 is on one page.* 🔥",
      "Programme and times, free bus, specialised classes, Shiloh shirts, volunteering and directions. Tuesday 8 to Sunday 13 December, " + VENUE + ".") , cta: "Come expecting, and bring someone with you." },

  { date: "2026-11-18", send: "8:00pm", type: "Countdown · 20 days", image: "countdown/2026-11-18-20-days-square.png", link: "home",
    text: day("*20 days to Shiloh.* 🙏",
      "Far Above opens Tuesday 8 December at 5:00pm, " + VENUE + ". Clear your week now and plan to be in every session.") },

  { date: "2026-11-19", send: "8:00pm", type: "Classes", image: "06-classes-00-cover.png", link: "classes",
    text: day("*Seven specialised classes. Which one is yours?*",
      "Healing, family, marriage, business and career, academics and more. 11:30am, Wednesday to Friday. Pick a class for each day and book your place.") },

  { date: "2026-11-20", send: "8:00pm", type: "Free bus", image: "05-bus-square.png", link: "transport",
    text: day("*Nobody should miss Shiloh because of a lift.* 🚌",
      "A free bus to every session, the 5:00am ones too, from Lincoln, Newark, Gainsborough and Grimsby. Choose your route and sessions and book your seat. Got a car? Fill the spare seats on your way.") },

  { date: "2026-11-21", send: "8:00pm", type: "Shiloh shirt", image: "11-shirt-square.png", link: "tshirt",
    text: day("*Wear the theme.* 👕",
      "Shiloh '26 polo shirts and hoodies in white, red or wine, for men, women and kids. Choose your item, colour and size and the team will message you about payment and collection.") },

  { date: "2026-11-22", send: "8:00pm", type: "Theme · Far Above", image: "20-theme-reveal.gif", link: "home",
    text: day("*Far Above.* ✨",
      "“…far above all principality, and power, and might, and dominion, and every name that is named…” Ephesians 1:21",
      "Shiloh 2026 begins on Tuesday 8 December. Make room for it.") },

  { date: "2026-11-23", send: "8:00pm", type: "Countdown · 15 days", image: "countdown/2026-11-23-15-days-square.png", link: "home",
    text: day("*15 days to go.* 🔥",
      "Shiloh 2026, Far Above: six days, every session, right here in Lincoln. Tuesday 8 December, 5:00pm.", "Have you told one person yet?") },

  { date: "2026-11-24", send: "8:00pm", type: "Invite someone", image: "07-invite-story.png", link: "home",
    text: day("*Forward this to one person who needs Shiloh.* 🙏",
      "Six days of prayer, the Word and real encounters with God, here in Lincoln, 8 to 13 December. Everything they need is on one page. Tell them you will save them a seat.") },

  { date: "2026-11-25", send: "8:00pm", type: "Volunteer", image: "09-volunteer-square.png", link: "volunteer",
    text: day("*Shiloh in Lincoln runs on people like you.*",
      "Driving, welcome, media, kitchen, set-up, intercession, first aid and more. Pick your unit and the days and sessions you can cover, and we will build the rota around you.") },

  { date: "2026-11-26", send: "8:00pm", type: "Class spotlight", image: "06-classes-05.png", link: "classes",
    text: day("*Class spotlight: Business and Career Breakthrough.* 💼",
      "For entrepreneurs, professionals and job seekers believing God for a turnaround. 11:30am, Wednesday to Friday at Moorland Community Centre.", "Know someone who needs this one? Send it on.") },

  { date: "2026-11-27", send: "8:00pm", type: "Programme", image: "04-programme-story.png", link: "programme",
    text: day("*A day at Shiloh.*",
      "5:00am Shiloh Prayer Hour · 6:15am Morning Session · 11:30am Specialised Classes · 5:00pm Encounter Night. Friday is Victory Celebration Night, Saturday is the Impartation Service at 5:00am, and Sunday has two Thanksgiving Services. Plan your week around it.") },

  { date: "2026-11-28", send: "8:00pm", type: "Countdown · 10 days", image: "countdown/2026-11-28-10-days-square.png", link: "home",
    text: day("*10 days to Shiloh.* 🔥",
      "Tuesday 8 December, 5:00pm, " + VENUE + ". Everything you need is on one page: the programme, your bookings and directions.") },

  { date: "2026-11-29", send: "8:00pm", type: "Shiloh shirt", image: "11-shirt-square.png", link: "tshirt",
    text: day("*December in Lincoln calls for the hoodie.* 🧥",
      "Wear Far Above in white, red or wine, as a polo shirt or a hoodie, sizes S to 4XL for men, women and kids. Reserve yours and the team will message you about payment and collection.") },

  { date: "2026-11-30", send: "8:00pm", type: "UK Foreign Delegates", image: "08-delegates-square.png", link: "delegate",
    text: day("*Want to be at Shiloh in person at Canaanland?* ✈️",
      "A delegation from the UK attends every year. Register your interest on the page and the team will be in touch with everything you need to know.") },

  { date: "2026-12-01", send: "8:00pm", type: "Countdown · 7 days", image: "countdown/2026-12-01-07-days-square.png", link: "home",
    text: day("*One week to Shiloh.* 🙏",
      "Next Tuesday, 8 December, 5:00pm, " + VENUE + ". Seven days to clear your diary and invite your people.") },

  { date: "2026-12-02", send: "8:00pm", type: "Stay nearby (text only)", image: null, link: "camping",
    text: day("*Coming from out of town, or want to be close for the 5:00am sessions?*",
      "Tell us who is coming and for how long, and the hospitality team will come back to you with options.") },

  { date: "2026-12-03", send: "8:00pm", type: "Countdown · 5 days", image: "countdown/2026-12-03-05-days-square.png", link: "home",
    text: day("*5 days to go.* 🔥",
      "Shiloh 2026 opens on Tuesday 8 December at 5:00pm. Whatever you still need to sort is on one page.") },

  { date: "2026-12-04", send: "8:00pm", type: "Free bus", image: "05-bus-square.png", link: "transport",
    text: day("*Your seat on the free bus is waiting.* 🚌",
      "Lincoln, Newark, Gainsborough and Grimsby, to every session. Book now so we know you are coming, and bring someone with you.") },

  { date: "2026-12-05", send: "8:00pm", type: "Countdown · 3 days", image: "countdown/2026-12-05-03-days-square.png", link: "programme",
    text: day("*3 days to Shiloh.* 🙏",
      "Tuesday 8 December, 5:00pm. Put the dates in your calendar and come to every session. The page has a button that adds the whole week for you.") },

  { date: "2026-12-06", send: "8:00pm", type: "By the numbers", image: "22-by-the-numbers.gif", link: "home",
    text: day("*6 days. 4 sessions a day. 7 specialised classes. 1 encounter that changes everything.* 🔥",
      "Shiloh starts on Tuesday. Come for all of it, and bring someone with you.") },

  { date: "2026-12-07", send: "8:00pm", type: "Countdown · 1 day", image: "countdown/2026-12-07-01-days-square.png", link: "arrive",
    text: day("*Tomorrow evening we begin.* 🔥",
      "Shiloh opens at 5:00pm, " + VENUE + ". First time? Come to the welcome desk at the entrance. Bring your Bible, notebook and pen, a warm layer for the early mornings, and someone with you.") },

  // Shiloh week. The opening night is a morning post; every other day's card goes out the evening before.
  { date: "2026-12-08", send: "8:00am", type: "Opening day", image: "today/2026-12-08-day-1-square.png", link: "home",
    text: day("*Today is the day. Shiloh opens at 5:00pm.* 🔥",
      "Opening Encounter Night, " + VENUE + ". Arrive before we start, come expecting, and bring someone with you.") },

  { date: "2026-12-08", send: "8:00pm", type: "Tomorrow · Wednesday", image: "tomorrow/2026-12-09-day-2-square.png", link: "programme",
    text: day("*Tomorrow at Shiloh: the first full day.*",
      "5:00am Shiloh Prayer Hour · 6:15am Morning Session · 11:30am Specialised Classes · 5:00pm Encounter Night. " + VENUE + ".", "Set your alarm tonight. 🙏") },

  { date: "2026-12-09", send: "8:00pm", type: "Tomorrow · Thursday", image: "tomorrow/2026-12-10-day-3-square.png", link: "programme",
    text: day("*Tomorrow, Thursday: day 3 of 6.*",
      "5:00am Shiloh Prayer Hour · 6:15am Morning Session · 11:30am Specialised Classes · 5:00pm Encounter Night. Every session counts.") },

  { date: "2026-12-10", send: "8:00pm", type: "Tomorrow · Friday", image: "tomorrow/2026-12-11-day-4-square.png", link: "programme",
    text: day("*Tomorrow, Friday: Victory Celebration Night.* 🎉",
      "5:00am Shiloh Prayer Hour · 6:15am Morning Session · 11:30am Specialised Classes, and Victory Celebration Night at 5:00pm. Come to celebrate.") },

  { date: "2026-12-11", send: "8:00pm", type: "Tomorrow · Saturday", image: "tomorrow/2026-12-12-day-5-square.png", link: "programme",
    text: day("*Tomorrow, Saturday: the Impartation Service at 5:00am.*",
      "One session, 5:00am UK time, at " + VENUE + ". Set your alarm tonight and come ready to receive. 🙏") },

  { date: "2026-12-12", send: "8:00pm", type: "Tomorrow · Sunday", image: "tomorrow/2026-12-13-day-6-square.png", link: "home",
    text: day("*Tomorrow is Thanksgiving Sunday.* 🙏",
      "Two Shiloh Thanksgiving Services, 9:20am and 11:15am, at " + VENUE + ". Bring your invitees and new converts. A warm welcome waits for everyone here for the first time.") },

  { date: "2026-12-13", send: "3:00pm", type: "Thank you · testimonies (text only)", image: null, link: "testimonies",
    text: day("*Thank you, Lord, for Shiloh 2026.* 🙌",
      "What did God do for you this week? Share your testimony on the page. It could be the word that encourages someone else.") },
];

for (const p of POSTS) {
  p.url = LINKS[p.link];
  p.caption = p.text + "\n\n" + (p.cta ? p.cta + "\n\n" : "") + "👉 " + p.url;
}

module.exports = { BASE, LINKS, LINK_NAMES, POSTS };
