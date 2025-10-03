import React, { useState, useRef } from 'react';

const getCustomers = () => JSON.parse(localStorage.getItem('customers') || '[]');
const saveCustomers = (arr) => localStorage.setItem('customers', JSON.stringify(arr));

const ProfileEditModal = ({ isOpen, onClose, customerName }) => {
  if (!isOpen) return null;
  const customers = getCustomers();
  const current = customers.find(u => u.name === customerName);
  const [form, setForm] = useState(current ? {
    ...current,
    password: '',
    billing: current.billing || '',
    shipping: current.shipping || '',
    profilePic: current.profilePic || '',
  } : { name: '', email: '', password: '', billing: '', shipping: '', profilePic: '' });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const fileInputRef = useRef();

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handlePicChange = e => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = ev => {
        setForm(f => ({ ...f, profilePic: ev.target.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = e => {
    e.preventDefault();
    setError(''); setSuccess('');
    if (!form.name || !form.email) {
      setError('Name and email are required');
      return;
    }
    let updated = customers.map(u =>
      u.name === customerName ? {
        ...u,
        name: form.name,
        email: form.email,
        password: form.password || u.password,
        billing: form.billing,
        shipping: form.shipping,
        profilePic: form.profilePic,
      } : u
    );
    saveCustomers(updated);
    localStorage.setItem('customer-name', form.name);
    setSuccess('Profile updated!');
    setTimeout(() => { onClose(); window.location.reload(); }, 900);
  };

  const inputStyle = {
    width: '100%',
    padding: 10,
    borderRadius: 8,
    border: '1.5px solid #cbd5e1',
    fontSize: 15,
    outline: 'none',
    marginBottom: 2,
    background: '#fff',
    color: '#1a2640',
  };

  return (
    <div style={{
      position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh',
      background: 'rgba(30,41,59,0.35)', zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center'
    }} onClick={onClose}>
      <form onClick={e => e.stopPropagation()} onSubmit={handleSubmit} style={{
        background: '#fff', borderRadius: 18, boxShadow: '0 8px 40px rgba(30,41,59,0.18)', minWidth: 340, maxWidth: 370, padding: '2.5rem 2rem', display: 'flex', flexDirection: 'column', alignItems: 'center', position: 'relative'
      }}>
        <h2 style={{ marginBottom: 18, textAlign: 'center', color: '#1a2640', fontWeight: 800, fontSize: 26 }}>Edit Profile</h2>
        <div style={{ marginBottom: 16, width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          {form.profilePic && (
            <img src={form.profilePic} alt="Profile" style={{ width: 70, height: 70, borderRadius: '50%', objectFit: 'cover', marginBottom: 10, border: '2px solid #1a2640' }} />
          )}
          <input type="file" accept="image/*" ref={fileInputRef} onChange={handlePicChange} style={{ display: 'none' }} />
          <button type="button" onClick={() => fileInputRef.current && fileInputRef.current.click()} style={{ background: '#f3f4f6', color: '#1a2640', border: 'none', borderRadius: 8, padding: '7px 16px', fontWeight: 700, fontSize: 15, cursor: 'pointer', marginBottom: 8 }}>Upload Profile Picture</button>
        </div>
        <div style={{ marginBottom: 16, width: '100%' }}>
          <label style={{ fontWeight: 600, color: '#1a2640', fontSize: 15 }}>Name</label>
          <input name="name" value={form.name} onChange={handleChange} style={inputStyle} />
        </div>
        <div style={{ marginBottom: 16, width: '100%' }}>
          <label style={{ fontWeight: 600, color: '#1a2640', fontSize: 15 }}>Email</label>
          <input name="email" value={form.email} onChange={handleChange} style={inputStyle} />
        </div>
        <div style={{ marginBottom: 16, width: '100%' }}>
          <label style={{ fontWeight: 600, color: '#1a2640', fontSize: 15 }}>Password</label>
          <input name="password" type="password" value={form.password} onChange={handleChange} style={inputStyle} placeholder="Leave blank to keep current password" />
        </div>
        <div style={{ marginBottom: 16, width: '100%' }}>
          <label style={{ fontWeight: 600, color: '#1a2640', fontSize: 15 }}>Billing Address</label>
          <input name="billing" value={form.billing} onChange={handleChange} style={inputStyle} />
        </div>
        <div style={{ marginBottom: 16, width: '100%' }}>
          <label style={{ fontWeight: 600, color: '#1a2640', fontSize: 15 }}>Shipping Address</label>
          <input name="shipping" value={form.shipping} onChange={handleChange} style={inputStyle} />
        </div>
        {error && <div style={{ color: '#ff4d4f', marginBottom: 12, fontWeight: 600 }}>{error}</div>}
        {success && <div style={{ color: '#22c55e', marginBottom: 12, fontWeight: 600 }}>{success}</div>}
        <button type="submit" style={{ width: '100%', padding: 12, borderRadius: 8, background: '#1a2640', color: '#fff', fontWeight: 700, border: 'none', fontSize: 16, marginBottom: 8, marginTop: 4, cursor: 'pointer', boxShadow: '0 2px 8px rgba(30,41,59,0.08)' }}>Save</button>
        <button type="button" onClick={onClose} style={{ width: '100%', padding: 12, borderRadius: 8, background: '#f3f4f6', color: '#1a2640', fontWeight: 700, border: 'none', fontSize: 16, cursor: 'pointer', marginTop: 8 }}>Cancel</button>
      </form>
    </div>
  );
};

export default ProfileEditModal;