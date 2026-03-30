import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { getInstructorStats, createCourse, deleteCourse, updateCourse, getCategories } from '../services/api';
import { useAuth } from '../context/AuthContext';
import DashboardLayout from '../components/DashboardLayout';
import StatCard from '../components/StatCard';
import { 
  BookOpen, CheckCircle, Clock, Users, Eye, Layers, 
  MoreVertical, Plus, Search, LayoutGrid, List, PlusCircle,
  FilePlus, Download, ExternalLink, Trash2, Edit3, Globe
} from 'lucide-react';

export default function MyCoursesPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState(null);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ 
    title: '', slug: '', description: '', price: '0.00', category: '', is_published: false 
  });
  const [thumbnailFile, setThumbnailFile] = useState(null);
  const [error, setError] = useState('');
  const [viewMode, setViewMode] = useState("grid");
  const [activeTab, setActiveTab] = useState("All Assets");

  useEffect(() => { loadData(); }, []);

  const loadData = async () => {
    try {
      const [statsRes, catsRes] = await Promise.all([getInstructorStats(), getCategories()]);
      setStats(statsRes.data);
      setCategories(Array.isArray(catsRes.data) ? catsRes.data : catsRes.data.results || []);
    } catch (err) {
      console.error('Failed to load dashboard data:', err);
    }
    setLoading(false);
  };

  const toSlug = (str) => str.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');

  const handleCreate = async (e) => {
    e.preventDefault();
    setError('');
    const formData = new FormData();
    Object.keys(form).forEach(key => formData.append(key, form[key]));
    if (thumbnailFile) formData.append('thumbnail', thumbnailFile);
    try {
      const { data } = await createCourse(formData);
      setShowForm(false);
      setThumbnailFile(null);
      setForm({ title: '', slug: '', description: '', price: '0.00', category: '', is_published: false });
      navigate(`/editor/courses/${data.id}`);
    } catch (err) {
      setError('System Failure: Asset initialization protocol failed.');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Terminate this protocol permanently?')) {
      await deleteCourse(id);
      loadData();
    }
  };

  const handleTogglePublish = async (course) => {
    try {
      await updateCourse(course.id, { is_published: !course.is_published });
      loadData();
    } catch { alert('Protocol update failed'); }
  };

  const update = (field, value) => {
    const next = { ...form, [field]: value };
    if (field === 'title') next.slug = toSlug(value);
    setForm(next);
  };

  if (loading || !stats) {
    return (
      <DashboardLayout title="Faculty Node" subtitle="Initializing Protocol Matrix">
        <div className="flex items-center justify-center min-h-[400px]">
           <div className="w-12 h-12 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin" />
        </div>
      </DashboardLayout>
    );
  }

  const TABS = ["All Assets", "Published", "Drafts", "Peer Review"];

  const filteredCourses = stats.courses.filter(c => {
     if (activeTab === "All Assets") return true;
     if (activeTab === "Published") return c.is_published;
     if (activeTab === "Drafts") return !c.is_published;
     return true;
  });

  return (
    <DashboardLayout 
      title="Curricular Hub" 
      subtitle="Administrative Management of Knowledge Artifacts"
    >
      <div className="space-y-12">
        
        {/* Institutional Statistics */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-6 gap-6">
          <StatCard icon={Layers} label="Protocol Total" value={stats.total_courses} variant="primary" />
          <StatCard icon={Globe} label="Live Deployment" value={stats.published} variant="success" />
          <StatCard icon={CheckCircle} label="Certified" value={stats.approved} variant="purple" />
          <StatCard icon={Clock} label="Under Review" value={stats.pending} variant="warning" />
          <StatCard icon={Users} label="Scholar Density" value={stats.total_enrollments} variant="cyan" />
          <StatCard icon={Eye} label="Global Impact" value={stats.total_views} variant="primary" />
        </div>

        {/* Figma Inspired Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 border-b border-white/5 pb-10">
           <div className="flex items-center gap-2 bg-white/5 p-1 rounded-2xl border border-white/10 overflow-x-auto whitespace-nowrap scrollbar-hide">
              {TABS.map(tab => (
                 <button 
                   key={tab}
                   onClick={() => setActiveTab(tab)}
                   className={`px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
                     activeTab === tab 
                       ? 'bg-indigo-600 text-white shadow-lg' 
                       : 'text-slate-500 hover:text-white hover:bg-white/5'
                   }`}
                 >
                   {tab}
                 </button>
              ))}
           </div>

           <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 bg-white/5 p-1 rounded-2xl border border-white/10">
                 <button onClick={() => setViewMode("grid")} className={`p-2.5 rounded-xl transition-all ${viewMode === "grid" ? 'bg-indigo-600 text-white shadow-lg' : 'text-slate-500 hover:text-white'}`}><LayoutGrid size={16} /></button>
                 <button onClick={() => setViewMode("list")} className={`p-2.5 rounded-xl transition-all ${viewMode === "list" ? 'bg-indigo-600 text-white shadow-lg' : 'text-slate-500 hover:text-white'}`}><List size={16} /></button>
              </div>
              <button 
                onClick={() => setShowForm(!showForm)}
                className="px-8 py-3 bg-white text-indigo-950 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] flex items-center gap-3 hover:scale-105 transition-all shadow-xl shadow-white/5"
              >
                 <Plus size={16} /> Initial Protocol
              </button>
           </div>
        </div>

        {/* Creation Overlay (Modal Style) */}
        <AnimatePresence>
           {showForm && (
              <motion.div 
                 initial={{ opacity: 0, scale: 0.95 }}
                 animate={{ opacity: 1, scale: 1 }}
                 exit={{ opacity: 0, scale: 0.95 }}
                 className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-slate-950/80 backdrop-blur-3xl"
              >
                 <div className="w-full max-w-2xl bg-[#020617] p-12 rounded-[3.5rem] border border-white/10 shadow-[0_50px_100px_-20px_rgba(0,0,0,0.5)] relative">
                    <button onClick={() => setShowForm(false)} className="absolute top-8 right-8 p-3 text-slate-500 hover:text-white transition-colors">
                       <X size={24} />
                    </button>
                    
                    <div className="mb-10 text-center">
                       <h2 className="text-4xl font-black text-white italic tracking-tighter mb-2">Protocol Genesis</h2>
                       <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest italic">Initialize a New Knowledge Artifact</p>
                    </div>

                    <form onSubmit={handleCreate} className="space-y-6">
                       <div className="space-y-2">
                          <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-4">Module Identifier</label>
                          <input 
                            className="w-full bg-white/5 border border-white/5 rounded-3xl p-5 text-sm font-bold text-white focus:ring-1 focus:ring-indigo-500/20 transition-all focus:border-indigo-500/20" 
                            placeholder="Engineering Dynamics v1.0"
                            value={form.title} 
                            onChange={(e) => update('title', e.target.value)} 
                            required 
                          />
                       </div>

                       <div className="grid grid-cols-2 gap-6">
                          <div className="space-y-2">
                             <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-4">Deployment Slot</label>
                             <select 
                                className="w-full bg-white/5 border border-white/5 rounded-3xl p-5 text-sm font-bold text-white appearance-none" 
                                value={form.category} 
                                onChange={(e) => update('category', e.target.value)}
                             >
                                <option value="" className="bg-slate-950">Select Sector</option>
                                {categories.map((c) => (
                                   <option key={c.id} value={c.id} className="bg-slate-950">{c.name}</option>
                                ))}
                             </select>
                          </div>
                          <div className="space-y-2">
                             <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-4">Protocol Valuation</label>
                             <input 
                                className="w-full bg-white/5 border border-white/5 rounded-3xl p-5 text-sm font-bold text-white" 
                                type="number" step="0.01" 
                                value={form.price} 
                                onChange={(e) => update('price', e.target.value)} 
                             />
                          </div>
                       </div>

                       <div className="space-y-2">
                          <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-4">Summary Protocol</label>
                          <textarea 
                             className="w-full bg-white/5 border border-white/5 rounded-3xl p-5 text-sm font-bold text-white min-h-[120px]" 
                             value={form.description} 
                             onChange={(e) => update('description', e.target.value)} 
                             required 
                          />
                       </div>

                       <div className="pt-6">
                          <button 
                            className="w-full py-5 bg-indigo-600 text-white rounded-[2rem] font-black text-[10px] font-black uppercase tracking-[0.3em] shadow-xl shadow-indigo-600/20 hover:scale-[1.02] active:scale-[0.98] transition-all" 
                            type="submit"
                          >
                             Commit to Hub Registry
                          </button>
                       </div>
                    </form>
                 </div>
              </motion.div>
           )}
        </AnimatePresence>

        {/* Dashboard Grid - Figma Files Appearance */}
        {filteredCourses.length === 0 ? (
           <div className="py-24 flex flex-col items-center justify-center text-center opacity-40">
              <FilePlus size={64} strokeWidth={1} />
              <p className="mt-8 text-xs font-black uppercase tracking-[0.2em]">No Modules Detected in Hub Segment</p>
           </div>
        ) : viewMode === "grid" ? (
           <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-10">
             {filteredCourses.map((course, i) => (
                <motion.div 
                   key={course.id}
                   initial={{ opacity: 0, y: 10 }}
                   animate={{ opacity: 1, y: 0 }}
                   transition={{ delay: i * 0.05 }}
                   className="group"
                >
                   <div className="relative aspect-[4/3] rounded-[2.5rem] overflow-hidden bg-slate-900 border border-white/5 group-hover:border-indigo-500/50 transition-all shadow-2xl">
                      <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-slate-950/90 to-transparent z-10" />
                      {course.thumbnail ? (
                         <img src={course.thumbnail} className="w-full h-full object-cover grayscale-[0.3] group-hover:grayscale-0 transition-all duration-700 opacity-60 group-hover:opacity-100" alt="" />
                      ) : (
                         <div className="w-full h-full flex items-center justify-center text-indigo-500/20 bg-indigo-500/5 font-black text-6xl italic">F</div>
                      )}
                      
                      <div className="absolute top-6 left-6 z-20">
                         <span className={`px-2.5 py-1 rounded-full text-[8px] font-black uppercase tracking-widest ${course.is_published ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-amber-500/10 text-amber-500 border border-amber-500/20'}`}>
                            {course.is_published ? 'Deployed' : 'Draft Node'}
                         </span>
                      </div>
                      
                      <div className="absolute bottom-6 left-6 right-6 z-20 flex justify-between items-end">
                         <div>
                            <p className="text-[10px] font-black text-indigo-400 uppercase tracking-widest mb-1 leading-none">{course.lesson_count} UNITS</p>
                            <p className="text-sm font-black text-white italic truncate max-w-[140px] leading-tight">{course.title}</p>
                         </div>
                         <div className="text-right">
                            <button 
                               onClick={() => navigate(`/editor/courses/${course.id}`)}
                               className="p-3 bg-white/10 hover:bg-white text-white hover:text-indigo-950 rounded-2xl backdrop-blur-md transition-all border border-white/10"
                            >
                               <Edit3 size={16} />
                            </button>
                         </div>
                      </div>
                   </div>

                   {/* Quick Stats Summary Below Figma Card */}
                   <div className="mt-6 flex items-center justify-between px-3 text-[9px] font-black uppercase tracking-widest text-slate-600">
                      <div className="flex items-center gap-4">
                         <span className="flex items-center gap-1.5"><Users size={12} className="text-slate-500" /> {course.enrollment_count}</span>
                         <span className="flex items-center gap-1.5"><Eye size={12} className="text-slate-500" /> {course.views_count}</span>
                      </div>
                      <button onClick={() => handleDelete(course.id)} className="p-2 text-slate-700 hover:text-rose-500 transition-colors">
                         <Trash2 size={16} />
                      </button>
                   </div>
                </motion.div>
             ))}
           </div>
        ) : (
           /* Optimized List View */
           <div className="space-y-4">
             {filteredCourses.map((course, i) => (
                <motion.div
                   key={course.id}
                   initial={{ opacity: 0, x: -10 }}
                   animate={{ opacity: 1, x: 0 }}
                   transition={{ delay: i * 0.05 }}
                   className="group p-5 bg-white/5 border border-white/5 rounded-3xl flex items-center gap-8 hover:bg-white/10 hover:border-indigo-500/20 transition-all"
                >
                   <div className="w-16 h-12 bg-slate-800 rounded-xl overflow-hidden flex-shrink-0">
                      <img src={course.thumbnail} className="w-full h-full object-cover opacity-60 group-hover:opacity-100" />
                   </div>
                   <div className="flex-1 min-w-0">
                      <h4 className="text-xs font-black text-white uppercase tracking-wider truncate mb-1">{course.title}</h4>
                      <p className="text-[9px] font-black text-slate-600 uppercase tracking-widest italic">{course.lesson_count} Protocol Clusters</p>
                   </div>
                   <div className="hidden lg:flex items-center gap-16">
                      <div className="text-center">
                         <p className="text-[8px] font-black text-slate-600 uppercase tracking-[0.2em] mb-1">Status</p>
                         <p className={`text-[10px] font-black italic uppercase ${course.is_published ? 'text-emerald-400' : 'text-amber-400'}`}>
                            {course.is_published ? 'Deployed' : 'Draft'}
                         </p>
                      </div>
                      <div className="text-center">
                         <p className="text-[8px] font-black text-slate-600 uppercase tracking-[0.2em] mb-1">Engagement</p>
                         <p className="text-[10px] font-black text-white uppercase italic">{course.enrollment_count} Nodes</p>
                      </div>
                      <div className="text-center">
                         <p className="text-[8px] font-black text-slate-600 uppercase tracking-[0.2em] mb-1">Market Equity</p>
                         <p className="text-[10px] font-black text-white uppercase italic">${course.price}</p>
                      </div>
                   </div>
                   <div className="flex items-center gap-3">
                      <button onClick={() => navigate(`/editor/courses/${course.id}`)} className="p-3 bg-white/5 hover:bg-indigo-600 text-slate-400 hover:text-white rounded-xl transition-all"><Edit3 size={16} /></button>
                      <button onClick={() => handleTogglePublish(course)} className="p-3 bg-white/5 hover:bg-white text-slate-400 hover:text-indigo-900 rounded-xl transition-all">{course.is_published ? <Download size={16} /> : <Globe size={16} />}</button>
                      <button onClick={() => handleDelete(course.id)} className="p-3 bg-white/5 hover:bg-rose-600 text-slate-400 hover:text-white rounded-xl transition-all"><Trash2 size={16} /></button>
                   </div>
                </motion.div>
             ))}
           </div>
        )}
      </div>
    </DashboardLayout>
  );
}
