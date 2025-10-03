import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';

const CATEGORY_API = 'http://localhost:5000/api/categories';
const PRODUCT_API = 'http://localhost:5000/api/products';

const CategorySubcategories = () => {
  const { categoryId } = useParams();
  const navigate = useNavigate();
  const [category, setCategory] = useState(null);
  const [products, setProducts] = useState([]);
  const [subcategories, setSubcategories] = useState([]);
  const [newSubName, setNewSubName] = useState('');
  const [form, setForm] = useState({ name: '', subcategory: '', price: '', image: '', description: '' });
  const [error, setError] = useState('');
  const [stockModal, setStockModal] = useState({ open: false, product: null, value: '' });

  useEffect(() => {
    fetchCategory();
  }, [categoryId]);

  const fetchCategory = async () => {
    try {
      const res = await fetch(`${CATEGORY_API}/${categoryId}`);
      const data = await res.json();
      setCategory(data);
      // fetch products for this category
      const prodRes = await fetch(`${PRODUCT_API}?category=${data._id}`);
      const prodList = await prodRes.json();
      setProducts(Array.isArray(prodList) ? prodList : []);
      // fetch subcategories
      const subRes = await fetch(`${CATEGORY_API}/${data._id}/subcategories`);
      const subList = await subRes.json();
      setSubcategories(Array.isArray(subList) ? subList : []);
    } catch (err) {
      setCategory(null);
      setProducts([]);
    }
  };

  const handleFormChange = (e) => {
    const { name, value, files } = e.target;
    if (name === 'image' && files && files[0]) {
      // convert to base64 so backend can store the image string directly
      const file = files[0];
      const reader = new FileReader();
      reader.onload = () => {
        setForm({ ...form, image: reader.result });
      };
      reader.readAsDataURL(file);
    } else {
      setForm({ ...form, [name]: value });
    }
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    if (!form.name.trim()) {
      setError('Product name is required');
      return;
    }
    if (!form.price.trim() || isNaN(Number(form.price.trim())) || Number(form.price.trim()) <= 0) {
      setError('Price is required, must be a positive number');
      return;
    }
    try {
      const payload = {
        name: form.name.trim(),
        description: form.description?.trim() || 'High-grade product for industrial use.',
        category: categoryId,
        subcategory: form.subcategory?.trim() || 'General',
        brands: [],
        image: form.image || '',
        price: Number(form.price.trim())
      };
      const res = await fetch(PRODUCT_API, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || 'Failed to create product');
        return;
      }
      setProducts(prev => [...prev, data]);
  setForm({ name: '', subcategory: '', price: '', image: '', description: '' });
      setError('');
    } catch (err) {
      setError('Failed to create product');
    }
  };

  const handleAddSubcategory = async (e) => {
    e.preventDefault();
    if (!newSubName.trim()) return;
    try {
      const res = await fetch(`${CATEGORY_API}/${categoryId}/subcategories`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: newSubName.trim() })
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || 'Failed to create subcategory');
        return;
      }
      setSubcategories(prev => [...prev, data]);
      setNewSubName('');
      setError('');
    } catch (err) {
      setError('Failed to create subcategory');
    }
  };

  const handleDeleteSub = async (subId) => {
    if (!confirm('Delete this subcategory? This will not remove products.')) return;
    try {
      const res = await fetch(`${CATEGORY_API}/subcategories/${subId}`, { method: 'DELETE' });
      if (!res.ok) {
        const data = await res.json();
        setError(data.error || 'Failed to delete subcategory');
        return;
      }
      setSubcategories(prev => prev.filter(s => s._id !== subId));
      setError('');
    } catch (err) {
      setError('Failed to delete subcategory');
    }
  };

  const updateProduct = async (productId, patch) => {
    try {
      const res = await fetch(`${PRODUCT_API}/${productId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(patch)
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || 'Failed to update product');
        return null;
      }
      setProducts(prev => prev.map(p => p._id === data._id ? data : p));
      return data;
    } catch (err) {
      setError('Failed to update product');
      return null;
    }
  };

  const handleDelete = async (idx) => {
    const prod = products[idx];
    if (!prod) return;
    await fetch(`${PRODUCT_API}/${prod._id}`, { method: 'DELETE' });
    setProducts(prev => prev.filter((_, i) => i !== idx));
  };


  // Remove all brand/variant logic

  const openStockModal = (product) => {
    setStockModal({ open: true, product, value: product.stock ?? '' });
  };

  const closeStockModal = () => {
    setStockModal({ open: false, product: null, value: '' });
  };

  const handleStockChange = (e) => {
    setStockModal(modal => ({ ...modal, value: e.target.value }));
  };

  const saveStock = async () => {
    if (!stockModal.product) return;
    const newStock = Number(stockModal.value);
    if (isNaN(newStock) || newStock < 0) {
      setError('Stock must be a non-negative number');
      return;
    }
    const updated = await updateProduct(stockModal.product._id, { stock: newStock });
    if (updated) {
      setProducts(prev => prev.map(p => p._id === updated._id ? updated : p));
      closeStockModal();
      setError('');
    }
  };

  return (
    <div style={{ maxWidth: 900, margin: '0 auto', padding: '2rem 0' }}>
      <button onClick={() => navigate(-1)} className="admin-btn ghost" style={{ margin: '1rem 0' }}>← Back</button>
      <div className="admin-card" style={{ marginBottom: 28 }}>
        <h2 className="admin-section-title">Manage Subcategories for <span style={{ color: 'var(--primary)' }}>{category?.name}</span></h2>
        {/* Subcategories management */}
        <div style={{ marginBottom: 12 }}>
          <div style={{ display: 'flex', gap: 8, marginBottom: 8 }}>
            <input placeholder="New subcategory name" value={newSubName} onChange={e => setNewSubName(e.target.value)} className="admin-input" style={{ flex: 1 }} />
            <button onClick={handleAddSubcategory} className="admin-btn">Add</button>
          </div>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            {subcategories.map(s => (
              <div key={s._id} className="admin-chip">
                <span style={{ fontWeight: 700 }}>{s.name}</span>
                <button onClick={() => handleDeleteSub(s._id)} style={{ background: 'transparent', border: 'none', color: 'var(--danger)', cursor: 'pointer', fontWeight: 700 }}>×</button>
              </div>
            ))}
            {subcategories.length === 0 && <div className="admin-small">No subcategories yet.</div>}
          </div>
        </div>
        <form onSubmit={handleFormSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16, alignItems: 'center', marginBottom: 10 }}>
          <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: 10 }}>
            <input name="name" placeholder="Product Name *" value={form.name} onChange={handleFormChange} className="admin-input" />
            <select name="subcategory" value={form.subcategory || ''} onChange={handleFormChange} className="admin-select">
              <option value="">Select Subcategory</option>
              {subcategories.map(sub => (
                <option key={sub._id} value={sub.name}>{sub.name}</option>
              ))}
            </select>
            <input name="price" type="number" placeholder="Price *" value={form.price} onChange={handleFormChange} className="admin-input" />
            <textarea name="description" placeholder="Description (optional)" value={form.description} onChange={handleFormChange} className="admin-textarea" />
            <label className="admin-input" style={{ display: 'flex', alignItems: 'center', cursor: 'pointer', height: 48 }}>
              <input name="image" type="file" accept="image/*" onChange={handleFormChange} style={{ display: 'none' }} />
              <span style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', width: '100%' }}>
                {form.image && typeof form.image !== 'string' ? form.image.name : 'Choose image...'}
              </span>
            </label>
          </div>
          {/* Image preview */}
          {form.image && typeof form.image === 'string' && (
            <img src={form.image} alt="Preview" style={{ width: 80, height: 80, objectFit: 'cover', borderRadius: 10, marginTop: 4, border: '1.5px solid #e5e7eb' }} />
          )}
          <button type="submit" style={{ background: '#1a2640', color: '#fff', border: 'none', borderRadius: 8, padding: '12px 0', fontWeight: 700, fontSize: 17, cursor: 'pointer', width: '100%', marginTop: 6 }}>Add Product</button>
        </form>
        {error && <div style={{ color: '#ff4d4f', fontWeight: 600, marginBottom: 10, textAlign: 'center' }}>{error}</div>}
      </div>
      <div className="admin-card-list" style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        {products.length === 0 ? (
          <div className="admin-card" style={{ textAlign: 'center', background: 'var(--card-bg)' }}>No products found.</div>
        ) : (
          products.map((prod, i) => (
            <div key={prod._id} className="item" style={{ display: 'flex', alignItems: 'center' }}>
              {prod.image ? <img className="admin-image-thumb" src={prod.image} alt={prod.name} /> : <div style={{ width: 64, height: 64, background: '#f1f5f9', borderRadius: 10 }} />}
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 800, fontSize: 18, color: '#1a2640' }}>{prod.name}</div>
                <div className="admin-small">{prod.subcategory} • ₹{prod.price ?? '—'}</div>
              </div>
              <div className="admin-actions">
                <Link to={`/admin/specifications/${categoryId}/${prod._id}`} state={{ productId: prod._id }} className="admin-btn" style={{ textDecoration: 'none' }}>Manage Specifications</Link>
                <button onClick={() => openStockModal(prod)} className="admin-btn" style={{ background: '#e5e7eb', color: '#1a2640', marginRight: 8 }}>Manage Stock</button>
                <button onClick={() => handleDelete(i)} className="admin-btn ghost" style={{ color: 'var(--danger)' }} title="Delete">Delete</button>
              </div>
            </div>
          ))
        )}
      </div>
      {/* Stock Modal */}
      {stockModal.open && (
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', background: 'rgba(0,0,0,0.18)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 999 }}>
          <div style={{ background: '#fff', padding: 32, borderRadius: 12, boxShadow: '0 2px 16px rgba(0,0,0,0.12)', minWidth: 320 }}>
            <h3 style={{ marginBottom: 18, color: '#1a2640', fontWeight: 800 }}>Manage Stock for {stockModal.product?.name}</h3>
            <input type="number" min="0" value={stockModal.value} onChange={handleStockChange} className="admin-input" style={{ marginBottom: 16, width: '100%' }} placeholder="Enter stock quantity" />
            <div style={{ display: 'flex', gap: 12 }}>
              <button onClick={saveStock} className="admin-btn" style={{ background: '#1a2640', color: '#fff', flex: 1 }}>Save</button>
              <button onClick={closeStockModal} className="admin-btn ghost" style={{ flex: 1 }}>Cancel</button>
            </div>
            {error && <div style={{ color: '#ff4d4f', fontWeight: 600, marginTop: 10, textAlign: 'center' }}>{error}</div>}
          </div>
        </div>
      )}
    </div>
  );
};

export default CategorySubcategories;
