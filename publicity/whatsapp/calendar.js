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
// A list is a label and bullets, so it reads as a list: *Prices:* then one "• item" per line.
const list = (label, items, colon = true) => `*${label}${colon ? ":" : ""}*\n` + items.map(i => "• " + i).join("\n");
const CHOOSE = list("Choose", ["Polo shirt or hoodie", "White, red or wine", "Men, women or kids (S to 4XL)"]);
const PRICES = list("Prices", ["Hoodie - £15", "Polo, long sleeve - £12", "Polo, short sleeve - £10", "Children (0-9yrs) - £7"]);
const PICKUPS = list("Pick-up points", ["Lincoln", "Newark", "Gainsborough", "Grimsby"]);
const BUS_RUNS = "*Runs:* every session, Tuesday 8 to Sunday 13 December";
const BUS_TO = "*Takes you to:* Moorland Community Centre, Moorland Avenue, Lincoln LN6 7NH";
const SERVE_WHEN = "*When:* any of the six days, Tuesday 8 to Sunday 13 December, up to four sessions a day";
const UNITS = list("Units", ["Driving", "Welcome", "Media", "Kitchen", "Set-up", "Intercession", "First aid"]);
const CLASSES = list("Classes", ["Healing, Health and Wholeness", "Breaking Generational Curses", "Breaking Marital Siege", "Successful Christian Family", "Business and Career Breakthrough", "Keys to Academic Success", "Fathers and Mothers of Nations"]);
const CLASS_TIME = "*Time:* 11:30am, Wednesday 9 to Friday 11 December";
const DAY_ITEMS = ["Prayer Hour: 5:00am", "Morning Session: 6:15am", "Specialised Classes: 11:30am"];

// A post only carries facts that belong to its subject. A shirt post has items and prices, not an address. The venue goes
// on posts about the event days themselves (countdowns, classes, the programme, the invitation, Shiloh week) and on the bus,
// which needs to say where it goes.
//
// Every message is built in the same order, so it reads as one thought:
//   hook   what this message is about, in one line
//   body   first what it is, then what to do (two sentences, three at most)
//   facts  the details, labelled; lists as bullets
//   link   a plain line ending in the link
// Winners Chapel Lincoln is named as the one doing something (inviting, running the bus, offering the shirts). Never bolt
// the name on where it is not the subject of the sentence.
//
// date: the day it is sent. send: time to send. type: what kind of post. image: file in out/ (omit for text only).
// link: key in LINKS. verb: the words before the link. hook: the first line. body: short paragraphs.
// facts: labelled lines. opens: add the opening time. noDate / noVenue: leave that line out.
// when / where: say the date or place in the post's own words.
const POSTS = [
  // Actions first. Shirts lead because they are time sensitive.
  { date: "2026-11-17", send: "8:00pm", type: "Shiloh shirt", image: "11-shirt-square.png", link: "tshirt", verb: "Reserve yours at",
    hook: "*Reserve your Shiloh 2026 shirt.* 👕",
    body: ["Winners Chapel Lincoln has polo shirts and hoodies for Shiloh 2026, carrying this year's theme, Far Above. Reserve yours on the page and the team will message you about payment and collection."],
    facts: [CHOOSE, PRICES], noDate: true, noVenue: true },

  { date: "2026-11-18", send: "8:00pm", type: "Countdown · 20 days", image: "countdown/2026-11-18-20-days-square.png", link: "home", verb: "Learn more at",
    hook: "*20 days to Shiloh 2026.* 🙏",
    body: ["Shiloh is six days of prayer, the Word and encounters with God, and Winners Chapel Lincoln invites you to all of it. Clear your week now so you can be in every session."],
    opens: true, noDate: true },

  { date: "2026-11-19", send: "8:00pm", type: "Free bus", image: "05-bus-square.png", link: "transport", verb: "Book your seat at",
    hook: "*Nobody should miss Shiloh because of a lift.* 🚌",
    body: ["Winners Chapel Lincoln is running a free bus to every session, including the 5:00am ones. Choose your pick-up point and the sessions you are coming to, then book your seat."],
    facts: [PICKUPS], when: BUS_RUNS, where: BUS_TO },

  { date: "2026-11-20", send: "8:00pm", type: "Classes", image: "06-classes-00-cover.png", link: "classes", verb: "Choose your class at",
    hook: "*Which Shiloh class is yours?* 🎓",
    body: ["Shiloh 2026 at Winners Chapel Lincoln has seven specialised classes. Each one takes one area of life and goes deep on what the Word says about it. Pick the class that fits your situation and book your place."],
    facts: [CLASSES, CLASS_TIME], noDate: true },

  { date: "2026-11-21", send: "8:00pm", type: "Volunteer", image: "09-volunteer-square.png", link: "volunteer", verb: "Sign up at",
    hook: "*Shiloh in Lincoln runs on people like you.* 🙌",
    body: ["Winners Chapel Lincoln needs volunteers for Shiloh 2026. Choose the unit you want to serve in and the days and sessions you can cover, and we will build the rota around you."],
    facts: [UNITS], when: SERVE_WHEN, noVenue: true },

  { date: "2026-11-22", send: "8:00pm", type: "Shiloh shirt", image: "11-shirt-square.png", link: "tshirt", verb: "Reserve yours at",
    hook: "*December mornings in Lincoln call for a hoodie.* 🧥",
    body: ["The Shiloh 2026 hoodie from Winners Chapel Lincoln has Far Above across the front and comes in white, red or wine. Reserve yours on the page and the team will message you about payment and collection."],
    facts: [PRICES], noDate: true, noVenue: true },

  { date: "2026-11-23", send: "8:00pm", type: "Countdown · 15 days", image: "countdown/2026-11-23-15-days-square.png", link: "home", verb: "Learn more at",
    hook: "*15 days to Shiloh 2026.* 🔥",
    body: ["Shiloh is the biggest week of the year at Winners Chapel Lincoln: six days, with the whole church together in one room. Who are you bringing with you?"],
    opens: true, noDate: true },

  { date: "2026-11-24", send: "8:00pm", type: "UK Foreign Delegates", image: "08-delegates-square.png", link: "delegate", verb: "Register your interest at",
    hook: "*Want to attend Shiloh 2026 in person at Canaanland?* ✈️",
    body: ["Every year a delegation from the UK travels to Canaanland, Ota, for Shiloh. If you would like to go as a UK Foreign Delegate, register your interest with Winners Chapel Lincoln and the team will be in touch with everything you need to know."],
    noDate: true, noVenue: true },

  { date: "2026-11-25", send: "8:00pm", type: "Stay nearby (text only)", image: null, link: "camping", verb: "Tell us at",
    hook: "*Travelling to Lincoln for Shiloh 2026?* 🏠",
    body: ["If you are coming from out of town, or want to stay close for the 5:00am sessions, the hospitality team at Winners Chapel Lincoln can help. Tell us who is coming and for how long, and the team will come back to you with options."] },

  { date: "2026-11-26", send: "8:00pm", type: "Class spotlight", image: "06-classes-05.png", link: "classes", verb: "Book your class at",
    hook: "*Class spotlight: Business and Career Breakthrough.* 💼",
    body: ["Winners Chapel Lincoln is running seven specialised classes at Shiloh 2026, and this is one of them. It is for entrepreneurs, professionals and job seekers believing God for a turnaround. If that is you, or someone you know, book a place."],
    facts: [CLASS_TIME], noDate: true },

  { date: "2026-11-27", send: "8:00pm", type: "Free bus", image: "05-bus-square.png", link: "transport", verb: "Book your seat at",
    hook: "*Have you booked your free bus seat for Shiloh?* 🚌",
    body: ["The free bus from Winners Chapel Lincoln runs to every session from four pick-up points. Booking tells us how many seats to plan for, so choose your pick-up point and sessions today."],
    facts: [PICKUPS], when: BUS_RUNS, where: BUS_TO },

  { date: "2026-11-28", send: "8:00pm", type: "Countdown · 10 days", image: "countdown/2026-11-28-10-days-square.png", link: "home", verb: "Learn more at",
    hook: "*10 days to Shiloh 2026.* 🔥",
    body: ["Winners Chapel Lincoln is getting ready to welcome you. The programme, the bookings and the directions are all on one page, so you can plan your week now."],
    opens: true, noDate: true },

  { date: "2026-11-29", send: "8:00pm", type: "Shiloh shirt", image: "11-shirt-square.png", link: "tshirt", verb: "Reserve yours at",
    hook: "*Shiloh is 9 days away. Have you reserved your shirt?* 👕",
    body: ["The Shiloh 2026 polo shirts and hoodies from Winners Chapel Lincoln come in white, red or wine, for men, women and kids. Reserve yours on the page and the team will message you about payment and collection."],
    facts: [PRICES], noDate: true, noVenue: true },

  { date: "2026-11-30", send: "8:00pm", type: "Volunteer", image: "09-volunteer-square.png", link: "volunteer", verb: "Sign up at",
    hook: "*Will you serve at Shiloh 2026?* 🙌",
    body: ["Winners Chapel Lincoln needs volunteers in every unit, from driving and welcome to media, kitchen and first aid. Tell us the days and sessions you can cover and we will put you on a rota that fits your week."],
    when: SERVE_WHEN, noVenue: true },

  { date: "2026-12-01", send: "8:00pm", type: "Countdown · 7 days", image: "countdown/2026-12-01-07-days-square.png", link: "home", verb: "Learn more at",
    hook: "*One week to Shiloh 2026.* 🙏",
    body: ["Next Tuesday, Winners Chapel Lincoln begins six days of prayer and the Word. Use this week to clear your diary and invite the people you love."],
    opens: true, noDate: true },

  // The softer posts, once the things to book have had their turn.
  { date: "2026-12-02", send: "8:00pm", type: "Programme", image: "04-programme-story.png", link: "programme", verb: "See the full programme at",
    hook: "*Plan your Shiloh week.*",
    body: ["Shiloh 2026 at Winners Chapel Lincoln runs from Tuesday 8 to Sunday 13 December, and each day builds on the one before. This is what a full day looks like, so you can plan to be in every session."],
    facts: [list("A full day", [...DAY_ITEMS, "Encounter Night: 5:00pm"])], noDate: true },

  { date: "2026-12-03", send: "8:00pm", type: "Countdown · 5 days", image: "countdown/2026-12-03-05-days-square.png", link: "home", verb: "Learn more at",
    hook: "*5 days to Shiloh 2026.* 🔥",
    body: ["Winners Chapel Lincoln is ready to welcome you. If there is anything you still need to sort out before Tuesday, you will find it on one page."],
    opens: true, noDate: true },

  { date: "2026-12-04", send: "8:00pm", type: "Invite someone", image: "07-invite-story.png", link: "home", verb: "Learn more at",
    hook: "*Who are you bringing to Shiloh 2026?* 🙏",
    body: ["Shiloh at Winners Chapel Lincoln is free and open to everyone: family, friends, colleagues and neighbours. Think of one person who needs it and forward this message to them."] },

  { date: "2026-12-05", send: "8:00pm", type: "Countdown · 3 days", image: "countdown/2026-12-05-03-days-square.png", link: "programme", verb: "Add the week to your calendar at",
    hook: "*3 days to Shiloh 2026.* 🙏",
    body: ["Put Shiloh in your calendar now so you do not miss a session. The Winners Chapel Lincoln Shiloh page has a button that adds the whole week for you."] },

  { date: "2026-12-06", send: "8:00pm", type: "Theme · Far Above", image: "countdown/2026-12-06-02-days-square.png", link: "home", verb: "Learn more at",
    hook: "*2 days to Shiloh 2026: Far Above.* ✨",
    body: ["“And hath raised us up together, and made us sit together in heavenly places in Christ Jesus.” Ephesians 2:6",
      "Far Above is the theme of Shiloh 2026. Winners Chapel Lincoln invites you to come for all six days, and to bring someone with you."],
    opens: true, noDate: true },

  { date: "2026-12-07", send: "8:00pm", type: "Countdown · 1 day", image: "countdown/2026-12-07-01-days-square.png", link: "arrive", verb: "See what to expect at",
    hook: "*Shiloh 2026 opens tomorrow evening.* 🔥",
    body: ["If this is your first time at Winners Chapel Lincoln, come to the welcome desk at the entrance and someone will show you where to sit. Bring your Bible, a notebook and pen, and a warm layer for the early mornings."],
    opens: true, noDate: true },

  // Shiloh week. The opening night is a morning post; every other day's card goes out the evening before.
  { date: "2026-12-08", send: "8:00am", type: "Opening day", image: "today/2026-12-08-day-1-square.png", link: "home", verb: "Learn more at",
    hook: "*Shiloh 2026 opens today at 5:00pm.* 🔥",
    body: ["Winners Chapel Lincoln begins six days of Shiloh this evening with the Opening Encounter Night. Arrive before 5:00pm, come expecting, and bring someone with you."],
    noDate: true },

  { date: "2026-12-08", send: "8:00pm", type: "Tomorrow · Wednesday", image: "tomorrow/2026-12-09-day-2-square.png", link: "programme", verb: "See the full programme at",
    hook: "*Tomorrow at Shiloh: the first full day.*",
    body: ["Tomorrow is the first full day of Shiloh at Winners Chapel Lincoln, and it starts at 5:00am. Set your alarm tonight. 🙏"],
    facts: [list("Wednesday 9 December", [...DAY_ITEMS, "Encounter Night: 5:00pm"], false)], noDate: true },

  { date: "2026-12-09", send: "8:00pm", type: "Tomorrow · Thursday", image: "tomorrow/2026-12-10-day-3-square.png", link: "programme", verb: "See the full programme at",
    hook: "*Tomorrow at Shiloh: Thursday, day 3 of 6.*",
    body: ["Shiloh continues at Winners Chapel Lincoln tomorrow. Each session builds on the one before, so plan to be in all four."],
    facts: [list("Thursday 10 December", [...DAY_ITEMS, "Encounter Night: 5:00pm"], false)], noDate: true },

  { date: "2026-12-10", send: "8:00pm", type: "Tomorrow · Friday", image: "tomorrow/2026-12-11-day-4-square.png", link: "programme", verb: "See the full programme at",
    hook: "*Tomorrow at Shiloh: Victory Celebration Night.* 🎉",
    body: ["Friday at Winners Chapel Lincoln follows the full-day programme and ends with the Victory Celebration Night at 5:00pm. Come ready to celebrate."],
    facts: [list("Friday 11 December", [...DAY_ITEMS, "Victory Celebration Night: 5:00pm"], false)], noDate: true },

  { date: "2026-12-11", send: "8:00pm", type: "Tomorrow · Saturday", image: "tomorrow/2026-12-12-day-5-square.png", link: "programme", verb: "See the full programme at",
    hook: "*Tomorrow at Shiloh: the Impartation Service.*",
    body: ["Saturday has one session at Winners Chapel Lincoln, the Impartation Service, and it starts early. Set your alarm tonight and come ready to receive. 🙏"],
    facts: ["*Date:* Saturday 12 December", "*Time:* 5:00am UK time"], noDate: true },

  { date: "2026-12-12", send: "8:00pm", type: "Tomorrow · Sunday", image: "tomorrow/2026-12-13-day-6-square.png", link: "home", verb: "Learn more at",
    hook: "*Tomorrow at Shiloh: Thanksgiving Sunday.* 🙏",
    body: ["Shiloh 2026 closes at Winners Chapel Lincoln with two Thanksgiving Services. Bring your invitees and new converts. Everyone coming for the first time will be warmly welcomed."],
    facts: [list("Sunday 13 December", ["Shiloh Thanksgiving Service 1: 9:20am", "Shiloh Thanksgiving Service 2: 11:15am"], false)], noDate: true },

  { date: "2026-12-13", send: "3:00pm", type: "Thank you · testimonies (text only)", image: null, link: "testimonies", verb: "Share your testimony at",
    hook: "*Thank you, Lord, for Shiloh 2026.* 🙌",
    body: ["What did God do for you this week? Winners Chapel Lincoln would love to hear it. Share your testimony on the page; it could be the word that encourages someone else."],
    noDate: true, noVenue: true },
];

for (const p of POSTS) {
  const facts = [...(p.facts || [])];
  if (p.when) facts.push(p.when); else if (!p.noDate) facts.push(DATE);
  if (p.opens) facts.push(OPENS);
  if (p.where) facts.push(p.where); else if (!p.noVenue) facts.push(VENUE);
  p.url = LINKS[p.link];
  // Single-line facts sit together; a list gets a blank line before and after it.
  const factText = facts.reduce((out, f, i) => i === 0 ? f : out + (f.includes("\n") || facts[i - 1].includes("\n") ? "\n\n" : "\n") + f, "");
  p.caption = [p.hook, ...p.body, factText, p.verb + " " + p.url].join("\n\n");
}

module.exports = { BASE, LINKS, LINK_NAMES, POSTS };
