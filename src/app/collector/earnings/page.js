'use client';
import DashboardLayout from '@/components/DashboardLayout';

export default function CollectorEarningsPage() {
  const recentPickups = [
    { code: 'SSP-2026-000121', date: '06 Oct 2026', kg: 9.8, earnings: '₹196', items: 'Plastic, Paper, Metal' },
    { code: 'SSP-2026-000118', date: '25 Sep 2026', kg: 7.6, earnings: '₹152', items: 'E-Waste, Glass' },
    { code: 'SSP-2026-000110', date: '20 Sep 2026', kg: 12.4, earnings: '₹248', items: 'Metal, Cardboard' },
    { code: 'SSP-2026-000105', date: '15 Sep 2026', kg: 5.2, earnings: '₹104', items: 'Paper, Plastic' },
  ];

  return (
    <DashboardLayout>
      <div className="page-header">
        <h1 className="page-title">My Earnings 💰</h1>
        <p className="page-subtitle">Your earnings from completed scrap pickups.</p>
      </div>

      <div className="stat-grid">
        {[
          { label: "Today's Earnings", value: '₹850', sub: '5 pickups', color: 'var(--primary)', bg: '#dcfce7' },
          { label: 'This Week', value: '₹5,240', sub: '28 pickups', color: 'var(--accent)', bg: '#e0f2fe' },
          { label: 'This Month', value: '₹21,500', sub: '124 pickups', color: '#8B5CF6', bg: '#ede9fe' },
          { label: 'Total Lifetime', value: '₹1,28,000', sub: 'All time', color: 'var(--warning)', bg: '#fef3c7' },
        ].map(s => (
          <div key={s.label} className="stat-card">
            <div className="stat-icon" style={{ background: s.bg, fontSize: 22 }}>💰</div>
            <div><div className="stat-value" style={{ color: s.color }}>{s.value}</div><div className="stat-label">{s.label}</div></div>
            <div style={{ fontSize: 12, color: 'var(--muted)' }}>{s.sub}</div>
          </div>
        ))}
      </div>

      {/* Earnings Chart Placeholder */}
      <div className="card" style={{ marginBottom: 24 }}>
        <h3 style={{ fontWeight: 700, fontSize: 16, marginBottom: 16 }}>Monthly Earnings Trend</h3>
        <div style={{ display: 'flex', alignItems: 'flex-end', gap: 8, height: 140 }}>
          {[65, 80, 45, 90, 70, 100, 85, 95, 60, 75, 88, 92].map((h, i) => (
            <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
              <div style={{ width: '100%', height: `${h}%`, background: 'linear-gradient(180deg, var(--primary), var(--secondary))', borderRadius: '4px 4px 0 0', minHeight: 4, transition: 'height 0.3s ease' }} />
              <div style={{ fontSize: 9, color: 'var(--muted)' }}>{['J','F','M','A','M','J','J','A','S','O','N','D'][i]}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="card">
        <h3 style={{ fontWeight: 700, fontSize: 16, marginBottom: 20 }}>Recent Earnings</h3>
        <div className="table-wrapper">
          <table className="data-table">
            <thead><tr><th>Pickup ID</th><th>Date</th><th>Items</th><th>Weight</th><th>Earnings</th><th>Status</th></tr></thead>
            <tbody>
              {recentPickups.map(p => (
                <tr key={p.code}>
                  <td><span style={{ fontFamily: 'monospace', fontWeight: 600 }}>{p.code}</span></td>
                  <td>{p.date}</td>
                  <td style={{ color: 'var(--muted)', fontSize: 13 }}>{p.items}</td>
                  <td>{p.kg} kg</td>
                  <td style={{ fontWeight: 700, color: 'var(--primary)' }}>{p.earnings}</td>
                  <td><span className="badge badge-success">Paid</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </DashboardLayout>
  );
}
