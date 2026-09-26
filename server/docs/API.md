# API Documentation

Base URL (local dev): `http://localhost:5000/api`

All responses share one shape:

```json
{ "success": true,  "message": "...", "data": ... }
{ "success": false, "message": "...", "errors": [...] | null }
```

List endpoints return `data: { items: [...], pagination: { page, limit, total, totalPages } }`.

Auth: **httpOnly cookie** (set automatically on login) or `Authorization: Bearer <token>` header — either works, cookie is for the browser admin dashboard, header is for scripts/Postman.

---

## Auth

| Method | Endpoint       | Auth      | Body                  | Response                         |
| ------ | -------------- | --------- | --------------------- | -------------------------------- |
| POST   | `/auth/login`  | none      | `{ email, password }` | `{ email, token }` + sets cookie |
| POST   | `/auth/logout` | none      | —                     | clears cookie                    |
| GET    | `/auth/me`     | **admin** | —                     | `{ email }`                      |

## Projects

| Method | Endpoint               | Auth      | Body / Query                           | Response                                              |
| ------ | ---------------------- | --------- | -------------------------------------- | ----------------------------------------------------- |
| GET    | `/projects`            | none      | `?page&limit&search&category&featured` | paginated projects                                    |
| GET    | `/projects/featured`   | none      | —                                      | featured projects (excludes the portfolio app itself) |
| GET    | `/projects/slug/:slug` | none      | —                                      | one project by slug (used by the public detail page)  |
| GET    | `/projects/:id`        | none      | —                                      | one project                                           |
| POST   | `/projects`            | **admin** | full project object (see schema)       | created project                                       |
| PUT    | `/projects/:id`        | **admin** | partial project object                 | updated project                                       |
| DELETE | `/projects/:id`        | **admin** | —                                      | —                                                     |

## Technologies

| Method | Endpoint            | Auth      | Notes                                                                                                  |
| ------ | ------------------- | --------- | ------------------------------------------------------------------------------------------------------ |
| GET    | `/technologies`     | none      | `?page&limit&search&category&proficiency`                                                              |
| GET    | `/technologies/:id` | none      |                                                                                                        |
| POST   | `/technologies`     | **admin** | `category` must be one of the 10 fixed categories; `proficiency` one of Beginner/Intermediate/Advanced |
| PUT    | `/technologies/:id` | **admin** |                                                                                                        |
| DELETE | `/technologies/:id` | **admin** |                                                                                                        |

## DSA Problems

| Method | Endpoint     | Auth      | Notes                                               |
| ------ | ------------ | --------- | --------------------------------------------------- |
| GET    | `/dsa`       | none      | `?page&limit&search&platform&difficulty&topic`      |
| GET    | `/dsa/stats` | none      | totals by difficulty and topic, for progress charts |
| GET    | `/dsa/:id`   | none      |                                                     |
| POST   | `/dsa`       | **admin** |                                                     |
| PUT    | `/dsa/:id`   | **admin** |                                                     |
| DELETE | `/dsa/:id`   | **admin** |                                                     |

## Courses

| Method              | Endpoint       | Auth                       | Notes                                |
| ------------------- | -------------- | -------------------------- | ------------------------------------ |
| GET                 | `/courses`     | none                       | `?page&limit&search&status&platform` |
| GET/POST/PUT/DELETE | `/courses/:id` | GET none, others **admin** |                                      |

## Achievements

| Method              | Endpoint            | Auth                       | Notes                         |
| ------------------- | ------------------- | -------------------------- | ----------------------------- |
| GET                 | `/achievements`     | none                       | `?page&limit&search&category` |
| GET/POST/PUT/DELETE | `/achievements/:id` | GET none, others **admin** |                               |

## Experience

| Method              | Endpoint          | Auth                       | Notes                               |
| ------------------- | ----------------- | -------------------------- | ----------------------------------- |
| GET                 | `/experience`     | none                       | `?page&limit&search&employmentType` |
| GET/POST/PUT/DELETE | `/experience/:id` | GET none, others **admin** |                                     |

## Articles

| Method | Endpoint               | Auth      | Notes                                                                         |
| ------ | ---------------------- | --------- | ----------------------------------------------------------------------------- |
| GET    | `/articles`            | none      | **published only**. `?page&limit&search&tag`                                  |
| GET    | `/articles/slug/:slug` | none      | **published only**                                                            |
| GET    | `/articles/admin/all`  | **admin** | everything, drafts included                                                   |
| GET    | `/articles/admin/:id`  | **admin** | any single article by id, drafts included                                     |
| POST   | `/articles`            | **admin** | defaults to `status: "draft"`                                                 |
| PUT    | `/articles/:id`        | **admin** |                                                                               |
| DELETE | `/articles/:id`        | **admin** |                                                                               |
| PATCH  | `/articles/:id/status` | **admin** | `{ status: "draft" \| "published" }` — publishing auto-stamps `publishedDate` |

## AI Experiments

| Method              | Endpoint              | Auth                       | Notes                |
| ------------------- | --------------------- | -------------------------- | -------------------- |
| GET                 | `/ai-experiments`     | none                       | `?page&limit&search` |
| GET/POST/PUT/DELETE | `/ai-experiments/:id` | GET none, others **admin** |                      |

## Journey Entries (monthly log)

Keyed by `month` (`"YYYY-MM"`), not a Mongo ObjectId.

| Method | Endpoint          | Auth      | Notes                                                      |
| ------ | ----------------- | --------- | ---------------------------------------------------------- |
| GET    | `/journey`        | none      | all months, newest first, references populated             |
| GET    | `/journey/:month` | none      | e.g. `/journey/2026-08`                                    |
| POST   | `/journey`        | **admin** | `{ month, projects: [id...], technologies: [id...], ... }` |
| PUT    | `/journey/:month` | **admin** |                                                            |
| DELETE | `/journey/:month` | **admin** |                                                            |

---

## Error responses

| Status | Meaning                                                 |
| ------ | ------------------------------------------------------- |
| 400    | Bad request (e.g. invalid ObjectId in URL)              |
| 401    | Not authenticated / invalid or expired token            |
| 404    | Not found                                               |
| 409    | Duplicate key (e.g. slug already exists)                |
| 422    | Validation failed — `errors: [{ field, message }, ...]` |
| 500    | Unexpected server error                                 |
