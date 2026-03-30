import { useEffect, useState, useCallback } from "react";
import { useSearchParams } from "react-router-dom";
import { motion, AnimatePresence } from "motion/react";
import DashboardLayout from "../components/DashboardLayout";
import StatCard from "../components/StatCard";
import { GlassCard } from "../components/glass-card";
import {
  Users, BookOpen, DollarSign, TrendingUp,
  CheckCircle, XCircle, Activity, RefreshCw, AlertCircle,
  BarChart2, ShieldCheck, ArrowRight, ShieldAlert,
  Clock, Zap, Globe, Package, Layers, Info
} from "lucide-react";
import {
  LineChart, Line, BarChart, Bar, XAxis, YAxis,
  CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area, Legend,
} from "recharts";
import {
  getAdminStats, approveInstructor, rejectInstructor,
  getAllCourses, adminApproveCourse, adminUnapproveCourse, getUsers,
} from "../services/api";

// ─── Helpers ──────────────────────────────────────────────────────────────────
const fmt = (n) =>
  n >= 1_000_000
    ? `${(n / 1_000_000).toFixed(1)}M`
    : n >= 1_000
    ? `${(n / 1_000).toFixed(1)}K`
    : String(n || 0);

const fmtMoney = (n) =>
  n >= 1_000 ? `$${(n / 1_000).toFixed(1)}K` : `$${(n || 0).toFixed(0)}`;

const ROLE_COLORS = {
  STUDENT: "bg-indigo-50 text-indigo-600 border-indigo-100",
  INSTRUCTOR: "bg-purple-50 text-purple-600 border-purple-100",
  ADMIN: "bg-rose-50 text-rose-600 border-rose-100",
};

const TABS = [
  { id: "Overview", icon: Activity, label: "Systems Overview" },
  { id: "Courses", icon: Layers, label: "Course Pipeline" },
  { id: "Users", icon: Users, label: "User Registry" },
  { id: "Categories", icon: BarChart2, label: "Analytics" }
];

// ─── Main Component ───────────────────────────────────────────────────────────
export default function AdminDashboardPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const activeTab = searchParams.get("tab") || "Overview";
  const setActiveTab = (tab) => setSearchParams({ tab });
  const [stats, setStats] = useState(null);
  const [courses, setCourses] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionMsg, setActionMsg] = useState("");
  const [actionErr, setActionErr] = useState("");

  const loadAll = useCallback(async () => {
    setLoading(true);
    setActionMsg("");
    setActionErr("");
    try {
      const [statsRes, coursesRes, usersRes] = await Promise.all([
        getAdminStats(),
        getAllCourses(),
        getUsers(),
      ]);
      setStats(statsRes.data);
      const allCourses = Array.isArray(coursesRes.data)
        ? coursesRes.data
        : coursesRes.data.results || [];
      setCourses(allCourses);
      const allUsers = Array.isArray(usersRes.data)
        ? usersRes.data
        : usersRes.data.results || [];
      setUsers(allUsers);
    } catch (e) {
      console.error("Dashboard load error:", e);
      setActionErr("Connection failure: Failed to reach the education registry.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { loadAll(); }, [loadAll]);

  const flash = (msg, isErr = false) => {
    if (isErr) setActionErr(msg);
    else setActionMsg(msg);
    setTimeout(() => { setActionMsg(""); setActionErr(""); }, 4000);
  };

  const handleApproveInstructor = async (userId, username) => {
    try {
      await approveInstructor(userId);
      flash(`✅ Faculty certification for ${username} activated.`);
      loadAll();
    } catch (e) {
      flash(e.response?.data?.detail || "Certification failure.", true);
    }
  };

  const handleCourseApprove = async (id, title) => {
    try {
      await adminApproveCourse(id);
      flash(`✅ Global signal for "${title}" verified.`);
      loadAll();
    } catch (e) {
      flash(e.response?.data?.detail || "Verification failure.", true);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center">
        <div className="w-16 h-16 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin shadow-xl shadow-indigo-600/10" />
      </div>
    );
  }

  const s = stats || {};
  const growth = s.monthly_growth || [];
  const catData = s.category_distribution || [];
  const pendingInstructors = s.pending_instructors || [];
  const recentUsers = s.recent_users || [];
  const pendingCourses = courses.filter((c) => c.is_submitted && !c.is_approved);

  const chartTheme = {
    tooltip: {
      contentStyle: {
        backgroundColor: "rgba(255, 255, 255, 0.95)",
        backdropFilter: "blur(12px)",
        border: "1px solid rgba(0, 0, 0, 0.05)",
        borderRadius: "24px",
        boxShadow: "0 25px 50px -12px rgba(0,0,0,0.1)",
        padding: "20px"
      },
      itemStyle: { color: "#0f172a", fontWeight: "900", fontSize: "14px", textTransform: "uppercase", italic: "true" },
      labelStyle: { color: "#64748b", fontWeight: "bold", fontSize: "10px", marginBottom: "8px", textTransform: "uppercase" }
    }
  };

  return (
    <DashboardLayout 
      title="Terminal Hub" 
      subtitle="Alpha Administrative Index / Level 4"
      tabs={TABS}
      activeTab={activeTab}
      onTabChange={setActiveTab}
    >
      <div className="space-y-16">
        {/* Signal Alerts */}
        <AnimatePresence>
           {(actionMsg || actionErr) && (
              <motion.div 
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className={`flex items-center gap-6 px-10 py-6 rounded-[2.5rem] border shadow-2xl relative z-50 ${
                   actionErr ? 'bg-rose-50 border-rose-200 text-rose-600' : 'bg-emerald-50 border-emerald-200 text-emerald-600'
                }`}
              >
                 <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${actionErr ? 'bg-rose-200' : 'bg-emerald-200'}`}>
                    {actionErr ? <ShieldAlert size={24} /> : <CheckCircle size={24} />}
                 </div>
                 <span className="text-sm font-black uppercase tracking-[0.2em] italic">{actionMsg || actionErr}</span>
              </motion.div>
           )}
        </AnimatePresence>

        {activeTab === "Overview" && (
          <div className="space-y-16">
            {/* Metric Matrix */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              <StatCard icon={Users} label="Total Scholars" value={fmt(s.users?.total)} trend={`+${s.users?.new_this_month || 0} New`} variant="primary" />
              <StatCard icon={Package} label="Registry Units" value={fmt(s.courses?.total)} trend={`${s.courses?.approved || 0} Verified`} variant="purple" />
              <StatCard icon={DollarSign} label="Equity Hub" value={fmtMoney(s.revenue?.total)} trend={`+${fmtMoney(s.revenue?.this_month)} Gain`} variant="success" />
              <StatCard icon={Activity} label="Signal Density" value={fmt(s.enrollments?.total)} trend={`${s.enrollments?.paid || 0} Premium`} variant="warning" />
            </div>

            {/* Matrix Charts */}
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-10">
               <GlassCard className="p-12 bg-white border-slate-100 shadow-2xl shadow-slate-200/50">
                  <div className="flex items-center justify-between mb-12">
                     <div>
                        <h4 className="text-xs font-black text-indigo-600 uppercase tracking-[0.4em] mb-1 leading-none italic">Growth Projection</h4>
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none">6-Phase Temporal Flow</p>
                     </div>
                     <div className="w-12 h-12 bg-indigo-50 rounded-2xl flex items-center justify-center text-indigo-400 border border-indigo-100"><TrendingUp size={24} /></div>
                  </div>
                  <div className="h-96">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={growth}>
                        <defs>
                          <linearGradient id="pGrad" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#4f46e5" stopOpacity={0.15} />
                            <stop offset="95%" stopColor="#4f46e5" stopOpacity={0} />
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.03)" vertical={false} />
                        <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#94a3b8', fontWeight: '900' }} />
                        <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#94a3b8', fontWeight: '900' }} />
                        <Tooltip {...chartTheme.tooltip} />
                        <Area type="monotone" dataKey="users" name="Nodes Joined" stroke="#4f46e5" fill="url(#pGrad)" strokeWidth={4} />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
               </GlassCard>

               <GlassCard className="p-12 bg-white border-slate-100 shadow-2xl shadow-slate-200/50">
                  <div className="flex items-center justify-between mb-12">
                     <div>
                        <h4 className="text-xs font-black text-indigo-600 uppercase tracking-[0.4em] mb-1 leading-none italic">Knowledge Allocation</h4>
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none">Global Artifact Distribution</p>
                     </div>
                     <div className="w-12 h-12 bg-rose-50 rounded-2xl flex items-center justify-center text-rose-400 border border-rose-100"><Layers size={24} /></div>
                  </div>
                  <div className="h-96">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={catData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.03)" vertical={false} />
                        <XAxis dataKey="category" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#94a3b8', fontWeight: '900' }} />
                        <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#94a3b8', fontWeight: '900' }} />
                        <Tooltip {...chartTheme.tooltip} />
                        <Bar dataKey="courses" name="Units" fill="#4f46e5" radius={[10, 10, 0, 0]} />
                        <Bar dataKey="students" name="Scholars" fill="#ec4899" radius={[10, 10, 0, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
               </GlassCard>
            </div>

            {/* Data Matrices */}
            <div className="grid grid-cols-1 xl:grid-cols-12 gap-12 items-start">
               {/* Left Column: Identities */}
               <div className="xl:col-span-4 space-y-8">
                  <h3 className="text-xs font-black text-indigo-600 uppercase tracking-[0.5em] italic flex items-center gap-4">
                     <Globe size={20} /> Identity Registry
                  </h3>
                  <div className="space-y-6">
                     {recentUsers.map((u, i) => (
                        <div key={u.id} className="group flex items-center justify-between p-7 bg-white border border-slate-100 rounded-[2rem] hover:shadow-2xl hover:scale-105 transition-all">
                           <div className="flex items-center gap-6">
                              <div className="w-14 h-14 bg-slate-50 border border-slate-100 rounded-2xl flex items-center justify-center font-black text-slate-300 text-lg group-hover:bg-indigo-600 group-hover:text-white group-hover:border-indigo-500 transition-all">
                                {u.username?.[0]?.toUpperCase()}
                              </div>
                              <div>
                                <p className="text-sm font-black text-slate-900 uppercase italic tracking-tighter leading-none mb-1">{u.username}</p>
                                <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest leading-none">Joined: {u.joined}</p>
                              </div>
                           </div>
                           <span className={`text-[9px] font-black px-4 py-1.5 rounded-full border italic tracking-widest ${ROLE_COLORS[u.role]}`}>
                             {u.role}
                           </span>
                        </div>
                     ))}
                  </div>
               </div>

               {/* Middle Column: Top Performing Nodes */}
               <div className="xl:col-span-8 space-y-8">
                  <h3 className="text-xs font-black text-indigo-600 uppercase tracking-[0.5em] italic flex items-center gap-4">
                     <Zap size={20} /> Top Performing Knowledge Nodes
                  </h3>
                  <div className="bg-white border border-slate-100 rounded-[3rem] overflow-hidden shadow-2xl shadow-slate-200/40">
                     <table className="w-full text-left">
                        <thead className="bg-slate-50 border-b border-slate-100">
                           <tr>
                              <th className="p-8 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] italic">Knowledge Unit</th>
                              <th className="p-8 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] italic text-center">Sync Count</th>
                              <th className="p-8 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] italic text-center">Revenue Signal</th>
                              <th className="p-8 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] italic text-right">Scholarly Rating</th>
                           </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                           {s.top_courses?.map((course) => (
                              <tr key={course.id} className="hover:bg-indigo-50/10 transition-all group">
                                 <td className="p-8">
                                    <p className="text-sm font-black text-slate-900 uppercase italic tracking-tighter leading-none mb-1">{course.title}</p>
                                    <p className="text-[9px] font-black text-indigo-400 uppercase tracking-widest">Node ID: {course.id.toString().padStart(4, '0')}</p>
                                 </td>
                                 <td className="p-8 text-center text-sm font-black text-slate-900 italic tracking-tighter">{course.enrollments} Units</td>
                                 <td className="p-8 text-center text-sm font-black text-emerald-600 italic tracking-tighter">${course.revenue} Yield</td>
                                 <td className="p-8 text-right">
                                    <div className="flex items-center justify-end gap-1">
                                       <Star size={12} fill="#eab308" stroke="none" />
                                       <span className="text-xs font-black text-slate-900 italic">{course.rating}</span>
                                    </div>
                                 </td>
                              </tr>
                           ))}
                        </tbody>
                     </table>
                  </div>

                  {/* Faculty Approvals moved here/below if space exists */}
                  <div className="space-y-8 pt-8 border-t border-slate-100">
                     <h3 className="text-xs font-black text-indigo-600 uppercase tracking-[0.5em] italic flex items-center gap-4">
                          <ShieldCheck size={20} /> Faculty Approvals
                     </h3>
                     {pendingInstructors.length > 0 ? (
                        <div className="bg-white border border-slate-100 rounded-[3rem] overflow-hidden shadow-sm">
                           <table className="w-full text-left">
                              <thead className="bg-slate-50 border-b border-slate-100">
                                 <tr>
                                    <th className="p-8 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] italic">Identity</th>
                                    <th className="p-8 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] italic">Field</th>
                                    <th className="p-8 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] italic text-right">Moderation</th>
                                 </tr>
                              </thead>
                              <tbody className="divide-y divide-slate-50">
                                 {pendingInstructors.map(inst => (
                                    <tr key={inst.id} className="hover:bg-slate-50 transition-all">
                                       <td className="p-8">
                                          <div className="flex items-center gap-4">
                                             <div className="w-10 h-10 bg-amber-50 rounded-xl flex items-center justify-center text-amber-600 font-black border border-amber-100">
                                                {inst.username?.[0]?.toUpperCase()}
                                             </div>
                                             <div>
                                                <p className="text-sm font-black text-slate-900 uppercase italic leading-none mb-1">{inst.username}</p>
                                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{inst.email}</p>
                                             </div>
                                          </div>
                                       </td>
                                       <td className="p-8 text-[10px] font-black text-slate-400 uppercase tracking-widest italic">{inst.expertise || "CORE"}</td>
                                       <td className="p-8 text-right">
                                          <div className="flex justify-end gap-3">
                                             <button onClick={() => handleApproveInstructor(inst.id, inst.username)} className="h-10 w-10 bg-emerald-50 text-emerald-600 rounded-xl border border-emerald-100 flex items-center justify-center hover:bg-emerald-600 hover:text-white transition-all"><CheckCircle size={18} /></button>
                                             <button className="h-10 w-10 bg-rose-50 text-rose-600 rounded-xl border border-rose-100 flex items-center justify-center hover:bg-rose-600 hover:text-white transition-all"><XCircle size={18} /></button>
                                          </div>
                                       </td>
                                    </tr>
                                 ))}
                              </tbody>
                           </table>
                        </div>
                     ) : (
                        <div className="p-20 bg-white border border-slate-100 rounded-[3rem] text-center italic text-slate-300 font-black text-xs uppercase tracking-[0.5em] shadow-inner">
                           No Signal Requests Detected
                        </div>
                     )}
                  </div>
               </div>
            </div>
          </div>
        )}

        {/* Courses Tab Content */}
        {activeTab === "Courses" && (
           <div className="space-y-12">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 border-b border-slate-100 pb-12">
                 <h3 className="text-xs font-black text-indigo-600 uppercase tracking-[0.5em] italic flex items-center gap-4">
                    <Package size={20} /> Curricular Inventory
                 </h3>
                 <div className="flex gap-4">
                    <span className="px-6 py-2 bg-amber-50 text-amber-600 border border-amber-100 rounded-full text-[10px] font-black uppercase tracking-widest italic">{pendingCourses.length} Review</span>
                    <span className="px-6 py-2 bg-indigo-50 text-indigo-600 border border-indigo-100 rounded-full text-[10px] font-black uppercase tracking-widest italic">{courses.length} Total</span>
                 </div>
              </div>

              <div className="bg-white border border-slate-100 rounded-[4rem] overflow-hidden shadow-2xl shadow-slate-200/50">
                 <table className="w-full text-left">
                    <thead className="bg-slate-50 border-b border-slate-100">
                       <tr>
                          <th className="p-10 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] italic">Artifact Unit</th>
                          <th className="p-10 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] italic">Faculty Source</th>
                          <th className="p-10 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] italic">Unit Price</th>
                          <th className="p-10 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] italic text-center">Protocol Status</th>
                          <th className="p-10 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] italic text-right">Moderation</th>
                       </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50">
                       {courses.map(course => (
                          <tr key={course.id} className="hover:bg-indigo-50/10 transition-all group">
                             <td className="p-10">
                                <p className="text-lg font-black text-slate-900 uppercase italic tracking-tighter leading-none mb-2">{course.title}</p>
                                <p className="text-[10px] font-black text-indigo-400 uppercase tracking-[0.4em] italic">{course.category_name || "MASTER MODULE"}</p>
                             </td>
                             <td className="p-10 text-[11px] font-black text-slate-600 uppercase italic tracking-widest">{course.instructor_name}</td>
                             <td className="p-10 text-xl font-black text-slate-900 italic tracking-tighter">${course.price}</td>
                             <td className="p-10 text-center">
                                {course.is_approved ? (
                                   <span className="px-5 py-2 bg-emerald-50 text-emerald-600 border border-emerald-100 text-[10px] font-black uppercase tracking-widest rounded-full italic">Verified Hub</span>
                                ) : (
                                   <span className="px-5 py-2 bg-amber-50 text-amber-600 border border-amber-100 text-[10px] font-black uppercase tracking-widest rounded-full italic">Initialization</span>
                                )}
                             </td>
                             <td className="p-10 text-right">
                                {!course.is_approved ? (
                                   <button onClick={() => handleCourseApprove(course.id, course.title)} className="h-12 px-8 bg-indigo-600 text-white rounded-2xl font-black uppercase text-[10px] tracking-[0.3em] shadow-xl shadow-indigo-600/20 hover:bg-indigo-500 transition-all">Authorize Node</button>
                                ) : (
                                   <button className="h-12 w-12 bg-white border border-slate-100 text-slate-200 hover:text-rose-500 hover:border-rose-100 rounded-2xl flex items-center justify-center transition-all"><XCircle size={24} /></button>
                                )}
                             </td>
                          </tr>
                       ))}
                    </tbody>
                 </table>
              </div>
           </div>
        )}

        {/* Analytics Tab (Figma Charts Expanded) */}
        {activeTab === "Analytics" && (
           <div className="space-y-16 animate-in slide-in-from-bottom-8 duration-700">
              <div className="max-w-3xl space-y-4">
                 <h3 className="text-xs font-black text-indigo-600 uppercase tracking-[0.5em] italic flex items-center gap-4">
                    <BarChart2 size={24} /> Global Distribution Logic
                 </h3>
                 <p className="text-xl font-medium text-slate-500 italic uppercase tracking-[0.1em]">Statistical analysis of the synchronized knowledge index across all faculty nodes.</p>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
                 <GlassCard className="lg:col-span-8 p-16 bg-white border-slate-100 shadow-2xl">
                    <div className="h-[500px]">
                       <ResponsiveContainer width="100%" height="100%">
                         <BarChart data={catData}>
                           <defs>
                              <linearGradient id="barGrad" x1="0" y1="0" x2="0" y2="1">
                                 <stop offset="0%" stopColor="#4f46e5" stopOpacity={1} />
                                 <stop offset="100%" stopColor="#818cf8" stopOpacity={0.8} />
                              </linearGradient>
                           </defs>
                           <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.03)" vertical={false} />
                           <XAxis dataKey="category" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#94a3b8', fontWeight: '900' }} />
                           <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#94a3b8', fontWeight: '900' }} />
                           <Tooltip {...chartTheme.tooltip} cursor={{ fill: '#f8fafc' }} />
                           <Bar dataKey="students" name="Nodes Density" fill="url(#barGrad)" radius={[16, 16, 0, 0]} barSize={60} />
                         </BarChart>
                       </ResponsiveContainer>
                    </div>
                 </GlassCard>

                 <div className="lg:col-span-4 flex flex-col gap-8">
                    {catData.map((cat, i) => (
                       <GlassCard key={i} className="p-8 bg-white border-slate-100 group hover:border-indigo-600/30 transition-all">
                          <div className="flex items-center justify-between mb-4">
                             <h4 className="text-sm font-black text-slate-900 uppercase italic tracking-tighter leading-none">{cat.category}</h4>
                             <div className="w-8 h-8 rounded-lg bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600 group-hover:scale-110 transition-transform"><Info size={16} /></div>
                          </div>
                          <div className="flex justify-between items-baseline">
                             <span className="text-xs font-black text-slate-400 uppercase tracking-widest italic">{cat.students} Scholars Synced</span>
                             <span className="text-2xl font-black text-slate-900 italic tracking-tighter leading-none">{Math.round((cat.students / (s.users?.total || 1)) * 100)}%</span>
                          </div>
                          <div className="mt-6 h-1 bg-slate-100 rounded-full overflow-hidden">
                             <motion.div initial={{ width: 0 }} animate={{ width: `${(cat.students / (s.users?.total || 1)) * 100}%` }} className="h-full bg-indigo-600" />
                          </div>
                       </GlassCard>
                    ))}
                 </div>
              </div>
           </div>
        )}
      </div>
    </DashboardLayout>
  );
}
