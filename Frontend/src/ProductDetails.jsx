
import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useCart } from './contexts/CartContext';


export default function ProductDetails() {
  const params = useParams();
  // Support both routes: /products/:id and legacy /categories/:category/:product
  const id = params.id || params.product;
  const { addToCart } = useCart();
  const [productInfo, setProductInfo] = useState(null);
  const [categoryInfo, setCategoryInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [qty, setQty] = useState({});
  const [mainImage, setMainImage] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        // Fetch product by ID (id may be product param in legacy route)
  const res = await fetch(`https://mahaveer-tools.onrender.com/api/products/${id}`);
        if (!res.ok) throw new Error('Product fetch failed');
        const prod = await res.json();
        setProductInfo(prod);
  // set main image for gallery
  setMainImage(prod.image || prod.images?.[0] || null);
        // Fetch category for breadcrumbs
        if (prod.category) {
          const catRes = await fetch(`https://mahaveer-tools.onrender.com/api/categories/${prod.category}`);
          if (catRes.ok) {
            const catData = await catRes.json();
            setCategoryInfo(catData);
          }
        }
      } catch (err) {
        setProductInfo(null);
        setCategoryInfo(null);
      }
      setLoading(false);
    };
    fetchData();
  }, [id]);

  // ensure mainImage updates if productInfo changes later
  useEffect(() => {
    if (productInfo) setMainImage(productInfo.image || productInfo.images?.[0] || null);
  }, [productInfo]);

  const handleQty = (brand, size, delta) => {
    const key = `${brand}-${size}`;
    setQty(q => ({ ...q, [key]: Math.max(1, (q[key] || 1) + delta) }));
  };

  if (loading) {
    return <div style={{ minHeight: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 24, color: '#1a2640' }}>Loading...</div>;
  }

  if (!productInfo) {
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
            <h1 style={{ fontSize: '2.5rem', fontWeight: 700, color: '#fff', margin: 0 }}>Product Not Found</h1>
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

  return (
    <div style={{ width: '100vw', overflowX: 'hidden', background: '#f8f9fa' }}>
      {/* Hero Section */}
      <div style={{
        minHeight: '80vh',
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
          maxWidth: '1000px',
          width: '90vw',
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: '3rem',
          alignItems: 'center'
        }}>
          {/* Product Image */}
          <div style={{
            background: 'rgba(255,255,255,0.1)',
            backdropFilter: 'blur(10px)',
            borderRadius: 24,
            padding: '2rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            minHeight: '300px',
            border: '1px solid rgba(255,255,255,0.2)'
          }}>
              {mainImage ? (
                <img
                  src={mainImage}
                  alt={productInfo.name}
                  style={{
                    maxWidth: '100%',
                    maxHeight: '300px',
                    objectFit: 'contain',
                    filter: 'drop-shadow(0 8px 32px rgba(0,0,0,0.3))'
                  }}
                />
              ) : (
                <div style={{
                  width: '100%',
                  height: '250px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#666',
                  fontSize: '1.5rem'
                }}>
                  No Image Available
                </div>
              )}

              {/* Thumbnails */}
              {Array.isArray(productInfo.images) && productInfo.images.length > 0 && (
                <div style={{ display: 'flex', gap: 8, marginTop: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
                  {productInfo.images.map((img, idx) => (
                    <img key={idx} src={img} alt={`thumb-${idx}`} onClick={() => setMainImage(img)} style={{ width: 64, height: 64, objectFit: 'cover', borderRadius: 8, cursor: 'pointer', border: mainImage === img ? '2px solid #1a2640' : '1px solid #e5e7eb' }} />
                  ))}
                </div>
              )}
          </div>

          {/* Product Info */}
          <div style={{
            background: 'rgba(255,255,255,0.1)',
            backdropFilter: 'blur(10px)',
            boxShadow: '0 8px 32px rgba(0,0,0,0.3)',
            borderRadius: 24,
            padding: '3rem 2.5rem',
            border: '1px solid rgba(255,255,255,0.2)'
          }}>
            {/* Logo removed per request */}
            
            <h1 style={{ 
              fontSize: '2.5rem', 
              fontWeight: 800, 
              color: '#fff', 
              margin: '0 0 1rem 0', 
              letterSpacing: '-1px',
              textShadow: '0 2px 10px rgba(0,0,0,0.3)'
            }}>{productInfo.name}</h1>
            
            <p style={{ 
              color: 'rgba(255,255,255,0.9)', 
              fontSize: '1.1rem', 
              lineHeight: '1.6',
              marginBottom: '2rem',
              fontWeight: 400
            }}>
              Professional grade {productInfo.name.toLowerCase()} available in multiple brands and sizes to meet your specific requirements.
            </p>

            {/* Price and Add to Cart (product-level) */}
            {typeof productInfo.price === 'number' && (
              <div style={{ display: 'flex', gap: 12, alignItems: 'center', marginBottom: '1.25rem', flexWrap: 'wrap' }}>
                <div style={{ background: '#fff', color: '#1a2640', padding: '10px 14px', borderRadius: 12, fontWeight: 800, fontSize: '1.25rem' }}>₹{productInfo.price}</div>
                <button
                  onClick={async () => {
                    try {
                      const result = await addToCart({
                        id: productInfo._id,
                        name: productInfo.name,
                        image: mainImage || productInfo.image || productInfo.images?.[0],
                        price: productInfo.price,
                        categoryId: categoryInfo?._id,
                        categoryName: categoryInfo?.name
                      });
                      if (result.success) alert('Product added to cart!'); else alert(result.error || 'Failed to add to cart');
                    } catch (err) {
                      alert(err.message || 'Failed to add to cart');
                    }
                  }}
                  style={{
                    background: 'linear-gradient(135deg, #1a2640, #2d3748)',
                    color: '#fff',
                    border: 'none',
                    borderRadius: 12,
                    padding: '12px 18px',
                    fontWeight: 800,
                    cursor: 'pointer'
                  }}
                >
                  Add to Cart
                </button>

                {/* Compact Key Specs removed per request */}
              </div>
            )}

            {/* Breadcrumb */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              marginBottom: '1.5rem',
              fontSize: '0.9rem',
              color: 'rgba(255,255,255,0.7)'
            }}>
              <Link 
                to="/categories" 
                style={{ color: 'rgba(255,255,255,0.8)', textDecoration: 'none' }}
                onMouseEnter={(e) => e.target.style.color = '#fff'}
                onMouseLeave={(e) => e.target.style.color = 'rgba(255,255,255,0.8)'}
              >
                Categories
              </Link>
              <span>→</span>
              <Link 
                to={`/categories/${categoryInfo?._id || categoryInfo?.id}`} 
                style={{ color: 'rgba(255,255,255,0.8)', textDecoration: 'none' }}
                onMouseEnter={(e) => e.target.style.color = '#fff'}
                onMouseLeave={(e) => e.target.style.color = 'rgba(255,255,255,0.8)'}
              >
                {categoryInfo?.name}
              </Link>
              <span>→</span>
              <span style={{ color: '#fff', fontWeight: 600 }}>{productInfo.name}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Specifications */}
      <div style={{
        maxWidth: '1200px',
        margin: '0 auto',
        padding: '4rem 2rem',
      }}>
        {productInfo?.specifications && Array.isArray(productInfo.specifications) && productInfo.specifications.length > 0 ? (
          <div style={{
            background: '#fff',
            borderRadius: 16,
            boxShadow: '0 8px 32px rgba(0,0,0,0.06)',
            padding: '1.5rem',
            marginBottom: '2rem',
            border: '1px solid rgba(26,38,64,0.06)'
          }}>
            <div style={{ display: 'flex', gap: 20, alignItems: 'flex-start', flexWrap: 'wrap' }}>
              <div style={{ flex: '1 1 320px' }}>
                <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#1a2640', margin: 0 }}>Specifications</h3>
                <div style={{ marginTop: 12, display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 12 }}>
                  {(Array.isArray(productInfo.specifications) ? productInfo.specifications : []).map((raw, i) => {
                    const s = typeof raw === 'string' ? { name: raw, value: '' } : (raw || {});
                    const text = (s.value || '').toString().trim();
                    const nameText = (s.name || s.title || '').toString().trim();
                    const longSingle = !text && nameText.length > 80; // long standalone spec
                    const onlyName = !text && nameText.length <= 80;

                    // card style
                    const baseStyle = {
                      padding: 12,
                      borderRadius: 10,
                      background: '#f8fafc',
                      border: '1px solid #eef6fd',
                      wordBreak: 'break-word',
                      whiteSpace: 'pre-line'
                    };

                    // If it's a long standalone spec (no value), make it span full width by setting gridColumn
                    const itemStyle = Object.assign({}, baseStyle, longSingle ? { gridColumn: '1 / -1' } : {});

                    return (
                      <div key={i} style={itemStyle}>
                        <div style={{ fontWeight: 800, color: '#1a2640', marginBottom: 6 }}>{nameText}</div>
                        {text ? (
                          <div style={{ color: '#475569' }}>{text}</div>
                        ) : null}
                      </div>
                    );
                  })}
                </div>
              </div>
              { (productInfo.image || productInfo.images?.[0]) && (
                <div style={{ width: 180, flex: '0 0 180px', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                  <img src={productInfo.image || productInfo.images?.[0]} alt={productInfo.name} style={{ width: 160, height: 160, objectFit: 'cover', borderRadius: 12, border: '1px solid #e5e7eb' }} />
                </div>
              )}
            </div>
          </div>
        ) : null}
      </div>

      {/* Features Section */}
      <div style={{
        background: 'linear-gradient(135deg, #1a2640 0%, #2d3748 50%, #4a5568 100%)',
        padding: '4rem 2rem',
        color: '#fff'
      }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <h2 style={{
            fontSize: '2.5rem',
            fontWeight: 700,
            textAlign: 'center',
            marginBottom: '3rem',
            color: '#fff'
          }}>
            Why Choose Our Products?
          </h2>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
            gap: '2rem'
          }}>
            {[
              { icon: '🏆', title: 'Premium Quality', desc: 'Made from high-grade materials for maximum durability' },
              { icon: '⚡', title: 'Professional Grade', desc: 'Designed for industrial applications and heavy-duty use' },
              { icon: '🛡️', title: 'Quality Assured', desc: 'Rigorous testing ensures consistent performance' },
              { icon: '🚚', title: 'Fast Delivery', desc: 'Quick shipping to get your projects moving' }
            ].map((feature, index) => (
              <div key={index} style={{
                background: 'rgba(255,255,255,0.1)',
                backdropFilter: 'blur(10px)',
                borderRadius: 16,
                padding: '2rem',
                textAlign: 'center',
                border: '1px solid rgba(255,255,255,0.2)'
              }}>
                <div style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>{feature.icon}</div>
                <h3 style={{
                  fontSize: '1.3rem',
                  fontWeight: 600,
                  marginBottom: '0.8rem',
                  color: '#fff'
                }}>
                  {feature.title}
                </h3>
                <p style={{
                  color: 'rgba(255,255,255,0.8)',
                  lineHeight: '1.5',
                  margin: 0
                }}>
                  {feature.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
} 