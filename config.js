// ============================================================================
//  config.js  -  The ONE file you'll edit most.
//  Everything about "who you are" and "who you're selling to" lives here.
//  No code logic - just your details. Change freely.
// ============================================================================

export const config = {
  // ── YOU (goes into signatures + proof) ────────────────────────────────────
  sender: {
    name: "Yaksh Bambhroliya",
    firstName: "Yaksh",
    // The Gmail you'll actually connect inside n8n and send from:
    email: "yaksh.core@gmail.com",
    role: "Full-stack developer (MERN / Next.js / AI)",
    portfolio: "https://yakshcore.vercel.app",
    github: "https://github.com/yakshcore",
    linkedin: "https://www.linkedin.com/in/yaksh-bambhroliya",
    phone: "+91 97257 83139",
    // Your studio - adds credibility ("I run a small studio" beats "freelancer").
    // Set to "" to leave it out of the signature entirely.
    studio: "Obscur Labs",
    studioUrl: "https://github.com/Obscur-Labs",
    // A booking link makes the CTA frictionless. Make a free Cal.com / Calendly
    // link and paste it here. Leave "" to fall back to a "reply to chat" CTA.
    bookingLink: "",
  },

  // ── YOUR VOICE  (the anti-bot layer) ──────────────────────────────────────
  // These aren't decoration - personalize.js obeys them so emails sound like
  // a real developer, not a template. Tune after you read a few drafts.
  voice: {
    greeting: "Hi {{firstName}},", // {{firstName}} of the PROSPECT
    greetingNoName: "Hi there,", // used when we don't know their name
    signoff: "- Yaksh",
    useContractions: true, // "I'm", "you're" (sounds human)
    useExclamations: false, // exclamation marks read as salesy
    maxWordsFirstTouch: 110, // phones. keep it short.
  },

  // ── PROOF POINTS  (ONLY real things from your resume - never invent) ───────
  // personalize.js picks the one most relevant to each offer.
  proof: {
    crm: "I recently built a visa-processing CRM that cut a client's manual case-tracking by ~60%.",
    ai: "I shipped an AI meal-planning platform (Gemini + Claude) that loads ~40% faster and serves 30+ restaurants.",
    scale:
      "I've built real-time apps that comfortably handle 500+ concurrent users.",
    web: "I build fast Next.js sites that actually convert - not just look nice.",
  },

  // ── OFFERS  (what you pitch; chosen automatically per lead) ────────────────
  // The engine picks an offer from the lead's data (see scoring.js → chooseOffer).
  offers: {
    website_build: {
      label: "a fast, modern website", // noun: "an outline of ___"
      builds: "fast websites with online ordering built in", // plural: "I build ___"
      forWho: "food shops with no website or an outdated one",
      proof: "web",
    },
    revamp: {
      label: "a rebuilt website",
      builds: "website rebuilds",
      forWho: "food businesses whose site is slow, dated, or not mobile-friendly",
      proof: "web",
    },
    web_app: {
      label: "an online ordering & booking system",
      builds: "online ordering and table-booking systems",
      forWho: "food businesses still taking every order and booking by phone",
      proof: "crm",
    },
    ai_integration: {
      label: "an AI feature",
      builds: "AI features into existing products",
      forWho: "product teams who want AI without the research overhead",
      proof: "ai",
    },
  },

  // ── TARGET NICHES  +  the specific pain each one feels ─────────────────────
  // Tuned for EUROPEAN FOOD BUSINESSES (bakeries, restaurants, delis, etc.).
  // The "painPoint" makes an email feel written for THEM, not merged.
  // Key must match the "niche" column in your Sheet.
  niches: {
    bakery: { painPoint: "customers who can't order your bread and cakes online" },
    patisserie: { painPoint: "no online store for cakes and pre-orders" },
    restaurant: { painPoint: "taking every reservation and order over the phone" },
    bistro: { painPoint: "diners who can't see your menu or book a table online" },
    pizzeria: { painPoint: "losing 30% to delivery apps on every order" },
    cafe: { painPoint: "customers who can't find your menu online" },
    deli: { painPoint: "no way for locals to order a platter online" },
    butcher: { painPoint: "no online ordering for cuts and holiday pre-orders" },
    greengrocer: { painPoint: "no online store or local delivery" },
    cheesemonger: { painPoint: "no online shop for your cheeses and hampers" },
    chocolatier: { painPoint: "no online store for gifting and pre-orders" },
    catering: { painPoint: "quote requests that run entirely through phone and email" },
    winebar: { painPoint: "no online table booking" },
    foodshop: { painPoint: "no way to sell your products online" },
    default: { painPoint: "customers who can't order or book online" },
  },

  // ── SEQUENCE CADENCE  (4 touches over ~3 weeks; days AFTER the first send) ──
  // Every follow-up says something NEW (see templates.js). Never "just checking in".
  cadence: {
    // step index -> days to wait before that touch (step 0 is the first email)
    daysBetween: [0, 4, 6, 11], // -> sends on day 0, 4, 10, 21
    maxTouches: 4,
  },
};

export default config;
