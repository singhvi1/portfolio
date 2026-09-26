# Server — Express + MongoDB API

Backend for the Developer Journey platform. See `docs/API.md` for the full endpoint reference.

## Setup

```bash
cd server
npm install
cp .env.example .env
```

Fill in `.env`:
- `MONGODB_URI` — your MongoDB Atlas connection string
- `JWT_SECRET` — any long random string
- `ADMIN_EMAIL` — the email you'll log into `/admin` with
- `ADMIN_PASSWORD_HASH` — run `npm run hash-password`, enter your chosen password, paste the printed hash here (the plaintext password is never stored anywhere)

## Run

```bash
npm run dev     # nodemon, auto-restarts on change
npm start       # plain node, for production
```

On startup the server validates required env vars and the MongoDB connection **before** accepting requests — if either is missing/unreachable it exits with a clear error instead of starting in a broken state.

## Seed real project data

```bash
npm run seed
```

This reads directly from `../client/src/data/projects/*.js` — the same real project data extracted from your uploaded codebase analyses (Netflix-GPT, HostelOps, DevTinder) — and upserts it into MongoDB by `slug`. It's safe to re-run. The 3 unverified placeholders (Swiggy/Weather/E-commerce) get seeded too, flagged with `isPlaceholder: true`.

Nothing else is auto-seeded — Technologies, DSA, Courses, etc. have no verified source data yet. Add those through the admin dashboard (Phase 4) or send me real data to extract like the projects.

## Verify

```bash
npm run verify
```

Runs 13 checks against the auth/validation/routing layer (login, JWT issuance and rejection, protected routes rejecting unauthenticated/invalid requests) without requiring a live MongoDB connection. See the Phase 3 report for what this does and doesn't cover.

## Folder structure

```
server/
  src/
    config/         # DB connection, env validation
    controllers/     # one per entity + a shared CRUD factory
    middleware/      # auth (JWT), validation, error handling
    models/          # Mongoose schemas
    routes/          # one per entity, mounted under /api
    validators/       # express-validator rule sets per entity
    seed/            # seed.js (real data import), verify.js, generateHash.js
    app.js           # Express app assembly
    index.js         # entry point: env validation -> DB connect -> listen
  docs/API.md
  .env.example
```
