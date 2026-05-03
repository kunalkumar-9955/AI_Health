import mongoose from 'mongoose';
import bcrypt from 'bcrypt';

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  age: { type: Number },
  gender: { type: String },
  history: { type: String },
  allergies: { type: String },
  emergencyContacts: [{
    name: String,
    phone: String,
    email: String
  }],
  modes: {
    ruralMode: { type: Boolean, default: false },
    seniorMode: { type: Boolean, default: false },
    womenHealthMode: { type: Boolean, default: false }
  },
  familyProfiles: [{
    name: String,
    relation: String,
    age: Number,
    history: String
  }],
  role: { type: String, enum: ['user', 'admin'], default: 'user' }
}, { timestamps: true });

userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

export default mongoose.model('User', userSchema);
