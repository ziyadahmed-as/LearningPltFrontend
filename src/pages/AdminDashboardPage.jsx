import { useEffect, useState, useCallback } from "react";
import { DashboardNavbar } from "../components/dashboard-navbar";
import { DashboardSidebar } from "../components/dashboard-sidebar";
import { GlassCard } from "../components/glass-card";
import {
  Home, Users, BookOpen, DollarSign, TrendingUp,
  CheckCircle, XCircle, Activity, RefreshCw, AlertCircle,
  BarChart2, Settings, ShieldCheck,
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
  STUDENT: "bg-blue-100 text-blue-700",
  INSTRUCTOR: "bg-purple-100 text-purple-700",
  ADMIN: "bg-red-100 text-red-700",
};

const TABS = ["Overview", "Courses", "Users", "Categories"];

// ─── Stat card sub-component ──────────────────────────────────────────────────
function StatTile({ icon: Icon, label, value, sub, gradient }) {
  return (
    <GlassCard className="p-6">
      <div className="flex items-center gap-3 mb-2">
        <div
          className={`w-12 h-12 rounded-xl flex items-center justify-center bg-gradient-to-r ${gradient}`}
        >
          <Icon className="w-6 h-6 text-white" />
        </div>
        <div>
          <p className="text-sm text-gray-500">{label}</p>
          <p className="text-2xl font-bold text-gray-900">{value}</p>
        </div>
      </div>
      {sub && <p className="text-xs text-green-600 font-medium mt-1">{sub}</p>}
    </GlassCard>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────
export default function AdminDashboardPage() {
  const [activeTab, setActiveTab] = useState("Overview");
  const [stats, setStats] = useState(null);
  const [courses, setCourses] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionMsg, setActionMsg] = useState("");
  const [actionErr, setActionErr] = useState("");

  const sidebarItems = [
    { icon: Home, label: "Overview", path: "#" },
    { icon: Users, label: "Users", path: "#" },
    { icon: BookOpen, label: "Courses", path: "#" },
    { icon: BarChart2, label: "Categories", path: "#" },
  ];

  // ── Data loading ─────────────────────────────────────────────────────────
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
      setActionErr("Failed to load dashboard data. Is the API running?");
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

  // ── Instructor approval ──────────────────────────────────────────────────
  const handleApproveInstructor = async (userId, username) => {
    try {
      await approveInstructor(userId);
      flash(`✅ ${username} approved as instructor`);
      loadAll();
    } catch (e) {
      flash(e.response?.data?.detail || "Failed to approve instructor", true);
    }
  };

  const handleRejectInstructor = async (userId, username) => {
    if (!window.confirm(`Reject ${username}'s instructor application?`)) return;
    try {
      await rejectInstructor(userId);
      flash(`❌ ${username}'s application rejected`);
      loadAll();
    } catch (e) {
      flash(e.response?.data?.detail || "Failed to reject instructor", true);
    }
  };

  // ── Course moderation ────────────────────────────────────────────────────
  const handleCourseApprove = async (id, title) => {
    try {
      await adminApproveCourse(id);
      flash(`✅ "${title}" approved`);
      loadAll();
    } catch (e) {
      flash(e.response?.data?.detail || "Failed to approve course", true);
    }
  };

  const handleCourseUnapprove = async (id, title) => {
    try {
      await adminUnapproveCourse(id);
      flash(`↩️ "${title}" approval revoked`);
      loadAll();
    } catch (e) {
      flash(e.response?.data?.detail || "Failed to unapprove course", true);
    }
  };

  // ── Render ───────────────────────────────────────────────────────────────
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Loading dashboard…</p>
        </div>
      </div>
    );
  }

  const s = stats || {};
  const growth = s.monthly_growth || [];
  const catData = s.category_distribution || [];
  const pendingInstructors = s.pending_instructors || [];
  const recentUsers = s.recent_users || [];

  const pendingCourses = courses.filter(
    (c) => c.is_submitted && !c.is_approved
  );

  const tooltipStyle = {
    backgroundColor: "rgba(255,255,255,0.95)",
    backdropFilter: "blur(8px)",
    border: "1px solid rgba(139,92,246,0.2)",
    borderRadius: "12px",
    boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
  };

  return (
    <div className="min-h-screen p-4 md:p-6">
      <div className="max-w-7xl mx-auto">
        <DashboardNavbar />

        <div className="flex gap-6 mt-4">
          {/* ── Sidebar ──────────────────────────────────────── */}
          <div className="hidden lg:flex flex-col w-64 flex-shrink-0">
            <DashboardSidebar items={sidebarItems} />
          </div>

          {/* ── Main Content ─────────────────────────────────── */}
          <div className="flex-1 space-y-6 min-w-0">
            {/* Header */}
            <GlassCard className="p-6 bg-gradient-to-r from-purple-600/20 to-blue-600/20">
              <div className="flex items-center justify-between flex-wrap gap-3">
                <div>
                  <h1 className="text-3xl font-bold text-gray-900">
                    Admin Dashboard 🛠️
                  </h1>
                  <p className="text-gray-600 mt-1">
                    Platform overview & management
                  </p>
                </div>
                <button
                  onClick={loadAll}
                  className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-xl hover:bg-purple-700 transition-all"
                >
                  <RefreshCw className="w-4 h-4" />
                  Refresh
                </button>
              </div>
            </GlassCard>

            {/* Flash messages */}
            {actionMsg && (
              <div className="flex items-center gap-2 px-4 py-3 bg-green-50 border border-green-200 rounded-xl text-green-700">
                <CheckCircle className="w-5 h-5" />
                {actionMsg}
              </div>
            )}
            {actionErr && (
              <div className="flex items-center gap-2 px-4 py-3 bg-red-50 border border-red-200 rounded-xl text-red-700">
                <AlertCircle className="w-5 h-5" />
                {actionErr}
              </div>
            )}

            {/* Tab Nav */}
            <div className="flex gap-2 flex-wrap">
              {TABS.map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-4 py-2 rounded-xl font-medium transition-all text-sm ${
                    activeTab === tab
                      ? "bg-purple-600 text-white shadow-lg shadow-purple-200"
                      : "bg-white/60 text-gray-600 border border-white/60 hover:bg-white hover:text-gray-900"
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>

            {/* ══════════════════ OVERVIEW TAB ══════════════════ */}
            {activeTab === "Overview" && (
              <>
                {/* Stat Cards */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                  <StatTile
                    icon={Users}
                    label="Total Users"
                    value={fmt(s.users?.total)}
                    sub={`+${s.users?.new_this_month || 0} this month`}
                    gradient="from-purple-500 to-pink-500"
                  />
                  <StatTile
                    icon={BookOpen}
                    label="Total Courses"
                    value={fmt(s.courses?.total)}
                    sub={`${s.courses?.approved || 0} approved`}
                    gradient="from-blue-500 to-cyan-500"
                  />
                  <StatTile
                    icon={DollarSign}
                    label="Total Revenue"
                    value={fmtMoney(s.revenue?.total)}
                    sub={`${fmtMoney(s.revenue?.this_month)} this month`}
                    gradient="from-violet-500 to-purple-500"
                  />
                  <StatTile
                    icon={TrendingUp}
                    label="Enrollments"
                    value={fmt(s.enrollments?.total)}
                    sub={`${s.enrollments?.paid || 0} paid`}
                    gradient="from-emerald-500 to-teal-500"
                  />
                </div>

                {/* Charts */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <GlassCard className="p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">
                      Platform Growth (6 months)
                    </h3>
                    <div className="h-64">
                      <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={growth}>
                          <defs>
                            <linearGradient id="uGrad" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="5%" stopColor="#9333ea" stopOpacity={0.3} />
                              <stop offset="95%" stopColor="#9333ea" stopOpacity={0} />
                            </linearGradient>
                          </defs>
                          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" vertical={false} />
                          <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 12 }} />
                          <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12 }} />
                          <Tooltip contentStyle={tooltipStyle} />
                          <Area type="monotone" dataKey="users" name="New Users" stroke="#9333ea" fill="url(#uGrad)" strokeWidth={2} />
                        </AreaChart>
                      </ResponsiveContainer>
                    </div>
                  </GlassCard>

                  <GlassCard className="p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">
                      Category Distribution
                    </h3>
                    <div className="h-64">
                      {catData.length === 0 ? (
                        <div className="h-full flex items-center justify-center text-gray-400 text-sm">
                          No categories yet. Create categories in the backend admin.
                        </div>
                      ) : (
                        <ResponsiveContainer width="100%" height="100%">
                          <BarChart data={catData}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" vertical={false} />
                            <XAxis dataKey="category" axisLine={false} tickLine={false} tick={{ fontSize: 11 }} />
                            <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12 }} />
                            <Tooltip contentStyle={tooltipStyle} />
                            <Legend />
                            <Bar dataKey="courses" name="Courses" fill="#9333ea" radius={[6, 6, 0, 0]} />
                            <Bar dataKey="students" name="Students" fill="#2563eb" radius={[6, 6, 0, 0]} />
                          </BarChart>
                        </ResponsiveContainer>
                      )}
                    </div>
                  </GlassCard>
                </div>

                {/* Recent Users + System Status */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <GlassCard className="p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">
                      Recent Registrations
                    </h3>
                    <div className="space-y-3">
                      {recentUsers.length === 0 ? (
                        <p className="text-gray-400 text-sm">No users yet.</p>
                      ) : (
                        recentUsers.map((u) => (
                          <div
                            key={u.id}
                            className="flex items-center justify-between p-3 bg-white/60 rounded-xl border border-white/60"
                          >
                            <div className="flex items-center gap-3">
                              <div className="w-9 h-9 bg-gradient-to-br from-purple-500 to-blue-500 rounded-full flex items-center justify-center text-white font-bold text-sm">
                                {u.username?.[0]?.toUpperCase()}
                              </div>
                              <div>
                                <p className="font-semibold text-gray-900 text-sm">{u.username}</p>
                                <p className="text-xs text-gray-500">{u.email}</p>
                              </div>
                            </div>
                            <div className="text-right">
                              <span className={`text-xs font-medium px-2 py-1 rounded-full ${ROLE_COLORS[u.role] || "bg-gray-100 text-gray-600"}`}>
                                {u.role}
                              </span>
                              <p className="text-xs text-gray-400 mt-1">{u.joined}</p>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  </GlassCard>

                  <GlassCard className="p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">
                      System Status
                    </h3>
                    <div className="space-y-3">
                      {[
                        { name: "API Server", uptime: "99.99%" },
                        { name: "Database", uptime: "99.98%" },
                        { name: "Media Storage", uptime: "99.95%" },
                        { name: "Auth Service", uptime: "100%" },
                      ].map((sys) => (
                        <div
                          key={sys.name}
                          className="flex items-center justify-between p-3 bg-green-50 border border-green-200 rounded-xl"
                        >
                          <div className="flex items-center gap-3">
                            <div className="w-2.5 h-2.5 bg-green-500 rounded-full animate-pulse" />
                            <div className="flex items-center gap-2">
                              <Activity className="w-4 h-4 text-green-600" />
                              <span className="font-medium text-gray-800 text-sm">{sys.name}</span>
                            </div>
                          </div>
                          <div className="text-right">
                            <span className="text-xs text-green-600 font-medium">Operational</span>
                            <p className="text-xs text-gray-500">{sys.uptime} uptime</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </GlassCard>
                </div>

                {/* Pending Instructor Applications */}
                {pendingInstructors.length > 0 && (
                  <GlassCard className="p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">
                      Pending Instructor Applications ({pendingInstructors.length})
                    </h3>
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead>
                          <tr className="text-left text-sm text-gray-500 border-b border-gray-200">
                            <th className="pb-3 pr-4">Applicant</th>
                            <th className="pb-3 pr-4">Expertise</th>
                            <th className="pb-3 pr-4">Experience</th>
                            <th className="pb-3 pr-4">Applied</th>
                            <th className="pb-3">Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {pendingInstructors.map((inst) => (
                            <tr key={inst.id} className="border-b border-gray-100 hover:bg-purple-50/30 transition-colors">
                              <td className="py-3 pr-4">
                                <div className="flex items-center gap-2">
                                  <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white text-xs font-bold">
                                    {inst.username?.[0]?.toUpperCase()}
                                  </div>
                                  <div>
                                    <p className="font-semibold text-gray-900 text-sm">{inst.username}</p>
                                    <p className="text-xs text-gray-500">{inst.email}</p>
                                  </div>
                                </div>
                              </td>
                              <td className="py-3 pr-4 text-sm text-gray-700">{inst.expertise || "—"}</td>
                              <td className="py-3 pr-4 text-sm text-gray-700">{inst.years_of_experience ? `${inst.years_of_experience} yrs` : "—"}</td>
                              <td className="py-3 pr-4 text-sm text-gray-500">{inst.date_joined}</td>
                              <td className="py-3">
                                <div className="flex gap-2">
                                  <button
                                    onClick={() => handleApproveInstructor(inst.id, inst.username)}
                                    className="flex items-center gap-1 px-3 py-1.5 bg-green-100 text-green-700 rounded-lg hover:bg-green-200 transition-colors text-sm font-medium"
                                  >
                                    <CheckCircle className="w-3.5 h-3.5" />
                                    Approve
                                  </button>
                                  <button
                                    onClick={() => handleRejectInstructor(inst.id, inst.username)}
                                    className="flex items-center gap-1 px-3 py-1.5 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors text-sm font-medium"
                                  >
                                    <XCircle className="w-3.5 h-3.5" />
                                    Reject
                                  </button>
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </GlassCard>
                )}
              </>
            )}

            {/* ══════════════════ COURSES TAB ══════════════════ */}
            {activeTab === "Courses" && (
              <GlassCard className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-semibold text-gray-900">
                    Course Management
                  </h3>
                  <div className="flex gap-2 text-sm">
                    <span className="px-3 py-1 bg-yellow-100 text-yellow-700 rounded-full font-medium">
                      {pendingCourses.length} pending
                    </span>
                    <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full font-medium">
                      {courses.filter((c) => c.is_approved).length} approved
                    </span>
                  </div>
                </div>

                {courses.length === 0 ? (
                  <div className="text-center py-12 text-gray-400">
                    <BookOpen className="w-12 h-12 mx-auto mb-3 opacity-40" />
                    <p>No courses found</p>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="text-left text-sm text-gray-500 border-b border-gray-200">
                          <th className="pb-3 pr-4">Course</th>
                          <th className="pb-3 pr-4">Instructor</th>
                          <th className="pb-3 pr-4">Price</th>
                          <th className="pb-3 pr-4">Enrollments</th>
                          <th className="pb-3 pr-4">Status</th>
                          <th className="pb-3">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {courses.map((course) => (
                          <tr key={course.id} className="border-b border-gray-100 hover:bg-purple-50/30 transition-colors">
                            <td className="py-3 pr-4">
                              <p className="font-semibold text-gray-900 text-sm max-w-[200px] truncate">{course.title}</p>
                              <p className="text-xs text-gray-400">{course.category_name || "No category"}</p>
                            </td>
                            <td className="py-3 pr-4 text-sm text-gray-700">{course.instructor_name}</td>
                            <td className="py-3 pr-4 text-sm text-gray-700">
                              {parseFloat(course.price) === 0 ? (
                                <span className="text-green-600 font-medium">Free</span>
                              ) : (
                                `$${course.price}`
                              )}
                            </td>
                            <td className="py-3 pr-4 text-sm text-gray-700">{course.enrollment_count || 0}</td>
                            <td className="py-3 pr-4">
                              <div className="flex flex-col gap-1">
                                {course.is_approved ? (
                                  <span className="text-xs px-2 py-0.5 bg-green-100 text-green-700 rounded-full w-fit">✅ Approved</span>
                                ) : course.is_submitted ? (
                                  <span className="text-xs px-2 py-0.5 bg-yellow-100 text-yellow-700 rounded-full w-fit">⏳ Pending</span>
                                ) : (
                                  <span className="text-xs px-2 py-0.5 bg-gray-100 text-gray-600 rounded-full w-fit">📝 Draft</span>
                                )}
                                {course.is_published && (
                                  <span className="text-xs px-2 py-0.5 bg-blue-100 text-blue-700 rounded-full w-fit">🌐 Published</span>
                                )}
                              </div>
                            </td>
                            <td className="py-3">
                              <div className="flex gap-2">
                                {!course.is_approved ? (
                                  <button
                                    onClick={() => handleCourseApprove(course.id, course.title)}
                                    className="flex items-center gap-1 px-3 py-1.5 bg-green-100 text-green-700 rounded-lg hover:bg-green-200 transition-colors text-xs font-medium"
                                  >
                                    <ShieldCheck className="w-3.5 h-3.5" />
                                    Approve
                                  </button>
                                ) : (
                                  <button
                                    onClick={() => handleCourseUnapprove(course.id, course.title)}
                                    className="flex items-center gap-1 px-3 py-1.5 bg-orange-100 text-orange-700 rounded-lg hover:bg-orange-200 transition-colors text-xs font-medium"
                                  >
                                    <XCircle className="w-3.5 h-3.5" />
                                    Revoke
                                  </button>
                                )}
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </GlassCard>
            )}

            {/* ══════════════════ USERS TAB ══════════════════ */}
            {activeTab === "Users" && (
              <GlassCard className="p-6">
                <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
                  <h3 className="text-lg font-semibold text-gray-900">
                    All Users ({users.length})
                  </h3>
                  <div className="flex gap-2 text-sm">
                    <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full font-medium">
                      {users.filter((u) => u.role === "STUDENT").length} Students
                    </span>
                    <span className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full font-medium">
                      {users.filter((u) => u.role === "INSTRUCTOR").length} Instructors
                    </span>
                  </div>
                </div>

                {users.length === 0 ? (
                  <div className="text-center py-12 text-gray-400">
                    <Users className="w-12 h-12 mx-auto mb-3 opacity-40" />
                    <p>No users found</p>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="text-left text-sm text-gray-500 border-b border-gray-200">
                          <th className="pb-3 pr-4">User</th>
                          <th className="pb-3 pr-4">Email</th>
                          <th className="pb-3 pr-4">Role</th>
                          <th className="pb-3 pr-4">Joined</th>
                          <th className="pb-3">Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        {users.map((u) => (
                          <tr key={u.id} className="border-b border-gray-100 hover:bg-purple-50/30 transition-colors">
                            <td className="py-3 pr-4">
                              <div className="flex items-center gap-2">
                                <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-blue-500 rounded-full flex items-center justify-center text-white text-xs font-bold">
                                  {u.username?.[0]?.toUpperCase()}
                                </div>
                                <span className="font-medium text-gray-900 text-sm">{u.username}</span>
                              </div>
                            </td>
                            <td className="py-3 pr-4 text-sm text-gray-600">{u.email}</td>
                            <td className="py-3 pr-4">
                              <span className={`text-xs font-medium px-2 py-1 rounded-full ${ROLE_COLORS[u.role] || "bg-gray-100 text-gray-600"}`}>
                                {u.role}
                              </span>
                            </td>
                            <td className="py-3 pr-4 text-xs text-gray-500">
                              {u.date_joined ? new Date(u.date_joined).toLocaleDateString() : "—"}
                            </td>
                            <td className="py-3">
                              {u.role === "STUDENT" && u.expertise && (
                                <div className="flex gap-2">
                                  <button
                                    onClick={() => handleApproveInstructor(u.id, u.username)}
                                    className="flex items-center gap-1 px-2 py-1 bg-green-100 text-green-700 rounded-lg hover:bg-green-200 transition-colors text-xs font-medium"
                                  >
                                    <CheckCircle className="w-3 h-3" />
                                    Promote
                                  </button>
                                </div>
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </GlassCard>
            )}

            {/* ══════════════════ CATEGORIES TAB ══════════════════ */}
            {activeTab === "Categories" && (
              <GlassCard className="p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-6">
                  Category Analytics
                </h3>
                {catData.length === 0 ? (
                  <div className="text-center py-12 text-gray-400">
                    <BarChart2 className="w-12 h-12 mx-auto mb-3 opacity-40" />
                    <p>No categories found. Create them in the Django admin panel.</p>
                  </div>
                ) : (
                  <>
                    <div className="h-80 mb-8">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={catData} margin={{ top: 10, right: 30, left: 0, bottom: 5 }}>
                          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" vertical={false} />
                          <XAxis dataKey="category" tick={{ fontSize: 12 }} axisLine={false} tickLine={false} />
                          <YAxis tick={{ fontSize: 12 }} axisLine={false} tickLine={false} />
                          <Tooltip contentStyle={tooltipStyle} />
                          <Legend />
                          <Bar dataKey="courses" name="Courses" fill="#9333ea" radius={[8, 8, 0, 0]} />
                          <Bar dataKey="students" name="Students" fill="#2563eb" radius={[8, 8, 0, 0]} />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {catData.map((cat) => (
                        <div
                          key={cat.category}
                          className="p-4 bg-white/70 border border-white/60 rounded-xl"
                        >
                          <h4 className="font-semibold text-gray-900 mb-2">{cat.category}</h4>
                          <div className="flex justify-between text-sm">
                            <span className="text-purple-600 font-medium">{cat.courses} courses</span>
                            <span className="text-blue-600 font-medium">{cat.students} students</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </>
                )}
              </GlassCard>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
