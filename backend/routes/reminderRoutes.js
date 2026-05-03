import express from 'express';
import Reminder from '../models/Reminder.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/', protect, async (req, res) => {
  try {
    const reminders = await Reminder.find({ userId: req.user._id });
    res.json(reminders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.post('/', protect, async (req, res) => {
  try {
    const { medicine, time, dose, repeatDaily } = req.body;
    const reminder = new Reminder({
      userId: req.user._id,
      medicine,
      time,
      dose,
      repeatDaily
    });
    const createdReminder = await reminder.save();
    res.status(201).json(createdReminder);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.delete('/:id', protect, async (req, res) => {
  try {
    const reminder = await Reminder.findById(req.params.id);
    if (reminder && reminder.userId.toString() === req.user._id.toString()) {
      await reminder.deleteOne();
      res.json({ message: 'Reminder removed' });
    } else {
      res.status(404).json({ message: 'Reminder not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
