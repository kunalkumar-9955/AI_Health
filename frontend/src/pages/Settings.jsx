import { useState, useEffect } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import { Settings as SettingsIcon, Users, Sliders, Save, Loader2, Plus, Trash2, Heart, Glasses, WifiOff } from 'lucide-react';

const Settings = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const userInfo = JSON.parse(localStorage.getItem('userInfo'));

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const { data } = await axios.get('http://localhost:5000/api/users/profile', {
          headers: { Authorization: `Bearer ${userInfo.token}` }
        });
        if (!data.modes) data.modes = { ruralMode: false, seniorMode: false, womenHealthMode: false };
        if (!data.familyProfiles) data.familyProfiles = [];
        setUser(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, [userInfo.token]);

  const handleModeToggle = (mode) => {
    setUser({ ...user, modes: { ...user.modes, [mode]: !user.modes[mode] } });
  };

  const addFamilyMember = () => {
    setUser({
      ...user,
      familyProfiles: [...user.familyProfiles, { name: '', relation: '', age: '', history: '' }]
    });
  };

  const updateFamilyMember = (index, field, value) => {
    const newProfiles = [...user.familyProfiles];
    newProfiles[index][field] = value;
    setUser({ ...user, familyProfiles: newProfiles });
  };

  const removeFamilyMember = (index) => {
    const newProfiles = user.familyProfiles.filter((_, i) => i !== index);
    setUser({ ...user, familyProfiles: newProfiles });
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await axios.put('http://localhost:5000/api/users/profile', user, {
        headers: { Authorization: `Bearer ${userInfo.token}` }
      });
      
      // Update local context/app if needed for Senior Mode
      if (user.modes.seniorMode) {
        document.documentElement.style.fontSize = '18px'; // Hack for senior mode
      } else {
        document.documentElement.style.fontSize = '16px';
      }
      
      alert('Settings saved successfully!');
    } catch (err) {
      console.error(err);
      alert('Failed to save settings');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center"><Loader2 className="w-8 h-8 animate-spin text-sky-500" /></div>;

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8 flex justify-between items-end">
          <div>
            <div className="inline-flex items-center justify-center w-14 h-14 bg-gradient-to-br from-slate-700 to-slate-900 rounded-2xl shadow-lg mb-4 text-white">
              <SettingsIcon className="h-7 w-7" />
            </div>
            <h1 className="text-3xl font-black text-slate-900 dark:text-white mb-2">Platform Settings</h1>
            <p className="text-slate-500">Manage family profiles and toggle specialized modes.</p>
          </div>
          <button onClick={handleSave} disabled={saving} className="bg-sky-500 hover:bg-sky-600 text-white px-6 py-2.5 rounded-xl font-bold flex items-center gap-2 transition-all disabled:opacity-50">
            {saving ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />} Save Changes
          </button>
        </motion.div>

        <div className="space-y-6">
          
          {/* Modes Section */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="glass-card p-6 border-t-4 border-indigo-500">
            <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-2"><Sliders className="text-indigo-500" /> Specialized AI Modes</h2>
            
            <div className="grid sm:grid-cols-3 gap-4">
              {/* Women Health Mode */}
              <div className={`border-2 rounded-2xl p-5 cursor-pointer transition-all ${user.modes.womenHealthMode ? 'border-pink-500 bg-pink-50 dark:bg-pink-900/10' : 'border-slate-200 dark:border-slate-800'}`} onClick={() => handleModeToggle('womenHealthMode')}>
                <div className="flex justify-between items-start mb-3">
                  <div className={`p-2 rounded-lg ${user.modes.womenHealthMode ? 'bg-pink-500 text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-500'}`}>
                    <Heart className="w-5 h-5" />
                  </div>
                  <input type="checkbox" checked={user.modes.womenHealthMode} readOnly className="w-5 h-5 rounded text-pink-500" />
                </div>
                <h3 className="font-bold text-slate-900 dark:text-white">Women Health</h3>
                <p className="text-xs text-slate-500 mt-1">Period tracking, pregnancy guide, PCOS tips.</p>
              </div>

              {/* Senior Citizen Mode */}
              <div className={`border-2 rounded-2xl p-5 cursor-pointer transition-all ${user.modes.seniorMode ? 'border-sky-500 bg-sky-50 dark:bg-sky-900/10' : 'border-slate-200 dark:border-slate-800'}`} onClick={() => handleModeToggle('seniorMode')}>
                <div className="flex justify-between items-start mb-3">
                  <div className={`p-2 rounded-lg ${user.modes.seniorMode ? 'bg-sky-500 text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-500'}`}>
                    <Glasses className="w-5 h-5" />
                  </div>
                  <input type="checkbox" checked={user.modes.seniorMode} readOnly className="w-5 h-5 rounded text-sky-500" />
                </div>
                <h3 className="font-bold text-slate-900 dark:text-white">Senior Citizen</h3>
                <p className="text-xs text-slate-500 mt-1">Large fonts, high contrast, simple UI.</p>
              </div>

              {/* Rural India Mode */}
              <div className={`border-2 rounded-2xl p-5 cursor-pointer transition-all ${user.modes.ruralMode ? 'border-amber-500 bg-amber-50 dark:bg-amber-900/10' : 'border-slate-200 dark:border-slate-800'}`} onClick={() => handleModeToggle('ruralMode')}>
                <div className="flex justify-between items-start mb-3">
                  <div className={`p-2 rounded-lg ${user.modes.ruralMode ? 'bg-amber-500 text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-500'}`}>
                    <WifiOff className="w-5 h-5" />
                  </div>
                  <input type="checkbox" checked={user.modes.ruralMode} readOnly className="w-5 h-5 rounded text-amber-500" />
                </div>
                <h3 className="font-bold text-slate-900 dark:text-white">Rural India</h3>
                <p className="text-xs text-slate-500 mt-1">Lightweight, offline cache, Hindi focus.</p>
              </div>
            </div>
          </motion.div>

          {/* Family Profiles Section */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="glass-card p-6 border-t-4 border-teal-500">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2"><Users className="text-teal-500" /> Family Health Management</h2>
              <button onClick={addFamilyMember} className="text-sm font-bold text-teal-600 bg-teal-50 dark:bg-teal-900/20 px-3 py-1.5 rounded-lg flex items-center gap-1 hover:bg-teal-100 transition-colors">
                <Plus className="w-4 h-4" /> Add Member
              </button>
            </div>

            {user.familyProfiles.length === 0 ? (
              <div className="text-center py-8 bg-slate-50 dark:bg-slate-900/50 rounded-2xl border border-dashed border-slate-300 dark:border-slate-700">
                <Users className="w-12 h-12 mx-auto text-slate-300 mb-3" />
                <p className="text-slate-500">No family members added yet.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {user.familyProfiles.map((member, index) => (
                  <div key={index} className="bg-slate-50 dark:bg-slate-800/50 p-4 rounded-2xl border border-slate-200 dark:border-slate-700 relative">
                    <button onClick={() => removeFamilyMember(index)} className="absolute top-4 right-4 text-slate-400 hover:text-red-500 transition-colors">
                      <Trash2 className="w-5 h-5" />
                    </button>
                    
                    <div className="grid md:grid-cols-3 gap-4 mr-8">
                      <div>
                        <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Name</label>
                        <input type="text" value={member.name} onChange={e => updateFamilyMember(index, 'name', e.target.value)} className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg px-3 py-2 text-sm" placeholder="e.g. Rahul" />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Relation</label>
                        <input type="text" value={member.relation} onChange={e => updateFamilyMember(index, 'relation', e.target.value)} className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg px-3 py-2 text-sm" placeholder="e.g. Father" />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Age</label>
                        <input type="number" value={member.age} onChange={e => updateFamilyMember(index, 'age', e.target.value)} className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg px-3 py-2 text-sm" placeholder="e.g. 55" />
                      </div>
                      <div className="md:col-span-3">
                        <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Medical History</label>
                        <input type="text" value={member.history} onChange={e => updateFamilyMember(index, 'history', e.target.value)} className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg px-3 py-2 text-sm" placeholder="e.g. Blood pressure, allergies..." />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
