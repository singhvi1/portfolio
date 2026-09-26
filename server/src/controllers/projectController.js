import Project from '../models/Project.js';
import { buildCrudController } from './crudFactory.js';
import { ApiError } from '../utils/ApiError.js';
import { ok } from '../utils/apiResponse.js';
import { asyncHandler } from '../utils/asyncHandler.js';

const base = buildCrudController(Project, {
  searchFields: ['name', 'shortDescription', 'tags'],
  filterFields: ['category', 'featured', 'isPlaceholder'],
  entityName: 'Project',
});

export const listProjects = base.list;
export const getProject = base.getOne;
export const createProject = base.create;
export const updateProject = base.update;
export const deleteProject = base.remove;

// GET /api/projects/featured — used by the homepage
export const listFeaturedProjects = asyncHandler(async (req, res) => {
  const items = await Project.find({ featured: true, isPortfolioApp: { $ne: true } }).sort({
    createdAt: -1,
  });
  return ok(res, items);
});

// GET /api/projects/slug/:slug — used by the public project detail page.
// The public site links to projects by slug, not Mongo _id, so this is the
// actual lookup the detail page needs; :id (ObjectId) alone isn't enough.
export const getProjectBySlug = asyncHandler(async (req, res) => {
  const project = await Project.findOne({ slug: req.params.slug });
  if (!project) throw new ApiError(404, 'Project not found');
  return ok(res, project);
});
