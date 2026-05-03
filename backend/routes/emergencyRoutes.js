import express from 'express';
import { protect } from '../middleware/authMiddleware.js';
import User from '../models/User.js';
import nodemailer from 'nodemailer';

const router = express.Router();

// Get user's emergency contacts
router.get('/contacts', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    res.json(user.emergencyContacts || []);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Add an emergency contact
router.post('/contacts', protect, async (req, res) => {
  try {
    const { name, phone, email } = req.body;
    const user = await User.findById(req.user._id);
    user.emergencyContacts.push({ name, phone, email });
    await user.save();
    res.status(201).json(user.emergencyContacts);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Delete an emergency contact
router.delete('/contacts/:id', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    user.emergencyContacts = user.emergencyContacts.filter(c => c._id.toString() !== req.params.id);
    await user.save();
    res.json(user.emergencyContacts);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Send SOS Email
router.post('/sos', protect, async (req, res) => {
  try {
    const { lat, lng } = req.body;
    const user = await User.findById(req.user._id);

    if (!user.emergencyContacts || user.emergencyContacts.length === 0) {
      return res.status(400).json({ message: "No emergency contacts found to send SOS." });
    }

    const mapLink = lat && lng ? `https://www.google.com/maps/search/?api=1&query=${lat},${lng}` : 'Location not provided.';

    // Initialize transporter (using a mocked service or user's provided credentials if available)
    // For demo purposes, we will mock the send or use Ethereal if no auth provided
    // To make this fully functional, the user needs to add EMAIL_USER and EMAIL_PASS to .env
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER || 'demo@gmail.com',
        pass: process.env.EMAIL_PASS || 'demo123'
      }
    });

    const emailList = user.emergencyContacts.map(c => c.email).filter(e => e);

    if (emailList.length > 0) {
      const mailOptions = {
        from: `"AI Health Emergency" <${process.env.EMAIL_USER}>`,
        to: emailList.join(','),
        subject: `🚨 EMERGENCY SOS ALERT from ${user.name}`,
        text: `This is an Emergency SOS Alert triggered by ${user.name}.\n\nCurrent Location: ${mapLink}\n\nPlease check on them immediately!`
      };

      if (process.env.EMAIL_USER && process.env.EMAIL_PASS) {
        await transporter.sendMail(mailOptions);
      } else {
        console.log("Mocking SOS Email Send since EMAIL_USER/EMAIL_PASS not configured in .env");
        console.log(mailOptions);
      }
    }

    res.status(200).json({ message: "SOS Alert processed successfully." });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
