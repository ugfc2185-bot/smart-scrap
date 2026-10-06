'use client';
import { use, useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { Phone, MessageCircle, ArrowLeft, Navigation } from 'lucide-react';
import DashboardLayout from '@/components/DashboardLayout';
import { useApp } from '@/context/AppContext';

// Simple canvas-based animated map
function TrackingMap({ collectorPos, userPos, arrived }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const w = canvas.width, h = canvas.height;

    ctx.clearRect(0, 0, w, h);

    // Background
    const grad = ctx.createLinearGradient(0, 0, w, h);
    grad.addColorStop(0, '#dcfce7');
    grad.addColorStop(1, '#e0f2fe');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, w, h);

    // Grid lines
    ctx.strokeStyle = 'rgba(0,0,0,0.06)';
    ctx.lineWidth = 1;
    for (let i = 0; i < w; i += 40) { ctx.beginPath(); ctx.moveTo(i, 0); ctx.lineTo(i, h); ctx.stroke(); }
    for (let i = 0; i < h; i += 40) { ctx.beginPath(); ctx.moveTo(0, i); ctx.lineTo(w, i); ctx.stroke(); }

    // Road-like lines
    ctx.strokeStyle = 'rgba(255,255,255,0.7)';
    ctx.lineWidth = 12;
    ctx.beginPath(); ctx.moveTo(0, h / 2); ctx.lineTo(w, h / 2); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(w / 2, 0); ctx.lineTo(w / 2, h); ctx.stroke();

    // Route line
    const ux = w * userPos.x, uy = h * userPos.y;
    const cx = w * collectorPos.x, cy = h * collectorPos.y;
    ctx.strokeStyle = '#16A34A';
    ctx.lineWidth = 3;
    ctx.setLineDash([8, 6]);
    ctx.beginPath(); ctx.moveTo(ux, uy); ctx.lineTo(cx, cy); ctx.stroke();
    ctx.setLineDash([]);

    // User marker
    ctx.fillStyle = '#0EA5E9';
    ctx.beginPath(); ctx.arc(ux, uy, 14, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = 'white';
    ctx.font = 'bold 16px Arial';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('🏠', ux, uy);

    // Collector marker
    ctx.fillStyle = arrived ? '#22C55E' : '#16A34A';
    ctx.beginPath(); ctx.arc(cx, cy, 16, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = 'white';
    ctx.font = 'bold 18px Arial';
    ctx.fillText('🚚', cx, cy);

    // Labels
    ctx.fillStyle = '#0F172A';
    ctx.font = 'bold 11px Arial';
    ctx.fillText('You', ux, uy + 28);
    ctx.fillText('Collector', cx, cy + 32);
  }, [collectorPos, userPos, arrived]);

  return <canvas ref={canvasRef} width={600} height={340} style={{ width: '100%', height: 'auto', borderRadius: 'var(--radius-sm)' }} />;
}

export default function TrackPickupPage({ params }) {
  const { id } = use(params);
  const { pickups, updatePickupStatus } = useApp();
  const router = useRouter();
  const pickup = pickups.find(p => String(p.id) === String(id));

  // Demo: collector position starts far and moves toward user
  const USER_POS = { x: 0.6, y: 0.5 };
  const START_POS = { x: 0.1, y: 0.2 };
  const [collectorPos, setCollectorPos] = useState(START_POS);
  const [eta, setEta] = useState(10);
  const [distance, setDistance] = useState('4.2 km');
  const [status, setStatus] = useState('moving');
  const [demoStarted, setDemoStarted] = useState(false);
  const intervalRef = useRef(null);

  const startDemo = () => {
    setDemoStarted(true);
    updatePickupStatus(Number(id), 'on_the_way');
    let step = 0;
    const STEPS = 10;
    intervalRef.current = setInterval(() => {
      step++;
      const t = step / STEPS;
      const nx = START_POS.x + (USER_POS.x - START_POS.x) * t;
      const ny = START_POS.y + (USER_POS.y - START_POS.y) * t;
      setCollectorPos({ x: nx, y: ny });
      const remaining = Math.max(0, 10 - step);
      setEta(remaining);
      const km = ((1 - t) * 4.2).toFixed(1);
      setDistance(remaining === 0 ? 'Arrived!' : `${km} km`);
      if (step >= STEPS) {
        clearInterval(intervalRef.current);
        setStatus('arrived');
        updatePickupStatus(Number(id), 'arrived');
      }
    }, 1500);
  };

  useEffect(() => () => clearInterval(intervalRef.current), []);

  if (!pickup) {
    return (
      <DashboardLayout>
        <div className="empty-state">
          <div className="empty-state-icon">❌</div>
          <h3>Pickup not found</h3>
          <p>This pickup does not exist or has not been accepted yet.</p>
          <button onClick={() => router.back()} className="btn btn-primary">Go Back</button>
        </div>
      </DashboardLayout>
    );
  }

  const arrived = status === 'arrived';

  return (
    <DashboardLayout>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 24 }}>
        <button onClick={() => router.back()} className="btn btn-secondary btn-sm"><ArrowLeft size={16} /></button>
        <div>
          <h1 className="page-title" style={{ margin: 0 }}>Live Tracking</h1>
          <p className="page-subtitle" style={{ margin: 0 }}>{pickup.pickup_code}</p>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: 24 }}>
        {/* MAP */}
        <div>
          <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
            <div style={{ padding: '16px 20px', borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ fontWeight: 700 }}>Live Map</div>
              <span className="badge badge-success">● Live</span>
            </div>
            <div style={{ padding: '16px' }}>
              <TrackingMap collectorPos={collectorPos} userPos={USER_POS} arrived={arrived} />
            </div>
          </div>

          {/* Demo Start Button */}
          {!demoStarted && (
            <div className="card" style={{ marginTop: 16, background: 'var(--primary-light)', border: '1px solid var(--primary)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                <div style={{ fontSize: 32 }}>🎬</div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 700, color: 'var(--primary)' }}>Demo Mode</div>
                  <div style={{ fontSize: 13, color: 'var(--muted)' }}>Click to simulate the collector moving toward your location in real-time.</div>
                </div>
                <button onClick={startDemo} className="btn btn-primary">
                  <Navigation size={16} /> Start Demo
                </button>
              </div>
            </div>
          )}
        </div>

        {/* SIDE INFO */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {/* Status */}
          <div className="card" style={{ textAlign: 'center', background: arrived ? 'linear-gradient(135deg,#16A34A,#22C55E)' : 'linear-gradient(135deg,#0EA5E9,#16A34A)', color: 'white' }}>
            <div style={{ fontSize: 36, marginBottom: 8 }}>{arrived ? '🎉' : '🚚'}</div>
            <div style={{ fontSize: 18, fontWeight: 700, marginBottom: 4 }}>
              {arrived ? 'Collector Arrived!' : demoStarted ? 'On The Way' : 'Waiting for collector'}
            </div>
            {!arrived && demoStarted && (
              <>
                <div style={{ fontSize: 36, fontWeight: 800, margin: '8px 0' }}>{eta} min</div>
                <div style={{ opacity: 0.85, fontSize: 14 }}>{distance} away</div>
              </>
            )}
            {arrived && <div style={{ opacity: 0.85 }}>Your collector is at your door</div>}
          </div>

          {/* Collector Info */}
          <div className="card">
            <h3 style={{ fontWeight: 700, marginBottom: 14 }}>Your Collector</h3>
            <div style={{ display: 'flex', align: 'center', gap: 12, marginBottom: 16 }}>
              <div className="avatar" style={{ width: 48, height: 48, fontSize: 20 }}>A</div>
              <div>
                <div style={{ fontWeight: 700 }}>Amit Kumar</div>
                <div style={{ fontSize: 13, color: 'var(--muted)' }}>⭐ 4.8 • Bike • MH12AB1234</div>
                <div style={{ fontSize: 13, color: 'var(--muted)' }}>124 pickups completed</div>
              </div>
            </div>
            <div style={{ display: 'flex', gap: 8 }}>
              <button className="btn btn-primary btn-sm" style={{ flex: 1 }}>
                <Phone size={14} /> Call
              </button>
              <button className="btn btn-secondary btn-sm" style={{ flex: 1 }}>
                <MessageCircle size={14} /> Message
              </button>
            </div>
          </div>

          {/* Pickup Summary */}
          <div className="card">
            <h3 style={{ fontWeight: 700, marginBottom: 14 }}>Pickup Summary</h3>
            {[
              ['Pickup ID', pickup.pickup_code],
              ['Date', pickup.scheduled_date],
              ['Time', pickup.time_slot],
              ['Est. Weight', `${pickup.estimated_weight || '—'} kg`],
              ['Est. Points', `~${pickup.estimated_points || 0} pts`],
            ].map(([l, v]) => (
              <div key={l} style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid var(--bg)', fontSize: 13 }}>
                <span style={{ color: 'var(--muted)' }}>{l}</span>
                <span style={{ fontWeight: 600 }}>{v}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
