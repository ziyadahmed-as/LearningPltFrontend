import { useEffect, useState, useMemo } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { getCourses, getCategories } from '../services/api';
import { Search, Filter, BookOpen, Users, Star, Clock, ArrowUpRight, GraduationCap, TrendingUp, ChevronDown, LayoutGrid, List, Zap, Radio, Code, Brain } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { GlassCard } from '../components/glass-card';
import CourseCard from '../components/CourseCard';

export default function CoursesPage() {
  const [courses, setCourses] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedType, setSelectedType] = useState('all');
  const [sortBy, setSortBy] = useState('newest');
  const [priceFilter, setPriceFilter] = useState('all'); 
  const [viewMode, setViewMode] = useState('grid');
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  useEffect(() => {
    const typeParam = searchParams.get('type');
    if (typeParam) setSelectedType(typeParam);

    Promise.all([getCourses(), getCategories()])
      .then(([coursesRes, catsRes]) => {
        const all = Array.isArray(coursesRes.data)
          ? coursesRes.data
          : coursesRes.data.results || [];
        setCourses(all);

        const cats = Array.isArray(catsRes.data)
          ? catsRes.data
          : catsRes.data.results || [];
        setCategories(cats);
      })
      .catch((err) => console.error("Identity retrieval failure:", err))
      .finally(() => setLoading(false));
  }, []);

  const filtered = useMemo(() => {
    let list = [...courses];
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(
        (c) =>
          c.title?.toLowerCase().includes(q) ||
          c.description?.toLowerCase().includes(q) ||
          c.instructor_name?.toLowerCase().includes(q)
      );
    }
    if (selectedCategory !== 'all') {
      list = list.filter((c) => String(c.category) === selectedCategory);
    }
    if (selectedType !== 'all') {
      list = list.filter((c) => c.course_type === selectedType);
    }
    if (priceFilter === 'free') {
      list = list.filter((c) => parseFloat(c.price) === 0);
    } else if (priceFilter === 'paid') {
      list = list.filter((c) => parseFloat(c.price) > 0);
    }
    
    if (sortBy === 'newest') {
      list.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
    } else if (sortBy === 'popular') {
      list.sort((a, b) => (b.enrollment_count || 0) - (a.enrollment_count || 0));
    } else if (sortBy === 'price_asc') {
      list.sort((a, b) => parseFloat(a.price) - parseFloat(b.price));
    } else if (sortBy === 'price_desc') {
      list.sort((a, b) => parseFloat(b.price) - parseFloat(a.price));
    }
    return list;
  }, [courses, search, selectedCategory, selectedType, priceFilter, sortBy]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center">
        <div className="text-center">
          <div className="w-20 h-20 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto mb-10 shadow-xl" />
          <p className="text-slate-400 font-black uppercase tracking-[0.4em] text-[10px] animate-pulse">Syncing Knowledge Reservoir...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-900 pt-32 pb-32 font-sans selection:bg-indigo-500/10">
      
      {/* ─── Header Section ─── */}
      <section className="container mx-auto px-10 mb-20">
         <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-12 border-b border-slate-100 pb-20">
            <motion.div
               initial={{ opacity: 0, x: -30 }}
               animate={{ opacity: 1, x: 0 }}
               transition={{ duration: 0.8 }}
               className="space-y-6"
            >
               <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-indigo-600/20">
                     <TrendingUp size={20} />
                  </div>
                  <span className="text-xs font-black text-indigo-600 uppercase tracking-[0.4em]">Knowledge Repository</span>
               </div>
               <h1 className="text-5xl md:text-8xl font-black text-slate-900 tracking-tighter leading-none italic uppercase">
                  Master Your <br/> Intellectual Path
               </h1>
               <p className="text-xl font-medium text-slate-500 max-w-2xl leading-relaxed">
                  Discover {courses.length} high-fidelity modules across various technology and academic domains. Synchronize your skills with global standards.
               </p>
            </motion.div>

            <div className="flex flex-wrap gap-4 bg-white p-3 rounded-[2.5rem] border border-slate-100 shadow-xl shadow-slate-200/50">
               <div className="px-10 py-4 border-r border-slate-50">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Active Artifacts</p>
                  <p className="text-3xl font-black text-slate-900 italic tracking-tighter">{courses.length}</p>
               </div>
               <div className="px-10 py-4">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Verified Nodes</p>
                  <p className="text-3xl font-black text-slate-900 italic tracking-tighter">100%</p>
               </div>
            </div>
         </div>
      </section>

      {/* ─── Search & Filter Hub ─── */}
      <section className="container mx-auto px-10 mb-16">
         <div className="flex flex-col xl:flex-row items-center gap-6">
            {/* Search Matrix */}
            <div className="relative flex-1 w-full group">
               <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-600 transition-colors" size={20} />
               <input 
                  type="text" 
                  placeholder="SEARCH HUB INDEX (SYMBOLS, FACULTY, TAGS)..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full h-16 bg-white border border-slate-100 rounded-[1.8rem] pl-16 pr-8 text-sm font-bold text-slate-900 tracking-tighter shadow-sm focus:ring-1 focus:ring-indigo-600 focus:outline-none transition-all"
               />
            </div>

            {/* Filter Hub */}
            <div className="flex flex-wrap items-center gap-4 w-full xl:w-auto">
               <div className="relative flex-1 xl:w-64 min-w-[200px]">
                  <select 
                     value={selectedCategory}
                     onChange={(e) => setSelectedCategory(e.target.value)}
                     className="w-full h-16 bg-white border border-slate-100 rounded-[1.8rem] px-8 text-[10px] font-black uppercase tracking-[0.2em] cursor-pointer appearance-none focus:ring-1 focus:ring-indigo-600 focus:outline-none shadow-sm"
                  >
                     <option value="all">ALL DOMAINS</option>
                     {categories.map(cat => <option key={cat.id} value={String(cat.id)}>{cat.name.toUpperCase()}</option>)}
                  </select>
                  <ChevronDown className="absolute right-6 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" size={16} />
               </div>

               <div className="relative flex-1 xl:w-48 min-w-[160px]">
                  <select 
                     value={sortBy}
                     onChange={(e) => setSortBy(e.target.value)}
                     className="w-full h-16 bg-white border border-slate-100 rounded-[1.8rem] px-8 text-[10px] font-black uppercase tracking-[0.2em] cursor-pointer appearance-none focus:ring-1 focus:ring-indigo-600 focus:outline-none shadow-sm"
                  >
                     <option value="newest">LATEST NODES</option>
                     <option value="popular">TOP TRENDING</option>
                     <option value="price_asc">PRICE: ASC</option>
                     <option value="price_desc">PRICE: DESC</option>
                  </select>
                  <ChevronDown className="absolute right-6 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" size={16} />
               </div>

               <div className="relative flex-1 xl:w-64 min-w-[200px]">
                  <select 
                     value={selectedType}
                     onChange={(e) => setSelectedType(e.target.value)}
                     className="w-full h-16 bg-white border border-slate-100 rounded-[1.8rem] px-8 text-[10px] font-black uppercase tracking-[0.2em] cursor-pointer appearance-none focus:ring-1 focus:ring-indigo-600 focus:outline-none shadow-sm"
                  >
                     <option value="all">ALL MODES</option>
                     <option value="LIVE_TUTORIAL">LIVE TUTORIAL HUB</option>
                     <option value="HARD_SKILL_RECORDED">HARD SKILL MATRIX</option>
                     <option value="SOFT_SKILL">SOFT SKILL MASTERY</option>
                  </select>
                  <Radio className="absolute right-6 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" size={16} />
               </div>

               <div className="flex items-center gap-2 p-2 bg-white border border-slate-100 rounded-[1.8rem] shadow-sm">
                  <button onClick={() => setViewMode('grid')} className={`p-4 rounded-2xl transition-all ${viewMode === 'grid' ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/20' : 'text-slate-400 hover:bg-slate-50'}`}><LayoutGrid size={20} /></button>
                  <button onClick={() => setViewMode('list')} className={`p-4 rounded-2xl transition-all ${viewMode === 'list' ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/20' : 'text-slate-400 hover:bg-slate-50'}`}><List size={20} /></button>
               </div>
            </div>
         </div>
      </section>

      {/* ─── Module Matrix ─── */}
      <section className="container mx-auto px-10">
         <AnimatePresence mode="popLayout">
            {filtered.length === 0 ? (
               <motion.div 
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="py-64 flex flex-col items-center justify-center text-center bg-white border border-slate-100 rounded-[4rem] shadow-inner"
               >
                  <div className="w-24 h-24 bg-slate-50 rounded-full flex items-center justify-center text-slate-300 mb-10">
                     <BookOpen size={48} />
                  </div>
                  <h3 className="text-3xl font-black text-slate-900 tracking-tighter italic uppercase mb-4">Zero Knowledge Results</h3>
                  <p className="text-slate-500 font-medium mb-12 max-w-md">Your neural query did not match any active module artifacts in the hub index.</p>
                  <button 
                     onClick={() => { setSearch(''); setSelectedCategory('all'); setPriceFilter('all'); }}
                     className="px-12 py-5 bg-indigo-600 text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-indigo-500 transition-all shadow-xl shadow-indigo-600/20"
                  >
                     Reset Hub Index
                  </button>
               </motion.div>
            ) : (
               <motion.div 
                  layout
                  className={`grid gap-12 ${viewMode === 'grid' ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3' : 'grid-cols-1'}`}
               >
                  {filtered.map(course => (
                     <CourseCard key={course.id} course={course} />
                  ))}
               </motion.div>
            )}
         </AnimatePresence>
      </section>

      {/* ─── Footer CTA ─── */}
      <section className="container mx-auto px-10 mt-40">
         <div className="bg-slate-900 rounded-[4rem] p-16 md:p-32 flex flex-col md:flex-row items-center justify-between gap-16 relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-[60%] h-full bg-indigo-600 translate-x-1/2 -skew-x-12 opacity-80 z-0 transition-transform group-hover:translate-x-[45%]" />
            <div className="relative z-10 text-white space-y-8">
               <h3 className="text-5xl md:text-7xl font-black tracking-tighter leading-none italic uppercase">Missing a <br/> Mastery Unit?</h3>
               <p className="text-xl font-medium text-white/60 max-w-xl">
                  Contact our hub moderator to request specific intellectual protocols or to propose a Faculty Registry addition.
               </p>
               <button className="px-12 py-5 bg-white text-slate-950 rounded-2xl font-black text-xs uppercase tracking-[0.3em] hover:scale-105 active:scale-95 transition-all shadow-2xl flex items-center gap-4">
                  Request Portal Signal <ArrowUpRight size={20} />
               </button>
            </div>
            <div className="relative z-10 hidden xl:block">
               <GraduationCap size={240} className="text-white/10 -rotate-12" />
            </div>
         </div>
      </section>
    </div>
  );
}
