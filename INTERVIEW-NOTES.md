# Interview Notes — Developer Journey Platform

Internal reference for talking about this project confidently: what's where, what makes it worth mentioning, and how data actually moves through it. Not meant to be public-facing.

---

## 1. Folder structure, annotated

### `client/` — React frontend

```
client/src/
├── App.jsx                    Route table: public routes + /admin/* behind ProtectedRoute
├── main.jsx                   Entry point — wraps App in Redux Provider + BrowserRouter
├── index.css                  Design tokens (colors, fonts) + the "commit-line" timeline visual
│
├── pages/                     Public site, one file per route
│   ├── Home.jsx                Featured projects + latest journey entry, from the API
│   ├── Projects.jsx             All projects, tag-filterable
│   ├── ProjectDetail.jsx        Case-study page — /projects/:slug
│   ├── Journey.jsx               Monthly timeline, composes 5 entity types per month
│   ├── Dsa.jsx, Technologies.jsx, Experience.jsx, AiLab.jsx   One per entity
│   ├── Articles.jsx, ArticleDetail.jsx   Published-only list + /articles/:slug
│   └── About.jsx
│
├── admin/                      Everything behind /admin
│   ├── pages/
│   │   ├── Login.jsx, Dashboard.jsx
│   │   ├── EntityList.jsx, EntityForm.jsx        Generic — config-driven, used by 6 of 9 entities
│   │   └── projects/, articles/, journey/          Dedicated list+form pairs — these 3 needed
│   │       │                                        custom logic (full schema, publish toggle,
│   │       │                                        month-keyed references) that the generic
│   │       │                                        system doesn't cover
│   ├── config/entityConfigs.js  The single config that drives every generic entity's form fields
│   ├── components/              AdminLayout, Sidebar, DataTable, ConfirmDialog, StatusStates,
│   │                              fields/ (Field, FormField, TagInput, ObjectArrayField)
│   └── hooks/                    useEntityList, useEntityRecord, useUnsavedChangesWarning
│
├── components/                  Shared by the public site
│   ├── ProjectCard.jsx           Click-to-navigate, with nested-link event handling
│   ├── MarkdownContent.jsx       Hand-rolled Markdown renderer — builds React elements
│   │                              directly instead of dangerouslySetInnerHTML, so it's
│   │                              XSS-safe by construction, no sanitizer dependency needed
│   ├── TagBadge.jsx, Navbar.jsx, Footer.jsx, StatusStates.jsx
│
├── data/                         Static seed source ONLY — not read at runtime by any page
│   ├── profile.js                 Name/bio/links — deliberately kept static (see §3)
│   └── projects/                  Real project data extracted from actual codebases (see §3)
│
├── hooks/useApiGet.js            Shared data-fetching hook — loading/error/data state
├── lib/api.js                    Fetch wrapper — unwraps {success, data, message}, handles auth
└── store/                        Redux Toolkit — authSlice (admin session), uiSlice (filters/nav)
```

### `server/` — Express API

```
server/src/
├── index.js                Entry: validates env → connects DB → starts listening → graceful shutdown
├── app.js                  Express app: helmet, CORS, JSON body parsing, cookie parsing, routes
│
├── models/                 9 Mongoose schemas — Project, Technology, DsaProblem, Course,
│                             Achievement, Experience, Article, AiExperiment, JourneyEntry
├── controllers/
│   ├── crudFactory.js       Generates list/get/create/update/remove for a given Model —
│   │                          every entity's controller wraps this instead of repeating it
│   └── <entity>Controller.js   Wraps the factory + entity-specific logic (e.g. Article's
│                                  publish/unpublish, Project's /featured, DSA's /stats)
├── routes/                  One file per entity, mounted under /api in routes/index.js
├── validators/              express-validator rule sets, one file per entity
├── middleware/
│   ├── auth.js               requireAdmin — verifies JWT from cookie or Bearer header
│   ├── validate.js           Turns express-validator errors into a consistent 422 response
│   └── errorHandler.js       Central handler — normalizes Mongoose/cast/duplicate-key/JWT
│                                errors into one response shape
├── config/                  db.js (connection, 8s timeout so a bad URI fails fast, not hangs),
│                              validateEnv.js (fails startup loudly if required vars are missing)
└── seed/
    ├── seed.js               Imports real data directly from client/src/data — single source
    │                            of truth, no duplication between seed and static data
    ├── verify.js              16 automated checks: auth, validation, route protection
    └── verify-crud-mocked.js  11 checks: full CRUD + draft/publish, against an in-memory
                                  model stand-in (used during development without a live DB)
```

### `mcp-server/` — AI integration

```
mcp-server/src/
├── entityConfig.js    Same "one config, not nine" pattern as the client's entityConfigs.js —
│                        maps all 9 entities to their real API paths and quirks
├── apiClient.js        Logs into the real API once, caches the JWT, re-authenticates on 401
└── index.js            Registers 8 MCP tools (list/get/create/update/delete + publish +
                          dsa-stats + dashboard-summary), all backed by the same REST API
                          and the same validation as the admin dashboard
```

---

## 2. How to talk about this in an interview

**One-line framing**: "I built a full-stack platform to track my own engineering growth — it's a real MERN app with an admin CMS I use monthly, and I extended it with an MCP server so I can update it by just talking to an AI instead of filling out forms."

**If asked to walk through the architecture**: React SPA → REST API (Express) → MongoDB, with a single admin authenticated by JWT (no user collection — deliberately simple, since there's only ever one admin). The interesting part isn't the stack, it's the **shared generic CRUD pattern**: both the server (`crudFactory.js`) and the client (`entityConfigs.js` + `EntityList`/`EntityForm`) use one config-driven implementation for 6 of the 9 content types, instead of nine repeated CRUD implementations — and the 3 that needed custom behavior (Projects' full schema, Articles' publish workflow, Journey's month-keyed cross-references) got dedicated code instead of being forced into the generic shape. That's a real "know when to abstract and when not to" decision, not just DRY for its own sake.

**If asked about a hard technical problem**: the Article draft/publish system. Drafts have to be genuinely inaccessible through the public API — not just hidden in the UI — including when a *draft* article is referenced by a Journey entry that's otherwise fully public. That required filtering at the Journey rendering layer specifically for that case, and I wrote automated tests (`verify-crud-mocked.js`) asserting a draft never appears in the public article list, the public detail route 404s for it, and it's excluded from a public journey entry even when linked — because this is exactly the kind of thing that's easy to get right in the obvious case and wrong in an edge case.

**If asked about AI/LLM experience**: the MCP server is a strong, current answer — it's a real Model Context Protocol server (the same protocol Anthropic, OpenAI, and others are converging on for agent-tool integration in 2026), exposing the app's own REST API as tools an AI can call, with the same server-side validation as everything else — so the AI can't write invalid data even if it tries.

**On data integrity** (worth mentioning if asked about attention to detail): every real project shown on the site was extracted from actual codebase analysis, not written generically — and anything unverified (3 placeholder projects, some project dates) is explicitly flagged as such in both the data and the UI, rather than presented as fact. Same principle shows up in the architecture diagrams on each project's case-study page — they're derived from the project's actual recorded tech stack, not hand-drawn.

---

## 3. Key decisions worth being able to defend

| Decision | Why |
|---|---|
| Single env-based admin, no user collection | There's exactly one admin. A full user/roles system would be complexity with no real use case — premature generalization. |
| `profile.js` (name/bio/links) stays static, not in MongoDB | Changes maybe once a year. A DB-backed model for ~6 rarely-changing fields isn't worth the schema/API/admin-form overhead. |
| Generic CRUD for 6 entities, custom for 3 | Projects/Articles/Journey have real behavioral differences (full schema, publish state, cross-references). Forcing them into the generic shape would've made the generic system worse to save writing three extra files. |
| MongoDB Atlas + Vercel + Render, all free tier | Deliberately zero-cost to run. Render's free tier sleeps after 15 min idle — accepted trade-off for a low-traffic portfolio site, documented rather than hidden. |
| MCP server is a separate package, not merged into `server/` | It's a different trust boundary (holds plaintext admin credentials locally) and a different runtime concern (long-lived stdio process vs a stateless API) — keeping it separate keeps `server/` deployable as-is. |

---

## 4. What's genuinely still incomplete (say this proactively, don't wait to be asked)

- Most content beyond the 3 real case-study projects is still empty (Technologies, DSA, Experience, Articles, AI Lab) — the platform is built, the content is a work in progress
- No rate limiting on the admin login endpoint yet — identified, not yet fixed
- 3 of the 6 showcased projects (Swiggy/Weather/E-commerce clones) are placeholders pending real codebase data
