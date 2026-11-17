// The WhatsApp content calendar for Shiloh 2026: one post a day from 17 November to the last day, 13 December.
// Edit the words and links here, then run `node whatsapp.js` (in publicity/) to rebuild CALENDAR.md and the share page.
//
// How the posts are written:
//  - Each post reads as one short thought: who is inviting (Winners Chapel Lincoln), what it is for, what to do.
//    Facts are labelled (Date, Venue, Opens, Time...) so nobody has to hunt for them, and the last line is a plain
//    "Learn more at" or an action ("Book your seat at") followed by the link.
//  - The link goes to the part of the page the post is about (the page opens that section and scrolls to it):
//    transport -> #transport, shirts -> #tshirt, classes -> #classes, and so on. Posts about Shiloh in general
//    go to the landing page.
//  - The days people can act on come first, shirts first because they are time sensitive: shirts, bus booking, classes,
//    volunteering, UK Foreign Delegates, staying nearby. Only the round countdown days (20, 15, 10, 7, 5, 3, 1 to go)
//    interrupt them, and the softer posts (programme, invitation, theme) come in the last week.
//  - Everything stated is already on the page. Times are written 9:20am, UK English, no hedges.
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

const DATE = "*Date:* Tuesday 8 to Sunday 13 December 2026";
const OPENS = "*Opens:* Tuesday 8 December, 5:00pm";
const VENUE = "*Venue:* Moorland Community Centre, Moorland Avenue, Lincoln LN6 7NH";
const SHIRT = "*Choose:* polo shirt or hoodie, in white, red or wine, for men, women and kids (sizes S to 4XL)";
const PRICES = "*Prices:*\nHoodie £15\nPolo, long sleeve £12\nPolo, short sleeve £10\nChildren (0-9yrs) £7";
const CLASS_TIME = "*Time:* 11:30am, Wednesday 9 to Friday 11 December";
const DAY_TIMES = ["*Prayer Hour:* 5:00am", "*Morning Session:* 6:15am", "*Specialised Classes:* 11:30am"];

// date: the day it is sent. send: time to send. type: what kind of post. image: file in out/ (omit for text only).
// link: key in LINKS. verb: the words before the link. hook: the first line. body: short paragraphs.
// facts: labelled lines before Date and Venue. opens: add the opening time. noDate / noVenue: leave that line out.
const POSTS = [
  // Actions first. Shirts lead because they are time sensitive.
  { date: "2026-11-17", send: "8:00pm", type: "Shiloh shirt", image: "11-shirt-square.png", link: "tshirt", verb: "Reserve yours at",
    hook: "*Wear the theme to Shiloh 2026.* 👕",
    body: ["Winners Chapel Lincoln is gathering for Shiloh under the theme Far Above, and we would love to walk in together as one family.",
      "Come in the Shiloh '26 polo shirt or hoodie. Reserve yours now and the team will message you about payment and collection."],
    facts: [SHIRT, PRICES] },

  { date: "2026-11-18", send: "8:00pm", type: "Countdown · 20 days", image: "countdown/2026-11-18-20-days-square.png", link: "home", verb: "Learn more at",
    hook: "*20 days to Shiloh 2026.* 🙏",
    body: ["Winners Chapel Lincoln invites you to six days of prayer, the Word and real encounters with God, under the theme Far Above.",
      "Clear your week now and plan to be in every session."],
    opens: true },

  { date: "2026-11-19", send: "8:00pm", type: "Free bus", image: "05-bus-square.png", link: "transport", verb: "Book your seat at",
    hook: "*Nobody should miss Shiloh because of a lift.* 🚌",
    body: ["Winners Chapel Lincoln is running a free bus to every Shiloh session, the 5:00am ones too. Choose your pick-up point and the sessions you are coming to, then book your seat.",
      "Got a car? Fill the spare seats on your way."],
    facts: ["*Pick-up points:* Lincoln, Newark, Gainsborough and Grimsby"] },

  { date: "2026-11-20", send: "8:00pm", type: "Classes", image: "06-classes-00-cover.png", link: "classes", verb: "Choose your class at",
    hook: "*Which class is yours?* 🎓",
    body: ["Every day at Winners Chapel Lincoln's Shiloh, from 11:30am, we go deeper into one area of life with the Word. There are seven specialised classes, so pick the one that speaks to your situation and book your place for Wednesday, Thursday and Friday."],
    facts: ["*Classes:* healing and health, family, marriage, business and career, academics and more", CLASS_TIME], noDate: true },

  { date: "2026-11-21", send: "8:00pm", type: "Volunteer", image: "09-volunteer-square.png", link: "volunteer", verb: "Sign up at",
    hook: "*Shiloh in Lincoln runs on people like you.* 🙌",
    body: ["Winners Chapel Lincoln needs willing hands for six days of Shiloh. Pick the unit where you can help and the days and sessions you can cover, and we will build the rota around you."],
    facts: ["*Units:* driving, welcome, media, kitchen, set-up, intercession, first aid and more"] },

  { date: "2026-11-22", send: "8:00pm", type: "Shiloh shirt", image: "11-shirt-square.png", link: "tshirt", verb: "Reserve yours at",
    hook: "*December in Lincoln calls for the hoodie.* 🧥",
    body: ["Stay warm for the early mornings and wear Far Above while you are at it. Winners Chapel Lincoln's Shiloh '26 hoodie and polo shirt both carry Shiloh '26 on the chest and Far Above across the front.",
      "Reserve yours now and the team will message you about payment and collection."],
    facts: [SHIRT, PRICES] },

  { date: "2026-11-23", send: "8:00pm", type: "Countdown · 15 days", image: "countdown/2026-11-23-15-days-square.png", link: "home", verb: "Learn more at",
    hook: "*15 days to go.* 🔥",
    body: ["Shiloh is the biggest week of the year at Winners Chapel Lincoln: six days, every session, together in one room.",
      "Have you told one person yet?"],
    opens: true },

  { date: "2026-11-24", send: "8:00pm", type: "UK Foreign Delegates", image: "08-delegates-square.png", link: "delegate", verb: "Register your interest at",
    hook: "*Want to be at Shiloh in person at Canaanland?* ✈️",
    body: ["Every year a delegation from the UK attends Shiloh on ground. If you would like to be part of the UK Foreign Delegates for Shiloh 2026, register your interest with Winners Chapel Lincoln and the team will be in touch with everything you need to know."],
    facts: ["*Where:* Canaanland, Ota"], noDate: true, noVenue: true },

  { date: "2026-11-25", send: "8:00pm", type: "Stay nearby (text only)", image: null, link: "camping", verb: "Tell us at",
    hook: "*Coming from out of town for Shiloh?* 🏠",
    body: ["If you are travelling to Lincoln for Shiloh, or want to be close for every 5:00am session, tell Winners Chapel Lincoln who is coming and for how long. The hospitality team will come back to you with options."] },

  { date: "2026-11-26", send: "8:00pm", type: "Class spotlight", image: "06-classes-05.png", link: "classes", verb: "Book your class at",
    hook: "*Class spotlight: Business and Career Breakthrough.* 💼",
    body: ["At Winners Chapel Lincoln's Shiloh, this class is for entrepreneurs, professionals and job seekers believing God for a turnaround.",
      "Know someone who needs this one? Send it on."],
    facts: [CLASS_TIME], noDate: true },

  { date: "2026-11-27", send: "8:00pm", type: "Free bus", image: "05-bus-square.png", link: "transport", verb: "Book your seat at",
    hook: "*Book your free bus seat for Shiloh.* 🚌",
    body: ["Whether you are in Lincoln, Newark, Gainsborough or Grimsby, Winners Chapel Lincoln has a free bus to every session. Booking helps us plan the buses, so choose your pick-up point and sessions today."],
    facts: ["*Pick-up points:* Lincoln, Newark, Gainsborough and Grimsby"] },

  { date: "2026-11-28", send: "8:00pm", type: "Countdown · 10 days", image: "countdown/2026-11-28-10-days-square.png", link: "home", verb: "Learn more at",
    hook: "*10 days to Shiloh 2026.* 🔥",
    body: ["Winners Chapel Lincoln is almost ready. Everything you need to plan your week is on one page: the programme, your bookings and directions."],
    opens: true },

  { date: "2026-11-29", send: "8:00pm", type: "Shiloh shirt", image: "11-shirt-square.png", link: "tshirt", verb: "Reserve yours at",
    hook: "*Shiloh is 9 days away. Have you reserved your shirt?* 👕",
    body: ["Wear the theme with Winners Chapel Lincoln. Reserve your Shiloh '26 polo shirt or hoodie now and the team will message you about payment and collection."],
    facts: [SHIRT, PRICES] },

  { date: "2026-11-30", send: "8:00pm", type: "Volunteer", image: "09-volunteer-square.png", link: "volunteer", verb: "Sign up at",
    hook: "*Will you serve at Shiloh?* 🙌",
    body: ["Shiloh in Lincoln runs on volunteers, from driving and welcome to media, kitchen and first aid. Tell Winners Chapel Lincoln the days and sessions you can cover and we will put you on a rota that fits your week."] },

  { date: "2026-12-01", send: "8:00pm", type: "Countdown · 7 days", image: "countdown/2026-12-01-07-days-square.png", link: "home", verb: "Learn more at",
    hook: "*One week to Shiloh.* 🙏",
    body: ["Next Tuesday, Winners Chapel Lincoln begins six days of prayer and the Word. Seven days to clear your diary, finish your bookings and invite the people you love."],
    opens: true },

  // The softer posts, once the things to book have had their turn.
  { date: "2026-12-02", send: "8:00pm", type: "Programme", image: "04-programme-story.png", link: "programme", verb: "See the full programme at",
    hook: "*Plan your Shiloh week.*",
    body: ["Each day at Winners Chapel Lincoln's Shiloh builds on the one before, so plan to be in every session. The page has a button that adds the whole week to your calendar."],
    facts: [...DAY_TIMES, "*Encounter Night:* 5:00pm"] },

  { date: "2026-12-03", send: "8:00pm", type: "Countdown · 5 days", image: "countdown/2026-12-03-05-days-square.png", link: "home", verb: "Learn more at",
    hook: "*5 days to go.* 🔥",
    body: ["Winners Chapel Lincoln is ready to welcome you. Whatever you still need to sort for Shiloh is on one page."],
    opens: true },

  { date: "2026-12-04", send: "8:00pm", type: "Invite someone", image: "07-invite-story.png", link: "home", verb: "Learn more at",
    hook: "*Who will you bring to Shiloh?* 🙏",
    body: ["Think of one person who needs this and send them this message. Shiloh at Winners Chapel Lincoln is free and open to everyone: family, friends, colleagues and neighbours.",
      "Tell them you will save them a seat."] },

  { date: "2026-12-05", send: "8:00pm", type: "Countdown · 3 days", image: "countdown/2026-12-05-03-days-square.png", link: "programme", verb: "Add the week to your calendar at",
    hook: "*3 days to Shiloh.* 🙏",
    body: ["Put the dates in your calendar now so no session of Winners Chapel Lincoln's Shiloh slips by. The page has a button that adds the whole week for you."],
    opens: true },

  { date: "2026-12-06", send: "8:00pm", type: "Theme · Far Above", image: "20-theme-reveal.gif", link: "home", verb: "Learn more at",
    hook: "*Far Above.* ✨",
    body: ["“…far above all principality, and power, and might, and dominion, and every name that is named…” Ephesians 1:21 (KJV)",
      "This is the word Winners Chapel Lincoln is carrying into Shiloh 2026. Come for all of it, and bring someone with you."],
    opens: true },

  { date: "2026-12-07", send: "8:00pm", type: "Countdown · 1 day", image: "countdown/2026-12-07-01-days-square.png", link: "arrive", verb: "Know what to expect at",
    hook: "*Tomorrow evening we begin.* 🔥",
    body: ["First time at Winners Chapel Lincoln? Come to the welcome desk at the entrance and someone will show you where to sit.",
      "Bring your Bible, notebook and pen, a warm layer for the early mornings, and someone with you."],
    facts: ["*Opens:* Tuesday 8 December, 5:00pm"], noDate: true },

  // Shiloh week. The opening night is a morning post; every other day's card goes out the evening before.
  { date: "2026-12-08", send: "8:00am", type: "Opening day", image: "today/2026-12-08-day-1-square.png", link: "home", verb: "Learn more at",
    hook: "*Today is the day. Shiloh opens at 5:00pm.* 🔥",
    body: ["Winners Chapel Lincoln opens six days of Shiloh with the Opening Encounter Night. Arrive before we start, come expecting, and bring someone with you."],
    facts: ["*Time:* 5:00pm"], noDate: true },

  { date: "2026-12-08", send: "8:00pm", type: "Tomorrow · Wednesday", image: "tomorrow/2026-12-09-day-2-square.png", link: "programme", verb: "See the full programme at",
    hook: "*Tomorrow at Shiloh: the first full day.*",
    body: ["Winners Chapel Lincoln begins the day at 5:00am. Set your alarm tonight. 🙏"],
    facts: ["*Wednesday 9 December*", ...DAY_TIMES, "*Encounter Night:* 5:00pm"], noDate: true },

  { date: "2026-12-09", send: "8:00pm", type: "Tomorrow · Thursday", image: "tomorrow/2026-12-10-day-3-square.png", link: "programme", verb: "See the full programme at",
    hook: "*Tomorrow, Thursday: day 3 of 6.*",
    body: ["Every session at Winners Chapel Lincoln counts and builds on the one before."],
    facts: ["*Thursday 10 December*", ...DAY_TIMES, "*Encounter Night:* 5:00pm"], noDate: true },

  { date: "2026-12-10", send: "8:00pm", type: "Tomorrow · Friday", image: "tomorrow/2026-12-11-day-4-square.png", link: "programme", verb: "See the full programme at",
    hook: "*Tomorrow, Friday: Victory Celebration Night.* 🎉",
    body: ["Winners Chapel Lincoln ends the day celebrating what God is doing. Come to celebrate."],
    facts: ["*Friday 11 December*", ...DAY_TIMES, "*Victory Celebration Night:* 5:00pm"], noDate: true },

  { date: "2026-12-11", send: "8:00pm", type: "Tomorrow · Saturday", image: "tomorrow/2026-12-12-day-5-square.png", link: "programme", verb: "See the full programme at",
    hook: "*Tomorrow, Saturday: the Impartation Service.*",
    body: ["One session with Winners Chapel Lincoln, early. Set your alarm tonight and come ready to receive. 🙏"],
    facts: ["*Saturday 12 December*", "*Impartation Service:* 5:00am UK time"], noDate: true },

  { date: "2026-12-12", send: "8:00pm", type: "Tomorrow · Sunday", image: "tomorrow/2026-12-13-day-6-square.png", link: "home", verb: "Learn more at",
    hook: "*Tomorrow is Thanksgiving Sunday.* 🙏",
    body: ["Winners Chapel Lincoln gives thanks together. Bring your invitees and new converts. A warm welcome waits for everyone here for the first time."],
    facts: ["*Sunday 13 December*", "*Shiloh Thanksgiving Service 1:* 9:20am", "*Shiloh Thanksgiving Service 2:* 11:15am"], noDate: true },

  { date: "2026-12-13", send: "3:00pm", type: "Thank you · testimonies (text only)", image: null, link: "testimonies", verb: "Share your testimony at",
    hook: "*Thank you, Lord, for Shiloh 2026.* 🙌",
    body: ["What did God do for you this week? Share your testimony with Winners Chapel Lincoln. It could be the word that encourages someone else."],
    noDate: true, noVenue: true },
];

for (const p of POSTS) {
  const facts = [...(p.facts || [])];
  if (!p.noDate) facts.push(DATE);
  if (p.opens) facts.push(OPENS);
  if (!p.noVenue) facts.push(VENUE);
  p.url = LINKS[p.link];
  p.caption = [p.hook, ...p.body, facts.join("\n"), p.verb + " " + p.url].join("\n\n");
}

module.exports = { BASE, LINKS, LINK_NAMES, POSTS };
