import { useState, useEffect } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import { Users, MessageSquare, Calendar, Bell, Trash2, Shield, TrendingUp, Activity } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [users, setUsers] = useState([]);
  const userInfo = JSON.parse(localStorage.getItem('userInfo'));

  useEffect(() => { fetchData(); }, []);

  const fetchData = async () => {
    try {
      const config = { headers: { Authorization: `Bearer ${userInfo.token}` } };
      const [statsRes, usersRes] = await Promise.all([
        axios.get('http://localhost:5000/api/admin/stats', config),
        axios.get('http://localhost:5000/api/admin/users', config)
      ]);
      setStats(statsRes.data);
      setUsers(usersRes.data);
    } catch (err) { console.error(err); }
  };

  const deleteUser = async (id) => {
    if (!window.confirm('Delete this user permanently?')) return;
    try {
      await axios.delete(`http://localhost:5000/api/admin/users/${id}`, {
        headers: { Authorization: `Bearer ${userInfo.token}` }
      });
      setUsers(prev => prev.filter(u => u._id !== id));
      if (stats) setStats(prev => ({ ...prev, totalUsers: prev.totalUsers - 1 }));
    } catch (err) { console.error(err); }
  };

  const statCards = stats ? [
    { label: 'Total Users', value: stats.totalUsers, icon: <Users className="h-6 w-6" />, color: 'from-sky-400 to-blue-600', glow: 'shadow-sky-500/30' },
    { label: 'AI Chats', value: stats.totalChats, icon: <MessageSquare className="h-6 w-6" />, color: 'from-teal-400 to-emerald-600', glow: 'shadow-teal-500/30' },
    { label: 'Appointments', value: stats.totalAppointments, icon: <Calendar className="h-6 w-6" />, color: 'from-violet-400 to-purple-600', glow: 'shadow-violet-500/30' },
    { label: 'Active Reminders', value: stats.activeReminders, icon: <Bell className="h-6 w-6" />, color: 'from-amber-400 to-orange-500', glow: 'shadow-amber-500/30' },
    { label: 'Reports Scanned', value: stats.totalReports, icon: <Activity className="h-6 w-6" />, color: 'from-indigo-400 to-purple-600', glow: 'shadow-indigo-500/30' },
    { label: 'Risk Predictions', value: stats.totalRiskScans, icon: <Shield className="h-6 w-6" />, color: 'from-rose-400 to-red-600', glow: 'shadow-rose-500/30' },
  ] : [];

  const chartData = stats ? [
    { name: 'Users', value: stats.totalUsers, fill: '#0ea5e9' },
    { name: 'Chats', value: stats.totalChats, fill: '#14b8a6' },
    { name: 'Appts', value: stats.totalAppointments, fill: '#8b5cf6' },
    { name: 'Reports', value: stats.totalReports, fill: '#6366f1' },
    { name: 'Risks', value: stats.totalRiskScans, fill: '#f43f5e' },
  ] : [];

  const COLORS = ['#0ea5e9', '#14b8a6', '#8b5cf6', '#6366f1', '#f43f5e'];

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">

        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 bg-gradient-to-br from-violet-500 to-purple-700 rounded-2xl flex items-center justify-center shadow-xl shadow-violet-500/30">
              <Shield className="h-7 w-7 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-black text-slate-900 dark:text-white">Admin Dashboard</h1>
              <p className="text-slate-500 dark:text-slate-400">Platform management & analytics</p>
            </div>
          </div>
          <button className="flex items-center gap-2 bg-gradient-to-r from-violet-500 to-purple-600 text-white font-bold px-5 py-2.5 rounded-xl shadow-lg shadow-violet-500/30 hover:shadow-violet-500/50 hover:-translate-y-0.5 transition-all text-sm">
            <TrendingUp className="h-4 w-4" /> Export Report
          </button>
        </motion.div>

        {/* Stat Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
          {statCards.map((card, i) => (
            <motion.div key={i} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}>
              <div className={`glass-card p-6 relative overflow-hidden`}>
                <div className={`absolute -top-4 -right-4 w-20 h-20 bg-gradient-to-br ${card.color} rounded-full opacity-10`} />
                <div className={`w-12 h-12 bg-gradient-to-br ${card.color} rounded-2xl flex items-center justify-center text-white mb-4 shadow-lg ${card.glow}`}>
                  {card.icon}
                </div>
                <div className="text-3xl font-black text-slate-900 dark:text-white">{card.value}</div>
                <div className="text-sm text-slate-500 dark:text-slate-400 font-medium mt-0.5">{card.label}</div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Charts + Users */}
        <div className="grid lg:grid-cols-3 gap-6">

          {/* Bar Chart */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="lg:col-span-2">
            <div className="glass-card p-6">
              <h2 className="text-xl font-black mb-6 text-slate-900 dark:text-white">Platform Activity Overview</h2>
              <div className="h-72">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={chartData} barSize={40}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(100,116,139,0.1)" />
                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 12, fontWeight: 600 }} />
                    <YAxis axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 12 }} />
                    <Tooltip cursor={{ fill: 'rgba(14,165,233,0.04)' }} contentStyle={{ borderRadius: '16px', border: 'none', background: 'rgba(255,255,255,0.95)', boxShadow: '0 20px 40px rgba(0,0,0,0.1)', padding: '12px 16px' }} />
                    <Bar dataKey="value" radius={[8, 8, 0, 0]}>
                      {chartData.map((entry, i) => (
                        <Cell key={i} fill={COLORS[i % COLORS.length]} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </motion.div>

          {/* Users Panel */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}>
            <div className="glass-card p-6 h-full flex flex-col">
              <h2 className="text-xl font-black mb-4 text-slate-900 dark:text-white flex items-center justify-between">
                Manage Users
                <span className="badge bg-sky-50 dark:bg-sky-900/30 text-sky-600 dark:text-sky-400 text-xs normal-case">{users.length} total</span>
              </h2>
              <div className="flex-1 overflow-y-auto pr-1 space-y-2">
                {users.map(user => (
                  <div key={user._id} className="flex items-center justify-between gap-2 p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl group hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div className="w-8 h-8 bg-gradient-to-br from-sky-400 to-indigo-500 rounded-xl flex items-center justify-center text-white text-xs font-black shrink-0">
                        {user.name?.charAt(0)}
                      </div>
                      <div className="min-w-0">
                        <div className="text-sm font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1 truncate">
                          {user.name}
                          {user.role === 'admin' && <span className="badge bg-violet-50 dark:bg-violet-900/30 text-violet-600 dark:text-violet-400 text-[10px]">Admin</span>}
                        </div>
                        <div className="text-xs text-slate-400 truncate">{user.email}</div>
                      </div>
                    </div>
                    {user.role !== 'admin' && (
                      <button onClick={() => deleteUser(user._id)}
                        className="w-7 h-7 rounded-lg bg-transparent hover:bg-red-50 dark:hover:bg-red-900/20 text-slate-300 hover:text-red-500 flex items-center justify-center transition-all opacity-0 group-hover:opacity-100 shrink-0">
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
