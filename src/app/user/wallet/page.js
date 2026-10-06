'use client';
import Link from 'next/link';
import { TrendingUp, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import DashboardLayout from '@/components/DashboardLayout';
import { useApp } from '@/context/AppContext';

export default function WalletPage() {
  const { wallet, pointTransactions } = useApp();

  const timeAgo = (dt) => {
    const d = new Date(dt), now = new Date();
    const days = Math.floor((now - d) / 86400000);
    if (days === 0) return 'Today';
    if (days === 1) return 'Yesterday';
    return new Date(dt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
  };

  return (
    <DashboardLayout>
      <div className="page-header">
        <h1 className="page-title">Reward Wallet</h1>
        <p className="page-subtitle">Track your earned and redeemed points.</p>
      </div>

      {/* Wallet Card */}
      <div style={{ background: 'linear-gradient(135deg, #0F172A, #1e293b)', borderRadius: 'var(--radius-lg)', padding: '32px', color: 'white', marginBottom: 28, position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: -40, right: -40, width: 200, height: 200, borderRadius: '50%', background: 'rgba(22,163,74,0.15)' }} />
        <div style={{ position: 'absolute', bottom: -30, left: 100, width: 150, height: 150, borderRadius: '50%', background: 'rgba(14,165,233,0.1)' }} />
        <div style={{ position: 'relative' }}>
          <div style={{ opacity: 0.7, fontSize: 13, marginBottom: 8, letterSpacing: '0.08em', textTransform: 'uppercase' }}>Available Balance</div>
          <div style={{ fontSize: 52, fontWeight: 800, marginBottom: 4 }}>{wallet.balance.toLocaleString()}</div>
          <div style={{ opacity: 0.7, marginBottom: 24 }}>points = ₹{Math.floor(wallet.balance / 5)} in rewards</div>
          <div style={{ display: 'flex', gap: 32 }}>
            <div>
              <div style={{ opacity: 0.6, fontSize: 12, marginBottom: 4 }}>Total Earned</div>
              <div style={{ fontWeight: 700, fontSize: 18, color: '#4ade80' }}>+{wallet.total_earned.toLocaleString()}</div>
            </div>
            <div>
              <div style={{ opacity: 0.6, fontSize: 12, marginBottom: 4 }}>Total Redeemed</div>
              <div style={{ fontWeight: 700, fontSize: 18, color: '#f87171' }}>−{wallet.total_redeemed.toLocaleString()}</div>
            </div>
            <div>
              <div style={{ opacity: 0.6, fontSize: 12, marginBottom: 4 }}>Cash Equivalent</div>
              <div style={{ fontWeight: 700, fontSize: 18, color: '#fbbf24' }}>₹{Math.floor(wallet.balance / 5)}</div>
            </div>
          </div>
        </div>
      </div>

      <div style={{ display: 'flex', gap: 12, marginBottom: 24 }}>
        <Link href="/user/rewards" className="btn btn-primary" style={{ flex: 1 }}>🎁 Redeem Rewards</Link>
        <Link href="/user/schedule-pickup" className="btn btn-outline" style={{ flex: 1 }}>+ Earn More Points</Link>
      </div>

      {/* Transaction History */}
      <div className="card">
        <h3 style={{ fontWeight: 700, fontSize: 16, marginBottom: 20 }}>Transaction History</h3>
        {pointTransactions.length === 0 ? (
          <div className="empty-state">
            <div className="empty-state-icon">💳</div>
            <h3>No transactions yet</h3>
            <p>Complete your first pickup to start earning points!</p>
          </div>
        ) : (
          <div>
            {pointTransactions.map(t => (
              <div key={t.id} style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '14px 0', borderBottom: '1px solid var(--bg)' }}>
                <div style={{ width: 40, height: 40, borderRadius: 12, background: t.points > 0 ? 'var(--success-light)' : 'var(--danger-light)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  {t.points > 0 ? <ArrowUpRight size={18} color="var(--success)" /> : <ArrowDownRight size={18} color="var(--danger)" />}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 600, fontSize: 14 }}>{t.description}</div>
                  <div style={{ fontSize: 12, color: 'var(--muted)' }}>
                    {t.pickup_code ? `Pickup ${t.pickup_code} • ` : ''}{timeAgo(t.created_at)}
                  </div>
                </div>
                <div style={{ fontWeight: 700, fontSize: 16, color: t.points > 0 ? 'var(--success)' : 'var(--danger)' }}>
                  {t.points > 0 ? '+' : ''}{t.points} pts
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
