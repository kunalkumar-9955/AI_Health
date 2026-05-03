import express from 'express';
import Appointment from '../models/Appointment.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/', protect, async (req, res) => {
  try {
    const appointments = await Appointment.find({ userId: req.user._id });
    res.json(appointments);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.post('/', protect, async (req, res) => {
  try {
    const { doctorName, date, time, reason } = req.body;
    const appointment = new Appointment({
      userId: req.user._id,
      doctorName,
      date,
      time,
      reason
    });
    const createdAppointment = await appointment.save();
    res.status(201).json(createdAppointment);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
