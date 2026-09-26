import mongoose from 'mongoose';

const aiExperimentSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    description: { type: String, required: true },
    problem: { type: String, default: '' },
    approach: { type: String, default: '' },
    modelUsed: { type: String, default: '' }, // e.g. "GPT-4o", "Gemini 2.5 Flash", "local Llama"
    technologies: [{ type: String }],
    architecture: { type: String, default: '' },
    results: { type: String, default: '' },
    githubUrl: { type: String, default: null },
    demoUrl: { type: String, default: null },
    date: { type: String, required: true }, // "YYYY-MM"
    whatILearned: [{ type: String }],
  },
  { timestamps: true }
);

export default mongoose.model('AiExperiment', aiExperimentSchema);
