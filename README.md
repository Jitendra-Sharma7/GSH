# Global Scholarship Hub

A scholarship discovery platform. Students browse, filter, compare, and track
scholarships; staff manage every listing through an admin panel backed by
PostgreSQL.

The rule that shapes every decision here: **never present a fact the data does
not support.** Funding amounts, deadlines, eligibility, and verification status
come from stored records. Anything a provider has not stated is shown as "Not
stated", not as a confident "No". The headline figures on the homepage are
counted from the database, not typed into a component.

## Stack

| | |
|---|---|
| Framework | Next.js 16.3.5 (App Router, React Server Components) |
| UI | React 19.2.8, TypeScript, Tailwind CSS 3.4.17, lucide-react |
| Data | PostgreSQL 17, Prisma 6.19.3 |
| Client state | Zustand (saved scholarships, comparison, tracker, profile) |
| Validation | Zod, on the server, on every write path |
| Auth | bcrypt hashing, HMAC-SHA256 session tokens, HTTP-only cookies |

## Setup

Requires Node.js 20+ and a PostgreSQL database.

```bash
npm install
cp .env.example .env      # then fill in DATABASE_URL and NEXTAUTH_SECRET
npx prisma db push --skip-generate --accept-data-loss
npx prisma generate
npm run db:seed           # idempotent; prints the admin it created
npm run dev
```

Open `http://localhost:3000`. The staff panel is at `/admin/login`.

`prisma migrate dev` does not work in this environment: the database role
cannot create a shadow database (`P3014`). `prisma db push` is the supported
path. On Windows, stop the running server before `prisma generate` — the query
engine DLL stays locked while it is up.

## Commands

```bash
npm run dev         # development server
npm run build       # production build
npm run start       # serve the production build
npm run typecheck   # tsc --noEmit
npm run lint
npm run db:push     # apply schema.prisma
npm run db:seed     # seed data and the first admin
npm run db:studio   # browse the database
```

## Environment

See `.env.example` for the full list. The ones that matter most:

- `DATABASE_URL` — PostgreSQL connection string.
- `NEXTAUTH_SECRET` — long random string used to sign session cookies.
- `NEXT_PUBLIC_SITE_URL` — absolute origin for canonical URLs and social cards.
- `ADMIN_EMAIL` / `ADMIN_PASSWORD` — read only by the seed, to create the first
  administrator. Create further admins through `/admin/users` instead.
- `PUBLIC_API_KEY` — shared secret for the read-only JSON API under
  `/api/public/*`. See [JSON API](#json-api).
- `RATE_LIMIT_MAX_REQUESTS` / `RATE_LIMIT_WINDOW_MS` — default throttle. Sign-in
  additionally allows 8 attempts per address per minute, and submission intake 5
  per connection per hour.

## JSON API

The browser never uses `/api/*`: every public page is a server component that
reads the database directly, and every form posts through a server action. The
JSON routes exist for external consumers and the verification scripts, and
`src/proxy.ts` keeps them away from ordinary visitors.

`/api/public/*` returns **404** unless the request either comes from the machine
the app is running on, or presents `PUBLIC_API_KEY`:

```bash
curl -H "x-api-key: $PUBLIC_API_KEY" https://your-host/api/public/stats
# Authorization: Bearer $PUBLIC_API_KEY also works
```

Leaving `PUBLIC_API_KEY` empty therefore keeps the API local-only. Allowed
responses carry `X-Robots-Tag: noindex, nofollow` and `Cache-Control: private,
no-store`, and `/api/` is disallowed in `robots.txt`.

`/api/auth/*` is deliberately outside the matcher: the OAuth start and callback
routes are reached by browser redirect and have to stay open.

## Search engines

`/robots.txt` and `/sitemap.xml` are generated from the same published rows the
public pages read. The sitemap covers the static pages plus every published
scholarship, blog post and resource, and never a draft, a deleted record, or a
route robots.txt disallows. `npm run verify:links` fails if an advertised URL
does not answer, or if a published record is missing from the list.

## Rate limiting

Sign-in, sign-up, submission intake and admin writes are throttled per address.
Two limits deliberately do not charge for work that was never stored, so a
mistake costs a moment rather than an hour of quota:

- A **successful** sign-in clears that address's `login` bucket. The limit
  exists to slow password guessing, which only failures help; charging a
  correct password let an administrator who mistyped once lock themselves out.
- Submission intake **validates first and throttles last**, so a mistyped
  email is answered with a field error instead of a 429.

The buckets are in module memory, so they reset when the process restarts.
That is fine for the single Node process this runs as; a multi-instance
deployment needs a shared store.

## Social sign-in

Google and Apple sign-in are implemented and activate as soon as their
credentials are present in the environment. A provider is offered on the sign-in
and registration pages **only** when every value it needs is set, so the site
never shows a button that leads nowhere.

```bash
# Google: Google Cloud console -> APIs & Services -> Credentials
GOOGLE_CLIENT_ID=...
GOOGLE_CLIENT_SECRET=...

# Apple: Apple Developer account -> Keys, plus the Services ID
APPLE_CLIENT_ID=...
APPLE_TEAM_ID=...
APPLE_KEY_ID=...
APPLE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----"
```

Register the redirect URI with each provider as
`https://<your-origin>/api/auth/<provider>/callback`.

How it works:

- `/api/auth/[provider]` sends the browser to the provider with a `state` that is
  a random nonce plus an expiry, signed with `NEXTAUTH_SECRET` and single-use.
  The state is carried in the parameter rather than a cookie on purpose: Apple
  returns the user with a cross-site POST, and a `SameSite=Lax` cookie is not
  sent on a cross-site POST, so a cookie-based state would break Apple only.
- `/api/auth/[provider]/callback` accepts GET and POST, because Google returns
  the code in the query string while Apple POSTs a form. It refuses an
  unconfigured provider, a bad or replayed state, and a missing code before
  anything is written, then exchanges the code at the provider and checks the
  returned `id_token` for issuer, audience and expiry.
- An identity already linked signs straight in. A new Google identity whose email
  matches an existing account is linked to it rather than creating a second
  account, so saved scholarships survive. A genuinely new identity creates a user
  with a null password, which means it can only sign in through the provider
  until the visitor sets a password from their profile.

Linked identities live in the `AuthAccount` table, keyed on
`(provider, providerAccountId)`.

`npm run verify:oauth` covers the parts that can be checked without live
credentials: that no button is offered when a provider is unconfigured, that the
authorisation redirect is built correctly, and that the callback refuses tampered
input. Set `EXPECT_OAUTH_PROVIDERS=google` in the script's own environment to
assert the button is shown for a provider you have configured in the server. The
one thing not covered is a completed sign-in, which needs a real consent screen.

## What the platform does

**Public:** scholarship search with country, field, degree, funding, and deadline
filters; full listing pages with coverage breakdowns and official source links;
a ten-step eligibility matcher that explains every score; country, university,
and field directories; deadline calendar; comparison of up to four listings;
application tracker; guides, blog, and FAQ; public submission intake.

**Admin:** dashboard metrics; scholarship CMS with publishing, featuring,
duplicate detection, trash and restore; registry-driven CRUD for universities,
countries, fields, blog, resources, media, and users; submission inbox with
conversion; activity log with CSV export; role-gated settings.

## Verification

Eight scripts exercise a running server over real HTTP, replaying the hidden
server-action fields a browser would post, and one reads the build output. They
need `ADMIN_EMAIL` and `ADMIN_PASSWORD` in the environment and a server on
`http://localhost:3000`.

```bash
npm run verify            # bundle check, then all eight HTTP suites, in order
npm run verify:bundle     # no server-only code in the browser bundle
npm run verify:auth       # session boundary, roles, logout
npm run verify:content    # registry CRUD, publishing, submissions,
                          # settings, public visibility
npm run verify:crud       # create, edit, publish, trash, restore
npm run verify:public     # admin edits reach the public pages
npm run verify:forms      # every form refuses bad input and names the field
npm run verify:links      # every internal link, query link and sitemap URL
npm run verify:mobile     # no sideways scroll, reachable nav, 44px targets
npm run verify:oauth      # social sign-in wiring, config gating, CSRF state
```

`verify:forms` exists because the public sign-in and registration pages once
accepted any email and any password, waited 800ms in the browser, and reported
success without a server being involved. Each check asserts the server refuses
bad input *and* explains which field was wrong. The public forms invoke their
actions from a transition, so there is no `<form action>` to replay; the same
`signIn` and `signUp` rules are exercised through the form-based admin login,
which delegates to those functions.

`verify:mobile` covers what a desktop screenshot cannot show. It reads all 23
public routes and asserts nothing forces a width too wide for a 320px screen,
that a mobile navigation path exists and discloses its state, that the browse
filter toggle is a 44px thumb target, and that clipped card text still exposes
its full value. Some checks read component source rather than markup, because
the header's mobile panel and the browse results are only mounted on the client
and are absent from the server HTML.

`verify:links` crawls the public site, requests every route, query link and
authenticated admin page, and checks each external link. It also reads
`/sitemap.xml`: no entry may be a route `robots.txt` disallows, every entry must
answer 200, and every published scholarship, blog post and resource must appear
in it. A sitemap is how a record with no inbound link is found at all, so one
that drifts is a silent loss of traffic rather than a visible bug.

`verify:bundle` is not a formality. Nothing in `src/app` or `src/components`
calls `/api/*`; a client component gets its data from a server parent or a
server action. A transitive *value* import of the database layer would break
that silently, so the check fails the run instead. It needs `npm run build`
first.

These drive the real admin UI, so a run creates real rows. Afterwards:

```bash
npm run clean:test-records   # deletes everything the suites created
```

Without `--apply` the cleanup script only reports what it found, so it is safe
to run against a database you want to inspect first.

## Seed data

`npm run db:seed` loads 50 scholarships, all 196 sovereign countries (20 with
editorial detail, the rest with ISO reference data only), 22 fields, 20
universities, 15 providers, 3 blog posts, 8 guides, and 15 FAQs. The datasets
live in `prisma/seed-data/` and are imported by the seed only — no runtime code
reads them. Re-running the seed updates existing rows by slug or question rather
than duplicating them.

These are realistic sample records, not verified live opportunities. Treat them
as placeholders until staff replace them with sourced data.

## Importing scholarship data

`scripts/import-scholarships.mjs` loads a JSON or CSV export into the CMS:

```bash
npm run import:scholarships -- ./data/scholarships.csv --source "DAAD open data"
```

It maps the columns onto the `Scholarship` model, resolving `Country`,
`Provider`, `University` and `Field` relations by name (or ISO code for
countries). Header names are matched loosely, so `Funding Type`, `fundingType`
and `FUNDING_TYPE` are the same column; the accepted aliases are listed at the
top of the script.

Three things to know before running it:

- Rows land as `DRAFT` / `VERIFICATION_NEEDED` and are kept out of the sitemap.
  Nothing imported is public until staff publish it. Pass `--publish` only for a
  feed you have already checked.
- A name that does not match an existing row is **not** dropped. It is kept as
  text on `countryNameLegacy` / `universityNameLegacy`, and the run reports how
  many country, provider, university and subject names did not resolve so you can
  create those records and re-run.
- Unparseable values (a deadline of `"not a date"`) are stored as empty rather
  than guessed at. Re-running is safe: a title whose slug already exists is
  counted as a duplicate and skipped.

Only import data you have the right to republish — an official open-data feed, a
partner's export, or your own research. Copying another site's listings is not
just a data problem: their editorial text is copyrighted and their terms will
cover bulk copying.

## Further reading

`PROJECT_SUMMARY.md` covers the data visibility rules, the directory layout, and
the constraints worth knowing before changing the schema.

## Disclaimers

- The platform provides information. It does not award funding and does not
  accept applications; every application goes to the awarding organisation's own
  site.
- Eligibility is never determined here. Match scores are explainable heuristics,
  not admissions decisions.
- Users must confirm current requirements on the official provider page.
