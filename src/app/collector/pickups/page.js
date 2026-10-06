'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { CheckCircle, Scale, Camera } from 'lucide-react';
import DashboardLayout from '@/components/DashboardLayout';
import { useApp } from '@/context/AppContext';
import { WASTE_CATEGORIES } from '@/lib/mockData';

export default function CollectorPickupsPage() {
  const { pickups, completePickup, updatePickupStatus, showToast } = useApp();
  const router = useRouter();
  // For demo, show assigned pickups
  const myPickups = pickups.filter(p => ['assigned','on_the_way','arrived','in_progress','completed'].includes(p.status));
  const [verifying, setVerifying] = useState(null);
  const [actualWeights, setActualWeights] = useState({});
  const [submitting, setSubmitting] = useState(false);

  const openVerify = (pickup) => {
    const init = {};
    (pickup.items || []).forEach(item => { init[item.category] = item.estimated || 1; });
    setActualWeights(init);
    setVerifying(pickup);
  };

  const calcPoints = () => {
    if (!verifying) return 0;
    return (verifying.items || []).reduce((sum, item) => {
      const cat = WASTE_CATEGORIES.find(c => c.name === item.category);
      const w = Number(actualWeights[item.category]) || 0;
      return sum + (cat ? w * cat.points_per_kg : 0);
    }, 0);
  };

  const handleComplete = async () => {
    setSubmitting(true);
    await new Promise(r => setTimeout(r, 800));
    const finalPoints = calcPoints();
    const actualItems = (verifying.items || []).map(item => {
      const cat = WASTE_CATEGORIES.find(c => c.name === item.category);
      return { category: item.category, actual: Number(actualWeights[item.category]) || 0, points: (cat?.points_per_kg || 0) * (Number(actualWeights[item.category]) || 0) };
    });
    completePickup(verifying.id, actualItems, finalPoints);
    setSubmitting(false);
    setVerifying(null);
    showToast(`Pickup completed! User earned ${finalPoints} points.`);
  };

  return (
    <DashboardLayout>
      <div className="page-header">
        <h1 className="page-title">My Pickups</h1>
        <p className="page-subtitle">Manage your accepted and in-progress pickups.</p>
      </div>

      {myPickups.length === 0 ? (
        <div className="card">
          <div className="empty-state">
            <div className="empty-state-icon">📦</div>
            <h3>No pickups yet</h3>
            <p>Accept pickup requests to see them here.</p>
            <button onClick={() => router.push('/collector/requests')} className="btn btn-primary">View Requests</button>
          </div>
        </div>
      ) : myPickups.map(p => (
        <div key={p.id} className="card" style={{ marginBottom: 16 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
            <div>
              <div style={{ fontFamily: 'monospace', fontWeight: 800, fontSize: 16, marginBottom: 4 }}>{p.pickup_code}</div>
              <div style={{ fontSize: 13, color: 'var(--muted)' }}>📅 {p.scheduled_date} • ⏰ {p.time_slot}</div>
              <div style={{ fontSize: 13, color: 'var(--muted)', marginTop: 2 }}>📍 {p.address}</div>
              <div style={{ marginTop: 8, display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                {(p.items || []).map((i, idx) => <span key={idx} className="badge badge-info">{i.category}</span>)}
              </div>
            </div>
            <div style={{ textAlign: 'right' }}>
              <span className={`badge status-${p.status}`} style={{ textTransform: 'capitalize' }}>{p.status.replace(/_/g, ' ')}</span>
              <div style={{ fontSize: 22, fontWeight: 800, color: 'var(--primary)', marginTop: 8 }}>{p.estimated_weight} kg</div>
            </div>
          </div>
          <div style={{ marginTop: 14, paddingTop: 14, borderTop: '1px solid var(--bg)', display: 'flex', gap: 10, flexWrap: 'wrap' }}>
            {p.status === 'assigned' && (
              <button onClick={() => { updatePickupStatus(p.id, 'on_the_way'); showToast('Status updated: On The Way'); }} className="btn btn-primary btn-sm">🚚 Start Navigation</button>
            )}
            {p.status === 'on_the_way' && (
              <button onClick={() => { updatePickupStatus(p.id, 'arrived'); showToast('Status updated: Arrived'); }} className="btn btn-accent btn-sm">📍 Mark Arrived</button>
            )}
            {p.status === 'arrived' && (
              <button onClick={() => openVerify(p)} className="btn btn-primary">
                <Scale size={16} /> Start Weight Verification
              </button>
            )}
            {p.status === 'completed' && (
              <span className="badge badge-success" style={{ fontSize: 14, padding: '8px 16px' }}>✅ Completed — {p.final_points} pts awarded</span>
            )}
          </div>
        </div>
      ))}

      {/* WEIGHT VERIFICATION MODAL */}
      {verifying && (
        <div className="modal-overlay">
          <div className="modal-box" style={{ maxWidth: 560 }}>
            <div style={{ marginBottom: 20 }}>
              <div style={{ fontSize: 24, marginBottom: 4 }}>⚖️ Weight Verification</div>
              <div className="modal-title">{verifying.pickup_code}</div>
              <div style={{ color: 'var(--muted)', fontSize: 14 }}>Enter the actual weight for each waste type.</div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              {(verifying.items || []).map((item, i) => {
                const cat = WASTE_CATEGORIES.find(c => c.name === item.category);
                const actual = Number(actualWeights[item.category]) || 0;
                return (
                  <div key={i} style={{ border: '1px solid var(--border)', borderRadius: 'var(--radius-sm)', padding: '14px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
                      <div style={{ fontWeight: 600 }}>{item.category}</div>
                      <div style={{ color: 'var(--primary)', fontWeight: 700 }}>= {(actual * (cat?.points_per_kg || 0)).toFixed(0)} pts</div>
                    </div>
                    <div style={{ display: 'flex', gap: 14, alignItems: 'center', fontSize: 13 }}>
                      <div style={{ color: 'var(--muted)' }}>Est: <strong>{item.estimated} kg</strong></div>
                      <div style={{ flex: 1 }}>
                        <input type="number" step="0.1" min="0" className="form-input"
                          value={actualWeights[item.category] || ''}
                          onChange={e => setActualWeights(w => ({ ...w, [item.category]: e.target.value }))}
                          placeholder="Actual KG" />
                      </div>
                      <div style={{ fontWeight: 600 }}>kg</div>
                    </div>
                  </div>
                );
              })}
            </div>

            <div style={{ background: 'linear-gradient(135deg, var(--primary-light), var(--accent-light))', borderRadius: 'var(--radius-sm)', padding: '16px', marginTop: 16, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontWeight: 700 }}>Total Points to Award</span>
              <span style={{ fontSize: 28, fontWeight: 800, color: 'var(--primary)' }}>{calcPoints()} pts</span>
            </div>

            <div className="modal-actions">
              <button onClick={() => setVerifying(null)} className="btn btn-secondary">Cancel</button>
              <button onClick={handleComplete} className="btn btn-primary" disabled={submitting}>
                {submitting ? 'Completing...' : <><CheckCircle size={16}/> Verify & Complete</>}
              </button>
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}
