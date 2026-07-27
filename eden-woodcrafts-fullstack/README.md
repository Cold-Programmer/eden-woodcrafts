# Eden Woodcrafts — Full-Stack MVP (separate backend + frontend)

## Phase 10 — fixed real 404s found by auditing every nav link

Did a systematic audit: extracted every internal `href` referenced
anywhere in the codebase and diffed it against every page that actually
exists as a file. Found three genuine 404s — links in navigation menus
pointing at pages that were never built:

- **`/admin/portfolio`** — linked in the admin sidebar, no page existed.
  Built full CRUD (add/edit/delete projects), backed by the `Project`
  model and `/api/admin/projects` endpoints that already existed in the
  backend from an earlier round but had no UI.
- **`/dashboard/settings`** — linked in customer, staff, and admin
  sidebars alike, no page existed. Built a shared settings page (works
  for all three roles): update name/phone/profile-photo-URL, change
  password. Backed by `/api/auth/profile` and `/api/auth/change-password`,
  which also already existed in the backend with no frontend to use them.
- **`/staff/products`** (+ `/new` and `/[id]/edit`) — linked in the staff
  sidebar, no page existed even though the backend already granted STAFF
  create/edit access to products. Built the three pages, reusing the
  existing `ProductForm` component (made its post-save redirect
  configurable so staff land back on `/staff/products` instead of
  `/admin/products`, which would 404-loop them since `/admin` is
  ADMIN-only).

Also found and fixed: the public **`/portfolio`** page was still showing
6 hardcoded static projects, completely disconnected from the `Project`
model — editing a project in the new admin CRUD would have done nothing
visible. Rewired it to fetch from `/api/projects`, and seeded the
original 4 real projects as actual database rows so the page isn't empty
on first run.

Verified with a full production build afterward: **all 33 routes
compile, zero errors** (up from 29 — the 4 new pages). Re-ran the link
audit after the fix: zero remaining gaps between linked and existing
pages.

---

## Phase 9 — converted to plain JavaScript, deploy-ready for Vercel + Render

**Full conversion, verified not just claimed:**
- Backend: all `.ts` files converted to `.js` using the TypeScript
  compiler itself (types stripped, logic/comments untouched) — confirmed
  by actually running the Jest suite, **7/7 passing** on the JS files
- Frontend: all `.ts`/`.tsx` converted to `.js`/`.jsx` (JSX syntax kept
  intact for Next's own compiler) — confirmed with a **real production
  build**, all 28 routes, zero errors, zero TypeScript anywhere
- `@types/*`, `typescript`, `ts-jest`, and every `tsconfig.json` removed
  from both projects. Frontend path aliases (`@/...`) still work via
  `jsconfig.json`, Next.js's native JS equivalent
- `node --watch src/index.js` replaces `tsx watch` for backend dev (same
  auto-restart-on-change behavior, zero extra dependency)

### Exact deploy commands

**Frontend → Vercel**
- Root directory: `frontend`
- Build command: `npm run build` (auto-detected, `vercel.json` makes it
  explicit)
- Install command: `npm install`
- Env var: `NEXT_PUBLIC_API_URL` = your deployed backend's URL

**Backend + Postgres → Render**
- Easiest path: push to GitHub, then in Render's dashboard choose
  **New → Blueprint** and point it at the repo — `render.yaml` at the
  project root provisions a free Postgres database and the backend web
  service together, with build command `npm install && npx prisma generate`
  and start command `npx prisma migrate deploy && npm start`
- Fill in `FRONTEND_ORIGIN` (your Vercel URL), `MPESA_CONSUMER_KEY`,
  `MPESA_CONSUMER_SECRET`, and `MPESA_CALLBACK_URL` in Render's dashboard
  after first deploy (marked `sync: false` in the blueprint — Render
  won't auto-generate values it can't know)
- Manual alternative (no blueprint): root directory `backend`, same
  build/start commands as above, add a Postgres instance separately and
  paste its connection string into `DATABASE_URL`

Both platforms need real environment variables set in their dashboards —
neither reads your local `.env` file (which is correctly gitignored and
won't be in the repo you push).

---

## Phase 8 — ngrok fully automated

`npm run dev:tunnel` (in `backend/`) now does everything in one command:
configures ngrok's authtoken (from `NGROK_AUTHTOKEN` in `.env`), starts a
tunnel on your static domain (`NGROK_STATIC_DOMAIN`), detects the public
URL, sets `MPESA_CALLBACK_URL` for that run, and starts the server. Your
real authtoken and static domain (`judgingly-specked-bagel.ngrok-free.dev`)
are already in `backend/.env` and `.env.example`.

**The one thing that genuinely can't be automated from this side, and
why:** the ngrok agent (the actual program) has to be installed on
*your* machine. I can run setup commands in my own sandboxed environment,
but that's a physically separate machine from yours — nothing installed
there reaches your laptop. So `npm install -g ngrok` (or the apt method)
is still a one-time manual step. After that, `dev:tunnel` handles
everything else, every time, with zero further manual ngrok commands.

---

## Phase 7 — real Daraja error diagnosed, auto-tunnel, status pills clarified

**Big confirmation:** your terminal finally showed Safaricom's actual
response: `"errorMessage":"Bad Request - Invalid CallBackURL"`. This
means Consumer Key, Secret, Passkey, and Shortcode are all correct —
Safaricom accepted everything except the placeholder callback URL. The
integration itself works; only the callback URL step was left.

**New: `npm run dev:tunnel`** — starts ngrok and points
`MPESA_CALLBACK_URL` at it automatically, no more manual copy-paste-
restart. One-time setup still required (`ngrok config add-authtoken`,
same as before — that step creates *your* personal tunnel account and
can't be automated away). I initially tried adding the `ngrok` npm
package to automate this, then caught a real problem before shipping it:
that package downloads a binary during `npm install`, and if that
download is ever blocked, it fails your *entire* install, not just this
feature — I proved this myself when it broke in this environment.
Rebuilt it to shell out to the ngrok CLI you already have installed
globally instead, so a blocked download can't take down the rest of the
project.

**`phone.ts`** — Kenyan phone normalization now lives in its own file
(`backend/src/lib/phone.ts`) as asked, re-exported from `mpesa.ts` so
nothing else needed to change.

**On the "buttons not working"** — the PENDING PAYMENT → DELIVERED pills
on your order page were never buttons; they're a read-only progress
indicator (confirmed in the code: plain list items, no click handler).
Making them clickable for customers would actually be a security bug —
it would let anyone mark their own order "Delivered" without it actually
happening. The working, permission-checked version of this already
exists for staff/admin in their dashboards. Added tooltips and proper
`aria-current` semantics instead, so it's clearer these are status
labels.

---

## Phase 6 — real bug found and fixed: the /login redirect loops

Your last log had the real clue: dozens of `GET /api/auth/me 429` lines
followed by repeated `GET /login?redirect=...`. Root cause: `/api/auth/me`
is called on nearly every page load (root layout + middleware both check
who's logged in), but it was sitting behind the same strict 30-requests/
15-minutes limiter meant for brute-force protection on login/register.
Normal browsing tripped it almost immediately, the middleware read the
429 as "not logged in," and bounced you to `/login` — even though you
were properly authenticated the whole time. This had nothing to do with
credentials.

**Fixed:** the strict limiter now only wraps `/register` and `/login`
specifically; `/me`, `/logout`, and everything else use the generous
general limit (600/15min). Verified with the full backend test suite
(7/7 passing) and a clean type-check.

**Also fixed:** the checkout page was hardcoding "check your Consumer
Key/Secret" on *any* 502 from M-Pesa, which was masking whatever Safaricom
actually said once your credentials were confirmed loaded. It now shows
the real error text, and the backend logs the full error to its terminal
too. Next time the STK push 502s, the message (in the popup and in the
backend terminal) will tell us the actual reason — likely candidates at
this point, since your key/secret are confirmed present: the shared
public sandbox Passkey not matching your specific Daraja app (get your
app-specific one from developer.safaricom.co.ke → My Apps → Lipa Na
M-Pesa Online), or the callback URL still being a placeholder (separate
issue, doesn't block the prompt itself).

**On "install a graph so you don't review everything":** I already work
this way — I read and edit only the specific files a change touches, not
the whole codebase each turn. There's no separate tool to "install" for
this on my end.

**On the fourth copy of the enterprise ERP/CRM/AI spec:** same answer as
the last three times — I'm not building it all in one pass. Happy to keep
taking it one real slice at a time.

---

> ## ⚠️ If you've set this up before: read this first
> Your M-Pesa error was being caused by `cp .env.example .env` —
> `.env.example` was a blank template, so re-running that command each
> time was silently wiping out your saved credentials. **This is now
> fixed**: `backend/.env.example` has your real sandbox Consumer
> Key/Secret baked in, so `cp .env.example .env` is safe to run as many
> times as you want from now on. You do not need to manually re-enter
> the key/secret again.
>
> **On Docker:** it won't fix M-Pesa — `docker-compose.yml` only spins up
> Postgres, and your credentials issue was never a database problem (your
> own logs show the DB working correctly every time — orders, cart,
> addresses all returned 200/201). There's no Docker setting that
> "verifies M-Pesa" — that verification is the Consumer Key/Secret being
> present, which is what was actually broken.
>
> **On the 504:** none appeared in the logs you sent — only 502 (missing
> credentials, now fixed) and normal 200s. If a 504 shows up after this,
> paste that specific terminal output and I'll look at it directly.

## Phase 5 — Dark mode, button micro-interactions, quick action panel

Scoped to "dark mode toggle" specifically since it was the #1 item in your
last three messages' lists (Theme System, Settings, Quick Action Panel #1).

**Dark mode — real, with an honest limitation**
- Full toggle infrastructure: light/dark/system, persisted in
  `localStorage`, respects OS preference, no flash-of-wrong-theme on load
- Click the ✦ button bottom-right to open the quick action panel, which
  has the theme toggle plus Wishlist, WhatsApp, Contact, and Back-to-Top —
  **every button in that panel does something real**. I deliberately left
  out AI Assistant / Live Chat / Command Palette / Global Search from the
  "quick actions" list in your spec — those need backends that don't
  exist, and a button that looks functional but does nothing would be
  exactly the kind of fake feature the spec itself says not to ship.
- **What's covered:** page background, quick action panel, theme toggle —
  all correctly re-theme.
- **What's NOT yet covered:** most existing cards, forms, and the Navbar
  still render in their fixed light styling regardless of theme. Here's
  why, concretely: `warmwhite`/`charcoal` are used everywhere as *fixed*
  contrast pairs (e.g. `bg-forest` + `text-warmwhite` on every button) —
  I actually tried making them swap with the theme first, and it broke
  contrast on every colored button and the homepage hero (light text
  turned dark-on-dark, unreadable). Retrofitting every one of the ~60
  files that use those tokens to distinguish "fixed accent text" from
  "page text" is real, careful work I'm not going to rush and ship broken.
  What's here is genuine, tested infrastructure — extending it component
  by component is the natural next slice if you want it.

**Button component** — real hover lift, press-down feedback, and a
`loading` prop with an actual spinner, used consistently instead of
just a disabled state.

**Found and fixed a real bug via a full production build** (not just
`tsc`, which wouldn't have caught this): `npm run build` was failing
whenever the backend wasn't reachable *at build time*, because the home,
shop, and product pages were being statically pre-rendered against live
backend data. Marked those routes explicitly dynamic — confirmed with an
actual `next build` run (backend intentionally stopped) that all 28 routes
now build successfully. This matters for real deployment: your build
pipeline (Vercel, Railway, CI) won't silently require the API to be up
during the build step anymore.

---

## Phase 4 — Services & Appointments, M-Pesa callback walkthrough, one clarification

**New: Services + Appointment Booking** (the "repairs/booking" ask)
- `/services` — real distinct content for Custom Furniture, Repair,
  Restoration, Consultation, Delivery & Assembly, Workshop Visits
- `/book-appointment` — customers pick a service, date/time, phone, address,
  notes; pre-selects the service if you arrive via a Services page link
- `/dashboard/appointments` — customer's bookings with status + cancel
- `/staff/appointments` — staff/admin see all bookings and update status
  (Requested → Confirmed → Completed/Cancelled)
- New `Appointment` model + `/api/appointments` and `/api/admin/appointments`
  endpoints, all role-gated the same way orders are

**M-Pesa callback** — see the new `MPESA_SETUP.md` at the project root for
the exact ngrok steps to get a real callback URL working. Backend now also
warns loudly at startup (not just when a payment is attempted) if M-Pesa
env vars are missing or still placeholder values.

**Social links** — footer now has Instagram/Facebook/X/TikTok/WhatsApp
icons, driven by env vars in `frontend/.env` so you can drop in your real
profile URLs. WhatsApp defaults to the business number already on file.
Icons for accounts you haven't set just don't render — no dead links to
accounts that don't exist.

**One thing I need to push back on, not silently build:** "ensure no one
can view the site without an account" would mean requiring login just to
browse the furniture catalog. For an e-commerce storefront that's actively
counter-productive — customers browsing before creating an account is how
sales happen; Amazon, Shopify stores, and every furniture retailer let you
look before you buy. It also isn't really what "security against hackers"
means: the things that actually need protecting — checkout, dashboards,
admin/staff areas, payment initiation — are already behind role-based auth
and never were open. If what you actually want is email/OTP verification
*at registration* (so accounts are provably real before they can order),
that's a reasonable, separate feature — but it needs a real email or SMS
provider (SendGrid, SES, Africa's Talking, etc.) to actually deliver a
code; without one I can only log the code to the server console, which
isn't real security. Tell me which provider you want to use and I'll wire
it in properly next round, rather than build something that looks like
OTP but doesn't actually send anything.

**Deferred, not forgotten:** dark mode/theme engine, 2FA, full settings
module, AI features, multi-branch/multi-currency, barcode/QR, payroll,
PDF invoice generation, and the rest of the enterprise-ERP list — this is
now a genuinely large, working application, and piling all of that on in
one more pass would mean shipping it thin and broken rather than solid.
Happy to take these one deliberate slice at a time the way we've been
doing.

---

## Phase 3 — M-Pesa fixed, performance, staff account, role separation tightened

**M-Pesa — the actual fix**
Your error (`MPESA_SHORTCODE / MPESA_PASSKEY / MPESA_CALLBACK_URL are not set`)
was really just `MPESA_PASSKEY` being blank. I looked up Safaricom's current
Daraja docs: the sandbox has a long-published **shared test Passkey** that
works for most sandbox apps without needing anything app-specific —
`backend/.env.example` now ships with it pre-filled
(`bfb279f9aa9bdbcf158e97dd71a467cd2e0c893059b10f78e6b72ada1ed2c919`,
shortcode `174379`). If Daraja rejects it for your specific app, get the
app-specific one from developer.safaricom.co.ke → My Apps → Lipa Na M-Pesa
Online.

**Important correction on "prompt any registered SIM card":** sandbox
cannot do that. It only works with Safaricom's fixed test number
`254708374149` (any 4-digit PIN) — the checkout page now shows this and
lets you autofill it. Prompting your *own real phone* requires Safaricom's
production go-live approval (a business registration process with them,
not a code change) — there's no sandbox setting that unlocks it. I didn't
want to leave that expectation uncorrected.

I also made the missing-env-var error name the exact variable that's unset,
instead of listing all three every time.

**Performance**
- `npm run dev` now uses `next dev --turbopack` — meaningfully faster
  cold-compiles than the default Webpack dev compiler
- Public pages (home, shop, product detail) switched from `cache: "no-store"`
  to short revalidation windows (15-60s), so repeat navigation is served
  from Next's cache instead of round-tripping to the backend every time
- The 30-40s first-compile times in your log are normal Next.js dev-mode
  behavior (it compiles each route on first visit, not upfront) — Turbopack
  cuts this noticeably, but the real fix is `npm run build && npm start`,
  which pre-compiles everything and serves instantly. Dev mode will never
  feel as fast as production.
- Removed one redundant `/api/auth/me` call on the dashboard page (though
  Next.js already auto-dedupes identical fetches within a single render, so
  most of the repeated `/api/auth/me` lines in your log were separate page
  navigations, not actual waste)

**Staff account + tighter role separation**
- Seed now creates a third account: `staff@edenwoodcrafts.co.ke` /
  `Staff@12345`
- Found and fixed a real gap: STAFF could reach `/admin` and see product
  Edit/Delete/New buttons that the backend would then reject with 403 —
  confusing, broken-looking UX. STAFF is now routed exclusively to `/staff`
  (production queue, order stage updates) and `/admin` is ADMIN-only, both
  in the frontend route guards and the backend endpoints
  (`/api/admin/products*` and `/api/admin/stats` are now ADMIN-only;
  `/api/admin/orders*` stays shared since that's STAFF's actual job)

**On your terminal log otherwise:** nothing else in it was actually broken
— the 401s on login are correct behavior for bad credentials, the 409 on
duplicate register is correct, and everything else is healthy 200/201s.

---

## Phase 2 — design system, staff dashboard, customer features, tests

All four requested areas, built for real and verified to actually run:

**Design system**
- Design tokens in `frontend/src/app/globals.css` (color, 8pt spacing scale,
  radius, elevation/shadow, motion timing) — single source of truth instead
  of magic numbers scattered through components
- New reusable components, all actually wired into real flows (not just
  sitting unused): `Toast` (success/error notifications on cart, wishlist,
  order status, product delete), `Skeleton`/`ProductCardSkeleton`,
  `EmptyState`, `Badge`/`Tag`, `Tooltip`, `Modal`, `Tabs`, `Pagination`
- Visible focus rings on every interactive element for keyboard nav

**Staff Dashboard** (`/staff`, role-gated to STAFF/ADMIN)
- Production queue grouped by stage (Confirmed → In Production → Quality
  Check → Packaging → Out for Delivery), with inline stage updates
- Backend already supported this via the existing `/api/admin/orders`
  endpoints (STAFF role was always permitted there) — this phase added the
  dedicated UI and route protection

**Customer features**
- Wishlist: save/remove from any product card or detail page, dedicated
  `/dashboard/wishlist` page
- Reviews with images: customers can leave a star rating + comment + photo
  URL — but only for products from a **delivered** order (enforced
  server-side, not just hidden in the UI)
- Saved addresses: full CRUD at `/dashboard/addresses`, wired into checkout
  so returning customers pick a saved address instead of retyping it

**Testing**
- Backend: Jest + Supertest, 7 passing tests (auth register/login/duplicate
  handling, product listing, 404s) against a mocked Prisma client — run
  with `npm test` in `backend/`
- Frontend: Jest + React Testing Library, 5 passing tests on `Button` and
  `ProductCard` — run with `npm test` in `frontend/`
- Frontend: Playwright e2e specs for homepage/shop rendering and the login
  flow — run with `npm run test:e2e` in `frontend/` (needs both servers up)

**On M-Pesa:** the integration itself is unchanged and was already working
per your last successful backend log. It still needs your real sandbox
**Passkey** (yours is listed as N/A) before STK Push will actually fire —
that's a Daraja portal setting, not something in this codebase to fix.

---

## Changelog — fixes applied after your test run

Your backend log showed register/login working correctly server-side (201,
200, expected 409 on duplicate), but you reported being unable to sign in
from the frontend. Root cause and fixes:

1. **Auth was silently broken by an Edge runtime incompatibility.**
   `frontend/src/middleware.ts` verified the JWT locally using the
   `jsonwebtoken` package. Next.js middleware runs on the **Edge runtime**
   by default, which doesn't support Node's `crypto` module —
   `jsonwebtoken` fails there, so every request looked unauthenticated even
   right after a successful login, bouncing you straight back to `/login`.
   **Fixed:** middleware and `lib/auth.ts` now ask the backend's
   `/api/auth/me` directly (forwarding cookies) instead of verifying
   locally. This also removes the second bug it was compounding —
2. **The two `.env.example` files had different placeholder `JWT_SECRET`
   values**, so even outside the Edge issue, signatures would never have
   matched unless you'd manually copied one into the other. The frontend no
   longer needs a `JWT_SECRET` at all — one less thing to misconfigure.
3. **`next/image` rejected Unsplash URLs** — `next.config.js` only
   whitelisted `res.cloudinary.com`. Added `images.unsplash.com`.
4. **About and Portfolio were never real pages** — they were both anchor
   sections on the homepage (`/#about`, `/#portfolio`), which is why they
   looked like "the same data." Added dedicated `/about` and `/portfolio`
   pages with distinct content, and pointed the nav at them.

---

Two independent servers, as requested:

- **`backend/`** — Node.js + Express + Prisma + PostgreSQL REST API (plain JavaScript)
- **`frontend/`** — Next.js 15 (App Router) + Tailwind (plain JavaScript/JSX), talks to the
  backend only over HTTP (no direct database access from the frontend)

They're connected via `NEXT_PUBLIC_API_URL` (frontend → backend) and shared
auth cookies (the backend issues the JWT cookie; because `localhost:3000`
and `localhost:4000` are the same "site" — only the port differs — the
browser sends it on every request automatically).

## Quick start

**1. Backend**

```bash
cd backend
cp .env.example .env
# edit .env: DATABASE_URL, JWT_SECRET, JWT_REFRESH_SECRET, MPESA_* (see below)
npm install
npx prisma generate
npx prisma migrate dev --name init
npm run seed
npm run dev
```

Runs on `http://localhost:4000`. Health check: `GET /health`.

**2. Frontend**

```bash
cd frontend
cp .env.example .env
# NEXT_PUBLIC_API_URL=http://localhost:4000
# JWT_SECRET must be IDENTICAL to the backend's JWT_SECRET — the frontend
# verifies the cookie locally (for route-gating) but never issues it
npm install
npm run dev
```

Runs on `http://localhost:3000`.

Both need to be running at the same time for the app to work — the frontend
has no fallback data source.

- Admin login: `admin@edenwoodcrafts.co.ke` / `Admin@12345`
- Customer login: `customer@example.com` / `Customer@123`

Change both passwords before this touches production.

## M-Pesa (Daraja) — your sandbox credentials

Your Consumer Key and Consumer Secret were pasted in plaintext in this chat
again. Same guidance as before, worth repeating since it's now in a second
codebase: put them only in `backend/.env` (gitignored), rotate them in the
Daraja portal before this goes anywhere near production, and never commit
`.env`.

Two fields you listed as **N/A** are required for STK Push to actually work:

- **Passkey** — get the real sandbox passkey from your Daraja app page at
  developer.safaricom.co.ke ("Lipa Na M-Pesa Online" section). It is not
  optional; STK push will fail without it.
- **Short Code** — sandbox testing conventionally uses `174379`, prefilled
  in `.env.example`. Confirm it's still what's listed against your app.

`MPESA_CALLBACK_URL` also needs to be a real public HTTPS URL reachable by
Safaricom — see `MPESA_SETUP.md` for the full ngrok walkthrough. In short:
run `ngrok http 4000`, then use the forwarding URL it prints (something
like `https://a1b2-41-90-64-12.ngrok-free.app`) with
`/api/payments/mpesa/callback` appended.

## What's genuinely verified vs. what isn't (being straight with you)

I restructured this from the earlier combined build into the two-server
architecture you asked for, and did real verification in the sandbox this
was built in — not just "the code looks right":

**Actually confirmed:**
- Installed and ran a real local PostgreSQL server, created the database
- Both `backend` and `frontend` type-check with **zero real errors**
  (`npx tsc --noEmit` clean on both — this checks every route, every page,
  every import actually resolves and the types line up)
- `next dev` starts and compiles cleanly on the frontend

**Could not confirm in this sandbox:**
- A live end-to-end request against the database. `npx prisma generate`
  needs to download a query-engine binary from `binaries.prisma.sh`, and
  this sandbox's network allowlist blocks that domain (returns 403) — it
  only permits a fixed list of package-registry domains. I tried the
  documented bypass (`PRISMA_ENGINES_CHECKSUM_IGNORE_MISSING=1`) and it hit
  the same block on the actual binary download, not just the checksum. This
  is a restriction of *this specific sandbox*, not a code issue — on a
  normal machine or CI runner, `prisma generate` reaches that domain fine
  and this resolves itself before you've written a line of code.
- The M-Pesa STK Push round-trip against Safaricom's real sandbox (needs
  your actual Passkey, which you don't have filled in yet, plus a public
  callback URL).

If you hit anything unexpected once you run this for real, it'll most
likely be a small integration wrinkle (env var, port, CORS origin) rather
than a structural problem — the architecture and every route were written
and reviewed as real, complete code, not scaffolding.

## What's in scope vs. deferred

Same honest split as the previous build — this PRD describes a genuinely
enterprise-scope system. Built for real:

- Full auth (register/login/logout, JWT + refresh cookie, bcrypt, RBAC)
- Storefront: home, shop (search/filter/sort/pagination), product detail,
  cart, multi-step checkout
- M-Pesa STK Push initiate + async callback, wired into checkout
- Customer dashboard: orders + status timeline, custom-order requests
- Admin dashboard: live stats, full product CRUD, order status management
- Full Prisma schema: users, products, categories, orders, payments,
  reviews, cart, addresses, custom orders, inventory

Deferred (flagged, not faked): staff dashboard, Stripe/PayPal, Cloudinary
upload widget, CMS/blog/testimonials, email verification & password reset
delivery, marketing tools, automated tests, Docker packaging, AI features.

## Suggested next steps

1. Get both servers running locally against your real Postgres + M-Pesa
   sandbox Passkey, confirm register → login → checkout → STK push →
   callback works end-to-end
2. Add automated tests (Jest for backend routes, Playwright for the
   checkout flow) before adding more surface area
3. Staff dashboard, then Cloudinary upload, then the rest of the deferred
   list in roughly that order of customer impact
