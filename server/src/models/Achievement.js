import mongoose from 'mongoose';

const CATEGORIES = [
  'Certification',
  'Hackathon',
  'Award',
  'Competitive Programming',
  'Project Milestone',
  'Work Achievement',
  'Career Milestone',
];

const achievementSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String, default: '' },
    date: { type: String, required: true }, // "YYYY-MM-DD"
    organization: { type: String, default: '' },
    url: { type: String, default: null },
    imageUrl: { type: String, default: null },
    category: { type: String, required: true, enum: CATEGORIES, index: true },
  },
  { timestamps: true }
);

achievementSchema.statics.CATEGORIES = CATEGORIES;

export default mongoose.model('Achievement', achievementSchema);
