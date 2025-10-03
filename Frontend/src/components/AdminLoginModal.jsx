import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import logo from '../assets/logo2.png';

const ADMIN_USER = 'admin';
const ADMIN_PASS = 'admin123';

const AdminLoginModal = ({ isOpen, onClose }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  if (!isOpen) return null;

  const handleLogin = (e) => {
    e.preventDefault();
    if (username === ADMIN_USER && password === ADMIN_PASS) {
      localStorage.setItem('admin-auth', 'true');
      onClose();
      navigate('/admin/dashboard');
    } else {
      setError('Invalid credentials');
    }
  };

  return (
    <div style={{
      position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh',
      background: 'rgba(30,41,59,0.35)', zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center'
    }} onClick={onClose}>
      <form onClick={e => e.stopPropagation()} onSubmit={handleLogin} style={{
        background: '#fff', padding: '2.5rem 2rem', borderRadius: 18, boxShadow: '0 8px 40px rgba(30,41,59,0.18)', minWidth: 340, maxWidth: 370, display: 'flex', flexDirection: 'column', alignItems: 'center', position: 'relative'
      }}>
        <img src={logo} alt="Admin Login" style={{ width: 60, height: 60, marginBottom: 18, borderRadius: 12, boxShadow: '0 2px 8px rgba(30,41,59,0.10)' }} />
        <h2 style={{ marginBottom: 18, textAlign: 'center', color: '#1a2640', fontWeight: 800, fontSize: 26 }}>Admin Login</h2>
        <div style={{ marginBottom: 16, width: '100%' }}>
          <label style={{ fontWeight: 600, color: '#1a2640', fontSize: 15 }}>Username</label>
          <input type="text" value={username} onChange={e => setUsername(e.target.value)} style={{ width: '100%', padding: 10, borderRadius: 8, border: '1.5px solid #cbd5e1', marginTop: 6, fontSize: 15, outline: 'none', marginBottom: 2 }} />
        </div>
        <div style={{ marginBottom: 16, width: '100%' }}>
          <label style={{ fontWeight: 600, color: '#1a2640', fontSize: 15 }}>Password</label>
          <input type="password" value={password} onChange={e => setPassword(e.target.value)} style={{ width: '100%', padding: 10, borderRadius: 8, border: '1.5px solid #cbd5e1', marginTop: 6, fontSize: 15, outline: 'none', marginBottom: 2 }} />
        </div>
        {error && <div style={{ color: '#ff4d4f', marginBottom: 12, fontWeight: 600 }}>{error}</div>}
        <button type="submit" style={{ width: '100%', padding: 12, borderRadius: 8, background: '#1a2640', color: '#fff', fontWeight: 700, border: 'none', fontSize: 16, marginBottom: 8, marginTop: 4, cursor: 'pointer', boxShadow: '0 2px 8px rgba(30,41,59,0.08)' }}>Login</button>
        <button type="button" onClick={onClose} style={{ width: '100%', padding: 12, borderRadius: 8, background: '#f3f4f6', color: '#1a2640', fontWeight: 700, border: 'none', fontSize: 16, cursor: 'pointer' }}>Cancel</button>
      </form>
    </div>
  );
};

export default AdminLoginModal;