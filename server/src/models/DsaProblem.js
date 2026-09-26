import mongoose from 'mongoose';

const PLATFORMS = ['LeetCode', 'Codeforces', 'Codewars', 'GeeksforGeeks', 'Other'];
const DIFFICULTY = ['Easy', 'Medium', 'Hard'];

const dsaProblemSchema = new mongoose.Schema(
  {
    problemName: { type: String, required: true, trim: true },
    platform: { type: String, required: true, enum: PLATFORMS },
    problemUrl: { type: String, default: null },
    difficulty: { type: String, required: true, enum: DIFFICULTY, index: true },
    topic: { type: String, required: true, index: true }, // e.g. "Arrays", "DP"
    dateSolved: { type: String, required: true }, // "YYYY-MM-DD"
    approach: { type: String, default: '' },
    timeComplexity: { type: String, default: '' },
    spaceComplexity: { type: String, default: '' },
    javaSolution: { type: String, default: '' },
    notes: { type: String, default: '' },
  },
  { timestamps: true }
);

dsaProblemSchema.statics.PLATFORMS = PLATFORMS;
dsaProblemSchema.statics.DIFFICULTY = DIFFICULTY;

export default mongoose.model('DsaProblem', dsaProblemSchema);
