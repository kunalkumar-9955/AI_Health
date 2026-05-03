import express from 'express';
import User from '../models/User.js';
import Appointment from '../models/Appointment.js';
import Chat from '../models/Chat.js';
import Reminder from '../models/Reminder.js';
import Report from '../models/Report.js';
import RiskAssessment from '../models/RiskAssessment.js';
import MedicineScan from '../models/MedicineScan.js';
import { protect, admin } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/stats', protect, admin, async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalChats = await Chat.countDocuments();
    const totalAppointments = await Appointment.countDocuments();
    const activeReminders = await Reminder.countDocuments();
    
    // Premium Stats
    const totalReports = await Report.countDocuments();
    const totalRiskScans = await RiskAssessment.countDocuments();
    const totalMedicineScans = await MedicineScan.countDocuments();

    res.json({
      totalUsers,
      totalChats,
      totalAppointments,
      activeReminders,
      totalReports,
      totalRiskScans,
      totalMedicineScans
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get('/users', protect, admin, async (req, res) => {
  try {
    const users = await User.find({}).select('-password');
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.delete('/users/:id', protect, admin, async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (user) {
      await user.deleteOne();
      res.json({ message: 'User removed' });
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
