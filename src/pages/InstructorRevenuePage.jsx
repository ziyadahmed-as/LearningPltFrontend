import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { getWallet, getWithdrawalRequests, createWithdrawalRequest } from '../services/api';
import DashboardLayout from '../components/DashboardLayout';
import StatCard from '../components/StatCard';
import { GlassCard } from '../components/glass-card';
import { 
  DollarSign, TrendingUp, Layers, ArrowUpRight, 
  ArrowDownRight, CreditCard, Landmark, Clock, CheckCircle,
  AlertCircle, Download, FileText, Filter, MoreVertical, X
} from 'lucide-react';

export default function InstructorRevenuePage() {
  const [wallet, setWallet] = useState(null);
  const [withdrawals, setWithdrawals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [amount, setAmount] = useState('');
  const [accountDetails, setAccountDetails] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [showWithdrawalModal, setShowWithdrawalModal] = useState(false);

  useEffect(() => { loadData(); }, []);

  const loadData = async () => {
    try {
      const [walletRes, withdrawalsRes] = await Promise.all([
        getWallet(),
        getWithdrawalRequests()
      ]);
      const walletData = Array.isArray(walletRes.data)
        ? walletRes.data[0]
        : walletRes.data.results?.[0];
      setWallet(walletData || { balance: '0.00', total_earned: '0.00', transactions: [] });
      const wdData = Array.isArray(withdrawalsRes.data)
        ? withdrawalsRes.data
        : withdrawalsRes.data.results || [];
      setWithdrawals(wdData);
    } catch (err) {
      console.error('Failed to load revenue data:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleWithdraw = async (e) => {
    e.preventDefault();
    if (parseFloat(amount) > parseFloat(wallet.balance)) {
      alert('Equity Deficit: Insufficient liquidity for transaction.');
      return;
    }
    setSubmitting(true);
    try {
      await createWithdrawalRequest({ amount: parseFloat(amount), account_details: accountDetails });
      setShowWithdrawalModal(false);
      setAmount('');
      setAccountDetails('');
      loadData();
    } catch {
      alert('Transaction failure: Terminal synchronization error.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading || !wallet) {
    return (
      <DashboardLayout title="Financial Hub" subtitle="Initializing Liquidity Matrix">
        <div className="flex items-center justify-center min-h-[400px]">
           <div className="w-12 h-12 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin shadow-2xl shadow-emerald-500/10" />
        </div>
      </DashboardLayout>
    );
  }

  const transactions = wallet.transactions || [];

  return (
    <DashboardLayout 
      title="Financial Node" 
      subtitle="Comprehensive Analytics of Curricular Equity"
    >
      <div className="space-y-12">
        
        {/* Equity Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
           <StatCard 
             icon={Landmark} 
             label="Available Liquidity" 
             value={`$${wallet.balance}`} 
             trend={`+${transactions.filter(t => t.transaction_type === 'SALE').length} Sales`}
             variant="success" 
           />
           <StatCard 
             icon={TrendingUp} 
             label="Cumulative Yield" 
             value={`$${wallet.total_earned}`} 
             trend="Lifetime"
             variant="primary" 
           />
           <StatCard 
             icon={Layers} 
             label="Transaction Units" 
             value={transactions.length} 
             trend="Success"
             variant="purple" 
           />
        </div>

        {/* Action Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 border-b border-white/5 pb-10">
           <div>
              <h3 className="text-xs font-black text-white uppercase tracking-[0.3em] flex items-center gap-3 italic">
                 <CreditCard size={16} className="text-emerald-400" /> Capital Allocation
              </h3>
           </div>
           <button 
             onClick={() => setShowWithdrawalModal(true)}
             className="px-8 py-3 bg-white text-indigo-950 font-black text-[10px] font-black uppercase tracking-[0.2em] rounded-2xl hover:scale-105 transition-all shadow-xl shadow-white/5 flex items-center gap-2"
           >
              Initialize Withdrawal <ArrowUpRight size={16} />
           </button>
        </div>

        {/* Withdrawal Modal Overlay */}
        <AnimatePresence>
           {showWithdrawalModal && (
              <motion.div 
                 initial={{ opacity: 0, scale: 0.95 }}
                 animate={{ opacity: 1, scale: 1 }}
                 exit={{ opacity: 0, scale: 0.95 }}
                 className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-slate-950/80 backdrop-blur-3xl"
              >
                  <GlassCard className="w-full max-w-xl p-12 bg-[#020617] relative">
                    <button onClick={() => setShowWithdrawalModal(false)} className="absolute top-8 right-8 p-3 text-slate-500 hover:text-white transition-colors">
                       <X size={24} />
                    </button>
                    
                    <div className="mb-10 text-center">
                       <h2 className="text-4xl font-black text-white italic tracking-tighter mb-2">Equity Dispatch</h2>
                       <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest italic leading-loose">Deploying Capital to External Nodes</p>
                    </div>

                    <form onSubmit={handleWithdraw} className="space-y-8">
                       <div className="space-y-2">
                          <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-4">Dispatch Amount (USD)</label>
                          <input 
                            className="w-full bg-white/5 border border-white/5 rounded-3xl p-5 text-sm font-bold text-white focus:ring-1 focus:ring-emerald-500/20 transition-all focus:border-emerald-500/20" 
                            type="number" step="0.01" 
                            value={amount} 
                            onChange={e => setAmount(e.target.value)} 
                            required 
                            placeholder="0.00"
                          />
                          <p className="text-[9px] font-black text-slate-600 uppercase tracking-widest ml-4">Max Liquidity: ${wallet.balance}</p>
                       </div>
                       
                       <div className="space-y-2">
                          <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-4">External Protocol Entry (Bank/MM)</label>
                          <textarea 
                            className="w-full bg-white/5 border border-white/5 rounded-3xl p-5 text-sm font-bold text-white min-h-[120px]" 
                            value={accountDetails} 
                            onChange={e => setAccountDetails(e.target.value)} 
                            required 
                            placeholder="Enter bank routing or mobile money credentials..."
                          />
                       </div>

                       <div className="pt-6">
                          <button 
                            className="w-full py-5 bg-emerald-600 text-white rounded-[2rem] font-black text-[10px] font-black uppercase tracking-[0.3em] shadow-xl shadow-emerald-600/20 hover:scale-[1.02] active:scale-[0.98] transition-all" 
                            disabled={submitting}
                            type="submit"
                          >
                             {submitting ? 'Authenticating...' : 'Authorize Transaction'}
                          </button>
                       </div>
                    </form>
                  </GlassCard>
              </motion.div>
           )}
        </AnimatePresence>

        {/* Transaction Matrices */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-12 items-start">
           
           {/* Recent Activity */}
           <div className="space-y-8">
              <h3 className="text-xs font-black text-white uppercase tracking-[0.2em] flex items-center gap-3">
                 <FileText size={16} className="text-indigo-400" /> Temporal Logs
              </h3>
              <div className="overflow-hidden rounded-[2.5rem] border border-white/5 bg-white/5 relative">
                 <div className="absolute inset-0 bg-gradient-to-b from-indigo-500/5 to-transparent pointer-events-none" />
                 <table className="w-full text-left">
                    <thead className="bg-[#020617] border-b border-white/10">
                       <tr>
                          <th className="p-6 text-[10px] font-black text-slate-500 uppercase tracking-widest italic">Node Event</th>
                          <th className="p-6 text-[10px] font-black text-slate-500 uppercase tracking-widest italic">Equity Flux</th>
                          <th className="p-6 text-[10px] font-black text-slate-500 uppercase tracking-widest italic text-right">Timestamp</th>
                       </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                       {transactions.slice(0, 8).map(t => (
                          <tr key={t.id} className="hover:bg-white/5 transition-colors group">
                             <td className="p-6">
                                <span className={`px-2 py-0.5 rounded-full text-[8px] font-black uppercase tracking-widest ${t.transaction_type === 'SALE' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-amber-500/10 text-amber-500 border border-amber-500/20'}`}>
                                   {t.transaction_type}
                                </span>
                             </td>
                             <td className={`p-6 text-[11px] font-black italic uppercase ${t.transaction_type === 'SALE' ? 'text-emerald-400' : 'text-rose-400'}`}>
                                {t.transaction_type === 'SALE' ? '+' : '-'}${Math.abs(t.amount)}
                             </td>
                             <td className="p-6 text-[9px] font-black text-slate-500 uppercase tracking-widest text-right">
                                {new Date(t.created_at).toLocaleDateString()}
                             </td>
                          </tr>
                       ))}
                       {transactions.length === 0 && (
                          <tr><td colSpan="3" className="p-10 text-center text-[10px] font-black text-slate-700 uppercase tracking-[0.4em]">Zero Flux Detected</td></tr>
                       )}
                    </tbody>
                 </table>
              </div>
           </div>

           {/* Dispatch Archive (Withdrawals) */}
           <div className="space-y-8">
              <h3 className="text-xs font-black text-white uppercase tracking-[0.2em] flex items-center gap-3">
                 <Clock size={16} className="text-cyan-400" /> Dispatch Registry
              </h3>
              <div className="overflow-hidden rounded-[2.5rem] border border-white/5 bg-white/5 relative">
                 <div className="absolute inset-0 bg-gradient-to-b from-cyan-500/5 to-transparent pointer-events-none" />
                 <table className="w-full text-left font-black uppercase tracking-widest">
                    <thead className="bg-[#020617] border-b border-white/10">
                       <tr className="text-[10px] text-slate-500 italic">
                          <th className="p-6">Allocation</th>
                          <th className="p-6 text-center">Status Protocol</th>
                          <th className="p-6 text-right">Archive Entry</th>
                       </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5 text-[10px]">
                       {withdrawals.map(w => (
                          <tr key={w.id} className="hover:bg-white/5 transition-colors">
                             <td className="p-6 text-white italic font-black">${w.amount}</td>
                             <td className="p-6 text-center">
                                <span className={`px-3 py-1 rounded-full text-[8px] font-black ${
                                   w.status === 'PAID' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 
                                   w.status === 'APPROVED' ? 'bg-indigo-500/10 text-indigo-400 border border-indigo-500/20' : 
                                   w.status === 'REJECTED' ? 'bg-rose-500/10 text-rose-400 border border-rose-500/20' : 
                                   'bg-amber-500/10 text-amber-500 border border-amber-500/20'
                                }`}>
                                   {w.status}
                                </span>
                             </td>
                             <td className="p-6 text-right text-slate-500">{new Date(w.created_at).toLocaleDateString()}</td>
                          </tr>
                       ))}
                       {withdrawals.length === 0 && (
                          <tr><td colSpan="3" className="p-10 text-center text-slate-700 tracking-[0.4em]">Registry Empty</td></tr>
                       )}
                    </tbody>
                 </table>
              </div>
           </div>
        </div>

      </div>
    </DashboardLayout>
  );
}
