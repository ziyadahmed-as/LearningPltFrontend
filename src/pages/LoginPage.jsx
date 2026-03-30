import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { login } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { BookOpen, User, Lock, TrendingUp, ArrowRight, Globe, GitBranch } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { GlassCard } from '../components/glass-card';

export default function LoginPage() {
  const [form, setForm] = useState({ username: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { loginUser } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const { data } = await login(form);
      loginUser(data);
      navigate('/courses');
    } catch (err) {
      setError(err.response?.data?.detail || 'Identity Verification Failed');
    }
    setLoading(false);
  };

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
      <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-white/10 rounded-full blur-[120px] z-0" />

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="relative z-10 w-full max-w-lg"
      >
        <div className="text-center mb-12">
          <Link to="/" className="inline-flex items-center gap-4 mb-8 group">
            <div className="w-14 h-14 bg-white/10 backdrop-blur-md rounded-2xl flex items-center justify-center border border-white/20 shadow-2xl group-hover:rotate-12 transition-transform">
              <BookOpen className="w-8 h-8 text-white" />
            </div>
            <span className="text-4xl font-black text-white italic tracking-tighter">EduTech</span>
          </Link>
          <h1 className="text-4xl font-black text-white mb-4 italic tracking-tight">Portal Entry</h1>
          <p className="text-white/70 font-medium">Synchronizing your professional journey.</p>
        </div>

        <GlassCard className="p-12 bg-white/10 backdrop-blur-3xl border border-white/20 rounded-[3.5rem] shadow-[0_50px_100px_-20px_rgba(0,0,0,0.5)]">
          <AnimatePresence>
            {error && (
              <motion.div 
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="p-5 rounded-3xl bg-rose-500/20 border border-rose-500/20 text-rose-100 text-xs font-black uppercase tracking-widest flex items-center gap-4 mb-10"
              >
                <div className="w-8 h-8 rounded-xl bg-rose-500/20 flex items-center justify-center flex-shrink-0">!</div>
                {error}
              </motion.div>
            )}
          </AnimatePresence>

          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="space-y-2">
              <label className="text-[10px] font-black text-white/50 uppercase tracking-[0.3em] ml-4">Node Identifier</label>
              <div className="relative group">
                <User size={18} className="absolute left-6 top-1/2 -translate-y-1/2 text-white/30 group-focus-within:text-white transition-colors" />
                <input
                  className="w-full bg-white/5 border border-white/10 rounded-[1.8rem] p-5 pl-14 text-white placeholder-white/20 focus:outline-none focus:border-white/40 focus:bg-white/10 transition-all font-bold text-sm"
                  type="text"
                  placeholder="USERNAME"
                  value={form.username}
                  onChange={(e) => setForm({ ...form, username: e.target.value })}
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black text-white/50 uppercase tracking-[0.3em] ml-4">Security Protocol</label>
              <div className="relative group">
                <Lock size={18} className="absolute left-6 top-1/2 -translate-y-1/2 text-white/30 group-focus-within:text-white transition-colors" />
                <input
                  className="w-full bg-white/5 border border-white/10 rounded-[1.8rem] p-5 pl-14 text-white placeholder-white/20 focus:outline-none focus:border-white/40 focus:bg-white/10 transition-all font-bold text-sm"
                  type="password"
                  placeholder="••••••••"
                  value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                  required
                />
              </div>
            </div>

            <div className="pt-6">
              <button 
                className="group relative w-full py-5 bg-white text-indigo-950 font-black text-[10px] uppercase tracking-[0.3em] rounded-[1.8rem] transition-all hover:scale-[1.02] active:scale-[0.98] shadow-2xl disabled:opacity-50" 
                type="submit" 
                disabled={loading}
              >
                 <span className="flex items-center justify-center gap-3">
                  {loading ? (
                    <div className="w-5 h-5 border-4 border-indigo-950/20 border-t-indigo-950 rounded-full animate-spin" />
                  ) : (
                    <>Establish Connection <ArrowRight size={18} /></>
                  )}
                </span>
              </button>
            </div>
            
            <div className="grid grid-cols-2 gap-4 mt-8">
               <button type="button" className="flex items-center justify-center gap-3 py-4 bg-white/5 border border-white/10 rounded-2xl hover:bg-white/10 transition-all">
                  <Globe size={18} className="text-white" />
                  <span className="text-[10px] font-black text-white uppercase tracking-widest">Google Hub</span>
               </button>
               <button type="button" className="flex items-center justify-center gap-3 py-4 bg-white/5 border border-white/10 rounded-2xl hover:bg-white/10 transition-all">
                  <GitBranch size={18} className="text-white" />
                  <span className="text-[10px] font-black text-white uppercase tracking-widest">Github Node</span>
               </button>
            </div>
          </form>

          <p className="mt-12 text-center text-white/40 text-xs font-black uppercase tracking-[0.2em]">
            New Scholar? <Link to="/register" className="text-white hover:text-indigo-200 transition-colors underline decoration-white/20 underline-offset-4">Register Hub</Link>
          </p>
        </GlassCard>
      </motion.div>
    </div>
  );
}
