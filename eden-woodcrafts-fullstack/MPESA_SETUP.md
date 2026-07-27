# Getting M-Pesa STK Push fully working (including the callback)

## Fully automated: one command, zero manual ngrok steps

Everything is pre-filled in `backend/.env` now — your authtoken, your
static domain (`judgingly-specked-bagel.ngrok-free.dev`), and the
callback URL. Just run, from `backend/`:

```bash
npm run dev:tunnel
```

This automatically: configures ngrok's authtoken from `NGROK_AUTHTOKEN`,
starts a tunnel on your static domain, detects its public URL, sets
`MPESA_CALLBACK_URL`, and starts the server — in that order, in one
command. You never type an `ngrok` command yourself.

**One thing that genuinely cannot be automated from here, and why:**
the ngrok *agent itself* (the actual program) has to be installed on
*your* computer — I can run commands in my own sandboxed environment,
but that's a separate machine from yours; nothing I install there
reaches your laptop. So this one step is still on you, once:

```bash
npm install -g ngrok
```

(or the apt/brew method from the ngrok dashboard, if you prefer). After
that one install, `npm run dev:tunnel` handles everything else,
every time, forever — including the authtoken.

If `dev:tunnel` fails, the error message it prints will tell you exactly
which of these two things is missing.

## Manual walkthrough (if you want to understand what's happening, or dev:tunnel isn't working)

Two separate things have to be true for M-Pesa to work end to end:

1. **The STK prompt fires** — needs `MPESA_CONSUMER_KEY`, `MPESA_CONSUMER_SECRET`,
   `MPESA_PASSKEY`, `MPESA_SHORTCODE`. These are already filled in with
   working sandbox defaults in `backend/.env.example` except your Consumer
   Key/Secret, which you provide.
2. **Your app finds out payment succeeded** — needs `MPESA_CALLBACK_URL` to
   be a real, public, HTTPS URL that Safaricom's servers can reach. This
   step is the one only you can do, since it depends on your machine.

Without step 2, the prompt still appears on the test phone and still works
— but your backend never hears back, so the order stays stuck on
`PENDING_PAYMENT` forever. This walkthrough fixes that.

## Step by step

**1. Install ngrok** (a tunnel that gives your local server a public URL)

```bash
# macOS
brew install ngrok

# Windows / Linux — download from https://ngrok.com/download
# or via npm, works everywhere:
npm install -g ngrok
```

Sign up free at https://dashboard.ngrok.com/signup. Once logged in, go to
https://dashboard.ngrok.com/get-started/your-authtoken — it shows a token
that looks like a long string of letters and numbers, e.g.
`2abCDefGhijKLmnoPQRstuVWxyz_3aBcDeFgHiJkLmNoPqRs`.

Copy your actual token (not the example above) and run:

```bash
ngrok config add-authtoken 2abCDefGhijKLmnoPQRstuVWxyz_3aBcDeFgHiJkLmNoPqRs
```

Replace that whole string with the real token from your dashboard — paste
it directly after `add-authtoken` with nothing else on the line.

**2. Start your backend first** (it must be running before you tunnel it)

```bash
cd backend
npm run dev
# leave this running — it's on http://localhost:4000
```

**3. In a second terminal, tunnel port 4000**

```bash
ngrok http 4000
```

You'll see output like:

```
Forwarding    https://a1b2-41-90-64-12.ngrok-free.app -> http://localhost:4000
```

Copy that `https://...ngrok-free.app` URL.

**4. Put it in `backend/.env`**

```
MPESA_CALLBACK_URL=https://a1b2-41-90-64-12.ngrok-free.app/api/payments/mpesa/callback
```

(Keep the `/api/payments/mpesa/callback` path — that's the real route.)

**5. Restart the backend** so it picks up the new `.env` value

```bash
# Ctrl+C the backend, then:
npm run dev
```

You should see `✔ M-Pesa env vars look configured.` in the startup log
instead of a warning.

**6. Test it**

- Go through checkout on the frontend, choose M-Pesa
- Use the test phone `0708374149` (any 4-digit PIN) — this is Safaricom's
  fixed sandbox test number; it won't ring your own personal phone (see
  the main README for why)
- Watch the backend terminal — within ~10-30 seconds you should see a
  `POST /api/payments/mpesa/callback` line, and the order status should
  flip to `CONFIRMED`

## Notes

- **Free ngrok URLs change every time you restart it.** You'll need to
  update `MPESA_CALLBACK_URL` and restart the backend each session unless
  you pay for a static ngrok domain, or deploy the backend somewhere with
  a permanent URL (Railway, Render, a VPS, etc.) for anything beyond local
  testing.
- If the STK prompt never appears at all (not even a "check your phone"
  message), that's a Consumer Key/Secret or Passkey problem, not the
  callback — re-check step 1, not this doc.
