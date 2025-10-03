import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useCart } from './contexts/CartContext';
import logo2 from './assets/logo2.png';

// Helper to get unique subcategories/types from products
function getUniqueSubcategories(products) {
  const set = new Set();
  products.forEach(p => {
    if (p.subcategory) set.add(p.subcategory);
  });
  return Array.from(set);
}

export default function CategoryProducts() {
  const { category } = useParams();
  const { addToCart } = useCart();
  const [cat, setCat] = useState(null);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedSubcategory, setSelectedSubcategory] = useState('');

  // Fetch category info
  useEffect(() => {
    setLoading(true);
  fetch('https://mahaveer-tools.onrender.com/api/categories')
      .then(res => res.json())
      .then(data => {
        let found = data.find(c => c._id === category || c.id === category);
        if (!found) {
          found = data.find(c => (c.id || '').toLowerCase() === category.toLowerCase() || (c.name || '').toLowerCase().replace(/\s+/g, '-') === category.toLowerCase());
        }
        setCat(found);
        setLoading(false);
      })
      .catch(() => {
        setCat(null);
        setLoading(false);
      });
  }, [category]);

  // Fetch products for this category
  useEffect(() => {
    if (!cat) return;
    setLoading(true);
  fetch(`https://mahaveer-tools.onrender.com/api/products?category=${cat._id || cat.id}`)
      .then(res => res.json())
      .then(data => {
        setProducts(data);
        setLoading(false);
      })
      .catch(() => {
        setProducts([]);
        setLoading(false);
      });
  }, [cat]);

  if (loading) {
    return <div style={{ minHeight: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 24, color: '#1a2640' }}>Loading...</div>;
  }

  if (!cat) {
    return (
      <div style={{ width: '100vw', overflowX: 'hidden', background: '#f8f9fa', minHeight: '100vh' }}>
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
          <div style={{
            background: 'rgba(255,255,255,0.1)',
            backdropFilter: 'blur(10px)',
            boxShadow: '0 8px 32px rgba(0,0,0,0.3)',
            borderRadius: 24,
            padding: '3rem 2.5rem',
            textAlign: 'center',
            border: '1px solid rgba(255,255,255,0.2)'
          }}>
            <h1 style={{ fontSize: '2.5rem', fontWeight: 700, color: '#fff', margin: 0 }}>Category Not Found</h1>
            <Link to="/categories" style={{
              display: 'inline-block',
              marginTop: '2rem',
              background: '#fff',
              color: '#1a2640',
              padding: '1rem 2rem',
              borderRadius: 12,
              textDecoration: 'none',
              fontWeight: 600
            }}>
              Back to Categories
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // Get unique subcategories/types for filter sidebar
  const subcategories = getUniqueSubcategories(products);
  // Filter products by selected subcategory/type
  const filteredProducts = selectedSubcategory
    ? products.filter(p => p.subcategory === selectedSubcategory)
    : products;

  return (
    <div style={{ width: '100vw', overflowX: 'hidden', background: '#f8f9fa', minHeight: '100vh' }}>
      {/* Hero Section - Compact & Modern */}
      <div style={{
        width: '100vw',
        background: 'linear-gradient(135deg, #1a2640 0%, #2d3748 100%)',
        position: 'relative',
        overflow: 'hidden'
      }}>
        {/* Subtle Pattern Overlay */}
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          opacity: 0.05,
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='80' height='80' viewBox='0 0 80 80' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M0 0h40v40H0V0zm40 40h40v40H40V40z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          pointerEvents: 'none'
        }}></div>
        
        <div style={{
          maxWidth: '1400px',
          margin: '0 auto',
          padding: '4rem 2rem 3rem 2rem',
          position: 'relative',
          zIndex: 1
        }}>
          {/* Breadcrumb / Back Link */}
          <Link
            to="/categories"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.5rem',
              color: 'rgba(255,255,255,0.7)',
              textDecoration: 'none',
              fontSize: '0.9rem',
              fontWeight: 500,
              marginBottom: '2rem',
              transition: 'all 0.2s ease'
            }}
            onMouseEnter={e => {
              e.currentTarget.style.color = '#fff';
              e.currentTarget.style.transform = 'translateX(-4px)';
            }}
            onMouseLeave={e => {
              e.currentTarget.style.color = 'rgba(255,255,255,0.7)';
              e.currentTarget.style.transform = 'translateX(0)';
            }}
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
              <path d="M11.354 1.646a.5.5 0 0 1 0 .708L5.707 8l5.647 5.646a.5.5 0 0 1-.708.708l-6-6a.5.5 0 0 1 0-.708l6-6a.5.5 0 0 1 .708 0z"/>
            </svg>
            Back to Categories
          </Link>

          {/* Category Title & Description */}
          <div>
            <h1 style={{
              fontSize: '2.5rem',
              fontWeight: 700,
              color: '#fff',
              margin: '0 0 1rem 0',
              letterSpacing: '-0.01em'
            }}>
              {cat.name}
            </h1>
            <p style={{
              fontSize: '1.1rem',
              lineHeight: '1.6',
              fontWeight: 400,
              margin: 0,
              color: 'rgba(255,255,255,0.8)',
              maxWidth: '600px'
            }}>
              Explore our premium {cat.name.toLowerCase()} collection designed for professional use.
            </p>
          </div>

          {/* Product Count Badge */}
          <div style={{
            marginTop: '2rem',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.5rem',
            background: 'rgba(255,255,255,0.1)',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(255,255,255,0.2)',
            borderRadius: '50px',
            padding: '0.5rem 1.25rem',
            fontSize: '0.9rem',
            color: '#fff',
            fontWeight: 600
          }}>
            <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
              <path d="M2.97 1.35A1 1 0 0 1 3.73 1h8.54a1 1 0 0 1 .76.35l2.609 3.044A1.5 1.5 0 0 1 16 5.37v.255a2.375 2.375 0 0 1-4.25 1.458A2.371 2.371 0 0 1 9.875 8 2.37 2.37 0 0 1 8 7.083 2.37 2.37 0 0 1 6.125 8a2.37 2.37 0 0 1-1.875-.917A2.375 2.375 0 0 1 0 5.625V5.37a1.5 1.5 0 0 1 .361-.976l2.61-3.045zm1.78 4.275a1.375 1.375 0 0 0 2.75 0 .5.5 0 0 1 1 0 1.375 1.375 0 0 0 2.75 0 .5.5 0 0 1 1 0 1.375 1.375 0 1 0 2.75 0V5.37a.5.5 0 0 0-.12-.325L12.27 2H3.73L1.12 5.045A.5.5 0 0 0 1 5.37v.255a1.375 1.375 0 0 0 2.75 0 .5.5 0 0 1 1 0zM1.5 8.5A.5.5 0 0 1 2 9v6h1v-5a1 1 0 0 1 1-1h3a1 1 0 0 1 1 1v5h6V9a.5.5 0 0 1 1 0v6h.5a.5.5 0 0 1 0 1H.5a.5.5 0 0 1 0-1H1V9a.5.5 0 0 1 .5-.5zM4 15h3v-5H4v5zm5-5a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v3a1 1 0 0 1-1 1h-2a1 1 0 0 1-1-1v-3zm3 0h-2v3h2v-3z"/>
            </svg>
            {products.length} {products.length === 1 ? 'Product' : 'Products'} Available
          </div>
        </div>
      </div>

      {/* Main Content: Filter Sidebar + Products Grid */}
      <div style={{
        maxWidth: '1400px',
        margin: '0 auto',
        padding: '4rem 2rem',
        display: 'grid',
        gridTemplateColumns: '280px 1fr',
        gap: '3rem',
        alignItems: 'flex-start'
      }}>
        {/* Filter Sidebar */}
        <div style={{ 
          position: 'sticky',
          top: '2rem',
          background: '#fff', 
          borderRadius: 16, 
          padding: '2rem 1.5rem', 
          boxShadow: '0 4px 16px rgba(26,38,64,0.07)', 
          border: '1px solid #e5e7eb'
        }}>
          <h4 style={{ 
            fontSize: '1.1rem', 
            fontWeight: 700, 
            marginBottom: '1.5rem', 
            color: '#1a2640' 
          }}>
            Filter by Type
          </h4>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <button
              style={{
                background: selectedSubcategory === '' ? 'linear-gradient(135deg, #1a2640, #2d3748)' : '#f8f9fa',
                color: selectedSubcategory === '' ? '#fff' : '#1a2640',
                border: selectedSubcategory === '' ? 'none' : '1px solid #e5e7eb',
                borderRadius: 8,
                padding: '0.8rem 1rem',
                fontWeight: 600,
                cursor: 'pointer',
                fontSize: '0.9rem',
                transition: 'all 0.2s ease',
                textAlign: 'left',
                width: '100%'
              }}
              onClick={() => setSelectedSubcategory('')}
              onMouseEnter={e => {
                if (selectedSubcategory !== '') {
                  e.target.style.background = '#e5e7eb';
                }
              }}
              onMouseLeave={e => {
                if (selectedSubcategory !== '') {
                  e.target.style.background = '#f8f9fa';
                }
              }}
            >
              All ({products.length})
            </button>
            {subcategories.map(sub => {
              const count = products.filter(p => p.subcategory === sub).length;
              return (
                <button
                  key={sub}
                  style={{
                    background: selectedSubcategory === sub ? 'linear-gradient(135deg, #1a2640, #2d3748)' : '#f8f9fa',
                    color: selectedSubcategory === sub ? '#fff' : '#1a2640',
                    border: selectedSubcategory === sub ? 'none' : '1px solid #e5e7eb',
                    borderRadius: 8,
                    padding: '0.8rem 1rem',
                    fontWeight: 600,
                    cursor: 'pointer',
                    fontSize: '0.9rem',
                    transition: 'all 0.2s ease',
                    textAlign: 'left',
                    width: '100%'
                  }}
                  onClick={() => setSelectedSubcategory(sub)}
                  onMouseEnter={e => {
                    if (selectedSubcategory !== sub) {
                      e.target.style.background = '#e5e7eb';
                    }
                  }}
                  onMouseLeave={e => {
                    if (selectedSubcategory !== sub) {
                      e.target.style.background = '#f8f9fa';
                    }
                  }}
                >
                  {sub} ({count})
                </button>
              );
            })}
          </div>
        </div>

        {/* Products Grid */}
        <div>
          <div style={{ 
            marginBottom: '2rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '1rem'
          }}>
            <h2 style={{ 
              fontSize: '1.8rem', 
              fontWeight: 700, 
              color: '#1a2640',
              margin: 0
            }}>
              {selectedSubcategory ? `${selectedSubcategory} Products` : 'All Products'}
            </h2>
            <div style={{ 
              color: '#6b7280', 
              fontSize: '1rem' 
            }}>
              {filteredProducts.length} product{filteredProducts.length !== 1 ? 's' : ''} found
            </div>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
            gap: '2rem',
            justifyItems: 'center'
          }}>
            {filteredProducts.length === 0 ? (
              <div style={{ 
                gridColumn: '1/-1', 
                color: '#6b7280', 
                fontSize: '1.1rem', 
                textAlign: 'center', 
                padding: '4rem 2rem',
                background: '#fff',
                borderRadius: 16,
                border: '1px solid #e5e7eb'
              }}>
                <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>📦</div>
                <div style={{ fontWeight: 600, marginBottom: '0.5rem' }}>No products found</div>
                <div>Try selecting a different filter or browse all products.</div>
              </div>
            ) : (
              filteredProducts.map(prod => (
                <div
                  key={prod._id}
                  style={{
                    width: '100%',
                    maxWidth: 350,
                    background: '#fff',
                    borderRadius: 20,
                    overflow: 'hidden',
                    boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
                    transition: 'all 0.3s ease',
                    border: '1px solid rgba(26,38,64,0.08)',
                    position: 'relative'
                  }}
                  onMouseEnter={e => {
                    e.currentTarget.style.transform = 'translateY(-8px)';
                    e.currentTarget.style.boxShadow = '0 20px 40px rgba(26,38,64,0.12)';
                    e.currentTarget.style.borderColor = 'rgba(26,38,64,0.2)';
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = '0 4px 20px rgba(0,0,0,0.08)';
                    e.currentTarget.style.borderColor = 'rgba(26,38,64,0.08)';
                  }}
                >
                  {/* Product Image */}
                  <div style={{
                    width: '100%',
                    height: '240px',
                    position: 'relative',
                    background: 'linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    overflow: 'hidden'
                  }}>
                    {prod.image ? (
                      <img
                        src={prod.image}
                        alt={prod.name}
                        style={{
                          maxWidth: '85%',
                          maxHeight: '85%',
                          objectFit: 'contain',
                          transition: 'transform 0.3s ease'
                        }}
                      />
                    ) : (
                      <div style={{
                        width: '100%',
                        height: '100%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: '#9ca3af',
                        fontSize: '1rem',
                        flexDirection: 'column',
                        gap: '0.5rem'
                      }}>
                        <div style={{ fontSize: '2rem' }}>📦</div>
                        <div>No Image Available</div>
                      </div>
                    )}
                    
                    {/* Subcategory Badge */}
                    {prod.subcategory && (
                      <div style={{
                        position: 'absolute',
                        top: '12px',
                        left: '12px',
                        background: 'linear-gradient(135deg, #1a2640, #2d3748)',
                        color: '#fff',
                        padding: '0.4rem 0.8rem',
                        borderRadius: 16,
                        fontSize: '0.75rem',
                        fontWeight: 600,
                        textTransform: 'uppercase',
                        letterSpacing: '0.5px',
                        boxShadow: '0 2px 8px rgba(26,38,64,0.3)'
                      }}>
                        {prod.subcategory}
                      </div>
                    )}
                  </div>
                  
                  {/* Product Info */}
                  <div style={{ padding: '1.5rem' }}>
                    <h3 style={{ 
                      fontSize: '1.25rem', 
                      fontWeight: 700, 
                      color: '#1a2640', 
                      margin: '0 0 0.75rem 0', 
                      lineHeight: '1.3',
                      minHeight: '2.6rem',
                      display: '-webkit-box',
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: 'vertical',
                      overflow: 'hidden'
                    }}>
                      {prod.name}
                    </h3>
                    
                    <p style={{ 
                      color: '#6b7280', 
                      fontSize: '0.95rem', 
                      lineHeight: '1.5', 
                      margin: '0 0 1.5rem 0',
                      minHeight: '3rem',
                      display: '-webkit-box',
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: 'vertical',
                      overflow: 'hidden'
                    }}>
                      {prod.description || 'Professional grade product for industrial applications.'}
                    </p>
                    
                    {/* View Details Button */}
                    <Link
                      to={`/categories/${cat._id || cat.id}/${prod._id}`}
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '0.5rem',
                        background: 'linear-gradient(135deg, #1a2640, #2d3748)',
                        color: '#fff',
                        padding: '0.875rem 1.5rem',
                        borderRadius: 10,
                        fontSize: '0.9rem',
                        fontWeight: 600,
                        boxShadow: '0 2px 12px rgba(26,38,64,0.2)',
                        transition: 'all 0.2s ease',
                        textDecoration: 'none',
                        width: '100%'
                      }}
                      onMouseEnter={e => {
                        e.target.style.transform = 'translateY(-2px)';
                        e.target.style.boxShadow = '0 6px 20px rgba(26,38,64,0.3)';
                      }}
                      onMouseLeave={e => {
                        e.target.style.transform = 'translateY(0)';
                        e.target.style.boxShadow = '0 2px 12px rgba(26,38,64,0.2)';
                      }}
                    >
                      View Details
                      <span style={{ fontSize: '0.8rem' }}>→</span>
                    </Link>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Call to Action Section */}
      <div style={{
        background: 'linear-gradient(135deg, #1a2640 0%, #2d3748 50%, #4a5568 100%)',
        padding: '4rem 2rem',
        textAlign: 'center',
        color: '#fff',
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
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Cpath d='M20 20c0-5.5-4.5-10-10-10s-10 4.5-10 10 4.5 10 10 10 10-4.5 10-10zm10 0c0-5.5-4.5-10-10-10s-10 4.5-10 10 4.5 10 10 10 10-4.5 10-10z'/%3E%3C/g%3E%3C/svg%3E")`,
          pointerEvents: 'none'
        }}></div>
        
        <div style={{ maxWidth: '800px', margin: '0 auto', position: 'relative', zIndex: 1 }}>
          <h2 style={{
            fontSize: '2.5rem',
            fontWeight: 700,
            marginBottom: '1rem',
            color: '#fff'
          }}>
            Need Custom Solutions?
          </h2>
          <p style={{
            fontSize: '1.2rem',
            color: 'rgba(255,255,255,0.9)',
            marginBottom: '2.5rem',
            lineHeight: '1.6'
          }}>
            Contact our technical team for customized industrial solutions tailored to your specific requirements.
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
              e.target.style.transform = 'translateY(-3px)';
              e.target.style.boxShadow = '0 12px 32px rgba(255,255,255,0.3)';
            }}
            onMouseLeave={(e) => {
              e.target.style.transform = 'translateY(0)';
              e.target.style.boxShadow = '0 8px 24px rgba(255,255,255,0.2)';
            }}
          >
            Get Custom Quote
          </Link>
        </div>
      </div>
    </div>
  );
}