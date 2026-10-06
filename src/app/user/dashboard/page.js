'use client';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Truck, Package, TrendingUp, Gift, Leaf, ArrowRight, Clock, CheckCircle, AlertCircle, Star } from 'lucide-react';
import DashboardLayout from '@/components/DashboardLayout';
import { useApp } from '@/context/AppContext';

function StatusBadge({ status }) {
  const map = {
    requested: ['Requested', 'badge-gray'],
    assigned: ['Assigned', 'badge-info'],
    on_the_way: ['On The Way', 'badge-purple'],
    arrived: ['Arrived', 'badge-warning'],
    in_progress: ['In Progress', 'badge-warning'],
    completed: ['Completed', 'badge-success'],
    cancelled: ['Cancelled', 'badge-danger'],
  };
  const [label, cls] = map[status] || ['Unknown', 'badge-gray'];
  return <span className={`badge ${cls}`}>{label}</span>;
}

export default function UserDashboard() {
  const { user, pickups, wallet } = useApp();
  const router = useRouter();

  const userPickups = pickups.filter(p => p.user_id === user?.id || true); // show all for demo
  const completed = userPickups.filter(p => p.status === 'completed');
  const totalKg = completed.reduce((s, p) => s + (p.actual_weight || p.estimated_weight || 0), 0);
  const upcoming = userPickups.filter(p => !['completed','cancelled'].includes(p.status));

  const stats = [
    { icon: <Package size={22} />, bg: '#dcfce7', color: 'var(--primary)', label: 'Total Pickups', value: userPickups.length, change: '+2 this month' },
    { icon: <Leaf size={22} />, bg: '#e0f2fe', color: 'var(--accent)', label: 'Scrap Recycled', value: `${totalKg.toFixed(1)} kg`, change: '+9.8 kg this month' },
    { icon: <TrendingUp size={22} />, bg: '#ede9fe', color: '#8B5CF6', label: 'Total Points', value: wallet.total_earned.toLocaleString(), change: '+93 this week' },
    { icon: <Gift size={22} />, bg: '#fef3c7', color: 'var(--warning)', label: 'Reward Balance', value: `₹${Math.floor(wallet.balance / 5)}`, change: `${wallet.balance} pts` },
  ];

  const achievements = [
    { icon: '🌱', label: 'First Pickup', earned: true },
    { icon: '🔟', label: '10 Pickups', earned: userPickups.length >= 10 },
    { icon: '⚖️', label: '50 kg Recycled', earned: totalKg >= 50 },
    { icon: '🏆', label: 'Eco Champion', earned: totalKg >= 100 },
  ];

  const timeAgo = (dt) => {
    const d = new Date(dt), now = new Date();
    const days = Math.floor((now - d) / 86400000);
    if (days === 0) return 'Today';
    if (days === 1) return 'Yesterday';
    return `${days} days ago`;
  };

  return (
    <DashboardLayout>
      <div className="page-header">
        <h1 className="page-title">Welcome back, {user?.name?.split(' ')[0]}! 👋</h1>
        <p className="page-subtitle">Here's your recycling impact and upcoming pickups.</p>
      </div>

      {/* STAT CARDS */}
      <div className="stat-grid">
        {stats.map((s) => (
          <div key={s.label} className="stat-card">
            <div className="stat-icon" style={{ background: s.bg, color: s.color }}>{s.icon}</div>
            <div>
              <div className="stat-value">{s.value}</div>
              <div className="stat-label">{s.label}</div>
            </div>
            <div className="stat-change up">{s.change}</div>
          </div>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>
        {/* UPCOMING PICKUPS */}
        <div className="card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
            <h3 style={{ fontWeight: 700, fontSize: 16 }}>Upcoming Pickups</h3>
            <Link href="/user/pickups" className="btn btn-ghost btn-sm">View All <ArrowRight size={14} /></Link>
          </div>
          {upcoming.length === 0 ? (
            <div className="empty-state" style={{ padding: '32px 16px' }}>
              <div className="empty-state-icon">📦</div>
              <h3>No upcoming pickups</h3>
              <p>Schedule your first scrap pickup and start earning!</p>
              <Link href="/user/schedule-pickup" className="btn btn-primary btn-sm">Schedule Pickup</Link>
            </div>
          ) : upcoming.map(p => (
            <div key={p.id} style={{ padding: '14px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border)', marginBottom: 10 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div>
                  <div style={{ fontWeight: 600, fontSize: 14 }}>{p.pickup_code}</div>
                  <div style={{ fontSize: 13, color: 'var(--muted)', marginTop: 2 }}>{p.time_slot} • {p.scheduled_date}</div>
                </div>
                <StatusBadge status={p.status} />
              </div>
              <div style={{ marginTop: 10, display: 'flex', gap: 8 }}>
                <Link href={`/user/pickups/${p.id}`} className="btn btn-secondary btn-sm">Details</Link>
                {['assigned','on_the_way'].includes(p.status) && (
                  <Link href={`/user/track/${p.id}`} className="btn btn-primary btn-sm"><Truck size={14} /> Track</Link>
                )}
              </div>
            </div>
          ))}
          <Link href="/user/schedule-pickup" className="btn btn-primary w-full" style={{ marginTop: 12 }}>
            + Schedule New Pickup
          </Link>
        </div>

        {/* RIGHT COLUMN */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          {/* ENV IMPACT */}
          <div className="card" style={{ background: 'linear-gradient(135deg, #f0fdf4, #e0f2fe)' }}>
            <h3 style={{ fontWeight: 700, fontSize: 16, marginBottom: 16 }}>🌍 Your Environmental Impact</h3>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              {[
                { icon: '🧴', label: 'Plastic Saved', val: `${(totalKg * 0.3).toFixed(1)} kg` },
                { icon: '📄', label: 'Paper Saved', val: `${(totalKg * 0.2).toFixed(1)} kg` },
                { icon: '💨', label: 'CO₂ Reduced', val: `${(totalKg * 1.5).toFixed(1)} kg` },
                { icon: '🌳', label: 'Trees Equiv.', val: `${(totalKg * 0.05).toFixed(1)}` },
              ].map(e => (
                <div key={e.label} style={{ background: 'white', borderRadius: 'var(--radius-sm)', padding: '12px', textAlign: 'center' }}>
                  <div style={{ fontSize: 22, marginBottom: 4 }}>{e.icon}</div>
                  <div style={{ fontWeight: 700, fontSize: 16 }}>{e.val}</div>
                  <div style={{ fontSize: 11, color: 'var(--muted)' }}>{e.label}</div>
                </div>
              ))}
            </div>
          </div>

          {/* ACHIEVEMENTS */}
          <div className="card">
            <h3 style={{ fontWeight: 700, fontSize: 16, marginBottom: 16 }}>🏅 Achievements</h3>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
              {achievements.map(a => (
                <div key={a.label} style={{ padding: '12px', borderRadius: 'var(--radius-sm)', border: `2px solid ${a.earned ? 'var(--primary)' : 'var(--border)'}`, background: a.earned ? 'var(--primary-light)' : 'var(--bg)', textAlign: 'center', opacity: a.earned ? 1 : 0.5 }}>
                  <div style={{ fontSize: 24, marginBottom: 4 }}>{a.icon}</div>
                  <div style={{ fontSize: 12, fontWeight: 600, color: a.earned ? 'var(--primary)' : 'var(--muted)' }}>{a.label}</div>
                </div>
              ))}
            </div>
          </div>

          {/* WALLET SUMMARY */}
          <div className="card" style={{ background: 'linear-gradient(135deg, var(--primary), var(--secondary))', color: 'white' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
              <h3 style={{ fontWeight: 700, fontSize: 16 }}>💰 Reward Wallet</h3>
              <Link href="/user/wallet" className="btn btn-sm" style={{ background: 'rgba(255,255,255,0.2)', color: 'white', borderRadius: 8 }}>View</Link>
            </div>
            <div style={{ fontSize: 36, fontWeight: 800, marginBottom: 4 }}>{wallet.balance.toLocaleString()}</div>
            <div style={{ fontSize: 14, opacity: 0.85 }}>points = ₹{Math.floor(wallet.balance/5)} in rewards</div>
            <Link href="/user/rewards" className="btn btn-sm" style={{ background: 'white', color: 'var(--primary)', marginTop: 16, fontWeight: 700 }}>
              Redeem Rewards <ArrowRight size={14} />
            </Link>
          </div>
        </div>
      </div>

      {/* RECENT PICKUPS */}
      <div className="card" style={{ marginTop: 24 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
          <h3 style={{ fontWeight: 700, fontSize: 16 }}>Recent Pickups</h3>
          <Link href="/user/pickups" className="btn btn-ghost btn-sm">View All <ArrowRight size={14}/></Link>
        </div>
        <div className="table-wrapper">
          <table className="data-table">
            <thead>
              <tr>
                <th>Pickup ID</th><th>Date</th><th>Collector</th><th>Weight</th><th>Points</th><th>Status</th><th>Action</th>
              </tr>
            </thead>
            <tbody>
              {userPickups.slice(0, 5).map(p => (
                <tr key={p.id}>
                  <td><span style={{ fontFamily: 'monospace', fontWeight: 600 }}>{p.pickup_code}</span></td>
                  <td>{p.scheduled_date}</td>
                  <td>{p.collector_name || '—'}</td>
                  <td>{p.actual_weight || p.estimated_weight || '—'} kg</td>
                  <td style={{ color: 'var(--primary)', fontWeight: 700 }}>{p.final_points ? `+${p.final_points}` : p.estimated_points ? `~${p.estimated_points}` : '—'}</td>
                  <td><StatusBadge status={p.status} /></td>
                  <td><Link href={`/user/pickups/${p.id}`} className="btn btn-secondary btn-sm">View</Link></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </DashboardLayout>
  );
}
