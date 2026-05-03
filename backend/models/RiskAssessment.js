import mongoose from 'mongoose';

const riskAssessmentSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  parameters: {
    age: Number,
    height: Number,
    weight: Number,
    bp: String,
    sugar: Number,
    smoking: Boolean,
    familyHistory: Boolean,
    activityLevel: { type: String, enum: ['low', 'medium', 'high'] }
  },
  predictions: [{
    disease: String,
    riskLevel: { type: String, enum: ['low', 'medium', 'high'] },
    reasoning: String
  }]
}, { timestamps: true });

export default mongoose.model('RiskAssessment', riskAssessmentSchema);
