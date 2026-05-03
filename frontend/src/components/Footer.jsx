import { Activity, Heart, Mail } from 'lucide-react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="relative bg-white dark:bg-slate-950 border-t border-slate-100 dark:border-slate-800/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-10">

          {/* Brand */}
          <div className="md:col-span-2">
            <div className="flex items-center gap-3 mb-4">
              <div className="bg-gradient-to-br from-sky-400 to-indigo-500 p-2.5 rounded-xl shadow-lg">
                <Activity className="h-5 w-5 text-white" />
              </div>
              <div>
                <span className="font-extrabold text-lg gradient-text">AI Health</span>
                <div className="text-[10px] font-bold text-slate-400 tracking-widest uppercase">Assistant</div>
              </div>
            </div>
            <p className="text-slate-400 text-sm leading-relaxed max-w-xs">
              Your intelligent healthcare companion — available 24/7 for symptom checking, medication reminders, and personalized wellness guidance.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-bold text-slate-800 dark:text-slate-200 mb-4 text-sm uppercase tracking-wider">Platform</h4>
            <ul className="space-y-2.5">
              {['/', '/chatbot', '/symptom-checker', '/reminders', '/appointments', '/emergency'].map((href, i) => {
                const labels = ['Home', 'AI Chatbot', 'Symptom Checker', 'Reminders', 'Appointments', 'Emergency'];
                return (
                  <li key={href}>
                    <Link to={href} className="text-sm text-slate-400 hover:text-sky-500 transition-colors font-medium">{labels[i]}</Link>
                  </li>
                );
              })}
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="font-bold text-slate-800 dark:text-slate-200 mb-4 text-sm uppercase tracking-wider">Legal</h4>
            <ul className="space-y-2.5">
              {['Privacy Policy', 'Terms of Service', 'Cookie Policy', 'Medical Disclaimer'].map(item => (
                <li key={item}><a href="#" className="text-sm text-slate-400 hover:text-sky-500 transition-colors font-medium">{item}</a></li>
              ))}
            </ul>
          </div>
        </div>

        <div className="border-t border-slate-100 dark:border-slate-800 pt-8 flex flex-col sm:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-1.5 text-sm text-slate-400">
            Made with <Heart className="h-3.5 w-3.5 text-red-400 fill-red-400" /> by AI Health Team · &copy; {new Date().getFullYear()}
          </div>
          <div className="flex items-center gap-1 text-xs text-amber-600 dark:text-amber-500 bg-amber-50 dark:bg-amber-900/20 px-3 py-1.5 rounded-full font-semibold">
            ⚠️ Not a substitute for professional medical advice
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
