import DsaProblem from '../models/DsaProblem.js';
import { buildCrudController } from './crudFactory.js';
import { ok } from '../utils/apiResponse.js';
import { asyncHandler } from '../utils/asyncHandler.js';

const base = buildCrudController(DsaProblem, {
  searchFields: ['problemName', 'topic', 'notes'],
  filterFields: ['platform', 'difficulty', 'topic'],
  entityName: 'DSA problem',
});

export const { list: listDsaProblems, getOne: getDsaProblem, create: createDsaProblem, update: updateDsaProblem, remove: deleteDsaProblem } = base;

// GET /api/dsa/stats — totals by difficulty and topic, for the progress dashboard
export const dsaStats = asyncHandler(async (req, res) => {
  const [byDifficulty, byTopic, total] = await Promise.all([
    DsaProblem.aggregate([{ $group: { _id: '$difficulty', count: { $sum: 1 } } }]),
    DsaProblem.aggregate([{ $group: { _id: '$topic', count: { $sum: 1 } } }, { $sort: { count: -1 } }]),
    DsaProblem.countDocuments(),
  ]);

  return ok(res, {
    total,
    byDifficulty: Object.fromEntries(byDifficulty.map((d) => [d._id, d.count])),
    byTopic: Object.fromEntries(byTopic.map((t) => [t._id, t.count])),
  });
});
