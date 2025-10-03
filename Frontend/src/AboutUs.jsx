import React from 'react';
import { Link } from 'react-router-dom';
import logo2 from './assets/logo2.png';

export default function AboutUs() {
  return (
    <div style={{ background: '#fff', minHeight: '100vh' }}>
      {/* Simple Header */}
      <div style={{
        background: '#1a2640',
        color: '#fff',
        padding: '5rem 2rem 4rem',
        textAlign: 'center'
      }}>
        <h1 style={{ 
          fontSize: '3rem', 
          fontWeight: 700, 
          margin: '0 0 1rem 0'
        }}>About Us</h1>
        <p style={{ 
          fontSize: '1.2rem', 
          color: 'rgba(255,255,255,0.85)',
          maxWidth: '700px',
          margin: '0 auto',
          lineHeight: '1.6'
        }}>
          Mahaveer Tools has been serving industries with premium quality tools and exceptional service for years.
        </p>
      </div>

      {/* Main Content */}
      <div style={{
        maxWidth: '1100px',
        margin: '0 auto',
        padding: '3rem 2rem'
      }}>
        {/* Story Section */}
        <div style={{
          background: '#f8f9fa',
          borderRadius: 12,
          padding: '3rem',
          marginBottom: '3rem'
        }}>
          <h2 style={{
            fontSize: '2rem',
            fontWeight: 700,
            color: '#1a2640',
            marginBottom: '1.5rem'
          }}>Our Story</h2>
          <p style={{
            fontSize: '1.1rem',
            color: '#4a5568',
            lineHeight: '1.8',
            marginBottom: '1rem'
          }}>
            Mahaveer Tools began with a simple mission: to provide industries with reliable, high-quality tools that professionals can trust. Over the years, we've grown from a small shop to a trusted supplier serving businesses across the region.
          </p>
          <p style={{
            fontSize: '1.1rem',
            color: '#4a5568',
            lineHeight: '1.8',
            margin: 0
          }}>
            Our commitment to quality, customer service, and competitive pricing has made us the go-to destination for industrial tools and equipment.
          </p>
        </div>

        {/* What We Offer */}
        <div style={{ marginBottom: '3rem' }}>
          <h2 style={{
            fontSize: '2rem',
            fontWeight: 700,
            color: '#1a2640',
            marginBottom: '2rem',
            textAlign: 'center'
          }}>What We Offer</h2>
          
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
            gap: '2rem'
          }}>
            {[
              { 
                title: 'Quality Products',
                desc: 'Premium industrial tools from trusted brands',
                icon: '⚙️'
              },
              { 
                title: 'Expert Advice',
                desc: 'Professional guidance for your specific needs',
                icon: '💡'
              },
              { 
                title: 'Competitive Pricing',
                desc: 'Best value for your investment',
                icon: '💰'
              },
              { 
                title: 'Fast Delivery',
                desc: 'Quick and reliable shipping services',
                icon: '�'
              }
            ].map((item, index) => (
              <div key={index} style={{
                background: '#fff',
                border: '2px solid #e5e7eb',
                borderRadius: 12,
                padding: '2rem',
                textAlign: 'center',
                transition: 'all 0.3s ease'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = '#1a2640';
                e.currentTarget.style.transform = 'translateY(-5px)';
                e.currentTarget.style.boxShadow = '0 8px 20px rgba(26,38,64,0.1)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = '#e5e7eb';
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = 'none';
              }}>
                <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>{item.icon}</div>
                <h3 style={{
                  fontSize: '1.3rem',
                  fontWeight: 700,
                  color: '#1a2640',
                  marginBottom: '0.5rem'
                }}>{item.title}</h3>
                <p style={{
                  fontSize: '1rem',
                  color: '#6b7280',
                  margin: 0,
                  lineHeight: '1.5'
                }}>{item.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* CTA Section */}
        <div style={{
          background: '#1a2640',
          borderRadius: 12,
          padding: '3rem 2rem',
          textAlign: 'center',
          color: '#fff'
        }}>
          <h2 style={{
            fontSize: '2rem',
            fontWeight: 700,
            marginBottom: '1rem'
          }}>Ready to Get Started?</h2>
          <p style={{
            fontSize: '1.1rem',
            marginBottom: '2rem',
            color: 'rgba(255,255,255,0.85)',
            maxWidth: '600px',
            margin: '0 auto 2rem'
          }}>
            Browse our extensive collection or get in touch with our team for personalized assistance.
          </p>
          <div style={{
            display: 'flex',
            gap: '1rem',
            justifyContent: 'center',
            flexWrap: 'wrap'
          }}>
            <Link to="/categories" style={{
              background: '#fff',
              color: '#1a2640',
              padding: '1rem 2.5rem',
              borderRadius: 8,
              textDecoration: 'none',
              fontWeight: 600,
              fontSize: '1.1rem',
              transition: 'all 0.3s ease',
              display: 'inline-block'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-2px)';
              e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.2)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = 'none';
            }}>
              Browse Products
            </Link>
            <Link to="/contact" style={{
              background: 'transparent',
              border: '2px solid #fff',
              color: '#fff',
              padding: '1rem 2.5rem',
              borderRadius: 8,
              textDecoration: 'none',
              fontWeight: 600,
              fontSize: '1.1rem',
              transition: 'all 0.3s ease',
              display: 'inline-block'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = '#fff';
              e.currentTarget.style.color = '#1a2640';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'transparent';
              e.currentTarget.style.color = '#fff';
            }}>
              Contact Us
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
