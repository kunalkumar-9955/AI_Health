import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { motion } from 'framer-motion';
import { Activity, Mail, Lock, Loader2, Eye, EyeOff, User, ArrowRight, Check } from 'lucide-react';

const perks = ['Free forever plan', 'AI-powered insights', 'Medication reminders', 'Emergency SOS access'];

const Register = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const { data } = await axios.post('http://localhost:5000/api/auth/register', { name, email, password });
      localStorage.setItem('userInfo', JSON.stringify(data));
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Error creating account');
    } finally {
      setLoading(false);
    }
  };

  const strength = password.length === 0 ? 0 : password.length < 6 ? 1 : password.length < 10 ? 2 : 3;
  const strengthLabel = ['', 'Weak', 'Good', 'Strong'];
  const strengthColor = ['', 'bg-red-400', 'bg-amber-400', 'bg-emerald-400'];

  return (
    <div className="min-h-screen flex relative overflow-hidden">
      {/* Left Panel */}
      <div className="hidden lg:flex lg:w-1/2 relative bg-gradient-to-br from-teal-500 via-emerald-500 to-sky-600 items-center justify-center p-12">
        <div className="absolute inset-0 opacity-20" style={{ backgroundImage: 'radial-gradient(circle at 70% 30%, rgba(255,255,255,0.15) 0%, transparent 60%)' }} />
        <div className="relative text-white max-w-md w-full">
          <h2 className="text-4xl font-black mb-3">Join AI Health</h2>
          <p className="text-teal-50 text-lg mb-10">Your intelligent health companion — available around the clock.</p>
          <div className="space-y-4">
            {perks.map((perk, i) => (
              <motion.div key={i} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 + i * 0.1 }}
                className="flex items-center gap-4 bg-white/10 backdrop-blur rounded-2xl px-5 py-4">
                <div className="w-7 h-7 rounded-full bg-white/20 flex items-center justify-center shrink-0">
                  <Check className="h-4 w-4 text-white" />
                </div>
                <span className="font-semibold text-teal-50">{perk}</span>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Right Panel */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 bg-slate-50 dark:bg-slate-950">
        <motion.div
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md"
        >
          <div className="lg:hidden flex items-center gap-3 mb-8">
            <div className="bg-gradient-to-br from-teal-400 to-sky-500 p-2.5 rounded-xl">
              <Activity className="h-5 w-5 text-white" />
            </div>
            <span className="font-extrabold text-xl gradient-text">AI Health</span>
          </div>

          <div className="mb-8">
            <h1 className="text-3xl font-black text-slate-900 dark:text-white mb-2">Create Account</h1>
            <p className="text-slate-500 dark:text-slate-400">Start your personalized health journey today</p>
          </div>

          {error && (
            <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mb-6 p-4 rounded-2xl bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800">
              <p className="text-sm text-red-600 dark:text-red-400 font-medium">{error}</p>
            </motion.div>
          )}

          <form className="space-y-5" onSubmit={handleRegister}>
            <div>
              <label className="block text-sm font-bold text-slate-700 dark:text-slate-200 mb-2">Full Name</label>
              <div className="relative">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                <input type="text" required className="input-premium pl-11" placeholder="John Doe" value={name} onChange={e => setName(e.target.value)} />
              </div>
            </div>

            <div>
              <label className="block text-sm font-bold text-slate-700 dark:text-slate-200 mb-2">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                <input type="email" required className="input-premium pl-11" placeholder="you@example.com" value={email} onChange={e => setEmail(e.target.value)} />
              </div>
            </div>

            <div>
              <label className="block text-sm font-bold text-slate-700 dark:text-slate-200 mb-2">Password</label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                <input type={showPass ? 'text' : 'password'} required minLength={6} className="input-premium pl-11 pr-12" placeholder="••••••••" value={password} onChange={e => setPassword(e.target.value)} />
                <button type="button" onClick={() => setShowPass(!showPass)} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
                  {showPass ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
              {password && (
                <div className="mt-2 space-y-1">
                  <div className="flex gap-1">
                    {[1,2,3].map(s => (
                      <div key={s} className={`h-1.5 flex-1 rounded-full transition-all duration-300 ${strength >= s ? strengthColor[strength] : 'bg-slate-200 dark:bg-slate-700'}`} />
                    ))}
                  </div>
                  <p className="text-xs text-slate-500 dark:text-slate-400">Password strength: <span className="font-semibold">{strengthLabel[strength]}</span></p>
                </div>
              )}
            </div>

            <button type="submit" disabled={loading} className="btn-glow w-full py-3.5 text-base flex items-center justify-center gap-2 mt-2">
              {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : <><span>Create Account</span><ArrowRight className="h-4 w-4" /></>}
            </button>
          </form>

          <p className="mt-8 text-center text-sm text-slate-500 dark:text-slate-400">
            Already have an account?{' '}
            <Link to="/login" className="font-bold text-sky-500 hover:text-sky-600 transition-colors">Sign in instead</Link>
          </p>
        </motion.div>
      </div>
    </div>
  );
};

export default Register;
