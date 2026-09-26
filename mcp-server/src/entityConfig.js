// Single source of truth for how each entity maps onto the real REST API.
// Mirrors the same "one config, not nine bespoke implementations" pattern
// already used server-side (crudFactory) and in the admin dashboard
// (entityConfigs.js) — this is the MCP-facing equivalent.

export const ENTITIES = {
  projects: {
    path: '/projects',
    idParam: 'id', // Mongo _id
    description: 'Portfolio projects (real ones and unverified placeholders).',
  },
  technologies: {
    path: '/technologies',
    idParam: 'id',
    description: 'Technologies learned, grouped by category with a proficiency level.',
  },
  dsa: {
    path: '/dsa',
    idParam: 'id',
    description: 'DSA problems solved (LeetCode, Codeforces, etc).',
  },
  courses: {
    path: '/courses',
    idParam: 'id',
    description: 'Courses in progress or completed.',
  },
  achievements: {
    path: '/achievements',
    idParam: 'id',
    description: 'Certifications, hackathons, awards, milestones.',
  },
  experience: {
    path: '/experience',
    idParam: 'id',
    description: 'Work experience entries.',
  },
  articles: {
    path: '/articles',
    idParam: 'id',
    description: 'Technical articles/blog posts. Draft by default until published.',
    // The public /articles endpoints only return published articles by
    // design (drafts must never leak publicly) — but this MCP server acts
    // as the admin, so listing/reading needs the admin-only routes that
    // can see drafts too.
    adminListPath: '/articles/admin/all',
    adminGetPath: (id) => `/articles/admin/${id}`,
  },
  aiExperiments: {
    path: '/ai-experiments',
    idParam: 'id',
    description: 'AI/LLM experiments — RAG, agents, prompt engineering, etc.',
  },
  journey: {
    path: '/journey',
    idParam: 'month', // NOT a Mongo id — journey entries are keyed by "YYYY-MM"
    description:
      'Monthly journey entries. IMPORTANT: the "id" for this entity is the month string itself (e.g. "2026-08"), not a Mongo ObjectId. Can reference projects/technologies/achievements/articles/aiExperiments by their real ids.',
  },
};

export const ENTITY_NAMES = Object.keys(ENTITIES);

export function getEntityConfig(entity) {
  const config = ENTITIES[entity];
  if (!config) {
    throw new Error(`Unknown entity "${entity}". Valid entities: ${ENTITY_NAMES.join(', ')}`);
  }
  return config;
}
