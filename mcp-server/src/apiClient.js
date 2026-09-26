// Thin client for the portfolio's REST API. Logs in once with the admin
// credentials from .env, caches the JWT in memory, and re-authenticates
// automatically if a request comes back 401 (e.g. the token expired).
// This process holds the token in memory only — nothing is written to disk.

const BASE_URL = process.env.API_BASE_URL || 'http://localhost:5000/api';

let cachedToken = null;

async function login() {
  const email = process.env.ADMIN_EMAIL;
  const password = process.env.ADMIN_PASSWORD;

  if (!email || !password) {
    throw new Error('ADMIN_EMAIL and ADMIN_PASSWORD must be set in mcp-server/.env');
  }

  const res = await fetch(`${BASE_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });
  const body = await res.json().catch(() => null);

  if (!res.ok || !body?.success) {
    throw new Error(
      `Login to the portfolio API failed: ${body?.message || res.status}. Check ADMIN_EMAIL/ADMIN_PASSWORD in mcp-server/.env and that the server is running.`
    );
  }

  cachedToken = body.data.token;
  return cachedToken;
}

export async function apiRequest(method, path, body) {
  if (!cachedToken) {
    await login();
  }

  async function doRequest(token) {
    return fetch(`${BASE_URL}${path}`, {
      method,
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: body !== undefined ? JSON.stringify(body) : undefined,
    });
  }

  let res = await doRequest(cachedToken);

  // Token expired or otherwise invalid — log in fresh, try exactly once more.
  if (res.status === 401) {
    const freshToken = await login();
    res = await doRequest(freshToken);
  }

  const responseBody = await res.json().catch(() => null);

  if (!res.ok || !responseBody?.success) {
    const message = responseBody?.message || `Request failed: ${res.status}`;
    const errors = responseBody?.errors;
    throw new Error(errors ? `${message} — ${JSON.stringify(errors)}` : message);
  }

  return responseBody.data;
}
