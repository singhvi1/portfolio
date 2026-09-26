// This file now re-exports from the richer schema in ./projects/index.js
// so existing components (ProjectCard, Projects.jsx, Home.jsx) keep working
// unchanged. The full, rich project data lives in ./projects/*.js — this
// is just the flattened view they currently expect.
export { legacyProjects as projects } from './projects/index.js';
