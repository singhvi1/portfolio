# Portfolio MCP Server

Exposes your portfolio's admin API as tools an AI can call — so you can fill
in monthly journey entries (and everything else) by just describing your
month in conversation, instead of opening five admin forms.

Covers all 9 entities: projects, technologies, dsa, courses, achievements,
experience, articles, aiExperiments, journey.

## How it works

This is a thin wrapper, not new infrastructure. It logs into your existing
`/api/auth/login` with your admin credentials, caches the JWT in memory, and
calls the same REST API your admin dashboard already uses. No new database,
no new auth system, no changes to `server/` or `client/`.

## Setup (Windows PowerShell)

```powershell
cd mcp-server
npm install
Copy-Item .env.example .env
notepad .env
```

Fill in:
- `API_BASE_URL` — leave as `http://localhost:5000/api` if running locally
- `ADMIN_EMAIL` — same one you log into `/admin` with
- `ADMIN_PASSWORD` — your actual admin password (**plaintext**, not the hash — this server logs in the same way the browser does). This file is git-ignored. Treat it like your browser session when logged into `/admin`: fine on your own machine, never commit it, never share it.

Your portfolio's `server/` must be running (`npm run dev` in that folder) whenever you use this — the MCP server has no data of its own, it's just a translator.

## Connect to Claude Desktop

1. Open Claude Desktop → Settings → Developer → Edit Config (this opens `%APPDATA%\Claude\claude_desktop_config.json` on Windows)
2. Add an entry (merge with anything already there):

```json
{
  "mcpServers": {
    "portfolio-cms": {
      "command": "node",
      "args": ["E:\Projects\portfolio\existing-portfolio-mcp -phae6\existing-portfolio\mcp-server\src\index.js"],
      "env": {
        "API_BASE_URL": "http://localhost:5000/api",
        "ADMIN_EMAIL": "you@example.com",
        "ADMIN_PASSWORD": "your-real-password"
      }
    }
  }
}
```

Use the **full absolute path** to `src/index.js` (Claude Desktop doesn't resolve relative paths). Credentials go in this config's `env` block rather than relying on `.env` here, since Claude Desktop launches the process itself.

3. Fully quit and reopen Claude Desktop (not just close the window)
4. Start a new conversation — you should see a tools/hammer icon indicating `portfolio-cms` is connected

## Try it

> "This month I built the project detail page, learned about MCP servers, and want to log this as a journey entry."

Claude will use `list_records` to find the real project, then `create_record` to add the journey entry with it linked.

## Tools

| Tool | What it does |
|---|---|
| `list_records` | List records for any entity, with optional search |
| `get_record` | Get one record by id (or month, for journey) |
| `create_record` | Create a record — real schema validation applies, nothing is invented |
| `update_record` | Partial update by id |
| `delete_record` | Delete by id — irreversible |
| `set_article_status` | Publish/unpublish an article (auto-stamps publishedDate) |
| `get_dsa_stats` | DSA totals by difficulty/topic |
| `get_dashboard_summary` | Record counts across all 9 entities, for a quick "what's still empty" check |

## Notes

- **Articles**: `list_records`/`get_record` for articles use the admin-only routes so you (via Claude) can see drafts too — the public site still only ever shows published ones, unaffected by this.
- **Journey**: pass the month string (e.g. `"2026-08"`) as the `id` for get/update/delete — journey entries aren't keyed by a database id.
- Nothing here bypasses your server's real validation. If you ask for something that doesn't fit the schema, you'll get the same error message the admin dashboard would show, not a silently-invented workaround.
