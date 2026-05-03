import mongoose from 'mongoose';

const reminderSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  medicine: { type: String, required: true },
  time: { type: String, required: true },
  dose: { type: String },
  repeatDaily: { type: Boolean, default: false },
}, { timestamps: true });

export default mongoose.model('Reminder', reminderSchema);
