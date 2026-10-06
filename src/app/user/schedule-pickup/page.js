'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Check, ChevronRight, ChevronLeft, MapPin, Calendar, Truck, CheckCircle } from 'lucide-react';
import DashboardLayout from '@/components/DashboardLayout';
import { useApp } from '@/context/AppContext';
import { WASTE_CATEGORIES } from '@/lib/mockData';

const STEPS = ['Waste Type', 'Quantity', 'Address', 'Schedule', 'Confirm'];
const TIME_SLOTS = ['9 AM – 12 PM', '12 PM – 3 PM', '3 PM – 6 PM', '6 PM – 8 PM'];

export default function SchedulePickupPage() {
  const { user, schedulePickup, showToast } = useApp();
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [done, setDone] = useState(false);
  const [pickupCode, setPickupCode] = useState('');
  const [loading, setLoading] = useState(false);

  // Step 1 - Waste type
  const [selected, setSelected] = useState([]);
  // Step 2 - Quantities
  const [quantities, setQuantities] = useState({});
  // Step 3 - Address
  const [address, setAddress] = useState({ house: '', street: user?.address || '', city: user?.city || 'Mumbai', pincode: user?.pincode || '400001', type: 'saved' });
  // Step 4 - Schedule
  const [schedule, setSchedule] = useState({ date: '', slot: '' });

  const toggleWaste = (id) => {
    setSelected(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);
    if (!quantities[id]) setQuantities(q => ({ ...q, [id]: 1 }));
  };

  const estimatedPoints = selected.reduce((sum, id) => {
    const cat = WASTE_CATEGORIES.find(c => c.id === id);
    return sum + (cat ? (quantities[id] || 1) * cat.points_per_kg : 0);
  }, 0);

  const totalWeight = selected.reduce((s, id) => s + (Number(quantities[id]) || 1), 0);

  const fullAddress = `${address.house ? address.house + ', ' : ''}${address.street}, ${address.city} - ${address.pincode}`;

  const todayStr = new Date().toISOString().split('T')[0];

  const handleConfirm = async () => {
    setLoading(true);
    await new Promise(r => setTimeout(r, 1000));
    const items = selected.map(id => {
      const cat = WASTE_CATEGORIES.find(c => c.id === id);
      return { category: cat.name, category_id: id, estimated: Number(quantities[id]) || 1 };
    });
    const result = schedulePickup({
      items,
      estimated_weight: totalWeight,
      estimated_points: estimatedPoints,
      address: fullAddress,
      scheduled_date: schedule.date,
      time_slot: schedule.slot,
      user_name: user?.name,
    });
    setLoading(false);
    if (result.success) {
      setPickupCode(result.pickup_code);
      setDone(true);
    }
  };

  // SUCCESS SCREEN
  if (done) {
    return (
      <DashboardLayout>
        <div style={{ maxWidth: 520, margin: '60px auto', textAlign: 'center' }}>
          <div style={{ width: 80, height: 80, borderRadius: '50%', background: 'var(--primary-light)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px', fontSize: 40 }}>✅</div>
          <h2 style={{ fontSize: 26, fontWeight: 800, marginBottom: 8 }}>Pickup Scheduled!</h2>
          <p style={{ color: 'var(--muted)', marginBottom: 24 }}>Your scrap pickup has been scheduled. A collector will accept it shortly.</p>
          <div className="card" style={{ marginBottom: 24, textAlign: 'left' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
              <span style={{ color: 'var(--muted)', fontSize: 13 }}>Pickup ID</span>
              <span style={{ fontFamily: 'monospace', fontWeight: 700, color: 'var(--primary)' }}>{pickupCode}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
              <span style={{ color: 'var(--muted)', fontSize: 13 }}>Date & Time</span>
              <span style={{ fontSize: 13, fontWeight: 600 }}>{schedule.date} • {schedule.slot}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
              <span style={{ color: 'var(--muted)', fontSize: 13 }}>Est. Points</span>
              <span style={{ fontSize: 13, fontWeight: 700, color: 'var(--primary)' }}>~{estimatedPoints} pts</span>
            </div>
          </div>
          <div style={{ display: 'flex', gap: 12 }}>
            <button onClick={() => router.push('/user/pickups')} className="btn btn-primary" style={{ flex: 1 }}>View My Pickups</button>
            <button onClick={() => router.push('/user/dashboard')} className="btn btn-secondary" style={{ flex: 1 }}>Dashboard</button>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="page-header">
        <h1 className="page-title">Schedule a Pickup</h1>
        <p className="page-subtitle">Select waste types, add quantities and choose a convenient time.</p>
      </div>

      {/* WIZARD PROGRESS */}
      <div className="wizard-progress" style={{ marginBottom: 32 }}>
        {STEPS.map((s, i) => (
          <div key={s} className={`wizard-step${i < step ? ' done' : ''}${i === step ? ' active' : ''}`}>
            <div className="wizard-num">{i < step ? <Check size={16} /> : i + 1}</div>
            <div className="wizard-label">{s}</div>
          </div>
        ))}
      </div>

      <div className="card" style={{ maxWidth: 800, margin: '0 auto' }}>
        {/* STEP 0: Waste Type */}
        {step === 0 && (
          <div>
            <h3 style={{ fontWeight: 700, fontSize: 18, marginBottom: 6 }}>Select Waste Types</h3>
            <p style={{ color: 'var(--muted)', fontSize: 14, marginBottom: 24 }}>Choose all the types of waste you want to recycle. You can select multiple.</p>
            <div className="waste-select-grid">
              {WASTE_CATEGORIES.map(cat => (
                <div key={cat.id} className={`waste-option${selected.includes(cat.id) ? ' selected' : ''}`}
                  onClick={() => toggleWaste(cat.id)}>
                  <div style={{ position: 'relative' }}>
                    {selected.includes(cat.id) && (
                      <div style={{ position: 'absolute', top: -8, right: -8, width: 22, height: 22, background: 'var(--primary)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <Check size={12} color="white" />
                      </div>
                    )}
                    <div className="waste-option-icon">{cat.icon}</div>
                    <div className="waste-option-name">{cat.name}</div>
                    <div className="waste-option-pts">{cat.points_per_kg} pts/kg</div>
                  </div>
                </div>
              ))}
            </div>
            {selected.length > 0 && (
              <div style={{ marginTop: 20, padding: '12px 16px', background: 'var(--primary-light)', borderRadius: 'var(--radius-sm)', fontSize: 14, color: 'var(--primary)', fontWeight: 600 }}>
                ✅ {selected.length} type{selected.length > 1 ? 's' : ''} selected
              </div>
            )}
          </div>
        )}

        {/* STEP 1: Quantities */}
        {step === 1 && (
          <div>
            <h3 style={{ fontWeight: 700, fontSize: 18, marginBottom: 6 }}>Enter Estimated Quantities</h3>
            <p style={{ color: 'var(--muted)', fontSize: 14, marginBottom: 24 }}>Final points will be calculated after the collector verifies the actual weight.</p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              {selected.map(id => {
                const cat = WASTE_CATEGORIES.find(c => c.id === id);
                const qty = Number(quantities[id]) || 1;
                return (
                  <div key={id} style={{ border: '1.5px solid var(--border)', borderRadius: 'var(--radius-sm)', padding: '16px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                        <span style={{ fontSize: 24 }}>{cat.icon}</span>
                        <div>
                          <div style={{ fontWeight: 600 }}>{cat.name}</div>
                          <div style={{ fontSize: 12, color: 'var(--muted)' }}>{cat.points_per_kg} pts/kg</div>
                        </div>
                      </div>
                      <div style={{ color: 'var(--primary)', fontWeight: 700 }}>= {qty * cat.points_per_kg} pts</div>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                      <button onClick={() => setQuantities(q => ({ ...q, [id]: Math.max(0.5, (Number(q[id]) || 1) - 0.5) }))}
                        className="btn btn-secondary btn-sm" style={{ width: 36, height: 36, borderRadius: '50%', padding: 0 }}>−</button>
                      <div style={{ flex: 1 }}>
                        <input type="number" min="0.5" step="0.5" className="form-input" style={{ textAlign: 'center' }}
                          value={quantities[id] || 1}
                          onChange={e => setQuantities(q => ({ ...q, [id]: e.target.value }))} />
                      </div>
                      <span style={{ fontWeight: 600, color: 'var(--muted)' }}>KG</span>
                      <button onClick={() => setQuantities(q => ({ ...q, [id]: (Number(q[id]) || 1) + 0.5 }))}
                        className="btn btn-secondary btn-sm" style={{ width: 36, height: 36, borderRadius: '50%', padding: 0 }}>+</button>
                    </div>
                  </div>
                );
              })}
            </div>
            <div style={{ marginTop: 20, padding: '16px 20px', background: 'linear-gradient(135deg, var(--primary-light), var(--accent-light))', borderRadius: 'var(--radius-sm)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <div style={{ fontWeight: 700, fontSize: 16 }}>Estimated Total</div>
                <div style={{ fontSize: 13, color: 'var(--muted)' }}>{totalWeight} kg total</div>
              </div>
              <div style={{ fontSize: 28, fontWeight: 800, color: 'var(--primary)' }}>~{estimatedPoints} pts</div>
            </div>
          </div>
        )}

        {/* STEP 2: Address */}
        {step === 2 && (
          <div>
            <h3 style={{ fontWeight: 700, fontSize: 18, marginBottom: 6 }}>Pickup Address</h3>
            <p style={{ color: 'var(--muted)', fontSize: 14, marginBottom: 24 }}>Where should our collector come to collect your scrap?</p>
            <div style={{ display: 'flex', gap: 10, marginBottom: 20 }}>
              {[['saved','🏠 Saved Address'],['new','+ Add New']].map(([v,l]) => (
                <button key={v} className={`role-tab${address.type === v ? ' active' : ''}`} onClick={() => setAddress(a => ({ ...a, type: v }))}>
                  {l}
                </button>
              ))}
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              <div className="form-group">
                <label className="form-label">House / Flat No.</label>
                <input className="form-input" placeholder="12, Green Park Colony" value={address.house} onChange={e => setAddress(a => ({ ...a, house: e.target.value }))} />
              </div>
              <div className="form-group">
                <label className="form-label">Street / Area</label>
                <input className="form-input" placeholder="MG Road" value={address.street} onChange={e => setAddress(a => ({ ...a, street: e.target.value }))} />
              </div>
              <div className="form-grid">
                <div className="form-group">
                  <label className="form-label">City</label>
                  <input className="form-input" value={address.city} onChange={e => setAddress(a => ({ ...a, city: e.target.value }))} />
                </div>
                <div className="form-group">
                  <label className="form-label">Pincode</label>
                  <input className="form-input" value={address.pincode} onChange={e => setAddress(a => ({ ...a, pincode: e.target.value }))} />
                </div>
              </div>
            </div>
            {/* Map Placeholder */}
            <div style={{ marginTop: 16, height: 160, borderRadius: 'var(--radius-sm)', background: 'linear-gradient(135deg, #dcfce7, #e0f2fe)', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px dashed var(--primary)', gap: 10 }}>
              <MapPin color="var(--primary)" size={22} />
              <span style={{ color: 'var(--primary)', fontWeight: 600 }}>Map Preview — {address.city}</span>
            </div>
          </div>
        )}

        {/* STEP 3: Schedule */}
        {step === 3 && (
          <div>
            <h3 style={{ fontWeight: 700, fontSize: 18, marginBottom: 6 }}>Choose Date & Time</h3>
            <p style={{ color: 'var(--muted)', fontSize: 14, marginBottom: 24 }}>Select when you'd like us to come for the pickup.</p>
            <div className="form-group" style={{ marginBottom: 24 }}>
              <label className="form-label">Pickup Date</label>
              <input type="date" className="form-input" min={todayStr}
                value={schedule.date} onChange={e => setSchedule(s => ({ ...s, date: e.target.value }))} />
            </div>
            <div>
              <label className="form-label" style={{ marginBottom: 12, display: 'block' }}>Time Slot</label>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                {TIME_SLOTS.map(slot => (
                  <button key={slot}
                    onClick={() => setSchedule(s => ({ ...s, slot }))}
                    style={{
                      padding: '16px', borderRadius: 'var(--radius-sm)', border: `2px solid ${schedule.slot === slot ? 'var(--primary)' : 'var(--border)'}`,
                      background: schedule.slot === slot ? 'var(--primary-light)' : 'white',
                      color: schedule.slot === slot ? 'var(--primary)' : 'var(--text)',
                      fontWeight: schedule.slot === slot ? 700 : 500, cursor: 'pointer', fontSize: 14,
                    }}>
                    {slot}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* STEP 4: Confirm */}
        {step === 4 && (
          <div>
            <h3 style={{ fontWeight: 700, fontSize: 18, marginBottom: 6 }}>Confirm Your Pickup</h3>
            <p style={{ color: 'var(--muted)', fontSize: 14, marginBottom: 24 }}>Review the details below and confirm your pickup.</p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              {/* Waste Items */}
              <div style={{ border: '1px solid var(--border)', borderRadius: 'var(--radius-sm)', padding: '16px' }}>
                <div style={{ fontWeight: 700, marginBottom: 12 }}>Waste Items</div>
                {selected.map(id => {
                  const cat = WASTE_CATEGORIES.find(c => c.id === id);
                  const qty = Number(quantities[id]) || 1;
                  return (
                    <div key={id} style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid var(--bg)', fontSize: 14 }}>
                      <span>{cat.icon} {cat.name} — {qty} kg</span>
                      <span style={{ color: 'var(--primary)', fontWeight: 600 }}>{qty * cat.points_per_kg} pts</span>
                    </div>
                  );
                })}
                <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 12, fontWeight: 700 }}>
                  <span>Total Estimated Points</span>
                  <span style={{ color: 'var(--primary)', fontSize: 18 }}>~{estimatedPoints} pts</span>
                </div>
              </div>

              {[
                ['📍 Address', fullAddress],
                ['📅 Date', schedule.date],
                ['⏰ Time Slot', schedule.slot],
              ].map(([label, val]) => (
                <div key={label} style={{ display: 'flex', justifyContent: 'space-between', padding: '12px 16px', background: 'var(--bg)', borderRadius: 'var(--radius-sm)', fontSize: 14 }}>
                  <span style={{ color: 'var(--muted)' }}>{label}</span>
                  <span style={{ fontWeight: 600 }}>{val}</span>
                </div>
              ))}

              <div style={{ padding: '12px 16px', background: 'var(--warning-light)', borderRadius: 'var(--radius-sm)', fontSize: 13, color: '#92400e' }}>
                ⚠️ Final points will be calculated after the collector verifies actual weight.
              </div>
            </div>
          </div>
        )}

        {/* NAVIGATION BUTTONS */}
        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 32, paddingTop: 20, borderTop: '1px solid var(--border)' }}>
          <button onClick={() => setStep(s => s - 1)} className="btn btn-secondary" disabled={step === 0}>
            <ChevronLeft size={18} /> Previous
          </button>
          {step < 4 ? (
            <button onClick={() => setStep(s => s + 1)} className="btn btn-primary"
              disabled={(step === 0 && selected.length === 0) || (step === 3 && (!schedule.date || !schedule.slot))}>
              Next <ChevronRight size={18} />
            </button>
          ) : (
            <button onClick={handleConfirm} className="btn btn-primary btn-lg" disabled={loading}>
              {loading ? 'Scheduling...' : '✅ Confirm Pickup'}
            </button>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}
