'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { MapPin, Clock, Package, CheckCircle, X, Eye } from 'lucide-react';
import DashboardLayout from '@/components/DashboardLayout';
import { useApp } from '@/context/AppContext';

export default function PickupRequestsPage() {
  const { collectorRequests, acceptPickup, rejectPickup, showToast } = useApp();
  const router = useRouter();
  const [accepted, setAccepted] = useState([]);
  const [rejected, setRejected] = useState([]);

  const pending = collectorRequests.filter(r => r.status === 'requested' && !rejected.includes(r.id) && !accepted.includes(r.id));

  const handleAccept = (r) => {
    acceptPickup(r.id);
    setAccepted(prev => [...prev, r.id]);
    showToast(`✅ Pickup ${r.pickup_code} accepted! The user has been notified.`);
  };

  const handleReject = (r) => {
    rejectPickup(r.id);
    setRejected(prev => [...prev, r.id]);
    showToast(`Pickup ${r.pickup_code} rejected.`, 'info');
  };

  return (
    <DashboardLayout>
      <div className="page-header">
        <h1 className="page-title">Pickup Requests</h1>
        <p className="page-subtitle">{pending.length} pending request{pending.length !== 1 ? 's' : ''} in your area.</p>
      </div>

      {/* Accepted banner */}
      {accepted.length > 0 && (
        <div style={{ background: 'var(--success-light)', border: '1px solid var(--success)', borderRadius: 'var(--radius-sm)', padding: '14px 20px', marginBottom: 20, display: 'flex', gap: 10, alignItems: 'center' }}>
          <CheckCircle size={18} color="var(--success)" />
          <span style={{ fontWeight: 600, color: '#15803d' }}>{accepted.length} pickup(s) accepted!</span>
          <button onClick={() => router.push('/collector/pickups')} className="btn btn-sm btn-primary" style={{ marginLeft: 'auto' }}>View My Pickups</button>
        </div>
      )}

      {pending.length === 0 ? (
        <div className="card">
          <div className="empty-state">
            <div className="empty-state-icon">📭</div>
            <h3>No pending requests</h3>
            <p>New pickup requests from users in your area will appear here.</p>
          </div>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          {pending.map(r => (
            <div key={r.id} className="card" style={{ border: '1.5px solid var(--border)' }}>
              {/* Header */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16, paddingBottom: 16, borderBottom: '1px solid var(--bg)' }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <span style={{ fontFamily: 'monospace', fontWeight: 800, fontSize: 16 }}>{r.pickup_code}</span>
                    <span className="badge badge-warning">New Request</span>
                  </div>
                  <div style={{ fontSize: 14, color: 'var(--muted)', marginTop: 4 }}>👤 {r.user_name} • {r.user_phone}</div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: 22, fontWeight: 800, color: 'var(--primary)' }}>~{r.estimated_points} pts</div>
                  <div style={{ fontSize: 13, color: 'var(--muted)' }}>{r.estimated_weight} kg estimated</div>
                </div>
              </div>

              {/* Details Grid */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16, marginBottom: 16 }}>
                <div style={{ textAlign: 'center', padding: '12px', background: 'var(--bg)', borderRadius: 'var(--radius-sm)' }}>
                  <div style={{ fontSize: 20, marginBottom: 4 }}>📍</div>
                  <div style={{ fontSize: 12, color: 'var(--muted)' }}>Distance</div>
                  <div style={{ fontWeight: 700 }}>{r.distance}</div>
                </div>
                <div style={{ textAlign: 'center', padding: '12px', background: 'var(--bg)', borderRadius: 'var(--radius-sm)' }}>
                  <div style={{ fontSize: 20, marginBottom: 4 }}>📅</div>
                  <div style={{ fontSize: 12, color: 'var(--muted)' }}>Date</div>
                  <div style={{ fontWeight: 700 }}>{r.scheduled_date}</div>
                </div>
                <div style={{ textAlign: 'center', padding: '12px', background: 'var(--bg)', borderRadius: 'var(--radius-sm)' }}>
                  <div style={{ fontSize: 20, marginBottom: 4 }}>⏰</div>
                  <div style={{ fontSize: 12, color: 'var(--muted)' }}>Time Slot</div>
                  <div style={{ fontWeight: 700, fontSize: 12 }}>{r.time_slot}</div>
                </div>
              </div>

              {/* Waste Items */}
              <div style={{ marginBottom: 16 }}>
                <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 8 }}>Waste Items</div>
                <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                  {r.items.map((item, i) => (
                    <span key={i} className="badge badge-info">{item.category} — {item.estimated} kg</span>
                  ))}
                </div>
              </div>

              {/* Address */}
              <div style={{ padding: '10px 14px', background: 'var(--bg)', borderRadius: 'var(--radius-sm)', fontSize: 13, color: 'var(--muted)', marginBottom: 16, display: 'flex', gap: 8, alignItems: 'flex-start' }}>
                <MapPin size={14} style={{ flexShrink: 0, marginTop: 2 }} />{r.address}
              </div>

              {/* Action Buttons */}
              <div style={{ display: 'flex', gap: 12 }}>
                <button onClick={() => handleAccept(r)} className="btn btn-primary" style={{ flex: 1 }}>
                  <CheckCircle size={18} /> Accept Pickup
                </button>
                <button onClick={() => handleReject(r)} className="btn btn-danger btn-sm" style={{ minWidth: 100 }}>
                  <X size={16} /> Reject
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </DashboardLayout>
  );
}
