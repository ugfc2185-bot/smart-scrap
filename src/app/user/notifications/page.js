'use client';
import DashboardLayout from '@/components/DashboardLayout';
import { useApp } from '@/context/AppContext';

export default function NotificationsPage() {
  const { notifications, markNotificationRead, markAllRead, unreadCount } = useApp();

  const timeAgo = (dt) => {
    const d = new Date(dt), now = new Date();
    const m = Math.floor((now - d) / 60000);
    if (m < 60) return `${m} min ago`;
    if (m < 1440) return `${Math.floor(m/60)} hours ago`;
    return `${Math.floor(m/1440)} days ago`;
  };

  const icons = { success: '✅', info: 'ℹ️', warning: '⚠️' };
  const colors = { success: 'var(--success-light)', info: 'var(--accent-light)', warning: 'var(--warning-light)' };

  return (
    <DashboardLayout>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <div>
          <h1 className="page-title">Notifications</h1>
          <p className="page-subtitle">{unreadCount} unread notification{unreadCount !== 1 ? 's' : ''}</p>
        </div>
        {unreadCount > 0 && (
          <button onClick={markAllRead} className="btn btn-secondary btn-sm">Mark All Read</button>
        )}
      </div>

      <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
        {notifications.length === 0 ? (
          <div className="empty-state"><div className="empty-state-icon">🔔</div><h3>No notifications</h3><p>You're all caught up!</p></div>
        ) : notifications.map(n => (
          <div key={n.id} onClick={() => markNotificationRead(n.id)}
            style={{ display: 'flex', gap: 16, padding: '18px 20px', borderBottom: '1px solid var(--bg)', cursor: 'pointer', background: !n.is_read ? colors[n.type] || 'var(--primary-light)' : 'white', transition: 'background 0.15s', borderLeft: !n.is_read ? '4px solid var(--primary)' : '4px solid transparent' }}>
            <div style={{ width: 44, height: 44, borderRadius: '50%', background: colors[n.type] || 'var(--bg)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22, flexShrink: 0 }}>
              {icons[n.type] || '🔔'}
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: n.is_read ? 500 : 700, fontSize: 14, marginBottom: 3 }}>{n.title}</div>
              <div style={{ fontSize: 13, color: 'var(--muted)' }}>{n.message}</div>
              <div style={{ fontSize: 11, color: 'var(--muted)', marginTop: 6 }}>{timeAgo(n.created_at)}</div>
            </div>
            {!n.is_read && <div style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--primary)', flexShrink: 0, marginTop: 6 }} />}
          </div>
        ))}
      </div>
    </DashboardLayout>
  );
}
