'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { Leaf, Eye, EyeOff } from 'lucide-react';
import { useApp } from '@/context/AppContext';
import { Suspense } from 'react';

function RegisterForm() {
  const searchParams = useSearchParams();
  const defaultRole = searchParams.get('role') || 'user';
  const [role, setRole] = useState(defaultRole);
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    name: '', email: '', phone: '', password: '', confirmPassword: '',
    address: '', city: '', pincode: '',
    vehicle_type: '', vehicle_number: '', license_number: '',
  });
  const [errors, setErrors] = useState({});
  const { register, showToast } = useApp();
  const router = useRouter();

  const update = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const validate = () => {
    const e = {};
    if (!form.name.trim()) e.name = 'Name is required';
    if (!form.email.includes('@')) e.email = 'Valid email required';
    if (form.phone.length < 10) e.phone = 'Valid phone required';
    if (form.password.length < 6) e.password = 'Min 6 characters';
    if (form.password !== form.confirmPassword) e.confirmPassword = 'Passwords do not match';
    return e;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setLoading(true);
    await new Promise(r => setTimeout(r, 700));
    const result = register({ ...form, role });
    setLoading(false);
    showToast(`Account created successfully! Welcome, ${result.user.name}! 🎉`);
    router.push(`/${role}/dashboard`);
  };

  const Field = ({ label, name, type = 'text', placeholder, half }) => (
    <div className="form-group" style={half ? { gridColumn: 'span 1' } : {}}>
      <label className="form-label">{label}</label>
      <input className="form-input" type={type} placeholder={placeholder}
        value={form[name]} onChange={e => update(name, e.target.value)} />
      {errors[name] && <span className="form-error">{errors[name]}</span>}
    </div>
  );

  return (
    <div className="auth-page" style={{ paddingTop: 60, paddingBottom: 60 }}>
      <div className="auth-card" style={{ maxWidth: 560 }}>
        <Link href="/" className="auth-logo"><Leaf size={24} /> SmartScrap</Link>
        <h1 className="auth-title">Create your account</h1>
        <p className="auth-sub">Join thousands of recyclers earning rewards</p>

        <div className="role-tabs" style={{ marginBottom: 24 }}>
          {[{ v:'user', l:'👤 I want to Recycle' }, { v:'collector', l:'🚚 I want to Collect' }].map(r => (
            <button key={r.v} className={`role-tab${role === r.v ? ' active' : ''}`} onClick={() => setRole(r.v)}>{r.l}</button>
          ))}
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div className="form-grid">
            <Field label="Full Name" name="name" placeholder="Rahul Sharma" />
            <Field label="Email Address" name="email" type="email" placeholder="rahul@example.com" />
            <Field label="Phone Number" name="phone" type="tel" placeholder="9876543210" />
            {role === 'user' && <Field label="City" name="city" placeholder="Mumbai" />}
            {role === 'collector' && <div className="form-group">
              <label className="form-label">Vehicle Type</label>
              <select className="form-select" value={form.vehicle_type} onChange={e => update('vehicle_type', e.target.value)}>
                <option value="">Select Vehicle</option>
                <option value="Bike">Bike</option>
                <option value="Auto">Auto Rickshaw</option>
                <option value="Mini Truck">Mini Truck</option>
                <option value="Van">Van</option>
              </select>
            </div>}
            {role === 'collector' && <Field label="Vehicle Number" name="vehicle_number" placeholder="MH12AB1234" />}
          </div>

          {role === 'user' && (
            <div className="form-grid">
              <Field label="Address" name="address" placeholder="12, Green Park Colony" />
              <Field label="Pincode" name="pincode" placeholder="400001" />
            </div>
          )}

          {role === 'collector' && (
            <Field label="License Number" name="license_number" placeholder="MH2020123456" />
          )}

          <div className="form-grid">
            <div className="form-group">
              <label className="form-label">Password</label>
              <div style={{ position: 'relative' }}>
                <input className="form-input" type={showPass ? 'text' : 'password'} placeholder="Min. 6 characters"
                  value={form.password} onChange={e => update('password', e.target.value)} style={{ paddingRight: 44 }} />
                <button type="button" onClick={() => setShowPass(!showPass)}
                  style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--muted)' }}>
                  {showPass ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              {errors.password && <span className="form-error">{errors.password}</span>}
            </div>
            <div className="form-group">
              <label className="form-label">Confirm Password</label>
              <input className="form-input" type="password" placeholder="Repeat password"
                value={form.confirmPassword} onChange={e => update('confirmPassword', e.target.value)} />
              {errors.confirmPassword && <span className="form-error">{errors.confirmPassword}</span>}
            </div>
          </div>

          <button type="submit" className="btn btn-primary btn-lg w-full" disabled={loading}>
            {loading ? 'Creating account...' : `Create ${role === 'collector' ? 'Collector' : 'User'} Account →`}
          </button>
        </form>
        <div className="auth-footer">
          Already have an account? <Link href="/login">Sign in</Link>
        </div>
      </div>
    </div>
  );
}

export default function RegisterPage() {
  return <Suspense><RegisterForm /></Suspense>;
}
