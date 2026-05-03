import mongoose from 'mongoose';

const habitStreakSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  date: { type: Date, required: true },
  tasks: {
    waterDrank: { type: Boolean, default: false },
    stepsWalked: { type: Boolean, default: false },
    sleepGoal: { type: Boolean, default: false },
    medicineTaken: { type: Boolean, default: false }
  },
  xpEarned: { type: Number, default: 0 }
}, { timestamps: true });

export default mongoose.model('HabitStreak', habitStreakSchema);
