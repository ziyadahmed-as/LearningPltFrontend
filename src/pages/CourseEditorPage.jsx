import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import {
  getCourse, createChapter, deleteChapter, updateChapter,
  createLesson, deleteLesson, updateLesson,
  getCategories, generateCourseDescription,
  submitCourseForApproval, updateCourse
} from '../services/api';
import DashboardLayout from '../components/DashboardLayout';
import { 
  ArrowLeft, Settings, Globe, Send, Plus, 
  Trash2, ArrowUp, ArrowDown, Edit3, Type,
  Sparkles, Image as ImageIcon, Video, FolderGit2
} from 'lucide-react';
import { GlassCard } from '../components/glass-card';

export default function CourseEditorPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [course, setCourse] = useState(null);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showSettings, setShowSettings] = useState(false);
  const [settings, setSettings] = useState({ title: '', description: '', price: '0', category: '', is_published: false });
  const [saving, setSaving] = useState(false);
  const [generatingAI, setGeneratingAI] = useState(false);
  const [thumbnail, setThumbnail] = useState(null);
  const [promoVideo, setPromoVideo] = useState(null);

  useEffect(() => { loadCourse(); loadCategories(); }, [id]);

  const loadCourse = async () => {
    try {
      const { data } = await getCourse(id);
      setCourse(data);
      setSettings({
        title: data.title,
        description: data.description,
        price: data.price,
        category: data.category || '',
        is_published: data.is_published,
      });
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  const loadCategories = async () => {
    try { const { data } = await getCategories(); setCategories(Array.isArray(data) ? data : data.results || []); } catch { }
  };

  const handleSaveSettings = async (e) => {
    e.preventDefault();
    setSaving(true);
    const formData = new FormData();
    formData.append('title', settings.title);
    formData.append('description', settings.description);
    formData.append('price', parseFloat(settings.price));
    formData.append('category', settings.category);
    if (thumbnail) formData.append('thumbnail', thumbnail);
    if (promoVideo) formData.append('promo_video', promoVideo);

    try {
      await updateCourse(id, formData);
      loadCourse();
      setShowSettings(false);
      setThumbnail(null);
      setPromoVideo(null);
    } catch { alert('Failed to update course settings'); }
    finally { setSaving(false); }
  };

  const handleSubmitForApproval = async () => {
    if (!course.is_published) {
      alert('You must publish the course as a draft before submitting for approval.');
      return;
    }
    if (window.confirm('Submit this course for admin approval? You won\'t be able to make major changes until it\'s reviewed.')) {
      try {
        await submitCourseForApproval(id);
        loadCourse();
      } catch { alert('Failed to submit course for approval'); }
    }
  };

  const handleGenerateDescription = async () => {
    if (!settings.title) {
      alert('Please enter a course title first so AI can generate a relevant description.');
      return;
    }
    setGeneratingAI(true);
    try {
      const { data } = await generateCourseDescription({
        title: settings.title,
      });
      setSettings({ ...settings, description: data.description });
    } catch (err) {
      console.error(err);
      alert('Failed to generate description. Make sure the backend has an OpenAI API key.');
    } finally {
      setGeneratingAI(false);
    }
  };

  const handleTogglePublish = async () => {
    try {
      await updateCourse(id, { is_published: !course.is_published });
      loadCourse();
    } catch { alert('Failed to update publish status'); }
  };

  const handleAddChapter = async () => {
    const title = prompt('Enter chapter title:');
    if (!title) return;
    try {
      await createChapter({ course: id, title, order: course.chapters?.length || 0 });
      loadCourse();
    } catch { alert('Failed to add chapter'); }
  };

  const handleDeleteChapter = async (chapterId) => {
    if (window.confirm('Delete this chapter and all its lessons?')) {
      await deleteChapter(chapterId);
      loadCourse();
    }
  };

  const handleAddLesson = async (chapterId) => {
    const title = prompt('Enter lesson title:');
    if (!title) return;
    try {
      const chapter = course.chapters.find(c => c.id === chapterId);
      await createLesson({ chapter: chapterId, title, order: chapter?.lessons?.length || 0 });
      loadCourse();
    } catch { alert('Failed to add lesson'); }
  };

  const handleDeleteLesson = async (lessonId) => {
    if (window.confirm('Delete this lesson?')) {
      await deleteLesson(lessonId);
      loadCourse();
    }
  };

  const handleMoveChapter = async (index, direction) => {
    const chapters = [...course.chapters];
    const targetIndex = index + direction;
    if (targetIndex < 0 || targetIndex >= chapters.length) return;

    const current = chapters[index];
    const target = chapters[targetIndex];
    
    try {
      await Promise.all([
        updateChapter(current.id, { order: target.order }),
        updateChapter(target.id, { order: current.order })
      ]);
      loadCourse();
    } catch { alert('Failed to reorder chapters'); }
  };

  const handleMoveLesson = async (chapterId, index, direction) => {
    const chapter = course.chapters.find(c => c.id === chapterId);
    const lessons = [...chapter.lessons];
    const targetIndex = index + direction;
    if (targetIndex < 0 || targetIndex >= lessons.length) return;

    const current = lessons[index];
    const target = lessons[targetIndex];

    try {
      await Promise.all([
        updateLesson(current.id, { order: target.order }),
        updateLesson(target.id, { order: current.order })
      ]);
      loadCourse();
    } catch { alert('Failed to reorder lessons'); }
  };

  if (loading) {
    return (
      <DashboardLayout title="Protocol Editor" subtitle="Loading node artifacts...">
        <div className="flex items-center justify-center min-h-[400px]">
           <div className="w-12 h-12 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin" />
        </div>
      </DashboardLayout>
    );
  }

  if (!course) {
    return (
      <DashboardLayout title="Protocol Editor" subtitle="Error">
        <div className="py-24 flex flex-col items-center justify-center text-center opacity-40">
           <FolderGit2 size={64} strokeWidth={1} />
           <p className="mt-8 text-xs font-black uppercase tracking-[0.2em]">Course not found</p>
        </div>
      </DashboardLayout>
    );
  }

  const lessonCount = course.lessons?.length || (course.chapters?.reduce((acc, chap) => acc + (chap.lessons?.length || 0), 0)) || 0;

  return (
    <DashboardLayout 
      title="Protocol Editor" 
      subtitle={course.title}
    >
      <div className="space-y-12 pb-32">
        {/* Editor Toolbar */}
        <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-8 border-b border-slate-100 pb-10">
           <div className="flex flex-wrap items-center gap-4">
              <button onClick={() => navigate('/my-courses')} className="w-12 h-12 bg-white border border-slate-100 rounded-2xl flex items-center justify-center text-slate-400 hover:text-indigo-600 hover:shadow-xl transition-all">
                 <ArrowLeft size={20} />
              </button>
              
              <div className="flex items-center gap-2 px-6 py-3 bg-white border border-slate-100 rounded-2xl shadow-sm">
                 <span className={`w-2.5 h-2.5 rounded-full ${course.is_published ? 'bg-emerald-500' : 'bg-amber-400'}`} />
                 <span className="text-[10px] font-black uppercase tracking-widest text-slate-600">
                    {course.is_published ? 'Deployed' : 'Draft Mode'}
                 </span>
              </div>
              
              {course.is_published && (
                <div className="flex items-center gap-2 px-6 py-3 bg-white border border-slate-100 rounded-2xl shadow-sm">
                   <span className="text-[10px] font-black uppercase tracking-widest text-slate-600">
                      {course.is_approved ? '✅ Verified' : (course.is_submitted ? '⏳ Pending Review' : '🛠️ Local Edits')}
                   </span>
                </div>
              )}
              
              <div className="px-6 py-3 bg-indigo-50 text-indigo-600 rounded-2xl text-[10px] font-black uppercase tracking-widest border border-indigo-100">
                 {lessonCount} Nodes
              </div>
           </div>

           <div className="flex flex-wrap items-center gap-4">
              <button 
                onClick={() => setShowSettings(!showSettings)}
                className={`px-8 py-4 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] flex items-center gap-3 transition-all ${
                  showSettings ? 'bg-slate-900 text-white shadow-xl shadow-slate-900/20' : 'bg-white text-slate-600 border border-slate-100 hover:shadow-xl'
                }`}
              >
                 <Settings size={16} /> Config
              </button>

              <button 
                onClick={handleTogglePublish}
                className={`px-8 py-4 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] flex items-center gap-3 transition-all ${
                  course.is_published ? 'bg-white text-slate-600 border border-slate-100' : 'bg-emerald-50 text-emerald-600 border border-emerald-100'
                }`}
              >
                 <Globe size={16} /> {course.is_published ? 'Retract' : 'Deploy Draft'}
              </button>

              {!course.is_approved && course.is_published && !course.is_submitted && (
                <button 
                  onClick={handleSubmitForApproval}
                  className="px-8 py-4 bg-indigo-600 text-white rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] flex items-center gap-3 hover:scale-105 shadow-xl shadow-indigo-600/30 transition-all"
                >
                   <Send size={16} /> Request Verification
                </button>
              )}
           </div>
        </div>

        {/* Global Config Panel */}
        <AnimatePresence>
           {showSettings && (
             <motion.div 
               initial={{ opacity: 0, height: 0 }}
               animate={{ opacity: 1, height: 'auto' }}
               exit={{ opacity: 0, height: 0 }}
               className="overflow-hidden"
             >
               <GlassCard className="p-10 mb-12 bg-white border-slate-100 shadow-2xl shadow-slate-200/50">
                  <h3 className="text-xl font-black text-slate-900 italic tracking-tighter uppercase mb-8 flex items-center gap-3">
                     <Settings size={24} className="text-indigo-600" /> Protocol Configuration
                  </h3>

                  <form onSubmit={handleSaveSettings} className="space-y-8">
                     <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        <div className="space-y-2">
                           <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-4">Identifier</label>
                           <div className="relative group">
                              <Type size={18} className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400" />
                              <input 
                                className="w-full bg-slate-50 border border-slate-100 rounded-[1.8rem] p-5 pl-14 text-slate-900 font-bold text-sm focus:ring-1 focus:ring-indigo-600 focus:bg-white transition-all shadow-sm" 
                                value={settings.title}
                                onChange={e => setSettings({ ...settings, title: e.target.value })} 
                                required 
                              />
                           </div>
                        </div>
                        
                        <div className="grid grid-cols-2 gap-6">
                           <div className="space-y-2">
                              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-4">Domain Slot</label>
                              <select 
                                 className="w-full bg-slate-50 border border-slate-100 rounded-[1.8rem] p-5 text-slate-900 text-[10px] font-black uppercase tracking-widest appearance-none focus:ring-1 focus:ring-indigo-600 focus:bg-white shadow-sm"
                                 value={settings.category} 
                                 onChange={(e) => setSettings({ ...settings, category: e.target.value })}
                              >
                                 <option value="">Select Domain</option>
                                 {categories.map((c) => (
                                    <option key={c.id} value={c.id}>{c.name}</option>
                                 ))}
                              </select>
                           </div>
                           <div className="space-y-2">
                              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-4">Valuation Matrix</label>
                              <input 
                                 className="w-full bg-slate-50 border border-slate-100 rounded-[1.8rem] p-5 text-slate-900 text-sm font-bold shadow-sm focus:ring-1 focus:ring-indigo-600 focus:bg-white"
                                 type="number" step="0.01" 
                                 value={settings.price} 
                                 onChange={(e) => setSettings({ ...settings, price: e.target.value })} 
                              />
                           </div>
                        </div>
                     </div>

                     <div className="space-y-2">
                        <div className="flex items-center justify-between ml-4">
                           <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Protocol Intelligence</label>
                           <button 
                             type="button" 
                             onClick={handleGenerateDescription}
                             disabled={generatingAI}
                             className="flex items-center gap-2 text-[10px] font-black text-indigo-600 uppercase tracking-widest hover:text-indigo-800 transition-colors"
                           >
                              <Sparkles size={14} /> {generatingAI ? 'Synthesizing...' : 'AI Auto-Fill'}
                           </button>
                        </div>
                        <textarea 
                           className="w-full bg-slate-50 border border-slate-100 rounded-[2rem] p-6 text-slate-900 font-bold text-sm focus:ring-1 focus:ring-indigo-600 focus:bg-white transition-all shadow-sm min-h-[160px]" 
                           value={settings.description}
                           onChange={e => setSettings({ ...settings, description: e.target.value })} 
                           required 
                        />
                     </div>

                     <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        <div className="space-y-2">
                           <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-4">Knowledge Thumbnail</label>
                           <label className="flex items-center justify-center w-full h-32 px-4 transition bg-slate-50 border-2 border-slate-100 border-dashed rounded-[2rem] hover:border-indigo-600 hover:bg-slate-100 cursor-pointer">
                              <div className="flex flex-col items-center space-y-2">
                                 <ImageIcon size={24} className="text-slate-400" />
                                 <span className="text-xs font-bold text-slate-500">{thumbnail ? thumbnail.name : (course.thumbnail ? 'File Extant - Override' : 'Upload Image Signal')}</span>
                              </div>
                              <input type="file" className="hidden" accept="image/*" onChange={e => setThumbnail(e.target.files[0])} />
                           </label>
                        </div>
                        <div className="space-y-2">
                           <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-4">Promo Sequence</label>
                           <label className="flex items-center justify-center w-full h-32 px-4 transition bg-slate-50 border-2 border-slate-100 border-dashed rounded-[2rem] hover:border-indigo-600 hover:bg-slate-100 cursor-pointer">
                              <div className="flex flex-col items-center space-y-2">
                                 <Video size={24} className="text-slate-400" />
                                 <span className="text-xs font-bold text-slate-500">{promoVideo ? promoVideo.name : (course.promo_video ? 'File Extant - Override' : 'Upload Video Artifact')}</span>
                              </div>
                              <input type="file" className="hidden" accept="video/*" onChange={e => setPromoVideo(e.target.files[0])} />
                           </label>
                        </div>
                     </div>

                     <div className="flex justify-end gap-4 pt-4 border-t border-slate-100">
                        <button 
                          type="button" 
                          onClick={() => setShowSettings(false)}
                          className="px-8 py-4 bg-white text-slate-500 border border-slate-100 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] shadow-sm hover:shadow-xl transition-all"
                        >
                           Dismiss
                        </button>
                        <button 
                          type="submit" 
                          disabled={saving}
                          className="px-8 py-4 bg-slate-900 text-white rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] shadow-xl shadow-slate-900/20 hover:scale-105 active:scale-95 transition-all"
                        >
                           {saving ? 'Committing...' : 'Commit Configuration'}
                        </button>
                     </div>
                  </form>
               </GlassCard>
             </motion.div>
           )}
        </AnimatePresence>

        {/* Curriculum Builder */}
        <div className="flex items-center justify-between mb-8">
           <h3 className="text-2xl font-black text-slate-900 italic tracking-tighter uppercase">Protocol Curriculum</h3>
           <button 
             onClick={handleAddChapter}
             className="px-8 py-4 bg-indigo-50 text-indigo-600 border border-indigo-100 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] flex items-center gap-2 hover:bg-indigo-600 hover:text-white transition-all shadow-sm"
           >
              <Plus size={16} /> New Chapter Hub
           </button>
        </div>

        {course.chapters?.length === 0 ? (
           <div className="py-24 flex flex-col items-center justify-center text-center bg-white border border-slate-100 rounded-[3rem] shadow-sm">
              <FolderGit2 size={48} className="text-slate-200 mb-6" />
              <h3 className="text-xl font-black text-slate-900 uppercase italic tracking-tighter mb-2">Zero Curriculum Nodes</h3>
              <p className="text-sm font-medium text-slate-500 max-w-sm mb-8">Initialize your first chapter hub to start adding actionable learning protocols.</p>
              <button onClick={handleAddChapter} className="px-8 py-4 bg-slate-900 text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl">Initialize Matrix</button>
           </div>
        ) : (
           <div className="space-y-8">
              {course.chapters?.map((chapter, ci) => (
                 <motion.div 
                   key={chapter.id}
                   initial={{ opacity: 0, y: 10 }}
                   animate={{ opacity: 1, y: 0 }}
                   className="bg-white border border-slate-100 rounded-[2.5rem] overflow-hidden shadow-sm hover:shadow-[0_20px_40px_-15px_rgba(0,0,0,0.05)] transition-all"
                 >
                    {/* Chapter Header */}
                    <div className="p-8 border-b border-slate-50 flex flex-col md:flex-row md:items-center justify-between gap-6 bg-slate-50/50">
                       <div className="flex items-center gap-6">
                          <div className="w-14 h-14 bg-indigo-50 rounded-2xl flex items-center justify-center font-black text-indigo-600 text-xl italic tracking-tighter border border-indigo-100 shrink-0">
                             {(ci + 1).toString().padStart(2, '0')}
                          </div>
                          <div>
                             <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] mb-1">Chapter Hub</p>
                             <h4 className="text-2xl font-black text-slate-900 italic tracking-tighter leading-none line-clamp-1">{chapter.title}</h4>
                          </div>
                       </div>
                       
                       <div className="flex items-center gap-3 shrink-0">
                          <div className="flex items-center gap-1 bg-white border border-slate-100 rounded-xl p-1 shadow-sm">
                             <button onClick={() => handleMoveChapter(ci, -1)} disabled={ci === 0} className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-slate-50 rounded-lg disabled:opacity-30 transition-colors"><ArrowUp size={16} /></button>
                             <button onClick={() => handleMoveChapter(ci, 1)} disabled={ci === course.chapters.length - 1} className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-slate-50 rounded-lg disabled:opacity-30 transition-colors"><ArrowDown size={16} /></button>
                          </div>
                          
                          <button onClick={() => handleAddLesson(chapter.id)} className="px-6 py-3 bg-slate-900 text-white rounded-xl text-[10px] font-black uppercase tracking-[0.2em] shadow-lg hover:bg-indigo-600 transition-colors flex items-center gap-2">
                             <Plus size={14} /> Unit
                          </button>
                          
                          <button onClick={() => handleDeleteChapter(chapter.id)} className="p-3 bg-rose-50 text-rose-500 rounded-xl hover:bg-rose-500 hover:text-white transition-colors">
                             <Trash2 size={16} />
                          </button>
                       </div>
                    </div>

                    {/* Lessons List */}
                    <div className="p-8 bg-white">
                       {chapter.lessons?.length === 0 ? (
                          <div className="text-center py-10 opacity-60">
                             <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">No lesson nodes injected yet.</p>
                          </div>
                       ) : (
                          <div className="space-y-4">
                             {chapter.lessons.map((lesson, li) => (
                                <div key={lesson.id} className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 p-6 bg-slate-50 border border-slate-100 rounded-3xl group hover:border-indigo-100 hover:bg-indigo-50/10 transition-all">
                                   <div className="flex items-center gap-5">
                                      <div className="w-10 h-10 rounded-xl bg-white border border-slate-200 flex items-center justify-center font-black text-slate-400 text-xs shadow-sm shrink-0">
                                         {li + 1}
                                      </div>
                                      <span className="text-sm font-black text-slate-700 uppercase italic tracking-wider line-clamp-1">{lesson.title}</span>
                                   </div>
                                   
                                   <div className="flex items-center gap-3 shrink-0">
                                      <div className="flex items-center gap-1 bg-white border border-slate-200 rounded-xl p-1">
                                         <button onClick={() => handleMoveLesson(chapter.id, li, -1)} disabled={li === 0} className="p-2 text-slate-400 hover:text-indigo-600 rounded-lg disabled:opacity-30 transition-colors"><ArrowUp size={14} /></button>
                                         <button onClick={() => handleMoveLesson(chapter.id, li, 1)} disabled={li === chapter.lessons.length - 1} className="p-2 text-slate-400 hover:text-indigo-600 rounded-lg disabled:opacity-30 transition-colors"><ArrowDown size={14} /></button>
                                      </div>
                                      <button onClick={() => navigate(`/editor/lessons/${lesson.id}`)} className="px-6 py-3 bg-white border border-slate-200 text-slate-600 rounded-xl text-[10px] font-black uppercase tracking-[0.2em] hover:text-indigo-600 hover:border-indigo-200 shadow-sm transition-all flex items-center gap-2">
                                         <Edit3 size={14} /> Edit Artifact
                                      </button>
                                      <button onClick={() => handleDeleteLesson(lesson.id)} className="p-3 bg-white border border-slate-200 text-slate-400 rounded-xl hover:text-rose-500 hover:border-rose-200 transition-colors">
                                         <Trash2 size={16} />
                                      </button>
                                   </div>
                                </div>
                             ))}
                          </div>
                       )}
                    </div>
                 </motion.div>
              ))}
           </div>
        )}
      </div>
    </DashboardLayout>
  );
}
