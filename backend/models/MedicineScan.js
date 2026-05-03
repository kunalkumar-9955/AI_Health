import mongoose from 'mongoose';

const medicineScanSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  imageUrl: { type: String, required: true },
  extractedText: { type: String },
  aiAnalysis: {
    medicineName: String,
    commonUse: String,
    suggestedTiming: String,
    safetyNote: String
  }
}, { timestamps: true });

export default mongoose.model('MedicineScan', medicineScanSchema);
