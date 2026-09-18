// ============================================================================
//  server.js  -  PitchPilot backend (STATELESS).
//  The brain. Holds no data. Google Sheets (via n8n) is the database.
//  Deploy this to Render; n8n calls it once a day.
//    Local:  npm start   ->  http://localhost:3000
// ============================================================================

import express from "express";
import { config } from "../config.js";
import { score } from "./scoring.js";
import { buildEmail } from "./personalize.js";
import { planToday } from "./planner.js";

// Load .env locally (Render injects env vars directly, so this just no-ops there).
try {
  process.loadEnvFile(new URL("../.env", import.meta.url));
} catch {
  /* no .env */
}

const PORT = Number(process.env.PORT || 3000); // Render sets PORT for you
const API_KEY = process.env.API_KEY || "";
const app = express();
app.use(express.json({ limit: "4mb" })); // room for a few thousand sheet rows

// ── Auth: everything under /api needs the shared key (except health) ─────────
app.use("/api", (req, res, next) => {
  if (req.path === "/health") return next();
  if (!API_KEY) return next(); // no key set -> open (local dev only)
  if (req.get("x-api-key") === API_KEY) return next();
  return res.status(401).json({ error: "bad or missing x-api-key" });
});

app.get("/api/health", (_req, res) =>
  res.json({ ok: true, service: "pitchpilot", time: new Date().toISOString() }),
);

// ── THE MAIN ENDPOINT n8n calls every morning ───────────────────────────────
// Body: { rows: [ ...all sheet rows... ], limit?: number, cap?: number }
// Returns: { count, sentToday, remaining, emails: [ {to,subject,body,rowNumber,update,...} ] }
app.post("/api/plan-today", (req, res) => {
  const rows = req.body?.rows;
  if (!Array.isArray(rows))
    return res.status(400).json({ error: "body must be { rows: [...] }" });
  const result = planToday(rows, {
    limit: req.body?.limit,
    cap: req.body?.cap,
  });
  res.json(result);
});

// ── Compose a single email (handy for testing / one-offs) ───────────────────
// Body: a lead object + optional { step }. Returns { to, subject, body, cold }.
app.post("/api/compose", (req, res) => {
  const lead = req.body || {};
  if (!lead.email)
    return res.status(400).json({ error: "lead needs an email" });
  score(lead);
  res.json({
    ...buildEmail(lead, Number(lead.step || 0)),
    reliability: lead.reliability,
    offer: lead.offer,
  });
});

app.get("/", (_req, res) =>
  res
    .type("text")
    .send(
      "PitchPilot backend (stateless) is running.\n" +
        "POST /api/plan-today  { rows:[...] }   (needs x-api-key)\n" +
        "GET  /api/health\n",
    ),
);

app.listen(PORT, () => {
  console.log(`\n  PitchPilot backend -> http://localhost:${PORT}`);
  console.log(
    `  Daily cap: ${process.env.DAILY_CAP || 30}  |  API key ${API_KEY ? "IS" : "is NOT"} set.\n`,
  );
});
