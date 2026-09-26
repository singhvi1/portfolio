import netflixGpt from './netflix-gpt.js';
import hostelops from './hostelops.js';
import devtinder from './devtinder.js';
import devPortfolio from './dev-portfolio.js';
import { placeholderProjects } from './placeholders.js';

// Full, rich project objects — this shape mirrors the planned MongoDB
// `Project` schema field-for-field, so migrating from static data to the
// API later is a source swap, not a reshape.
// Note: devPortfolio (this site) is intentionally excluded from the main
// showcase list — it's not one of the 5 featured dev projects. Import it
// separately (see devPortfolio export below) if you want to document it
// on an "About this site" page.
export const projects = [netflixGpt, hostelops, devtinder, ...placeholderProjects];

export { devPortfolio };

// Backward-compatible flat shape for the current ProjectCard/Projects/Home
// components (title, description, liveUrl, repoUrl) until those are
// upgraded in a later phase to use the richer fields directly.
export const legacyProjects = projects.map((p) => ({
  id: p.id,
  title: p.name,
  description: p.shortDescription,
  tags: p.tags,
  liveUrl: p.liveUrl || '',
  repoUrl: p.githubUrl || '',
  featured: p.featured,
  month: p.month,
}));
