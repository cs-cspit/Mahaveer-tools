import React from 'react';
import { useNavigate } from 'react-router-dom';

const features = [
  {
    title: 'Inventory Management',
    desc: 'Add, edit, and manage all products and stock levels.',
    comingSoon: false,
    link: '/admin/inventory',
  },
  {
    title: 'Stock Reports',
    desc: 'Generate and export current stock and low stock reports.',
    comingSoon: true,
    link: null,
  },
  {
    title: 'Quarterly Stats',
    desc: 'Visualize sales and stock movement by quarter.',
    comingSoon: true,
    link: null,
  },
  {
    title: 'Category Management',
    desc: 'Create, edit, and organize product categories.',
    comingSoon: false,
    link: '/admin/categories',
  },
  {
    title: 'User Inquiries',
    desc: 'View and respond to customer messages and inquiries.',
    comingSoon: false,
    link: '/admin/inquiries',
  },
];

const cardStyle = {
  background: '#fff',
  borderRadius: 16,
  boxShadow: '0 4px 24px rgba(30,41,59,0.10)',
  padding: '2rem 1.5rem',
  minWidth: 220,
  margin: '1rem',
  textAlign: 'left',
  flex: 1,
  display: 'flex',
  flexDirection: 'column',
  position: 'relative',
  maxWidth: 320,
  cursor: 'pointer',
  transition: 'box-shadow 0.2s, transform 0.2s',
};

const badgeStyle = {
  position: 'absolute',
  top: 18,
  right: 18,
  background: '#ffb020',
  color: '#fff',
  borderRadius: 8,
  padding: '4px 12px',
  fontWeight: 700,
  fontSize: 13,
  letterSpacing: 0.5,
};

const Dashboard = () => {
  const navigate = useNavigate();
  const handleCardClick = (feature) => {
    if (feature.link) {
      navigate(feature.link);
    } else {
      alert('This feature is coming soon!');
    }
  };
  return (
    <div style={{ maxWidth: 1100, margin: '0 auto', padding: '2rem 0' }}>
      <h1 style={{ color: '#1a2640', fontWeight: 800, fontSize: 32, marginBottom: 32 }}>Admin Dashboard</h1>
      <div style={{ display: 'flex', gap: 24, flexWrap: 'wrap', justifyContent: 'center' }}>
        {features.map((f, i) => (
          <div
            key={i}
            style={cardStyle}
            onClick={() => handleCardClick(f)}
            onMouseEnter={e => {
              e.currentTarget.style.boxShadow = '0 8px 32px rgba(30,41,59,0.13)';
              e.currentTarget.style.transform = 'translateY(-2px) scale(1.03)';
            }}
            onMouseLeave={e => {
              e.currentTarget.style.boxShadow = cardStyle.boxShadow;
              e.currentTarget.style.transform = 'none';
            }}
          >
            <div style={{ fontSize: 22, fontWeight: 700, color: '#1a2640', marginBottom: 10 }}>{f.title}</div>
            <div style={{ color: '#64748b', fontWeight: 500, fontSize: 16, marginBottom: 18 }}>{f.desc}</div>
            {f.comingSoon && <span style={badgeStyle}>Coming Soon</span>}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Dashboard;