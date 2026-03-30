import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { getUsers, updateUser, deleteUser, createUser } from '../services/api';
import DashboardLayout from '../components/DashboardLayout';
import StatCard from '../components/StatCard';
import { GlassCard } from '../components/glass-card';
import { 
  Users, UserPlus, ShieldAlert, Trash2, Edit3, 
  Key, Save, X, CheckCircle, ShieldCheck, Mail, Hash
} from 'lucide-react';

export default function AdminUsersPage() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState(null);
  const [editRole, setEditRole] = useState('');
  const [editPassword, setEditPassword] = useState('');
  const [isUpdatingPassword, setIsUpdatingPassword] = useState(false);
  const [showAddForm, setShowAddForm] = useState(false);
  const [formData, setFormData] = useState({ username: '', email: '', password: '', role: 'STUDENT' });
  const [formError, setFormError] = useState('');

  useEffect(() => { loadUsers(); }, []);

  const loadUsers = async () => {
    try {
      const { data } = await getUsers();
      setUsers(Array.isArray(data) ? data : data.results || []);
    } catch {}
    setLoading(false);
  };

  const handleCreateUser = async (e) => {
    e.preventDefault();
    setFormError('');
    try {
      await createUser(formData);
      setFormData({ username: '', email: '', password: '', role: 'STUDENT' });
      setShowAddForm(false);
      loadUsers();
    } catch (err) {
      setFormError(err.response?.data?.detail || 'Node collision: User identifier exists.');
    }
  };

  const handleRoleUpdate = async (id) => {
    try {
      await updateUser(id, { role: editRole });
      setEditingId(null);
      loadUsers();
    } catch { alert('Protocol failure: Role synchronization failed.'); }
  };

  const handlePasswordUpdate = async (id) => {
    if (!editPassword || editPassword.length < 6) {
      alert('Security violation: Insufficient entropy.');
      return;
    }
    try {
      await updateUser(id, { password: editPassword });
      setEditPassword('');
      setIsUpdatingPassword(false);
      setEditingId(null);
      alert('Security protocol updated.');
    } catch { alert('Security failure: Password hash rejected.'); }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Terminate this user node permanently?')) {
      await deleteUser(id);
      loadUsers();
    }
  };

  if (loading) {
    return (
      <DashboardLayout title="Identity Hub" subtitle="Synchronizing User Nodes">
        <div className="flex items-center justify-center min-h-[400px]">
           <div className="w-10 h-10 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" />
        </div>
      </DashboardLayout>
    );
  }

  const ROLE_COLORS = {
    STUDENT: "bg-blue-500/10 text-blue-400 border-blue-500/20",
    INSTRUCTOR: "bg-purple-500/10 text-purple-400 border-purple-500/20",
    ADMIN: "bg-rose-500/10 text-rose-400 border-rose-500/20",
  };

  return (
    <DashboardLayout 
      title="Identity Hub" 
      subtitle="Administrative Management of Global Identity Nodes"
    >
      <div className="space-y-12">
        
        {/* Identity Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
           <StatCard icon={Users} label="Total Identities" value={users.length} variant="primary" />
           <StatCard icon={ShieldCheck} label="Secured Students" value={users.filter(u => u.role === 'STUDENT').length} variant="cyan" />
           <StatCard icon={Edit3} label="Faculty Nodes" value={users.filter(u => u.role === 'INSTRUCTOR').length} variant="purple" />
           <StatCard icon={ShieldAlert} label="Root Admins" value={users.filter(u => u.role === 'ADMIN').length} variant="error" />
        </div>

        {/* Identity Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 border-b border-white/5 pb-10">
           <div>
              <h3 className="text-xs font-black text-white uppercase tracking-[0.3em] flex items-center gap-3 italic">
                 <ShieldCheck size={16} className="text-indigo-400" /> Registry Moderation
              </h3>
           </div>
           <button 
             onClick={() => setShowAddForm(!showAddForm)}
             className="px-8 py-3 bg-white text-indigo-950 font-black text-[10px] font-black uppercase tracking-[0.2em] rounded-2xl hover:scale-105 transition-all shadow-xl shadow-white/5 flex items-center gap-2"
           >
              {showAddForm ? <X size={16} /> : <UserPlus size={16} />} 
              {showAddForm ? 'Abort Protocol' : 'Initialize Identity'}
           </button>
        </div>

        {/* User Creation Portal Overlay */}
        <AnimatePresence>
           {showAddForm && (
              <motion.div 
                 initial={{ opacity: 0, scale: 0.95 }}
                 animate={{ opacity: 1, scale: 1 }}
                 exit={{ opacity: 0, scale: 0.95 }}
                 className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-slate-950/80 backdrop-blur-3xl"
              >
                  <GlassCard className="w-full max-w-xl p-12 bg-[#020617] relative">
                    <button onClick={() => setShowAddForm(false)} className="absolute top-8 right-8 p-3 text-slate-500 hover:text-white transition-colors">
                       <X size={24} />
                    </button>
                    
                    <div className="mb-10 text-center">
                       <h2 className="text-4xl font-black text-white italic tracking-tighter mb-2">Identity Genesis</h2>
                       <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest italic leading-loose">Registering a New Hub Participant</p>
                    </div>

                    <form onSubmit={handleCreateUser} className="space-y-6">
                       <div className="grid grid-cols-2 gap-6">
                          <div className="space-y-2">
                             <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-4">Identifier (Username)</label>
                             <input 
                               className="w-full bg-white/5 border border-white/5 rounded-3xl p-5 text-sm font-bold text-white" 
                               required 
                               value={formData.username}
                               onChange={(e) => setFormData({...formData, username: e.target.value})}
                             />
                          </div>
                          <div className="space-y-2">
                             <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-4">Credential Level (Role)</label>
                             <select 
                                className="w-full bg-white/5 border border-white/5 rounded-3xl p-5 text-sm font-bold text-white appearance-none" 
                                value={formData.role}
                                onChange={(e) => setFormData({...formData, role: e.target.value})}
                             >
                                <option value="STUDENT" className="bg-slate-950">STUDENT</option>
                                <option value="INSTRUCTOR" className="bg-slate-950">INSTRUCTOR</option>
                                <option value="ADMIN" className="bg-slate-950">ADMIN</option>
                             </select>
                          </div>
                       </div>

                       <div className="space-y-2">
                          <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-4">Signal Destination (Email)</label>
                          <input 
                            className="w-full bg-white/5 border border-white/5 rounded-3xl p-5 text-sm font-bold text-white" 
                            type="email" required 
                            value={formData.email}
                            onChange={(e) => setFormData({...formData, email: e.target.value})}
                          />
                       </div>

                       <div className="space-y-2">
                          <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-4">Security Key (Password)</label>
                          <input 
                            className="w-full bg-white/5 border border-white/5 rounded-3xl p-5 text-sm font-bold text-white" 
                            type="password" required 
                            value={formData.password}
                            onChange={(e) => setFormData({...formData, password: e.target.value})}
                          />
                       </div>

                       {formError && <p className="text- rose-400 text-[10px] font-black uppercase tracking-widest text-center">{formError}</p>}
                       
                       <div className="pt-6">
                          <button 
                            className="w-full py-5 bg-indigo-600 text-white rounded-[2rem] font-black text-[10px] font-black uppercase tracking-[0.3em] shadow-xl shadow-indigo-600/20 hover:scale-[1.02] active:scale-[0.98] transition-all" 
                            type="submit"
                          >
                             Commit Identity Cluster
                          </button>
                       </div>
                    </form>
                  </GlassCard>
              </motion.div>
           )}
        </AnimatePresence>

        {/* Identity Registry Table */}
        <div className="overflow-hidden rounded-[2.5rem] border border-white/5 bg-white/5 relative">
           <table className="w-full text-left">
              <thead className="bg-[#020617] border-b border-white/10 text-[10px] font-black text-slate-500 uppercase tracking-widest italic">
                 <tr>
                    <th className="p-8">Node Identifier</th>
                    <th className="p-8">Communication Path</th>
                    <th className="p-8 text-center">Protocol Level</th>
                    <th className="p-8 text-right">Moderation Console</th>
                 </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                 {users.map((u) => (
                    <tr key={u.id} className="hover:bg-white/5 transition-colors group">
                       <td className="p-8">
                          <div className="flex items-center gap-4">
                             <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center font-black text-white shadow-lg border border-white/10">
                                {u.username?.[0]?.toUpperCase()}
                             </div>
                             <div>
                                <p className="text-sm font-black text-white uppercase tracking-wider leading-none mb-1">{u.username}</p>
                                <p className="text-[9px] font-black text-slate-600 uppercase tracking-widest">Node ID: {u.id.toString().padStart(4, '0')}</p>
                             </div>
                          </div>
                       </td>
                       <td className="p-8 text-xs font-black text-slate-400 uppercase tracking-widest">
                          <div className="flex items-center gap-2"><Mail size={12} className="text-slate-600" /> {u.email}</div>
                       </td>
                       <td className="p-8 text-center">
                          <span className={`px-3 py-1 rounded-full text-[9px] font-black border ${ROLE_COLORS[u.role] || "bg-gray-100 text-gray-600"}`}>
                             {u.role}
                          </span>
                       </td>
                       <td className="p-8 text-right">
                          <div className="flex justify-end gap-3">
                             {editingId === u.id ? (
                                <div className="flex gap-2 animate-in zoom-in-95 duration-200">
                                   {isUpdatingPassword ? (
                                      <div className="flex gap-2">
                                         <input 
                                           type="password" 
                                           className="bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-[10px] font-bold text-white w-40" 
                                           placeholder="New Key..." 
                                           value={editPassword}
                                           onChange={(e) => setEditPassword(e.target.value)}
                                         />
                                         <button className="p-2 bg-emerald-500/20 text-emerald-400 rounded-xl" onClick={() => handlePasswordUpdate(u.id)}><Save size={16} /></button>
                                      </div>
                                   ) : (
                                      <div className="flex gap-2">
                                         <select className="bg-slate-900 border border-white/10 rounded-xl px-4 py-2 text-[10px] font-bold text-white" value={editRole} onChange={(e) => setEditRole(e.target.value)}>
                                            <option value="STUDENT">STUDENT</option>
                                            <option value="INSTRUCTOR">INSTRUCTOR</option>
                                            <option value="ADMIN">ADMIN</option>
                                         </select>
                                         <button className="p-2 bg-indigo-500/20 text-indigo-400 rounded-xl" onClick={() => handleRoleUpdate(u.id)}><Save size={16} /></button>
                                      </div>
                                   )}
                                   <button className="p-2 bg-white/5 text-slate-500 rounded-xl" onClick={() => { setEditingId(null); setIsUpdatingPassword(false); }}><X size={16} /></button>
                                </div>
                             ) : (
                                <div className="flex gap-2">
                                   <button className="p-3 bg-white/5 hover:bg-white/10 text-slate-500 hover:text-indigo-400 rounded-2xl transition-all border border-white/5" onClick={() => { setEditingId(u.id); setEditRole(u.role); setIsUpdatingPassword(false); }}><Edit3 size={16} /></button>
                                   <button className="p-3 bg-white/5 hover:bg-white/10 text-slate-500 hover:text-amber-400 rounded-2xl transition-all border border-white/5" onClick={() => { setEditingId(u.id); setIsUpdatingPassword(true); setEditPassword(''); }}><Key size={16} /></button>
                                   <button className="p-3 bg-white/5 hover:bg-rose-500/10 text-slate-500 hover:text-rose-500 rounded-2xl transition-all border border-white/5" onClick={() => handleDelete(u.id)}><Trash2 size={16} /></button>
                                </div>
                             )}
                          </div>
                       </td>
                    </tr>
                 ))}
              </tbody>
           </table>
        </div>

      </div>
    </DashboardLayout>
  );
}
