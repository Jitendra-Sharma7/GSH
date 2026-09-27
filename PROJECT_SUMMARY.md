# Global Scholarship Hub

A scholarship discovery platform: students browse, filter, compare, and track
scholarships; staff manage every listing through an admin panel backed by
PostgreSQL.

The product rule that shapes every decision here: **never present a fact the
data does not support.** Funding amounts, deadlines, eligibility, and
verification status all come from stored records. Anything a provider has not
stated is shown as "Not stated", not as a confident "No".

## Stack

| | |
|---|---|
| Framework | Next.js 16.3.5 (App Router, React Server Components) |
| UI | React 19.2.8, TypeScript, Tailwind CSS 3.4.17, lucide-react |
| Data | PostgreSQL 17, Prisma 6.19.3 |
| State | Zustand (saved scholarships, comparison, tracker, profile) |
| Validation | Zod, on the server, for every write path |
| Auth | bcrypt password hashing, HMAC-SHA256 session tokens, HTTP-only cookies |

## Getting started

```bash
npm install
npx prisma db push --skip-generate   # schema -> database
npx prisma generate
npm run db:seed                      # idempotent; safe to re-run
npm run dev
```

The seed creates the super admin printed at the end of its output. Credentials
for an existing installation live in `.env`.

```bash
npm run typecheck    # tsc --noEmit
npm run lint
npm run build
npm run start
```

## Layout

```
prisma/
  schema.prisma          all models: identity, content, editorial, activity
  seed.ts                idempotent seeding
  seed-data/             the seed's own datasets - never imported by the app
src/
  app/
    (public routes)       /, /scholarships, /finder, /countries, /fields,
                          /universities, /resources, /blog, /faq, /deadlines,
                          /compare, /tracker, /dashboard, legal pages
    admin/                staff panel; the public header and footer are
                          suppressed here (src/components/layout/SiteChrome.tsx)
    api/public/           read-only endpoints used by client components
    actions/              server actions for every write path
  components/
    layout/               Header, Footer, SiteChrome
    public/               DB-backed directory browsers
    admin/                admin shell, entity table, entity form
    consent/              first-visit cookie consent
  lib/
    data/public.ts        the only public read path; every query filters on
                          publishStatus = PUBLISHED and deletedAt IS NULL
    data/store.ts         server/client facade over the above
    admin-registry.ts     drives every registry-driven admin section
    auth.ts               sessions, roles, audit logging, rate limiting
```

## Data visibility rules

- A scholarship is public only when `publishStatus = PUBLISHED` and
  `deletedAt IS NULL`.
- Publish state and deadline state are separate. A listing past its deadline
  derives to `Expired` unless `deadlineStatusOverride` holds it open.
- `deadAt` is never accepted from a form; soft deletion goes through the
  role-checked trash action.
- Countries, universities, and fields have no public detail page, so they have
  no slug redirects either.
- Public pages read the database. There is no mock data in the runtime path:
  the seed datasets under `prisma/seed-data/` are imported by the seed only.
- The browser never calls `/api/*`. A client component gets its data from a
  server parent, or - when the data is not knowable at request time, such as the
  comparison list or a freshly requested match - from a server action in
  `app/actions/`. The JSON routes remain for external consumers and the
  verification scripts.
- Client components may import *types* from a server module but never a value.
  A value import drags the module - and Prisma - into the browser bundle, which
  `verify:bundle` catches.

## Verification

Six scripts: five drive the running server over real HTTP, and one reads the
build output.

```bash
npm run verify            # bundle check, then all six HTTP suites, in order
npm run verify:bundle     # no server-only code in the browser bundle
npm run verify:auth       # session boundary, roles, logout
npm run verify:content    # registry CRUD, publishing, submissions,
                          # settings, public visibility
npm run verify:crud       # scholarship create/edit/publish/trash
npm run verify:public     # admin edits reach the public pages
npm run verify:forms      # every form refuses bad input and says why
npm run verify:mobile     # sideways scroll, mobile nav, touch targets
```

They need `ADMIN_EMAIL` and `ADMIN_PASSWORD` in the environment and a server on
`http://localhost:3000`. `verify:bundle` reads `.next/static/chunks` and needs
`npm run build` first.

`verify:mobile` covers what a desktop screenshot cannot show, and every check in
it corresponds to something that was actually wrong here: the header's brand
lockup plus auth buttons plus menu toggle overflowed a 320-390px screen, the
open mobile menu let the page scroll underneath it and did not say whether it
was open, the browse filter toggle was a 30px target guarding the whole
filtering experience, and country and field names were truncated to
unreadability in two-column phone grids. Its checks are deliberately few and
specific. A blanket "no multi-column grid" rule would fire on the stat tiles,
which are correctly two abreast on a phone, so a noisier rule would have been
ignored instead of maintained.

`verify:forms` exists because the public sign-in and registration pages once
accepted any email and any password, waited 800ms in the browser, and reported
success without a server being involved. Nothing about that looked broken in a
screenshot. Each check now asserts that the server refuses bad input *and* names
the offending field, which is the part a bare "it returned an error" check would
have missed. The public forms call their actions from a transition, so they have
no `<form action>` to replay; their rules are the ones in `signIn` and `signUp`,
and `verify:forms` exercises those through the form-based admin login, which
delegates to the same functions.

Because they drive the real admin UI, a run creates real rows. `npm run
clean:test-records` removes everything the suites created, including the
matching activity log entries, so a verification pass does not inflate the
public counts. It reports what it found unless `--apply` is passed.

## Schema changes

This environment's database role cannot create a shadow database, so
`prisma migrate dev` fails with `P3014`. Use:

```bash
npx prisma db push --skip-generate --accept-data-loss
npx prisma generate
```

Stop the running server before `prisma generate` on Windows; the query engine
DLL stays locked while it is running.
