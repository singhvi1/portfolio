import { ApiError } from '../utils/ApiError.js';
import { ok, created } from '../utils/apiResponse.js';
import { asyncHandler } from '../utils/asyncHandler.js';

/**
 * Builds standard list/get/create/update/remove handlers for a Mongoose
 * model. Entity-specific controllers wrap this and add whatever extra
 * behaviour they need (e.g. Article's publish/unpublish, Project's
 * featured-only query).
 *
 * @param {import('mongoose').Model} Model
 * @param {object} opts
 * @param {string[]} opts.searchFields - fields checked with a case-insensitive
 *   regex when a `search` query param is present
 * @param {string[]} opts.filterFields - query params that map directly to an
 *   exact-match filter (e.g. ?difficulty=Easy)
 * @param {string} opts.entityName - used in not-found messages
 */
export function buildCrudController(Model, { searchFields = [], filterFields = [], entityName = 'Item' } = {}) {
  const list = asyncHandler(async (req, res) => {
    const { page = 1, limit = 20, search } = req.query;
    const query = {};

    for (const field of filterFields) {
      if (req.query[field] !== undefined) {
        query[field] = req.query[field];
      }
    }

    if (search && searchFields.length > 0) {
      query.$or = searchFields.map((field) => ({
        [field]: { $regex: search, $options: 'i' },
      }));
    }

    const pageNum = Math.max(1, parseInt(page, 10) || 1);
    const limitNum = Math.min(100, Math.max(1, parseInt(limit, 10) || 20));

    const [items, total] = await Promise.all([
      Model.find(query)
        .sort({ createdAt: -1 })
        .skip((pageNum - 1) * limitNum)
        .limit(limitNum),
      Model.countDocuments(query),
    ]);

    return ok(res, {
      items,
      pagination: {
        page: pageNum,
        limit: limitNum,
        total,
        totalPages: Math.ceil(total / limitNum),
      },
    });
  });

  const getOne = asyncHandler(async (req, res) => {
    const item = await Model.findById(req.params.id);
    if (!item) throw new ApiError(404, `${entityName} not found`);
    return ok(res, item);
  });

  const create = asyncHandler(async (req, res) => {
    const item = await Model.create(req.body);
    return created(res, item);
  });

  const update = asyncHandler(async (req, res) => {
    const item = await Model.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!item) throw new ApiError(404, `${entityName} not found`);
    return ok(res, item, `${entityName} updated`);
  });

  const remove = asyncHandler(async (req, res) => {
    const item = await Model.findByIdAndDelete(req.params.id);
    if (!item) throw new ApiError(404, `${entityName} not found`);
    return ok(res, null, `${entityName} deleted`);
  });

  return { list, getOne, create, update, remove };
}
