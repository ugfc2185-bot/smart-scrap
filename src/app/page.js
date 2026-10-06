'use client';
import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Leaf, Truck, Package, Gift, Recycle, ChevronRight, Star, Menu, X, ArrowRight, MapPin, CheckCircle } from 'lucide-react';
import { WASTE_CATEGORIES } from '@/lib/mockData';
import { useApp } from '@/context/AppContext';

function Navbar({ menuOpen, setMenuOpen }) {
  const { user } = useApp();
  const router = useRouter();

  const handleSchedule = () => {
    if (user) {
      router.push('/user/schedule-pickup');
    } else {
      router.push('/login');
    }
  };

  return (
    <nav className="nav">
      <Link href="/" className="nav-logo">
        <Leaf size={26} />
        SmartScrap
      </Link>
      <div className="nav-links">
        <Link href="/" className="nav-link">Home</Link>
        <Link href="/how-it-works" className="nav-link">How It Works</Link>
        <Link href="/rewards" className="nav-link">Rewards</Link>
        <Link href="/about" className="nav-link">About</Link>
      </div>
      <div className="nav-actions">
        {user ? (
          <>
            <Link href={`/${user.role}/dashboard`} className="btn btn-outline btn-sm">Dashboard</Link>
          </>
        ) : (
          <>
            <Link href="/login" className="btn btn-secondary btn-sm">Login</Link>
            <Link href="/register" className="btn btn-primary btn-sm">Get Started</Link>
          </>
        )}
        <button className="hamburger btn" onClick={() => setMenuOpen(!menuOpen)}>
          {menuOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>
    </nav>
  );
}

function MobileMenu({ open, onClose }) {
  const { user } = useApp();
  if (!open) return null;
  return (
    <div style={{ background: 'white', borderRadius: 'var(--radius)', padding: '16px', boxShadow: 'var(--shadow-lg)', marginBottom: '16px', border: '1px solid var(--border)' }}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        {[['/', 'Home'], ['/how-it-works', 'How It Works'], ['/rewards', 'Rewards'], ['/about', 'About']].map(([href, label]) => (
          <Link key={href} href={href} className="nav-link" onClick={onClose} style={{ display: 'block', padding: '10px 14px' }}>{label}</Link>
        ))}
        {user ? (
          <Link href={`/${user.role}/dashboard`} className="btn btn-primary" onClick={onClose}>Dashboard</Link>
        ) : (
          <>
            <Link href="/login" className="btn btn-secondary" onClick={onClose}>Login</Link>
            <Link href="/register" className="btn btn-primary" onClick={onClose}>Get Started</Link>
          </>
        )}
      </div>
    </div>
  );
}

export default function HomePage() {
  const [menuOpen, setMenuOpen] = useState(false);
  const { user } = useApp();
  const router = useRouter();

  const handleSchedule = () => {
    if (user) router.push('/user/schedule-pickup');
    else router.push('/login');
  };

  const features = [
    { icon: '📅', bg: '#dcfce7', title: 'Easy Scheduling', desc: 'Schedule a scrap pickup in under 2 minutes. Pick your date, time, and waste type.' },
    { icon: '🚚', bg: '#e0f2fe', title: 'Verified Collectors', desc: 'All collectors are background-verified and rated by the community.' },
    { icon: '📍', bg: '#ede9fe', title: 'Live Tracking', desc: 'Track your collector on a live map as they make their way to you.' },
    { icon: '⚖️', bg: '#fef3c7', title: 'Transparent Weighing', desc: 'Scrap is weighed in front of you. No guessing, no short-changing.' },
    { icon: '🏆', bg: '#fee2e2', title: 'Earn Points', desc: 'Automatically earn reward points based on the actual verified weight.' },
    { icon: '🎁', bg: '#dcfce7', title: 'Redeem Rewards', desc: 'Convert points to cash vouchers, groceries, or plant a tree.' },
  ];

  const howItWorks = [
    { num: 1, icon: '📱', title: 'Schedule Pickup', desc: 'Choose waste type, weight, address and time' },
    { num: 2, icon: '🚚', title: 'Collector Comes', desc: 'Verified collector accepts and arrives at your door' },
    { num: 3, icon: '⚖️', title: 'Scrap Weighed', desc: 'Actual weight measured and verified on the spot' },
    { num: 4, icon: '🎁', title: 'Earn Rewards', desc: 'Points credited instantly to your wallet' },
  ];

  return (
    <div className="landing">
      <div className="container">
        <Navbar menuOpen={menuOpen} setMenuOpen={setMenuOpen} />
        <MobileMenu open={menuOpen} onClose={() => setMenuOpen(false)} />

        {/* HERO */}
        <section className="hero">
          <div className="hero-left">
            <div className="hero-badge">
              <Leaf size={14} /> India's #1 Smart Scrap Platform
            </div>
            <h1 className="hero-title">
              Turn Your Scrap Into <span className="highlight">Rewards</span>
            </h1>
            <p className="hero-subtitle">
              Schedule a pickup, recycle responsibly, track your collector in real-time and earn reward points for every kilogram you recycle. Make sustainability rewarding.
            </p>
            <div className="hero-btns">
              <button onClick={handleSchedule} className="btn btn-primary btn-lg">
                <Truck size={20} /> Schedule Pickup
              </button>
              <Link href="/register?role=collector" className="btn btn-outline btn-lg">
                Become a Collector <ChevronRight size={20} />
              </Link>
            </div>
            <div className="hero-trust">
              <div className="trust-avatars">
                {['R','P','A','V','M'].map((l,i) => (
                  <div key={i} className="trust-avatar" style={{ marginLeft: i === 0 ? 0 : -8 }}>{l}</div>
                ))}
              </div>
              <div className="trust-text">
                <strong>10,000+</strong> happy recyclers across India
              </div>
            </div>
          </div>

          <div className="hero-right">
            <div className="hero-card-main">
              <div style={{ fontWeight: 700, fontSize: 16, marginBottom: 20, display: 'flex', alignItems: 'center', gap: 8 }}>
                <Recycle size={20} color="var(--primary)" /> How SmartScrap Works
              </div>
              <div className="hero-flow">
                {[
                  { icon: '📱', bg: '#dcfce7', title: 'Schedule Pickup', sub: 'Select waste type & time' },
                  { icon: '🚚', bg: '#e0f2fe', title: 'Collector Assigned', sub: 'Nearby verified collector' },
                  { icon: '⚖️', bg: '#fef3c7', title: 'Weighed & Verified', sub: 'Transparent weighing' },
                  { icon: '🏆', bg: '#ede9fe', title: 'Earn Points', sub: 'Instant wallet credit' },
                ].map((s, i) => (
                  <div key={i} className="flow-step">
                    <div className="flow-icon" style={{ background: s.bg }}>{s.icon}</div>
                    <div className="flow-text">
                      <strong>{s.title}</strong>
                      <span>{s.sub}</span>
                    </div>
                    {i < 3 && <ChevronRight size={16} className="flow-arrow" />}
                  </div>
                ))}
              </div>
            </div>

            <div className="floating-pill fp1">
              <CheckCircle size={16} color="var(--success)" />
              <span>+125 Points Earned!</span>
            </div>
            <div className="floating-pill fp2">
              <MapPin size={16} color="var(--accent)" />
              <span>Collector 2 km away</span>
            </div>
          </div>
        </section>

        {/* STATS */}
        <div className="stats-row">
          {[['10,000+','Users Registered'], ['500+','Active Collectors'], ['25K+','Successful Pickups'], ['50K+ kg','Waste Recycled']].map(([n,l]) => (
            <div key={l} className="stat-item">
              <div className="stat-num">{n}</div>
              <div className="stat-lbl">{l}</div>
            </div>
          ))}
        </div>
      </div>

      {/* FEATURES */}
      <section className="section" style={{ background: 'white' }}>
        <div className="container">
          <div className="section-center">
            <span className="section-tag">Why SmartScrap</span>
            <h2 className="section-title">Everything you need to recycle right</h2>
            <p className="section-sub">A complete ecosystem for responsible waste disposal that rewards you every step of the way.</p>
          </div>
          <div className="features-grid">
            {features.map((f) => (
              <div key={f.title} className="feature-card">
                <div className="feature-icon" style={{ background: f.bg }}>{f.icon}</div>
                <div className="feature-title">{f.title}</div>
                <div className="feature-desc">{f.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="section" id="how-it-works">
        <div className="container">
          <div className="section-center">
            <span className="section-tag">Simple Process</span>
            <h2 className="section-title">Recycle in 4 easy steps</h2>
            <p className="section-sub">From scheduling to rewards — the whole journey takes less than a day.</p>
          </div>
          <div className="steps-grid">
            {howItWorks.map((s) => (
              <div key={s.num} className="step-card card card-hover" style={{ textAlign: 'center' }}>
                <div className="step-num">{s.num}</div>
                <div className="step-icon">{s.icon}</div>
                <div className="step-title">{s.title}</div>
                <div className="step-desc">{s.desc}</div>
              </div>
            ))}
          </div>
          <div style={{ textAlign: 'center', marginTop: 40 }}>
            <Link href="/how-it-works" className="btn btn-outline btn-lg">
              Learn More <ArrowRight size={18} />
            </Link>
          </div>
        </div>
      </section>

      {/* WASTE CATEGORIES */}
      <section className="section" style={{ background: 'white' }} id="rewards">
        <div className="container">
          <div className="section-center">
            <span className="section-tag">Earn Points</span>
            <h2 className="section-title">What we collect & how much you earn</h2>
            <p className="section-sub">Every kilogram counts. Here's how many points you earn per kg for each waste type.</p>
          </div>
          <div className="waste-grid">
            {WASTE_CATEGORIES.map((c) => (
              <div key={c.id} className="waste-card">
                <div className="waste-emoji">{c.icon}</div>
                <div className="waste-info">
                  <div className="waste-name">{c.name}</div>
                  <div className="waste-pts">{c.points_per_kg} pts/kg</div>
                  <div style={{ fontSize: 12, color: 'var(--muted)', marginTop: 2 }}>{c.description}</div>
                </div>
                <div style={{ fontSize: 24, fontWeight: 800, color: 'var(--primary)' }}>{c.points_per_kg}</div>
              </div>
            ))}
          </div>
          <div style={{ textAlign: 'center', marginTop: 40 }}>
            <Link href="/rewards" className="btn btn-primary btn-lg">
              See All Rewards <Gift size={18} />
            </Link>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="section" style={{ background: 'linear-gradient(135deg, #16A34A, #0EA5E9)' }}>
        <div className="container" style={{ textAlign: 'center' }}>
          <div style={{ fontSize: 48, marginBottom: 16 }}>🌍</div>
          <h2 style={{ fontSize: 36, fontWeight: 800, color: 'white', marginBottom: 12 }}>Ready to make a difference?</h2>
          <p style={{ color: 'rgba(255,255,255,0.85)', fontSize: 18, marginBottom: 36 }}>Join 10,000+ recyclers who are earning rewards while saving the planet.</p>
          <div style={{ display: 'flex', gap: 16, justifyContent: 'center', flexWrap: 'wrap' }}>
            <button onClick={handleSchedule} className="btn btn-lg" style={{ background: 'white', color: 'var(--primary)', fontWeight: 700 }}>
              <Truck size={20} /> Schedule First Pickup
            </button>
            <Link href="/register?role=collector" className="btn btn-lg" style={{ border: '2px solid white', color: 'white' }}>
              Become a Collector
            </Link>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="footer">
        <div className="container">
          <div className="footer-grid">
            <div>
              <div className="footer-logo"><Leaf size={22} /> SmartScrap</div>
              <p className="footer-desc">Making responsible waste disposal convenient, transparent and rewarding. Join India's fastest growing eco-tech platform.</p>
            </div>
            <div>
              <div className="footer-heading">Platform</div>
              <div className="footer-links">
                <Link href="/how-it-works" className="footer-link">How It Works</Link>
                <Link href="/rewards" className="footer-link">Rewards</Link>
                <Link href="/about" className="footer-link">About Us</Link>
                <Link href="/login" className="footer-link">Login</Link>
              </div>
            </div>
            <div>
              <div className="footer-heading">For Users</div>
              <div className="footer-links">
                <Link href="/register" className="footer-link">Register</Link>
                <Link href="/user/schedule-pickup" className="footer-link">Schedule Pickup</Link>
                <Link href="/user/rewards" className="footer-link">My Rewards</Link>
                <Link href="/user/wallet" className="footer-link">Wallet</Link>
              </div>
            </div>
            <div>
              <div className="footer-heading">Company</div>
              <div className="footer-links">
                <Link href="/about" className="footer-link">About</Link>
                <Link href="/about#contact" className="footer-link">Contact</Link>
                <Link href="/about#privacy" className="footer-link">Privacy Policy</Link>
                <Link href="/about#terms" className="footer-link">Terms of Service</Link>
              </div>
            </div>
          </div>
          <div className="footer-bottom">
            <div>© 2026 SmartScrap. All rights reserved.</div>
            <div>Made with 💚 for a greener planet</div>
          </div>
        </div>
      </footer>
    </div>
  );
}
