import { useState, useEffect } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { Bell, Plus, Clock, Trash2, Pill, Check, X } from 'lucide-react';

const Reminders = () => {
  const [reminders, setReminders] = useState([]);
  const [medicine, setMedicine] = useState('');
  const [time, setTime] = useState('');
  const [dose, setDose] = useState('');
  const [repeatDaily, setRepeatDaily] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const userInfo = JSON.parse(localStorage.getItem('userInfo'));

  useEffect(() => { fetchReminders(); }, []);

  const fetchReminders = async () => {
    try {
      const { data } = await axios.get('http://localhost:5000/api/reminders', {
        headers: { Authorization: `Bearer ${userInfo.token}` }
      });
      setReminders(data);
    } catch (err) { console.error(err); }
  };

  const addReminder = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data } = await axios.post('http://localhost:5000/api/reminders', { medicine, time, dose, repeatDaily }, {
        headers: { Authorization: `Bearer ${userInfo.token}` }
      });
      setReminders(prev => [...prev, data]);
      setMedicine(''); setTime(''); setDose(''); setRepeatDaily(false);
      setSuccess(true);
      setTimeout(() => setSuccess(false), 2500);
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  const deleteReminder = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/reminders/${id}`, {
        headers: { Authorization: `Bearer ${userInfo.token}` }
      });
      setReminders(prev => prev.filter(r => r._id !== id));
    } catch (err) { console.error(err); }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">

        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 bg-gradient-to-br from-amber-400 to-orange-500 rounded-2xl flex items-center justify-center shadow-xl shadow-amber-500/30">
              <Bell className="h-7 w-7 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-black text-slate-900 dark:text-white">Medicine Reminders</h1>
              <p className="text-slate-500 dark:text-slate-400">Manage your daily medication schedule</p>
            </div>
          </div>
        </motion.div>

        <div className="grid lg:grid-cols-5 gap-6">

          {/* Form */}
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 }} className="lg:col-span-2">
            <div className="glass-card p-6 sticky top-24">
              <h2 className="text-lg font-black mb-5 flex items-center gap-2">
                <Plus className="h-5 w-5 text-amber-500" /> Add New Reminder
              </h2>

              <AnimatePresence>
                {success && (
                  <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }}
                    className="mb-4 p-3 bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800 rounded-xl flex items-center gap-2 text-sm text-emerald-600 dark:text-emerald-400 font-semibold">
                    <Check className="h-4 w-4" /> Reminder saved successfully!
                  </motion.div>
                )}
              </AnimatePresence>

              <form onSubmit={addReminder} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">Medicine Name *</label>
                  <input required type="text" value={medicine} onChange={e => setMedicine(e.target.value)}
                    className="input-premium" placeholder="e.g. Paracetamol 500mg" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">Time *</label>
                  <input required type="time" value={time} onChange={e => setTime(e.target.value)} className="input-premium" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">Dosage</label>
                  <input type="text" value={dose} onChange={e => setDose(e.target.value)} className="input-premium" placeholder="e.g. 1 Tablet" />
                </div>
                <label className="flex items-center gap-3 cursor-pointer p-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-transparent hover:border-amber-200 dark:hover:border-amber-800 transition-colors">
                  <div onClick={() => setRepeatDaily(!repeatDaily)}
                    className={`w-10 h-5 rounded-full transition-all duration-200 ${repeatDaily ? 'bg-amber-400' : 'bg-slate-300 dark:bg-slate-600'} relative`}>
                    <div className={`absolute top-0.5 w-4 h-4 bg-white rounded-full shadow-sm transition-all duration-200 ${repeatDaily ? 'left-5' : 'left-0.5'}`} />
                  </div>
                  <span className="text-sm font-semibold text-slate-600 dark:text-slate-300">Repeat Daily</span>
                </label>
                <button type="submit" disabled={loading}
                  className="w-full bg-gradient-to-r from-amber-400 to-orange-500 text-white font-bold py-3 rounded-xl shadow-lg shadow-amber-500/30 hover:shadow-amber-500/50 hover:-translate-y-0.5 transition-all disabled:opacity-60">
                  {loading ? 'Saving...' : '+ Add Reminder'}
                </button>
              </form>
            </div>
          </motion.div>

          {/* List */}
          <div className="lg:col-span-3 space-y-4">
            {reminders.length === 0 ? (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="glass-card p-12 text-center">
                <div className="w-16 h-16 bg-amber-50 dark:bg-amber-900/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <Pill className="h-8 w-8 text-amber-400" />
                </div>
                <h3 className="font-bold text-slate-700 dark:text-slate-200 mb-2">No reminders yet</h3>
                <p className="text-sm text-slate-400">Add your first medicine reminder to get started.</p>
              </motion.div>
            ) : (
              <AnimatePresence>
                {reminders.map((r, i) => (
                  <motion.div key={r._id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ delay: i * 0.05 }}>
                    <div className="glass-card p-5 flex items-center justify-between gap-4 group border-l-4 border-amber-400">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-amber-50 dark:bg-amber-900/20 rounded-2xl flex items-center justify-center text-amber-500 shrink-0">
                          <Pill className="h-6 w-6" />
                        </div>
                        <div>
                          <h3 className="font-bold text-slate-900 dark:text-white">{r.medicine}</h3>
                          <div className="flex items-center gap-3 mt-1 flex-wrap">
                            <span className="flex items-center gap-1 text-xs text-slate-500 dark:text-slate-400 font-medium">
                              <Clock className="h-3 w-3" /> {r.time}
                            </span>
                            {r.dose && <span className="text-xs bg-amber-50 dark:bg-amber-900/20 text-amber-600 dark:text-amber-400 px-2 py-0.5 rounded-full font-semibold">{r.dose}</span>}
                            {r.repeatDaily && <span className="text-xs bg-sky-50 dark:bg-sky-900/20 text-sky-600 dark:text-sky-400 px-2 py-0.5 rounded-full font-semibold">Daily</span>}
                          </div>
                        </div>
                      </div>
                      <button onClick={() => deleteReminder(r._id)}
                        className="w-9 h-9 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-red-50 dark:hover:bg-red-900/20 hover:text-red-500 text-slate-400 flex items-center justify-center transition-all opacity-0 group-hover:opacity-100">
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Reminders;
