import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const API_URL = 'https://mahaveer-tools.onrender.com/api/categories';
const ADD_URL = 'https://mahaveer-tools.onrender.com/api/addproduct';
const UPDATE_URL = 'https://mahaveer-tools.onrender.com/api/updateproduct';
const DELETE_URL = 'https://mahaveer-tools.onrender.com/api/deleteproduct';

const Inventory = () => {
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [form, setForm] = useState({ name: '' });
  const [error, setError] = useState('');
  const [deleteId, setDeleteId] = useState(null);

  // Fetch categories from backend
  const fetchCategories = async () => {
    try {
      const res = await fetch(API_URL);
      const data = await res.json();
      setCategories(data);
    } catch (err) {
      setCategories([]);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const openAddModal = () => {
    setForm({ name: '' });
    setError('');
    setModalOpen(true);
  };

  const handleFormChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    if (!form.name.trim()) {
      setError('Category name is required');
      return;
    }
    if (categories.some(c => c.name.toLowerCase() === form.name.trim().toLowerCase())) {
      setError('Category already exists');
      return;
    }
    try {
      const newCategory = { name: form.name.trim(), products: [] };
      await fetch(ADD_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newCategory)
      });
      setModalOpen(false);
      fetchCategories();
    } catch (err) {
      setError('Failed to add category');
    }
  };

  return (
    <div style={{ maxWidth: 900, margin: '0 auto' }}>
      <div style={{ background: '#fff', borderRadius: 16, boxShadow: '0 4px 24px rgba(30,41,59,0.10)', padding: '2rem 2.5rem', margin: '1rem 0' }}>
        <h1 style={{ color: '#1a2640', fontWeight: 800, fontSize: 28, marginBottom: 18 }}>Inventory Management</h1>
        <button onClick={openAddModal} style={{ background: '#1a2640', color: '#fff', border: 'none', borderRadius: 8, padding: '10px 22px', fontWeight: 700, fontSize: 16, marginBottom: 18, cursor: 'pointer', boxShadow: '0 2px 8px rgba(30,41,59,0.08)' }}>Add Category</button>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.5rem', marginTop: 10 }}>
          {categories.length === 0 ? (
            <div style={{ color: '#64748b', fontSize: 18, textAlign: 'center', gridColumn: '1/-1', padding: 32 }}>No categories found.</div>
          ) : (
            categories.map((cat) => (
              <div key={cat._id} style={{ background: '#f8f9fa', borderRadius: 14, boxShadow: '0 2px 8px rgba(30,41,59,0.06)', padding: '2rem 1.5rem', textAlign: 'center', fontWeight: 700, color: '#1a2640', fontSize: 20, border: '1px solid #e5e7eb', transition: 'all 0.2s', position: 'relative', cursor: 'pointer' }}
                onClick={() => navigate(`/admin/inventory/${cat._id}`)}
              >
                {cat.name}
                <button
                  onClick={e => { e.stopPropagation(); setDeleteId(cat._id); }}
                  style={{
                    position: 'absolute',
                    top: 12,
                    right: 12,
                    background: 'none',
                    color: '#222',
                    border: 'none',
                    borderRadius: 8,
                    padding: 6,
                    fontWeight: 700,
                    fontSize: 20,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    transition: 'background 0.2s',
                  }}
                  title={`Delete ${cat.name}`}
                  aria-label={`Delete ${cat.name}`}
                >
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="6" width="18" height="14" rx="2"/><path d="M9 10v6M15 10v6"/><path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>
                </button>
              </div>
            ))
          )}
        </div>
      </div>
      {/* Modal for Add Category */}
      {modalOpen && (
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', background: 'rgba(30,41,59,0.35)', zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center' }} onClick={() => setModalOpen(false)}>
          <form onClick={e => e.stopPropagation()} onSubmit={handleFormSubmit} style={{ background: '#fff', borderRadius: 16, boxShadow: '0 8px 40px rgba(30,41,59,0.18)', padding: '2rem 2.5rem', minWidth: 320, maxWidth: 350, display: 'flex', flexDirection: 'column', gap: 16 }}>
            <h2 style={{ color: '#1a2640', fontWeight: 800, fontSize: 22, marginBottom: 8 }}>Add Category</h2>
            <input name="name" placeholder="Category Name" value={form.name} onChange={handleFormChange} style={{ padding: 10, borderRadius: 8, border: '1.5px solid #cbd5e1', fontSize: 15, background: '#fff', color: '#1a2640' }} />
            {error && <div style={{ color: '#ff4d4f', fontWeight: 600 }}>{error}</div>}
            <div style={{ display: 'flex', gap: 10, marginTop: 8 }}>
              <button type="submit" style={{ flex: 1, background: '#1a2640', color: '#fff', border: 'none', borderRadius: 8, padding: '10px 0', fontWeight: 700, fontSize: 16, cursor: 'pointer' }}>Add</button>
              <button type="button" onClick={() => setModalOpen(false)} style={{ flex: 1, background: '#f3f4f6', color: '#1a2640', border: 'none', borderRadius: 8, padding: '10px 0', fontWeight: 700, fontSize: 16, cursor: 'pointer' }}>Cancel</button>
            </div>
          </form>
        </div>
      )}
        {/* Modal for Delete Confirmation */}
        {Boolean(deleteId) && (
          <div style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', background: 'rgba(30,41,59,0.35)', zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center' }} onClick={() => setDeleteId(null)}>
            <div onClick={e => e.stopPropagation()} style={{ background: '#fff', borderRadius: 16, boxShadow: '0 8px 40px rgba(30,41,59,0.18)', padding: '2rem 2.5rem', minWidth: 320, maxWidth: 350, display: 'flex', flexDirection: 'column', gap: 18, alignItems: 'center' }}>
              <svg width="38" height="38" viewBox="0 0 24 24" fill="none" stroke="#1a2640" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="6" width="18" height="14" rx="2"/><path d="M9 10v6M15 10v6"/><path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>
              <div style={{ fontWeight: 800, fontSize: 20, color: '#1a2640', textAlign: 'center' }}>Are you sure you want to delete the category?</div>
              <div style={{ color: '#64748b', fontSize: 15, textAlign: 'center', marginBottom: 8 }}>
                "{categories.find(c => c._id === deleteId)?.name}" will be permanently removed.
              </div>
              <div style={{ display: 'flex', gap: 12, width: '100%', justifyContent: 'center' }}>
                <button onClick={async () => {
                  await fetch(`${DELETE_URL}/${deleteId}`, { method: 'DELETE' });
                  setDeleteId(null);
                  fetchCategories();
                }} style={{ background: '#1a2640', color: '#fff', border: 'none', borderRadius: 8, padding: '10px 24px', fontWeight: 700, fontSize: 16, cursor: 'pointer' }}>Yes, Delete</button>
                <button onClick={() => setDeleteId(null)} style={{ background: '#f3f4f6', color: '#1a2640', border: 'none', borderRadius: 8, padding: '10px 24px', fontWeight: 700, fontSize: 16, cursor: 'pointer' }}>Cancel</button>
              </div>
            </div>
          </div>
        )}
    </div>
  );
};

export default Inventory;