import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';

const PRODUCT_API = 'https://mahaveer-tools.onrender.com/api/products';
const CATEGORY_API = 'https://mahaveer-tools.onrender.com/api/categories';

export default function InventoryDetail() {
  const { categoryId } = useParams();
  const navigate = useNavigate();
  const [category, setCategory] = useState(null);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [categoryId]);

  const load = async () => {
    setLoading(true);
    try {
      const cRes = await fetch(`${CATEGORY_API}/${categoryId}`);
      const cData = await cRes.json();
      setCategory(cData);
      const pRes = await fetch(`${PRODUCT_API}?category=${categoryId}`);
      const pData = await pRes.json();
      setProducts(Array.isArray(pData) ? pData : []);
    } catch (err) {
      setProducts([]);
      setCategory(null);
    }
    setLoading(false);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this product permanently?')) return;
    try {
      await fetch(`${PRODUCT_API}/${id}`, { method: 'DELETE' });
      setProducts(prev => prev.filter(p => p._id !== id));
    } catch (err) {
      // ignore
    }
  };

  return (
    <div style={{ padding: 24, maxWidth: 900, margin: '0 auto' }}>
      <button onClick={() => navigate(-1)} style={{ marginBottom: 12 }}>← Back</button>
      <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 12 }}>
        <button onClick={() => navigate(`/admin/inventory/${categoryId}/subcategories`)} className="admin-btn">Manage Subcategories</button>
      </div>
      <h2 className="admin-section-title">Products for: {category?.name || categoryId}</h2>
      {loading ? (
        <div>Loading...</div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: 12 }}>
          {products.length === 0 ? (
            <div className="admin-card">No products found for this category.</div>
          ) : (
            products.map(p => (
              <div key={p._id} className="admin-card-list item">
                {p.image ? <img src={p.image} alt={p.name} className="admin-image-thumb" /> : <div className="admin-image-thumb" style={{ background: '#f1f5f9' }} />}
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 700 }}>{p.name}</div>
                  <div className="admin-small">{p.subcategory} • ₹{p.price ?? '—'}</div>
                </div>
                <div className="admin-actions">
                  <Link to={`/admin/specifications/${categoryId}/${p._id}`} state={{ productId: p._id }} className="admin-btn">Manage</Link>
                  <Link to={`/admin/edit-product/${p._id}`} state={{ product: p }} className="admin-btn ghost">Edit</Link>
                  <button onClick={() => handleDelete(p._id)} className="admin-btn" style={{ background: 'var(--danger)', color: '#fff' }}>Delete</button>
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}
