import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { updateMe } from '../services/api';
import { motion, AnimatePresence } from 'motion/react';
import DashboardLayout from '../components/DashboardLayout';
import { GlassCard } from '../components/glass-card';
import { 
  User, Mail, Shield, Camera, Lock, CheckCircle, 
  AlertCircle, Loader2, ArrowRight, ShieldCheck,
  Globe, Fingerprint, Key, RefreshCw, Zap, ShieldAlert
} from 'lucide-react';

export default function ProfilePage() {
  const { user, fetchUser } = useAuth();
  const [form, setForm] = useState({
    first_name: user?.first_name || '',
    last_name: user?.last_name || '',
    bio: user?.bio || '',
  });
  const [picFile, setPicFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [passwordForm, setPasswordForm] = useState({ password: '', confirm_password: '' });
  const [msg, setMsg] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMsg('');
    setError('');
    setLoading(true);
    const formData = new FormData();
    Object.keys(form).forEach(key => formData.append(key, form[key]));
    if (picFile) formData.append('profile_picture', picFile);
    try {
      await updateMe(formData);
      await fetchUser();
      setMsg('Identity flux synchronized successfully.');
    } catch {
      setError('Signal failure: Neural link sync failed.');
    }
    setLoading(false);
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    setMsg('');
    setError('');
    if (passwordForm.password.length < 6) {
      setError('Security violation: Insufficient entropy.');
      return;
    }
    if (passwordForm.password !== passwordForm.confirm_password) {
      setError('Protocol mismatch: Security tokens do not align.');
      return;
    }
    setLoading(true);
    try {
      await updateMe({ password: passwordForm.password });
      setMsg('Encryption keys rotated.');
      setPasswordForm({ password: '', confirm_password: '' });
    } catch {
      setError('Security failure: Key rotation rejected.');
    }
    setLoading(false);
  };

  const update = (field, value) => setForm({ ...form, [field]: value });
  const updatePass = (field, value) => setPasswordForm({ ...passwordForm, [field]: value });

  return (
    <DashboardLayout 
      title="Identity Profile" 
      subtitle="Management of core nodes and secure metadata"
    >
      <div className="max-w-6xl mx-auto space-y-16">
        
        {/* Profile Identity Header */}
        <div className="flex flex-col xl:flex-row items-center gap-12 border-b border-slate-100 pb-20">
           <div className="relative group">
              <motion.div 
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="w-48 h-48 rounded-[3.5rem] bg-indigo-600 p-2 shadow-2xl shadow-indigo-600/20 relative"
              >
                 <div className="w-full h-full rounded-[calc(3.5rem-8px)] bg-white overflow-hidden flex items-center justify-center relative border border-white/20">
                    {picFile ? (
                      <img src={URL.createObjectURL(picFile)} alt="" className="w-full h-full object-cover" />
                    ) : user?.profile_picture ? (
                      <img src={user.profile_picture} alt="" className="w-full h-full object-cover" />
                    ) : (
                      <User size={80} className="text-slate-100" />
                    )}
                    
                    <label className="absolute inset-0 bg-indigo-600/90 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer backdrop-blur-sm">
                       <Camera className="text-white" size={40} />
                       <input type="file" accept="image/*" onChange={(e) => setPicFile(e.target.files[0])} className="hidden" />
                    </label>
                 </div>
              </motion.div>
              <div className="absolute -bottom-2 -right-2 w-12 h-12 bg-emerald-500 rounded-2xl border-4 border-[#F8FAFC] flex items-center justify-center text-white shadow-xl">
                 <ShieldCheck size={24} />
              </div>
           </div>

           <div className="text-center xl:text-left space-y-4">
              <div className="flex flex-col xl:flex-row xl:items-end gap-4 xl:gap-6">
                 <h1 className="text-5xl md:text-7xl font-black text-slate-900 italic tracking-tighter uppercase leading-none">{user?.username}</h1>
                 <span className="px-6 py-2 bg-indigo-50 text-indigo-600 text-[10px] font-black uppercase tracking-[0.4em] rounded-full border border-indigo-100 flex-shrink-0 mb-2">{user?.role} NODE</span>
              </div>
              <div className="flex flex-wrap items-center justify-center xl:justify-start gap-8">
                 <div className="flex items-center gap-3 text-slate-400 text-xs font-black uppercase tracking-widest italic">
                    <Mail size={16} className="text-indigo-400" /> {user?.email}
                 </div>
                 <div className="flex items-center gap-3 text-slate-400 text-xs font-black uppercase tracking-widest italic">
                    <Globe size={16} className="text-emerald-400" /> Central Hub Synced
                 </div>
              </div>
           </div>
        </div>

        {/* Action Feedbacks */}
        <AnimatePresence>
            {(msg || error) && (
              <motion.div 
                 initial={{ opacity: 0, x: 20 }}
                 animate={{ opacity: 1, x: 0 }}
                 exit={{ opacity: 0, x: -20 }}
                 className={`p-8 rounded-[2.5rem] border shadow-2xl flex items-center gap-6 ${msg ? 'bg-emerald-50 border-emerald-200 text-emerald-600' : 'bg-rose-50 border-rose-200 text-rose-600'}`}
              >
                 <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${msg ? 'bg-emerald-200' : 'bg-rose-200'}`}>
                    {msg ? <CheckCircle size={24} /> : <AlertCircle size={24} />}
                 </div>
                 <span className="text-sm font-black uppercase tracking-[0.2em] italic">{msg || error}</span>
              </motion.div>
            )}
        </AnimatePresence>

        <div className="grid grid-cols-1 xl:grid-cols-12 gap-16 items-start">
           
           {/* Primary Bio-Data */}
           <div className="xl:col-span-8 space-y-10">
              <h2 className="text-xs font-black text-indigo-600 uppercase tracking-[0.5em] italic flex items-center gap-4">
                 <Fingerprint size={24} /> Neural Identity Index
              </h2>
              
              <GlassCard className="p-12 bg-white border-slate-100 shadow-2xl shadow-slate-200/40">
                 <form onSubmit={handleSubmit} className="space-y-10">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                       <div className="space-y-3">
                          <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-4 leading-none italic">Given Identifier</label>
                          <input 
                             className="w-full h-16 px-8 bg-slate-50 border border-slate-100 rounded-3xl text-sm font-black text-slate-900 focus:ring-1 focus:ring-indigo-600/10 focus:bg-white transition-all uppercase italic" 
                             value={form.first_name} 
                             onChange={(e) => update('first_name', e.target.value)} 
                          />
                       </div>
                       <div className="space-y-3">
                          <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-4 leading-none italic">Family Identifier</label>
                          <input 
                             className="w-full h-16 px-8 bg-slate-50 border border-slate-100 rounded-3xl text-sm font-black text-slate-900 focus:ring-1 focus:ring-indigo-600/10 focus:bg-white transition-all uppercase italic" 
                             value={form.last_name} 
                             onChange={(e) => update('last_name', e.target.value)} 
                          />
                       </div>
                    </div>
                    
                    <div className="space-y-3">
                       <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-4 leading-none italic">Professional Narrative</label>
                       <textarea 
                          className="w-full bg-slate-50 border border-slate-100 rounded-[2.5rem] p-8 text-sm font-black text-slate-900 min-h-[220px] focus:ring-1 focus:ring-indigo-600/10 focus:bg-white transition-all uppercase italic !leading-relaxed" 
                          value={form.bio} 
                          onChange={(e) => update('bio', e.target.value)} 
                          placeholder="SYNC YOUR CAREER BIOLOGY WITH THE HUB..."
                       />
                    </div>

                    <div className="flex justify-end pt-6">
                       <button 
                         className="px-14 py-6 bg-slate-900 text-white rounded-3xl font-black text-xs uppercase tracking-[0.4em] hover:bg-indigo-600 hover:scale-105 active:scale-95 transition-all shadow-2xl flex items-center gap-4 disabled:opacity-50" 
                         type="submit" 
                         disabled={loading}
                       >
                          {loading ? <RefreshCw className="animate-spin" size={20} /> : <>Commit Identity Flux <ArrowRight size={20} /></>}
                       </button>
                    </div>
                 </form>
              </GlassCard>
           </div>

           {/* Security Constraints */}
           <div className="xl:col-span-4 space-y-12">
              <div className="space-y-10">
                 <h2 className="text-xs font-black text-rose-600 uppercase tracking-[0.5em] italic flex items-center gap-4">
                    <Lock size={24} /> Encryption Hub
                 </h2>
                 
                 <GlassCard className="p-12 bg-white border-slate-100 shadow-xl">
                    <form onSubmit={handlePasswordSubmit} className="space-y-10">
                       <div className="space-y-3">
                          <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-4 leading-none">Security Token</label>
                          <input 
                             className="w-full h-16 px-8 bg-slate-50 border border-slate-100 rounded-2xl text-slate-900 focus:ring-1 focus:ring-rose-600/10 transition-all font-black text-xs uppercase" 
                             type="password" 
                             required
                             placeholder="6+ ENTROPY UNITS"
                             value={passwordForm.password} 
                             onChange={(e) => updatePass('password', e.target.value)} 
                          />
                       </div>
                       <div className="space-y-3">
                          <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-4 leading-none">Re-verify Key</label>
                          <input 
                             className="w-full h-16 px-8 bg-slate-50 border border-slate-100 rounded-2xl text-slate-900 focus:ring-1 focus:ring-rose-600/10 transition-all font-black text-xs uppercase" 
                             type="password" 
                             required
                             placeholder="ALIGNED RE-INPUT"
                             value={passwordForm.confirm_password} 
                             onChange={(e) => updatePass('confirm_password', e.target.value)} 
                          />
                       </div>
                       <button className="w-full py-6 bg-rose-50 text-rose-600 border border-rose-100 rounded-3xl font-black uppercase tracking-[0.3em] text-[10px] hover:bg-rose-600 hover:text-white transition-all shadow-xl active:scale-95 italic" type="submit" disabled={loading}>
                          Rotate Protocol Key
                       </button>
                    </form>
                 </GlassCard>
              </div>

              {/* Security Metrics Card */}
              <div className="p-10 rounded-[3rem] bg-indigo-600 text-white space-y-8 relative overflow-hidden group shadow-2xl shadow-indigo-600/30">
                 <div className="absolute inset-0 bg-grid-white/[0.1] z-0" />
                 <div className="relative z-10 flex items-center justify-between">
                    <p className="text-[10px] font-black uppercase tracking-[0.4em] text-white/60">Node Integrity</p>
                    <ShieldCheck size={20} className="text-emerald-400" />
                 </div>
                 <div className="relative z-10 space-y-2 text-right">
                    <p className="text-5xl font-black italic tracking-tighter leading-none uppercase">Alpha</p>
                    <p className="text-[10px] font-black uppercase tracking-[0.3em] text-white/40">Encryption Layer 14</p>
                 </div>
                 <div className="relative z-10 h-1.5 bg-white/10 rounded-full overflow-hidden">
                    <motion.div initial={{ width: 0 }} animate={{ width: '100%' }} transition={{ duration: 2 }} className="h-full bg-emerald-400" />
                 </div>
              </div>
           </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
