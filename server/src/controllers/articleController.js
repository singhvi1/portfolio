import Article from '../models/Article.js';
import { ApiError } from '../utils/ApiError.js';
import { ok, created } from '../utils/apiResponse.js';
import { asyncHandler } from '../utils/asyncHandler.js';

// Public: only published articles, unless the request is authenticated
// as admin (checked via req.admin, set by an optional-auth pass upstream —
// for simplicity here, public routes just never see drafts).
export const listArticles = asyncHandler(async (req, res) => {
  const { page = 1, limit = 20, search, tag } = req.query;
  const query = { status: 'published' };

  if (tag) query.tags = tag;
  if (search) {
    query.$or = [
      { title: { $regex: search, $options: 'i' } },
      { shortDescription: { $regex: search, $options: 'i' } },
    ];
  }

  const pageNum = Math.max(1, parseInt(page, 10) || 1);
  const limitNum = Math.min(100, Math.max(1, parseInt(limit, 10) || 20));

  const [items, total] = await Promise.all([
    Article.find(query)
      .select('-content') // list view doesn't need full markdown body
      .sort({ publishedDate: -1 })
      .skip((pageNum - 1) * limitNum)
      .limit(limitNum),
    Article.countDocuments(query),
  ]);

  return ok(res, { items, pagination: { page: pageNum, limit: limitNum, total, totalPages: Math.ceil(total / limitNum) } });
});

export const getArticleBySlug = asyncHandler(async (req, res) => {
  const article = await Article.findOne({ slug: req.params.slug, status: 'published' });
  if (!article) throw new ApiError(404, 'Article not found');
  return ok(res, article);
});

// Admin: sees everything including drafts
export const listAllArticlesAdmin = asyncHandler(async (req, res) => {
  const items = await Article.find().sort({ createdAt: -1 });
  return ok(res, items);
});

export const getArticleAdmin = asyncHandler(async (req, res) => {
  const article = await Article.findById(req.params.id);
  if (!article) throw new ApiError(404, 'Article not found');
  return ok(res, article);
});

export const createArticle = asyncHandler(async (req, res) => {
  const article = await Article.create(req.body);
  return created(res, article);
});

export const updateArticle = asyncHandler(async (req, res) => {
  const article = await Article.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
  if (!article) throw new ApiError(404, 'Article not found');
  return ok(res, article, 'Article updated');
});

export const deleteArticle = asyncHandler(async (req, res) => {
  const article = await Article.findByIdAndDelete(req.params.id);
  if (!article) throw new ApiError(404, 'Article not found');
  return ok(res, null, 'Article deleted');
});

export const setArticleStatus = asyncHandler(async (req, res) => {
  const { status } = req.body; // 'draft' | 'published'
  if (!['draft', 'published'].includes(status)) {
    throw new ApiError(400, 'status must be "draft" or "published"');
  }
  const update = { status };
  if (status === 'published') update.publishedDate = new Date().toISOString().slice(0, 10);

  const article = await Article.findByIdAndUpdate(req.params.id, update, { new: true });
  if (!article) throw new ApiError(404, 'Article not found');
  return ok(res, article, `Article ${status === 'published' ? 'published' : 'unpublished'}`);
});
