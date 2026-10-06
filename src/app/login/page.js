'use client';
import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Leaf, Eye, EyeOff, AlertCircle } from 'lucide-react';
import { useApp } from '@/context/AppContext';

export default function LoginPage() {
  const [form, setForm] = useState({ email: '', password: '', role: 'user' });
  const [showPass, setShowPass] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login, showToast } = useApp();
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    await new Promise(r => setTimeout(r, 600));
    const result = login(form.email, form.password, form.role);
    setLoading(false);
    if (result.success) {
      showToast(`Welcome back, ${result.user.name}! 👋`);
      if (result.user.role === 'user') router.push('/user/dashboard');
      else if (result.user.role === 'collector') router.push('/collector/dashboard');
      else if (result.user.role === 'admin') router.push('/admin/dashboard');
    } else {
      setError(result.error);
    }
  };

  const roles = [
    { value: 'user', label: '👤 User' },
    { value: 'collector', label: '🚚 Collector' },
    { value: 'admin', label: '⚙️ Admin' },
  ];

  const demoAccounts = [
    { role: 'user', email: 'user@smartscrap.com', password: 'User@123', color: 'var(--primary)' },
    { role: 'collector', email: 'collector@smartscrap.com', password: 'Collector@123', color: 'var(--accent)' },
    { role: 'admin', email: 'admin@smartscrap.com', password: 'Admin@123', color: 'var(--purple)' },
  ];

  return (
    <div className="auth-page">
      <div className="auth-card">
        <Link href="/" className="auth-logo">
          <Leaf size={24} /> SmartScrap
        </Link>
        <h1 className="auth-title">Welcome back!</h1>
        <p className="auth-sub">Sign in to your account to continue</p>

        {/* Role Selection */}
        <div className="role-tabs" style={{ marginBottom: 20 }}>
          {roles.map(r => (
            <button key={r.value} className={`role-tab${form.role === r.value ? ' active' : ''}`}
              onClick={() => setForm(f => ({ ...f, role: r.value }))}>
              {r.label}
            </button>
          ))}
        </div>

        {/* Demo credentials */}
        <div style={{ background: 'var(--bg)', borderRadius: 'var(--radius-sm)', padding: '12px 14px', marginBottom: 20 }}>
          <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--muted)', marginBottom: 8, textTransform: 'uppercase', letterSpacing: '0.06em' }}>Quick Demo Login</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            {demoAccounts.map(acc => (
              <button key={acc.role} onClick={() => setForm({ email: acc.email, password: acc.password, role: acc.role })}
                style={{ textAlign: 'left', padding: '8px 12px', borderRadius: 8, border: '1px solid var(--border)', background: 'white', cursor: 'pointer', fontSize: 13, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span>{acc.email}</span>
                <span style={{ background: acc.color, color: 'white', padding: '2px 8px', borderRadius: 100, fontSize: 11, fontWeight: 600, textTransform: 'capitalize' }}>{acc.role}</span>
              </button>
            ))}
          </div>
        </div>

        <form className="auth-form" onSubmit={handleSubmit}>
          {error && (
            <div style={{ background: 'var(--danger-light)', color: 'var(--danger)', padding: '12px 16px', borderRadius: 'var(--radius-sm)', display: 'flex', gap: 8, fontSize: 14, alignItems: 'center' }}>
              <AlertCircle size={16} />{error}
            </div>
          )}
          <div className="form-group">
            <label className="form-label">Email Address</label>
            <input className="form-input" type="email" placeholder="you@example.com" required
              value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} />
          </div>
          <div className="form-group">
            <label className="form-label">Password</label>
            <div style={{ position: 'relative' }}>
              <input className="form-input" type={showPass ? 'text' : 'password'} placeholder="••••••••" required
                value={form.password} onChange={e => setForm(f => ({ ...f, password: e.target.value }))}
                style={{ paddingRight: 44 }} />
              <button type="button" onClick={() => setShowPass(!showPass)}
                style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--muted)', background: 'none', border: 'none', cursor: 'pointer' }}>
                {showPass ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>
          <button type="submit" className="btn btn-primary w-full btn-lg" disabled={loading}>
            {loading ? 'Signing in...' : 'Sign In →'}
          </button>
        </form>

        <div className="auth-footer">
          Don't have an account? <Link href="/register">Create one free</Link>
        </div>
      </div>
    </div>
  );
}
