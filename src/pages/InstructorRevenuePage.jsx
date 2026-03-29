import { useEffect, useState } from 'react';
import { getWallet, getWithdrawalRequests, createWithdrawalRequest } from '../services/api';
import DashboardLayout from '../components/DashboardLayout';
import StatCard from '../components/StatCard';
import { DollarSign, TrendingUp, Layers } from 'lucide-react';

export default function InstructorRevenuePage() {
  const [wallet, setWallet] = useState(null);
  const [withdrawals, setWithdrawals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [amount, setAmount] = useState('');
  const [accountDetails, setAccountDetails] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => { loadData(); }, []);

  const loadData = async () => {
    try {
      const [walletRes, withdrawalsRes] = await Promise.all([
        getWallet(),
        getWithdrawalRequests()
      ]);
      // Wallet is returned as a list (one entry per user)
      const walletData = Array.isArray(walletRes.data)
        ? walletRes.data[0]
        : walletRes.data.results?.[0];
      setWallet(walletData || { balance: '0.00', total_earned: '0.00', transactions: [] });
      // Normalize withdrawals (paginated or plain array)
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
      alert('Insufficient balance');
      return;
    }
    setSubmitting(true);
    try {
      await createWithdrawalRequest({ amount: parseFloat(amount), account_details: accountDetails });
      alert('Withdrawal request submitted!');
      setAmount('');
      setAccountDetails('');
      loadData();
    } catch {
      alert('Failed to submit withdrawal request');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <div className="loading-container"><div className="spinner"></div></div>;

  return (
    <DashboardLayout 
      title="Revenue Dashboard"
      subtitle="Track your earnings and manage withdrawals"
    >
      <div className="stats-grid-modern" style={{ marginBottom: '2rem' }}>
        <StatCard 
          icon={DollarSign} 
          label="Available Balance" 
          value={`$${wallet.balance}`} 
          variant="success" 
        />
        <StatCard 
          icon={TrendingUp} 
          label="Total Lifetime Earnings" 
          value={`$${wallet.total_earned}`} 
        />
        <StatCard 
          icon={Layers} 
          label="Total Transactions" 
          value={wallet.transactions?.length || 0} 
        />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem', alignItems: 'start' }}>
        {/* Withdrawal Form */}
        <div className="card">
          <h3 style={{ marginBottom: '1.5rem' }}>💸 Request Withdrawal</h3>
          <form onSubmit={handleWithdraw}>
            <div className="form-group">
              <label className="form-label">Amount (USD)</label>
              <input 
                className="form-input" 
                type="number" 
                step="0.01" 
                value={amount} 
                onChange={e => setAmount(e.target.value)} 
                required 
                placeholder="0.00"
              />
            </div>
            <div className="form-group">
              <label className="form-label">Bank / Mobile Money Details</label>
              <textarea 
                className="form-input" 
                value={accountDetails} 
                onChange={e => setAccountDetails(e.target.value)} 
                required 
                placeholder="Enter your account number, bank name, etc."
                style={{ minHeight: '100px' }}
              />
            </div>
            <button className="btn btn-primary btn-block" type="submit" disabled={submitting}>
              {submitting ? 'Submitting...' : 'Submit Request'}
            </button>
          </form>
        </div>

        {/* Recent Transactions */}
        <div className="card">
          <h3 style={{ marginBottom: '1.5rem' }}>📜 Recent Transactions</h3>
          <div style={{ overflowX: 'auto' }}>
            <table className="table" style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ textAlign: 'left', borderBottom: '1px solid var(--border)' }}>
                  <th style={{ padding: '0.75rem' }}>Type</th>
                  <th style={{ padding: '0.75rem' }}>Amount</th>
                  <th style={{ padding: '0.75rem' }}>Date</th>
                </tr>
              </thead>
              <tbody>
                {wallet.transactions?.slice(0, 5).map(t => (
                  <tr key={t.id} style={{ borderBottom: '1px solid var(--border)' }}>
                    <td style={{ padding: '0.75rem' }}>
                      <span className={`badge ${t.transaction_type === 'SALE' ? 'badge-success' : 'badge-warning'}`}>
                        {t.transaction_type}
                      </span>
                    </td>
                    <td style={{ padding: '0.75rem', fontWeight: 600, color: t.transaction_type === 'SALE' ? 'var(--success)' : 'var(--error)' }}>
                      {t.transaction_type === 'SALE' ? '+' : '-'}${Math.abs(t.amount)}
                    </td>
                    <td style={{ padding: '0.75rem', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                      {new Date(t.created_at).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
                {(!wallet.transactions || wallet.transactions.length === 0) && (
                  <tr><td colSpan="3" style={{ padding: '1rem', textAlign: 'center', color: 'var(--text-muted)' }}>No transactions yet</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Withdrawal History */}
      <div className="card" style={{ marginTop: '2rem' }}>
        <h3 style={{ marginBottom: '1.5rem' }}>🕒 Withdrawal History</h3>
        <div style={{ overflowX: 'auto' }}>
          <table className="table" style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ textAlign: 'left', borderBottom: '1px solid var(--border)' }}>
                <th style={{ padding: '0.75rem' }}>Amount</th>
                <th style={{ padding: '0.75rem' }}>Status</th>
                <th style={{ padding: '0.75rem' }}>Details</th>
                <th style={{ padding: '0.75rem' }}>Requested On</th>
              </tr>
            </thead>
            <tbody>
              {withdrawals.map(w => (
                <tr key={w.id} style={{ borderBottom: '1px solid var(--border)' }}>
                  <td style={{ padding: '0.75rem', fontWeight: 600 }}>${w.amount}</td>
                  <td style={{ padding: '0.75rem' }}>
                    <span className={`badge ${
                      w.status === 'PAID' ? 'badge-success' : 
                      w.status === 'APPROVED' ? 'badge-info' : 
                      w.status === 'REJECTED' ? 'badge-error' : 'badge-warning'
                    }`}>
                      {w.status}
                    </span>
                  </td>
                  <td style={{ padding: '0.75rem', fontSize: '0.85rem', maxWidth: '300px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {w.account_details}
                  </td>
                  <td style={{ padding: '0.75rem', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                    {new Date(w.created_at).toLocaleDateString()}
                  </td>
                </tr>
              ))}
              {withdrawals.length === 0 && (
                <tr><td colSpan="4" style={{ padding: '1rem', textAlign: 'center', color: 'var(--text-muted)' }}>No withdrawal requests yet</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </DashboardLayout>
  );
}
