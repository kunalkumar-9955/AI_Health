import { useState } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { FileText, Image as ImageIcon, Upload, Loader2, FileSearch, Pill, CheckCircle2, AlertTriangle, AlertCircle } from 'lucide-react';
import ReactMarkdown from 'react-markdown';

const HealthAnalyzer = () => {
  const [activeTab, setActiveTab] = useState('report'); // 'report' or 'medicine'
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const userInfo = JSON.parse(localStorage.getItem('userInfo'));

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
      if (selectedFile.type.startsWith('image/')) {
        setPreview(URL.createObjectURL(selectedFile));
      } else {
        setPreview(null);
      }
      setResult(null); // Clear previous results
    }
  };

  const handleAnalyze = async () => {
    if (!file) return;
    setLoading(true);
    setResult(null);
    const formData = new FormData();
    
    try {
      if (activeTab === 'report') {
        formData.append('report', file);
        const { data } = await axios.post(import.meta.env.VITE_API_URL + '/api/premium/report-analyzer', formData, {
          headers: { Authorization: `Bearer ${userInfo.token}`, 'Content-Type': 'multipart/form-data' }
        });
        setResult({ type: 'report', data: data.aiAnalysis });
      } else {
        formData.append('image', file);
        const { data } = await axios.post(import.meta.env.VITE_API_URL + '/api/premium/medicine-scanner', formData, {
          headers: { Authorization: `Bearer ${userInfo.token}`, 'Content-Type': 'multipart/form-data' }
        });
        setResult({ type: 'medicine', data: data.aiAnalysis });
      }
    } catch (err) {
      console.error(err);
      alert('Analysis failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 py-8">
      <div className="max-w-5xl mx-auto px-4 sm:px-6">

        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8 text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl shadow-xl shadow-indigo-500/30 mb-4 text-white">
            <FileSearch className="h-8 w-8" />
          </div>
          <h1 className="text-3xl font-black text-slate-900 dark:text-white mb-2">AI Health Vision</h1>
          <p className="text-slate-500 dark:text-slate-400 max-w-lg mx-auto">Upload lab reports for simple explanations, or scan medicine strips to know their uses instantly.</p>
        </motion.div>

        {/* Tabs */}
        <div className="flex justify-center mb-8">
          <div className="bg-slate-200/50 dark:bg-slate-800 p-1 rounded-2xl flex gap-1">
            <button 
              onClick={() => { setActiveTab('report'); setFile(null); setPreview(null); setResult(null); }}
              className={`px-6 py-2.5 rounded-xl font-bold text-sm flex items-center gap-2 transition-all ${activeTab === 'report' ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-sm' : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'}`}>
              <FileText className="w-4 h-4" /> Report Analyzer
            </button>
            <button 
              onClick={() => { setActiveTab('medicine'); setFile(null); setPreview(null); setResult(null); }}
              className={`px-6 py-2.5 rounded-xl font-bold text-sm flex items-center gap-2 transition-all ${activeTab === 'medicine' ? 'bg-white dark:bg-slate-900 text-teal-600 dark:text-teal-400 shadow-sm' : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'}`}>
              <Pill className="w-4 h-4" /> Medicine Scanner
            </button>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-8 items-start">
          
          {/* Upload Section */}
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="glass-card p-6 border-t-4 border-indigo-500">
            <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-4">
              {activeTab === 'report' ? 'Upload Blood/Lab Report' : 'Upload Medicine Strip Image'}
            </h2>
            <div className="border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-2xl p-8 text-center hover:bg-slate-50 dark:hover:bg-slate-900/50 transition-colors relative">
              <input type="file" accept={activeTab === 'report' ? '.pdf,image/*' : 'image/*'} onChange={handleFileChange} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" />
              
              {!file ? (
                <div className="flex flex-col items-center pointer-events-none">
                  <div className="w-16 h-16 bg-indigo-50 dark:bg-indigo-900/20 rounded-full flex items-center justify-center text-indigo-500 mb-4">
                    {activeTab === 'report' ? <FileText className="w-8 h-8" /> : <ImageIcon className="w-8 h-8" />}
                  </div>
                  <p className="font-bold text-slate-700 dark:text-slate-300 mb-1">Click to browse or drag & drop</p>
                  <p className="text-xs text-slate-500">{activeTab === 'report' ? 'Supports PDF, JPG, PNG' : 'Supports JPG, PNG'}</p>
                </div>
              ) : (
                <div className="flex flex-col items-center">
                  {preview ? (
                    <img src={preview} alt="Preview" className="h-32 object-contain mb-4 rounded-lg shadow-sm" />
                  ) : (
                    <FileText className="w-16 h-16 text-indigo-500 mb-4" />
                  )}
                  <p className="font-bold text-slate-700 dark:text-slate-300 text-sm">{file.name}</p>
                  <p className="text-xs text-slate-500 mt-1">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                  <p className="text-xs text-indigo-500 font-bold mt-4 underline cursor-pointer pointer-events-none">Click to change file</p>
                </div>
              )}
            </div>

            <button 
              onClick={handleAnalyze} 
              disabled={!file || loading}
              className={`w-full mt-6 py-3.5 rounded-xl font-bold flex items-center justify-center gap-2 text-white shadow-lg transition-all ${!file ? 'bg-slate-300 dark:bg-slate-800 opacity-50' : activeTab === 'report' ? 'bg-gradient-to-r from-indigo-500 to-purple-600 hover:shadow-indigo-500/30 hover:-translate-y-0.5' : 'bg-gradient-to-r from-teal-500 to-emerald-600 hover:shadow-teal-500/30 hover:-translate-y-0.5'}`}>
              {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Upload className="w-5 h-5" />}
              {loading ? 'Analyzing with AI...' : activeTab === 'report' ? 'Analyze Report' : 'Scan Medicine'}
            </button>
            
            <div className="mt-4 flex items-start gap-2 text-xs text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-900/10 p-3 rounded-lg">
              <AlertTriangle className="w-4 h-4 shrink-0" />
              <p>Disclaimer: AI analysis is for educational guidance only and does not replace professional medical advice.</p>
            </div>
          </motion.div>

          {/* Result Section */}
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
            {loading ? (
              <div className="glass-card p-12 flex flex-col items-center justify-center h-full text-slate-500 min-h-[400px]">
                <Loader2 className="w-12 h-12 text-indigo-500 animate-spin mb-4" />
                <p className="font-bold text-slate-700 dark:text-slate-300">Extracting details...</p>
                <p className="text-sm mt-2 text-center">Gemini AI is reading your document and generating a simplified medical summary.</p>
              </div>
            ) : result ? (
              <div className="glass-card p-6 h-full border-t-4 border-emerald-500">
                <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400 font-bold mb-6 pb-4 border-b border-slate-100 dark:border-slate-800">
                  <CheckCircle2 className="w-6 h-6" /> Analysis Complete
                </div>

                {result.type === 'report' ? (
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-sm font-black text-slate-400 uppercase tracking-wider mb-2">Simple Summary</h3>
                      <p className="text-slate-700 dark:text-slate-200 text-sm leading-relaxed">{result.data.summary}</p>
                    </div>
                    
                    {result.data.criticalValues && result.data.criticalValues.length > 0 && (
                      <div>
                        <h3 className="text-sm font-black text-rose-400 uppercase tracking-wider mb-2 flex items-center gap-1">
                          <AlertCircle className="w-4 h-4" /> Attention Needed
                        </h3>
                        <ul className="space-y-2">
                          {result.data.criticalValues.map((cv, i) => (
                            <li key={i} className="text-sm text-slate-700 dark:text-slate-200 bg-rose-50 dark:bg-rose-900/10 px-3 py-2 rounded-lg border-l-2 border-rose-500">
                              {cv}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                    
                    <div>
                      <h3 className="text-sm font-black text-indigo-400 uppercase tracking-wider mb-2">Advice</h3>
                      <p className="text-slate-700 dark:text-slate-200 text-sm leading-relaxed bg-indigo-50 dark:bg-indigo-900/10 p-4 rounded-xl border border-indigo-100 dark:border-indigo-800/50">
                        {result.data.advice}
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-sm font-black text-slate-400 uppercase tracking-wider mb-1">Medicine Name</h3>
                      <p className="text-xl font-black text-slate-900 dark:text-white">{result.data.medicineName}</p>
                    </div>
                    
                    <div>
                      <h3 className="text-sm font-black text-slate-400 uppercase tracking-wider mb-2">Common Use</h3>
                      <p className="text-slate-700 dark:text-slate-200 text-sm leading-relaxed">{result.data.commonUse}</p>
                    </div>

                    <div>
                      <h3 className="text-sm font-black text-slate-400 uppercase tracking-wider mb-2">Suggested Timing</h3>
                      <p className="text-slate-700 dark:text-slate-200 text-sm font-semibold bg-sky-50 dark:bg-sky-900/20 inline-flex px-3 py-1.5 rounded-lg border border-sky-100 dark:border-sky-800">
                        {result.data.suggestedTiming}
                      </p>
                    </div>
                    
                    <div>
                      <h3 className="text-sm font-black text-amber-500 uppercase tracking-wider mb-2 flex items-center gap-1">
                        <AlertTriangle className="w-4 h-4" /> Safety Note
                      </h3>
                      <p className="text-slate-700 dark:text-slate-200 text-sm leading-relaxed bg-amber-50 dark:bg-amber-900/10 p-3 rounded-lg border border-amber-200 dark:border-amber-800">
                        {result.data.safetyNote}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="glass-card p-12 flex flex-col items-center justify-center h-full text-slate-400 min-h-[400px]">
                <FileSearch className="w-16 h-16 mb-4 opacity-20" />
                <p className="text-center">Upload a file on the left to see the AI analysis here.</p>
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default HealthAnalyzer;
