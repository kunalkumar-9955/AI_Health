import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { motion } from 'framer-motion';
import { Activity, Mail, Lock, Loader2, Eye, EyeOff, ArrowRight } from 'lucide-react';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const { data } = await axios.post('http://localhost:5000/api/auth/login', { email, password });
      localStorage.setItem('userInfo', JSON.stringify(data));
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid email or password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex relative overflow-hidden">
      {/* Left Panel */}
      <div className="hidden lg:flex lg:w-1/2 relative bg-gradient-to-br from-sky-500 via-blue-600 to-indigo-700 items-center justify-center p-12">
        <div className="absolute inset-0 opacity-20" style={{ backgroundImage: 'radial-gradient(circle at 30% 40%, rgba(255,255,255,0.15) 0%, transparent 60%), radial-gradient(circle at 80% 70%, rgba(255,255,255,0.1) 0%, transparent 50%)' }} />
        <div className="relative text-center text-white max-w-md">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-white/20 backdrop-blur rounded-3xl mb-8 animate-float">
            <Activity className="h-10 w-10 text-white" />
          </div>
          <h2 className="text-4xl font-black mb-4">Welcome Back</h2>
          <p className="text-blue-100 text-lg leading-relaxed">Your AI health companion is ready to help you stay well, informed, and in control.</p>
          <div className="mt-12 grid grid-cols-2 gap-4">
            {['24/7 AI Support', 'Symptom Analysis', 'Health Tracking', 'Smart Reminders'].map((item) => (
              <div key={item} className="bg-white/10 backdrop-blur rounded-2xl p-4 text-sm font-semibold text-blue-100">{item}</div>
            ))}
          </div>
        </div>
      </div>

      {/* Right Panel */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 bg-slate-50 dark:bg-slate-950">
        <div className="bg-orb bg-orb-2 opacity-5" />
        <motion.div
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md"
        >
          {/* Mobile Logo */}
          <div className="lg:hidden flex items-center gap-3 mb-8">
            <div className="bg-gradient-to-br from-sky-400 to-indigo-500 p-2.5 rounded-xl">
              <Activity className="h-5 w-5 text-white" />
            </div>
            <span className="font-extrabold text-xl gradient-text">AI Health</span>
          </div>

          <div className="mb-8">
            <h1 className="text-3xl font-black text-slate-900 dark:text-white mb-2">Sign In</h1>
            <p className="text-slate-500 dark:text-slate-400">Access your personal health dashboard</p>
          </div>

          {error && (
            <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mb-6 p-4 rounded-2xl bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 flex items-center gap-3">
              <div className="w-2 h-2 rounded-full bg-red-500 shrink-0" />
              <p className="text-sm text-red-600 dark:text-red-400 font-medium">{error}</p>
            </motion.div>
          )}

          <form className="space-y-5" onSubmit={handleLogin}>
            <div>
              <label className="block text-sm font-bold text-slate-700 dark:text-slate-200 mb-2">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                <input
                  type="email" required
                  className="input-premium pl-11"
                  placeholder="you@example.com"
                  value={email} onChange={e => setEmail(e.target.value)}
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-bold text-slate-700 dark:text-slate-200 mb-2">Password</label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                <input
                  type={showPass ? 'text' : 'password'} required
                  className="input-premium pl-11 pr-12"
                  placeholder="••••••••"
                  value={password} onChange={e => setPassword(e.target.value)}
                />
                <button type="button" onClick={() => setShowPass(!showPass)} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300">
                  {showPass ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between pt-1">
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" className="w-4 h-4 rounded border-slate-300 text-sky-500 focus:ring-sky-500" />
                <span className="text-sm text-slate-600 dark:text-slate-400">Remember me</span>
              </label>
              <a href="#" className="text-sm font-semibold text-sky-500 hover:text-sky-600">Forgot password?</a>
            </div>

            <button type="submit" disabled={loading} className="btn-glow w-full py-3.5 text-base flex items-center justify-center gap-2 mt-2">
              {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : <><span>Sign In</span><ArrowRight className="h-4 w-4" /></>}
            </button>
          </form>

          <p className="mt-8 text-center text-sm text-slate-500 dark:text-slate-400">
            Don't have an account?{' '}
            <Link to="/register" className="font-bold text-sky-500 hover:text-sky-600 transition-colors">Create one now</Link>
          </p>
        </motion.div>
      </div>
    </div>
  );
};

export default Login;
