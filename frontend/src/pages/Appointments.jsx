import { useState, useEffect } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { Calendar, User, Clock, Stethoscope, Plus, Check, ChevronRight } from 'lucide-react';

const doctors = ['Dr. Arjun Sharma', 'Dr. Priya Verma', 'Dr. Rohan Nair', 'Dr. Sneha Gupta', 'Dr. Vikram Singh'];

const statusConfig = {
  pending: { bg: 'bg-amber-50 dark:bg-amber-900/20', text: 'text-amber-600 dark:text-amber-400', dot: 'bg-amber-400', label: 'Pending' },
  approved: { bg: 'bg-emerald-50 dark:bg-emerald-900/20', text: 'text-emerald-600 dark:text-emerald-400', dot: 'bg-emerald-400', label: 'Approved' },
  rejected: { bg: 'bg-red-50 dark:bg-red-900/20', text: 'text-red-600 dark:text-red-400', dot: 'bg-red-400', label: 'Rejected' },
};

const Appointments = () => {
  const [appointments, setAppointments] = useState([]);
  const [doctorName, setDoctorName] = useState('');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [reason, setReason] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const userInfo = JSON.parse(localStorage.getItem('userInfo'));

  useEffect(() => { fetchAppointments(); }, []);

  const fetchAppointments = async () => {
    try {
      const { data } = await axios.get('http://localhost:5000/api/appointments', {
        headers: { Authorization: `Bearer ${userInfo.token}` }
      });
      setAppointments(data);
    } catch (err) { console.error(err); }
  };

  const bookAppointment = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data } = await axios.post('http://localhost:5000/api/appointments', { doctorName, date, time, reason }, {
        headers: { Authorization: `Bearer ${userInfo.token}` }
      });
      setAppointments(prev => [...prev, data]);
      setDoctorName(''); setDate(''); setTime(''); setReason('');
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 bg-gradient-to-br from-violet-400 to-purple-600 rounded-2xl flex items-center justify-center shadow-xl shadow-violet-500/30">
              <Calendar className="h-7 w-7 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-black text-slate-900 dark:text-white">Appointments</h1>
              <p className="text-slate-500 dark:text-slate-400">Book and manage your doctor consultations</p>
            </div>
          </div>
        </motion.div>

        <div className="grid lg:grid-cols-5 gap-6">

          {/* Book Form */}
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 }} className="lg:col-span-2">
            <div className="glass-card p-6 sticky top-24">
              <h2 className="text-lg font-black mb-5 flex items-center gap-2">
                <Plus className="h-5 w-5 text-violet-500" /> Book Appointment
              </h2>

              <AnimatePresence>
                {success && (
                  <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }}
                    className="mb-4 p-3 bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800 rounded-xl flex items-center gap-2 text-sm text-emerald-600 dark:text-emerald-400 font-semibold">
                    <Check className="h-4 w-4" /> Appointment booked!
                  </motion.div>
                )}
              </AnimatePresence>

              <form onSubmit={bookAppointment} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">Select Doctor *</label>
                  <select required value={doctorName} onChange={e => setDoctorName(e.target.value)} className="input-premium">
                    <option value="">Choose a doctor</option>
                    {doctors.map(d => <option key={d} value={d}>{d}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">Date *</label>
                  <input required type="date" value={date} min={new Date().toISOString().split('T')[0]} onChange={e => setDate(e.target.value)} className="input-premium" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">Time *</label>
                  <input required type="time" value={time} onChange={e => setTime(e.target.value)} className="input-premium" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">Reason for Visit</label>
                  <textarea required value={reason} onChange={e => setReason(e.target.value)} className="input-premium resize-none !rounded-2xl" rows={3} placeholder="Briefly describe your concern..." />
                </div>
                <button type="submit" disabled={loading}
                  className="w-full bg-gradient-to-r from-violet-500 to-purple-600 text-white font-bold py-3 rounded-xl shadow-lg shadow-violet-500/30 hover:shadow-violet-500/50 hover:-translate-y-0.5 transition-all disabled:opacity-60">
                  {loading ? 'Booking...' : '+ Book Appointment'}
                </button>
              </form>
            </div>
          </motion.div>

          {/* Appointments List */}
          <div className="lg:col-span-3 space-y-4">
            {appointments.length === 0 ? (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="glass-card p-12 text-center">
                <div className="w-16 h-16 bg-violet-50 dark:bg-violet-900/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <Stethoscope className="h-8 w-8 text-violet-400" />
                </div>
                <h3 className="font-bold text-slate-700 dark:text-slate-200 mb-2">No appointments yet</h3>
                <p className="text-sm text-slate-400">Book your first consultation with a doctor.</p>
              </motion.div>
            ) : (
              <AnimatePresence>
                {appointments.map((appt, i) => {
                  const sc = statusConfig[appt.status] || statusConfig.pending;
                  return (
                    <motion.div key={appt._id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ delay: i * 0.05 }}>
                      <div className="glass-card p-5 border-l-4 border-violet-500 group hover:shadow-xl transition-shadow">
                        <div className="flex flex-col sm:flex-row justify-between gap-4">
                          <div className="flex items-start gap-4">
                            <div className="w-12 h-12 bg-violet-50 dark:bg-violet-900/20 rounded-2xl flex items-center justify-center shrink-0 text-violet-500">
                              <User className="h-6 w-6" />
                            </div>
                            <div>
                              <h3 className="font-black text-slate-900 dark:text-white">{appt.doctorName}</h3>
                              <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">{appt.reason}</p>
                              <div className="flex items-center gap-4 mt-2 flex-wrap">
                                <span className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400 font-medium bg-slate-100 dark:bg-slate-800 px-2.5 py-1 rounded-full">
                                  <Calendar className="h-3 w-3" /> {new Date(appt.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                                </span>
                                <span className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400 font-medium bg-slate-100 dark:bg-slate-800 px-2.5 py-1 rounded-full">
                                  <Clock className="h-3 w-3" /> {appt.time}
                                </span>
                              </div>
                            </div>
                          </div>
                          <div className={`self-start flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold ${sc.bg} ${sc.text}`}>
                            <div className={`w-1.5 h-1.5 rounded-full ${sc.dot}`} /> {sc.label}
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </AnimatePresence>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Appointments;
