import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import logo from '../assets/logo.png';
import { useAuth } from '../contexts/AuthContext';
import { useCart } from '../contexts/CartContext';
import ProfileEditModal from './ProfileEditModal';

function Navbar({ setCartOpen }) {
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
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
    function handleResize() {
      setIsMobile(window.innerWidth <= 768);
      if (window.innerWidth > 768) {
        setMobileMenuOpen(false);
      }
    }
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
  fetch('https://mahaveer-tools.onrender.com/api/categories')
        .then(res => res.json())
        .then(data => setCategories(data))
        .catch(() => setCategories([]));
  }, []);

  useEffect(() => {
    // Close dropdowns when clicking outside
    function handleClickOutside(event) {
      if (profileDropdown && !event.target.closest('[data-profile-dropdown]')) {
        setProfileDropdown(false);
      }
      if (mobileMenuOpen && !event.target.closest('[data-mobile-menu]')) {
        setMobileMenuOpen(false);
      }
    }
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [profileDropdown, mobileMenuOpen]);

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
      padding: isMobile ? '0.75rem 1rem' : '1.0rem 2rem',
      minHeight: isMobile ? 56 : 64,
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      zIndex: 1000,
      width: '100%',
      boxSizing: 'border-box',
      flexWrap: 'nowrap'
    }}>
      {/* Left: Logo + Brand */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: isMobile ? 8 : 16,
          flex: isMobile ? '1' : 'none',
          minWidth: 0
        }}
      >
        <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: isMobile ? 8 : 16, textDecoration: 'none', minWidth: 0 }}>
          <img 
            src={logo} 
            alt="Mahaveer Tools Logo" 
            style={{ 
              height: isMobile ? 32 : 40, 
              width: isMobile ? 32 : 40, 
              borderRadius: 4, 
              objectFit: 'contain',
              flexShrink: 0
            }} 
          />
          <span style={{ 
            fontWeight: 700, 
            fontSize: isMobile ? 16 : 26, 
            color: '#1a2640', 
            letterSpacing: 0.5, 
            transition: 'color 0.2s ease',
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis'
          }}>
            {isMobile ? 'Mahaveer' : 'Mahaveer Tools'}
          </span>
        </Link>
      </div>

      {/* Center: Menu (Desktop only) */}
      {!isMobile && (
        <div style={{ display: 'flex', alignItems: 'center', gap: 32, flex: 1, justifyContent: 'center' }}>
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
      )}

      {/* Right: User, Cart, and Mobile Menu Icons */}
      <div style={{ 
        display: 'flex', 
        alignItems: 'center', 
        gap: isMobile ? 12 : 20, 
        marginLeft: isMobile ? 8 : 24,
        flexShrink: 0
      }}>
        {/* User Icon */}
        <div 
          style={{ 
            cursor: 'pointer',
            padding: isMobile ? '6px' : '8px',
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
            if (!isMobile) {
              e.currentTarget.style.backgroundColor = '#f3f4f6';
              const svg = e.currentTarget.querySelector('svg');
              if (svg) svg.style.stroke = '#1a2640';
            }
          }}
          onMouseLeave={(e) => {
            if (!isMobile) {
              e.currentTarget.style.backgroundColor = 'transparent';
              const svg = e.currentTarget.querySelector('svg');
              if (svg) svg.style.stroke = '#222';
            }
          }}
          data-profile-dropdown
        >
          {user?.profilePic ? (
            <img 
              src={user.profilePic} 
              alt="Profile" 
              style={{ 
                width: isMobile ? 28 : 32, 
                height: isMobile ? 28 : 32, 
                borderRadius: '50%', 
                objectFit: 'cover' 
              }} 
            />
          ) : (
            <svg 
              width={isMobile ? "22" : "24"} 
              height={isMobile ? "22" : "24"} 
              viewBox="0 0 24 24" 
              fill="none" 
              stroke="#222" 
              strokeWidth="1.7" 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              style={{ transition: 'stroke 0.2s ease' }}
            >
              <circle cx="12" cy="8" r="4"/>
              <path d="M4 20c0-2.5 3.5-4 8-4s8 1.5 8 4"/>
            </svg>
          )}
          {user && profileDropdown && (
            <div style={{
              position: 'fixed',
              top: isMobile ? 60 : 'auto',
              bottom: isMobile ? 'auto' : 'auto',
              right: isMobile ? 10 : 'auto',
              left: isMobile ? 'auto' : 'auto',
              ...(isMobile ? {} : {
                position: 'absolute',
                top: 44,
                right: 0
              }),
              background: '#fff',
              boxShadow: '0 4px 24px rgba(30,41,59,0.15)',
              borderRadius: 10,
              minWidth: isMobile ? 180 : 160,
              maxWidth: isMobile ? '90vw' : '160px',
              zIndex: 1001,
              padding: '0.5rem 0',
              textAlign: 'left',
              border: '1px solid #e5e7eb'
            }}>
              <div style={{ 
                padding: '10px 18px', 
                color: '#1a2640', 
                fontWeight: 700, 
                fontSize: 15, 
                borderBottom: '1px solid #e5e7eb',
                wordBreak: 'break-word'
              }}>
                {user.name}
                {user.role === 'admin' && (
                  <div style={{ fontSize: 12, color: '#ff7f2a', fontWeight: 600, marginTop: 2 }}>ADMIN</div>
                )}
              </div>
              <button 
                onClick={() => { navigate('/profile'); setProfileDropdown(false); }} 
                style={{ 
                  width: '100%', 
                  background: 'none', 
                  border: 'none', 
                  color: '#1a2640', 
                  fontWeight: 700, 
                  fontSize: 15, 
                  padding: '10px 18px', 
                  cursor: 'pointer', 
                  textAlign: 'left', 
                  transition: 'all 0.2s ease' 
                }}
                onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = '#e5e7eb'; }}
                onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'transparent'; }}
              >Profile</button>
              {user.role === 'admin' && (
                <button 
                  onClick={() => { navigate('/admin/dashboard'); setProfileDropdown(false); }} 
                  style={{ 
                    width: '100%', 
                    background: 'none', 
                    border: 'none', 
                    color: '#ff7f2a', 
                    fontWeight: 700, 
                    fontSize: 15, 
                    padding: '10px 18px', 
                    cursor: 'pointer', 
                    textAlign: 'left', 
                    transition: 'all 0.2s ease' 
                  }}
                  onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = '#f3f4f6'; }}
                  onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'transparent'; }}
                >Admin Panel</button>
              )}
              <button 
                onClick={handleLogout} 
                style={{ 
                  width: '100%', 
                  background: 'none', 
                  border: 'none', 
                  color: '#ff4d4f', 
                  fontWeight: 700, 
                  fontSize: 15, 
                  padding: '10px 18px', 
                  cursor: 'pointer', 
                  textAlign: 'left', 
                  transition: 'all 0.2s ease' 
                }}
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
            marginRight: isMobile ? 0 : 24,
            padding: isMobile ? '6px' : '8px',
            borderRadius: '6px',
            transition: 'all 0.2s ease',
            textDecoration: 'none',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: 'transparent'
          }} 
          onMouseEnter={(e) => {
            if (!isMobile) {
              e.currentTarget.style.backgroundColor = '#f3f4f6';
              const svg = e.currentTarget.querySelector('svg');
              if (svg) svg.style.stroke = '#1a2640';
            }
          }}
          onMouseLeave={(e) => {
            if (!isMobile) {
              e.currentTarget.style.backgroundColor = 'transparent';
              const svg = e.currentTarget.querySelector('svg');
              if (svg) svg.style.stroke = '#222';
            }
          }}
        >
          <svg 
            width={isMobile ? "22" : "24"} 
            height={isMobile ? "22" : "24"} 
            viewBox="0 0 24 24" 
            fill="none" 
            stroke="#222" 
            strokeWidth="1.7" 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            style={{ transition: 'stroke 0.2s ease' }}
          >
            <circle cx="9" cy="21" r="1"/>
            <circle cx="20" cy="21" r="1"/>
            <path d="M1 1h2l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/>
          </svg>
          {getCartItemCount() > 0 && (
            <span style={{ 
              position: 'absolute', 
              top: -4, 
              right: -4, 
              background: '#ff7f2a', 
              color: '#fff', 
              borderRadius: '50%', 
              padding: '2px 6px', 
              fontSize: 10, 
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

        {/* Mobile Hamburger Menu */}
        {isMobile && (
          <button
            style={{
              background: 'none',
              border: 'none',
              padding: 6,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              fontSize: 24
            }}
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle menu"
            data-mobile-menu
          >
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#1a2640" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="3" y1="6" x2="21" y2="6" />
              <line x1="3" y1="12" x2="21" y2="12" />
              <line x1="3" y1="18" x2="21" y2="18" />
            </svg>
          </button>
        )}
      </div>

      {/* Mobile Menu Dropdown */}
      {isMobile && mobileMenuOpen && (
        <div style={{
          position: 'fixed',
          top: isMobile ? 56 : 64,
          left: 0,
          width: '100vw',
          maxHeight: 'calc(100vh - 56px)',
          overflowY: 'auto',
          background: '#fff',
          boxShadow: '0 4px 20px rgba(0,0,0,0.15)',
          borderBottom: '1px solid #e5e7eb',
          zIndex: 999,
          padding: '1rem 0',
          display: 'flex',
          flexDirection: 'column'
        }}
        data-mobile-menu
        >
          {!isHomePage && (
            <Link 
              to="/" 
              style={{ 
                fontWeight: 500, 
                fontSize: 16, 
                color: '#1a2640', 
                textDecoration: 'none', 
                padding: '12px 24px',
                borderBottom: '1px solid #f3f4f6'
              }} 
              onClick={() => setMobileMenuOpen(false)}
            >
              Home
            </Link>
          )}
          
          {/* Products with subcategories */}
          <div>
            <div style={{ 
              fontWeight: 600, 
              fontSize: 16, 
              color: '#1a2640', 
              padding: '12px 24px',
              borderBottom: '1px solid #f3f4f6',
              background: '#f8f9fa'
            }}>
              Products
            </div>
            {categories?.map(cat => (
              <Link 
                key={cat._id || cat.id} 
                to={`/categories/${cat._id || cat.id}`} 
                style={{ 
                  display: 'block', 
                  color: '#555', 
                  textDecoration: 'none', 
                  padding: '10px 40px',
                  fontSize: 14,
                  borderBottom: '1px solid #f8f9fa'
                }} 
                onClick={() => setMobileMenuOpen(false)}
              >
                {cat.name}
              </Link>
            ))}
          </div>
          
          <Link 
            to="/about" 
            style={{ 
              fontWeight: 500, 
              fontSize: 16, 
              color: '#1a2640', 
              textDecoration: 'none', 
              padding: '12px 24px',
              borderBottom: '1px solid #f3f4f6'
            }} 
            onClick={() => setMobileMenuOpen(false)}
          >
            About
          </Link>
          
          <Link 
            to="/contact" 
            style={{ 
              fontWeight: 500, 
              fontSize: 16, 
              color: '#1a2640', 
              textDecoration: 'none', 
              padding: '12px 24px'
            }} 
            onClick={() => setMobileMenuOpen(false)}
          >
            Contact us
          </Link>
        </div>
      )}
    </nav>
  );
}

export default Navbar;