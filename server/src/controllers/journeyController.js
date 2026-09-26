import JourneyEntry from '../models/JourneyEntry.js';
import { ApiError } from '../utils/ApiError.js';
import { ok, created } from '../utils/apiResponse.js';
import { asyncHandler } from '../utils/asyncHandler.js';

const POPULATE = [
  { path: 'projects', select: 'name slug tags' },
  { path: 'technologies', select: 'name category proficiency' },
  { path: 'achievements', select: 'title category date' },
  { path: 'articles', select: 'title slug status' },
  { path: 'aiExperiments', select: 'name modelUsed' },
];

export const listJourneyEntries = asyncHandler(async (req, res) => {
  const entries = await JourneyEntry.find().sort({ month: -1 }).populate(POPULATE);
  return ok(res, entries);
});

export const getJourneyEntry = asyncHandler(async (req, res) => {
  const entry = await JourneyEntry.findOne({ month: req.params.month }).populate(POPULATE);
  if (!entry) throw new ApiError(404, 'Journey entry not found for that month');
  return ok(res, entry);
});

export const createJourneyEntry = asyncHandler(async (req, res) => {
  const entry = await JourneyEntry.create(req.body);
  return created(res, entry);
});

export const updateJourneyEntry = asyncHandler(async (req, res) => {
  const entry = await JourneyEntry.findOneAndUpdate({ month: req.params.month }, req.body, {
    new: true,
    runValidators: true,
  }).populate(POPULATE);
  if (!entry) throw new ApiError(404, 'Journey entry not found for that month');
  return ok(res, entry, 'Journey entry updated');
});

export const deleteJourneyEntry = asyncHandler(async (req, res) => {
  const entry = await JourneyEntry.findOneAndDelete({ month: req.params.month });
  if (!entry) throw new ApiError(404, 'Journey entry not found for that month');
  return ok(res, null, 'Journey entry deleted');
});
