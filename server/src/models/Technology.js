import mongoose from 'mongoose';

const CATEGORIES = [
  'Programming Languages',
  'Frontend',
  'Backend',
  'Databases',
  'Cloud',
  'DevOps',
  'APIs',
  'AI / ML',
  'Tools',
  'System Design',
];

const PROFICIENCY = ['Beginner', 'Intermediate', 'Advanced'];

const technologySchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    category: { type: String, required: true, enum: CATEGORIES, index: true },
    proficiency: { type: String, required: true, enum: PROFICIENCY },
    monthLearned: { type: String, required: true }, // "YYYY-MM"
    relatedProjects: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Project' }],
    notes: { type: String, default: '' },
    logoUrl: { type: String, default: null },
  },
  { timestamps: true }
);

technologySchema.statics.CATEGORIES = CATEGORIES;
technologySchema.statics.PROFICIENCY = PROFICIENCY;

export default mongoose.model('Technology', technologySchema);
