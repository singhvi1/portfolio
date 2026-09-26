# Developer Journey Platform

A full-stack portfolio that's also a living record of engineering growth — not a static resume, but a system for tracking what I build, learn, and ship, month by month.

> **Live**: _add your deployed URL here once live_
> **API docs**: [`server/docs/API.md`](server/docs/API.md)

## What this is

Most developer portfolios go stale the week they're published. This one is built so it doesn't: a real backend and admin dashboard mean I can log a new project, a technology I learned, DSA problems solved, or a monthly journal entry in minutes — and the public site reflects it immediately, with no redeploy.

It's also the largest full-stack project I've built end to end: schema design, REST API, JWT auth, a generic admin CMS, a public site consuming that API, and an MCP server that lets an AI assistant help fill it in through conversation.

## Features

- **Public portfolio** — projects (with individual case-study pages), a monthly journey timeline, DSA progress, technologies, work experience, an AI experiments lab, and a technical writing section
- **Admin dashboard** (`/admin`) — full CRUD for all 9 content types, protected by JWT auth, with real client + server-side validation
- **Project case studies** — problem/solution, tech stack, architecture (derived from real stack data, not hand-drawn), technical challenges, and what I learned — for every project
- **Draft/publish workflow** for articles — drafts are enforced server-side to never leak through public endpoints, not just hidden in the UI
- **Monthly journey log** — a git-commit-style timeline that composes projects, technologies, achievements, and articles touched that month via real references, not copy-pasted content
- **MCP server** (`mcp-server/`) — lets an AI assistant (e.g. Claude Desktop) read and write portfolio content through natural conversation, using the same API and validation as the admin dashboard

## Tech stack

**Client** — React 18, Redux Toolkit, React Router, Tailwind CSS, Vite
**Server** — Node.js, Express, MongoDB (Mongoose), JWT, bcrypt, express-validator
**MCP server** — `@modelcontextprotocol/sdk`, Zod

## Project structure

```
client/       React frontend — public site + admin dashboard
server/       Express REST API + MongoDB models
mcp-server/   MCP server exposing the API as AI-callable tools
```

See [`INTERVIEW-NOTES.md`](INTERVIEW-NOTES.md) for a full folder-by-folder breakdown, the architecture, and the reasoning behind key decisions.

## Getting started

Requires Node 18+ and a MongoDB Atlas account (free tier works).

```bash
# 1. Backend
cd server
npm install
cp .env.example .env        # fill in MONGODB_URI, JWT_SECRET, ADMIN_EMAIL
npm run hash-password        # generates ADMIN_PASSWORD_HASH for .env
npm run seed                 # loads real seed project data
npm run dev                  # http://localhost:5000

# 2. Frontend (new terminal)
cd client
npm install
cp .env.example .env
npm run dev                  # http://localhost:5173

# 3. (Optional) MCP server — see mcp-server/README.md
```

Full environment variable reference is in each folder's `.env.example`.

## Deployment

Deployed as three independent pieces, each on a free tier:

| Piece | Where |
|---|---|
| `client` | Vercel |
| `server` | Render |
| MongoDB | Atlas |

`mcp-server` isn't deployed — it runs locally alongside Claude Desktop.

## Testing

- `server/src/seed/verify.js` — auth, validation, and route-protection checks
- `server/src/seed/verify-crud-mocked.js` — full CRUD + draft/publish behavior against an in-memory model
- `E2E-TESTING.md` — manual checklist for real-database, real-browser verification

## Author

**Vikash Kumar** — [GitHub](https://github.com/singhvi1) · [LinkedIn](https://linkedin.com/in/vikashsingh777)
