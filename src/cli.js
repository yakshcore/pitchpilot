// ============================================================================
//  cli.js  -  Read your email copy in the terminal, no server or DB needed.
//    npm run preview            -> full 4-touch sequence for a sample lead
//    npm run preview -- app     -> sample lead that needs a web app
//    npm run preview -- ai      -> sample lead that needs an AI feature
//  Edit src/templates.js, run again, repeat until it sounds like you.
// ============================================================================

import { score } from "./scoring.js";
import { buildEmail } from "./personalize.js";

const kind = process.argv[3] || process.argv[2] || "website";

const SAMPLES = {
  website: {
    businessName: "Blue Fig Cafe",
    contactName: "Priya Shah",
    email: "priya@bluefig.example.com",
    niche: "cafe",
    city: "Ahmedabad",
    website: "",
    hook: "Blue Fig has 4.6 stars on Google but no website, so people can't find your menu online.",
  },
  app: {
    businessName: "BrightPath Coaching",
    contactName: "Amit Desai",
    email: "amit@brightpath.example.com",
    niche: "coaching",
    city: "Vadodara",
    website: "",
    hook: "Your scheduling is scattered across DMs and Google Forms instead of one booking tool.",
  },
  ai: {
    businessName: "Nova SaaS Labs",
    contactName: "Karan Joshi",
    email: "karan@novasaas.example.com",
    niche: "saas",
    city: "Remote",
    website: "https://novasaas.example.com",
    notes: "ai",
    hook: "Your product still has no AI features while competitors just shipped one.",
  },
};

const lead = score({ ...(SAMPLES[kind] || SAMPLES.website) });

console.log(`\n=== ${lead.businessName} ===`);
console.log(
  `reliability: ${lead.reliability}/5   offer: ${lead.offer}   niche: ${lead.niche}\n`,
);

for (let step = 0; step < 4; step++) {
  const e = buildEmail(lead, step);
  console.log("────────────────────────────────────────────────────────");
  console.log(`TOUCH ${step + 1}${e.cold ? "  (cold - no hook)" : ""}`);
  console.log(`Subject: ${e.subject}\n`);
  console.log(e.body);
  console.log("");
}
