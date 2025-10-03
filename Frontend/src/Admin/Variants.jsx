import React, { useEffect, useState } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';

const PRODUCT_API = 'http://localhost:5000/api/products';

export default function Variants() {
  const { categoryId, subIdx } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  // productId might be passed via location.state from InventoryDetail or be the subIdx param
  const productIdFromState = location?.state?.productId;
  const productId = productIdFromState || subIdx;

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [specs, setSpecs] = useState([]);
  const [newSpecName, setNewSpecName] = useState('');
  const [newSpecValue, setNewSpecValue] = useState('');
  const [editingIndex, setEditingIndex] = useState(-1);
  const [editingSpec, setEditingSpec] = useState({ name: '', value: '' });

  useEffect(() => {
    if (!productId) {
      setLoading(false);
      return;
    }
    fetchProduct();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [productId]);

  const fetchProduct = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${PRODUCT_API}/${productId}`);
      if (!res.ok) throw new Error('Failed to load product');
      const data = await res.json();
      setProduct(data);
      const rawSpecs = Array.isArray(data.specifications) ? data.specifications : [];
      const normalized = rawSpecs.map(s => (typeof s === 'string' ? { name: s, value: '' } : (s && s.name ? s : { name: s.title || '', value: s.value || '' } )));
      setSpecs(normalized);
    } catch (err) {
      setProduct(null);
      setSpecs([]);
    }
    setLoading(false);
  };

  const handleAddSpec = (e) => {
    e.preventDefault();
    if (!newSpecName.trim()) return;
    setSpecs(prev => [...prev, { name: newSpecName.trim(), value: newSpecValue.trim() }]);
    setNewSpecName('');
    setNewSpecValue('');
  };

  const handleDeleteSpec = (index) => {
    if (!window.confirm('Delete this specification?')) return;
    setSpecs(prev => prev.filter((_, i) => i !== index));
  };

  const startEdit = (index) => {
    setEditingIndex(index);
    setEditingSpec({ ...specs[index] });
  };

  const cancelEdit = () => {
    setEditingIndex(-1);
    setEditingSpec({ name: '', value: '' });
  };

  const saveEdit = () => {
    if (editingIndex < 0) return;
    setSpecs(prev => prev.map((s, i) => i === editingIndex ? { name: editingSpec.name.trim(), value: editingSpec.value.trim() } : s));
    cancelEdit();
  };

  const handleSaveToServer = async () => {
    if (!productId) return alert('No product selected');
    try {
      const payload = { specifications: specs };
      console.log('Saving specs to', `${PRODUCT_API}/${productId}`, 'payload:', payload);
      const res = await fetch(`${PRODUCT_API}/${productId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const text = await res.text();
      let json = null;
      try { json = JSON.parse(text); } catch (e) { /* not json */ }
      console.log('Save response', res.status, text);
      if (!res.ok) {
        const msg = (json && json.error) || text || 'Failed to save specifications';
        alert('Failed to save specifications: ' + msg);
        return;
      }
      setProduct(json || {});
      alert('Specifications saved');
    } catch (err) {
      console.error('Save failed', err);
      alert('Failed to save specifications: ' + (err.message || err));
    }
  };

  if (loading) return <div style={{ padding: 24 }}>Loading...</div>;

  return (
    <div style={{ padding: 24, maxWidth: 900, margin: '0 auto' }}>
      <button onClick={() => navigate(-1)} className="admin-btn ghost" style={{ marginBottom: 12 }}>← Back</button>
      <h2 className="admin-section-title">Product Specifications</h2>
      {/* Debug: show resolved product id source */}
      <div style={{ marginBottom: 12, fontSize: 13, color: 'var(--muted)' }}>
        Resolved product id: <strong>{productId || 'none'}</strong> {productIdFromState ? '(from location.state)' : productId ? '(from URL param)' : ''}
      </div>
      {!productId ? (
        <div className="admin-error">No product selected. Navigate from Inventory &gt; Manage.</div>
      ) : (
        <div style={{ display: 'grid', gap: 16 }}>
          <div className="admin-card">
            <div style={{ fontWeight: 800, marginBottom: 6 }}>{product?.name || 'Product'}</div>
            <div className="admin-small">{product?.subcategory} • ₹{product?.price ?? '—'}</div>
          </div>

          <div className="admin-card">
            <h3 style={{ marginTop: 0 }}>Specifications</h3>
            {specs.length === 0 ? (
              <div className="admin-small" style={{ marginBottom: 12 }}>No specifications added yet.</div>
            ) : (
              <div style={{ display: 'grid', gap: 8 }}>
                {specs.map((s, i) => (
                  <div key={i} className="admin-card" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontWeight: 700 }}>{s.name}</div>
                      <div className="admin-small">{s.value}</div>
                    </div>
                    <div style={{ display: 'flex', gap: 8 }}>
                      <button onClick={() => startEdit(i)} className="admin-btn ghost" style={{ background: '#fde68a' }}>Edit</button>
                      <button onClick={() => handleDeleteSpec(i)} className="admin-btn ghost" style={{ background: '#fee2e2', color: 'var(--danger)' }}>Delete</button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {editingIndex >= 0 && (
              <div className="admin-card" style={{ marginTop: 12 }}>
                <div style={{ marginBottom: 8 }}><strong>Editing:</strong></div>
                <input value={editingSpec.name} onChange={e => setEditingSpec(prev => ({ ...prev, name: e.target.value }))} placeholder="Name" className="admin-input" style={{ marginBottom: 8 }} />
                <input value={editingSpec.value} onChange={e => setEditingSpec(prev => ({ ...prev, value: e.target.value }))} placeholder="Value" className="admin-input" style={{ marginBottom: 8 }} />
                <div style={{ display: 'flex', gap: 8 }}>
                  <button onClick={saveEdit} className="admin-btn">Save</button>
                  <button onClick={cancelEdit} className="admin-btn ghost">Cancel</button>
                </div>
              </div>
            )}

            <form onSubmit={handleAddSpec} style={{ marginTop: 12, display: 'grid', gap: 8 }}>
              <div style={{ display: 'flex', gap: 8 }}>
                <input value={newSpecName} onChange={e => setNewSpecName(e.target.value)} placeholder="Feature name (e.g. Power)" className="admin-input" style={{ flex: 1 }} />
                <input value={newSpecValue} onChange={e => setNewSpecValue(e.target.value)} placeholder="Value (e.g. 2 HP)" className="admin-input" style={{ flex: 1 }} />
              </div>
              <div style={{ display: 'flex', gap: 8 }}>
                <button type="submit" className="admin-btn" style={{ background: '#10b981' }}>Add Feature</button>
                <button type="button" onClick={() => { setNewSpecName(''); setNewSpecValue(''); }} className="admin-btn ghost">Clear</button>
              </div>
            </form>

            <div style={{ marginTop: 12, display: 'flex', gap: 8 }}>
              <button onClick={handleSaveToServer} className="admin-btn">Save to product</button>
              <button onClick={fetchProduct} className="admin-btn ghost">Reload</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
