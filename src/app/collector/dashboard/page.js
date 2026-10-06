'use client';
import Link from 'next/link';
import { Package, Clock, CheckCircle, Truck, DollarSign, ArrowRight } from 'lucide-react';
import DashboardLayout from '@/components/DashboardLayout';
import { useApp } from '@/context/AppContext';

export default function CollectorDashboard() {
  const { user, collectorRequests, pickups } = useApp();
  const pendingRequests = collectorRequests.filter(r => r.status === 'requested');
  const myPickups = pickups.filter(p => p.collector_id === 2);
  const completed = myPickups.filter(p => p.status === 'completed');

  const stats = [
    { icon: <Clock size={22}/>, bg: '#fef3c7', color: 'var(--warning)', label: 'Pending Requests', value: pendingRequests.length, link: '/collector/requests' },
    { icon: <Truck size={22}/>, bg: '#e0f2fe', color: 'var(--accent)', label: "Today's Pickups", value: 3, link: '/collector/pickups' },
    { icon: <CheckCircle size={22}/>, bg: '#dcfce7', color: 'var(--primary)', label: 'Completed', value: 124, link: '/collector/pickups' },
    { icon: <DollarSign size={22}/>, bg: '#ede9fe', color: '#8B5CF6', label: "Today's Earnings", value: '₹850', link: '/collector/earnings' },
  ];

  return (
    <DashboardLayout>
      <div className="page-header">
        <h1 className="page-title">Collector Dashboard 🚚</h1>
        <p className="page-subtitle">Welcome back, {user?.name}! Here are today's updates.</p>
      </div>

      <div className="stat-grid">
        {stats.map(s => (
          <Link href={s.link} key={s.label} className="stat-card" style={{ textDecoration: 'none' }}>
            <div className="stat-icon" style={{ background: s.bg, color: s.color }}>{s.icon}</div>
            <div><div className="stat-value">{s.value}</div><div className="stat-label">{s.label}</div></div>
            <div style={{ color: 'var(--muted)', fontSize: 12, display: 'flex', alignItems: 'center', gap: 4 }}>View <ArrowRight size={12}/></div>
          </Link>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>
        {/* Pending Requests */}
        <div className="card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
            <h3 style={{ fontWeight: 700, fontSize: 16 }}>New Pickup Requests</h3>
            <Link href="/collector/requests" className="btn btn-ghost btn-sm">View All <ArrowRight size={14}/></Link>
          </div>
          {pendingRequests.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '24px', color: 'var(--muted)' }}>
              <div style={{ fontSize: 32, marginBottom: 8 }}>📭</div>
              <div>No pending requests</div>
            </div>
          ) : pendingRequests.slice(0, 3).map(r => (
            <div key={r.id} style={{ border: '1px solid var(--border)', borderRadius: 'var(--radius-sm)', padding: '14px', marginBottom: 10 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 }}>
                <div>
                  <div style={{ fontWeight: 700, fontSize: 14 }}>{r.pickup_code}</div>
                  <div style={{ fontSize: 12, color: 'var(--muted)' }}>{r.user_name} • {r.distance}</div>
                </div>
                <span className="badge badge-info">{r.estimated_weight} kg</span>
              </div>
              <div style={{ fontSize: 12, color: 'var(--muted)', marginBottom: 10 }}>{r.items.map(i => i.category).join(', ')}</div>
              <Link href="/collector/requests" className="btn btn-primary btn-sm w-full">View Requests</Link>
            </div>
          ))}
        </div>

        {/* Earnings Summary */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div className="card" style={{ background: 'linear-gradient(135deg, #16A34A, #0EA5E9)', color: 'white' }}>
            <h3 style={{ fontWeight: 700, marginBottom: 16 }}>Earnings Summary</h3>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
              {[['Today', '₹850'], ['This Week', '₹5,240'], ['This Month', '₹21,500'], ['Total', '₹1,28,000']].map(([l,v]) => (
                <div key={l} style={{ background: 'rgba(255,255,255,0.15)', borderRadius: 10, padding: '12px' }}>
                  <div style={{ opacity: 0.8, fontSize: 12, marginBottom: 4 }}>{l}</div>
                  <div style={{ fontWeight: 800, fontSize: 18 }}>{v}</div>
                </div>
              ))}
            </div>
            <Link href="/collector/earnings" className="btn btn-sm" style={{ background: 'rgba(255,255,255,0.2)', color: 'white', marginTop: 16 }}>View Earnings Details →</Link>
          </div>
          <div className="card">
            <h3 style={{ fontWeight: 700, fontSize: 15, marginBottom: 14 }}>Performance</h3>
            {[['Rating', '⭐ 4.8 / 5.0'], ['Acceptance Rate', '92%'], ['Completion Rate', '98%'], ['Total Pickups', '124']].map(([l,v]) => (
              <div key={l} style={{ display: 'flex', justifyContent: 'space-between', padding: '9px 0', borderBottom: '1px solid var(--bg)', fontSize: 14 }}>
                <span style={{ color: 'var(--muted)' }}>{l}</span><span style={{ fontWeight: 600 }}>{v}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
