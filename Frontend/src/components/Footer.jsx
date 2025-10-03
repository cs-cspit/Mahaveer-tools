import React from 'react';
import { Link } from 'react-router-dom';
import logo from '../assets/logo.png';

function Footer({ categories }) {
  return (
    <footer style={{
      background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #334155 100%)',
      color: '#fff',
      padding: '4rem 0 2rem',
      marginTop: '4rem',
      position: 'relative',
      overflow: 'hidden'
    }}>
      {/* Background Pattern */}
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        opacity: 0.05,
        backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        pointerEvents: 'none'
      }}></div>
      
      <div style={{
        maxWidth: '1200px',
        margin: '0 auto',
        padding: '0 2rem',
        position: 'relative'
      }}>
        {/* Main Footer Content */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: '3rem',
          marginBottom: '3rem'
        }}>
          {/* Company Info */}
          <div>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '16px',
              marginBottom: '1.5rem'
            }}>
              <div style={{
                background: 'linear-gradient(135deg, #ff7f2a, #ff6b1a)',
                padding: '8px',
                borderRadius: '12px',
                boxShadow: '0 4px 20px rgba(255, 127, 42, 0.3)'
              }}>
                <img src={logo} alt="Mahaveer Tools Logo" style={{ height: 36, width: 36, borderRadius: 6, objectFit: 'contain' }} />
              </div>
              <span style={{ fontWeight: 800, fontSize: 28, color: '#fff', letterSpacing: '-0.5px' }}>Mahaveer Tools</span>
            </div>
            <p style={{
              color: '#cbd5e1',
              lineHeight: '1.7',
              marginBottom: '2rem',
              fontSize: '1.05rem'
            }}>
              Your trusted partner for premium industrial tools. We deliver precision, reliability, and excellence in every product we offer.
            </p>
            <div style={{
              display: 'flex',
              gap: '1.5rem'
            }}>
              {/* Email Icon */}
              <svg width="24" height="24" fill="#cbd5e1" viewBox="0 0 24 24" style={{ cursor: 'pointer' }}>
                <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/>
              </svg>
              
              {/* Phone Icon */}
              <svg width="24" height="24" fill="#cbd5e1" viewBox="0 0 24 24" style={{ cursor: 'pointer' }}>
                <path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z"/>
              </svg>
              
              {/* Location Icon */}
              <svg width="24" height="24" fill="#cbd5e1" viewBox="0 0 24 24" style={{ cursor: 'pointer' }}>
                <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
              </svg>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 style={{
              fontSize: '1.4rem',
              fontWeight: '700',
              marginBottom: '1.5rem',
              color: '#fff',
              position: 'relative',
              paddingBottom: '0.5rem'
            }}>
              Quick Links
              <div style={{
                position: 'absolute',
                bottom: 0,
                left: 0,
                width: '30px',
                height: '3px',
                background: 'linear-gradient(90deg, #ff7f2a, #ff6b1a)',
                borderRadius: '2px'
              }}></div>
            </h4>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
              {[
                { to: "/", label: "Home" },
                { to: "/categories", label: "Products" },
                { to: "/about", label: "About Us" },
                { to: "/contact", label: "Contact Us" }
              ].map((link, index) => (
                <li key={index} style={{ marginBottom: '0.8rem' }}>
                  <Link to={link.to} style={{
                    color: '#cbd5e1',
                    textDecoration: 'none',
                    transition: 'all 0.3s ease',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    fontSize: '1.05rem',
                    padding: '4px 0'
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.color = '#ff7f2a';
                    e.target.style.paddingLeft = '8px';
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.color = '#cbd5e1';
                    e.target.style.paddingLeft = '0px';
                  }}>
                    <span style={{ fontSize: '12px' }}>▶</span>
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Product Categories */}
          <div>
            <h4 style={{
              fontSize: '1.4rem',
              fontWeight: '700',
              marginBottom: '1.5rem',
              color: '#fff',
              position: 'relative',
              paddingBottom: '0.5rem'
            }}>
              Product Categories
              <div style={{
                position: 'absolute',
                bottom: 0,
                left: 0,
                width: '30px',
                height: '3px',
                background: 'linear-gradient(90deg, #ff7f2a, #ff6b1a)',
                borderRadius: '2px'
              }}></div>
            </h4>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
              {categories && categories.slice(0, 4).map((category, index) => (
                <li key={index} style={{ marginBottom: '0.8rem' }}>
                  <Link 
                    to={`/category/${category.name.toLowerCase().replace(/\s+/g, '-')}`}
                    style={{
                      color: '#cbd5e1',
                      textDecoration: 'none',
                      transition: 'all 0.3s ease',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      fontSize: '1.05rem',
                      padding: '4px 0'
                    }}
                    onMouseEnter={(e) => {
                      e.target.style.color = '#ff7f2a';
                      e.target.style.paddingLeft = '8px';
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.color = '#cbd5e1';
                      e.target.style.paddingLeft = '0px';
                    }}>
                    <span style={{ fontSize: '12px' }}>▶</span>
                    {category.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom Footer */}
        <div style={{
          borderTop: '1px solid rgba(148, 163, 184, 0.2)',
          paddingTop: '2rem',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '1rem'
        }}>
          <p style={{ 
            margin: 0, 
            color: '#94a3b8',
            fontSize: '1rem'
          }}>
            © 2025 Mahaveer Tools. All rights reserved.
          </p>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            color: '#94a3b8',
            fontSize: '1rem'
          }}>
            {/* <span>Crafted with</span>
            <span style={{ color: '#ff7f2a', fontSize: '1.2rem' }}>❤️</span>
            <span>for industrial excellence</span> */}
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
