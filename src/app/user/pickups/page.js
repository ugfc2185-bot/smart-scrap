'use client';
import { useState } from 'react';
import Link from 'next/link';
import { Truck, Eye, X, Filter } from 'lucide-react';
import DashboardLayout from '@/components/DashboardLayout';
import { useApp } from '@/context/AppContext';

function StatusBadge({ status }) {
  const map = {
    requested: ['Requested', 'badge-gray'],
    assigned: ['Assigned', 'badge-info'],
    on_the_way: ['On The Way', 'badge-purple'],
    arrived: ['Arrived', 'badge-warning'],
    in_progress: ['In Progress', 'badge-warning'],
    weight_verified: ['Verified', 'badge-info'],
    completed: ['Completed', 'badge-success'],
    cancelled: ['Cancelled', 'badge-danger'],
  };
  const [label, cls] = map[status] || ['Unknown', 'badge-gray'];
  return <span className={`badge ${cls}`}>{label}</span>;
}

export default function MyPickupsPage() {
  const { pickups } = useApp();
  const [filter, setFilter] = useState('all');

  const filters = ['all', 'requested', 'assigned', 'completed', 'cancelled'];

  const filtered = pickups.filter(p => {
    if (filter === 'all') return true;
    if (filter === 'assigned') return ['assigned','on_the_way','arrived','in_progress','weight_verified'].includes(p.status);
    return p.status === filter;
  });

  return (
    <DashboardLayout>
      <div className="page-header">
        <h1 className="page-title">My Pickups</h1>
        <p className="page-subtitle">View and manage all your scrap pickup requests.</p>
      </div>

      <div style={{ display: 'flex', gap: 10, marginBottom: 24, flexWrap: 'wrap' }}>
        {filters.map(f => (
          <button key={f} onClick={() => setFilter(f)}
            className={`btn btn-sm ${filter === f ? 'btn-primary' : 'btn-secondary'}`}
            style={{ textTransform: 'capitalize' }}>{f === 'all' ? 'All Pickups' : f}</button>
        ))}
        <Link href="/user/schedule-pickup" className="btn btn-primary btn-sm" style={{ marginLeft: 'auto' }}>
          + New Pickup
        </Link>
      </div>

      {filtered.length === 0 ? (
        <div className="card">
          <div className="empty-state">
            <div className="empty-state-icon">📦</div>
            <h3>No pickups found</h3>
            <p>You don't have any pickups in this category yet.</p>
            <Link href="/user/schedule-pickup" className="btn btn-primary">Schedule a Pickup</Link>
          </div>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {filtered.map(p => (
            <div key={p.id} className="card" style={{ padding: '20px 24px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 12 }}>
                <div style={{ display: 'flex', gap: 16, alignItems: 'flex-start' }}>
                  <div style={{ width: 44, height: 44, borderRadius: 12, background: 'var(--primary-light)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22, flexShrink: 0 }}>♻️</div>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 4 }}>
                      <span style={{ fontFamily: 'monospace', fontWeight: 700, fontSize: 15 }}>{p.pickup_code}</span>
                      <StatusBadge status={p.status} />
                    </div>
                    <div style={{ fontSize: 13, color: 'var(--muted)' }}>
                      📅 {p.scheduled_date} • ⏰ {p.time_slot}
                    </div>
                    {p.collector_name && (
                      <div style={{ fontSize: 13, color: 'var(--muted)', marginTop: 2 }}>
                        🚚 Collector: <strong>{p.collector_name}</strong>
                      </div>
                    )}
                    <div style={{ fontSize: 13, color: 'var(--muted)', marginTop: 2 }}>
                      {p.items?.map(i => i.category || i.name).join(', ')}
                    </div>
                  </div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  {p.final_points ? (
                    <div style={{ fontSize: 22, fontWeight: 800, color: 'var(--primary)' }}>+{p.final_points} pts</div>
                  ) : (
                    <div style={{ fontSize: 16, fontWeight: 700, color: 'var(--muted)' }}>~{p.estimated_points} pts</div>
                  )}
                  <div style={{ fontSize: 12, color: 'var(--muted)', marginTop: 2 }}>
                    {p.actual_weight || p.estimated_weight} kg
                  </div>
                </div>
              </div>
              <div style={{ marginTop: 16, paddingTop: 14, borderTop: '1px solid var(--bg)', display: 'flex', gap: 10 }}>
                <Link href={`/user/pickups/${p.id}`} className="btn btn-secondary btn-sm">
                  <Eye size={14} /> View Details
                </Link>
                {['assigned','on_the_way'].includes(p.status) && (
                  <Link href={`/user/track/${p.id}`} className="btn btn-primary btn-sm">
                    <Truck size={14} /> Track Collector
                  </Link>
                )}
                {p.status === 'requested' && (
                  <button className="btn btn-danger btn-sm">
                    <X size={14} /> Cancel
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </DashboardLayout>
  );
}
