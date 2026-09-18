# Finding real leads (Europe · food) — the 15-minute method

The engine is only as good as the rows you feed it. Scraped lists are mostly the
*wrong* businesses (the ones that rank in Google already have good sites). The best
targets — a bakery with **no website** or a **menu-only site with no ordering** — you
find with your eyes on Google Maps in about 15 minutes. Here's the exact process.

> `data/leads-europe-food.csv` already has **3 verified real leads** (Gebroeders
> Niemeijer, The Bakery Shop Amsterdam, Blossom Artisan) plus 2 to hook yourself.
> Import that into your Sheet to start, then top it up with the method below.

---

## First: which countries are safe to cold-email (this matters)

EU B2B cold email is legal in some countries and risky in others. Stick to the green
list to protect your Gmail and stay compliant. (The emails no longer include an
opt-out line; if someone replies asking to stop, the reply tracker ends their sequence.
In stricter 🟡 markets you can add a light opt-out back in `src/templates.js`.)

| | Countries | Rule of thumb |
|---|---|---|
| 🟢 **Go** | **Netherlands, Ireland**, UK | B2B email to a business address is allowed **with an opt-out**. No prior consent needed. |
| 🟡 **Careful** | France, Spain, Italy, Portugal, Belgium | Allowed if the message is **relevant to their profession** (it is — you're offering them a business tool) + opt-out. Keep volume low. |
| 🔴 **Avoid** | **Germany, Austria** | Cold B2B email generally needs **prior consent** (UWG). Don't cold-email these until you have a warm intro. |

Rules of thumb, not legal advice. When in doubt, start with 🟢 Netherlands + Ireland —
which is why the starter leads are there.

---

## The column cheat-sheet (what to type in each)

You fill the first 8. Leave the rest blank — the machine writes them.

| Column | What to put | Example |
|---|---|---|
| `businessName` | the shop's name | `Gebroeders Niemeijer` |
| `contactName` | owner's first name **only if you see it** (else blank) | `Marco` |
| `email` | their real, public contact email — **never guess one** | `info@…nl` |
| `niche` | one of: `bakery patisserie restaurant bistro pizzeria cafe deli butcher greengrocer cheesemonger chocolatier catering winebar foodshop` | `bakery` |
| `city` | their city | `Amsterdam` |
| `website` | their site URL, **or leave blank if they have none** | blank |
| `hook` | one true sentence — the real reason (see formula below) | *(below)* |
| `notes` | optional steer: `ai`, `redesign`, or leave blank | blank |
| `status` | `new` (or leave blank — same thing) | `new` |

**Never invent an email.** A guessed `info@` that bounces hurts your sending
reputation for months. Only use an address you actually see on their site, Facebook
"About", or Instagram bio.

---

## The Google Maps method (repeat per niche × city)

1. Open Google Maps. Search a **query from the pack below**.
2. Click each result and look at the panel. **Good targets:**
   - **No "Website" button** → they have no site → `website` column blank, huge opportunity.
   - Has a site, but it's a Facebook/Instagram/Linktree page → still a real gap.
   - Has a real site but **no online ordering / no booking** → great `web_app` target.
   - Skip anyone with a slick site + an "Order online" button — they're already served.
3. Find the email: their **website's contact page**, or Facebook page → **About**, or
   the link in their **Instagram bio**. Copy it exactly.
4. Write a 10-second hook (below) and drop the row in your Sheet.

Aim for 30–50 rows in one sitting. The machine paces them out for you.

### Query pack (copy-paste into Google Maps)

```
bakery Amsterdam
artisan bakery Rotterdam
patisserie Dublin
independent restaurant Amsterdam
family restaurant Cork
deli Amsterdam
cheese shop Rotterdam
butcher Dublin
pizzeria Amsterdam
cafe Galway
chocolatier Amsterdam
catering Dublin
```

Swap the cities for others on the 🟢/🟡 list (Utrecht, The Hague, Eindhoven, Limerick,
Waterford, Lisbon, Porto, Lyon, Valencia…).

---

## Writing a hook in 10 seconds (the whole game)

The hook is one **true** sentence that could only be sent to *them*. Formula:

> **[What you observed] + [the cost of it].**

- No website → *"You've got 900+ Google reviews but no website, so new customers can't find your opening hours or menu."*
- Menu-only site → *"Your site shows the menu, but there's no way to order or pre-order online."*
- Instagram-only shop → *"You take cake orders through Instagram DMs instead of a proper online shop."*
- Delivery-app dependent → *"You're paying 30% to a delivery app on every order instead of taking them on your own site."*

**Don't guess.** If you can't see a real gap in 10 seconds, leave `hook` blank — the
email still sends as an honest short cold note (it won't claim anything false about them).

---

## Faster, at volume (optional)

Your Claude toolset includes **Apollo.io** and **Clay** connectors — proper enrichment
tools that return verified business emails in bulk. They need authorizing first
(connect them in your Claude connector settings). Once connected, they're the right way
to fill the Sheet with verified contacts far faster than by hand. Until then, the Maps
method above is free and accurate.

---

## Ramp plan (don't skip)

New Gmail sending pattern? Ease in so you look human, not like a blast:

| Week | Emails/day (`limit` in the n8n node) |
|---|---|
| 1 | 5 |
| 2 | 10 |
| 3 | 20 |
| 4+ | 30 (the `DAILY_CAP` ceiling) |
