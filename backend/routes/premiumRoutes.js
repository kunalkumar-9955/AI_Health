import express from 'express';
import multer from 'multer';
import { protect } from '../middleware/authMiddleware.js';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { createRequire } from 'module';
const require = createRequire(import.meta.url);
const pdfParse = require('pdf-parse');
import Report from '../models/Report.js';
import MoodLog from '../models/MoodLog.js';
import RiskAssessment from '../models/RiskAssessment.js';
import DietPlan from '../models/DietPlan.js';
import HabitStreak from '../models/HabitStreak.js';
import MedicineScan from '../models/MedicineScan.js';
import User from '../models/User.js';

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

// Helper to initialize Gemini
const getAIModel = () => {
  const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || process.env.OPENAI_API_KEY);
  return genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
};

// 1. AI HEALTH REPORT ANALYZER
router.post('/report-analyzer', protect, upload.single('report'), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ message: "No file uploaded" });

    let extractedText = "";
    
    // Extract text based on file type
    if (req.file.mimetype === 'application/pdf') {
      const data = await pdfParse(req.file.buffer);
      extractedText = data.text;
    } else {
      // It's an image, use Gemini Vision to extract text
      const model = getAIModel();
      const prompt = "Extract all text from this medical report. Include all numbers, test names, and values.";
      const imagePart = {
        inlineData: {
          data: req.file.buffer.toString("base64"),
          mimeType: req.file.mimetype
        }
      };
      const result = await model.generateContent([prompt, imagePart]);
      extractedText = result.response.text();
    }

    // Now analyze the extracted text with AI
    const analysisPrompt = `
      You are an AI Medical Assistant. Analyze the following health report text.
      Identify common values like sugar, hemoglobin, vitamin D, cholesterol, BP.
      Explain in simple language:
      1. What is Normal
      2. What is Slightly high/low
      3. What needs doctor review.
      
      Respond STRICTLY in JSON format with exactly these keys:
      {
        "summary": "overall summary in simple words",
        "criticalValues": ["list of critical findings if any"],
        "advice": "actionable advice"
      }
      
      Report Text:
      ${extractedText.substring(0, 5000)}
    `;

    const model = getAIModel();
    const aiResult = await model.generateContent(analysisPrompt);
    let aiText = aiResult.response.text();
    // Clean JSON markdown blocks if any
    aiText = aiText.replace(/```json/g, '').replace(/```/g, '').trim();
    const aiAnalysis = JSON.parse(aiText);

    // Save to DB
    const report = new Report({
      userId: req.user._id,
      type: req.file.mimetype === 'application/pdf' ? 'pdf' : 'image',
      fileUrl: 'memory', // Not saving to S3 for this demo, just storing text
      extractedText,
      aiAnalysis
    });
    await report.save();

    res.json(report);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
});

// 3. MOOD & STRESS DETECTION (Tracked directly from Chat, but can be standalone)
router.post('/mood', protect, async (req, res) => {
  try {
    const { text } = req.body;
    const prompt = `
      Analyze the sentiment and mood of this user text: "${text}".
      Assign a score from 1 to 10 (1=Extremely Sad/Stressed, 10=Extremely Happy).
      Identify the sentiment (happy, neutral, stressed, anxious, sad).
      Provide a calming suggestion or tip.
      Respond in JSON: { "score": number, "sentiment": "...", "aiSuggestion": "..." }
    `;
    const model = getAIModel();
    const aiResult = await model.generateContent(prompt);
    let aiText = aiResult.response.text().replace(/```json/g, '').replace(/```/g, '').trim();
    const data = JSON.parse(aiText);

    const moodLog = new MoodLog({
      userId: req.user._id,
      score: data.score,
      sentiment: data.sentiment,
      notes: text,
      aiSuggestion: data.aiSuggestion
    });
    await moodLog.save();

    res.json(moodLog);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// 4. DISEASE RISK PREDICTION
router.post('/risk-assessment', protect, async (req, res) => {
  try {
    const parameters = req.body;
    const prompt = `
      As a medical AI, assess the disease risk based on these parameters:
      ${JSON.stringify(parameters)}
      Predict risk levels for: Diabetes, Heart disease, Obesity.
      Respond ONLY in JSON format:
      [
        { "disease": "Diabetes", "riskLevel": "low|medium|high", "reasoning": "..." },
        { "disease": "Heart disease", "riskLevel": "low|medium|high", "reasoning": "..." },
        { "disease": "Obesity", "riskLevel": "low|medium|high", "reasoning": "..." }
      ]
    `;
    const model = getAIModel();
    const aiResult = await model.generateContent(prompt);
    let aiText = aiResult.response.text().replace(/```json/g, '').replace(/```/g, '').trim();
    const predictions = JSON.parse(aiText);

    const assessment = new RiskAssessment({
      userId: req.user._id,
      parameters,
      predictions
    });
    await assessment.save();

    res.json(assessment);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// 10. SMART MEDICINE SCANNER
router.post('/medicine-scanner', protect, upload.single('image'), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ message: "No image uploaded" });

    const prompt = `
      Analyze this image of a medicine strip/bottle.
      Identify the medicine name.
      Provide its common use, suggested timing (e.g., morning/night, after meals), and a brief safety note (e.g. Follow doctor advice).
      Respond STRICTLY in JSON:
      {
        "medicineName": "...",
        "commonUse": "...",
        "suggestedTiming": "...",
        "safetyNote": "..."
      }
    `;
    const imagePart = {
      inlineData: {
        data: req.file.buffer.toString("base64"),
        mimeType: req.file.mimetype
      }
    };

    const model = getAIModel();
    const aiResult = await model.generateContent([prompt, imagePart]);
    let aiText = aiResult.response.text().replace(/```json/g, '').replace(/```/g, '').trim();
    const analysis = JSON.parse(aiText);

    const scan = new MedicineScan({
      userId: req.user._id,
      imageUrl: 'memory',
      extractedText: analysis.medicineName,
      aiAnalysis: analysis
    });
    await scan.save();

    res.json(scan);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// 11. HEALTH HABIT GAMIFICATION
router.post('/habits', protect, async (req, res) => {
  try {
    const { date, tasks } = req.body;
    let habit = await HabitStreak.findOne({ userId: req.user._id, date: new Date(date) });
    
    if (!habit) {
      habit = new HabitStreak({ userId: req.user._id, date: new Date(date), tasks });
    } else {
      habit.tasks = { ...habit.tasks, ...tasks };
    }
    
    // Calculate XP
    let xp = 0;
    if (habit.tasks.waterDrank) xp += 10;
    if (habit.tasks.stepsWalked) xp += 10;
    if (habit.tasks.sleepGoal) xp += 10;
    if (habit.tasks.medicineTaken) xp += 10;
    habit.xpEarned = xp;

    await habit.save();
    res.json(habit);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get('/habits', protect, async (req, res) => {
  try {
    const habits = await HabitStreak.find({ userId: req.user._id }).sort({ date: -1 }).limit(7);
    res.json(habits);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// 12. AI DIET PLANNER
router.post('/diet-planner', protect, async (req, res) => {
  try {
    const goals = req.body;
    const prompt = `
      Generate a daily diet plan based on these user goals:
      ${JSON.stringify(goals)}
      Respond STRICTLY in JSON format:
      {
        "meals": {
          "breakfast": "...",
          "lunch": "...",
          "dinner": "...",
          "snacks": "..."
        },
        "dailyWaterTarget": number_in_ml,
        "caloriesTarget": number
      }
    `;
    const model = getAIModel();
    const aiResult = await model.generateContent(prompt);
    let aiText = aiResult.response.text().replace(/```json/g, '').replace(/```/g, '').trim();
    const data = JSON.parse(aiText);

    const plan = new DietPlan({
      userId: req.user._id,
      goals,
      meals: data.meals,
      dailyWaterTarget: data.dailyWaterTarget,
      caloriesTarget: data.caloriesTarget
    });
    await plan.save();

    res.json(plan);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// GET DASHBOARD ANALYTICS (Helper route to aggregate data for Dashboard)
router.get('/dashboard-analytics', protect, async (req, res) => {
  try {
    const userId = req.user._id;
    const moodLogs = await MoodLog.find({ userId }).sort({ createdAt: -1 }).limit(7);
    const habits = await HabitStreak.find({ userId }).sort({ date: -1 }).limit(7);
    const risk = await RiskAssessment.findOne({ userId }).sort({ createdAt: -1 });
    const user = await User.findById(userId).select('modes familyProfiles');

    res.json({ moodLogs, habits, latestRisk: risk, user });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
