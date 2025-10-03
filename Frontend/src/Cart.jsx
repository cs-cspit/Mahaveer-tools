import React, { useState, useEffect } from 'react';
import { useAuth } from './contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

const Cart = () => {
  const { user, getAuthToken } = useAuth();
  const navigate = useNavigate();
  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }
    fetchCart();
  }, [user, navigate]);

  const fetchCart = async () => {
    try {
      setLoading(true);
      const token = getAuthToken();
      const response = await fetch('http://localhost:5000/api/cart', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        const cartData = await response.json();
        setCart(cartData);
      } else {
        setError('Failed to fetch cart');
      }
    } catch (error) {
      setError('Network error');
    } finally {
      setLoading(false);
    }
  };

  const updateQuantity = async (productId, newQuantity) => {
    try {
      const token = getAuthToken();
      const response = await fetch(`http://localhost:5000/api/cart/update/${productId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ quantity: newQuantity })
      });

      if (response.ok) {
        const updatedCart = await response.json();
        setCart(updatedCart.cart);
      } else {
        setError('Failed to update quantity');
      }
    } catch (error) {
      setError('Network error');
    }
  };

  const removeItem = async (productId) => {
    try {
      const token = getAuthToken();
      const response = await fetch(`http://localhost:5000/api/cart/remove/${productId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        const updatedCart = await response.json();
        setCart(updatedCart.cart);
      } else {
        setError('Failed to remove item');
      }
    } catch (error) {
      setError('Network error');
    }
  };

  const clearCart = async () => {
    try {
      const token = getAuthToken();
      const response = await fetch('http://localhost:5000/api/cart/clear', {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        const updatedCart = await response.json();
        setCart(updatedCart.cart);
      } else {
        setError('Failed to clear cart');
      }
    } catch (error) {
      setError('Network error');
    }
  };

  const handleCheckout = () => {
    if (!cart) return;
    // navigate to payment page and pass amount in rupees
    navigate('/payment', { state: { amount: cart.totalAmount } });
  };

  if (loading) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        minHeight: '50vh',
        fontSize: '1.2rem',
        color: '#64748b'
      }}>
        Loading your cart...
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        minHeight: '50vh',
        flexDirection: 'column',
        gap: '1rem'
      }}>
        <div style={{ color: '#ff4d4f', fontSize: '1.2rem' }}>{error}</div>
        <button 
          onClick={fetchCart}
          style={{
            background: '#1a2640',
            color: '#fff',
            border: 'none',
            borderRadius: '8px',
            padding: '10px 20px',
            cursor: 'pointer',
            fontWeight: '600'
          }}
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div style={{ 
      maxWidth: '1200px', 
      margin: '0 auto', 
      padding: '2rem 1rem',
      minHeight: '80vh'
    }}>
      <div style={{ 
        background: '#fff', 
        borderRadius: '16px', 
        boxShadow: '0 4px 24px rgba(30,41,59,0.10)', 
        padding: '2rem 2.5rem',
        marginBottom: '2rem'
      }}>
        <div style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          marginBottom: '2rem'
        }}>
          <h1 style={{ 
            color: '#1a2640', 
            fontWeight: '800', 
            fontSize: '28px', 
            margin: '0'
          }}>
            Your Cart
          </h1>
          {cart && cart.items.length > 0 && (
            <button
              onClick={clearCart}
              style={{
                background: '#ff4d4f',
                color: '#fff',
                border: 'none',
                borderRadius: '8px',
                padding: '8px 16px',
                cursor: 'pointer',
                fontWeight: '600',
                fontSize: '14px'
              }}
            >
              Clear Cart
            </button>
          )}
        </div>

        {!cart || cart.items.length === 0 ? (
          <div style={{ 
            textAlign: 'center', 
            padding: '4rem 2rem',
            color: '#64748b'
          }}>
            <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>🛒</div>
            <h2 style={{ 
              fontSize: '1.5rem', 
              fontWeight: '600', 
              marginBottom: '0.5rem',
              color: '#1a2640'
            }}>
              Your cart is empty
            </h2>
            <p style={{ fontSize: '1rem', marginBottom: '2rem' }}>
              Add some products to get started!
            </p>
            <button
              onClick={() => navigate('/categories')}
              style={{
                background: '#1a2640',
                color: '#fff',
                border: 'none',
                borderRadius: '8px',
                padding: '12px 24px',
                cursor: 'pointer',
                fontWeight: '600',
                fontSize: '1rem'
              }}
            >
              Browse Products
            </button>
          </div>
        ) : (
          <>
            <div style={{ 
              display: 'grid', 
              gap: '1.5rem',
              marginBottom: '2rem'
            }}>
              {cart.items.map((item) => (
                <div key={item.productId} style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '1.5rem',
                  padding: '1.5rem',
                  background: '#f8f9fa',
                  borderRadius: '12px',
                  border: '1px solid #e5e7eb'
                }}>
                  {item.image ? (
                    <img 
                      src={item.image} 
                      alt={item.name}
                      style={{
                        width: '80px',
                        height: '80px',
                        objectFit: 'cover',
                        borderRadius: '8px',
                        border: '1px solid #e5e7eb'
                      }}
                    />
                  ) : (
                    <div style={{
                      width: '80px',
                      height: '80px',
                      background: '#e0e0e0',
                      borderRadius: '8px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: '#666',
                      fontSize: '0.8rem'
                    }}>
                      No Image
                    </div>
                  )}
                  
                  <div style={{ flex: 1 }}>
                    <h3 style={{ 
                      fontSize: '1.2rem', 
                      fontWeight: '600', 
                      color: '#1a2640',
                      margin: '0 0 0.5rem 0'
                    }}>
                      {item.name}
                    </h3>
                    <p style={{ 
                      fontSize: '0.9rem', 
                      color: '#64748b',
                      margin: '0 0 0.5rem 0'
                    }}>
                      {item.categoryName}
                    </p>
                    <p style={{ 
                      fontSize: '1.1rem', 
                      fontWeight: '600', 
                      color: '#1a2640',
                      margin: '0'
                    }}>
                      ₹{item.price.toLocaleString()}
                    </p>
                  </div>

                  <div style={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    gap: '1rem'
                  }}>
                    <div style={{ 
                      display: 'flex', 
                      alignItems: 'center', 
                      gap: '0.5rem'
                    }}>
                      <button
                        onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                        disabled={item.quantity <= 1}
                        style={{
                          width: '32px',
                          height: '32px',
                          borderRadius: '6px',
                          border: '1px solid #d1d5db',
                          background: item.quantity <= 1 ? '#f3f4f6' : '#fff',
                          color: item.quantity <= 1 ? '#9ca3af' : '#374151',
                          cursor: item.quantity <= 1 ? 'not-allowed' : 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontWeight: '600'
                        }}
                      >
                        -
                      </button>
                      
                      <span style={{ 
                        minWidth: '40px', 
                        textAlign: 'center',
                        fontWeight: '600',
                        fontSize: '1.1rem'
                      }}>
                        {item.quantity}
                      </span>
                      
                      <button
                        onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                        style={{
                          width: '32px',
                          height: '32px',
                          borderRadius: '6px',
                          border: '1px solid #d1d5db',
                          background: '#fff',
                          color: '#374151',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontWeight: '600'
                        }}
                      >
                        +
                      </button>
                    </div>

                    <button
                      onClick={() => removeItem(item.productId)}
                      style={{
                        background: '#ff4d4f',
                        color: '#fff',
                        border: 'none',
                        borderRadius: '6px',
                        padding: '8px 12px',
                        cursor: 'pointer',
                        fontWeight: '600',
                        fontSize: '0.9rem'
                      }}
                    >
                      Remove
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Cart Summary */}
            <div style={{
              background: '#f8f9fa',
              borderRadius: '12px',
              padding: '2rem',
              border: '1px solid #e5e7eb'
            }}>
              <div style={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'center',
                marginBottom: '1.5rem'
              }}>
                <h3 style={{ 
                  fontSize: '1.3rem', 
                  fontWeight: '600', 
                  color: '#1a2640',
                  margin: '0'
                }}>
                  Order Summary
                </h3>
              </div>
              
              <div style={{ 
                display: 'flex', 
                justifyContent: 'space-between',
                marginBottom: '0.5rem'
              }}>
                <span style={{ color: '#64748b' }}>Items ({cart.totalItems})</span>
                <span style={{ fontWeight: '600' }}>₹{cart.totalAmount.toLocaleString()}</span>
              </div>
              
              <div style={{ 
                display: 'flex', 
                justifyContent: 'space-between',
                marginBottom: '1.5rem',
                paddingTop: '1rem',
                borderTop: '1px solid #e5e7eb'
              }}>
                <span style={{ 
                  fontSize: '1.2rem', 
                  fontWeight: '700', 
                  color: '#1a2640'
                }}>
                  Total
                </span>
                <span style={{ 
                  fontSize: '1.2rem', 
                  fontWeight: '700', 
                  color: '#1a2640'
                }}>
                  ₹{cart.totalAmount.toLocaleString()}
                </span>
              </div>

              <button
                onClick={handleCheckout}
                style={{
                  width: '100%',
                  background: '#1a2640',
                  color: '#fff',
                  border: 'none',
                  borderRadius: '8px',
                  padding: '14px 24px',
                  cursor: 'pointer',
                  fontWeight: '600',
                  fontSize: '1.1rem',
                  transition: 'background 0.2s'
                }}
                onMouseEnter={(e) => e.target.style.background = '#2d3748'}
                onMouseLeave={(e) => e.target.style.background = '#1a2640'}
              >
                Proceed to Checkout
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Cart;
