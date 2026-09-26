import mongoose from 'mongoose';

const STATUS = ['Not Started', 'In Progress', 'Completed'];

const courseSchema = new mongoose.Schema(
  {
    courseName: { type: String, required: true, trim: true },
    platform: { type: String, required: true },
    instructor: { type: String, default: '' },
    url: { type: String, default: null },
    startDate: { type: String, default: null },
    completionDate: { type: String, default: null },
    progress: { type: Number, min: 0, max: 100, default: 0 },
    certificateUrl: { type: String, default: null },
    technologies: [{ type: String }],
    notes: { type: String, default: '' },
    status: { type: String, required: true, enum: STATUS, default: 'Not Started', index: true },
  },
  { timestamps: true }
);

courseSchema.statics.STATUS = STATUS;

export default mongoose.model('Course', courseSchema);
