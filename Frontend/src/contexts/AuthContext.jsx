import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is logged in on app start
    const token = localStorage.getItem('authToken');
    const userData = localStorage.getItem('user');

    if (token && userData) {
      try {
        setUser(JSON.parse(userData));
      } catch (error) {
        console.error('Error parsing user data:', error);
        localStorage.removeItem('authToken');
        localStorage.removeItem('user');
      }
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    try {
      console.log('Attempting to login user:', email);
  const response = await fetch('https://mahaveer-tools.onrender.com/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      console.log('Login response status:', response.status);
      const data = await response.json();
      console.log('Login response data:', data);

      if (response.ok) {
        localStorage.setItem('authToken', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));
        setUser(data.user);
        return { success: true };
      } else {
        return { success: false, error: data.error || 'Login failed' };
      }
    } catch (error) {
      console.error('Login error:', error);
      return { success: false, error: `Network error: ${error.message}. Please check if the backend server is running.` };
    }
  };

  const register = async (userData) => {
    try {
  const response = await fetch('https://mahaveer-tools.onrender.com/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...userData, verifyBy: 'email' }),
      });
      const data = await response.json();
      if (response.ok && data.token) {
        localStorage.setItem('authToken', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));
        setUser(data.user);
        return { success: true };
      } else if (data.message && data.userId) {
        // Verification required
        return { success: false, needsVerification: true, userId: data.userId, message: data.message };
      } else {
        return { success: false, error: data.error || 'Registration failed' };
      }
    } catch (error) {
      return { success: false, error: `Network error: ${error.message}` };
    }
  };

  const verifyCode = async (userId, code) => {
    try {
  const response = await fetch('https://mahaveer-tools.onrender.com/api/auth/verify-code', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, code }),
      });
      const data = await response.json();
      if (response.ok && data.token) {
        localStorage.setItem('authToken', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));
        setUser(data.user);
        return { success: true };
      } else {
        return { success: false, error: data.error || 'Verification failed' };
      }
    } catch (error) {
      return { success: false, error: `Network error: ${error.message}` };
    }
  };

  const resendCode = async (userId) => {
    try {
  const response = await fetch('https://mahaveer-tools.onrender.com/api/auth/resend-code', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId }),
      });
      const data = await response.json();
      if (response.ok) {
        return { success: true, message: data.message };
      } else {
        return { success: false, error: data.error || 'Resend failed' };
      }
    } catch (error) {
      return { success: false, error: `Network error: ${error.message}` };
    }
  };

  const logout = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('user');
    setUser(null);
  };

  const updateUser = (updatedUser) => {
    setUser(updatedUser);
    localStorage.setItem('user', JSON.stringify(updatedUser));
  };

  const isAuthenticated = () => {
    return !!user;
  };

  const getAuthToken = () => {
    return localStorage.getItem('authToken');
  };

  const fetchUserProfile = async () => {
    try {
      const token = getAuthToken();
      if (!token) return { success: false, error: 'No token found' };
  const response = await fetch('https://mahaveer-tools.onrender.com/api/auth/profile', {
        method: 'GET',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await response.json();
      if (response.ok) {
        return { success: true, user: data.user };
      } else {
        return { success: false, error: data.error };
      }
    } catch (error) {
      return { success: false, error: 'Network error. Please try again.' };
    }
  };

  const value = {
    user,
    loading,
    login,
    register,
    verifyCode,
    resendCode,
    logout,
    updateUser,
    isAuthenticated,
    getAuthToken,
    fetchUserProfile
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

