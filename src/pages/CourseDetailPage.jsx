import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { getCourse, enrollCourse, recordCourseView } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { 
  BookOpen, Users, Star, Clock, Globe, ShieldCheck, 
  PlayCircle, CheckCircle, ArrowRight, Share2, Heart,
  BarChart, Layers, GraduationCap, ChevronRight, Zap, Info
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { GlassCard } from '../components/glass-card';

export default function CourseDetailPage() {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [enrollMsg, setEnrollMsg] = useState('');
  const [enrollError, setEnrollError] = useState('');
  const [openChapter, setOpenChapter] = useState(0);

  useEffect(() => {
    getCourse(id)
      .then(({ data }) => setCourse(data))
      .catch((err) => console.error("Identity retrieval failure:", err))
      .finally(() => setLoading(false));

    recordCourseView(id).catch(() => { });
  }, [id]);

  const handleEnroll = async () => {
    setEnrollMsg('');
    setEnrollError('');
    try {
      const { data } = await enrollCourse(id);
      setEnrollMsg(data.detail);
      getCourse(id).then(({ data }) => setCourse(data));
    } catch (err) {
      setEnrollError(err.response?.data?.detail || 'Protocol initialization failed.');
    }
  };

  if (loading) return (
    <div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center">
      <div className="w-16 h-16 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin shadow-xl shadow-indigo-600/10" />
    </div>
  );
  
  if (!course) return (
    <div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center p-6">
      <GlassCard className="p-16 text-center max-w-xl bg-white border-slate-100 shadow-2xl">
         <div className="w-24 h-24 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-10 text-slate-300">
            <BookOpen size={48} />
         </div>
         <h2 className="text-3xl font-black text-slate-900 mb-4 uppercase tracking-tighter italic">Artifact Missing</h2>
         <p className="text-slate-500 mb-12 font-medium">The intellectual module you are seeking has not been indexed in the hub yet.</p>
         <button onClick={() => navigate('/courses')} className="px-12 py-5 bg-indigo-600 text-white rounded-2xl font-black uppercase tracking-widest shadow-xl shadow-indigo-600/20 hover:scale-105 active:scale-95 transition-all">Return to Registry</button>
      </GlassCard>
    </div>
  );

  const startLearning = () => {
    const firstChapter = course.chapters?.[0];
    const firstLesson = firstChapter?.lessons?.[0];
    if (firstLesson) {
      navigate(`/learning/${course.id}/lessons/${firstLesson.id}`);
    } else {
      alert("No active lessons detected in this module.");
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-900 font-sans selection:bg-indigo-500/10 tracking-tight">
      
      {/* ─── Institutional Header ─── */}
      <section className="relative pt-32 pb-40 overflow-hidden bg-slate-900">
         <div className="absolute inset-0 z-0 overflow-hidden">
            <div className="absolute -top-1/2 -right-1/4 w-[80%] h-full bg-indigo-600 rounded-full blur-[200px] opacity-20" />
            <div className="absolute top-0 left-0 w-full h-full bg-grid-white/[0.05]" />
         </div>
         
         <div className="max-w-7xl mx-auto px-10 relative z-10">
            <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-12">
               <motion.div 
                 initial={{ opacity: 0, x: -30 }} 
                 animate={{ opacity: 1, x: 0 }}
                 className="lg:col-span-8 flex flex-col items-start gap-8"
               >
                  <nav className="flex items-center gap-3 px-4 py-2 bg-white/5 backdrop-blur-md rounded-full border border-white/10">
                     <Link to="/courses" className="text-[10px] font-black text-white/50 uppercase tracking-widest hover:text-white transition-colors">Matrix Index</Link>
                     <ChevronRight size={12} className="text-white/20" />
                     <span className="text-[10px] font-black text-indigo-400 uppercase tracking-widest">{course.category_name} node</span>
                  </nav>

                  <h1 className="text-5xl md:text-8xl font-black text-white italic tracking-tighter leading-none uppercase drop-shadow-2xl">
                    {course.title}
                  </h1>
                  
                  <div className="flex flex-wrap items-center gap-10">
                     <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-white/5 border border-white/10 rounded-2xl flex items-center justify-center text-indigo-400">
                           <Star size={24} className="fill-indigo-400" />
                        </div>
                        <div>
                           <p className="text-[10px] font-black text-white/40 uppercase tracking-widest mb-1">Peer Rating</p>
                           <p className="text-xl font-black text-white italic leading-none">{course.rating || '4.9'}/5.0</p>
                        </div>
                     </div>
                     <div className="w-px h-10 bg-white/10 hidden md:block" />
                     <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-white/5 border border-white/10 rounded-2xl flex items-center justify-center text-white/60">
                           <Users size={24} />
                        </div>
                        <div>
                           <p className="text-[10px] font-black text-white/40 uppercase tracking-widest mb-1">Active Scholars</p>
                           <p className="text-xl font-black text-white italic leading-none">{course.enrollment_count || 1200}</p>
                        </div>
                     </div>
                  </div>
               </motion.div>
            </div>
         </div>
      </section>

      {/* ─── Split Matrix Layout ─── */}
      <section className="container mx-auto px-10 -translate-y-20 relative z-20 pb-40">
         <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
            
            {/* Primary Knowledge Base */}
            <div className="lg:col-span-8 space-y-12 order-2 lg:order-1">
               <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
                  <GlassCard className="p-12 bg-white border-slate-100 shadow-2xl shadow-slate-200/50">
                     <div className="flex items-center gap-4 mb-10">
                        <div className="w-12 h-12 bg-indigo-50 border border-indigo-100 rounded-2xl flex items-center justify-center text-indigo-600">
                           <Info size={24} />
                        </div>
                        <h3 className="text-3xl font-black text-slate-900 tracking-tighter italic uppercase">Module Protocol</h3>
                     </div>
                     <p className="text-xl font-medium text-slate-500 leading-relaxed max-w-4xl italic">
                        {course.description || "Deploying this intellectual artifact will initialize mastery over core cognitive modules. Prepared for global faculty standards."}
                     </p>
                     
                     <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 mt-16 pt-16 border-t border-slate-50">
                        <div className="flex items-start gap-4">
                           <div className="w-6 h-6 rounded-full bg-emerald-500 flex items-center justify-center text-white flex-shrink-0 mt-1"><CheckCircle size={14} /></div>
                           <p className="text-sm font-bold text-slate-600 leading-relaxed">Master industrial-grade cognitive protocols for specific domain excellence.</p>
                        </div>
                        <div className="flex items-start gap-4">
                           <div className="w-6 h-6 rounded-full bg-indigo-500 flex items-center justify-center text-white flex-shrink-0 mt-1"><Zap size={14} /></div>
                           <p className="text-sm font-bold text-slate-600 leading-relaxed">Accelerated learning through peer-validated module synchronization.</p>
                        </div>
                     </div>
                  </GlassCard>
               </motion.div>

               {/* Curriculum Section */}
               <div className="space-y-10">
                  <div className="flex items-end justify-between border-b border-slate-100 pb-8">
                     <h3 className="text-xs font-black text-indigo-600 uppercase tracking-[0.4em] italic">Knowledge Stack</h3>
                     <span className="text-xs font-black text-slate-400 uppercase tracking-widest">{course.chapters?.length || 0} Core Chapters</span>
                  </div>

                  <div className="space-y-6">
                     {course.chapters?.map((chapter, index) => (
                        <div key={chapter.id} className="bg-white border border-slate-100 rounded-[2.5rem] overflow-hidden shadow-sm hover:shadow-xl hover:scale-[1.01] transition-all">
                           <button 
                              onClick={() => setOpenChapter(openChapter === index ? -1 : index)}
                              className="w-full flex items-center justify-between p-10 text-left"
                           >
                              <div className="flex items-center gap-8">
                                 <div className="w-14 h-14 bg-slate-50 rounded-2xl flex items-center justify-center font-black text-slate-300 text-lg border border-slate-100">
                                    {(index + 1).toString().padStart(2, '0')}
                                 </div>
                                 <div>
                                    <h4 className="text-2xl font-black text-slate-900 italic tracking-tight">{chapter.title}</h4>
                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">{chapter.lessons?.length || 0} ACTIVE LESSONS</p>
                                 </div>
                              </div>
                              <div className={`w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center transition-transform ${openChapter === index ? 'rotate-180 bg-indigo-50 text-indigo-600' : 'text-slate-300'}`}>
                                 <ChevronRight className="rotate-90" size={20} />
                              </div>
                           </button>

                           <AnimatePresence>
                              {openChapter === index && (
                                 <motion.div initial={{ height: 0 }} animate={{ height: 'auto' }} exit={{ height: 0 }} className="overflow-hidden bg-slate-50/50">
                                    <div className="p-10 pt-0 space-y-4">
                                       {chapter.lessons?.map(lesson => (
                                          <div key={lesson.id} className="flex items-center justify-between p-6 bg-white border border-slate-100 rounded-2xl shadow-sm hover:border-indigo-200 transition-all cursor-pointer group/lesson">
                                             <div className="flex items-center gap-4">
                                                <div className="w-8 h-8 rounded-lg bg-indigo-50 flex items-center justify-center text-indigo-400"><PlayCircle size={16} /></div>
                                                <span className="text-sm font-bold text-slate-700 group-hover/lesson:text-indigo-600 transition-colors uppercase italic">{lesson.title}</span>
                                             </div>
                                             <div className="flex items-center gap-4">
                                                <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest">12:30</span>
                                                <ArrowRight size={16} className="text-slate-200 group-hover/lesson:text-indigo-400 group-hover/lesson:translate-x-1 transition-all" />
                                             </div>
                                          </div>
                                       ))}
                                    </div>
                                 </motion.div>
                              )}
                           </AnimatePresence>
                        </div>
                     ))}
                  </div>
               </div>
            </div>

            {/* Sticky Acquisition Node */}
            <div className="lg:col-span-4 sticky top-32 order-1 lg:order-2">
               <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.4 }}>
                  <GlassCard className="bg-white border-slate-200 shadow-[0_50px_100px_-20px_rgba(0,0,0,0.1)] rounded-[3rem] p-12 relative overflow-hidden group">
                     <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-600/5 rounded-full blur-[40px] -translate-y-1/2 translate-x-1/2" />
                     
                     <div className="relative z-10 space-y-12">
                        <div className="flex items-center justify-between">
                           <div>
                              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Investment Hub</p>
                              <div className="flex items-baseline gap-2">
                                 <span className="text-5xl font-black text-slate-900 italic tracking-tighter">
                                    {parseFloat(course.price) === 0 ? "FREE" : `$${course.price}`}
                                 </span>
                                 {parseFloat(course.price) > 0 && <span className="text-sm font-bold text-slate-300 line-through tracking-wider">$199.00</span>}
                              </div>
                           </div>
                           <div className="w-14 h-14 bg-indigo-50 border border-indigo-100 rounded-2xl flex items-center justify-center text-indigo-600 shadow-xl shadow-indigo-600/10">
                              <Award size={28} />
                           </div>
                        </div>

                        <div className="space-y-6">
                           {course.is_enrolled ? (
                              <button 
                                onClick={startLearning}
                                className="w-full h-20 bg-emerald-600 text-white rounded-3xl font-black uppercase text-sm tracking-[0.3em] flex items-center justify-center gap-4 shadow-xl shadow-emerald-500/20 hover:bg-emerald-500 hover:scale-105 active:scale-95 transition-all"
                              >
                                 Start Protocol <ChevronRight size={20} />
                              </button>
                           ) : (
                              <button 
                                onClick={handleEnroll}
                                className="w-full h-20 bg-indigo-600 text-white rounded-3xl font-black uppercase text-sm tracking-[0.3em] flex items-center justify-center gap-4 shadow-xl shadow-indigo-600/30 hover:bg-indigo-500 hover:scale-105 active:scale-95 transition-all"
                              >
                                 Access Module <ArrowRight size={20} />
                              </button>
                           )}
                           
                           <div className="flex gap-4">
                              <button className="flex-1 py-4 bg-slate-50 border border-slate-100 rounded-2xl flex items-center justify-center gap-3 text-slate-500 hover:bg-slate-100 transition-all font-black text-[10px] uppercase tracking-widest">
                                 <Heart size={16} /> Wishlist
                              </button>
                              <button className="flex-1 py-4 bg-slate-50 border border-slate-100 rounded-2xl flex items-center justify-center gap-3 text-slate-500 hover:bg-slate-100 transition-all font-black text-[10px] uppercase tracking-widest">
                                 <Share2 size={16} /> Share
                              </button>
                           </div>
                        </div>

                        <div className="space-y-6 pt-10 border-t border-slate-50">
                           <h5 className="text-[10px] font-black text-slate-900 uppercase tracking-[0.4em] leading-none mb-2">Portal Artifacts</h5>
                           <div className="space-y-5">
                              {[
                                 { icon: Clock, text: "12 Hours Mastery", color: "text-amber-500" },
                                 { icon: BookOpen, text: `${course.chapters?.length || 0} Core Sections`, color: "text-indigo-500" },
                                 { icon: ShieldCheck, text: "Hub Validation", color: "text-emerald-500" },
                                 { icon: Globe, text: "Global Standards", color: "text-blue-500" }
                              ].map((item, i) => (
                                 <div key={i} className="flex items-center gap-4">
                                    <div className={`w-8 h-8 rounded-lg bg-slate-50 border border-slate-100 flex items-center justify-center ${item.color}`}><item.icon size={16} /></div>
                                    <span className="text-xs font-black text-slate-600 uppercase tracking-tighter">{item.text}</span>
                                 </div>
                              ))}
                           </div>
                        </div>

                        {/* Social Interaction Context */}
                        <div className="p-6 bg-slate-50 rounded-[2rem] border border-slate-100 text-center">
                           <div className="flex justify-center -space-x-4 mb-4">
                              {[1,2,3,4].map(idx => (
                                 <div key={idx} className="w-10 h-10 rounded-full bg-slate-200 border-4 border-white flex items-center justify-center text-slate-400 font-bold text-xs ring-1 ring-slate-100">
                                    {String.fromCharCode(64 + idx)}
                                 </div>
                              ))}
                              <div className="w-10 h-10 rounded-full bg-indigo-600 border-4 border-white flex items-center justify-center text-white font-black text-[8px]">+540</div>
                           </div>
                           <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest leading-none">Syncing with Active Scholars</p>
                        </div>
                     </div>
                  </GlassCard>
               </motion.div>
            </div>
         </div>
      </section>
      
      {/* ─── Faculty Registry Detail ─── */}
      <section className="bg-white py-32 border-t border-slate-100">
         <div className="container mx-auto px-10">
            <div className="flex flex-col md:flex-row items-center gap-16">
               <div className="w-56 h-56 rounded-[3rem] bg-indigo-600 flex items-center justify-center text-white text-7xl font-black italic shadow-2xl shadow-indigo-600/30 shrink-0">
                  {course.instructor_name?.charAt(0)}
               </div>
               <div className="space-y-6">
                  <h3 className="text-xs font-black text-indigo-600 uppercase tracking-[0.5em]">Lead Faculty</h3>
                  <h4 className="text-4xl md:text-6xl font-black text-slate-900 tracking-tighter italic leading-none">{course.instructor_name}</h4>
                  <p className="text-xl font-medium text-slate-500 max-w-2xl leading-relaxed">
                     Verified expert in {course.category_name}. Specializing in industrial-grade cognitive engineering and global protocol deployment.
                  </p>
                  <div className="flex items-center gap-10 pt-4">
                     <div>
                        <p className="text-2xl font-black text-slate-900 italic tracking-tighter">12,000+</p>
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Node Impact</p>
                     </div>
                     <div className="w-px h-8 bg-slate-100" />
                     <div>
                        <p className="text-2xl font-black text-slate-900 italic tracking-tighter">15 Units</p>
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Artifact Pool</p>
                     </div>
                  </div>
               </div>
            </div>
         </div>
      </section>
    </div>
  );
}
