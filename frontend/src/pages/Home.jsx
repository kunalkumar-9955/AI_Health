import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Activity, MessageSquare, HeartPulse, Bell, Calendar,
  ShieldAlert, ArrowRight, Star, CheckCircle, Zap, Shield, Users, TrendingUp
} from 'lucide-react';

const features = [
  { icon: <MessageSquare className="h-6 w-6" />, title: "AI Chatbot", desc: "24/7 intelligent health assistance powered by advanced AI", color: "from-sky-400 to-blue-600", glow: "shadow-sky-500/30" },
  { icon: <HeartPulse className="h-6 w-6" />, title: "Symptom Checker", desc: "Instant analysis with evidence-based home care advice", color: "from-red-400 to-rose-600", glow: "shadow-red-500/30" },
  { icon: <Bell className="h-6 w-6" />, title: "Medicine Reminders", desc: "Never miss a dose with smart daily notifications", color: "from-amber-400 to-orange-500", glow: "shadow-amber-500/30" },
  { icon: <Calendar className="h-6 w-6" />, title: "Appointments", desc: "Seamlessly book and manage doctor consultations", color: "from-violet-400 to-purple-600", glow: "shadow-violet-500/30" },
  { icon: <Activity className="h-6 w-6" />, title: "Health Tools", desc: "BMI, calorie tracker, water intake & sleep analytics", color: "from-teal-400 to-emerald-600", glow: "shadow-teal-500/30" },
  { icon: <ShieldAlert className="h-6 w-6" />, title: "Emergency SOS", desc: "One-tap emergency alerts with hospital locator", color: "from-orange-400 to-red-500", glow: "shadow-orange-500/30" },
];

const testimonials = [
  { name: "Dr. Priya Sharma", role: "Cardiologist", text: "This platform is a game-changer. Patients come in better informed and more engaged with their health.", stars: 5, avatar: "PS" },
  { name: "Rahul Mehra", role: "Patient", text: "The AI chatbot answered my questions at 2 AM when I was worried. It's like having a doctor friend.", stars: 5, avatar: "RM" },
  { name: "Anita Kulkarni", role: "Nurse", text: "The reminders system has dramatically improved medication compliance for our elderly patients.", stars: 5, avatar: "AK" },
];

const stats = [
  { value: "50K+", label: "Active Users", icon: <Users className="h-5 w-5" /> },
  { value: "2M+", label: "Questions Answered", icon: <MessageSquare className="h-5 w-5" /> },
  { value: "98%", label: "Satisfaction Rate", icon: <TrendingUp className="h-5 w-5" /> },
  { value: "24/7", label: "AI Availability", icon: <Zap className="h-5 w-5" /> },
];

const Home = () => {
  return (
    <div className="min-h-screen overflow-x-hidden">
      {/* Background Orbs */}
      <div className="bg-orb bg-orb-1 dark:opacity-8" />
      <div className="bg-orb bg-orb-2 dark:opacity-8" />
      <div className="bg-orb bg-orb-3 dark:opacity-5" />

      {/* ── Hero Section ─────────────────────────────────────── */}
      <section className="relative min-h-screen flex items-center justify-center pt-24 pb-16 gradient-hero">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 glass px-5 py-2.5 rounded-full mb-8 shadow-lg"
          >
            <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-sm font-semibold text-slate-600 dark:text-slate-300">AI-Powered Healthcare Platform</span>
            <div className="badge bg-sky-100 dark:bg-sky-900/40 text-sky-600 dark:text-sky-400">New</div>
          </motion.div>

          {/* Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-5xl md:text-7xl lg:text-8xl font-black tracking-tight mb-6 leading-[0.95]"
          >
            Your Smart{" "}
            <span className="gradient-text block">AI Health</span>
            <span className="text-slate-800 dark:text-white">Assistant</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-lg md:text-xl text-slate-500 dark:text-slate-400 max-w-2xl mx-auto mb-10 leading-relaxed"
          >
            Experience intelligent, personalized healthcare — from instant symptom analysis to medicine reminders, appointment booking, and 24/7 AI guidance.
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="flex flex-col sm:flex-row gap-4 justify-center mb-16"
          >
            <Link to="/register" className="btn-glow px-8 py-4 text-base flex items-center justify-center gap-2">
              Start for Free <ArrowRight className="h-5 w-5" />
            </Link>
            <Link to="/chatbot" className="glass px-8 py-4 rounded-full text-base font-bold flex items-center justify-center gap-2 text-slate-700 dark:text-slate-200 hover:shadow-lg transition-all">
              <MessageSquare className="h-5 w-5 text-sky-500" /> Try AI Chatbot
            </Link>
          </motion.div>

          {/* Trust Indicators */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-6 text-sm text-slate-500 dark:text-slate-400"
          >
            <div className="flex items-center gap-2"><CheckCircle className="h-4 w-4 text-emerald-500" /> No credit card required</div>
            <div className="flex items-center gap-2"><Shield className="h-4 w-4 text-sky-500" /> HIPAA compliant data</div>
            <div className="flex items-center gap-2"><Zap className="h-4 w-4 text-amber-500" /> Instant AI responses</div>
          </motion.div>

          {/* Floating Health Card */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="mt-20 max-w-4xl mx-auto relative"
          >
            <div className="glass-card p-6 md:p-8 overflow-hidden">
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-sky-400 via-violet-500 to-teal-400" />
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                {stats.map((stat, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.7 + i * 0.1 }}
                    className="text-center"
                  >
                    <div className="inline-flex items-center justify-center w-10 h-10 bg-sky-50 dark:bg-sky-900/30 rounded-xl text-sky-500 mb-2 mx-auto">
                      {stat.icon}
                    </div>
                    <div className="text-2xl md:text-3xl font-black gradient-text">{stat.value}</div>
                    <div className="text-xs text-slate-500 dark:text-slate-400 font-medium mt-0.5">{stat.label}</div>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── Features Grid ─────────────────────────────────────── */}
      <section className="py-28 bg-white dark:bg-slate-950 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-20"
          >
            <div className="inline-block badge bg-sky-50 dark:bg-sky-900/30 text-sky-600 dark:text-sky-400 mb-4 text-xs px-4 py-1.5">Features</div>
            <h2 className="text-4xl md:text-5xl font-black tracking-tight mb-5">
              Everything you need for{" "}
              <span className="gradient-text">better health</span>
            </h2>
            <p className="text-lg text-slate-500 dark:text-slate-400 max-w-2xl mx-auto">
              A comprehensive platform combining AI intelligence with practical health management tools.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                viewport={{ once: true }}
              >
                <div className="glass-card p-8 h-full group cursor-pointer">
                  <div className={`inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-br ${feature.color} text-white mb-6 shadow-lg ${feature.glow} group-hover:scale-110 transition-transform duration-300`}>
                    {feature.icon}
                  </div>
                  <h3 className="text-xl font-bold mb-3 group-hover:text-sky-600 dark:group-hover:text-sky-400 transition-colors">{feature.title}</h3>
                  <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed">{feature.desc}</p>
                  <div className="mt-6 flex items-center gap-1 text-sky-500 text-sm font-semibold opacity-0 group-hover:opacity-100 transition-opacity">
                    Learn more <ArrowRight className="h-3.5 w-3.5" />
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Testimonials ──────────────────────────────────────── */}
      <section className="py-28 bg-gradient-to-b from-slate-50 to-white dark:from-slate-900 dark:to-slate-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <div className="inline-block badge bg-violet-50 dark:bg-violet-900/30 text-violet-600 dark:text-violet-400 mb-4 text-xs px-4 py-1.5">Testimonials</div>
            <h2 className="text-4xl font-black tracking-tight">
              Trusted by <span className="gradient-text">thousands</span>
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {testimonials.map((t, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: idx * 0.15 }}
                viewport={{ once: true }}
              >
                <div className="glass-card p-8 h-full">
                  <div className="flex gap-1 mb-5">
                    {Array.from({ length: t.stars }).map((_, i) => (
                      <Star key={i} className="h-4 w-4 fill-amber-400 text-amber-400" />
                    ))}
                  </div>
                  <p className="text-slate-600 dark:text-slate-300 leading-relaxed mb-6">"{t.text}"</p>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-sky-400 to-indigo-500 flex items-center justify-center text-white text-xs font-bold">{t.avatar}</div>
                    <div>
                      <div className="font-bold text-sm">{t.name}</div>
                      <div className="text-xs text-slate-400">{t.role}</div>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA Banner ────────────────────────────────────────── */}
      <section className="py-20">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="relative overflow-hidden rounded-3xl p-12 bg-gradient-to-br from-sky-500 via-blue-600 to-indigo-600 shadow-2xl shadow-sky-500/30"
          >
            <div className="absolute inset-0 opacity-30" style={{ backgroundImage: 'radial-gradient(circle at 20% 50%, rgba(255,255,255,0.1) 0%, transparent 50%), radial-gradient(circle at 80% 20%, rgba(255,255,255,0.08) 0%, transparent 40%)' }} />
            <h2 className="text-3xl md:text-5xl font-black text-white mb-4 relative">Start your health journey today</h2>
            <p className="text-blue-100 mb-8 text-lg relative">Join thousands of users who trust AI Health for their wellness needs.</p>
            <Link to="/register" className="inline-flex items-center gap-2 bg-white text-blue-600 font-black px-8 py-4 rounded-full shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all duration-300 text-base">
              Create Free Account <ArrowRight className="h-5 w-5" />
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default Home;
