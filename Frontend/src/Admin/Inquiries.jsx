import React, { useState, useEffect } from 'react';

const Inquiries = () => {
  const [inquiries, setInquiries] = useState([]);
  const [newCount, setNewCount] = useState(0);

  const fetchInquiries = async () => {
    try {
  const res = await fetch('https://mahaveer-tools.onrender.com/api/inquiries');
      const body = await res.json();
      if (!res.ok) throw new Error(body.error || 'Failed');
      setInquiries(body.inquiries || []);
      const pending = (body.inquiries || []).filter(i => !i.resolved).length;
      setNewCount(pending);
    } catch (err) {
      console.error('Failed to fetch inquiries', err);
    }
  };

  useEffect(() => {
    fetchInquiries();
    const id = setInterval(fetchInquiries, 10000); // poll every 10s
    return () => clearInterval(id);
  }, []);

  const handleResolve = async (id) => {
    try {
  const res = await fetch(`https://mahaveer-tools.onrender.com/api/inquiries/${id}/resolve`, { method: 'POST' });
      if (!res.ok) throw new Error('Failed');
      fetchInquiries();
    } catch (err) {
      console.error(err);
      alert('Failed to mark resolved');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this inquiry?')) return;
    try {
  const res = await fetch(`https://mahaveer-tools.onrender.com/api/inquiries/${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Failed');
      fetchInquiries();
    } catch (err) {
      console.error(err);
      alert('Failed to delete');
    }
  };

  return (
    <div style={{ maxWidth: 900, margin: '0 auto' }}>
      <div className="admin-card">
        <h1 className="admin-section-title">User Inquiries</h1>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h1 className="admin-section-title">User Inquiries</h1>
          <div style={{ color: '#1a2640', fontWeight: 700 }}>{newCount > 0 ? `New: ${newCount}` : 'No new inquiries'}</div>
        </div>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: 10 }}>
            <thead>
              <tr style={{ background: '#f3f4f6', color: '#1a2640', fontWeight: 700 }}>
                <th style={{ padding: '10px 8px', borderBottom: '1.5px solid #e5e7eb' }}>Name</th>
                <th style={{ padding: '10px 8px', borderBottom: '1.5px solid #e5e7eb' }}>Email</th>
                <th style={{ padding: '10px 8px', borderBottom: '1.5px solid #e5e7eb' }}>Message</th>
                <th style={{ padding: '10px 8px', borderBottom: '1.5px solid #e5e7eb' }}>Status</th>
                <th style={{ padding: '10px 8px', borderBottom: '1.5px solid #e5e7eb' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {inquiries.length === 0 ? (
                <tr>
                  <td colSpan={5} style={{ textAlign: 'center', color: 'var(--muted)', padding: 24 }}>No inquiries found.</td>
                </tr>
              ) : (
                inquiries.map((inq) => (
                  <tr key={inq._id} style={{ borderBottom: '1px solid #e5e7eb', color: '#1a2640' }}>
                    <td style={{ padding: '10px 8px', color: '#1a2640', fontWeight: 600 }}>{inq.name}</td>
                    <td style={{ padding: '10px 8px', color: '#1a2640' }}>{inq.email}</td>
                    <td style={{ padding: '10px 8px', color: '#1a2640' }}>{inq.message}</td>
                    <td style={{ padding: '10px 8px', color: inq.resolved ? '#22c55e' : '#ffb020', fontWeight: 700 }}>{inq.resolved ? 'Resolved' : 'Pending'}</td>
                    <td style={{ padding: '10px 8px' }}>
                      {!inq.resolved && (
                        <button onClick={() => handleResolve(inq._id)} className="admin-btn" style={{ background: '#4fd1c5', marginRight: 8 }}>Mark Resolved</button>
                      )}
                      <button onClick={() => handleDelete(inq._id)} className="admin-btn" style={{ background: 'var(--danger)' }}>Delete</button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Inquiries;