
import React, { useEffect, useState } from 'react';

const Reports = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
  fetch('https://mahaveer-tools.onrender.com/api/stock-report')
      .then(res => res.json())
      .then(data => {
        setProducts(data);
        setLoading(false);
      })
      .catch(err => {
        setError('Failed to fetch stock report');
        setLoading(false);
      });
  }, []);

  return (
    <div style={{ maxWidth: 900, margin: '0 auto' }}>
      <div className="admin-card" style={{ minWidth: 220, margin: '1rem 0', textAlign: 'center' }}>
        <h1 className="admin-section-title">Stock Reports</h1>
        <p className="admin-small">View and export current stock reports here.</p>
      </div>
      {loading ? (
        <div>Loading...</div>
      ) : error ? (
        <div style={{ color: 'red' }}>{error}</div>
      ) : (
        <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: 20, background: '#fff', boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
          <thead>
            <tr style={{ background: '#f5f5f5' }}>
              <th style={{ padding: 12, border: '1px solid #ddd', fontWeight: 700, color: '#1a2640' }}>Product Name</th>
              <th style={{ padding: 12, border: '1px solid #ddd', fontWeight: 700, color: '#1a2640' }}>Category</th>
              <th style={{ padding: 12, border: '1px solid #ddd', fontWeight: 700, color: '#1a2640' }}>Subcategory</th>
              <th style={{ padding: 12, border: '1px solid #ddd', fontWeight: 700, color: '#1a2640' }}>Stock</th>
              <th style={{ padding: 12, border: '1px solid #ddd', fontWeight: 700, color: '#1a2640' }}>Price</th>
            </tr>
          </thead>
          <tbody>
            {products.map(prod => (
              <tr key={prod._id} style={{ background: '#fafbfc', color: '#222', fontWeight: 500 }}>
                <td style={{ padding: 10, border: '1px solid #ddd' }}>{prod.name}</td>
                <td style={{ padding: 10, border: '1px solid #ddd' }}>{prod.category}</td>
                <td style={{ padding: 10, border: '1px solid #ddd' }}>{prod.subcategory}</td>
                <td style={{ padding: 10, border: '1px solid #ddd' }}>{prod.stock}</td>
                <td style={{ padding: 10, border: '1px solid #ddd' }}>{prod.price}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default Reports;