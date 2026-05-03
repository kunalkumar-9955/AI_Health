import express from 'express';
import Chat from '../models/Chat.js';
import { protect } from '../middleware/authMiddleware.js';
import { GoogleGenerativeAI } from '@google/generative-ai';
import dotenv from 'dotenv';
dotenv.config();

const router = express.Router();

router.get('/', protect, async (req, res) => {
  try {
    const chats = await Chat.find({ userId: req.user._id }).sort({ createdAt: 1 });
    res.json(chats);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.post('/', protect, async (req, res) => {
  try {
    const { message } = req.body;
    let responseText = "I am an AI Healthcare Bot. How can I assist you today?";

    // 1. Check if Gemini API key exists
    if (process.env.GEMINI_API_KEY && process.env.GEMINI_API_KEY !== 'your_api_key_here') {
      try {
        const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
        const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

        const prompt = `You are an advanced, professional AI Healthcare Assistant.
Your tone must be highly professional, empathetic, clinical, yet easily understandable. 
Use a structured format (e.g., bullet points if necessary) to provide clear and actionable advice.

User Query: "${message}"

Instructions:
1. Provide a concise, helpful, and scientifically accurate response.
2. Maintain a warm, reassuring, and extremely professional medical demeanor.
3. If applicable, suggest general wellness tips or basic home care.
4. IMPORTANT DISCLAIMER: End your response with a clear but polite disclaimer stating that you are an AI and not a substitute for a licensed medical professional, especially advising them to see a doctor if symptoms persist or are severe.`;

        const result = await model.generateContent(prompt);
        const response = await result.response;
        responseText = response.text();
      } catch (aiError) {
        console.error("Gemini API Error:", aiError.message);
        
        // Fallback to Mock Logic if API key fails
        const lowerMessage = message.toLowerCase();
        let fallbackText = "";
        if (lowerMessage.includes("symptom") || lowerMessage.includes("fever") || lowerMessage.includes("headache")) {
          fallbackText = "Based on your symptoms, please make sure to rest and stay hydrated. If symptoms persist for more than 2 days or become severe, please consult a doctor. Disclaimer: I am an AI, not a doctor.";
        } else if (lowerMessage.includes("emergency") || lowerMessage.includes("chest pain") || lowerMessage.includes("breathing") || lowerMessage.includes("unconscious")) {
          fallbackText = "Please seek immediate medical attention or call emergency services right away!";
        } else if (lowerMessage.includes("stress") || lowerMessage.includes("motivation")) {
          fallbackText = "Take a deep breath. It's important to manage stress. Try to practice mindfulness, take short breaks, and get enough sleep. You are doing great!";
        } else if (lowerMessage.includes("diet")) {
          fallbackText = "A healthy diet includes a balance of fruits, vegetables, lean proteins, and whole grains. Remember to drink plenty of water!";
        } else {
          fallbackText = "I am an AI Health Assistant. I can only respond to basic keywords like 'fever', 'stress', 'diet', or 'emergency' right now.";
        }
        
        responseText = `⚠️ Note: The Gemini API Key provided is either invalid or doesn't have access to the Generative AI API (Error 404). Falling back to basic AI:\n\n${fallbackText}`;
      }
    } else {
      // 2. Fallback to Simple Mock AI Logic
      const lowerMessage = message.toLowerCase();
      if (lowerMessage.includes("symptom") || lowerMessage.includes("fever") || lowerMessage.includes("headache")) {
        responseText = "Based on your symptoms, please make sure to rest and stay hydrated. If symptoms persist for more than 2 days or become severe, please consult a doctor. Disclaimer: I am an AI, not a doctor. (Using Mock Data - Please add GEMINI_API_KEY to .env)";
      } else if (lowerMessage.includes("emergency") || lowerMessage.includes("chest pain") || lowerMessage.includes("breathing") || lowerMessage.includes("unconscious")) {
        responseText = "Please seek immediate medical attention or call emergency services right away! (Using Mock Data)";
      } else if (lowerMessage.includes("stress") || lowerMessage.includes("motivation")) {
        responseText = "Take a deep breath. It's important to manage stress. Try to practice mindfulness, take short breaks, and get enough sleep. You are doing great! (Using Mock Data)";
      } else if (lowerMessage.includes("diet")) {
        responseText = "A healthy diet includes a balance of fruits, vegetables, lean proteins, and whole grains. Remember to drink plenty of water! (Using Mock Data)";
      } else {
        responseText = "I am an AI Health Assistant. To get smarter, real-time answers, please add your GEMINI_API_KEY in the backend .env file. For now, I can only respond to basic keywords like 'fever', 'stress', 'diet', or 'emergency'.";
      }
    }

    const chat = new Chat({
      userId: req.user._id,
      message,
      response: responseText
    });

    const createdChat = await chat.save();
    res.status(201).json(createdChat);
  } catch (error) {
    console.error("Chat save error:", error);
    res.status(500).json({ message: error.message });
  }
});

export default router;
