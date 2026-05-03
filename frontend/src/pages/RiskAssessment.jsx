import { useState } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { Activity, ShieldAlert, HeartPulse, Loader2, AlertTriangle, Info } from 'lucide-react';

const RiskAssessment = () => {
  const [formData, setFormData] = useState({
    age: '', height: '', weight: '', bp: '', sugar: '', smoking: false, familyHistory: false, activityLevel: 'medium'
  });
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const userInfo = JSON.parse(localStorage.getItem('userInfo'));

  const analyzeRisk = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data } = await axios.post(import.meta.env.VITE_API_URL + '/api/premium/risk-assessment', formData, {
        headers: { Authorization: `Bearer ${userInfo.token}` }
      });
      setResult(data);
    } catch (err) {
      console.error(err);
      alert('Failed to analyze risk');
    } finally {
      setLoading(false);
    }
  };

  const getRiskColor = (level) => {
    switch(level) {
      case 'low': return 'text-emerald-500 bg-emerald-50 dark:bg-emerald-900/20 border-emerald-200 dark:border-emerald-800';
      case 'medium': return 'text-amber-500 bg-amber-50 dark:bg-amber-900/20 border-amber-200 dark:border-amber-800';
      case 'high': return 'text-rose-500 bg-rose-50 dark:bg-rose-900/20 border-rose-200 dark:border-rose-800';
      default: return 'text-slate-500 bg-slate-50 border-slate-200';
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8 text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-rose-500 to-red-600 rounded-2xl shadow-xl shadow-rose-500/30 mb-4 text-white">
            <HeartPulse className="h-8 w-8" />
          </div>
          <h1 className="text-3xl font-black text-slate-900 dark:text-white mb-2">Disease Risk Predictor</h1>
          <p className="text-slate-500 dark:text-slate-400 max-w-lg mx-auto">Fill in your basic health parameters to get an AI-powered prediction of your disease risks.</p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-8 items-start">
          
          {/* Form */}
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="glass-card p-6">
            <form onSubmit={analyzeRisk} className="space-y-5">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Age</label>
                  <input required type="number" value={formData.age} onChange={e => setFormData({...formData, age: e.target.value})} className="input-premium" placeholder="e.g. 45" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Weight (kg)</label>
                  <input required type="number" value={formData.weight} onChange={e => setFormData({...formData, weight: e.target.value})} className="input-premium" placeholder="e.g. 70" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Height (cm)</label>
                  <input required type="number" value={formData.height} onChange={e => setFormData({...formData, height: e.target.value})} className="input-premium" placeholder="e.g. 170" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Blood Pressure</label>
                  <input required type="text" value={formData.bp} onChange={e => setFormData({...formData, bp: e.target.value})} className="input-premium" placeholder="e.g. 120/80" />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Fasting Sugar (mg/dL)</label>
                <input required type="number" value={formData.sugar} onChange={e => setFormData({...formData, sugar: e.target.value})} className="input-premium" placeholder="e.g. 95" />
              </div>

              <div className="grid grid-cols-2 gap-4 pt-2">
                <label className="flex items-center gap-3 p-4 bg-slate-50 dark:bg-slate-800 rounded-xl cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors">
                  <input type="checkbox" checked={formData.smoking} onChange={e => setFormData({...formData, smoking: e.target.checked})} className="w-5 h-5 rounded text-rose-500 focus:ring-rose-500" />
                  <span className="font-bold text-slate-700 dark:text-slate-300 text-sm">Do you Smoke?</span>
                </label>
                <label className="flex items-center gap-3 p-4 bg-slate-50 dark:bg-slate-800 rounded-xl cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors">
                  <input type="checkbox" checked={formData.familyHistory} onChange={e => setFormData({...formData, familyHistory: e.target.checked})} className="w-5 h-5 rounded text-rose-500 focus:ring-rose-500" />
                  <span className="font-bold text-slate-700 dark:text-slate-300 text-sm">Family History?</span>
                </label>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Activity Level</label>
                <select value={formData.activityLevel} onChange={e => setFormData({...formData, activityLevel: e.target.value})} className="input-premium">
                  <option value="low">Low (Sedentary)</option>
                  <option value="medium">Medium (Moderate Exercise)</option>
                  <option value="high">High (Active/Athlete)</option>
                </select>
              </div>

              <button type="submit" disabled={loading} className="w-full mt-4 bg-gradient-to-r from-rose-500 to-red-600 text-white font-bold py-3.5 rounded-xl shadow-lg shadow-rose-500/30 hover:shadow-rose-500/50 hover:-translate-y-0.5 transition-all flex justify-center items-center gap-2">
                {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Activity className="w-5 h-5" />}
                {loading ? 'Analyzing Risks...' : 'Calculate Risk Score'}
              </button>
            </form>
          </motion.div>

          {/* Result */}
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="h-full">
            {!result ? (
               <div className="glass-card p-12 flex flex-col items-center justify-center h-full text-slate-400 min-h-[400px]">
                 <ShieldAlert className="w-16 h-16 mb-4 opacity-20" />
                 <p className="text-center">Submit your parameters to see your risk prediction.</p>
               </div>
            ) : (
              <div className="glass-card p-6 h-full space-y-4">
                <h2 className="text-lg font-black text-slate-900 dark:text-white mb-6 flex items-center gap-2 pb-4 border-b border-slate-100 dark:border-slate-800">
                  <Activity className="text-rose-500" /> Analysis Report
                </h2>

                <div className="space-y-4">
                  {result.predictions.map((p, i) => (
                    <motion.div key={i} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}
                      className={`p-4 rounded-2xl border-l-4 ${getRiskColor(p.riskLevel)} border-l-current relative overflow-hidden group`}>
                      <div className="flex items-start justify-between mb-2">
                        <h3 className="font-bold text-slate-900 dark:text-white">{p.disease}</h3>
                        <span className={`px-2.5 py-1 rounded-lg text-xs font-black uppercase tracking-wider bg-white/50 dark:bg-black/20 ${getRiskColor(p.riskLevel).split(' ')[0]}`}>
                          {p.riskLevel} Risk
                        </span>
                      </div>
                      <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">{p.reasoning}</p>
                    </motion.div>
                  ))}
                </div>

                <div className="mt-8 flex items-start gap-2 text-xs text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-900/10 p-3 rounded-xl border border-amber-100 dark:border-amber-800/50">
                  <Info className="w-5 h-5 shrink-0" />
                  <p><b>Note:</b> This prediction is based on rule-based ML logic and Gemini AI processing. It is not a clinical diagnosis. Please consult a doctor for actual medical concerns.</p>
                </div>
              </div>
            )}
          </motion.div>

        </div>
      </div>
    </div>
  );
};

export default RiskAssessment;
