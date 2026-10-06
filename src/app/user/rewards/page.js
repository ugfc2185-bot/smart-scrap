'use client';
import Link from 'next/link';
import { Gift, ArrowRight } from 'lucide-react';
import DashboardLayout from '@/components/DashboardLayout';
import { useApp } from '@/context/AppContext';
import { REWARDS } from '@/lib/mockData';
import { useState } from 'react';

function RedeemModal({ reward, onClose, onConfirm }) {
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-box" onClick={e => e.stopPropagation()}>
        <div style={{ textAlign: 'center', marginBottom: 20 }}>
          <div style={{ fontSize: 50 }}>{reward.image}</div>
          <div className="modal-title">{reward.name}</div>
          <div style={{ color: 'var(--muted)', fontSize: 14 }}>{reward.description}</div>
        </div>
        <div style={{ background: 'var(--bg)', borderRadius: 'var(--radius-sm)', padding: '14px', textAlign: 'center', marginBottom: 4 }}>
          <div style={{ fontSize: 28, fontWeight: 800, color: 'var(--primary)' }}>{reward.points_required} Points</div>
          {reward.cash_value > 0 && <div style={{ color: 'var(--muted)', fontSize: 14 }}>= ₹{reward.cash_value} value</div>}
        </div>
        <div className="modal-actions">
          <button onClick={onClose} className="btn btn-secondary">Cancel</button>
          <button onClick={onConfirm} className="btn btn-primary">Confirm Redemption ✓</button>
        </div>
      </div>
    </div>
  );
}

export default function RewardsPage() {
  const { wallet, redeemReward, showToast } = useApp();
  const [selectedReward, setSelectedReward] = useState(null);
  const [successReward, setSuccessReward] = useState(null);

  const handleRedeem = () => {
    const result = redeemReward(selectedReward);
    if (result.success) {
      setSuccessReward(selectedReward);
      setSelectedReward(null);
      showToast(`🎁 ${selectedReward.name} redeemed! Check your email.`);
    } else {
      showToast(result.error, 'error');
      setSelectedReward(null);
    }
  };

  return (
    <DashboardLayout>
      <div className="page-header">
        <h1 className="page-title">Redeem Rewards</h1>
        <p className="page-subtitle">Use your earned points to claim exciting rewards!</p>
      </div>

      {/* Wallet Banner */}
      <div style={{ background: 'linear-gradient(135deg, var(--primary), #0EA5E9)', borderRadius: 'var(--radius)', padding: '24px 28px', color: 'white', marginBottom: 28, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <div style={{ opacity: 0.85, fontSize: 13, marginBottom: 4 }}>Your Balance</div>
          <div style={{ fontSize: 42, fontWeight: 800 }}>{wallet.balance.toLocaleString()} <span style={{ fontSize: 18, fontWeight: 500 }}>points</span></div>
          <div style={{ opacity: 0.85, fontSize: 14 }}>= ₹{Math.floor(wallet.balance / 5)} in rewards</div>
        </div>
        <div style={{ textAlign: 'right' }}>
          <Link href="/user/wallet" className="btn btn-sm" style={{ background: 'rgba(255,255,255,0.2)', color: 'white', marginBottom: 8, display: 'block' }}>
            View Wallet <ArrowRight size={14} />
          </Link>
          <Link href="/user/schedule-pickup" className="btn btn-sm" style={{ background: 'white', color: 'var(--primary)', fontWeight: 700 }}>
            Earn More Points +
          </Link>
        </div>
      </div>

      {/* Success Banner */}
      {successReward && (
        <div style={{ background: 'var(--success-light)', border: '1px solid var(--success)', borderRadius: 'var(--radius-sm)', padding: '16px 20px', marginBottom: 20, display: 'flex', alignItems: 'center', gap: 12 }}>
          <span style={{ fontSize: 24 }}>🎉</span>
          <div>
            <div style={{ fontWeight: 700, color: '#15803d' }}>Redemption Successful!</div>
            <div style={{ fontSize: 13, color: 'var(--muted)' }}>{successReward.name} has been processed. Check your email.</div>
          </div>
          <button onClick={() => setSuccessReward(null)} style={{ marginLeft: 'auto', color: 'var(--muted)' }}>✕</button>
        </div>
      )}

      <div className="rewards-grid">
        {REWARDS.map(r => {
          const canRedeem = wallet.balance >= r.points_required;
          return (
            <div key={r.id} className={`reward-card${!canRedeem ? ' insufficient' : ''}`}>
              <div className="reward-icon">{r.image}</div>
              <div>
                <div className="reward-name">{r.name}</div>
                <div className="reward-desc">{r.description}</div>
              </div>
              <div>
                <div className="reward-pts">{r.points_required} <span>points</span></div>
                {r.cash_value > 0 && <div style={{ fontSize: 12, color: 'var(--muted)' }}>= ₹{r.cash_value}</div>}
              </div>
              <button
                onClick={() => canRedeem && setSelectedReward(r)}
                className={`btn btn-sm w-full ${canRedeem ? 'btn-primary' : 'btn-secondary'}`}
                disabled={!canRedeem}>
                {canRedeem ? `🎁 Redeem` : `Need ${r.points_required - wallet.balance} more pts`}
              </button>
            </div>
          );
        })}
      </div>

      {selectedReward && (
        <RedeemModal reward={selectedReward} onClose={() => setSelectedReward(null)} onConfirm={handleRedeem} />
      )}
    </DashboardLayout>
  );
}
