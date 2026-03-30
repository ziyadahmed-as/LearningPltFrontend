import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { 
  GraduationCap, BookOpen, Users, Star, 
  ArrowRight, Play, CheckCircle, ShieldCheck,
  Zap, Clock, Globe, Award, Sparkles, LayoutGrid, ChevronRight
} from 'lucide-react';
import { getCourses, getCategories } from '../services/api';
import CourseCard from '../components/CourseCard';
import { GlassCard } from '../components/glass-card';

// ─── Design Tokens (Figma Sync) ──────────────────────────────────────────────
const FIGMA_PURPLE = "#9333EA";
const FIGMA_BLUE = "#2563EB";
const FIGMA_YELLOW = "#EAB308";

export default function HomePage() {
  const [courses, setCourses] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [cRes, catRes] = await Promise.all([getCourses(), getCategories()]);
        setCourses((Array.isArray(cRes.data) ? cRes.data : cRes.data.results || []).slice(0, 6));
        setCategories(Array.isArray(catRes.data) ? catRes.data : catRes.data.results || []);
      } catch (err) {
        console.error('Failed to load portal data:', err);
      }
      setLoading(false);
    };
    fetchData();
  }, []);

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-900 overflow-x-hidden font-sans selection:bg-indigo-500/20">
      
      {/* ─── Hero Section (Full Figma Sync) ─── */}
      <section className="relative min-h-[100vh] flex items-center pt-24 pb-32 overflow-hidden">
        {/* Dynamic Gradient Background */}
        <div 
          className="absolute inset-0 z-0"
          style={{ 
            background: `linear-gradient(135deg, ${FIGMA_PURPLE} 0%, ${FIGMA_BLUE} 100%)`,
          }}
        />
        
        {/* Abstract Background Elements */}
        <div className="absolute top-0 right-0 w-[60%] h-full opacity-20 z-10 select-none">
           <div className="absolute top-20 right-20 w-96 h-96 bg-white rounded-full blur-[160px]" />
           <div className="absolute bottom-20 left-20 w-80 h-80 bg-indigo-200 rounded-full blur-[140px]" />
        </div>

        {/* Content Container */}
        <div className="container mx-auto px-10 relative z-20">
           <div className="max-w-5xl">
              <motion.div
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                className="space-y-12"
              >
                 <div className="space-y-4">
                    <span className="inline-flex items-center gap-2 px-6 py-2 bg-white/10 backdrop-blur-md rounded-full text-white text-xs font-black uppercase tracking-[0.3em] border border-white/20">
                       <Sparkles size={16} className="text-[#EAB308]" /> Global Knowledge Hub
                    </span>
                    <h1 className="text-6xl md:text-8xl font-black text-white italic tracking-tighter leading-[0.95] drop-shadow-2xl">
                       Master Entrance Exams & <br/>
                       <span style={{ color: FIGMA_YELLOW }}>Future Tech Skills</span>
                    </h1>
                 </div>
                 
                 <p className="text-xl md:text-2xl font-medium text-white/80 max-w-3xl leading-relaxed">
                    Learn from world-class experts. Prepare smarter with modern curricula. <br/>
                    Build the future you've always imagined with FATRA Academy.
                 </p>

                 <div className="flex flex-wrap gap-6 pt-4">
                    <button 
                      onClick={() => navigate('/courses')}
                      className="px-12 py-5 bg-white text-indigo-950 rounded-2xl font-black text-sm uppercase tracking-[0.2em] shadow-2xl hover:scale-105 active:scale-95 transition-all flex items-center gap-3"
                    >
                       Browse Courses <ArrowRight size={20} />
                    </button>
                    <button 
                      onClick={() => navigate('/register')}
                      className="px-12 py-5 bg-white/10 backdrop-blur-md text-white rounded-2xl font-black text-sm uppercase tracking-[0.2em] border border-white/20 hover:bg-white/20 active:scale-95 transition-all flex items-center gap-3"
                    >
                       Start Learning <Play size={20} fill="currentColor" />
                    </button>
                 </div>

                 {/* Social Trust Metrics */}
                 <div className="flex items-center gap-10 pt-10 border-t border-white/10 w-fit">
                    <div className="flex flex-col">
                       <span className="text-3xl font-black text-white leading-none">50K+</span>
                       <span className="text-[10px] font-black text-white/50 uppercase tracking-widest mt-1">Active Scholars</span>
                    </div>
                    <div className="w-px h-10 bg-white/10" />
                    <div className="flex flex-col">
                       <span className="text-3xl font-black text-white leading-none">4.9/5</span>
                       <span className="text-[10px] font-black text-white/50 uppercase tracking-widest mt-1">Global Rating</span>
                    </div>
                    <div className="w-px h-10 bg-white/10" />
                    <div className="flex flex-col">
                       <span className="text-3xl font-black text-white leading-none">200+</span>
                       <span className="text-[10px] font-black text-white/50 uppercase tracking-widest mt-1">Expert Hubs</span>
                    </div>
                 </div>
              </motion.div>
           </div>
        </div>

        {/* Floating Card UI Components (Figma Aesthetic) */}
        <div className="hidden lg:block absolute bottom-20 right-10 relative z-30 translate-x-20">
           <motion.div 
             animate={{ y: [0, -20, 0] }}
             transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
             className="w-80 p-8 bg-white/10 backdrop-blur-3xl border border-white/20 rounded-[3rem] shadow-[0_50px_100px_-20px_rgba(0,0,0,0.5)] rotate-3"
           >
              <div className="flex items-center gap-4 mb-6">
                 <div className="w-12 h-12 bg-[#EAB308] rounded-2xl flex items-center justify-center text-white">
                    <Award size={24} />
                 </div>
                 <div>
                    <h3 className="text-xs font-black text-white uppercase tracking-widest leading-none mb-1">IEEE Certified</h3>
                    <p className="text-[10px] text-white/50 font-bold uppercase tracking-widest">Global Accreditation</p>
                 </div>
              </div>
              <div className="space-y-4">
                 {[1,2,3].map(i => (
                    <div key={i} className="flex items-center gap-3">
                       <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                       <div className="h-1 bg-white/10 rounded-full flex-1" />
                    </div>
                 ))}
              </div>
           </motion.div>
        </div>
      </section>

      {/* ─── Institutional Trust Marquee ─── */}
      <div className="py-12 bg-white border-y border-slate-100 flex items-center overflow-hidden whitespace-nowrap">
        <div className="flex items-center gap-24 animate-[marquee_50s_linear_infinite] px-12">
           {[
             'STANFORD NETWORK', 'MIT DIGITAL HUB', 'OXFORD ACADEMY', 'GOOGLE EDU',
             'HARVARD ONLINE', 'CAMBRIDGE SYNC', 'IEEE PARTNER', 'UNESCO HUBS'
           ].map(trust => (
             <span key={trust} className="text-2xl font-black text-slate-200 uppercase tracking-[0.4em] italic leading-none">{trust}</span>
           ))}
        </div>
        <div className="flex items-center gap-24 animate-[marquee_50s_linear_infinite] px-12">
           {[
             'STANFORD NETWORK', 'MIT DIGITAL HUB', 'OXFORD ACADEMY', 'GOOGLE EDU',
             'HARVARD ONLINE', 'CAMBRIDGE SYNC', 'IEEE PARTNER', 'UNESCO HUBS'
           ].map(trust => (
             <span key={trust} className="text-2xl font-black text-slate-200 uppercase tracking-[0.4em] italic leading-none">{trust}</span>
           ))}
        </div>
      </div>

      {/* ─── Bento Features Grid ─── */}
      <section className="py-32 bg-slate-50 relative overflow-hidden">
         <div className="container mx-auto px-10 relative z-10">
            <div className="text-center mb-24 max-w-3xl mx-auto space-y-4">
               <h2 className="text-xs font-black text-indigo-600 uppercase tracking-[0.5em] leading-none mb-4">Core Ecosystem</h2>
               <h3 className="text-5xl md:text-6xl font-black text-slate-900 tracking-tighter italic leading-none">Curated Modules for Global Excellence</h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
               <div className="md:col-span-8">
                  <GlassCard className="h-full p-12 bg-white relative group overflow-hidden border-slate-100">
                     <div className="absolute top-0 right-0 w-80 h-80 bg-indigo-50 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2" />
                     <div className="relative z-10 flex flex-col h-full justify-between">
                        <div>
                           <div className="w-16 h-16 bg-indigo-600 rounded-3xl flex items-center justify-center text-white shadow-xl shadow-indigo-600/20 mb-10 group-hover:rotate-12 transition-transform">
                              <Zap size={32} />
                           </div>
                           <h4 className="text-4xl font-black text-slate-900 tracking-tight leading-none mb-6 italic">Synchronized Accelerated Learning</h4>
                           <p className="text-lg text-slate-500 font-medium leading-relaxed max-w-2xl">
                              Our neural-trained algorithms adapt to your specific cognitive patterns, ensuring every module is absorbed at peak efficiency.
                           </p>
                        </div>
                        <div className="mt-12 flex items-center gap-4 text-indigo-600 font-black uppercase text-[10px] tracking-widest cursor-pointer group/link">
                           Learn Protocol <ChevronRight size={16} className="group-hover/link:translate-x-2 transition-transform" />
                        </div>
                     </div>
                  </GlassCard>
               </div>
               
               <div className="md:col-span-4">
                  <GlassCard className="h-full p-12 bg-indigo-600 relative group overflow-hidden shadow-2xl shadow-indigo-600/20 border-white/10">
                     <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-black/20 to-transparent" />
                     <div className="relative z-10 text-white flex flex-col h-full justify-between">
                        <div>
                           <div className="w-16 h-16 bg-white/10 backdrop-blur-md rounded-3xl flex items-center justify-center text-white border border-white/20 mb-10">
                              <Globe size={32} />
                           </div>
                           <h4 className="text-4xl font-black text-white tracking-tight leading-none mb-6 italic">Global Connectivity</h4>
                           <p className="text-white/70 font-medium leading-relaxed">
                              Bridge the gap between local curricula and global tech demands.
                           </p>
                        </div>
                     </div>
                  </GlassCard>
               </div>

               <div className="md:col-span-4">
                  <GlassCard className="p-10 bg-white border-slate-100 group">
                     <div className="w-14 h-14 bg-emerald-500/10 rounded-2xl flex items-center justify-center text-emerald-600 mb-8 border border-emerald-500/20">
                        <CheckCircle size={24} />
                     </div>
                     <h4 className="text-2xl font-black text-slate-900 mb-4 uppercase tracking-tighter italic">Verified Assets</h4>
                     <p className="text-slate-500 text-sm font-medium leading-relaxed">Every course is peer-reviewed by our Faculty Registry for academic clinical integrity.</p>
                  </GlassCard>
               </div>

               <div className="md:col-span-4">
                  <GlassCard className="p-10 bg-white border-slate-100 group">
                     <div className="w-14 h-14 bg-amber-500/10 rounded-2xl flex items-center justify-center text-amber-600 mb-8 border border-amber-500/20">
                        <Clock size={24} />
                     </div>
                     <h4 className="text-2xl font-black text-slate-900 mb-4 uppercase tracking-tighter italic">Temporal Flow</h4>
                     <p className="text-slate-500 text-sm font-medium leading-relaxed">Access modules at any timestamp. Your learning never expires on our decentralized hub.</p>
                  </GlassCard>
               </div>

               <div className="md:col-span-4">
                  <GlassCard className="p-10 bg-white border-slate-100 group">
                     <div className="w-14 h-14 bg-rose-500/10 rounded-2xl flex items-center justify-center text-rose-600 mb-8 border border-rose-500/20">
                        <Users size={24} />
                     </div>
                     <h4 className="text-2xl font-black text-slate-900 mb-4 uppercase tracking-tighter italic">Identity Guilds</h4>
                     <p className="text-slate-500 text-sm font-medium leading-relaxed">Join a network of scholars aligned with your specific path to collective mastery.</p>
                  </GlassCard>
               </div>
            </div>
         </div>
      </section>

      {/* ─── Explore Learning Paths ─── */}
      <section className="py-32 bg-white relative overflow-hidden">
         <div className="absolute top-0 left-1/2 w-full h-[800px] bg-slate-50/50 rounded-full blur-[160px] -translate-x-1/2 -translate-y-1/2" />
         
         <div className="container mx-auto px-10 relative z-10">
            <div className="text-center mb-24 max-w-4xl mx-auto space-y-6">
               <h2 className="text-xs font-black text-indigo-600 uppercase tracking-[0.5em] leading-none">Curricular Specialization</h2>
               <h3 className="text-5xl md:text-7xl font-black text-slate-900 tracking-tighter italic leading-none">Explore Learning Paths</h3>
               <p className="text-lg text-slate-500 font-medium max-w-2xl mx-auto leading-relaxed">
                  Decentralized paths designed for every phase of scholarly evolution. Choose your transmission mode.
               </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
               {/* Live Tutorial Hub */}
               <motion.div 
                 whileHover={{ y: -20 }}
                 className="p-12 bg-white border border-slate-100 rounded-[3rem] shadow-2xl shadow-slate-200/50 group h-full flex flex-col justify-between"
               >
                  <div>
                    <div className="w-20 h-20 bg-rose-600 rounded-[2rem] flex items-center justify-center text-white shadow-xl shadow-rose-600/20 mb-12 group-hover:scale-110 transition-transform">
                       <div className="relative">
                          <div className="absolute inset-0 bg-white rounded-full animate-ping opacity-20" />
                          <Zap size={40} className="relative z-10" />
                       </div>
                    </div>
                    <h4 className="text-3xl font-black text-slate-900 tracking-tight leading-none mb-6 italic">Live Tutorial Hubs</h4>
                    <p className="text-slate-500 font-medium leading-relaxed mb-10">
                       Real-time synchronized transmission with faculty nodes. Direct scholarly interaction and instant peer-validation sessions.
                    </p>
                  </div>
                  <Link 
                    to="/courses?type=LIVE_TUTORIAL"
                    className="flex items-center gap-4 text-rose-600 font-black uppercase text-[10px] tracking-widest group/btn"
                  >
                    Initialize Connection <ArrowRight size={16} className="group-hover/btn:translate-x-2 transition-transform" />
                  </Link>
               </motion.div>

               {/* Hard Skill Pre-recorded */}
               <motion.div 
                 whileHover={{ y: -20 }}
                 className="p-12 bg-slate-950 rounded-[3rem] shadow-2xl shadow-slate-950/20 group h-full flex flex-col justify-between"
               >
                  <div>
                    <div className="w-20 h-20 bg-indigo-500 rounded-[2rem] flex items-center justify-center text-white shadow-xl shadow-indigo-600/20 mb-12 group-hover:scale-110 transition-transform">
                       <BookOpen size={40} />
                    </div>
                    <h4 className="text-3xl font-black text-white tracking-tight leading-none mb-6 italic uppercase tracking-tighter">Hard Skill Matrices</h4>
                    <p className="text-slate-400 font-medium leading-relaxed mb-10">
                       Pre-recorded modular assets for technical mastery. Deep-dive curriculum indices focused on engineering and clinical integrity.
                    </p>
                  </div>
                  <Link 
                    to="/courses?type=HARD_SKILL_RECORDED"
                    className="flex items-center gap-4 text-indigo-400 font-black uppercase text-[10px] tracking-widest group/btn"
                  >
                    Sync Matrix <ArrowRight size={16} className="group-hover/btn:translate-x-2 transition-transform" />
                  </Link>
               </motion.div>

               {/* Soft Skill Mastery */}
               <motion.div 
                 whileHover={{ y: -20 }}
                 className="p-12 bg-white border border-slate-100 rounded-[3rem] shadow-2xl shadow-slate-200/50 group h-full flex flex-col justify-between"
               >
                  <div>
                    <div className="w-20 h-20 bg-amber-500 rounded-[2rem] flex items-center justify-center text-white shadow-xl shadow-amber-600/20 mb-12 group-hover:scale-110 transition-transform">
                       <Award size={40} />
                    </div>
                    <h4 className="text-3xl font-black text-slate-900 tracking-tight leading-none mb-6 italic">Soft Skill Masteries</h4>
                    <p className="text-slate-500 font-medium leading-relaxed mb-10">
                       Non-technical cognitive protocols. Master communication, leadership, and emotional intelligence in a hub of interpersonal excellence.
                    </p>
                  </div>
                  <Link 
                    to="/courses?type=SOFT_SKILL"
                    className="flex items-center gap-4 text-amber-600 font-black uppercase text-[10px] tracking-widest group/btn"
                  >
                    Deploy Path <ArrowRight size={16} className="group-hover/btn:translate-x-2 transition-transform" />
                  </Link>
               </motion.div>
            </div>
         </div>
      </section>

      {/* ─── Latest Course Nodes ─── */}
      <section className="py-32 bg-white relative">
         <div className="container mx-auto px-10">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-10 mb-24 border-b border-slate-100 pb-16">
               <div className="space-y-4">
                  <h2 className="text-xs font-black text-indigo-600 uppercase tracking-[0.5em] leading-none">Curricular Assets</h2>
                  <h3 className="text-5xl md:text-7xl font-black text-slate-900 tracking-tighter italic leading-none">Certified Mastery Modules</h3>
               </div>
               <button 
                 onClick={() => navigate('/courses')}
                 className="px-10 py-4 bg-slate-950 text-white rounded-2xl font-black text-[10px] uppercase tracking-[0.3em] flex items-center gap-3 hover:bg-slate-800 transition-all shadow-xl"
               >
                  Full Repository Index <LayoutGrid size={18} />
               </button>
            </div>

            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
                {[1,2,3].map(i => (
                  <div key={i} className="h-[400px] bg-slate-50 animate-pulse rounded-[3rem]" />
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
                {courses.map(course => <CourseCard key={course.id} course={course} />)}
              </div>
            )}
         </div>
      </section>

      {/* ─── Faculty Recruitment Block ─── */}
      <section className="py-32 bg-[#F8FAFC]">
         <div className="container mx-auto px-10">
            <div 
               className="rounded-[4rem] p-16 md:p-32 relative overflow-hidden flex flex-col md:flex-row items-center gap-20 group"
               style={{ 
                 background: `linear-gradient(135deg, ${FIGMA_PURPLE} 0%, ${FIGMA_BLUE} 100%)`,
               }}
            >
               <div className="absolute inset-0 bg-white/5 opacity-50 backdrop-blur-3xl group-hover:bg-white/10 transition-all pointer-events-none" />
               
               <div className="absolute top-0 left-0 w-full h-full bg-grid-white/[0.05] z-0" />
               
               <div className="relative z-10 flex-1 space-y-12">
                  <h3 className="text-5xl md:text-8xl font-black text-white italic tracking-tighter leading-[0.9] drop-shadow-2xl">
                     Initialize Your <br/> Faculty Node
                  </h3>
                  <p className="text-xl md:text-2xl font-medium text-white/80 max-w-2xl leading-relaxed">
                     Deploy your intellectual capital to the FATRA Academy global network. Register as a peer-validated instructor and reach students on every continent.
                  </p>
                  <button 
                    onClick={() => navigate('/instructor-onboarding')}
                    className="px-12 py-5 bg-white text-indigo-950 rounded-2xl font-black text-sm uppercase tracking-[0.2em] shadow-xl hover:scale-105 active:scale-95 transition-all flex items-center gap-3 w-fit"
                  >
                     Apply for Certification <ShieldCheck size={20} />
                  </button>
               </div>

               <div className="relative z-10 flex-shrink-0">
                  <div className="w-80 h-80 bg-white/10 backdrop-blur-3xl border border-white/20 rounded-full flex items-center justify-center p-8 relative overflow-hidden">
                     <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/20 to-transparent" />
                     <GraduationCap size={160} className="text-white relative z-10 transform scale-125" />
                  </div>
               </div>
            </div>
         </div>
      </section>

      {/* ─── Corporate Footer ─── */}
      <footer className="bg-white border-t border-slate-100 pt-32 pb-16">
         <div className="container mx-auto px-10">
            <div className="grid grid-cols-1 md:grid-cols-12 gap-20 mb-32">
               <div className="md:col-span-5 space-y-10">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-indigo-600 rounded-2xl flex items-center justify-center text-white shadow-lg">
                      <BookOpen className="w-7 h-7" />
                    </div>
                    <span className="text-3xl font-black tracking-tighter text-slate-900 italic">FATRA Academy</span>
                  </div>
                  <p className="text-slate-500 font-medium text-lg leading-relaxed max-w-md">
                     The global standard for synchronized, peer-validated education artifacts. Bridging the gap between theory and industry mastery.
                  </p>
               </div>

               <div className="md:col-span-7 grid grid-cols-2 sm:grid-cols-3 gap-16">
                  <div className="space-y-8">
                     <h5 className="text-[10px] font-black text-slate-900 uppercase tracking-widest leading-none">Modules</h5>
                     <ul className="space-y-5 text-sm font-bold text-slate-500">
                        <li className="hover:text-indigo-600 transition-colors cursor-pointer capitalize">Technical Index</li>
                        <li className="hover:text-indigo-600 transition-colors cursor-pointer capitalize">Clinical Assets</li>
                        <li className="hover:text-indigo-600 transition-colors cursor-pointer capitalize">Identity Protocols</li>
                        <li className="hover:text-indigo-600 transition-colors cursor-pointer capitalize">Faculty Registry</li>
                     </ul>
                  </div>
                  <div className="space-y-8">
                     <h5 className="text-[10px] font-black text-slate-900 uppercase tracking-widest leading-none">Ecosystem</h5>
                     <ul className="space-y-5 text-sm font-bold text-slate-500">
                        <li className="hover:text-indigo-600 transition-colors cursor-pointer capitalize">Academic Hub</li>
                        <li className="hover:text-indigo-600 transition-colors cursor-pointer capitalize">Guild Network</li>
                        <li className="hover:text-indigo-600 transition-colors cursor-pointer capitalize">Trust Center</li>
                        <li className="hover:text-indigo-600 transition-colors cursor-pointer capitalize">AI Nexus</li>
                     </ul>
                  </div>
                  <div className="space-y-8">
                     <h5 className="text-[10px] font-black text-slate-900 uppercase tracking-widest leading-none">Corporate</h5>
                     <ul className="space-y-5 text-sm font-bold text-slate-500">
                        <li className="hover:text-indigo-600 transition-colors cursor-pointer capitalize">Governance</li>
                        <li className="hover:text-indigo-600 transition-colors cursor-pointer capitalize">Terms of Node</li>
                        <li className="hover:text-indigo-600 transition-colors cursor-pointer capitalize">Privacy Layer</li>
                        <li className="hover:text-indigo-600 transition-colors cursor-pointer capitalize">Support Terminal</li>
                     </ul>
                  </div>
               </div>
            </div>

            <div className="pt-16 border-t border-slate-100 flex flex-col md:flex-row items-center justify-between gap-10">
               <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">© 2026 FATRA ACADEMY GLOBAL — ALL REPOSITORY RIGHTS RESERVED</p>
               <div className="flex items-center gap-10">
                  <span className="text-[10px] font-black text-emerald-500 uppercase tracking-widest flex items-center gap-2 italic">
                     <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" /> SYNCED: ALL NODES OK
                  </span>
                  <div className="w-[120px] h-6 bg-slate-100 rounded-lg flex items-center justify-center p-1">
                     <div className="w-full h-full bg-slate-200 rounded-md animate-pulse" />
                  </div>
               </div>
            </div>
         </div>
      </footer>
    </div>
  );
}
