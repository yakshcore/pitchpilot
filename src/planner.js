// ============================================================================
//  planner.js  —  The stateless brain.
//  Google Sheets is the database (n8n reads it and passes the rows in here).
//  This module holds NO state: given today's rows, it returns the emails to
//  send and the exact values n8n should write back to each row after sending.
// ============================================================================

import { config } from "../config.js";
import { score } from "./scoring.js";
import { buildEmail } from "./personalize.js";

const maxTouches = config.cadence.maxTouches;
const todayStr = (d = new Date()) => d.toISOString().slice(0, 10);

// Turn a raw sheet row (all strings) into a normalized lead object.
// Blank status = a brand-new lead. Blank step = 0.
function normalize(row) {
  return {
    rowNumber: row.row_number ?? row.rowNumber ?? null, // n8n gives row_number
    businessName: (row.businessName || "").trim(),
    contactName: (row.contactName || "").trim(),
    email: (row.email || "").trim(),
    niche: (row.niche || "default").trim().toLowerCase(),
    city: (row.city || "").trim(),
    website: (row.website || "").trim(),
    hook: (row.hook || "").trim(),
    notes: (row.notes || "").trim(),
    status: (row.status || "new").trim().toLowerCase(),
    sequenceStep: parseInt(row.sequenceStep, 10) || 0,
    nextTouchAt: (row.nextTouchAt || "").trim(),
    threadId: (row.threadId || "").trim(),
    sentAt: (row.sentAt || "").trim(),
  };
}

// Given all rows, decide today's send list.
//   rows  : array of sheet rows (objects, include row_number)
//   opts  : { cap, limit, now }
// Returns { count, sentToday, remaining, emails: [ ... ] }
export function planToday(rows, opts = {}) {
  const now = opts.now ? new Date(opts.now) : new Date();
  const cap = Number(opts.cap ?? process.env.DAILY_CAP ?? config.cadence?.dailyCap ?? 30);
  const limit = Number(opts.limit ?? cap);

  const leads = (rows || []).map(normalize).filter((l) => l.email);

  // How many already went out today (from the sheet's sentAt column).
  const today = todayStr(now);
  const sentToday = leads.filter((l) => l.sentAt.slice(0, 10) === today).length;

  const remaining = Math.max(0, cap - sentToday);
  const take = Math.min(remaining, limit);
  if (take === 0) return { count: 0, sentToday, remaining, emails: [] };

  const nowMs = now.getTime();

  // 1) Due follow-ups (warmer — they've heard from you already).
  const followups = leads
    .filter(
      (l) =>
        l.status === "contacted" &&
        l.sequenceStep < maxTouches &&
        l.nextTouchAt &&
        new Date(l.nextTouchAt).getTime() <= nowMs
    )
    .sort((a, b) => new Date(a.nextTouchAt) - new Date(b.nextTouchAt));

  // 2) Brand-new leads, best first.
  const fresh = leads
    .filter((l) => l.status === "new")
    .map((l) => score(l)) // sets reliability + offer
    .sort((a, b) => b.reliability - a.reliability);

  const chosen = [...followups, ...fresh].slice(0, take);

  const emails = chosen.map((lead) => {
    score(lead); // ensure reliability + offer are set (followups too)
    const email = buildEmail(lead, lead.sequenceStep);

    // The post-send state n8n will write back to this row.
    const nextStep = lead.sequenceStep + 1;
    const done = nextStep >= maxTouches;
    const waitDays = config.cadence.daysBetween[nextStep] ?? 7;
    const nextTouchAt = done
      ? ""
      : new Date(nowMs + waitDays * 86400000).toISOString();

    return {
      rowNumber: lead.rowNumber,
      to: email.to,
      subject: email.subject,
      body: email.body,
      touch: lead.sequenceStep + 1, // human 1..4
      cold: email.cold,
      businessName: lead.businessName,
      reliability: lead.reliability,
      offer: lead.offer,
      // ↓ write these back to the sheet AFTER a successful send
      update: {
        status: done ? "done" : "contacted",
        sequenceStep: nextStep,
        nextTouchAt,
        sentAt: now.toISOString(),
      },
    };
  });

  return { count: emails.length, sentToday, remaining, emails };
}

export default { planToday };
