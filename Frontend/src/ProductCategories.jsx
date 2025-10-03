import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import logo2 from './assets/logo2.png';

export default function ProductCategories() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
  fetch('https://mahaveer-tools.onrender.com/api/categories')
      .then(res => res.json())
      .then(data => {
        setCategories(data);
        setLoading(false);
      })
      .catch(() => {
        setCategories([]);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return <div style={{ minHeight: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 24, color: '#1a2640' }}>Loading...</div>;
  }

  return (
    <div style={{ width: '100vw', overflowX: 'hidden', background: '#f8f9fa' }}>
      {/* Hero Section */}
      <div style={{
        minHeight: '70vh',
        width: '100vw',
        background: 'linear-gradient(135deg, #1a2640 0%, #2d3748 50%, #4a5568 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
        color: '#fff'
      }}>
        {/* Background Pattern */}
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          opacity: 0.1,
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          pointerEvents: 'none'
        }}></div>
        
        <div style={{
          background: 'rgba(255,255,255,0.1)',
          backdropFilter: 'blur(10px)',
          boxShadow: '0 8px 32px rgba(0,0,0,0.3)',
          borderRadius: 24,
          padding: '3rem 2.5rem',
          maxWidth: 600,
          width: '90vw',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          textAlign: 'center',
          border: '1px solid rgba(255,255,255,0.2)'
        }}>
          {/* Logo */}
          <div style={{ 
            width: 80, 
            height: 80, 
            marginBottom: 24,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            borderRadius: '50%',
            overflow: 'hidden',
            boxShadow: '0 8px 32px rgba(255,255,255,0.2)',
            border: '3px solid rgba(255,255,255,0.3)'
          }}>
            <img src={logo2} alt="Mahaveer Tools Logo" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          </div>
          
          <h1 style={{ 
            fontSize: '3rem', 
            fontWeight: 800, 
            color: '#fff', 
            margin: 0, 
            marginBottom: 16, 
            letterSpacing: '-1px',
            textShadow: '0 2px 10px rgba(0,0,0,0.3)'
          }}>Product Categories</h1>
          
          <p style={{ 
            color: 'rgba(255,255,255,0.9)', 
            fontSize: '1.2rem', 
            lineHeight: '1.6',
            maxWidth: 500,
            fontWeight: 400
          }}>
            Explore our comprehensive range of industrial tools and equipment designed for professional use.
          </p>
        </div>
      </div>

      {/* Categories Grid */}
      <div style={{
        maxWidth: '1200px',
        margin: '0 auto',
        padding: '4rem 2rem',
      }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: '2rem',
          justifyItems: 'center'
        }}>
          {categories.map(cat => (
            <Link
              key={cat._id || cat.id}
              to={`/categories/${cat._id || cat.id}`}
              style={{
                display: 'block',
                width: '100%',
                maxWidth: 350,
                background: '#fff',
                borderRadius: 24,
                padding: '2.5rem',
                textAlign: 'center',
                textDecoration: 'none',
                boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
                transition: 'all 0.3s ease',
                border: '1px solid rgba(26,38,64,0.1)',
                position: 'relative',
                overflow: 'hidden',
                cursor: 'pointer',
                userSelect: 'none'
              }}
              onClick={(e) => {
                console.log('Category clicked:', cat.id, cat.name);
                // Let the Link handle navigation
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-8px)';
                e.currentTarget.style.boxShadow = '0 20px 40px rgba(26,38,64,0.15)';
                e.currentTarget.style.borderColor = '#1a2640';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 8px 32px rgba(0,0,0,0.1)';
                e.currentTarget.style.borderColor = 'rgba(26,38,64,0.1)';
              }}
            >
              {/* Background Gradient Overlay */}
              <div style={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                height: '6px',
                background: 'linear-gradient(135deg, #1a2640, #2d3748)',
                borderRadius: '24px 24px 0 0'
              }}></div>
              
              
              {/* Category Name */}
              <h3 style={{
                fontSize: '1.5rem',
                fontWeight: 700,
                color: '#1a2640',
                margin: '0 0 1rem 0',
                lineHeight: '1.3'
              }}>
                {cat.name}
              </h3>
              
              {/* Category Description */}
              <p style={{
                color: '#6b7280',
                fontSize: '1rem',
                lineHeight: '1.6',
                margin: '0 0 2rem 0'
              }}>
                Professional grade {cat.name.toLowerCase()} for all your industrial needs.
              </p>
              
              {/* View Products Button */}
              <div style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.5rem',
                background: 'linear-gradient(135deg, #1a2640, #2d3748)',
                color: '#fff',
                padding: '0.8rem 1.5rem',
                borderRadius: 12,
                fontSize: '0.95rem',
                fontWeight: 600,
                boxShadow: '0 4px 16px rgba(26,38,64,0.2)'
              }}>
                View Products
                <span style={{ fontSize: '0.8rem' }}>→</span>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Call to Action Section */}
      <div style={{
        background: 'linear-gradient(135deg, #1a2640 0%, #2d3748 50%, #4a5568 100%)',
        padding: '4rem 2rem',
        textAlign: 'center',
        color: '#fff'
      }}>
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
          <h2 style={{
            fontSize: '2.5rem',
            fontWeight: 700,
            marginBottom: '1rem',
            color: '#fff'
          }}>
            Need Help Choosing?
          </h2>
          <p style={{
            fontSize: '1.2rem',
            color: 'rgba(255,255,255,0.9)',
            marginBottom: '2rem',
            lineHeight: '1.6'
          }}>
            Our experts are here to help you find the right tools for your specific requirements.
          </p>
          <Link
            to="/contact"
            style={{
              display: 'inline-block',
              background: '#fff',
              color: '#1a2640',
              padding: '1.2rem 2.5rem',
              borderRadius: 16,
              fontSize: '1.1rem',
              fontWeight: 700,
              textDecoration: 'none',
              boxShadow: '0 8px 24px rgba(255,255,255,0.2)',
              transition: 'all 0.3s ease'
            }}
            onMouseEnter={(e) => {
              e.target.style.transform = 'translateY(-2px)';
              e.target.style.boxShadow = '0 12px 32px rgba(255,255,255,0.3)';
            }}
            onMouseLeave={(e) => {
              e.target.style.transform = 'translateY(0)';
              e.target.style.boxShadow = '0 8px 24px rgba(255,255,255,0.2)';
            }}
          >
            Contact Our Experts
          </Link>
        </div>
      </div>
    </div>
  );
} 