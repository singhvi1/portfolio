import mongoose from 'mongoose';

const technicalChallengeSchema = new mongoose.Schema(
  {
    problem: { type: String, required: true },
    approach: { type: String, required: true },
  },
  { _id: false }
);

const projectSchema = new mongoose.Schema(
  {
    slug: { type: String, required: true, unique: true, trim: true, lowercase: true },
    name: { type: String, required: true, trim: true },
    shortDescription: { type: String, required: true },
    problemSolved: { type: String, default: '' },
    keyFeatures: [{ type: String }],
    techStack: {
      frontend: [String],
      backend: [String],
      services: [String],
      cloud: [String],
      infra: [String],
      tools: [String],
    },
    tags: [{ type: String, index: true }],
    githubUrl: { type: String, default: null },
    liveUrl: { type: String, default: null },
    myRole: { type: String, default: '' },
    technicalChallenges: [technicalChallengeSchema],
    whatILearned: [{ type: String }],
    featured: { type: Boolean, default: false, index: true },
    category: { type: String, default: '' },
    startDate: { type: String, default: null }, // "YYYY-MM"
    completionDate: { type: String, default: null },
    month: { type: String, default: null, index: true },
    isPlaceholder: { type: Boolean, default: false },
    isPortfolioApp: { type: Boolean, default: false }, // true only for this site itself
  },
  { timestamps: true }
);

export default mongoose.model('Project', projectSchema);
