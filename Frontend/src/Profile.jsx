import React, { useState, useEffect } from 'react';
import { useAuth } from './contexts/AuthContext';
import { Link } from 'react-router-dom';
import logo from './assets/logo.png';

const Profile = () => {
  const { user, updateUser, getAuthToken } = useAuth();
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    shippingAddress: {
      street: '',
      city: '',
      state: '',
      zipCode: '',
      country: 'India'
    },
    billingAddress: {
      street: '',
      city: '',
      state: '',
      zipCode: '',
      country: 'India'
    }
  });

  useEffect(() => {
    if (user) {
      console.log('User data loaded:', user);
      setFormData({
        name: user.name || '',
        email: user.email || '',
        phone: user.phone || '',
        shippingAddress: {
          street: user.shippingAddress?.street || '',
          city: user.shippingAddress?.city || '',
          state: user.shippingAddress?.state || '',
          zipCode: user.shippingAddress?.zipCode || '',
          country: user.shippingAddress?.country || 'India'
        },
        billingAddress: {
          street: user.billingAddress?.street || '',
          city: user.billingAddress?.city || '',
          state: user.billingAddress?.state || '',
          zipCode: user.billingAddress?.zipCode || '',
          country: user.billingAddress?.country || 'India'
        }
      });
    }
  }, [user]);

  // Debug logging for isEditing state
  useEffect(() => {
    console.log('isEditing state changed:', isEditing);
  }, [isEditing]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name.startsWith('shippingAddress.')) {
      const addressField = name.split('.')[1];
      setFormData(prev => ({
        ...prev,
        shippingAddress: {
          ...prev.shippingAddress,
          [addressField]: value
        }
      }));
    } else if (name.startsWith('billingAddress.')) {
      const addressField = name.split('.')[1];
      setFormData(prev => ({
        ...prev,
        billingAddress: {
          ...prev.billingAddress,
          [addressField]: value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setMessage('');

    try {
      const token = getAuthToken();
  const response = await fetch('https://mahaveer-tools.onrender.com/api/auth/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(formData)
      });

      const data = await response.json();

      if (response.ok) {
        updateUser(data.user);
        setMessage('Profile updated successfully!');
        setIsEditing(false);
      } else {
        setError(data.error || 'Failed to update profile');
      }
    } catch (error) {
      setError('Network error. Please try again.');
    }

    setLoading(false);
  };

  const handleCancel = () => {
    if (user) {
      setFormData({
        name: user.name || '',
        email: user.email || '',
        phone: user.phone || '',
        shippingAddress: {
          street: user.shippingAddress?.street || '',
          city: user.shippingAddress?.city || '',
          state: user.shippingAddress?.state || '',
          zipCode: user.shippingAddress?.zipCode || '',
          country: user.shippingAddress?.country || 'India'
        },
        billingAddress: {
          street: user.billingAddress?.street || '',
          city: user.billingAddress?.city || '',
          state: user.billingAddress?.state || '',
          zipCode: user.billingAddress?.zipCode || '',
          country: user.billingAddress?.country || 'India'
        }
      });
    }
    setIsEditing(false);
    setError('');
    setMessage('');
  };

  if (!user) {
    return (
      <div style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(135deg, #1a2640 0%, #2d3748 50%, #4a5568 100%)',
        padding: '2rem 1rem'
      }}>
        <div style={{
          background: '#fff',
          borderRadius: 20,
          boxShadow: '0 20px 60px rgba(0,0,0,0.3)',
          padding: '3rem 2.5rem',
          textAlign: 'center',
          maxWidth: 400
        }}>
          <h2 style={{ color: '#1a2640', marginBottom: '1rem' }}>Please Login</h2>
          <p style={{ color: '#6b7280', marginBottom: '2rem' }}>
            You need to be logged in to view your profile.
          </p>
          <Link
            to="/login"
            style={{
              background: '#1a2640',
              color: '#fff',
              padding: '0.75rem 1.5rem',
              borderRadius: 8,
              textDecoration: 'none',
              fontWeight: 600,
              display: 'inline-block'
            }}
          >
            Go to Login
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%)',
      padding: '2rem 1rem'
    }}>
      <div style={{
        maxWidth: 800,
        margin: '0 auto'
      }}>
        {/* Header */}
        <div style={{
          background: '#fff',
          borderRadius: 20,
          boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
          padding: '2rem',
          marginBottom: '2rem',
          textAlign: 'center'
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: '1rem'
          }}>
            <img src={logo} alt="Mahaveer Tools" style={{
              width: 60,
              height: 60,
              marginRight: '1rem',
              borderRadius: '50%',
              objectFit: 'cover'
            }} />
            <h1 style={{
              color: '#1a2640',
              fontSize: '2rem',
              fontWeight: 800,
              margin: 0
            }}>
              My Profile
            </h1>
          </div>
          <p style={{
            color: '#6b7280',
            fontSize: '1.1rem',
            margin: 0
          }}>
            Manage your account information and preferences
          </p>
        </div>

        {/* Profile Form */}
        <div style={{
          background: '#fff',
          borderRadius: 20,
          boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
          padding: '2.5rem'
        }}>
          {message && (
            <div style={{
              background: '#d1fae5',
              border: '1px solid #a7f3d0',
              color: '#065f46',
              padding: '1rem',
              borderRadius: 8,
              marginBottom: '1.5rem',
              textAlign: 'center'
            }}>
              {message}
            </div>
          )}

          {error && (
            <div style={{
              background: '#fef2f2',
              border: '1px solid #fecaca',
              color: '#dc2626',
              padding: '1rem',
              borderRadius: 8,
              marginBottom: '1.5rem',
              textAlign: 'center'
            }}>
              {error}
            </div>
          )}

          {/* Edit Button - Outside Form */}
          {!isEditing && (
            <div style={{
              display: 'flex',
              justifyContent: 'center',
              marginBottom: '2rem',
              padding: '2rem',
              background: '#f8f9fa',
              borderRadius: 16,
              border: '1px solid #e5e7eb'
            }}>
              <button
                type="button"
                onClick={() => {
                  console.log('Edit button clicked, setting isEditing to true');
                  setIsEditing(true);
                }}
                style={{
                  background: '#1a2640',
                  color: '#fff',
                  padding: '1rem 2.5rem',
                  borderRadius: 12,
                  border: 'none',
                  fontWeight: 700,
                  fontSize: '1.1rem',
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                  boxShadow: '0 4px 16px rgba(26,38,64,0.2)',
                  minWidth: '200px'
                }}
                onMouseEnter={(e) => {
                  e.target.style.background = '#2d3748';
                  e.target.style.transform = 'translateY(-1px)';
                }}
                onMouseLeave={(e) => {
                  e.target.style.background = '#1a2640';
                  e.target.style.transform = 'translateY(0)';
                }}
              >
                ✏️ Edit Profile
              </button>
            </div>
          )}

          {/* Editing Status Indicator */}
          {isEditing && (
            <div style={{
              background: '#dbeafe',
              border: '2px solid #3b82f6',
              borderRadius: 12,
              padding: '1rem',
              marginBottom: '2rem',
              textAlign: 'center'
            }}>
              <p style={{
                color: '#1e40af',
                fontWeight: 600,
                margin: 0,
                fontSize: '1rem'
              }}>
                ✏️ You are now in edit mode. Make your changes and click "Save Changes" when done.
              </p>
            </div>
          )}

          <form onSubmit={handleSubmit}>

            {/* Personal Information Section */}
            <div style={{
              background: '#fff',
              borderRadius: 16,
              padding: '2rem',
              marginBottom: '2rem',
              boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
              border: '1px solid #e5e7eb'
            }}>
              <h3 style={{
                color: '#1a2640',
                fontSize: '1.25rem',
                fontWeight: 700,
                marginBottom: '1.5rem',
                borderBottom: '2px solid #e5e7eb',
                paddingBottom: '0.5rem'
              }}>
                👤 Personal Information
              </h3>
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
                gap: '1.5rem'
              }}>
              {/* Personal Information Fields */}
              <div>

                <div style={{ marginBottom: '1.5rem' }}>
                  <label style={{
                    display: 'block',
                    fontWeight: 600,
                    color: '#1a2640',
                    fontSize: '0.9rem',
                    marginBottom: '0.5rem'
                  }}>
                    Full Name
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    disabled={!isEditing}
                    required
                    style={{
                      width: '100%',
                      padding: '0.875rem 1rem',
                      borderRadius: 12,
                      border: isEditing ? '2px solid #3b82f6' : '2px solid #e5e7eb',
                      fontSize: '1rem',
                      outline: 'none',
                      transition: 'all 0.2s',
                      boxSizing: 'border-box',
                      backgroundColor: isEditing ? '#fff' : '#f9fafb',
                      cursor: isEditing ? 'text' : 'not-allowed',
                      color: '#000'
                    }}
                    onFocus={(e) => isEditing && (e.target.style.borderColor = '#1a2640')}
                    onBlur={(e) => e.target.style.borderColor = '#e5e7eb'}
                  />
                </div>

                <div style={{ marginBottom: '1.5rem' }}>
                  <label style={{
                    display: 'block',
                    fontWeight: 600,
                    color: '#1a2640',
                    fontSize: '0.9rem',
                    marginBottom: '0.5rem'
                  }}>
                    Email Address
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    disabled
                    style={{
                      width: '100%',
                      padding: '0.875rem 1rem',
                      borderRadius: 12,
                      border: '2px solid #e5e7eb',
                      fontSize: '1rem',
                      outline: 'none',
                      boxSizing: 'border-box',
                      backgroundColor: '#f9fafb',
                      color: '#6b7280'
                    }}
                  />
                  <small style={{ color: '#6b7280', fontSize: '0.8rem' }}>
                    Email cannot be changed
                  </small>
                </div>

                <div style={{ marginBottom: '1.5rem' }}>
                  <label style={{
                    display: 'block',
                    fontWeight: 600,
                    color: '#1a2640',
                    fontSize: '0.9rem',
                    marginBottom: '0.5rem'
                  }}>
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    disabled={!isEditing}
                    style={{
                      width: '100%',
                      padding: '0.875rem 1rem',
                      borderRadius: 12,
                      border: isEditing ? '2px solid #3b82f6' : '2px solid #e5e7eb',
                      fontSize: '1rem',
                      outline: 'none',
                      transition: 'all 0.2s',
                      boxSizing: 'border-box',
                      backgroundColor: isEditing ? '#fff' : '#f9fafb',
                      cursor: isEditing ? 'text' : 'not-allowed',
                      color: '#000'
                    }}
                    onFocus={(e) => isEditing && (e.target.style.borderColor = '#1a2640')}
                    onBlur={(e) => e.target.style.borderColor = '#e5e7eb'}
                    placeholder="Enter your phone number"
                  />
                </div>
              </div>
              </div>
            </div>

            {/* Addresses Section */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))',
              gap: '2rem',
              marginBottom: '2rem'
            }}>
              {/* Shipping Address */}
              <div style={{
                background: '#fff',
                borderRadius: 16,
                padding: '2rem',
                boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
                border: '1px solid #e5e7eb'
              }}>
                <h3 style={{
                  color: '#1a2640',
                  fontSize: '1.25rem',
                  fontWeight: 700,
                  marginBottom: '1.5rem',
                  borderBottom: '2px solid #e5e7eb',
                  paddingBottom: '0.5rem'
                }}>
                  📦 Shipping Address
                </h3>

                <div style={{ marginBottom: '1.5rem' }}>
                  <label style={{
                    display: 'block',
                    fontWeight: 600,
                    color: '#1a2640',
                    fontSize: '0.9rem',
                    marginBottom: '0.5rem'
                  }}>
                    Street Address
                  </label>
                  <input
                    type="text"
                    name="shippingAddress.street"
                    value={formData.shippingAddress.street}
                    onChange={handleChange}
                    disabled={!isEditing}
                    style={{
                      width: '100%',
                      padding: '0.875rem 1rem',
                      borderRadius: 12,
                      border: isEditing ? '2px solid #3b82f6' : '2px solid #e5e7eb',
                      fontSize: '1rem',
                      outline: 'none',
                      transition: 'all 0.2s',
                      boxSizing: 'border-box',
                      backgroundColor: isEditing ? '#fff' : '#f9fafb',
                      cursor: isEditing ? 'text' : 'not-allowed',
                      color: '#000'
                    }}
                    onFocus={(e) => isEditing && (e.target.style.borderColor = '#1a2640')}
                    onBlur={(e) => e.target.style.borderColor = '#e5e7eb'}
                    placeholder="Enter shipping street address"
                  />
                </div>

                <div style={{ marginBottom: '1.5rem' }}>
                  <label style={{
                    display: 'block',
                    fontWeight: 600,
                    color: '#1a2640',
                    fontSize: '0.9rem',
                    marginBottom: '0.5rem'
                  }}>
                    City
                  </label>
                  <input
                    type="text"
                    name="shippingAddress.city"
                    value={formData.shippingAddress.city}
                    onChange={handleChange}
                    disabled={!isEditing}
                    style={{
                      width: '100%',
                      padding: '0.875rem 1rem',
                      borderRadius: 12,
                      border: isEditing ? '2px solid #3b82f6' : '2px solid #e5e7eb',
                      fontSize: '1rem',
                      outline: 'none',
                      transition: 'all 0.2s',
                      boxSizing: 'border-box',
                      backgroundColor: isEditing ? '#fff' : '#f9fafb',
                      cursor: isEditing ? 'text' : 'not-allowed',
                      color: '#000'
                    }}
                    onFocus={(e) => isEditing && (e.target.style.borderColor = '#1a2640')}
                    onBlur={(e) => e.target.style.borderColor = '#e5e7eb'}
                    placeholder="Enter shipping city"
                  />
                </div>

                <div style={{ marginBottom: '1.5rem' }}>
                  <label style={{
                    display: 'block',
                    fontWeight: 600,
                    color: '#1a2640',
                    fontSize: '0.9rem',
                    marginBottom: '0.5rem'
                  }}>
                    State
                  </label>
                  <input
                    type="text"
                    name="shippingAddress.state"
                    value={formData.shippingAddress.state}
                    onChange={handleChange}
                    disabled={!isEditing}
                    style={{
                      width: '100%',
                      padding: '0.875rem 1rem',
                      borderRadius: 12,
                      border: isEditing ? '2px solid #3b82f6' : '2px solid #e5e7eb',
                      fontSize: '1rem',
                      outline: 'none',
                      transition: 'all 0.2s',
                      boxSizing: 'border-box',
                      backgroundColor: isEditing ? '#fff' : '#f9fafb',
                      cursor: isEditing ? 'text' : 'not-allowed',
                      color: '#000'
                    }}
                    onFocus={(e) => isEditing && (e.target.style.borderColor = '#1a2640')}
                    onBlur={(e) => e.target.style.borderColor = '#e5e7eb'}
                    placeholder="Enter shipping state"
                  />
                </div>

                <div style={{ marginBottom: '1.5rem' }}>
                  <label style={{
                    display: 'block',
                    fontWeight: 600,
                    color: '#1a2640',
                    fontSize: '0.9rem',
                    marginBottom: '0.5rem'
                  }}>
                    ZIP Code
                  </label>
                  <input
                    type="text"
                    name="shippingAddress.zipCode"
                    value={formData.shippingAddress.zipCode}
                    onChange={handleChange}
                    disabled={!isEditing}
                    style={{
                      width: '100%',
                      padding: '0.875rem 1rem',
                      borderRadius: 12,
                      border: isEditing ? '2px solid #3b82f6' : '2px solid #e5e7eb',
                      fontSize: '1rem',
                      outline: 'none',
                      transition: 'all 0.2s',
                      boxSizing: 'border-box',
                      backgroundColor: isEditing ? '#fff' : '#f9fafb',
                      cursor: isEditing ? 'text' : 'not-allowed',
                      color: '#000'
                    }}
                    onFocus={(e) => isEditing && (e.target.style.borderColor = '#1a2640')}
                    onBlur={(e) => e.target.style.borderColor = '#e5e7eb'}
                    placeholder="Enter shipping ZIP code"
                  />
                </div>

                <div style={{ marginBottom: '1.5rem' }}>
                  <label style={{
                    display: 'block',
                    fontWeight: 600,
                    color: '#1a2640',
                    fontSize: '0.9rem',
                    marginBottom: '0.5rem'
                  }}>
                    Country
                  </label>
                  <input
                    type="text"
                    name="shippingAddress.country"
                    value={formData.shippingAddress.country}
                    onChange={handleChange}
                    disabled={!isEditing}
                    style={{
                      width: '100%',
                      padding: '0.875rem 1rem',
                      borderRadius: 12,
                      border: isEditing ? '2px solid #3b82f6' : '2px solid #e5e7eb',
                      fontSize: '1rem',
                      outline: 'none',
                      transition: 'all 0.2s',
                      boxSizing: 'border-box',
                      backgroundColor: isEditing ? '#fff' : '#f9fafb',
                      cursor: isEditing ? 'text' : 'not-allowed',
                      color: '#000'
                    }}
                    onFocus={(e) => isEditing && (e.target.style.borderColor = '#1a2640')}
                    onBlur={(e) => e.target.style.borderColor = '#e5e7eb'}
                    placeholder="Enter shipping country"
                  />
                </div>
              </div>

              {/* Billing Address */}
              <div style={{
                background: '#fff',
                borderRadius: 16,
                padding: '2rem',
                boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
                border: '1px solid #e5e7eb'
              }}>
                <h3 style={{
                  color: '#1a2640',
                  fontSize: '1.25rem',
                  fontWeight: 700,
                  marginBottom: '1rem',
                  borderBottom: '2px solid #e5e7eb',
                  paddingBottom: '0.5rem'
                }}>
                  💳 Billing Address
                </h3>

                <div style={{ marginBottom: '1.5rem' }}>
                  <label style={{
                    display: 'block',
                    fontWeight: 600,
                    color: '#1a2640',
                    fontSize: '0.9rem',
                    marginBottom: '0.5rem'
                  }}>
                    Street Address
                  </label>
                  <input
                    type="text"
                    name="billingAddress.street"
                    value={formData.billingAddress.street}
                    onChange={handleChange}
                    disabled={!isEditing}
                    style={{
                      width: '100%',
                      padding: '0.875rem 1rem',
                      borderRadius: 12,
                      border: isEditing ? '2px solid #3b82f6' : '2px solid #e5e7eb',
                      fontSize: '1rem',
                      outline: 'none',
                      transition: 'all 0.2s',
                      boxSizing: 'border-box',
                      backgroundColor: isEditing ? '#fff' : '#f9fafb',
                      cursor: isEditing ? 'text' : 'not-allowed',
                      color: '#000'
                    }}
                    onFocus={(e) => isEditing && (e.target.style.borderColor = '#1a2640')}
                    onBlur={(e) => e.target.style.borderColor = '#e5e7eb'}
                    placeholder="Enter billing street address"
                  />
                </div>

                <div style={{ marginBottom: '1.5rem' }}>
                  <label style={{
                    display: 'block',
                    fontWeight: 600,
                    color: '#1a2640',
                    fontSize: '0.9rem',
                    marginBottom: '0.5rem'
                  }}>
                    City
                  </label>
                  <input
                    type="text"
                    name="billingAddress.city"
                    value={formData.billingAddress.city}
                    onChange={handleChange}
                    disabled={!isEditing}
                    style={{
                      width: '100%',
                      padding: '0.875rem 1rem',
                      borderRadius: 12,
                      border: isEditing ? '2px solid #3b82f6' : '2px solid #e5e7eb',
                      fontSize: '1rem',
                      outline: 'none',
                      transition: 'all 0.2s',
                      boxSizing: 'border-box',
                      backgroundColor: isEditing ? '#fff' : '#f9fafb',
                      cursor: isEditing ? 'text' : 'not-allowed',
                      color: '#000'
                    }}
                    onFocus={(e) => isEditing && (e.target.style.borderColor = '#1a2640')}
                    onBlur={(e) => e.target.style.borderColor = '#e5e7eb'}
                    placeholder="Enter billing city"
                  />
                </div>

                <div style={{ marginBottom: '1.5rem' }}>
                  <label style={{
                    display: 'block',
                    fontWeight: 600,
                    color: '#1a2640',
                    fontSize: '0.9rem',
                    marginBottom: '0.5rem'
                  }}>
                    State
                  </label>
                  <input
                    type="text"
                    name="billingAddress.state"
                    value={formData.billingAddress.state}
                    onChange={handleChange}
                    disabled={!isEditing}
                    style={{
                      width: '100%',
                      padding: '0.875rem 1rem',
                      borderRadius: 12,
                      border: isEditing ? '2px solid #3b82f6' : '2px solid #e5e7eb',
                      fontSize: '1rem',
                      outline: 'none',
                      transition: 'all 0.2s',
                      boxSizing: 'border-box',
                      backgroundColor: isEditing ? '#fff' : '#f9fafb',
                      cursor: isEditing ? 'text' : 'not-allowed',
                      color: '#000'
                    }}
                    onFocus={(e) => isEditing && (e.target.style.borderColor = '#1a2640')}
                    onBlur={(e) => e.target.style.borderColor = '#e5e7eb'}
                    placeholder="Enter billing state"
                  />
                </div>

                <div style={{ marginBottom: '1.5rem' }}>
                  <label style={{
                    display: 'block',
                    fontWeight: 600,
                    color: '#1a2640',
                    fontSize: '0.9rem',
                    marginBottom: '0.5rem'
                  }}>
                    ZIP Code
                  </label>
                  <input
                    type="text"
                    name="billingAddress.zipCode"
                    value={formData.billingAddress.zipCode}
                    onChange={handleChange}
                    disabled={!isEditing}
                    style={{
                      width: '100%',
                      padding: '0.875rem 1rem',
                      borderRadius: 12,
                      border: isEditing ? '2px solid #3b82f6' : '2px solid #e5e7eb',
                      fontSize: '1rem',
                      outline: 'none',
                      transition: 'all 0.2s',
                      boxSizing: 'border-box',
                      backgroundColor: isEditing ? '#fff' : '#f9fafb',
                      cursor: isEditing ? 'text' : 'not-allowed',
                      color: '#000'
                    }}
                    onFocus={(e) => isEditing && (e.target.style.borderColor = '#1a2640')}
                    onBlur={(e) => e.target.style.borderColor = '#e5e7eb'}
                    placeholder="Enter billing ZIP code"
                  />
                </div>

                <div style={{ marginBottom: '1.5rem' }}>
                  <label style={{
                    display: 'block',
                    fontWeight: 600,
                    color: '#1a2640',
                    fontSize: '0.9rem',
                    marginBottom: '0.5rem'
                  }}>
                    Country
                  </label>
                  <input
                    type="text"
                    name="billingAddress.country"
                    value={formData.billingAddress.country}
                    onChange={handleChange}
                    disabled={!isEditing}
                    style={{
                      width: '100%',
                      padding: '0.875rem 1rem',
                      borderRadius: 12,
                      border: isEditing ? '2px solid #3b82f6' : '2px solid #e5e7eb',
                      fontSize: '1rem',
                      outline: 'none',
                      transition: 'all 0.2s',
                      boxSizing: 'border-box',
                      backgroundColor: isEditing ? '#fff' : '#f9fafb',
                      cursor: isEditing ? 'text' : 'not-allowed',
                      color: '#000'
                    }}
                    onFocus={(e) => isEditing && (e.target.style.borderColor = '#1a2640')}
                    onBlur={(e) => e.target.style.borderColor = '#e5e7eb'}
                    placeholder="Enter billing country"
                  />
                </div>
              </div>
            </div>

            {/* Action Buttons - Only show when editing */}
            {isEditing && (
              <div style={{
                display: 'flex',
                gap: '1rem',
                justifyContent: 'center',
                flexWrap: 'wrap',
                marginTop: '2rem',
                padding: '2rem',
                background: '#f8f9fa',
                borderRadius: 16,
                border: '1px solid #e5e7eb'
              }}>
                <button
                  type="submit"
                  disabled={loading}
                  style={{
                    background: loading ? '#9ca3af' : '#1a2640',
                    color: '#fff',
                    padding: '0.875rem 2rem',
                    borderRadius: 12,
                    border: 'none',
                    fontWeight: 700,
                    fontSize: '1rem',
                    cursor: loading ? 'not-allowed' : 'pointer',
                    transition: 'all 0.2s',
                    boxShadow: '0 4px 16px rgba(26,38,64,0.2)'
                  }}
                  onMouseEnter={(e) => {
                    if (!loading) {
                      e.target.style.background = '#2d3748';
                      e.target.style.transform = 'translateY(-1px)';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!loading) {
                      e.target.style.background = '#1a2640';
                      e.target.style.transform = 'translateY(0)';
                    }
                  }}
                >
                  {loading ? 'Saving...' : 'Save Changes'}
                </button>
                <button
                  type="button"
                  onClick={handleCancel}
                  style={{
                    background: '#6b7280',
                    color: '#fff',
                    padding: '0.875rem 2rem',
                    borderRadius: 12,
                    border: 'none',
                    fontWeight: 700,
                    fontSize: '1rem',
                    cursor: 'pointer',
                    transition: 'all 0.2s'
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.background = '#4b5563';
                    e.target.style.transform = 'translateY(-1px)';
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.background = '#6b7280';
                    e.target.style.transform = 'translateY(0)';
                  }}
                >
                  Cancel
                </button>
              </div>
            )}
          </form>
        </div>

      </div>
    </div>
  );
};

export default Profile;
