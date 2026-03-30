import { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { useAuth } from '../context/AuthContext';
import { 
  LayoutDashboard, Users, CheckCircle, Layers, 
  BookOpen, DollarSign, UserCircle, LogOut, Menu, X, HelpCircle,
  Bell, Search, Activity, Briefcase, Settings, ArrowRight, ShieldCheck
} from 'lucide-react';
import { GlassCard } from './glass-card';

export default function DashboardLayout({ 
  children, 
  title, 
  subtitle, 
  tabs = null, 
  activeTab = null, 
  onTabChange = null 
}) {
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const getRoleMenu = () => {
    switch (user?.role) {
      case 'ADMIN':
        return [
          { id: 'overview', label: 'Systems Overview', icon: Activity, path: '/admin/dashboard' },
          { id: 'users', label: 'User Registry', icon: Users, path: '/admin/users' },
          { id: 'courses', label: 'Course Pipeline', icon: Layers, path: '/admin/dashboard' },
        ];
      case 'INSTRUCTOR':
        return [
          { id: 'my-courses', label: 'Curricular Assets', icon: BookOpen, path: '/my-courses' },
          { id: 'revenue', label: 'Revenue Analytics', icon: DollarSign, path: '/revenue' },
          { id: 'profile', label: 'Faculty Profile', icon: UserCircle, path: '/profile' },
        ];
      case 'STUDENT':
        return [
          { id: 'enrollments', label: 'Enrolled Modules', icon: CheckCircle, path: '/my-enrollments' },
          { id: 'browse', label: 'Knowledge Base', icon: BookOpen, path: '/courses' },
          { id: 'profile', label: 'Scholar Identity', icon: UserCircle, path: '/profile' },
        ];
      default:
        return [];
    }
  };

  const navItems = tabs || getRoleMenu();

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-900 font-sans selection:bg-indigo-500/10 flex overflow-hidden">
      
      {/* ─── Sidebar - Desktop (Figma Black Style) ─── */}
      <aside className="hidden lg:flex flex-col w-80 bg-slate-900 text-white p-10 relative z-50 shadow-2xl">
        <div 
          onClick={() => navigate('/')} 
          className="cursor-pointer mb-20 flex items-center gap-4 group"
        >
          <div className="w-12 h-12 bg-white/10 backdrop-blur-md rounded-2xl flex items-center justify-center border border-white/20 group-hover:rotate-12 transition-transform shadow-xl shadow-black/20">
            <BookOpen size={24} className="text-white" />
          </div>
          <span className="text-4xl font-black italic tracking-tighter uppercase leading-none">EduTech</span>
        </div>

        <nav className="flex-1 space-y-3">
          <p className="text-[10px] font-black text-white/30 uppercase tracking-[0.4em] mb-10 px-2">Knowledge Core</p>
          {navItems.map(item => {
            const isActive = tabs ? activeTab === item.id : location.pathname === item.path;
            const Icon = item.icon;
            
            return (
              <button
                key={item.id}
                onClick={() => {
                   if (tabs) onTabChange(item.id);
                   else navigate(item.path);
                }}
                className={`w-full flex items-center gap-4 px-6 py-5 rounded-2xl transition-all group relative border ${
                  isActive 
                    ? 'bg-white/10 border-white/20 text-white shadow-xl shadow-black/20' 
                    : 'text-white/40 border-transparent hover:text-white hover:bg-white/5'
                }`}
              >
                {isActive && (
                   <motion.div 
                     layoutId="active-nav-glow"
                     className="absolute -left-2 w-1.5 h-8 bg-indigo-500 rounded-full blur-[2px] shadow-[0_0_15px_rgba(99,102,241,0.8)]"
                   />
                )}
                <Icon size={20} className={`${isActive ? 'text-indigo-400' : 'group-hover:text-white'} transition-colors`} />
                <span className="text-xs font-black uppercase tracking-[0.2em] italic">{item.label}</span>
              </button>
            );
          })}
        </nav>

        <div className="mt-auto space-y-4 pt-10 border-t border-white/10">
           <div className="p-8 bg-gradient-to-tr from-indigo-600 to-purple-700 rounded-[2.5rem] text-center relative overflow-hidden group shadow-2xl shadow-indigo-600/20">
              <div className="absolute top-0 left-0 w-full h-full bg-grid-white/[0.1] z-0" />
              <div className="relative z-10">
                 <p className="text-[10px] font-black text-white/60 uppercase tracking-widest mb-1 leading-none">Upgrade Account</p>
                 <p className="text-lg font-black text-white mb-6 uppercase italic tracking-tighter">Platinum Hub</p>
                 <button className="w-full py-4 bg-white text-indigo-950 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] shadow-2xl hover:scale-[1.05] active:scale-95 transition-all">
                    Initialize
                 </button>
              </div>
           </div>

           <button 
             onClick={handleLogout}
             className="w-full flex items-center justify-between px-6 py-5 text-white/30 hover:text-rose-400 hover:bg-rose-500/5 rounded-2xl transition-all border border-transparent hover:border-rose-500/10 group"
           >
             <div className="flex items-center gap-4">
                <LogOut size={20} />
                <span className="text-xs font-black uppercase tracking-widest">Terminate</span>
             </div>
             <ArrowRight size={16} className="opacity-0 group-hover:opacity-100 transition-all translate-x-2" />
           </button>
        </div>
      </aside>

      {/* ─── Main Content Area (Figma Light Style) ─── */}
      <main className="flex-1 flex flex-col min-w-0 bg-[#F8FAFC] h-screen overflow-y-auto relative">
        
        {/* Dash Header */}
        <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-3xl border-b border-slate-100 px-12 h-24 flex items-center justify-between shadow-sm">
           <div className="flex items-center gap-8 flex-1">
              <button 
                onClick={() => setIsMobileOpen(true)}
                className="lg:hidden p-3 hover:bg-slate-50 rounded-2xl transition-all border border-slate-100"
              >
                 <Menu size={24} className="text-slate-600" />
              </button>
              
              <div className="hidden lg:flex items-center gap-3">
                 <ShieldCheck size={18} className="text-indigo-600" />
                 <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">Protocol Alpha Verified</p>
              </div>

              <div className="hidden xl:flex relative group max-w-md w-full">
                 <Search size={18} className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-600 transition-colors" />
                 <input 
                   type="text" 
                   placeholder="SEARCH HUB ARTIFACTS..." 
                   className="w-full h-14 pl-16 pr-6 bg-slate-50 border border-slate-100 rounded-2xl focus:outline-none focus:ring-1 focus:ring-indigo-600/10 focus:bg-white transition-all text-[10px] font-black uppercase tracking-[0.2em] text-slate-900"
                 />
              </div>
           </div>

           <div className="flex items-center gap-6">
              <button className="p-4 bg-slate-50 hover:bg-slate-100 text-slate-400 hover:text-indigo-600 rounded-2xl border border-slate-100 transition-all relative">
                 <Bell size={20} />
                 <span className="absolute top-4 right-4 w-2 h-2 bg-indigo-600 rounded-full border-2 border-white"></span>
              </button>
              
              <button className="hidden sm:flex p-4 bg-slate-50 hover:bg-slate-100 text-slate-400 rounded-2xl border border-slate-100 transition-all">
                 <Settings size={20} />
              </button>

              <div 
                onClick={() => navigate('/profile')}
                className="flex items-center gap-4 p-2 pl-6 bg-white border border-slate-100 rounded-[1.5rem] hover:shadow-xl hover:scale-[1.02] cursor-pointer transition-all active:scale-95"
              >
                 <div className="hidden md:block text-right">
                    <p className="text-xs font-black text-slate-900 leading-none mb-1 italic uppercase tracking-tighter">{user?.username}</p>
                    <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">{user?.role} NODE</p>
                 </div>
                 <div className="w-12 h-12 bg-slate-900 rounded-2xl flex items-center justify-center font-black text-white shadow-xl shadow-black/20 text-lg italic">
                    {user?.username?.[0]?.toUpperCase()}
                 </div>
              </div>
           </div>
        </header>

        {/* Dash Content Body */}
        <div className="p-12 md:p-20">
           <div className="max-w-[1440px] mx-auto">
              <div className="flex flex-col md:flex-row md:items-end justify-between gap-12 mb-20 border-b border-slate-100 pb-12">
                 <div className="space-y-4">
                    <div className="flex items-center gap-3">
                       <span className="w-2 h-2 rounded-full bg-indigo-600 animate-pulse" />
                       <span className="text-[10px] font-black text-indigo-600 uppercase tracking-[0.5em]">Command Center Active</span>
                    </div>
                    <h1 className="text-5xl md:text-7xl font-black text-slate-900 tracking-tighter italic leading-none uppercase">{title}</h1>
                    <p className="text-xl font-medium text-slate-400 uppercase tracking-[0.2em]">{subtitle}</p>
                 </div>
                 
                 <div className="flex items-center gap-4">
                    <button 
                       onClick={() => window.dispatchEvent(new CustomEvent('open-fatra-ai'))}
                       className="h-16 px-8 bg-indigo-600 text-white rounded-2xl font-black text-[10px] uppercase tracking-[0.3em] flex items-center gap-4 shadow-xl shadow-indigo-600/30 hover:scale-105 active:scale-95 transition-all"
                    >
                       <Briefcase size={20} /> Hub AI Engine
                    </button>
                    <button 
                       className="h-16 w-16 bg-white border border-slate-100 rounded-2xl flex items-center justify-center text-slate-400 hover:text-indigo-600 hover:shadow-xl transition-all"
                    >
                       <HelpCircle size={24} />
                    </button>
                 </div>
              </div>

              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, ease: "easeOut" }}
              >
                 {children}
              </motion.div>
           </div>
        </div>

        {/* Page End Gradient */}
        <div className="h-64 bg-gradient-to-t from-slate-100/50 to-transparent pointer-events-none" />
      </main>

      {/* ─── Mobile Drawer (Dark) ─── */}
      <AnimatePresence>
         {isMobileOpen && (
            <motion.div 
               initial={{ opacity: 0 }}
               animate={{ opacity: 1 }}
               exit={{ opacity: 0 }}
               onClick={() => setIsMobileOpen(false)}
               className="fixed inset-0 bg-slate-950/60 backdrop-blur-xl z-[60] lg:hidden"
            />
         )}
      </AnimatePresence>

      <AnimatePresence>
         {isMobileOpen && (
            <motion.div
               initial={{ x: '-100%' }}
               animate={{ x: 0 }}
               exit={{ x: '-100%' }}
               transition={{ type: 'spring', damping: 30, stiffness: 300 }}
               className="fixed inset-y-0 left-0 w-[85%] max-w-sm bg-slate-900 text-white z-[70] lg:hidden p-10 flex flex-col shadow-2xl"
            >
               <div className="flex justify-between items-center mb-20 border-b border-white/5 pb-10">
                  <div className="flex items-center gap-4">
                     <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center text-white border border-white/20">
                        <BookOpen size={20} />
                     </div>
                     <span className="text-3xl font-black italic tracking-tighter uppercase">EduTech</span>
                  </div>
                  <button onClick={() => setIsMobileOpen(false)} className="p-3 bg-white/5 rounded-2xl text-white/50">
                     <X size={24} />
                  </button>
               </div>

               <nav className="flex-1 space-y-4">
                  {navItems.map(item => {
                     const isActive = tabs ? activeTab === item.id : location.pathname === item.path;
                     const Icon = item.icon;
                     return (
                        <button
                           key={item.id}
                           onClick={() => {
                              if (tabs) onTabChange(item.id);
                              else navigate(item.path);
                              setIsMobileOpen(false);
                           }}
                           className={`w-full flex items-center gap-5 px-6 py-5 rounded-[1.5rem] transition-all border ${
                              isActive ? 'bg-indigo-600 border-indigo-500 text-white shadow-2xl shadow-indigo-600/30' : 'text-white/40 border-transparent hover:text-white hover:bg-white/5'
                           }`}
                        >
                           <Icon size={24} />
                           <span className="text-xs font-black uppercase tracking-[0.2em] italic">{item.label}</span>
                        </button>
                     );
                  })}
               </nav>

               <div className="mt-auto pt-10 border-t border-white/5 space-y-6">
                  <button 
                    onClick={handleLogout}
                    className="w-full flex items-center justify-between px-6 py-6 text-white/30 hover:text-rose-400 transition-all group"
                  >
                    <div className="flex items-center gap-5">
                       <LogOut size={24} />
                       <span className="text-xs font-black uppercase tracking-widest">Terminate Account</span>
                    </div>
                  </button>
               </div>
            </motion.div>
         )}
      </AnimatePresence>
    </div>
  );
}
