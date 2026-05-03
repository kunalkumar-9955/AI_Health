import mongoose from 'mongoose';

const moodLogSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  score: { type: Number, min: 1, max: 10, required: true }, // 1-10 scale
  sentiment: { type: String, enum: ['happy', 'neutral', 'stressed', 'anxious', 'sad'] },
  notes: { type: String },
  aiSuggestion: { type: String }
}, { timestamps: true });

export default mongoose.model('MoodLog', moodLogSchema);
