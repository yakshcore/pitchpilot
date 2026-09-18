// ============================================================================
//  templates.js  —  The actual words. This is your copy; edit it in your voice.
//
//  A 4-touch cold sequence. Rules baked in from real outreach practice:
//   • First email < ~110 words (people read on their phone)
//   • No flattery opener ("I love your business") — it's the #1 bot tell
//   • Every follow-up adds something NEW — never "just checking in"
//   • Only claims that are true (proof comes from config.proof)
//   • One clear call-to-action per email
//   • An honest opt-out line so it never feels like spam
//
//  Each function receives `ctx` (built in personalize.js) and returns
//  { subject, body }. `ctx.tone` is "warm" | "neutral" | "cold".
// ============================================================================

// Small helper: pick the CTA based on whether a booking link exists + tone.
function cta(ctx) {
  if (ctx.sender.bookingLink)
    return `If it's useful, grab 15 min here: ${ctx.sender.bookingLink}`;
  if (ctx.tone === "cold")
    return `Worth a quick reply? Even a "not now" is fine.`;
  return `Open to a 10-minute call this week? Happy to work around your hours.`;
}

const signature = (ctx) => {
  const studio = ctx.sender.studio ? ` · ${ctx.sender.studio}` : "";
  return `${ctx.voice.signoff}\n${ctx.sender.name}${studio} · ${ctx.sender.portfolio}`;
};

const optOut = `\n\n(If this isn't relevant, reply "stop" and I won't follow up.)`;

// ── TOUCH 1 — day 0 — the cold open, grounded in something real ─────────────
export function touch1(ctx) {
  // The opening line is the whole ballgame. Prefer the real hook; otherwise
  // name the niche pain honestly (and keep it a plainly-cold, short note).
  const opener = ctx.hook
    ? ctx.hook
    : `I work with ${ctx.nichePlural} around ${ctx.city || "your area"} on ${ctx.painPoint}.`;

  const subject = ctx.hook
    ? `Quick idea for ${ctx.businessName}`
    : `${ctx.businessName}: ${ctx.offerLabel}?`;

  const body =
`${ctx.greeting}

${opener}

I'm a full-stack developer and I build ${ctx.offerBuilds} for ${ctx.offerForWho}. ${ctx.proofText}

If ${ctx.businessName} could use that, I'd be glad to show you what I'd do — no pitch, just a couple of concrete ideas.

${cta(ctx)}${optOut}

${signature(ctx)}`;

  return { subject, body };
}

// ── TOUCH 2 — day 4 — proof / credibility from a different angle ────────────
export function touch2(ctx) {
  const subject = `Re: ${ctx.businessName} — a quick example`;
  const body =
`${ctx.greeting}

Following up with something concrete instead of a nudge.

${ctx.proofText} I mention it because the same approach fits ${ctx.businessName} — ${ctx.painPoint} is exactly the kind of thing I remove.

You can see a few builds here: ${ctx.sender.portfolio}

${cta(ctx)}

${signature(ctx)}`;
  return { subject, body };
}

// ── TOUCH 3 — day 10 — a specific, low-risk offer ───────────────────────────
export function touch3(ctx) {
  const subject = `${ctx.businessName}: want me to sketch it?`;
  const body =
`${ctx.greeting}

I'll make this easy. If you're open to it, I'll put together a short, free outline of ${ctx.offerLabel} for ${ctx.businessName} — what it'd include, roughly how long, and what it'd cost. No obligation.

Just reply "yes" and I'll send it over this week.

${signature(ctx)}`;
  return { subject, body };
}

// ── TOUCH 4 — day 21 — clean close-out (the breakup that gets replies) ──────
export function touch4(ctx) {
  const subject = `Should I close the loop, ${ctx.firstNameOrThere}?`;
  const body =
`${ctx.greeting}

I don't want to crowd your inbox, so this is my last note.

If ${ctx.offerLabel} isn't a priority right now, all good — I'll leave it here. If the timing's just off, tell me when to check back and I will.

Either way, wishing ${ctx.businessName} well.${optOut}

${signature(ctx)}`;
  return { subject, body };
}

// Sequence lookup by step index (0-based).
export const SEQUENCE = [touch1, touch2, touch3, touch4];

export default { SEQUENCE };
