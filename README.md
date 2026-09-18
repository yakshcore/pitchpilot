# PitchPilot

A small machine that emails ~30 hand-picked small businesses a day to land you
freelance contracts — websites, web apps, AI features. It writes in **your** voice
(Yaksh Bambhroliya · Obscur Labs), personalizes every email around a **real reason**,
and runs a **4-touch follow-up sequence** so you never forget who to chase.

Everything lives online. Nothing to keep running on your laptop, no local data files.

---

## How it fits together (read this once)

Three pieces. Keep them straight and the rest is easy:

```
   ┌──────────────────────┐        ┌────────────────────────┐        ┌───────────────────┐
   │   GOOGLE SHEET        │        │   n8n  (the hands)      │        │  RENDER  (brain)   │
   │   = your database     │        │   = the orchestrator    │        │  = PitchPilot API  │
   │                       │        │                         │        │                    │
   │  one row per lead      │◀──read─│  every day at 9am:      │        │  stateless.        │
   │  status, step, dates   │        │   1. read the Sheet     │─POST──▶│  decides who to    │
   │  fill themselves        │        │   2. ask brain who to   │◀──────│  email + writes     │
   │                        │        │      email today        │  list  │  the emails         │
   │                        │─write─▶│   3. send via Gmail     │        │                    │
   │                        │        │   4. write status back  │        │  (holds NO data)   │
   └──────────────────────┘        └────────────────────────┘        └───────────────────┘
```

- **Google Sheet** is the single source of truth. You can open it any time and see
  exactly who's been contacted, what step they're on, and who replied.
- **Render** hosts the brain (this repo). It's *stateless* — it stores nothing, it
  just receives your rows and returns the emails to send. Perfect for Render's free tier.
- **n8n** ties them together and sends the Gmail. It's the only piece that touches
  Google — one login covers both the Sheet and Gmail.

You'll set this up **once**, in three parts below. Budget ~45 minutes.

---

## Before you start — try the copy locally (optional, 2 min)

You don't need any of the cloud stuff to read your email copy:

```bash
npm install
npm run preview            # website pitch
npm run preview -- app     # web-app pitch
npm run preview -- ai      # AI-feature pitch
```

Edit `src/templates.js` and re-run until it sounds like you. **That's the most
important tuning you'll do.** Then move on.

---

## Part 1 — The Google Sheet (your database)

1. Go to [sheets.new](https://sheets.new) to create a blank sheet. Name it
   **PitchPilot Leads**.
2. Rename the tab (bottom-left) from `Sheet1` to **`Leads`**.
3. Set up the columns. Easiest way: open `data/leads-template.csv` from this repo,
   and in Google Sheets do **File → Import → Upload → Replace current sheet**. That
   gives you the exact header row plus a few sample rows.

   The header row **must** be exactly these 13 columns (the machine matches by name):

   ```
   businessName | contactName | email | niche | city | website | hook | notes |
   status | sequenceStep | nextTouchAt | threadId | sentAt
   ```

4. **You fill the first 8 columns. Leave the last 5 blank** — the machine writes
   those (`status` becomes `contacted`/`replied`, dates fill in, etc). If you like,
   put `new` in the `status` column for rows you want sent; blank also counts as new.

5. **Add your real leads.** One business per row. The **`hook`** column is the whole
   game — one true sentence that could *only* be sent to that business:

   - ✅ `Blue Fig has 4.6 stars on Google but no website, so people can't find your menu.`
   - ✅ `Your booking page is just a phone number, so patients can't book online.`
   - ❌ `I love your business!` ← delete openers like this, they scream "bot".

   No hook? The email still goes out as an honest short cold note. But 10 leads with
   real hooks beat 50 without.

   **Where to find leads:** Google Maps (search a niche + city), Instagram business
   pages, JustDial, LinkedIn. Spend 20 minutes, fill 30–50 rows.

6. Copy your Sheet's **ID** — it's the long string in the URL between `/d/` and `/edit`:
   `docs.google.com/spreadsheets/d/`**`THIS_PART`**`/edit`. You'll paste it into n8n.

---

## Part 2 — Deploy the brain to Render (10 min)

### 2a. Put this repo on GitHub

```bash
cd pitchpilot
git init
git add .
git commit -m "PitchPilot: outreach brain"
```

Create an empty repo (e.g. **github.com/Obscur-Labs/pitchpilot**), then:

```bash
git remote add origin https://github.com/Obscur-Labs/pitchpilot.git
git branch -M main
git push -u origin main
```

> `.env` and `node_modules` are gitignored — your API key never gets committed.

### 2b. Create the Render service

> **Shortcut:** this repo ships a `render.yaml` blueprint. On Render, choose
> **New → Blueprint**, pick your repo, and it fills in everything below and
> auto-generates a secure `API_KEY` for you (copy it from the dashboard). Prefer
> to click through it once to understand it? Use the manual steps:

1. Go to [render.com](https://render.com), sign in with GitHub.
2. **New → Web Service** → pick your `pitchpilot` repo.
3. Fill in:
   - **Runtime:** Node
   - **Build Command:** `npm install`
   - **Start Command:** `npm start`
   - **Instance Type:** Free
4. Under **Environment**, add these variables (do NOT set `PORT` — Render sets it):

   | Key | Value |
   |---|---|
   | `API_KEY` | a long random string (run `node -e "console.log(crypto.randomUUID())"`) |
   | `DAILY_CAP` | `30` |

5. **Create Web Service.** Wait for the deploy to go green. You'll get a URL like
   `https://pitchpilot.onrender.com`.
6. Test it: open `https://YOUR-URL.onrender.com/api/health` in a browser →
   `{"ok":true,...}`. 🎉 The brain is live.

> **Free-tier note:** Render's free service *sleeps* after 15 min idle and takes
> ~50s to wake on the next request. That's fine — your daily 9am call just waits a
> few seconds. (The n8n call has a 60s timeout set for exactly this.)

---

## Part 3 — n8n (the hands)

Because the brain (Render) and the data (Google) are both online now, use
**n8n Cloud** — it's always-on and needs zero hosting from you.

1. Sign up at [n8n.io](https://n8n.io) → **Cloud** (free trial is plenty to start).
   (Prefer self-hosting? `npx n8n` works too — everything below is identical.)

### 3a. Connect Google once

In n8n, go to **Credentials → Add credential** and create **two**, both signing in
with the Gmail you send from (`yaksh.core@gmail.com`):

- **Gmail OAuth2** — lets n8n send mail.
- **Google Sheets OAuth2** — lets n8n read/write your Sheet.

Just click through the Google sign-in; n8n stores the token, never your password.

### 3b. Import the sender workflow

1. **Workflows → Import from File** → choose
   `n8n/outreach-sender.workflow.json` from this repo.
2. You'll see the pipeline:
   `Every day 9am → Get all leads → Bundle rows → Plan today → split → Loop →
   Send Email → Write status back → Wait`.

### 3c. Fill in your 4 details

Open these nodes and replace the placeholders:

| Node | What to set |
|---|---|
| **Get all leads** | Pick your **Google Sheets** credential; set **Document** = your Sheet (paste the Sheet ID), **Sheet** = `Leads` |
| **Plan today (backend)** | **URL** → `https://YOUR-URL.onrender.com/api/plan-today`; header **x-api-key** → your `API_KEY` |
| **Send Email (Gmail)** | Pick your **Gmail** credential |
| **Write status back** | Pick your **Google Sheets** credential; same **Document** + **Sheet** = `Leads` |

> In the two Sheets nodes, the column mapping is already set to **match on `email`**
> and write `status / sequenceStep / nextTouchAt / threadId / sentAt`. If n8n asks
> you to confirm the mapping, just make sure "Column to match on" is **email**.

### 3d. A SAFE first run (drafts, not real sends)

Prove it works with zero risk before emailing real people:

1. In **Send Email (Gmail)**, change **Operation** from *Send* → **Create Draft**.
2. Click **Write status back** and toggle it **Disabled** (top bar) so the Sheet
   doesn't change during the test.
3. Bottom bar → **Test workflow**.
4. Open Gmail → **Drafts**. Real, personalized drafts, in your voice. Read them.

Happy? Flip both back: Gmail Operation → **Send**, re-enable **Write status back**.

### 3e. Go live

1. Start small: in **Plan today (backend)**, the body has `"limit": 30` — change it
   to `5` for your first couple of days.
2. Top-right → toggle the workflow **Active**. It now runs itself at 9am daily.
3. Want to watch it now? Hit **Test workflow** once — check your Sent folder and the
   Sheet (statuses flip to `contacted`, dates fill in).

Raise `limit` back to `30` once a few clean days have gone out.

### 3f. Import the reply tracker

Import `n8n/reply-tracker.workflow.json`, set the same Gmail + Sheets credentials
and your Sheet ID, and **Activate** it. Now when someone replies, their row flips to
**`replied`** and follow-ups stop automatically — you'll never chase someone who
already answered.

---

## Your daily rhythm

- **You:** add fresh leads + good hooks to the Sheet whenever you have 20 minutes.
- **The machine:** at 9am sends today's batch (due follow-ups first, then best new
  leads), paced ~45s apart so it looks human, and writes everything back to the Sheet.
- **You:** reply to the people who reply. That's the part only you can do.

Your Sheet *is* your dashboard — sort by `status` to see who's active.

---

## Staying out of spam (protects your real Gmail)

- **Ramp up:** 5 → 10 → 20 → 30/day over ~2 weeks. `DAILY_CAP` enforces the ceiling.
- **Plain text, one link** — these templates already do this. No images, no tracking
  pixels, no five links.
- **Real hook + the "reply stop" line** in every email — keep it, it keeps you honest
  and clean.
- **Never buy lists.** Hand-pick from Maps/Instagram. Bounces at volume wreck your
  sending reputation for months.

---

## Tuning (all plain files — no logic to touch)

| Change… | Edit |
|---|---|
| Name, links, studio (Obscur Labs), booking URL | `config.js → sender` |
| How emails sound (greeting, sign-off, no exclamations) | `config.js → voice` |
| What you pitch + to whom | `config.js → offers` |
| Target niches + the pain each feels | `config.js → niches` |
| Follow-up timing | `config.js → cadence` |
| The actual words | `src/templates.js` |
| Offer selection + reliability scoring | `src/scoring.js` |

After editing, `git push` → Render redeploys automatically. Preview copy first with
`npm run preview`.

---

## API reference (what n8n calls)

All `/api/*` routes need header `x-api-key`.

| Method | Route | Purpose |
|---|---|---|
| GET | `/api/health` | is it up? (no key) |
| POST | `/api/plan-today` | body `{ rows:[...], limit? }` → today's emails + write-back values |
| POST | `/api/compose` | body = one lead `{...}` → a single `{subject, body}` (for testing) |

The backend is stateless: it never stores rows, it only reads the ones n8n sends and
returns what to do. Your data stays in your Sheet.

---

## Troubleshooting

| Symptom | Fix |
|---|---|
| `Plan today` node times out | Render free tier was asleep (~50s cold start). It retries fine; the node already has a 60s timeout. Hit it once to warm it. |
| `401 bad or missing x-api-key` | The key in the **Plan today** node ≠ the `API_KEY` env var on Render. Make them identical. |
| Response `count: 0` | Daily cap hit, or every lead is already `contacted`/`replied`. Add fresh `new` rows. |
| Sheet not updating after send | In **Write status back**, "Column to match on" must be **email**, and the Sheet must have an `email` header spelled exactly. |
| Gmail won't authorize | Re-create the Gmail credential; approve the "send email" scope. |
| Emails feel generic | Thin `hook` column. Better hooks = better replies. Also edit `src/templates.js`. |
| Reply tracker not flipping status | The reply's From address must match the lead's `email`. Auto-replies/aliases won't match — that's expected. |

---

## Why it's built this way

No database server, no queue, no local data files. For 30 emails a day, a Google
Sheet + a stateless Express service + n8n is exactly the right amount of machine —
and every piece is something you already know or can see. When you outgrow it
(hundreds/day, a team), the brain doesn't change; you'd swap the Sheet for Postgres
and point n8n at it. Until then, don't add what you won't use.

Built for freelance work under **Yaksh Bambhroliya · [Obscur Labs](https://github.com/Obscur-Labs)**.
```
