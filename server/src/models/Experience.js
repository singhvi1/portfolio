import mongoose from 'mongoose';

const EMPLOYMENT_TYPES = ['Full-time', 'Part-time', 'Internship', 'Contract', 'Freelance'];

const experienceSchema = new mongoose.Schema(
  {
    company: { type: String, required: true, trim: true },
    position: { type: String, required: true },
    startDate: { type: String, required: true }, // "YYYY-MM"
    endDate: { type: String, default: null }, // null = current
    location: { type: String, default: '' },
    employmentType: { type: String, enum: EMPLOYMENT_TYPES, default: 'Full-time' },
    description: { type: String, default: '' },
    responsibilities: [{ type: String }],
    technologies: [{ type: String }],
    achievements: [{ type: String }],
    projects: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Project' }],
  },
  { timestamps: true }
);

experienceSchema.statics.EMPLOYMENT_TYPES = EMPLOYMENT_TYPES;

export default mongoose.model('Experience', experienceSchema);
