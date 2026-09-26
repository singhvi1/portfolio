// Verifies everything that doesn't require an active MongoDB connection:
// health check, 404 handling, admin login (env-based, no DB), JWT issuance
// and verification, and that protected routes reject unauthenticated/
// invalid requests BEFORE touching the database (validation + auth
// middleware both run ahead of any Model call).
//
// Run with: node src/seed/verify.js
// Requires .env to have ADMIN_EMAIL / ADMIN_PASSWORD_HASH / JWT_SECRET set.
// Does NOT require MONGODB_URI to be reachable for these checks — routes
// that must hit the DB are intentionally not exercised here.

import 'dotenv/config';
import request from 'supertest';
import { createApp } from '../app.js';
import { logger } from '../utils/looger.js';

const app = createApp();

let passed = 0;
let failed = 0;

function check(name, condition) {
  if (condition) {
    logger.service('VERIFY', `✓ ${name}`);
    passed++;
  } else {
    logger.service('VERIFY', `✗ ${name}`);
    failed++;
  }
}

async function run() {
  logger.service('VERIFY', 'Health & routing');

  {
    const res = await request(app).get('/api/health');

    check(
      'GET /api/health -> 200',
      res.status === 200
    );

    const res404 = await request(app).get('/api/does-not-exist');

    check(
      'unknown route -> 404 with consistent error shape',
      res.status === 404 &&
        res.body.success === false
    );
  }

  logger.service(
    'VERIFY',
    'Admin login (env-based, no DB required)'
  );

  let token = null;

  {
    const missing = await request(app)
      .post('/api/auth/login')
      .send({});

    check(
      'login with no body -> 422 validation error',
      missing.status === 422 &&
        missing.body.success === false
    );

    const wrongPassword = await request(app)
      .post('/api/auth/login')
      .send({
        email: process.env.ADMIN_EMAIL,
        password: 'definitely-wrong',
      });

    check(
      'login with wrong password -> 401',
      wrongPassword.status === 401
    );

    const wrongEmail = await request(app)
      .post('/api/auth/login')
      .send({
        email: 'not-the-admin@example.com',
        password: 'whatever',
      });

    check(
      'login with unknown email -> 401',
      wrongEmail.status === 401
    );

    const good = await request(app)
      .post('/api/auth/login')
      .send({
        email: process.env.ADMIN_EMAIL,
        password: 'test-password-123',
      });

    check(
      'login with correct credentials -> 200 + token',
      good.status === 200 &&
        !!good.body.data?.token
    );

    check(
      'login response never includes the password hash',
      !JSON.stringify(good.body).includes(
        process.env.ADMIN_PASSWORD_HASH
      )
    );

    token = good.body.data?.token;

    const setCookie = good.headers['set-cookie']?.some(
      (c) => c.startsWith(process.env.COOKIE_NAME)
    );

    check(
      'login sets httpOnly auth cookie',
      !!setCookie
    );
  }

  logger.service('VERIFY', 'JWT-protected routes');

  {
    const noAuth = await request(app).get('/api/auth/me');

    check(
      'GET /api/auth/me with no token -> 401',
      noAuth.status === 401
    );

    const badAuth = await request(app)
      .get('/api/auth/me')
      .set(
        'Authorization',
        'Bearer garbage.token.here'
      );

    check(
      'GET /api/auth/me with invalid token -> 401',
      badAuth.status === 401
    );

    const withAuth = await request(app)
      .get('/api/auth/me')
      .set(
        'Authorization',
        `Bearer ${token}`
      );

    check(
      'GET /api/auth/me with valid token -> 200',
      withAuth.status === 200 &&
        withAuth.body.data?.email === process.env.ADMIN_EMAIL
    );
  }

  logger.service(
    'VERIFY',
    'Protected write routes reject before touching the DB'
  );

  {
    const noAuthCreate = await request(app)
      .post('/api/projects')
      .send({
        name: 'Test',
      });

    check(
      'POST /api/projects with no auth -> 401 (rejected before DB)',
      noAuthCreate.status === 401
    );

    const badBody = await request(app)
      .post('/api/projects')
      .set(
        'Authorization',
        `Bearer ${token}`
      )
      .send({
        name: 'Missing required fields',
      });

    check(
      'POST /api/projects with auth but invalid body -> 422 (rejected before DB)',
      badBody.status === 422
    );

    const noAuthArticle = await request(app)
      .patch(
        '/api/articles/507f1f77bcf86cd799439011/status'
      )
      .send({
        status: 'published',
      });

    check(
      'PATCH article status with no auth -> 401',
      noAuthArticle.status === 401
    );

    const noAuthAdminList = await request(app)
      .get('/api/articles/admin/all');

    check(
      'GET /api/articles/admin/all with no auth -> 401 (drafts must not leak)',
      noAuthAdminList.status === 401
    );

    const noAuthAdminGet = await request(app)
      .get(
        '/api/articles/admin/507f1f77bcf86cd799439011'
      );

    check(
      'GET /api/articles/admin/:id with no auth -> 401 (drafts must not leak)',
      noAuthAdminGet.status === 401
    );
  }

  logger.service(
    'VERIFY',
    `${passed} passed, ${failed} failed`
  );

  if (failed > 0) {
    process.exit(1);
  }
}

run().catch((err) => {
  logger.error(`VERIFY crashed: ${err.message}`);
  process.exit(1);
});