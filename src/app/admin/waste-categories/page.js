'use client';
import { useState } from 'react';
import DashboardLayout from '@/components/DashboardLayout';
import { WASTE_CATEGORIES } from '@/lib/mockData';
import { Plus, Edit, Trash2, CheckCircle, X } from 'lucide-react';

export default function WasteCategoriesPage() {
  const [categories, setCategories] = useState(WASTE_CATEGORIES);
  const [editing, setEditing] = useState(null);
  const [showAdd, setShowAdd] = useState(false);
  const [form, setForm] = useState({ name: '', description: '', points_per_kg: 10, icon: '♻️' });

  const handleSave = () => {
    if (editing) {
      setCategories(prev => prev.map(c => c.id === editing.id ? { ...c, ...form } : c));
    } else {
      setCategories(prev => [...prev, { ...form, id: Date.now(), status: 'active' }]);
    }
    setEditing(null); setShowAdd(false);
    setForm({ name: '', description: '', points_per_kg: 10, icon: '♻️' });
  };

  const toggleStatus = (id) => setCategories(prev => prev.map(c => c.id === id ? { ...c, status: c.status === 'active' ? 'inactive' : 'active' } : c));
  const deleteCategory = (id) => setCategories(prev => prev.filter(c => c.id !== id));

  const openEdit = (cat) => { setEditing(cat); setForm({ name: cat.name, description: cat.description, points_per_kg: cat.points_per_kg, icon: cat.icon }); setShowAdd(true); };

  return (
    <DashboardLayout>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <div>
          <h1 className="page-title">Waste Categories</h1>
          <p className="page-subtitle">Manage waste types and their reward points per kg.</p>
        </div>
        <button onClick={() => { setEditing(null); setForm({ name:'',description:'',points_per_kg:10,icon:'♻️' }); setShowAdd(true); }} className="btn btn-primary">
          <Plus size={18}/> Add Category
        </button>
      </div>

      <div className="table-wrapper">
        <table className="data-table">
          <thead>
            <tr><th>Icon</th><th>Name</th><th>Description</th><th>Points/KG</th><th>Status</th><th>Actions</th></tr>
          </thead>
          <tbody>
            {categories.map(c => (
              <tr key={c.id}>
                <td style={{ fontSize: 24 }}>{c.icon}</td>
                <td style={{ fontWeight: 600 }}>{c.name}</td>
                <td style={{ color: 'var(--muted)', fontSize: 13 }}>{c.description}</td>
                <td><span style={{ fontWeight: 700, color: 'var(--primary)' }}>{c.points_per_kg} pts</span></td>
                <td>
                  <button onClick={() => toggleStatus(c.id)} className={`badge ${c.status === 'active' ? 'badge-success' : 'badge-gray'}`} style={{ cursor: 'pointer', border: 'none' }}>
                    {c.status === 'active' ? '● Active' : '○ Inactive'}
                  </button>
                </td>
                <td>
                  <div style={{ display: 'flex', gap: 6 }}>
                    <button onClick={() => openEdit(c)} className="btn btn-secondary btn-sm"><Edit size={14}/></button>
                    <button onClick={() => deleteCategory(c.id)} className="btn btn-danger btn-sm"><Trash2 size={14}/></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showAdd && (
        <div className="modal-overlay">
          <div className="modal-box">
            <h3 className="modal-title">{editing ? 'Edit Category' : 'Add Waste Category'}</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14, marginTop: 16 }}>
              <div className="form-grid">
                <div className="form-group">
                  <label className="form-label">Icon / Emoji</label>
                  <input className="form-input" value={form.icon} onChange={e => setForm(f=>({...f,icon:e.target.value}))} style={{fontSize:24,textAlign:'center'}}/>
                </div>
                <div className="form-group">
                  <label className="form-label">Category Name</label>
                  <input className="form-input" value={form.name} onChange={e => setForm(f=>({...f,name:e.target.value}))} placeholder="e.g., Plastic" />
                </div>
              </div>
              <div className="form-group">
                <label className="form-label">Description</label>
                <input className="form-input" value={form.description} onChange={e => setForm(f=>({...f,description:e.target.value}))} placeholder="e.g., Bottles, bags, containers" />
              </div>
              <div className="form-group">
                <label className="form-label">Points Per KG</label>
                <input type="number" className="form-input" min="1" value={form.points_per_kg} onChange={e => setForm(f=>({...f,points_per_kg:Number(e.target.value)}))} />
              </div>
            </div>
            <div className="modal-actions">
              <button onClick={() => { setShowAdd(false); setEditing(null); }} className="btn btn-secondary">Cancel</button>
              <button onClick={handleSave} className="btn btn-primary">{editing ? 'Save Changes' : 'Add Category'}</button>
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}
