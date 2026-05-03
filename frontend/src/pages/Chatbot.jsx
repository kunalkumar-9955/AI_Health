import { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, Bot, Loader2, Sparkles, Mic, Trash2, Info } from 'lucide-react';
import ReactMarkdown from 'react-markdown';

const quickPrompts = [
  { label: "Headache & fever", icon: "🤒" },
  { label: "Diet plan tips", icon: "🥗" },
  { label: "Stress relief", icon: "🧘" },
  { label: "Back pain advice", icon: "🏃" },
];

const Chatbot = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [fetchLoading, setFetchLoading] = useState(true);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);
  const userInfo = JSON.parse(localStorage.getItem('userInfo'));

  useEffect(() => { fetchChats(); }, []);
  useEffect(() => { scrollToBottom(); }, [messages, loading]);

  const scrollToBottom = () => messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });

  const fetchChats = async () => {
    try {
      const { data } = await axios.get('http://localhost:5000/api/chat', {
        headers: { Authorization: `Bearer ${userInfo.token}` }
      });
      setMessages(data);
    } catch (err) {
      console.error(err);
    } finally {
      setFetchLoading(false);
    }
  };

  const handleSend = async (text) => {
    const msg = typeof text === 'string' ? text : input;
    if (!msg.trim()) return;
    
    // Optimistically show user message
    const tempMsg = { message: msg, response: null };
    setMessages(prev => [...prev, tempMsg]);
    
    setInput('');
    setLoading(true);
    inputRef.current?.focus();
    
    try {
      const { data } = await axios.post('http://localhost:5000/api/chat', { message: msg }, {
        headers: { Authorization: `Bearer ${userInfo.token}` }
      });
      // Replace temp msg with real data
      setMessages(prev => {
        const newArr = [...prev];
        newArr[newArr.length - 1] = data;
        return newArr;
      });
    } catch (err) {
      console.error(err);
      const errorMessage = err.response?.data?.message || "Network error: Failed to connect to backend server.";
      
      setMessages(prev => {
        const newArr = [...prev];
        newArr[newArr.length - 1] = { message: msg, response: "⚠️ Error: " + errorMessage };
        return newArr;
      });
      
      // Auto-logout if user is not found
      if (err.response?.status === 401) {
        setTimeout(() => {
          localStorage.removeItem('userInfo');
          window.location.href = '/login';
        }, 3000);
      }
    } finally {
      setLoading(false);
    }
  };

  const [isListening, setIsListening] = useState(false);
  
  const handleVoiceInput = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert("Your browser does not support Voice Recognition.");
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = 'hi-IN'; // Changed to Hindi (India)
    recognition.interimResults = true;

    recognition.onstart = () => {
      setIsListening(true);
    };

    recognition.onresult = (event) => {
      const currentTranscript = Array.from(event.results)
        .map(result => result[0])
        .map(result => result.transcript)
        .join('');
      setInput(currentTranscript);
    };

    recognition.onerror = (event) => {
      console.error(event.error);
      setIsListening(false);
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    if (isListening) {
      recognition.stop();
      setIsListening(false);
    } else {
      recognition.start();
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col">
      <div className="max-w-4xl mx-auto w-full px-4 sm:px-6 py-6 flex flex-col h-[calc(100vh-5rem)]">

        {/* Header */}
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="glass-card p-4 mb-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="relative">
              <div className="w-12 h-12 bg-gradient-to-br from-sky-400 to-indigo-500 rounded-2xl flex items-center justify-center shadow-lg shadow-sky-500/30">
                <Bot className="h-6 w-6 text-white" />
              </div>
              <div className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 bg-emerald-400 rounded-full border-2 border-white dark:border-slate-900" />
            </div>
            <div>
              <h2 className="font-black text-slate-900 dark:text-white">AI Health Assistant</h2>
              <div className="flex items-center gap-1.5 text-xs text-emerald-500 font-semibold">
                <Sparkles className="h-3 w-3" /> Online · Ready to help
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1.5 bg-sky-50 dark:bg-sky-900/20 text-sky-600 dark:text-sky-400 px-3 py-1.5 rounded-lg text-xs font-semibold">
              <Info className="h-3.5 w-3.5" /> Not a substitute for a doctor
            </div>
          </div>
        </motion.div>

        {/* Message Area */}
        <div className="glass-card flex-1 overflow-y-auto p-6 mb-4 space-y-6">
          {fetchLoading ? (
            <div className="h-full flex items-center justify-center">
              <Loader2 className="h-8 w-8 text-sky-500 animate-spin" />
            </div>
          ) : messages.length === 0 ? (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="h-full flex flex-col items-center justify-center text-center gap-4 py-10">
              <div className="w-20 h-20 bg-gradient-to-br from-sky-50 to-indigo-50 dark:from-sky-900/30 dark:to-indigo-900/30 rounded-3xl flex items-center justify-center">
                <Bot className="h-10 w-10 text-sky-400" />
              </div>
              <h3 className="text-xl font-black text-slate-700 dark:text-slate-200">How can I help you today?</h3>
              <p className="text-sm text-slate-400 max-w-xs">Ask me about symptoms, diet plans, stress management, medications, or general wellness tips.</p>
              <div className="grid grid-cols-2 gap-2 mt-4 w-full max-w-sm">
                {quickPrompts.map((p, i) => (
                  <button key={i} onClick={() => handleSend(p.label)}
                    className="glass-card p-3 text-sm font-semibold text-slate-600 dark:text-slate-300 flex items-center gap-2 hover:border-sky-200 dark:hover:border-sky-800 hover:text-sky-600 dark:hover:text-sky-400 transition-colors text-left">
                    <span>{p.icon}</span> {p.label}
                  </button>
                ))}
              </div>
            </motion.div>
          ) : (
            <>
              {messages.map((msg, idx) => (
                <div key={idx} className="space-y-3">
                  {/* User Message */}
                  <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="flex justify-end">
                    <div className="max-w-[75%]">
                      <div className="chat-bubble-user px-4 py-3 text-sm leading-relaxed">{msg.message}</div>
                      <p className="text-xs text-slate-400 mt-1 text-right">You</p>
                    </div>
                  </motion.div>
                  {/* Bot Response */}
                  {msg.response && (
                    <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="flex items-start gap-3 mt-1">
                      <div className="w-8 h-8 bg-gradient-to-br from-sky-400 to-indigo-500 rounded-xl flex items-center justify-center shrink-0 shadow-md mt-1">
                        <Bot className="h-4 w-4 text-white" />
                      </div>
                      <div className="max-w-[85%]">
                        <div className="chat-bubble-bot px-5 py-4 text-sm leading-relaxed text-slate-700 dark:text-slate-200">
                          <ReactMarkdown
                            components={{
                              h1: ({node, ...props}) => <h1 className="text-lg font-bold text-slate-900 dark:text-white mt-4 mb-2" {...props} />,
                              h2: ({node, ...props}) => <h2 className="text-base font-bold text-slate-900 dark:text-white mt-3 mb-2" {...props} />,
                              h3: ({node, ...props}) => <h3 className="text-sm font-bold text-slate-800 dark:text-slate-100 mt-2 mb-1" {...props} />,
                              p: ({node, ...props}) => <p className="mb-2 last:mb-0" {...props} />,
                              ul: ({node, ...props}) => <ul className="list-disc pl-5 mb-3 space-y-1" {...props} />,
                              ol: ({node, ...props}) => <ol className="list-decimal pl-5 mb-3 space-y-1" {...props} />,
                              li: ({node, ...props}) => <li className="marker:text-sky-500" {...props} />,
                              strong: ({node, ...props}) => <strong className="font-semibold text-slate-900 dark:text-white" {...props} />
                            }}
                          >
                            {msg.response}
                          </ReactMarkdown>
                        </div>
                        <p className="text-xs text-slate-400 mt-1">AI Health Bot</p>
                      </div>
                    </motion.div>
                  )}
                </div>
              ))}
              {loading && (
                <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="flex items-end gap-3">
                  <div className="w-8 h-8 bg-gradient-to-br from-sky-400 to-indigo-500 rounded-xl flex items-center justify-center shrink-0">
                    <Bot className="h-4 w-4 text-white" />
                  </div>
                  <div className="chat-bubble-bot px-4 py-3 flex gap-2 items-center">
                    <div className="typing-dot" /><div className="typing-dot" /><div className="typing-dot" />
                  </div>
                </motion.div>
              )}
            </>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
          <div className="glass-card p-4">
            <div className="flex gap-3 items-end">
              
              <button 
                onClick={handleVoiceInput}
                title={isListening ? "Stop listening" : "Start speaking"}
                className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 shadow-lg transition-all ${isListening ? 'bg-red-500 text-white shadow-red-500/30 animate-pulse scale-105' : 'bg-slate-100 dark:bg-slate-800 text-slate-500 hover:text-sky-500 hover:bg-sky-50 dark:hover:bg-sky-900/20'}`}>
                <Mic className="h-5 w-5" />
              </button>

              <div className="flex-1 relative">
                <textarea
                  ref={inputRef}
                  rows={1}
                  className="input-premium pr-4 resize-none !rounded-2xl min-h-[48px] max-h-[120px] overflow-auto py-3"
                  placeholder={isListening ? "Listening... Speak now" : "Type your health question..."}
                  value={input}
                  onChange={e => setInput(e.target.value)}
                  onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend(); } }}
                  disabled={loading}
                  style={{ height: 'auto' }}
                />
              </div>
              <button onClick={() => handleSend()} disabled={loading || !input.trim()}
                className="w-12 h-12 bg-gradient-to-br from-sky-500 to-indigo-600 rounded-2xl flex items-center justify-center text-white shrink-0 shadow-lg shadow-sky-500/30 hover:shadow-sky-500/50 hover:-translate-y-0.5 transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:translate-y-0">
                {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : <Send className="h-5 w-5" />}
              </button>
            </div>
            <div className="flex gap-2 mt-3 flex-wrap">
              {quickPrompts.map((p, i) => (
                <button key={i} onClick={() => handleSend(p.label)} className="text-xs bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 hover:text-sky-500 dark:hover:text-sky-400 hover:bg-sky-50 dark:hover:bg-sky-900/20 px-3 py-1.5 rounded-full font-medium transition-colors">
                  {p.icon} {p.label}
                </button>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Chatbot;
