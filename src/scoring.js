// ============================================================================
//  scoring.js  -  Two jobs:
//   1) reliability(lead): how solid/valuable this lead looks (1-5).
//   2) chooseOffer(lead): what to actually pitch them.
//  Both are pure heuristics from the lead's own data. Tweak the rules freely.
// ============================================================================

const FREE_MAIL = [
  "gmail.",
  "yahoo.",
  "hotmail.",
  "outlook.",
  "icloud.",
  "proton.",
];

function isBusinessEmail(email = "") {
  const domain = email.split("@")[1]?.toLowerCase() || "";
  return domain && !FREE_MAIL.some((f) => domain.startsWith(f));
}

// 1..5 - drives TONE and how much effort each email invests.
// Higher = looks like a real, reachable, payment-capable business.
export function reliability(lead) {
  let score = 3;
  if (lead.contactName) score += 1; // we can address a real person
  if (isBusinessEmail(lead.email)) score += 1; // own domain = established
  if (lead.hook) score += 1; // we have a genuine reason
  if (!lead.website) score -= 0; // no site = opportunity, neutral
  if (/info@|contact@|admin@|hello@/i.test(lead.email)) score -= 1; // generic inbox
  return Math.max(1, Math.min(5, score));
}

// Map reliability -> tone the templates use.
export function tier(rel) {
  if (rel >= 4) return "warm"; // named, established -> specific, offer a call
  if (rel <= 2) return "cold"; // thin/generic -> short, low-friction ask
  return "neutral";
}

// Decide WHAT to pitch from the lead's data.
// Order matters: first match wins.
export function chooseOffer(lead) {
  const niche = (lead.niche || "").toLowerCase();
  // Read both notes AND the hook - the hook often reveals the real need.
  const text = ((lead.notes || "") + " " + (lead.hook || "")).toLowerCase();

  const has = (...words) => words.some((w) => text.includes(w));

  // Signals that they need software, not just a brochure site.
  if (
    has(
      "app",
      "tool",
      "crm",
      "schedul",
      "booking",
      "book online",
      "inventory",
      "spreadsheet",
      "manual",
    )
  )
    return "web_app";
  if (has(" ai", "ai ", "ai feature", "chatbot", "automation"))
    return "ai_integration";
  if (has("redesign", "revamp", "outdated", "slow", "old site", "not mobile"))
    return "revamp";

  // Product/tech niches -> app or AI work.
  if (niche === "saas" || niche === "startup") return "web_app";

  // No website at all -> build them one. This is the strongest opener.
  if (!lead.website) return "website_build";

  // Has a website already -> pitch a rebuild.
  return "revamp";
}

// Enrich a lead in place with reliability + offer. Call on import and re-import.
export function score(lead) {
  lead.reliability = reliability(lead);
  lead.offer = chooseOffer(lead);
  return lead;
}

export default { reliability, tier, chooseOffer, score };
