'use client';
import { useState } from 'react';
import DashboardLayout from '@/components/DashboardLayout';
import { REWARDS } from '@/lib/mockData';
import { Plus, Edit, Trash2 } from 'lucide-react';

export default function AdminRewardsPage() {
  const [rewards, setRewards] = useState(REWARDS);
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({ name: '', description: '', points_required: 250, cash_value: 50, image: '🎁' });

  const handleSave = () => {
    if (editing) {
      setRewards(prev => prev.map(r => r.id === editing.id ? { ...r, ...form } : r));
    } else {
      setRewards(prev => [...prev, { ...form, id: Date.now(), status: 'active' }]);
    }
    setShowModal(false); setEditing(null);
  };

  const openEdit = (r) => { setEditing(r); setForm({ name: r.name, description: r.description, points_required: r.points_required, cash_value: r.cash_value, image: r.image }); setShowModal(true); };
  const deleteReward = (id) => setRewards(prev => prev.filter(r => r.id !== id));

  return (
    <DashboardLayout>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <div>
          <h1 className="page-title">Rewards Management</h1>
          <p className="page-subtitle">Create and manage reward catalog for users.</p>
        </div>
        <button onClick={() => { setEditing(null); setForm({ name:'',description:'',points_required:250,cash_value:50,image:'🎁' }); setShowModal(true); }} className="btn btn-primary">
          <Plus size={18}/> Add Reward
        </button>
      </div>

      <div className="rewards-grid">
        {rewards.map(r => (
          <div key={r.id} className="reward-card">
            <div style={{ fontSize: 40 }}>{r.image}</div>
            <div style={{ fontWeight: 700, fontSize: 15 }}>{r.name}</div>
            <div style={{ fontSize: 13, color: 'var(--muted)' }}>{r.description}</div>
            <div style={{ fontSize: 20, fontWeight: 800, color: 'var(--primary)' }}>{r.points_required} <span style={{ fontSize: 13, fontWeight: 400, color: 'var(--muted)' }}>pts</span></div>
            {r.cash_value > 0 && <div style={{ fontSize: 12, color: 'var(--muted)' }}>= ₹{r.cash_value}</div>}
            <div style={{ display: 'flex', gap: 8 }}>
              <button onClick={() => openEdit(r)} className="btn btn-secondary btn-sm" style={{ flex: 1 }}><Edit size={14}/> Edit</button>
              <button onClick={() => deleteReward(r.id)} className="btn btn-danger btn-sm"><Trash2 size={14}/></button>
            </div>
          </div>
        ))}
      </div>

      {showModal && (
        <div className="modal-overlay">
          <div className="modal-box">
            <h3 className="modal-title">{editing ? 'Edit Reward' : 'Add New Reward'}</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14, marginTop: 16 }}>
              <div className="form-grid">
                <div className="form-group">
                  <label className="form-label">Icon / Emoji</label>
                  <input className="form-input" value={form.image} onChange={e=>setForm(f=>({...f,image:e.target.value}))} style={{fontSize:28,textAlign:'center'}}/>
                </div>
                <div className="form-group">
                  <label className="form-label">Reward Name</label>
                  <input className="form-input" value={form.name} onChange={e=>setForm(f=>({...f,name:e.target.value}))} placeholder="e.g., ₹50 Amazon Voucher" />
                </div>
              </div>
              <div className="form-group">
                <label className="form-label">Description</label>
                <input className="form-input" value={form.description} onChange={e=>setForm(f=>({...f,description:e.target.value}))} />
              </div>
              <div className="form-grid">
                <div className="form-group">
                  <label className="form-label">Points Required</label>
                  <input type="number" className="form-input" value={form.points_required} onChange={e=>setForm(f=>({...f,points_required:Number(e.target.value)}))} />
                </div>
                <div className="form-group">
                  <label className="form-label">Cash Value (₹)</label>
                  <input type="number" className="form-input" value={form.cash_value} onChange={e=>setForm(f=>({...f,cash_value:Number(e.target.value)}))} />
                </div>
              </div>
            </div>
            <div className="modal-actions">
              <button onClick={() => setShowModal(false)} className="btn btn-secondary">Cancel</button>
              <button onClick={handleSave} className="btn btn-primary">{editing ? 'Save Changes' : 'Add Reward'}</button>
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}
