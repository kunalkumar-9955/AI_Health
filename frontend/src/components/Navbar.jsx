import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Moon, Sun, Menu, X, Activity, User, LogOut, ChevronDown, Bell, Shield, Settings } from 'lucide-react';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const Navbar = ({ toggleTheme, theme }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const userInfo = JSON.parse(localStorage.getItem('userInfo'));

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setIsOpen(false);
    setUserMenuOpen(false);
  }, [location.pathname]);

  const handleLogout = () => {
    localStorage.removeItem('userInfo');
    navigate('/');
  };

  const navLinks = userInfo ? [
    { label: 'Dashboard', href: '/dashboard' },
    { label: 'AI Chatbot', href: '/chatbot' },
    { label: 'Analyzer', href: '/health-analyzer' },
    { label: 'Risks', href: '/risk-assessment' },
    { label: 'Diet', href: '/diet-planner' },
    { label: 'Reminders', href: '/reminders' },
    { label: 'Appointments', href: '/appointments' },
    { label: 'Emergency', href: '/emergency' },
  ] : [];

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
      scrolled
        ? 'glass shadow-lg shadow-slate-900/5'
        : 'bg-transparent'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 lg:h-20">

          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className="relative">
              <div className="absolute inset-0 bg-sky-400 rounded-xl blur-md opacity-50 group-hover:opacity-80 transition-opacity" />
              <div className="relative bg-gradient-to-br from-sky-400 to-indigo-500 p-2.5 rounded-xl shadow-lg">
                <Activity className="h-5 w-5 text-white" />
              </div>
            </div>
            <div className="leading-none">
              <span className="block text-lg font-extrabold gradient-text tracking-tight">AI Health</span>
              <span className="text-[10px] font-semibold text-slate-400 tracking-widest uppercase">Assistant</span>
            </div>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden lg:flex items-center gap-1">
            {navLinks.map(link => (
              <Link
                key={link.href}
                to={link.href}
                className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-200 ${
                  location.pathname === link.href
                    ? 'bg-sky-50 dark:bg-sky-900/30 text-sky-600 dark:text-sky-400'
                    : 'text-slate-600 dark:text-slate-300 hover:text-sky-600 dark:hover:text-sky-400 hover:bg-slate-100 dark:hover:bg-slate-800/60'
                }`}
              >
                {link.label}
              </Link>
            ))}
            {userInfo?.role === 'admin' && (
              <Link to="/admin" className={`px-4 py-2 rounded-xl text-sm font-semibold flex items-center gap-1.5 transition-all ${
                location.pathname === '/admin'
                  ? 'bg-purple-50 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400'
                  : 'text-purple-500 hover:bg-purple-50 dark:hover:bg-purple-900/20'
              }`}>
                <Shield className="h-3.5 w-3.5" /> Admin
              </Link>
            )}
          </div>

          {/* Right Controls */}
          <div className="flex items-center gap-3">
            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className="p-2.5 rounded-xl glass hover:shadow-md transition-all duration-200 text-slate-500 dark:text-slate-400 hover:text-sky-500"
            >
              <AnimatePresence mode="wait">
                <motion.div key={theme} initial={{ rotate: -180, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 180, opacity: 0 }} transition={{ duration: 0.2 }}>
                  {theme === 'dark' ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
                </motion.div>
              </AnimatePresence>
            </button>

            {userInfo ? (
              <div className="relative">
                <button
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                  className="flex items-center gap-2.5 glass px-3 py-2 rounded-xl hover:shadow-md transition-all duration-200"
                >
                  <div className="w-7 h-7 bg-gradient-to-br from-sky-400 to-indigo-500 rounded-lg flex items-center justify-center text-white text-xs font-bold">
                    {userInfo.name?.charAt(0).toUpperCase()}
                  </div>
                  <span className="hidden sm:block text-sm font-semibold text-slate-700 dark:text-slate-200">{userInfo.name?.split(' ')[0]}</span>
                  <ChevronDown className={`h-3.5 w-3.5 text-slate-400 transition-transform ${userMenuOpen ? 'rotate-180' : ''}`} />
                </button>

                <AnimatePresence>
                  {userMenuOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 8, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 8, scale: 0.95 }}
                      transition={{ duration: 0.15 }}
                      className="absolute right-0 top-full mt-2 w-52 glass-card p-2 shadow-2xl"
                    >
                      <div className="px-3 py-2 mb-1">
                        <p className="text-xs text-slate-400 font-medium">Signed in as</p>
                        <p className="text-sm font-bold text-slate-700 dark:text-slate-200 truncate">{userInfo.email}</p>
                      </div>
                      <hr className="border-slate-200 dark:border-slate-700 mb-1" />
                      <Link to="/settings" className="w-full flex items-center gap-3 px-3 py-2 text-sm text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800/50 rounded-lg transition-colors font-semibold">
                        <Settings className="h-4 w-4" /> Settings
                      </Link>
                      <button onClick={handleLogout} className="w-full flex items-center gap-3 px-3 py-2 text-sm text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors font-semibold">
                        <LogOut className="h-4 w-4" /> Sign Out
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <div className="hidden sm:flex items-center gap-2">
                <Link to="/login" className="px-4 py-2 text-sm font-semibold text-slate-600 dark:text-slate-300 hover:text-sky-500 transition-colors">Login</Link>
                <Link to="/register" className="btn-glow px-5 py-2.5 text-sm shadow-sky-500/30">
                  Get Started
                </Link>
              </div>
            )}

            {/* Mobile Menu Button */}
            <button onClick={() => setIsOpen(!isOpen)} className="lg:hidden p-2.5 glass rounded-xl text-slate-600 dark:text-slate-300">
              <AnimatePresence mode="wait">
                <motion.div key={isOpen ? 'open' : 'closed'} initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }} transition={{ duration: 0.15 }}>
                  {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
                </motion.div>
              </AnimatePresence>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="lg:hidden glass border-t border-white/20 dark:border-white/5"
          >
            <div className="px-4 py-4 space-y-1">
              {navLinks.map(link => (
                <Link key={link.href} to={link.href} className={`block px-4 py-3 rounded-xl text-sm font-semibold transition-all ${
                  location.pathname === link.href
                    ? 'bg-sky-50 dark:bg-sky-900/30 text-sky-600'
                    : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/60'
                }`}>
                  {link.label}
                </Link>
              ))}
              {!userInfo && (
                <div className="pt-2 flex gap-2">
                  <Link to="/login" className="flex-1 text-center px-4 py-3 glass rounded-xl text-sm font-semibold">Login</Link>
                  <Link to="/register" className="flex-1 text-center px-4 py-3 btn-glow rounded-xl text-sm">Get Started</Link>
                </div>
              )}
              {userInfo && (
                <button onClick={handleLogout} className="w-full flex items-center justify-center gap-2 px-4 py-3 text-sm font-semibold text-red-500 bg-red-50 dark:bg-red-900/20 rounded-xl">
                  <LogOut className="h-4 w-4" /> Sign Out
                </button>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;
