import React from 'react';
import { Link, Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import './AdminLayout.css';
import './admin-theme.css';

const AdminLayout = () => {
  const navigate = useNavigate();
  const { logout } = useAuth();
  
  const handleLogout = () => {
    logout();
    navigate('/');
  };
  return (
    <div className="admin-layout">
      <aside className="admin-sidebar">
        <h2>Admin Panel</h2>
        <nav>
          <ul>
            <li><Link to="dashboard">Dashboard</Link></li>
            <li><Link to="inventory">Inventory</Link></li>
            <li><Link to="reports">Stock Reports</Link></li>
            <li><Link to="quarterly-stats">Quarterly Stats</Link></li>
            <li><Link to="categories">Categories</Link></li>
            <li><Link to="inquiries">Inquiries</Link></li>
          </ul>
        </nav>
        <button onClick={handleLogout} style={{ marginTop: '2rem', padding: '10px 0', width: '100%', borderRadius: 6, background: '#ff7f2a', color: '#fff', fontWeight: 700, border: 'none', cursor: 'pointer' }}>Logout</button>
      </aside>
      <main className="admin-content" style={{ background: '#f7fafc', minHeight: '100vh', padding: '2.5rem 1.5rem' }}>
        <Outlet />
      </main>
    </div>
  );
};

export default AdminLayout;