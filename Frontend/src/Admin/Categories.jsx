import React, { useState, useEffect } from 'react';

// const DEFAULT_CATEGORIES = [
//   { name: 'Power Tools' },
//   { name: 'Machining Coil' },
//   { name: 'Machine Armature' },
// ];

const getCategories = () => {
  const stored = JSON.parse(localStorage.getItem('categories') || '[]');
  if (stored.length === 0) {
    localStorage.setItem('categories', JSON.stringify(DEFAULT_CATEGORIES));
    return DEFAULT_CATEGORIES;
  }
  return stored;
};
const saveCategories = (arr) => localStorage.setItem('categories', JSON.stringify(arr));

const Categories = () => {
  const [categories, setCategories] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [editIdx, setEditIdx] = useState(null);
  const [form, setForm] = useState({ name: '' });
  const [error, setError] = useState('');

  useEffect(() => {
    setCategories(getCategories());
  }, []);

  const openAddModal = () => {
    setForm({ name: '' });
    setEditIdx(null);
    setError('');
    setModalOpen(true);
  };

  const openEditModal = (idx) => {
    setForm(categories[idx]);
    setEditIdx(idx);
    setError('');
    setModalOpen(true);
  };

  const handleDelete = (idx) => {
    if (window.confirm('Delete this category?')) {
      const updated = categories.filter((_, i) => i !== idx);
      setCategories(updated);
      saveCategories(updated);
    }
  };

  const handleFormChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    if (!form.name.trim()) {
      setError('Category name is required');
      return;
    }
    let updated;
    if (editIdx !== null) {
      updated = categories.map((c, i) => (i === editIdx ? form : c));
    } else {
      if (categories.some(c => c.name.toLowerCase() === form.name.trim().toLowerCase())) {
        setError('Category already exists');
        return;
      }
      updated = [...categories, { name: form.name.trim() }];
    }
    setCategories(updated);
    saveCategories(updated);
    setModalOpen(false);
  };

  return (
    <div style={{ maxWidth: 900, margin: '0 auto' }}>
      <div className="admin-card" style={{ textAlign: 'center' }}>
        <h1 className="admin-section-title">Category Management</h1>
        <button onClick={openAddModal} className="admin-btn" style={{ marginBottom: 18 }}>Add Category</button>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: 10 }}>
            <thead>
              <tr style={{ background: '#f3f4f6', color: '#1a2640', fontWeight: 700 }}>
                <th style={{ padding: '10px 8px', borderBottom: '1.5px solid #e5e7eb' }}>Category Name</th>
                <th style={{ padding: '10px 8px', borderBottom: '1.5px solid #e5e7eb' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {categories.length === 0 ? (
                <tr><td colSpan={2} style={{ textAlign: 'center', color: '#64748b', padding: 24 }}>No categories found.</td></tr>
              ) : (
                categories.map((c, i) => (
                  <tr key={i} style={{ borderBottom: '1px solid #e5e7eb', color: '#1a2640' }}>
                    <td style={{ padding: '10px 8px', color: '#1a2640', fontWeight: 600 }}>{c.name}</td>
                    <td style={{ padding: '10px 8px' }}>
                      <button onClick={() => openEditModal(i)} className="admin-btn" style={{ marginRight: 8 }}>Edit</button>
                      <button onClick={() => handleDelete(i)} className="admin-btn" style={{ background: '#ff4d4f' }}>Delete</button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
      {/* Modal for Add/Edit */}
      {modalOpen && (
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', background: 'rgba(30,41,59,0.35)', zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center' }} onClick={() => setModalOpen(false)}>
          <form onClick={e => e.stopPropagation()} onSubmit={handleFormSubmit} style={{ background: '#fff', borderRadius: 16, boxShadow: '0 8px 40px rgba(30,41,59,0.18)', padding: '2rem 2.5rem', minWidth: 320, maxWidth: 350, display: 'flex', flexDirection: 'column', gap: 16 }}>
            <h2 style={{ color: '#1a2640', fontWeight: 800, fontSize: 22, marginBottom: 8 }}>{editIdx !== null ? 'Edit Category' : 'Add Category'}</h2>
            <input name="name" placeholder="Category Name" value={form.name} onChange={handleFormChange} style={{ padding: 10, borderRadius: 8, border: '1.5px solid #cbd5e1', fontSize: 15, background: '#fff', color: '#1a2640' }} />
            {error && <div style={{ color: '#ff4d4f', fontWeight: 600 }}>{error}</div>}
            <div style={{ display: 'flex', gap: 10, marginTop: 8 }}>
              <button type="submit" style={{ flex: 1, background: '#1a2640', color: '#fff', border: 'none', borderRadius: 8, padding: '10px 0', fontWeight: 700, fontSize: 16, cursor: 'pointer' }}>{editIdx !== null ? 'Save' : 'Add'}</button>
              <button type="button" onClick={() => setModalOpen(false)} style={{ flex: 1, background: '#f3f4f6', color: '#1a2640', border: 'none', borderRadius: 8, padding: '10px 0', fontWeight: 700, fontSize: 16, cursor: 'pointer' }}>Cancel</button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default Categories;