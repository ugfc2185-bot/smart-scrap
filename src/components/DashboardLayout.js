'use client';
import { useState, useEffect, useRef } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import { Leaf, LayoutDashboard, Calendar, Package, MapPin, Gift, Wallet, Bell, User, HelpCircle, LogOut, Menu, X, ChevronDown, Search } from 'lucide-react';
import { useApp } from '@/context/AppContext';

const userNav = [
  { href: '/user/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { href: '/user/schedule-pickup', icon: Calendar, label: 'Schedule Pickup' },
  { href: '/user/pickups', icon: Package, label: 'My Pickups' },
  { href: '/user/rewards', icon: Gift, label: 'Rewards' },
  { href: '/user/wallet', icon: Wallet, label: 'Wallet' },
  { href: '/user/notifications', icon: Bell, label: 'Notifications' },
  { href: '/user/profile', icon: User, label: 'Profile' },
  { href: '/user/help', icon: HelpCircle, label: 'Help & Support' },
];

const collectorNav = [
  { href: '/collector/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { href: '/collector/requests', icon: Bell, label: 'Pickup Requests' },
  { href: '/collector/pickups', icon: Package, label: 'My Pickups' },
  { href: '/collector/earnings', icon: Wallet, label: 'Earnings' },
  { href: '/collector/notifications', icon: Bell, label: 'Notifications' },
  { href: '/collector/profile', icon: User, label: 'Profile' },
];

const adminNav = [
  { href: '/admin/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { href: '/admin/users', icon: User, label: 'Users' },
  { href: '/admin/collectors', icon: Package, label: 'Collectors' },
  { href: '/admin/pickups', icon: Calendar, label: 'Pickups' },
  { href: '/admin/waste-categories', icon: Package, label: 'Waste Categories' },
  { href: '/admin/rewards', icon: Gift, label: 'Rewards' },
  { href: '/admin/analytics', icon: LayoutDashboard, label: 'Analytics' },
  { href: '/admin/settings', icon: HelpCircle, label: 'Settings' },
];

function NotifDropdown({ onClose }) {
  const { notifications, unreadCount, markNotificationRead, markAllRead } = useApp();
  const ref = useRef(null);

  useEffect(() => {
    const handler = (e) => { if (ref.current && !ref.current.contains(e.target)) onClose(); };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [onClose]);

  const timeAgo = (dt) => {
    const d = new Date(dt), now = new Date();
    const m = Math.floor((now - d) / 60000);
    if (m < 60) return `${m}m ago`;
    if (m < 1440) return `${Math.floor(m/60)}h ago`;
    return `${Math.floor(m/1440)}d ago`;
  };

  return (
    <div className="notif-dropdown" ref={ref}>
      <div className="notif-header">
        <span style={{ fontWeight: 700 }}>Notifications {unreadCount > 0 && <span className="badge badge-danger" style={{ marginLeft: 6 }}>{unreadCount}</span>}</span>
        {unreadCount > 0 && <button className="btn btn-ghost btn-sm" onClick={markAllRead}>Mark all read</button>}
      </div>
      <div style={{ maxHeight: 360, overflowY: 'auto' }}>
        {notifications.length === 0 ? (
          <div style={{ padding: '32px 20px', textAlign: 'center', color: 'var(--muted)', fontSize: 14 }}>No notifications</div>
        ) : notifications.map(n => (
          <div key={n.id} className={`notif-item${!n.is_read ? ' unread' : ''}`} onClick={() => markNotificationRead(n.id)}>
            <div className="notif-title">{n.title}</div>
            <div className="notif-msg">{n.message}</div>
            <div className="notif-time">{timeAgo(n.created_at)}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function DashboardLayout({ children, role: forcedRole }) {
  const { user, logout, unreadCount } = useApp();
  const router = useRouter();
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [showNotif, setShowNotif] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const userMenuRef = useRef(null);

  useEffect(() => {
    if (!user) { router.push('/login'); return; }
  }, [user, router]);

  useEffect(() => {
    const handler = (e) => { if (userMenuRef.current && !userMenuRef.current.contains(e.target)) setShowUserMenu(false); };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  if (!user) return null;

  const role = forcedRole || user.role;
  const navItems = role === 'admin' ? adminNav : role === 'collector' ? collectorNav : userNav;

  const handleLogout = () => {
    logout();
    router.push('/');
  };

  const roleColor = role === 'admin' ? 'var(--purple)' : role === 'collector' ? 'var(--accent)' : 'var(--primary)';
  const roleLabel = role === 'admin' ? '⚙️ Admin' : role === 'collector' ? '🚚 Collector' : '♻️ User';

  return (
    <div className="app-layout">
      {/* SIDEBAR */}
      <aside className={`sidebar${sidebarOpen ? ' open' : ''}`}>
        <div className="sidebar-logo">
          <Leaf size={22} />
          SmartScrap
        </div>

        {/* Role badge */}
        <div style={{ padding: '12px 16px', borderBottom: '1px solid var(--border)' }}>
          <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 4 }}>Logged in as</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <div className="avatar" style={{ width: 32, height: 32, fontSize: 13, background: roleColor }}>{user.name?.[0]}</div>
            <div>
              <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text)' }}>{user.name}</div>
              <div style={{ fontSize: 11, color: 'var(--muted)' }}>{roleLabel}</div>
            </div>
          </div>
        </div>

        <nav className="sidebar-nav">
          {navItems.map(({ href, icon: Icon, label }) => (
            <Link key={href} href={href}
              className={`sidebar-link${pathname === href ? ' active' : ''}`}
              onClick={() => setSidebarOpen(false)}>
              <Icon size={18} />
              {label}
              {label === 'Notifications' && unreadCount > 0 && (
                <span className="badge badge-danger" style={{ marginLeft: 'auto', fontSize: 10, padding: '2px 7px' }}>{unreadCount}</span>
              )}
            </Link>
          ))}
        </nav>

        <div style={{ padding: '12px', borderTop: '1px solid var(--border)' }}>
          <button className="sidebar-link danger w-full" onClick={handleLogout} style={{ width: '100%', justifyContent: 'flex-start' }}>
            <LogOut size={18} /> Logout
          </button>
        </div>
      </aside>

      {/* OVERLAY */}
      {sidebarOpen && (
        <div onClick={() => setSidebarOpen(false)}
          style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.4)', zIndex: 99 }} />
      )}

      {/* MAIN */}
      <div className="main-content">
        {/* TOPBAR */}
        <div className="topbar">
          <div className="topbar-left">
            <button className="btn-icon btn-secondary" onClick={() => setSidebarOpen(!sidebarOpen)}>
              <Menu size={20} />
            </button>
            <div className="topbar-search">
              <Search size={16} color="var(--muted)" />
              <input type="text" placeholder="Search..." />
            </div>
          </div>
          <div className="topbar-right">
            {/* Notifications */}
            <div style={{ position: 'relative' }}>
              <button className="topbar-btn" onClick={() => { setShowNotif(!showNotif); setShowUserMenu(false); }}>
                <Bell size={18} />
                {unreadCount > 0 && <span className="notif-badge">{unreadCount}</span>}
              </button>
              {showNotif && <NotifDropdown onClose={() => setShowNotif(false)} />}
            </div>

            {/* User menu */}
            <div style={{ position: 'relative' }} ref={userMenuRef}>
              <button style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '6px 10px', borderRadius: 'var(--radius-sm)', border: '1.5px solid var(--border)', background: 'white', cursor: 'pointer' }}
                onClick={() => setShowUserMenu(!showUserMenu)}>
                <div className="avatar" style={{ width: 30, height: 30, fontSize: 13, background: roleColor }}>{user.name?.[0]}</div>
                <span style={{ fontSize: 14, fontWeight: 600 }}>{user.name?.split(' ')[0]}</span>
                <ChevronDown size={14} color="var(--muted)" />
              </button>
              {showUserMenu && (
                <div style={{ position: 'absolute', top: 'calc(100% + 8px)', right: 0, background: 'white', border: '1px solid var(--border)', borderRadius: 'var(--radius-sm)', boxShadow: 'var(--shadow-md)', width: 180, overflow: 'hidden', zIndex: 200 }}>
                  <Link href={`/${role}/profile`} style={{ display: 'block', padding: '12px 16px', fontSize: 14, color: 'var(--text)', borderBottom: '1px solid var(--bg)' }} onClick={() => setShowUserMenu(false)}>
                    My Profile
                  </Link>
                  <button onClick={handleLogout} style={{ display: 'block', width: '100%', textAlign: 'left', padding: '12px 16px', fontSize: 14, color: 'var(--danger)', cursor: 'pointer' }}>
                    Logout
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* PAGE CONTENT */}
        <div className="page-content">{children}</div>
      </div>
    </div>
  );
}
