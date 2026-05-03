import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { motion } from 'framer-motion';
import {
  MessageSquare, HeartPulse, Bell, Calendar, ShieldAlert, User,
  Activity, Droplets, Moon, TrendingUp, ArrowRight, Flame, Footprints,
  Star, FileSearch, ShieldCheck, Utensils
} from 'lucide-react';
import { AreaChart, Area, XAxis, Tooltip, ResponsiveContainer } from 'recharts';

const quickLinks = [
  { name: 'Health Analyzer', icon: <FileSearch className="h-6 w-6" />, link: '/health-analyzer', color: 'from-indigo-400 to-purple-600', bg: 'bg-indigo-50 dark:bg-indigo-900/20' },
  { name: 'Diet Planner', icon: <Utensils className="h-6 w-6" />, link: '/diet-planner', color: 'from-orange-400 to-rose-500', bg: 'bg-orange-50 dark:bg-orange-900/20' },
  { name: 'Risk Predictor', icon: <HeartPulse className="h-6 w-6" />, link: '/risk-assessment', color: 'from-rose-400 to-red-600', bg: 'bg-rose-50 dark:bg-rose-900/20' },
  { name: 'AI Chatbot', icon: <MessageSquare className="h-6 w-6" />, link: '/chatbot', color: 'from-sky-400 to-blue-600', bg: 'bg-sky-50 dark:bg-sky-900/20' },
];

const Dashboard = () => {
  const [data, setData] = useState(null);
  const userInfo = JSON.parse(localStorage.getItem('userInfo'));
  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Good Morning' : hour < 18 ? 'Good Afternoon' : 'Good Evening';

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get(import.meta.env.VITE_API_URL + '/api/premium/dashboard-analytics', {
          headers: { Authorization: `Bearer ${userInfo.token}` }
        });
        setData(res.data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchData();
  }, [userInfo.token]);

  const totalXP = data?.habits?.reduce((acc, curr) => acc + (curr.xpEarned || 0), 0) || 0;
  
  // Dummy chart data for UI if backend habits are empty
  const chartData = data?.habits?.length > 0 ? data.habits.map(h => ({
    day: new Date(h.date).toLocaleDateString('en-US', {weekday: 'short'}),
    xp: h.xpEarned
  })).reverse() : [
    { day: 'Mon', xp: 20 }, { day: 'Tue', xp: 40 }, { day: 'Wed', xp: 30 },
    { day: 'Thu', xp: 50 }, { day: 'Fri', xp: 40 }, { day: 'Sat', xp: 60 }
  ];

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 relative">
      <div className="bg-orb bg-orb-1 opacity-5" />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <p className="text-sm font-semibold text-sky-500 mb-1">{greeting} 👋</p>
            <h1 className="text-3xl font-black text-slate-900 dark:text-white">{userInfo?.name}</h1>
            <p className="text-slate-400 mt-1 text-sm">Your Personalized AI Health Dashboard</p>
          </div>
          <div className="flex items-center gap-3">
            <div className="glass-card px-4 py-2 flex items-center gap-2">
              <Star className="w-5 h-5 text-amber-500 fill-amber-500" />
              <span className="font-black text-slate-900 dark:text-white">{totalXP} XP</span>
            </div>
            <div className="badge bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 flex items-center gap-1.5">
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" /> All systems healthy
            </div>
          </div>
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-6 mb-8">
          {/* Chart */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="lg:col-span-2">
            <div className="glass-card p-6 h-full border-t-4 border-sky-500">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-lg font-bold flex items-center gap-2"><TrendingUp className="text-sky-500" /> Gamification XP Trend</h2>
              </div>
              <ResponsiveContainer width="100%" height={220}>
                <AreaChart data={chartData}>
                  <defs>
                    <linearGradient id="xpGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#0ea5e9" stopOpacity={0.4} />
                      <stop offset="95%" stopColor="#0ea5e9" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#94a3b8' }} />
                  <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', background: 'rgba(255,255,255,0.9)', boxShadow: '0 8px 32px rgba(0,0,0,0.1)' }} />
                  <Area type="monotone" dataKey="xp" stroke="#0ea5e9" strokeWidth={4} fill="url(#xpGrad)" dot={{ fill: '#0ea5e9', strokeWidth: 2, r: 5 }} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </motion.div>

          {/* Risk Summary Profile */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
            <div className="glass-card p-6 h-full flex flex-col justify-center border-t-4 border-rose-500">
              <h3 className="font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2"><ShieldCheck className="text-rose-500" /> Latest Risk Predictions</h3>
              
              {data?.latestRisk ? (
                <div className="space-y-3">
                  {data.latestRisk.predictions.map((p, i) => (
                    <div key={i} className="bg-slate-50 dark:bg-slate-800/50 p-3 rounded-xl flex justify-between items-center">
                      <span className="font-bold text-sm text-slate-700 dark:text-slate-300">{p.disease}</span>
                      <span className={`px-2 py-1 rounded-md text-[10px] font-black uppercase tracking-wider ${
                        p.riskLevel === 'high' ? 'bg-rose-100 text-rose-600' :
                        p.riskLevel === 'medium' ? 'bg-amber-100 text-amber-600' :
                        'bg-emerald-100 text-emerald-600'
                      }`}>
                        {p.riskLevel} Risk
                      </span>
                    </div>
                  ))}
                  <Link to="/risk-assessment" className="text-xs font-bold text-rose-500 hover:underline mt-2 inline-block">Update parameters →</Link>
                </div>
              ) : (
                <div className="text-center py-6">
                  <HeartPulse className="w-12 h-12 text-slate-300 mx-auto mb-2" />
                  <p className="text-sm text-slate-500 mb-4">No risk assessment done yet.</p>
                  <Link to="/risk-assessment" className="btn-glow px-4 py-2 text-xs rounded-lg">Check Risk Now</Link>
                </div>
              )}
            </div>
          </motion.div>
        </div>

        {/* Quick Links */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
          <h2 className="text-xl font-bold mb-4 text-slate-900 dark:text-white flex items-center gap-2"><Activity /> Premium Features</h2>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            {quickLinks.map((link, i) => (
              <Link key={i} to={link.link} className="glass-card p-6 flex flex-col items-center text-center group border border-transparent hover:border-sky-500/30">
                <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${link.color} text-white flex items-center justify-center mb-4 shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                  {link.icon}
                </div>
                <span className="text-sm font-bold text-slate-700 dark:text-slate-200">{link.name}</span>
                <ArrowRight className="h-3.5 w-3.5 text-slate-300 mt-2 group-hover:text-sky-500 group-hover:translate-x-1 transition-all" />
              </Link>
            ))}
          </div>
        </motion.div>

        {/* Emergency Banner */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}>
          <Link to="/emergency" className="block">
            <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-red-500 to-rose-600 p-6 flex items-center justify-between group hover:shadow-xl hover:shadow-red-500/30 transition-all duration-300">
              <div className="absolute inset-0 opacity-20" style={{ backgroundImage: 'radial-gradient(circle at 20% 50%, rgba(255,255,255,0.2) 0%, transparent 60%)' }} />
              <div className="flex items-center gap-5 relative">
                <div className="w-14 h-14 bg-white/20 backdrop-blur rounded-2xl flex items-center justify-center">
                  <ShieldAlert className="h-7 w-7 text-white animate-pulse" />
                </div>
                <div className="text-white">
                  <h3 className="text-lg font-black">Emergency Help</h3>
                  <p className="text-red-100 text-sm">SOS alert, nearby hospitals & emergency numbers</p>
                </div>
              </div>
              <ArrowRight className="h-6 w-6 text-white/70 group-hover:text-white group-hover:translate-x-2 transition-all duration-300 relative" />
            </div>
          </Link>
        </motion.div>
      </div>
    </div>
  );
};

export default Dashboard;
