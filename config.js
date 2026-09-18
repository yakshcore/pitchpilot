// ============================================================================
//  config.js  —  The ONE file you'll edit most.
//  Everything about "who you are" and "who you're selling to" lives here.
//  No code logic — just your details. Change freely.
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
    // Your studio — adds credibility ("I run a small studio" beats "freelancer").
    // Set to "" to leave it out of the signature entirely.
    studio: "Obscur Labs",
    studioUrl: "https://github.com/Obscur-Labs",
    // A booking link makes the CTA frictionless. Make a free Cal.com / Calendly
    // link and paste it here. Leave "" to fall back to a "reply to chat" CTA.
    bookingLink: "",
  },

  // ── YOUR VOICE  (the anti-bot layer) ──────────────────────────────────────
  // These aren't decoration — personalize.js obeys them so emails sound like
  // a real developer, not a template. Tune after you read a few drafts.
  voice: {
    greeting: "Hi {{firstName}},",          // {{firstName}} of the PROSPECT
    greetingNoName: "Hi there,",             // used when we don't know their name
    signoff: "— Yaksh",
    useContractions: true,                   // "I'm", "you're" (sounds human)
    useExclamations: false,                  // exclamation marks read as salesy
    maxWordsFirstTouch: 110,                 // phones. keep it short.
  },

  // ── PROOF POINTS  (ONLY real things from your resume — never invent) ───────
  // personalize.js picks the one most relevant to each offer.
  proof: {
    crm: "I recently built a visa-processing CRM that cut a client's manual case-tracking by ~60%.",
    ai:  "I shipped an AI meal-planning platform (Gemini + Claude) that loads ~40% faster and serves 30+ restaurants.",
    scale: "I've built real-time apps that comfortably handle 500+ concurrent users.",
    web: "I build fast Next.js sites that actually convert — not just look nice.",
  },

  // ── OFFERS  (what you pitch; chosen automatically per lead) ────────────────
  // The engine picks an offer from the lead's data (see scoring.js → chooseOffer).
  offers: {
    website_build: {
      label: "a fast, modern website",              // noun: "an outline of ___"
      builds: "fast, modern websites",              // plural: "I build ___"
      forWho: "businesses with no website or an outdated one",
      proof: "web",
    },
    revamp: {
      label: "a rebuilt website",
      builds: "website rebuilds",
      forWho: "businesses whose site is slow, dated, or not mobile-friendly",
      proof: "web",
    },
    web_app: {
      label: "a custom web app",
      builds: "custom web apps and internal tools",
      forWho: "businesses drowning in spreadsheets or manual workflows",
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
  // The "painPoint" makes an email feel written for THEM, not merged.
  // Add/remove niches freely. Key must match the "niche" column in your CSV.
  niches: {
    restaurant:   { painPoint: "taking orders and bookings over the phone" },
    cafe:         { painPoint: "customers who can't find your menu online" },
    clinic:       { painPoint: "appointment booking that still runs on calls" },
    dental:       { painPoint: "no-shows and phone-only booking" },
    gym:          { painPoint: "chasing membership sign-ups manually" },
    salon:        { painPoint: "bookings you have to manage by hand" },
    realestate:   { painPoint: "listings that are hard to update and share" },
    retail:       { painPoint: "having no way to sell online" },
    boutique:     { painPoint: "no online store for your products" },
    lawfirm:      { painPoint: "clients who can't book a consult online" },
    accountant:   { painPoint: "onboarding new clients through email chains" },
    coaching:     { painPoint: "signups and scheduling scattered across DMs" },
    startup:      { painPoint: "needing to ship an MVP fast" },
    saas:         { painPoint: "wanting AI features without hiring for it" },
    default:      { painPoint: "manual work that a bit of software could remove" },
  },

  // ── SEQUENCE CADENCE  (4 touches over ~3 weeks; days AFTER the first send) ──
  // Every follow-up says something NEW (see templates.js). Never "just checking in".
  cadence: {
    // step index -> days to wait before that touch (step 0 is the first email)
    daysBetween: [0, 4, 6, 11],   // -> sends on day 0, 4, 10, 21
    maxTouches: 4,
  },
};

export default config;
