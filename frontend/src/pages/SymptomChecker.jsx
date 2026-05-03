import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { HeartPulse, AlertTriangle, Info, CheckCircle2, Search, Thermometer, Wind } from 'lucide-react';

const commonSymptoms = [
  { label: 'Fever', icon: '🌡️' },
  { label: 'Headache', icon: '🤕' },
  { label: 'Cold & Cough', icon: '🤧' },
  { label: 'Body Pain', icon: '💢' },
  { label: 'Stomach Pain', icon: '🤢' },
  { label: 'Fatigue', icon: '😴' },
  { label: 'Sore Throat', icon: '🤒' },
  { label: 'Chest Pain', icon: '💔' },
];

const analyzeSymptom = (input) => {
  const lower = input.toLowerCase();
  if (lower.includes('chest pain') || lower.includes('breathing') || lower.includes('unconscious')) {
    return {
      emergency: true,
      level: 'Critical',
      levelColor: 'text-red-600',
      causes: ['Cardiac issue', 'Respiratory emergency', 'Severe anxiety attack'],
      care: ['Stop any physical activity immediately', 'Sit or lie down in a comfortable position', 'Call emergency services NOW'],
      warning: 'EMERGENCY — Seek immediate medical attention or call emergency services right away.',
    };
  }
  if (lower.includes('fever') || lower.includes('headache') || lower.includes('temperature')) {
    return {
      level: 'Mild–Moderate',
      levelColor: 'text-amber-600',
      causes: ['Common cold or flu', 'Viral infection', 'Dehydration', 'Stress or fatigue'],
      care: ['Rest as much as possible', 'Stay hydrated — drink water, juices, soups', 'Take OTC pain relievers if needed', 'Monitor temperature every 4 hours'],
      warning: 'If fever exceeds 103°F (39.4°C) or lasts more than 3 days, consult a doctor.',
    };
  }
  if (lower.includes('stomach') || lower.includes('nausea') || lower.includes('vomit')) {
    return {
      level: 'Mild',
      levelColor: 'text-yellow-600',
      causes: ['Indigestion or acidity', 'Food poisoning', 'Gastroenteritis', 'IBS flare-up'],
      care: ['Eat bland, easy-to-digest foods', 'Avoid spicy, oily, or heavy meals', 'Stay hydrated with ORS or clear fluids', 'Rest and avoid strenuous activity'],
      warning: 'If pain is severe or accompanied by blood in stool/vomit, see a doctor immediately.',
    };
  }
  return {
    level: 'General',
    levelColor: 'text-sky-600',
    causes: ['General fatigue', 'Mild viral infection', 'Nutritional deficiency', 'Stress or poor sleep'],
    care: ['Get adequate rest (7–9 hours)', 'Drink plenty of fluids', 'Eat a balanced, nutritious diet', 'Monitor symptoms for 24–48 hours'],
    warning: 'If symptoms persist or worsen beyond 48 hours, please consult a healthcare professional.',
  };
};

const SymptomChecker = () => {
  const [symptom, setSymptom] = useState('');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const checkSymptom = (text) => {
    const s = text || symptom;
    if (!s.trim()) return;
    setSymptom(s);
    setLoading(true);
    setResult(null);
    setTimeout(() => { setResult(analyzeSymptom(s)); setLoading(false); }, 1500);
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">

        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-red-400 to-rose-600 rounded-3xl shadow-xl shadow-red-500/30 mb-4">
            <HeartPulse className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-4xl font-black mb-3">Symptom Checker</h1>
          <p className="text-slate-500 dark:text-slate-400 max-w-lg mx-auto">Describe how you're feeling and get instant, evidence-based health guidance.</p>
        </motion.div>

        {/* Search Box */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
          <div className="glass-card p-6 mb-6">
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="flex-1 relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                <input
                  type="text"
                  className="input-premium pl-12 !rounded-2xl py-4 text-base"
                  placeholder="e.g. I have a headache and slight fever..."
                  value={symptom}
                  onChange={e => setSymptom(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && checkSymptom()}
                />
              </div>
              <button
                onClick={() => checkSymptom()}
                disabled={loading || !symptom.trim()}
                className="px-8 py-4 bg-gradient-to-r from-red-500 to-rose-600 text-white font-bold rounded-2xl shadow-lg shadow-red-500/30 hover:shadow-red-500/50 hover:-translate-y-0.5 transition-all disabled:opacity-50 disabled:translate-y-0 whitespace-nowrap"
              >
                {loading ? 'Analyzing...' : 'Check Symptoms'}
              </button>
            </div>

            {/* Quick Symptom Chips */}
            <div className="mt-4 flex flex-wrap gap-2">
              <span className="text-xs font-semibold text-slate-400 self-center">Quick select:</span>
              {commonSymptoms.map((s) => (
                <button key={s.label} onClick={() => checkSymptom(s.label)}
                  className="flex items-center gap-1.5 bg-slate-100 dark:bg-slate-800 hover:bg-red-50 dark:hover:bg-red-900/20 hover:text-red-600 dark:hover:text-red-400 px-3 py-1.5 rounded-full text-xs font-semibold text-slate-600 dark:text-slate-400 transition-colors">
                  {s.icon} {s.label}
                </button>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Loading State */}
        <AnimatePresence>
          {loading && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="glass-card p-8 text-center">
              <div className="w-12 h-12 border-4 border-red-200 border-t-red-500 rounded-full animate-spin mx-auto mb-4" />
              <p className="text-slate-500 font-semibold">Analyzing your symptoms...</p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Result */}
        <AnimatePresence>
          {result && !loading && (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>

              {result.emergency && (
                <div className="glass-card p-6 mb-4 border-2 border-red-400 bg-red-50 dark:bg-red-900/20">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-red-500 rounded-2xl flex items-center justify-center animate-pulse shrink-0">
                      <AlertTriangle className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <h3 className="font-black text-lg text-red-700 dark:text-red-400">⚠️ Medical Emergency</h3>
                      <p className="text-red-600 dark:text-red-300 text-sm mt-1">{result.warning}</p>
                    </div>
                  </div>
                </div>
              )}

              <div className="glass-card p-8 space-y-8">
                {/* Severity Badge */}
                <div className="flex items-center justify-between flex-wrap gap-3">
                  <h3 className="text-xl font-black text-slate-900 dark:text-white">Analysis Result</h3>
                  <div className={`badge text-sm px-4 py-2 bg-slate-100 dark:bg-slate-800 ${result.levelColor} font-bold`}>
                    Severity: {result.level}
                  </div>
                </div>

                {/* Causes */}
                <div>
                  <h4 className="font-bold flex items-center gap-2 mb-4 text-slate-800 dark:text-slate-200">
                    <span className="w-8 h-8 bg-sky-50 dark:bg-sky-900/30 rounded-lg flex items-center justify-center"><Info className="h-4 w-4 text-sky-500" /></span>
                    Possible Causes
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {result.causes.map((c, i) => (
                      <div key={i} className="flex items-center gap-3 bg-slate-50 dark:bg-slate-800/60 p-3 rounded-xl">
                        <div className="w-2 h-2 rounded-full bg-sky-400 shrink-0" />
                        <span className="text-sm text-slate-600 dark:text-slate-300 font-medium">{c}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Care Tips */}
                <div>
                  <h4 className="font-bold flex items-center gap-2 mb-4 text-slate-800 dark:text-slate-200">
                    <span className="w-8 h-8 bg-emerald-50 dark:bg-emerald-900/30 rounded-lg flex items-center justify-center"><CheckCircle2 className="h-4 w-4 text-emerald-500" /></span>
                    Home Care Recommendations
                  </h4>
                  <div className="space-y-2">
                    {result.care.map((c, i) => (
                      <motion.div key={i} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.1 }}
                        className="flex items-start gap-3 p-3 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors">
                        <div className="w-5 h-5 rounded-full bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center text-emerald-600 shrink-0 mt-0.5 text-xs font-bold">{i + 1}</div>
                        <span className="text-sm text-slate-600 dark:text-slate-300">{c}</span>
                      </motion.div>
                    ))}
                  </div>
                </div>

                {/* Warning */}
                {!result.emergency && (
                  <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-2xl p-4 flex items-start gap-3">
                    <AlertTriangle className="h-5 w-5 text-amber-500 shrink-0 mt-0.5" />
                    <p className="text-sm text-amber-700 dark:text-amber-400">{result.warning}</p>
                  </div>
                )}

                <div className="text-center text-xs text-slate-400 pt-4 border-t border-slate-100 dark:border-slate-800">
                  🩺 Disclaimer: This tool provides general information only and is not a substitute for professional medical advice, diagnosis, or treatment.
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default SymptomChecker;
