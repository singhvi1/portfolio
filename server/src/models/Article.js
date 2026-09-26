import mongoose from 'mongoose';

const articleSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, trim: true, lowercase: true },
    shortDescription: { type: String, required: true },
    content: { type: String, required: true }, // Markdown
    coverImage: { type: String, default: null },
    tags: [{ type: String, index: true }],
    technologies: [{ type: String }],
    publishedDate: { type: String, default: null },
    readingTimeMinutes: { type: Number, default: null },
    referenceLinks: [{ type: String }],
    status: { type: String, enum: ['draft', 'published'], default: 'draft', index: true },
  },
  { timestamps: true }
);

export default mongoose.model('Article', articleSchema);
