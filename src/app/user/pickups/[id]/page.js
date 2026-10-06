'use client';
import { use } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Truck, ArrowLeft, MapPin, Calendar, Clock, User, CheckCircle, Circle } from 'lucide-react';
import DashboardLayout from '@/components/DashboardLayout';
import { useApp } from '@/context/AppContext';

const STATUS_TIMELINE = [
  { key: 'requested', label: 'Pickup Requested', icon: '📋', desc: 'Your request has been submitted' },
  { key: 'assigned', label: 'Collector Assigned', icon: '✅', desc: 'A collector has been assigned' },
  { key: 'on_the_way', label: 'Collector On The Way', icon: '🚚', desc: 'Your collector is heading towards you' },
  { key: 'arrived', label: 'Collector Arrived', icon: '📍', desc: 'Collector has reached your location' },
  { key: 'in_progress', label: 'Pickup In Progress', icon: '⚖️', desc: 'Scrap is being collected and weighed' },
  { key: 'weight_verified', label: 'Weight Verified', icon: '✔️', desc: 'Actual weight has been verified' },
  { key: 'completed', label: 'Pickup Completed', icon: '🏆', desc: 'Points have been added to your wallet' },
];

const ORDER = ['requested','assigned','on_the_way','arrived','in_progress','weight_verified','completed'];

export default function PickupDetailPage({ params }) {
  const { id } = use(params);
  const { pickups } = useApp();
  const router = useRouter();
  const pickup = pickups.find(p => String(p.id) === String(id));

  if (!pickup) {
    return (
      <DashboardLayout>
        <div className="empty-state">
          <div className="empty-state-icon">❌</div>
          <h3>Pickup not found</h3>
          <Link href="/user/pickups" className="btn btn-primary">Back to Pickups</Link>
        </div>
      </DashboardLayout>
    );
  }

  const currentStep = ORDER.indexOf(pickup.status);

  return (
    <DashboardLayout>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 24 }}>
        <button onClick={() => router.back()} className="btn btn-secondary btn-sm"><ArrowLeft size={16} /></button>
        <div>
          <h1 className="page-title" style={{ margin: 0 }}>{pickup.pickup_code}</h1>
          <p className="page-subtitle" style={{ margin: 0 }}>Pickup Details</p>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>
        {/* LEFT */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          {/* Status Timeline */}
          <div className="card">
            <h3 style={{ fontWeight: 700, fontSize: 16, marginBottom: 20 }}>Pickup Status</h3>
            <div className="timeline">
              {STATUS_TIMELINE.filter(s => s.key !== 'cancelled').map((s, i) => {
                const stepIdx = ORDER.indexOf(s.key);
                const done = stepIdx <= currentStep;
                const current = stepIdx === currentStep;
                return (
                  <div key={s.key} className="timeline-item">
                    <div className="timeline-icon-col">
                      <div className="timeline-icon" style={{ background: done ? 'var(--primary)' : 'var(--bg)', border: `2px solid ${done ? 'var(--primary)' : current ? 'var(--warning)' : 'var(--border)'}` }}>
                        {done ? <CheckCircle size={16} color="white" /> : <Circle size={16} color={current ? 'var(--warning)' : 'var(--muted)'} />}
                      </div>
                      <div className="timeline-line" style={{ background: done && i < STATUS_TIMELINE.length - 1 ? 'var(--primary)' : 'var(--border)' }} />
                    </div>
                    <div className="timeline-content">
                      <div className="timeline-title" style={{ color: done ? 'var(--text)' : 'var(--muted)', fontWeight: done ? 600 : 400 }}>
                        {s.icon} {s.label}
                      </div>
                      <div className="timeline-time">{s.desc}</div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {['assigned','on_the_way'].includes(pickup.status) && (
              <Link href={`/user/track/${pickup.id}`} className="btn btn-primary">
                <Truck size={18} /> Track Collector Live
              </Link>
            )}
            {pickup.status === 'requested' && (
              <button className="btn btn-danger">Cancel Pickup</button>
            )}
            <Link href="/user/pickups" className="btn btn-secondary">← Back to My Pickups</Link>
          </div>
        </div>

        {/* RIGHT */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          {/* Pickup Info */}
          <div className="card">
            <h3 style={{ fontWeight: 700, fontSize: 16, marginBottom: 16 }}>Pickup Information</h3>
            {[
              ['📍 Address', pickup.address],
              ['📅 Date', pickup.scheduled_date],
              ['⏰ Time Slot', pickup.time_slot],
              ['🚚 Collector', pickup.collector_name || 'Not assigned yet'],
            ].map(([label, val]) => (
              <div key={label} style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0', borderBottom: '1px solid var(--bg)', fontSize: 14 }}>
                <span style={{ color: 'var(--muted)' }}>{label}</span>
                <span style={{ fontWeight: 600, maxWidth: '60%', textAlign: 'right' }}>{val}</span>
              </div>
            ))}
          </div>

          {/* Waste Items */}
          <div className="card">
            <h3 style={{ fontWeight: 700, fontSize: 16, marginBottom: 16 }}>Waste Items</h3>
            {(pickup.items || []).map((item, i) => (
              <div key={i} style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0', borderBottom: '1px solid var(--bg)', fontSize: 14 }}>
                <span>{item.category}</span>
                <div style={{ textAlign: 'right' }}>
                  {item.actual !== undefined ? (
                    <div>
                      <span style={{ textDecoration: 'line-through', color: 'var(--muted)', fontSize: 12 }}>{item.estimated} kg</span>
                      {' → '}
                      <span style={{ fontWeight: 600 }}>{item.actual} kg</span>
                      <span style={{ color: 'var(--primary)', fontWeight: 700, marginLeft: 6 }}>+{item.points} pts</span>
                    </div>
                  ) : (
                    <span>{item.estimated} kg estimated</span>
                  )}
                </div>
              </div>
            ))}
            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 14, fontWeight: 700, fontSize: 15 }}>
              <span>Total Points</span>
              <span style={{ color: 'var(--primary)', fontSize: 18 }}>
                {pickup.final_points ? `+${pickup.final_points}` : `~${pickup.estimated_points || 0}`} pts
              </span>
            </div>
          </div>

          {/* Completed Points Banner */}
          {pickup.status === 'completed' && pickup.final_points && (
            <div style={{ background: 'linear-gradient(135deg, var(--primary), var(--secondary))', borderRadius: 'var(--radius)', padding: '20px', color: 'white', textAlign: 'center' }}>
              <div style={{ fontSize: 36, fontWeight: 800, marginBottom: 4 }}>🎉</div>
              <div style={{ fontSize: 28, fontWeight: 800, marginBottom: 4 }}>+{pickup.final_points} Points!</div>
              <div style={{ opacity: 0.9 }}>Added to your wallet</div>
              <Link href="/user/rewards" className="btn btn-sm" style={{ background: 'rgba(255,255,255,0.2)', color: 'white', marginTop: 14 }}>
                Redeem Rewards →
              </Link>
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}
