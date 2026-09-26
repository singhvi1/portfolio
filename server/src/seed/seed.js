// Seeds the database from the SAME data files the client currently reads
// statically (src/data/projects/*.js in /client). This file imports them
// directly rather than re-typing the data, so there is exactly one source
// of truth for your real project info until the client is switched over
// to fetch from the API in a later phase.
//
// Only Projects are seeded here. Technologies/DSA/Courses/Achievements/
// Experience/Articles/AI Experiments/Journey entries have no verified
// source data yet (client's skills.js, for example, is missing fields
// the Technology schema requires, like monthLearned) — seeding those with
// invented values would violate "don't invent project information."
// Add real entries for those through the admin dashboard (Phase 4) once
// you have the data.

import 'dotenv/config';
import mongoose from 'mongoose';
import { connectDB } from '../config/db.js';
import Project from '../models/Project.js';
import { projects as clientProjects, devPortfolio } from '../../../client/src/data/projects/index.js';

function toProjectDoc(p) {
  return {
    slug: p.id,
    name: p.name,
    shortDescription: p.shortDescription,
    problemSolved: p.problemSolved || '',
    keyFeatures: p.keyFeatures || [],
    techStack: p.techStack || {},
    tags: p.tags || [],
    githubUrl: p.githubUrl || null,
    liveUrl: p.liveUrl || null,
    myRole: p.myRole || '',
    technicalChallenges: p.technicalChallenges || [],
    whatILearned: p.whatILearned || [],
    featured: !!p.featured,
    category: p.category || '',
    startDate: p.startDate || null,
    completionDate: p.completionDate || null,
    month: p.month || null,
    isPlaceholder: !!p.isPlaceholder,
    isPortfolioApp: !!p.isPortfolioApp,
  };
}

async function seed() {
  await connectDB();

  const allSourceProjects = [...clientProjects, devPortfolio];
  const docs = allSourceProjects.map(toProjectDoc);

  console.log(`[seed] Upserting ${docs.length} projects (by slug)...`);

  for (const doc of docs) {
    await Project.findOneAndUpdate({ slug: doc.slug }, doc, { upsert: true, new: true, runValidators: true });
    console.log(`  - ${doc.slug} ${doc.isPlaceholder ? '(placeholder)' : ''}`);
  }

  console.log('[seed] Done.');
  await mongoose.connection.close();
  process.exit(0);
}

seed().catch((err) => {
  console.error('[seed] Failed:', err);
  process.exit(1);
});
