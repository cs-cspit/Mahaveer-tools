import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import logo from '../assets/logo.png';
import { useAuth } from '../contexts/AuthContext';
import { useCart } from '../contexts/CartContext';
import ProfileEditModal from './ProfileEditModal';

function Navbar({ setCartOpen }) {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [dropdownLock, setDropdownLock] = useState(false);
  const [profileDropdown, setProfileDropdown] = useState(false);
  const [profileEditOpen, setProfileEditOpen] = useState(false);
  const [categories, setCategories] = useState([]);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const { getCartItemCount } = useCart();

  useEffect(() => {
    fetch('http://localhost:5000/api/categories')
      .then(res => res.json())
      .then(data => setCategories(data))
      .catch(() => setCategories([]));
  }, []);

  const handleLogout = () => {
    logout();
    setProfileDropdown(false);
    navigate('/');
  };

  // Check if we're on the home page
  const isHomePage = location.pathname === '/';

  return (
    <nav style={{
      background: '#fff',
      boxShadow: '0 2px 10px rgba(0,0,0,0.05)',
      borderBottom: '1px solid #e5e7eb',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '1.0rem 2rem',
      minHeight: 64,
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      zIndex: 1000,
      width: '100%',
      boxSizing: 'border-box',
    }}>
      {/* Left: Logo + Brand */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 16,
          marginRight: 24,
          padding: '8px 12px',
          borderRadius: '6px',
          transition: 'all 0.2s ease',
          cursor: 'pointer',
          backgroundColor: 'transparent'
        }}
      >
        <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: 16, textDecoration: 'none' }}>
          <img src={logo} alt="Mahaveer Tools Logo" style={{ height: 40, width: 40, borderRadius: 4, objectFit: 'contain', marginLeft: 24 }} />
          <span style={{ fontWeight: 700, fontSize: 26, color: '#1a2640', letterSpacing: 0.5, transition: 'color 0.2s ease' }}>Mahaveer Tools</span>
        </Link>
      </div>

      {/* Center: Menu */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 32 }}>
        {/* Show Home button only when NOT on home page */}
        {!isHomePage && (
          <Link 
            to="/" 
            style={{ 
              fontWeight: 500, 
              fontSize: 16, 
              color: '#222', 
              textDecoration: 'none', 
              transition: 'all 0.2s ease',
              padding: '8px 12px',
              borderRadius: '6px',
              backgroundColor: 'transparent'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = '#f3f4f6';
              e.currentTarget.style.color = '#1a2640';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'transparent';
              e.currentTarget.style.color = '#222';
            }}
          >Home</Link>
        )}

        <div style={{ position: 'relative' }}
          onMouseEnter={() => {
            setDropdownOpen(true);
            setDropdownLock(false);
          }}
          onMouseLeave={() => {
            if (!dropdownLock) {
              setTimeout(() => {
                if (!dropdownLock) {
                  setDropdownOpen(false);
                }
              }, 100);
            }
          }}
        >
          <span 
            style={{ 
              fontWeight: 500, 
              fontSize: 16, 
              color: '#222', 
              cursor: 'pointer', 
              display: 'flex', 
              alignItems: 'center', 
              gap: 4,
              padding: '8px 12px',
              borderRadius: '6px',
              transition: 'all 0.2s ease',
              backgroundColor: 'transparent'
            }}
            onClick={() => {
              setDropdownOpen(!dropdownOpen);
              setDropdownLock(!dropdownLock);
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = '#f3f4f6';
              e.currentTarget.style.color = '#1a2640';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'transparent';
              e.currentTarget.style.color = '#222';
            }}
          >
            Products
            <svg width="16" height="16" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M6 8L10 12L14 8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </span>
          {dropdownOpen && (
            <div 
              style={{ 
                position: 'absolute', 
                top: '100%', 
                left: 0, 
                background: '#fff', 
                border: '1px solid #e5e7eb', 
                borderRadius: 8, 
                boxShadow: '0 8px 16px rgba(0,0,0,0.08)', 
                minWidth: 180, 
                zIndex: 1000,
                marginTop: '4px'
              }}
              onMouseEnter={() => {
                setDropdownOpen(true);
                setDropdownLock(false);
              }}
              onMouseLeave={() => {
                setTimeout(() => {
                  if (!dropdownLock) {
                    setDropdownOpen(false);
                  }
                }, 150);
              }}
            >
              {categories?.map(cat => (
                <Link 
                  key={cat._id || cat.id} 
                  to={`/categories/${cat._id || cat.id}`} 
                  style={{ 
                    display: 'block', 
                    color: '#222', 
                    textDecoration: 'none', 
                    padding: '0.7rem 1.2rem', 
                    fontWeight: 500, 
                    fontSize: 15, 
                    borderRadius: 6, 
                    transition: 'all 0.2s ease',
                    backgroundColor: 'transparent'
                  }}
                  onMouseEnter={e => {
                    e.currentTarget.style.background = '#e5e7eb';
                    e.currentTarget.style.color = '#1a2640';
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.background = 'transparent';
                    e.currentTarget.style.color = '#222';
                  }}
                  onClick={() => {
                    setDropdownOpen(false);
                    setDropdownLock(false);
                  }}
                >{cat.name}</Link>
              ))}
            </div>
          )}
        </div>

        <Link 
          to="/about" 
          style={{ 
            fontWeight: 500, 
            fontSize: 16, 
            color: '#222', 
            textDecoration: 'none', 
            transition: 'all 0.2s ease',
            padding: '8px 12px',
            borderRadius: '6px',
            backgroundColor: 'transparent'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = '#f3f4f6';
            e.currentTarget.style.color = '#1a2640';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = 'transparent';
            e.currentTarget.style.color = '#222';
          }}
        >About</Link>

        <Link 
          to="/contact" 
          style={{ 
            fontWeight: 500, 
            fontSize: 16, 
            color: '#222', 
            textDecoration: 'none', 
            transition: 'all 0.2s ease',
            padding: '8px 12px',
            borderRadius: '6px',
            backgroundColor: 'transparent'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = '#f3f4f6';
            e.currentTarget.style.color = '#1a2640';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = 'transparent';
            e.currentTarget.style.color = '#222';
          }}
        >Contact us</Link>
      </div>

      {/* Right: User and Cart Icons */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 20, marginLeft: 24 }}>
        {/* User Icon */}
        <div 
          style={{ 
            cursor: 'pointer',
            padding: '8px',
            borderRadius: '6px',
            transition: 'all 0.2s ease',
            position: 'relative',
            backgroundColor: 'transparent'
          }}
          onClick={() => {
            if (user) {
              setProfileDropdown(!profileDropdown);
            } else {
              navigate('/login');
            }
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = '#f3f4f6';
            const svg = e.currentTarget.querySelector('svg');
            if (svg) svg.style.stroke = '#1a2640';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = 'transparent';
            const svg = e.currentTarget.querySelector('svg');
            if (svg) svg.style.stroke = '#222';
          }}
        >
          {user?.profilePic ? (
            <img src={user.profilePic} alt="Profile" style={{ width: 32, height: 32, borderRadius: '50%', objectFit: 'cover' }} />
          ) : (
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#222" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" style={{ transition: 'stroke 0.2s ease' }}>
              <circle cx="12" cy="8" r="4"/>
              <path d="M4 20c0-2.5 3.5-4 8-4s8 1.5 8 4"/>
            </svg>
          )}
          {user && profileDropdown && (
            <div style={{
              position: 'absolute',
              top: 44,
              right: 0,
              background: '#fff',
              boxShadow: '0 4px 24px rgba(30,41,59,0.10)',
              borderRadius: 10,
              minWidth: 160,
              zIndex: 1001,
              padding: '0.5rem 0',
              textAlign: 'left',
            }}>
              <div style={{ padding: '10px 18px', color: '#1a2640', fontWeight: 700, fontSize: 15, borderBottom: '1px solid #e5e7eb' }}>
                {user.name}
                {user.role === 'admin' && (
                  <div style={{ fontSize: 12, color: '#ff7f2a', fontWeight: 600, marginTop: 2 }}>ADMIN</div>
                )}
              </div>
              <button 
                onClick={() => { navigate('/profile'); setProfileDropdown(false); }} 
                style={{ width: '100%', background: 'none', border: 'none', color: '#1a2640', fontWeight: 700, fontSize: 15, padding: '10px 18px', cursor: 'pointer', textAlign: 'left', transition: 'all 0.2s ease' }}
                onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = '#e5e7eb'; }}
                onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'transparent'; }}
              >Profile</button>
              {user.role === 'admin' && (
                <button 
                  onClick={() => { navigate('/admin/dashboard'); setProfileDropdown(false); }} 
                  style={{ width: '100%', background: 'none', border: 'none', color: '#ff7f2a', fontWeight: 700, fontSize: 15, padding: '10px 18px', cursor: 'pointer', textAlign: 'left', transition: 'all 0.2s ease' }}
                  onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = '#f3f4f6'; }}
                  onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'transparent'; }}
                >Admin Panel</button>
              )}
              <button 
                onClick={handleLogout} 
                style={{ width: '100%', background: 'none', border: 'none', color: '#ff4d4f', fontWeight: 700, fontSize: 15, padding: '10px 18px', cursor: 'pointer', textAlign: 'left', transition: 'all 0.2s ease' }}
                onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = '#fee'; }}
                onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'transparent'; }}
              >Logout</button>
            </div>
          )}
        </div>
        <ProfileEditModal isOpen={profileEditOpen} onClose={() => setProfileEditOpen(false)} user={user} />
        
        {/* Cart Icon */}
        <Link 
          to="/cart"
          style={{ 
            position: 'relative', 
            cursor: 'pointer',
            marginRight: 24,
            padding: '8px',
            borderRadius: '6px',
            transition: 'all 0.2s ease',
            textDecoration: 'none',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: 'transparent'
          }} 
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = '#f3f4f6';
            const svg = e.currentTarget.querySelector('svg');
            if (svg) svg.style.stroke = '#1a2640';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = 'transparent';
            const svg = e.currentTarget.querySelector('svg');
            if (svg) svg.style.stroke = '#222';
          }}
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#222" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" style={{ transition: 'stroke 0.2s ease' }}>
            <circle cx="9" cy="21" r="1"/>
            <circle cx="20" cy="21" r="1"/>
            <path d="M1 1h2l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/>
          </svg>
          {getCartItemCount() > 0 && (
            <span style={{ 
              position: 'absolute', 
              top: -6, 
              right: -6, 
              background: '#ff7f2a', 
              color: '#fff', 
              borderRadius: '50%', 
              padding: '2px 6px', 
              fontSize: 11, 
              fontWeight: 700,
              minWidth: 16,
              height: 16,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              {getCartItemCount()}
            </span>
          )}
        </Link>
      </div>
    </nav>
  );
}

export default Navbar;
