import { Router } from 'express';
import authRoutes from './authRoutes.js';
import projectRoutes from './projectRoutes.js';
import technologyRoutes from './technologyRoutes.js';
import dsaRoutes from './dsaRoutes.js';
import courseRoutes from './courseRoutes.js';
import achievementRoutes from './achievementRoutes.js';
import experienceRoutes from './experienceRoutes.js';
import articleRoutes from './articleRoutes.js';
import aiExperimentRoutes from './aiExperimentRoutes.js';
import journeyRoutes from './journeyRoutes.js';

const router = Router();

router.get('/health', (req, res) => res.json({ success: true, message: 'API is up' }));

router.use('/auth', authRoutes);
router.use('/projects', projectRoutes);
router.use('/technologies', technologyRoutes);
router.use('/dsa', dsaRoutes);
router.use('/courses', courseRoutes);
router.use('/achievements', achievementRoutes);
router.use('/experience', experienceRoutes);
router.use('/articles', articleRoutes);
router.use('/ai-experiments', aiExperimentRoutes);
router.use('/journey', journeyRoutes);

export default router;
