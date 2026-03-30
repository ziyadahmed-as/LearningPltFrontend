import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { getMyEnrollments } from '../services/api';
import DashboardLayout from '../components/DashboardLayout';
import { 
  BookOpen, Clock, CheckCircle, Play, 
  MoreVertical, Star, Search, Filter, 
  LayoutGrid, List, Clock3, Calendar, Activity, Zap, Award
} from 'lucide-react';
import { GlassCard } from '../components/glass-card';

export default function MyEnrollmentsPage() {
  const [enrollments, setEnrollments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [viewMode, setViewMode] = useState("grid");
  const [activeTab, setActiveTab] = useState("All");
  const navigate = useNavigate();

  useEffect(() => {
    getMyEnrollments().then(res => {
      setEnrollments(Array.isArray(res.data) ? res.data : res.data.results || []);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  const filteredEnrollments = enrollments.filter(e => {
     const matchesSearch = e.course_title.toLowerCase().includes(searchQuery.toLowerCase());
     if (activeTab === "All") return matchesSearch;
     if (activeTab === "In Progress") return matchesSearch && e.progress < 100;
     if (activeTab === "Completed") return matchesSearch && e.progress === 100;
     return matchesSearch;
  });

  const TABS = ["All", "In Progress", "Completed", "Archived"];

  if (loading) {
    return (
      <DashboardLayout title="Syncing Hub" subtitle="Temporal Knowledge Node Indexing">
        <div className="flex flex-col items-center justify-center py-40">
           <div className="w-16 h-16 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin shadow-xl shadow-indigo-600/10 mb-8" />
           <p className="text-xs font-black text-slate-400 uppercase tracking-[0.4em] animate-pulse">Establishing Signal...</p>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout 
      title="Knowledge Hub" 
      subtitle="Accessing synchronized education protocols"
    >
      <div className="space-y-16">
        
        {/* ─── Metric Matrix (Figma Stats) ─── */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
           {[
              { label: 'Active Protocols', val: enrollments.length, growth: '+12%', icon: Activity, color: 'text-indigo-600', bg: 'bg-indigo-50' },
              { label: 'Mastery Score', val: '84%', growth: '+4%', icon: Award, color: 'text-emerald-600', bg: 'bg-emerald-50' },
              { label: 'Clocked Units', val: '124h', growth: '+28h', icon: Clock, color: 'text-amber-600', bg: 'bg-amber-50' },
              { label: 'Verified Nodes', val: enrollments.filter(e => e.progress === 100).length, growth: 'NEW', icon: Zap, color: 'text-rose-600', bg: 'bg-rose-50' }
           ].map((stat, i) => (
              <GlassCard key={i} className="bg-white border-slate-100 p-8 shadow-xl shadow-slate-200/50 hover:scale-[1.02] transition-all group">
                 <div className="flex items-center justify-between mb-8">
                    <div className={`p-4 rounded-2xl ${stat.bg} ${stat.color} transition-transform group-hover:scale-110`}>
                       <stat.icon size={24} />
                    </div>
                    <span className="px-3 py-1 bg-emerald-50 text-emerald-600 text-[10px] font-black uppercase tracking-widest rounded-full leading-none">
                       {stat.growth}
                    </span>
                 </div>
                 <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-1">{stat.label}</p>
                 <h4 className="text-4xl font-black text-slate-900 italic tracking-tighter leading-none">{stat.val}</h4>
              </GlassCard>
           ))}
        </div>

        {/* ─── Filter Matrix ─── */}
        <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-8 border-b border-slate-100 pb-12">
            <div className="flex items-center gap-2 p-2 bg-white border border-slate-100 rounded-[2rem] shadow-sm">
               {TABS.map(tab => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`px-8 py-3.5 rounded-[1.5rem] text-[10px] font-black uppercase tracking-widest transition-all ${
                      activeTab === tab 
                        ? 'bg-slate-900 text-white shadow-xl shadow-black/20 italic' 
                        : 'text-slate-400 hover:text-slate-900 hover:bg-slate-50'
                    }`}
                  >
                    {tab}
                  </button>
               ))}
            </div>

            <div className="flex items-center gap-4">
               <div className="relative group flex-1 xl:flex-none">
                  <Search size={18} className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-600 transition-colors" />
                  <input 
                    type="text" 
                    placeholder="SCAN HUB ARTIFACTS..." 
                    className="w-full xl:w-80 h-16 pl-14 pr-6 bg-white border border-slate-100 rounded-[1.8rem] text-[10px] font-black tracking-[0.2em] shadow-sm focus:ring-1 focus:ring-indigo-600 focus:outline-none transition-all uppercase"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
               </div>
               <div className="flex items-center gap-2 p-2 bg-white border border-slate-100 rounded-[1.8rem] shadow-sm">
                  <button 
                    onClick={() => setViewMode("grid")}
                    className={`p-4 rounded-2xl transition-all ${viewMode === "grid" ? 'bg-indigo-600 text-white shadow-xl shadow-indigo-600/20' : 'text-slate-300 hover:text-indigo-600'}`}
                  >
                     <LayoutGrid size={20} />
                  </button>
                  <button 
                    onClick={() => setViewMode("list")}
                    className={`p-4 rounded-2xl transition-all ${viewMode === "list" ? 'bg-indigo-600 text-white shadow-xl shadow-indigo-600/20' : 'text-slate-300 hover:text-indigo-600'}`}
                  >
                     <List size={20} />
                  </button>
               </div>
            </div>
        </div>

        {/* ─── Artifact Matrix ─── */}
        {filteredEnrollments.length === 0 ? (
          <div className="py-40 flex flex-col items-center justify-center text-center bg-white border border-slate-100 rounded-[4rem] shadow-inner">
             <div className="w-24 h-24 bg-slate-50 rounded-full flex items-center justify-center text-slate-200 mb-10">
                <BookOpen size={48} />
             </div>
             <h3 className="text-3xl font-black text-slate-900 tracking-tighter uppercase italic mb-4">Zero Knowledge Detected</h3>
             <p className="text-slate-500 font-medium mb-12 max-w-sm">Initialization of your intellectual repository is pending. Sync with new signals today.</p>
             <button 
               onClick={() => navigate('/courses')}
               className="px-12 py-5 bg-indigo-600 text-white rounded-2xl font-black text-xs uppercase tracking-[0.3em] shadow-xl shadow-indigo-600/20 hover:scale-105 transition-all"
             >
                Explore Repository Signal
             </button>
          </div>
        ) : (
          <div className={`grid gap-10 ${viewMode === "grid" ? "grid-cols-1 md:grid-cols-2 lg:grid-cols-3" : "grid-cols-1"}`}>
            {filteredEnrollments.map((enr, i) => (
              <motion.div
                key={enr.id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                onClick={() => navigate(`/lesson/${enr.course}/view`)}
                className="group cursor-pointer bg-white border border-slate-100 rounded-[3rem] p-8 shadow-sm hover:shadow-2xl hover:scale-[1.01] transition-all relative overflow-hidden"
              >
                 {/* Progress Indicator (Figma Style) */}
                 <div className="absolute top-0 right-0 p-8">
                    <div className="w-16 h-16 rounded-full border-4 border-slate-50 flex items-center justify-center relative">
                       <svg className="w-full h-full -rotate-90 absolute inset-0">
                          <circle 
                             cx="32" cy="32" r="28" 
                             className="stroke-indigo-600 transition-all duration-1000" 
                             style={{ strokeDasharray: 176, strokeDashoffset: 176 - (176 * enr.progress) / 100, strokeLinecap: 'round', fill: 'none', strokeWidth: 4 }}
                          />
                       </svg>
                       <span className="text-[10px] font-black text-slate-900">{enr.progress}%</span>
                    </div>
                 </div>

                 <div className="flex flex-col gap-8">
                    <div className="w-20 h-20 bg-slate-50 rounded-2xl overflow-hidden shadow-inner border border-slate-100">
                       <img 
                         src={enr.course_thumbnail || 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=400'} 
                         className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700" 
                         alt="" 
                       />
                    </div>
                    
                    <div className="space-y-3">
                       <div className="flex items-center gap-3">
                          <span className="px-3 py-1 bg-indigo-50 text-indigo-600 text-[8px] font-black uppercase tracking-widest rounded-full">Synchronizing</span>
                          <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest leading-none">Last Signal: 2h ago</span>
                       </div>
                       <h4 className="text-3xl font-black text-slate-900 uppercase italic tracking-tighter leading-none group-hover:text-indigo-600 transition-colors">{enr.course_title}</h4>
                       <p className="text-sm font-medium text-slate-500 line-clamp-2">Mastering cognitive engagement protocols within the global hub index.</p>
                    </div>

                    <div className="pt-8 border-t border-slate-50 flex items-center justify-between">
                       <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-400"><Clock3 size={14} /></div>
                          <span className="text-xs font-black text-slate-600 italic">4h 30m Remainder</span>
                       </div>
                       <div className="w-12 h-12 bg-slate-900 text-white rounded-2xl flex items-center justify-center shadow-lg group-hover:bg-indigo-600 transition-all">
                          <Play size={20} fill="currentColor" />
                       </div>
                    </div>
                 </div>
              </motion.div>
            ))}
          </div>
        )}

        {/* ─── Global Sync Status (Banner) ─── */}
        <div className="bg-slate-900 rounded-[3rem] p-16 md:p-24 relative overflow-hidden group">
           <div className="absolute inset-0 bg-grid-white/[0.05] z-0" />
           <div className="absolute top-0 right-0 w-[50%] h-full bg-indigo-600 translate-x-1/2 -skew-x-12 opacity-80 z-0 group-hover:translate-x-[45%] transition-transform duration-1000" />
           
           <div className="relative z-10 flex flex-col md:flex-row items-center gap-12 justify-between">
              <div className="space-y-6 max-w-xl text-center md:text-left">
                 <h3 className="text-4xl md:text-6xl font-black text-white italic tracking-tighter leading-none uppercase">Hub Integrity <br/> Verified</h3>
                 <p className="text-xl font-medium text-white/50 leading-relaxed italic">Your knowledge cache is currently synchronized with the Global Hub. Deploy your verified credentials to the faculty network.</p>
                 <button className="px-12 py-5 bg-white text-slate-900 rounded-2xl font-black text-xs uppercase tracking-[0.3em] shadow-2xl hover:scale-105 active:scale-95 transition-all">Download Registry</button>
              </div>
              <div className="w-px h-64 bg-white/10 hidden xl:block" />
              <div className="space-y-10 hidden lg:block">
                 <div className="text-right">
                    <p className="text-[10px] font-black text-white/40 uppercase tracking-widest mb-1">Signal Strength</p>
                    <p className="text-4xl font-black text-white italic">100%</p>
                 </div>
                 <div className="text-right">
                    <p className="text-[10px] font-black text-white/40 uppercase tracking-widest mb-1">Peer Ranking</p>
                    <p className="text-4xl font-black text-indigo-400 italic">TOP 2%</p>
                 </div>
              </div>
           </div>
        </div>

      </div>
    </DashboardLayout>
  );
}
