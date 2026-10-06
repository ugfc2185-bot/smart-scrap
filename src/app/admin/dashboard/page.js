'use client';
import Link from 'next/link';
import { Users, Truck, Package, TrendingUp, Leaf, BarChart2, ArrowRight } from 'lucide-react';
import DashboardLayout from '@/components/DashboardLayout';
import { ADMIN_STATS, WASTE_CATEGORIES } from '@/lib/mockData';

export default function AdminDashboard() {
  const stats = [
    { icon: <Users size={22}/>, label: 'Total Users', value: ADMIN_STATS.total_users.toLocaleString(), bg: '#dcfce7', color: 'var(--primary)', link: '/admin/users' },
    { icon: <Truck size={22}/>, label: 'Active Collectors', value: ADMIN_STATS.total_collectors.toLocaleString(), bg: '#e0f2fe', color: 'var(--accent)', link: '/admin/collectors' },
    { icon: <Package size={22}/>, label: 'Total Pickups', value: ADMIN_STATS.total_pickups.toLocaleString(), bg: '#ede9fe', color: '#8B5CF6', link: '/admin/pickups' },
    { icon: <Leaf size={22}/>, label: 'KG Recycled', value: `${(ADMIN_STATS.kg_recycled/1000).toFixed(1)}K`, bg: '#fef3c7', color: 'var(--warning)', link: '/admin/analytics' },
    { icon: <TrendingUp size={22}/>, label: 'Points Distributed', value: `${(ADMIN_STATS.points_distributed/1000).toFixed(0)}K`, bg: '#fee2e2', color: 'var(--danger)', link: '/admin/transactions' },
    { icon: <BarChart2 size={22}/>, label: 'Active Pickups', value: ADMIN_STATS.active_pickups, bg: '#dcfce7', color: 'var(--primary)', link: '/admin/pickups' },
  ];

  const recentUsers = [
    { name: 'Rahul Sharma', email: 'rahul@email.com', pickups: 24, points: 1245, status: 'Active', joined: 'Jan 2026' },
    { name: 'Priya Patel', email: 'priya@email.com', pickups: 12, points: 580, status: 'Active', joined: 'Feb 2026' },
    { name: 'Aman Verma', email: 'aman@email.com', pickups: 8, points: 320, status: 'Active', joined: 'Mar 2026' },
  ];

  return (
    <DashboardLayout>
      <div className="page-header">
        <h1 className="page-title">Admin Dashboard ⚙️</h1>
        <p className="page-subtitle">Platform-wide overview and management tools.</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 20, marginBottom: 28 }}>
        {stats.map(s => (
          <Link href={s.link} key={s.label} className="stat-card" style={{ display:'flex', flexDirection:'column', gap:12, textDecoration:'none', cursor:'pointer' }}>
            <div className="stat-icon" style={{ background: s.bg, color: s.color }}>{s.icon}</div>
            <div><div className="stat-value">{s.value}</div><div className="stat-label">{s.label}</div></div>
            <div style={{ color: s.color, fontSize: 12, display:'flex', gap:4, alignItems:'center' }}>Manage <ArrowRight size={12}/></div>
          </Link>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24, marginBottom: 24 }}>
        {/* Monthly Pickups Chart */}
        <div className="card">
          <h3 style={{ fontWeight: 700, fontSize: 16, marginBottom: 16 }}>Monthly Pickup Volume</h3>
          <div style={{ display: 'flex', alignItems: 'flex-end', gap: 6, height: 120 }}>
            {[40, 65, 55, 80, 75, 90, 85, 95, 70, 88, 92, 100].map((h, i) => (
              <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
                <div style={{ width: '100%', height: `${h}%`, background: 'linear-gradient(180deg, var(--primary), var(--secondary))', borderRadius: '4px 4px 0 0', minHeight: 4 }} />
                <div style={{ fontSize: 9, color: 'var(--muted)' }}>{['J','F','M','A','M','J','J','A','S','O','N','D'][i]}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Waste by Category */}
        <div className="card">
          <h3 style={{ fontWeight: 700, fontSize: 16, marginBottom: 16 }}>Waste by Category</h3>
          {[['Plastic', 32, 'var(--accent)'], ['Metal', 25, 'var(--muted)'], ['Paper', 20, 'var(--warning)'], ['E-Waste', 15, '#8B5CF6'], ['Others', 8, 'var(--primary)']].map(([name, pct, color]) => (
            <div key={name} style={{ marginBottom: 10 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, marginBottom: 4 }}>
                <span>{name}</span><span style={{ fontWeight: 600, color }}>{pct}%</span>
              </div>
              <div style={{ height: 6, background: 'var(--bg)', borderRadius: 3, overflow: 'hidden' }}>
                <div style={{ width: `${pct}%`, height: '100%', background: color, borderRadius: 3 }} />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Quick Actions */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 14, marginBottom: 24 }}>
        {[
          { label: 'Manage Users', href: '/admin/users', icon: '👤', color: 'var(--primary)' },
          { label: 'Waste Categories', href: '/admin/waste-categories', icon: '♻️', color: 'var(--accent)' },
          { label: 'Manage Rewards', href: '/admin/rewards', icon: '🎁', color: '#8B5CF6' },
          { label: 'Analytics', href: '/admin/analytics', icon: '📊', color: 'var(--warning)' },
        ].map(a => (
          <Link href={a.href} key={a.label} style={{ background: 'white', borderRadius: 'var(--radius)', padding: '18px', textAlign: 'center', boxShadow: 'var(--shadow)', border: '1px solid var(--border)', textDecoration: 'none', transition: 'transform 0.15s', display: 'block' }}>
            <div style={{ fontSize: 30, marginBottom: 8 }}>{a.icon}</div>
            <div style={{ fontSize: 13, fontWeight: 600, color: a.color }}>{a.label}</div>
          </Link>
        ))}
      </div>

      {/* Recent Users */}
      <div className="card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
          <h3 style={{ fontWeight: 700, fontSize: 16 }}>Recent Users</h3>
          <Link href="/admin/users" className="btn btn-ghost btn-sm">View All <ArrowRight size={14}/></Link>
        </div>
        <div className="table-wrapper">
          <table className="data-table">
            <thead><tr><th>Name</th><th>Email</th><th>Pickups</th><th>Points</th><th>Status</th><th>Actions</th></tr></thead>
            <tbody>
              {recentUsers.map(u => (
                <tr key={u.email}>
                  <td style={{ fontWeight: 600 }}>{u.name}</td>
                  <td style={{ color: 'var(--muted)', fontSize: 13 }}>{u.email}</td>
                  <td>{u.pickups}</td>
                  <td style={{ color: 'var(--primary)', fontWeight: 600 }}>{u.points}</td>
                  <td><span className="badge badge-success">{u.status}</span></td>
                  <td><button className="btn btn-secondary btn-sm">View</button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </DashboardLayout>
  );
}
