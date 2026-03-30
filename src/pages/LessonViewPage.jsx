import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { 
  getCourse, 
  getLesson, 
  markLessonCompleted 
} from '../services/api';
import { 
  ArrowLeft, CheckCircle, ShieldAlert, BookOpen, 
  PlayCircle, FileText, Image as ImageIcon, Link as LinkIcon, Lock
} from 'lucide-react';
import { GlassCard } from '../components/glass-card';

export default function LessonViewPage() {
  const { courseId, lessonId } = useParams();
  const navigate = useNavigate();
  const [course, setCourse] = useState(null);
  const [lesson, setLesson] = useState(null);
  const [loading, setLoading] = useState(true);
  const [completing, setCompleting] = useState(false);
  const [msg, setMsg] = useState('');
  const [msgType, setMsgType] = useState('success');

  useEffect(() => {
    loadData();
  }, [courseId, lessonId]);

  const loadData = async () => {
    setLoading(true);
    setMsg('');
    try {
      const [courseRes, lessonRes] = await Promise.all([
        getCourse(courseId),
        getLesson(lessonId)
      ]);
      setCourse(courseRes.data);
      setLesson(lessonRes.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleComplete = async () => {
    setCompleting(true);
    try {
      await markLessonCompleted(lessonId);
      setMsgType('success');
      setMsg('Knowledge node assimilated successfully.');
      loadData();
      
      const allLessons = course.chapters?.flatMap(c => c.lessons || []) || [];
      const currentIndex = allLessons.findIndex(l => l.id === parseInt(lessonId));
      if (currentIndex !== -1 && currentIndex < allLessons.length - 1) {
        const next = allLessons[currentIndex + 1];
        setMsg(`Knowledge node assimilated successfully. Next protocol: ${next.title}`);
      }
    } catch (err) {
      setMsgType('error');
      setMsg('Error: ' + (err.response?.data?.detail || 'Handshake failed.'));
    } finally {
      setCompleting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-[80vh] flex flex-col items-center justify-center bg-[#F8FAFC]">
        <div className="w-16 h-16 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin shadow-xl shadow-indigo-600/20" />
        <p className="mt-6 text-xs font-black uppercase tracking-[0.3em] text-slate-400 italic">Syncing Protocol...</p>
      </div>
    );
  }

  if (!course || !lesson) {
    return (
      <div className="min-h-[80vh] flex flex-col items-center justify-center bg-[#F8FAFC]">
        <ShieldAlert size={64} className="text-slate-200 mb-6" />
        <p className="text-xl font-black uppercase tracking-widest text-slate-900 italic">Artifact Not Found</p>
      </div>
    );
  }

  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const isElevated = user.role === 'ADMIN' || user.role === 'INSTRUCTOR';
  
  if (!course.is_approved && !isElevated) {
    return (
      <div className="min-h-[80vh] flex flex-col items-center justify-center bg-[#F8FAFC] p-6 text-center">
        <GlassCard className="max-w-xl p-16 border-ambar-100 bg-white shadow-2xl">
           <div className="w-24 h-24 bg-amber-50 rounded-[2rem] flex items-center justify-center mx-auto mb-10 border border-amber-100 shadow-inner">
              <ShieldAlert size={48} className="text-amber-500" />
           </div>
           <h2 className="text-3xl font-black text-slate-900 italic tracking-tighter uppercase mb-4">Protocol Locked</h2>
           <p className="text-sm font-medium text-slate-500 leading-relaxed max-w-sm mx-auto mb-10">
             This educational artifact is currently under ethical review by our faculty moderators.
           </p>
           <button 
             onClick={() => navigate('/my-enrollments')}
             className="px-10 py-5 bg-slate-900 text-white rounded-2xl font-black text-[10px] uppercase tracking-[0.3em] shadow-xl hover:scale-105 active:scale-95 transition-all w-full"
           >
             Return to Profile
           </button>
        </GlassCard>
      </div>
    );
  }

  const getYoutubeEmbed = (url) => {
    if (!url) return null;
    let videoId = '';
    if (url.includes('youtube.com/watch?v=')) {
      videoId = url.split('v=')[1].split('&')[0];
    } else if (url.includes('youtu.be/')) {
      videoId = url.split('youtu.be/')[1].split('?')[0];
    }
    return videoId ? `https://www.youtube.com/embed/${videoId}` : null;
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col lg:flex-row shadow-inner pt-[var(--navbar-height,80px)]">
      {/* Sidebar Navigation */}
      <aside className="w-full lg:w-96 bg-white border-r border-slate-100 flex flex-col h-[calc(100vh-80px)] lg:sticky lg:top-[80px]">
         <div className="p-8 border-b border-slate-50 bg-slate-50/50">
            <button 
              onClick={() => navigate(-1)} 
              className="flex items-center gap-3 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 hover:text-indigo-600 transition-colors mb-6"
            >
               <ArrowLeft size={14} /> Back to Overview
            </button>
            <h2 className="text-2xl font-black text-slate-900 italic tracking-tighter uppercase leading-none">{course.title}</h2>
         </div>

         <div className="flex-1 overflow-y-auto p-4 space-y-6">
            {course.chapters?.map((chapter, ci) => (
               <div key={chapter.id}>
                  <div className="px-4 mb-4">
                     <p className="text-[10px] font-black text-indigo-600 uppercase tracking-[0.3em] mb-1">Matrix {ci + 1}</p>
                     <p className="text-sm font-black text-slate-900 italic uppercase">{chapter.title}</p>
                  </div>
                  <div className="space-y-2">
                     {chapter.lessons?.map((l) => {
                       const allLessons = course.chapters.flatMap(c => c.lessons || []);
                       const globalIdx = allLessons.findIndex(lesson => lesson.id === l.id);
                       const isLocked = globalIdx > 0 && !allLessons[globalIdx - 1].is_completed;
                       const isActive = l.id === parseInt(lessonId);

                       let Icon = BookOpen;
                       let iconColor = "text-slate-400";
                       let bgColor = "bg-white border-slate-100 hover:border-indigo-100 hover:bg-indigo-50/50";

                       if (l.is_completed) {
                         Icon = CheckCircle;
                         iconColor = "text-emerald-500";
                       } else if (isLocked) {
                         Icon = Lock;
                         iconColor = "text-slate-300";
                         bgColor = "bg-slate-50 border-slate-50 opacity-60 cursor-not-allowed";
                       }

                       if (isActive) {
                         bgColor = "bg-indigo-600 border-indigo-600 shadow-lg shadow-indigo-600/20 text-white";
                         iconColor = "text-white";
                       }

                       return (
                         <button 
                           key={l.id}
                           onClick={() => !isLocked && navigate(`/learning/${courseId}/lessons/${l.id}`)}
                           className={`w-full text-left p-4 rounded-2xl border transition-all flex items-center gap-4 group ${bgColor}`}
                           disabled={isLocked}
                         >
                            <div className={`w-10 h-10 rounded-xl flex items-center justify-center bg-white/10 shrink-0 ${isActive ? 'bg-white/20' : 'bg-slate-50'}`}>
                               <Icon size={16} className={iconColor} />
                            </div>
                            <span className={`text-xs font-bold leading-tight ${isActive ? 'text-white' : 'text-slate-700'} ${isLocked ? 'line-through decoration-slate-300' : ''}`}>
                               {l.title}
                            </span>
                         </button>
                       );
                     })}
                  </div>
               </div>
            ))}
         </div>
      </aside>

      {/* Main Learning Content */}
      <main className="flex-1 overflow-y-auto">
         <div className="max-w-4xl mx-auto p-6 md:p-12 lg:p-16 space-y-12 pb-32">
            
            {/* Header */}
            <div>
               <h1 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tighter italic uppercase mb-6 leading-none">
                  {lesson.title}
               </h1>
               {lesson.description && (
                  <p className="text-lg text-slate-500 font-medium leading-relaxed italic border-l-4 border-indigo-600 pl-6 py-2">
                     {lesson.description}
                  </p>
               )}
            </div>

            {/* Flash Messages */}
            <AnimatePresence>
               {msg && (
                  <motion.div 
                     initial={{ opacity: 0, y: -20 }}
                     animate={{ opacity: 1, y: 0 }}
                     exit={{ opacity: 0, y: -20 }}
                     className={`p-6 rounded-[2rem] border shadow-xl flex items-center gap-6 ${
                        msgType === 'error' ? 'bg-rose-50 border-rose-100' : 'bg-emerald-50 border-emerald-100'
                     }`}
                  >
                     <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${msgType === 'error' ? 'bg-rose-200 text-rose-600' : 'bg-emerald-200 text-emerald-600'}`}>
                        {msgType === 'error' ? <ShieldAlert size={24} /> : <CheckCircle size={24} />}
                     </div>
                     <span className={`text-[10px] font-black uppercase tracking-[0.2em] italic ${msgType === 'error' ? 'text-rose-600' : 'text-emerald-700'}`}>
                        {msg}
                     </span>
                  </motion.div>
               )}
            </AnimatePresence>

            {/* Knowledge Blocks */}
            <div className="space-y-10">
               {lesson.content_blocks?.length === 0 ? (
                  <GlassCard className="p-16 text-center border-slate-100 bg-white">
                     <p className="text-xs font-black uppercase tracking-[0.3em] text-slate-400 italic">No Artifacts Detected</p>
                  </GlassCard>
               ) : (
                  lesson.content_blocks.map((block) => (
                     <div key={block.id} className="group">
                        {block.title && (
                           <h3 className="text-xl font-black text-slate-800 uppercase tracking-tight italic mb-6 flex items-center gap-4">
                              <span className="w-8 h-px bg-slate-200 inline-block" /> {block.title}
                           </h3>
                        )}
                        
                        {block.type === 'text' && (
                           <div 
                              className="prose prose-lg prose-indigo max-w-none text-slate-700 font-medium bg-white p-10 rounded-[2.5rem] border border-slate-100 shadow-sm leading-relaxed" 
                              dangerouslySetInnerHTML={{ __html: block.text_content }} 
                           />
                        )}

                        {block.type === 'image' && block.file && (
                           <div className="bg-white p-4 rounded-[2.5rem] border border-slate-100 shadow-xl shadow-slate-200/50 hover:shadow-2xl transition-all">
                              <img src={block.file} alt={block.title} className="w-full h-auto rounded-[2rem] object-cover" />
                           </div>
                        )}

                        {block.type === 'pdf' && block.file && (
                           <div className="bg-slate-900 rounded-[2.5rem] border border-slate-800 shadow-2xl overflow-hidden group/pdf">
                              <div className="w-full h-[600px] bg-slate-50">
                                 <embed src={block.file} type="application/pdf" width="100%" height="100%" />
                              </div>
                              <div className="p-6 bg-slate-900 flex justify-between items-center text-white">
                                 <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center"><FileText size={18} /></div>
                                    <span className="text-[10px] font-black uppercase tracking-[0.2em]">PDF Document</span>
                                 </div>
                                 <a href={block.file} target="_blank" rel="noopener noreferrer" className="px-6 py-3 bg-indigo-600 rounded-xl text-[10px] font-black uppercase tracking-[0.2em] hover:bg-indigo-500 transition-colors">
                                     Pop Out
                                 </a>
                              </div>
                           </div>
                        )}

                        {block.type === 'video_upload' && block.file && (
                           <div className="bg-black rounded-[2.5rem] shadow-2xl overflow-hidden border border-slate-800 p-2">
                              <video controls className="w-full rounded-[2rem] bg-slate-900 aspect-video">
                                 <source src={block.file} type="video/mp4" />
                              </video>
                           </div>
                        )}

                        {block.type === 'video_link' && block.url && (
                           <div className="bg-black rounded-[2.5rem] shadow-2xl overflow-hidden border border-slate-800 p-2">
                              <iframe 
                                 className="w-full aspect-video rounded-[2rem] bg-slate-900"
                                 src={getYoutubeEmbed(block.url)} 
                                 title="Block Video" 
                                 frameBorder="0" 
                                 allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                                 allowFullScreen
                              />
                           </div>
                        )}

                        {block.type === 'link' && block.url && (
                           <a 
                              href={block.url} 
                              target="_blank" 
                              rel="noopener noreferrer" 
                              className="block p-8 bg-indigo-600 rounded-[2.5rem] shadow-xl shadow-indigo-600/30 hover:shadow-2xl hover:-translate-y-1 transition-all group/link border border-indigo-500"
                           >
                              <div className="flex items-center justify-between">
                                 <div className="flex items-center gap-6">
                                    <div className="w-16 h-16 bg-white/10 rounded-2xl flex items-center justify-center text-white border border-white/20">
                                       <LinkIcon size={24} />
                                    </div>
                                    <div>
                                       <h4 className="text-xl font-black text-white italic tracking-tighter leading-none mb-2">{block.title || 'External Reference'}</h4>
                                       <p className="text-[10px] font-black text-white/60 uppercase tracking-widest">{new URL(block.url).hostname}</p>
                                    </div>
                                 </div>
                                 <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center text-indigo-600 shadow-lg group-hover/link:scale-110 transition-transform">
                                    <ArrowLeft className="rotate-135" size={20} />
                                 </div>
                              </div>
                           </a>
                        )}
                     </div>
                  ))
               )}
            </div>

            {/* Completion Action */}
            <div className="pt-20 border-t border-slate-200 mt-20 flex justify-center">
               {!lesson.is_completed ? (
                  <button 
                     onClick={handleComplete} 
                     disabled={completing}
                     className="px-16 py-6 bg-slate-900 text-white rounded-[2rem] font-black text-xs uppercase tracking-[0.3em] shadow-2xl shadow-slate-900/20 hover:scale-105 active:scale-95 transition-all flex items-center gap-4 group"
                  >
                     <CheckCircle size={20} className="group-hover:text-emerald-400 transition-colors" /> 
                     {completing ? 'Transmitting...' : 'Mark Node Completed'}
                  </button>
               ) : (
                  <div className="flex items-center gap-4 px-12 py-6 bg-emerald-50 border border-emerald-100 rounded-[2rem] text-emerald-600 shadow-sm">
                     <CheckCircle size={24} />
                     <span className="text-xs font-black uppercase tracking-[0.3em] italic">Knowledge Successfully Assimilated</span>
                  </div>
               )}
            </div>

         </div>
      </main>
    </div>
  );
}
