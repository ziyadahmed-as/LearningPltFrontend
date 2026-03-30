import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { register } from '../services/api';
import { BookOpen, User, Mail, Lock, GraduationCap, Users, ArrowRight, ShieldCheck, UserCheck } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { GlassCard } from '../components/glass-card';

export default function RegisterPage() {
  const [form, setForm] = useState({
    username: '', email: '', password: '', password_confirm: '', 
    first_name: '', last_name: '', role: 'STUDENT',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    if (form.password !== form.password_confirm) {
       setError("Security tokens do not align (Password mismatch).");
       return;
    }

    setLoading(true);
    try {
      await register(form);
      navigate('/login');
    } catch (err) {
      const data = err.response?.data;
      if (data) {
        const firstKey = Object.keys(data)[0];
        setError(Array.isArray(data[firstKey]) ? data[firstKey][0] : "Identity initialization failed.");
      } else {
        setError('Connection failure: Registry node unresponsive.');
      }
    }
    setLoading(false);
  };

  const update = (field, value) => setForm({ ...form, [field]: value });

  return (
    <div className="min-h-screen flex items-center justify-center p-6 relative overflow-hidden font-sans selection:bg-indigo-500/20">
      {/* Figma Sync Gradient Background */}
      <div 
        className="absolute inset-0 z-0"
        style={{ background: 'linear-gradient(135deg, #9333EA 0%, #2563EB 100%)' }}
      />
      
      {/* Decorative Overlays */}
      <div className="absolute inset-0 bg-black/5 z-0" />
      <div className="absolute top-0 left-0 w-full h-full bg-grid-white/[0.05] z-0" />
      <div className="absolute -bottom-1/4 -left-1/4 w-[500px] h-[500px] bg-white/10 rounded-full blur-[160px] z-0" />

      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="relative z-10 w-full max-w-3xl"
      >
        <div className="text-center mb-12">
          <Link to="/" className="inline-flex items-center gap-4 mb-8 group">
            <div className="w-14 h-14 bg-white/10 backdrop-blur-md rounded-2xl flex items-center justify-center border border-white/20 shadow-2xl group-hover:rotate-12 transition-transform">
              <BookOpen className="w-8 h-8 text-white" />
            </div>
            <span className="text-4xl font-black text-white italic tracking-tighter">EduTech</span>
          </Link>
          <h1 className="text-4xl font-black text-white mb-4 italic tracking-tight">Begin Genesis</h1>
          <p className="text-white/70 font-medium">Join 50K+ scholars in the synchronized knowledge hub.</p>
        </div>

        <GlassCard className="p-12 bg-white/10 backdrop-blur-3xl border border-white/20 rounded-[3.5rem] shadow-[0_50px_100px_-20px_rgba(0,0,0,0.5)]">
          {/* Role Hub Selector */}
          <div className="flex bg-white/5 p-2 rounded-[2rem] mb-12 border border-white/10">
            <button 
              onClick={() => update('role', 'STUDENT')}
              className={`flex-1 flex items-center justify-center gap-3 py-4 rounded-[1.5rem] text-[10px] font-black uppercase tracking-widest transition-all ${form.role === 'STUDENT' ? 'bg-white text-indigo-950 shadow-xl' : 'text-white/40 hover:text-white hover:bg-white/5'}`}
            >
              <GraduationCap size={18} /> Scholar Node
            </button>
            <button 
              onClick={() => navigate('/instructor-onboarding')}
              className={`flex-1 flex items-center justify-center gap-3 py-4 rounded-[1.5rem] text-[10px] font-black uppercase tracking-widest transition-all ${form.role === 'INSTRUCTOR' ? 'bg-white text-indigo-950 shadow-xl' : 'text-white/40 hover:text-white hover:bg-white/5'}`}
            >
              <Users size={18} /> Faculty Node
            </button>
          </div>

          <AnimatePresence>
            {error && (
              <motion.div 
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="p-5 rounded-3xl bg-rose-500/20 border border-rose-500/20 text-rose-100 text-xs font-black uppercase tracking-widest flex items-center gap-4 mb-10"
              >
                 <ShieldCheck size={20} /> {error}
              </motion.div>
            )}
          </AnimatePresence>

          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
               <div className="space-y-2">
                 <label className="text-[10px] font-black text-white/50 uppercase tracking-widest ml-4">Given Name</label>
                 <input 
                   className="w-full bg-white/5 border border-white/10 rounded-[1.8rem] p-5 text-white placeholder-white/20 focus:outline-none focus:border-white/40 focus:bg-white/10 transition-all font-bold text-sm" 
                   value={form.first_name} 
                   onChange={(e) => update('first_name', e.target.value)} 
                   placeholder="IDENTITY"
                 />
               </div>
               <div className="space-y-2">
                 <label className="text-[10px] font-black text-white/50 uppercase tracking-widest ml-4">Registry Name</label>
                 <input 
                   className="w-full bg-white/5 border border-white/10 rounded-[1.8rem] p-5 text-white placeholder-white/20 focus:outline-none focus:border-white/40 focus:bg-white/10 transition-all font-bold text-sm" 
                   value={form.last_name} 
                   onChange={(e) => update('last_name', e.target.value)} 
                   placeholder="NODE"
                 />
               </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
               <div className="space-y-2">
                 <label className="text-[10px] font-black text-white/50 uppercase tracking-widest ml-4">Public Identifier</label>
                 <div className="relative group">
                   <User className="absolute left-6 top-1/2 -translate-y-1/2 text-white/30 group-focus-within:text-white" size={18} />
                   <input 
                     className="w-full bg-white/5 border border-white/10 rounded-[1.8rem] p-5 pl-14 text-white placeholder-white/20 focus:outline-none focus:border-white/40 focus:bg-white/10 transition-all font-bold text-sm" 
                     value={form.username} 
                     onChange={(e) => update('username', e.target.value)} 
                     placeholder="HUB_ID"
                     required 
                   />
                 </div>
               </div>
               <div className="space-y-2">
                 <label className="text-[10px] font-black text-white/50 uppercase tracking-widest ml-4">Signal Hub (Email)</label>
                 <div className="relative group">
                   <Mail className="absolute left-6 top-1/2 -translate-y-1/2 text-white/30 group-focus-within:text-white" size={18} />
                   <input 
                     className="w-full bg-white/5 border border-white/10 rounded-[1.8rem] p-5 pl-14 text-white placeholder-white/20 focus:outline-none focus:border-white/40 focus:bg-white/10 transition-all font-bold text-sm" 
                     type="email" 
                     value={form.email} 
                     onChange={(e) => update('email', e.target.value)} 
                     placeholder="SIGNAL_PATH"
                     required 
                   />
                 </div>
               </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
               <div className="space-y-2">
                 <label className="text-[10px] font-black text-white/50 uppercase tracking-widest ml-4">Security Protocol</label>
                 <div className="relative group">
                   <Lock className="absolute left-6 top-1/2 -translate-y-1/2 text-white/30 group-focus-within:text-white" size={18} />
                   <input 
                     className="w-full bg-white/5 border border-white/10 rounded-[1.8rem] p-5 pl-14 text-white placeholder-white/20 focus:outline-none focus:border-white/40 focus:bg-white/10 transition-all font-bold text-sm" 
                     type="password" 
                     value={form.password} 
                     onChange={(e) => update('password', e.target.value)} 
                     placeholder="••••••••"
                     required 
                   />
                 </div>
               </div>
               <div className="space-y-2">
                 <label className="text-[10px] font-black text-white/50 uppercase tracking-widest ml-4">Verify Token</label>
                 <div className="relative group">
                   <UserCheck className="absolute left-6 top-1/2 -translate-y-1/2 text-white/30 group-focus-within:text-white" size={18} />
                   <input 
                     className="w-full bg-white/5 border border-white/10 rounded-[1.8rem] p-5 pl-14 text-white placeholder-white/20 focus:outline-none focus:border-white/40 focus:bg-white/10 transition-all font-bold text-sm" 
                     type="password" 
                     value={form.password_confirm} 
                     onChange={(e) => update('password_confirm', e.target.value)} 
                     placeholder="••••••••"
                     required 
                   />
                 </div>
               </div>
            </div>

            <button 
              className="group relative w-full py-5 mt-4 bg-white text-indigo-950 font-black text-[10px] uppercase tracking-[0.3em] rounded-[1.8rem] transition-all hover:scale-[1.02] active:scale-[0.98] shadow-2xl disabled:opacity-50" 
              type="submit" 
              disabled={loading}
            >
               <span className="relative z-10 flex items-center justify-center gap-3">
                {loading ? (
                    <div className="w-5 h-5 border-4 border-indigo-950/20 border-t-indigo-950 rounded-full animate-spin" />
                  ) : (
                    <>Initialize Hub Identity <ArrowRight size={18} /></>
                  )}
               </span>
            </button>
          </form>

          <p className="mt-12 text-center text-white/40 text-xs font-black uppercase tracking-[0.2em]">
            Synced Before? <Link to="/login" className="text-white hover:text-indigo-200 transition-colors underline decoration-white/20 underline-offset-4">Authenticate Peer</Link>
          </p>
        </GlassCard>
      </motion.div>
    </div>
  );
}
