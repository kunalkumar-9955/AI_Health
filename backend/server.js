import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import { MongoMemoryServer } from 'mongodb-memory-server';
import authRoutes from './routes/authRoutes.js';
import userRoutes from './routes/userRoutes.js';
import chatRoutes from './routes/chatRoutes.js';
import appointmentRoutes from './routes/appointmentRoutes.js';
import reminderRoutes from './routes/reminderRoutes.js';
import adminRoutes from './routes/adminRoutes.js';
import emergencyRoutes from './routes/emergencyRoutes.js';
import premiumRoutes from './routes/premiumRoutes.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/chat', chatRoutes);
app.use('/api/appointments', appointmentRoutes);
app.use('/api/reminders', reminderRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/emergency', emergencyRoutes);
app.use('/api/premium', premiumRoutes);

app.get('/', (req, res) => {
  res.send('API is running...');
});

const connectDB = async () => {
  try {
    const mongoUri = process.env.MONGO_URI;
    
    await mongoose.connect(mongoUri);
    console.log('Connected to MongoDB Atlas successfully');

    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  } catch (error) {
    console.error('MongoDB connection error:', error);
  }
};

connectDB();
