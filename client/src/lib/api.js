// Thin fetch wrapper for talking to /server. Not wired into any pages yet
// — that's Phase 4+ (admin dashboard, then switching public pages from
// static data to live API data). This file just proves the client can
// reach the server and unwraps the { success, data, message } envelope.

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

async function request(path, options = {}) {
  const token = sessionStorage.getItem('admin_token');
  const res = await fetch(`${API_BASE}${path}`, {
    credentials: 'include', // send the admin cookie when present
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers,
    },
    ...options,
  });

  const body = await res.json().catch(() => null);

  if (!res.ok || !body?.success) {
    const message = body?.message || `Request failed: ${res.status}`;
    const error = new Error(message);
    error.status = res.status;
    error.errors = body?.errors;
    throw error;
  }

  return body.data;
}

export const api = {
  get: (path) => request(path),
  post: (path, data) => request(path, { method: 'POST', body: JSON.stringify(data) }),
  put: (path, data) => request(path, { method: 'PUT', body: JSON.stringify(data) }),
  patch: (path, data) => request(path, { method: 'PATCH', body: JSON.stringify(data) }),
  delete: (path) => request(path, { method: 'DELETE' }),
};

// Quick manual check: api.get('/health').then(console.log)
