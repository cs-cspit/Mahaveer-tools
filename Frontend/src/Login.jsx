import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from './contexts/AuthContext';
import logo from './assets/logo.png';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { login, updateUser } = useAuth();

  // Get the intended destination from location state, default to home
  const from = location.state?.from?.pathname || '/';

  // Handle Google OAuth callback
  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const token = searchParams.get('token');
    
    if (token) {
      // Store token and redirect
      localStorage.setItem('authToken', token);
      // Fetch user data with the token
      fetch('https://mahaveer-tools.onrender.com/api/auth/me', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
        .then(res => res.json())
        .then(data => {
          if (data.user) {
            localStorage.setItem('user', JSON.stringify(data.user));
            updateUser(data.user); // Update context immediately
            navigate(from, { replace: true });
          } else {
            setError('Failed to get user information');
          }
        })
        .catch(err => {
          console.error('Error fetching user:', err);
          setError('Authentication failed');
        });
    }
  }, [location.search, navigate, from]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const result = await login(email, password);
    
    if (result.success) {
      // Redirect to intended page or home
      navigate(from, { replace: true });
    } else {
      setError(result.error);
    }
    
    setLoading(false);
  };

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      background: 'linear-gradient(135deg, #1a2640 0%, #2d3748 50%, #4a5568 100%)',
    }}>
      {/* Custom Header */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '2rem 1rem',
        background: 'rgba(255, 255, 255, 0.1)',
        backdropFilter: 'blur(10px)',
        borderBottom: '1px solid rgba(255, 255, 255, 0.1)'
      }}>
        <img src={logo} alt="Mahaveer Tools" style={{
          width: 50,
          height: 50,
          marginRight: '1rem',
          borderRadius: '50%',
          objectFit: 'cover'
        }} />
        <h1 style={{
          color: '#fff',
          fontSize: '2rem',
          fontWeight: 800,
          margin: 0,
          textShadow: '0 2px 4px rgba(0,0,0,0.3)'
        }}>
          Mahaveer Tools
        </h1>
      </div>

      {/* Login Form Container */}
      <div style={{
        flex: 1,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '2rem 1rem'
      }}>
      <div style={{
        background: '#fff',
        borderRadius: 20,
        boxShadow: '0 20px 60px rgba(0,0,0,0.3)',
        padding: '3rem 2.5rem',
        width: '100%',
        maxWidth: 420,
        position: 'relative'
      }}>
        {/* Logo */}
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          marginBottom: '2rem'
        }}>
          <img src={logo} alt="Mahaveer Tools" style={{
            width: 80,
            height: 80,
            borderRadius: '50%',
            objectFit: 'cover',
            boxShadow: '0 8px 32px rgba(26,38,64,0.2)'
          }} />
        </div>

        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <h1 style={{
            fontSize: '2rem',
            fontWeight: 800,
            color: '#1a2640',
            margin: '0 0 0.5rem 0'
          }}>
            Welcome Back
          </h1>
          <p style={{
            color: '#6b7280',
            fontSize: '1rem',
            margin: 0
          }}>
            Sign in to your account
          </p>
        </div>

        {/* Google Sign-In Button */}
        <button
          type="button"
          style={{
            width: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: '#fff',
            color: '#333',
            border: '1px solid #d1d5db',
            borderRadius: 12,
            padding: '0.875rem 1rem',
            fontWeight: 600,
            fontSize: '1rem',
            cursor: 'pointer',
            marginBottom: '1.5rem',
            transition: 'all 0.2s',
            boxShadow: '0 2px 8px rgba(0,0,0,0.08)'
          }}
          onClick={() => {
            window.location.href = 'https://mahaveer-tools.onrender.com/api/auth/google';
          }}
          onMouseEnter={(e) => {
            e.target.style.background = '#f8fafc';
            e.target.style.boxShadow = '0 4px 12px rgba(0,0,0,0.12)';
          }}
          onMouseLeave={(e) => {
            e.target.style.background = '#fff';
            e.target.style.boxShadow = '0 2px 8px rgba(0,0,0,0.08)';
          }}
        >
          <img 
            src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" 
            alt="Google" 
            style={{ width: 20, height: 20, marginRight: 12 }} 
          />
          Continue with Google
        </button>

        {/* Divider */}
        <div style={{ display: 'flex', alignItems: 'center', marginBottom: '1.5rem' }}>
          <div style={{ flex: 1, height: '1px', background: '#e5e7eb' }} />
          <span style={{ padding: '0 1rem', color: '#6b7280', fontSize: '0.875rem', fontWeight: 500 }}>OR</span>
          <div style={{ flex: 1, height: '1px', background: '#e5e7eb' }} />
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit}>
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
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              style={{
                width: '100%',
                padding: '0.875rem 1rem',
                borderRadius: 12,
                border: '1px solid #d1d5db',
                background: '#f8fafc',
                fontSize: '1rem',
                outline: 'none',
                transition: 'border-color 0.15s, box-shadow 0.15s',
                boxSizing: 'border-box',
                color: '#0f172a'
              }}
              onFocus={(e) => { e.target.style.borderColor = '#1a2640'; e.target.style.boxShadow = '0 4px 14px rgba(26,38,64,0.08)'; }}
              onBlur={(e) => { e.target.style.borderColor = '#d1d5db'; e.target.style.boxShadow = 'none'; }}
              placeholder="Enter your email"
              // placeholderColor not standard; ensure readable placeholders via CSS if desired
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
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              style={{
                width: '100%',
                padding: '0.875rem 1rem',
                borderRadius: 12,
                border: '1px solid #d1d5db',
                background: '#f8fafc',
                fontSize: '1rem',
                outline: 'none',
                transition: 'border-color 0.15s, box-shadow 0.15s',
                boxSizing: 'border-box',
                color: '#0f172a'
              }}
              onFocus={(e) => { e.target.style.borderColor = '#1a2640'; e.target.style.boxShadow = '0 4px 14px rgba(26,38,64,0.08)'; }}
              onBlur={(e) => { e.target.style.borderColor = '#d1d5db'; e.target.style.boxShadow = 'none'; }}
              placeholder="Enter your password"
            />
          </div>

          {error && (
            <div style={{
              background: '#fef2f2',
              border: '1px solid #fecaca',
              color: '#dc2626',
              padding: '0.75rem 1rem',
              borderRadius: 8,
              fontSize: '0.9rem',
              marginBottom: '1.5rem',
              textAlign: 'center'
            }}>
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            style={{
              width: '100%',
              padding: '0.875rem 1rem',
              borderRadius: 12,
              background: loading ? '#9ca3af' : '#1a2640',
              color: '#fff',
              fontWeight: 700,
              fontSize: '1rem',
              border: 'none',
              cursor: loading ? 'not-allowed' : 'pointer',
              transition: 'all 0.2s',
              marginBottom: '1.5rem',
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
            {loading ? 'Signing In...' : 'Sign In'}
          </button>
        </form>

        {/* Sign Up Link */}
        <div style={{ textAlign: 'center' }}>
          <p style={{
            color: '#6b7280',
            fontSize: '0.9rem',
            margin: '0 0 0.5rem 0'
          }}>
            Don't have an account?
          </p>
          <Link
            to="/signup"
            state={{ from: location.state?.from }}
            style={{
              color: '#1a2640',
              fontWeight: 600,
              textDecoration: 'none',
              fontSize: '0.9rem',
              transition: 'color 0.2s'
            }}
            onMouseEnter={(e) => e.target.style.color = '#2d3748'}
            onMouseLeave={(e) => e.target.style.color = '#1a2640'}
          >
            Create an account
          </Link>
        </div>

        {/* Back to Home */}
        <div style={{ textAlign: 'center', marginTop: '1.5rem' }}>
          <Link
            to="/"
            style={{
              color: '#6b7280',
              textDecoration: 'none',
              fontSize: '0.85rem',
              transition: 'color 0.2s'
            }}
            onMouseEnter={(e) => e.target.style.color = '#1a2640'}
            onMouseLeave={(e) => e.target.style.color = '#6b7280'}
          >
            ← Back to Home
          </Link>
        </div>
      </div>
      </div>
    </div>
  );
};

export default Login;
