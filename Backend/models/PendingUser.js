const mongoose = require('mongoose');

const pendingUserSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  email: { type: String, required: true, lowercase: true, trim: true },
  password: { type: String, required: true },
  phone: { type: String, trim: true },
  shippingAddress: { type: Object, default: {} },
  billingAddress: { type: Object, default: {} },
  verification: {
    code: { type: String, required: true },
    expiresAt: { type: Date, required: true },
    method: { type: String, enum: ['email', 'phone'], required: true }
  },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('PendingUser', pendingUserSchema);
