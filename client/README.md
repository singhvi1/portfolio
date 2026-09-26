# Dev Portfolio

React + Redux Toolkit + React Router + Tailwind. Doubles as a monthly
engineering log and a projects showcase.

## Run locally

```bash
npm install
npm run dev
```

Open http://localhost:5173

## Build for production

```bash
npm run build
npm run preview   # sanity-check the production build locally
```

## Deploy (free, ~2 minutes)

1. Push this folder to a GitHub repo.
2. Go to https://vercel.com → "Add New Project" → import the repo.
3. Framework preset: Vite. Leave build settings as default. Deploy.
4. Every future `git push` auto-deploys.

## Personalize it

- `src/data/profile.js` — Vikash Kumar, bio, links, resume path
- `src/data/skills.js` — your skill groups and levels
- `src/data/projects.js` — your projects (shown on Home + /projects)
- Put your resume PDF in `public/resume.pdf`

## Add a new month (do this every month!)

1. Copy `src/data/posts/2026-08.js` → `src/data/posts/YYYY-MM.js`
2. Fill in `summary`, `learned`, `built`, `challenge`, `tags`
3. Import it at the top of `src/data/posts/index.js` and add it to the
   **front** of the `posts` array (newest first)
4. Commit and push — that's it, it's live

## Add a new project

Add an object to the `projects` array in `src/data/projects.js`. Set
`featured: true` to have it show up on the homepage too.

## Notes on the performance choices

- Every page is lazy-loaded via `React.lazy` + `Suspense` in `App.jsx`,
  so the initial bundle only ships the code for the page the visitor
  actually lands on.
- `activeTag` filter state lives in Redux (`src/store/slices/uiSlice.js`)
  so clicking a tech tag on any project/post filters `/projects`
  consistently from anywhere in the app.
- Derived filtering in `Projects.jsx` is wrapped in `useMemo` to avoid
  recomputing on unrelated re-renders.

## Ideas for later

- Swap the JS data files for real Markdown/MDX files if you want to write
  longer posts with rich formatting.
- Add a contact form via a service like Formspree.
- Add view counts / analytics with Plausible or Vercel Analytics.
