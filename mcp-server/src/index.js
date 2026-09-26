import 'dotenv/config';
import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { z } from 'zod';
import { apiRequest } from './apiClient.js';
import { ENTITIES, ENTITY_NAMES, getEntityConfig } from './entityConfig.js';

const server = new McpServer({ name: 'portfolio-cms', version: '1.0.0' });

const entityEnum = z.enum(ENTITY_NAMES);
const entityListDescription = ENTITY_NAMES.map((n) => `- ${n}: ${ENTITIES[n].description}`).join('\n');

function jsonResult(data) {
  return { content: [{ type: 'text', text: JSON.stringify(data, null, 2) }] };
}

function buildListPath(config, { search, limit, page } = {}) {
  const base = config.adminListPath || config.path;
  const params = new URLSearchParams();
  if (search) params.set('search', search);
  if (limit) params.set('limit', String(limit));
  if (page) params.set('page', String(page));
  const qs = params.toString();
  return qs ? `${base}?${qs}` : base;
}

function buildRecordPath(config, id) {
  return config.adminGetPath ? config.adminGetPath(id) : `${config.path}/${id}`;
}

// --- list_records ---------------------------------------------------------
server.registerTool(
  'list_records',
  {
    description: `List records for one of the 9 portfolio entities, with optional search.\n\nAvailable entities:\n${entityListDescription}\n\nNote: for "journey", each entry's id is a "YYYY-MM" month string, not a database id. For "articles", this returns ALL articles including drafts (this tool acts as the admin) — the public site only ever shows published ones.`,
    inputSchema: {
      entity: entityEnum,
      search: z.string().optional().describe('Text search, where supported by that entity'),
      limit: z.number().optional().describe('Max results (default 20, most entities cap at 100)'),
      page: z.number().optional(),
    },
  },
  async ({ entity, search, limit, page }) => {
    const config = getEntityConfig(entity);
    const data = await apiRequest('GET', buildListPath(config, { search, limit, page }));
    return jsonResult(data);
  }
);

// --- get_record -------------------------------------------------------------
server.registerTool(
  'get_record',
  {
    description:
      'Get a single record by id. For "journey", pass the month string (e.g. "2026-08") as the id.',
    inputSchema: {
      entity: entityEnum,
      id: z.string().describe('Mongo id, or month string ("YYYY-MM") for journey'),
    },
  },
  async ({ entity, id }) => {
    const config = getEntityConfig(entity);
    const data = await apiRequest('GET', buildRecordPath(config, id));
    return jsonResult(data);
  }
);

// --- create_record ----------------------------------------------------------
server.registerTool(
  'create_record',
  {
    description:
      'Create a new record. "data" should match that entity\'s real schema — check list_records or the portfolio\'s server/docs/API.md for exact fields if unsure. Server-side validation applies; invalid data comes back as a clear error, nothing is invented or guessed on your behalf.',
    inputSchema: {
      entity: entityEnum,
      data: z.record(z.string(), z.any()).describe('The record fields, matching the entity schema'),
    },
  },
  async ({ entity, data }) => {
    const config = getEntityConfig(entity);
    const result = await apiRequest('POST', config.path, data);
    return jsonResult(result);
  }
);

// --- update_record ----------------------------------------------------------
server.registerTool(
  'update_record',
  {
    description:
      'Update an existing record by id (partial update — only send the fields that changed). For "journey", id is the month string.',
    inputSchema: {
      entity: entityEnum,
      id: z.string(),
      data: z.record(z.string(), z.any()),
    },
  },
  async ({ entity, id, data }) => {
    const config = getEntityConfig(entity);
    const result = await apiRequest('PUT', `${config.path}/${id}`, data);
    return jsonResult(result);
  }
);

// --- delete_record ----------------------------------------------------------
server.registerTool(
  'delete_record',
  {
    description: 'Delete a record by id. For "journey", id is the month string. This cannot be undone.',
    inputSchema: {
      entity: entityEnum,
      id: z.string(),
    },
  },
  async ({ entity, id }) => {
    const config = getEntityConfig(entity);
    await apiRequest('DELETE', `${config.path}/${id}`);
    return jsonResult({ deleted: true, entity, id });
  }
);

// --- set_article_status -------------------------------------------------
server.registerTool(
  'set_article_status',
  {
    description:
      'Publish or unpublish an article. Publishing auto-stamps today\'s date as publishedDate on the server. Draft articles never appear on the public site regardless of this tool — this is the only way to make one visible.',
    inputSchema: {
      id: z.string().describe('The article\'s Mongo id'),
      status: z.enum(['draft', 'published']),
    },
  },
  async ({ id, status }) => {
    const result = await apiRequest('PATCH', `/articles/${id}/status`, { status });
    return jsonResult(result);
  }
);

// --- get_dsa_stats -----------------------------------------------------------
server.registerTool(
  'get_dsa_stats',
  {
    description: 'Get DSA totals by difficulty and topic. Read-only, no arguments.',
    inputSchema: {},
  },
  async () => {
    const data = await apiRequest('GET', '/dsa/stats');
    return jsonResult(data);
  }
);

// --- get_dashboard_summary ---------------------------------------------
server.registerTool(
  'get_dashboard_summary',
  {
    description:
      'Get a record count for every entity in one call — useful at the start of a monthly catch-up to see what\'s empty or what might be missing this month.',
    inputSchema: {},
  },
  async () => {
    const counts = {};
    for (const name of ENTITY_NAMES) {
      const config = ENTITIES[name];
      const data = await apiRequest('GET', buildListPath(config, { limit: 1 }));
      counts[name] = Array.isArray(data) ? data.length : data?.pagination?.total ?? 'unknown';
    }
    return jsonResult(counts);
  }
);

async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error('[portfolio-mcp-server] Connected and ready.');
}

main().catch((err) => {
  console.error('[portfolio-mcp-server] Fatal error:', err);
  process.exit(1);
});
