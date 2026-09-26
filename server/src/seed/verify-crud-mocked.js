// Verifies Project CRUD and Article draft/publish behavior at the
// request/response/controller level by substituting the Mongoose model's
// static methods with an in-memory fake store. This is NOT a substitute
// for testing against real MongoDB — it proves the routing, validation,
// auth gating, and controller logic are wired correctly, but cannot catch
// real MongoDB-specific issues (index/unique constraint enforcement,
// actual query behavior, connection handling under load, etc).
//
// Run with: node src/seed/verify-crud-mocked.js

import 'dotenv/config';
import request from 'supertest';
import mongoose from 'mongoose';
import Project from '../models/Project.js';
import Article from '../models/Article.js';
import { createApp } from '../app.js';

function makeInMemoryModel(Model, seed = [], defaults = {}) {
  let store = seed.map((doc) => ({ ...doc, _id: new mongoose.Types.ObjectId().toString() }));

  Model.find = (query = {}) => {
    let results = store;
    if (query.status) results = results.filter((d) => d.status === query.status);
    if (query.featured !== undefined) results = results.filter((d) => d.featured === query.featured);
    const chain = {
      sort: () => chain,
      skip: () => chain,
      limit: () => chain,
      select: () => chain,
      populate: () => chain,
      then: (resolve) => resolve(results),
      exec: async () => results,
      [Symbol.iterator]: () => results[Symbol.iterator](),
    };
    // Make it awaitable and array-like enough for controllers that do `await Model.find(...)`
    return Object.assign(Promise.resolve(results), chain);
  };
  Model.countDocuments = async (query = {}) => {
    let results = store;
    if (query.status) results = results.filter((d) => d.status === query.status);
    return results.length;
  };
  Model.findById = async (id) => store.find((d) => d._id === id) || null;
  Model.findOne = async (query) => {
    const key = Object.keys(query)[0];
    return store.find((d) => d[key] === query[key]) || null;
  };
  Model.create = async (data) => {
    // Mirrors Mongoose applying schema defaults (e.g. Article.status: 'draft')
    // since this in-memory store bypasses the real schema entirely.
    const doc = { ...defaults, ...data, _id: new mongoose.Types.ObjectId().toString(), createdAt: new Date().toISOString() };
    store.push(doc);
    return doc;
  };
  Model.findByIdAndUpdate = async (id, update) => {
    const idx = store.findIndex((d) => d._id === id);
    if (idx === -1) return null;
    store[idx] = { ...store[idx], ...update };
    return store[idx];
  };
  Model.findByIdAndDelete = async (id) => {
    const idx = store.findIndex((d) => d._id === id);
    if (idx === -1) return null;
    const [removed] = store.splice(idx, 1);
    return removed;
  };

  return {
    getStore: () => store,
  };
}

const app = createApp();
let passed = 0;
let failed = 0;
function check(name, condition) {
  if (condition) {
    console.log(`  ✓ ${name}`);
    passed++;
  } else {
    console.log(`  ✗ ${name}`);
    failed++;
  }
}

async function getAdminToken() {
  const res = await request(app).post('/api/auth/login').send({
    email: process.env.ADMIN_EMAIL,
    password: 'test-password-123',
  });
  return res.body.data.token;
}

async function run() {
  const token = await getAdminToken();
  const auth = { Authorization: `Bearer ${token}` };

  console.log('\n[verify-crud] Project CRUD (mocked model, no real MongoDB)');
  makeInMemoryModel(Project);
  {
    const create = await request(app)
      .post('/api/projects')
      .set(auth)
      .send({ slug: 'mock-project', name: 'Mock Project', shortDescription: 'A test project for CRUD verification' });
    check('POST /api/projects creates and returns the project', create.status === 201 && create.body.data.name === 'Mock Project');
    const id = create.body.data._id;

    const list = await request(app).get('/api/projects');
    check('GET /api/projects lists it', list.status === 200 && list.body.data.items.some((p) => p._id === id));

    const getOne = await request(app).get(`/api/projects/${id}`);
    check('GET /api/projects/:id returns it', getOne.status === 200 && getOne.body.data.name === 'Mock Project');

    const getBySlug = await request(app).get('/api/projects/slug/mock-project');
    check('GET /api/projects/slug/:slug returns it', getBySlug.status === 200 && getBySlug.body.data.slug === 'mock-project');

    const getBySlugMissing = await request(app).get('/api/projects/slug/does-not-exist');
    check('GET /api/projects/slug/:slug for unknown slug -> 404', getBySlugMissing.status === 404);

    const update = await request(app).put(`/api/projects/${id}`).set(auth).send({ name: 'Mock Project (edited)' });
    check('PUT /api/projects/:id updates it', update.status === 200 && update.body.data.name === 'Mock Project (edited)');

    const del = await request(app).delete(`/api/projects/${id}`).set(auth);
    check('DELETE /api/projects/:id removes it', del.status === 200);

    const getAfterDelete = await request(app).get(`/api/projects/${id}`);
    check('GET after delete -> 404', getAfterDelete.status === 404);
  }

  console.log('\n[verify-crud] Article draft/publish behavior (mocked model)');
  makeInMemoryModel(Article, [], { status: 'draft' });
  {
    const create = await request(app)
      .post('/api/articles')
      .set(auth)
      .send({ title: 'Mock Article', slug: 'mock-article', shortDescription: 'desc', content: 'body text' });
    check('New article defaults to draft', create.status === 201 && create.body.data.status === 'draft');
    const id = create.body.data._id;

    const publicListBeforePublish = await request(app).get('/api/articles');
    check(
      'Public list does NOT include the unpublished draft',
      publicListBeforePublish.status === 200 && !publicListBeforePublish.body.data.items.some((a) => a._id === id)
    );

    const adminList = await request(app).get('/api/articles/admin/all').set(auth);
    check('Admin list DOES include the draft', adminList.status === 200 && adminList.body.data.some((a) => a._id === id));

    const publish = await request(app).patch(`/api/articles/${id}/status`).set(auth).send({ status: 'published' });
    check('PATCH .../status publishes it and stamps publishedDate', publish.status === 200 && publish.body.data.status === 'published' && !!publish.body.data.publishedDate);

    const publicListAfterPublish = await request(app).get('/api/articles');
    check(
      'Public list DOES include it once published',
      publicListAfterPublish.status === 200 && publicListAfterPublish.body.data.items.some((a) => a._id === id)
    );
  }

  console.log(`\n[verify-crud] ${passed} passed, ${failed} failed\n`);
  if (failed > 0) process.exit(1);
}

run().catch((err) => {
  console.error('[verify-crud] Crashed:', err);
  process.exit(1);
});
