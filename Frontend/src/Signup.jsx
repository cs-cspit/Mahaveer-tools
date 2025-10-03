import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from './contexts/AuthContext';
import logo from './assets/logo.png';

const Signup = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [needsVerification, setNeedsVerification] = useState(false);
  const [verificationUserId, setVerificationUserId] = useState(null);
  const [verificationCode, setVerificationCode] = useState('');
  const [verifying, setVerifying] = useState(false);
  const [verificationMsg, setVerificationMsg] = useState('');
  const navigate = useNavigate();
  const location = useLocation();
  const { register, verifyCode, resendCode } = useAuth();
  const from = location.state?.from?.pathname || '/';

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Validation
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    setLoading(true);

    const result = await register({
      name: formData.name,
      email: formData.email,
      password: formData.password,
      phone: formData.phone
    });

    if (result.success) {
      navigate(from, { replace: true });
    } else if (result.needsVerification) {
      setNeedsVerification(true);
      setVerificationUserId(result.userId);
      setVerificationMsg(result.message || 'A verification code has been sent to your email.');
      // If verification is pending, automatically resend code
      if (result.message && result.message.toLowerCase().includes('pending')) {
        await handleResend();
      }
    } else {
      setError(result.error);
    }
    setLoading(false);
  };

  const handleVerify = async (e) => {
    e.preventDefault();
    setError('');
    setVerifying(true);
    const result = await verifyCode(verificationUserId, verificationCode);
    if (result.success) {
      navigate(from, { replace: true });
    } else {
      setError(result.error);
    }
    setVerifying(false);
  };

  const handleResend = async () => {
    setError('');
    setVerificationMsg('');
    const result = await resendCode(verificationUserId);
    if (result.success) {
      setVerificationMsg(result.message || 'Verification code resent to your email.');
    } else {
      setError(result.error);
    }
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

      {/* Signup Form Container */}
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
        maxWidth: 450,
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
            Create Account
          </h1>
          <p style={{
            color: '#6b7280',
            fontSize: '1rem',
            margin: 0
          }}>
            Join Mahaveer Tools today
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

        {!needsVerification ? (
          <form onSubmit={handleSubmit}>
            {/* ...existing code for registration form... */}
            <div style={{ marginBottom: '1.5rem' }}>
              <label style={{ display: 'block', fontWeight: 600, color: '#1a2640', fontSize: '0.9rem', marginBottom: '0.5rem' }}>Full Name</label>
              <input type="text" name="name" value={formData.name} onChange={handleChange} required style={{ width: '100%', padding: '0.875rem 1rem', borderRadius: 12, border: '1px solid #d1d5db', background: '#f8fafc', fontSize: '1rem', outline: 'none', transition: 'border-color 0.15s, box-shadow 0.15s', boxSizing: 'border-box', color: '#0f172a' }} placeholder="Enter your full name" />
            </div>
            {/* ...existing code for other fields... */}
            <div style={{ marginBottom: '1.5rem' }}>
              <label style={{ display: 'block', fontWeight: 600, color: '#1a2640', fontSize: '0.9rem', marginBottom: '0.5rem' }}>Email Address</label>
              <input type="email" name="email" value={formData.email} onChange={handleChange} required style={{ width: '100%', padding: '0.875rem 1rem', borderRadius: 12, border: '1px solid #d1d5db', background: '#f8fafc', fontSize: '1rem', outline: 'none', transition: 'border-color 0.15s, box-shadow 0.15s', boxSizing: 'border-box', color: '#0f172a' }} placeholder="Enter your email" />
            </div>
            <div style={{ marginBottom: '1.5rem' }}>
              <label style={{ display: 'block', fontWeight: 600, color: '#1a2640', fontSize: '0.9rem', marginBottom: '0.5rem' }}>Phone Number (Optional)</label>
              <input type="tel" name="phone" value={formData.phone} onChange={handleChange} style={{ width: '100%', padding: '0.875rem 1rem', borderRadius: 12, border: '1px solid #d1d5db', background: '#f8fafc', fontSize: '1rem', outline: 'none', transition: 'border-color 0.15s, box-shadow 0.15s', boxSizing: 'border-box', color: '#0f172a' }} placeholder="Enter your phone number" />
            </div>
            <div style={{ marginBottom: '1.5rem' }}>
              <label style={{ display: 'block', fontWeight: 600, color: '#1a2640', fontSize: '0.9rem', marginBottom: '0.5rem' }}>Password</label>
              <input type="password" name="password" value={formData.password} onChange={handleChange} required style={{ width: '100%', padding: '0.875rem 1rem', borderRadius: 12, border: '1px solid #d1d5db', background: '#f8fafc', fontSize: '1rem', outline: 'none', transition: 'border-color 0.15s, box-shadow 0.15s', boxSizing: 'border-box', color: '#0f172a' }} placeholder="Create a password" />
            </div>
            <div style={{ marginBottom: '1.5rem' }}>
              <label style={{ display: 'block', fontWeight: 600, color: '#1a2640', fontSize: '0.9rem', marginBottom: '0.5rem' }}>Confirm Password</label>
              <input type="password" name="confirmPassword" value={formData.confirmPassword} onChange={handleChange} required style={{ width: '100%', padding: '0.875rem 1rem', borderRadius: 12, border: '1px solid #d1d5db', background: '#f8fafc', fontSize: '1rem', outline: 'none', transition: 'border-color 0.15s, box-shadow 0.15s', boxSizing: 'border-box', color: '#0f172a' }} placeholder="Confirm your password" />
            </div>
            {error && (<div style={{ background: '#fef2f2', border: '1px solid #fecaca', color: '#dc2626', padding: '0.75rem 1rem', borderRadius: 8, fontSize: '0.9rem', marginBottom: '1.5rem', textAlign: 'center' }}>{error}</div>)}
            <button type="submit" disabled={loading} style={{ width: '100%', padding: '0.875rem 1rem', borderRadius: 12, background: loading ? '#9ca3af' : '#1a2640', color: '#fff', fontWeight: 700, fontSize: '1rem', border: 'none', cursor: loading ? 'not-allowed' : 'pointer', transition: 'all 0.2s', marginBottom: '1.5rem', boxShadow: '0 4px 16px rgba(26,38,64,0.2)' }} onMouseEnter={(e) => { if (!loading) { e.target.style.background = '#2d3748'; e.target.style.transform = 'translateY(-1px)'; } }} onMouseLeave={(e) => { if (!loading) { e.target.style.background = '#1a2640'; e.target.style.transform = 'translateY(0)'; } }}>{loading ? 'Creating Account...' : 'Create Account'}</button>
          </form>
        ) : (
          <form onSubmit={handleVerify}>
            <div style={{ marginBottom: '1.5rem', textAlign: 'center', color: '#1a2640', fontWeight: 600 }}>
              {verificationMsg || 'A verification code has been sent to your email.'}
            </div>
            <input type="text" value={verificationCode} onChange={e => setVerificationCode(e.target.value)} required style={{ width: '100%', padding: '0.875rem 1rem', borderRadius: 12, border: '1px solid #d1d5db', background: '#f8fafc', fontSize: '1rem', outline: 'none', marginBottom: '1.5rem', color: '#0f172a' }} placeholder="Enter verification code" />
            <button type="submit" disabled={verifying} style={{ width: '100%', padding: '0.875rem 1rem', borderRadius: 12, background: verifying ? '#9ca3af' : '#1a2640', color: '#fff', fontWeight: 700, fontSize: '1rem', border: 'none', cursor: verifying ? 'not-allowed' : 'pointer', transition: 'all 0.2s', marginBottom: '1.5rem', boxShadow: '0 4px 16px rgba(26,38,64,0.2)' }}>{verifying ? 'Verifying...' : 'Verify Account'}</button>
            <button type="button" onClick={handleResend} style={{ width: '100%', padding: '0.875rem 1rem', borderRadius: 12, background: '#e5e7eb', color: '#1a2640', fontWeight: 700, fontSize: '1rem', border: 'none', cursor: 'pointer', marginBottom: '1.5rem', boxShadow: '0 2px 8px rgba(26,38,64,0.08)' }}>Resend Code</button>
          </form>
        )}

        {/* Sign In Link */}
        <div style={{ textAlign: 'center' }}>
          <p style={{
            color: '#6b7280',
            fontSize: '0.9rem',
            margin: '0 0 0.5rem 0'
          }}>
            Already have an account?
          </p>
          <Link
            to="/login"
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
            Sign in here
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

export default Signup;
