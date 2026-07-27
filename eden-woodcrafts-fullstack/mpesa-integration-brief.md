# Eden Woodcraft — M-Pesa (Daraja) Integration Brief

Give this file to Claude Code as your first task. Paste it in, or say
"read mpesa-integration-brief.md and implement it."

## Context

- Client: Samuel Njoroge, Eden Woodcrafts, Nairobi (Kasarani Carwash)
- Stack: Next.js API routes (or Express), TypeScript, Prisma, PostgreSQL
- Payment methods overall: M-Pesa (primary for Kenya), Stripe, PayPal, bank
  transfer, cash on delivery — this brief covers M-Pesa only
- Environment: Safaricom Daraja **Sandbox**, app created 12 Jul 2026

## Credentials — DO NOT HARDCODE

Consumer Key and Consumer Secret were shared in plaintext chat. Treat that as
a one-time leak: **rotate them in the Daraja portal before going anywhere
near production**, even though sandbox risk is low. Claude Code should:

- Read all four values from environment variables, never from source
- Add `.env` to `.gitignore` immediately (check it's not already tracked)
- Never print the secret or passkey back into logs, commit messages, or
  generated docs

Passkey and Short Code are listed as N/A — for **sandbox STK Push testing**,
Safaricom publishes a shared default test Shortcode (`174379`) and passkey on
the Daraja portal's "Lipa Na M-Pesa Online" sandbox page. Log into
https://developer.safaricom.co.ke, open the app, and copy the actual sandbox
passkey shown there — don't guess it. Short Code `174379` is the standard
sandbox test paybill; confirm it's still listed against this app.

### `.env` template

```
MPESA_ENV=sandbox
MPESA_CONSUMER_KEY=
MPESA_CONSUMER_SECRET=
MPESA_PASSKEY=
MPESA_SHORTCODE=174379
MPESA_CALLBACK_URL=https://<your-ngrok-or-deployed-domain>/api/payments/mpesa/callback
```

Fill the key/secret/passkey values locally — never in a file that gets
committed or pasted anywhere else.

## What to build

### 1. Auth helper
`lib/mpesa/auth.ts` — fetches an OAuth token from
`https://sandbox.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials`
using Basic auth (base64 of `key:secret`), caches it in memory until near
expiry (tokens last ~1 hour).

### 2. STK Push (Lipa Na M-Pesa Online)
`lib/mpesa/stkPush.ts` — builds the timestamp + password
(`base64(Shortcode + Passkey + Timestamp)`), POSTs to
`/mpesa/stkpush/v1/processrequest` with `BusinessShortCode`, `Amount`,
`PartyA` (customer phone, format `2547XXXXXXXX`), `PartyB` (shortcode),
`PhoneNumber`, `CallBackURL`, `AccountReference` (order ID), `TransactionDesc`.

API route: `POST /api/payments/mpesa/initiate`
- Input: `{ orderId, phone, amount }`
- Validate phone format and amount with Zod
- Create a `Payment` row with status `PENDING` before calling Daraja
- Return `CheckoutRequestID` to the client for polling/UX ("check your phone")

### 3. Callback endpoint
`POST /api/payments/mpesa/callback` — Safaricom calls this async. Must:
- Verify payload shape defensively (don't trust it blindly — log and 200 OK
  regardless, per Daraja's requirement, but only update state on valid data)
- On `ResultCode === 0`: extract `MpesaReceiptNumber`, `Amount`,
  `TransactionDate`, `PhoneNumber` from `CallbackMetadata`, mark the
  `Payment` row `COMPLETED`, and flip the linked `Order` to confirmed
- On non-zero: mark `Payment` `FAILED`, store the `ResultDesc`
- This route needs a **public HTTPS URL** — use ngrok in dev
  (`ngrok http 3000`), set that URL as `MPESA_CALLBACK_URL`

### 4. Order status query (optional but recommended)
`lib/mpesa/queryStatus.ts` using `/mpesa/stkpushquery/v1/query` — lets you
poll if the callback hasn't landed after N seconds, as a fallback.

### 5. Prisma model

```prisma
model Payment {
  id                String   @id @default(cuid())
  orderId           String
  order             Order    @relation(fields: [orderId], references: [id])
  method            PaymentMethod
  amount            Decimal
  status            PaymentStatus @default(PENDING)
  checkoutRequestId String?
  mpesaReceipt      String?
  phoneNumber       String?
  rawCallback       Json?
  createdAt         DateTime @default(now())
  updatedAt         DateTime @updatedAt
}

enum PaymentStatus {
  PENDING
  COMPLETED
  FAILED
}

enum PaymentMethod {
  MPESA
  STRIPE
  PAYPAL
  BANK_TRANSFER
  COD
}
```

### 6. Frontend
Checkout step: phone number input (default prefill `+254 702 543867` format
pattern, not the actual number — that's the client's own test number, not a
placeholder to hardcode), "Pay with M-Pesa" button → calls `/initiate` →
shows "Enter your M-Pesa PIN on your phone" state → polls order status every
3s for up to ~60s → success/failure screen.

## Acceptance checks before calling this done

- [ ] No secret, key, or passkey appears in any committed file
- [ ] `.env.example` exists with empty values, real `.env` gitignored
- [ ] STK push triggers a real prompt on a Safaricom sandbox test phone number
- [ ] Callback correctly updates Payment + Order status
- [ ] Failed/cancelled payments handled gracefully in the UI
- [ ] Basic rate limiting on `/initiate` (prevent spamming pushes)
