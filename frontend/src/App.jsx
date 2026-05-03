import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Chatbot from './pages/Chatbot';
import SymptomChecker from './pages/SymptomChecker';
import Reminders from './pages/Reminders';
import Appointments from './pages/Appointments';
import Emergency from './pages/Emergency';
import HealthAnalyzer from './pages/HealthAnalyzer';
import DietPlanner from './pages/DietPlanner';
import RiskAssessment from './pages/RiskAssessment';
import Settings from './pages/Settings';
import AdminDashboard from './pages/AdminDashboard';
import ProtectedRoute from './components/ProtectedRoute';

// Animated page wrapper
const PageTransition = ({ children }) => (
  <motion.div
    initial={{ opacity: 0, y: 12 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: -8 }}
    transition={{ duration: 0.3, ease: 'easeInOut' }}
  >
    {children}
  </motion.div>
);

// Inner router component so we can use useLocation
const AppRoutes = () => {
  const location = useLocation();

  // Pages that use their own full-screen layout (no footer padding needed)
  const noFooterPaths = ['/login', '/register', '/chatbot'];
  const hideFooter = noFooterPaths.includes(location.pathname);

  return (
    <>
      <Navbar />
      <main className={`${hideFooter ? '' : 'pt-16 lg:pt-20'}`}>
        <AnimatePresence mode="wait">
          <Routes location={location} key={location.pathname}>
            <Route path="/" element={<PageTransition><Home /></PageTransition>} />
            <Route path="/login" element={<PageTransition><Login /></PageTransition>} />
            <Route path="/register" element={<PageTransition><Register /></PageTransition>} />
            <Route path="/emergency" element={<PageTransition><Emergency /></PageTransition>} />

            <Route element={<ProtectedRoute />}>
              <Route path="/dashboard" element={<PageTransition><Dashboard /></PageTransition>} />
              <Route path="/chatbot" element={<PageTransition><Chatbot /></PageTransition>} />
              <Route path="/symptom-checker" element={<PageTransition><SymptomChecker /></PageTransition>} />
              <Route path="/reminders" element={<PageTransition><Reminders /></PageTransition>} />
              <Route path="/appointments" element={<PageTransition><Appointments /></PageTransition>} />
              <Route path="/health-analyzer" element={<PageTransition><HealthAnalyzer /></PageTransition>} />
              <Route path="/diet-planner" element={<PageTransition><DietPlanner /></PageTransition>} />
              <Route path="/risk-assessment" element={<PageTransition><RiskAssessment /></PageTransition>} />
              <Route path="/settings" element={<PageTransition><Settings /></PageTransition>} />
            </Route>

            <Route element={<ProtectedRoute adminOnly={true} />}>
              <Route path="/admin" element={<PageTransition><AdminDashboard /></PageTransition>} />
            </Route>
          </Routes>
        </AnimatePresence>
      </main>
      {!hideFooter && <Footer />}
    </>
  );
};

function App() {
  const [theme, setTheme] = useState(() => localStorage.getItem('theme') || 'light');

  useEffect(() => {
    const root = document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => setTheme(t => t === 'light' ? 'dark' : 'light');

  return (
    <BrowserRouter>
      {/* Pass theme props via context or just wrap AppRoutes */}
      <div className="flex flex-col min-h-screen">
        <AppRoutesWithTheme toggleTheme={toggleTheme} theme={theme} />
      </div>
    </BrowserRouter>
  );
}

// Split so Navbar gets theme props while still using useLocation
const AppRoutesWithTheme = ({ toggleTheme, theme }) => {
  const location = useLocation();
  const noFooterPaths = ['/login', '/register', '/chatbot'];
  const noPaddingPaths = ['/login', '/register'];
  
  const hideFooter = noFooterPaths.includes(location.pathname);
  const hidePadding = noPaddingPaths.includes(location.pathname);

  return (
    <>
      <Navbar toggleTheme={toggleTheme} theme={theme} />
      <main className={`flex-grow ${hidePadding ? '' : 'pt-16 lg:pt-20'}`}>
        <AnimatePresence mode="wait">
          <Routes location={location} key={location.pathname}>
            <Route path="/" element={<PageTransition><Home /></PageTransition>} />
            <Route path="/login" element={<PageTransition><Login /></PageTransition>} />
            <Route path="/register" element={<PageTransition><Register /></PageTransition>} />
            <Route path="/emergency" element={<PageTransition><Emergency /></PageTransition>} />

            <Route element={<ProtectedRoute />}>
              <Route path="/dashboard" element={<PageTransition><Dashboard /></PageTransition>} />
              <Route path="/chatbot" element={<PageTransition><Chatbot /></PageTransition>} />
              <Route path="/symptom-checker" element={<PageTransition><SymptomChecker /></PageTransition>} />
              <Route path="/reminders" element={<PageTransition><Reminders /></PageTransition>} />
              <Route path="/appointments" element={<PageTransition><Appointments /></PageTransition>} />
              <Route path="/health-analyzer" element={<PageTransition><HealthAnalyzer /></PageTransition>} />
              <Route path="/diet-planner" element={<PageTransition><DietPlanner /></PageTransition>} />
              <Route path="/risk-assessment" element={<PageTransition><RiskAssessment /></PageTransition>} />
              <Route path="/settings" element={<PageTransition><Settings /></PageTransition>} />
            </Route>

            <Route element={<ProtectedRoute adminOnly={true} />}>
              <Route path="/admin" element={<PageTransition><AdminDashboard /></PageTransition>} />
            </Route>
          </Routes>
        </AnimatePresence>
      </main>
      {!hideFooter && <Footer />}
    </>
  );
};

export default App;
