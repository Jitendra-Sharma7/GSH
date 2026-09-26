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
- `RATE_LIMIT_MAX_REQUESTS` / `RATE_LIMIT_WINDOW_MS` — throttle for login,
  submission intake, and upload.

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

Four scripts exercise a running server over real HTTP, replaying the hidden
server-action fields a browser would post. They need `ADMIN_EMAIL` and
`ADMIN_PASSWORD` in the environment and a server on `http://localhost:3000`.

```bash
npm run verify            # all four, in order
npm run verify:auth       # session boundary, roles, logout
npm run verify:content    # registry CRUD, publishing, submissions,
                          # settings, public visibility
npm run verify:crud       # create, edit, publish, trash, restore
npm run verify:public     # admin edits reach the public pages
```

These drive the real admin UI, so a run creates real rows. Afterwards:

```bash
npm run clean:test-records   # deletes everything the suites created
```

Without `--apply` the cleanup script only reports what it found, so it is safe
to run against a database you want to inspect first.

## Seed data

`npm run db:seed` loads 50 scholarships, 20 countries, 22 fields, 20
universities, 15 providers, 3 blog posts, 8 guides, and 15 FAQs. The datasets
live in `prisma/seed-data/` and are imported by the seed only — no runtime code
reads them. Re-running the seed updates existing rows by slug or question rather
than duplicating them.

These are realistic sample records, not verified live opportunities. Treat them
as placeholders until staff replace them with sourced data.

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
