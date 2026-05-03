import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { PhoneCall, MapPin, ShieldAlert, AlertTriangle, Heart, Phone, Ambulance, Loader2, CheckCircle2, Trash2, UserPlus, Mail } from 'lucide-react';
import axios from 'axios';
import HospitalMap from '../components/HospitalMap';

const emergencyNumbers = [
  { name: 'Ambulance', number: '108', color: 'from-red-500 to-rose-600', icon: '🚑' },
  { name: 'Police', number: '100', color: 'from-blue-500 to-indigo-600', icon: '🚔' },
  { name: 'Fire Brigade', number: '101', color: 'from-orange-500 to-red-500', icon: '🚒' },
  { name: 'Disaster Mgmt', number: '1078', color: 'from-emerald-500 to-teal-600', icon: '🆘' },
];

const hospitals = [
  { name: 'City General Hospital', distance: '2.4 km', beds: '450+', type: 'Multi-specialty', rating: 4.8 },
  { name: 'Care Plus Clinic', distance: '4.1 km', beds: '80', type: 'Outpatient', rating: 4.5 },
  { name: 'Apollo Health Center', distance: '5.8 km', beds: '320+', type: 'Multi-specialty', rating: 4.9 },
];

const Emergency = () => {
  const [sosActive, setSosActive] = useState(false);
  const [sosProgress, setSosProgress] = useState(0);
  const [location, setLocation] = useState(null);
  const [locStatus, setLocStatus] = useState('idle'); // idle, fetching, success, error
  const [contacts, setContacts] = useState([]);
  const [newContact, setNewContact] = useState({ name: '', phone: '', email: '' });
  const [addingContact, setAddingContact] = useState(false);
  const [sosSentStatus, setSosSentStatus] = useState(null); // null, 'sending', 'success', 'error'
  const holdTimerRef = useRef(null);
  const intervalRef = useRef(null);
  const userInfo = JSON.parse(localStorage.getItem('userInfo'));

  useEffect(() => {
    fetchContacts();
  }, []);

  const fetchContacts = async () => {
    if (!userInfo) return;
    try {
      const { data } = await axios.get('http://localhost:5000/api/emergency/contacts', {
        headers: { Authorization: `Bearer ${userInfo.token}` }
      });
      setContacts(data);
    } catch (err) {
      console.error("Failed to fetch emergency contacts", err);
    }
  };

  const addContact = async (e) => {
    e.preventDefault();
    if (!newContact.name || !newContact.phone || !newContact.email) return;
    setAddingContact(true);
    try {
      const { data } = await axios.post('http://localhost:5000/api/emergency/contacts', newContact, {
        headers: { Authorization: `Bearer ${userInfo.token}` }
      });
      setContacts(data);
      setNewContact({ name: '', phone: '', email: '' });
    } catch (err) {
      console.error(err);
      alert('Failed to add contact');
    } finally {
      setAddingContact(false);
    }
  };

  const deleteContact = async (id) => {
    try {
      const { data } = await axios.delete(`http://localhost:5000/api/emergency/contacts/${id}`, {
        headers: { Authorization: `Bearer ${userInfo.token}` }
      });
      setContacts(data);
    } catch (err) {
      console.error(err);
      alert('Failed to delete contact');
    }
  };

  const startSosHold = () => {
    if (sosActive) return;
    setSosProgress(0);
    intervalRef.current = setInterval(() => {
      setSosProgress(prev => {
        if (prev >= 100) {
          clearInterval(intervalRef.current);
          activateSOS();
          return 100;
        }
        return prev + 5; // Increases by 5% every 150ms (takes 3 seconds)
      });
    }, 150);
  };

  const cancelSosHold = () => {
    if (!sosActive) {
      clearInterval(intervalRef.current);
      setSosProgress(0);
    }
  };

  const activateSOS = async () => {
    setSosActive(true);
    setSosProgress(100);
    setSosSentStatus('sending');
    
    try {
      // Wait for geolocation to be fetched
      const coords = await handleGetLocation();
      
      // Call SOS API with the real-time coordinates
      await axios.post('http://localhost:5000/api/emergency/sos', { 
        lat: coords.lat, 
        lng: coords.lng 
      }, {
        headers: { Authorization: `Bearer ${userInfo.token}` }
      });
      setSosSentStatus('success');
    } catch (err) {
      console.error(err);
      
      // If location fails, still send SOS but without coordinates
      try {
        await axios.post('http://localhost:5000/api/emergency/sos', { 
          lat: null, 
          lng: null 
        }, {
          headers: { Authorization: `Bearer ${userInfo.token}` }
        });
        setSosSentStatus('success');
      } catch (fallbackErr) {
        console.error(fallbackErr);
        setSosSentStatus('error');
      }
    }
  };

  const handleGetLocation = () => {
    setLocStatus('fetching');
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        setLocStatus('error');
        alert('Geolocation is not supported by your browser.');
        reject(new Error('Not supported'));
        return;
      }
      
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const coords = {
            lat: position.coords.latitude,
            lng: position.coords.longitude
          };
          setLocation(coords);
          setLocStatus('success');
          resolve(coords);
        },
        (error) => {
          console.error(error);
          setLocStatus('error');
          alert('Unable to retrieve your location. Please allow location permissions.');
          reject(error);
        },
        { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
      );
    });
  };

  const getDirections = (hospitalName) => {
    let url = '';
    if (location) {
      url = `https://www.google.com/maps/dir/?api=1&origin=${location.lat},${location.lng}&destination=${encodeURIComponent(hospitalName)}`;
    } else {
      url = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(hospitalName)}`;
    }
    window.open(url, '_blank');
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 py-8">
      <div className="max-w-5xl mx-auto px-4 sm:px-6">

        {/* Hero Banner */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-red-500 via-rose-600 to-red-700 p-8 md:p-12 text-white mb-8 shadow-2xl shadow-red-500/30">
            <div className="absolute inset-0 opacity-20" style={{ backgroundImage: 'radial-gradient(circle at 20% 50%, rgba(255,255,255,0.2) 0%, transparent 50%), radial-gradient(circle at 80% 20%, rgba(255,255,255,0.1) 0%, transparent 40%)' }} />
            <div className="relative flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
              <div>
                <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur px-3 py-1.5 rounded-full text-xs font-bold mb-4">
                  <div className="w-2 h-2 rounded-full bg-white animate-pulse" /> Emergency Services
                </div>
                <h1 className="text-4xl md:text-5xl font-black mb-3">Emergency Hub</h1>
                <p className="text-red-100 text-lg max-w-md">If you're facing a life-threatening emergency, call your local emergency number immediately.</p>
              </div>
              <div className="w-20 h-20 md:w-24 md:h-24 bg-white/20 backdrop-blur rounded-3xl flex items-center justify-center shrink-0 animate-pulse">
                <ShieldAlert className="h-10 w-10 md:h-12 md:w-12 text-white" />
              </div>
            </div>
          </div>
        </motion.div>

        {/* Emergency Numbers */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="mb-8">
          <h2 className="text-xl font-black mb-4 text-slate-900 dark:text-white">Emergency Numbers</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {emergencyNumbers.map((n, i) => (
              <motion.div key={i} initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.15 + i * 0.05 }}>
                <a href={`tel:${n.number}`}
                  className={`glass-card p-5 flex flex-col items-center text-center group relative overflow-hidden block`}>
                  <div className={`absolute inset-x-0 top-0 h-1 bg-gradient-to-r ${n.color}`} />
                  <div className="text-3xl mb-2">{n.icon}</div>
                  <div className="text-2xl font-black gradient-text mb-1">{n.number}</div>
                  <div className="text-xs font-semibold text-slate-500 dark:text-slate-400">{n.name}</div>
                  <div className={`mt-3 text-xs font-bold px-3 py-1 rounded-full bg-gradient-to-r ${n.color} text-white opacity-0 group-hover:opacity-100 transition-opacity`}>
                    Call Now
                  </div>
                </a>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Emergency Contacts */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }} className="mb-8">
          <h2 className="text-xl font-black mb-4 text-slate-900 dark:text-white">Your Emergency Contacts</h2>
          
          <div className="grid md:grid-cols-3 gap-6">
            <div className="md:col-span-2 space-y-3">
              {contacts.length === 0 ? (
                <div className="glass-card p-8 text-center text-slate-500 dark:text-slate-400">
                  <UserPlus className="mx-auto h-12 w-12 text-slate-300 dark:text-slate-600 mb-3" />
                  <p>No emergency contacts added yet.</p>
                  <p className="text-sm">Add contacts so we can alert them instantly during an SOS.</p>
                </div>
              ) : (
                contacts.map(c => (
                  <div key={c._id} className="glass-card p-4 flex items-center justify-between">
                    <div>
                      <h3 className="font-bold text-slate-900 dark:text-white">{c.name}</h3>
                      <div className="flex gap-4 mt-1">
                        <span className="text-xs flex items-center gap-1 text-slate-500"><Phone className="w-3 h-3"/> {c.phone}</span>
                        <span className="text-xs flex items-center gap-1 text-slate-500"><Mail className="w-3 h-3"/> {c.email}</span>
                      </div>
                    </div>
                    <button onClick={() => deleteContact(c._id)} className="p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-xl transition-colors">
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                ))
              )}
            </div>

            <div className="glass-card p-5">
              <h3 className="font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
                <UserPlus className="w-4 h-4 text-sky-500"/> Add Contact
              </h3>
              <form onSubmit={addContact} className="space-y-3">
                <input 
                  type="text" required placeholder="Full Name" 
                  value={newContact.name} onChange={e => setNewContact({...newContact, name: e.target.value})}
                  className="w-full bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500"
                />
                <input 
                  type="tel" required placeholder="Mobile No." 
                  value={newContact.phone} onChange={e => setNewContact({...newContact, phone: e.target.value})}
                  className="w-full bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500"
                />
                <input 
                  type="email" required placeholder="Email Address" 
                  value={newContact.email} onChange={e => setNewContact({...newContact, email: e.target.value})}
                  className="w-full bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500"
                />
                <button 
                  type="submit" disabled={addingContact}
                  className="w-full bg-gradient-to-r from-sky-500 to-indigo-600 text-white font-bold py-2.5 rounded-xl hover:shadow-lg disabled:opacity-70 transition-all flex justify-center items-center">
                  {addingContact ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Save Contact'}
                </button>
              </form>
            </div>
          </div>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-6 mb-8">

          {/* SOS Button */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
            <div className="glass-card p-8 flex flex-col items-center text-center h-full relative overflow-hidden">
              <AnimatePresence>
                {sosActive && (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="absolute inset-0 bg-red-500/10 dark:bg-red-500/20 z-0 animate-pulse" />
                )}
              </AnimatePresence>
              
              <h2 className="text-xl font-black mb-2 text-slate-900 dark:text-white relative z-10">SOS Alert</h2>
              <p className="text-sm text-slate-500 dark:text-slate-400 mb-8 max-w-xs relative z-10">
                {sosActive ? "SOS Activated! Location is being shared with emergency contacts." : "Sends your location to emergency contacts and nearby hospitals instantly."}
              </p>
              
              <div className="relative mb-8 z-10">
                <div className={`absolute inset-0 bg-red-400 rounded-full ${sosActive ? 'animate-ping opacity-40' : 'opacity-10'} scale-150`} />
                
                {/* Removed SVG Progress Circle for Instant Action */}

                <button 
                  onClick={activateSOS}
                  disabled={sosActive}
                  className={`relative w-36 h-36 rounded-full text-white font-black text-xl shadow-2xl transition-all duration-300 flex flex-col items-center justify-center gap-1
                    ${sosActive ? 'bg-red-600 shadow-red-600/70 scale-110' : 'bg-gradient-to-br from-red-500 to-rose-600 shadow-red-500/50 hover:shadow-red-500/70 hover:scale-105'}`}
                >
                  <ShieldAlert className={`h-8 w-8 ${sosActive ? 'animate-bounce' : ''}`} />
                  <span>{sosActive ? "ACTIVE" : "SOS"}</span>
                </button>
              </div>
              <p className={`text-xs font-semibold relative z-10 ${sosActive ? 'text-red-500' : 'text-slate-400'}`}>
                {sosActive ? "Help is on the way" : "Click once to activate instantly"}
              </p>
            </div>
          </motion.div>

          {/* Share Location */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }}>
            <div className="glass-card p-8 flex flex-col h-full">
              <h2 className="text-xl font-black mb-2 text-slate-900 dark:text-white">Share Location</h2>
              <p className="text-sm text-slate-500 dark:text-slate-400 mb-6">Share your GPS location with emergency services and your contacts.</p>
              
              <div className={`flex-1 rounded-2xl overflow-hidden mb-4 min-h-[120px] relative flex items-center justify-center border-2 transition-all
                ${locStatus === 'success' ? 'bg-emerald-50 dark:bg-emerald-900/20 border-emerald-200 dark:border-emerald-800' : 
                  locStatus === 'error' ? 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800' : 
                  'bg-slate-100 dark:bg-slate-800 border-transparent'}`}>
                
                <div className="text-center p-4">
                  {locStatus === 'idle' && (
                    <>
                      <MapPin className="h-10 w-10 text-slate-300 dark:text-slate-600 mx-auto mb-2" />
                      <p className="text-sm text-slate-400">Location not yet shared</p>
                    </>
                  )}
                  {locStatus === 'fetching' && (
                    <>
                      <Loader2 className="h-10 w-10 text-sky-500 animate-spin mx-auto mb-2" />
                      <p className="text-sm text-sky-500 font-medium">Acquiring GPS signal...</p>
                    </>
                  )}
                  {locStatus === 'success' && (
                    <>
                      <CheckCircle2 className="h-10 w-10 text-emerald-500 mx-auto mb-2" />
                      <p className="text-sm text-emerald-600 dark:text-emerald-400 font-bold mb-1">Location Acquired</p>
                      <p className="text-xs text-emerald-500/70 font-mono bg-emerald-100 dark:bg-emerald-900/50 px-2 py-1 rounded">
                        {location?.lat.toFixed(4)}, {location?.lng.toFixed(4)}
                      </p>
                    </>
                  )}
                  {locStatus === 'error' && (
                    <>
                      <AlertTriangle className="h-10 w-10 text-red-400 mx-auto mb-2" />
                      <p className="text-sm text-red-500 font-medium">Failed to get location</p>
                    </>
                  )}
                </div>
              </div>
              
              <button 
                onClick={handleGetLocation}
                disabled={locStatus === 'fetching'}
                className="w-full bg-gradient-to-r from-slate-800 to-slate-900 dark:from-slate-100 dark:to-white text-white dark:text-slate-900 font-bold py-3.5 rounded-xl hover:shadow-lg transition-all flex items-center justify-center gap-2 disabled:opacity-70">
                {locStatus === 'fetching' ? <Loader2 className="h-4 w-4 animate-spin" /> : <MapPin className="h-4 w-4" />} 
                {locStatus === 'success' ? 'Update Location' : 'Share My Location'}
              </button>
            </div>
          </motion.div>
        </div>

        {/* Nearby Hospitals via OpenStreetMap */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
          <h2 className="text-xl font-black mb-4 text-slate-900 dark:text-white">Nearby Hospitals & Clinics</h2>
          <HospitalMap userLocation={location} />
        </motion.div>
      </div>
    </div>
  );
};

export default Emergency;
