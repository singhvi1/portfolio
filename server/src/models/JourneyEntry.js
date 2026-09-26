import mongoose from 'mongoose';

// One document per month. Rather than duplicating data, this entry mostly
// references other collections (projects touched, tech learned that month)
// plus a small amount of month-specific narrative text and counts that
// don't belong anywhere else (e.g. "solved 25 DSA problems").
const journeyEntrySchema = new mongoose.Schema(
  {
    month: { type: String, required: true, unique: true }, // "YYYY-MM"
    title: { type: String, default: '' }, // optional short headline for the month
    summary: { type: String, default: '' },

    projects: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Project' }],
    technologies: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Technology' }],
    achievements: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Achievement' }],
    articles: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Article' }],
    aiExperiments: [{ type: mongoose.Schema.Types.ObjectId, ref: 'AiExperiment' }],

    dsaProblemsSolvedCount: { type: Number, default: 0 },
    coursesCompletedCount: { type: Number, default: 0 },

    highlights: [{ type: String }], // free-text bullet points, e.g. "Learned API Gateway and Apigee"
  },
  { timestamps: true }
);

export default mongoose.model('JourneyEntry', journeyEntrySchema);
