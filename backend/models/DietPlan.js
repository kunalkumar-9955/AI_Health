import mongoose from 'mongoose';

const dietPlanSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  goals: {
    targetWeight: Number,
    goalType: { type: String, enum: ['lose', 'gain', 'maintain'] },
    preference: { type: String, enum: ['veg', 'non-veg', 'vegan'] },
    cuisine: { type: String, default: 'Indian' }
  },
  meals: {
    breakfast: String,
    lunch: String,
    dinner: String,
    snacks: String
  },
  dailyWaterTarget: Number, // in ml
  caloriesTarget: Number
}, { timestamps: true });

export default mongoose.model('DietPlan', dietPlanSchema);
