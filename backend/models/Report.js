import mongoose from 'mongoose';

const reportSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  familyMemberId: { type: String }, // optional, if belonging to a family member
  type: { type: String, enum: ['blood', 'prescription', 'lab', 'other'] },
  fileUrl: { type: String, required: true },
  extractedText: { type: String },
  aiAnalysis: {
    summary: String,
    criticalValues: [String],
    advice: String
  }
}, { timestamps: true });

export default mongoose.model('Report', reportSchema);
