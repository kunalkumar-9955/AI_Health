import { useState } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { Utensils, Droplets, Target, Loader2, Apple, Coffee, Moon, Sun } from 'lucide-react';

const DietPlanner = () => {
  const [formData, setFormData] = useState({
    targetWeight: '',
    goalType: 'lose',
    preference: 'veg',
    cuisine: 'Indian'
  });
  const [loading, setLoading] = useState(false);
  const [plan, setPlan] = useState(null);
  const userInfo = JSON.parse(localStorage.getItem('userInfo'));

  const generatePlan = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data } = await axios.post(import.meta.env.VITE_API_URL + '/api/premium/diet-planner', formData, {
        headers: { Authorization: `Bearer ${userInfo.token}` }
      });
      setPlan(data);
    } catch (err) {
      console.error(err);
      alert('Failed to generate diet plan');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 bg-gradient-to-br from-orange-400 to-rose-500 rounded-2xl flex items-center justify-center shadow-xl shadow-orange-500/30">
              <Utensils className="h-7 w-7 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-black text-slate-900 dark:text-white">AI Diet Planner</h1>
              <p className="text-slate-500 dark:text-slate-400">Personalized nutrition plans crafted by AI</p>
            </div>
          </div>
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-8 items-start">
          
          {/* Form */}
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="glass-card p-6">
            <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-2">
              <Target className="w-5 h-5 text-orange-500" /> Set Your Goal
            </h2>
            
            <form onSubmit={generatePlan} className="space-y-5">
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Target Weight (kg)</label>
                <input required type="number" value={formData.targetWeight} onChange={e => setFormData({...formData, targetWeight: e.target.value})} className="input-premium" placeholder="e.g. 65" />
              </div>
              
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Goal</label>
                <div className="grid grid-cols-3 gap-2">
                  {['lose', 'maintain', 'gain'].map(g => (
                    <button type="button" key={g} onClick={() => setFormData({...formData, goalType: g})}
                      className={`py-2 text-sm font-bold rounded-xl capitalize transition-all ${formData.goalType === g ? 'bg-orange-500 text-white shadow-md' : 'bg-slate-100 dark:bg-slate-800 text-slate-500 hover:bg-orange-50 dark:hover:bg-orange-900/20'}`}>
                      {g}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Diet Preference</label>
                <div className="grid grid-cols-3 gap-2">
                  {['veg', 'non-veg', 'vegan'].map(p => (
                    <button type="button" key={p} onClick={() => setFormData({...formData, preference: p})}
                      className={`py-2 text-sm font-bold rounded-xl capitalize transition-all ${formData.preference === p ? 'bg-emerald-500 text-white shadow-md' : 'bg-slate-100 dark:bg-slate-800 text-slate-500 hover:bg-emerald-50 dark:hover:bg-emerald-900/20'}`}>
                      {p}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Cuisine</label>
                <select value={formData.cuisine} onChange={e => setFormData({...formData, cuisine: e.target.value})} className="input-premium">
                  <option value="Indian">Indian</option>
                  <option value="Continental">Continental</option>
                  <option value="Mediterranean">Mediterranean</option>
                  <option value="Keto">Keto Focus</option>
                </select>
              </div>

              <button type="submit" disabled={loading} className="w-full bg-gradient-to-r from-orange-400 to-rose-500 text-white font-bold py-3.5 rounded-xl shadow-lg shadow-orange-500/30 hover:shadow-orange-500/50 hover:-translate-y-0.5 transition-all flex justify-center items-center gap-2">
                {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Utensils className="w-5 h-5" />}
                {loading ? 'Generating Plan...' : 'Generate Plan'}
              </button>
            </form>
          </motion.div>

          {/* Result */}
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="lg:col-span-2 h-full">
            {!plan ? (
               <div className="glass-card p-12 flex flex-col items-center justify-center h-full text-slate-400">
                 <Apple className="w-16 h-16 mb-4 opacity-20" />
                 <p>Fill out the form to generate your AI-crafted diet plan.</p>
               </div>
            ) : (
              <div className="glass-card p-8 h-full border-t-4 border-emerald-500 space-y-8">
                
                {/* Stats */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-emerald-50 dark:bg-emerald-900/10 border border-emerald-100 dark:border-emerald-800 rounded-2xl p-4 flex items-center gap-4">
                    <div className="w-12 h-12 bg-emerald-500 rounded-full flex items-center justify-center text-white shrink-0"><Target className="w-6 h-6"/></div>
                    <div>
                      <p className="text-xs font-bold text-emerald-600 dark:text-emerald-400 uppercase">Daily Calorie Target</p>
                      <p className="text-2xl font-black text-slate-900 dark:text-white">{plan.caloriesTarget} kcal</p>
                    </div>
                  </div>
                  <div className="bg-sky-50 dark:bg-sky-900/10 border border-sky-100 dark:border-sky-800 rounded-2xl p-4 flex items-center gap-4">
                    <div className="w-12 h-12 bg-sky-500 rounded-full flex items-center justify-center text-white shrink-0"><Droplets className="w-6 h-6"/></div>
                    <div>
                      <p className="text-xs font-bold text-sky-600 dark:text-sky-400 uppercase">Water Intake</p>
                      <p className="text-2xl font-black text-slate-900 dark:text-white">{plan.dailyWaterTarget} ml</p>
                    </div>
                  </div>
                </div>

                {/* Meals */}
                <div className="space-y-6">
                  <div className="flex gap-4 items-start relative">
                    <div className="w-10 h-10 bg-amber-100 dark:bg-amber-900/30 text-amber-500 rounded-xl flex items-center justify-center shrink-0"><Sun className="w-5 h-5"/></div>
                    <div>
                      <h3 className="font-bold text-slate-900 dark:text-white mb-1">Breakfast</h3>
                      <p className="text-slate-600 dark:text-slate-300 text-sm leading-relaxed">{plan.meals.breakfast}</p>
                    </div>
                  </div>
                  
                  <div className="flex gap-4 items-start relative">
                    <div className="w-10 h-10 bg-orange-100 dark:bg-orange-900/30 text-orange-500 rounded-xl flex items-center justify-center shrink-0"><Utensils className="w-5 h-5"/></div>
                    <div>
                      <h3 className="font-bold text-slate-900 dark:text-white mb-1">Lunch</h3>
                      <p className="text-slate-600 dark:text-slate-300 text-sm leading-relaxed">{plan.meals.lunch}</p>
                    </div>
                  </div>

                  <div className="flex gap-4 items-start relative">
                    <div className="w-10 h-10 bg-pink-100 dark:bg-pink-900/30 text-pink-500 rounded-xl flex items-center justify-center shrink-0"><Coffee className="w-5 h-5"/></div>
                    <div>
                      <h3 className="font-bold text-slate-900 dark:text-white mb-1">Snacks</h3>
                      <p className="text-slate-600 dark:text-slate-300 text-sm leading-relaxed">{plan.meals.snacks}</p>
                    </div>
                  </div>

                  <div className="flex gap-4 items-start relative">
                    <div className="w-10 h-10 bg-indigo-100 dark:bg-indigo-900/30 text-indigo-500 rounded-xl flex items-center justify-center shrink-0"><Moon className="w-5 h-5"/></div>
                    <div>
                      <h3 className="font-bold text-slate-900 dark:text-white mb-1">Dinner</h3>
                      <p className="text-slate-600 dark:text-slate-300 text-sm leading-relaxed">{plan.meals.dinner}</p>
                    </div>
                  </div>
                </div>

              </div>
            )}
          </motion.div>

        </div>
      </div>
    </div>
  );
};

export default DietPlanner;
