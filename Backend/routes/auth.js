const express = require('express');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const PendingUser = require('../models/PendingUser');
const router = express.Router();

// Google OAuth setup
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;

// JWT Secret (in production, use environment variable)
const JWT_SECRET = process.env.JWT_SECRET || 'mahaveer-tools-secret-key-2024';

// Generate JWT Token
const generateToken = (userId) => {
  return jwt.sign({ userId }, JWT_SECRET, { expiresIn: '7d' });
};

// Helpers for verification codes
const crypto = require('crypto');
const sendEmail = async (to, subject, text) => {
  // Try to send via nodemailer if configured, otherwise fallback to console.log
  try {
    const nodemailer = require('nodemailer');
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST || 'smtp.ethereal.email',
      port: process.env.SMTP_PORT ? parseInt(process.env.SMTP_PORT) : 587,
      secure: false,
      auth: process.env.SMTP_USER ? {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS
      } : undefined
    });

    const info = await transporter.sendMail({
      from: process.env.SMTP_FROM || 'no-reply@mahaveertools.local',
      to,
      subject,
      text
    });
    console.log('Verification email sent:', info.messageId || info);
  } catch (err) {
    console.log('nodemailer not configured or failed, fallback log:', { to, subject, text });
  }
};

const generateVerificationCode = () => {
  return Math.floor(100000 + Math.random() * 900000).toString(); // 6-digit code
};

// Google OAuth Strategy
passport.use(new GoogleStrategy({
  clientID: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  callbackURL: process.env.GOOGLE_CALLBACK_URL
}, async (accessToken, refreshToken, profile, done) => {
  try {
    // Find or create user
    let user = await User.findOne({ email: profile.emails[0].value });
    if (!user) {
      user = new User({
        name: profile.displayName,
        email: profile.emails[0].value,
        password: crypto.randomBytes(16).toString('hex'), // random password
        isVerified: true,
        verifiedAt: new Date(),
        role: 'user'
      });
      await user.save();
    }
    return done(null, user);
  } catch (err) {
    return done(err, null);
  }
}));

// Middleware to verify JWT token
const authenticateToken = async (req, res, next) => {
  try {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
      return res.status(401).json({ error: 'Access token required' });
    }

    const decoded = jwt.verify(token, JWT_SECRET);
    const user = await User.findById(decoded.userId).select('-password');
    
    if (!user) {
      return res.status(401).json({ error: 'Invalid user' });
    }

    req.user = user;
    next();
  } catch (error) {
    return res.status(403).json({ error: 'Invalid token' });
  }
};

// Register new user
router.post('/register', async (req, res) => {
  try {
    const { name, email, password, phone, address, verifyBy } = req.body;

    // Validation: name and password required; at least one of email or phone is required
    if (!name || !password || (!email && !phone)) {
      return res.status(400).json({ error: 'Name, password and either email or phone are required' });
    }

    if (password.length < 6) {
      return res.status(400).json({ error: 'Password must be at least 6 characters' });
    }

    // Check for existing by email or phone in User and PendingUser
    if (email) {
      const existingEmail = await User.findOne({ email: email.toLowerCase().trim() });
      const pendingEmail = await PendingUser.findOne({ email: email.toLowerCase().trim() });
      if (existingEmail) return res.status(400).json({ error: 'User with this email already exists' });
      if (pendingEmail) {
        // If pending, return status so frontend can redirect to verification page
        return res.status(200).json({ needsVerification: true, userId: pendingEmail._id, message: 'Verification is pending for this email. Please enter the code sent to your email or resend code.' });
      }
    }
    if (phone) {
      const existingPhone = await User.findOne({ phone: phone.trim() });
      const pendingPhone = await PendingUser.findOne({ phone: phone.trim() });
      if (existingPhone) return res.status(400).json({ error: 'User with this phone already exists' });
      if (pendingPhone) {
        return res.status(200).json({ needsVerification: true, userId: pendingPhone._id, message: 'Verification is pending for this phone. Please enter the code sent or resend code.' });
      }
    }

    // If user wants verification (by email or phone), create code and set verification fields in PendingUser
    if ((verifyBy === 'email' && email) || (verifyBy === 'phone' && phone)) {
      const code = generateVerificationCode();
      const pendingUser = new PendingUser({
        name: name.trim(),
        email: email ? email.toLowerCase().trim() : undefined,
        password,
        phone: phone ? phone.trim() : undefined,
        shippingAddress: address || {},
        billingAddress: address || {},
        verification: {
          code,
          expiresAt: new Date(Date.now() + 1000 * 60 * 15),
          method: verifyBy
        }
      });
      await pendingUser.save();
      if (verifyBy === 'email' && email) {
        await sendEmail(email, 'Mahaveer Tools - Verification Code', `Your verification code is: ${code}`);
        return res.status(201).json({ message: 'Verification code sent to email', userId: pendingUser._id });
      }
      if (verifyBy === 'phone' && phone) {
        // In production: send SMS; here we return the code in response for testing
        return res.status(201).json({ message: 'Verification code generated for phone', userId: pendingUser._id, code });
      }
    }

    // If no verification requested, create User directly
    const user = new User({
      name: name.trim(),
      email: email ? email.toLowerCase().trim() : undefined,
      password,
      phone: phone ? phone.trim() : undefined,
      shippingAddress: address || {},
      billingAddress: address || {},
      role: email && email.toLowerCase().trim() === 'mahaveertools25@gmail.com' ? 'admin' : 'user',
      isVerified: true,
      verifiedAt: new Date()
    });
    await user.save();
    const token = generateToken(user._id);
    res.status(201).json({ message: 'User registered successfully', token, user: user.toJSON() });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ error: 'Registration failed', details: error.message });
  }
});

// Verify code endpoint
router.post('/verify-code', async (req, res) => {
  try {
    const { userId, code } = req.body;
    if (!userId || !code) return res.status(400).json({ error: 'userId and code are required' });

    // Find pending user
    const pendingUser = await PendingUser.findById(userId);
    if (!pendingUser || !pendingUser.verification) return res.status(400).json({ error: 'Invalid user or no verification pending' });

    if (pendingUser.verification.expiresAt < new Date()) {
      await PendingUser.findByIdAndDelete(userId);
      return res.status(400).json({ error: 'Verification code expired. Please register again.' });
    }
    if (pendingUser.verification.code !== code) return res.status(400).json({ error: 'Invalid verification code' });

    // Create real user
    const user = new User({
      name: pendingUser.name,
      email: pendingUser.email,
      password: pendingUser.password,
      phone: pendingUser.phone,
      shippingAddress: pendingUser.shippingAddress,
      billingAddress: pendingUser.billingAddress,
      role: pendingUser.email && pendingUser.email === 'mahaveertools25@gmail.com' ? 'admin' : 'user',
      isVerified: true,
      verifiedAt: new Date()
    });
    await user.save();
    await PendingUser.findByIdAndDelete(userId);
    const token = generateToken(user._id);
    res.json({ message: 'Verified successfully', token, user: user.toJSON() });
  } catch (err) {
    console.error('Verify code error:', err);
    res.status(500).json({ error: 'Verification failed' });
  }
});

// Resend code endpoint
router.post('/resend-code', async (req, res) => {
  try {
    const { userId } = req.body;
    if (!userId) return res.status(400).json({ error: 'userId is required' });
    const PendingUser = require('../models/PendingUser');
    const pendingUser = await PendingUser.findById(userId);
    if (!pendingUser || !pendingUser.verification) return res.status(400).json({ error: 'Invalid user or no verification pending' });

    // Generate new code and update
    const code = generateVerificationCode();
    pendingUser.verification.code = code;
    pendingUser.verification.expiresAt = new Date(Date.now() + 1000 * 60 * 15);
    await pendingUser.save();

    if (pendingUser.verification.method === 'email') {
      await sendEmail(pendingUser.email, 'Mahaveer Tools - Verification Code', `Your new verification code is: ${code}`);
      return res.json({ message: 'Verification code resent to email' });
    }
    if (pendingUser.verification.method === 'phone') {
      // In production: send SMS; here we return the code in response for testing
      return res.json({ message: 'Verification code resent for phone', code });
    }
    res.status(400).json({ error: 'Unknown verification method' });
  } catch (err) {
    console.error('Resend code error:', err);
    res.status(500).json({ error: 'Failed to resend code' });
  }
});

// Login user
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validation
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    // Find user
    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    // Optionally require verification before allowing login
    if (process.env.REQUIRE_VERIFICATION === '1' && !user.isVerified) {
      return res.status(401).json({ error: 'Please verify your account before logging in', needsVerification: true, userId: user._id });
    }

    // Verify password
    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    // Update last login
    user.lastLogin = new Date();
    await user.save();

    // Generate token
    const token = generateToken(user._id);

    res.json({
      message: 'Login successful',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        shippingAddress: user.shippingAddress,
        billingAddress: user.billingAddress,
        profilePic: user.profilePic,
        role: user.role
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Login failed', details: error.message });
  }
});

// Get current user (for OAuth callbacks)
router.get('/me', authenticateToken, async (req, res) => {
  try {
    res.json({
      user: {
        id: req.user._id,
        name: req.user.name,
        email: req.user.email,
        phone: req.user.phone,
        shippingAddress: req.user.shippingAddress,
        billingAddress: req.user.billingAddress,
        profilePic: req.user.profilePic,
        role: req.user.role
      }
    });
  } catch (error) {
    console.error('Get user error:', error);
    res.status(500).json({ error: 'Failed to get user' });
  }
});

// Get current user profile
router.get('/profile', authenticateToken, async (req, res) => {
  try {
    res.json({
      user: {
        id: req.user._id,
        name: req.user.name,
        email: req.user.email,
        phone: req.user.phone,
        shippingAddress: req.user.shippingAddress,
        billingAddress: req.user.billingAddress,
        profilePic: req.user.profilePic,
        role: req.user.role,
        createdAt: req.user.createdAt,
        lastLogin: req.user.lastLogin
      }
    });
  } catch (error) {
    console.error('Profile fetch error:', error);
    res.status(500).json({ error: 'Failed to fetch profile' });
  }
});

// Update user profile
router.put('/profile', authenticateToken, async (req, res) => {
  try {
    const { name, phone, shippingAddress, billingAddress, profilePic } = req.body;
    const updates = {};

    if (name) updates.name = name.trim();
    if (phone) updates.phone = phone.trim();
    if (shippingAddress) updates.shippingAddress = { ...req.user.shippingAddress, ...shippingAddress };
    if (billingAddress) updates.billingAddress = { ...req.user.billingAddress, ...billingAddress };
    if (profilePic) updates.profilePic = profilePic;

    const user = await User.findByIdAndUpdate(
      req.user._id,
      updates,
      { new: true, runValidators: true }
    ).select('-password');

    res.json({
      message: 'Profile updated successfully',
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        shippingAddress: user.shippingAddress,
        billingAddress: user.billingAddress,
        profilePic: user.profilePic,
        role: user.role
      }
    });
  } catch (error) {
    console.error('Profile update error:', error);
    res.status(500).json({ error: 'Failed to update profile', details: error.message });
  }
});

// Change password
router.put('/change-password', authenticateToken, async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({ error: 'Current password and new password are required' });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({ error: 'New password must be at least 6 characters' });
    }

    const user = await User.findById(req.user._id);
    
    // Verify current password
    const isCurrentPasswordValid = await user.comparePassword(currentPassword);
    if (!isCurrentPasswordValid) {
      return res.status(401).json({ error: 'Current password is incorrect' });
    }

    // Update password
    user.password = newPassword;
    await user.save();

    res.json({ message: 'Password changed successfully' });
  } catch (error) {
    console.error('Password change error:', error);
    res.status(500).json({ error: 'Failed to change password', details: error.message });
  }
});

// Verify token (for frontend to check if user is logged in)
router.get('/verify', authenticateToken, (req, res) => {
  res.json({
    valid: true,
    user: {
      id: req.user._id,
      name: req.user.name,
      email: req.user.email,
      phone: req.user.phone,
      shippingAddress: req.user.shippingAddress,
      billingAddress: req.user.billingAddress,
      profilePic: req.user.profilePic,
      role: req.user.role
    }
  });
});

// Logout (client-side token removal, but we can track it)
router.post('/logout', authenticateToken, (req, res) => {
  res.json({ message: 'Logged out successfully' });
});

// Admin migration route - to update existing admin user
router.post('/migrate-admin', async (req, res) => {
  try {
    const adminEmail = 'parikhhet91@gmail.com';
    const result = await User.findOneAndUpdate(
      { email: adminEmail },
      { role: 'admin' },
      { new: true }
    );
    
    if (result) {
      res.json({ message: 'Admin role updated successfully', user: result });
    } else {
      res.json({ message: 'No user found with admin email' });
    }
  } catch (error) {
    console.error('Admin migration error:', error);
    res.status(500).json({ error: 'Migration failed' });
  }
});

// Google OAuth routes
router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

router.get('/google/callback', 
  passport.authenticate('google', { failureRedirect: '/login', session: false }), 
  (req, res) => {
    // Generate JWT and send to frontend
    const token = generateToken(req.user._id);
    res.redirect(`${process.env.FRONTEND_URL || 'http://localhost:5173'}/login?token=${token}`);
  }
);

module.exports = { router, authenticateToken };
