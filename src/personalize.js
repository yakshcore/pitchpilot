// ============================================================================
//  personalize.js  -  Turns a lead + a step number into a real email.
//  Builds the context object the templates read, and enforces voice rules.
// ============================================================================

import { config } from "../config.js";
import { tier } from "./scoring.js";
import { SEQUENCE } from "./templates.js";

const firstNameOf = (full = "") => full.trim().split(/\s+/)[0] || "";

// Enforce voice.useExclamations = false, etc. Cheap guardrails against slop.
function applyVoice(text) {
  if (!config.voice.useExclamations) text = text.replace(/!+/g, ".");
  return text
    .replace(/[ \t]+\n/g, "\n")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

// Human-readable plural of a niche for the opener ("restaurants", "clinics").
function nichePlural(niche) {
  const map = {
    restaurant: "restaurants",
    cafe: "cafes",
    clinic: "clinics",
    dental: "dental practices",
    gym: "gyms",
    salon: "salons",
    realestate: "real-estate agents",
    retail: "retailers",
    boutique: "boutiques",
    lawfirm: "law firms",
    accountant: "accountants",
    coaching: "coaches",
    startup: "startups",
    saas: "SaaS teams",
    default: "small businesses",
  };
  return map[niche] || "small businesses";
}

// Build the ctx object every template function reads.
export function buildContext(lead) {
  const offerKey = lead.offer || "website_build";
  const offer = config.offers[offerKey] || config.offers.website_build;
  const niche = config.niches[lead.niche] || config.niches.default;
  const proofText = config.proof[offer.proof] || config.proof.web;
  const first = firstNameOf(lead.contactName);
  const tone = tier(lead.reliability);

  const greeting = first
    ? config.voice.greeting.replace("{{firstName}}", first)
    : config.voice.greetingNoName;

  return {
    // identity / config passthrough
    sender: config.sender,
    voice: config.voice,
    tone,

    // lead-derived fields the templates use
    businessName: lead.businessName || "your business",
    firstName: first,
    firstNameOrThere: first || "there",
    greeting,
    city: lead.city,
    hook: lead.hook,
    niche: lead.niche,
    nichePlural: nichePlural(lead.niche),
    painPoint: niche.painPoint,

    // offer
    offerKey,
    offerLabel: offer.label,
    offerBuilds: offer.builds || offer.label,
    offerForWho: offer.forWho,
    proofText,
  };
}

// Main entry: give a lead + step (0-based) -> { subject, body, cold }.
export function buildEmail(lead, step = 0) {
  const fn = SEQUENCE[Math.min(step, SEQUENCE.length - 1)];
  const ctx = buildContext(lead);
  const { subject, body } = fn(ctx);
  return {
    to: lead.email,
    subject: applyVoice(subject),
    body: applyVoice(body),
    cold: !lead.hook, // flag: true = plainly-cold (no real hook)
    step,
  };
}

export default { buildEmail, buildContext };
